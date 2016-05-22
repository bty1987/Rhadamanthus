var region = {
	listgrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	regionItems:{},
	
	postParam: {'template.templateDeleteFlag': 0},
	
	validator: {
		region: {
			type: "v_region", 
			regex: /^A_\d{2}$/g, 
			errorMsg: "请以A_作为前缀 , 之后以两位数字组成(如A_01)."
		}
	},
	
	editFlg: false,
	repeatFlg: false
};

jQuery(function($) {
	region.listgrid = $("#listgrid");
	region.gridPager = "#gridPager";
	region.saveBtn = $("#saveBtn").on("click", saveData);
	region.cancelBtn = $("#cancelBtn");
	
	region.modal = $("#regionModal");
	region.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#regionId", true);
	});
	
	region.regionItems.regionId = $("#regionId").on("blur",function(){
		$this = $(this);
		
		if($this.val() == undefined || $this.val().trim() == ""){
			return;
		}
		
		com.post(api.system.queryRegionById, {"region.regionId":$this.val()}, function(res){
			if(res.region){
				com.showTips($this, "该大区编号已存在", true);
				region.repeatFlg = true;
			}else{
				com.clearValidator("#regionId", true);
				region.repeatFlg = false;
			}
		});
	});
	region.regionItems.regionName = $("#regionName");
	$.extend(com.validator, region.validator);
	
	var searchOpts = {
		url: api.system.pageRegion,
		listgrid: region.listgrid,
		items: [{label:"大区名称",id:"regionNameSearch",name:"regionName", type:'text'}]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	region.listgrid.jqGrid({		
		url: api.system.pageRegion.url,
		postData: region.postParam,
		colNames:['大区编号', '大区名称'],
		colModel:[
			{name:'regionId', search: false},
			{name:'regionName',  searchoptions: { sopt: ['cn'] }}
		], 
		pager : region.gridPager,
		caption: "大区列表"
	});

	region.listgrid.navGrid(region.gridPager, {edit:false,add:false,del:true,search:false,searchicon : 'icon-search orange', refresh: false,view: false}, {}, {},
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(region.gridPager, {
		caption:"",
		buttonicon: 'icon-pencil blue',
		onClickButton: function(){    
			editFlg = true;
			var num = region.listgrid.jqGrid("getGridParam", 'selrow');
			
			if(num == null){
				$.jgrid.viewModal("#alertmod_listgrid",{gbox:"#gbox_"+region.listgrid.attr("id"), jqm:true});$("#jqg_alrt").focus();
				
				return;
			}
			var row = region.listgrid.jqGrid("getRowData", num);
			
			region.regionItems.regionId.val(row.regionId);
			region.regionItems.regionId.prop("disabled", true).css("display", "block");
			region.regionItems.regionName.val(row.regionName);
			
			region.modal.modal("show");
		},
		position: 'first'
	}).navButtonAdd(region.gridPager, {
		caption:"",
		buttonicon: 'icon-plus-sign purple',
		onClickButton: function(){   
			editFlg = false;
			
			com.cleanItems(region.regionItems);
			
			region.regionItems.regionId.prop("disabled", false).css("display", "none");
			
			region.modal.modal("show");   
		},
		position: 'first'
	});
	
});

function removeRow(params, rowNums){
	var options = {};
	var nums = rowNums.split(",");
	
	for(var i=0;i<nums.length;i++){
		var row = $(this).jqGrid('getRowData', nums[i]);
		options["regionIds["+i+"]"] = row.regionId;
	}
	
	com.post(api.system.deleteRegion, options, successCallback);
	
	$("#eData").trigger("click");
}

function saveData(){
	if(com.validate() || region.repeatFlg){
		return;
	}
	
	var url;
	var options = {
		'region.regionId': region.regionItems.regionId.val(),
		'region.regionName': region.regionItems.regionName.val(),
	};
	
	if(editFlg){
		url = api.system.updateRegion;
	}else{
		url = api.system.addRegion;
	}
	
	com.post(url, options, successCallback);
	
	region.modal.modal("hide");   
}

function successCallback(){
	$.jgrid.refreshGrid(region.listgrid, region.postParam);
}
