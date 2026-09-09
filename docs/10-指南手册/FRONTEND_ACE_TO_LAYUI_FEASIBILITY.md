# 前端框架迁移可行性评估：Ace → 纯 LayUI

> 编制日期：2026-08-08
> 范围：`WebContent/` 全量前端资产（640 个业务页面 + 7 个框架页 + 5 个登录页 + 3 个首页）
> 结论先行：**全量替换技术上可行，但工程量极大、风险高、收益与成本不对等**。建议改为"分层渐进替换"，详见第 5 节。

---

## 0. TL;DR（决策摘要）

| 维度 | 现状 | 影响 |
|---|---|---|
| Ace 角色 | **布局外壳 + Bootstrap 3 + 一批 jQuery 插件**（导航、侧边栏、面包屑、widget-box、向导、树、滚动条等） | 这是"骨架"，不是"皮肤"，替换=重写外壳 |
| LayUI 角色 | **仅 `layer` 弹窗模块**（+ `laydate` 单点），其余 layui 组件零使用 | LayUI 当前**没扛过任何布局/导航/表格/表单** |
| 业务页面 | 640 个 HTML，**Bootstrap 栅格 + Ace 组件类 + 自定义 `fl_*`/`v_*`**，layui 类 0 处 | 640 页几乎都要动 DOM |
| 核心契约 | `js/com/core.js`、`js/index.js`、`js/main.js` 硬编码 Ace DOM（`.nav-list`、`.submenu`、`.main-content`、`.breadcrumb`、`.flpage.tab-pane`、`$.breadcrumb`、`$.fn.statement`） | 重写核心 JS 的页面装配/导航/面包屑 |
| 主题系统 | 4 套独立外壳（ace/clear/metro/dark），靠切换整套 Bootstrap 分支实现 | 纯 LayUI 下 3 套主题要么废弃要么重建 |
| 弹窗 | `com.popup*` 已全量走 layui `layer` | ✅ 这部分零迁移 |
| 量化预估 | 全量重写 ~**90–160 人日**（见第 4 节），且无自动化手段覆盖业务语义 | 收益（统一栈）难以覆盖成本与回归风险 |

**推荐路线：保留 Ace 作外壳骨架，按"层"渐进下沉 LayUI；不要做一次性全量替换。** 详见第 5、6 节。

---

## 1. 现状基线（数据来自全量扫描）

### 1.1 资产规模

| 目录 | 内容 | 体量 |
|---|---|---|
| `assets/ace/` | ace.css / ace-dark.css / Bootstrap 3 / ace-elements.js / ace.js / ace-extra.min.js / fonts / images | 53 文件 ~1.8MB |
| `assets/clear/` | Clear 主题（独立 Bootstrap 分支：bootstrap-clear.min.css、app.css…） | 独立一套 |
| `assets/metro/` | Metro 主题（Metronic 风格：style-metro.css、style.css…） | 独立一套 |
| `assets/altogether/` | **共享**资产：jquery-2.0.3、**layui.js(2.5.7 全量包 ~450KB)**、layui.css(73KB)、echarts、font-awesome、ztree、fuelux、layer.css、laydate.css 等 | 共享 |
| `assets/layui/` | **空目录**（仅 `index-layer.html` 引用，实为死路径） | 0 |

### 1.2 HTML 引用统计（共 660 个 html）

| 引用模式 | 文件数 |
|---|---:|
| `assets/ace/`（真实 ace 路径） | **49** |
| `ace.js` / `ace-elements.js` / `ace-extra` | **46** |
| `bootstrap.min.css`（ace 携带） | 18 |
| `bootstrap.min.js` | 47 |
| 同时引用 ace + layui/altogether | **48** |
| `layui.css` | 6（全是框架页 index*/chart） |
| `layui.js` | 5（全是框架页 index*） |
| 业务页（views/）使用 layui CSS 类 | **0** |

### 1.3 LayUI 实际使用面（726 个业务 JS）

| 调用 | 次数 | 说明 |
|---|---:|---|
| `layui.use(` | **0** | 业务代码从不按 layui 标准方式加载模块 |
| `layer.closeAll` | 23 | |
| `layer.open` | 12 | |
| `layer.close` | 11 | |
| `layer.msg` | 7 | |
| `layer.confirm` | 2 | |
| `layer.tips` / `layer.alert` | 各 2 | |
| `layer.photos` / `getChildFrame` | 各 1 | |
| `table.render` / `form.render` / `element.render` / `laypage` / `laytpl` / `tree` / `upload`（app 侧） | **0** | LayUI 的招牌数据驱动组件全部未用 |
| `layui.table` / `layui.layer` / `layui.laydate` / `layui.carousel`（全局取值） | 各 1 | 仅 `load.js` 解构一次 |

