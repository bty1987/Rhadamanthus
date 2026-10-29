jQuery(function($) {

    var addDecorationContract = {

        items: {
            contract: com.focusPage("#contract"),
            contractGroup: com.focusPage("#contractGroup"),
            vendor: com.focusPage("#vendor"),
            customerAuthInfo: com.focusPage("#customerAuthInfo"),
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

        // 客户认证状态 {provider: status} (status: 0注册未实名/1已实名/2已签署, 无记录=未注册)
        customerAuth: {},

        // 认证状态标签
        authLabel: function(provider) {

            var status = addDecorationContract.customerAuth[provider];
            var name = provider == 2 ? "e签宝" : "法大大";

            if (status === undefined || status === null) return name + " 未注册";
            if (status == 0) return name + " 注册未实名";
            if (status == 1) return name + " <span style='color:green;'>已实名</span>";
            return name + " 已签署";
        },

        // 按模板path前缀推导厂商: esign://=2签宝 / fadada://=1法大大 / 未标记=默认法大大
        vendorOfPath: function(path) {

            return (path || "").indexOf("esign://") == 0 ? "2" : "1";
        },
    };

    addDecorationContract.items.contractGroup.removeClass("hide");

    // 客户认证状态查询(签宝/法大大各一条)
    com.post(api.decoration.queryElecsignAuthByCid, {
        "customer.cid": params.customer.cid
    }, function(res) {

        $.each(res.elecsignAuths || [], function(i, a) {
            addDecorationContract.customerAuth[a.provider] = a.status;
        });

        addDecorationContract.items.customerAuthInfo.html(
            addDecorationContract.authLabel(2) + " ｜ " + addDecorationContract.authLabel(1));
    });

    com.post(api.data.queryContract, {"contract.atttype": constant.data().contract.ATTTYPE_DECORATION_INT}, function(res) {

        // 模板按厂商标注: path前缀esign://=e签宝/fadada://=法大大, 未标记=默认法大大(与路由resolveProvider模板级口径一致)
        addDecorationContract.items.contract.bindData($.map(res.contracts, function(c) {
            var vendor = (c.path || "").indexOf("esign://") == 0 ? "(e签宝)" : ((c.path || "").indexOf("fadada://") == 0 ? "(法大大)" : "");
            return $.extend({}, c, { name: c.name + vendor });
        }), "cid", "name", " ");

        addDecorationContract.contracts = res.contracts.split("cid", "page");

        // 编辑已有合同时, 厂商回显合同行上的provider
        if (addDecorationContract.contract && addDecorationContract.contract.provider) {
            addDecorationContract.items.vendor.val(String(addDecorationContract.contract.provider));
        }
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

        // 切换模板时厂商自动跟随模板path推导, 用户仍可手动覆盖
        addDecorationContract.items.vendor.val(addDecorationContract.vendorOfPath(page));

        addDecorationContract.htmls.contractPopUp.load(page);
    });
});