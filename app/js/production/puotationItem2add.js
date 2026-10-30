/** app/js/production/puotationItem2add.js —— 报价单添加子项（左侧填项 + 右侧累积，逐项提交 addPuotationItem）
 * 上下文：app.params.puotationItemAdd = {qid, discount, total, name, comment}
 * 名称 typeahead：queryQuoteItemByPinyin；提交时校验品牌一致后逐项 addPuotationItem。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var ctx = app.params.puotationItemAdd || {};
    var rows = []; var curQuoteType = { qtid: null, name: '' };

    $('#headForm [name="brands"]').val(ctx.name || '');
    $('#headForm [name="comment"]').val(ctx.comment || '');
    $('#headForm [name="discount"]').val(ctx.discount);
    $('#headForm [name="totals"]').val(ctx.total);

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
        var sum = parseFloat(ctx.total) || 0; var dis = parseFloat(ctx.discount) || 1;
        rows.forEach(function (r) { sum = app.utils.accAdd(sum, app.utils.accMul(parseFloat(r.total) || 0, dis)); });
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
            comment: $('#itemForm [name="remark"]').val(), specil: $('#itemForm [name="specil"]').val(),
            brandName: curQuoteType.name
        });
        renderTable(); recompute();
        $('#itemForm')[0].reset();
        $('#itemForm [name="height"],#itemForm [name="width"],#itemForm [name="thick"]').val(0);
        $('#itemForm [name="num"]').val(1);
    });
    $('#btnRefresh').on('click', function () { $('#itemForm')[0].reset(); });
    $('#btnSubmit').on('click', function () {
        if (!rows.length) { app.showAlert(app.warning, '请先添加报价项'); return; }
        // 校验品牌与原报价单一致
        var brand0 = ctx.name; var bad = null;
        rows.forEach(function (r, i) { if (r.brandName != brand0) bad = i + 1; });
        if (bad) { app.showAlert(app.warning, '报价项第' + bad + '项中类型与品牌不符,请检查'); return; }
        var i = 0;
        function next() {
            if (i >= rows.length) { app.showAlert(app.success, '报价项添加成功'); rows = []; renderTable(); app.switchPage(api.index.puotationIndex.url); return; }
            var r = rows[i];
            var opts = {
                'puotationItem.qid': ctx.qid, 'puotationItem.name': r.name,
                'puotationItem.quoteType': r.quoteType, 'puotationItem.measurementUnit': r.measurementUnit,
                'puotationItem.unitPrice': r.unitprice, 'puotationItem.format': r.format,
                'puotationItem.height': parseFloat(r.height) || 0, 'puotationItem.width': parseFloat(r.width) || 0,
                'puotationItem.thick': parseFloat(r.thick) || 0, 'puotationItem.specil': r.specil || '',
                'puotationItem.num': r.num, 'puotationItem.total': r.total, 'puotationItem.comment': r.comment
            };
            app.post(api.production.addPuotationItem, opts, function () { i++; next(); }, function () { app.showAlert(app.error, '第' + (i + 1) + '报价项添加失败'); });
        }
        next();
    });
    $('#btnBack').on('click', function () { app.switchPage(api.index.puotationIndex.url); });
});
}); // end app.ready
