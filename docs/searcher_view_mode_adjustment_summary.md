# Searcher 视图切换与 DisplayFunc 兼容调整总结

> 日期：2026-06-24
> 范围：`Searcher` 视图模式、`UserPrefer` 个性化配置、`table` 兼容增强、`sales.js` displayFunc 迁移试点

---

## 1. 背景

原系统大量分页页面使用 `Searcher`，但展示方式分散：

- 标准 Searcher 页面：使用 `line/card/table` 方法；
- 自定义页面：使用 `searcher.init(..., displayFunc, ...)` 自行渲染；
- 不同页面字段、按钮、显示条件和业务操作逻辑不统一。

本轮调整的目标是：

1. 将标准 Searcher 页面统一接入 `line/card/table` 视图能力；
2. 通过 `UserPrefer` 保存用户级视图偏好；
3. 优化 `table` 模式字段、按钮和样式表现；
4. 探索复杂 `displayFunc` 页面向 `lineprops + linebtns` 转换的路径；
5. 以 `sales.js` 作为复杂页面迁移试点。

---

## 2. UserPrefer 设计与落地

### 2.1 表结构

新增表：

```sql
communion.userprefer
```

核心字段：

| 字段 | 说明 |
|---|---|
| `upid` | 主键 |
| `userId` | 用户编号 |
| `module` | 模块，如 `searcher` |
| `page` | 页面或全局标识 |
| `pkey` | 偏好键 |
| `pvalue` | 偏好值 |
| `company` | 公司 |

唯一键：

```text
userId + module + page + pkey + company
```

### 2.2 后端模块

`UserPrefer` 已归属到 `personel` 模块：

```text
src/com/fanglin/personel/action/UserPreferAction.java
src/com/fanglin/personel/service/UserPreferService.java
src/com/fanglin/personel/service/impl/UserPreferServiceImpl.java
src/com/fanglin/personel/dao/UserPreferDao.java
src/com/fanglin/personel/dao/impl/UserPreferDaoImpl.java
src/com/fanglin/personel/po/UserPreferPO.java
src/com/fanglin/personel/vo/UserPreferVO.java
```

已支持接口：

```text
queryUserPrefer.do
queryUserPrefers.do
updateUserPrefer.do
```

### 2.3 前端 API

`UserPrefer` 前端接口归属：

```text
WebContent/js/api/personel.js
```

示例：

```js
api.personel.queryUserPrefers
api.personel.updateUserPrefer
```

### 2.4 登录后一次性加载

登录后在 `index.js` 中批量加载用户偏好：

```js
params.user.prefer[module][page][pkey] = pvalue;
```

Searcher 相关偏好统一加载：

```js
userPrefer.module = "searcher"
```

避免每个页面重复调用 `queryUserPrefer.do`。

---

## 3. Searcher 视图模式调整

### 3.1 初始方案

最初将 `line/card/table` 切换按钮渲染到分页区域右上角，用户可以在页面内切换。

后续需求调整为：

> 页面内不再显示切换按钮，切换入口放到个人资料页。

### 3.2 当前方案

`Searcher` 页面内隐藏切换按钮：

```js
renderViewSwitcher()
```

当前仅清理旧按钮并返回，不再渲染页面级切换按钮。

### 3.3 个人资料页配置默认视图

页面：

```text
WebContent/views/system/userProfile.html
WebContent/js/system/userProfile.js
```

新增配置：

```text
默认视图：列表 / 卡片 / 表格
```

保存到：

```text
module = searcher
page = global
pkey = viewMode
pvalue = line/card/table
```

Searcher 初始化时优先读取：

```js
params.user.prefer.searcher.global.viewMode
```

再回退页面级：

```js
params.user.prefer.searcher[page].viewMode
```

---

## 4. Searcher.table 增强经验

本轮 `table` 模式经历多轮修复，形成以下经验。

### 4.1 兼容非字段配置

`lineprops` 中可能存在：

```js
{ type: "newline" }
```

`table` 渲染时需要跳过无 `prop` 的配置，否则会出现：

```text
Cannot read properties of undefined (reading 'split')
```

### 4.2 功能按钮不能简单复用 layui toolbar

早期 table 使用 layui toolbar 统一渲染按钮，问题包括：

- 按钮过多时挤压；
- `show(v)` 只在点击时判断，显示隐藏失效；
- `obj.data` 丢失原始行数据；
- 功能按钮触发异常。

最终改为：

- 每行动态生成按钮；
- 渲染前执行 `button.show(v)`；
- 前 2 个按钮直接显示；
- 多余按钮折叠到“更多”；
- 点击时通过 `basicConf.lastData[index]` 获取原始数据。

### 4.3 “更多”菜单需要全局清理

“更多”菜单挂载到 `body`，不能使用：

```js
com.focusPage(...)
```

否则清理不到。

应使用：

```js
$('.searcher-table-more-menu').remove();
```

### 4.4 字段 field 自动补全

部分页面字段配置存在拼写错误或缺失：

```js
fieId: "no"
prop: "no"
```

`table` 模式应根据 `prop` 自动补全：

```js
field = prop.replace(/[^A-Za-z0-9_]/g, '_')
```

避免字段不显示。

### 4.5 字段级 show 支持

字段也可能配置：

```js
show: function(v) { ... }
```

`table` 模式需要：

1. 判断当前页是否至少一行需要显示该列；
2. 每行单元格根据 `show(v)` 决定是否显示内容。

### 4.6 字段样式 clazz 支持

`line/card` 中字段样式通过：

```js
clazz: "blue"
```

实现。

`table` 中也应包一层：

```html
<span class="blue">...</span>
```

同时支持：

```js
clazz: function(v) { ... }
```

### 4.7 列宽自适应

`table` 当前支持根据当前页内容计算列宽：

- 保留页面显式 `width`；
- 根据标题和内容长度计算宽度；
- 时间字段、单号字段、备注字段使用不同宽度范围；
- 防止长文本无限撑开。

---

## 5. DisplayFunc 兼容经验

### 5.1 displayFunc 不能自动转换

`displayFunc` 页面只向 Searcher 暴露了：

```js
data
```

Searcher 不知道：

- 标题字段；
- 字段列表；
- 字段样式；
- 按钮列表；
- 显示条件；
- 按钮业务逻辑。

