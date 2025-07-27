jQuery(function($) {

    var salesProfileDetail = {

        btns: {
            save: com.focusPage("#saveSurvey").on("click", save)
        },
        modals: {
            salesProfileDetailModal: com.focusPage("#salesProfileDetailModal"),
            makeProfileModal: com.focusPage("#makeProfileModal"),
            addBrandModal: com.focusPage("#addBrandModal")
        },
        items: {
            itemlist: com.focusPage("#itemlist", "#salesProfileDetailModal"),
            name: com.focusPage("#name", "#salesProfileDetailModal"),
            content: com.focusPage("#content", "#salesProfileDetailModal"),
            title: com.focusPage("#title", "#salesProfileDetailModal"),
            orderId: com.focusPage("#orderId", "#makeProfileModal"),
            surveyTemplate: com.focusPage("#surveyTemplate", "#makeProfileModal"),
            particulars: com.focusPage("#particulars", "#salesProfileDetailModal"),
            brandName: com.focusPage("#brandName", "#addBrandModal"),
        },

        profile: null,
        bid: null,
        isMake: true,
        spid: null,
        sid: params.sales.sid,
        profiles: [],
        profileItems: []
    };

    com.focusPage('#btnBack').on("click", function() {

        salesProfileDetail.modals.salesProfileDetailModal.modal("hide");

        com.closePopup();
    });

    salesProfileDetail.modals.addBrandModal.on('hide.bs.modal', function(e) {

        com.cleanTypeahead('brandName');
        com.cleanItems(salesProfileDetail.items);
    });

    com.initTypeahead('brandName', api.data.queryBrandByPinyin, "brand.pinyin", {
        "brand.atttype": 0
    }, 'brands', 'bid', 'name', function(list, k, v) {

        $.each(list, function(index, val) {

            if (val.bid == k) {
                salesProfileDetail.bid = val.bid;
                salesProfileDetail.items.brandName.val(val.name);
            }
        });

        return v;
    });

    com.initTypeahead('surveyTemplate', api.data.querySurveyTemplate, "surveyTemplate.name", {}, "surveyTemplates", "stid", function(v) {

        return v.name
    }, null);

    init();
    show();
    handle();

    function init() {

        salesProfileDetail.items.orderId.val(params.sales.orderId);

        var args = {
            "salesProfile.orderId": params.sales.orderId,
        }

        com.post(api.sales.querySalesProfileByOrderId, args, function(res) {

            salesProfileDetail.profile = res.salesProfile;

        }, function(res) {

        }, false);

        if (salesProfileDetail.profile) {
            return false;
        }

        var template = null;

        com.post(api.system.querySystemConfigByKey, {
            "systemConfig.key": "SALES_PROFILE_TEMPLATE"
        }, function(res) {

            template = res.systemConfig.value;
        }, null, false);

        if (template == null) {
            com.showAlert(com.error, "满意度模板不存在");
            return false;
        }

        com.showConfirm("是否创建满意度", function(res) {

            var options = {
                "salesProfile.orderId": salesProfileDetail.items.orderId.val(),
                "salesProfile.tid": template,
            };

            com.post(api.sales.makeSalesProfile, options, function(res) {

                com.closePopup();
            });
        });
    }

    function show() {

        if (salesProfileDetail.profile) {

            display(salesProfileDetail.profile);

            return false;
        }

        salesProfileDetail.items.orderId.val(params.sales.orderId);

        var args = {
            "salesProfile.orderId": params.sales.orderId,
        }

        com.post(api.sales.querySalesProfileByOrderId, args, function(res) {

            salesProfileDetail.profile = res.salesProfile;

        }, function(res) {

        }, false);

        if (salesProfileDetail.profile) {

            display(salesProfileDetail.profile);

            return false;
        }
    }

    function display(profile) {

        var state = profile.status;

        $.each(profile.items, function(i, v) {

            if (v.type != constant.customer().survey.TYPE_TEXT_INT) {
                var contentDiv = $('<div class="col-md-6 hr8" style="display: flex;"></div>').addClass("item").attr("id", v.spiid).attr("spiid", v.spiid).attr("type", v.type).appendTo(salesProfileDetail.items.itemlist);
                var titleSpan = $('<span class="label-text col-sm-3"></span>').html(v.name).appendTo(contentDiv);

                if (v.require == 0)
                    titleSpan.addClass("orange");
            }

            var type = v.type;

            if (v.type == constant.customer().survey.TYPE_TEXT_INT) {
                salesProfileDetail.items.title.html(v.content);
            } else if (v.type == constant.customer().survey.TYPE_INPUT_INT) {

                var textArea = $('<textarea class="col-sm-9 text "></textarea>').prop('id', v.spiid + "textarea").html(v.content).appendTo(contentDiv);

                if (v.require == 0)
                    textArea.addClass("v_required");

            } else if (v.type == constant.customer().survey.TYPE_SINGLE_INT) {

                var radioDivAll = $('<div class="col-sm-9 control-group"></div>').prop('id', 'form-field-checkbox' + v.spiid).appendTo(contentDiv);

                if (v.require == 0)
                    radioDivAll.addClass("v_radio");

                $.each(v.options, function(j, option) {

                    elect(radioDivAll, option, type, state);
                });
            } else if (v.type == constant.customer().survey.TYPE_MULTIPLE_INT) {

                var checkDivAll = $('<div class="col-sm-9 control-group"></div>').prop('id', 'form-field-checkbox' + v.spiid).appendTo(contentDiv);

                if (v.require == 0)
                    checkDivAll.addClass("v_checkbox");

                $.each(v.options, function(j, option) {

                    elect(checkDivAll, option, type, state);
                });
            }
        });

        $("<hr/>").addClass("hr hr32 hr-dotted").appendTo(salesProfileDetail.items.itemlist)

        salesProfileDetail.profileItems = salesProfileDetail.profileItems.concat(profile.items);
    }

    function handle() {

        var $execute = $('<div id="exDiv"></div>').appendTo(salesProfileDetail.items.particulars);

        var handleBtn = $('<button class="btn btn-minier btn-primary pull-right" style="margin-right: 10px" type="button" id="execute">执行</button>').appendTo($execute);
        var addBtn = $('<button class="btn btn-minier btn-primary pull-right" style="margin-right: 10px" type="button" id="execute">添加</button>').appendTo($execute);
        var updateBtn = $('<button class="btn btn-minier btn-primary pull-right" style="margin-right: 10px" type="button" id="updateBtn">补录</button>').appendTo($execute);
        var printBtn= $('<button class="btn btn-minier btn-primary pull-right btn-pink" style="margin-right: 10px" type="button" id="print‌">打印</button>').appendTo($execute);

        handleBtn.click(function() {

            if (com.validate("itemlist"))
                return false;

            var options = {
                "salesProfile.spid": salesProfileDetail.profile.spid
            };

            var items = com.focusPage(".item", "#itemlist");

            $.each(items, function(i, v) {

                var item = $(v);

                var spiid = item.attr("spiid");
                var type = item.attr("type");

                options["salesProfile.items[" + i + "].spiid"] = spiid;

                if (type == constant.customer().survey.TYPE_INPUT_INT) {

                    options["salesProfile.items[" + i + "].content"] = com.focusPage("#" + spiid + "textarea").val();
                }

                if (type == constant.customer().survey.TYPE_SINGLE_INT) {

                    var soptions = item.find("input[type='radio']");

                    $.each(soptions, function(k, n) {

                        var subt = $(n);
                        var spoid = subt.attr("spoid");

                        if (subt.prop("checked")) {
                            options["salesProfile.items[" + i + "].options[" + k + "].spoid"] = spoid;
                            options["salesProfile.items[" + i + "].options[" + k + "].checked"] = 0;
                        } else {
                            options["salesProfile.items[" + i + "].options[" + k + "].spoid"] = spoid;
                            options["salesProfile.items[" + i + "].options[" + k + "].checked"] = 1;
                        }
                    });
                }

                if (type == constant.customer().survey.TYPE_MULTIPLE_INT) {

                    var soptions = item.find("input[type='checkbox']");

                    $.each(soptions, function(k, n) {

                        var subt = $(n);
                        var spoid = subt.attr("spoid");

                        if (subt.prop("checked")) {
                            options["salesProfile.items[" + i + "].options[" + k + "].spoid"] = spoid;
                            options["salesProfile.items[" + i + "].options[" + k + "].checked"] = 0;
                        } else {
                            options["salesProfile.items[" + i + "].options[" + k + "].spoid"] = spoid;
                            options["salesProfile.items[" + i + "].options[" + k + "].checked"] = 1;
                        }
                    });
                }
            });

            com.showConfirm("是否提交满意度", function() {

                com.post(api.sales.handleSalesProfile, options, function(res) {

                    com.focusPage("#itemlist").html("");
                    setTimeout(function() {

                        init();
                        show();
                    }, 500);
                });
            });
        });

        printBtn.click(function() {

            params.salesProfile = salesProfileDetail.profile;
            params.sid = salesProfileDetail.sid;
            com.popup("主材销售满意度", api.index.salesProfile2print.url, null, null, true);
        });

        addBtn.click(function() {

            salesProfileDetail.modals.addBrandModal.modal("show");
        });

        updateBtn.click(function() {

            var options = {
                "salesProfile.spid": salesProfileDetail.profile.spid,
                "salesProfile.orderId": salesProfileDetail.items.orderId.val()
            };

            com.post(api.sales.updateSalesProfileBrand, options, function(res) {

                com.showAlert(com.info, "操作成功");
                com.focusPage("#itemlist").html("");
                setTimeout(function() {

                    init();
                    show();
                }, 500);
            });
        });

    }

    function elect(contentDiv, option, type, status) {

        var ridioDiv = $('<div></div>').addClass(option.bid != 0 ? "col-sm-2" : "col-sm-4").appendTo(contentDiv);
        var div = $('<div></div>').addClass("").appendTo(ridioDiv);
        var label = $('<label  class="label-text"></label>').appendTo(div);

        var input = $('<input class="ace">').attr({
            'name': 'form-field-checkbox' + option.spiid,
            "spoid": option.spoid
        }).appendTo(label);

        if (type == constant.customer().survey.TYPE_SINGLE_INT) {
            input.prop({
                'type': 'radio'
            })
        } else if (type == constant.customer().survey.TYPE_MULTIPLE_INT) {
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

    com.focusPage('#makeSurvey').on("click", function() {

        salesProfileDetail.modals.makeProfileModal.modal("show");
    });

    function save() {

        if (com.validate('makeProfileModal'))
            return false;

        var tid = com.typeahead("surveyTemplate");
        var options = {
            "salesProfile.orderId": salesProfileDetail.items.orderId.val(),
            "salesProfile.tid": tid,
        };

        com.post(api.sales.makeSalesProfile, options, function(res) {

            salesProfile.items.orderId.val("");
            salesProfile.items.surveyTemplate.val("");

        });

        salesProfileDetail.modals.makeProfileModal.modal("hide");
    }

    com.focusPage('#saveBrandBtn').click(function() {

        var options = {
            "salesProfile.spid": salesProfileDetail.profile.spid,
            "salesProfile.bid": salesProfileDetail.bid,
        };

        com.post(api.sales.addSalesProfileBrand, options, function(res) {

            salesProfileDetail.modals.addBrandModal.modal("hide");
            com.focusPage("#itemlist").html("");
            setTimeout(function() {

                init();
                show();
            }, 500);

        });

    });

});