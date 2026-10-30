/** app/js/quotation/quotationCtem.js —— 报价常用
 *  列表：pageQuotationCtem；编辑：add/updateQuotationCtem；状态：updateQuotationCtemForStatus；
 *  弹窗：规格（quotationFormat.html）、工费（data/cormrice.html）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var state = { page: 1, rows: 10, total: 0, qcid: null };

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'name', title: '名称', minWidth: 220 },
            { title: '操作', width: 300, toolbar: '#rowToolbar' } ]] });

    function query(pg) {
        state.page = pg || 1;
        app.post(api.quotation.pageQuotationCtem, $.extend({}, quotationCommon.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30, 100], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function openEdit(v) {
        state.qcid = v ? v.qcid : null;
        $('#name').val(v ? v.name : '');
        layer.open({ type: 1, title: state.qcid ? '编辑报价常用' : '添加报价常用', content: $('#editBox'), area: ['440px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                if (!$.trim($('#name').val())) { app.showAlert(app.warning, '请填写名称'); return; }
                var url = api.quotation.addQuotationCtem;
                var options = { 'quotationCtem.name': $('#name').val() };
                if (state.qcid) { url = api.quotation.updateQuotationCtem; options['quotationCtem.qcid'] = state.qcid; }
                app.post(url, options, function () {
                    app.showAlert(app.info, '操作成功');
                    layer.close(idx); query(state.page);
                });
            } });
    }

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'edit') openEdit(v);
        else if (obj.event === 'format') {
            app.params.data = $.extend({}, app.params.data, { quotationCtem: v });
            app.popup('views/quotation/quotationFormat.html', '规格', null, { area: ['85%', '85%'] });
        } else if (obj.event === 'cormrice') {
            app.params.data = $.extend({}, app.params.data, { quotationCtem: v });
            app.popup('views/data/cormrice.html', '工费', null, { area: ['85%', '85%'] });
        } else if (obj.event === 'status') {
            app.post(api.quotation.updateQuotationCtemForStatus, { 'quotationCtem.qcid': v.qcid, 'quotationCtem.status': v.status == 0 ? 1 : 0 }, function () { query(state.page); });
        }
    });

    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    query(1);
});
}); // end app.ready
