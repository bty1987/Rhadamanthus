
jQuery(function($) {
	$('#fl-statement').statement("客服控制", "回访信息列表");

	var backVisit = {
		saveBtn: null,
		cancellBtn: null,
		modal: null,
		backVisitItems: {},
		levelDict: {"0":"普通", "1":"重要"},
		backVisitTypeData: [{"id":"1", "name":"普通"}],
		editFlag: false,
		repeatFlg: false,
	};

	backVisit.saveBtn = $("#saveBtn").on("click", saveData);
	backVisit.cancelBtn = $("#cancelBtn");
	backVisit.modal = $("#backVisitModal");
	
	backVisit.backVisitItems.orderId = $("#orderId");
	backVisit.backVisitItems.orderAddr = $("#orderAddr");
	backVisit.backVisitItems.customerName = $("#customerName");
	backVisit.backVisitItems.backVisitTime = $("#backVisitTime");
	backVisit.backVisitItems.backVisitType = $("#backVisitType");
	backVisit.backVisitItems.backVisitDes = $("#backVisitDes");
	
	backVisit.backVisitItems.backVisitType.bindData(backVisit.backVisitTypeData, "id", "name", false);
	
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
			var $liLine = $('<li></li>').addClass('item-orange clearfix');
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-primary').html("编辑");
			var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html("删除");

			var propertyArr = [
				["楼盘地址:", v.orderAddr, "grey"],
				["客户名:", v.customerName, "grey"],
				["时间:", v.backVisitTime, "green"],
				["类型:", typeInit(v), "red "],
				["备注:", v.backVisitDes, "grey"],
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
				backVisit.editFlag = true;
				var row = v;

				backVisit.backVisitItems.orderId.val(params.orderId);
				backVisit.backVisitItems.orderAddr.val(params.orderAddr);
				backVisit.backVisitItems.customerName.val(params.customerName);
				backVisit.backVisitItems.backVisitTime.val(row.backVisitTime);
				backVisit.backVisitItems.backVisitType.val(row.backVisitType);
				backVisit.backVisitItems.backVisitDes.val(row.backVisitDes);
				
				backVisit["customerServiceBackVisit.csbvId"] = row.csbvId;

				backVisit.backVisitItems.orderId.attr('disabled', true);
				backVisit.backVisitItems.orderAddr.attr("disabled", true);
				backVisit.backVisitItems.customerName.attr('disabled', true);

				backVisit.modal.modal("show");
			});
			
			$btnDel.click(function(){
				removeRow(v.csbvId);
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
	searcher.init( [], "condList", api.construction.pageCustomerServiceBackVisit, function(list){
		displayFunc.init('resultList', list);
	}, "pagenation", "customerServiceBackVisitPostData", {
		"customerServiceBackVisit.orderId": params.orderId
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
		backVisit.editFlag = false;
		
		com.cleanItems(backVisit.backVisitItems);

		backVisit.backVisitItems.orderId.val(params.orderId);
		backVisit.backVisitItems.orderAddr.val(params.orderAddr);
		backVisit.backVisitItems.customerName.val(params.customerName);

		backVisit.backVisitItems.orderId.attr("disabled", true);
		backVisit.backVisitItems.orderAddr.attr("disabled", true);
		backVisit.backVisitItems.customerName.attr("disabled", true);

		backVisit.modal.modal("show");
	});
	
	$('a[name="back"]', '#pagenation').click(function(){
		com.switchPage(api.index.customerServiceIndex.url);
	});
	
	function typeInit(rowdata){

		var result = "";

		for(var i=0;i<backVisit.backVisitTypeData.length;i++){
			if(rowdata["backVisitType"] == backVisit.backVisitTypeData[i]["id"]){
				result = backVisit.backVisitTypeData[i]["name"];
			}
		}

		return result;
	}

	function saveData(){
		if(com.validate("backVisitModal")|| backVisit.repeatFlg)
			return;

		var url;
		var options = {
			"customerServiceBackVisit.orderId": backVisit.backVisitItems.orderId.val(),
			"customerServiceBackVisit.orderAddr": backVisit.backVisitItems.orderAddr.val(),
			"customerServiceBackVisit.customerName": backVisit.backVisitItems.customerName.val(),
			"customerServiceBackVisit.backVisitTime": backVisit.backVisitItems.backVisitTime.val(),
			"customerServiceBackVisit.backVisitType": backVisit.backVisitItems.backVisitType.val(),
			"customerServiceBackVisit.backVisitDes": backVisit.backVisitItems.backVisitDes.val(),
		};

		if(backVisit.editFlag){
			url = api.construction.updateCustomerServiceBackVisit;
			options["customerServiceBackVisit.csbvId"] = backVisit["customerServiceBackVisit.csbvId"];
		}else{
			url = api.construction.addCustomerServiceBackVisit;
		}

		com.post(url, options, successCallback, failCallback);
		backVisit.modal.modal("hide");
	}

	function removeRow(id){

		bootbox.confirm("确认删除吗？", function(res){
			if(res){
				com.post(api.construction.deleteCustomerServiceBackVisit, {"csbvIds[0]"  : id}, successCallback, failCallback);
			}
		});

	}

	function successCallback(result){
		searcher.doSearch();
	}

	function failCallback(){

	}
	
});

