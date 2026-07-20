/**
 * 操作日志查询页（Phase 2）
 *
 * 数据来源：AccessInterceptor 自动落库的 log.actionLog 表
 * 功能：多条件查询（操作人/接口/模块/类型/结果/时间/IP）+ Excel 导出
 * 只读：日志不允许编辑/删除
 *
 * 模板参考：js/balance/balanceSales.js（Searcher + $.exceler）
 * 条件 key 定义：js/condition/logger.js（log-actionXxx 系列）
 */
jQuery(function($) {

    // 结果状态枚举映射（与 ActionLogPO.RESULTSTATE_* 常量对应）
    var resultStateMap = {0: "成功", 1: "失败", 2: "异常"};

    var seacher = new Searcher();
    var history = "actionLogPostData";
    var url = api.log.pageActionLog;

    // 1) 绑定容器：condList / pagenation / resultList（与 actionLog.html 三 div 对应）
    seacher.base("condList", "pagenation", "resultList", url);

    // 2) 查询条件：引用 js/condition/logger.js 里 log-actionXxx 系列 key
    seacher.condition([
        "log-actionTime",        // 操作时间区间
        "log-actionUserName",    // 操作人姓名
        "log-actionUserId",      // 操作人账号
        "log-actionName",        // 接口名
        "log-actionModule",      // 业务模块
        "log-actionOperateType", // 操作类型
        "log-actionResultState", // 结果
        "log-actionIp",          // 来源 IP
        "log-actionBusinessId"   // 业务对象 ID
    ]);

    // 3) 顶部按钮：仅导出（日志只读，无创建/删除）
    seacher.button([{
        id: "export",
        name: "导出",
        clazz: "btn-success",
        icon: "icon-download"
    }]);

    seacher.history(history);

    // 4) 表格列定义
    var lineprops = [
        {
            fieId: "createTime",
            name: "操作时间",
            prop: "createTime",
            clazz: "green"
        },
        {
            fieId: "createUserName",
            name: "操作人",
            prop: "createUserName",
            clazz: "blue"
        },
        {
            fieId: "actionName",
            name: "接口",
            prop: "actionName",
            clazz: "grey"
        },
        {
            fieId: "moduleId",
            name: "模块",
            prop: "moduleId",
            clazz: "grey"
        },
        {
            fieId: "operateType",
            name: "类型",
            prop: "operateType",
            clazz: "grey"
        },
        {
            fieId: "resultState",
            name: "结果",
            prop: "resultState",
            clazz: "red",
            trans: function(v) {
                return resultStateMap[v.resultState] != null ? resultStateMap[v.resultState] : "";
            }
        },
        {
            fieId: "businessId",
            name: "业务对象",
            prop: "businessId",
            clazz: "grey"
        },
        {
            fieId: "ip",
            name: "IP",
            prop: "ip",
            clazz: "grey"
        },
        {
            fieId: "runTime",
            name: "耗时(ms)",
            prop: "runTime",
            clazz: "grey"
        },
        {
            fieId: "errorCode",
            name: "错误码",
            prop: "errorCode",
            clazz: "red"
        },
        {
            fieId: "errorMsg",
            name: "错误信息",
            prop: "errorMsg",
            clazz: "red"
        },
        {
            fieId: "traceId",
            name: "追踪ID",
            prop: "traceId",
            clazz: "grey"
        }
    ];

    // 5) 渲染表格（无行内按钮）
    seacher.line("actionName", lineprops, []).render();

    // 6) 导出按钮：复用 pageActionLog 接口 + paging.noPage=1 拉全量，前端 $.exceler 生成 xls
    com.focusPage('#export', '#pagenation').on("click", function() {

        var total = com.focusPage('span[name="totalRecords"]', "#pagenation").text();

        if (total == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (total > 2000) {
            // 与 error.md 170002 对齐：导出数量超过上限
            com.showAlert(com.warning, "查询结果大于阀值 , 导出失败");
            return false;
        }

        com.post(api.log.pageActionLog, $.extend({}, params[history], {
            "paging.noPage": 1
        }), function(res) {

            $.exceler({
                column: [
                    ['操作时间', 'createTime'],
                    ['操作人账号', 'createUserId'],
                    ['操作人姓名', 'createUserName'],
                    ['接口', 'actionName'],
                    ['业务模块', 'moduleId'],
                    ['操作类型', 'operateType'],
                    ['结果', 'resultState'],
                    ['业务对象ID', 'businessId'],
                    ['来源IP', 'ip'],
                    ['耗时(ms)', 'runTime'],
                    ['错误码', 'errorCode'],
                    ['错误信息', 'errorMsg'],
                    ['追踪ID', 'traceId'],
                    ['请求参数', 'params']
                ],
                list: res.paging.data
            }, function(v) {
                // 状态码翻译
                v.resultState = resultStateMap[v.resultState] != null ? resultStateMap[v.resultState] : "";
                // 空值兜底
                v.createUserName = v.createUserName == null ? "" : v.createUserName;
                v.businessId = v.businessId == null ? "" : v.businessId;
                v.ip = v.ip == null ? "" : v.ip;
                v.errorCode = v.errorCode == null ? "" : v.errorCode;
                v.errorMsg = v.errorMsg == null ? "" : v.errorMsg;
                v.traceId = v.traceId == null ? "" : v.traceId;
                v.params = v.params == null ? "" : v.params;
                v.moduleId = v.moduleId == null ? "" : v.moduleId;
                v.operateType = v.operateType == null ? "" : v.operateType;
            });
        });
    });

});
