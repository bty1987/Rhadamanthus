var decorationOrderDetail = {
    decorationOrderId:null,
    orderType:"",
    items: {},

    type:{
        "半包":0,
        "全包":1,
        "半价":2,
    },

    decorationOrder: {},
    customer:{},
    village:{},
    materialPaymentListGrid: null,
    materialPaymentGridPager: null,

    quotations:null,
    quotationDetail:{},

    reloadFlag:0,
    decorationOrderQuotationItemData:[]
};

var decorationPayment = {
    postParam:{},

    items:{},
    basePaymentGrid:null,
    otherPaymentGrid:null,
    otherPaymentPager:null,

    editFlag:0,
};

jQuery(function ($) {
    decorationUtils.init();

    decorationPayment.postParam.decorationOrderId = decorationOrderDetail.decorationOrderId;
    decorationPayment.postParam["decorationPayment.orderId"] = decorationOrderDetail.decorationOrderId;

    decorationOrderDetail.decorationOrderId = decorationOrderPostData.decorationOrderId;
    decorationOrderDetail.orderType = decorationOrderPostData.type;
    decorationOrderDetail.activitys = $("#activitys");
    decorationOrderDetail.activityItems = $("#activityItems");

    decorationPayment.otherPaymentGrid=$("#otherPaymentTable");
    decorationPayment.otherPaymentPager="#otherPaymentGridPager";
    decorationPayment.basePaymentGrid = $("#basePaymentTable");

    decorationOrderDetail.items.houseType = $('#houseType');
    decorationOrderDetail.items.houseClass = $('#houseClass');

    com.post(api.ds.decorationInfo, {}, function(res){
        decorationOrderDetail.items.houseType.bindData(res.houseType, 'key', 'value');
        decorationOrderDetail.items.houseClass.bindData(res.houseClass, 'key', 'value');
    }, null, false);
    
    $('#customerInfosBtn').on(ace.click_event, function(){
        $.gritter.add({
            title: '客户敏感信息',
            text: '邮箱 :'+decorationOrderDetail.customer.email+'<br /> QQ:'+decorationOrderDetail.customer.qq+'<br /> 微信:'+decorationOrderDetail.customer.wechat+'<br />  电话 :'+decorationOrderDetail.customer.phone+'<br />  客户类型:'+decorationOrderDetail.customer.relationshipType+'<br /> ',
            class_name: 'gritter-info gritter-center gritter-light'
        });

        return false;
    });
    initWizard();

    if(decorationOrderDetail.orderType == decorationOrderDetail.type["半价"]){
        decorationUtils.initDecorationHolonomy('step3',decorationOrderDetail.decorationOrderId);
    }

    decorationUtils.initBaseInfo(decorationOrderDetail.decorationOrderId, api.decoration.queryDecorationOrderForCommonByOrderId, function(decorationOrder){

        var statuses = ["咨询", "量房", "已报价", "定金"];

        if(statuses.indexOf(decorationOrder.status)){
            $("#houseType").prop("disabled", false);
        }else{
            decorationOrder.status == "已签约" ? $("#houseType").prop("disabled", true) : $("#houseType").prop("disabled", false);
        }
        $("#orderId").val(decorationOrder.orderId).attr("disabled", true);
        $("#customer").val(decorationOrder.customer.customerName).attr("disabled", true);
        $("#houseAddr").val(decorationOrder.village.villageName + decorationOrder.houseNumber).attr("disabled",true);
        $("#designDepartment").val(decorationOrder.designDepartment).attr("disabled", true);
        $("#designer").val(decorationOrder.designer).attr("disabled", true);
        $("#businessDepartment").val(decorationOrder.businessDepartment).attr("disabled", true);
        $("#salesman").val(decorationOrder.salesman).attr("disabled", true);
        $("#houseType").val(decorationOrder.houseType).attr("disabled", true);
        $("#houseClass").val(decorationOrder.houseClass).attr("disabled", true);
        $("#houseArea").val(decorationOrder.houseArea).attr("disabled", true);
        $("#freeArea").val(decorationOrder.freeArea).attr("disabled", true);
        $("#status").val(decorationOrder.status).attr("disabled", true);
        $("#createTime").val(decorationOrder.createTime).attr("disabled", true);

        $("#backOrderName").val(decorationOrder.backOrderName);
        $("#backOrderPhone").val(decorationOrder.backOrderPhone);
        $("#backOrderContent").val(decorationOrder.backOrderContent);

        $("#notSalesmanName").val(decorationOrder.notSalesmanName);
        $("#notSalesmanPhone").val(decorationOrder.notSalesmanPhone);
        $("#notSalesmanRate").val(decorationOrder.notSalesmanRate);
        $("#notSalesmanContent").val(decorationOrder.notSalesmanContent);

        $("#salesmanType").val(decorationOrder.salesmanType);

        decorationOrderDetail.customer.id = decorationOrder.customer.id;
        decorationOrderDetail.customer.phone = decorationOrder.customer.phone;
        decorationOrderDetail.customer.qq = decorationOrder.customer.qq;
        decorationOrderDetail.customer.wechat = decorationOrder.customer.wechat;
        decorationOrderDetail.customer.email = decorationOrder.customer.email;
        decorationOrderDetail.customer.relationshipType = decorationOrder.customer.relationshipType;
        decorationOrderDetail.customer.approveStatus = decorationOrder.customer.approveStatus;

        decorationOrderDetail.decorationOrder.type = decorationOrder.type;
    });

    decorationUtils.initPayment(decorationOrderDetail.decorationOrderId, null, null, null);

    $('#btnBack').on(ace.click_event,function () {
        com.switchPage(api.index.decorationOrderStageIndex.url);
    });
});


function initWizard(){

    $('#fuelux-wizard').ace_wizard({"status":true}).on('change' , function(e, info){
        var curstep = 0;

        info.direction === "previous" ? curstep = info.step - 1 : curstep = info.step;

        if(curstep == 1){
            decorationUtils.decorationActivityInfo(decorationOrderDetail.activitys, null, decorationOrderDetail.decorationOrderId);
            decorationUtils.decorationActivityItemInfo(decorationOrderDetail.activityItems, null, decorationOrderDetail.decorationOrderId);
        }else if(curstep == 3){
            decorationUtils.initDecorationBelong(decorationOrderDetail.decorationOrderId);
        }
    }).on('finished', function(e) {
        com.switchPage(api.index.decorationOrderStageIndex.url);
    }).on('stepclick', function(e,info){
        if(info.step == 2){
            decorationUtils.decorationActivityInfo(decorationOrderDetail.activitys, null, decorationOrderDetail.decorationOrderId);
            decorationUtils.decorationActivityItemInfo(decorationOrderDetail.activityItems, null, decorationOrderDetail.decorationOrderId);
        }else if(info.step == 4){
            decorationUtils.initDecorationBelong(decorationOrderDetail.decorationOrderId);
        }
    });
}