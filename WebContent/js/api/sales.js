$.extend(api.index, {
    querySalesIndex: {url: "views/sales/sales.html"},
    salesItemDetialIndex: {url: "views/sales/salesItem.html"},
    addSalesItemsIndex: {url: "views/sales/sales2add.html"},
    refundsItemDetialIndex: {url: "views/sales/refundsItem.html"},
    salesCollectionIndex: {url: "views/sales/sales4payment.html"},
    salesPaymentReceiptIndex: {url: "/views/payment/salesPaymentReceipt.html"},
    salesPrintIndex: {url: "/views/sales/sales2print.html"},
    salesRefundsPrintIndex: {url: "/views/sales/salesRefunds2print.html"},
    salesActivityIndex:{url:"/views/sales/sales4activity.html"},
    salesSupplement: {url: "views/sales/sales2supple.html"}
});

$.extend(api, {
    sales: {
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

        terminalSales:{url: "terminalSales.do"},
        finishSales:{url: "finishSales.do"},

        querySalesItemBySid: {
            url: "querySalesItemBySid.do",
            type: "query",
            tranargs: [{
                result: "salesItems",
                args: ["purchase", "selling", "discount", "disPrice", "postDis", "price", "num","total", "rawCvalue", "cvalue", "punum", "xgnum"]
            }]
        },
        querySalesItemBySids: {
            url: "querySalesItemBySids.do",
            type: "query",
            tranargs: [{
                result: "salesItems",
                args: ["purchase", "selling", "discount", "disPrice", "postDis", "price", "num","total", "rawCvalue", "cvalue", "punum", "xgnum"]
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

        queryRefundsBySid:{
            url: "queryRefundsBySid.do",
            type: "query",
            tranargs: [{
                result: "refundVOs",
                args: ["total"]
            }]
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

        rpreSalesBalance: {url: "rpreSalesBalance.do"},

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
        },

        pageSalesForSupplier: {
            url: "pageSalesForSupplier.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total","maling","coupon","depositpay","fullpay","amount","venderMaling"]
            }]
        },

        pageSalesBalanceForSupplier: {
            url: "pageSalesBalanceForSupplier.do",
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