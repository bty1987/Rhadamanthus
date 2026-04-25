$.extend(api.index, {
    approvalTrackIndex: {
        url: "/views/approval/approval4track.html"
    },
    userApproveIndex: {
        url: "/views/approval/approval4user.html"
    },
    createProcessIndex: {
        url: "views/approval/process2create.html"
    },
    approvalCustomerSharedIndex: {
        url: "views/approval/approvalCustomerShared.html"
    }

});

$.extend(api, {
    approval: {

        pageApproval: {
            url: "pageApproval.do",
            demo: true
        },
        pageApprovalForReceive: {
            url: "pageApprovalForReceive.do",
            demo: true
        },
        pageApprovalForSend: {
            url: "pageApprovalForSend.do",
            demo: true
        },
        pageApprovalForReceiveDept: {
            url: "pageApprovalForReceiveDept.do",
            demo: true
        },
        queryApprovalByAId: {
            url: "queryApprovalByAId.do"
        },

        pageApprovalSalesRefund: {
            url: "pageApprovalSalesRefund.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data-source",
                args: ["buildArea", "freeArea", "totalArea", "innerArea"]
            }]
        },
        queryApprovalSalesRefundItem: {
            url: "queryApprovalSalesRefundItem.do",
            type: "query",
            tranargs: [{
                result: "approvalSalesRefundItem",
                args: ["num", "total"]
            }, {
                result: "approvalSalesRefundItem-salesItem",
                args: ["purchase", "num", "total", "selling", "discount", "disPrice", "postDis", "price", "rawCvalue", "cvalue"]
            }]
        },
        queryApprovalManifestDBItem: {
            url: "queryApprovalManifestDBItem.do"
        },
        queryApprovalMaterialRefundItem: {
            url: "queryApprovalMaterialRefundItem.do",
            type: "query",
            tranargs: [{
                result: "approvalMaterialRefundItems",
                args: ["num", "total"]
            }, {
                result: "approvalMaterialRefundItems-materialItem",
                args: ["unitPrice", "purchasePrice", "salePrice", "price", "discount", "postDiscount", "num", "total", "prePoint", "postPoint", "rawPoint"]
            }]
        },

        queryApprovalDecorationActivity: {
            url: "queryApprovalDecorationActivity.do",
            type: "query",
            tranargs: [{
                result: "approvalDecorationActivityItems",
                args: ["num", "money"]
            }]
        },
        queryApprovalCustomerOrigin: {
            url: "queryApprovalCustomerOrigin.do",
            type: "query",
            tranargs: [{
                result: "approvalCustomerOrigin-customerOrigin-house",
                args: ["buildArea"]
            }]
        },
        queryApprovalCustomerOriginTDecoration: {
            url: "queryApprovalCustomerOriginTDecoration.do",
            type: "query",
            tranargs: [{
                result: "approvalCustomerOriginTDecoration-customerOrigin-house",
                args: ["buildArea"]
            }]
        },

        countApprovalForReceive: {
            url: "countApprovalForReceive.do"
        },
        countApprovalForSend: {
            url: "countApprovalForSend.do"
        },

        submitApprovalForCustomerOriginTDecoration: {
            url: "submitApprovalForCustomerOriginTDecoration.do"
        },
        // submitApprovalForDecorationCustomer: {url: "submitApprovalForDecorationCustomer.do"},
        // submitApprovalForDecorationHouse: {url: "submitApprovalForDecorationHouse.do"},
        submitApprovalForDecorationBelong: {
            url: "submitApprovalForDecorationBelong.do",
            type: "update",
            tranargs: {
                args: ["approvalDecorationBelongItems.rate"]
            }
        },
        submitApprovalForDecorationContract: {
            url: "submitApprovalForDecorationContract.do",
        },
        submitApprovalForQuotationDiscount: {
            url: "submitApprovalForQuotationDiscount.do",
            type: "update",
            tranargs: {
                args: ["approvalQuotationDiscount.newDiscount", "approvalQuotationDiscount.oldDiscount", "approvalQuotationDiscount.basePrice"]
            }
        },
        submitApprovalForProtationPrefer: {
            url: "submitApprovalForProtationPrefer.do",
            type: "update",
            tranargs: {
                args: ["approvalProtationPrefer.preferPrice", "approvalProtationPrefer.managePrefer", "approvalProtationPrefer.advancePrefer", "approvalProtationPrefer.taxPrice", "approvalProtationPrefer.totalPrice", "approvalProtationPrefer.activityProfit", "protation.quotePrice", "protation.quoteArea", "protation.preferPrice", "protation.managePrice", "protation.manageDiscount", "protation.taxPrice", "protation.costPrice", "protation.mostPrice", "protation.totalCost", "protation.totalProfit", "protation.costRate", "protation.mostRate", "protation.manageRate", "protation.taxRate", "protation.profitRate", "protation.discount", "protation.unitPrice", "protation.basicPrice", "protation.comdPrice", "protation.commPrice", "protation.adddPrice", "protation.addmPrice", "protation.subdPrice", "protation.submPrice", "protation.subcPrice", "protation.accdPrice", "protation.accmPrice", "protation.totalPrice", "protation.manageProfit", "protation.advanceProfit", "protation.activityProfit", "protation.activityPrice"]
            }
        },
        submitApprovalForQuotationPrefer: {
            url: "submitApprovalForQuotationPrefer.do",
            type: "update",
            tranargs: {
                args: ["approvalQuotationPrefer.preferPrice", "approvalQuotationPrefer.managePrefer", "approvalQuotationPrefer.advancePrefer", "approvalQuotationPrefer.activityPrice", "approvalQuotationPrefer.activityProfit", "approvalQuotationPrefer.taxPrice", "approvalQuotationPrefer.totalPrice"]
            }
        },
        submitApprovalForDecorationRefund: {
            url: "submitApprovalForDecorationRefund.do"
        },
        submitApprovalForMaterialFullPayment: {
            url: "submitApprovalForMaterialFullPayment.do",
            type: "update",
            tranargs: {
                args: ["approvalMaterialFullPayment.referMoney"]
            }
        },
        submitApprovalForMaterialRefund: {
            url: "submitApprovalForMaterialRefund.do",
            type: "update",
            tranargs: {
                args: ["approvalMaterialRefund.refund", "approvalMaterialRefund.referMoney", "approvalMaterialRefundItems.num", "approvalMaterialRefundItems.total"]
            }
        },
        submitApprovalForDecorationActivity: {
            url: "submitApprovalForDecorationActivity.do",
            type: "update",
            tranargs: {
                args: ["approvalDecorationActivityItems.num", "approvalDecorationActivityItems.money"]
            }
        },
        submitApprovalForSalesRefund: {
            url: "submitApprovalForSalesRefund.do",
            type: "update",
            tranargs: {
                args: ["approvalSalesRefund.refund", "approvalSalesRefundItem.num", "approvalSalesRefundItem.total"]
            }
        },
        submitApprovalForManifestDB: {
            url: "submitApprovalForManifestDB.do",
            type: "update",
            tranargs: {
                args: ["approvalManifestDBItems.num"]
            }
        },
        submitApprovalForSalesDiscount: {
            url: "submitApprovalForSalesDiscount.do",
            type: "update",
            tranargs: {
                args: ["approvalSalesDiscount.referMoney"]
            }
        },
        submitApprovalForDecorationHolonomy: {
            url: "submitApprovalForDecorationHolonomy.do",
            type: "update",
            tranargs: {
                args: ["approvalDecorationHolonomy.materialPrice"]
            }
        },

        submitApprovalForCustomerOrigin: {
            url: "submitApprovalForCustomerOrigin.do"
        },
        pageApprovalCustomerOrigin: {
            url: "pageApprovalCustomerOrigin.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data-source",
                args: ["buildArea", "freeArea", "totalArea", "innerArea"]
            }]
        },

        submitApprovalForCustomerChance: {
            url: "submitApprovalForCustomerChance.do"
        },
        submitApprovalForCustomerChanceToDisabled: {
            url: "submitApprovalForCustomerChanceToDisabled.do"
        },

        pageApprovalCustomerSource: {
            url: "pageApprovalCustomerSource.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data-source",
                args: ["buildArea", "freeArea", "totalArea", "innerArea"]
            }]
        },
        submitApprovalForCustomerSource: {
            url: "submitApprovalForCustomerSource.do",
            type: "update",
            tranargs: {
                args: ["approvalCustomerSource.rate"]
            }
        },

        pageApprovalCustomerOriginTDecoration: {
            url: "pageApprovalCustomerOriginTDecoration.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data-source",
                args: ["buildArea", "freeArea", "totalArea", "innerArea"]
            }]
        },

        submitApprovalForDecorationTerminal: {
            url: "submitApprovalForDecorationTerminal.do",
            type: "update",
            tranargs: {
                args: ["approvalDecorationTerminalItems.referMoney"]
            }
        },

        submitApprovalForPaymentWithdraw: {
            url: "submitApprovalForPaymentWithdraw.do",
            type: "update",
            tranargs: {
                args: ["approvalPaymentWithdraw.amount"]
            }
        },

        approveApproval: {
            url: "approveApproval.do"
        },
        affirmApproval: {
            url: "affirmApproval.do"
        },
        refuseApproval: {
            url: "refuseApproval.do"
        },
        submitApprovalForSalesDayment: {
            url: "submitApprovalForSalesDayment.do"
        },
        approveForSalesDayment: {
            url: "approveForSalesDayment.do"
        },
        refuseForSalesDayment: {
            url: "refuseForSalesDayment.do"
        },

        pageApprover: {
            url: "pageApprover.do",
            demo: true
        },
        queryApproverByType: {
            url: "queryApproverByType.do"
        },
        deleteApprover: {
            url: "deleteApprover.do"
        },
        addApprover: {
            url: "addApprover.do"
        },

        pageProcess: {
            url: "pageProcess.do"
        },
        queryProcess: {
            url: "queryProcess.do"
        },
        queryProcessByPid: {
            url: "queryProcessByPid.do"
        },
        queryProcessItem: {
            url: "queryProcessItem.do"
        },
        addProcess: {
            url: "addProcess.do"
        },
        updateProcess: {
            url: "updateProcess.do"
        },
        updateProcessForStatus: {
            url: "updateProcessForStatus.do"
        },
        updateProcessItem: {
            url: "updateProcessItem.do"
        },
        deleteProcess: {
            url: "deleteProcess.do"
        },
        deleteProcessItem: {
            url: "deleteProcessItem.do"
        },

        queryProcessRefer: {
            url: "queryProcessRefer.do"
        },
        queryApprovalFunction: {
            url: "queryApprovalFunction.do"
        },

    }
});
