# noods 定材 集团/分公司 两级数据调整方案

> 编制日期:2026-08-28(修订版:不拆接口、前端控权、后端最小化)
> 范围:`data.noods` 表、NoodsAction/Service/DAO/PO/VO、`WebContent/views/data/noods.html` + `js/data/noods.js`(老 ACE 版)、`app/js/data/noods.js`(app 版)
> 状态:**方案稿,待确认后实施**

---

## 1. 现状

### 1.1 数据模型(data.noods,8 字段,无关联)

| 字段 | 含义 | 生产数据形态 |
|---|---|---|
| nid | 主键 | — |
| name | 名称 | 有值 |
| selling | 售价 | **全 0(未使用)** |
| balance | 结算价 | **全 0(未使用)** |
| surplus | **浮动量** | **核心业务字段,有值**(如 100000/9000) |
| status | 状态 | 0 启用/1 禁用 |
| calc | 计算标识 | 0/1 |
| company | 公司 | 53 个公司各自维护 |

- company=0(集团)仅 1 条占位行(nid=0"无",已禁用),现状没有集团主数据概念
- 身份机制现成:`queryCompany()` 集团账号=0、分公司=本公司 id,`pageNoods` 的 company 过滤天然隔离两套数据

### 1.2 消费方(必须零影响)

`aoods.js` / `normood.js`(typeahead 按本公司查)、quotation `NormoodItem`(按 nid 引用)、定额计算(读 surplus/calc)——全部直接读 noods 行,因此采用**快照策略**:分公司行冗余存集团行的 name/selling/balance/calc,读取链路零改动。

---

## 2. 修订要点(相对初版)

1. **不拆分接口**:`addNoods`/`updateNoods`/`updateNoodsForStatus`/`updateNoodsForCalc` 全部不动。VO 增加 pnid 字段后,`BeanUtil.copyProperties` 自动把 pnid 带进带出——增改接口**零逻辑改动**。
2. **状态类功能分公司自行处理**:ForStatus/ForCalc 保持通用,不做公司限制,前端两版都保留开关。
3. **菜单后置**:不做菜单 SQL。页面不依赖 `type=group/company` 参数——**交互完全由数据驱动**(详见 §4),将来要拆菜单时再加 type 参数即可,本版不依赖。
4. **后台尽量不增加**:后端总改动 = DDL + PO/VO 各一个字段 + **唯一新增只读接口** `queryNoodsForGroup`(分公司选择集团定材的数据源,绕不开:现有 queryNoodsByName 按 queryCompany 过滤,分公司查不到 company=0 数据;改它的过滤会波及 aoods/normood 消费方)。

---

## 3. 数据库调整(DDL)

```sql
-- 上级定材字段:集团行/自建行 pnid=0,引用行指向集团行 nid
ALTER TABLE data.noods ADD COLUMN pnid INT(11) NOT NULL DEFAULT 0 AFTER nid, ADD INDEX idx_pnid (pnid);
```

- 存量约 1500 行 pnid 默认 0,语义"自建,未关联集团"——不迁移,与现状行为完全一致
- 集团主数据由业务方在页面上录入初始化(company=0 账号操作)

## 4. 前端交互(数据驱动,无需身份/页面判定)

核心:**不区分集团版/公司版页面,同一个页面同一种交互,形态由"是否选择引用"和"行的 pnid"决定**:

### 4.1 添加弹窗(改动点)

弹窗顶部增加可选的 **"引用集团定材" typeahead**(数据源 `queryNoodsForGroup`,按名称模糊查 company=0 启用行):

- **选中集团定材** → 名称/售价/结算价自动回填并**置只读**,计算标识同样锁定;仅"浮动量"可编辑;隐藏域记 `pnid=集团nid`;提交调现有 `addNoods`(多传一个 `noods.pnid`,company 仍由后端 queryCompany 赋值)
- **不选(留空)** → 现状自建模式,全字段可填,pnid 缺省 0——集团账号录入主数据、分公司临时自建都走这条路(与存量行为兼容)

### 4.2 编辑弹窗(改动点)

按行数据分流:

- 行 `pnid > 0`(引用行)→ 名称/售价/结算价/计算标识只读展示,**仅浮动量可编辑**;提交调现有 `updateNoods`(其余字段原值回传——现有实现是全字段 copyProperties 覆盖,漏传会置空,前端必须全量回传)
- 行 `pnid = 0`(自建/集团行)→ 现状全字段编辑

### 4.3 列表与开关

- 列表增加"引用"标识列(pnid>0 显示,可选)
- 状态/计算标识开关两版通用(状态类分公司自行处理)

## 5. 后端改动清单(全部)

| # | 文件 | 改动 |
|---|---|---|
| 1 | DDL | pnid 字段 + 索引 |
| 2 | NoodsPO / NoodsVO | 各加 `pnid` 字段映射(copyProperties 自动生效,add/update 零改动) |
| 3 | NoodsDao / Impl | 加 `queryNoodsForGroup(name, limit)`(company=0 + status=0 + name ilike) |
| 4 | NoodsService / Impl | 加对应查询方法 |
| 5 | NoodsAction | 加 `queryNoodsForGroup` @Action(**唯一新接口**,只读) |

无错误码新增、无菜单 SQL、无其它接口改动。app 版 noods.js 同步 4.1/4.2 交互。

## 6. 风险与可选项

1. **前端控权的固有风险**:绕过页面直接调 `updateNoods` 可修改引用行的名称等(后端无硬约束)。内部 ERP 可接受;如需硬约束,可选项:updateNoods 中对 pnid>0 的目标行仅 `setSurplus`(一行防御代码),默认不加。
2. **防重复引用**(同公司重复引用同一集团定材):后端不加校验,靠前端选择器过滤已引用项(typeahead 返回后排除本公司已有 pnid 的行,需调 pageNoods 已有数据比对);如需后端防重为一行 count 校验,默认不加。
3. **集团改名不同步快照**:引用行名称等保持创建时快照;不一致仅影响展示,不影响计算(surplus/calc 在本行)。需要时提供批量同步 SQL(按 pnid 刷引用行字段)。

## 7. 实施清单

| # | 内容 | 产物 |
|---|---|---|
| 1 | DDL(pnid) | docs SQL,生产执行 |
| 2 | PO/VO/DAO/Service/Action(queryNoodsForGroup) | 源码 |
| 3 | 老版 noods.html/noods.js(引用 typeahead+编辑分流) | 前端 |
| 4 | app 版 noods.js 同步 | 前端 |
| 5 | 打包 | fanglin-data-8.3.028.jar |

**消费方零改动**(aoods/normood/NormoodItem/定额计算不受影响)。
