/**
 * app/js/api/manifest.js —— manifest（货单/仓储）模块 API 定义
 *
 * 对齐旧 WebContent/js/api/inventory.js。
 * ⚠️ 注意：旧前端的 manifest 接口定义在 api.inventory 命名空间（不是 api.manifest）。
 *    为保持业务兼容，本文件注册 api.inventory（与旧前端一致）。
 *    manifest 页面一律引用 api.inventory.*，个别页也引用 api.data.* / api.communion.*。
 */

// ===== 页面路由（货单/辅料/采购/外辅等弹窗页）=====
$.extend(api.index, {
    manifestViewIndex:        { url: 'views/manifest/manifest4view.html' },
    manifestPrintIndex:       { url: 'views/manifest/manifest2print.html' },
    accessoriesPrintIndex:    { url: 'views/manifest/accessories2print.html' },
    occessoriesPrintIndex:    { url: 'views/manifest/occessories2print.html' },
    purchaseBalanceIndex:     { url: 'views/manifest/purchaseBalance.html' },
    purchaseBalance2balanceIndex: { url: 'views/manifest/purchaseBalance2balance.html' }
});

// ===== 货单/仓储接口（注册到 api.inventory，与旧前端命名一致）=====
// 数据源 ds：枚举（manifestType/manifestStatus/createManifestTypes/accessoriesStatus/
//   purchaseStatus/purchaseBalanceStatus/occessoriesStatus/...）。
$.extend(api.ds, {
    manifest: { url: 'ds/manifest.json', demo: true, cache: 'jsonmanifest' }
});

