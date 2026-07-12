# data.json 常量数据化迁移方案

> 目标：将 `WebContent/ds/data.json`（前端静态硬编码枚举）迁移至 `communion.constant` 表，统一由数据库驱动、后台可维护，前端收口到 `Constant()` 访问器。
>
> 编写日期：2026-07-10

---

## 一、现状评审

### 1.1 两条并存的字典通道

| 维度 | 旧通道（待迁移） | 新通道（目标） |
|---|---|---|
| 数据来源 | 静态文件 `WebContent/ds/data.json` | 数据库表 `communion.constant` |
| 前端入口 | `api.ds.data`（`ds.js:48`） | `api.data.queryConstant`（`data.js:2112`） |
| 请求形态 | GET 静态文件（`core.js:199/223`） | POST `.do` Action |
| 后端 | **无 Action**，纯静态资源 | `ConstantAction` 全套 CRUD |
| 前端访问 | `com.post(api.ds.data,{},cb=>res.xxx)` | `constant.<module>().<clazz>.<type>` 或 `Constant().valueOf/datas` |
| 可维护性 | 改代码+发版，无后台界面 | `views/data/constant.html` 后台增删改 |

**关键确认**：`api.ds.data` 的 `url:"ds/data.json"` 在生产环境也是直接取静态文件（`config.demo` 恒为 falsy，走 `core.js:199` 的 `url = server + api.url`；且因含 `.json` 走 GET）。后端没有任何 Action 处理它。所以"数据化"= 把这份静态文件搬进 `constant` 表。

### 1.2 影响范围

- `WebContent/ds/data.json`：1 个文件，40 个枚举段。
- 前端引用：**28 个 JS 文件**，其中：
  - `condition/data.js`：约 23 处 `listPath` 引用（条件搜索器下拉）。
  - `data/*.js`、`building/*.js`、`decoration/*.js`、`information/*.js`：约 20 个页面的 `com.post` 回调。
- 后端：**无需新增**，复用现有 `ConstantAction`/`ConstantService`/`ConstantDao`。

### 1.3 已发现的缺陷（建议迁移前/中一并修复）

| # | 位置 | 问题 | 建议 |
|---|---|---|---|
| 1 | `ConstantDaoImpl.java:54-56` | 4 参数 `queryConstant(m,c,t,key)` 把 `type` 拼了两次，`key` 参数未生效 | 改第二个 `type` 为 `key` |
| 2 | `ConstantAction.java:41/61/69/77` | 方法名与 Action 含义不符（`queryCategory`/`updateBrand`/`updateCustomerForBase`/`deleteBrandByBIds`） | 重命名为语义正确的方法名 |
| 3 | `js/data/constant.js:189` | `params["contant.cid"]` 笔误（少 s） | 改为 `constant.cid` |
| 4 | `ds/data.json:56/129/132` | `"status"`/`"Status"`/`"status"` 重复定义，JSON 同名 key 后者覆盖，实际仅"启用/禁用"生效 | 迁移时统一为 `data.common.status` |
| 5 | `ds/data.json:105/126` | `"taskParamStatus"` 重复定义 | 同上，合并 |

### 1.4 主要风险

- **R1 key 类型**：`js/com/constant.js:77-79` 会把纯数字 `key` `parseInt` 成数值；`data.json` 里 `key` 是字符串 `"0"`。迁移后 `bindData` 不受影响（按属性读），但**凡是用 `key` 做严格相等比较 `===` 的业务代码需排查**（多数是 `==` 或仅展示，风险低）。
- **R2 加载时序**：`Constant()` 在 `index.js` 启动时 `init()`，`data` 模块用同步请求（`com.post(...,false)`）加载。业务页面初始化晚于 `index`，故同步访问 `constant.data().xxx` 是安全的（`condition/data.js` 已如此用）。迁移业务页面回调时需验证此假设。
- **R3 懒加载只触发一次**：`handle` 用 `load` 标志避免重复请求。若某页面在 `init` 之前被访问（理论上不会），会取到空。保持现状即可。

---

## 二、字段映射总表

