/** app/js/material/materialBalanceValue.js —— 主材结算值（编辑 calcType/point/base）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null };
    function calcB(d) { if (d.calcType == 1) return '<span class="layui-badge layui-bg-blue">点位<\/span>'; if (d.calcType == 0) return '<span class="layui-badge layui-bg-orange">底价<\/span>'; return '-'; }
    function calcV(d) { return d.calcType == 1 ? d.point : d.calcType == 0 ? d.base : ''; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'materialModelNo', title: '型号', width: 140 }, { field: 'materialTypeName', title: '品类', width: 120 }, { field: 'materialBrandName', title: '品牌', width: 140 }, { field: 'measurementUnitName', title: '单位', width: 90 }, { field: 'materialPurchasePrice', title: '进价', width: 100, templet: function (d) { return app.formatMoney(d.materialPurchasePrice); } }, { field: 'materialUnitPrice', title: '标价', width: 100, templet: function (d) { return app.formatMoney(d.materialUnitPrice); } }, { field: 'discount', title: '折扣', width: 80 }, { field: 'calcType', title: '计算方式', width: 100, templet: calcB }, { field: 'calcValue', title: '计算值', width: 100, templet: calcV }, { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); });
    }
    form.on('radio(calcType)', function (d) { if (d.value == '1') { $('#pointDiv').show(); $('#baseDiv').hide(); } else { $('#pointDiv').hide(); $('#baseDiv').show(); } });
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.material.pageMaterialModel, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset();
        ['mmId', 'materialModelNo', 'materialModelName', 'materialTypeName', 'materialBrandName', 'measurementUnitName', 'materialPurchasePrice', 'materialUnitPrice', 'discount', 'base', 'point'].forEach(function (k) { $('#editForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); });
        $('#editForm [name="mmId"]').val(d.mmId);
        $('#editForm [name="calcType"][value="' + (d.calcType || 0) + '"]').prop('checked', true);
        if (d.calcType == 1) { $('#pointDiv').show(); $('#baseDiv').hide(); } else { $('#pointDiv').hide(); $('#baseDiv').show(); }
        form.render();
        state.editIndex = layer.open({ type: 1, title: '编辑结算值 - ' + d.materialModelName, content: $('#editBox'), area: ['520px', 'auto'] });
    }
    function doSave() {
        var o = {};
        o['materialModel.mmId'] = $('#editForm [name="mmId"]').val();
        o['materialModel.calcType'] = $('#editForm [name="calcType"]:checked').val();
        o['materialModel.point'] = $('#editForm [name="point"]').val() || 0;
        o['materialModel.base'] = $('#editForm [name="base"]').val() || 0;
        app.post(api.material.updateMaterialModel, o, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
