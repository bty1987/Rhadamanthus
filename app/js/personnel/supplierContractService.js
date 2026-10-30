/** supplierContractService.js —— 厂商服务费（querySupplierContractServiceBySid + add/delete）
 * 从 url ?uid= 取（旧代码用 params.personel.uid） */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'laydate', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, laydate = layui.laydate, $ = layui.jquery;
    var state = { uid: null, editIndex: null, data: '[]' };

    function getUrlParam(k) { var m = location.search.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? m[1] : ''; }
    state.uid = getUrlParam('uid');

    laydate.render({ elem: '#editForm [name="startDate"]' });
    laydate.render({ elem: '#editForm [name="reportedDate"]' });

    initTable(); query();

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'name', title: '名称', width: 160 },
                { field: 'servicePrice', title: '服务费', minWidth: 360, templet: function (d) {
                    var html = '';
                    try {
                        var arr = JSON.parse(d.servicePrice || '[]');
                        $.each(arr, function (i, v) {
                            html += '<div>有效期：' + (v.TL || '') + '；销售总金额：' + (v.UV || '') + '-' + (v.DV || '') + '(含)；超额服务费：' + (v.SR || '') + '%</div>';
                        });
                    } catch (e) { html = '---'; }
                    return html;
                } },
                { title: '操作', width: 100, fixed: 'right', toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDelete(obj.data); });
    }

    function query() {
        app.post(api.personel.querySupplierContractServiceBySid, { 'supplierContractServiceVO.sid': state.uid }, function (res) {
            table.reload('resultTable', { data: res.supplierContractServices || [] });
        });
    }

    function openEdit() {
        app.clearValidator(); $('#editForm')[0].reset(); form.render();
        state.editIndex = layer.open({ type: 1, title: '添加服务费', content: $('#editBox'), area: ['560px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var startDate = $('#editForm [name="startDate"]').val();
        var reportedDate = $('#editForm [name="reportedDate"]').val();
        var maxAmount = $('#editForm [name="maxAmount"]').val() || 0;
        var minAmount = $('#editForm [name="minAmount"]').val() || 0;
        var serviceCharge = $('#editForm [name="serviceCharge"]').val() || 0;
        var name = $('#editForm [name="name"]').val();
        var json = '{"TL": "' + startDate + ' - ' + reportedDate + '", "UV": ' + maxAmount + ', "DV": ' + minAmount + ', "SR": ' + serviceCharge + '}';
        var arr;
        try { arr = JSON.parse(state.data); } catch (e) { arr = []; }
        if (arr === null) arr = [];
        arr.push(JSON.parse(json));
        var updated = JSON.stringify(arr);
        app.post(api.personel.addSupplierContractService, {
            'supplierContractServiceVO.sid': state.uid,
            'supplierContractServiceVO.name': name,
            'supplierContractServiceVO.servicePrice': updated
        }, function () {
            state.data = '[]';
            layer.close(state.editIndex); state.editIndex = null; query();
        });
    }
    function doDelete(d) {
        app.showConfirm('是否删除该服务费？', function () { app.post(api.personel.deleteSupplierContractService, { 'supplierContractServiceVO.scsid': d.scsid }, function () { app.showAlert(app.success, '已删除'); query(); }); });
    }

    $('#btnAdd').on('click', openEdit);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
