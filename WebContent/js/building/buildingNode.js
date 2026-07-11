
jQuery(function($) {
	var buildingNodeType = {};
	var buildingNode = {

		btns: {
			saveBtn: com.focusPage("#saveBtn"),
			cancelBtn: com.focusPage("#cancelBtn"),
			viewDeployedBtn: com.focusPage("#viewDeployedBtn")
		},
		modals: {
			viewBuildingNodeModal: com.focusPage("#viewBuildingNodeModal"),
			buildingNodeModal: com.focusPage("#buildingNodeModal")
		},
		items: {
			buildingNodeName: com.focusPage("#buildingNodeName"),
			buildingNodeType: com.focusPage("#buildingNodeType"),
			nodeName: com.focusPage("#nodeName")
		},

		editFlg: false,
		nodeId: null
	};

	buildingNode.btns.saveBtn.on("click", saveData);
	buildingNode.btns.viewDeployedBtn.on("click", updateNodeName);

	buildingNode.modals.buildingModal.on("hide.bs.modal", function(){
		com.cleanItems(buildingNode.items);
		com.closeTip();
	});

	buildingNode.modals.viewBuildingNodeModal.on("hide.bs.modal", function(){
		com.cleanItems(buildingNode.items);
		com.closeTip();
	});

	com.focusPage("#buildingNodeType").bindData(constant.building().building.payType.datas, "key", "value");
    $.each(constant.building().building.payType.datas,function (i,val) {
    	buildingNodeType[val.key] = val.value;
    });

	var lineprops = (function() {

		return [{
			field: "type",
			name: "节点类型",
			prop: function(v) { return buildingNodeType[v.type]; },
			clazz: "red"
		}, {
			field: "name",
			name: "节点名称",
			prop: "name",
			clazz: "grey"
		}];
	})();

	var linebtns = (function() {

		return {
			view: {
				name: "编辑",
				clazz: "btn-yellow",
				handle: function(v) {
					buildingNode.nodeId = v.bnid;
					com.cleanItems(buildingNode.items);
					buildingNode.modals.viewBuildingNodeModal.modal("show");
				}
			},
			status: {
				name: "状态",
				type: "switch",
				clazz: "status-lbl",
				init: function(v) {
					return v.status == 0;
				},
				handle: function(v, check) {
					updateNodeStatus(v.bnid, check ? 0 : 1);
				}
			}
		};
	})();

	var buttons = (function() {

		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addBuildingNode').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
		var $addspan = $('<span></span>').text('添加').appendTo($adda);

		return [$adda];
	})();

	var searcher = new Searcher();

	searcher.set("condList", "pagenation", "resultList", api.building.pageBuildingNode, null, ['building-node-type'], "buildingNodePostData", null, false, buttons);
	searcher.line("name", lineprops, linebtns).render();

	//添加
	com.focusPage('a[name="addBuildingNode"]', '#pagenation').click(function(){
		com.cleanItems(buildingNode.items);
		buildingNode.modals.buildingNodeModal.modal("show");
	});

	function updateNodeStatus(bnId, cvalue){
		var options = {};
		options["buildingNode.bnid"] = bnId;
		options["buildingNode.status"] = cvalue;
		
		com.post(api.building.updateBuildingNodeForStatus, options, function(res){
			searcher.doSearch();
		});
	}

	function saveData(){
	    
		if(com.validate("buildingNodeModal")){
			return false;
		}

		var url;
		var options = {
			'buildingNode.name': buildingNode.items.buildingNodeName.val(),
			'buildingNode.type': buildingNode.items.buildingNodeType.val()
		};

		url = api.building.addBuildingNode;

		com.post(url, options, function(res){
			searcher.doSearch();
		});

		buildingNode.modal.modal("hide");
	}

	function updateNodeName(){
	    
		if(com.validate("viewBuildingNodeModal")){
			return false;
		}

		var options = {};
		options["buildingNode.bnid"] = buildingNode.nodeId;
		options["buildingNode.name"] = buildingNode.items.nodeName.val();
		com.post(api.building.updateBuildingNode, options, function(res){
			searcher.doSearch();
			buildingNode.modals.buildingNodeModal.modal("hide");
		});
	}
});
