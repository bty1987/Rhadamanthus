jQuery(function($) {

    api = parent.api;
    com = parent.com;
    params = parent.params;

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

    $("#titleText").text(orderTypeness[decoration.typeness] + "更" + orderTypeness[accountBasic.typeness] + "增减" + (accountBasic.cal ? '计' : '不计') + "配比");
    $("#contractTime").text(decoration.contractTime);
    $("#decorationActivity").text(decorationActivity);
    $("#supervisor").text(decoration.supervisor.currentName == null ? "暂无" : decoration.supervisor.currentName);
    $("#buildArea").text(decoration.house.buildArea);

    $("#orderId").text(decoration.orderId);
    $("#orderAddr").text((decoration.house.village.cityProper.city.name == null ? " " : decoration.house.village.cityProper.city.name) + " " + (decoration.house.village.cityProper == null ? " " : decoration.house.village.cityProper.name) + " " + decoration.house.village.name + " " + (decoration.house.houseNumber == null ? " " : decoration.house.houseNumber));
    $("#designDept").text(decoration.designer.dept.name);
    $("#drawTime").text(drawTime == null ? "暂无" : drawTime);

    $("#customerName").text(decoration.customer.name);
    $("#customerPhone").text(decoration.customer.phone);
    $("#designer").text(decoration.designer.currentName);

    $("#foldFrontTotal").text(accountBasic.foldFrontTotal);
    $("#foldFrontFee").text(accountBasic.foldFrontFee);
    $("#managePrice").text(accountBasic.managePredisPrice);
    $("#taxPrice").text(accountBasic.taxPredisPrice);
    $("#basdiscount").text(accountBasic.discount);

    $("#signPrice").text(accountBasic.signPrice);
    $("#coupon").text(accountBasic.coupon);
    $("#servicePrice").text(accountBasic.servicePrice);
    $("#servicePaidup").text(accountBasic.servicePaidup);
    $("#signFactPrice").text(accountBasic.signFactPrice);
    $("#material").text(accountBasic.material);

    $("#materialRatio").text(accountBasic.materialRatio);
    $("#materialTotal").text(accountBasic.materialTotal);
    $("#materialCoupon").text(accountBasic.materialCoupon);
    $("#materialFactPrice").text(accountBasic.materialFactPrice);

    $("#addDone").text(accountBasic.addTotalPrice);
    $("#minusDone").text(accountBasic.reduceTotalPrice);

    $("#contractAdvance").text(accountBasic.contractAdvance);
    $("#materialAdvance").text(accountBasic.materialAdvance);

    $("#direct").text(accountBasic.direct);
    $("#beforeTotal").text(accountBasic.beforeTotal);
    $("#management").text(accountBasic.management);
    $("#taxment").text(accountBasic.taxment);
    $("#flowerRatio").text(accountBasic.flowerRatio);
    $("#materialAccount").text(accountBasic.materialAccount);
    $("#accountForehead").text(accountBasic.accountForehead);
    $("#accountServicePrice").text(accountBasic.accountServicePrice);
    $("#balanceSum").text(accountBasic.balanceSum);

    $("#accountType").text(orderTypeness[accountBasic.typeness]);
    $("#matching").text(accountBasic.cal ? '是' : '否');

    $("#preferences").text(accountBasic.preferences);
    $("#fulldel").text(accountBasic.fulldel);
    $("#cashback").text(accountBasic.cashback);

    $("#companyBank").text(decoration.customer.companyBank == null ? " " : decoration.customer.companyBank);
    $("#companyName").text(decoration.customer.name);
    $("#companyBankno").text(decoration.customer.companyBankno == null ? " " : decoration.customer.companyBankno);

});
