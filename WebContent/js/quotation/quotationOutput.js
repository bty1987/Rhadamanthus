var quotationOutput = {
	quotationDetail: {},
};

function printHeader(headStr) {

	var quotation = quotationOutput.quotationDetail.quotation;
	var decoration = quotationOutput.quotationDetail.decoration;

	var headHtml = "";

	headHtml += '<table style="font-size: 14px" width="100%" bgcolor="#000000" border="0" cellpadding="1" cellspacing="0">';
	headHtml += '<tbody><tr bgcolor="#FFFFFF">';
	headHtml += '<td colspan="8" style="font-size: 20px" align="center"> <b>' + headStr + '</b></td>';
	headHtml += '</tr>';
	headHtml += '<tr bgcolor="#FFFFFF">';
	headHtml += '<td colspan="8" height="10"></td>';
	headHtml += '</tr>';
	headHtml += '<tr bgcolor="#FFFFFF">';
	headHtml += '<td colspan="3" width="40%">客户姓名: ' + decoration.customer.name + '</td>';
	headHtml += '<td colspan="3" width="40%">装修单号: ' + quotation.orderId + '</td>';
	headHtml += '<td colspan="2" width="20%">设 计 师: ' + decoration.designer.currentName + '</td>';
	headHtml += '</tr>';
	headHtml += '<tr bgcolor="#FFFFFF">';
	headHtml += '<td colspan="3" width="40%">签约店面: ' + decoration.designer.dept.name + '</td>';
	headHtml += '<td colspan="3" width="40%">工程地址: ' + decoration.house.village.name + " " + decoration.house.houseNumber + '</td>';
	headHtml += '<td colspan="2" width="20%">房屋面积: ' + decoration.house.buildArea + '</td>';
	headHtml += '</tr>';
	headHtml += '<tr bgcolor="#FFFFFF">';
	headHtml += '<td colspan="8" height="10"></td>';
	headHtml += '</tr>';
	headHtml += '</tbody></table>';

	return headHtml;
}

