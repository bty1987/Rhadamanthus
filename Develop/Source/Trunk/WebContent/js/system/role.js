var role = {
	listgrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	roleItems: {},
	
	validator: {
		roleId: {
			type: "v_roleId", 
			regex: /^[\w-_]+$/, 
			errorMsg: "请输入数字字母或下划线中划线."
		}
	},
	
	postParam: {},
	
	editFlg: false,
	repeatFlg: false
};

var setting = {
	check: {
		enable: true,
		chkDisabledInherit: true,
		chkboxType: { "Y": "s", "N": "ps" }
	}, data: {
		simpleData: {
			enable: true
		}
	}
};

jQuery(function($) {
	role.listgrid = $("#listgrid");
	role.gridPager = "#gridPager";
	role.saveBtn = $("#saveBtn").on("click", saveData);
	role.cancelBtn = $("#cancelBtn");
	role.modal = $("#roleModal");
	role.roleItems.roleId = $("#roleId").on("blur", function(){
		$this = $(this);
		
		com.post(api.system.queryRoleById, {"role.roleId":$this.val()}, function(res){
			
			var _role = res.role;
			
			if(_role && _role.roleId && _role.roleName){
				com.showTips($this, "该角色编号已存在", true);
				role.repeatFlg = true;
			}else{
				com.clearValidator("#roleId", true);
				role.repeatFlg = false;
			}
		});
	});
	role.roleItems.roleDes = $("#roleDes");
	role.roleItems.roleName = $("#roleName").on("blur",function(){
		$this = $(this);
		
		com.post(api.system.queryRoleByName, {"role.roleName": $this.val()}, function(res){
			
			var _role = res.role;
			
			if(_role && _role.roleName && _role.roleId){
				if((role.editFlg && _role.roleId != role.roleItems.roleId.val()) || !role.editFlg){
					com.showTips($this, "该角色名称已存在", true);
					role.repeatFlg = true;
				}
			}else{
				com.clearValidator("#roleName", true);
				role.repeatFlg = false;
			}
		});
	});
	
	role.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#roleName", true);
		com.clearValidator("#roleId", true);
	});
	$.extend(com.validator, role.validator);
	
	var searchOpts = {
		url: api.system.pageRole,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: role.listgrid,
		items: [
		    {label:"角色名称",id:"roleNameSearch",name:"roleName", type:'text'}
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	initializeListgrid();
	
	$("#cancelRoleRightBtn").on("click",goBackRoleList);
	$("#saveRoleRightBtn").on("click",saveRoleRight);
});

