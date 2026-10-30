/** dutment.js —— 定岗信息（queryDutmentByDeid / queryDutmentByDuid / addDutment / updateDutment / deleteDutment）
 * type=0：按部门 did 查询（可增改删）；type=1：按职位 did 查询（只读） */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { did: null, typeId: null, type: 0, editIndex: null, editDid: null, flag: true, deptName: '', dutyTypeaheadUid: null };

    function getUrlParam(k) { var m = location.search.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? decodeURIComponent(m[1]) : ''; }
    state.did = getUrlParam('deptId') || getUrlParam('did');
    state.type = getUrlParam('type') || '0';
    state.typeId = getUrlParam('typeId');
    state.deptName = getUrlParam('name');

    initTable(); query();

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'duty', title: '职位', width: 160, templet: function (d) { return d.duty ? d.duty.name : '---'; } },
                { field: 'dept', title: '部门', width: 160, templet: function (d) { return d.dept ? d.dept.name : '---'; } },
                { field: 'limit', title: '人员上限', width: 120 },
                { field: 'num', title: '人员数量', width: 120 },
                { title: '操作', width: 160, fixed: 'right', toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'del') doDelete(obj.data);
        });
    }

    function query() {
        var apiDef = state.type == '0' ? api.personel.queryDutmentByDeid : api.personel.queryDutmentByDuid;
        var key = state.type == '0' ? 'dutment.dept.did' : 'dutment.duty.did';
        var params = {}; params[key] = state.did;
        app.post(apiDef, params, function (res) {
            table.reload('resultTable', { data: res.dutments || [] });
        });
    }

    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editDid = null;
        state.flag = false;
        if (d) {
            state.editDid = d.did;
            $('#deptName').val(d.dept ? d.dept.name : state.deptName);
            $('#dutyName').val(d.duty ? d.duty.name : '').prop('disabled', true);
            $('#editForm [name="duty.did"]').val(d.duty ? d.duty.did : '');
            $('#editForm [name="limit"]').val(d.limit);
        } else {
            state.flag = true;
            $('#deptName').val(state.deptName);
            $('#dutyName').val('').prop('disabled', false);
        }
        state.editIndex = layer.open({ type: 1, title: state.flag ? '添加定岗' : '修改定岗', content: $('#editBox'), area: ['480px', 'auto'], cancel: function () { app.clearValidator(); } });
    }

    // 职位拼音搜索（防抖）
    var dutyTimer = null;
    $('#dutyName').on('input', function () {
        if (!state.flag) return;
        var kw = $.trim($(this).val());
        $('#editForm [name="duty.did"]').val('');
        clearTimeout(dutyTimer);
        if (!kw) return;
        dutyTimer = setTimeout(function () {
            var p = { pinyinName: kw, 'duty.status': 0 };
            if (state.typeId) p['duty.departmentType.dtid'] = state.typeId;
            app.post(api.system.queryDutyByName, p, function (res) {
                var list = res.dutys || [];
                if (list.length === 1) {
                    $('#dutyName').val(list[0].name);
                    $('#editForm [name="duty.did"]').val(list[0].did);
                } else if (list.length > 1) {
                    showDutyPick(list);
                }
            });
        }, 300);
    });

    function showDutyPick(list) {
        var html = '';
        $.each(list, function (i, d) { html += '<div style="padding:6px 8px;cursor:pointer;border-bottom:1px solid #eee;" data-did="' + d.did + '" data-name="' + d.name + '">' + d.name + '</div>'; });
        layer.open({ type: 1, title: '选择职位', content: $('<div id="dutyPickBox" style="max-height:320px;overflow:auto;">' + html + '</div>'), area: ['320px', 'auto'], success: function () {
            $('#dutyPickBox > div').on('click', function () {
                $('#dutyName').val($(this).attr('data-name'));
                $('#editForm [name="duty.did"]').val($(this).attr('data-did'));
                layer.closeAll();
            });
        } });
    }

    function doSave() {
        if (app.validate('editForm')) return;
        if (state.flag && !$('#editForm [name="duty.did"]').val()) { app.showAlert(app.warning, '请选择职位'); return; }
        var opt = { 'dutment.limit': $('#editForm [name="limit"]').val() };
        var apiDef;
        if (state.flag) {
            opt['dutment.duty.did'] = $('#editForm [name="duty.did"]').val();
            opt['dutment.dept.did'] = state.did;
            apiDef = api.personel.addDutment;
        } else {
            opt['dutment.did'] = state.editDid;
            apiDef = api.personel.updateDutment;
        }
        app.post(apiDef, opt, function () {
            app.showAlert(app.success, '操作成功'); layer.close(state.editIndex); state.editIndex = null; query();
        });
    }

    function doDelete(d) {
        app.showConfirm('是否删除该定岗记录？', function () {
            app.post(api.personel.deleteDutment, { 'dutment.did': d.did }, function () { app.showAlert(app.success, '已删除'); query(); });
        });
    }

    if (state.type != '0') $('#btnAdd').hide();
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
