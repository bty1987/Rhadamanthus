$.extend(api.index, {
    balanceDetailIndex: { url: "/views/balance/balanceDetail.html" },
    apportDetailIndex: { url: "/views/balance/apportDetail.html" },
    balanceBalanceIndex: { url: "/views/balance/balanceBalance.html" },
    balanceSalesBalanceIndex: { url: "/views/balance/balanceSalesBalance.html" },
    payBalanceIndex: { url: "/views/balance/payBalance.html" },
    balanceSalesBalancePrint: { url: "/views/balance/balanceSalesBalancePrint.html" },
    balanceSales2print: { url: "/views/balance/balanceSales2print.html" },
});

$.extend(api, {
    balance: {
        pageBalance: {
            url: "pageBalance.do", demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["amount", "surplus"]
            }]
        },
        queryBalance: {
            url: "queryBalance.do",
            type: "query",
            tranargs: [{
                result: "balances",
                args: ["amount", "surplus"]
            }]
        },
        addBalance: {
            url: "addBalance.do",
            type: "update",
            tranargs: {
                args: ["balance.amount"]
            }
        },
        balanceBalance: {
            url: "balanceBalance.do",
            type: "update",
            tranargs: {
                args: ["accountes.money"]
            }
        },
        payBalance: {
            url: "payBalance.do",
            type: "update",
            tranargs: {
                args: ["accountes.money"]
            }
        },

        pageAccount: {
            url: "pageAccount.do", demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["referMoney", "realMoney", "surplus"]
            }]
        },
        queryAccount: {
            url: "queryAccount.do", demo: true,
            type: "query",
            tranargs: [{
                result: "accountes",
                args: ["realMoney", "referMoney", "surplus"]
            }]
        },
        queryAccountForTeller: {
            url: "queryAccountForTeller.do", demo: true,
            type: "query",
            tranargs: [{
                result: "accountes",
                args: ["realMoney", "referMoney", "surplus"]
            }]
        },
        addAccount: { url: "addAccount.do", demo: true },
        updateAccountForStatus: { url: "updateAccountForStatus.do", demo: true },

        withdrawAccount: {
            url: "withdrawAccount.do", demo: true,
            type: "update",
            tranargs: {
                args: ["account.money"]
            }
        },

        queryBalanceDetailForBalance: {
            url: "queryBalanceDetailForBalance.do", demo: true,
            type: "query",
            tranargs: [{
                result: "balanceDetails",
                args: ["money"]
            }]
        },
        queryApportDetailForBalance: {
            url: "queryApportDetailForBalance.do",
            type: "query",
            tranargs: [{
                result: "apportDetails",
                args: ["money"]
            }]
        },
        addApportDetail: {
            url: "addApportDetail.do",
            type: "update",
            tranargs: {
                args: ["apportDetail.money"]
            }
        },
        queryBalanceSalesForSales: {
            url: "queryBalanceSalesForSales.do",
            type: "query",
            tranargs: [{
                result: "salesBalances",
                args: ["pbalance"]
            }]
        },
        queryBalanceSalesForBalance: {
            url: "queryBalanceSalesForBalance.do",
            type: "query",
            tranargs: [{
                result: "balances",
                args: ["amount", "surplus"]
            }]
        },
        pageComcost: {
            url: "pageComcost.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["money"]
            }]
        },
        queryComcost: {
            url: "queryComcost.do", type: "query",
            tranargs: [{
                result: "comcosts",
                args: ["money"]
            }]
        },
        addComcost: {
            url: "addComcost.do",
            type: "update",
            tranargs: {
                args: ["comcost.money"]
            }
        },
        updateComcostForStatus: { url: "updateComcostForStatus.do", demo: true },

        queryBalanceSales: { url: "queryBalanceSales.do", demo: true },
        pageBalanceSales: {
            url: "pageBalanceSales.do", demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["income", "cost", "payment", "profit"]
            }]
        },
        createBalanceSales: {
            url: "createBalanceSales.do",
            type: "update",
            tranargs: {
                args: ["balanceSales.income", "balanceSales.cost", "balanceSales.payment", "balanceSales.profit"]
            }
        },
        queryBalanceSalesByBsid: {
            url: "queryBalanceSalesByBsid.do", demo: true,
            type: "query",
            tranargs: [{
                result: "balanceSales",
                args: ["income", "cost", "payment", "profit"]
            }]
        },
        submitBalanceSales: {
            url: "submitBalanceSales.do",
            type: "update",
            tranargs: {
                args: ["balanceSales.income", "balanceSales.cost", "balanceSales.payment", "balanceSales.profit"]
            }
        },
        pageBalanceSalesBalance: {
            url: "pageBalanceSalesBalance.do", demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data-salesBalance",
                args: ["balance", "difference", "total", "allowance", "vbalance", "pbalance"]
            }, {
                result: "paging-data-salesBalance-sales",
                args: ["total", "maling", "coupon", "depositpay", "fullpay", "amount", "venderMaling"]
            }]
        },
        queryBalanceSalesBalance: {
            url: "queryBalanceSalesBalance.do",
            type: "query",
            demo: true,
            tranargs: [{
                result: "balanceSalesBalances-salesBalance",
                args: ["balance", "difference", "total", "allowance", "vbalance", "pbalance"]
            }, {
                result: "balanceSalesBalances-salesBalance-sales",
                args: ["total", "maling", "coupon", "depositpay", "fullpay", "amount", "venderMaling"]
            }]
        },
        unbindBalanceSales: {
            url: "unbindBalanceSales.do",
            type: "update",
            tranargs: {
                args: ["balanceSales.income", "balanceSales.cost", "balanceSales.payment", "balanceSales.profit"]
            }
        },
        countBalanceSalesBalance: { url: "countBalanceSalesBalance.do", demo: true },

        updateBalanceSales: { url: "updateBalanceSales.do", demo: true },
        
        balanceBalanceSales: { url: "balanceBalanceSales.do", demo: true },
        
        lockBalanceSales: { url: "lockBalanceSales.do", demo: true },
        
        unlockBalanceSales: { url: "unlockBalanceSales.do", demo: true },

    }
});