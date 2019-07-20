$(function () {
    var customerSourceDesigner = {
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
            salesmanType: com.focusPage("#salesmanType"),
            orderType: com.focusPage("#orderType"),
            resourceType: com.focusPage("#resourceType"),
            approveComment: com.focusPage("#approveComment"),

            rule: com.focusPage("#rule")
        },

        houseNumberGroup: com.focusPage("#houseNumberGroup"),
        currentCustomerSource: {},
        typeArray: {},
        currentVillageName: null
    };

    customerSourceDesigner.updateAndApprovalBtn.bindClick(customerApproval);

    customerSourceDesigner.modals.sustomersourceDesignerModal.on("hide.bs.modal", function(){
        com.closeTip();
        com.cleanItems(customerSourceDesigner.items);

        customerSourceDesigner.items.rule.html("");
        customerSourceDesigner.items.houseNumber.removeAttr("data-content");
        customerSourceDesigner.items.name.removeAttr("data-content");

        customerSourceDesigner.items.villageNoDesiger.prop("disabled", false);
        customerSourceDesigner.items.houseNumber.removeAttr("readOnly");
        customerSourceDesigner.items.name.removeAttr("readOnly");
        customerSourceDesigner.items.phone.removeAttr("readOnly");
    });

    com.post(api.ds.decoration, {}, function (res) {
        customerSourceDesigner.items.salesmanType.bindData(res.salesmanType, 'key', 'value');
        customerSourceDesigner.items.orderType.bindData(res.type, 'key', 'value');
        customerSourceDesigner.items.resourceType.bindData(res.status, 'key', 'value');
    }, null, false);

    com.initTypeahead('villageNoDesiger', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value", null);

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
                ["意向: ", v.intention, "grey"],
                ["需求价格: ", v.price, "blue"],
                ["客户等级: ", v.grade, "grey"],
                ["创建人: ", v.creater.currentName, "grey"],
                ["创建时间: ", v.createTime, "green"],
                ["归属人: ", v.belonger.currentName, "grey"],
                ["归属部门: ", v.department.name, "grey"],
                ["归属分区: ", v.region.name, "grey"],
                ["归属设计师: ", com.checkNull(v.designer.currentName, '无'), "grey"],
                ["归属业务员: ", com.checkNull(v.salesman.currentName,'无'), "grey"],
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

            //审批拒绝的情况下 , status是5 , 失效的客源不能再编辑转装修单要重新录入
            if([2, 5].contains(v.status)){
                $divBtnWrap.append($btnApproval)
            }

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            //转装修单提交审批
            $btnApproval.click(function () {
                initqueryApprovalUserForCheckbox("approveMan", 14);
                customerSourceDesigner.currentCustomerSource = v;
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

    customerSourceDesigner.items.villageNoDesiger.on('change', function () {
        com.post(api.data.queryVillageById, {"village.no": customerSourceDesigner.items.villageNoDesiger.val()}, function (res) {
            customerSourceDesigner.items.rule.html("推荐楼牌号规则: " + res.village.rule);
        }, null, false);
    });

    function editcustomerOrigin(d) {
        com.cleanItems(customerSourceDesigner.items);
        com.clearValidator();

        customerSourceDesigner.items.villageNoDesiger.prop("disabled", true);
        customerSourceDesigner.items.houseNumber.attr("disabled", "disabled");
        customerSourceDesigner.items.name.attr("disabled", "disabled");
        customerSourceDesigner.items.phone.attr("disabled", "disabled");

        customerSourceDesigner.items.name.val(d.name);
        customerSourceDesigner.items.phone.val(d.phone);
        customerSourceDesigner.items.houseNumber.val(d.houseNumber);

        if(d.village != null && d.village.name != null){
            com.updateTypeahead('villageNoDesiger', d.village.no, d.village.name + "-" + d.village.cityProper.name);
            customerSourceDesigner.currentVillageName = d.village.name;
        }else{
            com.cleanTypeahead('villageNoDesiger');
        }
        customerSourceDesigner.modals.sustomersourceDesignerModal.modal("show");
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
            if (params.userInfo.user.uid == customerSourceDesigner.currentCustomerSource.designer.uid) {
                com.post(api.approval.submitApprovalForCustomerOriginTDecoration, {
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
                        customerSourceDesigner.modals.sustomersourceDesignerModal.modal("hide");
                    }else{
                        com.showAlert(com.error, "提交失败");
                    }
                });
            } else {
                com.showAlert(com.warning, "设计师不匹配, 不能提交审批!");
            }
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