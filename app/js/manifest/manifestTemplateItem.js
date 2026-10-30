/** app/js/manifest/manifestTemplateItem.js —— 货单模板项（按 mtid 查看，删除/添加）
 *  对齐旧 WebContent/js/manifest/manifestTemplateItem.js。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var mtid = getQueryParam('mtid');

    if (!mtid) { app.showAlert(app.warning, '缺少 mtid 参数'); return; }

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'manifestTemplate', title: '模板名称', width: 140, templet: function (d) { return d.manifestTemplate ? d.manifestTemplate.name : ''; } },
            { field: 'goods', title: '商品编号', width: 120, templet: function (d) { return d.goods ? d.goods.no : ''; } },
            { field: 'goods', title: '商品', minWidth: 140, templet: function (d) { return d.goods ? d.goods.name : ''; } },
            { field: 'goods', title: '条形码', width: 120, templet: function (d) { return d.goods ? d.goods.barcode : ''; } },
            { field: 'goods', title: '品类', width: 100, templet: function (d) { return d.goods ? d.goods.category : ''; } },
            { field: 'goods', title: '品牌', width: 100, templet: function (d) { return d.goods ? d.goods.brand : ''; } },
            { field: 'goods', title: '单位', width: 80, templet: function (d) { return d.goods ? d.goods.measurementUnit : ''; } },
            { field: 'goods', title: '类型', width: 80, templet: function (d) { return d.goods ? (d.goods.type == 0 ? '商品' : '套餐') : ''; } },
            { field: 'goods', title: '件数', width: 80, align: 'right', templet: function (d) { return d.goods ? d.goods.pieceNum : ''; } },
            { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'del') {
            var v = obj.data;
            app.showConfirm('是否确定删除?', function () {
                app.post(api.inventory.deleteManifestTemplateItem, { 'manifestTemplate.mtid': mtid, 'mtiids[0]': v.mtiid }, function () { app.showAlert(app.success, '操作成功'); query(); });
            });
        }
    });

    function query() {
        app.post(api.inventory.queryManifestTemplateItemByMtid, { 'manifestTemplate.mtid': mtid }, function (res) {
            table.reload('resultTable', { data: res.manifestTemplateItems || [] });
        });
    }
    query();

    $('#btnAdd').on('click', function () { app.switchPage('manifestTemplateItem2add.html?mtid=' + mtid); });
    $('#btnBack').on('click', function () { app.switchPage('manifestTemplate.html'); });

    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
