$(function(){
    
    var supplier = {
            
        btns: {
            saveBtn: com.focusPage("#saveUserBtn"),
            
            advanceSaveBtn: com.focusPage("#advanceSaveBtn"),
        },
        
        modals: {
            addSupplierModal: com.focusPage("#addSupplierModal"),
            showSupplierModal: com.focusPage("#showSupplierModal"),
            advanceModal: com.focusPage("#supplierAdvanceModal"),
        },
        
        items: {
            loginId: com.focusPage("#loginId", "#addSupplierModal"),
            userName: com.focusPage("#userName", "#addSupplierModal"),
            phone: com.focusPage("#phone", "#addSupplierModal"),
            deptTypeSel: com.focusPage("#deptTypeSel", "#addSupplierModal"),
            deptSel: com.focusPage("#deptSel", "#addSupplierModal"),
            dutySel: com.focusPage("#dutySel", "#addSupplierModal"),
            statusSel: com.focusPage("#statusSel", "#addSupplierModal"),
            
            isLogin: com.focusPage("#isLogin", "#supplierAdvanceModal"),
            extranet: com.focusPage("#extranet", "#supplierAdvanceModal"),
            roleSel: com.focusPage("#roleSel", "#supplierAdvanceModal"),
            oldcompany: com.focusPage("#oldcompany", "#supplierAdvanceModal"),
            company: com.focusPage("#company", "#supplierAdvanceModal")
        },
        
        deptType: {},
        statusType: {},
        
        roleList: {},
        
        userId: null,
        company: null,
    }
    
    supplier.modals.addSupplierModal.on('hide.bs.modal',function(e){
        com.cleanItems(supplier.items);
        com.closeTip();
    });

    com.post(api.ds.personel, {}, function(res) {
        supplier.items.statusSel = com.focusPage("#statusSel").bindData(res.statusType, "key", "value");
    }, null, false);
    
    com.post(api.system.queryRole, {"timestamp": new Date().getTime()}, function(res){
        supplier.items.roleSel.bindData(res.roleList, "rid", "name");
    }, null, false);

    com.post(api.communion.queryDepartmentType, {}, function(res){
        supplier.items.deptTypeSel.bindData(res.departmentTypes, "dtid", "name");
    }, null, false);
    
    com.post(api.system.queryCompany,{},function(res){
        supplier.items.company.bindData(res.companys , "cid", "name");
    }, null, false);
    
    supplier.items.loginId.on("blur", function() {
        $this = $(this);
        
        var _loginId = $this.val();
        
        if(_loginId.trim() == "") return false;
        
        com.post(api.personel.queryUserByLoginId, {"user.loginId": _loginId}, function(res) {
            //com.showAlert(com.warning, "用户名已存在");
            com.showTip(supplier.items.loginId, "用户名已存在", "right");
            supplier.items.loginId.val("");
        }, function(error){});
    });
    
    supplier.items.deptTypeSel.on("change", function(b, d) {
        com.post(api.system.queryDutyByDtid,{"duty.departmentType.dtid" :$(this).val()},function(res){
            supplier.items.dutySel.bindData(res.dutys, "did", "name");
        });
        
        com.post(api.communion.queryDepartmentByDtid, {"dept.type.dtid": $(this).val()}, function(res) {
            supplier.items.deptSel.bindData(res.deptList, "did", "name");
        });
    }).trigger("change");
    
    supplier.btns.saveBtn.on("click", saveData);
    
    supplier.btns.advanceSaveBtn.on("click", saveAdvance);

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
                    var $btnRight = $('<a></a>').addClass('btn btn-minier btn-success').html('权配');
                    var $resetPassword = $('<a></a>').addClass('btn btn-minier btn-yellow').html('重置密码');
                    var $defaultPassword = $('<a></a>').addClass('btn btn-minier btn-success').html('默认密码');

                    var propertyArr = [
                        ["编号:", v.userId, "grey"],
                        ["用户名:", v.loginId, "grey"],
                        ["部门:", v.dept.name, "grey"],
                        ["职位:", v.duty.name, "grey"],
                        ["联系方式:", v.phone, "grey"]
                    ];

                    $.each(propertyArr, function (index,value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    //查看
                    $btnCheck.click(function(){
                        com.focusPage("text").css("line-height", "27px");
                        com.post(api.personel.queryUserInfoByUserId, {"userInfo.user.userId": v.userId}, function(res){
                            bindUserInfo(res.userInfo);
                            com.focusPage("#checkUserInfo").modal('show');
                        });
                    });

                    com.focusPage('#closeM').click(function(){
                        com.focusPage("#tree3").removeData("tree");
                    });
                    
                    $btnRight.click(function(){
                        showAdvance(v.userId);
                    });
                    
                    $resetPassword.click(function(){
                        resetPassword(v.userId,v.userName);
                    });

                    $defaultPassword.click(function(){
                        defaultPassword(v.userId, v.userName);
                    });
                    
                    $divBtnWrap.append($btnRight).append($resetPassword).append($defaultPassword).appendTo($h3);

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
    var _condArr = ['personel-userId', 'personel-userName', 'personel-userstatus', 'personel-phone'];

    var seacher = new Searcher();

    seacher.init( _condArr, "condList", api.personel.pageSupplier, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "supplierPostData", null, false, null, function(){
        var $addaS = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addSupplier').css("margin", "0px 3px");
        var $addiS = $('<i></i>').addClass('icon-plus bigger-110').appendTo($addaS);
        var $addspanS = $('<span></span>').text('添加').appendTo($addaS);

        return [$addaS];
    });

    com.focusPage('a[name="addSupplier"]','#pagenation').click(function(){
        supplier.modals.addSupplierModal.modal("show");
    });

    function saveData() {
        
        if(com.validate("addSupplierModal")) return false;

        var options = {
            "supplier.loginId": supplier.items.loginId.val(),
            "supplier.userName": supplier.items.userName.val().trim(),
            "supplier.currentName": supplier.items.userName.val().trim(),
            "supplier.gender": 0,
            "supplier.identity": "",
            "supplier.phone": supplier.items.phone.val(),
            
            "supplier.dtid": supplier.items.deptTypeSel.val(),
            "supplier.dept.did": supplier.items.deptSel.val(),
            "supplier.duty.did": supplier.items.dutySel.val(),
            "supplier.status": supplier.items.statusSel.val(),
        };

        com.post(api.personel.addSupplier, options, function(res){
            com.showAlert(com.info, "操作成功");
            supplier.modals.addSupplierModal.modal("hide");
            
            seacher.doSearch();
        });
    }

    //查看页面绑定人员信息
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
    
    function showAdvance(userId){
        
        supplier.userId = userId;
        
        var options = {
            "user.userId": userId
        };
        
        com.post(api.personel.queryUserByUserId, options, function(res){
            
            var user = res.user;
            
            supplier.items.isLogin.prop("checked", (user.isLogin & 1) == 1 ? true : false);
            supplier.items.extranet.prop("checked", user.extranet == 1 ? true : false);

            supplier.items.roleSel.val(user.role.rid);
            
            supplier.items.oldcompany.val(user.companys);
            
            supplier.modals.advanceModal.modal("show");
            
        }, null, false);
    }

    function saveAdvance(){
        
        var options = {
            "user.userId": supplier.userId,
            "user.isLogin": supplier.items.isLogin.prop("checked") ? 1 : -1,
            "user.extranet": supplier.items.extranet.prop("checked") ? 1 : 0,
            "user.role.rid": supplier.items.roleSel.val(),
            "user.companys": supplier.items.company.val()
        };

        com.post(api.personel.updateUserForAdvance, options, function(res){
            com.showAlert(com.info, "提交成功");
        });

        supplier.modals.advanceModal.modal("hide");
        
        return false;
    }
    
    function resetPassword(userId,userName){
        com.showConfirm("确定要重置("+userName+")的密码吗?",function(result){
            com.post(api.personel.resetPassword, {'user.userId': userId});
        });
    }

    function defaultPassword(userId,userName){
        com.showConfirm("确定要重置("+userName+")密码为默认密码?",function(result){
            com.post(api.personel.defaultPassword, {'user.userId': userId});
        });
    }

});
