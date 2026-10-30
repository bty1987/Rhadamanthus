/** app/js/payment/walletres.js —— 钱包资源（弹窗子页）
 *  上下文：app.params.payment = { wid }。上传图片资源（layui upload），分类型展示，可删除。 */
app.ready(function () {
layui.use(['upload', 'layer', 'jquery'], function () {
    var upload = layui.upload, layer = layui.layer, $ = layui.jquery;
    var ctx = app.params.payment || {};
    var TYPE = { 0: '身份证', 1: '银行卡', 2: '其他' };
    if (!ctx.wid) { $('#resList').html('<p>缺少钱包信息<\/p>'); return; }
    upload.render({ elem: '#btnUpload', url: app.config.media + 'uploadOther.do', accept: 'images', exts: 'jpg|jpeg|png|gif', size: 5120, data: { uploadType: 2 }, before: function () { layer.load(); }, done: function (res) {
        layer.closeAll('loading');
        if (res.errorCode != 0) { layer.msg(res.errorMessage || '上传失败'); return; }
        app.post(api.payment.addWalletres, { 'walletres.wid': ctx.wid, 'walletres.name': res.strutsUploadsFileName, 'walletres.path': res.resUrl, 'walletres.type': $('#resType').val(), 'walletres.comment': '', 'walletres.filesize': res.filesize }, function (r) {
            app.showAlert(app.success, '上传成功'); addPic(r.walletres); loadList();
        });
    } });
    function loadList() {
        app.post(api.payment.queryWalletres, { 'walletres.wid': ctx.wid }, function (res) {
            var list = res.walletreses || [];
            $('#resList').html('');
            if (!list.length) { $('#resList').html('<p style="text-align:center;color:#999;">暂无资源<\/p>'); return; }
            list.forEach(function (v) { addPic(v); });
        });
    }
    function addPic(v) {
        var src = /^[a-z]+:\/\//.test(v.path) ? v.path : (app.config.media + v.path);
        var html = '<div style="display:inline-block;margin:8px;border:1px solid #e6e6e6;padding:8px;width:220px;vertical-align:top;" id="wr_' + v.wrid + '">'
            + '<img src="' + src + '" style="width:200px;height:200px;object-fit:cover;display:block;">'
            + '<div style="margin-top:6px;"><span class="layui-badge layui-bg-blue">' + (TYPE[v.type] || '其他') + '<\/span> <span style="font-size:12px;color:#666;">' + (v.name || '') + '<\/span></div>'
            + '<button type="button" class="layui-btn layui-btn-xs layui-btn-danger" style="margin-top:6px;" data-del="' + v.wrid + '"><i class="layui-icon layui-icon-delete"><\/i>删除</button>'
            + '</div>';
        $('#resList').append(html);
        $('[data-del="' + v.wrid + '"]').on('click', function () {
            app.showConfirm('确认删除该资源?', function () {
                app.post(api.payment.deleteWalletres, { 'walletres.wrid': v.wrid }, function () { $('#wr_' + v.wrid).remove(); });
            });
        });
    }
    loadList();
});
}); // end app.ready
