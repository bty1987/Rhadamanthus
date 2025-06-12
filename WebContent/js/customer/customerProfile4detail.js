jQuery(function($) {

    var customerProfileDetail = {

        btns: {
        // save: com.focusPage("#saveSurvey").on("click", save)
        },
        modals: {
            customerProfileDetailModal: com.focusPage("#customerProfileDetailModal")
        },
        items: {
            itemlist: com.focusPage("#itemlist", "#customerProfileDetailModal"),
            name: com.focusPage("#name", "#customerProfileDetailModal"),
            content: com.focusPage("#content", "#customerProfileDetailModal"),
            title: com.focusPage("#title", "#customerProfileDetailModal"),
            particulars: com.focusPage("#particulars", "#customerProfileDetailModal")
        },

        profiles: [],
        profileItems: []
    };

    com.focusPage('#btnBack').on("click", function() {

        customerProfileDetail.modals.customerProfileDetailModal.modal("hide");

        com.closePopup();
    });

    show();
    handle();

    function show() {

        var url = null;
        var args = null;

        if (params.customer.cpid) {
            url = api.customer.queryCustomerProfileByCpid;
            args = {
                "customerProfile.cpid": params.customer.cpid
            }
        }

        if (params.customer.csid) {
            url = api.customer.queryCustomerProfileByCsid;
            args = {
                "customerProfile.csid": params.customer.csid,
                "customerProfile.type": params.customer.type,
            }
        }

        if (params.customer.cid) {
            url = api.customer.queryCustomerProfileByCid;
            args = {
                "customerProfile.cid": params.customer.cid,
                "customerProfile.type": params.customer.type,
            }
        }

        if (params.decoration.orderId) {
            url = api.customer.queryCustomerProfileByOrderId;
            args = {
                "customerProfile.orderId": params.decoration.orderId,
                "customerProfile.type": params.customer.type,
            }
        }

        if (!url)
            return false

        var isMake = true;

        com.post(url, args, function(res) {

            if (res.customerProfiles && res.customerProfiles.length != 0)
                customerProfileDetail.profiles = customerProfileDetail.profiles.concat(res.customerProfiles);

            if (res.customerProfile && res.customerProfile.items)
                customerProfileDetail.profiles.push(res.customerProfile)

            $.each(customerProfileDetail.profiles, function(i, v) {

                display(v);

                if (v.type == params.customer.profile.type)
                    isMake = false;
            });

        }, null, false);

        if (!isMake)
            return false;

        if (!params.customer || !params.customer.profile)
            return false;

        var template = null;

        com.post(api.system.querySystemConfigByKey, {
            "systemConfig.key": "CUSTOMER_PROFILE_TEMPLATE_" + params.customer.profile.type
        }, function(res) {

            template = res.systemConfig.value;
        }, null, false);

        if (!template) {
            com.showAlert(com.error, "客户画像模板不存在");
            return false;
        }

        args["customerProfile.tid"] = template;
        args["customerProfile.type"] = params.customer.profile.type;

        com.post(api.customer.makeCustomerProfile, args, function(res) {

            args["customerProfile.cpid"] = res.customerProfile.cpid;
        }, null, false);

        com.post(api.customer.queryCustomerProfileByCpid, args, function(res) {

            display(res.customerProfile);
        }, null, false);
    }

    function display(profile) {

        customerProfileDetail.items.name.html(profile.name);

        var state = profile.status;

        $.each(profile.items, function(i, v) {

            if (v.type != constant.customer().survey.TYPE_TEXT_INT) {
                var contentDiv = $('<div class="col-md-6 hr8" style="display: flex;"></div>').addClass("item").attr("id", v.cpiid).attr("cpiid", v.cpiid).attr("type", v.type).appendTo(customerProfileDetail.items.itemlist);
                var titleSpan = $('<span class="label-text col-sm-3"></span>').html(v.name).appendTo(contentDiv);

                if (v.require == 0)
                    titleSpan.addClass("orange");
            }

            var type = v.type;

            if (v.type == constant.customer().survey.TYPE_TEXT_INT) {
                customerProfileDetail.items.title.html(v.content);
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
            }
        });

        $("<hr/>").addClass("hr hr32 hr-dotted").appendTo(customerProfileDetail.items.itemlist)

        customerProfileDetail.profileItems = customerProfileDetail.profileItems.concat(profile.items);
    }

    function handle() {

        var $execute = $('<div id="exDiv"></div>').appendTo(customerProfileDetail.items.particulars);
        var $button = $('<button class="btn btn-primary pull-right" type="button" id="execute">执行</button>').appendTo($execute);

        com.focusPage("#execute", "#customerProfileDetailModal").click(function() {

            if (com.validate("itemlist"))
                return false;

            var options = {
                "customerProfile.cpid": 0
            };

            var items = com.focusPage(".item", "#itemlist");

            $.each(items, function(i, v) {

                var item = $(v);

                var cpiid = item.attr("cpiid");
                var type = item.attr("type");

                options["customerProfile.items[" + i + "].cpiid"] = cpiid;

                if (type == constant.customer().survey.TYPE_INPUT_INT) {

                    options["customerProfile.items[" + i + "].content"] = com.focusPage("#" + cpiid + "textarea").val();
                }

                if (type == constant.customer().survey.TYPE_SINGLE_INT) {

                    var soptions = item.find("input[type='radio']");

                    $.each(soptions, function(k, n) {

                        var subt = $(n);
                        var cpoid = subt.attr("cpoid");

                        if (subt.prop("checked")) {
                            options["customerProfile.items[" + i + "].options[" + k + "].cpoid"] = cpoid;
                            options["customerProfile.items[" + i + "].options[" + k + "].checked"] = 0;
                        } else {
                            options["customerProfile.items[" + i + "].options[" + k + "].cpoid"] = cpoid;
                            options["customerProfile.items[" + i + "].options[" + k + "].checked"] = 1;
                        }
                    });
                }

                if (type == constant.customer().survey.TYPE_MULTIPLE_INT) {

                    var soptions = item.find("input[type='checkbox']");

                    $.each(soptions, function(k, n) {

                        var subt = $(n);
                        var cpoid = subt.attr("cpoid");

                        if (subt.prop("checked")) {
                            options["customerProfile.items[" + i + "].options[" + k + "].cpoid"] = cpoid;
                            options["customerProfile.items[" + i + "].options[" + k + "].checked"] = 0;
                        } else {
                            options["customerProfile.items[" + i + "].options[" + k + "].cpoid"] = cpoid;
                            options["customerProfile.items[" + i + "].options[" + k + "].checked"] = 1;
                        }
                    });
                }
            });

            com.showConfirm("是否提交客户画像信息", function() {

                com.post(api.customer.handleCustomerProfile, options);
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