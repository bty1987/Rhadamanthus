# A20251113Action SSO 单点登录接口说明文档（第三方接入）

> 模块: seiya (SSO 单点登录对接)
> 版本: 1.0
> 日期: 2026-09-04

---

## 一、模块概述

A20251113Action 是方林 ERP 接入**方林统一 SSO 平台**的落地实现，采用**授权码式（OAuth2-like）**流程：

1. 业务系统先向 SSO 平台申请一个**授权跳转地址**（`registAuthCode`）；
2. 浏览器跳到该地址，用户在 SSO 平台完成认证后，SSO 携带加密令牌 `ssoToken` 回调业务系统；
3. 业务系统拿 `ssoToken` 调 **`exchangeAuthCode` 换取 ERP 会话票据**（本文核心）；
4. 之后携带该票据访问 ERP 全部业务接口，或直接免登进入 ERP 页面。

本文面向两类第三方接入方：

| 接入姿势 | 适用场景 | 使用的接口 |
|---|---|---|
| **A. 复用 ERP 现成接口** | 已拿到 SSO 平台签发的 `ssoToken`，需要免登进 ERP 或以用户身份调用 ERP 接口 | `exchangeAuthCode`（+ `logoutAuthCode`） |
| **A+. 持平台 accessToken 直换** | 已在方林中台登录（如 view-decoration-pc），拿到平台 `accessToken` 但没有 ssoToken，需要以用户身份调 ERP 接口 | `exchangeAuthCodeForToken`（本文 3.6） |
| **B. 参照 ERP 实现自接 SSO 平台** | 第三方系统自己注册 clientId，直接对接 SSO 平台 | 参照本文第五章的协议与令牌格式 |

> ERP 自身注册在 SSO 平台的 clientId 固定为 `sso-erp-pc`，仅限 ERP 自己使用；第三方须在 SSO 平台申请独立 clientId。

---

## 二、架构总览

### 文件清单

| 文件 | 路径 | 说明 |
|------|------|------|
| Action | src/com/fanglin/seiya/action/A20251113Action.java | Struts2 控制器 |
| Service 接口 | src/com/fanglin/seiya/service/A20251113Service.java | 业务接口定义 |
| Service 实现 | src/com/fanglin/seiya/service/impl/A20251113ServiceImpl.java | 核心业务逻辑 |
| 令牌加解密 | src/com/fanglin/seiya/utils/CryptoUtils.java | ssoToken 的加密/解密格式 |
| 会话票据 | src/com/fanglin/core/vo/Authentication.java | ERP 会话票据结构 |
| 前端参考实现 | WebContent/js/dlogin.js + WebContent/redirect.html | ERP 登录页的完整调用样例 |

### 角色与地址

| 角色 | 说明 |
|---|---|
| SSO 平台（IdP） | 方林统一认证平台。地址由系统配置 `SSO_URL_STR` 决定：生产 `https://gateway.fanglin.vip`，测试 `https://daily-gateway.fanglin.vip` |
| ERP（SP） | 本系统（Rhadamanthus），clientId = `sso-erp-pc` |
| 第三方系统 | 本文读者 |

### 完整时序

```
第三方系统                ERP(/registAuthCode)         SSO平台                    ERP(/exchangeAuthCode)
    │  1.POST osstoken=回调地址  │                          │                          │
    │──────────────────────────>│ 拼授权URL(state=随机10位) │                          │
    │  2.302 浏览器跳转授权URL   │                          │                          │
    │<──────────────────────────│                          │                          │
    │  3.用户在SSO平台登录认证 ─────────────────────────────>│                          │
    │  4.302 回调 {回调地址}?ssoToken=xxx&state=xxx          │                          │
    │<───────────────────────────────────────────────────────│                          │
    │  5.POST osstoken=ssoToken ────────────────────────────────────────────────────────>│
    │  6.返回 ERP 会话票据(osstoken字段)                                                │
    │<──────────────────────────────────────────────────────────────────────────────────│
    │  7.携带票据调 ERP 业务接口 / 落 cookie 免登页面                                      │
```

---

## 三、接口详情

### 基础信息

| 项目 | 值 |
|------|-----|
| 基础URL | `http(s)://[ERP服务器地址]/` |
| 请求方式 | POST（`application/x-www-form-urlencoded`） |
| 响应格式 | JSON（Struts2 json result） |
| 认证要求 | **六个 SSO 接口均免登录**：已在 `communion.operation` 表注册 `through=1`（PASS 直通），调用时无需携带 `authentication` |

