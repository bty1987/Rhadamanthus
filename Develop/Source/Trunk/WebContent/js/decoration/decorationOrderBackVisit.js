
var decorationOrderPostData = {};

$(function(){

	var displayFunc  = (function(){

		var renderList = function(tableId,listData){
			var $tableWrap = $('#' + tableId);
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
			var $liLine = $('<li></li>').addClass('item-orange clearfix');
			var $h3 = $('<h3></h3>').addClass('oid').append($('<b></b>').html(v.orderId));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
			var $btnRevie = $('<a></a>').addClass('btn btn-minier btn-success').html('回访');
			var propertyArr = [
				["楼盘地址:", v.village.cityProper.cityProperName + v.village.villageName + " " + v.houseNumber, "grey"],
				["客户名:", v.customer.customerName, "grey"],
				["余额:", v.freeArea, "grey"],
				["设计部:", v.designDepartment, "grey"],
				["设计师:", v.designer, "grey"],
				["业务部:", v.businessDepartment, "grey"],
				["业务员:", v.salesman, "grey"],
				["面积:", v.houseArea, "grey"],
				["合同报价:", v.orderTotalPrice, "grey"],
				["量房时间:", v.createTime, "grey"],
				["状态:", v.status, "red"]
			];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$btnRevie.click(function(){
				viewDecorationOrderBackVisitIndex(v.orderId+"");
			});

			$divBtnWrap.append($btnRevie).appendTo($h3);

			$liLine.append($h3).append($ulProperty);

			return $liLine;
		};

		return {
			init : function(tableId,listData){
				$('#' + tableId).html(null);
				renderList(tableId,listData);
			}
		}
	})();

	var _condArr = ['orderId', 'village', 'houseNumber', 'houseArea', 'customerPhone', 'designer', 'salesman','houseClass','status'];

	var decorationOrderTimelineSeacher = new Searcher();

<<<<<<< HEAD
	decorationOrderTimelineSeacher.init( _condArr, "condList", api.decoration.pageDecorationOrderForGeneral, function(data){
=======
	decorationOrderTimelineSeacher.init( _condArr, "condList", api.decoration.pageDecorationOrderForDesigner, function(data){
>>>>>>> branch 'master' of https://git.oschina.net/bty1987/Rhadamanthus.git
		displayFunc.init('resultList', data);
	}, "pagenation", "decorationOrderTimelinePostData");

	function viewDecorationOrderBackVisitIndex(decorationOrderId){
		decorationOrderPostData["decorationOrderId"] = decorationOrderId;
		params.historyOrderPage = api.index.decorationOrderBackVisitIndex.url;
		$("#fl-container").load(api.index.backVisitIndex.url);
	}
});



