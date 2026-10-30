/** app/js/quotation/ruotationIndex.js —— 软装报价列表
 *  配置：queryQuotationFunctionRight(depage,9) 驱动 apiPage/按钮；
 *  列表：pageRuotation（默认）；创建：装修单号 → queryQuotationByOrderId 选择报价 → addRuotation；
 *  查看：ruotationPart；删除 deleteRuotation。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var urlLoad = qc.ctx('urlLoadParams') || {};
    var pageConfig = qc.getPageConfig(urlLoad.depage, 9);
    if (!pageConfig.apiPage) pageConfig.apiPage = api.quotation.pageRuotation;
    var state = { page: 1, rows: 10, total: 0 };

    quotationCommon.dateRange('#createTime');
    function hasBtn(n) { return (pageConfig.pageBtn || []).indexOf(n) != -1; }

    var D = function (d, f) { return d.decoration ? d.decoration[f] : ''; };
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'decoration', title: '装修单号', width: 110, fixed: 'left', templet: function (d) { return D(d, 'orderId'); } },
            { field: 'village', title: '楼盘', width: 110, templet: function (d) { return d.decoration && d.decoration.house && d.decoration.house.village ? d.decoration.house.village.name : ''; } },
            { field: 'houseNumber', title: '楼号', width: 80, templet: function (d) { return d.decoration && d.decoration.house ? d.decoration.house.houseNumber : ''; } },
            { field: 'customer', title: '客户名', width: 90, templet: function (d) { return d.decoration && d.decoration.customer ? d.decoration.customer.name : ''; } },
            { field: 'designer', title: '设计师', width: 90, templet: function (d) { return d.decoration && d.decoration.designer ? d.decoration.designer.currentName : ''; } },
            { field: 'salesman', title: '业务员', width: 90, templet: function (d) { return d.decoration && d.decoration.salesman ? d.decoration.salesman.currentName : ''; } },
            { field: 'quotation', title: '报价单名称', width: 120, templet: function (d) { return d.quotation ? d.quotation.name : ''; } },
            { field: 'version', title: '报价版本', width: 100, templet: function (d) { return d.version ? d.version.name : ''; } },
            { field: 'creater', title: '创建人', width: 90, templet: function (d) { return d.creater ? d.creater.currentName : ''; } },
            { field: 'createTime', title: '创建时间', width: 160 },
            { field: 'totalPrice', title: '总额', width: 100, templet: function (d) { return qc.money(d.totalPrice); } },
            { field: 'content', title: '说明', minWidth: 130 },
            { title: '操作', width: 140, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    function query(pg) {
        state.page = pg || 1;
        var opts = $.extend({}, qc.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows });
        $.each(pageConfig.extraParam || [], function (i, v) { opts['statusas[' + i + ']'] = v; });
        app.post(pageConfig.apiPage, opts, function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'view' && hasBtn('view')) {
            app.params.quotation = $.extend({}, app.params.quotation, { ruotation: v, orderId: v.decoration ? v.decoration.orderId : '' });
            app.params.historyPage = api.index.ruotationIndex.url;
            app.switchPage(api.index.ruotationPartIndex.url);
        } else if (obj.event === 'del' && hasBtn('delete')) {
            app.post(api.quotation.deleteRuotation, { 'ruotation.qrid': v.qrid, 'ruotation.decoration.orderId': v.decoration.orderId }, function () { query(state.page); });
        }
    });

    // —— 创建（从装修单报价复制） ——
    $('#replicaOrderId').on('blur', function () {
        var orderId = $.trim($(this).val());
        if (orderId === '') return;
        app.post(api.quotation.queryQuotationByOrderId, { 'quotation.orderId': orderId }, function (res) {
            app.bindData($('#replicaQuotation'), res.quotations, 'qid', 'name', true);
            form.render('select');
        });
    });
    $('#btnCreate').on('click', function () {
        $('#editBox form')[0].reset();
        $('#replicaQuotation').html('');
        form.render('select');
        layer.open({ type: 1, title: '创建软装报价', content: $('#editBox'), area: ['520px', 'auto'],
            btn: ['创建', '取消'], yes: function (idx) {
                var orderId = $.trim($('#replicaOrderId').val());
                var qid = $('#replicaQuotation').val();
                if (orderId === '' || !qid) { app.showAlert(app.warning, '请填写装修单号并选择报价单'); return; }
                app.post(api.quotation.addRuotation, { 'ruotation.decoration.orderId': orderId, 'ruotation.quotation.qid': qid, 'ruotation.comment': $('#comment').val() }, function () {
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
