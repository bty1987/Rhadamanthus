$(function() {

    var searcher = new Searcher();

    searcher.base("villageConditionCondList", "villageConditionPagenation", "villageConditionResultList", api.data.pageVillage);

    // 扩展查询条件：增加开发商、状态、交付时间、父楼盘
    searcher.condition([
        'data-village-name',           // 楼盘名称（支持拼音）
        'data-village-developer',      // 开发商
        'data-village-status',          // 状态
        'data-village-delivery-start',  // 交付时间起始
        'data-village-delivery-end'    // 交付时间结束
    ]);

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
        field: "developer",
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
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "grey",
        formatter: function(value) {
            // 状态格式化：0=启用, 1=禁用
            return value == 0 ? '<span class="label label-success">启用</span>' : '<span class="label label-default">禁用</span>';
        }
    }, {
        field: "parentVillage",
        name: "上级楼盘",
        prop: "parentVillage.name",
        clazz: "grey"
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