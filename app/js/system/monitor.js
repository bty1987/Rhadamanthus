/** app/js/system/monitor.js —— 服务监控（只读概览）
 * 旧版 monitor 为移动端 MSUI 占位页（无真实业务 JS）。
 * 这里改为桌面 layui 只读页：调用 queryServer（communion）展示服务节点列表。
 * 字段依据后端 ServerVO：name/host/port/type/status 等 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;

    initTable(); query();

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '名称', minWidth: 160 },
                { field: 'host', title: '主机', minWidth: 160 },
                { field: 'port', title: '端口', width: 100 },
                { field: 'type', title: '类型', width: 100 },
                { field: 'status', title: '状态', width: 100, templet: function (d) {
                    return d.status == 0 ? '<span class="layui-badge layui-bg-green">正常<\/span>' : '<span class="layui-badge">异常<\/span>';
                } } ]] });
    }

    function query() {
        app.post(api.system.queryServer, {}, function (res) {
            var rows = res.servers || [];
            table.reload('resultTable', { data: rows });
            if (!rows.length) app.showAlert(app.warning, '暂无服务监控数据');
        });
    }

    $('#btnRefresh').on('click', query);
});
}); // end app.ready
