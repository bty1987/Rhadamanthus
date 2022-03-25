$.extend(api.index, {
	vustomer: {url: "/views/customer/vustomer.html"},
	vrecord: {url: "/views/customer/vrecord.html"},
	vscoreRecord: {url: "/views/customer/vscoreRecord.html"},
	vustomerAdvance : {url : "/views/customer/vustomerAdvance.html"},
    crowd : {url : "/views/customer/crowd.html"}
});

$.extend(api, {customer: {
    pageVustomer: {
        url: "pageVustomer.do",
        type: "query",
        tranargs: [{
            result: "paging-data",
            args: ["contractPrice"]
        }]
    },
    queryVustomerByUnionId: {
        url: "queryVustomerByUnionId.do",
        type: "query",
        tranargs: [{
            result: "vustomers",
            args: ["contractPrice"]
        }]
    },
    addVustomer: {
        url: "addVustomer.do",
        type: "update",
        tranargs: {
            args: ["vustomer.contractPrice"]
        }
    },
    updateVustomer: {
        url: "updateVustomer.do",
        type: "update",
        tranargs: {
            args: ["vustomer.contractPrice"]
        }
    },
	deleteVustomer: {url: "deleteVustomer.do"},
	
	pageVrecord: {url: "pageVrecord.do"},
	queryVrecordByVid: {url: "queryVrecordByVid.do"},
	addVrecord: {url: "addVrecord.do"},
	
    pageCustomerOrigin: {
        url: "pageCustomerOrigin.do",
        type: "query",
        tranargs: [{
            result: "paging-data",
            args: ["buildArea", "freeArea", "totalArea", "innerArea"]
        }]
    },
    pageCustomerOriginForAdvance: {
        url: "pageCustomerOriginForAdvance.do",
        type: "query",
        tranargs: [{
            result: "paging-data",
            args: ["buildArea", "freeArea", "totalArea", "innerArea"]
        }]
    },
    addCustomerOrigin: {
        url: "addCustomerOrigin.do",
        type: "update",
        tranargs: {
            args: ["customerOrigin.buildArea", "customerOrigin.freeArea", "customerOrigin.totalArea", "customerOrigin.innerArea"]
        }
    },
    updateCustomerOrigin: {
        url: "updateCustomerOrigin.do",
        type: "update",
        tranargs: {
            args: ["customerOrigin.buildArea", "customerOrigin.freeArea", "customerOrigin.totalArea", "customerOrigin.innerArea"]
        }
    },
	updateCustomerOriginForBelonger: {url:"updateCustomerOriginForBelonger.do"},
	freeCustomerOrigin: {url:"freeCustomerOrigin.do"},
	takeCustomerOrigin: {url:"takeCustomerOrigin.do"},
	bindCustomerOrigin: {url:"bindCustomerOrigin.do"},
	commitCustomerOrigin: {url:"commitCustomerOrigin.do"},
	confirmCustomerOrigin: {url:"confirmCustomerOrigin.do"},
	cancelCustomerOrigin: {url:"cancelCustomerOrigin.do"},
    
    queryCustomerRecord: {url:"queryCustomerRecord.do"},
    addCustomerRecord: {url:"addCustomerRecord.do"},
    //删除会员
    deleteEmember: {url:"deleteEmember.do"},

    queryCustomerOriginFunction: {url:"queryCustomerOriginFunction.do"},
    
    pageVustomerByUnionId : {url : "pageVustomerByUnionId.do"},
    buildVustomerNet : {url : "buildVustomerNet.do"},
    countVustomerNetByUnionId : {url : "countVustomerNetByUnionId.do"},
    countVustomerByUnionId : {url : "countVustomerByUnionId.do"},
    queryVscoreByUnionId : {url : "queryVscoreByUnionId.do"},
    pageVscoreRecordByUnionId : {url : "pageVscoreRecordByUnionId.do"},
    raiseVscore : {url : "raiseVscore.do"},
    pickupVscore : {url : "pickupVscore.do"},
    updateVscoreRecordForStatus : {url : "updateVscoreRecordForStatus.do"},
   
    pageVustomerForAdvance: {
        url: "pageVustomerForAdvance.do",
        type: "query",
        tranargs: [{
            result: "paging-data",
            args: ["contractPrice"]
        }]
    },
    pageVustomerForCommunion: {
        url: "pageVustomerForCommunion.do",
        type: "query",
        tranargs: [{
            result: "paging-data",
            args: ["contractPrice"]
        }]
    },
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

    pageSurvey : {url : "pageSurvey.do"},
    querySurveyByOrderId : {url : "querySurveyByOrderId.do"},
    querySurveyBySid : {url : "querySurveyBySid.do"},
    makeSurvey : {url : "makeSurvey.do"},
    handleSurvey : {url : "handleSurvey.do"},
    sendSurvey : {url : "sendSurvey.do"},

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
    
    addDecorationCircle:{url:"addDecorationCircle.do"},
    pageConsultion : {url : "pageConsultion.do"},
    queryConsultionByOrderId : {url : "queryConsultionByOrderId.do"},
    addConsultion : {url : "addConsultion.do"},
    pageRevisit:{url:"pageRevisit.do"},
    queryRevisitByOrderId:{url:"queryRevisitByOrderId.do"},
    queryRevisitForAepair:{url:"queryRevisitForAepair.do"},
    queryRevisitForComplain:{url:"queryRevisitForComplain.do"},
	visitRevisit:{url:"visitRevisit.do"},
	
    pageComplain:{url:"pageComplain.do"},
    queryComplain:{url:"queryComplain.do"},
    queryComplainByOrderId:{url:"queryComplainByOrderId.do"},
    addComplain:{url:"addComplain.do"},
    finishComplain:{url:"finishComplain.do"},
    closeComplain:{url:"closeComplain.do"},
    queryComplaint:{url:"queryComplaint.do"},
    addComplaint:{url:"addComplaint.do"},
    finishComplaint:{url:"finishComplaint.do"},
    closeComplaint:{url:"closeComplaint.do"},
    queryComplack:{url:"queryComplack.do"},
    trackComplack:{url:"trackComplack.do"},
	
	pageAepair: {url:"pageAepair.do"},
    queryAepair: {url:"queryAepair.do"},
    queryAepairByOrderId: {url:"queryAepairByOrderId.do"},
    addAepair: {url:"addAepair.do"},
    updateAepair: {
    	url:"updateAepair.do",
    	type: "update",
        tranargs: {
            args: ["aepair.outlay"]
        }
    },
    receiveAepair: {url:"receiveAepair.do"},
    deliveAepair: {url:"deliveAepair.do"},
    tranAepair: {url:"tranAepair.do"},
    finishAepair: {url:"finishAepair.do"},
    closeAepair: {url:"closeAepair.do"},
    sendAepair: {url:"sendAepair.do"},
    
    queryRepair: {url:"queryRepair.do"},
    addRepair: {url:"addRepair.do"},
    keepRepair: {url:"keepRepair.do"},
    finishRepair: {url:"finishRepair.do"},
    
    queryRepairpay: {
    	url:"queryRepairpay.do",
    	type: "query",
        tranargs: [{
            result: "repairpays",
            args: ["money"]
        }]
    },
    addRepairpay: {
    	url:"addRepairpay.do",
    	type: "update",
        tranargs: {
            args: ["repairpay.money"]
        }
    },
    deleteRepairpay: {url:"deleteRepairpay.do"},
    
   queryCppoint:{
        url:"queryCppoint.do",
        type: "query",
        tranargs: [{
            result: "cppoint",
            args: ["dpoint", "spoint"]
        }]
    },
    queryCppointRecord:{
        url:"queryCppointRecord.do",
        type: "query",
        tranargs: [{
            result: "cppointRecords",
            args: ["balance", "point"]
        }]
    },
    createCppoint:{url:"createCppoint.do"},
    addupCppoint:{
        url:"addupCppoint.do",
        type: "update",
        tranargs: {
            args: ["cppoint.dpoint", "cppoint.spoint"]
        }
    },
    useupCppoint:{
        url:"useupCppoint.do",
        type: "update",
        tranargs: {
            args: ["cppoint.dpoint", "cppoint.spoint"]
        }
    },
    queryFeedbackDrawing: {url:"queryFeedbackDrawing.do"},
    addFeedbackDrawing: {url:"addFeedbackDrawing.do"},
	
	
}});


