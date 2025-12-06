
$.extend(api.index, {
    
});

$.extend(api, {common: {
    // 登录相关
    requestLoginChallenge: {url: "requestLoginChallenge.do", intercept: false},
    doLogin: {url: "doLogin.do", intercept: false},

    QRCode: {url: "QRCode.do", demo: true},
    wmCode: {url: "wmCode.do", demo: true},

    createTree: {url: "createTree.do", demo: true},
    
    changeAuthCode: {url: "changeAuthCode.do", server: "communion"},
    
    current: {url: "current.do", intercept: true},

    logout: {url: "logout.do"},

    pageBuildingNameRule: {url: "pageBuildingNameRule.do"},
    
    queryBuildingNameRule: {url: "queryBuildingNameRule.do", demo: true},
   
    queryMeasurementUnit: {url: "queryMeasurementUnit.do", demo: true},

    queryWorkType: {url: "queryWorkType.do", demo: true},

    updateAuthCode:{url: "updateAuthCode.do",server:'communion'},
    
    changeDecorationPaymentForTime: {url: "changeDecorationPaymentForTime.do"},
    changeMaterialForOrderId: {url: "changeMaterialForOrderId.do"},
    changeMaterialPaymentForTime: {url: "changeMaterialPaymentForTime.do"},
    
    updateQuotationFunctionAreaItemByQuotationIdAType: {url: "updateQuotationFunctionAreaItemByQuotationIdAType.do"},

    exportMaterialPayment: {url: "exportMaterialPayment.do"},
    
    checkMacontrol: {url: "checkMacontrol.do", server: "communion"},
    checkLicense: {url: "checkLicense.do", server: "communion"},

    showImg: {url: "showImg.do"},
    downloadFile: {url: "downloadFile.do"},
    uploadImg: {url: "uploadImg.do"},
    uploadOther: {url: "uploadOther.do"},
    confirmApproval: {url: "confirmApproval.do"},
    rejectApproval: {url: "rejectApproval.do"}
}});
