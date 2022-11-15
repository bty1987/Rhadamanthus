jQuery(function($) {

    var userContractcreate = {

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
    };

    com.post(api.data.queryContract, {"contract.atttype": constant.data().contract.ATTTYPE_USER_INT}, function(res) {

        userContractcreate.items.contract.bindData(res.contracts, "cid", "name", " ");

        userContractcreate.contracts = res.contracts.split("cid", "page");
    });

    userContractcreate.items.contract.on('change', function() {

        var cid = userContractcreate.items.contract.val();
        var page = userContractcreate.contracts[cid];

        if (!cid)
            userContractcreate.htmls.contractPopUp.empty();

        params.personel.contractargs = com.splitUrl(page);
        params.personel.contractargs.cid = cid;

        userContractcreate.htmls.contractPopUp.load(page);
    });
});