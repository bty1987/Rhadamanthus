jQuery(function(a) {

    var user = {
        politicalType: [],
        householdType: [],
        educationType: [],
        houseType: [],
        statusType: [],
        employWayType: [],
        employType: [],
        experienceType: [],
        deptType: [],
        dutyTypeMap: {},
        saveBtn: null,
        cancelBtn: null,
        items: {},
        editFlg: !1,
        postParam: {},
        editUserId: null,
        editLoginId: null,
        roleList: {},
        roleKey: "roleId",
        roleValue: "roleName",
        deptList: {},
        deptKey: "deptId",
        deptValue: "deptName",
        eSaveBtn: null,
        eCancelBtn: null,
        eModal: null,
        eItems: {},
        eEditFlg: true,
        eEditNum: null,
        experienceList: [],
        cSaveBtn: null,
        cCancelBtn: null,
        cModal: null,
        cItems: {},
        cEditFlg: !1,
        cEditNum: null,
        contractList: [],
        loginFlag:true,
    };
 
    user.saveBtn = a("#saveBtn").on("click", saveData);
    user.cancelBtn = a("#cancelBtn").on("click",function() {
        com.switchPage(api.index.userIndex.url);

    });
    user.items.userId = a("#userId");
    user.items.oldUserId = a("#oldUserId").on("blur",function() {
        $this = a(this);
        void 0 == $this.val() || "" == $this.val().trim() || $this.val() == user.editLoginId ? ($("#oldUserId").css("border", "1px solid #d5d5d5").popover("destroy"),   user.eEditFlg = true) : com.post(api.personel.queryUserByLoginId, {
            "user.oldUserId": $this.val()
        }, function(res) {
            user.eEditFlg = true
            $("#oldUserId").css("border", "1px solid #d5d5d5").popover("destroy")
        }, function(res){
            user.eEditFlg = false
            com.showPopover($("#oldUserId"),{errorMsg: "该原始工号已经存在"},  "right");

        });

    });
    user.items.loginId =a("#loginId").on("blur", function() {
        $this = a(this);
        void 0 == $this.val() || "" == $this.val().trim() || $this.val() == user.editLoginId ? (com.showPopover($("#loginId"),{errorMsg: "用户名不能为空"}, "right"), user.repeatFlg = !1) : com.post(api.personel.queryUserByLoginId, {
            "user.loginId": $this.val()
        }, function(res) {
            user.loginFlag =false
            com.showPopover($("#loginId"),{errorMsg: "用户名已存在"}, "right");

        }, function(res){
            user.loginFlag =true

            $("#loginId").css("border", "1px solid #d5d5d5").popover("destroy")
        });
    });

    com.post(api.ds.personel, {timestamp: (new Date).getTime()},function(a) {
        user.politicalType = a.politicalType;
        user.householdType = a.householdType;
        user.educationType = a.educationType;
        user.houseType = a.houseType;
        user.statusType = a.statusType;
        user.employWayType = a.employWayType;
        user.employType = a.employType;
        user.experienceType = a.experienceType;
    },null, !1);

    user.items.userName = a("#userName");
    user.items.currentName = a("#currentName");
    user.items.gender = a("#gender").switchBtn("gender");
    user.items.age = a("#age");
    user.items.birthday = a("#birthday");
    user.items.politicalSel = a("#politicalSel").bindData(user.politicalType);
    user.items.jobYears = a("#jobYears");
    user.items.identity = a("#identity");
    user.items.phone = a("#phone");
    user.items.address = a("#address");
    user.items.hometownAddress = a("#hometownAddress");
    user.items.householdSel = a("#householdSel").bindData(user.householdType);
    user.items.emergencyMan = a("#emergencyMan");
    user.items.emergencyPhone = a("#emergencyPhone");
    user.items.isPresentGraduate = a("#isPresentGraduate").switchBtn("isOrNot");
    user.items.graduateTime = a("#graduateTime");
    user.items.school = a("#school");
    user.items.educationSel = a("#educationSel").bindData(user.educationType);
    user.items.specialty = a("#specialty");
    user.items.isMarried = a("#isMarried").switchBtn("isOrNot");
    user.items.isBirth = a("#isBirth").switchBtn("isOrNot");
    user.items.isHouseLoan = a("#isHouseLoan").switchBtn("isOrNot");
    user.items.isCarLoan = a("#isCarLoan").switchBtn("isOrNot");
    user.items.houseTypeSel = a("#houseTypeSel").bindData(user.houseType);
    user.items.lover = a("#lover");
    user.items.company = a("#company");
    //获取部门类型
    com.post(api.communion.queryDepartmentType, {},function(a) {
        user.deptType = a.departmentTypes
    },null, false);

    user.items.deptSel = a("#deptSel");
    user.items.dutySel = a("#dutySel");
    user.items.deptTypeSel = a("#deptTypeSel");
    user.items.deptTypeSel.bindData(user.deptType, "dtid", "name");
    user.items.deptTypeSel.on("change",
        function(b, d) {
            com.post(api.system.queryDutyByDtid,{"duty.departmentType.dtid" :a(this).val()},function(res){
                user.dutyTypeMap=res.dutys;
                user.items.dutySel.bindData(user.dutyTypeMap,"did","name");
            },null,false)

            com.post(api.communion.queryDepartmentByDtid, {"dept.type.dtid": a(this).val()}, function(res) {
                    user.items.deptSel.bindData(res.deptList, "deptId", "deptName");
                    d && d();
                },null,false)

        }).trigger("change");
    user.items.statusSel = a("#statusSel").bindData(user.statusType,"key", "value");
    user.items.employWaySel = a("#employWaySel").bindData(user.employWayType);
    user.items.employTypeSel = a("#employTypeSel").bindData(user.employType);
    user.items.recommendMan = a("#recommendMan");
    user.items.entryTime = a("#entryTime");
    user.items.employTime = a("#employTime");
    user.items.serviceYears = a("#serviceYears");
    user.items.isContract = a("#isContract").switchBtn("isOrNot");
    user.items.isInsurance = a("#isInsurance").switchBtn("isOrNot");
    user.items.insuranceTime = a("#insuranceTime");
    user.items.pensionNum = a("#pensionNum");
    user.items.medicalNum = a("#medicalNum");
    user.items.salary = a("#salary");
    user.items.bank = a("#bank");
    user.items.bankCardNum = a("#bankCardNum");


    //编辑用户，获取用户信息
    if(params.tempUserId){

        user.editFlg = !0;
        user.items.userId.prop("disabled", "true");
        user.items.userId.css("display", "block");
        user.currentCompany=null;
        com.post(api.personel.queryUserInfoByUserId, {"userInfo.user.userId": params.tempUserId}, function(data){

            var $userInfo = data.userInfo;
            var $user = $userInfo.user;

            void 0 != a && (
                user.editUserId = $user.userId,
                    user.editLoginId = $user.loginId,
                    user.items.userId.val($user.userId),
                    user.items.oldUserId.val($user.oldUserId),
                    user.items.userName.val($user.userName).prop("disabled", !0),
                    user.items.currentName.val($user.currentName),
                    user.items.gender.prop("checked", com.genderType[$user.gender]),
                    user.items.age.val($userInfo.age),
                    user.items.birthday.val($user.birthday),
                    user.items.politicalSel.val($userInfo.political),
                    user.items.jobYears.val($userInfo.jobYears),
                    user.items.identity.val($user.identity),
                    user.items.phone.val($user.phone),
                    user.items.address.val($userInfo.address),
                    user.items.hometownAddress.val($userInfo.hometownAddress),
                    user.items.householdSel.val($userInfo.householdType),
                    user.items.emergencyMan.val($userInfo.emergencyMan),
                    user.items.emergencyPhone.val($userInfo.emergencyPhone),
                    user.items.isPresentGraduate.prop("checked", com.isOrNotType[$userInfo.isPresentGraduate]),
                    user.items.graduateTime.val($userInfo.graduateTime),
                    user.items.school.val($userInfo.school),
                    user.items.educationSel.val($userInfo.education),
                    user.items.specialty.val($userInfo.specialty),
                    user.items.isMarried.prop("checked", com.isOrNotType[$userInfo.isMarried]),
                    user.items.isBirth.prop("checked", com.isOrNotType[$userInfo.isBirth]),
                    user.items.isHouseLoan.prop("checked", com.isOrNotType[$userInfo.isHouseLoan]),
                    user.items.isCarLoan.prop("checked", com.isOrNotType[$userInfo.isCarLoan]),
                    user.items.houseTypeSel.val($userInfo.houseType),
                    user.items.lover.val($userInfo.lover),
                    user.items.loginId.val($user.loginId).attr("disabled", "disabled"),
                    user.items.company.val( $user.companys),

                    user.items.deptTypeSel.val($user.dtid).trigger("change",function() {
                        user.items.deptSel.val($user.dept.deptId);
                        user.items.dutySel.val($user.duty.did)
                        user.items.dutySel.trigger("chosen:updated")
                    }),

                    user.items.statusSel.val($user.status),
                    user.items.employWaySel.val($userInfo.employWay),
                    user.items.employTypeSel.val($userInfo.employType),
                    user.items.recommendMan.val($userInfo.recommendMan),
                    user.items.entryTime.val($userInfo.entryTime),
                    user.items.employTime.val($userInfo.employTime),
                    user.items.serviceYears.val($userInfo.serviceYears),
                    user.items.isContract.prop("checked", com.isOrNotType[$userInfo.isContract]),
                    user.items.isInsurance.prop("checked", com.isOrNotType[$userInfo.isInsurance]),
                    user.items.insuranceTime.val($userInfo.insuranceTime),
                    user.items.pensionNum.val($userInfo.pensionNum),
                    user.items.medicalNum.val($userInfo.medicalNum),
                    user.items.salary.val($userInfo.salary),
                    user.items.bank.val($userInfo.bank),
                    user.items.bankCardNum.val($userInfo.bankCardNum),
                    $("#loginId").css("border", "1px solid #d5d5d5").popover("destroy"),
                    $("#userId").css("border", "1px solid #d5d5d5").popover("destroy"),
                    com.clearValidator()
            )
        });
    }

    a(".date-picker").datepicker({autoclose: !0}).on("show",function() {
        setTimeout(function() {
            a(".dropdown-menu").css("z-index", 1060)
        },0)
    }).next().on(ace.click_event,function() {
        a(this).prev().focus()
    });

    function saveData() {

        if( "" == user.items.loginId.val().trim() || user.items.loginId.val() == null) {

        	 $("#loginId").removeAttr("data-placement").addClass('popover-notitle').attr({
                 "data-rel":"popover",
                 "data-placement": "right",
                 "data-content": "用户名不能为空"
             }).removeAttr("data-toggle").css('border', '1px red solid').popover('show');
           user.loginFlag=false
        }

        if (!com.validate() && !user.repeatFlg && user.loginFlag && user.eEditFlg) {
            var a, b = {
                "userInfo.user.userId": user.items.userId.val(),
                "userInfo.user.oldUserId": user.items.oldUserId.val(),
                "userInfo.user.userName": user.items.userName.val().trim(),
                "userInfo.user.currentName": user.items.currentName.val(),
                "userInfo.user.gender": com.genderType[user.items.gender.prop("checked")],
                "userInfo.age": user.items.age.val(),
                "userInfo.user.birthday": user.items.birthday.val(),
                "userInfo.political": user.items.politicalSel.val(),
                "userInfo.jobYears": user.items.jobYears.val(),
                "userInfo.user.identity": user.items.identity.val(),
                "userInfo.user.phone": user.items.phone.val(),
                "userInfo.address": user.items.address.val(),
                "userInfo.hometownAddress": user.items.hometownAddress.val(),
                "userInfo.householdType": user.items.householdSel.val(),
                "userInfo.emergencyMan": user.items.emergencyMan.val(),
                "userInfo.emergencyPhone": user.items.emergencyPhone.val(),
                "userInfo.isPresentGraduate": com.isOrNotType[user.items.isPresentGraduate.prop("checked")],
                "userInfo.graduateTime": "" == user.items.graduateTime.val() ? void 0 : user.items.graduateTime.val(),
                "userInfo.school": user.items.school.val(),
                "userInfo.education": user.items.educationSel.val(),
                "userInfo.specialty": user.items.specialty.val(),
                "userInfo.isMarried": com.isOrNotType[user.items.isMarried.prop("checked")],
                "userInfo.isBirth": com.isOrNotType[user.items.isBirth.prop("checked")],
                "userInfo.isHouseLoan": com.isOrNotType[user.items.isHouseLoan.prop("checked")],
                "userInfo.isCarLoan": com.isOrNotType[user.items.isCarLoan.prop("checked")],
                "userInfo.houseType": user.items.houseTypeSel.val(),
                "userInfo.lover": user.items.lover.val(),
                "userInfo.user.loginId": user.items.loginId.val(),
                "userInfo.user.dtid": user.items.deptTypeSel.val(),
                "userInfo.user.dept.deptId": user.items.deptSel.val(),
                "userInfo.user.duty.did": user.items.dutySel.val(),
                "userInfo.user.status": user.items.statusSel.val(),
                "userInfo.employWay": user.items.employWaySel.val(),
                "userInfo.employType": user.items.employTypeSel.val(),
                "userInfo.recommendMan": user.items.recommendMan.val(),
                "userInfo.entryTime": "" == user.items.entryTime.val() ? void 0 : user.items.entryTime.val(),
                "userInfo.employTime": "" == user.items.employTime.val() ? void 0 : user.items.employTime.val(),
                "userInfo.serviceYears": user.items.serviceYears.val(),
                "userInfo.isContract": com.isOrNotType[user.items.isContract.prop("checked")],
                "userInfo.isInsurance": com.isOrNotType[user.items.isInsurance.prop("checked")],
                "userInfo.insuranceTime": "" == user.items.insuranceTime.val() ? void 0 : user.items.insuranceTime.val(),
                "userInfo.pensionNum": user.items.pensionNum.val(),
                "userInfo.medicalNum": user.items.medicalNum.val(),
                "userInfo.salary": user.items.salary.val(),
                "userInfo.bank": user.items.bank.val(),
                "userInfo.bankCardNum": user.items.bankCardNum.val(),

            };
            for (a = 0; a < user.experienceList.length; a++) b["user.experiences[" + a + "].userId"] = b["user.userId"],
                b["user.experiences[" + a + "].id"] = user.experienceList[a].experienceId,
                b["user.experiences[" + a + "].type"] = user.experienceList[a].type,
                b["user.experiences[" + a + "].company"] = user.experienceList[a].company,
                b["user.experiences[" + a + "].position"] = user.experienceList[a].position,
                b["user.experiences[" + a + "].startTime"] = user.experienceList[a].startTime,
                b["user.experiences[" + a + "].endTime"] = user.experienceList[a].endTime,
                b["user.experiences[" + a + "].des"] = user.experienceList[a].des,
                b["user.experiences[" + a + "].flag"] = user.experienceList[a].flag;
            for (a = 0; a < user.contractList.length; a++) b["user.contracts[" + a + "].userId"] = b["user.userId"],
                b["user.contracts[" + a + "].contractId"] = user.contractList[a].contractId,
                b["user.contracts[" + a + "].startTime"] = user.contractList[a].startTime,
                b["user.contracts[" + a + "].endTime"] = user.contractList[a].endTime,
                b["user.contracts[" + a + "].des"] = user.contractList[a].des,
                b["user.contracts[" + a + "].flag"] = user.contractList[a].flag;

            user.editFlg ? a = api.personel.updateUser: (a = api.personel.addUser);

            com.post(a, b, successCallback, failCallback);
        }
    }

    function successCallback() {
        com.showAlert(com.info, "操作成功");
        com.switchPage(api.index.userIndex.url);
    }

    function failCallback(res) {
        com.showAlert(com.error, res.errorMsg);
        user.contractList = [];
        user.experienceList = []
    };

});

