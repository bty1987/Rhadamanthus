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

        pageGoods: {
            url: "pageGoods.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["purchase","selling","pieceNum"]
            }]
        },
        pageGoodsForAdvance: {
            url: "pageGoodsForAdvance.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["purchase","selling","pieceNum"]
            }]
        },
        queryGoods: {url: "queryGoods.do"},
        queryGoodsByNo: {url: "queryGoodsByNo.do"},
        queryGoodsByName: {
            url: "queryGoodsByName.do",
            type:"query",
            tranargs:[{
                result:"goodes",
                args: ["purchase","selling","pieceNum"]
            }]
        },
        queryGoodsByBarcode: {url: "queryGoodsByBarcode.do"},
        queryGoodsByAtid: {url: "queryGoodsByAtid.do"},
        queryGoodsByGId: {url: "queryGoodsByGId.do"},
        queryPackage: {
            url: "queryPackage.do",
            type:"query",
            tranargs:[{
                result:"goodsPackages",
                args:["num"]
            },{
                result:"goodsPackages-goods",
                args:["purchase", "selling", "pieceNum"]
            }]
        },
        addGoods: {
            url: "addGoods.do",
            type: "update",
            tranargs: {
                args: ["goods.pieceNum", "goods.purchase", "goods.selling"]
            }
        },
        addPackage: {
            url: "addPackage.do",
            type: "update",
            tranargs: {
                args: ["goodsPackages.num"]
            }

        },
        updateGoods: {
            url: "updateGoods.do",
            type: "update",
            tranargs: {
                args: ["goods.pieceNum", "goods.purchase", "goods.selling"]
            }
        },
        updateGoodsForStatus: {url: "updateGoodsForStatus.do"},
        bindGoodsForPackage: {url: "bindGoodsForPackage.do"},
        deleteGoodsForPackage: {url: "deleteGoodsForPackage.do"},
        queryColorByGid: {url: "queryColorByGid.do"},
        queryColorForEnableByGid: {url: "queryColorForEnableByGid.do"},
        addColor: {url: "addColor.do"},
        updateColorForStatus: {url: "updateColorForStatus.do"},

        queryFormatByGid: {url: "queryFormatByGid.do"},
        queryFormatForEnableByGid: {url: "queryFormatForEnableByGid.do"},
        addFormat: {url: "addFormat.do"},
        updateFormatForStatus: {url: "updateFormatForStatus.do"},

        queryPriceByGid: {
            url: "queryPriceByGid.do",
            type:"query",
            tranargs:[{
                result:"prices",
                args:["purchase","selling","cvalue"]
            }]
        },
        addPrice: {
            url: "addPrice.do",
            type: "update",
            tranargs: {
                args: ["price.purchase", "price.selling", "price.cvalue"]
            }
        },
        deletePrice: {url: "deletePrice.do"},
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
        surplusGoodsStorehouseStock:{
            url:"surplusGoodsStorehouseStock.do",
            type:"update",
            tranargs: {
                args: ["goodsStorehouseStock.num"]
            }
        },
        lossesGoodsStorehouseStock:{
            url:"lossesGoodsStorehouseStock.do",
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
                args: ["accessoriesItems.selling", "accessoriesItems.num", "accessoriesItems.surplus"]
            }
        },
        addManifestForAR: {url: "addManifestForAR.do"},
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
        pageAccessoriesType: {url: "pageAccessoriesType.do"},
        queryAccessoriesType: {url: "queryAccessoriesType.do"},
        queryAccessoriesTypeByWtid: {url: "queryAccessoriesTypeByWtid.do"},
        updateAccessoriesTypeForStatus: {url: "updateAccessoriesTypeForStatus.do"},
        addAccessoriesType: {url: "addAccessoriesType.do"},
        updateAccessoriesType: {url: "updateAccessoriesType.do"},

        pageAccessories: {url: "pageAccessories.do"},
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
        queryAccessoriesItemByAids: {url: "queryAccessoriesItemByAids.do"},
        addAccessories: {
            url: "addAccessories.do",
            type: "update",
            tranargs: {
                args: ["accessoriesItems.selling", "accessoriesItems.num", "accessoriesItems.surplus"]
            }
        },
        refundAccessories: {url: "refundAccessories.do"},
        updateAccessoriesForStatus: {url: "updateAccessoriesForStatus.do"},
        addAccessoriesItem: {
            url: "addAccessoriesItem.do",
            type: "update",
            tranargs: {
                args: ["accessoriesItem.selling", "accessoriesItem.num", "accessoriesItem.surplus"]
            }
        },
        updateAccessoriesItem: {
            url: "updateAccessoriesItem.do",
            type: "update",
            tranargs: {
                args: ["accessoriesItem.selling", "accessoriesItem.num", "accessoriesItem.surplus"]
            }
        },
        deleteAccessoriesItem: {url: "deleteAccessoriesItem.do"},
        queryManifestByAid: {url: "queryManifestByAid.do"},

        addSales: {
            url: "addSales.do",
            type: "update",
            tranargs: {
                args: ["sales.total","sales.maling","sales.coupon","salesItems.purchase","salesItems.selling","salesItems.discount","salesItems.disPrice",
                    "salesItems.postDis","salesItems.price","salesItems.num","salesItems.total","salesItems.rawCvalue","salesItems.cvalue"]
            }
        },
        pageSales: {
            url: "pageSales.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total","maling","coupon","depositpay","fullpay","amount","venderMaling"]
            }]
        },
        pageSalesForAdvance: {
            url: "pageSalesForAdvance.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total","maling","coupon","depositpay","fullpay","amount","venderMaling"]
            }]
        },
        pageSalesForBalance: {
            url: "pageSalesForBalance.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total","coupon","depositpay","fullpay","amount","venderMaling"]
            }]
        },
        pageSalesForDompany: {
            url: "pageSalesForDompany.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total","maling","coupon","depositpay","fullpay","amount","venderMaling"]
            }]
        },

        pageSalesForBalanceByDompany: {
            url: "pageSalesForBalanceByDompany.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total","coupon","depositpay","fullpay","amount","venderMaling"]
            }]
        },
        
        querySalesBySid: {
            url: "querySalesBySid.do",
            type: "query",
            tranargs: [{
                result: "sales",
                args: ["depositpay","fullpay","total","amount","maling","venderMaling","coupon"]
            }]
        },
        querySalesByNo: {url: "querySalesByNo.do"},
        updateSales: {url: "updateSales.do"},
        updateSalesForBelong: {url: "updateSalesForBelong.do"},
        updateSalesForCoupon: {
            url: "updateSalesForCoupon.do",
            type: "update",
            tranargs: {
                args: ["sales.coupon"]
            }
        },
        updateSalesForMaling: {
            url: "updateSalesForMaling.do",
            type: "update",
            tranargs: {
                args: ["sales.venderMaling"]
            }
        },
        querySalesForGrade:{url: "querySalesForGrade.do"},
        querySalesItemBySid: {
            url: "querySalesItemBySid.do",
            type: "query",
            tranargs: [{
                result: "salesItems",
                args: ["purchase", "selling", "discount", "disPrice", "postDis", "price", "num","total", "rawCvalue", "cvalue"]
            }]
        },
        querySalesItemBySids: {
            url: "querySalesItemBySids.do",
            type: "query",
            tranargs: [{
                result: "salesItems",
                args: ["purchase", "selling", "discount", "disPrice", "postDis", "price", "num","total", "rawCvalue", "cvalue"]
            }]
        },
        addSalesItem: {
            url: "addSalesItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["sales.total","salesItem.purchase", "salesItem.selling", "salesItem.discount", "salesItem.disPrice", "salesItem.postDis", "salesItem.price", "salesItem.num","salesItem.total", "salesItem.rawCvalue", "salesItem.cvalue"],
                query:[{
                    result: "salesItem",
                    args: ["disPrice","discount","num","postDis","price","purchase","rawCvalue","selling","total","cvalue"]
                }]
            }
        },
        updateSalesItem: {
            url: "updateSalesItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["salesItem.num","salesItem.total", "sales.total"],
                query: [{
                    result: "salesItem",
                    args: ["num", "total"]
                }]
            }
        },
        updateSalesItemForBalance: {
            url: "updateSalesItemForBalance.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["salesItem.cvalue"]
            }
        },
        deleteSalesItem: {
            url: "deleteSalesItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["sales.total","salesItem.purchase", "salesItem.selling", "salesItem.discount", "salesItem.disPrice", "salesItem.postDis", "salesItem.price", "salesItem.num","salesItem.total", "salesItem.rawCvalue", "salesItem.cvalue"]
            }
        },

        queryRefundsItemBySid: {
            url: "queryRefundsItemBySid.do",
            type: "query",
            tranargs: [{
                result: "refundsItems",
                args: ["num", "total"]
            },{
                result: "refundsItems-salesItem",
                args: ["purchase", "selling", "discount", "disPrice", "postDis", "price", "num", "total", "rawCvalue", "cvalue"]
            }]
        },

        queryPriceByPid: {url: "queryPriceByPid.do",
        	type:"query",
            tranargs:[{
                result:"price",
                args:["purchase","selling","cvalue"]
            }]	
        },
        pageSalesBalance: {
            url: "pageSalesBalance.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["balance", "difference", "total", "allowance", "vbalance", "pbalance"]
            },{
                result: "paging-data-sales",
                args: ["total","maling","coupon","depositpay","fullpay","amount","venderMaling"]
            }
            ]
        },

        pageSalesBalanceForDompany: {
            url: "pageSalesBalanceForDompany.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["balance", "difference", "total", "allowance", "vbalance", "pbalance"]
            },{
                result: "paging-data-sales",
                args: ["total","maling","coupon","depositpay","fullpay","amount","venderMaling"]
            }
            ]
        },

        updateSalesBalanceForVBalance: {
            url: "updateSalesBalanceForVBalance.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["salesBalance.vbalance"]
            }
        },

        updateSalesBalanceForPBalance: {
            url: "updateSalesBalanceForPBalance.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["salesBalance.pbalance"]
            }
        },

        passSalesBalance: {url: "passSalesBalance.do"},
        preSalesBalance: {url: "preSalesBalance.do"},
        vpostSalesBalance: {url: "vpostSalesBalance.do"},
        postSalesBalance: {url: "postSalesBalance.do"},
        querySalesBalanceItemBySbid: {
            url: "querySalesBalanceItemBySbid.do",
            type: "query",
            tranargs: [{
                result: "salesBalanceItems",
                args: ["cvalue", "num", "rawCvalue", "total"]
            },{
                result: "salesBalanceItems-salesItem",
                args: ["cvalue", "disPrice", "discount", "num", "postDis", "price", "purchase", "rawCvalue", "selling", "total"]
            }]
        },

        queryManifestForPUByPids: {url: "queryManifestForPUByPids.do"},
        queryManifestForXGBySid: {url: "queryManifestForXGBySid.do"},
        queryPurchaseBySid: {url: "queryPurchaseBySid.do"},
        
        addSalesActivityItem: {
            url: "addSalesActivityItem.do",
            type: "update",
            tranargs: {
                args: ["saleActivityItems.money","saleActivityItems.num"]
            }
        },

        querySalesActivityItem: {
            url: "querySalesActivityItem.do",
            type: "query",
            tranargs: [{
                result: "saleActivityItems",
                args: ["money","num"]
            }]
        },
        querySalesActivity : {url: "querySalesActivity.do"},

        updateSalesForActivity :{url:"updateSalesForActivity.do"},

        abateSalesActivityItem :{url:"abateSalesActivityItem.do"},
        receiveSalesActivityItem :{url:"receiveSalesActivityItem.do"},
        
        deliveSalesActivityItem :{url:"deliveSalesActivityItem.do"},
        unrefundSalesActivityItem :{url:"unrefundSalesActivityItem.do"},
        upgradeSalesActivityItem :{url:"upgradeSalesActivityItem.do"},
        refundSalesActivityItem :{url:"refundSalesActivityItem.do"},
        expendSalesActivityItem :{url:"expendSalesActivityItem.do"},
        pageSalesForPompany: {
            url: "pageSalesForPompany.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total","maling","coupon","depositpay","fullpay","amount","venderMaling"]
            }]
        },

        pageSalesForBalanceByPompany: {
            url: "pageSalesForBalanceByPompany.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total","coupon","depositpay","fullpay","amount","venderMaling"]
            }]
        },

        pageSalesBalanceForPompany: {
            url: "pageSalesBalanceForPompany.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["balance", "difference", "total", "allowance", "vbalance", "pbalance"]
            },{
                result: "paging-data-sales",
                args: ["total","maling","coupon","depositpay","fullpay","amount","venderMaling"]
            }
            ]
        }
    }
});


