/**
 * 图纸下载日志页（Phase 7）
 *
 * 数据来源：log.decorationPictureLog 表（迁移自 decoration.decorationpicturerecord）
 * 查询条件：订单号、图纸ID、操作时间、操作人账号
 */
jQuery(function($) {

    var seacher = new Searcher();
    var history = "decorationLogPostData";

    seacher.base("condList", "pagenation", "resultList", api.log.pageDecorationLog);

    seacher.condition([
        "log-decorationLog-orderId",
        "log-decorationLog-dpId",
        "log-decorationLog-operateTime",
        "log-decorationLog-operateUserId"
    ]);

    seacher.button([]);

    seacher.history(history);

    var lineprops = [
        { fieId: "operateTime", name: "下载时间", prop: "operateTime", clazz: "green" },
        { fieId: "operateUserId", name: "操作人账号", prop: "operateUserId", clazz: "grey" },
        { fieId: "operateUserName", name: "操作人姓名", prop: "operateUserName", clazz: "blue" },
        { fieId: "orderId", name: "订单号", prop: "orderId", clazz: "grey" },
        { fieId: "dpId", name: "图纸ID", prop: "dpId", clazz: "grey" },
        { fieId: "ip", name: "来源IP", prop: "ip", clazz: "grey" }
    ];

    seacher.line("operateTime", lineprops, []).render();
});
