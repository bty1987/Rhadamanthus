/** app/js/store/picture.js —— 商品图片（上传轮播/详情图 + 删除）
 * 两种图片：type=0 轮播图，type=1 详情图；按 gid 查询 */
app.ready(function () {
layui.use(['table', 'layer', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, $ = layui.jquery;

    initTable();
    query();

    // 上传轮播图（type=0）
    app.uploadImage({
        elem: '#slideUpload',
        done: function (res) { addPicture(res.resUrl, 0); }
    });
    // 上传详情图（type=1）
    app.uploadImage({
        elem: '#detailUpload',
        done: function (res) { addPicture(res.resUrl, 1); }
    });

    function currentGid() { return $('#searchGid').val() || 0; }

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'img', title: '图片', width: 120, templet: function (d) { return d.img ? '<img src="' + d.img + '" style="width:80px;height:60px;object-fit:cover;border-radius:4px;">' : ''; } },
                { field: 'type', title: '类型', width: 100, templet: function (d) { return d.type == 0 ? '<span class="layui-badge layui-bg-blue">轮播图</span>' : '<span class="layui-badge layui-bg-cyan">详情图</span>'; } },
                { field: 'gid', title: '商品ID', width: 100 },
                { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDelete(obj.data); });
    }

    function query() {
        app.post(api.store.queryPictureByGid, { 'picture.gid': currentGid() }, function (res) {
            table.reload('resultTable', { data: res.pictures || [] });
        });
    }

    function addPicture(imgUrl, type) {
        app.post(api.store.addPicture, { 'picture.gid': currentGid(), 'picture.img': imgUrl, 'picture.type': type }, function () {
            app.showAlert(app.success, '上传成功'); query();
        });
    }

    function doDelete(d) {
        app.showConfirm('确认删除该图片？', function () {
            app.post(api.store.deletePicture, { 'picture.pid': d.pid }, function () { app.showAlert(app.success, '已删除'); query(); });
        });
    }

    $('#btnSearch').on('click', query);
});
}); // end app.ready
