$(function() {

    var customerSourceRecord = {

        csid: params.customer.customerSource.csid,
        pageType: params['urlLoadParams'].type
    };

    var searcher = new Searcher();

    searcher.base("recordCondList", "recordPagenation", "recordResultList", api.customer.pageCustomerSourceRecord);
    searcher.condition();
    searcher.history("customerSourceRecordData" + customerSourceRecord.pageType);

    var param = {
        "customerSourceRecord.csid": customerSourceRecord.csid
    };

    if (customerSourceRecord.pageType == "0") {
        param["customerSourceRecord.type"] = customerSourceRecord.pageType;
    }

    searcher.param(param);

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

    searcher.line("comment", lineprops, []).render();

});