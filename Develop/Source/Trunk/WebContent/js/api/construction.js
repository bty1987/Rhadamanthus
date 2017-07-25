
$.extend(api.index, {
    supervisionIndex: {url: "/views/construction/supervision.html"},
    supervisionDetailIndex: {url: "/views/construction/supervisionDetail.html"},
    supervisionInDecreaseIndex: {url: "/views/construction/supervisionInDecrease.html"},

    reworkIndex: {url: "/views/construction/rework.html"},

    onsiteInspectionRecordIndex: {url: "/views/construction/onsiteInspectionRecord.html"},
    onsiteInspectionDeductionIndex: {url: "/views/construction/onsiteInspectionDeduction.html"},

    qualityTestingIndex: {url: "/views/construction/qualityTesting.html"},
    qualityTestingDetailIndex: {url: "/views/construction/qualityTestingDetail.html"},
    qualityTestingRecordIndex: {url: "/views/construction/qualityTestingRecord.html"},

    customerServiceIndex: {url: "/views/construction/customerService.html"},
    customerServiceDetailIndex: {url: "/views/construction/customerServiceDetail.html"},

    inspectionIndex: {url: "/views/construction/inspection.html"},
    inspectionDeductionIndex: {url: "/views/construction/inspectionDeduction.html"},
    inspectionRecordIndex: {url: "/views/construction/inspectionRecord.html"},

    acceptanceIndex: {url: "/views/construction/acceptance.html"},
    acceptanceDetailIndex: {url: "/views/construction/acceptanceDetail.html"},

    customerServiceBackVisitIndex: {url: "/views/construction/customerServiceBackVisit.html"},
    customerServiceComplaintIndex: {url: "/views/construction/customerServiceComplaint.html"},
    customerServiceGuaranteeIndex: {url: "/views/construction/customerServiceGuarantee.html"},

    supervisionReworkIndex: {url: "/views/construction/supervisionRework.html"},
    supervisionAddReduceIndex: {url: "/views/construction/supervisionAddReduce.html"},
    supervisionReworkDrawingIndex: {url: "/views/construction/supervisionReworkDrawing.html"},

    workerAllocationIndex: {url: "/views/construction/workerAllocation.html"},
    workerAllocationDetailIndex: {url: "/views/construction/workerAllocationDetail.html"}
});

$.extend(api.ds, {
    constructionInfo: {url: "ds/constructionInfo.json", demo: true},
    workType: {url: "ds/workType.json", demo: true},
    salaryType: {url: "ds/salaryType.json", demo: true}
});

$.extend(api, {construction: {
    queryAcceptance: {url: "queryAcceptance.do", demo: true},
    updateAcceptance: {url: "updateAcceptance.do"},

    pageDecorationOrderForConstruction: {url: "pageDecorationOrderForConstruction.do", demo: true},
    pageDecorationOrderForSupervisionByUserId: {url: "pageDecorationOrderForSupervisionByUserId.do", demo: true},
    pageDecorationOrderForQualityByUserId: {url: "pageDecorationOrderForQualityByUserId.do", demo: true},
    pageDecorationOrderForAcceptance: {url: "pageDecorationOrderForAcceptance.do", demo: true},
    queryConstructionByOrderId: {url: "queryConstructionByOrderId.do", demo: true},
    queryConstructionForWorkerNameByOrderId: {url: "queryConstructionForWorkerNameByOrderId.do", demo: true},
    updateConstructionByOrderId: {url: "updateConstructionByOrderId.do"},
    nextConstructionByOrderId: {url: "nextConstructionByOrderId.do"},
    checkConstructionForChanStatus: {url: "checkConstructionForChanStatus.do"},
    checkFirstPayment: {url: "checkFirstPayment.do"},
    checkSecondPayment: {url: "checkSecondPayment.do"},
    checkFinalyPayment: {url: "checkFinalyPayment.do"},

    queryConstructionScheduleByOrderId: {url: "queryConstructionScheduleByOrderId.do"},
    queryConstructionScheduleByCid: {url: "queryConstructionScheduleByCid.do"},
    setConstructionScheduleForStatus: {url: "setConstructionScheduleForStatus.do"},
    setConstructionScheduleForInfo: {url: "setConstructionScheduleForInfo.do"},

    queryConstructionDrawingByOrderId: {url: "queryConstructionDrawingByOrderId.do"},
    queryConstructionDrawingByCid: {url: "queryConstructionDrawingByCid.do"},
    addConstructionDrawing: {url: "addConstructionDrawing.do"},
    addConstructionDrawings: {url: "addConstructionDrawings.do"},
    deleteConstructionDrawing: {url: "deleteConstructionDrawing.do"},

    pageCustomerServiceBackVisit: {url: "pageCustomerServiceBackVisit.do", demo: true},
    addCustomerServiceBackVisit: {url: "addCustomerServiceBackVisit.do"},
    updateCustomerServiceBackVisit: {url: "updateCustomerServiceBackVisit.do"},
    deleteCustomerServiceBackVisit: {url: "deleteCustomerServiceBackVisit.do"},

    pageCustomerServiceComplaint: {url: "pageCustomerServiceComplaint.do", demo: true},
    addCustomerServiceComplaint: {url: "addCustomerServiceComplaint.do"},
    updateCustomerServiceComplaint: {url: "updateCustomerServiceComplaint.do"},
    handleCustomerServiceComplaint: {url: "handleCustomerServiceComplaint.do"},
    deleteCustomerServiceComplaint: {url: "deleteCustomerServiceComplaint.do"},

    pageCustomerServiceGuarantee: {url: "pageCustomerServiceGuarantee.do", demo: true},
    addCustomerServiceGuarantee: {url: "addCustomerServiceGuarantee.do"},
    updateCustomerServiceGuarantee: {url: "updateCustomerServiceGuarantee.do"},
    deleteCustomerServiceGuarantee: {url: "deleteCustomerServiceGuarantee.do"},

    pageInspectionRecordByOrderId: {url: "pageInspectionRecordByOrderId.do", demo: true},
    addInspectionRecord: {url: "addInspectionRecord.do"},
    updateInspectionRecord: {url: "updateInspectionRecord.do"},
    deleteInspectionRecord: {url: "deleteInspectionRecord.do"},

    pageReworkByOrderId: {url: "pageReworkByOrderId.do", demo: true},
    addRework: {url: "addRework.do"},
    updateRework: {url: "updateRework.do"},
    deleteRework: {url: "deleteRework.do"},

    queryReworkDrawingByReworkId: {url: "queryReworkDrawingByReworkId.do"},
    addReworkDrawing: {url: "addReworkDrawing.do"},
    deleteReworkDrawingById: {url: "deleteReworkDrawingById.do"},

    queryConstructerByOrderId:{url:"queryConstructerByOrderId.do"},
    queryConstructerByCid:{url: "queryConstructerByCid.do"},
    addConstructer:{url: "addConstructer.do"},
    deleteConstructer:{url: "deleteConstructer.do"},
    queryConstructerCidByUserId:{url: "queryConstructerCidByUserId.do"},
    updateConstructerForRate: {url: "updateConstructerForRate.do"}
}});