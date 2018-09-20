
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

	var $decorationType = params.decorationType;
	var addReduceDetail = {
		addReduceDetails: null,
		addItems: {},
		reduceItems: {},
	};
	var reduceNums = {};
	var $addReduceItems = {};
	var _addReduceIds = [];
	var _orderId = params.decorationOrderId;
	//Api().init('../../js/api/');


	/*		var p = window.location.search.substr(1);

	if(p.indexOf('time=') != -1){
		params.loginTime = parent.params.loginTime;
	}

	$.each(p.split('&'), function(i, v){
		if(v.indexOf('orderType=') != -1){
			$decorationType = v.substring(v.indexOf('orderType=')).split('=')[1];
		}
		if(v.indexOf('addReduceIds[' + i + ']=') != -1){
			_addReduceIds.push(parseInt(v.substring(v.indexOf('addReduceIds[' + i + ']=')).split('=')[1]));
		}
		if(v.indexOf('quotation.orderId=') != -1){
			_orderId = v.substring(v.indexOf('quotation.orderId=')).split('=')[1];
		}
	});*/
	_addReduceIds = params.addReduceIds;
	var url = api.quotation.queryQuotationForDefaultByOrderId;

	com.post(url, {"quotation.orderId": _orderId}, function(res){
		addReduceDetail.quotation = res.quotation;
	}, null ,false);


	var $addReduceIds = {};
	//通过装修单号获取增减项信息
	url = api.addReduce.queryAddReduceByOrderId;
	com.post(url, {"addReduce.orderId":_orderId}, function (res) {
		var addReduces = res.addReduces;
		$.each(addReduces, function (i, v) {
			$addReduceIds["addReduceIds[" + i + "]"] = v.arId;
		});
	}, null, false);

	//通过增减项ID列表获取增减项中包含的报价项信息
	url = api.addReduce.queryAddReduceItemByAddReduceIds;
	com.post(url, $addReduceIds, function (res) {
		$addReduceItems = res.addReduceItems;
	}, null, false);

	calAddReduceSum();
	generatePrintPage();
	
	function printHeader(headStr){
		return headHtml;
	}
	//从所有的增减项中的报价详情中筛选出合适的报价并进行计算和处理
	function calAddReduceSum(){

		var addReduceItems = $addReduceItems;
		var addReduceItemLength = addReduceItems.length;

		var discount = addReduceDetail.quotation.discount;

		for(var i=0;i<addReduceItemLength;i++){
			
			var addReduceItem = addReduceItems[i];
			if ([4].indexOf(addReduceItem.type) != -1) {
				if (reduceNums[addReduceItem.quoteItemId]) {
					reduceNums[addReduceItem.quoteItemId] = utils.accAdd(reduceNums[addReduceItem.quoteItemId], addReduceItem.num);
				} else {
					reduceNums[addReduceItem.quoteItemId] = addReduceItem.num;
				}
			}
			var _dcp = utils.changeTwoDecimal(addReduceItem.unitPrice);

			if([1, 3].indexOf(addReduceItem.type) != -1){
				_dcp = utils.changeTwoDecimal(utils.accMul( _dcp, (addReduceItem.discount == 1 || $decorationType == 2 ? utils.accDiv(discount, 10) : 1)));
			}else if([0, 2, 4].indexOf(addReduceItem.type) != -1 && $decorationType == 2){
				//_dcp =  utils.changeTwoDecimal(utils.changeTwoDecimal(utils.accMul(_dcp,utils.accDiv(config.addreduceDiscount, 10))));
				
			}

			/*if(addReduceItem.quotationFunctionAreaType == 3 && [3].indexOf(addReduceItem.type) != -1){
				_dcp = 0;
			}*/
			var total = utils.changeTwoDecimal(utils.accMul(addReduceItem.num ,  _dcp));

			addReduceItem.dcp = _dcp;
			addReduceItem.total = total;

			if(_addReduceIds.indexOf(addReduceItem.arId) != -1) {

				if (addReduceItem.type == 0 || addReduceItem.type == 2) { // 增项
					if(!addReduceDetail.addItems[addReduceItem.arId+'-工程增项']){
						addReduceDetail.addItems[addReduceItem.arId+'-工程增项'] = [];
					}

					addReduceDetail.addItems[addReduceItem.arId+'-工程增项'].push(addReduceItem);

				} else { // 减项
					if(!addReduceDetail.addItems[addReduceItem.arId+'-工程减项']){
						addReduceDetail.addItems[addReduceItem.arId+'-工程减项'] = [];
					}

					addReduceDetail.addItems[addReduceItem.arId+'-工程减项'].push(addReduceItem);
				}
			}
		}

	}
//画每个报价详情的信息
	function generateAddReduceItem(addReduceItems){
		var addReduceTotalPrice = 0;
		var html = "";
		$.each(addReduceItems, function (i, v) {
			var addReduceType = i.split('-')[1];
			var addReduceTotal = 0;
			var index = 1;
			html += addReduceType;
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
			})

			html += '</tbody></table>';
			html += addReduceType + '金额:' + utils.changeThrDecimal(addReduceTotal)  + '元';
			html += '<hr><p></p>';
			addReduceTotalPrice = utils.changeThrDecimal(utils.accAdd(addReduceType == '工程减项' ? utils.changeThrDecimal(-addReduceTotal) : utils.changeThrDecimal(addReduceTotal),addReduceTotalPrice));
		})
		$("#labSumMoney").html("工程最终增减合计金额:" + utils.changeThrDecimal(addReduceTotalPrice) + "元");
		return html;
	}
//画页面 主
	function generatePrintPage(){
		html = "";

		$("#orderId").html("装修单号: " + addReduceDetail.quotation.orderId);
		$("#orderAddr").html("楼盘地址: " + addReduceDetail.quotation.orderAddr);
		$("#supervisor").html("监理: " + (addReduceDetail.quotation.supervisorName != null ? addReduceDetail.quotation.supervisorName : "--"));
		$("#designer").html("设计师: " + (addReduceDetail.quotation.designerName != null ? addReduceDetail.quotation.designerName : "--"));

		html += generateAddReduceItem(addReduceDetail.addItems);

		$("#content").html(html);
	}
});

