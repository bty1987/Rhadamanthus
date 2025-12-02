# report - 报表统计模块

[根目录](../../../CLAUDE.md) > [src](../../) > [com/fanglin](..) > **report**

> 最后更新：2025-12-01 18:30:02

---

## 模块职责

report 模块负责系统的**数据统计与报表生成**，为管理层提供全方位的业绩分析、排名统计和经营看板。支持装饰业绩、主材销售、施工进度、审批统计等多维度数据分析。

**核心功能**
- 装饰订单业绩统计与排名
- 主材销售业绩分析
- 施工进度报表
- 审批流程统计
- 报价业务统计
- 员工业绩排名
- 部门/区域业绩对比
- 大屏可视化展示

---

## 入口与启动

### 控制器入口
- `DecorationReportAction` - 装饰业绩报表
- `SalesReportAction` - 主材销售报表
- `ConstructionReportAction` - 施工进度报表
- `ApprovalReportAction` - 审批统计报表
- `QuotationRankAction` - 报价排名
- `MaterialRankAction` - 主材排名
- `DecorationRankAction` - 装饰排名
- `RankAction` - 综合排名查询
- `UserReportAction` - 员工业绩报表
- `OtherAction` - 其他统计功能

### 前端页面
- `WebContent/views/report/decoration7achievement.html` - 装饰业绩统计
- `WebContent/views/report/decoration7construction.html` - 施工统计
- `WebContent/views/report/sales7Achievement.html` - 销售业绩
- `WebContent/views/report/decorationRank.html` - 排名榜单
- `WebContent/views/report/largeScreen.html` - 大屏看板
- `WebContent/views/report/chart.html` - 图表展示

---

## 对外接口

### 装饰业绩报表
```java
// 查询装饰施工统计
GET/POST /queryDecoration7Construction.do
Request: Paging + Filters
Response: { data: [...], total, pages }

// 查询装饰业绩统计
GET/POST /queryDecoration7Achievement.do
Request: Paging + Filters + company
Response: { decorationAchievement: {...} }

// 更新装饰施工数据
GET/POST /updateDecoration7Construction.do
Response: success
```

### 主材销售报表
```java
// 查询主材销售报表
GET/POST /pageSalesReport.do
Request: Paging + Filters
Response: { data: [...] }

// 主材设计师排名
GET/POST /queryMaterialDesignerRank.do
Request: company
Response: { ranks: [...] }
```

### 综合排名查询
```java
// 查询用户排名位置
GET/POST /queryRankForPlace.do
Request: userId + company
Response: {
  decorationRank: "排名",
  decorationPlace: "位置",
  materialRank: "排名",
  materialPlace: "位置"
}
```

### 施工进度报表
```java
// 查询施工进度统计
GET/POST /pageConstructionReport.do
Request: Paging + Filters
Response: { data: [...] }
```

### 审批统计报表
```java
// 查询审批业绩
GET/POST /pageApprovalReport.do
Request: Paging + Filters
Response: { approvalAchievements: [...] }
```

---

## 关键依赖与配置

### 核心依赖
- `com.fanglin.decoration` - 装饰订单数据源
- `com.fanglin.sales` - 主材销售数据源
- `com.fanglin.construction` - 施工数据源
- `com.fanglin.approval` - 审批数据源
- `com.fanglin.quotation` - 报价数据源
- `com.fanglin.personel` - 员工数据
- `com.fanglin.system` - 公司/区域/部门数据

### 导航配置
- `ds/report.json` - 报表菜单配置
  - 装饰业绩
  - 主材业绩
  - 施工统计
  - 审批统计
  - 排名榜单
  - 大屏看板

---

## 数据模型

### 核心实体（PO）

#### DecorationReportPO - 装饰施工报表
```java
@Entity
@Table(name = "decoration4construction", catalog = "report")
- dcid: long                  // 报表ID
- company: CompanyPO          // 公司
- cs0~cs26: int               // 各施工阶段数量
  - cs0: 未开工
  - cs1: 已开工
  - cs2: 已完工
  - cs3: 铲大白
  - cs4: 放线
  - cs5: 水暖
  - cs6: 力工
  - cs7: 电工
  - cs8: 瓦工
  - cs9: 地面找平
  - cs10: 木工
  - cs11: 油工
  - cs12: 水电验收
  - cs13: 保洁
```

#### DecorationAchievementPO - 装饰业绩
```java
@Entity
- 设计师业绩统计
- 签单量、签单额
- 回款额、回款率
- 按月度/季度/年度统计
```

#### SalesAchievementsPO - 主材销售业绩
```java
@Entity
- 销售员业绩
- 销售金额
- 销售订单数
- 品类分布
```

#### UserAchievementPO - 员工业绩
```java
@Entity
- 员工综合业绩
- 多维度指标
- 业绩趋势
```

#### DecorationRankPO - 装饰排名
```java
@Entity
- 设计师排名
- 部门排名
- 区域排名
- 排名变化趋势
```

#### MaterialDesignerRankPO - 主材设计师排名
```java
@Entity
- 主材销售排名
- 设计师主材业绩
- 部门/区域排名
```

#### ConstructionReportPO - 施工报表
```java
@Entity
- 施工进度统计
- 工地数量
- 完工率
- 延期工地
```

#### ApprovalAchievementPO - 审批业绩
```java
@Entity
- 审批数量统计
- 审批通过率
- 审批耗时
- 审批类型分布
```

