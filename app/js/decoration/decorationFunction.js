/** app/js/decoration/decorationFunction.js —— 装修单功能配置
 *  列表：queryDecorationFunction(type=0 页面级功能)；
 *  配置：queryDecorationFunctionRightByName 取已选 dfid → queryDecorationFunction 全量按 type 分组（1api/2条件/3字段/4功能/5节点/6状态/7公司）→ updateDecorationFunctionRight 保存；
 *  同步：queryCompany 勾选 → syncDecorationFunctionRight。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var cfgName = null, dfids = [], curSyncKey = null, curSyncName = '';

    var GROUPS = [null, 'apiData', 'condArrData', 'fieldData', 'functionData', 'nodeData', 'statusData', 'companyData'];
    var GROUP_TITLES = { 1: '接口', 2: '条件', 3: '字段', 4: '功能', 5: '节点', 6: '状态', 7: '公司' };

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'name', title: '页面标识', width: 180 },
            { field: 'comment', title: '说明', minWidth: 220 },
            { field: 'type', title: '类型', width: 80 },
            { field: 'sort', title: '排序', width: 80 },
            { title: '操作', width: 160, toolbar: '#rowToolbar' } ]] });

    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'config') apiConfig(obj.data.key);
        else if (obj.event === 'sync') syncConfig(obj.data.key, obj.data.name);
    });

    function load() {
        app.post(api.decoration.queryDecorationFunction, { 'decorationFunction.type': 0 }, function (res) {
            table.reload('resultTable', { data: res.decorationFunctions || [] });
        });
    }
    load();

    // —— 配置弹窗 ——
    function apiConfig(key) {
        cfgName = key; dfids = [];
        app.post(api.right.queryDecorationFunctionRightByName, { 'decorationFunctionRight.name': key }, function (res) {
            $.each(res.decorationFunctionRights || [], function (i, v) { dfids.push(v.decorationFunction.dfid); });
        }, null, false);

        app.post(api.decoration.queryDecorationFunction, { 'decorationFunction.type': '' }, function (res) {
            var list = (res.decorationFunctions || []).sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); });
            for (var g = 1; g <= 7; g++) { $('#' + GROUPS[g]).html('<span style="color:#999;">无<\/span>'); }
            $.each(list, function (i, v) {
                var gid = parseInt(v.type, 10);
                var box = $('#' + GROUPS[gid]);
                if (box.length && (gid >= 1 && gid <= 7)) {
                    if (box.find('input').length === 0) box.html('');
                    var isRadio = (gid == 1 || gid == 7);
                    var checked = dfids.indexOf(v.dfid) != -1 ? ' checked' : '';
                    box.append('<span style="display:inline-block;margin:2px 10px 2px 0;">'
                        + '<input type="' + (isRadio ? 'radio' : 'checkbox') + '" name="' + (gid == 7 ? 'comDfids' : 'dfids') + '" value="' + v.dfid + '" title="' + (v.name || '') + (v.type == 1 && v.comment ? v.comment : '') + '"' + checked + '>'
                        + '<\/span>');
                }
            });
            form.render();
            layer.open({ type: 1, title: '功能配置 - ' + key, content: $('#configBox'), area: ['720px', '80%'],
                btn: ['确定', '取消'], yes: function (idx) {
                    var opts = { 'decorationFunctionRight.name': cfgName };
                    var $inputs = $('input[name="dfids"]:checked');
                    $.each($inputs, function (i, v) { opts['dfids[' + i + ']'] = $(v).val(); });
                    var $com = $('input[name="comDfids"]:checked');
                    if ($com.length) opts['dfids[' + $inputs.length + ']'] = $com.val();
                    app.post(api.right.updateDecorationFunctionRight, opts, function () {
                        app.showAlert(app.success, '配置成功');
                        layer.close(idx); load();
                    });
                } });
        });
    }

    // —— 同步弹窗 ——
    function syncConfig(key, name) {
        curSyncKey = key; curSyncName = name;
        $('#syncFunctionName').text(name);
        $('#companyList').html('<p style="color:#999;">正在加载公司列表...<\/p>');
        app.post(api.system.queryCompany, {}, function (res) {
            var list = res.companys || [];
            if (!list.length) { $('#companyList').html('<p style="color:#999;">暂无可选公司<\/p>'); return; }
            var html = '';
            $.each(list, function (i, c) {
                html += '<div style="display:inline-block;margin:4px 12px;"><input type="checkbox" class="company-checkbox" value="' + c.cid + '" title="' + c.name + '"><\/div>';
            });
            $('#companyList').html(html);
            form.render();
        }, function () { $('#companyList').html('<p style="color:#c00;">加载公司列表失败<\/p>'); });
        layer.open({ type: 1, title: '同步配置 - ' + name, content: $('#syncBox'), area: ['560px', 'auto'],
            btn: ['同步', '取消'], yes: function (idx) {
                var companies = $('.company-checkbox:checked');
                if (!companies.length) { app.showAlert(app.warning, '请至少选择一个目标公司'); return; }
                var opts = { 'decorationFunctionRight.name': curSyncKey };
                companies.each(function (i, v) { opts['companys[' + i + ']'] = $(v).val(); });
                var loader = app.showLoading('正在同步装饰功能配置...');
                app.post(api.right.syncDecorationFunctionRight, opts, function () {
                    app.hideLoading(loader);
                    app.showAlert(app.success, '同步成功！');
                    layer.close(idx);
                }, function () {
                    app.hideLoading(loader);
                    app.showAlert(app.error, '同步请求失败');
                });
            } });
    }
});
}); // end app.ready
