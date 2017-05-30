
$.extend(api.index, {
    querySalesIndex : {
        url : "views/sales/sales.html"
    },
    salesItemDetialIndex : {
        url : "views/sales/salesItemDetial.html"
    },
    addSalesItemsIndex : {
        url : "views/sales/addSalesItems.html"
    },
    refundsItemDetialIndex : {
        url : "views/sales/refundsItemDetial.html"
    },
    salesCollectionIndex : {
        url : "views/sales/salesCollection.html"
    },
});

$.extend(api.ds, {
    voucherInfo : {url : "ds/voucherInfo.json", demo : true},
    materialInfo : {url : "ds/materialInfo.json", demo : true},
    couponType : {url : "ds/couponType.json"},
    approvalType : {url : "ds/approvalType.json"},
});

$.extend(api, {inventory: {
    pageCheckList: {
        url: "pageCheckList.do"
    },

    pageStorehouse: {
        url: "pageStorehouse.do"
    },
    queryStorehouse: {
        url: "queryStorehouse.do"
    },
    queryStorehouseByUId: {
        url: "queryStorehouseByUId.do"
    },
    queryStorehouseForSelf: {
        url: "queryStorehouseForSelf.do"
    },
    queryStorehouseByCode: {
        url: "queryStorehouseByCode.do"
    },
    addStorehouse: {
        url: "addStorehouse.do"
    },
    updateStorehouse: {
        url: "updateStorehouse.do"
    },
    updateStorehouseForStatus: {
        url: "updateStorehouseForStatus.do"
    },

    queryStorehouseUserByUserId: {
        url: "queryStorehouseUserByUserId.do"
    },
    updateStorehouseUser: {
        url: "updateStorehouseUser.do"
    },

    pageGoods: {
        url: "pageGoods.do"
    },
    queryGoods: {
        url: "queryGoods.do"
    },
    queryGoodsByNo: {
        url: "queryGoodsByNo.do"
    },
    queryGoodsByName: {
        url: "queryGoodsByName.do"
    },
    queryGoodsByBarcode: {
        url: "queryGoodsByBarcode.do"
    },
    queryGoodsByAtid: {
        url: "queryGoodsByAtid.do"
    },
    queryGoodsByGId: {
        url: "queryGoodsByGId.do"
    },
    queryGoodsForPackage: {
        url: "queryGoodsForPackage.do"
    },
    addGoods: {
        url: "addGoods.do"
    },
    updateGoods: {
        url: "updateGoods.do"
    },
    updateGoodsForStatus: {
        url: "updateGoodsForStatus.do"
    },
    bindGoodsForPackage:{
        url:"bindGoodsForPackage.do"
    },
    deleteGoodsForPackage:{
        url:"deleteGoodsForPackage.do"
    },
    queryColorByGid: {
        url: "queryColorByGid.do"
    },
    queryColorForEnableByGid: {
        url: "queryColorForEnableByGid.do"
    },
    addColor: {
        url: "addColor.do"
    },
    updateColorForStatus: {
        url: "updateColorForStatus.do"
    },

    queryFormatByGid: {
        url: "queryFormatByGid.do"
    },
    queryFormatForEnableByGid: {
        url: "queryFormatForEnableByGid.do"
    },
    addFormat: {
        url: "addFormat.do"
    },
    updateFormatForStatus: {
        url: "updateFormatForStatus.do"
    },

    queryPriceByGid: {
        url: "queryPriceByGid.do"
    },
    addPrice: {
        url: "addPrice.do"
    },
    deletePrice: {
        url: "deletePrice.do"
    },

    pageGoodsStorehouseStock: {
        url: "pageGoodsStorehouseStock.do"
    },
    checkGoodsStorehouseStock: {
        url: "checkGoodsStorehouseStock.do"
    },

    pageManifestTemplate: {
        url: "pageManifestTemplate.do"
    },
    queryManifestTemplate: {
        url: "queryManifestTemplate.do"
    },
    queryManifestTemplateByMtId: {
        url: "queryManifestTemplateByMtId.do"
    },
    queryManifestTemplateItemByMtId: {
        url: "queryManifestTemplateItemByMtId.do"
    },
    queryManifestItemByMtId: {
        url: "queryManifestItemByMtId.do"
    },
    addManifestTemplate: {
        url: "addManifestTemplate.do"
    },
    addManifestTemplateItem: {
        url: "addManifestTemplateItem.do"
    },
    updateManifestTemplate: {
        url: "updateManifestTemplate.do"
    },
    updateManifestTemplateForStatus: {
        url: "updateManifestTemplateForStatus.do"
    },
    deleteManifestTemplate: {
        url: "deleteManifestTemplate.do"
    },
    deleteManifestTemplateItem: {
        url: "deleteManifestTemplateItem.do"
    },

    pageManifest: {
        url: "pageManifest.do"
    },
    queryManifestByMId: {
        url: "queryManifestByMId.do"
    },
    queryManifestItemByMId: {
        url: "queryManifestItemByMId.do"
    },
    addManifestForCG: {
        url: "addManifestForCG.do"
    },
    addManifestForXG: {
        url: "addManifestForXG.do"
    },
    addManifestForCR: {
        url: "addManifestForCR.do"
    },
    addManifestForXB: {
        url: "addManifestForXB.do"
    },
    addManifestForDB: {
        url: "addManifestForDB.do"
    },
    addManifestForPU: {
        url: "addManifestForPU.do"
    },
    addManifestForAS: {
        url: "addManifestForAS.do"
    },
    addManifestItemForCGAndXG: {
        url: "addManifestItemForCGAndXG.do"
    },
    updateManifest: {
        url: "updateManifest.do"
    },
    updateManifestItem: {
        url: "updateManifestItem.do"
    },
    updateManifestForStatus: {
        url: "updateManifestForStatus.do"
    },
    confirmManifest: {
        url: "confirmManifest.do"
    },
    deleteManifest: {
        url: "deleteManifest.do"
    },
    deleteManifestItem: {
        url: "deleteManifestItem.do"
    },

    queryStorehouseStock: {
        url: "queryStorehouseStock.do"
    },
    queryPurchaseAmount: {
        url: "queryPurchaseAmount.do"
    },

    pagePurchase: {
        url: "pagePurchase.do"
    },
    addPurchase: {
        url: "addPurchase.do"
    },
    addPurchaseItem: {
        url: "addPurchaseItem.do"
    },
    queryPurchaseItemByPid: {
        url: "queryPurchaseItemByPid.do"
    },
    queryPurchaseByPid: {
        url: "queryPurchaseByPid.do"
    },
    updatePurchase: {
        url: "updatePurchase.do"
    },
    updatePurchaseItem: {
        url: "updatePurchaseItem.do"
    },
    deletePurchaseItem: {
        url: "deletePurchaseItem.do"
    },
    updatePurchaseItemSurplus: {
        url: "updatePurchaseItemSurplus.do"
    },
    queryPurchaseItemByPids: {
        url: "queryPurchaseItemByPids.do"
    },

    pageAssisType: {
        url: "pageAssisType.do"
    },
    queryAssisType: {
        url: "queryAssisType.do"
    },
    queryAssisTypeByWtid: {
        url: "queryAssisTypeByWtid.do"
    },
    updateAssisTypeForStatus: {
        url: "updateAssisTypeForStatus.do"
    },
    addAssisType: {
        url: "addAssisType.do"
    },
    updateAssisType: {
        url: "updateAssisType.do"
    },

    pageAssisOrder: {
        url: "pageAssisOrder.do"
    },
    queryAssisOrderItemByAoid: {
        url: "queryAssisOrderItemByAoid.do"
    },
    queryAssisOrderItemByAoids: {
        url: "queryAssisOrderItemByAoids.do"
    },
    addAssisOrder: {
        url: "addAssisOrder.do"
    },
    updateAssisOrderForStatus: {
        url: "updateAssisOrderForStatus.do"
    },
    addAssisOrderItem: {
        url: "addAssisOrderItem.do"
    },
    updateAssisOrderItem: {
        url: "updateAssisOrderItem.do"
    },
    deleteAssisOrderItem: {
        url: "deleteAssisOrderItem.do"
    },

    addSales: {
        url: "addSales.do"
    },
    pageSales: {
        url: "pageSales.do"
    },
    querySalesBySid: {
        url: "querySalesBySid.do"
    },
    updateSalesForCoupon: {
        url: "updateSalesForCoupon.do"
    },
    updateSalesForMaling: {
        url: "updateSalesForMaling.do"
    },
    querySalesItemBySid: {
        url: "querySalesItemBySid.do"
    },
    addSalesItem: {
        url: "addSalesItem.do"
    },
    updateSalesItem: {
        url: "updateSalesItem.do"
    },
    deleteSalesItem: {
        url: "deleteSalesItem.do"
    },

    queryRefundsItemBySid: {
        url: "queryRefundsItemBySid.do"
    },

    queryPurchaseByGidASelling: {
        url: "queryPurchaseByGidASelling.do"
    }
}});


