# Rhadamanthus 国际化（i18n）实施方案

> **版本**:v1.0 (2026-07-15)
> **范围**:前端 UI 文案国际化（HTML 静态文本 / JS 动态提示 / error 码表），后端零改动（复用 `communion.userprefer` 存语言偏好）
> **目标**:在不引入第三方 i18n 库、不新建数据库表的前提下，让用户可在系统内运行时切换语言（中文简/繁 + 多语言），偏好持久化，按「核心优先」渐进推进
> **原则**:**后端零改动**（错误文案国际化已由 [FLEXCEPTION_REFACTOR_PLAN.md](FLEXCEPTION_REFACTOR_PLAN.md) v3.0 前移到前端）、**自建轻量 i18n 核心**（复用已有 `errorMap` 模式）、**渐进式接入**（核心区先行，业务模块逐个迭代，不做一次性大爆炸式改造）

## 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-07-15 | 初版：完成现状调研，确定后端零改动（复用 userprefer）+ 前端自建 i18n 核心 + 渐进式三阶段计划 |

## 当前进度

| 阶段 | 状态 | 说明 |
|---|---|---|
| 阶段 0 基础设施 | ⏳ 待启动 | `i18n.js` 核心 + 目录规范 + 语言来源链 + 抽取脚本 |
| 阶段 1 核心区 | ⏳ 待启动 | 登录/首页/导航/公共组件 + message 词表 + 语言切换 UI |
| 阶段 2 业务模块 | ⏳ 待启动 | decoration → quotation → sales → balance ... 逐模块接入 |
| 阶段 3 长尾收尾 | ⏳ 待启动 | 冷门页面 + 枚举评估 + 繁体转换 + 术语校对 |

---

## 一、背景与现状

### 1.1 国际化（i18n）现状

| 维度 | 现状 | 对方案的影响 |
|---|---|---|
| 后端错误文案 | 100% 走 `FLException → 拦截器 → errorMsg`，3564 处 throw / 484 文件，通道单一干净 | **后端不做国际化**，沿用 v3.0 决策：`errorCode` 当唯一键，前端查表 |
| 前端架构 | jQuery 2.0.3 + Ace Admin 的 MPA，**无构建工具**，632 HTML + 715 JS | 不能用需打包的 i18n 库（vue-i18n 等）；只能用**零依赖、运行时加载**方案 |
| 已有 i18n 雏形 | `core.js` 的 `errorMap` + `error-cn.json` 已实现「同步 ajax 加载 json → 查表 → fallback」，注释已预留 `error-{lang}.json` | **直接复用这套模式**，作为通用 i18n 核心的范本，零新依赖 |
| 动态提示统一入口 | `com.showAlert`(1905处) / `showConfirm`(378处) 等，99% 动态文案走这一族 | **拦住 `core.js` 一处即可覆盖绝大多数动态文案** |
| HTML 静态文本 | ~12,500 处中文散落 632 个静态 HTML，无模板引擎 | **最大工作量**，需 `data-i18n` 标记 + 运行时遍历替换 |

**一句话结论**：后端零改动；前端在不引入新依赖的前提下，复用已有 `errorMap` 模式搭建一个轻量 i18n 核心，按「核心区优先 → 业务模块逐个接入」渐进推进。

### 1.2 与 FLException 重构计划的关系

