
$.extend(api.index, {
    actionLogIndex: {url: "/views/log/actionLog.html"},
    loginLogIndex: {url: "/views/log/loginLog.html"}
});

$.extend(api.ds, {
    logType: {url: "ds/logType.json", demo: true}
});

$.extend(api, {log: {
    pageActionLog: {url: "pageActionLog.do"},
    pageLoginLog: {url: "pageLoginLog.do", demo: true}
}});
