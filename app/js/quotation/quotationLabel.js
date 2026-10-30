/** app/js/quotation/quotationLabel.js —— 报价标签（pageQuotationLabel / add / update / delete） */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var state = { page: 1, rows: 10, total: 0, qlid: null };

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'name', title: '名称', minWidth: 240 },
            { title: '操作', width: 160, toolbar: '#rowToolbar' } ]] });

    function query(pg) {
        state.page = pg || 1;
        app.post(api.quotation.pageQuotationLabel, $.extend({}, quotationCommon.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30, 100], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function openEdit(v) {
        state.qlid = v ? v.qlid : null;
        $('#name').val(v ? v.name : '');
        layer.open({ type: 1, title: state.qlid ? '编辑标签' : '添加标签', content: $('#editBox'), area: ['440px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                if (!$.trim($('#name').val())) { app.showAlert(app.warning, '请填写名称'); return; }
                var url = api.quotation.addQuotationLabel;
                var options = { 'quotationLabel.name': $('#name').val() };
                if (state.qlid) { url = api.quotation.updateQuotationLabel; options['quotationLabel.qlid'] = state.qlid; }
                app.post(url, options, function () {
                    layer.close(idx); query(state.page);
                });
            } });
    }

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'edit') openEdit(v);
        else if (obj.event === 'del') {
            app.showConfirm('确定删除当前标签吗?', function () {
                app.post(api.quotation.deleteQuotationLabel, { 'quotationLabel.qlid': v.qlid }, function () {
                    app.showAlert(app.info, '删除成功.');
                    query(state.page);
                });
            });
        }
    });

    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    query(1);
});
}); // end app.ready
