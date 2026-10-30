/**
 * app/js/api/log.js —— log 模块 API 定义（第 1 批）
 *
 * 对齐旧 WebContent/js/api/log.js，5 个只读日志查询页，全部纯分页查询。
 */
$.extend(api.index, {
    actionLogIndex:      { url: 'views/log/actionLog.html' },
    loginLogIndex:       { url: 'views/log/loginLog.html' },
    customerLogIndex:    { url: 'views/log/customerLog.html' },
    decorationLogIndex:  { url: 'views/log/decorationLog.html' },
    kingdeeSyncLogIndex: { url: 'views/log/kingdeeSyncLog.html' }
});

$.extend(api, { log: {
    pageActionLog:            { url: 'pageActionLog.do' },
    pageActionLogWithHistory: { url: 'pageActionLogWithHistory.do' }, // 含归档表
    pageLoginLog:             { url: 'pageLoginLog.do', demo: true },
    pageCustomerLog:          { url: 'pageCustomerLog.do' },
    pageDecorationLog:        { url: 'pageDecorationLog.do' },
    pageKingdeeSyncLog:       { url: 'pageKingdeeSyncLog.do' }
}});
