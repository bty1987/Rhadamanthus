var decorationOrderDetail = {
	decorationOrderId:null,
	
	customer:{},
	village:{},
	
	quotationDetail:null,
	decorationOrder:null,
	decorationOrderQuotationItemData:[]
};

function printHeader(headStr){
	
	var quotation = decorationOrderDetail.quotation;
	
	var headHtml = "";
	
	headHtml += '<table style="font-size: 14px" width="100%" bgcolor="#000000" border="0" cellpadding="1" cellspacing="0">';
	headHtml += '<tbody><tr bgcolor="#FFFFFF">';
	headHtml += '<td colspan="8" style="font-size: 20px" align="center"> <b>' + headStr + '</b></td>';
	headHtml += '</tr>';
	headHtml += '<tr bgcolor="#FFFFFF">';
	headHtml += '<td colspan="8" height="10"></td>';
	headHtml += '</tr>';
	headHtml += '<tr bgcolor="#FFFFFF">';
	headHtml += '<td colspan="3" width="40%">客户姓名:' + quotation.customerName + '</td>';
	headHtml += '<td colspan="3" width="40%">订单编号:' + quotation.orderId + '</td>';
	headHtml += '<td colspan="2" width="20%">设 计 师:' + quotation.designerName + '</td>';
	headHtml += '</tr>';
	headHtml += '<tr bgcolor="#FFFFFF">';
	headHtml += '<td colspan="3" width="40%">签约店面:' + quotation.designDepartmentName + '</td>';
	headHtml += '<td colspan="3" width="40%">工程地址:' + quotation.orderAddr + '</td>';
	headHtml += '<td colspan="2" width="20%">房屋面积:' + quotation.houseArea + '</td>';
	headHtml += '</tr>';
	headHtml += '<tr bgcolor="#FFFFFF">';
	headHtml += '<td colspan="8" height="10"></td>';
	headHtml += '</tr>';
	headHtml += '</tbody></table>';
	
	return headHtml;
}

