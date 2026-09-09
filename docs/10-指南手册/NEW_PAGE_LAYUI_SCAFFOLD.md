# 纯 LayUI 前端骨架（app/）开发规范

> 编制日期：2026-08-08
> 范围：`D:\ERP\Rhadamanthus\app/`（与 `WebContent/` 同级的全新目录）
> LayUI 版本：**2.13.8**（官方最新，全量包，单 `layui.js` 398KB）
> 配套评估：见 `docs/10-指南手册/FRONTEND_ACE_TO_LAYUI_FEASIBILITY.md`（方案 B 的 W3 落地物）

---

## 0. 这是什么

`app/` 是一套**全新的、纯 LayUI 的前端骨架**，目标是承接"新增页面一律走纯 LayUI、不再用 Ace/Bootstrap"的演进方向。它与旧前端 `WebContent/` **物理隔离、零代码重叠、零回归风险**：

- 新页面在 `app/` 内开发，只引 `layui.js` + `layui.css` + 本应用 JS。
- 旧前端 `WebContent/` 一行未改，继续用 Ace + layui 2.5.7，可长期并存。
- 两者调用**同一套 Struts2 后端接口**（`*.do`），后端零改动、业务逻辑零改动、无需重新测试后端。

最终理想形态：**登录页 / 首页只需引用 `layui.js` + `layui.css` 即可运行**，彻底摆脱 jQuery 2.0.3 / Ace / Bootstrap。

---

## 1. 目录结构

```
app/
├── layui/                      # LayUI 2.13.8 资源（全量包）
│   ├── layui.js                #   398KB，内置全部 17 个模块（table/form/layer/laypage/laydate/element/...）
│   ├── css/layui.css           #   132KB
│   └── font/                   #   图标字体（layui-icon 依赖，5 个文件）
│
├── css/app.css                 # 应用补丁样式（布局/品牌色/校验错误样式）
├── fanglin.ico
│
├── login.html                  # 登录页（仅引 layui + app）
├── index.html                  # 主框架外壳（layui-layout-admin + 动态菜单 + tab）
├── home.html                   # 默认首页 tab 内容
│
├── js/
│   ├── app/                    # 核心运行时（对应旧 js/com/）
│   │   ├── config.js           #   全局配置 + Cookie 工具（普通脚本，最早加载）
│   │   ├── server.js           #   内外网服务器地址初始化
│   │   ├── utils.js            #   精确算术 + 属性遍历（accMul/accDiv/accExtend/reduceProp）
│   │   ├── post.js             #   请求层（替代 com.post：authentication/错误码/防重/loading）
│   │   ├── api.js              #   API 定义载入器（同步加载 js/api/*.js）
│   │   ├── core.js             #   UI 层（focusPage/tab/菜单/面包屑/show*/工具，封装 layer/element）
│   │   ├── validate.js         #   表单校验（v_* 类机制，错误提示走 layer.tips，不依赖 bootstrap popover）
│   │   └── md5.js              #   独立 MD5（登录挑战-响应用，仅 login.html 引用）
│   ├── api/
│   │   └── _template.js        # 新模块 API 定义样板
│   ├── template/
│   │   ├── list.js             #   列表页逻辑模板
│   │   └── form.js             #   表单/详情页逻辑模板
│   ├── login.js                # 登录页逻辑
│   ├── index.js                # 外壳逻辑
│   └── home.js                 # 首页逻辑
│
└── views/
    └── template/
        ├── list.html           #   列表页模板
        └── form.html           #   表单/详情页模板
```

---

## 2. 架构与认证契约

### 2.1 认证流程（与旧 `WebContent/` 完全等价，后端零改动）

```
┌──────────┐  1.requestLoginChallenge.do (userId)        ┌──────────┐
│ login.html│ ────────────────────────────────────────────▶│          │
│           │ ◀──────────── 2.nonce ────────────────────────│          │
│           │  3.MD5(MD5(password)+nonce) → responseHash     │ 后端     │
│           │  4.doLogin.do {userId,password:MD5,verifyCode,│ Struts2  │
│           │              responseHash,securityCode}        │          │
│           │ ────────────────────────────────────────────▶│          │
│           │ ◀──────────── 5.authentication ───────────────│          │
│           │  6.setCookie("authentication",...)            │          │
└──────────┘                                                  └──────────┘
      │
      │ location → index.html
      ▼
┌──────────┐  queryUserForSelfByUserId.do {authentication}  ┌──────────┐
│ index.html│ ────────────────────────────────────────────▶│          │
│           │  queryModuleForLogin.do {"module.system":1}   │          │
│           │ ────────────────────────────────────────────▶│          │
│           │ ◀──────────── 菜单树 modules[] ───────────────│          │
└──────────┘                                                  └──────────┘
```

