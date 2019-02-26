$.extend(api.index, {
	vustomer: {url: "/views/customer/vustomer.html"},
	vrecord: {url: "/views/customer/vrecord.html"},
	vscoreRecord: {url: "/views/customer/vscoreRecord.html"},
	vustomerAdvance : {url : "/views/customer/vustomerAdvance.html"},
    crowd : {url : "/views/customer/crowd.html"}
});

$.extend(api, {customer: {
    
	pageVustomer: {url: "pageVustomer.do"},
	
	queryVustomerByUnionId: {url: "queryVustomerByUnionId.do"},
	
	addVustomer: {url: "addVustomer.do"},
	
	updateVustomer: {url: "updateVustomer.do"},
	
	deleteVustomer: {url: "deleteVustomer.do"},
	
	pageVrecord: {url: "pageVrecord.do"},
	
	queryVrecordByVid: {url: "queryVrecordByVid.do"},
	
	addVrecord: {url: "addVrecord.do"},
	
	pageCustomerOrigin:{url:"pageCustomerOrigin.do"},
    
	pageCustomerOriginForAdvance:{url:"pageCustomerOriginForAdvance.do"},
    
	pageCustomerOriginForCommunion:{url:"pageCustomerOriginForCommunion.do"},
	
	pageCustomerOriginForDesign:{url:"pageCustomerOriginForDesign.do"},

	addCustomerOrigin:{url:"addCustomerOrigin.do"},
    
	updateCustomerOrigin:{url:"updateCustomerOrigin.do"},
    
	updateCustomerOriginForBelonger:{url:"updateCustomerOriginForBelonger.do"},
	
	bindCustomerOrigin:{url:"bindCustomerOrigin.do"},
    
	freeCustomerOrigin:{url:"freeCustomerOrigin.do"},
    
	takeCustomerOrigin:{url:"takeCustomerOrigin.do"},
    
    queryCustomerRecord:{url:"queryCustomerRecord.do"},
    
    addCustomerRecord:{url:"addCustomerRecord.do"},
    
    
    pageVustomerByUnionId : {url : "pageVustomerByUnionId.do"},
    buildVustomerNet : {url : "buildVustomerNet.do"},
    countVustomerNetByUnionId : {url : "countVustomerNetByUnionId.do"},
    countVustomerByUnionId : {url : "countVustomerByUnionId.do"},
    queryVscoreByUnionId : {url : "queryVscoreByUnionId.do"},
    pageVscoreRecordByUnionId : {url : "pageVscoreRecordByUnionId.do"},
    raiseVscore : {url : "raiseVscore.do"},
    pickupVscore : {url : "pickupVscore.do"},
    updateVscoreRecordForStatus : {url : "updateVscoreRecordForStatus.do"},
   
    pageVustomerForAdvance : {url : "pageVustomerForAdvance.do"},
    pageVustomerForCommunion : {url : "pageVustomerForCommunion.do"},
    freeVustomer : {url : "freeVustomer.do"},
    takeVustomer : {url : "takeVustomer.do"},
    updateVustomerForBelonger : {url : "updateVustomerForBelonger.do"},
    
    addVuser : {url : "addVuser.do"},
    queryVuser : {url : "queryVuser.do"},
    
    
    
    
    //公众号
    queryCusConstructer : {url : "queryCusConstructer.do"},
    queryCusConstruction : {url : "queryCusConstruction.do"},
    
    queryCusDecoration : {url : "queryCusDecoration.do"},
    queryCusDecorationByOrderId : {url : "queryCusDecorationByOrderId.do"},
    queryCusDecorationUser : {url : "queryCusDecorationUser.do"},
    bindingCusDecoration : {url : "bindingCusDecoration.do"},
    queryCusDecorationForDefault : {url : "queryCusDecorationForDefault.do"},
    updateCusDecorationForDefault : {url : "updateCusDecorationForDefault.do"},
    
    pageEmember : {url : "pageEmember.do"},
    queryEmember : {url : "queryEmember.do"},
    addEmember : {url : "addEmember.do"},
    
    pageFeedback : {url : "pageFeedback.do"},
    addFeedback : {url : "addFeedback.do"},
    
    pageGroup : {url : "pageGroup.do"},
    queryGroup : {url : "queryGroup.do"},
    updateGroup : {url : "updateGroup.do"},
    unbindGroup : {url : "unbindGroup.do"},
    bindGroup : {url : "bindGroup.do"},
    
    queryCusMaterialPayment : {url : "queryCusMaterialPayment.do"},
    queryCusDecorationPayment : {url : "queryCusDecorationPayment.do"},
    queryCusServicePayment : {url : "queryCusServicePayment.do"},
    queryCusSalesPayment : {url : "queryCusSalesPayment.do"},
    queryCusAdvance: {url : "queryCusAdvance.do"},
    queryCusPayment : {url : "queryCusPayment.do"},
    
    queryCusDecorationPicture : {url : "queryCusDecorationPicture.do"},
    queryCusConstructionDrawing : {url : "queryCusConstructionDrawing.do"},
    
    addDecorationCircle:{url:"addDecorationCircle.do"}
    
}});