function initializeListgrid(){
	role.listgrid.jqGrid({	
		url: api.system.pageRole.url,
		postData: {},
		colNames:['角色编号', '角色名称', '角色描述','操作'],
		colModel:[
			{name:'roleId', search: false},
			{name:'roleName', searchoptions: { sopt: ['cn'] }},
			{name:'roleDes', search: false}, 
			{name:'operate', jsonmap:'roleId',formatter:operateRightFormat}
		], 
		pager : role.gridPager,
		caption: "角色列表"
	});

	role.listgrid.navGrid(role.gridPager, {edit:false,add:false,del:true,search:false,searchicon : 'icon-search orange', refresh: false,view: false}, {}, {},
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(role.gridPager, {
		caption:"",
		buttonicon: 'icon-pencil blue',
		onClickButton: function(){    
			role.editFlg = true;
			var num = role.listgrid.jqGrid("getGridParam", 'selrow');
			
			if(num == null){
				$.jgrid.showSelectInfo(role.listgrid.attr("id"));
				return;
			}
			var row = role.listgrid.jqGrid("getRowData", num);
			
			role.roleItems.roleId.val(row.roleId);
			role.roleItems.roleName.val(row.roleName);
			role.roleItems.roleDes.val(row.roleDes);
			
			role.roleItems.roleId.prop("disabled", true).css("display", "block");
			
			role.modal.modal("show");
		},
		position: 'first'
	}).navButtonAdd(role.gridPager, {
		caption:"",
		buttonicon: 'icon-plus-sign purple',
		onClickButton: function(){   
			role.editFlg = false;
			
			com.cleanItems(role.roleItems);
			
			role.roleItems.roleId.prop("disabled",false).css("display", "none");
			
			role.modal.modal("show");   
		},
		position: 'first'
	});
}

function operateRightFormat( cellvalue, options, rowObject ){  
	return '<a class="btn btn-minier btn-purple" href="javascript:gotoRoleRight(\''+cellvalue+'\',\''+rowObject.roleName+'\');">配置权限</a>';
} 

function gotoRoleRight(roleId, roleName){
	$("#roleList").addClass("hidden");
	$("#roleRightDiv").removeClass("hidden");
	$("#roleRightRoleId").val(roleId);
	$("#roleRightContent").html("配置角色("+roleName+")权限");
	
	com.post(api.system.queryRoleRight, {"role.roleId": roleId}, function(res){
		 $.fn.zTree.init($("#treeDemo"), setting, res.zTree);
	});
}

function goBackRoleList(){
	$("#roleRightDiv").addClass("hidden");
	$("#roleList").removeClass("hidden");
	$("#roleRightRoleId").val("");
	$("#roleRightContent").html("配置角色()权限");
	
	$.jgrid.refreshGrid(role.listgrid, role.postParam);
}

function saveRoleRight(){
	var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
	zTreeNodes = treeObj.getNodes();
	
	var rightTree=[];
	var params = {};
	
	for(var i=0;i<zTreeNodes.length;++i){
		var module = {};
		params["rightTree["+i+"].id"]= zTreeNodes[i].id;
		params["rightTree["+i+"].name"]= zTreeNodes[i].name;
		params["rightTree["+i+"].checked"]= zTreeNodes[i].checked;
		params["rightTree["+i+"].open"]= zTreeNodes[i].open;
		params["rightTree["+i+"].nocheck"]= zTreeNodes[i].nocheck;
		params["rightTree["+i+"].chkDisabled"] = zTreeNodes[i].chkDisabled;
		
		for(var j=0;j<zTreeNodes[i].children.length;++j){
			var func = {};
			params["rightTree["+i+"].children["+j+"].id"] = zTreeNodes[i].children[j].id;
			params["rightTree["+i+"].children["+j+"].name"] = zTreeNodes[i].children[j].name;
			params["rightTree["+i+"].children["+j+"].checked"]=zTreeNodes[i].children[j].checked;
			params["rightTree["+i+"].children["+j+"].open"]=zTreeNodes[i].children[j].open;
			params["rightTree["+i+"].children["+j+"].nocheck"]=zTreeNodes[i].children[j].nocheck;
			params["rightTree["+i+"].children["+j+"].chkDisabled"]=zTreeNodes[i].children[j].chkDisabled;
			
			for(var k=0;k<zTreeNodes[i].children[j].children.length;++k){
				params["rightTree["+i+"].children["+j+"].children["+k+"].id"]= zTreeNodes[i].children[j].children[k].id;
				params["rightTree["+i+"].children["+j+"].children["+k+"].name"] =zTreeNodes[i].children[j].children[k].name;
				params["rightTree["+i+"].children["+j+"].children["+k+"].checked"] =zTreeNodes[i].children[j].children[k].checked;
				params["rightTree["+i+"].children["+j+"].children["+k+"].open"]=zTreeNodes[i].children[j].children[k].open;
				params["rightTree["+i+"].children["+j+"].children["+k+"].nocheck"]=zTreeNodes[i].children[j].children[k].nocheck;
				params["rightTree["+i+"].children["+j+"].children["+k+"].chkDisabled"] =zTreeNodes[i].children[j].children[k].chkDisabled;
				
				for(var m=0;m<zTreeNodes[i].children[j].children[k].children.length;++m){
					params["rightTree["+i+"].children["+j+"].children["+k+"].children["+m+"].id"]= zTreeNodes[i].children[j].children[k].children[m].id;
					params["rightTree["+i+"].children["+j+"].children["+k+"].children["+m+"].name"]=zTreeNodes[i].children[j].children[k].children[m].name;
					params["rightTree["+i+"].children["+j+"].children["+k+"].children["+m+"].checked"]=zTreeNodes[i].children[j].children[k].children[m].checked;
					params["rightTree["+i+"].children["+j+"].children["+k+"].children["+m+"].open"] =zTreeNodes[i].children[j].children[k].children[m].open;
					params["rightTree["+i+"].children["+j+"].children["+k+"].children["+m+"].nocheck"]=zTreeNodes[i].children[j].children[k].children[m].nocheck;
					params["rightTree["+i+"].children["+j+"].children["+k+"].children["+m+"].chkDisabled"] =zTreeNodes[i].children[j].children[k].children[m].chkDisabled;
				}
			}
		}
	}
	params["role.roleId"]= $("#roleRightRoleId").val();

	com.post(api.system.updateRoleRight, params, function(res){
		com.showAlert(com.info, "操作成功");
		goBackRoleList();
	});
}

function removeRow(params, rowNums){

	var options = {};
	var nums = rowNums.split(",");
	
	for(var i=0;i< nums.length;i++){
		var row = $(this).jqGrid('getRowData', nums[i]);
		
		options["roleIds["+i+"]"] = row.roleId;
	}
	
	com.post(api.system.deleteRoleByIds, options, successCallback);
	
	$("#eData").trigger("click");
}

function saveData(){
	if(com.validate() || role.repeatFlg){
		return;
	}
	
	var url;
	var options = {
		'role.roleName': role.roleItems.roleName.val(),
		'role.roleDes': role.roleItems.roleDes.val(),
		'role.roleId': role.roleItems.roleId.val(),
	};
	
	if(role.editFlg){
		url = api.system.updateRole;
	}else{
		url = api.system.addRole;
	}
	
	com.post(url, options, successCallback);
	
	role.modal.modal("hide");   
}

function successCallback(){
	com.showAlert(com.info, "操作成功");
	$.jgrid.refreshGrid(role.listgrid, role.postParam);
}
