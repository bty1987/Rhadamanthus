
jQuery(function($) {
	
	$('#fl-statement').statement("主材订单", "型号信息");
	
	var options = {};
	options["materialSubOrderItem.msoId"] = params['materialSubOrder.msoId'];

	if(params['materialOrderPostBalance.type'] == 1){
		options['idents[0]'] = params['idents[0]'];
	}

	var url = params['materialOrderPostBalance.type'] == 1 ? api.material.queryMaterialSubOrderRefundByMsoId :api.material.queryMaterialSubOrderItemByMsoId;
	
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

					var propertyArr = [];
					
					if(v.level == 0 && v.isLeaf == true){

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

	com.post(url, options, function(data){

		displayFunc.init('resultList', params['materialOrderPostBalance.type'] != 1 ? data.materialSubOrderItems : data.materialSubOrderRefunds);
	});

	$('#back').click(function(){
		com.switchPage('views/material/materialOrderPostBalance.html');
	});

});
