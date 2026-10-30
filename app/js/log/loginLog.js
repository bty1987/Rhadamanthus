/**
 * app/js/log/loginLog.js —— 登录日志查询页（只读）
 * 字段：loginTime loginId operateType(登录方式) resultState successFlag sourceIp
 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'jquery'], function () {
    var table = layui.table;
    var laypage = layui.laypage;
    var form = layui.form;
    var $ = layui.jquery;

    var OPERATE_TYPE = { PASSWORD: '密码', AUTHCODE: '验证码', PHONE: '手机验证码', CHANGE: '切换公司', UPDATE: '刷新令牌' };

    var state = { page: 1, rows: 10, total: 0 };

    logCommon.renderDateRange('#loginTime', 'loginTime');
    initTable();
    query(1);

    function initTable() {
        table.render({
            elem: '#resultTable',
            data: [],
            page: false,
            limit: 1000,
            even: true,
            cols: [[
                { field: 'loginTime', title: '登录时间', width: 170, templet: function (d) { return app.dateFormat(d.loginTime); } },
                { field: 'loginId', title: '账号', width: 140 },
                { field: 'operateType', title: '登录方式', width: 110, templet: function (d) { return OPERATE_TYPE[d.operateType] || d.operateType || ''; } },
                {
                    field: 'resultState', title: '结果', width: 90,
                    templet: function (d) {
                        var txt = logCommon.resultStateText(d.resultState);
                        if (txt === '') txt = d.successFlag == 1 ? '成功' : '失败';
                        var color = txt === '成功' ? 'layui-bg-green' : '';
                        return '<span class="layui-badge ' + color + '">' + txt + '</span>';
                    }
                },
                { field: 'sourceIp', title: 'IP', width: 140 },
                { field: 'comment', title: '备注', minWidth: 160 }
                ]]
        });
    }

    function query(page) {
        state.page = page || 1;
        var params = $.extend({}, logCommon.buildFilters($('#searchForm')), {
            'paging.page': state.page,
            'paging.rows': state.rows
        });
        app.post(api.log.pageLoginLog, params, function (res) {
            var pg = res.paging || { data: [], totalRecords: 0, totalPage: 0 };
            table.reload('resultTable', { data: pg.data || [] });
            state.total = pg.totalRecords || 0;
            renderPage(Math.min(pg.totalPage || 0, 59));
        });
    }

    function renderPage(totalPage) {
        laypage.render({
            elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows,
            limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); }
        });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnExport').on('click', function () {
        if (state.total === 0) { app.showAlert(app.warning, '请先查询出数据'); return; }
        logCommon.exportCSV('resultTable', '登录日志');
    });
});
}); // end app.ready
