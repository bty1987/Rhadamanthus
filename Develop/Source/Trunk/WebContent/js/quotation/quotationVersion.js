var quotationVersion = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	quotationVersionItems: {},
	
	validator: {
		roleId: {
			type: "v_versionId", 
			regex: /^QV_\d{3}$/, 
			errorMsg: "请输入QV_数字,如QV_001."
		}
	},
	repeatFlg:false,
	editFlag: false
};

jQuery(function($) {
	
	quotationVersion.listGrid = $("#listGrid");
	quotationVersion.gridPager = "#gridPager";
	quotationVersion.saveBtn = $("#saveBtn").on("click", saveData);
	quotationVersion.cancelBtn = $("#cancelBtn");
	quotationVersion.modal = $("#qtModal").on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#versionId", true);
	});
	
	quotationVersion.saveCopyVersionBtn = $("#saveCopyVersionBtn").on("click", saveCopyVersionData);
	quotationVersion.cancelCopyVersionBtn = $("#cancelCopyVersionBtn");
	quotationVersion.modalCopyVersion = $("#copyVersionModal").on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#copyVersionId", true);
	});
	
	quotationVersion.quotationVersionItems.copyVersionId= $("#copyVersionId").on("blur",function(){
		$this = $(this);
		
		var options = {
			"quotationVersion.versionId": $this.val(),
		}
		
		com.post(api.quotation.queryQuotationVersionByVersionId, options, function(res){
			
			if(res.quotationVersion && res.quotationVersion.qvId){
				com.showTips($this, "该版本编号已存在", true);
				quotationVersion.repeatFlg = true;
			}else{
				com.clearValidator("#copyVersionId", true);
				quotationVersion.repeatFlg = false;
			}
		});
	});
	
	quotationVersion.quotationVersionItems.copyVersionName = $("#copyVersionName");
	quotationVersion.quotationVersionItems.copyVersionDes = $("#copyVersionDes");
	
	quotationVersion.quotationVersionItems.versionId= $("#versionId").on("blur",function(){
		$this = $(this);
		
		var options = {
			"quotationVersion.versionId": $this.val(),
		}
		
		com.post(api.quotation.queryQuotationVersionByVersionId, options, function(res){
			
			if(res.quotationVersion && res.quotationVersion.qvId){
				com.showTips($this, "该版本编号已存在", true);
				quotationVersion.repeatFlg = true;
			}else{
				com.clearValidator("#versionId", true);
				quotationVersion.repeatFlg = false;
			}
		});
	});
	
	quotationVersion.quotationVersionItems.versionName = $("#versionName");
	quotationVersion.quotationVersionItems.versionDes = $("#versionDes");
	
	$.extend(com.validator, quotationVersion.validator);
	
	var searchOpts = {
		url: api.quotation.pageQuotationVersion,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: quotationVersion.listGrid,
		items: [
		    {label:"版本名称",id:"versionNameSearch",name:"versionName", type:'text'}
		]
	};
	$("#searchDiv").flSearch(searchOpts);
	
	quotationVersion.quotationVersionItems.defaultFlag = $("#defaultFlag");
	
 	quotationVersion.quotationVersionItems.defaultFlag.switchBtn();
	
	quotationVersion.quotationVersionItems.defaultFlag.click(function(e){
		quotationVersion.quotationVersionItems.defaultFlag.value = quotationVersion.quotationVersionItems.defaultFlag.value == 0 ? 1 : 0;
	});

	quotationVersion.listGrid.jqGrid({		
		url: api.quotation.pageQuotationVersion.url,
		colNames:['编号', '名称', '信息', '默认版本','操作'],
		colModel:[
			{name:'versionId', editable:true, edittype:"text"},
			{name:'versionName', editable:true, edittype:"text", editoptions:{size:"20",maxlength:"30"}},
			{name:'versionDes', editable:true, sortable:false, edittype:"textarea"},
			{name:'defaultFlag', editable:true, formatter:defaultFlagFormat ,unformat:defaultFlagUnFormat},
			{name:'action', formatter:initAction}
		], 
		pager : quotationVersion.gridPager,
		caption: "报价版本信息列表"
	});

	quotationVersion.listGrid.navGrid(quotationVersion.gridPager,
		{edit: false, add: false, del: false, search: false, refresh: false, view: false}, {}, {}, {}
	).navButtonAdd(quotationVersion.gridPager,{
		caption: "",
		buttonicon: "icon-pencil blue",
		title: "编辑",
		onClickButton: function(){
			quotationVersion.editFlg = true;
			var num = quotationVersion.listGrid.jqGrid("getGridParam", 'selrow');
			
			if(num == null){
				$.jgrid.showSelectInfo(quotationVersion.listGrid.attr("id"));
				return;
			}
			
			var row = quotationVersion.listGrid.jqGrid("getRowData", num);
			quotationVersion.quotationVersionItems.versionId.val(row.versionId);
			quotationVersion.quotationVersionItems.versionName.val(row.versionName);
			quotationVersion.quotationVersionItems.versionDes.val(row.versionDes);
			
			quotationVersion.quotationVersionItems.versionId.prop("disabled", true).css("display", "block");
			
			if(quotationVersion.quotationVersionItems.defaultFlag.value == undefined){
				if(row.defaultFlag == 1){
					quotationVersion.quotationVersionItems.defaultFlag.click();
				}
				quotationVersion.quotationVersionItems.defaultFlag.value = row.defaultFlag;
			}else{
				if(quotationVersion.quotationVersionItems.defaultFlag.value != row.defaultFlag){
					quotationVersion.quotationVersionItems.defaultFlag.click();
				}
				quotationVersion.quotationVersionItems.defaultFlag.value = row.defaultFlag;
			}
			
			quotationVersion.modal.modal("show");
		},
		position: "first"
	}).navButtonAdd(quotationVersion.gridPager, {
		caption: "",
		buttonicon: "icon-plus-sign purple",
		title: "添加",
		onClickButton: function(){
			
			quotationVersion.quotationVersionItems.versionId.css("display", "none");
			
			quotationVersion.editFlg = false;
			com.cleanItems(quotationVersion.quotationVersionItems);
			quotationVersion.quotationVersionItems.versionId.prop("disabled",false);
			quotationVersion.modal.modal("show");
		},
		position: "first"
	});
});

