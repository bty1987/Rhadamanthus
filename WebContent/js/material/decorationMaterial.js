
jQuery(function($) {
	params.materialUrl = api.material.pageMaterialByUserId;
	if(params['urlLoadParams'].type == 'advance'){
		params.materialUrl = api.material.pageMaterialForAdvance;
	}
	var materialOrder = {
		modal: null,
		materialOrderItems: {},

		msoId: null,
		saleType: null,

		editFlag: false
	};

	$('#fl-statement').statement("主材订单", "订单信息列表");

	var displayFunc  = (function(){

		var renderList = function(tableId,listData){
			var $tableWrap = $('#' + tableId);
			var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

			if(listData && listData.length){
				$.each(listData,function(i, v){
					var $liLine = $('<li></li>').addClass('item-orange clearfix');
					var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
					var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
					var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
					var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

					var $btnSub = $('<a></a>').addClass('btn btn-minier btn-yellow').html('子订单');
					var $btnSale = $('<a></a>').addClass('btn btn-minier btn-success').html('销售订单');

					var propertyArr = [
						["楼盘地址:", v.house.village.name + " " + v.house.houseNumber, "grey"],
						["客户名:", v.customer.name, "grey"],
						["设计部:", v.designer.dept.deptName, "grey"],
						["设计师:", v.designer.currentName, "grey"],
						["监理:", v.supervisor.currentName, "grey"],
						["业务员:", v.salesman.currentName, "grey"],
						["面积:", v.house.buildArea, "blue"]
					];

					$.each(propertyArr, function (index,value) {
						var $liProperty = $('<li></li>');
						$('<strong></strong>').html(value[0]).appendTo($liProperty);
						$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
						$liProperty.appendTo($ulProperty);
					});

					$btnSub.click(function(){
						viewMaterialIndex(v);
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

	searcher.init(["orderId", "village", "houseNumber", "designer", "salesman"], "condList", api.decoration.pageDecorationForGeneral, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "materialOrderPostData");

	function viewMaterialIndex(v){
		params.orderId = v.orderId;
		params.customerId = v.customer.cid;
		params.customerName = v.customer.name;
		params.orderAddr = v.house.village.name + " " + v.house.houseNumber;
		params.designerId = v.designer.userId;
		params.designerName = v.designer.currentName;

		com.switchPage(api.index.materialIndex.url);
	}

	function viewMaterialSaleOrderIndex(v){
		params.orderId = v.orderId;
		params.customerId = v.customer.cid;
		params.customerName = v.customer.name;
		params.orderAddr = v.house.village.name + " " + v.house.houseNumber;
		params.designerId = v.designer.userId;
		params.designerName = v.designer.currentName;
		params.hid = v.house.hid;

		params.saleType = "sale";

		params.historyOrderPage = api.index.decorationMaterialIndex.url;

		com.switchPage(api.index.materialSaleIndex.url);
	}

});

