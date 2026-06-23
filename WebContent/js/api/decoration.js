$.extend(api.index, {

    decorationIndex: {
        url: "/views/decoration/decoration.html"
    },
    decorationDetailIndex: {
        url: "/views/decoration/decoration4detail.html"
    },

    decorationActivityItemIndex: {
        url: "/views/decoration/decoration4activity.html"
    },

    decorationBelongIndex: {
        url: "/views/decoration/decoration4belong.html"
    },
    decorationBelongDetailIndex: {
        url: "/views/decoration/decorationBelong.html"
    },
    decorationBelongInfoIndex: {
        url: "/views/decoration/decorationBelong4info.html"
    },

    decorationAccountIndex: {
        url: "/views/decoration/decorationAccount.html"
    },
    decorationAccountOutputIndex: {
        url: "/views/decoration/decorationAccountOutput.html"
    },
    decorationBalanceIndex: {
        url: "/views/decoration/decorationBalance.html"
    },

    decorationTimelineIndex: {
        url: "/views/decoration/decoration4timeline.html"
    },
    backVisitIndex: {
        url: "/views/decoration/backVisit.html"
    },
    createOrderIndex: {
        url: "/views/decoration/decoration2create.html"
    },

    auditIndex: {
        url: "/views/decoration/audit.html"
    },
    auditRecordIndex: {
        url: "/views/decoration/audit4record.html"
    },

    decorationServiceIndex: {
        url: "/views/decoration/decoration4service.html"
    },

    decorationReferIndex: {
        url: "/views/decoration/decoration4refer.html"
    },

    decorationFinalSettlementIndex: {
        url: "/views/decoration/decoration4account.html"
    },

    decorationContractIndex: {
        url: "/views/decoration/decorationContract.html"
    },

    decorationPictureIndex: {
        url: "/views/decoration/decorationPicture.html"
    },

    decorationSales2print: {
        url: "/views/decoration/decorationSales2print.html"
    },
});

