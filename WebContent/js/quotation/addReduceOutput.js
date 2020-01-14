
jQuery(function($) {
    
	var params = {};

	api = parent.api;
	config = parent.config ;
	server = parent.server;
	utils = parent.utils;
	com = parent.com;

	params.server = window.server;
	params.authentication = parent.params.authentication;
	params = parent.params;
	
	// 装修单类型  0: 半包 , 装修单 , 不包括主材单 , 1: 套餐 , 装修+主材单 , 2: 半价 , 主材配比 , 装修打折
	var $decorationType = params.decorationType;
	var addReduceDetail = {
		addReduceDetails: [],
		addItems: {},
		reduceItems: {}
	};
	var reduceNums = {};
	var $addReduceItems = [];
	var _addReduceIds = params.addReduceIds; //上一页面选中要打印的增减项
	var _orderId = params.decorationOrderId;
	
	//查询该订单的信息
    com.post(api.decoration.queryDecorationForCommonByOrderId, {"decoration.orderId": _orderId}, function(res){
        addReduceDetail.decoration = res.decoration;
    }, null ,false);
	
	//查询该订单的信息
	com.post(api.quotation.queryQuotationForDefaultByOrderId, {"quotation.orderId": _orderId}, function(res){
		addReduceDetail.quotation = res.quotation;
	}, null ,false);

	var $addReduceIds = {};
	var $manage = {};
	
	//通过订单编号获取增减项信息 查出该订单下所有的增减项
	com.post(api.addReduce.queryAddReduceByOrderId, {"addReduce.orderId": _orderId}, function (res) {
		$.each(res.addReduces, function (i, v) {
		    
		    if(_addReduceIds.indexOf(v.arId) == -1) return true;
		    
		    addReduceDetail.addItems[v.arId + "-" + v.type] = [];
		    
			$addReduceIds["addReduceIds[" + i + "]"] = v.arId;
			if (params.addReduceIds.indexOf(v.arId) >= 0) {
                $manage[v.arId] = {"arId": v.arId, "manageRate": v.manageRate, "managePrice": v.managePrice};
			}
		});
	}, null, false);
	
	//通过增减项ID列表获取增减项中包含的报价项信息
	com.post(api.addReduce.queryAddReduceItemByAddReduceIds, $addReduceIds, function (res) {
		$addReduceItems = res.addReduceItems;
	}, null, false);

	calAddReduceSum();
	generatePrintPage();
	
	function printHeader(headStr){
		return headHtml;
	}

	//从所有的增减项中的报价详情中筛选出合适的报价并进行计算和处理
	function calAddReduceSum(){

		var discount = addReduceDetail.quotation.discount;
		
		$.each($addReduceItems, function(i, v){
		    
		    var addReduceItem = v;
		    
		    var arId = addReduceItem.arId;
		    var unitPrice = v.unitPrice;
		    var type = v.type;
		    var num = v.num;
		    
		    var quoteItemId = addReduceItem.quoteItemId;

            //type = 4 是增项中的报价项  没有type = 4时reduceNums空的
            if ([4].indexOf(type) != -1) {
                if (reduceNums[quoteItemId]) {
                    reduceNums[quoteItemId] = utils.accAdd(reduceNums[quoteItemId], num);
                } else {
                    reduceNums[quoteItemId] = num;
                }
            }
            
            // 增项不打折 , 减项打折
            // 装修单为半包/全包类型 , 减项 , 根据项目打折标记进行判断
            // 装修单为满减类型 , 减项 , 全部打折
            // 打折标识 , 0/2表示不打折 , 1/3表示打折 , 0/1表示配比 , 2/3表示非配比

            var _type = [1, 3, 4, 5].indexOf(type) != -1 ? 1 : 0; // 减项类型/增项类型
            var _discount = ([1, 3].indexOf(type) != -1 && ([1, 3].indexOf(addReduceItem.discount) != -1 || [2, 3, 4].indexOf(addReduceDetail.decoration.type) != -1)) ? utils.accDiv(discount, 10) : 1;
            
            var _dcp = utils.accMul(unitPrice, _discount);
            var _total = utils.accMul(num ,  _dcp); // 计算总价

            addReduceItem.dcp = utils.changeThrDecimal(_dcp);
            addReduceItem.total = utils.changeThrDecimal(_total);
            
            if(_addReduceIds.indexOf(arId) != -1) {
                addReduceDetail.addItems[arId + "-" + _type].push(addReduceItem);
            }
		});

        $.each(addReduceDetail.addItems, function (i, e) {
            
            var arId = i.split('-')[0];
            var manage = $manage[arId];
            
            if(!manage) return true;
            
            addReduceDetail.addItems[i].push({
                "arId": arId,
                "itemName": "管理费",
                "quotationFunctionAreaName": "-",
                "measurementUnit": "-",
                "num": "-",
                "unitPrice": "-",
                "total": manage.managePrice
            });
        })
	}

	// 画每个报价详情的信息
	function generateAddReduceItem(addReduceItems){

		var addReduceTotalPrice = 0;
		var html = "";
		$.each(addReduceItems, function (i, v) {
		    
			var addReduceType = i.split('-')[1];
			var addReduceTotal = 0;
			var index = 1;
			
			var typeName = addReduceType == '1' ? '减项' : '增项'
			
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

			$.each(v, function (j, qv) {

				if (reduceNums[qv.ariId]) {
					qv.num = utils.changeThrDecimal(utils.accAdd(qv.num, reduceNums[qv.ariId]));
					qv.total = utils.changeThrDecimal(utils.accMul(qv.num, qv.dcp));
				}

				html += '<tr align="center">';
				html += '<td>' + index+++ '</td>';
				html += '<td>' + qv.itemName + '</td>';
				html += '<td>' + qv.quotationFunctionAreaName + '</td>';
				html += '<td>' + qv.measurementUnit + '</td>';
				html += '<td>' + qv.num + '</td>';
				html += '<td>' + qv.unitPrice + '</td>';
				html += '<td>' + qv.total + '</td>';
				html += '</tr>';

                addReduceTotal = utils.changeThrDecimal(utils.accAdd(qv.total, addReduceTotal));
            });

			html += '</tbody></table>';
			html += typeName + '金额: ' + utils.changeThrDecimal(addReduceTotal)  + '元';
			html += '<hr><p></p>';
			addReduceTotalPrice = utils.changeThrDecimal(utils.accAdd(addReduceType == '1' ? utils.changeThrDecimal(-addReduceTotal) : utils.changeThrDecimal(addReduceTotal),addReduceTotalPrice));
		});
		
		$("#labSumMoney").html("工程最终增减合计金额: " + utils.changeThrDecimal(addReduceTotalPrice) + "元");
		
		return html;
	}

	// 画页面主
	function generatePrintPage() {
	    
		var html = "";
		
		var decoration = addReduceDetail.decoration;

		$("#orderId").html("装修单号: " + decoration.orderId);
		$("#orderAddr").html("楼盘地址: " + decoration.house.village.name + " " + decoration.house.houseNumber);
		$("#supervisor").html("监理: " + (decoration.supervisor != null ? decoration.supervisor.currentName : "-"));
		$("#designer").html("设计师: " + (decoration.designer != null ? decoration.designer.currentName : "-"));

		html += generateAddReduceItem(addReduceDetail.addItems);

		$("#content").html(html);
	}
});

