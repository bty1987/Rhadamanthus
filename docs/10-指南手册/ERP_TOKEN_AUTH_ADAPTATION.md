# ERP accessToken 直换 authentication 适配指南

> 涉及项目: **Rhadamanthus**(老 ERP, Java/Struts2) × **view-decoration-pc**(新中台前端, Vue3+TS)
> 交付物: `fanglin-seiya-8.3.028.024.jar` + view-decoration-pc 6 文件改动 + 1 条幂等 SQL
> 文档日期: 2026-09-25
> 关联文档: `docs/03-API文档/A20251113Action_SSO_API.md`(SSO 接口总文档, 本指南是其中 3.6 节的工程实施篇)

---

## 一、背景与目标

### 1.1 问题

view-decoration-pc 中有多个模块(decoration/quotation/sales/payment)需要调用**老 ERP 的 .do 接口**。老 ERP 鉴权体系(AccessInterceptor)认的是 `authentication` 参数——一段 AES 加密的会话票据(请求参数优先, cookie 兜底), 与中台体系的 `accessToken`(Bearer) 完全隔离。

此前 view-decoration-pc 的 `src/api/erp-auth.ts` 是占位实现: 所有用户共用一张**固定测试票据**(某人抓包所得), 生产不可用——身份错乱、越权、审计全部指向同一个人。

### 1.2 为什么不能走原有 exchangeAuthCode

老 ERP 已有的换票接口 `exchangeAuthCode.do` 入参是 **ssoToken**(SSO 平台用 `SSO_SECRET_STR` 密钥加密的令牌), 而中台登录(`POST /user/auth/sso/login`)返回的是 `accessToken`(平台 OAuth2 会话凭证)。**实测确认两者不是同一凭证**, 前者解不开后者(报 110000)。

且生产 `SSO_SECRET_STR` 未配置, ssoToken 链路短期走不通。

### 1.3 方案结论

在老 ERP 侧**新增接口 `exchangeAuthCodeForToken.do`**: 入参直接收中台 `accessToken`, ERP 服务端拿它调 SSO 平台现成的 `get-permission-info`(与中台前端同一通路, 平台侧完成令牌校验), 取工号反查 ERP 用户后签发票据。信任锚点是**平台侧对 accessToken 的校验**, 不依赖 `SSO_SECRET_STR`。

平台侧(fl-user)**零改动**。

```
view-decoration-pc          老ERP(seiya)                    SSO平台(fl-user)
      │  1.POST accessToken          │                               │
      │─────────────────────────────>│  2.GET get-permission-info    │
      │                              │  (Authorization: Bearer xxx)  │
      │                              │──────────────────────────────>│
      │                              │  3.返回 { code:工号, phone }   │
      │                              │<──────────────────────────────│
      │  4.返回 authentication 票据   │  4.工号→communion.user→在职校验→AES签发票据
      │<─────────────────────────────│                               │
      │  5.票据存 cookie, 后续 .do 请求全部带 authentication 参数       │
```

---

## 二、ERP 侧改动(Rhadamanthus / seiya 模块)

全部改动收敛在 seiya 模块内, 单 jar 交付(`fanglin-seiya-8.3.028.024.jar`, 同时含 A20260103Action ccid 传参改动, 属另一需求)。

### 2.1 A20251113Action.java

```java
// 新增字段 + 访问器
private String accessToken;

public String getAccessToken() { return accessToken; }
public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

// 新增 action(与 exchangeAuthCode 并列, 复用 osstoken 字段返回)
@Action(value = "exchangeAuthCodeForToken", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
public String exchangeAuthCodeForToken() throws FLException {
    osstoken = a20251113Service.exchangeAuthCodeForToken(accessToken);
    return SUCCESS;
}
```

### 2.2 A20251113Service.java

```java
public String exchangeAuthCodeForToken(String accessToken) throws FLException;
```

### 2.3 A20251113ServiceImpl.java(核心)

处理逻辑四步:

