
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
	    eEditFlg: !1,
	    eEditNum: null,
	    experienceList: [],
	    cSaveBtn: null,
	    cCancelBtn: null,
	    cModal: null,
	    cItems: {},
	    cEditFlg: !1,
	    cEditNum: null,
	    contractList: []
	};

    user.saveBtn = a("#saveBtn").on("click", saveData);
    user.cancelBtn = a("#cancelBtn").on("click",function() {
        com.switchPage(api.index.userIndex.url);

    });
    user.items.userId = a("#userId").on("blur",function() {
        $this = a(this);
        void 0 != $this.val() && "" != $this.val().trim() && com.post(api.personel.queryUserByUserId, {
            "user.userId": $this.val()
        },function(a) {
            a.user ? (com.showTips($this, "\u8be5\u5458\u5de5\u53f7\u5df2\u7ecf\u5b58\u5728", !0), user.repeatFlg = !0) : (com.clearValidator("#userId", !0), user.repeatFlg = !1)
        })
    });
    user.items.oldUserId = a("#oldUserId").on("blur",function() {
        $this = a(this);
        void 0 != $this.val() && "" != $this.val().trim() && com.post(api.personel.queryUserByOldUserId, {
                "user.oldUserId": $this.val()
        },function(a) {
            a.user ? (com.showTips($this, "\u8be5\u539f\u59cb\u5de5\u53f7\u5df2\u7ecf\u5b58\u5728", !0), user.repeatFlg = !0) : (com.clearValidator("#oldUserId", !0), user.repeatFlg = !1)
        })
    });
    //获取部门类型
    com.post(api.ds.departmentInfo, {timestamp: (new Date).getTime()},function(a) {
        user.deptType = a.deptType
    },null, !1);
    //获取公司select的各种option
    com.post(api.ds.companyType, {timestamp: (new Date).getTime()},function(c) {
        var b = {};
        a.each(c.company,function(a, c) {
            b[c.key] = c.value
        });
        user.company = b
    },null, !1);
    //获取政治面貌，学历等select的各种option
    com.post(api.ds.personInfo, {timestamp: (new Date).getTime()},function(a) {
        user.politicalType = a.politicalType;
        user.householdType = a.householdType;
        user.educationType = a.educationType;
        user.houseType = a.houseType;
        user.statusType = a.statusType;
        user.employWayType = a.employWayType;
        user.employType = a.employType;
        user.experienceType = a.experienceType;
        user.dutyTypeMap = a.dutyTypeMap
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
    user.items.loginId = a("#loginId").on("blur",
        function() {
            $this = a(this);
            void 0 == $this.val() || "" == $this.val().trim() || $this.val() == user.editLoginId ? (com.clearValidator("#loginId", !0), user.repeatFlg = !1) : com.post(api.personel.queryUserByLoginId, {
                    "user.loginId": $this.val()
                },
                function(a) {
                    a.user ? (com.showTips($this, "\u8be5\u7528\u6237\u540d\u5df2\u7ecf\u5b58\u5728", !0), user.repeatFlg = !0) : (com.clearValidator("#loginId", !0), user.repeatFlg = !1)
                })
        });
    user.items.deptSel = a("#deptSel");
    user.items.dutySel = a("#dutySel").chosen({
        width: "216px"
    });
    user.items.company = a("#company");
    user.items.deptTypeSel = a("#deptTypeSel").bindData(user.deptType).on("change",
        function(b, d) {
            user.items.dutySel.bindData(user.dutyTypeMap[a(this).val()]);
            com.post(api.department.queryDepartment, {
                    "dept.type": a(this).val()
                },
                function(a) {
                    user.items.deptSel.bindData(a.deptList, user.deptKey, user.deptValue);
                    d && d();
                    user.items.dutySel.trigger("chosen:updated")
                })
        }).trigger("change");
    user.items.statusSel = a("#statusSel").bindData(user.statusType);
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

    a(".collapse").collapse({
        toggle: !1
    });

    //编辑用户，获取用户信息
    if(params.tempUserId){
        user.editFlg = !0;
        user.items.userId.prop("disabled", "true");
        user.items.userId.css("display", "block");
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
                user.items.company.val($user.company[$user.company]),
                user.items.deptTypeSel.val($user.deptType).trigger("change",function() {
                    user.items.deptSel.val($user.dept.deptId);
                    user.items.dutySel.val("");
                    user.items.dutySel.trigger("chosen:updated");
                    var b = $user.duty.split(",");
                    $.each(b,
                        function(a, b) {
                            $("[value\x3d'" + b + "']", user.items.dutySel).attr("selected", "selected")
                        });
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
                com.clearValidator("#loginId", !0),
                com.clearValidator("#userId", !0),
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

    /*获取钉钉部门*/
//    user.items.userId.val()
    var deptList = null;
    var selectedDepts = null;

    com.post(api.dd.queryDDDepartment, {"department.parentid": 1}, function(res){
        deptList = res.departments;
    }, null, false);

    if(user.items.userId.val()){

        com.post(api.dd.queryDDUser, {"user.userid": user.items.userId.val()}, function(res){
            selectedDepts = res.user.department;


            var depts = [];

            var length = selectedDepts.length;
            if(length){
                for(var i = 0; i<length; i++){
                    depts.push(getSelectedDeptTree(selectedDepts[i]));
                }
            }

            $('#dddept').val(depts.length ? depts.join(',') : null);
        }, null, false);

    }

    if(!deptList.length) return;

    var deptObj = {
        '1' : {
            name: '1',
            type : 'folder',
            //children : {}
            id : 1
        }
    }, didList = [];

    //获取所有叶子节点
    $.each(deptList, function(i, v){
        didList.push(v.id);
    });

    $.each(deptList, function(i,v){
        if(v.parentid && didList.indexOf(v.parentid) != -1){
            didList.splice(didList.indexOf(v.parentid),1);
        }
    });

    var getDeptByDid = function(did){
        var depts = {};

        $.each(deptList, function(i, v){

            if(v.parentid == did){
                depts[v.id] = {
                    name: v.name,
                    type : didList.indexOf(v.id) == -1 ? 'folder' : 'item',
                    id : v.id,
                }

                if(selectedDepts && selectedDepts.length && selectedDepts.indexOf(v.id) != -1){
                    depts[v.id]["additionalParameters"] = {"item-selected" : true};
                }
            }
        });

        return depts;
    };

    $('#tree3').ace_tree({
        dataSource: {
            data : function(options, callback) {

                console.log(options);

                var $data = null;

                if(!("name" in options) && !("type" in options)){
                    $data = deptObj;//the root tree
                    callback({ data: $data });
                    return;
                }
                else if("type" in options && options.type == "folder") {
                    if("children" in options)
                        $data = options.children;
                    else {
                        $data = getDeptByDid(options.id);
                    }
                }

                if($data != null)
                    setTimeout(function(){callback({ data: $data });} , parseInt(Math.random() * 500) + 200);
            }
        },
        loadingHTML:'<div class="tree-loading"><i class="icon-refresh icon-spin blue"></i></div>',
        'open-icon' : 'icon-minus',
        'close-icon' : 'icon-plus',
        'selectable' : true,
        'multiSelect' : true,
        'selected-icon' : null,
        'unselected-icon' : null,
        folderSelect : true,
        cacheItems : false

    }).on('selected', function (evt, opt) {
        //console.log(opt.info)
    });

    $("#dddeptModal").on('hidden.bs.modal', function(e){

        $('#tree3').find('.tree-folder').each(function(){
            if($(this).css('display') != 'block')return true;
            $(this).find('.tree-folder-header i').eq(0).trigger('click');
        });
    });

    $('#dddeptbtn').click(function(){

        $('#dddeptModal').modal('show');
    });

    $('#save').click(function(){

        var items = $('#tree3' ).tree('selectedItems' );

        var length = items.length;
        var depts = [];
        if(length){
            selectedDepts = [];
            for(var i =0; i<length; i++){
                selectedDepts.push(items[i].id);
                depts.push(getSelectedDeptTree(items[i].id));
            }
        }

        $('#dddeptModal').modal("hide");
    });

    function getSelectedDeptTree(id){
        var flag = true;
        var chain = '';
        while(flag){

            $.each(deptList, function(i, v){
                if(v.id == id){
                    chain = chain ? v.name + '-' + chain : v.name + chain;

                    if(v.parentid != 1){
                        id = v.parentid
                    }else{
                        flag = false;
                    }
                    return false;
                }else return true;
            });
        }

        return chain;
    }

    function saveData() {
        if (!com.validate() && !user.repeatFlg) {
            var a, b = {
                "userInfo.user.userId": user.items.userId.val(),
                "userInfo.user.oldUserId": user.items.oldUserId.val(),
                "userInfo.user.userName": user.items.userName.val(),
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
                "userInfo.user.deptType": user.items.deptTypeSel.val(),
                "userInfo.user.dept.deptId": user.items.deptSel.val(),
                "userInfo.user.duty": user.items.dutySel.val().toString(),
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
                "userInfo.bankCardNum": user.items.bankCardNum.val()
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

            user.editFlg ? a = api.personel.updateUser: (a = api.personel.addUser, b["user.company"] = 1);

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

