$.extend(api.index, {
	vustomer: {url: "/views/customer/vustomer.html"},
	vrecord: {url: "/views/customer/vrecord.html"},
});

$.extend(api, {customer: {
    
	pageVustomer: {url: "pageVustomer.do"},
	
	queryVustomer: {url: "queryVustomer.do"},
	
	queryVustomerByIdent: {url: "queryVustomerByIdent.do"},
	
	addVustomer: {url: "addVustomer.do"},
	
	updateVustomer: {url: "updateVustomer.do"},
	
	deleteVustomer: {url: "deleteVustomer.do"},
	
	pageVrecord: {url: "pageVrecord.do"},
	
	queryVrecordByVid: {url: "queryVrecordByVid.do"},
	
	addVrecord: {url: "addVrecord.do"},
	
	pageCustomerOrigin:{url:"pageCustomerOrigin.do"},
    
	pageCustomerOriginForAdvance:{url:"pageCustomerOriginForAdvance.do"},
    
	pageCustomerOriginForCommunion:{url:"pageCustomerOriginForCommunion.do"},

	addCustomerOrigin:{url:"addCustomerOrigin.do"},
    
	updateCustomerOrigin:{url:"updateCustomerOrigin.do"},
    
	updateCustomerOriginForBelonger:{url:"updateCustomerOriginForBelonger.do"},
    
	freeCustomerOrigin:{url:"freeCustomerOrigin.do"},
    
	takeCustomerOrigin:{url:"takeCustomerOrigin.do"},
    
    queryCustomerRecord:{url:"queryCustomerRecord.do"},
    
    addCustomerRecord:{url:"addCustomerRecord.do"}
    
}});


