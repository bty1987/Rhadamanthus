jQuery(function($) {

    var decorationBelong = {
        decorationType: {},

        decorationOrderStatus: {}
    };

    decorationBelong.decorationOrderStatus = constant.decoration().decoration.status.keys;
    decorationBelong.decorationType = constant.decoration().decoration.typeness.keys;

    function getBelongPropertyArr(v) {

        return [["楼盘地址:", v.house.village.name + " " + v.house.houseNumber, "grey"], ["客户名:", v.customer.name, "grey"], ["设计部:", v.designer.dept.name, "grey"], ["设计师:", v.designer.currentName, "grey"], ["业务部:", v.salesman.dept.name, "grey"], ["业务员:", v.salesman.currentName, "grey"], ["面积:", v.house.buildArea, "blue"], ["合同报价:", v.orderTotalPrice, "blue"], ["量房时间:", v.measureTime, "green"], ["类型:", decorationBelong.decorationType[v.type], "red"], ["状态:", decorationBelong.decorationOrderStatus[v.status], "red"]];
    }

    function buildBelongLineprops() {

        return [{
            field: "belongInfo",
            name: "归属信息",
            type: "custom",
            prop: function(v) {
                return decorationUtils.propertyText(getBelongPropertyArr(v));
            },
            render: function($liLine, v, $ulProperty) {
                decorationUtils.drawProperties($ulProperty, getBelongPropertyArr(v));
            }
        }];
    }

    function buildBelongLinebtns() {

        return {
            look: {name: "查看", clazz: "btn-success", handle: function(v) { viewDecorationBelongDetail(v.orderId); }},
            design: {name: "设计", clazz: "btn-yellow", handle: function(v) { changeDecorationBelongDesigner(v.orderId); }},
            salesman: {name: "业务", clazz: "btn-primary", handle: function(v) { changeDecorationBelongBussiness(v.orderId); }}
        };
    }

    var _condArr = ['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-houseArea', 'decoration-designer', 'decoration-salesman', 'decoration-type', 'decoration-salesType'];

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.decoration.pageDecorationForBelong, null, _condArr, "decorationBelongPostData");
    searcher.line(function(v) {
        return ' ' + v.orderId;
    }, buildBelongLineprops(), buildBelongLinebtns()).render();

    function viewDecorationBelongDetail(orderId) {

        params.decoration.orderId = orderId;

        // com.switchPage(api.index.decorationBelongInfoIndex.url);
        com.popup4page("#layerPopUp", api.index.decorationBelongInfoIndex.url, "装修单归属: " + orderId);
    }

    function changeDecorationBelongDesigner(orderId) {

        params.decoration.orderId = orderId;
        params.decoration.orderBelongType = 0;

        // com.switchPage(api.index.decorationBelongDetailIndex.url);
        com.popup4page("#layerPopUp", api.index.decorationBelongDetailIndex.url, "装修单设计归属: " + orderId);
    }

    function changeDecorationBelongBussiness(orderId) {

        params.decoration.orderId = orderId;
        params.decoration.orderBelongType = 1;

        // com.switchPage(api.index.decorationBelongDetailIndex.url);
        com.popup4page("#layerPopUp", api.index.decorationBelongDetailIndex.url, "装修单业务归属: " + orderId);
    }

});
