$(function() {

	var customerSourceRecord = {
		items: {

		}
	};

	var searcher = new Searcher();

	searcher.base("recordCondList", "recordPagenation", "recordResultList", api.customer.pageCustomerSourceRecord);
	searcher.condition();

	searcher.param({
		"customerSourceRecord.csid": params.customer.csid
	});

	searcher.history("customerSourceRecordData");

	var lineprops = [{
		fieId: "userName",
		name: "操作人",
		prop: "operater.userName",
		clazz: "grey"
	},{
		fieId: "operatTime",
		name: "记录时间",
		prop: "operatTime",
		clazz: "green"
	}];

	searcher.line("userName", lineprops, []).render();

});