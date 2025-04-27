jQuery(function($) {

    var addDecorationContract = {

        items: {
            contract: com.focusPage("#contract"),
            contractGroup: com.focusPage("#contractGroup"),
        },

        btns: {
            preservation: com.focusPage("#preservation")
        },

        htmls: {
            contractPopUp: com.focusPage("#contractPopUp")
        },

        contracts: {},

        orderId: params.decoration.orderId,
        contract: params.decoration.contract,
    };
    
    addDecorationContract.items.contractGroup.removeClass("hide");

    com.post(api.data.queryContract, {"contract.atttype": constant.data().contract.ATTTYPE_DECORATION_INT}, function(res) {
        addDecorationContract.items.contract.bindData(res.contracts, "cid", "name", " ");

        addDecorationContract.contracts = res.contracts.split("cid", "page");
    });
    
    com.post(api.data.registCustomer, {
        "customer.cid": params.customer.cid
    }, function(res) {

        console.log(res);
    }, function(res){
        console.log(res);
    });
    
    com.post(api.data.confirmCustomer, {
        "customer.cid": params.customer.cid
    }, function(res) {

        console.log(res);
    }, function(res){
        console.log(res);
    });
    
    if(addDecorationContract.contract && addDecorationContract.contract.cid){
        com.post(api.data.queryContractByCid, {"contract.cid": addDecorationContract.contract.cid}, function(res){
            
            var contract = res.contract;
            
            if (!contract || !contract.cid) return false;
            
            console.log(addDecorationContract.items.contractGroup)
            
            addDecorationContract.items.contractGroup.addClass("hide");
            
            addDecorationContract.htmls.contractPopUp.empty();

            params.decoration.contractargs = com.splitUrl(contract.page);
            params.decoration.contractargs.cid = contract.cid;

            addDecorationContract.htmls.contractPopUp.load(contract.page);
        });
    }

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