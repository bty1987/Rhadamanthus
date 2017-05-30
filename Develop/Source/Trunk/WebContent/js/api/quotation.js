
$.extend(api.index, {
    functionAreaIndex: {url: "/views/quotation/functionArea.html"},
    quotationItemIndex: {url: "/views/quotation/quotationItem.html"},
    quotationVersionIndex: {url: "/views/quotation/quotationVersion.html"},
    systemDefineItemIndex: {url: "/views/quotation/systemDefineItem.html"},

    quotationIndex: {url: "/views/quotation/quotationIndex.html"},
    quotationDetailIndex: {url: "/views/quotation/quotationDetail.html"},
    quotationPartIndex: {url: "/views/quotation/quotationPart.html"},
    quotationWholeIndex: {url: "/views/quotation/quotationWhole.html"},
    quotationOutputIndex: {url: "/views/quotation/quotationOutput.html"}
});

$.extend(api.ds, {
    quotationInfo: {url: "ds/quotationInfo.json", demo: true}
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
    copyQuotationVersion: {url: "copyQuotationVersion.do"},

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

    queryQuotationByOrderId: {url: "queryQuotationByOrderId.do", demo: true},
    queryQuotationForDefaultByOrderId: {url: "queryQuotationForDefaultByOrderId.do", demo: true},
    queryQuotationById: {url: "queryQuotationById.do", demo: true},
    queryQuotationForStatusByOrderId: {url: "queryQuotationForStatusByOrderId.do", demo: true},
    queryQuotationForConfig: {url: "queryQuotationForConfig.do", demo: true},
    checkQuotationForStatusByOrderId: {url: "checkQuotationForStatusByOrderId.do"},
    addQuotation: {url: "addQuotation.do"},
    updateQuotation: {url: "updateQuotation.do"},
    updateQuotationForAdvance: {url: "updateQuotationForAdvance.do"},
    deleteQuotationById: {url: "deleteQuotationById.do"},
    replicaQuotation: {url: "replicaQuotation.do"},
    copyQuotation: {url: "copyQuotation.do"},
    changeQuotationForDefault: {url: "changeQuotationForDefault.do"},

    queryQuotationFunctionAreaForCommonByQuotationId: {url: "queryQuotationFunctionAreaForCommonByQuotationId.do", demo: true},
    queryQuotationFunctionAreaByQuotationId: {url: "queryQuotationFunctionAreaByQuotationId.do", demo: true},
    addQuotationFuctionAreaByFunctionAreaIds: {url: "addQuotationFuctionAreaByFunctionAreaIds.do"},
    updateQuotationFunctionArea: {url: "updateQuotationFunctionArea.do"},
    deleteQuotationFunctionArea: {url: "deleteQuotationFunctionArea.do"},

    queryQuotationFunctionAreaItemByQuotationFunctionAreaId: {url: "queryQuotationFunctionAreaItemByQuotationFunctionAreaId.do"},
    updateQuotationFunctionAreaItem: {url: "updateQuotationFunctionAreaItem.do"},
    updateQuotationFunctionAreaItemForSpec: {url: "updateQuotationFunctionAreaItemForSpec.do"},
    deleteQuotationFunctionAreaItem: {url: "deleteQuotationFunctionAreaItem.do"},

    queryQuotationMaterialItemByQId: {url:"queryQuotationMaterialItemByQId.do"},
    addQuotationMaterialItem: {url:"addQuotationMaterialItem.do"},
    upgradeQuotationMaterialItem: {url:"upgradeQuotationMaterialItem.do"},
    discountQuotationMaterialItem: {url:"discountQuotationMaterialItem.do"},
    deleteQuotationMaterialItem: {url:"deleteQuotationMaterialItem.do"},
    updateQuotationFunctionAreaItemByQuotationIdAType: {url: "updateQuotationFunctionAreaItemByQuotationIdAType.do"}
}});
