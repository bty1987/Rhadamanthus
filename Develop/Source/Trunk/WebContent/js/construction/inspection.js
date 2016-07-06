
var inspectionPostData = {};

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

			var $btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html("记录");

			var propertyArr = [
				["楼盘名:", v.village.villageName, "grey"],
				["设计部门:", v.designDepartment, "grey"],
				["设计师:", v.designer, "grey"],
				["监理:", v.supervisor, "grey"],
				["面积:", v.houseArea, "grey"],
				["进度:", v.projectStatus, "red"],
			];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$divBtnWrap.append($btnView).appendTo($h3);

			$liLine.append($h3).append($ulProperty);

			$btnView.click(function(){
				viewRecord(v.orderId, v.village.villageName);
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

	var searcher = new Searcher();
	searcher.init(['orderId', 'village', 'designer', 'salesman', 'supervisor', 'schedule'], "condList", api.construction.pageDecorationOrderForConstructionSchedule, function(list){
		displayFunc.init('resultList', list);
	}, "pagenation", "inspectionSeacherSeacherPostData", params["inspectionPostData"]);

	function viewRecord(orderId, orderAddr){
		inspectionPostData["inspectionRecord.orderId"] = orderId;
		inspectionPostData["inspectionRecord.orderAddr"] = orderAddr;
		$("#inspectionPageContent").load(api.index.inspectionRecordIndex.url);
	}

});
