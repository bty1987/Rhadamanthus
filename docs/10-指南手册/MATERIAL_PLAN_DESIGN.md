# 主材计划(MaterialPlan)功能 设计与开发文档

# 主材计划(MaterialPlan)功能 设计与开发文档

> 日期: 2026-09-19
> 状态: **已实施(2026-09-19 当日完成 Phase 1 + app 版, 拍板见 §11)**
> 实施记录: 后端 data 7 文件 + construction 8 文件; SQL 发版包 `sqls/construction/22_material_plan.sql`; 老版前端 4 新文件 + 4 处修改; app 版 4 新文件 + 3 处修改; 双 jar 已构建 `fanglin-data-8.3.029.jar`(705356B) + `fanglin-construction-8.3.029.jar`(279369B); 错误码 120047-120052 已登记 error.md
> 需求来源: 在工程模块中, 参照工程计划(constructionplan)/工程进度(constructionschedule)的既有逻辑, 增加"主材计划"——按**品类或品牌**维度, 关联施工节点的**计划(plan)或实际(schedule)**时间, 安排主材**下单/配送/到货**计划; 即: 到具体的什么施工环节, 哪些主材需要完成什么样的操作, 并有对应功能数据支撑。

---

## 1. 背景与目标

### 1.1 现状痛点

- 工程计划(`constructionplan`)中的主材信息只有两个**纯文本/天数**字段: `material`(配套主材, 字符串)与 `comnum`(主材天数), 无结构化数据, 无法回答"哪个环节、哪些主材、要做什么、什么时候做、做了没有"。
- 主材履约链(销售单→配送单→到货确认)数据齐全, 但与施工节点**完全脱钩**: 没有任何表把"瓷砖必须在瓦工开工前到货"这类约束落在数据上。
- 全仓库 grep `materialplan|MaterialPlan|主材计划|材料计划` **0 命中**, 无任何雏形, 属全新功能。

### 1.2 目标

| 目标 | 说明 |
|---|---|
| 结构化主材计划 | 按公司维护规则: 品类/品牌 × 施工节点 × 动作(下单/配送/到货) × 时间锚点与偏移 |
| 订单级实例 | 每个装修单生成主材计划实例, 展示"计划时点"并与实际进度对照 |
| 计划/实际双锚点 | 计划时点可锚定工程进度的**计划时间**(放线推算)或**实际时间**(开完工实录) |
| 履约回填 | 下单/配送/到货的实际完成情况**从既有履约链自动回填**(销售单/配送单/选材单), 不自造新状态机、不改业务模块 |
| 手工兜底 | 支持手工确认完成/取消/指定时点, 覆盖线下操作未录入系统的场景 |

---

## 2. 现状事实(设计依据, 均已代码核实)

### 2.1 工程计划链(模板→实例 拷贝范式)

- 定额模板: `data.constructionpace`(按面积+公司的定额) → `data.constructionpacenode`(定额节点行: connum工程天数/**comnum主材天数**/prenum/postnum/phase/**material配套主材文本**/period), `src/com/fanglin/data/po/ConstructionPaceNodePO.java:21`
- 订单实例: `construction.constructionplan`, `src/com/fanglin/construction/po/ConstructionPlanPO.java:33`, 单表无明细
- 生成: `ConstructionPlanServiceImpl.makeConstructionPlan`(ServiceImpl:69-118)——保存工程信息时自动触发(`ConstructionInfoServiceImpl:153`), 已有则幂等返回, 逐行拷贝定额节点; `addConstructionPlan`(120-156) 按 cpnid 取定额节点补行, **不存在的定额节点抛 120037**
- ⚠️ 关键事实: `ConstructionPlanPO` 的 `startTime/endTime/cid` **后端从不写入**(仅 DDL 存在); 前端 `constructionPlan.js:124-187` 用 drawlineTime + 天数**前端累加推算**展示列。→ **工程计划表没有可锚定的落库计划时间**。

### 2.2 工程进度链(真正存了 计划+实际 两套时间)

- `construction.constructionschedule`, `src/com/fanglin/construction/po/ConstructionSchedulePO.java:34`, 字段要点:
  - `orderId`(装修单号) + `cid`(工程id) + `node`→cnid(EAGER, `data.constructionnode`) + `name`(节点名快照) + `schedule`(节点序快照=node.sort)
  - **计划时间**: `preStartTime`/`preEndTime`(预计开完工, 放线时推算落库)
  - **实际时间**: `startTime`/`endTime`(实际开完工, begin/finish 流转写入) + `enterTime`/`leaveTime`(工人进离场)
  - `status`: 0初始/1已开工/2已完工(常量在 PO:39-72); 开完工流转 `beginConstructionSchedule`/`finishConstructionSchedule`(ServiceImpl:202/280)
- schedule 实例产生: 放线三入口(`DrawLineServiceImpl.pretreatDrawLine:203`/`successDrawLine:519`/`finishDrawLine:642`)、旧量尺(`DecorationMeasureServiceImpl:190`)、手工追加(`addConstructionSchedule:516`, orderId+cnid 查重抛 120036)、seiya 开放平台(`A20251208ServiceImpl:995/1186`)
- 重排: `resetConstructionSchedule`(ServiceImpl:437-493) 从某环节实际 startTime 重算后续全部行的 pre* 时间 → **schedule 的计划时间会被重排刷新, 主材计划必须能跟随**
- "node默认+schedule实例"三族先例(checkout比例/salaryLimit/accessoryLimit): 字典按公司定义, 实例按订单快照, 本设计沿用该范式

### 2.3 主材域(品类/品牌/商品/履约链)