**结论**：LayUI 当前是"**弹窗工具箱**"，不是"UI 框架"。仅 8 个 JS 文件引用 `layui`/`layer`，弹窗调用集中度极高（`com/core.js` 一家独大）。

### 1.4 Ace 在业务页面的渗透（640 个 view）

| 类别 | 代表类名 | 文件命中量级 |
|---|---|---|
| 栅格 | `col-sm-3`(3493) `col-sm-9`(3059) `col-xs-10`(2930) `col-sm-6`(1953) `col-xs-12`(990) | **数千处** |
| 表单 | `form-group`(4801) `control-label`(4470) `no-padding-right`(4536) `form-horizontal`(834) | **数千处** |
| 模态框 | `modal-content/dialog/header/body/footer` | 各 ~785 |
| Ace 容器/卡片 | `page-content`(239) `widget-box`(152) `widget-header`(159) `widget-body`(181) `widget-main`(150) `space-4`(893) `tab-pane`(441) | **数百处** |
| 按钮 | `btn-primary`(804) `btn-default`(662) `btn-success`(156) `btn-info`(121) `btn-danger`(61) + `btn-app`/`btn-minier`/`btn-grey` | **数百处** |
| 图标 | `icon-*`（ace/font-awesome-fa）：`icon-plus`(72) `icon-double-angle-right`(41) `icon-ok`(29) `icon-print`(27) … 40+ 种 | **数百处** |
| 自定义约定 | `fl_search`、`fl-page-wrap`、`flpage`、`v_required`/`v_number`/`v_phone`/`v_float_3` | 框架级，遍布 |

### 1.5 Ace 原生 JS 在业务代码的实际调用

只有 **3 个 ace JS 能力**真正被业务调用（其余 ace.js 能力是"自启动"行为）：

| 调用 | 点位数 | 代表文件 |
|---|---:|---|
| `ace.click_event`（替代 click，兼容触屏） | 10 | `home.js`、`main.js`、`buildingHouse4detail.js`、`decoration4detail.js`、`supervision4detail.js`、`company4config.js`、3 个 report |
| `.ace_wizard()`（fuelux 向导） | 11 | `buildingSchedule.js`、`allocation4detail.js`、`customer4detail.js`、`supervision4detail.js`、`decoration4detail.js`、`decoration4account.js`、`company4config.js` |
| `.ace_tree()` | 2 | — |
| `ace.settings.check(...)`（内联在 HTML） | 7 | `main.html`、`index-clear.html`、`index-metro.html` |

**这点很关键**：Ace 的 JS API 渗透度低，可替换性强；但 Ace 的 **CSS 类契约**和 **DOM 结构契约**渗透度极高。

### 1.6 框架核心（`js/com/*`）对 Ace 的依赖

| 文件 | 与 Ace 的耦合点 |
|---|---|
| `js/com/core.js`（2585 行） | `com.switchPage`/`loadPage` 用 jQuery `.load()` 注入 `.flpage.tab-pane.active` / `#fl-container`；`$.breadcrumb()` 写 `.breadcrumb`；`$.fn.statement()` 注入 `.page-header`；`com.validate` 依赖 Bootstrap `popover` |
| `js/com/load.js` | 解构 `layui.{layer,laydate,table,carousel}` 为全局 —— **这是框架对 layui 的唯一硬依赖**（弹窗/日期） |
| `js/index.js`（框架控制器） | 硬编码 `#sidebar`、`.nav.nav-list`、`.main-content`、`#menu-toggler`、`.sidebar`；`createMenu()` 生成 `ul.nav-list`/`li`/`ul.submenu`/`b.arrow.icon-angle-down` |
| `js/main.js`（旧菜单） | 同上，生成 `.nav-list`/`.submenu` 树 |
| `js/com/validator.js` / `condition.js` / `printer.js` | 不直接依赖 ace/layui，但 `printer` 间接走 `com.popup`（layer） |

---

## 2. 核心结论：Ace 与 LayUI 的职责错位

```
┌──────────────────────────────────────────────────────────────┐
│ 当前架构                                                      │
│                                                              │
│   Ace Admin (外壳骨架)        LayUI (仅弹窗工具)              │
│   ├─ Bootstrap 3 栅格          ├─ layer 弹窗 (com.show*/popup)│
│   ├─ 导航/侧边栏/面包屑        ├─ laydate (单点)              │
│   ├─ widget-box/page-content   └─ table/carousel (取值未渲染) │
│   ├─ nav-list/submenu 菜单                                   │
│   ├─ Bootstrap modal/popover                                 │
│   ├─ ace_wizard/ace_tree/slimscroll                          │
│   └─ 4 套主题(ace/clear/metro/dark)                          │
└──────────────────────────────────────────────────────────────┘
```

