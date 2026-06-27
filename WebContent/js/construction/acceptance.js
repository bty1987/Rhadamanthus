jQuery(function ($) {

    var lineprops = (function() {

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
    })();

    var linebtns = (function() {

        return {
            view: {
                name: "验收",
                clazz: "btn-yellow",
                handle: function(v) {
                    viewAcceptanceDetailIndex(v.orderId);
                }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.construction.pageConstructionForAcceptance, null, ['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-designer', 'construction-supervisor', 'decoration-projectStatus', 'construction-acceptanceFlag'], "acceptanceSeacherSeacherPostData", null, true, null);
    searcher.line("orderId", lineprops, linebtns).render();

    function viewAcceptanceDetailIndex(orderId) {
        params.construction.orderId = orderId;
        com.popup4page("#stockRecordPopUp","/views/construction/acceptance4detail.html","查看");
    }

});
