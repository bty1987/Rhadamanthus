jQuery(function($) {

    var customerProfile = {

        btns: {
            save: com.focusPage("#saveSurvey").on("click", save)
        },

        modals: {
            customerProfileModal: com.focusPage("#customerProfileModal"),
            makeProfileModal: com.focusPage("#makeProfileModal")
        },

        items: {
            itemlist: com.focusPage("#itemlist", "#customerProfileModal"),
            name: com.focusPage("#name", "#customerProfileModal"),
            content: com.focusPage("#content", "#customerProfileModal"),
            title: com.focusPage("#title", "#customerProfileModal"),
            orderId: com.focusPage("#orderId", "#makeProfileModal"),
            surveyTemplate: com.focusPage("#surveyTemplate", "#makeProfileModal"),
            particulars: com.focusPage("#particulars", "#customerProfileModal")
        },
        sid: null,
        stid: null,
        status: {},
        type: {},
        checked: {}
    };

    customerProfile.modals.customerProfileModal.on('hide.bs.modal', function(e) {

        com.cleanItems(customerProfile.items);
        com.focusPage("#itemlist").html("");
        com.focusPage("#exDiv").remove();
        com.cleanTypeahead("surveyTemplate");
        com.clearValidator();
        com.closeTip();
    });

    com.initTypeahead('surveyTemplate', api.data.querySurveyTemplate, "surveyTemplate.name", {}, "surveyTemplates", "stid", function(v) {

        return v.name
    }, null);

    var searcher = new Searcher();

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = customerOriginPage.getConfig("customerProfile");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    searcher.base("profilecondList", "profilepagenation", "profileresultList", pageConfig.apiPage || api.customer.pageCustomerProfile);

    searcher.condition(pageConfig.condArr.length > 0 ? pageConfig.condArr : ["data-surveyTemplate-name", "data-surveyTemplate-status"]);

    searcher.button([{
        id: "makeSurvey",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    var propertyMap = {
        "name": {
            fieId: "name",
            name: "调研名称",
            prop: "name",
            clazz: "grey"
        },
        "orderId": {
            fieId: "orderId",
            name: "装修单号",
            prop: "orderId",
            clazz: "grey",
            click: function(btn, v) {

                tools.decoration.info(btn, v.orderId);
            }
        },
        "creater": {
            field: "creater",
            name: "创建人",
            prop: "creater.userName",
            clazz: "grey",
            click: function(btn, v) {

                tools.personel.info(btn, v.creater.userId);
            }
        },
        "sender": {
            field: "sender",
            name: "推送人",
            prop: "sender.userName",
            clazz: "grey",
            click: function(btn, v) {

                tools.personel.info(btn, v.sender.userId);
            }
        },
        "finisher": {
            field: "finisher",
            name: "完成人",
            prop: "finisher.userName",
            clazz: "grey",
            click: function(btn, v) {

                tools.personel.info(btn, v.finisher.userId);
            }
        },
        "createTime": {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        },
        "sendTime": {
            fieId: "sendTime",
            name: "推送时间",
            prop: "sendTime",
            clazz: "green"
        },
        "handleTime": {
            fieId: "handleTime",
            name: "处理时间",
            prop: "handleTime",
            clazz: "green"
        },
        "finishTime": {
            fieId: "finishTime",
            name: "完成时间",
            prop: "finishTime",
            clazz: "green"
        },
        "status": {
            fieId: "status",
            name: "状态",
            prop: "status",
            clazz: "red",
            dataset: constant.customer().survey.status.keys
        }
    };

    var lineprops = (function () {

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

    var linebtns = [{
        name: "详情",
        clazz: "btn-yellow",
        handle: function(v) {

            customerProfile.cpid = v.cpid;
            params.customer.v = v;

            params.customer.cpid = v.cpid;

            com.popup4page("#layerPopUp", api.index.customerProfile4detailIndex.url, "客户画像: ");

            return false;
        },
        show: function() { return btnVisible("detail"); }
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#makeSurvey', '#profilepagenation').on("click", function() {

        customerProfile.modals.makeProfileModal.modal("show");
    });

    function save() {

        if (com.validate('makeProfileModal'))
            return false;

        var tid = com.typeahead("surveyTemplate");
        var options = {
            "customerProfile.orderId": customerProfile.items.orderId.val(),
            "customerProfile.tid": tid,
        };

        com.post(api.customer.makeCustomerProfile, options, function(res) {

            customerProfile.items.orderId.val("");
            customerProfile.items.surveyTemplate.val("");
            searcher.doSearch();
        });

        customerProfile.modals.makeProfileModal.modal("hide");
    }

});
