jQuery(function($) {

    var decorationAtttype = {

        daid: null,

        status: ["启用", "禁用"],
    };

    var seacher = new Searcher();

    seacher.base("condList", "pagenation", "resultList", api.data.pageDecorationAtttype);

    seacher.history("decorationAtttypePostData");

    var lineprops = [{
        field: "name",
        name: "名称",
        prop: "name",
        clazz: "red",
    }, {
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
        field: "manageDiscount",
        name: "管理费折扣",
        prop: "manageDiscount",
        clazz: "red",
        formatter: function(value) {
            // 0=不打折, 1=打折
            return value == 0 ? '<span class="label label-default">不打折</span>' : '<span class="label label-success">打折</span>';
        }
    }, {
        field: "taxDiscount",
        name: "税金折扣",
        prop: "taxDiscount",
        clazz: "red",
        formatter: function(value) {
            // 0=不打折, 1=打折
            return value == 0 ? '<span class="label label-default">不打折</span>' : '<span class="label label-success">打折</span>';
        }
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