因此不能完全自动兼容。

### 5.2 正确方式

将自定义 `displayFunc` 的核心逻辑拆成：

```text
字段配置 -> lineprops
按钮配置 -> linebtns
业务动作 -> 独立函数
```

之后交给标准 Searcher：

```js
searcher.line(title, lineprops, linebtns).render();
```

---

## 6. sales.js 试点调整

### 6.1 原问题

`sales.js` 的 `displayFunc` 逻辑复杂，包含：

- 字段 switch；
- 按钮 switch；
- 大量按钮事件；
- activity 特殊结构：

```js
if (sales.pageType == "activity") {
    sales.activity = v.activity.name;
    v = v.sales;
}
```

### 6.2 activity 拆分

新增：

```text
WebContent/views/sales/salesActivity.html
WebContent/js/sales/salesActivity.js
```

activity 页面暂保留原 displayFunc 逻辑，专门处理 activity 的特殊返回结构。

普通 `sales.js` 中加入保护：

```js
if (sales.pageType == "activity") {
    com.switchPage("views/sales/salesActivity.html");
    return false;
}
```

### 6.3 普通 sales 转标准 Searcher

普通 sales 页面移除原 displayFunc 主体，改为：

```js
salesSearcher.base("condList", "pagenation", "resultList", pageConfig.apiPage);
salesSearcher.condition(pageConfig.condArr);
salesSearcher.history(sales.postData);
salesSearcher.line("no", buildSalesLineprops(), buildSalesLinebtns()).render();
```

### 6.4 字段转换

根据 `pageConfig.propertyArr` 生成 `lineprops`。

典型字段：

```js
orderId
address
customer
salesman
brand
status
total
comment
```

字段支持：

- `prop` 字符串；
- `prop` 函数；
- `clazz`；
- `click`。

### 6.5 按钮转换

根据 `pageConfig.pageBtn` 生成 `linebtns`。

典型按钮：

```js
add
sub
collect
money
terminal
print
activity
saledelivery
picture
satisfaction
```

按钮支持：

- `name`；
- `clazz`；
- `show(v)`；
- `handle(v)`。

### 6.6 业务函数抽取

原来写在 `$btn.click(...)` 中的逻辑抽成函数：

```js
addSales(v)
salesItem(v)
supplementSales(v)
collectSales(v)
moneySales(v)
terminalSales(v)
printSales(v)
pictureSales(v)
```

这样 `line/card/table` 按钮都复用同一套业务函数。

---

## 7. 当前验证方式

前端语法检查：

```bash
node --check WebContent/js/com/searcher.js
node --check WebContent/js/sales/sales.js
node --check WebContent/js/sales/salesActivity.js
node --check WebContent/js/system/userProfile.js
```

关键功能验证建议：

1. 用户资料页设置默认视图；
2. 普通 sales 页面按 profile 配置显示 line/card/table；
3. sales 页面功能按钮 show 条件正确；
4. sales 页面按钮业务正常；
5. 旧 activity 入口能跳转到 salesActivity；
6. salesActivity 页面查询和原展示保持一致；
7. table 模式字段样式、字段宽度、更多按钮正常。

---

## 8. 风险与注意事项

### 8.1 大型 displayFunc 页面迁移风险高

像 `sales.js` 这种页面按钮多、弹窗多、状态多，迁移时必须逐个核对业务按钮。

### 8.2 activity 拆分后入口需要核实

虽然普通 `sales.js` 已做旧入口跳转，但仍建议后续把菜单或权限配置中的 activity URL 直接改为：

```text
views/sales/salesActivity.html
```

### 8.3 line/card/table 不一定适合所有 displayFunc 页面

不是所有自定义页面都适合 card/table。

建议迁移策略：

1. 字段和按钮简单的页面优先迁移；
2. 特殊数据结构先拆页面；
3. 高复杂页面可以保留 custom；
4. 每次迁移只做一个页面或一个业务域。

### 8.4 Searcher.table 的增强经验应作为规范

以后新增字段时建议优先使用：

```js
field
name
prop
clazz
show
click
width
```

避免临时字段名或拼写错误。

---

## 9. 后续建议

### 9.1 抽公共转换工具

后续如果多个 displayFunc 页面都需要迁移，可以考虑抽：

```js
buildLinepropsByConfig(propertyArr, propertyMap)
buildLinebtnsByConfig(pageBtn, buttonMap)
```

减少重复代码。

### 9.2 支持 custom fallback

如果后续希望 Searcher 更稳地兼容 displayFunc，可以增加：

```js
searcher.custom(...)
searcher.view(...)
```

当全局视图模式当前页面不支持时，自动回退原 displayFunc。

### 9.3 activity 页面继续独立标准化

`salesActivity.js` 当前可以先保留 displayFunc，后续也可以单独转换为：

```js
lineprops + linebtns
```

但它的数据结构应始终独立于普通 `sales.js`。

---

## 10. Payment 模块迁移与排除依据

### 10.1 已纳入 Searcher 标准化的页面

`WebContent/js/payment` 中使用 Searcher 分页或标准查询结果容器的页面，已按 `lineprops + linebtns + searcher.line(...).render()` 迁移：

```text
receipt.js
paytran.js
wallet.js
activityPayment.js
proxyPayment.js
oalesPayment.js
materialPayment.js
servicePayment.js
salesPayment.js
decorationPayment.js
payment.js
```

迁移时保留原页面的批量选择、批量确认、批量收款、合计、导出、打印、更新、收款码、POS 推送、微信推送、金蝶同步等按钮逻辑。

### 10.2 Searcher 公共能力补充

Payment 页面存在“收款方式历史”这类原 `displayFunc` 直接追加 DOM 的场景，因此 Searcher 增加了：

- `lineprops` 的 `type: "custom"` 行级自定义渲染；
- `line/card/table` 按钮 `clazz` 函数支持；
- `handle(v, btn)` 当前按钮入参；
- `card/table` checkbox 配置复用。

`paymentUtils` 增加：

```js
getHistoryArr(...)
getHistoryText(...)
```

用于 line 模式保留原历史 DOM，同时让 card/table 模式显示文本化收款方式。

### 10.3 明确排除的 displayFunc

以下文件仍保留 `displayFunc`，但不纳入本轮 payment Searcher 标准化范围：

