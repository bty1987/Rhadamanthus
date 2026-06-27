$(function() {

    var instorer = {

        btns: {
            saveBtn: com.focusPage("#saveUserBtn"),

            advanceSaveBtn: com.focusPage("#advanceSaveBtn")
        },

        modals: {
            addInstorerModal: com.focusPage("#addInstorerModal"),
            showInstorerModal: com.focusPage("#showInstorerModal"),
            advanceModal: com.focusPage("#instorerAdvanceModal")
        },

        items: {
            loginId: com.focusPage("#loginId", "#addInstorerModal"),
            userName: com.focusPage("#userName", "#addInstorerModal"),
            phone: com.focusPage("#phone", "#addInstorerModal"),
            deptTypeSel: com.focusPage("#deptTypeSel", "#addInstorerModal"),
            deptSel: com.focusPage("#deptSel", "#addInstorerModal"),
            dutySel: com.focusPage("#dutySel", "#addInstorerModal"),
            statusSel: com.focusPage("#statusSel", "#addInstorerModal"),
            oldUserId: com.focusPage("#oldUserId", "#addInstorerModal"),

            isLogin: com.focusPage("#isLogin").switchBtn("isOrNot"),
            ips: com.focusPage("#ips").switchBtn("isOrNot"),
            macs: com.focusPage("#macs").switchBtn("isOrNot"),
            qcode: com.focusPage("#qcode").switchBtn("isOrNot"),
            webs: com.focusPage("#webs").switchBtn("isOrNot"),
            pcs: com.focusPage("#pcs").switchBtn("isOrNot"),

            roleSel: com.focusPage("#roleSel", "#instorerAdvanceModal"),
            oldcompany: com.focusPage("#oldcompany", "#instorerAdvanceModal"),
            company: com.focusPage("#company", "#instorerAdvanceModal")
        },

        deptType: {},
        statusType: {},

        roleList: {},

        userId: null,
        company: null,
        instorerUid: null,

        pageType: params['urlLoadParams'].type,
    };

    instorer.modals.addInstorerModal.on('hidden.bs.modal', function(e) {

        com.cleanItems(instorer.items);
        com.closeTip();
        com.focusPage("#addInstorerModal").find(".form-group").removeClass("hide");
        instorer.instorerUid = null;
    });

    instorer.items.statusSel = com.focusPage("#statusSel").bindData(constant.personel().user.status.datas, "key", "value");

    com.initTypeahead("roleSel", api.system.queryRoleByName, 'role.name', {}, "roleList", 'rid', 'name');

    com.post(api.communion.queryDepartmentType, {}, function(res) {

        instorer.items.deptTypeSel.bindData(res.departmentTypes, "dtid", "name");
    }, null, false);

    com.post(api.system.queryCompany, {}, function(res) {

        instorer.items.company.bindData(res.companys, "cid", "name");
    }, null, false);

    instorer.items.loginId.on("blur", function() {

        $this = $(this);

        var _loginId = $this.val();

        if (_loginId.trim() == "")
            return false;

        com.post(api.personel.queryUserByLoginId, {
            "user.loginId": _loginId
        }, function(res) {

            // com.showAlert(com.warning, "用户名已存在");
            com.showTip(instorer.items.loginId, "用户名已存在", "right");
            instorer.items.loginId.val("");
        }, function(error) {

        });
    });

    instorer.items.deptTypeSel.on("change", function(b, d) {

        com.post(api.system.queryDutyByDtid, {
            "duty.departmentType.dtid": $(this).val()
        }, function(res) {

            instorer.items.dutySel.bindData(res.dutys, "did", "name");
        });

        com.post(api.communion.queryDepartmentByDtid, {
            "dept.type.dtid": $(this).val()
        }, function(res) {

            instorer.items.deptSel.bindData(res.deptList, "did", "name");
        });
    }).trigger("change");

    instorer.btns.saveBtn.on("click", saveData);

    instorer.btns.advanceSaveBtn.on("click", saveAdvance);

    var lineprops = (function() {

        return [{
            field: "userId",
            name: "编号",
            prop: "userId",
            clazz: "grey"
        }, {
            field: "loginId",
            name: "用户名",
            prop: "loginId",
            clazz: "grey"
        }, {
            field: "dept.name",
            name: "部门",
            prop: "dept.name",
            clazz: "grey"
        }, {
            field: "duty.name",
            name: "职位",
            prop: "duty.name",
            clazz: "grey"
        }, {
            field: "phone",
            name: "联系方式",
            prop: "phone",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        var btns = {};

        btns.view = {
            name: "查看",
            clazz: "btn-blue",
            handle: function(v) {

                com.focusPage("text").css("line-height", "27px");
                com.post(api.personel.queryUserInfoByUserId, {
                    "userInfo.user.userId": v.userId
                }, function(res) {

                    bindUserInfo(res.userInfo);
                    com.focusPage("#checkUserInfo").modal('show');
                });
            }
        };

        if (instorer.pageType == 'manage') {
            btns.edit = {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {

                    com.focusPage("#addInstorerModal").find("h4").html("编辑厂商");
                    com.focusPage("#addInstorerModal").find(".form-group").addClass("hide");
                    com.focusPage(".show").removeClass("hide");
                    instorer.items.userName.val(v.userName);
                    instorer.items.phone.val(v.phone);
                    instorer.items.oldUserId.val(v.oldUserId);
                    instorer.instorerUid = v.uid;
                    instorer.modals.addInstorerModal.modal("show");
                }
            };
            btns.right = {
                name: "权配",
                clazz: "btn-success",
                handle: function(v) {

                    showAdvance(v.userId);
                }
            };
            btns.resetPassword = {
                name: "重置密码",
                clazz: "btn-danger",
                handle: function(v) {

                    resetPassword(v.userId, v.userName);
                }
            };
            btns.defaultPassword = {
                name: "默认密码",
                clazz: "btn-warning",
                handle: function(v) {

                    defaultPassword(v.userId, v.userName);
                }
            };
        } else {
            btns.edit = {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {

                    com.focusPage("#addInstorerModal").find("h4").html("编辑厂商");
                    com.focusPage("#addInstorerModal").find(".form-group").addClass("hide");
                    com.focusPage(".show").removeClass("hide");
                    instorer.items.userName.val(v.userName);
                    instorer.items.phone.val(v.phone);
                    instorer.items.oldUserId.val(v.oldUserId);
                    instorer.instorerUid = v.uid;
                    instorer.modals.addInstorerModal.modal("show");
                }
            };
        }

        return btns;
    })();

    var buttons = (function() {

        var $addaS = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addInstorer').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($addaS);
        $('<span></span>').text('添加').appendTo($addaS);

        return [$addaS];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.personel.pageInstorer, null, ['personel-userId', 'personel-userName', 'personel-userstatus', 'personel-phone'], "instorerPostData", null, false, buildInstorerButtons);
    searcher.line("userName", lineprops, linebtns).render();

    com.focusPage('a[name="addInstorer"]', '#pagenation').click(function() {

        com.focusPage("#addInstorerModal").find("h4").html("添加厂商");
        instorer.modals.addInstorerModal.modal("show");
    });

    function saveData() {

        if (com.validate("addInstorerModal"))
            return false;

        var options = {
            "instorer.oldUserId": instorer.items.oldUserId.val(),
            "instorer.loginId": instorer.items.loginId.val(),
            "instorer.userName": instorer.items.userName.val().trim(),
            "instorer.currentName": instorer.items.userName.val().trim(),
            "instorer.gender": 0,
            "instorer.identity": "",
            "instorer.phone": instorer.items.phone.val(),

            "instorer.dtid": instorer.items.deptTypeSel.val(),
            "instorer.dept.did": instorer.items.deptSel.val(),
            "instorer.duty.did": instorer.items.dutySel.val(),
            "instorer.status": instorer.items.statusSel.val()
        };

        var url = api.personel.addInstorer;

        if (instorer.instorerUid != null) {
            url = api.personel.updateInstorer;
            options["instorer.uid"] = instorer.instorerUid;
        }

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");
            instorer.modals.addInstorerModal.modal("hide");

            searcher.doSearch();
        });
    }

    // 查看页面绑定人员信息
    function bindUserInfo($userInfo) {

        com.focusPage("#userIdCheck").html(com.checkNull($userInfo.user.userId, "无"));
        com.focusPage("#oldUserIdCheck").html(com.checkNull($userInfo.user.oldUserId, "无"));
        com.focusPage("#userNameCheck").html($userInfo.user.userName);
        com.focusPage("#currentNameCheck").html($userInfo.user.currentName);
        com.focusPage("#genderCheck").html($userInfo.user.gender);
        com.focusPage("#ageCheck").html($userInfo.age);
        com.focusPage("#birthdayCheck").html($userInfo.user.birthday);
        com.focusPage("#politicalSelCheck").html(com.checkNull($userInfo.political, "无"));
        com.focusPage("#jobYearsCheck").html(com.checkNull($userInfo.jobYears, "无"));
        com.focusPage("#identityCheck").html($userInfo.user.identity);
        com.focusPage("#phoneCheck").html($userInfo.user.phone);
        com.focusPage("#addressCheck").html(com.checkNull($userInfo.address, "无"));
        com.focusPage("#hometownAddressCheck").html(com.checkNull($userInfo.hometownAddress, "无"));
        com.focusPage("#householdSelCheck").html(com.checkNull($userInfo.householdType, "无"));
        com.focusPage("#emergencyManCheck").html(com.checkNull($userInfo.emergencyMan, "无"));
        com.focusPage("#emergencyPhoneCheck").html(com.checkNull($userInfo.emergencyPhone, "无"));
        com.focusPage("#isPresentGraduateCheck").html(com.checkNull($userInfo.isPresentGraduate, "无"));
        com.focusPage("#graduateTimeCheck").html(com.checkNull($userInfo.graduateTime, "无"));
        com.focusPage("#schoolCheck").html(com.checkNull($userInfo.school, "无"));
        com.focusPage("#educationSelCheck").html(com.checkNull($userInfo.education, "无"));
        com.focusPage("#specialtyCheck").html(com.checkNull($userInfo.specialty, "无"));
        com.focusPage("#isMarriedCheck").html(com.checkNull($userInfo.isMarried, "无"));
        com.focusPage("#isBirthCheck").html(com.checkNull($userInfo.isBirth, "无"));
        com.focusPage("#isHouseLoanCheck").html(com.checkNull($userInfo.isHouseLoan, "无"));
        com.focusPage("#isCarLoanCheck").html(com.checkNull($userInfo.isCarLoan, "无"));
        com.focusPage("#houseTypeSelCheck").html(com.checkNull($userInfo.houseType, "无"));
        com.focusPage("#loverCheck").html(com.checkNull($userInfo.lover, "无"));
        com.focusPage("#loginIdCheck").html($userInfo.user.loginId);
        com.focusPage("#companyCheck").html(com.checkNull($userInfo.user.companys, "无"));

        com.focusPage("#deptTypeSelCheck").html($userInfo.user.duty.departmentType.name);
        com.focusPage("#deptSelCheck").html($userInfo.user.dept.name);
        com.focusPage("#dutySelCheck").html($userInfo.user.duty.name);

        com.focusPage("#statusSelCheck").html(user.statusType[$userInfo.user.status].value);
        com.focusPage("#employWaySelCheck").html(com.checkNull($userInfo.employWay, "无"));
        com.focusPage("#employTypeSelCheck").html(com.checkNull($userInfo.employType, "无"));
        com.focusPage("#recommendManCheck").html(com.checkNull($userInfo.recommendMan, "无"));
        com.focusPage("#entryTimeCheck").html($userInfo.entryTime);
        com.focusPage("#employTimeCheck").html(com.checkNull($userInfo.employTime, "无"));
        com.focusPage("#serviceYearsCheck").html(com.checkNull($userInfo.serviceYears, "无"));
        com.focusPage("#isContractCheck").html(com.checkNull($userInfo.isContract, "无"));
        com.focusPage("#isInsuranceCheck").html(com.checkNull($userInfo.isInsurance, "无"));
        com.focusPage("#insuranceTimeCheck").html(com.checkNull($userInfo.insuranceTime, "无"));
        com.focusPage("#pensionNumCheck").html(com.checkNull($userInfo.pensionNum, "无"));
        com.focusPage("#medicalNumCheck").html(com.checkNull($userInfo.medicalNum, "无"));
        com.focusPage("#salaryCheck").html($userInfo.salary);
        com.focusPage("#bankCheck").html(com.checkNull($userInfo.bank, "无"));
        com.focusPage("#bankCardNumCheck").html(com.checkNull($userInfo.bankCardNum, "无"));
    }

    function showAdvance(userId) {

        instorer.userId = userId;

        var options = {
            "user.userId": userId
        };

        com.post(api.personel.queryUserByUserId, options, function(res) {

            var user = res.user;

            instorer.items.isLogin.prop("checked", (user.isLogin & constant.personel.user.ISLOGIN_FIP_INT) == constant.personel.user.ISLOGIN_FIP_INT);
            instorer.items.macs.prop("checked", (user.extranet & constant.personel.user.EXTRANET_MAC_INT) == constant.personel.user.EXTRANET_MAC_INT);
            instorer.items.ips.prop("checked", (user.extranet & constant.personel.user.EXTRANET_IP_INT) == constant.personel.user.EXTRANET_IP_INT);
            instorer.items.qcode.prop("checked", (user.extranet & constant.personel.user.EXTRANET_QCODE_INT) == constant.personel.user.EXTRANET_QCODE_INT);
            instorer.items.webs.prop("checked", (user.extranet & constant.personel.user.EXTRANET_WEB_INT) == constant.personel.user.EXTRANET_WEB_INT);
            instorer.items.pcs.prop("checked", (user.extranet & constant.personel.user.EXTRANET_PC_INT) == constant.personel.user.EXTRANET_PC_INT);

            instorer.items.oldcompany.val(user.companys);
            com.updateTypeahead("roleSel", user.role.rid, user.role.name);

            instorer.modals.advanceModal.modal("show");

        }, null, false);
    }

    function saveAdvance() {

        var extranet = constant.personel.user.EXTRANET_NONE_INT;

        extranet += (instorer.items.macs.prop("checked") ? constant.personel.user.EXTRANET_MAC_INT : constant.personel.user.EXTRANET_NONE_INT);
        extranet += (instorer.items.ips.prop("checked") ? constant.personel.user.EXTRANET_IP_INT : constant.personel.user.EXTRANET_NONE_INT);
        extranet += (instorer.items.qcode.prop("checked") ? constant.personel.user.EXTRANET_QCODE_INT : constant.personel.user.EXTRANET_NONE_INT);
        extranet += (instorer.items.webs.prop("checked") ? constant.personel.user.EXTRANET_WEB_INT : constant.personel.user.EXTRANET_NONE_INT);
        extranet += (instorer.items.pcs.prop("checked") ? constant.personel.user.EXTRANET_PC_INT : constant.personel.user.EXTRANET_NONE_INT);

        var options = {
            "user.userId": instorer.userId,
            "user.isLogin": instorer.items.isLogin.prop("checked") ? constant.personel.user.ISLOGIN_FIP_INT : constant.personel.user.ISLOGIN_NOT_INT,
            "user.extranet": extranet,
            "user.role.rid": com.typeahead("roleSel"),
            "user.companys": instorer.items.company.val()
        };

        com.post(api.personel.updateUserForAdvance, options, function(res) {

            com.showAlert(com.info, "提交成功");
        });

        instorer.modals.advanceModal.modal("hide");

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

});
