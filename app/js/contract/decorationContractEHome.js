/** app/js/contract/decorationContractEHome.js —— 装饰装修工程交易合同（静态合同正文渲染）
 *  上下文：app.params.decoration = { orderId }（或 URL 查询参数 orderId）。
 *  旧版由缺失的 decorationContract1.js 驱动，此处按 js/contract/default.js 的正文填充逻辑
 *  适配本页 span 结构（houseAddr/totalArea/orderTotalPrice/workingDuration/startMonth/
 *  threePayment/fourPayment 切换 + 公司信息 span）。 */
app.ready(function () {
layui.use(['layer', 'jquery'], function () {
    var layer = layui.layer, $ = layui.jquery;
    contractCommon.ensureApiStubs();
    var ctx = contractCommon.resolveCtx();
    var orderId = ctx.orderId;

    var company = {};
    try {
        if (window.parent && window.parent.app && window.parent.app.params && window.parent.app.params.company) {
            company = window.parent.app.params.company;
        }
    } catch (e) { /* 跨域忽略 */ }
    if (app.params && app.params.company) company = $.extend({}, company, app.params.company);

    $('.companyFullName').text(company.fullname || '');
    $('.companyAddr').text(company.address || '');
    $('.legalPerson').text(company.corporation || '');

    if (!orderId) {
        $('.WordSection1').html('').hide();
        layer.msg('缺少装修单上下文', { icon: 0, time: 2500 });
        return;
    }

    var decoration = null;
    var decorationContract = null;

    app.post(api.decoration.queryDecorationContractByOrderId, { 'decorationContract.orderId': orderId }, function (res) {
        decorationContract = res.decorationContract || {};
    }, null, false);

    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
        decoration = res.decoration || {};
    }, null, false);

    if (!decorationContract || decorationContract.autoId == null) {
        $('.WordSection1').html('').hide();
        layer.msg('没有填写合同信息', { icon: 0, time: 2500 });
        return;
    }

    if (parseFloat(decoration.orderTotalPrice) == 0) {
        $('.WordSection1').html('').hide();
        layer.msg('订单没有总价信息', { icon: 0, time: 2500 });
        return;
    }

    var payments = decorationContract.payments || [];
    var payFlag = false;
    var baseStatus = [0, 1, 2, 3];
    var typeCounts = 0;

    $.each(payments, function (i, v) {
        if (baseStatus.indexOf(v.paymentStatus) != -1) {
            payFlag = true;
        }
        typeCounts += 1;
    });

    if (!payFlag) {
        $('.WordSection1').html('').hide();
        layer.msg('无款项交付', { icon: 0, time: 2500 });
        return;
    }

    $('.WordSection1').css('display', 'block');

    if (decorationContract.startTime != null && decorationContract.startTime != '') {
        var startSplit = decorationContract.startTime.split('-');
        $('#startMonth').html(startSplit[1]);
    }

    $('#workingDuration').html(decorationContract.workingDuration);

    if (typeCounts == 3) {
        $('#threePayment').css('display', 'block');
        $('#fourPayment').css('display', 'none');
    } else if (typeCounts == 4) {
        $('#threePayment').css('display', 'none');
        $('#fourPayment').css('display', 'block');
        $('#fourPayment').attr('style', '');
    } else {
        $('.WordSection1').html('');
        layer.msg('款项数量有误!', { icon: 0, time: 2500 });
        return;
    }

    $('#orderTotalPrice').html(decoration.factPrice);
    $('#orderTotalPriceCN').html(contractCommon.getCNMoney(decoration.factPrice));

    var house = decoration.house || {};
    var village = house.village || {};
    $('#houseAddr').html((village.cityProper ? village.cityProper.name : '') + (village.name || '') + (house.houseNumber || ''));
    $('#totalArea').html(house.totalArea != null ? house.totalArea : (house.buildArea != null ? house.buildArea : ''));
});
}); // end app.ready
