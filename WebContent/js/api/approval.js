
$.extend(api.index, {
    approvalTrackIndex: {url: "/views/approval/approvalTrack.html"},
    userApproveIndex: {url: "/views/approval/userApprove.html"},
    approvalTrackSenderIndex: {url: "/views/approval/approvalTrackSender.html"}
});

$.extend(api, {approval: {
    
	pageApprovalByReceiveId: {url: "pageApprovalByReceiveId.do", demo: true},
	pageApprovalBySenderId: {url: "pageApprovalBySenderId.do", demo: true},
	pageApprover: {url: "pageApprover.do", demo: true},
	queryApprovalByAId: {url: "queryApprovalByAId.do"},
	queryApprovalSalesRefundItem: {url: "queryApprovalSalesRefundItem.do"},
	queryApprovalManifestDBItem: {url: "queryApprovalManifestDBItem.do"},
	queryApprovalMaterialRefundItem: {url: "queryApprovalMaterialRefundItem.do"},
	queryApproverByType:{url: "queryApproverByType.do"},

//	submitApprovalForDecorationCustomer: {url: "submitApprovalForDecorationCustomer.do"},
//	submitApprovalForDecorationHouse: {url: "submitApprovalForDecorationHouse.do"},
	submitApprovalForDecorationBelong: {url: "submitApprovalForDecorationBelong.do"},
	submitApprovalForQuotationDiscount: {url: "submitApprovalForQuotationDiscount.do"},
	submitApprovalForDecorationRefund: {url: "submitApprovalForDecorationRefund.do"},
	submitApprovalForMaterialFullPayment: {url: "submitApprovalForMaterialFullPayment.do"},
	submitApprovalForMaterialRefund: {url: "submitApprovalForMaterialRefund.do"},
	submitApprovalForDecorationActivity: {url: "submitApprovalForDecorationActivity.do"},
	submitApprovalForSalesRefund: {url: "submitApprovalForSalesRefund.do"},
	submitApprovalForManifestDB:{url: "submitApprovalForManifestDB.do"},
	submitApprovalForSalesDiscount: {url: "submitApprovalForSalesDiscount.do"},

	approveApproval: {url: "approveApproval.do"},
	refuseApproval: {url: "refuseApproval.do"},
	deleteApprover: {url: "deleteApprover.do"},
	addApprover: {url: "addApprover.do"},
      
    
}});