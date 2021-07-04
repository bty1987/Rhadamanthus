$.extend(api.index, {

    decorationIndex: {url: "/views/decoration/decoration.html"},
    decorationDetailIndex: {url: "/views/decoration/decoration4detail.html"},

    decorationActivityItemIndex: {url: "/views/decoration/decoration4activity.html"},

    decorationBelongIndex: {url: "/views/decoration/decoration4belong.html"},
    decorationBelongDetailIndex: {url: "/views/decoration/decorationBelong.html"},
    decorationBelongInfoIndex: {url: "/views/decoration/decorationBelong4info.html"},

    decorationAccountOutputIndex: {url: "/views/decoration/decorationAccountOutput.html"},

    decorationTimelineIndex: {url: "/views/decoration/decoration4timeline.html"},
    backVisitIndex: {url: "/views/decoration/backVisit.html"},
    createOrderIndex: {url: "/views/decoration/decoration2create.html"},

    auditIndex: {url: "/views/decoration/audit.html"},
    auditRecordIndex: {url: "/views/decoration/audit4record.html"},

    decorationServiceIndex: {url: "/views/decoration/decorationService.html"},

    decorationFinalSettlementIndex: {url: "/views/decoration/decoration4account.html"},

    decorationContractIndex: {url: "/views/decoration/decorationContract.html"},
});

