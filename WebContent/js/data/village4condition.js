$(function() {

    var searcher = new Searcher();

    searcher.base("villageConditionCondList", "villageConditionPagenation", "villageConditionResultList", api.data.pageVillage);

    searcher.condition(['data-village-name']);

    var lineprops = [{
        field: "no",
        name: "楼盘编号",
        prop: "no",
        clazz: "grey"
    }, {
        field: "city",
        name: "所在城市",
        prop: "cityProper.city.name",
        clazz: "grey"
    }, {
        field: "cityProper",
        name: "所在城区",
        prop: "cityProper.name",
        clazz: "grey"
    }, {
        field: "developer ",
        name: "开发商",
        prop: "developer",
        clazz: "grey"
    }, {
        field: "salesPhone",
        name: "售楼电话",
        prop: "salesPhone",
        clazz: "grey"
    }, {
        field: "deliveryTime",
        name: "交房时间",
        prop: "deliveryTime",
        clazz: "green"
    }, {
        field: "rule",
        name: "说明",
        prop: "rule",
        clazz: "grey"
    }];

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
        }
    }];

    searcher.line("name", lineprops, linebtns).render();

});