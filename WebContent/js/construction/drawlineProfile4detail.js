jQuery(function($) {

    var drawlineProfileDetail = {

        btns: {
        },
        modals: {
            drawlineProfileDetailModal: com.focusPage("#drawlineProfileDetailModal")
        },
        items: {
            itemlist: com.focusPage("#itemlist", "#drawlineProfileDetailModal"),
            name: com.focusPage("#name", "#drawlineProfileDetailModal"),
            content: com.focusPage("#content", "#drawlineProfileDetailModal"),
            title: com.focusPage("#title", "#drawlineProfileDetailModal"),
            particulars: com.focusPage("#particulars", "#drawlineProfileDetailModal")
        },

        profiles: [],
        profileItems: []
    };

    com.focusPage('#btnBack').on("click", function() {

        drawlineProfileDetail.modals.drawlineProfileDetailModal.modal("hide");

        com.closePopup();
    });

    show();
    handle();

    function show() {

        var url = null;
        var args = null;

        if (params.drawlineProfile.dpid) {
            url = api.construction.queryDrawlineProfileByDpid;
            args = {
                "drawlineProfile.dpid": params.drawlineProfile.dpid
            }
        }

        if (params.drawlineProfile.dlid) {
            url = api.construction.queryDrawlineProfileByDlid;
            args = {
                "drawlineProfile.dlid": params.drawlineProfile.dlid,
                "drawlineProfile.type": params.drawlineProfile.type,
            }
        }

        if (params.drawlineProfile.orderId) {
            url = api.construction.queryDrawlineProfileByOrderId;
            args = {
                "drawlineProfile.orderId": params.drawlineProfile.orderId,
                "drawlineProfile.type": params.drawlineProfile.type,
            }
        }

        if (!url) {
            return false
        }

        var isMake = true;

        com.post(url, args, function(res) {

            if (res.drawlineProfiles && res.drawlineProfiles.length != 0)
                drawlineProfileDetail.profiles = drawlineProfileDetail.profiles.concat(res.drawlineProfiles);

            if (res.drawlineProfile && res.drawlineProfile.items)
                drawlineProfileDetail.profiles.push(res.drawlineProfile)

            $.each(drawlineProfileDetail.profiles, function(i, v) {

                display(v);

                if (v.type == params.drawlineProfile.profile.type)
                    isMake = false;
            });

        }, null, false);

        if (!isMake)
            return false;

        if (!params.drawlineProfile || !params.drawlineProfile.profile) {
            com.showAlert(com.warning, "缺少配置参数");
            return false;
        }

        var template = null;

        // 根据用途 type 选择对应的模板配置 key: 标签(type=4)用独立模板, 其他复用通用模板
        var templateKey = params.drawlineProfile.profile.type == 4 ? "DRAWLINE_TAG_PROFILE_TEMPLATE" : "DRAWLINE_PROFILE_TEMPLATE";

        com.post(api.system.querySystemConfigByKey, {
            "systemConfig.key": templateKey
        }, function(res) {

            template = res.systemConfig.value;
        }, null, false);

        if (!template) {
            com.showAlert(com.error, "放线配置模板不存在");
            return false;
        }

        args["drawlineProfile.tid"] = template;
        args["drawlineProfile.type"] = params.drawlineProfile.profile.type;

        com.post(api.construction.makeDrawlineProfile, args, function(res) {

            args["drawlineProfile.dpid"] = res.drawlineProfile.dpid;
        }, null, false);

        com.post(api.construction.queryDrawlineProfileByDpid, args, function(res) {

            display(res.drawlineProfile);
        }, null, false);
    }

    function display(profile) {

        drawlineProfileDetail.items.name.html(profile.name);

        var state = profile.status;

        $.each(profile.items, function(i, v) {

            if (v.type != constant.customer().survey.TYPE_TEXT_INT) {
                var contentDiv = $('<div class="col-md-6 hr8" style="display: flex;"></div>').addClass("item").attr("id", v.dpiid).attr("dpiid", v.dpiid).attr("type", v.type).appendTo(drawlineProfileDetail.items.itemlist);
                var titleSpan = $('<span class="label-text col-sm-3"></span>').html(v.name).appendTo(contentDiv);

                if (v.require == 0)
                    titleSpan.addClass("orange");
            }

            var type = v.type;

            if (v.type == constant.customer().survey.TYPE_TEXT_INT) {
                drawlineProfileDetail.items.title.html(v.content);
            } else if (v.type == constant.customer().survey.TYPE_INPUT_INT) {

                var textArea = $('<textarea class="col-sm-9 text "></textarea>').prop('id', v.dpiid + "textarea").html(v.content).appendTo(contentDiv);

                if (v.require == 0)
                    textArea.addClass("v_required");

            } else if (v.type == constant.customer().survey.TYPE_SINGLE_INT) {

                var radioDivAll = $('<div class="col-sm-9 control-group"></div>').prop('id', 'form-field-checkbox' + v.dpiid).appendTo(contentDiv);

                if (v.require == 0)
                    radioDivAll.addClass("v_radio");

                $.each(v.options, function(j, option) {

                    elect(radioDivAll, option, type, state);
                });
            } else if (v.type == constant.customer().survey.TYPE_MULTIPLE_INT) {

                var checkDivAll = $('<div class="col-sm-9 control-group"></div>').prop('id', 'form-field-checkbox' + v.dpiid).appendTo(contentDiv);

                if (v.require == 0)
                    checkDivAll.addClass("v_checkbox");

                $.each(v.options, function(j, option) {

                    elect(checkDivAll, option, type, state);
                });
            } else if (v.type == constant.customer().survey.TYPE_DATE_INT) {

                var inputdate = $('<input type="text" readonly="readonly" data-type="dateRangePicker">').prop('id', v.dpiid + "date").html(v.content).appendTo(contentDiv);

                com.datetime(inputdate);

                if (v.require == 0)
                    inputdate.addClass("v_required");
            }
        });

        $("<hr/>").addClass("hr hr32 hr-dotted").appendTo(drawlineProfileDetail.items.itemlist)

        drawlineProfileDetail.profileItems = drawlineProfileDetail.profileItems.concat(profile.items);
    }

    function handle() {

        var $execute = $('<div id="exDiv"></div>').appendTo(drawlineProfileDetail.items.particulars);
        var $button = $('<button class="btn btn-primary pull-right" type="button" id="execute">保存</button>').appendTo($execute);

        com.focusPage("#execute", "#drawlineProfileDetailModal").click(function() {

            if (com.validate("itemlist"))
                return false;

            var options = {};

            var items = com.focusPage(".item", "#itemlist");

            $.each(items, function(i, v) {

                var item = $(v);

                var dpiid = item.attr("dpiid");
                var type = item.attr("type");

                options["drawlineProfile.items[" + i + "].dpiid"] = dpiid;

                if (type == constant.customer().survey.TYPE_INPUT_INT) {
                    options["drawlineProfile.items[" + i + "].content"] = com.focusPage("#" + dpiid + "textarea").val();
                }

                if (type == constant.customer().survey.TYPE_DATE_INT) {
                    options["drawlineProfile.items[" + i + "].content"] = com.focusPage("#" + dpiid + "date").val();
                }

                if (type == constant.customer().survey.TYPE_SINGLE_INT) {

                    var soptions = item.find("input[type='radio']");

                    $.each(soptions, function(k, n) {

                        var subt = $(n);
                        var dpoid = subt.attr("dpoid");

                        if (subt.prop("checked")) {
                            options["drawlineProfile.items[" + i + "].options[" + k + "].dpoid"] = dpoid;
                            options["drawlineProfile.items[" + i + "].options[" + k + "].checked"] = 0;
                        } else {
                            options["drawlineProfile.items[" + i + "].options[" + k + "].dpoid"] = dpoid;
                            options["drawlineProfile.items[" + i + "].options[" + k + "].checked"] = 1;
                        }
                    });
                }

                if (type == constant.customer().survey.TYPE_MULTIPLE_INT) {

                    var soptions = item.find("input[type='checkbox']");

                    $.each(soptions, function(k, n) {

                        var subt = $(n);
                        var dpoid = subt.attr("dpoid");

                        if (subt.prop("checked")) {
                            options["drawlineProfile.items[" + i + "].options[" + k + "].dpoid"] = dpoid;
                            options["drawlineProfile.items[" + i + "].options[" + k + "].checked"] = 0;
                        } else {
                            options["drawlineProfile.items[" + i + "].options[" + k + "].dpoid"] = dpoid;
                            options["drawlineProfile.items[" + i + "].options[" + k + "].checked"] = 1;
                        }
                    });
                }
            });

            com.showConfirm("是否提交放线配置信息?", function() {

                com.post(api.construction.handleDrawlineProfile, options, function(res) {

                    com.showAlert(com.info, '放线配置提交成功');
                });
            });
        });
    }

    function elect(contentDiv, option, type, status) {

        var ridioDiv = $('<div class="col-sm-4"></div>').appendTo(contentDiv);
        var div = $('<div></div>').addClass("").appendTo(ridioDiv);
        var label = $('<label  class="label-text"></label>').appendTo(div);

        var input = $('<input class="ace">').attr({
            'name': 'form-field-checkbox' + option.dpiid,
            "dpoid": option.dpoid
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
