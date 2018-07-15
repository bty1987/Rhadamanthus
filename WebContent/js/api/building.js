
$.extend(api.index, {
    building: {url: "/views/building/building.html"},
	buildingSchedule: {url: "/views/building/buildingSchedule.html"},
	houseSource: {url: "/views/building/houseSource.html"},
	houseSourceAdvance: {url: "/views/building/houseSourceAdvance.html"},
	houseSourcePool: {url: "/views/building/houseSourcePool.html"},
	houseSourceQuery: {url: "/views/building/houseSourceQuery.html"},
	customerSource: {url: "/views/building/customerSource.html"},
	houseSourceDetail: {url: "/views/building/houseSourceDetail.html"},
	buildingRecord: {url: "/views/building/buildingRecord.html"},
});

$.extend(api, {building: {
	pageHouseSource: {url: "pageHouseSource.do"},
	pageHouseSourceForFollower: {url: "pageHouseSourceForFollower.do"},
	pageHouseSourceForAdvance: {url: "pageHouseSourceForAdvance.do"},
	queryHouseSourceByHsid: {url: "queryHouseSourceByHsid.do"},
	queryHouseSourceByNo: {url: "queryHouseSourceByNo.do"},
	checkHouseSource: {url: "checkHouseSource.do"},
	addHouseSource: {url: "addHouseSource.do"},
	takeHouseSource: {url: "takeHouseSource.do"},
	updateHouseSource: {url: "updateHouseSource.do"},
	updateHouseSourceForBelong: {url: "updateHouseSourceForBelong.do"},
	updateHouseSourceForKeyer: {url: "updateHouseSourceForKeyer.do"},
	updateHouseSourceForStatus: {url: "updateHouseSourceForStatus.do"},
	updateHouseSourceForPath: {url: "updateHouseSourceForPath.do"},
	
	pageCustomerSource: {url: "pageCustomerSource.do"},
	queryCustomerSourceByCsid: {url: "queryCustomerSourceByCsid.do"},
	queryCustomerSourceByNo: {url: "queryCustomerSourceByNo.do"},
	checkCustomerSource: {url: "checkCustomerSource.do"},
	addCustomerSource: {url: "addCustomerSource.do"},
	updateCustomerSource: {url: "updateCustomerSource.do"},
	updateCustomerSourceForStatus: {url: "updateCustomerSourceForStatus.do"},
	
	pageBuilding: {url: "pageBuilding.do"},
	queryBuildingByBid: {url: "queryBuildingByBid.do"},
	bindBuilding: {url: "bindBuilding.do"},
	unbindBuilding: {url: "unbindBuilding.do"},
	updateBuildingForBalanceStatus: {url: "updateBuildingForBalanceStatus.do"},

	queryBuildingDrawing: {url: "queryBuildingDrawing.do"},
	addBuildingDrawing: {url: "addBuildingDrawing.do", intercept: true},
	deleteBuildingDrawing: {url: "deleteBuildingDrawing.do"},

	pageBuildingNode: {url: "pageBuildingNode.do"},
	queryBuildingNodeByType: {url: "queryBuildingNodeByType.do"},
	addBuildingNode: {url: "addBuildingNode.do"},
	updateBuildingNode: {url: "updateBuildingNode.do"},
	updateBuildingNodeForStatus: {url: "updateBuildingNodeForStatus.do"},

	queryBuildingScheduleByBid: {url: "queryBuildingScheduleByBid.do"},
	nextBuildingSchedule: {url: "nextBuildingSchedule.do"},
	updateBuildingSchedule: {url: "updateBuildingSchedule.do"},
	updateBuildingScheduleForStatus: {url: "updateBuildingScheduleForStatus.do"},
	resetBuildingSchedule: {url: "resetBuildingSchedule.do"},
	
	queryBuildingRecord: {url: "queryBuildingRecord.do"},
	addBuildingRecord: {url: "addBuildingRecord.do"},

}});