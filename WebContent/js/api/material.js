
$.extend(api.index, {
    materialModelIndex: {url: "/views/material/materialModel.html"},

    materialBrandRightIndex: {url: "/views/material/materialBrandRight.html"},
    materialBalanceValueIndex: {url: "/views/material/materialBalanceValue.html"},
    materialSaleIndex: {url: "/views/material/materialSale.html"},
    decorationMaterialIndex: {url: "/views/material/decorationMaterial.html"},
    materialIndex: {url: "/views/material/material.html"},
    materialAddIndex: {url: "/views/material/materialAdd.html"},
    materialDetailIndex: {url: "/views/material/materialDetail.html"},
    materialCollectionIndex: {url: "/views/material/materialCollection.html"},
    materialRefundIndex: {url: "/views/material/materialRefund.html"},
    materialReceipt: {url: "/views/material/materialReceipt.html"},
    materialPreBalanceIndex: {url: "/views/material/materialPreBalance.html"},
    materialPreBalanceDetailIndex: {url: "/views/material/materialPreBalanceDetail.html"},
    materialPostBalanceIndex: {url: "/views/material/materialPostBalance.html"},
    materialPostBalanceDetailIndex: {url: "/views/material/materialPostBalanceDetail.html"},

});


$.extend(api, {material: {
    queryMaterialBrand: {url: "queryMaterialBrand.do"},
    queryMaterialBrandById: {url: "queryMaterialBrandById.do"},
    queryMaterialBrandForName: {url: "queryMaterialBrandForName.do"},
    queryMaterialBrandForNameAType: {url: "queryMaterialBrandForNameAType.do"},
    addMaterialBrand: {url: "addMaterialBrand.do"},
    updateMaterialBrand: {url: "updateMaterialBrand.do"},
    deleteMaterialBrandByIds: {url: "deleteMaterialBrandByIds.do"},

    queryMaterialBrandRight: {url: "queryMaterialBrandRight.do", demo: true},
    queryMaterialBrandRightForLogin: {url: "queryMaterialBrandRightForLogin.do", demo: true},
    queryMaterialBrandRightForBrand: {url: "queryMaterialBrandRightForLogin.do", demo: true},
    updateMaterialBrandRight: {url: "updateMaterialBrandRight.do"},

    pageMaterialModel: {url: "pageMaterialModel.do", demo: true},
    pageMaterialModelForAdvance:{url: "pageMaterialModelForAdvance.do", demo: true},
    queryMaterialModel: {url: "queryMaterialModel.do"},
    queryMaterialModelById: {url: "queryMaterialModelById.do", demo: true},
    queryMaterialModelByNo: {url: "queryMaterialModelByNo.do"},
    queryMaterialModelForAllByName: {url: "queryMaterialModelForAllByName.do", demo: true},
    queryMaterialModelForAllByNo: {url: "queryMaterialModelForAllByNo.do"},
    addMaterialModel: {url: "addMaterialModel.do"},
    updateMaterialModel: {url: "updateMaterialModel.do"},
    updateMaterialModelForStatus: {url: "updateMaterialModelForStatus.do"},
    updateMaterialModelForAdvance: {url: "updateMaterialModelForAdvance.do"},
    deleteMaterialModelByIds: {url: "deleteMaterialModelByIds.do"},

    pageMaterialBalance: {url: "pageMaterialBalance.do", demo: true},
    pageMaterialBalanceForVender: {url: "pageMaterialBalanceForVender.do", demo: true},
    pageMaterialForPreBalance: {url: "pageMaterialForPreBalance.do", demo: true},
    updateMaterialForPreBalancePT: {url: "updateMaterialForPreBalancePT.do"},
    updateMaterialBalanceForVBalance: {url: "updateMaterialBalanceForVBalance.do"},
    updateMaterialBalanceForBalance: {url: "updateMaterialBalanceForBalance.do"},
    passBalanceMaterial: {url: "passBalanceMaterial.do"},
    preBalanceMaterial: {url: "preBalanceMaterial.do"},
    vpostMaterialBalance: {url: "vpostMaterialBalance.do"},
    postMaterialBalance: {url: "postMaterialBalance.do"},

    pageMaterial: {url: "pageMaterial.do"},
    pageMaterialByUserId: {url: "pageMaterialByUserId.do", demo: true},//
    pageMaterialByOrderId: {url: "pageMaterialByOrderId.do"},
    pageMaterialByOrderIdADeptId: {url: "pageMaterialByOrderIdADeptId.do"},
    queryMaterialByMid: {url: "queryMaterialByMid.do", demo: true},
    queryMaterialByNo: {url: "queryMaterialByNo.do"},
    queryMaterialByNo : {url:"queryMaterialByNo.do",demo : true},
    addMaterial: {url: "addMaterial.do"},
    updateMaterialForCoupon: {url: "updateMaterialForCoupon.do"},
    updateMaterialForMaling: {url: "updateMaterialForMaling.do"},
    //deliverMaterialSubOrder: {url: "deliverMaterialSubOrder.do"},
    deleteMaterial: {url: "deleteMaterial.do"},

    queryMaterialItemByOrderId: {url: "queryMaterialItemByOrderId.do"},
    queryMaterialItemByMid: {url: "queryMaterialItemByMid.do", demo: true},
    queryMaterialItemForSaleByMiid: {url: "queryMaterialItemForSaleByMiid.do", demo: true},
    queryMaterialItemForNameByName: {url: "queryMaterialItemForNameByName.do", demo: true},
    queryMaterialItemForNameByNo: {url: "queryMaterialItemForNameByNo.do"},
    addMaterialItem: {url: "addMaterialItem.do"},
    updateMaterialItemForItem: {url: "updateMaterialItemForModel.do"},
    updateMaterialItemForPackage: {url: "updateMaterialItemForPackage.do"},
    updateMaterialItemForPrePT: {url: "updateMaterialItemForPrePT.do"},
    updateMaterialItemForPostPT: {url: "updateMaterialItemForPostPT.do"},
    changeMaterialItemForCaclType: {url: "changeMaterialItemForCaclType.do"},
    deleteMaterialItem: {url: "deleteMaterialItem.do"},

    queryMaterialRefundByMid: {url: "queryMaterialRefundByMid.do", demo: true},
    cancelMaterialRefundForModel: {url: "cancelMaterialRefundForModel.do"},
    cancelMaterialRefundForPackage: {url: "cancelMaterialRefundForPackage.do"},

    pageMaterialType: {url: "pageMaterialType.do"},
    queryMaterialType: {url: "queryMaterialType.do"},
    queryMaterialTypeById: {url: "queryMaterialTypeById.do"},
    addMaterialType: {url: "addMaterialType.do"},
    updateMaterialType: {url: "updateMaterialType.do"},
    deleteMaterialTypeByIds: {url: "deleteMaterialTypeByIds.do"},
    pageMaterialForAdvance: {url: "pageMaterialForAdvance.do"}//
}});

