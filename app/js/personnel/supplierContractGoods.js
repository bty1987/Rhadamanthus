/** supplierContractGoods.js —— 厂商合同商品（pageSupplierContractGoods + add/delete）
 * 从 url ?scid= 取，商品名拼音搜索 queryGoodsPoolByName */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, scid: null, editIndex: null };

    function getUrlParam(k) { var m = location.search.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? m[1] : ''; }
    state.scid = getUrlParam('scid');

    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'goods', title: '商品名称', minWidth: 200, templet: function (d) { return d.goods ? d.goods.name : '---'; } },
                { field: 'price', title: '价格', width: 120 },
                { field: 'balance', title: '结算价', width: 120 },
                { title: '操作', width: 100, fixed: 'right', toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDelete(obj.data); });
    }

    function query(page) {
        state.page = page || 1;
        app.post(api.personel.pageSupplierContractGoods, {
            'paging.page': state.page, 'paging.rows': state.rows,
            'supplierContractGoods.scid': state.scid
        }, function (res) {
            var pg = res.paging || {};
            table.reload('resultTable', { data: pg.data || [] });
            state.total = pg.totalRecords || 0;
            laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } });
        });
    }

    var ta = null;
    $('#goodsName').on('input', function () {
        var kw = $.trim($(this).val());
        $('#editForm [name="goods.gid"]').val('');
        clearTimeout(ta);
        if (!kw) return;
        ta = setTimeout(function () {
            app.post(api.communion.queryGoodsPoolByName, { 'goodsPool.name': kw, 'goodsPool.status': 0 }, function (res) {
                var list = res.goodsPools || [];
                if (list.length === 1) { $('#goodsName').val(list[0].name); $('#editForm [name="goods.gid"]').val(list[0].gpid); }
                else if (list.length > 1) { showPick(list); }
            });
        }, 300);
    });
    function showPick(list) {
        var html = '';
        $.each(list, function (i, g) { html += '<div style="padding:6px 8px;cursor:pointer;border-bottom:1px solid #eee;" data-gid="' + g.gpid + '" data-name="' + g.name + '">' + g.name + '</div>'; });
        layer.open({ type: 1, title: '选择商品', content: $('<div id="goodsPick" style="max-height:320px;overflow:auto;">' + html + '</div>'), area: ['360px', 'auto'], success: function () {
            $('#goodsPick > div').on('click', function () { $('#goodsName').val($(this).attr('data-name')); $('#editForm [name="goods.gid"]').val($(this).attr('data-gid')); layer.closeAll(); });
        } });
    }

    function openEdit() {
        app.clearValidator(); $('#editForm')[0].reset(); $('#editForm [name="goods.gid"]').val('');
        state.editIndex = layer.open({ type: 1, title: '添加商品', content: $('#editBox'), area: ['480px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var gid = $('#editForm [name="goods.gid"]').val();
        if (!gid) { app.showAlert(app.warning, '请选择商品'); return; }
        app.post(api.personel.addSupplierContractGoods, {
            'supplierContractGoods.scid': state.scid,
            'supplierContractGoods.price': $('#editForm [name="price"]').val(),
            'supplierContractGoods.balance': $('#editForm [name="balance"]').val(),
            'supplierContractGoods.goods.gid': gid
        }, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(state.editIndex); state.editIndex = null;
            var idx = (window.parent && window.parent.layer) ? window.parent.layer.getFrameIndex(window.name) : null;
            if (idx != null) window.parent.layer.close(idx);
        });
    }
    function doDelete(d) {
        app.showConfirm('是否删除该商品？', function () { app.post(api.personel.deleteSupplierContractGoods, { 'supplierContractGoods.scgid': d.scgid }, function () { app.showAlert(app.success, '已删除'); query(state.page); }); });
    }

    $('#btnAdd').on('click', openEdit);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
