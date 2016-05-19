var cityProper = {
	listgrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	items:{},
	
	postParam: {},
	
	validator: {
		cityProper: {
			type: "v_cityProper", 
			regex: /^R_\d{2}$/g, 
			errorMsg: "请以R_作为前缀 , 之后以两位数字组成(如R_01)."
		}
	},
	
	editFlg: false,
	repeatFlg: false,
	
	regionList: [],
	regionKey: "regionId",
	regionValue: "regionName",
	
	cityList:[],
	cityKey: "cityId",
	cityValue: "cityName"
};

jQuery(function($) {
	cityProper.listgrid = $("#listgrid");
	cityProper.gridPager = "#gridPager";
	cityProper.saveBtn = $("#saveBtn").on("click", saveData);
	cityProper.cancelBtn = $("#cancelBtn");
	
	var searchOpts = {
		url: api.system.pageCityProper,
		listgrid: cityProper.listgrid,
		items: [
	        {label:"城区名称",id:"cityProperNameSearch",name:"cityProperName", type:'text'}, 
	        {label:"所属大区", id:"regionSearch", name:"regionId", type:"select",op:"eq"},
	        {label:"所属城市", id:"citySearch", name:"cityId",type:"select",op:"eq"}
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	cityProper.regionSearch = $("#regionSearch").on("change",function(){
		bindCity($(this).val(),$("#citySearch"), true);
	});
	
	cityProper.items.cityProperId = $("#cityProperId").on("blur",function(){
		$this = $(this);
		
		if($this.val() == undefined || $this.val().trim() == ""){
			return;
		}
		
		com.post(api.system.queryCityProperById, {"cityProper.cityProperId": $this.val()}, function(res){
			if(res.cityProper.cpId){
				com.showTips($this, "该城区编号已存在", true);
				cityProper.repeatFlg = true;
			}else{
				com.clearValidator("#cityProperId", true);
				cityProper.repeatFlg = false;
			}
		});
	});
	cityProper.items.cityProperName = $("#cityProperName");
	cityProper.items.citySel =$("#citySel");
	cityProper.items.regionSel=$("#regionSel").on("change",function(e, callback){
		bindCity($(this).val(), cityProper.items.citySel, false, callback);
	});
	
	cityProper.modal = $("#cityProperModal");
	cityProper.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#cityProperId", true);
	});
	$.extend(com.validator, cityProper.validator);
	
	com.post(api.system.queryRegion, {}, function(res){
		cityProper.regionList = res.regionList;
		cityProper.regionSearch.bindData(cityProper.regionList, cityProper.regionKey, cityProper.regionValue, true).trigger("change");
		cityProper.items.regionSel.bindData(cityProper.regionList, cityProper.regionKey, cityProper.regionValue, false).trigger("change");
	});
	
	initializeListgrid();
});

function bindCity(regionId, $cityObj, flag, callback){
	if(regionId != ""){
		com.post(api.system.queryCityByRegionId, {"city.region.regionId":regionId}, function(res){
			$cityObj.bindData(res.cityList, cityProper.cityKey, cityProper.cityValue, flag);
			if(callback) callback();
		});
	}else{
		$cityObj.bindData([], "", "", flag);
	}
}

function initializeListgrid(){
	cityProper.listgrid.jqGrid({		
		url: api.system.pageCityProper.url,
		postData: cityProper.postParam,
		colNames:['城区编号', '城区名称', '所属大区',"所属大区Id","所属城市","所属城区Id"],
		colModel:[
			{name:'cityProperId', search: false},
			{name:'cityProperName'},
			{name:'regionName', jsonmap:'city.region.regionName'},
			{name:'regionId', jsonmap:'city.region.regionId',hidden:true},
			{name:'cityName', jsonmap:'city.cityName'},
			{name:'cityId', jsonmap:'city.cityId',hidden:true}
		], 
		pager : cityProper.gridPager,
		caption: "城区列表"
	});

	cityProper.listgrid.navGrid(cityProper.gridPager, {edit:false,add:false,del:true,search:false,searchicon : 'icon-search orange', refresh: false,view: false},{},{},
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(cityProper.gridPager, {
		caption:"",
		buttonicon: 'icon-pencil blue',
		onClickButton: function(){    
			editFlg = true;
			var num = cityProper.listgrid.jqGrid("getGridParam", 'selrow');
			
			if(num == null){
				$.jgrid.showSelectInfo(cityProper.listgrid.attr("id"));
				return;
			}
			var row = cityProper.listgrid.jqGrid("getRowData", num);
			
			cityProper.items.cityProperId.prop("disabled", true).css("display", "block");
			
			cityProper.items.cityProperId.val(row.cityProperId);
			cityProper.items.cityProperName.val(row.cityProperName);
			cityProper.items.regionSel.val(row.regionId).trigger("change", function(){
				cityProper.items.citySel.val(row.cityId);
			});
			cityProper.modal.modal("show");
		},
		position: 'first'
	}).navButtonAdd(cityProper.gridPager, { //add
		caption:"",
		buttonicon: 'icon-plus-sign purple',
		onClickButton: function(){   
			editFlg = false;
			com.cleanItems(cityProper.items);
			cityProper.items.cityProperId.prop("disabled", false).css("display", "none");
			cityProper.items.regionSel.trigger("change");
			cityProper.modal.modal("show");   
		},
		position: 'first'
	});
}

function removeRow(params, rowNums){
	var options = {};
	var nums = rowNums.split(",");
	
	for(var i=0;i<nums.length;i++){
		var row = $(this).jqGrid('getRowData', nums[i]);
		options["cityProperIds["+i+"]"] = row.cityProperId;
	}
	
	com.post(api.system.deleteCityProper, options, successCallback);
	
	$("#eData").trigger("click");
}

function saveData(){
	if(com.validate() || cityProper.repeatFlg){
		return;
	}
	
	var url;
	var options = {
		'cityProper.cityProperId': cityProper.items.cityProperId.val(),
		'cityProper.cityProperName': cityProper.items.cityProperName.val(),
		'cityProper.city.cityId': cityProper.items.citySel.val()
	};
	
	if(editFlg){
		url = api.system.updateCityProper;
	}else{
		url = api.system.addCityProper;
	}
	
	com.post(url, options, successCallback);
	
	cityProper.modal.modal("hide");   
}

function successCallback(){
	com.showAlert(com.info, "操作成功");
	$.jgrid.refreshGrid(cityProper.listgrid, cityProper.postParam);
}
