/** app/js/customer/customerFunction.js —— 客服功能权限配置（旧 customerFunction.js → layui）
 *  列表：queryCustomerFunction(type=0 页面)。
 *  配置：queryCustomerFunctionRight → 勾选 api/condArr/propertyArr/pageBtn → updateCustomerFunctionRight。
 *  同步：选择目标公司 → syncCustomerFunctionRight（跨模块 api.right / api.system.queryCompany）。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    customerCommon.ensureApiStubs();
    var state = { name: null, apiIndex: null, syncIndex: null, syncKey: null, companys: [] };

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'name', title: '功能名', minWidth: 180 },
            { field: 'key', title: 'key', minWidth: 180 },
            { field: 'group', title: '分组', width: 140 },
            { field: 'sort', title: '排序', width: 80 },
            { title: '操作', width: 160, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'config') apiConfig(obj.data);
        else if (obj.event === 'sync') syncConfig(obj.data.key, obj.data.name);
    });
    if (!$('#rowToolbar').length) {
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="config">配置</button>'
            + '<button class="layui-btn layui-btn-xs" lay-event="sync">同步</button>'
            + '<\/script>'
        );
    }

    function queryList() {
        app.post(api.customer.queryCustomerFunction, { 'customerFunction.type': 0 }, function (res) {
            table.reload('resultTable', { data: res.customerFunctions || [] });
        });
    }
    queryList();

    // ==================== 配置 ====================
    function apiConfig(v) {
        state.name = v.key;
        var cfids = [];
        app.post(api.right.queryCustomerFunctionRight, { 'customerFunctionRight.name': state.name }, function (res) {
            $.each(res.customerFunctionRights || [], function (i, va) {
                cfids.push(va.customerFunction.cfid);
            });
        }, null, false);

        app.post(api.customer.queryCustomerFunction, { 'customerFunction.type': '' }, function (res) {
            ['apiData', 'condArrData', 'fieldData', 'functionData'].forEach(function (id) { $('#' + id).empty(); });
            var list = (res.customerFunctions || []).sort(function (x, y) { return (x.sort || 0) - (y.sort || 0); });
            $.each(list, function (i, f) {
                var isRadio = f.type == 1;
                var html = '<label style="margin:0 16px 0 0;white-space:nowrap;">'
                    + '<input type="' + (isRadio ? 'radio' : 'checkbox') + '" name="cfids" value="' + f.cfid + '" title="' + f.name + (f.type == 0 ? '' : (f.comment || '')) + '"'
                    + (cfids.indexOf(f.cfid) != -1 ? ' checked' : '') + '>'
                    + '<\/label>';
                if (f.type == 1) $('#apiData').append(html);
                else if (f.type == 2) $('#condArrData').append(html);
                else if (f.type == 3) $('#fieldData').append(html);
                else if (f.type == 4) $('#functionData').append(html);
            });
            state.apiIndex = layer.open({ type: 1, title: '功能配置: ' + v.name, content: $('#apiBox'), area: ['720px', '80%'] });
        });
    }

    $('#btnApiSave').on('click', function () {
        var options = { 'customerFunctionRight.name': state.name };
        var checked = $('#apiForm input[name="cfids"]:checked');
        if (!checked.length) { app.showAlert(app.warning, '请至少选择一项配置'); return; }
        checked.each(function (i) {
            options['cfids[' + i + ']'] = $(this).val();
        });
        app.post(api.right.updateCustomerFunctionRight, options, function () {
            app.showAlert(app.success, '配置成功');
            layer.close(state.apiIndex);
        });
    });
    $('#btnApiCancel').on('click', function () { layer.close(state.apiIndex); });

    // ==================== 同步 ====================
    function syncConfig(key, name) {
        state.syncKey = key;
        $('#syncFunctionName').text(name);
        $('#companyList').html('<div style="color:#999;">正在加载公司列表...<\/div>');
        state.syncIndex = layer.open({ type: 1, title: '同步功能配置', content: $('#syncBox'), area: ['520px', 'auto'] });
        app.post(api.system.queryCompany, {}, function (res) {
            state.companys = res.companys || [];
            renderCompanyList();
        }, function () {
            $('#companyList').html('<div style="color:#FF5722;">加载公司列表失败<\/div>');
        });
    }

    function renderCompanyList() {
        if (!state.companys.length) {
            $('#companyList').html('<div style="color:#999;">暂无可选公司<\/div>');
            return;
        }
        $('#companyList').empty();
        $.each(state.companys, function (i, company) {
            $('#companyList').append('<label style="margin:0 16px 0 0;"><input type="checkbox" class="company-checkbox" value="' + company.cid + '" title="' + company.name + '"><\/label>');
        });
    }

    $('#btnSyncConfirm').on('click', function () {
        var selected = [];
        $('.company-checkbox:checked').each(function () { selected.push($(this).val()); });
        if (!selected.length) { app.showAlert(app.warning, '请至少选择一个目标公司'); return; }
        var params = { 'customerFunctionRight.name': state.syncKey };
        $.each(selected, function (i, v) { params['companys[' + i + ']'] = v; });
        app.post(api.right.syncCustomerFunctionRight, params, function () {
            app.showAlert(app.success, '同步成功！');
            layer.close(state.syncIndex);
        }, function (res) {
            app.showAlert(app.error, '同步失败：' + (res && res.errorMsg ? res.errorMsg : '网络错误'));
        });
    });
    $('#btnSyncCancel').on('click', function () { layer.close(state.syncIndex); });
});
}); // end app.ready
