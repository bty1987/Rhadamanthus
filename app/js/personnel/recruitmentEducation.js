/** recruitmentEducation.js —— 招聘教育信息（queryRecruitmentEducation / addRecruitmentEducation / updateRecruitmentEducation / deleteRecruitmentEducation） */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'laydate', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, laydate = layui.laydate, $ = layui.jquery;
    var state = { rid: null, reid: null, editIndex: null, flag: true };

    function getUrlParam(k) { var m = location.search.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? m[1] : ''; }
    state.rid = getUrlParam('rid');
    initTable(); query(); initDates();

    function initDates() {
        laydate.render({ elem: '#editForm [name="beginTime"]' });
        laydate.render({ elem: '#editForm [name="endTime"]' });
    }

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[{"field":"organ","title":"学校/机构","minWidth":160},{"field":"certificate","title":"证书","width":140},{"field":"specialty","title":"专业","width":140},{"field":"beginTime","title":"开始时间","width":120},{"field":"endTime","title":"结束时间","width":120},{"field":"createTime","title":"创建时间","width":160},{"field":"content","title":"内容","minWidth":160},{"title":"操作","width":160,"fixed":"right","toolbar":"#rowToolbar"}]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'del') doDelete(obj.data);
        });
    }

    function query() {
        var p = {}; p['recruitmentEducation.rid'] = state.rid;
        app.post(api.personel.queryRecruitmentEducation, p, function (res) {
            table.reload('resultTable', { data: res.recruitmentEducations || [] });
        });
    }

    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.reid = null;
        state.flag = !d;
        if (d) {
            state.reid = d.reid;
            $('#editForm [name="organ"]').val(d.organ);
            $('#editForm [name="certificate"]').val(d.certificate);
            $('#editForm [name="beginTime"]').val(d.beginTime);
            $('#editForm [name="endTime"]').val(d.endTime);
            $('#editForm [name="content"]').val(d.content);
            $('#editForm [name="specialty"]').val(d.specialty);
        }
        state.editIndex = layer.open({ type: 1, title: state.flag ? '添加' : '修改', content: $('#editBox'), area: ['520px', 'auto'], cancel: function () { app.clearValidator(); } });
    }

    function doSave() {
        if (app.validate('editForm')) return;
        var opt = { 'recruitmentEducation.rid': state.rid };
        opt['recruitmentEducation.organ'] = $('#editForm [name="organ"]').val();
        opt['recruitmentEducation.certificate'] = $('#editForm [name="certificate"]').val();
        opt['recruitmentEducation.beginTime'] = $('#editForm [name="beginTime"]').val();
        opt['recruitmentEducation.endTime'] = $('#editForm [name="endTime"]').val();
        opt['recruitmentEducation.content'] = $('#editForm [name="content"]').val();
        opt['recruitmentEducation.specialty'] = $('#editForm [name="specialty"]').val();
        var apiDef;
        if (state.flag) { apiDef = api.personel.addRecruitmentEducation; }
        else { opt['recruitmentEducation.reid'] = state.reid; apiDef = api.personel.updateRecruitmentEducation; }
        app.post(apiDef, opt, function () { app.showAlert(app.success, '操作成功'); layer.close(state.editIndex); state.editIndex = null; query(); });
    }

    function doDelete(d) {
        app.showConfirm('是否删除该记录？', function () {
            var p = {}; p['recruitmentEducation.reid'] = d.reid;
            app.post(api.personel.deleteRecruitmentEducation, p, function () { app.showAlert(app.success, '已删除'); query(); });
        });
    }

    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
