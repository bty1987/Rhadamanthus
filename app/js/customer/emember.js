/** app/js/customer/emember.js —— 电子会员（旧 emember.js → layui）
 *  列表：pageEmember（no eq / phone eq 检索）；行操作：删除 deleteEmember。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    customerCommon.ensureApiStubs();
    var state = { page: 1, rows: 10, total: 0 };

    initTable();
    query(1);

    function initTable() {
        table.render({
            elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[
                { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '姓名', minWidth: 120, templet: function (d) { return (d.name || '') + ' ' + (d.phone || ''); } },
                { field: 'unionId', title: '微信号', minWidth: 200 },
                { field: 'no', title: '会员编号', width: 140 },
                { field: 'address', title: '地址', minWidth: 160 },
                { field: 'ticket', title: '票号', width: 120 },
                { field: 'registerTime', title: '注册时间', width: 170 },
                { title: '操作', width: 100, fixed: 'right', toolbar: '#rowToolbar' }
            ]]
        });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'del') {
                app.showConfirm('确认要删除当前表单吗?', function () {
                    app.post(api.customer.deleteEmember, { 'emember.emid': obj.data.emid }, function () {
                        app.showAlert(app.success, '删除成功');
                        query(state.page);
                    });
                });
            }
        });
        if (!$('#rowToolbar').length) {
            $('body').append(
                '<script type="text/html" id="rowToolbar">'
                + '<button class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del"><i class="layui-icon layui-icon-delete"></i>删除</button>'
                + '<\/script>'
            );
        }
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(api.customer.pageEmember, $.extend({}, customerCommon.buildFilters($('#searchForm')), {
            'paging.page': state.page,
            'paging.rows': state.rows
        }), function (res) {
            var p = res.paging || { data: [], totalRecords: 0, totalPage: 0 };
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            laypage.render({
                elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30],
                layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); }
            });
        });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
});
}); // end app.ready
