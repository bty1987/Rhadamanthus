$(function() {

    var user = {
        statusType: [],
        deptType: [],
        dutyTypeMap: {},
        saveBtn: null,
        cancelBtn: null,
        editLoginId: null,
        deptList: {},
        loginFlag: false,
        simpleAddUserModal: null,
        userPhoto: "",
        identityPathF: "",
        identityPathB: "",
        postParam: {},
        userAdvanceItems: {},
        companysel: [],
        departmentsel: [],
        task: {},
        rolesel: {},
        uid: null,
        userId: null,

        btn: {
            saveBtns: com.focusPage("#saveBtns").on("click", saveBtns),
            save: com.focusPage("#save").on("click", save),

            advanceSaveBtn: com.focusPage("#advanceSaveBtn").on("click", saveAdvanceData),
            advanceCancelBtn: com.focusPage("#advanceCancelBtn"),

            saveRoleBtn: com.focusPage("#saveRoleBtn").on("click", saveUserRole),
            saveCompanyBtn: com.focusPage("#saveCompanyBtn").on("click", saveUserCompany),
            saveDepartmentBtn: com.focusPage("#saveDepartmentBtn").on("click", saveUserDepartment)
        },

        modals: {
            pictureModal: com.focusPage("#pictureModal"),
            transferModal: com.focusPage("#transferModal"),

            userAdvanceModal: com.focusPage("#userAdvanceModal"),
            userCompanyModal: com.focusPage("#userCompanyModal"),
            userDepartmentModal: com.focusPage("#userDepartmentModal"),
            usertaskModal: com.focusPage("#taskModal"),
            userRoleModal: com.focusPage("#userRoleModal"),
            companyCopyModal: com.focusPage("#companyCopyModal")
        },
        items: {
            userPhoto: com.focusPage("#userPhoto", "#pictureModal"),
            identityPathF: com.focusPage("#identityPathF", "#pictureModal"),
            identityPathB: com.focusPage("#identityPathB", "#pictureModal"),

            isLogin: com.focusPage("#isLogin").switchBtn("isOrNot"),
            ips: com.focusPage("#ips").switchBtn("isOrNot"),
            macs: com.focusPage("#macs").switchBtn("isOrNot"),
            qcode: com.focusPage("#qcode").switchBtn("isOrNot"),
            webs: com.focusPage("#webs").switchBtn("isOrNot"),
            pcs: com.focusPage("#pcs").switchBtn("isOrNot"),

            roleTran: com.focusPage("#roleTran"),
            company: com.focusPage("#company"),
            usercompany: com.focusPage("#usercompany", "#userCompanyModal"),
            userdepartment: com.focusPage("#userdepartment", "#userDepartmentModal"),
            taskpermissions: com.focusPage("#taskpermissions"),
            oldcompany: com.focusPage("#oldcompany"),

            userrole: com.focusPage("#userrole", "#userRoleModal"),
            role: com.focusPage("#role", "#userRoleModal"),
            selectrole: com.focusPage("#roles", "#userRoleModal"),
            isPrefor: com.focusPage("#isPrefor", "#transferModal"),
        },
        postData: null,
        isExpert: true,
        pageType: params['urlLoadParams'].type,
        pageConfig: {},
        getProp: {
            "0": true,
            "1": false,
            "true": 0,
            "false": 1
        }
    };

    if (user.pageType === 'expert') {
        user.isExpert = true;
    } else if (user.pageType === 'common') {
        user.isExpert = false;
    }

    user.simpleAddUserModal = com.focusPage("#simpleAddUserModal");
    user.simpleAddUserModal.on('hide.bs.modal', function() {

        com.cleanItems(user.items);
        com.closeTip();
    });

    user.modals.pictureModal.on('show.bs.modal', function() {

        com.cleanItems(user.items);
        com.clearValidator();
    });

    // 不同页面的不同参数
    user.pageConfig = userUtils.getConfig(user.pageType);

    com.uploadify("#pictureUpload", "上传图片", api.common.uploadImg, 'btn btn-success blue col-md-12', '*.jpg;*.jpge;*.gif;*.png', {
        'uploadType': 0
    }, 1, function(data) {

        com.focusPage("#picture").val(data.resUrl);
        com.focusPage("#userPhoto").attr("href", com.showImg(com.focusPage("#showImg"), data.resUrl, 150, 150, ''));
    });

    com.uploadify("#pictureUpload1", "上传图片", api.common.uploadImg, 'btn btn-success blue col-md-12', '*.jpg;*.jpge;*.gif;*.png', {
        'uploadType': 0
    }, 1, function(data) {

        com.focusPage("#picture1").val(data.resUrl);
        com.focusPage("#identityPathF").attr("href", com.showImg(com.focusPage("#showImg1"), data.resUrl, 360, 260, ''));
    });

    com.uploadify("#pictureUpload2", "上传图片", api.common.uploadImg, 'btn btn-success blue col-md-12', '*.jpg;*.jpge;*.gif;*.png', {
        'uploadType': 0
    }, 1, function(data) {

        com.focusPage("#picture2").val(data.resUrl);
        com.focusPage("#identityPathB").attr("href", com.showImg(com.focusPage("#showImg2"), data.resUrl, 360, 260, ''));
    });

    user.modals.qrcodeModal = com.initForm("qrcodeModal", "二维码", [{
        "id": "Qrcode",
        "type": "div",
        "clazz": "qrcode"
    }], []);
    user.items.Qrcode = com.focusPage("#Qrcode");

    user.modals.importModal = com.initForm("importModal", "导入", [{
        "id": "import",
        "type": "div"
    }], []);

    user.modals.ddModal = com.initForm("ddModal", "钉钉部门", [{
        "id": "tree3",
        "type": "div",
        "clazz": "tree"
    }], [{
        "id": "savebtn",
        "clazz": "btn btn-primary",
        "name": "保存"
    }]);
    user.items.tree3 = com.focusPage("#tree3");

    user.modals.simpleAddUserModal = com.initForm("simpleAddUserModal", "添加员工", [{
        "id": "userName",
        "name": "姓名",
        "type": "text",
        "validator": "v_required v_name"
    }, {
        "id": "currentName",
        "name": "现用名",
        "type": "text",
        "validator": "v_required"
    }, {
        "id": "gender",
        "name": "性别",
        "type": "switch",
        "validator": "v_required",
        "clazz": "gender"
    }, {
        "id": "identity",
        "name": "身份证号",
        "type": "text",
        "validator": "v_required v_identity"
    }, {
        "id": "phone",
        "name": "手机号",
        "type": "text",
        "validator": "v_required v_phones"
    }, {
        "id": "email",
        "name": "邮箱",
        "type": "text",
        "validator": "v_required v_email"
    },

    {
        "id": "loginId",
        "name": "用户名",
        "type": "text",
        "validator": "v_required v_name_en"
    }, {
        "id": "deptTypeSel",
        "name": "部门类型",
        "type": "select",
        "validator": "v_required"
    }, {
        "id": "deptSel",
        "name": "部门",
        "type": "select",
        "validator": "v_required"
    }, {
        "id": "dutySel",
        "name": "职位",
        "type": "select",
        "validator": "v_required"
    }, {
        "id": "statusSel",
        "name": "状态",
        "type": "select",
        "validator": "v_required"
    }], [{
        "id": "saveUserBtn",
        "clazz": "btn btn-primary",
        "name": "保存"
    }]);

    com.post(api.communion.queryDepartmentType, {}, function(res) {

        user.deptType = res.departmentTypes;
    }, null, false);

    com.post(api.system.queryCompany, {}, function(res) {

        $.each(res.companys, function(i, v) {

            user.companysel.push(v);
        });

    }, null, false);

    com.post(api.communion.queryDepartment, {}, function(res) {

        $.each(res.deptList, function(i, v) {

            user.departmentsel.push(v);
        });

    }, null, false);

    com.post(api.communion.queryTask, {
        "task.level": 0
    }, function(res) {

        user.task = res.tasks;
    }, null, false);

    com.selectTypeahead(user.items.company, user.companysel, 'cid', 'name');

    com.initTypeahead("roleTran", api.system.queryRoleByName, 'role.name', {}, "roleList", 'rid', 'name');
    com.initTypeahead("role", api.system.queryRoleByName, 'role.name', {}, "roleList", 'rid', 'name', function(list, k, v) {

        var $li = $("<li></li>").css({
            "background-color": "#91b8d0",
            "margin-bottom": "5px",
            "margin-right": "5px"
        }).attr("rid", k).appendTo(user.items.selectrole);

        var $span = $("<span></span>").css({
            'color': '#fff'
        }).attr('role', v).attr('rid', user.items.role.attr('data-typeahead-key')).html(v).appendTo($li);
        var $a = $("<a></a>").addClass("glyphicon glyphicon-remove").css({
            'color': '#d15b47'
        }).appendTo($li);

        $a.click(function() {

            $li.remove();
        });

        com.cleanItems(user.items);

        return "";
    });

    var binding = {

        $dialog: com.focusPage('#moduleModal'),
        postConf: {
            "user.userId": null,
            path: null,
            name: null
        },

        openDesignDialog: function(userId) { // 设计权限配置

            var $dialog = this.$dialog;
            showDepaermentModal("设计部");
            com.post(api.right.queryDecorationDesignDepartmentRightByUserId, {
                "user.userId": userId
            }, function(data) {

                if (data.dids.length) {
                    $.each(data.dids, function(i, v) {

                        $wrap.find('input[value="' + v + '"]').prop('checked', true);
                    });
                }
            }, null, false);
            $dialog.modal("show");
            this.postConf.path = api.right.updateDecorationDesignDepartmentRight;
            this.postConf.name = "dids";
            this.postConf["user.userId"] = userId;
        },

        openSalesDialog: function(userId) { // 业务权限配置

            var $dialog = this.$dialog;
            showDepaermentModal("");
            com.post(api.right.queryDecorationSalesmanDepartmentRightByUserId, {
                "user.userId": userId
            }, function(data) {

                if (data.dids.length) {
                    $.each(data.dids, function(i, v) {

                        $wrap.find('input[value="' + v + '"]').prop('checked', true);
                    });
                }
            }, null, false);
            $dialog.modal("show");
            this.postConf.path = api.right.updateDecorationSalesmanDepartmentRight;
            this.postConf.name = "dids";
            this.postConf["user.userId"] = userId;
        },

        openOrderDialog: function(userId) { // 订单权限配置

            var $dialog = this.$dialog;
            var list = [{
                key: "-1",
                value: "全部"
            }], userList;
            var $list = $('.modal-body', $dialog);
            $list.empty();

            list = list.concat(constant.decoration().decoration.status.datas);

            com.post(api.right.queryDecorationStatusRightByUserId, {
                "user.userId": userId
            }, function(data) {

                userList = data.statuses;
            }, null, false);

            list && list.length && $.each(list, function(i, v) {

                var $label = $('<label  style="margin-right:20px;display: inline-block;min-width: 25%;"></label>');
                var $input = $('<input>').attr({
                    "type": "checkbox",
                    "name": "module",
                    "class": "ace"
                }).val(v.key);
                var $span = $('<span></span>').addClass('lbl').html(v.value);
                $label.append($input).append($span).appendTo($list);
            });

            userList && userList.length && $.each(userList, function(i, v) {

                com.focusPage('input[name="module"][value="' + v + '"]', $list).prop('checked', true);
            });

            $dialog.modal("show");

            this.postConf.path = api.right.updateDecorationStatusRight;
            this.postConf.name = "statuses";
            this.postConf["user.userId"] = userId;

        },

        openHouseDialog: function(userId) { // 房源权配

            var $dialog = this.$dialog;
            showDepaermentModal("置业房产");
            com.post(api.right.queryHouseSourceDepartmentRightByUserId, {
                "user.userId": userId
            }, function(data) {

                if (data.dids.length) {
                    $.each(data.dids, function(i, v) {

                        $wrap.find('input[value="' + v + '"]').prop('checked', true);
                    });
                }
            }, null, false);
            $dialog.modal("show");
            this.postConf.path = api.right.updateHouseSourceDepartmentRight;
            this.postConf.name = "dids";
            this.postConf["user.userId"] = userId;
        },

        openCustomerDialog: function(userId) { // 客源权配

            var $dialog = this.$dialog;
            showDepaermentModal("");
            com.post(api.right.queryCustomerSourceDepartmentRightByUserId, {
                "user.userId": userId
            }, function(data) {

                if (data.dids.length) {
                    $.each(data.dids, function(i, v) {

                        $wrap.find('input[value="' + v + '"]').prop('checked', true);
                    });
                }
            }, null, false);
            $dialog.modal("show");
            this.postConf.path = api.right.updateCustomerSourceDepartmentRight;
            this.postConf.name = "dids";
            this.postConf["user.userId"] = userId;
        },

        // 登出
        openlogoutDialog: function(userId) {

            com._post_(api.home.library, {
                "api": "system.login.logout",
                "userId": userId,
                "redis": 0
            }, function(res) {

                com.showAlert(com.info, "操作成功");
            });
        },

        setAdvance: function() {

            var $dialog = this.$dialog;
            var postConf = this.postConf;

            com.focusPage('button[name="saveBtn"]').click(function() {

                var list = $('input[name="module"]:checked', $dialog);

                var params = {
                    "user.userId": postConf["user.userId"]
                };

                if (!list.length || list.length == 0)
                    return false;

                $.each(list, function(i, v) {

                    var $v = $(this).val();
                    params[postConf.name + "[" + i + "]"] = $v;
                    if ($v == -1 || $v == '全部')
                        return false;
                });

                com.post(postConf.path, params, function(data) {

                    $dialog.modal("hide");
                });
            });
        }
    };

    var lineprops = (function() {

        var props = [];

        if (user.pageConfig.propertyArr.contains("picture")) {
            props.push({
                type: "img",
                prop: "userPhoto"
            });
        }

        props.push({
            field: "userName",
            name: "用户名",
            prop: "userName",
            clazz: "blue"
        });

        $.each(user.pageConfig.propertyArr, function(i, pv) {

            if (pv == "picture")
                return;

            switch (pv) {
                case "userId":
                    props.push({field: "userId", name: "员工编号", prop: "userId", clazz: "grey"});
                    break;
                case "loginId":
                    props.push({field: "loginId", name: "用户名", prop: "loginId", clazz: "grey"});
                    break;
                case "dept":
                    props.push({field: "dept.name", name: "部门", prop: "dept.name", clazz: "grey"});
                    break;
                case "duty":
                    props.push({field: "duty.name", name: "职位", prop: "duty.name", clazz: "grey"});
                    break;
                case "role":
                    props.push({field: "role.name", name: "角色", prop: "role.name", clazz: "grey"});
                    break;
                case "phone":
                    props.push({field: "phone", name: "联系方式", prop: "phone", clazz: "grey"});
                    break;
                case "identity":
                    props.push({field: "identity", name: "身份证", prop: function(v) { return v.identity ? v.identity.replace(/(\d{6})\d{8}(\w{4})/, '$1********$2') : ""; }, clazz: "grey"});
                    break;
                case "status":
                    props.push({field: "status", name: "状态", prop: function(v) { return constant.personel().user.status.keys[v.status]; }, clazz: "red"});
                    break;
            }
        });

        return props;
    })();

    var linebtns = (function() {

        var btns = {};

        if (user.pageConfig.pageBtn.contains("qrcode")) {
            btns.qrcode = {
                name: "二维码",
                clazz: "btn-yellow",
                show: function(v) { return v.status == constant.personel.user.STATUS_ONJOB_INT; },
                handle: function(v) {

                    user.items.Qrcode.html("").qrcode({
                        render: "canvas",
                        width: 150,
                        height: 150,
                        text: "fanglinserver:" + v.userId
                    });

                    user.modals.qrcodeModal.modal('show');
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("view")) {
            btns.view = {
                name: "查看",
                clazz: "btn-info",
                handle: function(v) {

                    params.personel.userId = v.userId;
                    params.personel.isExpert = user.isExpert;
                    com.popup4page("#layerPopUp", api.index.userViewIndex.url, "查看");
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("total")) {
            btns.total = {
                name: "汇总",
                clazz: "btn-info",
                handle: function(v) {

                    params.personel.userId = v.userId;
                    params.personel.uid = v.uid;
                    params.personel.isExpert = user.isExpert;

                    com.popup4page("#layerPopUp", api.index.userDetail.url, "人员信息");
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("edit")) {
            btns.edit = {
                name: "编辑",
                clazz: "btn-info",
                handle: function(v) {

                    params.personel.userId = v.userId;
                    params.type = 1;
                    params.personel.isExpert = user.isExpert;
                    com.popup4page("#layerPopUp", api.index.userEditIndex.url, "编辑");
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("partner")) {
            btns.partner = {
                name: "合作",
                clazz: "btn-info",
                handle: function(v) {

                    params.personel.partner = {
                        "uid": v.uid
                    }

                    com.popup4page("#userPartnerPopUp", api.index.userPartnerIndex.url, "合作");
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("addDD")) {
            btns.addDD = {
                name: "添加钉钉",
                clazz: "btn-inverse",
                show: function(v) { return v.status == constant.personel.user.STATUS_ONJOB_INT; },
                handle: function(v) {

                    com.focusPage('#ddModal').modal('show');

                    com.focusPage('#tree3').html("");
                    com.focusPage("#tree3").removeData("tree");
                    com.focusPage("#tree3").unbind('click');
                    var deptList = null;

                    com.post(api.dd.queryDingTalkDepartment, {}, function(res) {

                        deptList = res.departments;
                    }, null, false);

                    if (deptList == null) {
                        return false;
                    }

                    var deptObj = {
                        '1': {
                            name: params.company.name,
                            type: 'folder',
                            id: params.company.no
                        }
                    }, didList = [];
                    // 获取所有叶子节点
                    $.each(deptList, function(i, va) {

                        didList.push(va.id);
                    });

                    $.each(deptList, function(i, va) {

                        if (va.parentid && didList.indexOf(va.parentid) != -1) {
                            didList.splice(didList.indexOf(va.parentid), 1);
                        }
                    });

                    // splice为删除了父类的id,余下的在didlist中的id为子节点的id
                    com.focusPage('#tree3').ace_tree({
                        dataSource: {
                            data: function(options, callback) {

                                var $data = null;
                                if (!("type" in options)) {
                                    $data = deptObj;// the root tree
                                    callback({
                                        data: $data
                                    });
                                    return;
                                } else if ("type" in options && options.type == "folder") {
                                    if ("children" in options) {
                                        $data = options.children;
                                    } else {
                                        $data = getDeptByDid(options.id);
                                    }
                                }

                                if ($data != null) {
                                    setTimeout(function() {

                                        callback({
                                            data: $data
                                        });
                                    }, parseInt(Math.random() * 500) + 200);
                                }
                            }
                        },
                        loadingHTML: '<div class="tree-loading"><i class="icon-refresh icon-spin blue"></i></div>',
                        'open-icon': 'icon-minus',
                        'close-icon': 'icon-plus',
                        'selectable': true,// 可选
                        'multiSelect': true, // 多选
                        'selected-icon': null,
                        'unselected-icon': null,
                        folderSelect: true,
                        cacheItems: false
                    }).on('selected', function(evt, opt) {

                    });

                    var getDeptByDid = function(did) {

                        var depts = {};
                        $.each(deptList, function(i, va) {

                            if (va.parentid == did) {
                                depts[va.id] = {
                                    name: va.name,
                                    type: didList.indexOf(va.id) == -1 ? 'folder' : 'item',
                                    id: va.id
                                }
                            }
                        });
                        return depts;
                    };

                    com.focusPage('#savebtn').unbind().bind('click', function() {

                        var items = com.focusPage('#tree3').tree('selectedItems');
                        var length = items.length;
                        com.focusPage('#ddModal').modal("hide");
                        var params = {
                            "user.userid": v.userId,
                            "user.name": v.currentName,
                            "user.Mobile": v.phone,
                            "user.Position": v.duty.name,
                            "user.email": v.email
                        };

                        if (length) {
                            for ( var i = 0; i < length; i++) {
                                params["dids" + "[" + i + "]"] = items[i].id;
                            }
                        }

                        com.post(api.dd.queryDingTalkUser, {
                            "user.userid": v.userId
                        }, function(res) {

                            if (res.user && res.user.userid != null) {
                                com.post(api.dd.updateDingTalkUser, params, function(data) {

                                    if ($.trim(data.errcode) == $.trim(0)) {
                                        com.showAlert(com.info, "更新成功");
                                    } else {
                                        com.showAlert(com.error, "更新失败");
                                    }
                                });
                            } else {
                                com.post(api.dd.addDingTalkUser, params, function(data) {

                                    if ($.trim(data.errcode) == $.trim(0)) {
                                        com.showAlert(com.info, "创建成功");
                                    } else {
                                        com.showAlert(com.error, "创建失败");
                                    }
                                });
                            }
                        }, null, false);
                    });

                    com.focusPage('#cancel').click(function() {

                        com.focusPage("#tree3").removeData("tree");
                    });
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("syncDD")) {
            btns.syncDD = {
                name: "同步钉钉",
                clazz: "btn-inverse",
                show: function(v) { return v.status == constant.personel.user.STATUS_ONJOB_INT; },
                handle: function(v) {

                    var message = "<p>确定要将该员工信息同步到钉钉吗?</p>";
                    com.showConfirm(message, function(result) {

                        var selectedDepts = [];
                        var phone;
                        com.post(api.dd.queryDingTalkUser, {
                            "user.userid": v.userId
                        }, function(res) {

                            selectedDepts = res.user.department;
                            phone = res.user.mobile;
                            if (selectedDepts == null) {
                                com.showAlert(com.error, "该员工还没有添加到钉钉部门");
                                return;
                            }

                            var params = {
                                "user.userid": v.userId,
                                "user.name": v.currentName,
                                "user.Mobile": phone,
                                "user.Position": v.duty.name,
                                "user.email": v.email,
                                "dids": selectedDepts
                            };

                            com.post(api.dd.updateDingTalkUser, params, function(data) {

                                if ($.trim(data.errcode) == $.trim(0)) {
                                    com.showAlert(com.info, "更新成功");
                                } else {
                                    com.showAlert(com.error, "更新失败");
                                }
                            });
                        }, null, false);
                    });
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("delDD")) {
            btns.delDD = {
                name: "删除钉钉",
                clazz: "btn-inverse",
                show: function(v) { return v.status == constant.personel.user.STATUS_ONJOB_INT; },
                handle: function(v) {

                    var message = "<p>确定要删除该员工吗?</p>";
                    com.showConfirm(message, function(result) {

                        com.post(api.dd.queryDingTalkUser, {
                            "user.userid": v.userId
                        }, function(res) {

                            if (res.user.name != null) {
                                com.post(api.dd.deleteDingTalkUser, {
                                    "user.userid": v.userId
                                }, function(data) {

                                    if ($.trim(data.errcode) == $.trim(0)) {
                                        com.showAlert(com.info, "删除成功");
                                    } else {
                                        com.showAlert(com.error, "删除失败");
                                    }
                                });
                            } else {
                                com.showAlert(com.error, "钉钉中没有该用户, 无法删除");
                            }
                        });
                    });
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("salary")) {
            btns.salary = {
                name: "薪资",
                clazz: "btn-pink",
                handle: function(v) {

                    params.salary.belonger = {
                        userId: v.userId
                    };

                    com.popup4page("#layerPopUp", "views/salary/salary4common.html", "薪资信息");
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("contract")) {
            btns.contract = {
                name: "合同",
                clazz: "btn-pink",
                handle: function(v) {

                    params.personel.userId = v.userId;
                    params.personel.uid = v.uid;
                    params.historyPage = api.index.userIndex.url;

                    com.switchPage(api.index.userContract.url);
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("experience")) {
            btns.experience = {
                name: "经历",
                clazz: "btn-pink",
                handle: function(v) {

                    params.personel.uid = v.uid;
                    com.popup4page("#layerPopUp", api.index.userExperience.url, "工作经历");
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("education")) {
            btns.education = {
                name: "教育",
                clazz: "btn-pink",
                handle: function(v) {

                    params.personel.uid = v.uid;

                    com.popup4page("#layerPopUp", api.index.userEducation.url, "教育信息");
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("job")) {
            btns.job = {
                name: "工作",
                clazz: "btn-pink",
                handle: function(v) {

                    params.personel.uid = v.uid;

                    com.popup4page("#layerPopUp", api.index.userOperation.url, "工作信息");
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("data")) {
            btns.data = {
                name: "资料",
                clazz: "btn-pink",
                handle: function(v) {

                    user.modals.pictureModal.modal("show");

                    params.personel.userId = v.userId;
                    params.personel.uid = v.uid;

                    initUser(v);
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("leave")) {
            btns.leave = {
                name: "离职",
                clazz: "btn-danger",
                handle: function(v) {

                    com.post(api.personel.quitUser, {
                        "userId": v.userId,
                        "approve": "agree"
                    }, function(v) {

                        com.showAlert(com.info, "离职成功");

                        userSeacher.doSearch();
                    });
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("transferred")) {
            btns.transferred = {
                name: "调职",
                clazz: "btn-danger",
                handle: function(v) {

                    user.modals.transferModal.modal("show");

                    params.personel.userId = v.userId;

                    transfer(v);

                    return false;
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("print")) {
            btns.print = {
                name: "打印",
                clazz: "btn-danger",
                handle: function(v) {

                    params.personel.userId = v.userId;
                    params.personel.uid = v.uid;

                    com.popup("方林装饰应聘登记表", api.index.userPrint.url, null, null, true);
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("role")) {
            btns.role = {
                name: "角色",
                clazz: "btn-yellow",
                handle: function(v) {

                    user.uid = v.uid;

                    var options = {
                        "user.uid": v.uid
                    };

                    user.items.userrole.html("");
                    user.items.selectrole.html("");

                    user.modals.userRoleModal.modal("show");

                    com.post(api.personel.queryUserRole, options, function(res) {

                        $.each(res.userRoles, function(i, va) {

                            var $div = $('<div></div>').appendTo(user.items.userrole);
                            var $span = $('<span class="tag"></span>').html(va.role.name).appendTo($div);
                        });
                    });
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("company")) {
            btns.company = {
                name: "公司",
                clazz: "btn-yellow",
                handle: function(v) {

                    user.uid = v.uid;

                    $("#companydiv").empty();

                    var companyname = [];

                    var options = {
                        "user.uid": v.uid
                    };

                    user.items.usercompany.html("");

                    user.modals.userCompanyModal.modal("show");

                    com.post(api.personel.queryUserCompany, options, function(res) {

                        $.each(res.userCompanys, function(i, va) {

                            companyname.push(va.company.name);
                        });
                    }, null, false);

                    $.each(user.companysel, function(i, va) {

                        var $div = $('<div class="tag"></div>');
                        var $input = $('<input/>').attr({
                            "type": "checkbox",
                            "value": va.name,
                            "name": "corporab",
                            "id": va.cid,
                            "class": "ace"
                        });
                        var $span = $('<span></span>').addClass('lbl');
                        var $spans = $('<span></span>').html(va.name);
                        $div.append($input).append($span).append($spans).appendTo(com.focusPage("#companydiv"));
                        if (companyname.indexOf(va.name) != -1) {
                            $input.attr("checked", true);
                        }
                    });

                    companyname && companyname.length && $.each(companyname, function(i, v) {

                        var $div = $('<div></div>').appendTo(user.items.usercompany);
                        var $span = $('<span class="tag"></span>').html(v).appendTo($div);
                    });
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("department")) {
            btns.department = {
                name: "部门",
                clazz: "btn-yellow",
                handle: function(v) {

                    user.uid = v.uid;

                    $("#departmentdiv").empty();

                    var departmentname = [];

                    var options = {
                        "user.uid": v.uid
                    };

                    user.items.userdepartment.html("");

                    user.modals.userDepartmentModal.modal("show");

                    com.post(api.personel.queryUserDepartment, options, function(res) {

                        $.each(res.userDepartments, function(i, va) {

                            departmentname.push(va.department.name);
                        });
                    }, null, false);

                    $.each(user.departmentsel, function(i, va) {

                        var $div = $('<div class="tag"></div>');
                        var $input = $('<input/>').attr({
                            "type": "checkbox",
                            "value": va.name,
                            "name": "deptcheck",
                            "id": va.did,
                            "class": "ace"
                        });
                        var $span = $('<span></span>').addClass('lbl');
                        var $spans = $('<span></span>').html(va.name);
                        $div.append($input).append($span).append($spans).appendTo(com.focusPage("#departmentdiv"));
                        if (departmentname.indexOf(va.name) != -1) {
                            $input.attr("checked", true);
                        }
                    });

                    departmentname && departmentname.length && $.each(departmentname, function(i, v) {

                        var $div = $('<div></div>').appendTo(user.items.userdepartment);
                        var $span = $('<span class="tag"></span>').html(v).appendTo($div);
                    });
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("right")) {
            btns.right = {
                name: "权配",
                clazz: "btn-yellow",
                handle: function(v) {

                    dialogUserAdvanceIndex(v.userId);
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("macontrol")) {
            btns.macontrol = {
                name: "权限",
                clazz: "btn-yellow",
                handle: function(v) {

                    params["user.uid"] = v.uid;
                    com.popup4page("#layerPopUp", api.index.macontrol.url, "权限");
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("design")) {
            btns.design = {
                name: "装修设计",
                clazz: "btn-pink",
                handle: function(v) {

                    binding.openDesignDialog(v.userId);
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("sales")) {
            btns.sales = {
                name: "装修业务",
                clazz: "btn-pink",
                handle: function(v) {

                    binding.openSalesDialog(v.userId);
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("status")) {
            btns.status = {
                name: "装修状态",
                clazz: "btn-pink",
                handle: function(v) {

                    binding.openOrderDialog(v.userId);
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("house")) {
            btns.house = {
                name: "房源权配",
                clazz: "btn-pink",
                handle: function(v) {

                    binding.openHouseDialog(v.userId);
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("customer")) {
            btns.customer = {
                name: "客源权配",
                clazz: "btn-pink",
                handle: function(v) {

                    binding.openCustomerDialog(v.userId);
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("reset")) {
            btns.resetPassword = {
                name: "重置密码",
                clazz: "btn-danger",
                handle: function(v) {

                    resetPassword(v.userId, v.userName);
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("default")) {
            btns.defaultPassword = {
                name: "默认密码",
                clazz: "btn-danger",
                handle: function(v) {

                    defaultPassword(v.userId, v.userName);
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("exit")) {
            btns.logout = {
                name: "登出",
                clazz: "btn-danger",
                handle: function(v) {

                    binding.openlogoutDialog(v.userId);
                }
            };
        }

        if (user.pageConfig.pageBtn.contains("syncRight")) {
            btns.syncRight = {
                name: "同步权限",
                clazz: "btn-info",
                handle: function(v) {

                    user.uid = v.uid;
                    user.userId = v.userId;

                    showCompanySelectionModal(v.uid, v.currentName);

                    user.modals.companyCopyModal.modal('show');
                }
            };
        }

        return btns;
    })();

    var buttons = (function() {

        var btns = [];

        if (user.pageConfig.pageBtn.contains("simplifyAdd")) {
            var $addaS = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addUserSimple').css("margin", "0px 3px");
            $('<i></i>').addClass('icon-plus bigger-110').appendTo($addaS);
            $('<span></span>').text('添加-简化').appendTo($addaS);
            btns.push($addaS);
        }

        if (user.pageConfig.pageBtn.contains("add")) {
            var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addUser').css("margin", "0px 3px");
            $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
            $('<span></span>').text('添加').appendTo($adda);
            btns.push($adda);
        }

        if (user.pageConfig.pageBtn.contains("uploading")) {
            var $importa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
            $('<i></i>').addClass('icon-upload bigger-110').appendTo($importa);
            $('<span></span>').text('上传').appendTo($importa);
            btns.push($importa);
        }

        if (user.pageConfig.pageBtn.contains("export")) {
            var $exporta = $('<a></a>').addClass('btn btn-minier btn-warning pull-left').attr('name', 'export').css("margin", "0px 3px");
            $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($exporta);
            $('<span></span>').text('导出').appendTo($exporta);
            btns.push($exporta);
        }

        return btns;
    })();

    var userSeacher = new Searcher();

    userSeacher.set("condList", "pagenation", "resultList", user.pageConfig.apiPage, null, user.pageConfig.condArr, user.pageType + "UserPostData", null, false, buttons);
    userSeacher.line("userName", lineprops, linebtns).render();

    binding.setAdvance();

    com.focusPage('a[name="addUser"]', '#pagenation').click(function() {

        delete params.type;

        params.personel.userId = null;
        params.personel.isExpert = user.isExpert;

        com.popup4page("#layerPopUp", api.index.userEditIndex.url, "添加");
    });

    com.focusPage('a[name="addUserSimple"]', '#pagenation').click(function() {

        user.simpleAddUserModal.modal("show");
    });

    com.focusPage('a[name="import"]', '#pagenation').click(function() {

        user.modals.importModal.modal("show");
    });

    com.uploadify(com.focusPage("#import"), "上传文件", api.salary.importUserSalary, 'btn btn-success col-sm-12', '*.xls;*.xlsx', {
        'uploadType': 4
    }, 1);

    com.focusPage('a[name="export"]', '#pagenation').click(function() {

        com.popup4page("#layerPopUp", api.index.userOutputIndex.url, "导出人员信息");
    });

    // 添加人员(简化版)
    user.saveBtn = com.focusPage("#saveUserBtn").on("click", saveData);
    user.cancelBtn = com.focusPage("#cancelUserBtn").on("click", function() {

        user.simpleAddUserModal.modal("hide");
    });

    user.items.loginId = com.focusPage("#loginId");
    user.items.userName = com.focusPage("#userName");
    user.items.currentName = com.focusPage("#currentName");
    user.items.gender = com.focusPage("#gender").switchBtn("gender");
    user.items.identity = com.focusPage("#identity");
    user.items.phone = com.focusPage("#phone");
    user.items.deptSel = com.focusPage("#deptSel");
    user.items.dutySel = com.focusPage("#dutySel");
    user.items.deptTypeSel = com.focusPage("#deptTypeSel");
    user.items.statusSel = com.focusPage("#statusSel");

    user.items.deptTypeSel.on("change", function(b, d) {

        com.post(api.system.queryDutyByDtid, {
            "duty.departmentType.dtid": $(this).val()
        }, function(res) {

            user.dutyTypeMap = res.dutys;
            user.items.dutySel.bindData(user.dutyTypeMap, "did", "name");
        });

        com.post(api.communion.queryDepartmentByDtid, {
            "dept.type.dtid": $(this).val()
        }, function(res) {

            user.items.deptSel.bindData(res.deptList, "did", "name");
            d && d();
        });

    }).trigger("change");

    user.items.deptTypeSel.bindData(user.deptType, "dtid", "name");
    user.items.statusSel.bindData(constant.personel.user.status.datas, "key", "value");

    function initUser(v) {

        com.focusPage("#picture").val(v.userPhoto);
        com.focusPage("#userPhoto").attr("href", com.showImg(com.focusPage("#showImg"), v.userPhoto, 150, 150, '', null));
        com.focusPage("#picture1").val(v.identityPathF);
        com.focusPage("#identityPathF").attr("href", com.showImg(com.focusPage("#showImg1"), v.identityPathF, 360, 260, '', null));
        com.focusPage("#picture2").val(v.identityPathB);
        com.focusPage("#identityPathB").attr("href", com.showImg(com.focusPage("#showImg2"), v.identityPathB, 360, 260, '', null));
    }

    function saveData() {

        if (com.validate("simpleAddUserModal")) {
            return false;
        }

        var loginId = user.items.loginId.val();

        com.post(api.personel.queryUserByLoginId, {
            "user.loginId": loginId
        }, function(res) {

            user.loginFlag = false;
            com.showTip(user.items.loginId, "用户名已存在", "right");
        }, function(res) {

            user.loginFlag = true;
        }, false);

        if (!user.loginFlag)
            return false;

        var options = {
            "userInfo.user.userName": user.items.userName.val().trim(),
            "userInfo.user.currentName": user.items.currentName.val(),
            "userInfo.user.gender": com.genderType[user.items.gender.prop("checked")],
            "userInfo.gender": user.items.gender.prop("checked") == true ? 0 : 1,
            "userInfo.user.identity": user.items.identity.val(),
            "userInfo.user.phone": user.items.phone.val(),
            "userInfo.user.loginId": user.items.loginId.val(),
            "userInfo.user.dtid": user.items.deptTypeSel.val(),
            "userInfo.user.dept.did": user.items.deptSel.val(),
            "userInfo.user.duty.did": user.items.dutySel.val(),
            "userInfo.user.status": user.items.statusSel.val(),
            "userInfo.salary": 0,
            "userInfo.fangliner.userId": "",
            "userInfo.entryTime": new Date().getFullYear() + "-" + utils.accAdd(new Date().getMonth(), 1) + "-" + new Date().getDate(),
            "userInfo.hometownAddress": "",
            "userInfo.address": "",
            "userInfo.bank": "",
            "userInfo.bankCardNum": "",
            "userInfo.isMarried": 1,
            "userInfo.isBirth": 1,
            "userInfo.isHouseLoan": 1,
            "userInfo.isCarLoan": 1,
            "userInfo.isCarID": 1,
            "userInfo.isPassID": 1,
            "userInfo.isHMID": 1,
            "userInfo.isTWID": 1,
            "userInfo.isPresentGraduate": 1,
            "userInfo.isInsurance": 1
        };

        com.post(api.personel.addUser, options, function(res) {

            com.showAlert(com.info, "操作成功");

            user.simpleAddUserModal.modal("hide");

            userSeacher.doSearch();

            var returnUser = res.userInfo.user;
            var deptName = returnUser.dept.name;
            var dutyName = returnUser.duty.name;
            var company = params.company;

            var userData = {
                "userId": returnUser.userId,
                "userName": returnUser.userName,
                "deptName": deptName,
                "dutyName": dutyName,
                "drganizationNo": company.drganization.no,
                "drganizationName": company.drganization.name
            };

            kingdeeUtils.user(userData);
        });
    }

    function saveBtns() {

        var param = {
            "user.userId": params.personel.userId,
            "user.userPhoto": com.focusPage("#picture").val(),
            "user.identityPathF": com.focusPage("#picture1").val(),
            "user.identityPathB": com.focusPage("#picture2").val()
        };

        com.post(api.personel.updateUserForPhoto, param, function(res) {

            user.userPhoto = com.focusPage("#picture").val();
            user.identityPathF = com.focusPage("#picture1").val();
            user.identityPathB = com.focusPage("#picture2").val();

            com.showAlert(com.info, "操作成功");

            user.modals.pictureModal.modal("hide");

            userSeacher.doSearch();
        });
    }

    function removePicture() {

        com.focusPage("#showImg").attr("src", "#");
        com.focusPage("#picture").val("");
        com.focusPage("#userPhoto").attr("href", "javascript:void(0)");
    }

    function removePicture1() {

        com.focusPage("#showImg1").attr("src", "#");
        com.focusPage("#picture1").val("");
        com.focusPage("#identityPathF").attr("href", "javascript:void(0)");
    }

    function removePicture2() {

        com.focusPage("#showImg2").attr("src", "#");
        com.focusPage("#picture2").val("");
        com.focusPage("#identityPathB").attr("href", "javascript:void(0)");
    }

    user.items.dept = com.focusPage("#dept", "#transferModal");
    user.items.duty = com.focusPage("#duty", "#transferModal");
    user.items.deptType = com.focusPage("#deptType", "#transferModal");

    user.items.deptType.on("change", function(b, d) {

        com.post(api.system.queryDutyByDtid, {
            "duty.departmentType.dtid": $(this).val()
        }, function(res) {

            user.dutyTypeMap = res.dutys;
            user.items.duty.bindData(user.dutyTypeMap, "did", "name");
        });

        com.post(api.communion.queryDepartmentByDtid, {
            "dept.type.dtid": $(this).val()
        }, function(res) {

            user.items.dept.bindData(res.deptList, "did", "name");
            d && d();
        });

    }).trigger("change");

    user.items.deptType.bindData(user.deptType, "dtid", "name");

    function transfer(v) {

        user.items.deptType.val(v.dept.type.dtid).trigger("change", function() {

            user.items.dept.val(v.dept.did);
            user.items.duty.val(v.duty.did);
        });

        com.cleanTypeahead(user.items.company);

        com.post(api.personel.queryUserByUserId, {
            "user.userId": v.userId
        }, function(res) {

            var v = res.user;

            user.items.oldcompany.val(v.companys);

            com.updateTypeahead("roleTran", v.role.rid, v.role.name);
            com.updateTypeahead("company", v.companyNo, v.companys);

        }, null, false);

        user.modals.transferModal.modal("show");

    }

    user.items.isPrefor.bindData(constant.personel.userExperience.isPrefor.datas, "key", "value");

    function save() {

        if (com.validate('transferModal'))
            return false;

        var param = {
            "user.userId": params.personel.userId,

            "user.companys": com.typeahead(user.items.company),
            "user.dtid": user.items.deptType.val(),
            "user.dept.did": user.items.dept.val(),
            "user.duty.did": user.items.duty.val(),
            "user.role.rid": com.typeahead("roleTran"),
            "user.isPrefor": user.getProp[user.items.isPrefor.prop("checked")],
            "approve": "agree"
        };

        com.post(api.personel.tranUser, param, function(res) {

            com.showAlert(com.info, "调职成功");

            user.modals.transferModal.modal("hide");

            userSeacher.doSearch();
        });
    }

    function showDepaermentModal(value) {

        $wrap = com.focusPage('#moduleModal').find('.modal-body').empty();
        com.post(api.communion.queryDepartment, {
            "dept.type.name": value
        }, function(res) {

            var tree = res.deptList;
            var childtree = [];

            if (!tree || !tree.length) {
                return;
            }
            var menuArr = {
                level1: [],
                level2: [],
                level3: []
            };
            var menuObj = {
                level1: {},
                level2: {},
                level3: {}
            };
            var $tree = $('<ol class="dd-list"></ol>');
            $wrap.append($tree);
            menuArr.level1 = [{
                did: -1,
                name: "全部"
            }];

            $.each(tree, function(i, va) {

                var aa = true;
                if (menuArr.level2.length > 0) {
                    $.each(menuArr.level2, function(j, vl) {

                        if (va.fatherDept.did == vl.did) {
                            aa = false;
                            return false;
                        }
                    })
                } else if (va.fatherDept.did != null && va.fatherDept.did != 0) {
                    aa = false;
                    menuArr.level2.push(va.fatherDept);
                }
                if (aa) {
                    if (va.fatherDept.did != null && va.fatherDept.did != 0)
                        menuArr.level2.push(va.fatherDept);
                }
                if (va.fatherDept.did == null || va.fatherDept.did == 0) {
                    childtree.push(va)
                }
            });

            $.each(childtree, function(j, vb) {

                var bb = true;
                $.each(menuArr.level2, function(j, vl) {

                    if (vb.did == vl.did) {
                        bb = false;
                        return false;
                    }
                });
                if (bb) {
                    menuArr.level2.push(vb);
                }
            });

            $.each(menuArr.level2, function(i, va) {

                $.each(tree, function(index, value) {

                    if (value.fatherDept.did == va.did) {
                        menuArr.level3.push(value)
                    }
                })
            });

            if (menuArr.level1.length) {
                $.each(menuArr.level1, function(i, va) {

                    var $li = $('<li></li>').addClass('dd-item');
                    var $div = $('<div></div>').addClass('dd-handle clearfix').text(va.name);
                    var $input = $('<input>').attr({
                        type: 'checkbox',
                        name: 'module'
                    }).addClass('ace').val(va.did);
                    var $indexCheck = $('<div></div>').addClass('checkbox pull-right').css({
                        'margin-bottom': '0',
                        'margin-top': '-5px'
                    });
                    var $label = $('<label></label>').append($input).append('<span class="lbl"></span>');
                    $indexCheck.append($label).appendTo($div);
                    $li.append($div).appendTo($tree);
                    menuObj.level1[va.did] = $li;
                });
            }

            if (menuArr.level2.length) {
                $.each(menuArr.level2, function(i, va) {

                    var $li = $('<li></li>').addClass('dd-item');
                    var $div = $('<div></div>').addClass('dd-handle clearfix').text(va.name);
                    var $indexCheck = $('<div></div>').addClass('checkbox pull-right').css({
                        'margin-bottom': '0',
                        'margin-top': '-5px'
                    });
                    var $label = $('<label></label>').append('<span class="lbl"></span>');
                    $indexCheck.append($label).appendTo($div);
                    menuObj.level2[va.did] = $li;
                    $li.append($div);

                    var $parent = menuObj.level1[-1];
                    $parent.children('div').hasClass('btn-default') || $parent.children('div').addClass('btn-default');
                    if (!$parent.children('button').length) {
                        var $title = $parent.children('div');
                        $('<button type="button" data-action="collapse" class="minus hide">Collapse</button>').insertBefore($title);
                        $('<button type="button" data-action="expand" class="plus">Expand</button>').insertBefore($title);
                    }

                    var $pol = $parent.children('ol').length ? $parent.children('ol') : $('<ol></ol>').addClass('dd-list hide').appendTo($parent).attr("id", "one");
                    $li.appendTo($pol);
                });
            }

            if (menuArr.level3.length) {
                $.each(menuArr.level3, function(i, va) {

                    var $li = $('<li></li>').addClass('dd-item');
                    var $div = $('<div></div>').addClass('dd-handle clearfix').text(va.name);
                    var $input = $('<input>').attr({
                        type: 'checkbox',
                        name: 'module'
                    }).addClass('ace').val(va.did);
                    var $indexCheck = $('<div></div>').addClass('checkbox pull-right').css({
                        'margin-bottom': '0',
                        'margin-top': '-5px'
                    });
                    var $label = $('<label></label>').append($input).append('<span class="lbl"></span>');
                    $indexCheck.append($label).appendTo($div);
                    menuObj.level3[va.did] = $li;
                    $li.append($div);

                    var $parent = menuObj.level2[va.fatherDept.did];
                    $parent.children('div').hasClass('btn-default') || $parent.children('div').addClass('btn-default');
                    if (!$parent.children('button').length) {
                        var $title = $parent.children('div');
                        // 减号
                        $('<button type="button" data-action="collapse" class="minus ">Collapse</button>').insertBefore($title);
                        $('<button type="button" data-action="expand" class="plus">Expand</button>').insertBefore($title);
                    }

                    var $pol = $parent.children('ol').length ? $parent.children('ol') : $('<ol></ol>').addClass('dd-list hide').appendTo($parent).attr("id", "two");
                    $li.appendTo($pol);
                });
            }

            com.focusPage('button[data-action="collapse"]').click(function() {

                var $this = $(this);
                $this.siblings('ol').addClass('hide');
                $this.parent().find('.plus').toggleClass('hide');
                $this.parent().find('.minus').removeClass('hide');
                $this.siblings('ol').find('.dd-list').addClass('hide');
                $this.toggleClass('hide');
            });

            com.focusPage('button[data-action="expand"]').click(function() {

                var $this = $(this);
                $this.siblings('ol').removeClass('hide');
                $this.parent().find('.minus').toggleClass('hide');
                $this.parent().find('.plus').removeClass('hide');
                $this.toggleClass('hide');
            });

        }, null, false);
    }

    function dialogUserAdvanceIndex(userId) {

        user.userId = userId;

        var options = {
            "user.userId": userId
        };

        com.post(api.personel.queryUserByUserId, options, function(res) {

            var userinfo = res.user;

            user.items.isLogin.prop("checked", (userinfo.isLogin & constant.personel.user.ISLOGIN_FIP_INT) == constant.personel.user.ISLOGIN_FIP_INT);
            user.items.macs.prop("checked", (userinfo.extranet & constant.personel.user.EXTRANET_MAC_INT) == constant.personel.user.EXTRANET_MAC_INT);
            user.items.ips.prop("checked", (userinfo.extranet & constant.personel.user.EXTRANET_IP_INT) == constant.personel.user.EXTRANET_IP_INT);
            user.items.qcode.prop("checked", (userinfo.extranet & constant.personel.user.EXTRANET_QCODE_INT) == constant.personel.user.EXTRANET_QCODE_INT);
            user.items.webs.prop("checked", (userinfo.extranet & constant.personel.user.EXTRANET_WEB_INT) == constant.personel.user.EXTRANET_WEB_INT);
            user.items.pcs.prop("checked", (userinfo.extranet & constant.personel.user.EXTRANET_PC_INT) == constant.personel.user.EXTRANET_PC_INT);

            user.modals.userAdvanceModal.modal("show");

        }, null, false);
    }

    function saveAdvanceData() {

        var extranet = constant.personel.user.EXTRANET_NONE_INT;

        extranet += (user.items.macs.prop("checked") ? constant.personel.user.EXTRANET_MAC_INT : constant.personel.user.EXTRANET_NONE_INT);
        extranet += (user.items.ips.prop("checked") ? constant.personel.user.EXTRANET_IP_INT : constant.personel.user.EXTRANET_NONE_INT);
        extranet += (user.items.qcode.prop("checked") ? constant.personel.user.EXTRANET_QCODE_INT : constant.personel.user.EXTRANET_NONE_INT);
        extranet += (user.items.webs.prop("checked") ? constant.personel.user.EXTRANET_WEB_INT : constant.personel.user.EXTRANET_NONE_INT);
        extranet += (user.items.pcs.prop("checked") ? constant.personel.user.EXTRANET_PC_INT : constant.personel.user.EXTRANET_NONE_INT);

        var options = {
            "user.userId": user.userId,
            "user.isLogin": user.items.isLogin.prop("checked") ? constant.personel.user.ISLOGIN_FIP_INT : constant.personel.user.ISLOGIN_NOT_INT,
            "user.extranet": extranet,
        };

        com.post(api.personel.updateUserForAdvance, options, function(res) {

            com.showAlert(com.info, "提交成功");
        });

        user.modals.userAdvanceModal.modal("hide");

        return false;
    }

    function resetPassword(userId, userName) {

        com.showConfirm("确定要重置(" + userName + ")的密码吗?", function(result) {

            com.post(api.personel.resetPassword, {
                'user.userId': userId
            });
        });
    }

    function defaultPassword(userId, userName) {

        com.showConfirm("确定要重置(" + userName + ")密码为默认密码?", function(result) {

            com.post(api.personel.defaultPassword, {
                'user.userId': userId
            });
        });
    }

    function saveUserRole() {

        var $span = com.focusPage('#roles>li');

        var params = {
            "user.uid": user.uid
        };

        $.each($span, function(i, v) {

            var $input = $(v);

            var row = {
                "vpid": $input.attr('rid')
            };

            params["rids[" + i + "]"] = row.vpid;
        });

        com.post(api.personel.updateUserRole, params, function(res) {

            user.modals.userRoleModal.modal("hide");
        });
    }

    function saveUserCompany() {

        var $inputs = com.focusPage('input[name="corporab"]:checked');

        var params = {
            "user.uid": user.uid
        };

        $.each($inputs, function(i, v) {

            var $input = $(v);

            var row = {
                "vpid": $input.attr('id')
            };

            params["cids[" + i + "]"] = row.vpid;
        });

        com.post(api.personel.updateUserCompany, params, function(res) {

            user.modals.userCompanyModal.modal("hide");
        });
    }

    function saveUserDepartment() {

        var $inputs = com.focusPage('input[name="deptcheck"]:checked');

        var params = {
            "user.uid": user.uid
        };

        $.each($inputs, function(i, v) {

            var $input = $(v);

            params["dids[" + i + "]"] = $input.attr('id');
        });

        com.post(api.personel.updateUserDepartment, params, function(res) {

            user.modals.userDepartmentModal.modal("hide");
        });
    }

    /**
     * 显示公司选择弹窗 - 用于同步权限功能
     * 
     * @param {Number} uid - 用户ID
     * @param {String} userName - 用户姓名
     */
    function showCompanySelectionModal(uid, userName) {

        // 设置源用户信息
        com.focusPage('#sourceUserName').text(userName);
        com.focusPage('#syncRightUserName').text('从用户【' + userName + '】同步权限到其他公司');

        var companyList = com.focusPage('#companyList');

        // 清空公司列表
        companyList.html('<div class="text-center"><i class="ace-icon fa fa-spinner fa-spin fa-2x"></i><p>正在加载公司列表...</p></div>');

        // 加载公司列表
        com.post(api.system.queryCompany, {}, function(data) {

            if (!data.companys || data.companys.length == 0) {
                companyList.html('<div class="text-center text-muted">暂无可选公司</div>');
                return false;
            }

            companyList.html("");

            data.companys.forEach(function(company) {

                var item = $('<div class="company-item"></div>').appendTo(companyList);
                var label = $('<label class="checkbox-inline"></label>').appendTo(item);
                var input = $('<input type="checkbox" class="ace company-checkbox" value="' + company.cid + '"></input>').appendTo(label);
                var span = $('<span class="lbl">' + company.name + '</span>').appendTo(label);

                label.click(function(e) {

                    $(this).find("input").prop("checked", "checked");

                    e.stopPropagation();

                    return false;
                });
            });
        }, function() {

            companyList.html('<div class="text-center text-danger">加载公司列表失败</div>');
        });
    }

    /**
     * 确认同步权限操作
     */
    function confirmSyncRight() {

        var selectedCompanies = [];
        com.focusPage('.company-checkbox:checked').each(function() {

            selectedCompanies.push($(this).val());
        });

        if (selectedCompanies.length === 0) {
            com.showAlert(com.warning, '请至少选择一个目标公司');
            return;
        }

        // 禁用按钮，防止重复提交
        var $confirmBtn = com.focusPage('#confirmSyncRightBtn');
        $confirmBtn.prop('disabled', true).html('<i class="ace-icon fa fa-spinner fa-spin fa-1x"></i> 正在同步...');

        // 构建请求参数
        var params = {
            'user.userId': user.userId,
            'companys[0].cid': selectedCompanies[0]
        };

        // 如果选择了多个公司，添加其他公司参数
        for ( var i = 1; i < selectedCompanies.length; i++) {
            params['companys[' + i + '].cid'] = selectedCompanies[i];
        }

        // 调用同步接口
        com.post(api.right.syncDecorationRight, params, function(data) {

            if (data.errorCode == 0) {
                com.showAlert(com.info, '权限同步成功！');
                user.modals.companyCopyModal.modal('hide');

                // 刷新用户列表
                setTimeout(function() {

                    if (typeof userSeacher !== 'undefined') {
                        userSeacher.doSearch();
                    }
                }, 500);
            } else {
                com.showAlert(com.error, data.errorMsg || '权限同步失败');
            }
        }, function(error) {

            console.error('权限同步失败:', error);
            com.showAlert(com.error, '权限同步失败，请重试');
            // 确保在失败时也恢复按钮状态
            $confirmBtn.prop('disabled', false).html('确认同步');
        }, function() {

            // 恢复按钮状态 - complete回调在成功或失败后都会执行
            $confirmBtn.prop('disabled', false).html('确认同步');
        });
    }

    // 绑定同步权限弹窗的确认按钮事件
    com.focusPage('#confirmSyncRightBtn').on("click", confirmSyncRight);

    // 绑定同步权限弹窗的关闭事件，清理滚动事件监听器
    com.focusPage('#companyCopyModal').on('hidden.bs.modal', function() {

        // 清理滚动事件监听器，避免内存泄漏
        com.focusPage('#companyList').off('wheel mousewheel DOMMouseScroll');
    });

});