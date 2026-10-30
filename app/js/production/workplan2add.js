/** app/js/production/workplan2add.js —— 添加工序计划到生产计划（弹窗子页）
 * 上下文：app.params.productionPlanAdd.ppid
 * 排除已绑定且未废除的工序计划，渲染可选复选框列表，勾选后批量 addProductionWorkPlan。 */
app.ready(function () {
layui.use(['layer', 'jquery'], function () {
    var layer = layui.layer, $ = layui.jquery;
    var ctx = (window.parent && window.parent.app && window.parent.app.params.productionPlanAdd) || app.params.productionPlanAdd || {};
    var ppid = ctx.ppid;
    var usingWpids = [];

    app.post(api.production.queryProductionWorkPlanByPpid, { 'productionWorkPlan.ppid': ppid }, function (res) {
        (res.productionWorkPlans || []).forEach(function (v) { if (v.status != 3) usingWpids.push(v.workplan.wpid); });
        app.post(api.production.queryWorkplan, {}, function (d) {
            var show = (d.workplans || []).filter(function (w) { return usingWpids.indexOf(w.wpid) === -1; });
            renderList(show);
        });
    });
    function renderList(list) {
        var $f = $('#checkForm').empty();
        if (!list.length) { $f.append('<p style="color:#999;">无可选工序计划</p>'); return; }
        list.forEach(function (w) {
            $f.append('<label style="display:inline-block;margin:6px 14px 6px 0;"><input type="checkbox" value="' + w.wpid + '" title="' + w.name + '"></label>');
        });
        layui.form.render('checkbox');
    }
    $('#btnSubmit').on('click', function () {
        var checked = $('#checkForm input[type="checkbox"]:checked');
        if (!checked.length) { app.showAlert(app.warning, '请至少选择一项'); return; }
        var done = 0, total = checked.length;
        checked.each(function () {
            app.post(api.production.addProductionWorkPlan, { 'productionWorkPlan.ppid': ppid, 'productionWorkPlan.workplan.wpid': $(this).val() }, function () {
                done++;
                if (done === total) {
                    app.showAlert(app.success, '操作成功');
                    try { var idx = window.parent.layer.getFrameIndex(window.name); window.parent.layer.close(idx); } catch (e) {}
                }
            });
        });
    });
    $('#btnCancel').on('click', function () { try { var idx = window.parent.layer.getFrameIndex(window.name); window.parent.layer.close(idx); } catch (e) {} });
});
}); // end app.ready
