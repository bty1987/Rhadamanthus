
jQuery(function($) {
	$('#fl-statement').statement("监理控制", "返工信息列表");

	var rework = {
		saveBtn: $("#saveBtn").on("click", saveData),
		cancellBtn: $("#cancelBtn"),
		modal: $("#reworkModal"),
		reworkItems: {
			createTime : $("#createTime"),
			reworkDes : $("#reworkDes"),
		},

		editFlag: false,
		repeatFlg: false,
	};
	
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
			//var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html());
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons').css('padding-top', '2px');
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix col-xs-6').css('padding-top', '2px');


			var $btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html("图纸");
			var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-primary').html("编辑");
			var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html("删除");

			var propertyArr = [
				["创建人:", v.createrName, "grey"],
				["返工时间:", v.createTime, "grey"],
				["返工说明:", v.reworkDes, "grey"],
			];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$liLine.append($ulProperty);
			$divBtnWrap.append($btnView).append($btnEdit).append($btnDel).appendTo($liLine);

			$btnView.click(function(){
				viewSupervisionReworkDrawingIndex(v.rwId);
			});
			$btnEdit.click(function(){
				rework.editFlag = true;
				rework.reworkItems.createTime.val(v.createTime);
				rework.reworkItems.reworkDes.val(v.reworkDes);
				
				rework["rework.rwId"] = v.rwId;
				
				rework.modal.modal("show");
			});
			$btnDel.click(function(){
				removeRow(v.rwId);
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
	searcher.init( [], "condList", api.construction.pageReworkByOrderId, function(list){
		displayFunc.init('resultList', list);
	}, "pagenation", "supervisionReworkPostData", {
		"rework.orderId": params.orderId
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
		rework.editFlag = false;
		
		com.cleanItems(rework.reworkItems);
		
		rework.modal.modal("show");
	});
	
	$('a[name="back"]', '#pagenation').click(function(){
		com.switchPage(api.index.supervisionIndex.url);
	});

	function saveData(){

		if(com.validate())
			return;

		var url;
		var options = {
			"rework.createTime": rework.reworkItems.createTime.val(),
			"rework.reworkDes": rework.reworkItems.reworkDes.val(),
			"rework.orderId": params.orderId
		};

		if(rework.editFlag){
			url = api.construction.updateRework;
			options["rework.rwId"] = rework["rework.rwId"];
		}else{
			url = api.construction.addRework;
		}

		com.post(url, options, function(res){
			searcher.doSearch();
		});
		
		rework.modal.modal("hide");
	}

	function removeRow(id){
		bootbox.confirm("确认申请放线吗?", function(res){
			if(res){
				com.post(api.construction.deleteRework, {"rwIds[0]": id}, function(res){
					searcher.doSearch();
				});
			}
		});
	}

	function viewSupervisionReworkDrawingIndex(rwId){
		params.rwId = rwId;
		com.switchPage(api.index.supervisionReworkDrawingIndex.url);
	}

});
