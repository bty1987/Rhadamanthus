jQuery(function($) {

	var lineprops = (function() {

		return [{
			field: "name",
			name: "客户名称",
			prop: "name",
			clazz: "grey"
		}, {
			field: "address",
			name: "客户地址",
			prop: "address",
			clazz: "grey"
		}, {
			field: "orderId",
			name: "装修单号",
			prop: "orderId",
			clazz: "grey"
		}, {
			field: "referrer",
			name: "推荐人",
			prop: "referrer",
			clazz: "grey"
		}, {
			field: "referphone",
			name: "推荐人电话",
			prop: "referphone",
			clazz: "blue"
		}, {
			field: "createTime",
			name: "创建时间",
			prop: "createTime",
			clazz: "grey"
		}, {
			field: "contractPrice",
			name: "合同额",
			prop: "contractPrice",
			clazz: "blue"
		}, {
			field: "status",
			name: "状态",
			prop: function(v) { return constant.customer().vustomer.status.keys[v.status]; },
			clazz: "red"
		}, {
			field: "comment",
			name: "说明",
			prop: "comment",
			clazz: "grey"
		}];
	})();

	var linebtns = (function() {

		var showFunc = function(v) { return v.status == constant.customer().vustomer.STATUS_EFFECTIVE_INT; };

		return {
			score: {
				name: "积分",
				clazz: "btn-yellow",
				show: showFunc,
				handle: function(v) {

					params.customer.unionId = v.unionId;
					params.customer.id = 2;
					com.popup4page("#vscoreRecordPopUp", api.index.vscoreRecord.url, "积分");
				}
			},
			release: {
				name: "释放",
				clazz: "btn-success",
				show: showFunc,
				handle: function(v) {

					release(v.vid);
				}
			}
		};
	})();

	var searcher = new Searcher();

	searcher.set("condList", "pagenation", "resultList", api.customer.pageVustomer, null, ["customer-v-name"], "vustomerPostData", null, false, null);
	searcher.line("phone", lineprops, linebtns).render();

	function updateVustomer(vid, orderId){
		var options = {};
		options["vustomer.vid"] = vid;
		options["vustomer.orderId"] = orderId;

		com.post(api.customer.updateVustomer, options, function(res){
			searcher.doSearch();
		});
	}

	function release(vid){
	    com.showConfirm("是否确认释放客户", function(){
	        com.post(api.customer.freeVustomer, {"vustomer.vid": vid}, function(res){
                searcher.doSearch();
                com.showAlert(com.info,'释放成功');
            });
	    });
	}

});