function printProjectTable(){
	
	var discount = decorationOrderDetail.quotation.discount;
	
	var contentHtml = '';
	
	contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
	contentHtml += '<tbody><tr bgcolor="#FFFFFF">';
	contentHtml += '<td width="4%" align="center">序号</td>';
	contentHtml += '<td width="18%" align="center">项目名称</td>';
	contentHtml += '<td width="5%" align="center">单位</td>';
	contentHtml += '<td width="5%" align="center">数量</td>';
	contentHtml += '<td width="5%" align="center">单价</td>';
	contentHtml += '<td width="5%" align="center">合价</td>';
	contentHtml += '<td width="52%" align="center">工艺做法及材料说明</td>';
	contentHtml += '</tr>';
	contentHtml += '</tbody></table>';
	
	var quotationFunctionAreas = decorationOrderDetail.quotationFunctionAreas;
	var quotationFunctionAreaLength = quotationFunctionAreas.length;
	
	contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
	contentHtml += '<tbody>';
	
	for(var i=0;i<quotationFunctionAreaLength;++i){
		
		var quotationFunctionArea = quotationFunctionAreas[i];
		var quotationFunctionAreaItems = quotationFunctionArea.quotationFunctionAreaItems;
		
		if(decorationOrderDetail.addReduceAreas[quotationFunctionArea.qfaId]){
			quotationFunctionAreaItems = quotationFunctionAreaItems.concat(decorationOrderDetail.addReduceAreas[quotationFunctionArea.qfaId]);
		}
		
		var quotationFunctionAreaItemLength = quotationFunctionAreaItems.length;
		
		contentHtml += '<tr bgcolor="#CCCCCC">';
		contentHtml += '<td colspan="1">';
		contentHtml += '<div align="center">' + utils.getBigNumber(i+1) + '</div></td>';
		contentHtml += '<td colspan="8">';
		contentHtml += '<div align="left">' + quotationFunctionArea.functionAreaName + '';
		contentHtml += '</div>';
		contentHtml += '</td>';
		contentHtml += '</tr>';
		
		for(var j=0;j<quotationFunctionAreaItemLength;++j){
			
			var quotationFunctionAreaItem = quotationFunctionAreaItems[j];
			
			var _discount = quotationFunctionAreaItem.discount == 0 ? 1 : utils.accDiv(discount, 10);
			
			if(decorationOrderDetail.reduceNums[quotationFunctionAreaItem.qfaiId]){
				quotationFunctionAreaItem.num = utils.accAdd(quotationFunctionAreaItem.num, decorationOrderDetail.reduceNums[quotationFunctionAreaItem.qfaiId]);
			}
			
			var _discountUnitPrice = utils.changeThrDecimal(utils.accMul(parseFloat(quotationFunctionAreaItem.unitPrice), _discount));
			var _sum = utils.changeThrDecimal(utils.accMul(_discountUnitPrice, quotationFunctionAreaItem.num));
			var _preSum = utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.unitPrice, quotationFunctionAreaItem.num));
			
			if(quotationFunctionAreaItem.type == 2){
				
				var $value = decorationOrderDetail.quotation.trafficPrice;
				
				_discountUnitPrice = $value;
				_sum = $value;
			}else if(quotationFunctionAreaItem.type == 3){
				var $value = decorationOrderDetail.quotation.managePrice;
				
				_discountUnitPrice = $value;
				_sum = $value;
			}
			
			contentHtml += '<tr bgcolor="#FFFFFF">';
			contentHtml += '<td width="4%" align="center">' + (j+1) + '</td>';
			contentHtml += '<td width="18%" align="left">' + quotationFunctionAreaItem.itemName + '</td>';
			contentHtml += '<td width="5%" align="center">' + quotationFunctionAreaItem.measurementUnit + '</td>';
			contentHtml += '<td width="5%" align="center">' + quotationFunctionAreaItem.num + '</td>';
			contentHtml += '<td width="5%" align="center">' + _discountUnitPrice + '</td>';
			contentHtml += '<td width="5%" align="center"> ' + _sum + '</td>';
			contentHtml += '<td width="52%" align="left">' + quotationFunctionAreaItem.content + '</td>';
			contentHtml += '</tr>';
		}
	}
	
	contentHtml += '<tr bgcolor="#FFFFFF">';
	contentHtml += '<td colspan="11" align="left">工程总价:' + decorationOrderDetail.quotation.totalPrice + '元</td>';
	contentHtml += '</tr>';
	
	contentHtml += '</tbody>';
	contentHtml += '</table>';
	
	contentHtml += '<table style="font-size: 12px" width="100%" border="0" cellpadding="1" cellspacing="0">';
	contentHtml += '<tbody>';
	contentHtml += '<tr>';
	contentHtml += '<td height="10"></td>';
	contentHtml += '</tr>';
	contentHtml += '<tr>';
	contentHtml += '<td><b>&nbsp;客户签字:</b></td>';
	contentHtml += '<td><b>设计师签字:</b></td>';
	contentHtml += '<td><b>项目经理签字:</b></td>';
	contentHtml += '</tr><tr>';
	contentHtml += '</tr></tbody></table>';
	
	return contentHtml;
}

