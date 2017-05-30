
$.extend(api.index, {
    drawLineApplyIndex: {url: "/views/drawLine/drawLineApply.html"},
    drawLineDeploymentIndex: {url: "/views/drawLine/drawLineDeployment.html"},
    drawLinePersonInfoIndex: {url: "/views/drawLine/drawLinePersonInfo.html"}
});

$.extend(api.ds, {
    drawLineInfo: {url: "ds/drawLineInfo.json", demo: true}
});

$.extend(api, {drawline: {
	pageDrawLineForPlan: {url: "pageDrawLineForPlan.do", demo: true},
    pageDrawLineForAssign: {url: "pageDrawLineForAssign.do"},
    queryDrawLine: {url: "queryDrawLine.do", demo: true},
    countDrawLineByDate: {url: "countDrawLineByDate.do"},
    resetDrawLine: {url: "resetDrawLine.do"},
    applayDrawLine: {url: "applayDrawLine.do"},
    setDrawLineForSuccess: {url: "setDrawLineForSuccess.do"},
    setDrawLineForFailure: {url: "setDrawLineForFailure.do"}
}});
