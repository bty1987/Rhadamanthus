$(function(){
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
        simpleAddUserModal:null
    };

    user.simpleAddUserModal = com.focusPage("#simpleAddUserModal");
    user.simpleAddUserModal.on('hide.bs.modal',function(e){
        com.cleanItems(user.items);
        com.closeTip();
    });

    com.post(api.ds.personel, {timestamp: (new Date).getTime()},function(a) {
        user.statusType = a.statusType;
    }, null, false);

    // 获取部门类型
    com.post(api.communion.queryDepartmentType, {}, function(res){
        user.deptType = res.departmentTypes;
    }, null, false);

    var displayFunc  = (function(){
        var renderList = function(tableId, listData){
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData, function(i, v){
                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.userName));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
                    var $btnCheck = $('<a></a>').addClass('btn btn-minier btn-blue').html('查看');
                    var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-success').html('编辑');
                    var $userexception=$('<a></a>').addClass('btn btn-minier btn-pink').html('工作经历');

                    var propertyArr = [
                        ["员工编号:", v.userId, "grey"],
                        ["用户名:", v.loginId, "grey"],
                        ["部门:", v.dept.name, "grey"],
                        ["职位:", v.duty.name, "grey"],
                        ["角色:", v.role.name, "grey"],
                        ["联系方式:", v.phone, "grey"]
                    ];

                    $.each(propertyArr, function (index,value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    // 查看
                    $btnCheck.click(function(){
                        com.focusPage("text").css("line-height", "27px");
                        com.post(api.personel.queryUserInfoByUserId, {"userInfo.user.userId": v.userId}, function(res){
                            bindUserInfo(res.userInfo);
                            com.focusPage("#checkUserInfo").modal('show');
                        });
                    });

                    $btnEdit.click(function(){
                        params.personel.userId = v.userId;
                        com.popup4page("#layerPopUp", api.index.userEditIndex.url, "编辑", null, function () {
                            userSeacher.doSearch();
                        });
                    });

                    com.focusPage('#closeM').click(function(){
                        com.focusPage("#tree3").removeData("tree");
                    });
                    
                    $userexception.unbind().bind('click',function(){
                        com.focusPage('#userExpModal').modal('show');
                        com.focusPage('#userException').html("");

                        var $uli = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
                       
                        var  userExperiences=null;

                        com.post(api.personel.queryUserExperienceByUid,{"userExperience.uid":v.uid},function(res) {
                            userExperiences = res.userExperiences;
                        }, null, false);

                        if(userExperiences && userExperiences.length){
                            $.each(userExperiences,function(ind, val){
                                var $liLi = $('<li></li>').addClass('item-blue clearfix');
                                var $ulPro = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                                var $h2 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + val.type));

                                var ecperienceArr = [
                                    ["类型:", val.type, "red"],
                                    ["备注:", val.comment, "grey"],
                                    ["调动时间:",val.createTime,"green"]
                                ];

                                $.each(ecperienceArr, function (index,value) {
                                    var $liPro = $('<li></li>');
                                    $('<strong></strong>').html(value[0]).appendTo($liPro);
                                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liPro);
                                    $liPro.appendTo($ulPro);
                                });

                                $liLi.append($h2).append($ulPro).appendTo($uli)
                            })
                        }
                        $uli.appendTo(com.focusPage('#userException'));
                    });

                    $divBtnWrap.append($btnCheck).append($btnEdit).append($userexception).appendTo($h3);

                    $liLine.append($h3).append($ulProperty).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };
        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            }
        }
    })();
    var _condArr = ['userId', 'userName', 'roleId', 'deptType', 'deptId', 'userstatus', 'identity', 'phone'];

    var userSeacher = new Searcher();

    userSeacher.init( _condArr, "condList", api.personel.pageUser, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "userPostData", null, false, null, function(){
        var $addaS = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addUserSimple').css("margin", "0px 3px");
        var $addiS = $('<i></i>').addClass('icon-plus bigger-110').appendTo($addaS);
        var $addspanS = $('<span></span>').text('添加-简化').appendTo($addaS);

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addUser').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $importa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
        var $importi = $('<i></i>').addClass('icon-upload bigger-110').appendTo($importa);
        var $importspan = $('<span></span>').text('上传').appendTo($importa);

        return [$addaS, $adda, $importa];
    });

    com.focusPage('a[name="addUser"]','#pagenation').click(function(){
        params.personel.userId = null;
        com.popup4page("#layerPopUp", api.index.userEditIndex.url, "添加", null, function () {
            com.closePopup();
            userSeacher.doSearch();
        });
    });

    com.focusPage('a[name="addUserSimple"]','#pagenation').click(function(){
        user.simpleAddUserModal.modal("show");
    });

    com.focusPage('a[name="import"]','#pagenation').click(function(){
        com.focusPage('#importModal').modal("show");
    });
    
    com.uploadify("#import", "上传文件", api.salary.importUserSalary, 'btn btn-success col-sm-12', '*.xls;*.xlsx', {'uploadType': 4}, 1);

    // 添加人员(简化版)
    user.saveBtn = com.focusPage("#saveUserBtn").on("click", saveData);
    user.cancelBtn = com.focusPage("#cancelUserBtn").on("click",function() {
        user.simpleAddUserModal.modal("hide");
    });

    user.items.loginId = com.focusPage("#loginId").on("blur", function() {
        $this = $(this);
        void 0 == $this.val() || "" == $this.val().trim() || $this.val() == user.editLoginId ? (com.showTip(com.focusPage("#loginId"),"用户名不能为空", "right"), user.repeatFlg = !1) : com.post(api.personel.queryUserByLoginId, {
            "user.loginId": $this.val()
        }, function(res) {
            user.loginFlag =false;
            com.showTips(com.focusPage("#loginId"),"用户名已存在", "right");
        }, function(res){
            user.loginFlag =true;
        });
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
        com.post(api.system.queryDutyByDtid,{"duty.departmentType.dtid" :$(this).val()},function(res){
            user.dutyTypeMap=res.dutys;
            user.items.dutySel.bindData(user.dutyTypeMap,"did","name");
        },null,false);
        com.post(api.communion.queryDepartmentByDtid, {"dept.type.dtid": $(this).val()}, function(res) {
            user.items.deptSel.bindData(res.deptList, "did", "name");
            d && d();
        },null,false);
    }).trigger("change");

    user.items.statusSel = com.focusPage("#statusSel").bindData(user.statusType,"key", "value");

    com.datetime(com.focusPage("#birthday"));

    function saveData() {
        if( "" == user.items.loginId.val().trim() || user.items.loginId.val() == null) {
            com.showTip(com.focusPage("#loginId"),"用户名不能为空","bottom");
            user.loginFlag=false
        }

        if (!com.validate("simpleAddUserModal") && !user.repeatFlg && user.loginFlag) {
            var options = {
                "userInfo.user.userName": user.items.userName.val().trim(),
                "userInfo.user.currentName": user.items.currentName.val(),
                "userInfo.user.gender":  com.genderType[user.items.gender.prop("checked")],
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

            com.post(api.personel.addUser, options, function(res){
                com.showAlert(com.info, "操作成功");
                com.closePopup();
            });
        }
    }

    // 查看页面绑定人员信息
    function bindUserInfo($userInfo){
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

});
