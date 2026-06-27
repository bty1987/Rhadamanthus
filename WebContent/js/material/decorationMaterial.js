jQuery(function($) {

    params.materialUrl = api.material.pageMaterialByUserId;
    var materialOrderPostData = "materialOrderPostData";
    if (params['urlLoadParams'].type == 'advance') {
        materialOrderPostData = "materialOrderPostDataAdvance";
        params.materialUrl = api.material.pageMaterialForAdvance;
    }
    var materialOrder = {
        modal: null,
        materialOrderItems: {},

        msoId: null,
        saleType: null,

        editFlag: false
    };

    com.focusPage('#fl-statement').statement("主材订单", "订单信息列表");

    function buildDecorationMaterialLineprops() {

        return [{
            field: "house.village",
            name: "楼盘地址",
            prop: function(v) { return v.house.village.name + " " + v.house.houseNumber; },
            clazz: "grey"
        }, {
            field: "customer.name",
            name: "客户名",
            prop: "customer.name",
            clazz: "grey"
        }, {
            field: "designer.dept.name",
            name: "设计部",
            prop: "designer.dept.name",
            clazz: "grey"
        }, {
            field: "designer.currentName",
            name: "设计师",
            prop: "designer.currentName",
            clazz: "grey"
        }, {
            field: "supervisor.currentName",
            name: "监理",
            prop: "supervisor.currentName",
            clazz: "grey"
        }, {
            field: "salesman.currentName",
            name: "业务员",
            prop: "salesman.currentName",
            clazz: "grey"
        }, {
            field: "house.buildArea",
            name: "面积",
            prop: "house.buildArea",
            clazz: "blue"
        }];
    }

    function buildDecorationMaterialLinebtns() {

        return {
            sub: {
                name: "子订单",
                clazz: "btn-yellow",
                handle: function(v) {
                    viewMaterialIndex(v);
                }
            }
        };
    }

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.decoration.pageDecorationForGeneral, null, ["decoration-orderId", "decoration-village", "decoration-houseNumber", "decoration-designer", "decoration-salesman"], materialOrderPostData, null, true, null);
    searcher.line("orderId", buildDecorationMaterialLineprops(), buildDecorationMaterialLinebtns()).render();

    function viewMaterialIndex(v) {

        params.orderId = v.orderId;
        params.customerId = v.customer.cid;
        params.customerName = v.customer.name;
        params.orderAddr = v.house.village.name + " " + v.house.houseNumber;
        params.designerId = v.designer.userId;
        params.designerName = v.designer.currentName;

        com.switchPage(api.index.materialIndex.url);
    }

    function viewMaterialSaleOrderIndex(v) {

        params.orderId = v.orderId;
        params.customerId = v.customer.cid;
        params.customerName = v.customer.name;
        params.orderAddr = v.house.village.name + " " + v.house.houseNumber;
        params.designerId = v.designer.userId;
        params.designerName = v.designer.currentName;
        params.hid = v.house.hid;

        params.saleType = "sale";

        params.historyOrderPage = api.index.decorationMaterialIndex.url;

        com.switchPage(api.index.materialSaleIndex.url);
    }

});
