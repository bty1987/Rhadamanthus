/**
 * app/js/api/report.js —— report（报表）模块 API 定义
 *
 * 子域：
 *   - 排行榜（装修/设计师/部门/分区，量尺/业务/主材/总业绩）
 *   - 主材品类/品牌/部门/设计师业绩（Highcharts 旧版，已迁 echarts）
 *   - 大屏订单计数（reportCityCount）
 *   - 7 系列：装修/销售/用户/施工/审批 业绩 + 装修施工
 *   - D1 营销获客（客源转化 metric_customer_monthly）
 *   - D2 装修销售转化（metric_decoration_daily）
 *   - D3 装修履约（施工 metric_construction_monthly + 报价 metric_quotation_monthly）
 *   - D4 主材经营（metric_sales_monthly）
 *   - D5 财务收款（metric_payment_daily）
 *   - D6 仓储物流（metric_inventory_monthly）
 *   - 增减项滚动排名（rankAddReduce）
 *
 * 保留原 type/tranargs/demo 元数据（金额精度转换用）。与旧 WebContent/js/api/report.js 等价。
 */

// ============ 页面路由（菜单 mid 对应这里） ============
$.extend(api.index, {
    rankIndex:                     { url: 'views/report/rank.html' },
    decorationRankIndex:           { url: 'views/report/decorationRank.html' },
    materialDepartmentReportIndex: { url: 'views/report/materialDepartmentReport.html' },
    materialDesignReportIndex:     { url: 'views/report/materialDesignReport.html' },
    materialMerchantReportIndex:   { url: 'views/report/materialMerchantReport.html' },
    orderCountIndex:               { url: 'views/report/orderCount.html' },
    approval7AchievementIndex:     { url: 'views/report/approval7Achievement.html' },
    construction7AchievementIndex: { url: 'views/report/construction7Achievement.html' },
    decoration7achievementIndex:   { url: 'views/report/decoration7achievement.html' },
    decoration7constructionIndex:  { url: 'views/report/decoration7construction.html' },
    sales7AchievementIndex:        { url: 'views/report/sales7Achievement.html' },
    user7AchievementIndex:         { url: 'views/report/user7Achievement.html' },
    customerReportIndex:           { url: 'views/report/customerReport.html' },
    decorationFunnelReportIndex:   { url: 'views/report/decorationFunnelReport.html' },
    paymentReportIndex:            { url: 'views/report/paymentReport.html' },
    fulfillmentReportIndex:        { url: 'views/report/fulfillmentReport.html' },
    materialSalesReportIndex:      { url: 'views/report/materialSalesReport.html' },
    inventoryReportIndex:          { url: 'views/report/inventoryReport.html' },
    apiIndex:                      { url: 'views/report/api.html' },
    chainpageIndex:                { url: 'views/report/chainpage.html' },
    chartIndex:                    { url: 'views/report/chart.html' },
    statisIndex:                   { url: 'views/report/statis.html' },
    userIndex:                     { url: 'views/report/user.html' },
    monitorIndex:                  { url: 'views/report/monitor.html' },
    largeScreenIndex:              { url: 'views/report/largeScreen.html' },
    decorationLargeScreenIndex:    { url: 'views/report/decorationLargeScreen.html' },
    scrolling4addreduceIndex:      { url: 'views/report/scrolling4addreduce.html' },
    approvalReportIndex:           { url: 'views/report/approvalReport.html' },
    salaryReportIndex:             { url: 'views/report/salaryReport.html' },
    orderPanoramaIndex:            { url: 'views/report/orderPanorama.html' },
    fundsReportIndex:              { url: 'views/report/fundsReport.html' }
});

