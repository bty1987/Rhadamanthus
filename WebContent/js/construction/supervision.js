
var supervisionPostData = {};

$(function(){

	var displayFunc  = (function(){

		var renderList = function(tableId,listData){
			var $tableWrap = $('#' + tableId).empty();
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
			var that = this;
			var $liLine = $('<li></li>').addClass('item-blue clearfix');
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html("查看");
			var $btnAddReduce = $('<a></a>').addClass('btn btn-minier btn-purple').html('增减项');
			var $btnRe = $('<a></a>').addClass('btn btn-minier btn-primary').html('返工');
			var $btnMoney = $('<a></a>').addClass('btn btn-minier btn-inverse').html('扣款');

			var propertyArr = [
				["楼盘名:", v.house.village.name + " " + v.house.houseNumber, "grey"],
				["设计师:", v.designer.userName, "grey"],
				["监理:", v.supervisor.userName, "grey"],
				["总价:", v.orderTotalPrice, "blue"],
				//["折扣:", v.discount, "blue"],
				["面积:", v.house.buildArea, "blue"],
				["进度:", v.projectStatus, "red"],
			];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$divBtnWrap.append($btnView).append($btnAddReduce).append($btnRe).append($btnMoney).appendTo($h3);

			$liLine.append($h3).append($ulProperty);

			$btnView.click(function(){
				viewSupervisionDetail(v.orderId);
			});

			$btnAddReduce.click(function(){
				viewAddReduceIndex(v.orderId,v.type);
			});

			$btnRe.click(function(){
				viewReworkIndex(v.orderId);
			});

			$btnMoney.click(function(){
				viewDelGold(v.orderId);
			});

			return $liLine;
		};

		return {
			init : function(tableId,listData){
				$('#' + tableId).html(null);
				renderList(tableId,listData);
			},
			drawLine : function(v){
				return creatLine(v);
			}
		}
	})();

	var ActivitySeacher = new Searcher();
	
	ActivitySeacher.init(['c_orderId', 'c_village', 'c_houseNumber', 'c_designer', 'c_schedule', 'c_projectStatusFlag'], "condList", api.construction.pageDecorationForConstruction, function(list){
		displayFunc.init('resultList', list);
	}, "pagenation", "supervisionSeacherPostData", params["supervisionPostData"]);
	
	function viewSupervisionDetail(orderId){
		params.orderId = orderId;
		com.switchPage(api.index.supervisionDetailIndex.url);
	}

	function viewAddReduceIndex(orderId, type){
		params.decorationOrderId = orderId;
	    params.decorationOrderType = type;
		params.historyPage = api.index.supervisionIndex.url;
	    com.switchPage(api.index.addReduceIndex.url);
	}

	function viewReworkIndex(orderId){
		params.orderId = orderId;
		com.switchPage(api.index.supervisionReworkIndex.url);
	}

	function viewDelGold(orderId){
		params['decorationOrderId'] = orderId;
		params['auditStatusType'] = 'select';
		params['historyPage'] = api.index.supervisionIndex.url;
		com.switchPage(api.index.auditRecordIndex.url);
	}

});