| 文件 | 排除依据 |
|---|---|
| `payment/customer.js` | 不是 Searcher 分页页；通过 `selectBtn` 按订单号一次性调用 `queryDecorationPaymentByOrderId`、`querySalesPaymentByOrderId`、`pageAdvancePayment`，分别渲染到 `decoration`、`sales`、`advance` 三个结果容器，属于客户收款聚合面板。 |
| `payment/walletard.js` | 不是 Searcher 分页页；钱包页弹出的银行卡子列表，通过 `queryWalletard` 按 `params.payment.wid` 查询并渲染到 `walletardResultList`，依赖弹窗内绑定/解绑/删除后局部刷新。 |
| `payment/walletran.js` | 不是 Searcher 分页页；钱包页弹出的交易记录子列表，通过 `queryWalletran` 按 `params.payment.wid` 查询并渲染到 `walletranResultList`，无分页器、无 Searcher 条件区。 |

排除标准：本轮只迁移“Searcher 分页 / 标准结果列表页”；弹窗内局部子列表、一次性聚合查询、多容器展示页面保留自绘 `displayFunc`，避免为了视图切换改动其业务交互边界。

---

## 11. 总结

本轮调整形成了一个重要经验：

> Searcher 标准化不是简单替换渲染函数，而是将页面的“字段、按钮、显示条件、业务动作”结构化。

对于复杂 `displayFunc` 页面，推荐迁移路径是：

```text
拆特殊数据结构
    -> 抽字段 map
    -> 抽按钮业务函数
    -> 抽按钮 map
    -> 接入 Searcher.line/card/table
```

`sales.js` 是该路径的第一个复杂试点。后续迁移其他复杂页面时，可以沿用同样模式。


## 12. Decoration 模块迁移记录

依据 `docs/decoration_searcher_migration_plan.md`，对 `WebContent/js/decoration/*.js` 中
仍使用 `displayFunc` IIFE 的 7 个标准分页页完成 Searcher 标准化迁移。

### 12.1 迁移范围

| 文件 | apiPage | 迁移策略 |
|---|---|---|
| `audit.js` | `pageAudit` | propertyArr + 4 行按钮 -> `buildAuditLineprops/buildAuditLinebtns` |
| `decoration4belong.js` | `pageDecorationForBelong` | propertyArr + 3 行按钮 -> `buildBelongLineprops/buildBelongLinebtns` |
| `decorationMeasure.js` | `pageDecorationMeasure` | propertyArr(含点击 tools.info) + 1 行按钮 |
| `decorationMeasure4apply.js` | `pageDecorationMeasureForApplay` | propertyArr(含点击) + 3 行按钮(更新/量尺/重置) |
| `decorationMeasure4setup.js` | `pageDecorationMeasure` | propertyArr(含点击) + 2 行按钮(编辑/重置) |
| `decorationPicture.js` | `queryInspect` | 行内图片缩略图容器, 用 `custom` lineprop render 追加 `$ulPicture` |
| `decoration.js` | `pageConfig.apiPage` | pageConfig 驱动, propertyArr/pageBtn 全部由 `buildDecorationLineprops` 的 `propertyMap` + `buildDecorationLinebtns` 动态生成, IIFE 内 30+ 业务函数(viewDecoration*/signOrder/terminalOrder 等)全部上提到模块作用域 |

排除迁移（非 Searcher 分页页）：

| 文件 | 排除依据 |
|---|---|
| `audit4record.js` | 审核详情子页, 一次性拉取局部渲染到 `auditR/auditS`, 无分页 |
| `decorationBelong.js` | 归属详情子页, 前端动态 `append(displayFunc(addRow))` 增行, 强依赖局部 DOM |

### 12.2 跨模块 helper 放置规则（关键决策）

- payment 迁移时把字段拼装收敛到 `paymentUtils.getPropertyLineprops(payment, statusArr)`，
  返回**标准 lineprop 数组**（每个字段一个独立 `{field, name, prop, clazz, click?, show?}`），
  不再使用 `type: "custom"` 的整行拼字符串方式（详见 12.5）。
- decoration 迁移没有跨文件复用的 propertyArr 文本拼接需求，
  `decorationUtils.propertyText/drawProperties` 已移除，保持 utils 职责单一。

### 12.3 decoration.js 复杂度处理（P2）

`decoration.js` 原 `displayFunc` IIFE 体量大、强耦合数据库 `decorationFunctionRight`：

1. `renderList/creatLine` 的字段构造（`switch(pv)` 30+ 分支）与按钮显隐（`switch(b)` 30+ 分支）
   被重写为：
   - `buildDecorationLineprops()` —— 内部维护 `propertyMap`（40+ 个标准 lineprop），
     按 `pageConfig.propertyArr` 顺序 `$.each` 取出对应 lineprop 推入数组；
     `sdesignTime` 键同时产出 `sdesignTime` 和 `edesignTime` 两个 lineprop；
   - `buildDecorationLinebtns()` —— 33 个按钮，每个 `show` 复刻原 status 判定，`handle` 调用原 helper。
2. IIFE 内业务函数（`viewDecorationDetail/viewDecorationQuotateIndex/modalDrawLineModal/
   signOrder/aerminalOrder/terminalOrder/resignOrder/...` 共 30+ 个）**全部保留**，
   通过 Python 脚本将声明行缩进由 8 空格降为 4 空格，整体上提到 `$(function(){})` 模块作用域，
   避免任何 `ReferenceError`。
3. 原 `searcher.init(condArr, "condList", apiPage, function(data){ displayFunc.init(...) }, "pagenation",
   postDataName, extraParam, false, null, function(){ ...buttons... })` 改写为：
   - `searcher.set("condList", "pagenation", "resultList", apiPage, extraParam, condArr, postDataName, null, false, buildDecorationButtons)`；
   - `searcher.line(function(v){return v.orderId}, buildDecorationLineprops(), buildDecorationLinebtns()).render()`；
   - 原 buttons 回调体提取为独立 `buildDecorationButtons()` 函数。

### 12.4 Payment 模块 propertyMap 标准化（本轮新增）

