# Decoration 模块 displayFunc → Searcher 标准化迁移计划

> 基于 sales / payment 模块迁移经验，对 `WebContent/js/decoration/*.js` 中
> 仍使用 `displayFunc` 的页面进行分类、评估，给出迁移优先级与改造步骤。
>
> 前置依据见 `docs/searcher_view_mode_adjustment_summary.md` 第 10、11 节。

---

## 1. 现状盘点

执行 `findstr /s /n /c:"displayFunc" WebContent\js\decoration\*.js`，命中 9 个文件：

| 文件 | displayFunc 形态 | 是否 Searcher 分页 |
|---|---|---|
| `decoration/audit.js` | IIFE 模块 `displayFunc.init('resultList', data)` | ✅ 是（`pageAudit`） |
| `decoration/audit4record.js` | IIFE 模块 `displayFunc.init('auditR', ...)` + `displayFuncs.inits('auditS', ...)` | ❌ 否，详情子页 |
| `decoration/decoration.js` | IIFE 模块，受 `pageConfig`（数据库 `decorationFunctionRight`）驱动 | ✅ 是（`pageConfig.apiPage`） |
| `decoration/decoration4belong.js` | IIFE 模块 | ✅ 是（`pageDecorationForBelong`） |
| `decoration/decorationBelong.js` | 普通函数 `displayFunc(v)`，前端 `append(displayFunc(addRow))` | ❌ 否，归属详情子页 |
| `decoration/decorationMeasure.js` | IIFE 模块 | ✅ 是（`pageDecorationMeasure`） |
| `decoration/decorationMeasure4apply.js` | IIFE 模块 | ✅ 是（`pageDecorationMeasureForApplay`） |
| `decoration/decorationMeasure4setup.js` | IIFE 模块 | ✅ 是（`pageDecorationMeasure`） |
| `decoration/decorationPicture.js` | IIFE 模块，行内图片缩略图 | ✅ 是（`queryInspect`） |

其中 7 个是标准 Searcher 分页页，2 个是非分页子页面。

---

## 2. 迁移范围判定（沿用 payment 经验）

### 2.1 纳入迁移（标准 Searcher 分页页）

```text
audit.js
decoration.js
decoration4belong.js
decorationMeasure.js
decorationMeasure4apply.js
decorationMeasure4setup.js
decorationPicture.js
```

### 2.2 排除迁移（非 Searcher 分页）

| 文件 | 排除依据 |
|---|---|
| `decoration/audit4record.js` | 审核详情子页面，通过 `queryAuditRecordByOrderId`、`queryAuditScaleByArid` 一次性拉取后局部渲染到 `auditR`、`auditS`，无分页器、无 Searcher 条件区；按行可修改/删除/生成扣款后局部刷新。 |
| `decoration/decorationBelong.js` | 装修单归属详情子页面，通过 `queryDecorationBelong` 按 `orderId/type` 一次性拉取，且前端 `appendUserBtn` 动态 `append(displayFunc(addRow))` 增加行；行内属性含 `belongUserId/belongRate/defaultFlag/deptId/regionId`，提交审批时再回扫 DOM 收集，强依赖局部 DOM 行为。 |

排除标准：本轮只迁移“Searcher 分页 / 标准结果列表页”；弹窗内局部子列表、一次性聚合查询、前端动态行表单页面保留自绘 `displayFunc`，避免为视图切换改动其业务交互边界。

---

## 3. 分批与优先级

### P0：标准分页 + propertyArr 简单（直接迁移）

- `decoration/audit.js`
- `decoration/decoration4belong.js`
- `decoration/decorationMeasure.js`
- `decoration/decorationMeasure4apply.js`
- `decoration/decorationMeasure4setup.js`

特征：
- propertyArr 多为 `[label, value, clazz]` 三元组；
- `decorationMeasure*` 含第 4 元素 click handler（点击人员/楼盘弹详情），与 payment 中 `propertyArr[3]` 完全一致；
- 按钮固定 3–4 个，部分含 `show(v)` 条件（如 `audit.js` 的 `v.auditer`）；
- 无 checkbox、无批量操作。

### P1：标准分页 + 行内特殊 DOM（需 custom lineprop）

- `decoration/decorationPicture.js`

