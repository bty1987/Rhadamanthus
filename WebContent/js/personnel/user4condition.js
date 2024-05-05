$(function() {

    var user = {

    };

    var searcher = new Searcher();

    searcher.base("conditionUserCondList", "conditionUserPagenation", "conditionUserResultList", api.personel.pageUser);

    searcher.condition(['personel-userId', 'personel-userName', 'personel-phone']);

    var lineprops = [{
        field: "userId",
        name: "员工编号",
        prop: "userId",
        clazz: "grey"
    }, {
        field: "userName",
        name: "姓名",
        prop: "userName",
        clazz: "grey"
    }, {
        field: "fatherDept.name",
        name: "分区",
        prop: "dept.fatherDept.name",
        clazz: "grey"
    }, {
        field: "dept.name",
        name: "部门",
        prop: "dept.name",
        clazz: "grey"
    }, {
        field: "duty.name",
        name: "职位",
        prop: "duty.name",
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

    searcher.line("currentName", lineprops, linebtns).render();

});