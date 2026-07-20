
$.extend(api.index, {
    actionLogIndex: {url: "/views/log/actionLog.html"},
    loginLogIndex: {url: "/views/log/loginLog.html"},
    customerPhoneLogIndex: {url: "/views/log/customerPhoneLog.html"},
    decorationPictureLogIndex: {url: "/views/log/decorationPictureLog.html"},
    kingdeeSyncLogIndex: {url: "/views/log/kingdeeSyncLog.html"}
});

$.extend(api, {log: {
    pageActionLog: {url: "pageActionLog.do"},
    pageActionLogWithHistory: {url: "pageActionLogWithHistory.do"},
    pageLoginLog: {url: "pageLoginLog.do", demo: true},
    pageCustomerPhoneLog: {url: "pageCustomerPhoneLog.do"},
    pageDecorationPictureLog: {url: "pageDecorationPictureLog.do"},
    pageKingdeeSyncLog: {url: "pageKingdeeSyncLog.do"}
}});

