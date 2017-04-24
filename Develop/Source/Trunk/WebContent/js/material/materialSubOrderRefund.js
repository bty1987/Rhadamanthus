var materialSubOrderRefund = {
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	materialSubOrderRefundItems: {},
	
	editFlag: false,
	
	packages: {},
};

var materialSubOrderRefundPostData = {};

var materialSubOrderRefundData = [];

jQuery(function($) {
	$('#fl-statement').statement("主材子订单", "退款信息");
	
	materialSubOrderRefund.saveBtn = $("#saveBtn");
	materialSubOrderRefund.cancelBtn = $("#cancelBtn");
	
	materialSubOrderRefundPostData["materialSubOrderRefund.msoId"] = materialSubOrderPostData["materialSubOrder.msoId"];
	materialSubOrderRefundPostData["materialSubOrderRefund.customerName"] = materialSubOrderPostData["materialSubOrder.customerName"];
	
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
					
					var $label = $('<label></label>');
					var $input = $('<input>').attr({
						"type": "checkbox",
						"name": "idents",
						"class": "ace ace-checkbox-2",
						"ident": v.ident,
					}).val(v.arId);
					var $span = $('<span></span>').addClass('lbl');
					
					var propertyArr = [];
					
					if(v.level == 0 && v.isLeaf == true){
						$label.append($input).append($span).appendTo($h3);
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
						$label.append($input).append($span).appendTo($h3);
						$h3.append($('<small></small>').addClass('blue').html("套餐 " + v.packageName));
						
						propertyArr = [
							["总价:", v.total, "green"],
							["预结算值:", v.prePoint, "grey"],
							["结算值:", v.postPoint, "grey"],
						];
					}else{
						materialSubOrderRefund.packages[v.packageName] ? materialSubOrderRefund.packages[v.packageName].push(v) : (materialSubOrderRefund.packages[v.packageName] = [v]);
						
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
	
	searcher.init([], "condList", api.material.queryMaterialSubOrderRefundByMsoId, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", null, materialSubOrderRefundPostData, true, "materialSubOrderRefunds");
	
	$("#back").on("click", function(){
		com.switchPage(api.index.materialSubOrderIndex.url);
	});
	
	$("#import").on("click", function(){
		com.post(api.material.queryMaterialSubOrderRefundByMsoId, materialSubOrderRefundPostData, function(res){
			
			$.exceler({
				column : [
					["名称","materialModelName"],
					['品类',"materialTypeName"],
					['品牌','materialBrandName'],
					['单位','measurementUnitName'],
					['折扣','salePrice'],
					['售价', 'price'],
					['数量', 'num'],
					['总价', 'total'],
					['说明', 'des'],
				],
				list: res.materialSubOrderRefunds,
			});
		});
	});
	
	$("#print").on("click", function(){
		
		var url = api.index.materialSubOrderReceipt.url + "?type=2&materialSubOrder.msoId=" + materialSubOrderRefundPostData["materialSubOrderRefund.msoId"] + "&time=" + params.loginTime;
		
		var $inputs = $('input[name="idents"]:checked');
		
		$inputs && $inputs.length > 0 && ($.each($inputs, function(i, v){
	    	 url += "&idents[" + i + "]=" + $(v).attr('ident');
	    	 
		 }), window.open(url));
	});
	
	function cancelMaterialSubOrderRefund(v){
		
		var url = "";
		var options = {};
			
		if(v.isLeaf){
			url = api.material.cancelMaterialSubOrderRefundForModel;
			options["materialSubOrderRefund.msorId"] = v.msorId;
		}else{
			url = api.material.cancelMaterialSubOrderRefundForPackage;
			options["msoId"] = v.msoId;
			
			var _packageItems = materialOrderPostBalanceDetail.packages[rowInfo.packageName];
			
			_packageItems && _packageItems.length > 0 && ($.each(_packageItems, function(i, v){
				options["msorIds[" + i++ + "]"] = v.msorId;
			}));
		}
		
		com.post(url, options, function(result){
			searcher.doSearch();
		});
	}
	
});

