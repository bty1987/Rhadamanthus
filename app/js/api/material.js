/**
 * app/js/api/material.js —— material（主材）模块 API 定义
 *
 * 主材销售/结算/活动子域：品牌/型号/销售单/退款/收据/活动/结算。
 * 保留原 type/tranargs/server/demo 元数据（金额精度转换用）。
 */
$.extend(api.index, {
    materialModelIndex: { url: '/views/material/materialModel.html' },
    materialBrandRightIndex: { url: '/views/material/materialBrandRight.html' },
    materialBalanceValueIndex: { url: '/views/material/materialBalanceValue.html' },
    materialSaleIndex: { url: '/views/material/materialSale.html' },
    decorationMaterialIndex: { url: '/views/material/decorationMaterial.html' },
    materialIndex: { url: '/views/material/material.html' },
    materialAddIndex: { url: '/views/material/materialAdd.html' },
    materialDetailIndex: { url: '/views/material/materialDetail.html' },
    materialCollectionIndex: { url: '/views/material/materialCollection.html' },
    materialRefundIndex: { url: '/views/material/materialRefund.html' },
    materialReceipt: { url: '/views/material/materialReceipt.html' },
    materialPreBalanceIndex: { url: '/views/material/materialPreBalance.html' },
    materialPreBalanceDetailIndex: { url: '/views/material/materialPreBalanceDetail.html' },
    materialPostBalanceIndex: { url: '/views/material/materialPostBalance.html' },
    materialPostBalanceDetailIndex: { url: '/views/material/materialPostBalanceDetail.html' },
    materialActivityIndex: { url: '/views/material/materialActivity.html' }
});

