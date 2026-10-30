/** app/js/material/materialPreBalanceDetail.js —— 主材预结明细（item 列表 + 编辑结算值 + 计算方式切换 + 预结）
 * 上下文：app.params.materialPreBalance.msoId。 */
app.ready(function () {
layui.use(['table', 'layer', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, $ = layui.jquery;
    var ctx = app.params.materialPreBalance || {};
    var editIndex = null;
    initTable(); query();
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[
                { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '名称', minWidth: 160 },
                { field: 'no', title: '型号', width: 140 },
                { field: 'category', title: '品类', width: 100 },
                { field: 'brand', title: '品牌', width: 120 },
                { field: 'measurementUnit', title: '单位', width: 80 },
                { field: 'salePrice', title: '折扣价', width: 100, templet: function (d) { return app.formatMoney(d.salePrice); } },
                { field: 'price', title: '售价', width: 100, templet: function (d) { return app.formatMoney(d.price); } },
                { field: 'num', title: '数量', width: 80 },
                { field: 'total', title: '总价', width: 100, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'prePoint', title: '结算值', width: 100 },
                { field: 'comment', title: '说明', minWidth: 140 },
                { title: '操作', width: 180, toolbar: '#rowToolbar' }
            ]]
        });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'value') openEdit(obj.data);
            else if (obj.event === 'cal') changeCalc(obj.data);
        });
    }
    function query() {
        if (!ctx.msoId) { app.showAlert(app.warning, '缺少订单上下文'); return; }
        app.post(api.material.queryMaterialItemByMid, { 'materialItem.mid': ctx.msoId }, function (res) { table.reload('resultTable', { data: res.materialItems || [] }); });
    }
    function openEdit(d) {
        $('#editForm')[0].reset();
        $('#editForm [name="miid"]').val(d.miid);
        $('#editForm [name="mid"]').val(d.mid);
        $('#editForm [name="isLeaf"]').val(d.isLeaf);
        $('#editForm [name="packageName"]').val(d.packageName);
        $('#editForm [name="calcType"]').val(d.calcType == '0' ? '底价' : '点位');
        $('#editForm [name="value"]').val(d.prePoint);
        editIndex = layer.open({ type: 1, title: '结算值 - ' + d.name, content: $('#editBox'), area: ['520px', 'auto'] });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var o = {};
        o['miids[0]'] = $('#editForm [name="miid"]').val();
        o['materialItem.prePoint'] = $('#editForm [name="value"]').val();
        o['materialItem.mid'] = ctx.msoId;
        app.post(api.material.updateMaterialItemForPrePT, o, function () { app.showAlert(app.success, '保存成功'); layer.close(editIndex); query(); });
    }
    function changeCalc(d) {
        layer.confirm('确认修改当前型号的计算方式?', function (i) {
            app.post(api.material.changeMaterialItemForCaclType, { 'materialItem.miid': d.miid }, function () { layer.close(i); query(); });
        });
    }
    function preBalance() {
        layer.confirm('确定需要提交当前子订单的预结处理吗?', function (i) {
            app.post(api.material.preBalanceMaterial, { 'mids[0]': ctx.msoId }, function () { layer.close(i); app.showAlert(app.success, '预结成功'); app.switchPage(api.index.materialPreBalanceIndex.url); });
        });
    }
    $('#btnPreBalance').on('click', preBalance);
    $('#btnExport').on('click', function () { app.post(api.material.queryMaterialItemByMid, { 'materialItem.mid': ctx.msoId }, function (res) { app.exporter && app.exporter(res.materialItems || [], '主材预结明细'); }); });
    $('#btnBack').on('click', function () { app.switchPage(api.index.materialPreBalanceIndex.url); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(editIndex); });
});
}); // end app.ready