| 概念 | 表 | 关键事实 |
|---|---|---|
| 品类 | `communion.category`(CategoryPO:12) | 一级平表(cid/no/name), 无父子 |
| 品牌 | `communion.brand`(BrandPO:21) | **品牌天然 1:1 归属品类**(`category`→cid, BrandPO:130-134), 另有 supplier(厂商) |
| 商品 | `data.goods`(GoodsPO:20) | `category`=**品类名字符串**(非外键, GoodsPO:210), `bid`(long 裸外键)+`brand`(名字符串)双份冗余(GoodsPO:219/228) |
| 下单 | `sales.sales`(SalesPO:25) | **主材"下单"=创建销售单** `SalesServiceImpl.addSales`(:299); `orderId` 字符串列(:261), `category` 品类名冗余(SalesServiceImpl:352 从品牌所属品类拷贝), `brand`→bid(:426); status: 0初始/2全退/3退单/4作废/5完结 |
| 采购(可选) | `inventory.purchase` | 销售单后续环节(sales2pu 页发起), 不在下单事务内, 本期不作为动作 |
| 配送/到货 | `sales.salesdelivery` + `sales.salesdeliveryitem` | 配送明细状态机 **0初始→1配送(tranTime)→2审核→3确认/到货(confirmTime)→4完成**(SalesDeliveryItemPO:64-72); 项上带 `bid`/`gid`; `protranTime` 预计配送时间 |
| 选材(平行链) | `quotation.selection`/`selectionitem` | SelectionItemPO:22, `orderId`(:226)+`goods`→gid; status **0初始→1配送(tranTime)→2审核→3确认(confirmTime)→4完结**(:61-75); 与 sales 模块**无自动转换**(grep 0 命中), 是另一条独立的配送确认链 |
| 材料单(第三链) | `material.material`(MaterialPO:24) | 按品牌+装修单的材料销售单, status 4=购货(到货); 部分公司走此链而非 sales —— **是否纳入回填见 §11 待定夺** |

### 2.4 前端/配置机制(照抄的模板)

- 订单弹窗页范式: 工程信息列表行按钮 `conplan`(`constructionInfo.js:308-318`)以 `com.popup4page('/views/construction/constructionPlan.html')` 弹出, 上下文 `params.construction`(含 orderId/drawlineTime); 按钮显隐走 `btnVisible("conplan")`
- 页面配置: `construction.constructionfunction`(name/key/value/type/subtype/comment/sort 种子行) + `platform.constructionfunctionright`(name+cfid+company 授权), 种子模板 `sqls/construction/constructionfunction.sql:476-509`(constructionPlan 页全套 + constructionInfo pageBtn 行), company=0 默认授权 INSERT-SELECT 见 :525-528
- 菜单/授权模板: `sqls/construction/21_menu_drawline.sql`(communion.module 插入 + rolemodule INSERT-SELECT 复制同目录既有菜单授权, 非幂等, 带执行前后核验)
- 错误码段: construction=`120xxx`(error.md 模块码段表), 已占用至 **120046**(摄像头), 本设计新码从 **120047** 起

---

## 3. 总体方案

### 3.1 两层模型(参照 node→schedule / pacenode→plan 双先例)

```
公司级规则(字典)                      订单级实例
data.materialplannode      ──生成──▶  construction.materialplan
(品类/品牌×节点×动作×锚点×偏移)        (规则快照 + 手工状态, 每单一套)
        │                                    │
        │                          planTime = 读时推算(不落库)
        │                          anchorTime: schedule.pre*/实际时间 + offsetDay
        │                                    │
        └── 展示时 ◀── 履约回填(读时聚合, 不落库) ──┘
            sales(下单) / salesdeliveryitem(配送/到货) / selectionitem(配送/到货)
```

### 3.2 六个核心设计决策

| # | 决策 | 理由 |
|---|---|---|
| D1 | **锚点挂 schedule, 不挂 constructionplan** | 工程计划表无落库时间(§2.1⚠️), schedule 的 `preStartTime/preEndTime`(计划)与 `startTime/endTime`(实际)是唯一同时具备计划+实际的数据源; 锚点4类: 0计划开工/1计划完工/2实际开工/3实际完工 |
| D2 | **计划时点读时推算, 不落库** | `生效时点 = manualTime(手工覆盖) ?? anchorTime + offsetDay天`; schedule 重排(resetConstructionSchedule)后自动跟随, 零维护零漂移; 手工覆盖仅存例外值 |
| D3 | **实际锚点空值回退计划锚点** | anchor=2/3 但节点未实际开完工时, 回退 preStartTime/preEndTime; 全空(未放线/未排)则时点为空, 前端显示"待定" |
| D4 | **履约回填=读时聚合, 不写业务模块** | 从 sales/salesdeliveryitem/selectionitem 按订单批量查(3条SQL, §6.4), 只读不改, 遵守"不改业务模块"铁律; 不在主材计划里复制一套履约状态机 |
| D5 | **维度=正交 type 行(0品类/1品牌)** | 用户口径"品类或者品牌"; 品牌行天然携带品类(brand→category), 实例快照两类名称都存, 匹配时品牌行按 bid 精确匹配、品类行按品类名匹配 |
| D6 | **排序不设 sort 列/move 接口** | 行天然挂在施工节点下, 展示序=节点排期(schedule.schedule)→动作→偏移, 权威序已有, 免去工程计划的 sort+move 维护成本 |

### 3.3 状态机

- 规则 `data.materialplannode.status`: 0启用/1停用(照 constructionnode, **不提供删除**, 停用后不再被生成引用, 已生成实例不受影响)
- 实例 `construction.materialplan.status`:
```
0 未完成 ──confirmMaterialPlan──▶ 1 已完成(手工)   [actualTime=now, operater]
0/1      ──cancelMaterialPlan───▶ 2 已取消          [再执行则恢复为0, 非破坏性]
```
- 展示层"系统履约档位" `autoStatus`(VO 派生字段, 不落库): 0未履约/1已下单/2已配送/3已到货; 逾期 = 生效时点<今天 且 status=0 且 autoStatus<动作对应档位(下单→1/配送→2/到货→3), 前端标红

---

## 4. 数据库设计

