var qualityTesting = {
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	qualityTestingItems: {},
	
	editFlag: false
};

var qualityTestingPostData = {};

jQuery(function($) {
	$('#fl-statement').statement("质检控制", "订单信息列表");
	
	qualityTesting.saveBtn = $("#saveBtn").on("click", saveData);
	qualityTesting.cancelBtn = $("#cancelBtn");
	qualityTesting.modal = $("#qualityTestingModal");
	
	if(!params["qualityTestingPostData"]){
		params["qualityTestingPostData"] = {
			"filters[0].data": "notAllocationed",
			"filters[0].field": "allocationWorkerFlag",
			"filters[0].op": "cn",
		};
	}
	

	
	$('.date-picker').datepicker({autoclose:true});
	$('[data-rel=popover]').popover({html:true});


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
			var $btnRecord = $('<a></a>').addClass('btn btn-minier btn-danger').html("记录");


			var propertyArr = [
				["楼盘名:", v.village.villageName, "grey"],
				["设计师:", v.designer, "grey"],
				["监理:", v.supervisor, "grey"],
				["面积:", v.houseArea, "grey"],
				["工程状态:", v.schedule, "grey"],
				["进度:", scheduleInit(v)]
			];


			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});


			$divBtnWrap.append($btnView).append($btnRecord).appendTo($h3);

			$liLine.append($h3).append($ulProperty);




			$btnView.click(function(){
				viewQualityTestingDetailIndex(v.orderId);
			});

			$btnRecord.click(function(){
				viewQualityTestingRecord(v.orderId, v.village.villageName)
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

	var _condArr = ['orderId', 'village', 'designer', 'salesman', 'supervisor', 'allocationWorkerFlag'];
	var QualityTestingSeacher = new Searcher();
	QualityTestingSeacher.init( _condArr, "condList", api.construction.pageDecorationOrderForQualityByUserId, function(list){
		displayFunc.init('resultList', list);
	}, "pagenation", "qualityTestingSeacherSeacherPostData", params["qualityTestingPostData"]);


	function villageInit(cellvalue, options, rowdata){
		var html = rowdata.village.villageName + ' '+rowdata.houseNumber;
		return html;
	}

	function actionInit(cellvalue, options, rowdata){

		var result = '';

		result += '<div class="ui-pg-div btn-group">';
		result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="viewQualityTestingDetailIndex(\'' + rowdata.orderId + '\');">查看</button>';
		result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-danger" onclick="viewQualityTestingRecord(\'' + rowdata.orderId + '\', \'' + rowdata.village.villageName + '\');">记录</button>';
		result += '</div>';

		return result;
	}

	function scheduleInit(cellvalue, options, rowdata){
		var result = '';
		result += '<div class="progress" style="margin-bottom: 0px;" data-percent="力工">';

		if(cellvalue == 1){
			result += '<div style="width: 10%;" class="progress-bar progress-bar-success"></div>';
			result += '<div style="width: 10%;" class="progress-bar progress-bar-warning"></div>';
			result += '<div style="width: 10%;" class="progress-bar progress-bar-danger"></div>';
		}

		result += '</div>';

		return result;
	}

	function saveData(){

	}

	function viewQualityTestingDetailIndex(orderId){
		qualityTestingPostData["constructionSchedule.orderId"] = orderId;
		$("#qualityTestingPageContent").load(api.index.qualityTestingDetailIndex.url);
	}

	function viewQualityTestingRecord(orderId, orderAddr){
		qualityTestingPostData["qualityTestingRecord.orderId"] = orderId;
		qualityTestingPostData["qualityTestingRecord.orderAddr"] = orderAddr;
		$("#qualityTestingPageContent").load(api.index.qualityTestingRecordIndex.url);
	}


});


