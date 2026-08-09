# Report 模块(报表统计)现状分析与调整执行方案

> 文档版本：v1.0  
> 编写日期：2026-08-09  
> 编写人：AI Agent  
> 适用范围：`src/com/fanglin/report/` + `WebContent/views/report/` + `WebContent/js/report/` + `WebContent/js/api/report.js` + `WebContent/js/condition/report.js`

---

## 目录

1. [模块总览](#1-模块总览)
2. [现状详查](#2-现状详查)
3. [问题与风险清单](#3-问题与风险清单)
4. [可优化 / 可扩展功能分析](#4-可优化--可扩展功能分析)
5. [调整执行方案](#5-调整执行方案)
6. [实施计划与里程碑](#6-实施计划与里程碑)
7. [附录](#7-附录)

---

## 1. 模块总览

### 1.1 定位

report 模块是系统的**数据统计与报表中心**，承担"事后统计分析"职责：从 decoration（装饰）/ sales（主材）/ construction（施工）/ approval（审批）/ quotation（报价）/ payment（款项）等业务模块沉淀的原始数据中，按时间、组织、业务、指标多维度聚合，输出业绩报表、排名榜单和大屏看板。

### 1.2 规模

| 维度 | 数量 |
|------|------|
| 后端 Java 文件 | 120 个 / 约 11,188 行 |
| Action | 11 个 |
| Service（接口+实现） | 9 对 |
| DAO（接口+实现） | 19 对 |
| PO（持久化实体） | 26 个 |
| VO（视图对象） | 27 个 |
| 前端 HTML 页面 | 21 个 |
| 前端业务 JS | 21 个 / 约 4,886 行 |
| 数据库 catalog | `report`（独立 schema） |

### 1.3 功能矩阵

| 功能域 | 后端入口 | 前端页面 | 数据更新方式 |
|--------|----------|----------|------------|
| 装饰施工统计 | `DecorationReportAction` | `decoration7construction.html` | 手动按钮触发 |
| 装饰业绩统计 | `DecorationReportAction` | `decoration7achievement.html` | 手动按钮触发 |
| 装饰排名（设计/业务/主材/总业绩） | `DecorationRankAction` | `decorationRank.html` | ❌ 无触发点 |
| 主材设计师排名 | `MaterialRankAction` | `rank.html` | ❌ 无触发点 |
| 主材部/设计/商家报表 | `MaterialReportAction` | `materialDepartmentReport.html` 等 | 手动更新 count 表 |
| 销售业绩 | `SalesReportAction` | `sales7Achievement.html` | 手动 |
| 施工业绩 | `ConstructionReportAction` | `construction7Achievement.html` | 手动 |
| 审批业绩 | `ApprovalReportAction` | `approval7Achievement.html` | 手动 |
| 员工业绩 | `UserReportAction` | `user7Achievement.html` | 手动 |
| 报价增减排名 | `QuotationRankAction` | `scrolling4addreduce.html` | 实时聚合查询 |
| 系统监控大屏 | （`log.*`/`user.report.*`/`system.flask_monitor.*`） | `largeScreen.html`/`api.html` | 直连 ES 实时 |
| 装修业务大屏 | （ES 直连） | `decorationLargeScreen.html` | 直连 ES 实时 |
| 订单计数 | `reportCityCount` | `orderCount.html` | 实时聚合查询 |
| 综合排名查询 | `RankAction` | — | 查询 |

---

## 2. 现状详查

### 2.1 后端分层结构

标准 SSH 五层，全注解驱动（无 XML 业务配置）：

```
src/com/fanglin/report/
├── action/      11 文件  Struts2 控制器，@ParentPackage("base") @Namespace("/")
├── service/      9 文件  业务接口
│   └── impl/     9 文件  @Service，@Transactional
├── dao/         19 文件  DAO 接口
│   └── impl/    19 文件  @Repository，Hibernate + 原生 SQL
├── po/          26 文件  @Entity，catalog = "report"
└── vo/          27 文件  前后端传输
```

**路由**：Struts2 Convention 注解扫描，所有 URL 形如 `queryDecorationRank.do`，走 `base` 包拦截器栈（AccessInterceptor + defaultStack）。

### 2.2 核心数据结构（PO）

#### 2.2.1 装饰施工报表 `DecorationReportPO`（`report.decoration4construction`）

按公司聚合的工地数量统计，字段为 `cs0 ~ cs26` 共 27 个计数槽：

| 槽位 | 含义 |
|------|------|
| cs0~cs2 | 未开工 / 已开工 / 已完工 |
| cs3~cs13 | 铲大白/放线/水暖/力工/电工/瓦工/地面找平/木工/油工/水电验收/保洁 |
| cs14~cs19 | 签单年份 2015~2020（`year - 2001` 映射） |
| cs20~cs23 | 付款比例区间（0-30%/31-64%/65-97%/98-100%） |
| cs24~cs25 | 设计状态（设计中/完成） |
| cs26 | 定金数 |

> ⚠️ **设计问题**：用"魔法数字槽位"把多种异质维度（工地阶段 / 年份 / 付款比例 / 设计状态）压进同一张表，可读性差，扩展（如新增年份、施工阶段）需改槽位映射。

#### 2.2.2 装饰业绩 `DecorationAchievementPO`（`report.decoration7achievement`）

按「部门 + 年 + 月 + 类型」聚合的月度业绩快照：

| 字段 | 含义 |
|------|------|
| cs0 / cs2 / cs3 | 签单数 / 签单额 / 净业绩 |
| cs1 / cs4 | 设计数 / 设计额 |
| cs5 | 服务费 |
| cs6 / cs7 | 未签单设计户数 / 未签单设计费 |

数据来源：4 条复杂聚合 SQL（`countDecorationForAchievement1~4`），跨 decoration / quotation / payment / communion 四个 schema 联表，涉及"分成比例 `belongds.rate/1000`""管理费分摊 `notSalesmanRate`""券优惠扣减"等业务规则。

#### 2.2.3 装饰排名 `DecorationRankPO`（`report.decorationrank`）

按「设计师 + 月份」存储排名，含三套业绩字段：

| 字段组 | 含义 | 说明 |
|--------|------|------|
| rank / rank1 / rank2 / rank3 | 设计(或业务)业绩 + 全员/部门/分区排名 | type 区分设计(0)/业务(1) |
| sachi / sranku/d/r | 主材业绩 + 三级排名 | |
| tachi / tranku/d/r | 总业绩 + 三级排名 | |

#### 2.2.4 主材设计师排名 `MaterialDesignerRankPO`（`report.materialdesignerrank`）

存 `designerId / designerName / rank / createTime / endTime / status`。注意用 `String designerId` 而非 UserPO 关联（与 DecorationRankPO 用 `UserPO designer` 不一致）。

#### 2.2.5 「Zaterial 正林」系列

`ZaterialDesignerRankPO` / `ZaterialDesignerDepartmentRankPO` / `ZaterialDesignerRegionRankPO` —— "正林"（某子品牌/子公司）的主材业绩排名，结构与 Material 系列完全平行复制。

> ⚠️ **命名问题**：`Zaterial` 疑为 `Material` 的拼写残留或刻意缩写，与正常 `Material*` 并存造成混淆。

#### 2.2.6 其他

- `ConstructionReportPO` / `SalesAchievementsPO` / `UserAchievementPO` / `ApprovalAchievementPO`：各业务线月度业绩快照
- `PutlinePO`：放线施工进度（`report.putlineconstructionschedule`）
- `MaterialDesignerCountPO` 系列：主材设计师/部门/分区按日的 count 快照表

### 2.3 业务逻辑要点

#### 2.3.1 业绩统计（`DecorationReportServiceImpl.updateDecoration7Achievement`）

**手动触发**，流程：
1. 前端 `decoration7achievement.html` 弹窗选「年+月」→ 点击"更新业绩"按钮
2. 后端按该月首尾时间构造 `startTime / endTime`
3. 跑 4 条聚合 SQL（签单/设计/服务费/未签单）分别取数
4. 按 `did + typeness` 为 key 合并到 Map
5. `REPLACE INTO report.decoration7achievement` 逐条写入

**问题**：
- 全表 `TRUNCATE` + 重建（施工统计）或 `REPLACE`（业绩），无增量更新
- 年份硬编码 `Arrays.asList(2015..2020)`，**已过期 6 年未更新**
- 无并发控制，多人同时点"更新"会重复跑聚合
- 大事务包住多次 SQL + 多次 saveOrUpdate，性能差

#### 2.3.2 排名写入（`DecorationRankServiceImpl.updateDecorationRank` 等）

接口定义了 `updateDecorationRank / updateDecorationDepartmentRank / updateDecorationRegionRank`，逻辑是"查已有 → Arith.add 累加 → saveOrUpdate"。

> 🔴 **致命问题**：经全量 grep，**这些 update 方法在整个项目中没有任何调用方**。排名表数据只能靠外部脚本/手工 SQL 维护，业务事件（签单、收款、主材结算）发生时**不会**自动刷新排名。

#### 2.3.3 主材排名（`MaterialRankServiceImpl`）

- 查询方法 `queryMaterialDesignerRankForTop` 调 DAO 取 TOP N
- `queryMaterialDesignerRank` 返回 `List<TopVO>` 供大屏/榜单展示
- `updateMaterialDesignerRank` 等写入方法**同样无调用方**
- `Zaterial` 系列查询方法（`queryZaterialDesignerRank` 等）**没有对应的 Action 路由**，前端也无引用 —— 半成品死代码

#### 2.3.4 报价增减排名（`QuotationRankServiceImpl.rankAddReduce`）

实时聚合查询（非快照表），从 quotation 库直接 `GROUP BY` 统计增减项，是模块内少数"实时准确"的报表。

#### 2.3.5 订单计数（`orderCount.js` + `reportCityCount.do`）

按城市、状态（量尺/咨询/报价/定金/签约/重签/废单/完工/终止）实时聚合近 20 天数据，饼图+折线展示。

### 2.4 前端实现要点

#### 2.4.1 技术栈

- **UI 框架**：Ace（基于 Bootstrap + jQuery + jqGrid），非 LayUI
- **图表库**：**混用** —— `highcharts`（materialDesignReport）、`echarts`（largeScreen/monitor/chart）、`flot`/`jquery.sparkline`（部分）
- **数据表格**：`Searcher` 组件（封装 jqGrid）+ 手动 `$("<table>")` 拼接

#### 2.4.2 大屏直连 Elasticsearch（🔴 高危）

`largeScreen.js` 与 `decorationLargeScreen.js` **前端直接对内网 ES 发 `_search` 请求**：
- `largeScreen.js` → `http://192.168.5.21:9200/logstash-*/_search`、`monitor-*`
- `decorationLargeScreen.js` → `http://192.168.5.22:9200/decoration-create-*`、`decoration-contract-*`

问题：① 内网 IP 硬编码，环境迁移即失效；② ES 暴露在浏览器可达范围，安全隐患；③ 绕过后端鉴权与业务逻辑。

#### 2.4.3 API 定义缺失页面

`js/api/report.js` 注册了 4 个视图入口 URL（`reportBizDept.html` / `reportDesignDept.html` / `reportBizRegion.html` / `reportDesignRegion.html`），但 `views/report/` 下**这些 HTML 不存在** —— 菜单点击会 404。

#### 2.4.4 图表交互（下钻）

`materialDesignReport.js` 实现了"分区 → 部门 → 设计师"三级下钻柱状图（点击柱子触发下一级），是较完整的交互范例。

---

## 3. 问题与风险清单

按严重度分级。🔴 = 高危/阻断，🟠 = 中等，🟡 = 轻微。

### 3.1 架构与正确性

| # | 级别 | 问题 | 位置 | 影响 |
|---|------|------|------|------|
| P1 | 🔴 | 排名表 update 方法无任何调用方，数据来源不明（疑似外部脚本/手工维护） | `DecorationRankServiceImpl.updateDecorationRank` 等 6 个方法 + Material 系列 6 个 + Zaterial 6 个 | 排名数据可能长期不更新，准确性无保障 |
| P2 | 🔴 | 业绩统计年份硬编码 `2015~2020`，已过期 | `DecorationReportServiceImpl:83` | 2021 年后的签单不计入施工统计 |
| P3 | 🔴 | 大屏前端直连 ES，内网 IP 硬编码 | `largeScreen.js:17`、`decorationLargeScreen.js` | 环境迁移失效、安全暴露、无鉴权 |
| P4 | 🟠 | 业绩更新用 TRUNCATE+全量重建，无增量、无并发控制 | `DecorationReportServiceImpl.updateDecoration7Construction` | 多人操作冲突、大表性能差 |
| P5 | 🟠 | Zaterial 系列 Service 无 Action、无前端引用，半成品死代码 | `MaterialRankServiceImpl.queryZaterial*` 6 方法 + 3 PO/VO/DAO | 代码膨胀、维护负担 |
| P6 | 🟠 | `MaterialDesignerRankPO` 用 String designerId，DecorationRankPO 用 UserPO，关联方式不统一 | po 层 | 排名跨表 JOIN 困难 |
| P7 | 🟡 | `cs0~cs26` 魔法槽位混装多维度，无注释维护 | `DecorationReportPO` | 可读性差、扩展易错 |

### 3.2 工程质量

| # | 级别 | 问题 | 位置 |
|---|------|------|------|
| Q1 | 🟠 | 大量 `@SuppressWarnings("unchecked")` + `Object[]` 强转，无类型安全 | DAO impl 层 |
| Q2 | 🟠 | 业绩聚合 SQL 单条 300+ 字符，多表 JOIN，无执行计划优化痕迹 | `DecorationReportDaoImpl.countDecorationForAchievement1~4` |
| Q3 | 🟠 | Service 方法循环内逐条 `saveOrUpdate`（N+1 写入） | `updateDecoration7Construction` |
| Q4 | 🟡 | Bean 名不一致：`@Service("ApprovalReportService")` 大写开头 vs `@Service("decorationRankService")` 驼峰 | service impl |
| Q5 | 🟡 | 拼写错误：路由 `designerDeportmentReport`（应为 Department） | `MaterialReportAction` + `api/report.js` |
| Q6 | 🟡 | 图表库混用（highcharts + echarts + flot），无统一封装 | 前端 |
| Q7 | 🟡 | 4 个 api.index 视图 URL 对应 HTML 不存在，菜单 404 | `api/report.js:1-26` |
| Q8 | 🟡 | 大屏 JS 单文件 1445 行（largeScreen）/ 911 行（decorationLargeScreen），无模块化 | 前端 |

### 3.3 用户体验

| # | 级别 | 问题 |
|---|------|------|
| U1 | 🟠 | 报表更新全靠用户手动点按钮，易遗漏，数据滞后 |
| U2 | 🟠 | 无导出功能（业绩/排名报表无法导 Excel） |
| U3 | 🟡 | 排名无"数据更新时间"展示，用户不知数据新鲜度 |
| U4 | 🟡 | 大屏无自适应（固定 1920 尺寸） |

---

## 4. 可优化 / 可扩展功能分析

### 4.1 数据更新机制重构（最高优先级）

**现状**：手动触发 + 死代码写入方法。  
**目标**：事件驱动 + 定时兜底。

#### 方案：事件总线 + 定时任务双轨

项目已有 `messagequeuing`（消息队列，见 `MESSAGE_QUEUING_GUIDE.md`）基础设施。建议：

1. **实时增量**：在关键业务节点（签单 `makeDecorationContract`、收款 `makeDecorationPayment`、主材结算）投递统计事件，report 模块消费并增量更新排名/业绩快照。
2. **定时全量兜底**：新增定时任务（Quartz 或 Spring `@Scheduled`），每日凌晨重算昨日业绩快照，修正增量误差。
3. **复用已有 update 方法**：当前那些"无调用方"的 `updateXxxRank` 方法正好可作为事件消费者入口，补齐调用链。

```
业务Action → 投递事件到 messagequeuing
                    ↓
        ReportEventListener 消费
                    ↓
    updateDecorationRank / updateMaterialDesignerRank (复用现有方法)
                    ↓
            写入 report.* 排名表

定时任务(每日02:00) → 重算昨日快照兜底
```

### 4.2 业绩统计现代化

**现状**：手动点按钮 + 年份硬编码 + 全量重建。  
**目标**：实时聚合查询（像报价增减排名那样）+ 物化快照缓存。

- 短期：修复年份硬编码（改为动态 `当前年份-10 ~ 当前年份`）。
- 中期：把"手动更新快照"改为"查询时实时聚合 + Redis/DB 缓存（TTL 1 小时）"，消除数据滞后。
- 长期：聚合 SQL 下沉为 DB 视图或存储过程，DAO 只做简单查询。

### 4.3 排名体系丰富

当前排名仅按"业绩金额"单一指标。可扩展：

| 维度 | 可新增指标 |
|------|-----------|
| 装饰 | 签单转化率（量尺→签单）、回款率、工期达成率、客单价 |
| 主材 | 客单价、复购率、品类结构（主材占比） |
| 综合 | 同比/环比增长率、目标完成率（需引入目标管理） |

### 4.4 报表导出

当前 report 模块**完全没有导出功能**，与"报表"定位严重不符。项目已有 `PoiExcelUtil`、`com.exporter` 工具，可直接复用。建议：
- 业绩报表、排名榜单增加"导出 Excel"按钮
- 大屏增加"截图导出"（前端 canvas → 图片）

### 4.5 大屏后端代理化

把前端直连 ES 改为后端代理：
- 新增 `ReportScreenAction`，后端调 ES（或改为查 MySQL 聚合表），返回 JSON
- 前端只调 `.do` 接口，内网 IP/索引名配置化（`conf/sysconfig.properties`）
- 消除安全隐患与环境耦合

### 4.6 多维度分析增强

- **同比环比**：业绩报表增加"去年同期""上月"对比列
- **趋势分析**：排名榜单增加"排名变化趋势"（已有 rank1/2/3 字段但前端未充分展示升降）
- **漏斗分析**：量尺→报价→定金→签约→完工的转化漏斗

### 4.7 死代码清理

- 删除 Zaterial 系列无引用的 Service 方法 / PO / VO / DAO（若"正林"业务确认不再用），或补齐 Action + 前端（若仍需要）
- 删除 4 个不存在的 api.index 视图 URL 注册

### 4.8 数据一致性保障

- 排名/业绩表增加 `updateTime` 字段，前端展示"数据更新时间"
- 增加数据校验任务：对比快照表与实时聚合结果，差异超阈值告警

---

## 5. 调整执行方案

按"先治标止血 → 再治本重构 → 最后丰富功能"三阶段推进。每项标注：**改动文件 / 工作量(人天) / 优先级 / 风险**。

### 阶段一：治标止血（修复阻断性与高危问题）

#### 任务 1.1：修复年份硬编码（P2）

**文件**：`src/com/fanglin/report/service/impl/DecorationReportServiceImpl.java`

```java
// 改前（第83行）
List<Integer> year = Arrays.asList(new Integer[] { 2015, 2016, 2017, 2018, 2019, 2020 });

// 改后：动态生成近10年
int currentYear = Calendar.getInstance().get(Calendar.YEAR);
List<Integer> year = new ArrayList<>();
for (int y = 2015; y <= currentYear; y++) {
    year.add(y);
}
```

> 注意 DAO `countDecorationForContract` 用 `year - 2001` 映射到 cs14~cs19 槽位，仅支持 6 个年份。若超出需扩槽位或重构映射，见任务 2.2。  
> **工作量**：0.5 天 | **风险**：低（需确认槽位映射上限）

#### 任务 1.2：大屏 ES 配置外置（P3 止血）

**文件**：`WebContent/js/report/largeScreen.js`、`decorationLargeScreen.js`、新增后端配置

把硬编码 IP 改为从后端配置接口获取：

```javascript
// 改前
elasticUrl: { logstash: 'http://192.168.5.21:9200/logstash-*/_search' }

// 改后：从页面全局变量或配置接口取
elasticUrl: window.__REPORT_ES__ || { logstash: '/reportScreen_proxy/logstash' }
```

> 完整的"后端代理化"放阶段二。本任务先做配置外置止血。  
> **工作量**：1 天 | **风险**：中（需协调运维确认 ES 访问方式）

#### 任务 1.3：补齐缺失页面或移除死链接（Q7）

**文件**：`WebContent/js/api/report.js:1-26`、`WebContent/views/report/`

确认 `reportBizDept` / `reportDesignDept` / `reportBizRegion` / `reportDesignRegion` 这 4 个入口的业务需求：
- 若仍需要：补建 HTML + JS（参考 `decorationRank.js` 的排名页模板）
- 若已废弃：从 `api/report.js` 删除这 4 个 index 注册

> **工作量**：2 天（补建）或 0.5 天（删除） | **风险**：低

#### 任务 1.4：拼写错误修正（Q5）

**文件**：`MaterialReportAction.java`、`js/api/report.js:130`、前端引用处

`designerDeportmentReport` → `designerDepartmentReport`。  
> ⚠️ 路由名变更需前后端同步，且旧 URL 可能有外部书签。建议保留旧路由做兼容转发一段时间。  
> **工作量**：0.5 天 | **风险**：低

### 阶段二：治本重构（核心机制改造）

#### 任务 2.1：排名数据更新机制 —— 接入事件总线（P1）

这是本模块**最重要的改造**。

**改动范围**：
- 新增：`ReportEventListener`（消费统计事件）
- 修改：业务模块签单/收款/结算 Action（投递事件）
- 复用：现有 `updateDecorationRank` / `updateMaterialDesignerRank` 等

**步骤**：

1. **定义统计事件**（参考 `MESSAGE_QUEUING_GUIDE.md`）：
   ```
   事件类型: report.decorationRank.update
   载荷: { designerId, designerName, company, count, currentTime }
   投递点: DecorationServiceImpl.makeContract（签单时）
   ```

2. **新增 ReportEventListener 消费事件**，调用现有 update 方法：
   ```java
   @Component
   public class ReportEventListener {
       @Autowired private DecorationRankService decorationRankService;
       @Autowired private MaterialRankService materialRankService;
       
       @HandleQueue("report.decorationRank.update")
       @Transactional(rollbackFor = Exception.class)
       public void handleDecorationRank(ReportRankEvent event) {
           decorationRankService.updateDecorationRank(
               event.getDesignerId(), event.getDesignerName(),
               event.getCount(), event.getCurrentTime(), event.getCompany());
       }
       // ... material / department / region
   }
   ```

3. **业务模块投递事件**：在 `makeDecorationContract`、`makeDecorationPayment`、`makeMaterialPayment` 等关键方法尾部 `messageQueuing.send(event)`。

> **工作量**：5 天（事件定义 1 + 业务投递点改造 2 + 监听消费 1 + 联调 1）  
> **风险**：高（涉及多模块、事务一致性、消息幂等）  
> **前置**：需确认 messagequeuing 的事件处理机制与幂等策略

#### 任务 2.2：业绩统计槽位重构（P7 + 任务1.1 的根治）

**问题**：`cs0~cs26` 把"工地阶段/年份/付款比例/设计状态"混装，年份仅 6 槽。

**方案**：拆分为多张主题表，或改为"维度+度量"长表设计：

```sql
-- 方案A：拆主题表（推荐，改动可控）
report.decoration_construction_stage  -- 工地阶段统计
report.decoration_contract_year       -- 签单年份统计  
report.decoration_pay_scale           -- 付款比例统计
report.decoration_design_status       -- 设计状态统计

-- 方案B：长表（通用但需改查询逻辑）
report.decoration_metric(company, metric_type, metric_key, value, stat_date)
```

> **工作量**：8 天（设计 2 + PO/DAO/Service 重构 3 + 前端适配 2 + 测试 1）  
> **风险**：高（数据迁移、历史报表兼容）  
> **建议**：新表与旧表并行运行一个周期，验证一致后切换

#### 任务 2.3：业绩更新去手动化（U1 + P4）

**方案**：
- 增量：签单/收款事件触发（复用任务 2.1 的事件总线）
- 兜底：定时任务每日重算（修正增量误差）

新增 `ReportScheduleService`：
```java
@Scheduled(cron = "0 0 2 * * ?") // 每日02:00
public void rebuildYesterdayAchievement() {
    // 重算昨日 decoration7achievement
}
```

> **工作量**：3 天 | **风险**：中 | **依赖**：任务 2.1

#### 任务 2.4：大屏后端代理化（P3 根治）

**新增**：`ReportScreenAction` + `ReportScreenService`

```java
@Action(value = "queryScreenDecorationTrend", results = {@Result(...)})
public String queryScreenDecorationTrend() throws FLException {
    // 后端调 ES 或查 MySQL 聚合表
    // ES 地址从 sysconfig.properties 读取
}
```

前端 `largeScreen.js` / `decorationLargeScreen.js` 改为调 `.do` 接口。

> **工作量**：6 天（后端代理 3 + ES 查询封装 1 + 前端改造 2）  
> **风险**：中

#### 任务 2.5：Zaterial 死代码处理（P5）

**决策点**：确认"正林"业务是否还需要。
- 若废弃：删除 `Zaterial*` 的 3 个 PO / 3 个 VO / 3 个 DAO(+impl) / MaterialRankServiceImpl 中 6 个方法
- 若保留：补齐 `ZaterialRankAction` + 前端页面

> **工作量**：1 天（删除）或 5 天（补全） | **风险**：低

### 阶段三：功能丰富（提升报表价值）

#### 任务 3.1：报表导出功能（U2）

为业绩报表、排名榜单增加 Excel 导出：
- 后端：复用 `PoiExcelUtil`，新增 `exportDecoration7Achievement` 等 Action
- 前端：Searcher 增加"导出"按钮

> **工作量**：4 天 | **风险**：低

#### 任务 3.2：同比环比与趋势增强（4.3、4.6）

- 业绩报表 SQL 增加"去年同期""上月"列
- 排名前端展示升降箭头（利用已有 rank1/2/3 字段）
- 新增转化漏斗报表页

> **工作量**：6 天 | **风险**：低

#### 任务 3.3：数据新鲜度展示（U3）

排名/业绩表增加 `updateTime`，前端展示"数据更新于 xxx"。  
> **工作量**：2 天 | **风险**：低

#### 任务 3.4：图表库统一（Q6）

将 highcharts 用法统一迁移到 echarts（项目大屏已用 echarts），或反之。减少维护成本。  
> **工作量**：5 天 | **风险**：中（视觉回归）

---

## 6. 实施计划与里程碑

### 6.1 排期建议

| 阶段 | 任务 | 工作量 | 建议周期 | 前置依赖 |
|------|------|--------|----------|----------|
| **一·治标** | 1.1 年份硬编码 | 0.5d | 第1周 | — |
| | 1.2 ES配置外置 | 1d | 第1周 | 运维确认 |
| | 1.3 缺失页面/死链 | 0.5~2d | 第1周 | 业务确认 |
| | 1.4 拼写修正 | 0.5d | 第1周 | — |
| **二·治本** | 2.1 事件总线接入排名 | 5d | 第2-3周 | messagequeuing |
| | 2.2 槽位重构 | 8d | 第3-5周 | 数据迁移方案 |
| | 2.3 去手动化+定时 | 3d | 第3周 | 2.1 |
| | 2.4 大屏后端代理 | 6d | 第4-5周 | — |
| | 2.5 Zaterial清理 | 1~5d | 第5周 | 业务确认 |
| **三·丰富** | 3.1 导出 | 4d | 第6周 | — |
| | 3.2 同比环比/趋势 | 6d | 第6-7周 | 2.2 |
| | 3.3 新鲜度展示 | 2d | 第6周 | — |
| | 3.4 图表库统一 | 5d | 第7-8周 | — |

**总工作量**：约 45~53 人天（含分支缓冲，实际排期建议 8-10 周）。

### 6.2 里程碑

- **M1（第1周末）**：治标完成，阻断性问题消除，系统恢复到"可用且不退化"状态。
- **M2（第3周末）**：排名事件驱动上线，数据不再靠手动维护。
- **M3（第5周末）**：业绩重构 + 大屏代理完成，核心机制全部治本。
- **M4（第8周末）**：导出/趋势/新鲜度等功能丰富完成，模块达到"好用的报表中心"。

### 6.3 验收标准

1. 排名数据在签单/收款后 **自动** 更新，无需手动触发
2. 业绩报表数据与实时聚合结果误差 < 0.1%
3. 大屏不再直连 ES，IP 可配置，无硬编码
4. 年份统计覆盖当前年份
5. 所有报表支持 Excel 导出
6. 无死代码（Zaterial 系列已处理）
7. 前端图表库统一为单一技术栈

---

## 7. 附录

### 7.1 关键文件索引

| 关注点 | 路径 |
|--------|------|
| 业绩统计核心 | `src/com/fanglin/report/service/impl/DecorationReportServiceImpl.java` |
| 业绩聚合SQL | `src/com/fanglin/report/dao/impl/DecorationReportDaoImpl.java` |
| 装饰排名 | `src/com/fanglin/report/service/impl/DecorationRankServiceImpl.java` |
| 主材排名(含Zaterial) | `src/com/fanglin/report/service/impl/MaterialRankServiceImpl.java` |
| 主材报表 | `src/com/fanglin/report/service/impl/MaterialReportServiceImpl.java` |
| 报价增减排名 | `src/com/fanglin/report/service/impl/QuotationRankServiceImpl.java` |
| 模块文档 | `src/com/fanglin/report/CLAUDE.md` |
| 前端API | `WebContent/js/api/report.js` |
| 前端条件 | `WebContent/js/condition/report.js` |
| 大屏JS | `WebContent/js/report/largeScreen.js`、`decorationLargeScreen.js` |

### 7.2 报价体系关联说明

> 用户需求中提到"丰富现有系统的报价体系"。经查，report 模块内与"报价"直接相关的仅有 `QuotationRankAction` / `QuotationRankServiceImpl`（报价增减项排名，实时聚合，运行良好）。

report 模块对报价体系的支撑当前**较薄弱**，建议在阶段三补充：

1. **报价转化漏斗报表**：量尺 → 出报价 → 改报价 → 签单 的转化率统计（当前无）
2. **报价金额分布报表**：按报价区间（如 5万以下/5-10万/10-20万/20万+）统计签单分布（当前无）
3. **报价员业绩报表**：按报价编制人统计报价数量、签单转化、平均客单价（当前无，`UserAchievementPO` 未细分报价维度）
4. **报价变更分析**：增减项频次、增减金额 TOP（当前 `rankAddReduce` 仅有简单排名）

这些可作为任务 3.2 的子项，在槽位重构（2.2）完成后推进，新增对应的 PO/VO/DAO/Service/Action/页面。这些报表能直接丰富报价体系的数据洞察层。

### 7.3 风险提示

- **事件总线改造（2.1）**涉及多模块事务，需重点测试消息幂等与最终一致性
- **槽位重构（2.2）**需数据迁移，务必保留旧表并行运行一个对账周期
- **大屏代理（2.4）**需与运维协调 ES 权限与网络策略
- 所有改动遵循项目规范：`AGENTS.md`（方法命名、FLException 错误码、Action 异常上抛、@Transactional 等）

---

> 本文档为分析与执行规划，具体实施时每个任务建议单独建分支并补充详细设计。阶段二各项涉及核心机制，建议在 Code Review 通过后再合入 master。
