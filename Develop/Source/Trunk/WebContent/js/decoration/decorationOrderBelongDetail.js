var orderBelongInfo = {
	belongType:null,
	decorationOrderId:null,
	belongStatus:null,
	
	orderBelongInfos:null,
	loadOrderBelongInfo:loadOrderBelongInfo,
	initOrderBelongInfo:initOrderBelongInfo,
	
	lastEditId:-1,
};

jQuery(function($) {
	
	$('#fl-statement').statement("订单归属", "归属详细信息");
	
	orderBelongInfo.decorationOrderId = params.orderId;
	orderBelongInfo.belongStatus = params.orderBelongStatus;
	orderBelongInfo.belongType = params.orderBelongType;
	
	$("#belongUserId").chosen({
	    allow_single_deselect: true
	}); 
	$("#belongUserId_chosen input").bind("input",funcUserChange);
	
	$("#belongUserId").on("change",function(e){
		if($("#belongUserId").val() == null || $("#belongUserId").val() == ""){
			return;
		}
		
		com.post(api.personel.queryUserByUserId, {"user.userId":$("#belongUserId").val()}, function(res){
			
			$("#belongUser").val(res.user.userName);
			$("#belongDept").val(res.user.dept.deptName);
			$("#belongRegion").val(res.user.dept.fatherDept.deptName);
			$("#belongDeptId").val(res.user.dept.deptId);
			$("#belongRegionId").val(res.user.dept.fatherDept.deptId);
		});
	});
	
	$("#defaultFlag").switchBtn("isOrNot");
	
	$('#detailBckBtn').on(ace.click_event, function(){
		$("#fl-container").load(api.index.decorationOrderBelongIndex.url);
	});
	
	$('#saveBelongInfoBtn').on(ace.click_event, function(){
		if(orderBelongInfo.lastEditId!=-1){
			var gridEditRes = $("#belongInfoList").jqGrid('saveRow',orderBelongInfo.lastEditId);
			if(gridEditRes){
				var newRowData = $("#belongInfoList").jqGrid("getRowData", orderBelongInfo.lastEditId); 
				var su=$("#belongInfoList").jqGrid('setRowData',orderBelongInfo.lastEditId,newRowData);
				orderBelongInfo.lastEditId=-1;
				changeItem("belongInfoList");
			}else{
				return;
			}
		}
		saveOrderBelongInfo();
	});
		
	$("#addNewUserBtn").on(ace.click_event, function(event){
		if(orderBelongInfo.lastEditId!=-1){
			var gridEditRes = $("#belongInfoList").jqGrid('saveRow',orderBelongInfo.lastEditId);
			if(gridEditRes){
				var newRowData = $("#belongInfoList").jqGrid("getRowData", orderBelongInfo.lastEditId); 
				var su=$("#belongInfoList").jqGrid('setRowData',orderBelongInfo.lastEditId,newRowData);
				orderBelongInfo.lastEditId=-1;
				changeItem("belongInfoList");
			}else{
				return;
			}
		}
		com.clearValidator();
		
		if(com.validate("addUserModal"))
			return;
		
		var addRow = {};

		addRow.belongUserId = $("#belongUserId").val();
		addRow.belongUser= $("#belongUser").val();
		addRow.belongDept= $("#belongDept").val();
		addRow.belongRegion = $("#belongRegion").val();
		addRow.belongRate= $("#belongRate").val();
		addRow.belongDeptId= $("#belongDeptId").val();
		addRow.belongRegionId= $("#belongRegionId").val();
		addRow.defaultFlag = com.isOrNotType[$("#defaultFlag").prop("checked")];

		for(var i=0;i<orderBelongInfo.orderBelongInfos.length;++i){
			if(orderBelongInfo.orderBelongInfos[i].belongUserId == addRow.belongUserId){
				bootbox.alert("该员工编号("+addRow.belongUserId+")已存在不能重复添加");
				return;
			}
		}
		
		var ids = $("#belongInfoList").jqGrid('getDataIDs');
		var maxid = Math.max.apply(null, ids);
		if(maxid == -Infinity){
			maxid = 0;
		}
		$("#belongInfoList").jqGrid('addRowData',maxid+1,addRow,"first");
		orderBelongInfo.orderBelongInfos.push(addRow);
		
		changeItem("belongInfoList");
		
		event.stopPropagation();
	});
	
	$("#approveManSel").chosen({allow_single_deselect: true}); 
	$("#approveManSel_chosen input").bind("input", function(){
		var pinyinName = $(this).val();
		if($(this).val()!=""){
			var shenPiType = 3;
			com.post(api.system.queryApproveUserForNameByType, {"user.userNamePinYin": pinyinName, "userApprove.type": shenPiType}, function(res){
				if(res.errorCode == 0){
					
					var html1 = '<option value="">&nbsp;</option>';
					if(res.autoFillKeyValue!=null){
						var i = 0;
						for(i=0;i<res.autoFillKeyValue.length;++i){
							html1+= '<option value="'+res.autoFillKeyValue[i].key+'">'+res.autoFillKeyValue[i].value+'</option>';
						}
						
					}
					$("#approveManSel").html(html1).trigger("chosen:updated");
				}
			});
		}
	});
	$("#approveManSel_chosen").css("width", "200px");
	
	$("#cApproveSaveBtn").on("click", function(){
		com.clearValidator();
		
		if(com.validate("approveModal")){
			return;
		}
		
		var options = {};
		
		var temOrderBelongInfos = orderBelongInfo.orderBelongInfos;
		var num = 0;
		var rate = 0;
		var defaultCount = 0;
		
		for(var i = 0;i<temOrderBelongInfos.length;++i){
			var _orderBelongInfo = temOrderBelongInfos[i];
			
			options["approvalOrderBelongItems["+num+"].orderId"] = orderBelongInfo.decorationOrderId;
			options["approvalOrderBelongItems["+num+"].belongUserId"] = _orderBelongInfo.belongUserId;
			options["approvalOrderBelongItems["+num+"].belongRate"] = _orderBelongInfo.belongRate;
			options["approvalOrderBelongItems["+num+"].defaultFlag"] = _orderBelongInfo.defaultFlag;
			
			if(temOrderBelongInfos[i].defaultFlag == '是'){
				defaultCount++;
			}
			
			rate += parseFloat(temOrderBelongInfos[i].belongRate);
			++num;
		}
		
		if(rate != 1){
			bootbox.alert("分配比例的和必须是1");
			return;
		}
		
		if(defaultCount != 1){
			bootbox.alert("必须有一个是默认归属用户");
			return;
		}
			
		options["approvalOrderBelong.orderId"] = orderBelongInfo.decorationOrderId;
		options["approvalOrderBelong.belongType"] = orderBelongInfo.belongType;
		
		options["approval.receiverId"] = $("#approveManSel").val();
		options["approval.comment"] = $("#changeReason").val();
		
		com.post(api.approval.submitApprovalForOrderBelong, options, function(res){
			com.showAlert(com.info, "操作成功");
			$("#fl-container").load(api.index.decorationOrderBelongIndex.url);
		});
		
		$("#approveModal").modal("hide");
	});
	
	loadOrderBelongInfo();
});

