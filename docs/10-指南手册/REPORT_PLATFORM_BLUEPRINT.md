# 全局报表与数据分析体系蓝图

> 文档版本：v1.1（v1.1 根据约束固化执行策略）  
> 编写日期：2026-08-09  
> 编写人：AI Agent  
> 定位：跳出"修补现有 report 模块"，从全域 16+ 业务模块出发，设计一套覆盖全系统的报表与数据分析体系  
> 关联文档：`REPORT_MODULE_ANALYSIS_AND_PLAN.md`（现有 report 模块的现状分析与修补方案）

---

## ⛔ 执行铁律（最高优先级约束）

本蓝图落地必须遵守以下铁律，任何阶段、任何任务均不得违反：

### 铁律 1：不修改任何其他业务模块的代码与逻辑

- **绝对禁止**改动 decoration / customer / quotation / payment / sales / material / construction / production / inventory / balance / salary / approval / market 等业务模块的**任何一个文件**（含 Action / Service / DAO / PO）。
- report 模块对所有业务数据是**只读消费者**：只通过跨库 SELECT 读取，绝不向业务表写回，也不要求业务模块"投递事件"。
- 因此，**v1.0 蓝图设计的"事件总线（L1 采集层）"方案废弃**。原因：事件驱动要求在业务 Action 里埋点投递，违反本铁律。

### 铁律 2：旧的 report 代码与表，碰都不碰

- report 包内现有的 `DecorationReport*` / `DecorationRank*` / `MaterialRank*` / `Zaterial*` / `cs0~cs26` 槽位机制 / `updateXxxRank` 方法，**一律保留原样**。
- 原因：① 它们可能被外部脚本/定时任务依赖；② 改动有破坏现有排名/业绩数据的风险；③ 符合"另起炉灶"策略。
- **后果**：report 包内将出现"新旧并存"。这是有意为之，不是技术债。旧的留着，新的另建。

### 铁律 3：数据采集改为「定时全量重算」

- 数据时效：**每日凌晨全量重算**，数据滞后 ≤ 24h（对经营报表完全够用）。
- 机制：report 模块新增 `@Scheduled` 定时任务 → 跑跨库聚合 SQL → `REPLACE INTO report.metric_*` 自有汇总表。
- 优点：**全量重算天然幂等**（不丢数据、不重复累加）、零侵入业务、与现有 `updateDecoration7Construction` 模式一脉相承。
- 辅助：保留"手动触发刷新"能力（前端按钮），用于需要即时数据的场景。

### 落地形态总结

```
新增（report 包内全新子域）          保留原样（碰都不碰）
─────────────────────────          ─────────────────────────
report/analytics/  ← 全新分析子域    report/po/DecorationReportPO
report/job/        ← 定时任务        report/po/DecorationRankPO
report/po/metric/  ← 新汇总表PO      report/service/...Rank*Service
report/dao/metric/ ← 新汇总表DAO     report/po/Zaterial*（死代码也留）
report/vo/analytics/                 report/service/impl/*（含死方法）
                                     report/decoration4construction 表
report/metric_* 表 ← 新汇总表        report/decorationrank 表 等
```

> 后续所有章节中，凡涉及"事件投递 / 修改业务模块"的描述，均以本铁律为准——统一替换为"定时全量重算 + 跨库只读 SELECT"。

---

## 〇、核心理念

### 现状的根本问题

当前系统的报表能力是**孤岛式、滞后式、补丁式**的：

- **孤岛**：报表只盯着 decoration/construction/sales 三个老业务，customer/quotation/payment/production/inventory/market 等十余个模块的丰富数据**完全没进报表**。
- **滞后**：业绩/排名靠手动点按钮，排名表 update 方法**无调用方**，数据新鲜度无保障（详见《现状分析》P1）。
- **补丁**：cs0~cs26 魔法槽位、Zaterial 死代码、大屏直连 ES、年份硬编码——一直在打补丁，没有体系。

### 目标

把报表模块从"事后凑数的统计工具"，升级为**全域数据驱动的经营分析平台**：

> **让系统的每一笔业务、每一个状态流转、每一分钱流动，都能从多个角度被量化、被对比、被洞察。**

三个关键词：
- **全域**：不限于装修三条线，16 个业务模块全部参与，每个模块贡献自己的指标。
- **多角度**：每个模块都从"总量/结构/转化/效率/质量/人效/趋势/对标/风险"九个角度产生指标。
- **联动**：跨模块打通，形成"获客→转化→履约→交付→回款→售后"全生命周期分析。

---

## 目录

