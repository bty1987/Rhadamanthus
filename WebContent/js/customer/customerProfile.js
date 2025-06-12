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

    searcher.base("profilecondList", "profilepagenation", "profileresultList", api.customer.pageCustomerprofile);

    searcher.condition(["data-surveyTemplate-name", "data-surveyTemplate-status"]);

    searcher.button([{
        id: "makeSurvey",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        fieId: "name",
        name: "调研名称",
        prop: "name",
        clazz: "grey"
    }, {
        fieId: "orderId",
        name: "装修单号",
        prop: "orderId",
        clazz: "grey",
        click: function(btn, v) {

            tools.decoration.info(btn, v.orderId);
        }
    }, {
        field: "creater",
        name: "创建人",
        prop: "creater.userName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.creater.userId);
        }
    }, {
        field: "sender",
        name: "推送人",
        prop: "sender.userName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.sender.userId);
        }
    }, {
        field: "finisher",
        name: "完成人",
        prop: "finisher.userName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.finisher.userId);
        }
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        fieId: "sendTime",
        name: "推送时间",
        prop: "sendTime",
        clazz: "green"
    }, {
        fieId: "handleTime",
        name: "处理时间",
        prop: "handleTime",
        clazz: "green"
    }, {
        fieId: "finishTime",
        name: "完成时间",
        prop: "finishTime",
        clazz: "green"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.customer().survey.status.keys
    }];

    var linebtns = [{
        name: "详情",
        clazz: "btn-yellow",
        handle: function(v) {

            customerProfile.cpid = v.cpid;
            params.customer.v = v;
            // com.switchPage(api.index.profileInfo.url); 跳转新页面

            params.customer.cpid = v.cpid;

            com.popup4page("#layerPopUp", api.index.customerProfile4detailIndex.url, "客户画像: ");

            return false;
        }
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
