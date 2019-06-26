
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
		currentHsid: params.drawingId,
		houseSourcePage: params.page,
		currentHsStatus: params.hsStatus
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
	};

	com.datetime(com.focusPage(".date-picker"), "date");

	var tag_input = com.focusPage("#indoores");

	tag_input.tag({
		placeholder:tag_input.attr('placeholder'),
		isStaticResource : false,
		flsource: {
			url : null,
			postData : {},
			resultList : "autoFillKeyValue",
			keyPath : "key",
			valuePath : "value",
			isResultTypeMap : true //是否是key - value 形式的列表
		}
	});

	com.focusPage("#history").bindData(houseSourceDetail.history);
	com.focusPage("#housingGrade").bindData(houseSourceDetail.housingGrade);

	if(!(houseSourceDetail.houseSourcePage == "query")){
		var $btnSave = $("<a>保存</a>").addClass("btn btn-primary icon-ok").prop("id", "saveBtn").css("padding", "4px 8px");
		com.focusPage("#btnDiv").append($btnSave);
	}

	houseSourceDetail.saveBtn = com.focusPage("#saveBtn").on("click", updateHouseSource);
	houseSourceDetail.backBtn = com.focusPage("#backBtn");
	houseSourceDetail.houseBtn = com.focusPage("#houseBtn").on("click", function(){
		com.focusPage("#houseData").toggle();
	});

	com.focusPage('#backBtn').on(ace.click_event, function(){
		switch(houseSourceDetail.houseSourcePage)
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

	houseSourceDetail.items.customerId = com.focusPage("#customerId");
	houseSourceDetail.items.customerPhone = com.focusPage("#customerPhone");
	houseSourceDetail.items.no = com.focusPage("#no");
	houseSourceDetail.items.houseNumber = com.focusPage("#houseNumber");
	houseSourceDetail.items.hsType = com.focusPage("#hsType");
	houseSourceDetail.items.sourceType = com.focusPage("#sourceType");
	houseSourceDetail.items.deedNum = com.focusPage("#deedNum");
	houseSourceDetail.items.deedValue = com.focusPage("#deedValue");
	houseSourceDetail.items.unitPrice = com.focusPage("#unitPrice");
	houseSourceDetail.items.totalPrice = com.focusPage("#totalPrice");
	houseSourceDetail.items.decorateTime = com.focusPage("#decorateTime");
	houseSourceDetail.items.decorateDegree = com.focusPage("#decorateDegree");
	houseSourceDetail.items.discussType = com.focusPage("#discussType");
	houseSourceDetail.items.rentType = com.focusPage("#rentType");
	houseSourceDetail.items.indoores = com.focusPage("#indoores");
	houseSourceDetail.items.history = com.focusPage("#history");
	houseSourceDetail.items.propertyFee = com.focusPage("#propertyFee");
	houseSourceDetail.items.elevator = com.focusPage("#elevator");
	houseSourceDetail.items.onlyHousing = com.focusPage("#onlyHousing");
	houseSourceDetail.items.documentsDate = com.focusPage("#documentsDate");
	houseSourceDetail.items.allowLoan = com.focusPage("#allowLoan");
	houseSourceDetail.items.beingLoan = com.focusPage("#beingLoan");
	houseSourceDetail.items.checkingTime = com.focusPage("#checkingTime");
	houseSourceDetail.items.followId = com.focusPage("#followId");
	houseSourceDetail.items.keyerId = com.focusPage("#keyerId");
	houseSourceDetail.items.housingGrade = com.focusPage("#housingGrade");
	houseSourceDetail.items.comment = com.focusPage("#comment");

	houseSourceDetail.houseItems.village = com.focusPage("#village");
	houseSourceDetail.houseItems.no = com.focusPage("#no");
	houseSourceDetail.houseItems.houseNumber = com.focusPage("#houseNumber");
	houseSourceDetail.houseItems.type = com.focusPage("#type");
	houseSourceDetail.houseItems.buildArea = com.focusPage("#buildArea");
	houseSourceDetail.houseItems.maxFloor = com.focusPage("#maxFloor");
	houseSourceDetail.houseItems.through = com.focusPage("#through");
	houseSourceDetail.houseItems.houseType = com.focusPage("#houseType");
	houseSourceDetail.houseItems.orientation = com.focusPage("#orientation");
	houseSourceDetail.houseItems.feature = com.focusPage("#feature");
	houseSourceDetail.houseItems.waterVapour = com.focusPage("#waterVapour");
	houseSourceDetail.houseItems.parlourType = com.focusPage("#parlourType");
	houseSourceDetail.houseItems.heatingType = com.focusPage("#heatingType");

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
	com.post(api.building.queryHouseSourceByHsid, {"houseSource.hsid" : houseSourceDetail.currentHsid}, function(res){
		bindHouseSourceData(res.houseSource);
		bindHouseData(res.houseSource.house);
	}, null, false);

	houseSourceDetail.modal = com.focusPage("#houseSourceDetailModal");
	houseSourceDetail.modal.on('show.bs.modal',function(e){
		com.clearValidator();
	});

	//编辑
	function updateHouseSource(){
		if(houseSourceDetail.currentHsStatus != 3){
			com.showAlert(com.warning, "只有已通过房源可以修改房源信息");
			return;
		}

		if(com.validate()){
			return;
		}

		var options = {};
		options["houseSource.hsid"] = houseSourceDetail.currentHsid;
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

		com.focusPage("#houseSourceDetailModal").modal("hide");
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
		var _tag = com.focusPage('#indoores').data('tag');

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
