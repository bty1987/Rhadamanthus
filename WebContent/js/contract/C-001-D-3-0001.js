
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
    
    com.post(api.data.queryCustomerById, {"customer.cid": params.cid}, function (res) {

        var customer = res.customer;
        
        com.focusPage("#con-customer-name", "#form").val(customer.name);
        com.focusPage("#sin-customer-phone", "#form").val(customer.phone);
        com.focusPage("#sin-customer-ident", "#form").val(customer.identity);
        
        contractEdit.customer = customer;
        
    });

    com.post(api.decoration.queryDecorationForCommonByOrderId, {"decoration.orderId": contractEdit.decorationOrderId}, function (res) {
        
        var data = res.decoration;
        var house = data.house;
        var village = house.village;
        var proper = village.cityProper;
        
        contractEdit.decoration = data;
        
    });
    
    com.post(api.decoration.queryDecorationHolonomy, {"decorationHolonomy.decoration.orderId": contractEdit.decorationOrderId}, function (res) {
        
        var holonomy = res.decorationHolonomy;
        
        if(holonomy) holonomy.materialPrice = 0;
        if(!holonomy.servicePrice) holonomy.servicePrice = 0;
        
        com.focusPage("#con-service-total", "#form").val(holonomy.servicePrice);
        
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
        
        data["con-service-total-cn"] = utils.getCNMoney(parseFloat(data["con-service-total"]));
        
        data["con-sign-year"] = com.dateFormat(new Date(), "yyyy");
        data["con-sign-month"] = com.dateFormat(new Date(), "MM");
        data["con-sign-day"] = com.dateFormat(new Date(), "dd");
        
        data["sin-customer-name"] = data["con-customer-name"];
        
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
