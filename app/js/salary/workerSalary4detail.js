/** app/js/salary/workerSalary4detail.js —— 工费明细（弹窗页：工费列表 + 新增/删除）
 *  对齐旧 WebContent/js/salary/workerSalary4detail.js。
 *  上下文：params.workerSalary = { csid, userId }（来自父页面 supervision4detail） */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;

    var ctx = (app.params.workerSalary && app.params.workerSalary) ? app.params.workerSalary : {};
    var oneTypeMap = {}, twoTypeMap = {}, salaryStatus = {};

    $('#editForm [name="csid"]').val(ctx.csid || '');
    $('#editForm [name="userId"]').val(ctx.userId || '');

    app.post(api.ds.salary, {}, function (res) {
        salaryStatus = kvToMap(res.status);
        oneTypeMap = keyToField(res.SalaryTwoType, 'oneType');
        twoTypeMap = keyToName(res.SalaryTwoType);
        // 仅 status==0（启用）填充类型下拉
        var $sel = $('#ws4dSalaryType');
        var list = res.SalaryTwoType || [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].status != 0) continue;
            $sel.append('<option value="' + list[i].key + '">' + list[i].name + '</option>');
        }
        form.render('select');
        initTable(); query();
    });

    function kvToMap(list) { var m = {}; if (list) for (var i = 0; i < list.length; i++) m[list[i].key] = list[i].value; return m; }
    function keyToField(list, f) { var m = {}; if (list) for (var i = 0; i < list.length; i++) m[list[i].key] = list[i][f]; return m; }
    function keyToName(list) { var m = {}; if (list) for (var i = 0; i < list.length; i++) m[list[i].key] = list[i].name; return m; }

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'userName', title: '姓名', width: 120, templet: function (d) { return d.user ? (d.user.userName || '') : ''; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'money', title: '薪资', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.money); } },
                { field: 'twotype', title: '类型', width: 130, templet: function (d) { return twoTypeMap[d.twotype] || '---'; } },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return '<span class="layui-badge layui-bg-gray">' + (salaryStatus[d.status] || '---') + '<\/span>'; } },
                { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'del') del(obj.data);
        });
    }

    function query() {
        app.post(api.salary.queryWorkerSalary, {
            'workerSalary.csid': ctx.csid,
            'workerSalary.user.userId': ctx.userId
        }, function (res) {
            table.reload('resultTable', { data: res.workerSalarys || [] });
        });
    }

    function saveData() {
        if (app.validate('editForm')) return;
        var salary = $('#ws4dSalary').val();
        var twotype = $('#ws4dSalaryType').val();
        if (!salary) { app.showAlert(app.warning, '请填写薪资'); return; }
        app.post(api.salary.addWorkerSalary, {
            'workerSalary.csid': ctx.csid,
            'workerSalary.user.userId': ctx.userId,
            'workerSalary.money': salary,
            'workerSalary.type': salary >= 0 ? 0 : 1,
            'workerSalary.onetype': oneTypeMap[twotype],
            'workerSalary.twotype': twotype,
            'workerSalary.comment': $('#ws4dComment').val()
        }, function () {
            app.showAlert(app.success, '操作成功');
            $('#ws4dSalary').val('');
            $('#ws4dComment').val('');
            query();
        });
    }

    function del(d) {
        app.showConfirm('确认删除?', function () {
            app.post(api.salary.deleteWorkerSalary, { 'workerSalary.wsid': d.wsid }, function () {
                app.showAlert(app.success, '已删除'); query();
            }, function () { app.showAlert(app.error, '工费状态不可操作!'); });
        });
    }

    $('#ws4dSaveBtn').on('click', saveData);
});
}); // end app.ready
