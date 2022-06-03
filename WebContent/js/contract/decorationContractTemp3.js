jQuery(function($) {

    var contractEdit = {

        customer: null,
        decoration: null,
        holonomy: null,
        quotation: null,

        cover: {},

        items: {},

        modal: {
            talkingModal: com.focusPage('#talkingModal')
        },

        contractArgs: params.decoration.contractargs,
        decorationOrderId: params.decoration.orderId,

        $input: null,

        current: new Date(),
    };

    if (contractEdit.contractArgs.company != "1") {
        com.focusPage(".company", "#form").hide();
    }

    if (contractEdit.contractArgs.company == "1") {
        com.focusPage(".customer", "#form").hide();
    }

    com.post(api.common.current, {}, function(res) {

        contractEdit.current = new Date(res.current);
    }, null, false);

    contractEdit.cover["cov-sign-year"] = com.dateFormat(contractEdit.current, "yyyy");
    contractEdit.cover["cov-sign-month"] = com.dateFormat(contractEdit.current, "MM");
    contractEdit.cover["cov-sign-day"] = com.dateFormat(contractEdit.current, "dd");

    com.post(api.data.queryCustomerById, {
        "customer.cid": params.decoration.cid
    }, function(res) {

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

    });

    com.post(api.decoration.queryDecorationForCommonByOrderId, {
        "decoration.orderId": contractEdit.decorationOrderId
    }, function(res) {

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

    com.post(api.quotation.queryQuotationForDefaultByOrderId, {
        "quotation.orderId": contractEdit.decorationOrderId
    }, function(res) {

        var quotation = res.quotation;
        var preprice = parseInt(utils.accAdd(quotation.undisPrice, utils.accAdd(quotation.disPrice, utils.accAdd(quotation.trafficPrice, quotation.managePrice))))

        com.focusPage("#con-quotation-total", "#form").val(preprice);
        com.focusPage("#con-quotation-total-undis", "#form").val(parseInt(utils.accSub(preprice, quotation.managePrice)));
        com.focusPage("#con-manage-total", "#form").val(quotation.managePrice);

        contractEdit.quotation = quotation;
    });

    com.post(api.decoration.queryDecorationHolonomy, {
        "decorationHolonomy.decoration.orderId": contractEdit.decorationOrderId
    }, function(res) {

        var holonomy = res.decorationHolonomy;

        if (!holonomy.servicePrice)
            holonomy.servicePrice = 0;

        com.focusPage("#con-material-total", "#form").val(parseInt(holonomy.materialPrice));
        com.focusPage("#con-service-total", "#form").val(holonomy.servicePrice);

        contractEdit.cover["con-payment-first"] = utils.accMul(holonomy.materialPrice, 0.5);
        contractEdit.cover["con-payment-final"] = utils.accMul(holonomy.materialPrice, 0.5);

        contractEdit.holonomy = holonomy;
    });

    com.focusPage("#preservation").unbind("click").on('click', function() {

        if (com.validate('form'))
            return false;

        var conitems = com.focusPage(".conitem:visible", "#form");

        var data = {};

        $.each(conitems, function(i, e) {

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

        if (contractEdit.contractArgs.company == "1") {
            delete data["con-customer-ident"];
            delete data["cov-customer-name"];
            delete data["con-company-phone"];

            data["cov-company-name"] = data["con-company-name"];
            data["sin-company-name"] = data["con-company-name"];
        }

        if (contractEdit.contractArgs.company != "1") {
            delete data["sin-company-phone"];
        }

        console.log(data);

        com.showConfirm("请仔细认真检查合同填写内容", function() {

            var options = {
                "decorationContract.orderId": params.decoration.orderId,
                "decorationContract.contract.cid": params.decoration.contractargs.cid,
                "data": JSON.stringify(data)
            };

            console.log(options);

            com.post(api.decoration.addDecorationContract, options, function(res) {

                com.closePopup();
            });
        });
    });

});