本方案与 [FLEXCEPTION_REFACTOR_PLAN.md](FLEXCEPTION_REFACTOR_PLAN.md) **物理隔离、互不阻塞**。FLException 计划负责「错误码 → 文案」这一维度，已决策 v3.0（前端映射表激活，后端零改动）；本方案负责「通用 UI 文案」维度（提示词、页面静态文本、语言切换）。两者唯一接缝点见 [§九](#九与-flException-重构计划的协调)。

### 1.3 中文硬编码规模基线（工作量依据）

| 项目 | 数量 |
|---|---|
| `WebContent/views/` 下 .html 文件 | 632 |
| `WebContent/js/` 下 .js 文件 | 715 |
| 含中文的 HTML 文件 | 564 / 632 (89%) |
| 含中文的 JS 文件 | 686 / 715 (96%) |
| HTML 中 CJK token 总数 | ~12,567 |
| JS 中 CJK token 总数 | ~1,024 |
| HTML 属性 `placeholder` 中文 | 248 处 |
| JS `com.showAlert` 调用（含中文） | 1,796 处 |
| JS `com.showConfirm` 调用（含中文） | 369 处 |

> 绝大多数中文集中在 HTML（~12.5k 处），JS 仅约 1k 处，且 JS 近 99% 的提示走 `com.show*` 统一封装——这是改造工作量可控的核心利好。

---

## 二、决策摘要

| 决策项 | 选定方案 | 理由 |
|---|---|---|
| 目标语言 | 中文（简/繁）+ 多语言（en 等） | 短语言码 `cn/tw/en/...` 平行扩展 |
| 切换方式 | **用户级运行时切换** | 偏好持久化到 `communion.userprefer`，刷新/跨设备保持 |
| 后端改动 | **零改动**，复用 `userprefer` | 通用 key-value 表 + 现成 upsert 接口，无需建表/加字段/加方法 |
| i18n 引擎 | **自建轻量核心 `i18n.js`** | 项目无构建工具，复用已有 `errorMap` 零依赖模式 |
| 推进节奏 | **渐进式：核心优先** | 风险可控，核心区验证可行后再批量推广 |

---

## 三、总体架构

```
┌─────────────────────────────────────────────────────────┐
│  语言来源（优先级从高到低）                                 │
│  ① userprefer 的 lang（登录后拉取，持久化，跨设备）          │
│  ② localStorage['rhada.lang']（运行时切换立即写回）         │
│  ③ 浏览器 navigator.language 映射                          │
│  ④ 默认 cn                                                  │
└─────────────────────────────────────────────────────────┘
        │ 确定当前语言 _lang (cn/tw/en/...)
        ▼
┌─────────────────────────────────────────────────────────┐
│  i18n 核心：js/com/i18n.js（新增，零依赖）                  │
│  ┌─────────────┬─────────────┬─────────────────────┐    │
│  │ errorMap    │ messageMap  │ pageMap（按模块分片）│    │
│  │ (error码)   │ (公共提示)  │ (页面静态文本)       │    │
│  └─────────────┴─────────────┴─────────────────────┘    │
│  统一 API：i18n.t(key, args) + i18n.apply($root)         │
└─────────────────────────────────────────────────────────┘
        │
        ├──► 动态提示：com.showAlert('操作成功') → 自动经 messageMap 翻译
        ├──► error 码：core.js else 分支 com.errorMap[errorCode] || errorMsg（已就位）
        ├──► HTML 静态：<span data-i18n="page.customer.name">客户名称</span>
        │              i18n.apply($('body')) 遍历替换
        └──► 语言切换：顶栏下拉 → i18n.setLang('en') → 重载语言包 + apply 全局 + 存偏好
```

---

## 四、后端策略 —— 复用 `communion.userprefer`，零改动

### 4.1 为什么零改动

`communion.userprefer` 是**通用 key-value 偏好表**，字段结构 `(userId, module, page, pkey, pvalue, company)`，已有唯一索引 `(userId, module, page, pkey, company)`，且 `updateUserPrefer.do` 接口已实现 **upsert**（查不到则插入、查到则更新）。现有线上已用它存储主题（`templateStyle`）、列表视图模式（`viewMode`）等偏好。

| 现成资产 | 位置 | 复用方式 |
|---|---|---|
| `UserPreferPO` | `src/com/fanglin/personel/po/UserPreferPO.java` | 直接映射，无需改 |
| `UserPreferDao(Impl)` | `src/com/fanglin/personel/dao/...` | `queryUserPrefer` / `queryUserPrefers` 直接用 |
| `UserPreferService(Impl)` | `src/com/fanglin/personel/service/...` | `updateUserPrefer` 已是 upsert |
| `UserPreferAction` | `src/com/fanglin/personel/action/UserPreferAction.java` | 3 个接口直接复用 |
| `UserPreferVO` | `src/com/fanglin/personel/vo/UserPreferVO.java` | 前端提交载体 |

### 4.2 语言偏好的存储约定

沿用现有惯例（`module=index, page=global, pkey=templateStyle` 存主题的成熟模式），语言偏好定为：

| 字段 | 值 | 说明 |
|---|---|---|
| `module` | `index` | 复用现有全局偏好 module（与 `templateStyle` 同域），共用一次 `queryUserPrefers(module=index)` 拉取 |
| `page` | `global` | 全局偏好惯例 |
| `pkey` | `lang` | 新增键 |
| `pvalue` | `cn` / `tw` / `en` / ... | 短语言码，默认 `cn` |

> 选 `module=index` 而非新建 `setting/lang`，是为了和现有 `templateStyle` 主题偏好并列、共用一次 `queryUserPrefers(module=index)` 拉取——前端 `index.js` 启动时已经在拉这个 module 的偏好（见 `js/index.js` 的 `loadUserPrefers()`）。

### 4.3 三个现成接口

| 接口 | URL | 用途 | 鉴权 |
|---|---|---|---|
| `updateUserPrefer` | `updateUserPrefer.do` | **切换语言时调用**，upsert 写入 `pvalue=cn` | base 包，强制登录态 + 操作权限 |
| `queryUserPrefers` | `queryUserPrefers.do` | 登录后批量拉取偏好（含 lang） | 同上 |
| `queryUserPrefer` | `queryUserPrefer.do` | 单条精确取 lang | 同上 |

三个接口都走 `base` 包 → `AccessInterceptor`，**强制登录态 + `checkOperation` 权限校验**，`userId`/`company` 从认证态解密取出（用户只能写自己的偏好，不可伪造）。完全符合「用户级运行时切换」需求。

### 4.4 校验注意点（已确认不拦 lang）

`UserPreferServiceImpl` 有个校验：**仅当 `module == "searcher"` 时校验 `pvalue` 白名单**（viewMode 必须 line/card/table；viewSwitcher 必须 0/1）。lang 用 `module=index`，**不在白名单校验范围内，任意语言字符串都能存**，无阻碍。仅 `module/page/pkey` 三字段非空校验需满足（lang 的三个值都非空，通过）。

### 4.5 前端调用方式（照搬现有模式）

参考 `WebContent/js/system/userProfile.js:118-142` 的 `templateStyle` 写法：

```javascript
// 切换语言：写入偏好（与现有 templateStyle 写法完全一致）
com.post(api.personel.updateUserPrefer, {
    "userPrefer.module": "index",
    "userPrefer.page": "global",
    "userPrefer.pkey": "lang",
    "userPrefer.pvalue": lang   // cn/tw/en
});

// 登录后读取：index.js 启动已拉 module=index 全部偏好
// lang 即在 params.user.prefer.index.global.lang
```

---

## 五、语言来源链

`i18n.js` 初始化时按以下优先级确定 `_lang`：

```
① params.user.prefer.index.global.lang    ← 登录后从 userprefer 拉取（持久化，跨设备）
        │ 未登录或未拉到，↓
② localStorage['rhada.lang']              ← 运行时切换立即写回（即时生效、离线可用）
        │ 无，↓
③ navigator.language 兜底映射             ← 浏览器语言（zh-*→cn, en-*→en，其余→cn）
        │ 无法映射，↓
④ 'cn'                                    ← 默认简体中文
```

### 5.1 各层的职责

- **① 是持久化主源**：登录后 `index.js` 的 `loadUserPrefers()` 拉到 userprefer 的 lang 后，调用 `i18n.setLang(lang, {persist:false})` 应用（不重复回写）。
- **② 保证即时性**：用户在顶栏点「English」时，先 `localStorage` 写入并立即 `i18n.apply()` 全局刷新，**同时异步**调 `updateUserPrefer.do` 持久化（失败不阻塞，下次登录仍以服务端为准）。
- **③④ 处理首次访问/未登录**：登录页、未登录场景用浏览器语言或默认 cn。

### 5.2 已登录 vs 未登录场景

| 场景 | 语言源 | 切换是否持久化 |
|---|---|---|
| 登录页 / 注册页 | localStorage ② 或浏览器 ③ 或默认 ④ | 不持久化到 userprefer（无登录态，接口拦） |
| 登录后主框架 | userprefer ① 优先 | 切换写 userprefer + localStorage 双写 |

---

## 六、i18n 核心：`js/com/i18n.js`（新增，零依赖）

### 6.1 技术选型：为何不引第三方库

1. 项目无构建工具（无 webpack/rollup），引入需打包的库（i18next 等）成本高、风险大。
2. 已有 `errorMap` 的自建模式（同步加载 json + 查表 + `{0}` 占位符 + fallback）经过验证，**把它泛化成通用 i18n 核心即可**，风格统一、维护成本低。
3. MPA 架构下，每个页面独立加载，i18n 核心必须足够轻（单文件 < 200 行）。

### 6.2 核心 API

| 能力 | API | 用途 |
|---|---|---|
| 翻译 | `i18n.t(key, args)` | 替代硬编码字符串，支持 `{0}{1}` 占位符（与 errorMap 一致） |
| DOM 批量替换 | `i18n.apply($root)` | 遍历 `[data-i18n]` 元素替换文本，`[data-i18n-ph]` 替换 placeholder |
| 语言切换 | `i18n.setLang(lang, opts)` | 重载语言包 + 全局 apply + 写 localStorage（+ 可选调后端存偏好） |
| 当前语言 | `i18n.lang` | 读取当前语言码 |

### 6.3 加载顺序

在 `index.html:309`（`core.js` 之后）插入 `i18n.js`，登录页 `login.html` 精简链同样补一个。`i18n.js` 内部复用 `core.js:2553` 的同步 ajax 加载 json 模式：

```javascript
// 复用现有 errorMap 的加载模式（core.js:2553-2568）
$.ajax({ url: 'js/i18n/error-' + i18n.lang + '.json', async: false, cache: true, dataType: 'json',
    success: function(data){ com.errorMap = data || {}; },
    error: function(){ com.errorMap = {}; }
});
```

### 6.4 语言包缓存

公共包（`message-*` / `error-*`）用 `cache:true` 复用浏览器缓存；页面级 `page/{module}-*` 包按需加载。MPA 每页重载语言包的开销通过 HTTP 缓存控制。

---

## 七、语言包结构与命名规范

延续现有 `error-cn.json` 约定，统一用**短语言码**（避免重命名历史文件）：

| 码 | 语言 | 状态 |
|---|---|---|
| `cn` | 简体中文（基准） | 现有内容直接抽取 |
| `tw` | 繁体中文 | 新增 |
| `en` | 英文 | 新增 |
| `jp`/`ko`/... | 预留扩展 | 后续按需 |

### 7.1 目录结构

三类语言包，分层管理（都放 `WebContent/js/i18n/`）：

```
WebContent/js/i18n/
├── error-cn.json        # 错误码表（已有，FLException 计划负责）
├── error-tw.json        # ← 新增
├── error-en.json        # ← 新增
├── message-cn.json      # 公共提示词（操作成功/确定/取消/请选择...）
├── message-tw.json
├── message-en.json
├── page/                # 页面静态文本，按模块分片（避免单文件过大）
│   ├── common-cn.json   # 登录/首页/导航/公共组件
│   ├── common-tw.json
│   ├── common-en.json
│   ├── decoration-cn.json   # 各业务模块
│   ├── quotation-cn.json
│   └── ...
└── enum-cn.json         # ds/*.json 业务枚举（客户类型/状态等）——单独评估
```

### 7.2 键名规范（三段式，避免冲突）

```
msg.opSuccess          # message 层
msg.confirmDelete
msg.required
page.common.userName   # page 层：page.{模块}.{键}
page.decoration.orderNo
err.110000             # error 层（errorMap key 直接用数字码，保持现状）
```

### 7.3 message 层高频词（首批 ~15-20 个，覆盖约 60% 提示场景）

基于词频统计，首批抽取的高频短语：

| key | 中文 | 出现次数（约） |
|---|---|---|
| `msg.opSuccess` | 操作成功 | 594 |
| `msg.confirm` | 确认 | 466 |
| `msg.deleteOk` | 删除成功 | — |
| `msg.exists` | 已存在 | 92 |
| `msg.cancel` | 取消 | 76（JS） |
| `msg.query` | 查询 | 250（JS） |
| `msg.submit` | 提交 | 217（JS） |
| `msg.ok` | 确定 | 126（JS） |
| `msg.selectPlease` | 请选择 | 135（JS） |
| `msg.inputPlease` | 请输入 | 55（JS） |
| `msg.opFailed` | 操作失败 | 8 |
| `msg.noData` | 暂无数据 | 78（JS） |
| `msg.required` | 不能为空 | 29（JS） |
| `msg.loading` | 加载中... | 11 |
| `msg.confirmDelete` | 是否确认删除? | — |
| `msg.failed` | 失败 | 193（JS） |
| `msg.modify` | 修改 | 126（JS） |
| `msg.export` | 导出 | 113（JS） |

---

## 八、前端改造方案（分三类，难度递增）

### 8.1 类别 A：error 码表 —— 几乎零成本（已就位）

由 FLException 计划负责。当前语言切到 `tw`/`en` 时，只需：
- `core.js:2553` 的 ajax url 改为 `error-' + i18n.lang + '.json`（现已硬编码 `cn`，需小改成读 `i18n.lang`）。
- 平行新增 `error-tw.json` / `error-en.json`（由 `scripts/generate_error_json.py` 派生翻译）。
- 查表 + fallback 逻辑（`core.js:292/305`）不变。

**与 FLException 计划的唯一协调点**：让其把语言码从硬编码 `cn` 改为读取 `i18n.lang`，其余互不干扰。

### 8.2 类别 B：动态提示文案（com.show\*）—— 低成本、高覆盖

99% 动态提示走 `com.show*`。改造分两步：

**步骤1：建 `message-{lang}.json`**，覆盖高频词（见 §7.3）。

**步骤2：在 `core.js:535-670` 的 `com.show*` 内部做透明拦截**（可选增强，进一步降低散落改写量）：

```javascript
// 伪代码：showAlert 第二参若命中已知短语，自动翻译
com.showAlert = function(type, contents){
    contents = i18n.tAuto(contents); // 先查 messageMap，命中则翻，未命中原样返回
    layer.alert(contents, {...});
};
```

这样大量 `com.showAlert(com.info,"操作成功")` **无需逐处改写**也能国际化。仅"非通用短语"（业务特定提示）才需手动改成 `i18n.t('msg.xxx')`。

**工作量**：`message-{lang}.json` 抽取 + `core.js` 一处拦截增强 ≈ 1-2 人日；剩余业务特定提示按模块渐进。

### 8.3 类别 C：HTML 静态文本 —— 主要工作量，但模式高度重复

632 个 HTML、~12,500 处中文，模式集中在 `<label>`/按钮文本/`placeholder`。方案：

**步骤1：标记机制** —— 用 `data-i18n` / `data-i18n-ph` 属性：

```html
<!-- 改造前 -->
<label>客户名称：</label>
<input placeholder="请输入客户名称" />
<button>查询</button>

<!-- 改造后（保留原中文作 fallback，语言包缺失时不致空白） -->
<label data-i18n="page.customer.name">客户名称：</label>
<input placeholder="请输入客户名称" data-i18n-ph="msg.inputPlease" />
<button data-i18n="msg.query">查询</button>
```

`i18n.apply($('body'))` 在页面 ready 时遍历替换。

**步骤2：半自动抽取**（关键提效手段）—— 写一个 Node/Python 脚本（放 `scripts/`）：
1. 扫描 HTML，提取所有中文文本节点 + placeholder。
2. 高频词（确定/取消/查询…）自动匹配到 `message` 层 key。
3. 非高频词按 `page.{模块}.{语义}` 规则生成 key 草案，写入 `page-{module}-cn.json`。
4. 同时把 `data-i18n="key"` 回填到 HTML（脚本直接改文件，人工校对）。

这把"逐个手改 12,500 处"降为"脚本批量打标 + 人工校对 key 语义"，工作量降一个量级。

**步骤3：页面接入** —— 每个页面 ready 时调一次 `i18n.apply($('body'))`。可由公共脚本统一注入，或页面 main 方法里调用。

---

## 九、与 FLException 重构计划的协调

两者**物理隔离、互不阻塞**，仅一个接缝点：

| 范畴 | 负责方 | 改动范围 |
|---|---|---|
| error 码表（error-cn.json 生成、core.js errorMap 加载与查表） | FLException 计划 | `core.js:292/305/2553`、`scripts/generate_error_json.py`、`error-cn.json` |
| 通用 i18n 核心、message 词表、HTML 文本、语言切换 | 本方案 | `js/com/i18n.js`、`js/i18n/` 目录、各页面 |

**接缝**：约定 `core.js` 加载 error 包时语言码从硬编码 `error-cn.json` 改为读 `error-' + i18n.lang + '.json`。建议阶段 0 完成后，把这一行的改动一次性同步（或由本方案在 `i18n.js` 就绪后统一提交这一处小改）。

其余无交集，可并行推进。

---

## 十、分阶段实施计划（渐进式：核心优先）

### 阶段 0：基础设施（1-1.5 周）

**后端：零改动**（不建表、不加字段、不加方法、不加接口）

**前端**：
- [ ] 新建 `js/com/i18n.js` 核心模块（`t` / `apply` / `setLang` / `lang`）
- [ ] 确立 `js/i18n/` 目录结构 + 键命名规范（同步写入 `WebContent/CLAUDE.md`）
- [ ] `config.js` 加 `defaultLang: 'cn'`；`index.html`/`login.html` 注入 `i18n.js`
- [ ] 语言来源优先级链（userprefer → localStorage → 浏览器 → cn）
- [ ] `index.js` 的 `loadUserPrefers()` 拿到 lang 后回调 `i18n.setLang()`
- [ ] 顶栏语言切换 UI：切换时 localStorage 即时写 + `updateUserPrefer.do` 异步持久化
- [ ] 写「HTML 抽取打标」半自动脚本（`scripts/extract_i18n.py`）
- [ ] **与 FLException 计划对齐**：`core.js` 的 error 包语言码从硬编码 `cn` 改为读 `i18n.lang`

**里程碑**：i18n 核心可用，语言偏好可存取，HTML 抽取工具就绪。

### 阶段 1：核心区国际化（1-2 周，立即可见效果）

- [ ] 登录页 `login.html` 全量国际化（页面少，作为试点验证全链路）
- [ ] 首页 / 导航 / 顶栏语言切换 UI（下拉菜单）
- [ ] 公共组件：`Condition` 查询条件、表格列头、分页（`condition.js`/`searcher.js`）
- [ ] `message-{lang}.json` 高频词抽取 + `com.show*` 透明拦截增强

**里程碑**：用户可切换语言，登录→首页→常用查询 全英文可用。

### 阶段 2：高频业务模块（4-8 周，按模块迭代）

按使用频率分批：`decoration`(装修) → `quotation`(报价) → `sales`(销售) → `balance`(结算) → ...
- [ ] 每模块：跑抽取脚本 → 校对 key → 补 `page/{module}-{lang}.json` → 页面接入 `apply`
- [ ] 业务特定提示（`com.showAlert` 非通用短语）逐个改 `i18n.t()`
- [ ] 每模块独立验证、独立提交，风险隔离

### 阶段 3：长尾页面 + 枚举 + 校对（2-4 周）

- [ ] 低频页面（`test/`、冷门报表）
- [ ] `ds/*.json` 业务枚举值（客户类型/状态等，**需单独评估**：是 UI 文案还是业务数据？业务数据不宜简单翻译）
- [ ] 繁体（`tw`）转换（可脚本简繁转换 + 人工校对术语）
- [ ] 全量术语一致性校对（统一"订单/工单/装修单"等译法）

---

## 十一、工作量估算

| 阶段 | 内容 | 估算（人日） |
|---|---|---|
| 0 | 基础设施（**后端 0**）+ 抽取脚本 | 6-9 |
| 1 | 核心区 + message 词表 + 切换 UI | 8-12 |
| 2 | 业务模块（每模块约 3-5 人日 × 10+ 模块） | 40-60 |
| 3 | 长尾 + 枚举评估 + 繁体 + 校对 | 15-25 |
| **合计** | | **~69-106 人日（约 3-5 人月）** |

**省力杠杆点**：
1. `com.show*` 透明拦截（省去上千处手改）
2. HTML 抽取打标脚本（省去上万处手改）
3. error 码表已就位（零成本）

---

## 十二、风险与对策

| 风险 | 对策 |
|---|---|
| 632 个页面回归面太大 | 渐进式 + 每模块独立提交；保留中文 fallback，语言包缺失不致空白崩溃 |
| 简繁/术语不统一（"装修单"vs"工单"） | 阶段初建术语表（glossary），翻译以术语表为准 |
| 动态拼接文案难抽取（如 `"删除" + name + "成功"`） | 统一改 `i18n.t('msg.deleteOkName',{0:name})` 占位符模式，在抽取脚本里识别字符串拼接模式 |
| 语言包加载性能（MPA 每页重载） | 公共 message/error 包缓存（`cache:true`，复用现有模式）；页面级 page 包按需加载 |
| 与 FLException 计划并行改 `core.js` 冲突 | 明确分工（见 §九）：errorMap 归 FLException 计划；i18n 模块独立成 `i18n.js`，仅约定 `core.js` 读 `i18n.lang`，物理隔离改动 |
| 第三方控件中文（日期/日历，`core.js:56-98`） | 单独处理：控件初始化时按 `i18n.lang` 传对应 locale 配置 |
| 繁体机器转换质量 | 工具转换（OpenCC）打底 + 业务术语人工校对，不裸用机器结果 |
| userprefer 首次写撞 unique key | `updateUserPrefer` 已是 upsert（先查后写），日常切换语言无并发问题；理论上同一用户极高并发首写可能撞 `(userId,module,page,pkey,company)` 唯一索引，可忽略 |
| 未登录场景无法用 userprefer | 登录页/注册页走 localStorage + 浏览器语言兜底（见 §5.2），不依赖 userprefer |

---

## 十三、相关文件索引

### 后端（全部复用，零改动）

| 文件 | 作用 |
|---|---|
| `src/com/fanglin/personel/po/UserPreferPO.java` | userprefer 实体，`@Table(catalog="communion")` |
| `src/com/fanglin/personel/dao/UserPreferDao.java` (+`impl`) | `queryUserPrefer` / `queryUserPrefers` |
| `src/com/fanglin/personel/service/UserPreferService.java` (+`impl`) | `updateUserPrefer`（upsert，含 searcher 白名单校验） |
| `src/com/fanglin/personel/action/UserPreferAction.java` | 3 个接口：query/querys/update |
| `src/com/fanglin/personel/vo/UserPreferVO.java` | 前端提交载体 |
| `sqls/misc/userprefer.sql` | 表 DDL + 唯一索引 |

### 前端（待新增 / 待改造）

| 文件 | 作用 | 状态 |
|---|---|---|
| `WebContent/js/com/i18n.js` | **新增** i18n 核心（t/apply/setLang/lang） | 待新增 |
| `WebContent/js/i18n/*.json` | **新增** 语言包目录（error/message/page） | 待新增 |
| `WebContent/js/com/config.js` | 加 `defaultLang` 配置 | 待改造 |
| `WebContent/js/com/core.js` | `com.show*` 透明拦截 + error 包语言码读 `i18n.lang` | 待改造（与 FLException 计划协调） |
| `WebContent/index.html` / `login.html` | 注入 `i18n.js` | 待改造 |
| `WebContent/js/index.js` | `loadUserPrefers()` 拿到 lang 回调 `i18n.setLang()` | 待改造 |
| `WebContent/js/system/userProfile.js` | 现有 `templateStyle` 写法参考（`118-142`） | 参考 |
| `WebContent/js/api/personel.js` | `updateUserPrefer` API 定义（`131-167`） | 复用 |
| `WebContent/js/com/error-cn.json` | error 码表（FLException 计划负责） | 已有 |
| `scripts/extract_i18n.py` | **新增** HTML 抽取打标脚本 | 待新增 |

### 参考文档

| 文档 | 作用 |
|---|---|
| [FLEXCEPTION_REFACTOR_PLAN.md](FLEXCEPTION_REFACTOR_PLAN.md) | FLException 重构计划（error 维度，v3.0 前端映射表） |
| [METHOD_NAMING_CONVENTION.md](METHOD_NAMING_CONVENTION.md) | 方法命名规范（新增接口需遵守） |
| `WebContent/CLAUDE.md` | 前端架构说明（i18n 规范需同步写入） |
| `docs/03-API文档/API/error.md` | 错误码权威表（error 包数据源） |
