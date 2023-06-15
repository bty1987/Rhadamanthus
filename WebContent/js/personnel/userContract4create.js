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

        no: null,
        name: null,
        title: null,
        contracts: {},
    };

    com.post(api.data.queryContract, {"contract.atttype": constant.data().contract.ATTTYPE_USER_INT}, function(res) {

        userContractcreate.items.contract.bindData(res.contracts, "cid", "name", " ");

        userContractcreate.contracts = res.contracts.split("cid", "page");
        userContractcreate.no = res.contracts.split("cid", "no");
        userContractcreate.name = res.contracts.split("cid", "name");
        userContractcreate.title = res.contracts.split("cid", "title");
    });

    userContractcreate.items.contract.on('change', function() {

        var cid = userContractcreate.items.contract.val();
        var page = userContractcreate.contracts[cid];
        var no = userContractcreate.no[cid];
        var name = userContractcreate.name[cid];
        var title = userContractcreate.title[cid];

        if (!cid)
            userContractcreate.htmls.contractPopUp.empty();

        params.personel.contractargs = com.splitUrl(page);
        params.personel.contractargs.cid = cid;
        params.personel.contractargs.no = no;
        params.personel.contractargs.name = name;
        params.personel.contractargs.title = title;

        userContractcreate.htmls.contractPopUp.load(page);
    });
});