/** app/js/production/productionPicture.js —— 生产图纸（CAD + 设计图上传/查看/删除，弹窗子页）
 * 上下文：app.params.productionPicture = {pid, status}
 * 列表 queryProductionPictureByPid；上传 addProductionPicture（先上传得 resUrl）；删除 deleteProductionPicture。 */
app.ready(function () {
layui.use(['layer', 'jquery'], function () {
    var layer = layui.layer, $ = layui.jquery;
    var ctx = (window.parent && window.parent.app && window.parent.app.params.productionPicture) || app.params.productionPicture || {};
    var pid = ctx.pid, status = ctx.status;
    if (status != 1) { $('#btnCAD, #btnPic').hide(); }

    query();
    app.uploadFile({
        elem: '#btnCAD', url: 'uploadOther.do', accept: 'file', exts: 'dwg|dwt', size: 50,
        before: function () { layer.load(); },
        done: function (res) { layer.closeAll('loading'); if (res.errorCode == 0) addPicture(res, '0'); else app.showAlert(app.error, res.errorMsg || '上传失败'); }
    });
    app.uploadFile({
        elem: '#btnPic', url: 'uploadImg.do', accept: 'images', exts: 'jpg|jpeg|gif|png', size: 10,
        before: function () { layer.load(); },
        done: function (res) { layer.closeAll('loading'); if (res.errorCode == 0) addPicture(res, '1'); else app.showAlert(app.error, res.errorMsg || '上传失败'); }
    });

    function query() {
        app.post(api.production.queryProductionPictureByPid, { 'productionPicture.pid': pid }, function (res) {
            $('#cadList').empty(); $('#picList').empty();
            (res.productionPictures || []).forEach(function (p) {
                if (p.type == 0) renderCAD(p); else if (p.type == 1) renderPic(p);
            });
        });
    }
    function renderCAD(p) {
        var $box = $('<div class="layui-col-md3" style="padding:8px;"></div>');
        var $card = $('<div class="layui-card"><div class="layui-card-header">CAD</div><div class="layui-card-body"></div></div>');
        $card.find('.layui-card-body').append('<div><a href="' + app.config.media + p.path + '" target="_blank" class="layui-btn layui-btn-sm layui-btn-primary"><i class="layui-icon layui-icon-download-circle"></i>下载</a> <span class="layui-badge layui-bg-gray">' + (p.name || '') + '<\/span></div>');
        $card.find('.layui-card-body').append('<div style="margin-top:4px;color:#999;">' + (p.createTime || '') + '</div>');
        if (status == 1) {
            var $del = $('<button class="layui-btn layui-btn-sm layui-btn-danger" style="margin-top:6px;"><i class="layui-icon layui-icon-delete"></i>删除</button>');
            $del.on('click', function () { delPicture(p.ppid); });
            $card.find('.layui-card-body').append($del);
        }
        $box.append($card); $('#cadList').append($box);
    }
    function renderPic(p) {
        var $box = $('<div class="layui-col-md3" style="padding:8px;"></div>');
        var $img = $('<img style="width:100%;height:160px;object-fit:cover;cursor:pointer;">');
        app.showImg($img, p.path, 200, 160, '');
        $img.on('click', function () { layer.photos({ photos: { data: [{ src: app.config.media + p.path }] }, anim: 5 }); });
        var $info = $('<div style="margin-top:4px;"><span class="layui-badge layui-bg-blue">' + (p.name || '') + '<\/span> <span style="color:#999;">' + (p.createTime || '') + '</span></div>');
        $box.append($img).append($info);
        if (status == 1) {
            var $del = $('<button class="layui-btn layui-btn-sm layui-btn-danger" style="margin-top:6px;"><i class="layui-icon layui-icon-delete"></i>删除</button>');
            $del.on('click', function () { delPicture(p.ppid); });
            $box.append($del);
        }
        $('#picList').append($box);
    }
    function addPicture(data, type) {
        app.post(api.production.addProductionPicture, {
            'productionPicture.pid': pid,
            'productionPicture.name': data.strutsUploadsFileName,
            'productionPicture.path': data.resUrl,
            'productionPicture.status': 0,
            'productionPicture.type': type
        }, function () { app.showAlert(app.success, '上传成功'); query(); });
    }
    function delPicture(ppid) {
        app.showConfirm('确认删除该图纸?', function () {
            app.post(api.production.deleteProductionPicture, { 'productionPicture.ppid': ppid }, function () { app.showAlert(app.success, '已删除'); query(); });
        });
    }
});
}); // end app.ready
