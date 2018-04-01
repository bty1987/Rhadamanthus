
$.extend(api.index, {
    designRegionIndex: {url: "/views/department/designRegion.html"},
    businessRegionIndex: {url: "/views/department/businessRegion.html"},
    designDeptIndex: {url: "/views/department/designDept.html"},
    businessDeptIndex: {url: "/views/department/businessDept.html"},
    materialDeptIndex: {url: "/views/department/materialDept.html"},
    engineeringDeptIndex: {url: "/views/department/engineeringDept.html"},
    dutyDeptIndex: {url: "/views/department/dutyDept.html"},
    departmentTree: {url: "/views/department/departmentTree.html"}
});

$.extend(api, {communion: {
	
	pageDepartment: {url: "pageDepartment.do", demo: true},
    queryDepartment: {url: "queryDepartment.do", demo: true},
    queryDepartmentById: {url: "queryDepartmentById.do"},
    queryDepartmentByName: {url: "queryDepartmentByName.do"},
    addDepartment: {url: "addDepartment.do", server: "communion"},
    updateDepartment: {url: "updateDepartment.do", server: "communion"},
    deleteDepartment: {url: "deleteDepartment.do", server: "communion"},
    updateDepartmentForStatus : {url :"updateDepartmentForStatus.do", server: "communion"},

    addDepartmentType: {url :"addDepartmentType.do", server: "communion"},
    queryDepartmentType:{url : "queryDepartmentType.do"},
    queryDepartmentByDtid: {url :"queryDepartmentByDtid.do"},
    pageDepartmentType : {url: "pageDepartmentType.do", demo: true},
	
	queryDataDrawing: {url: "queryDataDrawing.do"},
	addDataDrawing :{url:"addDataDrawing.do",server: "communion"},
	deleteDataDrawing:{url:"deleteDataDrawing.do",server: "communion"}
}});
