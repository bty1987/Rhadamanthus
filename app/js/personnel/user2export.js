/** user2export.js —— 人员信息导出（按公司/部门类型/部门筛选后导出 Excel）
 * 旧实现为 com.uploadify 触发后端导出，这里提供筛选 + 直接 GET 触发后端导出链接 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;

    app.post(api.system.queryCompany, {}, function (res) {
        app.bindData($('#exportForm [name="company.cid"]'), res.companys, 'cid', 'name', true, function () { form.render('select'); });
    }, null, false);
    app.post(api.communion.queryDepartmentType, {}, function (res) {
        app.bindData($('#exportForm [name="deptType.dtid"]'), res.departmentTypes, 'dtid', 'name', true, function () { form.render('select'); triggerDept(); });
    }, null, false);

    function triggerDept() {
        var dtid = $('#exportForm [name="deptType.dtid"]').val(); if (!dtid) return;
        app.post(api.communion.queryDepartmentByDtid, { 'dept.type.dtid': dtid }, function (res) {
            app.bindData($('#exportForm [name="dept.did"]'), res.deptList, 'did', 'name', true, function () { form.render('select'); });
        });
    }
    $('#exportForm [name="deptType.dtid"]').on('change', triggerDept);

    $('#btnExport').on('click', function () {
        var cid = $('#exportForm [name="company.cid"]').val();
        var dtid = $('#exportForm [name="deptType.dtid"]').val();
        var did = $('#exportForm [name="dept.did"]').val();
        var params = [];
        if (cid) params.push('company.cid=' + encodeURIComponent(cid));
        if (dtid) params.push('deptType.dtid=' + encodeURIComponent(dtid));
        if (did) params.push('dept.did=' + encodeURIComponent(did));
        // 通过后端通用导出接口（与旧 com.salary.importUserSalary 反向）触发下载
        var url = app.config.server + 'personel/exportUser.do' + (params.length ? ('?' + params.join('&')) : '');
        app.showConfirm('确定要按当前条件导出人员信息吗？', function () {
            window.open(url, '_blank');
        });
    });
});
}); // end app.ready
