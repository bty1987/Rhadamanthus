/**
 * app/js/api/information.js —— information（消息/公告/活动/奖品/计划/工单）模块 API 定义
 * 对齐旧 WebContent/js/api/information.js。
 */
$.extend(api.index, {
    messageIndex:         { url: 'views/information/message.html' },
    moreNoticesIndex:     { url: 'views/information/notice4more.html' },
    noticeIndex:          { url: 'views/information/notice.html' },
    activityIndex:        { url: 'views/information/activity.html' },
    activityItemIndex:    { url: 'views/information/activityItem.html' },
    phoneCallIndex:       { url: 'views/information/phoneCall.html' },
    vpaymentReceiptIndex: { url: 'views/information/vpaymentReceipt.html' },
    activityItem:         { url: 'views/information/activityItem.html' },
    stockRecord:          { url: 'views/information/stockRecord.html' },
    vaward:               { url: 'views/information/vaward.html' },
    vaward2print:         { url: 'views/information/vaward2print.html' },
    plan2create:          { url: 'views/information/plan2create.html' }
});

$.extend(api, { information: {

    // ===== 消息 message =====
    pageMessage:              { url: 'pageMessage.do' },
    queryMessageForUnRead:    { url: 'queryMessageForUnRead.do' },
    countMessage:             { url: 'countMessage.do' },
    queryMessageByMid:        { url: 'queryMessageByMid.do' },
    sendMessage:              { url: 'sendMessage.do' },
    updateMessageForRead:     { url: 'updateMessageForRead.do' },
    deleteMessageById:        { url: 'deleteMessageById.do' },
    deleteMessageByIds:       { url: 'deleteMessageByIds.do' },

    // ===== 公告 notice =====
    pageNotice:               { url: 'pageNotice.do' },
    pageNoticeForSeenByType:  { url: 'pageNoticeForSeenByType.do' },
    queryNoticeByNid:         { url: 'queryNoticeByNid.do' },
    addNotice:                { url: 'addNotice.do' },
    updateNotice:             { url: 'updateNotice.do' },
    deleteNotice:             { url: 'deleteNotice.do' },
    updateNoticeDepartments:  { url: 'updateNoticeDepartments.do' },
    queryNoticeDepartment:    { url: 'queryNoticeDepartment.do' },
    updateNoticeDepartment:   { url: 'updateNoticeDepartment.do' },

    // ===== 活动 activity =====
    pageActivity:             { url: 'pageActivity.do', type: 'query', tranargs: [{ result: 'paging-data', args: ['multiple'] }] },
    queryActivityForValid:    { url: 'queryActivityForValid.do' },
    addActivity:              { url: 'addActivity.do',  type: 'update', tranargs: { args: ['activity.multiple'] } },
    updateActivity:           { url: 'updateActivity.do', type: 'update', tranargs: { args: ['activity.multiple'] } },
    updateActivityForStatus:  { url: 'updateActivityForStatus.do' },
    updateActivityForDefault: { url: 'updateActivityForDefault.do' },
    queryActivityItemByAid:   { url: 'queryActivityItemByAid.do', type: 'query', tranargs: [{ result: 'activityItems', args: ['money', 'integral'] }] },
    queryActivityItemByAiid:  { url: 'queryActivityItemByAiid.do', type: 'query', tranargs: [{ result: 'activityItem', args: ['money'] }] },
    addActivityItem:          { url: 'addActivityItem.do', type: 'update', tranargs: { args: ['activityItem.money', 'activityItem.integral'], query: [{ result: 'activityItem', args: ['money', 'integral'] }] } },
    deleteActivityItem:       { url: 'deleteActivityItem.do' },

    // ===== 事件 event =====
    queryEvent:               { url: 'queryEvent.do' },
    addEvent:                 { url: 'addEvent.do' },
    deleteEvent:              { url: 'deleteEvent.do' },

    // ===== 通话记录 phoneCall =====
    pagePhoneCall:            { url: 'pagePhoneCall.do' },
    phoneCall:                { url: 'phoneCall.do' },
    updatePhoneCallForInfo:   { url: 'updatePhoneCallForInfo.do' },
    updatePhoneCallForRecord: { url: 'updatePhoneCallForRecord.do' },

    // ===== 大活动 vactivity =====
    pageVactivity:            { url: 'pageVactivity.do' },
    queryVactivity:           { url: 'queryVactivity.do' },
    updateVactivityForStatus: { url: 'updateVactivityForStatus.do' },

    // ===== 大活动奖品 vprize =====
    pageVprize:               { url: 'pageVprize.do',  type: 'query', tranargs: [{ result: 'paging-data', args: ['price'] }] },
    addVprize:                { url: 'addVprize.do',   type: 'update', tranargs: { args: ['vprize.price'] } },
    updateVprize:             { url: 'updateVprize.do', type: 'update', tranargs: { args: ['vprize.price'] } },
    updateVprizeForStatus:    { url: 'updateVprizeForStatus.do' },

    // ===== 活动票 vticket =====
    pageVticket:              { url: 'pageVticket.do' },
    pageVticketForBelonger:   { url: 'pageVticketForBelonger.do' },
    countVticket:             { url: 'countVticket.do' },
    createVticket:            { url: 'createVticket.do' },
    updateVticket:            { url: 'updateVticket.do' },

    // ===== 大活动收款 vpayment =====
    pageVpayment:             { url: 'pageVpayment.do', type: 'query', tranargs: [{ result: 'paging-data', args: ['money', 'cash', 'bank', 'coupon'] }] },
    countVpayment:            { url: 'countVpayment.do' },
    createVpayment:           { url: 'createVpayment.do', type: 'update', tranargs: { args: ['vpayment.money'] } },
    deleteVpaymentId:         { url: 'deleteVpaymentId.do' },
    collectVpayment:          { url: 'collectVpayment.do', type: 'update', tranargs: { args: ['vreceipt.cash', 'vreceipt.bank', 'vreceipt.coupon'] } },
    queryVpaymentByNo:        { url: 'queryVpaymentByNo.do', type: 'query', tranargs: [{ result: 'vpayments', args: ['money'] }] },
    queryVpaymentByVrid:      { url: 'queryVpaymentByVrid.do', type: 'query', tranargs: [{ result: 'vpayments', args: ['money'] }] },
    queryVreceiptByVrid:      { url: 'queryVreceiptByVrid.do', type: 'query', tranargs: [{ result: 'vreceipt', args: ['cash', 'bank', 'coupon'] }] },
    queryVawardByNo:          { url: 'queryVawardByNo.do', type: 'query', tranargs: [{ result: 'vawards', args: ['price', 'num'] }] },

    // ===== 计划 plan =====
    pagePlan:                 { url: 'pagePlan.do' },
    existPlan:                { url: 'existPlan.do' },
    createPlan:               { url: 'createPlan.do' },
    cancelPlan:               { url: 'cancelPlan.do' },
    updatePlan:               { url: 'updatePlan.do' },

    // ===== 奖品库存 awardStock =====
    pageAwardStock:           { url: 'pageAwardStock.do', type: 'query', tranargs: [{ result: 'paging-data', args: ['unitPrice', 'purchase', 'selling', 'num'] }] },
    queryAwardStockByAsid:    { url: 'queryAwardStockByAsid.do', tranargs: [{ result: 'paging-data', args: ['unitPrice', 'purchase', 'selling', 'num'] }] },
    queryAwardStockByType:    { url: 'queryAwardStockByType.do', tranargs: [{ result: 'paging-data', args: ['unitPrice', 'purchase', 'selling', 'num'] }] },
    queryAwardStockByName:    { url: 'queryAwardStockByName.do' },
    addAwardStock:            { url: 'addAwardStock.do', type: 'update', tranargs: { args: ['awardStock.price', 'awardStock.unitPrice', 'awardStock.purchase', 'awardStock.selling', 'awardStock.num'] } },
    updateAwardStock:         { url: 'updateAwardStock.do', type: 'update', tranargs: { args: ['awardStock.price', 'awardStock.unitPrice', 'awardStock.purchase', 'awardStock.selling', 'awardStock.num'] } },
    updateAwardStockForXG:    { url: 'updateAwardStockForXG.do', type: 'update', tranargs: { args: ['awardStock.price', 'awardStock.unitPrice', 'awardStock.purchase', 'awardStock.selling', 'awardStock.num'] } },
    updateAwardStockForCG:    { url: 'updateAwardStockForCG.do', type: 'update', tranargs: { args: ['awardStock.price', 'awardStock.unitPrice', 'awardStock.purchase', 'awardStock.selling', 'awardStock.num'] } },
    checkAwardStock:          { url: 'checkAwardStock.do', type: 'update', tranargs: { args: ['awardStock.price', 'awardStock.unitPrice', 'awardStock.purchase', 'awardStock.selling', 'awardStock.num'] } },
    updateAwardStockForStatus:{ url: 'updateAwardStockForStatus.do' },

    // ===== 奖品记录 awardRecord =====
    pageAwardRecord:          { url: 'pageAwardRecord.do', type: 'query', tranargs: [{ result: 'paging-data', args: ['totalPrice', 'unitPrice', 'num'] }] },

    // ===== 大活动奖品 vaward =====
    deleteVaward:             { url: 'deleteVaward.do' },
    countVaward:              { url: 'countVaward.do' },

    // ===== 工单 worksheet =====
    pageWorksheet:            { url: 'pageWorksheet.do' },
    queryWorksheet:           { url: 'queryWorksheet.do' },
    addWorksheet:             { url: 'addWorksheet.do' },
    updateWorksheet:          { url: 'updateWorksheet.do' },
    cancelWorksheet:          { url: 'cancelWorksheet.do' },
    handleWorksheet:          { url: 'handleWorksheet.do' },
    finishWorksheet:          { url: 'finishWorksheet.do' },

    // ===== 奖品采购 awardPurchase =====
    pageAwardPurchase:        { url: 'pageAwardPurchase.do', type: 'query', tranargs: [{ result: 'paging-data', args: ['inprice', 'baprice', 'num', 'surplus'] }] },
    queryAwardPurchaseByFapid:{ url: 'queryAwardPurchaseByFapid.do', type: 'query', tranargs: [{ result: 'awardPurchases', args: ['inprice', 'baprice', 'num', 'surplus'] }] },
    addAwardPurchase:         { url: 'addAwardPurchase.do', type: 'update', tranargs: { args: ['awardPurchase.num'] } },
    purchaseAwardPurchase:    { url: 'purchaseAwardPurchase.do', type: 'update', tranargs: { args: ['awardPurchase.inprice'] } },
    instoreAwardPurchase:     { url: 'instoreAwardPurchase.do', type: 'update', tranargs: { args: ['awardPurchase.inprice', 'awardPurchase.num'] } },
    balanceAwardPurchase:     { url: 'balanceAwardPurchase.do', type: 'update', tranargs: { args: ['awardPurchase.baprice'] } },
    cancelAwardPurchase:      { url: 'cancelAwardPurchase.do' }
}});
