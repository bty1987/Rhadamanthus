/**
 * app/js/api/building.js —— building（楼盘/房源）模块 API 定义（第 2 批）
 * 对齐旧 WebContent/js/api/building.js。
 */
$.extend(api.index, {
    buildingIndex:      { url: 'views/building/building.html' },
    buildingNodeIndex:  { url: 'views/building/buildingNode.html' },
    buildingRecordIndex:{ url: 'views/building/buildingRecord.html' },
    buildingHouseIndex: { url: 'views/building/buildingHouse.html' },
    buildingCustomerIndex: { url: 'views/building/buildingCustomer.html' }
});

$.extend(api, { building: {

    // ===== 施工节点 buildingNode =====
    pageBuildingNode:            { url: 'pageBuildingNode.do' },
    queryBuildingNodeByType:     { url: 'queryBuildingNodeByType.do' },
    addBuildingNode:             { url: 'addBuildingNode.do' },
    updateBuildingNode:          { url: 'updateBuildingNode.do' },
    updateBuildingNodeForStatus: { url: 'updateBuildingNodeForStatus.do' },

    // ===== 施工记录 buildingRecord =====
    queryBuildingRecord: { url: 'queryBuildingRecord.do' },
    addBuildingRecord:   { url: 'addBuildingRecord.do' },

    // ===== 楼盘 building =====
    pageBuilding:                { url: 'pageBuilding.do' },
    queryBuildingByBid:          { url: 'queryBuildingByBid.do' },
    bindBuilding:                { url: 'bindBuilding.do' },
    unbindBuilding:              { url: 'unbindBuilding.do' },

    // ===== 房源 buildingHouse =====
    pageBuildingHouse:            { url: 'pageBuildingHouse.do' },
    pageBuildingHouseForAdvance:  { url: 'pageBuildingHouseForAdvance.do' },
    queryBuildingHouseByHsid:     { url: 'queryBuildingHouseByHsid.do' },
    queryBuildingHouseByNo:       { url: 'queryBuildingHouseByNo.do' },
    checkBuildingHouse:           { url: 'checkBuildingHouse.do' },
    addBuildingHouse:             { url: 'addBuildingHouse.do' },
    takeBuildingHouse:            { url: 'takeBuildingHouse.do' },
    updateBuildingHouse:          { url: 'updateBuildingHouse.do' },
    updateBuildingHouseForBelong: { url: 'updateBuildingHouseForBelong.do' },
    updateBuildingHouseForKeyer:  { url: 'updateBuildingHouseForKeyer.do' },
    updateBuildingHouseForStatus: { url: 'updateBuildingHouseForStatus.do' },

    // ===== 房源客户 buildingCustomer =====
    pageBuildingCustomer:            { url: 'pageBuildingCustomer.do' },
    queryBuildingCustomerByCsid:     { url: 'queryBuildingCustomerByCsid.do' },
    queryBuildingCustomerByNo:       { url: 'queryBuildingCustomerByNo.do' },
    addBuildingCustomer:             { url: 'addBuildingCustomer.do' },
    updateBuildingCustomer:          { url: 'updateBuildingCustomer.do' },
    updateBuildingCustomerForStatus: { url: 'updateBuildingCustomerForStatus.do' },

    // ===== 施工进度 buildingSchedule =====
    queryBuildingScheduleByBid:      { url: 'queryBuildingScheduleByBid.do' },
    nextBuildingSchedule:            { url: 'nextBuildingSchedule.do' },
    updateBuildingSchedule:          { url: 'updateBuildingSchedule.do' },
    updateBuildingScheduleForStatus: { url: 'updateBuildingScheduleForStatus.do' },
    resetBuildingSchedule:           { url: 'resetBuildingSchedule.do' }
}});
