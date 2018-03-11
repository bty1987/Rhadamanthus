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
	
	$('#fl-statement').statement("主材订单", "型号信息");
	
	materialOrderPreBalanceDetail.saveBtn = $("#saveBtn").on("click", saveData);
	materialOrderPreBalanceDetail.cancelBtn = $("#cancelBtn");
	materialOrderPreBalanceDetail.materialSubOrderItemBalanceModal = $("#materialSubOrderItemBalanceModal").on('show.bs.modal',function(e){
		com.clearValidator("#value", true);
		com.clearValidator();
	});
	
	materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.calcType = $("#calcType");
	materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value = $("#value");
	
	var options = {};
	options["materialItem.mid"] = materialOrderPreBalancePostData["materialOrderPreBalance.msoId"];
	
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

					var $btnValue = $('<a></a>').addClass('btn btn-minier btn-yellow');
					var $btnCal = $('<a></a>').addClass('btn btn-minier btn-success').html('计算方式');
					
					var propertyArr = [];

					if(v.packageName == "" || v.packageName == null){
					//if(v.level == 0 && v.isLeaf == true){
						v.calcType == 0 ? $btnValue.html('底价') : $btnValue.html('点位');
						$divBtnWrap.append($btnValue).append($btnCal);
						
						$h3.append($('<small></small>').addClass('blue').html(v.name));
						
						propertyArr = [
							["型号:", v.no, "grey"],
							["品类:", v.category, "grey"],
							["品牌:", v.brand, "grey"],
							["单位:", v.measurementUnit, "grey"],
							["折扣价:", v.salePrice, "blue"],
							["售价:", v.price, "blue"],
							["数量:", v.num, "blue"],
							["总价:", v.total, "blue"],
							["结算值:", v.prePoint, "blue"],
							["利润:", profitInit(v), "blue"],
							["说明:", v.comment, "grey"],
						];
					}else if(v.packageName != "" && v.packageName != null && v.brand == "-"){
					//}else if(v.level == 0 && v.isLeaf == false){
						$btnValue.html('点位');
						$divBtnWrap.append($btnValue);
						
						$h3.append($('<small></small>').addClass('blue').html("套餐 " + v.name));
						
						propertyArr = [
							["总价:", v.total, "blue"],
							["结算值:", v.prePoint, "blue"],
							["利润:", profitInit(v), "blue"],
						];
					}else{
						materialOrderPreBalanceDetail.packages[v.packageName] ? materialOrderPreBalanceDetail.packages[v.packageName].push(v) : (materialOrderPreBalanceDetail.packages[v.packageName] = [v]);
						
						propertyArr = [
						    ["名称:", v.name, "grey"],
							["型号:", v.no, "grey"],
							["品类:", v.category, "grey"],
							["品牌:", v.brand, "grey"],
							["单位:", v.measurementUnit, "grey"],
							["折扣价:", v.salePrice, "blue"],
							["售价:", v.price, "blue"],
							["数量:", v.num, "blue"],
							["说明:", v.comment, "grey"],
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
	
	searcher.init([], "condList", api.material.queryMaterialItemByMid, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", null, options, true, "materialItems");
	
	$('#import').click(function(){
		
		com.post(api.material.queryMaterialItemByMid, options, function(res){
			
			$.exceler({
				column : [
					["名称","name"],
					['型号','no'],
					['品类','category'],
					['品牌', 'brand'],
					['单位', 'measurementUnit'],
					['折扣价', 'salePrice'],
					['售价', 'price'],
					['数量', 'num'],
					["总价", 'total'],
					["结算值", 'prePoint'],
					["说明", 'comment'],
				],
				list: res.materialItems,
			});
		});
    });
	
	$('#prebalance').click(function(){
		
		var options = {};
		
		options["mids[0]"] = materialOrderPreBalancePostData["materialOrderPreBalance.msoId"];
		
		bootbox.confirm("确定需要提交当前子订单的预结算处理吗?", function(result) {
			if(result){
				com.post(api.material.preBalanceMaterial, options, function(result){
					$("#materialOrderPreBalancePageContent").load(api.index.materialPreBalanceIndex.url);
				}, function(result){
					com.showAlert(com.error, "确认失败!");
				});
			}
		});
	});
	
	$('#back').click(function(){
		$(".tooltip").remove();
		$("#materialOrderPreBalancePageContent").load(api.index.materialPreBalanceIndex.url);
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
		
		options["materialItem.miid"] = v.miid;
		
		bootbox.confirm("确认需要修改当前型号的计算方式?", function(result) {
			if(result){
				com.post(api.material.changeMaterialItemForCaclType, options, function(result){
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
			options["miids[" + i++ + "]"] = rowInfo.miid;
		}else if(!rowInfo.isLeaf){
			
			var _packageItems = materialOrderPreBalanceDetail.packages[rowInfo.packageName];
			
			_packageItems && _packageItems.length > 0 && ($.each(_packageItems, function(i, v){
				options["miids[" + i++ + "]"] = v.miid;
			}));
		}
		
		options["materialItem.prePoint"] = materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value.val();
		options["materialItem.mid"] = materialOrderPreBalanceDetailPostData.tmpItem.msoId;
		
		com.post(api.material.updateMaterialItemForPrePT, options, function(result){
			searcher.doSearch();
		});
		
		materialOrderPreBalanceDetail.materialSubOrderItemBalanceModal.modal("hide");
	}
	
});