约定：`module` 多为 `data`（通用枚举）；客户域归 `customer`；`clazz` 取业务实体名；`type` 取字段语义名；`field` 默认等于 `type`；`name`=`value`（中文显示名）；纯数字 `key` 存字符串，访问器会 `parseInt`。

| # | data.json 字段 | module | clazz | type | key 类型 | 条数 | 前端调用点（主要） |
|---|---|---|---|---|---|---|---|
| 1 | relationshipType | customer | customer | relationshipType | 中文 | 5 | building*.js, data/customer.js, decoration4detail.js, condition/customer.js |
| 2 | customerType | customer | customer | type | 数字 | 2 | data/customer.js, condition/customer.js, decoration4detail.js |
| 3 | houseType | data | house | type | 数字 | 12 | building*.js |
| 4 | through | data | house | through | 数字 | 2 | building*.js |
| 5 | orientation | data | house | orientation | 数字 | 11 | building*.js |
| 6 | roomNum | data | house | roomNum | 数字 | 5 | building*.js |
| 7 | waterVapour | data | house | waterVavour | 数字 | 3 | building*.js |
| 8 | parlourType | data | house | parlourType | 数字 | 2 | building*.js |
| 9 | heatingType | data | house | heatingType | 数字 | 3 | building*.js |
| 10 | labeltype | data | label | type | 数字 | 3 | data/label.js, data/checkRanking.js |
| 11 | serviceNodeType | data | serviceNode | type | 数字 | 3 | data/serviceNode.js, condition/data.js |
| 12 | attnode | data | serviceNode | attnode | 数字 | 4 | data/serviceNode.js |
| 13 | vscoreRecordtype | customer | vscoreRecord | type | 数字 | 2 | condition/customer.js |
| 14 | costStatus | data | cost | status | 数字 | 2 | data/constructionCost.js, data/normadd.js, data/normpack.js |
| 15 | talkingType | data | talking | type | 数字 | 10 | data/talking.js, condition/data.js |
| 16 | talkingStatus | data | talking | status | 数字 | 2 | data/talking.js, condition/data.js |
| 17 | taskLevel | data | task | level | 数字 | 2 | condition/data.js |
| 18 | taskIsShow | data | task | isShow | 数字 | 2 | condition/data.js |
| 19 | taskStatus | data | task | status | 数字 | 2 | condition/data.js |
| 20 | categoryType | data | category | type | 数字 | 2 | data/category.js（已注释） |
| 21 | visionType | data | decorationMatching | vision | 数字 | 4 | data/decorationMatching.js |
| 22 | taskParamType | data | taskParam | type | 数字 | 2 | data/taskParam.js, information/plan2create.js |
| 23 | taskParamStatus | data | taskParam | status | 数字 | 2 | （预留） |
| 24 | taskParamIsmain | data | taskParam | ismain | 数字 | 2 | data/taskParam.js, plan2create.js |
| 25 | taskParamOneType | data | taskParam | oneType | 数字 | 2 | data/taskParam.js, plan2create.js |
| 26 | taskParamModule | data | taskParam | module | 字符串 | 5 | data/taskParam.js, plan2create.js（原 module/name 结构，统一为 key/value） |
| 27 | ctypes | data | price | ctypes | 数字 | 2 | （前端暂未引用，按需迁移） |
| 28 | status/Status（通用启用/禁用） | data | common | status | 数字 | 2 | condition/data.js（soods/storehouse/construction-node/decoration-busitype/normadd/normpack） |
| 29 | contractStatus | data | contract | status | 数字 | 2 | condition/data.js |
| 30 | signetStatus | data | signet | status | 数字 | 6 | data/signet.js, supplierSignet.js, condition/data.js |
| 31 | signetType | data | signet | type | 数字 | 4 | data/signet.js, supplierSignet.js, condition/data.js |
| 32 | aoodsAtttype | data | aoods | atttype | 数字 | 2 | data/aoods.js |
| 33 | surveyTemplateStatus | data | surveyTemplate | status | 数字 | 2 | data/surveyTemplate.js, condition/data.js |
| 34 | chatingStatus | data | chating | status | 数字 | 2 | data/chating.js |
| 35 | chatingType | data | chating | type | 数字 | 2 | data/chating.js, condition/data.js |
| 36 | chatingAtttype | data | chating | atttype | 数字 | 6 | data/chating.js |
| 37 | chartType | data | chart | type | 数字 | 4 | data/chart.js, condition/data.js |
| 38 | chartLevel | data | chart | level | 数字 | 4 | data/chart.js, condition/data.js |
| 39 | constantStatus | data | constant | status | 数字 | 2 | data/constant.js |

