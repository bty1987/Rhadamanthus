
$.extend(api.index, {
    designRegionIndex: {url: "/views/department/designRegion.html"},
    businessRegionIndex: {url: "/views/department/businessRegion.html"},
    designDeptIndex: {url: "/views/department/designDept.html"},
    businessDeptIndex: {url: "/views/department/businessDept.html"},
    materialDeptIndex: {url: "/views/department/materialDept.html"},
    engineeringDeptIndex: {url: "/views/department/engineeringDept.html"},
    dutyDeptIndex: {url: "/views/department/dutyDept.html"}
});

$.extend(api, {department: {
    pageDepartment: {url: "pageDepartment.do", demo: true},
    queryDepartment: {url: "queryDepartment.do", demo: true},
    queryDepartmentById: {url: "queryDepartmentById.do"},
    queryDepartmentByName: {url: "queryDepartmentByName.do"},
    addDepartment: {url: "addDepartment.do", server: "communion"},
    updateDepartment: {url: "updateDepartment.do", server: "communion"},
    deleteDepartment: {url: "deleteDepartment.do", server: "communion"},
    updateDepartmentForStatus : {url :"updateDepartmentForStatus.do", server: "communion"}
}});
