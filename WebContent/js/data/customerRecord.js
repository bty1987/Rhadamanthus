jQuery(function($) {

    var customerRecord = {};

    var searcher = new Searcher();

    searcher.base("customerCondList", "customerPagenation", "customerResultList", api.communion.pageCustomerRecord);

    searcher.param({
        "customerRecord.cid": params.customer.cid
    });

    var lineprops = [{
        fieId: "comment",
        name: "记录信息",
        prop: "comment",
        clazz: "grey"
    }, {
        fieId: "operater.currentName",
        name: "操作人",
        prop: "operater.currentName",
        clazz: "red"
    }, {
        fieId: "operateTime",
        name: "记录时间",
        prop: "operateTime",
        clazz: "grey"
    }, {
        fieId: "operater.userId",
        name: "工号",
        prop: "operater.userId",
        clazz: "grey"
    }, {
        fieId: "operater.duty.name",
        name: "职位",
        prop: "operater.duty.name",
        clazz: "grey"
    }];

    var linebtns = [];

    searcher.line("comment", lineprops, linebtns).render();

});
