$.extend(api.index, {
    querySalesIndex: {url: "views/sales/sales.html"},
    salesItemDetialIndex: {url: "views/sales/salesItem.html"},
    addSalesItemsIndex: {url: "views/sales/sales2add.html"},
    refundsItemDetialIndex: {url: "views/sales/refundsItem.html"},
    salesCollectionIndex: {url: "views/sales/sales4payment.html"},
    salesPaymentReceiptIndex: {url: "/views/payment/salesPaymentReceipt.html"},
    salesPrintIndex: {url: "/views/sales/sales2print.html"},
    purchaseBalanceIndex: {url: "/views/manifest/purchaseBalance.html"},
    purchaseBalance2balanceIndex: {url: "/views/manifest/purchaseBalance2balance.html"},
    manifestPrintIndex: {url: "/views/manifest/manifest2print.html"},
    accessoriesPrintIndex: {url: "/views/manifest/accessories2print.html"},
    salesActivityIndex:{url:"/views/sales/sales4activity.html"},
    salesSupplement: {url: "views/sales/sales2supple.html"}
});

$.extend(api, {
    inventory: {
        pageCheckList: {url: "pageCheckList.do"},

        pageStorehouse: {url: "pageStorehouse.do"},
        queryStorehouse: {url: "queryStorehouse.do"},
        queryStorehouseByUId: {url: "queryStorehouseByUId.do"},
        queryStorehouseForSelf: {url: "queryStorehouseForSelf.do"},
        addStorehouse: {url: "addStorehouse.do"},
        updateStorehouseForStatus: {url: "updateStorehouseForStatus.do"},

        queryStorehouseUserByUserId: {url: "queryStorehouseUserByUserId.do"},
        updateStorehouseUser: {url: "updateStorehouseUser.do"},

        updateGoods: {
            url: "updateGoods.do",
            type: "update",
            tranargs: {
                args: ["goods.pieceNum", "goods.purchase", "goods.selling"]
            }
        },
        addSupplier: {url: "addSupplier.do"},
        updateSupplierForStatus: {url: "updateSupplierForStatus.do"},
        pageGoodsStorehouseStock: {url: "pageGoodsStorehouseStock.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["num"]
            },{
                result:"paging-data-goods",
                args:["purchase", "selling", "pieceNum"]
            }]
        },
        plusGoodsStorehouseStock:{
            url:"plusGoodsStorehouseStock.do",
            type:"update",
            tranargs: {
                args: ["goodsStorehouseStock.num"]
            }
        },
        loseGoodsStorehouseStock:{
            url:"loseGoodsStorehouseStock.do",
            type:"update",
            tranargs: {
                args: ["goodsStorehouseStock.num"]
            }
        },
        queryGoodsStorehouseStockByShidAGid: {
            url: "queryGoodsStorehouseStockByShidAGid.do",
            type:"query",
            tranargs: [{
                result:"goodsStorehouseStock",
                args:["num"]
            }]

        },
        queryGoodsStorehouseStockByGid: {
            url: "queryGoodsStorehouseStockByGid.do",
            type:"query",
            tranargs: [{
                result:"",
                args:["nums"]
            }]},
        makeGoodsStorehouseStock: {url: "makeGoodsStorehouseStock.do"},
        mergePackage: {
            url: "mergePackage.do",
            type:"update",
            tranargs: {
                args: ["goodsStorehouseStock.num"]
            }
        },
        splitPackage: {
            url: "splitPackage.do",
            type:"update",
            tranargs: {
                args: ["goodsStorehouseStock.num"]
            }
        },

        pageManifestTemplate: {url: "pageManifestTemplate.do"},
        queryManifestTemplate: {url: "queryManifestTemplate.do"},
        queryManifestTemplateByMtid: {url: "queryManifestTemplateByMtid.do"},
        queryManifestTemplateItemByMtid: {
            url: "queryManifestTemplateItemByMtid.do",
            type:"query",
            tranargs: [{
                result:"manifestTemplateItems-goods",
                args:["purchase", "selling", "pieceNum"]
            }]
        },
        queryManifestItemByMtId: {url: "queryManifestItemByMtId.do"},
        queryManifestItemBySiids: {url: "queryManifestItemBySiids.do"},
        addManifestTemplate: {url: "addManifestTemplate.do"},
        addManifestTemplateItem: {url: "addManifestTemplateItem.do"},
        updateManifestTemplate: {url: "updateManifestTemplate.do"},
        updateManifestTemplateForStatus: {url: "updateManifestTemplateForStatus.do"},
        deleteManifestTemplate: {url: "deleteManifestTemplate.do"},
        deleteManifestTemplateItem: {url: "deleteManifestTemplateItem.do"},

        pageManifest: {url: "pageManifest.do"},
        queryManifestByMid: {url: "queryManifestByMid.do"},
        queryManifestItemByMid: {
            url: "queryManifestItemByMid.do",
            type: "query",
            tranargs: [{
                result: "manifestItems",
                args: ["inprice", "outprice", "num", "surplus"]
            },{
                result:"manifestItems-goods",
                args:["purchase", "selling", "pieceNum"]
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
        addManifestForDB: {url: "addManifestForDB.do"},
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
        addManifestItem: {url: "addManifestItem.do"},
        updateManifest: {url: "updateManifest.do"},
        updateManifestItem: {url: "updateManifestItem.do"},
        confirmManifest: {url: "confirmManifest.do"},
        deleteManifestItem: {url: "deleteManifestItem.do"},

        queryStorehouseStock: {url: "queryStorehouseStock.do"},
        queryPurchaseAmount: {url: "queryPurchaseAmount.do"},

        pagePurchase: {url: "pagePurchase.do"},
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
            type:"query",
            tranargs:[{
                result:"purchaseItems",
                args:["inprice", "num", "surplus"]
            },{
                result:"purchaseItems-goods",
                args:["purchase", "selling", "pieceNum"]
            }]
        },
        queryPurchaseByPid: {url: "queryPurchaseByPid.do"},
        updatePurchase: {url: "updatePurchase.do"},
        updatePurchaseForStatus: {url: "updatePurchaseForStatus.do"},
        updatePurchaseForBalanceStatus: {url: "updatePurchaseForBalanceStatus.do"},
        updatePurchaseItem: {
            url: "updatePurchaseItem.do",
            type: "update",
            tranargs: {
                args: ["purchaseItem.num","purchaseItem.inprice"]
            }
        },
        deletePurchaseItem: {url: "deletePurchaseItem.do"},
        queryPurchaseItemByPids: {url: "queryPurchaseItemByPids.do"},
        queryPurchaseBalanceByPid: {
            url: "queryPurchaseBalanceByPid.do",
            type:"query",
            tranargs:[{
                result:"purchaseBalances",
                args:["balance"]
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
        updatePurchaseBalanceForStatus: {url: "updatePurchaseBalanceForStatus.do"},

        pageAccessories: {url: "pageAccessories.do"},
        queryAccessoriesByOrderId: {url: "queryAccessoriesByOrderId.do"},
        queryAccessoriesItemByAid: {
            url: "queryAccessoriesItemByAid.do",
            type:"query",
            tranargs:[{
                result:"accessoriesItems",
                args:["selling", "num", "surplus"]
            },{
                result:"accessoriesItems-goods",
                args:["purchase", "selling", "pieceNum"]
            }]
        },
        queryAccessoriesItemByAids: {
            url: "queryAccessoriesItemByAids.do",
            type:"query",
            tranargs:[{
                result:"accessoriesItems",
                args:["selling", "num", "surplus"]
            },{
                result:"accessoriesItems-goods",
                args:["purchase", "selling", "pieceNum"]
            }]
        },
        addAccessories: {
            url: "addAccessories.do",
            type: "update",
            tranargs: {
                args: ["accessories.total", "accessoriesItems.selling", "accessoriesItems.num", "accessoriesItems.surplus", "accessoriesItems.total"]
            }
        },
        refundAccessories: {url: "refundAccessories.do"},
        preoutAccessories: {url: "preoutAccessories.do"},
        cancelAccessories: {url: "cancelAccessories.do"},
        refuseAccessories: {url: "refuseAccessories.do"},
        updateAccessoriesForPrint: {url: "updateAccessoriesForPrint.do", intercept: true},
        deliveAccessories: {url: "deliveAccessories.do"},
        addAccessoriesItem: {
            url: "addAccessoriesItem.do",
            type: "update",
            tranargs: {
                args: ["accessoriesItem.selling", "accessoriesItem.num", "accessoriesItem.surplus", "accessoriesItem.total"]
            }
        },
        updateAccessoriesItem: {
            url: "updateAccessoriesItem.do",
            type: "update",
            tranargs: {
                args: ["accessoriesItem.selling", "accessoriesItem.num", "accessoriesItem.surplus", "accessoriesItem.total"]
            }
        },
        deleteAccessoriesItem: {url: "deleteAccessoriesItem.do"},
        queryManifestByAid: {url: "queryManifestByAid.do"},

        queryManifestForPUByPids: {url: "queryManifestForPUByPids.do"},
        queryManifestForXGBySid: {url: "queryManifestForXGBySid.do"},
        queryPurchaseBySid: {url: "queryPurchaseBySid.do"},
        
        pageOccessories: {url: "pageOccessories.do"},
        queryOccessoriesItemByAid: {
            url: "queryOccessoriesItemByAid.do",
            type:"query",
            tranargs:[{
                result:"occessoriesItems",
                args:["num"]
            },{
                result:"occessoriesItems-goods",
                args:["purchase", "selling", "pieceNum"]
            }]
        },
        addOccessories: {
        	url: "addOccessories.do",
        	type: "update",
            tranargs: {
                args: ["occessoriesItems.num"]
            }
        },
        addOccessoriesItem: {
            url: "addOccessoriesItem.do",
            type: "update",
            tranargs: {
                args: ["occessoriesItem.num"]
            }
        },
        updateOccessoriesForStatus: {url: "updateOccessoriesForStatus.do"},
        updateOccessoriesItem: {
            url: "updateOccessoriesItem.do",
            type: "update",
            tranargs: {
                args: ["occessoriesItem.num"]
            }
        },
        deleteOccessoriesItem: {url: "deleteOccessoriesItem.do"},
    }
});


