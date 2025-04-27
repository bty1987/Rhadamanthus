$(function() {

    var quotationRecord = {

        quotation: params.quotation.quotation,

        items: {},

        modals: {},

        btns: {},
    };

    var searcher = new Searcher();

    searcher.base("recordCcondList", "recordPagenation", "recordResultList", api.quotation.pageQuotationRecord);

    searcher.condition(["quotation-quotationRecord-operatTime"]);

    searcher.button([]);

    searcher.param({
        "quotationRecord.type": constant.quotation().quotationRecord.TYPE_QUOTATION_INT,
        "quotationRecord.qid": quotationRecord.quotation.qid
    });

    searcher.history("quotationRecordPostData");

    var linebtns = [];

    var lineprops = [{
        fieId: "operater.currentName",
        name: "记录员",
        prop: "operater.currentName",
        clazz: "grey"
    }, {
        fieId: "type",
        name: "记录类型",
        prop: "type",
        dataset: constant.quotation().quotationRecord.type.keys,
        clazz: "red"
    }, {
        fieId: "operatTime",
        name: "记录时间",
        prop: "operatTime",
        clazz: "green"
    }, {
        fieId: "comment",
        name: "说明",
        prop: "comment",
        clazz: "grey"
    }];

    searcher.line("operater.currentName", lineprops, linebtns).render();

});