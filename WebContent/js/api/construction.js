$.extend(api.index, {
    supervisionIndex: {
        url: "/views/construction/supervision.html"
    },
    supervisionDetailIndex: {
        url: "/views/construction/supervision4detail.html"
    },
    supervisionInDecreaseIndex: {
        url: "/views/construction/supervisionInDecrease.html"
    },
    constructionIndex: {
        url: "/views/construction/construction.html"
    },
    constructionDiaryIndex: {
        url: "/views/construction/constructionDiary.html"
    },
    reworkIndex: {
        url: "/views/construction/rework.html"
    },

    onsiteInspectionRecordIndex: {
        url: "/views/construction/onsiteInspectionRecord.html"
    },
    onsiteInspectionDeductionIndex: {
        url: "/views/construction/onsiteInspectionDeduction.html"
    },

    customerServiceIndex: {
        url: "/views/construction/customer.html"
    },
    customerServiceDetailIndex: {
        url: "/views/construction/customer4detail.html"
    },

    inspectionIndex: {
        url: "/views/construction/inspection.html"
    },
    inspectionDeductionIndex: {
        url: "/views/construction/inspectionDeduction.html"
    },
    inspectionRecordIndex: {
        url: "/views/construction/inspection4record.html"
    },

    acceptanceIndex: {
        url: "/views/construction/acceptance.html"
    },
    acceptanceDetailIndex: {
        url: "/views/construction/acceptance4detail.html"
    },

    customerServiceBackVisitIndex: {
        url: "/views/construction/customer4feedback.html"
    },
    customerServiceComplaintIndex: {
        url: "/views/construction/customer4complaint.html"
    },
    customerServiceGuaranteeIndex: {
        url: "/views/construction/customer4guarantee.html"
    },

    supervisionReworkIndex: {
        url: "/views/construction/supervision4rework.html"
    },
    supervisionAddReduceIndex: {
        url: "/views/construction/supervisionAddReduce.html"
    },
    supervisionReworkDrawingIndex: {
        url: "/views/construction/supervision4drawing.html"
    },

    workerAllocationIndex: {
        url: "/views/construction/allocation.html"
    },
    workerAllocationDetailIndex: {
        url: "/views/construction/allocation4detail.html"
    },

    constructionAccessoryIndex: {
        url: "/views/construction/accessory.html"
    },
    constructionPlan2print: {
        url: "/views/construction/constructionPlan2print.html"
    },
    constructionNode2printIndex: {
        url: "/views/construction/constructionNode2print.html"
    },
    workerSalary2printIndex: {
        url: "/views/construction/workerSalary2print.html"
    },
    constructionRecordIndex: {
        url: "/views/construction/constructionRecord.html"
    },
});