```java
@Override
public String exchangeAuthCodeForToken(String accessToken, String userId) throws FLException {
    // 1. accessToken 与 userId 均必填(空则 110000)
    // 2. 带 Authorization: Bearer {accessToken} + Login-User-Id: {userId} 两头
    //    GET {SSO_URL_STR}/admin-api/user/auth/get-permission-info
    //    🔴 Login-User-Id 是平台网关硬性要求(缺失报 {"code":400,"msg":"缺少请求Header: Login-User-Id"}),
    //       与中台前端 api/interceptor.ts setAuthHeaders 同构; userId(平台数字ID)由前端透传, ERP 无法自行取得
    //    响应 { code:0, data:{ code:"FL-xxxxx"(工号), phone:"...", ... } }
    //    code!=0 或平台 4xx/5xx → 110000
    // 3. data.code → userDao.queryUserByUserId(工号); 查不到按 data.phone 兜底
    //    userDao.queryUserByPhoneAIdent(phone, "-1")(与 stateAuthCode 同法)
    //    查无此人或 userPO.getStatus() != STATUS_ONJOB_INT → 110004
    // 4. buildAuthentication(userPO) 签发票据返回
}
```

两个抽出的私有方法(供三条换票路径复用):

| 方法 | 职责 | 说明 |
|---|---|---|
| `buildAuthentication(UserPO)` | 拼 7 段会话明文 → AES 加密 → 返回密文票据 | 原 exchangeAuthCode/stateAuthCode 内联逻辑上提, 三路共用 |
| `httpGetForAuthorization(url, token, userId)` | 带 `Authorization: Bearer` + `Login-User-Id` 头的 GET, 超时 5s, 非 200/异常返回 null | seiya 模块内私有实现; 头口径对齐中台前端 `setAuthHeaders` |

### 2.4 🔴 为什么不改 com.fanglin.utils.HttpUtil

HttpUtil 现有 `httpGet(url)` 不支持自定义 header。但**不能**给它加重载了事: 生产从未发过 `fanglin-utils` 独立 jar, utils 类的部署载体是 war 内 classes; 若把新 class 打进独立 jar 热替换, 会被 Tomcat 类加载优先级吞掉(旧 classes 仍生效), 而全量重发 war 的成本不成比例。因此 HTTP 调用实现在 seiya 模块内部(私有方法), 交付物收敛为一枚 seiya jar。

### 2.5 operation 注册 SQL(🔴 先于/随 jar 执行, 幂等)

新接口必须在 `communion.operation` 注册免登直通, 否则请求被拦截器拦下(无 authentication 可验):

```sql
INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 1, '令牌授权码', 'exchangeAuthCodeForToken', 1, 1, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'exchangeAuthCodeForToken');
```

口径对齐存量五个 SSO 接口(oid 332-336): moduleId=1 / through=1(PASS 直通) / type=1 / status=0。

### 2.6 错误码

| errorCode | 含义 | 触发条件 |
|---|---|---|
| 0 | 成功 | 返回 `osstoken` 字段即票据 |
| 110004 | 该用户不能登陆系统 | 工号/手机号在 communion.user 无对应用户, 或 status 非在职 |
| 110000 | 系统繁忙,请稍后重试 | accessToken 空/无效/过期(平台校验不过)、平台调用异常 |

---

## 三、view-decoration-pc 侧改动(6 文件)

### 3.1 src/api/erp-auth.ts(核心, 重写换票实现)

改造前后行为对照:

| | 改造前 | 改造后 |
|---|---|---|
| `fetchErpAuthentication` | 直接写死 ERP_AUTH_FIXED 占位 | POST `exchangeAuthCodeForToken.do` 真实换票, 票据落 cookie |
| 入参 | 形参占位不用 | `accessToken?` 可选, 不传自动 `getToken()`(中台 accessToken) |
| 固定票据回退 | 非生产环境全部兜底 | **仅 development** 回退(daily/生产必须真实换票) |
| 并发 | 无 | fetchingPromise 去重(登录钩子/路由守卫/过期重放同时触发只发一次) |

关键实现(换票请求实例与 erpAxios 同 baseURL 策略):