**关键约定**（已源码核实）：
- `authentication` 令牌存 **Cookie**，每个接口把它作为**表单字段**（`opts.authentication`）随 POST 发出——后端 `CommonInterceptor` 按此解析。
- `app.post`（`js/app/post.js`）自动从 Cookie 读取并注入，业务代码无感。
- 登录超时：`loginTime + config.timeout(120min)` 后跳登录页。

### 2.2 与旧 `com.*` 框架的对照

| 旧（`WebContent/`） | 新（`app/`） | 说明 |
|---|---|---|
| `com.post(api, opts, cb, fail, async)` | `app.post(api, opts, cb, fail, async)` | 签名/行为一致 |
| `com.focusPage('#id')` | `app.focusPage('#id')` | iframe 模式下作用域天然隔离 |
| `com.validate('formId')` | `app.validate('formId')` | 同为 `true=有错误`，类机制 `v_*` 一致 |
| `com.showAlert/Confirm/Loading` | `app.showAlert/Confirm/Loading` | 封装 layer |
| `com.popup4page/popup4model` | `app.popup/popupModel` | layer.open 封装 |
| `com.dateFormat/formatMoney` | `app.dateFormat/formatMoney` | |
| `$.fn.bindData` | `app.bindData($sel,list,key,val,all)` | 下拉填充 |
| `utils.accMul/accDiv` | `app.utils.accMul/accDiv` | 精确算术 |
| `Api().init('js/api/')` | `app.initApi('js/api/')` | 同步加载 api 定义 |
| `params.userInfo` | `app.params.userInfo` | 用户信息缓存 |
| Bootstrap `.modal` | `layer.open({type:1})` | 弹窗 |
| Bootstrap 栅格 `col-xs-*` | `layui-row` + `layui-col-md*` | 栅格 |
| Ace `icon-*` 图标 | `layui-icon-*` | 图标 |

> ⚠️ 旧 CLAUDE.md 里记载的 `com.getFormData` / `com.formatDate` / `com.refreshPage` / `com.getEnumText` / `Condition[module][field]` 等 API **实际不存在**（虚构），新骨架也未实现等价物——表单取值用 `$('#id').val()`，枚举走后端常量接口。

---

## 3. 后端契约（分页查询，已源码核实）

### 3.1 请求参数

```
paging.page=1            # 1-based 页码
paging.rows=10           # 每页条数
filters[0].field=name    # 过滤字段（实体属性名）
filters[0].data=张三     # 过滤值
filters[0].op=cn         # 操作符
filters[1].field=...
...
```

**`op` 取值**（来自 `GenericDaoImpl.getCriterion`）：
`eq`(默认) / `cn`(模糊) / `nc` / `lt` / `le` / `gt` / `ge` / `bw` / `ew` / `bn` / `en` / `ne` / `likecn` / `in` / `ni` / `and`

> 🔴 **无 `between`**。日期范围用 `ge`+`le` 两条 filter 实现（见 `list.js` 的 `buildFilters`）。

### 3.2 响应结构

```json
{
  "errorCode": 0,
  "errorMsg": "",
  "paging": {
    "page": 1,
    "rows": 10,
    "totalPage": 3,
    "totalRecords": 27,
    "data": [ { ... }, { ... } ]
  }
}
```

- 行数据路径：`paging.data`
- 总数路径：`paging.totalRecords`（laypage 的 `count`）

### 3.3 🔴 后端分页上限保护

`GenericDaoImpl.java` 有降级：`paging.page >= 60`（或 `rows > 10 且 page >= 30`）时**返回空 data**。
`list.js` 的 `renderPage` 已用 `Math.min(totalPage, 59)` 保护；自定义分页时务必同样处理。

### 3.4 文件上传组件（`app.upload`）