function funcUserChange(e){
	var auroFileSearchValue = $("#belongUserId_chosen input").val();
	if($("#belongUserId_chosen input").val()!=""){
		var options = null;
		if(orderBelongInfo.belongType == "设计"){
			options = {"pinyinName":auroFileSearchValue,"duty":"设计师"};
		}else if(orderBelongInfo.belongType == "业务"){
			options = {"pinyinName":auroFileSearchValue,"duty":""};
		}
		
		com.post(api.personel.queryUserForNameByDuty, options, function(res){
			if(res.errorCode == 0){
				var html1 = '<option value="">&nbsp;</option>';
				if(res.autoFillList!=null){
					
					var i = 0;
					for(i=0;i<res.autoFillList.length;++i){
						html1+= '<option value="'+res.autoFillKeyValue[i].key+'">'+res.autoFillKeyValue[i].value+'</option>';
					}
				}
				$("#belongUserId").html(html1);
				$("#belongUserId").trigger("chosen:updated");
			}
		});
	}
}

//--------------------------------------------------------服务器端加载数据-------------------------------------------------------
function loadOrderBelongInfo(){
	var url = "";
	if(orderBelongInfo.belongType == '设计'){
		url = api.decoration.queryOrderBelongInfoForDesignAChangeByOrderId;
	}else if(orderBelongInfo.belongType == '业务'){
		url = api.decoration.queryOrderBelongInfoForBusinessnAChangeByOrderId;
	}
	com.post(url, {"orderBelongInfo.orderId":orderBelongInfo.decorationOrderId}, function(res){
		if(res.errorCode==0){

			orderBelongInfo.orderBelongInfos = res.orderBelongInfos;
			initOrderBelongInfo();
		}else{
			bootbox.alert("操作失败");
		}
	});
}

