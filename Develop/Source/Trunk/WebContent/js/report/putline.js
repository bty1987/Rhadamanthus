
var supervisionPostDatas = {};

var	constructionScheduleUrl = [
	api.construction.queryChanConstructionScheduleByOrderId,
	api.construction.queryPutlineConstructionScheduleByOrderId,
	api.construction.queryWaterwayCircuitPowerConstructionScheduleByOrderId,
	api.construction.queryBricklayConstructionScheduleByOrderId,
	api.construction.queryGroundLevelingConstructionScheduleByOrderId,
	api.construction.queryCarpentConstructionScheduleByOrderId,
	api.construction.queryOilConstructionScheduleByOrderId,
	api.construction.queryWaterwayCircuitCheckConstructionScheduleByOrderId,
	api.construction.queryCleaningConstructionScheduleByOrderId
	]

var constructionSchedule = [
	"chanConstructionSchedule",
	"putlineConstructionSchedule",
	"waterwayCircuitPowerConstructionSchedule",
	"bricklayConstructionSchedule",
	"groundLevelingConstructionSchedule",
	"carpentConstructionSchedule",
	"oilConstructionSchedule",
	"waterwayCircuitCheckConstructionSchedule",
	"cleaningConstructionSchedule"
]

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
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.decorationOrder.orderId));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
			var $btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html("查看施工天数");
			$divBtnWrap.append($btnView).appendTo($h3);

			var putlinetime = v.putlineTime;
			var ptime;
			if(putlinetime != null && putlinetime != ""){
				var ctime1 = com.currentTime().split(" ");
				var ctime = ctime1[0];
				ptime = constructionTime(putlinetime, ctime);
			}

			var putlinetime = v.putlineTime;
			var ptime;
			var cs;

			com.post(api.construction.queryConstructionScheduleByOrderId, {"constructionSchedule.orderId": v.decorationOrder.orderId},function(res){
				cs = res.constructionSchedule.schedule;
			},null, false)

			if(cs <  2 || (cs == 2 && putlinetime == undefined)){
				ptime = "未开始放线";
			}else if(cs > 2){
				ptime = "已完成放线";
			}else if(putlinetime != null && putlinetime != ""){
				var ctime1 = com.currentTime().split(" ");
				var ctime = ctime1[0];
				ptime = constructionTime(putlinetime, ctime) + "天";
			}

				var propertyArr = [
				["楼盘名 : ", v.decorationOrder.village.villageName + " " + v.decorationOrder.houseNumber, "grey"],
				["设计师 : ", v.decorationOrder.designer, "grey"],
				["监理 : ", v.decorationOrder.supervisor, "grey"],
				["总价 : ", v.decorationOrder.orderTotalPrice, "blue"],
				["折扣 : ", v.decorationOrder.discount, "blue"],
				["面积 : ", v.decorationOrder.houseArea, "blue"],
				["进度 : ", v.decorationOrder.projectStatus, "red"],
				["施工天数 : ", ptime, "red"],
			];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$btnView.click(function(){
				viewConstructionDaysDetail(v.decorationOrder.orderId);
				$('#daysModal').modal('show');
			});

			$liLine.append($h3).append($ulProperty);

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
	
	ActivitySeacher.init(['orderId', 'village', 'houseNumber', 'designer'], "condList", api.report.pagePutline, function(list){
		displayFunc.init('resultList', list);
	}, "pagenation", "supervisionSeacherPostDatas", params["supervisionPostDatas"]);

	//各环节施工天数
	function viewConstructionDaysDetail(orderId){
		params.orderId = orderId;

		//清除表格的内容
		$("#daysTr").remove();

		var $tr = $("<tr></tr>").prop("id", "daysTr").appendTo("#daysTab");
		var $td = $("<td></td>").appendTo($tr).html("施工天数");

		var constructionOptions = [
			{"chanConstructionSchedule.orderId" : orderId},
			{"putlineConstructionSchedule.orderId" : orderId},
			{"waterwayCircuitPowerConstructionSchedule.orderId" : orderId},
			{"bricklayConstructionSchedule.orderId" : orderId},
			{"groundLevelingConstructionSchedule.orderId" : orderId},
			{"carpentConstructionSchedule.orderId" : orderId},
			{"oilConstructionSchedule.orderId" : orderId},
			{"waterwayCircuitCheckConstructionSchedule.orderId" : orderId},
			{"cleaningConstructionSchedule.orderId" : orderId},
		]

		for(var i = 0; i < 9; i++){
			var $td = $("<td></td>").prop("id","td" + (i + 1)).appendTo($tr);
		}

		var conSchedule;
		com.post(api.construction.queryConstructionScheduleByOrderId, {"constructionSchedule.orderId" : orderId},function(res){
			var con = res.constructionSchedule;
			conSchedule = con.schedule;

			for(var i = 0; i < conSchedule; i++){
				constructionPost(constructionScheduleUrl[i], constructionOptions[i], constructionSchedule[i], "td" + (i+1), i);
			}
		})
	}

	function constructionTime(startTime, endTime){
		var stime = new Date(startTime);
		var etime = new Date(endTime);
		var timeDiff = parseInt(Math.abs(etime - stime) / 1000 / 60 / 60 / 24) + 1;
		return timeDiff;
	}

	function constructionPost(url, options, par, tdi, num){
		if(num == 1){
			com.post(url, options, function(res){
				var putline = res[par];
				com.post(api.construction.queryWaterwayCircuitPowerConstructionScheduleByOrderId, {"waterwayCircuitPowerConstructionSchedule.orderId":params.orderId}, function(data){
					var wcp = data.waterwayCircuitPowerConstructionSchedule;
					var startTime = putline.putlineTime;
					var endTime = wcp.startTime;
					if(startTime != null && startTime != ""){
						var cdays = constructionTime(startTime, endTime);
						$("#td2").html(cdays + "天");
					}
				})
			});
		}else{
			com.post(url, options, function(res){
				var constructionParam = res[par];
				var startTime = constructionParam.startTime;
				var endTime = constructionParam.endTime;
				var cdays = constructionTime(startTime, endTime);
				$("#" + tdi).html(cdays + "天");
			});
		}
	}

});