$.extend(api, { material: {

    // ===== 品牌 materialBrand =====
    queryMaterialBrand:             { url: 'queryMaterialBrand.do' },
    queryMaterialBrandById:         { url: 'queryMaterialBrandById.do' },
    queryMaterialBrandForName:      { url: 'queryMaterialBrandForName.do' },
    queryMaterialBrandForNameAType: { url: 'queryMaterialBrandForNameAType.do' },
    addMaterialBrand:               { url: 'addMaterialBrand.do' },
    updateMaterialBrand:            { url: 'updateMaterialBrand.do' },
    deleteMaterialBrandByIds:       { url: 'deleteMaterialBrandByIds.do' },

    // ===== 品牌权限 materialBrandRight =====
    queryMaterialBrandRight:          { url: 'queryMaterialBrandRight.do', demo: true },
    queryMaterialBrandRightForLogin:  { url: 'queryMaterialBrandRightForLogin.do', demo: true },
    queryMaterialBrandRightForBrand:  { url: 'queryMaterialBrandRightForLogin.do', demo: true },
    updateMaterialBrandRight:         { url: 'updateMaterialBrandRight.do' },

    // ===== 型号 materialModel =====
    pageMaterialModel: {
        url: 'pageMaterialModel.do', demo: true, type: 'query',
        tranargs: [{ result: 'paging-data', args: ['materialUnitPrice', 'materialPurchasePrice', 'discount', 'point', 'base'] }]
    },
    pageMaterialModelForAdvance: {
        url: 'pageMaterialModelForAdvance.do', demo: true, type: 'query',
        tranargs: [{ result: 'paging-data', args: ['materialUnitPrice', 'materialPurchasePrice', 'discount', 'point', 'base'] }]
    },
    queryMaterialModel: { url: 'queryMaterialModel.do' },
    queryMaterialModelById: {
        url: 'queryMaterialModelById.do', demo: true, type: 'query',
        tranargs: [{ result: 'materialModel', args: ['materialUnitPrice', 'materialPurchasePrice', 'discount', 'point', 'base'] }]
    },
    queryMaterialModelByNo:          { url: 'queryMaterialModelByNo.do' },
    queryMaterialModelForAllByName:  { url: 'queryMaterialModelForAllByName.do', demo: true },
    queryMaterialModelForAllByNo:    { url: 'queryMaterialModelForAllByNo.do' },
    addMaterialModel: {
        url: 'addMaterialModel.do', type: 'update',
        tranargs: { args: ['materialModel.materialUnitPrice', 'materialModel.materialPurchasePrice', 'materialModel.discount'] }
    },
    updateMaterialModel: {
        url: 'updateMaterialModel.do', type: 'update',
        tranargs: { args: ['materialModel.materialUnitPrice', 'materialModel.materialPurchasePrice', 'materialModel.discount'] }
    },
    updateMaterialModelForStatus: { url: 'updateMaterialModelForStatus.do' },
    updateMaterialModelForAdvance: {
        url: 'updateMaterialModelForAdvance.do', type: 'update',
        tranargs: { args: ['materialModel.point', 'materialModel.base'] }
    },
    deleteMaterialModelByIds: { url: 'deleteMaterialModelByIds.do' },

    // ===== 结算 materialBalance =====
    pageMaterialBalance: {
        url: 'pageMaterialBalance.do', demo: true, type: 'query',
        tranargs: [
            { result: 'paging-data', args: ['balance', 'difference', 'vbalance', 'post', 'total'] },
            { result: 'paging-data-material', args: ['depositPayment', 'fullPayment', 'total', 'distotal', 'maling', 'venderMaling', 'coupon'] }
        ]
    },
    pageMaterialBalanceForVender:  { url: 'pageMaterialBalanceForVender.do', demo: true },
    pageMaterialForPreBalance: {
        url: 'pageMaterialForPreBalance.do', demo: true, type: 'query',
        tranargs: [{ result: 'paging-data', args: ['balance', 'difference', 'vbalance', 'post', 'total', 'coupon', 'distotal', 'fullPayment'] }]
    },
    updateMaterialBalanceForVBalance: {
        url: 'updateMaterialBalanceForVBalance.do', type: 'update',
        tranargs: { args: ['materialBalance.vbalance'] }
    },
    updateMaterialBalanceForBalance: {
        url: 'updateMaterialBalanceForBalance.do', type: 'update',
        tranargs: { args: ['materialBalance.balance'] }
    },
    passBalanceMaterial:  { url: 'passBalanceMaterial.do' },
    preBalanceMaterial:   { url: 'preBalanceMaterial.do' },
    vpostMaterialBalance: { url: 'vpostMaterialBalance.do' },
    postMaterialBalance:  { url: 'postMaterialBalance.do' },

    // ===== 销售单 material =====
    pageMaterial: { url: 'pageMaterial.do' },
    pageMaterialByUserId: {
        url: 'pageMaterialByUserId.do', demo: true, type: 'query',
        tranargs: [{ result: 'paging-data', args: ['depositPayment', 'fullPayment', 'total', 'distotal', 'maling', 'venderMaling', 'coupon'] }]
    },
    pageMaterialByOrderId:        { url: 'pageMaterialByOrderId.do' },
    pageMaterialByOrderIdADeptId: { url: 'pageMaterialByOrderIdADeptId.do' },
    queryMaterialByMid: {
        url: 'queryMaterialByMid.do', demo: true, type: 'query',
        tranargs: [{ result: 'material', args: ['depositPayment', 'fullPayment', 'total', 'distotal', 'maling', 'venderMaling', 'coupon'] }]
    },
    queryMaterialByNo: { url: 'queryMaterialByNo.do', demo: true },
    addMaterial: {
        url: 'addMaterial.do', type: 'update',
        tranargs: { args: ['materialItems.unitPrice', 'materialItems.purchasePrice', 'materialItems.salePrice', 'materialItems.price', 'materialItems.discount', 'materialItems.postDiscount', 'materialItems.num', 'materialItems.total', 'materialItems.prePoint'] }
    },
    updateMaterialForCoupon: {
        url: 'updateMaterialForCoupon.do', type: 'update',
        tranargs: { args: ['material.coupon'] }
    },
    updateMaterialForMaling: {
        url: 'updateMaterialForMaling.do', type: 'update',
        tranargs: { args: ['material.maling', 'material.venderMaling'] }
    },
    deleteMaterial: { url: 'deleteMaterial.do' },

    // ===== 销售明细 materialItem =====
    queryMaterialItemByOrderId: { url: 'queryMaterialItemByOrderId.do' },
    queryMaterialItemByMid: {
        url: 'queryMaterialItemByMid.do', demo: true, type: 'query',
        tranargs: [{ result: 'materialItems', args: ['unitPrice', 'purchasePrice', 'salePrice', 'price', 'discount', 'postDiscount', 'num', 'total', 'prePoint', 'postPoint', 'rawPoint'] }]
    },
    queryMaterialItemByMiid: {
        url: 'queryMaterialItemByMiid.do', demo: true, type: 'query',
        tranargs: [{ result: 'materialItem', args: ['unitPrice', 'purchasePrice', 'salePrice', 'price', 'discount', 'postDiscount', 'num', 'total', 'prePoint', 'postPoint', 'rawPoint'] }]
    },
    queryMaterialItemForNameByName: {
        url: 'queryMaterialItemForNameByName.do', demo: true, type: 'query',
        tranargs: [{ result: 'materialItems', args: ['unitPrice', 'purchasePrice', 'salePrice', 'price', 'discount', 'postDiscount', 'num', 'total', 'prePoint', 'postPoint', 'rawPoint'] }]
    },
    queryMaterialItemForNameByNo: { url: 'queryMaterialItemForNameByNo.do' },
    addMaterialItem: {
        url: 'addMaterialItem.do', type: 'update',
        tranargs: { args: ['materialItems.unitPrice', 'materialItems.purchasePrice', 'materialItems.salePrice', 'materialItems.price', 'materialItems.discount', 'materialItems.postDiscount', 'materialItems.num', 'materialItems.total', 'materialItems.prePoint'] }
    },
    updateMaterialItemForItem: {
        url: 'updateMaterialItemForModel.do', type: 'update',
        tranargs: { args: ['materialItem.num', 'materialItem.total'] }
    },
    updateMaterialItemForPackage: {
        url: 'updateMaterialItemForPackage.do', type: 'update',
        tranargs: { args: ['materialItems.num', 'materialItems.total'] }
    },
    updateMaterialItemForPrePT: {
        url: 'updateMaterialItemForPrePT.do', type: 'update',
        tranargs: { args: ['materialItem.prePoint'] }
    },
    updateMaterialItemForPostPT:    { url: 'updateMaterialItemForPostPT.do' },
    changeMaterialItemForCaclType:  { url: 'changeMaterialItemForCaclType.do' },
    deleteMaterialItem:             { url: 'deleteMaterialItem.do' },

    // ===== 退款 materialRefund =====
    queryMaterialRefundByMid: {
        url: 'queryMaterialRefundByMid.do', demo: true, type: 'query',
        tranargs: [{ result: 'materialRefunds', args: ['unitPrice', 'purchasePrice', 'salePrice', 'price', 'discount', 'postDiscount', 'num', 'total', 'prePoint'] }]
    },
    cancelMaterialRefundForModel:   { url: 'cancelMaterialRefundForModel.do' },
    cancelMaterialRefundForPackage: { url: 'cancelMaterialRefundForPackage.do' },

    // ===== 品类 materialType =====
    pageMaterialType:        { url: 'pageMaterialType.do' },
    queryMaterialType:       { url: 'queryMaterialType.do' },
    queryMaterialTypeById:   { url: 'queryMaterialTypeById.do' },
    addMaterialType:         { url: 'addMaterialType.do' },
    updateMaterialType:      { url: 'updateMaterialType.do' },
    deleteMaterialTypeByIds: { url: 'deleteMaterialTypeByIds.do' },
    pageMaterialForAdvance: {
        url: 'pageMaterialForAdvance.do', type: 'query',
        tranargs: [{ result: 'paging-data', args: ['depositPayment', 'fullPayment', 'total', 'distotal', 'maling', 'venderMaling', 'coupon'] }]
    },

    // ===== 活动 materialActivity =====
    queryMaterialActivityItem: {
        url: 'queryMaterialActivityItem.do', type: 'query',
        tranargs: [{ result: 'materialActivityItems', args: ['money', 'num'] }]
    },
    addMaterialActivityItem: {
        url: 'addMaterialActivityItem.do', type: 'update',
        tranargs: { args: ['materialActivityItems.money', 'materialActivityItems.num'] }
    },
    queryMaterialActivity:    { url: 'queryMaterialActivity.do' },
    updateMaterialForActivity:{ url: 'updateMaterialForActivity.do' },
    abateMaterialActivityItem:   { url: 'abateMaterialActivityItem.do' },
    receiveMaterialActivityItem: { url: 'receiveMaterialActivityItem.do' },
    deliveMaterialActivityItem:  { url: 'deliveMaterialActivityItem.do' },
    unrefundMaterialActivityItem:{ url: 'unrefundMaterialActivityItem.do' },
    upgradeMaterialActivityItem: { url: 'upgradeMaterialActivityItem.do' },
    expendMaterialActivityItem:  { url: 'expendMaterialActivityItem.do' },
    refundMaterialActivityItem:  { url: 'refundMaterialActivityItem.do' }
}});
