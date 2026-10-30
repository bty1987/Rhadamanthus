/**
 * app/js/api/production.js —— production（生产）模块 API 定义
 *
 * 对齐旧 WebContent/js/api/production.js。
 * 子域：报价项/报价类型/工序组/工序/工序计划/生产单/报价单/生产计划/五金/外协/运输包装/图纸/功能权限。
 * 保留原 type/tranargs 元数据（金额精度转换用）。
 *
 * 引用的他模块接口（已在其它 api 文件注册）：
 *   api.data.queryMeasurementUnit / queryBrandByPinyin / queryBrandByBid
 *   api.personel.queryUserByPinyin / querySupplierByPinyin
 *   api.decoration.queryDecorationForCommonByOrderId
 *   api.sales.querySalesBySid / querySalesByNo
 *   api.material.queryMaterialByMid / queryMaterialByNo
 *   api.store.uploadOther（旧 api.common.uploadOther）
 *   api.right.queryProductionFunctionRightByName / updateProductionFunctionRight
 */

// ===== 页面路由 =====
$.extend(api.index, {
    productionIndex:           { url: 'views/production/production.html' },
    productionPictureIndex:    { url: 'views/production/productionPicture.html' },
    productionSalesIndex:      { url: 'views/production/production2bind.html' },
    puotationIndex:            { url: 'views/production/puotation.html' },
    createPutationIndex:       { url: 'views/production/puotation2create.html' },
    addPuotationItemIndex:     { url: 'views/production/puotationItem2add.html' },
    puotationItemIndex:        { url: 'views/production/puotationItem.html' },
    outsourceIndex:            { url: 'views/production/outsource.html' },
    pageOutsourceIndex:        { url: 'views/production/outsource4view.html' },
    outsourceItemIndex:        { url: 'views/production/outsourceItem.html' },
    hardwareIndex:             { url: 'views/production/hardware.html' },
    hardwareCreateIndex:       { url: 'views/production/hardware2create.html' },
    hardwareItemIndex:         { url: 'views/production/hardwareItem.html' },
    productionPlanIndex:       { url: 'views/production/productionPlan.html' },
    productionPlanCreateIndex: { url: 'views/production/productionPlan2Create.html' },
    productionPlanItemIndex:   { url: 'views/production/productionPlanItem.html' },
    productionPlanDetailIndex: { url: 'views/production/productionPlan4detail.html' }
});

// ===== 数据源（ds）：枚举常量（productionStatus/hardwareStatus/outsourceStatus/tranpackStatus/...）=====
$.extend(api.ds, {
    production: { url: 'ds/production.json', demo: true, cache: 'jsonproduction' }
});