`sales.js` 表格显示正常、而 `payment.js`/`decoration.js` 表格字段挤成一列的根因：
原实现用单个 `type: "custom"` lineprop，其 `prop(v)` 返回整行字段的拼接字符串，
Searcher 的 table 模式只会对该 `prop(v)` 调用一次并把结果当作**一个单元格**，
因此整行字段塌缩成一列文本。

修复方式（对齐 `sales.js`）：

1. `paymentUtils.getPropertyArr(payment, v, decoration, statusArr)` 改为
   `paymentUtils.getPropertyLineprops(payment, statusArr)`，返回标准 lineprop 数组。
   每个 case 由 `propertyArr.push([label, value, clazz, clickFn])` 改写为
   `propertyMap[key] = { field, name, prop (string|fn), clazz, click?, show? }`，
   最后按 `pageConfig.propertyArr` 顺序挑选。
2. **关键：行级业务对象按页类型在 `prop/click` 内部解析**。新增内部函数：

   ```js
   function deco(v) {
       switch (payment.htmlName) {
           case "activity":
           case "proxy":  return v;
           case "material": return v.material;
           case "sales":    return v.sales;
           case "oales":    return v.oales.decoration;
           default:         return v.decoration;
       }
   }
   ```

   等价于旧实现外部传入的 `decoration` 参数，但**按行取值**，避免在 lineprop 构建期
   （尚无 `v`）引用 `v.decoration` 导致运行时塌缩。
3. 8 个 payment 页面的 `buildXxxLineprops()` 调用统一改为
   `paymentUtils.getPropertyLineprops(ctx, statusArr)`（去掉第二个 `v.decoration`/`v.sales`/`v.material`/`v.oales.decoration` 实参）。
4. **保留的合法 custom lineprop**：仅 `payway`（收款方式历史）一处，
   `prop` 走 `getHistoryText`、`render` 走 `drawHistoryData`，
   因为它需要在 line/card 模式渲染自定义 DOM（`<ul>` 列表），不是纯文本字段。
   decoration 模块**无任何** `type: "custom"` 残留。

### 12.5 验证

- `node --check` 全部通过（17 个文件：8 payment + 7 decoration + paymentUtils + decorationUtils）。
- `findstr /s /n displayFunc WebContent/js/decoration/*.js` 仅余排除项：
  `audit4record.js`、`decorationBelong.js`。
- `findstr type:"custom"`：decoration 模块 0 处；payment 模块仅余 `payway` 合法一处。
- `paymentUtils.getPropertyLineprops` 签名由 `(payment, decoration, statusArr)` 收敛为
  `(payment, statusArr)`；8 个 payment 调用点全部更新，无 `v.decoration` 残留实参。
- 行尾与编码：所有改动文件保持 CRLF（decoration.js 带 UTF-8 BOM，其余 noBOM，与 HEAD 一致），
  `git -c core.whitespace=cr-at-eol diff --check` 无空白告警。


## 13. Data 模块迁移记录

依据 decoration / payment 迁移经验，对 `WebContent/js/data/` 下仍使用 `displayFunc` 的 19 个标准分页页完成 Searcher 标准化迁移。

### 13.1 迁移范围

| 文件 | apiPage | 迁移策略 |
|---|---|---|
| `category.js` | pageCategory | propertyArr 6 字段 + 1 编辑按钮 → `buildCategoryLineprops/buildCategoryLinebtns` |
| `label.js` | pageLabel | propertyArr 2 字段 + status switch + 编辑 → `buildLabelLineprops/buildLabelLinebtns` |
| `drawlineGroup.js` | pageDrawlineGroup | propertyArr 1 字段(show) + status switch + 编辑 → `buildGroupLineprops/buildGroupLinebtns` |
| `flowpath.js` | pageFlowpath | propertyArr 4 字段 + 3 按钮(修改/节点/删除) → `buildFlowpathLineprops/buildFlowpathLinebtns` |
| `aoodsCost.js` | pageAoodsCost | propertyArr 6 字段(含 constructionCost 嵌套) + 删除 → `buildAoodsCostLineprops/buildAoodsCostLinebtns` |
| `aoodsCharge.js` | pageAoodsCharge | propertyArr 6 字段(constant 映射) + 编辑/删除 → `buildAoodsChargeLineprops/buildAoodsChargeLinebtns` |
| `instorer.js` | pageInstorer | propertyArr 3 字段 + status switch + 编辑 → `buildInstorerLineprops/buildInstorerLinebtns` |
| `constructionCost.js` | pageConstructionCost | propertyArr 6 字段 + status switch + 编辑 → `buildConstructionCostLineprops/buildConstructionCostLinebtns` |
| `constructionPace.js` | pageConstructionPace | propertyArr 5 字段 + 编辑/节点按钮(无 status API,移除 switch) → `buildPaceLineprops/buildPaceLinebtns` |
| `constructionPeriod.js` | pageConstructionPeriod | propertyArr 4 字段 + 编辑/节点按钮(同上) → `buildPeriodLineprops/buildPeriodLinebtns` |
| `normadd.js` | pageNormadd | propertyArr 4 字段 + status switch + 删除 → `buildNormaddLineprops/buildNormaddLinebtns` |
| `normpack.js` | pageNormpack | propertyArr 1 字段 + status switch + 项目/删除 → `buildNormpackLineprops/buildNormpackLinebtns` |
| `supplier.js` | pageSupplier | propertyArr 3 字段 + 驻店/编辑 + status switch → `buildSupplierLineprops/buildSupplierLinebtns` |
| `talking.js` | pageTalking | propertyArr 4 字段 + 更新/status switch/删除 → `buildTalkingLineprops/buildTalkingLinebtns` |
| `taskParam.js` | communion.pageTaskParam | propertyArr 14 字段 + pageType 分支(status/编辑/删除 仅非 task 模式) → `buildTaskParamLineprops/buildTaskParamLinebtns` |
| `userLabel.js` | personel.pageUser | propertyArr 6 字段(嵌套 dept/duty/role) + 编辑/标签 → `buildUserLabelLineprops/buildUserLabelLinebtns` |
| `decorationMeasureRule.js` | pageDecorationMeasureRule | propertyArr 2 字段 + status switch + 修改/明细/删除 → `buildMeasureRuleLineprops/buildMeasureRuleLinebtns` |
| `receiptType.js` | pageReceiptType | propertyArr 11 字段 + custom lineprop(receiptTypeItems 动态) + status switch + 修改/单据 → `buildReceiptTypeLineprops/buildReceiptTypeLinebtns` |
| `village.js` | pageVillage | img lineprop + propertyArr 9 字段 + status switch + pageType 分支(village:5按钮 / houseLayout:1按钮) → `buildVillageLineprops/buildVillageLinebtns` |
| `soods.js` | pageSoods | qrcode+img lineprop + propertyArr 10 字段 + pageType 分支(basic:项目/图片 / 非:项目/编辑/status/删除) + pager 4按钮(导出/批量更新/启用/禁用) → `buildSoodsLineprops/buildSoodsLinebtns` |

