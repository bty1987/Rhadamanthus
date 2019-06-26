
jQuery(function($) {
	
	var decorationBelong = {
		type:null,

		decorationOrderID:null,
		
		decorationBelongs:null,
		
		lastEditId:-1
	};
	
	com.focusPage('#fl-statement').statement("订单归属", "归属详细信息");
	
	decorationBelong.decorationOrderID = params.orderId;
	decorationBelong.type = params.orderBelongType;
	
    com.initTypeahead('belongUserId', api.personel.queryUserByPinyin, "pinyinName", {"user.status":0,"departmentType.name":""},'autoFillKeyValue','key','value',function(list, key, value){

    	if(value == null || value == ""){
            return;
        }
		
		com.post(api.personel.queryUserByUserId, {"user.userId":key}, function(res){

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
	
	com.focusPage('#detailBckBtn').on(ace.click_event, function(){
		com.switchPage(api.index.decorationBelongIndex.url);
	});
	
	com.focusPage('#saveBelongInfoBtn').on(ace.click_event, saveOrderBelongInfo);

    com.focusPage("#addNewUserBtn").on(ace.click_event, function(event){
        com.clearValidator();

        if(com.validate("addUserModal"))
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

        if(!/^(0\.\d{1,2})|1|0$/.test(addRow.rate)){
            com.showAlert(com.warning,"分配比例输入错误 , 为0到1之间的小数");
            return false;
        }

        var belongInfos = com.focusPage('.item-orange');

        for(var i=0;i<belongInfos.length;i++){
            var $v = $(belongInfos[i]);

            if($v.attr('belongUserId') == addRow.belonger.userId){
                com.showAlert(com.warning,"员工编号("+addRow.belonger.userId+")已存在不能重复添加");
                return false;
            }
        }

        com.focusPage('#resultList').append(displayFunc(addRow));

        changeItem();

        return false;
    });
	
	com.focusPage("#cApproveSaveBtn").on("click", function(){
		com.clearValidator();
		
		if(com.validate("approveModal")){
			return;
		}

		var receiverId = com.focusPage("#approveManSel").find('input:checked').attr('userid');

		if(receiverId == null || receiverId == ""){
			com.showAlert(com.error,"请选择审批人!");
			return;
		}

		var options = {};
		
		var num = 0;
		var rate = 0;
		var defaultCount = 0;
		
		$.each(com.focusPage('.item-orange'), function(i, v){
			
			var $v = $(v);
			
			var $belongRate = utils.changeTwoDecimal($v.attr('belongRate'));
			var $defaultFlag = $v.attr('defaultFlag');

			options["approvalDecorationBelongItems["+num+"].orderId"] = decorationBelong.decorationOrderID;
			options["approvalDecorationBelongItems["+num+"].userId"] = $v.attr("belongUserId");
			options["approvalDecorationBelongItems["+num+"].rate"] = $belongRate;
			options["approvalDecorationBelongItems["+num+"].defaultFlag"] = $defaultFlag;
			
			if($defaultFlag == 1){
				defaultCount++;
			}
			
			rate += parseFloat($belongRate);
			++num;
		});
		
		if(rate != 1){
            com.showAlert(com.warning, "分配比例的和必须是1");
			return;
		}
		
		if(defaultCount != 1){
            com.showAlert(com.warning, "必须有一个是默认归属用户");
			return;
		}
			
		options["approvalDecorationBelong.orderId"] = decorationBelong.decorationOrderID;
		options["approvalDecorationBelong.belongType"] = decorationBelong.type;
		
		options["approval.receiver.userId"] = receiverId;
		options["approval.comment"] = com.focusPage("#changeReason").val();
		
		com.post(api.approval.submitApprovalForDecorationBelong, options, function(res){
			com.showAlert(com.info, "操作成功");
			com.switchPage(api.index.decorationBelongIndex.url);
		});
		
		com.focusPage("#approveModal").modal("hide");
	});

    com.focusPage('#updateBtn').on('click', function(){
        com.clearValidator();

        if(com.validate("updateModal")){
            return;
        }


        var rate = com.focusPage('#updateBelongRate').val();
        var flag = com.focusPage("#updateDefaultFlag").prop("checked");

        if(!/^(0\.\d{1,2})|1|0$/.test(rate)){
            com.showAlert(com.warning,"分配比例输入错误 , 为0到1之间的小数");
            return false;
        }

        var $e = com.focusPage('#' + decorationBelong.belongUserId);

        $e.attr('belongrate', rate);
        $e.attr('defaultflag', flag ? 1 : 0);

        $e.find('li :eq(7)').text(rate);
        $e.find('li :eq(9)').text(com.isOrNotType[flag]);

        com.focusPage('#updateModal').modal('hide');
    });
	
	function  displayFunc(v){

		var $liLine = $('<li></li>').addClass('item-orange clearfix');
		var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.belonger.currentName));
		var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
		var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
		var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
		var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
		
		var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-warning').html('修改');
		var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');
		
		var propertyArr = [
			["员工编号:", v.belonger.userId, "grey"],
			["所属部门:", v.department.name, "grey"],
			["所属大区:", v.region.name, "grey"],
			["分配比例:", v.rate, "blue"],
			["默认:", v.defaultFlag == 1 ? '是' : '否', "red"]
		];
		
		$.each(propertyArr, function (index, value) {
			var $liProperty = $('<li></li>');
			$('<strong></strong>').html(value[0]).appendTo($liProperty);
			$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
			$liProperty.appendTo($ulProperty);
		});
		
		$btnUpdate.click(function(){
			dialogUpdate(v.belonger.userId);
		});
		
		$btnDel.click(function(){
			delRow(v.belonger.userId);
		});
		
		$divBtnWrap.append($btnUpdate).append($btnDel).appendTo($h4);
		
		$liLine.attr('id', v.belonger.userId).attr('belongUserId', v.belonger.userId).attr('belongRate', v.rate).attr('defaultFlag', v.defaultFlag);
		$liLine.append($h4).append($ulProperty).append($ulStyle).append($divBtnBlock);
		
		return $liLine;
	}

    function dialogUpdate(belongUserId){
        decorationBelong.belongUserId = belongUserId;

        var $info = com.focusPage('#' + belongUserId);

		if($info.attr('defaultflag') == 1){
            com.focusPage("#updateDefaultFlag").prop("checked", "checked");
		} else {
            com.focusPage("#updateDefaultFlag").removeAttr("checked");
		}

        com.focusPage('#updateBelongRate').val($info.attr('belongrate'));

		com.focusPage("#updateModal").attr('userId',belongUserId);

        com.focusPage('#updateModal').modal('show');
    }
	
	function delRow(id){
		com.focusPage('#' + id).remove();
	}
	
	function changeItem(){
		com.cleanTypeahead('belongUserId');
		com.focusPage('#belongRate').val(0);
	}

	function saveOrderBelongInfo(){
		com.focusPage("#changeReason").val("");

		approvalUtils.initqueryApprovalUser("approveManSel",3);
		
		com.focusPage("#approveModal").modal("show");
	}
	
	var url = decorationBelong.type == 0 ? api.decoration.queryDecorationBelongForDesignAChangeByOrderId : api.decoration.queryDecorationBelongForBusinessnAChangeByOrderId;
	
	com.post(url, {"decorationBelong.orderId":decorationBelong.decorationOrderID}, function(res){

		var $resultList = com.focusPage('#resultList').html('');
		var decorationBelongs = res.decorationBelongs;
		
		if(decorationBelongs && decorationBelongs.length > 0){
			$.each(decorationBelongs, function(i, v){
				$resultList.append(displayFunc(v));
			});
		}else{
	    	var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
	    	var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
	    	var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
		}
	});
	
});
