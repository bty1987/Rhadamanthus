# 查询条件配置指南（Searcher 条件区 / condition 规则库 / filters 白名单）

> 老版页面（WebContent）列表页"查询条件"的完整开发链路。任何"给页面加查询条件"的任务都走本文所述三层：**条件规则库 → 页面条件区 → 后端 filters 白名单**。末端先例：2026-10 报价规格页（quotationFormat）五条件全链路，见第 6 节。

---

## 1. 机制总览

```
js/condition/<模块>.js          →  Condition.addupRule("<模块>", { "<实体>-<字段>": 规则 })   [规则注册]
js/com/searcher.js              →  searcher.set(..., 条件名数组, ...) / searcher.condition([...])  [页面引用]
js/com/condition.js             →  getRuleByCondName(全名) 渲染条件控件、收集参数                    [框架]
后端 BaseListAction.filters     →  Struts 自动绑定 filters[N].field/data/op                          [框架]
DAO 白名单                      →  getCriterion(field, data, op) / query.timeranges(...)             [逐页手写]
```

条件值不以命名参数直达后端，统一打包成 `filters[N]` 数组由白名单消费——**这是防 SQL 注入和误查的闸门，禁止绕过**。

---

## 2. 条件规则库（`WebContent/js/condition/`）

### 2.1 注册与模块前缀 🔴

每个文件按**后端模块**归属：`data.js`、`quotation.js`、`decoration.js`、`construction.js`、`payment.js`、`sales.js`、`balance.js` 等，文件内一行注册：

```js
Condition.addupRule("data", { "quotationFormat-name": {...}, ... });
```

**注册时框架自动给键拼上 `模块-` 前缀**（`condition.js` 的 `addupRule`：`_key = module + "-" + k`）。因此：

- `data.js` 里写 `"quotationFormat-name"` → 实际注册键为 **`data-quotationFormat-name`**
- 页面引用**必须用全名**，写裸名查不到规则，`renderConds` 静默跳过 → **整个条件区不渲染、无任何报错**
- 实体属于哪个后端模块（`com.fanglin.<模块>`），规则就放哪个文件——不确定时看接口 URL 对应的 Action 包名

🔴 实录（2026-10 quotationFormat 页）：规则误放 `quotation.js`（全名成了 `quotation-quotationFormat-*`），页面引用裸名，条件区整体不显示。修复即归位 `data.js` + 引用加 `data-` 前缀。

### 2.2 键唯一性与加载顺序

- `_condRules` 是**全局平面 map**，键即全名，跨文件重复时**先加载者赢**（`addupRule` 对已存在键直接跳过）
- 文件加载顺序按 `Condition.init` 里的固定列表（字母序）：approval → balance → building → customer → construction → data → decoration → information → inventory → logger → market → material → payment → personel → production → quotation → report → salary → sales → store → system
- 键命名惯例：**`<实体/页面>-<字段语义>`**（如 `aoods-name`、`bankAccount-status`、`quotationFormat-workType`），同一文件内键天然不可重复

### 2.3 规则结构

```js
"quotationFormat-workType": {
    label: "工种",                      // 条件区显示的中文名（4 字以内对齐，不足补全角空格）
    type: "select",                     // 控件类型，见 2.4
    submitConfig: {
        name: "workType.id",            // 提交为 filters[i].field —— 必须与 DAO 白名单分支严格一致
        op: "eq",                       // 提交为 filters[i].op   —— 见 2.5 操作符表
        validate: null                  // 可选 {reg: /正则/, msg: "提示"}，不匹配阻断提交并气泡提示
        // alone: true                  // 可选：不走 filters[]，直接以 name 为参数名提交裸值
    },
    dataSource: {                       // select/selectCaching/autofill 必配，text 无
        url: api.common.queryWorkType,  // 选项数据接口（api 全局对象，规则文件加载时 api 已就绪）
        postData: {},                   // 接口入参；🔴 接口若读 VO 参数，空参会撞 Struts2 VO null NPE
        listPath: "workTypes",          // 响应里选项数组的路径（顶层键名）
        keyPath: "id",                  // 选项提交值字段
        valuePath: "name"               // 选项显示文本字段
    }
}
```

### 2.4 控件类型（type）

| type | 控件 | 选项来源 | 提交行为 |
|------|------|---------|---------|
| `text` | 文本框 | — | filters[i].data = 输入值 |
| `select` | 下拉（自动加"全部"空选项） | `url` 同步拉取；或 `url: null` + `listPath: [{key, value}]` 静态枚举 | data = 选中 key |
| `selectCaching` | 下拉（结果缓存在 `params.selectCaching[键]`，多页共用不重复拉） | 同上 | 同 select |
| `autofill` | typeahead 联想输入 | url + pinyinName 联想（≥2 字符触发） | data = **选中项 keyPath 值**（`data-typeahead-key`），未选中提示"请选择选项" |
| `datePicker` | 单日期 | — | data = 日期串 |
| `dateRangePicker` | 日期区间 | — | data = 区间串，op 惯用 `between`，**DAO 端手工消费**（见 2.5） |