### 4.1 DDL 原文(落盘 `sqls/construction/22_material_plan.sql`, 编号顺延)

```sql
-- =============================================================
-- 主材计划 DDL  2026-09-19  纯新增表, 零存量改动
-- =============================================================

-- 1. 公司级规则表(主材计划字典)
CREATE TABLE IF NOT EXISTS `data`.`materialplannode` (
  `mpnid`        BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
  `type`         TINYINT      NOT NULL DEFAULT 0 COMMENT '维度: 0品类 1品牌',
  `cid`          BIGINT       NOT NULL DEFAULT 0 COMMENT '品类id(communion.category.cid), type=0时有效',
  `bid`          BIGINT       NOT NULL DEFAULT 0 COMMENT '品牌id(communion.brand.bid), type=1时有效',
  `categoryName` VARCHAR(64)  NOT NULL DEFAULT '' COMMENT '品类名快照',
  `brandName`    VARCHAR(64)  NOT NULL DEFAULT '' COMMENT '品牌名快照',
  `cnid`         BIGINT       NOT NULL COMMENT '锚点施工节点(data.constructionnode.cnid)',
  `nodeName`     VARCHAR(64)  NOT NULL DEFAULT '' COMMENT '节点名快照',
  `action`       TINYINT      NOT NULL DEFAULT 0 COMMENT '动作: 0下单 1配送 2到货',
  `anchor`       TINYINT      NOT NULL DEFAULT 0 COMMENT '锚点: 0计划开工 1计划完工 2实际开工 3实际完工',
  `offsetDay`    INT          NOT NULL DEFAULT 0 COMMENT '偏移天数: 负=锚点前N天 0=当日 正=锚点后N天',
  `status`       TINYINT      NOT NULL DEFAULT 0 COMMENT '0启用 1停用',
  `comment`      VARCHAR(128) NOT NULL DEFAULT '' COMMENT '说明',
  `creater`      BIGINT       NOT NULL DEFAULT 0 COMMENT '创建人uid',
  `company`      INT          NOT NULL DEFAULT 0 COMMENT '公司cid',
  `createTime`   DATETIME     NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`mpnid`),
  KEY `idx_company_status` (`company`, `status`),
  KEY `idx_cnid` (`cnid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='主材计划规则表(公司级字典)';

