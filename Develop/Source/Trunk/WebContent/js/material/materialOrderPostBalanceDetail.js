var materialOrderPostBalanceDetail = {
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	materialOrderBalanceDetailItems: {},
	
	editFlag: false,
	
	packages: {},
};

var materialOrderPostBalanceDetailPostData = {};

jQuery(function($) {
	
	materialOrderPostBalanceDetail.saveBtn = $("#saveBtn").on("click", saveData);
	materialOrderPostBalanceDetail.cancelBtn = $("#cancelBtn");
	materialOrderPostBalanceDetail.materialSubOrderItemBalanceModal = $("#materialSubOrderItemBalanceModal").on('show.bs.modal',function(e){
		com.clearValidator("#value", true);
		com.clearValidator();
	});
	
	materialOrderPostBalanceDetail.materialOrderBalanceDetailItems.calcType = $("#calcType");
	materialOrderPostBalanceDetail.materialOrderBalanceDetailItems.value = $("#value");
	
	var options = {};
	options["materialSubOrder.msoId"] = materialOrderPostBalancePostData["materialOrderPostBalance.msoId"];
	
	var displayFunc  = (function(){

		var renderList = function(tableId,listData){
			var $tableWrap = $('#' + tableId);
			var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

			if(listData && listData.length){
				$.each(listData,function(i, v){
					var $liLine = $('<li></li>').addClass('item-orange clearfix');
					var $h3 = $('<h3></h3>').addClass('oid');
					var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
					var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
					var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

					var $btnValue = $('<a></a>').addClass('btn btn-minier btn-success');
					
					var propertyArr = [];
					
					if(v.level == 0 && v.isLeaf == true){
						v.calcType == 0 ? $btnValue.html('底价') : $btnValue.html('点位');
						$divBtnWrap.append($btnValue);
						
						$h3.append($('<small></small>').addClass('blue').html(v.materialModelName));
						
						propertyArr = [
							["型号:", v.materialModelNo, "grey"],
							["品类:", v.materialTypeName, "grey"],
							["品牌:", v.materialBrandName, "grey"],
							["单位:", v.measurementUnitName, "grey"],
							["折扣价:", v.salePrice, "blue"],
							["售价:", v.price, "blue"],
							["数量:", v.num, "green"],
							["总价:", v.total, "green"],
							["预结算值:", v.prePoint, "grey"],
							["结算值:", v.postPoint, "grey"],
							["说明:", v.des, "grey"],
						];
					}else if(v.level == 0 && v.isLeaf == false){
						$btnValue.html('点位');
						$divBtnWrap.append($btnValue);
						
						$h3.append($('<small></small>').addClass('blue').html("套餐 " + v.materialModelName));
						
						propertyArr = [
							["总价:", v.total, "green"],
							["预结算值:", v.prePoint, "grey"],
							["结算值:", v.postPoint, "grey"],
						];
					}else{
						materialOrderPostBalanceDetail.packages[v.packageName] ? materialOrderPostBalanceDetail.packages[v.packageName].push(v) : (materialOrderPostBalanceDetail.packages[v.packageName] = [v]);
						
						propertyArr = [
						    ["名称:", v.materialModelName, "grey"],
							["型号:", v.materialModelNo, "grey"],
							["品类:", v.materialTypeName, "grey"],
							["品牌:", v.materialBrandName, "grey"],
							["单位:", v.measurementUnitName, "grey"],
							["折扣价:", v.salePrice, "blue"],
							["售价:", v.price, "blue"],
							["数量:", v.num, "green"],
							["说明:", v.des, "grey"],
						];
					}
					
					$.each(propertyArr, function (index,value) {
						var $liProperty = $('<li></li>');
						$('<strong></strong>').html(value[0]).appendTo($liProperty);
						$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
						$liProperty.appendTo($ulProperty);
					});
					
					$btnValue.click(function(){
						dialogMaterialSubOrderItemBalanceModal(v);
					});
					
					$divBtnWrap.appendTo($h3);
					
					$liLine.append($h3).append($ulProperty).append($divBtnBlock).appendTo($ul);
				});

				$ul.appendTo($tableWrap);
			}
		}
		
		return {
			init : function(tableId,listData){
				$('#' + tableId).html(null);
				renderList(tableId,listData);
			}
		}
	})();
	
	var searcher = new Searcher();
	
	searcher.init([], "condList", api.material.queryMaterialSubOrderItemByMsoId, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", null, options, true, "materialSubOrderItems");
	
	$('#back').click(function(){
		$(".tooltip").remove();
		$("#materialOrderPostBalancePageContent").load(api.index.materialOrderPostBalanceIndex.url);
	});
	
	function dialogMaterialSubOrderItemBalanceModal(v){
		
		materialOrderPostBalanceDetail.materialOrderBalanceDetailItems.calcType.val(v.calcType == 0 ? "底价" : "点位");
		materialOrderPostBalanceDetail.materialOrderBalanceDetailItems.value.val(v.postPoint);
		
		materialOrderPostBalanceDetailPostData.tmpItem = v;
		
		materialOrderPostBalanceDetail.materialSubOrderItemBalanceModal.modal("show");
	}
	
	function saveData(){
		
		var i = 0;
		var options = {};
		
		var rowInfo = materialOrderPostBalanceDetailPostData.tmpItem;
		
		if(rowInfo.calcType == "0"){
			var base = materialOrderPostBalanceDetail.materialOrderBalanceDetailItems.value.val();
			var priceRex = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
			if(!(priceRex.test(base) && parseFloat(base) > 0)){
				materialOrderPostBalanceDetail.materialOrderBalanceDetailItems.value.focus().select();
				com.showTips(materialOrderPostBalanceDetail.materialOrderBalanceDetailItems.value, "底价输入内容格式错误!", true);
				return false;
			}
		}else if(rowInfo.calcType == "1"){
			var point = materialOrderPostBalanceDetail.materialOrderBalanceDetailItems.value.val();
			var postDiscountRex = /^(1\.0{1,2}|1|0\.[0-9]{1,2})$/;
			if(!postDiscountRex.test(point)){
				materialOrderPostBalanceDetail.materialOrderBalanceDetailItems.value.focus().select();
				com.showTips(materialOrderPostBalanceDetail.materialOrderBalanceDetailItems.value, "点位输入内容格式错误!", true);
				return false;
			}
		}
		
		if(rowInfo.isLeaf){
			options["msoiIds[" + i++ + "]"] = rowInfo.msoiId;
		}else if(!rowInfo.isLeaf){
			
			var _packageItems = materialOrderPostBalanceDetail.packages[rowInfo.packageName];
			
			_packageItems && _packageItems.length > 0 && ($.each(_packageItems, function(i, v){
				options["msoiIds[" + i++ + "]"] = v.msoiId;
			}));
		}
		
		options["materialSubOrderItem.postPoint"] = materialOrderPostBalanceDetail.materialOrderBalanceDetailItems.value.val();
		options["materialSubOrderItem.mosId"] = materialOrderPostBalancePostData["materialOrderPostBalance.msoId"];
		
		com.post(api.material.updateMaterialSubOrderItemForPostPT, options, function(result){
			searcher.doSearch();
		});
		
		materialOrderPostBalanceDetail.materialSubOrderItemBalanceModal.modal("hide");
	}
	
});
