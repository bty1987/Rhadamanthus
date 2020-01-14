jQuery(function($) {

    var addDecorationContract = {
        items: {
            contract: com.focusPage("#contract")
        },
        btns: {
            preservation: com.focusPage("#preservation"),
        },
    };
    addDecorationContract.btns.preservation.on('click', function () {
        if(com.validate('form')) return false;

        com.showConfirm("确定要保存合同信息吗?", function () {
            var options = {
                "decorationContract.orderId": params.decorationOrderId,
                "decorationContract.contract.cid": addDecorationContract.items.contract.val()
            };
            com.post(api.decoration.addDecorationContract, options, function (res) {
                com.closePopup();
            });
        });
    });

    com.post(api.communion.queryContract, {}, function (res) {
        addDecorationContract.items.contract.bindData(res.contracts, "cid", "name", true);
    });

});