另有 `detail`（放大镜弹窗选择器，如选人/选楼盘）进阶用法，参考现有 `data.js` 内带 `detail` 的规则。

### 2.5 操作符（op）对照表

op 字符串由前端透传，**最终语义由 DAO 端 `DaoImpl.getCriterion` 解释**（`src/com/fanglin/core/dao/impl/DaoImpl.java`）：

| op | 语义 | SQL 形态 |
|----|------|---------|
| `eq` | 等于（默认，未识别的 op 也落 eq） | `field = ?` |
| `ne` | 不等 | `field <> ?` |
| `cn` | 包含（**文本模糊查询首选**） | `ilike %?%` |
| `nc` | 不包含 | `not ilike %?%` |
| `bw` / `ew` | 以…开始 / 结束 | `ilike ?%` / `ilike %?` |
| `bn` / `en` | 不以…开始 / 结束 | 反向 ilike |
| `lt` / `le` / `gt` / `ge` | 比较 | `<` `<=` `>` `>=` |
| `likecn` | like（区分大小写） | `like ?` |
| `in` | 仅 DAO 端主动使用（配 `filter.getShorts()`） | `in (?)` |
| `between` | **不在 getCriterion 里**，DAO 白名单内手工处理（时间区间用 `query.timeranges(...)`，参考 DrawLineDaoImpl） | 视实现 |

---

## 3. 页面接入

```js
// 方式一：searcher.set 第 6 参（set 签名：searcherId, pagerId, resulterId, url, params, conditions, historyName, resultName, isPage, buttons, displayFunc）
searcher.set("xxxCondList", "xxxPagenation", "xxxResultList", api.xxx.queryXxx,
    { "xxx.qcid": qcid },                                  // 固定参数，每次查询必带
    ["data-xxx-name", "data-xxx-workType"],                // 条件名数组——🔴 必须是含模块前缀的全名
    null, "xxxList", true);

// 方式二：链式（先 base 后 condition）
searcher.base(...).condition(["data-xxx-name", ...]);
```

- **排序即布局**：条件按数组顺序渲染一行；`收|展` 按钮只切换**索引 >3**（第 5 个起）的条件显隐——最高频的条件放前 4 个，低频的（如状态）放后面默认收起
- `重置` 按钮清空输入但**不自动重查**，需再点查询
- 查询按钮触发 `getParams()`：收集非空条件 + 合并固定参数 + `paging.page/rows`（非分页查询后端忽略 paging 参数，无副作用）

---

## 4. 提交协议（前后端契约）

每个非空条件打包为一组参数：

```
filters[0].field       = submitConfig.name        （字段标识，DAO 白名单的匹配键）
filters[0].data        = 输入值 / 选中 key（autofill 为 typeahead key）
filters[0].op          = submitConfig.op
filters[0].inputValue  = 原始输入（autofill 场景与 data 不同）
```

- `alone: true` 的规则例外：`_params[submitConfig.name] = value` 直接以命名参数提交，不走 filters 数组（适合与 filters 白名单体系并存的独立开关参数）
- Struts2 将 `filters[N].*` 自动绑定到 `BaseListAction` 的 `List<Filter> filters`（`com.fanglin.core.vo.Filter`：field/data/op/range/shorts）
- 🔴 条件区依赖的查询接口若读取 VO 参数（如 `quotationFormat.quotationCtem.qcid`），请求不带该参数时 Action 里 VO 为 null，`.getQcid()` 直接 NPE——固定参数必须始终随请求提交（放 `searcher.set` 第 5 参即天然满足）

---

## 5. 后端消费（三层签名 + 白名单）

### 5.1 三层链路（Action → Service → DAO，同名传递）

```java
// Action：filters 从 BaseListAction.getFilters() 取（private 字段，禁止直接访问）
quotationFormats = quotationFormatService.queryQuotationFormatByQcid(quotationFormat.getQuotationCtem().getQcid(), getFilters());

// Service 接口/实现：List<Filter> 透传 DAO
List<QuotationFormatVO> queryQuotationFormatByQcid(Long qcid, List<Filter> filters);

// DAO 接口/实现：白名单消费
List<QuotationFormatPO> queryQuotationFormatByQcid(Long qcid, List<Filter> filters);
```

分页查询的标准形态（`pageXxx` 命名，见方法命名规范）：`pageCormtime(getPaging(), getFilters())` + `PagingQuery`。

### 5.2 DAO 白名单（铁律）

