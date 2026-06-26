jQuery(function($) {

    function buildCustomerLineprops() {

        return [{
            field: "orderId",
            name: "装修单",
            prop: "orderId",
            clazz: "blue",
            click: function(btn, v) {
                tools.decoration.info(btn, v.orderId);
            }
        }, {
            field: "house.village.name",
            name: "楼盘",
            prop: "house.village.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.house.info(btn, v.house.hid);
            }
        }, {
            field: "house.houseNumber",
            name: "楼号",
            prop: "house.houseNumber",
            clazz: "grey"
        }, {
            field: "customer.name",
            name: "客户",
            prop: "customer.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.customer.info(btn, v.customer.cid);
            }
        }, {
            field: "designer.dept.name",
            name: "设计部门",
            prop: "designer.dept.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.department.info(btn, v.designer.dept.did);
            }
        }, {
            field: "designer.userName",
            name: "设计师",
            prop: "designer.userName",
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.designer.userId);
            }
        }, {
            field: "supervisor.userName",
            name: "监理",
            prop: function(v) { return v.supervisor ? v.supervisor.userName : ""; },
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.supervisor.userId);
            }
        }, {
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
        }];
    }

    function buildCustomerLinebtns() {

        return {
            view: {
                name: "施工节点",
                clazz: "btn-yellow",
                handle: function(v) {
                    viewCustomerServiceDetailIndex(v.orderId);
                }
            }
        };
    }

    var searcher = new Searcher();

    searcher.set("customerServiceCondList", "customerServicePagenation", "customerServiceResultList", api.construction.pageConstruction, null, ['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-designer', 'decoration-projectStatus'], "customerServiceSeacherPostData", null, false, null);
    searcher.line("orderId", buildCustomerLineprops(), buildCustomerLinebtns()).render();

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
