
$(function () {
    
    var auditRecord = {
        arid:0,
        aid:0,
        designerId:"",
        deptId:"",
        managerId:"",
        decorationOrderId:"",
        auditStatusType:"",
        rollback :params.rollback,
    };
    var auditScale = {
        asid:0,
        arid:0,
        userId:"",
        deptId:"",
        money:0,
        type:0,
        status:0
    };
    var pageAdd = {
        select1 : $("#select1"),
        select2 : $('#select2'),
    }
    var perCharge = {};
    var auditScalePage = {
        auditScaleModel:$("#auditScaleModel"),
        auditScaleStatusModel:$("#auditScaleStatusModel"),

        userId:$("#userId"),
        deptId:$("#deptId"),
        money:$("#money"),
        status:$("#status"),

        add:$("#addS"),
        saveBtn:$("#saveBtnS"),
        cancelBtn:$("#cancelBtnS"),
    };
    var auditRecordPage = {
        changeAuditRecordModel:$("#auditRecordModel"),

        comment:$("#comment"),
        untiPrice:$("#untiPrice"),
        num:$("#num"),
        discount:$("#discount"),

        add:$("#addR"),
        saveBtn:$("#saveBtn"),
        cancelBtn:$("#cancelBtn"),
        btnBack:$("#btnBack"),
      

    };

    var auditScalePostdataStr = {
        asid:"auditScale.asid",
        arid:"auditScale.auditRecord.arid",
        userId:"auditScale.belongUser.userId",
        deptId:"auditScale.belongDepartment.deptId",
        money:"auditScale.money",
        type:"auditScale.type",
        status:"auditScale.status",

    };
    var auditRecordPostdata = {};
    var status = {};
    com.post(api.ds.decoration,{},function (res) {
        auditScalePage.status.bindData(res.auditScaleStatus,"key","value");
        $.each(res.auditScaleStatus,function (i,v) {
            status[v.key] = v.value;
        })
    });

    var auditScalePostdata = {};

    var auditRecordPostdataStr = {
        arid:"auditRecord.arid",
        aid:"auditRecord.audit.aid",
        comment:"auditRecord.comment",
        unitprice:"auditRecord.unitprice",
        num:"auditRecord.num",
        discount:"auditRecord.discount",
        status:"auditRecord.status",
        orderId:"auditRecord.audit.decorationOrder.orderId"
    };

    com.post(api.ds.decoration,{},function (res) {
        $.each(res.perCharge,function (i,v) {
            perCharge[v.key] = v.value;
        })
    });

    com.initChosen('userId', api.personel.queryUserForNameByPinyinName, "pinyinName", {}, "autoFillKeyValue", "key", "value");
    auditScalePage.userId.on('change',function () {
        com.post(api.personel.queryUserByUserId,{"user.userId":auditScalePage.userId.val()},function (res) {
            auditScalePage.deptId.val(res.user.dept.deptName);
        })
    })
    auditRecord.auditStatusType = params.auditStatusType;
    auditRecord.decorationOrderId = params.decorationOrderId;
    if(auditRecord.auditStatusType=='select'){
            initPage();
            initPageScale();
        pageAdd.select1.html('');
        pageAdd.select2.html('');

    }
    if(auditRecord.auditStatusType=='admin') {
        auditRecord.designerId = params.designerId;
        auditRecord.deptId = params.deptId;
        auditRecord.managerId = params.managerId;
        initPage();
        initBtn();
        initPageScale();
    }

    auditRecord.rollback && auditRecordPage.btnBack.click(function () {
        com.switchPage(auditRecord.rollback);
    })

    function initPageScale(){
        var $Scale = $('#auditS').html('');
        var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($Scale);
        var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
        $mesg.append( $('<span></span>').text('请选择审核信息'));

    }
    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var type = {"0": "未处理", "1": "已处理"};
                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.comment));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                    var $btnView = $('<a>人员扣款<i class="icon-arrow-right icon-on-right"></i></a>').addClass('btn btn-minier btn-primary');
                    var $btnChange = $('<a></a>').addClass('btn btn-minier btn-success').html('修改');
                    var $btnMake = $('<a></a>').addClass('btn btn-minier btn-warning').html('生成扣款');

                    var total = utils.changeThrDecimal(utils.accMul(utils.accMul(v.unitprice,v.num),v.discount/10));
                    
                    var propertyArr = [
                        ["单价:",v.unitprice, "grey"],
                        ["数量:",v.num, "grey"],
                        ["折扣:",v.discount, "grey"],
                        ["总价:",total, "grey"],
                        ["状态:",type[v.status],"red"],
                    ];

                    $.each(propertyArr, function (index,value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $btnView.click(function(){
                        viewAuditScale(v.arid);
                    });

                    $btnChange.click(function(){
                        changeAuditRecord(v.arid,v.unitprice,v.num,v.discount,v.comment);
                    });

                    $btnMake.bindClick(function () {
                        makeAuditRecord(total,v.arid);
                    });
                    if(auditRecord.auditStatusType=='admin'){
                        $divBtnWrap.append($btnChange).append($btnMake);
                    }

                    $divBtnWrap.append($btnView).appendTo($h3);

                    $liLine.append($h3).append($ulProperty).append($divBtnBlock).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }else{
                var $Record = $('#auditR').html('');
                var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($Record);
                var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
                $mesg.append( $('<span></span>').text('无审核信息'));
            }
        };
        //人员扣款
        var viewAuditScale = function (arid){
            initPages(arid);
        };
        //修改
        var changeAuditRecord = function (arid,untiprice,num,discount,comment){
            auditRecordPage.comment.val(comment);
            auditRecordPage.untiPrice.val(untiprice);
            auditRecordPage.num.val(num);
            auditRecordPage.discount.val(discount);
            auditRecordPage.changeAuditRecordModel.attr("arid",arid);
            auditRecordPage.changeAuditRecordModel.attr("type","change");
            auditRecordPage.changeAuditRecordModel.modal("show");
            initPages(arid);
        };
        //生成人员扣款
        var makeAuditRecord = function (total,arid) {

            if(auditRecord.managerId == null ){
                com.showAlert(com.error,"设计师无对应部门经理");
                return;
            }

            com.post(api.decoration.makeAuditScale,$.extend(makeAuditScalesPostdata(0,arid,auditRecord.designerId,auditRecord.deptId,((utils.accMul(total,perCharge["designer"]))/10),0),
                makeAuditScalesPostdata(1,arid,auditRecord.managerId,auditRecord.deptId,((utils.accMul(total,perCharge["manager"]))/10),1)),function (res) {
                com.showAlert(com.info,"生成人员成功");
                initPage();
                initPages(arid);
            },function (e) {
                com.showAlert(com.error,e.errorMsg);
                initPages(arid);
            })
        };
        
        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            }
        }
    })();
    
    function makeAuditRecordPostParam(arid,aid,comment,unitprice,num,discount,status,orderId) {
        auditRecordPostdata = {};
        if(arid){auditRecordPostdata[auditRecordPostdataStr.arid] = arid}
        if(aid){auditRecordPostdata[auditRecordPostdataStr.aid] = aid}
        if(comment){auditRecordPostdata[auditRecordPostdataStr.comment] = comment}
        if(unitprice){auditRecordPostdata[auditRecordPostdataStr.unitprice] = unitprice}
        if(num){auditRecordPostdata[auditRecordPostdataStr.num] = num}
        if(discount){auditRecordPostdata[auditRecordPostdataStr.discount] = discount}
        if(status){auditRecordPostdata[auditRecordPostdataStr.status] = status}
        if(orderId){auditRecordPostdata[auditRecordPostdataStr.orderId] = orderId}
        return auditRecordPostdata;
    }

    function makeAuditScalesPostdata(i,arid,userId,deptId,money,type){
        auditScalePostdata = {};
        if(arid){auditScalePostdata["auditScales["+i+"].auditRecord.arid"] = arid}
        if(userId){auditScalePostdata["auditScales["+i+"].belongUser.uid"] = userId}
        if(deptId){auditScalePostdata["auditScales["+i+"].belongDepartment.deptId"] = deptId}
        if(money){auditScalePostdata["auditScales["+i+"].money"] = money}
        if(type){auditScalePostdata["auditScales["+i+"].type"] = type;}
        return auditScalePostdata
    }

    function initPage() {
        com.post(api.decoration.queryAuditRecordByOrderId, {'auditRecord.audit.decorationOrder.orderId':auditRecord.decorationOrderId},function (res) {
            if(res.auditRecords && res.auditRecords.length){
                auditRecord.aid = res.auditRecords[0].audit.aid;
            }
            displayFunc.init('auditR', res.auditRecords);
        },function (e) {
            com.showAlert(com.error,e.errorMsg);
        });
    }

    function initBtn() {
        var number = /^[1-9]\d*$/;
        var num = /^([1-9]|10)$/;
        auditRecordPage.add.click(function () {
            auditRecordPage.changeAuditRecordModel.attr("type","addR");
            auditRecordPage.changeAuditRecordModel.modal("show");

        });
        auditRecordPage.saveBtn.click(function () {
            if(auditRecordPage.comment.val() == null || auditRecordPage.comment.val() == ''){
                bootbox.alert("扣款说明不能为空");
            }
            if((!number.test(auditRecordPage.untiPrice.val())) || auditRecordPage.untiPrice.val() == null || auditRecordPage.untiPrice.val() == ''){
                bootbox.alert("单价只能输入数字");
                return;
            }
            if((!number.test(auditRecordPage.num.val())) || auditRecordPage.num.val() == null || auditRecordPage.num.val() == ''){
                bootbox.alert("数量只能输入数字");
                return;
            }
            if((!num.test(auditRecordPage.discount.val())) || auditRecordPage.discount.val() == null || auditRecordPage.discount.val() == ''){
                bootbox.alert("折扣只能输入1-10的数字");
                return;
            }
            var type = auditRecordPage.changeAuditRecordModel.attr("type");
            if(type == "addR"){
                com.post(api.decoration.addAuditRecord,makeAuditRecordPostParam(null,auditRecord.aid,auditRecordPage.comment.val()
                    ,auditRecordPage.untiPrice.val(),auditRecordPage.num.val(),auditRecordPage.discount.val(),null,auditRecord.decorationOrderId),function (res) {
                    com.showAlert(com.info,"添加成功");
                    auditRecordPage.changeAuditRecordModel.modal("hide");
                    clearAuditRecordModel();
                    initPage();
                },function (e) {
                    auditRecordPage.changeAuditRecordModel.modal("hide");
                    clearAuditRecordModel();
                    com.showAlert(com.error,e.errorMsg);
                })
            }else if(type == "change"){
                com.post(api.decoration.updateAuditRecord,makeAuditRecordPostParam(auditRecordPage.changeAuditRecordModel.attr("arid"),auditRecord.aid,auditRecordPage.comment.val()
                    ,auditRecordPage.untiPrice.val(),auditRecordPage.num.val(),auditRecordPage.discount.val()),function (res) {
                    com.showAlert(com.info,"修改成功");
                    auditRecordPage.changeAuditRecordModel.modal("hide");
                    clearAuditRecordModel();
                    initPage();
                    initPages(auditRecordPage.changeAuditRecordModel.attr("arid"));
                },function (e) {
                    auditRecordPage.changeAuditRecordModel.modal("hide");
                    clearAuditRecordModel();
                    com.showAlert(com.error,e.errorMsg);
                })
            }

        });
        auditRecordPage.cancelBtn.click(function () {
            clearAuditRecordModel();
            auditRecordPage.changeAuditRecordModel.modal("hide");
        });




        auditScalePage.add.click(function () {
            auditScalePage.auditScaleModel.modal("show");
        });
        auditScalePage.saveBtn.click(function () {
            if(auditScalePage.userId.val() == null || auditScalePage.userId.val() == ''){
                bootbox.alert("请输入被扣款人");
                return;
            }
            if((!number.test(auditScalePage.money.val())) || auditScalePage.money.val() == null || auditScalePage.money.val() == ''){
                bootbox.alert('扣款金额只能输入整数');
                return;
            }
            com.post(api.decoration.addAuditScale,makeAuditScalePostdata(null,auditScale.arid,auditScalePage.userId.val(),auditScalePage.deptId.val(),auditScalePage.money.val(),0),function (res) {
                com.showAlert(com.info,"添加成功");
                auditScalePage.auditScaleModel.modal("hide");
                clearAuditScaleModel();
                initPages(auditScale.arid);
            },function (e) {
                auditScalePage.auditScaleModel.modal("hide");
                clearAuditScaleModel();
                com.showAlert(com.error,e.errorMsg);
            })
        });
        auditScalePage.cancelBtn.click(function () {
            clearAuditScaleModel();
            auditScalePage.auditScaleModel.modal("hide");
        });

    }
    function clearAuditScaleModel() {
        com.updateChosen('userId', '', '');
        auditScalePage.deptId.val("");
        auditScalePage.money.val("");

    }
    function clearAuditScaleStatusModel() {
        auditScalePage.status.val("");
    }
    function clearAuditRecordModel() {
        auditRecordPage.comment.val("");
        auditRecordPage.untiPrice.val("");
        auditRecordPage.num.val("");
        auditRecordPage.discount.val("");
    }
    var displayFuncs  = (function(){

        var renderLists = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.belongUser.currentName));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
                    var $confirm = $('<a></a>').addClass('btn btn-minier btn-danger').html('确认扣款');
                    var $btnDel = $('<a></a>').addClass('btn btn-minier btn-warning').html('删除');

                    var propertyArr = [
                        ["扣款金额:",v.money, "grey"],
                        ["职位:",v.type == 0 ? "设计师": "设计部经理", "grey"],
                        ["扣款状态:",status[v.status], "red"],
                    ];

                    $.each(propertyArr, function (index,value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });
                    $confirm.click(function(){
                        changeAuditScaleStatus(v.asid);
                    })

                    $btnDel.bindClick(function () {
                        delAuditScale(v.asid);
                    });
                    if(auditRecord.auditStatusType=='admin'){
                        if(v.status==0){
                            $divBtnWrap.append($confirm)
                        }
                        $divBtnWrap.append($btnDel).appendTo($h3);
                    }

                    $liLine.append($h3).append($ulProperty).append($divBtnBlock).appendTo($ul);
                });

                $ul.appendTo($tableWrap);

            }else{

                var $Scale = $('#auditS').html('');
                var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($Scale);
                var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
                $mesg.append( $('<span></span>').text('无审批记录'));
            }
        };
        //修改
        var changeAuditScaleStatus = function (asid){
            bootbox.confirm("确认提交扣款信息?",function(res){
                //如果为ture
                if(res){
                    com.post(api.decoration.updateAuditScaleForStatus,makeAuditScalePostdata(asid,null,null,null,null,null,1), function(res){
                        com.showAlert(com.info, "操作成功");
                        initPages(auditScale.arid);
                    });
                }
            });
        };
        //删除人员扣款
        var delAuditScale = function (asid) {
            bootbox.confirm("确认删除审核记录?",function(res){
                if(res) {
                    com.post(api.decoration.deleteAuditScale, makeAuditScalePostdata(asid), function (res) {
                        com.showAlert(com.info, "删除成功");
                        initPages(auditScale.arid);
                    }, function (e) {
                        com.showAlert(com.error, e.errorMsg);
                    })
                }
            });
        };

        return {
            inits : function(tableId,listData){
                $('#' + tableId).html(null);
                renderLists(tableId,listData);
            }
        }
    })();

    function initPages(arid) {
        com.post(api.decoration.queryAuditScaleByArid,makeAuditScalePostdata(null,arid),function (res) {
            auditScalePage.add.css('visibility','visible');
            auditScale.arid = arid;
            displayFuncs.inits('auditS', res.auditScales);
        },function (e) {
            com.showAlert(com.error,e.errorMsg);
        });
    }
    function makeAuditScalePostdata(asid,arid,userId,deptId,money,type,status){
        auditScalePostdata = {};
        if(arid){auditScalePostdata[auditScalePostdataStr.arid] = arid}
        if(asid){auditScalePostdata[auditScalePostdataStr.asid] = asid}
        if(userId){auditScalePostdata[auditScalePostdataStr.userId] = userId}
        if(deptId){auditScalePostdata[auditScalePostdataStr.deptId] = deptId}
        if(money){auditScalePostdata[auditScalePostdataStr.money] = money}
        if(type){auditScalePostdata[auditScalePostdataStr.type] = type;}
        if(status){auditScalePostdata[auditScalePostdataStr.status] = status;}
        return auditScalePostdata
    }
});

