jQuery(function ($) {

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = constructionPage.getConfig("acceptance");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    // 字段定义映射: key 对应配置 propertyArr 中的 value
    var propertyMap = {
        "orderId": {
            field: "orderId",
            name: "装修单",
            prop: "orderId",
            clazz: "blue",
            click: function(btn, v) {
                tools.decoration.info(btn, v.orderId);
            }
        },
        "village": {
            field: "house.village.name",
            name: "楼盘",
            prop: "house.village.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.house.info(btn, v.house.hid);
            }
        },
        "houseNumber": {
            field: "house.houseNumber",
            name: "楼号",
            prop: "house.houseNumber",
            clazz: "grey"
        },
        "customer": {
            field: "customer.name",
            name: "客户",
            prop: "customer.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.customer.info(btn, v.customer.cid);
            }
        },
        "designerDept": {
            field: "designer.dept.name",
            name: "设计部门",
            prop: "designer.dept.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.department.info(btn, v.designer.dept.did);
            }
        },
        "designer": {
            field: "designer.userName",
            name: "设计师",
            prop: "designer.userName",
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.designer.userId);
            }
        },
        "supervisor": {
            field: "supervisor.userName",
            name: "监理",
            prop: function(v) { return v.supervisor ? v.supervisor.userName : ""; },
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.supervisor.userId);
            }
        },
        "buildArea": {
            field: "house.buildArea",
            name: "面积",
            prop: "house.buildArea",
            clazz: "blue"
        },
        "orderTotalPrice": {
            field: "orderTotalPrice",
            name: "合同额",
            prop: "orderTotalPrice",
            clazz: "blue"
        },
        "version": {
            field: "version.name",
            name: "报价版本",
            prop: "version.name",
            clazz: "grey"
        },
        "projectStatus": {
            field: "projectStatus",
            name: "进度",
            prop: function(v) { return constant.decoration().decoration.projectStatus.keys[v.projectStatus]; },
            clazz: "red"
        }
    };

    // 根据配置 propertyArr 组装列定义, 配置为空则使用全部默认列
    var lineprops = (function() {

        if (pageConfig.propertyArr.length == 0) {

            var all = [];
            $.each(propertyMap, function (key, prop) { all.push(prop); });
            return all;
        }

        var props = [];
        $.each(pageConfig.propertyArr, function (i, key) {

            if (propertyMap[key]) props.push(propertyMap[key]);
        });
        return props;
    })();

    var linebtns = (function() {

        return {
            view: {
                name: "验收",
                clazz: "btn-yellow",
                handle: function(v) {
                    viewAcceptanceDetailIndex(v.orderId);
                },
                show: function() {
                    return btnVisible("view");
                }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", pageConfig.apiPage || api.construction.pageConstructionForAcceptance, null, pageConfig.condArr.length > 0 ? pageConfig.condArr : ['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-designer', 'construction-supervisor', 'decoration-projectStatus', 'construction-acceptanceFlag'], "acceptanceSeacherSeacherPostData", null, false, null);
    searcher.line("orderId", lineprops, linebtns).render();

    function viewAcceptanceDetailIndex(orderId) {
        params.construction.orderId = orderId;
        com.popup4page("#stockRecordPopUp","/views/construction/acceptance4detail.html","查看");
    }

});
