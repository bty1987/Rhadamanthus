/** app/js/quotation/quotetionIndex.js —— 预报列表（quotetion 并行模块）
 *  配置：queryQuotationFunctionRight(depage,5)；默认 queryQuotetion；
 *  创建 addQuotetion（版本+装修单号）；复制：行内 copyQuotetion / 工具栏 cloneQuotetion、replicaQuotetion；
 *  查看（quotetionPart）、修改 updateQuotetion、删除 deleteQuotetion、对比（quotetionCompare）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var urlLoad = qc.ctx('urlLoadParams') || {};
    var pageConfig = qc.getPageConfig(urlLoad.depage, 5);
    if (!pageConfig.apiPage) pageConfig.apiPage = api.quotation.queryQuotetion;
    var state = { page: 1, rows: 10, total: 0 };
    function hasBtn(n) { return (pageConfig.pageBtn || []).indexOf(n) != -1; }

    app.post(api.quotation.queryQuotationVersion, {}, function (res) {
        app.bindData($('#quotationVersion'), res.quotationVersions, 'qvId', 'name', true);
        form.render('select');
    }, null, false);

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'decoration', title: '装修单号', width: 110, fixed: 'left', templet: function (d) { return d.decoration ? d.decoration.orderId : ''; } },
            { field: 'no', title: '编号', width: 110 },
            { field: 'name', title: '名称', width: 130 },
            { field: 'createTime', title: '创建时间', width: 160 },
            { field: 'auditTime', title: '保价时间', width: 160 },
            { field: 'totalPrice', title: '总价', width: 100, templet: function (d) { return qc.money(d.totalPrice); } },
            { field: 'comment', title: '备注', minWidth: 130 },
            { title: '操作', width: 240, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    function query(pg) {
        state.page = pg || 1;
        var opts = $.extend({}, qc.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows });
        $.each(pageConfig.extraParam || [], function (i, v) { opts['statusas[' + i + ']'] = v; });
        app.post(pageConfig.apiPage, opts, function (res) {
            var p = res.paging || res;
            var data = p.data || res.quotetions || [];
            table.reload('resultTable', { data: data });
            state.total = p.totalRecords || data.length;
            rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'view' && hasBtn('view')) {
            app.params.quotation = $.extend({}, app.params.quotation, { quotetion: v, orderId: v.decoration ? v.decoration.orderId : '' });
            app.params.historyPage = api.index.quotetionIndex.url;
            app.switchPage(api.index.quotetionPartIndex.url);
        } else if (obj.event === 'edit' && hasBtn('update')) {
            $('#orderIdInput').val(v.decoration ? v.decoration.orderId : '');
            $('#quotationVersion').val(v.version ? v.version.qvId : '');
            form.render('select');
            layer.open({ type: 1, title: '修改预报', content: $('#editBox'), area: ['480px', 'auto'],
                btn: ['保存', '取消'], yes: function (idx) {
                    app.post(api.quotation.updateQuotetion, { 'quotetion.qid': v.qid, 'quotetion.version.qvId': $('#quotationVersion').val() }, function () {
                        app.showAlert(app.info, '操作成功'); layer.close(idx); query(state.page);
                    });
                } });
        } else if (obj.event === 'del' && hasBtn('delete')) {
            app.showConfirm('确定要删除预报?', function () {
                app.post(api.quotation.deleteQuotetion, { 'quotetion.qid': v.qid }, function () { query(state.page); });
            });
        } else if (obj.event === 'copy' && hasBtn('copy')) {
            app.post(api.quotation.copyQuotetion, { 'quotetion.qid': v.qid }, function () {
                app.showAlert(app.info, '操作成功'); query(state.page);
            });
        }
    });

    // —— 创建 ——
    $('#btnCreate').on('click', function () {
        $('#editBox form')[0].reset();
        form.render('select');
        layer.open({ type: 1, title: '创建预报', content: $('#editBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                if (!$('#quotationVersion').val()) { app.showAlert(app.warning, '请选择版本'); return; }
                app.post(api.quotation.addQuotetion, { 'quotetion.version.qvId': $('#quotationVersion').val(), 'quotetion.orderId': $('#orderIdInput').val() }, function () {
                    app.showAlert(app.success, '创建成功'); layer.close(idx); query(1);
                });
            } });
    });

    // —— 复制（clone/replica） ——
    form.on('select(replicaTypeFilter)', function (obj) {
        $('#replicaNoGroup').toggle(obj.value == 0);
        $('#replicaOrderGroup, #replicaQuotationGroup').toggle(obj.value == 1);
    });
    $('#replicaType').attr('lay-filter', 'replicaTypeFilter');
    $('#replicaOrderId').on('blur', function () {
        var oid = $.trim($(this).val());
        if (oid === '') return;
        app.post(api.quotation.queryQuotationByOrderId, { 'quotation.orderId': oid }, function (res) {
            app.bindData($('#quotationSel'), res.quotations, 'qid', 'name', true);
            form.render('select');
        });
    });
    $('#btnReplica').on('click', function () {
        $('#replicaBox form')[0].reset();
        $('#replicaNoGroup').show(); $('#replicaOrderGroup, #replicaQuotationGroup').hide();
        form.render('select');
        layer.open({ type: 1, title: '复制预报', content: $('#replicaBox'), area: ['560px', 'auto'],
            btn: ['导入', '取消'], yes: function (idx) {
                var qt = $('#quotationTime').prop('checked'), qp = $('#quotationPrice').prop('checked');
                var keeprice = !qt && !qp ? 0 : qt && !qp ? 1 : !qt && qp ? 2 : 3;
                if ($('#replicaType').val() == 0) {
                    app.post(api.quotation.cloneQuotetion, { 'quotetion.no': $('#quotetionNo').val(), 'quotetion.keeprice': keeprice }, function () {
                        app.showAlert(app.info, '操作成功'); layer.close(idx); query(1);
                    });
                } else {
                    app.post(api.quotation.replicaQuotetion, { 'quotetion.qid': $('#quotationSel').val(), 'quotetion.keeprice': keeprice }, function () {
                        app.showAlert(app.info, '操作成功'); layer.close(idx); query(1);
                    });
                }
            } });
    });

    // —— 对比 ——
    $('#btnCompare').on('click', function () {
        app.params.historyPage = api.index.quotetionIndex.url;
        app.switchPage(api.index.quotetionCompareIndex.url);
    });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    query(1);
});
}); // end app.ready
