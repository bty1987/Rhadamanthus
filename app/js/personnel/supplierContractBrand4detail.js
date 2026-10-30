/** supplierContractBrand4detail.js —— 质保/产品明细（querySupplierContractProduct + 批量 add + delete）
 * 从 url ?scid= 取 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, scid: null, editIndex: null };

    function getUrlParam(k) { var m = location.search.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? m[1] : ''; }
    state.scid = getUrlParam('scid');

    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'category', title: '品类', width: 140 },
                { field: 'brand', title: '品牌', width: 140 },
                { field: 'name', title: '名称', minWidth: 160 },
                { field: 'warranTime', title: '质保期', width: 120 },
                { title: '操作', width: 100, fixed: 'right', toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDelete(obj.data); });
    }

    function query(page) {
        state.page = page || 1;
        app.post(api.personel.querySupplierContractProduct, {
            'paging.page': state.page, 'paging.rows': state.rows,
            'supplierContractProduct.scid': state.scid
        }, function (res) {
            var list = res.supplierContractProducts || [];
            table.reload('resultTable', { data: list });
            state.total = list.length;
            laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } });
        });
    }

    function openEdit() {
        app.clearValidator(); $('#editForm')[0].reset();
        state.editIndex = layer.open({ type: 1, title: '批量添加', content: $('#editBox'), area: ['560px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var lines = $('#editForm [name="warranty"]').val().split(/\r?\n/);
        var valid = true;
        var opt = {};
        var idx = 0;
        for (var i = 0; i < lines.length; i++) {
            var line = $.trim(lines[i]);
            if (!line) continue;
            var parts = line.split(/[，,\t '']+/);
            if (parts.length != 4) { app.showAlert(app.warning, '第' + (i + 1) + '行数据格式错误'); valid = false; break; }
            var category = $.trim(parts[0]), brand = $.trim(parts[1]), name = $.trim(parts[2]), warranTime = $.trim(parts[3]);
            if (!category || !brand || !name || !warranTime) { app.showAlert(app.warning, '第' + (i + 1) + '行必填字段为空'); valid = false; break; }
            opt['supplierContractProducts[' + idx + '].scid'] = state.scid;
            opt['supplierContractProducts[' + idx + '].category'] = category;
            opt['supplierContractProducts[' + idx + '].name'] = name;
            opt['supplierContractProducts[' + idx + '].warranTime'] = warranTime;
            opt['supplierContractProducts[' + idx + '].brand'] = brand;
            idx++;
        }
        if (!valid) return;
        app.post(api.personel.addSupplierContractProduct, opt, function () {
            app.showAlert(app.success, '操作成功'); layer.close(state.editIndex); state.editIndex = null; query(1);
        });
    }
    function doDelete(d) {
        app.showConfirm('是否删除该记录？', function () { app.post(api.personel.deleteSupplierContractProduct, { 'supplierContractProduct.scpid': d.scpid }, function () { app.showAlert(app.success, '已删除'); query(state.page); }); });
    }

    $('#btnAdd').on('click', openEdit);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
