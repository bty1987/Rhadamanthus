
jQuery(function($) {
	
	var record = {
		saveBtn: null,
		cancellBtn: null,
		modal: null,
		recordItems: {},
		
		editFlag: false,
		repeatFlg: false,
	};
	
	$('#fl-statement').statement("质检控制", "记录信息列表");
	
	record.recordListGrid = $("#recordListGrid");
	record.recordGridPager = "#recordGridPager";
	record.saveBtn = $("#saveBtn").on("click", saveData);
	record.cancelBtn = $("#cancelBtn");
	
	record.modal = $("#recordModal").on('show.bs.modal',function(e){
		com.clearValidator();
	});;
	
	record.recordItems.orderId = $("#orderId");
	record.recordItems.orderAddr = $("#orderAddr");
	record.recordItems.recordDate = $("#recordDate");
	record.recordItems.recordTime = $("#recordTime");
	record.recordItems.recordDes = $("#recordDes");
	
	$('.date-picker').datepicker({autoclose:true});
	$('#recordTime').timepicker({minuteStep: 1, showSeconds: true, showMeridian: false});
	
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

			var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html("删除");
			
			var propertyArr = [
				["楼盘地址:", v.orderAddr, "grey"],
				["操作人:", v.operaterName, "grey"],
				["时间:", v.recordTime, "grey"],
				["信息:", v.recordDes, "grey"],
			];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$divBtnWrap.append($btnDel).appendTo($h3);

			$liLine.append($h3).append($ulProperty);

			$btnDel.click(function(){
				removeRow(v.qtrId);
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
	searcher.init( [], "condList", api.construction.pageQualityTestingRecordByOrderId, function(list){
		displayFunc.init('resultList', list);
	}, "pagenation", "qualityTestingRecordPostData", {
		"qualityTestingRecord.orderId": params.orderId
	}, false, null,  function(){

		var $adda = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'add').css("margin", "0px 3px").css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
		var $addspan = $('<span></span>').text('添加').appendTo($adda);
		
		var $addb = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'back').css("margin", "0px 3px").css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-mail-forward bigger-110').appendTo($addb);
    	var $addspan = $('<span></span>').text('返回').appendTo($addb);

		return [$addb, $adda];
	});
	
	$('a[name="add"]', '#pagenation').click(function(){
		record.editFlag = false;
		
		com.cleanItems(record.recordItems);
		
		record.recordItems.orderId.val(params.orderId);
		record.recordItems.orderAddr.val(params.orderAddr);
		
		record.recordItems.orderId.attr('disabled', true);
		record.recordItems.orderAddr.attr('disabled', true);
		
		record.modal.modal("show");
	});
	
	$('a[name="back"]', '#pagenation').click(function(){
		com.switchPage(api.index.qualityTestingIndex.url);
	});
	
	function updateRow(v){
		record.editFlag = true;
		
		record.recordItems.orderId.val(v.orderId);
		record.recordItems.orderAddr.val(v.orderAddr);
		record.recordItems.recordTime.val(v.recordTime);
		record.recordItems.recordDes.val(v.recordDes);
		
		record["qualityTestingRecord.qtrId"] = v.qtrId;
		
		record.recordItems.orderId.attr('disabled', true);
		record.recordItems.orderAddr.attr('disabled', true);
		
		record.modal.modal("show");
	}
	
	function removeRow(irId){
		com.post(api.construction.deleteQualityTestingRecord, {'qtrIds[0]': riId}, function(res){
			searcher.doSearch();
		});
	}
	
	function saveData(){
		if(com.validate()) return;
		
		var url;
		var options = {
			"qualityTestingRecord.orderId": record.recordItems.orderId.val(),
			"qualityTestingRecord.orderAddr": record.recordItems.orderAddr.val(),
			"qualityTestingRecord.recordTime": record.recordItems.recordDate.val() + " " + record.recordItems.recordTime.val(),
			"qualityTestingRecord.recordDes": record.recordItems.recordDes.val(),
		};
		
		if(record.editFlag){
			url = api.construction.updateQualityTestingRecord;
			options["qualityTestingRecord.qtrId"] = record["qualityTestingRecord.qtrId"];
		}else{
			url = api.construction.addQualityTestingRecord;
		}
		
		com.post(url, options, function(res){
			searcher.doSearch();
		});
		
		record.modal.modal("hide");
	}
	
});

