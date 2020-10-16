
jQuery(function($) {

    var contractEdit = {
            
        customer: null,
        decoration: null,
        holonomy: null,
        quotation: null,
        
        cover: {},
            
        items : {},
        
		modal: {
            talkingModal : com.focusPage('#talkingModal')
        },
        
        contractArgs: params.contractArgs,
        decorationOrderId : params.decorationOrderId,

        $input: null,
	};
    
    if(contractEdit.contractArgs.agent == "1"){
        com.focusPage(".agent", "#form").hide();
    }
    
    contractEdit.cover["cov-sign-year"] = com.dateFormat(new Date(), "yyyy");
    contractEdit.cover["cov-sign-month"] = com.dateFormat(new Date(), "MM");
    contractEdit.cover["cov-sign-day"] = com.dateFormat(new Date(), "dd");
    
    com.post(api.data.queryCustomerById, {"customer.cid": params.cid}, function (res) {

        var customer = res.customer;
        
        com.focusPage("#con-customer-name", "#form").val(customer.name);
        com.focusPage("#sin-customer-phone", "#form").val(customer.phone);
        com.focusPage("#sin-customer-ident", "#form").val(customer.identity);
        
        contractEdit.customer = customer;
        
        contractEdit.cover["cov-orderId"] = contractEdit.decorationOrderId;
        contractEdit.cover["cov-customer-name"] = customer.name;
        contractEdit.cover["cov-customer-phone"] = customer.phone;
    });

    com.post(api.decoration.queryDecorationForCommonByOrderId, {"decoration.orderId": contractEdit.decorationOrderId}, function (res) {
        
        var data = res.decoration;
        var house = data.house;
        var village = house.village;
        var proper = village.cityProper;
        
        contractEdit.decoration = data;
        
        contractEdit.cover["cov-buildarea"] = data.house.buildArea;
        contractEdit.cover["cov-address"] = data.house.village.name + " " + data.house.houseNumber;
        contractEdit.cover["cov-designer-name"] = data.designer.currentName;
        contractEdit.cover["cov-designer-phone"] = data.designer.phone;
    });
    
    com.post(api.quotation.queryQuotationForDefaultByOrderId, {"quotation.orderId": contractEdit.decorationOrderId}, function (res) {
        
        var quotation = res.quotation;
        
        com.focusPage("#con-quotation-total", "#form").val(quotation.totalPrice);
        com.focusPage("#con-quotation-total-undis", "#form").val(utils.accAdd(quotation.undisPrice, utils.accAdd(quotation.disPrice, utils.accAdd(quotation.trafficPrice, quotation.managePrice))));
        com.focusPage("#con-manage-total", "#form").val(quotation.managePrice);
        
        contractEdit.quotation = quotation;
    });
    
    com.post(api.decoration.queryDecorationHolonomy, {"decorationHolonomy.decoration.orderId": contractEdit.decorationOrderId}, function (res) {
        
        var holonomy = res.decorationHolonomy;
        
        if(holonomy) holonomy.materialPrice = 0;
        
        com.focusPage("#con-material-total", "#form").val(holonomy.materialPrice);
        com.focusPage("#con-service-total", "#form").val(holonomy.servicePrice);
        
        contractEdit.cover["con-payment-first"] = utils.accMul(holonomy.materialPrice, 0.5);
        contractEdit.cover["con-payment-final"] = utils.accMul(holonomy.materialPrice, 0.5);
        
        contractEdit.holonomy = holonomy;
    });

    com.focusPage("#preservation").unbind("click").on('click', function () {
        
        if(com.validate('form')) return false;
        
        var conitems = com.focusPage(".conitem:visible", "#form");

        var data = {};
        
        $.each(conitems, function(i, e){
            var content = $(e);
            data[content.attr("id")] = content.val();
        });
        
        console.log(data);
        
        data = $.extend({}, data, contractEdit.cover);
        
        data["con-material-total-cn"] = utils.getCNMoney(parseFloat(data["con-material-total"]));
        data["con-service-total-cn"] = utils.getCNMoney(parseFloat(data["con-service-total"]));
        data["con-quotation-total-cn"] = utils.getCNMoney(parseFloat(data["con-quotation-total"]));
        data["con-quotation-total-undis-cn"] = utils.getCNMoney(parseFloat(data["con-quotation-total-undis"]));
        data["con-manage-total-cn"] = utils.getCNMoney(parseFloat(data["con-manage-total"]));
        
        data["con-sign-year"] = com.dateFormat(new Date(), "yyyy");
        data["con-sign-month"] = com.dateFormat(new Date(), "MM");
        data["con-sign-day"] = com.dateFormat(new Date(), "dd");
        
        data["con-sign1-year"] = com.dateFormat(new Date(), "yyyy");
        data["con-sign1-month"] = com.dateFormat(new Date(), "MM");
        data["con-sign1-day"] = com.dateFormat(new Date(), "dd");
        
        data["con-customer1-name"] = data["con-customer-name"];
        
        data["sin-customer-name"] = data["con-customer-name"];
        
        data["sin1-customer-name"] = data["sin-customer-name"];
        data["sin1-customer-phone"] = data["sin-customer-phone"];
        data["sin1-customer-ident"] = data["sin-customer-ident"];
        
        if(contractEdit.contractArgs.agent == "0"){
            data["sin1-agent-name"] = data["sin-agent-name"];
            data["sin1-agent-phone"] = data["sin-agent-phone"];
            data["sin1-agent-ident"] = data["sin-agent-ident"];
        }
        
        console.log(data);
        
        com.showConfirm("请仔细认真检查合同填写内容", function () {

            var options = {
                "decorationContract.orderId": params.decorationOrderId,
                "decorationContract.contract.cid": params.contractArgs.cid,
                "data": JSON.stringify(data)
            };
            
            console.log(options);
            
            com.post(api.decoration.addDecorationContract, options, function (res) {
                com.closePopup();
            });
        });
    });

});
