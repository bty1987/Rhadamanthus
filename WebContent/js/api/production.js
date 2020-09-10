
$.extend(api.index, {

	productionIndex : {
		url : "views/production/production.html"
	},
	productionPictureIndex : {
		url : "views/production/productionPicture.html"
	},
	productionSalesIndex : {
		url : "views/production/production2bind.html"
	},
	puotationIndex : {
		url : "views/production/puotation.html"
	},
	createPutationIndex : {
		url : "views/production/puotation2create.html"
	},
	addPuotationItemIndex : {
		url : "views/production/puotationItem2add.html"
	},
	puotationItemIndex : {
		url : "views/production/puotationItem.html"
	},
	outsourceIndex : {
		url : "views/production/outsource.html"
	},
	pageOutsourceIndex : {
		url : "views/production/outsource4view.html"
	},
	outsourceItemIndex : {
		url : "views/production/outsourceItem.html"
	},
	hardwareIndex : {
		url : "views/production/hardware.html"
	},
	hardwareCreateIndex : {
		url : "views/production/hardware2create.html"
	},
	hardwareItemIndex : {
		url : "views/production/hardwareItem.html"
	},
	productionPlanIndex : {
		url : "views/production/productionPlan.html"
	},
	productionPlanCreateIndex : {
		url : "views/production/productionPlan2create.html"
	},
	productionPlanItemIndex : {
		url : "views/production/productionPlanItem.html"
	},
	productionPlanDetailIndex : {
		url : "views/production/productionPlan4detail.html"
	},

});

