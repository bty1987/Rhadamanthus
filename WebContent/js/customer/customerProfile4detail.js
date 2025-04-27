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
    };

    show(customerProfileDetail.cpid);

    function show(cpid) {

        var url = null;
        var args = null;

        if (params.customer.cpid) {
            url = api.customer.queryCustomerProfileByCpid;
            args = {
                "customerProfile.cpid": params.customer.cpid
            }
        }

        if (params.customer.cid) {
            url = api.customer.queryCustomerProfileByCid;
            args = {
                "customerProfile.cid": params.customer.cid
            }
        }

        if (params.decoration.orderId) {
            url = api.customer.queryCustomerProfileByOrderId;
            args = {
                "customerProfile.orderId": params.decoration.orderId
            }
        }
        
        if (!url)
            return false

        com.post(url, args, function(res) {

            customerProfileDetail.items.name.html(res.customerProfile.name);

            var state = res.customerProfile.status;

            $.each(res.customerProfile.items, function(i, v) {

                if (v.type != constant.customer().survey.TYPE_TEXT_INT) {
                    var contentDiv = $('<div class="col-md-6 hr8" style="display: flex;"></div>').appendTo(customerProfileDetail.items.itemlist);
                    var titleSpan = $('<span class="label-text col-sm-3 orange"></span>').html((i) + ". " + v.name).appendTo(contentDiv);
                }

                var type = v.type;

                if (v.type == constant.customer().survey.TYPE_TEXT_INT) {
                    customerProfileDetail.items.title.html(v.content);
                } else if (v.type == constant.customer().survey.TYPE_INPUT_INT) {

                    var textArea = $('<textarea class="col-sm-9 text "></textarea>').prop('id', v.cpiid + "textarea").html(v.content).appendTo(contentDiv);

                } else if (v.type == constant.customer().survey.TYPE_SINGLE_INT) {

                    var ridioDivAll = $('<div class="col-sm-9 control-group"></div>').prop('id', v.cpiid).appendTo(contentDiv);

                    $.each(v.options, function(j, option) {

                        elect(ridioDivAll, option, type, state);
                    });
                } else if (v.type == constant.customer().survey.TYPE_MULTIPLE_INT) {

                    var checkDivAll = $('<div class="col-sm-9 control-group"></div>').prop('id', v.cpiid).appendTo(contentDiv);

                    $.each(v.options, function(j, option) {

                        elect(checkDivAll, option, type, state);
                    });
                }

            });

            var $execute = $('<div id="exDiv"></div>').appendTo(customerProfileDetail.items.particulars);
            var $button = $('<button class="btn btn-primary pull-right" type="button" id="execute">执行</button>').appendTo($execute);

            com.focusPage("#execute", "#customerProfileDetailModal").click(function() {

                var options = {};

                options["customerProfile.cpid"] = res.customerProfile.cpid;

                $.each(res.customerProfile.items, function(i, v) {

                    if (v.type != constant.customer().survey.TYPE_TEXT_INT) {
                        options["customerProfile.items[" + i + "].cpiid"] = v.cpiid;
                        options["customerProfile.items[" + i + "].name"] = v.name;
                    }

                    if (v.type == constant.customer().survey.TYPE_TEXT_INT) {
                        options["customerProfile.items[" + i + "].cpiid"] = v.cpiid;
                        options["customerProfile.items[" + i + "].content"] = v.content;
                    } else if (v.type == constant.customer().survey.TYPE_INPUT_INT) {
                        options["customerProfile.items[" + i + "].cpiid"] = v.cpiid;
                        options["customerProfile.items[" + i + "].content"] = com.focusPage("#" + v.cpiid + "textarea").val();
                    }

                    if (v.options.length != 0) {
                        // 单选
                        if (v.type == constant.customer().survey.TYPE_SINGLE_INT) {

                            var checkbox = com.focusPage("input[type='radio']");
                            $.each(checkbox, function(k, n) {

                                if (k >= v.options.length) {
                                    return;
                                }
                                if ($(n).prop("checked")) {
                                    options["customerProfile.items[" + i + "].options[" + k + "].checked"] = 0;
                                } else {
                                    options["customerProfile.items[" + i + "].options[" + k + "].checked"] = 1;
                                }
                                $(n).remove()
                            });
                        } else {
                            // 多选
                            var checkboxs = com.focusPage("input[type='checkbox']");
                            $.each(checkboxs, function(k, n) {

                                if (k >= v.options.length) {
                                    return;
                                }
                                if ($(n).prop("checked")) {
                                    options["customerProfile.items[" + i + "].options[" + k + "].checked"] = 0;
                                } else {
                                    options["customerProfile.items[" + i + "].options[" + k + "].checked"] = 1;
                                }
                                $(n).remove()
                            });
                        }
                    }

                    $.each(v.options, function(j, b) {

                        options["customerProfile.items[" + i + "].cpiid"] = v.cpiid;

                        if (v.type == constant.customer().survey.TYPE_SINGLE_INT) {
                            options["customerProfile.items[" + i + "].options[" + j + "].cpoid"] = b.cpoid;
                            options["customerProfile.items[" + i + "].options[" + j + "].title"] = b.title;

                        } else if (v.type == constant.customer().survey.TYPE_MULTIPLE_INT) {
                            options["customerProfile.items[" + i + "].options[" + j + "].cpoid"] = b.cpoid;
                            options["customerProfile.items[" + i + "].options[" + j + "].title"] = b.title;
                        }
                    })
                });

                com.showConfirm("是否提交客户画像信息", function() {

                    com.post(api.customer.handleCustomerProfile, options, function() {

                        customerProfileDetail.modals.customerProfileDetailModal.modal("hide");
                        com.closePopup();
                        com.switchPage(api.index.customerprofile.url);
                    });
                });
            });

            com.focusPage('#btnBack').on("click", function() {

                customerProfileDetail.modals.customerProfileDetailModal.modal("hide");

                com.closePopup();
            });

        });
    }

    function elect(contentDiv, option, type, status) {

        var ridioDiv = $('<div class="col-sm-4"></div>').appendTo(contentDiv);
        var div = $('<div></div>').addClass("").appendTo(ridioDiv);
        var label = $('<label  class="label-text"></label>').appendTo(div);

        var input = $('<input class="ace">').attr({
            'name': 'form-field-checkbox' + option.cpiid
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