/**
 * app/js/api/market.js —— market 模块 API 定义（第 1 批，6 个纯 CRUD 页）
 *
 * 对齐旧 WebContent/js/api/market.js。
 * 含上传的页（card/ecase/eopinions/eperson）待上传组件移植后再迁。
 */
$.extend(api.index, {
    marketSourceIndex:   { url: 'views/market/marketSource.html' },
    marketChannelIndex:  { url: 'views/market/marketChannel.html' },
    marketCampaignIndex: { url: 'views/market/marketCampaign.html' },
    ecityIndex:          { url: 'views/market/ecity.html' },
    ecustomerIndex:      { url: 'views/market/ecustomer.html' },
    marketInboundIndex:  { url: 'views/market/marketInbound.html' }
});

$.extend(api, { market: {

    // ===== 营销渠道 marketChannel =====
    pageMarketChannel:        { url: 'pageMarketChannel.do' },
    queryMarketChannelForEnable: { url: 'queryMarketChannelForEnable.do' },
    addMarketChannel:         { url: 'addMarketChannel.do' },
    updateMarketChannel:      { url: 'updateMarketChannel.do' },
    disableMarketChannel:     { url: 'disableMarketChannel.do' },

    // ===== 营销活动 marketCampaign（budget 为金额，需 tranargs）=====
    pageMarketCampaign:       { url: 'pageMarketCampaign.do', type: 'query',
                                tranargs: [{ result: 'paging-data', args: ['budget'] }] },
    queryMarketCampaignForEnable: { url: 'queryMarketCampaignForEnable.do' },
    addMarketCampaign:        { url: 'addMarketCampaign.do', type: 'update',
                                tranargs: { args: ['marketCampaign.budget'] } },
    updateMarketCampaign:     { url: 'updateMarketCampaign.do', type: 'update',
                                tranargs: { args: ['marketCampaign.budget'] } },
    publishMarketCampaign:    { url: 'publishMarketCampaign.do' },
    disableMarketCampaign:    { url: 'disableMarketCampaign.do' },

    // ===== 营销来源 marketSource =====
    pageMarketSource:         { url: 'pageMarketSource.do' },
    addMarketSource:          { url: 'addMarketSource.do' },
    updateMarketSource:       { url: 'updateMarketSource.do' },
    disableMarketSource:      { url: 'disableMarketSource.do' },

    // ===== 营销入客 marketInbound =====
    pageMarketInbound:        { url: 'pageMarketInbound.do' },
    queryMarketInboundByMiid: { url: 'queryMarketInboundByMiid.do' },
    addMarketInbound:         { url: 'addMarketInbound.do', intercept: true },
    retryMarketInbound:       { url: 'retryMarketInbound.do' },
    countMarketInboundForCampaign: { url: 'countMarketInboundForCampaign.do' },
    countMarketInboundForChannel:  { url: 'countMarketInboundForChannel.do' },

    // ===== 展厅城市 ecity =====
    pageEcity:                { url: 'pageEcity.do' },
    queryEcity:               { url: 'queryEcity.do' },
    queryEcityByPinYin:       { url: 'queryEcityByPinYin.do' },
    addEcity:                 { url: 'addEcity.do' },
    updateEcity:              { url: 'updateEcity.do' },

    // ===== 展厅客户 ecustomer =====
    pageEcustomer:            { url: 'pageEcustomer.do' },
    addEcustomer:             { url: 'addEcustomer.do' },

    // ===== 名片 card（含头像上传）=====
    pageCard:                 { url: 'pageCard.do' },
    queryCardPhotoByCaid:     { url: 'queryCardPhotoByCaid.do' },
    updateCard:               { url: 'updateCard.do' },

    // ===== 案例 ecase + 案例图片 epicture =====
    pageEcase:                { url: 'pageEcase.do' },
    addEcase:                 { url: 'addEcase.do' },
    updateEcase:              { url: 'updateEcase.do' },
    updateEcaseForStatus:     { url: 'updateEcaseForStatus.do' },
    deleteEcase:              { url: 'deleteEcase.do' },
    addEpicture:              { url: 'addEpicture.do', intercept: true },
    deleteEpicture:           { url: 'deleteEpicture.do' },
    queryEpictureByCid:       { url: 'queryEpictureByCid.do' },

    // ===== 口碑 eopinions =====
    pageEopinions:            { url: 'pageEopinions.do' },
    addEopinion:              { url: 'addEopinion.do' },

    // ===== 优秀员工 eperson（含头像上传）=====
    pageEperson:              { url: 'pageEperson.do' },
    addEperson:               { url: 'addEperson.do' },
    updateEperson:            { url: 'updateEperson.do' },

    // ===== 通用上传 =====
    uploadImg:                { url: 'uploadImg.do' }
}});