### 13.2 排除迁移（非 Searcher 分页）

| 文件 | 排除依据 |
|---|---|
| `chainpage.js` | `com.post(api.data.queryChainPage)` 一次性拉取, 无分页器、无 Searcher 条件区 |
| `goods4view.js` | `com.post` 一次性拉取, 自绘 `flex-table` 表格(非 item-list 结构) |
| `cormrice.js` | `com.post(api.data.queryCormriceByQcid)` 按 `qcid` 一次性拉取, 无分页 |
| `paymentScale.js` | `com.post(api.data.queryPaymentScale)` 按 `cid` 一次性拉取 |
| `soods2create.js` | `com.post(api.data.querySoodsItemByQiid)` 一次性拉取, 弹窗子列表 |

### 13.3 关键技术点

1. **status switch 统一使用 `linebtns.type = "switch"`**：`init(v)` 返回初始选中状态, `handle(v, checked)` 执行状态切换; 替代了原先各文件内手写的 `$statusSwitch.switchBtn().on("click")` 模式。
2. **constructionPace / constructionPeriod 无 ForStatus API**：原代码中 status switch 虽有 UI 但无对应后端接口(点击无实际效果), 迁移时直接移除 switch。
3. **receiptType 动态 receiptTypeItems**：使用 `type: "custom"` lineprop, `prop(v)` 返回文本摘要(供 card/table 模式), `render($liLine, v, $ulProperty)` 向 line 模式追加 `<strong>/<b>` DOM。
4. **village 行内图片**：使用 `type: "img"` lineprop, Searcher 自动渲染 75×75 缩略图。
5. **soods 二维码+图片**：分别使用 `type: "qrcode"` 和 `type: "img"` lineprop, Searcher 自动渲染。
6. **pageType 分支**：taskParam、village、soods 等文件的按钮组根据 `pageType` 动态构建 `linebtns/buttons`。
7. **flowpath 残留 `displayFunc.init()`**：更新回调中的 `displayFunc.init()` 已改为 `searcher.doSearch()`。

### 13.4 验证

- `node --check` 全部通过(19 个文件)。
- `findstr /s /n displayFunc WebContent/js/data/*.js` 仅余排除项：`chainpage.js`、`cormrice.js`、`goods4view.js`、`paymentScale.js`、`soods2create.js`。
- `findstr /s /n searcher.init WebContent/js/data/*.js`：0 命中(排除非 data 模块文件)。

## 14. Personnel 模块迁移记录

### 14.1 迁移范围

| 批次 | 难度 | 文件 | 特征 |
|------|------|------|------|
| P0-简单 | 🟢 | `departmentType.js` | 无属性、无按钮，仅 h3 |
| P0-简单 | 🟢 | `user4base.js` | 3按钮(查看/编辑/工作经历) |
| P0-中等 | 🟡 | `avenger.js` | 3按钮(权配/重置密码/默认密码) |
| P0-中等 | 🟡 | `merchant.js` | 同 avenger |
| P0-中等 | 🟡 | `duty.js` | 状态开关 + 定岗信息按钮 |
| P0-中等 | 🟡 | `department.js` | 状态开关 + type条件按钮(定岗/合作/编辑) |
| P0-复杂 | 🟠 | `instorer.js` | pageType条件按钮 + 位掩码 extranet advance |
| P0-复杂 | 🟠 | `supplier.js` | 同 instorer + 合同/服务费按钮 |
| P0-复杂 | 🟠 | `performance.js` | 内联 type/level 映射 |
| P0-复杂 | 🟠 | `userRequire.js` | 3审批按钮(通过/拒绝/完成) |
| P1-高复杂 | 🔴 | `user4advance.js` | binding 对象 + 位掩码 extranet + setAdvance + pageType 条件按钮 |
| P1-高复杂 | 🔴 | `user4right.js` | binding 对象 + setAdvance + 10个权配按钮 |
| P1-高复杂 | 🔴 | `user.js` | 配置驱动(userUtils.getConfig)、img、qrcode、钉钉集成、syncRight |

### 14.2 额外迁移

`organization.js` — 原为树节点选中后触发 `searcher.init` 的懒加载页面，本轮一并迁移：将 `displayFunc` IIFE 替换为 `buildOrganizationLineprops()`，并在 `ace_tree` 的 `selected` 事件中改用 `userSeacher.set(...).line(...).render()`。

### 14.3 未迁移文件

`user2export.js` — 使用 `searcher.init` 旧式 API 但非标准 item-list（导出页面，多步表单），不在本轮迁移范围。

### 14.4 关键技术点

1. **binding 对象提取**：user4advance.js / user4right.js / user.js 的 `binding` 对象原嵌套在 `displayFunc` IIFE 内，迁移后提取为顶层变量，`displayFunc.setAdvance()` 改为 `binding.setAdvance()`。
2. **配置驱动按钮**：user.js 通过 `user.pageConfig.pageBtn.contains(...)` 动态决定按钮，迁移后通过 `buildUserLinebtns()` 中的 if 判断实现，使用 linebtn 的 `show` 回调处理条件显示（如钉钉按钮仅在职状态显示）。
3. **图片属性**：user.js 的用户头像原通过 `$urldiv` + `com.showImg()` 渲染，迁移后使用 `{type: "img", prop: "userPhoto"}` lineprop，Searcher 自动处理。
4. **状态开关**：duty.js / department.js 的 `ace-switch` 手动实现，迁移后统一为 `{type: "switch", init, handle}` 标准格式。
5. **pageType 分支**：department.js、instorer.js、supplier.js、user4advance.js 的按钮组根据 `pageType` 在 `buildXxxLinebtns()` 内 if 判断动态构建。
6. **拼写修正**：avenger.js、instorer.js、merchant.js、supplier.js、userRequire.js、performance.js 中 `seacher` → `searcher`。
7. **userRequire.js 变量引用**：`seacher.doSearch()` 在 saveData/currency/refuse/complete 4处改为 `searcher.doSearch()`。

