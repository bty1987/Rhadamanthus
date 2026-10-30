/**
 * app/js/template/form.js —— 表单/详情页逻辑模板（纯 LayUI）
 *
 * ★ 配套 views/template/form.html + api/_template.js 使用。
 *
 * 流程：
 *   - 读 URL 参数 id（com.splitUrl 兼容）：有 id → 编辑（query 回填），无 → 新增
 *   - 保存：app.validate → add/update → 成功后返回列表（app.switchPage）
 *
 * 复制后改名：全局替换 "template" 为模块名。
 */
// 业务逻辑入口：先确保核心运行时就绪，再用 UI 模块
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form;
    var layer = layui.layer;
    var $ = layui.jquery;

    var state = { id: null, isEdit: false };

    // ========== 读 URL 参数 ==========
    state.id = getQueryParam('id');
    state.isEdit = !!state.id;

    app.breadcrumb(
        [{ icon: 'layui-icon-home', text: '模板' },
         { icon: '', text: state.isEdit ? '编辑' : '新增' }],
        '#breadcrumb'
    );

    // 编辑模式：查询回填
    if (state.isEdit) {
        app.post(api.template.queryTemplateById, { 'template.id': state.id }, function (res) {
            var d = res.template || {};
            $('#templateForm [name="id"]').val(d.id);
            $('#templateForm [name="name"]').val(d.name);
            $('#templateForm [name="price"]').val(d.price);
            $('#templateForm [name="comment"]').val(d.comment || '');
            if (d.status != null) {
                $('#templateForm [name="status"][value="' + d.status + '"]').prop('checked', true);
            }
            form.render('radio');
        });
    }

    // ========== 保存 ==========
    $('#btnSave').on('click', function () {
        if (app.validate('templateForm')) return;

        var opt = {
            'template.id': $('#templateForm [name="id"]').val(),
            'template.name': $('#templateForm [name="name"]').val(),
            'template.price': $('#templateForm [name="price"]').val(),
            'template.status': $('#templateForm [name="status"]:checked').val(),
            'template.comment': $('#templateForm [name="comment"]').val()
        };

        var apiDef = state.isEdit ? api.template.updateTemplate : api.template.addTemplate;
        if (!state.isEdit) delete opt['template.id'];

        app.post(apiDef, opt, function () {
            app.showAlert(app.success, '保存成功');
            // 返回列表（当前 iframe 内跳转）
            app.switchPage('list.html');
        });
    });

    $('#btnBack').on('click', function () {
        app.switchPage('list.html');
    });

    // ========== 工具：取 URL 参数 ==========
    function getQueryParam(name) {
        var search = location.search.substring(1);
        var pairs = search.split('&');
        for (var i = 0; i < pairs.length; i++) {
            var kv = pairs[i].split('=');
            if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || '');
        }
        return '';
    }
});
}); // end app.ready
