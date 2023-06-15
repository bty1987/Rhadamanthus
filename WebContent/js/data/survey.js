jQuery(function($) {

    var survey = {

        btns: {
            save: com.focusPage("#saveSurvey").on("click", save),
        },

        modals: {
            surveyModal: com.focusPage("#surveyModal"),
            makeSurveyModal: com.focusPage("#makeSurveyModal"),
        },

        items: {
            itemlist: com.focusPage("#itemlist", "#surveyModal"),
            name: com.focusPage("#name", "#surveyModal"),
            content: com.focusPage("#content", "#surveyModal"),
            title: com.focusPage("#title", "#surveyModal"),
            orderId: com.focusPage("#orderId", "#makeSurveyModal"),
            surveyTemplate: com.focusPage("#surveyTemplate", "#makeSurveyModal"),
        },
        sid: null,
        stid: null,
        status: {},
        type: {},
        checked: {}
    };

    survey.modals.surveyModal.on('hide.bs.modal', function(e) {

        com.cleanItems(survey.items);
        com.focusPage("#itemlist").html("");
        com.cleanTypeahead("surveyTemplate");
        com.clearValidator();
        com.closeTip();
    });

    com.initTypeahead('surveyTemplate', api.data.querySurveyTemplate, "surveyTemplate.name", {}, "surveyTemplates", "stid", function(v) {

        return v.name
    }, null);

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.customer.pageSurvey);

    searcher.condition(['customer-survey-orderId', 'customer-survey-createTime', 'customer-survey-sendTime', 'customer-survey-status']);

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
        clazz: "grey"
    }, {
        field: "creater",
        name: "创建人",
        prop: "creater.userName",
        clazz: "grey"
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

            survey.sid = v.sid;
            show(v);
            return false;
        }
    }, {
        name: "发送",
        clazz: "btn-danger",
        handle: function(v) {

            send(v.sid);
            return false;
        },
        show: function(v) {

            return v.status == constant.customer().survey.STATUS_INIT_INT;
        }
    }, {
        name: "装修单",
        clazz: "btn-success",
        handle: function(v) {

            survey.sid = v.sid;

            return false;
        }
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#makeSurvey', '#pagenation').on("click", function() {

        survey.modals.makeSurveyModal.modal("show");
    });

    function show(v) {

        com.post(api.customer.querySurveyBySid, {
            "survey.sid": v.sid
        }, function(res) {

            survey.items.name.html(res.survey.name);

            $.each(res.survey.items, function(i, v) {

                if (v.type != constant.customer().survey.TYPE_SELECT_INT) {
                    var contentDiv = $('<div class="col-md-12 hr8"></div>').appendTo(survey.items.itemlist);
                    var titleSpan = $('<span class="col-md-12"></span>').html((i) + ". " + v.name).appendTo(contentDiv);
                }

                if (v.type == constant.customer().survey.TYPE_TEXT_INT) {
                    survey.items.title.html(v.content);
                } else if (v.type == constant.customer().survey.TYPE_INPUT_INT) {
                    var textArea = $('<textarea class="col-md-12" disabled></textarea>').html(v.content).appendTo(contentDiv);
                } else if (v.type == constant.customer().survey.TYPE_SINGLE_INT) {
                    var ridioDivAll = $('<div class="col-md-12 control-group"></div>').appendTo(contentDiv);
                    $.each(v.options, function(j, option) {

                        elect(ridioDivAll, option);
                    });
                } else if (v.type == constant.customer().survey.TYPE_MULTIPLE_INT) {
                    var checkDivAll = $('<div class="col-md-12 control-group"></div>').appendTo(contentDiv);
                    $.each(v.options, function(j, option) {

                        elect(checkDivAll, option);
                    });
                }
            });

            survey.modals.surveyModal.modal("show");
        });
    }

    function elect(contentDiv, option) {

        var ridioDiv = $('<div class="col-md-12"></div>').appendTo(contentDiv);
        var div = $('<div></div>').addClass("checkbox").appendTo(ridioDiv);
        var label = $('<label class="col-md-5"></label>').appendTo(div);

        var input = $('<input class="ace" disabled/>').attr({
            'name': 'form-field-checkbox'
        }).prop({
            'type': "checkbox"
        }).appendTo(label);

        var span = $('<span class="lbl"</span>').html(option.title).appendTo(label);

        if (option.checked == 0) {
            input.attr('checked', true);
        } else {
            input.attr('checked', false);
        }
    }

    function save() {

        if (com.validate('makeSurveyModal'))
            return false;

        var stid = com.typeahead("surveyTemplate");

        var options = {
            "survey.orderId": survey.items.orderId.val(),
            "survey.stid": stid,
        };

        com.post(api.customer.makeSurvey, options, function(res) {

            send(res.survey.sid);
        });

        survey.modals.makeSurveyModal.modal("hide");
    }

    function send(sid) {

        com.showConfirm("是否确认推送调研信息", function() {

            var options = {
                "survey.sid": sid
            };

            com.post(api.customer.sendSurvey, options, function() {

                searcher.doSearch();
            }, function() {

                searcher.doSearch();
            });
        });
    }

});
