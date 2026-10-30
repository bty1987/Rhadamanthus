/** app/js/quotation/functionAreaItem.js —— 功能区-报价项分配
 *  已分配：queryFunctionAreaItemByFunctionAreaId（checkbox 勾选 deleteFunctionAreaItemByIds；
 *  上/下移 updateFunctionAreaItemForSort；公式 updateFunctionAreaItem）；
 *  添加：pageQuotationItemByVersionId 勾选 addFunctionAreaItem（排序递增）。
 *  上下文：app.params.data.functionArea（faid/version.no）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var dctx = qc.ctx('data') || {};
    var functionArea = dctx.functionArea || {};
    var faid = functionArea.faid;
    var versionNo = functionArea.version ? functionArea.version.no : '';
    var faiid = null;
    var itemState = { page: 1, rows: 10, total: 0 };
    var checkedIds = [];

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'checkbox', width: 40 },
            { type: 'numbers', title: '排序', width: 60, templet: function (d) { return d.LAY_INDEX; } },
            { field: 'quotationItem', title: '名称', width: 180, fixed: 'left', templet: function (d) { return d.quotationItem ? d.quotationItem.name : ''; } },
            { field: 'no', title: '编号', width: 100, templet: function (d) { return d.quotationItem ? d.quotationItem.no : ''; } },
            { field: 'classification', title: '分类', width: 90, templet: function (d) { return d.quotationItem && d.quotationItem.classification ? d.quotationItem.classification.name : ''; } },
            { field: 'bigCategory', title: '大类', width: 90, templet: function (d) { return d.quotationItem && d.quotationItem.bigCategory ? d.quotationItem.bigCategory.name : ''; } },
            { field: 'smallCategory', title: '小类', width: 90, templet: function (d) { return d.quotationItem && d.quotationItem.smallCategory ? d.quotationItem.smallCategory.name : ''; } },
            { field: 'unit', title: '单位', width: 70, templet: function (d) { return d.quotationItem && d.quotationItem.unit ? d.quotationItem.unit.name : ''; } },
            { field: 'workType', title: '工种', width: 90, templet: function (d) { return d.quotationItem && d.quotationItem.workType ? d.quotationItem.workType.name : ''; } },
            { field: 'unitPrice', title: '单价', width: 90, templet: function (d) { return d.quotationItem ? qc.money(d.quotationItem.unitPrice) : ''; } },
            { field: 'formula', title: '公式', width: 180, templet: function (d) { return qc.paramToFormula(d.formula); } },
            { field: 'sort', title: '排序', width: 70 },
            { title: '操作', width: 200, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    var lastData = [];
    function query() {
        app.post(api.quotation.queryFunctionAreaItemByFunctionAreaId, { 'functionAreaItem.functionArea.faid': faid }, function (res) {
            lastData = (res.functionAreaItems || []).sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); });
            table.reload('resultTable', { data: lastData });
        });
    }
    query();

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        var idx = lastData.indexOf(v);
        if (obj.event === 'update') {
            faiid = v.faiid;
            $('#formula').val(qc.paramToFormula(v.formula));
            layer.open({ type: 1, title: '更新公式 - ' + (v.quotationItem ? v.quotationItem.name : ''), content: $('#formulaBox'), area: ['600px', 'auto'],
                btn: ['更新', '取消'], yes: function (li) {
                    var formula = $('#formula').val() || '';
                    if (formula !== '' && qc.formulaInvalid(formula)) { app.showAlert(app.warning, '公式存在无效参数'); return; }
                    if (formula !== '' && qc.evals(qc.formulaToParam(formula))) { app.showAlert(app.warning, '公式运算结果失败'); return; }
                    app.post(api.quotation.updateFunctionAreaItem, { 'functionAreaItem.faiid': faiid, 'functionAreaItem.formula': qc.formulaToParam(formula) }, function () {
                        app.showAlert(app.info, '操作成功');
                        layer.close(li); query();
                    });
                } });
        } else if (obj.event === 'up' && idx > 0) {
            moveItem(v, lastData[idx - 1]);
        } else if (obj.event === 'down' && idx < lastData.length - 1) {
            moveItem(v, lastData[idx + 1]);
        }
    });
    function moveItem(a, b) {
        app.post(api.quotation.updateFunctionAreaItemForSort, {
            'functionAreaItems[0].faiid': a.faiid, 'functionAreaItems[0].sort': b.sort,
            'functionAreaItems[1].faiid': b.faiid, 'functionAreaItems[1].sort': a.sort
        }, function () { query(); });
    }

    $('#btnDel').on('click', function () {
        var cks = table.checkStatus('resultTable');
        if (!cks.data.length) return;
        app.showConfirm('是否确认删除报价项', function () {
            var ids = {};
            $.each(cks.data, function (i, v) { ids['ids[' + i + ']'] = v.faiid; });
            app.post(api.quotation.deleteFunctionAreaItemByIds, ids, function () {
                app.showAlert(app.info, '操作成功'); query();
            });
        });
    });

    // —— 添加报价项 ——
    table.render({ elem: '#itemTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'checkbox', width: 40 },
            { field: 'name', title: '名称', width: 170 },
            { field: 'category', title: '类型', width: 90, templet: function (d) { return d.category ? d.category.name : ''; } },
            { field: 'bigCategory', title: '大类', width: 90, templet: function (d) { return d.bigCategory ? d.bigCategory.name : ''; } },
            { field: 'smallCategory', title: '小类', width: 90, templet: function (d) { return d.smallCategory ? d.smallCategory.name : ''; } },
            { field: 'unit', title: '单位', width: 70, templet: function (d) { return d.unit ? d.unit.name : ''; } },
            { field: 'workType', title: '工种', width: 90, templet: function (d) { return d.workType ? d.workType.name : ''; } },
            { field: 'unitPrice', title: '单价', width: 90, templet: function (d) { return qc.money(d.unitPrice); } },
            { field: 'version', title: '版本', width: 100, templet: function (d) { return d.version ? d.version.name : ''; } } ]] });

    $('#btnAdd').on('click', function () {
        checkedIds = [];
        layer.open({ type: 1, title: '添加报价项（同版本）', content: $('#itemsBox'), area: ['950px', '80%'], success: function () { queryItem(1); } });
    });
    function queryItem(pg) {
        itemState.page = pg || 1;
        app.post(api.quotation.pageQuotationItemByVersionId, $.extend({ 'quotationItem.version.no': versionNo }, qc.buildFilters($('#itemForm')), { 'paging.page': itemState.page, 'paging.rows': itemState.rows }), function (res) {
            var p = res.paging || {};
            table.reload('itemTable', { data: p.data || [] });
            itemState.total = p.totalRecords || 0;
            laypage.render({ elem: 'itemPagenation', count: itemState.total, curr: itemState.page, limit: itemState.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next'], jump: function (o, f) { itemState.rows = o.limit; if (!f) queryItem(o.curr); } });
        });
    }
    $('#btnItemSearch').on('click', function () { queryItem(1); });
    $('#btnSaveItems').on('click', function () {
        var cks = table.checkStatus('itemTable');
        if (!cks.data.length) { app.showAlert(app.warning, '请选择要添加的报价项'); return; }
        var _params = { 'functionArea.faid': faid };
        $.each(cks.data, function (i, v) {
            _params['functionAreaItems[' + i + '].quotationItem.qiid'] = v.qiid;
            _params['functionAreaItems[' + i + '].sort'] = lastData.length + i + 1;
        });
        app.post(api.quotation.addFunctionAreaItem, _params, function () {
            app.showAlert(app.info, '操作成功');
            layer.closeAll(); query();
        });
    });
});
}); // end app.ready
