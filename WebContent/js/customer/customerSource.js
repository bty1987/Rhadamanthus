$(function () {
    var customerSource = {
        grade: ["A", "B", "C", "D"],
        items: {},
        currentCustomerSource: {}
    };

    customerSource.items.name = com.focusPage("#name");
    customerSource.items.gender = com.focusPage("#gender");
    customerSource.items.phone = com.focusPage("#phone");
    customerSource.items.purpose = com.focusPage("#purpose");
    customerSource.items.intention = com.focusPage("#intention");
    customerSource.items.price = com.focusPage("#price");
    customerSource.items.grade = com.focusPage("#grade");
    customerSource.items.comment = com.focusPage("#comment");

    customerSource.items.villageNo = com.focusPage("#villageNo");
    customerSource.items.houseNumber = com.focusPage("#houseNumber");
    customerSource.items.buildArea = com.focusPage("#buildArea");

    customerSource.items.built = com.focusPage("#built");
    customerSource.items.unit = com.focusPage("#unit");
    customerSource.items.floor = com.focusPage("#floor");
    customerSource.items.door = com.focusPage("#door");
    customerSource.items.builtrule = com.focusPage("#builtrule");
    customerSource.items.unitrule = com.focusPage("#unitrule");
    customerSource.items.floorrule = com.focusPage("#floorrule");
    customerSource.items.doorrule = com.focusPage("#doorrule");
    customerSource.items.ruleTwo = com.focusPage("#ruleTwo");

    customerSource.items.designer = com.focusPage("#designer");

    customerSource.items.rule = com.focusPage("#rule");

    customerSource.items.grade.bindData(customerSource.grade);
    customerSource.items.gender.switchBtn("gender");

    com.post(api.ds.building, {}, function (res) {
        customerSource.items.builtrule.bindData(res.buildrule, "key", "value");
        customerSource.items.unitrule.bindData(res.buildrule, "key", "value");
        customerSource.items.floorrule.bindData(res.buildrule, "key", "value");
        customerSource.items.doorrule.bindData(res.buildrule, "key", "value");
    }, null, false);

    com.initChosen('villageNo', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value");
    com.initChosen('designer', api.personel.queryUserByPinyin, "pinyinName", {"user.status": 0}, 'autoFillKeyValue', 'key', 'value');

    customerSource.items.villageNo.on('change', function () {
        com.post(api.data.queryVillageById, {"village.no": customerSource.items.villageNo.val()}, function (res) {
            customerSource.items.rule.html("推荐楼牌号规则：" + res.village.rule);
        }, null, false);
    });

    customerSource.updateAndApprovalBtn =  com.focusPage("#updateAndApprovalBtn").on("click", customerApproval);
    customerSource.saveDesignerBtn =  com.focusPage("#saveDesignerBtn").on("click", updateDesigner);

    com.focusPage("#sustomersource").on("hidden.bs.modal", function(){
        com.clearValidator("#villageNo", true);
        com.clearValidator("#houseNumber", true);
        com.clearValidator("#name", true);
        com.focusPage("#rule").html("");
        com.focusPage("#houseNumber").removeAttr("data-content");
        com.focusPage("#name").removeAttr("data-content");
        customerSource.checkUser = [];
        com.focusPage("#bindHouseDiv").removeAttr("style");
        com.focusPage("#bindCustomerDiv").removeAttr("style");
        com.focusPage("#houseNumberGroup").removeAttr("style");
        com.focusPage("#houseNumberGroupTwo").css("display", "none");
        aboutCustomerAndHouse();
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

            var $btnView = $("<a></a>").addClass("btn btn-minier btn-yellow").html("编辑");
            var $btnDesigner = $("<a></a>").addClass("btn btn-minier btn-success").html("编辑设计师");
            var $release = $("<a></a>").addClass("btn btn-minier btn-warning").html("释放");
            var $record = $("<a></a>").addClass("btn btn-minier btn-pink").html("记录");

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
                ["归属设计师: ", com.checkNull(v.designer.currentName,'无'), "grey"],
                ["楼盘名: ",com.checkNull(v.village.name,'无'), "grey"],
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

            if(v.status == 0){
                $divBtnWrap.append($btnView).append($btnDesigner).append($release);
            }

            $divBtnWrap.append($record);

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            //编辑
            $btnView.click(function () {
                customerSource.currentCustomerSource = v;
                com.focusPage("#houseNumberGroupTwo").css("display", "none");
                if(v.hid != 0){
                    aboutBindHouse();
                }

                if(v.cid != 0){
                    aboutBindCustomer();
                }
                com.focusPage("#sustomersourceDialog").html("编辑客源");

                editcustomerOrigin(v);
            });

            $record.click(function () {
                record(v.csid);
            });

            $release.click(function () {
                if(v.belonger.userId == null){
                    com.showAlert(com.warning, "无归属人信息!");
                    return;
                }
                release(v.csid);
            });

            //编辑设计师
            $btnDesigner.click(function () {
                customerSource.currentCustomerSource = v;
                if(v.designer != null && v.designer.uid != null){
                    com.updateChosen("designer", v.designer.userId, v.designer.currentName);
                }else{
                    com.updateChosen("designer", "", "");
                }
                com.clearValidator("#designer", true);
                com.focusPage("#updateDesigner").modal("show");
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
        com.cleanItems(customerSource.items);
        com.clearValidator();

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
            com.updateChosen('villageNo', d.village.no, d.village.name + "-" + d.village.cityProper.name);
        }else{
            com.updateChosen('villageNo', "", "");
        }
        com.focusPage("#sustomersource").modal("show");
    }

    //编辑
    function customerApproval(){
        if (com.validate("sustomersource")) {
            return;
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
            "customerOrigin.village.no": customerSource.items.villageNo.val(),
            "customerOrigin.houseNumber": customerSource.items.houseNumber.val(),
            "customerOrigin.buildArea": customerSource.items.buildArea.val()
        };

        com.post(api.customer.updateCustomerOrigin, options, function (res) {
            searcher.doSearch();
            com.showAlert(com.info, '修改成功');
            com.focusPage("#sustomersource").modal("hide");
        });
    }

    //编辑设计师
    function  updateDesigner(){
        if (com.validate("updateDesigner")) {
            return;
        }

        var options = {
            "customerOrigin.csid": customerSource.currentCustomerSource.csid,
            "customerOrigin.designer.userId": customerSource.items.designer.val()
        };

        com.post(api.customer.bindCustomerOrigin, options, function (res) {
            searcher.doSearch();
            com.showAlert(com.info, '修改成功');
            com.focusPage("#updateDesigner").modal("hide");
        });
    }

    function release(csid) {
        var btn = $(this);
        var span = btn.find('span');
        btn.find('i').remove();
        var loading = $('<i></i>').addClass('icon-spinner icon-spin white bigger-125');
        span.prepend(loading);
        var message = "<p>确定要释放该客源吗?</p>";
        bootbox.confirm(message, function (result) {
            if (result) {
                var options = {
                    "customerOrigin.csid": csid
                };
                com.post(api.customer.freeCustomerOrigin, options, function (res) {
                    searcher.doSearch();
                    com.showAlert(com.info, '释放成功');
                });
            } else {
                btn.find('i').remove();
                var prepared = $('<i></i>').addClass('icon-ok bigger-110');
                span.prepend(prepared);
            }
        });
    }

    function record(csid) {
        var $customerRecord = com.focusPage('#customerRecord');
        $customerRecord.attr({'data-csid': csid});
        layer.open({
            type: 1,
            title: '记录内容',
            content: $customerRecord,
            area: [( $(window).width() * 0.7 < 1000 ? $(window).width() * 0.7 : 1000 ) + "px", ( $(window).height() * 0.84 < 620 ? $(window).height() * 0.84 : 620 ) + "px"],
            maxmin: false,
            zIndex: 9000,
            btn: ['取消'],
            success: function (index, layero) {
                $customerRecord.load("views/customer/customerRecord.html");
            },
            end: function () {
                $customerRecord.attr('data-csid', null);
            }
        });
    }

    function aboutCustomerAndHouse(){
        com.focusPage("#villageNo").prop("disabled", false);
        com.focusPage("#villageNo").parent().find(".chosen-container").removeClass("chosen-disabled");
        com.focusPage("#houseNumber").removeAttr("readOnly");
        com.focusPage("#buildArea").removeAttr("readOnly");
        com.focusPage("#name").removeAttr("readOnly");
        com.focusPage("#gender").removeAttr("disabled");
        com.focusPage("#phone").removeAttr("readOnly");
    }

    function createHouseNumber(){
        var rulenum = [
            customerSource.items.built.val().trim().toUpperCase(), customerSource.items.builtrule.val(),
            customerSource.items.unit.val().trim().toUpperCase(), customerSource.items.unitrule .val(),
            customerSource.items.floor.val().trim().toUpperCase(), customerSource.items.floorrule.val(),
            customerSource.items.door.val().trim().toUpperCase(), customerSource.items.doorrule.val()
        ];

        return houseUtils.creatHouseNumber(rulenum);
    }

    //绑定房产
    com.focusPage("#bindHouse").click(function(){
        com.focusPage("#houseNumberGroupTwo").removeAttr("style");
        com.focusPage("#houseNumberGroup").css("display", "none");

        if(com.focusPage("#villageNo").val() == ""){
            com.showTips(com.focusPage("#villageNo"), "内容不能为空", true);
            return;
        }else{
            com.clearValidator("#villageNo", true);
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
            "house.village.no" : customerSource.items.villageNo.val(),
            "house.houseNumber" : houseNumber,
            "house.built" : customerSource.items.built.val(),
            "house.unit" : customerSource.items.unit.val(),
            "house.floor" : customerSource.items.floor.val(),
            "house.door" : customerSource.items.door.val(),
            "house.buildArea" : customerSource.items.buildArea.val()
        };

        com.post(api.data.existHouse, houseOption, function(res){
            customerSource.currentHid = res.house.hid;
            //更新客源中的hid
            com.post(api.customer.bindCustomerOrigin, {"customerOrigin.csid": customerSource.currentCustomerSource.csid, "customerOrigin.hid": customerSource.currentHid}, function(res){
                customerSource.currentCustomerSource.hid = customerSource.currentHid;
                customerSource.currentCustomerSource.houseNumber = houseNumber;

                aboutBindHouse();
                com.focusPage("#houseNumber").val(houseNumber);

                com.showAlert(com.info, "绑定成功!");
            }, null, false);
        })
    });

    //绑定客户
    com.focusPage("#bindCustomer").click(function(){
        var customerOption = {
            "customer.name" : customerSource.items.name.val(),
            "customer.phone" : customerSource.items.phone.val(),
            "customer.gender": com.genderType[customerSource.items.gender.prop("checked")],
            "customer.relationshipType" : "普通客户",
            "customer.qq" :  "",
            "customer.wechat" :  "",
            "customer.email" :  "",
            "customer.address" :  ""
        };

        com.post(api.data.existCustomer, customerOption, function(res){
            customerSource.currentCid = res.customer.cid;
            //更新客源中的cid
            com.post(api.customer.bindCustomerOrigin, {"customerOrigin.csid": customerSource.currentCustomerSource.csid, "customerOrigin.cid": customerSource.currentCid}, function(res){
                aboutBindCustomer();
                customerSource.currentCustomerSource.cid = customerSource.currentCid;
                com.showAlert(com.info, "绑定成功!");
            }, null, false);
        })
    });

    function aboutBindHouse(){
        com.focusPage("#villageNo").prop("disabled", true);
        com.focusPage("#villageNo").parent().find(".chosen-container").addClass("chosen-disabled");
        com.focusPage("#houseNumber").attr("readOnly", "readOnly");
        com.focusPage("#buildArea").attr("readOnly", "readOnly");
        com.focusPage("#bindHouseDiv").css("display", "none");
        com.focusPage("#houseNumberGroupTwo").css("display", "none");
        com.focusPage("#houseNumberGroup").removeAttr("style");
    }

    function aboutBindCustomer(){
        com.focusPage("#name").attr("readOnly", "readOnly");
        com.focusPage("#gender").attr("disabled", "disabled");
        com.focusPage("#phone").attr("readOnly", "readOnly");
        com.focusPage("#bindCustomerDiv").css("display", "none");
    }
});