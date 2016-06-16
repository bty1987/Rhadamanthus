var approve = {
	listgrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	items:{},
	
	editFlg: false,
	postParam: {},
	type: ["楼号审批", "客户信息审批",  "退款审批", '预算审批', '归属设计审批', '归属业务审批', '主材退货审批']
};

jQuery(function($) {
	approve.listgrid = $("#listgrid");
	approve.gridPager = "#gridPager";
	approve.saveBtn = $("#saveBtn").on("click", saveData);
	approve.cancelBtn = $("#cancelBtn");
	approve.modal = $("#approveModal");
	approve.items.userSel = $("#userSel").chosen({allow_single_deselect: true}); 
	
	com.post(api.ds.approvalType, {"timestamp": new Date().getTime()}, function(res){
		approve.approvalType = res.approvalType;
		
		approve.approvalTypeData = {};
		
		for(var i=0;i<approve.approvalType.length;i++){
			var _ = approve.approvalType[i];
			approve.approvalTypeData[_["key"]] = _["value"];
		}
	}, null, false);
	
	$("#userSel_chosen input").bind("input", function(){
		var pinyinName = $(this).val();
		if($(this).val() != ""){
			com.post(api.personel.queryUserForNameByPinyinName, {"pinyinName": pinyinName}, function(res){
				if(res.errorCode == 0){
					var options = '<option value="">&nbsp;</option>';
					
					if(res.autoFillList != null){
						for(var i=0;i<res.autoFillKeyValue.length;++i){
							options += '<option value="'+res.autoFillKeyValue[i].key+'">'+res.autoFillKeyValue[i].value+'</option>';
						}
					}
					$("#userSel").html(options).trigger("chosen:updated");
				}
			});
		}
	});
	$("#userSel_chosen").css("width", "200px");
	approve.items.type = $("#type");
	
	var searchOpts = {
		url: api.system.pageUserApprove,
		listgrid: approve.listgrid,
		items: [
		    {label:"用户姓名", id:"userNameSearch", name:"userName",type:'autoFillPinyinText', url:api.personel.queryUserForNameByPinyinName},
	        {label:"审批类型", id:"typeSearch", name:"type", type:"select"}
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	$("#typeSearch").bindData(approve.approvalType, "key", "value", true);
	approve.items.type.bindData(approve.approvalType, "key", "value", false);
	
	approve.listgrid.jqGrid({		
		url: api.system.pageUserApprove.url,
		postData: approve.postParam,
		colNames:['审批ID', '用户编号', '用户姓名', '审批类型'],
		colModel:[
		    {name:'approveId', hidden: true},
			{name:'userId', jsonmap: "user.userId"},
			{name:'userName', jsonmap: "user.userName"},
			{name:'type', formatter: approvalTypeInit}
		], 
		pager : approve.gridPager,
		caption: "审批人员列表"
	});

	approve.listgrid.navGrid(approve.gridPager, {edit:false,add:false,del:true,search:false,refresh: false,view: false},{},{}
	,$.jgrid.deleteFunc(removeRow))
	.navButtonAdd(approve.gridPager, { //edit
		caption:"",
		buttonicon: 'icon-pencil blue',
		onClickButton: function(){    
			editFlg = true;
			var num = approve.listgrid.jqGrid("getGridParam", 'selrow');
			
			if(num == null){
				$.jgrid.showSelectInfo(approve.listgrid.attr("id"));
				return;
			}
			
			var row = approve.listgrid.jqGrid("getRowData", num);
			approve.items.approveId = row.approveId;
			approve.items.userSel.html('<option value="'+row.userId+'">'+row.userName+'-'+row.userId+'</option>').trigger("chosen:updated");
			approve.items.userSel.prop("disabled", true).trigger("chosen:updated");
			approve.items.type.val(row.type);
			approve.modal.modal("show");
		},
		position: 'first'
	}).navButtonAdd(approve.gridPager, { //add
		caption:"",
		buttonicon: 'icon-plus-sign purple',
		onClickButton: function(){   
			editFlg = false;
			approve.items.userSel.html('<option value="">&nbsp;</option>').trigger("chosen:updated");
			approve.items.userSel.prop("disabled", false).trigger("chosen:updated");
			approve.modal.modal("show");   
		},
		position: 'first'
	});
});

function removeRow(params, rowNums){
	var options = {};
	var nums = rowNums.split(",");
	
	for(var i=0;i<nums.length;i++){
		var row = $(this).jqGrid('getRowData', nums[i]);
		options["userApproveIds["+i+"]"] = row.approveId;
	}
	
	com.post(api.system.deleteUserApprove, options, successCallback);
	
	$("#eData").trigger("click");
}

function approvalTypeInit(cellvalue, options, rowdata){
	return approve.approvalTypeData[cellvalue];
}

function saveData(){
	
	var url;
	var options = {
		'userApprove.user.userId': approve.items.userSel.val(),
		'userApprove.type': approve.items.type.val(),
	};
	
	if(editFlg){
		url = api.system.updateUserApprove;
		options['userApprove.approveId'] = approve.items.approveId;
	}else{
		url = api.system.addUserApprove;
	}
	
	com.post(url, options, successCallback);
	
	approve.modal.modal("hide");   
}

function successCallback(){
	$.jgrid.refreshGrid(approve.listgrid, approve.postParam);
	com.showAlert(com.info, "操作成功");
}
