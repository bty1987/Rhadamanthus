$.extend(api.index, {
    querySalesIndex: {
        url: "views/sales/sales.html"
    },
    salesItemDetialIndex: {
        url: "views/sales/salesItem.html"
    },
    addSalesItemsIndex: {
        url: "views/sales/sales2add.html"
    },
    refundsItemDetialIndex: {
        url: "views/sales/refundsItem.html"
    },
    salesCollectionIndex: {
        url: "views/sales/sales4payment.html"
    },
    salesPaymentReceiptIndex: {
        url: "/views/payment/salesPaymentReceipt.html"
    },
    salesPrintIndex: {
        url: "/views/sales/sales2print.html"
    },
    purchaseBalanceIndex: {
        url: "/views/manifest/purchaseBalance.html"
    },
    purchaseBalance2balanceIndex: {
        url: "/views/manifest/purchaseBalance2balance.html"
    },
    manifestPrintIndex: {
        url: "/views/manifest/manifest2print.html"
    },
    accessoriesPrintIndex: {
        url: "/views/manifest/accessories2print.html"
    },
    salesActivityIndex: {
        url: "/views/sales/sales4activity.html"
    },
    salesSupplement: {
        url: "views/sales/sales2supple.html"
    },
    occessoriesPrintIndex: {
        url: "/views/manifest/occessories2print.html"
    },
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

        updateGoods: {
            url: "updateGoods.do",
            type: "update",
            tranargs: {
                args: ["goods.pieceNum", "goods.purchase", "goods.selling"]
            }
        },
        addSupplier: {
            url: "addSupplier.do"
        },
        updateSupplierForStatus: {
            url: "updateSupplierForStatus.do"
        },
        pageGoodsStorehouseStock: {
            url: "pageGoodsStorehouseStock.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["num"]
            }, {
                result: "paging-data-goods",
                args: ["purchase", "selling", "pieceNum"]
            }]
        },
        plusGoodsStorehouseStock: {
            url: "plusGoodsStorehouseStock.do",
            type: "update",
            tranargs: {
                args: ["goodsStorehouseStock.num"]
            }
        },
        loseGoodsStorehouseStock: {
            url: "loseGoodsStorehouseStock.do",
            type: "update",
            tranargs: {
                args: ["goodsStorehouseStock.num"]
            }
        },
        queryGoodsStorehouseStockByShidAGid: {
            url: "queryGoodsStorehouseStockByShidAGid.do",
            type: "query",
            tranargs: [{
                result: "goodsStorehouseStock",
                args: ["num"]
            }]

        },
        queryGoodsStorehouseStockByGid: {
            url: "queryGoodsStorehouseStockByGid.do",
            type: "query",
            tranargs: [{
                result: "",
                args: ["nums"]
            }]
        },
        makeGoodsStorehouseStock: {
            url: "makeGoodsStorehouseStock.do"
        },
        mergePackage: {
            url: "mergePackage.do",
            type: "update",
            tranargs: {
                args: ["goodsStorehouseStock.num"]
            }
        },
        splitPackage: {
            url: "splitPackage.do",
            type: "update",
            tranargs: {
                args: ["goodsStorehouseStock.num"]
            }
        },

        pageManifestTemplate: {
            url: "pageManifestTemplate.do"
        },
        queryManifestTemplate: {
            url: "queryManifestTemplate.do"
        },
        queryManifestTemplateByMtid: {
            url: "queryManifestTemplateByMtid.do"
        },
        queryManifestTemplateItemByMtid: {
            url: "queryManifestTemplateItemByMtid.do",
            type: "query",
            tranargs: [{
                result: "manifestTemplateItems-goods",
                args: ["purchase", "selling", "pieceNum"]
            }]
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
            url: "queryManifestItemByMid.do",
            type: "query",
            tranargs: [{
                result: "manifestItems",
                args: ["inprice", "outprice", "num", "surplus"]
            }, {
                result: "manifestItems-goods",
                args: ["purchase", "selling", "pieceNum"]
            }]
        },
        addManifestForCG: {
            url: "addManifestForCG.do",
            type: "update",
            tranargs: {
                args: ["manifestItems.num", "manifestItems.inprice", "manifestItems.outprice", "manifestItems.surplus"]
            }
        },
        addManifestForXG: {
            url: "addManifestForXG.do",
            type: "update",
            tranargs: {
                args: ["manifestItems.num", "manifestItems.inprice", "manifestItems.outprice", "manifestItems.surplus"]
            }
        },
        addManifestForCR: {
            url: "addManifestForCR.do",
            type: "update",
            tranargs: {
                args: ["manifestItems.num", "manifestItems.inprice", "manifestItems.outprice", "manifestItems.surplus"]
            }
        },
        addManifestForXB: {
            url: "addManifestForXB.do",
            type: "update",
            tranargs: {
                args: ["manifestItems.num", "manifestItems.inprice", "manifestItems.outprice", "manifestItems.surplus"]
            }
        },
        addManifestForDB: {
            url: "addManifestForDB.do"
        },
        addManifestForPU: {
            url: "addManifestForPU.do",
            type: "update",
            tranargs: {
                args: ["purchaseItems.inprice", "purchaseItems.num", "purchaseItems.surplus"]
            }
        },
        addManifestForAS: {
            url: "addManifestForAS.do",
            type: "update",
            tranargs: {
                args: ["accessoriesItems.num", "accessoriesItems.outprice"]
            }
        },
        addManifestForAR: {
            url: "addManifestForAR.do",
            type: "update",
            tranargs: {
                args: ["accessoriesItems.num", "accessoriesItems.outprice"]
            }
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

        queryInventoryDrawing: {
            url: "queryInventoryDrawing.do"
        },
        addInventoryDrawing: {
            url: "addInventoryDrawing.do",
        },
        deleteInventoryDrawing: {
            url: "deleteInventoryDrawing.do"
        },
        queryPurchaseAmount: {
            url: "queryPurchaseAmount.do"
        },

        pagePurchase: {
            url: "pagePurchase.do"
        },
        addPurchase: {
            url: "addPurchase.do",
            type: "update",
            tranargs: {
                args: ["purchaseItems.inprice", "purchaseItems.num", "purchaseItems.surplus"]
            }
        },
        addPurchaseItem: {
            url: "addPurchaseItem.do",
            type: "update",
            tranargs: {
                args: ["purchaseItem.inprice", "purchaseItem.num", "purchaseItem.surplus"]
            }
        },
        queryPurchaseItemByPid: {
            url: "queryPurchaseItemByPid.do",
            type: "query",
            tranargs: [{
                result: "purchaseItems",
                args: ["inprice", "num", "surplus"]
            }, {
                result: "purchaseItems-goods",
                args: ["purchase", "selling", "pieceNum"]
            }]
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
            url: "updatePurchaseItem.do",
            type: "update",
            tranargs: {
                args: ["purchaseItem.num", "purchaseItem.inprice"]
            }
        },
        deletePurchaseItem: {
            url: "deletePurchaseItem.do"
        },
        queryPurchaseItemByPids: {
            url: "queryPurchaseItemByPids.do"
        },
        queryPurchaseBalanceByPid: {
            url: "queryPurchaseBalanceByPid.do",
            type: "query",
            tranargs: [{
                result: "purchaseBalances",
                args: ["balance"]
            }]
        },
        addPurchaseBalance: {
            url: "addPurchaseBalance.do",
            type: "update",
            tranargs: {
                args: ["purchaseBalance.balance"]
            }
        },
        updatePurchaseBalance: {
            url: "updatePurchaseBalance.do",
            type: "update",
            tranargs: {
                args: ["purchaseBalance.balance"]
            }
        },
        updatePurchaseBalanceForStatus: {
            url: "updatePurchaseBalanceForStatus.do"
        },

        pageAccessories: {
            url: "pageAccessories.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total"]
            }]

        },
        queryAccessoriesByOrderId: {
            url: "queryAccessoriesByOrderId.do",
            type: "query",
            tranargs: [{
                result: "accessoriess",
                args: ["total"]
            }]
        },
        queryAccessoriesByAid: {
            url: "queryAccessoriesByAid.do",
            type: "query",
            tranargs: [{
                result: "accessoriess",
                args: ["total"]
            }]
        },
        addAccessories: {
            url: "addAccessories.do",
            type: "update",
            tranargs: {
                args: ["accessories.total", "accessoriesItems.selling", "accessoriesItems.num", "accessoriesItems.surplus", "accessoriesItems.total", "accessoriesItems.normnum", "accessoriesItems.normunit", "accessoriesItems.storenum", "accessoriesItems.storeunit"]
            }
        },
        refundAccessories: {
            url: "refundAccessories.do"
        },
        preoutAccessories: {
            url: "preoutAccessories.do"
        },
        auditAccessories: {
            url: "auditAccessories.do"
        },
        cancelAccessories: {
            url: "cancelAccessories.do"
        },
        refuseAccessories: {
            url: "refuseAccessories.do"
        },
        updateAccessoriesForPrint: {
            url: "updateAccessoriesForPrint.do",
            intercept: true
        },
        deliveAccessories: {
            url: "deliveAccessories.do"
        },
        queryAccessoriesItemByOrderId: {
            url: "queryAccessoriesItemByOrderId.do",
            type: "query",
            tranargs: [{
                result: "accessoriesItems",
                args: ["selling", "num", "surplus", "normnum", "storenum"]
            }, {
                result: "accessoriesItems-goods",
                args: ["purchase", "selling", "pieceNum"]
            }]
        },
        queryAccessoriesItemByAid: {
            url: "queryAccessoriesItemByAid.do",
            type: "query",
            tranargs: [{
                result: "accessoriesItems",
                args: ["selling", "num", "surplus", "normnum", "storenum"]
            }, {
                result: "accessoriesItems-goods",
                args: ["purchase", "selling", "pieceNum"]
            }]
        },
        queryAccessoriesItemByAids: {
            url: "queryAccessoriesItemByAids.do",
            type: "query",
            tranargs: [{
                result: "accessoriesItems",
                args: ["selling", "num", "surplus", "normnum", "storenum"]
            }, {
                result: "accessoriesItems-goods",
                args: ["purchase", "selling", "pieceNum"]
            }]
        },
        checkAccessoriesItem: {
            url: "checkAccessoriesItem.do",
            type: "update",
            tranargs: {
                args: ["accessoriesItem.num", "accessoriesItem.normnum", "accessoriesItem.storenum"]
            }
        },
        addAccessoriesItem: {
            url: "addAccessoriesItem.do",
            type: "update",
            tranargs: {
                args: ["accessoriesItem.selling", "accessoriesItem.num", "accessoriesItem.surplus", "accessoriesItem.total", "accessoriesItem.normnum", "accessoriesItem.storenum"]
            }
        },
        updateAccessoriesItem: {
            url: "updateAccessoriesItem.do",
            type: "update",
            tranargs: {
                args: ["accessoriesItem.selling", "accessoriesItem.num", "accessoriesItem.surplus", "accessoriesItem.total", "accessoriesItem.normnum", "accessoriesItem.storenum"]
            }
        },
        deleteAccessoriesItem: {
            url: "deleteAccessoriesItem.do"
        },
        queryManifestByAid: {
            url: "queryManifestByAid.do"
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

        pageOccessories: {
            url: "pageOccessories.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["rate", "charge", "total", "rbalance", "vbalance", "rcharge"]
            }]
        },
        pageOccessoriesForSupplier: {
            url: "pageOccessoriesForSupplier.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["rate", "charge", "total", "rbalance", "vbalance", "rcharge"]
            }]
        },
        queryOccessoriesByOrderId: {
            url: "queryOccessoriesByOrderId.do",
            type: "query",
            tranargs: [{
                result: "occessoriess",
                args: ["rate", "charge", "total", "rbalance", "vbalance", "rcharge"]
            }]
        },
        queryOccessoriesByOid: {
            url: "queryOccessoriesByOid.do",
            type: "query",
            tranargs: [{
                result: "occessories",
                args: ["rate", "charge", "total", "rbalance", "vbalance", "rcharge"]
            }]
        },
        addOccessories: {
            url: "addOccessories.do",
            type: "update",
            tranargs: {
                args: [
                    "occessoriesItems.num",
                    "occessoriesItems.goods.selling",
                    "occessoriesItems.sennum",
                    "occessoriesItems.recnum",
                    "occessoriesItems.rbalance",
                    "occessoriesItems.vbalance",
                    "occessoriesItems.charge",
                    "occessoriesItems.occessoriesCharges.price",
                    "occessoriesItems.occessoriesCharges.surplus",
                    "occessoriesItems.occessoriesCharges.num"
                ]
            }
        },
        batchOccessoriesCharge: {
            url: "batchOccessoriesCharge.do",
            type: "update",
            tranargs: {
                args: [
                    "occessoriesCharges.price",
                    "occessoriesCharges.surplus"
                ]
            }
        },
        queryOccessoriesCharge: {
            url: "queryOccessoriesCharge.do",
            type: "query",
            tranargs: [{
                result: "occessoriesCharges",
                args: ["price", "surplus", "num"]
            }]
        },
        bindOccessories: {
            url: "bindOccessories.do",
            type: "update",
            tranargs: {
                args: []
            }
        },
        deliveOccessories: {
            url: "deliveOccessories.do",
            type: "update",
            tranargs: {
                args: ["occessoriesItems.sennum"]
            }
        },
        receiveOccessories: {
            url: "receiveOccessories.do",
            type: "update",
            tranargs: {
                args: ["occessoriesItems.recnum"]
            }
        },
        updateOccessoriesForBalance: {
            url: "updateOccessoriesForBalance.do",
            type: "update",
            tranargs: {
                args: ["occessories.vbalance", "occessories.rcharge"]
            }
        },
        balanceOccessories: {
            url: "balanceOccessories.do",
        },
        batchBalanceOccessories: {
            url: "batchBalanceOccessories.do",
        },
        rejectOccessories: {
            url: "rejectOccessories.do",
        },
        finishOccessories: {
            url: "finishOccessories.do"
        },
        rateOccessories: {
            url: "rateOccessories.do",
            type: "update",
            tranargs: {
                args: ["occessories.rate"]
            }
        },
        updateOccessoriesForRemark: {
            url: "updateOccessoriesForRemark.do",
        },
        cancelOccessories: {
            url: "cancelOccessories.do"
        },
        deleteOccessories: {
            url: "deleteOccessories.do"
        },

        queryOccessoriesItemByOid: {
            url: "queryOccessoriesItemByOid.do",
            type: "query",
            tranargs: [{
                result: "occessoriesItems",
                args: ["num", "sennum", "recnum", "rbalance", "vbalance", "charge"]
            }, {
                result: "occessoriesItems-goods",
                args: ["purchase", "selling", "pieceNum"]
            }]
        },
        amountOccessoriesItem: {
            url: "amountOccessoriesItem.do",
            type: "query",
            tranargs: [{
                result: "occessoriesItem",
                args: ["purchase", "selling", "pieceNum", "amount"]
            }, {
                result: "occessories",
                args: ["amount"]
            }]
        },
        addOccessoriesItem: {
            url: "addOccessoriesItem.do",
            type: "update",
            tranargs: {
                args: ["occessoriesItem.num", "occessoriesItems.sennum", "occessoriesItems.recnum", "occessoriesItems.rbalance", "occessoriesItems.vbalance", "occessoriesItems.charge"]
            }
        },
        updateOccessoriesItem: {
            url: "updateOccessoriesItem.do",
            type: "update",
            tranargs: {
                args: ["occessoriesItem.num", "occessoriesItem.sennum", "occessoriesItem.recnum", "occessoriesItem.rbalance", "occessoriesItem.vbalance", "occessoriesItems.charge"]
            }
        },
        deleteOccessoriesItem: {
            url: "deleteOccessoriesItem.do"
        },

        queryOccessoriesCost: {
            url: "queryOccessoriesCost.do",
            type: "query",
            tranargs: [{
                result: "occessoriesCosts",
                args: ["initPrice", "price", "cost"]
            }]
        },
        addOccessoriesCost: {
            url: "addOccessoriesCost.do",
            type: "update",
            tranargs: {
                args: ["occessoriesCost.price", "occessoriesCost.cost"]
            }
        },
        updateOccessoriesCost: {
            url: "updateOccessoriesCost.do",
            type: "update",
            tranargs: {
                args: ["occessoriesCost.price", "occessoriesCost.cost"]
            }
        },
        deleteOccessoriesCost: {
            url: "deleteOccessoriesCost.do"
        },
    }
});
