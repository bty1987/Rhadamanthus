jQuery(function($) {

    // 变更记录查询条件: 定额单入口传参 qid, 只读时间线
    var query = params.quotation.normChangeRecord || {};

    var typeText = {
        1: "增减项制作",
        2: "增减项删除",
        3: "定材浮动额",
        4: "节点工费浮动",
        5: "下定材增删/重算",
        6: "定额单开关",
        7: "辅材绑定额",
        8: "报价项定额关联"
    };

    var changeTypeText = {
        1: "添加",
        2: "修改",
        3: "删除",
        4: "绑定",
        5: "解绑",
        6: "启用",
        7: "禁用"
    };

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.quotation.pageNormChangeRecord);

    var _param = {};

    if (query.qid) _param["normChangeRecord.qid"] = query.qid;

    searcher.param(_param);

    var lineprops = [{
        "field": "operateTime",
        "name": "时间",
        prop: "operateTime",
        width: 200,
        style: "color: green;"
    }, {
        "field": "type",
        "name": "类型",
        prop: "type",
        dataset: typeText
    }, {
        "field": "changeType",
        "name": "动作",
        prop: "changeType",
        dataset: changeTypeText
    }, {
        "field": "refNo",
        "name": "标识",
        prop: "refNo",
        width: 200
    }, {
        "field": "beforeValue",
        "name": "变更前",
        prop: "beforeValue",
        width: 300
    }, {
        "field": "afterValue",
        "name": "变更后",
        prop: "afterValue",
        width: 300
    }, {
        "field": "operater",
        "name": "操作人",
        prop: "operater"
    }];

    searcher.table(lineprops, {})

    searcher.render();

});
