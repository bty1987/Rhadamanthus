jQuery(function($) {

    var addDecorationContract = {

        items: {
            contract: com.focusPage("#contract")
        },

        btns: {
            preservation: com.focusPage("#preservation")
        },

        htmls: {
            contractPopUp: com.focusPage("#contractPopUp")
        },

        contracts: {},

        orderId: params.decoration.orderId
    };

    com.post(api.data.queryContract, {"contract.atttype": constant.data().contract.ATTTYPE_DECORATION_INT}, function(res) {
        addDecorationContract.items.contract.bindData(res.contracts, "cid", "name", " ");

        addDecorationContract.contracts = res.contracts.split("cid", "page");
    });

    addDecorationContract.items.contract.on('change', function() {

        params.decoration.orderId = addDecorationContract.orderId;

        var cid = addDecorationContract.items.contract.val();
        var page = addDecorationContract.contracts[cid];

        if (!cid)
            addDecorationContract.htmls.contractPopUp.empty();

        params.decoration.contractargs = com.splitUrl(page);
        params.decoration.contractargs.cid = cid;

        addDecorationContract.htmls.contractPopUp.load(page);
    });
});