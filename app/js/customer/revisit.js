/** app/js/customer/revisit.js —— 客户回访（旧 revisit.js → layui）
 *  列表：pageRevisit（装修单号 eq / 类型 eq）→ 回访id/装修单号/类型/引用id/操作人/满意度/内容。
 *  添加：visitRevisit。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var state = { page: 1, rows: 10, total: 0, editIndex: null };

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'decoration', title: '装修单号', width: 130, templet: function (d) { return d.decoration ? (d.decoration.orderId || '') : ''; } },
            { field: 'rid', title: '回访id', width: 90 },
            { field: 'type', title: '类型', width: 90, templet: function (d) { return E.revisitType[d.type] != null ? E.revisitType[d.type] : ''; } },
            { field: 'ident', title: '引用id', width: 90 },
            { field: 'creater', title: '操作人', width: 110, templet: function (d) { return d.creater ? (d.creater.currentName || '') : ''; } },
            { field: 'createTime', title: '创建时间', width: 170 },
            { field: 'gladness', title: '满意度', width: 90, templet: function (d) { return E.revisitStatus[d.gladness] != null ? E.revisitStatus[d.gladness] : ''; } },
            { field: 'content', title: '内容', minWidth: 200 }
        ]]
    });

    function query(pg) {
        state.page = pg || 1;
        app.post(api.customer.pageRevisit, $.extend({}, customerCommon.buildFilters($('#searchForm')), {
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
    query(1);

    $('#btnAdd').on('click', function () {
        app.clearValidator();
        $('#editForm')[0].reset();
        form.render('select');
        state.editIndex = layer.open({ type: 1, title: '添加回访', content: $('#editBox'), area: ['520px', 'auto'] });
    });
    $('#btnSave').on('click', function () {
        if (app.validate('editForm')) return;
        app.post(api.customer.visitRevisit, {
            'revisit.decoration.orderId': $('#editForm [name="decoration"]').val(),
            'revisit.type': $('#editForm [name="type"]').val(),
            'revisit.ident': $('#editForm [name="ident"]').val(),
            'revisit.gladness': $('#editForm [name="gladness"]').val(),
            'revisit.content': $('#editForm [name="content"]').val()
        }, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(state.editIndex);
            state.editIndex = null;
            query(state.page);
        });
    });
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
});
}); // end app.ready
