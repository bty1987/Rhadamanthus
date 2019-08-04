
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

});

$.extend(api, {quotation: {
    queryQuotationClassification: {url: "queryQuotationClassification.do", demo: true},
    queryQuotationBigCategory: {url: "queryQuotationBigCategory.do", demo: true},
    queryQuotationSmallCategory: {url: "queryQuotationSmallCategory.do", demo: true},
    queryQuotationType: {url: "queryQuotationType.do", demo: true},

    pageQuotationVersion: {url: "pageQuotationVersion.do", demo: true},
    queryQuotationVersion: {url: "queryQuotationVersion.do", demo: true},
    queryQuotationVersionByVersionId: {url: "queryQuotationVersionByVersionId.do"},
    addQuotationVersion: {url: "addQuotationVersion.do"},
    updateQuotationVersion: {url: "updateQuotationVersion.do"},
    updateQuotationForStatus: {url: "updateQuotationForStatus.do"},
    
    pageFunctionArea: {url: "pageFunctionArea.do", demo: true},
    queryFunctionAreaByIdAVersionId: {url: "queryFunctionAreaByIdAVersionId.do"},
    queryFunctionAreaByVersionId: {url: "queryFunctionAreaByVersionId.do", demo: true},
    addFunctionArea: {url: "addFunctionArea.do"},
    updateFunctionArea: {url: "updateFunctionArea.do"},
    deleteFunctionArea: {url: "deleteFunctionArea.do"},

    pageQuotationItem: {url: "pageQuotationItem.do", demo: true},
    pageQuotationItemByVersionId: {url: "pageQuotationItemByVersionId.do", demo: true},
    queryQuotationItemByItemIdAVersionId: {url: "queryQuotationItemByItemIdAVersionId.do"},
    addQuotationItem: {url: "addQuotationItem.do"},
    updateQuotationItem: {url: "updateQuotationItem.do"},
    updateQuotationItemForStatus: {url: "updateQuotationItemForStatus.do"},
    updateQuotationItemForDiscount: {url: "updateQuotationItemForDiscount.do"},

    queryFunctionAreaItemByFunctionAreaId: {url: "queryFunctionAreaItemByFunctionAreaId.do", demo: true},
    addFunctionAreaItem: {url: "addFunctionAreaItem.do"},
    deleteFunctionAreaItemByIds: {url: "deleteFunctionAreaItemByIds.do"},

    pageSystemDefineItem: {url: "pageSystemDefineItem.do", demo: true},
    pageSystemDefineItemForEnable: {url: "pageSystemDefineItemForEnable.do", demo: true},
    querySystemDefineItemByItemId: {url: "querySystemDefineItemByItemId.do"},
    addSystemDefineItem: {url: "addSystemDefineItem.do"},
    updateSystemDefineItem: {url: "updateSystemDefineItem.do"},
    updateSystemDefineItemForStatus: {url: "updateSystemDefineItemForStatus.do"},
    updateSystemDefineItemForDiscount: {url: "updateSystemDefineItemForDiscount.do"},
    deleteSystemDefineItemByIds: {url: "deleteSystemDefineItemByIds.do"},

    pageQuotationBigCategory:{url:"pageQuotationBigCategory.do"},
    pageQuotationType:{url:"pageQuotationType.do"},
    pageQuotationSmallCategory:{url:"pageQuotationSmallCategory.do"},
    pageQuotationClassification:{url:"pageQuotationClassification.do"},

    queryQuotationByOrderId: {url: "queryQuotationByOrderId.do", demo: true},
    queryQuotationForDefaultByOrderId: {url: "queryQuotationForDefaultByOrderId.do", demo: true},
    queryQuotationById: {url: "queryQuotationById.do", demo: true},
    queryQuotationForConfig: {url: "queryQuotationForConfig.do", demo: true},
    addQuotation: {url: "addQuotation.do"},
    updateQuotation: {url: "updateQuotation.do"},
    updateQuotationForAdvance: {url: "updateQuotationForAdvance.do"},
    deleteQuotationById: {url: "deleteQuotationById.do"},
    replicaQuotation: {url: "replicaQuotation.do"},
    cloneQuotation:{url:"cloneQuotation.do"},
    copyQuotation: {url: "copyQuotation.do"},
    changeQuotationForDefault: {url: "changeQuotationForDefault.do"},
    lockQuotation: {url: "lockQuotation.do"},
    unlockQuotation: {url: "unlockQuotation.do"},

    queryQuotationFunctionAreaForCommonByQuotationId: {url: "queryQuotationFunctionAreaForCommonByQuotationId.do", demo: true},
    queryQuotationFunctionAreaByQuotationId: {url: "queryQuotationFunctionAreaByQuotationId.do", demo: true},
    addQuotationFuctionAreaByFunctionAreaIds: {url: "addQuotationFuctionAreaByFunctionAreaIds.do"},
    updateQuotationFunctionArea: {url: "updateQuotationFunctionArea.do"},
    deleteQuotationFunctionArea: {url: "deleteQuotationFunctionArea.do"},

    queryQuotationFunctionAreaItemByQuotationFunctionAreaId: {url: "queryQuotationFunctionAreaItemByQuotationFunctionAreaId.do"},
    updateQuotationFunctionAreaItem: {url: "updateQuotationFunctionAreaItem.do", intercept: true},
    updateQuotationFunctionAreaItemForSpec: {url: "updateQuotationFunctionAreaItemForSpec.do"},
    updateQuotationFunctionAreaItemForIndex: {url:"updateQuotationFunctionAreaItemForIndex.do", intercept: true},
    deleteQuotationFunctionAreaItem: {url: "deleteQuotationFunctionAreaItem.do", intercept: true},
    updateQuotationFunctionAreaItemByQuotationIdAType: {url: "updateQuotationFunctionAreaItemByQuotationIdAType.do"},


    pageExtensionByOrderId:{url:"pageExtensionByOrderId.do"},
    queryExtensionByOrderId:{url:"queryExtensionByOrderId.do"},
    queryExtensionByEid:{url:"queryExtensionByEid.do"},
    addExtension:{url:"addExtension.do"},
    updateExtension:{url:"updateExtension.do" ,  intercept: true},
    updateExtensionForAdvance:{url:"updateExtensionForAdvance.do" ,  intercept: true},
    deleteExtension:{url:"deleteExtension.do" ,  intercept: true},

    queryExtensionItemByEid:{url:"queryExtensionItemByEid.do"},
    queryExtensionItemByEids:{url:"queryExtensionItemByEids.do"},
    updateExtensionItem:{url:"updateExtensionItem.do" , intercept: true},
    deleteExtensionItem:{url:"deleteExtensionItem.do" , intercept: true},
    
    
    queryQuotetion:{url:"queryQuotetion.do"},
    queryQuotetionByQid:{url:"queryQuotetionByQid.do"},
    queryQuotetionByNo:{url:"queryQuotetionByNo.do"},
    addQuotetion:{url:"addQuotetion.do"},
    updateQuotetion:{url:"updateQuotetion.do"},
    updateQuotetionForAdvance:{url:"updateQuotetionForAdvance.do"},
    deleteQuotetion:{url:"deleteQuotetion.do"},
    replicaQuotetion:{url:"replicaQuotetion.do"},
    cloneQuotetion:{url:"cloneQuotetion.do"},
    copyQuotetion:{url:"copyQuotetion.do"},

    queryQuotetionFunctionAreaByQid:{url:"queryQuotetionFunctionAreaByQid.do"},
    addQuotetionFuctionArea:{url:"addQuotetionFuctionArea.do"},
    updateQuotetionFunctionArea:{url:"updateQuotetionFunctionArea.do"},
    deleteQuotetionFunctionArea:{url:"deleteQuotetionFunctionArea.do"},

    updateQuotetionFunctionAreaItem:{url:"updateQuotetionFunctionAreaItem.do" , intercept: true},
    updateQuotetionFunctionAreaItemForIndex:{url:"updateQuotetionFunctionAreaItemForIndex.do" , intercept: true},
    updateQuotetionFunctionAreaItemForSpec:{url:"updateQuotetionFunctionAreaItemForSpec.do" , intercept: true},
    deleteQuotetionFunctionAreaItem:{url:"deleteQuotetionFunctionAreaItem.do" , intercept: true}

}});

