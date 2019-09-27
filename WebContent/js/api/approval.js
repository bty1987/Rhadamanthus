$.extend(api.index, {
    approvalTrackIndex: {url: "/views/approval/approval4track.html"},
    userApproveIndex: {url: "/views/approval/approval4user.html"}
});

$.extend(api, {
    approval: {

        pageApprovalForReceive: {url: "pageApprovalForReceive.do", demo: true},
        pageApprovalForSend: {url: "pageApprovalForSend.do", demo: true},
        pageApprovalForReceiveDept:{url:"pageApprovalForReceiveDept.do",demo:true},
        pageApprover: {url: "pageApprover.do", demo: true},
        queryApprovalByAId: {url: "queryApprovalByAId.do"},
        queryApprovalSalesRefundItem: {url: "queryApprovalSalesRefundItem.do",
            type: "query",
            tranargs: [{
                result: "approvalSalesRefundItem",
                args: ["num","total"]
            },{
                result:"approvalSalesRefundItem-salesItem",
                args:["purchase", "num", "total", "selling", "discount", "disPrice", "postDis", "price", "rawCvalue",
                    "cvalue"]
            }]},
        queryApprovalManifestDBItem: {url: "queryApprovalManifestDBItem.do"},
        queryApprovalMaterialRefundItem: {url: "queryApprovalMaterialRefundItem.do",
            type: "query",
            tranargs: [{
                result: "approvalMaterialRefundItems",
                args: ["num","total"]
            },{
                result:"approvalMaterialRefundItems-materialItem",
                args:["unitPrice", "purchasePrice", "salePrice", "price", "discount", "postDiscount", "num", "total",
                    "prePoint", "postPoint", "rawPoint"]
            }]},
        queryApproverByType: {url: "queryApproverByType.do"},
        queryApprovalDecorationActivity: {url: "queryApprovalDecorationActivity.do",
            type:"query",
            tranargs:[{
                result:"approvalDecorationActivityItems",
                args: ["num","money"]
            }]},
        queryApprovalCustomerOriginTDecoration: {url: "queryApprovalCustomerOriginTDecoration.do"},
        
        countApprovalForReceive: {url:"countApprovalForReceive.do"},
        countApprovalForSend: {url:"countApprovalForSend.do"},

        submitApprovalForCustomerOriginTDecoration:{url:"submitApprovalForCustomerOriginTDecoration.do"},
        // submitApprovalForDecorationCustomer: {url: "submitApprovalForDecorationCustomer.do"},
        // submitApprovalForDecorationHouse: {url: "submitApprovalForDecorationHouse.do"},
        submitApprovalForDecorationBelong: {url: "submitApprovalForDecorationBelong.do",
            type: "update",
            tranargs: {
                args: ["approvalDecorationBelongItems.rate"]
            }},
        submitApprovalForQuotationDiscount: {url: "submitApprovalForQuotationDiscount.do",
            type: "update",
            tranargs: {
                args: ["approvalQuotationDiscount.newDiscount", "approvalQuotationDiscount.oldDiscount",
                "approvalQuotationDiscount.basePrice"]
            }},
        submitApprovalForDecorationRefund: {url: "submitApprovalForDecorationRefund.do"},
        submitApprovalForMaterialFullPayment: {url: "submitApprovalForMaterialFullPayment.do",
            type: "update",
            tranargs: {
                args: ["approvalMaterialFullPayment.referMoney"]
            }},
        submitApprovalForMaterialRefund: {url: "submitApprovalForMaterialRefund.do",
            type: "update",
            tranargs: {
                args: ["approvalMaterialRefund.refund", "approvalMaterialRefund.referMoney", "approvalMaterialRefundItems.num", "approvalMaterialRefundItems.total"]
            }},
        submitApprovalForDecorationActivity: {url: "submitApprovalForDecorationActivity.do",
            type: "update",
            tranargs: {
                args: ["approvalDecorationActivityItems.num", "approvalDecorationActivityItems.money"]
            }},
        submitApprovalForSalesRefund: {url: "submitApprovalForSalesRefund.do",
            type: "update",
            tranargs: {
                args: ["approvalSalesRefund.refund", "approvalSalesRefundItem.num", "approvalSalesRefundItem.total"]
            }},
        submitApprovalForManifestDB: {url: "submitApprovalForManifestDB.do",
            type: "update",
            tranargs: {
                args: ["approvalManifestDBItems.num"]
            }},
        submitApprovalForSalesDiscount: {url: "submitApprovalForSalesDiscount.do",
            type: "update",
            tranargs: {
                args: ["approvalSalesDiscount.referMoney"]
            }},
        submitApprovalForDecorationHolonomy: {url: "submitApprovalForDecorationHolonomy.do",
            type: "update",
            tranargs: {
                args: ["approvalDecorationHolonomy.materialPrice"]
            }},

        approveApproval: {url: "approveApproval.do"},
        refuseApproval: {url: "refuseApproval.do"},
        deleteApprover: {url: "deleteApprover.do"},
        addApprover: {url: "addApprover.do"}

    }
});