jQuery(function($) {

    api = parent.api;
    com = parent.com;
    params = parent.params;
    
    var decoration = params.decoration;
    var accountBasic = params.accountBasic;
    
    var decorationActivity = "";
    var drawTime = "";
    
    com.post(api.decoration.queryDecorationActivityByOrderId, {"decorationActivity.orderId" : params.decorationOrderId}, function (res) {
        if(res.decorationActivitys.length > 0) decorationActivity = res.decorationActivitys[0].activity.name;
    }, null, false);

    com.post(api.construction.queryAcceptance, {"acceptance.orderId": params.decorationOrderId}, function (res) {
        drawTime = res.acceptance.acceptanceTime;
    }, null, false);
    
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
    $("#managePrice").text(accountBasic.managePrice);
    $("#basdiscount").text(accountBasic.basdiscount);
    
    $("#signPrice").text(accountBasic.signPrice);
    $("#coupon").text(accountBasic.coupon);
    $("#servicePrice").text(accountBasic.servicePrice);
    $("#servicePaidup").text(accountBasic.servicePaidup);
    $("#signFactPrice").text(accountBasic.signFactPrice);
    $("#mm").text(accountBasic.mm);
    
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
    $("#flowerRatio").text(accountBasic.flowerRatio);
    $("#materialAccount").text(accountBasic.materialAccount);
    $("#accountForehead").text(accountBasic.accountForehead);
    $("#accountServicePrice").text(accountBasic.accountServicePrice);
    $("#balanceSum").text(accountBasic.balanceSum);
    
    $("#accountType").text(accountBasic.n);
    $("#matching").text(accountBasic.cal ? '是' : '否');
    
    $("#preferences").text(accountBasic.preferences);
    $("#fulldel").text(accountBasic.fulldel);
    $("#cashback").text(accountBasic.cashback);
    
});
