/**
 * app/js/api/customer.js —— customer（客服域）模块 API 定义
 *
 * 子域：装修客户/会员积分/客源/客源规则/客户来源/商机/客户画像/回访/调研/反馈/投诉/售后/维修/质保/客户圈 等。
 * 与旧 WebContent/js/api/customer.js 等价，保留 type/tranargs 元数据
 * （金额精度转换：query=响应÷1000，update=请求×1000）。
 */
$.extend(api.index, {
    // —— 页面路由（菜单跳转 / 页内弹窗用） ——
    vustomerIndex:                { url: 'views/customer/vustomer.html' },
    vrecordIndex:                 { url: 'views/customer/vrecord.html' },
    vscoreRecordIndex:            { url: 'views/customer/vscoreRecord.html' },
    vustomerAdvanceIndex:         { url: 'views/customer/vustomerAdvance.html' },
    serviceTeamIndex:            { url: 'views/customer/serviceTeam.html' },
    serviceTeam4userIndex:       { url: 'views/customer/serviceTeam4user.html' },
    repairIndex:                  { url: 'views/customer/repair.html' },
    repairPayIndex:               { url: 'views/customer/repairPay.html' },
    complainIndex:                { url: 'views/customer/complain.html' },
    complaintIndex:               { url: 'views/customer/complaint.html' },
    aepairIndex:                  { url: 'views/customer/aepair.html' },
    surveyIndex:                  { url: 'views/customer/survey.html' },
    revisitIndex:                 { url: 'views/customer/revisit.html' },
    consultionIndex:              { url: 'views/customer/consultion.html' },
    consultion2createIndex:       { url: 'views/customer/consultion2create.html' },
    droupIndex:                   { url: 'views/customer/droup.html' },
    ememberIndex:                 { url: 'views/customer/emember.html' },
    feedbackIndex:                { url: 'views/customer/feedback.html' },
    feedRecordIndex:              { url: 'views/customer/feedbackRecord.html' },
    feedBackVisitIndex:           { url: 'views/customer/feedbackBackVisit.html' },
    feedComplaintIndex:           { url: 'views/customer/feedbackComplaint.html' },
    feedbackComplaintDeptIndex:   { url: 'views/customer/feedbackComplaintDept.html' },
    feedbackGuaranteeIndex:       { url: 'views/customer/feedbackGuarantee.html' },
    feedbackGuarantee2editIndex:  { url: 'views/customer/feedbackGuarantee2edit.html' },
    customerAfterSalesIndex:      { url: 'views/customer/customerAfterSales.html' },
    customerChanceIndex:          { url: 'views/customer/customerChance.html' },
    customerOrigineIndex:         { url: 'views/customer/customerOrigine.html' },
    customerOriginRecordIndex:    { url: 'views/customer/customerOrigineRecord.html' },
    customerOrigine2createIndex:  { url: 'views/customer/customerOrigine2create.html' },
    customerSourceIndex:          { url: 'views/customer/customerSource.html' },
    customerSourceRecordIndex:    { url: 'views/customer/customerSourceRecord.html' },
    customerProfileIndex:         { url: 'views/customer/customerProfile.html' },
    customerprofile:              { url: 'views/customer/customerProfile.html' },
    customerProfile4detailIndex:  { url: 'views/customer/customerProfile4detail.html' },
    customerCompanyRuleIndex:     { url: 'views/customer/customerCompanyRule.html' },
    customerCityProperRuleIndex:  { url: 'views/customer/customerCityProperRule.html' },
    customerDeptRuleIndex:        { url: 'views/customer/customerDeptRule.html' },
    customerProtectRuleIndex:     { url: 'views/customer/customerProtectRule.html' },
    customerUserRuleIndex:        { url: 'views/customer/customerUserRule.html' },
    customerUserRuleItemIndex:    { url: 'views/customer/customerUserRuleItem.html' },
    customerFunctionIndex:        { url: 'views/customer/customerFunction.html' },
    pointAccountIndex:            { url: 'views/customer/pointAccount.html' },
    pointRecordIndex:             { url: 'views/customer/pointRecord.html' },
    vustomerSharedIndex:          { url: 'views/customer/vustomerShared.html' }
});

