/**
 * app/js/app/upload.js —— 文件上传组件（替代旧 com.uploadify / huploadify）
 *
 * 设计：基于 layui upload 模块封装，对齐后端 UploadAction 契约：
 *   - URL：config.media + 'uploadImg.do'（图片）/ 'uploadOther.do'（其他）
 *   - fileObjName：'strutsUploads'（Struts2 文件字段名，★ 勿改）
 *   - 认证：upload 的 data 里带 authentication（读 Cookie，与 com.post 一致）
 *   - 响应：{errorCode:0, resUrl:'https://...', fileInfo:{...}}，成功回调返回 res
 *
 * 对外暴露：
 *   app.upload(options) —— 单文件上传（图片，自动模式）
 *   app.uploadImage(options) —— 图片上传便捷封装（带预览）
 *   app.uploadFile(options) —— 通用文件上传
 *
 * options 参数：
 *   { elem, url(可选,默认 uploadImg.do), accept(可选), exts(可选), size(可选MB),
 *     data(可选,额外表单字段), multiple(可选,多文件), before(可选), done(res), error() }
 *
 * 用法示例（图片上传 + 预览）：
 *   app.uploadImage({
 *     elem: '#pictureUpload',
 *     done: function(res){ app.showImg($('#preview'), res.resUrl, 150, 150); }
 *   });
 *
 * ★ 注意：本组件是 layui.define 模块，需经 app.ready 或 layui.use 触发。
 */
layui.define(['upload', 'layer', 'jquery'], function (exports) {

    "use strict";

    var upload = layui.upload;
    var layer = layui.layer;
    var $ = layui.jquery;
    var cfg = app.config;

    /**
     * 统一上传方法
     * @param {Object} options 配置
     */
    function doUpload(options) {
        var o = options || {};
        var elem = o.elem;
        if (!elem) { console.error('app.upload: 缺少 elem 参数'); return; }

        // 上传地址：默认 uploadImg.do，走 media 服务
        var uploadUrl;
        if (o.url) {
            uploadUrl = cfg.media + o.url;
        } else {
            uploadUrl = cfg.media + 'uploadImg.do';
        }

        // 认证 + 额外表单字段
        var data = $.extend({ authentication: app.cookie.get('authentication') }, o.data || {});

        var renderOpt = {
            elem: elem,
            url: uploadUrl,
            // ★ Struts2 文件字段名固定为 strutsUploads（后端 UploadAction 的 setter）
            field: 'strutsUploads',
            data: data,
            // 文件类型：accept='images' 自动识别图片；exts 限定后缀
            accept: o.accept || 'images',
            exts: o.exts || 'jpg|jpeg|png|gif|bmp',
            size: o.size ? o.size * 1024 : 5 * 1024, // 默认 5MB（layui size 单位 KB）
            multiple: o.multiple || false,
            auto: o.auto !== false, // 默认自动上传
            // 请求头：用 form 方式（layui upload 默认 multipart/form-data）
            before: function (req) {
                // 显示 loading
                if (typeof o.before === 'function') o.before(req);
            },
            done: function (res) {
                // layui upload 已自动 JSON 解析
                if (res && res.errorCode == 0) {
                    if (typeof o.done === 'function') o.done(res);
                } else {
                    layer.msg('上传失败：' + (res && res.errorMsg ? res.errorMsg : '未知错误'), { icon: 2 });
                    if (typeof o.error === 'function') o.error(res);
                }
            },
            error: function () {
                layer.msg('上传失败，请检查网络', { icon: 2 });
                if (typeof o.error === 'function') o.error();
            }
        };

        // 非图片场景：accept 设为 file
        if (o.accept === 'file') {
            renderOpt.accept = 'file';
            if (!o.exts) renderOpt.exts = 'zip|rar|pdf|doc|docx|xls|xlsx|ppt|pptx|txt';
        }

        // choose 模式（手动触发上传）：返回 render 实例，可调 .upload()
        if (o.auto === false && o.bindAction) {
            renderOpt.bindAction = o.bindAction;
        }

        return upload.render(renderOpt);
    }

    /**
     * 图片上传便捷封装（带 loading 提示）
     * @param {Object} options { elem, done(res), exts?, size?, data? }
     */
    function uploadImage(options) {
        var o = options || {};
        var loader = null;
        return doUpload($.extend({}, o, {
            accept: 'images',
            before: function () {
                loader = layer.msg('上传中...', { icon: 16, shade: 0.3, time: 0 });
                if (typeof o.before === 'function') o.before();
            },
            done: function (res) {
                if (loader) layer.close(loader);
                if (typeof o.done === 'function') o.done(res);
            },
            error: function () {
                if (loader) layer.close(loader);
                if (typeof o.error === 'function') o.error();
            }
        }));
    }

    /**
     * 通用文件上传
     * @param {Object} options { elem, url?, exts?, size?, done(res), data? }
     */
    function uploadFile(options) {
        return doUpload($.extend({}, options, { accept: 'file' }));
    }

    app.upload = doUpload;
    app.uploadImage = uploadImage;
    app.uploadFile = uploadFile;

    exports('uploadApp', { upload: doUpload, uploadImage: uploadImage, uploadFile: uploadFile });
});
