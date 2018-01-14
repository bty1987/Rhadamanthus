
$.extend(api.index, {

	productionIndex : {
		url : "views/production/production.html"
	},
	productionPictureIndex : {
		url : "views/production/productionPicture.html"
	},
	productionSalesIndex : {
		url : "views/production/productionSales.html"
	},
	puotationIndex : {
		url : "views/production/puotation.html"
	},
	createPutationIndex : {
		url : "views/production/createPuotation.html"
	},
	addPuotationItemIndex : {
		url : "views/production/addPuotationItem.html"
	},
	puotationItemIndex : {
		url : "views/production/puotationItem.html"
	},
	outsourceIndex : {
		url : "views/production/outsource.html"
	},
	outsourceItemIndex : {
		url : "views/production/outsourceItem.html"
	},
	hardwareIndex : {
		url : "views/production/hardware.html"
	},
	hardwareItemIndex : {
		url : "views/production/viewHardwareItem.html"
	},
	productionPlanIndex : {
		url : "views/production/productionPlan.html"
	},
	productionPlanItemIndex : {
		url : "views/production/productionPlanItem.html"
	},hardwareItemImportIndex : {
		url : "views/production/hardwareItemImport.html"
	},productionPlanDetailIndex : {
		url : "views/production/productionPlanDetail.html"
	},
	
});

$.extend(api.ds, {
    
});
$.extend(api,{production:{
	pageQuoteItem :{url:"pageQuoteItem.do"},
	queryQuoteItemByPinyin : {url:"queryQuoteItemByPinyin.do"},
	addQuoteItem : {url:"addQuoteItem.do"},
	updateQuoteItem : {url :"updateQuoteItem.do"},
	updateQuoteItemForStatus : {url:"updateQuoteItemForStatus.do"},
    
    pageQuoteType:{url:"pageQuoteType.do"},
	queryQuoteType:{url:"queryQuoteType.do"},
	addQuoteType:{url:"addQuoteType.do"},
	updateQuoteType:{url:"updateQuoteType.do"},
	updateQuoteTypeForStatus:{url:"updateQuoteTypeForStatus.do"},

	pageWorkplan :{url:"pageWorkplan.do"},
	queryWorkplan :{url:"queryWorkplan.do"},
	queryWorkplanByWsid :{url:"queryWorkplanByWsid.do"},
	addWorkplan :{url:"addWorkplan.do"},
	updateWorkplan :{url:"updateWorkplan.do"},
	updateWorkplanForStatus :{url:"updateWorkplanForStatus.do"},

	pageWorkshop :{url:"pageWorkshop.do"},
	queryWorkshop : {url:"queryWorkshop.do"},
	addWorkshop : {url:"addWorkshop.do"},
	updateWorkshop : {url :"updateWorkshop.do"},
	updateWorkshopForStatus : {url:"updateWorkshopForStatus.do"},

	pageWorkflow: {url: "pageWorkflow.do"},
	queryWorkflow:{url:"queryWorkflow.do"},
	addWorkflow:{url:"addWorkflow.do"},
	updateWorkflow: {url: "updateWorkflow.do"},
	updateWorkflowForStatus:{url:"updateWorkflowForStatus.do"},
	queryWorkflowPlanByWfid:{url:"queryWorkflowPlanByWfid.do"},
	queryWorkflowPlanByWpid:{url:"queryWorkflowPlanByWpid.do"},
	updateWorkflowPlan:{url:"updateWorkflowPlan.do"},

	pageProduction:{url:"pageProduction.do"},
	addProduction:{url:"addProduction.do"},
	updateProductionForStatus:{url:"updateProductionForStatus.do"},
	updateProductionForDeliveryStatus:{url:"updateProductionForDeliveryStatus.do"},
	queryProductionByPno:{url:"queryProductionByPno.do"},

	addPuotation:{url:"addPuotation.do"},
	addPuotationItem:{url:"addPuotationItem.do"},
	queryPuotationItemByQid:{url:"queryPuotationItemByQid.do"},
	queryPuotationByPid:{url:"queryPuotationByPid.do"},
	updatePuotation:{url:"updatePuotation.do"},
	updatePuotationForAdvance:{url:"updatePuotationForAdvance.do"},
	updatePuotationForDefault:{url:"updatePuotationForDefault.do"},
	deletePuotation:{url:"deletePuotation.do"},
	deletePuotationItem:{url:"deletePuotationItem.do"},

	pageProductionPlan:{url:"pageProductionPlan.do"},
	pageProductionPlanItemByPpid:{url:"pageProductionPlanItemByPpid.do"},
	queryProductionPlanByPid:{url:"queryProductionPlanByPid.do"},
	queryProductionPlanByNo:{url:"queryProductionPlanByNo.do"},
	addProductionPlan:{url:"addProductionPlan.do"},
	addProductionPlanItem:{url:"addProductionPlanItem.do"},
	addProductionWorkPlan:{url:"addProductionWorkPlan.do"},
	updateProductionPlan:{url:"updateProductionPlan.do"},
	updateProductionPlanForStatus:{url:"updateProductionPlanForStatus.do"},
	deleteProductionPlanItem:{url:"deleteProductionPlanItem.do"},

	pageHardware :{url:"pageHardware.do"},
	addHardware :{url:"addHardware.do"},
	updateHardware :{url:"updateHardware.do"},
	deleteHardware :{url:"deleteHardware.do"},
	updateHardwareForStatus :{url:"updateHardwareForStatus.do"},
	pageHardwareItemByHid :{url:"pageHardwareItemByHid.do"},
	addHardwareItem :{url:"addHardwareItem.do"},
	deleteHardwareItem :{url:"deleteHardwareItem.do"},

	pageOutsource:{url:"pageOutsource.do"},
	pageOutsourceItemByOid:{url:"pageOutsourceItemByOid.do"},
	addOutsource:{url:"addOutsource.do"},
	addOutsourceItem:{url:"addOutsourceItem.do"},
	updateOutsource:{url:"updateOutsource.do"},
	updateOutsourceForStatus:{url:"updateOutsourceForStatus.do"},
	deleteOutsource:{url:"deleteOutsource.do"},
	deleteOutsourceItem:{url:"deleteOutsourceItem.do"},
	deleteProductionWorkPlan :{url:"deleteProductionWorkPlan.do"},

	queryProductionPictureByPid:{url:"queryProductionPictureByPid.do"},
	addProductionPicture:{url:"addProductionPicture.do"},
	deleteProductionPicture:{url:"deleteProductionPicture.do"},

	queryProductionSalesByPid:{url:"queryProductionSalesByPid.do"},
	bindProductionSales:{url:"bindProductionSales.do"},
	queryProductionUserWorkFlowByPwfid:{url:"queryProductionUserWorkFlowByPwfid.do"},
	queryProductionWorkPlanByPpid : {url:"queryProductionWorkPlanByPpid.do"},
	queryProductionWorkFlowByPwpid : {url : "queryProductionWorkFlowByPwpid.do"},
	queryProductionWorkFlowByPwpidAWfid : {url : "queryProductionWorkFlowByPwpidAWfid.do"},
	operateProductionWorkFlow : {url : "operateProductionWorkFlow.do"},
	queryProductionUserWorkFlowsByPwfids:{url:"queryProductionUserWorkFlowsByPwfids.do"},
	
}});