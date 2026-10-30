/** app/js/decoration/decorationPicture.js —— 巡检图纸
 *  列表：data.queryInspect（status=0 巡检项）；按行上传合同方案图（uploadImg → addDecorationPicture type=1）
 *  + 按订单批量更新图片状态（batchDecorationPicture：1显示/4确认/0隐藏）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'upload', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, upload = layui.upload, layer = layui.layer, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    // 本地补 api.data.queryInspect（data 模块未含巡检子域）
    if (!api.data.queryInspect) api.data.queryInspect = { url: 'queryInspect.do' };

    var state = { page: 1, rows: 10, total: 0, curIid: null, orderId: null };
    var pendingImages = [];   // 待上传图片

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'name', title: '名称', minWidth: 200 },
            { title: '操作', width: 160, toolbar: '#rowToolbar' } ]] });

    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'upload') {
            state.curIid = obj.data.iid;
            state.orderId = obj.data.orderId || state.orderId;
            pendingImages = [];
            $('#picArea').html('');
            $('#fileInput').click();
        }
    });

    // 选择图片 → 预览（旧 FileReader 方式保留）
    $('#fileInput').on('change', function (event) {
        var files = event.target.files;
        for (var i = 0; i < files.length; i++) {
            (function (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    pendingImages.push({ data: e.target.result, name: file.name });
                    $('#picArea').append('<img src="' + e.target.result + '" style="max-width:120px;max-height:120px;margin:4px;border:1px solid #eee;">');
                };
                reader.readAsDataURL(file);
            })(files[i]);
        }
        $('#fileInput').val('');
        // 全部读完后弹出确认上传
        setTimeout(function () {
            if (!pendingImages.length) return;
            layer.confirm('已选择 ' + pendingImages.length + ' 张图片，确认上传为合同方案图？', { title: '上传合同方案' }, function (idx) {
                layer.close(idx); doUploadAll();
            });
        }, 400);
    });

    // base64 → File → FormData → media uploadImg，成功后 addDecorationPicture(type=1)
    function doUploadAll() {
        var loader = app.showLoading('上传中...');
        var doneCount = 0;
        function oneDone() {
            doneCount++;
            if (doneCount >= pendingImages.length) {
                app.hideLoading(loader);
                app.showAlert(app.success, '上传成功');
                pendingImages = []; $('#picArea').html('');
            }
        }
        $.each(pendingImages, function (i, img) {
            var arr = img.data.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8 = new Uint8Array(n);
            while (n--) { u8[n] = bstr.charCodeAt(n); }
            var fd = new FormData();
            fd.append('strutsUploads', new File([u8], img.name, { type: mime }));
            $.ajax({
                url: app.config.media + 'uploadImg.do', type: 'POST', data: fd, processData: false, contentType: false,
                success: function (result) {
                    if (result && result.errorCode == 0) {
                        app.post(api.decoration.addDecorationPicture, {
                            'decorationPicture.orderId': state.orderId,
                            'decorationPicture.name': result.strutsUploadsFileName || img.name,
                            'decorationPicture.path': result.resUrl,
                            'decorationPicture.type': 1,
                            'decorationPicture.status': 1
                        }, oneDone, oneDone);
                    } else { app.showAlert(app.error, '上传失败'); oneDone(); }
                },
                error: function () { app.showAlert(app.error, '上传失败'); oneDone(); }
            });
        });
    }

    // 批量状态（1显示 / 4确认展示 / 0隐藏）
    function batchUpdatePictureStatus(status) {
        var checked = $('input.pic-check:checked');
        var selected = [];
        checked.each(function () { selected.push($(this).data()); });
        // 列表页无已上传图片勾选时，提示（旧版按图片复选框操作；此处预留批量入口）
        if (!selected.length) { app.showAlert(app.warning, '请先选择图片'); return; }
        var orderId = selected[0].orderId;
        var data = {};
        $.each(selected, function (i, s) {
            data['decorationPictures[' + i + '].dpId'] = s.dpid;
            data['decorationPictures[' + i + '].orderId'] = orderId;
            data['decorationPictures[' + i + '].status'] = status;
        });
        app.post(api.decoration.batchDecorationPicture, data, function () {
            app.showAlert(app.success, '操作成功，已更新 ' + selected.length + ' 张图片状态');
        });
    }
    $('#batchShow').on('click', function () { batchUpdatePictureStatus(1); });
    $('#batchConfirm').on('click', function () { batchUpdatePictureStatus(4); });
    $('#batchHide').on('click', function () { batchUpdatePictureStatus(0); });

    function query(pg) {
        state.page = pg || 1;
        app.post(api.data.queryInspect, $.extend({}, { 'inspect.status': 0 }, { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || (res.inspects || []) });
            state.total = p.totalRecords || (res.inspects || []).length;
            rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    query(1);
});
}); // end app.ready