function defaultFlagFormat( cellvalue, options, rowObject ){  
	if(cellvalue == 1){
		return '是 <input type="text" value="1" class="hidden" />  ';
	}
	
    return '否<input type="text" value="0" class="hidden" />';  
} 

function defaultFlagUnFormat( cellvalue, options, cell){  
	return $('input', cell).val();
}  

function initAction(cellvalue, options, rowObject){
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button class="btn btn-minier btn-primary" onclick="copyQuotationVersion(\''+rowObject.versionId+'\');">复制报价</button>';
	result += '</div>';
	
	return result;
}

function copyQuotationVersion(versionId){
	$("#copySourceVersionId").val(versionId);
	quotationVersion.modalCopyVersion.modal("show");
}

function saveData(){
	com.clearValidator();
	com.clearValidator("#versionId", true);
	
	if(com.validate("qtModal")|| quotationVersion.repeatFlg){
		return;
	}
	
	var url;
	var options = {
		"quotationVersion.versionId": quotationVersion.quotationVersionItems.versionId.val(),
		"quotationVersion.versionName": quotationVersion.quotationVersionItems.versionName.val(),
		"quotationVersion.defaultFlag": quotationVersion.quotationVersionItems.defaultFlag.prop("checked") ? 1 : 0,
		"quotationVersion.versionDes": quotationVersion.quotationVersionItems.versionDes.val()
	};
	
	if(quotationVersion.editFlg){
		url = api.quotation.updateQuotationVersion;
	}else{
		url = api.quotation.addQuotationVersion;
	}
	
	com.post(url, options, successCallback, failCallback);
	
	quotationVersion.modal.modal("hide");
}

function saveCopyVersionData(){
	com.clearValidator();
	com.clearValidator("#copyVersionId", true);
	
	if(com.validate("copyVersionModal")|| quotationVersion.repeatFlg){
		return;
	}
	
	var quotationVersionItems = quotationVersion.quotationVersionItems;
	
	var options = {
		"versionId": $("#copySourceVersionId").val(),
		"quotationVersion.versionId": quotationVersionItems.copyVersionId.val(),
		"quotationVersion.versionName": quotationVersionItems.copyVersionName.val(),
		"quotationVersion.defaultFlag": 0,
		"quotationVersion.versionDes": quotationVersionItems.copyVersionDes.val()
	};
	
	com.post(api.quotation.copyQuotationVersion, options, successCallback, failCallback);
	
	quotationVersion.modalCopyVersion.modal("hide");
}

function successCallback(){
	quotationVersion.listGrid.trigger("reloadGrid");
	com.showAlert(com.info, "操作成功");
	
}

function failCallback(){
	
}

function cleanItems(){
	
}