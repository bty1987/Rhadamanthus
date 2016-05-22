var materialOrderPreBalance = {
	listGrid: null,
	gridPager: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	materialOrderPreBalanceItems: {},
	
	caclTypeData: [{"id":"0", "name":"底价"}, {"id":"1", "name":"点位"}],
	
	editFlag: false,
};

var materialOrderPreBalancePostData = {};

jQuery(function($) {
	$('#fl-statement').statement("主材子订单", "订单信息列表");
	
	materialOrderPreBalance.listGrid = $("#listGrid");
	materialOrderPreBalance.gridPager = "#gridPager";
	materialOrderPreBalance.saveBtn = $("#saveBtn").on("click", saveData);
	materialOrderPreBalance.saveMalingBtn = $("#saveMalingBtn").on("click", saveMalingData);
	materialOrderPreBalance.cancelBtn = $("#cancelBtn");
	materialOrderPreBalance.modal = $("#materialOrderPreBalanceCalModal").on('show.bs.modal',function(e){
		com.clearValidator("#value", true);
		com.clearValidator();
	});
	materialOrderPreBalance.malingModal = $("#materialOrderMalingModal").on('show.bs.modal',function(e){
		com.clearValidator("#venderMaling", true);
		com.clearValidator();
	});
	
	materialOrderPreBalance.materialOrderPreBalanceItems.oldPoint = $("#oldPoint");
	materialOrderPreBalance.materialOrderPreBalanceItems.oldBase = $("#oldBase");
	materialOrderPreBalance.materialOrderPreBalanceItems.caclType = $("#caclType");
	materialOrderPreBalance.materialOrderPreBalanceItems.value = $("#value");
	
	materialOrderPreBalance.materialOrderPreBalanceItems.malingTotal = $("#malingTotal");
	materialOrderPreBalance.materialOrderPreBalanceItems.oldMaling = $("#oldMaling");
	materialOrderPreBalance.materialOrderPreBalanceItems.oldVenderMaling = $("#oldVenderMaling");
	materialOrderPreBalance.materialOrderPreBalanceItems.venderMaling = $("#venderMaling");
	
	materialOrderPreBalance.materialOrderPreBalanceItems.caclType.bindData(materialOrderPreBalance.caclTypeData, "id", "name");
	
	var orderSearchOpts = {
		url: api.material.pageMaterialSubOrderForPreBalance,
		postParmas: {"paging.rows":10, "paging.page":1},
		listgrid: materialOrderPreBalance.listGrid,
		items: [
	        {label:"装修订单号",id:"orderIdSearch",name:"orderId", type:'text'},
	        {label:"主材订单号",id:"orderIdSearch",name:"msoNo", type:'text'},
			{label:"楼盘地址",id:"orderAddrSearch",name:"orderAddr", type:'text'},
			{label:"业务员",id:"salesmanSearch",name:"salesman", type:'text'},
			{label:"补款时间", id:"fullCollectTimeRangeSearch", name:"fullCollectTimeRange", type:"dateRangePicker"},
        ]
	};
	$("#searchDiv").flSearch(orderSearchOpts);
	
	materialOrderPreBalance.listGrid.jqGrid({		
		url: api.material.pageMaterialSubOrderForPreBalance.url,
		colNames:['msoId', '编号', '客户名', '楼盘名', '业务员', '点位', '底价', '抹零', '厂商抹零', '创建时间', '补款时间', '描述', '套餐', '操作'],
		multiboxonly: true,
		forceFit: false,
		colModel:[
		    {name:'msoId', hidden:true},
		    {name:'msoNo'},
		    {name:'customerName', width:80},
		    {name:'orderAddr', width:250},
		    {name:'salesmanName', width:80},
		    {name:'point', hidden:true},
		    {name:'base', hidden:true},
		    {name:'maling', width:80},
			{name:'venderMaling', width:80},
			{name:'createTime', width:200},
			{name:'fullCollectTime', width:200},
			{name:'des'},
			{name:'packageFlag', hidden:true},
			{name:'action', width: 180, sortable: false, editable: false, formatter: actionInit}
		], 
		pager : materialOrderPreBalance.gridPager,
		caption: "预结算信息列表"
	});
	
	materialOrderPreBalance.listGrid.navGrid(materialOrderPreBalance.gridPager,
		{edit: false, add: false, del: false, search: false, searchicon: 'icon-search orange', refresh: false, view: false}, {}, {}, {}
	).navButtonAdd(materialOrderPreBalance.gridPager, {
		caption:"",
		buttonicon: 'icon-ok blue',
		title: "预结算",
		onClickButton: function(){
			
			var options = {};
			var num = materialOrderPreBalance.listGrid.jqGrid('getGridParam','selrow');
			
			if(num == null){
				$.jgrid.showSelectInfo(materialOrderPreBalance.listGrid.attr("id"));
				return false;
			}else{
				var _rowIds = materialOrderPreBalance.listGrid.jqGrid('getGridParam','selarrrow');
				
				var _packageFlag = 0;
				
				for(var i=0;i<_rowIds.length;i++){
					_rowInfo = materialOrderPreBalance.listGrid.jqGrid("getRowData", _rowIds[i]);
					options["msoIds[" + i + "]"] = _rowInfo.msoId;
					
					if(_rowInfo.packageFlag == "1"){
						_packageFlag = 1;
					}
				}
				
				var message = "<p>确定需要提交当前子订单的预结算处理吗?</p>";
				
				if(_packageFlag == "1"){
					message += "<p class='text-warning bigger-110 orange'><i class='icon-warning-sign'></i>当前存在套餐,是否已经设置完成计算点位?</p>";
				}
			
				bootbox.confirm(message, function(result) {
					if(result){
						com.post(api.material.preBalanceMaterialSubOrder, options, function(result){
							materialOrderPreBalance.listGrid.trigger("reloadGrid");
							com.showAlert(com.info, "确认成功!");
						}, function(result){
							com.showAlert(com.error, "确认失败!");
						});
					}
				});
			}
		},
	});
});

