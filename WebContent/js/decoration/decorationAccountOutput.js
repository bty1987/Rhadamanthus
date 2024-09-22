jQuery(function($) {

    api = parent.api;
    com = parent.com;
    params = parent.params;
    utils = parent.utils;

    var decoration = params.decoration.decoration;
    var accountBasic = params.decoration.accountBasic;
    var orderTypeness = params.decoration.orderTypeness;
    var decorationActivity = "";
    var drawTime = "";

    com.post(api.decoration.queryDecorationActivityByOrderId, {
        "decorationActivity.orderId": decoration.orderId
    }, function(res) {

        if (res.decorationActivitys.length > 0)
            decorationActivity = res.decorationActivitys[0].activity.name;
    }, null, false);

    com.post(api.construction.queryAcceptance, {
        "acceptance.orderId": decoration.orderId
    }, function(res) {

        drawTime = res.acceptance.acceptanceTime;
    }, null, false);

    com.post(api.data.queryTalking, {
        "types[0]": 7
    }, function(v) {

        var talkings = v.talkings;

        if (!talkings || talkings.length == 0)
            return false;

        $.each(talkings, function(i, v) {

            if (!v.content)
                return true;

            var tr = $('<tr></tr>').appendTo($("#talk tbody"));

            if (i == 0) {

                var td_1 = $('<td colspan="1" rowspan="' + talkings.length + '" style="height: 80px;" >备注</td>').appendTo(tr);
            }

            var td_2 = $('<td colspan="7"></td>').html(v.content).appendTo(tr);

        });

    });
    var center = $("<center></center>").appendTo($("#manifestPrint"));

    createTable1(center);
    createTable2(center);
    createTable3(center);
    createTable4(center);

    function createTable1(center) {

        var tableName = $('<div align="center"></div>').appendTo(center);
        var p = $('<p></p>').appendTo(tableName);
        var b = $('<b><font size="5">' + orderTypeness[decoration.typeness] + "更" + orderTypeness[accountBasic.typeness] + "增减" + (accountBasic.cal ? '计' : '不计') + "配比" + '</font></b>').appendTo(p);

        var receiptTable = $('<table style="width: 100%; border-collapse:collapse;"></table>').appendTo(center);
        var receiptTbody = $('<tbody></tbody>').appendTo(receiptTable);

        // 基本信息共同显示内容
        var orderReceiptTr = $('<tr></tr>').appendTo(receiptTbody);
        var signTime = $('<td colspan="1" ></td>').text('签单日期');
        var signTimeText = $('<td colspan="1"></td>').text(decoration.contractTime);
        var activity = $('<td colspan="1"></td>').text('参与活动');
        var activityText = $('<td colspan="1"></td>').text(decorationActivity);
        var supervisor = $('<td colspan="1"></td>').text('监理');
        var supervisorText = $('<td colspan="1"></td>').text(decoration.supervisor.currentName == null ? "暂无" : decoration.supervisor.currentName);
        var buildArea = $('<td colspan="1"></td>').text('面积');
        var buildAreaText = $('<td colspan="1"></td>').text(decoration.house.buildArea);
        orderReceiptTr.append(signTime).append(signTimeText).append(activity).append(activityText).append(supervisor).append(supervisorText).append(buildArea).append(buildAreaText);

        var presonReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var orderId = $('<td colspan="1"></td>').text('装修单号');
        var orderIdText = $('<td colspan="1"></td>').text(decoration.orderId);
        var villageName = $('<td colspan="1"></td>').text('楼盘地址');
        var villageNameText = $('<td colspan="1"></td>').text((decoration.house.village.cityProper.city.name == null ? " " : decoration.house.village.cityProper.city.name) + " " + (decoration.house.village.cityProper == null ? " " : decoration.house.village.cityProper.name) + " " + decoration.house.village.name + " " + (decoration.house.houseNumber == null ? " " : decoration.house.houseNumber));
        var designer = $('<td colspan="1"></td>').text('设计师');
        var designerText = $('<td colspan="1"></td>').text(decoration.designer.currentName);
        var designerDept = $('<td colspan="1"></td>').text('设计部门');
        var designerDeptText = $('<td colspan="1"></td>').text(decoration.designer.dept.name);
        presonReceiptTr.append(orderId).append(orderIdText).append(villageName).append(villageNameText).append(designer).append(designerText).append(designerDept).append(designerDeptText);

        var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var customer = $('<td colspan="1"></td>').text('客户姓名');
        var customerText = $('<td colspan="1"></td>').text(decoration.customer.name);

        if (decoration.type == 1) {

            var nullTd = $('<td colspan="6"></td>');
            receReceiptTr.append(customer).append(customerText).append(nullTd);

        } else {

            var phone = $('<td colspan="1"></td>').text('客户电话');
            var phoneText = $('<td colspan="1"></td>').text(decoration.customer.phone);
            var drawLineTime = $('<td colspan="1"></td>').text('工程验收日期');
            var drawLineTimeText = $('<td colspan="1"></td>').text(drawTime == null ? "暂无" : drawTime);
            var nullTd = $('<td colspan="2"></td>');
            receReceiptTr.append(customer).append(customerText).append(phone).append(phoneText).append(drawLineTime).append(drawLineTimeText).append(nullTd);

        }

    }

    function createTable2(center) {

        var quotationTable = $('<table style="width: 100%; border-collapse:collapse;"></table>').appendTo(center);
        var quotationTbody = $('<tbody></tbody>').appendTo(quotationTable);

        if (decoration.type == 1) {

            var tr31 = $('<tr></tr>').appendTo(quotationTbody);
            var contract = $('<td colspan="12" class="tdHead"></td>').text('合同');
            tr31.append(contract);

            var tr32 = $('<tr></tr>').appendTo(quotationTbody);
            var signFactOwing = $('<td colspan="2"></td>').text('合同款待收');
            var signFactOwingText = $('<td colspan="2"></td>').text(accountBasic.signFactOwing);
            var addOwing = $('<td colspan="2"></td>').text('增项待收');
            var addOwingText = $('<td colspan="2"></td>').text(accountBasic.addOwing);
            var reduceOwing = $('<td colspan="2"></td>').text('减项待退');
            var reduceOwingText = $('<td colspan="2"></td>').text(accountBasic.reduceOwing);
            tr32.append(signFactOwing).append(signFactOwingText).append(addOwing).append(addOwingText).append(reduceOwing).append(reduceOwingText);

            var tr33 = $('<tr></tr>').appendTo(quotationTbody);
            var advance = $('<td colspan="12" class="tdHead"></td>').text('预付款');
            tr33.append(advance);

            var tr34 = $('<tr></tr>').appendTo(quotationTbody);
            var contractAdvance = $('<td colspan="3"></td>').text('合同预付款');
            var contractAdvanceText = $('<td colspan="3"></td>').text(accountBasic.contractAdvance);
            var materialAdvance = $('<td colspan="3"></td>').text('主材预付款');
            var materialAdvanceText = $('<td colspan="3"></td>').text(accountBasic.materialAdvance);
            tr34.append(contractAdvance).append(contractAdvanceText).append(materialAdvance).append(materialAdvanceText);

            var tr35 = $('<tr></tr>').appendTo(quotationTbody);
            var account = $('<td colspan="12" class="tdHead"></td>').text('决算');
            tr35.append(account);

            var tr36 = $('<tr></tr>').appendTo(quotationTbody);
            var contractAdvance = $('<td colspan="6"></td>').text('应补款');
            var contractAdvanceText = $('<td colspan="6"></td>').text(accountBasic.fullPayment);
            tr36.append(contractAdvance).append(contractAdvance).append(contractAdvanceText);

        } else {
            var tr1 = $('<tr></tr>').appendTo(quotationTbody);
            var quotation = $('<td colspan="12" class="tdHead"></td>').text('基础报价');
            tr1.append(quotation);

            var tr2 = $('<tr></tr>').appendTo(quotationTbody);
            var foldFrontTotal = $('<td colspan="3"></td>').text('折前总价');
            var foldFrontFee = $('<td colspan="2"></td>').text('折前直接费');
            var managePrice = $('<td colspan="2"></td>').text('管理费');
            var taxPrice = $('<td colspan="2"></td>').text('税金');
            var basdiscount = $('<td colspan="3"></td>').text('折扣');
            tr2.append(foldFrontTotal).append(foldFrontFee).append(managePrice).append(taxPrice).append(basdiscount);

            var tr3 = $('<tr></tr>').appendTo(quotationTbody);
            var foldFrontTotalText = $('<td colspan="3"></td>').text(accountBasic.foldFrontTotal);
            var foldFrontFeeText = $('<td colspan="2"></td>').text(accountBasic.foldFrontFee);
            var managePriceText = $('<td colspan="2"></td>').text(accountBasic.managePredisPrice);
            var taxPriceText = $('<td colspan="2"></td>').text(accountBasic.taxPredisPrice);
            var basdiscountText = $('<td colspan="3"></td>').text(accountBasic.discount);
            tr3.append(foldFrontTotalText).append(foldFrontFeeText).append(managePriceText).append(taxPriceText).append(basdiscountText);

            var tr4 = $('<tr></tr>').appendTo(quotationTbody);
            var contract = $('<td colspan="12" class="tdHead"></td>').text('合同');
            tr4.append(contract);

            var tr5 = $('<tr></tr>').appendTo(quotationTbody);
            var signPrice = $('<td colspan="2"></td>').text('合同额');
            var coupon = $('<td colspan="2"></td>').text('优惠券');
            var servicePrice = $('<td colspan="2"></td>').text('服务费');
            var servicePaidup = $('<td colspan="2"></td>').text('已收服务费');
            var signFactPrice = $('<td colspan="2"></td>').text('合同实收');
            var material = $('<td colspan="2"></td>').text('主材配比');
            tr5.append(signPrice).append(coupon).append(servicePrice).append(servicePaidup).append(signFactPrice).append(material);

            var tr6 = $('<tr></tr>').appendTo(quotationTbody);
            var signPriceText = $('<td colspan="2"></td>').text(accountBasic.signPrice);
            var couponText = $('<td colspan="2"></td>').text(accountBasic.coupon);
            var servicePriceText = $('<td colspan="2"></td>').text(accountBasic.servicePrice);
            var servicePaidupText = $('<td colspan="2"></td>').text(accountBasic.servicePaidup);
            var signFactPriceText = $('<td colspan="2"></td>').text(accountBasic.signFactPrice);
            var materialText = $('<td colspan="2"></td>').text(accountBasic.material);
            tr6.append(signPriceText).append(couponText).append(servicePriceText).append(servicePaidupText).append(signFactPriceText).append(materialText);

            var tr7 = $('<tr></tr>').appendTo(quotationTbody);
            var materials = $('<td colspan="12" class="tdHead"></td>').text('主材');
            tr7.append(materials);

            var tr8 = $('<tr></tr>').appendTo(quotationTbody);
            var materialRatio = $('<td colspan="3"></td>').text('配比总额');
            var materialTotal = $('<td colspan="3"></td>').text('总金额');
            var materialCoupon = $('<td colspan="3"></td>').text('优惠券');
            var materialFactPrice = $('<td colspan="3"></td>').text('实收额');
            tr8.append(materialRatio).append(materialTotal).append(materialCoupon).append(materialFactPrice);

            var tr9 = $('<tr></tr>').appendTo(quotationTbody);
            var materialRatioText = $('<td colspan="3"></td>').text(accountBasic.materialRatio);
            var materialTotalText = $('<td colspan="3"></td>').text(accountBasic.materialTotal);
            var materialCouponText = $('<td colspan="3"></td>').text(accountBasic.materialCoupon);
            var materialFactPriceText = $('<td colspan="3"></td>').text(accountBasic.materialFactPrice);
            tr9.append(materialRatioText).append(materialTotalText).append(materialCouponText).append(materialFactPriceText);

            if (accountBasic.oalesOutput) {
                var tr39 = $('<tr></tr>').appendTo(quotationTbody);
                var oales = $('<td colspan="12" class="tdHead"></td>').text('外销');
                tr39.append(oales);

                var tr40 = $('<tr></tr>').appendTo(quotationTbody);
                var oalesTotal = $('<td colspan="3"></td>').text('外销总金额');
                var oalesTotalText = $('<td colspan="3"></td>').text(accountBasic.oalesTotal);
                var oalesMaterialTotal = $('<td colspan="3"></td>').text('外销主材总额');
                var oalesMaterialTotalText = $('<td colspan="3"></td>').text(utils.accAdd(accountBasic.oalesTotal, accountBasic.materialTotal));
                tr40.append(oalesTotal).append(oalesTotalText).append(oalesMaterialTotal).append(oalesMaterialTotalText);
            }

            var tr10 = $('<tr></tr>').appendTo(quotationTbody);
            var addReduce = $('<td colspan="12" class="tdHead"></td>').text('增减');
            tr10.append(addReduce);

            var tr11 = $('<tr></tr>').appendTo(quotationTbody);
            var addDone = $('<td colspan="3"></td>').text('增项已收');
            var addDoneText = $('<td colspan="3"></td>').text(accountBasic.addDone);
            var minusDone = $('<td colspan="3"></td>').text('减项已退（折后价）');
            var minusDoneText = $('<td colspan="3"></td>').text(accountBasic.reduceDone);
            tr11.append(addDone).append(addDoneText).append(minusDone).append(minusDoneText);

            var tr12 = $('<tr></tr>').appendTo(quotationTbody);
            var advance = $('<td colspan="12" class="tdHead"></td>').text('预付款');
            tr12.append(advance);

            var tr13 = $('<tr></tr>').appendTo(quotationTbody);
            var contractAdvance = $('<td colspan="3"></td>').text('合同预付款');
            var contractAdvanceText = $('<td colspan="3"></td>').text(accountBasic.contractAdvance);
            var materialAdvance = $('<td colspan="3"></td>').text('主材预付款');
            var materialAdvanceText = $('<td colspan="3"></td>').text(accountBasic.materialAdvance);
            tr13.append(contractAdvance).append(contractAdvanceText).append(materialAdvance).append(materialAdvanceText);

            var tr14 = $('<tr></tr>').appendTo(quotationTbody);
            var account = $('<td colspan="12" class="tdHead"></td>').text('决算');
            tr14.append(account);

            var tr15 = $('<tr></tr>').appendTo(quotationTbody);
            var direct = $('<td colspan="2"></td>').text('决算折前总额（含减项折前价）');
            var beforeTotal = $('<td colspan="2"></td>').text('决算直接费');
            var management = $('<td colspan="2"></td>').text('决算管理费');
            var taxment = $('<td colspan="2"></td>').text('决算税金');
            var flowerRatio = $('<td colspan="2"></td>').text('决算实花配比');
            var flowerOalesRatio = $('<td colspan="2"></td>');
            tr15.append(direct).append(beforeTotal).append(management).append(taxment).append(flowerRatio).append(flowerOalesRatio);

            var tr16 = $('<tr></tr>').appendTo(quotationTbody);
            var directText = $('<td colspan="2"></td>').text(accountBasic.direct ? accountBasic.direct : 0);
            var beforeTotalText = $('<td colspan="2"></td>').text(accountBasic.beforeTotal ? accountBasic.beforeTotal : 0);
            var managementText = $('<td colspan="2"></td>').text(accountBasic.management ? accountBasic.management : 0);
            var taxmentText = $('<td colspan="2"></td>').text(accountBasic.taxment ? accountBasic.taxment : 0);
            var flowerRatioText = $('<td colspan="2"></td>').text(accountBasic.flowerRatio ? accountBasic.flowerRatio : 0);
            var flowerOalesRatioText = $('<td colspan="2"></td>');
            tr16.append(directText).append(beforeTotalText).append(managementText).append(taxmentText).append(flowerRatioText).append(flowerOalesRatioText);

            if (accountBasic.oalesOutput) {
                flowerOalesRatio.text('决算实花配比（含外销）');
                flowerOalesRatioText.text(accountBasic.flowerOalesRatio ? accountBasic.flowerOalesRatio : 0);
            }

            var tr17 = $('<tr></tr>').appendTo(quotationTbody);
            var materialAccount = $('<td colspan="3"></td>').text('决算主材额');
            var accountForehead = $('<td colspan="3"></td>').text('决算合同额');
            var accountServicePrice = $('<td colspan="3"></td>').text('决算服务费');
            var balanceSum = $('<td colspan="3"></td>').text('差额');
            tr17.append(materialAccount).append(accountForehead).append(accountServicePrice).append(balanceSum);

            var tr18 = $('<tr></tr>').appendTo(quotationTbody);
            var materialAccountText = $('<td colspan="3"></td>').text(accountBasic.materialAccount ? accountBasic.materialAccount : 0);
            var accountForeheadText = $('<td colspan="3"></td>').text(accountBasic.accountForehead ? accountBasic.accountForehead : 0);
            var accountServicePriceText = $('<td colspan="3"></td>').text(accountBasic.accountServicePrice ? accountBasic.accountServicePrice : 0);
            var balanceSumText = $('<td colspan="3"></td>').text(accountBasic.balanceSum ? accountBasic.balanceSum : 0);
            tr18.append(materialAccountText).append(accountForeheadText).append(accountServicePriceText).append(balanceSumText);

            var tr19 = $('<tr></tr>').appendTo(quotationTbody);
            var accountType = $('<td colspan="3"></td>').text('决算类型');
            var accountTypeText = $('<td colspan="3"></td>').text(orderTypeness[accountBasic.typeness]);
            var matching = $('<td colspan="3"></td>').text('增减是否计入配比');
            var matchingText = $('<td colspan="3"></td>').text(accountBasic.cal ? '是' : '否');
            tr19.append(accountType).append(accountTypeText).append(matching).append(matchingText);

            var tr20 = $('<tr></tr>').appendTo(quotationTbody);
            var preferential = $('<td colspan="12" class="tdHead"></td>').text('优惠');
            tr20.append(preferential);

            var tr21 = $('<tr></tr>').appendTo(quotationTbody);
            var preferences = $('<td colspan="2"></td>').text('优惠券');
            var preferencesText = $('<td colspan="2"></td>').text(accountBasic.preferences);
            var fulldel = $('<td colspan="2"></td>').text('满减');
            var fulldelText = $('<td colspan="2"></td>').text(accountBasic.fulldel);
            var cashback = $('<td colspan="2"></td>').text('返现');
            var cashbackText = $('<td colspan="2"></td>').text(accountBasic.cashback);
            tr21.append(preferences).append(preferencesText).append(fulldel).append(fulldelText).append(cashback).append(cashbackText);

        }
    }

    function createTable3(center) {

        var companyTable = $('<table style="width: 100%; border-collapse:collapse;" id="talk"></table>').appendTo(center);
        var companyTbody = $('<tbody></tbody>').appendTo(companyTable);

        var tr22 = $('<tr></tr>').appendTo(companyTbody);
        var companyProvince = $('<td colspan="1" style="width: 15%;"></td>').text('开户行省份');
        var companyProvinceText = $('<td colspan="7"></td>');
        tr22.append(companyProvince).append(companyProvinceText);

        var tr23 = $('<tr></tr>').appendTo(companyTbody);
        var companyCity = $('<td colspan="1"></td>').text('开户行城市');
        var companyCityText = $('<td colspan="7"></td>');
        tr23.append(companyCity).append(companyCityText);

        var tr24 = $('<tr></tr>').appendTo(companyTbody);
        var companyBank = $('<td colspan="1"></td>').text('开户行网点');
        var companyBankText = $('<td colspan="7"></td>').text(decoration.customer.companyBank == null ? " " : decoration.customer.companyBank);
        tr24.append(companyBank).append(companyBankText);

        var tr25 = $('<tr></tr>').appendTo(companyTbody);
        var companyName = $('<td colspan="1"></td>').text('持卡人姓名');
        var companyNameText = $('<td colspan="7"></td>').text(decoration.customer.name);
        tr25.append(companyName).append(companyNameText);

        var tr26 = $('<tr></tr>').appendTo(companyTbody);
        var companyPhone = $('<td colspan="1"></td>').text('持卡人电话');
        var companyPhoneText = $('<td colspan="7"></td>');
        tr26.append(companyPhone).append(companyPhoneText);

        var tr27 = $('<tr></tr>').appendTo(companyTbody);
        var companyBankno = $('<td colspan="1"></td>').text('银行卡号');
        var companyBanknoText = $('<td colspan="7"></td>').text(decoration.customer.companyBankno == null ? " " : decoration.customer.companyBankno);
        tr27.append(companyBankno).append(companyBanknoText);
    }

    function createTable4(center) {

        var signTable = $('<table style="width: 100%; border-collapse:collapse;"></table>').appendTo(center);
        var signTbody = $('<tbody></tbody>').appendTo(signTable);

        if (decoration.type == 1) {
            var tr37 = $('<tr></tr>').appendTo(signTbody);
            var designerSign = $('<td colspan="1" style="width: 15%;"></td>').text('设计师签字');
            var designerSignText = $('<td colspan="3"></td>');
            var designerSignTextDate = $('<td colspan="1" style="width: 15%;"></td>').text('日期');
            var designerSignTextDateText = $('<td colspan="3"></td>');
            var companySign = $('<td colspan="1" rowspan="2" style="width: 15%;"></td>').text('客户签字');
            var companySignDateText = $('<td colspan="3" rowspan="2"></td>');
            tr37.append(designerSign).append(designerSignText).append(designerSignTextDate).append(designerSignTextDateText).append(companySign).append(companySignDateText);

            var tr38 = $('<tr></tr>').appendTo(signTbody);
            var managerSign = $('<td colspan="1" style="width: 15%;"></td>').text('设计部经理签字');
            var managerSignText = $('<td colspan="3"></td>');
            var managerSignDate = $('<td colspan="1" style="width: 15%;"></td>').text('日期');
            var managerSignDateText = $('<td colspan="3"></td>');
            tr38.append(managerSign).append(managerSignText).append(managerSignDate).append(managerSignDateText);

        } else {
            var tr28 = $('<tr></tr>').appendTo(signTbody);
            var housekeepSign = $('<td colspan="1" style="width: 15%;"></td>').text('主材管家签字');
            var housekeepSignText = $('<td colspan="3"></td>');
            var housekeepSignDate = $('<td colspan="1" style="width: 15%;"></td>').text('日期');
            var housekeepSignDateText = $('<td colspan="3"></td>');
            tr28.append(housekeepSign).append(housekeepSignText).append(housekeepSignDate).append(housekeepSignDateText);

            var tr29 = $('<tr></tr>').appendTo(signTbody);
            var designerSign = $('<td colspan="1" style="width: 15%;"></td>').text('设计师签字');
            var designerSignText = $('<td colspan="3"></td>');
            var managerSign = $('<td colspan="1" style="width: 15%;"></td>').text('设计经理签字');
            var managerSignText = $('<td colspan="3"></td>');
            tr29.append(designerSign).append(designerSignText).append(managerSign).append(managerSignText);

            var tr30 = $('<tr></tr>').appendTo(signTbody);
            var companySign = $('<td colspan="1" style="width: 15%;"></td>').text('客户签字');
            var companySignText = $('<td colspan="3"></td>');
            var companySignDate = $('<td colspan="1" style="width: 15%;"></td>').text('日期');
            var companySignDateText = $('<td colspan="3"></td>');
            tr30.append(companySign).append(companySignText).append(companySignDate).append(companySignDateText);
        }

    }

});
