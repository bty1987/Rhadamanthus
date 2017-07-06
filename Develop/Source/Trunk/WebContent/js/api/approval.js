
$.extend(api.index, {
    approvalTrackIndex: {url: "/views/approval/approvalTrack.html"},
    userApproveIndex: {url: "/views/approval/userApprove.html"},
    approvalTrackSenderIndex: {url: "/views/approval/approvalTrackSender.html"}
});

$.extend(api.ds, {
	approvalType: {url: "ds/approvalType.json", demo: true},
});

$.extend(api, {approval: {
    
	pageApprovalByReceiveId: {url: "pageApprovalByReceiveId.do", demo: true},
	pageApprovalBySenderId: {url: "pageApprovalBySenderId.do", demo: true},
	pageApproveUser: {url: "pageApproveUser.do", demo: true},
	queryApprovalByAId: {url: "queryApprovalByAId.do"},
    queryApproveUserForNameByType: {url: "queryApproveUserForNameByType.do"},
	queryApprovalSalesRefundItem: {url: "queryApprovalSalesRefundItem.do"},
    queryApprovalManifestDBItem: {url: "queryApprovalManifestDBItem.do"},
    queryApprovalMaterialRefundItem: {url: "queryApprovalMaterialRefundItem.do"},
        
	submitApprovalForCustomer: {url: "submitApprovalForCustomer.do"},
	submitApprovalForVillage: {url: "submitApprovalForVillage.do"},
	submitApprovalForOrderBelong: {url: "submitApprovalForOrderBelong.do"},
	submitApprovalForQuotationDiscount: {url: "submitApprovalForQuotationDiscount.do"},
	submitApprovalForDecorationRefund: {url: "submitApprovalForDecorationRefund.do"},
	submitApprovalForMaterialFullPayment: {url: "submitApprovalForMaterialFullPayment.do"},
	submitApprovalForMaterialRefund: {url: "submitApprovalForMaterialRefund.do"},
	submitApprovalForMaterialOutsideRefund: {url: "submitApprovalForMaterialOutsideRefund.do"},
	submitApprovalForDecorationActivity: {url: "submitApprovalForDecorationActivity.do"},
	submitApprovalForSalesRefund: {url: "submitApprovalForSalesRefund.do"},
	submitApprovalForManifestDB:{url: "submitApprovalForManifestDB.do"},
      submitApprovalForSalesDiscount: {url: "submitApprovalForSalesDiscount.do"},

	approveApproval: {url: "approveApproval.do"},
	refuseApproval: {url: "refuseApproval.do"},
    deleteApproveUser: {url: "deleteApproveUser.do"},
    addApproveUser: {url: "addApproveUser.do"},
      
    
}});