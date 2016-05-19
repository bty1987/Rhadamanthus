var resetpw = {
	listgrid: null,
	gridPager: null,
};

jQuery(function($) {

	resetpw.listgrid = $("#listgrid");
	resetpw.gridPager = "#gridPager";
	var searchOpts = {
			url: api.personel.pageUserForResetPassword,
			postParmas: {"paging.rows":10, "paging.page":1},
			listgrid: resetpw.listgrid,
			items: [{label:"员工编号", id:"userIdSearch", name:"userId",type:'text'}]
		};
		$("#searchDiv").flSearch(searchOpts);
	
	resetpw.listgrid.jqGrid({		
		url: api.personel.pageUserForResetPassword.url,
		postData: {},
		colNames:['员工工号', '姓名', '用户名', '部门', '职位', '角色', '联系方式', '操作'],
		colModel:[
		    {name:'userId'},
		    {name:'userName'},
		    {name:'loginId'},
		    {name:'deptName', jsonmap:'dept.deptName'},
		    {name:'duty'},
		    {name:'role', jsonmap:'role.roleName'},
		    {name:'phone'},
		    {name:"actions", width:80, align:"center", formatter: resetBtn}], 
		pager : resetpw.gridPager,
		caption: "用户信息列表"
	});
});

function resetBtn(cellvalue, options, row){
	var result = '';
	result += '<div class="ui-pg-div btn-group">';
	result += '<button class="btn btn-minier btn-primary" onclick="resetPassword(\''+row.userId+'\',\''+row.userName+'\');">重置密码</button>';
	result += '</div>';
	return result;
}

function resetPassword(userId, userName){
	bootbox.confirm("确定要重置（"+userName+"）的密码吗？",function(result){
		if(result == true){
			com.post(api.personel.resetPassword, {'user.userId': userId}, successCallback);
		}
	});
}

function successCallback(){
	com.showAlert(com.info, "操作成功");
	$.jgrid.refreshGrid(resetpw.listgrid, resetpw.postParam);
}

