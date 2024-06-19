$.extend(api.index, {
    building: {
        url: "/views/building/building.html"
    },
    buildingSchedule: {
        url: "/views/building/buildingSchedule.html"
    },
    houseSource: {
        url: "/views/building/houseSource.html"
    },
    houseSourceAdvance: {
        url: "/views/building/houseSourceAdvance.html"
    },
    houseSourcePool: {
        url: "/views/building/houseSourcePool.html"
    },
    houseSourceQuery: {
        url: "/views/building/houseSourceQuery.html"
    },
    buildingCustomer: {
        url: "/views/building/buildingCustomer.html"
    },
    houseSourceDetail: {
        url: "/views/building/houseSourceDetail.html"
    },
    buildingRecord: {
        url: "/views/building/buildingRecord.html"
    },
});

$.extend(api, {
    building: {
        pageBuildingHouse: {
            url: "pageBuildingHouse.do"
        },
        pageBuildingHouseForFollower: {
            url: "pageBuildingHouseForFollower.do"
        },
        pageBuildingHouseForAdvance: {
            url: "pageBuildingHouseForAdvance.do"
        },
        queryBuildingHouseByHsid: {
            url: "queryBuildingHouseByHsid.do"
        },
        queryBuildingHouseByNo: {
            url: "queryBuildingHouseByNo.do"
        },
        checkBuildingHouse: {
            url: "checkBuildingHouse.do"
        },
        addBuildingHouse: {
            url: "addBuildingHouse.do"
        },
        takeBuildingHouse: {
            url: "takeBuildingHouse.do"
        },
        updateBuildingHouse: {
            url: "updateBuildingHouse.do"
        },
        updateBuildingHouseForBelong: {
            url: "updateBuildingHouseForBelong.do"
        },
        updateBuildingHouseForKeyer: {
            url: "updateBuildingHouseForKeyer.do"
        },
        updateBuildingHouseForStatus: {
            url: "updateBuildingHouseForStatus.do"
        },
        updateBuildingHouseForPath: {
            url: "updateBuildingHouseForPath.do"
        },

        pageBuildingCustomer: {
            url: "pageBuildingCustomer.do"
        },
        queryBuildingCustomerByCsid: {
            url: "queryBuildingCustomerByCsid.do"
        },
        queryBuildingCustomerByNo: {
            url: "queryBuildingCustomerByNo.do"
        },
        checkBuildingCustomer: {
            url: "checkBuildingCustomer.do"
        },
        addBuildingCustomer: {
            url: "addBuildingCustomer.do"
        },
        updateBuildingCustomer: {
            url: "updateBuildingCustomer.do"
        },
        updateBuildingCustomerForStatus: {
            url: "updateBuildingCustomerForStatus.do"
        },

        pageBuilding: {
            url: "pageBuilding.do"
        },
        queryBuildingByBid: {
            url: "queryBuildingByBid.do"
        },
        bindBuilding: {
            url: "bindBuilding.do"
        },
        unbindBuilding: {
            url: "unbindBuilding.do"
        },
        updateBuildingForBalanceStatus: {
            url: "updateBuildingForBalanceStatus.do"
        },

        queryBuildingDrawing: {
            url: "queryBuildingDrawing.do"
        },
        addBuildingDrawing: {
            url: "addBuildingDrawing.do",
            intercept: true
        },
        deleteBuildingDrawing: {
            url: "deleteBuildingDrawing.do"
        },

        pageBuildingNode: {
            url: "pageBuildingNode.do"
        },
        queryBuildingNodeByType: {
            url: "queryBuildingNodeByType.do"
        },
        addBuildingNode: {
            url: "addBuildingNode.do"
        },
        updateBuildingNode: {
            url: "updateBuildingNode.do"
        },
        updateBuildingNodeForStatus: {
            url: "updateBuildingNodeForStatus.do"
        },

        queryBuildingScheduleByBid: {
            url: "queryBuildingScheduleByBid.do"
        },
        nextBuildingSchedule: {
            url: "nextBuildingSchedule.do"
        },
        updateBuildingSchedule: {
            url: "updateBuildingSchedule.do"
        },
        updateBuildingScheduleForStatus: {
            url: "updateBuildingScheduleForStatus.do"
        },
        resetBuildingSchedule: {
            url: "resetBuildingSchedule.do"
        },

        queryBuildingRecord: {
            url: "queryBuildingRecord.do"
        },
        addBuildingRecord: {
            url: "addBuildingRecord.do"
        },

    }
});