$.extend(api, {decoration: {
        pageBackVisitByOrderId: {url: "pageBackVisitByOrderId.do"},
        queryBackVisitByOrderId: {url: "queryBackVisitByOrderId.do", demo: true},
        addBackVisit: {url: "addBackVisit.do"},
        
        queryDecorationActivityByOrderId: {url: "queryDecorationActivityByOrderId.do", demo: true},
        queryDecorationActivityItem: {
        	url: "queryDecorationActivityItem.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "decorationActivityItems",
                args: ["num", "money"]
            }]},

        addDecorationActivity: {url: "addDecorationActivity.do"},
        deleteDecorationActivity: {url: "deleteDecorationActivity.do"},
        lockDecorationActivity: {url: "lockDecorationActivity.do"},
        unlockDecorationActivity: {url: "unlockDecorationActivity.do"},
        
        addDecorationActivityItem: {
            url: "addDecorationActivityItem.do",
            type: "update",
            tranargs: {
                args: ["decorationActivityItem.num", "decorationActivityItem.money"]
            }
        },
		abateDecorationActivityItem: {url: "abateDecorationActivityItem.do"},
		receiveDecorationActivityItem: {url: "receiveDecorationActivityItem.do"},
		deliveDecorationActivityItem: {url: "deliveDecorationActivityItem.do"},
		unrefundDecorationActivityItem: {url: "unrefundDecorationActivityItem.do"},
		refundDecorationActivityItem: {url: "refundDecorationActivityItem.do"},
		expendDecorationActivityItem: {url: "expendDecorationActivityItem.do"},
		discountDecorationActivityItem: {url: "discountDecorationActivityItem.do"},
		amountDecorationActivityItem: {url: "amountDecorationActivityItem.do"},
        
        queryDecorationContractByOrderId: {
        	url: "queryDecorationContractByOrderId.do", 
        	demo: true,
            type: "query",
            tranargs: [{
                result: "decorationContract-payments",
                args: ["referMoney"]
            }]},
        saveDecorationContract: {url: "saveDecorationContract.do"},
        signDecorationContract: {url: "signDecorationContract.do"},
        resignDecorationContract: {url: "resignDecorationContract.do"},
        presignDecorationContract: {
        	url: "presignDecorationContract.do",
            type: "update",
            tranargs: {
                args: ["decoration.precontractPrice"]
            }
        },

        queryDecorationMidpack: {
            url: "queryDecorationMidpack.do",
            type: "query",
            tranargs: [{
                result: "decorationMidpack",
                args: ["materialPrice", "materialPaidup", "servicePrice", "servicePaidup"]
            }]
        },
        makeDecorationMidpack: {
            url: "makeDecorationMidpack.do",
            type: "update",
            tranargs: {
                args: ["decorationMidpack.materialPrice", "decorationMidpack.servicePrice"]
            }
        },

        pageDecorationForGeneral: {
        	url: "pageDecorationForGeneral.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea","freeArea","innerArea","totalArea"]
            }]},
        pageDecorationForCommon: {
        	url: "pageDecorationForCommon.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea","freeArea","innerArea","totalArea"]
            }]},
        pageDecorationForCompany: {
            url: "pageDecorationForCompany.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea","freeArea","innerArea","totalArea"]
            }]},
        pageDecorationForGrade: {
        	url: "pageDecorationForGrade.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea","freeArea","innerArea","totalArea"]
            }]},
            
        pageDecorationForCustomer: {
            url: "pageDecorationForCustomer.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea","freeArea","innerArea","totalArea"]
            }]},
        pageDecorationForDesigner: {
        	url: "pageDecorationForDesigner.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea","freeArea","innerArea","totalArea"]
            }]},
        pageDecorationForSalesman: {
        	url: "pageDecorationForSalesman.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea","freeArea","innerArea","totalArea"]
            }]},
        pageDecorationForQuoter: {
        	url: "pageDecorationForQuoter.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea","freeArea","innerArea","totalArea"]
            }]},
        pageDecorationForEscorter: {
        	url: "pageDecorationForEscorter.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea","freeArea","innerArea","totalArea"]
            }]},
        pageDecorationForBelong: {
        	url: "pageDecorationForBelong.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea","freeArea","innerArea","totalArea"]
            }]},
        pageDecorationForDesignerManager: {
            url: "pageDecorationForDesignerManager.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea","freeArea","innerArea","totalArea"]
            }]
        },
        pageDecorationForSalesmanManager: {
        	url: "pageDecorationForSalesmanManager.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea","freeArea","innerArea","totalArea"]
            }]},
        pageDecoration: {
        	url: "pageDecoration.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea","freeArea","innerArea","totalArea"]
            }]},
        checkDecoration: {url: "checkDecoration.do", intercept: true},
        queryDecorationByCustomerId: {
        	url: "queryDecorationByCustomerId.do",
            type: "query",
            tranargs: [{
                result: "decorations",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }]},
        queryDecorationByOrderId: {
        	url: "queryDecorationByOrderId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "decoration",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "decoration-house",
                args: ["buildArea","freeArea","innerArea","totalArea"]
            }]},
        queryDecorationForCommonByOrderId: {
        	url: "queryDecorationForCommonByOrderId.do",
            demo: true,
                type: "query",
                tranargs: [{
                    result: "decoration",
                    args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
                }, {
                    result: "decoration-house",
                    args: ["buildArea","freeArea","innerArea","totalArea"]
                }]},
        createDecoration: {
        	url: "createDecoration.do",
            type: "update",
            tranargs: {
                args: ["decoration.notSalesmanRate"]
            }
        },
        createDecorationForAdvance: {
            url: "createDecorationForAdvance.do",
            type: "update",
            tranargs: {
                args: ["decoration.notSalesmanRate"]
            }
        },
        obsoleteDecoration: {url: "obsoleteDecoration.do"},
        terminalDecoration: {
        	url: "terminalDecoration.do",
        	type: "update",
            tranargs: {
                args: ["backup"]
            }
        },

        changeDecorationForAdvance: {
        	url: "changeDecorationForAdvance.do",
            type: "update",
            tranargs: {
                args: ["decoration.notSalesmanRate"]
            }
        },
        queryDecorationInfoByOrderId: {url: "queryDecorationInfoByOrderId.do"},
        sendDecorationInfoForConfirm: {url: "sendDecorationInfoForConfirm.do"},
        confirmDecorationInfo: {url: "confirmDecorationInfo.do"},
        exportDecorationByContractTime: {url: "exportDecorationByContractTime.do"},
        queryDecorationBelongByOrderId: {
        	url: "queryDecorationBelongByOrderId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "decorationBelongs",
                args: ["rate"]
            }]},
        queryDecorationBelongForDesignAChangeByOrderId: {
            url: "queryDecorationBelongForDesignAChangeByOrderId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "decorationBelongs",
                args: ["rate"]
            }]
        },
        queryDecorationBelongForDesignByOrderId: {
        	url: "queryDecorationBelongForDesignByOrderId.do",
            type: "query",
            tranargs: [{
                result: "decorationBelongs",
                args: ["rate"]
            }]
        },
        queryDecorationBelongForBusinessnAChangeByOrderId: {
            url: "queryDecorationBelongForBusinessnAChangeByOrderId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "decorationBelongs",
                args: ["rate"]
            }]
        },
        queryDecorationBelongForBusinessnByOrderId: {
        	url: "queryDecorationBelongForBusinessnByOrderId.do",
            type: "query",
            tranargs: [{
                result: "decorationBelongs",
                args: ["rate"]
            }]
        },
        queryDecorationPictureByOrderId: {url: "queryDecorationPictureByOrderId.do", demo: true},
        addDecorationPicture: {url: "addDecorationPicture.do", intercept: true},
        deleteDecorationPicture: {url: "deleteDecorationPicture.do"},

        changeDecorationForOrderId: {url: "changeDecorationForOrderId.do"},
        changeDecorationForTime: {url: "changeDecorationForTime.do"},
        changeDecorationForVersionId: {url: "changeDecorationForVersionId.do"},
        changeDecorationForStatus: {url: "changeDecorationForStatus.do"},
        changeDecorationForRepairStatus : {url: "changeDecorationForRepairStatus.do"},
        changeDecorationForHouse: {url: "changeDecorationForHouse.do"},
        subDecorationForQuotationTime: {url: "subDecorationForQuotationTime.do"},

        pageDecorationHolonomy: {
        	url: "pageDecorationHolonomy.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["maching", "discount", "discountBase", "projectBase", "projectPrice", "managePrice", "manageRate", "materialPrice", "servicePrice", "serviceRate", "materialPaidup", "servicePaidup"]
            }]},
        queryDecorationHolonomy: {
        	url: "queryDecorationHolonomy.do",
            type: "query",
            tranargs: [{
                result: "decorationHolonomy",
                args: ["maching", "discount", "discountBase", "projectBase", "projectPrice", "managePrice", "manageRate", "materialPrice", "servicePrice", "serviceRate", "materialPaidup", "servicePaidup"]
            }]},
        makeDecorationHolonomy: {
        	url: "makeDecorationHolonomy.do",
            type: "update",
            tranargs: {
                args: ["decorationHolonomy.maching", "decorationHolonomy.discount", "decorationHolonomy.manageRate", "decorationHolonomy.serviceRate", "decorationHolonomy.discountBase"],
                query:[{
                    result: "decorationHolonomy",
                    args:["projectPrice", "managePrice", "materialPrice", "servicePrice", "projectBase", "materialPaidup"]
                }]
            }},
        updateDecorationHolonomy: {
        	url: "updateDecorationHolonomy.do",
            type: "update",
            tranargs: {
                args: ["decorationHolonomy.materialPrice"]
            }},
        pageDecorationInclusive: {
        	url: "pageDecorationInclusive.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["contractPrice", "projectPrice", "cdiff", "mdiff", "managePrice", "manageRate", "materialPaidup"]
            }]
        },
        queryDecorationInclusive: {
        	url: "queryDecorationInclusive.do",
            type: "query",
            tranargs: [{
                result: "decorationInclusive",
                args: ["contractPrice", "projectPrice", "cdiff", "mdiff", "managePrice", "manageRate", "materialPaidup"]
            }]
        },
        makeDecorationInclusive: {
        	url: "makeDecorationInclusive.do",
            type: "update",
            tranargs: {
                args: [],
                query:[{
                    result: "decorationInclusive",
                    args:["contractPrice", "projectPrice", "cdiff", "mdiff", "managePrice", "materialPaidup"]
                }]
            }},
        pageAudit: {
        	url: "pageAudit.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["unitprice", "num", "discount"]
            }]},
        applyAudit: {url: "applyAudit.do"},
        queryAuditRecordByOrderId: {
        	url: "queryAuditRecordByOrderId.do",
            type: "query",
            tranargs: [{
                result: "auditRecords",
                args: ["unitprice", "num", "discount"]
            }]
        },
        addAuditRecord: {
        	url: "addAuditRecord.do",
            type: "update",
            tranargs: {
                args: ["auditRecord.unitprice", "auditRecord.num", "auditRecord.discount"]
            }
        },
        updateAuditRecord: {
        	url: "updateAuditRecord.do",
            type: "update",
            tranargs: {
                args: ["auditRecord.unitprice", "auditRecord.num", "auditRecord.discount"]
            }
        },
        queryAuditScaleByArid: {
        	url: "queryAuditScaleByArid.do",
            type: "query",
            tranargs: [{
                result: "auditScales",
                args: ["money"]
            }]},
        makeAuditScale: {
        	url: "makeAuditScale.do",
        	type: "update",
            tranargs: {
                args: ["auditScales.money"]
            }
        },
        updateAuditScaleForStatus: {url: "updateAuditScaleForStatus.do"},
        addAuditScale: {
        	url: "addAuditScale.do",
            type: "update",
            tranargs: {
                args: ["auditScale.money"]
            }},
        deleteAuditScale: {url: "deleteAuditScale.do"},
        queryDecorationAccount: {
        	url: "queryDecorationAccount.do",
            type: "query",
            tranargs: [{
                result: "decorationAccount",
                args: ["matching", "discount", "discountBase", "serviceRate", "materialPrice", "servicePrice", "difference", "coupon", "fulldel", "cashback"]
            }]},
        updateDecorationAccount: {
        	url: "updateDecorationAccount.do",
        	type: "update",
            tranargs: {
                args: ["decorationAccount.matching", "decorationAccount.discount", "decorationAccount.discountBase", "decorationAccount.serviceRate", "decorationAccount.materialPrice", "decorationAccount.servicePrice", "decorationAccount.difference", "decorationAccount.coupon", "decorationAccount.fulldel", "decorationAccount.cashback"]
            }},

        makeDecorationAccount: {url: "makeDecorationAccount.do"},
        queryDecorationServiceByOrderId: {url: "queryDecorationServiceByOrderId.do"},
        completeDecorationService: {url: "completeDecorationService.do"},
        addDecorationService: {url: "addDecorationService.do"},

        queryDecorationAdditionByOrderId: {url: "queryDecorationAdditionByOrderId.do"},
        queryDecorationConfig: {url: "queryDecorationConfig.do"},
        queryDecorationSchedule: {url: "queryDecorationSchedule.do"},

        queryDecorationUser: {url: "queryDecorationUser.do"},
        addDecorationUser: {url: "addDecorationUser.do"},
        deleteDecorationUser: {url: "deleteDecorationUser.do"},

        queryDecorationBalance: {
        	url: "queryDecorationBalance.do",
            type: "query",
            tranargs: [{
                result: "decorationBalance",
                args: ["balance"]
            }]},
        makeDecorationBalance: {
        	url: "makeDecorationBalance.do",
            type: "update",
            tranargs: {
                args: ["decorationBalance.balance"]
            }},

        queryDecorationFunction: {url: "queryDecorationFunction.do"},
        queryDecorationFunctionByName: {url: "queryDecorationFunctionByName.do"},
        
        
        sendDecorationContractForAuth : {url: "sendDecorationContractForAuth.do"},
        viewDecorationContract : {url: "viewDecorationContract.do"},
        signDecorationContractForCompany : {url: "signDecorationContractForCompany.do"},
        signDecorationContractForCustomer : {url: "signDecorationContractForCustomer.do"},
        addDecorationContract: {url: "addDecorationContract.do"},
        affixDecorationContract: {url: "affixDecorationContract.do"},
        expireDecorationContract: {url: "expireDecorationContract.do"},
        filingDecorationContract : {url: "filingDecorationContract.do"},
        showDecorationContract : {url: "showDecorationContract.do"},
        sendDecorationContract : {url: "sendDecorationContract.do"},
        redirectDecorationContract : {url: "redirectDecorationContract.do"}

}
});
