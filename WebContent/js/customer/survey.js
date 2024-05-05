jQuery(function($) {

    var survey = {

        btns: {
            save: com.focusPage("#saveSurvey").on("click", save)
        },

        modals: {
            surveyModal: com.focusPage("#surveyModal"),
            makeSurveyModal: com.focusPage("#makeSurveyModal")
        },

        items: {
            itemlist: com.focusPage("#itemlist", "#surveyModal"),
            name: com.focusPage("#name", "#surveyModal"),
            content: com.focusPage("#content", "#surveyModal"),
            title: com.focusPage("#title", "#surveyModal"),
            orderId: com.focusPage("#orderId", "#makeSurveyModal"),
            surveyTemplate: com.focusPage("#surveyTemplate", "#makeSurveyModal"),
            particulars: com.focusPage("#particulars", "#surveyModal")
        },
        sid: null,
        stid: null,
        status: {},
        type: {},
        checked: {}
    };

    var pageConfig = drawNode.getConfig("customerService");

    survey.modals.surveyModal.on('hide.bs.modal', function(e) {

        com.cleanItems(survey.items);
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

    searcher.base("surveycondList", "surveypagenation", "surveyresultList", api.customer.pageSurvey);

    searcher.condition(['customer-survey-orderId', 'customer-survey-createTime', 'customer-survey-sendTime', 'customer-survey-handleTime', 'customer-survey-finishTime', 'customer-survey-status']);

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

            com.post(api.decoration.queryDecorationForCommonByOrderId, {
                "decoration.orderId": v.orderId
            }, function(res) {

                var decoration = res.decoration;

                params.decoration.orderId = decoration.orderId;
                params.decoration.orderType = decoration.type;
                params.decoration.orderTypeness = decoration.typeness;
                params.decoration.versionId = decoration.versionId;
                params.decoration.notSalesmanRate = decoration.notSalesmanRate;

                params.decoration.viewNode = Object.values(pageConfig.nodes);

                params.quotation.orderId = v.orderId;

                com.popup4page("#layerPopUp", api.index.decorationDetailIndex.url, "装修单详情: " + v.orderId);
            });

            return false;
        }
    }, {
        name: "完成",
        clazz: "btn-pink",
        handle: function(v) {

            finish(v.sid);
            return false;
        },
        show: function(v) {

            return v.status == constant.customer().survey.STATUS_HANDLE_INT;
        }
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#makeSurvey', '#surveypagenation').on("click", function() {

        survey.modals.makeSurveyModal.modal("show");
    });

    function show(v) {

        com.post(api.customer.querySurveyBySid, {
            "survey.sid": v.sid
        }, function(res) {

            survey.items.name.html(res.survey.name);
            var state = res.survey.status;
            $.each(res.survey.items, function(i, v) {

                if (v.type != constant.customer().survey.TYPE_TEXT_INT) {
                    var contentDiv = $('<div class="col-md-12 hr8"></div>').appendTo(survey.items.itemlist);
                    var titleSpan = $('<span class="col-md-12"></span>').html((i) + ". " + v.name).appendTo(contentDiv);
                }
                var type= v.type;
                if (v.type == constant.customer().survey.TYPE_TEXT_INT) {
                    survey.items.title.html(v.content);
                } else if (v.type == constant.customer().survey.TYPE_INPUT_INT) {
                    if (state != constant.customer().survey.STATUS_SEND_INT) {
                        var textArea = $('<textarea class="col-md-12 text" disabled></textarea>').html(v.content).appendTo(contentDiv);
                    }else{
                        var textArea = $('<textarea class="col-md-12 text"></textarea>').html(v.content).appendTo(contentDiv);
                    }
                } else if (v.type == constant.customer().survey.TYPE_SINGLE_INT) {
                    var ridioDivAll = $('<div class="col-md-12 control-group"></div>').appendTo(contentDiv);
                    ridioDivAll.prop('id', v.siid);
                    $.each(v.options, function(j, option) {
                        elect(ridioDivAll, option, type, state);
                    });
                } else if (v.type == constant.customer().survey.TYPE_MULTIPLE_INT) {
                    var checkDivAll = $('<div class="col-md-12 control-group"></div>').appendTo(contentDiv);
                    checkDivAll.prop('id', v.siid);
                    $.each(v.options, function(j, option) {
                        elect(checkDivAll, option, type, state);
                    });
                }

            });
            if (v.status == constant.customer().survey.STATUS_SEND_INT){
                var $execute = $('<div class="modal-footer" id="exDiv"></div>').appendTo(survey.items.particulars);
                var $button = $('<button class="btn btn-primary" type="button" id="execute">执行</button>').appendTo($execute);

            }
            survey.modals.surveyModal.modal("show");

            com.focusPage("#execute").click(function () {
                var options = {};
                options["survey.sid"] = res.survey.sid;

                $.each(res.survey.items, function (i, v) {
                    if (v.type != constant.customer().survey.TYPE_TEXT_INT) {
                        options["survey.items[" + i + "].siid"] = v.siid;
                        options["survey.items[" + i + "].name"] = v.name;
                    }
                    if (v.type == constant.customer().survey.TYPE_TEXT_INT) {
                        options["survey.items[" + i + "].siid"] = v.siid;
                        options["survey.items[" + i + "].content"] = v.content;
                    } else if (v.type == constant.customer().survey.TYPE_INPUT_INT) {
                        options["survey.items[" + i + "].siid"] = v.siid;
                        options["survey.items[" + i + "].content"] = com.focusPage(".text").val();
                    }

                    if (v.options.length != 0){
                        //单选
                        if (v.type == constant.customer().survey.TYPE_SINGLE_INT){

                            var checkbox = com.focusPage("input[type='radio']");
                            $.each(checkbox, function (k, n) {
                                if (k >= v.options.length) {
                                    return
                                }
                                if ($(n).prop("checked")){
                                    options["survey.items[" + i + "].options[" + k + "].checked"] = 0;
                                }else {
                                    options["survey.items[" + i + "].options[" + k + "].checked"] = 1;
                                }
                                $(n).remove()
                            });
                        }else {
                            //多选
                            var checkboxs = com.focusPage("input[type='checkbox']");
                            $.each(checkboxs, function (k, n) {
                                if (k >= v.options.length) {
                                    return
                                }
                                if ($(n).prop("checked")){
                                    options["survey.items[" + i + "].options[" + k + "].checked"] = 0;
                                }else {
                                    options["survey.items[" + i + "].options[" + k + "].checked"] = 1;
                                }
                                $(n).remove()
                            });
                        }
                    }

                    $.each(v.options, function (j, b) {

                        options["survey.items[" + i + "].siid"] = v.siid;
                        if (v.type == constant.customer().survey.TYPE_SINGLE_INT) {
                            options["survey.items[" + i + "].options[" + j + "].soid"] = b.soid;
                            options["survey.items[" + i + "].options[" + j + "].title"] = b.title;

                        } else if (v.type == constant.customer().survey.TYPE_MULTIPLE_INT) {
                            options["survey.items[" + i + "].options[" + j + "].soid"] = b.soid;
                            options["survey.items[" + i + "].options[" + j + "].title"] = b.title;
                        }
                    })
                });
                com.showConfirm("是否确认执行调研信息", function() {

                    com.post(api.customer.handleSurvey, options, function() {
                        survey.modals.surveyModal.modal("hide");
                        searcher.doSearch();
                    });
                });
            });

        });
    }

    function elect(contentDiv, option, type, status) {

        var ridioDiv = $('<div class="col-md-12"></div>').appendTo(contentDiv);
        var div = $('<div></div>').addClass("checkbox").appendTo(ridioDiv);
        var label = $('<label class="col-md-5"></label>').appendTo(div);
        if (status != constant.customer().survey.STATUS_SEND_INT) {
            var input = $('<input class="ace check" disabled>').attr({
                'name': 'form-field-checkbox' + option.siid
            }).appendTo(label);

        }else {
            var input = $('<input class="ace check">').attr({
                'name': 'form-field-checkbox' + option.siid
            }).appendTo(label);
        }

        if (type == constant.customer().survey.TYPE_SINGLE_INT) {
            input.prop({'type': 'radio'})
        }else if (type == constant.customer().survey.TYPE_MULTIPLE_INT) {
            input.prop({'type': 'checkbox'})
        }

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
            survey.items.orderId.val("");
            survey.items.surveyTemplate.val("");
            searcher.doSearch();
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
    function finish(sid) {

        com.showConfirm("调研信息是否确认完成", function() {

            var options = {
                "survey.sid": sid
            };

            com.post(api.customer.finishSurvey, options, function() {

                searcher.doSearch();
            }, function() {

                searcher.doSearch();
            });
        });
    }

});