$.extend(api, { customer: {

    // ==================== Vustomer - 装修客户（会员） ====================
    pageVustomer:                 { url: 'pageVustomer.do', type: 'query', tranargs: [{ result: 'paging-data', args: ['contractPrice'] }] },
    queryVustomerByUnionId:       { url: 'queryVustomerByUnionId.do', type: 'query', tranargs: [{ result: 'vustomers', args: ['contractPrice'] }] },
    addVustomer:                  { url: 'addVustomer.do', type: 'update', tranargs: { args: ['vustomer.contractPrice'] } },
    updateVustomer:               { url: 'updateVustomer.do', type: 'update', tranargs: { args: ['vustomer.contractPrice'] } },
    deleteVustomer:               { url: 'deleteVustomer.do' },

    // ==================== Vrecord - 客户记录 ====================
    pageVrecord:                  { url: 'pageVrecord.do' },
    queryVrecordByVid:            { url: 'queryVrecordByVid.do' },
    addVrecord:                   { url: 'addVrecord.do' },

    // ==================== CustomerOrigin - 客源 ====================
    pageCustomerOrigin:           { url: 'pageCustomerOrigin.do', type: 'query', tranargs: [{ result: 'paging-data', args: ['buildArea', 'freeArea', 'totalArea', 'innerArea'] }] },
    pageCustomerOriginForAdvance: { url: 'pageCustomerOriginForAdvance.do', type: 'query', tranargs: [{ result: 'paging-data', args: ['buildArea', 'freeArea', 'totalArea', 'innerArea'] }] },
    queryCustomerOriginByCsid:    { url: 'queryCustomerOriginByCsid.do', type: 'query', tranargs: [{ result: 'customerOrigin', args: ['buildArea', 'freeArea', 'totalArea', 'innerArea'] }] },
    addCustomerOrigin:            { url: 'addCustomerOrigin.do', type: 'update', tranargs: { args: ['customerOrigin.buildArea', 'customerOrigin.freeArea', 'customerOrigin.totalArea', 'customerOrigin.innerArea'] } },
    updateCustomerOrigin:         { url: 'updateCustomerOrigin.do', type: 'update', tranargs: { args: ['customerOrigin.buildArea', 'customerOrigin.freeArea', 'customerOrigin.totalArea', 'customerOrigin.innerArea'] } },
    updateCustomerOriginForBelonger: { url: 'updateCustomerOriginForBelonger.do' },
    freeCustomerOrigin:           { url: 'freeCustomerOrigin.do' },
    takeCustomerOrigin:           { url: 'takeCustomerOrigin.do' },
    bindCustomerOrigin:           { url: 'bindCustomerOrigin.do' },
    commitCustomerOrigin:         { url: 'commitCustomerOrigin.do' },
    confirmCustomerOrigin:        { url: 'confirmCustomerOrigin.do' },
    cancelCustomerOrigin:         { url: 'cancelCustomerOrigin.do' },
    approveCustomerOrigin:        { url: 'approveCustomerOrigin.do' },
    tranCustomerOrigin:           { url: 'tranCustomerOrigin.do' },

    // ==================== CustomerOriginRecord - 客源记录 ====================
    queryCustomerOriginRecord:    { url: 'queryCustomerOriginRecord.do' },
    addCustomerOriginRecord:      { url: 'addCustomerOriginRecord.do' },

    // ==================== CustomerFunction - 客户功能开关 ====================
    queryCustomerFunction:        { url: 'queryCustomerFunction.do' },

    // ==================== CustomerCompanyRule - 公司规则 ====================
    pageCustomerCompanyRule:      { url: 'pageCustomerCompanyRule.do', type: 'query', tranargs: [{ result: 'paging-data', args: ['uppval', 'lowval'] }] },
    queryCustomerCompanyRule:     { url: 'queryCustomerCompanyRule.do', type: 'update', tranargs: { args: ['customerCompanyRule.uppval', 'customerUserRuleItem.lowval'], query: [{ result: 'customerCompanyRules', args: ['uppval', 'lowval'] }] } },
    addCustomerCompanyRule:       { url: 'addCustomerCompanyRule.do', type: 'update', tranargs: { args: ['customerCompanyRule.uppval', 'customerCompanyRule.lowval'] } },
    deleteCustomerCompanyRule:    { url: 'deleteCustomerCompanyRule.do', type: 'update', tranargs: { args: ['customerCompanyRule.uppval', 'customerCompanyRule.lowval'] } },

    // ==================== CustomerCityProperRule - 城区规则 ====================
    pageCustomerCityProperRule:   { url: 'pageCustomerCityProperRule.do', type: 'query' },
    queryCustomerCityProperRule:  { url: 'queryCustomerCityProperRule.do', type: 'query' },
    addCustomerCityProperRule:    { url: 'addCustomerCityProperRule.do' },
    deleteCustomerCityProperRule: { url: 'deleteCustomerCityProperRule.do' },
    updateCustomerCityProperRule: { url: 'updateCustomerCityProperRule.do' },

    // ==================== CustomerProtectRule - 保护期规则 ====================
    pageCustomerProtectRule:      { url: 'pageCustomerProtectRule.do', type: 'query', tranargs: [{ result: 'paging-data', args: ['uppval', 'lowval', 'days'] }] },
    queryCustomerProtectRule:     { url: 'queryCustomerProtectRule.do', type: 'query', tranargs: [{ result: 'customerProtectRules', args: ['uppval', 'lowval', 'days'] }] },
    checkCustomerProtectRule:     { url: 'checkCustomerProtectRule.do', type: 'query', tranargs: [{ result: 'customerProtectRule', args: ['uppval', 'lowval', 'days'] }] },
    addCustomerProtectRule:       { url: 'addCustomerProtectRule.do', type: 'update', tranargs: { args: ['customerProtectRule.uppval', 'customerProtectRule.lowval', 'customerProtectRule.days'] } },
    deleteCustomerProtectRule:    { url: 'deleteCustomerProtectRule.do' },

    // ==================== CustomerDeptRule - 部门规则 ====================
    pageCustomerDeptRule:         { url: 'pageCustomerDeptRule.do' },
    queryCustomerDeptRuleByDid:   { url: 'queryCustomerDeptRuleByDid.do' },
    queryCustomerDeptRuleByDbid:  { url: 'queryCustomerDeptRuleByDbid.do' },
    addCustomerDeptRule:          { url: 'addCustomerDeptRule.do' },
    deleteCustomerDeptRule:       { url: 'deleteCustomerDeptRule.do' },

    // ==================== CustomerUserRule - 人员规则 ====================
    pageCustomerUserRule:         { url: 'pageCustomerUserRule.do', type: 'query', tranargs: [{ result: 'paging-data', args: ['measureNum', 'contractNum', 'contractPrice', 'materialPrice', 'designPrice', 'predisPrice', 'score', 'rank', 'chance', 'surplus', 'polling'] }] },
    queryCustomerUserRule:        { url: 'queryCustomerUserRule.do', type: 'query', tranargs: [{ result: 'customerUserRule', args: ['measureNum', 'contractNum', 'contractPrice', 'materialPrice', 'designPrice', 'predisPrice', 'score', 'rank', 'chance', 'surplus', 'polling'] }] },
    addCustomerUserRule:          { url: 'addCustomerUserRule.do', type: 'update', tranargs: { args: ['customerUserRule.measureNum', 'customerUserRule.contractNum', 'customerUserRule.contractPrice', 'customerUserRule.materialPrice', 'customerUserRule.designPrice', 'customerUserRule.predisPrice', 'customerUserRule.score', 'customerUserRule.rank', 'customerUserRule.chance', 'customerUserRule.surplus', 'customerUserRule.polling'], query: [{ result: 'customerUserRule', args: ['measureNum', 'contractNum', 'contractPrice', 'materialPrice', 'designPrice', 'predisPrice', 'score', 'rank', 'chance', 'surplus', 'polling'] }] } },
    updateCustomerUserRule:       { url: 'updateCustomerUserRule.do', type: 'update', tranargs: { args: ['customerUserRule.measureNum', 'customerUserRule.contractNum', 'customerUserRule.contractPrice', 'customerUserRule.materialPrice', 'customerUserRule.designPrice', 'customerUserRule.predisPrice', 'customerUserRule.score', 'customerUserRule.rank', 'customerUserRule.chance', 'customerUserRule.surplus', 'customerUserRule.polling'] } },
    updateCustomerUserRuleForStatus: { url: 'updateCustomerUserRuleForStatus.do', type: 'update', tranargs: { args: ['customerUserRule.measureNum', 'customerUserRule.contractNum', 'customerUserRule.contractPrice', 'customerUserRule.materialPrice', 'customerUserRule.designPrice', 'customerUserRule.predisPrice', 'customerUserRule.score', 'customerUserRule.rank', 'customerUserRule.chance', 'customerUserRule.surplus', 'customerUserRule.polling'] } },
    disableCustomerUserRule:      { url: 'disableCustomerUserRule.do' },
    disableCustomerUserRuleByCurid: { url: 'disableCustomerUserRuleByCurid.do' },

    // ==================== CustomerUserRuleItem - 人员规则项 ====================
    queryCustomerUserRuleItem:    { url: 'queryCustomerUserRuleItem.do', type: 'query', tranargs: [{ result: 'customerUserRuleItems', args: ['uppval', 'lowval', 'chance'] }] },
    addCustomerUserRuleItem:      { url: 'addCustomerUserRuleItem.do', type: 'update', tranargs: { args: ['customerUserRuleItem.uppval', 'customerUserRuleItem.lowval', 'customerUserRuleItem.chance'], query: [{ result: 'customerUserRuleItem', args: ['uppval', 'lowval', 'chance'] }] } },
    deleteCustomerUserRuleItem:   { url: 'deleteCustomerUserRuleItem.do' },
    queryCustomerUserRuleItemByPinyin: { url: 'queryCustomerUserRuleItemByPinyin.do', type: 'query' },

    // ==================== CustomerSource - 客户来源 ====================
    pageCustomerSource:           { url: 'pageCustomerSource.do', type: 'query', tranargs: [{ result: 'paging-data', args: ['buildArea', 'freeArea', 'totalArea', 'innerArea'] }] },
    queryCustomerSource:          { url: 'queryCustomerSource.do', type: 'query', tranargs: [{ result: 'customerSource', args: ['buildArea', 'freeArea', 'totalArea', 'innerArea'] }] },
    addCustomerSource:            { url: 'addCustomerSource.do', type: 'update', tranargs: { args: ['customerSource.buildArea', 'customerSource.freeArea', 'customerSource.totalArea', 'customerSource.innerArea'], query: [{ result: 'customerSource', args: ['buildArea', 'freeArea', 'totalArea', 'innerArea'] }] } },
    updateCustomerSource:         { url: 'updateCustomerSource.do', type: 'update', tranargs: { args: ['customerSource.buildArea', 'customerSource.freeArea', 'customerSource.totalArea', 'customerSource.innerArea'], query: [{ result: 'customerSource', args: ['buildArea', 'freeArea', 'totalArea', 'innerArea'] }] } },
    updateCustomerSourceForStatus: { url: 'updateCustomerSourceForStatus.do' },
    updateCustomerSourceForCustomer: { url: 'updateCustomerSourceForCustomer.do' },
    updateCustomerSourceForHouse: { url: 'updateCustomerSourceForHouse.do' },
    issueCustomerSource:          { url: 'issueCustomerSource.do' },
    pageCustomerSourceRecord:     { url: 'pageCustomerSourceRecord.do' },
    queryCustomerSourceRecord:    { url: 'queryCustomerSourceRecord.do' },

    // ==================== CustomerNotice - 客户通知 ====================
    pageCustomerNotice:           { url: 'pageCustomerNotice.do' },

    // ==================== CustomerChance - 商机 ====================
    pageCustomerChance:           { url: 'pageCustomerChance.do', type: 'query', tranargs: [{ result: 'paging-data-source', args: ['buildArea', 'freeArea', 'totalArea', 'innerArea'] }, { result: 'paging-data-source-house', args: ['buildArea', 'freeArea', 'totalArea', 'innerArea'] }] },
    queryCustomerChanceByCcid:    { url: 'queryCustomerChanceByCcid.do', type: 'query', tranargs: [{ result: 'source', args: ['buildArea', 'freeArea', 'totalArea', 'innerArea'] }, { result: 'paging-data-source-house', args: ['buildArea', 'freeArea', 'totalArea', 'innerArea'] }] },
    updateCustomerChance:         { url: 'updateCustomerChance.do' },
    issueCustomerChance:          { url: 'issueCustomerChance.do' },
    disableCustomerChance:        { url: 'disableCustomerChance.do' },
    sendCustomerChance:           { url: 'sendCustomerChance.do' },
    confirmCustomerChance:        { url: 'confirmCustomerChance.do' },
    affirmCustomerChance:         { url: 'affirmCustomerChance.do' },
    changeCustomerChance:         { url: 'changeCustomerChance.do' },
    readCustomerChance:           { url: 'readCustomerChance.do' },
    configCustomerChance:         { url: 'configCustomerChance.do' },
    fineCustomerChance:           { url: 'fineCustomerChance.do' },
    finishCustomerChance:         { url: 'finishCustomerChance.do' },
    uncheckCustomerChance:        { url: 'uncheckCustomerChance.do' },
    tranCustomerChance:           { url: 'tranCustomerChance.do' },
    approveCustomerChance:        { url: 'approveCustomerChance.do' },

    // ==================== CustomerProfile - 客户画像 ====================
    pageCustomerProfile:          { url: 'pageCustomerProfile.do' },
    queryCustomerProfileByOrderId: { url: 'queryCustomerProfileByOrderId.do' },
    queryCustomerProfileByCid:    { url: 'queryCustomerProfileByCid.do' },
    queryCustomerProfileByCsid:   { url: 'queryCustomerProfileByCsid.do' },
    queryCustomerProfileByCpid:   { url: 'queryCustomerProfileByCpid.do' },
    addCustomerProfile:           { url: 'addCustomerProfile.do' },
    handleCustomerProfile:        { url: 'handleCustomerProfile.do' },
    makeCustomerProfile:          { url: 'makeCustomerProfile.do' },

    // ==================== VustomerNet - 客户网（老带新） ====================
    pageVustomerByUnionId:        { url: 'pageVustomerByUnionId.do' },
    buildVustomerNet:             { url: 'buildVustomerNet.do' },
    countVustomerNetByUnionId:    { url: 'countVustomerNetByUnionId.do' },
    countVustomerByUnionId:       { url: 'countVustomerByUnionId.do' },

    // ==================== Vscore / VscoreRecord - 客户积分 ====================
    queryVscoreByUnionId:         { url: 'queryVscoreByUnionId.do' },
    pageVscoreRecordByUnionId:    { url: 'pageVscoreRecordByUnionId.do' },
    raiseVscore:                  { url: 'raiseVscore.do' },
    pickupVscore:                 { url: 'pickupVscore.do' },
    updateVscoreRecordForStatus:  { url: 'updateVscoreRecordForStatus.do' },
    pageVustomerForAdvance:       { url: 'pageVustomerForAdvance.do', type: 'query', tranargs: [{ result: 'paging-data', args: ['contractPrice'] }] },
    pageVustomerForCommunion:     { url: 'pageVustomerForCommunion.do', type: 'query', tranargs: [{ result: 'paging-data', args: ['contractPrice'] }] },
    freeVustomer:                 { url: 'freeVustomer.do' },
    takeVustomer:                 { url: 'takeVustomer.do' },
    updateVustomerForBelonger:    { url: 'updateVustomerForBelonger.do' },

    // ==================== Vuser - 客户圈用户 ====================
    addVuser:                     { url: 'addVuser.do' },
    queryVuser:                   { url: 'queryVuser.do' },

    // ==================== 公众号（客户侧查询） ====================
    queryCusConstructer:          { url: 'queryCusConstructer.do' },
    queryCusConstruction:         { url: 'queryCusConstruction.do' },
    queryCusDecoration:           { url: 'queryCusDecoration.do' },
    queryCusDecorationByOrderId:  { url: 'queryCusDecorationByOrderId.do' },
    queryCusDecorationUser:       { url: 'queryCusDecorationUser.do' },
    bindingCusDecoration:         { url: 'bindingCusDecoration.do' },
    queryCusDecorationForDefault: { url: 'queryCusDecorationForDefault.do' },
    queryCusTalking:              { url: 'queryCusTalking.do' },
    updateCusDecorationForDefault: { url: 'updateCusDecorationForDefault.do' },

    // ==================== Survey - 调研 ====================
    pageSurvey:                   { url: 'pageSurvey.do' },
    querySurveyByOrderId:         { url: 'querySurveyByOrderId.do' },
    querySurveyBySid:             { url: 'querySurveyBySid.do' },
    makeSurvey:                   { url: 'makeSurvey.do' },
    handleSurvey:                 { url: 'handleSurvey.do' },
    sendSurvey:                   { url: 'sendSurvey.do' },
    finishSurvey:                 { url: 'finishSurvey.do' },

    // ==================== Emember - 电子会员 ====================
    pageEmember:                  { url: 'pageEmember.do' },
    queryEmember:                 { url: 'queryEmember.do' },
    addEmember:                   { url: 'addEmember.do' },
    deleteEmember:                { url: 'deleteEmember.do' },

    // ==================== Feedback - 反馈 ====================
    pageFeedback:                 { url: 'pageFeedback.do' },
    addFeedback:                  { url: 'addFeedback.do' },
    finishFeedback:               { url: 'finishFeedback.do' },
    receiveFeedback:              { url: 'receiveFeedback.do' },
    queryFeedbackBackVisit:       { url: 'queryFeedbackBackVisit.do' },
    addFeedbackBackVisit:         { url: 'addFeedbackBackVisit.do' },
    queryFeedbackRecord:          { url: 'queryFeedbackRecord.do' },
    addFeedbackRecord:            { url: 'addFeedbackRecord.do' },
    queryFeedbackComplaintProblem: { url: 'queryFeedbackComplaintProblem.do' },
    queryFeedbackComplaint:       { url: 'queryFeedbackComplaint.do' },
    addFeedbackComplaint:         { url: 'addFeedbackComplaint.do' },
    updateFeedbackComplaint:      { url: 'updateFeedbackComplaint.do' },
    finishFeedbackComplaint:      { url: 'finishFeedbackComplaint.do' },
    queryFeedbackComplaintDept:   { url: 'queryFeedbackComplaintDept.do' },
    addFeedbackComplaintDept:     { url: 'addFeedbackComplaintDept.do' },
    updateFeedbackComplaintDept:  { url: 'updateFeedbackComplaintDept.do' },
    deleteFeedbackComplaintDept:  { url: 'deleteFeedbackComplaintDept.do' },
    queryFeedbackDrawing:         { url: 'queryFeedbackDrawing.do' },
    queryFeedbackDrawingBySid:    { url: 'queryFeedbackDrawingBySid.do' },
    addFeedbackDrawing:           { url: 'addFeedbackDrawing.do' },
    deleteFeedbackDrawing:        { url: 'deleteFeedbackDrawing.do' },
    updateFeedbackDrawing:        { url: 'updateFeedbackDrawing.do' },
    queryFeedbackGuarantee:       { url: 'queryFeedbackGuarantee.do' },
    queryFeedbackGuaranteeByFgid: { url: 'queryFeedbackGuaranteeByFgid.do' },
    addFeedbackGuarantee:         { url: 'addFeedbackGuarantee.do' },
    updateFeedbackGuarantee:      { url: 'updateFeedbackGuarantee.do' },

    // ==================== CustomerAfterSales - 售后 ====================
    pageCustomerAfterSales:       { url: 'pageCustomerAfterSales.do' },
    queryCustomerAfterSalesByAsid: { url: 'queryCustomerAfterSalesByAsid.do' },
    queryCustomerAfterSalesByOrderId: { url: 'queryCustomerAfterSalesByOrderId.do' },
    queryCustomerAfterSalesByCid: { url: 'queryCustomerAfterSalesByCid.do' },
    addCustomerAfterSales:        { url: 'addCustomerAfterSales.do' },
    receiveCustomerAfterSales:    { url: 'receiveCustomerAfterSales.do' },
    handleCustomerAfterSales:     { url: 'handleCustomerAfterSales.do' },
    dispatchCustomerAfterSales:   { url: 'dispatchCustomerAfterSales.do' },
    tranCustomerAfterSales:       { url: 'tranCustomerAfterSales.do' },
    holdCustomerAfterSales:       { url: 'holdCustomerAfterSales.do' },
    upgradeCustomerAfterSales:    { url: 'upgradeCustomerAfterSales.do' },
    finishCustomerAfterSales:     { url: 'finishCustomerAfterSales.do' },
    closeCustomerAfterSales:      { url: 'closeCustomerAfterSales.do' },
    cancelCustomerAfterSales:     { url: 'cancelCustomerAfterSales.do' },
    reopenCustomerAfterSales:     { url: 'reopenCustomerAfterSales.do' },
    queryCustomerAfterSalesRecord: { url: 'queryCustomerAfterSalesRecord.do' },
    addCustomerAfterSalesRecord:  { url: 'addCustomerAfterSalesRecord.do' },
    queryCustomerAfterSalesRef:   { url: 'queryCustomerAfterSalesRef.do' },
    addCustomerAfterSalesRef:     { url: 'addCustomerAfterSalesRef.do' },

    // ==================== Group - 客户群 ====================
    pageGroup:                    { url: 'pageGroup.do' },
    queryGroup:                   { url: 'queryGroup.do' },
    updateGroup:                  { url: 'updateGroup.do' },
    unbindGroup:                  { url: 'unbindGroup.do' },
    bindGroup:                    { url: 'bindGroup.do' },

    // ==================== CusPayment - 公众号款项查询 ====================
    queryCusMaterialPayment:      { url: 'queryCusMaterialPayment.do' },
    queryCusDecorationPayment:    { url: 'queryCusDecorationPayment.do' },
    queryCusServicePayment:       { url: 'queryCusServicePayment.do' },
    queryCusSalesPayment:         { url: 'queryCusSalesPayment.do' },
    queryCusAdvance:              { url: 'queryCusAdvance.do' },
    queryCusPayment:              { url: 'queryCusPayment.do' },
    queryCusDecorationPicture:    { url: 'queryCusDecorationPicture.do' },
    queryCusConstructionDrawing:  { url: 'queryCusConstructionDrawing.do' },
    addDecorationCircle:          { url: 'addDecorationCircle.do' },

    // ==================== Consultion / Revisit - 咨询 / 回访 ====================
    pageConsultion:               { url: 'pageConsultion.do' },
    queryConsultionByOrderId:     { url: 'queryConsultionByOrderId.do' },
    addConsultion:                { url: 'addConsultion.do' },
    pageRevisit:                  { url: 'pageRevisit.do' },
    queryRevisitByOrderId:        { url: 'queryRevisitByOrderId.do' },
    queryRevisitForAepair:        { url: 'queryRevisitForAepair.do' },
    queryRevisitForComplain:      { url: 'queryRevisitForComplain.do' },
    visitRevisit:                 { url: 'visitRevisit.do' },

    // ==================== Complain / Complaint - 投诉 ====================
    pageComplain:                 { url: 'pageComplain.do' },
    queryComplain:                { url: 'queryComplain.do' },
    queryComplainByOrderId:       { url: 'queryComplainByOrderId.do' },
    addComplain:                  { url: 'addComplain.do' },
    finishComplain:               { url: 'finishComplain.do' },
    closeComplain:                { url: 'closeComplain.do' },
    queryComplaint:               { url: 'queryComplaint.do' },
    addComplaint:                 { url: 'addComplaint.do' },
    finishComplaint:              { url: 'finishComplaint.do' },
    closeComplaint:               { url: 'closeComplaint.do' },
    queryComplack:                { url: 'queryComplack.do' },
    trackComplack:                { url: 'trackComplack.do' },

    // ==================== Aepair - 维修 ====================
    pageAepair:                   { url: 'pageAepair.do' },
    queryAepair:                  { url: 'queryAepair.do' },
    queryAepairByOrderId:         { url: 'queryAepairByOrderId.do' },
    addAepair:                    { url: 'addAepair.do' },
    updateAepair:                 { url: 'updateAepair.do', type: 'update', tranargs: { args: ['aepair.outlay'] } },
    receiveAepair:                { url: 'receiveAepair.do' },
    deliveAepair:                 { url: 'deliveAepair.do' },
    tranAepair:                   { url: 'tranAepair.do' },
    finishAepair:                 { url: 'finishAepair.do' },
    closeAepair:                  { url: 'closeAepair.do' },
    sendAepair:                   { url: 'sendAepair.do' },

    // ==================== Repair / Repairpay - 返修 ====================
    queryRepair:                  { url: 'queryRepair.do' },
    addRepair:                    { url: 'addRepair.do' },
    keepRepair:                   { url: 'keepRepair.do' },
    finishRepair:                 { url: 'finishRepair.do' },
    queryRepairpay:               { url: 'queryRepairpay.do', type: 'query', tranargs: [{ result: 'repairpays', args: ['money'] }] },
    addRepairpay:                 { url: 'addRepairpay.do', type: 'update', tranargs: { args: ['repairpay.money'] } },
    deleteRepairpay:              { url: 'deleteRepairpay.do' },

    // ==================== PointAccount / PointRecord - 积分账户 ====================
    pagePointAccount:             { url: 'pagePointAccount.do', type: 'query', tranargs: [{ result: 'pointAccount', args: ['decorationPoint', 'materialPoint', 'operatePoint'] }] },
    queryPointAccount:            { url: 'queryPointAccount.do', type: 'query', tranargs: [{ result: 'pointAccount', args: ['decorationPoint', 'materialPoint', 'operatePoint'] }] },
    queryPointRecord:             { url: 'queryPointRecord.do', type: 'query', tranargs: [{ result: 'pointRecords', args: ['balance', 'point'] }] },
    createPointAccount:           { url: 'createPointAccount.do' },
    grantPoint:                   { url: 'grantPoint.do', type: 'update', tranargs: { args: ['pointAccount.decorationPoint', 'pointAccount.materialPoint', 'pointAccount.operatePoint'] } },
    consumePoint:                 { url: 'consumePoint.do', type: 'update', tranargs: { args: ['pointAccount.decorationPoint', 'pointAccount.materialPoint', 'pointAccount.operatePoint'] } },

    // ==================== Droup - 客户群组（钉钉/微信） ====================
    pageDroup:                    { url: 'pageDroup.do' },
    queryDroup:                   { url: 'queryDroup.do' },
    updateDroup:                  { url: 'updateDroup.do' },
    deleteDroup:                  { url: 'deleteDroup.do' },
    bindDroup:                    { url: 'bindDroup.do' },

    // ==================== Conversation - 会话 ====================
    pageConversation:             { url: 'pageConversation.do' },
    requestConversation:          { url: 'requestConversation.do' },
    responseConversation:         { url: 'responseConversation.do' },
    deleteConversation:           { url: 'deleteConversation.do' }
}});