文件上传组件已封装为 `js/app/upload.js`（基于 layui upload，替代旧 `com.uploadify`/`huploadify`），对齐后端 `UploadAction` 契约：
- **URL**：`config.media + 'uploadImg.do'`（图片）/ `uploadOther.do`（其他文件）
- **fileObjName**：`strutsUploads`（Struts2 文件字段名，★ 勿改）
- **认证**：upload 的 data 里带 `authentication`（读 Cookie）
- **响应**：`{errorCode:0, resUrl:'https://...', fileInfo:{...}}`，成功取 `res.resUrl`

#### 使用前提
业务页 HTML 需在 bootstrap.js **之前**引入 upload.js：
```html
<script src="../../js/app/upload.js"></script>
<script src="../../js/app/bootstrap.js"></script>
```
bootstrap 已把 `uploadApp` 加入 `layui.use` 列表，`app.ready` 后即可用 `app.upload` / `app.uploadImage` / `app.uploadFile`。

#### API

```javascript
// 1. 图片上传（带 loading + 预览，最常用）
app.uploadImage({
    elem: '#pictureUpload',        // 上传按钮选择器
    done: function (res) {          // 成功回调，res.resUrl 是图片地址
        app.showImg($('#preview'), res.resUrl, 150, 150);
        $('#path').val(res.resUrl);
    },
    exts: 'jpg|png',                // 可选，限定后缀
    size: 5                         // 可选，大小上限 MB
});

// 2. 通用文件上传（非图片）
app.uploadFile({
    elem: '#fileUpload',
    url: 'uploadOther.do',          // 可选，默认 uploadImg.do
    exts: 'pdf|doc|xls',
    done: function (res) { /* res.resUrl */ }
});

// 3. 手动触发上传（选文件后点按钮才传）
var uploader = app.upload({
    elem: '#chooseBtn',
    auto: false,
    bindAction: '#submitBtn',
    done: function (res) { /* ... */ }
});
```

---

## 4. 新增业务页面 —— 四步接入

以新增一个"任务管理（mytask）"模块为例。

### Step 1：定义 API（复制 `js/api/_template.js`）

创建 `js/api/mytask.js`，全局替换 `template` → `mytask`：

```js
$.extend(api.index, {
    mytaskIndex:  { url: 'views/mytask/list.html' },
    mytaskDetail: { url: 'views/mytask/form.html' }
});

$.extend(api, { mytask: {
    pageMytask:   { url: 'pageMytask.do', demo: true },
    addMytask:    { url: 'addMytask.do',  type: 'update',
                    tranargs: { args: ['mytask.price'] },
                    validate: { 'mytask.name': { required: true } } },
    updateMytask: { url: 'updateMytask.do', type: 'update', tranargs: { args: ['mytask.price'] } },
    deleteMytask: { url: 'deleteMytask.do' }
}});
```

在 `js/app/api.js` 的 `defaults` 列表加入 `'mytask.js'`。

### Step 2：复制页面模板

```
cp views/template/list.html views/mytask/list.html
cp views/template/form.html views/mytask/form.html
cp js/template/list.js     js/mytask/list.js
cp js/template/form.js     js/mytask/form.js
```

把 4 个文件里的 `template` 全部替换为 `mytask`，调整字段名（`name`/`price`/`status` → 实际字段）。

### Step 3：调整列表字段

- `list.html`：搜索条字段（`name` 的 `data-op="cn"`、状态 `select`、日期范围）
- `list.js`：`cols` 列定义、`doSave` 里收集的表单字段、`buildFilters` 里的日期字段名

### Step 4：配置菜单

后端菜单表插入一条记录，`url` 填 `mytaskIndex`（对应 `api.index.mytaskIndex.url`）或直接 `views/mytask/list.html`。菜单 `level=1` 一级，`level=2` 二级，`children` 关联父子。

完成。登录后即可在左侧菜单看到"任务管理"，点击打开列表页，搜索/分页/增改删全部可用。

---

## 5. 强制约束（Code Review 清单）

### 5.1 资源引用

- 🔴 **新页面只引 `layui.js` + `layui.css` + `app/` 内 JS**，禁止引 `jquery-2.0.3` / `assets/ace/*` / `bootstrap` / `assets/altogether/*`。
- 🔴 业务页运行在 index.html 的 **iframe 内**，必须自带 layui 引用（各 tab iframe 独立运行）。模板已示范。

