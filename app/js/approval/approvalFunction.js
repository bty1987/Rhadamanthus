/** app/js/approval/approvalFunction.js —— 审批功能配置
  queryApprovalFunction(type=0) 列出所有分类；点击分类→ queryApprovalFunction(fieldType=key) 列出可勾选项；
  已勾选项来自 queryApprovalFunctionRight(name=key)；保存 updateApprovalFunctionRight。
  注：api.right 在 app 未注册，此处本地补一个最小定义供 app.post 使用。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;

    // 本地补 api.right（旧 com.api.right 的两个端点，approvalFunction 专用）
    api.right = api.right || {};
    api.right.queryApprovalFunctionRight = { url: 'queryApprovalFunctionRight.do' };
    api.right.updateApprovalFunctionRight = { url: 'updateApprovalFunctionRight.do' };

    var ctx = { name: null, cfids: [], editIndex: null };

    initTable();
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'name', title: '功能名称', minWidth: 200 },
                { field: 'key', title: '标识', width: 200 },
                { field: 'comment', title: '说明', minWidth: 160 },
                { title: '操作', width: 120, toolbar: '#rowToolbar' } ]],
            done: function () { /* 无分页 */ }
        });
        // 自定义 toolbar 模板（动态注入）
    }
    // 注入行工具模板
    $('body').append('<script type="text/html" id="rowToolbar"><button class="layui-btn layui-btn-xs" lay-event="config">配置</button><\/script>');
    table.on('tool(resultTable)', function (obj) { if (obj.event === 'config') openConfig(obj.data); });

    // 首次加载分类列表（type=0）
    app.post(api.approval.queryApprovalFunction, { 'approvalFunction.type': 0 }, function (res) {
        table.reload('resultTable', { data: res.approvalFunctions || [] });
    });

    function openConfig(v) {
        ctx.name = v.key; ctx.cfids = [];
        $('#apiData, #condArrData, #fieldData, #functionData').empty();
        // 1. 查已配置项
        app.post(api.right.queryApprovalFunctionRight, { 'approvalFunctionRight.name': ctx.name }, function (res) {
            $.each(res.approvalFunctionRights || [], function (i, va) { ctx.cfids.push(va.approvalFunction.cfid); });
            // 2. 查该分类下的所有可选项
            app.post(api.approval.queryApprovalFunction, { 'approvalFunction.type': '', 'approvalFunction.fieldType': ctx.name }, function (r2) {
                var arr = (r2.approvalFunctions || []).sort(function (x, y) { return (x.sort || 0) - (y.sort || 0); });
                $.each(arr, function (i, f) {
                    var checked = ctx.cfids.indexOf(f.cfid) != -1 ? ' checked' : '';
                    var inputType = f.type == 1 ? 'radio' : 'checkbox';
                    var label = esc(f.name) + (f.type == 0 ? '' : (f.comment ? ' (' + esc(f.comment) + ')' : ''));
                    var html = '<label style="display:inline-block;width:33%;padding:4px 0;"><input type="' + inputType + '" name="cfids" value="' + f.cfid + '"' + checked + ' title="' + label + '"><span style="margin-left:6px;">' + label + '</span></label>';
                    if (f.type == 1) $('#apiData').append(html);
                    else if (f.type == 2) $('#condArrData').append(html);
                    else if (f.type == 3) $('#fieldData').append(html);
                    else if (f.type == 4) $('#functionData').append(html);
                });
                ctx.editIndex = layer.open({ type: 1, title: '配置 - ' + esc(v.name), content: $('#editBox'), area: ['700px', '80%'] });
            });
        });
    }

    $('#saveBtn').on('click', function () {
        var o = { 'approvalFunctionRight.name': ctx.name };
        var n = 0;
        $('#editBox input[name="cfids"]:checked').each(function () { o['cfids[' + (n++) + ']'] = $(this).val(); });
        app.post(api.right.updateApprovalFunctionRight, o, function () {
            app.showAlert(app.success, '配置成功'); layer.close(ctx.editIndex); ctx.editIndex = null;
        });
    });
    $('#cancelBtn').on('click', function () { layer.close(ctx.editIndex); ctx.editIndex = null; });

    function esc(s) { return $('<div/>').text(s == null ? '' : s).html(); }
});
}); // end app.ready
