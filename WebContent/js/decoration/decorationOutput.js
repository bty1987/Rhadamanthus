jQuery(function($) {

    var decoration = parent.params.decoration;
    api = parent.api;
    com = parent.com;
    params = parent.params;
    var decorationActivity = {};
    com.post(api.decoration.queryDecorationActivityByOrderId, {"decorationActivity.orderId" : params.decorationOrderId}, function (res) {
        var decorationActivityData = res.decorationActivitys;

        $.each(decorationActivityData, function (i, v) {
            decorationActivity['name'] = v.activity.name
        });

    }, null, false);

    com.post(api.construction.queryAcceptance, {"acceptance.orderId": params.decorationOrderId}, function (res) {
        createTable(decorationActivity.name, res.acceptance.acceptanceTime)
    }, null, false);
    
    function createTable(activityName, drawTime) {
        var center = $("<center></center>").appendTo($("#manifestPrint"));

        var tableName = $('<div align="center"></div>').appendTo(center);
        var p = $('<p></p>').appendTo(tableName);
        var b = $('<b><font size="5">决算打印</font></b>').appendTo(p);

        var receiptTable = $('<table border="1" style="width: 100%; border-collapse:collapse;" cellpadding="0" cellspacing="0"></table>').appendTo(center);

        var orderReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var signTime = $('<td colspan="1" style="height: 30px;padding-left: 10px;"></td>').text('签单日期');
        var signTimeText = $('<td colspan="1" style="padding-left: 10px;"></td>').text(decoration.contractTime);
        var activity = $('<td colspan="1" style="padding-left: 10px;"></td>').text('参与活动');
        var activityText = $('<td colspan="1" style="padding-left: 10px;"></td>').text(activityName);
        var supervisor = $('<td colspan="1" style="padding-left: 10px;"></td>').text('监理');
        var supervisorText = $('<td colspan="1" style="padding-left: 10px;"></td>').text(decoration.supervisor.currentName == null ? "暂无" : decoration.supervisor.currentName);
        var buildArea = $('<td colspan="1" style="padding-left: 10px;"></td>').text('面积');
        var buildAreaText = $('<td colspan="1" style="padding-left: 10px;"></td>').text(decoration.house.buildArea);
        orderReceiptTr.append(signTime).append(signTimeText).append(activity).append(activityText).append(supervisor).append(supervisorText).append(buildArea).append(buildAreaText);

        var presonReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var orderId = $('<td colspan="1" style="height: 30px;padding-left: 10px;"></td>').text('装修单号');
        var orderIdText = $('<td colspan="1" style="padding-left: 10px;"></td>').text(decoration.orderId);
        var villageName = $('<td colspan="1" style="padding-left: 10px;"></td>').text('楼盘地址');
        var villageNameText = $('<td colspan="1" style="padding-left: 10px;"></td>').text((decoration.house.village.cityProper.city.name == null ? " " : decoration.house.village.cityProper.city.name) + " " + (decoration.house.village.cityProper == null ? " " : decoration.house.village.cityProper.name) + " " + decoration.house.village.name + " " + (decoration.house.houseNumber == null ? " " : decoration.house.houseNumber));
        var designerDept = $('<td colspan="1" style="padding-left: 10px;"></td>').text('设计部门');
        var designerDeptText = $('<td colspan="1" style="padding-left: 10px;"></td>').text(decoration.designer.dept.name);
        var drawLineTime = $('<td colspan="1" style="padding-left: 10px;"></td>').text('工程验收日期');
        var drawLineTimeText = $('<td colspan="1" style="padding-left: 10px;"></td>').text(drawTime == null ? "暂无" : drawTime);
        presonReceiptTr.append(orderId).append(orderIdText).append(villageName).append(villageNameText).append(designerDept).append(designerDeptText).append(drawLineTime).append(drawLineTimeText);

        var receReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var customer = $('<td colspan="1" style="height: 30px;padding-left: 10px;"></td>').text('客户姓名');
        var customerText = $('<td colspan="1" style="padding-left: 10px;"></td>').text(decoration.customer.name);
        var phone = $('<td colspan="1" style="padding-left: 10px;"></td>').text('客户电话');
        var phoneText = $('<td colspan="1" style="padding-left: 10px;"></td>').text(decoration.customer.phone);
        var designer = $('<td colspan="1" style="padding-left: 10px;"></td>').text('设计师');
        var designerText = $('<td colspan="5" style="padding-left: 10px;"></td>').text(decoration.designer.currentName);
        receReceiptTr.append(customer).append(customerText).append(phone).append(phoneText).append(designer).append(designerText);

        var ReceiptTr = $('<tr></tr>').appendTo(receiptTable);
        var accountForehead = $('<td colspan="1" style="height: 30px;padding-left: 10px;"></td>').text('决算合同额');
        var accountForeheadText = $('<td colspan="10" style="height: 30px;padding-left: 10px;"></td>').text(params.accountForehead);
        ReceiptTr.append(accountForehead).append(accountForeheadText);

        var sub = $('<tr></tr>').appendTo(receiptTable);
        var balanceSum = $('<td colspan="1" style="height: 30px;padding-left: 10px;"></td>').text('决算差额');
        var balanceSumText = $('<td colspan="10" style="height: 30px;padding-left: 10px;"></td>').text(params.balanceSum);
        sub.append(balanceSum).append(balanceSumText);

        var remarks = $('<tr></tr>').appendTo(receiptTable);
        var text = $('<td colspan="1" style="height: 80px;padding-left: 10px;"></td>').text('备注');
        var explainOne = $('<td colspan="10"></td>').text('1.该决算需在工程总验收后，并且主材确认无退货');
        var explainTwo = $('<span></span>').text('2.若决算差额低于10元，则以0元进行处理');
        remarks.append(text).append(explainOne.append($('<hr/>')).append(explainTwo));
    }


});
