/** app/js/production/quoteItem.js —— 报价项（CRUD + 启用/禁用）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    var quoteTypes = [], units = [];
    function stB(d) { var c = d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + (d.status == 0 ? '启用' : '禁用') + '<\/span>'; }
    function qtype(d) { return d.quoteType ? d.quoteType.name : ''; }
    function uprice(d) { return app.formatMoney(d.unitprice); }
    initTable(); loadOpts(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '名称', minWidth: 160 }, { field: 'format', title: '型号', width: 120 }, { field: 'measurementunit', title: '单位', width: 90 }, { field: 'unitprice', title: '单价', width: 100, templet: uprice }, { field: 'quoteType', title: '类型', width: 120, templet: qtype }, { field: 'status', title: '状态', width: 90, templet: stB }, { title: '操作', width: 200, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'status') toggleStatus(obj.data);
        });
    }
    function loadOpts() {
        app.post(api.production.queryQuoteType, {}, function (res) { quoteTypes = res.quoteTypes || []; renderSelect('#selQuoteType', quoteTypes, 'qtid', 'name', true); renderSelect('#searchQuoteType', quoteTypes, 'qtid', 'name', true); });
        app.post(api.data.queryMeasurementUnit, {}, function (res) { units = res.measurementUnits || []; renderSelect('#selUnit', units, 'id', 'name', true); });
    }
    function renderSelect(sel, list, k, v, withAll) { var $s = $(sel); $s.empty(); if (withAll) $s.append('<option value="">请选择</option>'); (list || []).forEach(function (it) { $s.append('<option value="' + it[k] + '">' + (it[v] || '') + '</option>'); }); form.render('select'); }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.production.pageQuoteItem, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null;
        if (d) {
            state.editId = d.qiid;
            $('#editForm [name="qiid"]').val(d.qiid);
            $('#editForm [name="name"]').val(d.name).attr('disabled', true);
            $('#editForm [name="format"]').val(d.format);
            $('#selUnit').val(getUnitIdByName(d.measurementunit));
            $('#editForm [name="unitprice"]').val(d.unitprice);
            $('#selQuoteType').val(d.quoteType ? d.quoteType.qtid : '').attr('disabled', true);
            form.render('select');
        } else {
            $('#editForm [name="name"]').removeAttr('disabled');
            $('#selQuoteType').removeAttr('disabled');
            form.render('select');
        }
        state.editIndex = layer.open({ type: 1, title: d ? '编辑报价项' : '添加报价项', content: $('#editBox'), area: ['560px', 'auto'] });
    }
    function getUnitIdByName(name) { var u = units.filter(function (x) { return x.name === name; })[0]; return u ? u.id : ''; }
    function doSave() {
        if (app.validate('editForm')) return;
        var o = {
            'quoteItem.name': $('#editForm [name="name"]').val(),
            'quoteItem.format': $('#editForm [name="format"]').val(),
            'quoteItem.measurementunit': $('#selUnit option:selected').text(),
            'quoteItem.unitprice': $('#editForm [name="unitprice"]').val(),
            'quoteItem.quoteType.qtid': $('#selQuoteType').val()
        };
        var ad;
        if (state.editId) { o['quoteItem.qiid'] = state.editId; ad = api.production.updateQuoteItem; } else { ad = api.production.addQuoteItem; }
        app.post(ad, o, function () { app.showAlert(app.success, '操作成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function toggleStatus(d) {
        var nv = d.status == 0 ? 1 : 0, txt = nv == 0 ? '启用' : '禁用';
        app.showConfirm('确定' + txt + '该报价项?', function () {
            app.post(api.production.updateQuoteItemForStatus, { 'quoteItem.qiid': d.qiid, 'quoteItem.status': nv }, function () { app.showAlert(app.success, '已' + txt); query(state.page); });
        });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