function printFinanceTable(){
	
	var discount = decorationOrderDetail.quotation.discount;
	var totalPrice = decorationOrderDetail.quotation.totalPrice;
	
	var contentHtml = '';
	
	contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
	contentHtml += '<tbody>';
	contentHtml += '<tr align="center" bgcolor="#FFFFFF">';
	contentHtml += '<td width="4%"><strong>序号</strong></td>';
	contentHtml += '<td width="27%"><strong>项目名称</strong></td>';
	contentHtml += '<td width="8%"><strong>单位</strong></td>';
	contentHtml += '<td width="7%"><strong>数量</strong></td>';
	contentHtml += '<td width="8%"><strong>折前单价</strong></td>';
	contentHtml += '<td width="10%"><strong>折前金额(元)</strong></td>';
	contentHtml += '<td width="6%"><strong>折扣</strong></td>';
	contentHtml += '<td width="8%"><strong>折后单价</strong></td>';
	contentHtml += '<td width="10%"><strong>折后金额(元)</strong></td>';
	contentHtml += '</tr>';
	
	var discountPrice = 0.0;
	var preDiscountPrice = 0.0;
	
	var quotationFunctionAreas = decorationOrderDetail.quotationFunctionAreas;
	var quotationFunctionAreaLength = quotationFunctionAreas.length;
	
	for(var i=0;i<quotationFunctionAreaLength;++i){
		
		var quotationFunctionArea = quotationFunctionAreas[i];
		var quotationFunctionAreaItems = quotationFunctionArea.quotationFunctionAreaItems;
		
		if(decorationOrderDetail.addReduceAreas[quotationFunctionArea.qfaId]){
			quotationFunctionAreaItems = quotationFunctionAreaItems.concat(decorationOrderDetail.addReduceAreas[quotationFunctionArea.qfaId]);
		}
		
		var quotationFunctionAreaItemLength = quotationFunctionAreaItems.length;
		
		var discountUnitPrice = 0.0;
		var sum = 0.0;
		var preSum = 0.0;
		
		var _manageRate = 0;
		var _tranRate = 0;
		
		contentHtml += '<tr bgcolor="#CCCCCC">';
		contentHtml += '<td><div align="center">' + utils.getBigNumber(i+1) + '</div></td>';
		contentHtml += '<td colspan="8">';
		contentHtml += '<div align="left"> ' + quotationFunctionArea.functionAreaName + '</div>';
		contentHtml += '</td>';
		contentHtml += '</tr>';
		
		for(var j=0;j<quotationFunctionAreaItemLength;++j){
			
			var quotationFunctionAreaItem = quotationFunctionAreaItems[j];
			
			var _discount = quotationFunctionAreaItem.discount == 0 ? 1 : utils.accDiv(discount, 10);
			
			if(decorationOrderDetail.reduceNums[quotationFunctionAreaItem.qfaiId]){
				quotationFunctionAreaItem.num = utils.accAdd(quotationFunctionAreaItem.num, decorationOrderDetail.reduceNums[quotationFunctionAreaItem.qfaiId]);
			}
			
			var _discountUnitPrice = utils.changeThrDecimal(utils.accMul(parseFloat(quotationFunctionAreaItem.unitPrice), _discount));
			var _sum = utils.changeThrDecimal(utils.accMul(_discountUnitPrice, quotationFunctionAreaItem.num));
			var _preSum = utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.unitPrice, quotationFunctionAreaItem.num));
			
			if(quotationFunctionAreaItem.type == 2){
				
				var $value = decorationOrderDetail.quotation.trafficPrice;
				
				_discountUnitPrice = $value;
				_sum = $value;
				_preSum = 0;
				
				_tranRate = quotationFunctionAreaItem.unitPrice;
				
				quotationFunctionAreaItem.unitPrice = $value;
			}else if(quotationFunctionAreaItem.type == 3){
				var $value = decorationOrderDetail.quotation.managePrice;
				
				_discountUnitPrice = $value;
				_sum = $value;
				_preSum = 0;
				
				_manageRate = utils.accAdd(quotationFunctionAreaItem.unitPrice, decorationOrderDetail.quotation.notSalesmanRate);
				
				quotationFunctionAreaItem.unitPrice = $value;
			}
			
			contentHtml += '<tr align="center" bgcolor="#FFFFFF">';
			contentHtml += '<td>' + (j+1) + '</td> ';
			contentHtml += '<td>' + quotationFunctionAreaItem.itemName + '</td>';
			contentHtml += '<td>' + quotationFunctionAreaItem.measurementUnit + '</td>';
			contentHtml += '<td>' + quotationFunctionAreaItem.num + '</td>';
			contentHtml += '<td>' + quotationFunctionAreaItem.unitPrice + '</td>';
			contentHtml += '<td>' + _preSum + '</td>';
			
			if(quotationFunctionAreaItem.discount == 0){
				contentHtml += '<td>10</td>';
			}else{
				contentHtml += '<td>' + discount + '</td>';
			}
			
			contentHtml += '<td>' + _discountUnitPrice + '</td>';
			contentHtml += '<td>' + _sum + '</td>';
			contentHtml += '</tr>';
			
			sum = sum + _sum;
			discountPrice = discountPrice + _sum;
			preSum = preSum + _preSum;
			
			preDiscountPrice = preDiscountPrice + _preSum;
		}
		
		contentHtml += '<tr align="center" bgcolor="#FFFFFF">';
		contentHtml += '<td>&nbsp;</td>';
		contentHtml += '<td><span class="STYLE1">&lt;' + quotationFunctionArea.functionAreaName + '&gt;小计</span></td>';
		contentHtml += '<td>&nbsp;</td>';
		contentHtml += '<td>&nbsp;</td>';
		contentHtml += '<td>&nbsp;</td>';
		contentHtml += '<td><span class="STYLE2"><strong>' + Math.round(preSum * 1000) / 1000 + '</strong></span></td>';
		contentHtml += '<td>&nbsp;</td>';
		contentHtml += '<td>&nbsp;</td>';
		contentHtml += '<td><span class="STYLE2"><strong>' + Math.round(sum * 1000) / 1000 + '</strong></span></td>';
		contentHtml += '</tr>';
		contentHtml += '';
	}
	
	var _transfee =  utils.changeThrDecimal(utils.accMul(preDiscountPrice, _tranRate));
	var _managefee = utils.changeThrDecimal(utils.accMul(utils.accAdd(preDiscountPrice, _transfee), _manageRate));
	
	preDiscountPrice = utils.changeThrDecimal(utils.accAdd(preDiscountPrice, utils.accAdd(_transfee, _managefee)));
	
	contentHtml += '<tr bgcolor="#FFFFFF">';
	contentHtml += '<td colspan="9" align="left"><strong>总 计&nbsp;&nbsp;&nbsp;&nbsp;折前:' + preDiscountPrice + '&nbsp;&nbsp;&nbsp;&nbsp;折后:' + totalPrice + '</strong></td>';
	contentHtml += '</tr>';
	contentHtml += '</tbody>';
	contentHtml += '</table>';
	
	return contentHtml;
}