> 说明：
> - `taskParamModule` 原结构为 `{module,name}`，`constant` 表统一为 `key/value`，故 `key`=模块标识（decoration 等），`value`=中文名（装修 等）。前端 `bindData` 由 `keyPath:"module",valuePath:"name"` 改为 `"key","value"`。
> - 通用 `status`（启用/禁用）合并为 `data.common.status`，消除 `data.json` 里 `status`/`Status` 重复定义的脏数据。`contractStatus`/`costStatus` 等值相同的项，为保留将来分化能力，各自独立 clazz。

---

## 三、数据库脚本

脚本路径：`sqls/migrate_datajson_to_constant.sql`（见第五节阶段产出）。

### 3.1 表结构（已存在，仅备查）

```sql
-- communion.constant（已存在）
CREATE TABLE `constant` (
  `cid` int(11) NOT NULL AUTO_INCREMENT COMMENT '常量ID',
  `name` varchar(32)  NOT NULL COMMENT '姓名',
  `module` varchar(64) DEFAULT NULL COMMENT '模块',
  `clazz` varchar(64) DEFAULT NULL COMMENT '对象',
  `type` varchar(64) DEFAULT NULL COMMENT '类型',
  `field` varchar(64) DEFAULT NULL COMMENT '字段名',
  `key` varchar(64) DEFAULT NULL COMMENT '键',
  `value` varchar(64) DEFAULT NULL COMMENT '值',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  PRIMARY KEY (`cid`),
  KEY `indexone` (`module`,`clazz`,`type`)
) ENGINE=InnoDB COMMENT='常量表';
```

### 3.2 写入规范

- `status` 列固定 `0`（启用），否则 `queryConstant` 查不到（`ConstantDaoImpl:50` 过滤 `status=0`）。
- 防重：`constant` 表无唯一约束，用 `DELETE ... WHERE module AND clazz AND type` 预清理 + `INSERT`，保证脚本可重入。
- `name` 取中文显示名（同 `value`）；`field` 取 `type` 值。

### 3.3 脚本模板（一段示例）

```sql
USE `communion`;

-- ============ data.house.type（houseType） ============
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='house' AND `type`='type';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('住宅','data','house','type','type','0','住宅',0),
('半越住宅','data','house','type','type','1','半越住宅',0),
('全越住宅','data','house','type','type','2','全越住宅',0),
('门市房','data','house','type','type','3','门市房',0),
('窗改门','data','house','type','type','4','窗改门',0),
('商住综合','data','house','type','type','5','商住综合',0),
('酒店公寓','data','house','type','type','6','酒店公寓',0),
('写字间','data','house','type','type','7','写字间',0),
('别墅厂房','data','house','type','type','8','别墅厂房',0),
('仓库','data','house','type','type','9','仓库',0),
('车库','data','house','type','type','10','车库',0),
('其它','data','house','type','type','11','其它',0);
```

完整 40 段脚本按阶段拆分（见第五节）。

---

## 四、前端改造规范

### 4.1 调用形态转换规则

| 旧（data.json） | 新（constant 表） |
|---|---|
| `res.xxx.split("key","value")` → `{key:value}` 映射 | `constant.<m>().<c>.<t>.keys` |
| `res.xxx` → `[{key,value}]` 数组（用于 `bindData`） | `constant.<m>().<c>.<t>.datas` |
| `res.xxx` → 单值查找 | `Constant().valueOf(m,c,t,key)` |

> `.split("key","value")` 与 `.keys` 语义一致（都是 `{key:value}`）。`.datas` 等价原数组。

### 4.2 形态 A：条件搜索器（condition/data.js）

