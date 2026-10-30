/** app/js/manifest/storehouse4rightitem.js —— 仓库权限配置（为指定员工配置可用仓库）
 *  对齐旧 WebContent/js/manifest/storehouse4rightitem.js。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var userId = getQueryParam('userId');

    if (!userId) { app.showAlert(app.warning, '缺少 userId 参数'); return; }

    app.post(api.inventory.queryStorehouse, {}, function (res) {
        var list = res.storehouses || [];
        app.post(api.inventory.queryStorehouseUserByUserId, { 'user.userId': userId }, function (r2) {
            var sUsers = r2.storehouseUsers || [];
            var checkedMap = {};
            for (var i = 0; i < sUsers.length; i++) { if (sUsers[i].storehouse) checkedMap[sUsers[i].storehouse.shid] = true; }
            for (var j = 0; j < list.length; j++) { list[j].LAY_CHECKED = !!checkedMap[list[j].shid]; }
            renderTable(list);
        });
    });

    function renderTable(list) {
        table.render({ elem: '#resultTable', data: list, page: false, limit: 1000, even: true,
            cols: [[ { type: 'checkbox', LAY_CHECKED: true },
                { field: 'name', title: '仓库名称', minWidth: 160 },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return d.status == 0 ? '<span class="layui-badge layui-bg-green">启用<\/span>' : '<span class="layui-badge layui-bg-gray">禁用<\/span>'; } }
                ]] });
    }

    $('#btnSave').on('click', function () {
        var cs = table.checkStatus('resultTable');
        var rows = cs.data || [];
        var opt = { 'user.userId': userId };
        for (var i = 0; i < rows.length; i++) { opt['shids[' + i + ']'] = rows[i].shid; }
        app.post(api.inventory.updateStorehouseUser, opt, function () { app.showAlert(app.success, '操作成功'); app.switchPage('storehouse4right.html'); });
    });
    $('#btnCancel').on('click', function () { app.switchPage('storehouse4right.html'); });

    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
