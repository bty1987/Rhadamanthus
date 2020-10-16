jQuery(function($) {

    var addDecorationContract = {
            
        items: {
            contract: com.focusPage("#contract")
        },
        
        btns: {
            preservation: com.focusPage("#preservation")
        },
        
        htmls:{
        	contractPopUp: com.focusPage("#contractPopUp")
        },
        
        contracts: {},
        
        decorationOrderId : params.decorationOrderId
    };

    com.post(api.data.queryContract, {}, function (res) {
        addDecorationContract.items.contract.bindData(res.contracts, "cid", "name", " ");
        
        addDecorationContract.contracts = res.contracts.split("cid", "page");
    });

     addDecorationContract.items.contract.on('change', function () {
         
        params.decorationOrderId = addDecorationContract.decorationOrderId;
        
        var cid = addDecorationContract.items.contract.val();
        var page = addDecorationContract.contracts[cid];
        
        if(!cid) addDecorationContract.htmls.contractPopUp.empty();
        
        params.contractArgs = com.splitUrl(page);
        params.contractArgs["cid"] = cid;
        
        addDecorationContract.htmls.contractPopUp.load(page);
     });
});