
$.extend(api.index, {
    functionAreaIndex: {url: "/views/quotation/functionArea.html"},
    quotationItemIndex: {url: "/views/quotation/quotationItem.html"},
    quotationVersionIndex: {url: "/views/quotation/quotationVersion.html"},
    systemDefineItemIndex: {url: "/views/quotation/systemDefineItem.html"},

    quotationIndex: {url: "/views/quotation/quotationIndex.html"},
    quotationDetailIndex: {url: "/views/quotation/quotationDetail.html"},
    quotationPartIndex: {url: "/views/quotation/quotationPart.html"},
    quotationWholeIndex: {url: "/views/quotation/quotationWhole.html"},
    quotationOutputIndex: {url: "/views/quotation/quotationOutput.html"},

    addReduceIndex: {url: "/views/quotation/addReduce.html"},
    addReduceDetailIndex: {url: "/views/quotation/addReduceDetail.html"},
    addReduceOutputIndex: {url: "/views/quotation/addReduceOutput.html"},

    extensionIndex: {url: "/views/quotation/extension.html"},
    extensionDetailIndex: {url: "/views/quotation/extensionDetail.html"},

    quotetionIndex:{url: "/views/quotation/quotetionIndex.html"},
    quotetionPartIndex : {url:"/views/quotation/quotetionPart.html"},
    quotetionCompareIndex : {url:"/views/quotation/quotetionCompare.html"},

    selectionIndex:{url: "/views/quotation/selection.html"},
    selectionOutputIndex:{url: "/views/quotation/selectionOutput.html"},
});

