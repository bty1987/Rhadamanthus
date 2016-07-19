var materialOrderPreBalanceDetail = {
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	materialOrderBalanceDetailItems: {},
	
	editFlag: false,
	
	packages: {},
};

var materialOrderPreBalanceDetailPostData = {};

jQuery(function($) {
	
	materialOrderPreBalanceDetail.saveBtn = $("#saveBtn").on("click", saveData);
	materialOrderPreBalanceDetail.cancelBtn = $("#cancelBtn");
	materialOrderPreBalanceDetail.materialSubOrderItemBalanceModal = $("#materialSubOrderItemBalanceModal").on('show.bs.modal',function(e){
		com.clearValidator("#value", true);
		com.clearValidator();
	});
	
	materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.calcType = $("#calcType");
	materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value = $("#value");
	
	var options = {};
	options["materialSubOrder.msoId"] = materialOrderPreBalancePostData["materialOrderPreBalance.msoId"];
	
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
					var $btnCal = $('<a></a>').addClass('btn btn-minier btn-danger').html('计算方式');
					
					var propertyArr = [];
					
					if(v.level == 0 && v.isLeaf == true){
						v.calcType == 0 ? $btnValue.html('底价') : $btnValue.html('点位');
						$divBtnWrap.append($btnValue).append($btnCal);
						
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
							["结算值:", v.prePoint, "grey"],
							["利润:", profitInit(v), "grey"],
							["说明:", v.des, "grey"],
						];
					}else if(v.level == 0 && v.isLeaf == false){
						$btnValue.html('点位');
						$divBtnWrap.append($btnValue);
						
						$h3.append($('<small></small>').addClass('blue').html("套餐 " + v.materialModelName));
						
						propertyArr = [
							["总价:", v.total, "green"],
							["结算值:", v.prePoint, "grey"],
							["利润:", profitInit(v), "grey"],
						];
					}else{
						materialOrderPreBalanceDetail.packages[v.packageName] ? materialOrderPreBalanceDetail.packages[v.packageName].push(v) : (materialOrderPreBalanceDetail.packages[v.packageName] = [v]);
						
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
					
					$btnCal.click(function(){
						changeCalcType(v);
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
	
	$('#prebalance').click(function(){
		
		var options = {};
		
		options["msoIds[0]"] = materialOrderPreBalancePostData["materialOrderPreBalance.msoId"];
		
		bootbox.confirm("确定需要提交当前子订单的预结算处理吗?", function(result) {
			if(result){
				com.post(api.material.preBalanceMaterialSubOrder, options, function(result){
					$("#materialOrderPreBalancePageContent").load(api.index.materialOrderPreBalanceIndex.url);
				}, function(result){
					com.showAlert(com.error, "确认失败!");
				});
			}
		});
	});
	
	$('#back').click(function(){
		$(".tooltip").remove();
		$("#materialOrderPreBalancePageContent").load(api.index.materialOrderPreBalanceIndex.url);
	});
	
	function profitInit(v){
		
		var result = '';
		
		if(v.level == 0 && v.isLeaf == true){
			if(v.calcType == 0){
				result += baseCacl(v.price, v.prePoint, v.num);
			}else{
				result += pointCacl(v.salePrice, v.price, v.prePoint, v.num);
			}
		}else if(v.level == 0 && v.isLeaf == false){
			result += utils.accMul(v.total, v.prePoint);
		}else if(v.level == 1){
			return "";
		}
		
		return result;
	}
	
	function dialogMaterialSubOrderItemBalanceModal(v){
		
		com.cleanItems(materialOrderPreBalanceDetail.materialOrderBalanceDetailItems);
		
		materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.calcType.val(v.calcType == "0" ? "底价" : "点位");
		materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value.val(v.prePoint);
		
		materialOrderPreBalanceDetailPostData.tmpItem = v;
		
		materialOrderPreBalanceDetail.materialSubOrderItemBalanceModal.modal("show");
	}
	
	function changeCalcType(v){
		
		var options = {};
		
		options["materialSubOrderItem.msoiId"] = v.msoiId;
		
		bootbox.confirm("确认需要修改当前型号的计算方式?", function(result) {
			if(result){
				com.post(api.material.changeMaterialSubOrderItemForCaclType, options, function(result){
					searcher.doSearch();
				});
			}
		});
	}
	
	function pointCacl(salePrice, price, point, num, maling){
		// (售价 - 折扣价 * (1 - 点位)) * 数量
		return utils.accMul(utils.accSub(price, utils.accMul(salePrice, utils.accSub(1, point))), num)
	}

	function baseCacl(price, base, num, maling){
		// (售价 - 底价) * 数量
		return utils.accMul(utils.accSub(price, base), num);
	}

	function packageCacl(total, point){
		return utils.accMul(total, point);
	}
	
	function saveData(){
		
		var i = 0;
		var options = {};
		
		var rowInfo = materialOrderPreBalanceDetailPostData.tmpItem;
		
		if(rowInfo.calcType == "0"){
			var base = materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value.val();
			var priceRex = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
			if(!(priceRex.test(base) && parseFloat(base) > 0)){
				materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value.focus().select();
				com.showTips(materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value, "底价输入内容格式错误!", true);
				return false;
			}
		}else if(rowInfo.calcType == "1"){
			var point = materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value.val();
			var postDiscountRex = /^(1\.0{1,2}|1|0\.[0-9]{1,2})$/;
			if(!postDiscountRex.test(point)){
				materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value.focus().select();
				com.showTips(materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value, "点位输入内容格式错误!", true);
				return false;
			}
		}
		
		if(rowInfo.isLeaf){
			options["msoiIds[" + i++ + "]"] = rowInfo.msoiId;
		}else if(!rowInfo.isLeaf){
			
			var _packageItems = materialOrderPreBalanceDetail.packages[rowInfo.packageName];
			
			_packageItems && _packageItems.length > 0 && ($.each(_packageItems, function(i, v){
				options["msoiIds[" + i++ + "]"] = v.msoiId;
			}));
		}
		
		options["materialSubOrderItem.prePoint"] = materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value.val();
		options["materialSubOrderItem.mosId"] = materialOrderPreBalanceDetailPostData.tmpItem.msoId;
		
		com.post(api.material.updateMaterialSubOrderItemForPrePT, options, function(result){
			searcher.doSearch();
		});
		
		materialOrderPreBalanceDetail.materialSubOrderItemBalanceModal.modal("hide");
	}
	
});

