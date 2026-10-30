/** app/js/construction/workerSalary2print.js —— 工人工费表（打印）
 *  上下文：app.params.construction（工程单行数据，含 decoration）。
 *  枚举来自 api.ds.salary（status/type/oneType/twoType）；数据 queryWorkerSalaryByOrderId。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var construction = app.params.construction || {};
    var dec = construction.decoration || {};
    var nodeMap = constructionCommon.loadNodeMap();

    function nvl(v) { return v == null ? '' : v; }

    var salaryStatus = {}, type = {}, oneType = {}, twoType = {};

    app.post(api.ds.salary, {}, function (data) {
        $.each(data.status || [], function (i, v) { salaryStatus[v.key] = v.value; });
        $.each(data.type || [], function (i, v) { type[v.id] = v.name; });
        $.each(data.oneType || [], function (i, v) { oneType[v.id] = v.name; });
        $.each(data.SalaryTwoType || [], function (i, v) { twoType[v.key] = v.name; });
        render();
    }, null, false);

    function render() {
        var html = '<table class="print-table"><caption>工人工费表<\/caption>'
            + '<tr>'
            + '<td style="width:110px;">订单编号<\/td><td>' + nvl(dec.orderId) + '<\/td>'
            + '<td style="width:110px;">施工地址<\/td><td>' + nvl(dec.house && dec.house.village ? dec.house.village.name : '') + ' ' + nvl(dec.house ? dec.house.houseNumber : '') + '<\/td>'
            + '<\/tr><tr>'
            + '<td>交付监理<\/td><td>' + nvl(dec.supervisor ? dec.supervisor.userName : '') + '<\/td>'
            + '<td>房屋面积<\/td><td>' + nvl(dec.house ? dec.house.buildArea : '') + '<\/td>'
            + '<\/tr><tr>'
            + '<th>工人名<\/th><th>工种<\/th><th>工程节点<\/th><th>类型<\/th><th>一类<\/th><th>二类<\/th><th>状态<\/th><th>创建时间<\/th>'
            + '<\/tr>';

        app.post(api.salary.queryWorkerSalaryByOrderId, { 'workerSalary.decoration.orderId': dec.orderId }, function (res) {
            var rows = '';
            $.each(res.workerSalarys || [], function (i, v) {
                if (v.wsid == null) return;
                var projectName = constructionCommon.projectStatusName(nodeMap, v.cnid);
                rows += '<tr>'
                    + '<td>' + nvl(v.user ? v.user.currentName : '') + '<\/td>'
                    + '<td>' + nvl(v.user && v.user.duty ? v.user.duty.name : '') + '<\/td>'
                    + '<td>' + (projectName != '' ? projectName : nvl(v.cnid)) + '<\/td>'
                    + '<td>' + nvl(type[v.type]) + '<\/td>'
                    + '<td>' + nvl(oneType[v.onetype]) + '<\/td>'
                    + '<td>' + nvl(twoType[v.twotype]) + '<\/td>'
                    + '<td>' + nvl(salaryStatus[v.status]) + '<\/td>'
                    + '<td>' + nvl(v.createTime) + '<\/td>'
                    + '<\/tr>';
            });
            $('#reslist').html(html + rows + '<\/table>');
        }, null, false);
    }
});
}); // end app.ready
