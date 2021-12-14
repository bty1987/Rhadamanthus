
jQuery(function($) {

	var serviceNode = {

		snid : null,
		btns: {
			saveBtn: com.focusPage("#saveBtn").on("click", saveData),
			cancelBtn: com.focusPage("#cancelBtn"),
		},		
		modals: {
			serviceNodeModal: com.focusPage("#serviceNodeModal")
		},
		items:{
			name : com.focusPage("#serviceNodeName", "#serviceNodeModal"),
			type : com.focusPage("#serviceNodeType", "#serviceNodeModal"),
			detail : com.focusPage("#serviceNodeDetail", "#serviceNodeModal")
		},
		status:{
			0: "启用",
			1: "禁用"
		},
	};
	
	com.post(api.ds.data, {}, function(res) {
		com.focusPage("#serviceNodeType").bindData(res.serviceNodeType, "key", "value");
		serviceNode.type = res.serviceNodeType.split("key", "value");
	}, null, false);
		
	serviceNode.modals.serviceNodeModal.on('show.bs.modal',function(){
		com.cleanItems(serviceNode.items);
		com.clearValidator();
	});
	
	var searcher = new Searcher();
	
	searcher.base("condList", "pagenation", "resultList", api.communion.pageServiceNode);
	
	searcher.condition(["data-serviceNode-type", "data-serviceNode-status"]);
	
	searcher.button([{id: "addServiceNode", name: "添加", clazz: "btn-primary", icon: "icon-plus"}]);
	
	searcher.history("serviceNodeData");
	
	var lineprops = [
		{fieId: "detail", name: "详述", prop: "detail", clazz: "grey"},
		{fieId: "type", name: "类型", prop: "type", clazz: "grey" , dataset: serviceNode.type},
		{field: "status ", name: "状态", prop: "status", clazz: "red", dataset: serviceNode.status},
	];
	
	var linebtns = [
		{name: "编辑",clazz: "btn-yellow", handle: function(v){
			serviceNode.snid = v.snid;
	
			serviceNode.items.name.val(v.name);
			serviceNode.items.detail.val(v.detail);
			serviceNode.items.type.val(v.type);
	
			serviceNode.modals.serviceNodeModal.modal("show");
			return false;
		}},
		{name: "状态", type: "switch", clazz: "status-lbl", handle: function(v, check){
			com.post(api.communion.updateServiceNodeForStatus, {"serviceNode.snid": v.snid, "serviceNode.status": check ? 0 : 1});
			searcher.doSearch();
			return false;
		}, init: function(v){
			return !v.status;  
		}},
	
	];
	
	searcher.line("name", lineprops, linebtns).render();
	
	com.focusPage('#addServiceNode' , '#pagenation').on("click",function(){
	
		serviceNode.snid = null;
	
		serviceNode.modals.serviceNodeModal.modal("show");
	
	});
	
	function saveData(){
	
		if(com.validate('serviceNodeModal'))  return false;
	
		var url = api.communion.addServiceNode;
	
		var options = {
			"serviceNode.name":serviceNode.items.name.val(),
			"serviceNode.type":serviceNode.items.type.val(),
			"serviceNode.detail": serviceNode.items.detail.val(),
		};
		
		if(serviceNode.snid) {
			url = api.communion.updateServiceNode;
			options["serviceNode.snid"] = serviceNode.snid;
		}
		
		com.post(url, options, function(res){
			searcher.doSearch();
		});
		
		serviceNode.modals.serviceNodeModal.modal("hide");
	}
});
