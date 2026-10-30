/** app/js/production/puotationItem.js —— 报价单子项（弹窗子页，只读列表，可删除）
 * 上下文：app.params.puotationItemList = {qid, status, use} */
app.ready(function () {
layui.use(['table', 'layer', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, $ = layui.jquery;
    var ctx = (window.parent && window.parent.app && window.parent.app.params.puotationItemList) || app.params.puotationItemList || {};
    var canDelete = !(ctx.status == 3 || ctx.status == 4 || ctx.status == 5) && ctx.use != 1;
    initTable(); query();
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'name', title: '名称', minWidth: 160 }, { field: 'format', title: '规格', width: 100 },
                { field: 'height', title: '高', width: 80 }, { field: 'width', title: '宽', width: 80 }, { field: 'thick', title: '厚', width: 80 },
                { field: 'area', title: '面积', width: 90, templet: function (d) { return app.utils.accMul(d.width, d.height); } },
                { field: 'num', title: '数量', width: 80 }, { field: 'measurementUnit', title: '单位', width: 80 },
                { field: 'unitPrice', title: '单价', width: 100, templet: function (d) { return app.formatMoney(d.unitPrice); } },
                { field: 'total', title: '总价', width: 100, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'quoteType', title: '类型', width: 100 }, { field: 'comment', title: '备注', width: 120 }, { field: 'specil', title: '特型', width: 100 },
                canDelete ? { title: '操作', width: 100, toolbar: '#rowToolbar' } : { title: '', width: 1, hide: !canDelete } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDel(obj.data); });
    }
    function query() {
        if (!ctx.qid) { app.showAlert(app.warning, '缺少报价单上下文'); return; }
        app.post(api.production.queryPuotationItemByQid, { 'puotation.qid': ctx.qid }, function (res) { table.reload('resultTable', { data: res.puotationItems || [] }); });
    }
    function doDel(v) {
        app.showConfirm('是否确认删除?', function () {
            app.post(api.production.deletePuotationItem, { 'puotationItem.qiid': v.qiid, 'puotationItem.qid': ctx.qid }, function () { app.showAlert(app.success, '删除成功'); query(); });
        });
    }
});
}); // end app.ready
