/** app/js/quotation/quotationRtem.js —— 关联报价项
 *  列表：queryQuotationRtem（source.qiid，双结果集 tranargs）；
 *  添加：addQuotationRtem（从同版本报价项中选择 target + 类型 + 公式）；删除 deleteQuotationRtem。
 *  上下文：app.params.data.quotationItem。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var dctx = qc.ctx('data') || {};
    var quotationItem = dctx.quotationItem || {};
    var targetId = null;
    var itemState = { page: 1, rows: 10, total: 0 };

    // 关联类型（constant.data.quotationRtem.type）
    app.bindData($('#type'), [{ key: 0, value: '增项' }, { key: 1, value: '减项' }], 'key', 'value', false);
    form.render('select');

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'target', title: '关联报价项', width: 180, templet: function (d) { return d.target ? d.target.name : ''; } },
            { field: 'type', title: '类型', width: 90, templet: function (d) { return { 0: '增项', 1: '减项' }[d.type] != null ? { 0: '增项', 1: '减项' }[d.type] : d.type; } },
            { field: 'formula', title: '公式', width: 200, templet: function (d) { return qc.paramToFormula(d.formula); } },
            { field: 'comment', title: '说明', minWidth: 160 },
            { title: '操作', width: 90, toolbar: '#rowToolbar' } ]] });

    function query() {
        app.post(api.quotation.queryQuotationRtem, { 'quotationRtem.source.qiid': quotationItem.qiid }, function (res) {
            table.reload('resultTable', { data: res.quotationRtems || [] });
        });
    }
    query();

    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'del') {
            app.post(api.quotation.deleteQuotationRtem, { 'quotationRtem.qrid': obj.data.qrid }, function () {
                app.showAlert(app.info, '操作成功'); query();
            });
        }
    });

    // —— 添加关联 ——
    $('#btnAdd').on('click', function () {
        targetId = null;
        $('#targetItem').val(''); $('#formula').val(''); $('#comment').val('');
        layer.open({ type: 1, title: '添加关联', content: $('#editBox'), area: ['600px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                if (targetId == null) { app.showAlert(app.warning, '未选择关联报价项'); return; }
                var formula = $('#formula').val() || '';
                if (formula !== '' && qc.formulaInvalid(formula)) { app.showAlert(app.warning, '公式存在无效参数'); return; }
                if (formula !== '' && qc.evals(qc.formulaToParam(formula))) { app.showAlert(app.warning, '公式运算结果失败'); return; }
                app.post(api.quotation.addQuotationRtem, {
                    'quotationRtem.source.qiid': quotationItem.qiid,
                    'quotationRtem.target.qiid': targetId,
                    'quotationRtem.type': $('#type').val(),
                    'quotationRtem.formula': qc.formulaToParam(formula),
                    'quotationRtem.comment': $('#comment').val()
                }, function () {
                    app.showAlert(app.info, '操作成功');
                    layer.close(idx); query();
                });
            } });
    });

    // —— 报价项选择弹窗 ——
    $('#btnPick').on('click', function () { openItemPick(); });
    $('#targetItem').on('click', function () { openItemPick(); });

    table.render({ elem: '#itemTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'name', title: '名称', width: 150 },
            { field: 'category', title: '类型', width: 90, templet: function (d) { return d.category ? d.category.name : ''; } },
            { field: 'bigCategory', title: '大类', width: 80, templet: function (d) { return d.bigCategory ? d.bigCategory.name : ''; } },
            { field: 'smallCategory', title: '小类', width: 80, templet: function (d) { return d.smallCategory ? d.smallCategory.name : ''; } },
            { field: 'unit', title: '单位', width: 60, templet: function (d) { return d.unit ? d.unit.name : ''; } },
            { field: 'workType', title: '工种', width: 70, templet: function (d) { return d.workType ? d.workType.name : ''; } },
            { field: 'unitPrice', title: '单价', width: 80, templet: function (d) { return qc.money(d.unitPrice); } },
            { field: 'version', title: '版本', width: 100, templet: function (d) { return d.version ? d.version.name : ''; } },
            { title: '操作', width: 80, toolbar: '#itemToolbar' } ]] });
    var pickLayer = null;
    function openItemPick() {
        pickLayer = layer.open({ type: 1, title: '选择报价项（同版本）', content: $('#itemsBox'), area: ['900px', '80%'], success: function () { queryItem(1); } });
    }
    table.on('tool(itemTable)', function (obj) {
        if (obj.event === 'pick') {
            var v = obj.data;
            $('#targetItem').val(v.name);
            targetId = v.qiid;
            layer.close(pickLayer);
        }
    });
    function queryItem(pg) {
        itemState.page = pg || 1;
        app.post(api.quotation.pageQuotationItemByVersionId, $.extend({ 'quotationItem.version.no': quotationItem.version ? quotationItem.version.no : '' }, qc.buildFilters($('#itemForm')), { 'paging.page': itemState.page, 'paging.rows': itemState.rows }), function (res) {
            var p = res.paging || {};
            table.reload('itemTable', { data: p.data || [] });
            itemState.total = p.totalRecords || 0;
            laypage.render({ elem: 'itemPagenation', count: itemState.total, curr: itemState.page, limit: itemState.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next'], jump: function (o, f) { itemState.rows = o.limit; if (!f) queryItem(o.curr); } });
        });
    }
    $('#btnItemSearch').on('click', function () { queryItem(1); });
});
}); // end app.ready
