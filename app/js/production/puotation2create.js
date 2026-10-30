/** app/js/production/puotation2create.js —— 创建报价单（左侧填项 + 右侧累积列表，提交 addPuotation 批量）
 * 上下文：app.params.productionPuotationCreate = {pid, status, address}
 * 名称 typeahead：queryQuoteItemByPinyin；总价/面积自动算；提交 addPuotation。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var ctx = app.params.productionPuotationCreate || {};
    var rows = []; var curQuoteType = { qtid: null, name: '' };

    $('#headForm [name="orderAddr"]').val(ctx.address || '');
    initTable();
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 50 }, { field: 'name', title: '名称', minWidth: 140 },
                { field: 'unitprice', title: '售价', width: 90 }, { field: 'num', title: '数量', width: 70 },
                { field: 'total', title: '总价', width: 90 }, { field: 'comment', title: '备注', width: 100 },
                { title: '操作', width: 90, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') { rows = rows.filter(function (r, i) { return i !== obj.data.__idx; }); renderTable(); recompute(); } });
    }
    function renderTable() { var data = rows.map(function (r, i) { return $.extend({ __idx: i }, r); }); table.reload('resultTable', { data: data }); }
    // 名称 typeahead
    $('#itemForm [name="name"]').on('blur', function () {
        var pinyin = $.trim($(this).val()); if (!pinyin) return;
        app.post(api.production.queryQuoteItemByPinyin, { 'quoteItem.pinyin': pinyin }, function (res) {
            var list = res.quoteItems || []; var v = list[0];
            if (v) {
                $('#itemForm [name="name"]').val(v.name).attr('data-name', v.name);
                $('#itemForm [name="unitprice"]').val(v.unitprice);
                $('#itemForm [name="brand"]').val(v.quoteType ? v.quoteType.name : '');
                curQuoteType.qtid = v.quoteType ? v.quoteType.qtid : null;
                curQuoteType.name = v.quoteType ? v.quoteType.name : '';
                $('#itemForm [name="format"]').val(v.format);
                $('#itemForm [name="measurementunit"]').val(v.measurementunit);
                $('#itemForm [name="num"]').val(1);
                calcTotal();
            }
        });
    });
    function calcTotal() {
        var up = parseFloat($('#itemForm [name="unitprice"]').val()) || 0;
        var n = parseFloat($('#itemForm [name="num"]').val()) || 0;
        $('#itemForm [name="total"]').val(app.utils.accMul(up, n).toFixed(2));
    }
    $('#itemForm').on('change', '[name="unitprice"],[name="num"]', calcTotal);
    function recompute() {
        var sum = 0; rows.forEach(function (r) { sum = app.utils.accAdd(sum, parseFloat(r.total) || 0); });
        $('#headForm [name="totals"]').val(sum.toFixed(2));
    }
    $('#btnAdd').on('click', function () {
        if (app.validate('itemForm')) return;
        calcTotal();
        rows.push({
            name: $('#itemForm [name="name"]').attr('data-name') || $('#itemForm [name="name"]').val(),
            quoteType: curQuoteType.qtid, measurementUnit: $('#itemForm [name="measurementunit"]').val(),
            format: $('#itemForm [name="format"]').val(), height: $('#itemForm [name="height"]').val(),
            width: $('#itemForm [name="width"]').val(), thick: $('#itemForm [name="thick"]').val(),
            unitprice: parseFloat($('#itemForm [name="unitprice"]').val()) || 0,
            num: parseFloat($('#itemForm [name="num"]').val()) || 0,
            total: parseFloat($('#itemForm [name="total"]').val()) || 0,
            comment: $('#itemForm [name="remark"]').val(), specil: $('#itemForm [name="specil"]').val()
        });
        renderTable(); recompute();
        // 清空左侧
        $('#itemForm')[0].reset();
        $('#itemForm [name="height"],#itemForm [name="width"],#itemForm [name="thick"]').val(0);
        $('#itemForm [name="num"]').val(1);
    });
    $('#btnRefresh').on('click', function () { $('#itemForm')[0].reset(); });
    $('#btnSubmit').on('click', function () {
        if (!rows.length) { app.showAlert(app.warning, '请先添加报价项'); return; }
        var opts = {
            'puotation.name': curQuoteType.name,
            'puotation.comment': $('#headForm [name="comment"]').val(),
            'puotation.pid': ctx.pid,
            'puotation.total': $('#headForm [name="totals"]').val()
        };
        rows.forEach(function (r, i) {
            opts['puotationItems[' + i + '].name'] = r.name;
            opts['puotationItems[' + i + '].quoteType'] = r.quoteType;
            opts['puotationItems[' + i + '].measurementUnit'] = r.measurementUnit;
            opts['puotationItems[' + i + '].unitPrice'] = r.unitprice;
            opts['puotationItems[' + i + '].format'] = r.format;
            opts['puotationItems[' + i + '].height'] = parseFloat(r.height) || 0;
            opts['puotationItems[' + i + '].width'] = parseFloat(r.width) || 0;
            opts['puotationItems[' + i + '].thick'] = parseFloat(r.thick) || 0;
            opts['puotationItems[' + i + '].specil'] = r.specil || '';
            opts['puotationItems[' + i + '].num'] = r.num;
            opts['puotationItems[' + i + '].total'] = r.total;
            opts['puotationItems[' + i + '].comment'] = r.comment;
        });
        app.post(api.production.addPuotation, opts, function () {
            app.showAlert(app.success, '报价添加成功');
            rows = []; renderTable(); recompute();
            app.switchPage(api.index.puotationIndex.url);
        });
    });
    $('#btnBack').on('click', function () { app.switchPage(api.index.puotationIndex.url); });
});
}); // end app.ready
