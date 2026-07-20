
$.extend(api.index, {
    actionLogIndex: {url: "/views/log/actionLog.html"},
    loginLogIndex: {url: "/views/log/loginLog.html"}
});

$.extend(api, {log: {
    pageActionLog: {url: "pageActionLog.do"},
    pageActionLogWithHistory: {url: "pageActionLogWithHistory.do"},
    pageLoginLog: {url: "pageLoginLog.do", demo: true}
}});

