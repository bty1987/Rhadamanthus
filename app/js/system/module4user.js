/** app/js/system/module4user.js —— 模块下人员列表（弹窗子页）
 * 父页 module4advance 通过 popup 打开，从 app.params.system.module.mid 取模块 id
 * 接口：pageUserByMid(module.mid, paging, filters)
 * filter 字段：userId/userName/roleId/phone */
app.ready(function () {
layui.use(['table', 'laypage', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, $ = layui.jquery;
    var state = { mid: null, page: 1, rows: 10, total: 0 };

    state.mid = (app.params.system && app.params.system.module && app.params.system.module.mid) || getUrlMid();
    function getUrlMid() { var m = location.search.match(/[?&]mid=([^&]+)/); return m ? m[1] : null; }

    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'userId', title: '员工编号', width: 110 },
                { field: 'loginId', title: '用户名', width: 130 },
                { field: 'userName', title: '姓名', width: 110 },
                { field: 'dept', title: '部门', width: 130, templet: function (d) { return d.dept ? d.dept.name : ''; } },
                { field: 'duty', title: '职位', width: 130, templet: function (d) { return d.duty ? d.duty.name : ''; } },
                { field: 'role', title: '角色', width: 130, templet: function (d) { return d.role ? d.role.name : ''; } },
                { field: 'phone', title: '联系方式', width: 140 } ]] });
    }

    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        if (!state.mid) { app.showAlert(app.warning, '缺少模块参数'); return; }
        app.post(api.personel.pageUserByMid, $.extend({}, buildFilters(), { 'module.mid': state.mid, 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage();
        });
    }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }

    $('#btnSearch').on('click', function () { query(1); });
});
}); // end app.ready
