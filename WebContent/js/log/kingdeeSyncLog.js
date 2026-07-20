/**
 * 金蝶同步日志页（Phase 7）
 *
 * 数据来源：log.kingdeeSyncLog 表（迁移自 platform.kingdeeRecord）
 * 查询条件：订单号、收据ID、创建时间、款项类型
 *
 * 注意：当前金蝶业务流程未写入此表（add 方法无人调用），本页面用于未来启用后的查询
 */
jQuery(function($) {

    // atttype 映射（与原 kingdeeRecord.js 保持一致）
    var atttypeMap = {0: "合同预付款", 1: "主材预付款"};

    var seacher = new Searcher();
    var history = "kingdeeSyncLogPostData";

    seacher.base("condList", "pagenation", "resultList", api.log.pageKingdeeSyncLog);

    seacher.condition([
        "log-kingdeeSyncLog-orderId",
        "log-kingdeeSyncLog-createTime",
        "log-kingdeeSyncLog-type"
    ]);

    seacher.button([]);

    seacher.history(history);

    var lineprops = [
        { fieId: "createTime", name: "同步时间", prop: "createTime", clazz: "green" },
        { fieId: "orderId", name: "订单号", prop: "orderId", clazz: "grey" },
        {
            fieId: "atttype", name: "属性类型", prop: "atttype", clazz: "grey",
            trans: function(v) {
                return atttypeMap[v.atttype] != null ? atttypeMap[v.atttype] : v.atttype;
            }
        },
        { fieId: "type", name: "款项类型", prop: "type", clazz: "grey" },
        { fieId: "rtid", name: "收据ID", prop: "rtid", clazz: "grey" },
        { fieId: "message", name: "同步结果", prop: "message", clazz: "red" },
        { fieId: "operateUserId", name: "操作人", prop: "operateUserId", clazz: "grey" }
    ];

    seacher.line("createTime", lineprops, []).render();
});