### 值对象（VO）
- `DecorationAchievementVO` - 装饰业绩视图
- `SalesAchievementsVO` - 销售业绩视图
- `ConstructionReportVO` - 施工报表视图
- `ApprovalAchievementVO` - 审批业绩视图
- `DecorationRankVO` - 装饰排名视图
- `MaterialDesignerRankVO` - 主材排名视图
- `AddReduceRankVO` - 增减排名视图

---

## 统计维度

### 1. 时间维度
- 日报表
- 周报表
- 月报表
- 季度报表
- 年度报表
- 自定义时间段

### 2. 组织维度
- 公司维度
- 部门维度
- 区域维度
- 岗位维度
- 个人维度

### 3. 业务维度
- 装饰订单业绩
- 主材销售业绩
- 施工进度统计
- 审批流程统计
- 报价业务统计
- 客户来源分析

### 4. 指标维度
- 签单量/签单额
- 回款额/回款率
- 完工率/工期达成率
- 审批通过率
- 客户满意度
- 增减率/同比环比

---

## 测试与质量

### 当前测试覆盖
- 未发现独立的测试文件
- 依赖手工测试

### 建议增强
1. 为统计计算逻辑添加单元测试
2. 对排名算法进行准确性测试
3. 测试大数据量场景下的性能
4. 验证统计数据的一致性

---

## 常见问题 (FAQ)

**Q: 报表数据多久更新一次？**
A: 不同报表更新频率不同：
- 实时数据：签单、回款等核心指标
- 日更新：施工进度、排名榜单
- 月更新：月度业绩汇总

**Q: 排名是如何计算的？**
A: 综合多个维度：
- 装饰排名：签单额、签单量、回款率
- 主材排名：销售额、销售订单数
- 支持按部门、区域、全公司排名

**Q: 大屏看板支持哪些图表？**
A: 支持多种可视化：
- 柱状图：业绩对比
- 折线图：趋势分析
- 饼图：占比分析
- 排行榜：TOP N 展示
- 实时滚动：最新动态

**Q: 如何导出报表？**
A: 使用 PoiExcelUtil 工具类导出 Excel 格式。

**Q: 报表数据不准确怎么办？**
A: 检查以下几点：
- 数据源是否完整
- 统计时间范围是否正确
- 是否有权限查看所有数据
- 是否执行了数据更新任务

---

## 相关文件清单

### 核心代码
```
src/com/fanglin/report/
├── action/
│   ├── DecorationReportAction.java       - 装饰业绩报表
│   ├── SalesReportAction.java            - 销售业绩报表
│   ├── ConstructionReportAction.java     - 施工报表
│   ├── ApprovalReportAction.java         - 审批统计
│   ├── RankAction.java                   - 综合排名
│   ├── DecorationRankAction.java         - 装饰排名
│   ├── MaterialRankAction.java           - 主材排名
│   ├── QuotationRankAction.java          - 报价排名
│   └── UserReportAction.java             - 员工业绩
├── service/
│   ├── DecorationReportService.java      - 装饰业绩服务
│   ├── SalesReportService.java           - 销售业绩服务
│   ├── ConstructionReportService.java    - 施工报表服务
│   ├── ApprovalReportService.java        - 审批统计服务
│   ├── DecorationRankService.java        - 装饰排名服务
│   └── MaterialRankService.java          - 主材排名服务
├── dao/
│   ├── DecorationReportDao.java          - 装饰报表DAO
│   ├── SalesReportDao.java               - 销售报表DAO
│   ├── ConstructionReportDao.java        - 施工报表DAO
│   ├── DecorationRankDao.java            - 装饰排名DAO
│   └── MaterialDesignerRankDao.java      - 主材设计师排名DAO
├── po/
│   ├── DecorationReportPO.java           - 装饰施工报表实体
│   ├── DecorationAchievementPO.java      - 装饰业绩实体
│   ├── SalesAchievementsPO.java          - 销售业绩实体
│   ├── ConstructionReportPO.java         - 施工报表实体
│   ├── ApprovalAchievementPO.java        - 审批业绩实体
│   ├── DecorationRankPO.java             - 装饰排名实体
│   └── MaterialDesignerRankPO.java       - 主材排名实体
└── vo/
    ├── DecorationAchievementVO.java      - 装饰业绩VO
    ├── SalesAchievementsVO.java          - 销售业绩VO
    ├── ConstructionReportVO.java         - 施工报表VO
    ├── ApprovalAchievementVO.java        - 审批业绩VO
    ├── DecorationRankVO.java             - 装饰排名VO
    └── MaterialDesignerRankVO.java       - 主材排名VO
```

### 前端页面
```
WebContent/views/report/
├── decoration7achievement.html           - 装饰业绩统计页
├── decoration7construction.html          - 施工统计页
├── sales7Achievement.html                - 销售业绩页
├── decorationRank.html                   - 排名榜单页
├── largeScreen.html                      - 大屏看板
├── chart.html                            - 图表展示
└── user7Achievement.html                 - 员工业绩页
```

---

## 变更记录 (Changelog)

### 2025-12-01 18:30:02
- 初始化报表统计模块 AI 上下文文档
- 记录装饰、主材、施工、审批等多维度报表功能
- 梳理排名算法与统计逻辑
- 补充大屏看板与可视化说明
