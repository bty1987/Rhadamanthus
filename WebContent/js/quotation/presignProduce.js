jQuery(function ($) {

	var presignProduce = {

		bsid: null,

		btns: {
			savePresignProduceBtn: com.focusPage("#savePresignProduceBtn").on("click", saveData),
		},

		modals: {
			createPresignProduceModal: com.focusPage("#createPresignProduceModal"),
		},

		items: {
			name: com.focusPage("#name", "#createPresignProduceModal"),
			quotePrice: com.focusPage("#quotePrice", "#createPresignProduceModal"),
			quoteArea: com.focusPage("#quoteArea", "#createPresignProduceModal"),
			unitPrice: com.focusPage("#unitPrice", "#createPresignProduceModal"),
			costPrice: com.focusPage("#costPrice", "#createPresignProduceModal"),
			preferPrice:com.focusPage("#preferPrice", "#createPresignProduceModal"),
			profitRate: com.focusPage("#profitRate", "#createPresignProduceModal"),
			offset: com.focusPage("#offset", "#createPresignProduceModal"),
			statues:com.focusPage("#status", "#createPresignProduceModal"),
		},

		status: {},
	};
	com.post(api.ds.quotation, {}, function(res) {
		presignProduce.status = res.presignProduceStatus.split("key", "value");
	}, null, false);
	
	presignProduce.modals.createPresignProduceModal.on('hide.bs.modal', function() {
        com.clearValidator();
        com.cleanItems(presignProduce.items);
    });

	var seacher = new Searcher();

	seacher.base("condList", "pagenation", "resultList", api.quotation.pagePresignProduce);

	seacher.condition(["quotation-presignProduce-name", "quotation-presignProduce-status"]);

	seacher.button([{ id: "addPresignProduce", name: "创建", clazz: "btn-yellow", icon: "icon-plus" }]);

	seacher.history("presignProducePostData");

	var lineprops = [
		{ fieId: "name", name: "名称", prop: "name", clazz: "grey" },
		{ fieId: "quotePrice", name: "起报价", prop: "quotePrice", clazz: "blue" },
		{ fieId: "quoteArea", name: "起报面积", prop: "quoteArea", clazz: "blue" },
		{ fieId: "unitPrice", name: "计价单价", prop: "unitPrice", clazz: "blue" },
		{ fieId: "costPrice", name: "成本单价", prop: "costPrice", clazz: "blue" },
		{ fieId: "preferPrice", name: "优惠价", prop: "preferPrice", clazz: "blue"},
		{ fieId: "profitRate", name: "利润率", prop: "profitRate", clazz: "blue" },
		{ fieId: "status", name: "状态", prop: "status", clazz: "red", dataset: presignProduce.status },
	];
	var linebtns = [
		{name: "编辑", clazz: "btn-yellow", handle: function(v){
		    
			presignProduce.ppid = v.ppid;
			
			presignProduce.items.name.val(v.name);
			presignProduce.items.quotePrice.val(v.quotePrice);
			presignProduce.items.quoteArea.val(v.quoteArea);
			presignProduce.items.costPrice.val(v.costPrice);
			presignProduce.items.unitPrice.val(v.unitPrice);
			presignProduce.items.preferPrice.val(v.preferPrice);
			presignProduce.items.profitRate.val(v.profitRate);
			presignProduce.items.offset.val(v.offset);
			
			presignProduce.modals.createPresignProduceModal.modal("show");
			
			return false;
		}},
		{name: "预签项", clazz: "btn-info", handle: function(v){
		    
            params["presignProduce"] = v;
            
            com.popup4page("#presignItemPopUp", "/views/quotation/presignItem.html", "预签项");
		    
		    return false;
		}},
		{name: "状态", type: "switch", clazz: "status-lbl", handle: function(v, check){
		    
			com.post(api.quotation.updatePresignProduceForStatus, {"presignProduce.ppid": v.ppid, "presignProduce.status": check ? 0 : 1});
			
			return false;
		}, init: function(v){
			return !v.status;
		}},
	];

	seacher.line("name", lineprops, linebtns).render();

	com.focusPage('#addPresignProduce', '#pagenation').on("click", function () {
	    
	    presignProduce.ppid = null;
	    
		presignProduce.modals.createPresignProduceModal.modal("show");
	});

	function saveData() {
	    
		if (com.validate('createPresignProduceModal')) 
		    return false;

		var url = api.quotation.addPresignProduce;
		
		var options = {
			"presignProduce.name": presignProduce.items.name.val(),
			"presignProduce.quotePrice": presignProduce.items.quotePrice.val(),
			"presignProduce.quoteArea": presignProduce.items.quoteArea.val(),
			"presignProduce.unitPrice": presignProduce.items.unitPrice.val(),
			"presignProduce.costPrice": presignProduce.items.costPrice.val(),
			"presignProduce.preferPrice": presignProduce.items.preferPrice.val(),
			"presignProduce.profitRate": presignProduce.items.profitRate.val(),
			"presignProduce.offset": presignProduce.items.offset.val()
		};
		
		if(presignProduce.ppid){
			url = api.quotation.updatePresignProduce;
			options['presignProduce.ppid'] = presignProduce.ppid;
		}
		
		com.post(url, options, function(res){
			seacher.doSearch();
		});
		
		presignProduce.modals.createPresignProduceModal.modal("hide");
	}
});
