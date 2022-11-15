jQuery(function(a) {

    var user = {
        politicalType: [],
        householdType: [],
        educationType: [],
        statusType: [],
        employWayType: [],
        employType: [],
        userLevel: [],
        experienceType: [],
        deptType: [],
        insuranceType: [],
        saveBtn: null,
        cancelBtn: null,
        items: {},
        editFlg: !1,
        editUserId: null,
        editLoginId: null,
        roleList: {},
        deptList: {},
        eItems: {},
        eEditFlg: true,
        cItems: {},
        loginFlag: true,
        getProp: {
            "0": true,
            "1": false,
            "true": 0,
            "false": 1
        },
        contractStatus: {},
        modals: {
            addContractModal: com.focusPage('#addContractModal'),
            addEducationModal: com.focusPage('#addEducationModal'),
            addOperationModal: com.focusPage('#addOperationModal')
        },
        cItems: {},
        isExpert: params.personel.isExpert
    };

    if (params.type == 1) {
        com.focusPage('.contractDiv').css('display', 'none');
        com.focusPage('.educationDiv').css('display', 'none');
        com.focusPage('.operationDiv').css('display', 'none');
        com.focusPage('#buttons').css('display', 'none');
    }

    if (user.isExpert == false) {
        com.focusPage("#palary").parents('div.form-group').css('display', 'none');
        com.focusPage("#salary").parents('div.form-group').css('display', 'none');
        com.focusPage("#bank").parents('div.form-group').css('display', 'none');
        com.focusPage("#bankCardNum").parents('div.form-group').css('display', 'none');
    }

    com.initTypeahead('fangliner', api.personel.queryUserByPinyin, "pinyinName", {
        "departmentType.name": "",
        "user.status": 0
    }, "autoFillKeyValue", "key", "value", null);

    user.saveBtn = com.focusPage("#saveBtn").bindClick(saveData);
    user.cancelBtn = com.focusPage("#cancelBtn", "#userinfo").on("click", function() {

        com.closePopup();
    });

    com.post(api.system.queryRole, {
        "timestamp": new Date().getTime()
    }, function(res) {

        user.roleList = res.roleList;
    }, null, false);

    user.items.userId = com.focusPage("#userId");

    user.items.oldUserId = com.focusPage("#oldUserId").on("blur", function() {

        var $this = $(this);

        var oldUserId = $this.val();

        if (0 == oldUserId || "" == oldUserId.trim() || oldUserId == user.editLoginId) {
            com.focusPage("#oldUserId").css("border", "1px solid #d5d5d5").popover("destroy");
            user.eEditFlg = true;
        } else {
            com.post(api.personel.queryUserByOldUserId, {
                "user.oldUserId": oldUserId
            }, function(res) {

                user.eEditFlg = false;
                com.showTip(com.focusPage("#oldUserId"), "该原始工号已经存在", "right");
            }, function(res) {

                user.eEditFlg = true;
            });
        }
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

    com.focusPage('#addContractBtn').click(function() {

        com.cleanItems(user.cItems);
        user.modals.addContractModal.modal('show');
    });

    com.focusPage('#addEducationBtn').click(function() {

        com.cleanItems(user.cItems);
        user.modals.addEducationModal.modal('show');
    });

    com.focusPage('#addOperationBtn').click(function() {

        com.cleanItems(user.cItems);
        user.modals.addOperationModal.modal('show');
    });

    var contracts = [];
    var educations = [];
    var operations = [];

    com.focusPage('#saveContractBtn').bindClick(function() {

        if (com.validate("addContractModal")) {
            return false;
        }

        var name = user.cItems.contractName.val();
        var signTime = user.cItems.contractSignTime.val();
        var startTime = user.cItems.contractStartTime.val();
        var endTime = user.cItems.contractEndTime.val();
        var status = user.cItems.contractStatus.val();
        var comment = user.cItems.contractComment.val();

        var list = {
            "name": name,
            "signTime": signTime,
            "startTime": startTime,
            "endTime": endTime,
            "status": constant.personel().user.status.keys[status].value,
            "comment": comment
        };
        com.focusPage('.contract').css('display', 'block');

        contracts.push(list);

        drawTbody(list, 1);
        user.modals.addContractModal.modal('hide');
        com.cleanItems(user.cItems);
    });

    com.focusPage('#saveEducationBtn').bindClick(function() {

        if (com.validate("addEducationModal")) {
            return false;
        }

        var organ = user.cItems.educationOrgan.val();
        var certificate = user.cItems.educationCertificate.val();
        var beginTime = user.cItems.educationBeginTime.val();
        var endTime = user.cItems.educationEndTime.val();
        var content = user.cItems.educationContent.val();
        var specialty = user.cItems.educationSpecialty.val();

        var list = {
            "organ": organ,
            "certificate": certificate,
            "specialty": specialty,
            "beginTime": beginTime,
            "endTime": endTime,
            "content": content
        };
        com.focusPage('.education').css('display', 'block');

        educations.push(list);

        drawTbody(list, 2);
        user.modals.addEducationModal.modal('hide');
        com.cleanItems(user.cItems);
    });

    com.focusPage('#saveOperationBtn').bindClick(function() {

        if (com.validate("addOperationModal")) {
            return false;
        }

        var company = user.cItems.operationCompany.val();
        var trade = user.cItems.operationTrade.val();
        var duty = user.cItems.operationDuty.val();
        var beginTime = user.cItems.operationBeginTime.val();
        var endTime = user.cItems.operationEndTime.val();
        var salary = user.cItems.operationSalary.val();
        var comment = user.cItems.operationComment.val();

        var list = {
            "company": company,
            "trade": trade,
            "duty": duty,
            "beginTime": beginTime,
            "endTime": endTime,
            "salary": salary,
            "comment": comment
        };
        com.focusPage('.operation').css('display', 'block');

        operations.push(list);

        drawTbody(list, 3);
        user.modals.addOperationModal.modal('hide');
        com.cleanItems(user.cItems);
    });

    function drawTbody(list, type) {

        var table;
        if (type == 1)
            table = com.focusPage('#userContractTable');
        else if (type == 2)
            table = com.focusPage('#userEducationTable');
        else if (type == 3)
            table = com.focusPage('#userOperationTable');

        var $tbody = $('<tbody></tbody>').appendTo(table);
        var $tr = $('<tr></tr>').appendTo($tbody);

        $.each(list, function(i, v) {

            var $td = $('<td></td>').html(v).addClass('center').appendTo($tr);
        });
    }

    user.politicalType = constant.personel().userInfo.political.datas;
    user.educationType = constant.personel().userInfo.education.datas;
    user.statusType = constant.personel().user.status.datas;
    user.employWayType = constant.personel().userInfo.employWay.datas;
    user.employType = constant.personel().userInfo.employType.datas;
    user.userLevel = constant.personel().userInfo.level.datas;
    user.insuranceType = constant.personel().userInfo.insuranceType.datas;
    user.contractStatus = constant.personel().userInfo.status.datas;
    user.experienceType = constant.personel().userInfo.experienceType.keys;

    com.focusPage("#rank_sequence").bindData(constant.personel().userInfo.rank_sequence.datas, "key", "value");
    com.focusPage("#rank_level").bindData(constant.personel().userInfo.rank_level.datas, "key", "value");
    com.focusPage("#formSel").bindData(constant.personel().userInfo.form.datas, "key", "value");

    user.cItems.contractName = com.focusPage('#contractName', '#addContractModal');
    user.cItems.contractSignTime = com.focusPage('#contractSignTime', '#addContractModal');
    user.cItems.contractStartTime = com.focusPage('#contractStartTime', '#addContractModal');
    user.cItems.contractEndTime = com.focusPage('#contractEndTime', '#addContractModal');
    user.cItems.contractStatus = com.focusPage('#contractStatus', '#addContractModal');

    user.cItems.contractComment = com.focusPage('#contractComment', '#addContractModal');
    user.cItems.operationCompany = com.focusPage('#operationCompany', '#addOperationModal');
    user.cItems.operationTrade = com.focusPage('#operationTrade', '#addOperationModal');
    user.cItems.operationDuty = com.focusPage('#operationDuty', '#addOperationModal');
    user.cItems.operationBeginTime = com.focusPage('#operationBeginTime', '#addOperationModal');
    user.cItems.operationEndTime = com.focusPage('#operationEndTime', '#addOperationModal');
    user.cItems.operationSalary = com.focusPage('#operationSalary', '#addOperationModal');
    user.cItems.operationComment = com.focusPage('#operationComment', '#addOperationModal');
    user.cItems.educationOrgan = com.focusPage('#educationOrgan', '#addEducationModal');
    user.cItems.educationCertificate = com.focusPage('#educationCertificate', '#addEducationModal');
    user.cItems.educationBeginTime = com.focusPage('#educationBeginTime', '#addEducationModal');
    user.cItems.educationEndTime = com.focusPage('#educationEndTime', '#addEducationModal');
    user.cItems.educationContent = com.focusPage('#educationContent', '#addEducationModal');
    user.cItems.educationSpecialty = com.focusPage("#educationSpecialty", "#addEducationModal");

    user.cItems.contractStatus.bindData(constant.personel().user.status.datas, "key", "value");

    user.items.userName = com.focusPage("#userName", "#userinfo");
    user.items.currentName = com.focusPage("#currentName", "#userinfo");
    user.items.height = com.focusPage("#height");
    user.items.weight = com.focusPage("#weight");
    user.items.nation = com.focusPage("#nation");
    user.items.gender = com.focusPage("#gendera").prop("checked");// 性别
    user.items.politicalSel = com.focusPage("#politicalSel");// 政治面貌

    user.items.jobYears = com.focusPage("#jobYears");
    user.items.identity = com.focusPage("#identity", "#userinfo");
    user.items.phone = com.focusPage("#phone", "#userinfo");
    user.items.address = com.focusPage("#address", "#userinfo");
    user.items.hometownAddress = com.focusPage("#hometownAddress");
    user.items.householdSel = com.focusPage("#householdSel");
    user.items.emergencyMan = com.focusPage("#emergencyMan");
    user.items.emergencyPhone = com.focusPage("#emergencyPhone");
    user.items.qq = com.focusPage("#qq", "#userinfo");
    user.items.weChat = com.focusPage("#weChat");
    user.items.email = com.focusPage("#email", "#userinfo");
    user.items.fangliner = com.focusPage("#fangliner");
    user.items.claner = com.focusPage("#claner");
    user.items.clanerCom = com.focusPage("#clanerCom");
    user.items.isPresentGraduate = com.focusPage("#isPresentGraduate");// 是否应届生
    user.items.graduateTime = com.focusPage("#graduateTime", "#userinfo");
    user.items.school = com.focusPage("#school");
    user.items.educationSel = com.focusPage("#educationSel");
    user.items.specialty = com.focusPage("#specialty");
    user.items.isMarried = com.focusPage("#isMarried");// 是否结婚
    user.items.isBirth = com.focusPage("#isBirth");// 是否生育
    user.items.isHouseLoan = com.focusPage("#isHouseLoan");// 是否房贷
    user.items.isCarLoan = com.focusPage("#isCarLoan");// 是否车贷
    user.items.isCarID = com.focusPage("#isCarID");// 驾照
    user.items.isPassID = com.focusPage("#isPassID");// 护照
    user.items.isHMID = com.focusPage("#isHMID");
    user.items.isTWID = com.focusPage("#isTWID");
    user.items.firstTime = com.focusPage("#firstTime");
    user.items.lover = com.focusPage("#lover");
    user.items.hobby = com.focusPage("#hobby");
    user.items.comment = com.focusPage("#comment");
    user.items.company = com.focusPage("#company");
    user.items.fignTime = com.focusPage("#fignTime");
    user.items.signNum = com.focusPage("#signNum");
    user.items.preformNum = com.focusPage("#preformNum");
    user.items.palary = com.focusPage("#palary");
    user.items.signTime = com.focusPage("#signTime");
    user.items.eignTime = com.focusPage("#eignTime");
    user.items.publicNum = com.focusPage("#publicNum");

    user.items.rank_sequence = com.focusPage("#rank_sequence");
    user.items.rank_level = com.focusPage("#rank_level");
    user.items.hometownPlace = com.focusPage("#hometownPlace");
    user.items.form = com.focusPage("#formSel");
    user.items.insuranceTypeSel = com.focusPage("#insuranceTypeSel");

    user.items.statusSel = com.focusPage("#statusSel", "#userinfo");
    user.items.employWaySel = com.focusPage("#employWaySel");
    user.items.employTypeSel = com.focusPage("#employTypeSel");
    user.items.levelSel = com.focusPage("#levelSel");
    user.items.recommendMan = com.focusPage("#recommendMan", "#userinfo");

    user.items.entryTime = com.focusPage("#entryTime");
    user.items.formTime = com.focusPage("#formTime");
    user.items.employTime = com.focusPage("#employTime");

    user.items.isContract = com.focusPage("#isContract");// 是否签劳动合同
    user.items.isInsurance = com.focusPage("#isInsurance");// 是否上保险
    user.items.insuranceTime = com.focusPage("#insuranceTime");
    user.items.pensionNum = com.focusPage("#pensionNum");
    user.items.medicalNum = com.focusPage("#medicalNum");
    user.items.salary = com.focusPage("#salary");
    user.items.bank = com.focusPage("#bank");
    user.items.bankCardNum = com.focusPage("#bankCardNum");

    user.items.statusSel.bindData(constant.personel().user.status.datas, "key", "value");
    user.items.employWaySel.bindData(constant.personel().userInfo.employWay.datas, "key", "value");
    user.items.employTypeSel.bindData(constant.personel().userInfo.employType.datas, "key", "value");
    user.items.levelSel.bindData(constant.personel().userInfo.level.datas, "key", "value");

    user.items.politicalSel.bindData(constant.personel().userInfo.political.datas, "key", "value");
    user.items.householdSel.bindData(constant.personel().userInfo.householdType.datas, "key", "value");
    user.items.educationSel.bindData(constant.personel().userInfo.education.datas, "key", "value");
    user.items.insuranceTypeSel.bindData(constant.personel().userInfo.insuranceType.datas, "key", "value");

    com.post(api.communion.queryDepartmentType, {}, function(res) {

        user.deptType = res.departmentTypes;
    }, null, false);

    user.items.deptSel = com.focusPage("#deptSel", "#userinfo");
    user.items.dutySel = com.focusPage("#dutySel", "#userinfo");
    user.items.deptTypeSel = com.focusPage("#deptTypeSel", "#userinfo");
    user.items.deptTypeSel.bindData(user.deptType, "dtid", "name");

    com.datetime(com.focusPage("#entryTime"));
    com.datetime(com.focusPage("#employTime"));
    com.datetime(com.focusPage("#insuranceTime"));
    com.datetime(com.focusPage("#graduateTime"));
    com.datetime(com.focusPage("#formTime"));
    com.datetime(com.focusPage("#signTime"));
    com.datetime(com.focusPage("#fignTime"));
    com.datetime(com.focusPage("#eignTime"));
    com.datetime(com.focusPage("#firstTime"));

    com.datetime(com.focusPage("#contractSignTime"));
    com.datetime(com.focusPage("#contractStartTime"));
    com.datetime(com.focusPage("#contractEndTime"));
    com.datetime(com.focusPage("#educationBeginTime"));
    com.datetime(com.focusPage("#educationEndTime"));
    com.datetime(com.focusPage("#operationBeginTime"));
    com.datetime(com.focusPage("#operationEndTime"));

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
        }, null, false)
    }).trigger("change");

    // 编辑用户, 获取用户信息
    if (params.personel.userId) {

        user.editFlg = !0;
        user.items.userId.prop("disabled", "true");
        user.items.userId.css("display", "block");
        user.currentCompany = null;
        com.post(api.personel.queryUserInfoByUserId, {
            "userInfo.user.userId": params.personel.userId
        }, function(data) {

            var $userInfo = data.userInfo;
            var $user = $userInfo.user;

            if ($userInfo.fangliner)
                com.updateTypeahead(user.items.fangliner, $userInfo.fangliner.userId, $userInfo.fangliner.currentName + '-' + $userInfo.fangliner.dept.name);

            if ($userInfo.rank != null) {
                user.items.rank_sequence.val($userInfo.rank.substr(0, 1));
                user.items.rank_level.val($userInfo.rank.substr(1, 2));
            }

            user.editUserId = $user.userId;
            user.editLoginId = $user.loginId;

            user.items.userId.val($user.userId);
            user.items.oldUserId.val($user.oldUserId);
            user.items.userName.val($user.userName).prop("disabled", true);
            user.items.currentName.val($user.currentName);
            user.items.height.val($userInfo.height);
            user.items.weight.val($userInfo.weight);
            user.items.nation.val($userInfo.nation);
            user.items.politicalSel.val($userInfo.political);

            user.items.jobYears.val($userInfo.jobYears);
            user.items.identity.val($user.identity);
            user.items.phone.val($user.phone);
            user.items.address.val($userInfo.address);
            user.items.hometownAddress.val($userInfo.hometownAddress);
            user.items.householdSel.val($userInfo.householdType);
            user.items.emergencyMan.val($userInfo.emergencyMan);
            user.items.emergencyPhone.val($userInfo.emergencyPhone);
            user.items.qq.val($userInfo.qq);
            user.items.weChat.val($userInfo.wechat);
            user.items.email.val($userInfo.email);
            user.items.claner.val($userInfo.claner);
            user.items.clanerCom.val($userInfo.clanerCom);
            user.items.school.val($userInfo.school);
            user.items.educationSel.val($userInfo.education);
            user.items.hobby.val($userInfo.hobby);
            user.items.comment.val($userInfo.comment);

            com.focusPage("#gendera", "#userinfo").prop("checked", user.getProp[$userInfo.gender]);
            com.focusPage("#isPresentGraduate").prop("checked", user.getProp[$userInfo.isPresentGraduate]);
            com.focusPage("#isMarried").prop("checked", user.getProp[$userInfo.isMarried]);
            com.focusPage("#isBirth").prop("checked", user.getProp[$userInfo.isBirth]);
            com.focusPage("#isHouseLoan").prop("checked", user.getProp[$userInfo.isHouseLoan]);
            com.focusPage("#isCarLoan").prop("checked", user.getProp[$userInfo.isCarLoan]);
            com.focusPage("#isContract").prop("checked", user.getProp[$userInfo.isContract]);
            com.focusPage("#isInsurance").prop("checked", user.getProp[$userInfo.isInsurance]);
            com.focusPage("#isCarID").prop("checked", user.getProp[$userInfo.isCarID]);
            com.focusPage("#isPassID").prop("checked", user.getProp[$userInfo.isPassID]);
            com.focusPage("#isHMID").prop("checked", user.getProp[$userInfo.isHMID]);
            com.focusPage("#isTWID").prop("checked", user.getProp[$userInfo.isTWID]);

            user.items.graduateTime.val($userInfo.graduateTime);
            user.items.school.val($userInfo.school);
            user.items.educationSel.val($userInfo.education);
            user.items.specialty.val($userInfo.specialty);
            user.items.lover.val($userInfo.lover);
            user.items.loginId.val($user.loginId).attr("disabled", "disabled");
            user.items.company.val($user.companys);

            user.items.deptTypeSel.val($user.dept.type.dtid).trigger("change", function() {

                user.items.deptSel.val($user.dept.did);
                user.items.dutySel.val($user.duty.did);
            });

            user.items.levelSel.val($userInfo.level);
            user.items.statusSel.val($user.status);
            user.items.employWaySel.val($userInfo.employWay);
            user.items.employTypeSel.val($userInfo.employType);
            user.items.recommendMan.val($userInfo.recommendMan);

            user.items.entryTime.val($userInfo.entryTime);// 入职时间
            user.items.employTime.val($userInfo.employTime);// 招聘时间
            user.items.firstTime.val($userInfo.firstTime);// 进入公司时间
            user.items.formTime.val($userInfo.formTime);// 转正时间
            user.items.signTime.val($userInfo.signTime);// 合同起始时间
            user.items.fignTime.val($userInfo.fignTime);// 首次合同时间
            user.items.eignTime.val($userInfo.eignTime);// 合同结束时间
            user.items.insuranceTypeSel.val($userInfo.insuranceType);
            user.items.preformNum.val($userInfo.preformNum);
            user.items.palary.val($userInfo.palary);
            user.items.signNum.val($userInfo.signNum);

            user.items.insuranceTime.val($userInfo.insuranceTime);
            user.items.pensionNum.val($userInfo.pensionNum);
            user.items.medicalNum.val($userInfo.medicalNum);
            user.items.publicNum.val($userInfo.publicNum);
            user.items.salary.val($userInfo.salary);
            user.items.bank.val($userInfo.bank);
            user.items.bankCardNum.val($userInfo.bankCardNum);
            user.items.hometownPlace.val($userInfo.hometownPlace);
            user.items.form.val($userInfo.form);

            com.focusPage("#loginId", "#userinfo").css("border", "1px solid #d5d5d5").popover("destroy");
            com.focusPage("#userId").css("border", "1px solid #d5d5d5").popover("destroy");

            com.clearValidator();
        });
    }

    function saveData() {

        if ("" == user.items.loginId.val().trim() || user.items.loginId.val() == null) {
            com.showTips(com.focusPage("#loginId", "#userinfo"), "用户名不能为空", "right");
            user.loginFlag = false;
        }

        if (!com.validate("userinfo") && !user.repeatFlg && user.loginFlag && user.eEditFlg) {
            var url, params = {

                "userInfo.user.userId": user.items.userId.val(),// 工号
                "userInfo.user.oldUserId": user.items.oldUserId.val(),// 旧员工编号
                "userInfo.user.userName": user.items.userName.val().trim(),// 姓名
                "userInfo.user.currentName": user.items.currentName.val(),// 现用名
                "userInfo.height": user.items.height.val(),// 身高
                "userInfo.weight": user.items.weight.val().trim(),// 体重
                "userInfo.nation": user.items.nation.val(),// 民族
                "userInfo.gender": user.getProp[com.focusPage("#gendera").prop("checked")],// 性别
                "userInfo.political": user.items.politicalSel.val(),// 政治面貌
                "userInfo.jobYears": user.items.jobYears.val(),// 工作年限
                "userInfo.user.identity": user.items.identity.val(),// 身份证号
                "userInfo.user.phone": user.items.phone.val(),// 手机号
                "userInfo.address": user.items.address.val(),// 现住址
                "userInfo.hometownAddress": user.items.hometownAddress.val(),// 户籍地址
                "userInfo.householdType": user.items.householdSel.val(),// 户籍类型
                "userInfo.emergencyMan": user.items.emergencyMan.val(),// 紧急联系人
                "userInfo.emergencyPhone": user.items.emergencyPhone.val(),// 紧急联系人电话
                "userInfo.qq": user.items.qq.val(),
                "userInfo.wechat": user.items.weChat.val(),
                "userInfo.email": user.items.email.val(),
                "userInfo.fangliner.userId": com.typeahead("fangliner"),
                "userInfo.claner": user.items.claner.val(),
                "userInfo.clanerCom": user.items.clanerCom.val(),
                "userInfo.isCarID": user.getProp[user.items.isCarID.prop("checked")],
                "userInfo.isPassID": user.getProp[user.items.isPassID.prop("checked")],
                "userInfo.isHMID": user.getProp[user.items.isHMID.prop("checked")],
                "userInfo.isTWID": user.getProp[user.items.isTWID.prop("checked")],
                "userInfo.isPresentGraduate": user.getProp[user.items.isPresentGraduate.prop("checked")],// 是否应届
                "userInfo.graduateTime": "" == user.items.graduateTime.val() ? void 0 : user.items.graduateTime.val(),// 毕业时间
                "userInfo.school": user.items.school.val(),// 毕业学校
                "userInfo.education": user.items.educationSel.val(),// 学历
                "userInfo.specialty": user.items.specialty.val(),// 专业
                "userInfo.isMarried": user.getProp[user.items.isMarried.prop("checked")],// 婚姻状况
                "userInfo.isBirth": user.getProp[user.items.isBirth.prop("checked")],// 生育状况
                "userInfo.isHouseLoan": user.getProp[user.items.isHouseLoan.prop("checked")],// 是否有房贷
                "userInfo.isCarLoan": user.getProp[user.items.isCarLoan.prop("checked")],// 是否车贷
                "userInfo.lover": user.items.lover.val(),// 爱人
                "userInfo.hobby": user.items.hobby.val(),
                "userInfo.comment": user.items.comment.val(),

                "userInfo.user.loginId": user.items.loginId.val(),// 用户名
                "userInfo.user.dept.did": user.items.deptSel.val(),// 部门ID
                "userInfo.user.duty.did": user.items.dutySel.val(),// 职位ID
                "userInfo.level": user.items.levelSel.val(),
                "userInfo.user.status": user.items.statusSel.val(),// 状态
                "userInfo.employWay": user.items.employWaySel.val(),// 招聘渠道
                "userInfo.employType": user.items.employTypeSel.val(),// 录用类型
                "userInfo.recommendMan": user.items.recommendMan.val(),// 推荐人
                "userInfo.firstTime": "" == user.items.firstTime.val() ? void 0 : user.items.firstTime.val(),
                "userInfo.formTime": "" == user.items.formTime.val() ? void 0 : user.items.formTime.val(),
                "userInfo.entryTime": "" == user.items.entryTime.val() ? void 0 : user.items.entryTime.val(),// 入职时间
                "userInfo.employTime": "" == user.items.employTime.val() ? void 0 : user.items.employTime.val(),// 转正时间
                "userInfo.insuranceType": user.items.insuranceTypeSel.val(),
                "userInfo.preformNum": user.items.preformNum.val(),

                "userInfo.signNum": user.items.signNum.val(),
                "userInfo.signTime": "" == user.items.signTime.val() ? void 0 : user.items.signTime.val(),
                "userInfo.eignTime": "" == user.items.eignTime.val() ? void 0 : user.items.eignTime.val(),
                "userInfo.fignTime": "" == user.items.fignTime.val() ? void 0 : user.items.fignTime.val(),

                "userInfo.isContract": user.getProp[user.items.isContract.prop("checked")],// 是否签劳动合同
                "userInfo.isInsurance": user.getProp[user.items.isInsurance.prop("checked")],// 是否上保险
                "userInfo.insuranceType": user.items.insuranceTypeSel.val(),
                "userInfo.insuranceTime": "" == user.items.insuranceTime.val() ? void 0 : user.items.insuranceTime.val(),// 参保时间
                "userInfo.pensionNum": user.items.pensionNum.val(),// 养老编号
                "userInfo.medicalNum": user.items.medicalNum.val(),// 医疗编号

                "userInfo.publicNum": user.items.publicNum.val(),
                "userInfo.hometownPlace": user.items.hometownPlace.val(),
                "userInfo.rank": user.items.rank_sequence.val() + user.items.rank_level.val(),
                "userInfo.form": user.items.form.val(),

                "userInfo.palary": user.items.palary.val(),
                "userInfo.salary": user.items.salary.val(),// 工资
                "userInfo.bank": user.items.bank.val(),// 开户行
                "userInfo.bankCardNum": user.items.bankCardNum.val(),// 银行卡号

            };

            user.editFlg ? url = api.personel.updateUser : (url = api.personel.addUser);

            if (!user.editFlg) {
                if (contracts.length != 0) {
                    $.each(contracts, function(i, v) {

                        params['userContracts[' + i + '].name'] = v.name;
                        params['userContracts[' + i + '].signTime'] = v.signTime;
                        params['userContracts[' + i + '].startTime'] = v.startTime;
                        params['userContracts[' + i + '].endTime'] = v.endTime;
                        params['userContracts[' + i + '].status'] = v.status == "有效" ? 0 : 1;
                        params['userContracts[' + i + '].comment'] = v.comment;
                    });
                }
                if (educations.length != 0) {
                    $.each(educations, function(i, v) {

                        params['userEducations[' + i + '].organ'] = v.organ;
                        params['userEducations[' + i + '].certificate'] = v.certificate;
                        params['userEducations[' + i + '].specialty'] = v.specialty;
                        params['userEducations[' + i + '].beginTime'] = v.beginTime;
                        params['userEducations[' + i + '].endTime'] = v.endTime;
                        params['userEducations[' + i + '].content'] = v.content;
                    });
                }
                if (operations.length != 0) {
                    $.each(operations, function(i, v) {

                        params['userOperations[' + i + '].company'] = v.company;
                        params['userOperations[' + i + '].trade'] = v.trade;
                        params['userOperations[' + i + '].duty'] = v.duty;
                        params['userOperations[' + i + '].beginTime'] = v.beginTime;
                        params['userOperations[' + i + '].endTime'] = v.endTime;
                        params['userOperations[' + i + '].salary'] = v.salary;
                        params['userOperations[' + i + '].comment'] = v.comment;
                    });
                }
            }

            com.post(url, params, function(res) {

                if (res.errorCode == 0) {
                    com.showAlert(com.info, "操作成功");
                    com.closePopup();
                } else {
                    com.showAlert(com.error, e.errorMsg);
                }
            }, null, false);
        }
    }

});