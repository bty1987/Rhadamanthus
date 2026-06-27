jQuery(function($) {

    var lineprops = constructionUtils.makeDecorationLineProps().concat([{
        field: "orderTotalPrice",
        name: "总价",
        prop: "orderTotalPrice",
        clazz: "blue"
    }, {
        field: "house.buildArea",
        name: "面积",
        prop: "house.buildArea",
        clazz: "blue"
    }, {
        field: "orderTotalPrice",
        name: "合同额",
        prop: "orderTotalPrice",
        clazz: "blue"
    }, {
        field: "version.name",
        name: "报价版本",
        prop: "version.name",
        clazz: "grey"
    }, {
        field: "projectStatus",
        name: "进度",
        prop: function(v) { return constant.decoration().decoration.projectStatus.keys[v.projectStatus]; },
        clazz: "red"
    }]);

    var linebtns = (function() {

        return {
            view: {
                name: "施工节点",
                clazz: "btn-yellow",
                handle: function(v) {
                    viewCustomerServiceDetailIndex(v.orderId);
                }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("customerServiceCondList", "customerServicePagenation", "customerServiceResultList", api.construction.pageConstruction, null, ['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-designer', 'decoration-projectStatus'], "customerServiceSeacherPostData", null, false, null);
    searcher.line("orderId", lineprops, linebtns).render();

    function viewCustomerServiceDetailIndex(orderId) {

        params.construction.orderId = orderId;

        com.popup4page("#stockRecordPopUp", "/views/construction/customer4detail.html", "查看");
    }

    function viewCustomerServiceComplaintIndex(orderId, customerName) {

        params.construction.orderId = orderId;
        params.construction.customerName = customerName;

        com.popup4page("#stockRecordPopUp", "/views/construction/customer4complaint.html", "投诉");
    }

    function viewCustomerServiceGuaranteeIndex(orderId, customerName) {

        params.construction.orderId = orderId;
        params.construction.customerName = customerName;

        com.popup4page("#stockRecordPopUp", "/views/construction/customer4guarantee.html", "保修");
    }

    function viewCustomerServiceBackVisitIndex(orderId, orderAddr, customerName) {

        params.construction.orderId = orderId;
        params.construction.orderAddr = orderAddr;
        params.construction.customerName = customerName;

        com.popup4page("#stockRecordPopUp", "/views/construction/customer4feedback.html", "回访");
    }

});