1. [体系架构（四层）](#1-体系架构四层)
2. [九大分析主题域](#2-九大分析主题域)
3. [通用分析角度框架](#3-通用分析角度框架)
4. [各业务模块报表指标矩阵](#4-各业务模块报表指标矩阵)
5. [跨模块联动分析主题](#5-跨模块联动分析主题)
6. [技术实现方案](#6-技术实现方案)
7. [实施路线图](#7-实施路线图)
8. [附录](#8-附录)

---

## 1. 体系架构（四层）

```
┌─────────────────────────────────────────────────────────────────┐
│  L4 展现层  报表中心门户 │ 经营大屏 │ 移动端 │ 导出中心          │
├─────────────────────────────────────────────────────────────────┤
│  L3 服务层  统一查询服务 │ 维度×指标组合 │ 权限 │ 缓存 │ 调度     │
├─────────────────────────────────────────────────────────────────┤
│  L2 计算层  主题域模型 │ 指标库(规范化定义) │ 预聚合汇总表        │
├─────────────────────────────────────────────────────────────────┤
│  L1 采集层  定时全量重算(@Scheduled) │ 跨库只读SELECT │ 手动触发│
└─────────────────────────────────────────────────────────────────┘
                          │ 只读，绝不写回
        ┌─────────────────┼──────────────────────┐
        ▼                 ▼                      ▼
   16个业务模块       report.metric_*          ES / Redis 缓存
  (decoration/       汇总表(主题域物化)       (大屏/实时)
   customer/...)     ← REPLACE INTO
```

> ⚠️ 与 v1.0 的差异：L1 由"事件总线"改为"定时全量重算"。report 对业务库只读，符合铁律 1/3。

### 1.1 L1 数据采集层（解决"数据从哪来"）

这是当前系统最大的缺口——**报表数据没有自动化的采集通道**。

| 采集方式 | 机制 | 适用场景 | 时效 |
|---------|------|---------|------|
| ~~事件总线~~ | ~~业务 Action 投递事件~~ | ~~已废弃~~：违反铁律 1（不改业务模块） | ~~秒级~~ |
| **定时全量重算**（唯一主力） | `@Scheduled` 定时任务 → 跨库聚合 SQL → `REPLACE INTO report.metric_*` | 日报表、月报、排名、业绩快照 | 天级（≤24h） |
| 手动触发刷新 | 前端按钮调 Action → 跑同一套聚合 | 需要即时数据时人工触发 | 即时 |
| ETL 回填 | 一次性脚本 | 新报表上线初始化历史数据 | 一次性 |

> **定时全量重算是唯一主力**。每个主题域一个 `@Scheduled` Job（参考 `log.job.ActionLogArchiveJob` 写法），跑跨库只读聚合 SQL，`REPLACE INTO` 自己的 `metric_*` 表。Job 不抛异常（内部 try-catch），失败仅记日志次日重试。

### 1.2 L2 计算层（解决"指标怎么算、存在哪"）

#### 指标库（Metric Registry）

把散落在各处的统计逻辑**规范化定义**，每个指标有唯一编码、口径、计算公式、数据源：

```
指标编码: DEC.SIGN.COUNT         装修签单量
口径:     decoration.status >= 3 且 createTime 在统计期内
公式:     COUNT(*) GROUP BY company, month
数据源:   decoration.decoration
负责人:   装修业务线
```

这样不同报表引用同一指标时口径一致，避免"同指标不同数"。

#### 主题域汇总表（物化）

按主题域预聚合，避免每次查询跑全表 JOIN。新增 `report.metric_*` 系列表：

| 汇总表 | 粒度 | 示例指标 |
|--------|------|---------|
| `metric_decoration_daily` | 公司×日 | 签单量/签单额/量尺量/定金量 |
| `metric_payment_monthly` | 公司×部门×月 | 收款额/退款额/净收款/回款率 |
| `metric_sales_brand` | 公司×品牌×月 | 销售额/毛利/退货率 |
| `metric_construction_node` | 公司×节点×月 | 在建工地数/完工率/平均工期 |
| `metric_customer_funnel` | 公司×大区×月 | 线索/客源/机会/签约各阶段量 |

> 由 L1 的定时任务每日刷新，查询层只做轻量聚合。

### 1.3 L3 服务层（解决"怎么查"）

统一报表查询服务，支持**维度 × 指标的自由组合**：

```java
// 理想查询 API
ReportQuery query = ReportQuery.of("DEC.SIGN")
    .dimension("company", "month")      // 按公司×月分组
    .filter("region", "eq", "沈阳大区")  // 过滤
    .metric("COUNT", "AMOUNT")          // 取量+额
    .compare(Compare.LAST_MONTH)         // 环比上月
    .build();
List<ReportRow> rows = reportQueryService.query(query);
```

- **权限**：复用现有 `right` 模块，按 company/department 控制数据可见范围
- **缓存**：高频报表结果缓存（Redis，TTL 可配）
- **调度**：定时生成 + 异步导出

### 1.4 L4 展现层（解决"怎么看"）

| 载体 | 内容 | 技术 |
|------|------|------|
| **报表中心门户** | 按主题域组织的报表导航树，每张报表可筛选/排序/导出 | Ace/LayUI + Searcher |
| **经营大屏** | 高管视角的核心指标实时看板（重构现有 largeScreen） | echarts + 后端代理 |
| **移动端** | 管理者随时随地看关键指标（复用 app/ 纯 LayUI 脚手架） | app/ LayUI |
| **导出中心** | 统一的 Excel/PDF 导出（复用 PoiExcelUtil） | 后端异步生成 |

---

## 2. 九大分析主题域

把 16 个业务模块归类为九大经营分析主题域。每个域是一组相关报表的集合：

| # | 主题域 | 涉及模块 | 核心问题 |
|---|--------|---------|---------|
| D1 | **营销获客** | market、customer(线索) | 线索从哪来？获客成本？渠道质量？ |
| D2 | **销售转化** | customer(机会)、decoration(签约) | 线索→客源→机会→签约各环节转化率？ |
| D3 | **装修履约** | decoration、quotation、construction | 报价偏差？工期达成？施工质量？ |
| D4 | **主材经营** | sales、material、quotation(选材) | 主材销售？品牌毛利？对账健康度？ |
| D5 | **生产交付** | production | 生产周期？各环节效率？交付准时率？ |
| D6 | **仓储物流** | inventory、balance(供应商结算) | 库存周转？采购到货？辅料成本？ |
| D7 | **财务资金** | payment、balance、finance | 回款率？资金流？结算进度？ |
| D8 | **人力薪酬** | salary、personel | 人效？薪酬结构？工人工费？ |
| D9 | **运营管理** | approval、information、store、customer(售后) | 审批效率？客户满意度？线上商城？ |

> 现有 report 模块只覆盖了 D2/D3/D4/D7 的皮毛。D1/D5/D6/D8/D9 几乎空白。

---

## 3. 通用分析角度框架

**每个模块、每个主题域**，都从以下九个角度产生报表指标。这是一套"万能角度"——任何业务数据都能套用：

| 角度 | 回答的问题 | 典型指标形态 |
|------|-----------|------------|
| **① 总量规模** | 做了多少？金额多大？ | COUNT / SUM / 总额 |
| **② 结构分布** | 各类占比如何？ | 按类型/品牌/区域 GROUP BY 占比 |
| **③ 转化漏斗** | 从进入到成交各环节流失？ | 各阶段量 ÷ 上游量 = 转化率 |
| **④ 周转效率** | 多快完成？周期多长？ | 时间戳相减求 AVG/Median/P90 |
| **⑤ 质量健康** | 合格率？超期率？返工率？ | 不达标数 ÷ 总数 |
| **⑥ 人效排名** | 谁做得多？谁做得好？ | 按人/部门聚合 + ORDER BY |
| **⑦ 趋势演变** | 同比/环比涨跌如何？ | 本期 vs 同期/上期 |
| **⑧ 目标对标** | 目标完成多少？ | 实际 ÷ 目标（需引入目标管理） |
| **⑨ 风险预警** | 哪里积压？哪里异常？ | 超阈值阈值告警/积压量 |

> 下面第 4 章，每个模块都按这九个角度展开指标。

---

## 4. 各业务模块报表指标矩阵

> 标注 🆕 = 当前系统完全没有的新报表；🔧 = 现有但需增强；✅ = 现有且基本可用。

---

### 4.1 customer 客户模块（56 PO，线索+售后+会员）

**核心实体**：CustomerSourcePO(客源)、CustomerOriginPO(报备)、CustomerChancePO(机会单)、CustomerAfterSalesPO(售后工单)、ComplaintPO(投诉)、PointAccountPO(积分)、VustomerPO(会员)

| 角度 | 报表/指标 | 状态 |
|------|----------|------|
| ① 总量 | 客源总量、报备量、机会单量、售后工单量（按 type 7类） | 🆕 |
| ② 结构 | 客源按来源(source)/需求(demand 基装/整装/局改)/意向(intention)分布 | 🆕 |
| ③ 转化 | **客源转化漏斗**：报备→确认→机会→签约，各环节转化率 & 流失分析 🆕核心 | 🆕 |
| ④ 效率 | 客源平均跟进周期、机会单分配耗时(issueTime-confirmTime)、派单响应时长 | 🆕 |
| ⑤ 质量 | 客源真实性占比(isTrue)、见面率(isMeet)、机会单罚款率(isFine) | 🆕 |
| ⑥ 人效 | 设计师/业务员获客数 & 转化率排名、大区/部门获客能力对比 | 🆕 |
| ⑦ 趋势 | 月度获客趋势、转化率同比/环比 | 🆕 |
| ⑧ 对标 | 各大区获客成本对标、获客目标完成率 | 🆕 |
| ⑨ 风险 | 超期未跟进客源清单、积压机会单(未分配 isIssue=0)预警 | 🆕 |

**售后子主题**（CustomerAfterSales，独立成报表组）：

| 角度 | 报表/指标 | 状态 |
|------|----------|------|
| 总量/结构 | 售后工单按 type(反馈/投诉/保修/维修/建议/表扬/退款)×status(11态) 矩阵 | 🆕 |
| 效率 | 响应时长(handleTime-receiveTime)、处理时长(finishTime-createTime)、平均/P90 | 🆕 |
| 质量 | SLA 达成率(对照 responseDeadline/finishDeadline)、超期率、重开率、升级率 | 🆕 |
| 人效 | 处理人(owner) 工单量 & 平均处理时长 & 满意度排名 | 🆕 |

---

### 4.2 decoration 装修模块（29 PO，订单主轴）

**核心实体**：DecorationPO(订单，7个状态字段)、DecorationContractPO(合同)、DecorationMeasurePO(量房)、DecorationAccountPO(决算)、DecorationBalancePO(结算)、DecorationActivityPO(活动)

| 角度 | 报表/指标 | 状态 |
|------|----------|------|
| ① 总量 | 量尺量、定金量、签单量、签约额、完工量 | ✅部分 |
| ② 结构 | 按 type(半包/整装/大包)、grade(档次)、typeness、公司分布 | 🔧 |
| ③ 转化 | **装修漏斗**：量尺→定金→预签→签约→决算→完工，各阶段转化率 ✅核心 | 🔧增强 |
| ④ 效率 | 各阶段平均时长（measureTime→depositTime→contractTime→accountTime）、签单周期 | 🔧 |
| ⑤ 质量 | 废单率(status=5)、终止率(status=6)、重签率(status=4) | 🆕 |
| ⑥ 人效 | 设计师/业务员/监理/报价员 签单量&额排名 ✅(已有 DecorationRank) | 🔧增强 |
| ⑦ 趋势 | 签约额同比/环比、各公司趋势对比 | 🔧 |
| ⑧ 对标 | 客单价对比、签约目标完成率 | 🆕 |
| ⑨ 风险 | 长期未签约定金单预警、超期未开工预警 | 🆕 |

---

### 4.3 quotation 报价模块（61 PO，当前几乎无报表）

**核心实体**：QuotationPO(报价单，完整价格族)、AddReducePO(增减项)、SelectionPO/SelectionItemPO(选材)、ExtensionPO(拓展项)、QuotationAssignRequestPO(派工)、QuotationPreferPO(优惠)

| 角度 | 报表/指标 | 状态 |
|------|----------|------|
| ① 总量 | 报价单量、报价总额、增减项金额、选材单量 | 🆕 |
| ② 结构 | 报价构成分析（基价/管理费/税金/运输费/工程款/主材款占比） 🆕核心 | 🆕 |
| ③ 转化 | 报价→签约转化率、选材确认率(isAffirm)、增减项提交率/确认率 | 🆕 |
| ④ 效率 | 报价编制周期(createTime→finishTime)、选材配送周期、派工分配耗时 | 🆕 |
| ⑤ 质量 | 报价偏差率(报价额 vs 决算额)、增减项频次、折扣率分析 | 🆕核心 |
| ⑥ 人效 | **报价员/拆单员业绩**：报价数量、签单转化、平均客单价 🆕核心 | 🆕 |
| ⑦ 趋势 | 报价均价趋势、折扣力度趋势、增减项金额趋势 | 🆕 |
| ⑧ 对标 | 各设计师报价偏差对标、各品牌选材占比对标 | 🆕 |
| ⑨ 风险 | 长期未确认选材预警、积压派工(priority 高)预警 | 🆕 |

> 🔑 **这是丰富报价体系的关键**。当前报价模块 61 个 PO 几乎没有专属报表，潜力巨大。

---

### 4.4 payment 款项模块（29 PO）

**核心实体**：DecorationPaymentPO(装修款)、各 *ReceiptPO(收据)、PaymentTypePO(字典，paytype×bustype×atttype 三轴)、PaymentPO(钱包)、StatementPO(对账单)

| 角度 | 报表/指标 | 状态 |
|------|----------|------|
| ① 总量 | 总收款额、总退款额、净收款、在途款项 | 🆕 |
| ② 结构 | **收款方式分布**(cash/bank/checkv/installment/accounts/advance/coupon)、按 PaymentType 三轴分组 🆕核心 | 🆕 |
| ③ 转化 | 应收→实收转化率、款项确认率(paymentStatus 流转) | 🆕 |
| ④ 效率 | 收款确认时长(createTime→confirmTime)、对账周期 | 🆕 |
| ⑤ 质量 | 退款率、坏账/呆账识别、长短款 | 🆕 |
| ⑥ 人效 | 收款员(collecter) 效率、各公司回款能力对比 | 🆕 |
| ⑦ 趋势 | 回款额同比/环比、回款率趋势 | 🔧(现有业绩含) |
| ⑧ 对标 | 回款率目标对标（行业基准 70%/85%/95%） | 🆕 |
| ⑨ 风险 | 大额未确认款项预警、超期应收款账龄分析 | 🆕 |

---

### 4.5 balance 结算模块（18 PO）

**核心实体**：BalancePO(结算单)、BalanceSalesPO(销售结算)、BalanceAccountPO(账户)、BalanceSelectionPO(选品结算)、ComcostPO(公司成本)

| 角度 | 报表/指标 | 状态 |
|------|----------|------|
| ① 总量 | 应结总额、实结总额、扣款总额、待结余额 | 🆕 |
| ② 结构 | 按收支类型(type 0支出/1收款/2提款)、按业务线分布 | 🆕 |
| ③ 转化 | 结算完成率(status 0→1)、销售结算四阶段流转(初始→锁定→确认→结算) | 🆕 |
| ④ 效率 | 结算周期(createTime→balanceTime→payedTime)、平均结算时长 | 🆕 |
| ⑤ 质量 | 扣款率(cutpay/amount)、结算差异率 | 🆕 |
| ⑥ 人效 | 结算人(balancer) 效率、供应商维度结算对比 | 🆕 |
| ⑦ 趋势 | 月度结算额趋势 | 🆕 |
| ⑨ 风险 | 长期未结算单预警、大额待付预警 | 🆕 |

---

### 4.6 finance 财务模块（10 PO，会计总账）

**核心实体**：VoucherPO(凭证)、SubjectBalancePO(科目余额)、PeriodPO(会计期间)

| 角度 | 报表/指标 | 状态 |
|------|----------|------|
| 总量/结构 | 凭证量、借贷发生额、科目余额表、损益结构 | 🆕 |
| 效率 | 凭证录入→过账→结账周期 | 🆕 |
| 质量 | 凭证状态分布(预提/正式/结账/非正式)、反过账率 | 🆕 |
| 趋势 | 期间对比(月度/季度损益对比) | 🆕 |

---

### 4.7 salary 薪酬模块（8 PO）

**核心实体**：SalaryPO(薪资变动)、WorkerSalaryPO(工人工费)、DecorationSalaryPO(装修提成)、MaterialSalaryPO(主材提成)、DesignerSalaryPO(设计师薪资)

| 角度 | 报表/指标 | 状态 |
|------|----------|------|
| ① 总量 | 薪酬总额、工人工费总额、提成总额（按 period 账期） | 🆕 |
| ② 结构 | 薪酬构成（基本/提成/工费/扣罚/押金）、工费按工种(twotype)分布 | 🆕 |
| ③ 转化 | 工费审批通过率(status 0→1)、驳回率(2)、撤销率(3) | 🆕 |
| ④ 效率 | 工费审批周期、发送→发放时长(isSend 流转) | 🆕 |
| ⑤ 质量 | 扣罚占比(onetype=1)、押金占比 | 🆕 |
| ⑥ 人效 | 工人工费排名、设计师提成排名 🆕核心 | 🆕 |
| ⑦ 趋势 | 薪酬月度趋势、人均薪酬同比 | 🆕 |
| ⑨ 风险 | 超额度发放预警(对照 WorkerBalancePO.toplimit) | 🆕 |

---

### 4.8 sales 主材销售模块（25 PO）

**核心实体**：SalesPO(销售单)、SalesItemPO(明细)、SalesBalancePO(结算)、SalesRefundsPO(退货)、SalesActivityPO(活动)

| 角度 | 报表/指标 | 状态 |
|------|----------|------|
| ① 总量 | 销售额、销售单量、退货金额 | ✅部分 |
| ② 结构 | 按品牌(category×brand)、按公司三段(company/dompany/pompany)分账 🆕核心 | 🔧 |
| ③ 转化 | 销售漏斗(初始→定金→全款→结算→完结)、退货率(全退/部分退) | 🆕 |
| ④ 效率 | 回款周期(create→fullpay)、结算周期(4阶段)、完结周期 | 🆕 |
| ⑤ 质量 | 抹零率(maling)、结算差异率(difference)、采购-出货履约率(num/punum/xgnum) | 🆕 |
| ⑥ 人效 | 导购员(salesman)/设计师(guider) 销售排名、毛利率(selling-purchase)排名 🆕核心 | 🔧 |
| ⑦ 趋势 | 销售额趋势、毛利率趋势 | 🔧 |
| ⑧ 对标 | 各品牌毛利对标、各门店销售对比 | 🆕 |
| ⑨ 风险 | 长期未结算销售单预警、库存积压商品预警 | 🆕 |

---

### 4.9 material 主材活动模块（5 PO）

**核心实体**：MaterialPO(主材单)、MaterialBalancePO(结算)、MaterialActivityItemPO(活动赠品/券)

| 角度 | 报表/指标 | 状态 |
|------|----------|------|
| 总量/结构 | 主材单量/额、按品牌/品类、套餐占比(packageFlag) | 🔧(现有 DesignerReport) |
| 转化 | status 9阶段流转(初始→结算→完结→退货)、结算三段式(pre/post/vBalance) | 🆕 |
| 质量 | 退货率(status=6全退)、倒单率(7)、作废率(8) | 🆕 |
| 人效 | 材管员(materialer)/设计师(designerFlag) 业绩排名 🔧 | 🔧 |
| 活动 | 活动产出：赠品/券领用、配送、消耗、退货统计(MaterialActivityItemPO state 7态) | 🆕 |

---

### 4.10 construction 施工模块（30 PO）

**核心实体**：ConstructionPO(施工主表)、ConstructionSchedulePO(节点进度)、ConstructionInfoPO(工期)、AcceptancePO(验收评分)、ReworkPO(返工)、ConstructionCostPO(成本标准)

| 角度 | 报表/指标 | 状态 |
|------|----------|------|
| ① 总量 | 在建工地数、完工数、开工数 | ✅(现有 decoration7construction) |
| ② 结构 | 按 schedule(当前节点) 分布、按工程管家(supervisor) 分布 | 🔧 |
| ③ 转化 | 节点完成率(Schedule.status)、工程完工率(process) | 🔧 |
| ④ 效率 | **各工种节点平均耗时**、实际工期 vs 计划工期(超期率) 🆕核心 | 🆕 |
| ⑤ 质量 | **验收评分**(Acceptance 七工种×质量/服务/卫生)、返工率(Rework)、超耗率(accessory) 🆕核心 | 🆕 |
| ⑥ 人效 | 工程管家名下工地数 & 完工率 & 验收均分排名 🆕核心 | 🆕 |
| ⑦ 趋势 | 工期趋势、返工率趋势 | 🆕 |
| ⑨ 风险 | 严重超期工地预警、返工高发工地带 | 🆕 |

---

### 4.11 production 生产模块（23 PO，定制家居）

**核心实体**：ProductionPO(生产单，11阶段状态机)、OutsourcePO(外协)、HardwarePO(五金)、TranpackPO(物流)

| 角度 | 报表/指标 | 状态 |
|------|----------|------|
| ① 总量 | 生产单量、总产值、售后单量 | 🆕 |
| ② 结构 | 生产单 vs 售后单(type)、按品牌、按外协/自制 | 🆕 |
| ③ 转化 | **11阶段转化漏斗**(设计→拆单→入库→物流→运输→安装→完成→售后→完结) 🆕核心 | 🆕 |
| ④ 效率 | 各环节平均周期(designTime→divideTime→...→finishTime)、超期率 | 🆕 |
| ⑤ 质量 | 废单率(status=10)、丢失率(Tranpack LOSS)、返修率(售后单占比) | 🆕 |
| ⑥ 人效 | 设计师/拆单员(spliter) 产量排名、外协厂商产出排名 | 🆕 |
| ⑦ 趋势 | 产值趋势、交付周期趋势 | 🆕 |
| ⑨ 风险 | 各环节积压预警、超期生产单预警 | 🆕 |

---

### 4.12 inventory 库存模块（21 PO）

**核心实体**：ManifestPO(出入库流水，12类)、GoodsStorehouseStockPO(实时库存)、PurchasePO(采购)、StorehouseStockPO(月度库存)、AccessoriesPO(辅料)、CheckListPO(盘点)

| 角度 | 报表/指标 | 状态 |
|------|----------|------|
| ① 总量 | 入库总量、出库总量、库存总值 | 🆕 |
| ② 结构 | 出入库按 type(12类) 分布、按仓库分布 | 🆕 |
| ③ 转化 | 采购到货率(PurchaseItem.surplus/num)、采购结算完成率 | 🆕 |
| ④ 效率 | 采购到货周期、日均/月均吞吐量 | 🆕 |
| ⑤ 质量 | **库存周转率**、盘点盘盈/盘亏率(CP/CL)、呆滞库存识别 🆕核心 | 🆕 |
| ⑥ 人效 | 各仓库吞吐对比、采购员效率 | 🆕 |
| ⑦ 趋势 | 库存价值趋势、周转率趋势 | 🆕 |
| ⑨ 风险 | **低库存预警**、超期呆滞库存预警、缺货商品清单 🆕核心 | 🆕 |

---

### 4.13 store 门店商城模块（17 PO）

**核心实体**：MorderPO(商城订单)、MpaymentPO(支付)、MgoodsPO(商品)、CouponPO(券)、EvaluatePO(评价)、MuserPO(用户)

| 角度 | 报表/指标 | 状态 |
|------|----------|------|
| 总量 | GMV、订单量、支付金额 | 🆕 |
| 结构 | 按商品分类/品牌、按支付方式(Mpayment.type) | 🆕 |
| 转化 | 订单状态漏斗(初始→待发货→已发货→待评价→已完成)、支付成功率 | 🆕 |
| 效率 | 下单-支付间隔、复购率(RFM)、券核销率 | 🆕 |
| 质量 | 退货率、评价分布(Evaluate) | 🆕 |
| 人效 | 商品销量排行、推荐人(rmunionId) 裂变效果 | 🆕 |

---

### 4.14 approval 审批模块（43 PO）

**核心实体**：ApprovalPO(审批主表，28类业务)、ApprovalFlowPO/NodePO(流程定义)、ApprovalTaskPO(运行时任务)

| 角度 | 报表/指标 | 状态 |
|------|----------|------|
| ① 总量 | 审批单总量（按 type 28类） | 🆕(现有仅简单统计) |
| ② 结构 | 按 status(8态)、按业务类型、按公司分布 | 🆕 |
| ③ 转化 | 通过率、拒绝率、确认率（按业务类型） | 🆕 |
| ④ 效率 | **审批耗时**(approvalTime-createTime)：平均/中位/P90、**节点停留时长**(Task 层) 🆕核心 | 🆕 |
| ⑤ 质量 | 超时率(对照 timeoutHours)、驳回回退率、转交率 | 🆕 |
| ⑥ 人效 | 各审批人处理量 & 效率、待办积压榜(assignee) 🆕核心 | 🆕 |
| ⑦ 趋势 | 审批效率趋势 | 🆕 |
| ⑨ 风险 | 待办积压预警(超 N 天未处理)、超时审批清单 | 🆕 |

---

### 4.15 market 营销模块（16 PO）

**核心实体**：MarketCampaignPO(活动)、MarketChannelPO(渠道)、MarketSourcePO(来源/UTM)、MarketInboundPO(线索入站)、MarketAttributionPO(归因)

| 角度 | 报表/指标 | 状态 |
|------|----------|------|
| ① 总量 | 活动数、渠道数、入站线索量 | 🆕 |
| ② 结构 | 按 UTM(utmSource/utmMedium/utmCampaign)、按渠道/活动分布 | 🆕 |
| ③ 转化 | **营销漏斗**：入站→转客源(csid)→转机会(ccid)→转单(orderId)，各环节转化率 🆕核心 | 🆕 |
| ④ 效率 | 线索处理耗时、接入客源耗时 | 🆕 |
| ⑤ 质量 | 线索失败率(status=2)、重试率、线索质量(转单率) | 🆕 |
| ⑥ 人效/对标 | **渠道 ROI**(budget vs 成单营收)、**活动 ROI**对比 🆕核心 | 🆕 |
| ⑦ 趋势 | 线索趋势、获客成本趋势 | 🆕 |
| ⑨ 风险 | 失败线索堆积预警 | 🆕 |

---

### 4.16 information 信息模块（24 PO）

**核心实体**：NoticePO(通知)、MessagePO(站内消息)、ActivityPO(促销)、PhoneCallPO(通话)、PlanPO(定时任务)

| 角度 | 报表/指标 | 状态 |
|------|----------|------|
| 消息 | 站内消息发送量、**未读率/阅读率**(按 type/receiver)、投递成功率(dresult) | 🆕 |
| 通话 | 通话量、通话时长分布、**接通率 & 挂断原因分布**(stopReason 14种) 🆕核心 | 🆕 |
| 促销 | 促销活动数(按 type 装修/主材/销售、atttype 线上/线下)、红包/券/抽奖核销 | 🆕 |
| 任务 | 定时任务成功率/失败率、执行产物统计 | 🆕 |

---

### 指标矩阵汇总

| 模块 | 已有✅ | 待增强🔧 | 全新🆕 | 合计指标数 |
|------|-------|---------|-------|-----------|
| customer | 0 | 0 | 20+ | 20+ |
| decoration | 4 | 6 | 4 | 14 |
| quotation | 0 | 0 | **20+** | 20+ |
| payment | 0 | 1 | 14 | 15 |
| balance | 0 | 0 | 12 | 12 |
| finance | 0 | 0 | 5 | 5 |
| salary | 0 | 0 | 12 | 12 |
| sales | 2 | 4 | 10 | 16 |
| material | 2 | 2 | 5 | 9 |
| construction | 2 | 2 | 6 | 10 |
| production | 0 | 0 | **14** | 14 |
| inventory | 0 | 0 | **14** | 14 |
| store | 0 | 0 | 8 | 8 |
| approval | 0 | 0 | 12 | 12 |
| market | 0 | 0 | **12** | 12 |
| information | 0 | 0 | 8 | 8 |
| **合计** | **10** | **15** | **~176** | **~205** |

> 现有报表约 10 个维度可用，蓝图设计 **205+ 指标**，其中 **176 个全新**。覆盖从获客到售后、从签单到回款、从生产到库存的全链路。

---

## 5. 跨模块联动分析主题

单模块报表是"竖井"，真正的经营洞察来自**跨模块联动**。系统所有业务通过 `orderId`（装修单号）+ `csid`（客源）+ `ccid`（机会）+ `company` 强关联，为联动分析提供了天然基础。

### 5.1 客户全生命周期穿透（"一户全景"）🎯核心

**主题**：一个客户从接触到完工售后的完整旅程。

```
market 线索入站 → customer 客源/报备 → customer 机会单 → decoration 签约
      → quotation 报价 → construction 施工 → decoration 决算完工
      → customer 售后工单
```

**报表形态**：
- **漏斗报表**：各环节量 + 转化率 + 平均周期 + 流失归因
- **单户穿透**：输入 orderId，展示该客户的全旅程时间轴（线索→签约→施工→回款→售后）

**关键指标**：
- 全链路转化率（线索→签约）
- 全链路周期（线索→完工）
- 各环节流失率与流失原因

### 5.2 资金闭环分析 💰核心

**主题**：从报价到回款到结算到薪酬的钱的流动。

```
quotation 报价额 → decoration 签约额 → payment 收款 → balance 结算 → salary 薪酬发放
```

**报表形态**：
- 报价 vs 签约 vs 决算 vs 实收 四段对比（偏差分析）
- 应收-实收-在途-坏账 账龄分析
- 资金周转周期

### 5.3 营销 ROI 归因 📈核心

**主题**：每笔营销投入带来多少营收。

```
market 活动(预算 budget) → market 渠道/来源(UTM) → market 线索 → customer 客源
      → decoration 签约(营收) → 回款
```

**报表形态**：
- 渠道 ROI = 该渠道带来签约营收 ÷ 该渠道投入
- 活动 ROI 对比
- 归因链路：MarketAttributionPO 记录了 campaign→source→csid→ccid→orderId 全链

### 5.4 主材成本闭环

```
quotation 选材(预算 preprice) → sales/material 销售(售价 postprice) 
      → inventory 出库(成本) → balance 厂商结算 → 利润分析
```

**报表形态**：选材预算 vs 实际售价 vs 结算成本，按品牌/品类的毛利分析。

### 5.5 履约质量对标

```
construction 工期/验收 + construction 返工 + customer 售后投诉/回访满意度
```

**报表形态**：工地质量综合评分 = 工期达成 + 验收评分 + 返工率 + 售后率 + 满意度，按管家/大区对标。

### 5.6 组织人效全景

**主题**：从获客到交付，各岗位的人效对比。

```
设计师: 获客数 + 签单额 + 报价偏差 + 主材引导额 + 提成
业务员: 获客数 + 签单额 + 回款率
工程管家: 工地数 + 完工率 + 验收分 + 返工率
拆单员: 生产单量 + 交付周期
导购: 销售额 + 毛利
```

**报表形态**：岗位人效雷达图、跨岗位协同效率分析。

---

## 6. 技术实现方案

> 遵守铁律：不改任何业务模块、不碰旧 report 代码。全部新增。

### 6.1 包结构（新增 `com.fanglin.report.analytics` 分析子域）

在 report 包内全新子域，与旧代码完全隔离（旧代码原样保留）：

```
src/com/fanglin/report/
├── action/                  # 现有（不动）
├── service/                 # 现有（不动）
├── dao/                     # 现有（不动）
├── po/                      # 现有（不动）
├── vo/                      # 现有（不动）
│
├── analytics/               # 🆕 全新分析子域（与上面完全隔离）
│   ├── action/              # 🆕 AnalyticsAction 查询入口
│   ├── service/             # 🆕 主题域查询服务（接口+impl）
│   ├── dao/                 # 🆕 汇总表查询 DAO（接口+impl）
│   ├── po/                  # 🆕 metric_* 汇总表 PO
│   ├── vo/                  # 🆕 分析视图对象
│   └── domain/              # 🆕 九大主题域的"计算器"
│       ├── DecorationDomainCalculator.java   # 跑 decoration 跨库聚合
│       ├── PaymentDomainCalculator.java      # 跑 payment 跨库聚合
│       └── ...每域一个
│   └── job/                 # 🆕 定时任务（@Scheduled）
│       └── MetricRefreshJob.java             # 每日凌晨调各 Calculator
```

> 注意：domain 计算器是**核心**。每个 Calculator 内部跑跨库只读聚合 SQL（`SELECT ... FROM decoration.decoration WHERE ...`），把结果 `REPLACE INTO report.metric_*`。SQL 全在 report 包内，绝不改业务模块。

### 6.2 数据采集：定时全量重算（替代已废弃的事件驱动）

~~v1.0 的事件驱动方案已废弃~~（违反铁律 1）。改为：

**每个主题域一个 `@Scheduled` Job**，参考现有 `log.job.ActionLogArchiveJob` 写法：

```java
package com.fanglin.report.analytics.job;

@Component
public class MetricRefreshJob {
    private static final Logger logger = LoggerFactory.getLogger(MetricRefreshJob.class);

    @Autowired private DecorationDomainCalculator decorationCalculator;
    @Autowired private PaymentDomainCalculator paymentCalculator;
    // ... 九域各一个

    /** 每日凌晨 1:30 重算（错开 log 归档的 2:00） */
    @Scheduled(cron = "0 30 1 * * ?")
    public void refreshDaily() {
        logger.info("[metric-refresh] job started at {}", new Date());
        try {
            decorationCalculator.rebuild();   // REPLACE INTO metric_decoration_daily
            paymentCalculator.rebuild();      // REPLACE INTO metric_payment_monthly
            // ...
            logger.info("[metric-refresh] job finished");
        } catch (Throwable t) {
            logger.error("[metric-refresh] job failed", t);  // 不抛，次日重试
        }
    }
}
```

**Calculator 示例**（DecorationDomainCalculator 核心逻辑）：

```java
@Component
public class DecorationDomainCalculator {

    @Autowired
    private SessionFactory sessionFactory;

    /** 全量重算装修签单日级汇总。跨库只读，REPLACE INTO 自己的表。 */
    @Transactional(rollbackFor = Exception.class)
    public void rebuild() {
        // ① 跨库聚合（只读 decoration 库）
        String sql =
            "INSERT INTO report.metric_decoration_daily " +
            "(stat_date, company, region_id, dept_id, " +
            " measure_count, deposit_count, sign_count, sign_amount, complete_count) " +
            "SELECT DATE_FORMAT(d.createTime,'%Y-%m-%d') AS stat_date, " +
            "       d.company, r.did AS region_id, dd.did AS dept_id, " +
            "       SUM(CASE WHEN d.status>=0 THEN 1 ELSE 0 END) AS measure_count, "
            // ... 按各状态统计
            "FROM decoration.decoration d " +
            "LEFT JOIN communion.department r ON ... " +  // 只读 JOIN
            "GROUP BY stat_date, d.company, r.did, dd.did " +
            "ON DUPLICATE KEY UPDATE ...";  // 幂等
        sessionFactory.getCurrentSession().createSQLQuery(sql).executeUpdate();
    }
}
```

> `INSERT ... SELECT ... ON DUPLICATE KEY UPDATE`（或 `REPLACE INTO`）保证幂等。每张汇总表按 `(stat_date, company, ...)` 建唯一索引。重复跑不重复累加。

### 6.3 报表查询统一服务

```java
// 统一查询入口
public interface ReportQueryService {
    // 维度×指标组合查询
    ReportResult query(ReportQuery query);
    // 导出
    String export(ReportQuery query, ExportFormat format);
    // 调度生成
    void schedule(ReportQuery query, String cron);
}

// 指标定义
@Metric(code = "DEC.SIGN.COUNT", name = "装修签单量", domain = "D2")
public class DecorationSignCountMetric implements MetricCalculator {
    @Override
    public List<MetricRow> calculate(MetricContext ctx) {
        // 查 metric_decoration_daily 或实时聚合
    }
}
```

### 6.4 大屏后端代理化（解决 P3）

```
现有: 浏览器 → ES(192.168.5.x:9200)  🔴 危险
目标: 浏览器 → ReportScreenAction.do → ES/MySQL(配置化)  ✅ 安全
```

新增 `ReportScreenAction`，ES 地址从 `sysconfig.properties` 读取。

### 6.5 前端报表中心门户

```
WebContent/views/report/
├── center.html              # 🆕 报表中心门户（主题域导航）
├── domain/                  # 🆕 按主题域组织
│   ├── marketing/           # 营销获客
│   ├── sales/               # 销售转化
│   ├── fulfillment/         # 装修履约
│   ├── material/            # 主材经营
│   ├── production/          # 生产交付
│   ├── inventory/           # 仓储物流
│   ├── finance/             # 财务资金
│   ├── hr/                  # 人力薪酬
│   └── operation/           # 运营管理
└── screen/                  # 🆕 重构后的大屏
```

每个主题域页面提供：维度筛选器 + 指标看板 + 图表 + 导出。

---

## 7. 实施路线图

按 **"建基础设施 → 建第一个主题域验证 → 批量复制 → 联动精装"** 四阶段推进。

> ⚠️ 约束调整说明：v1.0 的"阶段〇地基修补"取消——铁律 2 要求旧代码碰都不碰，所以年份硬编码/Zaterial 等问题**不在本蓝图处理**（它们随新体系上线自然边缘化）。v1.0 的"事件投递"也废弃。

### 阶段一：聚合基础设施 + D2 销售转化验证（3 周）🔑最关键

先建"骨架"并用一个主题域（装修销售转化，数据最成熟）跑通全链路：

1. **建 `metric_decoration_daily` 汇总表 + PO/DAO**（3 天）
2. **`DecorationDomainCalculator`**：跨库只读聚合 SQL（量尺/定金/签约/完工各状态量 + 签约额），`INSERT...ON DUPLICATE KEY` 幂等写入（4 天）
3. **`MetricRefreshJob`**：`@Scheduled` 每日 1:30 调 Calculator（1 天）
4. **`AnalyticsAction` + `DecorationAnalyticsService`**：查询入口，支持 company/region/month 维度筛选（3 天）
5. **前端报表页** `decorationFunnel.html/js`：装修漏斗 + 量尺/定金/签约/完工看板 + 按公司/月份筛选（5 天）

> 里程碑 M1：一套"定时重算→汇总表→查询→前端"的完整链路跑通，验证架构可行。装修漏斗报表可用。

### 阶段二：四大经营主题域（5 周）

复制阶段一的模式，扩展到其余高频域：
1. **D7 财务资金**：payment/balance 跨库聚合 → `metric_payment_monthly`（回款/退款/结算）（1.5 周）
2. **D3 装修履约**：quotation 报价偏差 + construction 工期/验收 → `metric_quotation_*` / `metric_construction_*`（1.5 周）
3. **D4 主材经营**：sales 毛利/品牌排名 → `metric_sales_*`（1 周）
4. **D2 客户漏斗补全**：customer 线索→客源→机会→签约 → `metric_customer_funnel`（1 周）

> 里程碑 M2：四大经营域上线，管理层有像样的数据看板。

### 阶段三：全域覆盖（6 周）

补齐剩余 5 个主题域（每个复用 Calculator 模式，约 1-1.5 周/域）：
- D1 营销获客（market 线索/ROI）
- D5 生产交付（production 11阶段漏斗）
- D6 仓储物流（inventory 周转/预警）
- D8 人力薪酬（salary 工费/提成）
- D9 运营管理（approval 效率 + 售后 SLA + 商城）

> 里程碑 M3：九大主题域全部覆盖，205+ 指标可用。

### 阶段四：联动分析 + 精装修（3 周）

1. 跨模块联动主题（一户穿透 / 资金闭环 / 营销 ROI）（2 周）
2. 大屏重构（后端代理 + 新看板）、导出中心（1 周）

> 里程碑 M4：联动分析上线，经营分析平台成型。

### 排期总览

| 阶段 | 周期 | 核心交付 | 人天估算 |
|------|------|---------|---------|
| 一 基础设施+D2验证 | 3 周 | 骨架 + 装修漏斗跑通 | 15 |
| 二 四大经营域 | 5 周 | D2/D3/D4/D7 | 25 |
| 三 全域覆盖 | 6 周 | D1/D5/D6/D8/D9 | 30 |
| 四 联动+精装 | 3 周 | 跨模块 + 大屏 | 15 |
| **合计** | **17 周** | | **~85 人天** |

> 因废弃事件改造（省去改业务模块）、不修旧代码（省去阶段〇），人天从 v1.0 的 120 压缩到 85。建议 2-3 人并行，实际 10-14 周。

---

## 8. 附录

### 8.1 全系统模块清单与报表参与度

| 模块 | PO数 | 主题域归属 | 当前报表 | 蓝图指标数 |
|------|------|----------|---------|-----------|
| customer | 56 | D1获客/D2转化/D9运营 | 0 | 20+ |
| decoration | 29 | D2转化/D3履约 | 4 | 14 |
| quotation | 61 | D3履约 | 0 | 20+ |
| payment | 29 | D7财务 | 0 | 15 |
| balance | 18 | D7财务/D6仓储 | 0 | 12 |
| finance | 10 | D7财务 | 0 | 5 |
| salary | 8 | D8人力 | 0 | 12 |
| sales | 25 | D4主材 | 2 | 16 |
| material | 5 | D4主材 | 2 | 9 |
| construction | 30 | D3履约 | 2 | 10 |
| production | 23 | D5生产 | 0 | 14 |
| inventory | 21 | D6仓储 | 0 | 14 |
| store | 17 | D9运营 | 0 | 8 |
| approval | 43 | D9运营 | 0 | 12 |
| market | 16 | D1获客 | 0 | 12 |
| information | 24 | D9运营 | 0 | 8 |
| communion | 40 | (维度表：部门/区域/品牌) | — | — |
| personel | 27 | D8人力(维度表：员工) | — | — |
| data | 85 | (字典：PaymentType/Goods等) | — | — |
| system | 14 | (维度表：公司) | — | — |

### 8.2 通用维度清单

所有报表可共用的筛选/分组维度：

| 维度 | 来源 | 说明 |
|------|------|------|
| company | 各 PO | 公司/分店 |
| region | DepartmentPO(type=1) | 大区 |
| department/depte | DepartmentPO(type=2) | 部门 |
| designer/salesman/user | UserPO | 人员 |
| brand | BrandPO | 品牌 |
| category | CategoryPO/字符串 | 品类 |
| village/house | HousePO | 楼盘/房产 |
| 时间 | createTime/collectTime等 | 年/季/月/周/日 |
| orderId | DecorationPO | 装修单（穿透用） |

### 8.3 与现有文档的关系

- **本文件**（`REPORT_PLATFORM_BLUEPRINT.md`）：全局蓝图，回答"做成什么样"
- **`REPORT_MODULE_ANALYSIS_AND_PLAN.md`**：现有模块修补，回答"当前怎么修"，对应阶段〇
- **`MESSAGE_QUEUING_GUIDE.md`**：事件总线实现，阶段一的基础设施
- **`METHOD_NAMING_CONVENTION.md`**：新增方法的命名规范
- **`app-pure-layui-scaffold`**（记忆）：移动端报表的载体

### 8.4 风险与对策

| 风险 | 等级 | 对策 |
|------|------|------|
| 事件驱动涉及多模块事务一致性 | 高 | 消费端幂等 + 定时兜底对账 |
| 预聚合表数据迁移 | 高 | 新旧并行一个对账周期 |
| 大屏 ES 权限/网络 | 中 | 运维协同，后端代理 |
| 205 指标开发量大 | 中 | 分优先级，P0/P1/P2 分批 |
| 跨模块口径不一致 | 中 | 指标库统一定义口径 |
| 现有 cs0~cs26 重构 | 中 | 阶段二随 D3 一起重构 |

---

> 这是一份**蓝图**，定义了"全域经营分析平台"的目标形态与实施路径。  
> 实施时建议每个主题域独立开分支、独立设计详案、独立验收。  
> 阶段一（数据管道）是整个体系的命脉，务必优先做扎实。  
> 有了自动化的数据采集，后面 205 个指标只是"怎么算、怎么展"的问题。