-- 2. 订单级实例表(主材计划)
CREATE TABLE IF NOT EXISTS `construction`.`materialplan` (
  `mpid`        BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
  `cid`         BIGINT       NOT NULL DEFAULT 0 COMMENT '工程id(construction.construction.cid, 生成时取自schedule行)',
  `orderId`     VARCHAR(16)  NOT NULL COMMENT '装修单号',
  `ruleId`      BIGINT       NOT NULL DEFAULT 0 COMMENT '来源规则mpnid, 手工添加行=0',
  `type`        TINYINT      NOT NULL DEFAULT 0 COMMENT '维度快照: 0品类 1品牌',
  `categoryId`  BIGINT       NOT NULL DEFAULT 0 COMMENT '品类id快照',
  `categoryName` VARCHAR(64) NOT NULL DEFAULT '' COMMENT '品类名快照(品牌行=品牌所属品类)',
  `brandId`     BIGINT       NOT NULL DEFAULT 0 COMMENT '品牌id快照(品类行=0)',
  `brandName`   VARCHAR(64)  NOT NULL DEFAULT '' COMMENT '品牌名快照(品类行=空)',
  `cnid`        BIGINT       NOT NULL COMMENT '锚点施工节点id',
  `nodeName`    VARCHAR(64)  NOT NULL DEFAULT '' COMMENT '节点名快照(优先取该单schedule.name)',
  `action`      TINYINT      NOT NULL DEFAULT 0 COMMENT '动作快照: 0下单 1配送 2到货',
  `anchor`      TINYINT      NOT NULL DEFAULT 0 COMMENT '锚点快照: 0计划开工 1计划完工 2实际开工 3实际完工',
  `offsetDay`   INT          NOT NULL DEFAULT 0 COMMENT '偏移天数快照',
  `manualTime`  DATETIME     DEFAULT NULL COMMENT '手工指定的计划时点(NULL=按锚点+偏移推算)',
  `status`      TINYINT      NOT NULL DEFAULT 0 COMMENT '0未完成 1已完成(手工) 2已取消',
  `actualTime`  DATETIME     DEFAULT NULL COMMENT '手工完成时间',
  `operater`    BIGINT       NOT NULL DEFAULT 0 COMMENT '操作人uid(完成/取消)',
  `comment`     VARCHAR(128) NOT NULL DEFAULT '' COMMENT '说明',
  `company`     INT          NOT NULL DEFAULT 0 COMMENT '公司快照(生成时取decoration.company)',
  `createTime`  DATETIME     NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`mpid`),
  KEY `idx_orderId` (`orderId`),
  KEY `idx_company_status` (`company`, `status`),
  KEY `idx_cnid` (`cnid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='主材计划表(订单级实例)';
```

要点:
- 全部为**新表**, 默认值即现状等价(无存量迁移); PO 侧 `cid/bid/cnid` 用裸 long 列(照 `SalesPO.bid`/`GoodsPO.bid` 先例), 不建 ManyToOne, 避免 EAGER/LAZY 纠纷
- 列名用 `offsetDay` 规避 `OFFSET` 关键字风险
- 名称快照(categoryName/brandName/nodeName)照 `constructionschedule.name` 快照先例: 字典改名不追溯历史行, 匹配一律走 id(品牌)或生成时点名字(品类, 见 §6.4 匹配规则)
- 查重不做唯一索引(cid/bid 按 type 二选一含 NULL 语义, 复合唯一索引别扭), **代码级查重**(照 `addConstructionSchedule` 120036 先例)

### 4.2 枚举常量(PO 内定义, 照 ConstructionSchedulePO 常量风格)

```java
// MaterialPlanNodePO / MaterialPlanPO 共用语义, 各自定义本表相关
TYPE_CATEGORY_INT = 0;  TYPE_BRAND_INT = 1;
ACTION_ORDER_INT = 0;   ACTION_DELIVERY_INT = 1;  ACTION_ARRIVAL_INT = 2;
ANCHOR_PRE_START_INT = 0; ANCHOR_PRE_END_INT = 1; ANCHOR_START_INT = 2; ANCHOR_END_INT = 3;
STATUS_INIT_INT = 0;    STATUS_CONFIRM_INT = 1;   STATUS_CANCEL_INT = 2;   // 实例
STATUS_ENABLE_INT = 0;  STATUS_DISABLE_INT = 1;                            // 规则
AUTO_NONE_INT = 0;      AUTO_ORDERED_INT = 1;     AUTO_DELIVERED_INT = 2;  AUTO_ARRIVED_INT = 3; // VO派生
```

---

## 5. 后端设计

### 5.1 文件清单(全新文件, 模块归属照 ConstructionNode/ConstructionPlan 先例)

| 层 | data 模块(规则) | construction 模块(实例) |
|---|---|---|
| PO | `src/com/fanglin/data/po/MaterialPlanNodePO.java` | `src/com/fanglin/construction/po/MaterialPlanPO.java` |
| VO | `src/com/fanglin/data/vo/MaterialPlanNodeVO.java` | `src/com/fanglin/construction/vo/MaterialPlanVO.java` |
| DAO | `src/com/fanglin/data/common/dao/MaterialPlanNodeDao.java` + `impl/MaterialPlanNodeDaoImpl.java` | `src/com/fanglin/construction/dao/MaterialPlanDao.java` + `impl/MaterialPlanDaoImpl.java` |
| Service | `src/com/fanglin/data/common/service/MaterialPlanNodeService.java` + `impl/MaterialPlanNodeServiceImpl.java` | `src/com/fanglin/construction/service/MaterialPlanService.java` + `impl/MaterialPlanServiceImpl.java` |
| Action | `src/com/fanglin/data/common/action/MaterialPlanNodeAction.java` | `src/com/fanglin/construction/action/MaterialPlanAction.java` |

发版 jar: **fanglin-data + fanglin-construction 双 jar 同批**(construction 依赖 data 新 PO/规则查询); 构建走 `bins\build\build-module.bat data construction`(项目无 pom, 禁 mvn)。

### 5.2 data 侧: 规则维护(类内方法序即下述顺序)

DAO `MaterialPlanNodeDao`(extends `DaoImpl<MaterialPlanNodePO>`):
- `pageMaterialPlanNode(Paging p, List<Filter> filters)` — PagingQuery, alias join 不需要(名称已快照), 默认排序 `cnid asc, action asc, offsetDay asc`
- `queryMaterialPlanNode(Integer company)` — Criteria eq company + eq status=0, 生成实例与下拉数据源
- `countMaterialPlanNode(MaterialPlanNodeVO vo)` — 查重: company+type+cid+bid+cnid+action 六值全等计数

Service `MaterialPlanNodeServiceImpl`(类级 `@Transactional(readOnly=true)`, 写方法 `@Transactional(rollbackFor=Exception.class)`):
- `pageMaterialPlanNode(Paging, List<Filter>)` — 直通
- `queryMaterialPlanNode(Integer company)` — 直通
- `addMaterialPlanNode(MaterialPlanNodeVO, int userId)` — 校验: 品类/品牌/节点存在(查既有 DAO, 品牌行由 brand.category 反解并快照 categoryName); `countMaterialPlanNode>0` 抛 **120048**; 快照名称落库
- `updateMaterialPlanNode(MaterialPlanNodeVO)` — 不存在抛 **120047**; 查重排除自身; 维度/节点变更时刷新快照名
- `updateMaterialPlanNodeForStatus(MaterialPlanNodeVO)` — 启停(照 `updateConstructionNodeForStatus` 先例), 排在 update 之后

Action `MaterialPlanNodeAction`(`@Namespace("/") @ParentPackage("base")`, extends BaseListAction, **`throws FLException` 上抛, 禁本地 try-catch, 无权限注解**——控权走前端配置, 照 ConstructionPlanAction 先例):
- `pageMaterialPlanNode` / `queryMaterialPlanNode` / `addMaterialPlanNode` / `updateMaterialPlanNode` / `updateMaterialPlanNodeForStatus`(均 JSON result)

### 5.3 construction 侧: 订单实例

DAO `MaterialPlanDao`(extends `DaoImpl<MaterialPlanPO>`):
- `pageMaterialPlan(Paging, List<Filter>)` — **Phase 2**(跨订单列表页, 需 DO join decoration 取楼盘/客户/公司)
- `queryMaterialPlanByOrderId(String orderId)` — eq orderId
- `countMaterialPlan(String orderId)` — 生成幂等判断(照 `countConstructionPlan` 裸 SQL 先例)
- `queryMaterialFulfillByOrderId(String orderId)` — **履约回填原生 SQL 三连**(见 §6.4), 返回轻量 Map 列表(跨 catalog 只读, 照 `ConstructionScheduleDaoImpl.countConstructionSchedule` 裸 SQL 跨库先例, 参数化查询)

Service `MaterialPlanServiceImpl`:

| 方法(序即类内顺序) | 逻辑 |
|---|---|
| `queryMaterialPlanByOrderId(String orderId)` | 见 §6 推算+回填装配; `@Transactional(readOnly=true)` |
| `makeMaterialPlan(MaterialPlanVO vo)` | 见 §6.2 生成算法 |
| `addMaterialPlan(MaterialPlanVO vo, int userId)` | 手工补行: ruleId=0; schedule 必须已有(120049); orderId+type+cid/bid+cnid+action 查重抛 **120052**; 快照名解析(节点名优先取该单 schedule.name); status=0 |
| `updateMaterialPlan(MaterialPlanVO vo)` | 不存在抛 **120050**; 仅改 anchor/offsetDay/manualTime/comment(status=2 已取消行允许改, 改完仍是取消态, 需 cancel 恢复) |
| `confirmMaterialPlan(MaterialPlanVO vo, int userId)` | 不存在抛 120050; status!=0 抛 **120051**; 置 status=1, actualTime=now, operater=userId |
| `cancelMaterialPlan(MaterialPlanVO vo, int userId)` | 不存在抛 120050; status=2 时恢复为 0(取消可逆), 否则置 2; 记 operater |
| `deleteMaterialPlan(MaterialPlanVO vo)` | 不存在抛 120050; 直接 deleteById(照 deleteConstructionPlan 先例, 无状态限制) |

排序约束自查: 读类(page/query)→写类(add→update→confirm/cancel→delete), confirm 属"改"类排在 update 之后, cancel 属"撤"类排在 delete 之前 ✔ 符合 AGENTS.md 方法排序约束。

Action `MaterialPlanAction`(同上规范):
- `queryMaterialPlanByOrderId` / `makeMaterialPlan` / `addMaterialPlan` / `updateMaterialPlan` / `confirmMaterialPlan` / `cancelMaterialPlan` / `deleteMaterialPlan`(Phase 2 加 `pageMaterialPlan`, 插在最前)

### 5.4 错误码登记(先改 `docs/03-API文档/API/error.md` 再用码, 全局唯一消息文本)

| 码 | 消息 | 抛点 |
|---|---|---|
| 120047 | 主材计划规则不存在 | updateMaterialPlanNode |
| 120048 | 主材计划规则已存在 | addMaterialPlanNode / updateMaterialPlanNode 查重 |
| 120049 | 工程进度不存在,请先放线 | makeMaterialPlan / addMaterialPlan(schedule 空前置) |
| 120050 | 主材计划不存在 | update/confirm/cancel/delete |
| 120051 | 主材计划已完成,不可操作 | confirmMaterialPlan |
| 120052 | 主材计划已存在 | addMaterialPlan 查重 |

(120047 前已核实 120xxx 段占用至 120046=摄像头; 实施时再全量 grep error.md 复核一次。)

---

## 6. 核心算法

### 6.1 计划时点推算(query 装配期, 不落库)

```
输入: rows = materialPlanDao.queryMaterialPlanByOrderId(orderId)
      schedules = constructionScheduleDao.queryConstructionScheduleByOrderId(orderId) → Map<cnid, SchedulePO>

对每行:
  schedule = map.get(cnid)                       // 可能为 null(节点被删/未排)
  anchorTime = switch(anchor):
      0 -> schedule.preStartTime                  // 计划开工
      1 -> schedule.preEndTime                    // 计划完工
      2 -> schedule.startTime  ?? preStartTime    // 实际开工, 空回退计划(D3)
      3 -> schedule.endTime    ?? preEndTime      // 实际完工, 空回退计划
  planTime(生效) = manualTime ?? (anchorTime == null ? null : anchorTime + offsetDay 天)
  // anchorTime 为 null ⇒ planTime 为 null ⇒ 前端显示"待定", 逾期不判定

排序(D6): schedule.schedule asc → action asc → offsetDay asc → mpid asc; 无 schedule 匹配的行排最后
```

### 6.2 生成算法 makeMaterialPlan

```
1. schedules = queryConstructionScheduleByOrderId(orderId); 空或size==0 → 抛 120049
2. countMaterialPlan(orderId) > 0 → 直接返回(幂等, 照 makeConstructionPlan)
3. decoration = decorationDao 查单取 company(不存在抛 140013)
4. rules = materialPlanNodeDao.queryMaterialPlanNode(decoration.company)   // 仅启用
5. 逐条拷贝: type/categoryId/categoryName/brandId/brandName/action/anchor/offsetDay
   cid     = schedules[0].cid
   cnid    = rule.cnid; nodeName = scheduleMap.get(cnid)?.name ?? rule.nodeName  // 优先订单实例快照
   ruleId  = rule.mpnid; status=0; company=decoration.company; createTime=now
6. 批量 save(逐条 save 即可, 规则量级≈节点数×3动作, 几十行)
```

> 不做放线钩子自动生成(改 DrawLineServiceImpl 属业务模块侵入), 生成由前端"生成"按钮显式触发; Phase 2 可选钩子见 §10。

### 6.3 手工补行 addMaterialPlan

前端从该单 schedule 列表选节点(保证 cnid 一定在排期内), 从品类/品牌字典选维度; 与生成行同查重口径(orderId+type+cid/bid+cnid+action)。

### 6.4 履约回填(读时聚合, 3 条参数化原生 SQL, 防两級 N+1)

按 orderId 一次取全(订单级 sales/selection 行数有限, 十量级):

```sql
-- SQL1 下单源: 有效销售单(0初始/5完结; 排除2全退/3退单/4作废)
SELECT s.sid, s.createTime, s.category, s.bid, b.name AS brandName
FROM `sales`.`sales` s LEFT JOIN `communion`.`brand` b ON b.bid = s.bid
WHERE s.orderId = :orderId AND s.status IN (0, 5);

-- SQL2 配送/到货源: 配送明细(状态机 1配送/3确认到货)
SELECT di.sdiid, di.sid, di.status, di.tranTime, di.confirmTime,
       di.bid AS deliveryBid, g.bid AS goodsBid, g.category AS goodsCategory
FROM `sales`.`salesdeliveryitem` di
JOIN `sales`.`sales` s ON s.sid = di.sid
LEFT JOIN `data`.`goods` g ON g.gid = di.gid
WHERE s.orderId = :orderId;

-- SQL3 选材平行链(仅回填配送/到货; 选材不视为"下单")
SELECT si.siid, si.status, si.tranTime, si.confirmTime, g.bid AS goodsBid, g.category AS goodsCategory
FROM `quotation`.`selectionitem` si LEFT JOIN `data`.`goods` g ON g.gid = si.gid
WHERE si.orderId = :orderId AND si.status BETWEEN 1 AND 6;   -- 排除0初始/7失效
```

匹配与档位判定(Java 装配):

```
对每计划行:
  命中集合 = type==品牌 ? (SQL1.bid==brandId 或 SQL2.deliveryBid/goodsBid==brandId 或 SQL3.goodsBid==brandId)
                        : (SQL1.category==categoryName 或 SQL2/SQL3.goodsCategory==categoryName)
              // 品类按品类名严格匹配(生成时点快照名); 品牌按 bid 精确匹配
  autoStatus = max(
      命中SQL1行存在                       -> 1 已下单(autoTime=最早 createTime)
      命中SQL2/SQL3行 status>=1            -> 2 已配送(autoTime=max tranTime)
      命中SQL2/SQL3行 status>=3            -> 3 已到货(autoTime=max confirmTime))
  salesInfo = 命中的销售单号/单数(前端"来源"列跳转销售模块查看)
  overdue   = planTime!=null && planTime<今天 && status==0 && autoStatus < (action+1)
```

> ⚠️ 已知口径坑(写入联调清单): `sales.category` 是**品类名字符串**(SalesServiceImpl:352), 与 `goods.category` 同为名字匹配, 大小写/全半角不一致即不命中——匹配前 trim, 不做模糊; 字典改名导致的历史偏差由快照名隔离(§4.1 要点)。

---

## 7. 前端设计(老版 WebContent + app 版两版同步, 见 §7.4)

### 7.1 规则维护页(挂数据字典)

- 页面: `WebContent/views/data/materialplannode.html`, 脚本 `WebContent/js/data/materialplannode.js`, API 段追加 `WebContent/js/api/data.js`
- Searcher 分页列表(照 constructionNode.html 同目录惯例), 条件: 维度/动作/节点/状态; 列: 维度/品类/品牌/施工节点/动作/锚点/偏移天数/状态/说明/创建时间
- 行按钮: `edit`(编辑)、`status`(启停); 顶部按钮: 添加
- 添加/编辑弹窗(ACE 弹窗表单惯例: label col-sm-3 + 控件 col-xs-10 col-sm-5):
  - 维度 select(type): 切换联动品类/品牌控件显隐
  - 品类 select: `api.communion` 既有品类查询; 品牌 select: 既有品牌查询(带公司过滤)
  - 施工节点 select: `api.data.queryConstructionNode`(本公司启用节点, 显示 sort 序)
  - 动作/锚点 select(constant 枚举); 偏移天数 input(`v_number` class, 页面校验即生效); 说明 textarea
- 菜单 SQL: 见 §8.3(挂 constructionNode.html 同级数据字典目录)

### 7.2 订单主材计划页(工程信息行按钮弹窗, conplan 同款)

- 页面: `WebContent/views/construction/materialPlan.html`, 脚本 `WebContent/js/construction/materialPlan.js`; 尾部挂 `js/utils/constructionPageUtils.js`
- 入口: `constructionInfo.js` 行按钮区增 `matplan`(主材计划), `com.popup4page(..., '/views/construction/materialPlan.html', '主材计划')`, `show: btnVisible("matplan")`, 上下文 `params.construction`(orderId/drawlineTime 同 conplan)
- 顶部按钮: `#makeBtn` 生成(先查空再生成, 已生成则隐藏并提示)、`#addBtn` 添加(手工补行)
- 列(propertyMap 全集, 实际列=constructionfunction propertyArr 配置驱动):

| property | 列名 | 说明 |
|---|---|---|
| nodeName | 施工节点 | |
| type | 维度 | constant 枚举 |
| categoryName | 品类 | 品牌行也显示其所属品类 |
| brandName | 品牌 | 品类行为空 |
| action | 动作 | constant 枚举(下单/配送/到货) |
| anchor | 锚点 | constant 枚举 |
| offsetDay | 偏移天数 | 负值显示"前N天" |
| planTime | 计划时点 | 推算值(只读); null 显示"待定" |
| manualTime | 指定时点 | 手工覆盖值 |
| autoStatus | 系统履约 | constant 枚举(未履约/已下单/已配送/已到货) |
| autoTime | 履约时间 | |
| status | 状态 | 未完成/已完成/已取消; **逾期行整行标红**(overdue) |
| actualTime | 完成时间 | 手工确认时间 |
| comment | 说明 | |

- 行按钮(pageBtn 配置驱动): `edit`(编辑: 偏移/锚点/指定时点/说明)、`confirm`(完成, status=0 才显示)、`cancel`(取消/恢复)、`del`(删除, layer.confirm 二次确认)
- API 段追加 `WebContent/js/api/construction.js`: `queryMaterialPlanByOrderId`(query)/`makeMaterialPlan`/`addMaterialPlan`/`updateMaterialPlan`/`confirmMaterialPlan`/`cancelMaterialPlan`/`deleteMaterialPlan`(update 类); 时间字段无 tranargs 需求, 偏移天数按既有 api 数字转换写法
- 枚举显示走 communion.constant 表(见 §8.2), 前端读法照 `constructionSchedule.js` 的 `constant.construction().constructionSchedule.planStatus` 先例

### 7.4 app 版(layui, 与老版同接口)

- 规则页: `app/views/data/materialplannode.html` + `app/js/data/materialplannode.js`
- 订单页: `app/views/construction/materialPlan.html` + `app/js/construction/materialPlan.js`(layui table/layer 版, 照 `app/js/construction/constructionPlan.js` 同构: `constructionCommon.getPageConfig('materialPlan')` 走同一套 constructionfunctionright 配置)
- api 段追加 `app/js/api/data.js` / `app/js/api/construction.js`(端点与老版一一对应)
- 菜单 URL 共用 communion.module 指向的老版路径, app 版按既有惯例并存部署

### 7.5 工程进度页(constructionSchedule)联动(2026-09-19 追加)

进度列表每行=一单一个节点, 与主材计划行的 (orderId, cnid) 键天然对齐:

- **汇总列×2**(配置驱动): `materialPlanSchedule`=完成/总数(完成口径=手工确认 status=1 或履约达档 autoStatus≥action+1)、`materialPlanOverdue`=逾期数; 后端在 `pageConstructionSchedule` 尾部调用 `materialPlanService.queryMaterialPlanByOrderIds(页内订单集)` 批量填充 VO 的 `materialPlanTotal/materialPlanConfirm/materialPlanOverdue` 派生字段(5 条 SQL 固定开销, 不随单数放大, ConstructionScheduleVO:fillMaterialPlanSummary)
- **行按钮 `matplan`**: 弹该单完整主材计划页(materialPlan.html), 上下文仅带 decoration.orderId(该页其余数据自查)
- 老版两列挂 propertyMap + `#materialPlanPopUp` 容器; app 版挂 cols + BTNS 注册表(照 additem 的 app.popup 先例)
- 🔴 依赖强化: 进度列表页(pageConstructionSchedule)自此依赖 materialPlanService ⇒ **construction 与 data 双 jar 不同批次混部会直接炸进度页**, 双 jar 同批从"建议"升级为硬约束
- 种子/授权: 22_material_plan.sql §6(constructionSchedule 页 propertyArr/pageBtn 白名单, 不插则列与按钮不显示)

### 7.3 页面配置种子(constructionfunction)

```sql
-- constructionInfo 行按钮追加(排在 resetDesign 后)
('constructionInfo','pageBtn','matplan',4,1,'主材计划',11);

-- materialPlan 页全套(编号 sort 顺延当时 MAX+1)
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`) VALUES
('materialPlan','materialPlan','materialPlan',0,0,'主材计划',<MAX+1>),
('materialPlan','apiPage','api.construction.queryMaterialPlanByOrderId',1,0,'主材计划查询接口',1),
('materialPlan','propertyArr','nodeName',3,1,'施工节点',1),
('materialPlan','propertyArr','type',3,1,'维度',2),
('materialPlan','propertyArr','categoryName',3,1,'品类',3),
('materialPlan','propertyArr','brandName',3,1,'品牌',4),
('materialPlan','propertyArr','action',3,1,'动作',5),
('materialPlan','propertyArr','anchor',3,1,'锚点',6),
('materialPlan','propertyArr','offsetDay',3,1,'偏移天数',7),
('materialPlan','propertyArr','planTime',3,1,'计划时点',8),
('materialPlan','propertyArr','manualTime',3,1,'指定时点',9),
('materialPlan','propertyArr','autoStatus',3,1,'系统履约',10),
('materialPlan','propertyArr','autoTime',3,1,'履约时间',11),
('materialPlan','propertyArr','status',3,1,'状态',12),
('materialPlan','propertyArr','actualTime',3,1,'完成时间',13),
('materialPlan','propertyArr','comment',3,1,'说明',14),
('materialPlan','pageBtn','edit',4,1,'编辑',1),
('materialPlan','pageBtn','confirm',4,1,'完成',2),
('materialPlan','pageBtn','cancel',4,1,'取消',3),
('materialPlan','pageBtn','del',4,1,'删除',4);

