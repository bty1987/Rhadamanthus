jQuery(function($) {

    var complain = {

        cid: null,
        editFlg: false
    };

    var lineprops = (function() {

        return [{
            field: "creater.currentName",
            name: "创建人",
            prop: "creater.currentName",
            clazz: "grey"
        }, {
            field: "updater.currentName",
            name: "操作人",
            prop: "updater.currentName",
            clazz: "grey"
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        }, {
            field: "updateTime",
            name: "操作时间",
            prop: "updateTime",
            clazz: "green"
        }, {
            field: "finishTime",
            name: "完成时间",
            prop: "finishTime",
            clazz: "green"
        }, {
            field: "level",
            name: "等级",
            prop: function(v) { return constant.customer().complain.complainType.keys[v.level]; },
            clazz: "red"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return constant.customer().complain.status.keys[v.status]; },
            clazz: "red"
        }, {
            field: "gladness",
            name: "满意度",
            prop: function(v) { return constant.customer().complain.complainStatus.keys[v.gladness]; },
            clazz: "red"
        }];
    })();

    var linebtns = (function() {

        return {
            complaint: {
                name: "投诉内容",
                clazz: "btn-yellow",
                handle: function(v) {

                    params.customer.aid = v.cid;
                    com.popup4page("#stockRecordPopUp", api.index.complaint.url, "投诉内容");
                }
            },
            finish: {
                name: "完结",
                clazz: "btn-success",
                show: function(v) { return v.status == constant.customer().complain.STATUS_DISPOSE_SHORT; },
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
                show: function(v) { return v.status == constant.customer().complain.STATUS_END_SHORT; },
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

    searcher.set("condList", "pagenation", "resultList", api.customer.pageComplain, null, ["customer-service-orderId", "customer-service-creater-name", "customer-service-updater-name", "customer-complain-status", "customer-complain-level"], "complainPostData", null, false, null);
    searcher.line("decoration.orderId", lineprops, linebtns).render();

})