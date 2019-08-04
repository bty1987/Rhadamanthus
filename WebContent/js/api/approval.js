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
        queryApprovalSalesRefundItem: {url: "queryApprovalSalesRefundItem.do"},
        queryApprovalManifestDBItem: {url: "queryApprovalManifestDBItem.do"},
        queryApprovalMaterialRefundItem: {url: "queryApprovalMaterialRefundItem.do"},
        queryApproverByType: {url: "queryApproverByType.do"},
        queryApprovalDecorationActivity: {url: "queryApprovalDecorationActivity.do"},
        queryApprovalCustomerOriginTDecoration: {url: "queryApprovalCustomerOriginTDecoration.do"},
        
        countApprovalForReceive: {url:"countApprovalForReceive.do"},
        countApprovalForSend: {url:"countApprovalForSend.do"},

        submitApprovalForCustomerOriginTDecoration:{url:"submitApprovalForCustomerOriginTDecoration.do"},
        // submitApprovalForDecorationCustomer: {url: "submitApprovalForDecorationCustomer.do"},
        // submitApprovalForDecorationHouse: {url: "submitApprovalForDecorationHouse.do"},
        submitApprovalForDecorationBelong: {url: "submitApprovalForDecorationBelong.do"},
        submitApprovalForQuotationDiscount: {url: "submitApprovalForQuotationDiscount.do"},
        submitApprovalForDecorationRefund: {url: "submitApprovalForDecorationRefund.do"},
        submitApprovalForMaterialFullPayment: {url: "submitApprovalForMaterialFullPayment.do"},
        submitApprovalForMaterialRefund: {url: "submitApprovalForMaterialRefund.do"},
        submitApprovalForDecorationActivity: {url: "submitApprovalForDecorationActivity.do"},
        submitApprovalForSalesRefund: {url: "submitApprovalForSalesRefund.do"},
        submitApprovalForManifestDB: {url: "submitApprovalForManifestDB.do"},
        submitApprovalForSalesDiscount: {url: "submitApprovalForSalesDiscount.do"},
        submitApprovalForDecorationHolonomy: {url: "submitApprovalForDecorationHolonomy.do"},

        approveApproval: {url: "approveApproval.do"},
        refuseApproval: {url: "refuseApproval.do"},
        deleteApprover: {url: "deleteApprover.do"},
        addApprover: {url: "addApprover.do"},

    }
});