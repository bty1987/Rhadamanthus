/** userFunction.js —— 功能配置（queryUserFunction + queryUserFunctionRight + updateUserFunctionRight）
 * 列出功能模块，点击"配置"弹出 API/条件/字段/功能勾选 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { apiIndex: null, currentName: '', ufids: [] };

    loadList();

    function loadList() {
        app.post(api.personel.queryUserFunction, { 'userFunction.type': 0 }, function (res) {
            var html = '';
            $.each(res.userFunctions || [], function (i, v) {
                html += '<div class="layui-card" style="margin-bottom:8px;"><div class="layui-card-header">' + v.name + ' <button type="button" class="layui-btn layui-btn-xs" style="float:right;" data-key="' + v.key + '">配置</button></div></div>';
            });
            $('#resultList').html(html);
            $('#resultList button').on('click', function () { openConfig($(this).attr('data-key')); });
        });
    }

    function openConfig(key) {
        state.currentName = key;
        state.ufids = [];
        app.post(api.right.queryUserFunctionRight, { 'userFunctionRight.name': key }, function (res) {
            $.each(res.userFunctionRights || [], function (i, v) { if (v.userFunction) state.ufids.push(v.userFunction.ufid); });
            app.post(api.personel.queryUserFunction, { 'userFunction.type': '' }, function (resAll) {
                var list = (resAll.userFunctions || []).slice().sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); });
                var api = [], cond = [], field = [], fn = [];
                $.each(list, function (i, v) {
                    var checked = state.ufids.indexOf(v.ufid) != -1 ? ' checked' : '';
                    var label = v.name + (v.type == 0 ? '' : (v.comment || ''));
                    var typeAttr = v.type == 0 ? ' type="radio"' : ' type="checkbox"';
                    var html = '<label style="display:inline-block;width:33%;padding:2px 0;"><input name="ufids" value="' + v.ufid + '"' + typeAttr + checked + '> <span>' + label + '</span></label>';
                    if (v.type == 0) api.push(html);
                    else if (v.type == 1) cond.push(html);
                    else if (v.type == 2) field.push(html);
                    else if (v.type == 3) fn.push(html);
                });
                $('#apiData').html(api.join('') || '<span style="color:#999;">无</span>');
                $('#condArrData').html(cond.join('') || '<span style="color:#999;">无</span>');
                $('#fieldData').html(field.join('') || '<span style="color:#999;">无</span>');
                $('#functionData').html(fn.join('') || '<span style="color:#999;">无</span>');
                state.apiIndex = layer.open({ type: 1, title: '配置：' + key, content: $('#apiBox'), area: ['640px', '80%'] });
            });
        });
    }

    function doApiSave() {
        var opt = { 'userFunctionRight.name': state.currentName };
        var i = 0;
        $('#apiBox input[name="ufids"]:checked').each(function () { opt['ufids[' + i + ']'] = $(this).val(); i++; });
        app.post(api.right.updateUserFunctionRight, opt, function () {
            app.showAlert(app.success, '配置成功'); layer.close(state.apiIndex); state.apiIndex = null;
        });
    }

    $('#btnApiSave').on('click', doApiSave);
    $('#btnApiCancel').on('click', function () { layer.close(state.apiIndex); state.apiIndex = null; });
});
}); // end app.ready