$.extend(api, { report: {

    // ==================== 排行榜 ====================
    pagePutline:                          { url: 'pagePutline.do' },
    queryRankForPlace:                    { url: 'queryRankForPlace.do', demo: true },
    queryDecorationRank:                  { url: 'queryDecorationRank.do', demo: true, type: 'query', tranargs: [{ result: 'ranks', args: ['rank', 'sachi', 'tachi'] }] },
    queryDecorationDepartmentRank:        { url: 'queryDecorationDepartmentRank.do', demo: true, type: 'query', tranargs: [{ result: 'ranks', args: ['rank', 'sachi', 'tachi'] }] },
    queryDecorationRegionRank:            { url: 'queryDecorationRegionRank.do', demo: true, type: 'query', tranargs: [{ result: 'ranks', args: ['rank', 'sachi', 'tachi'] }] },
    decorationRank:                       { url: 'decorationRank.do', demo: true, type: 'query', tranargs: [{ result: 'ranks', args: ['rank', 'sachi', 'tachi'] }] },
    decorationDepartmentRank:             { url: 'decorationDepartmentRank.do', demo: true, type: 'query', tranargs: [{ result: 'ranks', args: ['rank', 'sachi', 'tachi'] }] },
    decorationRegionRank:                 { url: 'decorationRegionRank.do', demo: true, type: 'query', tranargs: [{ result: 'ranks', args: ['rank', 'sachi', 'tachi'] }] },

    queryMaterialDesignerRank:            { url: 'queryMaterialDesignerRank.do' },
    queryMaterialDesignerDepartmentRank:  { url: 'queryMaterialDesignerDepartmentRank.do' },
    queryMaterialDesignerRegionRank:      { url: 'queryMaterialDesignerRegionRank.do' },
    materialDesignerRank:                 { url: 'materialDesignerRank.do', demo: true },
    materialDesignerDepartmentRank:       { url: 'materialDesignerDepartmentRank.do', demo: true },
    materialDesignerRegionRank:           { url: 'materialDesignerRegionRank.do', demo: true },

    // ==================== 主材/设计师业绩（旧 Highcharts） ====================
    materialTypeReport:                   { url: 'materialTypeReport.do', demo: true },
    materialBrandReport:                  { url: 'materialBrandReport.do', demo: true },
    materialDepartmentReport:             { url: 'materialDepartmentReport.do', demo: true },
    designerReport:                       { url: 'designerReport.do' },
    designerDeportmentReport:             { url: 'designerDeportmentReport.do' },
    designerRegionReport:                 { url: 'designerRegionReport.do' },
    countMaterialType:                    { url: 'countMaterialType.do', demo: true },
    countMaterialBrand:                   { url: 'countMaterialBrand.do', demo: true },
    countDesigner:                        { url: 'countDesigner.do', demo: true },
    countDesignerDepartment:              { url: 'countDesignerDepartment.do', demo: true },
    countDesignerRegion:                  { url: 'countDesignerRegion.do', demo: true },

    // ==================== 大屏订单计数 ====================
    reportCityCount:                      { url: 'reportCityCount.do', demo: true },

    // ==================== 7 系列业绩 ====================
    queryDecoration7Construction:         { url: 'queryDecoration7Construction.do', demo: true },
    queryDecoration7Achievement:          { url: 'queryDecoration7Achievement.do', type: 'query', demo: true, tranargs: [{ result: 'paging-data', args: ['cs0', 'cs1', 'cs2', 'cs3', 'cs4', 'cs5', 'cs6', 'cs7'] }] },
    querySales7Achievement:               { url: 'querySales7Achievement.do', type: 'query', demo: true, tranargs: [{ result: 'paging-data', args: ['cs0', 'cs1', 'cs2', 'cs3', 'cs4', 'cs5', 'cs6', 'cs7'] }] },
    queryUser7Achievement:                { url: 'queryUser7Achievement.do', type: 'query', demo: true },
    queryConstruction7Achievement:        { url: 'queryConstruction7Achievement.do' },
    queryApproval7Achievement:            { url: 'queryApproval7Achievement.do' },
    updateDecoration7Construction:        { url: 'updateDecoration7Construction.do', demo: true },
    updateDecoration7Achievement:         { url: 'updateDecoration7Achievement.do', demo: true },
    rankAddReduce:                        { url: 'rankAddReduce.do', type: 'query', tranargs: [{ result: 'addReduceRankVOs', args: ['total'] }] },

    // ==================== D2 装修销售转化（metric_decoration_daily） ====================
    queryDecorationFunnel:                { url: 'queryDecorationFunnel.do', demo: true },
    queryDecorationStatusDist:            { url: 'queryDecorationStatusDist.do', demo: true },
    queryDecorationSignTrend:             { url: 'queryDecorationSignTrend.do', demo: true },
    queryDecorationTypeDist:              { url: 'queryDecorationTypeDist.do', demo: true },
    refreshDecorationMetric:              { url: 'refreshDecorationMetric.do', demo: true },

    // ==================== D5 财务收款（metric_payment_daily） ====================
    queryPaymentTrend:                    { url: 'queryPaymentTrend.do', demo: true },
    queryPaymentTypeDist:                 { url: 'queryPaymentTypeDist.do', demo: true },
    refreshPaymentMetric:                 { url: 'refreshPaymentMetric.do', demo: true },

    // ==================== D3 装修履约：施工（metric_construction_monthly） ====================
    queryConstructionStartFinishTrend:    { url: 'queryConstructionStartFinishTrend.do', demo: true },
    queryConstructionPeriodTrend:         { url: 'queryConstructionPeriodTrend.do', demo: true },
    queryConstructionOverdueDist:         { url: 'queryConstructionOverdueDist.do', demo: true },
    refreshConstructionMetric:            { url: 'refreshConstructionMetric.do', demo: true },

    // ==================== D3 装修履约：报价偏差（metric_quotation_monthly） ====================
    queryQuotationSignTrend:              { url: 'queryQuotationSignTrend.do', demo: true },
    refreshQuotationMetric:               { url: 'refreshQuotationMetric.do', demo: true },

    // ==================== D4 主材经营（metric_sales_monthly） ====================
    querySalesTrend:                      { url: 'querySalesTrend.do', demo: true },
    querySalesCategoryDist:               { url: 'querySalesCategoryDist.do', demo: true },
    refreshSalesMetric:                   { url: 'refreshSalesMetric.do', demo: true },

    // ==================== D1 营销获客：客源转化（metric_customer_monthly） ====================
    queryCustomerFunnelTrend:             { url: 'queryCustomerFunnelTrend.do', demo: true },
    queryCustomerSourceDist:              { url: 'queryCustomerSourceDist.do', demo: true },
    queryCustomerConvertTrend:            { url: 'queryCustomerConvertTrend.do', demo: true },
    refreshCustomerMetric:                { url: 'refreshCustomerMetric.do', demo: true },

    // ==================== D6 仓储物流（metric_inventory_monthly） ====================
    queryInventoryInOutTrend:             { url: 'queryInventoryInOutTrend.do', demo: true },
    queryInventoryTypeDist:               { url: 'queryInventoryTypeDist.do', demo: true },

    // ==================== D9 运营管理：审批效率（metric_approval_monthly） ====================
    queryApprovalTrend:                    { url: 'queryApprovalTrend.do', demo: true },
    queryApprovalTypeDist:                 { url: 'queryApprovalTypeDist.do', demo: true },
    refreshApprovalMetric:                 { url: 'refreshApprovalMetric.do', demo: true },

    // ==================== D8 人力薪酬（metric_salary_monthly） ====================
    querySalaryMetricTrend:                { url: 'querySalaryMetricTrend.do', demo: true },
    querySalaryWorkerTypeDist:             { url: 'querySalaryWorkerTypeDist.do', demo: true },
    refreshSalaryMetric:                   { url: 'refreshSalaryMetric.do', demo: true },

    // ==================== 阶段四·跨模块联动：一户全景穿透（实时查询，非汇总表） ====================
    queryOrderPanorama:                    { url: 'queryOrderPanorama.do', demo: true },

    // ==================== 阶段四·跨模块联动：资金闭环（metric_funds_monthly） ====================
    queryFundsTrend:                       { url: 'queryFundsTrend.do', demo: true },
    refreshFundsMetric:                    { url: 'refreshFundsMetric.do', demo: true }

}});
