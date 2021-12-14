var printAddReduceDetail = (function(){

	api = parent.api;
	config = parent.config ;
	server = parent.server;
	utils = parent.utils;
	com = parent.com;

	var addReduceDetail = {
		items: {},
	};

	var reduceNums = {};

	var printer = {

		printBody: function() {
			var that = this;

			var html = "";

			var decoration = addReduceDetail.decoration;

			$("#orderId").html("装修单号: " + decoration.orderId);
			$("#orderAddr").html("楼盘地址: " + decoration.house.village.name + " " + decoration.house.houseNumber);
			$("#supervisor").html("监理: " + (decoration.supervisor.currentName != null ? decoration.supervisor.currentName : "-"));
			$("#designer").html("设计师: " + (decoration.designer.currentName != null ? decoration.designer.currentName : "-"));

			html += that.printItem(addReduceDetail.items);

			$("#content").html(html);
		},
		printItem: function(addReduces) {
			var addReduceTotalPrice = 0;
			var html = "";

			$.each(addReduces, function (i, addReduceItems) {

				// 减项类型/增项类型
				var addReduceType = addReduceItems[addReduceItems.length - 1].type;

				var addReduceTotal = 0;
				var index = 1;

				var typeName = addReduceType == '1' ? '减项' : '增项';

				html += typeName;
				html += '<table width="100%" border="1" cellpadding="1" cellspacing="0" style="FONT-SIZE: 14px">';
				html += '<tbody><tr bgcolor="#FFFFFF" align="center">';
				html += '<td width="5%">序号</td>';
				html += '<td width="40%">项目名称</td>';
				html += '<td width="14%">功能区</td>';
				html += '<td width="10%">单位</td>';
				html += '<td width="8%">数量</td>';
				html += '<td width="10%">单价</td>';
				html += '<td width="13%">金额</td>';
				html += '</tr>';

				$.each(addReduceItems, function (j, addReduceItem) {

					if (reduceNums[addReduceItem.ariId]) {
						addReduceItem.num = utils.changeThrDecimal(utils.accAdd(addReduceItem.num, reduceNums[addReduceItem.ariId]));
						addReduceItem.total = utils.changeThrDecimal(utils.accMul(addReduceItem.num, addReduceItem.discountPrice));
					}

					html += '<tr align="center">';
					html += '<td>' + index++ + '</td>';
					html += '<td>' + addReduceItem.itemName + '</td>';
					html += '<td>' + addReduceItem.quotationFunctionAreaName + '</td>';
					html += '<td>' + addReduceItem.measurementUnit + '</td>';
					html += '<td>' + addReduceItem.num + '</td>';
					html += '<td>' + addReduceItem.unitPrice + '</td>';
					html += '<td>' + addReduceItem.total + '</td>';
					html += '</tr>';

					addReduceTotal = utils.changeThrDecimal(utils.accAdd(addReduceItem.total, addReduceTotal));
				});

				html += '</tbody></table>';
				html += typeName + '金额: ' + addReduceTotal  + '元';
				html += '<hr><p></p>';
				addReduceTotalPrice = utils.changeThrDecimal(utils.accAdd(addReduceType == '1' ? -addReduceTotal : addReduceTotal, addReduceTotalPrice));
			});

			$("#labSumMoney").html("工程最终增减合计金额: " + addReduceTotalPrice + "元");

			return html;
		},
		init: function() {
			printer.printBody();
		}
	};

	return {
		init: function() {

			var params = parent.params;
			var decorationOrderId = params.decorationOrderId;

			// 获取装修单信息
			com.post(api.decoration.queryDecorationForCommonByOrderId, {"decoration.orderId": decorationOrderId}, function(res){
				addReduceDetail.decoration = res.decoration;
			}, null ,false);

			// 获取报价信息
			com.post(api.quotation.queryQuotationForDefaultByOrderId, {"quotation.orderId": decorationOrderId}, function(res){
				addReduceDetail.quotation = res.quotation;
			}, null ,false);

			// 获取增减信息
			com.post(api.addReduce.queryAddReduceByOrderId, {"addReduce.orderId": decorationOrderId}, function (result) {

				var addReduceIds = {};

				$.each(result.addReduces, function(i, v) {
					if(params.addReduceIds.indexOf(v.arId) == -1) return true;

					addReduceDetail.items[v.arId] = [
						{
							"itemName": "管理费",
							"quotationFunctionAreaName": "-",
							"measurementUnit": "-",
							"num": "-",
							"unitPrice": "-",
							"total": v.managePrice,
							"type": v.type,
						},
					];
					
					disposeAddReduceItemData(v.addReduceItems, v.discount);

					addReduceIds["addReduceIds["+i+"]"] = v.arId;
				});

			}, null, false);

			function disposeAddReduceItemData(addReduceItems, discount) {

				// 报价折扣
				var quotationDiscount = utils.accDiv(discount == 0 ? addReduceDetail.quotation.discount : discount, 10);
				var decorationType = addReduceDetail.decoration.type;
				// 用于处理数据顺序为题
				addReduceItems = addReduceItems.reverse();

				$.each(addReduceItems, function(i, addReduceItem){

					// 4 (增项中报价项)
					if (addReduceItem.type == 4) {
						if (reduceNums[addReduceItem.quoteItemId]) {
							reduceNums[addReduceItem.quoteItemId] = utils.changeThrDecimal(utils.accAdd(reduceNums[addReduceItem.quoteItemId], addReduceItem.num));
						} else {
							reduceNums[addReduceItem.quoteItemId] = addReduceItem.num;
						}
					}

					// 减项类型/增项类型
					var addReduceType = [1, 3, 4, 5].indexOf(addReduceItem.type) != -1 ? 1 : 0;

					var discount = null;
					// 增项, 不打折
					if (addReduceType == 0) {
						discount = 1;
						// 减项项目类型为 4(增项中报价项), 5(拓展中报价项) 不打折
					} else if (addReduceItem.type == 4 || addReduceItem.type == 5) {
						discount = 1;
						// 装修单类型为2 (半价, 满减, 减上减) 打折
					} else if (decorationType == 2) {
						discount = quotationDiscount;
						// 根据打折标识进行判断 0: 不打折 , 1: 打折 , 2: 不打折(非配比) , 3: 打折(非配比)
					} else {
						discount = ([1, 3].indexOf(addReduceItem.discount) != -1) ? quotationDiscount : 1;
					}
					
					var discountPrice = utils.accMul(addReduceItem.unitPrice, discount);
					
					addReduceItem.discountPrice = discountPrice;
					addReduceItem.total = utils.changeThrDecimal(utils.accMul(addReduceItem.num ,  discountPrice));

					addReduceDetail.items[addReduceItem.arId].unshift(addReduceItem);

				});
			}

			printer.init();
		}
	}
})();

jQuery(function($) {
	printAddReduceDetail.init();
});