```java
if (filters != null) {
    for (Filter filter : filters) {
        String field = filter.getField();
        String data = filter.getData();
        String op = filter.getOp();

        if ("name".equals(field)) {                          // 文本模糊
            criteria.add(getCriterion("name", data, op));
        } else if ("workType.id".equals(field)) {            // ManyToOne 点路径
            criteria.add(getCriterion("workType.id", data, op));
        } else if ("actualDate".equals(field)) {             // 时间区间（op=between）
            if ("between".equals(op)) {
                query.timeranges(START, END, data, data);
            }
        }
        // 未列出的 field 一律忽略——白名单外不落任何条件
    }
}
```

- 🔴 **白名单制是安全边界**：field/op 来自请求，只允许显式映射的字段通过；新条件 = 前端规则 + 白名单一个分支，两边字段串必须一致
- 匹配分支内的属性路径用**实体属性名**（可含一级 ManyToOne 点路径：`workType.id`、`quotationVersion.no`，框架内部自动 alias）
- 🔴 深层嵌套路径有炸点：criteria criterion 只认首段 alias，跨两级以上的路径先 `createAlias` 或改由关联表查询（实录见 OALES_PAYMENT_ORDERID_COND_SWAP.sql 一役）
- 数值列 eq 传 String data 是全库惯例（MySQL 隐式转换），两种写法并存均可：裸传 `getCriterion("status", data, op)` 或显式 `Short.parseShort(data)`（DrawLineDaoImpl 风格更严谨）
- 非分页查询可直接用裸 `Criteria` + `getCriterion`（quotationFormat 先例）；分页查询用 `PagingQuery` + 私有 `queryFilterExcute(query, filters)` 方法（CormriceDaoImpl 等 data 模块标准模式）

---

## 6. 完整先例：quotationFormat 五条件（2026-10，提交 4357135be）

需求：报价规格弹窗页加 名称/规格（模糊）+ 工种/类型/状态（下拉）。

**① 规则注册**（`js/condition/data.js` 末尾，5 条）：

- `quotationFormat-name` / `quotationFormat-format`：text + `op: "cn"`
- `quotationFormat-workType`：select，`api.common.queryWorkType`，提交 `workType.id`
- `quotationFormat-type`：select，`api.quotation.queryQuotationType`，提交 `type`
- `quotationFormat-status`：select 静态枚举 `[{key:"0",value:"启用"},{key:"1",value:"禁用"}]`，提交 `status`

**② 页面引用**（`js/quotation/quotationFormat.js`）：

```js
searcher.set(..., api.quotation.queryQuotationFormatByQcid,
    { "quotationFormat.quotationCtem.qcid": quotationFormat.qcid },
    ["data-quotationFormat-name", "data-quotationFormat-format", "data-quotationFormat-workType", "data-quotationFormat-type", "data-quotationFormat-status"],
    null, "quotationFormats", true);
```

**③ DAO 白名单**（`QuotationFormatDaoImpl`）：name/format/alias（ilike）+ workType.id/type/status（eq）六分支，未匹配忽略。

**④ 兼容性**：app 版同名接口只传 qcid，filters 为 null 时 DAO 行为与历史完全一致。

---

## 7. 加条件检查清单

1. ☐ 实体属于哪个后端模块 → 规则放对应 `js/condition/<模块>.js`
2. ☐ 键名 `<实体>-<字段>`，全库唯一；页面引用带 `data-`（或对应模块）前缀全名
3. ☐ `submitConfig.name` 与 DAO 白名单分支字符串严格一致
4. ☐ select 数据源接口空参安全（不读 VO 参数，或 postData 带必填参）
5. ☐ DAO 白名单加分支（分页查询在 `queryFilterExcute`，非分页在 criteria 组装处）
6. ☐ 深层点路径（>1 级关联）先评估 alias 炸点
7. ☐ 条件排序：高频前 4，低频靠后（收展折叠线）
8. ☐ 无条件请求（filters=null）行为与历史一致——老调用方（app 版、其他页面）不受影响
9. ☐ 后端有改动则重打模块 jar（build-module.bat），前端改动随 WebContent 发版

---

## 相关文件

| 文件 | 角色 |
|------|------|
| `WebContent/js/com/condition.js` | Condition 注册器（addupRule/init/getRuleByCondName） |
| `WebContent/js/com/searcher.js` | Searcher 组件（renderConds/createCondItem/getParams） |
| `WebContent/js/condition/*.js` | 21 个模块条件规则库 |
| `src/com/fanglin/core/action/BaseListAction.java` | filters 分页/过滤参数绑定 |
| `src/com/fanglin/core/vo/Filter.java` | 过滤条件 VO |
| `src/com/fanglin/core/dao/impl/DaoImpl.java` | getCriterion 操作符映射 |