```javascript
// 旧
"signet-status": {
    dataSource: {
        url: api.ds.data,
        postData: {},
        listPath: "signetStatus",
        keyPath: "key",
        valuePath: "value"
    }
}
// 新
"signet-status": {
    dataSource: {
        url: null,
        postData: null,
        listPath: constant.data().signet.status.datas,  // 直接给数组
        keyPath: "key",
        valuePath: "value"
    }
}
```

> `condition/data.js` 里已有大量此形态先例（如 `receiptType-type`、`paymentType-status`），照抄即可。

### 4.3 形态 B：业务页面 com.post 回调

```javascript
// 旧（data/signet.js）
com.post(api.ds.data, {}, function(res){
    signet.status = res.signetStatus.split("key","value");
    signet.type   = res.signetType.split("key","value");
    signet.items.type.bindData(res.signetType, "key", "value");
});

// 新（data/signet.js）—— 整段 com.post(api.ds.data,...) 可删除
signet.status = constant.data().signet.status.keys;
signet.type   = constant.data().signet.type.keys;
signet.items.type.bindData(constant.data().signet.type.datas, "key", "value");
```

### 4.4 特殊：taskParamModule（key/value 对调）

```javascript
// 旧
taskParam.items.module.bindData(res.taskParamModule, "module", "name");
taskParam.taskParamModule = res.taskParamModule.split("module", "name");
// 新（constant 表已统一为 key/value）
taskParam.items.module.bindData(constant.data().taskParam.module.datas, "key", "value");
taskParam.taskParamModule = constant.data().taskParam.module.keys;
```

### 4.5 condition/data.js 逐项改写清单

| 行号 | 旧 listPath | 新（constant 路径） |
|---|---|---|
| 40 | serviceNodeType | `constant.data().serviceNode.type.datas` |
| 479 | Status（normadd） | `constant.data().common.status.datas` |
| 505 | Status（normpack） | `constant.data().common.status.datas` |
| 946 | status（soods） | `constant.data().common.status.datas` |
| 992 | status（storehouse） | `constant.data().common.status.datas` |
| 1054 | status（construction-node） | `constant.data().common.status.datas` |
| 1156 | taskIsShow | `constant.data().task.isShow.datas` |
| 1173 | taskStatus | `constant.data().task.status.datas` |
| 1190 | taskLevel | `constant.data().task.level.datas` |
| 1225 | chartType | `constant.data().chart.type.datas` |
| 1241 | chartLevel | `constant.data().chart.level.datas` |
| 1267 | contractStatus | `constant.data().contract.status.datas` |
| 1308 | signetStatus | `constant.data().signet.status.datas` |
| 1324 | signetType | `constant.data().signet.type.datas` |
| 1349 | talkingType | `constant.data().talking.type.datas` |
| 1365 | talkingStatus | `constant.data().talking.status.datas` |
| 1412 | chatingType | `constant.data().chating.type.datas` |
| 1682 | status（decoration-busitype） | `constant.data().common.status.datas` |
| 1840 | surveyTemplateStatus | `constant.data().surveyTemplate.status.datas` |

### 4.6 业务页面改写清单

