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
	com.focusPage('#fl-statement').statement("主材子订单", "退款信息");
	
	materialSubOrderRefund.saveBtn = com.focusPage("#saveBtn");
	materialSubOrderRefund.cancelBtn = com.focusPage("#cancelBtn");
	
	materialSubOrderRefundPostData["materialRefund.mid"] = materialSubOrderPostData["materialSubOrder.msoId"];
	materialSubOrderRefundPostData["materialRefund.customer.name"] = materialSubOrderPostData["materialSubOrder.customerName"];
	
	var displayFunc  = (function(){

		var renderList = function(tableId,listData){
			var $tableWrap = com.focusPage('#' + tableId);
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
					
					//if(v.level == 0 && v.isLeaf == true){
					if(v.packageName == "" || v.packageName == null){
						$label.append($input).append($span).appendTo($h3);
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
							//["预结值:", v.prePoint, "grey"],
							//["结算值:", v.postPoint, "grey"],
							["说明:", v.comment, "grey"],
						];


					//}else if(v.level == 0 && v.isLeaf == false){
					}else if(v.packageName != "" && v.packageName != null && v.brand == "-"){
						$label.append($input).append($span).appendTo($h3);
						$h3.append($('<small></small>').addClass('blue').html("套餐 " + v.packageName));

						propertyArr = [
							["总价:", v.total, "blue"],
							//["预结值:", v.prePoint, "grey"],
							//["结算值:", v.postPoint, "grey"],
						];
					}else{
						materialSubOrderRefund.packages[v.packageName] ? materialSubOrderRefund.packages[v.packageName].push(v) : (materialSubOrderRefund.packages[v.packageName] = [v]);

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
					
					$liLine.append($h3).append($ulProperty).append($divBtnBlock).appendTo($ul);
				});

				$ul.appendTo($tableWrap);
			}
		};
		
		return {
			init : function(tableId,listData){
				com.focusPage('#' + tableId).html(null);
				renderList(tableId,listData);
			}
		};
	})();
	
	var searcher = new Searcher();
	
	searcher.init([], "condList", api.material.queryMaterialRefundByMid, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", null, materialSubOrderRefundPostData, true, "materialRefunds");
	
	com.focusPage("#back").on("click", function(){
		com.switchPage(api.index.materialIndex.url);
	});
	
	com.focusPage("#import").on("click", function(){
		com.post(api.material.queryMaterialRefundByMid, materialSubOrderRefundPostData, function(res){
			
			$.exceler({
				column : [
					["名称","name"],
					['品类',"category"],
					['品牌','brand'],
					['单位','measurementUnit'],
					['折扣','salePrice'],
					['售价', 'price'],
					['数量', 'num'],
					['总价', 'total'],
					['说明', 'comment'],
				],
				list: res.materialRefunds,
			});
		});
	});
	
	com.focusPage("#print").on("click", function(){

		var idents = "";
		var $inputs = com.focusPage('input[name="idents"]:checked');

		$inputs && $inputs.length > 0 && ($.each($inputs, function(i, v){
			idents += "&idents[" + i + "]=" + $(v).attr('ident');
		}));

		params.idents = idents;
		params.type = 2;
		params.materialSubOrderMsoId = materialSubOrderRefundPostData["materialRefund.mid"];

		var url = api.index.materialReceipt.url ;
		com.popup("主材销售收据", url, function () {
			parent.layer.getFrameIndex(window.name);
		}, null, true);

	});
	
	function cancelMaterialSubOrderRefund(v){
		
		var url = "";
		var options = {};
			
		if(v.isLeaf){
			url = api.material.cancelMaterialRefundForModel;
			options["materialSubOrderRefund.msorId"] = v.msorId;
		}else{
			url = api.material.cancelMaterialRefundForPackage;
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

