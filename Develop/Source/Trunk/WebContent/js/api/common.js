
$.extend(api.index, {
    
});

$.extend(api.ds, {
    houseInfo: {url: "ds/houseInfo.json", demo: true}
});

$.extend(api, {common: {
    QRCode: {url: "QRCode.do", demo: true},
    wmCode: {url: "wmCode.do", demo: true},

    createTree: {url: "createTree.do", demo: true},

    logout: {url: "logout.do"},

    pageBuildingNameRule: {url: "pageBuildingNameRule.do"},
    queryBuildingNameRule: {url: "queryBuildingNameRule.do", demo: true},

    queryMeasurementUnit: {url: "queryMeasurementUnit.do", demo: true},

    queryWorkType: {url: "queryWorkType.do", demo: true},

    pageReceiptType: {url: "pageReceiptType.do"},
    queryReceiptType: {url: "queryReceiptType.do", demo: true},
    queryReceiptTypeByType: {url: "queryReceiptTypeByType.do"},
    addReceiptType: {url: "addReceiptType.do", server: "communion"},
    
    
    
   

    changeDecorationPaymentForTime: {url: "changeDecorationPaymentForTime.do"},
    changeMaterialSubOrderForOrderId: {url: "changeMaterialSubOrderForOrderId.do"},
    changeMaterialPaymentForTime: {url: "changeMaterialPaymentForTime.do"},
    
    updateQuotationFunctionAreaItemByQuotationIdAType: {url: "updateQuotationFunctionAreaItemByQuotationIdAType.do"},

    exportMaterialPayment: {url: "exportMaterialPayment.do"},

    showImg: {url: "showImg.do"},
    downloadFile: {url: "downloadFile.do"},
    uploadImg: {url: "uploadImg.do"},
    uploadOther: {url: "uploadOther.do"}
}});