$.extend(api, {quotation: {

    queryQuotationClassification: {url: "queryQuotationClassification.do", demo: true},
    queryQuotationBigCategory: {url: "queryQuotationBigCategory.do", demo: true},
    queryQuotationSmallCategory: {url: "queryQuotationSmallCategory.do", demo: true},
    queryQuotationType: {url: "queryQuotationType.do", demo: true},

    pageQuotationVersion: {
        url: "pageQuotationVersion.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "paging-data",
            args: ["trafficRate", "manageRate"]
        }]
    },
    queryQuotationVersion: {
        url: "queryQuotationVersion.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "quotationVersions",
            args: ["trafficRate", "manageRate"]
        }]
    },
    queryQuotationVersionByVersionId: {
        url: "queryQuotationVersionByVersionId.do",
        type: "query",
        tranargs: [{
            result: "quotationVersion",
            args: ["trafficRate", "manageRate"]
        }]
    },
    addQuotationVersion: {
        url: "addQuotationVersion.do",
        type: "update",
        tranargs: {
            args: ["quotationVersion.trafficRate", "quotationVersion.manageRate"]
        }
    },
    updateQuotationVersion: {
        url: "updateQuotationVersion.do",
        type: "update",
        tranargs: {
            args: ["quotationVersion.trafficRate", "quotationVersion.manageRate"]
        }
    },
    updateQuotationForStatus: {url: "updateQuotationForStatus.do"},

    pageFunctionArea: {
        url: "pageFunctionArea.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "paging-data",
            args: ["total"]
        }]
    },
    queryFunctionAreaByIdAVersionId: {
        url: "queryFunctionAreaByIdAVersionId.do",
        type: "query",
        tranargs: [{
            result: "functionArea",
            args: ["total"]
        }]
    },
    queryFunctionAreaByVersionId: {
        url: "queryFunctionAreaByVersionId.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "functionArea",
            args: ["total"]
        }]
    },
    addFunctionArea: {
        url: "addFunctionArea.do",
        type: "update",
        tranargs: {
            args: ["functionArea.total"]
        }
    },
    updateFunctionArea: {
        url: "updateFunctionArea.do",
        type: "update",
        tranargs: {
            args: ["functionArea.total"]
        }
    },
    deleteFunctionArea: {url: "deleteFunctionArea.do"},

    pageQuotationItem: {
        url: "pageQuotationItem.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "paging-data",
            args: ["addPrice", "unitPrice", "subPrice"]
        }]
    },
    pageQuotationItemByVersionId: {
        url: "pageQuotationItemByVersionId.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "paging-data",
            args: ["addPrice", "unitPrice", "subPrice"]
        }]
    },
    queryQuotationItemByItemIdAVersionId: {
        url: "queryQuotationItemByItemIdAVersionId.do",
        type: "query",
        tranargs: [{
            result: "quotationItem",
            args: ["addPrice", "unitPrice", "subPrice"]
        }]
    },
    addQuotationItem: {
        url: "addQuotationItem.do",
        type: "update",
        tranargs: {
            args: ["quotationItem.addPrice", "quotationItem.unitPrice", "quotationItem.subPrice"]
        }
    },
    updateQuotationItem: {
        url: "updateQuotationItem.do",
        type: "update",
        tranargs: {
            args: ["quotationItem.addPrice", "quotationItem.unitPrice", "quotationItem.subPrice"]
        }
    },
    updateQuotationItemForStatus: {url: "updateQuotationItemForStatus.do"},
    updateQuotationItemForDiscount: {url: "updateQuotationItemForDiscount.do"},

    queryFunctionAreaItemByFunctionAreaId: {
        url: "queryFunctionAreaItemByFunctionAreaId.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "functionAreaItems-quotationItem",
            args: ["addPrice", "unitPrice", "subPrice"]
        }]
    },
    addFunctionAreaItem: {url: "addFunctionAreaItem.do"},
    deleteFunctionAreaItemByIds: {url: "deleteFunctionAreaItemByIds.do"},

    pageSystemDefineItem: {
        url: "pageSystemDefineItem.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "paging-data",
            args: ["addPrice", "unitPrice", "subPrice"]
        }]
    },
    pageSystemDefineItemForEnable: {
        url: "pageSystemDefineItemForEnable.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "paging-data",
            args: ["addPrice", "unitPrice", "subPrice"]
        }]
    },
    querySystemDefineItemByItemId: {
        url: "querySystemDefineItemByItemId.do",
        type: "query",
        tranargs: [{
            result: "systemDefineItem",
            args: ["addPrice", "unitPrice", "subPrice"]
        }]
    },
    addSystemDefineItem: {
        url: "addSystemDefineItem.do",
        type: "update",
        tranargs: {
            args: ["systemDefineItem.addPrice", "systemDefineItem.unitPrice", "systemDefineItem.subPrice"]
        }
    },
    updateSystemDefineItem: {
        url: "updateSystemDefineItem.do",
        type: "update",
        tranargs: {
            args: ["systemDefineItem.addPrice", "systemDefineItem.unitPrice", "systemDefineItem.subPrice"]
        }
    },
    updateSystemDefineItemForStatus: {url: "updateSystemDefineItemForStatus.do"},
    updateSystemDefineItemForDiscount: {url: "updateSystemDefineItemForDiscount.do"},
    deleteSystemDefineItem: {url: "deleteSystemDefineItem.do"},

    pageQuotationBigCategory: {url: "pageQuotationBigCategory.do"},
    pageQuotationType: {url: "pageQuotationType.do"},
    pageQuotationSmallCategory: {url: "pageQuotationSmallCategory.do"},
    pageQuotationClassification: {url: "pageQuotationClassification.do"},

    queryQuotationByOrderId: {
        url: "queryQuotationByOrderId.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "quotations",
            args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "notSalesmanRate"]
        }]
    },
    queryQuotationForDefaultByOrderId: {
        url: "queryQuotationForDefaultByOrderId.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "quotation",
            args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "notSalesmanRate"]
        }]
    },
    queryQuotationById: {
        url: "queryQuotationById.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "quotation",
            args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "notSalesmanRate"]
        }]
    },
    queryQuotationForConfig: {url: "queryQuotationForConfig.do", demo: true},
    addQuotation: {url: "addQuotation.do"},
    updateQuotation: {url: "updateQuotation.do"},
    updateQuotationForAdvance: {
        url: "updateQuotationForAdvance.do",
        type: "update",
        tranargs: {
            args: ["quotation.discount", "quotation.totalPrice", "quotation.undisPrice", "quotation.disPrice", "quotation.manageRate", "quotation.managePrice", "quotation.trafficRate", "quotation.trafficPrice", "quotation.basePrice"]
        }
    },
    deleteQuotationById: {url: "deleteQuotationById.do"},
    replicaQuotation: {
        url: "replicaQuotation.do",
        type: "update",
        tranargs: {
            args: [],
            query: [{
                result: "quotation",
                args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "notSalesmanRate"]
            }]
        }
    },
    cloneQuotation: {
        url: "cloneQuotation.do",
        type: "update",
        tranargs: {
            args: [],
            query: [{
                result: "quotation",
                args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "notSalesmanRate"]
            }]
        }
    },
    copyQuotation: {
        url: "copyQuotation.do",
        type: "update",
        tranargs: {
            args: [],
            query: [{
                result: "quotation",
                args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "notSalesmanRate"]
            }]
        }
    },
    changeQuotationForDefault: {url: "changeQuotationForDefault.do"},
    lockQuotation: {url: "lockQuotation.do"},
    unlockQuotation: {url: "unlockQuotation.do"},

    queryQuotationFunctionAreaForCommonByQuotationId: {
        url: "queryQuotationFunctionAreaForCommonByQuotationId.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "quotationFunctionAreas",
            args: ["total"]
        }]
    },
    queryQuotationFunctionAreaByQuotationId: {
        url: "queryQuotationFunctionAreaByQuotationId.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "quotationFunctionAreas",
            args: ["total"]
        },{
            result: "quotationFunctionAreas-quotationFunctionAreaItems",
            args: ["unitPrice", "initNum", "num"]
        }]
    },
    addQuotationFunctionArea: {url: "addQuotationFunctionArea.do"},
    addQuotationFunctionAreaByFunctionAreaIds: {
        url: "addQuotationFunctionAreaByFunctionAreaIds.do",
        type: "update",
        tranargs: {
            args: ["quotation.discount", "quotation.totalPrice", "quotation.undisPrice", "quotation.disPrice", "quotation.manageRate", "quotation.managePrice", "quotation.trafficRate", "quotation.trafficPrice", "quotation.basePrice"],
            query: [{
                result: "quotationFunctionAreas",
                args: ["total"]
            },{
                result: "quotationFunctionAreas-quotationFunctionAreaItems",
                args: ["unitPrice", "initNum", "num"]
            }]
        }
    },
    updateQuotationFunctionArea: {
        url: "updateQuotationFunctionArea.do",
        type: "update",
        tranargs: {
            args: ["quotation.discount", "quotation.totalPrice", "quotation.undisPrice", "quotation.disPrice", "quotation.manageRate", "quotation.managePrice", "quotation.trafficRate", "quotation.trafficPrice", "quotation.basePrice"]
        }
    },
    deleteQuotationFunctionArea: {
        url: "deleteQuotationFunctionArea.do",
        type: "update",
        tranargs: {
            args: ["quotation.discount", "quotation.totalPrice", "quotation.undisPrice", "quotation.disPrice", "quotation.manageRate", "quotation.managePrice", "quotation.trafficRate", "quotation.trafficPrice", "quotation.basePrice"]
        }
    },

    queryQuotationFunctionAreaItemByQuotationFunctionAreaId: {
        url: "queryQuotationFunctionAreaItemByQuotationFunctionAreaId.do",
        type: "query",
        tranargs: [{
            result: "quotationFunctionAreaItems",
            args: ["initNum", "num", "addPrice", "unitPrice", "subPrice"]
        }]
    },
    updateQuotationFunctionAreaItem: {
        url: "updateQuotationFunctionAreaItem.do",
        intercept: true,
        type: "update",
        tranargs: {
            args: [
                "quotation.discount", "quotation.totalPrice", "quotation.undisPrice", "quotation.disPrice", "quotation.manageRate", "quotation.managePrice", "quotation.trafficRate", "quotation.trafficPrice", "quotation.basePrice",
                "quotationFunctionAreaItem.initNum", "quotationFunctionAreaItem.num", "quotationFunctionAreaItem.addPrice", "quotationFunctionAreaItem.unitPrice", "quotationFunctionAreaItem.subPrice"
            ]
        }
    },
    updateQuotationFunctionAreaItemForSpec: {
        url: "updateQuotationFunctionAreaItemForSpec.do",
        type: "update",
        tranargs: {
            args: [
                "quotation.discount", "quotation.totalPrice", "quotation.undisPrice", "quotation.disPrice", "quotation.manageRate", "quotation.managePrice", "quotation.trafficRate", "quotation.trafficPrice", "quotation.basePrice",
                "quotationFunctionAreaItem.addPrice", "quotationFunctionAreaItem.unitPrice", "quotationFunctionAreaItem.subPrice"
            ]
        }
    },
    updateQuotationFunctionAreaItemForIndex: {url:"updateQuotationFunctionAreaItemForIndex.do", intercept: true},
    updateQuotationFunctionAreaItemByQuotationIdAType: {
        url: "updateQuotationFunctionAreaItemByQuotationIdAType.do",
        type: "update",
        tranargs: {
            args: [
                "quotationFunctionAreaItem.unitPrice"
            ]
        }
    },
    deleteQuotationFunctionAreaItem: {
        url: "deleteQuotationFunctionAreaItem.do",
        intercept: true,
        type: "update",
        tranargs: {
            args: [
                "quotation.discount", "quotation.totalPrice", "quotation.undisPrice", "quotation.disPrice", "quotation.manageRate", "quotation.managePrice", "quotation.trafficRate", "quotation.trafficPrice", "quotation.basePrice",
            ]
        }
    },

    pageExtensionByOrderId: {
        url: "pageExtensionByOrderId.do",
        type: "query",
        tranargs: [{
            result: "paging-data",
            args: ["undisPrice", "disPrice", "total"]
        }]
    },
    queryExtensionByOrderId: {
        url: "queryExtensionByOrderId.do",
        type: "query",
        tranargs: [{
            result: "extensions",
            args: ["undisPrice", "disPrice", "total"]
        }]
    },
    queryExtensionByEid: {
        url: "queryExtensionByEid.do",
        type: "query",
        tranargs: [{
            result: "extension",
            args: ["undisPrice", "disPrice", "total"]
        }]
    },
    addExtension: {url: "addExtension.do"},
    updateExtension: {url: "updateExtension.do",  intercept: true},
    updateExtensionForAdvance: {
        url: "updateExtensionForAdvance.do",
        intercept: true,
        type: "update",
        tranargs: {
            args: [
                "extension.undisPrice", "extension.disPrice", "extension.total"
            ]
        }
    },
    deleteExtension: {url: "deleteExtension.do",  intercept: true},

    queryExtensionItemByEid: {
        url: "queryExtensionItemByEid.do",
        type: "query",
        tranargs: [{
            result: "extensionItems",
            args: ["addPrice", "unitPrice", "subPrice", "num"]
        }]
    },
    queryExtensionItemByEids: {
        url: "queryExtensionItemByEids.do",
        type: "query",
        tranargs: [{
            result: "extensionItems",
            args: ["addPrice", "unitPrice", "subPrice", "num"]
        }]
    },
    updateExtensionItem: {
        url: "updateExtensionItem.do",
        intercept: true,
        type: "update",
        tranargs: {
            args: [
                "extension.undisPrice", "extension.disPrice", "extension.total",
                "extensionItem.addPrice", "extensionItem.unitPrice", "extensionItem.subPrice", "extensionItem.num"
            ]
        }
    },
    deleteExtensionItem: {
        url: "deleteExtensionItem.do",
        intercept: true,
        type: "update",
        tranargs: {
            args: [
                "extension.undisPrice", "extension.disPrice", "extension.total"
            ]
        }
    },

    queryQuotetion: {
        url: "queryQuotetion.do",
        type: "query",
        tranargs: [{
            result: "quotetions",
            args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice"]
        }]
    },
    queryQuotetionByQid: {
        url: "queryQuotetionByQid.do",
        type: "query",
        tranargs: [{
            result: "quotetion",
            args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice"]
        }]
    },
    queryQuotetionByNo: {
        url: "queryQuotetionByNo.do",
        type: "query",
        tranargs: [{
            result: "quotetion",
            args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice"]
        }]
    },
    addQuotetion: {url: "addQuotetion.do"},
    updateQuotetion: {url: "updateQuotetion.do"},
    updateQuotetionForAdvance: {
        url: "updateQuotetionForAdvance.do",
        type: "update",
        tranargs: {
            args: ["quotetion.discount", "quotetion.totalPrice", "quotetion.undisPrice", "quotetion.disPrice", "quotetion.manageRate", "quotetion.managePrice", "quotetion.trafficRate", "quotetion.trafficPrice", "quotetion.basePrice"]
        }
    },
    deleteQuotetion: {url: "deleteQuotetion.do"},
    replicaQuotetion: {
        url: "replicaQuotetion.do",
        type: "update",
        tranargs: {
            args: [],
            query: [{
                result: "quotetion",
                args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "notSalesmanRate"]
            }]
        }
    },
    cloneQuotetion: {
        url: "cloneQuotetion.do",
        type: "update",
        tranargs: {
            args: [],
            query: [{
                result: "quotetion",
                args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "notSalesmanRate"]
            }]
        }
    },
    copyQuotetion: {
        url: "copyQuotetion.do",
        type: "update",
        tranargs: {
            args: [],
            query: [{
                result: "quotetion",
                args: ["discount", "totalPrice", "undisPrice", "disPrice", "manageRate", "managePrice", "trafficRate", "trafficPrice", "basePrice", "notSalesmanRate"]
            }]
        }
    },

    queryQuotetionFunctionAreaByQid: {
        url: "queryQuotetionFunctionAreaByQid.do",
        type: "query",
        tranargs: [{
            result: "quotetionFunctionAreas-quotetionFunctionAreaItems",
            args: ["unitPrice", "num"]
        }]
    },
    addQuotetionFuctionArea: {
        url: "addQuotetionFuctionArea.do",
        type: "update",
        tranargs: {
            args: ["quotetion.discount", "quotetion.totalPrice", "quotetion.undisPrice", "quotetion.disPrice", "quotetion.manageRate", "quotetion.managePrice", "quotetion.trafficRate", "quotetion.trafficPrice", "quotetion.basePrice"],
            query: [{
                result: "quotetionFunctionAreas-quotetionFunctionAreaItems",
                args: ["unitPrice", "num"]
            }]
        }
    },
    updateQuotetionFunctionArea: {
        url: "updateQuotetionFunctionArea.do",
        type: "update",
        tranargs: {
            args: ["quotetion.discount", "quotetion.totalPrice", "quotetion.undisPrice", "quotetion.disPrice", "quotetion.manageRate", "quotetion.managePrice", "quotetion.trafficRate", "quotetion.trafficPrice", "quotetion.basePrice"],
        }
    },
    deleteQuotetionFunctionArea: {
        url: "deleteQuotetionFunctionArea.do",
        type: "update",
        tranargs: {
            args: ["quotetion.discount", "quotetion.totalPrice", "quotetion.undisPrice", "quotetion.disPrice", "quotetion.manageRate", "quotetion.managePrice", "quotetion.trafficRate", "quotetion.trafficPrice", "quotetion.basePrice"],
        }
    },

    updateQuotetionFunctionAreaItem: {
        url: "updateQuotetionFunctionAreaItem.do",
        intercept: true,
        type: "update",
        tranargs: {
            args: [
                "quotetion.discount", "quotetion.totalPrice", "quotetion.undisPrice", "quotetion.disPrice", "quotetion.manageRate", "quotetion.managePrice", "quotetion.trafficRate", "quotetion.trafficPrice", "quotetion.basePrice",
                "quotetionFunctionAreaItem.unitPrice", "quotetionFunctionAreaItem.num"
            ],
        }
    },
    updateQuotetionFunctionAreaItemForIndex: {url: "updateQuotetionFunctionAreaItemForIndex.do", intercept: true},
    updateQuotetionFunctionAreaItemForSpec: {
        url: "updateQuotetionFunctionAreaItemForSpec.do",
        intercept: true,
        type: "update",
        tranargs: {
            args: [
                "quotetion.discount", "quotetion.totalPrice", "quotetion.undisPrice", "quotetion.disPrice", "quotetion.manageRate", "quotetion.managePrice", "quotetion.trafficRate", "quotetion.trafficPrice", "quotetion.basePrice",
                "quotetionFunctionAreaItem.unitPrice"
            ],
        }
    },
    deleteQuotetionFunctionAreaItem: {
        url: "deleteQuotetionFunctionAreaItem.do",
        intercept: true,
        type: "update",
        tranargs: {
            args: [
                "quotetion.discount", "quotetion.totalPrice", "quotetion.undisPrice", "quotetion.disPrice", "quotetion.manageRate", "quotetion.managePrice", "quotetion.trafficRate", "quotetion.trafficPrice", "quotetion.basePrice"
            ],
        }
    },
    // -------- 选材单 -------------------------
    querySelectionByOrderId: {
        url: "querySelectionByOrderId.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "selection",
            args: [
                "total",
                "quotationTotal",
                "extensionAddTotal",
                "extensionReduceTotal",
                "addReduceAddTotal",
                "addReduceMinusTotal"
            ]
        }]
    },
    querySelectionByQid: {
        url: "querySelectionByQid.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "selection",
            args: [
                "total",
                "quotationTotal",
                "extensionAddTotal",
                "extensionReduceTotal",
                "addReduceAddTotal",
                "addReduceMinusTotal"
            ]
        }]
    },
    updateSelectionForAdvance: {
        url: "updateSelectionForAdvance.do",
        intercept: true,
        type: "update",
        tranargs: {
            args: [
                "selection.total",
                "selection.quotationTotal",
                "selection.extensionAddTotal",
                "selection.extensionReduceTotal",
                "selection.addReduceAddTotal",
                "selection.addReduceMinusTotal"
            ],
        }
    },
    addSelection: {url: "addSelection.do"},
    // -------- 选材项 -------------------------
    pageSelectionItem: {
        url: "pageSelectionItem.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "paging-data",
            args: ["num", "initNum", "postprice", "preprice"]
        },{
            result: "paging-data-decoration-house",
            args: ["buildArea"]
        }]
    },
    pageSelectionItemForSupplier: {
        url: "pageSelectionItemForSupplier.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "paging-data",
            args: ["num", "initNum", "postprice", "preprice"]
        },{
            result: "paging-data-decoration-house",
            args: ["buildArea"]
        }]
    },
    pageSelectionItemForEscorter: {
        url: "pageSelectionItemForEscorter.do",
            demo: true,
            type: "query",
            tranargs: [{
            result: "paging-data",
            args: ["num", "initNum", "postprice", "preprice"]
        },{
            result: "paging-data-decoration-house",
            args: ["buildArea"]
        }]
    },
    querySelectionItemByOrderId: {
        url: "querySelectionItemByOrderId.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "selectionItems",
            args: ["num", "initNum", "postprice", "preprice"]
        }]
    },
    querySelectionItem: {
        url: "querySelectionItem.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "selectionItems",
            args: ["num", "initNum", "postprice", "preprice"]
        }]
    },
    addSelectionItem: {
        url: "addSelectionItem.do",
        intercept: true,
        type: "update",
        tranargs: {
            args: [
                "selection.total",
                "selection.quotationTotal",
                "selection.extensionAddTotal",
                "selection.extensionReduceTotal",
                "selection.addReduceAddTotal",
                "selection.addReduceMinusTotal",
                "selectionItem.initNum",
                "selectionItem.num",
                "selectionItem.postprice",
                "selectionItem.preprice",
            ],
            query: [{
                result: "selectionItem",
                args: ["num", "initNum", "postprice", "preprice"]
            }]
        }
    },
    updateSelectionItem: {
        url: "updateSelectionItem.do",
        intercept: true,
        type: "update",
        tranargs: {
            args: [
                "selection.total",
                "selection.quotationTotal",
                "selection.extensionAddTotal",
                "selection.extensionReduceTotal",
                "selection.addReduceAddTotal",
                "selection.addReduceMinusTotal",
                "selectionItem.num"
            ],
        }
    },
    tranSelectionItem: {
        url: "tranSelectionItem.do",
        intercept: true,
        type: "update",
        tranargs: {
            args: ["selectionItems.num"]
        }
    },
    checkSelectionItem: {url: "checkSelectionItem.do"},
    confirmSelectionItem: {url: "confirmSelectionItem.do"},
    finishSelectionItem: {
        url: "finishSelectionItem.do",
        intercept: true,
        type: "update",
        tranargs: {
            args: ["selectionItem.refnum"]
        }
    },
    balanceSelectionItem: {url: "balanceSelectionItem.do"},
    deleteSelectionItem: {
        url: "deleteSelectionItem.do",
        intercept: true,
        type: "update",
        tranargs: {
            args: [
                "selection.total",
                "selection.quotationTotal",
                "selection.extensionAddTotal",
                "selection.extensionReduceTotal",
                "selection.addReduceAddTotal",
                "selection.addReduceMinusTotal"
            ],
        }
    },
    
    // -------- 定额 -------------------------
    queryQuotationNormood: {
        url: "queryQuotationNormood.do",
        type: "query",
        tranargs: [{
            result: "quotationFunctionAreas-quotationFunctionAreaItems",
            args: ["unitPrice", "initNum", "num"]
        },{
            result: "quotationFunctionAreas-quotationFunctionAreaItems-normood",
            args: ["num"]
        },{
            result: "quotationFunctionAreas-quotationFunctionAreaItems-normood-goods",
            args: ["purchase", "selling", "pieceNum"]
        }]
    },
    queryQuotationNormrice: {
        url: "queryQuotationNormrice.do",
        type: "query",
        tranargs: [{
            result: "quotationFunctionAreas-quotationFunctionAreaItems",
            args: ["unitPrice", "initNum", "num"]
        },{
            result: "quotationFunctionAreas-quotationFunctionAreaItems-normrice",
            args: ["trannum", "salary"]
        },{
            result: "quotationFunctionAreas-quotationFunctionAreaItems-normrice-constructionNode",
            args: ["precheck", "postcheck", "stacheck", "fincheck"]
        }]
    },
    amountQuotationNormood: {
        url: "amountQuotationNormood.do",
        type: "query",
        tranargs: [{
            result: "normoods",
            args: ["num", "amount"]
        },{
            result: "normoods-goods",
            args: ["purchase", "selling", "pieceNum"]
        }]
    },
    amountQuotationNormrice: {
        url: "amountQuotationNormrice.do",
        type: "query",
        tranargs: [{
            result: "normrices",
            args: ["trannum", "salary", "amount"]
        },{
            result: "normrices-constructionNode",
            args: ["precheck", "postcheck", "stacheck", "fincheck"]
        }]
    },

}});