### 14.5 验证

- `node --check` 全部通过(14 个文件，含 organization.js)。
- `findstr /s /n displayFunc WebContent/js/personnel/*.js`：0 命中。
- `findstr /s /n searcher.init WebContent/js/personnel/*.js`：仅 `user2export.js`（导出页，不在范围）。

## 15. Approval 模块迁移记录

### 15.1 迁移范围

| 批次 | 难度 | 文件 | 特征 |
|------|------|------|------|
| P0 | 🟢 | `approval4user.js` | 4属性内联 + 删除按钮 + 添加按钮，typeahead |
| P1 | 🟡 | `process.js` | 4属性内联 + 编辑/状态开关/删除 + 添加按钮 |
| P2 | 🔴 | `approval4common.js` | 配置驱动(getConfig)，getPropertyArr 大型 switch，pageConfig-gated 审批按钮 |

### 15.2 未迁移文件

- `approval4track.js` — 已使用 `searcher.base` 新式 API，无需迁移。
- `approvalFunction.js / process2create.js` — 非列表页（表单管理/流程创建）。

### 15.3 关键技术点

1. **配置驱动 lineprops**：approval4common.js 的 `getPropertyArr(v)` 大型 switch 迁移到 `buildApprovalCommonLineprops()`，将 `[label, value, clazz, click?]` 数组项转为标准 lineprop 对象 `{field, name, prop, clazz, click?}`。`constant.*.keys[...]` 状态映射用 `prop: function(v)` 实现。
2. **属性点击事件**：`approval.receiver.currentName` 原通过 propertyArr 第 4 元素 click 回调查看接收人信息，迁移后用 lineprop 的 `click: function(v, $b)` 属性实现。
3. **配置驱动按钮**：approval4common.js 的通过/拒绝按钮通过 `pageConfig.pageBtn.contains("pass"/"refuse")` 条件 + linebtn 的 `show` 回调实现双重控制（show 回调处理 `!v.piid && status && type != 'send'` 状态条件）。
4. **审批弹层逻辑保留**：approval4common.js 的 `approveModal`、`proapprove()`、`approve()` 函数保留在顶层，按钮 handle 调用 `proapprove()` 触发弹层。
5. **状态开关**：process.js 的 ace-switch 统一为 `{type: "switch", init: v.status == 0, handle}`，状态属性 "启用/禁用" 用 `prop: function(v)` 实现。
6. **typeName 作用域修正**：approval4common.js 原在 displayFunc IIFE 内修改 `typeName`（decoration/origin → customerOrigin），迁移后将 typeName 赋值与重映射前置到顶层声明处。

### 15.4 验证

- `node --check` 全部通过(3 个文件)。
- `findstr /s /n displayFunc WebContent/js/approval/*.js`：0 命中。
- `findstr /s /n searcher.init WebContent/js/approval/*.js`：0 命中。


## 16. Customer 模块迁移记录

### 16.1 迁移范围

| 批次 | 难度 | 文件 | 特征 |
|------|------|------|------|
| P0 简单 | 🟢 | `consultion.js` | 3 属性，无按钮 |
| P0 简单 | 🟢 | `vustomerShared.js` | 9 属性，1 认领按钮 |
| P0 简单 | 🟢 | `emember.js` | 6 属性，1 删除按钮 |
| P0 中等 | 🟡 | `complain.js` | 8 属性，3 状态条件按钮(投诉/完成/关闭) |
| P0 中等 | 🟡 | `crowd.js` | 3 属性，4 orderId 条件按钮(编辑/绑定/添加用户/解绑) |
| P0 中等 | 🟡 | `vustomer.js` | 9 属性，2 状态按钮(评分/发布) |
| P0 中等 | 🟡 | `vustomerAdvance.js` | 10 属性，4 按钮(绑定/记录/评分/归属) |
| P0 中等 | 🟡 | `revisit.js` | 8 属性，无行按钮，仅添加按钮 |
| P0 复杂 | 🔴 | `crowdUser.js` | 3 属性，1 删除按钮，specialParams orderId |
| P0 复杂 | 🔴 | `aepair.js` | 12 属性(6 状态枚举)，9 按钮 |
| P0 复杂 | 🔴 | `vscoreRecord.js` | 双分支(`vscore.id==2`)，共享 `buildVscoreRecordLineprops()` |
| P0 复杂 | 🔴 | `feedback.js` | img lineprop + 13 属性 + 7 按钮，条件标题 |
| P1 高复杂 | 🔴 | `consultion2create.js` | drawNode.getConfig 驱动，多按钮，右侧详情视图 |
| P1 高复杂 | 🔴 | `customerOrigine.js` | 本地 getConfig，getPropertyArr 大型 switch，二维码按钮，12+ 状态+配置条件按钮 |
| 子记录页 | 🟢 | `feedbackRecord.js` | searcher.init 子记录页，仅展示 |
| 子记录页 | 🟢 | `vrecord.js` | searcher.init 子记录页，仅展示 |
| 子记录页 | 🟡 | `feedbackComplaint.js` | 主列表已迁移，searcher1 子列表 displayFunc 迁移 |

### 16.2 排除迁移（非 Searcher 分页）

| 文件 | 排除依据 |
|------|---------|
| `repair.js` | 自定义 renderList，无 Searcher |
| `repairPay.js` | 自定义 renderList，无 Searcher |
| `customerOrigineRecord.js` | 自定义 renderList 局部渲染，无 Searcher |

### 16.3 关键技术点

1. **pageConfig 双驱动（customerOrigine.js / consultion2create.js）**：`drawNode.getConfig(depage)` 与本地 `getConfig(page)` 都会从 `decorationFunctionRight / customerOriginFunctionRight` 后端配置生成 `condArr / pageBtn / apiPage / propertyArr`。迁移后字段由 `buildCustomerOrigineLineprops()` 按 `pageConfig.propertyArr` 顺序动态生成，按钮由 `buildCustomerOrigineLinebtns()` 按 `pageConfig.pageBtn.contains(...)` 动态产出。

