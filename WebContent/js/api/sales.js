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
    salesRefundsPrintIndex: {
        url: "/views/sales/refunds2print.html"
    },
    salesActivityIndex: {
        url: "/views/sales/sales4activity.html"
    },
    salesSupplement: {
        url: "views/sales/sales2supple.html"
    }
});

$.extend(api, {
    sales: {
        addSales: {
            url: "addSales.do",
            type: "update",
            tranargs: {
                args: ["sales.total", "sales.maling", "sales.coupon", "salesItems.purchase", "salesItems.selling", "salesItems.discount", "salesItems.disPrice", "salesItems.postDis", "salesItems.price", "salesItems.num", "salesItems.total", "salesItems.rawCvalue", "salesItems.cvalue"]
            }
        },
        pageSales: {
            url: "pageSales.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total", "maling", "coupon", "depositpay", "fullpay", "amount", "venderMaling"]
            }]
        },
        pageSalesForAdvance: {
            url: "pageSalesForAdvance.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total", "maling", "coupon", "depositpay", "fullpay", "amount", "venderMaling"]
            }]
        },
        pageSalesForBalance: {
            url: "pageSalesForBalance.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total", "coupon", "depositpay", "fullpay", "amount", "venderMaling"]
            }]
        },
        pageSalesForDompany: {
            url: "pageSalesForDompany.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total", "maling", "coupon", "depositpay", "fullpay", "amount", "venderMaling"]
            }]
        },

        pageSalesForBalanceByDompany: {
            url: "pageSalesForBalanceByDompany.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total", "coupon", "depositpay", "fullpay", "amount", "venderMaling"]
            }]
        },

        querySalesBySid: {
            url: "querySalesBySid.do",
            type: "query",
            tranargs: [{
                result: "sales",
                args: ["depositpay", "fullpay", "total", "amount", "maling", "venderMaling", "coupon"]
            }]
        },
        querySalesByNo: {
            url: "querySalesByNo.do"
        },
        updateSales: {
            url: "updateSales.do"
        },
        updateSalesForBelong: {
            url: "updateSalesForBelong.do"
        },
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
        querySalesForGrade: {
            url: "querySalesForGrade.do"
        },
        updateSalesForAdvance: {
            url: "updateSalesForAdvance.do"
        },
        terminalSales: {
            url: "terminalSales.do"
        },
        finishSales: {
            url: "finishSales.do"
        },

        querySalesItemBySid: {
            url: "querySalesItemBySid.do",
            type: "query",
            tranargs: [{
                result: "salesItems",
                args: ["purchase", "selling", "discount", "disPrice", "postDis", "price", "num", "total", "rawCvalue", "cvalue", "punum", "xgnum"]
            }]
        },
        querySalesItemBySids: {
            url: "querySalesItemBySids.do",
            type: "query",
            tranargs: [{
                result: "salesItems",
                args: ["purchase", "selling", "discount", "disPrice", "postDis", "price", "num", "total", "rawCvalue", "cvalue", "punum", "xgnum"]
            }]
        },
        addSalesItem: {
            url: "addSalesItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["sales.total", "salesItem.purchase", "salesItem.selling", "salesItem.discount", "salesItem.disPrice", "salesItem.postDis", "salesItem.price", "salesItem.num", "salesItem.total", "salesItem.rawCvalue", "salesItem.cvalue"],
                query: [{
                    result: "salesItem",
                    args: ["disPrice", "discount", "num", "postDis", "price", "purchase", "rawCvalue", "selling", "total", "cvalue"]
                }]
            }
        },
        updateSalesItem: {
            url: "updateSalesItem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["salesItem.num", "salesItem.total", "sales.total"],
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
                args: ["sales.total", "salesItem.purchase", "salesItem.selling", "salesItem.discount", "salesItem.disPrice", "salesItem.postDis", "salesItem.price", "salesItem.num", "salesItem.total", "salesItem.rawCvalue", "salesItem.cvalue"]
            }
        },

        queryRefundsBySid: {
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
            }, {
                result: "refundsItems-salesItem",
                args: ["purchase", "selling", "discount", "disPrice", "postDis", "price", "num", "total", "rawCvalue", "cvalue"]
            }]
        },
        pageOales: {
            url: "pageOales.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total", "award", "profit"]
            }]
        },
        queryOalesByOrderId: {
            url: "queryOalesByOrderId.do",
            type: "query",
            tranargs: [{
                result: "oaleses",
                args: ["total", "award", "profit"]
            }]
        },
        addOales: {
            url: "addOales.do",
            type: "update",
            tranargs: {
                args: ["oales.total", "oales.cost", "oales.threshold"]
            }
        },
        updateOales: {
            url: "updateOales.do",
            type: "update",
            tranargs: {
                args: ["oales.total", "oales.award", "oales.profit", "oales.cost", "oales.threshold"]
            }
        },

        deleteOales: {
            url: "deleteOales.do"
        },

        confirmOales: {
            url: "confirmOales.do"
        },

        rejectOales: {
            url: "rejectOales.do"
        },

        checkOales: {
            url: "checkOales.do"
        },

        finishOales: {
            url: "finishOales.do"
        },

        pageSalesBalance: {
            url: "pageSalesBalance.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["balance", "difference", "total", "allowance", "vbalance", "pbalance"]
            }, {
                result: "paging-data-sales",
                args: ["total", "maling", "coupon", "depositpay", "fullpay", "amount", "venderMaling"]
            }]
        },

        pageSalesBalanceForDompany: {
            url: "pageSalesBalanceForDompany.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["balance", "difference", "total", "allowance", "vbalance", "pbalance"]
            }, {
                result: "paging-data-sales",
                args: ["total", "maling", "coupon", "depositpay", "fullpay", "amount", "venderMaling"]
            }]
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

        rpreSalesBalance: {
            url: "rpreSalesBalance.do"
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
            url: "querySalesBalanceItemBySbid.do",
            type: "query",
            tranargs: [{
                result: "salesBalanceItems",
                args: ["cvalue", "num", "rawCvalue", "total"]
            }, {
                result: "salesBalanceItems-salesItem",
                args: ["cvalue", "disPrice", "discount", "num", "postDis", "price", "purchase", "rawCvalue", "selling", "total"]
            }]
        },

        addSalesActivityItem: {
            url: "addSalesActivityItem.do",
            type: "update",
            tranargs: {
                args: ["salesActivityItems.money", "salesActivityItems.num", "salesActivityItems.integral", "salesActivity.amount"]
            }
        },

        querySalesActivityItem: {
            url: "querySalesActivityItem.do",
            type: "query",
            tranargs: [{
                result: "salesActivityItems",
                args: ["money", "num", "integral"]
            }]
        },
        amountSalesActivity: {
            url: "amountSalesActivity.do"
        },
        amountSalesActivityForActivity: {
            url: "amountSalesActivityForActivity.do",
            type: "query",
            tranargs: [{
                result: "salesActivity",
                args: ["amount"]
            }]
        },
        amountSalesActivityForPayment: {
            url: "amountSalesActivityForPayment.do",
            type: "query",
            tranargs: [{
                result: "salesActivity",
                args: ["amount"]
            }]
        },

        updateSalesForActivity: {
            url: "updateSalesForActivity.do"
        },

        abateSalesActivityItem: {
            url: "abateSalesActivityItem.do"
        },
        receiveSalesActivityItem: {
            url: "receiveSalesActivityItem.do"
        },

        deliveSalesActivityItem: {
            url: "deliveSalesActivityItem.do"
        },
        unrefundSalesActivityItem: {
            url: "unrefundSalesActivityItem.do"
        },
        upgradeSalesActivityItem: {
            url: "upgradeSalesActivityItem.do"
        },
        refundSalesActivityItem: {
            url: "refundSalesActivityItem.do"
        },
        expendSalesActivityItem: {
            url: "expendSalesActivityItem.do"
        },
        discountSalesActivityItem: {
            url: "discountSalesActivityItem.do"
        },
        sendSalesActivityItem: {
            url: "sendSalesActivityItem.do"
        },
        affirmSalesActivityItem: {
            url: "affirmSalesActivityItem.do"
        },
        pageSalesForPompany: {
            url: "pageSalesForPompany.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total", "maling", "coupon", "depositpay", "fullpay", "interceptount", "venderMaling", "amount"]
            }]
        },

        pageSalesForBalanceByPompany: {
            url: "pageSalesForBalanceByPompany.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total", "coupon", "depositpay", "fullpay", "amount", "venderMaling"]
            }]
        },

        pageSalesBalanceForPompany: {
            url: "pageSalesBalanceForPompany.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["balance", "difference", "total", "allowance", "vbalance", "pbalance"]
            }, {
                result: "paging-data-sales",
                args: ["total", "maling", "coupon", "depositpay", "fullpay", "amount", "venderMaling"]
            }]
        },

        pageSalesForSupplier: {
            url: "pageSalesForSupplier.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total", "maling", "coupon", "depositpay", "fullpay", "amount", "venderMaling"]
            }]
        },

        pageSalesBalanceForSupplier: {
            url: "pageSalesBalanceForSupplier.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["balance", "difference", "total", "allowance", "vbalance", "pbalance"]
            }, {
                result: "paging-data-sales",
                args: ["total", "maling", "coupon", "depositpay", "fullpay", "amount", "venderMaling"]
            }]
        },
        pageSalesBalanceForCheck: {
            url: "pageSalesBalanceForCheck.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["balance", "difference", "total", "allowance", "vbalance", "pbalance"]
            }, {
                result: "paging-data-sales",
                args: ["total", "maling", "coupon", "depositpay", "fullpay", "amount", "venderMaling"]
            }]
        },
        pageSalesByOrderId: {
            url: "pageSalesByOrderId.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total", "maling", "coupon", "depositpay", "fullpay", "amount", "venderMaling"]
            }]
        },
        advSalesBalance: {
            url: "advSalesBalance.do"
        },
        revSalesBalance: {
            url: "revSalesBalance.do"
        },
        pageSalesActivity: {
            url: "pageSalesActivity.do",
            type: "query",
            tranargs: [{
                result: "paging-data-sales",
                args: ["total", "fullpay", "depositpay", "amount", "maling", "coupon", "venderMaling"]
            }]
        },
        querySalesFunction: {
            url: "querySalesFunction.do"
        },
        querySalesFunctionByName: {
            url: "querySalesFunctionByName.do"
        },

        pageSalesDeliveryItem: {
            url: "pageSalesDeliveryItem.do",
            type: "query",
            tranargs: [{
                result: "paging-data-salesItem",
                args: ["initnum", "num"]
            }]
        },
        pageSalesDeliveryItemForSupplier: {
            url: "pageSalesDeliveryItemForSupplier.do",
            type: "query",
            tranargs: [{
                result: "paging-data-salesItem",
                args: ["initnum", "num"]
            }]
        },
        querySalesDeliveryItem: {
            url: "querySalesDeliveryItem.do",
            type: "query",
            tranargs: [{
                result: "salesDeliveryItems-salesItem",
                args: ["initnum", "num"]
            }]
        },

        tranSalesDeliveryItem: {
            url: "tranSalesDeliveryItem.do"
        },
        checkSalesDeliveryItem: {
            url: "checkSalesDeliveryItem.do"
        },
        confirmSalesDeliveryItem: {
            url: "confirmSalesDeliveryItem.do"
        },
        finishSalesDeliveryItem: {
            url: "finishSalesDeliveryItem.do"
        },
        balanceSalesDeliveryItem: {
            url: "balanceSalesDeliveryItem.do"
        },

        deliveSalesDeliveryItem: {
            url: "deliveSalesDeliveryItem.do",
        },

        updateSalesDeliveryItem: {
            url: "updateSalesDeliveryItem.do",
        },

        addSalesPicture: {
            url: "addSalesPicture.do",
            intercept: true
        },
        querySalesPicture: {
            url: "querySalesPicture.do"
        },
        deleteSalesPicture: {
            url: "deleteSalesPicture.do"
        },

    }
});