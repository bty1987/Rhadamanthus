jQuery(function($) {

    var user = {
        postData: {},
        postParam: {},
        userAdvanceItems: {},
        companysel: {},
        task: {},
        rolesel: {},

        user: {
            uid: null
        },

        items: {
            isLogin: com.focusPage("#isLogin").switchBtn("isOrNot"),
            ips: com.focusPage("#ips").switchBtn("isOrNot"),
            macs: com.focusPage("#macs").switchBtn("isOrNot"),
            qcode: com.focusPage("#qcode").switchBtn("isOrNot"),
            webs: com.focusPage("#webs").switchBtn("isOrNot"),
            pcs: com.focusPage("#pcs").switchBtn("isOrNot"),

            roleSel: com.focusPage("#roleSel"),
            company: com.focusPage("#company"),
            usercompany: com.focusPage("#usercompany", "#userCompanyModal"),
            taskpermissions: com.focusPage("#taskpermissions"),
            oldcompany: com.focusPage("#oldcompany"),

            userrole: com.focusPage("#userrole", "#userRoleModal"),
            role: com.focusPage("#role", "#userRoleModal"),
            selectrole: com.focusPage("#roles", "#userRoleModal"),
        },

        btns: {
            advanceSaveBtn: com.focusPage("#advanceSaveBtn").on("click", saveData),
            advanceCancelBtn: com.focusPage("#advanceCancelBtn"),

            saveRoleBtn: com.focusPage("#saveRoleBtn").on("click", saveUserRole),
            saveCompanyBtn: com.focusPage("#saveCompanyBtn").on("click", saveUserCompany),
        },

        modals: {
            userAdvanceModal: com.focusPage("#userAdvanceModal"),
            userCompanyModal: com.focusPage("#userCompanyModal"),
            usertaskModal: com.focusPage("#taskModal"),
            userRoleModal: com.focusPage("#userRoleModal"),
        },

        pageType: params['urlLoadParams'].type,

    }

    com.post(api.system.queryCompany, {}, function(res) {

        user.companysel = res.companys;

    }, null, false);

    com.post(api.communion.queryTask, {
        "task.level": 0
    }, function(res) {

        user.task = res.tasks;
    }, null, false);

    user.items.company.bindData(user.companysel, "cid", "name");

    com.initTypeahead("roleSel", api.system.queryRoleByName, 'role.name', {}, "roleList", 'rid', 'name');
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

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.userName));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                    var $role = $('<a></a>').addClass('btn btn-minier btn-purple').html('角色');
                    var $company = $('<a></a>').addClass('btn btn-minier btn-yellow').html('公司');
                    var $btnRight = $('<a></a>').addClass('btn btn-minier btn-success').html('权配');
                    var $btnMacontrol = $('<a></a>').addClass('btn btn-minier btn-warning').html('权限');
                    var $btnDesigne = $('<a></a>').addClass('btn btn-minier btn-danger').html('装修单设计');
                    var $btnSales = $('<a></a>').addClass('btn btn-minier btn-pink').html('装修单业务');
                    var $btnStatus = $('<a></a>').addClass('btn btn-minier btn-purple').html('装修单状态');
                    var $btnHouse = $('<a></a>').addClass('btn btn-minier btn-yellow').html('房源权配');
                    var $btnCustomer = $('<a></a>').addClass('btn btn-minier btn-success').html('客源权配');
                    var $resetPassword = $('<a></a>').addClass('btn btn-minier btn-warning').html('重置密码');
                    var $defaultPassword = $('<a></a>').addClass('btn btn-minier btn-insverse').html('默认密码');
                    var $btnlogout = $('<a></a>').addClass('btn btn-minier btn-danger').html('登出');

                    var propertyArr = [["员工编号:", v.userId, "grey"], ["用户名:", v.loginId, "grey"], ["部门:", v.dept.name, "grey"], ["职位:", v.duty.name, "grey"], ["角色:", v.role.name, "grey"], ["联系方式:", v.phone, "grey"]];

                    $.each(propertyArr, function(index, value) {

                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $role.unbind().bind('click', function() {

                        user.user.uid = v.uid;

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

                    });

                    $company.unbind().bind('click', function() {

                        user.user.uid = v.uid;

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

                    });

                    $btnMacontrol.click(function() {

                        params["user.uid"] = v.uid;
                        com.popup4page("#layerPopUp", api.index.macontrol.url, "权限");
                    });

                    $btnRight.click(function() {

                        dialogUserAdvanceIndex(v.userId);
                    });

                    $btnDesigne.click(function() {

                        binding.openDesignDialog(v.userId);
                    });

                    $btnSales.unbind().bind('click', function() {

                        binding.openSalesDialog(v.userId);
                    });

                    $btnStatus.click(function() {

                        binding.openOrderDialog(v.userId);
                    });

                    $btnHouse.click(function() {

                        binding.openHouseDialog(v.userId);
                    });

                    $btnCustomer.click(function() {

                        binding.openCustomerDialog(v.userId);
                    });

                    $resetPassword.click(function() {

                        resetPassword(v.userId, v.userName);
                    });

                    $defaultPassword.click(function() {

                        defaultPassword(v.userId, v.userName);
                    });

                    $btnlogout.click(function() {

                        binding.openlogoutDialog(v.userId);
                    });

                    if (user.pageType == 'manage') {
                        $divBtnWrap.append($role).append($company).append($btnRight).append($btnMacontrol).append($btnDesigne).append($btnSales).append($btnStatus).append($btnHouse).append($btnCustomer).append($resetPassword).append($defaultPassword).append($btnlogout).appendTo($h3);
                    } else {
                        $divBtnWrap.append($role).append($company).append($btnRight).append($btnDesigne).append($btnSales).append($btnStatus).append($resetPassword).appendTo($h3);
                    }

                    $liLine.append($h3).append($ulProperty).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

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
        }

        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            setAdvance: function() {

                binding.setAdvance();
            }
        }
    })();

    var _condArr = ['personel-userId', 'personel-userName', 'personel-roleId', 'personel-dept-type', 'personel-deptId', 'personel-userstatus', 'personel-identity', 'personel-phone'];

    var userAdvanceSeacher = new Searcher();

    userAdvanceSeacher.init(_condArr, "condList", api.personel.pageUser, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "userAdvancePostData");

    displayFunc.setAdvance();

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

        user.postData.userId = userId;

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

            user.items.oldcompany.val(userinfo.companys);
            com.updateTypeahead("roleSel", userinfo.role.rid, userinfo.role.name);

            user.modals.userAdvanceModal.modal("show");

        }, null, false);
    }

    function saveData() {

        var extranet = constant.personel.user.EXTRANET_NONE_INT;

        extranet += (user.items.macs.prop("checked") ? constant.personel.user.EXTRANET_MAC_INT : constant.personel.user.EXTRANET_NONE_INT);
        extranet += (user.items.ips.prop("checked") ? constant.personel.user.EXTRANET_IP_INT : constant.personel.user.EXTRANET_NONE_INT);
        extranet += (user.items.qcode.prop("checked") ? constant.personel.user.EXTRANET_QCODE_INT : constant.personel.user.EXTRANET_NONE_INT);
        extranet += (user.items.webs.prop("checked") ? constant.personel.user.EXTRANET_WEB_INT : constant.personel.user.EXTRANET_NONE_INT);
        extranet += (user.items.pcs.prop("checked") ? constant.personel.user.EXTRANET_PC_INT : constant.personel.user.EXTRANET_NONE_INT);

        var options = {
            "user.userId": user.postData.userId,
            "user.isLogin": user.items.isLogin.prop("checked") ? constant.personel.user.ISLOGIN_FIP_INT : constant.personel.user.ISLOGIN_NOT_INT,
            "user.extranet": extranet,
            "user.role.rid": com.typeahead("roleSel"),
            "user.companys": user.items.company.val()
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
            "user.uid": user.user.uid
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
            "user.uid": user.user.uid
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

});