2. **状态 + 配置双重按钮显隐（customerOrigine.js）**：原 creatLine 中同时使用 `v.status == STATUS_INIT_INT` 等状态判定与 `pageConfig.pageBtn.contains(...)` 配置判定来控制 12+ 个按钮。迁移后两者收敛为单一 `show: function(v)` 回调（返回 `状态条件 && 配置条件`），其中配置条件已通过 `if (pageBtn.contains(...))` 在构建 btns 对象时静态过滤，避免运行时重复判断。

3. **二维码按钮（customerOrigine.js）**：原 `$btnCode` 手动 `qrcode()` 渲染到 `#code` 容器并弹出 `codeModal`。迁移后保留为普通 linebtn，handle 内部完整复刻 qrcode 渲染逻辑（未使用 `{type:"qrcode"}` lineprop，因为该类型是行内缩略图，与弹窗语义不同）。

4. **属性点击事件迁移（customerOrigine.js）**：原 propertyArr 第 4 元素 click 回调（查看 creater/belonger/designer/salesman/department/region 详情）迁移为 lineprop 的 `click: function(btn, v)`，统一调用 `tools.personel.info(btn, userId)` / `tools.department.info(btn, did)`。

5. **orderId 前缀条件按钮（consultion2create.js）**：原根据 `v.orderId.substr(0,2)=="00"` 和 `v.orderId.substr(0,4)=="EX00"` 决定显示合同信息/付款信息/增减项信息按钮。迁移后付款信息和增减项信息按钮的 `show` 回调返回 `orderId.substr(0,2)=="00" || orderId.substr(0,4)=="EX00"`，合同信息按钮单独返回 `orderId.substr(0,2)=="00"`。

6. **子记录页双 Searcher（feedbackComplaint.js）**：该文件有两个 Searcher —— 主列表 `searcher`（查询投诉）已使用 `searcher.set().line().render()`，子列表 `searcher1`（查询反馈记录）原使用 `displayFunc`。迁移后 `searcher1` 也改为 `searcher1.set().line().render()`，使用独立的 `buildFeedbackComplaintRecordLineprops()`。

7. **拼写修正**：aepair.js / revisit.js / emember.js / crowdUser.js 中原有的 `seacher` 拼写错误在迁移过程中统一修正为 `searcher`。

### 16.4 验证

- `node --check` 全部通过（41 个文件）。
- `findstr /s /n displayFunc WebContent/js/customer/*.js`：3 命中，均为排除文件（`customerOrigineRecord.js`、`repair.js`、`repairPay.js`，均无 Searcher）。
- `findstr /s /n searcher.init WebContent/js/customer/*.js`：0 命中。


## 17. Construction 模块迁移记录

### 17.1 迁移范围

| 批次 | 难度 | 文件 | 特征 |
|------|------|------|------|
| P0 简单 | 🟢 | `acceptance.js` | 11 属性(含 click)，1 验收按钮 |
| P0 简单 | 🟢 | `inspection.js` | 11 属性(含 click)，1 记录按钮 |
| P0 简单 | 🟢 | `customer.js` | 12 属性(含 click)，1 施工节点按钮 |
| P0 简单 | 🟢 | `drawline4user.js` | 12 属性(含 click)，1 人员部署按钮 |
| P0 简单 | 🟢 | `customer4feedback.js` | 5 属性，2 按钮(编辑/删除)，添加按钮 |
| P0 简单 | 🟢 | `customer4guarantee.js` | 3 属性，2 按钮(编辑/删除)，添加按钮 |
| P0 简单 | 🟢 | `inspection4record.js` | 5 属性，2 按钮(编辑/删除)，添加+返回按钮 |
| P0 简单 | 🟢 | `supervision4rework.js` | 3 属性，3 按钮(图纸/编辑/删除)，添加按钮 |
| P0 中等 | 🟡 | `supervision.js` | 11 属性(含 click)，7 按钮(信息/施工节点/增减项/扣款/定额材料/定额工费/定额工时)，修复 `seacher`→`searcher` 拼写 |
| P0 中等 | 🟡 | `allocation.js` | 11 属性(含 click)，3 按钮(质检/信息/施工节点) |
| P0 中等 | 🟡 | `customer4complaint.js` | 9 属性，2 按钮(处理/删除，删除带状态判断)，添加按钮 |
| P0 中等 | 🟡 | `accessory.js` | 8 属性，1 更新按钮，添加按钮(非分页 `isPage:false`) |
| P1 高复杂 | 🔴 | `constructionInfo.js` | 29 属性(含 click)，9 按钮(记录/服务/打印/施工计划/预派监理/验房/交接/画像/重置设计)，导出按钮，pageType 分支 options |
| P1 高复杂 | 🔴 | `drawline4apply.js` | 13 属性(含 click)，5 按钮(信息/预放线/更新/放线/重置)，申请信息弹窗+日历组件 |

### 17.2 排除迁移

| 文件 | 排除依据 |
|------|---------|
| `drawline4setup.js` | 按 `v.group.gid` 分组渲染到多个 `#group{gid}` 容器，与 Searcher 单 ul 结构不兼容 |
| `construction.js` `constructionDiary.js` `constructionRecord.js` `constructionSchedule.js` `qualiter.js` `constructionPlan.js` `qualiter4detail.js` | 已用新式 `searcher.base()`，无 displayFunc |
| `acceptance4detail.js` `allocation4detail.js` `customer4detail.js` `supervision4detail.js` `supervision4drawing.js` `constructionNode2print.js` `constructionPlan2print.js` `workerSalary2print.js` `normtion.js` | 详情/打印子页或非列表页 |

### 17.3 关键技术点

1. **属性 click 迁移**：construction 模块大量使用 propertyArr 第 4 元素 click（调用 `tools.decoration.info / tools.house.info / tools.customer.info / tools.personel.info / tools.department.info`），统一转为 lineprop 的 `click: function(btn, v)`。

2. **拼写修正**：`supervision.js` 的 `seacher` → `searcher`（与 customer 模块 aepair.js 同类问题）。

3. **状态条件按钮**：`customer4complaint.js` 的删除按钮需 `show: function(v)` 判断 `v.status != COMPLAINT_STATUS_TYPE_HANDLE_INT`，原本是在 click 中拦截后 `com.showAlert`，迁移后前置为 `show` 回调，已处理状态不再渲染删除按钮。