function initOrderBelongInfo(){
	
	var temOrderBelongInfos = orderBelongInfo.orderBelongInfos;
	
	$("#belongInfoDiv").html("");
	$("#belongInfoDiv").html('<table id="belongInfoList"></table>'); 
	
	$("#belongInfoList").jqGrid({		
		datatype: "local",
		viewrecords : false,
		multiselect : false,
        multiboxonly: false,
		colNames:['员工编号' , '员工名' ,  '所属部门' ,'所属大区' , '分配比例' ,"默认", '操作','belongDeptId','belongRegionId'],
		colModel:[
		  {name:"belongUserId"},
		  {name:"belongUser"},
		  {name:"belongDept"},
		  {name:"belongRegion"},
		  {name:"belongRate",editable:true,edittype: "text",editoptions:{maxlength:5},editrules:{ required:true ,custom:true,custom_func:checkGridBelongRate}},
		  {name:"defaultFlag",formatter:"select",editable:true,edittype: "select",editoptions:{value:"是:是;否:否"}},
		  {name:'deleteAction',title:false,formatter:deleteActionFormatter},
		  {name:"belongDeptId",hidden:true},
		  {name:"belongRegionId",hidden:true},
		],onSelectRow: function(id){
			if(id && (id !== orderBelongInfo.lastEditId)){
				
				var rowData = $(this).jqGrid("getRowData", id); 
				
				if(orderBelongInfo.lastEditId!=-1){
					var gridEditRes = $("#belongInfoList").jqGrid('saveRow',orderBelongInfo.lastEditId);
					if(gridEditRes){
						var newRowData = $("#belongInfoList").jqGrid("getRowData", orderBelongInfo.lastEditId); 
						var su=$("#belongInfoList").jqGrid('setRowData',orderBelongInfo.lastEditId,newRowData);
						orderBelongInfo.lastEditId=-1;
						changeItem("belongInfoList");
					}else{
						return;
					}
				}
			
				$(this).jqGrid('editRow',id,{
					keys : true,		//这里按[enter]保存
					url: "clientArray",
					oneditfunc:function(rowid){
						var rowObject = $(this).jqGrid("getRowData", rowid); 
						
						$("#"+rowid+"_belongRate").on('focus',function(){
							this.select(); 
						});
					},
					aftersavefunc: function(rowid){
						var newRowData = $(this).jqGrid("getRowData", rowid); 
						var su=jQuery(this).jqGrid('setRowData',rowid,newRowData);
						orderBelongInfo.lastEditId = -1;
					
						changeItem($(this).attr("id"));
					},
					afterrestorefunc:function(rowid){
						orderBelongInfo.lastEditId = -1;
					}
					
				});
				
				orderBelongInfo.lastEditId=id;
			}
		}
	});
	
	for(var j=0;j<temOrderBelongInfos.length;j++){
		$("#belongInfoList").jqGrid("addRowData",j,temOrderBelongInfos[j]);
	}
}

//-------------------------------------------------报价项的格式化------------------------------------------
function deleteActionFormatter(cellvalue, options, rowObject){
	var str = '<div title="" style="float: right; margin-right: 5px; display: block;" class="ui-pg-div ui-inline-del" id="jDeleteButton_'+options.rowId+"\"";
	  
	str += ' onclick="removeItem('+options.rowId+')" onmouseover="jQuery(this).addClass(\'ui-state-hover\');" onmouseout="jQuery(this).removeClass(\'ui-state-hover\');" ><span class="ui-icon ui-icon-trash"></span></div>'
	return str;
}

function checkGridBelongRate(value, colname){
	if(value.length<=0 || value.length>5)
		return [false,"\""+colname+"\"的长度应在1~5之间."];
	 if ((/^((\d)+(\.)?(\d)*)$/).test(value)==false){
         return [false,"\""+colname+"\"需要不小于0的数浮点数"];
	 }else{
         return [true,""];
	 }
}

function removeItem(rowId){
	var row = $("#belongInfoList").jqGrid('getRowData',rowId);
	
	if(orderBelongInfo.lastEditId!=-1&& orderBelongInfo.lastEditId!=rowId){
		var gridEditRes = $("#belongInfoList").jqGrid('saveRow',orderBelongInfo.lastEditId);
		if(gridEditRes){
			var newRowData = $("#belongInfoList").jqGrid("getRowData", orderBelongInfo.lastEditId); 
			var su=$("#belongInfoList").jqGrid('setRowData',orderBelongInfo.lastEditId,newRowData);
			orderBelongInfo.lastEditId=-1;
			changeItem("belongInfoList");
		}else{
			return;
		}
	}
	
	bootbox.confirm("确定要删除吗?",function(result){
		if(result){
		
			console.log('--------------removeItem-');
			orderBelongInfo.lastEditId = -1;
			$("#belongInfoList").jqGrid('delRowData',rowId);
			console.log('--------------removeItem-',orderBelongInfo.lastEditId);
			changeItem("belongInfoList");
			//initOrderBelongInfo();
		}
	});
}

function changeItem(tableId){
	var temOrderBelongInfos = orderBelongInfo.orderBelongInfos;
	var ids = $("#"+tableId).jqGrid('getDataIDs');
	temOrderBelongInfos.splice(0);
	
	for(var index=0;index< ids.length;++index){
		var rowData = $("#"+tableId).jqGrid('getRowData',ids[index]);
		
		var item = {};
		
		item.belongUserId = rowData.belongUserId;
        item.belongUser= rowData.belongUser;
        item.belongDept= rowData.belongDept;
        item.belongRegion = rowData.belongRegion;
        item.belongRate= rowData.belongRate;
        item.belongDeptId= rowData.belongDeptId;
        item.belongRegionId= rowData.belongRegionId;
        item.defaultFlag = rowData.defaultFlag;
        
        temOrderBelongInfos.push(item);
	}
}

//-------------------------------------------------------------save -------------------------------
function saveOrderBelongInfo(){
	$("#changeReason").val("");
	var html1 = '<option value="">&nbsp;</option>';
	$("#approveManSel").html(html1).trigger("chosen:updated");
	$("#approveModal").modal("show");	
}