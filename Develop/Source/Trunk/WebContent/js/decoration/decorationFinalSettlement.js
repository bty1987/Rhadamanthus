
var decorationOrderDetail = {
    decorationOrderId:null,
    orderType:"",

    type:{
        "半包":0,
        "全包":1,
        "半价":2,
    },

    decorationOrder: {},
    customer:{},
    village:{},

    quotationDetail:{},

    btnSaveBaseDecorationOrderInfo:null,

    validator: {
        houseNumber: {
            type: "v_houseNumber",
            regex: /^D_\d{3}$/g,
            errorMsg: "楼盘名称规则"
        }
    },

    items: {},

    vRepeatFlg: false,
    cRepeatFlg: false
};
$(function(){

    var discount = 10;

    decorationOrderDetail.decorationOrderId = params.decorationOrderId;
    decorationOrderDetail.orderType = params.type;

    $('#btnBack').on(ace.click_event, function(){
        com.switchPage(params.historyOrderPage);
    });

    initWizard(discount);

    setTimeout(function () { quotationUtils.loadQuotationDetail(); }, 500);

})

function initWizard(discount) {
    $('#fuelux-wizard').ace_wizard({"status": true}).on('change', function(e, info) {

        var curstep = 0;

        info.direction === "previous" ? curstep = info.step - 1 : curstep = info.step;

        if (curstep == 1) {
            quotationUtils.loadQuotationDetail();
        } else if (curstep == 2){
           decorationUtils.initMaterial(decorationOrderDetail.decorationOrderId);
        }else if (curstep == 3) {
            $('#step3').empty();
            drawBase("step3");
            drawTable(discount);
        }
    }).on('finished', function(e) {
        com.switchPage(params.historyOrderPage);
    }).on('stepclick', function(e,info){

        if (info.step == 1) {
            quotationUtils.loadQuotationDetail();
        }else if (info.step == 2){
           decorationUtils.initMaterial(decorationOrderDetail.decorationOrderId);
        }else if (info.step == 3) {
           $('#step3').empty();
            drawBase("step3");
            drawTable(discount);
        }
    }).on('next', function(e, info) {
    }).on('previous', function(e, info) {
    });
}
function drawTable(discount) {
    var machingType = {};
    var quotation = decorationOrderDetail.quotation;
    var payed = utils.changeTwoDecimal($('#materialPaidup').text() + $('#servicePaidup').text());

    com.post(api.ds.decoration,{},function(res){
        machingType = res.machingType;
    },null,false);

    var partCanDiscount = utils.changeTwoDecimal(decorationOrderDetail.quotationUndisPrice + decorationOrderDetail.minusQuoUndisPrice);
    var partNotDiscount = utils.changeTwoDecimal(decorationOrderDetail.quotationTotalPrice + decorationOrderDetail.addReduceTotal + decorationOrderDetail.minusQuoTotalPrice + decorationOrderDetail.minusAddReduceTotal + decorationOrderDetail.minusExtensionTotalPrice + decorationOrderDetail.extensionItemTotalPrice);
    var holonomyCanDiscount = utils.changeTwoDecimal(decorationOrderDetail.quotationUndisPrice + decorationOrderDetail.minusQuoUndisPrice + decorationOrderDetail.quotationTotalPrice + decorationOrderDetail.addReduceTotal + decorationOrderDetail.minusQuoTotalPrice + decorationOrderDetail.minusAddReduceTotal );
    var holonomyNotDiscount = utils.changeTwoDecimal(decorationOrderDetail.minusExtensionTotalPrice + decorationOrderDetail.extensionItemTotalPrice);

    var partTotal = utils.changeTwoDecimal(quotationUtils.quotationCalculator(10,0));
    var holonomyTotal = utils.changeTwoDecimal(quotationUtils.quotationCalculator(10,2));
    var discountTotal = utils.changeTwoDecimal(quotationUtils.quotationCalculator(discount,0));
    var transfee = utils.changeTwoDecimal(quotation.trafficPrice);
    var managefee = utils.changeTwoDecimal(quotation.managePrice);

    var table = $('<div></div>').html(null).addClass("fl-quo-cal");

    var divItem1 = $('<div></div>').addClass('fl-quo-cal-item');

    divItem1.append(createCalItem("基础",'normal border-right alert-info'),createCalItem("",'normal border-left-right alert-info'),createCalItem("",'normal border-left-right alert-info'),createCalItem("",'normal border-left-right alert-info'),createCalItem("",'normal border-left alert-info'),createCalItem("装修",' small border-left-right alert-success'),createCalItem("",'normal border-left alert-success'),createCalItem("主材",'small border-left-right alert-danger'),createCalItem("",'normal border-left-right alert-danger'),createCalItem("",'normal border-left-right alert-danger'),createCalItem("",'normal noborder'));
    divItem1.appendTo(table);

    var divItem2 = $('<div></div>').addClass('fl-quo-cal-item');
    divItem2.append(createCalItem("版本",'normal'),createCalItem("折前总价",'normal'),createCalItem("打折项总额",'normal'),createCalItem("非打折项总额",'normal'),createCalItem("管理费",'normal'),createCalItem("折扣",'small'),createCalItem("折后总价",'normal'),createCalItem("配比",'small'),createCalItem("主材额",'normal'),createCalItem("服务费",'normal'),createCalItem("总额",' normal alert-warning'));
    divItem2.appendTo(table);

    var partDiv = $('<div></div>').addClass('fl-quo-cal-item');
    partDiv.append(createCalItem("半包",'normal'),createCalItem(partTotal,'normal'),createCalItem(partCanDiscount,'normal'),createCalItem(utils.changeTwoDecimal(utils.accAdd(partNotDiscount,transfee)),'normal'),createCalItem(managefee,'normal'),createCalItem(discount,'small'),createCalItem(discountTotal,'normal'),createCalItem("-",'small'),createCalItem("-",'normal'),createCalItem("-",'normal'),createCalItem(utils.changeTwoDecimal(discountTotal),'normal alert-warning'));
    partDiv.appendTo(table);

    $.each(machingType,function (i,v) {

        var projectPrice = quotationUtils.quotationCalculator(v.value,2);
        var materialPrice = utils.changeTwoDecimal(utils.accMul(projectPrice,v.key));
        var servicePrice = utils.changeTwoDecimal(utils.accMul(materialPrice,config.serviceRate));
        var total = utils.changeTwoDecimal(utils.accAdd(projectPrice,utils.accAdd(materialPrice,servicePrice)));

        var holonomyDiv = $('<div></div>').addClass('fl-quo-cal-item');

        if(i == Math.ceil(machingType.length / 2) - 1){
            if(machingType.length != 1){
                holonomyDiv.append(createCalItem("半价",'normal border-top-bottom'),createCalItem(holonomyTotal,'normal border-top-bottom'),createCalItem(utils.accAdd(utils.accAdd(holonomyCanDiscount,holonomyNotDiscount),transfee),'normal border-top-bottom'),createCalItem("-",'normal border-top-bottom'),createCalItem(managefee,'normal border-top-bottom'),createCalItem(v.value,'small'),createCalItem(projectPrice,'normal'),createCalItem(utils.accMul(v.key,100)+"%",'small'),createCalItem(materialPrice,'normal'),createCalItem(servicePrice,'normal'),createCalItem(total),'normal alert-warning');
            }else {
                holonomyDiv.append(createCalItem("半价",'normal border-top'),createCalItem(holonomyTotal,'normal border-top'),createCalItem(utils.accAdd(utils.accAdd(holonomyCanDiscount,holonomyNotDiscount),transfee),'normal border-top'),createCalItem("-",'normal border-top'),createCalItem(managefee,'normal border-top'),createCalItem(v.value,'small'),createCalItem(projectPrice,'normal'),createCalItem(utils.accMul(v.key,100)+"%",'small'),createCalItem(materialPrice,'normal'),createCalItem(servicePrice,'normal'),createCalItem((total),'normal alert-warning'));
            }
        }else if(i == (machingType.length - 1)){
            holonomyDiv.append(createCalItem("",'normal border-top'),createCalItem("",'normal border-top'),createCalItem("",'normal border-top'),createCalItem("",'normal border-top'),createCalItem("",'normal border-top'),createCalItem(v.value,'small'),createCalItem(projectPrice,'normal'),createCalItem(utils.accMul(v.key,100)+"%",'small'),createCalItem(materialPrice,'normal'),createCalItem(servicePrice,'normal'),createCalItem(total,'normal alert-warning'));
        }else{
            holonomyDiv.append(createCalItem("",'normal border-top-bottom'),createCalItem("",'normal border-top-bottom'),createCalItem("",'normal border-top-bottom'),createCalItem("",'normal border-top-bottom'),createCalItem("",'normal border-top-bottom'),createCalItem(v.value,'small'),createCalItem(projectPrice,'normal'),createCalItem(utils.accMul(v.key,100)+"%",'small'),createCalItem(materialPrice,'normal'),createCalItem(servicePrice,'normal'),createCalItem(total,'normal alert-warning'));
        }
        holonomyDiv.appendTo(table);
    });

    var inputMainDiv = $("<div></div>").addClass("fl-quo-cal-item");
    var input = $("<input>").attr("type","text").addClass("cell").css({"width":"17.8%"}).attr("id","calDiscount").attr("maxlength","4").val(discount);
    var inputButton = $("<button></button>").addClass("btn btn-primary cell normal").attr("type","button").text("计算").off('click').on('click',function () {
        discount = $("#calDiscount").val();
        $(".fl-quo-cal").remove();

        drawTable(discount,decorationOrderDetail.undisPrice,decorationOrderDetail.totalPrice);
    });

    inputMainDiv.append(createCalItem("输入折扣",'normal'),input,inputButton,createCalItem(" ",'normal  border-top').css({"border-width":"1px 0px 0px 0px"}),createCalItem(" ",'small border-top').css({"border-width":"1px 0px 0px 0px"}),createCalItem(" ",'normal border-top').css({"border-width":"1px 0px 0px 0px"}),createCalItem(" ",'small border-top').css({"border-width":"1px 0px 0px 0px"}),createCalItem(" ",'normal border-top').css({"border-width":"1px 0px 0px 0px"}),createCalItem(" ",'normal').css({"border-width":"1px 0px 0px 0px"}),createCalItem("",'normal border-top ').css({"border-width":"1px 0px 0px 0px"})).appendTo(table);
    table.appendTo($('#step3'));

    function createCalItem(text,inclass) {
        return $('<div></div>').html(text).addClass('cell').addClass(inclass);
    }

}
function  drawBase(divid) {
    var mainDiv = $('#' + divid);

    var holonomyDiv = $("<div></div>").addClass('row');
    var holonomyHeader = $("<div></div>").addClass('widget-header').append($("<h4></h4>").append($('<strong></strong>').html("半价款项信息")));
    var holonomyBody = $("<div></div>").addClass('widget-body');
    var holonomyTable = $("<div></div>").addClass('clearfix').css({"margin-top": "15px", "margin-bottom": "15px"});

    holonomyBody.append($("<div></div>").addClass('widget-body-inner').append(holonomyTable.append(createDivForHolonomy("col-md-4", "折前总价", "quotationPrice", true), createDivForHolonomy("col-md-4", "工程总额", "projectPrice", true), createDivForHolonomy("col-md-4", "管理费", "managePrice", false),
        createDivForHolonomy("col-md-4", "主材总额", "materialPrice", true), createDivForHolonomy("col-md-4", "实收主材额", "materialPaidup", true), createDivForHolonomy("col-md-4", "主材额百分比", "materialPercent", false),
        createDivForHolonomy("col-md-4", "服务费", "servicePrice", true), createDivForHolonomy("col-md-4", "实收服务费", "servicePaidup", true), createDivForHolonomy("col-md-4", "服务费百分比", "servicePercent", false))));
    holonomyDiv.append($("<div></div>").addClass('widget-container-span col-md-12').append($("<div></div>").addClass('widget-box transparent').append(holonomyHeader, holonomyBody)));
    $('<div></div>').addClass('hr col-md-12').appendTo(holonomyDiv);
    $('<div></div>').addClass('hr col-md-12').prependTo(holonomyDiv);
    holonomyDiv.appendTo(mainDiv);

    com.post(api.decoration.queryDecorationHolonomy, {"decorationHolonomy.decorationOrder.orderId": decorationOrderDetail.decorationOrderId}, function (res) {

        res = res.decorationHolonomy;

        $('#projectPrice').html(checkNull(res.projectPrice + res.managePrice));
        $('#managePrice').html(checkNull(res.managePrice));
        $('#materialPrice').html(checkNull(res.materialPrice));
        $('#servicePrice').html(checkNull(res.servicePrice));
        $('#servicePaidup').html(checkNull(res.servicePaidup));
        $('#materialPaidup').html(checkNull(decorationOrderDetail.materialTotal));
        var materialPaidup = decorationOrderDetail.materialTotal;

        if(res.managePrice == null){
            $('#quotationPrice').html(0);
        }else {
            $('#quotationPrice').html(checkNull(Math.ceil(utils.changeThrDecimal(utils.accAdd(utils.accDiv(checkNull(res.projectPrice), utils.accDiv(checkNull(res.discount), 10)), res.managePrice)))));
        }

        if(res.materialPrice == null){
            $('#materialPercent').html(0);
        }else {
            var materialPercent = utils.accMul(utils.changeThrDecimal(utils.accDiv(checkNull(materialPaidup), res.materialPrice)), 100);
            $('#materialPercent').html(checkNull(materialPercent > 100 ? 100 : materialPercent) + "%");
        }

        if(res.servicePrice == null){
            $('#servicePercent').html(0);
        }else {
            var servicePercent = utils.accMul(utils.changeThrDecimal(utils.accDiv(checkNull(res.servicePaidup), res.servicePrice)), 100);
            $('#servicePercent').html(checkNull(servicePercent > 100 ? 100 : servicePercent) + "%");
        }

    },function (e) {
        com.showAlert(com.error,e.errorMsg);
    },false);
}
function createDivForHolonomy(inclass, string, id, isleft) {
    return $("<div></div>").addClass(inclass).css(isleft ? {"border-left": "solid 1px #e3e3e3", "margin-top": "15px"}: {"border-left": "solid 1px #e3e3e3", "border-right": "solid 1px #e3e3e3", "margin-top": "15px"}).append($("<h5></h5>").addClass('bigger-110 center').html(string)).append($("<h2></h2>").addClass('oid bigger  center').append($('<b></b>').addClass('blue').attr('id', id).html(0)));
}
function checkNull(num) {
    return num == null ? 0 : num;
}