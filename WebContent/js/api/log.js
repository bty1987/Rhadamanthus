
$.extend(api.index, {
    actionLogIndex: {url: "/views/log/actionLog.html"},
    loginLogIndex: {url: "/views/log/loginLog.html"},
    customerLogIndex: {url: "/views/log/customerLog.html"},
    decorationLogIndex: {url: "/views/log/decorationLog.html"},
    kingdeeSyncLogIndex: {url: "/views/log/kingdeeSyncLog.html"}
});

$.extend(api, {log: {
    pageActionLog: {url: "pageActionLog.do"},
    pageActionLogWithHistory: {url: "pageActionLogWithHistory.do"},
    pageLoginLog: {url: "pageLoginLog.do", demo: true},
    pageCustomerLog: {url: "pageCustomerLog.do"},
    pageDecorationLog: {url: "pageDecorationLog.do"},
    pageKingdeeSyncLog: {url: "pageKingdeeSyncLog.do"}
}});

