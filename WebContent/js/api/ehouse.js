$.extend(api, {ehouse: {
    queryEpictureByCid: {url: "queryEpictureByCid.do"},
    addEpicture: {url: "addEpicture.do", intercept: true},
    deleteEpicture: {url: "deleteEpicture.do"},

    pageEuser: {url: "pageEuser.do"},
    queryEuserByName: {url: "queryEuserByName.do"},
    addEuser: {url: "addEuser.do"},
    updateEuser: {url: "updateEuser.do"},

    pageCase: {url: "pageCase.do"},
    queryCaseByTypeAndStatus: {url: "queryCaseByTypeAndStatus.do"},
    addCase: {url: "addCase.do"},
    updateCase: {url: "updateCase.do"},
    updateCaseForStatus: {url: "updateCaseForStatus.do"},
    deleteCase: {url: "deleteCase.do"},

    pageEcustomer: {url: "pageEcustomer.do"},
    addEcustomer: {url: "addEcustomer.do"},

    pageEcity: {url: "pageEcity.do"},
    queryEcityByCity: {url: "queryEcityByCity.do"},
    addEcity: {url: "addEcity.do"}
}});