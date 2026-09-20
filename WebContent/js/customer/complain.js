jQuery(function($) {

    var complain = {

        cid: null,
        editFlg: false
    };

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = customerPage.getConfig("complain");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    var lineprops = (function() {

        var propertyMap = {
            "creater": {
                field: "creater.currentName",
                name: "创建人",
                prop: "creater.currentName",
                clazz: "grey"
            },
            "updater": {
                field: "updater.currentName",
                name: "操作人",
                prop: "updater.currentName",
                clazz: "grey"
            },
            "createTime": {
                field: "createTime",
                name: "创建时间",
                prop: "createTime",
                clazz: "green"
            },
            "updateTime": {
                field: "updateTime",
                name: "操作时间",
                prop: "updateTime",
                clazz: "green"
            },
            "finishTime": {
                field: "finishTime",
                name: "完成时间",
                prop: "finishTime",
                clazz: "green"
            },
            "level": {
                field: "level",
                name: "等级",
                prop: function(v) { return constant.customer().complain.complainType.keys[v.level]; },
                clazz: "red"
            },
            "status": {
                field: "status",
                name: "状态",
                prop: function(v) { return constant.customer().complain.status.keys[v.status]; },
                clazz: "red"
            },
            "gladness": {
                field: "gladness",
                name: "满意度",
                prop: function(v) { return constant.customer().complain.complainStatus.keys[v.gladness]; },
                clazz: "red"
            }
        };

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
            complaint: {
                name: "投诉内容",
                clazz: "btn-yellow",
                handle: function(v) {

                    params.customer.aid = v.cid;
                    com.popup4page("#stockRecordPopUp", api.index.complaint.url, "投诉内容");
                },
                show: function() { return btnVisible("complaint"); }
            },
            finish: {
                name: "完结",
                clazz: "btn-success",
                show: function(v) { return btnVisible("finish") && (v.status == constant.customer().complain.STATUS_DISPOSE_SHORT); },
                handle: function(v) {

                    com.post(api.customer.finishComplain, {"complain.cid": v.cid}, function (res) {
                        com.showAlert(com.info, "操作成功");
                        searcher.doSearch();
                    });
                }
            },
            close: {
                name: "关闭",
                clazz: "btn-warning",
                show: function(v) { return btnVisible("close") && (v.status == constant.customer().complain.STATUS_END_SHORT); },
                handle: function(v) {

                    com.post(api.customer.closeComplain, {"complain.cid": v.cid}, function (res) {
                        com.showAlert(com.info, "操作成功");
                        searcher.doSearch();
                    });
                }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", pageConfig.apiPage || api.customer.pageComplain, null, pageConfig.condArr.length > 0 ? pageConfig.condArr : ["customer-service-orderId", "customer-service-creater-name", "customer-service-updater-name", "customer-service-complain-status", "customer-service-complain-level"], "complainPostData", null, false, null);
    searcher.line("decoration.orderId", lineprops, linebtns).render();

})