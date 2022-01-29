$(function () {
	
	var presignCost = {
		items: {
			toplimit: com.focusPage("#toplimit", "#presignCost"),
			lowlimit: com.focusPage("#lowlimit", "#presignCost"),
			costPrice: com.focusPage("#costPrice", "#presignCost"),
		},
		modals: {
			createPresignCostModal: com.focusPage("#createPresignCostModal", "#presignCost")
		},
		btns: {
			ssSSSsavePresignProduceBtn: com.focusPage("#savePresignProduceBtn", "#presignCost"),
			addPresignCostBtn: com.focusPage("#addPresignCost", "#presignCost")
		}
	}
	
	com.focusPage('#presignCost').statement("预签", "成本");
	
	initRecord();
	
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
			var $liLine = $('<li></li>').addClass('item-orange clearfix');
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html());
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
			
			var $delete = $("<a></a>").addClass("btn btn-minier btn-danger").html("删除");
			
			var customersArr = [
			    ["上限面积:", v.toplimit, "blue"],
				["下限面积:", v.lowlimit, "red"],
				["成本单价:", v.costPrice, "green"],
			];
			$.each(customersArr, function (index, value) {
			    var $Lics = $('<li></li>');
			    $('<strong></strong>').html(value[0]).appendTo($Lics);
			    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($Lics);
			    $Lics.appendTo($ulProperty);
			});
			
			//删除
			$delete.click(function(){
			    com.showConfirm("确认要删除预签成本吗?", function(res) {
			        com.post(api.quotation.deletePresignCost, {"presignCost.pcid": v.pcid}, function(res){
			            com.showAlert(com.info, "删除成功");
			            initRecord();
			        });
			    });
			});
			
			$divBtnWrap.append($delete);
			
			$divBtnWrap.appendTo($h3);
			
			$liLine.append($h3).append($ulProperty);
			
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
		}
	})();
	
	function initRecord(){
	    com.post(api.quotation.queryPresignCost, {"presignCost.ppid": params.ppid}, function(res) {
	    	displayFunc.init('presignCostList', res.presignCosts);
	    });
	}
	
	com.focusPage("#addPresignCost").click(function(){
		console.log(1212)
	    presignCost.modals.createPresignCostModal.modal("show");
	});
	
	com.focusPage("#savePresignCostBtn").click(function() {
		console.log('进入点击增加的方法')
		var options = {
			"presignCost.ppid": params.ppid,
			"presignCost.toplimit": presignCost.items.toplimit.val(),
			"presignCost.lowlimit": presignCost.items.lowlimit.val(),
			"presignCost.costPrice": presignCost.items.costPrice.val(),
		}
		
		com.post(api.quotation.addPresignCost, options, function(res){
			initRecord();
			com.showAlert(com.info, "添加成功");
			presignCost.modals.createPresignCostModal.modal("hide");
		})
	})
	
})