$.extend(api.ds, {

});
$.extend(api,{production:{
	pageQuoteItem :{url:"pageQuoteItem.do",
		type: "query",
		tranargs: [{
			result:"paging-data",
			args:["unitprice"]
		}]},
	queryQuoteItemByPinyin : {url:"queryQuoteItemByPinyin.do",
		type: "query",
		tranargs: [{
			result:"quoteItems",
			args:["unitprice"]
		}]},
	addQuoteItem : {
		url:"addQuoteItem.do",
		type:"update",
		tranargs:{
			args: ["quoteItem.unitprice"]
		}},
	updateQuoteItem : {url :"updateQuoteItem.do",
		type:"update",
		tranargs:{
			args: ["quoteItem.unitprice"]
		}},
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

	pageProduction:{url:"pageProduction.do",
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["total","timeLimit"]
		}]
	},
	addProduction:{url:"addProduction.do",
		type: "update",
		tranargs: {
			args: ["production.total","production.timeLimit"]
		}
	},
	upholdProduction:{url:"upholdProduction.do",
		type: "update",
		tranargs: {
			args: ["production.total","production.timeLimit"]
		}
	},
	queryProductionByPno:{url:"queryProductionByPno.do"},

	addPuotation:{url:"addPuotation.do",
		type: "update",
		tranargs: {
			args: ["puotationItems.height", "puotationItems.num", "puotationItems.thick",
				"puotationItems.total", "puotationItems.unitPrice", "puotationItems.width",
				"puotation.discount","puotation.total"]
		}},
	addPuotationItem:{url:"addPuotationItem.do",
		type: "update",
		tranargs: {
			args: ["puotationItem.height", "puotationItem.num", "puotationItem.thick",
				"puotationItem.total", "puotationItem.unitPrice", "puotationItem.width"]
		}},
	queryPuotationItemByQid:{url:"queryPuotationItemByQid.do",
		type: "query",
		tranargs: [{
			result:"puotationItems",
			args:["height","num","thick","total","unitPrice","width"]
		}]},
	queryPuotationByPid:{url:"queryPuotationByPid.do",
		type: "query",
		tranargs: [{
			result:"puotations",
			args:["discount","total"]
		}]},
	updatePuotation:{url:"updatePuotation.do"},
	updatePuotationForAdvance:{url:"updatePuotationForAdvance.do",
		type: "update",
		tranargs: {
			args: ["puotation.discount", "puotation.total"]
		}},
	tranProduction:{url:"tranProduction.do"},
	updatePuotationForDefault:{url:"updatePuotationForDefault.do"},
	deletePuotation:{url:"deletePuotation.do"},
	deletePuotationItem:{url:"deletePuotationItem.do"},

	pageProductionPlan:{url:"pageProductionPlan.do",
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["timeLimit"]
		}]
	},
	pageProductionPlanItemByPpid:{url:"pageProductionPlanItemByPpid.do",
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["height","width","thick","unitprice","num","total"]
		}]
	},
	queryProductionPlanByPid:{url:"queryProductionPlanByPid.do",
		type: "query",
		tranargs: [{
			result: "productionPlans",
			args: ["timeLimit"]
		}]
	},
	queryProductionPlanByNo:{url:"queryProductionPlanByNo.do"},
	addProductionPlan:{url:"addProductionPlan.do",
		type: "update",
		tranargs: {
			args: [
				"productionPlan.timeLimit"
			]
		}
	},
	addProductionPlanItem:{url:"addProductionPlanItem.do",
		type: "update",
		tranargs: {
			args: [
				"productionPlanItem.height","productionPlanItem.width",
				"productionPlanItem.thick", "productionPlanItem.unitprice",
				"productionPlanItem.num","productionPlanItem.total"
			]
		}
	},
	addProductionWorkPlan:{url:"addProductionWorkPlan.do"},
	updateProductionPlan:{url:"updateProductionPlan.do"},
	updateProductionPlanForStatus:{url:"updateProductionPlanForStatus.do"},
	deleteProductionPlanItem:{url:"deleteProductionPlanItem.do"},

	pageHardware :{url:"pageHardware.do",
		type: "query",
		tranargs: [{
			result:"paging-data",
			args:["timeLimit"]
		}]},
	queryHardwareByPid :{url:"queryHardwareByPid.do",
		type: "query",
		tranargs: [{
			result:"hardwares",
			args:["timeLimit"]
		}]},
	addHardware :{url:"addHardware.do",
		type:"update",
		tranargs:{
			args: ["hardware.timeLimit"]
		}},
	updateHardware :{url:"updateHardware.do"},
	instoreHardware:{url:"instoreHardware.do"},
	finishHardware:{url:"finishHardware.do"},
	deleteHardware :{url:"deleteHardware.do"},
	pageHardwareItemByHid :{url:"pageHardwareItemByHid.do",
		type: "query",
		tranargs: [{
			result:"paging-data",
			args:["num","total","unitprice"]
		}]},
	addHardwareItem :{url:"addHardwareItem.do",
		type:"update",
		tranargs:{
			args: ["hardwareItems.num","hardwareItems.total","hardwareItems.unitprice"]
		}},
	deleteHardwareItem :{url:"deleteHardwareItem.do"},

	pageOutsource:{url:"pageOutsource.do",
		type: "query",
		tranargs: [{
			result:"paging-data",
			args:["timeLimit"]
		}]},
	pageOutsourceItemByOid:{url:"pageOutsourceItemByOid.do",
		type:"query",
		tranargs:[{
			result:"paging-data",
			args: ["width","height","thick","unitprice","num","total"]
		}]},
	addOutsource:{url:"addOutsource.do",
		type:"update",
		tranargs:{
			args: ["outsource.timeLimit"]
		}},
	addOutsourceItem:{
		url:"addOutsourceItem.do",
		type:"update",
		tranargs:{
			args: ["outsourceItems.width","outsourceItems.height","outsourceItems.thick",
				"outsourceItems.unitprice","outsourceItems.num","outsourceItems.total"]
		}},
	queryOutsourceByPid:{url:"queryOutsourceByPid.do",
		type: "query",
		tranargs: [{
			result:"outsources",
			args:["timeLimit"]
		}]},
	pageOutsourceForSupplier:{url:"pageOutsourceForSupplier.do",
		type: "query",
		tranargs: [{
			result:"paging-data",
			args:["timeLimit"]
		}]},
	updateOutsource:{url:"updateOutsource.do",
		type:"update",
		tranargs:{
			args: ["outsource.timeLimit"]
		}},
	receiptOutsource:{url:"receiptOutsource.do"},
	confirmOutsource:{url:"confirmOutsource.do"},
	finishOutsource:{url:"finishOutsource.do"},
	deleteOutsource:{url:"deleteOutsource.do"},
	deleteOutsourceItem:{url:"deleteOutsourceItem.do"},
	deleteProductionWorkPlan :{url:"deleteProductionWorkPlan.do"},

	pageTranpack:{url:"pageTranpack.do"},
	queryTranpackByPid:{url:"queryTranpackByPid.do"},
	packTranpackForOutsource:{url:"packTranpackForOutsource.do"},
	packTranpackForHardware:{url:"packTranpackForHardware.do"},
	packTranpackForPlan:{url:"packTranpackForPlan.do"},
	instoreTranpack:{url:"instoreTranpack.do"},
	planTranPack:{url:"planTranPack.do"},
	tranTranpack:{url:"tranTranpack.do"},
	mountTranpack:{url:"mountTranpack.do"},
	completeTranpack:{url:"completeTranpack.do"},
	lossTranpack:{url:"lossTranpack.do"},
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
	queryProductionUserWorkFlowsByPwfid:{url:"queryProductionUserWorkFlowsByPwfid.do"},
	updateProduction: {url: "updateProduction.do"},
	updateProductionForAdvance: {url: "updateProductionForAdvance.do",
		type: "update",
		tranargs: {
			args: ["production.timeLimit"]
		}
	},
	designProduction: {url: "designProduction.do"},
	splitProduction: {url: "splitProduction.do"},
	instoreProduction: {url: "instoreProduction.do"},
	planProduction: {url: "planProduction.do"},
	mountProduction: {url: "mountProduction.do"},
	finishProduction: {url: "finishProduction.do"},
	terminalProduction: {url: "terminalProduction.do"},
	finishProductionPlan: {url: "finishProductionPlan.do"},
	finishProductionWorkPlan: {url: "finishProductionWorkPlan.do"},
	queryProductionFunction: {url: "queryProductionFunction.do"},
    queryProductionFunctionByName: {url: "queryProductionFunctionByName.do"},
}});