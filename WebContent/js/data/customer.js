jQuery(function($) {

    var customer = {

        btns: {
            addPhoneBtn: com.focusPage("#addPhoneBtn"),
            saveBtn: com.focusPage("#saveBtn"),
        },

        modals: {
            customerModal: com.focusPage("#customerModal"),

        },

        items: {
            customerName: com.focusPage("#customerName", "#customerModal"),
            identity: com.focusPage("#identity", "#customerModal"),
            officer: com.focusPage("#officer", "#customerModal"),
            passport: com.focusPage("#passport", "#customerModal"),
            passhkm: com.focusPage("#passhkm", "#customerModal"),
            gender: com.focusPage("#gender", "#customerModal"),
            phone: com.focusPage("#phone", "#customerModal"),
            qq: com.focusPage("#qq", "#customerModal"),
            wechat: com.focusPage("#wechat", "#customerModal"),
            email: com.focusPage("#email", "#customerModal"),
            address: com.focusPage("#address", "#customerModal"),
            relationshipType: com.focusPage("#relationshipType", "#customerModal"),
            career: com.focusPage("#career", "#customerModal"),

            type: com.focusPage("#type", "#customerModal"),

            companyNo: com.focusPage("#companyNo", "#customerModal"),
            companyName: com.focusPage("#companyName", "#customerModal"),
            companyAddr: com.focusPage("#companyAddr", "#customerModal"),
            companyPhone: com.focusPage("#companyPhone", "#customerModal"),
            companyBank: com.focusPage("#companyBank", "#customerModal"),
            companyBankno: com.focusPage("#companyBankno", "#customerModal"),

            addphone: com.focusPage("#addphone", "#customerphoneModal"),
        },

        cid: null,
        customerTypes: {}
    };
    com.focusPage("#companyAd").hide();
    com.focusPage("#comNo").hide();

    customer.btns.saveBtn.on("click", saveData);
    customer.btns.addPhoneBtn.on("click", addPhone);

    customer.items.type.change(function() {

        var type = $(this).val();

        com.focusPage("#comName").text(customer.customerTypes[type] + "名称");
        com.focusPage("#comPhone").text(customer.customerTypes[type] + "电话");
        if (type == constant.customer().customer.STATUS_COMPANY_INT)
            com.focusPage(".companyitem", "#customerModal").show();
        else
            com.focusPage(".companyitem", "#customerModal").hide();
    });
    customer.modal = com.focusPage("#customerModal").on('hide.bs.modal', function(e) {

        com.clearValidator();
        com.cleanItems(customer.items);

        com.focusPage(".companyitem", "#customerModal").hide();
    });

    customer.items.relationshipType.bindData(constant.customer().customer.relationshipType.datas, "key", "value");
    customer.items.type.bindData(constant.customer().customer.customerType.datas, "key", "value");
    $.each(constant.customer().customer.customerType.datas, function(i, v) {

        customer.customerTypes[v.key] = v.value;
    });

    customer.items.type = com.focusPage("#type").bindData(constant.customer().customer.customerType.datas, "key", "value").prop("disabled", false);

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pageCustomer);

    searcher.condition(['customer-name', 'customer-customerName', 'customer-phone', 'customer-relationship', 'customer-type']);

    searcher.history("customerPostData");

    searcher.button([{
        id: "add",
        name: "添加",
        clazz: "btn-success",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        field: "name",
        name: "姓名",
        prop: "name",
        clazz: "grey"
    }, {
        field: "gender",
        name: "性别",
        prop: "gender",
        clazz: "grey"
    }, {
        field: "identity",
        name: "身份证号",
        prop: "identity",
        clazz: "grey"
    }, {
        field: "officer",
        name: "军官证",
        prop: "officer",
        clazz: "grey"
    }, {
        field: "passport",
        name: "护照",
        prop: "passport",
        clazz: "grey"
    }, {
        field: "passhkm",
        name: "港澳通行证",
        prop: "passhkm",
        clazz: "grey"
    }, {
        field: "relationshipType",
        name: "客户关系",
        prop: "relationshipType",
        clazz: "red"
    }, {
        field: "career",
        name: "职业",
        prop: "career",
        clazz: "grey"
    }, {
        field: "email",
        name: "邮箱",
        prop: "email",
        clazz: "grey"
    }, {
        field: "qq",
        name: "QQ",
        prop: "qq",
        clazz: "grey"
    }, {
        field: "wechat",
        name: "邮箱",
        prop: "wechat",
        clazz: "grey"
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        dataset: constant.customer().customer.customerStatus.keys,
        clazz: "red"
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.customer().customer.customerType.keys,
        clazz: "red"
    }, {
        field: "companyNo",
        name: "公司编号",
        prop: "companyNo",
        show: function(v) {

            return v.type == 1;
        },
        clazz: "grey"
    }, {
        field: "companyName",
        name: "名称",
        prop: "companyName",
        clazz: "grey"
    }, {
        field: "companyAddr",
        name: "公司地址",
        prop: "companyAddr",
        show: function(v) {

            return v.type == 1;
        },
        clazz: "grey"
    }, {
        field: "companyPhone",
        name: "联系方式",
        prop: "companyPhone",
        clazz: "grey"
    }, {
        field: "companyBank",
        name: "开户行",
        prop: "companyBank",
        clazz: "grey"
    }, {
        field: "companyBankno",
        name: "开户账号",
        prop: "companyBankno",
        clazz: "grey"
    }, ];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            customer.cid = v.cid;
            editCustomer(v);
            return false;
        }
    }, {
        name: "管理电话",
        clazz: "btn-success",
        handle: function(v) {

            customer.cid = v.cid;
            customer.items.name = v.name;
            managephone();
            return false;
        }
    }, {
        name: "重置",
        clazz: "btn-danger",
        handle: function(v) {

            com.showConfirm("是否重置客户认证", function() {

                com.post(api.data.resetCustomer, {
                    "customer.cid": v.cid
                });
            });

            return false;
        }
    }, {
        name: "画像",
        clazz: "btn-yellow",
        handle: function(v) {

            params.customer.cid = v.cid;
            com.popup4page("#customerProfilePopUp", api.index.customerProfile4detailIndex.url, "画像");

            return false;
        }
    }, {
        name: "记录",
        clazz: "btn-pink",
        handle: function(v) {

            params.customer.cid = v.cid;
            com.popup4page('#customerRecordPopUp', api.index.customerRecordIndex.url, "记录");
        }
    }, {
        name: "账户",
        clazz: "btn-info",
        handle: function(v) {

            params.customer.cid = v.cid;
            com.popup4page('#customerAccountPopUp', api.index.customerAccountIndex.url, "银行账户");
        }
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('a[name="add"]', '#pagenation').click(function() {

        customer.cid = null;

        com.focusPage("#phonehide").css({
            "display": "block"
        });

        customer.modals.customerModal.modal("show");
    });

    function editCustomer(v) {

        if (v.status == constant.customer().customer.STATUS_INIT_INT) {
            $("#customerhide").show();

            com.focusPage("#phonehide").css({
                "display": "none"
            });

            customer.items.customerName.val(v.name).prop("disabled", false);
            customer.items.identity.val(v.identity);
            customer.items.officer.val(v.officer);
            customer.items.passport.val(v.passport);
            customer.items.passhkm.val(v.passhkm);
            customer.items.qq.val(v.qq);
            customer.items.wechat.val(v.wechat);
            customer.items.email.val(v.email);
            customer.items.address.val(v.address);
            customer.items.relationshipType.val(v.relationshipType);
            customer.items.type.val(v.type);
            customer.items.career.val(v.career);

            customer.items.gender.prop('checked', com.genderType[v.gender]);

            customer.items.companyNo.val(v.companyNo);
            customer.items.companyName.val(v.companyName);
            customer.items.companyAddr.val(v.companyAddr);
            customer.items.companyPhone.val(v.companyPhone);
            customer.items.companyBank.val(v.companyBank);
            customer.items.companyBankno.val(v.companyBankno);

            if (v.type == constant.customer().customer.STATUS_COMPANY_INT)
                com.focusPage(".companyitem", "#customerModal").show();

            customer.modals.customerModal.modal("show");

        } else if (v.status == constant.customer().customer.STATUS_AUTHENTICATION_INT || v.status == 2) {
            $("#customerhide").hide();

            customer.items.customerName.val(v.name).prop("disabled", true);
            customer.items.companyNo.val(v.companyNo);
            customer.items.companyName.val(v.companyName);
            customer.items.companyAddr.val(v.companyAddr);
            customer.items.companyPhone.val(v.companyPhone);
            customer.items.companyBank.val(v.companyBank);
            customer.items.companyBankno.val(v.companyBankno);

            customer.modals.customerModal.modal("show");
        }

    }

    function saveData() {

        com.clearValidator();

        if (com.validate("customerModal")) {
            return false;
        }

        var url;
        var options = {
            "customer.type": customer.items.type.val(),
            "customer.name": customer.items.customerName.val(),
            "customer.gender": com.genderType[customer.items.gender.prop("checked")],
            "customer.phone": customer.items.phone.val(),
            "customer.identity": customer.items.identity.val(),
            "customer.officer": customer.items.officer.val(),
            "customer.passport": customer.items.passport.val(),
            "customer.passhkm": customer.items.passhkm.val(),
            "customer.qq": customer.items.qq.val(),
            "customer.wechat": customer.items.wechat.val(),
            "customer.email": customer.items.email.val(),
            "customer.relationshipType": customer.items.relationshipType.val(),
            "customer.career": customer.items.career.val(),
            "customer.address": customer.items.address.val(),
            "customer.companyNo": customer.items.companyNo.val(),
            "customer.companyName": customer.items.companyName.val(),
            "customer.companyAddr": customer.items.companyAddr.val(),
            "customer.companyPhone": customer.items.companyPhone.val(),
            "customer.companyBank": customer.items.companyBank.val(),
            "customer.companyBankno": customer.items.companyBankno.val(),
        };

        var urls;
        var option = {
            "customer.type": customer.items.type.val(),
            "customer.name": customer.items.customerName.val(),
            "customer.companyNo": customer.items.companyNo.val(),
            "customer.companyName": customer.items.companyName.val(),
            "customer.companyAddr": customer.items.companyAddr.val(),
            "customer.companyPhone": customer.items.companyPhone.val(),
            "customer.companyBank": customer.items.companyBank.val(),
            "customer.companyBankno": customer.items.companyBankno.val(),
        };

        if (customer.cid) {
            if (customer.items.type.val() == constant.customer().customer.STATUS_INIT_INT) {
                url = api.data.updateCustomer;
                options['customer.cid'] = customer.cid;
            } else if (customer.items.type.val() == constant.customer().customer.STATUS_COMPANY_INT) {

                urls = api.data.updateCustomerForBase;
                option['customer.cid'] = customer.cid;
            }
        } else {
            url = api.data.addCustomer;

            if (checkPhone(null, com.focusPage("#phone"), 1)) {
                return false;
            }
        }

        com.post(url, options, function(res) {

            searcher.doSearch();
        });

        com.post(urls, option, function(res) {

            searcher.doSearch();
        });

        customer.modal.modal("hide");
    }

    // 画电话的弹窗
    function managephone() {

        com.focusPage('#customerphoneList').empty();

        customer.items.addphone.css("border", "1px solid #d5d5d5").popover("destroy").val("");

        com.post(api.data.queryCustomerPhoneByCid, {
            "customerPhone.cid": customer.cid
        }, function(res) {

            com.focusPage('#customerphoneModal').modal('show');

            $.each(res.customerPhones, function(i, v) {

                var phonelist = $('<div></div>').prop("id", "customerPhone" + i);
                phonelist.append(addspan('40', '电话号码  : ', v.phone).click(function() {

                    var phoneInfo = $(this);

                    com.post(api.data.queryCustomerForPhone, {
                        "customerPhone.cid": v.cid,
                        "customerPhone.cpid": v.cpid,
                    }, function(res) {

                        phoneInfo.html(addspan('0', '电话号码  : ', res.customerPhone.phone));
                    })
                }));

                var $btnStatus = $('<div style="float: right;"></div>');
                var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({
                    "type": "checkbox"
                }).attr("id", v.cpid);
                var $span = $('<span></span>').addClass('lbl status-lbl');

                var $btnDefault = $('<div style="float: right;"></div>');
                var $defaultSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({
                    "type": "checkbox"
                }).attr("id", v.cpid);
                var $dspan = $('<span></span>').addClass('lbl default-lbl');

                var $hr = $('<hr/>');

                !v.status && $statusSwitch.prop("checked", true);

                $statusSwitch.on("click", function() {

                    if ($statusSwitch.prop("checked")) {
                        var option = {
                            "customerPhone.phone": v.phone,
                            "customerPhone.status": 0,
                        };
                        // 先查询该电话是否被被人启用
                        com.post(api.data.checkCustomerForPhone, option, function(res) {

                            updateStatus(v.cpid, 0, function() {

                                $statusSwitch.prop("checked", false);
                            })
                        }, function(res) {

                            com.showAlert(com.warning, "该电话已经被其他客户启用");
                            $statusSwitch.prop("checked", false);
                        }, false);
                    } else {
                        if (v.defaults == 1) {
                            com.showAlert(com.warning, "默认电话不能禁用");
                            $statusSwitch.prop("checked", true);
                        } else {
                            updateStatus(v.cpid, 1, function() {

                                $statusSwitch.prop("checked", true);
                            })
                        }
                    }
                });

                v.defaults && $defaultSwitch.prop("checked", true);
                $defaultSwitch.on("click", function() {

                    if ($defaultSwitch.prop("checked")) {
                        if (v.status == constant.customer().customer.STATUS_AUTHENTICATION_INT) {
                            $defaultSwitch.prop("checked", false);
                            com.showAlert(com.warning, "禁用电话不能选为默认电话");
                        } else {
                            updateDefault(v.cpid, 1, function() {

                                $this.prop("checked")
                            })
                        }
                    } else {
                        $defaultSwitch.prop("checked", true);
                    }
                });

                $btnDefault.append($defaultSwitch).append($dspan);
                $btnStatus.append($statusSwitch).append($span);
                phonelist.append($btnDefault).append($btnStatus).append($hr).appendTo(com.focusPage("#customerphoneList"))
            });

        }, null, false)
    }

    function addspan(px, name, value) {

        var $pxdiv = $('<div></div>').css({
            'display': 'inline-block',
            'margin-left': px + 'px'
        });

        var $nameSpan = $('<strong></strong>').html(name);
        var $valueSpan = $('<b></b>').text(value);

        var $blueb = $valueSpan.addClass("grey");

        return $pxdiv.append($nameSpan).append($blueb);
    }

    function addPhone() {

        if (checkPhone(customer.cid, customer.items.addphone)) {
            return false;
        }

        var param = {
            "customerPhone.phone": customer.items.addphone.val(),
            "customerPhone.cid": customer.cid,
        };

        com.post(api.data.addCustomerPhone, param, function(res) {

            managephone();
        });
    }

    // 启用禁用功能
    function updateStatus(cpid, status, failcallBack) {

        com.post(api.data.updateCustomerPhoneForStatus, {
            "customerPhone.cpid": cpid,
            "customerPhone.status": status
        }, function(res) {

            managephone();
        }, function(res) {

            failcallBack && failcallBack();
        });
    }

    // 客户电话是否是默认的
    function updateDefault(cpid, defaults, failcallBack) {

        com.post(api.data.updateCustomerPhoneForDefault, {
            "customerPhone.cpid": cpid,
            "customerPhone.defaults": defaults
        }, function() {

            managephone();
        }, function(res) {

            failcallBack && failcallBack();
        });
    }

    function checkPhone(cid, ele) {

        var flag = false;

        com.post(api.data.checkCustomerForPhone, {
            "customerPhone.cid": cid,
            "customerPhone.phone": ele.val(),
            "customerPhone.status": null
        }, function(res) {

            ele.css("border", "1px solid #d5d5d5").popover("destroy");
        }, function(res) {

            flag = true;
            com.showPopover(ele, {
                errorMsg: "电话信息已存在"
            }, "right");
        }, false);

        return flag;
    }

});
