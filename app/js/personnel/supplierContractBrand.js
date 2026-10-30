/** supplierContractBrand.js —— 厂商合同品牌（pageSupplierContractBrand + add/update/delete + 品类子页）
 * 从 url ?scid=&uid= 取 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, scid: null, uid: null, editIndex: null, editId: null };

    function getUrlParam(k) { var m = location.search.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? m[1] : ''; }
    state.scid = getUrlParam('scid');
    state.uid = getUrlParam('uid');

    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'name', title: '品牌名称', minWidth: 160 },
                { field: 'ctype', title: '结算类型', width: 100, templet: function (d) { return d.ctype == 1 ? '金额' : '比例'; } },
                { field: 'cvalue', title: '结算值', width: 120 },
                { title: '操作', width: 200, fixed: 'right', toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'category') openCategory(obj.data);
            else if (obj.event === 'del') doDelete(obj.data);
        });
    }

    function query(page) {
        state.page = page || 1;
        app.post(api.personel.pageSupplierContractBrand, {
            'paging.page': state.page, 'paging.rows': state.rows,
            'supplierContractBrand.scid': state.scid
        }, function (res) {
            var pg = res.paging || {};
            table.reload('resultTable', { data: pg.data || [] });
            state.total = pg.totalRecords || 0;
            laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } });
        });
    }

    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null;
        if (d) {
            state.editId = d.scbid;
            $('#editForm [name="scbid"]').val(d.scbid);
            $('#editForm [name="name"]').val(d.name);
            $('#editForm [name="ctype"]').val(d.ctype);
            $('#editForm [name="cvalue"]').val(d.cvalue);
        }
        form.render('select');
        state.editIndex = layer.open({ type: 1, title: d ? '编辑品牌' : '添加品牌', content: $('#editBox'), area: ['480px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var opt = {
            'supplierContractBrand.scid': state.scid,
            'supplierContractBrand.name': $('#editForm [name="name"]').val(),
            'supplierContractBrand.ctype': $('#editForm [name="ctype"]').val(),
            'supplierContractBrand.cvalue': $('#editForm [name="cvalue"]').val()
        };
        var apiDef = state.editId ? (opt['supplierContractBrand.scbid'] = state.editId, api.personel.updateSupplierContractBrand) : api.personel.addSupplierContractBrand;
        app.post(apiDef, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function doDelete(d) {
        app.showConfirm('是否删除该品牌？', function () { app.post(api.personel.deleteSupplierContractBrand, { 'supplierContractBrand.scbid': d.scbid }, function () { app.showAlert(app.success, '已删除'); query(state.page); }); });
    }
    function openCategory(d) {
        layer.open({ type: 2, title: '品牌品类', content: '../../views/personnel/supplierContractCategory.html?scbid=' + d.scbid, area: ['80%', '80%'] });
    }

    $('#btnBack').on('click', function () { history.back(); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
