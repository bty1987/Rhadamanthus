/** app/js/construction/supervision4drawing.js —— 返工图纸（图库 + 上传）
 *  上下文：app.params.construction = { orderId, rwId }。
 *  queryReworkDrawingByReworkId / addReworkDrawing / deleteReworkDrawingById。 */
app.ready(function () {
layui.use(['layer', 'jquery'], function () {
    var layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var ctx = app.params.construction || {};

    if (!ctx.rwId) { app.showAlert(app.warning, '缺少返工单上下文'); }

    $('#btnBack').on('click', function () {
        app.popup('views/construction/supervision4rework.html', '返工', null, { area: ['80%', '80%'] });
    });

    // —— 图库 ——
    function loadGallery() {
        $('#reworkDrawingGallery').html('');
        app.post(api.construction.queryReworkDrawingByReworkId, { 'reworkDrawing.rwId': ctx.rwId }, function (res) {
            $.each(res.reworkDrawings || [], function (i, d) {
                appendGallery(d.rwdId, d.rwdUrl);
            });
        });
    }

    function appendGallery(imgId, imgUrl) {
        var $li = $('<li id="gallery_li' + imgId + '"><\/li>').appendTo($('#reworkDrawingGallery'));
        var $img = $('<img>').appendTo($li);
        app.showImg($img, imgUrl, 130, 130, '');
        $img.on('click', function () {
            layer.photos({ photos: { data: [{ src: /^[a-z]+:\/\//.test(imgUrl) ? imgUrl : (app.config.media + imgUrl) }] }, anim: 5 });
        });
        $('<div class="tools">删除<\/div>').on('click', function () {
            app.post(api.construction.deleteReworkDrawingById, {
                'reworkDrawing.rwId': ctx.rwId,
                'reworkDrawing.rwdId': imgId
            }, function () {
                $('#gallery_li' + imgId).remove();
            });
        }).appendTo($li);
    }

    // —— 上传 ——
    app.uploadImage({
        elem: '#pictureUpload',
        done: function (data) {
            app.post(api.construction.addReworkDrawing, {
                'reworkDrawing.rwId': ctx.rwId,
                'reworkDrawing.rwdName': '',
                'reworkDrawing.rwdUrl': data.resUrl,
                'reworkDrawing.rwdAddUrl': '',
                'reworkDrawing.filesize': data.filesize
            }, function (res) {
                var d = res.reworkDrawing || {};
                appendGallery(d.rwdId, data.resUrl);
            });
        }
    });

    loadGallery();
});
}); // end app.ready
