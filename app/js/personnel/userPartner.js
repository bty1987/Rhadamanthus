/** userPartner.js —— 员工合作人（queryUserPartner / addUserPartner / deleteUserPartner）
 * 父页 popup 打开，从 url ?uid= 取 user.uid（旧代码用 params.personel.partner.uid） */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { uid: null, editIndex: null };

    function getUrlParam(k) { var m = location.search.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? m[1] : ''; }
    state.uid = getUrlParam('uid');

    initTable(); query();

    function stType(d) { var map = { 0: '设计师', 1: '监理', 2: '业务员' }; return map[d.type] != null ? '<span class="layui-badge layui-bg-blue">' + map[d.type] + '<\/span>' : '---'; }
    function stStatus(d) { return d.status == 0 ? '<span class="layui-badge layui-bg-green">启用</span>' : '<span class="layui-badge layui-bg-gray">禁用</span>'; }

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'partner', title: '合作人', minWidth: 160, templet: function (d) { return d.partner ? (d.partner.userName || d.partner.currentName || '') : ''; } },
                { field: 'type', title: '类型', width: 110, templet: stType },
                { field: 'status', title: '状态', width: 100, templet: stStatus },
                { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDelete(obj.data); });
    }

    function query() {
        app.post(api.personel.queryUserPartner, { 'userPartner.uid': state.uid }, function (res) {
            table.reload('resultTable', { data: res.userPartners || [] });
        });
    }

    var ta = null;
    $('#partnerName').on('input', function () {
        var kw = $.trim($(this).val());
        $('#editForm [name="partner.userId"]').val('');
        clearTimeout(ta);
        if (!kw) return;
        ta = setTimeout(function () {
            app.post(api.personel.queryUserByPinyin, { pinyinName: kw, 'user.status': 0, 'departmentType.name': '' }, function (res) {
                var users = res.users || [];
                if (users.length === 1) {
                    $('#partnerName').val(users[0].currentName || users[0].userName);
                    $('#editForm [name="partner.userId"]').val(users[0].userId);
                } else if (users.length > 1) {
                    showUserPick(users);
                }
            });
        }, 300);
    });

    function showUserPick(users) {
        var html = '';
        $.each(users, function (i, u) { html += '<div style="padding:6px 8px;cursor:pointer;border-bottom:1px solid #eee;" data-uid="' + u.userId + '" data-name="' + (u.currentName || u.userName || '') + '">' + (u.currentName || u.userName || '') + (u.userId ? ' (' + u.userId + ')' : '') + '</div>'; });
        layer.open({ type: 1, title: '选择合作人', content: $('<div id="userPickBox" style="max-height:320px;overflow:auto;">' + html + '</div>'), area: ['320px', 'auto'], success: function () {
            $('#userPickBox > div').on('click', function () {
                $('#partnerName').val($(this).attr('data-name'));
                $('#editForm [name="partner.userId"]').val($(this).attr('data-uid'));
                layer.closeAll();
            });
        } });
    }

    function openEdit() {
        app.clearValidator(); $('#editForm')[0].reset();
        $('#editForm [name="partner.userId"]').val('');
        form.render('select');
        state.editIndex = layer.open({ type: 1, title: '添加合作人', content: $('#editBox'), area: ['480px', 'auto'], cancel: function () { app.clearValidator(); } });
    }

    function doSave() {
        if (app.validate('editForm')) return;
        var uid = $('#editForm [name="partner.userId"]').val();
        if (!uid) { app.showAlert(app.warning, '请从下拉中选择合作人'); return; }
        app.post(api.personel.addUserPartner, {
            'userPartner.uid': state.uid,
            'userPartner.partner.userId': uid,
            'userPartner.type': $('#editForm [name="type"]').val()
        }, function () {
            app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null; query();
        });
    }

    function doDelete(d) {
        app.showConfirm('确认删除该合作人？', function () {
            app.post(api.personel.deleteUserPartner, { 'userPartner.upid': d.upid }, function () { app.showAlert(app.success, '已删除'); query(); });
        });
    }

    $('#btnAdd').on('click', openEdit);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
