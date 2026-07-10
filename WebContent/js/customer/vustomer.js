jQuery(function($) {

	// 获取页面控制参数(按公司差异化配置)
	var pageConfig = customerPage.getConfig("vustomer");

	// pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
	function btnVisible(key) {

		return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
	}

	// 字段定义映射: key 对应配置 propertyArr 中的 value
	var propertyMap = {
		"name": {
			field: "name",
			name: "客户名称",
			prop: "name",
			clazz: "grey"
		},
		"address": {
			field: "address",
			name: "客户地址",
			prop: "address",
			clazz: "grey"
		},
		"orderId": {
			field: "orderId",
			name: "装修单号",
			prop: "orderId",
			clazz: "grey"
		},
		"referrer": {
			field: "referrer",
			name: "推荐人",
			prop: "referrer",
			clazz: "grey"
		},
		"referphone": {
			field: "referphone",
			name: "推荐人电话",
			prop: "referphone",
			clazz: "blue"
		},
		"createTime": {
			field: "createTime",
			name: "创建时间",
			prop: "createTime",
			clazz: "grey"
		},
		"contractPrice": {
			field: "contractPrice",
			name: "合同额",
			prop: "contractPrice",
			clazz: "blue"
		},
		"status": {
			field: "status",
			name: "状态",
			prop: function(v) { return constant.customer().vustomer.status.keys[v.status]; },
			clazz: "red"
		},
		"comment": {
			field: "comment",
			name: "说明",
			prop: "comment",
			clazz: "grey"
		}
	};

	// 根据配置 propertyArr 组装列定义, 配置为空则使用全部默认列
	var lineprops = (function() {

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

	var linebtns = (function() {

		var showFunc = function(v) { return v.status == constant.customer().vustomer.STATUS_EFFECTIVE_INT; };

		return {
			score: {
				name: "积分",
				clazz: "btn-yellow",
				show: function(v) { return btnVisible("score") && showFunc(v); },
				handle: function(v) {

					params.customer.unionId = v.unionId;
					params.customer.id = 2;
					com.popup4page("#vscoreRecordPopUp", api.index.vscoreRecord.url, "积分");
				}
			},
			release: {
				name: "释放",
				clazz: "btn-success",
				show: function(v) { return btnVisible("release") && showFunc(v); },
				handle: function(v) {

					release(v.vid);
				}
			}
		};
	})();

	var searcher = new Searcher();

	searcher.set("condList", "pagenation", "resultList", pageConfig.apiPage || api.customer.pageVustomer, null, pageConfig.condArr.length > 0 ? pageConfig.condArr : ["customer-v-name"], "vustomerPostData", null, false, null);
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