function printProjectTable() {
	var index = 0;

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

	var quotationFunctionAreas = quotationOutput.quotationDetail.quotationFunctionAreaItemCs;

	contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
	contentHtml += '<tbody>';

	$.each(quotationFunctionAreas, function (i, v) {

		contentHtml += '<tr bgcolor="#CCCCCC">';
		contentHtml += '<td colspan="1">';
		contentHtml += '<div align="center">' + utils.getBigNumber(index+1) + '</div></td>';
		contentHtml += '<td colspan="8">';
		contentHtml += '<div align="left">' + i.split('-')[1] + '';
		contentHtml += '</div>';
		contentHtml += '</td>';
		contentHtml += '</tr>';

		$.each(v, function (j, qv) {

			if ([0, 1, 3].indexOf(qv.subtype) == -1) return true;

			contentHtml += '<tr bgcolor="#FFFFFF">';
			contentHtml += '<td width="4%" align="center">' + (j+1) + '</td>';
			contentHtml += '<td width="18%" align="left">' + qv.itemName+"("+qv.typestr+")" + '</td>';
			contentHtml += '<td width="5%" align="center">' + qv.measurementUnit + '</td>';
			contentHtml += '<td width="5%" align="center">' + qv.num + '</td>';
			contentHtml += '<td width="5%" align="center">' + qv.unitPrice + '</td>';
			contentHtml += '<td width="5%" align="center">' + (utils.accMul(qv.unitPrice, qv.num)) + '</td>';
			contentHtml += '<td width="52%" align="left">' + (qv.content ? qv.content : '-') + '</td>';
			contentHtml += '</tr>';
		});
		index++;
	});

	contentHtml += '<tr bgcolor="#FFFFFF">';
	contentHtml += '<td colspan="11" align="left">工程总价:' + quotationOutput.quotationDetail.UndisPrice + '元</td>';
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

function printFinanceTable(subtype, showType) {
	var index = 0;

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

	var quotationFunctionAreas = quotationOutput.quotationDetail.quotationFunctionAreaItemCs;

	$.each(quotationFunctionAreas, function (i, v) {
		var sum = 0.0;
		var preSum = 0.0;

		contentHtml += '<tr bgcolor="#CCCCCC">';
		contentHtml += '<td><div align="center">' + utils.getBigNumber(index+1) + '</div></td>';
		contentHtml += '<td colspan="8">';
		contentHtml += '<div align="left"> ' + i.split('-')[1] + '</div>';
		contentHtml += '</td>';
		contentHtml += '</tr>';
		$.each(v, function (j, qv) {

			if (subtype.indexOf(-2) != -1 || subtype.indexOf(qv.subtype) != -1) {

				contentHtml += '<tr align="center" bgcolor="#FFFFFF">';
				contentHtml += '<td>' + (j + 1) + '</td> ';
				contentHtml += '<td>' + qv.itemName + "(" + qv.typestr + ")" + '</td>';
				contentHtml += '<td>' + qv.measurementUnit + '</td>';
				contentHtml += '<td>' + qv.num + '</td>';
				contentHtml += '<td>' + qv.unitPrice + '</td>';
				contentHtml += '<td>' + qv.quotationTotalPrice + '</td>';
				contentHtml += '<td>' + qv._discountNum + '</td>';
				contentHtml += '<td>' + qv.unitPrice + '</td>';
				contentHtml += '<td>' + qv.quotationTotalPrice + '</td>';
				contentHtml += '</tr>';

				sum = sum + qv.quotationTotalPrice;
				preSum = preSum + qv.quotationTotalPrice;

				discountPrice = discountPrice + qv.quotationTotalPrice;
				preDiscountPrice = preDiscountPrice + qv.quotationTotalPrice;
			}

		});

		contentHtml += '<tr align="center" bgcolor="#FFFFFF">';
		contentHtml += '<td>&nbsp;</td>';
		contentHtml += '<td><span class="STYLE1">&lt;' + i.split('-')[1] + '&gt;小计</span></td>';
		contentHtml += '<td>&nbsp;</td>';
		contentHtml += '<td>&nbsp;</td>';
		contentHtml += '<td>&nbsp;</td>';
		contentHtml += '<td><span class="STYLE2"><strong>' + utils.changeTwoDecimal(preSum) + '</strong></span></td>';
		contentHtml += '<td>&nbsp;</td>';
		contentHtml += '<td>&nbsp;</td>';
		contentHtml += '<td><span class="STYLE2"><strong>' + utils.changeTwoDecimal(sum) + '</strong></span></td>';
		contentHtml += '</tr>';
		contentHtml += '';
		index++;
	});

	if (showType.showStandardPrice) {
		discountPrice = quotationOutput.quotationDetail.UndisPrice;
		preDiscountPrice = quotationOutput.quotationDetail.TotalPrice;
	}

	contentHtml += '<tr bgcolor="#FFFFFF">';
	contentHtml += '<td colspan="9" align="left"><strong>总 计&nbsp;&nbsp;&nbsp;&nbsp;折前:' + preDiscountPrice + '&nbsp;&nbsp;&nbsp;&nbsp;折后:' + discountPrice + '</strong></td>';
	contentHtml += '</tr>';
	contentHtml += '</tbody>';
	contentHtml += '</table>';

	return contentHtml;
}

function printCustomerTable(subtype, orderType) {
	var index = 0;
	var contentHtml = '';

	contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="0" cellspacing="0">';
	contentHtml += '<tbody>';

	if (orderType == 1) {
		contentHtml += '<tr bgcolor="#FFFFFF">';
		contentHtml += '<td width="4%" align="center">序号</td>';
		contentHtml += '<td width="18%" align="center">项目名称</td>';
		contentHtml += '<td width="4%" align="center">计量单位</td>';
		contentHtml += '<td width="3%" align="center">数量</td>';
		contentHtml += '<td width="5%" align="center">单价</td>';
		contentHtml += '<td width="5%" align="center">合价</td>';
		contentHtml += '<td width="62%" align="center">工艺做法及材料说明</td>';
		contentHtml += '</tr>';
		contentHtml += '</tbody></table>';
		contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
		contentHtml += '<tbody>';
	} else {
		contentHtml += '<tr align="center" bgcolor="#FFFFFF">';
		contentHtml += '<td width="4%"><strong>序号</strong></td>';
		contentHtml += '<td width="18%"><strong>项目名称</strong></td>';
		contentHtml += '<td width="4%"><strong>计量单位</strong></td>';
		contentHtml += '<td width="3%"><strong>数量</strong></td>';
		contentHtml += '<td width="72%"><strong>工艺做法及材料说明</strong></td>';
		contentHtml += '</tr>';
	}

	var quotationFunctionAreas = quotationOutput.quotationDetail.quotationFunctionAreaItemCs;

	$.each(quotationFunctionAreas, function (i, v) {

		var _index = 1;

		contentHtml += '<tr bgcolor="#CCCCCC">';
		contentHtml += '<td colspan="1">';
		contentHtml += '<div align="center">' + utils.getBigNumber(index+1) + '</div></td>';
		contentHtml += '<td colspan="8">';
		contentHtml += '<div align="left"> ' + i.split('-')[1] + '';
		contentHtml += '</div>';
		contentHtml += '</td>';
		contentHtml += '</tr>';

		$.each(v, function (j, qv) {
			if (subtype.indexOf(-2) != -1 || subtype.indexOf(qv.subtype) != -1) {

				if (orderType == 1) {
					contentHtml += '<tr bgcolor="#FFFFFF">';
					contentHtml += '<td width="4%" align="center">' + (j+1) + '</td>';
					contentHtml += '<td width="18%" align="left">' + qv.itemName + '</td>';
					contentHtml += '<td width="4%" align="center">' + qv.measurementUnit + '</td>';
					contentHtml += '<td width="3%" align="center">' + qv.num + '</td>';
					contentHtml += '<td width="5%" align="center">' + qv.dcp + '</td>';
					contentHtml += '<td width="5%" align="center">' + qv.dcpt + '</td>';
					contentHtml += '<td width="62%" align="left">' + (qv.content ? qv.content : "-") + '</td>';
				} else {
					contentHtml += '<tr align="center" bgcolor="#FFFFFF">';
					contentHtml += '<td>' + (_index++) + '</td>';
					contentHtml += '<td align="left">' + qv.itemName + '</td>';
					contentHtml += '<td>项</td>';
					contentHtml += '<td>1</td>';
					contentHtml += '<td align="left">' + (qv.content ? qv.content : "-") + '</td>';
				}

			}

			contentHtml += '</tr>';
		});
		index++;

	});

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
	contentHtml += '<td>9、原建筑没有电线情况下,需要公司提供施工、重新布线，需另计费用。</td>';
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
	contentHtml += '<td>18、所有工程项目施工结束,甲乙双方清算增减项目交尾款后,甲方到乙方处开发票并补交税金.</td>';
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

function printWorkTable(workType) {
	var index = 0;

	var contentHtml = '';

	contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
	contentHtml += '<tbody><tr bgcolor="#FFFFFF">';
	contentHtml += '<td width="8%" align="center">序号</td>';
	contentHtml += '<td width="22%" align="center">功能区</td>';
	contentHtml += '<td width="30%" align="center">项目名称</td>';
	contentHtml += '<td width="10%" align="center">单位</td>';
	contentHtml += '<td width="10%" align="center">数量</td>';
	contentHtml += '<td width="10%" align="center">增加量</td>';
	contentHtml += '<td width="10%" align="center">减少量</td>';
	contentHtml += '</tr>';
	contentHtml += '</tbody></table>';

	var quotationFunctionAreas = quotationOutput.quotationDetail.quotationFunctionAreaItemWs;;

	contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
	contentHtml += '<tbody>';

	$.each(quotationFunctionAreas, function (key, v){

		if (!workType || workType != key) return true;

		var itemIndex = 0;
		contentHtml += '<tr bgcolor="#CCCCCC">';
		contentHtml += '<td colspan="1">';
		contentHtml += '<div align="center">' + utils.getBigNumber(index+1) + '</div></td>';
		contentHtml += '<td colspan="8">';
		contentHtml += '<div align="left">' + key + ' ';
		contentHtml += '</div>';
		contentHtml += '</td>';
		contentHtml += '</tr>';

		$.each(v, function (j, qv) {

			contentHtml += '<tr bgcolor="#FFFFFF">';
			contentHtml += '<td width="8%" align="center">' + (itemIndex+1) + '</td>';
			contentHtml += '<td width="22%" align="center">' + qv.areaName + '</td>';
			contentHtml += '<td width="30%" align="center">' + qv.itemName + "(" + qv.typestr + ")" + '</td>';
			contentHtml += '<td width="10%" align="center">' + qv.measurementUnit + '</td>';
			contentHtml += '<td width="10%" align="center">' + qv.num + '</td>';
			contentHtml += '<td width="10%" align="center"></td>';
			contentHtml += '<td width="10%" align="left"></td>';
			contentHtml += '</tr>';
			itemIndex++;
		});
		index++;
	});

	contentHtml += '</tbody>';
	contentHtml += '</table>';

	contentHtml += '<table style="font-size: 12px" width="100%" border="0" cellpadding="1" cellspacing="0">';
	contentHtml += '<tbody>';
	contentHtml += '<tr>';
	contentHtml += '<td height="10"></td>';
	contentHtml += '</tr>';
	contentHtml += '<tr>';
	contentHtml += '<td><b>&nbsp;甲方签字:</b></td>';
	contentHtml += '<td><b>监理签字:</b></td>';
	contentHtml += '<td><b>质检签字:</b></td>';
	contentHtml += '<td><b>日期:</b></td>';
	contentHtml += '</tr><tr>';
	contentHtml += '</tr></tbody></table>';

	return contentHtml;

}

function initQuotationDetailItem (quotation, quotationFunctionAreas, addReduceItems, extensionItems, orderType, showType) {

	var quotationFunctionAreaItemTypeDict = {"0": "普通", "1": "自定义", "4": "不计"};
	var addReduceItemTypeDict = {"0": "增项 普通", "1": "减项 系统", "2": "增项 自定义", "3": "减项 报价中", "4": "减项 增项", "5": "减项 拓展项"};
	var extensionItemTypeDict = {"0": "拓展项增项", "1": "拓展项增项 自定义", "2": "拓展项减项", "3": "拓展项减项 自定义", "4": "拓展项减项"};

	var $decorationtype = orderType;
	var discount = quotation.discount;
	var realDiscount = utils.accDiv(discount, 10);
	var quotationFunctionAreaItemCs = {}, quotationFunctionAreaItemWs = {};

	var extensionAddTotal = 0, extensionReduceTotal = 0, addReduceAddTotal = 0, addReduceReduceTotal = 0;

	var reduceNums = {
		ariId: {},
		eiId: {},
		qfaiId: {},
	};

	if (showType.itemtype & 1) {

		for (var i = 0; i < quotationFunctionAreas.length; ++i) {

			var quotationFunctionArea = quotationFunctionAreas[i];

			if (showType.notManagementArea == quotationFunctionArea.functionAreaName) continue;

			var quotationFunctionAreaItems = sortQuo(quotationFunctionArea.quotationFunctionAreaItems);

			quotationFunctionAreaItemCs[quotationFunctionArea.qfaId + '-' + quotationFunctionArea.functionAreaName] = [];

			for (var j = 0; j < quotationFunctionAreaItems.length; j++) {

				var quotationFunctionAreaItem = quotationFunctionAreaItems[j];

				quotationFunctionAreaItem.typestr = [2, 3, 5].indexOf(quotationFunctionAreaItem.type) == -1 ? quotationFunctionAreaItemTypeDict[quotationFunctionAreaItem.type] : "-";

				var _dcp = 0, _dcpt = 0, _discountNum = 10;

				if ($decorationtype == 2) {
					_discountNum = discount;
					_dcp = quotationFunctionAreaItem.type < 2 || quotationFunctionAreaItem.type == 5 ? utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.unitPrice, realDiscount)) : quotationFunctionAreaItem.unitPrice;
				} else {
					_discountNum = quotationFunctionAreaItem.discount == 1 ? discount : 10 ;
					_dcp = quotationFunctionAreaItem.type < 2 || quotationFunctionAreaItem.type == 5 ? utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.unitPrice, (quotationFunctionAreaItem.discount == 1 ? realDiscount : 1))) : quotationFunctionAreaItem.unitPrice;
				}

				_dcpt = utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.initNum, _dcp));

				quotationFunctionAreaItem.num = quotationFunctionAreaItem.initNum;
				quotationFunctionAreaItem.dcp = _dcp;
				quotationFunctionAreaItem.dcpt = _dcpt;
				quotationFunctionAreaItem._discountNum = _discountNum;
				quotationFunctionAreaItem.quotationTotalPrice = utils.changeThrDecimal(utils.accMul(quotationFunctionAreaItem.initNum, quotationFunctionAreaItem.unitPrice));

				if (quotationFunctionArea.type == 3) {
					quotationFunctionAreaItem.num = quotationFunctionAreaItem.initNum;
					quotationFunctionAreaItem.dcp = 0;
					quotationFunctionAreaItem.dcpt = 0;
					quotationFunctionAreaItem._discountNum = 0;
					quotationFunctionAreaItem.quotationTotalPrice = 0;
				} else if (quotationFunctionAreaItem.type == 2) {
					quotationFunctionAreaItem.measurementUnit = "车运费";
					quotationFunctionAreaItem.num = quotation.trafficPrice;
					quotationFunctionAreaItem.dcp = quotationFunctionAreaItem.unitPrice;
					quotationFunctionAreaItem.dcpt = quotationFunctionAreaItem.discount == 1 || $decorationtype == 2 ? utils.changeThrDecimal(utils.accMul(quotation.trafficPrice, realDiscount)) : quotation.trafficPrice;
					quotationFunctionAreaItem.quotationTotalPrice = quotation.trafficPrice;
				} else if (quotationFunctionAreaItem.type == 3) {
					quotationFunctionAreaItem.measurementUnit = "管理费";
					quotationFunctionAreaItem.num = quotation.managePrice;
					quotationFunctionAreaItem.dcp = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItem.unitPrice, quotation.notSalesmanRate));
					quotationFunctionAreaItem.dcpt = quotationFunctionAreaItem.discount == 1 ? utils.changeThrDecimal(utils.accMul(quotation.managePrice, realDiscount)) : quotation.managePrice;
					quotationFunctionAreaItem._discountNum = quotationFunctionAreaItem.discount == 1 ? _discountNum : 10;
					quotationFunctionAreaItem.unitPrice = utils.changeThrDecimal(utils.accAdd(quotationFunctionAreaItem.unitPrice, quotation.notSalesmanRate));
					quotationFunctionAreaItem.quotationTotalPrice = quotation.managePrice;
				}

				quotationFunctionAreaItemCs[quotationFunctionArea.qfaId + '-' + quotationFunctionArea.functionAreaName].push(quotationFunctionAreaItem);

			}
		}
	}

	if (showType.itemtype & 2) {

		if (extensionItems != null && extensionItems != '') {

			for (var i = 0; i < extensionItems.length; ++i) {

				var extensionItem = extensionItems[i];

				var _dcp = 0, _dcpt = 0;
				extensionItem.typestr = extensionItemTypeDict[extensionItem.type];

				if ([0, 1].indexOf(extensionItem.type) != -1) {

					extensionItem._discountNum = 10;
					_dcp = extensionItem.unitPrice;
					_dcpt = utils.changeThrDecimal(utils.accMul(extensionItem.unitPrice, extensionItem.num));
					extensionAddTotal = utils.changeThrDecimal(utils.accAdd(extensionAddTotal, _dcpt));
				} else if ([2, 3, 4].indexOf(extensionItem.type) != -1) {

					extensionItem.unitPrice = -extensionItem.unitPrice;
					extensionItem._discountNum = discount;

					_dcp = utils.changeThrDecimal(utils.accMul(extensionItem.unitPrice, realDiscount));
					_dcpt = utils.changeThrDecimal(utils.accMul(utils.accMul(extensionItem.unitPrice, extensionItem.num), realDiscount));
					extensionReduceTotal = utils.changeThrDecimal(utils.accAdd(extensionReduceTotal, _dcpt));
				}

				extensionItem.dcp = _dcp;
				extensionItem.dcpt = _dcpt;
				extensionItem.quotationTotalPrice = utils.changeThrDecimal(utils.accMul(extensionItem.unitPrice, extensionItem.num));

				if (quotationFunctionAreaItemCs[extensionItem.quotationFunctionAreaId + '-' + extensionItem.quotationFunctionAreaName] == undefined) {
					quotationFunctionAreaItemCs[extensionItem.quotationFunctionAreaId + '-' + extensionItem.quotationFunctionAreaName] = [];
				}

				quotationFunctionAreaItemCs[extensionItem.quotationFunctionAreaId + '-' + extensionItem.quotationFunctionAreaName].push(extensionItem);

			}
		}
	}

	if (showType.itemtype & 4) {

		for (var i = 0; i < addReduceItems.length; ++i) {

			var addReduceItem = addReduceItems[i];

			var _dcp = addReduceItem.unitPrice, _dcpt = 0, _discountNum = 10;
			addReduceItem.typestr = addReduceItemTypeDict[addReduceItem.type];

			// 增项
			if ([0, 2].indexOf(addReduceItem.type) != -1) {

				_dcpt = utils.changeThrDecimal(utils.accMul(addReduceItem.num, _dcp));
				addReduceAddTotal = utils.changeThrDecimal(utils.accAdd(addReduceAddTotal, _dcpt));
			} else {

				if ([4].indexOf(addReduceItem.type) != -1) {
					if (reduceNums.ariId[addReduceItem.quoteItemId]) {
						reduceNums.ariId[addReduceItem.quoteItemId].num = utils.accAdd(reduceNums.ariId[addReduceItem.quoteItemId].num, addReduceItem.num);
					} else {
						reduceNums.ariId[addReduceItem.quoteItemId] = {};
						reduceNums.ariId[addReduceItem.quoteItemId].num = addReduceItem.num;
						reduceNums.ariId[addReduceItem.quoteItemId].quotationFunctionType = addReduceItem.quotationFunctionAreaType;
					}
				} else if ([5].indexOf(addReduceItem.type) != -1) {
					if (reduceNums.eiId[addReduceItem.quoteItemId]) {
						reduceNums.eiId[addReduceItem.quoteItemId].num = utils.accAdd(reduceNums.eiId[addReduceItem.quoteItemId].num, addReduceItem.num);
					} else {
						reduceNums.eiId[addReduceItem.quoteItemId] = {};
						reduceNums.eiId[addReduceItem.quoteItemId].num = addReduceItem.num;
						reduceNums.eiId[addReduceItem.quoteItemId].quotationFunctionType = addReduceItem.quotationFunctionAreaType;
					}
				} else if ([1].indexOf(addReduceItem.type) != -1) {

				} else if([3].indexOf(addReduceItem.type) != -1){

				}

				if (addReduceItem.type == 4 || addReduceItem.type == 5) {

				} else if ($decorationtype == 2) {
					_discountNum = discount;
					_dcp = utils.changeThrDecimal(utils.accMul(addReduceItem.unitPrice, realDiscount));
				} else {
					if ([1, 3].indexOf(addReduceItem.discount)) {
						_discountNum = discount;
						_dcp = utils.changeThrDecimal(utils.accMul(addReduceItem.unitPrice, realDiscount));
					}
				}

				addReduceItem.num = -addReduceItem.num;
				_dcpt = utils.changeThrDecimal(utils.accMul(addReduceItem.num, _dcp));
				addReduceReduceTotal = utils.changeThrDecimal(utils.accAdd(addReduceReduceTotal, _dcpt));
			}

			addReduceItem.quotationTotalPrice = utils.changeThrDecimal(utils.accMul(addReduceItem.num, addReduceItem.unitPrice));

			addReduceItem.dcp = _dcp;
			addReduceItem.dcpt = _dcpt;
			addReduceItem._discountNum = _discountNum;

			if (quotationFunctionAreaItemCs[addReduceItem.quotationFunctionAreaId + '-' + addReduceItem.quotationFunctionAreaName] == undefined) {
				quotationFunctionAreaItemCs[addReduceItem.quotationFunctionAreaId + '-' + addReduceItem.quotationFunctionAreaName] = [];
			}

			quotationFunctionAreaItemCs[addReduceItem.quotationFunctionAreaId + '-' + addReduceItem.quotationFunctionAreaName].push(addReduceItem);
		}
	}

	quotationOutput.quotationDetail.TotalPrice = 0;
	quotationOutput.quotationDetail.UndisPrice = 0;

	$.each(quotationFunctionAreaItemCs, function(i, v) {
		var areaName = i.split('-')[1];
		$.each(v, function (j, qv) {
			qv["areaName"] = areaName;
			if (quotationFunctionAreaItemWs[qv.workType] == undefined) {
				quotationFunctionAreaItemWs[qv.workType] = [];
			}

			quotationFunctionAreaItemWs[qv.workType].push(qv);
			// 折前
			quotationOutput.quotationDetail.TotalPrice = utils.changeThrDecimal(utils.accAdd(quotationOutput.quotationDetail.TotalPrice, qv.quotationTotalPrice));

			if (qv.ariId && reduceNums.ariId[qv.ariId]) {
				qv.num = utils.accAdd(qv.num, reduceNums.ariId[qv.ariId].num);
				qv.dcpt = utils.changeThrDecimal(utils.accMul(qv.num, qv.dcp));
				qv.quotationTotalPrice = utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice));
			} else if (qv.eiid && reduceNums.eiId[qv.eiid]) {
				qv.num = utils.accAdd(qv.num, reduceNums.eiId[qv.eiid].num);
				qv.dcpt = utils.changeThrDecimal(utils.accMul(qv.num, qv.dcp));
				qv.quotationTotalPrice = utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice));
			}
		});
	});

	// 折后
	quotationOutput.quotationDetail.UndisPrice = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(utils.accAdd(quotation.totalPrice, addReduceAddTotal), extensionAddTotal), extensionReduceTotal), addReduceReduceTotal));

	quotationOutput.quotationDetail.quotationFunctionAreaItemCs = quotationFunctionAreaItemCs;
	quotationOutput.quotationDetail.quotationFunctionAreaItemWs = quotationFunctionAreaItemWs;

}

