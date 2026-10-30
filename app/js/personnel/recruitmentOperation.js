/** recruitmentOperation.js —— 招聘工作信息（queryRecruitmentOperation / addRecruitmentOperation / updateRecruitmentOperation / deleteRecruitmentOperation） */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'laydate', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, laydate = layui.laydate, $ = layui.jquery;
    var state = { rid: null, roid: null, editIndex: null, flag: true };

    function getUrlParam(k) { var m = location.search.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? m[1] : ''; }
    state.rid = getUrlParam('rid');
    initTable(); query(); initDates();

    function initDates() {
        laydate.render({ elem: '#editForm [name="beginTime"]' });
        laydate.render({ elem: '#editForm [name="endTime"]' });
    }

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[{"field":"company","title":"公司","minWidth":160},{"field":"trade","title":"行业","width":140},{"field":"duty","title":"职位","width":120},{"field":"salary","title":"薪资","width":100},{"field":"beginTime","title":"开始时间","width":120},{"field":"endTime","title":"结束时间","width":120},{"field":"createTime","title":"创建时间","width":160},{"field":"comment","title":"描述","minWidth":160},{"title":"操作","width":160,"fixed":"right","toolbar":"#rowToolbar"}]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'del') doDelete(obj.data);
        });
    }

    function query() {
        var p = {}; p['recruitmentOperation.rid'] = state.rid;
        app.post(api.personel.queryRecruitmentOperation, p, function (res) {
            table.reload('resultTable', { data: res.recruitmentOperations || [] });
        });
    }

    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.roid = null;
        state.flag = !d;
        if (d) {
            state.roid = d.roid;
            $('#editForm [name="company"]').val(d.company);
            $('#editForm [name="trade"]').val(d.trade);
            $('#editForm [name="duty"]').val(d.duty);
            $('#editForm [name="beginTime"]').val(d.beginTime);
            $('#editForm [name="endTime"]').val(d.endTime);
            $('#editForm [name="salary"]').val(d.salary);
            $('#editForm [name="comment"]').val(d.comment);
        }
        state.editIndex = layer.open({ type: 1, title: state.flag ? '添加' : '修改', content: $('#editBox'), area: ['520px', 'auto'], cancel: function () { app.clearValidator(); } });
    }

    function doSave() {
        if (app.validate('editForm')) return;
        var opt = { 'recruitmentOperation.rid': state.rid };
        opt['recruitmentOperation.company'] = $('#editForm [name="company"]').val();
        opt['recruitmentOperation.trade'] = $('#editForm [name="trade"]').val();
        opt['recruitmentOperation.duty'] = $('#editForm [name="duty"]').val();
        opt['recruitmentOperation.beginTime'] = $('#editForm [name="beginTime"]').val();
        opt['recruitmentOperation.endTime'] = $('#editForm [name="endTime"]').val();
        opt['recruitmentOperation.salary'] = $('#editForm [name="salary"]').val();
        opt['recruitmentOperation.comment'] = $('#editForm [name="comment"]').val();
        var apiDef;
        if (state.flag) { apiDef = api.personel.addRecruitmentOperation; }
        else { opt['recruitmentOperation.roid'] = state.roid; apiDef = api.personel.updateRecruitmentOperation; }
        app.post(apiDef, opt, function () { app.showAlert(app.success, '操作成功'); layer.close(state.editIndex); state.editIndex = null; query(); });
    }

    function doDelete(d) {
        app.showConfirm('是否删除该记录？', function () {
            var p = {}; p['recruitmentOperation.roid'] = d.roid;
            app.post(api.personel.deleteRecruitmentOperation, p, function () { app.showAlert(app.success, '已删除'); query(); });
        });
    }

    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
