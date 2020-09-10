
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
    queryDepartmentByDid: {url: "queryDepartmentByDid.do"},
    queryDepartmentByNo: {url: "queryDepartmentByNo.do"},
    queryDepartmentByName: {url: "queryDepartmentByName.do"},
    addDepartment: {url: "addDepartment.do", server: "communion"},
    updateDepartment: {url: "updateDepartment.do", server: "communion"},
    updateDepartmentForStatus : {url :"updateDepartmentForStatus.do", server: "communion"},

    addDepartmentType: {url :"addDepartmentType.do", server: "communion"},
    queryDepartmentType:{url : "queryDepartmentType.do"},
    queryDepartmentByDtid: {url :"queryDepartmentByDtid.do"},
    pageDepartmentType : {url: "pageDepartmentType.do", demo: true},
	
	queryDataDrawing: {url: "queryDataDrawing.do"},
	addDataDrawing :{url:"addDataDrawing.do",server: "communion", intercept: true},
	deleteDataDrawing:{url:"deleteDataDrawing.do",server: "communion"},

    pageServiceNode:{url:"pageServiceNode.do"},
    addServiceNode:{url:"addServiceNode.do"},
    updateServiceNode:{url:"updateServiceNode.do"},
    updateServiceNodeForStatus:{url:"updateServiceNodeForStatus.do"},
    
    pageContract:{url:"pageContract.do"},
    queryContract:{url:"queryContract.do"},
    pageSignet:{url:"pageSignet.do"},
    querySignet:{url:"querySignet.do"},
    
    pageTalking:{url:"pageTalking.do"},
    queryTalking:{url:"queryTalking.do"},
    addTalking:{url:"addTalking.do", server: "communion"},
    updateTalking:{url:"updateTalking.do", server: "communion"},
    updateTalkingForStatus:{url:"updateTalkingForStatus.do", server: "communion"},
    deleteTalking:{url:"deleteTalking.do", server: "communion"},

}});
