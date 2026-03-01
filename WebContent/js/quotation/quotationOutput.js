function printHeader(headStr) {

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

function printProjectTable(subtype, showType) {

    var index = 0;
    var contentHtml = '';

    var preDiscountPrice = 0.0;

    contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
    contentHtml += '<tbody><tr bgcolor="#FFFFFF">';
    contentHtml += '<td width="4%" align="center">序号</td>';
    contentHtml += '<td width="7%" align="center">编号</td>';
    contentHtml += '<td width="18%" align="center">项目名称</td>';
    contentHtml += '<td width="5%" align="center">单位</td>';
    contentHtml += '<td width="5%" align="center">数量</td>';
    contentHtml += '<td width="5%" align="center">单价</td>';
    contentHtml += '<td width="5%" align="center">合价</td>';
    contentHtml += '<td width="45%" align="center">工艺做法及材料说明</td>';
    contentHtml += '</tr>';

    var quotationFunctionAreas = quotationUtils.quotationDetail.quotationFunctionAreaItemCs;

    var offset = quotationUtils.quotationDetail.quotation.decoration.version.offset;

    $.each(quotationFunctionAreas, function(i, v) {

        contentHtml += '<tr bgcolor="#CCCCCC">';
        contentHtml += '<td colspan="1">';
        contentHtml += '<div align="center">' + utils.getBigNumber(index + 1) + '</div></td>';
        contentHtml += '<td colspan="9">';
        contentHtml += '<div align="left">' + i.split('-')[1] + '';
        contentHtml += '</div>';
        contentHtml += '</td>';
        contentHtml += '</tr>';

        $.each(v, function(j, qv) {

            if (subtype.indexOf(qv.subtype) == -1 && qv.subtype != null)
                return true;

            if (!showType.showStandardPrice && [0, 4, 5].indexOf(qv.type) != -1) {
                qv.total = utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice));
                qv.price = qv.unitPrice;
            }

            var no = offset == 0 || [0, 4, 5].indexOf(qv.type) == -1 ? "-" : "QI_" + (Array(5).join('0') + (qv.quotationItemId - offset)).slice(-5);

            contentHtml += '<tr bgcolor="#FFFFFF">';
            contentHtml += '<td width="4%" align="center">' + (j + 1) + '</td>';
            contentHtml += '<td width="7%" align="center">' + no + '</td>';
            contentHtml += '<td width="18%" align="left">' + qv.itemName + "(" + qv.typestr + ")" + '</td>';
            contentHtml += '<td width="5%" align="center">' + qv.measurementUnit + '</td>';
            contentHtml += '<td width="5%" align="center">' + qv.num + '</td>';
            contentHtml += '<td width="5%" align="center">' + qv.price + '</td>';
            contentHtml += '<td width="5%" align="center"> ' + qv.total + '</td>';
            contentHtml += '<td width="45%" align="left">' + (qv.content ? qv.content : '-') + '</td>';
            contentHtml += '</tr>';

            preDiscountPrice = preDiscountPrice + qv.total;
        });

        index++;
    });

    if (showType.showStandardPrice) {
        preDiscountPrice = quotationUtils.quotationDetail.TotalPrice;
    } else {
        preDiscountPrice = utils.changeThrDecimal(preDiscountPrice);
    }

    contentHtml += '<tr bgcolor="#FFFFFF">';
    contentHtml += '<td colspan="12" align="left">工程总价:' + preDiscountPrice + '元</td>';
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
    contentHtml += '<!-- <td width="8%"><strong>折后单价</strong></td> -->';
    contentHtml += '<!-- <td width="10%"><strong>折后金额(元)</strong></td> -->';
    contentHtml += '</tr>';

    var discountPrice = 0.0;
    var preDiscountPrice = 0.0;

    var quotationFunctionAreas = quotationUtils.quotationDetail.quotationFunctionAreaItemCs;

    $.each(quotationFunctionAreas, function(i, v) {

        var sum = 0.0;
        var preSum = 0.0;

        contentHtml += '<tr bgcolor="#CCCCCC">';
        contentHtml += '<td><div align="center">' + utils.getBigNumber(index + 1) + '</div></td>';
        contentHtml += '<td colspan="8">';
        contentHtml += '<div align="left"> ' + i.split('-')[1] + '</div>';
        contentHtml += '</td>';
        contentHtml += '</tr>';

        $.each(v, function(j, qv) {

            if (!showType.showStandardPrice && [0, 4, 5].indexOf(qv.type) != -1) {
                qv.total = utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice));
            }

            if (subtype.indexOf(-2) != -1 || subtype.indexOf(qv.subtype) != -1 || qv.subtype == null) {

                contentHtml += '<tr align="center" bgcolor="#FFFFFF">';
                contentHtml += '<td>' + (j + 1) + '</td> ';
                contentHtml += '<td>' + qv.itemName + "(" + qv.typestr + ")" + '</td>';
                contentHtml += '<td>' + qv.measurementUnit + '</td>';
                contentHtml += '<td>' + qv.num + '</td>';
                contentHtml += '<td>' + qv.unitPrice + '</td>';
                contentHtml += '<td>' + qv.unitPrice + '</td>';
                contentHtml += '<td>' + qv._discountNum + '</td>';
                contentHtml += '<!-- <td>' + qv.unitPrice + '</td> -->';
                contentHtml += '<!-- <td>' + qv.total + '</td> -->';
                contentHtml += '</tr>';

                sum = qv.extensionAtttype && qv.extensionAtttype == constant.quotation().extension.ATTTYPE_ACTIVITY_INT ? sum : sum + qv.total;
                preSum = qv.extensionAtttype && qv.extensionAtttype == constant.quotation().extension.ATTTYPE_ACTIVITY_INT ? preSum : preSum + qv.total;

                if (qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT) {
                    preSum = utils.changeThrDecimal(preSum);
                    sum = utils.changeThrDecimal(sum);
                } else {
                    preSum = utils.changeTwoDecimal(preSum);
                    sum = utils.changeTwoDecimal(sum);
                }

                discountPrice = discountPrice + qv.total;
                preDiscountPrice = preDiscountPrice + qv.total;
            }

        });

        contentHtml += '<tr align="center" bgcolor="#FFFFFF">';
        contentHtml += '<td>&nbsp;</td>';
        contentHtml += '<td><span class="STYLE1">&lt;' + i.split('-')[1] + '&gt;小计</span></td>';
        contentHtml += '<td>&nbsp;</td>';
        contentHtml += '<td>&nbsp;</td>';
        contentHtml += '<td>&nbsp;</td>';
        contentHtml += '<td><span class="STYLE2"><strong>' + preSum + '</strong></span></td>';
        contentHtml += '<td>&nbsp;</td>';
        contentHtml += '<td>&nbsp;</td>';
        contentHtml += '<td><span class="STYLE2"><strong>' + sum + '</strong></span></td>';
        contentHtml += '</tr>';
        contentHtml += '';
        index++;
    });

    if (showType.showStandardPrice) {
        discountPrice = quotationUtils.quotationDetail.UndisPrice;
        preDiscountPrice = quotationUtils.quotationDetail.TotalPrice;
    } else {
        discountPrice = utils.changeThrDecimal(discountPrice);
        preDiscountPrice = utils.changeThrDecimal(preDiscountPrice);
    }

    contentHtml += '<tr bgcolor="#FFFFFF">';
    contentHtml += '<td colspan="9" align="left"><strong>总 计&nbsp;&nbsp;&nbsp;&nbsp;折前:' + preDiscountPrice + '&nbsp;&nbsp;&nbsp;&nbsp;折后:' + discountPrice + '</strong></td>';
    contentHtml += '</tr>';
    contentHtml += '</tbody>';
    contentHtml += '</table>';

    return contentHtml;
}

