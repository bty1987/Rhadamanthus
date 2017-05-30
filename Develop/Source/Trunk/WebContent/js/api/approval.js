jQuery(function($) {
	var ds = {
		approvalType: {url: "ds/approvalType.json", demo: true},
	};
	
	var system = {
		pageApproveUser: {url: "pageApproveUser.do"},
                deleteApproveUser: {url: "deleteApproveUser.do"},
                updateApproveUser: {url: "updateApproveUser.do"},
                addApproveUser: {url: "addApproveUser.do"},
                queryApproveUserForNameByType: {url: "queryApproveUserForNameByType.do"},
	};
	approval= {
		
		pageApprovalByReceiveId: {url: "pageApprovalByReceiveId.do", demo: true},
		pageApprovalBySenderId: {url: "pageApprovalBySenderId.do", demo: true},
		queryApprovalByAId: {url: "queryApprovalByAId.do"},
		queryApprovalForMaterialRefundItem: {url: "queryApprovalForMaterialRefundItem.do"},
		queryApprovalManifestDBItem: {url: "queryApprovalManifestDBItem.do"},
		
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
		submitApprovalManifestDB: {url: "submitApprovalManifestDB.do"},

		approveApproval: {url: "approveApproval.do"},
		refuseApproval: {url: "refuseApproval.do"},
		
	};
	$.extend(api, {approval: approval});
	
	$.extend(api.system,system);
	
	$.extend(api.ds,ds);
	
});