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
        url: "views/sales/salesRefundsItem.html"
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
        url: "/views/sales/salesRefunds2print.html"
    },
    salesActivityIndex: {
        url: "/views/sales/sales4activity.html"
    },
    salesSupplement: {
        url: "views/sales/sales2supple.html"
    },
    salesProfile2print: {
        url: "/views/sales/salesProfile2print.html"
    }
});

$.extend(api, {
    sales: {
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
        amountSales: {
            url: "amountSales.do",
            type: "query",
            tranargs: [{
                result: "",
                args: ["amount"]
            }]
        },
        addSales: {
            url: "addSales.do",
            type: "update",
            tranargs: {
                args: ["sales.total", "sales.maling", "sales.coupon", "salesItems.purchase", "salesItems.selling", "salesItems.discount", "salesItems.disPrice", "salesItems.postDis", "salesItems.price", "salesItems.num", "salesItems.total", "salesItems.rawCvalue", "salesItems.cvalue"]
            }
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
        unpaySales: {
            url: "unpaySales.do"
        },
        sendSales: {
            url: "sendSales.do"
        },
        affirmSales: {
            url: "affirmSales.do"
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
        
        pageSalesRefunds: {
            url: "pageSalesRefunds.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total"]
            }]
        },
        querySalesRefundsBySid: {
            url: "querySalesRefundsBySid.do",
            type: "query",
            tranargs: [{
                result: "refundses",
                args: ["total"]
            }]
        },
        querySalesRefundsByRid: {
            url: "querySalesRefundsByRid.do",
            type: "query",
            tranargs: [{
                result: "refunds",
                args: ["total"]
            }]
        },
        querySalesRefundsItemBySid: {
            url: "querySalesRefundsItemBySid.do",
            type: "query",
            tranargs: [{
                result: "refundsItems",
                args: ["num", "total"]
            }, {
                result: "refundsItems-salesItem",
                args: ["purchase", "selling", "discount", "disPrice", "postDis", "price", "num", "total", "rawCvalue", "cvalue"]
            }]
        },
        querySalesRefundsItemByRid: {
            url: "querySalesRefundsItemByRid.do",
            type: "query",
            tranargs: [{
                result: "refundsItems",
                args: ["num", "total"]
            }, {
                result: "refundsItems-salesItem",
                args: ["purchase", "selling", "discount", "disPrice", "postDis", "price", "num", "total", "rawCvalue", "cvalue"]
            }]
        },
        sendSalesRefunds: {
            url: "sendSalesRefunds.do"
        },
        affirmSalesRefunds: {
            url: "affirmSalesRefunds.do"
        },
        
        pageOales: {
            url: "pageOales.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total", "award", "profit", "cost", "threshold"]
            }]
        },
        pageOalesForAccount: {
            url: "pageOalesForAccount.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total", "award", "profit", "cost", "threshold"]
            }]
        },
        queryOalesByOrderId: {
            url: "queryOalesByOrderId.do",
            type: "query",
            tranargs: [{
                result: "oaleses",
                args: ["total", "award", "profit", "cost", "threshold"]
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
        refundOales: {
            url: "refundOales.do",
            type: "update",
            tranargs: {
                args: ["oales.total", "oales.award", "oales.profit", "oales.cost"]
            }
        },
        scaleOales: {
            url: "scaleOales.do"
        },
        deleteOales: {
            url: "deleteOales.do"
        },
        amountOales: {
            url: "amountOales.do",
            type: "query",
            tranargs: [{
                result: "",
                args: ["amount"]
            }]
        },
        abateOales: {
            url: "abateOales.do"
        },

        confirmOales: {
            url: "confirmOales.do"
        },
        submitOales: {
            url: "submitOales.do"
        },
        cancelOales: {
            url: "cancelOales.do"
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

        pageOalesPay: {
            url: "pageOalesPay.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["money"]
            }, {
                result: "paging-data-oales",
                args: ["total", "award", "profit", "cost", "threshold"]
            }]
        },
        queryOalesPay: {
            url: "queryOalesPay.do",
            type: "query",
            tranargs: [{
                result: "oalesPays",
                args: ["money"]
            }]
        },
        addOalesPay: {
            url: "addOalesPay.do",
            type: "update",
            tranargs: {
                args: ["oalesPay.money"]
            }
        },
        updateOalesPay: {
            url: "updateOalesPay.do",
            type: "update",
            tranargs: {
                args: ["oalesPay.money"]
            }
        },
        updateOalesPayForAdvance: {
            url: "updateOalesPayForAdvance.do"
        },
        deleteOalesPay: {
            url: "deleteOalesPay.do"
        },

        pageSalesBalance: {
            url: "pageSalesBalance.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["balance", "difference", "total", "allowance", "vbalance", "pbalance", "coupon", "rate"]
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
                args: ["balance", "difference", "total", "allowance", "vbalance", "pbalance", "coupon", "rate"]
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
        rejectSalesBalance: {
            url: "rejectSalesBalance.do"
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
                args: ["salesActivityItems.money", "salesActivityItems.num", "salesActivityItems.integral", "salesActivityItems.expendPrice", "salesActivityItems.discountPrice", "salesActivity.amount"]
            }
        },

        querySalesActivityItem: {
            url: "querySalesActivityItem.do",
            type: "query",
            tranargs: [{
                result: "salesActivityItems",
                args: ["money", "num", "integral", "expendPrice", "discountPrice"]
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
            url: "expendSalesActivityItem.do",
            type: "update",
            tranargs: {
                args: ["salesActivityItem.expendPrice"]
            }
        },
        discountSalesActivityItem: {
            url: "discountSalesActivityItem.do",
            type: "update",
            tranargs: {
                args: ["salesActivityItem.discountPrice"]
            }
        },
        sendSalesActivityItem: {
            url: "sendSalesActivityItem.do"
        },
        affirmSalesActivityItem: {
            url: "affirmSalesActivityItem.do"
        },

        querySalesActivityRecord: {
            url: "querySalesActivityRecord.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "salesActivityRecords-salesActivityItem",
                args: ["money", "num", "integral", "expendPrice", "discountPrice"]
            }]
        },
        addSalesActivityRecord: {
            url: "addSalesActivityRecord.do"
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
                args: ["balance", "difference", "total", "allowance", "vbalance", "pbalance", "coupon", "rate"]
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
                args: ["balance", "difference", "total", "allowance", "vbalance", "pbalance", "coupon", "rate"]
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
                args: ["balance", "difference", "total", "allowance", "vbalance", "pbalance", "coupon", "rate"]
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
        pageSalesDeliveryItemForInstorer: {
            url: "pageSalesDeliveryItemForInstorer.do",
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
        deliveSalesDelivery: {
            url: "deliveSalesDelivery.do",
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
        querySalesProfileByOrderId: {
            url: "querySalesProfileByOrderId.do"
        },
        handleSalesProfile: {
            url: "handleSalesProfile.do"
        },
        makeSalesProfile: {
            url: "makeSalesProfile.do"
        },
        addSalesProfileBrand: {
            url: "addSalesProfileBrand.do"
        },
        updateSalesProfileBrand: {
            url: "updateSalesProfileBrand.do"
        },
    }
});

$.extend(tools, {
    sales: {
        info: function(content, sid) {

            com.post(api.sales.querySalesBySid, {
                "sales.sid": sid
            }, function(res) {

                var sales = res.sales;

                var isAffirm = constant.sales().sales.isAffirm.keys[sales.isAffirm];

                com.showTip(content, "装修单号:" + sales.orderId + "<br\>销售单号:" + sales.no + "<br\>是否确认:" + isAffirm, "bottom");
            });
        }
    }
});