function printCustomerTable(){
	
	var contentHtml = '';
	
	contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="0" cellspacing="0">';
	contentHtml += '<tbody>';
	contentHtml += '<tr align="center" bgcolor="#FFFFFF">';
	contentHtml += '<td width="4%"><strong>序号</strong></td>';
	contentHtml += '<td width="18%"><strong>项目名称</strong></td>';
	contentHtml += '<td width="4%"><strong>计量单位</strong></td>';
	contentHtml += '<td width="3%"><strong>数量</strong></td>';
	contentHtml += '<td width="72%"><strong>工艺做法及材料说明</strong></td>';
	contentHtml += '</tr>';
	
	var quotationFunctionAreas = decorationOrderDetail.quotationFunctionAreas;
	var quotationFunctionAreaLength = quotationFunctionAreas.length;
	
	for(var i=0;i<quotationFunctionAreaLength;++i){
		
		var quotationFunctionArea = quotationFunctionAreas[i];
		var quotationFunctionAreaItems = quotationFunctionArea.quotationFunctionAreaItems;
		
		if(decorationOrderDetail.addReduceAreas[quotationFunctionArea.qfaId]){
			quotationFunctionAreaItems = quotationFunctionAreaItems.concat(decorationOrderDetail.addReduceAreas[quotationFunctionArea.qfaId]);
		}
		
		var quotationFunctionAreaItemLength = quotationFunctionAreaItems.length;
		
		contentHtml += '<tr bgcolor="#CCCCCC">';
		contentHtml += '<td colspan="1">';
		contentHtml += '<div align="center">' + utils.getBigNumber(i+1) + '</div></td>';
		contentHtml += '<td colspan="8">';
		contentHtml += '<div align="left"> ' + quotationFunctionArea.functionAreaName + '';
		contentHtml += '</div>';
		contentHtml += '</td>';
		contentHtml += '</tr>';
		
		for(var j=0;j<quotationFunctionAreaItemLength;++j){
			
			var quotationFunctionAreaItem = quotationFunctionAreaItems[j];
			
			contentHtml += '<tr align="center" bgcolor="#FFFFFF">';
			contentHtml += '<td>' + (j+1) + '</td>';
			contentHtml += '<td align="left">' + quotationFunctionAreaItem.itemName + '</td>';
			contentHtml += '<td>项</td>';
			contentHtml += '<td>1</td>';
			contentHtml += '<td align="left">' + quotationFunctionAreaItem.content + '</td>';
			contentHtml += '</tr>';
		}
		
	}
	contentHtml += '</tbody>';
	contentHtml += '</table>';
	
	contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
	contentHtml += '<tbody><tr bgcolor="#FFFFFF">';
	contentHtml += '<td height="42"><p>备注</p>';
	contentHtml += '<p>说明</p></td>';
	contentHtml += '<td colspan="6" height="42">';
	contentHtml += '<table style="font-size: 12px" width="100%">';
	contentHtml += '<tbody><tr><td width="100%">1、为了维护您的权益,请您不要接受任何口头承诺,任何口头承诺均属无效.</td>';
	contentHtml += '</tr>';
	contentHtml += '<tr><td>2、装修许可证及抵押金、施工人员入园证及押金等相关费用、事宜由甲方负责.</td></tr><tr>';
	contentHtml += '</tr><tr><td>3、施工项目以此工程明细表为准,未包含项目均由甲方提供或甲方委托乙方代购,效果图为辅助参考.</td></tr><tr>';
	contentHtml += '</tr><tr><td>4、全市唯一1:1模拟专业放线系统需甲乙双方到场确认施工标准,乙方日后所有施工以放线为准,因甲方原因造成施工二次改动,所发生费用由甲方承担.</td></tr><tr>';
	contentHtml += '</tr><tr><td>5、此施工项目内不含网络宽带进户、可视对讲移位(由小区物业负责)、煤气主管线改造(由煤气公司负责)、水钻打孔.</td>';
	contentHtml += '</tr><tr>';
	contentHtml += '<td>6、鉴于客户安全和国家施工规范要求,乙方不负责承重墙拆改\配电箱\水表\上下水主管道\烟道及排风道改造.如甲方强制要求乙方拆改,需签定相关协议,乙方只负责施工不承     &nbsp;&nbsp;&nbsp;担任何相关责任及处罚.如需复原甲方自行承担费用.</td>';
	contentHtml += '</tr><tr>';
	contentHtml += '</tr><tr>';
	contentHtml += '<td>7、如园区有包园现象或住宅电梯不可用,项目中(沙子、水泥、红砖,夹心板、石膏粉、腻子粉等材料搬运上楼,残土搬运下楼)产生';
	contentHtml += '的搬运费,吊装费全部由甲方负责.如园区';
	contentHtml += '&nbsp;&nbsp;&nbsp;有包园,乙方力工砸墙费用已收情况下,按实际收取费用全额退还甲方,力工砸墙由甲方负责.</td>';
	contentHtml += '</tr><tr>';
	contentHtml += '<td>8、园区进不去车情况下,发生二次搬运时会产生园区搬运费.乙方负责将垃圾运至小区指定地点,如需运出小区,所发生费用由甲方承担.</td>';
	contentHtml += '</tr><tr>';
	contentHtml += '</tr><tr>';
	contentHtml += '<td>9、原建筑没有电线情况下,需要公司提供施工、重新布线,需要在收取正常电路改造费用基础上,另按30元每平米加收费用.</td>';
	contentHtml += '</tr><tr>';
	contentHtml += '</tr><tr>';
	contentHtml += '<td>10、如甲方要求乙方铺设波化砖上墙及仿古砖,需要瓷砖粘贴剂及厂家加工费用时,其由甲方负责.如甲方购砖不确定产品尺寸规格,应按实际购砖规格补齐预算差额后,乙方再进  &nbsp;&nbsp;&nbsp;行施工(详见瓷砖铺设工艺做法及材料说明).</td>';
	contentHtml += '</tr><tr>';
	contentHtml += '<td>11、施工中室内铺设地板位置如改铺地砖或发现原始地面不符合地板铺设条件需要地面找平时,其费用另计由甲方先行支付再行施工.</td>';
	contentHtml += '</tr><tr>';
	contentHtml += '</tr><tr>';
	contentHtml += '<td>12、施工中甲方定制成品门情况下,如需要门口夹心板木基层处理,其费用另计,由甲方先行支付再行施工.</td>';
	contentHtml += '</tr><tr>';
	contentHtml += '</tr><tr>';
	contentHtml += '<td>13、施工中如发生增项,需甲方与乙方签定施工增减项变更单,交付增项款后,再行施工.如发生减项,减项额度不能超出总工程款5%.如超出甲方需交付乙方该减项款的30%违约 &nbsp;&nbsp;&nbsp;金,再行施工.</td>';
	contentHtml += '</tr><tr>';
	contentHtml += '</tr><tr>';
	contentHtml += '<td>14、甲方按合同内工程进度付款,若甲方延期付款,乙方有权停止施工,乙方不承担因此所引起的工期延误及各种责任和损失.甲方须将全部工程款项结清后,可享受乙方提供保洁 &nbsp;&nbsp;&nbsp;一次及保修,否则乙方有权不予保洁及保修.</td>';
	contentHtml += '</tr><tr>';
	contentHtml += '</tr><tr>';
	contentHtml += '<td>15、工程施工工期完工以油工施工完毕,撤离施工现场为标准.后期安装、保洁时间不在正式施工工期范围内.';
	contentHtml += '</td>';
	contentHtml += '</tr><tr>';
	contentHtml += '</tr><tr>';
	contentHtml += '<td>16、甲方交付工程款及相关款项需要有乙方正式收据做为凭证,否则视为无效.</td>';
	contentHtml += '</tr><tr>';
	contentHtml += '</tr><tr>';
	contentHtml += '<td>17、甲方签署后,表示对此工程明细表的价格、工艺及各条款认可,并自愿承担相关法律责任.</td>';
	contentHtml += '</tr><tr>';
	contentHtml += '</tr><tr>';
	contentHtml += '<td>18、所有工程项目施工结束,甲乙双方清算增减项目交尾款后,甲方到乙方处开发票并补交税金.最终解释权归' + config.companyFullName + '所有.</td>';
	contentHtml += '</tr><tr>';
	contentHtml += '</tr></tbody></table>';
	contentHtml += '</td>';
	contentHtml += '</tr>';
	contentHtml += '</tbody></table>';
	
	contentHtml += '<table style="font-size: 12px" width="100%" border="0" cellpadding="1" cellspacing="0">';
	contentHtml += '<tbody><tr>';
	contentHtml += '<td height="10"></td>';
	contentHtml += '</tr>';
	contentHtml += '<tr>';
	contentHtml += '<td><b>&nbsp;客户签字:</b></td>';
	contentHtml += '<td><b>设计师签字:</b></td>';
	contentHtml += '<td>&nbsp;</td>';
	contentHtml += '</tr><tr>';
	contentHtml += '</tr></tbody></table>';
	
	return contentHtml;
}