$.extend(api, {
    decoration: {
        pageBackVisitByOrderId: {
            url: "pageBackVisitByOrderId.do"
        },
        queryBackVisitByOrderId: {
            url: "queryBackVisitByOrderId.do",
            demo: true
        },
        addBackVisit: {
            url: "addBackVisit.do"
        },

        queryDecorationActivityByOrderId: {
            url: "queryDecorationActivityByOrderId.do",
            demo: true,
            validate: {
                "decorationActivity.orderId": {
                    required: true,
                }
            }
        },
        amountDecorationActivity: {
            url: "amountDecorationActivity.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "decorationActivity",
                args: ["amount"]
            }]
        },
        queryDecorationActivityItem: {
            url: "queryDecorationActivityItem.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "decorationActivityItems",
                args: ["num", "money"]
            }]
        },
        addDecorationActivity: {
            url: "addDecorationActivity.do"
        },
        deleteDecorationActivity: {
            url: "deleteDecorationActivity.do"
        },
        lockDecorationActivity: {
            url: "lockDecorationActivity.do"
        },
        unlockDecorationActivity: {
            url: "unlockDecorationActivity.do"
        },
        addDecorationActivityItem: {
            url: "addDecorationActivityItem.do",
            type: "update",
            tranargs: {
                args: ["decorationActivityItem.num", "decorationActivityItem.money"]
            }
        },
        receiveDecorationActivityItem: {
            url: "receiveDecorationActivityItem.do"
        },
        abateDecorationActivityItem: {
            url: "abateDecorationActivityItem.do"
        },
        deliveDecorationActivityItem: {
            url: "deliveDecorationActivityItem.do"
        },
        unrefundDecorationActivityItem: {
            url: "unrefundDecorationActivityItem.do"
        },
        refundDecorationActivityItem: {
            url: "refundDecorationActivityItem.do"
        },
        expendDecorationActivityItem: {
            url: "expendDecorationActivityItem.do"
        },
        discountDecorationActivityItem: {
            url: "discountDecorationActivityItem.do"
        },
        consumeDecorationActivityItem: {
            url: "consumeDecorationActivityItem.do"
        },
        amountDecorationActivityItem: {
            url: "amountDecorationActivityItem.do",
            type: "query",
            tranargs: [{
                result: "decorationActivity",
                args: ["amount"]
            }]
        },
        sendDecorationActivityItem: {
            url: "sendDecorationActivityItem.do"
        },
        affirmDecorationActivityItem: {
            url: "affirmDecorationActivityItem.do"
        },
        pointDecorationActivityItem: {
            url: "pointDecorationActivityItem.do"
        },

        queryDecorationActivityRecord: {
            url: "queryDecorationActivityRecord.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "decorationActivityRecords-decorationActivityItem",
                args: ["num", "money"]
            }]
        },
        addDecorationActivityRecord: {
            url: "addDecorationActivityRecord.do"
        },

        queryDecorationContractByOrderId: {
            url: "queryDecorationContractByOrderId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "decorationContract-payments",
                args: ["referMoney"]
            }]
        },
        queryDecorationContract: {
            url: "queryDecorationContract.do"
        },
        noticeDecorationContract: {
            url: "noticeDecorationContract.do"
        },
        sendDecorationContractForAuth: {
            url: "sendDecorationContractForAuth.do"
        },

        queryDecorationMeasure: {
            url: "queryDecorationMeasure.do"
        },
        sendDecorationContract: {
            url: "sendDecorationContract.do"
        },
        redirectDecorationContract: {
            url: "redirectDecorationContract.do"
        },
        viewDecorationContract: {
            url: "viewDecorationContract.do"
        },
        signDecorationContractForCompany: {
            url: "signDecorationContractForCompany.do"
        },
        signDecorationContractForCustomer: {
            url: "signDecorationContractForCustomer.do"
        },
        addDecorationContract: {
            url: "addDecorationContract.do"
        },
        makeDecorationContract: {
            url: "makeDecorationContract.do"
        },
        affixDecorationContract: {
            url: "affixDecorationContract.do"
        },
        expireDecorationContract: {
            url: "expireDecorationContract.do"
        },
        filingDecorationContract: {
            url: "filingDecorationContract.do"
        },
        showDecorationContract: {
            url: "showDecorationContract.do"
        },
        queryDecorationContractRecord: {
            url: "queryDecorationContractRecord.do",
            demo: true
        },
        updateDecorationContract: {
            url: "updateDecorationContract.do"
        },

        failureDecorationMeasure: {
            url: "failureDecorationMeasure.do"
        },
        applayDecorationMeasure: {
            url: "applayDecorationMeasure.do"
        },
        presignDecorationContract: {
            url: "presignDecorationContract.do",
            type: "update",
            tranargs: {
                args: ["decoration.precontractPrice"]
            }
        },
        signDecorationContract: {
            url: "signDecorationContract.do"
        },
        resignDecorationContract: {
            url: "resignDecorationContract.do"
        },
        saveDecorationContract: {
            url: "saveDecorationContract.do"
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
                args: ["decorationMidpack.materialRate", "decorationMidpack.materialOrigin", "decorationMidpack.materialPrice", "decorationMidpack.serviceRate", "decorationMidpack.servicePrice"]
            }
        },
        updateDecorationMidpack: {
            url: "updateDecorationMidpack.do",
            type: "update",
            tranargs: {
                args: ["decorationMidpack.materialPrice"]
            }
        },
        updateDecorationMeasure: {
            url: "updateDecorationMeasure.do"
        },

        pageDecoration: {
            url: "pageDecoration.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea", "quoteArea"]
            }]
        },
        pageDecorationMeasure: {
            url: "pageDecorationMeasure.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data-decoration",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-decoration-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea", "quoteArea"]
            }]
        },
        pageDecorationMeasureForApplay: {
            url: "pageDecorationMeasureForApplay.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data-decoration",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-decoration-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea", "quoteArea"]
            }]
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
                args: ["buildArea", "freeArea", "innerArea", "totalArea", "quoteArea"]
            }]
        },
        pageDecorationForCommon: {
            url: "pageDecorationForCommon.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea", "quoteArea"]
            }]
        },
        pageDecorationForCompany: {
            url: "pageDecorationForCompany.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea", "quoteArea"]
            }]
        },
        pageDecorationForGrade: {
            url: "pageDecorationForGrade.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea", "quoteArea"]
            }]
        },
        pageDecorationForCustomer: {
            url: "pageDecorationForCustomer.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea", "quoteArea"]
            }]
        },
        pageDecorationForDesigner: {
            url: "pageDecorationForDesigner.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea", "quoteArea"]
            }]
        },
        pageDecorationForDesignerDept: {
            url: "pageDecorationForDesignerDept.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea", "quoteArea"]
            }]
        },
        pageDecorationForDesignerManager: {
            url: "pageDecorationForDesignerManager.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea", "quoteArea"]
            }]
        },
        pageDecorationForSalesman: {
            url: "pageDecorationForSalesman.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea", "quoteArea"]
            }]
        },
        pageDecorationForSalesmanDept: {
            url: "pageDecorationForSalesmanDept.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea", "quoteArea"]
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
                args: ["buildArea", "freeArea", "innerArea", "totalArea", "quoteArea"]
            }]
        },
        pageDecorationForQuoter: {
            url: "pageDecorationForQuoter.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea", "quoteArea"]
            }]
        },
        pageDecorationForEscorter: {
            url: "pageDecorationForEscorter.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea", "quoteArea"]
            }]
        },
        pageDecorationForMaterialer: {
            url: "pageDecorationForMaterialer.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea", "quoteArea"]
            }]
        },
        pageDecorationForBelong: {
            url: "pageDecorationForBelong.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea", "quoteArea"]
            }]
        },
        queryDecorationByCustomerId: {
            url: "queryDecorationByCustomerId.do",
            type: "query",
            tranargs: [{
                result: "decorations",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }]
        },
        queryDecorationForReferByOrderId: {
            url: "queryDecorationForReferByOrderId.do",
            type: "query",
            tranargs: [{
                result: "decorations",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }]
        },
        queryDecorationByOrderId: {
            url: "queryDecorationByOrderId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "decoration",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "decoration-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea"]
            }]
        },
        queryDecorationByDoid: {
            url: "queryDecorationByDoid.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "decoration",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "decoration-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea"]
            }]
        },
        queryDecorationForCommonByOrderId: {
            url: "queryDecorationForCommonByOrderId.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "decoration",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "decoration-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea"]
            }]
        },
        checkDecoration: {
            url: "checkDecoration.do",
            intercept: true
        },
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
        changeDecorationForAdvance: {
            url: "changeDecorationForAdvance.do",
            type: "update",
            tranargs: {
                args: ["decoration.house.buildArea", "decoration.house.innerArea"]
            }
        },
        changeDecorationForCustomer: {
            url: "changeDecorationForCustomer.do"
        },
        changeDecorationForHouse: {
            url: "changeDecorationForHouse.do"
        },
        changeDecorationForOrderId: {
            url: "changeDecorationForOrderId.do"
        },
        changeDecorationForTime: {
            url: "changeDecorationForTime.do"
        },
        changeDecorationForVersionId: {
            url: "changeDecorationForVersionId.do"
        },
        changeDecorationForPayScale: {
            url: "changeDecorationForPayScale.do"
        },
        changeDecorationForStatus: {
            url: "changeDecorationForStatus.do"
        },
        changeDecorationForRepairStatus: {
            url: "changeDecorationForRepairStatus.do"
        },
        obsoleteDecoration: {
            url: "obsoleteDecoration.do"
        },
        hiddenDecoration: {
            url: "hiddenDecoration.do"
        },
        terminalDecoration: {
            url: "terminalDecoration.do",
            type: "update",
            tranargs: {
                args: ["decorationPayments.referMoney"]
            }
        },
        subDecorationForQuotationTime: {
            url: "subDecorationForQuotationTime.do"
        },
        updateDecorationForAdvance: {
            url: "updateDecorationForAdvance.do",
            type: "update",
            tranargs: {
                args: ["decoration.notSalesmanRate"]
            }
        },
        updateDecorationForPayScale: {
            url: "updateDecorationForPayScale.do"
        },
        updateDecorationForSaleScale: {
            url: "updateDecorationForSaleScale.do"
        },
        resetDecorationFordesignStatus: {
            url: "resetDecorationFordesignStatus.do"
        },

        queryDecorationInfoByOrderId: {
            url: "queryDecorationInfoByOrderId.do"
        },
        queryDecorationInfoForCustomer: {
            url: "queryDecorationInfoForCustomer.do"
        },
        sendDecorationInfoForConfirm: {
            url: "sendDecorationInfoForConfirm.do"
        },
        confirmDecorationInfo: {
            url: "confirmDecorationInfo.do"
        },
        referDecorationInfo: {
            url: "referDecorationInfo.do"
        },
        deleteReferDecorationInfo: {
            url: "deleteReferDecorationInfo.do"
        },

        exportDecorationByContractTime: {
            url: "exportDecorationByContractTime.do"
        },

        queryDecorationBelong: {
            url: "queryDecorationBelong.do",
            type: "query",
            tranargs: [{
                result: "decorationBelongs",
                args: ["rate"]
            }]
        },
        tranDecorationBelong: {
            url: "tranDecorationBelong.do",
            type: "update",
            tranargs: {
                args: ["decorationBelongs.rate"]
            }
        },

        queryDecorationPictureByOrderId: {
            url: "queryDecorationPictureByOrderId.do",
            demo: true
        },
        downloadDecorationPicture: {
            url: "downloadDecorationPicture.do"
        },
        addDecorationPicture: {
            url: "addDecorationPicture.do",
            intercept: true
        },
        deleteDecorationPicture: {
            url: "deleteDecorationPicture.do"
        },
        batchDecorationPicture: {
            url: "batchDecorationPicture.do",
            intercept: true
        },

        pageDecorationHolonomy: {
            url: "pageDecorationHolonomy.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["maching", "discount", "discountBase", "projectBase", "projectPrice", "managePrice", "manageRate", "materialPrice", "servicePrice", "serviceRate", "materialPaidup", "servicePaidup"]
            }]
        },
        queryDecorationHolonomy: {
            url: "queryDecorationHolonomy.do",
            type: "query",
            tranargs: [{
                result: "decorationHolonomy",
                args: ["maching", "discount", "discountBase", "projectBase", "projectPrice", "managePrice", "manageRate", "materialPrice", "servicePrice", "serviceRate", "materialPaidup", "servicePaidup"]
            }]
        },
        makeDecorationHolonomy: {
            url: "makeDecorationHolonomy.do",
            type: "update",
            tranargs: {
                args: ["decorationHolonomy.maching", "decorationHolonomy.discount", "decorationHolonomy.manageRate", "decorationHolonomy.serviceRate", "decorationHolonomy.discountBase", "decorationHolonomy.trafficRate", "decorationHolonomy.taxRate"],
                query: [{
                    result: "decorationHolonomy",
                    args: ["projectPrice", "managePrice", "materialPrice", "servicePrice", "projectBase", "materialPaidup"]
                }]
            }
        },
        updateDecorationHolonomy: {
            url: "updateDecorationHolonomy.do",
            type: "update",
            tranargs: {
                args: ["decorationHolonomy.materialPrice"]
            }
        },

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
                query: [{
                    result: "decorationInclusive",
                    args: ["contractPrice", "projectPrice", "cdiff", "mdiff", "managePrice", "materialPaidup"]
                }]
            }
        },

        pageAudit: {
            url: "pageAudit.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["unitprice", "num", "discount"]
            }]
        },
        applyAudit: {
            url: "applyAudit.do"
        },
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
            }]
        },
        makeAuditScale: {
            url: "makeAuditScale.do",
            type: "update",
            tranargs: {
                args: ["auditScales.money"]
            }
        },
        addAuditScale: {
            url: "addAuditScale.do",
            type: "update",
            tranargs: {
                args: ["auditScale.money"]
            }
        },
        updateAuditScaleForStatus: {
            url: "updateAuditScaleForStatus.do"
        },
        deleteAuditScale: {
            url: "deleteAuditScale.do"
        },

        pageDecorationAccount: {
            url: "pageDecorationAccount.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["matching", "discount", "discountBase", "serviceRate", "materialPrice", "servicePrice", "projectPrice", "projectBase", "difference", "coupon", "internal", "fulldel", "cashback", "paidupMatching"]
            }, {
                result: "paging-data-decoration",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-decoration-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea", "quoteArea"]
            }]
        },
        queryDecorationAccount: {
            url: "queryDecorationAccount.do",
            type: "query",
            tranargs: [{
                result: "decorationAccount",
                args: ["matching", "discount", "discountBase", "serviceRate", "materialPrice", "servicePrice", "projectPrice", "projectBase", "difference", "coupon", "internal", "fulldel", "cashback"]
            }]
        },
        updateDecorationAccount: {
            url: "updateDecorationAccount.do",
            type: "update",
            tranargs: {
                args: ["decorationAccount.matching", "decorationAccount.discount", "decorationAccount.discountBase", "decorationAccount.serviceRate", "decorationAccount.materialPrice", "decorationAccount.servicePrice", "decorationAccount.projectPrice", "decorationAccount.projectBase", "decorationAccount.difference", "decorationAccount.coupon", "decorationAccount.internal", "decorationAccount.fulldel", "decorationAccount.cashback", "decorationAccount.paidupMatching"]
            }
        },
        makeDecorationAccount: {
            url: "makeDecorationAccount.do"
        },
        sendDecorationAccount: {
            url: "sendDecorationAccount.do"
        },
        affirmDecorationAccount: {
            url: "affirmDecorationAccount.do"
        },
        queryDecorationAccountItem: {
            url: "queryDecorationAccountItem.do",
            type: "query",
            tranargs: [{
                result: "decorationAccountItems",
                args: ["money", "rate"]
            }]
        },
        updateDecorationAccountItem: {
            url: "updateDecorationAccountItem.do",
            type: "update",
            tranargs: {
                args: ["decorationAccountItems.money", "decorationAccountItems.rate"]
            }
        },

        pageDecorationService: {
            url: "pageDecorationService.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data-decoration",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data--house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea", "quoteArea"]
            }]
        },
        queryDecorationServiceByOrderId: {
            url: "queryDecorationServiceByOrderId.do"
        },
        addDecorationService: {
            url: "addDecorationService.do"
        },
        completeDecorationService: {
            url: "completeDecorationService.do"
        },

        queryDecorationAdditionByOrderId: {
            url: "queryDecorationAdditionByOrderId.do"
        },
        queryDecorationConfig: {
            url: "queryDecorationConfig.do"
        },
        queryDecorationSchedule: {
            url: "queryDecorationSchedule.do"
        },

        pageDecorationForUser: {
            url: "pageDecorationForUser.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea"]
            }]
        },
        queryDecorationUser: {
            url: "queryDecorationUser.do"
        },
        addDecorationUser: {
            url: "addDecorationUser.do"
        },
        updateDecorationUser: {
            url: "updateDecorationUser.do"
        },
        deleteDecorationUser: {
            url: "deleteDecorationUser.do"
        },

        pageDecorationForBalance: {
            url: "pageDecorationForBalance.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["balance"]
            }, {
                result: "paging-data-decoration",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-decoration-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea"]
            }]
        },
        queryDecorationBalance: {
            url: "queryDecorationBalance.do",
            type: "query",
            tranargs: [{
                result: "decorationBalance",
                args: ["balance"]
            }]
        },
        makeDecorationBalance: {
            url: "makeDecorationBalance.do",
            type: "update",
            tranargs: {
                args: ["decorationBalance.balance"]
            }
        },

        queryDecorationFunction: {
            url: "queryDecorationFunction.do"
        },
        queryDecorationFunctionByName: {
            url: "queryDecorationFunctionByName.do"
        },
        queryDecorationAtttypeByType: {
            url: "queryDecorationAtttypeByType.do"
        },
        decorationatttype: {
            queryDecorationAtttypeByType: {
                url: "queryDecorationAtttypeByType.do"
            }
        }

    }
});

