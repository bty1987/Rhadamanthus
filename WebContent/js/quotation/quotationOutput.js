
function printHeader(headStr){
	
	var quotation = quotationUtils.quotationDetail.quotation;
	var decoration = quotation.decoration;
	
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

function printProjectTable(){
	var index = 0;
	var discount = quotationUtils.quotationDetail.quotation.discount;
	
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
	
	var quotationFunctionAreas = quotationUtils.quotationDetail.quotationFunctionAreaItemCs;
	
	contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
	contentHtml += '<tbody>';

	$.each(quotationFunctionAreas, function (i, v){

		contentHtml += '<tr bgcolor="#CCCCCC">';
		contentHtml += '<td colspan="1">';
		contentHtml += '<div align="center">' + utils.getBigNumber(index+1) + '</div></td>';
		contentHtml += '<td colspan="8">';
		contentHtml += '<div align="left">' + i.split('-')[1] + '';
		contentHtml += '</div>';
		contentHtml += '</td>';
		contentHtml += '</tr>';

		$.each(v, function (j, qv){
		    
		    if([1, 3].indexOf(qv.subtype) == -1) return true;

			contentHtml += '<tr bgcolor="#FFFFFF">';
			contentHtml += '<td width="4%" align="center">' + (j+1) + '</td>';
			contentHtml += '<td width="18%" align="left">' + qv.itemName+"("+qv.typestr+")" + '</td>';
			contentHtml += '<td width="5%" align="center">' + qv.measurementUnit + '</td>';
			contentHtml += '<td width="5%" align="center">' + qv.num + '</td>';
			contentHtml += '<td width="5%" align="center">' + qv.unitPrice + '</td>';
			contentHtml += '<td width="5%" align="center"> ' + (utils.accMul(qv.unitPrice, qv.num)) + '</td>';
			contentHtml += '<td width="52%" align="left">' + (qv.content ? qv.content : '-') + '</td>';
			contentHtml += '</tr>';
		});
		index++;
	});
	
	contentHtml += '<tr bgcolor="#FFFFFF">';
	contentHtml += '<td colspan="11" align="left">工程总价:' + quotationUtils.quotationDetail.UndisPrice + '元</td>';
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
	var index = 0;
	var discount = quotationUtils.quotationDetail.quotation.discount;
	var totalPrice = quotationUtils.quotationDetail.quotation.totalPrice;

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

	var quotationFunctionAreas = quotationUtils.quotationDetail.quotationFunctionAreaItemCs;

	$.each(quotationFunctionAreas, function (i, v){
		var sum = 0.0;
		var preSum = 0.0;

		contentHtml += '<tr bgcolor="#CCCCCC">';
		contentHtml += '<td><div align="center">' + utils.getBigNumber(index+1) + '</div></td>';
		contentHtml += '<td colspan="8">';
		contentHtml += '<div align="left"> ' + i.split('-')[1] + '</div>';
		contentHtml += '</td>';
		contentHtml += '</tr>';
		$.each(v, function (j, qv){

			contentHtml += '<tr align="center" bgcolor="#FFFFFF">';
			contentHtml += '<td>' + (j+1) + '</td> ';
			contentHtml += '<td>' + qv.itemName+"("+qv.typestr+")" + '</td>';
			contentHtml += '<td>' + qv.measurementUnit + '</td>';
			contentHtml += '<td>' + qv.num + '</td>';
			contentHtml += '<td>' + qv.unitPrice + '</td>';
			contentHtml += '<td>' + qv.quotationTotalPrice + '</td>';

			contentHtml += '<td>' + qv._discountNum + '</td>';

			contentHtml += '<td>' + qv.unitPrice + '</td>';
			contentHtml += '<td>' + qv.quotationTotalPrice + '</td>';
			contentHtml += '</tr>';

			sum = sum + qv.quotationTotalPrice;
			discountPrice = discountPrice + qv.quotationTotalPrice;
			preSum = preSum + qv.quotationTotalPrice;

			preDiscountPrice = preDiscountPrice + qv.quotationTotalPrice;

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


	contentHtml += '<tr bgcolor="#FFFFFF">';
	contentHtml += '<td colspan="9" align="left"><strong>总 计&nbsp;&nbsp;&nbsp;&nbsp;折前:' + quotationUtils.quotationDetail.TotalPrice + '&nbsp;&nbsp;&nbsp;&nbsp;折后:' + quotationUtils.quotationDetail.UndisPrice + '</strong></td>';
	contentHtml += '</tr>';
	contentHtml += '</tbody>';
	contentHtml += '</table>';

	return contentHtml;
}

function printCustomerTable(subtype,companyfullname,orderType){
	var index = 0;
	var contentHtml = '';

    contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="0" cellspacing="0">';
    contentHtml += '<tbody>';

    if(orderType == 1){
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
    }else{
        contentHtml += '<tr align="center" bgcolor="#FFFFFF">';
        contentHtml += '<td width="4%"><strong>序号</strong></td>';
        contentHtml += '<td width="18%"><strong>项目名称</strong></td>';
        contentHtml += '<td width="4%"><strong>计量单位</strong></td>';
        contentHtml += '<td width="3%"><strong>数量</strong></td>';
        contentHtml += '<td width="72%"><strong>工艺做法及材料说明</strong></td>';
        contentHtml += '</tr>';
	}

	var quotationFunctionAreas = quotationUtils.quotationDetail.quotationFunctionAreaItemCs;

	$.each(quotationFunctionAreas, function (i, v){

        var _index = 1;

		contentHtml += '<tr bgcolor="#CCCCCC">';
		contentHtml += '<td colspan="1">';
		contentHtml += '<div align="center">' + utils.getBigNumber(index+1) + '</div></td>';
		contentHtml += '<td colspan="8">';
		contentHtml += '<div align="left"> ' + i.split('-')[1] + '';
		contentHtml += '</div>';
		contentHtml += '</td>';
		contentHtml += '</tr>';

		$.each(v, function (j, qv){
			if(!subtype || subtype > 0 &&  qv.subtype!=subtype){
				return true;
			}

			if(orderType == 1){
                contentHtml += '<tr bgcolor="#FFFFFF">';
                contentHtml += '<td width="4%" align="center">' + (j+1) + '</td>';
                contentHtml += '<td width="18%" align="left">' + qv.itemName + '</td>';
                contentHtml += '<td width="4%" align="center">' + (qv.type == 4 ? "项" : qv.measurementUnit) + '</td>';
                contentHtml += '<td width="3%" align="center">' + (qv.type == 4 ? 1 : qv.num) + '</td>';
                contentHtml += '<td width="5%" align="center">' + qv.dcp + '</td>';
                contentHtml += '<td width="5%" align="center">' + qv.dcpt + '</td>';
                contentHtml += '<td width="62%" align="left">' + (qv.content ? qv.content : "-") + '</td>';
			}else{
                contentHtml += '<tr align="center" bgcolor="#FFFFFF">';
                contentHtml += '<td>' + (_index++) + '</td>';
                contentHtml += '<td align="left">' + qv.itemName + '</td>';
                contentHtml += '<td>项</td>';
                contentHtml += '<td>1</td>';
                contentHtml += '<td align="left">' + (qv.content ? qv.content : "-") + '</td>';
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
	contentHtml += '<td>18、所有工程项目施工结束,甲乙双方清算增减项目交尾款后,甲方到乙方处开发票并补交税金.最终解释权归' + companyfullname + '所有.</td>';
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

function printWorkTable(workType){
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

	var quotationFunctionAreas = quotationUtils.quotationDetail.quotationFunctionAreaItemWs;;

	contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
	contentHtml += '<tbody>';

	$.each(quotationFunctionAreas, function (i, v){
		if( !workType || workType!=i.split('-')[1]){
			return true;
		}
		var itemIndex = 0;
		contentHtml += '<tr bgcolor="#CCCCCC">';
		contentHtml += '<td colspan="1">';
		contentHtml += '<div align="center">' + utils.getBigNumber(index+1) + '</div></td>';
		contentHtml += '<td colspan="8">';
		contentHtml += '<div align="left">' + i.split('-')[1] + '';
		contentHtml += '</div>';
		contentHtml += '</td>';
		contentHtml += '</tr>';

		$.each(v, function (j, qv){

			contentHtml += '<tr bgcolor="#FFFFFF">';
			contentHtml += '<td width="8%" align="center">' + (itemIndex+1) + '</td>';
			contentHtml += '<td width="22%" align="center">' + qv.areaName + '</td>';
			contentHtml += '<td width="30%" align="center">' + qv.itemName+"("+qv.typestr+")" + '</td>';
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

	var addReduceItemtypeDict = {"0" : "普通", "1" : "系统", "2" : "自定义", "3" : "报价中", "4": "增项","5":"扩展项"};
	
	quotationUtils.quotationDetail = {};
	var url = api.quotation.queryQuotationById;
	
	com.post(url, {"quotation.qid": params.quotationId}, function(res){
		quotationUtils.quotationDetail.quotation = res.quotation;
	}, null, false);
	
	com.post(api.decoration.queryDecorationForCommonByOrderId, {"decoration.orderId": params.decorationOrderId}, function(res){
	    quotationUtils.quotationDetail.quotation.decoration = res.decoration;
	}, null, false);
	
	url = api.quotation.queryQuotationFunctionAreaByQuotationId;

	com.post(url, {"quotation.qid": params.quotationId}, function(res){
		quotationUtils.quotationDetail.quotationFunctionAreas = res.quotationFunctionAreas;
	}, null, false);

	url = api.quotation.queryExtensionByOrderId;
	var extensionItemIDs = {};

	com.post(url,{"extension.orderId": params.decorationOrderId}, function (res) {
		var extensions = res.extensions;
		$.each(extensions, function (i, v) {
			extensionItemIDs["extensionItemIDs[" + i + "]"] = v.eid;
		});
	}, null, false);

	com.post(api.quotation.queryExtensionItemByEids, extensionItemIDs, function (res) {
		quotationUtils.quotationDetail.extensions = res.extensionItems;
	}, null, false);

	url = api.addReduce.queryAddReduceByOrderId;
//	url = api.addReduce.queryAddReduceForPayedByOrderId;
	
	var addReduceIds = {};
	var db = 1;
	com.post(url, {'addReduce.orderId': params.decorationOrderId}, function(res){
		$.each(res.addReduces, function(i, v){
			addReduceIds['addReduceIds[' + i + ']'] = v.arId;
		});
	}, null, false);

	com.post(api.addReduce.queryAddReduceItemByAddReduceIds, addReduceIds, function(res){
		quotationUtils.quotationDetail.addReduceItems = res.addReduceItems;
	}, null, false);

    /*com.post(api.decoration.queryDecorationHolonomy, {
        "decorationHolonomy.decoration.orderId": params.decorationOrderId
	}, function(res){
        db = res.decorationHolonomy.discountBase == null || res.decorationHolonomy.discountBase == "" || res.decorationHolonomy.discountBase == undefined ? 1 : res.decorationHolonomy.discountBase;
    }, null, false);*/

	quotationUtils.statisticalQuotationItem(quotationUtils.quotationDetail.quotationFunctionAreas,quotationUtils.quotationDetail.addReduceItems,quotationUtils.quotationDetail.extensions);

	quotationUtils.initQuotationDetailItem(quotationUtils.quotationDetail.quotation,quotationUtils.quotationDetail.quotationFunctionAreas,quotationUtils.quotationDetail.addReduceItems,quotationUtils.quotationDetail.extensions,params.orderType,false);

	quotationUtils.quotationDetail.UndisPrice = quotationUtils.quotationCalculator(quotationUtils.quotationDetail.quotation.discount,quotationUtils.quotationDetail.quotation.basePrice);

	quotationUtils.quotationDetail.TotalPrice = quotationUtils.quotationTotal();

	generatePrintPage(params.type, params.subtype,params.workType, params.company.name, params.company.fullname,params.orderType);

});

function generatePrintPage(type,subtype,workType, company,companyfullname,orderType){
	var html = "";

	if(type == '1'){
		html += printHeader(company + "家装预算(工程)");
		html += printProjectTable();
	}else if(type == '2'){
		html += printHeader(company + "家装预算(财务)");
		html += printFinanceTable();
	}else if(type == '3'){
		html += printHeader(company + "家装项目单");
		html += printCustomerTable(subtype,companyfullname,orderType);
	}else if(type == "4"){
		html += printHeader(company + "工种项目单");
		html += printWorkTable(workType);
	}
	                                                                                                                                                                                                       
	$("#quotationList").html(html);
}



