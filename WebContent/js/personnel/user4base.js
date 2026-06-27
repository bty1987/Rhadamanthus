$(function() {

    var user = {
        statusType: [],
        deptType: [],
        dutyTypeMap: {},
        saveBtn: null,
        cancelBtn: null,
        items: {},
        editLoginId: null,
        deptList: {},
        loginFlag: true,
        simpleAddUserModal: null
    };

    user.simpleAddUserModal = com.focusPage("#simpleAddUserModal");
    user.simpleAddUserModal.on('hide.bs.modal', function(e) {

        com.cleanItems(user.items);
        com.closeTip();
    });

    user.statusType = constant.personel().user.status.datas;

    // 获取部门类型
    com.post(api.communion.queryDepartmentType, {}, function(res) {

        user.deptType = res.departmentTypes;
    }, null, false);

    var lineprops = (function() {

        return [{
            field: "userId",
            name: "员工编号",
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
            field: "role.name",
            name: "角色",
            prop: "role.name",
            clazz: "grey"
        }, {
            field: "phone",
            name: "联系方式",
            prop: "phone",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        return {
            view: {
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
            },
            edit: {
                name: "编辑",
                clazz: "btn-success",
                handle: function(v) {

                    params.personel.userId = v.userId;
                    com.popup4page("#layerPopUp", api.index.userEditIndex.url, "编辑", null, function() {

                        userSeacher.doSearch();
                    });
                }
            },
            exception: {
                name: "工作经历",
                clazz: "btn-pink",
                handle: function(v) {

                    com.focusPage('#userExpModal').modal('show');
                    com.focusPage('#userException').html("");

                    var $uli = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

                    var userExperiences = null;

                    com.post(api.personel.queryUserExperienceByUid, {
                        "userExperience.uid": v.uid
                    }, function(res) {

                        userExperiences = res.userExperiences;
                    }, null, false);

                    if (userExperiences && userExperiences.length) {
                        $.each(userExperiences, function(ind, val) {

                            var $liLi = $('<li></li>').addClass('item-blue clearfix');
                            var $ulPro = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                            var $h2 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + val.type));

                            var ecperienceArr = [["类型:", val.type, "red"], ["备注:", val.comment, "grey"], ["调动时间:", val.createTime, "green"]];

                            $.each(ecperienceArr, function(index, value) {

                                var $liPro = $('<li></li>');
                                $('<strong></strong>').html(value[0]).appendTo($liPro);
                                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liPro);
                                $liPro.appendTo($ulPro);
                            });

                            $liLi.append($h2).append($ulPro).appendTo($uli)
                        })
                    }
                    $uli.appendTo(com.focusPage('#userException'));
                }
            }
        };
    })();
    var buttons = (function() {

        var $addaS = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addUserSimple').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($addaS);
        $('<span></span>').text('添加-简化').appendTo($addaS);

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addUser').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        var $importa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-upload bigger-110').appendTo($importa);
        $('<span></span>').text('上传').appendTo($importa);

        return [$addaS, $adda, $importa];
    })();

    var userSeacher = new Searcher();

    userSeacher.set("condList", "pagenation", "resultList", api.personel.pageUser, null, ['userId', 'userName', 'roleId', 'deptType', 'deptId', 'userstatus', 'identity', 'phone'], "userPostData", null, false, buttons);
    userSeacher.line("userName", lineprops, linebtns).render();

    com.focusPage('a[name="addUser"]', '#pagenation').click(function() {

        params.personel.userId = null;
        com.popup4page("#layerPopUp", api.index.userEditIndex.url, "添加", null, function() {

            com.closePopup();
            userSeacher.doSearch();
        });
    });

    com.focusPage('a[name="addUserSimple"]', '#pagenation').click(function() {

        user.simpleAddUserModal.modal("show");
    });

    com.focusPage('a[name="import"]', '#pagenation').click(function() {

        com.focusPage('#importModal').modal("show");
    });

    com.uploadify("#import", "上传文件", api.salary.importUserSalary, 'btn btn-success col-sm-12', '*.xls;*.xlsx', {
        'uploadType': 4
    }, 1);

    // 添加人员(简化版)
    user.saveBtn = com.focusPage("#saveUserBtn").on("click", saveData);
    user.cancelBtn = com.focusPage("#cancelUserBtn").on("click", function() {

        user.simpleAddUserModal.modal("hide");
    });

    user.items.loginId = com.focusPage("#loginId", "#userinfo").on("blur", function() {

        var $this = $(this);
        var loginId = loginId;

        if (0 == loginId || "" == loginId.trim() || loginId == user.editLoginId) {
            com.showTip(com.focusPage("#loginId", "#userinfo"), "用户名不能为空", "right");
            user.repeatFlg = false;
        } else {
            com.post(api.personel.queryUserByLoginId, {
                "user.loginId": loginId
            }, function(res) {

                user.loginFlag = false;
                com.showTip(com.focusPage("#loginId", "#userinfo"), "用户名已存在", "right");
            }, function(res) {

                user.loginFlag = true;
            });
        }
    });

    user.items.userName = com.focusPage("#userName");
    user.items.currentName = com.focusPage("#currentName");
    user.items.gender = com.focusPage("#gender").switchBtn("gender");
    user.items.birthday = com.focusPage("#birthday");
    user.items.identity = com.focusPage("#identity");
    user.items.phone = com.focusPage("#phone");
    user.items.deptSel = com.focusPage("#deptSel");
    user.items.dutySel = com.focusPage("#dutySel");
    user.items.deptTypeSel = com.focusPage("#deptTypeSel");
    user.items.deptTypeSel.bindData(user.deptType, "dtid", "name");
    user.items.deptTypeSel.on("change", function(b, d) {

        com.post(api.system.queryDutyByDtid, {
            "duty.departmentType.dtid": $(this).val()
        }, function(res) {

            user.dutyTypeMap = res.dutys;
            user.items.dutySel.bindData(user.dutyTypeMap, "did", "name");
        }, null, false);
        com.post(api.communion.queryDepartmentByDtid, {
            "dept.type.dtid": $(this).val()
        }, function(res) {

            user.items.deptSel.bindData(res.deptList, "did", "name");
            d && d();
        }, null, false);
    }).trigger("change");

    user.items.statusSel = com.focusPage("#statusSel").bindData(constant.personel().user.status.datas, "key", "value");

    com.datetime(com.focusPage("#birthday"));

    function saveData() {

        if ("" == user.items.loginId.val().trim() || user.items.loginId.val() == null) {
            com.showTip(com.focusPage("#loginId"), "用户名不能为空", "bottom");
            user.loginFlag = false
        }

        if (!com.validate("simpleAddUserModal") && !user.repeatFlg && user.loginFlag) {
            var options = {
                "userInfo.user.userName": user.items.userName.val().trim(),
                "userInfo.user.currentName": user.items.currentName.val(),
                "userInfo.user.gender": com.genderType[user.items.gender.prop("checked")],
                "userInfo.user.birthday": user.items.birthday.val(),
                "userInfo.user.identity": user.items.identity.val(),
                "userInfo.user.phone": user.items.phone.val(),
                "userInfo.user.loginId": user.items.loginId.val(),
                "userInfo.user.dtid": user.items.deptTypeSel.val(),
                "userInfo.user.dept.did": user.items.deptSel.val(),
                "userInfo.user.duty.did": user.items.dutySel.val(),
                "userInfo.user.status": user.items.statusSel.val(),
                "userInfo.employWay": "",
                "userInfo.entryTime": new Date().getFullYear() + "-" + utils.accAdd(new Date().getMonth(), 1) + "-" + new Date().getDate(),
                "userInfo.political": "",
                "userInfo.isMarried": "",
                "userInfo.isBirth": "",
                "userInfo.isHouseLoan": "",
                "userInfo.isCarLoan": "",
                "userInfo.householdType": "",
                "userInfo.hometownAddress": "",
                "userInfo.address": "",
                "userInfo.isContract": "",
                "userInfo.isInsurance": "",
                "userInfo.bank": "",
                "userInfo.bankCardNum": ""
            };

            com.post(api.personel.addUser, options, function(res) {

                com.showAlert(com.info, "操作成功");
                com.closePopup();
            });
        }
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

        com.focusPage("#statusSelCheck").html(constant.personel().user.status.datas[$userInfo.user.status].value);
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

});
