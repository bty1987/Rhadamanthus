
jQuery(function($) {

	var houseSourceDetail = {
		houseSourceDetails: {},
		saveBtn: null,
		cancelBtn: null,
		houseBtn: null,
		modal: null,
		housingGrade: ["A", "B", "C", "D"],
		history: ["正常", "特殊"],
		relationshipType: [],
		hsType: [],
		discussType: [],
		decorateDegree: [],
		elevator: [],
		onlyHousing: [],
		allowLoan: [],
		beingLoan: [],
		sourceType: [],
		houseType: [],
		through: [],
		orientation: [],
		waterVapour: [],
		parlourType: [],
		heatingType: [],
		rentType: [],
		items: {},
		houseItems: {},
		editFlg: false,
		buildingJson:null,
		validator: {},
	};

	var colorboxArgs = {
		reposition:true,
		scalePhotos:true,
		scrolling:false,
		previous:'<i class="icon-arrow-left"></i>',
		next:'<i class="icon-arrow-right"></i>',
		close:'&times;',
		current:'{current} of {total}',
		maxWidth:'100%',
		maxHeight:'100%'
	}

	$.extend(com.validator, houseSourceDetail.validator);

	$(".date-picker").datepicker({autoclose: !0}).on("show",function() {
		setTimeout(function() {
			$(".dropdown-menu").css("z-index", 1060)
		},0)
	}).next().on(ace.click_event,function() {
		a(this).prev().focus()
	});

	var tag_input = $("#indoores");

	tag_input.tag({
		placeholder:tag_input.attr('placeholder'),
		isStaticResource : false,
		flsource: {
			url : null,
			postData : {},
			resultList : "autoFillKeyValue",
			keyPath : "key",
			valuePath : "value",
			isResultTypeMap : true, //是否是key - value 形式的列表
		},
	});

	$("#history").bindData(houseSourceDetail.history);
	$("#housingGrade").bindData(houseSourceDetail.housingGrade);

	if(!(params.page == "query")){
		var $btnSave = $("<a>保存</a>").addClass("btn btn-primary icon-ok").prop("id", "saveBtn").css("padding", "4px 8px");
		$("#btnDiv").append($btnSave);
	}

	houseSourceDetail.saveBtn = $("#saveBtn").on("click", updateHouseSource);
	houseSourceDetail.backBtn = $("#backBtn");
	houseSourceDetail.houseBtn = $("#houseBtn").on("click", function(){
		$("#houseData").toggle();
	});

	$('#backBtn').on(ace.click_event, function(){
		switch(params.page)
		{
			case "houseSource":
				com.switchPage(api.index.houseSource.url);
				break;
			case "advance":
				com.switchPage(api.index.houseSourceAdvance.url);
				break;
			case "pool":
				com.switchPage(api.index.houseSourcePool.url);
				break;
			case "query":
				com.switchPage(api.index.houseSourceQuery.url);
				break;
		}
	});

	houseSourceDetail.items.customerId = $("#customerId");
	houseSourceDetail.items.customerPhone = $("#customerPhone");
	houseSourceDetail.items.no = $("#no");
	houseSourceDetail.items.houseNumber = $("#houseNumber");
	houseSourceDetail.items.hsType = $("#hsType");
	houseSourceDetail.items.sourceType = $("#sourceType");
	houseSourceDetail.items.deedNum = $("#deedNum");
	houseSourceDetail.items.deedValue = $("#deedValue");
	houseSourceDetail.items.unitPrice = $("#unitPrice");
	houseSourceDetail.items.totalPrice = $("#totalPrice");
	houseSourceDetail.items.decorateTime = $("#decorateTime");
	houseSourceDetail.items.decorateDegree = $("#decorateDegree");
	houseSourceDetail.items.discussType = $("#discussType");
	houseSourceDetail.items.rentType = $("#rentType");
	houseSourceDetail.items.indoores = $("#indoores");
	houseSourceDetail.items.history = $("#history");
	houseSourceDetail.items.propertyFee = $("#propertyFee");
	houseSourceDetail.items.elevator = $("#elevator");
	houseSourceDetail.items.onlyHousing = $("#onlyHousing");
	houseSourceDetail.items.documentsDate = $("#documentsDate");
	houseSourceDetail.items.allowLoan = $("#allowLoan");
	houseSourceDetail.items.beingLoan = $("#beingLoan");
	houseSourceDetail.items.checkingTime = $("#checkingTime");
	houseSourceDetail.items.followId = $("#followId");
	houseSourceDetail.items.keyerId = $("#keyerId");
	houseSourceDetail.items.housingGrade = $("#housingGrade");
	houseSourceDetail.items.comment = $("#comment");

	houseSourceDetail.houseItems.village = $("#village");
	houseSourceDetail.houseItems.no = $("#no");
	houseSourceDetail.houseItems.houseNumber = $("#houseNumber");
	houseSourceDetail.houseItems.type = $("#type");
	houseSourceDetail.houseItems.buildArea = $("#buildArea");
	houseSourceDetail.houseItems.maxFloor = $("#maxFloor");
	houseSourceDetail.houseItems.through = $("#through");
	houseSourceDetail.houseItems.houseType = $("#houseType");
	houseSourceDetail.houseItems.orientation = $("#orientation");
	houseSourceDetail.houseItems.feature = $("#feature");
	houseSourceDetail.houseItems.waterVapour = $("#waterVapour");
	houseSourceDetail.houseItems.parlourType = $("#parlourType");
	houseSourceDetail.houseItems.heatingType = $("#heatingType");

	com.post(api.ds.building, {}, function(res){
		houseSourceDetail.items.discussType.bindData(res.discussType, "key", "value");
		houseSourceDetail.items.decorateDegree.bindData(res.decorateDegree, "key", "value");
		houseSourceDetail.items.elevator.bindData(res.elevator, "key", "value");
		houseSourceDetail.items.onlyHousing.bindData(res.onlyHousing, "key", "value");
		houseSourceDetail.items.allowLoan.bindData(res.allowLoan, "key", "value");
		houseSourceDetail.items.beingLoan.bindData(res.beingLoan, "key", "value");
		houseSourceDetail.items.sourceType.bindData(res.sourceType, "key", "value");
		houseSourceDetail.items.allowLoan.bindData(res.allowLoan, "key", "value");
		houseSourceDetail.items.beingLoan.bindData(res.beingLoan, "key", "value");
		houseSourceDetail.items.rentType.bindData(res.rentType, "key", "value");

		$.each(res.hsType, function (i,va) {
			houseSourceDetail.hsType[va.key] = va.value;
		});
		$.each(res.houseType, function (i,val) {
			houseSourceDetail.houseType[val.key] = val.value;
		});
		$.each(res.discussType, function (i,val) {
			houseSourceDetail.discussType[val.key] = val.value;
		});
		$.each(res.decorateDegree, function (i,val) {
			houseSourceDetail.decorateDegree[val.key] = val.value;
		});
		$.each(res.elevator, function (i,val) {
			houseSourceDetail.elevator[val.key] = val.value;
		});
		$.each(res.onlyHousing, function (i,val) {
			houseSourceDetail.onlyHousing[val.key] = val.value;
		});
		$.each(res.sourceType,function (i,va) {
			houseSourceDetail.sourceType[va.key] = va.value;
		});
		$.each(res.waterVapour,function (i,val) {
			houseSourceDetail.waterVapour[val.key] = val.value;
		});
		$.each(res.parlourType,function (i,val) {
			houseSourceDetail.parlourType[val.key] = val.value;
		});
		$.each(res.heatingType,function (i,val) {
			houseSourceDetail.heatingType[val.key] = val.value;
		});
		$.each(res.through,function (i,val) {
			houseSourceDetail.through[val.key] = val.value;
		});
		$.each(res.allowLoan,function (i,val) {
			houseSourceDetail.allowLoan[val.key] = val.value;
		});
		$.each(res.beingLoan,function (i,val) {
			houseSourceDetail.beingLoan[val.key] = val.value;
		});
		$.each(res.orientation, function (i,v) {
			houseSourceDetail.orientation[v.key] = v.value;
		});
		$.each(res.rentType, function (i,v) {
			houseSourceDetail.rentType[v.key] = v.value;
		});

	}, null, false);

	com.post(api.ds.data, {}, function(data){
		$.each(data.relationshipType,function (i,val) {
			houseSourceDetail.relationshipType[i] = val.value;
		});
	}, null, false);

	//查询房源信息
	com.post(api.building.queryHouseSourceByHsid, {"houseSource.hsid" : params.drawingId}, function(res){
		bindHouseSourceData(res.houseSource);
		bindHouseData(res.houseSource.house);
	}, null, false);

	houseSourceDetail.modal = $("#houseSourceDetailModal");
	houseSourceDetail.modal.on('show.bs.modal',function(e){
		com.clearValidator();
	});

	$.extend(com.validator, houseSourceDetail.validator);

	//编辑
	function updateHouseSource(){
		if(params.hsStatus != 3){
			com.showAlert(com.warning, "只有已通过房源可以修改房源信息！");
			return;
		}

		if(com.validate()){
			return;
		}

		var options = {};
		options["houseSource.hsid"] = params.drawingId;
		options["houseSource.keyer.userId"] = houseSourceDetail.items.keyerId.val();
		options["houseSource.sourceType"] = houseSourceDetail.items.sourceType.val();
		options["houseSource.deedNum"] = houseSourceDetail.items.deedNum.val();
		options["houseSource.deedValue"] = houseSourceDetail.items.deedValue.val();
		options["houseSource.unitPrice"] = houseSourceDetail.items.unitPrice.val();
		options["houseSource.totalPrice"] = houseSourceDetail.items.totalPrice.val();
		options["houseSource.decorateTime"] = houseSourceDetail.items.decorateTime.val();
		options["houseSource.decorateDegree"] = houseSourceDetail.items.decorateDegree.val();
		options["houseSource.discussType"] = houseSourceDetail.items.discussType.val();
		options["houseSource.rentType"] = houseSourceDetail.items.rentType.val();
		options["houseSource.indoores"] = houseSourceDetail.items.indoores.val();
		options["houseSource.history"] = houseSourceDetail.items.history.val();
		options["houseSource.propertyFee"] = houseSourceDetail.items.propertyFee.val();
		options["houseSource.elevator"] = houseSourceDetail.items.elevator.val();
		options["houseSource.onlyHousing"] = houseSourceDetail.items.onlyHousing.val();
		options["houseSource.documentsDate"] = houseSourceDetail.items.documentsDate.val();
		options["houseSource.allowLoan"] = houseSourceDetail.items.allowLoan.val();
		options["houseSource.beingLoan"] = houseSourceDetail.items.beingLoan.val();
		options["houseSource.checkingTime"] = houseSourceDetail.items.checkingTime.val();
		options["houseSource.housingGrade"] = houseSourceDetail.items.housingGrade.val();
		options["houseSource.comment"] = houseSourceDetail.items.comment.val();

		com.post(api.building.updateHouseSource, options, function(res){
			com.showAlert(com.info, "成功修改房源信息");
		},function(data){
			com.showAlert(com.error, data.errorMsg);
		});

		$("#houseSourceDetailModal").modal("hide");
	}

	function bindHouseData(houses){
		houseSourceDetail.houseItems.village.val(houses.village.name);
		houseSourceDetail.houseItems.no.val(houses.village.name + " " + houses.houseNumber);
		houseSourceDetail.houseItems.type.val(houseSourceDetail.houseType[houses.type]);
		houseSourceDetail.houseItems.buildArea.val(houses.buildArea);
		houseSourceDetail.houseItems.maxFloor.val(houses.maxFloor);
		houseSourceDetail.houseItems.feature.val(houses.feature);
		houseSourceDetail.houseItems.through.val(houseSourceDetail.through[houses.through]);
		houseSourceDetail.houseItems.houseType.val(houses.houseType);
		houseSourceDetail.houseItems.orientation.val(houseSourceDetail.orientation[houses.orientation]);
		houseSourceDetail.houseItems.waterVapour.val(houseSourceDetail.waterVapour[houses.waterVapour]);
		houseSourceDetail.houseItems.parlourType.val(houseSourceDetail.parlourType[houses.parlourType]);
		houseSourceDetail.houseItems.heatingType.val(houseSourceDetail.heatingType[houses.heatingType]);
	}

	function bindHouseSourceData(houseSources){
		var _tag = $('#indoores').data('tag');

		if(_tag){
			while(_tag.values.length > 0){
				_tag.remove(0)
			}

			if(houseSources.indoores && houseSources.indoores != ""){
				var hsindoores = houseSources.indoores.split(",");
				if(hsindoores.length){
					$.each(hsindoores, function(i, v){
						_tag.fladd(v, v);
					});
				}
			}
		}

		houseSourceDetail.items.hsType.val(houseSourceDetail.hsType[houseSources.type]);
		houseSourceDetail.items.customerId.val(houseSources.customer.name);
		houseSourceDetail.items.customerPhone.val(houseSources.customer.phone);
		if(houseSources.followUser.userName != null){
			houseSourceDetail.items.followId.val(houseSources.followUser.userName);
		}
		if(houseSources.keyer.userName != null){
			houseSourceDetail.items.keyerId.val(houseSources.keyer.userName);
		}
		houseSourceDetail.items.sourceType.val(houseSources.sourceType);
		houseSourceDetail.items.customerId.val(houseSources.customer.name);
		houseSourceDetail.items.deedNum.val(houseSources.deedNum);
		houseSourceDetail.items.deedValue.val(houseSources.deedValue);
		houseSourceDetail.items.unitPrice.val(houseSources.unitPrice);
		houseSourceDetail.items.totalPrice.val(houseSources.totalPrice);
		houseSourceDetail.items.decorateTime.val(houseSources.decorateTime);
		houseSourceDetail.items.decorateDegree.val(houseSources.decorateDegree);
		houseSourceDetail.items.discussType.val(houseSources.discussType);
		houseSourceDetail.items.rentType.val(houseSources.rentType);
		houseSourceDetail.items.history.val(houseSources.history);
		houseSourceDetail.items.propertyFee.val(houseSources.propertyFee);
		houseSourceDetail.items.elevator.val(houseSources.elevator);
		houseSourceDetail.items.onlyHousing.val(houseSources.onlyHousing);
		houseSourceDetail.items.documentsDate.val(houseSources.documentsDate);
		houseSourceDetail.items.allowLoan.val(houseSources.allowLoan);
		houseSourceDetail.items.beingLoan.val(houseSources.beingLoan);
		houseSourceDetail.items.checkingTime.val(houseSources.checkingTime);
		houseSourceDetail.items.housingGrade.val(houseSources.housingGrade);
		houseSourceDetail.items.comment.val(houseSources.comment);
	}
});