-- 默认授权(company=0, 照 constructionfunction.sql:525 先例)
INSERT INTO `platform`.`constructionfunctionright` (`name`,`cfid`,`company`)
SELECT f.name, f.cfid, 0 FROM `construction`.`constructionfunction` f
WHERE f.name IN ('materialPlan') AND f.`type` != 0;
```

(注: 🔴 constructionfunctionright **无 company=0 回退**(ConstructionFunctionRightDaoImpl.queryConstructionFunctionRightByName 严格 eq company), 授权必须按公司逐家插右行——22_material_plan.sql §4 已按"复制 constructionInfo 既有公司集(含 company=0)"处理, 含 constructionInfo 新增 matplan 按钮的右行补插。)

---

## 8. SQL 发版包(单文件 `sqls/construction/22_material_plan.sql`)

| # | 内容 | 幂等性 |
|---|---|---|
| 1 | §4.1 两表 DDL(`CREATE TABLE IF NOT EXISTS`) | 幂等 |
| 2 | §8.2 constant 枚举 | 幂等(INSERT 前按 field+key 反查排除) |
| 3 | §7.3 constructionfunction 种子 + right 默认授权 | 种子按 name 反查排除; **sort/页组编号执行前核对该组 MAX** |
| 4 | §8.3 菜单(规则维护页) | **非幂等**(照 21_menu_drawline.sql 带执行前后核验) |

### 8.2 constant 枚举(已于生产库核实列结构: name/module/clazz/type/field/key/value/status)

行格式: `module='construction', clazz='materialPlan', type∈{type,action,anchor,status,autoStatus}, field=MaterialPlanPO 常量名`。
前端经 `constant.construction().materialPlan.<type>.keys` 自动生效(js/com/constant.js 按 module/clazz/type 组装, 插库零 JS 改动)。
共 16 行(type2/action3/anchor4/status3/autoStatus4), 见 22_material_plan.sql §2(NOT EXISTS 幂等)。

### 8.3 菜单(规则维护页, 已按生产库核实定值)

- `mid=930`(生产 MAX(mid)=929, 2026-09-19 核实), `fatherModuleId=443`(数据字典目录, 工程节点 mid=189/工程计划 mid=791 所在), `order=6`(目录内已用 1~5), url=`/views/data/materialplannode.html`, level=3
- 授权: 复制 mid=189(工程节点)全部 rolemodule 行
- 🔴 非幂等, 执行前后核验语句见 22_material_plan.sql §5

---

## 9. 兼容性与上线顺序

- **零存量风险**: 全部为新增表/新增类/新增页面; 不改任何既有表结构、不写任何既有业务表、不加任何既有接口校验 —— 无兼容矩阵需求(区别于 ruotation/增减单等改造型功能)。
- 唯一交叉点是**读** schedule/sales/selectionitem/goods/brand 五域, 只读不改。

上线顺序(照 RUOTATION 先例的顺序纪律):

```
① error.md 登记 120047-120052(代码库文档, 随提交)
② 生产执行 22_material_plan.sql  —— 🔴 SQL 必须先于 jar
③ 双 jar 同批发版: **fanglin-data-8.3.029 + fanglin-construction-8.3.029**(construction 依赖 data 新类,
   缺 data jar 则 construction 启动 ClassNotFound)—— data 为 8.3.029 重打累积, construction 新打替换既有 8.3.028
