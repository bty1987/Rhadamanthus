/** app/js/test/upload-test.js —— 文件上传功能测试页
 * 三个用例：app.uploadImage 单图 / app.uploadImage 批量(多选,最多5张) / app.uploadFile 文档，
 * 成功后展示 resUrl 与文件名并追加日志。原 WebContent 版为静态结构演示（模拟 config/按钮占位）。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;

    function addLog(message, type) {
        type = type || 'info';
        var color = type === 'success' ? '#16baaa' : type === 'error' ? '#ff5722' : '#333';
        var time = new Date().toLocaleTimeString();
        var $area = $('#logArea');
        if ($area.find('div').length == 1 && $.trim($area.text()) == '等待上传...') $area.html('');
        $area.append('<div style="color:' + color + ';margin:4px 0;"><strong>[' + time + ']<\/strong> ' + message + '<\/div>');
        $area.scrollTop($area[0].scrollHeight);
    }

    function previewImage($box, res) {
        $box.append('<div class="preview-item"><img src="' + res.resUrl + '"><p>' + (res.strutsUploadsFileName || '') + '<\/p><\/div>');
    }

    // ===== 测试1：单图片上传 =====
    app.uploadImage({
        elem: '#uploadBtn1',
        exts: 'jpg|jpeg|png|gif',
        size: 5,
        before: function () { addLog('测试1：开始上传...', 'info'); },
        done: function (res) {
            $('#result1').html('<span class="ok">上传成功：' + res.resUrl + '<\/span>');
            previewImage($('#preview1'), res);
            addLog('单图上传成功：' + res.resUrl, 'success');
        },
        error: function () {
            $('#result1').html('<span class="fail">上传失败<\/span>');
            addLog('单图上传失败', 'error');
        }
    });

    // ===== 测试2：批量图片上传（多选，逐张自动上传） =====
    app.uploadImage({
        elem: '#uploadBtn2',
        exts: 'jpg|jpeg|png',
        size: 5,
        multiple: true,
        before: function () { addLog('测试2：批量上传中...', 'info'); },
        done: function (res) {
            previewImage($('#preview2'), res);
            $('#result2').html('<span class="ok">已成功 ' + $('#preview2 .preview-item').length + ' 张<\/span>');
            addLog('批量单张上传成功：' + res.resUrl, 'success');
        },
        error: function () {
            $('#result2').html('<span class="fail">批量上传失败<\/span>');
            addLog('批量上传失败', 'error');
        }
    });

    // ===== 测试3：文档上传（PDF/Word/Excel，走 uploadOther.do） =====
    app.uploadFile({
        elem: '#uploadBtn3',
        url: 'uploadOther.do',
        exts: 'pdf|doc|docx|xls|xlsx',
        size: 20,
        before: function () { addLog('测试3：文档上传中...', 'info'); },
        done: function (res) {
            $('#result3').html('<span class="ok">文档上传成功<\/span>');
            $('#fileList3').html('<div class="preview-item"><p>文件名：' + (res.strutsUploadsFileName || '') + '<\/p><p>路径：' + res.resUrl + '<\/p><\/div>');
            addLog('文档上传成功：' + res.resUrl, 'success');
        },
        error: function () {
            $('#result3').html('<span class="fail">文档上传失败<\/span>');
            addLog('文档上传失败', 'error');
        }
    });

    addLog('文件上传测试页已加载，请点击各测试区的按钮选择文件', 'info');
});
});
