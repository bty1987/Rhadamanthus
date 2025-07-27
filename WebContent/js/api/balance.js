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
    balanceSelectionItemIndex: {
        url: "/views/balance/balanceSelectionItem.html"
    },
    balanceSelection2print: {
        url: "/views/balance/balanceSelection2print.html"
    },
    balanceSelectionIndex: {
        url: "/views/balance/balanceSelection.html"
    },
    balanceOalesIndex: {
        url: "/views/balance/balanceOales.html"
    },
    balanceOalesItemIndex: {
        url: "/views/balance/balanceOalesItem.html"
    },
    balanceSelectionRecordIndex: {
        url: "/views/balance/balanceSelectionRecord.html"
    }
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
        payedBalance: {
            url: "payedBalance.do"
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

        pageBalanceCutpay: {
            url: "pageBalanceCutpay.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["cutpay", "surplus", "total", "money"]
            }]
        },
        queryBalanceCutpay: {
            url: "queryBalanceCutpay.do",
            demo: true,
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
            url: "addBalanceCutpay.do",
            type: "update",
            tranargs: {
                args: ["balanceCutpay.money"]
            }
        },
        deductBalanceCutpay: {
            url: "deductBalanceCutpay.do",
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
        queryBalanceSales: {
            url: "queryBalanceSales.do",
            demo: true,
            tranargs: [{
                result: "balanceSaleses",
                args: ["income", "cost", "payment", "profit"]
            }]
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
        createBalanceSales: {
            url: "createBalanceSales.do",
            type: "update",
            tranargs: {
                args: ["balanceSales.income", "balanceSales.cost", "balanceSales.payment", "balanceSales.profit"]
            }
        },
        submitBalanceSales: {
            url: "submitBalanceSales.do",
            type: "update",
            tranargs: {
                args: ["balanceSales.income", "balanceSales.cost", "balanceSales.payment", "balanceSales.profit"]
            }
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
        amountBalanceSales: {
            url: "amountBalanceSales.do",
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
                args: ["balance", "difference", "total", "allowance", "vbalance", "pbalance", "coupon"]
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
                args: ["balance", "difference", "total", "allowance", "vbalance", "pbalance", "coupon"]
            }, {
                result: "balanceSalesBalances-salesBalance-sales",
                args: ["total", "maling", "coupon", "depositpay", "fullpay", "amount", "venderMaling"]
            }]
        },

        pageBalanceSelection: {
            url: "pageBalanceSelection.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["income", "cost", "payment", "profit"]
            }]
        },
        pageBalanceSelectionForBalance: {
            url: "pageBalanceSelectionForBalance.do",
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
        pageBalanceSelectionForSupplier: {
            url: "pageBalanceSelectionForSupplier.do",
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
        queryBalanceSelection: {
            url: "queryBalanceSelection.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "balanceSelections",
                args: ["income", "cost", "payment", "profit"]
            }]
        },
        queryBalanceSelectionByBsid: {
            url: "queryBalanceSelectionByBsid.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "balanceSelection",
                args: ["income", "cost", "payment", "profit"]
            }]
        },
        countBalanceSelectionItem: {
            url: "countBalanceSelectionItem.do",
            demo: true
        },
        createBalanceSelection: {
            url: "createBalanceSelection.do",
            type: "update",
            tranargs: {
                args: ["balanceSelection.income", "balanceSelection.cost", "balanceSelection.payment", "balanceSelection.profit"]
            }
        },
        submitBalanceSelection: {
            url: "submitBalanceSelection.do",
            type: "update",
            tranargs: {
                args: ["balanceSelection.income", "balanceSelection.cost", "balanceSelection.payment", "balanceSelection.profit"]
            }
        },
        batchBalanceSelection: {
            url: "batchBalanceSelection.do",
            type: "update",
            tranargs: {
                args: ["balanceSelection.income", "balanceSelection.cost", "balanceSelection.payment", "balanceSelection.profit"]
            }
        },
        unbindBalanceSelection: {
            url: "unbindBalanceSelection.do",
            type: "update",
            tranargs: {
                args: ["balanceSelection.income", "balanceSelection.cost", "balanceSelection.payment", "balanceSelection.profit"]
            }
        },
        lockBalanceSelection: {
            url: "lockBalanceSelection.do",
            demo: true
        },
        unlockBalanceSelection: {
            url: "unlockBalanceSelection.do",
            demo: true
        },
        updateBalanceSelection: {
            url: "updateBalanceSelection.do",
            demo: true
        },
        balanceBalanceSelection: {
            url: "balanceBalanceSelection.do",
            type: "update",
            tranargs: {
                args: ["balanceSelection.income", "balanceSelection.payment"]
            }
        },
        auditBalanceSelection: {
            url: "auditBalanceSelection.do",
            demo: true
        },
        unauditBalanceSelection: {
            url: "unauditBalanceSelection.do",
            demo: true
        },
        deleteBalanceSelection: {
            url: "deleteBalanceSelection.do"
        },
        amountBalanceSelection: {
            url: "amountBalanceSelection.do",
            type: "update",
            tranargs: {
                args: ["balanceSelection.income", "balanceSelection.cost", "balanceSelection.payment", "balanceSelection.profit"]
            }
        },
        pageBalanceSelectionItem: {
            url: "pageBalanceSelectionItem.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data-selectionItem",
                args: ["num", "initNum", "refnum", "postprice", "preprice"]
            }]
        },
        queryBalanceSelectionItem: {
            url: "queryBalanceSelectionItem.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data-selectionItem",
                args: ["num", "initNum", "refnum", "postprice", "preprice"]
            }]
        },

        pageBalanceOales: {
            url: "pageBalanceOales.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["profit"]
            }]
        },
        pageBalanceOalesForBalance: {
            url: "pageBalanceOalesForBalance.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["profit"]
            }, {
                result: "paging-data-balance",
                args: ["amount", "surplus", "cutpay"]
            }]
        },
        queryBalanceOales: {
            url: "queryBalanceOales.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "balanceOaleses",
                args: ["profit"]
            }]
        },
        queryBalanceOalesByBoid: {
            url: "queryBalanceOalesByBoid.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "balanceOales",
                args: ["profit"]
            }]
        },
        createBalanceOales: {
            url: "createBalanceOales.do",
            type: "update",
            tranargs: {
                args: ["balanceOales.profit"]
            }
        },
        submitBalanceOales: {
            url: "submitBalanceOales.do",
            type: "update",
            tranargs: {
                args: ["balanceOales.profit"]
            }
        },
        unbindBalanceOales: {
            url: "unbindBalanceOales.do",
            type: "update",
            tranargs: {
                args: ["balanceOales.profit"]
            }
        },
        lockBalanceOales: {
            url: "lockBalanceOales.do",
            demo: true
        },
        unlockBalanceOales: {
            url: "unlockBalanceOales.do",
            demo: true
        },
        updateBalanceOales: {
            url: "updateBalanceOales.do",
            demo: true
        },
        balanceBalanceOales: {
            url: "balanceBalanceOales.do",
        },
        deleteBalanceOales: {
            url: "deleteBalanceOales.do"
        },
        amountBalanceOales: {
            url: "amountBalanceOales.do",
            type: "update",
            tranargs: {
                args: ["balanceOales.profit"]
            }
        },
        pageBalanceOalesItem: {
            url: "pageBalanceOalesItem.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data-oales",
                args: ["total", "award", "profit", "cost", "threshold"]
            }]
        },
        queryBalanceOalesItem: {
            url: "queryBalanceOalesItem.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data-oales",
                args: ["total", "award", "profit", "cost", "threshold"]
            }]
        },
        queryBalanceSelectionRecord: {
            url: "queryBalanceSelectionRecord.do",
            demo: true
        },

    }
});