/**
 * app/js/log/actionLog.js —— 操作日志查询页（只读，含"含历史"开关）
 *
 * 列：createTime createUserName actionName moduleId operateType resultState
 *     businessId ip runTime errorCode errorMsg traceId
 * 特性：含历史开关切换 pageActionLog / pageActionLogWithHistory
 *       开启时提示用户：必须填操作时间区间、归档表不支持按姓名过滤、单次最多12个月
 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'jquery'], function () {
    var table = layui.table;
    var laypage = layui.laypage;
    var form = layui.form;
    var $ = layui.jquery;

    var RESULT_MAP = { 0: '成功', 1: '失败', 2: '异常' };
    var state = { page: 1, rows: 10, total: 0, includeHistory: false };
    var lastFilters = {}; // 记录最近一次查询条件，导出/含历史切换时复用

    logCommon.renderDateRange('#createTime', 'createTime');
    initTable();
    query(1);

    function currentApi() {
        return state.includeHistory ? api.log.pageActionLogWithHistory : api.log.pageActionLog;
    }

    function initTable() {
        table.render({
            elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[
                { field: 'createTime', title: '操作时间', width: 170, templet: function (d) { return app.dateFormat(d.createTime); } },
                { field: 'createUserName', title: '操作人', width: 120 },
                { field: 'actionName', title: '接口', minWidth: 200 },
                { field: 'moduleId', title: '模块', width: 100 },
                { field: 'operateType', title: '类型', width: 90 },
                {
                    field: 'resultState', title: '结果', width: 90,
                    templet: function (d) {
                        var t = RESULT_MAP[d.resultState] != null ? RESULT_MAP[d.resultState] : '';
                        var cls = t === '成功' ? 'layui-bg-green' : '';
                        return '<span class="layui-badge ' + cls + '">' + t + '</span>';
                    }
                },
                { field: 'businessId', title: '业务对象', width: 110 },
                { field: 'ip', title: 'IP', width: 140 },
                { field: 'runTime', title: '耗时(ms)', width: 100 },
                { field: 'errorCode', title: '错误码', width: 100 },
                { field: 'errorMsg', title: '错误信息', minWidth: 180 },
                { field: 'traceId', title: '追踪ID', width: 160 }
                ]]
        });
    }

    function query(page) {
        state.page = page || 1;
        lastFilters = logCommon.buildFilters($('#searchForm'));
        app.post(currentApi(), $.extend({}, lastFilters, {
            'paging.page': state.page, 'paging.rows': state.rows
        }), function (res) {
            var pg = res.paging || {};
            table.reload('resultTable', { data: pg.data || [] });
            state.total = pg.totalRecords || 0;
            renderPage();
        });
    }

    function renderPage() {
        laypage.render({
            elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows,
            limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); }
        });
    }

    // 查询/重置
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });

    // 含历史开关
    $('#btnToggleHistory').on('click', function () {
        state.includeHistory = !state.includeHistory;
        var $btn = $(this);
        if (state.includeHistory) {
            $btn.html('<i class="layui-icon layui-icon-time"></i>含历史:开').removeClass('layui-btn-warm').addClass('layui-btn-danger');
            app.showInfo('已开启历史查询', '将同时查询归档表数据。<br>注意：<br>1. 必须填写"操作时间"区间，否则只查热表；<br>2. 归档表不支持按"操作人姓名"过滤，请改用"操作人账号"；<br>3. 单次最多查询 12 个月的归档数据。');
        } else {
            $btn.html('<i class="layui-icon layui-icon-time"></i>含历史:关').removeClass('layui-btn-danger').addClass('layui-btn-warm');
        }
        query(1);
    });

    // 导出（导出当前页 CSV）
    $('#btnExport').on('click', function () {
        if (state.total === 0) { app.showAlert(app.warning, '请先查询出数据'); return; }
        logCommon.exportCSV('resultTable', '操作日志');
    });
});
}); // end app.ready
