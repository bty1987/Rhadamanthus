/** app/js/production/outsourceItem.js —— 外协项（弹窗子页：分页列表 + 添加）
 * 上下文：app.params.outsourceItem = {oid, outsourceStatus, productionStatus}
 * 列表 pageOutsourceItemByOid；名称 typeahead queryQuoteItemByPinyin；添加 addOutsourceItem；删除 deleteOutsourceItem。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, $ = layui.jquery;
    var ctx = (window.parent && window.parent.app && window.parent.app.params.outsourceItem) || app.params.outsourceItem || {};
    var state = { page: 1, rows: 10, total: 0, editIndex: null };
    var canEdit = !(ctx.productionStatus == 3 || ctx.productionStatus == 4) && ctx.outsourceStatus == 0;
    if (!canEdit) $('#btnAdd').hide();
    initTable(); query();
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'name', title: '名称', minWidth: 160 },
                { field: 'height', title: '高', width: 70 }, { field: 'width', title: '宽', width: 70 }, { field: 'thick', title: '厚', width: 70 },
                { field: 'num', title: '数量', width: 80 }, { field: 'unitprice', title: '单价', width: 100, templet: function (d) { return app.formatMoney(d.unitprice); } },
                { field: 'total', title: '总价', width: 100, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'comment', title: '备注', minWidth: 120 },
                canEdit ? { title: '操作', width: 100, toolbar: '#rowToolbar' } : { title: '', width: 1 } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDel(obj.data); });
    }
    function query() {
        if (!ctx.oid) { app.showAlert(app.warning, '缺少外协单上下文'); return; }
        state.page = state.page || 1;
        app.post(api.production.pageOutsourceItemByOid, { 'paging.page': state.page, 'paging.rows': state.rows, 'outsourceItem.oid': ctx.oid }, function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) { state.page = o.curr; query(); } } }); }
    function doDel(v) {
        app.showConfirm('是否确认删除?', function () { app.post(api.production.deleteOutsourceItem, { 'outsourceItem.oiid': v.oiid }, function () { app.showAlert(app.success, '操作成功'); query(); }); });
    }
    function openAdd() {
        app.clearValidator(); $('#editForm')[0].reset();
        editIndex = layer.open({ type: 1, title: '添加外协项', content: $('#editBox'), area: ['560px', 'auto'] });
    }
    $('#editForm [name="name"]').on('blur', function () {
        var pinyin = $.trim($(this).val()); if (!pinyin) return;
        app.post(api.production.queryQuoteItemByPinyin, { 'quoteItem.pinyin': pinyin }, function (res) {
            var list = res.quoteItems || []; var v = list[0];
            if (v) {
                $('#editForm [name="name"]').val(v.name);
                $('#editForm [name="unitprice"]').val(v.unitprice);
                $('#editForm [name="width"]').val(0); $('#editForm [name="height"]').val(0); $('#editForm [name="thick"]').val(0);
                $('#editForm [name="num"]').val(1);
                calcTotal();
            }
        });
    });
    function calcTotal() {
        var up = parseFloat($('#editForm [name="unitprice"]').val()) || 0;
        var n = parseFloat($('#editForm [name="num"]').val()) || 0;
        $('#editForm [name="total"]').val(app.utils.accMul(up, n).toFixed(2));
    }
    $('#editForm').on('change', '[name="unitprice"],[name="num"]', calcTotal);
    function save() {
        if (app.validate('editForm')) return;
        var o = {
            'outsource.oid': ctx.oid,
            'outsourceItems[0].name': $('#editForm [name="name"]').val(),
            'outsourceItems[0].height': $('#editForm [name="height"]').val(),
            'outsourceItems[0].width': $('#editForm [name="width"]').val(),
            'outsourceItems[0].thick': $('#editForm [name="thick"]').val(),
            'outsourceItems[0].modelling': ' ',
            'outsourceItems[0].num': $('#editForm [name="num"]').val(),
            'outsourceItems[0].unitprice': $('#editForm [name="unitprice"]').val(),
            'outsourceItems[0].total': parseFloat($('#editForm [name="total"]').val()),
            'outsourceItems[0].comment': $('#editForm [name="comment"]').val()
        };
        app.post(api.production.addOutsourceItem, o, function () { app.showAlert(app.success, '添加成功'); layer.close(editIndex); editIndex = null; query(); });
    }
    $('#btnAdd').on('click', openAdd);
    $('#btnSave').on('click', save);
    $('#btnCancel').on('click', function () { layer.close(editIndex); editIndex = null; });
});
}); // end app.ready
