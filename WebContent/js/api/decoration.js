
$.extend(api.index, {

    decorationIndex: {url: "/views/decoration/decoration.html"},
    decorationDetailIndex: {url: "/views/decoration/decorationDetail.html"},

    decorationActivityItemIndex: {url: "/views/decoration/decorationActivityItem.html"},

    decorationBelongIndex: {url: "/views/decoration/decorationBelong.html"},
    decorationBelongDetailIndex: {url: "/views/decoration/decorationBelongDetail.html"},
    decorationBelongInfoIndex: {url: "/views/decoration/decorationBelongInfo.html"},

    decorationTimelineIndex: {url: "/views/decoration/decorationTimeline.html"},
    backVisitIndex: {url: "/views/decoration/backVisit.html"},
    createOrderIndex: {url: "/views/decoration/createOrder.html"},

    auditIndex: {url: "/views/decoration/audit.html"},
    auditRecordIndex: {url: "/views/decoration/auditRecord.html"},

    decorationServiceIndex :{url:"/views/decoration/decorationService.html"},

    decorationFinalSettlementIndex : {url:"/views/decoration/decorationFinalSettlement.html"}
});

$.extend(api, {decoration: {
    pageBackVisitByOrderId: {url: "pageBackVisitByOrderId.do"},
    queryBackVisitByOrderId: {url: "queryBackVisitByOrderId.do", demo: true},
    addBackVisit: {url: "addBackVisit.do"},

    queryDecorationActivityByOrderId: {url: "queryDecorationActivityByOrderId.do", demo: true},
    queryDecorationActivityItem: {url: "queryDecorationActivityItem.do", demo: true},
    queryDecorationActivityItemForCouponAVaildByOrderId: {url: "queryDecorationActivityItemForCouponAVaildByOrderId.do"},
    addDecorationActivity: {url: "addDecorationActivity.do"},
    deleteDecorationActivity: {url: "deleteDecorationActivity.do"},
    lockDecorationActivity : {url : "lockDecorationActivity.do"},
    unlockDecorationActivity : {url : "unlockDecorationActivity.do"},
    abateDecorationActivityItem: {url: "abateDecorationActivityItem.do"},
    receiveDecorationActivityItem: {url: "receiveDecorationActivityItem.do"},
    deliveDecorationActivityItem: {url: "deliveDecorationActivityItem.do"},
    unrefundDecorationActivityItem: {url: "unrefundDecorationActivityItem.do"},
    upgradeDecorationAtivityItem: {url: "upgradeDecorationAtivityItem.do"},
    refundDecorationActivityItem: {url: "refundDecorationActivityItem.do"},
    expendDecorationActivityItem: {url: "expendDecorationActivityItem.do"},

    queryDecorationContractByOrderId: {url: "queryDecorationContractByOrderId.do", demo: true},
    saveDecorationContract: {url: "saveDecorationContract.do"},
    signDecorationContract: {url: "signDecorationContract.do"},
    resignDecorationContract: {url: "resignDecorationContract.do"},
    presignDecorationContract: {url: "presignDecorationContract.do"},
    makeDecorationMidpack : {url: "makeDecorationMidpack.do"},

    pageDecorationForGeneral: {url: "pageDecorationForGeneral.do", demo: true},
    pageDecorationForCommon: {url: "pageDecorationForCommon.do", demo: true},
    pageDecorationForDesigner: {url: "pageDecorationForDesigner.do", demo: true},
    pageDecorationForSalesman: {url: "pageDecorationForSalesman.do", demo: true},
    pageDecorationForQuoter: {url: "pageDecorationForQuoter.do", demo: true},
    pageDecorationForEscorter: {url: "pageDecorationForEscorter.do", demo: true},
    pageDecorationForBelong: {url: "pageDecorationForBelong.do", demo: true},
    pageDecorationForDesignerManager: {url: "pageDecorationForDesignerManager.do", demo: true},
    pageDecorationForSalesmanManager: {url: "pageDecorationForSalesmanManager.do", demo: true},
    pageDecoration: {url: "pageDecoration.do", demo: true},
    checkDecoration: {url: "checkDecoration.do", intercept: true},
    queryDecorationByCustomerId: {url: "queryDecorationByCustomerId.do"},
    queryDecorationByOrderId: {url: "queryDecorationByOrderId.do", demo: true},
    queryDecorationForCommonByOrderId: {url: "queryDecorationForCommonByOrderId.do", demo: true},
    createDecoration: {url: "createDecoration.do"},
    obsoleteDecoration: {url: "obsoleteDecoration.do"},
    terminalDecoration: {url: "terminalDecoration.do"},
    changeDecorationForAdvance: {url: "changeDecorationForAdvance.do"},

    queryDecorationInfoByOrderId: {url: "queryDecorationInfoByOrderId.do"},

    exportDecorationByContractTime: {url: "exportDecorationByContractTime.do"},

    queryDecorationBelongByOrderId: {url: "queryDecorationBelongByOrderId.do", demo: true},
    queryDecorationBelongForDesignAChangeByOrderId: {url: "queryDecorationBelongForDesignAChangeByOrderId.do", demo: true},
    queryDecorationBelongForDesignByOrderId: {url: "queryDecorationBelongForDesignByOrderId.do"},
    queryDecorationBelongForBusinessnAChangeByOrderId: {url: "queryDecorationBelongForBusinessnAChangeByOrderId.do", demo: true},
    queryDecorationBelongForBusinessnByOrderId: {url: "queryDecorationBelongForBusinessnByOrderId.do"},

    queryDecorationPictureByOrderId: {url: "queryDecorationPictureByOrderId.do", demo: true},
    addDecorationPicture: {url: "addDecorationPicture.do", intercept: true},
    deleteDecorationPicture: {url: "deleteDecorationPicture.do"},

    changeDecorationForOrderId: {url: "changeDecorationForOrderId.do"},
    changeDecorationForTime: {url: "changeDecorationForTime.do"},
    changeDecorationForVersionId: {url: "changeDecorationForVersionId.do"},
    changeDecorationForStatus: {url: "changeDecorationForStatus.do"},
    changeDecorationForHouse: {url: "changeDecorationForHouse.do"},
    subDecorationForQuotationTime: {url: "subDecorationForQuotationTime.do"},

	pageDecorationHolonomy: {url: "pageDecorationHolonomy.do"},
	queryDecorationHolonomy: {url: "queryDecorationHolonomy.do"},
	makeDecorationHolonomy: {url: "makeDecorationHolonomy.do"},

    pageDecorationInclusive: {url: "pageDecorationInclusive.do"},
    queryDecorationInclusive: {url: "queryDecorationInclusive.do"},
    makeDecorationInclusive: {url: "makeDecorationInclusive.do"},

    pageAudit: {url: "pageAudit.do"},
    applyAudit: {url: "applyAudit.do"},

    queryAuditRecordByOrderId: {url: "queryAuditRecordByOrderId.do"},
    addAuditRecord: {url: "addAuditRecord.do"},
    updateAuditRecord: {url: "updateAuditRecord.do"},

    queryAuditScaleByArid: {url: "queryAuditScaleByArid.do"},
    makeAuditScale: {url: "makeAuditScale.do"},
    updateAuditScaleForStatus: {url: "updateAuditScaleForStatus.do"},
    addAuditScale: {url: "addAuditScale.do"},
    deleteAuditScale: {url: "deleteAuditScale.do"},

    queryDecorationAccount:{url:"queryDecorationAccount.do"},
    makeDecorationAccount:{url:"makeDecorationAccount.do"},

    queryDecorationServiceByOrderId:{url:"queryDecorationServiceByOrderId.do"},
    completeDecorationService:{url:"completeDecorationService.do"},
    addDecorationService:{url:"addDecorationService.do"},

    queryDecorationAdditionByOrderId:{url:"queryDecorationAdditionByOrderId.do"},
    queryDecorationConfig: {url: "queryDecorationConfig.do"},

    queryDecorationUser:{url:"queryDecorationUser.do"},
    addDecorationUser:{url:"addDecorationUser.do"},
    deleteDecorationUser:{url:"deleteDecorationUser.do"},
    
    queryDecorationBalance : {url : "queryDecorationBalance.do"},
    makeDecorationBalance : {url : "makeDecorationBalance.do"}

}});
