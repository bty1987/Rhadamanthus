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

    pageMarketCampaign: {url: "pageMarketCampaign.do"},
    queryMarketCampaignForEnable: {url: "queryMarketCampaignForEnable.do"},
    addMarketCampaign: {url: "addMarketCampaign.do"},
    updateMarketCampaign: {url: "updateMarketCampaign.do"},
    publishMarketCampaign: {url: "publishMarketCampaign.do"},
    disableMarketCampaign: {url: "disableMarketCampaign.do"},

    pageMarketChannel: {url: "pageMarketChannel.do"},
    queryMarketChannelForEnable: {url: "queryMarketChannelForEnable.do"},
    addMarketChannel: {url: "addMarketChannel.do"},
    updateMarketChannel: {url: "updateMarketChannel.do"},
    disableMarketChannel: {url: "disableMarketChannel.do"},

    pageMarketSource: {url: "pageMarketSource.do"},
    addMarketSource: {url: "addMarketSource.do"},
    updateMarketSource: {url: "updateMarketSource.do"},
    disableMarketSource: {url: "disableMarketSource.do"},

    pageMarketInbound: {url: "pageMarketInbound.do"},
    queryMarketInboundByMiid: {url: "queryMarketInboundByMiid.do"},
    addMarketInbound: {url: "addMarketInbound.do", intercept: true},
    retryMarketInbound: {url: "retryMarketInbound.do"},
    queryMarketAttributionByCsid: {url: "queryMarketAttributionByCsid.do"},
    countMarketInboundForCampaign: {url: "countMarketInboundForCampaign.do"},
    countMarketInboundForChannel: {url: "countMarketInboundForChannel.do"},

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
