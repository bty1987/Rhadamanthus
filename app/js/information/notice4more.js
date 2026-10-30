/** app/js/information/notice4more.js —— 公告查看（按类型查看更多）*/
app.ready(function () {
layui.use(['table', 'laypage', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };

    var TYPE_MAP = { 1: '公告', 2: '活动' };
    var PRIORITY_MAP = { 0: '普通', 1: '紧急' };
    var PUBLIC_MAP = { 0: '公开', 1: '不公开', 2: '部门' };
    function pubB(d) { return '<span class="layui-badge ' + (d.isPublic == 0 ? 'layui-bg-green' : d.isPublic == 2 ? 'layui-bg-blue' : 'layui-bg-gray') + '">' + (PUBLIC_MAP[d.isPublic] || '---') + '<\/span>'; }

    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'theme', title: '主题', minWidth: 200 },
                { field: 'creater', title: '发布人', width: 110, templet: function (d) { return d.creater ? d.creater.currentName : ''; } },
                { field: 'type', title: '类型', width: 90, templet: function (d) { return TYPE_MAP[d.type] || '---'; } },
                { field: 'priority', title: '优先级', width: 90, templet: function (d) { return PRIORITY_MAP[d.priority] || '普通'; } },
                { field: 'isPublic', title: '公开', width: 90, templet: pubB },
                { field: 'startTime', title: '开始时间', width: 160 },
                { field: 'endTime', title: '结束时间', width: 160 },
                { field: 'contents', title: '内容', minWidth: 200 },
                { field: 'fileName', title: '附件', width: 110, templet: function (d) { return d.fileName || '无'; } },
                { title: '操作', width: 110, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'download' && obj.data.filePath) window.open(app.config.media + obj.data.filePath); });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        var noticeType = ''; try { noticeType = (parent && parent.params) ? parent.params['notice.type'] : ''; } catch (e) {}
        var params = $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows });
        if (noticeType) params['notice.type'] = noticeType;
        app.post(api.information.pageNoticeForSeenByType, params, function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); });
    }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    $('#btnSearch').on('click', function () { query(1); });
});
}); // end app.ready
