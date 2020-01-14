

var materialSaleOrderPostData = {}

jQuery(function($) {

	materialSaleOrderPostData["materialSubOrder.customerId"] = params.customerId;//.indexOf('--') != -1 ? "" : params.customerId;
	materialSaleOrderPostData["materialSubOrder.designerId"] = params.designerId.indexOf('--') != -1 ? "" : params.designerId;
	materialSaleOrderPostData["materialSubOrder.designerName"] = params.designerName.indexOf('--') != -1 ? "" : params.designerName;

	var materialSaleOrder = {
		saveBtn:  com.focusPage("#saveBtn"),
		cancellBtn: com.focusPage("#cancelBtn"),
		modal: null,
		materialSaleOrderItems: {
			orderId : com.focusPage("#orderId").val(params.orderId),
			customerName : com.focusPage("#customerName").val(params.customerName),
			salesmanName : com.focusPage("#salesmanName").val(params.designerName),
			materialerName : com.focusPage("#materialerName"),
			orderAddr : com.focusPage("#orderAddr").val(params.orderAddr),
			msoType : com.focusPage("#msoType"),
			des : com.focusPage("#des"),
		},

		mmIdLimit: 2,
		record: {},
		typeahead: {
			queryByNameUrl: api.material.queryMaterialModelForAllByName,
			queryByNoUrl: api.material.queryMaterialModelForAllByNo,
			queryItemUrl: api.material.queryMaterialModelById,

			materialModels: "materialModels",
			itemId: "mmId",
			itemName: "materialModel",

            value:"materialModelName",
			optionName: "materialModel.materialModelName",
			optionNo: "materialModel.materialModelNo",
			optionMsoId: "",
			optionItemId: "materialModel.mmId"
		},

		editFlag: false,
	};

	var _lastRowId;
	var autoFillList = [];
	var autoFillNameList = [];
	var activityInfo = com.focusPage("#activityInfo");

	if(params.saleType == "mend"){
		materialSaleOrder.typeahead.queryByNameUrl = api.material.queryMaterialItemForNameByName;
		materialSaleOrder.typeahead.queryByNoUrl = api.material.queryMaterialItemForNameByNo;
		materialSaleOrder.typeahead.queryItemUrl = api.material.queryMaterialItemByMiid;

		materialSaleOrder.typeahead.materialModels = "materialItems";
		materialSaleOrder.typeahead.itemId = "miid";
		materialSaleOrder.typeahead.itemName = "materialItem";
        materialSaleOrder.typeahead.value = "name";

		materialSaleOrder.typeahead.optionName = "materialItem.name";
		materialSaleOrder.typeahead.optionNo = "materialItem.no";
		materialSaleOrder.typeahead.optionMsoId = "materialItem.mid";
		materialSaleOrder.typeahead.optionItemId = "materialItem.miid";
	}

	if(params.saleType == "add"){

	}else{
		com.initTypeahead('salesmanName', api.personel.queryUserByPinyin  , "pinyinName", {"user.status":"0","departmentType.name":""}, "autoFillKeyValue", "key", "value",null);
		com.initTypeahead('materialerName', api.personel.queryUserByPinyin  , "pinyinName", {"user.status":"0","departmentType.name":"主材部"}, "autoFillKeyValue", "key", "value",null);
		com.initTypeahead('instoreName', api.personel.queryUserByPinyin , "pinyinName", {"user.status":"0","departmentType.name":"主材部"}, "autoFillKeyValue", "key", "value",null);
		com.initTypeahead('materialBrand', api.data.queryBrandByPinyin, "pinyinName", {}, "brands", "bid", "alias",null);

		com.updateTypeahead("salesmanName", materialSaleOrderPostData["materialSubOrder.designerId"], materialSaleOrderPostData["materialSubOrder.designerName"]);

		com.post(api.ds.payment, {}, function(res){
			materialSaleOrder.materialOrderType = res.materialOrderType;

			materialSaleOrder.materialSaleOrderItems.msoType.bindData(materialSaleOrder.materialOrderType, "key", "value");
		});
	}

	//添加一条空行
	addline(1).addClass('current');
	addline(2).addClass('current');

	com.focusPage('#addSaleOrder').click(function(){
		var num = com.focusPage('.line', '#list').length;

		var returnFlag = false;
		var $lines = com.focusPage('.line', '#list');
		$lines.each(function(){
			var $this = $(this);
			if(!checkRowValue($this)){
				returnFlag = true;
				return false;
			};
		});

		if(returnFlag) return;

		cyclTotal();
		addline(num + 1);
	});

	com.focusPage('#submitSaleOrder').bindClick(addmaterial);

	function addmaterial(){

		com.clearValidator("#salesmanName", true);

		var options = {};

		var materialBrandStr = "";
		var materialBrandFlag = true;

		if(com.validate("materialSaleOrderPageContent","rigth")){
			return false
		}

		var $lines = com.focusPage('li.selected', '#list');
		if (!$lines.length) {
			com.showAlert(com.warning, '请添加型号进行提交');
			return false;
		}
		var returnFlag = false;
		$lines.each(function(){
			var $this = $(this);
			if(!checkRowValue($this)){
				returnFlag = true;
				return false;
			};
		});

		if(returnFlag) return;

		cyclTotal();

		if(materialSaleOrder.totalSum < 0){
			com.showAlert(com.error, "当前录入订单总数小于0");
			return false;
		}

		materialBrandStr = com.focusPage("#materialBrand").val();
		var orderId = materialSaleOrder.materialSaleOrderItems.orderId.val();
		var customerId = materialSaleOrderPostData["materialSubOrder.customerId"];
		var customerName = materialSaleOrder.materialSaleOrderItems.customerName.val();

		var materialBrand = materialBrandStr.split('-')[0];

		options["material.orderId"] = orderId;
		options["material.house.hid"] = params.hid;
		options["material.customer.cid"] = customerId;
		options["material.customer.name"] = customerName;
		options["material.type"] = materialSaleOrder.materialSaleOrderItems.msoType.val();
		options["material.comment"] = materialSaleOrder.materialSaleOrderItems.des.val();
		options["material.salesman.userId"] = com.typeahead("salesmanName");
		options["material.materialer.userId"] = com.typeahead("materialerName");
		options["material.instorer.userId"] = com.typeahead("instoreName") ? com.typeahead("instoreName") : "";
		options["material.bid"] = com.typeahead("materialBrand");

		var $list = com.focusPage('li.selected', '#list');
		$list.length && $list.each(function(i){
			var $this = $(this);

			options["materialItems["+i+"].no"] = $this.attr('materialModelNo');
			options["materialItems["+i+"].name"] = $this.find('.materialModelName input').val();
			options["materialItems["+i+"].category"] = $this.find('.materialTypeName').text();
			options["materialItems["+i+"].brand"] = $this.find('.materialBrandName').text();
			options["materialItems["+i+"].measurementUnit"] = $this.find('.measurementUnitName').text();
			options["materialItems["+i+"].unitPrice"] = $this.find('.materialUnitPrice').text();
			options["materialItems["+i+"].purchasePrice"] = $this.attr('materialPurchasePrice');
			options["materialItems["+i+"].discount"] = $this.find('.discount').text();
			options["materialItems["+i+"].salePrice"] = $this.find('.salePrice input').val();
			options["materialItems["+i+"].postDiscount"] = $this.find('.postDiscount input').val();
			options["materialItems["+i+"].price"] = $this.find('.price input').val();
			options["materialItems["+i+"].calcType"] = $this.attr('calcType');
			options["materialItems["+i+"].num"] = $this.find('.num input').val();
			options["materialItems["+i+"].total"] = $this.find('.total input').val();
			options["materialItems["+i+"].packageName"] = $this.find('.packageName input').val();
			options["materialItems["+i+"].comment"] = $this.find('.des input').val();

			if($this.attr('calcType') == 1){
				options["materialItems["+i+"].prePoint"] = $this.attr('point');
			}else{
				options["materialItems["+i+"].prePoint"] = $this.attr('base');
			}

			if(materialBrand == ""){
				materialBrand =  $this.find('.materialBrandName').val();
			}else{
				if(materialBrand !=  $this.find('.materialBrandName').text()){
					materialBrandFlag = false;
				}
			}
		});

		if(!materialBrandFlag){
			com.showAlert(com.error, "销售订单中,所有项目需要是相同品牌信息!");
			return false;
		}

		var btn = com.focusPage('#submitSaleOrder');
		btn.button('loading');

		com.post(api.material.addMaterial, options, function(){
			params.orderId = orderId;
			params.customerId = customerId;
			params.customerName = customerName;

			btn.button('reset');
			com.showAlert(com.info, "添加成功!");
			com.switchPage(api.index.materialIndex.url);
		}, function(){
			btn.button('reset');
		});
	};

	com.focusPage("#backBtn").on("click", function(){
		com.switchPage(api.index.materialIndex.url);
	});

	//添加一个空行
	function addline(lineindex){

		var $line = $('<li></li>').addClass('line').appendTo(com.focusPage('#list'));
		var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
		var $lineInfoWrap = $('<div></div>').addClass('line-wrap content');
		var $optWrap= $('<div></div>').addClass('line-wrap action');
		var _lineInfoSet = [
			{cellClass: "name materialModelName", hasInput : !0},
			{cellClass: "type materialTypeName"},
			{cellClass: "brand materialBrandName"},
			{cellClass: "unit measurementUnitName"},
			{cellClass: "money materialUnitPrice"},//materialPurchasePrice
			{cellClass: "decimal discount"},
			{cellClass: "money salePrice", hasInput : !0},
			{cellClass: "decimal postDiscount", hasInput : !0},
			{cellClass: "money price", hasInput : !0},//calcType point base
			{cellClass: "num", hasInput : !0},
			{cellClass: "money total", hasInput : !0},
			{cellClass: "package packageName", hasInput : !0},
			{cellClass: "remark des", hasInput : !0},
		];

		var $btncheck = $('<div class="ui-pg-div ui-inline-save"><span class="ui-icon ui-icon-disk"></span></div>');
		var $btndel = $('<div class="ui-pg-div ui-inline-cancel"><span class="ui-icon ui-icon-cancel"></span></div>');

		$.each(_lineInfoSet, function(i, v){
			var $input;
			var $cell = $('<div></div>').addClass('cell '+ v.cellClass);
			if(v.hasInput){
				$input = $('<input>').prop({'type': 'text','autocomplete': 'off'}).addClass('editable');
				$cell.append($input);
			}
			$cell.appendTo($lineInfoWrap);
			if($cell.hasClass('total')){
				$input.attr('disabled', true);
			}

			if($cell.hasClass('salePrice') || $cell.hasClass('postDiscount')){
				//折扣价失去焦点重新计算总价和售价
				//折让失去焦点重新计算总价和售价
				$input.on("focusout", function(){
					recount($line, true);
				});
			}

			if($cell.hasClass('price') || $cell.hasClass('num') ){
				//售价失去焦点重新计算总价
				//数量失去焦点重新计算总价
				$input.on("focusout", function(){
					recount($line, false);
				});
			}

			if($cell.hasClass('packageName')){
				//套餐失去焦点
				$input.on("focusout", function(){
					var $this = $(this);
					if($this.val()){
						$line.find('.total input').removeAttr("disabled");
					}else{
						recount($line, false);
						$line.find('.total input').attr("disabled", "disabled");
					}
				});
			}
		});

		$optWrap.append($('<div></div>').addClass('cell option').append($btncheck).append($btndel));

		$line.append($indexWrap).append($lineInfoWrap).append($optWrap);
		var options = {};
		if(params.saleType == "mend"){
			options[materialSaleOrder.typeahead.optionMsoId] = params.msoId;
			options[materialSaleOrder.typeahead.optionName]=""
		}
        com.initTypeahead(".name input", materialSaleOrder.typeahead.queryByNameUrl, params.saleType == "mend" ? "" : materialSaleOrder.typeahead.optionName, options, materialSaleOrder.typeahead.materialModels, materialSaleOrder.typeahead.itemId, materialSaleOrder.typeahead.value, function (list, k, v) {

            $.each(list, function (index, val) {
                if (val[materialSaleOrder.typeahead.itemId] == k) {
                    $lineInfoWrap.find(".name input").val(val[materialSaleOrder.typeahead.value]);
                    $lineInfoWrap.find(".name input").on("change", function () {
                        fillData(val[materialSaleOrder.typeahead.itemId], $line);
                        $line.addClass('selected');
                    });
                }
            });
            return v
        });

		$line.click(function(){
			com.focusPage('.current').removeClass('current');
			$(this).addClass('current');
		});

		$btncheck.click(function(e){
			e.stopPropagation();
			if(checkRowValue($line)){
				cyclTotal();
			}
		});

		$btndel.click(function(e){
			e.stopPropagation();
			$line.remove();
			reorder();
			cyclTotal();
		});

		return $line;
	}

	//获取主材信息
	function fillData(mmId, $line){

		var options = {};

		if(mmId){
			options[materialSaleOrder.typeahead.optionItemId] = mmId;
		}else{
			return false;
		}

		com.post(materialSaleOrder.typeahead.queryItemUrl, options, function(data){

			var _item = data[materialSaleOrder.typeahead.itemName];

			columnActionInit($line, _item, true);
		}, function(data){
			com.showAlert(com.error, "获取数据失败!");
		});

		//materialSaleOrder.record[id] = true;
	}

	//给一行赋值
	function columnActionInit($line, data, flag){

		var _materialModel = data;

		if(flag){

			//给折让赋值
			$line.find('.postDiscount input').val(1);

			//给数量赋值
			$line.find('.num input').val(1);

			if(params.saleType == "mend"){
				//给折扣价赋值
				$line.find('.salePrice input').val(utils.changeTwoDecimal(utils.accMul(parseFloat(_materialModel["unitPrice"]), parseFloat(_materialModel["discount"]))));
				//给售价赋值
				$line.find('.price input').val(utils.changeTwoDecimal(utils.accMul(parseFloat($line.find('.salePrice input').val()), parseFloat($line.find('.postDiscount input').val()))));
				//给总价赋值
				$line.find('.total input').val(utils.changeTwoDecimal(utils.accMul(parseFloat($line.find('.price input').val()), parseFloat($line.find('.num input').val()))));
				$line.find('.materialTypeName').text(_materialModel.category);
				$line.find('.materialBrandName').text(_materialModel.brand);
				$line.find('.measurementUnitName').text(_materialModel.measurementUnit);
				$line.find('.materialUnitPrice').text(_materialModel.unitPrice);
				$line.attr('materialModelNo', _materialModel.no);
				$line.attr('materialPurchasePrice', _materialModel.purchasePrice);
			}else {
				//给折扣价赋值
				$line.find('.salePrice input').val(utils.changeTwoDecimal(utils.accMul(parseFloat(_materialModel["materialUnitPrice"]), parseFloat(_materialModel["discount"]))));
				//给售价赋值
				$line.find('.price input').val(utils.changeTwoDecimal(utils.accMul(parseFloat($line.find('.salePrice input').val()), parseFloat($line.find('.postDiscount input').val()))));
				//给总价赋值
				$line.find('.total input').val(utils.changeTwoDecimal(utils.accMul(parseFloat($line.find('.price input').val()), parseFloat($line.find('.num input').val()))));
				$line.find('.materialTypeName').text(_materialModel.materialTypeName);
				$line.find('.materialBrandName').text(_materialModel.materialBrandName);
				$line.find('.measurementUnitName').text(_materialModel.measurementUnitName);
				$line.find('.materialUnitPrice').text(_materialModel.materialUnitPrice);
				$line.attr('materialModelNo', _materialModel.materialModelNo);
				$line.attr('materialPurchasePrice', _materialModel.materialPurchasePrice);

			}
			$line.find('.discount').text(_materialModel.discount);
			$line.attr('calcType', _materialModel.calcType);
			$line.attr('point', _materialModel.point);
			$line.attr('base', _materialModel.base);
		}
	}

	function recount($line, recountPriceFlag){
		if(checkDataValue($line)){
			recountPriceFlag && $line.find('.price input').val(utils.changeTwoDecimal(utils.accMul(parseFloat($line.find('.salePrice input').val()), parseFloat($line.find('.postDiscount input').val()))));
			$line.find('.total input').val(utils.changeTwoDecimal(utils.accMul(parseFloat($line.find('.price input').val()), parseFloat($line.find('.num input').val()))));
		}
	}

	function checkDataValue($line){
		var salePrice = $line.find('.salePrice input').val();
		var postDiscount = $line.find('.postDiscount input').val();
		var price = $line.find('.price input').val();
		var num = $line.find('.num input').val();

		if(!salePrice || !postDiscount || !price || !num) return false;

		if(isNaN(salePrice)){
			com.showAlert(com.warning, "折扣价需要数字类型信息!");
			return false;
		}

		if(isNaN(postDiscount)){
			com.showAlert(com.warning, "折让需要数字类型信息!");
			return false;
		}

		if(isNaN(price)){
			com.showAlert(com.warning, "售价需要数字类型信息!");
			return false;
		}

		if(isNaN(num)){
			com.showAlert(com.warning, "数量需要数字类型信息!");
			return false;
		}

		return true;
	}


	function checkRowValue($line){

		var flag = true;

		var materialModelName = $line.find('.materialModelName input');
		if(!materialModelName.val()){
			materialModelName.focus().select();
			com.showTip(materialModelName,"请填写主材名称","bottom");
			flag =  false;
		}

		var salePrice = $line.find('.salePrice input');
		var salePriceRex = /^(\d+|\d+\.[0-9]{1,4})$/;
		if(!salePriceRex.test(salePrice.val())){
			salePrice.focus().select();
			com.showTip(salePrice,"折扣价输入内容格式错误","bottom");
			flag =  false;
		}

		var postDiscount = $line.find('.postDiscount input');
		var postDiscountRex = /^(1\.0{1,2}|1|0\.[0-9]{1,2})$/;
		if(!postDiscountRex.test(postDiscount.val())){
			postDiscount.focus().select();
			com.showTip(postDiscount,"折让输入内容格式错误","bottom");
			flag =  false;
		}

		var price = $line.find('.price input');
		var priceRex = /^([0-9]+|[0-9]+\.[0-9]{1,2})$/;
		if(!(priceRex.test(price.val()) && parseFloat(price.val()) > 0)){
			price.focus().select();
			com.showTip(price,"售价输入内容格式错误","bottom");
			flag =  false;
		}

		var num = $line.find('.num input');
		var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;
		if(!(numRex.test(num.val()) && parseFloat(num.val()) > 0)){
			num.focus().select();
			com.showTip(num,"数量输入内容格式错误","bottom");
			flag =  false;
		}

		var packageName = $line.find('.packageName input');
		var packageRex = /^[\u4E00-\u9FA5A-Za-z0-9]{0,7}$/;
		if(!packageRex.test(packageName.val())){
			packageName.focus().select();
			com.showTip(packageName,"请检查套餐名称(套餐名称长度必须小于8且只能由汉字、数字和字母组成)!","bottom");
			flag =  false;
		}

		var des = $line.find('.des input');
		if(des.val().length > 128){
			des.focus().select();
			com.showTip(des,"备注信息长度需要小于128","bottom");
			flag =  false;
		}

		return flag;
	}

	//计算总价的和
	function cyclTotal(){

		var _total = 0;

		var $list = com.focusPage('.line', '#list');
		$list.length && $list.each(function(){
			var $this = $(this);
			if($this.find('.total input').val()){
				_total = utils.accAdd(parseFloat($this.find('.total input').val()+''), _total);
			}
		});

		materialSaleOrder.totalSum = _total;

		com.focusPage("#totalSpan").text(_total);
	}

	//重排序
	function reorder(){
		var $list = com.focusPage('.line', '#list');
		$list.length && $list.each(function(i){
			var $this = $(this);
			$this.find('.index').text(i + 1);
		});
	}

});
