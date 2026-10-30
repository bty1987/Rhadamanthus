/** app/js/quotation/quotationProfile.js —— 报价画像调研
 *  列表：pageQuotationProfile（名称/状态）；创建 makeQuotationProfile（装修单号 + 调研模板 tid）；
 *  详情：弹窗 quotationProfile4detail（传 qpid/qid/orderId/type）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var state = { page: 1, rows: 10, total: 0 };

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'name', title: '调研名称', width: 180, fixed: 'left' },
            { field: 'orderId', title: '装修单号', width: 110 },
            { field: 'creater', title: '创建人', width: 100, templet: function (d) { return d.creater ? d.creater.currentName : ''; } },
            { field: 'createTime', title: '创建时间', width: 165 },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return qc.badge({ 0: '初始', 1: '启用' }, d.status); } },
            { field: 'type', title: '用途', width: 90, templet: function (d) { return qc.badge(qc.ENUM.quotationProfileType, d.type); } },
            { title: '操作', width: 90, toolbar: '#rowToolbar' } ]] });

    function query(pg) {
        state.page = pg || 1;
        app.post(api.quotation.pageQuotationProfile, $.extend({}, qc.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30, 100], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'detail') {
            var v = obj.data;
            app.params.quotation = $.extend({}, app.params.quotation, { v: v, qpid: v.qpid, qid: v.qid, orderId: v.orderId, type: v.type });
            app.popup(api.index.quotationProfile4detailIndex.url, '报价配置: ' + v.name, null, { area: ['85%', '85%'] });
        }
    });

    $('#btnMake').on('click', function () {
        $('#editBox form')[0].reset();
        layer.open({ type: 1, title: '创建画像调研', content: $('#editBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                if (!$.trim($('#orderId').val())) { app.showAlert(app.warning, '请填写装修单号'); return; }
                if (!$('#surveyTemplate').val()) { app.showAlert(app.warning, '请填写调研模板编号'); return; }
                app.post(api.quotation.makeQuotationProfile, {
                    'quotationProfile.orderId': $.trim($('#orderId').val()),
                    'quotationProfile.tid': $('#surveyTemplate').val()
                }, function () {
                    app.showAlert(app.success, '创建成功');
                    layer.close(idx); query(1);
                });
            } });
    });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    query(1);
});
}); // end app.ready
