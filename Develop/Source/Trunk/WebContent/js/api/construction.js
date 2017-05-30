
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
    workType: {url: "ds/workType.json", demo: true}
});

$.extend(api, {construction: {
    queryAcceptance: {url: "queryAcceptance.do", demo: true},
    updateAcceptance: {url: "updateAcceptance.do"},

    pageDecorationOrderForConstructionSchedule: {url: "pageDecorationOrderForConstructionSchedule.do", demo: true},
    pageDecorationOrderForConstructionScheduleByPlace: {url: "pageDecorationOrderForConstructionScheduleByPlace.do", demo: true},
    pageDecorationOrderForSupervisionByUserId: {url: "pageDecorationOrderForSupervisionByUserId.do", demo: true},
    pageDecorationOrderForQualityByUserId: {url: "pageDecorationOrderForQualityByUserId.do", demo: true},
    pageDecorationOrderForAcceptance: {url: "pageDecorationOrderForAcceptance.do", demo: true},
    queryConstructionScheduleByOrderId: {url: "queryConstructionScheduleByOrderId.do", demo: true},
    queryConstructionScheduleForWorkerNameByOrderId: {url: "queryConstructionScheduleForWorkerNameByOrderId.do", demo: true},
    updateConstructionScheduleByOrderId: {url: "updateConstructionScheduleByOrderId.do"},
    nextConstructionScheduleByOrderId: {url: "nextConstructionScheduleByOrderId.do"},
    checkConstructionScheduleForChanStatus: {url: "checkConstructionScheduleForChanStatus.do"},
    checkFirstPayment: {url: "checkFirstPayment.do"},
    checkSecondPayment: {url: "checkSecondPayment.do"},
    checkFinalyPayment: {url: "checkFinalyPayment.do"},

    queryBricklayConstructionScheduleByOrderId: {url: "queryBricklayConstructionScheduleByOrderId.do", demo: true},
    updateBricklayConstructionSchedule: {url: "updateBricklayConstructionSchedule.do"},
    setBricklayConstructionScheduleForTimeFlag: {url: "setBricklayConstructionScheduleForTimeFlag.do"},
    setBricklayConstructionScheduleForInfo: {url: "setBricklayConstructionScheduleForInfo.do"},
    setBricklayConstructionScheduleForService: {url: "setBricklayConstructionScheduleForService.do"},

    queryBricklayDrawingByCsId: {url: "queryBricklayDrawingByCsId.do", demo: true},
    queryBricklayDrawingByBcsId: {url: "queryBricklayDrawingByBcsId.do"},
    addBricklayDrawing: {url: "addBricklayDrawing.do"},
    deleteBricklayDrawing: {url: "deleteBricklayDrawing.do"},

    queryCarpentConstructionScheduleByOrderId: {url: "queryCarpentConstructionScheduleByOrderId.do"},
    updateCarpentConstructionSchedule: {url: "updateCarpentConstructionSchedule.do"},
    setCarpentConstructionScheduleForTimeFlag: {url: "setCarpentConstructionScheduleForTimeFlag.do"},
    setCarpentConstructionScheduleForInfo: {url: "setCarpentConstructionScheduleForInfo.do"},

    queryCarpentDrawingByCsId: {url: "queryCarpentDrawingByCsId.do"},
    queryCarpentDrawingByCcsId: {url: "queryCarpentDrawingByCcsId.do"},
    addCarpentDrawing: {url: "addCarpentDrawing.do"},
    deleteCarpentDrawing: {url: "deleteCarpentDrawing.do"},

    queryChanConstructionScheduleByOrderId: {url: "queryChanConstructionScheduleByOrderId.do", demo: true},
    updateChanConstructionSchedule: {url: "updateChanConstructionSchedule.do"},
    setChanConstructionScheduleForTimeFlag: {url: "setChanConstructionScheduleForTimeFlag.do"},
    setChanConstructionScheduleForStatus: {url: "setChanConstructionScheduleForStatus.do"},
    setChanConstructionScheduleForInfo: {url: "setChanConstructionScheduleForInfo.do"},

    queryChanDrawingByCsId: {url: "queryChanDrawingByCsId.do", demo: true},
    queryChanDrawingByCcsId: {url: "queryChanDrawingByCcsId.do"},
    addChanDrawing: {url: "addChanDrawing.do"},
    deleteChanDrawing: {url: "deleteChanDrawing.do"},

    queryCleaningConstructionScheduleByOrderId: {url: "queryCleaningConstructionScheduleByOrderId.do", demo: true},
    updateCleaningConstructionSchedule: {url: "updateCleaningConstructionSchedule.do"},
    setCleaningConstructionScheduleForTimeFlag: {url: "setCleaningConstructionScheduleForTimeFlag.do"},
    setCleaningConstructionScheduleForInfo: {url: "setCleaningConstructionScheduleForInfo.do"},

    queryCleaningDrawingByCsId: {url: "queryCleaningDrawingByCsId.do", demo: true},
    queryCleaningDrawingByCcsId: {url: "queryCleaningDrawingByCcsId.do"},
    addCleaningDrawing: {url: "addCleaningDrawing.do"},
    deleteCleaningDrawing: {url: "deleteCleaningDrawing.do"},

    queryGroundLevelingConstructionScheduleByOrderId: {url: "queryGroundLevelingConstructionScheduleByOrderId.do", demo: true},
    updateGroundLevelingConstructionSchedule: {url: "updateGroundLevelingConstructionSchedule.do"},
    setGroundLevelingConstructionScheduleForTimeFlag: {url: "setGroundLevelingConstructionScheduleForTimeFlag.do"},
    setGroundLevelingConstructionScheduleForInfo: {url: "setGroundLevelingConstructionScheduleForInfo.do"},

    queryGroundLevelingDrawingByCsId: {url: "queryGroundLevelingDrawingByCsId.do", demo: true},
    queryGroundLevelingDrawingByGlcsId: {url: "queryGroundLevelingDrawingByGlcsId.do"},
    addGroundLevelingDrawing: {url: "addGroundLevelingDrawing.do"},
    deleteGroundLevelingDrawing: {url: "deleteGroundLevelingDrawing.do"},

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

    pageInspectionDeductionByOrderId: {url: "pageInspectionDeductionByOrderId.do", demo: true},
    addInspectionDeduction: {url: "addInspectionDeduction.do"},
    deleteInspectionDeduction: {url: "deleteInspectionDeduction.do"},

    pageInspectionRecordByOrderId: {url: "pageInspectionRecordByOrderId.do", demo: true},
    addInspectionRecord: {url: "addInspectionRecord.do"},
    updateInspectionRecord: {url: "updateInspectionRecord.do"},
    deleteInspectionRecord: {url: "deleteInspectionRecord.do"},

    queryOilConstructionScheduleByOrderId: {url: "queryOilConstructionScheduleByOrderId.do", demo: true},
    updateOilConstructionSchedule: {url: "updateOilConstructionSchedule.do"},
    setOilConstructionScheduleForTimeFlag: {url: "setOilConstructionScheduleForTimeFlag.do"},
    setOilConstructionScheduleForInfo: {url: "setOilConstructionScheduleForInfo.do"},

    queryOilDrawingByCsId: {url: "queryOilDrawingByCsId.do", demo: true},
    queryOilDrawingByOcsId: {url: "queryOilDrawingByOcsId.do"},
    addOilDrawing: {url: "addOilDrawing.do"},
    deleteOilDrawing: {url: "deleteOilDrawing.do"},

    queryPutlineConstructionScheduleByOrderId: {url: "queryPutlineConstructionScheduleByOrderId.do", demo: true},
    updatePutlineConstructionSchedule: {url: "updatePutlineConstructionSchedule.do"},
    setPutlineConstructionScheduleForStatus: {url: "setPutlineConstructionScheduleForStatus.do"},
    setPutlineConstructionScheduleForInfo: {url: "setPutlineConstructionScheduleForInfo.do"},

    queryPutlineDrawingByCsId: {url: "queryPutlineDrawingByCsId.do", demo: true},
    addPutlineDrawing: {url: "addPutlineDrawing.do"},
    deletePutlineDrawing: {url: "deletePutlineDrawing.do"},

    pageQualityTestingRecordByOrderId: {url: "pageQualityTestingRecordByOrderId.do"},
    addQualityTestingRecord: {url: "addQualityTestingRecord.do"},
    updateQualityTestingRecord: {url: "updateQualityTestingRecord.do"},
    deleteQualityTestingRecord: {url: "deleteQualityTestingRecord.do"},

    pageReworkByOrderId: {url: "pageReworkByOrderId.do", demo: true},
    addRework: {url: "addRework.do"},
    updateRework: {url: "updateRework.do"},
    deleteRework: {url: "deleteRework.do"},

    queryReworkDrawingByReworkId: {url: "queryReworkDrawingByReworkId.do"},
    addReworkDrawing: {url: "addReworkDrawing.do"},
    deleteReworkDrawingById: {url: "deleteReworkDrawingById.do"},

    queryWaterwayCircuitCheckConstructionScheduleByOrderId: {url: "queryWaterwayCircuitCheckConstructionScheduleByOrderId.do", demo: true},
    updateWaterwayCircuitCheckConstructionSchedule: {url: "updateWaterwayCircuitCheckConstructionSchedule.do"},
    setWaterwayCircuitCheckConstructionScheduleForTimeFlag: {url: "setWaterwayCircuitCheckConstructionScheduleForTimeFlag.do"},
    setWaterwayCircuitCheckConstructionScheduleForInfo: {url: "setWaterwayCircuitCheckConstructionScheduleForInfo.do"},

    queryWaterwayCircuitCheckDrawingByCsId: {url: "queryWaterwayCircuitCheckDrawingByCsId.do", demo: true},
    queryWaterwayCircuitCheckDrawingByWcpcsId: {url: "queryWaterwayCircuitCheckDrawingByWcpcsId.do"},
    addWaterwayCircuitCheckDrawing: {url: "addWaterwayCircuitCheckDrawing.do"},
    deleteWaterwayCircuitCheckDrawing: {url: "deleteWaterwayCircuitCheckDrawing.do"},

    queryWaterwayCircuitPowerConstructionScheduleByOrderId: {url: "queryWaterwayCircuitPowerConstructionScheduleByOrderId.do", demo: true},
    updateWaterwayCircuitPowerConstructionSchedule: {url: "updateWaterwayCircuitPowerConstructionSchedule.do"},
    setWaterwayCircuitPowerConstructionScheduleForTimeFlag: {url: "setWaterwayCircuitPowerConstructionScheduleForTimeFlag.do"},
    setWaterwayCircuitPowerConstructionScheduleForInfo: {url: "setWaterwayCircuitPowerConstructionScheduleForInfo.do"},

    queryWaterwayCircuitPowerDrawingByCsId: {url: "queryWaterwayCircuitPowerDrawingByCsId.do", demo: true},
    queryWaterwayCircuitPowerDrawingByWcpcsId: {url: "queryWaterwayCircuitPowerDrawingByWcpcsId.do"},
    addWaterwayCircuitPowerDrawing: {url: "addWaterwayCircuitPowerDrawing.do"},
    deleteWaterwayCircuitPowerDrawing: {url: "deleteWaterwayCircuitPowerDrawing.do"},

    queryConstructerByOrderId:{url:"queryConstructerByOrderId.do"},
    queryConstructerByCsId:{url: "queryConstructerByCsId.do"},
    addConstructer:{url: "addConstructer.do"},
    deleteConstructer:{url: "deleteConstructer.do"},
    queryConstructerCidByUserId:{url: "queryConstructerCidByUserId.do"},
    updateConstructerForRate: {url: "updateConstructerForRate.do"}
}});