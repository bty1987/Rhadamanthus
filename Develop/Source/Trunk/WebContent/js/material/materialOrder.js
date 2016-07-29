
var materialOrder = {
	modal: null,
	materialOrderItems: {},
	
	msoId: null,
	saleType: null,
	
	editFlag: false
};

var materialOrderPostData = {};

jQuery(function($) {
	$('#fl-statement').statement("主材订单", "订单信息列表");
	
	var displayFunc  = (function(){

		var renderList = function(tableId,listData){
			var $tableWrap = $('#' + tableId);
			var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

			if(listData && listData.length){
				$.each(listData,function(i, v){
					var $liLine = $('<li></li>').addClass('item-orange clearfix');
					var $h3 = $('<h3></h3>').addClass('oid').append($('<b></b>').html(v.orderId));
					var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
					var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
					var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

					var $btnSub = $('<a></a>').addClass('btn btn-minier btn-primary').html('子订单');
					var $btnSale = $('<a></a>').addClass('btn btn-minier btn-success').html('销售订单');
					
					var propertyArr = [
						["楼盘地址:", v.village.villageName + " " + v.houseNumber, "grey"],
						["客户名:", v.customer.customerName, "grey"],
						["设计部:", v.designDepartment, "grey"],
						["设计师:", v.designer, "grey"],
						["监理:", v.supervisor, "grey"],
						["业务员:", v.salesman, "grey"],
						["面积:", v.houseArea, "blue"],
					];

					$.each(propertyArr, function (index,value) {
						var $liProperty = $('<li></li>');
						$('<strong></strong>').html(value[0]).appendTo($liProperty);
						$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
						$liProperty.appendTo($ulProperty);
					});

					$btnSub.click(function(){
						viewMaterialSubOrderIndex(v);
					});
					
					$btnSale.click(function(){
						viewMaterialSaleOrderIndex(v);
					});

					$divBtnWrap.append($btnSub).append($btnSale).appendTo($h3);
					
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
	
	searcher.init(["orderId", "village", "houseNumber", "customerPhone", "designer", "salesman"], "condList", api.decoration.pageDecorationOrderForMaterial, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "materialOrderPostData");
	
	function viewMaterialSubOrderIndex(v){
		materialOrderPostData["materialOrder.orderId"] = v.orderId;
		materialOrderPostData["materialOrder.customerId"] = v.customer.customerId;
		materialOrderPostData["materialOrder.customerName"] = v.customer.customerName;
		materialOrderPostData["materialOrder.orderAddr"] = v.village.villageName + " " + v.houseNumber;
		materialOrderPostData["materialOrder.designerId"] = v.designerId;
		materialOrderPostData["materialOrder.designerName"] = v.designer;
		
		$("#materialOrderPageContent").load(api.index.materialSubOrderIndex.url);
	}

	function viewMaterialSaleOrderIndex(v){
		materialOrderPostData["materialOrder.orderId"] = v.orderId;
		materialOrderPostData["materialOrder.customerId"] = v.customer.customerId;
		materialOrderPostData["materialOrder.customerName"] = v.customer.customerName;
		materialOrderPostData["materialOrder.orderAddr"] = v.village.villageName + " " + v.houseNumber;
		materialOrderPostData["materialOrder.designerId"] = v.designerId;
		materialOrderPostData["materialOrder.designerName"] = v.designer;
		
		materialOrder.saleType = "sale";
		
		params.historyOrderPage = api.index.materialOrderIndex.url;
		
		$("#materialOrderPageContent").load(api.index.materialSaleOrderIndex.url);
	}
	
});

