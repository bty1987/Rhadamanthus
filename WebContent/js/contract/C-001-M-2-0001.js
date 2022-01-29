
/**
        合同html/js文件命名说明:
        C-<company>-<module>-<type>-<index>.html
        C-<公司/模式>-<业务类型>-<合同类型>-<序号>.html
        
        公司/模式:
        001 (方林/半包)
        002 (1918/大宅)
        003 (宜家/半包/整装)
        004 (爱林/整装)
        005 (恩林/局改/二改)
        
        业务类型:
        D (装修)
        M (主材)
        
        合同类型:
        0 (工程)
        1 (设计费)
        2 (主材代购)
        3 (服务费)
        
        举例:
        C-001-D-3-0001.html 方林装修服务费相关合同
        C-005-D-0-0001.html 恩林装修工程相关合同
        
        此文件为: 方林主材代购合同
 */

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
        
        current: new Date(),
	};
    
    if(contractEdit.contractArgs.company != "1"){
        com.focusPage(".company", "#form").hide();
    }
    
    if(contractEdit.contractArgs.company == "1"){
	    com.focusPage(".customer", "#form").hide();
	}
    
    com.post(api.common.current, {}, function(res){
        contractEdit.current = new Date(res.current);
    }, null, false);
    
    contractEdit.cover["cov-sign-year"] = com.dateFormat(contractEdit.current, "yyyy");
    contractEdit.cover["cov-sign-month"] = com.dateFormat(contractEdit.current, "MM");
    contractEdit.cover["cov-sign-day"] = com.dateFormat(contractEdit.current, "dd");
    
    com.post(api.data.queryCustomerById, {"customer.cid": params.cid}, function (res) {

        var customer = res.customer;
        
        com.focusPage("#con-customer-name", "#form").val(customer.name);
        com.focusPage("#sin-customer-phone", "#form").val(customer.phone);
        com.focusPage("#sin-customer-ident", "#form").val(customer.identity);
        
        contractEdit.customer = customer;
        
        contractEdit.cover["cov-orderId"] = contractEdit.decorationOrderId;
        contractEdit.cover["cov-customer-name"] = customer.name;
        contractEdit.cover["cov-customer-phone"] = customer.phone;
        contractEdit.cover["sin-customer-name"] = customer.name;
        
        com.focusPage("#con-company-name", "#form").val(customer.companyName);
        com.focusPage("#con-company-phone", "#form").val(customer.companyPhone);
        
        contractEdit.cover["sin-company-phone"] = customer.companyPhone;
        
    }, null, false);
    
    if(contractEdit.contractArgs.company == "1" && contractEdit.customer.type == 0){
        
        com.showAlert(com.warning, "客户类型为个人");
        
        com.focusPage("#contractPopUp").empty();
        
        return false;
    }

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
        var preprice = parseInt(utils.accAdd(quotation.undisPrice, utils.accAdd(quotation.disPrice, utils.accAdd(quotation.trafficPrice, quotation.managePrice))))
        
        com.focusPage("#con-quotation-total", "#form").val(preprice);
        com.focusPage("#con-quotation-total-undis", "#form").val(parseInt(utils.accSub(preprice, quotation.managePrice)));
        com.focusPage("#con-manage-total", "#form").val(quotation.managePrice);
        
        contractEdit.quotation = quotation;
    });
    
    com.post(api.decoration.queryDecorationHolonomy, {"decorationHolonomy.decoration.orderId": contractEdit.decorationOrderId}, function (res) {
        
        var holonomy = res.decorationHolonomy;
        
        if(!holonomy.servicePrice) holonomy.servicePrice = 0;
        
        com.focusPage("#con-material-total", "#form").val(parseInt(holonomy.materialPrice));
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
        data["con-quotation-total-cn"] = utils.getCNMoney(parseFloat(data["con-quotation-total"]));
        data["con-quotation-total-undis-cn"] = utils.getCNMoney(parseFloat(data["con-quotation-total-undis"]));
        data["con-manage-total-cn"] = utils.getCNMoney(parseFloat(data["con-manage-total"]));
        
        data["con-sign-year"] = com.dateFormat(contractEdit.current, "yyyy");
        data["con-sign-month"] = com.dateFormat(contractEdit.current, "MM");
        data["con-sign-day"] = com.dateFormat(contractEdit.current, "dd");        
        
        if(contractEdit.contractArgs.company == "1"){
            delete data["con-customer-ident"];
            delete data["cov-customer-name"];
            delete data["con-company-phone"];
            
            data["cov-company-name"] = data["con-company-name"];
            data["sin-company-name"] = data["con-company-name"];
        }
        
        if(contractEdit.contractArgs.company != "1"){
            delete data["sin-company-phone"];
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

