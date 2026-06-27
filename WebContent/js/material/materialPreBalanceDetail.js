var materialOrderPreBalanceDetail = {
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	materialOrderBalanceDetailItems: {},

	editFlag: false,

	packages: {},
};

var materialOrderPreBalanceDetailPostData = {};

jQuery(function($) {

	com.focusPage('#fl-statement').statement("主材订单", "型号信息");

	materialOrderPreBalanceDetail.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
	materialOrderPreBalanceDetail.cancelBtn = com.focusPage("#cancelBtn");
	materialOrderPreBalanceDetail.materialSubOrderItemBalanceModal = com.focusPage("#materialSubOrderItemBalanceModal").on('show.bs.modal',function(e){
		com.clearValidator("#value", true);
		com.clearValidator();
	});

	materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.calcType = com.focusPage("#calcType");
	materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value = com.focusPage("#value");

	var options = {};
	options["materialItem.mid"] = materialOrderPreBalancePostData["materialOrderPreBalance.msoId"];

	function buildMaterialPreBalanceDetailLineprops() {

		var showModel = function(v) { return v.packageName == "" || v.packageName == null; };
		var showPackage = function(v) { return v.packageName != "" && v.packageName != null && v.brand == "-"; };
		var showPackageItem = function(v) { return v.packageName != "" && v.packageName != null && v.brand != "-"; };

		return [{
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
			field: "prePoint",
			name: "结算值",
			prop: "prePoint",
			clazz: "blue",
			show: function(v) { return showModel(v) || showPackage(v); }
		}, {
			field: "profit",
			name: "利润",
			prop: function(v) { return profitInit(v); },
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
	}

	function buildMaterialPreBalanceDetailLinebtns() {

		return {
			value: {
				name: function(v) {
					if (v.packageName == "" || v.packageName == null) {
						return v.calcType == 0 ? '底价' : '点位';
					}
					return '点位';
				},
				clazz: "btn-yellow",
				show: function(v) { return v.packageName == "" || v.packageName == null || (v.packageName != "" && v.packageName != null && v.brand == "-"); },
				handle: function(v) {
					dialogMaterialSubOrderItemBalanceModal(v);
				}
			},
			cal: {
				name: "计算方式",
				clazz: "btn-success",
				show: function(v) { return v.packageName == "" || v.packageName == null; },
				handle: function(v) {
					changeCalcType(v);
				}
			}
		};
	}

	var searcher = new Searcher();

	searcher.set("condList", "pagenation", "resultList", api.material.queryMaterialItemByMid, options, [], null, "materialItems", true, null);
	searcher.line(function(v) {
		if (v.packageName == "" || v.packageName == null) {
			return v.name;
		} else if (v.packageName != "" && v.packageName != null && v.brand == "-") {
			return "套餐 " + v.name;
		}
		return v.name;
	}, buildMaterialPreBalanceDetailLineprops(), buildMaterialPreBalanceDetailLinebtns()).render();

	// 收集套餐子项 (原 creatLine 副作用)
	com.post(api.material.queryMaterialItemByMid, options, function(res) {
		$.each(res.materialItems, function(i, v) {
			if (v.packageName != "" && v.packageName != null && v.brand != "-") {
				materialOrderPreBalanceDetail.packages[v.packageName] ? materialOrderPreBalanceDetail.packages[v.packageName].push(v) : (materialOrderPreBalanceDetail.packages[v.packageName] = [v]);
			}
		});
	}, null, false);

	com.focusPage('#import').click(function(){

		com.post(api.material.queryMaterialItemByMid, options, function(res){

			$.exceler({
				column : [
					["名称","name"],
					['型号','no'],
					['品类','category'],
					['品牌', 'brand'],
					['单位', 'measurementUnit'],
					['折扣价', 'salePrice'],
					['售价', 'price'],
					['数量', 'num'],
					["总价", 'total'],
					["结算值", 'prePoint'],
					["说明", 'comment'],
				],
				list: res.materialItems,
			});
		});
    });

	com.focusPage('#prebalance').click(function(){

		var options = {};

		options["mids[0]"] = materialOrderPreBalancePostData["materialOrderPreBalance.msoId"];

        com.showConfirm("确定需要提交当前子订单的预结处理吗?", function () {
            com.post(api.material.preBalanceMaterial, options, function (result) {
                com.focusPage("#materialOrderPreBalancePageContent").load(api.index.materialPreBalanceIndex.url);
            }, function (result) {
                com.showAlert(com.error, "确认失败!");
            });
        });
	});

	com.focusPage('#back').click(function(){
		com.focusPage(".tooltip").remove();
		com.focusPage("#materialOrderPreBalancePageContent").load(api.index.materialPreBalanceIndex.url);
	});

	function profitInit(v){

		var result = '';

		if(v.level == 0 && v.isLeaf == true){
			if(v.calcType == 0){
				result += baseCacl(v.price, v.prePoint, v.num);
			}else{
				result += pointCacl(v.salePrice, v.price, v.prePoint, v.num);
			}
		}else if(v.level == 0 && v.isLeaf == false){
			result += utils.accMul(v.total, v.prePoint);
		}else if(v.level == 1){
			return "";
		}

		return result;
	}

	function dialogMaterialSubOrderItemBalanceModal(v){

		com.cleanItems(materialOrderPreBalanceDetail.materialOrderBalanceDetailItems);

		materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.calcType.val(v.calcType == "0" ? "底价" : "点位");
		materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value.val(v.prePoint);

		materialOrderPreBalanceDetailPostData.tmpItem = v;

		materialOrderPreBalanceDetail.materialSubOrderItemBalanceModal.modal("show");
	}

	function changeCalcType(v){

        var options = {};

        options["materialItem.miid"] = v.miid;

        com.showConfirm("确认需要修改当前型号的计算方式?", function () {
            com.post(api.material.changeMaterialItemForCaclType, options, function (result) {
                searcher.doSearch();
            });
        });
    }

	function pointCacl(salePrice, price, point, num, maling){
		// (售价 - 折扣价 * (1 - 点位)) * 数量
		return utils.accMul(utils.accSub(price, utils.accMul(salePrice, utils.accSub(1, point))), num);
	}

	function baseCacl(price, base, num, maling){
		// (售价 - 底价) * 数量
		return utils.accMul(utils.accSub(price, base), num);
	}

	function packageCacl(total, point){
		return utils.accMul(total, point);
	}

	function saveData(){

		var i = 0;
		var options = {};

		var rowInfo = materialOrderPreBalanceDetailPostData.tmpItem;

		if(rowInfo.calcType == "0"){
			var base = materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value.val();
			var priceRex = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
			if(!(priceRex.test(base) && parseFloat(base) > 0)){
				materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value.focus().select();
				com.showTips(materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value, "底价输入内容格式错误!", true);
				return false;
			}
		}else if(rowInfo.calcType == "1"){
			var point = materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value.val();
			var postDiscountRex = /^(1\.0{1,2}|1|0\.[0-9]{1,2})$/;
			if(!postDiscountRex.test(point)){
				materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value.focus().select();
				com.showTips(materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value, "点位输入内容格式错误!", true);
				return false;
			}
		}

		if(rowInfo.isLeaf){
			options["miids[" + i++ + "]"] = rowInfo.miid;
		}else if(!rowInfo.isLeaf){

			var _packageItems = materialOrderPreBalanceDetail.packages[rowInfo.packageName];

			_packageItems && _packageItems.length > 0 && ($.each(_packageItems, function(i, v){
				options["miids[" + i++ + "]"] = v.miid;
			}));
		}

		options["materialItem.prePoint"] = materialOrderPreBalanceDetail.materialOrderBalanceDetailItems.value.val();
		options["materialItem.mid"] = materialOrderPreBalanceDetailPostData.tmpItem.msoId;

		com.post(api.material.updateMaterialItemForPrePT, options, function(result){
			searcher.doSearch();
		});

		materialOrderPreBalanceDetail.materialSubOrderItemBalanceModal.modal("hide");
	}

});

