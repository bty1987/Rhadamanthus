$(function () {
    var customerSourceDesigner = {
        grade: ["A", "B", "C", "D"],
        items: {},
        currentCustomerSource: {},
        typeArray: {},
        isUpdateOrApproval: null,
        currentVillageName: null,
        currentHid: 0,
        currentCid: 0
    };

    customerSourceDesigner.items.name = com.focusPage("#name");
    customerSourceDesigner.items.gender = com.focusPage("#gender");
    customerSourceDesigner.items.phone = com.focusPage("#phone");
    customerSourceDesigner.items.purpose = com.focusPage("#purpose");
    customerSourceDesigner.items.intention = com.focusPage("#intention");
    customerSourceDesigner.items.price = com.focusPage("#price");
    customerSourceDesigner.items.grade = com.focusPage("#grade");
    customerSourceDesigner.items.comment = com.focusPage("#comment");

    customerSourceDesigner.items.villageNoDesiger = com.focusPage("#villageNoDesiger");
    customerSourceDesigner.items.houseNumber = com.focusPage("#houseNumber");
    customerSourceDesigner.items.buildArea = com.focusPage("#buildArea");
    customerSourceDesigner.items.houseType = com.focusPage("#houseType");
    customerSourceDesigner.items.salesmanType = com.focusPage("#salesmanType");
    customerSourceDesigner.items.orderType = com.focusPage("#orderType");
    customerSourceDesigner.items.resourceType = com.focusPage("#resourceType");
    customerSourceDesigner.items.approveComment = com.focusPage("#approveComment");

    customerSourceDesigner.items.built = com.focusPage("#built");
    customerSourceDesigner.items.unit = com.focusPage("#unit");
    customerSourceDesigner.items.floor = com.focusPage("#floor");
    customerSourceDesigner.items.door = com.focusPage("#door");
    customerSourceDesigner.items.builtrule = com.focusPage("#builtrule");
    customerSourceDesigner.items.unitrule = com.focusPage("#unitrule");
    customerSourceDesigner.items.floorrule = com.focusPage("#floorrule");
    customerSourceDesigner.items.doorrule = com.focusPage("#doorrule");
    customerSourceDesigner.items.ruleTwo = com.focusPage("#ruleTwo");

    customerSourceDesigner.items.rule = com.focusPage("#rule");

    customerSourceDesigner.items.grade.bindData(customerSourceDesigner.grade);
    customerSourceDesigner.items.gender.switchBtn("gender");

    com.post(api.ds.building, {}, function (res) {
        customerSourceDesigner.items.builtrule.bindData(res.buildrule, "key", "value");
        customerSourceDesigner.items.unitrule.bindData(res.buildrule, "key", "value");
        customerSourceDesigner.items.floorrule.bindData(res.buildrule, "key", "value");
        customerSourceDesigner.items.doorrule.bindData(res.buildrule, "key", "value");
    }, null, false);

    com.initChosen('villageNoDesiger', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value");

    customerSourceDesigner.items.villageNoDesiger.on('change', function () {
        com.post(api.data.queryVillageById, {"village.no": customerSourceDesigner.items.villageNoDesiger.val()}, function (res) {
            customerSourceDesigner.items.rule.html("推荐楼牌号规则：" + res.village.rule);
        }, null, false);
    });

    customerSourceDesigner.updateAndApprovalBtn =  com.focusPage("#updateAndApprovalBtn").on("click", customerApproval);

    com.focusPage("#sustomersourceDesigner").on("hidden.bs.modal", function(){
        customerSourceDesigner.isUpdateOrApproval = null;
        com.clearValidator("#villageNoDesiger", true);
        com.clearValidator("#houseNumber", true);
        com.clearValidator("#name", true);
        com.focusPage("#rule").html("");
        com.focusPage("#houseNumber").removeAttr("data-content");
        com.focusPage("#name").removeAttr("data-content");
        customerSourceDesigner.currentHid = 0;
        customerSourceDesigner.currentCid = 0;
        com.focusPage("#bindHouseDiv").removeAttr("style");
        com.focusPage("#bindCustomerDiv").removeAttr("style");
        aboutCustomerAndHouse();
    });

    com.post(api.ds.decoration, {}, function (res) {
        customerSourceDesigner.items.salesmanType.bindData(res.salesmanType, 'key', 'value');
        customerSourceDesigner.items.orderType.bindData(res.type, 'key', 'value');
        customerSourceDesigner.items.resourceType.bindData(res.status, 'key', 'value');
    }, null, false);

    com.post(api.ds.building, {}, function (res) {
        customerSourceDesigner.typeArray = res.houseType;
    }, null, false);

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

            var $btnView = $("<a></a>").addClass("btn btn-minier btn-yellow").html("编辑");
            var $btnApproval = $("<a></a>").addClass("btn btn-minier btn-success").html("转装修单");

            var propertyArr = [
                ["客户电话: ", v.phone, "grey"],
                ["性别: ", v.gender, "grey"],
                ["目的: ", v.purpose, "grey"],
                ["意向: ", v.intention, "grey"],
                ["需求价格: ", v.price, "blue"],
                ["客户等级: ", v.grade, "grey"],
                ["创建人: ", v.creater.currentName, "grey"],
                ["创建时间: ", v.createTime, "green"],
                ["归属人: ", v.belonger.currentName, "grey"],
                ["归属部门: ", v.department.name, "grey"],
                ["归属分区: ", v.region.name, "grey"],
                ["归属设计师: ", com.checkNull(v.designer.currentName, '无'), "grey"],
                ["楼盘名: ", com.checkNull(v.village.name, '无'), "grey"],
                ["楼牌号: ", v.houseNumber, "blue"],
                ["建筑面积: ", v.buildArea, "blue"],
                ["装修单号: ", com.checkNull(v.orderId, '无'), "blue"],
                ["备注: ", com.checkNull(v.comment, '无'), "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            //审批拒绝的情况下，status是3，失效的客源不能再编辑转装修单要重新录入
            if(v.status == 0){
                $divBtnWrap.append($btnView).append($btnApproval);
            }

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            //编辑
            $btnView.click(function () {
                customerSourceDesigner.currentCustomerSource = v;
                if(v.hid != 0){
                    com.focusPage("#villageNoDesiger").prop("disabled", true);
                    com.focusPage("#villageNoDesiger").parent().find(".chosen-container").addClass("chosen-disabled");
                    com.focusPage("#houseNumber").attr("readOnly", "readOnly");
                    com.focusPage("#buildArea").attr("readOnly", "readOnly");
                }

                if(v.cid != 0){
                    com.focusPage("#name").attr("readOnly", "readOnly");
                    com.focusPage("#gender").attr("disabled", "disabled");
                    com.focusPage("#phone").attr("readOnly", "readOnly");
                }
                com.focusPage("#sustomersourceDesignerDialog").html("编辑客源");
                customerSourceDesigner.isUpdateOrApproval = "update";
                isOtherCustomerSource(false);
                editcustomerOrigin(v);
            });

            //转装修单提交审批
            $btnApproval.click(function () {
                initqueryApprovalUserForCheckbox("approveMan", 14);
                customerSourceDesigner.currentCustomerSource = v;
                customerSourceDesigner.currentHid = v.hid;
                customerSourceDesigner.currentCid = v.cid;
                com.focusPage("#sustomersourceDesignerDialog").html("提交审批");
                customerSourceDesigner.isUpdateOrApproval = "approval";
                isOtherCustomerSource(true);

                if(v.hid != 0){
                    com.focusPage("#bindHouseDiv").css("display", "none");
                    com.focusPage("#houseNumberGroupTwo").css("display", "none");
                    com.focusPage("#houseNumberGroup").removeAttr("style");
                }

                if(v.cid != 0){
                    com.focusPage("#bindCustomerDiv").css("display", "none");
                }
                editcustomerOrigin(v);
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

    searcher.init(["customerSourcePhone"], "condList", api.customer.pageCustomerOriginForDesign, function (data) {
        displayFunc.init("resultList", data);
    }, "pagenation", "customerOriginDesignerPostData", null, false, null, null);

    function editcustomerOrigin(d) {
        com.cleanItems(customerSourceDesigner.items);
        com.clearValidator();

        customerSourceDesigner.items.name.val(d.name);
        customerSourceDesigner.items.gender.val(d.gender);
        customerSourceDesigner.items.phone.val(d.phone);
        customerSourceDesigner.items.purpose.val(d.purpose);
        customerSourceDesigner.items.intention.val(d.intention);
        customerSourceDesigner.items.price.val(d.price);
        customerSourceDesigner.items.grade.val(d.grade);
        customerSourceDesigner.items.comment.val(d.comment);
        customerSourceDesigner.items.houseNumber.val(d.houseNumber);
        customerSourceDesigner.items.buildArea.val(d.buildArea);

        if(d.gender == "女"){
            customerSourceDesigner.items.gender.prop("checked", true);
        }

        if(d.gender == "男"){
            customerSourceDesigner.items.gender.prop("checked", false);
        }

        if(d.village != null && d.village.name != null){
            com.updateChosen('villageNoDesiger', d.village.no, d.village.name + "-" + d.village.cityProper.name);
            customerSourceDesigner.currentVillageName = d.village.name;
        }else{
            com.updateChosen('villageNoDesiger', "", "");
        }
        com.focusPage("#sustomersourceDesigner").modal("show");
    }

    //提交审批
    function customerApproval(){
        if (com.validate("sustomersourceDesigner")) {
            return;
        }

        if(customerSourceDesigner.isUpdateOrApproval == "update"){
            var customerId = null;
            var houseId = null;
            var houseName = null;

            var options = {
                "customerOrigin.csid": customerSourceDesigner.currentCustomerSource.csid,
                "customerOrigin.name": customerSourceDesigner.items.name.val(),
                "customerOrigin.gender": com.genderType[customerSourceDesigner.items.gender.prop("checked")],
                "customerOrigin.phone": customerSourceDesigner.items.phone.val(),
                "customerOrigin.purpose": customerSourceDesigner.items.purpose.val(),
                "customerOrigin.intention": customerSourceDesigner.items.intention.val(),
                "customerOrigin.price": customerSourceDesigner.items.price.val(),
                "customerOrigin.grade": customerSourceDesigner.items.grade.val(),
                "customerOrigin.comment": customerSourceDesigner.items.comment.val(),
                "customerOrigin.village.no": customerSourceDesigner.items.villageNoDesiger.val(),
                "customerOrigin.houseNumber": customerSourceDesigner.items.houseNumber.val(),
                "customerOrigin.buildArea": customerSourceDesigner.items.buildArea.val()
            };

            com.post(api.customer.updateCustomerOrigin, options, function (res) {
                searcher.doSearch();
                com.showAlert(com.info, '修改成功');
                com.focusPage("#sustomersourceDesigner").modal("hide");
            });
        }else if(customerSourceDesigner.isUpdateOrApproval == "approval"){
            //审批创建装修单
            var receiverId = com.focusPage("#approveMan").find('input:checked').attr('userid');
            if(receiverId == null || receiverId == ""){
                com.showAlert(com.error,"请选择审批人!");
                return;
            }

            if(customerSourceDesigner.currentCustomerSource.belonger.userId == null){
                com.showAlert(com.warning, "请确认业务员信息!");
                return;
            }

            bootbox.confirm("确认要提交审批吗?", function(res) {
                if(res){
                    //这里判断当前操作人是否是设计师，如果是可以提交审批
                    if (params.userInfo.user.uid == customerSourceDesigner.currentCustomerSource.designer.uid) {
                        if(customerSourceDesigner.currentHid == 0){
                            com.showAlert(com.warning, "请绑定楼盘!");
                            return;
                        }

                        if(customerSourceDesigner.currentCid == 0){
                            com.showAlert(com.warning, "请绑定客户!");
                            return;
                        }

                        var approvalShowParams = [
                            {"name":"楼盘信息","value": customerSourceDesigner.currentVillageName + " " + createHouseNumber()},
                            {"name":"客户姓名","value": customerSourceDesigner.items.name.val()},
                            {"name":"客户电话","value": customerSourceDesigner.items.phone.val()},
                            {"name":"新设计师","value": customerSourceDesigner.currentCustomerSource.designer.userName},
                            {"name":"新业务员","value": customerSourceDesigner.currentCustomerSource.belonger.userName}
                        ];

                        com.post(api.approval.submitApprovalForCustomerOriginTDecoration,
                            {
                                "approval.receiver.userId": receiverId,
                                "approvalCustomerOriginTDecoration.csid" : customerSourceDesigner.currentCustomerSource.csid,
                                "approvalCustomerOriginTDecoration.type": customerSourceDesigner.items.orderType.val(),
                                "approvalCustomerOriginTDecoration.salesmanType": customerSourceDesigner.items.salesmanType.val(),
                                "approvalCustomerOriginTDecoration.houseType": customerSourceDesigner.items.houseType.val(),
                                "approvalCustomerOriginTDecoration.resourceType": customerSourceDesigner.items.resourceType.val()
                            }, function (res) {
                                if(res.errorCode == 0){
                                    com.showAlert(com.info, "操作成功");
                                    com.clearValidator();
                                    searcher.doSearch();
                                    com.focusPage("#sustomersourceDesigner").modal("hide");
                                }else{
                                    com.showAlert(com.error, "提交失败");
                                }
                            });
                    } else {
                        com.showAlert(com.warning, "设计师不匹配, 不能提交审批!");
                    }
                }
            });
        }
    }

    //信息是否显示
    function isOtherCustomerSource(isFlag){
        if(isFlag){
            //审批
            com.focusPage("#houseTypeGroup").removeAttr("style");
            com.focusPage("#salesmanTypeGroup").removeAttr("style");
            com.focusPage("#orderTypeGroup").removeAttr("style");
            com.focusPage("#resourceTypeGroup").removeAttr("style");
            com.focusPage("#approveManGroup").removeAttr("style");
            com.focusPage("#approveCommentGroup").removeAttr("style");
            com.focusPage("#houseNumberGroupTwo").removeAttr("style");
            com.focusPage("#bindHouse").removeAttr("style");
            com.focusPage("#bindCustomer").removeAttr("style");

            com.focusPage("#purposeGroup").css("display", "none");
            com.focusPage("#intentionGroup").css("display", "none");
            com.focusPage("#priceGroup").css("display", "none");
            com.focusPage("#gradeGroup").css("display", "none");
            com.focusPage("#commentGroup").css("display", "none");
            com.focusPage("#buildAreaGroup").css("display", "none");
            com.focusPage("#genderGroup").css("display", "none");
            com.focusPage("#houseNumberGroup").css("display", "none");

            com.focusPage("#houseNumber").attr("disabled", "disabled");
            com.focusPage("#name").attr("disabled", "disabled");
            com.focusPage("#phone").attr("disabled", "disabled");

            com.focusPage("#villageNoDesiger").prop("disabled", true);
            com.focusPage("#villageNoDesiger").parent().find(".chosen-container").addClass("chosen-disabled");
        }else{
            //更新
            com.focusPage("#houseTypeGroup").css("display", "none");
            com.focusPage("#salesmanTypeGroup").css("display", "none");
            com.focusPage("#orderTypeGroup").css("display", "none");
            com.focusPage("#resourceTypeGroup").css("display", "none");
            com.focusPage("#approveManGroup").css("display", "none");
            com.focusPage("#approveCommentGroup").css("display", "none");
            com.focusPage("#houseNumberGroupTwo").css("display", "none");
            com.focusPage("#bindHouse").css("display", "none");
            com.focusPage("#bindCustomer").css("display", "none");

            com.focusPage("#purposeGroup").removeAttr("style");
            com.focusPage("#intentionGroup").removeAttr("style");
            com.focusPage("#priceGroup").removeAttr("style");
            com.focusPage("#gradeGroup").removeAttr("style");
            com.focusPage("#commentGroup").removeAttr("style");
            com.focusPage("#buildAreaGroup").removeAttr("style");
            com.focusPage("#genderGroup").removeAttr("style");
            com.focusPage("#houseNumberGroup").removeAttr("style");

            com.focusPage("#houseNumber").removeAttr("disabled");
            com.focusPage("#name").removeAttr("disabled");
            com.focusPage("#phone").removeAttr("disabled");

            com.focusPage("#villageNoDesiger").prop("disabled", false);
            com.focusPage("#villageNoDesiger").parent().find(".chosen-container").removeClass("chosen-disabled");
        }
    }

    function aboutCustomerAndHouse(){
        com.focusPage("#villageNoDesiger").prop("disabled", false);
        com.focusPage("#villageNoDesiger").parent().find(".chosen-container").removeClass("chosen-disabled");
        com.focusPage("#houseNumber").removeAttr("readOnly");
        com.focusPage("#buildArea").removeAttr("readOnly");
        com.focusPage("#name").removeAttr("readOnly");
        com.focusPage("#gender").removeAttr("disabled");
        com.focusPage("#phone").removeAttr("readOnly");
    }

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

    function createHouseNumber(){
        var rulenum = [
            customerSourceDesigner.items.built.val().trim().toUpperCase(), customerSourceDesigner.items.builtrule.val(),
            customerSourceDesigner.items.unit.val().trim().toUpperCase(), customerSourceDesigner.items.unitrule .val(),
            customerSourceDesigner.items.floor.val().trim().toUpperCase(), customerSourceDesigner.items.floorrule.val(),
            customerSourceDesigner.items.door.val().trim().toUpperCase(), customerSourceDesigner.items.doorrule.val()
        ];

        return houseUtils.creatHouseNumber(rulenum);
    }

    //绑定房产
    com.focusPage("#bindHouse").click(function(){
        if(com.focusPage("#villageNoDesiger").val() == ""){
            com.showTips(com.focusPage("#villageNoDesiger"), "内容不能为空", true);
            return;
        }else{
            com.clearValidator("#villageNoDesiger", true);
        }

        if(com.focusPage("#built").val() == ""){
            com.showTips(com.focusPage("#built"), "内容不能为空", true);
            return;
        }else{
            com.clearValidator("#built", true);
        }

        if(com.focusPage("#unit").val() == ""){
            com.showTips(com.focusPage("#unit"), "内容不能为空", true);
            return;
        }else{
            com.clearValidator("#unit", true);
        }

        if(com.focusPage("#floor").val() == ""){
            com.showTips(com.focusPage("#floor"), "内容不能为空", true);
            return;
        }else{
            com.clearValidator("#floor", true);
        }

        if(com.focusPage("#door").val() == ""){
            com.showTips(com.focusPage("#door"), "内容不能为空", true);
            return;
        }else{
            com.clearValidator("#door", true);
        }

        var houseNumber = createHouseNumber();

        var houseOption = {
            "house.village.no" : customerSourceDesigner.items.villageNoDesiger.val(),
            "house.houseNumber" : houseNumber,
            "house.built" : customerSourceDesigner.items.built.val(),
            "house.unit" : customerSourceDesigner.items.unit.val(),
            "house.floor" : customerSourceDesigner.items.floor.val(),
            "house.door" : customerSourceDesigner.items.door.val(),
            "house.buildArea" : customerSourceDesigner.items.buildArea.val()
        };

        com.post(api.data.existHouse, houseOption, function(res){
            customerSourceDesigner.currentHid = res.house.hid;
            //更新客源中的hid
            com.post(api.customer.bindCustomerOrigin, {"customerOrigin.csid": customerSourceDesigner.currentCustomerSource.csid, "customerOrigin.hid": customerSourceDesigner.currentHid}, function(res){
                customerSourceDesigner.currentCustomerSource.hid = customerSourceDesigner.currentHid;
                customerSourceDesigner.currentCustomerSource.houseNumber = houseNumber;

                com.focusPage("#bindHouseDiv").css("display", "none");
                com.focusPage("#houseNumberGroupTwo").css("display", "none");
                com.focusPage("#houseNumber").val(houseNumber);
                com.focusPage("#houseNumberGroup").removeAttr("style");

                com.showAlert(com.info, "绑定成功!");
            }, null, false);
        })
    });

    //绑定客户
    com.focusPage("#bindCustomer").click(function(){
        var customerOption = {
            "customer.name" : customerSourceDesigner.items.name.val(),
            "customer.phone" : customerSourceDesigner.items.phone.val(),
            "customer.gender": com.genderType[customerSourceDesigner.items.gender.prop("checked")],
            "customer.relationshipType" : "普通客户",
            "customer.qq" :  "",
            "customer.wechat" :  "",
            "customer.email" :  "",
            "customer.address" :  ""
        };

        com.post(api.data.existCustomer, customerOption, function(res){
            customerSourceDesigner.currentCid = res.customer.cid;
            //更新客源中的cid
            com.post(api.customer.bindCustomerOrigin, {"customerOrigin.csid": customerSourceDesigner.currentCustomerSource.csid, "customerOrigin.cid": customerSourceDesigner.currentCid}, function(res){
                com.focusPage("#bindCustomerDiv").css("display", "none");
                customerSourceDesigner.currentCustomerSource.cid = customerSourceDesigner.currentCid;
                com.showAlert(com.info, "绑定成功!");
            }, null, false);

        })
    });
});