### 5.1.1 🔴 脚本加载顺序与 `app.ready`（首实例踩坑，务必遵守）

核心运行时分为两类，**加载方式不同**，顺序错了会静默失败（`app.post is not a function`）：

| 文件 | 类型 | 生效方式 |
|---|---|---|
| `config.js` / `server.js` / `utils.js` | 普通脚本 | `<script>` 加载即执行，立即挂 `window.app.*` |
| `post.js` / `api.js` / `core.js` / `validate.js` | **`layui.define` 模块** | 普通 `<script>` 加载**不执行**，必须经 `layui.use()` 触发 |

**业务页 HTML 末尾的脚本块必须按此顺序**（模板已示范，照抄）：

```html
<script src="../../layui/layui.js"></script>
<script src="../../js/app/config.js"></script>   <!-- 普通脚本，先加载 -->
<script src="../../js/app/server.js"></script>
<script src="../../js/app/utils.js"></script>
<script src="../../js/app/post.js"></script>     <!-- layui.define 模块，作为脚本加载无害但不执行 -->
<script src="../../js/app/api.js"></script>
<script src="../../js/app/core.js"></script>
<script src="../../js/app/validate.js"></script>
<script src="../../js/app/bootstrap.js"></script> <!-- 定义 app.ready，协调上面的模块 use -->
<script src="../../js/<module>/<page>.js"></script>
```

**业务 JS 必须用 `app.ready` 包裹**（确保 post/api/core/validate 已 use 执行）：

```js
app.ready(function () {
  layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    // ... 这里可以安全调用 app.post / api.xxx / app.validate / app.showAlert
  });
}); // end app.ready
```

> `app.ready`（`js/app/bootstrap.js`）内部 `layui.use(['post','apiLoader','core','validate'], ...)` 触发这四个模块，并调用 `app.initApi('js/api/')` 加载业务 API 定义，然后才执行回调。是幂等的，多次调用安全。

### 5.2 数据获取

- 🔴 一律用 `app.post(api.xxx, opts, cb)`，不要裸 `$.ajax`（否则丢 authentication、丢错误码处理、丢防重）。
- 🔴 金额/数量字段必须在 api 条目的 `tranargs` 声明（`type:'update'` 请求 ×1000，`type:'query'` 响应 ÷1000）；未声明的字段页面手动 `app.utils.accMul/accDiv`。

### 5.3 DOM 与校验

- 🔴 多 tab 场景用 `app.focusPage('#id')`（iframe 模式下等价 `$`，但保持一致性）。
- 🔴 校验用 `if (app.validate('formId')) return;`（**返回 true = 有错误**，反直觉但保持与旧框架兼容）。校验类 `v_required` / `v_number` / `v_float_3` / `v_phone` 等直接加在 input 上。

### 5.4 弹窗与反馈

- 🔴 弹窗用 `app.popup(url,title)`（iframe 子页）或 `app.popupModel('#box',title)`（DOM 弹窗），底层是 `layer.open`。
- 🔴 反馈用 `app.showAlert/Confirm/Loading`，禁止裸 `layer.msg` / `alert` / `confirm`（便于未来统一 i18n）。

### 5.5 合规项（继承 AGENTS.md）

- 方法命名：Action/Service/DAO 三层同名（`pageMytask` / `addMytask`...）。
- FLException：后端抛错必须带错误码，查 `docs/03-API文档/API/error.md`。
- i18n：HTML 静态文本加 `data-i18n` 属性（i18n 子系统待移植，但标记先行）。
- 安全：手机号 `AESHelper.encrypt`，SQL 参数化查询。

---

## 6. 已知边界与后续工作

| 项 | 状态 | 说明 |
|---|---|---|
| 登录（账号密码） | ✅ 完成 | 挑战-响应 MD5，写 Cookie，跳首页 |
| 主框架（菜单/tab/面包屑） | ✅ 完成 | 二级菜单、iframe tab、退出 |
| 列表/表单模板 | ✅ 完成 | 含搜索/分页/弹窗增改删 |
| 二维码登录（钉钉/微信） | ⏳ 待移植 | 旧 `login.js` 的 `initQRCodeLogin` 逻辑可平移 |
| i18n 国际化 | ⏳ 待移植 | 旧 `js/com/i18n.js` 体系较大，按需移植 |
| 单点登录心跳 | ⏳ 待移植 | 旧 `index.js` 的 `setInterval` + `com._post_(api.home.library)` |
| 打印（Printer） | ⏳ 待移植 | 旧 `com.popup(isPrint)` 机制 |
| 数据看板首页 | ⏳ 简化 | 当前 home.html 为占位，可接 ECharts |
| Searcher 引擎 | ❌ 不移植 | 新列表页直接用 layui table/laypage，更轻量 |
| 旧页面搬迁 | 📋 按需 | 老页可逐个搬入 `app/`，但非必须——并存即可 |

