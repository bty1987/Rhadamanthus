/** app/js/construction/constructionSchedule.js —— 施工进度管理（定额/比例/工期/预估工费维护）
 *  pageConfig：name='constructionSchedule'。行按钮：更新定额/更新比例/更新工期/确认预估/附加项。
 *  金额/比例字段经 tranargs 做 ×1000/÷1000 精度转换。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var E = constructionCommon.ENUM;
    var pageConfig = constructionCommon.getPageConfig('constructionSchedule');
    var state = { page: 1, rows: 10, total: 0, schedule: null };
    if (!pageConfig.apiPage) pageConfig.apiPage = api.construction.pageConstructionSchedule;

    function btnVisible(key) { return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.indexOf(key) != -1; }

    ['createTime', 'startTime', 'endTime', 'enterTime', 'leaveTime'].forEach(function (id) {
        constructionCommon.dateRange('#' + id);
    });

    function money(v) { return app.formatMoney(v); }
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'orderId', title: '装修单', width: 110, fixed: 'left', templet: function (d) { return d.decoration ? d.decoration.orderId : ''; } },
            { field: 'village', title: '楼盘', width: 105, templet: function (d) { return d.decoration && d.decoration.house && d.decoration.house.village ? d.decoration.house.village.name : ''; } },
            { field: 'houseNumber', title: '楼号', width: 80, templet: function (d) { return d.decoration && d.decoration.house ? d.decoration.house.houseNumber : ''; } },
            { field: 'customer', title: '客户', width: 80, templet: function (d) { return d.decoration && d.decoration.customer ? d.decoration.customer.name : ''; } },
            { field: 'designer', title: '设计师', width: 80, templet: function (d) { return d.decoration && d.decoration.designer ? d.decoration.designer.currentName : ''; } },
            { field: 'supervisor', title: '监理', width: 80, templet: function (d) { return d.construction && d.construction.supervisor ? d.construction.supervisor.currentName : ''; } },
            { field: 'orderTotalPrice', title: '合同额', width: 95, templet: function (d) { return d.decoration ? money(d.decoration.orderTotalPrice) : ''; } },
            { field: 'version', title: '报价版本', width: 90, templet: function (d) { return d.decoration && d.decoration.version ? d.decoration.version.name : ''; } },
            { field: 'buildArea', title: '面积', width: 80, templet: function (d) { return d.decoration && d.decoration.house ? d.decoration.house.buildArea : ''; } },
            { field: 'projectStatus', title: '工程状态', width: 90, templet: function (d) { return d.decoration ? constructionCommon.badge({ 0: '初始', 1: '开工', 2: '完工' }, d.decoration.projectStatus) : ''; } },
            { field: 'nodeName', title: '节点', width: 90, templet: function (d) { return d.node ? d.node.name : ''; } },
            { field: 'contractTime', title: '签约时间', width: 100, templet: function (d) { return d.decoration ? (d.decoration.contractTime || '').substring(0, 10) : ''; } },
            { field: 'proStartTime', title: '预计开工时间', width: 105, templet: function (d) { return (d.proStartTime || '').substring(0, 10); } },
            { field: 'proEndTime', title: '预计完工时间', width: 105, templet: function (d) { return (d.proEndTime || '').substring(0, 10); } },
            { field: 'prenum', title: '前置间隔', width: 85, templet: function (d) { return d.prenum != null ? d.prenum : ''; } },
            { field: 'postnum', title: '后置间隔', width: 85, templet: function (d) { return d.postnum != null ? d.postnum : ''; } },
            { field: 'startTime', title: '开工时间', width: 150, templet: function (d) { return (d.startTime || '').substring(0, 16); } },
            { field: 'endTime', title: '完工时间', width: 150, templet: function (d) { return (d.endTime || '').substring(0, 16); } },
            { field: 'period', title: '工期', width: 75, templet: function (d) { return d.period != null ? d.period : ''; } },
            { field: 'accessoryLimit', title: '材料浮动限额', width: 105, templet: function (d) { return money(d.accessoryLimit); } },
            { field: 'salaryLimit', title: '工费浮动限额', width: 100, templet: function (d) { return money(d.salaryLimit); } },
            { field: 'accessoryTotal', title: '材料总额限额', width: 105, templet: function (d) { return money(d.accessoryTotal); } },
            { field: 'salaryTotal', title: '工费总额限额', width: 100, templet: function (d) { return money(d.salaryTotal); } },
            { field: 'precheck', title: '开工装修比例', width: 100, templet: function (d) { return d.precheck != null ? d.precheck : ''; } },
            { field: 'postcheck', title: '完工装修比例', width: 100, templet: function (d) { return d.postcheck != null ? d.postcheck : ''; } },
            { field: 'stacheck', title: '开工主材比例', width: 100, templet: function (d) { return d.stacheck != null ? d.stacheck : ''; } },
            { field: 'fincheck', title: '完工主材比例', width: 100, templet: function (d) { return d.fincheck != null ? d.fincheck : ''; } },
            { field: 'planSalary', title: '预估工费', width: 95, templet: function (d) { return money(d.planSalary); } },
            { field: 'planStatus', title: '预估工费状态', width: 105, templet: function (d) { return constructionCommon.badge(E.planStatus, d.planStatus); } },
            { field: 'additemStatus', title: '附加项状态', width: 95, templet: function (d) { return constructionCommon.badge(E.additemStatus, d.additemStatus); } },
            { field: 'planTime', title: '预估时间', width: 150, templet: function (d) { return (d.planTime || '').substring(0, 16); } },
            { field: 'materialPlanSchedule', title: '主材计划(完/总)', width: 135, templet: function (d) { return d.materialPlanTotal ? (d.materialPlanConfirm + '/' + d.materialPlanTotal) : '-'; } },
            { field: 'materialPlanOverdue', title: '主材逾期', width: 90, templet: function (d) { return d.materialPlanOverdue ? '<span style="color:red">' + d.materialPlanOverdue + '</span>' : '0'; } },
            { title: '操作', width: 400, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    var BTNS = [];
    function reg(ev, name, show, handle) { BTNS.push({ ev: ev, name: name, show: show, handle: handle }); }

    reg('updateNorm', '更新定额', function () { return btnVisible('updateNorm'); }, function (v) {
        state.schedule = v;
        $('#accessoryLimit').val(v.accessoryLimit);
        $('#salaryLimit').val(v.salaryLimit);
        $('#accessoryTotal').val(v.accessoryTotal);
        $('#salaryTotal').val(v.salaryTotal);
        layer.open({ type: 1, title: '更新定额', content: $('#updateNormBox'), area: ['440px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                app.post(api.construction.updateConstructionScheduleForNorm, {
                    'constructionSchedule.csid': state.schedule.csid,
                    'constructionSchedule.accessoryLimit': $('#accessoryLimit').val(),
                    'constructionSchedule.salaryLimit': $('#salaryLimit').val(),
                    'constructionSchedule.accessoryTotal': $('#accessoryTotal').val(),
                    'constructionSchedule.salaryTotal': $('#salaryTotal').val()
                }, function () {
                    app.showAlert(app.success, '操作成功');
                    layer.close(idx); query(state.page);
                });
            } });
    });
    reg('updateCale', '更新比例', function () { return btnVisible('updateCale'); }, function (v) {
        state.schedule = v;
        $('#precheck').val(v.precheck);
        $('#postcheck').val(v.postcheck);
        $('#stacheck').val(v.stacheck);
        $('#fincheck').val(v.fincheck);
        layer.open({ type: 1, title: '更新比例', content: $('#updateCaleBox'), area: ['440px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                app.post(api.construction.updateConstructionScheduleForScal, {
                    'constructionSchedule.csid': state.schedule.csid,
                    'constructionSchedule.precheck': $('#precheck').val(),
                    'constructionSchedule.postcheck': $('#postcheck').val(),
                    'constructionSchedule.stacheck': $('#stacheck').val(),
                    'constructionSchedule.fincheck': $('#fincheck').val()
                }, function () {
                    app.showAlert(app.success, '操作成功');
                    layer.close(idx); query(state.page);
                });
            } });
    });
    reg('updatePeriod', '更新工期', function () { return btnVisible('updatePeriod'); }, function (v) {
        state.schedule = v;
        $('#period').val(v.period);
        layer.open({ type: 1, title: '更新工期', content: $('#updatePeriodBox'), area: ['400px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                app.post(api.construction.updateConstructionScheduleForPeriod, {
                    'constructionSchedule.csid': state.schedule.csid,
                    'constructionSchedule.period': $('#period').val()
                }, function () {
                    app.showAlert(app.success, '操作成功');
                    layer.close(idx); query(state.page);
                });
            } });
    });
    reg('planSalary', '确认预估', function () { return btnVisible('planSalary'); }, function (v) {
        if (v.planStatus != 0) { app.showAlert(app.warning, '预估工费已确认,不可重复操作'); return; }
        state.schedule = v;
        $('#planSalary').val(v.planSalary);
        layer.open({ type: 1, title: '确认预估工费', content: $('#planSalaryBox'), area: ['400px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                app.post(api.construction.planConstructionSchedule, {
                    'constructionSchedule.csid': state.schedule.csid,
                    'constructionSchedule.planSalary': $('#planSalary').val()
                }, function () {
                    app.showAlert(app.success, '预估工费确认成功');
                    layer.close(idx); query(state.page);
                });
            } });
    });
    reg('additem', '附加项', function () { return btnVisible('additem'); }, function (v) {
        app.params.quotation = $.extend({}, app.params.quotation, { orderId: v.decoration.orderId });
        app.params.construction = $.extend({}, app.params.construction, { constructionSchedule: v });
        app.popup('views/quotation/normriceItem.html', '附加项', null, { area: ['85%', '85%'] });
    });
    reg('matplan', '主材计划', function () { return btnVisible('matplan'); }, function (v) {
        app.params.construction = $.extend({}, app.params.construction, { decoration: v.decoration });
        app.popup('views/construction/materialPlan.html', '主材计划', null, { area: ['85%', '85%'] });
    });

    table.on('tool(resultTable)', function (obj) {
        var ev = obj.event, v = obj.data;
        for (var i = 0; i < BTNS.length; i++) {
            if (BTNS[i].ev === ev) { BTNS[i].handle(v); return; }
        }
    });

    function query(pg) {
        state.page = pg || 1;
        app.post(pageConfig.apiPage, $.extend({}, constructionCommon.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            var data = p.data || [];
            renderToolbar(data.length ? data[0] : {});
            table.reload('resultTable', { data: data });
            state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function renderToolbar(sample) {
        var html = '';
        $.each(BTNS, function (i, b) {
            if (b.show(sample)) html += '<button class="layui-btn layui-btn-xs" lay-event="' + b.ev + '">' + b.name + '<\/button>';
        });
        $('#rowToolbar').html(html);
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    query(1);
});
}); // end app.ready
