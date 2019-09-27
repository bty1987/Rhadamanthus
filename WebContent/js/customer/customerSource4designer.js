$(function () {
    var customerSource = {
            
        updateAndApprovalBtn: com.focusPage("#updateAndApprovalBtn"),
        
        modals:{
            sustomersourceDesignerModal: com.focusPage("#sustomersourceDesigner")
        },
        
        items: {
            name: com.focusPage("#name"),
            phone: com.focusPage("#phone"),
            villageNoDesiger: com.focusPage("#villageNoDesiger"),
            houseNumber: com.focusPage("#houseNumber"),
            houseType: com.focusPage("#houseType"),
            houseClass: com.focusPage("#houseClass"),
            salesman: com.focusPage("#salesman"),
            salesmanType: com.focusPage("#salesmanType"),
            orderType: com.focusPage("#orderType"),
            resourceType: com.focusPage("#resourceType"),
            approveComment: com.focusPage("#approveComment"),

            rule: com.focusPage("#rule")
        },

        houseNumberGroup: com.focusPage("#houseNumberGroup"),
        currentCustomerSource: {},
        typeArray: {},
        currentVillageName: null,
        
        status: {}
    };

    customerSource.updateAndApprovalBtn.bindClick(customerApproval);

    customerSource.modals.sustomersourceDesignerModal.on("hide.bs.modal", function(){
        com.closeTip();
        com.cleanItems(customerSource.items);

        customerSource.items.rule.html("");
        customerSource.items.houseNumber.removeAttr("data-content");
        customerSource.items.name.removeAttr("data-content");

        customerSource.items.villageNoDesiger.prop("disabled", false);
        customerSource.items.houseNumber.removeAttr("readOnly");
        customerSource.items.name.removeAttr("readOnly");
        customerSource.items.phone.removeAttr("readOnly");
    });

    com.post(api.ds.decoration, {}, function (res) {
        customerSource.items.houseClass.bindData(res.houseClass, 'key', 'value');
        customerSource.items.salesmanType.bindData(res.salesmanType, 'key', 'value');
        customerSource.items.orderType.bindData(res.type, 'key', 'value');
        customerSource.items.resourceType.bindData(res.status, 'key', 'value');
    }, null, false);

    com.initTypeahead('villageNoDesiger', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value", null);
    com.initTypeahead('salesman', api.personel.queryUserByPinyin, "pinyinName", {"user.status": 0}, 'autoFillKeyValue', 'key', 'value', null);
    
    com.post(api.ds.customer, {}, function (res) {
        customerSource.status = res.customerSourceStatus.split('key', 'value');
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
                ["归属设计师: ", com.checkNull(v.designer.currentName, '无'), "grey"],
                ["楼盘名: ", com.checkNull(v.village.name, '无'), "grey"],
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

            //审批拒绝的情况下 , status是5 , 失效的客源不能再编辑转装修单要重新录入
            if([2, 5].contains(v.status)){
                $divBtnWrap.append($btnApproval)
            }

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            //转装修单提交审批
            $btnApproval.click(function () {
                initqueryApprovalUserForCheckbox("approveMan", 14);
                customerSource.currentCustomerSource = v;
                com.focusPage("#sustomersourceDesignerDialog").html("提交审批");

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

    customerSource.items.villageNoDesiger.on('change', function () {
        com.post(api.data.queryVillageById, {"village.no": customerSource.items.villageNoDesiger.val()}, function (res) {
            customerSource.items.rule.html("推荐楼牌号规则: " + res.village.rule);
        }, null, false);
    });

    function editcustomerOrigin(d) {
        com.cleanItems(customerSource.items);
        com.clearValidator();

        customerSource.items.villageNoDesiger.prop("disabled", true);
        customerSource.items.houseNumber.attr("disabled", "disabled");
        customerSource.items.name.attr("disabled", "disabled");
        customerSource.items.phone.attr("disabled", "disabled");

        customerSource.items.name.val(d.name);
        customerSource.items.phone.val(d.phone);
        customerSource.items.houseNumber.val(d.houseNumber);

        if(d.village != null && d.village.name != null){
            com.updateTypeahead('villageNoDesiger', d.village.no, d.village.name + "-" + d.village.cityProper.name);
            customerSource.currentVillageName = d.village.name;
        }else{
            com.cleanTypeahead('villageNoDesiger');
        }
        customerSource.modals.sustomersourceDesignerModal.modal("show");
    }

    //提交审批
    function customerApproval(){
        if (com.validate("sustomersourceDesigner")) {
            return false;
        }

        //审批创建装修单
        var receiverId = com.focusPage("#approveMan").find('input:checked').attr('userid');
        if(receiverId == null || receiverId == ""){
            com.showAlert(com.error,"请选择审批人!");
            return false;
        }

        com.showConfirm("是否确认提交审批", function(){
            var option = {
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
                    customerSource.modals.sustomersourceDesignerModal.modal("hide");
                }else{
                    com.showAlert(com.error, "提交失败");
                }
            });
        });
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
});