$.extend(api, { inventory: {

    // ===== 盘点记录 =====
    pageCheckList: { url: 'pageCheckList.do' },

    // ===== 仓库 storehouse =====
    pageStorehouse:            { url: 'pageStorehouse.do' },
    queryStorehouse:           { url: 'queryStorehouse.do' },
    queryStorehouseByUId:      { url: 'queryStorehouseByUId.do' },
    queryStorehouseForSelf:    { url: 'queryStorehouseForSelf.do' },
    addStorehouse:             { url: 'addStorehouse.do' },
    updateStorehouseForStatus: { url: 'updateStorehouseForStatus.do' },

    // 仓库权限（storehouseUser）
    queryStorehouseUserByUserId: { url: 'queryStorehouseUserByUserId.do' },
    updateStorehouseUser:        { url: 'updateStorehouseUser.do' },

    // 商品库存 goodsStorehouseStock
    pageGoodsStorehouseStock:       { url: 'pageGoodsStorehouseStock.do', type: 'query', tranargs: [{ result: 'paging-data', args: ['num'] }, { result: 'paging-data-goods', args: ['purchase', 'selling', 'pieceNum'] }] },
    queryGoodsStorehouseStockByGid: { url: 'queryGoodsStorehouseStockByGid.do', type: 'query', tranargs: [{ result: '', args: ['nums'] }] },
    queryGoodsStorehouseStockByShidAGid: { url: 'queryGoodsStorehouseStockByShidAGid.do', type: 'query', tranargs: [{ result: 'goodsStorehouseStock', args: ['num'] }] },
    plusGoodsStorehouseStock:  { url: 'plusGoodsStorehouseStock.do', type: 'update', tranargs: { args: ['goodsStorehouseStock.num'] } },
    loseGoodsStorehouseStock:  { url: 'loseGoodsStorehouseStock.do', type: 'update', tranargs: { args: ['goodsStorehouseStock.num'] } },
    makeGoodsStorehouseStock:  { url: 'makeGoodsStorehouseStock.do' },
    mergePackage:              { url: 'mergePackage.do', type: 'update', tranargs: { args: ['goodsStorehouseStock.num'] } },
    splitPackage:              { url: 'splitPackage.do', type: 'update', tranargs: { args: ['goodsStorehouseStock.num'] } },

    // 商品（库存页用到的单价更新）
    updateGoods: { url: 'updateGoods.do', type: 'update', tranargs: { args: ['goods.pieceNum', 'goods.purchase', 'goods.selling'] } },
    addSupplier: { url: 'addSupplier.do' },
    updateSupplierForStatus: { url: 'updateSupplierForStatus.do' },

    // ===== 货单模板 manifestTemplate =====
    pageManifestTemplate:            { url: 'pageManifestTemplate.do' },
    queryManifestTemplate:           { url: 'queryManifestTemplate.do' },
    queryManifestTemplateByMtid:     { url: 'queryManifestTemplateByMtid.do' },
    queryManifestTemplateItemByMtid: { url: 'queryManifestTemplateItemByMtid.do', type: 'query', tranargs: [{ result: 'manifestTemplateItems-goods', args: ['purchase', 'selling', 'pieceNum'] }] },
    queryManifestItemByMtId:         { url: 'queryManifestItemByMtId.do' },
    queryManifestItemBySiids:        { url: 'queryManifestItemBySiids.do' },
    addManifestTemplate:             { url: 'addManifestTemplate.do' },
    addManifestTemplateItem:         { url: 'addManifestTemplateItem.do' },
    updateManifestTemplate:          { url: 'updateManifestTemplate.do' },
    updateManifestTemplateForStatus: { url: 'updateManifestTemplateForStatus.do' },
    deleteManifestTemplate:          { url: 'deleteManifestTemplate.do' },
    deleteManifestTemplateItem:      { url: 'deleteManifestTemplateItem.do' },

    // ===== 货单 manifest + 货单项 manifestItem =====
    pageManifest:          { url: 'pageManifest.do' },
    queryManifestByMid:    { url: 'queryManifestByMid.do' },
    queryManifestItemByMid: { url: 'queryManifestItemByMid.do', type: 'query', tranargs: [{ result: 'manifestItems', args: ['inprice', 'outprice', 'num', 'surplus'] }, { result: 'manifestItems-goods', args: ['purchase', 'selling', 'pieceNum'] }] },
    addManifestForCG: { url: 'addManifestForCG.do', type: 'update', tranargs: { args: ['manifestItems.num', 'manifestItems.inprice', 'manifestItems.outprice', 'manifestItems.surplus'] } },
    addManifestForXG: { url: 'addManifestForXG.do', type: 'update', tranargs: { args: ['manifestItems.num', 'manifestItems.inprice', 'manifestItems.outprice', 'manifestItems.surplus'] } },
    addManifestForCR: { url: 'addManifestForCR.do', type: 'update', tranargs: { args: ['manifestItems.num', 'manifestItems.inprice', 'manifestItems.outprice', 'manifestItems.surplus'] } },
    addManifestForXB: { url: 'addManifestForXB.do', type: 'update', tranargs: { args: ['manifestItems.num', 'manifestItems.inprice', 'manifestItems.outprice', 'manifestItems.surplus'] } },
    addManifestForDB: { url: 'addManifestForDB.do' },
    addManifestForPU: { url: 'addManifestForPU.do', type: 'update', tranargs: { args: ['purchaseItems.inprice', 'purchaseItems.num', 'purchaseItems.surplus'] } },
    addManifestForAS: { url: 'addManifestForAS.do', type: 'update', tranargs: { args: ['accessoriesItems.num', 'accessoriesItems.outprice'] } },
    addManifestForAR: { url: 'addManifestForAR.do', type: 'update', tranargs: { args: ['accessoriesItems.num', 'accessoriesItems.outprice'] } },
    addManifestItem:  { url: 'addManifestItem.do' },
    updateManifest:   { url: 'updateManifest.do' },
    updateManifestItem: { url: 'updateManifestItem.do' },
    confirmManifest:    { url: 'confirmManifest.do' },
    deleteManifestItem: { url: 'deleteManifestItem.do' },

    queryStorehouseStock:  { url: 'queryStorehouseStock.do' },
    queryInventoryDrawing: { url: 'queryInventoryDrawing.do' },
    addInventoryDrawing:   { url: 'addInventoryDrawing.do' },
    deleteInventoryDrawing:{ url: 'deleteInventoryDrawing.do' },
    queryPurchaseAmount:   { url: 'queryPurchaseAmount.do' },

    // ===== 采购 purchase =====
    pagePurchase:                 { url: 'pagePurchase.do' },
    addPurchase:                  { url: 'addPurchase.do', type: 'update', tranargs: { args: ['purchaseItems.inprice', 'purchaseItems.num', 'purchaseItems.surplus'] } },
    addPurchaseItem:              { url: 'addPurchaseItem.do', type: 'update', tranargs: { args: ['purchaseItem.inprice', 'purchaseItem.num', 'purchaseItem.surplus'] } },
    queryPurchaseItemByPid:       { url: 'queryPurchaseItemByPid.do', type: 'query', tranargs: [{ result: 'purchaseItems', args: ['inprice', 'num', 'surplus'] }, { result: 'purchaseItems-goods', args: ['purchase', 'selling', 'pieceNum'] }] },
    queryPurchaseItemByPids:      { url: 'queryPurchaseItemByPids.do' },
    queryPurchaseByPid:           { url: 'queryPurchaseByPid.do' },
    queryPurchaseBySid:           { url: 'queryPurchaseBySid.do' },
    updatePurchase:               { url: 'updatePurchase.do' },
    updatePurchaseForStatus:      { url: 'updatePurchaseForStatus.do' },
    updatePurchaseForBalanceStatus: { url: 'updatePurchaseForBalanceStatus.do' },
    updatePurchaseItem:           { url: 'updatePurchaseItem.do', type: 'update', tranargs: { args: ['purchaseItem.num', 'purchaseItem.inprice'] } },
    deletePurchaseItem:           { url: 'deletePurchaseItem.do' },

    // 采购结算 purchaseBalance
    queryPurchaseBalanceByPid:      { url: 'queryPurchaseBalanceByPid.do', type: 'query', tranargs: [{ result: 'purchaseBalances', args: ['balance'] }] },
    addPurchaseBalance:             { url: 'addPurchaseBalance.do', type: 'update', tranargs: { args: ['purchaseBalance.balance'] } },
    updatePurchaseBalance:          { url: 'updatePurchaseBalance.do', type: 'update', tranargs: { args: ['purchaseBalance.balance'] } },
    updatePurchaseBalanceForStatus: { url: 'updatePurchaseBalanceForStatus.do' },

    // ===== 辅料 accessories =====
    pageAccessories:           { url: 'pageAccessories.do', type: 'query', tranargs: [{ result: 'paging-data', args: ['total'] }] },
    queryAccessoriesByOrderId: { url: 'queryAccessoriesByOrderId.do', type: 'query', tranargs: [{ result: 'accessoriess', args: ['total'] }] },
    queryAccessoriesByAid:     { url: 'queryAccessoriesByAid.do', type: 'query', tranargs: [{ result: 'accessoriess', args: ['total'] }] },
    addAccessories:            { url: 'addAccessories.do', type: 'update', tranargs: { args: ['accessories.total', 'accessoriesItems.selling', 'accessoriesItems.num', 'accessoriesItems.surplus', 'accessoriesItems.total', 'accessoriesItems.normnum', 'accessoriesItems.normunit', 'accessoriesItems.storenum', 'accessoriesItems.storeunit'] } },
    refundAccessories:  { url: 'refundAccessories.do' },
    preoutAccessories:  { url: 'preoutAccessories.do' },
    auditAccessories:   { url: 'auditAccessories.do' },
    cancelAccessories:  { url: 'cancelAccessories.do' },
    refuseAccessories:  { url: 'refuseAccessories.do' },
    deliveAccessories:  { url: 'deliveAccessories.do' },
    updateAccessoriesForPrint: { url: 'updateAccessoriesForPrint.do', intercept: true },
    queryAccessoriesItemByOrderId: { url: 'queryAccessoriesItemByOrderId.do', type: 'query', tranargs: [{ result: 'accessoriesItems', args: ['selling', 'num', 'surplus', 'normnum', 'storenum'] }, { result: 'accessoriesItems-goods', args: ['purchase', 'selling', 'pieceNum'] }] },
    queryAccessoriesItemByAid:     { url: 'queryAccessoriesItemByAid.do', type: 'query', tranargs: [{ result: 'accessoriesItems', args: ['selling', 'num', 'surplus', 'normnum', 'storenum'] }, { result: 'accessoriesItems-goods', args: ['purchase', 'selling', 'pieceNum'] }] },
    queryAccessoriesItemByAids:    { url: 'queryAccessoriesItemByAids.do', type: 'query', tranargs: [{ result: 'accessoriesItems', args: ['selling', 'num', 'surplus', 'normnum', 'storenum'] }, { result: 'accessoriesItems-goods', args: ['purchase', 'selling', 'pieceNum'] }] },
    checkAccessoriesItem:  { url: 'checkAccessoriesItem.do', type: 'update', tranargs: { args: ['accessoriesItem.num', 'accessoriesItem.normnum', 'accessoriesItem.storenum'] } },
    addAccessoriesItem:    { url: 'addAccessoriesItem.do', type: 'update', tranargs: { args: ['accessoriesItem.selling', 'accessoriesItem.num', 'accessoriesItem.surplus', 'accessoriesItem.total', 'accessoriesItem.normnum', 'accessoriesItem.storenum'] } },
    updateAccessoriesItem: { url: 'updateAccessoriesItem.do', type: 'update', tranargs: { args: ['accessoriesItem.selling', 'accessoriesItem.num', 'accessoriesItem.surplus', 'accessoriesItem.total', 'accessoriesItem.normnum', 'accessoriesItem.storenum'] } },
    deleteAccessoriesItem: { url: 'deleteAccessoriesItem.do' },
    queryManifestByAid:    { url: 'queryManifestByAid.do' },

    // 货单查询（按类型）
    queryManifestForPUByPids: { url: 'queryManifestForPUByPids.do' },
    queryManifestForXGBySid:  { url: 'queryManifestForXGBySid.do' },

    // ===== 外辅 occessories =====
    pageOccessories:           { url: 'pageOccessories.do', type: 'query', tranargs: [{ result: 'paging-data', args: ['rate', 'charge', 'total', 'rbalance', 'vbalance', 'rcharge'] }] },
    pageOccessoriesForSupplier:{ url: 'pageOccessoriesForSupplier.do', type: 'query', tranargs: [{ result: 'paging-data', args: ['rate', 'charge', 'total', 'rbalance', 'vbalance', 'rcharge'] }] },
    queryOccessoriesByOrderId: { url: 'queryOccessoriesByOrderId.do', type: 'query', tranargs: [{ result: 'occessoriess', args: ['rate', 'charge', 'total', 'rbalance', 'vbalance', 'rcharge'] }] },
    queryOccessoriesByOid:     { url: 'queryOccessoriesByOid.do', type: 'query', tranargs: [{ result: 'occessories', args: ['rate', 'charge', 'total', 'rbalance', 'vbalance', 'rcharge'] }] },
    addOccessories:            { url: 'addOccessories.do', type: 'update', tranargs: { args: ['occessoriesItems.num', 'occessoriesItems.goods.selling', 'occessoriesItems.sennum', 'occessoriesItems.recnum', 'occessoriesItems.rbalance', 'occessoriesItems.vbalance', 'occessoriesItems.charge', 'occessoriesItems.occessoriesCharges.price', 'occessoriesItems.occessoriesCharges.surplus', 'occessoriesItems.occessoriesCharges.num'] } },
    batchOccessoriesCharge:    { url: 'batchOccessoriesCharge.do', type: 'update', tranargs: { args: ['occessoriesCharges.price', 'occessoriesCharges.surplus'] } },
    queryOccessoriesCharge:    { url: 'queryOccessoriesCharge.do', type: 'query', tranargs: [{ result: 'occessoriesCharges', args: ['price', 'surplus', 'num'] }] },
    bindOccessories:           { url: 'bindOccessories.do' },
    deliveOccessories:         { url: 'deliveOccessories.do', type: 'update', tranargs: { args: ['occessoriesItems.sennum'] } },
    receiveOccessories:        { url: 'receiveOccessories.do', type: 'update', tranargs: { args: ['occessoriesItems.recnum'] } },
    updateOccessoriesForBalance: { url: 'updateOccessoriesForBalance.do', type: 'update', tranargs: { args: ['occessories.vbalance', 'occessories.rcharge'] } },
    balanceOccessories:        { url: 'balanceOccessories.do' },
    batchBalanceOccessories:   { url: 'batchBalanceOccessories.do' },
    rejectOccessories:         { url: 'rejectOccessories.do' },
    finishOccessories:         { url: 'finishOccessories.do' },
    rateOccessories:           { url: 'rateOccessories.do', type: 'update', tranargs: { args: ['occessories.rate'] } },
    updateOccessoriesForRemark:{ url: 'updateOccessoriesForRemark.do' },
    cancelOccessories:         { url: 'cancelOccessories.do' },
    deleteOccessories:         { url: 'deleteOccessories.do' },

    queryOccessoriesItemByOid: { url: 'queryOccessoriesItemByOid.do', type: 'query', tranargs: [{ result: 'occessoriesItems', args: ['num', 'sennum', 'recnum', 'rbalance', 'vbalance', 'charge'] }, { result: 'occessoriesItems-goods', args: ['purchase', 'selling', 'pieceNum'] }] },
    amountOccessoriesItem:     { url: 'amountOccessoriesItem.do', type: 'query', tranargs: [{ result: 'occessoriesItem', args: ['purchase', 'selling', 'pieceNum', 'amount'] }, { result: 'occessories', args: ['amount'] }] },
    addOccessoriesItem:        { url: 'addOccessoriesItem.do', type: 'update', tranargs: { args: ['occessoriesItem.num', 'occessoriesItems.sennum', 'occessoriesItems.recnum', 'occessoriesItems.rbalance', 'occessoriesItems.vbalance', 'occessoriesItems.charge'] } },
    updateOccessoriesItem:     { url: 'updateOccessoriesItem.do', type: 'update', tranargs: { args: ['occessoriesItem.num', 'occessoriesItem.sennum', 'occessoriesItem.recnum', 'occessoriesItem.rbalance', 'occessoriesItem.vbalance', 'occessoriesItems.charge'] } },
    deleteOccessoriesItem:     { url: 'deleteOccessoriesItem.do' },

    // 外辅成本 occessoriesCost
    queryOccessoriesCost:  { url: 'queryOccessoriesCost.do', type: 'query', tranargs: [{ result: 'occessoriesCosts', args: ['initPrice', 'price', 'cost'] }] },
    addOccessoriesCost:    { url: 'addOccessoriesCost.do', type: 'update', tranargs: { args: ['occessoriesCost.price', 'occessoriesCost.cost'] } },
    updateOccessoriesCost: { url: 'updateOccessoriesCost.do', type: 'update', tranargs: { args: ['occessoriesCost.price', 'occessoriesCost.cost'] } },
    deleteOccessoriesCost: { url: 'deleteOccessoriesCost.do' }
}});