function actionInit(cellvalue, options, rowdata){
	
	var result = '';
	
	result += '<div class="ui-pg-div btn-group">';
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-yellow" onclick="viewMaterialOrderBalanceDetailIndex(' + rowdata.msoId + ');">子项</button>';
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-success" onclick="dialogMaterialOrderPreBalanceBacl(' + options.rowId + ');">结算值</button>';
	result += '<button id="viewDecorationOrderDetiail" class="btn btn-minier btn-danger" onclick="dialogMaterialOrderMaling(' + options.rowId + ');">抹零</button>';
	result += '</div>';
	
	return result;
}

function saveData(){
	
	var nums = materialOrderPreBalance.listGrid.jqGrid("getGridParam","selarrrow");
	
	var rowId = nums[0];
	
	var _info = materialOrderPreBalance.listGrid.jqGrid('getRowData', rowId);
	
	var options = {};
	
	options["materialSubOrder.msoId"] = _info.msoId;
	options["caclType"] = materialOrderPreBalance.materialOrderPreBalanceItems.caclType.val();
	
	if(materialOrderPreBalance.materialOrderPreBalanceItems.caclType.val() == 0){
		
		var base = materialOrderPreBalance.materialOrderPreBalanceItems.value.val();
		var priceRex = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
		if(!(priceRex.test(base) && parseFloat(base) > 0)){
			materialOrderPreBalance.materialOrderPreBalanceItems.value.focus().select();
			com.showTips(materialOrderPreBalance.materialOrderPreBalanceItems.value, "底价输入内容格式错误!", true);
			return false;
		}
		
		options["materialSubOrder.base"] = base;
	}else{
		
		var point = materialOrderPreBalance.materialOrderPreBalanceItems.value.val();
		var postDiscountRex = /^(1\.0{1,2}|1|0\.[0-9]{1,2})$/;
		if(!postDiscountRex.test(point)){
			materialOrderPreBalance.materialOrderPreBalanceItems.value.focus().select();
			com.showTips(materialOrderPreBalance.materialOrderPreBalanceItems.value, "点位输入内容格式错误!", true);
			return false;
		}
		
		options["materialSubOrder.point"] = point;
	}
	
	com.post(api.material.updateMaterialSubOrderForPreBalancePT, options, function(result){
		if(result.caclType == 0){
			materialOrderPreBalance.listGrid.setCell(rowId, "base", result.materialSubOrder.base);
		}else if(result.caclType == 1){
			materialOrderPreBalance.listGrid.setCell(rowId, "point", result.materialSubOrder.point);
		}
		materialOrderPreBalance.modal.modal("hide");
	});
}