特征：
- Searcher 分页（`queryInspect`），但每行渲染一个图片缩略图画廊 `ace-thumbnails`，并含上传按钮；
- 依赖行内异步图片渲染与批量状态按钮；
- 改造时用 Searcher 已支持的 `lineprop.type = "custom"` + `render($liLine, v, $ulProperty)`，把 `creatLine` 内的 `$ulPicture` 构造逻辑放进 `render`。

### P2：标准分页 + 数据库驱动的动态配置（最复杂）

- `decoration/decoration.js`

特征：
- `pageConfig = drawNode.getConfig(params['urlLoadParams'].depage)`；
- propertyArr 通过 `$.each(pageConfig.propertyArr, ...)` + 大段 `switch` 动态拼装（`address/villageName/customerName/orderTotalPrice/...` 共 40+ key）；
- pageBtn 同样由数据库配置驱动，含数十种状态条件按钮；
- 表头按钮（创建/多单/国补/导出）也是 `pageConfig.pageBtn.contains(...)`；
- 迁移后必须保留 `pageConfig` 动态逻辑，仅替换外层渲染壳。

---

## 4. Searcher 公共能力现状评估

payment 迁移已为 Searcher 补齐下列能力，可直接复用：

| 能力 | 来源 | decoration 适用 |
|---|---|---|
| `lineprop.type = "custom"` + `render($liLine, v, $ulProperty, $h3)` | searcher.js | decorationPicture、decoration.js |
| `linebtns[name].clazz` 支持 function | searcher.js | decoration.js 状态按钮 |
| `linebtns[name].handle(v, btn)` 传入按钮对象 | searcher.js | decorationMeasure* 人员/楼盘信息弹窗 |
| `linebtns[name].name` 支持 function | searcher.js | decoration.js 增减项/合同按钮 |
| `linebtns[name].show(v)` 行级显示条件 | searcher.js | audit.js、decoration.js |
| `lineprop.type = "checkbox"` + `attrs/checked/click/change` | searcher.js | decoration 当前无批量需求 |
| `paymentUtils.getPropertyArr / getHistoryArr / getHistoryText / drawPaymentProperties` | paymentUtils.js | 仅适用 payment |

### 需要为 decoration 补的公共能力

decoration 的 `propertyArr` 第 4 元素 click handler 与 payment 同形态，但放在 `paymentUtils` 里语义不合适。**建议**新增 `WebContent/js/utils/decorationUtils.js`（或在 `decoration/decorationFunction.js` 内扩展），提供与 `paymentUtils` 等价的两个工具：

```js
decorationUtils.propertyText(propertyArr)        // 拼成 "label1 value1 label2 value2"
decorationUtils.drawProperties($ulProperty, arr) // 复刻 decoration 通用 strong/b 渲染，含 4 元素 click
```

这样 P0 五个文件的 propertyArr 渲染可统一改为 `custom` lineprop：

```js
{
    field: "paymentInfo",
    name: "款项信息",
    type: "custom",
    prop: function(v) { return decorationUtils.propertyText(getXxxPropertyArr(v)); },
    render: function($liLine, v, $ulProperty) {
        decorationUtils.drawProperties($ulProperty, getXxxPropertyArr(v));
    }
}
```

> 备选方案：把这两个工具直接放进 `com.*`（如 `com.drawPropertyArr`、`com.propertyText`），跨模块复用，避免 payment/decoration 各存一份。**推荐此方案**，下文按 `com.*` 表述。

---

## 5. 各文件改造步骤

### 5.1 公共准备（一次性）

1. 在 `WebContent/js/com/utils.js`（或现有公共工具文件）新增：
   ```js
   com.propertyText = function(propertyArr) { ... };
   com.drawProperties = function($ulProperty, propertyArr) { ... };
   ```
   把 `paymentUtils.getHistoryText` 内的拼字符串逻辑、`drawPaymentProperties` 的 strong/b/click 逻辑下沉到 `com.*`。
2. `paymentUtils.getHistoryText`、`paymentUtils.drawHistoryData` 改为调用 `com.*`，保持向后兼容（不改 payment 已迁页行为）。

### 5.2 P0 — audit.js

