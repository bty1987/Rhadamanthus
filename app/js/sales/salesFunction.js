/** app/js/sales/salesFunction.js —— 销售功能配置
 * 列出销售功能（type=0），点"配置"打开多选/单选弹窗，写入 salesFunctionRight。
 * salesFunction.type: 0=API/1=条件/2=字段/3=功能/4=状态
 * 注：salesFunctionRight 接口由 right 模块提供，未迁移时调用会失败。 */
app.ready(function () {
layui.use(['table', 'layer', 'form', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, form = layui.form, $ = layui.jquery;
    var state = { editIndex: null, editName: null, editGroup: null };
    // type 标识
    var TYPE_API = 0, TYPE_COND = 1, TYPE_FIELD = 2, TYPE_FUNC = 3, TYPE_STATUS = 4;
    initTable(); loadList();

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '功能名', width: 180 },
                { field: 'comment', title: '说明', minWidth: 220 },
                { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'config') openConfig(obj.data); });
    }
    function loadList() {
        app.post(api.sales.querySalesFunction, { 'salesFunction.type': 0 }, function (res) {
            var list = (res.salesFunctions || []).slice().sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); });
            table.reload('resultTable', { data: list });
        });
    }
    function openConfig(v) {
        state.editName = v.key; state.editGroup = v.group;
        // 查询当前角色已勾选项
        var selected = {};
        app.post(api.right.querySalesFunctionRightByName, { 'salesFunctionRight.name': state.editName }, function (res) {
            $.each(res.salesFunctionRights || [], function (i, va) { if (va.salesFunction) selected[va.salesFunction.sfid] = true; });
            renderConfig(selected);
        }, function () { renderConfig(selected); });
    }
    function renderConfig(selected) {
        app.post(api.sales.querySalesFunction, { 'salesFunction.type': '' }, function (res) {
            var apiHtml = '', condHtml = '', fieldHtml = '', funcHtml = '', statusHtml = '';
            var list = (res.salesFunctions || []).slice().sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); });
            $.each(list, function (i, v) {
                if ((v.group & state.editGroup) == 0) return true;
                var checked = selected[v.sfid] ? ' checked' : '';
                var box = '<label style="margin-right:10px;display:inline-block;"><input type="checkbox" name="sfids" value="' + v.sfid + '"' + checked + ' lay-skin="primary">' + v.name + '</label>';
                if (v.type == TYPE_API) { box = '<label style="margin-right:10px;display:inline-block;"><input type="radio" name="apiSfid" value="' + v.sfid + '"' + checked + '>' + v.name + '</label>'; apiHtml += box; }
                else if (v.type == TYPE_COND) condHtml += box;
                else if (v.type == TYPE_FIELD) fieldHtml += box;
                else if (v.type == TYPE_FUNC) funcHtml += box;
                else if (v.type == TYPE_STATUS) statusHtml += box;
            });
            $('#apiData').html(apiHtml || '<span class="layui-badge layui-bg-gray">无</span>');
            $('#condArrData').html(condHtml || '<span class="layui-badge layui-bg-gray">无</span>');
            $('#fieldData').html(fieldHtml || '<span class="layui-badge layui-bg-gray">无</span>');
            $('#functionData').html(funcHtml || '<span class="layui-badge layui-bg-gray">无</span>');
            $('#statusData').html(statusHtml || '<span class="layui-badge layui-bg-gray">无</span>');
            form.render();
            state.editIndex = layer.open({ type: 1, title: '配置 - ' + state.editName, content: $('#editBox'), area: ['700px', 'auto'] });
        });
    }
    function doSave() {
        var opts = { 'salesFunctionRight.name': state.editName };
        $('#editBox input[name="sfids"]:checked').each(function (i, el) { opts['sfids[' + i + ']'] = $(el).val(); });
        var apiOne = $('#editBox input[name="apiSfid"]:checked').val();
        if (apiOne) { var k = Object.keys(opts).filter(function (x) { return x.indexOf('sfids[') === 0; }).length; opts['sfids[' + k + ']'] = apiOne; }
        app.post(api.right.updateSalesFunctionRight, opts, function () {
            app.showAlert(app.success, '配置成功'); layer.close(state.editIndex); state.editIndex = null;
        });
    }
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