function saveMalingData(){
	var nums = materialOrderPreBalance.listGrid.jqGrid("getGridParam","selarrrow");
	
	var rowId = nums[0];
	
	var _info = materialOrderPreBalance.listGrid.jqGrid('getRowData', rowId);
	
	var malingTotal = materialOrderPreBalance.materialOrderPreBalanceItems.malingTotal.val();
	var venderMaling = materialOrderPreBalance.materialOrderPreBalanceItems.venderMaling.val();
	
	var venderMalingRex = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
	if(!venderMalingRex.test(venderMaling)){
		materialOrderPreBalance.materialOrderPreBalanceItems.venderMaling.focus().select();
		com.showTips(materialOrderPreBalance.materialOrderPreBalanceItems.venderMaling, "修改厂商抹零数据格式不正确!", true);
		return false;
	}
	
	if(parseFloat(venderMaling) > parseFloat(malingTotal)){
		materialOrderPreBalance.materialOrderPreBalanceItems.venderMaling.focus().select();
		com.showTips(materialOrderPreBalance.materialOrderPreBalanceItems.venderMaling, "修改厂商抹零数据不能超过抹零总数!", true);
		return false;
	}
	
	var options = {};
	
	options["materialSubOrder.msoId"] = _info.msoId;
	options["materialSubOrder.maling"] = utils.accSub(malingTotal, venderMaling);
	options["materialSubOrder.venderMaling"] = venderMaling;
	
	com.post(api.material.updateMaterialSubOrderForMaling, options, function(result){
		materialOrderPreBalance.listGrid.setCell(rowId, "maling", result.materialSubOrder.maling);
		materialOrderPreBalance.listGrid.setCell(rowId, "venderMaling", result.materialSubOrder.venderMaling);
		
		materialOrderPreBalance.malingModal.modal("hide");
	});
}

function viewMaterialOrderBalanceDetailIndex(msoId){
	materialOrderPreBalancePostData["materialOrderPreBalance.msoId"] = msoId;
	$("#materialOrderPreBalancePageContent").load(api.index.materialOrderPreBalanceDetailIndex.url);
}

function dialogMaterialOrderPreBalanceBacl(rowId){
	
	var _info = materialOrderPreBalance.listGrid.jqGrid('getRowData', rowId);
	
	materialOrderPreBalance.materialOrderPreBalanceItems.value.val("");
	materialOrderPreBalance.materialOrderPreBalanceItems.caclType.bindData(materialOrderPreBalance.caclTypeData, "id", "name");
	materialOrderPreBalance.materialOrderPreBalanceItems.oldPoint.val(_info.point);
	materialOrderPreBalance.materialOrderPreBalanceItems.oldBase.val(_info.base);
	
	materialOrderPreBalance.modal.modal("show");
}

function dialogMaterialOrderMaling(rowId){
	
	var _info = materialOrderPreBalance.listGrid.jqGrid('getRowData', rowId);
	
	var maling = _info.maling;
	var venderMaling = _info.venderMaling;
	
	materialOrderPreBalance.materialOrderPreBalanceItems.malingTotal.val(utils.accAdd(maling, venderMaling));
	materialOrderPreBalance.materialOrderPreBalanceItems.oldMaling.val(maling);
	materialOrderPreBalance.materialOrderPreBalanceItems.oldVenderMaling.val(venderMaling);
	materialOrderPreBalance.materialOrderPreBalanceItems.venderMaling.val(0);
	
	materialOrderPreBalance.malingModal.modal("show");
}