$.extend(tools, {
    decoration: {
        info: function(content, orderId) {

            com.post(api.decoration.queryDecorationForCommonByOrderId, {
                "decoration.orderId": orderId
            }, function(res) {

                var decoration = res.decoration;
                var typeness = constant.decoration().decoration.typeness.keys[decoration.typeness];

                com.showTip(content, "装修单号:" + decoration.orderId + "<br\>楼盘:" + decoration.house.village.name + "<br\>楼号:" + decoration.house.houseNumber + "<br\>类型:" + typeness + "<br\>等级:" + decoration.grade, "bottom");
            });
        },
        belong: function(content, orderId) {

            com.post(api.decoration.queryDecorationInfoByOrderId, {
                "orderId": orderId
            }, function(res) {

                var decorationInfo = res.decorationInfo;

                com.showTip(content, "非业务员名:" + decorationInfo.notSalesmanName + "<br\>非业务员电话:" + decorationInfo.notSalesmanPhone + "<br\>非业务员备注:" + decorationInfo.notSalesmanContent + "<br\>返单人员名:" + decorationInfo.backOrderName + "<br\>返单人员电话:" + decorationInfo.backOrderPhone + "<br\>返单人员备注:" + decorationInfo.backOrderContent, "bottom");
            });
        },

    }
});
