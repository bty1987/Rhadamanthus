jQuery(function($) {

    var department = {

    };

    var searcher = new Searcher();

    searcher.base("conditionDeptCondList", "conditionDeptPagenation", "conditionDeptResultList", api.communion.pageDepartment);

    searcher.condition(['personel-dept-name']);

    searcher.param(params.condition.rdata);

    var lineprops = [{
        field: "no",
        name: "编号",
        prop: "no",
        clazz: "blue"
    }, {
        field: "userName",
        name: "所属分区",
        prop: "userName",
        clazz: "grey"
    }, {
        field: "fatherDept.name",
        name: "分区",
        prop: "dept.fatherDept.name",
        clazz: "grey"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        dataset: constant.personel().dept.status.keys,
        clazz: "red"
    }, {
        field: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey"
    }, ];

    var linebtns = [{
        name: "选择",
        clazz: "btn-warning",
        handle: function(v) {

            if (params.condition.item) {
                params.condition.item.attr("data-typeahead-key", v[params.condition.rkey]);
                params.condition.item.val(v[params.condition.rvalue]);
            }

            com.closePopup();

            return false;
        },
    }, ];

    searcher.line("name", lineprops, linebtns).render();

});