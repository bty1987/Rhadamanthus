var notice = {
	listgrid: null,
	gridPager: null,
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	items:{},
	
	editFlg: false,
	postParam: {},

	repeatFlg: false
};

jQuery(function($) {
	
	notice.listgrid = $("#listgrid");
	notice.gridPager = "#gridPager";
	notice.saveBtn = $("#saveBtn").on("click", saveData);
	notice.cancelBtn = $("#cancelBtn");

	notice.items.theme = $("#theme");
	notice.items.typeSel = $("#typeSel");
	notice.items.prioritySel = $("#prioritySel");
	notice.items.startTime = $("#startTime");
	notice.items.endTime = $("#endTime");
	notice.items.isPublic = $("#isPublic").switchBtn("isOrNot");
	notice.items.contents = $("#contents");
	
	notice.modal = $("#noticeModal");
	notice.modal.on('show.bs.modal',function(e){
		com.clearValidator();
	});
	bindUploadfiy();
	
	var searchOpts = {
		url: api.information.pageNotice,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: notice.listgrid,
		items: [
	        {label:"主题",id:"theme",name:"theme", type:'text'},
	        {label: "时间", id: "dateRangeSearch", name:"dateRange", type: "dateRangePicker"},
	        {label: "部门", id: "deptSearch", name: "deptId", type: "select"}
        ]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	$('.date-picker').datepicker({autoclose:true}).on("show",function(){
		setTimeout(function(){
            $('.dropdown-menu').css('z-index', 1060);
        }, 0);
	}).next().on(ace.click_event, function(){
		$(this).prev().focus();
	});
	
	com.post(api.department.queryDepartment, {'dept.type': 'all'}, function(res){
		$("#deptSearch").bindData(res.deptList, "deptId", "deptName", true);
	});
	
	initializeListgrid(notice.postParam);
	
	initializeContent();
});

function initializeListgrid(){
	
	notice.listgrid.jqGrid({		
		url: api.information.pageNotice.url,
		postData: notice.postParam,
		colNames:['ID', '主题', '类型', '优先级', '发布部门', '发布人', '开始时间', '结束时间', '公开', '内容', '附件'],
		colModel:[
		    {name:'noticeId', hidden: true},
			{name:'theme', width:40},
			{name:'type', width:10},
			{name:'priority', width:15},
			{name:'deptName', width:20, jsonmap:'dept.deptName'},
			{name:'userName', width:20, jsonmap:'user.userName'},
			{name:'startTime', width:25},
			{name:'endTime', width:25},
			{name:'isPublic', width:10},
			{name:'contentsText'},
			{name:'attachmemt', width:12, align:"center", formatter: attachmentIcon}
		], 
		pager : notice.gridPager,
		caption: "公告列表"
	});

	notice.listgrid.navGrid(notice.gridPager, {edit:false,add:false,del:true,search:false,refresh: false,view: false},{},{},
		$.jgrid.deleteFunc(removeRow),
		$.jgrid.searchFunc($(this))
	).navButtonAdd(notice.gridPager, { //edit
		caption:"",
		buttonicon: 'icon-pencil blue',
		onClickButton: function(){    
			editFlg = true;
			
			var row = $.jgrid.getRowData.call(notice.listgrid, "noticeId");
			
			if(row == undefined){
				return;
			}
			
			notice.items.noticeId = row.noticeId;
			notice.items.userId = row.user.userId;
			notice.items.theme.val(row.theme);
			notice.items.typeSel.val(row.type);
			notice.items.prioritySel.val(row.priority);
			notice.items.deptSel = row.dept.deptId;
			notice.items.startTime.val(row.startTime);
			notice.items.endTime.val(row.endTime);
			notice.items.isPublic.prop('checked', com.isOrNotType[row.isPublic]);
			notice.items.contents.html(row.contents);
			notice.modal.modal("show");
		},
		position: 'first'
	}).navButtonAdd(notice.gridPager, { //add
		caption:"",
		buttonicon: 'icon-plus-sign purple',
		onClickButton: function(){   
			editFlg = false;
			com.cleanItems(notice.items);
			notice.items.contents.html("");
			notice.modal.modal("show");   
		},
		position: 'first'
	});
}

function attachmentIcon(cellvalue, options, row){
	var res = "";
	if(row.filePath!=undefined && row.filePath != null && row.filePath != ""){
		res = "<a href="+window.mediaServer+row.filePath+"?t="+new Date().getTime()+" onclick='window.open(this.href);return false;'><i id="+row.noticeId+" class='icon-download-alt bigger-110 blue'></i>";
	}
	return res;
}

function removeRow(params, rowNums){
	var nums = rowNums.split(",");
	var options = {};
	
	for(var i = 0; i< nums.length; i++){
		var row = $(this).jqGrid('getRowData', nums[i]);
		options["noticeIds["+i+"]"] = row.noticeId;
	}
	
	com.post(api.information.deleteNotice, options, successCallback);
	
	$("#eData").trigger("click");
}

function saveData(){
	if(com.validate() || notice.repeatFlg){
		return;
	}
	
	if(notice.items.contents.text().trim() == ""){
		com.showTips(notice.items.contents, "内容不能为空.");
		return;
	}
	
	var url;
	var options = {
		'notice.theme': notice.items.theme.val(),
		'notice.type': notice.items.typeSel.val(),
		'notice.priority': notice.items.prioritySel.val(),
		'notice.user.userId': notice.items.userId,
		'notice.startTime': notice.items.startTime.val(),
		'notice.endTime': notice.items.endTime.val(),
		'notice.isPublic':com.isOrNotType[notice.items.isPublic.prop("checked")],
		'notice.contents': notice.items.contents.html(),
		'notice.contentsText': notice.items.contents.text(),
		'notice.filePath': $("#filePath").val()
	};
	
	if(editFlg){
		url = api.information.updateNotice;
		options['notice.noticeId'] = notice.items.noticeId;
		options['notice.dept.deptId'] = notice.items.deptSel;
	}else{
		url = api.information.addNotice;
	}
	
	com.post(url, options, successCallback);
	notice.modal.modal("hide");   
}
function successCallback(){
	com.showAlert(com.info, "操作成功");
	$.jgrid.refreshGrid(notice.listgrid, notice.postParam);
}

function initializeContent(){
	$('#contents').ace_wysiwyg({
		toolbar:['font', null, 'fontSize', null, {name:'bold', className:'btn-info'}, {name:'italic', className:'btn-info'}, {name:'strikethrough', className:'btn-info'},
			{name:'underline', className:'btn-info'}, null,{name:'insertunorderedlist', className:'btn-success'},{name:'insertorderedlist', className:'btn-success'},
			{name:'outdent', className:'btn-purple'},{name:'indent', className:'btn-purple'},null,{name:'justifyleft', className:'btn-primary'},
			{name:'justifycenter', className:'btn-primary'},{name:'justifyright', className:'btn-primary'},{name:'justifyfull', className:'btn-inverse'},null,
			null,null,null,null,null,'foreColor',null,{name:'undo', className:'btn-grey'},
			{name:'redo', className:'btn-grey'}],
		'wysiwyg': {fileUploadError: showErrorAlert}
	}).prev().addClass('wysiwyg-style2');
	
	if (typeof jQuery.ui !== 'undefined' && /applewebkit/.test(navigator.userAgent.toLowerCase())) {
		var lastResizableImg = null;
		function destroyResizable() {
			if(lastResizableImg == null) return;
			lastResizableImg.resizable( "destroy" );
			lastResizableImg.removeData('resizable');
			lastResizableImg = null;
		}
		var enableImageResize = function() {
			$('.wysiwyg-editor').on('mousedown', function(e) {
				var target = $(e.target);
				if(e.target instanceof HTMLImageElement) {
					if(!target.data('resizable')) {
						target.resizable({
							aspectRatio: e.target.width / e.target.height,
						});
						target.data('resizable', true);
						
						if( lastResizableImg != null ) {//disable previous resizable image
							lastResizableImg.resizable( "destroy" );
							lastResizableImg.removeData('resizable');
						}
						lastResizableImg = target;
					}
				}
			}).on('click', function(e) {
				if( lastResizableImg != null && !(e.target instanceof HTMLImageElement) ) {
					destroyResizable();
				}
			}).on('keydown', function() {
				destroyResizable();
			});
	    };
		enableImageResize();
	}
}

function showErrorAlert (reason, detail) {
	var msg='';
	if (reason==='unsupported-file-type') { msg = "Unsupported format " +detail; }
	else {
		console.log("error uploading file", reason, detail);
	}
	$('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button>'+ 
	 '<strong>File upload error</strong> '+msg+' </div>').prependTo('#alerts');
}

function bindUploadfiy(){
	$("#attachment").Huploadify({
        'debug' : false,
        'auto':true,
        'successTimeout':300,
        'formData':{
            'username':'用户名',
            'rnd':'加密密文',
            'uploadType':3
        },
        'buttonText': '上传附件',
        'buttonClass': 'btn btn-sm btn-primary lineheight0',
        'overrideEvents' : ['onDialogClose'], // 不执行默认的onSelect事件
        'fileObjName':'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'uploader': window.mediaServer + api.common.uploadOther.url, // 上传处理程序
        'width':'78', // 浏览按钮的宽度
        'onUploadSuccess':function(file, data, response){ // 上传到服务器，服务器返回相应信息到data里
        	var dateObj=eval("("+data+")");
        	 if(dateObj.errorCode == 0){
        		 	$("#filePath").val(dateObj.resUrl);
	            }else{
	            	alert(data);
	            }
        }
    });
}
