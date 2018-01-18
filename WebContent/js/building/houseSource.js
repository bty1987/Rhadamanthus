
jQuery(function($) {

	var houseSource = {
		houseSources: {},
		hsid: null,
		csid: null,
		deployedBtn: null,
		bsaveBtn: null,
		bcancelBtn: null,
		modal: null,
		houseSourceId: null,
		houseId: null,
		buildItems: [],
		hsType: [],
		houseType: [],
		decorateDegree: [],
		discussType: [],
		orientation: [],
		payType: [],
		balanceStatus: [],
		rentType: [],
		repeatFlg: null,
		validator: null,
	};

	$(".date-picker").datepicker({autoclose: !0}).on("show",function() {
		setTimeout(function() {
			$(".dropdown-menu").css("z-index", 1060)
		},0)
	}).next().on(ace.click_event,function() {
		a(this).prev().focus()
	});

	houseSource.deployedBtn = $("#deployedBtn").on("click", updateFollowUser);
	houseSource.bsaveBtn = $("#bsaveBtn").on("click", saveBuildingData);

	houseSource.modal = $("#houseSourceModal");
	houseSource.modal.on('show.bs.modal',function(e){
		com.clearValidator();
	});

	$.extend(com.validator, houseSource.validator);
	com.initChosen("belongUser", api.personel.queryUserForNameByDuty, "pinyinName", {"duty":"", "user.status":0}, "autoFillKeyValue", "key", "value");

	houseSource.buildItems.hsNo = $("#hsNo");
	houseSource.buildItems.csNo = $("#csNo");
	houseSource.buildItems.hsAUser = $("#hsAUser");
	houseSource.buildItems.csAUser = $("#csAUser");
	houseSource.buildItems.signingTime = $("#signingTime");
	houseSource.buildItems.tradePrice = $("#tradePrice");
	houseSource.buildItems.downpayment = $("#downpayment");
	houseSource.buildItems.loanPrice = $("#loanPrice");
	houseSource.buildItems.payType = $("#payType");
	houseSource.buildItems.balanceStatus = $("#balanceStatus");

	com.post(api.ds.building, {}, function(res){
		houseSource.buildItems.payType.bindData(res.payType,"key", "value");
		houseSource.buildItems.balanceStatus.bindData(res.balanceStatus,"key", "value");

		$.each(res.hsType, function (i,va) {
			houseSource.hsType[va.key] = va.value;
		});
		$.each(res.houseType, function (i,va) {
			houseSource.houseType[va.key] = va.value;
		});
		$.each(res.discussType, function (i,val) {
			houseSource.discussType[val.key] = val.value;
		});
		$.each(res.decorateDegree, function (i,val) {
			houseSource.decorateDegree[val.key] = val.value;
		});
		$.each(res.payType, function (i,v) {
			houseSource.payType[v.key] = v.value;
		});
		$.each(res.balanceStatus, function (i,v) {
			houseSource.balanceStatus[v.key] = v.value;
		});
		$.each(res.orientation, function (i,v) {
			houseSource.orientation[v.key] = v.value;
		});
		$.each(res.rentType, function (i,v) {
			houseSource.rentType[v.key] = v.value;
		});

	}, null, false);

	$("#csNo").on("blur", function(){
		com.post(api.building.queryCustomerSourceByNo, {"customerSource.no" : houseSource.buildItems.csNo.val()}, function(res){
			if(res.customerSource.status != 0){
				houseSource.repeatFlg = true;
				com.showPopover($("#csNo"),{errorMsg: "客源已签约或失效！"}, "right");
			}else{
				houseSource.repeatFlg = false;
				houseSource.csid = res.customerSource.csid;
				$("#csNo").css("border", "1px solid #d5d5d5").popover("destroy");
			}
		}, function(data){
			com.showPopover($("#csNo"),{errorMsg: "请正确输入客源编号！"}, "right");
			houseSource.repeatFlg = true;
		}, false);
	});

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

			var that = this;
			var $liLine = $('<li></li>').addClass('item-blue clearfix');
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.no));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnAll = $('<a></a>').addClass('btn btn-minier btn-primary').html("查看");
			var $btnFollow = $('<a></a>').addClass('btn btn-minier btn-danger').html("转移房源");
			var $btnBind = $('<a></a>').addClass('btn btn-minier btn-yellow').html("绑定客源");
			var $btnRecord = $('<a></a>').addClass('btn btn-minier btn-inverse').html("跟进记录");
			var $btnStatus = $('<input />').attr("type","checkbox").addClass('ace ace-switch ace-switch-5').prop("id", v.hsid).attr("checked", v.status == 0 ? true : false);
			var $btnSpan = $('<span></span>').addClass("lbl status-lbl");

			var propertyArr = [
				//["房主:", v.customer.name, "grey"],
				["房源类型:", houseSource.hsType[v.type], "blue"],
				["房屋类型:", houseSource.houseType[v.house.type], "blue"],
				["楼盘地址:", v.house.village.name, "blue"],
				["面积:", v.house.buildArea  + "平", "blue"],
				["总价:", toMoney(v.totalPrice) + "元", "blue"],
				["装修程度:", houseSource.decorateDegree[v.decorateDegree], "blue"],
				["户型:", v.house.houseType, "blue"],
				["房屋朝向:", houseSource.orientation[v.house.orientation], "blue"],
				["商议类型:", houseSource.discussType[v.discussType], "red"],
				["交租方式:", houseSource.rentType[v.rentType], "blue"],
				["房源等级:", v.housingGrade, "red"]
				//["备注:", v.comment, "red"]
			];

			$.each(propertyArr, function (index, value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$divBtnWrap.append($btnAll).append($btnFollow).append($btnBind).append($btnRecord).append($btnStatus).append($btnSpan).appendTo($h3);

			$liLine.append($h3).append($ulProperty);

			//查看   可以看见房源的所有信息  包括图片  和上传图片
			$btnAll.click(function(){
				params.hsStatus = v.status;
				params.drawingId = v.hsid;
				params.type = v.type;
				com.switchPage(api.index.houseSourceDetail.url)
			});

			//转移房源
			$btnFollow.click(function(){
				if(v.status != 0){
					com.showAlert(com.warning, "当前房源已签约或已失效，不能转移房源！");
					return;
				}
				houseSource.houseSourceId = v.hsid;
				com.post(api.building.queryHouseSourceByHsid, {"houseSource.hsid" : v.hsid}, function(res){
					var houseSourceData = res.houseSource;
					com.updateChosen("belongUser", houseSourceData.followUser.userId, houseSourceData.followUser.userName);
				}, null, false);
				$("#houseSourceBelongModal").modal("show");
			});

			//绑定客源
			$btnBind.click(function(){
				if(v.status != 0){
					com.showAlert(com.warning, "当前房源已签约或已失效，不能绑定客源！");
					return;
				}
				deleteData();
				houseSource.buildItems.hsNo.val(v.no);
				houseSource.hsid = v.hsid;
				houseSource.buildItems.hsNo.prop("readOnly", true);
				com.initChosen('hsAUser', api.data.queryCustomerForName, "customer.name", {}, "autoFillCustomer", "key", "value");
				com.initChosen('csAUser', api.data.queryCustomerForName, "customer.name", {}, "autoFillCustomer", "key", "value");
				$("#buildingModal").modal("show");
			});

			//跟进记录
			$btnRecord.click(function(){
				params.flag = true;
				params.hsid = v.hsid;
				params.hsNo = v.no;
				com.switchPage(api.index.buildingRecord.url);
			});

			//启用禁用
			$btnStatus.click(function(){
				var cvalue = $btnStatus.prop("checked");
				if(cvalue){
					cvalue = 0;
				}else{
					cvalue = 1;
				}

				if(cvalue == 0){
					$("#" + v.hsid).prop("checked", false);
					updateHouseSourceStatus(v.hsid, cvalue);
				}else if(cvalue == 1){
					updateHouseSourceStatus(v.hsid, cvalue);
				}

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
	var conditionList = ["houseSourceNo", "houseType", "b_houseSourceType", "b_villageName", "buildingArea", "b_totalPrice", "roomNum", "orientation", "b_decorateDegree", "b_allowLoan", "b_housingGrade", "b_rentType"];

	searcher.init(conditionList, "condList", api.building.pageHouseSource, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "houseSourcePostData",null, false, null, null);

	//更新房源归属
	function updateFollowUser(){

		var options = {};
		options["houseSource.hsid"] = houseSource.houseSourceId;
		options["houseSource.followUser.userId"] = $("#belongUser").val();

		com.post(api.building.updateHouseSourceForBelong, options, function(res){
			com.showAlert(info, "房源转移成功！")
		});
		$("#houseSourceBelongModal").modal("hide");

		com.updateChosen("belongUser", "", "");
	}

	//更新房源状态
	function updateHouseSourceStatus(hsid, cvalue){
		var options = {};
		options["houseSource.hsid"] = hsid;
		options["houseSource.status"] = cvalue;

		com.post(api.building.updateHouseSourceForStatus, options, function(res){
			$("#" + hsid).prop("checked", true);
			searcher.doSearch();
		});
	}

	//绑定客源，创建房产单
	function saveBuildingData(){
		if(com.validate() || houseSource.repeatFlg){
			return;
		}

		var options = {
			'building.houseSource.hsid': houseSource.hsid,
			'building.customerSource.csid': houseSource.csid,
			'building.houseSourceAgent.cid': houseSource.buildItems.hsAUser.val(),
			'building.customerSourceAgent.cid': houseSource.buildItems.csAUser.val(),
			'building.signingTime': houseSource.buildItems.signingTime.val(),
			'building.tradePrice': houseSource.buildItems.tradePrice.val(),
			'building.downpayment': houseSource.buildItems.downpayment.val(),
			'building.loanPrice': houseSource.buildItems.loanPrice.val(),
			'building.payType': houseSource.buildItems.payType.val(),
			'building.balanceStatus': houseSource.buildItems.balanceStatus.val(),
		};

		com.post(api.building.bindBuilding, options, function(res){
			com.showAlert(com.info, "成功绑定客源！");
			searcher.doSearch();
		});

		$("#buildingModal").modal("hide");
	}

	//删除房产单数据
	function deleteData(){
		com.clearValidator("buildingModal");
		com.updateChosen('hsAUser', "", "");
		com.updateChosen('csAUser', "", "");
		com.cleanItems(houseSource.buildItems);
	}

	//转换金额
	function toMoney(num){
		num = num.toFixed(2);
		num = parseFloat(num)
		num = num.toLocaleString();
		return num;
	}
});