### 通用响应格式

```json
{
  "errorCode": 0,
  "errorMsg": "",
  "osstoken": "..."
}
```

`errorCode=0` 表示成功；业务数据统一放在 `osstoken` 字段返回（Action 属性复用，注意不同接口中该字段含义不同）。

---

### 3.1 获取授权跳转地址 - registAuthCode

**接口路径**: POST `/registAuthCode.do`

**功能说明**: 生成 SSO 平台的授权登录地址，调用方应让浏览器整页跳转到返回的 URL。

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| osstoken | String | 是 | **回调地址 redirectUri**（SSO 认证完成后携带 ssoToken 跳回该地址），须先在 SSO 平台登记白名单 |

#### 处理逻辑

- ERP 侧固定使用 clientId=`sso-erp-pc`（第三方请自建 clientId 直连 SSO 平台，见第五章）；
- 随机生成 10 位 `state` 防伪造；
- 返回拼好的授权地址：
  `{SSO_URL}/admin-api/user/auth/sso/token?clientId={clientId}&state={state}&redirectUri={URLEncode(回调地址,UTF-8)}`

#### 响应示例

```json
{
  "errorCode": 0,
  "osstoken": "https://gateway.fanglin.vip/admin-api/user/auth/sso/token?clientId=sso-erp-pc&state=a1b2c3d4e5&redirectUri=https%3A%2F%2Ferp.fanglin.vip%2F"
}
```

> ⚠️ 当前实现中 `state` 仅拼入 URL，ERP 回调后**未回验**（见第七章安全说明）。

---

### 3.2 SSO 回调与 ssoToken 结构

用户在 SSO 平台完成认证后，浏览器被重定向到：

```
{回调地址}?ssoToken={加密令牌}&state={原state}
```

`ssoToken` 是 SSO 平台用**共享密钥**（ERP 侧系统配置 `SSO_SECRET_STR`）按第五章令牌格式加密的 JSON：

```json
{
  "userId": null,
  "code": "FL-04147",                  // 方林工号（ERP 侧实际使用的字段）
  "token": "1e1a36c3b7994394825f52763f1ff512",  // SSO 会话 token，登出时需回传
  "expiresIn": 82693,                  // 令牌有效秒数
  "domain": ".fanglin.vip"
}
```

第三方**无需也无法**自行解密 `ssoToken`——解密验证由 ERP（或你自己实现的 SP）用共享密钥完成，你只需把回调地址上的 `ssoToken` 参数**原样**传给 `exchangeAuthCode`。

---

### 3.3 交换授权码换取 ERP 会话票据 - exchangeAuthCode（核心）

**接口路径**: POST `/exchangeAuthCode.do`

**功能说明**: 用 SSO 回调的 `ssoToken` 兑换一张 ERP 会话票据。票据即登录凭证，等于该用户在 ERP 登录成功。

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| osstoken | String | 是 | 回调 URL 中的 `ssoToken` 原文（URL decode 后的值） |

#### 处理逻辑（内部步骤）

1. 读取系统配置 `SSO_SECRET_STR`，按令牌格式解密 `ssoToken` 并做 HMAC 完整性校验；
2. 取明文中的 `code`（方林工号），查询 `communion.user` 表；
3. 校验用户存在且**在职**（`status=0`），否则抛 `110004`；
4. 构造会话明文（7 段逗号分隔）：
   `userId={工号},roleId={角色ID},userName={姓名},updateTime={当前毫秒},company={公司ID},timeout={0/1},rollcall={0/1}`
5. 用 ERP 内部密钥（`sysconfig.properties` 的 `encryptKey`/`encryptIv`）AES 加密后返回。

> 第三方拿到的票据是**密文**，无法（也无需）解出内容，原样使用即可。ERP 当前实现**未校验** `expiresIn`、未做已用 code 防重放，见第七章。

#### 响应示例

```json
{
  "errorCode": 0,
  "osstoken": "UxYq3...长串AES密文..."
}
```

#### 错误码

| errorCode | 含义 | 触发条件 |
|---|---|---|
| 0 | 成功 | — |
| 110004 | 该用户不能登陆系统 | 工号在 ERP 不存在，或用户已非在职状态 |
| 110000 | 系统繁忙,请稍后重试 | ssoToken 解密/HMAC 校验失败、`SSO_SECRET_STR` 未配置等异常 |

