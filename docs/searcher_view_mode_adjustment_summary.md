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

## 10. 总结

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
