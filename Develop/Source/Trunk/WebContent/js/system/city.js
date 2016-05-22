var city = {
	listgrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	cityItems:{},
	
	editFlg: false,
	postParam: {},
	
	validator: {
		city: {
			type: "v_city", 
			regex: /^C_\d{2}$/g, 
			errorMsg: "请以C_作为前缀 , 之后以两位数字组成(如C_01)."
		}
	},
	repeatFlg: false,
	
	regionList: [],
	regionKey: "regionId",
	regionValue: "regionName",
};

jQuery(function($) {
	city.listgrid = $("#listgrid");
	city.gridPager = "#gridPager";
	city.saveBtn = $("#saveBtn").on("click", saveData);
	city.cancelBtn = $("#cancelBtn");
	
	city.cityItems.cityId = $("#cityId").on("blur",function(){
		$this = $(this);
		
		if($this.val() == undefined || $this.val().trim() == ""){
			return;
		}
		
		com.post(api.system.queryCityById, {"city.cityId": $this.val()}, function(res){
			if(res.city.cId){
				com.showTips($this, "该城市编号已存在", true);
				city.repeatFlg = true;
			}else{
				com.clearValidator("#cityId", true);
				city.repeatFlg = false;
			}
		});
	});
	city.cityItems.cityName = $("#cityName");
	city.cityItems.regionSel = $("#regionSel");
	
	city.modal = $("#cityModal");
	city.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#cityId", true);
	});
	$.extend(com.validator, city.validator);
	
	var searchOpts = {
			url: api.system.pageCity,
			listgrid: city.listgrid,
			items: [
		        {label:"城市名称",id:"cityNameSearch",name:"cityName", type:'text'}, 
		        {label:"所属大区", id:"regionSearch",name:"regionId", type:"select"}
		    ]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	com.post(api.system.queryRegion, {}, function(res){
		city.regionList = res.regionList;
		city.cityItems.regionSel.bindData(city.regionList, city.regionKey, city.regionValue);
		
		$("#regionSearch").bindData(city.regionList, city.regionKey, city.regionValue, true);
		
		initializeListgrid();
	});
});

function initializeListgrid(){
	city.listgrid.jqGrid({		
		url: api.system.pageCity.url,
		postData: city.postParam,
		colNames:['城市编号', '城市名称', '所属大区'],
		colModel:[
			{name:'cityId', search: false},
			{name:'cityName',  searchoptions: { sopt: ['cn'] }},
			{name:'regionId', jsonmap:'region.regionId', searchoptions: { sopt: ['cn'] }, formatter:'select', editoptions:{value:city.regionList.formatArrayMapToStr(city.regionKey, city.regionValue)}}
		], 
		pager : city.gridPager,
		caption: "城市列表"
	});

	city.listgrid.navGrid(city.gridPager, {edit:false,add:false,del:true,search:false,searchicon: 'icon-search orange', refresh: false,view: false}, {}, {} , 
		$.jgrid.deleteFunc(removeRow), 
		$.jgrid.searchFunc($(this))
	).navButtonAdd(city.gridPager, {
		caption:"",
		buttonicon: 'icon-pencil blue',
		onClickButton: function(){    
			editFlg = true;
			var num = city.listgrid.jqGrid("getGridParam", 'selrow');
			
			if(num == null){
				$.jgrid.showSelectInfo(city.listgrid.attr("id"));
				return;
			}
			
			var row = city.listgrid.jqGrid("getRowData", num);
			
			city.cityItems.cityId.val(row.cityId);
			city.cityItems.cityId.prop("disabled", true).css("display", "block");
			city.cityItems.cityName.val(row.cityName);
			city.cityItems.regionSel.val(row.regionId);
			city.modal.modal("show");
		},
		position: 'first'
	}).navButtonAdd(city.gridPager, {
		caption:"",
		buttonicon: 'icon-plus-sign purple',
		onClickButton: function(){   
			editFlg = false;
			com.cleanItems(city.cityItems);
			city.cityItems.cityId.prop("disabled", false).css("display", "none");
			city.cityItems.regionSel.find("option:first").prop("selected", true);	
			city.modal.modal("show");   
		},
		position: 'first'
	});
}

function removeRow(params, rowNums){
	var nums = rowNums.split(",");
	var options = {};
	for(var i = 0; i< nums.length; i++){
		var row = $(this).jqGrid('getRowData', nums[i]);
		options["cityIds["+i+"]"] = row.cityId;
	}
	com.post(api.system.deleteCityByIds, options, successCallback);
	$("#eData").trigger("click");
}

function saveData(){
	
	if(com.validate() || city.repeatFlg){
		return;
	}
	
	var url;
	var options = {
		'city.cityId': city.cityItems.cityId.val(),
		'city.cityName': city.cityItems.cityName.val(),
		'city.region.regionId': city.cityItems.regionSel.val()
	};
	
	if(editFlg){
		url = api.system.updateCity;
	}else{
		url = api.system.addCity;
	}
	
	com.post(url, options, successCallback);
	
	city.modal.modal("hide");   
}

function successCallback(){
	com.showAlert(com.info, "操作成功");
	$.jgrid.refreshGrid(city.listgrid, city.postParam);
}
