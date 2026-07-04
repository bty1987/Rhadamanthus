jQuery(function($) {

    var quotationProfile = {

        btns: {
            save: com.focusPage("#saveSurvey").on("click", save)
        },

        modals: {
            quotationProfileModal: com.focusPage("#quotationProfileModal"),
            makeProfileModal: com.focusPage("#makeProfileModal")
        },

        items: {
            itemlist: com.focusPage("#itemlist", "#quotationProfileModal"),
            name: com.focusPage("#name", "#quotationProfileModal"),
            content: com.focusPage("#content", "#quotationProfileModal"),
            title: com.focusPage("#title", "#quotationProfileModal"),
            orderId: com.focusPage("#orderId", "#makeProfileModal"),
            surveyTemplate: com.focusPage("#surveyTemplate", "#makeProfileModal"),
            particulars: com.focusPage("#particulars", "#quotationProfileModal")
        },
        qpid: null,
        stid: null,
        status: {},
        type: {},
        checked: {}
    };

    quotationProfile.modals.quotationProfileModal.on('hide.bs.modal', function(e) {

        com.cleanItems(quotationProfile.items);
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

    searcher.base("profilecondList", "profilepagenation", "profileresultList", api.quotation.pageQuotationProfile);

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
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.customer().survey.status.keys
    }, {
        fieId: "type",
        name: "用途",
        prop: "type",
        clazz: "blue",
        dataset: constant.quotation().quotationProfile.type.keys
    }];

    var linebtns = [{
        name: "详情",
        clazz: "btn-yellow",
        handle: function(v) {

            quotationProfile.qpid = v.qpid;
            params.quotation.v = v;

            params.quotation.qpid = v.qpid;
            params.quotation.orderId = v.orderId;

            com.popup4page("#layerPopUp", api.index.quotationProfile4detailIndex.url, "报价配置: ");

            return false;
        }
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#makeSurvey', '#profilepagenation').on("click", function() {

        quotationProfile.modals.makeProfileModal.modal("show");
    });

    function save() {

        if (com.validate('makeProfileModal'))
            return false;

        var tid = com.typeahead("surveyTemplate");
        var options = {
            "quotationProfile.orderId": quotationProfile.items.orderId.val(),
            "quotationProfile.tid": tid,
        };

        com.post(api.quotation.makeQuotationProfile, options, function(res) {

            quotationProfile.items.orderId.val("");
            quotationProfile.items.surveyTemplate.val("");
            searcher.doSearch();
        });

        quotationProfile.modals.makeProfileModal.modal("hide");
    }

});