$.extend(api, {addReduce: {
    pageAddReduceByOrderId: {url: "pageAddReduceByOrderId.do"},
    queryAddReduceByOrderId: {url: "queryAddReduceByOrderId.do", demo: true},
    queryAddReduceForPayedByOrderId: {url: "queryAddReduceForPayedByOrderId.do", demo: true},
    queryAddReduceByArid: {url: "queryAddReduceByArid.do", demo: true},
    queryAddReduceByDecorationPaymentId: {url: "queryAddReduceByDecorationPaymentId.do", demo: true},
    addAddReduce: {url: "addAddReduce.do"},
    updateAddReduce: {url: "updateAddReduce.do"},
    updateAddReduceForAdvance: {url: "updateAddReduceForAdvance.do", intercept: true},
    deleteAddReduce: {url: "deleteAddReduce.do", intercept: true},

    submitAddReduce: {url: "submitAddReduce.do", intercept: true},

    queryAddReduceItemByAddReduceId: {url: "queryAddReduceItemByAddReduceId.do", demo: true},
    queryAddReduceItemByAddReduceIds: {url: "queryAddReduceItemByAddReduceIds.do", demo: true},
    updateAddReduceItem: {url: "updateAddReduceItem.do", intercept: true},
    updateAddReduceItemForAdvance: {url: "updateAddReduceItemForAdvance.do", intercept: true},
    deleteAddReduceItem: {url: "deleteAddReduceItem.do", intercept: true}
}});