**关键判断**：

1. LayUI **当前完全不承担"框架"职责**。它只是 Ace 外壳里的一个"弹窗插件"。把它升级为"唯一框架"= 让它接管 Ace 的全部外壳职责（导航、侧边栏、栅格、主题、向导、树、模态框）。
2. Ace 提供的不只是样式，还有 **Bootstrap 3 的全部基础能力**（栅格、表单、modal、popover、tab）。LayUI 有自己的栅格（`layui-row/col`）和组件，但**语义不兼容 Bootstrap**——这不是改类名，是改 DOM 模型。
3. 业务页的 640 个 HTML 与 Bootstrap 栅格/Bootstrap modal 深度绑定，且依赖框架级自定义约定（`fl_*`、`v_*`、`$.breadcrumb`、`$.fn.statement`）。

---

## 3. 风险清单（全量替换场景）

| # | 风险 | 等级 | 说明 |
|---|---|---|---|
| R1 | **业务页回归爆炸** | 🔴 极高 | 640 页 ×（栅格 + 表单 + modal + 图标 + widget）逐页改类名/DOM，人工逐页回归，ERP 业务流复杂、无自动化 UI 测试 |
| R2 | **Bootstrap 能力丢失** | 🔴 极高 | `.modal`、`.popover`、`.tab('show')`、`.dropdown` 等 Bootstrap JS 插件被业务页/`com.validate` 直接调用；LayUI 的 `element`/`layer` 模型与之不兼容 |
| R3 | **向导/树组件缺口** | 🟠 高 | 11 处 `ace_wizard`、2 处 `ace_tree` 需找 LayUI 平替（layui 无官方向导；tree 较弱），可能要自研或引第三方 |
| R4 | **主题系统崩塌** | 🟠 高 | 4 套主题靠切换 Bootstrap 分支实现；纯 LayUI 下 clear/metro/dark 需重建或废弃 |
| R5 | **核心 JS 重写** | 🟠 高 | `core.js`/`index.js`/`main.js` 的 DOM 契约（`.nav-list`/`.main-content`/`.breadcrumb`/`.flpage`）全部重写 |
| R6 | **图标库迁移** | 🟡 中 | 40+ 种 `icon-*`（ace font-awesome-fa）→ `fa-*` 或 layui 字体，需逐一映射，易漏 |
| R7 | **桌面端 NW.js 双加载** | 🟡 中 | `index*.html` 对 `isPC/isEncryption` 走 `.bin` 加载 `js/com/*`，重写须保留双加载机制 |
| R8 | **打印页大量使用 ace** | 🟡 中 | 39 个 view 中相当比例是 `*2print.html`/`*Receipt.html`，打印排版对 ace CSS 精细依赖，改版易出打印错位 |
| R9 | **layer 与 Bootstrap modal 叠加** | 🟡 中 | 现有代码已有 layer 与 Bootstrap `.modal-backdrop` 叠加的 workaround（见 `quotationAssignUserRuleItem.js`），全量切 layer 后须全面复核 |
| R10 | **投入产出比失衡** | 🔴 极高 | 90–160 人日投入，最终交付物对终端用户"无新功能"，仅栈统一；机会成本极高 |

---

## 4. 全量替换方案（仅供参考，**不推荐**）

若执意全量替换，最小工作分解：

### 4.1 工作分解（WBS）与人日估算