| 文件 | 删除的 `com.post(api.ds.data,...)` 内字段 | 替换为 constant 路径 |
|---|---|---|
| building/building.js | relationshipType | `constant.customer().customer.relationshipType` |
| building/buildingCustomer.js | relationshipType | 同上 |
| building/buildingCustomer4create.js | relationshipType | 同上 |
| building/buildingHouse4create.js | relationshipType | 同上 |
| building/buildingHouse4detail.js | houseType/through/orientation/roomNum/waterVavour/parlourType/heatingType 等 | `constant.data().house.<type>` |
| data/aoods.js | aoodsAtttype | `constant.data().aoods.atttype` |
| data/chart.js | chartType/chartLevel | `constant.data().chart.type/level` |
| data/chating.js | chatingStatus/chatingType/chatingAtttype | `constant.data().chating.status/type/atttype` |
| data/checkRanking.js | labeltype | `constant.data().label.type` |
| data/constant.js | constantStatus | `constant.data().constant.status` |
| data/constructionCost.js | costStatus | `constant.data().cost.status` |
| data/customer.js | relationshipType/customerType | `constant.customer().customer.relationshipType/type` |
| data/decorationMatching.js | visionType | `constant.data().decorationMatching.vision` |
| data/label.js | labeltype | `constant.data().label.type` |
| data/normadd.js | costStatus | `constant.data().cost.status` |
| data/normpack.js | costStatus | `constant.data().cost.status` |
| data/serviceNode.js | serviceNodeType/attnode | `constant.data().serviceNode.type/attnode` |
| data/signet.js | signetStatus/signetType | `constant.data().signet.status/type` |
| data/supplierSignet.js | signetStatus/signetType | 同上 |
| data/surveyTemplate.js | surveyTemplateStatus | `constant.data().surveyTemplate.status` |
| data/talking.js | talkingType/talkingStatus | `constant.data().talking.type/status` |
| data/taskParam.js | taskParamType/taskParamModule/taskParamIsmain/taskParamOneType | `constant.data().taskParam.type/module/ismain/oneType` |
| decoration/decoration4detail.js | relationshipType/customerType | `constant.customer().customer.*` |
| information/plan2create.js | taskParamModule/taskParamType/taskParamIsmain/taskParamOneType | `constant.data().taskParam.*` |
| condition/customer.js | relationshipType/customerType/vscoreRecordtype | `constant.customer().customer.relationshipType/type`、`constant.customer().vscoreRecord.type` |
| condition/approval.js | status | `constant.data().common.status.datas` |

> 说明：`res.measurementUnits`（aoods.js/normadd.js）、`res.decorationAtttypes`（decorationMatching.js）**不在 data.json**，来自 `api.common.queryMeasurementUnit`/`api.data.queryDecorationAtttype` 等其它接口，本次不迁移，保持原样。

---

## 五、分阶段实施计划

原则：**按业务域分批，每批可独立上线、独立验证、独立回滚**。每阶段流程统一为：① 跑 SQL 插数据 → ② 改对应前端调用点 → ③ 冒烟验证 → ④ 提交。`data.json` 在所有阶段完成前**保留不删**（作为兜底）。

### 阶段 0：后端缺陷修复 + 基础设施（不动数据，先行）

**目的**：消除已知缺陷，避免迁移后踩坑。

- [ ] 修 `ConstantDaoImpl.java:54-56` 4 参数 `queryConstant` 的 `type/key` 错拼。
- [ ] 修 `ConstantAction.java` 方法名（`queryCategory`→`queryConstant` 等，4 处）。
- [ ] 修 `js/data/constant.js:189` `contant.cid` 笔误。
- [ ] 验证：常量管理页增删改查正常；`js/com/constant.js` 访问器对 `data` 模块现有数据（如 `receiptType`）读取正常。

**产出**：独立提交，与数据迁移解耦。

### 阶段 1：通用状态类（启用/禁用，量大同质，风险最低）

**数据**（SQL 脚本 `sqls/migrate_datajson_constants_phase1.sql`）：
`data.common.status`、`data.contract.status`、`data.cost.status`、`data.task.status`、`data.talking.status`、`data.taskParam.status`、`data.surveyTemplate.status`、`data.chating.status`、`data.constant.status`。

**前端**：
- `condition/data.js`：行 479/505/946/992/1054/1173/1365/1682/1840（status 类）。
- `data/constructionCost.js`、`data/normadd.js`、`data/normpack.js`、`data/surveyTemplate.js`、`data/constant.js`、`condition/approval.js`、`data/chating.js`（仅 status 部分）。

**验证**：各对应页面的"状态"下拉显示"启用/禁用"，筛选生效。

### 阶段 2：客户与楼盘域

**数据**：`customer.customer.relationshipType`、`customer.customer.type`、`customer.vscoreRecord.type`、`data.house.*`（type/through/orientation/roomNum/waterVavour/parlourType/heatingType）、`data.label.type`。

**前端**：
- `building/*.js`（5 文件）、`data/customer.js`、`data/label.js`、`data/checkRanking.js`、`decoration/decoration4detail.js`。
- `condition/customer.js`、`condition/data.js:40`（serviceNodeType 移到阶段 3 或此阶段均可）。

**验证**：楼盘创建/详情页的房屋属性、客户类型、关系类型下拉正确。

### 阶段 3：服务节点 / 任务参数 / 报价域

