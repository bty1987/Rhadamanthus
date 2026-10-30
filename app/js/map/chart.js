/** app/js/map/chart.js —— 图表配置清单
 * 原 WebContent/views/map/chart.js：
 *   1) POST queryChart.do 取图表配置（cid/name/method/param）
 *   2) 逐个把配置 + 硬编码 authentication 提交到 http://192.168.5.22/library 内网渲染服务取 echarts option，
 *      并按 method（attendance/number/table）做本地后处理
 * 内网 library 服务已下线（硬编码 IP + 令牌，不可达），步骤 2 无从恢复——
 * 新页面保留步骤 1 的配置清单表格，图表画布以占位说明代替。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;

    // 原 chart.js 仅渲染 arr1 清单内的图表（cid 白名单）
    var RENDER_CID_WHITELIST = [7, 16, 17, 18, 19, 20, 21, 22, 23, 24];

    // method 前缀 → 展示类型（对应原 methods 注册表 attendance/number/table）
    function methodType(method) {
        if (!method) return '-';
        if (method.indexOf('attendance') > -1) return '考勤热力';
        if (method.indexOf('number') > -1) return '数字看板';
        if (method.indexOf('table') > -1) return '表格列表';
        return method;
    }

    $('#btnSearch').on('click', query);
    $('#btnRefresh').on('click', query);

    function query() {
        app.post(api.data.queryChart, {
            'chart.type': '',
            'chart.level': ''
        }, function (res) {
            renderTable(res.charts || []);
        }, function () {
            renderTable([]);
            app.showAlert(app.error, '图表配置查询失败');
        });
    }

    function renderTable(charts) {
        var list = [];
        $.each(charts, function (i, v) {
            list.push({
                cid: v.cid,
                name: v.name,
                method: v.method,
                type: methodType(v.method),
                renderable: RENDER_CID_WHITELIST.indexOf(v.cid) > -1 ? '是' : '否',
                param: v.param
            });
        });
        table.render({
            elem: '#chartTable',
            data: list,
            page: { layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], limits: [10, 30] },
            cols: [[
                { field: 'cid', title: 'CID', width: 80, sort: true },
                { field: 'name', title: '名称', width: 180 },
                { field: 'method', title: '渲染方法', width: 200 },
                { field: 'type', title: '展示类型', width: 110 },
                { field: 'renderable', title: '原页可见', width: 100 },
                { field: 'param', title: '参数', minWidth: 240 }
            ]]
        });
    }

    query();
});
});
