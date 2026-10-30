/** app/js/material/materialDetail.js —— 主材订单明细（item 列表，可编辑数量/删除/导出）
 * 上下文：app.params.materialSubOrder.msoId 为目标订单 ID。 */
app.ready(function () {
layui.use(['table', 'layer', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, $ = layui.jquery;
    var sub = app.params.materialSubOrder || {};
    initTable(); query();
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[
                { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '名称', minWidth: 160 },
                { field: 'category', title: '品类', width: 100 },
                { field: 'brand', title: '品牌', width: 120 },
                { field: 'measurementUnit', title: '单位', width: 80 },
                { field: 'salePrice', title: '折扣价', width: 100, templet: function (d) { return app.formatMoney(d.salePrice); } },
                { field: 'price', title: '售价', width: 100, templet: function (d) { return app.formatMoney(d.price); } },
                { field: 'num', title: '数量', width: 80 },
                { field: 'total', title: '总价', width: 100, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'prePoint', title: '结算值', width: 100 },
                { field: 'comment', title: '备注', width: 140 },
                { title: '操作', width: 140, toolbar: '#rowToolbar' }
            ]],
            done: function (res) { if (sub.fullStatus != 0) $('.layui-table-body [lay-event="edit"],.layui-table-body [lay-event="del"]').hide(); }
        });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') editRow(obj.data);
            else if (obj.event === 'del') delRow(obj.data);
        });
    }
    function query() {
        if (!sub.msoId) { app.showAlert(app.warning, '缺少订单上下文'); return; }
        app.post(api.material.queryMaterialItemByMid, { 'materialItem.mid': sub.msoId }, function (res) { table.reload('resultTable', { data: res.materialItems || [] }); });
    }
    function editRow(d) {
        layer.prompt({ title: '修改数量 - ' + d.name, value: String(d.num) }, function (val, i) {
            if (!/^\d+(\.\d{1,3})?$/.test(val) || parseFloat(val) <= 0) { app.showAlert(app.error, '数量格式错误'); return; }
            var total = app.utils.changeTwoDecimal(app.utils.accMul(parseFloat(d.price), parseFloat(val)));
            app.post(api.material.updateMaterialItemForItem, { 'materialItem.miid': d.miid, 'materialItem.num': val, 'materialItem.total': total, 'material.mid': sub.msoId }, function () { layer.close(i); app.showAlert(app.success, '已保存'); query(); });
        });
    }
    function delRow(d) {
        layer.confirm('确认删除吗?', function (idx) {
            app.post(api.material.deleteMaterialItem, { 'mid': sub.msoId, 'miids[0]': d.miid }, function (res) { layer.close(idx); app.showAlert(app.success, '已删除'); query(); });
        });
    }
    $('#btnExport').on('click', function () {
        app.post(api.material.queryMaterialItemByMid, { 'materialItem.mid': sub.msoId }, function (res) { app.exporter && app.exporter(res.materialItems || [], '主材明细'); });
    });
    $('#btnBack').on('click', function () { app.switchPage(api.index.materialIndex.url); });
});
}); // end app.ready
