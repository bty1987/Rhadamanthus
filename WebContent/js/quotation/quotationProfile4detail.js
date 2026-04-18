jQuery(function($) {

    var quotationProfileDetail = {

        btns: {
        },
        modals: {
            quotationProfileDetailModal: com.focusPage("#quotationProfileDetailModal")
        },
        items: {
            itemlist: com.focusPage("#itemlist", "#quotationProfileDetailModal"),
            name: com.focusPage("#name", "#quotationProfileDetailModal"),
            content: com.focusPage("#content", "#quotationProfileDetailModal"),
            title: com.focusPage("#title", "#quotationProfileDetailModal"),
            particulars: com.focusPage("#particulars", "#quotationProfileDetailModal")
        },

        profiles: [],
        profileItems: []
    };

    com.focusPage('#btnBack').on("click", function() {

        quotationProfileDetail.modals.quotationProfileDetailModal.modal("hide");

        com.closePopup();
    });

    show();
    handle();

    function show() {

        var url = null;
        var args = null;

        if (params.quotation.qpid) {
            url = api.quotation.queryQuotationProfileByQpid;
            args = {
                "quotationProfile.qpid": params.quotation.qpid
            }
        }

        if (params.quotation.qid) {
            url = api.quotation.queryQuotationProfileByQid;
            args = {
                "quotationProfile.qid": params.quotation.qid,
                "quotationProfile.type": params.quotation.type,
            }
        }

        if (params.quotation.orderId) {
            url = api.quotation.queryQuotationProfileByOrderId;
            args = {
                "quotationProfile.orderId": params.quotation.orderId,
            }
        }

        if (!url)
            return false

        var isMake = true;

        com.post(url, args, function(res) {

            if (res.quotationProfiles && res.quotationProfiles.length != 0)
                quotationProfileDetail.profiles = quotationProfileDetail.profiles.concat(res.quotationProfiles);

            if (res.quotationProfile && res.quotationProfile.items)
                quotationProfileDetail.profiles.push(res.quotationProfile)

            $.each(quotationProfileDetail.profiles, function(i, v) {

                display(v);

                if (v.type == params.quotation.profile.type)
                    isMake = false;
            });

        }, null, false);

        if (!isMake)
            return false;

        if (!params.quotation || !params.quotation.profile)
            return false;

        var template = null;

        com.post(api.system.querySystemConfigByKey, {
            "systemConfig.key": "QUOTATION_PROFILE_TEMPLATE_" + params.quotation.profile.type
        }, function(res) {

            template = res.systemConfig.value;
        }, null, false);

        if (!template) {
            com.showAlert(com.error, "报价配置模板不存在");
            return false;
        }

        args["quotationProfile.tid"] = template;
        args["quotationProfile.type"] = params.quotation.profile.type;

        com.post(api.quotation.makeQuotationProfile, args, function(res) {

            args["quotationProfile.qpid"] = res.quotationProfile.qpid;
        }, null, false);

        com.post(api.quotation.queryQuotationProfileByQpid, args, function(res) {

            display(res.quotationProfile);
        }, null, false);
    }

    function display(profile) {

        quotationProfileDetail.items.name.html(profile.name);

        var state = profile.status;

        $.each(profile.items, function(i, v) {

            if (v.type != constant.customer().survey.TYPE_TEXT_INT) {
                var contentDiv = $('<div class="col-md-6 hr8" style="display: flex;"></div>').addClass("item").attr("id", v.qpiid).attr("qpiid", v.qpiid).attr("type", v.type).appendTo(quotationProfileDetail.items.itemlist);
                var titleSpan = $('<span class="label-text col-sm-3"></span>').html(v.name).appendTo(contentDiv);

                if (v.require == 0)
                    titleSpan.addClass("orange");
            }

            var type = v.type;

            if (v.type == constant.customer().survey.TYPE_TEXT_INT) {
                quotationProfileDetail.items.title.html(v.content);
            } else if (v.type == constant.customer().survey.TYPE_INPUT_INT) {

                var textArea = $('<textarea class="col-sm-9 text "></textarea>').prop('id', v.qpiid + "textarea").html(v.content).appendTo(contentDiv);

                if (v.require == 0)
                    textArea.addClass("v_required");

            } else if (v.type == constant.customer().survey.TYPE_SINGLE_INT) {

                var radioDivAll = $('<div class="col-sm-9 control-group"></div>').prop('id', 'form-field-checkbox' + v.qpiid).appendTo(contentDiv);

                if (v.require == 0)
                    radioDivAll.addClass("v_radio");

                $.each(v.options, function(j, option) {

                    elect(radioDivAll, option, type, state);
                });
            } else if (v.type == constant.customer().survey.TYPE_MULTIPLE_INT) {

                var checkDivAll = $('<div class="col-sm-9 control-group"></div>').prop('id', 'form-field-checkbox' + v.qpiid).appendTo(contentDiv);

                if (v.require == 0)
                    checkDivAll.addClass("v_checkbox");

                $.each(v.options, function(j, option) {

                    elect(checkDivAll, option, type, state);
                });
            } else if (v.type == constant.customer().survey.TYPE_DATE_INT) {

                var inputdate = $('<input type="text" readonly="readonly" data-type="dateRangePicker">').prop('id', v.qpiid + "date").html(v.content).appendTo(contentDiv);

                com.datetime(inputdate);

                if (v.require == 0)
                    inputdate.addClass("v_required");
            }
        });

        $("<hr/>").addClass("hr hr32 hr-dotted").appendTo(quotationProfileDetail.items.itemlist)

        quotationProfileDetail.profileItems = quotationProfileDetail.profileItems.concat(profile.items);
    }

    function handle() {

        var $execute = $('<div id="exDiv"></div>').appendTo(quotationProfileDetail.items.particulars);
        var $button = $('<button class="btn btn-primary pull-right" type="button" id="execute">保存</button>').appendTo($execute);

        com.focusPage("#execute", "#quotationProfileDetailModal").click(function() {

            if (com.validate("itemlist"))
                return false;

            var options = {};

            var items = com.focusPage(".item", "#itemlist");

            $.each(items, function(i, v) {

                var item = $(v);

                var qpiid = item.attr("qpiid");
                var type = item.attr("type");

                options["quotationProfile.items[" + i + "].qpiid"] = qpiid;

                if (type == constant.customer().survey.TYPE_INPUT_INT) {
                    options["quotationProfile.items[" + i + "].content"] = com.focusPage("#" + qpiid + "textarea").val();
                }
                
                if (type == constant.customer().survey.TYPE_DATE_INT) {
                    options["quotationProfile.items[" + i + "].content"] = com.focusPage("#" + qpiid + "date").val();
                }

                if (type == constant.customer().survey.TYPE_SINGLE_INT) {

                    var soptions = item.find("input[type='radio']");

                    $.each(soptions, function(k, n) {

                        var subt = $(n);
                        var qpoid = subt.attr("qpoid");

                        if (subt.prop("checked")) {
                            options["quotationProfile.items[" + i + "].options[" + k + "].qpoid"] = qpoid;
                            options["quotationProfile.items[" + i + "].options[" + k + "].checked"] = 0;
                        } else {
                            options["quotationProfile.items[" + i + "].options[" + k + "].qpoid"] = qpoid;
                            options["quotationProfile.items[" + i + "].options[" + k + "].checked"] = 1;
                        }
                    });
                }

                if (type == constant.customer().survey.TYPE_MULTIPLE_INT) {

                    var soptions = item.find("input[type='checkbox']");

                    $.each(soptions, function(k, n) {

                        var subt = $(n);
                        var qpoid = subt.attr("qpoid");

                        if (subt.prop("checked")) {
                            options["quotationProfile.items[" + i + "].options[" + k + "].qpoid"] = qpoid;
                            options["quotationProfile.items[" + i + "].options[" + k + "].checked"] = 0;
                        } else {
                            options["quotationProfile.items[" + i + "].options[" + k + "].qpoid"] = qpoid;
                            options["quotationProfile.items[" + i + "].options[" + k + "].checked"] = 1;
                        }
                    });
                }
            });

            com.showConfirm("是否提交报价配置信息", function() {

                com.post(api.quotation.handleQuotationProfile, options);
            });
        });
    }

    function elect(contentDiv, option, type, status) {

        var ridioDiv = $('<div class="col-sm-4"></div>').appendTo(contentDiv);
        var div = $('<div></div>').addClass("").appendTo(ridioDiv);
        var label = $('<label  class="label-text"></label>').appendTo(div);

        var input = $('<input class="ace">').attr({
            'name': 'form-field-checkbox' + option.qpiid,
            "qpoid": option.qpoid
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

});