1. 抽 `getAuditPropertyArr(v)`，保留原 `v.auditer` 分支 push 逻辑。
2. 抽按钮业务函数：`auditScale(v)`、`viewAuditRecord(v)`、`viewDecorationTimeline(v)`、`applyAudit(v)`。
3. 定义 `buildAuditLinebtns()`：
   - `view` → 查看（`auditScale`）
   - `price` → 扣款（`viewAuditRecord`）
   - `addMinus` → 信息轴（`viewDecorationTimeline`）
   - `apply` → 申请审核，`show: function(v){ return !v.auditer; }`
4. 替换：
   ```js
   searcher.init(_condArr, "condList", api.decoration.pageAudit, function(data){
       displayFunc.init('resultList', data);
   }, "pagenation");
   ```
   为：
   ```js
   searcher.set("condList", "pagenation", "resultList", api.decoration.pageAudit, _condArr, "auditPostData", null, false, null);
   searcher.line("decoration.orderId", buildAuditLineprops(), buildAuditLinebtns()).render();
   ```

### 5.3 P0 — decoration4belong.js

1. propertyArr 全是 3 元组，直接转 `lineprops`（每个 `[label, value, clazz]` → `{field, name: label, prop, clazz}`）。
2. 抽按钮业务函数 `viewDecorationBelongDetail(v)`、`changeDecorationBelongDesigner(v)`、`changeDecorationBelongBussiness(v)`。
3. `buildBelongLinebtns()` 三个固定按钮：查看/设计/业务。
4. `searcher.line("orderId", buildBelongLineprops(), buildBelongLinebtns()).render()`。

### 5.4 P0 — decorationMeasure.js / decorationMeasure4apply.js / decorationMeasure4setup.js

三者结构高度相似，可同步迁移：

1. 抽 `getMeasurePropertyArr(v)`，保留 4 元素 click（用 `com.drawProperties`）。
2. 抽按钮业务函数：
   - `viewConstructionInfo(v)`
   - `showEdit(v)` / `showUpdate(v)` / `reset(v.dmid)` / `updateData()` / `saveData()`
   - decorationMeasure 额外：`qeasure4detail`（量房单）
3. `buildMeasureLinebtns()`：
   - decorationMeasure：放线/重置/信息/编辑/人员部署/量房单（按原文件实际按钮）
   - 4apply：更新/量尺/重置
   - 4setup：编辑/重置
4. 三文件均改为：
   ```js
   searcher.set("condList", "pagenation", "resultList", api.decoration.pageXxx, condArr, postDataName, extraParam, false, null);
   searcher.line("decoration.orderId", buildMeasureLineprops(), buildMeasureLinebtns()).render();
   ```

> 注意：这三文件已存在 `console.log(dmid)` / `console.log("updateData2")` 调试残留，迁移时一并清理。

### 5.5 P1 — decorationPicture.js

1. 把行内 `$ulPicture`（图片缩略图）+ 上传按钮逻辑封装进一个 custom lineprop：
   ```js
   {
       field: "pictures",
       name: "图片",
       type: "custom",
       prop: function(v){ return v.name; },
       render: function($liLine, v, $ulProperty){
           // 原 creatLine 中 $ulPicture 构造 + $uploadBtn 绑定
       }
   }
   ```
2. 表头批量按钮（批量显示/批量确认/批量隐藏）保留为 `buildPictureButtons()`，传入 `searcher.set(... buildPictureButtons)`。
3. `searcher.refresh()` 现有调用保持不变。
4. 验证点：图片上传 `<input type="file">` 的 change 依赖 `vrecord.iid`，需确保 custom render 内仍能写入模块级 `vrecord.iid`。

### 5.6 P2 — decoration.js（最复杂，单独排期）

1. 保留 `pageConfig = drawNode.getConfig(...)` 与现有 `extraParam` 构建。
2. 把原 `displayFunc` 内的 propertyArr `switch` 逻辑抽成 `buildDecorationPropertyArr(v, pageConfig)`，返回带 click 的数组。
3. lineprops 用单个 custom 项承载：
   ```js
   function buildDecorationLineprops(pageConfig){
       return [{
           field: "info",
           name: "订单信息",
           type: "custom",
           prop: function(v){ return com.propertyText(buildDecorationPropertyArr(v, pageConfig)); },
           render: function($liLine, v, $ulProperty){
               com.drawProperties($ulProperty, buildDecorationPropertyArr(v, pageConfig));
           }
       }];
   }
   ```