| 阶段 | 工作项 | 人日 | 说明 |
|---|---|---:|---|
| 1 | 基线与脚手架：建 `index-v2.html` 纯 layui 外壳（`layui-layout-admin` + `layui-nav` + 自定义 tab） | 5 | 含侧边栏、面包屑、tab、锁屏 |
| 2 | 重写 `js/com/core.js` 导航/tab/面包屑/page-header 契约 | 6 | `switchPage`/`loadPage`/`$.breadcrumb`/`$.fn.statement` |
| 3 | 重写 `js/index.js` 菜单生成（输出 `layui-nav`） | 4 | `createMenu` 全量改 DOM 模板 |
| 4 | `com.validate` 从 Bootstrap popover → layui layer/popover | 3 | validator.js + 全局 `v_*` 渲染 |
| 5 | 全局 CSS 适配层：写一份 `bootstrap-compat.css`，把 `col-*`/`form-group`/`control-label`/`btn-*`/`modal` 映射到 layui 等价物 | 8 | **降低 640 页改动量的关键，但永远不完备** |
| 6 | widget-box/page-content → layui-card 适配 | 6 | 数百处 |
| 7 | 图标映射：`icon-*` → `fa-*`/layui 图标 | 3 | 40+ 图标表 |
| 8 | 向导替换：`ace_wizard`(11) → 自研/第三方 layui 向导 | 5 | 含业务联调 |
| 9 | 树替换：`ace_tree`(2) → layui tree | 2 | |
| 10 | slimscroll 替换 | 1 | |
| 11 | 主题：clear/metro/dark 重建或废弃 | 6 | 决策驱动 |
| 12 | 打印页复核（39 个含 ace 的 view，多为打印） | 8 | 高危，逐页验 |
| 13 | 业务页逐模块回归（640 页，分批） | 40–60 | **最大头**，无自动化 |
| 14 | NW.js `.bin` 重新编译 + 桌面端回归 | 3 | |
| 15 | 文档更新（CLAUDE.md、开发指南） | 2 | |
| | **合计** | **~98–118 人日**（约 5–6 人月） | 不含用户培训、灰度周期 |

> 实际经验值：含回归与返工，**预估 90–160 人日**更稳妥。

### 4.2 关键技术替代映射

| Ace/Bootstrap 能力 | LayUI 替代 | 兼容性备注 |
|---|---|---|
| Bootstrap 栅格 `col-*` | `layui-row` + `layui-col-md*` | 24 列 vs 12 列，比例换算 |
| `.modal` | `layer.open({type:1})` 或 `layui` 弹层 | 业务页内 `.modal` 须改 JS 调用模式 |
| `.popover`(validate) | `layer.tips` | `com.validate` 重写 |
| `.nav-list`/`.submenu` 菜单 | `layui-nav`/`layui-nav-child` | `createMenu` 重写 |
| `.breadcrumb` | 自定义 + `layui` 样式 | `$.breadcrumb` 重写 |
| `widget-box` | `layui-card` | DOM 结构不同 |
| `.tab-pane`/`.nav-tabs` | `layui-tab` + `layui-tab-item` | tab 切换 API 不同，`com.loadPage` 重写 |
| `ace_wizard` | 无官方，自研或第三方 | **缺口** |
| `ace_tree` | `layui-tree` | API 差异大 |
| `slimscroll` | `layui` 滚动或 CSS | |
| `font-awesome-fa` `icon-*` | `fa-*` 或 `layui-icon` | 逐个映射 |

---

## 5. 推荐方案：分层渐进替换（保留 Ace 外壳骨架）

> 原则：**用最小代价拿到"统一栈"的长期收益，不在一个版本里赌全部回归。**

### 5.1 分层模型