function printCostTable(subtype, showType) {

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

    var quotationFunctionAreas = quotationUtils.quotationDetail.quotationFunctionAreaItemCs;

    $.each(quotationFunctionAreas, function(i, v) {

        var sum = 0.0;
        var preSum = 0.0;

        contentHtml += '<tr bgcolor="#CCCCCC">';
        contentHtml += '<td><div align="center">' + utils.getBigNumber(index + 1) + '</div></td>';
        contentHtml += '<td colspan="8">';
        contentHtml += '<div align="left"> ' + i.split('-')[1] + '</div>';
        contentHtml += '</td>';
        contentHtml += '</tr>';

        $.each(v, function(j, qv) {

            if (subtype.indexOf(-2) != -1 || subtype.indexOf(qv.subtype) != -1 || qv.subtype == null) {

                contentHtml += '<tr align="center" bgcolor="#FFFFFF">';
                contentHtml += '<td>' + (j + 1) + '</td> ';
                contentHtml += '<td>' + qv.itemName + "(" + qv.typestr + ")" + '</td>';
                contentHtml += '<td>' + qv.measurementUnit + '</td>';
                contentHtml += '<td>' + qv.num + '</td>';
                contentHtml += '<td>' + qv.unitPrice + '</td>';
                contentHtml += '<td>' + qv.dcpt + '</td>';
                contentHtml += '<td>' + qv._discountNum + '</td>';
                contentHtml += '<td>' + qv.unitPrice + '</td>';
                contentHtml += '<td>' + qv.dcpt + '</td>';
                contentHtml += '</tr>';

                sum = sum + qv.quotationTotalPrice;
                preSum = preSum + qv.dcpt;

                if (qv.type == constant.quotation().quotationFunctionAreaItem.TYPE_CMPREH_INT) {
                    preSum = utils.changeThrDecimal(preSum);
                    sum = utils.changeThrDecimal(sum);
                } else {
                    preSum = utils.changeTwoDecimal(preSum);
                    sum = utils.changeTwoDecimal(sum);
                }

                discountPrice = discountPrice + qv.dcpt;
                preDiscountPrice = preDiscountPrice + qv.dcpt;
            }

        });

        contentHtml += '<tr align="center" bgcolor="#FFFFFF">';
        contentHtml += '<td>&nbsp;</td>';
        contentHtml += '<td><span class="STYLE1">&lt;' + i.split('-')[1] + '&gt;小计</span></td>';
        contentHtml += '<td>&nbsp;</td>';
        contentHtml += '<td>&nbsp;</td>';
        contentHtml += '<td>&nbsp;</td>';
        contentHtml += '<td><span class="STYLE2"><strong>' + preSum + '</strong></span></td>';
        contentHtml += '<td>&nbsp;</td>';
        contentHtml += '<td>&nbsp;</td>';
        contentHtml += '<td><span class="STYLE2"><strong>' + sum + '</strong></span></td>';
        contentHtml += '</tr>';
        contentHtml += '';
        index++;
    });

    if (showType.showStandardPrice) {
        discountPrice = quotationUtils.quotationDetail.UndisPrice;
        preDiscountPrice = quotationUtils.quotationDetail.TotalPrice;
    } else {
        discountPrice = utils.changeThrDecimal(discountPrice);
        preDiscountPrice = utils.changeThrDecimal(preDiscountPrice);
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

    var quotationFunctionAreas = quotationUtils.quotationDetail.quotationFunctionAreaItemCs;

    $.each(quotationFunctionAreas, function(i, v) {

        var _index = 1;

        contentHtml += '<tr bgcolor="#CCCCCC">';
        contentHtml += '<td colspan="1">';
        contentHtml += '<div align="center">' + utils.getBigNumber(index + 1) + '</div></td>';
        contentHtml += '<td colspan="8">';
        contentHtml += '<div align="left"> ' + i.split('-')[1] + '';
        contentHtml += '</div>';
        contentHtml += '</td>';
        contentHtml += '</tr>';

        $.each(v, function(j, qv) {

            if (subtype.indexOf(-2) != -1 || subtype.indexOf(qv.subtype) != -1 || qv.subtype == null) {

                if (qv.suptype == 1) {
                    qv.num = 1;
                    qv.measurementUnit = "项";
                    qv.unitPrice = 0;
                    qv.total = 0;
                }

                if (orderType == 1) {
                    contentHtml += '<tr bgcolor="#FFFFFF">';
                    contentHtml += '<td width="4%" align="center">' + (j + 1) + '</td>';
                    contentHtml += '<td width="18%" align="left">' + qv.itemName + '</td>';
                    contentHtml += '<td width="4%" align="center">' + qv.measurementUnit + '</td>';
                    contentHtml += '<td width="3%" align="center">' + qv.num + '</td>';
                    contentHtml += '<td width="5%" align="center">' + qv.unitPrice + '</td>';
                    contentHtml += '<td width="5%" align="center">' + qv.total + '</td>';
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
    contentHtml += '<td width="22%" align="center">工种</td>';
    contentHtml += '<td width="30%" align="center">项目名称</td>';
    contentHtml += '<td width="10%" align="center">单位</td>';
    contentHtml += '<td width="10%" align="center">数量</td>';
    contentHtml += '<td width="10%" align="center">增加量</td>';
    contentHtml += '<td width="10%" align="center">减少量</td>';
    contentHtml += '</tr>';

    var quotationFunctionAreas = quotationUtils.quotationDetail.quotationFunctionAreaItemWs;

    $.each(quotationFunctionAreas, function(i, v) {

        if ((!workType || workType != i.split('-')[1]) && workType != "") {
            return true;
        }

        if (workType == "" && i.split('-')[1] == "其他") {
            return true;
        }

        var itemIndex = 0;

        contentHtml += '<tr bgcolor="#CCCCCC">';
        contentHtml += '<td colspan="1">';
        contentHtml += '<div align="center">' + utils.getBigNumber(index + 1) + '</div></td>';
        contentHtml += '<td colspan="8">';
        contentHtml += '<div align="left">' + i.split('-')[1] + '';
        contentHtml += '</div>';
        contentHtml += '</td>';
        contentHtml += '</tr>';

        $.each(v, function(j, qv) {

            contentHtml += '<tr bgcolor="#FFFFFF">';
            contentHtml += '<td width="8%" align="center">' + (itemIndex + 1) + '</td>';
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

function printNormrice(schedule) {

    var index = 0;
    var contentHtml = '';

    var normtotal = 0;

    contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
    contentHtml += '<tbody><tr bgcolor="#FFFFFF">';
    contentHtml += '<td width="8%" align="center">序号</td>';
    contentHtml += '<td width="12%" align="center">功能区</td>';
    contentHtml += '<td width="20%" align="center">项目名称</td>';
    contentHtml += '<td width="9%" align="center">项目单位</td>';
    contentHtml += '<td width="9%" align="center">工程量</td>';
    contentHtml += '<td width="9%" align="center">单位</td>';
    contentHtml += '<td width="9%" align="center">工费单价</td>';
    contentHtml += '<td width="8%" align="center">定额总额</td>';
    contentHtml += '<td width="8%" align="center">变更量</td>';
    contentHtml += '<td width="8%" align="center">变更总额</td>';
    contentHtml += '</tr>';
    contentHtml += '</tbody></table>';

    var quotationFunctionAreas = quotationUtils.quotationDetail.quotationFunctionAreaItemMs;

    contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
    contentHtml += '<tbody>';

    $.each(quotationFunctionAreas, function(i, v) {

        var itemIndex = 0;

        var cnid = i.split('-')[0];
        var cnname = i.split('-')[1];

        if (cnid != schedule)
            return true;

        contentHtml += '<tr bgcolor="#CCCCCC">';
        contentHtml += '<td colspan="1">';
        contentHtml += '<div align="center">' + utils.getBigNumber(index + 1) + '</div></td>';
        contentHtml += '<td colspan="10">';
        contentHtml += '<div align="left">' + i.split('-')[1] + '';
        contentHtml += '</div>';
        contentHtml += '</td>';
        contentHtml += '</tr>';

        $.each(v, function(j, qv) {

            var num = parseFloat(qv.normrice.trannum == '0' ? 1 : qv.initNum);
            var trannum = parseFloat(qv.normrice.trannum == '0' ? 1 : qv.normrice.trannum);
            var salary = parseFloat(qv.normrice.salary);

            var normrice = utils.accMul(num, utils.accMul(trannum, salary));

            normtotal = utils.accAdd(normtotal, normrice);

            contentHtml += '<tr bgcolor="#FFFFFF">';
            contentHtml += '<td width="8%" align="center">' + (itemIndex + 1) + '</td>';
            contentHtml += '<td width="12%" align="center">' + qv.quotationFunctionAreaName + '</td>';
            contentHtml += '<td width="20%" align="center">' + qv.itemName + '</td>';
            contentHtml += '<td width="9%" align="center">' + qv.measurementUnit + '</td>';
            contentHtml += '<td width="9%" align="center">' + qv.initNum + '</td>';
            contentHtml += '<td width="9%" align="center">' + qv.normrice.unit + '</td>';
            contentHtml += '<td width="9%" align="center">' + salary + '</td>';
            contentHtml += '<td width="8%" align="center">' + normrice + '</td>';
            contentHtml += '<td width="8%" align="center"></td>';
            contentHtml += '<td width="8%" align="left"></td>';
            contentHtml += '</tr>';

            itemIndex++;
        });

        index++;
    });

    contentHtml += '<tr bgcolor="#FFFFFF">';
    contentHtml += '<td height="12" colspan="10" width="8%" align="center"></td>';
    contentHtml += '</tr>';

    contentHtml += '<tr bgcolor="#FFFFFF">';
    contentHtml += '<td colspan="8" width="8%" align="center"></td>';
    contentHtml += '<td width="8%" align="center">定额总额</td>';
    contentHtml += '<td width="8%" align="center">' + utils.changeTwoDecimal(normtotal) + '</td>';
    contentHtml += '</tr>';

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

    api = parent.api;
    config = parent.config;
    server = parent.server;
    utils = parent.utils;
    com = parent.com;
    company = parent.company;
    params = parent.params;
    constant = parent.constant;

    printConf = params.quotation.quotation.printConf;

    // 如果用户没有传入 showType，则使用默认值
    if (!printConf.showType) {
        printConf.showType = {
            "itemtype": printConf.type,
            "showStandardPrice": printConf.calType == 0
        };
    } else if (!printConf.showType.showStandardPrice) {
        // 保留用户传入的 showType.itemtype，但补充 showStandardPrice
        printConf.showType.showStandardPrice = printConf.calType == 0;
    }

    quotationUtils.quotationDetail = {};
    var url = api.quotation.queryQuotationById;

    com.post(url, {
        "quotation.qid": printConf.quotationId
    }, function(res) {

        quotationUtils.quotationDetail.quotation = res.quotation;
    }, null, false);

    com.post(api.decoration.queryDecorationForCommonByOrderId, {
        "decoration.orderId": params.quotation.orderId
    }, function(res) {

        quotationUtils.quotationDetail.quotation.decoration = res.decoration;
    }, null, false);

    com.post(api.quotation.queryQuotationFunctionAreaByQuotationId, {
        "quotation.qid": printConf.quotationId
    }, function(res) {

        quotationUtils.quotationDetail.quotationFunctionAreas = res.quotationFunctionAreas;
    }, null, false);

    quotationUtils.quotationDetail.extensions = [];

    com.post(api.quotation.queryExtensionByOrderId, {
        "extension.orderId": params.quotation.orderId
    }, function(res) {

        quotationUtils.quotationDetail.extensions = res.extensions;
    }, null, false);

    quotationUtils.quotationDetail.addReduces = [];

    com.post(api.addReduce.queryAddReduceByOrderId, {
        'addReduce.orderId': params.quotation.orderId
    }, function(res) {

        quotationUtils.quotationDetail.addReduces = res.addReduces;
    }, null, false);

    com.post(api.quotation.queryQuotationNormrice, {
        "quotation.qid": printConf.quotationId
    }, function(res) {

        quotationUtils.quotationNormriceProcessing(res.quotationFunctionAreas, [], []);
    }, null, false);

    com.post(api.quotation.queryQuotationPrefer, {
        "quotationPrefer.qid": printConf.quotationId,
    }, function(res) {

        quotationUtils.quotationDetail.quotationPrefer = res.quotationPrefer;
    }, null, false);

    quotationUtils.statisticalQuotationItem(quotationUtils.quotationDetail.quotationFunctionAreas, quotationUtils.quotationDetail.addReduces, quotationUtils.quotationDetail.extensions);

    quotationUtils.initQuotationDetailItem(quotationUtils.quotationDetail.quotation, quotationUtils.quotationDetail.quotationFunctionAreas, quotationUtils.quotationDetail.addReduces, quotationUtils.quotationDetail.extensions, quotationUtils.quotationDetail.quotationPrefer, params.quotation.orderType, false, printConf.showType);

    quotationUtils.quotationDetail.UndisPrice = quotationUtils.quotationCalculator(quotationUtils.quotationDetail.quotation.discount, quotationUtils.quotationDetail.quotation.basePrice);

    quotationUtils.quotationDetail.TotalPrice = quotationUtils.quotationTotal();

    generatePrintPage(printConf.layout, printConf.itemtype, printConf.workType, params.company.drganization.name, quotationUtils.quotationDetail.quotation.decoration.type, printConf.showType);

});

function generatePrintPage(type, subtype, workType, company, orderType, showType) {

    var html = "";

    if (type == '1') {
        html += printHeader(company + "家装预算(工程)");
        html += printProjectTable(subtype, showType);
    } else if (type == '2') {
        html += printHeader(company + "家装预算(财务)");
        html += printFinanceTable(subtype, showType);
    } else if (type == '3') {
        html += printHeader(company + "家装项目单");
        html += printCustomerTable(subtype, orderType);
    } else if (type == "4") {
        html += printHeader(company + "工种项目单");
        html += printWorkTable(workType);
    } else if (type == "5") {
        html += printHeader(company + "定额工费项目单");
        html += printNormrice(workType);
    } else if (type == "6") {
        html += printHeader(company + "家装预算(成本)");
        html += printCostTable(subtype, showType);
    }

    $("#quotationList").html(html);
}