4. linebtns：把原 `$.each(pageConfig.pageBtn, ...)` 内 `switch b` 抽成 `buildDecorationLinebtns(pageConfig)`，每个按钮给 `show(v)` + `handle(v, btn)`；按钮内部 click 已有的 `tools.decoration.info`、`tools.house.info`、`tools.personel.info` 改为 `handle(v, btn)` 内 `tools.xxx.info(btn, ...)`。
5. 表头按钮（创建/多单/国补/导出）保留为 `buildDecorationButtons(pageConfig)`，传入 `searcher.set(... buildDecorationButtons)`；现有 `com.focusPage('a[name="create"]', '#pagenation').click(...)` 等 pager 按钮事件绑定保持。
6. 替换 `searcher.init(... displayFunc.init('resultList', data) ...)` 为：
   ```js
   searcher.set("condList", "pagenation", "resultList", pageConfig.apiPage, pageConfig.condArr, pageConfig.postDataName, extraParam, false, buildDecorationButtons);
   searcher.line("orderId", buildDecorationLineprops(pageConfig), buildDecorationLinebtns(pageConfig)).render();
   ```
7. 验证点：
   - `pageConfig.propertyArr`、`pageConfig.pageBtn`、`pageConfig.hasExport`、`pageConfig.extraParam`、`pageConfig.companyType` 全部仍可用；
   - 导出按钮（`com.focusPage('a[name="import"]', '#pagenation')`）逻辑不变；
   - `openCreateOrder` 内 `searcher.doSearch()` 仍有效。

---

## 6. 风险与验证

### 6.1 风险点

1. **decoration.js 动态配置**：`pageConfig` 来自数据库，lineprops/linebtns 必须在 `searcher.line(...)` 调用前完成构造；当前 IIFE 模式是闭包内即时构造，迁移后改成函数调用，时序一致，但需回归测试所有 depage 变体。
2. **decorationPicture 图片上传**：custom render 的 DOM 生命周期与 `$input.change` 监听需保持模块级状态，不能放进 render 闭包局部变量。
3. **propertyArr 4 元素 click**：必须确保 `com.drawProperties` 的 click 绑定语义与原 decoration 一致（点击 `<b>` 触发 `handler($b)`）。
4. **CRLF / 空白**：decoration 现有文件多为 CRLF，迁移后须统一为 CRLF 并通过 `git -c core.whitespace=blank-at-eol,blank-at-eof,space-before-tab,cr-at-eol diff --check`。

### 6.2 验证清单

每个文件迁移后执行：

```bash
node --check WebContent\js\decoration\<file>.js
findstr /s /n /c:"displayFunc" WebContent\js\decoration\<file>.js   # 仅 audit4record、decorationBelong 允许命中
findstr /s /n /c:"searcher.init" WebContent\js\decoration\<file>.js  # 应无命中
git -c core.whitespace=blank-at-eol,blank-at-eof,space-before-tab,cr-at-eol diff --check
```

全部完成后整体验证：

```bash
findstr /s /n /c:"displayFunc" WebContent\js\decoration\*.js
# 仅应剩 audit4record.js、decorationBelong.js（已记录排除依据）
```

---

## 7. 推进顺序

```text
0. 公共：com.propertyText / com.drawProperties（一次性）
   ↓
1. P0 五件：audit / decoration4belong / decorationMeasure*3
   ↓
2. P1 decorationPicture
   ↓
3. P2 decoration.js（单独排期，回归测试覆盖所有 depage）
   ↓
4. 文档：将本计划执行结果回写 docs/searcher_view_mode_adjustment_summary.md
```

每完成一批：`node --check` → `git status` → 用户确认 → 提交并推送 `master`。

---

## 8. 不建议改动项

- `audit4record.js`、`decorationBelong.js`：保持自绘 `displayFunc`（见第 2.2 节排除依据）。
- `decorationFunction.js`、`decorationPageUtils.js`（`drawNode.getConfig`）：迁移不触碰配置加载逻辑。
- decoration 模块的非 displayFunc 页面（`decoration4refer.js`、`decoration4service.js`、`decorationAccount.js`、`decorationActivityRecord.js`、`decorationBalance.js` 等已用 `searcher.line`）：无需改动。
