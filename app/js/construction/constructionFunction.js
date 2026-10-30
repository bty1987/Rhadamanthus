/** app/js/construction/constructionFunction.js —— 施工功能权限配置（按页面分组配置 + 跨公司同步）
 *  type 约定：0页面分组 1api(单选) 2条件 3字段 4功能。
 *  配置：queryConstructionFunction(type='') + queryConstructionFunctionRightByName → updateConstructionFunctionRight。
 *  同步：queryCompany → syncConstructionFunctionRight（companys[i]）。 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();

    var TYPE_TYPE_INT = 0, TYPE_API_INT = 1, TYPE_CONDITION_INT = 2, TYPE_FIELD_INT = 3, TYPE_FUNCTION_INT = 4;

    var state = { name: {}, cfids: [], currentSyncKey: null, companys: [] };

    // —— 页面分组列表 ——
    app.post(api.construction.queryConstructionFunction, { 'constructionFunction.type': TYPE_TYPE_INT }, function (res) {
        var list = (res.constructionFunctions || []).sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); });
        var html = '';
        $.each(list, function (i, v) {
            html += '<div class="app-card" style="background:#fff;border-radius:4px;box-shadow:0 1px 3px rgba(0,0,0,.05);padding:12px 18px;margin-bottom:10px;display:flex;align-items:center;">'
                + '<span style="font-size:15px;font-weight:bold;flex:1;">' + (v.value || '') + (v.comment ? ' ' + v.comment : '') + '<\/span>'
                + '<button type="button" class="layui-btn layui-btn-sm layui-btn-warm" data-name="' + v.name + '">配置<\/button>'
                + '<button type="button" class="layui-btn layui-btn-sm" data-sync="' + v.name + '" data-display="' + (v.value || v.name) + '" style="margin-left:8px;">同步<\/button>'
                + '<\/div>';
        });
        $('#resultList').html(html);

        $('#resultList').off('click', 'button[data-name]').on('click', 'button[data-name]', function () {
            apiConfig($(this).attr('data-name'));
        });
        $('#resultList').off('click', 'button[data-sync]').on('click', 'button[data-sync]', function () {
            syncConfig($(this).attr('data-sync'), $(this).attr('data-display'));
        });
    });

    // —— 配置弹窗 ——
    function apiConfig(name) {
        state.name = name;
        state.cfids = [];

        // 当前公司已配置项
        app.post(api.right.queryConstructionFunctionRightByName, { 'constructionFunctionRight.name': name }, function (res) {
            $.each(res.constructionFunctionRights || [], function (i, va) {
                state.cfids.push(va.constructionFunction.cfid);
            });
        }, null, false);

        // 全部可选功能项
        app.post(api.construction.queryConstructionFunction, { 'constructionFunction.type': '' }, function (res) {
            $('#apiData,#condArrData,#fieldData,#functionData').html('');
            var list = (res.constructionFunctions || []).sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); });

            var htmls = { api: '', cond: '', field: '', func: '' };
            $.each(list, function (i, v) {
                if (v.type == TYPE_TYPE_INT) return;          // 跳过页面分组
                if (v.name != state.name) return;             // 仅当前页面
                var inputType = v.type == TYPE_API_INT ? 'radio' : 'checkbox';
                var checked = state.cfids.indexOf(v.cfid) != -1 ? 'checked' : '';
                var label = v.comment ? v.comment : v.value;
                var item = '<span style="display:inline-block;margin:4px 14px 4px 0;">'
                    + '<input type="' + inputType + '" name="cfids" value="' + v.cfid + '" ' + checked + ' title="' + label + '"><\/span>';
                if (v.type == TYPE_API_INT) htmls.api += item;
                else if (v.type == TYPE_CONDITION_INT) htmls.cond += item;
                else if (v.type == TYPE_FIELD_INT) htmls.field += item;
                else if (v.type == TYPE_FUNCTION_INT) htmls.func += item;
            });
            $('#apiData').html(htmls.api || '<span style="color:#999;">无<\/span>');
            $('#condArrData').html(htmls.cond || '<span style="color:#999;">无<\/span>');
            $('#fieldData').html(htmls.field || '<span style="color:#999;">无<\/span>');
            $('#functionData').html(htmls.func || '<span style="color:#999;">无<\/span>');
            form.render();
        });

        layer.open({ type: 1, title: '配置 - ' + name, content: $('#apiBox'), area: ['640px', '80%'],
            btn: ['确定', '取消'], yes: function (idx) {
                var options = { 'constructionFunctionRight.name': state.name };
                var $inputs = $('#apiBox input[name="cfids"]:checked');
                $.each($inputs, function (i, v) { options['cfids[' + i + ']'] = $(v).val(); });
                if ($inputs.length == 0) options['cfids[0]'] = '';
                app.post(api.right.updateConstructionFunctionRight, options, function () {
                    app.showAlert(app.success, '配置成功');
                    layer.close(idx);
                });
            } });
    }

    // —— 同步弹窗 ——
    function syncConfig(name, displayName) {
        state.currentSyncKey = name;
        $('#syncFunctionName').text(displayName || name);
        $('#companyList').html('<div style="text-align:center;color:#999;">正在加载公司列表...<\/div>');
        layer.open({ type: 1, title: '同步配置 - ' + (displayName || name), content: $('#syncBox'), area: ['480px', 'auto'],
            btn: ['同步', '取消'], yes: function (idx) {
                var selected = [];
                $('#companyList input[name="companyItem"]:checked').each(function () { selected.push($(this).val()); });
                if (!selected.length) { app.showAlert(app.warning, '请至少选择一个目标公司'); return; }
                var params = { 'constructionFunctionRight.name': state.currentSyncKey };
                $.each(selected, function (i, v) { params['companys[' + i + ']'] = v; });
                app.post(api.right.syncConstructionFunctionRight, params, function () {
                    app.showAlert(app.success, '同步成功！');
                    layer.close(idx);
                });
            } });
        loadCompanyList();
    }

    function loadCompanyList() {
        app.post(api.system.queryCompany, {}, function (res) {
            state.companys = res.companys || [];
            var html = '';
            $.each(state.companys, function (i, company) {
                html += '<div style="margin:4px 0;"><input type="checkbox" name="companyItem" value="' + company.cid + '" title="' + company.name + '"><\/div>';
            });
            $('#companyList').html(html || '<div style="text-align:center;color:#999;">暂无可选公司<\/div>');
            form.render('checkbox');
        }, function () {
            $('#companyList').html('<div style="text-align:center;color:#FF5722;">加载公司列表失败<\/div>');
        });
    }
});
}); // end app.ready
