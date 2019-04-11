$.extend(api.index, {
    querySalesIndex: {
        url: "views/sales/sales.html"
    },
    salesItemDetialIndex: {
        url: "views/sales/salesItemDetial.html"
    },
    addSalesItemsIndex: {
        url: "views/sales/addSalesItems.html"
    },
    refundsItemDetialIndex: {
        url: "views/sales/refundsItemDetial.html"
    },
    salesCollectionIndex: {
        url: "views/sales/salesCollection.html"
    },
    salesPaymentReceiptIndex: {url: "/views/payment/salesPaymentReceipt.html"},
    salesPrintIndex: {
        url: "/views/sales/furnitureContract.html"
    },
    purchaseBalanceIndex: {
        url: "/views/manifest/purchaseBalance.html"
    },
    viewPurchaseBalanceIndex: {
        url: "/views/manifest/viewPurchaseBalance.html"
    },
    manifestPrintIndex: {
        url: "/views/manifest/manifestPrint.html"
    },
    accessoriesPrintIndex: {
        url: "/views/manifest/accessoriesPrint.html"
    },
    salesActivityIndex:{
        url:"/views/sales/salesActivity.html"
    },
    salesSupplement: {
        url: "views/sales/salesSupplement.html"
    }
});

$.extend(api, {
    inventory: {
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
        addStorehouse: {
            url: "addStorehouse.do"
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
        pageGoodsForAdvance: {
            url: "pageGoodsForAdvance.do"
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
        queryPackage: {
            url: "queryPackage.do"
        },
        addGoods: {
            url: "addGoods.do"
        },
        addPackage: {
            url: "addPackage.do"
        },
        updateGoods: {
            url: "updateGoods.do"
        },
        updateGoodsForStatus: {
            url: "updateGoodsForStatus.do"
        },
        bindGoodsForPackage: {
            url: "bindGoodsForPackage.do"
        },
        deleteGoodsForPackage: {
            url: "deleteGoodsForPackage.do"
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
        querySupplierByGid: {
            url: "querySupplierByGid.do"
        },
        querySupplierForEnableByGid: {
            url: "querySupplierForEnableByGid.do"
        },
        addSupplier: {
            url: "addSupplier.do"
        },
        updateSupplierForStatus: {
            url: "updateSupplierForStatus.do"
        },
        pageGoodsStorehouseStock: {
            url: "pageGoodsStorehouseStock.do"
        },
        checkGoodsStorehouseStock: {
            url: "checkGoodsStorehouseStock.do"
        },
        queryGoodsStorehouseStockByShIdAGId: {
            url: "queryGoodsStorehouseStockByShIdAGId.do"
        },
        queryGoodsStorehouseStockByGid: {
            url: "queryGoodsStorehouseStockByGid.do"
        },
        makeGoodsStorehouseStock: {
            url: "makeGoodsStorehouseStock.do"
        },
        mergePackage: {
            url: "mergePackage.do"
        },
        splitPackage: {
            url: "splitPackage.do"
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
        queryManifestItemBySiids: {
            url: "queryManifestItemBySiids.do"
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
        queryManifestByMid: {
            url: "queryManifestByMid.do"
        },
        queryManifestItemByMid: {
            url: "queryManifestItemByMid.do"
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
        addManifestItem: {
            url: "addManifestItem.do"
        },
        updateManifest: {
            url: "updateManifest.do"
        },
        updateManifestItem: {
            url: "updateManifestItem.do"
        },
        confirmManifest: {
            url: "confirmManifest.do"
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

        pagePurchaseObDelivery: {
            url: "pagePurchaseObDelivery.do"
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
        updatePurchaseForStatus: {
            url: "updatePurchaseForStatus.do"
        },
        updatePurchaseForBalanceStatus: {
            url: "updatePurchaseForBalanceStatus.do"
        },
        updatePurchaseItem: {
            url: "updatePurchaseItem.do"
        },
        deletePurchaseItem: {
            url: "deletePurchaseItem.do"
        },
        queryPurchaseItemByPids: {
            url: "queryPurchaseItemByPids.do"
        },
        queryPurchaseBalanceByPid: {
            url: "queryPurchaseBalanceByPid.do"
        },
        addPurchaseBalance: {
            url: "addPurchaseBalance.do"
        },
        updatePurchaseBalance: {
            url: "updatePurchaseBalance.do"
        },
        updatePurchaseBalanceForStatus: {
            url: "updatePurchaseBalanceForStatus.do"
        },
        pageAccessoriesType: {
            url: "pageAccessoriesType.do"
        },
        queryAccessoriesType: {
            url: "queryAccessoriesType.do"
        },
        queryAccessoriesTypeByWtid: {
            url: "queryAccessoriesTypeByWtid.do"
        },
        updateAccessoriesTypeForStatus: {
            url: "updateAccessoriesTypeForStatus.do"
        },
        addAccessoriesType: {
            url: "addAccessoriesType.do"
        },
        updateAccessoriesType: {
            url: "updateAccessoriesType.do"
        },

        pageAccessories: {
            url: "pageAccessories.do"
        },
        queryAccessoriesItemByAid: {
            url: "queryAccessoriesItemByAid.do"
        },
        queryAccessoriesItemByAids: {
            url: "queryAccessoriesItemByAids.do"
        },
        addAccessories: {
            url: "addAccessories.do"
        },
        refundAccessories: {
            url: "refundAccessories.do"
        },
        updateAccessoriesForStatus: {
            url: "updateAccessoriesForStatus.do"
        },
        addAccessoriesItem: {
            url: "addAccessoriesItem.do"
        },
        updateAccessoriesItem: {
            url: "updateAccessoriesItem.do"
        },
        deleteAccessoriesItem: {
            url: "deleteAccessoriesItem.do"
        },
        queryManifestByAid: {
            url: "queryManifestByAid.do"
        },

        addSales: {
            url: "addSales.do"
        },
        pageSales: {
            url: "pageSales.do"
        },
        pageSalesForAdvance: {
            url: "pageSalesForAdvance.do"
        },
        pageSalesForBalance: {
            url: "pageSalesForBalance.do"
        },
        pageSalesForDompany: {
            url: "pageSalesForDompany.do"
        },
        pageSalesForBalanceByDompany: {
            url: "pageSalesForBalanceByDompany.do"
        },
        querySalesBySid: {
            url: "querySalesBySid.do"
        },
        querySalesByNo: {
            url: "querySalesByNo.do"
        },
        updateSales: {
            url: "updateSales.do"
        },
        updateSalesForCoupon: {
            url: "updateSalesForCoupon.do"
        },
        updateSalesForMaling: {
            url: "updateSalesForMaling.do"
        },
        querySalesForGrade:{
            url: "querySalesForGrade.do"
        },
        querySalesItemBySid: {
            url: "querySalesItemBySid.do"
        },
        querySalesItemBySids: {
            url: "querySalesItemBySids.do"
        },
        addSalesItem: {
            url: "addSalesItem.do"
        },
        updateSalesItem: {
            url: "updateSalesItem.do"
        },
        updateSalesItemForBalance: {
            url: "updateSalesItemForBalance.do"
        },
        deleteSalesItem: {
            url: "deleteSalesItem.do"
        },

        queryRefundsItemBySid: {
            url: "queryRefundsItemBySid.do"
        },

        queryPriceByPid: {
            url: "queryPriceByPid.do"
        },
        pageSalesBalance: {
            url: "pageSalesBalance.do"
        },
        pageSalesBalanceForDompany: {
            url: "pageSalesBalanceForDompany.do"
        },
        updateSalesBalanceForVBalance: {
            url: "updateSalesBalanceForVBalance.do"
        },
        updateSalesBalanceForPBalance: {
            url: "updateSalesBalanceForPBalance.do"
        },
        passSalesBalance: {
            url: "passSalesBalance.do"
        },
        preSalesBalance: {
            url: "preSalesBalance.do"
        },
        vpostSalesBalance: {
            url: "vpostSalesBalance.do"
        },
        postSalesBalance: {
            url: "postSalesBalance.do"
        },
        querySalesBalanceItemBySbid: {
            url: "querySalesBalanceItemBySbid.do"
        },
        queryManifestForPUByPids: {
            url: "queryManifestForPUByPids.do"
        },
        queryManifestForXGBySid: {
            url: "queryManifestForXGBySid.do"
        },
        queryPurchaseBySid: {
            url: "queryPurchaseBySid.do"
        },
        
        addSalesActivityItem :{url:"addSalesActivityItem.do"},
        querySalesActivityItem :{url:"querySalesActivityItem.do"},
        querySalesActivity :{url:"querySalesActivity.do"},
        updateSalesForActivity :{url:"updateSalesForActivity.do"},
        abateSalesActivityItem :{url:"abateSalesActivityItem.do"},
        receiveSalesActivityItem :{url:"receiveSalesActivityItem.do"},
        
        deliveSalesActivityItem :{url:"deliveSalesActivityItem.do"},
        unrefundSalesActivityItem :{url:"unrefundSalesActivityItem.do"},
        upgradeSalesActivityItem :{url:"upgradeSalesActivityItem.do"},
        refundSalesActivityItem :{url:"refundSalesActivityItem.do"},
        expendSalesActivityItem :{url:"expendSalesActivityItem.do"},
        pageSalesForPompany :{url:"pageSalesForPompany.do"},
        pageSalesForBalanceByPompany :{url:"pageSalesForBalanceByPompany.do"},
        pageSalesBalanceForPompany:{url:"pageSalesBalanceForPompany.do"}
    }
});