---

### 3.4 登出 - logoutAuthCode

**接口路径**: POST `/logoutAuthCode.do`

**功能说明**: 解密 `ssoToken` 取出 SSO 会话 `token`，重加密为 ticket 后调用 SSO 平台的 `check-token` 与 `logout` 接口注销 SSO 会话（clientId 仍为 `sso-erp-pc`）。

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| osstoken | String | 是 | 原始 ssoToken（登录时回调拿到的那份） |
| domain | String | 是 | 站点域（如 `http://192.168.5.21/`） |
| userId | String | 否 | 当前实现未使用 |

#### 响应示例

```json
{ "errorCode": 0, "errorMsg": "" }
```

---

### 3.5 企微扫码登录（附）- socialAuthCode / stateAuthCode

社交登录分支，走 SSO 平台 `socialType=29`（企业微信）：

- **socialAuthCode**: 参数 `domain`（回调页地址）。ERP 服务端请求 SSO 平台 `social-auth-redirect?redirectUri={domain}&socialType=29`，返回企微授权 URL（`osstoken` 字段）。
- **stateAuthCode**: 参数 `socialCode`/`socialState`。ERP 服务端调 SSO 平台 `social-login` 换取用户手机号，按手机号查 `communion.user`，命中则同样返回 ERP 会话票据；查不到手机号抛 `110032`。

第三方接入主链路（A/B 姿势）用不到这两个接口，此处仅作协议参考。

---

### 3.6 平台 accessToken 直换 ERP 会话票据 - exchangeAuthCodeForToken（A+ 姿势）

**接口路径**: POST `/exchangeAuthCodeForToken.do`

**功能说明**: 用方林中台（SSO 平台）的 `accessToken` 直接兑换一张 ERP 会话票据。适用于已在中台体系内登录的系统（如 view-decoration-pc），手上有 `accessToken` 但拿不到 ssoToken 的场景。

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| accessToken | String | 是 | 中台登录接口（`/user/auth/sso/login` 等）返回的 `accessToken` 原文 |
| userId | String | 是 | 中台平台用户ID（登录响应的 `userId`）。平台网关要求请求自报 `Login-User-Id` 头，ERP 服务端代带该头，故须由调用方透传 |

#### 处理逻辑（内部步骤）

1. ERP 服务端携带 `Authorization: Bearer {accessToken}` 与 `Login-User-Id: {userId}`（与中台前端 `setAuthHeaders` 同构）调 SSO 平台 `GET {SSO_URL}/admin-api/user/auth/get-permission-info`（与中台前端同一通路），由**平台侧校验令牌**并返回当前用户；
2. 从平台返回中取 `code`（工号）查询 `communion.user`；查不到时按 `phone` 兜底（与 `stateAuthCode` 同法）；
3. 校验用户存在且**在职**（`status=0`），否则抛 `110004`；
4. 与 `exchangeAuthCode` 完全相同地签发 ERP 会话票据（AES 密文）返回。

> 与 `exchangeAuthCode` 的区别：不需要 ssoToken、不依赖 `SSO_SECRET_STR`，信任锚点是平台对 accessToken 的校验。票据性质、有效期、权限范围与 `exchangeAuthCode` 完全一致。

#### 响应示例

```json
{
  "errorCode": 0,
  "osstoken": "UxYq3...长串AES密文..."
}
```

#### 错误码

| errorCode | 含义 | 触发条件 |
|---|---|---|
| 0 | 成功 | — |
| 110004 | 该用户不能登陆系统 | 工号/手机号在 ERP 无对应用户，或用户已非在职状态 |
| 110000 | 系统繁忙,请稍后重试 | accessToken/userId 为空、accessToken 无效或已过期（平台校验不过）、平台调用异常 |

#### operation 注册 SQL（幂等，随发版执行）

```sql
INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 1, '令牌授权码', 'exchangeAuthCodeForToken', 1, 1, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'exchangeAuthCodeForToken');
```

---

## 四、会话票据的使用方式

`exchangeAuthCode` 返回的票据（`osstoken` 字段）有两种用法：

### 4.1 浏览器免登进 ERP 页面（ERP 自身用法）

