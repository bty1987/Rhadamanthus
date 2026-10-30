/** supplierContractCategory.js —— 厂商合同品类（querySupplierContractCategory + add/delete）
 * 从 url ?scbid= 取 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { scbid: null, editIndex: null };

    function getUrlParam(k) { var m = location.search.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? m[1] : ''; }
    state.scbid = getUrlParam('scbid');

    app.bindData($('#editForm [name="ctype"]'), [{ key: 0, value: '比例' }, { key: 1, value: '金额' }], 'key', 'value', true, function () { form.render('select'); });
    app.bindData($('#editForm [name="type"]'), [{ key: 0, value: '类型A' }, { key: 1, value: '类型B' }], 'key', 'value', true, function () { form.render('select'); });

    $('#editForm [name="ctype"]').on('change', function () {
        if ($(this).val() === '1') $('#fType').show(); else $('#fType').hide();
    });

    initTable(); query();

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'name', title: '名称', minWidth: 160 },
                { field: 'ctype', title: '结算类型', width: 120, templet: function (d) { return d.ctype == 1 ? '金额' : '比例'; } },
                { field: 'cvalue', title: '结算值', width: 120 },
                { title: '操作', width: 100, fixed: 'right', toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDelete(obj.data); });
    }

    function query() {
        app.post(api.personel.querySupplierContractCategory, { 'supplierContractCategory.scbid': state.scbid }, function (res) {
            table.reload('resultTable', { data: res.supplierContractCategorys || [] });
        });
    }

    function openEdit() {
        app.clearValidator(); $('#editForm')[0].reset(); form.render('select'); $('#fType').hide();
        state.editIndex = layer.open({ type: 1, title: '添加品类', content: $('#editBox'), area: ['480px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var ctype = $('#editForm [name="ctype"]').val();
        var type = ctype === '1' ? $('#editForm [name="type"]').val() : ctype;
        app.post(api.personel.addSupplierContractCategory, {
            'supplierContractCategory.scbid': state.scbid,
            'supplierContractCategory.ctype': type,
            'supplierContractCategory.cvalue': $('#editForm [name="cvalue"]').val(),
            'supplierContractCategory.name': $('#editForm [name="name"]').val()
        }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.editIndex); state.editIndex = null; query(); });
    }
    function doDelete(d) {
        app.showConfirm('是否删除该品类？', function () { app.post(api.personel.deleteSupplierContractCategory, { 'supplierContractCategory.sccid': d.sccid }, function () { app.showAlert(app.success, '已删除'); query(); }); });
    }

    $('#btnAdd').on('click', openEdit);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
