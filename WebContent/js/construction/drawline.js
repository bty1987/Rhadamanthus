jQuery(function($) {

    // 放线记录分页浏览页: 后端 pageDrawLine 已有真分页(PagingQuery+company+decoration前缀条件),
    // 区别于 drawline4setup 的 queryDrawLine(不分页, 硬上限99条); 本页不带工作台操作, 仅浏览+查看

    // 获取页面控制参数(按公司差异化配置, 无配置时所有列/条件/按钮按默认全展示)
    var pageConfig = constructionPage.getConfig("drawline");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    // 字段定义映射: key 对应配置 propertyArr 中的 value
    var propertyMap = {
        "orderId": {
            field: "decoration.orderId",
            name: "装修单",
            prop: "decoration.orderId",
            clazz: "blue",
            click: function(btn, v) {
                tools.decoration.info(btn, v.decoration.orderId);
            }
        },
        "village": {
            field: "decoration.house.village.name",
            name: "楼盘",
            prop: "decoration.house.village.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.house.info(btn, v.decoration.house.hid);
            }
        },
        "houseNumber": {
            field: "decoration.house.houseNumber",
            name: "楼号",
            prop: "decoration.house.houseNumber",
            clazz: "grey"
        },
        "customer": {
            field: "decoration.customer.name",
            name: "客户",
            prop: "decoration.customer.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.customer.info(btn, v.decoration.customer.cid);
            }
        },
        "designer": {
            field: "decoration.designer.currentName",
            name: "设计师",
            prop: "decoration.designer.currentName",
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.decoration.designer.userId);
            }
        },
        "supervisor": {
            field: "decoration.supervisor.currentName",
            name: "监理",
            prop: function(v) { return v.decoration.supervisor == null ? "" : v.decoration.supervisor.currentName; },
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.decoration.supervisor.userId);
            }
        },
        "buildArea": {
            field: "decoration.house.buildArea",
            name: "面积",
            prop: "decoration.house.buildArea",
            clazz: "blue"
        },
        "orderTotalPrice": {
            field: "decoration.orderTotalPrice",
            name: "合同额",
            prop: "decoration.orderTotalPrice",
            clazz: "blue"
        },
        "appler": {
            field: "appler.currentName",
            name: "申请人",
            prop: "appler.currentName",
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.appler.userId);
            }
        },
        "applayTime": {
            field: "applayTime",
            name: "申请时间",
            prop: "applayTime",
            clazz: "green"
        },
        "startTime": {
            field: "startTime",
            name: "开始时间",
            prop: function(v) { return v.startTime == null ? "" : v.startTime; },
            clazz: "green"
        },
        "endTime": {
            field: "endTime",
            name: "结束时间",
            prop: function(v) { return v.endTime == null ? "" : v.endTime; },
            clazz: "green"
        },
        "group": {
            field: "group.name",
            name: "放线小组",
            prop: function(v) { return v.group == null ? "" : v.group.name; },
            clazz: "grey"
        },
        "drawer": {
            field: "drawer.currentName",
            name: "放线人",
            prop: function(v) { return v.drawer == null ? "" : v.drawer.currentName; },
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.drawer.userId);
            }
        },
        "count": {
            field: "count",
            name: "放线次数",
            prop: "count",
            clazz: "blue"
        },
        "status": {
            field: "status",
            name: "状态",
            prop: function(v) { return v.status == null ? "" : constant.construction().drawLine.status.keys[v.status]; },
            clazz: "red"
        },
        "content": {
            field: "content",
            name: "描述",
            prop: "content",
            clazz: "grey"
        }
    };

    // 根据配置 propertyArr 组装列定义, 配置为空则使用全部默认列
    var lineprops = (function() {

        if (pageConfig.propertyArr.length == 0) {

            var all = [];
            $.each(propertyMap, function(key, prop) { all.push(prop); });
            return all;
        }

        var props = [];
        $.each(pageConfig.propertyArr, function(i, key) {

            if (propertyMap[key]) props.push(propertyMap[key]);
        });
        return props;
    })();

    var linebtns = (function() {

        return {
            info: {
                name: "信息",
                clazz: "btn-yellow",
                handle: function(v, btn) {
                    tools.decoration.info(btn, v.decoration.orderId);
                },
                show: function() {
                    return btnVisible("info");
                }
            }
        };
    })();

    var searcher = new Searcher();

    // isPage=false 启用标准分页(每页10/30条, 页码跳转), 不固定status, 通过条件自由筛选
    searcher.set("condList", "pagenation", "resultList", pageConfig.apiPage || api.construction.pageDrawLine, {}, pageConfig.condArr.length > 0 ? pageConfig.condArr : ['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'construction-drawLine-status', 'construction-drawLine-applayTime', 'construction-drawLine-actualDate'], "drawlinePostData", null, false, null);

    searcher.line("decoration.orderId", lineprops, linebtns).render();
});
