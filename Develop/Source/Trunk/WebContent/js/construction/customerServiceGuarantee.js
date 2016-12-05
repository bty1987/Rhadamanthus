
jQuery(function($) {

	var guarantee = {
		saveBtn: null,
		cancellBtn: null,
		modal: null,
		guaranteeItems: {},

		levelDict: {"0":"普通", "1":"重要"},

		editFlag: false,
		repeatFlg: false,
	};
	
	$('#fl-statement').statement("客服控制", "保修信息列表");

	guarantee.saveBtn = $("#saveBtn").on("click", saveData);
	guarantee.cancelBtn = $("#cancelBtn");
	guarantee.modal = $("#guaranteeModal");
	
	guarantee.guaranteeItems.orderId = $("#orderId");
	guarantee.guaranteeItems.customerName = $("#customerName");
	guarantee.guaranteeItems.guaranteeTime = $("#guaranteeTime");
	guarantee.guaranteeItems.guaranteeDes = $("#guaranteeDes");


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

			var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-primary').html("编辑");
			var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html("删除");


			var propertyArr = [
				["客户名:", v.customerName, "grey"],
				["时间:", v.guaranteeTime, "grey"],
				["备注:", v.guaranteeDes, "grey"],
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
				guarantee.editFlag = true;
				var row = v;
				guarantee.guaranteeItems.orderId.val(row.orderId);
				guarantee.guaranteeItems.customerName.val(row.customerName);
				guarantee.guaranteeItems.guaranteeTime.val(row.guaranteeTime);
				guarantee.guaranteeItems.guaranteeDes.val(row.guaranteeDes);
				
				guarantee["customerServiceGuarantee.csgId"] = row.csgId;

				guarantee.guaranteeItems.orderId.attr('disabled', true);
				guarantee.guaranteeItems.customerName.attr('disabled', true);
				guarantee.guaranteeItems.guaranteeTime.attr("disabled", true);

				guarantee.modal.modal("show");
			});
			$btnDel.click(function(){
				removeRow(v.csgId);
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
	searcher.init( [], "condList", api.construction.pageCustomerServiceGuarantee, function(list){
		displayFunc.init('resultList', list);
	}, "pagenation", "searcherPostData", {
		"customerServiceGuarantee.orderId": params.orderId
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
		guarantee.editFlag = false;
		
		com.cleanItems(guarantee.guaranteeItems);

		guarantee.guaranteeItems.orderId.val(params.orderId);
		guarantee.guaranteeItems.customerName.val(params.customerName);

		guarantee.guaranteeItems.orderId.attr("disabled", true);
		guarantee.guaranteeItems.customerName.attr("disabled", true);
		guarantee.guaranteeItems.guaranteeTime.attr("disabled", false);

		guarantee.modal.modal("show");
	});
	
	$('a[name="back"]', '#pagenation').click(function(){
		com.switchPage(api.index.customerServiceIndex.url);
	});

	$('.date-picker').datepicker({autoclose:true});

	function levelFormat(cellvalue, options, rowdata){

		var result = '';

		var level = guarantee.levelDict[cellvalue];

		if(cellvalue == 0){
			result += "<span class='label label-warning'>" + level + "</span>";
		}else if(cellvalue == 1){
			result += "<span class='label label-danger'>" + level + "</span>";
		}

		return result;

	}

	function saveData(){
		if(com.validate()|| guarantee.repeatFlg)
			return;

		var url;
		var options = {
			"customerServiceGuarantee.orderId": guarantee.guaranteeItems.orderId.val(),
			"customerServiceGuarantee.customerName": guarantee.guaranteeItems.customerName.val(),
			"customerServiceGuarantee.guaranteeTime": guarantee.guaranteeItems.guaranteeTime.val(),
			"customerServiceGuarantee.guaranteeDes": guarantee.guaranteeItems.guaranteeDes.val(),
		};

		if(guarantee.editFlag){
			url = api.construction.updateCustomerServiceGuarantee;
			options["customerServiceGuarantee.csgId"] = guarantee["customerServiceGuarantee.csgId"];
		}else{
			url = api.construction.addCustomerServiceGuarantee;
		}

		com.post(url, options, successCallback);
		guarantee.modal.modal("hide");
	}

	function removeRow(id){

		bootbox.confirm("确认删除吗？", function(res){
			if(res){
				com.post(api.construction.deleteCustomerServiceGuarantee, {"csgIds[0]"  : id}, successCallback);
			}
		});

	}

	function successCallback(result){
		searcher.doSearch();
	}

});

