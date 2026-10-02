jQuery(function($) {

    // 我参与的装修单: 后端 pageDecorationForUser(exists 子查询圈定"当前登录人在其服务团队中"的订单, 同人多 type 行天然去重);
    // 服务监理/合约专员等非归属人角色的按人查单视图, 数据源 decoration.decorationUser

    // 页面配置对象: 与 constructionPageUtils.constructionPage.getConfig 同构, 仅本页使用故就地声明;
    // 配置源=decoration.decorationfunctionright(name=页面名) 挂 decorationfunction(key/value/type/subtype/sort);
    // 无配置时各数组为空 = 页面默认全展示
    var decorationPage = {

        getConfig: function (page) {

            var pageConfig = {
                "apiPage": null,
                "pageBtn": [],
                "condArr": [],
                "propertyArr": []
            };

            function packageConfig(o, props, value, subtype) {

                var prop = props.shift();

                if (props.length != 0) {
                    if (!o[prop]) o[prop] = {};
                    packageConfig(o[prop], props, value, subtype);
                    return;
                }

                if (subtype == 0) {
                    o[prop] = value;
                } else if (subtype == 1 && !o[prop]) {
                    o[prop] = [value];
                } else if (subtype == 1 && o[prop]) {
                    o[prop].push(value);
                }
            }

            function getApi(o, props) {

                var prop = props.shift();

                if (props.length == 0) {
                    return o[prop];
                } else if (o[prop]) {
                    return getApi(o[prop], props);
                }
                return "";
            }

            com.post(api.right.queryDecorationFunctionRightByName, { "decorationFunctionRight.name": page }, function (res) {

                var rights = (res.decorationFunctionRights || []).sort(function (a, b) { return a.decorationFunction.sort - b.decorationFunction.sort; });

                $.each(rights, function (i, v) {

                    var data = v.decorationFunction;

                    if (data.type == 1) data.value = getApi({ "api": api }, data.value.split("."));

                    packageConfig(pageConfig, data.key.split("."), data.value, data.subtype);
                });
            }, null, false);

            return pageConfig;
        }
    };

    // 获取页面控制参数(按公司差异化配置, 无配置时所有列/条件/按钮按默认全展示)
    var pageConfig = decorationPage.getConfig("decoration4user");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    // 字段定义映射: key 对应配置 propertyArr 中的 value(后端返回扁平 DecorationVO, 非关联嵌套)
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
        "designer": {
            field: "designer.currentName",
            name: "设计师",
            prop: "designer.currentName",
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.designer.userId);
            }
        },
        "supervisor": {
            field: "supervisor.currentName",
            name: "监理",
            prop: function(v) { return v.supervisor == null ? "" : v.supervisor.currentName; },
            clazz: "grey",
            click: function(btn, v) {
                if (v.supervisor != null) tools.personel.info(btn, v.supervisor.userId);
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
        "status": {
            field: "status",
            name: "状态",
            prop: function(v) { return v.status == null ? "" : constant.decoration().decoration.status.keys[v.status]; },
            clazz: "red"
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
                    tools.decoration.info(btn, v.orderId);
                },
                show: function() {
                    return btnVisible("info");
                }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", pageConfig.apiPage || api.decoration.pageDecorationForUser, {}, pageConfig.condArr.length > 0 ? pageConfig.condArr : ['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-status'], "decoration4userPostData", null, false, null);

    searcher.line("orderId", lineprops, linebtns).render();
});
