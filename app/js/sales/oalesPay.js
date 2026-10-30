/** app/js/sales/oalesPay.js —— 外销付款
 * url ?pagetype=payment：列表视图（可新增/编辑/删除/改时间/导出）
 * 其他：按 app.params.sales.oales.oid 列付款项（无分页）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'laydate', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, laydate = layui.laydate, form = layui.form, $ = layui.jquery;
    var pageType = (app.params.urlLoadParams && app.params.urlLoadParams.pagetype) || '';
    var ctx = (app.params.sales && app.params.sales.oales) || {};
    var state = { page: 1, rows: 10, total: 0, editIndex: null, timeIndex: null, opid: null };
    var TYPE = { 0: '付款', 1: '退款', 2: '奖励' };
    laydate.render({ elem: '#payTime', type: 'datetime' });
    laydate.render({ elem: '#createTime2', type: 'datetime' });
    if (pageType != 'payment') $('#searchBlock').hide();
    initTable(); query(1);

    function initTable() {
        var cols = [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'name', title: '名称', width: 200 },
            { field: 'money', title: '金额', width: 120, templet: function (d) { return app.formatMoney(d.money); } },
            { field: 'type', title: '类型', width: 90, templet: function (d) { return TYPE[d.type] != null ? TYPE[d.type] : '-'; } },
            { field: 'creater', title: '创建人', width: 110, templet: function (d) { return (d.creater && d.creater.currentName) || '-'; } },
            { field: 'createTime', title: '创建时间', width: 170 },
            { field: 'payTime', title: '付款时间', width: 170 },
            { field: 'comment', title: '备注', minWidth: 140 } ]];
        if (pageType == 'payment') {
            cols[0].splice(2, 0, { field: 'oales', title: '外销单号', width: 140, templet: function (d) { return (d.oales && d.oales.no) || '-'; } });
            cols[0].splice(3, 0, { field: 'oalesCategory', title: '品类', width: 110, templet: function (d) { return (d.oales && d.oales.category) || '-'; } });
            cols[0].splice(4, 0, { field: 'oalesBrand', title: '品牌', width: 130, templet: function (d) { return (d.oales && d.oales.brand) || '-'; } });
        }
        cols[0].push({ title: '操作', width: 220, toolbar: '#rowToolbar' });
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true, cols: cols });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'time') openTime(obj.data);
            else if (obj.event === 'del') doDel(obj.data);
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        var opt = $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows });
        if (pageType != 'payment') opt['oalesPay.oid'] = ctx.oid;
        app.post(api.sales.pageOalesPay, opt, function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(v) {
        app.clearValidator(); $('#editForm')[0].reset();
        state.opid = null;
        if (v) {
            state.opid = v.opid;
            ['name', 'money', 'type', 'payTime', 'comment'].forEach(function (k) { $('#editForm [name="' + k + '"]').val(v[k] != null ? v[k] : ''); });
            form.render();
        } else { form.render(); }
        state.editIndex = layer.open({ type: 1, title: state.opid ? '编辑付款' : '新增付款', content: $('#editBox'), area: ['520px', 'auto'] });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var url = state.opid ? api.sales.updateOalesPay : api.sales.addOalesPay;
        var opt = {
            'oalesPay.name': $('#editForm [name="name"]').val(),
            'oalesPay.money': $('#editForm [name="money"]').val(),
            'oalesPay.type': $('#editForm [name="type"]').val(),
            'oalesPay.payTime': $('#editForm [name="payTime"]').val(),
            'oalesPay.comment': $('#editForm [name="comment"]').val()
        };
        if (state.opid) opt['oalesPay.opid'] = state.opid;
        if (pageType != 'payment') opt['oalesPay.oid'] = ctx.oid;
        app.post(url, opt, function () {
            app.showAlert(app.success, '操作成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page);
        });
    }
    function doDel(v) {
        app.showConfirm('确认删除该付款?', function () {
            app.post(api.sales.deleteOalesPay, { 'oalesPay.opid': v.opid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
        });
    }
    function openTime(v) {
        app.clearValidator();
        state.opid = v.opid;
        $('#timeForm [name="opid2"]').val(v.opid);
        $('#timeForm [name="createTime"]').val(v.createTime || '');
        state.timeIndex = layer.open({ type: 1, title: '修改创建时间', content: $('#timeBox'), area: ['420px', 'auto'] });
    }
    function doTimeSave() {
        if (app.validate('timeForm')) return;
        app.post(api.sales.updateOalesPayForAdvance, { 'oalesPay.opid': state.opid, 'oalesPay.createTime': $('#timeForm [name="createTime"]').val() }, function () {
            app.showAlert(app.success, '操作成功'); layer.close(state.timeIndex); state.timeIndex = null; query(state.page);
        });
    }
    function doExport() {
        var opt = $.extend({}, bF(), { 'paging.noPage': 1 });
        if (pageType != 'payment') opt['oalesPay.oid'] = ctx.oid;
        app.post(api.sales.pageOalesPay, opt, function (res) {
            var list = (res.paging && res.paging.data) || [];
            if (!list.length) { app.showAlert(app.warning, '没有数据'); return; }
            var rows = list.map(function (v) {
                return {
                    name: v.name, money: v.money, type: TYPE[v.type] || '',
                    category: v.oales && v.oales.category || '', brand: v.oales && v.oales.brand || '',
                    supplier: v.oales && v.oales.supplier ? v.oales.supplier.currentName : '',
                    no: v.oales && v.oales.no || '', status: v.oales && v.oales.status,
                    createTime: v.createTime, payTime: v.payTime, comment: v.comment || ''
                };
            });
            var header = ['名称', '金额', '类型', '品类', '品牌', '供应商', '外销单号', '状态', '创建时间', '付款时间', '备注'];
            app.exporter ? app.exporter(rows, '外销付款', header) : app.showAlert(app.warning, '导出工具未加载');
        });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
    $('#btnTimeSave').on('click', doTimeSave);
    $('#btnExport').on('click', doExport);
});
}); // end app.ready
