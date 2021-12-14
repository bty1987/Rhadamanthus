jQuery(function($) {

    var constructionNode = {
        
        cnid: null,
        
        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
            updateBtn: com.focusPage("#updateBtn").on("click", update)
        },
        
        modals: {
            addModal: com.focusPage("#addModal"),
            updateModal: com.focusPage("#updateModal")
        },

        items:{
            
            name: com.focusPage("#name", "#addModal"),
            
            precheck: com.focusPage("#precheck", "#updateModal"),
            postcheck: com.focusPage("#postcheck", "#updateModal"),
            stacheck: com.focusPage("#stacheck", "#updateModal"),
            fincheck: com.focusPage("#fincheck", "#updateModal"),
            startalk: com.focusPage("#startalk", "#updateModal"),
            endtalk: com.focusPage("#endtalk", "#updateModal"),
            timeLimit: com.focusPage("#timeLimit", "#updateModal")
        },

        status:{
			0: "启用",
			1: "禁用"
		},
        
        editFlg: false,
    };
    
    constructionNode.modals.addModal.on('show.bs.hide',function(e){
        com.cleanItems(constructionNode.items);
    });
    
    constructionNode.modals.updateModal.on('show.bs.hide',function(e){
        com.cleanItems(constructionNode.items);
    });

    var searcher = new Searcher();
    
    searcher.base("condList", "pagenation", "resultList", api.data.pageConstructionNode);
    
    searcher.condition(["data-construction-node-name","data-construction-node-status"]);
    
    searcher.history("constructionNodePostData");
    	//数据
    	var propertyArr = [
            {fieId: "name", name: "节点名称", prop: "name", clazz: "grey"},
            {fieId: "precheck", name: "开工款项比", prop: "precheck", clazz: "blue"},
            {fieId: "postcheck", name: "完工款项比", prop: "postcheck", clazz: "blue"},
            {fieId: "stacheck", name: "开工销售比例", prop: "stacheck", clazz: "blue"},
            {fieId: "fincheck", name: "完工销售比例", prop: "fincheck", clazz: "blue"},
            {fieId: "startalk", name: "开工话术", prop: "startalk", clazz: "grey"},
            {fieId: "endtalk", name: "完工话术", prop: "endtalk", clazz: "grey"},
            {fieId: "timeLimit", name: "工期", prop: "timeLimit", clazz: "grey"},
            {field: "status == 0 ", name: "状态", prop: "status", clazz: "red", dataset: constructionNode.status},
            {fieId: "sort", name: "排序", prop: "sort", clazz: "blue"},
        ];
    	//数据右边的按钮
    	var linebtns = [
    	    {name: "更新", clazz:"btn-yellow", handle: function(v){
    	    	constructionNode.cnid = v.cnid;
                
                constructionNode.items.precheck.val(v.precheck);
                constructionNode.items.postcheck.val(v.postcheck);
                constructionNode.items.stacheck.val(v.stacheck);
                constructionNode.items.fincheck.val(v.fincheck);
                constructionNode.items.startalk.val(v.startalk);
                constructionNode.items.endtalk.val(v.endtalk);
                constructionNode.items.timeLimit.val(v.timeLimit);
                
                constructionNode.modals.updateModal.modal("show");
                return false;
    	    }},
    	];
    	
    	searcher.line("name", propertyArr, linebtns).render();
    	
    	com.focusPage('#addConstructionNode' , '#pagenation').on("click",function(){
    		
    		constructionNode.cnid = null;
    		
    		constructionNode.modals.updateModal.modal("show");
    	});
    function update(){
        
        if(com.validate("updateModal")) return false;
        
        var options = {
            "constructionNode.cnid": constructionNode.cnid,
            "constructionNode.precheck": constructionNode.items.precheck.val(),
            "constructionNode.postcheck": constructionNode.items.postcheck.val(),
            "constructionNode.stacheck": constructionNode.items.stacheck.val(),
            "constructionNode.fincheck": constructionNode.items.fincheck.val(),
            "constructionNode.startalk": constructionNode.items.startalk.val(),
            "constructionNode.endtalk": constructionNode.items.endtalk.val(),
            "constructionNode.timeLimit": constructionNode.items.timeLimit.val()
        }
        
        com.post(api.data.updateConstructionNode, options, function(res){
            com.closePopup();
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
        
        constructionNode.modals.updateModal.modal("hide");
    }

    function saveData(){
        
        if(com.validate("addModal")){
            return false;
        }

        var options = {
            'constructionNode.name': constructionNode.items.constructionNodeName.val()
        };

        com.post(api.data.addConstructionNode, options, function(res){
            searcher.doSearch();
        });

        constructionNode.modals.addModal.modal("hide");
    }
});

