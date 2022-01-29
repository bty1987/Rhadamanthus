$(function () {
    var customerSource = {
            
        saveDesignerBtn: com.focusPage("#saveDesignerBtn", "#customerSource"),
        updateAndApprovalBtn: com.focusPage("#updateAndApprovalBtn", "#customerSource"),
        approvalBtn: com.focusPage("#approvalBtn", "#customerSource"),
        firstApprovalBtn: com.focusPage("#firstApprovalBtn", "#customerSource"),
        belongerBtn: com.focusPage("#belongerBtn", "#customerSource"),

        modals: {
            bindAllInfoModal: com.focusPage("#bindAllInfo", "#customerSource"),
            sustomerSourceModal: com.focusPage("#sustomersource", "#customerSource"),
            commitApproveModal: com.focusPage("#commitApprove", "#customerSource"),
            codeModal: com.focusPage("#codeModal", "#customerSource"),
            commitFirstApprove: com.focusPage("#commitFirstApprove", "#customerSource"),
            customersourceforbelonger: com.focusPage("#customersourceforbelonger", "#customerSource")
        },
        
        items: {
            name: com.focusPage("#name", "#customerSource"),
            gender: com.focusPage("#gender", "#customerSource"),
            phone: com.focusPage("#phone", "#customerSource"),
            purpose: com.focusPage("#purpose", "#customerSource"),
            intention: com.focusPage("#intention", "#customerSource"),
            price: com.focusPage("#price", "#customerSource"),
            grade: com.focusPage("#grade", "#customerSource"),
            comment: com.focusPage("#comment", "#customerSource"),

            villageNo: com.focusPage("#villageNo", "#customerSource"),
            houseNumber: com.focusPage("#houseNumber", "#customerSource"),
            buildArea: com.focusPage("#buildArea", "#customerSource"),
            freeArea: com.focusPage("#freeArea", "#customerSource"),
            totalArea: com.focusPage("#totalArea", "#customerSource"),
            innerArea: com.focusPage("#innerArea", "#customerSource"),
            rule: com.focusPage("#rule", "#customerSource"),

            designer: com.focusPage("#designer", "#customerSource"),
            salesmanBind: com.focusPage("#salesmanBind", "#customerSource"),
            decorationBusitype: com.focusPage("#decorationBusitype", "#customerSource"),
            villageNoBind: com.focusPage("#villageNoBind", "#customerSource"),
            houseNumberBind: com.focusPage("#houseNumberBind", "#customerSource"),
            nameBind: com.focusPage("#nameBind", "#customerSource"),
            phoneBind: com.focusPage("#phoneBind", "#customerSource"),
            built: com.focusPage("#built", "#customerSource"),
            unit: com.focusPage("#unit", "#customerSource"),
            floor: com.focusPage("#floor", "#customerSource"),
            door: com.focusPage("#door", "#customerSource"),
            builtrule: com.focusPage("#builtrule", "#customerSource"),
            unitrule: com.focusPage("#unitrule", "#customerSource"),
            floorrule: com.focusPage("#floorrule", "#customerSource"),
            doorrule: com.focusPage("#doorrule", "#customerSource"),
            houseTypeOne: com.focusPage("#houseTypeOne", "#customerSource"),
            houseTypeTwo: com.focusPage("#houseTypeTwo", "#customerSource"),
            houseTypeThr: com.focusPage("#houseTypeThr", "#customerSource"),
            houseTypeFour: com.focusPage("#houseTypeFour", "#customerSource"),

            nameApprove: com.focusPage("#nameApprove", "#customerSource"),
            phoneApprove: com.focusPage("#phoneApprove", "#customerSource"),
            villageNoDesiger: com.focusPage("#villageNoDesiger", "#customerSource"),
            houseNumberApprove: com.focusPage("#houseNumberApprove", "#customerSource"),
            salesman: com.focusPage("#salesman", "#customerSource"),
            salesmanType: com.focusPage("#salesmanType", "#customerSource"),
            houseType: com.focusPage("#houseType", "#customerSource"),
            houseClass: com.focusPage("#houseClass", "#customerSource"),
            orderType: com.focusPage("#orderType", "#customerSource"),
            resourceType: com.focusPage("#resourceType", "#customerSource"),
            approveComment: com.focusPage("#approveComment", "#customerSource"),

            firstApproveComment: com.focusPage("#firstApproveComment", "#customerSource")
        },

        bindHouseDiv: com.focusPage("#bindHouseDiv", "#customerSource"),
        bindCustomerDiv: com.focusPage("#bindCustomerDiv", "#customerSource"),

        csid: null,
        
        status: {},

        grade: ["A", "B", "C", "D"],
        currentCustomerSource: {},
        decorationTypes: [],
        decorationBusitypeList: {}
    };

    customerSource.saveDesignerBtn.bindClick(bindAllInfo);
    customerSource.updateAndApprovalBtn.bindClick(customerUpdate);
    customerSource.approvalBtn.bindClick(customerApproval);
    customerSource.firstApprovalBtn.bindClick(firstApproval);
    customerSource.belongerBtn.bindClick(editBelonger);

    customerSource.items.gender.switchBtn("gender");
    customerSource.items.grade.bindData(customerSource.grade, "key", "value", false);

    com.post(api.data.queryDecorationBusitype, {}, function(res){
        var decorationBusitypes = [];

        $.each(res.decorationBusitypes, function(index, value){
            if (value.status == 0){
                decorationBusitypes.push(value);
            }
            customerSource.decorationBusitypeList[value.dbid] = value.name;
        });

        customerSource.items.salesmanType.bindData(decorationBusitypes, 'dbid', 'name');
        customerSource.items.decorationBusitype.bindData(decorationBusitypes, 'dbid', 'name');
    }, null, false);
    
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
        customerSource.items.orderType.bindData(res.typeness, 'key', 'value');
        customerSource.items.resourceType.bindData(res.status, 'key', 'value');

        $.each(res.typeness, function (i, v) {
            customerSource.decorationTypes[v.key] = v.type;
        });
    }, null, false);

    com.initTypeahead('designer', api.personel.queryUserByPinyin, "pinyinName", {"user.status": 0}, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('salesman', api.personel.queryUserByPinyin, "pinyinName", {"user.status": 0}, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('salesmanBind', api.personel.queryUserByPinyin, "pinyinName", {"user.status": 0}, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('belonger', api.personel.queryUserByPinyin, "pinyinName", {"user.status": 0}, 'autoFillKeyValue', 'key', 'value', null);
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

    customerSource.modals.commitFirstApprove.on("hide.bs.modal", function(){
        com.cleanItems(customerSource.items);
    });

    customerSource.modals.customersourceforbelonger.on("hide.bs.modal", function(){
        com.closeTip();
        com.cleanTypeahead("belonger");
    });

    customerSource.items.buildArea.on("change", function (e) {
        getTotalArea();
    });

    customerSource.items.freeArea.on("change", function (e) {
        getTotalArea();
    });

    //不同页面的不同参数
    customerSource.pageConfig = getConfig(params['urlLoadParams'].depage);

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
            var $firstApprove = $("<a></a>").addClass("btn btn-minier btn-blue").html("初审");
            var $backout = $("<a></a>").addClass("btn btn-minier btn-danger").html("撤销");
            var $confirm = $("<a></a>").addClass("btn btn-minier btn-inverse").html("确认");
            var $btnApproval = $("<a></a>").addClass("btn btn-minier btn-success").html("审批");
            var $belonger = $("<a></a>").addClass("btn btn-minier btn-yellow").html("编辑归属人");
            var $btnclaim = $("<a></a>").addClass("btn btn-minier btn-yellow").html("认领");

            var propertyArr = getPropertyArr(v);

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            if(v.status == 0){
                if(customerSource.pageConfig.pageBtn.contains("edit")) $divBtnWrap.append($btnView);
                if(customerSource.pageConfig.pageBtn.contains("bind")) $divBtnWrap.append($btnBind);
                if(customerSource.pageConfig.pageBtn.contains("firstApprove")) $divBtnWrap.append($firstApprove);
                if(customerSource.pageConfig.pageBtn.contains("free")) $divBtnWrap.append($release);
            }else  if(v.status == 2){
                if(customerSource.pageConfig.pageBtn.contains("code")) $divBtnWrap.append($btnCode);
                if(customerSource.pageConfig.pageBtn.contains("confirm")) $divBtnWrap.append($confirm);
            }else if([3, 6].contains(v.status)){
                if(customerSource.pageConfig.pageBtn.contains("approve")) $divBtnWrap.append($btnApproval);
            }

            if([2, 3, 6].contains(v.status)){
                if(customerSource.pageConfig.pageBtn.contains("backout")) $divBtnWrap.append($backout);
            }

            if(customerSource.pageConfig.pageBtn.contains("record")) $divBtnWrap.append($record);
            if(customerSource.pageConfig.pageBtn.contains("belonger")) $divBtnWrap.append($belonger);
            if(customerSource.pageConfig.pageBtn.contains("btnclaim")) $divBtnWrap.append($btnclaim);


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
                customerSource.items.totalArea.attr("readOnly", "readOnly");

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
                v.salesman != null ? com.updateTypeahead("salesmanBind", v.salesman.userId, v.salesman.currentName) : com.cleanTypeahead("salesmanBind");
                v.decorationBusitype != null ? customerSource.items.decorationBusitype.val(v.decorationBusitype.dbid) : "";
                com.updateTypeahead('villageNoBind', v.village.no, v.village.name + "-" + v.village.cityProper.name);
                customerSource.items.houseNumberBind.val(v.houseNumber);
                customerSource.items.nameBind.val(v.name);
                customerSource.items.phoneBind.val(v.phone);
                customerSource.modals.bindAllInfoModal.modal("show");
            });

            //提交客源初审审批
            $firstApprove.click(function(){
                initqueryApprovalUserForCheckbox("firstApproveMan", 17);
                customerSource.currentCustomerSource = v;
                customerSource.modals.commitFirstApprove.modal("show");
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

                v.salesman != null ? com.updateTypeahead("salesman", v.salesman.userId, v.salesman.currentName) : com.cleanTypeahead("salesman");
                v.decorationBusitype != null ? customerSource.items.salesmanType.val(v.decorationBusitype.dbid) : "";
                com.updateTypeahead('villageNoDesiger', v.village.no, v.village.name + "-" + v.village.cityProper.name);
                customerSource.items.houseNumberApprove.val(v.houseNumber);
                customerSource.items.nameApprove.val(v.name);
                customerSource.items.phoneApprove.val(v.phone);
                customerSource.modals.commitApproveModal.modal("show");
            });

            //编辑归属人
            $belonger.click(function () {
                customerSource.csid = v.csid;
                com.updateTypeahead("belonger", v.belonger.userId, com.checkNull(v.belonger.userName, ''));
                customerSource.modals.customersourceforbelonger.modal("show");
            });

            //认领
            $btnclaim.click(function () {
                btnclaim(v);
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

    searcher.init(customerSource.pageConfig.condArr, "condList", customerSource.pageConfig.apiPage, function (data) {
        displayFunc.init("resultList", data);
    }, "pagenation", customerSource.pageConfig.postDataName, {"user": params['urlLoadParams'].depage}, false, null, null);

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
        customerSource.items.freeArea.val(d.freeArea);
        customerSource.items.totalArea.val(d.totalArea);
        customerSource.items.innerArea.val(d.innerArea);

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
            "customerOrigin.buildArea": customerSource.items.buildArea.val(),
            "customerOrigin.freeArea" : customerSource.items.freeArea.val(),
            "customerOrigin.totalArea" : customerSource.items.totalArea.val(),
            "customerOrigin.innerArea" : customerSource.items.innerArea.val()
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
            "customerOrigin.salesman.userId": com.typeahead("salesmanBind"),
            "customerOrigin.decorationBusitype.dbid": customerSource.items.decorationBusitype.val(),
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
            "house.freeArea" : customerSource.currentCustomerSource.freeArea,
            "house.totalArea" : customerSource.currentCustomerSource.totalArea,
            "house.innerArea" : customerSource.currentCustomerSource.innerArea,
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
                "approval.comment": customerSource.items.approveComment.val(),
                "approvalCustomerOriginTDecoration.customerOrigin.csid" : customerSource.currentCustomerSource.csid,
                "approvalCustomerOriginTDecoration.type": customerSource.decorationTypes[customerSource.items.orderType.val()],
                "approvalCustomerOriginTDecoration.typeness": customerSource.items.orderType.val(),
                "approvalCustomerOriginTDecoration.salesman.userId": com.typeahead("salesman"),
                "approvalCustomerOriginTDecoration.decorationBusitype.dbid": customerSource.items.salesmanType.val(),
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

    //提交初审
    function firstApproval(){
        if (com.validate("commitFirstApprove")) {
            return false;
        }

        var firstApproveUserId = com.focusPage("#firstApproveMan").find('input:checked').attr('userid');
        if(firstApproveUserId == null || firstApproveUserId == ""){
            com.showAlert(com.error,"请选择审批人!");
            return false;
        }

        com.showConfirm("是否确认提交审批", function(){
            var option =  {
                "approval.receiver.userId": firstApproveUserId,
                "approval.comment": customerSource.items.firstApproveComment.val(),
                "approvalCustomerOrigin.csid" : customerSource.currentCustomerSource.csid
        };

            com.post(api.approval.submitApprovalForCustomerOrigin, option, function (res) {
                if(res.errorCode == 0){
                    com.showAlert(com.info, "操作成功");
                    com.clearValidator();
                    searcher.doSearch();
                    customerSource.modals.commitFirstApprove.modal("hide");
                }else{
                    com.showAlert(com.error, "提交失败");
                }
            });
        });
    }

    //编辑归属人
    function editBelonger(){
        if (com.validate("customersourceforbelonger")) return false;

        var option = {
            "customerOrigin.csid": customerSource.csid,
            "customerOrigin.belonger.userId": com.typeahead("belonger")
        };

        com.post(api.customer.updateCustomerOriginForBelonger, option, function () {
            searcher.doSearch();
            customerSource.modals.customersourceforbelonger.modal("hide");
            com.showAlert(com.info, '修改成功');
        });
    }

    //认领
    function btnclaim(v) {
        com.showConfirm("是否确定领取客源", function(){
            com.post(api.customer.takeCustomerOrigin, {"customerOrigin.csid": v.csid}, function (res) {
                searcher.doSearch();
                com.showAlert(com.info, '领取成功');
            });
        });
    }
    
    function getTotalArea(){
        var buildArea = parseFloat(customerSource.items.buildArea.val());
        var freeArea = parseFloat(customerSource.items.freeArea.val());
        customerSource.items.totalArea.val(utils.accAdd(buildArea, freeArea));
    }

    function getConfig(page) {

        var pageConfig = {
            "apiPage": null,
            "pageBtn": [],
            "postDataName": page + "PostData",
            "condArr": [],
            "extraParam": [],
            "propertyArr": []
        };

        function packageConfig(o, props, value, subtype){

            var prop = props.shift();
            if(props.length != 0){
                if(!o[prop]) o[prop] = {};
                packageConfig(o[prop], props, value, subtype);
                return;
            }

            if(subtype == 0){
                o[prop] = value;
            } else if(subtype == 1 && !o[prop]){
                o[prop] = [value];
            } else if(subtype == 1 && o[prop]){
                o[prop].push(value);
            }
        }

        function getApi(o, props){

            var prop = props.shift();

            if(props.length == 0){
                return o[prop];
            } else if(o[prop]){
                return getApi(o[prop], props);
            }
            return "";
        }

        com.post(api.right.queryCustomerOriginFunctionRight, {"customerOriginFunctionRight.name": page}, function (res) {

            var rights = res.customerOriginFunctionRights.sort(function(a, b){return a.customerOriginFunction.sort - b.customerOriginFunction.sort;});

            $.each(rights, function (i, v) {

                var data = v.customerOriginFunction;

                if(data.type == 1) data.value = getApi({"api": api}, data.value.split("."));

                packageConfig(pageConfig, data.key.split("."), data.value, data.subtype);
            });
        }, null, false);

        return pageConfig;
    }

    function getPropertyArr(v) {
        var propertyArr = [];
        $.each(customerSource.pageConfig.propertyArr, function (pi, pv) {
            switch (pv) {
                case "customerPhone":
                    propertyArr.push(["客户电话:", v.phone, "grey"]);
                    break;
                case "gender":
                    propertyArr.push(["性别:", v.gender, "grey"]);
                    break;
                case "purpose":
                    propertyArr.push(["目的: ", v.purpose, "grey"]);
                    break;
                case "intention":
                    propertyArr.push(["风格意向: ", v.intention, "grey"]);
                    break;
                case "price":
                    propertyArr.push(["预计装修价格: ", v.price, "blue"]);
                    break;
                case "grade":
                    propertyArr.push(["客户等级: ", v.grade, "grey"]);
                    break;
                case "creater":
                    propertyArr.push(["创建人: ", v.creater.currentName, "grey"]);
                    break;
                case "createTime":
                    propertyArr.push(["创建时间: ", v.createTime, "green"]);
                    break;
                case "belonger":
                    propertyArr.push(["归属人: ", v.belonger.currentName, "grey"]);
                    break;
                case "department":
                    propertyArr.push(["归属部门: ", v.department.name, "grey"]);
                    break;
                case "region":
                    propertyArr.push(["归属分区: ", v.region.name, "grey"]);
                    break;
                case "designer":
                    propertyArr.push(["归属设计师: ", com.checkNull(v.designer.currentName, '无'), "grey"]);
                    break;
                case "salesman":
                    propertyArr.push(["归属业务员: ", com.checkNull(v.salesman.currentName, '无'), "grey"]);
                    break;
                case "decorationBusitype":
                    propertyArr.push(["业务类型: ", com.checkNull(customerSource.decorationBusitypeList[v.decorationBusitype.dbid], '无'), "grey"]);
                    break;
                case "village":
                    propertyArr.push(["楼盘名: ",com.checkNull(v.village.name,'无'), "grey"]);
                    break;
                case "houseNumber":
                    propertyArr.push(["楼牌号: ", v.houseNumber, "blue"]);
                    break;
                case "buildArea":
                    propertyArr.push(["建筑面积: ", v.buildArea, "blue"]);
                    break;
                case "freeArea":
                    propertyArr.push(["赠送面积: ", v.freeArea, "blue"]);
                    break;
                case "totalArea":
                    propertyArr.push(["总面积: ", v.totalArea, "blue"]);
                    break;
                case "innerArea":
                    propertyArr.push(["计价面积: ", v.innerArea, "blue"]);
                    break;
                case "orderId":
                    propertyArr.push(["装修单号: ", com.checkNull(v.orderId, '无'), "blue"]);
                    break;
                case "status":
                    propertyArr.push(["状态: ", customerSource.status[v.status], "red"]);
                    break;
                case "comment":
                    propertyArr.push(["备注: ", com.checkNull(v.comment, '无'), "grey"]);
                    break;
            }
        });
        return propertyArr;
    }
});