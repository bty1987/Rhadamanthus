
var materialSubOrderAddPostData = {};

jQuery(function($) {
	
	var materialSubOrderAdd = {
		saveBtn: null,
		cancellBtn: null,
		modal: null,
		materialSubOrderAddItems: {},
		materialType: {},
		
		record: {},
		
		totalSum: 0,
		
		editFlag: false,
	};
	
	materialSubOrderAdd.saveBtn = $("#saveBtn");
	materialSubOrderAdd.cancelBtn = $("#cancelBtn");
	
	materialSubOrderAddPostData["materialSubOrder.msoId"] = materialSubOrderPostData["materialSubOrder.msoId"];
	materialSubOrderAddPostData["materialSubOrder.materialBrand"] = materialSubOrderPostData["materialSubOrder.materialBrand"];
	
	com.post(api.ds.materialInfo, {}, function(res){
		$.each(res.materialOrderType, function(k, v){
			materialSubOrderAdd.materialType[k] = v;
		});
	}, null, false);
	
	com.post(api.material.queryMaterialSubOrderByMsoId, materialSubOrderAddPostData, function(res){
		
		materialSubOrderAddPostData = res;
		
		var materialSubOrder = res.materialSubOrder;
		
		materialSubOrderAdd.materialSubOrderAddItems.msoNo = $("#msoNo").val(materialSubOrder.msoNo);
		materialSubOrderAdd.materialSubOrderAddItems.designerName = $("#designerName").val(materialSubOrder.designerName);
		materialSubOrderAdd.materialSubOrderAddItems.customerName = $("#customerName").val(materialSubOrder.customerName);
		materialSubOrderAdd.materialSubOrderAddItems.salesmanName = $("#salesmanName").val(materialSubOrder.salesmanName);
		materialSubOrderAdd.materialSubOrderAddItems.instoreId = $("#materialerName").val(materialSubOrder.materialerName);
		materialSubOrderAdd.materialSubOrderAddItems.instoreId = $("#instoreName").val(materialSubOrder.instoreName);
		materialSubOrderAdd.materialSubOrderAddItems.orderAddr = $("#orderAddr").val(materialSubOrder.orderAddr);
		materialSubOrderAdd.materialSubOrderAddItems.msoType = $("#msoType").val(materialSubOrderAdd.materialType[materialSubOrder.msoType]);
		materialSubOrderAdd.materialSubOrderAddItems.des = $("#des").val(materialSubOrder.des);
		
		materialSubOrderAdd.materialSubOrderAddItems.materialOrderBrand = $("#materialOrderBrand").text(materialSubOrderPostData["materialSubOrder.materialBrand"]);
		
		materialSubOrderAdd.materialSubOrderAddItems.originalTotal = $("#originalTotalSpan").text(materialSubOrder.total);
		materialSubOrderAdd.materialSubOrderAddItems.total = $("#totalSpan").text(materialSubOrder.total);
		
		materialSubOrderAdd.totalSum = parseFloat(materialSubOrder.total);
		
		console.log(materialSubOrderAdd.totalSum);
		
	}, null, false);

	function addline(lineindex){

		var $line = $('<li></li>').addClass('line');
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
				$input = $('<input>').prop('type', 'text').addClass('editable');
				$cell.append($input);
			}
			$cell.appendTo($lineInfoWrap);
			if($cell.hasClass('total')){
				$input.attr('disabled', true);
			}
			if($cell.hasClass('materialModelName')){
				$input.typeahead({
					url: api.material.queryMaterialModelForAllByName.url,
					source: function (query, process) {
						var options = {};

						options["materialModel.materialModelName"] = query;

						if(typeof this.options.url !== "string")
							com.showAlert(com.error, "the autoFillText has no any url.");
						com.post(api.material.queryMaterialModelForAllByName, options, function(data){
							var materialModels = data.materialModels;
							autoFillList = [];
							autoFillNameList = [];
							for(var i=0;i<materialModels.length;i++){

								var _ = materialModels[i];

								autoFillList[i] = _.materialModelName;
								autoFillNameList[i] = _.mmId;
							}
							process(autoFillList);
						});
					},
					matcher: function (item) {
						return true;
					}
				}).attr("autocomplete", "off").on("change", function(){
					fillData($(this).val(), $line);
					$line.addClass('selected');
				});
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

		$line.click(function(){
			$('.current').removeClass('current');
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
	
	addline(1).addClass('current').appendTo('#list');
	addline(2).addClass('current').appendTo('#list');
	
	$('#addSubOrderItem').click(function(){
		
		var num = $('.line', '#list').length;

		var returnFlag = false;
		var $lines = $('.line', '#list');
		$lines.each(function(){
			var $this = $(this);
			if(!checkRowValue($this)){
				returnFlag = true;
				return false;
			};
		});

		if(returnFlag) return;

		cyclTotal();
		var $line = addline(num + 1);
		$line.appendTo('#list');
	});
	
	$('#submitSubOrderItem').click(function(){
		
		com.clearValidator("#salesmanName", true);
		
		var options = {};
		
		var materialBrandStr = "";
		var materialBrandFlag = true;
		var salesmanNameFlag = false;
		
		if(com.validate() || salesmanNameFlag)
			return false;
		
		var $lines = $('li.selected', '#list');
		if(!$lines.length){
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

		options["materialSubOrder.msoId"] = materialSubOrderAddPostData.materialSubOrder.msoId;
		
		var orderId = materialSubOrderAddPostData.materialSubOrder.orderId;
		var customerId = materialSubOrderAddPostData.materialSubOrder.customerId;
		var customerName = materialSubOrderAddPostData.materialSubOrder.customerName;
		
		var msoId = materialSubOrderAddPostData.materialSubOrder.msoId;
		
		var $list = $('li.selected', '#list');
		$list.length && $list.each(function(i){
			var $this = $(this);

			options["materialSubOrderItems["+i+"].msoId"] = msoId;
			options["materialSubOrderItems["+i+"].materialModelNo"] = $this.attr('materialModelNo');
			options["materialSubOrderItems["+i+"].materialModelName"] = $this.find('.materialModelName input').val();
			options["materialSubOrderItems["+i+"].materialTypeName"] = $this.find('.materialTypeName').text();
			options["materialSubOrderItems["+i+"].materialBrandName"] = $this.find('.materialBrandName').text();
			options["materialSubOrderItems["+i+"].measurementUnitName"] = $this.find('.measurementUnitName').text();
			options["materialSubOrderItems["+i+"].materialUnitPrice"] = $this.find('.materialUnitPrice').text();
			options["materialSubOrderItems["+i+"].materialPurchasePrice"] = $this.attr('materialPurchasePrice');
			options["materialSubOrderItems["+i+"].discount"] = $this.find('.discount').text();
			options["materialSubOrderItems["+i+"].salePrice"] = $this.find('.salePrice input').val();
			options["materialSubOrderItems["+i+"].postDiscount"] = $this.find('.postDiscount input').val();
			options["materialSubOrderItems["+i+"].price"] = $this.find('.price input').val();
			options["materialSubOrderItems["+i+"].calcType"] = $this.attr('calcType');
			options["materialSubOrderItems["+i+"].num"] = $this.find('.num input').val();
			options["materialSubOrderItems["+i+"].total"] = $this.find('.total input').val();
			options["materialSubOrderItems["+i+"].packageName"] = $this.find('.packageName input').val();
			options["materialSubOrderItems["+i+"].des"] = $this.find('.des input').val();

			if($this.attr('calcType') == 1){
				options["materialSubOrderItems["+i+"].prePoint"] = $this.attr('point');
			}else{
				options["materialSubOrderItems["+i+"].prePoint"] = $this.attr('base');
			}

			if(materialSubOrderAddPostData.materialSubOrder.materialBrand == ""){
				materialSubOrderAddPostData.materialSubOrder.materialBrand =  $this.find('.materialBrandName').text();
			}else{
				if(materialSubOrderAddPostData.materialSubOrder.materialBrand !=  $this.find('.materialBrandName').text()){
					materialBrandFlag = false;
				}
			}
		});

		if(!materialBrandFlag){
			com.showAlert(com.error, "订单添加型号品牌与原型号品牌不同,原品牌名称为:"+materialSubOrderAddPostData.materialSubOrder.materialBrand+"!");
			return false;
		}
		
		var btn = $(this);
		btn.button('loading');
		
		if(i > 0){
			com.post(api.material.addMaterialSubOrderItem, options, function(){
				materialOrderPostData["materialOrder.orderId"] = orderId;
				materialOrderPostData["materialOrder.customerId"] = customerId;
				materialOrderPostData["materialOrder.customerName"] = customerName;
				com.switchPage(api.index.materialSubOrderIndex.url);
				
				btn.button('reset');
			}, function(res){
				btn.button('reset');
			});
		}else{
			btn.button('reset');
			com.showAlert(com.error, "当前没有添加型号信息");
		}
	});
	
	$("#backBtn").on("click", function(){
		materialOrderPostData["materialOrder.orderId"] = materialSubOrderAddPostData.materialSubOrder.orderId;
		materialOrderPostData["materialOrder.customerId"] = materialSubOrderAddPostData.materialSubOrder.customerId;
		materialOrderPostData["materialOrder.customerName"] = materialSubOrderAddPostData.materialSubOrder.customerName;
		com.switchPage(api.index.materialSubOrderIndex.url);
	});
	
	function fillData(content, $line){

		var options = {};
		var itemId = autoFillNameList[autoFillList.indexOf(content)];

		if(itemId){
			options['materialModel.mmId'] = itemId;
		}else{
			return false;
		}

		com.post(api.material.queryMaterialModelById, options, function(data){

			var _item = data.materialModel;

			console.log(_item);

			columnActionInit($line, _item, true);
		}, function(data){
			com.showAlert(com.error, "获取数据失败!");
		});
	}
	
	function columnActionInit($line, data, flag){

		var _materialModel = data;

		if(flag){
			//给折扣价赋值
			$line.find('.salePrice input').val(utils.changeTwoDecimal(utils.accMul(parseFloat(_materialModel["materialUnitPrice"]), parseFloat(_materialModel["discount"]))));
			//给折让赋值
			$line.find('.postDiscount input').val(1);
			//给售价赋值
			$line.find('.price input').val(utils.changeTwoDecimal(utils.accMul(parseFloat($line.find('.salePrice input').val()), parseFloat($line.find('.postDiscount input').val()))));
			//给数量赋值
			$line.find('.num input').val(1);
			//给总价赋值
			$line.find('.total input').val(utils.changeTwoDecimal(utils.accMul(parseFloat($line.find('.price input').val()), parseFloat($line.find('.num input').val()))));

			$line.find('.materialTypeName').text(_materialModel.materialTypeName);
			$line.find('.materialBrandName').text(_materialModel.materialBrandName);
			$line.find('.measurementUnitName').text(_materialModel.measurementUnitName);
			$line.find('.materialUnitPrice').text(_materialModel.materialUnitPrice);
			$line.find('.discount').text(_materialModel.discount);

			$line.attr('materialModelNo', _materialModel.materialModelNo);
			$line.attr('materialPurchasePrice', _materialModel.materialPurchasePrice);
			$line.attr('calcType', _materialModel.calcType);
			$line.attr('point', _materialModel.point);
			$line.attr('base', _materialModel.base);
		}

	}
	
	function recount($line, recountPriceFlag){
		console.log('recount');
		if(checkDataValue($line)){
			recountPriceFlag && $line.find('.price input').val(utils.changeTwoDecimal(utils.accMul(parseFloat($line.find('.salePrice input').val()), parseFloat($line.find('.postDiscount input').val()))));
			$line.find('.total input').val(utils.changeTwoDecimal(utils.accMul(parseFloat($line.find('.price input').val()), parseFloat($line.find('.num input').val()))));
		}
	}
	
	function checkRowValue($line){

		var flag = true;

		var materialModelName = $line.find('.materialModelName input');
		if(!materialModelName.val()){
			materialModelName.focus().select();

			materialModelName.addClass('popover-notitle').attr({
				"data-rel" : "popover",
				"data-placement" : "top",
				"data-original-title" : "",
				"title" : "",
				"data-content" : "请填写主材名称"

			}).popover('show');

			flag =  false;
		}else{
			materialModelName.popover('destroy');
		}

		var salePrice = $line.find('.salePrice input');
		var salePriceRex = /^(\d+|\d+\.[0-9]{1,4})$/;
		if(!salePriceRex.test(salePrice.val())){
			salePrice.focus().select();
			salePrice.addClass('tooltip-info').attr({
				"data-rel" : "popover",
				"data-placement" : "top",
				"data-original-title" : "",
				"title" : "",
				"data-content" : "折扣价输入内容格式错误!"

			}).popover('show');
			flag =  false;
		}else{
			salePrice.popover('destroy');
		}

		var postDiscount = $line.find('.postDiscount input');
		var postDiscountRex = /^(1\.0{1,2}|1|0\.[0-9]{1,2})$/;
		if(!postDiscountRex.test(postDiscount.val())){
			postDiscount.focus().select();
			postDiscount.addClass('tooltip-info').attr({
				"data-rel" : "popover",
				"data-placement" : "top",
				"data-original-title" : "",
				"title" : "",
				"data-content" : "折让输入内容格式错误!"
			}).popover('show');
			flag =  false;
		}else{
			postDiscount.popover('destroy');
		}

		var price = $line.find('.price input');
		var priceRex = /^([0-9]+|[0-9]+\.[0-9]{1,2})$/;
		if(!(priceRex.test(price.val()) && parseFloat(price.val()) > 0)){
			price.focus().select();
			price.addClass('tooltip-info').attr({
				"data-rel" : "popover",
				"data-placement" : "top",
				"data-original-title" : "",
				"title" : "",
				"data-content" : "售价输入内容格式错误!"

			}).popover('show');
			flag =  false;
		}else{
			price.popover('destroy');
		}

		var num = $line.find('.num input');
		var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;
		if(!(numRex.test(num.val()) && parseFloat(num.val()) > 0)){
			num.focus().select();
			num.addClass('tooltip-info').attr({
				"data-rel" : "popover",
				"data-placement" : "top",
				"data-original-title" : "",
				"title" : "",
				"data-content" : "数量输入内容格式错误!"
			}).popover('show');
			flag =  false;
		}else{
			num.popover('destroy');
		}

		var packageName = $line.find('.packageName input');
		if(packageName.val().length > 8){
			packageName.focus().select();
			packageName.addClass('tooltip-info').attr({
				"data-rel" : "popover",
				"data-placement" : "top",
				"data-original-title" : "",
				"title" : "",
				"data-content" : "套餐名称长度需要小于8!"
			}).popover('show');
			flag =  false;
		}else{
			packageName.popover('destroy');
		}

		var des = $line.find('.des input');
		if(des.val().length > 128){
			des.focus().select();
			des.addClass('tooltip-info').attr({
				"data-rel" : "popover",
				"data-placement" : "top",
				"data-original-title" : "",
				"title" : "",
				"data-content" : "备注信息长度需要小于128!"
			}).popover('show');
			flag =  false;
		}else{
			des.popover('destroy');
		}

		return flag;
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
	
	function cyclTotal(){

		var _total = 0;

		var $list = $('.line', '#list');
		$list.length && $list.each(function(){
			var $this = $(this);
			if($this.find('.total input').val()){
				_total = utils.accAdd(parseFloat($this.find('.total input').val()+''), _total);
			}
		});

		$("#totalSpan").text(utils.accAdd(materialSubOrderAdd.totalSum, _total));
	}
	
	function reorder(){
		var $list = $('.line', '#list');
		$list.length && $list.each(function(i){
			var $this = $(this);
			$this.find('.index').text(i + 1)
		});
	}
	
});

