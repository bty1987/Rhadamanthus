$(function () {
    var customerSource = {
        saveDesignerBtn: com.focusPage("#saveDesignerBtn"),
        updateAndApprovalBtn: com.focusPage("#updateAndApprovalBtn"),

        modals: {
            updateDesignerModal: com.focusPage("#updateDesigner"),
            sustomerSourceModal: com.focusPage("#sustomersource")
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

            built: com.focusPage("#built"),
            unit: com.focusPage("#unit"),
            floor: com.focusPage("#floor"),
            door: com.focusPage("#door"),
            builtrule: com.focusPage("#builtrule"),
            unitrule: com.focusPage("#unitrule"),
            floorrule: com.focusPage("#floorrule"),
            doorrule: com.focusPage("#doorrule"),
            ruleTwo: com.focusPage("#ruleTwo"),

            designer: com.focusPage("#designer"),

            rule: com.focusPage("#rule")
        },

        bindHouseDiv: com.focusPage("#bindHouseDiv"),
        bindCustomerDiv: com.focusPage("#bindCustomerDiv"),
        houseNumberGroup: com.focusPage("#houseNumberGroup"),
        houseNumberGroupTwo: com.focusPage("#houseNumberGroupTwo"),

        csid: null,

        grade: ["A", "B", "C", "D"],
        checkUser: [],
        currentCustomerSource: {

        }
    };

    customerSource.saveDesignerBtn.bindClick(updateDesigner);
    customerSource.updateAndApprovalBtn.bindClick(customerApproval);
    customerSource.items.gender.switchBtn("gender");

    customerSource.modals.sustomerSourceModal.on("hide.bs.modal", function(){
        com.clearValidator("#villageNo", true);
        com.clearValidator("#houseNumber", true);
        com.clearValidator("#name", true);
        customerSource.items.rule.html("");
        customerSource.items.houseNumber.removeAttr("data-content");
        customerSource.items.name.removeAttr("data-content");
        customerSource.bindHouseDiv.removeAttr("style");
        customerSource.bindCustomerDiv.removeAttr("style");
        customerSource.houseNumberGroup.removeAttr("style");
        customerSource.houseNumberGroupTwo.css("display", "none");

        customerSource.items.villageNo.prop("disabled", false);
        customerSource.items.houseNumber.removeAttr("readOnly");
        customerSource.items.buildArea.removeAttr("readOnly");
        customerSource.items.name.removeAttr("readOnly");
        customerSource.items.gender.removeAttr("disabled");
        customerSource.items.phone.removeAttr("readOnly");
    });

    customerSource.modals.updateDesignerModal.on("hide.bs.modal", function(){
        com.clearValidator();
        com.cleanTypeahead("designer");
        com.cleanTypeahead("villageNo");
        com.cleanItems(customerSource.items);
    });


    com.post(api.ds.building, {}, function (res) {
        customerSource.items.builtrule.bindData(res.buildrule, "key", "value");
        customerSource.items.unitrule.bindData(res.buildrule, "key", "value");
        customerSource.items.floorrule.bindData(res.buildrule, "key", "value");
        customerSource.items.doorrule.bindData(res.buildrule, "key", "value");
    }, null, false);

    customerSource.items.grade.bindData(customerSource.grade, "key", "value", false);

    com.initTypeahead('designer', api.personel.queryUserByPinyin, "pinyinName", {"user.status": 0}, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('villageNo', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value", function(list, k, v){
        com.post(api.data.queryVillageById, {"village.no": k}, function (res) {
            customerSource.items.rule.html("推荐楼牌号规则: " + (res.village.rule == null || res.village.rule == "" ? "暂无推荐规则" : res.village.rule));
        }, null, false);
        return v;
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
                customerSource.houseNumberGroupTwo.css("display", "none");
                if(v.hid != 0){
                    customerSource.items.villageNo.prop("disabled", true);
                    customerSource.items.houseNumber.attr("readOnly", "readOnly");
                    customerSource.items.buildArea.attr("readOnly", "readOnly");
                    customerSource.bindHouseDiv.css("display", "none");
                    customerSource.houseNumberGroupTwo.css("display", "none");
                    customerSource.houseNumberGroup.removeAttr("style");
                }

                if(v.cid != 0){
                    customerSource.items.name.attr("readOnly", "readOnly");
                    customerSource.items.gender.attr("disabled", "disabled");
                    customerSource.items.phone.attr("readOnly", "readOnly");
                    customerSource.bindCustomerDiv.css("display", "none");
                }
                com.focusPage("#sustomersourceDialog").html("编辑客源");

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

            //编辑设计师
            $btnDesigner.click(function () {
                customerSource.currentCustomerSource = v;
                if(v.designer != null && v.designer.uid != null){
                    com.updateTypeahead("designer", v.designer.userId, v.designer.currentName);
                }else{
                    com.cleanTypeahead("designer");
                }
                com.clearValidator("#designer", true);
                customerSource.modals.updateDesignerModal.modal("show");
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
    function customerApproval(){
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

    //编辑设计师
    function  updateDesigner(){
        if (com.validate("updateDesigner")) {
            return false;
        }

        var options = {
            "customerOrigin.csid": customerSource.currentCustomerSource.csid,
            "customerOrigin.designer.userId": com.typeahead("designer")
        };

        com.post(api.customer.bindCustomerOrigin, options, function (res) {
            searcher.doSearch();
            com.showAlert(com.info, '修改成功');
            customerSource.modals.updateDesignerModal.modal("hide");
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

    com.focusPage("#bindHouse").click(function(){
        customerSource.houseNumberGroupTwo.removeAttr("style");
        customerSource.houseNumberGroup.css("display", "none");

        if(com.validate("houseNumberGroupTwo")){
            return false;
        }

        var rulenum = [
            customerSource.items.built.val().trim().toUpperCase(), customerSource.items.builtrule.val(),
            customerSource.items.unit.val().trim().toUpperCase(), customerSource.items.unitrule .val(),
            customerSource.items.floor.val().trim().toUpperCase(), customerSource.items.floorrule.val(),
            customerSource.items.door.val().trim().toUpperCase(), customerSource.items.doorrule.val()
        ];

        var houseNumber = houseUtils.creatHouseNumber(rulenum);

        var houseOption = {
            "house.village.no" : com.typeahead("villageNo"),
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

                customerSource.items.villageNo.prop("disabled", true);
                customerSource.items.houseNumber.attr("readOnly", "readOnly");
                customerSource.items.buildArea.attr("readOnly", "readOnly");
                customerSource.bindHouseDiv.css("display", "none");
                customerSource.houseNumberGroupTwo.css("display", "none");
                customerSource.houseNumberGroup.removeAttr("style");

                customerSource.items.houseNumber.val(houseNumber);

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

                customerSource.items.name.attr("readOnly", "readOnly");
                customerSource.items.gender.attr("disabled", "disabled");
                customerSource.items.phone.attr("readOnly", "readOnly");
                customerSource.bindCustomerDiv.css("display", "none");

                customerSource.currentCustomerSource.cid = customerSource.currentCid;
                com.showAlert(com.info, "绑定成功!");
            }, null, false);
        })
    });

});