---

## 7. 本地验证（手工冒烟）

1. 把 `app/` 部署到与后端同源的服务器（或配置 nginx 代理 `*.do` 到后端）。
2. 访问 `app/login.html` → 输入账号密码 → 应跳转 `index.html`。
3. 左侧菜单应显示后端返回的模块树；点击任意菜单项 → 右侧开 tab 加载页面。
4. 复制 `views/template/list.html` + `js/template/list.js` + `js/api/_template.js` 改名为某真实模块 → 验证列表查询/分页/增改删。

---

## 附录 A：`app.post` 完整签名

```js
/**
 * @param {Object} api 接口对象
 *        { url, demo?, validate?, type?, tranargs?, cache?, server?, intercept?, loading? }
 * @param {Object} options 请求参数（扁平点号键）
 * @param {Function} [callback] 成功回调(errorCode==0)
 * @param {Function} [failCallback] 失败回调
 * @param {Boolean} [asyncFlag] false=同步
 */
app.post(api.system.pageRegion, {
    "paging.page": 1, "paging.rows": 10,
    "filters[0].field": "name", "filters[0].data": "张", "filters[0].op": "cn"
}, function (res) {
    var rows = res.paging.data;
    var total = res.paging.totalRecords;
    // 渲染...
});
```

`api` 条目可选字段：
- `demo: true` — demo 模式允许调用（走 `result/xxx.json`）
- `validate: { "bean.field": { required: true } }` — 前端必填校验
- `type: 'query'|'update'` — 配合 `tranargs` 做金额精度转换
- `tranargs: { args: [...] }` — update 类，请求时 ×1000
- `tranargs: [{ result, args }]` — query 类，响应时 ÷1000
- `cache: 'cacheKey'` — 命中 `app.params[cacheKey]` 跳过请求
- `server: 'communion'|'media'|'library'` — 走哪个服务器根
- `intercept: true` — 跳过防重复拦截（默认 query/page/report/count 开头已自动跳过）
- `loading: { content, shade, time }` — 显示加载层

---

## 附录 B：`v_*` 校验类清单

| 类名 | 含义 | 正则/规则 |
|---|---|---|
| `v_required` | 必填 | trim 后非空 |
| `v_number` | 整数 | `^[0-9]*$` |
| `v_anumber` | 整数（可负） | `^-?[0-9]*$` |
| `v_float` | 数字 | 含小数 |
| `v_float_3` | 数字（最多3位小数） | 金额常用 |
| `v_afloat_3` | 数字（可负，3位小数） | |
| `v_name_cn` | 汉字 | |
| `v_name_en` | 字母数字_- | |
| `v_email` | 邮箱 | |
| `v_phone` | 11位手机号 | `^1[0-9]{10}$` |
| `v_identity` | 身份证 | 15或18位 |
| `v_price` | 金额（2位小数） | |

自定义：`app.addValidator('v_region', { regex: /^...$/, errorMsg: '...' })`

---

## 附录 C：layui 2.13.8 vs 旧 2.5.7

| 维度 | 2.5.7（旧 WebContent） | 2.13.8（新 app/） |
|---|---|---|
| 维护 | 停止 | 官方主线 |
| 全量单文件 | 是 | **仍是**（33 个 layui.define，17 模块内置） |
| `table.render` 的 `parseData` | 行为不稳 | 成熟（但本骨架用本地数据模式，更可控） |
| 引用方式 | `layui.js` 全量 | `layui.js` + `css/` + `font/`（三个文件，无 modules 目录） |

> 两个版本物理隔离：`WebContent/assets/altogether/layui.js@2.5.7` 与 `app/layui/layui.js@2.13.8` 互不影响。

---

*本规范随 `app/` 骨架一并交付。新增页面开发时作为强制依据；旧页面搬迁到此目录时作为迁移对照。*
