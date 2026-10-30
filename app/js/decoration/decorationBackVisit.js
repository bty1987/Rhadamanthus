/** app/js/decoration/decorationBackVisit.js —— 装修单回访（时间线 → layui table，添加回访+提醒人员）
 *  上下文：app.params.decoration = { orderId }；app.params.historyPage 返回页。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var ctx = app.params.decoration || {};
    var editIndex = null;

    if (!ctx.orderId) { app.showAlert(app.warning, '缺少订单上下文'); }

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'sender', title: '发送人', width: 120 },
            { field: 'createTime', title: '时间', width: 180 },
            { field: 'content', title: '回访内容', minWidth: 300 } ]] });

    loadUsers(); query();

    function query() {
        app.post(api.decoration.queryDecorationBackVisitByOrderId, { 'backVisit.orderId': ctx.orderId }, function (res) {
            table.reload('resultTable', { data: res.backVisits || [] });
        });
    }

    // 提醒人员下拉（旧 tag 输入按拼音找人 → 新多选下拉，queryUserByPinyin 全量取启用户）
    function loadUsers() {
        app.post(api.personel.queryUserByPinyin, { 'user.status': 0, 'departmentType.name': '' }, function (res) {
            var list = res.autoFillKeyValue || [];
            var html = '';
            $.each(list, function (i, v) { html += '<option value="' + v.key + '">' + v.value + '<\/option>'; });
            $('#receivers').append(html);
            form.render('select');
        });
    }

    $('#btnAdd').on('click', function () {
        $('#editForm')[0].reset();
        $('#receivers option').prop('selected', false);
        form.render('select');
        editIndex = layer.open({ type: 1, title: '添加回访 - ' + (ctx.orderId || ''), content: $('#editBox'), area: ['520px', 'auto'],
            btn: ['保存', '取消'], yes: function () { doSave(); } });
    });

    function doSave() {
        var content = $.trim($('#content').val());
        if (!content) { app.showAlert(app.warning, '请输入回访内容'); return; }
        var opts = { 'backVisit.orderId': ctx.orderId, 'backVisit.content': content };
        var people = $('#receivers').val() || [];
        $.each(people, function (i, v) { opts['backVisit.receivers[' + i + ']'] = v; });
        app.post(api.decoration.addDecorationBackVisit, opts, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(editIndex); editIndex = null; query();
        });
    }

    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || api.index.decorationIndex.url); });
});
}); // end app.ready
