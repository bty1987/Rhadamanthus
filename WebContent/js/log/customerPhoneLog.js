/**
 * 客户电话查询日志页（Phase 7）
 *
 * 数据来源：log.customerPhoneLog 表（迁移自 communion.customerrecord）
 * 查询条件：客户ID、操作时间、操作人账号
 */
jQuery(function($) {

    var seacher = new Searcher();
    var history = "customerPhoneLogPostData";

    seacher.base("condList", "pagenation", "resultList", api.log.pageCustomerPhoneLog);

    seacher.condition([
        "log-customerPhoneLog-cid",
        "log-customerPhoneLog-operateTime",
        "log-customerPhoneLog-operateUserId"
    ]);

    seacher.button([]);

    seacher.history(history);

    var lineprops = [
        { fieId: "operateTime", name: "查询时间", prop: "operateTime", clazz: "green" },
        { fieId: "operateUserId", name: "操作人账号", prop: "operateUserId", clazz: "grey" },
        { fieId: "operateUserName", name: "操作人姓名", prop: "operateUserName", clazz: "blue" },
        { fieId: "cid", name: "客户ID", prop: "cid", clazz: "grey" },
        { fieId: "cpid", name: "电话ID", prop: "cpid", clazz: "grey" },
        { fieId: "comment", name: "备注", prop: "comment", clazz: "grey" },
        { fieId: "ip", name: "来源IP", prop: "ip", clazz: "grey" }
    ];

    seacher.line("operateTime", lineprops, []).render();
});
