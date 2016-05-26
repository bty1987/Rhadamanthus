var userSalary = {
		
	employType: [],
	deptType: [],
	experienceType: [],
	dutyTypeMap: {},
	deptList: {},
	deptKey: "deptId",
	deptValue: "deptName",
	
	querySalaryTypeUrl:"ds/salaryTypeList.json",
	
	listGrid: null,
	gridPager: null,
	
	listUserSalaryHistoryGrid: null,
	gridUserSalaryHistoryPager: null,
	
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	userSalaryItems: {},
	
	importUserSalaryUrl:"importUserSalary.do",
	editFlg: false,
	
	importModal:null,
	importBtn:null
};

jQuery(function($) {
	userSalary.modal = $("#userSalaryModal");
	userSalary.modal.on('show.bs.modal', function(e){
		com.clearValidator();
	});
	
	userSalary.importModal = $("#importModal");
	userSalary.importBtn = $("#importBtn");
	userSalary.cancelImportBtn = $("#cancelImportBtn").on('click', function(e){
		userSalary.importFile.html("");
	});
	
	userSalary.importModal.on('hide.bs.modal', function(e){
		userSalary.importFile.Huploadify('cancel', '*');
		userSalary.importFile.html("");
	}).on('show.bs.modal',function(e){
		initUploadify();
	});
	
	com.post(api.ds.departmentInfo, {}, function(res){
		userSalary.deptType = res.deptType;
	}, null, false);
	
	com.post(api.ds.personInfo, {}, function(res){
		userSalary.educationType = res.educationType;
		userSalary.houseType = res.houseType;
		userSalary.statusType = res.statusType;
		userSalary.employWayType = res.employWayType;
		userSalary.employType = res.employType;
		userSalary.experienceType = res.experienceType;
		userSalary.dutyTypeMap = res.dutyTypeMap;
	}, null, false);
	
	userSalary.listGrid = $("#listGrid");
	userSalary.gridPager = "#gridPager";
	
	userSalary.listUserSalaryHistoryGrid = $("#listUserSalaryHistoryGrid");
	userSalary.gridUserSalaryHistoryPager = "#gridUserSalaryHistoryPager";

	userSalary.userSalaryItems.autoId = $("#autoId");
	userSalary.userSalaryItems.userId =  $("#userId");
	userSalary.userSalaryItems.money =  $("#money");
	userSalary.userSalaryItems.type = $("#type");
	userSalary.userSalaryItems.comments = $("#comments");
	
	userSalary.importFile = $('#importFile');
	
	userSalary.saveBtn = $("#saveBtn").on("click",saveSalaryItem);
	
	com.post(api.ds.salaryType, {'dept.type': $(this).val()}, function(res){
		userSalary.userSalaryItems.type.bindData(res.salaryTypeList, "key", "value");
	});
	
	var searchOpts = {
		url: userSalary.queryUrl,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: userSalary.listGrid,
		items: [
	        {label:"员工编号",id:"userIdSearch",name:"userId", type:'text'},
	        {label:"姓名", id:"userNameSearch", name:"userName",type:'autoFillPinyinText', url:api.personel.queryUserForNameByPinyinName},
	        {label:"部门类型", id:"deptTypeSearch", name:"deptType", type:"select"},
	        {label:"部门", id:"deptSearch", name:"deptId", type:"select"}
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	$("#deptTypeSearch").bindData(userSalary.deptType, "", "", true).on("change", function(){
		if($(this).val() == "" || $(this).val() == undefined){
			$("#deptSearch").bindData([], "", "", true);
			return;
		}
		com.post(api.department.queryDepartment, {'dept.type': $(this).val()}, function(res){
			$("#deptSearch").bindData(res.deptList, userSalary.deptKey, userSalary.deptValue, true);
		});
	}).trigger("change");
	
	var searchHistoryOpts = {
		url: userSalary.queryHistoryUrl,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: userSalary.listUserSalaryHistoryGrid,
		items: [ 
         	{label:"员工编号",id:"userIdHistorySearch",name:"userId", type:'text'},
	        {label:"姓名", id:"userNameHistorySearch", name:"userName",type:'autoFillPinyinText', url:api.personel.queryUserForNameByPinyinName},
	        {label:"部门类型", id:"deptTypeHistorySearch", name:"deptType", type:"select"},
	        {label:"部门", id:"deptHistorySearch", name:"deptId", type:"select"},
	        {label:"创建时间", id:"userSalaryDateSearch", name:"userSalaryDateRange",type:"dateRangePicker",op:"between"}
		]
	};
	$("#searchUserSalaryHistoryDiv").flSearch(searchHistoryOpts);
	$("#deptTypeHistorySearch").bindData(userSalary.deptType, "", "", true).on("change", function(){
		if($(this).val() == "" || $(this).val() == undefined){
			$("#deptHistorySearch").bindData([], "", "", true);
			return;
		}
		com.post(api.department.queryDepartment, {'dept.type': $(this).val()}, function(res){
			$("#deptHistorySearch").bindData(res.deptList, userSalary.deptKey, userSalary.deptValue, true);
		});
	}).trigger("change");
	
	initUserList();
	initUserSalaryHistoryList();
	
	$("#history").removeClass("active");
});

function initUploadify(){

	$('#importFile').Huploadify({
        'debug' : false, // 开启调试
        'auto':true, // 是否自动上传
        'successTimeout':config.uploadTimeout, // 超时时间
        'formData':{
        	'uploadType':4,
        }, // 附带值
        //'swf': "./js/uploadify/uploadify.swf",
        'overrideEvents' : ['onDialogClose'], // 不执行默认的onSelect事件
        //'queueID':'uploadfileQueue', // 文件选择后的容器ID
        'fileObjName':'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'uploader':userSalary.importUserSalaryUrl, // 上传处理程序
        //'buttonImage':'upbutton.gif', // 浏览按钮的背景图片路径
        'width':'100', // 浏览按钮的宽度
        'height':'32', // 浏览按钮的高度
        //'expressInstall':'expressInstall.swf',  // expressInstall.swf文件的路径
        'fileTypeDesc':'支持的格式：',  // 在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeExts':'*.xls;*.xlsx', // 允许上传的文件后缀
        'fileSizeLimit':'5MB', // 上传文件的大小限制
        'queueSizeLimit' : 1, // 上传数量
        'onUploadProgress' : function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) { // 每次更新上载的文件的进展
             //有时候上传进度什么想自己个性化控制，可以利用这个方法
             //使用方法见官方说明
        }, 'onSelect' : function(file) { //选择上传文件后调用
                  
        }, 'onSelectError':function(file, errorCode, errorMsg){ // 返回一个错误，选择文件的时候触发
            switch(errorCode) {
                case -100:
                    alert("上传的文件数量已经超出系统限制的"+$('#importFile').uploadify('settings', 'queueSizeLimit')+"个文件!");
                    break;
                case -110:
                    alert("文件 ["+file.name+"] 大小超出系统限制的"+$('#importFile').uploadify('settings', 'fileSizeLimit')+"大小!");
                    break;
                case -120:
                    alert("文件 ["+file.name+"] 大小异常!");
                    break;
                case -130:
                    alert("文件 ["+file.name+"] 类型不正确!");
                    break;
            }
        }, 'onUploadSuccess':function(file, data, response){ //上传到服务器，服务器返回相应信息到data里
        	var dateObj = eval("("+data+")");
        	if(dateObj.errorCode == 0){
        		 com.showAlert(com.info, "操作成功");
        		 $("#fl_btn_searchUserSalaryHistoryDiv").trigger("click");
        		 userSalary.importBtn.prop("disabled",false);
        		 userSalary.importModal.modal("hide");

        	 }else{
        		com.showAlert(com.info, "操作失败");
        		userSalary.importModal.modal("hide");
	            bootbox.alert(res.errorMsg);
	         }
        }
    });
}

function initUserList(){
	userSalary.listGrid.jqGrid({		
		url: api.personel.pageUser.url,
		colNames:['员工编号', '姓名','电话', '职位', '工资', '操作'],
		colModel:[
		    {name:'userId'},
			{name:'userName'},
			{name:'phone'},
			{name:'duty'},
			{name:'salary'},
			{name:'action',jsonmap:'userId', width: 180, sortable: false, editable: false, formatter: actionInit}
		], 
		sortable:false,
		pager : userSalary.gridPager,
		caption: ""
	});

	userSalary.listGrid.navGrid(userSalary.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	).navButtonAdd(userSalary.gridPager, {
		caption:"",
		buttonicon: 'icon-external-link blue',
		onClickButton: function(){    
			userSalary.importBtn.prop("disabled", true);
			userSalary.importModal.modal("show");
		},
		position: 'first'
	});
}

function initUserSalaryHistoryList(){
	userSalary.listUserSalaryHistoryGrid.jqGrid({		
		url: api.personel.pageUserSalary.url,
		colNames:['编号','员工编号', '姓名','电话', '职位','类型', '金额','创建日期','创建人', '状态','说明'],
		colModel:[
		    {name:'autoId',hidden:true},
		    {name:'userId'},
			{name:'userName'},
			{name:'phone'},
			{name:'duty'},
			{name:'type'},
			{name:'money'},
			{name:'createTime'},
			{name:'createUserName'},
			{name:'status',formatter: statusInit},
			{name:'comments'}
		], 
		sortable:false,
		pager : userSalary.gridUserSalaryHistoryPager,
		caption: ""
	});

	userSalary.listUserSalaryHistoryGrid.navGrid(userSalary.gridUserSalaryHistoryPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {},
		$.jgrid.searchFunc($(this))
	).navButtonAdd(userSalary.gridUserSalaryHistoryPager, {
		caption:"",
		buttonicon: 'icon-pencil blue',
		onClickButton: function(){    

			var num = userSalary.listUserSalaryHistoryGrid.jqGrid("getGridParam", 'selrow');
			
			if(num==null){
				$.jgrid.showSelectInfo(userSalary.listUserSalaryHistoryGrid.attr("id"));
				return;
			}
			var row = userSalary.listUserSalaryHistoryGrid.jqGrid("getRowData", num);
			
			if(row.status == '已结算'){
				bootbox.alert("该项以结算完成，不可修改");
				return;
			}
			userSalary.editFlg =  true;
			
			userSalary.userSalaryItems.userId.val(row.userId);
			userSalary.userSalaryItems.autoId.val(row.autoId);
			userSalary.userSalaryItems.money.val(row.money);
			userSalary.userSalaryItems.type.val(row.type);
			userSalary.userSalaryItems.comments.val(row.comments);
			userSalary.modal.modal("show");
		},
		position: 'first'
	});
}

function statusInit(cellvalue, options, rowdata){
	var result = '';
	if(cellvalue == 1){
		result = '已结算';
	}else{
		result = "初始状态";
	}
	
	return result;
}

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button id="" class="btn btn-minier btn-red" onclick="userSalaryFunc(\''+cellvalue+'\');">添加</button>';
	result += '</div>';
	
	return result;
}

function userSalaryFunc(userId){
	com.cleanItems(userSalary.userSalaryItems);
	
	userSalary.editFlg = false;
	userSalary.userSalaryItems.userId.val(userId);
	userSalary.userSalaryItems.type.get(0).selectedIndex = 0;
	userSalary.modal.modal("show");
}

function saveSalaryItem(){
	if(com.validate("userSalaryModal")){
		return;
	}
	
	var url = "";
	var options = {
		"userSalary.userId":userSalary.userSalaryItems.userId.val(),
		"userSalary.type":userSalary.userSalaryItems.type.val(),
		"userSalary.comments":userSalary.userSalaryItems.comments.val(),
		"userSalary.money":userSalary.userSalaryItems.money.val()
	};
	
	if(userSalary.editFlg == false){
		url = api.personel.addUserSalary;
	}else{
		options["userSalary.autoId"] = userSalary.userSalaryItems.autoId.val();
		url = api.personel.updateUserSalary;
	}
	
	com.post(url, options, function(res){
		com.showAlert(com.info, "操作成功");
		$("#fl_btn_searchUserSalaryHistoryDiv").trigger("click");
	});
	
	userSalary.modal.modal("hide");
}
