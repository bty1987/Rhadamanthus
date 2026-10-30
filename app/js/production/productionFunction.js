/** app/js/production/productionFunction.js —— 生产功能权限配置
 * 上下文：app.params.productionFunction = {action}（action: production/hardware/outsource/productionPlan/tranpack）
 * 列表 queryProductionFunction（funtype 按 action 过滤）；配置 api.right.queryProductionFunctionRightByName；
 * 提交 api.right.updateProductionFunctionRight。 */
app.ready(function () {
layui.use(['table', 'layer', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, $ = layui.jquery;
    var ctx = app.params.productionFunction || {};
    var pageAction = ctx.action;
    var FUNTYPE_MAP = { production: 1, hardware: 2, outsource: 3, productionPlan: 4, tranpack: 5 };
    var curFun = { name: null, pfids: [] };
    var apiIndex = null;
    initTable();
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'name', title: '功能名称', minWidth: 200 }, { field: 'comment', title: '说明', minWidth: 240 }, { title: '操作', width: 120, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'config') openApiConfig(obj.data); });
    }
    app.post(api.production.queryProductionFunction, { 'productionFunction.type': 0 }, function (res) {
        var list = (res.productionFunctions || []).filter(function (v) { return v.funtype == FUNTYPE_MAP[pageAction]; });
        table.reload('resultTable', { data: list });
    });
    function openApiConfig(v) {
        curFun.name = v.key; curFun.pfids = [];
        app.post(api.right.queryProductionFunctionRightByName, { 'productionFunctionRight.name': curFun.name }, function (res) {
            (res.productionFunctionRights || []).forEach(function (it) { curFun.pfids.push(it.productionFunction.pfid); });
        });
        app.post(api.production.queryProductionFunction, { 'productionFunction.type': '' }, function (res) {
            $('#apiData, #condArrData, #fieldData, #functionData, #nodeData').empty();
            var all = res.productionFunctions || [];
            var pageData = all.filter(function (v) { return v.funtype == FUNTYPE_MAP[pageAction] || v.funtype == 0; });
            pageData.forEach(function (v) {
                var checked = curFun.pfids.indexOf(v.pfid) !== -1 ? 'checked' : '';
                var typeAttr = v.type == 1 ? 'type="radio"' : 'type="checkbox"';
                var html = '<label style="display:inline-block;width:30%;padding:4px;"><input name="pfids" value="' + v.pfid + '" ' + typeAttr + ' ' + checked + ' title="' + v.name + '"></label>';
                if (v.type == 1) $('#apiData').append(html);
                else if (v.type == 2) $('#condArrData').append(html);
                else if (v.type == 3) $('#fieldData').append(html);
                else if (v.type == 4) $('#functionData').append(html);
                else if (v.type == 5) $('#nodeData').append(html);
            });
            layui.form.render();
            apiIndex = layer.open({ type: 1, title: '配置 - ' + v.name, content: $('#apiBox'), area: ['700px', '90%'] });
        });
    }
    $('#btnSaveApi').on('click', function () {
        var opts = { 'productionFunctionRight.name': curFun.name }; var i = 0;
        $('#apiBox input[name="pfids"]:checked').each(function () { opts['pfids[' + i + ']'] = $(this).val(); i++; });
        app.post(api.right.updateProductionFunctionRight, opts, function () { app.showAlert(app.success, '配置成功'); layer.close(apiIndex); apiIndex = null; });
    });
    $('#btnCancelApi').on('click', function () { layer.close(apiIndex); apiIndex = null; });
});
}); // end app.ready
