var village = {
	listgrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	items: {},
	
	validator: {
		villageId: {
			type: "v_villageId", 
			regex: /^P_\d{4}$/g, 
			errorMsg: "请以P_作为前缀 , 之后以四位数字组成(如P_0001)."
		}
	},
	
	editFlag: false,
	repeatFlg: false,
	
	cityList: {},
	cityKey: "cityId",
	cityValue: "cityName",
	
	cityProperList: {},
	cityProperKey: "cityProperId",
	cityProperValue: "cityProperName",
	
	nameRuleList: {},
	nameRuleKey: "id",
	nameRuleValue: "ruleContent"
};

jQuery(function($) {
	village.listgrid = $("#listgrid");
	village.gridPager = "#gridPager";
	village.saveBtn = $("#saveBtn").on("click", saveData);
	village.cancelBtn = $("#cancelBtn");
	var searchOpts = {
		url: api.data.pageVillage,
		listgrid: village.listgrid,
		items: [
		    {label:"楼盘名称",id:"villageNameSearch",name:"villageName", type:'autoFillPinyinText', url:api.data.queryVillageForNameByPinyin},
		    {label:"所属城市", id:"citySearch", name:"cityId",type:"select",op:"eq"},
		    {label:"所属城区", id:"cityProperSearch", name:"cityProperId",type:"select",op:"eq"}
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	village.cityProperSearch = $("#cityProperSearch");
	village.citySearch = $("#citySearch").on("change", function(){
		bindCityProper($(this).val(), village.cityProperSearch, true);
	});
	
	village.items.villageId = $("#villageId").blur(function(){
		$this = $(this);
		
		if($this.val() == undefined || $this.val().trim() == ""){
			return;
		}
		
		com.post(api.data.queryVillageById, {"village.villageId": $this.val()}, function(res){
			if(res.village.vId > 0){
				com.showTips($this, "该楼盘编号已经存在", true);
				village.repeatFlg = true;
			}else{
				com.clearValidator("#villageId", true);
				village.repeatFlg = false;
			}
		});
	});
	village.items.nameRuleSel = $("#nameRuleSel");
	village.items.villageName = $("#villageName");
	village.items.cityProperSel = $("#cityProperSel");
	village.items.citySel = $("#citySel").on("change",function(e, callback){
		bindCityProper($(this).val(), village.items.cityProperSel, false, callback);
	});
	village.items.developer = $("#developer");
	village.items.salesPhone = $("#salesPhone");
	village.items.deliveryTime = $("#deliveryTime");
	village.items.villageContent = $("#villageContent");
	
	village.modal = $("#villageModal").on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#villageId", true);
	});
	$.extend(com.validator, village.validator);
	
	com.post(api.system.queryCity, {}, function(res){
		village.cityList = res.cityList;
		village.citySearch.bindData(village.cityList, village.cityKey, village.cityValue, true).trigger("change");
		village.items.citySel.bindData(village.cityList, village.cityKey, village.cityValue, false).trigger("change");
	});
	
	com.post(api.common.queryBuildingNameRule, {}, function(res){
		village.nameRuleList = res.buildingNameRules;
		village.items.nameRuleSel.bindData(village.nameRuleList, village.nameRuleKey, village.nameRuleValue, false).trigger("change");
	});
	
	initializeListgrid();

	$('.date-picker').datepicker({autoclose:true}).next().on(ace.click_event, function(){
		$(this).prev().focus();
	});
});

function bindCityProper(cityId, $cityProperSel, flag, callback){
	if(cityId != ""){
		com.post(api.system.queryCityProperByCityId, {"cityProper.city.cityId": cityId}, function(res){
			$cityProperSel.bindData(res.cityProperList, village.cityProperKey, village.cityProperValue, flag);
			
			if(callback){
				callback();
			}
		});
	}else{
		$cityProperSel.bindData([], "", "", flag);
	}
}

function initializeListgrid(){
	village.listgrid.jqGrid({		
		url: api.data.pageVillage.url,
		colNames:['楼盘编号', '楼盘名称', '城市编号', '所在城市', '城区编号', '所在城区', '规则ID','楼号规则', '开发商', '售楼电话', '交房时间', '说明'],
		colModel:[
		    {name:'villageId'},
			{name:'villageName'},
			{name:'cityId', jsonmap:'cityProper.city.cityId', hidden:true},
			{name:'cityName', jsonmap:'cityProper.city.cityName'},
			{name:'cityProperId', jsonmap:'cityProper.cityProperId', hidden:true},
			{name:'cityProperName', jsonmap:'cityProper.cityProperName'},
			{name:'ruleId', jsonmap:'buildingNameRule.id', hidden:true}, // rule id != rule name id
			{name:'ruleContent', jsonmap:'buildingNameRule.ruleContent'},
			{name:'developer'},
			{name:'salesPhone'},
			{name:'deliveryTime'},
			{name:'villageContent'},
		], 
		pager : village.gridPager,
		caption: "楼盘信息列表"
	});

	village.listgrid.navGrid(village.gridPager,{edit:false,add:false,del:false,search:false,searchicon:'icon-search orange',refresh:false,view:false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	).navButtonAdd(village.gridPager,{
		caption: "",
		buttonicon: "icon-pencil blue",
		onClickButton: function(){
			editFlg = true;
			
			var num = village.listgrid.jqGrid("getGridParam", 'selrow');
			
			if(num == null){
				$.jgrid.showSelectInfo(village.listgrid.attr("id"));
				return;
			}
			
			var row = village.listgrid.jqGrid("getRowData", num);
			
			village.items.villageId.val(row.villageId).prop("disabled", true).css("display", "block");
			village.items.villageId;
			village.items.villageName.val(row.villageName);
			village.items.citySel.val(row.cityId).trigger("change", function(){
				village.items.cityProperSel.val(row.cityProperId);
			});
			village.items.nameRuleSel.val(row.ruleId).trigger("change");
			village.items.developer.val(row.developer);
			village.items.salesPhone.val(row.salesPhone);
			village.items.deliveryTime.val(row.deliveryTime);
			village.items.villageContent.val(row.villageContent);
			
			village.modal.modal("show");
		},
		position: "first",
	}).navButtonAdd(village.gridPager, {
		caption: "",
		buttonicon: "icon-plus-sign purple",
		onClickButton: function(){
			editFlg = false;
			com.cleanItems(village.items);
			village.items.villageId.css("display", "none");
			village.items.citySel.trigger("change");
			village.modal.modal("show");
		},
		position: "first",
	});
}

function saveData(){
	
	if(com.validate() || village.repeatFlg){
		return;
	}
	
	var url;
	var options = {
		"village.villageId": village.items.villageId.val(),
		"village.villageName": village.items.villageName.val(),
		"village.cityProperId": village.items.cityProperSel.val(),
		"village.buildingNameRuleId": village.items.nameRuleSel.val(),
		"village.developer": village.items.developer.val(),
		"village.salesPhone": village.items.salesPhone.val(),
		"village.deliveryTime": village.items.deliveryTime.val() == "" ? undefined : village.items.deliveryTime.val(),
		"village.villageContent": village.items.villageContent.val()
	};
	
	if(editFlg){
		url = api.data.updateVillage;
	}else{
		url = api.data.addVillage;
	}
	
	com.post(url, options, successCallback);
	
	village.modal.modal("hide");
}

function successCallback(){
	com.showAlert(com.info, "操作成功");
	village.listgrid.trigger("reloadGrid");
}