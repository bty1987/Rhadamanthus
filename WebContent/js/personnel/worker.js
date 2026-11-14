$(function() {

    var worker = {

        btns: {
            saveBtn: com.focusPage("#saveUserBtn")
        },

        modals: {
            addWorkerModal: com.focusPage("#addWorkerModal"),
            showWorkerModal: com.focusPage("#showWorkerModal")
        },

        items: {
            loginId: com.focusPage("#loginId", "#addWorkerModal"),
            userName: com.focusPage("#userName", "#addWorkerModal"),
            phone: com.focusPage("#phone", "#addWorkerModal"),
            deptTypeSel: com.focusPage("#deptTypeSel", "#addWorkerModal"),
            deptSel: com.focusPage("#deptSel", "#addWorkerModal"),
            dutySel: com.focusPage("#dutySel", "#addWorkerModal"),
            statusSel: com.focusPage("#statusSel", "#addWorkerModal"),
            oldUserId: com.focusPage("#oldUserId", "#addWorkerModal")
        },

        workerUid: null,
    };

    worker.modals.addWorkerModal.on('hidden.bs.modal', function(e) {

        com.cleanItems(worker.items);
        com.closeTip();
        com.focusPage("#addWorkerModal").find(".form-group").removeClass("hide");
        worker.workerUid = null;
    });

    worker.items.statusSel = com.focusPage("#statusSel").bindData(constant.personel().user.status.datas, "key", "value");

    com.post(api.communion.queryDepartmentType, {}, function(res) {

        worker.items.deptTypeSel.bindData(res.departmentTypes, "dtid", "name");
    }, null, false);

    worker.items.loginId.on("blur", function() {

        $this = $(this);

        var _loginId = $this.val();

        if (_loginId.trim() == "")
            return false;

        com.post(api.personel.queryUserByLoginId, {
            "user.loginId": _loginId
        }, function(res) {

            // com.showAlert(com.warning, "用户名已存在");
            com.showTip(worker.items.loginId, "用户名已存在", "right");
            worker.items.loginId.val("");
        }, function(error) {

        });
    });

    worker.items.deptTypeSel.on("change", function(b, d) {

        com.post(api.system.queryDutyByDtid, {
            "duty.departmentType.dtid": $(this).val()
        }, function(res) {

            worker.items.dutySel.bindData(res.dutys, "did", "name");
        });

        com.post(api.communion.queryDepartmentByDtid, {
            "dept.type.dtid": $(this).val()
        }, function(res) {

            worker.items.deptSel.bindData(res.deptList, "did", "name");
        });
    }).trigger("change");

    worker.btns.saveBtn.on("click", saveData);

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
                    com.focusPage("#showWorkerModal").modal('show');
                });
            }
        };

        // 权配(updateUserForAdvance)未接入:其 user.companys 参数要求 AES 加密串,明文 cid 后端解密必失败,与 app 版页面保持一致暂不提供
        btns.edit = {
            name: "编辑",
            clazz: "btn-yellow",
            handle: function(v) {

                com.focusPage("#addWorkerModal").find("h4").html("编辑工人");
                com.focusPage("#addWorkerModal").find(".form-group").addClass("hide");
                com.focusPage(".show").removeClass("hide");
                worker.items.userName.val(v.userName);
                worker.items.phone.val(v.phone);
                worker.items.oldUserId.val(v.oldUserId);
                worker.workerUid = v.uid;
                worker.modals.addWorkerModal.modal("show");
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

        return btns;
    })();

    var buttons = (function() {

        var $addaS = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addWorker').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($addaS);
        $('<span></span>').text('添加').appendTo($addaS);

        return [$addaS];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.personel.pageWorker, null, ['personel-userId', 'personel-userName', 'personel-userstatus', 'personel-phone'], "workerPostData", null, false, buttons);
    searcher.line("userName", lineprops, linebtns).render();

    com.focusPage('a[name="addWorker"]', '#pagenation').click(function() {

        com.focusPage("#addWorkerModal").find("h4").html("添加工人");
        worker.modals.addWorkerModal.modal("show");
    });

    function saveData() {

        if (com.validate("addWorkerModal"))
            return false;

        var options = {
            "worker.oldUserId": worker.items.oldUserId.val(),
            "worker.loginId": worker.items.loginId.val(),
            "worker.userName": worker.items.userName.val().trim(),
            "worker.currentName": worker.items.userName.val().trim(),
            "worker.gender": 0,
            "worker.identity": "",
            "worker.phone": worker.items.phone.val(),

            "worker.dept.did": worker.items.deptSel.val(),
            "worker.duty.did": worker.items.dutySel.val(),
            "worker.status": worker.items.statusSel.val()
        };

        var url = api.personel.addWorker;

        if (worker.workerUid != null) {
            url = api.personel.updateWorker;
            options["worker.uid"] = worker.workerUid;
        }

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");
            worker.modals.addWorkerModal.modal("hide");

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

        com.focusPage("#deptTypeSelCheck").html(com.checkNull($userInfo.user.duty && $userInfo.user.duty.departmentType ? $userInfo.user.duty.departmentType.name : "", "无"));
        com.focusPage("#deptSelCheck").html(com.checkNull($userInfo.user.dept ? $userInfo.user.dept.name : "", "无"));
        com.focusPage("#dutySelCheck").html(com.checkNull($userInfo.user.duty ? $userInfo.user.duty.name : "", "无"));

        com.focusPage("#statusSelCheck").html(com.checkNull(constant.personel().user.status.keys[$userInfo.user.status], "无"));
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