```ts
const erpAuthAxios = axios.create()
erpAuthAxios.defaults.baseURL = import.meta.env.MODE === 'development'
  ? '/erp-proxy/'                              // 走 vite proxy 免跨域
  : import.meta.env.VITE_ERP_API_BASE_URL      // daily/生产直连 ERP 域名
erpAuthAxios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

export async function fetchErpAuthentication(accessToken?: string): Promise<string> {
  const token = accessToken || getToken()      // getToken 来自 @/utils/auth(中台 accessToken)
  const userId = getUserId()                   // 平台数字 userId, 平台网关要求 Login-User-Id 头, ERP 代带须透传
  if (!token || !userId) throw new Error('[ERP Auth] ...')
  // 并发去重 fetchingPromise ...
  const form = new URLSearchParams()
  form.set('accessToken', token)
  form.set('userId', String(userId))
  const { data } = await erpAuthAxios.post('exchangeAuthCodeForToken.do', form.toString())
  if (data?.errorCode !== 0 || !data?.osstoken) throw new Error(`...${data?.errorCode} ${data?.errorMsg}`)
  setErpAuthentication(data.osstoken)          // 票据写 cookie, erpAxios 拦截器自动携带
  return data.osstoken
}
```

> 🔴 **userId 必传的根因**(2026-09-26 联调实测): 平台网关对 `get-permission-info` 要求请求自报 `Login-User-Id` 头, 缺失直接回 `{"msg":"缺少请求Header: Login-User-Id","code":400}`。该头口径来自中台前端 `src/api/interceptor.ts` 的 `setAuthHeaders`(与 `Org-Id` 一同注入), ERP 服务端模拟前端行为携带即可, **无需平台方改动**; 但平台 userId ERP 侧无从取得, 由前端 `getUserId()`(cookie)透传。

> 调用方零改动: `stores/modules/user/index.ts`(登录钩子)与各 `erp-setup.ts`(路由守卫)原样调 `fetchErpAuthentication(token)`, 入参可选化后两条路径天然兼容。

### 3.2 四份 erp-interceptor.ts: 110005 自动自愈

**改造前**: 收到 `errorCode: 110005`(票据默认 30 分钟闲置过期, `sysconfig.properties` 的 `cookieOvertime`)只弹"请刷新页面"——而刷新后 cookie 里还是旧票据, 路由守卫 `hasErpAuthentication()` 为 true 不会重换, 死循环。

**改造后**: 捕获 110005 → 用中台 accessToken 重换票据 → **重放原请求一次**(`__erpAuthRetried` 标记防循环) → 重换也失败才弹提示。

decoration/quotation/sales 三份完全相同(该拦截器返回完整 AxiosResponse):

```ts
if (res.errorCode === 110005) {
  if (!(response.config as any).__erpAuthRetried) {
    (response.config as any).__erpAuthRetried = true
    try {
      await fetchErpAuthentication()
      return erpAxios.request(response.config)        // 重放, 返回完整 response
    } catch (e) { console.warn('[erpAxios] ERP票据过期后重换失败:', e) }
  }
  Message.error({ content: 'ERP认证已过期, ...' })
  return Promise.reject(new Error(res.errorMsg || 'ERP认证已过期'))
}
```

### 3.3 payment 版拦截器的两处专属差异

payment 版拦截器与其他三份结构不同(返回 `res` 而非 response, 且带千位换算), 重放须单独处理:

1. **返回值解包**: 重放后 `return retried.data`(对齐该拦截器"返回 res"的约定);
2. **千倍转换防二次相乘**: 该拦截器对请求参数做 `×1000` 转换(ERP 金额以"毫"存储), 重放请求的 data 在首跑已转换过, 请求拦截器须跳过:

```ts
// 请求拦截器
if (endpoint && !(config as any).__erpAuthRetried && ...) {
  convertRequestThousandFields(config.data, endpoint)   // 重放时跳过, 防金额×1000两次
}
```

> ⚠️ 新增 ERP 调用模块时, 复制任意一份拦截器都要保留 `__erpAuthRetried` 语义; 带千倍转换的还须同步加请求侧跳过逻辑。

### 3.4 erp-setup.ts

仅注释口径更新(路由守卫懒初始化逻辑不变): 无票据 → `fetchErpAuthentication(getToken())` → 并发去重。

---

## 四、上线部署顺序(🔴 不可颠倒)

