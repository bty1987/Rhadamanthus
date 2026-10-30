/** app/js/quotation/quotationPrice.js —— 报价项价格历史
 *  列表：pageQuotationPrice（qiid 取自 app.params.data.quotationItem）；
 *  编辑：add/updateQuotationPrice（价格 tranargs ×1000）；删除 deleteQuotationPrice。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var dctx = qc.ctx('data') || {};
    var quotationItem = dctx.quotationItem || {};
    var state = { page: 1, rows: 10, total: 0, qpid: null };

    layui.laydate.render({ elem: '#updateTime', type: 'date', format: 'yyyy-MM-dd' });
    quotationCommon.dateRange('#createTime');

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'quotationItem', title: '报价项名称', width: 180, templet: function (d) { return d.quotationItem ? d.quotationItem.name : ''; } },
            { field: 'addPrice', title: '增补价', width: 100, templet: function (d) { return qc.money(d.addPrice); } },
            { field: 'unitPrice', title: '单价', width: 100, templet: function (d) { return qc.money(d.unitPrice); } },
            { field: 'subPrice', title: '退减价', width: 100, templet: function (d) { return qc.money(d.subPrice); } },
            { field: 'createTime', title: '创建时间', width: 170 },
            { field: 'updateTime', title: '更新时间', width: 170 },
            { title: '操作', width: 140, toolbar: '#rowToolbar' } ]] });

    function query(pg) {
        state.page = pg || 1;
        app.post(api.quotation.pageQuotationPrice, $.extend({ 'quotationPrice.quotationItem.qiid': quotationItem.qiid }, qc.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30, 100], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function openEdit(v) {
        state.qpid = v ? v.qpid : null;
        $('#addPrice').val(v ? v.addPrice : '');
        $('#unitPrice').val(v ? v.unitPrice : '');
        $('#subPrice').val(v ? v.subPrice : '');
        $('#updateTime').val(v ? v.updateTime : '');
        layer.open({ type: 1, title: state.qpid ? '编辑价格' : '创建价格', content: $('#editBox'), area: ['460px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                var url = api.quotation.addQuotationPrice;
                var options = {
                    'quotationPrice.quotationItem.qiid': quotationItem.qiid,
                    'quotationPrice.addPrice': $('#addPrice').val(),
                    'quotationPrice.unitPrice': $('#unitPrice').val(),
                    'quotationPrice.subPrice': $('#subPrice').val()
                };
                if (state.qpid) { url = api.quotation.updateQuotationPrice; options['quotationPrice.qpid'] = state.qpid; }
                app.post(url, options, function () {
                    layer.close(idx); query(state.page);
                });
            } });
    }

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'edit') openEdit(v);
        else if (obj.event === 'del') {
            app.post(api.quotation.deleteQuotationPrice, { 'quotationPrice.qpid': v.qpid }, function () { query(state.page); });
        }
    });

    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    query(1);
});
}); // end app.ready
