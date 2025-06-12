jQuery(function($) {

    var searcher = new Searcher();

    searcher.base("referCondLists", "referPagenations", "referResultLists", api.decoration.queryDecorationForReferByOrderId);
    searcher.isPage(true).result("decorations");
    searcher.param({
        "decoration.orderId": params.decoration.orderId
    });
    
    var lineprops = [{
        field: "orderId",
        name: "装修单号",
        prop: "orderId",
        clazz: "blue"
    }, {
        field: "customerName",
        name: "客户名",
        prop: "customer.name",
        clazz: "green"
    }, {
        field: "address",
        name: "楼盘地址",
        prop: function(v) {

            return (v.house.village.cityProper.city.name == null ? " " : v.house.village.cityProper.city.name) + " " + (v.house.village.cityProper == null ? " " : v.house.village.cityProper.name) + " " + v.house.village.name + " " + (v.house.houseNumber == null ? " " : v.house.houseNumber);
        },
        clazz: "grey"
    }, {
        field: "designDept",
        name: "设计部",
        prop: "designer.dept.name",
        clazz: "grey"
    }, {
        field: "designer",
        name: "设计师",
        prop: "designer.currentName",
        clazz: "grey"
    }, {
        field: "salesDept",
        name: "业务部",
        prop: "salesman.dept.name",
        clazz: "grey"
    }, {
        field: "salesman",
        name: "业务员",
        prop: "salesman.currentName",
        clazz: "grey"
    }, {
        field: "innerArea",
        name: "面积",
        prop: "innerArea",
        clazz: "blue"
    }, {
        field: "discount",
        name: "折扣",
        prop: function(v) {

            return com.checkNull(v.discount, 10);
        },
        clazz: "blue"
    }, {
        field: "precontractPrice",
        name: "预签额",
        prop: "precontractPrice",
        clazz: "blue"
    }, {
        field: "orderTotalPrice",
        name: "签单额",
        prop: "orderTotalPrice",
        clazz: "blue"
    }, {
        field: "quotationPrice",
        name: "报价额",
        prop: "quotationPrice",
        clazz: "blue"
    }, {
        field: "couponCut",
        name: "券优惠",
        prop: "couponCut",
        clazz: "blue"
    }, {
        field: "factPrice",
        name: "实收额",
        prop: "factPrice",
        clazz: "blue"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "measureTime",
        name: "量房时间",
        prop: "measureTime",
        clazz: "green"
    }, {
        field: "depositTime",
        name: "定金时间",
        prop: "depositTime",
        clazz: "green"
    }, {
        field: "precontractTime",
        name: "预签时间",
        prop: "precontractTime",
        clazz: "green"
    }, {
        field: "contractTime",
        name: "签单时间",
        prop: "contractTime",
        clazz: "green"
    }, {
        field: "contractTime",
        name: "签单时间",
        prop: "contractTime",
        clazz: "green"
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        dataset: constant.decoration().decoration.status.keys,
        clazz: "red"
    }];
    
    searcher.line("orderId", lineprops, []).render();

});
