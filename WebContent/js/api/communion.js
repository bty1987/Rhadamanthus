$.extend(api.index, {
    designRegionIndex: {
        url: "/views/department/designRegion.html"
    },
    businessRegionIndex: {
        url: "/views/department/businessRegion.html"
    },
    designDeptIndex: {
        url: "/views/department/designDept.html"
    },
    businessDeptIndex: {
        url: "/views/department/businessDept.html"
    },
    materialDeptIndex: {
        url: "/views/department/materialDept.html"
    },
    engineeringDeptIndex: {
        url: "/views/department/engineeringDept.html"
    },
    dutyDeptIndex: {
        url: "/views/department/dutyDept.html"
    },
    departmentTree: {
        url: "/views/department/departmentTree.html"
    }
});

$.extend(api, {
    communion: {

        pageDepartment: {
            url: "pageDepartment.do",
            demo: true
        },
        queryDepartment: {
            url: "queryDepartment.do",
            demo: true
        },
        queryDepartmentByDid: {
            url: "queryDepartmentByDid.do"
        },
        queryDepartmentByNo: {
            url: "queryDepartmentByNo.do"
        },
        queryDepartmentByName: {
            url: "queryDepartmentByName.do"
        },
        addDepartment: {
            url: "addDepartment.do",
            server: "communion"
        },
        updateDepartment: {
            url: "updateDepartment.do",
            server: "communion"
        },
        updateDepartmentForStatus: {
            url: "updateDepartmentForStatus.do",
            server: "communion"
        },

        addDepartmentType: {
            url: "addDepartmentType.do",
            server: "communion"
        },
        queryDepartmentType: {
            url: "queryDepartmentType.do"
        },
        queryDepartmentByDtid: {
            url: "queryDepartmentByDtid.do"
        },
        pageDepartmentType: {
            url: "pageDepartmentType.do",
            demo: true
        },

        queryDataDrawing: {
            url: "queryDataDrawing.do"
        },
        addDataDrawing: {
            url: "addDataDrawing.do",
            server: "communion",
            intercept: true
        },
        deleteDataDrawing: {
            url: "deleteDataDrawing.do",
            server: "communion"
        },

        pageServiceNode: {
            url: "pageServiceNode.do"
        },
        addServiceNode: {
            url: "addServiceNode.do"
        },
        updateServiceNode: {
            url: "updateServiceNode.do"
        },
        updateServiceNodeForStatus: {
            url: "updateServiceNodeForStatus.do"
        },

        // 积分模块api 5条
        queryCppoint: {
            url: "queryCppoint.do"
        },
        queryCppointRecord: {
            url: "queryCppointRecord.do"
        },
        createCppoint: {
            url: "createCppoint.do"
        },
        addupCppoint: {
            url: "addupCppoint.do"
        },
        useupCppoint: {
            url: "useupCppoint.do"
        },

        // 任务
        pageTask: {
            url: "pageTask.do"
        },
        queryTask: {
            url: "queryTask.do"
        },
        queryTaskByRid: {
            url: "queryTaskByRid.do"
        },
        queryTaskForSelf: {
            url: "queryTaskForSelf.do"
        },
        addTask: {
            url: "addTask.do",
            server: "communion"
        },
        updateTaskForStatus: {
            url: "updateTaskForStatus.do",
            server: "communion"
        },
        updateTaskForIsShow: {
            url: "updateTaskForIsShow.do",
            server: "communion"
        },
        updateRoleTask: {
            url: "updateRoleTask.do",
            server: "communion"
        },

        pageTaskParam: {
            url: "pageTaskParam.do"
        },
        queryTaskParam: {
            url: "queryTaskParam.do"
        },
        addTaskParam: {
            url: "addTaskParam.do",
            server: "communion"
        },
        updateTaskParam: {
            url: "updateTaskParam.do",
            server: "communion"
        },
        updateTaskParamForStatus: {
            url: "updateTaskParamForStatus.do",
            server: "communion"
        },
        deleteTaskParam: {
            url: "deleteTaskParam.do",
            server: "communion"
        },

    }
});
