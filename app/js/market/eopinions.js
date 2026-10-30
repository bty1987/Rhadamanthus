/** app/js/market/eopinions.js —— 客户口碑（列表 + 添加）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null };
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'comment', title: '口碑内容', minWidth: 300 },
                { field: 'createTime', title: '创建时间', width: 170, templet: function (d) { return app.dateFormat(d.createTime); } } ]] });
    }
    function query(page) {
        state.page = page || 1;
        app.post(api.market.pageEopinions, { 'paging.page': state.page, 'paging.rows': state.rows }, function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage();
        });
    }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function doSave() {
        if (app.validate('editForm')) return;
        app.post(api.market.addEopinion, { 'eopinion.comment': $('#editForm [name="comment"]').val() }, function () { app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnAdd').on('click', function () { app.clearValidator(); $('#editForm')[0].reset(); state.editIndex = layer.open({ type: 1, title: '添加口碑', content: $('#editBox'), area: ['480px', 'auto'] }); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