| 步骤 | 动作 | 说明 |
|---|---|---|
| 1 | 执行 operation SQL(2.5 节) | 幂等可重复; 先于 jar 或同批 |
| 2 | 部署 `fanglin-seiya-8.3.028.024.jar` | 热替换 Tomcat 下旧 seiya jar, 停服删尽旧版本防多版本并存 |
| 3 | 核对 ERP `SSO_URL_STR` | daily 环境须为 `https://daily-gateway.fanglin.vip`, 生产 `https://gateway.fanglin.vip`(已配)。**本接口不依赖 `SSO_SECRET_STR`** |
| 4 | 部署 view-decoration-pc(daily 先行) | 6 文件改动 |
| 5 | 联调验证(第五节清单) | |

## 五、测试验证清单

| # | 场景 | 操作 | 预期 |
|---|---|---|---|
| 1 | 正常换票 | 中台登录 → 进 decoration 模块触发守卫 | `/exchangeAuthCodeForToken.do` 返回 errorCode=0; 后续 .do 请求以**本人** ERP 身份执行 |
| 2 | 直调接口 | `curl -X POST "{ERP}/exchangeAuthCodeForToken.do" -d "accessToken=有效token"` | 返回 osstoken 票据 |
| 3 | 无效令牌 | 传伪造/过期 accessToken | errorCode=110000, ERP 日志可见平台拒绝 |
| 4 | 用户映射失败 | 用平台存在但 ERP 无对应用户的账号 | errorCode=110004 |
| 5 | 非在职 | ERP 侧 status≠0 的账号 | errorCode=110004 |
| 6 | 票据过期自愈 | 进入模块后闲置 >30 分钟再操作 | 首个请求 110005 → 自动重换 → 重放成功, 页面无感; 观察网络面板**只重放一次** |
| 7 | payment 千倍回归 | payment 模块触发过期重放的保存类操作 | 金额正确(未二次 ×1000) |
| 8 | dev 本地 | 本地 dev server 未登录中台 | 回退 ERP_AUTH_FIXED, 老 ERP 页面可调 |
| 9 | daily 无 jar 回归 | daily ERP 未发新 jar 时进模块 | 换票 404/110000, 明确报错不白屏 |

## 六、已知边界与安全注意

1. **工号映射依赖平台 `staff.code`**: 该字段由同步链路写入(源自 workCode), 绝大多数用户=ERP 工号; 个别多工号分组用户可能对不上, 落手机号兜底, 兜底也不中报 110004——首批联调选工号同步正常的账号。
2. **平台侧离职拦截双保险**: 非在职用户在 get-permission-info 平台侧即被拒(USR_RESIGNED), ERP 侧在职校验是第二道。
3. **票据与令牌的保管**: accessToken / authentication 票据均等同账号密码, 不落前端日志、不进 URL; 票据有效期=30 分钟闲置(ERP `cookieOvertime`), `timeout=1` 账号不受限。
4. **本接口免登直通**(operation through=1), 无 ERP 会话即可调——它本身就是发会话的入口; 安全性完全依赖平台对 accessToken 的校验, 不要把它当通用代理复用。
5. **ERP 票据与 exchangeAuthCode 完全同构**: 签发复用同一 `buildAuthentication`, 后续 ERP 侧对票据的任何调整(如加字段)两条链路天然一致。

## 七、改动文件清单(提交核对用)

**Rhadamanthus**(分支 master, 未提交):

```
src/com/fanglin/seiya/action/A20251113Action.java        # accessToken 字段 + 新 action
src/com/fanglin/seiya/service/A20251113Service.java      # 接口声明
src/com/fanglin/seiya/service/impl/A20251113ServiceImpl.java  # 实现 + 两个私有方法
docs/03-API文档/A20251113Action_SSO_API.md               # 3.6 节 + A+ 姿势
docs/10-指南手册/ERP_TOKEN_AUTH_ADAPTATION.md            # 本文档
target/fanglin-seiya-8.3.028.024.jar                     # 构建产物(同时含 A20260103 ccid 改动)
```

**view-decoration-pc**(未提交):

```
src/api/erp-auth.ts                                # 换票实现重写
src/views/decoration/shared/erp-interceptor.ts     # 110005 自愈
src/views/quotation/shared/erp-interceptor.ts      # 同上(三份相同)
src/views/sales/shared/erp-interceptor.ts          # 同上
src/views/payment/shared/erp-interceptor.ts        # 自愈 + 千倍转换防二次相乘
src/views/decoration/shared/erp-setup.ts           # 注释口径
```
