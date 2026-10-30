/** app/js/system/password2reset.js —— 重置用户密码
 * 管理员在用户列表中点"重置密码" → resetPassword.do（communion，无 MD5，后端置为默认密码）
 * filter 字段：userId/userName */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };

    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'userId', title: '员工编号', width: 110 },
                { field: 'loginId', title: '用户名', width: 130 },
                { field: 'userName', title: '姓名', width: 110 },
                { field: 'dept', title: '部门', width: 130, templet: function (d) { return d.dept ? d.dept.name : ''; } },
                { field: 'duty', title: '职位', width: 130, templet: function (d) { return d.duty ? d.duty.name : ''; } },
                { field: 'role', title: '角色', width: 130, templet: function (d) { return d.role ? d.role.name : ''; } },
                { field: 'phone', title: '电话', width: 140 },
                { title: '操作', width: 120, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'reset') doReset(obj.data); });
    }

    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) { state.page = page || 1; app.post(api.personel.pageUser, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }

    function doReset(d) {
        app.showConfirm('是否确定重置「' + (d.userName || d.userId) + '」的密码？', function () {
            app.post(api.personel.resetPassword, { 'user.userId': d.userId }, function () {
                app.showAlert(app.success, '密码已重置为默认密码');
            });
        });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
});
}); // end app.ready