4. **导出按钮**：`constructionInfo.js` 的导出按钮 builder 提取为 `buildConstructionInfoButtons()`，保留原 `com.focusPage("#export").click(...)` 事件绑定。

5. **pageType 分支**：`constructionInfo.js` 的 `options` 按 `pageType`（plan/done/issue/contract）动态构建查询参数，迁移后作为 `searcher.set` 的 `params` 参数传入。

6. **非分页查询**：`accessory.js` 使用 `isPage:false`（第 9 参）。

7. **定额工费/工时弹窗**：`supervision.js` 的定额工费/定额工时按钮需先 `com.post` 查询 quotationId 再设置 `params.quotation` 并打开模态框，迁移后完整保留在 linebtn 的 handle 中。

8. **drawline4setup.js 分组渲染排除**：该文件按 `v.group.gid` 分组渲染到多个 widget-box 容器，属于自定义布局，与 Searcher 的单 ul 列表结构不兼容，与 decoration 模块排除的同类页面一致。

### 17.4 验证

- `node --check` 全部通过（31 个文件）。
- `findstr /s /n displayFunc WebContent/js/construction/*.js`：0 命中。
- `findstr /s /n searcher.init WebContent/js/construction/*.js`：0 命中。
- `findstr /s /n seacher WebContent/js/construction/*.js`：0 命中（拼写全部修正）。


## 18. Balance 模块迁移记录

### 18.1 迁移范围

| 批次 | 难度 | 文件 | 特征 |
|------|------|------|------|
| P0 中等 | 🟡 | `balanceAccount.js` | 12 属性(含 click)、状态开关(ace-switch)、提款按钮、3 个添加按钮(添加结算账户/添加结算/添加出纳) |
| P1 高复杂 | 🔴 | `balance.js` | 12 属性(含 click)、checkbox 多选(selectList 收集 bid)、6 行按钮(结算/出纳/结算明细/分摊明细/结算销售/结算扣款)、付款批量按钮 |
| P1 高复杂 | 🔴 | `balanceSalesBalance.js` | 8 属性(含 click) + newline + 13 计算明细字段、checkbox 多选、解绑行按钮、5 工具按钮(明细打印/利润打印/导出/全选/解绑)、两个导出函数 |

### 18.2 排除迁移

| 文件 | 排除依据 |
|------|---------|
| `balanceCutpay.js` `balanceSelectionRecord.js` | 已用新式 `searcher.base()`/`searcher.set()` + `line().render()` |
| `balance2account.js` `balance2balance.js` `balanceApport.js` `balanceDccount.js` `balanceDccountDetail.js` `balanceDetail.js` `balanceOales.js` `balanceOales4balance.js` `balanceOalesItem.js` `balanceSales.js` `balanceSales4balance.js` `balanceSelection.js` `balanceSelection2print.js` `balanceSelection4balance.js` `balanceSelectionItem.js` `balanceSales2print.js` `balanceCutpay2print.js` | 子页/详情/打印页或无 Searcher 分页 |

### 18.3 关键技术点

1. **状态开关（balanceAccount.js）**：原 ace-switch + `$invalid.click` 手动切换并调用 `updatastatus(baid, cvalue)`，迁移为 linebtn 的 `{type:"switch", clazz:"status-lbl", init: !v.status, handle}`，handle 内调用 `updatastatus(v.baid, check ? 0 : 1)`。

2. **checkbox 多选（balance.js）**：原行首 checkbox 收集 `balance.selectList`，迁移为 lineprop 的 `{type:"checkbox", field:"id", name:"balance", prop:"bid", clazz:"ace ace-checkbox-2", checked:function(v), click:function($input,v)}`。`checked` 回调根据 `selectList.contains(String(v.bid))` 设置初始选中状态，`click` 回调维护 selectList 增删。

3. **checkbox 多选（balanceSalesBalance.js）**：迁移为 `{type:"checkbox", field:"bsbid", name:"多选", prop:"bsbid", clazz:"ace ace-checkbox-2"}`，配合工具栏全选按钮（`checkAll()` 通过 `com.focusPage('input[type="checkbox"]')` 批量操作）和解绑按钮（`unbind()` 通过 `:checked` 选择器收集 bsbid）。

4. **第二行明细（balanceSalesBalance.js）**：原 creatLine 中渲染两个 `$ulProperty`（基础属性 + 计算明细）。迁移方案：在 lineprops 中插入 `{type:"newline"}` 分隔符，将 13 个计算字段作为带 `prop: function(v)` 的 lineprop 放在 newline 之后。复杂财务计算逻辑（venderMaling/allowance/salesRevenue/accountsPayable 等三分支）提取到独立 `calcSalesBalance(v)` 辅助函数，返回对象供各 lineprop 的 prop 函数引用，避免重复计算。

5. **按钮条件显隐（balanceSalesBalance.js）**：解绑行按钮用 `show: function(v)` 判断 `balanceSalesBalance.balanceSales.status == STATUS_INIT_INT`；工具栏的全选/解绑按钮在 buttons builder 中根据 status `.hide()`；明细打印/利润打印按钮根据 `balanceSales.status == STATUS_INIT_INT || depage == 'material'` `.hide()`。

6. **批量付款按钮（balance.js）**：原 buttons builder 中的 `$checka` 带 click 事件（收集 selectList 调用 `payedBalance`），迁移后提取为 `buildBalanceButtons()` 函数，保留 click 事件绑定。

7. **属性 click 业务 bug 保留**：balance.js 中结算人/付款人 click 回调误用 `v.creater.userId`（应为 `v.balancer.userId`/`v.payeder.userId`），本次迁移保留原逻辑不做业务修正，仅做结构转换。

8. **两个导出函数保留**：balanceSalesBalance.js 的 `exports()` 和 `exports1()` 几乎完全重复（仅 column 格式不同），本次迁移保留不动，不在结构迁移范围内重构。

### 18.4 验证

- `node --check` 全部通过（22 个文件）。
- `grep -rn "displayFunc" WebContent/js/balance/*.js`：0 命中。
- `grep -rn "searcher\.init" WebContent/js/balance/*.js`：0 命中。


