jQuery(function($) {

    var decorationAtttype = {

        daid: null,

        status: ["启用", "禁用"],
    };

    var seacher = new Searcher();

    seacher.base("condList", "pagenation", "resultList", api.data.pageDecorationAtttype);

    seacher.history("decorationAtttypePostData");

    var lineprops = [{
        field: "key",
        name: "键值",
        prop: "key",
        clazz: "red",
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.data().decorationAtttype.type.keys
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: decorationAtttype.status
    }, ];

    var linebtus = [];

    seacher.line("name", lineprops, linebtus).render();

});
