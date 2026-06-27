var materialSubOrderRefund = {
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	materialSubOrderRefundItems: {},
	
	editFlag: false,
	
	packages: {},
};

var materialSubOrderRefundPostData = {};

var materialSubOrderRefundData = [];

jQuery(function($) {
	com.focusPage('#fl-statement').statement("主材子订单", "退款信息");
	
	materialSubOrderRefund.saveBtn = com.focusPage("#saveBtn");
	materialSubOrderRefund.cancelBtn = com.focusPage("#cancelBtn");
	
	materialSubOrderRefundPostData["materialRefund.mid"] = materialSubOrderPostData["materialSubOrder.msoId"];
	materialSubOrderRefundPostData["materialRefund.customer.name"] = materialSubOrderPostData["materialSubOrder.customerName"];
	
	var lineprops = (function() {

		var showModel = function(v) {
			return v.packageName == "" || v.packageName == null;
		};

		var showPackage = function(v) {
			return v.packageName != "" && v.packageName != null && v.brand == "-";
		};

		var showPackageItem = function(v) {
			return v.packageName != "" && v.packageName != null && v.brand != "-";
		};

		return [{
			type: "checkbox",
			field: "ident",
			name: "idents",
			prop: "arId",
			clazz: "ace ace-checkbox-2",
			show: function(v) { return showModel(v) || showPackage(v); }
		}, {
			field: "no",
			name: "型号",
			prop: "no",
			clazz: "grey",
			show: function(v) { return showModel(v) || showPackageItem(v); }
		}, {
			field: "category",
			name: "品类",
			prop: "category",
			clazz: "grey",
			show: function(v) { return showModel(v) || showPackageItem(v); }
		}, {
			field: "brand",
			name: "品牌",
			prop: "brand",
			clazz: "grey",
			show: function(v) { return showModel(v) || showPackageItem(v); }
		}, {
			field: "measurementUnit",
			name: "单位",
			prop: "measurementUnit",
			clazz: "grey",
			show: function(v) { return showModel(v) || showPackageItem(v); }
		}, {
			field: "salePrice",
			name: "折扣价",
			prop: "salePrice",
			clazz: "blue",
			show: function(v) { return showModel(v) || showPackageItem(v); }
		}, {
			field: "price",
			name: "售价",
			prop: "price",
			clazz: "blue",
			show: function(v) { return showModel(v) || showPackageItem(v); }
		}, {
			field: "num",
			name: "数量",
			prop: "num",
			clazz: "blue",
			show: function(v) { return showModel(v) || showPackageItem(v); }
		}, {
			field: "total",
			name: "总价",
			prop: "total",
			clazz: "blue",
			show: function(v) { return showModel(v) || showPackage(v); }
		}, {
			field: "comment",
			name: "说明",
			prop: "comment",
			clazz: "grey",
			show: function(v) { return showModel(v) || showPackageItem(v); }
		}, {
			field: "name",
			name: "名称",
			prop: "name",
			clazz: "grey",
			show: showPackageItem
		}];
	})();

	var searcher = new Searcher();

	searcher.set("condList", "pagenation", "resultList", api.material.queryMaterialRefundByMid, materialSubOrderRefundPostData, [], null, "materialRefunds", true, null);
	searcher.line(function(v) {
		if (v.packageName == "" || v.packageName == null) {
			return v.name;
		} else if (v.packageName != "" && v.packageName != null && v.brand == "-") {
			return "套餐 " + v.packageName;
		}
		return v.name;
	}, lineprops, {}).render();

	// 收集套餐子项 (原 creatLine 副作用)
 searcher.doSearch && (function(){
		com.post(api.material.queryMaterialRefundByMid, materialSubOrderRefundPostData, function(res) {
			$.each(res.materialRefunds, function(i, v) {
				if (v.packageName != "" && v.packageName != null && v.brand != "-") {
					materialSubOrderRefund.packages[v.packageName] ? materialSubOrderRefund.packages[v.packageName].push(v) : (materialSubOrderRefund.packages[v.packageName] = [v]);
				}
			});
		}, null, false);
	})();
	
	com.focusPage("#back").on("click", function(){
		com.switchPage(api.index.materialIndex.url);
	});
	
	com.focusPage("#import").on("click", function(){
		com.post(api.material.queryMaterialRefundByMid, materialSubOrderRefundPostData, function(res){
			
			$.exceler({
				column : [
					["名称","name"],
					['品类',"category"],
					['品牌','brand'],
					['单位','measurementUnit'],
					['折扣','salePrice'],
					['售价', 'price'],
					['数量', 'num'],
					['总价', 'total'],
					['说明', 'comment'],
				],
				list: res.materialRefunds,
			});
		});
	});
	
	com.focusPage("#print").on("click", function(){

		var idents = "";
		var $inputs = com.focusPage('input[name="idents"]:checked');

		$inputs && $inputs.length > 0 && ($.each($inputs, function(i, v){
			idents += "&idents[" + i + "]=" + $(v).attr('ident');
		}));

		params.idents = idents;
		params.type = 2;
		params.materialSubOrderMsoId = materialSubOrderRefundPostData["materialRefund.mid"];

		var url = api.index.materialReceipt.url ;
		com.popup("主材销售收据", url, function () {
			parent.layer.getFrameIndex(window.name);
		}, null, true);

	});
	
	function cancelMaterialSubOrderRefund(v){
		
		var url = "";
		var options = {};
			
		if(v.isLeaf){
			url = api.material.cancelMaterialRefundForModel;
			options["materialSubOrderRefund.msorId"] = v.msorId;
		}else{
			url = api.material.cancelMaterialRefundForPackage;
			options["msoId"] = v.msoId;
			
			var _packageItems = materialOrderPostBalanceDetail.packages[rowInfo.packageName];
			
			_packageItems && _packageItems.length > 0 && ($.each(_packageItems, function(i, v){
				options["msorIds[" + i++ + "]"] = v.msorId;
			}));
		}
		
		com.post(url, options, function(result){
			searcher.doSearch();
		});
	}
	
});

