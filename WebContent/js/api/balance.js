$.extend(api.index, {
    balanceDetailIndex: {url: "/views/balance/balanceDetail.html"},
    apportDetailIndex: {url: "/views/balance/apportDetail.html"},
    balanceBalanceIndex: {url: "/views/balance/balanceBalance.html"},
    balanceSalesIndex: {url: "/views/balance/balanceSalesIndex.html"},
    payBalanceIndex: {url: "/views/balance/payBalance.html"},
});

$.extend(api, {
    balance: {
        pageBalance: {url: "pageBalance.do", demo: true,
            type: "query",
            tranargs: [{
                result:"paging-data",
                args:["amount", "surplus"]
            }]},
        addBalance: {url: "addBalance.do",
            type:"update",
            tranargs:{
                args: ["balance.amount"]
            }},
        balanceBalance: {url: "balanceBalance.do",
            type:"update",
            tranargs:{
                args: ["accountes.money"]
            }},
        payBalance: {url: "payBalance.do",
            type:"update",
            tranargs:{
                args: ["accountes.money"]
            }},

        pageAccount : {url: "pageAccount.do", demo: true,
            type: "query",
            tranargs:[{
                result:"paging-data",
                args:["referMoney","realMoney", "surplus"]
            }]},
        queryAccount: {url: "queryAccount.do", demo: true,
		    type: "query",
            tranargs: [{
                result:"accountes",
                args:["realMoney","referMoney","surplus"]
            }]},
        queryAccountForTeller : {url: "queryAccountForTeller.do", demo: true,
            type: "query",
            tranargs: [{
                result:"accountes",
                args:["realMoney","referMoney","surplus"]
            }]},
        addAccount: {url: "addAccount.do", demo: true},
        updateAccountForStatus: {url: "updateAccountForStatus.do", demo: true},

        withdrawAccount : {url: "withdrawAccount.do", demo: true,
            type:"update",
            tranargs:{
                args: ["account.money"]
            }},

        queryBalanceDetailForBalance : {url: "queryBalanceDetailForBalance.do", demo: true,
            type: "query",
            tranargs: [{
                result:"balanceDetails",
                args:["money"]
            }]},
        queryApportDetailForBalance:{url: "queryApportDetailForBalance.do",
            type: "query",
            tranargs: [{
                result:"apportDetails",
                args:["money"]
            }]},
        addApportDetail:{url: "addApportDetail.do",
            type:"update",
            tranargs:{
                args: ["apportDetail.money"]
            }},
        queryBalanceSalesForSales : {url: "queryBalanceSalesForSales.do",
            type: "query",
            tranargs: [{
                result:"salesBalances",
                args:["pbalance"]
            }]},
        queryBalanceSalesForBalance : {url: "queryBalanceSalesForBalance.do",
            type: "query",
            tranargs: [{
                result:"balances",
                args:["amount", "surplus"]
            }]},
        submitBalanceSales : {url: "submitBalanceSales.do", demo: true},

    }
});