function sortQuo(_items) {
	_items = _items.sort(function (a, b) {
		if (a.index == null || b.index == null) {//降序排列
			return b.index - a.index;
		} else {//升序
			return a.index - b.index;
		}
	});
	return _items;
}

jQuery(function($) {

	var params = {};

	api = parent.api;
	config = parent.config ;
	server = parent.server;
	utils = parent.utils;
	com = parent.com;
	company = parent.company;

	params.server = window.server;
	params.authentication = parent.params.authentication;
	params = parent.params;

	com.post(api.quotation.queryQuotationById, {"quotation.qid": params.quotationId}, function(res) {
		quotationOutput.quotationDetail.quotation = res.quotation;
	}, null, false);

	com.post(api.decoration.queryDecorationForCommonByOrderId, {"decoration.orderId": params.decorationOrderId}, function(res) {
		quotationOutput.quotationDetail.decoration = res.decoration;
	}, null, false);

	com.post(api.quotation.queryQuotationFunctionAreaByQuotationId, {"quotation.qid": params.quotationId}, function(res) {
		quotationOutput.quotationDetail.quotationFunctionAreas = res.quotationFunctionAreas;
	}, null, false);

	com.post(api.quotation.queryExtensionByOrderId,{"extension.orderId": params.decorationOrderId}, function (res) {
		var extensionItemIDs = {};
		$.each(res.extensions, function (i, v) {
			extensionItemIDs["extensionItemIDs[" + i + "]"] = v.eid;
		});

		com.post(api.quotation.queryExtensionItemByEids, extensionItemIDs, function (res) {
			quotationOutput.quotationDetail.extensions = res.extensionItems;
		}, null, false);

	}, null, false);

	com.post(api.addReduce.queryAddReduceByOrderId, {'addReduce.orderId': params.decorationOrderId}, function(res) {
		var addReduceIds = {};
		$.each(res.addReduces, function(i, v){
			addReduceIds['addReduceIds[' + i + ']'] = v.arId;
		});

		com.post(api.addReduce.queryAddReduceItemByAddReduceIds, addReduceIds, function(res) {
			quotationOutput.quotationDetail.addReduceItems = res.addReduceItems;
		}, null, false);

	}, null, false);

	initQuotationDetailItem(
		quotationOutput.quotationDetail.quotation,
		quotationOutput.quotationDetail.quotationFunctionAreas,
		quotationOutput.quotationDetail.addReduceItems,
		quotationOutput.quotationDetail.extensions, params.orderType, params.showType);

	generatePrintPage(params.type, params.subtype,
		params.workType, params.company.name, params.orderType, params.showType);

});

function generatePrintPage(type, subtype, workType, company, orderType, showType) {
	var html = "";

	if (type == '1') {
		html += printHeader(company + "家装预算(工程)");
		html += printProjectTable();
	} else if(type == '2') {
		html += printHeader(company + "家装预算(财务)");
		html += printFinanceTable(subtype, showType);
	} else if(type == '3') {
		html += printHeader(company + "家装项目单");
		html += printCustomerTable(subtype, orderType);
	} else if(type == "4") {
		html += printHeader(company + "工种项目单");
		html += printWorkTable(workType);
	}

	$("#quotationList").html(html);
}