```
┌─────────────────────────────────────────────────────────────┐
│ 层 0：弹窗/提示        → ✅ 已是 layui layer（无需动）        │
│ 层 1：日期选择         → 🟡 laydate 已引入，逐页替换 datepicker│
│ 层 2：下拉增强/上传    → 🟡 chosen→layui-form select,         │
│                          huploadify→layui upload（按需）      │
│ 层 3：业务表格         → 🟢 新增页用 layui table.render，      │
│                          老页不强制                            │
│ 层 4：表单             → 🟢 新增页用 layui-form，老页不动      │
│ 层 5：widget/卡片      → 🟢 新增页用 layui-card               │
│ 层 6：外壳骨架/导航/主题→ 🔴 不替换（保留 Ace）               │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 落地节奏（每层独立发版，可回滚）

| 波次 | 范围 | 预估 | 风险 | 收益 |
|---|---|---:|---|---|
| W1 | 把 LayUI 升级到稳定版（如 2.9.x），统一 `layer` 调用规范；废弃 bootbox 残留 3 处 | 2d | 低 | 栈收敛第一步 |
| W2 | `laydate` 推广：替换 `datepicker`（ace 的） | 3d | 低 | 去一个 ace 依赖 |
| W3 | 新增业务页"默认走 layui 组件"写进开发规范 + 提供脚手架模板 | 2d | 低 | 阻止 ace 继续扩张 |
| W4 | 按模块渐进：表格/表单类新页面统一用 layui table/form（老页保持） | 持续 | 低 | 新代码栈统一 |
| W5 | 向导 `ace_wizard`(11) → 自研 layui 向导组件（仅 11 点，可控） | 5d | 中 | 去掉最深的 ace JS 依赖 |
| W6 | 图标 `icon-*` → `fa-*` 映射表 + 批量替换脚本 | 3d | 低 | 去 ace 字体依赖 |
| —— | **外壳骨架（导航/侧边栏/栅格/主题）保持 Ace 不动** | — | — | 规避 90% 风险 |

**预期**：6–8 周内，新增页面 100% layui，老页面 ace 不再增长，最重的 ace JS 依赖（向导）清除。**总投入 ~15–20 人日，远低于全量替换的 90–160 人日。**

### 5.3 为什么不动外壳骨架

- 外壳骨架（导航/侧边栏/面包屑/tab/主题）只有 **4–6 个文件**，但它们定义了**所有 640 个业务页的容器契约**。动骨架=动全部业务页。
- Ace 作为外壳已经稳定运行多年，无功能缺陷，替换它**对终端用户零功能收益**。
- 真正的痛点（弹窗、日期、新组件体验）已经在层 0–5 解决。

---

## 6. 替代路线对比

| 方案 | 投入 | 风险 | 收益 | 推荐度 |
|---|---|---|---|---|
| **A. 全量替换 Ace→LayUI** | 90–160 人日 | 🔴 极高 | 栈统一 | ⭐ 不推荐 |
| **B. 分层渐进（保留 Ace 外壳）** ⭐ | 15–20 人日 | 🟢 低 | 新代码栈统一、去掉深层 ace JS 依赖 | ⭐⭐⭐⭐⭐ |
| **C. 仅清理 ace JS 依赖（向导/树/图标）** | 8–10 人日 | 🟢 低 | 降低 ace 锁定 | ⭐⭐⭐ |
| **D. 不动** | 0 | — | — | ⭐⭐（若现状无痛点） |

---

## 7. 决策建议

1. **若目标是"统一技术栈/减少依赖"**：选 **方案 B**。在 6–8 周内让所有新页面纯 layui，老页面自然淘汰，不动外壳骨架。
2. **若目标是"彻底去掉 Ace 资产"**：选 **方案 B 的 W5/W6 + 长期规划**，用 2–3 个版本周期，在新业务页全部 layui 化、老页面随业务迭代逐步重写后，再评估是否值得动外壳。
3. **不建议选方案 A**：投入产出比失衡，且 640 页无自动化 UI 测试，回归风险不可控。

---

## 附录 A：核心数据索引

- 业务页总数：`WebContent/views/**` = **640** 个 html
- 框架页：`index.html`、`index-clear.html`、`index-metro.html`、`index-dark.html`、`index-layer.html`、`main.html`
- 登录页：`login.html`、`dlogin.html`、`dlogin_clear.html`、`nlogin.html`、`xlogin.html`
- 首页：`home.html`、`home-antv.html`、`home-dark.html`
- LayUI 版本：**2.5.7**（全量包，`assets/altogether/js/layui.js`，~450KB）
- jQuery：**2.0.3**（页面用），layui 内置独立 jQuery，无 `noConflict` 冲突
- ace 真实 JS 调用面：`ace.click_event`(10) + `ace_wizard`(11) + `ace_tree`(2) + `ace.settings.check`(7 内联)
- layui 业务调用面：`layer.*` ~61 次，集中在 `js/com/core.js`

## 附录 B：模块页面分布（views/）

| 模块 | 页面数 | | 模块 | 页面数 |
|---|---:|---|---|---:|
| data | 98 | | sales | 29 |
| quotation | 59 | | production | 29 |
| customer | 44 | | decoration | 27 |
| personnel | 43 | | information | 23 |
| manifest | 40 | | system | 22 |
| contract | 34 | | balance | 22 |
| construction | 34 | | report | 21 |
| payment | 30 | | material | 17 |
| store | 14 | | salary | 11 |
| building | 11 | | approval | 11 |
| market | 10 | | log | 5 |
| map | 4 | | management | 1 |
| | | | test | 1 |

## 附录 C：关键代码契约（迁移时必须重写）

- `com.switchPage` / `com.loadPage`（core.js）→ jQuery `.load()` 注入 `.flpage.tab-pane.active` / `#fl-container`
- `$.breadcrumb(icon, items)`（core.js:2372）→ 写 `.breadcrumb`
- `$.fn.statement(title, detail)`（core.js:2472）→ 注入 `.page-header`
- `createMenu(res)`（index.js:794–1027）→ 生成 `ul.nav-list` / `li` / `ul.submenu` / `b.arrow.icon-angle-down`
- `com.validate`（core.js + validator.js）→ Bootstrap `popover('show'/'destroy')`
- `com.popup*`（core.js:1202–1505）→ 已是 `layer.open`（无需动）

---

*本评估基于 2026-08-08 全量扫描数据。如需推进方案 B 的某一波次，可基于本文件细化专项计划。*
