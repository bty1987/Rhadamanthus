/**
 * app/js/api/communion.js —— communion（公共服务）模块 API 定义
 *
 * 对齐旧 WebContent/js/api/communion.js。
 * 包含：部门(department)、部门类型、服务节点、客户账户、任务、货品池(goodsPool/colorPool/formatPool/pricePool)等。
 * 这些接口被 personnel/data/system/manifest 等多个模块引用。
 */
$.extend(api.index, {
    designRegionIndex:    { url: 'views/personnel/department.html?type=designRegion' },
    businessRegionIndex:  { url: 'views/personnel/department.html?type=businessRegion' },
    designDeptIndex:      { url: 'views/personnel/department.html?type=designDept' },
    businessDeptIndex:    { url: 'views/personnel/department.html?type=businessDept' },
    materialDeptIndex:    { url: 'views/personnel/department.html?type=materialDept' },
    engineeringDeptIndex: { url: 'views/personnel/department.html?type=engineeringDept' },
    dutyDeptIndex:        { url: 'views/personnel/department.html?type=dutyDept' }
});

$.extend(api, { communion: {

    // ===== 部门 department =====
    pageDepartment:            { url: 'pageDepartment.do', demo: true },
    queryDepartment:           { url: 'queryDepartment.do', demo: true },
    queryDepartmentByDid:      { url: 'queryDepartmentByDid.do' },
    queryDepartmentByNo:       { url: 'queryDepartmentByNo.do' },
    queryDepartmentByName:     { url: 'queryDepartmentByName.do' },
    addDepartment:             { url: 'addDepartment.do', server: 'communion' },
    updateDepartment:          { url: 'updateDepartment.do', server: 'communion' },
    updateDepartmentForStatus: { url: 'updateDepartmentForStatus.do', server: 'communion' },

    // ===== 部门类型 departmentType =====
    addDepartmentType:         { url: 'addDepartmentType.do', server: 'communion' },
    queryDepartmentType:       { url: 'queryDepartmentType.do' },
    queryDepartmentByDtid:     { url: 'queryDepartmentByDtid.do' },
    pageDepartmentType:        { url: 'pageDepartmentType.do', demo: true },

    // ===== 数据图纸 dataDrawing =====
    queryDataDrawing:  { url: 'queryDataDrawing.do' },
    addDataDrawing:    { url: 'addDataDrawing.do', server: 'communion', intercept: true },
    deleteDataDrawing: { url: 'deleteDataDrawing.do', server: 'communion' },

    // ===== 品牌供应商/库管 brandSupplier/brandInstorer =====
    queryBrandSupplier:  { url: 'queryBrandSupplier.do' },
    addBrandSupplier:    { url: 'addBrandSupplier.do' },
    deleteBrandSupplier: { url: 'deleteBrandSupplier.do' },
    queryBrandInstorer:  { url: 'queryBrandInstorer.do' },
    addBrandInstorer:    { url: 'addBrandInstorer.do' },
    deleteBrandInstorer: { url: 'deleteBrandInstorer.do' },

    // ===== 服务节点 serviceNode =====
    pageServiceNode:            { url: 'pageServiceNode.do' },
    addServiceNode:             { url: 'addServiceNode.do' },
    updateServiceNode:          { url: 'updateServiceNode.do' },
    updateServiceNodeForStatus: { url: 'updateServiceNodeForStatus.do' },

    // ===== 客户账户(银行) =====
    queryCustomerAccount:       { url: 'queryCustomerAccount.do', server: 'communion' },
    queryDefaultCustomerAccount:{ url: 'queryDefaultCustomerAccount.do', server: 'communion' },
    addCustomerAccount:         { url: 'addCustomerAccount.do', server: 'communion' },
    updateCustomerAccount:      { url: 'updateCustomerAccount.do', server: 'communion' },
    deleteCustomerAccount:      { url: 'deleteCustomerAccount.do', server: 'communion' },
    setDefaultCustomerAccount:  { url: 'setDefaultCustomerAccount.do', server: 'communion' },

    // ===== 任务 task =====
    pageTask:            { url: 'pageTask.do' },
    queryTask:           { url: 'queryTask.do' },
    queryTaskByRid:      { url: 'queryTaskByRid.do' },
    queryTaskForSelf:    { url: 'queryTaskForSelf.do' },
    addTask:             { url: 'addTask.do', server: 'communion' },
    updateTask:          { url: 'updateTask.do', server: 'communion' },
    updateTaskForStatus: { url: 'updateTaskForStatus.do', server: 'communion' },
    updateTaskForIsShow: { url: 'updateTaskForIsShow.do', server: 'communion' },
    updateRoleTask:      { url: 'updateRoleTask.do', server: 'communion', intercept: true },
    deleteRoleTask:      { url: 'deleteRoleTask.do', server: 'communion', intercept: true },
    syncRoleTask:        { url: 'syncRoleTask.do', server: 'communion' },

    // ===== 任务参数 taskParam =====
    pageTaskParam:            { url: 'pageTaskParam.do' },
    queryTaskParam:           { url: 'queryTaskParam.do' },
    addTaskParam:             { url: 'addTaskParam.do', server: 'communion' },
    updateTaskParam:          { url: 'updateTaskParam.do', server: 'communion' },
    updateTaskParamForStatus: { url: 'updateTaskParamForStatus.do', server: 'communion' },
    deleteTaskParam:          { url: 'deleteTaskParam.do', server: 'communion' },

    // ===== 客户电话查询记录 customerRecord =====
    pageCustomerRecord:   { url: 'pageCustomerRecord.do', server: 'communion' },
    queryCustomerRecord:  { url: 'queryCustomerRecord.do' },
    addCustomerRecord:    { url: 'addCustomerRecord.do' },

    // ===== 货品池 goodsPool（金额字段 tranargs）=====
    pageGoodsPool:          { url: 'pageGoodsPool.do', type: 'query', tranargs: [{ result: 'paging-data', args: ['purchase','selling','confine','pieceNum'] }] },
    queryGoodsPool:         { url: 'queryGoodsPool.do', type: 'query', tranargs: [{ result: 'goodsPools', args: ['purchase','selling','confine','pieceNum'] }] },
    queryGoodsPoolByNo:     { url: 'queryGoodsPoolByNo.do', type: 'query', tranargs: [{ result: 'goodsPools', args: ['purchase','selling','confine','pieceNum'] }] },
    queryGoodsPoolByName:   { url: 'queryGoodsPoolByName.do', type: 'query', tranargs: [{ result: 'goodsPools', args: ['purchase','selling','confine','pieceNum'] }] },
    queryGoodsPoolByAtid:   { url: 'queryGoodsPoolByAtid.do', type: 'query', tranargs: [{ result: 'goodsPools', args: ['purchase','selling','confine','pieceNum'] }] },
    queryGoodsPoolByBarcode:{ url: 'queryGoodsPoolByBarcode.do', type: 'query', tranargs: [{ result: 'goodsPools', args: ['purchase','selling','confine','pieceNum'] }] },
    queryGoodsPoolByGpid:   { url: 'queryGoodsByGpid.do', type: 'query', tranargs: [{ result: 'goodsPool', args: ['purchase','selling','confine','pieceNum'] }] },
    addGoodsPool:           { url: 'addGoodsPool.do', type: 'update', tranargs: { args: ['goodsPool.purchase','goodsPool.selling','goodsPool.confine','goodsPool.pieceNum'] }, server: 'communion' },
    batchAddFromPool:       { url: 'batchAddFromPool.do', server: 'communion' },
    updateGoodsPool:        { url: 'updateGoodsPool.do', type: 'update', tranargs: { args: ['goodsPool.purchase','goodsPool.selling','goodsPool.confine','goodsPool.pieceNum'] }, server: 'communion' },
    updateGoodsPoolForStatus:{ url: 'updateGoodsPoolForStatus.do', server: 'communion' },

    // ===== 颜色池 colorPool =====
    pageColorPool:              { url: 'pageColorPool.do', type: 'query', tranargs: [{ result: 'paging-data-goodPools', args: ['purchase','selling','confine','pieceNum'] }] },
    queryColorPoolByGpid:       { url: 'queryColorPoolByGpid.do', type: 'query', tranargs: [{ result: 'goodPools', args: ['purchase','selling','confine','pieceNum'] }] },
    queryColorPoolForEnableByGpid: { url: 'queryColorPoolForEnableByGpid.do', type: 'query', tranargs: [{ result: 'goodPools', args: ['purchase','selling','confine','pieceNum'] }] },
    addColorPool:               { url: 'addColorPool.do', type: 'update', tranargs: { args: ['goodPools.purchase','goodPools.selling','goodPools.confine','goodPools.pieceNum'] }, server: 'communion' },
    updateColorPoolForStatus:   { url: 'updateColorPoolForStatus.do', server: 'communion' },

    // ===== 规格池 formatPool =====
    pageFormatPool:              { url: 'pageFormatPool.do', type: 'query', tranargs: [{ result: 'paging-data-goodsPool', args: ['purchase','selling','confine','pieceNum'] }] },
    queryFormatPoolByGpid:       { url: 'queryFormatPoolByGpid.do', type: 'query', tranargs: [{ result: 'goodPools', args: ['purchase','selling','confine','pieceNum'] }] },
    queryFormatPoolForEnableByGpid: { url: 'queryFormatPoolForEnableByGpid.do', type: 'query', tranargs: [{ result: 'goodPools', args: ['purchase','selling','confine','pieceNum'] }] },
    addFormatPool:               { url: 'addFormatPool.do', type: 'update', tranargs: { args: ['goodPools.purchase','goodPools.selling','goodPools.confide','goodPools.pieceNum'] }, server: 'communion' },
    updateFormatPoolForStatus:   { url: 'updateFormatPoolForStatus.do', server: 'communion' },

    // ===== 价格池 pricePool =====
    pagePricePool:          { url: 'pagePricePool.do', type: 'query', tranargs: [{ result: 'paging-data', args: ['purchase','selling','confine','cvalue'] }, { result: 'paging-data-goods', args: ['purchase','selling','confine','pieceNum'] }] },
    queryPricePoolByGpid:   { url: 'queryPricePoolByGpid.do', type: 'query', tranargs: [{ result: 'pricePools', args: ['purchase','selling','confine','cvalue'] }, { result: 'pricePools-goodsPool', args: ['purchase','selling','confine','pieceNum'] }] },
    queryPricePoolByPpid:   { url: 'queryPricePoolByPpid.do', type: 'query', tranargs: [{ result: 'pricePool', args: ['purchase','selling','confine','cvalue'] }, { result: 'pricePool-goodsPool', args: ['purchase','selling','confine','pieceNum'] }] },
    addPricePool:           { url: 'addPricePool.do', type: 'update', tranargs: { args: ['pricePool.purchase','pricePool.selling','pricePool.confine','pricePool.cvalue'] }, server: 'communion' },
    updatePricePoolForStatus: { url: 'updatePricePoolForStatus.do', server: 'communion' },
    deletePricePool:        { url: 'deletePricePool.do', server: 'communion' }
}});
