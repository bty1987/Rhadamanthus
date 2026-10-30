/** app/js/quotation/presignProduce.js —— 预签产品
 *  列表：pagePresignProduce（名称/状态，金额 tranargs ÷1000）；
 *  编辑：add/updatePresignProduce（预签公式 {a}起报价~{k}活动优惠 校验）；
 *  弹窗：预签项 presignItem / 预签价格 presignPrice / 预签成本 presignCost；状态 updatePresignProduceForStatus。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var state = { page: 1, rows: 10, total: 0, ppid: null };

    app.post(api.quotation.queryQuotationVersion, {}, function (res) {
        app.bindData($('#version'), res.quotationVersions, 'qvId', 'name', '无');
        form.render('select');
    }, null, false);

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'name', title: '名称', width: 140, fixed: 'left' },
            { field: 'version', title: '版本', width: 100, templet: function (d) { return d.version && d.version.qvId ? d.version.name : '无'; } },
            { field: 'quotePrice', title: '起报价', width: 90, templet: function (d) { return qc.money(d.quotePrice); } },
            { field: 'discount', title: '折扣', width: 70 },
            { field: 'discountt', title: '二级折扣', width: 85 },
            { field: 'manageRate', title: '管理费比例', width: 95 },
            { field: 'manageFormula', title: '管理费公式', width: 160, templet: function (d) { return qc.presignParamToFormula(d.manageFormula); } },
            { field: 'manageDiscount', title: '管理费折扣', width: 95 },
            { field: 'manageDiscountt', title: '二级管理费折扣', width: 120, templet: function (d) { return d.manageDiscountt != null ? d.manageDiscountt : ''; } },
            { field: 'taxRate', title: '税金比例', width: 90 },
            { field: 'taxFormula', title: '税金公式', width: 160, templet: function (d) { return qc.presignParamToFormula(d.taxFormula); } },
            { field: 'costPrice', title: '成本单价', width: 90, templet: function (d) { return qc.money(d.costPrice); } },
            { field: 'mostPrice', title: '主材成本', width: 90, templet: function (d) { return qc.money(d.mostPrice); } },
            { field: 'profitRate', title: '利润率', width: 80 },
            { field: 'costRate', title: '工程增项成本比例', width: 130 },
            { field: 'mostRate', title: '主材增项成本比例', width: 130 },
            { field: 'activityPrice', title: '浮动额', width: 90, templet: function (d) { return qc.money(d.activityPrice); } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return qc.badge({ 0: '初始', 1: '发布' }, d.status); } },
            { title: '操作', width: 320, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    function query(pg) {
        state.page = pg || 1;
        app.post(api.quotation.pagePresignProduce, $.extend({}, qc.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30, 100], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function openEdit(v) {
        state.ppid = v ? v.ppid : null;
        $('#editBox form')[0].reset();
        if (v) {
            $('#name').val(v.name); $('#quotePrice').val(v.quotePrice); $('#costPrice').val(v.costPrice);
            $('#discount').val(v.discount); $('#discountt').val(v.discountt); $('#manageRate').val(v.manageRate);
            $('#profitRate').val(v.profitRate); $('#offset').val(v.offset); $('#mostPrice').val(v.mostPrice);
            $('#costRate').val(v.costRate); $('#mostRate').val(v.mostRate);
            $('#manageFormula').val(v.manageFormula ? qc.presignParamToFormula(v.manageFormula) : '');
            $('#manageDiscount').val(v.manageDiscount); $('#manageDiscountt').val(v.manageDiscountt);
            $('#taxRate').val(v.taxRate);
            $('#taxFormula').val(v.taxFormula ? qc.presignParamToFormula(v.taxFormula) : '');
            $('#activityPrice').val(v.activityPrice);
            if (v.version && v.version.qvId) $('#version').val(v.version.qvId);
        }
        form.render(null, 'editForm');
        layer.open({ type: 1, title: state.ppid ? '编辑预签产品' : '创建预签产品', content: $('#editBox'), area: ['640px', '80%'],
            btn: ['保存', '取消'], yes: function (idx) {
                if (!$.trim($('#name').val())) { app.showAlert(app.warning, '请填写名称'); return; }
                var manageFormula = $('#manageFormula').val() || '';
                var taxFormula = $('#taxFormula').val() || '';
                if (qc.presignFormulaInvalid(manageFormula)) { app.showAlert(app.warning, '管理费公式存在无效参数'); return; }
                if (qc.presignEvals(qc.presignFormulaToParam(manageFormula))) { app.showAlert(app.warning, '管理费公式运算结果失败'); return; }
                if (qc.presignFormulaInvalid(taxFormula)) { app.showAlert(app.warning, '税金公式存在无效参数'); return; }
                if (qc.presignEvals(qc.presignFormulaToParam(taxFormula))) { app.showAlert(app.warning, '税金公式运算结果失败'); return; }
                var url = api.quotation.addPresignProduce;
                var options = {
                    'presignProduce.name': $('#name').val(),
                    'presignProduce.quotePrice': $('#quotePrice').val(),
                    'presignProduce.discount': $('#discount').val(),
                    'presignProduce.discountt': $('#discountt').val(),
                    'presignProduce.manageRate': $('#manageRate').val(),
                    'presignProduce.costPrice': $('#costPrice').val(),
                    'presignProduce.profitRate': $('#profitRate').val(),
                    'presignProduce.offset': $('#offset').val(),
                    'presignProduce.mostPrice': $('#mostPrice').val(),
                    'presignProduce.costRate': $('#costRate').val(),
                    'presignProduce.mostRate': $('#mostRate').val(),
                    'presignProduce.manageFormula': qc.presignFormulaToParam(manageFormula),
                    'presignProduce.manageDiscount': $('#manageDiscount').val(),
                    'presignProduce.manageDiscountt': $('#manageDiscountt').val(),
                    'presignProduce.taxRate': $('#taxRate').val(),
                    'presignProduce.taxFormula': qc.presignFormulaToParam(taxFormula),
                    'presignProduce.activityPrice': $('#activityPrice').val()
                };
                if ($('#version').val()) options['presignProduce.version.qvId'] = $('#version').val();
                if (state.ppid) { url = api.quotation.updatePresignProduce; options['presignProduce.ppid'] = state.ppid; }
                app.post(url, options, function () {
                    layer.close(idx); query(state.page);
                });
            } });
    }

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'edit') openEdit(v);
        else if (obj.event === 'item') {
            app.params.data = $.extend({}, app.params.data, { presignProduce: v });
            app.params.urlLoadParams = $.extend({}, app.params.urlLoadParams, { pageType: null });
            app.popup('views/quotation/presignItem.html', '预签项', null, { area: ['85%', '85%'] });
        } else if (obj.event === 'price') {
            app.params.data = $.extend({}, app.params.data, { presignProduce: v });
            app.popup('views/quotation/presignPrice.html', '预签价格', null, { area: ['85%', '85%'] });
        } else if (obj.event === 'cost') {
            app.params.data = $.extend({}, app.params.data, { presignProduce: v });
            app.popup('views/quotation/presignCost.html', '预签成本', null, { area: ['70%', '70%'] });
        } else if (obj.event === 'status') {
            app.post(api.quotation.updatePresignProduceForStatus, { 'presignProduce.ppid': v.ppid, 'presignProduce.status': v.status == 0 ? 1 : 0 }, function () { query(state.page); });
        }
    });

    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    query(1);
});
}); // end app.ready
