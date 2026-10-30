/** app/js/production/productionPlanItem.js —— 生产计划项（弹窗子页：分页列表 + 添加）
 * 上下文：app.params.productionPlanItem = {ppid, status, productionStatus}
 * 列表 pageProductionPlanItemByPpid；名称 typeahead queryQuoteItemByPinyin；添加 addProductionPlanItem；删除 deleteProductionPlanItem。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, $ = layui.jquery;
    var ctx = (window.parent && window.parent.app && window.parent.app.params.productionPlanItem) || app.params.productionPlanItem || {};
    var state = { page: 1, rows: 10, total: 0, editIndex: null };
    var canEdit = ctx.status == 0 && !(ctx.productionStatus == 3 || ctx.productionStatus == 4);
    if (!canEdit) $('#btnAdd').hide();
    initTable(); query();
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'name', title: '名称', minWidth: 160 }, { field: 'typeno', title: '类型编号', width: 120 },
                { field: 'height', title: '高', width: 70 }, { field: 'width', title: '宽', width: 70 }, { field: 'thick', title: '厚', width: 70 },
                { field: 'color', title: '颜色', width: 90 }, { field: 'num', title: '数量', width: 80 }, { field: 'comment', title: '备注', minWidth: 120 },
                canEdit ? { title: '操作', width: 100, toolbar: '#rowToolbar' } : { title: '', width: 1 } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDel(obj.data); });
    }
    function query() {
        if (!ctx.ppid) { app.showAlert(app.warning, '缺少生产计划上下文'); return; }
        state.page = state.page || 1;
        app.post(api.production.pageProductionPlanItemByPpid, { 'paging.page': state.page, 'paging.rows': state.rows, 'productionPlanItem.productionPlan.ppid': ctx.ppid }, function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) { state.page = o.curr; query(); } } }); }
    function doDel(v) {
        app.showConfirm('确定删除吗?', function () { app.post(api.production.deleteProductionPlanItem, { 'productionPlanItem.ppiid': v.ppiid }, function () { app.showAlert(app.success, '操作成功'); query(); }); });
    }
    function openAdd() {
        app.clearValidator(); $('#editForm')[0].reset();
        editIndex = layer.open({ type: 1, title: '添加计划项', content: $('#editBox'), area: ['640px', 'auto'] });
    }
    $('#editForm [name="name"]').on('blur', function () {
        var pinyin = $.trim($(this).val()); if (!pinyin) return;
        app.post(api.production.queryQuoteItemByPinyin, { 'quoteItem.pinyin': pinyin }, function (res) {
            var list = res.quoteItems || []; var v = list[0];
            if (v) {
                $('#editForm [name="name"]').val(v.name);
                $('#editForm [name="typeno"]').val(v.format);
                $('#editForm [name="width"]').val(0); $('#editForm [name="height"]').val(0); $('#editForm [name="thick"]').val(0);
                $('#editForm [name="num"]').val(1);
            }
        });
    });
    function save() {
        if (app.validate('editForm')) return;
        if (ctx.status != 0) { app.showAlert(app.warning, '计划单状态已完结不能添加子项'); return; }
        var o = {
            'productionPlanItem.productionPlan.ppid': ctx.ppid,
            'productionPlanItem.typeno': $('#editForm [name="typeno"]').val(),
            'productionPlanItem.name': $('#editForm [name="name"]').val(),
            'productionPlanItem.height': $('#editForm [name="height"]').val(),
            'productionPlanItem.width': $('#editForm [name="width"]').val(),
            'productionPlanItem.thick': $('#editForm [name="thick"]').val(),
            'productionPlanItem.color': $('#editForm [name="color"]').val(),
            'productionPlanItem.unitprice': 0,
            'productionPlanItem.num': $('#editForm [name="num"]').val(),
            'productionPlanItem.total': 0,
            'productionPlanItem.comment': $('#editForm [name="comment"]').val()
        };
        app.post(api.production.addProductionPlanItem, o, function () { app.showAlert(app.success, '操作成功'); layer.close(editIndex); editIndex = null; query(); });
    }
    $('#btnAdd').on('click', openAdd);
    $('#btnSave').on('click', save);
    $('#btnCancel').on('click', function () { layer.close(editIndex); editIndex = null; });
});
}); // end app.ready
