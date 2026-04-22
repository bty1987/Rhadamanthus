$.extend(api.index, {
    designerSalaryIndex: {
        url: "/views/salary/designerSalary.html"
    },
    designerBalanceSalaryIndex: {
        url: "/views/salary/designerBalanceSalary.html"
    },
    designerOutsideSalaryIndex: {
        url: "/views/salary/designerOutsideSalary.html"
    },
    designerDeductSalaryIndex: {
        url: "/views/salary/designerDeductSalary.html"
    },
    venderBalanceIndex: {
        url: "/views/salary/venderBalance.html"
    },
    workerSalaryIndex: {
        url: "/views/salary/workerSalary.html"
    },
    workerBaseSalaryScheduleIndex: {
        url: "/views/salary/workerBaseSalarySchedule.html"
    },
    workerBaseSalaryScheduleDetailIndex: {
        url: "/views/salary/workerBaseSalaryScheduleDetail.html"
    },
    workerDeductSalaryScheduleDetailIndex: {
        url: "/views/salary/workerDeductSalaryScheduleDetail.html"
    },
    workerBaseSalaryIndex: {
        url: "/views/salary/workerBaseSalary.html"
    },
    workerDeductSalaryIndex: {
        url: "/views/salary/workerDeductSalary.html"
    },
    workerDetailIndex: {
        url: "/views/salary/workerDetail.html"
    },
});

$.extend(api, {
    salary: {

        pageWorkerSalary: {
            url: "pageWorkerSalary.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["money", "deposit", "salary"],
            }, {
                result: "paging-data-decoration-house",
                args: ["totalArea"],
            }]
        },
        pageWorkerSalaryByUserId: {
            url: "pageWorkerSalaryByUserId.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["money", "deposit", "salary"]
            }]
        },
        queryWorkerSalary: {
            url: "queryWorkerSalary.do",
            type: "query",
            tranargs: [{
                result: "workerSalarys",
                args: ["money", "deposit", "salary"]
            }]
        },
        queryWorkerSalaryByWsid: {
            url: "queryWorkerSalaryByWsid.do",
            type: "query",
            tranargs: [{
                result: "workerSalary",
                args: ["money", "deposit", "salary"]
            }]
        },
        queryWorkerSalaryByOrderId: {
            url: "queryWorkerSalaryByOrderId.do",
            type: "query",
            tranargs: [{
                result: "workerSalarys",
                args: ["money", "deposit", "salary"]
            }]
        },
        addWorkerSalary: {
            url: "addWorkerSalary.do",
            type: "update",
            tranargs: {
                args: ["workerSalary.money"]
            }
        },
        updateWorkerSalary: {
            url: "updateWorkerSalary.do",
            type: "update",
            tranargs: {
                args: ["workerSalary.money"]
            }
        },
        cutWorkerSalary: {
            url: "cutWorkerSalary.do",
            type: "update",
            tranargs: {
                args: ["workerSalary.money"]
            }
        },
        tranWorkerSalary: {
            url: "tranWorkerSalary.do",
            type: "update",
            tranargs: {
                args: ["workerSalary.money"]
            }
        },
        payWorkerSalary: {
            url: "payWorkerSalary.do",
            type: "update",
            tranargs: {
                args: ["workerSalary.money"]
            }
        },
        adoptWorkerSalary: {
            url: "adoptWorkerSalary.do"
        },
        rejectWorkerSalary: {
            url: "rejectWorkerSalary.do"
        },
        checkWsorkerSalary: {
            url: "checkWsorkerSalary.do"
        },
        deleteWorkerSalary: {
            url: "deleteWorkerSalary.do"
        },
        batchImportWorkerSalary: {
            url: "batchImportWorkerSalary.do"
        },
        importWorkerSalary: {
            url: "importWorkerSalary.do"
        },
        sendWorkerSalary: {
            url: "sendWorkerSalary.do"
        },
        cancelWorkerSalary: {
            url: "cancelWorkerSalary.do"
        },
        batchWorkerSalary: {
            url: "batchWorkerSalary.do"
        },
        adoptWorkerSalaryForTimeRange: {
            url: "adoptWorkerSalaryForTimeRange.do"
        },

        pageDesignerSalary: {
            url: "pageDesignerSalary.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["designerSalary.money"]
            }]
        },
        addDesignerSalary: {
            url: "addDesignerSalary.do",
            type: "update",
            tranargs: {
                args: ["designerSalary.money"]
            }
        },
        updateDesignerSalary: {
            url: "updateDesignerSalary.do",
            type: "update",
            tranargs: {
                args: ["designerSalary.money"]
            }
        },
        adoptDesignerSalary: {
            url: "adoptDesignerSalary.do"
        },
        rejectDesignerSalary: {
            url: "rejectDesignerSalary.do"
        },
        deleteDesignerSalary: {
            url: "deleteDesignerSalary.do"
        },

        pageWorkerBalance: {
            url: "pageWorkerBalance.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["deposit", "salary", "toplimit"]
            }]
        },
        updateWorkerBalance: {
            url: "updateWorkerBalance.do",
            type: "update",
            tranargs: {
                args: ["workerBalance.toplimit"]
            }
        },
        addWorkerBalance: {
            url: "addWorkerBalance.do"
        },
        collectWorkerDeposit: {
            url: "collectWorkerDeposit.do",
            type: "update",
            tranargs: {
                args: ["workerSalary.money"]
            }
        },
        drawWorkerDeposit: {
            url: "drawWorkerDeposit.do",
            type: "update",
            tranargs: {
                args: ["workerSalary.money"]
            }
        },

        pageSalary: {
            url: "pageSalary.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["money"]
            }]
        },
        addSalary: {
            url: "addSalary.do",
            type: "update",
            tranargs: {
                args: ["salary.money"]
            }
        },
        passSalary: {
            url: "passSalary.do"
        },
        rejectSalary: {
            url: "rejectSalary.do"
        },
        cancelSalary: {
            url: "cancelSalary.do"
        },

        pageWithhold: {
            url: "pageWithhold.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["money"]
            }]
        },
        queryWithhold: {
            url: "queryWithhold.do",
            type: "query",
            tranargs: [{
                result: "withholds",
                args: ["money"]
            }]
        },
        addWithhold: {
            url: "addWithhold.do",
            type: "update",
            tranargs: {
                args: ["withhold.money"]
            }
        },
        updateWithholdForStatus: {
            url: "updateWithholdForStatus.do"
        },

        querySalaryDrawing: {
            url: "querySalaryDrawing.do"
        },

        addSalaryDrawing: {
            url: "addSalaryDrawing.do",
            server: "salary",
            intercept: true
        },

        deleteSalaryDrawing: {
            url: "deleteSalaryDrawing.do",
            server: "salary"
        },

        pageDecorationSalary: {
            url: "pageDecorationSalary.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["money", "rate"]
            }, {
                result: "paging-data-decoration",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, ]
        },

        pageMaterialSalary: {
            url: "pageMaterialSalary.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["money", "rate"]
            }, {
                result: "paging-data-decoration",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-sales",
                args: ["total", "maling", "coupon", "depositpay", "fullpay", "amount", "venderMaling"]
            }]
        },
    }
});
