/** app/js/system/cityProperPartner.js —— 区域合作人管理（弹窗子页）
 * 父页 cityProper 通过 popup 打开，从 app.params.system.cpid（或 url ?cpid=）取当前区域 id
 * 接口：queryCityProperPartner / addCityProperPartner / deleteCityProperPartner
 * partner 用拼音搜索（queryUserByPinyin），命中后存 userId */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { cpid: null, editIndex: null };

    // 从父页 handoff 槽位或 url 取 cpid
    state.cpid = (app.params.system && app.params.system.cpid) || getUrlCpid();

    function getUrlCpid() {
        var m = location.search.match(/[?&]cpid=([^&]+)/);
        return m ? m[1] : null;
    }

    function stT(d) {
        var map = { 0: '设计师', 1: '监理', 2: '业务员' };
        return map[d.type] != null ? '<span class="layui-badge layui-bg-blue">' + map[d.type] + '<\/span>' : '---';
    }
    function stS(d) {
        return d.status == 0
            ? '<span class="layui-badge layui-bg-green">启用<\/span>'
            : '<span class="layui-badge layui-bg-gray">禁用<\/span>';
    }

    initTable(); query();

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'partner', title: '合作人', minWidth: 160, templet: function (d) { return d.partner ? (d.partner.userName || d.partner.currentName || '') : ''; } },
                { field: 'type', title: '类型', width: 110, templet: stT },
                { field: 'status', title: '状态', width: 100, templet: stS },
                { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDelete(obj.data); });
    }

    function query() {
        if (!state.cpid) { app.showAlert(app.warning, '缺少区域参数'); return; }
        app.post(api.system.queryCityProperPartner, { 'cityProperPartner.cpid': state.cpid }, function (res) {
            table.reload('resultTable', { data: res.cityProperPartners || [] });
        });
    }

    // 拼音搜索（输入防抖）
    var typeaheadTimer = null;
    $('#partnerName').on('input', function () {
        var kw = $.trim($(this).val());
        $('#editForm [name="partnerUserId"]').val('');
        clearTimeout(typeaheadTimer);
        if (!kw) return;
        typeaheadTimer = setTimeout(function () {
            app.post(api.personel.queryUserByPinyin, { 'pinyinName': kw, 'user.status': 0 }, function (res) {
                var users = res.users || [];
                if (users.length === 1) {
                    $('#partnerName').val(users[0].currentName || users[0].userName);
                    $('#editForm [name="partnerUserId"]').val(users[0].userId);
                } else if (users.length > 1) {
                    showUserPick(users);
                }
            });
        }, 300);
    });

    function showUserPick(users) {
        var html = '';
        $.each(users, function (i, u) {
            html += '<div style="padding:6px 8px;cursor:pointer;border-bottom:1px solid #eee;" data-uid="' + u.userId + '" data-name="' + (u.currentName || u.userName || '') + '">' + (u.currentName || u.userName || '') + (u.userId ? ' (' + u.userId + ')' : '') + '</div>';
        });
        layer.open({
            type: 1, title: '选择合作人', content: $('<div id="userPickBox" style="max-height:320px;overflow:auto;">' + html + '</div>'),
            area: ['320px', 'auto'], success: function () {
                $('#userPickBox > div').on('click', function () {
                    $('#partnerName').val($(this).attr('data-name'));
                    $('#editForm [name="partnerUserId"]').val($(this).attr('data-uid'));
                    layer.closeAll();
                });
            }
        });
    }

    function openEdit() {
        app.clearValidator();
        $('#editForm')[0].reset();
        $('#editForm [name="partnerUserId"]').val('');
        form.render('select');
        state.editIndex = layer.open({ type: 1, title: '添加合作人', content: $('#editBox'), area: ['480px', 'auto'], cancel: function () { app.clearValidator(); } });
    }

    function doSave() {
        if (app.validate('editForm')) return;
        var uid = $('#editForm [name="partnerUserId"]').val();
        if (!uid) { app.showAlert(app.warning, '请从下拉中选择合作人'); return; }
        app.post(api.system.addCityProperPartner, {
            'cityProperPartner.cpid': state.cpid,
            'cityProperPartner.partner.userId': uid,
            'cityProperPartner.type': $('#editForm [name="type"]').val()
        }, function () {
            app.showAlert(app.success, '添加成功');
            layer.close(state.editIndex); state.editIndex = null;
            query();
        });
    }

    function doDelete(d) {
        app.showConfirm('确认删除该合作人？', function () {
            app.post(api.system.deleteCityProperPartner, { 'cityProperPartner.cppid': d.cppid }, function () {
                app.showAlert(app.success, '已删除'); query();
            });
        });
    }

    $('#btnAdd').on('click', openEdit);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
