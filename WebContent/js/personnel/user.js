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

    //获取部门类型
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
                    var $qrcode = $('<a></a>').addClass('btn btn-minier btn-yellow').html('二维码');
                    var $btnCheck = $('<a></a>').addClass('btn btn-minier btn-blue').html('查看');
                    var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-success').html('编辑');
                    var $addDD=$('<a></a>').addClass('btn btn-minier btn-warning').html('添加到钉钉');
                    var $updateDD=$('<a></a>').addClass('btn btn-minier btn-inverse').html('同步钉钉信息');
                    var $deleteDD=$('<a></a>').addClass('btn btn-minier btn-danger').html('从钉钉删除');
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

                    $qrcode.click(function(){
                        com.focusPage('#qrcodeModal').modal('show');
                        com.focusPage('#Qrcode').html("");

                        com.focusPage('#Qrcode').qrcode({
                            render: "canvas", //也可以替换为table
                            width: 150,
                            height: 150,
                            text: "fanglinserver:"+v.userId
                        });
                    });

                    //查看
                    $btnCheck.click(function(){
                        com.focusPage("text").css("line-height", "27px");
                        com.post(api.personel.queryUserInfoByUserId, {"userInfo.user.userId": v.userId}, function(res){
                            bindUserInfo(res.userInfo);
                            com.focusPage("#checkUserInfo").modal('show');
                        });
                    });

                    $btnEdit.click(function(){
                        params.tempUserId = v.userId;
                        com.popup4page("#layerPopUp", api.index.userEditIndex.url, "编辑", null, function () {
                            userSeacher.doSearch();
                        });
                    });

                    //添加点击事件
                    $addDD.unbind().bind('click',function(){
                        com.focusPage('#ddModal').modal('show');

                        com.focusPage('#tree3').html("");
                        com.focusPage("#tree3").removeData("tree");
                        com.focusPage("#tree3").unbind('click');
                        var deptList = null;

                        com.post(api.dd.queryDDDepartment, {}, function(res){
                            deptList = res.departments;
                        }, null, false);

                        if(deptList == null ){
                            return false;
                        }

                        var deptObj = {
                            '1' : {
                                name:params.company.name,
                                type : 'folder',
                                id : params.company.no
                            }
                        },
                        didList = [];
                        //获取所有叶子节点
                        $.each(deptList, function(i, v){
                            didList.push(v.id);
                        });

                        $.each(deptList, function(i,v){
                            if(v.parentid && didList.indexOf(v.parentid) != -1){
                                didList.splice(didList.indexOf(v.parentid),1);
                            }
                        });
                        //splice为删除了父类的id,余下的在didlist中的id为子节点的id

                        com.focusPage('#tree3').ace_tree({
                            dataSource: {
                                data : function(options, callback) {
                                    var $data = null;
                                    if( !("type" in options)){
                                        $data = deptObj;//the root tree
                                        callback({ data: $data });
                                        return;
                                    }else if("type" in options && options.type == "folder") {
                                        if("children" in options){
                                            $data = options.children;
                                        } else {
                                            $data = getDeptByDid(options.id);
                                        }
                                    }

                                    if($data != null){
                                        setTimeout(function(){callback({ data: $data });} , parseInt(Math.random() * 500) + 200);
                                    }
                                }
                            },
                            loadingHTML:'<div class="tree-loading"><i class="icon-refresh icon-spin blue"></i></div>',
                            'open-icon' : 'icon-minus',
                            'close-icon' : 'icon-plus',
                            'selectable' : true,//可选
                            'multiSelect' : true, //多选
                            'selected-icon' : null,
                            'unselected-icon' : null,
                            folderSelect : true,
                            cacheItems : false
                        }).on('selected', function (evt, opt) {});

                        var getDeptByDid = function(did){
                            var depts = {};
                            $.each(deptList, function(i, v){
                                if(v.parentid == did){
                                    depts[v.id] = {
                                        name: v.name,
                                        type : didList.indexOf(v.id) == -1 ? 'folder' : 'item',
                                        id : v.id
                                    }
                                }
                            });
                            return depts;
                        };

                        com.focusPage('#savebtn').unbind().bind('click',function(){
                            var items = com.focusPage('#tree3' ).tree('selectedItems' );
                            var length = items.length;
                            com.focusPage('#ddModal').modal("hide");
                            var params = {
                                "user.userid" : v.userId,
                                "user.name":v.currentName,
                                "user.Mobile":v.phone,
                                "user.Position":v.duty.name
                            };

                            if(length){
                                for(var i =0; i<length; i++){
                                    params["dids" + "[" + i + "]"]=items[i].id;
                                }
                            }

                            com.post(api.dd.queryDDUser, {"user.userid": v.userId}, function (res) {
                                if(res.user.userid != null){
                                    com.post(api.dd.updateDDUser, params, function(data){
                                        if($.trim(data.errcode) == $.trim(0) ){
                                            com.showAlert(com.info, "更新成功");
                                        }else{
                                            com.showAlert(com.error,"更新失败" );
                                        }
                                    });
                                } else {
                                    com.post(api.dd.addDDUser, params, function(data){
                                        if($.trim(data.errcode) == $.trim(0) ){
                                            com.showAlert(com.info, "创建成功");
                                        }else{
                                            com.showAlert(com.error,"创建失败" );
                                        }
                                    });
                                }
                            }, null, false);
                        });
                        //removeData() 方法删除之前通过 data() 方法设置的数据  $(selector).removeData(name)
                        com.focusPage('#cancel').click(function(){
                            com.focusPage("#tree3").removeData("tree");
                        });
                    });

                    com.focusPage('#closeM').click(function(){
                        com.focusPage("#tree3").removeData("tree");
                    });
                    //同步钉钉信息
                    $updateDD.click(function(){
                        var btn = $(this);
                        var span = btn.find('span');
                        btn.find('i').remove();
                        var loading = $('<i></i>').addClass('icon-spinner icon-spin white bigger-125');
                        span.prepend(loading);
                        var message = "<p>确定要将该员工信息同步到钉钉吗?</p>";
                        com.showConfirm(message, function(result) {
                            var selectedDepts = [];
                            var phone;
                            com.post(api.dd.queryDDUser, {"user.userid": v.userId}, function (res) {
                            selectedDepts = res.user.department;
                            phone = res.user.mobile;
                            if (selectedDepts == null){
                                com.showAlert(com.error, "该员工还没有添加到钉钉部门");
                                return;
                              }

                            var params = {
                                "user.userid": v.userId,
                                "user.name": v.currentName,
                                "user.Mobile": phone,
                                "user.Position": v.duty.name,
                                 "dids": selectedDepts
                              };

                             com.post(api.dd.updateDDUser, params, function (data) {
                                  if ($.trim(data.errcode) == $.trim(0)) {
                                       com.showAlert(com.info, "更新成功");
                                    } else {
                                       com.showAlert(com.error, "更新失败");
                                     }
                                  });
                              }, null, false);
                        });
                    });
                    //删除点击事件
                    $deleteDD.click(function(){
                        var btn = $(this);
                        var span = btn.find('span');
                        btn.find('i').remove();
                        var loading = $('<i></i>').addClass('icon-spinner icon-spin white bigger-125');
                        span.prepend(loading);
                        var message = "<p>确定要删除该员工吗?</p>";
                        com.showConfirm(message, function(result) {
                            com.post(api.dd.queryDDUser, {"user.userid": v.userId}, function (res) {
                                if(res.user.name != null){
                                   com.post(api.dd.deleteDDUser, {"user.userid":  v.userId}, function(data){
                                	   if($.trim(data.errcode) == $.trim(0) ){
                                		   com.showAlert(com.info, "删除成功");
                                		   } else {
                                       	   com.showAlert(com.error,"删除失败");
                                       	   }
                                       });
                                  }else{
                                    com.showAlert(com.error, "钉钉中没有该用户, 无法删除");
                                    }
                             });
                        });
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

                    $divBtnWrap.append($qrcode).append($btnCheck).append($btnEdit).append($addDD).append($updateDD).append($deleteDD).append($userexception).appendTo($h3);

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
        params.tempUserId = null;
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

    com.focusPage('#import').Huploadify({
        'debug' : false, // 开启调试
        'auto':true, // 是否自动上传
        'successTimeout':config.uploadTimeout, // 超时时间
        'formData':{
            'uploadType':4
        },
        'buttonClass': 'btn btn-success col-sm-12',
        'overrideEvents' : ['onDialogClose'], // 不执行默认的onSelect事件
        'fileObjName':'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'uploader': config.server + 'importUserSalary.do', // 上传处理程序
        'height':'30', // 浏览按钮的高度
        'fileTypeDesc':'支持的格式:',  // 在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeExts':'*.xls;*.xlsx', // 允许上传的文件后缀
        'fileSizeLimit':'5MB', // 上传文件的大小限制
        'queueSizeLimit' : 1, // 上传数量
        'onUploadSuccess':function(file, data, response){ //上传到服务器, 服务器返回相应信息到data里
            var dateObj = eval("("+data+")");
        }
    });

    //添加人员(简化版)
    user.saveBtn = com.focusPage("#saveUserBtn").on("click", saveData);
    user.cancelBtn = com.focusPage("#cancelUserBtn").on("click",function() {
        user.simpleAddUserModal.modal("hide");
    });

    user.items.loginId = com.focusPage("#loginId").on("blur", function() {
        $this = $(this);
        void 0 == $this.val() || "" == $this.val().trim() || $this.val() == user.editLoginId ? (com.showTip(com.focusPage("#loginId"), "用户名不能为空", "right"), user.repeatFlg = !1) : com.post(api.personel.queryUserByLoginId, {
            "user.loginId": $this.val()
        }, function(res) {
            user.loginFlag =false;
            com.showTip(com.focusPage("#loginId"),"用户名已存在", "right");
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
            com.showTip(com.focusPage("#loginId"), "用户名不能为空", "right");
            user.loginFlag=false
        }

        if (!com.validate() && !user.repeatFlg && user.loginFlag) {
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
                user.simpleAddUserModal.modal("hide");
            });
        }
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

});
