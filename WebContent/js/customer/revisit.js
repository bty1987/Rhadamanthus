
$(function () {
	
	var revisit = {
		gladness : {},
	};
	var revisits = {
		btns: {
		addConfirmBtn: com.focusPage("#addConfirmBtn"),
	},
		modals: {
		addModal: com.focusPage("#addModal"),
	},
		items: {
		 decoration : com.focusPage("#decoration"),
		 type : com.focusPage("#type"),
		 ident : com.focusPage("#ident"),
		 gladness: com.focusPage("#gladness"),
		 content : com.focusPage("#content")
	},
		 revisitType:{}
	};
	    revisits.btns.addConfirmBtn.bindClick(visitRevisit);
	    
	    revisits.modals.addModal.on("hide.bs.modal", function () {
	        com.cleanItems(revisits.items);
	        com.clearValidator();
	        com.closeTip();
	    });

    revisits.items.type.bindData(constant.customer().revisit.type.datas,"key","value");
    revisits.items.gladness.bindData(constant.customer().revisit.status.datas,"key","value");

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = customerPage.getConfig("revisit");

    var lineprops = (function() {

        var propertyMap = {
            "rid": {
                field: "rid",
                name: "回访id",
                prop: "rid",
                clazz: "grey"
            },
            "orderId": {
                field: "decoration.orderId",
                name: "装修单号",
                prop: "decoration.orderId",
                clazz: "grey"
            },
            "type": {
                field: "type",
                name: "类型",
                prop: function(v) { return constant.customer().revisit.type.keys[v.type]; },
                clazz: "red"
            },
            "ident": {
                field: "ident",
                name: "引用id",
                prop: "ident",
                clazz: "grey"
            },
            "creater": {
                field: "creater.currentName",
                name: "操作人",
                prop: "creater.currentName",
                clazz: "grey"
            },
            "createTime": {
                field: "createTime",
                name: "创建时间",
                prop: "createTime",
                clazz: "grey"
            },
            "gladness": {
                field: "gladness",
                name: "满意度",
                prop: function(v) { return constant.customer().revisit.status.keys[v.gladness]; },
                clazz: "red"
            },
            "content": {
                field: "content",
                name: "内容",
                prop: "content",
                clazz: "grey"
            }
        };

        if (pageConfig.propertyArr.length == 0) {

            var all = [];
            $.each(propertyMap, function (key, prop) { all.push(prop); });
            return all;
        }

        var props = [];
        $.each(pageConfig.propertyArr, function (i, key) {

            if (propertyMap[key]) props.push(propertyMap[key]);
        });
        return props;
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'visitRevisit').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", pageConfig.apiPage || api.customer.pageRevisit, null, pageConfig.condArr.length > 0 ? pageConfig.condArr : ["customer-service-orderId", "customer-service-revisit-type"], "revisitPostData", null, false, buttons);
    searcher.line("decoration.orderId", lineprops, {}).render();
    
    com.focusPage("#visitRevisit").click(function() {
    	 
    	 revisits.modals.addModal.modal("show");
    });

    function visitRevisit() {
    	 
    	 if (com.focusPage('#decoration').children()){
    		  com.focusPage('#decoration').empty();
    	 }
    	 if (com.focusPage('#ident').children()){
   		      com.focusPage('#ident').empty();
   	     }
    	 if (com.focusPage('#content').children()){
   		      com.focusPage('#content').empty();
   	     }
    	 
    	 if (com.validate('addModal')) {
             return false;
         };
           var options = {
        		"revisit.decoration.orderId":revisits.items.decoration.val(),          
                "revisit.type" : revisits.items.type.val(),
                "revisit.ident" : revisits.items.ident.val(),
                "revisit.gladness": revisits.items.gladness.val(),
                "revisit.content" : revisits.items.content.val()
            }
            com.post(api.customer.visitRevisit ,options ,function(res){
                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
       revisits.modals.addModal.modal("hide");
    }
});