**数据**：`data.serviceNode.type`、`data.serviceNode.attnode`、`data.taskParam.*`（type/status/ismain/oneType/module）、`data.task.level`、`data.task.isShow`、`data.decorationMatching.vision`、`data.category.type`、`data.price.ctypes`。

**前端**：
- `data/serviceNode.js`、`data/taskParam.js`、`information/plan2create.js`、`data/decorationMatching.js`、`data/category.js`。
- `condition/data.js`：行 40/1156/1190 及 taskParam 相关。

**特别注意**：`taskParamModule` 的 key/value 对调（见 4.4）。

### 阶段 4：签章 / 图表 / 谈单 / 辅材域

**数据**：`data.signet.status`、`data.signet.type`、`data.chart.type`、`data.chart.level`、`data.talking.type`、`data.aoods.atttype`、`data.chating.type`、`data.chating.atttype`。

**前端**：
- `data/signet.js`、`data/supplierSignet.js`、`data/chart.js`、`data/talking.js`、`data/aoods.js`、`data/chating.js`（type/atttype 部分）。
- `condition/data.js`：行 1225/1241/1267/1308/1324/1349/1412。

### 阶段 5：收尾与清理

- [ ] 全量回归：grep 确认 `api.ds.data` 引用归零（`grep -rn "api.ds.data" WebContent/js --include=*.js | grep -v api/ds.js`）。
- [ ] 确认 `data.json` 内所有字段均已迁移且无业务依赖。
- [ ] 删除 `WebContent/ds/data.json`（或保留空壳 `{}` + `errorCode/errorMsg`）。
- [ ] 移除 `api/ds.js:48-52` 的 `data` 注册项（确认无残留引用后）。
- [ ] 更新 `src/com/fanglin/communion/CLAUDE.md` 记录迁移结果。

---

## 六、验证清单（每阶段通用）

1. **数据**：`SELECT * FROM communion.constant WHERE module='data' AND clazz='<x>' AND type='<y>' AND status=0;` 条数与 `data.json` 对应段一致。
2. **前端访问器**：浏览器控制台执行 `constant.data().<clazz>.<type>.datas` 返回正确数组；`Constant().valueOf('data','<clazz>','<type>',<key>)` 返回正确中文。
3. **页面下拉**：对应管理页/创建页/详情页下拉选项与迁移前一致。
4. **筛选**：条件搜索器按该字段筛选结果正确。
5. **key 类型**：对涉及 `key` 严格比较的业务逻辑做等价性核对（多为低风险）。
6. **回归**：`data.json` 仍保留期间，未迁移字段不受影响。

---

## 七、回滚策略

- 每阶段独立提交，回滚即 `git revert` 对应 commit + `DELETE FROM communion.constant WHERE ...` 清理本阶段数据。
- 阶段 5 前 `data.json` 始终保留，任意阶段前端回退后仍可读静态文件，业务不中断。
- 后端缺陷修复（阶段 0）若引发问题，可单独 revert，不影响数据迁移主体。

---

## 八、附录：关键文件索引

| 角色 | 文件 |
|---|---|
| 静态数据源（待迁移） | `WebContent/ds/data.json` |
| 静态源 API 注册 | `WebContent/js/api/ds.js:48` |
| 常量访问器（目标） | `WebContent/js/com/constant.js` |
| 常量 CRUD API | `WebContent/js/api/data.js:2109-2130` |
| 常量管理页 | `WebContent/views/data/constant.html` + `WebContent/js/data/constant.js` |
| 条件搜索器配置 | `WebContent/js/condition/data.js` |
| 请求核心 | `WebContent/js/com/core.js:112-322` |
| 后端 Action | `src/com/fanglin/communion/action/ConstantAction.java` |
| 后端 Service | `src/com/fanglin/communion/service/impl/ConstantServiceImpl.java` |
| 后端 DAO | `src/com/fanglin/communion/dao/impl/ConstantDaoImpl.java` |
| PO | `src/com/fanglin/communion/po/ConstantPO.java` |
| 建表脚本 | `dbs/communion.sql` |
| 数据样例参考 | `sqls/aoodsCharge_constants.sql`、`sqls/add_normtime_status_constant.sql` |
