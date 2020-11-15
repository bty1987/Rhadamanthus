
jQuery(function($) {
	var buildingRecord = {

		btns: {
			saveBtn: com.focusPage("#saveBtn")
		},
		modals: {
			buildingRecordModal: com.focusPage("#buildingRecordModal")
		},
		items: {
			hsNo: com.focusPage("#hsNo"),
			csNo: com.focusPage("#csNo"),
			brType: com.focusPage("#brType"),
			pattern: com.focusPage("#pattern"),
			comment: com.focusPage("#comment")
		},

		recordType: [],
		pattern: [],
		hsid: null,
		csid: null,
		dataFlag: false,
		currenFlag: params.flag,
		buildingRecordHsno: params.hsNo,
		buildingRecordCsno: params.csNo,
		buildingRecordHsid: params.hsid,
		buildingRecordCsid: params.csid,
		currentPage: params.page
	};

	buildingRecord.btns.saveBtn.on("click", saveData);

	buildingRecord.modals.buildingRecordModal.on("hide.bs.modal", function(){

		com.cleanItems(buildingRecord.items);
		com.closeTip();
	});

	com.post(api.ds.building, {}, function(res){
		buildingRecord.items.brType.bindData(res.recordType, "key", "value");
		buildingRecord.items.pattern.bindData(res.pattern, "key", "value");

		$.each(res.recordType, function(i, v){
			buildingRecord.recordType[i] = v.value;
		});
		$.each(res.pattern, function(i, d){
			buildingRecord.pattern[i] = d.value;
		});
	}, null, false);

	var displayFunc  = (function(){

		var renderList = function(tableId,listData){
			var $tableWrap = com.focusPage('#' + tableId).empty();
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
			var $liLine = $('<li></li>').addClass('item-orange clearfix');
			var noVal;
			buildingRecord.currenFlag == true ? noVal = v.houseSource.no :  noVal = v.customerSource.no;
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(noVal));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			//var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			//var $btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html("无效记录");

			var v_name;
			var h_number;
			v.houseSource.house.village.name == null ? v_name = "" : v_name = v.houseSource.house.village.name;
			v.houseSource.house.houseNumber == null ? h_number = "" : h_number = v.houseSource.house.houseNumber;

			var propertyArr = [
				["记录类型:", buildingRecord.recordType[v.type], "red"],
				["楼盘名:", v_name + " " + h_number, "grey"],
				["客户名:", v.customerSource.customer.name, "grey"],
				["联系方式:", buildingRecord.pattern[v.pattern], "grey"],
				["记录时间:", v.operatTime, "green"],
				["记录信息:", v.comment, "grey"],
				["操作人:", v.operater.userName, "grey"]
			];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			//$divBtnWrap.append($btnView);

			$liLine.append($h3).append($ulProperty);

			//$btnView.click(function(){
			//	//暂时没写
			//	//viewAcceptanceDetailIndex(v.orderId);
			//});

			return $liLine;
		};

		return {
			init : function(tableId,listData){
				com.focusPage('#' + tableId).html(null);
				renderList(tableId,listData);
			},
			drawLine : function(v){
				return creatLine(v);
			}
		}
	})();

	var brField;
	var brOptionId;
	
	if(buildingRecord.currenFlag){
		//房源
		brOptionId = buildingRecord.buildingRecordHsid;
		brOptionNo = buildingRecord.buildingRecordHsno;
		brField = "hsid";
		com.focusPage('#fl-statement').statement("房源", "跟进记录");
	}else{
		brOptionId = buildingRecord.buildingRecordCsid;
		brOptionNo = buildingRecord.buildingRecordCsno;
		brField = "csid";
		com.focusPage('#fl-statement').statement("客源", "跟进记录");
	}

	var searcher = new Searcher();
	searcher.init([], "condList", api.building.queryBuildingRecord, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "buildingRecordPostData",{"filters[0].data":brOptionId, "filters[0].field":brField}, true, "buildingRecords", null);

	//添加
	com.focusPage("#addBuildingRecord").click(function(){
		com.cleanItems(buildingRecord.items);

		if(buildingRecord.currenFlag){
			buildingRecord.items.hsNo.prop("disabled", true);
			buildingRecord.items.hsNo.val(buildingRecord.buildingRecordHsno);
		}else{
			buildingRecord.items.csNo.prop("disabled", true);
			buildingRecord.items.csNo.val(buildingRecord.buildingRecordCsno);
		}

		buildingRecord.modals.buildingRecordModal.modal("show");
	});

	function saveData(){

		if(buildingRecord.items.hsNo.val() != ""){
			com.post(api.building.queryHouseSourceByNo, {"houseSource.no" : buildingRecord.items.hsNo.val()}, function(res){
				buildingRecord.hsid = res.houseSource.hsid;
				buildingRecord.dataFlag = false;
			}, function(data){
				buildingRecord.dataFlag = true;
				com.showAlert(com.warning, "请正确输入房源编号");
			}, false);
		}

		if(buildingRecord.items.csNo.val() != ""){
			com.post(api.building.queryCustomerSourceByNo, {"customerSource.no" : buildingRecord.items.csNo.val()}, function(res){
				buildingRecord.csid = res.customerSource.csid;
				buildingRecord.dataFlag = false;
			}, function(data){
				buildingRecord.dataFlag = true;
				com.showAlert(com.warning, "请正确输入客源编号");
			}, false);
		}

		if(com.validate("buildingRecordModal") || buildingRecord.dataFlag){
			return false;
		}

		var options = {
			"buildingRecord.houseSource.hsid" : buildingRecord.hsid,
			"buildingRecord.customerSource.csid" : buildingRecord.csid,
			"buildingRecord.comment" : buildingRecord.items.comment.val(),
			"buildingRecord.type" : buildingRecord.items.brType.val(),
			"buildingRecord.pattern" : buildingRecord.items.pattern.val()
		};

		com.post(api.building.addBuildingRecord, options, function(){
			com.showAlert(com.info, "添加成功");
			buildingRecord.hsid = null;
			buildingRecord.csid = null;
			searcher.doSearch();
		});

		buildingRecord.modals.buildingRecordModal.modal("hide");
	}
});
