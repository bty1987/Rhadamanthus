/** macontrol.js —— 人员权限（MAC/IP 控制：queryMacontrol / addMacontrol / deleteMacontrol）
 * 父页 popup 打开，从 url ?uid= 取 user.uid */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { uid: null, editIndex: null };

    function getUrlParam(k) { var m = location.search.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? m[1] : ''; }
    state.uid = (app.params && app.params['user.uid']) || getUrlParam('uid');

    initTable(); query();

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'name', title: '名称', width: 160 },
                { field: 'ip', title: 'IP', width: 200 },
                { field: 'mac', title: 'MAC', width: 220 },
                { title: '操作', width: 100, fixed: 'right', toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDelete(obj.data); });
    }

    function query() {
        app.post(api.personel.queryMacontrol, { 'macontrol.buid': state.uid }, function (res) {
            table.reload('resultTable', { data: res.macontrols || [] });
        });
    }

    function openEdit() {
        app.clearValidator(); $('#editForm')[0].reset();
        state.editIndex = layer.open({ type: 1, title: '添加权限', content: $('#editBox'), area: ['480px', 'auto'], cancel: function () { app.clearValidator(); } });
    }

    function doSave() {
        if (app.validate('editForm')) return;
        app.post(api.personel.addMacontrol, {
            'macontrol.name': $('#editForm [name="name"]').val(),
            'macontrol.ip': $('#editForm [name="ip"]').val(),
            'macontrol.mac': $('#editForm [name="mac"]').val(),
            'macontrol.buid': state.uid
        }, function () {
            app.showAlert(app.success, '操作成功'); layer.close(state.editIndex); state.editIndex = null; query();
        });
    }

    function doDelete(d) {
        app.showConfirm('是否删除该权限记录？', function () {
            app.post(api.personel.deleteMacontrol, { 'macontrol.mid': d.mid }, function () { app.showAlert(app.success, '已删除'); query(); });
        });
    }

    $('#btnAdd').on('click', openEdit);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