jQuery(function($) {
	
	Api().init('../../js/api/');
	
	params.server = window.server;
	params.authentication = window.authentication;
	
	var addReduceItemtypeDict = {"0" : "普通", "1" : "系统", "2" : "自定义", "3" : "报价中", "4": "增项"};
	
	var type, p = window.location.search.substr(1);
	
	if(p.indexOf('time=') != -1){
		params.loginTime = p.substring(p.indexOf('time=')).split('=')[1];
	}
	
	$.each(p.split('&'), function(i, v){
		if(v.indexOf('type=') != -1){
			type = v.substring(v.indexOf('type=')).split('=')[1];
		}
	});
	
	var url = api.quotation.queryQuotationById;
	
	url.url = url.url+"?"+p;
	
	com.post(url, {}, function(res){
		decorationOrderDetail.quotation = res.quotation;
	}, null, false);
	
	url = api.quotation.queryQuotationFunctionAreaByQuotationId;
	
	url.url = url.url+"?"+p;
	
	com.post(url, {}, function(res){
		decorationOrderDetail.quotationFunctionAreas = res.quotationFunctionAreas;
	}, null, false);

	url = api.addReduce.queryAddReduceByOrderId;
//	url = api.addReduce.queryAddReduceForPayedByOrderId;
	
	var addReduceIds = {};
	var addReduceAreas = {};
	var reduceNums = {};
	
	com.post(url, {'addReduce.orderId': decorationOrderDetail.quotation.orderId}, function(res){
		$.each(res.addReduces, function(i, v){
			addReduceIds['addReduceIds[' + i + ']'] = v.arId;
		});
	}, null, false);
	
	com.post(api.addReduce.queryAddReduceItemByAddReduceIds, addReduceIds, function(res){
		
		$.each(res.addReduceItems, function(i, v){
			
			if([0, 2].indexOf(v.type) != -1){
				v.itemName = v.itemName + "(增项" + addReduceItemtypeDict[v.type] + ")";
			}else{
				
				if(reduceNums[v.quoteItemId]){
					reduceNums[v.quoteItemId] = utils.accAdd(reduceNums[v.quoteItemId], v.num);
				}else{
					reduceNums[v.quoteItemId] = v.num;
				}
				
				v.num = -v.num;
				v.itemName = v.itemName + "(减项" + addReduceItemtypeDict[v.type] + ")";
			}
			
			v.type = -1;
			
			if(addReduceAreas[v.quotationFunctionAreaId]){
				addReduceAreas[v.quotationFunctionAreaId].push(v);
			}else{
				addReduceAreas[v.quotationFunctionAreaId] = [v];
			}
		});
		
		decorationOrderDetail.addReduceAreas = addReduceAreas;
		decorationOrderDetail.reduceNums = reduceNums;
		
		console.log(addReduceAreas);
		console.log(reduceNums);
		
	}, null, false);
	
	generatePrintPage(type);

	$("#btnPrint").click(function(){
		$("#printPaymentReceipt").attr('style','display:none');
		window.print();
		$("#printPaymentReceipt").attr('style','display:block');
	});
});

function generatePrintPage(type){
	var html = "";

	if(type == '1'){
		html += printHeader(config.companyFullName + "家装预算(工程)");
		html += printProjectTable();
	}else if(type == '2'){
		html += printHeader(config.companyFullName + "家装预算(财务)");
		html += printFinanceTable();
	}else if(type == '3'){
		html += printHeader(config.companyFullName + "家装项目单");
		html += printCustomerTable();
	}
	                                                                                                                                                                                                       
	$("#quotationList").html(html);
}