$.extend(api, {addReduce: {

    pageAddReduceByOrderId: {
        url: "pageAddReduceByOrderId.do",
        type: "query",
        tranargs: [{
            result: "paging-data",
            args: ["total", "manageRate", "managePrice", "undisPrice", "disPrice", "uncalPrice", "calPrice"]
        }]
    },
    queryAddReduceByOrderId: {
        url: "queryAddReduceByOrderId.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "addReduces",
            args: ["total", "manageRate", "managePrice", "undisPrice", "disPrice", "uncalPrice", "calPrice"]
        }]
    },
    queryAddReduceForPayedByOrderId: {
        url: "queryAddReduceForPayedByOrderId.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "addReduces",
            args: ["total", "manageRate", "managePrice", "undisPrice", "disPrice", "uncalPrice", "calPrice"]
        }]
    },
    queryAddReduceByArid: {
        url: "queryAddReduceByArid.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "addReduce",
            args: ["total", "manageRate", "managePrice", "undisPrice", "disPrice", "uncalPrice", "calPrice"]
        }]
    },
    queryAddReduceByDecorationPaymentId: {
        url: "queryAddReduceByDecorationPaymentId.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "addReduce",
            args: ["total", "manageRate", "managePrice", "undisPrice", "disPrice", "uncalPrice", "calPrice"]
        }]
    },
    addAddReduce: {url: "addAddReduce.do"},
    updateAddReduce: {
        url: "updateAddReduce.do",
        type: "update",
        tranargs: {
            args: ["addReduce.total", "addReduce.manageRate", "addReduce.managePrice", "addReduce.undisPrice", "addReduce.disPrice", "addReduce.uncalPrice", "addReduce.calPrice"],
        }
    },
    updateAddReduceForAdvance: {
        url: "updateAddReduceForAdvance.do",
        intercept: true,
        type: "update",
        tranargs: {
            args: ["addReduce.total", "addReduce.manageRate", "addReduce.managePrice", "addReduce.undisPrice", "addReduce.disPrice", "addReduce.uncalPrice", "addReduce.calPrice"],
        }
    },
    submitAddReduce: {
        url: "submitAddReduce.do",
        intercept: true,
        type: "update",
        tranargs: {
            args: ["addReduce.total", "addReduce.manageRate", "addReduce.managePrice", "addReduce.undisPrice", "addReduce.disPrice", "addReduce.uncalPrice", "addReduce.calPrice"],
        }
    },
    deleteAddReduce: {url: "deleteAddReduce.do", intercept: true},

    queryAddReduceItemByAddReduceId: {
        url: "queryAddReduceItemByAddReduceId.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "addReduceItems",
            args: ["addPrice", "unitPrice", "subPrice", "num"]
        }]
    },

    queryAddReduceItemByAddReduceIds: {
        url: "queryAddReduceItemByAddReduceIds.do",
        demo: true,
        type: "query",
        tranargs: [{
            result: "addReduceItems",
            args: ["addPrice", "unitPrice", "subPrice", "num"]
        }]
    },
    updateAddReduceItem: {
        url: "updateAddReduceItem.do",
        intercept: true,
        type: "update",
        tranargs: {
            args: [
                "addReduce.total", "addReduce.manageRate", "addReduce.managePrice", "addReduce.undisPrice", "addReduce.disPrice", "addReduce.uncalPrice", "addReduce.calPrice",
                "addReduceItem.addPrice", "addReduceItem.unitPrice", "addReduceItem.subPrice", "addReduceItem.num"
            ],
        }
    },
    updateAddReduceItemForAdvance: {
        url: "updateAddReduceItemForAdvance.do",
        intercept: true,
        type: "update",
        tranargs: {
            args: ["addReduce.total", "addReduce.manageRate", "addReduce.managePrice", "addReduce.undisPrice", "addReduce.disPrice", "addReduce.uncalPrice", "addReduce.calPrice"],
        }
    },
    deleteAddReduceItem: {
        url: "deleteAddReduceItem.do",
        intercept: true,
        type: "update",
        tranargs: {
            args: ["addReduce.total", "addReduce.manageRate", "addReduce.managePrice", "addReduce.undisPrice", "addReduce.disPrice", "addReduce.uncalPrice", "addReduce.calPrice"],
        }
    },
    
}});
