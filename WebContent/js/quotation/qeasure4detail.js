jQuery(function($) {

    var qeasureDetail = {

        btns: {
            // save: com.focusPage("#saveSurvey").on("click", save)
            addFunctionAreaBtn: com.focusPage("#addFunctionAreaBtn").on("click", saveFunctionArea)
        },
        modals: {
            qeasureDetailModal: com.focusPage("#qeasureDetailModal"),

            functionAreaModal: com.focusPage("#functionAreaModal"),
            addFunctionAreaModal: com.focusPage("#addFunctionAreaModal"),
        },
        items: {
            itemlist: com.focusPage("#itemlist", "#qeasureDetailModal"),
            functionAreas: com.focusPage("#functionAreas", "#qeasureDetailModal"),

            functionAreaItemList: com.focusPage("#functionAreaItemList", "#functionAreaModal"),

            name: com.focusPage("#name", "#qeasureDetailModal"),
            content: com.focusPage("#content", "#qeasureDetailModal"),
            title: com.focusPage("#title", "#qeasureDetailModal"),
            particulars: com.focusPage("#particulars", "#qeasureDetailModal"),

            functionAreaParticulars: com.focusPage("#functionAreaParticulars", "#functionAreaModal"),

            functionArea: com.focusPage("#functionArea", "#addFunctionAreaModal"),
        },

        qeasure: null,
        qeasureItems: [],
    };

    com.focusPage('#btnBack').on("click", function() {

        qeasureDetail.modals.qeasureDetailModal.modal("hide");

        com.closePopup();
    });

    show();
    handle();
    
    com.post(api.decoration.queryDecorationForCommonByOrderId, {
        "decoration.orderId": qeasureDetail.qeasure.orderId
    }, function(res) {
        qeasureDetail.decoration = res.decoration;
    }, null, false);

    com.post(api.quotation.queryQuotationForDefaultByOrderId, {
        "quotation.orderId": qeasureDetail.qeasure.orderId
    }, function() {
        qeasureDetail.quotation = res.quotation;
    }, null, false);
    
    com.post(api.quotation.queryFunctionAreaByVersionId, {"functionArea.version.no": qeasureDetail.quotation? qeasureDetail.quotation.versionId : qeasureDetail.decoration.version.no}, function(res){
        qeasureDetail.items.functionArea.bindData(res.functionAreas, "faid", "name");
    });

    function show() {

        var url = null;
        var args = null;

        if (params.quotation.qmid) {
            url = api.quotation.queryQeasureByQmid;
            args = {
                "qeasure.qmid": params.quotation.qmid
            }
        }

        if (params.quotation.orderId) {
            url = api.quotation.queryQeasureByOrderId;
            args = {
                "qeasure.orderId": params.quotation.orderId,
            }
        }

        if (!url)
            return false

        var isMake = true;

        com.post(url, args, function(res) {

            if (res.qeasure && res.qeasure.qmid) {

                qeasureDetail.qeasure = res.qeasure;

                display(res.qeasure);
                isMake = false;
            }
        }, null, false);

        if (!isMake)
            return false;

        var template = null;

        com.post(api.system.querySystemConfigByKey, {
            "systemConfig.key": "QUOTATION_QEASURE_TEMPLATE"
        }, function(res) {

            template = res.systemConfig.value;
        }, null, false);

        if (!template) {
            com.showAlert(com.error, "量房模板不存在");
            return false;
        }

        args["qeasure.tid"] = template;

        com.post(api.quotation.makeQeasure, args, function(res) {

            args["qeasure.qmid"] = res.qeasure.qmid;
        }, null, false);

        com.post(api.quotation.queryQeasureByOrderId, args, function(res) {

            qeasureDetail.qeasure = res.qeasure;

            display(res.qeasure);
        }, null, false);

    }

    function display(qeasure) {

        var addA = $('<a href="#" id="createQuotation" class="btn btn-default btn-app btn-sm radius-4" style="padding: 5px 0;"></a>').prependTo(qeasureDetail.items.functionAreas);
        var addI = $('<i class="icon-plus-sign bigger-230"></i>').appendTo(addA);
        var addSpan = $('<span>创建</span>').appendTo(addA);

        addA.click(function(res) {

            qeasureDetail.modals.addFunctionAreaModal.modal("show");
        });

        com.post(api.quotation.queryQeasureFunctionArea, {
            "qeasureFunctionArea.qmid": qeasure.qmid
        }, function(res) {

            var qeasureFunctionAreas = res.qeasureFunctionAreas;

            $.each(qeasureFunctionAreas, function(i, v) {

                addFunctionArea(v);
            });
        }, null, false);

        qeasureDetail.items.name.html(qeasure.name);

        $.each(qeasure.items, function(i, v) {

            if (v.type != constant.quotation().qeasureItem.TYPE_TEXT_INT) {
                var contentDiv = $('<div class="col-md-6 hr8" style="display: flex;"></div>').addClass("item").attr("id", v.qmiid).attr("qmiid", v.qmiid).attr("type", v.type).appendTo(qeasureDetail.items.itemlist);
                var titleSpan = $('<span class="label-text col-sm-3"></span>').html(v.name).appendTo(contentDiv);

                if (v.require == 0)
                    titleSpan.addClass("orange");
            }

            var type = v.type;

            if (v.type == constant.quotation().qeasureItem.TYPE_TEXT_INT) {
                qeasureDetail.items.title.html(v.content);
            } else if (v.type == constant.quotation().qeasureItem.TYPE_INPUT_INT) {

                var textArea = $('<textarea class="col-sm-9 text "></textarea>').prop('id', v.qmiid + "textarea").html(v.content).appendTo(contentDiv);

                if (v.require == 0)
                    textArea.addClass("v_required");

            } else if (v.type == constant.quotation().qeasureItem.TYPE_SINGLE_INT) {

                var radioDivAll = $('<div class="col-sm-9 control-group"></div>').prop('id', 'form-field-checkbox' + v.qmiid).appendTo(contentDiv);

                if (v.require == 0)
                    radioDivAll.addClass("v_radio");

                $.each(v.options, function(j, option) {

                    elect(radioDivAll, option, type);
                });
            } else if (v.type == constant.quotation().qeasureItem.TYPE_MULTIPLE_INT) {

                var checkDivAll = $('<div class="col-sm-9 control-group"></div>').prop('id', 'form-field-checkbox' + v.qmiid).appendTo(contentDiv);

                if (v.require == 0)
                    checkDivAll.addClass("v_checkbox");

                $.each(v.options, function(j, option) {

                    elect(checkDivAll, option, type);
                });
            } else if (v.type == constant.quotation().qeasureItem.TYPE_DATE_INT) {

                var inputdate = $('<input type="text" readonly="readonly" data-type="dateRangePicker">').prop('id', v.qmiid + "date").html(v.content).appendTo(contentDiv);

                com.datetime(inputdate);

                if (v.require == 0)
                    inputdate.addClass("v_required");
            }
        });

        $("<hr/>").addClass("hr hr32 hr-dotted").appendTo(qeasureDetail.items.itemlist)

        qeasureDetail.qeasureItems = qeasureDetail.qeasureItems.concat(qeasure.items);
    }

    function saveFunctionArea() {

        if (com.validate('addFunctionAreaModal'))
            return false;

        var options = {
            "qeasure.qmid": qeasureDetail.qeasure.qmid,
            "qeasureFunctionArea.qmid": qeasureDetail.qeasure.qmid,
            "qeasureFunctionArea.faid": qeasureDetail.items.functionArea.val(),
        };

        com.post(api.quotation.makeQeasureFunctionArea, options, function(res) {
            
            addFunctionArea(res.qeasureFunctionArea);
            
            qeasureDetail.modals.addFunctionAreaModal.modal("hide");
        });
    }

    function addFunctionArea(functionArea) {

        var pricingSpan = $("<div></div>").addClass("pricing-span").css("margin-right", "10px").attr("id", "qmfaid" + functionArea.qmfaid).prependTo(qeasureDetail.items.functionAreas);
        var widgetBox = $("<div></div>").addClass("widget-box pricing-box-small").appendTo(pricingSpan);

        var widgetHeader = $("<div></div>").addClass("widget-header").addClass("header-color-blue").appendTo(widgetBox);
        var widgetHeaderH5 = $("<h5></h5>").addClass("bigger lighter").text(functionArea.name).appendTo(widgetHeader);

        var widgetBody = $("<div></div>").addClass("widget-body").appendTo(widgetBox);
        var widgetMain = $("<div></div>").addClass("widget-main no-padding").appendTo(widgetBody);
        var ul = $("<ul></ul>").addClass("list-unstyled list-striped pricing-table").appendTo(widgetMain);

        var nameLi = $("<li></li>").appendTo(ul);
        var nameSpan = $("<span></span>").attr("id", "functionAreaName_" + functionArea.qmfaid).text(functionArea.name).appendTo(nameLi);

        var uiPgDiv = $("<div></div>").addClass("ui-pg-div").appendTo(widgetBody);
        var deleteBtn = $("<span></span>").addClass("ui-icon ui-icon-pencil").attr("id", "edit_" + functionArea.qmfaid).appendTo(uiPgDiv);
        var deleteBtn = $("<span></span>").addClass("ui-icon ui-icon-trash").attr("id", "delete_" + functionArea.qmfaid).appendTo(uiPgDiv);

        pricingSpan.on("click", function() {

            showFunctionArea(functionArea);
            
            return false;
        });

        deleteBtn.on("click", function() {

            deleteFunctionArea(functionArea.qmfaid, functionArea.name);
            
            return false;
        });
    }

    function showFunctionArea(functionArea) {

        com.post(api.quotation.queryQeasureFunctionAreaByQmfaId, {
            "qeasureFunctionArea.qmfaid": functionArea.qmfaid
        }, function(res) {

            qeasureDetail.items.name.html(res.qeasureFunctionArea.name);
            qeasureDetail.items.functionAreaItemList.html("");

            qeasureDetail.modals.functionAreaModal.modal("show");

            if (!res.qeasureFunctionArea || !res.qeasureFunctionArea.items || res.qeasureFunctionArea.items.length == 0) {
                return false;
            }

            $.each(res.qeasureFunctionArea.items, function(i, v) {

                var type = v.type;

                if (v.type != constant.quotation().qeasureItem.TYPE_TEXT_INT) {
                    var contentDiv = $('<div class="col-md-12 hr8"></div>').appendTo(qeasureDetail.items.functionAreaItemList);
                    var titleSpan = $('<span class="col-md-12"></span>').html((i) + ". " + v.name).appendTo(contentDiv);
                }

                if (v.type == constant.quotation().qeasureItem.TYPE_TEXT_INT) {
                    var textSpan = $('<div class="col-md-12"></textarea>').html(v.content).appendTo(contentDiv);
                } else if (v.type == constant.quotation().qeasureItem.TYPE_INPUT_INT) {

                    var textArea = $('<textarea class="col-md-12 text"></textarea>').attr("id", "input_" + v.qmiid).html(v.content).appendTo(contentDiv);

                } else if (v.type == constant.quotation().qeasureItem.TYPE_SINGLE_INT) {
                    var ridioDivAll = $('<div class="col-md-12 control-group"></div>').appendTo(contentDiv);
                    ridioDivAll.prop('id', v.qmiid);
                    $.each(v.options, function(j, option) {

                        elect(ridioDivAll, option, type);
                    });
                } else if (v.type == constant.quotation().qeasureItem.TYPE_MULTIPLE_INT) {

                    var checkDivAll = $('<div class="col-md-12 control-group"></div>').prop('id', v.qmiid).appendTo(contentDiv);

                    $.each(v.options, function(j, option) {

                        elect(checkDivAll, option, type);
                    });
                } else if (v.type == 4) {
                    var inputdate = $('<input type="text" readonly="readonly" data-type="dateRangePicker">').attr("id", "input_" + v.qmiid).html(v.content).appendTo(contentDiv);
                    com.datetime(inputdate);
                }
            });

            com.focusPage("#execute", "#functionAreaModal").click(function() {

                var options = {};
                options["qeasureFunctionArea.qmfaid"] = functionArea.qmfaid;

                $.each(res.qeasureFunctionArea.items, function(i, v) {

                    if (v.type != constant.customer().survey.TYPE_TEXT_INT) {
                        options["qeasureFunctionArea.items[" + i + "].qmiid"] = v.qmiid;
                        options["qeasureFunctionArea.items[" + i + "].name"] = v.name;
                    }
                    if (v.type == constant.customer().survey.TYPE_TEXT_INT) {
                        options["qeasureFunctionArea.items[" + i + "].qmiid"] = v.qmiid;
                        options["qeasureFunctionArea.items[" + i + "].content"] = v.content;
                    } else if (v.type == constant.customer().survey.TYPE_INPUT_INT) {
                        options["qeasureFunctionArea.items[" + i + "].qmiid"] = v.qmiid;
                        options["qeasureFunctionArea.items[" + i + "].content"] = com.focusPage("#input_" + v.qmiid).val();
                    } else if (v.type == constant.customer().survey.TYPE_DATE_INT) {
                        options["qeasureFunctionArea.items[" + i + "].qmiid"] = v.qmiid;
                        options["qeasureFunctionArea.items[" + i + "].content"] = com.focusPage("#input_" + v.qmiid).val();
                    }

                    if (v.options.length != 0) {

                        if (v.type == constant.customer().survey.TYPE_SINGLE_INT) { // 单选

                            var checkbox = com.focusPage("input[type='radio']", "#functionAreaModal");

                            $.each(checkbox, function(k, n) {

                                if (k >= v.options.length) {
                                    return false;
                                }

                                if ($(n).prop("checked")) {
                                    options["qeasureFunctionArea.items[" + i + "].options[" + k + "].checked"] = 0;
                                } else {
                                    options["qeasureFunctionArea.items[" + i + "].options[" + k + "].checked"] = 1;
                                }
                            });
                        } else { // 多选

                            var checkboxs = com.focusPage("input[type='checkbox']");

                            $.each(checkboxs, function(k, n) {

                                if (k >= v.options.length) {
                                    return false;
                                }

                                if ($(n).prop("checked")) {
                                    options["qeasureFunctionArea.items[" + i + "].options[" + k + "].checked"] = 0;
                                } else {
                                    options["qeasureFunctionArea.items[" + i + "].options[" + k + "].checked"] = 1;
                                }
                            });
                        }
                    }

                    $.each(v.options, function(j, b) {

                        options["survey.items[" + i + "].qmiid"] = v.qmiid;
                        if (v.type == constant.customer().survey.TYPE_SINGLE_INT) {
                            options["qeasureFunctionArea.items[" + i + "].options[" + j + "].qmoid"] = b.qmoid;
                            options["qeasureFunctionArea.items[" + i + "].options[" + j + "].title"] = b.title;

                        } else if (v.type == constant.customer().survey.TYPE_MULTIPLE_INT) {
                            options["qeasureFunctionArea.items[" + i + "].options[" + j + "].qmoid"] = b.qmoid;
                            options["qeasureFunctionArea.items[" + i + "].options[" + j + "].title"] = b.title;
                        }
                    })
                });

                com.showConfirm("是否确认执行调研信息", function() {

                    com.post(api.quotation.handleQeasureFunctionArea, options, function() {

                        qeasureDetail.modals.functionAreaModal.modal("hide");
                    });
                });
            });

        });
    }

    function deleteFunctionArea(qmfaid, name) {

        com.showConfirm("是否删除" + name + "功能区", function(result) {

            com.post(api.quotation.deleteQeasureFunctionArea, {
                "qeasureFunctionArea.qmid": qeasureDetail.qeasure.qmid,
                "qeasureFunctionArea.qmfaid": qmfaid
            }, function(res) {

                com.showAlert(com.info, "操作成功");

                com.focusPage("#qmfaid" + qmfaid).remove();
            });
        });
    }

    function handle() {

        var $execute = $('<div id="exDiv"></div>').appendTo(qeasureDetail.items.particulars);
        var $button = $('<button class="btn btn-primary pull-right" type="button" id="execute">保存</button>').appendTo($execute);

        com.focusPage("#execute", "#qeasureDetailModal").click(function() {

            if (com.validate("itemlist"))
                return false;

            var options = {
                "qeasure.qmid": qeasureDetail.qeasure.qmid
            };

            var items = com.focusPage(".item", "#itemlist");

            $.each(items, function(i, v) {

                var item = $(v);

                var qmiid = item.attr("qmiid");
                var type = item.attr("type");

                options["qeasure.items[" + i + "].qmiid"] = qmiid;

                if (type == constant.quotation().qeasureItem.TYPE_INPUT_INT) {
                    options["qeasure.items[" + i + "].content"] = com.focusPage("#" + qmiid + "textarea").val();
                }

                if (type == constant.quotation().qeasureItem.TYPE_DATE_INT) {
                    options["qeasure.items[" + i + "].content"] = com.focusPage("#" + qmiid + "date").val();
                }

                if (type == constant.quotation().qeasureItem.TYPE_SINGLE_INT) {

                    var soptions = item.find("input[type='radio']");

                    $.each(soptions, function(k, n) {

                        var subt = $(n);
                        var qmoid = subt.attr("qmoid");

                        if (subt.prop("checked")) {
                            options["qeasure.items[" + i + "].options[" + k + "].qmoid"] = qmoid;
                            options["qeasure.items[" + i + "].options[" + k + "].checked"] = 0;
                        } else {
                            options["qeasure.items[" + i + "].options[" + k + "].qmoid"] = qmoid;
                            options["qeasure.items[" + i + "].options[" + k + "].checked"] = 1;
                        }
                    });
                }

                if (type == constant.quotation().qeasureItem.TYPE_MULTIPLE_INT) {

                    var soptions = item.find("input[type='checkbox']");

                    $.each(soptions, function(k, n) {

                        var subt = $(n);
                        var qmoid = subt.attr("qmoid");

                        if (subt.prop("checked")) {
                            options["qeasure.items[" + i + "].options[" + k + "].qmoid"] = qmoid;
                            options["qeasure.items[" + i + "].options[" + k + "].checked"] = 0;
                        } else {
                            options["qeasure.items[" + i + "].options[" + k + "].qmoid"] = qmoid;
                            options["qeasure.items[" + i + "].options[" + k + "].checked"] = 1;
                        }
                    });
                }
            });

            com.showConfirm("是否更新量房信息", function() {

                com.post(api.quotation.handleQeasure, options);
            });
        });
    }

    function elect(contentDiv, option, type) {

        var ridioDiv = $('<div class="col-sm-4"></div>').appendTo(contentDiv);
        var div = $('<div></div>').addClass("").appendTo(ridioDiv);
        var label = $('<label  class="label-text"></label>').appendTo(div);

        var input = $('<input class="ace">').attr({
            'name': 'form-field-checkbox' + option.qmiid,
            "qmoid": option.qmoid
        }).appendTo(label);

        if (type == constant.quotation().qeasureItem.TYPE_SINGLE_INT) {
            input.prop({
                'type': 'radio'
            })
        } else if (type == constant.quotation().qeasureItem.TYPE_MULTIPLE_INT) {
            input.prop({
                'type': 'checkbox'
            })
        }

        var span = $('<span class="lbl blue" style="padding-left: 5px;"></span>').html(option.title).appendTo(label);

        if (option.checked == 0) {
            input.attr('checked', true);
        } else {
            input.attr('checked', false);
        }
    }

});