
$.extend(api.index, {
    addReduceIndex: {url: "/views/decoration/addReduce.html"},
    addReduceDetailIndex: {url: "/views/decoration/addReduceDetail.html"},
    addReduceOutputIndex: {url: "/views/decoration/addReduceOutput.html"},

    decorationOrderDesignerIndex: {url: "/views/decoration/decorationOrderDesigner.html"},
    decorationOrderDesignerDetailIndex: {url: "/views/decoration/decorationOrderDesignerDetail.html"},

    decorationOrderSalesmanIndex: {url: "/views/decoration/decorationOrderSalesman.html"},

    decorationOrderCommonIndex: {url: "/views/decoration/decorationOrderCommon.html"},
    decorationOrderCommonDetailIndex: {url: "/views/decoration/decorationOrderCommonDetail.html"},

    decorationOrderAdvanceIndex: {url: "/views/decoration/decorationOrderAdvance.html"},
    decorationOrderAdvanceDetailIndex: {url: "/views/decoration/decorationOrderAdvanceDetail.html"},

    decorationActivityIndex: {url: "/views/decoration/decorationActivity.html"},
    decorationActivityItemIndex: {url: "/views/decoration/decorationActivityItem.html"},

    decorationOrderBelongIndex: {url: "/views/decoration/decorationOrderBelong.html"},
    decorationOrderBelongDetailIndex: {url: "/views/decoration/decorationOrderBelongDetail.html"},
    decorationOrderBelongInfoIndex: {url: "/views/decoration/decorationOrderBelongInfo.html"},

    decorationOrderStageIndex: {url: "/views/decoration/decorationOrderStage.html"},
    decorationOrderStageDetailIndex: {url: "/views/decoration/decorationOrderStageDetail.html"},

    decorationOrderApproveIndex: {url: "/views/decoration/decorationOrderApprove.html"},
    decorationOrderApproveDetailIndex: {url: "/views/decoration/decorationOrderApproveDetail.html"},

    decorationOrderTimelineIndex: {url: "/views/decoration/decorationOrderTimeline.html"},
    decorationOrderBackVisitIndex: {url: "/views/decoration/decorationOrderBackVisit.html"},
    backVisitIndex: {url: "/views/decoration/backVisit.html"},
    createOrderIndex: {url: "/views/decoration/createOrder.html"}
});

$.extend(api.ds, {
    decorationInfo: {url: "ds/decorationInfo.json", demo: true}
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
    convertDecorationActivityItem: {url: "convertDecorationActivityItem.do"},
    abateDecorationActivityItem: {url: "abateDecorationActivityItem.do"},
    receiveDecorationActivityItem: {url: "receiveDecorationActivityItem.do"},

    queryDecorationContractByOrderId: {url: "queryDecorationContractByOrderId.do", demo: true},
    saveDecorationContract: {url: "saveDecorationContract.do"},
    generateDecorationContract: {url: "../../generateDecorationContract.do"},
    signDecorationContract: {url: "signDecorationContract.do"},
    resignDecorationContract: {url: "resignDecorationContract.do"},

    pageDecorationOrderForGeneral: {url: "pageDecorationOrderForGeneral.do", demo: true},
    pageDecorationOrderForCommon: {url: "pageDecorationOrderForCommon.do", demo: true},
    pageDecorationOrderForDesigner: {url: "pageDecorationOrderForDesigner.do", demo: true},
    pageDecorationOrderForSalesman: {url: "pageDecorationOrderForSalesman.do", demo: true},
    pageDecorationOrderForMaterial: {url: "pageDecorationOrderForMaterial.do", demo: true},
    pageDecorationOrderForBelong: {url: "pageDecorationOrderForBelong.do", demo: true},
    pageDecorationOrderForAdvance: {url: "pageDecorationOrderForAdvance.do", demo: true},
    queryDecorationOrderByVillageIdAHouseNumber: {url: "queryDecorationOrderByVillageIdAHouseNumber.do"},
    queryDecorationOrderByCustomerId: {url: "queryDecorationOrderByCustomerId.do"},
    queryDecorationOrderForCondition: {url: "queryDecorationOrderForCondition.do", demo: true},
    queryDecorationOrderForDesignerByOrderId: {url: "queryDecorationOrderForDesignerByOrderId.do", demo: true},
    queryDecorationOrderForCommonByOrderId: {url: "queryDecorationOrderForCommonByOrderId.do", demo: true},
    checkDecorationOrderForExist: {url: "checkDecorationOrderForExist.do"},
    createDecorationOrder: {url: "createDecorationOrder.do"},
    obsoleteDecorationOrder: {url: "obsoleteDecorationOrder.do"},
    terminalDecorationOrder: {url: "terminalDecorationOrder.do"},
    changeDecorationOrderForAdvance: {url: "changeDecorationOrderForAdvance.do"},



    exportDecorationorderByContractTime: {url: "exportDecorationorderByContractTime.do"},

    queryDecorationBelongByOrderId: {url: "queryDecorationBelongByOrderId.do", demo: true},
    queryDecorationBelongForDesignAChangeByOrderId: {url: "queryDecorationBelongForDesignAChangeByOrderId.do", demo: true},
    queryDecorationBelongForDesignByOrderId: {url: "queryDecorationBelongForDesignByOrderId.do"},
    queryDecorationBelongForBusinessnAChangeByOrderId: {url: "queryDecorationBelongForBusinessnAChangeByOrderId.do", demo: true},
    queryDecorationBelongForBusinessnByOrderId: {url: "queryDecorationBelongForBusinessnByOrderId.do"},

    queryOrderDesignPictureByOrderId: {url: "queryOrderDesignPictureByOrderId.do"},
    addOrderDesignPicture: {url: "addOrderDesignPicture.do"},

    queryDecorationPictureByOrderId: {url: "queryDecorationPictureByOrderId.do", demo: true},
    addDecorationPicture: {url: "addDecorationPicture.do"},
    deleteDecorationPicture: {url: "deleteDecorationPicture.do"},
    
    changeDecorationOrderForOrderId: {url: "changeDecorationOrderForOrderId.do"},
    changeDecorationOrderForTime: {url: "changeDecorationOrderForTime.do"},
    changeDecorationOrderForVersionId: {url: "changeDecorationOrderForVersionId.do"},
    changeDecorationOrderForStatus: {url: "changeDecorationOrderForStatus.do"},
    changeDecorationOrderForType: {url: "cheangeDecorationOrderForType.do"},
    subDecorationOrderForQuotationTime: {url: "subDecorationOrderForQuotationTime.do"}
}});