1. 跳转到 ERP 的落地页并带参：
   `{ERP地址}/redirect.html?authentication={票据}&osstoken={ssoToken}`
   > URL 传输会丢失 Base64 尾部 `=` padding，ERP 的 redirect.html 会自动补 `==`，第三方照抄该行为即可；
2. redirect.html 将票据写入 cookie：`authentication`（有效期 `config.timeout` 分钟）、`osstoken`、`loginTime`，随后自动进入 ERP 主页；
3. 此后浏览器对 ERP 的所有请求自动携带 cookie。

> 跨域场景下 cookie 必须落在 ERP 域名下，因此推荐"跳到 ERP 域下的 redirect.html 落地"而不是第三方页面自己 setCookie。

### 4.2 服务端/混调 ERP 业务接口

ERP 鉴权拦截器（AccessInterceptor）按以下顺序取票据：

1. 请求参数 `authentication={票据}`（优先）；
2. Cookie `authentication`。

示例：

```bash
curl -X POST "https://{ERP地址}/queryContract.do" \
     -d "authentication={exchangeAuthCode返回的票据}" \
     -d "...业务参数..."
```

票据性质：

- 有效期：默认 30 分钟无操作过期（`sysconfig.properties` 的 `cookieOvertime`，分钟），票据内 `timeout=1` 的账号不受超时限制；
- 权限范围：等同该用户正常登录，可访问的接口受其角色在 `operation`/`roletask` 体系中的授权约束（越权返回 `-2 无操作权限`，过期返回 `110005 登陆超时`）。

---

## 五、ssoToken 令牌格式规范（姿势 B 自接 SSO 平台时实现）

第三方自行对接 SSO 平台时，SSO 平台会为你的 clientId 签发同格式的令牌，你需按以下规范解密（与 ERP `CryptoUtils` 一致）：

**算法**: AES/CBC/PKCS5Padding + HMAC-SHA256（Encrypt-then-MAC）

**令牌构造**:

```
plaintext = JSON(SsoToken)
iv        = 随机 16 字节
ciphertext = AES-CBC(key, iv, plaintext)
mac       = HMAC-SHA256(key, iv || ciphertext)        // 32 字节
token     = Base64URLSafe( iv || ciphertext || mac )   // URL 安全 Base64，无 padding
```

**密钥**: SSO 平台分发，Base64 字符串；AES 加密与 HMAC 计算使用**同一组** key bytes（Base64 decode 后）。

**解密校验步骤**:

1. Base64 URLSafe 解码；
2. 尾部截 32 字节为 HMAC，其余为 `iv||ciphertext`（总长不足 16+32 直接判非法）；
3. 重算 HMAC 与收到值做常量时间比较，不一致判"数据被篡改"；
4. 取前 16 字节为 IV，AES-CBC 解密剩余部分，UTF-8 反序列化为 JSON。

**SsoToken 明文字段**:

| 字段 | 类型 | 说明 |
|---|---|---|
| code | String | 方林工号（ERP 侧以此定位用户） |
| userId | String | SSO 平台侧用户 ID |
| token | String | SSO 会话 token（登出回传用） |
| expiresIn | Integer | 有效秒数 |
| domain | String | SSO cookie 域 |

---

## 六、环境与配置（接入前检查）

| 配置项 | 位置 | 生产现状（2026-09-04 核查） |
|---|---|---|
| `SSO_URL_STR` | `communion.systemconfig`（company=0） | ✅ `https://gateway.fanglin.vip`；测试环境为 `https://daily-gateway.fanglin.vip` |
| `SSO_SECRET_STR` | `communion.systemconfig` | 🔴 **生产未配置**。缺失时 `exchangeAuthCode`/`logoutAuthCode` 解密必然失败，统一报 `110000`。接入前必须先补配（值向 SSO 平台获取，Base64 格式 AES 密钥） |
| 六个接口的免登放行 | `communion.operation.through=1` | ✅ 原五个生产已注册（status=0）；`exchangeAuthCodeForToken` 为新增，须执行 3.6 节注册 SQL |
| `encryptKey` / `encryptIv` / `cookieOvertime` | ERP `conf/sysconfig.properties` | ERP 内部会话加密与超时配置，第三方无需关心 |
| 前端 SSO 开关 | ERP 前端 `config.js` 的 `config.sso` | 打开后 ERP 登录页整页跳 SSO |

---