④ WebContent 前端文件随 jar 同批发版(materialplannode 页/materialPlan 页/
   constructionInfo.js 行按钮/api 两段)
⑤ 各公司按需在规则页维护规则(无规则则订单页"生成"产出 0 行, 功能空转无害)
```

---

## 10. 测试矩阵(联调清单)

| # | 场景 | 预期 |
|---|---|---|
| 1 | 未放线订单点"生成" | 抛 120049 |
| 2 | 已生成订单再点"生成" | 幂等返回, 行数不变 |
| 3 | 公司无规则点"生成" | 生成 0 行, 页面空列表+提示 |
| 4 | 规则查重: 同公司+品类+节点+动作重复添加 | 抛 120048 |
| 5 | 计划锚点: anchor=0, schedule.preStartTime=09-01, offsetDay=-3 | planTime=08-29 |
| 6 | 实际锚点回退: anchor=2 节点未开工 | 回退 preStartTime 推算 |
| 7 | 实际锚点不回退: anchor=2 节点已开工(startTime 有值) | 用 startTime 推算 |
| 8 | 手工覆盖: manualTime 指定 | planTime=manualTime, 改 schedule 不影响该行 |
| 9 | 履约回填-下单: 该单有 bid 匹配的有效销售单 | autoStatus>=1, autoTime=createTime |
| 10 | 履约回填-到货: 匹配的 salesdeliveryitem status=3 | autoStatus=3, autoTime=confirmTime |
| 11 | 履约回填-选材链: 无销售单但 selectionitem status=3 | autoStatus=3(平行链生效) |
| 12 | 品类名匹配: sales.category 与规则品类名一致/不一致 | 严格相等才命中; 不一致显示未履约 |
| 13 | 逾期判定: planTime 昨天, status=0, 动作=到货 autoStatus=2 | 逾期标红 |
| 14 | schedule 重排(reset 后 pre* 变化) | 非手工行 planTime 自动跟随, 无需重生成 |
| 15 | 手工完成/取消/恢复/删除流转 | 120051 拦截重复确认; 取消可恢复; 删除即消失 |
| 16 | N+1 断言: 打开一个订单主材计划页 | 后端总 SQL≤6 条(实例+schedule+回填3+可能的规则0) |
| 17 | 跨公司隔离: A 公司规则不生成到 B 公司订单 | 生成取 decoration.company 过滤 |
| 18 | 节点不在该单排期(手工行选了被删节点) | 行排最后, planTime=待定 |

---

## 11. 待定夺问题(2026-09-19 已全部拍板)

| # | 问题 | 拍板结果 |
|---|---|---|
| 1 | material 模块(material.material 材料销售单, status 4=购货/到货)是否纳入第三履约源? | **不纳入**(Phase 1 仅 sales+selection 双链; 后续扩展只需回填 SQL 加一段) |
| 2 | 是否需要第 4 动作"采购"(inventory.purchase)? | **不加**, "下单"=销售单创建即涵盖 |
| 3 | 实际锚点回退计划锚点(D3)是否符合业务预期? | **回退**(实际未开工回退 preStartTime/preEndTime) |
| 4 | 发版批次 | **双 jar 版本戳 8.3.029**(fanglin-data-8.3.029 重打累积 + fanglin-construction-8.3.029 新打, 替换既有 8.3.028) |
| 5 | 规则维护菜单挂载点 | **数据字典目录**(constructionNode.html 同级) |
| 6 | app 版(layui)是否同步? | **同步**(两页 + api 段一并交付) |
| 7 | Phase 2(跨订单列表页/打印页/放线自动生成钩子/逾期推送) | **本期不做**, 后续按需立项 |

---

## 12. 工作量估算(参考)

| 项 | 内容 | 估算 |
|---|---|---|
| SQL | DDL+constant+种子+菜单, 单文件 | 0.5 人日 |
| 后端 data | 规则 PO/VO/DAO/Service/Action 5 对文件 | 1 人日 |
| 后端 construction | 实例 5 对文件 + 推算/回填装配算法 | 2 人日 |
| 前端 | 规则页 + 订单页 + 行按钮 + api 两段 | 2.5 人日 |
| 联调 | 测试矩阵 18 项(dev 库 192.168.5.21 造数: 放线单+规则+销售单/配送/选材各态) | 1.5 人日 |
| 合计 | | **约 7.5 人日** |

---

## 附: 与既有概念的关系说明(评审时易混淆点)

- **constructionplan.comnum(主材天数)/material(配套主材文本)**: 本功能是其结构化升级, 不动原表; 工程计划继续负责"工期推演", 主材计划负责"主材动作排程与履约对照"。
- **constructionnode.stacheck/fincheck(开工/完工前主材销售比例校验)**: 那是**款项比例闸门**(begin/finish 时校验 saleScale), 本功能是**物流时点计划**, 两者正交; 未来可在 beginConstructionSchedule 前置提示"该节点关联主材未到货"(Phase 3 可选, 涉及改业务模块需单独立项)。
- **选材 selectionitem 状态机(0→4)**: 只读引用其 1配送/3确认两态作为履约信号, 不反向写。
