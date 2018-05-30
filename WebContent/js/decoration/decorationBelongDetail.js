
jQuery(function($) {
	
	var decorationBelong = {
		type:null,

		decorationOrderID:null,
		
		decorationBelongs:null,
		
		lastEditId:-1
	};
	
	$('#fl-statement').statement("订单归属", "归属详细信息");
	
	decorationBelong.decorationOrderID = params.orderId;
	decorationBelong.type = params.orderBelongType;
	
	com.initChosen('belongUserId', api.personel.queryUserByDepartmentType, "pinyinName", {"user.status":0,"departmentType.name":""},'userBases','userId','currentName').on("change",function(e){
		if($("#belongUserId").val() == null || $("#belongUserId").val() == ""){
			return;
		}
		
		com.post(api.personel.queryUserByUserId, {"user.userId":$("#belongUserId").val()}, function(res){
			$("#belongUser").val(res.user.currentName);
			$("#belongDept").val(res.user.dept.deptName);
			$("#belongRegion").val(res.user.dept.fatherDept.deptName);
			$("#belongDeptId").val(res.user.dept.deptId);
			$("#belongRegionId").val(res.user.dept.fatherDept.deptId);
		});
	});
	
	$("#defaultFlag").switchBtn("isOrNot");
	$("#updateDefaultFlag").switchBtn("isOrNot");
	
	$('#detailBckBtn').on(ace.click_event, function(){
		com.switchPage(api.index.decorationBelongIndex.url);
	});
	
	$('#saveBelongInfoBtn').on(ace.click_event, saveOrderBelongInfo);
		
	$("#addNewUserBtn").on(ace.click_event, function(event){
		com.clearValidator();
		
		if(com.validate("addUserModal"))
			return false;
		
		var addRow = {};

		addRow.belonger = {};
		addRow.department = {};
        addRow.region = {};
		addRow.belonger.userId = $("#belongUserId").val();
		addRow.belonger.currentName = $("#belongUser").val();
		addRow.department.deptName = $("#belongDept").val();
		addRow.region.deptName = $("#belongRegion").val();
		addRow.rate = $("#belongRate").val();
		addRow.department.deptId = $("#belongDeptId").val();
		addRow.region.deptId = $("#belongRegionId").val();
		addRow.defaultFlag = com.isOrNotType[$("#defaultFlag").prop("checked")];
		
		if(!/^(0\.\d{1,2})|1|0$/.test(addRow.rate)){
			bootbox.alert("分配比例输入错误 , 为0到1之间的小数");
			return false;
		}
		
		var belongInfos = $('.item-orange');
		
		for(var i=0;i<belongInfos.length;i++){
			var $v = $(belongInfos[i]);
			
			if($v.attr('belongUserId') == addRow.belonger.userId){
				bootbox.alert("该员工编号("+addRow.belonger.userId+")已存在不能重复添加");
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

		var receiverId = $("#approveManSel").find('input:checked').attr('userid');

		if(receiverId == null || receiverId == ""){
			com.showAlert(com.error,"请选择审批人!");
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

			options["approvalDecorationBelongItems["+num+"].orderId"] = decorationBelong.decorationOrderID;
			options["approvalDecorationBelongItems["+num+"].userId"] = $v.attr('belongUserId');
			options["approvalDecorationBelongItems["+num+"].rate"] = $belongRate;
			options["approvalDecorationBelongItems["+num+"].defaultFlag"] = $defaultFlag == '是' ? 1 : 0;
			
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
			
		options["approvalDecorationBelong.orderId"] = decorationBelong.decorationOrderID;
		options["approvalDecorationBelong.belongType"] = decorationBelong.type;
		
		options["approval.receiver.userId"] = receiverId;
		options["approval.comment"] = $("#changeReason").val();
		
		com.post(api.approval.submitApprovalForDecorationBelong, options, function(res){
			com.showAlert(com.info, "操作成功");
			com.switchPage(api.index.decorationBelongIndex.url);
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
		var $h4 = $('<h4></h4>').addClass('oid').append($('<b></b>').html(v.belonger.currentName));
		var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
		var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
		var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
		var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
		
		var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-warning').html('修改');
		var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');
		
		var propertyArr = [
			["员工编号:", v.belonger.userId, "grey"],
			["所属部门:", v.department.deptName, "grey"],
			["所属大区:", v.region.deptName, "grey"],
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

		approvalUtils.initqueryApprovalUser("approveManSel",3);
		
		$("#approveModal").modal("show");	
	}
	
	var url = decorationBelong.type == 0 ? api.decoration.queryDecorationBelongForDesignAChangeByOrderId : api.decoration.queryDecorationBelongForBusinessnAChangeByOrderId;
	
	com.post(url, {"decorationBelong.orderId":decorationBelong.decorationOrderID}, function(res){

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
