
jQuery(function($) {
	var buildingRecord = {
		recordType: [],
		pattern: [],
		items: {},
		hsid: null,
		csid: null,
		saveBtn: null,
		dataFlag: false,
	};

	buildingRecord.items.hsNo = $("#hsNo");
	buildingRecord.items.csNo = $("#csNo");
	buildingRecord.items.brType = $("#brType");
	buildingRecord.items.pattern = $("#pattern");
	buildingRecord.items.comment = $("#comment");

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

	buildingRecord.saveBtn = $("#saveBtn").on("click", saveData);

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
			var $liLine = $('<li></li>').addClass('item-orange clearfix');
			var noVal;
			params.flag == true ? noVal = v.houseSource.no :  noVal = v.customerSource.no;
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
				["操作人:", v.operater.userName, "grey"],
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
				$('#' + tableId).html(null);
				renderList(tableId,listData);
			},
			drawLine : function(v){
				return creatLine(v);
			}
		}
	})();

	var brField;
	var brOptionId;
	
	if(params.flag){
		//房源
		brOptionId = params.hsid;
		brOptionNo = params.hsNo;
		brField = "hsid";
		$('#fl-statement').statement("房源", "跟进记录");
	}else{
		brOptionId = params.csid;
		brOptionNo = params.csNo;
		brField = "csid";
		$('#fl-statement').statement("客源", "跟进记录");
	}

	var searcher = new Searcher();
	searcher.init([], "condList", api.building.pageBuildingRecord, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "buildingRecordPostData",{"filters[0].data":brOptionId, "filters[0].field":brField,"filters[0].op":"eq"}, false, null, function(){

		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addBuildingRecord').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
		var $addspan = $('<span></span>').text('添加').appendTo($adda);

		var $addb = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'back').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-mail-forward bigger-110').appendTo($addb);
		var $addspan = $('<span></span>').text('返回').appendTo($addb);

		return [$addb, $adda];
	});

	//添加
	$('a[name="addBuildingRecord"]', '#pagenation').click(function(){
		com.cleanItems(buildingRecord.items);

		if(params.flag){
			buildingRecord.items.hsNo.prop("disabled", true);
			buildingRecord.items.hsNo.val(params.hsNo);
		}else{
			buildingRecord.items.csNo.prop("disabled", true);
			buildingRecord.items.csNo.val(params.csNo);
		}

		$("#buildingRecordModal").modal("show");
	});

	//返回
	if(params.flag){
		$('a[name="back"]', '#pagenation').click(function(){
			com.switchPage(api.index.houseSource.url);
		});
	}else{
		$('a[name="back"]', '#pagenation').click(function(){
			com.switchPage(api.index.customerSource.url);
		});
	}

	function saveData(){

		if(buildingRecord.items.hsNo.val() != ""){
			com.post(api.building.queryHouseSourceByNo, {"houseSource.no" : buildingRecord.items.hsNo.val()}, function(res){
				buildingRecord.hsid = res.houseSource.hsid;
				buildingRecord.dataFlag = false;
			}, function(data){
				buildingRecord.dataFlag = true;
				com.showAlert(com.warning, "请正确输入房源编号！");
			}, false);
		}

		if(buildingRecord.items.csNo.val() != ""){
			com.post(api.building.queryCustomerSourceByNo, {"customerSource.no" : buildingRecord.items.csNo.val()}, function(res){
				buildingRecord.csid = res.customerSource.csid;
				buildingRecord.dataFlag = false;
			}, function(data){
				buildingRecord.dataFlag = true;
				com.showAlert(com.warning, "请正确输入客源编号！");
			}, false);
		}

		if(com.validate() || buildingRecord.dataFlag){
			return;
		}

		var options = {
			"buildingRecord.houseSource.hsid" : buildingRecord.hsid,
			"buildingRecord.customerSource.csid" : buildingRecord.csid,
			"buildingRecord.comment" : buildingRecord.items.comment.val(),
			"buildingRecord.type" : buildingRecord.items.brType.val(),
			"buildingRecord.pattern" : buildingRecord.items.pattern.val()
		};

		com.post(api.building.addBuildingRecord, options, function(){
			com.showAlert(com.info, "添加成功！");
			searcher.doSearch();
		});

		$("#buildingRecordModal").modal("hide");
	}
});