$.extend(api, { production: {

    // ===== 报价项 quoteItem =====
    pageQuoteItem: {
        url: 'pageQuoteItem.do', type: 'query',
        tranargs: [{ result: 'paging-data', args: ['unitprice'] }]
    },
    queryQuoteItemByPinyin: {
        url: 'queryQuoteItemByPinyin.do', type: 'query',
        tranargs: [{ result: 'quoteItems', args: ['unitprice'] }]
    },
    addQuoteItem: {
        url: 'addQuoteItem.do', type: 'update',
        tranargs: { args: ['quoteItem.unitprice'] }
    },
    updateQuoteItem: {
        url: 'updateQuoteItem.do', type: 'update',
        tranargs: { args: ['quoteItem.unitprice'] }
    },
    updateQuoteItemForStatus: { url: 'updateQuoteItemForStatus.do' },

    // ===== 报价类型 quoteType =====
    pageQuoteType:            { url: 'pageQuoteType.do' },
    queryQuoteType:           { url: 'queryQuoteType.do' },
    addQuoteType:             { url: 'addQuoteType.do' },
    updateQuoteType:          { url: 'updateQuoteType.do' },
    updateQuoteTypeForStatus: { url: 'updateQuoteTypeForStatus.do' },

    // ===== 工序组（车间）workshop =====
    pageWorkshop:            { url: 'pageWorkshop.do' },
    queryWorkshop:           { url: 'queryWorkshop.do' },
    addWorkshop:             { url: 'addWorkshop.do' },
    updateWorkshop:          { url: 'updateWorkshop.do' },
    updateWorkshopForStatus: { url: 'updateWorkshopForStatus.do' },

    // ===== 工序计划 workplan =====
    pageWorkplan:            { url: 'pageWorkplan.do' },
    queryWorkplan:           { url: 'queryWorkplan.do' },
    queryWorkplanByWsid:     { url: 'queryWorkplanByWsid.do' },
    addWorkplan:             { url: 'addWorkplan.do' },
    updateWorkplan:          { url: 'updateWorkplan.do' },
    updateWorkplanForStatus: { url: 'updateWorkplanForStatus.do' },

    // ===== 工序 workflow =====
    pageWorkflow:            { url: 'pageWorkflow.do' },
    queryWorkflow:           { url: 'queryWorkflow.do' },
    addWorkflow:             { url: 'addWorkflow.do' },
    updateWorkflow:          { url: 'updateWorkflow.do' },
    updateWorkflowForStatus: { url: 'updateWorkflowForStatus.do' },
    queryWorkflowPlanByWfid: { url: 'queryWorkflowPlanByWfid.do' },
    queryWorkflowPlanByWpid: { url: 'queryWorkflowPlanByWpid.do' },
    updateWorkflowPlan:      { url: 'updateWorkflowPlan.do' },

    // ===== 生产单 production =====
    pageProduction: {
        url: 'pageProduction.do', type: 'query',
        tranargs: [{ result: 'paging-data', args: ['total', 'timeLimit'] }]
    },
    addProduction: {
        url: 'addProduction.do', type: 'update',
        tranargs: { args: ['production.total', 'production.timeLimit'] }
    },
    upholdProduction: {
        url: 'upholdProduction.do', type: 'update',
        tranargs: { args: ['production.total', 'production.timeLimit'] }
    },
    queryProductionByPno:  { url: 'queryProductionByPno.do' },
    updateProduction:      { url: 'updateProduction.do' },
    updateProductionForAdvance: {
        url: 'updateProductionForAdvance.do', type: 'update',
        tranargs: { args: ['production.timeLimit'] }
    },
    designProduction:    { url: 'designProduction.do' },
    splitProduction:     { url: 'splitProduction.do' },
    instoreProduction:   { url: 'instoreProduction.do' },
    planProduction:      { url: 'planProduction.do' },
    mountProduction:     { url: 'mountProduction.do' },
    finishProduction:    { url: 'finishProduction.do' },
    terminalProduction:  { url: 'terminalProduction.do' },

    // ===== 报价单 puotation =====
    addPuotation: {
        url: 'addPuotation.do', type: 'update',
        tranargs: { args: ['puotationItems.height', 'puotationItems.num', 'puotationItems.thick', 'puotationItems.total', 'puotationItems.unitPrice', 'puotationItems.width', 'puotation.discount', 'puotation.total'] }
    },
    addPuotationItem: {
        url: 'addPuotationItem.do', type: 'update',
        tranargs: { args: ['puotationItem.height', 'puotationItem.num', 'puotationItem.thick', 'puotationItem.total', 'puotationItem.unitPrice', 'puotationItem.width'] }
    },
    queryPuotationItemByQid: {
        url: 'queryPuotationItemByQid.do', type: 'query',
        tranargs: [{ result: 'puotationItems', args: ['height', 'num', 'thick', 'total', 'unitPrice', 'width'] }]
    },
    queryPuotationByPid: {
        url: 'queryPuotationByPid.do', type: 'query',
        tranargs: [{ result: 'puotations', args: ['discount', 'total'] }]
    },
    updatePuotation:            { url: 'updatePuotation.do' },
    updatePuotationForAdvance: {
        url: 'updatePuotationForAdvance.do', type: 'update',
        tranargs: { args: ['puotation.discount', 'puotation.total'] }
    },
    tranProduction:             { url: 'tranProduction.do' },
    updatePuotationForDefault:  { url: 'updatePuotationForDefault.do' },
    deletePuotation:            { url: 'deletePuotation.do' },
    deletePuotationItem:        { url: 'deletePuotationItem.do' },

    // ===== 生产计划 productionPlan =====
    pageProductionPlan: {
        url: 'pageProductionPlan.do', type: 'query',
        tranargs: [{ result: 'paging-data', args: ['timeLimit'] }]
    },
    pageProductionPlanItemByPpid: {
        url: 'pageProductionPlanItemByPpid.do', type: 'query',
        tranargs: [{ result: 'paging-data', args: ['height', 'width', 'thick', 'unitprice', 'num', 'total'] }]
    },
    queryProductionPlanByPid: {
        url: 'queryProductionPlanByPid.do', type: 'query',
        tranargs: [{ result: 'productionPlans', args: ['timeLimit'] }]
    },
    queryProductionPlanByNo:   { url: 'queryProductionPlanByNo.do' },
    addProductionPlan: {
        url: 'addProductionPlan.do', type: 'update',
        tranargs: { args: ['productionPlan.timeLimit'] }
    },
    addProductionPlanItem: {
        url: 'addProductionPlanItem.do', type: 'update',
        tranargs: { args: ['productionPlanItem.height', 'productionPlanItem.width', 'productionPlanItem.thick', 'productionPlanItem.unitprice', 'productionPlanItem.num', 'productionPlanItem.total'] }
    },
    addProductionWorkPlan:           { url: 'addProductionWorkPlan.do' },
    updateProductionPlan:            { url: 'updateProductionPlan.do' },
    updateProductionPlanForStatus:   { url: 'updateProductionPlanForStatus.do' },
    deleteProductionPlanItem:        { url: 'deleteProductionPlanItem.do' },
    finishProductionPlan:            { url: 'finishProductionPlan.do' },
    finishProductionWorkPlan:        { url: 'finishProductionWorkPlan.do' },
    deleteProductionWorkPlan:        { url: 'deleteProductionWorkPlan.do' },

    // ===== 生产计划工序/流程 productionWorkPlan / productionWorkFlow =====
    queryProductionWorkPlanByPpid:    { url: 'queryProductionWorkPlanByPpid.do' },
    queryProductionWorkFlowByPwpid:   { url: 'queryProductionWorkFlowByPwpid.do' },
    queryProductionWorkFlowByPwpidAWfid: { url: 'queryProductionWorkFlowByPwpidAWfid.do' },
    operateProductionWorkFlow:        { url: 'operateProductionWorkFlow.do' },
    queryProductionUserWorkFlowByPwfid:  { url: 'queryProductionUserWorkFlowByPwfid.do' },
    queryProductionUserWorkFlowsByPwfid: { url: 'queryProductionUserWorkFlowsByPwfid.do' },

    // ===== 五金 hardware =====
    pageHardware: {
        url: 'pageHardware.do', type: 'query',
        tranargs: [{ result: 'paging-data', args: ['timeLimit'] }]
    },
    queryHardwareByPid: {
        url: 'queryHardwareByPid.do', type: 'query',
        tranargs: [{ result: 'hardwares', args: ['timeLimit'] }]
    },
    addHardware: {
        url: 'addHardware.do', type: 'update',
        tranargs: { args: ['hardware.timeLimit'] }
    },
    updateHardware:       { url: 'updateHardware.do' },
    instoreHardware:      { url: 'instoreHardware.do' },
    finishHardware:       { url: 'finishHardware.do' },
    deleteHardware:       { url: 'deleteHardware.do' },
    pageHardwareItemByHid: {
        url: 'pageHardwareItemByHid.do', type: 'query',
        tranargs: [{ result: 'paging-data', args: ['num', 'total', 'unitprice'] }]
    },
    addHardwareItem: {
        url: 'addHardwareItem.do', type: 'update',
        tranargs: { args: ['hardwareItems.num', 'hardwareItems.total', 'hardwareItems.unitprice'] }
    },
    deleteHardwareItem: { url: 'deleteHardwareItem.do' },

    // ===== 外协 outsource =====
    pageOutsource: {
        url: 'pageOutsource.do', type: 'query',
        tranargs: [{ result: 'paging-data', args: ['timeLimit'] }]
    },
    pageOutsourceItemByOid: {
        url: 'pageOutsourceItemByOid.do', type: 'query',
        tranargs: [{ result: 'paging-data', args: ['width', 'height', 'thick', 'unitprice', 'num', 'total'] }]
    },
    addOutsource: {
        url: 'addOutsource.do', type: 'update',
        tranargs: { args: ['outsource.timeLimit'] }
    },
    addOutsourceItem: {
        url: 'addOutsourceItem.do', type: 'update',
        tranargs: { args: ['outsourceItems.width', 'outsourceItems.height', 'outsourceItems.thick', 'outsourceItems.unitprice', 'outsourceItems.num', 'outsourceItems.total'] }
    },
    queryOutsourceByPid: {
        url: 'queryOutsourceByPid.do', type: 'query',
        tranargs: [{ result: 'outsources', args: ['timeLimit'] }]
    },
    pageOutsourceForSupplier: {
        url: 'pageOutsourceForSupplier.do', type: 'query',
        tranargs: [{ result: 'paging-data', args: ['timeLimit'] }]
    },
    updateOutsource: {
        url: 'updateOutsource.do', type: 'update',
        tranargs: { args: ['outsource.timeLimit'] }
    },
    receiptOutsource:  { url: 'receiptOutsource.do' },
    confirmOutsource:  { url: 'confirmOutsource.do' },
    finishOutsource:   { url: 'finishOutsource.do' },
    deleteOutsource:   { url: 'deleteOutsource.do' },
    deleteOutsourceItem: { url: 'deleteOutsourceItem.do' },

    // ===== 运输包装 tranpack =====
    pageTranpack:           { url: 'pageTranpack.do' },
    queryTranpackByPid:     { url: 'queryTranpackByPid.do' },
    packTranpackForOutsource: { url: 'packTranpackForOutsource.do' },
    packTranpackForHardware:  { url: 'packTranpackForHardware.do' },
    packTranpackForPlan:      { url: 'packTranpackForPlan.do' },
    instoreTranpack:   { url: 'instoreTranpack.do' },
    planTranPack:      { url: 'planTranPack.do' },
    tranTranpack:      { url: 'tranTranpack.do' },
    mountTranpack:     { url: 'mountTranpack.do' },
    completeTranpack:  { url: 'completeTranpack.do' },
    lossTranpack:      { url: 'lossTranpack.do' },

    // ===== 生产图纸 productionPicture =====
    queryProductionPictureByPid: { url: 'queryProductionPictureByPid.do' },
    addProductionPicture:        { url: 'addProductionPicture.do' },
    deleteProductionPicture:     { url: 'deleteProductionPicture.do' },

    // ===== 生产销售绑定 productionSales =====
    queryProductionSalesByPid: { url: 'queryProductionSalesByPid.do' },
    bindProductionSales:       { url: 'bindProductionSales.do' },

    // ===== 生产功能权限 productionFunction =====
    queryProductionFunction:         { url: 'queryProductionFunction.do' },
    queryProductionFunctionByName:   { url: 'queryProductionFunctionByName.do' }
}});

// ===== 功能权限 right（仅注册生产功能权限所需子集，他模块如需可另行扩展）=====
// 旧 WebContent/js/api/right.js 内的 productionFunctionRight 相关接口。
$.extend(api, { right: {
    queryProductionFunctionRightByName: { url: 'queryProductionFunctionRightByName.do' },
    updateProductionFunctionRight:      { url: 'updateProductionFunctionRight.do' }
}});

// ===== sales（销售单）补丁：仅注册生产绑定流程所需子集，避免 api.sales 引用悬空 =====
// 旧 WebContent/js/api/sales.js 内的 querySalesBySid / querySalesByNo。
api.sales = api.sales || {};
$.extend(api.sales, {
    querySalesBySid: { url: 'querySalesBySid.do' },
    querySalesByNo:  { url: 'querySalesByNo.do' }
});

// ===== decoration 补丁：仅追加生产流程所需的 queryDecorationForCommonByOrderId =====
api.decoration = api.decoration || {};
$.extend(api.decoration, {
    queryDecorationForCommonByOrderId: { url: 'queryDecorationForCommonByOrderId.do' }
});
