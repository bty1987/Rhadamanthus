$(function () {
    var customerSource = {
            
        saveDesignerBtn: com.focusPage("#saveDesignerBtn"),
        updateAndApprovalBtn: com.focusPage("#updateAndApprovalBtn"),
        approvalBtn: com.focusPage("#approvalBtn"),
        
        modals: {
            bindAllInfoModal: com.focusPage("#bindAllInfo"),
            sustomerSourceModal: com.focusPage("#sustomersource"),
            commitApproveModal: com.focusPage("#commitApprove"),
            codeModal: com.focusPage("#codeModal")
        },
        
        items: {
            name: com.focusPage("#name"),
            gender: com.focusPage("#gender"),
            phone: com.focusPage("#phone"),
            purpose: com.focusPage("#purpose"),
            intention: com.focusPage("#intention"),
            price: com.focusPage("#price"),
            grade: com.focusPage("#grade"),
            comment: com.focusPage("#comment"),

            villageNo: com.focusPage("#villageNo"),
            houseNumber: com.focusPage("#houseNumber"),
            buildArea: com.focusPage("#buildArea"),
            rule: com.focusPage("#rule"),

            designer: com.focusPage("#designer"),
            villageNoBind: com.focusPage("#villageNoBind"),
            houseNumberBind: com.focusPage("#houseNumberBind"),
            nameBind: com.focusPage("#nameBind"),
            phoneBind: com.focusPage("#phoneBind"),
            built: com.focusPage("#built"),
            unit: com.focusPage("#unit"),
            floor: com.focusPage("#floor"),
            door: com.focusPage("#door"),
            builtrule: com.focusPage("#builtrule"),
            unitrule: com.focusPage("#unitrule"),
            floorrule: com.focusPage("#floorrule"),
            doorrule: com.focusPage("#doorrule"),
            houseTypeOne: com.focusPage("#houseTypeOne"),
            houseTypeTwo: com.focusPage("#houseTypeTwo"),
            houseTypeThr: com.focusPage("#houseTypeThr"),
            houseTypeFour: com.focusPage("#houseTypeFour"),

            nameApprove: com.focusPage("#nameApprove"),
            phoneApprove: com.focusPage("#phoneApprove"),
            villageNoDesiger: com.focusPage("#villageNoDesiger"),
            houseNumberApprove: com.focusPage("#houseNumberApprove"),
            salesman: com.focusPage("#salesman"),
            salesmanType: com.focusPage("#salesmanType"),
            houseType: com.focusPage("#houseType"),
            houseClass: com.focusPage("#houseClass"),
            orderType: com.focusPage("#orderType"),
            resourceType: com.focusPage("#resourceType"),
            approveComment: com.focusPage("#approveComment")
        },

        bindHouseDiv: com.focusPage("#bindHouseDiv"),
        bindCustomerDiv: com.focusPage("#bindCustomerDiv"),

        csid: null,
        
        status: {},

        grade: ["A", "B", "C", "D"],
        currentCustomerSource: {}
    };

    customerSource.saveDesignerBtn.bindClick(bindAllInfo);
    customerSource.updateAndApprovalBtn.bindClick(customerUpdate);
    customerSource.approvalBtn.bindClick(customerApproval);

    customerSource.items.gender.switchBtn("gender");
    customerSource.items.grade.bindData(customerSource.grade, "key", "value", false);
    
    com.post(api.ds.customer, {}, function (res) {
        customerSource.status = res.customerSourceStatus.split('key', 'value');
    }, null, false);

    com.post(api.ds.building, {}, function (res) {
        customerSource.items.builtrule.bindData(res.buildruleOne, "key", "value");
        customerSource.items.unitrule.bindData(res.buildruleTwo, "key", "value");
        customerSource.items.floorrule.bindData(res.buildruleTwo, "key", "value");
        customerSource.items.doorrule.bindData(res.buildruleThr, "key", "value");
    }, null, false);

    com.post(api.ds.decoration, {}, function (res) {
        customerSource.items.houseClass.bindData(res.houseClass, 'key', 'value');
        customerSource.items.salesmanType.bindData(res.salesmanType, 'key', 'value');
        customerSource.items.orderType.bindData(res.type, 'key', 'value');
        customerSource.items.resourceType.bindData(res.status, 'key', 'value');
    }, null, false);

    com.initTypeahead('designer', api.personel.queryUserByPinyin, "pinyinName", {"user.status": 0}, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('salesman', api.personel.queryUserByPinyin, "pinyinName", {"user.status": 0}, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('villageNoBind', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value", function(list, k, v){
        com.post(api.data.queryVillageById, {"village.no": k}, function (res) {
            customerSource.items.rule.html("推荐楼牌号规则: " + (res.village.rule == null || res.village.rule == "" ? "暂无推荐规则" : res.village.rule));
        }, null, false);
        return v;
    });

    customerSource.modals.sustomerSourceModal.on("hide.bs.modal", function(){
        com.closeTip();
        com.cleanItems(customerSource.items);
    });

    customerSource.modals.bindAllInfoModal.on("hide.bs.modal", function(){
        com.closeTip();
        com.cleanItems(customerSource.items);
        customerSource.items.rule.html("");
    });

    customerSource.modals.commitApproveModal.on("hide.bs.modal", function(){
        com.closeTip();
        com.cleanItems(customerSource.items);
    });

    var displayFunc = (function () {
        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);
                    $liLine.appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {
            var $liLine = $('<li></li>').addClass('item-orange clearfix ');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnCode = $("<a></a>").addClass("btn btn-minier btn-info").html("二维码");
            var $btnView = $("<a></a>").addClass("btn btn-minier btn-yellow").html("编辑");
            var $btnBind = $("<a></a>").addClass("btn btn-minier btn-success").html("绑定");
            var $release = $("<a></a>").addClass("btn btn-minier btn-warning").html("释放");
            var $record = $("<a></a>").addClass("btn btn-minier btn-pink").html("记录");
            var $commit = $("<a></a>").addClass("btn btn-minier btn-blue").html("提交");
            var $backout = $("<a></a>").addClass("btn btn-minier btn-danger").html("撤销");
            var $confirm = $("<a></a>").addClass("btn btn-minier btn-inverse").html("确认");
            var $btnApproval = $("<a></a>").addClass("btn btn-minier btn-success").html("审批");

            var propertyArr = [
                ["客户电话: ", v.phone, "grey"],
                ["性别: ", v.gender, "grey"],
                ["目的: ", v.purpose, "grey"],
                ["风格意向: ", v.intention, "grey"],
                ["预计装修价格: ", v.price, "blue"],
                ["客户等级: ", v.grade, "grey"],
                ["创建人: ", v.creater.currentName, "grey"],
                ["创建时间: ", v.createTime, "green"],
                ["归属人: ", v.belonger.currentName, "grey"],
                ["归属部门: ", v.department.name, "grey"],
                ["归属分区: ", v.region.name, "grey"],
                ["归属设计师: ", com.checkNull(v.designer.currentName,'无'), "grey"],
                ["楼盘名: ",com.checkNull(v.village.name,'无'), "grey"],
                ["楼牌号: ", v.houseNumber, "blue"],
                ["建筑面积: ", v.buildArea, "blue"],
                ["装修单号: ", com.checkNull(v.orderId, '无'), "blue"],
                ["状态: ", customerSource.status[v.status], "red"],
                ["备注: ", com.checkNull(v.comment, '无'), "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnCode);

            if(v.status == 0){
                $divBtnWrap.append($btnView).append($btnBind).append($commit).append($release);
            }else  if(v.status == 1){
                $divBtnWrap.append($confirm);
            }else if([2, 5].contains(v.status)){
                $divBtnWrap.append($btnApproval)
            }

            if([1, 2, 5].contains(v.status)){
                $divBtnWrap.append($backout);
            }

            $divBtnWrap.append($record);

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            //二维码
            $btnCode.click(function(){
                com.focusPage('#code').html("");

                com.focusPage('#code').qrcode({
                    render: "canvas",
                    width: 150,
                    height: 150,
                    text: " http://fanglin.vip/wx/customersource?csid=" + v.csid
                });

                customerSource.modals.codeModal.modal('show');
            });

            //编辑
            $btnView.click(function () {
                customerSource.currentCustomerSource = v;

                customerSource.items.villageNo.attr("readOnly", "readOnly");
                customerSource.items.houseNumber.attr("readOnly", "readOnly");
                customerSource.items.name.attr("readOnly", "readOnly");
                customerSource.items.phone.attr("readOnly", "readOnly");

                editcustomerOrigin(v);
            });

            $record.click(function () {
                params.csid = v.csid;
                com.popup4page('#customerRecordPopup', "views/customer/customerRecord.html","记录内容");
            });

            $release.click(function () {
                if(v.belonger.userId == null){
                    com.showAlert(com.warning, "无归属人信息!");
                    return;
                }
                release(v.csid);
            });

            //绑定信息
            $btnBind.click(function () {
                customerSource.currentCustomerSource = v;
                v.designer != null ? com.updateTypeahead("designer", v.designer.userId, v.designer.currentName) : com.cleanTypeahead("designer");
                com.updateTypeahead('villageNoBind', v.village.no, v.village.name + "-" + v.village.cityProper.name);
                customerSource.items.houseNumberBind.val(v.houseNumber);
                customerSource.items.nameBind.val(v.name);
                customerSource.items.phoneBind.val(v.phone);
                customerSource.modals.bindAllInfoModal.modal("show");
            });

            //提交
            $commit.click(function(){
                com.showConfirm("是否确认提交客源", function(){
                    com.post(api.customer.commitCustomerOrigin, {"customerOrigin.csid": v.csid}, function(res){
                        searcher.doSearch();
                        com.showAlert(com.info, "提交成功!");
                    })
                });
            });

            //撤销
            $backout.click(function(){
                com.showConfirm("是否确认撤销客源", function(){
                    com.post(api.customer.cancelCustomerOrigin, {"customerOrigin.csid": v.csid}, function(res){
                        searcher.doSearch();
                        com.showAlert(com.info, "撤销成功!");
                    })
                });
            });

            //确认
            $confirm.click(function(){
                com.showConfirm("确认客源信息", function(){
                    com.post(api.customer.confirmCustomerOrigin, {"customerOrigin.csid": v.csid}, function(res){
                        searcher.doSearch();
                        com.showAlert(com.info, "确认成功!");
                    })
                });
            });

            //审批
            $btnApproval.click(function () {
                initqueryApprovalUserForCheckbox("approveMan", 14);
                customerSource.currentCustomerSource = v;
                customerSource.items.villageNoDesiger.prop("disabled", true);
                customerSource.items.houseNumberApprove.attr("disabled", "disabled");
                customerSource.items.nameApprove.attr("disabled", "disabled");
                customerSource.items.phoneApprove.attr("disabled", "disabled");


                com.updateTypeahead('villageNoDesiger', v.village.no, v.village.name + "-" + v.village.cityProper.name);
                customerSource.items.houseNumberApprove.val(v.houseNumber);
                customerSource.items.nameApprove.val(v.name);
                customerSource.items.phoneApprove.val(v.phone);
                customerSource.modals.commitApproveModal.modal("show");
            });

            return $liLine;
        };
        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();

    searcher.init(["customerSourcePhone"], "condList", api.customer.pageCustomerOrigin, function (data) {
        displayFunc.init("resultList", data);
    }, "pagenation", "customerOriginPostData", null, false, null, null);

    function editcustomerOrigin(d) {
        customerSource.items.name.val(d.name);
        customerSource.items.gender.val(d.gender);
        customerSource.items.phone.val(d.phone);
        customerSource.items.purpose.val(d.purpose);
        customerSource.items.intention.val(d.intention);
        customerSource.items.price.val(d.price);
        customerSource.items.grade.val(d.grade);
        customerSource.items.comment.val(d.comment);
        customerSource.items.houseNumber.val(d.houseNumber);
        customerSource.items.buildArea.val(d.buildArea);

        if(d.gender == "女"){
            customerSource.items.gender.prop("checked", true);
        }

        if(d.gender == "男"){
            customerSource.items.gender.prop("checked", false);
        }

        if(d.village != null && d.village.name != null){
            com.updateTypeahead('villageNo', d.village.no, d.village.name + "-" + d.village.cityProper.name);
        }else{
            com.cleanTypeahead('villageNo');
        }
        customerSource.modals.sustomerSourceModal.modal("show");
    }

    //编辑
    function customerUpdate(){
        if (com.validate("sustomersource")) {
            return false;
        }

        var options = {
            "customerOrigin.csid": customerSource.currentCustomerSource.csid,
            "customerOrigin.name": customerSource.items.name.val(),
            "customerOrigin.gender": com.genderType[customerSource.items.gender.prop("checked")],
            "customerOrigin.phone": customerSource.items.phone.val(),
            "customerOrigin.purpose": customerSource.items.purpose.val(),
            "customerOrigin.intention": customerSource.items.intention.val(),
            "customerOrigin.price": customerSource.items.price.val(),
            "customerOrigin.grade": customerSource.items.grade.val(),
            "customerOrigin.comment": customerSource.items.comment.val(),
            "customerOrigin.village.no": com.typeahead("villageNo"),
            "customerOrigin.houseNumber": customerSource.items.houseNumber.val(),
            "customerOrigin.buildArea": customerSource.items.buildArea.val()
        };

        com.post(api.customer.updateCustomerOrigin, options, function (res) {
            searcher.doSearch();
            com.showAlert(com.info, '修改成功');
            customerSource.modals.sustomerSourceModal.modal("hide");
        });
    }

    //绑定相关信息
    function bindAllInfo(v){
        if (com.validate("bindAllInfo")) {
            return false;
        }

        var hid = checkHouse();
        var cid = checkCustomer();

        var options = {
            "customerOrigin.csid": customerSource.currentCustomerSource.csid,
            "customerOrigin.designer.userId": com.typeahead("designer"),
            "customerOrigin.house.hid": hid,
            "customerOrigin.customer.cid": cid,
            "customerOrigin.phone": customerSource.items.phoneBind.val() //为了避免编辑时修改电话号, 导致客源中和客户中信息对应不上情况
        };

        com.post(api.customer.bindCustomerOrigin, options, function (res) {
            searcher.doSearch();
            com.showAlert(com.info, '绑定成功');
            customerSource.modals.bindAllInfoModal.modal("hide");
        });
    }

    function release(csid) {
        com.showConfirm("是否确认释放客源", function(){
            com.post(api.customer.freeCustomerOrigin, {"customerOrigin.csid": csid}, function (res) {
                searcher.doSearch();
                com.showAlert(com.info, '释放成功');
            });
        });
    }

    //检查获取楼盘
    function checkHouse(){
        var hid = "";
        var rulenum = [
            customerSource.items.built.val().trim().toUpperCase(), customerSource.items.builtrule.val(),
            customerSource.items.unit.val().trim().toUpperCase(), customerSource.items.unitrule .val(),
            customerSource.items.floor.val().trim().toUpperCase(), customerSource.items.floorrule.val(),
            customerSource.items.door.val().trim().toUpperCase(), customerSource.items.doorrule.val()
        ];

        var houseNumber = houseUtils.creatHouseNumber(rulenum);

        var houseOption = {
            "house.village.no" : com.typeahead("villageNoBind"),
            "house.houseNumber" : houseNumber,
            "house.built" : customerSource.items.built.val(),
            "house.unit" : customerSource.items.unit.val(),
            "house.floor" : customerSource.items.floor.val(),
            "house.door" : customerSource.items.door.val(),
            "house.buildArea" : customerSource.currentCustomerSource.buildArea,
            "house.roomNum" : customerSource.items.houseTypeOne.val(),
            "house.houseType" : customerSource.items.houseTypeOne.val() + "室" + customerSource.items.houseTypeTwo.val() + "厅" + customerSource.items.houseTypeThr.val() + "厨" + customerSource.items.houseTypeFour.val() + "卫"
        };

        com.post(api.data.existHouse, houseOption, function(res){
            hid = res.house.hid;
        }, null, false);

        return hid;
    }

    //检查获取客户
    function checkCustomer(){
        var cid = "";
        var customerOption = {
            "customer.name" : customerSource.items.nameBind.val(),
            "customer.phone" : customerSource.items.phoneBind.val(),
            "customer.gender": customerSource.currentCustomerSource.gender,
            "customer.relationshipType" : "普通客户",
            "customer.qq" :  "",
            "customer.wechat" :  "",
            "customer.email" :  "",
            "customer.address" :  ""
        };

        com.post(api.data.existCustomer, customerOption, function(res){
            cid = res.customer.cid;
        }, null, false);

        return cid;
    }

    //审批人员信息
    function initqueryApprovalUserForCheckbox (id, type, checkId) {
        var $approvalDiv = com.focusPage('#' + id);

        $approvalDiv.empty();

        com.post(api.approval.queryApproverByType, {"approver.type": type}, function (res) {
            $.each(res.approvers, function (i, v) {
                var $approvaler = $('<label></label>');
                var $div = $('<div></div>').addClass("radio no-padding").attr("style", "margin-bottom:10px");
                var $input = $('<input>').attr({
                    "type": "radio",
                    "name": "form-field-radio",
                    "class": "ace",
                    "id": v.userBase.uid,
                    "userId": v.userBase.userId,
                    "userName":  v.userBase.userName
                });
                var $span = $('<span></span>').addClass('lbl').html($('<label></label>').attr('style', 'display:inline-block;width:47px;text-align-last:justify;margin-left:10px;padding:0px').text(v.userBase.currentName));
                var $comment = $('<span></span>').addClass("lbl").text(v.comment == null ? " " : v.comment).attr("style", "margin-left:15px");
                $input.appendTo($approvaler);
                $span.appendTo($approvaler);
                $comment.appendTo($approvaler);
                $approvaler.appendTo($div);
                $div.appendTo($approvalDiv);
            });
        });
    }

    //提交审批
    function customerApproval(){
        if (com.validate("commitApprove")) {
            return false;
        }

        //审批创建装修单
        var receiverId = com.focusPage("#approveMan").find('input:checked').attr('userid');
        if(receiverId == null || receiverId == ""){
            com.showAlert(com.error,"请选择审批人!");
            return false;
        }

        com.showConfirm("是否确认提交审批", function(){
            var option =  {
                "approval.receiver.userId": receiverId,
                "approvalCustomerOriginTDecoration.customerOrigin.csid" : customerSource.currentCustomerSource.csid,
                "approvalCustomerOriginTDecoration.type": customerSource.items.orderType.val(),
                "approvalCustomerOriginTDecoration.salesman.userId": com.typeahead("salesman"),
                "approvalCustomerOriginTDecoration.salesmanType": customerSource.items.salesmanType.val(),
                "approvalCustomerOriginTDecoration.houseType": customerSource.items.houseType.val(),
                "approvalCustomerOriginTDecoration.houseClass": customerSource.items.houseClass.val(),
                "approvalCustomerOriginTDecoration.resourceType": customerSource.items.resourceType.val()
            };

            com.post(api.approval.submitApprovalForCustomerOriginTDecoration, option, function (res) {
                if(res.errorCode == 0){
                    com.showAlert(com.info, "操作成功");
                    com.clearValidator();
                    searcher.doSearch();
                    customerSource.modals.commitApproveModal.modal("hide");
                }else{
                    com.showAlert(com.error, "提交失败");
                }
            });
        });
    }
});