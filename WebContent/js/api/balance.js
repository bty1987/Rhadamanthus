$.extend(api.index, {
    balanceDetailIndex: {
        url: "/views/balance/balanceDetail.html"
    },
    apportDetailIndex: {
        url: "/views/balance/apportDetail.html"
    },
    balanceBalanceIndex: {
        url: "/views/balance/balanceBalance.html"
    },
    payBalanceIndex: {
        url: "/views/balance/payBalance.html"
    },
    balanceSalesIndex: {
        url: "/views/balance/balanceSales.html"
    },
    balanceSalesBalanceIndex: {
        url: "/views/balance/balanceSalesBalance.html"
    },
    balanceSalesBalancePrint: {
        url: "/views/balance/balanceSalesBalancePrint.html"
    },
    balanceSales2print: {
        url: "/views/balance/balanceSales2print.html"
    },
    balanceCutpayIndex: {
        url: "/views/balance/balanceCutpay.html"
    },
    balanceDccountDetailIndex: {
        url: "/views/balance/balanceDccountDetail.html"
    },
    balanceCutpay2print: {
        url: "/views/balance/balanceCutpay2print.html"
    },
});

$.extend(api, {
    balance: {
        pageBalance: {
            url: "pageBalance.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["amount", "surplus", "cutpay"]
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
                args: ["balanceAccountes.money"]
            }
        },
        payBalance: {
            url: "payBalance.do",
            type: "update",
            tranargs: {
                args: ["balanceAccountes.money"]
            }
        },

        pageBalanceAccount: {
            url: "pageBalanceAccount.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["referMoney", "realMoney", "surplus"]
            }]
        },
        queryBalanceAccount: {
            url: "queryBalanceAccount.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "balanceAccountes",
                args: ["realMoney", "referMoney", "surplus"]
            }]
        },
        queryBalanceAccountForTeller: {
            url: "queryBalanceAccountForTeller.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "balanceAccountes",
                args: ["realMoney", "referMoney", "surplus"]
            }]
        },
        addBalanceAccount: {
            url: "addBalanceAccount.do",
            demo: true
        },
        updateBalanceAccountForStatus: {
            url: "updateBalanceAccountForStatus.do",
            demo: true
        },

        withdrawBalanceAccount: {
            url: "withdrawBalanceAccount.do",
            demo: true,
            type: "update",
            tranargs: {
                args: ["balanceAccount.money"]
            }
        },

        queryBalanceDetailForBalance: {
            url: "queryBalanceDetailForBalance.do",
            demo: true,
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
            url: "queryComcost.do",
            type: "query",
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
        updateComcostForStatus: {
            url: "updateComcostForStatus.do",
            demo: true
        },

        queryBalanceSales: {
            url: "queryBalanceSales.do",
            demo: true
        },
        pageBalanceSales: {
            url: "pageBalanceSales.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["income", "cost", "payment", "profit"]
            }]
        },
        pageBalanceSalesForBalance: {
            url: "pageBalanceSalesForBalance.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["income", "cost", "payment", "profit"]
            }, {
                result: "paging-data-balance",
                args: ["amount", "surplus", "cutpay"]
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
            url: "queryBalanceSalesByBsid.do",
            demo: true,
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
            url: "pageBalanceSalesBalance.do",
            demo: true,
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
        countBalanceSalesBalance: {
            url: "countBalanceSalesBalance.do",
            demo: true
        },

        updateBalanceSales: {
            url: "updateBalanceSales.do",
            demo: true
        },

        balanceBalanceSales: {
            url: "balanceBalanceSales.do",
            type: "update",
            tranargs: {
                args: ["balanceSales.income", "balanceSales.payment"]
            }
        },

        lockBalanceSales: {
            url: "lockBalanceSales.do",
            demo: true
        },

        unlockBalanceSales: {
            url: "unlockBalanceSales.do",
            demo: true
        },

        queryBalanceCutpay: {
            url : "queryBalanceCutpay.do",
            demo : true,
            type: "query",
            tranargs: [{
                result: "balanceCutpays",
                args: ["money", "cutpay", "total"]
            }, {
                result: "balanceCutpays-dccount",
                args: ["cutpay", "surplus"]
            }]
        },

        addBalanceCutpay: {
            url : "addBalanceCutpay.do",
            type: "update",
            tranargs: {
                args: ["balanceCutpay.money"]
            }
        },

        pageBalanceCutpay: {
            url: "pageBalanceCutpay.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["cutpay", "surplus", "total", "money"]
            }]
        },

        deductBalanceCutpay: {
            url : "deductBalanceCutpay.do",
            type: "update",
            tranargs: {
                args: ["balanceCutpay.money"]
            }
        },

        pageBalanceDccount: {
            url: "pageBalanceDccount.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["cutpay", "surplus"]
            }]
        },
        queryBalanceDccount: {
            url: "queryBalanceDccount.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "balanceDccountes",
                args: ["cutpay", "surplus"]
            }]
        },
        addBalanceDccount: {
            url: "addBalanceDccount.do",
            type: "update",
            tranargs: {
                args: ["balanceDccount.cutpay", "balanceDccount.surplus"]
            }
        },
        updateBalanceDccountForStatus: {
            url: "updateBalanceDccountForStatus.do",
            demo: true
        },
        updateBalanceDccount: {
            url: "updateBalanceDccount.do",
            demo: true
        },
        deleteBalanceSales: {
            url: "deleteBalanceSales.do"
        },
    }
});