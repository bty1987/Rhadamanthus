
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

$.extend(api,{production:{
	pageQuoteItem :{url:"pageQuoteItem.do", server: "production"},
	queryQuoteItemByPinyin : {url:"queryQuoteItemByPinyin.do", server: "production"},
	addQuoteItem : {url:"addQuoteItem.do", server: "production"},
	updateQuoteItem : {url :"updateQuoteItem.do", server: "production"},
	updateQuoteItemForStatus : {url:"updateQuoteItemForStatus.do", server: "production"},
    
    pageQuoteType:{url:"pageQuoteType.do", server: "production"},
	queryQuoteType:{url:"queryQuoteType.do", server: "production"},
	addQuoteType:{url:"addQuoteType.do", server: "production"},
	updateQuoteType:{url:"updateQuoteType.do", server: "production"},
	updateQuoteTypeForStatus:{url:"updateQuoteTypeForStatus.do", server: "production"},

	pageWorkplan :{url:"pageWorkplan.do", server: "production"},
	queryWorkplan :{url:"queryWorkplan.do", server: "production"},
	queryWorkplanByWsid :{url:"queryWorkplanByWsid.do", server: "production"},
	addWorkplan :{url:"addWorkplan.do", server: "production"},
	updateWorkplan :{url:"updateWorkplan.do", server: "production"},
	updateWorkplanForStatus :{url:"updateWorkplanForStatus.do", server: "production"},

	pageWorkshop :{url:"pageWorkshop.do", server: "production"},
	queryWorkshop : {url:"queryWorkshop.do", server: "production"},
	addWorkshop : {url:"addWorkshop.do", server: "production"},
	updateWorkshop : {url :"updateWorkshop.do", server: "production"},
	updateWorkshopForStatus : {url:"updateWorkshopForStatus.do", server: "production"},

	pageWorkflow: {url: "pageWorkflow.do", server: "production"},
	queryWorkflow:{url:"queryWorkflow.do", server: "production"},
	addWorkflow:{url:"addWorkflow.do", server: "production"},
	updateWorkflow: {url: "updateWorkflow.do", server: "production"},
	updateWorkflowForStatus:{url:"updateWorkflowForStatus.do", server: "production"},
	queryWorkflowPlanByWfid:{url:"queryWorkflowPlanByWfid.do", server: "production"},
	queryWorkflowPlanByWpid:{url:"queryWorkflowPlanByWpid.do", server: "production"},
	updateWorkflowPlan:{url:"updateWorkflowPlan.do", server: "production"},

	pageProduction:{url:"pageProduction.do", server: "production"},
	addProduction:{url:"addProduction.do", server: "production"},
	updateProductionForStatus:{url:"updateProductionForStatus.do", server: "production"},
	updateProductionForDeliveryStatus:{url:"updateProductionForDeliveryStatus.do", server: "production"},
	queryProductionByPno:{url:"queryProductionByPno.do", server: "production"},

	addPuotation:{url:"addPuotation.do", server: "production"},
	addPuotationItem:{url:"addPuotationItem.do", server: "production"},
	queryPuotationItemByQid:{url:"queryPuotationItemByQid.do", server: "production"},
	queryPuotationByPid:{url:"queryPuotationByPid.do", server: "production"},
	updatePuotation:{url:"updatePuotation.do", server: "production"},
	updatePuotationForAdvance:{url:"updatePuotationForAdvance.do", server: "production"},
	updatePuotationForDefault:{url:"updatePuotationForDefault.do", server: "production"},
	deletePuotation:{url:"deletePuotation.do", server: "production"},
	deletePuotationItem:{url:"deletePuotationItem.do", server: "production"},

	pageProductionPlan:{url:"pageProductionPlan.do", server: "production"},
	pageProductionPlanItemByPpid:{url:"pageProductionPlanItemByPpid.do", server: "production"},
	queryProductionPlanByPid:{url:"queryProductionPlanByPid.do", server: "production"},
	queryProductionPlanByNo:{url:"queryProductionPlanByNo.do", server: "production"},
	addProductionPlan:{url:"addProductionPlan.do", server: "production"},
	addProductionPlanItem:{url:"addProductionPlanItem.do", server: "production"},
	addProductionWorkPlan:{url:"addProductionWorkPlan.do", server: "production"},
	updateProductionPlan:{url:"updateProductionPlan.do", server: "production"},
	updateProductionPlanForStatus:{url:"updateProductionPlanForStatus.do", server: "production"},
	deleteProductionPlanItem:{url:"deleteProductionPlanItem.do", server: "production"},

	pageHardware :{url:"pageHardware.do", server: "production"},
	addHardware :{url:"addHardware.do", server: "production"},
	updateHardware :{url:"updateHardware.do", server: "production"},
	deleteHardware :{url:"deleteHardware.do", server: "production"},
	updateHardwareForStatus :{url:"updateHardwareForStatus.do", server: "production"},
	pageHardwareItemByHid :{url:"pageHardwareItemByHid.do", server: "production"},
	addHardwareItem :{url:"addHardwareItem.do", server: "production"},
	deleteHardwareItem :{url:"deleteHardwareItem.do", server: "production"},

	pageOutsource:{url:"pageOutsource.do", server: "production"},
	pageOutsourceItemByOid:{url:"pageOutsourceItemByOid.do", server: "production"},
	addOutsource:{url:"addOutsource.do", server: "production"},
	addOutsourceItem:{url:"addOutsourceItem.do", server: "production"},
	updateOutsource:{url:"updateOutsource.do", server: "production"},
	updateOutsourceForStatus:{url:"updateOutsourceForStatus.do", server: "production"},
	deleteOutsource:{url:"deleteOutsource.do", server: "production"},
	deleteOutsourceItem:{url:"deleteOutsourceItem.do", server: "production"},
	deleteProductionWorkPlan :{url:"deleteProductionWorkPlan.do", server: "production"},

	queryProductionPictureByPid:{url:"queryProductionPictureByPid.do", server: "production"},
	addProductionPicture:{url:"addProductionPicture.do", server: "production"},
	deleteProductionPicture:{url:"deleteProductionPicture.do", server: "production"},

	queryProductionSalesByPid:{url:"queryProductionSalesByPid.do", server: "production"},
	bindProductionSales:{url:"bindProductionSales.do", server: "production"},
	queryProductionUserWorkFlowByPwfid:{url:"queryProductionUserWorkFlowByPwfid.do", server: "production"},
	queryProductionWorkPlanByPpid : {url:"queryProductionWorkPlanByPpid.do", server: "production"},
	queryProductionWorkFlowByPwpid : {url : "queryProductionWorkFlowByPwpid.do", server: "production"},
	queryProductionWorkFlowByPwpidAWfid : {url : "queryProductionWorkFlowByPwpidAWfid.do", server: "production"},
	operateProductionWorkFlow : {url : "operateProductionWorkFlow.do", server: "production"},
	
}});