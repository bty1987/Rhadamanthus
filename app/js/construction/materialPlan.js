/** app/js/construction/materialPlan.js —— 主材计划（订单维度：生成/添加/编辑/完成/取消/删除）
 *  上下文：app.params.construction = { decoration: {...} }。
 *  计划时点/系统履约由后端读时推算返回（planTime/autoStatus/autoTime），逾期在状态列标红。
 *  添加弹窗：维度(品类/品牌)×品类×品牌×节点(取自本单工程进度)×动作×锚点×偏移。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var ENUM = constructionCommon.ENUM;
    var pageConfig = constructionCommon.getPageConfig('materialPlan');
    var construction = app.params.construction || {};
    var state = { mpid: null };
    var TYPE_BRAND = 1;

    var orderId = construction.decoration ? construction.decoration.orderId : construction.orderId;
    $('#orderIdLabel').text(orderId || '-');
    if (!orderId) { app.showAlert(app.warning, '缺少订单上下文'); return; }

    function selOpts(dict) {
        var html = '<option value=""></option>';
        $.each(dict, function (k, v) { html += '<option value="' + k + '">' + v + '</option>'; });
        return html;
    }

    // 维度/动作/锚点下拉（枚举来自 constructionCommon.ENUM, 对齐 communion.constant）
    $('#type').html(selOpts(ENUM.materialPlanType));
    $('#action').html(selOpts(ENUM.materialPlanAction));
    $('#anchor').html(selOpts(ENUM.materialPlanAnchor));
    $('#editAnchor').html(selOpts(ENUM.materialPlanAnchor));
    $('#type').val(0);
    form.render('select');

    // 品类下拉
    app.post(api.data.queryCategory, {}, function (res) {
        var html = '<option value=""></option>';
        $.each(res.categorys || [], function (i, c) { html += '<option value="' + c.cid + '">' + (c.name || '') + '</option>'; });
        $('#cid').html(html);
        form.render('select');
    }, null, false);

    // 节点下拉取自本单工程进度(保证节点在排期内)
    app.post(api.construction.queryConstructionScheduleByOrderId, { 'constructionSchedule.orderId': orderId }, function (res) {
        var html = '<option value=""></option>';
        $.each(res.constructionSchedules || [], function (i, s) {
            if (s.node && s.node.cnid) html += '<option value="' + s.node.cnid + '">' + (s.name || '') + '</option>';
        });
        $('#cnid').html(html);
        form.render('select');
    }, null, false);

    // 品牌联动：维度=品牌且选了品类时刷新品牌
    function toggleBrand() { $('#brandGroup').toggle($('#type').val() == TYPE_BRAND); }
    function loadBrands(cid, selected) {
        if ($('#type').val() == TYPE_BRAND && cid) {
            app.post(api.data.queryBrandByCid, { 'brand.cid': cid }, function (res) {
                var html = '<option value=""></option>';
                $.each(res.brands || [], function (i, b) { html += '<option value="' + b.bid + '">' + (b.name || '') + '</option>'; });
                $('#bid').html(html).val(selected || '');
                form.render('select');
            }, null, false);
        } else {
            $('#bid').html('<option value=""></option>');
            form.render('select');
        }
    }
    form.on('select(type)', function () { toggleBrand(); });
    form.on('select(cid)', function (d) { loadBrands(d.value); });
    toggleBrand();

    function offsetText(v) { return v > 0 ? '+' + v + '天' : v < 0 ? v + '天' : '当日'; }
    function statusText(d) {
        var s = ENUM.materialPlanStatus[d.status] || d.status;
        if (d.status == 0 && d.overdue == 1) s = '<span style="color:red">' + s + '(已逾期)</span>';
        return s;
    }

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'nodeName', title: '施工节点', width: 110 },
            { field: 'type', title: '维度', width: 80, templet: function (d) { return ENUM.materialPlanType[d.type] || ''; } },
            { field: 'categoryName', title: '品类', width: 100 },
            { field: 'brandName', title: '品牌', width: 110 },
            { field: 'action', title: '动作', width: 80, templet: function (d) { return ENUM.materialPlanAction[d.action] || ''; } },
            { field: 'anchor', title: '锚点', width: 100, templet: function (d) { return ENUM.materialPlanAnchor[d.anchor] || ''; } },
            { field: 'offsetDay', title: '偏移', width: 80, templet: function (d) { return offsetText(d.offsetDay); } },
            { field: 'planTime', title: '计划时点', width: 110, templet: function (d) { return d.planTime || '待定'; } },
            { field: 'manualTime', title: '指定时点', width: 110 },
            { field: 'autoStatus', title: '系统履约', width: 100, templet: function (d) { return ENUM.materialPlanAutoStatus[d.autoStatus] || ''; } },
            { field: 'autoTime', title: '履约时间', width: 110 },
            { field: 'status', title: '状态', width: 110, templet: statusText },
            { field: 'actualTime', title: '完成时间', width: 110 },
            { field: 'comment', title: '说明', minWidth: 130 },
            { title: '操作', width: 260, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'edit') {
            state.mpid = v.mpid;
            $('#editAnchor').val(v.anchor);
            $('#editOffsetDay').val(v.offsetDay);
            $('#editManualTime').val(v.manualTime || '');
            $('#editComment').val(v.comment || '');
            form.render('select');
            layer.open({ type: 1, title: '编辑主材计划', content: $('#editMaterialPlanBox'), area: ['520px', 'auto'],
                btn: ['保存', '取消'], yes: function (idx) {
                    app.post(api.construction.updateMaterialPlan, {
                        'materialPlan.mpid': state.mpid,
                        'materialPlan.anchor': $('#editAnchor').val(),
                        'materialPlan.offsetDay': $('#editOffsetDay').val() === '' ? 0 : $('#editOffsetDay').val(),
                        'materialPlan.manualTime': $('#editManualTime').val(),
                        'materialPlan.comment': $('#editComment').val()
                    }, function () {
                        app.showAlert(app.success, '操作成功');
                        layer.close(idx); query();
                    });
                } });
        } else if (obj.event === 'confirm') {
            app.post(api.construction.confirmMaterialPlan, { 'materialPlan.mpid': v.mpid }, function () {
                app.showAlert(app.success, '操作成功'); query();
            });
        } else if (obj.event === 'cancel') {
            app.post(api.construction.cancelMaterialPlan, { 'materialPlan.mpid': v.mpid }, function () {
                app.showAlert(app.success, v.status == 2 ? '已恢复' : '已取消'); query();
            });
        } else if (obj.event === 'del') {
            app.post(api.construction.deleteMaterialPlan, { 'materialPlan.mpid': v.mpid }, function () {
                app.showAlert(app.success, '删除成功'); query();
            });
        }
    });

    // 生成
    $('#makeBtn').on('click', function () {
        app.post(api.construction.makeMaterialPlan, { 'materialPlan.orderId': orderId }, function () {
            app.showAlert(app.success, '操作成功'); query();
        });
    });

    // 添加
    $('#addBtn').on('click', function () {
        $('#materialPlanForm')[0].reset();
        $('#type').val(0);
        toggleBrand();
        form.render('select');
        layer.open({ type: 1, title: '添加主材计划', content: $('#materialPlanBox'), area: ['520px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {

                var type = $('#type').val();

                if (type == TYPE_BRAND && !$('#bid').val()) { app.showAlert(app.warning, '请选择品牌'); return; }
                if (type != TYPE_BRAND && !$('#cid').val()) { app.showAlert(app.warning, '请选择品类'); return; }
                if (!$('#cnid').val()) { app.showAlert(app.warning, '请选择施工节点'); return; }

                var o = {
                    'materialPlan.orderId': orderId,
                    'materialPlan.type': type,
                    'materialPlan.cnid': $('#cnid').val(),
                    'materialPlan.action': $('#action').val(),
                    'materialPlan.anchor': $('#anchor').val(),
                    'materialPlan.offsetDay': $('#offsetDay').val() === '' ? 0 : $('#offsetDay').val(),
                    'materialPlan.manualTime': $('#manualTime').val(),
                    'materialPlan.comment': $('#comment').val()
                };

                if (type == TYPE_BRAND) o['materialPlan.brandId'] = $('#bid').val();
                else o['materialPlan.categoryId'] = $('#cid').val();

                app.post(api.construction.addMaterialPlan, o, function () {
                    app.showAlert(app.success, '操作成功');
                    layer.close(idx); query();
                });
            } });
    });

    function query() {
        app.post(api.construction.queryMaterialPlanByOrderId, { 'materialPlan.orderId': orderId }, function (res) {
            table.reload('resultTable', { data: res.materialPlans || [] });
        });
    }
    query();
});
}); // end app.ready
