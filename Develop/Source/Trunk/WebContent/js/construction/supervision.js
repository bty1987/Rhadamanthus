

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
			var $btnAddReduce = $('<a></a>').addClass('btn btn-minier btn-primary').html('增减项');
			var $btnRe = $('<a></a>').addClass('btn btn-minier btn-primary').html('返工');


			var propertyArr = [
				["楼盘名:", v.village.villageName, "grey"],
				["设计师:", v.designer, "grey"],
				["监理:", v.supervisor, "grey"],
				["总价:", v.orderTotalPrice, "grey"],
				["折扣:", v.discount, "grey"],
				["面积:", v.houseArea, "grey"],
				["工程状态:", v.projectStatus, "grey"],
				["进度:", scheduleInit(v)]
			];



			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});


			$divBtnWrap.append($btnView).append($btnAddReduce).append($btnRe).appendTo($h3);

			$liLine.append($h3).append($ulProperty);




			$btnView.click(function(){
				viewSupervisionDetail(v.orderId);
			});

			$btnAddReduce.click(function(){
				viewAddReduceIndex(v.orderId);
			});

			$btnRe.click(function(){
				viewReworkIndex(v.orderId);
			});


			return $liLine;
		};

		var scheduleInit = function(v) {

			var scheduleInfos = {
				"铲大白": [10, "progress-bar-inverse"],
				"放线": [10, "progress-bar-grey"],
				"水电力": [20, "progress-bar-danger"],
				"瓦工": [10, "progress-bar-pink"],
				"地面找平": [10, "progress-bar-purple"],
				"木工": [10, "progress-bar-warning"],
				"油工": [10, "progress-bar-yellow"],
				"水电验收": [10, "progress-bar-success"],
				"保洁": [10, "progress-bar-progress"]
			};

			var $process = $('<div></div>').attr({
				'data-percent' : v.projectStatus
			}).css({
				'margin-bottom' : '0px',
				'width' : '150px',
				'display' : 'inline-block',
				'vertical-align' : 'middle',
			}).addClass('progress');


			$.each(scheduleInfos, function(k, val){
				if(k == v.projectStatus) return false;
				var $div = $('<div></div>').css({
					'width' : val[0] + '%'
				}).addClass('progress-bar ' + val[1]);
				$div.appendTo($process);
			});

			return $process;
		}

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

	var _condArr = ['orderId', 'village', 'houseNumber', 'designer', 'schedule', 'projectStatusFlag'];
	var ActivitySeacher = new Searcher();
	ActivitySeacher.init( _condArr, "condList", api.construction.pageDecorationOrderForSupervisionByUserId, function(list){
		displayFunc.init('resultList', list);
	}, "pagenation", "supervisionSeacherPostData", params["supervisionPostData"]);







});

function viewSupervisionDetail(orderId){
	supervisionPostData["constructionSchedule.orderId"] = orderId;
	$("#supervisionPageContent").load(api.index.supervisionDetailIndex.url);
}

function viewAddReduceIndex(orderId){
	supervisionPostData["addReduce.orderId"] = orderId;
	$("#supervisionPageContent").load(api.index.supervisionAddReduceIndex.url);
}

function viewReworkIndex(orderId){
	supervisionPostData["rework.orderId"] = orderId;
	$("#supervisionPageContent").load(api.index.supervisionReworkIndex.url);
}