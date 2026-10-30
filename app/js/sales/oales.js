/** app/js/sales/oales.js —— 外销单
 * pagetype: material(可新增/编辑/提交/取消)/finance(可确认/审核/驳回)/account(可结算)/其他(只读)。
 * oales.status: 0初始/1已提交/2已确认/3已审核/4已完成/5已取消/6已驳回
 * oales.atttype/awardType/type/isScale/isActivity 来自 ds。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, $ = layui.jquery;
    var pageType = (app.params.urlLoadParams && app.params.urlLoadParams.pagetype) || '';
    var state = { page: 1, rows: 10, total: 0, editIndex: null };
    var listApi = pageType == 'account' ? api.sales.pageOalesForAccount : api.sales.pageOales;
    var STATUS = { 0: '初始', 1: '已提交', 2: '已确认', 3: '已审核', 4: '已完成', 5: '已取消', 6: '已驳回' };
    if (pageType == 'account') $('#btnAddWrap').hide();
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'no', title: '外销单号', width: 140 },
                { field: 'orderId', title: '装修单号', width: 140 },
                { field: 'brand', title: '品牌', width: 130 },
                { field: 'category', title: '品类', width: 110 },
                { field: 'total', title: '总额', width: 110, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'cost', title: '成本', width: 100, templet: function (d) { return app.formatMoney(d.cost); } },
                { field: 'profit', title: '利润', width: 100, templet: function (d) { return app.formatMoney(d.profit); } },
                { field: 'award', title: '奖励', width: 100, templet: function (d) { return app.formatMoney(d.award); } },
                { field: 'threshold', title: '系数', width: 90 },
                { field: 'status', title: '状态', width: 90, templet: function (d) { var s = STATUS[d.status] != null ? STATUS[d.status] : '-'; var c = d.status == 4 ? 'layui-bg-green' : d.status == 5 ? 'layui-bg-black' : d.status == 6 ? 'layui-bg-orange' : d.status == 0 ? 'layui-bg-gray' : 'layui-bg-blue'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; } },
                { field: 'creater', title: '创建人', width: 110, templet: function (d) { return (d.creater && d.creater.currentName) || '-'; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'comment', title: '备注', minWidth: 140 },
                { title: '操作', width: 540, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, v = obj.data;
            if (ev === 'edit') openEdit(v);
            else if (ev === 'item') openItem(v);
            else if (ev === 'pay') openPay(v);
            else if (ev === 'record') openRecord(v);
            else if (ev === 'del') doDel(v);
            else if (ev === 'submit') doStatus(api.sales.submitOales, v, '提交');
            else if (ev === 'confirm') doStatus(api.sales.confirmOales, v, '确认');
            else if (ev === 'check') doStatus(api.sales.checkOales, v, '审核');
            else if (ev === 'finish') doStatus(api.sales.finishOales, v, '完成');
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(listApi, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(v) {
        app.clearValidator(); $('#editForm')[0].reset();
        if (v) {
            $('#editForm [name="oid"]').val(v.oid);
            $('#editForm [name="orderId"]').val(v.orderId);
            $('#editForm [name="total"]').val(v.total);
            $('#editForm [name="cost"]').val(v.cost);
            $('#editForm [name="threshold"]').val(v.threshold);
            $('#editForm [name="award"]').val(v.award);
            $('#editForm [name="profit"]').val(v.profit);
            $('#editForm [name="comment"]').val(v.comment);
        }
        state.editIndex = layer.open({ type: 1, title: v && v.oid ? '编辑外销单' : '新增外销单', content: $('#editBox'), area: ['520px', '90%'] });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var isEdit = $('#editForm [name="oid"]').val();
        var url = isEdit ? api.sales.updateOales : api.sales.addOales;
        var opt = {
            'oales.orderId': $('#editForm [name="orderId"]').val(),
            'oales.total': $('#editForm [name="total"]').val(),
            'oales.cost': $('#editForm [name="cost"]').val() || 0,
            'oales.threshold': $('#editForm [name="threshold"]').val() || 0,
            'oales.award': $('#editForm [name="award"]').val() || 0,
            'oales.profit': $('#editForm [name="profit"]').val() || 0,
            'oales.comment': $('#editForm [name="comment"]').val()
        };
        if (isEdit) opt['oales.oid'] = isEdit;
        app.post(url, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function doDel(v) {
        app.showConfirm('确认删除该外销单?', function () {
            app.post(api.sales.deleteOales, { 'oales.oid': v.oid }, function () { app.showAlert(app.success, '删除成功'); query(state.page); });
        });
    }
    function doStatus(url, v, info) {
        app.post(url, { 'oales.oid': v.oid }, function () { app.showAlert(app.success, info + '成功'); query(state.page); });
    }
    function openItem(v) {
        app.params.sales = { oales: { oid: v.oid } };
        app.popup(api.index.oalesItemIndex.url, '外销项明细 - ' + v.no, null, { area: ['90%', '80%'] });
    }
    function openPay(v) {
        app.params.sales = { oales: { oid: v.oid } };
        app.popup('/views/sales/oalesPay.html?pagetype=oales', '外销付款 - ' + v.no, null, { area: ['90%', '80%'] });
    }
    function openRecord(v) {
        app.params.sales = { oales: { oid: v.oid } };
        app.popup(api.index.oalesRecordIndex.url, '操作记录 - ' + v.no, null, { area: ['80%', '60%'] });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
