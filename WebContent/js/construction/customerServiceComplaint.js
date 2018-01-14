
jQuery(function($) {
	$('#fl-statement').statement("客服控制", "投诉信息列表");

	var complaint = {
		saveBtn: $("#saveBtn").on("click", saveData),
		cancellBtn: $("#cancelBtn"),
		saveHandleBtn : $("#saveHandleBtn").on("click", saveHandleData),
		canceHandlelBtn : $("#cancelBtn"),
		modal: $("#complaintModal").on('show.bs.modal',function(e){
			com.clearValidator();
		}),
		handleModal : $("#complaintHandleModal").on('show.bs.modal',function(e){
			com.clearValidator();
		}),
		complaintItems: {},

		levelDict: {"0":"普通", "1":"重要"},
		typeDict: {"0":"装修", "1":"主材"},

		editFlag: false,
		repeatFlg: false,
	};

	complaint.complaintItems.orderId = $("#orderId");
	complaint.complaintItems.customerName = $("#customerName");
	complaint.complaintItems.complaintLevel = $("#complaintLevel");
	complaint.complaintItems.complaintTime = $("#complaintTime");
	complaint.complaintItems.complaintDes = $("#complaintDes");
	complaint.complaintItems.complaintType = $("#complaintType");
	
	complaint.complaintItems.handleOrderId = $("#handleOrderId");
	complaint.complaintItems.handleCustomerName = $("#handleCustomerName");
	complaint.complaintItems.handleComplaintLevel = $("#handleComplaintLevel");
	complaint.complaintItems.handleComplaintType = $("#handleComplaintType");
	complaint.complaintItems.complaintHandleDes = $("#complaintHandleDes");

	$('.date-picker').datepicker({autoclose:true});

	var displayFunc  = (function(){
		var renderList = function(tableId,listData){
			var $tableWrap = $('#' + tableId).empty();
			var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

			if(listData && listData.length){
				$.each(listData,function(i, v){
					var $liLine = creatLine(v);

					$liLine.appendTo($ul);
				});

				$ul.appendTo($tableWrap);
			}
		};

		var creatLine = function(v){
			var that = this;
			var $liLine = $('<li></li>').addClass('item-blue clearfix');
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-primary').html("处理");
			var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html("删除");

			var disposeStatus;
			if(v.status == 0){
				disposeStatus = "未处理";
			}else if(v.status == 1){
				disposeStatus = "已处理";
			}

			var propertyArr = [
				["客户名:", v.customerName, "grey"],
				["创建人:", v.createrName, "grey"],
				["操作人:", v.operaterName, "grey"],
				["等级:", levelInit(v.level), null],
				["类型:", complaint.typeDict[v.type], "grey"],
				["时间:", v.createTime, "grey"],
				["备注:", v.des, "grey"],
				["状态:", disposeStatus, "grey"],
				["处理信息:", v.handle, "grey"],
			];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$divBtnWrap.append($btnEdit).append($btnDel).appendTo($h3);

			$liLine.append($h3).append($ulProperty);

			$btnEdit.click(function(){
				dialogCustomerServiceComplaintHandle(v);
			});
			$btnDel.click(function(){
				removeRow(v.cscId);
			});

			return $liLine;
		};

		return {
			init : function(tableId,listData){
				$('#' + tableId).html(null);
				renderList(tableId,listData);
			},
			drawLine : function(v){
				return creatLine(v);
			}
		}
	})();

	var searcher = new Searcher();
	searcher.init( [], "condList", api.construction.pageCustomerServiceComplaint, function(list){
		displayFunc.init('resultList', list);
	}, "pagenation", "searcherPostData", {
		"customerServiceComplaint.orderId": params.orderId
	}, false, null,  function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'add').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
		var $addspan = $('<span></span>').text('添加').appendTo($adda);
		
		var $addb = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'back').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-mail-forward bigger-110').appendTo($addb);
    	var $addspan = $('<span></span>').text('返回').appendTo($addb);

		return [$addb, $adda];
	});

	$('a[name="add"]', '#pagenation').click(function(){
		complaint.editFlag = false;
		
		com.cleanItems(complaint.complaintItems);

		complaint.complaintItems.orderId.val(params.orderId);
		complaint.complaintItems.customerName.val(params.customerName);

		complaint.complaintItems.orderId.attr("disabled", true);
		complaint.complaintItems.customerName.attr("disabled", true);
		complaint.complaintItems.complaintTime.attr("disabled", false);

		complaint.modal.modal("show");
	});
	
	$('a[name="back"]', '#pagenation').click(function(){
		com.switchPage(api.index.customerServiceIndex.url);
	});

	function levelInit(levelcode){

		var result = '';

		var level = complaint.levelDict[levelcode];

		if(levelcode == 0){
			result += "<span class='label label-warning'>" + level + "</span>";
		}else if(levelcode == 1){
			result += "<span class='label label-danger'>" + level + "</span>";
		}

		return result;
	}

	function saveData(){
		if(com.validate("complaintModal")|| complaint.repeatFlg)
			return;

		var url;
		var options = {
			"customerServiceComplaint.orderId": complaint.complaintItems.orderId.val(),
			"customerServiceComplaint.customerName": complaint.complaintItems.customerName.val(),
			"customerServiceComplaint.level": complaint.complaintItems.complaintLevel.val(),
			"customerServiceComplaint.createTime": complaint.complaintItems.complaintTime.val(),
			"customerServiceComplaint.des": complaint.complaintItems.complaintDes.val(),
			"customerServiceComplaint.type": complaint.complaintItems.complaintType.val(),
		};

		if(complaint.editFlag){

			url = api.construction.updateCustomerServiceComplaint;
			options["customerServiceComplaint.cscId"] = complaint["customerServiceComplaint.cscId"];

		}else{
			url = api.construction.addCustomerServiceComplaint;
		}

		com.post(url, options, successCallback);
		
		complaint.modal.modal("hide");
	}

	function saveHandleData(){
		if(com.validate())
			return;

		if(complaint["customerServiceComplaint.complaintStatus"] == "1"){
			complaint.handleModal.modal("hide");
			return false;
		}

		var options = {
			"customerServiceComplaint.cscId": complaint["customerServiceComplaint.cscId"],
			"customerServiceComplaint.handle": complaint.complaintItems.complaintHandleDes.val(),
		};

		com.post(api.construction.handleCustomerServiceComplaint, options, successCallback);
		
		complaint.handleModal.modal("hide");
	}

	function removeRow(id){


		bootbox.confirm("确认删除投诉吗？", function(res){
			if(res){
				com.post(api.construction.deleteCustomerServiceComplaint, {"cscIds[0]"  : id}, successCallback);
			}
		});
	}

	function dialogCustomerServiceComplaintHandle(v){
		com.cleanItems(complaint.complaintItems);

		var row = v;

		complaint["customerServiceComplaint.cscId"] = row.cscId;
		complaint["customerServiceComplaint.complaintStatus"] = row.complaintStatus;

		complaint.complaintItems.handleOrderId.val(row.orderId).attr('disabled', true);
		complaint.complaintItems.handleCustomerName.val(row.customerName).attr('disabled', true);
		complaint.complaintItems.handleComplaintLevel.val(row.complaintLevel).attr('disabled', true);
		complaint.complaintItems.handleComplaintType.val(row.complaintType).attr('disabled', true);
		complaint.complaintItems.complaintHandleDes.val(row.complaintHandle);

		if(row.complaintStatus == "1"){
			complaint.complaintItems.complaintHandleDes.attr("disabled", true);
		}else{
			complaint.complaintItems.complaintHandleDes.attr("disabled", false);
		}

		complaint.handleModal.modal("show");
	}

	function successCallback(result){
		searcher.doSearch();
	}

});
