jQuery(function($) {

    var decorationBelong = {
        type: null,

        orderId: null,

        decorationBelongs: null,

        items: {
            changeReason: com.focusPage("#changeReason"),
            updateBelongRate: com.focusPage("#updateBelongRate")
        },
        modals: {
            approveModal: com.focusPage("#approveModal"),
            updateModal: com.focusPage("#updateModal")
        },

        lastEditId: -1,

        original: "",
    };

    com.focusPage('#fl-statement').statement("订单归属", "归属详细信息");

    decorationBelong.modals.approveModal.on('hide.bs.modal', function(e) {

        com.cleanItems(decorationBelong.items);
        com.closeTip();
    });

    decorationBelong.modals.updateModal.on('hide.bs.modal', function(e) {

        com.cleanItems(decorationBelong.items);
        com.closeTip();
    });

    decorationBelong.orderId = params.decoration.orderId;
    decorationBelong.type = params.decoration.orderBelongType;

    com.initTypeahead('belongUserId', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, 'autoFillKeyValue', 'key', 'value', function(list, key, value) {

        if (value == null || value == "") {
            return false;
        }

        com.post(api.personel.queryUserByUserId, {
            "user.userId": key
        }, function(res) {

            com.focusPage("#belongUser").val(res.user.currentName);
            com.focusPage("#belongDept").val(res.user.dept.name);
            com.focusPage("#belongRegion").val(res.user.dept.fatherDept.name);
            com.focusPage("#belongDeptId").val(res.user.dept.no);
            com.focusPage("#belongRegionId").val(res.user.dept.fatherDept.no);
        });

        return value;
    });

    com.focusPage("#defaultFlag").switchBtn("isOrNot");
    com.focusPage("#updateDefaultFlag").switchBtn("isOrNot");

    com.focusPage('#detailBckBtn').on("click", function() {

        com.switchPage(api.index.decorationBelongIndex.url);
    });

    com.focusPage('#saveBelongInfoBtn').on("click", saveOrderBelongInfo);

    com.focusPage("#addNewUserBtn").on("click", function(event) {

        if (com.validate("addUserModal"))
            return false;

        var addRow = {};

        addRow.belonger = {};
        addRow.department = {};
        addRow.region = {};
        addRow.belonger.userId = com.typeahead("belongUserId");
        addRow.belonger.currentName = com.focusPage("#belongUser").val();
        addRow.department.name = com.focusPage("#belongDept").val();
        addRow.region.name = com.focusPage("#belongRegion").val();
        addRow.rate = com.focusPage("#belongRate").val();
        addRow.department.deptId = com.focusPage("#belongDeptId").val();
        addRow.region.deptId = com.focusPage("#belongRegionId").val();
        addRow.defaultFlag = com.focusPage("#defaultFlag").prop("checked") ? 1 : 0;

        if (addRow.rate < 0 || addRow.rate > 1) {
            com.showTip(com.focusPage("#belongRate"), "分配比例输入错误 , 为0到1之间的小数", "right");
            return false;
        }

        var belongInfos = com.focusPage('.item-orange');

        for ( var i = 0; i < belongInfos.length; i++) {
            var $v = $(belongInfos[i]);

            if ($v.attr('belongUserId') == addRow.belonger.userId) {
                com.showAlert(com.warning, "员工编号(" + addRow.belonger.userId + ")已存在不能重复添加");
                return false;
            }
        }

        com.focusPage('#belongResultList').append(displayFunc(addRow));

        changeItem();

        return false;
    });

    com.focusPage("#cApproveSaveBtn").on("click", function() {

        if (com.validate("approveModal")) {
            return false;
        }

        var receiverId = com.focusPage("#approveManSel").find('input:checked').attr('userid');

        if (receiverId == null || receiverId == "") {
            com.showAlert(com.error, "请选择审批人!");
            return false;
        }

        var options = {};

        var num = 0;
        var rate = 0;
        var defaultCount = 0;

        var current = "";

        $.each(com.focusPage('.item-orange'), function(i, v) {

            var $v = $(v);

            var info = $v.data();

            var $belongRate = utils.changeTwoDecimal($v.attr('belongRate'));
            var $defaultFlag = $v.attr('defaultFlag');

            options["approvalDecorationBelongItems[" + num + "].orderId"] = decorationBelong.orderId;
            options["approvalDecorationBelongItems[" + num + "].userId"] = $v.attr("belongUserId");
            options["approvalDecorationBelongItems[" + num + "].rate"] = $belongRate;
            options["approvalDecorationBelongItems[" + num + "].defaultFlag"] = $defaultFlag;

            current += "编号:" + info.belonger.userId + ", 姓名: " + info.belonger.currentName + ", 部门: " + info.department.name + ", 分区:" + info.region.name + ", 比例:" + $belongRate + "\n"

            if ($defaultFlag == 1) {
                defaultCount++;
            }

            rate += parseFloat($belongRate);
            ++num;
        });

        if (rate != 1) {
            com.showAlert(com.warning, "分配比例的和必须是1");
            return false;
        }

        if (defaultCount != 1) {
            com.showAlert(com.warning, "必须有一个是默认归属用户");
            return false;
        }

        var comment = decorationBelong.items.changeReason.val();

        options["approvalDecorationBelong.orderId"] = decorationBelong.orderId;
        options["approvalDecorationBelong.belongType"] = decorationBelong.type;

        options["approval.receiver.userId"] = receiverId;
        options["approval.comment"] = comment;

        var decoration = null;

        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": decorationBelong.orderId
        }, function(res) {

            decoration = res.decoration;
        }, null, false);

        if (!decoration) {
            com.showAlert(com.error, "装修单不存在");
            return false;
        }

        var args = [{
            "name": "装修单",
            "value": decoration.orderId
        }, {
            "name": "原归属",
            "value": decorationBelong.original
        }, {
            "name": "现归属",
            "value": current
        }, {
            "name": "备注",
            "value": comment
        }, ]

        options["code"] = "PROC-AA84B687-1572-4203-85D9-5ADE611042A0";
        options["forms"] = JSON.stringify(args);

        com.post(api.approval.submitApprovalForDecorationBelong, options, function(res) {

            com.showAlert(com.info, "操作成功");
            com.closePopover();
        });

        com.focusPage("#approveModal").modal("hide");
    });

    com.focusPage('#updateBtn').on('click', function() {

        if (com.validate("updateModal")) {
            return false;
        }

        var rate = com.focusPage('#updateBelongRate').val();
        var flag = com.focusPage("#updateDefaultFlag").prop("checked");

        if (rate < 0 || rate > 1) {
            com.showTip(com.focusPage('#updateBelongRate'), "分配比例输入错误 , 为0到1之间的小数", "right");
            return false;
        }

        var $e = com.focusPage('#' + decorationBelong.belongUserId);

        $e.attr('belongrate', rate);
        $e.attr('defaultflag', flag ? 1 : 0);

        $e.find('li :eq(7)').text(rate);
        $e.find('li :eq(9)').text(com.isOrNotType[flag]);

        com.focusPage('#updateModal').modal('hide');
    });

    function displayFunc(v) {

        var $liLine = $('<li></li>').addClass('item-orange clearfix');
        var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.belonger.currentName));
        var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
        var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
        var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
        var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

        var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-warning').html('修改');
        var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

        $liLine.data(v);

        var propertyArr = [["员工编号:", v.belonger.userId, "grey"], ["所属部门:", v.department.name, "grey"], ["所属大区:", v.region.name, "grey"], ["分配比例:", v.rate, "blue"], ["默认:", v.defaultFlag == 1 ? '是' : '否', "red"]];

        $.each(propertyArr, function(index, value) {

            var $liProperty = $('<li></li>');
            $('<strong></strong>').html(value[0]).appendTo($liProperty);
            $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
            $liProperty.appendTo($ulProperty);
        });

        $btnUpdate.click(function() {

            dialogUpdate(v.belonger.userId);
        });

        $btnDel.click(function() {

            delRow(v.belonger.userId);
        });

        $divBtnWrap.append($btnUpdate).append($btnDel).appendTo($h4);

        $liLine.attr('id', v.belonger.userId).attr('belongUserId', v.belonger.userId).attr('belongRate', v.rate).attr('defaultFlag', v.defaultFlag);
        $liLine.append($h4).append($ulProperty).append($ulStyle).append($divBtnBlock);

        return $liLine;
    }

    function dialogUpdate(belongUserId) {

        decorationBelong.belongUserId = belongUserId;

        var $info = com.focusPage('#' + belongUserId);

        if ($info.attr('defaultflag') == 1) {
            com.focusPage("#updateDefaultFlag").prop("checked", "checked");
        } else {
            com.focusPage("#updateDefaultFlag").removeAttr("checked");
        }

        com.focusPage('#updateBelongRate').val($info.attr('belongrate'));

        com.focusPage("#updateModal").attr('userId', belongUserId);

        com.focusPage('#updateModal').modal('show');
    }

    function delRow(id) {

        com.focusPage('#' + id).remove();
    }

    function changeItem() {

        com.cleanTypeahead('belongUserId');
        com.focusPage('#belongRate').val(0);
    }

    function saveOrderBelongInfo() {

        com.cleanItems(decorationBelong.items);

        approvalUtils.initqueryApprovalUser("approveManSel", 3);

        com.focusPage("#approveModal").modal("show");
    }

    var url = decorationBelong.type == 0 ? api.decoration.queryDecorationBelongForDesignAChangeByOrderId : api.decoration.queryDecorationBelongForBusinessnAChangeByOrderId;

    com.post(url, {
        "decorationBelong.orderId": decorationBelong.orderId
    }, function(res) {

        var $resultList = com.focusPage('#belongResultList').html('');
        var decorationBelongs = res.decorationBelongs;

        if (decorationBelongs && decorationBelongs.length > 0) {
            $.each(decorationBelongs, function(i, v) {

                decorationBelong.original += "编号:" + v.belonger.userId + ", 姓名: " + v.belonger.currentName + ", 部门: " + v.department.name + ", 分区:" + v.region.name + ", 比例:" + v.rate + "\n"

                $resultList.append(displayFunc(v));
            });
        } else {
            var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
            var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
            var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
        }
    });

});
