/** app/js/production/hardwareItem.js —— 五金项（弹窗子页：分页列表 + 添加）
 * 上下文：app.params.hardwareItem = {hid, hardwareStatus, productionStatus}
 * 列表 pageHardwareItemByHid；名称 typeahead queryQuoteItemByPinyin；添加 addHardwareItem；删除 deleteHardwareItem。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, $ = layui.jquery;
    var ctx = (window.parent && window.parent.app && window.parent.app.params.hardwareItem) || app.params.hardwareItem || {};
    var state = { page: 1, rows: 10, total: 0, editIndex: null };
    var canEdit = !(ctx.productionStatus == 9 || ctx.productionStatus == 10) && !(ctx.hardwareStatus == 3 || ctx.hardwareStatus == 4);
    if (!canEdit) { $('#btnAdd').hide(); }
    initTable(); query();
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'name', title: '名称', minWidth: 160 }, { field: 'num', title: '数量', width: 90 },
                { field: 'measurementunit', title: '单位', width: 80 }, { field: 'unitprice', title: '单价', width: 100, templet: function (d) { return app.formatMoney(d.unitprice); } },
                { field: 'total', title: '总价', width: 110, templet: function (d) { return app.formatMoney(app.utils.accMul(d.unitprice, d.num)); } },
                { field: 'comment', title: '说明', minWidth: 140 },
                canEdit ? { title: '操作', width: 100, toolbar: '#rowToolbar' } : { title: '', width: 1 } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDel(obj.data); });
    }
    function query() {
        if (!ctx.hid) { app.showAlert(app.warning, '缺少五金单上下文'); return; }
        state.page = state.page || 1;
        app.post(api.production.pageHardwareItemByHid, { 'paging.page': state.page, 'paging.rows': state.rows, 'hardware.hid': ctx.hid }, function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) { state.page = o.curr; query(); } } }); }
    function doDel(v) {
        app.showConfirm('是否确认删除?', function () { app.post(api.production.deleteHardwareItem, { 'hardwareItem.hiid': v.hiid }, function () { app.showAlert(app.success, '删除成功'); query(); }); });
    }
    function openAdd() {
        app.clearValidator(); $('#editForm')[0].reset();
        editIndex = layer.open({ type: 1, title: '添加五金项', content: $('#editBox'), area: ['520px', 'auto'] });
    }
    $('#editForm [name="name"]').on('blur', function () {
        var pinyin = $.trim($(this).val()); if (!pinyin) return;
        app.post(api.production.queryQuoteItemByPinyin, { 'quoteItem.pinyin': pinyin }, function (res) {
            var list = res.quoteItems || []; var v = list[0];
            if (v) {
                $('#editForm [name="name"]').val(v.name);
                $('#editForm [name="measurementUnit"]').val(v.measurementunit);
                $('#editForm [name="unitprice"]').val(v.unitprice);
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
            'hardware.hid': ctx.hid,
            'hardwareItems[0].name': $('#editForm [name="name"]').val(),
            'hardwareItems[0].unitprice': $('#editForm [name="unitprice"]').val(),
            'hardwareItems[0].num': $('#editForm [name="num"]').val(),
            'hardwareItems.measurementunit': $('#editForm [name="measurementUnit"]').val(),
            'hardwareItems[0].total': $('#editForm [name="total"]').val(),
            'hardwareItems[0].comment': $('#editForm [name="comment"]').val()
        };
        app.post(api.production.addHardwareItem, o, function () { app.showAlert(app.success, '添加成功'); layer.close(editIndex); editIndex = null; query(); });
    }
    $('#btnAdd').on('click', openAdd);
    $('#btnSave').on('click', save);
    $('#btnCancel').on('click', function () { layer.close(editIndex); editIndex = null; });
    $('#btnBack').on('click', function () { try { var idx = window.parent.layer.getFrameIndex(window.name); window.parent.layer.close(idx); } catch (e) {} });
});
}); // end app.ready