$.extend(api, {
    construction: {
        queryAcceptance: {
            url: "queryAcceptance.do",
            demo: true
        },
        updateAcceptance: {
            url: "updateAcceptance.do"
        },

        pageConstruction: {
            url: "pageConstruction.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice"]
            }, {
                result: "paging-data-house",
                args: ["buildArea"]
            }]
        },

        pageConstructionForBase: {
            url: "pageConstructionForBase.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["accessoryLimit", "salaryLimit", "salaryTotal", "accessoryTotal", "salaryLimitTotal"]
            }, {
                result: "paging-data-decoration",
                args: ["orderTotalPrice"]
            }, {
                result: "paging-data-decoration-house",
                args: ["buildArea"]
            }]
        },

        pageConstructionForSupervision: {
            url: "pageConstructionForSupervision.do",
            demo: true
        },

        pageConstructionForQualiter: {
            url: "pageConstructionForQualiter.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["orderTotalPrice"]
            }, {
                result: "paging-data-house",
                args: ["buildArea"]
            }]
        },
        pageConstructionForAcceptance: {
            url: "pageConstructionForAcceptance.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data-house",
                args: ["buildArea"]
            }]
        },

        queryConstructionByOrderId: {
            url: "queryConstructionByOrderId.do",
            demo: true
        },
        updateConstructionByOrderId: {
            url: "updateConstructionByOrderId.do"
        },
        updateConstructionByCid: {
            url: "updateConstructionByCid.do"
        },
        updateConstructionForAdvance: {
            url: "updateConstructionForAdvance.do",
            type: "update",
            tranargs: {
                args: ["construction.accessoryLimit", "construction.salaryLimit"]
            }
        },
        updateConstructionScheduleForNorm: {
            url: "updateConstructionScheduleForNorm.do",
            type: "update",
            tranargs: {
                args: ["constructionSchedule.accessoryLimit", "constructionSchedule.salaryLimit", "constructionSchedule.accessoryTotal", "constructionSchedule.salaryTotal"]
            }
        },
        updateConstructionScheduleForScal: {
            url: "updateConstructionScheduleForScal.do",
            type: "update",
            tranargs: {
                args: ["constructionSchedule.precheck", "constructionSchedule.postcheck", "constructionSchedule.stacheck", "constructionSchedule.fincheck"]
            }
        },
        updateConstructionScheduleForPeriod: {
            url: "updateConstructionScheduleForPeriod.do",
            type: "update",
            tranargs: {
                args: ["constructionSchedule.period"]
            }
        },
        nextConstructionByOrderId: {
            url: "nextConstructionByOrderId.do"
        },
        openConstruction: {
            url: "openConstruction.do"
        },
        lockConstruction: {
            url: "lockConstruction.do"
        },
        balanceConstruction: {
            url: "balanceConstruction.do"
        },

        pageConstructionSchedule: {
            url: "pageConstructionSchedule.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["precheck", "postcheck", "stacheck", "fincheck", "period", "salaryLimit", "accessoryLimit", "salaryTotal", "accessoryTotal", "prenum", "postnum"]
            }, {
                result: "paging-data-construction",
                args: ["precheck", "postcheck", "stacheck", "fincheck", "period", "salaryLimit", "accessoryLimit", "salaryTotal", "accessoryTotal"]
            }, {
                result: "paging-data-decoration",
                args: ["orderTotalPrice"]
            }, {
                result: "paging-data-decoration-house",
                args: ["buildArea"]
            }]
        },
        queryConstructionScheduleByOrderId: {
            url: "queryConstructionScheduleByOrderId.do",
            tranargs: [{
                result: "constructionSchedules",
                args: ["precheck", "postcheck", "stacheck", "fincheck", "period", "salaryLimit", "accessoryLimit", "salaryTotal", "accessoryTotal"]
            }]
        },
        queryConstructionScheduleByCid: {
            url: "queryConstructionScheduleByCid.do",
            tranargs: [{
                result: "constructionSchedules",
                args: ["precheck", "postcheck", "stacheck", "fincheck", "period", "salaryLimit", "accessoryLimit", "salaryTotal", "accessoryTotal"]
            }]
        },
        queryConstructionScheduleByCsid: {
            url: "queryConstructionScheduleByCsid.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "constructionSchedule",
                args: ["precheck", "postcheck", "stacheck", "fincheck", "period", "salaryLimit", "accessoryLimit", "salaryTotal", "accessoryTotal"]
            }]
        },
        queryConstructionScheduleByOrderIdASchedule: {
            url: "queryConstructionScheduleByOrderIdASchedule.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "constructionSchedule",
                args: ["precheck", "postcheck", "stacheck", "fincheck", "period", "salaryLimit", "accessoryLimit", "salaryTotal", "accessoryTotal"]
            }]
        },
        beginConstructionSchedule: {
            url: "beginConstructionSchedule.do"
        },
        finishConstructionSchedule: {
            url: "finishConstructionSchedule.do"
        },
        checkoutConstructionSchedule: {
            url: "checkoutConstructionSchedule.do"
        },
        enterConstructionSchedule: {
            url: "enterConstructionSchedule.do"
        },
        leaveConstructionSchedule: {
            url: "leaveConstructionSchedule.do"
        },

        queryConstructionDrawingByOrderId: {
            url: "queryConstructionDrawingByOrderId.do"
        },
        queryConstructionDrawingByCid: {
            url: "queryConstructionDrawingByCid.do"
        },
        addConstructionDrawing: {
            url: "addConstructionDrawing.do",
            intercept: true
        },
        addConstructionDrawings: {
            url: "addConstructionDrawings.do",
            intercept: true
        },
        deleteConstructionDrawing: {
            url: "deleteConstructionDrawing.do"
        },

        pageCustomerServiceBackVisit: {
            url: "pageCustomerServiceBackVisit.do",
            demo: true
        },
        addCustomerServiceBackVisit: {
            url: "addCustomerServiceBackVisit.do"
        },
        updateCustomerServiceBackVisit: {
            url: "updateCustomerServiceBackVisit.do"
        },
        deleteCustomerServiceBackVisit: {
            url: "deleteCustomerServiceBackVisit.do"
        },

        pageCustomerServiceComplaint: {
            url: "pageCustomerServiceComplaint.do",
            demo: true
        },
        addCustomerServiceComplaint: {
            url: "addCustomerServiceComplaint.do"
        },
        updateCustomerServiceComplaint: {
            url: "updateCustomerServiceComplaint.do"
        },
        handleCustomerServiceComplaint: {
            url: "handleCustomerServiceComplaint.do"
        },
        deleteCustomerServiceComplaint: {
            url: "deleteCustomerServiceComplaint.do"
        },

        pageCustomerServiceGuarantee: {
            url: "pageCustomerServiceGuarantee.do",
            demo: true
        },
        addCustomerServiceGuarantee: {
            url: "addCustomerServiceGuarantee.do"
        },
        updateCustomerServiceGuarantee: {
            url: "updateCustomerServiceGuarantee.do"
        },
        deleteCustomerServiceGuarantee: {
            url: "deleteCustomerServiceGuarantee.do"
        },

        pageInspectionRecordByOrderId: {
            url: "pageInspectionRecordByOrderId.do",
            demo: true
        },
        addInspectionRecord: {
            url: "addInspectionRecord.do"
        },
        updateInspectionRecord: {
            url: "updateInspectionRecord.do"
        },
        deleteInspectionRecord: {
            url: "deleteInspectionRecord.do"
        },

        pageReworkByOrderId: {
            url: "pageReworkByOrderId.do",
            demo: true
        },
        addRework: {
            url: "addRework.do"
        },
        updateRework: {
            url: "updateRework.do"
        },
        deleteRework: {
            url: "deleteRework.do"
        },

        queryReworkDrawingByReworkId: {
            url: "queryReworkDrawingByReworkId.do"
        },
        addReworkDrawing: {
            url: "addReworkDrawing.do",
            intercept: true
        },
        deleteReworkDrawingById: {
            url: "deleteReworkDrawingById.do"
        },

        queryConstructerByOrderId: {
            url: "queryConstructerByOrderId.do"
        },
        queryConstructerByCid: {
            url: "queryConstructerByCid.do"
        },
        queryConstructerByCrid: {
            url: "queryConstructerByCrid.do"
        },
        addConstructer: {
            url: "addConstructer.do"
        },
        deleteConstructer: {
            url: "deleteConstructer.do"
        },
        queryConstructerCidByUserId: {
            url: "queryConstructerCidByUserId.do"
        },
        updateConstructerForRate: {
            url: "updateConstructerForRate.do"
        },
        rateConstructer: {
            url: "rateConstructer.do"
        },
        sendConstructer: {
            url: "sendConstructer.do"
        },

        pageConstructerRecord: {
            url: "pageConstructerRecord.do"
        },
        queryConstructerRecord: {
            url: "queryConstructerRecord.do"
        },
        addConstructerRecord: {
            url: "addConstructerRecord.do"
        },

        pageDrawLine: {
            url: "pageDrawLine.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data-decoration",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "paging-data-decoration-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea", "quoteArea"]
            }]
        },

        queryDrawLine: {
            url: "queryDrawLine.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "drawLines-decoration",
                args: ["orderTotalPrice", "quotationPrice", "couponCut", "thingCut", "factPrice", "precontractPrice", "notSalesmanRate", "discount"]
            }, {
                result: "drawLines-decoration-house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea", "quoteArea"]
            }]
        },

        countDrawLine: {
            url: "countDrawLine.do"
        },
        updateDrawLine: {
            url: "updateDrawLine.do"
        },
        resetDrawLine: {
            url: "resetDrawLine.do"
        },
        applayDrawLine: {
            url: "applayDrawLine.do"
        },
        successDrawLine: {
            url: "successDrawLine.do",
            type: "update",
            tranargs: {
                args: ["constructionNodes.timeLimit","constructionNodes.prenum","constructionNodes.postnum"]
            }
        },
        pretreatDrawLine: {
            url: "pretreatDrawLine.do",
            type: "update",
            tranargs: {
                args: ["constructionNodes.timeLimit","constructionNodes.prenum","constructionNodes.postnum"]
            }
        },
        failureDrawLine: {
            url: "failureDrawLine.do"
        },

        pageConstructionInfo: {
            url: "pageConstructionInfo.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["timeLimit", "designPeriod"]
            }, {
                result: "paging-data-decoration",
                args: ["orderTotalPrice"]
            }, {
                result: "paging-data-decoration-house",
                args: ["buildArea"]
            }]
        },
        queryConstructionInfo: {
            url: "queryConstructionInfo.do",
            type: "query",
            tranargs: [{
                result: "constructionInfo",
                args: ["timeLimit", "designPeriod"]
            }]
        },
        countConstructionInfo: {
            url: "countConstructionInfo.do",
            type: "query",
            tranargs: [{
                result: "constructionInfo",
                args: ["timeLimit", "designPeriod"]
            }]
        },
        queryConstructionInfoByOrderId: {
            url: "queryConstructionInfoByOrderId.do",
            type: "query",
            tranargs: [{
                result: "constructionInfo",
                args: ["timeLimit", "designPeriod"]
            }]
        },
        updateConstructionInfo: {
            url: "updateConstructionInfo.do",
            type: "update",
            tranargs: {
                args: ["constructionInfo.timeLimit", "constructionInfo.designPeriod"]
            }
        },
        updateConstructionInfoByOrderId: {
            url: "updateConstructionInfoByOrderId.do",
            type: "update",
            tranargs: {
                args: ["constructionInfo.timeLimit", "constructionInfo.designPeriod"]
            }
        },

        pageConstructionAccessory: {
            url: "pageConstructionAccessory.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["total", "num", "numLimit"]
            }]
        },
        addConstructionAccessory: {
            url: "addConstructionAccessory.do",
            type: "update",
            tranargs: {
                args: ["constructionAccessory.numLimit"]
            }
        },
        updateConstructionAccessory: {
            url: "updateConstructionAccessory.do",
            type: "update",
            tranargs: {
                args: ["constructionAccessory.numLimit"]
            }
        },

        queryConstructionPlanByOrderId: {
            url: "queryConstructionPlanByOrderId.do",
            type: "query",
            tranargs: [{
                result: "constructionPlans",
                args: ["connum", "comnum", "prenum", "postnum"]
            }]
        },
        makeConstructionPlan: {
            url: "makeConstructionPlan.do",
            type: "update",
            tranargs: {
                args: ["constructionPlan.connum", "constructionPlan.comnum", "constructionPlan.prenum", "constructionPlan.postnum"]
            }
        },
        addConstructionPlan: {
            url: "addConstructionPlan.do",
            type: "update",
            tranargs: {
                args: ["constructionPlan.connum", "constructionPlan.comnum", "constructionPlan.prenum", "constructionPlan.postnum"]
            }
        },
        updateConstructionPlan: {
            url: "updateConstructionPlan.do",
            type: "update",
            tranargs: {
                args: ["constructionPlan.connum", "constructionPlan.comnum", "constructionPlan.prenum", "constructionPlan.postnum"]
            }
        },
        moveConstructionPlan: {
            url: "moveConstructionPlan.do"
        },
        deleteConstructionPlan: {
            url: "deleteConstructionPlan.do"
        },

        pageConstructionDiary: {
            url: "pageConstructionDiary.do",
            demo: true
        },
        addConstructionDiary: {
            url: "addConstructionDiary.do",
            intercept: true
        },

        queryConstructionDiaryDrawingByCdid: {
            url: "queryConstructionDiaryDrawingByCdid.do"
        },
        addConstructionDiaryDrawing: {
            url: "addConstructionDiaryDrawing.do",
            intercept: true
        },
        deleteConstructionDiaryDrawing: {
            url: "deleteConstructionDiaryDrawing.do"
        },

        queryQualiter: {
            url: "queryQualiter.do"
        },
        addQualiter: {
            url: "addQualiter.do"
        },
        deleteQualiter: {
            url: "deleteQualiter.do"
        },
        queryConstructionRecordByOrderId: {
            url: "queryConstructionRecordByOrderId.do"
        }

    }
});