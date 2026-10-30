/** app/js/material/materialModelAdvance.js —— 主材型号（高级：CRUD + 计算方式 + 状态切换）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, advanceIndex: null, editId: null };
    var cache = { types: [], brands: [], units: [], brandMap: {} };
    function stB(d) { var c = d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + (d.status == 0 ? '启用' : '禁用') + '<\/span>'; }
    function calcB(d) { if (d.calcType == 1) return '<span class="layui-badge layui-bg-blue">点位<\/span>'; if (d.calcType == 0) return '<span class="layui-badge layui-bg-orange">底价<\/span>'; return '-'; }
    function calcV(d) { return d.calcType == 1 ? d.point : d.calcType == 0 ? d.base : ''; }
    initTable(); loadOpts(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'materialModelNo', title: '编号', width: 140 }, { field: 'materialModelName', title: '名称', minWidth: 160 }, { field: 'materialTypeName', title: '品类', width: 120 }, { field: 'materialBrandName', title: '品牌', width: 140 }, { field: 'measurementUnitName', title: '单位', width: 90 }, { field: 'materialPurchasePrice', title: '进价', width: 100, templet: function (d) { return app.formatMoney(d.materialPurchasePrice); } }, { field: 'materialUnitPrice', title: '标价', width: 100, templet: function (d) { return app.formatMoney(d.materialUnitPrice); } }, { field: 'discount', title: '折扣', width: 80 }, { field: 'calcType', title: '计算方式', width: 100, templet: calcB }, { field: 'calcValue', title: '计算值', width: 100, templet: calcV }, { field: 'status', title: '状态', width: 80, templet: stB }, { title: '操作', width: 280, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'advance') openAdvance(obj.data);
            else if (obj.event === 'enable') updSt(obj.data, 0);
            else if (obj.event === 'disable') updSt(obj.data, 1);
        });
    }
    function loadOpts() {
        app.post(api.data.queryCategory, {}, function (res) { cache.types = res.categorys || []; renderSelect('#selMaterialType', cache.types, 'cid', 'name'); });
        app.post(api.data.queryMeasurementUnit, {}, function (res) { cache.units = res.measurementUnits || []; renderSelect('#selMeasurementUnit', cache.units, 'id', 'name'); });
        app.post(api.data.queryBrand, {}, function (res) { cache.brands = res.brands || []; renderSelect('#selMaterialBrand', cache.brands, 'bid', 'name'); });
    }
    function renderSelect(sel, list, k, v) { var $s = $(sel); $s.empty().append('<option value="">请选择</option>'); (list || []).forEach(function (it) { $s.append('<option value="' + it[k] + '">' + (it[v] || '') + '</option>'); }); form.render('select'); }
    function loadBrandByType(tid) { var list = cache.brandMap[tid]; if (list) { renderSelect('#selMaterialBrand', list, 'bid', 'name'); return; } app.post(api.data.queryBrandByCid, { 'brand.cid': tid }, function (res) { cache.brandMap[tid] = res.brands || []; renderSelect('#selMaterialBrand', cache.brandMap[tid], 'bid', 'name'); }); }
    form.on('select(materialType)', function (d) { if (d.value) loadBrandByType(d.value); });
    form.on('radio(calcType)', function (d) { if (d.value == '1') { $('#pointDiv').show(); $('#baseDiv').hide(); } else { $('#pointDiv').hide(); $('#baseDiv').show(); } });
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.material.pageMaterialModelForAdvance, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset();
        if (d) {
            state.editId = d.mmId;
            $('#editForm [name="mmId"]').val(d.mmId);
            $('#editForm [name="materialModelNo"]').val(d.materialModelNo).attr('disabled', true);
            $('#editForm [name="materialModelName"]').val(d.materialModelName);
            $('#editForm [name="materialUnitPrice"]').val(d.materialUnitPrice);
            $('#editForm [name="materialPurchasePrice"]').val(d.materialPurchasePrice);
            $('#editForm [name="discount"]').val(d.discount);
            if (d.materialTypeId) { $('#selMaterialType').val(d.materialTypeId); loadBrandByType(d.materialTypeId); setTimeout(function () { $('#selMaterialBrand').val(d.materialBrandId); form.render('select'); }, 200); }
            if (d.measurementUnitId) { $('#selMeasurementUnit').val(d.measurementUnitId); }
            form.render('select');
        } else { state.editId = null; $('#editForm [name="materialModelNo"]').removeAttr('disabled'); form.render('select'); }
        state.editIndex = layer.open({ type: 1, title: d ? '编辑主材型号' : '添加主材型号', content: $('#editBox'), area: ['560px', 'auto'] });
    }
    function openAdvance(d) {
        $('#advanceForm')[0].reset();
        $('#advanceForm [name="mmId"]').val(d.mmId);
        $('#advanceForm [name="materialModelNo"]').val(d.materialModelNo);
        $('#advanceForm [name="materialModelName"]').val(d.materialModelName);
        $('#advanceForm [name="base"]').val(d.base);
        $('#advanceForm [name="point"]').val(d.point);
        $('#advanceForm [name="calcType"][value="' + (d.calcType || 0) + '"]').prop('checked', true);
        if (d.calcType == 1) { $('#pointDiv').show(); $('#baseDiv').hide(); } else { $('#pointDiv').hide(); $('#baseDiv').show(); }
        form.render();
        state.advanceIndex = layer.open({ type: 1, title: '高级设置 - ' + d.materialModelName, content: $('#advanceBox'), area: ['520px', 'auto'] });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var o = {};
        o['materialModel.materialModelNo'] = $('#editForm [name="materialModelNo"]').val();
        o['materialModel.materialModelName'] = $('#editForm [name="materialModelName"]').val();
        o['materialModel.materialBrandId'] = $('#editForm [name="materialBrandId"]').val();
        o['materialModel.materialBrandName'] = $('#selMaterialBrand option:selected').text();
        o['materialModel.materialTypeName'] = $('#selMaterialType option:selected').text();
        o['materialModel.measurementUnitId'] = $('#editForm [name="measurementUnitId"]').val();
        o['materialModel.measurementUnitName'] = $('#selMeasurementUnit option:selected').text();
        o['materialModel.materialUnitPrice'] = $('#editForm [name="materialUnitPrice"]').val();
        o['materialModel.materialPurchasePrice'] = $('#editForm [name="materialPurchasePrice"]').val();
        o['materialModel.discount'] = $('#editForm [name="discount"]').val();
        var ad;
        if (state.editId) { o['materialModel.mmId'] = state.editId; ad = api.material.updateMaterialModel; } else { ad = api.material.addMaterialModel; }
        app.post(ad, o, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function doAdvanceSave() {
        var o = {};
        o['materialModel.mmId'] = $('#advanceForm [name="mmId"]').val();
        o['materialModel.calcType'] = $('#advanceForm [name="calcType"]:checked').val();
        o['materialModel.point'] = $('#advanceForm [name="point"]').val() || 0;
        o['materialModel.base'] = $('#advanceForm [name="base"]').val() || 0;
        app.post(api.material.updateMaterialModelForAdvance, o, function () { app.showAlert(app.success, '保存成功'); layer.close(state.advanceIndex); state.advanceIndex = null; query(state.page); });
    }
    function updSt(d, s) { app.post(api.material.updateMaterialModelForStatus, { 'materialModel.mmId': d.mmId, 'materialModel.status': s }, function () { app.showAlert(app.success, s == 0 ? '已启用' : '已禁用'); query(state.page); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
    $('#btnAdvanceSave').on('click', doAdvanceSave);
    $('#btnAdvanceCancel').on('click', function () { layer.close(state.advanceIndex); state.advanceIndex = null; });
});
}); // end app.ready
