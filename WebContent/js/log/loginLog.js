/**
 * 登录日志查询页（Phase 8 补全）
 *
 * 数据来源：log.loginLog 表
 * 查询条件：账号、IP、登录时间、状态、登录方式
 *
 * 字段说明：
 *   - loginId：登录账号（手机号已脱敏，如 138****5678）
 *   - operateType：登录方式 PASSWORD/AUTHCODE/PHONE/CHANGE/UPDATE
 *   - resultState：0成功 1失败 2异常（与 successFlag 并存，前端优先用 resultState）
 */
jQuery(function($) {

    // 结果状态映射（优先 resultState，回退 successFlag）
    var resultStateMap = {0: "成功", 1: "失败", 2: "异常"};

    // 登录方式映射
    var operateTypeMap = {
        "PASSWORD": "密码",
        "AUTHCODE": "验证码",
        "PHONE": "手机验证码",
        "CHANGE": "切换公司",
        "UPDATE": "刷新令牌"
    };

    var seacher = new Searcher();
    var history = "loginLogPostData";

    seacher.base("condList", "pagenation", "resultList", api.log.pageLoginLog);

    seacher.condition([
        "log-loginTime",
        "log-loginId",
        "log-sourceIp",
        "log-successFlag",
        "log-loginOperateType",
        "log-loginResultState"
    ]);

    seacher.button([{
        id: "export",
        name: "导出",
        clazz: "btn-success",
        icon: "icon-download"
    }]);

    seacher.history(history);

    var lineprops = [
        { fieId: "loginTime", name: "登录时间", prop: "loginTime", clazz: "green" },
        { fieId: "loginId", name: "账号", prop: "loginId", clazz: "blue" },
        {
            fieId: "operateType", name: "登录方式", prop: "operateType", clazz: "grey",
            trans: function(v) {
                return operateTypeMap[v.operateType] != null ? operateTypeMap[v.operateType] : (v.operateType || "");
            }
        },
        {
            fieId: "resultState", name: "结果", prop: "resultState", clazz: "red",
            trans: function(v) {
                // 优先用 resultState（三态），回退 successFlag（二态）
                if (v.resultState != null) {
                    return resultStateMap[v.resultState] != null ? resultStateMap[v.resultState] : "";
                }
                return v.successFlag == 1 ? "成功" : "失败";
            }
        },
        { fieId: "sourceIp", name: "IP", prop: "sourceIp", clazz: "grey" },
        { fieId: "errorCode", name: "错误码", prop: "errorCode", clazz: "red" },
        { fieId: "errorMsg", name: "错误信息", prop: "errorMsg", clazz: "red" },
        { fieId: "traceId", name: "追踪ID", prop: "traceId", clazz: "grey" }
    ];

    seacher.line("loginTime", lineprops, []).render();

    // 导出按钮
    com.focusPage('#export', '#pagenation').on("click", function() {

        var total = com.focusPage('span[name="totalRecords"]', "#pagenation").text();

        if (total == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (total > 2000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 导出失败");
            return false;
        }

        com.post(api.log.pageLoginLog, $.extend({}, params[history], {
            "paging.noPage": 1
        }), function(res) {

            $.exceler({
                column: [
                    ['登录时间', 'loginTime'],
                    ['账号', 'loginId'],
                    ['登录方式', 'operateType'],
                    ['结果', 'resultState'],
                    ['IP', 'sourceIp'],
                    ['错误码', 'errorCode'],
                    ['错误信息', 'errorMsg'],
                    ['追踪ID', 'traceId']
                ],
                list: res.paging.data
            }, function(v) {
                v.operateType = operateTypeMap[v.operateType] != null ? operateTypeMap[v.operateType] : (v.operateType || "");
                if (v.resultState != null) {
                    v.resultState = resultStateMap[v.resultState] != null ? resultStateMap[v.resultState] : "";
                } else {
                    v.resultState = v.successFlag == 1 ? "成功" : "失败";
                }
                v.errorCode = v.errorCode == null ? "" : v.errorCode;
                v.errorMsg = v.errorMsg == null ? "" : v.errorMsg;
                v.traceId = v.traceId == null ? "" : v.traceId;
            });
        });
    });

});
