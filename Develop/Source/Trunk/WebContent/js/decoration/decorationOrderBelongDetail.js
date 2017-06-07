
jQuery(function($) {
	
	var decorationBelong = {
		belongType:null,
		decorationOrderId:null,
		belongStatus:null,
		
		decorationBelongs:null,
		
		lastEditId:-1,
	};
	
	$('#fl-statement').statement("订单归属", "归属详细信息");
	
	decorationBelong.decorationOrderId = params.orderId;
	decorationBelong.belongStatus = params.orderBelongStatus;
	decorationBelong.belongType = params.orderBelongType;
	
	com.initChosen('approveManSel', api.system.queryApproveUserForNameByType, "user.userNamePinYin", {"approveUser.type": 3}, "autoFillKeyValue", "key", "value");
	com.initChosen('belongUserId', api.personel.queryUserForNameByDuty, "pinyinName", {"duty" : decorationBelong.belongType == "设计" ? "设计师" : ""}, "autoFillKeyValue", "key", "value").on("change",function(e){
		if($("#belongUserId").val() == null || $("#belongUserId").val() == ""){
			return;
		}
		
		com.post(api.personel.queryUserByUserId, {"user.userId":$("#belongUserId").val()}, function(res){
			$("#belongUser").val(res.user.userName);
			$("#belongDept").val(res.user.dept.deptName);
			$("#belongRegion").val(res.user.dept.fatherDept.deptName);
			$("#belongDeptId").val(res.user.dept.deptId);
			$("#belongRegionId").val(res.user.dept.fatherDept.deptId);
		});
	});
	
	$("#defaultFlag").switchBtn("isOrNot");
	$("#updateDefaultFlag").switchBtn("isOrNot");
	
	$('#detailBckBtn').on(ace.click_event, function(){
		com.switchPage(api.index.decorationOrderBelongIndex.url);
	});
	
	$('#saveBelongInfoBtn').on(ace.click_event, saveOrderBelongInfo);
		
	$("#addNewUserBtn").on(ace.click_event, function(event){
		com.clearValidator();
		
		if(com.validate("addUserModal"))
			return false;
		
		var addRow = {};

		addRow.belongUserId = $("#belongUserId").val();
		addRow.belongUser= $("#belongUser").val();
		addRow.belongDept= $("#belongDept").val();
		addRow.belongRegion = $("#belongRegion").val();
		addRow.belongRate= $("#belongRate").val();
		addRow.belongDeptId= $("#belongDeptId").val();
		addRow.belongRegionId= $("#belongRegionId").val();
		addRow.defaultFlag = com.isOrNotType[$("#defaultFlag").prop("checked")];
		
		if(!/^(0\.\d{1,2})|1|0$/.test(addRow.belongRate)){
			bootbox.alert("分配比例输入错误 , 为0到1之间的小数");
			return false;
		}
		
		var belongInfos = $('.item-orange');
		
		for(var i=0;i<belongInfos.length;i++){
			var $v = $(belongInfos[i]);
			
			if($v.attr('belongUserId') == addRow.belongUserId){
				bootbox.alert("该员工编号("+addRow.belongUserId+")已存在不能重复添加");
				return false;
			}
		}
		
		$('#resultList').append(displayFunc(addRow));
		
		changeItem();
		
		return false;
	});
	
	$("#cApproveSaveBtn").on("click", function(){
		com.clearValidator();
		
		if(com.validate("approveModal")){
			return;
		}
		
		var options = {};
		
		var num = 0;
		var rate = 0;
		var defaultCount = 0;
		
		$.each($('.item-orange'), function(i, v){
			
			var $v = $(v);
			
			var $belongRate = utils.changeTwoDecimal($v.attr('belongRate'));
			var $defaultFlag = $v.attr('defaultFlag');
			
			options["approvalOrderBelongItems["+num+"].orderId"] = decorationBelong.decorationOrderId;
			options["approvalOrderBelongItems["+num+"].belongUserId"] = $v.attr('belongUserId');
			options["approvalOrderBelongItems["+num+"].belongRate"] = $belongRate;
			options["approvalOrderBelongItems["+num+"].defaultFlag"] = $defaultFlag;
			
			if($defaultFlag == '是'){
				defaultCount++;
			}
			
			rate += parseFloat($belongRate);
			++num;
		});
		
		if(rate != 1){
			bootbox.alert("分配比例的和必须是1");
			return;
		}
		
		if(defaultCount != 1){
			bootbox.alert("必须有一个是默认归属用户");
			return;
		}
			
		options["approvalOrderBelong.orderId"] = decorationBelong.decorationOrderId;
		options["approvalOrderBelong.belongType"] = decorationBelong.belongType;
		
		options["approval.receiverId"] = $("#approveManSel").val();
		options["approval.comment"] = $("#changeReason").val();
		
		com.post(api.approval.submitApprovalForOrderBelong, options, function(res){
			com.showAlert(com.info, "操作成功");
			com.switchPage(api.index.decorationOrderBelongIndex.url);
		});
		
		$("#approveModal").modal("hide");
	});
	
	$('#updateBtn').on('click', function(){
		com.clearValidator();
		
		if(com.validate("updateModal")){
			return;
		}
		
		var rate = $('#updateBelongRate').val();
		var flag = com.isOrNotType[$("#updateDefaultFlag").prop("checked")];
		
		if(!/^(0\.\d{1,2})|1|0$/.test(rate)){
			bootbox.alert("分配比例输入错误 , 为0到1之间的小数");
			return false;
		}
		
		var $e = $('#' + decorationBelong.belongUserId);
		
		$e.attr('belongrate', rate);
		$e.attr('defaultflag', flag);
		
		$e.find('li :eq(7)').text(rate);
		$e.find('li :eq(9)').text(flag);
		
		$('#updateModal').modal('hide');
	})
	
	function displayFunc(v){
		var $liLine = $('<li></li>').addClass('item-orange clearfix');
		var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.belongUser));
		var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
		var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
		var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
		var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
		
		var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-warning').html('修改');
		var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');
		
		var propertyArr = [
			["员工编号:", v.belongUserId, "grey"],
			["所属部门:", v.belongDept, "grey"],
			["所属大区:", v.belongRegion, "grey"],
			["分配比例:", v.belongRate, "blue"],
			["默认:", v.defaultFlag, "red"],
		];
		
		$.each(propertyArr, function (index, value) {
			var $liProperty = $('<li></li>');
			$('<strong></strong>').html(value[0]).appendTo($liProperty);
			$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
			$liProperty.appendTo($ulProperty);
		});
		
		$btnUpdate.click(function(){
			dialogUpdate(v.belongUserId);
		});
		
		$btnDel.click(function(){
			delRow(v.belongUserId);
		});
		
		$divBtnWrap.append($btnUpdate).append($btnDel).appendTo($h4);
		
		$liLine.attr('id', v.belongUserId).attr('belongUserId', v.belongUserId).attr('belongRate', v.belongRate).attr('defaultFlag', v.defaultFlag);
		$liLine.append($h4).append($ulProperty).append($ulStyle).append($divBtnBlock);
		
		return $liLine;
	}
	
	function dialogUpdate(belongUserId){
		decorationBelong.belongUserId = belongUserId;
		
		var $info = $('#' + belongUserId);
		
		$('#updateBelongRate').val($info.attr('belongrate'));
		
		$('#updateModal').modal('show');
	}
	
	function delRow(id){
		$('#' + id).remove();
	}
	
	function changeItem(){
		com.updateChosen('belongUserId', '', '');
		$('#belongRate').val(0);
	}

	function saveOrderBelongInfo(){
		$("#changeReason").val("");
		
		com.updateChosen('approveManSel', '', '');
		
		$("#approveModal").modal("show");	
	}
	
	var url = decorationBelong.belongType == '设计' ? api.decoration.queryDecorationBelongForDesignAChangeByOrderId : api.decoration.queryDecorationBelongForBusinessnAChangeByOrderId;
	
	com.post(url, {"decorationBelong.orderId":decorationBelong.decorationOrderId}, function(res){

		var $resultList = $('#resultList').html('');
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
