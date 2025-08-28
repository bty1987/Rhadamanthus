$.extend(api, {market: {
    queryEpictureByCid: {url: "queryEpictureByCid.do"},
    addEpicture: {url: "addEpicture.do", intercept: true},
    deleteEpicture: {url: "deleteEpicture.do"},

    pageEperson: {url: "pageEperson.do"},
    queryEpersonByEuid: {url: "queryEpersonByEuid.do"},
    queryEpersonByPinYin: {url: "queryEpersonByPinYin.do"},
    addEperson: {url: "addEperson.do"},
    updateEperson: {url: "updateEperson.do"},

    pageEcase: {url: "pageEcase.do"},
    queryEcaseByTypeAndStatus: {url: "queryEcaseByTypeAndStatus.do"},
    queryEcaseByCid: {url: "queryEcaseByCid.do"},
    addEcase: {url: "addEcase.do"},
    updateEcase: {url: "updateEcase.do"},
    updateEcaseForStatus: {url: "updateEcaseForStatus.do"},
    deleteEcase: {url: "deleteEcase.do"},

    pageEcustomer: {url: "pageEcustomer.do"},
    addEcustomer: {url: "addEcustomer.do"},

    pageEcity: {url: "pageEcity.do"},
    queryEcity: {url: "queryEcity.do"},
    queryEcityByXandY: {url: "queryEcityByXandY.do"},
    queryEcityByPinYin: {url: "queryEcityByPinYin.do"},
    addEcity: {url: "addEcity.do"},
    updateEcity: {url: "updateEcity.do"},

    pageCard: {url: "pageCard.do"},
    updateCard: {url: "updateCard.do"},
    deleteCard: {url: "deleteCard.do"},
    queryCardPhotoByCaid: {url: "queryCardPhotoByCaid.do"},
    addCardPhoto: {url: "addCardPhoto.do"},
    deleteCardPhoto: {url: "deleteCardPhoto.do"},

    pageEopinions: {url: "pageEopinions.do"},
    queryEopinionsByType: {url: "queryEopinionsByType.do"},
    addEopinion: {url: "addEopinion.do"},
    updateEopinion: {url: "updateEopinion.do"},
    deleteEopinion: {url: "deleteEopinion.do"}
}});