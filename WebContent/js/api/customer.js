
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
	
	pageVrecord: {url: "pageVrecord.do"},
	queryVrecordByVid: {url: "queryVrecordByVid.do"},
	addVrecord: {url: "addVrecord.do"},

}});