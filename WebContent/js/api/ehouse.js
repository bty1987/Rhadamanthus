$.extend(api, {ehouse: {
    queryEpictureByCid: {url: "queryEpictureByCid.do"},
    addEpicture: {url: "addEpicture.do", intercept: true},
    deleteEpicture: {url: "deleteEpicture.do"},

    pageEuser: {url: "pageEuser.do"},
    queryEuserByEuid: {url: "queryEuserByEuid.do"},
    queryEuserByPinYin: {url: "queryEuserByPinYin.do"},
    addEuser: {url: "addEuser.do"},
    updateEuser: {url: "updateEuser.do"},

    pageCase: {url: "pageCase.do"},
    queryCaseByTypeAndStatus: {url: "queryCaseByTypeAndStatus.do"},
    queryCaseByCid: {url: "queryCaseByCid.do"},
    addCase: {url: "addCase.do"},
    updateCase: {url: "updateCase.do"},
    updateCaseForStatus: {url: "updateCaseForStatus.do"},
    deleteCase: {url: "deleteCase.do"},

    pageEcustomer: {url: "pageEcustomer.do"},
    addEcustomer: {url: "addEcustomer.do"},

    pageEcity: {url: "pageEcity.do"},
    queryEcity: {url: "queryEcity.do"},
    queryEcityByXandY: {url: "queryEcityByXandY.do"},
    queryEcityByPinYin: {url: "queryEcityByPinYin.do"},
    addEcity: {url: "addEcity.do"},
    updateEcity: {url: "updateEcity.do"}
}});