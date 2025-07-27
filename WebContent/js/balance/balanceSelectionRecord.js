jQuery(function($) {

    var balanceSelectionRecord = {

        btns: {

        },
        modals: {

        },

        items: {

        },
    };

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.balance.queryBalanceSelectionRecord);
    searcher.param({
        "balanceSelectionRecord.balanceSelection.bsid": params.balance.bsid
    });
    searcher.result("balanceSelectionRecords").isPage(true);

    searcher.button([])

    var lineprops = [{
        field: "operater.userName",
        name: "操作人",
        prop: "operater.userName",
        clazz: "grey",
    }, {
        field: "operateTime",
        name: "操作时间",
        prop: "operateTime",
        clazz: "green",
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.balance().balanceSelection.status.keys
    }, {
        field: "comment",
        name: "说明",
        prop: "comment",
        clazz: "red",
    }];

    var linebtns = [];

    searcher.line("balanceSales.name", lineprops, linebtns).render();
});