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

    if (contractEdit.contractArgs.agent == "1") {
        com.focusPage(".agent", "#form").hide();
    }

    com.post(api.common.current, {}, function(res) {

        contractEdit.current = new Date(res.current);
    }, null, false);

    com.post(api.decoration.queryDecorationForCommonByOrderId, {
        "decoration.orderId": contractEdit.decorationOrderId
    }, function(res) {

        var data = res.decoration;
        var house = data.house;
        var village = house.village;
        var proper = village.cityProper;
        var customer = res.decoration.customer;

        com.focusPage("#con-customer-name", "#form").val(customer.name);
        com.focusPage("#sin-customer-phone", "#form").val(customer.phone);
        com.focusPage("#sin-customer-ident", "#form").val(customer.identity);

        contractEdit.customer = customer;

        contractEdit.decoration = data;
    });

    com.post(api.decoration.queryDecorationHolonomy, {
        "decorationHolonomy.decoration.orderId": contractEdit.decorationOrderId
    }, function(res) {

        var holonomy = res.decorationHolonomy;

        if (holonomy)
            holonomy.materialPrice = 0;
        if (!holonomy.servicePrice)
            holonomy.servicePrice = 0;

        com.focusPage("#con-service-total", "#form").val(holonomy.servicePrice);

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

        data["con-service-total-cn"] = utils.getCNMoney(parseFloat(data["con-service-total"]));

        data["con-sign-year"] = com.dateFormat(contractEdit.current, "yyyy");
        data["con-sign-month"] = com.dateFormat(contractEdit.current, "MM");
        data["con-sign-day"] = com.dateFormat(contractEdit.current, "dd");

        data["sin-customer-name"] = data["con-customer-name"];

        console.log(data);

        com.showConfirm("请仔细认真检查合同填写内容", function() {

            var options = {
                "decorationContract.orderId": params.decoration.orderId,
                "contract.cid": params.decoration.contractargs.cid,
                "data": JSON.stringify(data)
            };

            console.log(options);

            com.post(api.decoration.addDecorationContract, options, function(res) {

                com.closePopup();
            });
        });
    });

});
