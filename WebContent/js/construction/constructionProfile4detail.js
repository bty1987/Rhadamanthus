jQuery(function($) {

    var constructionProfileDetail = {

        btns: {
        },
        modals: {
            constructionProfileDetailModal: com.focusPage("#constructionProfileDetailModal")
        },
        items: {
            itemlist: com.focusPage("#itemlist", "#constructionProfileDetailModal"),
            name: com.focusPage("#name", "#constructionProfileDetailModal"),
            content: com.focusPage("#content", "#constructionProfileDetailModal"),
            title: com.focusPage("#title", "#constructionProfileDetailModal"),
            particulars: com.focusPage("#particulars", "#constructionProfileDetailModal")
        },

        profiles: [],
        profileItems: []
    };

    com.focusPage('#btnBack').on("click", function() {

        constructionProfileDetail.modals.constructionProfileDetailModal.modal("hide");

        com.closePopup();
    });

    show();
    handle();

    function show() {

        var url = null;
        var args = null;

        if (params.constructionProfile.cpid) {
            url = api.construction.queryConstructionProfileByCpid;
            args = {
                "constructionProfile.cpid": params.constructionProfile.cpid
            }
        }

        if (params.constructionProfile.cid) {
            url = api.construction.queryConstructionProfileByCid;
            args = {
                "constructionProfile.cid": params.constructionProfile.cid,
                "constructionProfile.type": params.constructionProfile.type,
            }
        }

        if (params.constructionProfile.orderId) {
            url = api.construction.queryConstructionProfileByOrderId;
            args = {
                "constructionProfile.orderId": params.constructionProfile.orderId,
                "constructionProfile.type": params.constructionProfile.type,
            }
        }

        if (!url) {
            com.closePopup();
            return false
        }

        var isMake = true;

        com.post(url, args, function(res) {

            if (res.constructionProfiles && res.constructionProfiles.length != 0)
                constructionProfileDetail.profiles = constructionProfileDetail.profiles.concat(res.constructionProfiles);

            if (res.constructionProfile && res.constructionProfile.items)
                constructionProfileDetail.profiles.push(res.constructionProfile)

            $.each(constructionProfileDetail.profiles, function(i, v) {

                display(v);

                if (v.type == params.constructionProfile.profile.type)
                    isMake = false;
            });

        }, null, false);

        if (!isMake)
            return false;

        if (!params.constructionProfile || !params.constructionProfile.profile) {
            com.showAlert(com.warning, "缺少配置参数");
            com.closePopup();
            return false;
        }

        var template = null;

        // 根据用途 type 选择对应的模板配置 key: 标签(type=4)用独立模板, 其他复用通用模板
        var templateKey = params.constructionProfile.profile.type == 4 ? "CONSTRUCTION_TAG_PROFILE_TEMPLATE" : "CONSTRUCTION_PROFILE_TEMPLATE";

        com.post(api.system.querySystemConfigByKey, {
            "systemConfig.key": templateKey
        }, function(res) {

            template = res.systemConfig.value;
        }, null, false);

        if (!template) {
            com.showAlert(com.error, "工程配置模板不存在");
            com.closePopup();
            return false;
        }

        args["constructionProfile.tid"] = template;
        args["constructionProfile.type"] = params.constructionProfile.profile.type;

        com.post(api.construction.makeConstructionProfile, args, function(res) {

            args["constructionProfile.cpid"] = res.constructionProfile.cpid;
        }, null, false);

        com.post(api.construction.queryConstructionProfileByCpid, args, function(res) {

            display(res.constructionProfile);
        }, null, false);
    }

    function display(profile) {

        constructionProfileDetail.items.name.html(profile.name);

        var state = profile.status;

        $.each(profile.items, function(i, v) {

            if (v.type != constant.customer().survey.TYPE_TEXT_INT) {
                var contentDiv = $('<div class="col-md-6 hr8" style="display: flex;"></div>').addClass("item").attr("id", v.cpiid).attr("cpiid", v.cpiid).attr("type", v.type).appendTo(constructionProfileDetail.items.itemlist);
                var titleSpan = $('<span class="label-text col-sm-3"></span>').html(v.name).appendTo(contentDiv);

                if (v.require == 0)
                    titleSpan.addClass("orange");
            }

            var type = v.type;

            if (v.type == constant.customer().survey.TYPE_TEXT_INT) {
                constructionProfileDetail.items.title.html(v.content);
            } else if (v.type == constant.customer().survey.TYPE_INPUT_INT) {

                var textArea = $('<textarea class="col-sm-9 text "></textarea>').prop('id', v.cpiid + "textarea").html(v.content).appendTo(contentDiv);

                if (v.require == 0)
                    textArea.addClass("v_required");

            } else if (v.type == constant.customer().survey.TYPE_SINGLE_INT) {

                var radioDivAll = $('<div class="col-sm-9 control-group"></div>').prop('id', 'form-field-checkbox' + v.cpiid).appendTo(contentDiv);

                if (v.require == 0)
                    radioDivAll.addClass("v_radio");

                $.each(v.options, function(j, option) {

                    elect(radioDivAll, option, type, state);
                });
            } else if (v.type == constant.customer().survey.TYPE_MULTIPLE_INT) {

                var checkDivAll = $('<div class="col-sm-9 control-group"></div>').prop('id', 'form-field-checkbox' + v.cpiid).appendTo(contentDiv);

                if (v.require == 0)
                    checkDivAll.addClass("v_checkbox");

                $.each(v.options, function(j, option) {

                    elect(checkDivAll, option, type, state);
                });
            } else if (v.type == constant.customer().survey.TYPE_DATE_INT) {

                var inputdate = $('<input type="text" readonly="readonly" data-type="dateRangePicker">').prop('id', v.cpiid + "date").html(v.content).appendTo(contentDiv);

                com.datetime(inputdate);

                if (v.require == 0)
                    inputdate.addClass("v_required");
            }
        });

        $("<hr/>").addClass("hr hr32 hr-dotted").appendTo(constructionProfileDetail.items.itemlist)

        constructionProfileDetail.profileItems = constructionProfileDetail.profileItems.concat(profile.items);
    }

    function handle() {

        var $execute = $('<div id="exDiv"></div>').appendTo(constructionProfileDetail.items.particulars);
        var $button = $('<button class="btn btn-primary pull-right" type="button" id="execute">保存</button>').appendTo($execute);

        com.focusPage("#execute", "#constructionProfileDetailModal").click(function() {

            if (com.validate("itemlist"))
                return false;

            var options = {};

            var items = com.focusPage(".item", "#itemlist");

            $.each(items, function(i, v) {

                var item = $(v);

                var cpiid = item.attr("cpiid");
                var type = item.attr("type");

                options["constructionProfile.items[" + i + "].cpiid"] = cpiid;

                if (type == constant.customer().survey.TYPE_INPUT_INT) {
                    options["constructionProfile.items[" + i + "].content"] = com.focusPage("#" + cpiid + "textarea").val();
                }

                if (type == constant.customer().survey.TYPE_DATE_INT) {
                    options["constructionProfile.items[" + i + "].content"] = com.focusPage("#" + cpiid + "date").val();
                }

                if (type == constant.customer().survey.TYPE_SINGLE_INT) {

                    var soptions = item.find("input[type='radio']");

                    $.each(soptions, function(k, n) {

                        var subt = $(n);
                        var cpoid = subt.attr("cpoid");

                        if (subt.prop("checked")) {
                            options["constructionProfile.items[" + i + "].options[" + k + "].cpoid"] = cpoid;
                            options["constructionProfile.items[" + i + "].options[" + k + "].checked"] = 0;
                        } else {
                            options["constructionProfile.items[" + i + "].options[" + k + "].cpoid"] = cpoid;
                            options["constructionProfile.items[" + i + "].options[" + k + "].checked"] = 1;
                        }
                    });
                }

                if (type == constant.customer().survey.TYPE_MULTIPLE_INT) {

                    var soptions = item.find("input[type='checkbox']");

                    $.each(soptions, function(k, n) {

                        var subt = $(n);
                        var cpoid = subt.attr("cpoid");

                        if (subt.prop("checked")) {
                            options["constructionProfile.items[" + i + "].options[" + k + "].cpoid"] = cpoid;
                            options["constructionProfile.items[" + i + "].options[" + k + "].checked"] = 0;
                        } else {
                            options["constructionProfile.items[" + i + "].options[" + k + "].cpoid"] = cpoid;
                            options["constructionProfile.items[" + i + "].options[" + k + "].checked"] = 1;
                        }
                    });
                }
            });

            com.showConfirm("是否提交工程配置信息?", function() {

                com.post(api.construction.handleConstructionProfile, options, function(res) {

                    com.showAlert(com.info, '工程配置提交成功');
                });
            });
        });
    }

    function elect(contentDiv, option, type, status) {

        var ridioDiv = $('<div class="col-sm-4"></div>').appendTo(contentDiv);
        var div = $('<div></div>').addClass("").appendTo(ridioDiv);
        var label = $('<label  class="label-text"></label>').appendTo(div);

        var input = $('<input class="ace">').attr({
            'name': 'form-field-checkbox' + option.cpiid,
            "cpoid": option.cpoid
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