## 七、安全注意事项

1. **共享密钥保密**: `SSO_SECRET_STR` 是 ERP 与 SSO 平台的共享密钥，泄露即可伪造任意工号的 ssoToken。不得写入文档、前端代码或日志。
2. **票据即凭证**: `exchangeAuthCode` 返回的会话票据等同账号密码，只走 HTTPS，不在 URL 中留痕（落地页跳转后应尽快离开、避免被复制）。
3. **redirectUri 白名单**: 回调地址必须在 SSO 平台登记，防止令牌被诱导投递到攻击者站点。
4. **当前实现的已知弱点**（如实告知接入方）:
   - `state` 生成后未回验，未起到 CSRF 防护作用；
   - `ssoToken` 的 `expiresIn` 未校验、无一次性消费（防重放）机制，同一 ssoToken 在密钥不变期间可重复换票；
   - 接入方应在**自己**的回调处理中校验 `state`、限制 ssoToken 使用次数，敏感操作前重新认证。
5. **登出要成对**: 免登进 ERP 后，退出时应同时调用 `logoutAuthCode` 注销 SSO 会话并清除 `authentication` cookie，避免 SSO 侧会话残留。

---

## 八、快速接入示例（姿势 A）

```bash
# 1. 获取授权地址（回调地址换成你自己的，需先在 SSO 平台登记）
curl -X POST "https://{ERP地址}/registAuthCode.do" -d "osstoken=https://thirdparty.example.com/sso/callback"
# 返回 {"errorCode":0,"osstoken":"https://gateway.fanglin.vip/admin-api/user/auth/sso/token?..."}

# 2. 浏览器跳转到该地址，用户认证后被重定向回:
#    https://thirdparty.example.com/sso/callback?ssoToken=xxx&state=xxx

# 3. 换取 ERP 会话票据
curl -X POST "https://{ERP地址}/exchangeAuthCode.do" \
     --data-urlencode "osstoken={回调收到的ssoToken}"
# 返回 {"errorCode":0,"osstoken":"{ERP会话票据}"}

# 4a. 免登进 ERP 页面: 浏览器跳 {ERP地址}/redirect.html?authentication={票据}&osstoken={ssoToken}
# 4b. 服务端调 ERP 接口: 每个请求带参数 authentication={票据}

# 5. 登出
curl -X POST "https://{ERP地址}/logoutAuthCode.do" \
     --data-urlencode "osstoken={ssoToken}" \
     -d "domain=https://thirdparty.example.com/"
```

**Java 参考片段（解密 ssoToken，姿势 B）**:

```java
// secret: SSO 平台分发的 Base64 密钥; token: 回调收到的 ssoToken
SsoToken ssoToken = CryptoUtils.decryptFromToken(token, secret, SsoToken.class);
String userId = ssoToken.getCode();   // 方林工号
```

---

## 九、错误码汇总

| errorCode | 消息 | 场景 |
|---|---|---|
| 0 | 成功 | — |
| 110004 | 该用户不能登陆系统 | exchangeAuthCode: 工号不存在 / 非在职 |
| 110032 | SSO登录失败，未获取到用户手机号 | stateAuthCode: SSO 未返回手机号 |
| 110000 | 系统繁忙,请稍后重试 | 解密失败、SSO_SECRET_STR 缺失、SSO 平台调用异常等 |
| 110005 | 登陆超时 | 后续业务接口: 票据缺失/无效/过期 |
| -2 | 无操作权限 | 后续业务接口: 无该操作授权 |

---

## 十、相关代码索引

| 关注点 | 位置 |
|---|---|
| 接口路由 | src/com/fanglin/seiya/action/A20251113Action.java:45-83 |
| 换码核心逻辑 | src/com/fanglin/seiya/service/impl/A20251113ServiceImpl.java:77-109 |
| 令牌加解密 | src/com/fanglin/seiya/utils/CryptoUtils.java |
| 会话票据结构 | src/com/fanglin/core/vo/Authentication.java |
| 票据校验拦截器 | src/com/fanglin/core/interceptor/AccessInterceptor.java |
| 前端调用样例 | WebContent/js/dlogin.js:70-102（registAuthCode/exchangeAuthCode） |
| 票据落地页 | WebContent/redirect.html |
| 登录/认证类 Action 豁免说明 | AGENTS.md「Action 层异常处理规范」 |
