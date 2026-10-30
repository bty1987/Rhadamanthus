/** app/js/construction/constructionInfo.js —— 工程信息（交底/放线方案确认/交接管理 + 导出）
 *  url ?type=plan|done|issue|contract 注入初始过滤（期房/现房/已分配/签约集）。
 *  行按钮：记录/服务/打印(施工计划表)/施工计划/预派监理(节点工期+监理 pretreatDrawLine)/验房/交接/
 *  画像/标签(工程画像 type=4)/重置设计。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var E = constructionCommon.ENUM;
    var pageConfig = constructionCommon.getPageConfig('constructionInfo');
    var pageType = (app.params.urlLoadParams && app.params.urlLoadParams.type) || '';
    var state = { page: 1, rows: 10, total: 0, info: null };
    if (!pageConfig.apiPage) pageConfig.apiPage = api.construction.pageConstructionInfo;

    function btnVisible(key) { return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.indexOf(key) != -1; }

    ['keyTime', 'drawlineTime', 'finishTime', 'designTime', 'issueTime', 'sdesignTime', 'edesignTime'].forEach(function (id) {
        constructionCommon.dateRange('#' + id);
    });

    // —— 初始过滤（对齐旧 options 分支）——
    var baseOptions = { 'constructionInfo.drawlineTime': '' };
    if (pageType == 'plan') {
        var current = new Date();
        current.setMonth(current.getMonth() + 2);
        baseOptions = {
            'constructionInfo.decoration.houseType': '期房',
            'constructionInfo.decoration.designStatus': 2,
            'constructionInfo.isIssue': 0,
            'constructionInfo.drawlineTime': app.dateFormat(current, 'yyyy-MM-dd')
        };
    } else if (pageType == 'done') {
        baseOptions = {
            'constructionInfo.decoration.houseType': '现房',
            'constructionInfo.decoration.designStatus': 2,
            'constructionInfo.isIssue': 0,
            'constructionInfo.drawlineTime': ''
        };
    } else if (pageType == 'issue') {
        baseOptions = { 'constructionInfo.isIssue': 1 };
    } else if (pageType == 'contract') {
        baseOptions = { 'constructionInfo.isIssue': 0 };
    }
    if (pageType == 'plan' || pageType == 'done' || pageType == 'contract') {
        // 排除废单(5)、终止(6)、完工(8)；contract 仅 [2,3,7]
        var statusArr = pageType == 'contract' ? [2, 3, 7] : [0, 1, 2, 3, 4, 7];
        $.each(statusArr, function (i, v) { baseOptions['decoration.statuses[' + i + ']'] = v; });
    }

    function money(v) { return app.formatMoney(v); }
    function d(v) { return (v || '').substring(0, 10); }
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'orderId', title: '装修单', width: 110, fixed: 'left', templet: function (d0) { return d0.decoration ? d0.decoration.orderId : ''; } },
            { field: 'village', title: '楼盘', width: 100, templet: function (d0) { return d0.decoration && d0.decoration.house && d0.decoration.house.village ? d0.decoration.house.village.name : ''; } },
            { field: 'houseNumber', title: '楼号', width: 75, templet: function (d0) { return d0.decoration && d0.decoration.house ? d0.decoration.house.houseNumber : ''; } },
            { field: 'customer', title: '客户', width: 75, templet: function (d0) { return d0.decoration && d0.decoration.customer ? d0.decoration.customer.name : ''; } },
            { field: 'designerFatherDept', title: '设计分区', width: 95, templet: function (d0) { return d0.decoration && d0.decoration.designer && d0.decoration.designer.dept && d0.decoration.designer.dept.fatherDept ? d0.decoration.designer.dept.fatherDept.name : ''; } },
            { field: 'designerDept', title: '设计部', width: 95, templet: function (d0) { return d0.decoration && d0.decoration.designer && d0.decoration.designer.dept ? d0.decoration.designer.dept.name : ''; } },
            { field: 'designer', title: '设计师', width: 80, templet: function (d0) { return d0.decoration && d0.decoration.designer ? d0.decoration.designer.currentName : ''; } },
            { field: 'salesman', title: '业务员', width: 80, templet: function (d0) { return d0.decoration && d0.decoration.salesman ? d0.decoration.salesman.currentName : ''; } },
            { field: 'escorter', title: '方案设计', width: 80, templet: function (d0) { return d0.decoration && d0.decoration.escorter ? d0.decoration.escorter.currentName : ''; } },
            { field: 'supervisor', title: '监理', width: 80, templet: function (d0) { return d0.decoration && d0.decoration.supervisor ? d0.decoration.supervisor.currentName : ''; } },
            { field: 'status', title: '装修状态', width: 80, templet: function (d0) { return d0.decoration ? constructionCommon.badge(E.decorationStatus, d0.decoration.status) : ''; } },
            { field: 'designStatus', title: '设计完成状态', width: 100, templet: function (d0) { var v = d0.decoration ? E.designStatus[d0.decoration.designStatus] : ''; return v != null ? v : ''; } },
            { field: 'typeness', title: '装修业务', width: 80, templet: function (d0) { var v = d0.decoration ? E.typeness[d0.decoration.typeness] : ''; return v != null ? v : ''; } },
            { field: 'buildArea', title: '面积', width: 75, templet: function (d0) { return d0.decoration && d0.decoration.house ? d0.decoration.house.buildArea : ''; } },
            { field: 'orderTotalPrice', title: '合同额', width: 90, templet: function (d0) { return d0.decoration ? money(d0.decoration.orderTotalPrice) : ''; } },
            { field: 'version', title: '报价版本', width: 85, templet: function (d0) { return d0.decoration && d0.decoration.version ? d0.decoration.version.name : ''; } },
            { field: 'contractTime', title: '签单时间', width: 100, templet: function (d0) { return d0.decoration ? d(d0.decoration.contractTime) : ''; } },
            { field: 'designPeriod', title: '设计天数', width: 85, templet: function (v) { return v.designPeriod ? v.designPeriod + '天' : ''; } },
            { field: 'designOverdueDays', title: '设计超期天数', width: 100, templet: function (v) { return v.designOverdueDays ? v.designOverdueDays + '天' : ''; } },
            { field: 'issueTime', title: '分配时间', width: 100, templet: function (v) { return d(v.issueTime); } },
            { field: 'initDesignTime', title: '初始设计完成', width: 100, templet: function (v) { return d(v.initDesignTime); } },
            { field: 'keyTime', title: '预计交钥匙', width: 100, templet: function (v) { return d(v.keyTime); } },
            { field: 'drawlineTime', title: '预计放线时间', width: 100, templet: function (v) { return d(v.drawlineTime); } },
            { field: 'finishTime', title: '预计完工时间', width: 100, templet: function (v) { return d(v.finishTime); } },
            { field: 'designTime', title: '预计设计完成', width: 100, templet: function (v) { return d(v.designTime); } },
            { field: 'sdesignTime', title: '合同方案确认', width: 100, templet: function (d0) { return d0.decoration ? d(d0.decoration.sdesignTime) : ''; } },
            { field: 'edesignTime', title: '放线方案确认', width: 100, templet: function (d0) { return d0.decoration ? d(d0.decoration.edesignTime) : ''; } },
            { field: 'projectStatus', title: '工程状态', width: 85, templet: function (d0) { return d0.decoration ? constructionCommon.badge({ 0: '初始', 1: '开工', 2: '完工' }, d0.decoration.projectStatus) : ''; } },
            { field: 'handoverStatus', title: '交接状态', width: 85, templet: function (v) { var t = E.handoverStatus[v.handoverStatus]; return t != null ? constructionCommon.badge(E.handoverStatus, v.handoverStatus) : '-'; } },
            { field: 'comment', title: '备注', minWidth: 120, templet: function (v) { return v.comment || ''; } },
            { title: '操作', width: 400, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    var BTNS = [];
    function reg(ev, name, show, handle) { BTNS.push({ ev: ev, name: name, show: show, handle: handle }); }

    reg('view', '记录', function () { return btnVisible('view'); }, function (v) {
        app.params.orderId = v.decoration.orderId;
        app.popup(api.index.constructionRecordIndex.url, '记录', null, { area: ['70%', '80%'] });
    });
    reg('service', '服务', function () { return btnVisible('service'); }, function (v) {
        app.params.decoration = $.extend({}, app.params.decoration, { orderId: v.decoration.orderId });
        app.popup('views/decoration/decoration4service.html', '服务功能: ' + v.decoration.orderId, null, { area: ['70%', '80%'] });
    });
    reg('conplanPrint', '打印', function () { return btnVisible('conplanPrint'); }, function (v) {
        app.params.construction = v;
        app.popup(api.index.constructionPlan2print.url, '工程施工进度计划表', null, { area: ['85%', '90%'] });
    });
    reg('conplan', '施工计划', function () { return btnVisible('conplan'); }, function (v) {
        app.params.construction = v;
        app.popup('views/construction/constructionPlan.html', '计划', null, { area: ['85%', '85%'] });
    });
    reg('proLine', '预派监理', function () { return btnVisible('proLine'); }, function (v) { pretreat(v); });
    reg('check', '验房', function () { return btnVisible('check'); }, function (v) {
        state.info = v;
        $('#checkUser').val('');
        form.render('select');
        layer.open({ type: 1, title: '验房 - ' + v.decoration.orderId, content: $('#checkBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                app.post(api.construction.checkConstructionInfo, {
                    'constructionInfo.ciid': state.info.ciid,
                    'constructionInfo.isCheck': $('#checkUser').val()
                }, function () {
                    app.showAlert(app.success, '操作成功');
                    layer.close(idx); query(state.page);
                });
            } });
    });
    reg('handover', '交接', function () { return btnVisible('handover'); }, function (v) {
        state.info = v;
        $('#handoverStatus').val(v.handoverStatus != null ? v.handoverStatus : 0);
        form.render('select');
        layer.open({ type: 1, title: '交接 - ' + v.decoration.orderId, content: $('#handoverBox'), area: ['440px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                var orderId = state.info.orderId || (state.info.decoration ? state.info.decoration.orderId : null);
                if (!orderId) { app.showAlert(app.error, '订单ID为空，无法进行交接操作'); return; }
                app.post(api.construction.handoverConstructionInfo, {
                    'constructionInfo.orderId': orderId,
                    'constructionInfo.decoration.orderId': orderId,
                    'constructionInfo.handoverStatus': $('#handoverStatus').val()
                }, function () {
                    app.showAlert(app.success, '交接成功');
                    layer.close(idx); query(state.page);
                });
            } });
    });
    reg('profile', '画像', function () { return btnVisible('profile'); }, function (v) {
        app.params.customer = $.extend({}, app.params.customer, { orderId: v.decoration.orderId, profile: { orderId: v.decoration.orderId } });
        app.popup('views/customer/customerProfile4detail.html', '客户画像: ' + v.decoration.orderId, null, { area: ['70%', '85%'] });
    });
    reg('constructionTag', '标签', function () { return btnVisible('constructionTag'); }, function (v) {
        var template = null;
        app.post(api.system.querySystemConfigByKey, { 'systemConfig.key': 'CONSTRUCTION_TAG_PROFILE_TEMPLATE' }, function (res) {
            template = res.systemConfig ? res.systemConfig.value : null;
        }, null, false);
        if (!template) { app.showAlert(app.error, '工程标签模板未配置'); return; }
        app.params.constructionProfile = { orderId: v.decoration.orderId, type: 4, profile: { type: 4 } };
        app.popup(api.index.constructionProfile4detailIndex.url, '工程标签', null, { area: ['75%', '85%'] });
    });
    reg('resetDesign', '重置设计', function () { return btnVisible('resetDesign'); }, function (v) {
        app.showConfirm('确定要重置该订单的设计状态和确认状态吗？', function () {
            app.post(api.decoration.resetDecorationFordesignStatus, { 'decoration.orderId': v.decoration.orderId }, function () {
                app.showAlert(app.success, '重置成功');
                query(state.page);
            });
        });
    });

    table.on('tool(resultTable)', function (obj) {
        var ev = obj.event, v = obj.data;
        for (var i = 0; i < BTNS.length; i++) {
            if (BTNS[i].ev === ev) { BTNS[i].handle(v); return; }
        }
    });

    // —— 预派监理（施工节点工期 + 监理 → pretreatDrawLine）——
    function pretreat(v) {
        app.params.decoration = $.extend({}, app.params.decoration, { orderId: v.decoration.orderId });
        $('#supervisorSelect').html('<option value="">请选择监理(工程部)</option>');
        app.post(api.personel.queryUserByPinyin, { 'departmentType.name': '工程部', 'user.status': 0 }, function (res) {
            var html = '';
            $.each(res.autoFillKeyValue || [], function (i, u) { html += '<option value="' + u.key + '">' + u.value + '<\/option>'; });
            $('#supervisorSelect').append(html);
            form.render('select');
        }, null, false);

        $('#constructionNodes').html('');
        var nodes = [];
        app.post(api.data.queryConstructionNode, {}, function (res) {
            nodes = (res.constructionNodes || []).sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); });
        }, null, false);

        var html = '';
        $.each(nodes, function (index, value) {
            if (value.proset != 1) return; // 仅预置节点（PROSET_PROSET_INT=1）
            html += '<div class="layui-form-item">'
                + '<label class="layui-form-label" style="text-align:left;">'
                + '<input type="checkbox" name="sorts" lay-skin="primary" data-sort="' + value.sort + '" data-cnid="' + value.cnid + '" data-prenum="" data-postnum="" title="' + value.name + '">'
                + '<\/label>'
                + '<div class="layui-input-inline"><input type="text" name="timeLimits" class="layui-input nodeTimeLimit" data-sort="' + value.sort + '" data-cnid="' + value.cnid + '" value="' + (value.timeLimit != null ? value.timeLimit : '') + '" placeholder="工期"><\/div>'
                + '<\/div>';
        });
        $('#constructionNodes').html(html);
        form.render('checkbox');

        // 面积匹配默认工期（constructionPace + paceNode）
        var pace = null;
        app.post(api.data.queryConstructionPace, { 'constructionPace.lowerArea': v.decoration.house ? v.decoration.house.innerArea : '' }, function (res) {
            pace = res.constructionPace;
        }, null, false);
        if (pace && pace.cpid) {
            app.post(api.data.queryConstructionPaceNode, { 'constructionPaceNode.cpid': pace.cpid }, function (res) {
                $.each(res.constructionPaceNodes || [], function (i, pn) {
                    $('.nodeTimeLimit[data-cnid="' + (pn.node ? pn.node.cnid : pn.cnid) + '"]').val(pn.period);
                    $('input[name="sorts"][data-cnid="' + (pn.node ? pn.node.cnid : pn.cnid) + '"]').prop('checked', true);
                });
                form.render('checkbox');
            }, null, false);
        }

        // 已有施工计划回填
        app.post(api.construction.queryConstructionPlanByOrderId, { 'constructionPlan.orderId': v.decoration.orderId }, function (res) {
            $.each(res.constructionPlans || [], function (i, plan) {
                $('.nodeTimeLimit[data-cnid="' + plan.cnid + '"]').val(plan.connum);
                $('input[name="sorts"][data-cnid="' + plan.cnid + '"]').prop('checked', true);
            });
            form.render('checkbox');
        }, null, false);

        layer.open({ type: 1, title: '预派监理 - ' + v.decoration.orderId, content: $('#constructionNodeBox'), area: ['560px', '85%'],
            btn: ['提交', '取消'], yes: function (idx) {
                var option = {
                    'drawLine.decoration.orderId': app.params.decoration.orderId,
                    'drawLine.decoration.supervisor.userId': $('#supervisorSelect').val()
                };
                var $inputs = $('input[name="sorts"]:checked');
                $.each($inputs, function (i, el) {
                    var $input = $(el);
                    option['constructionNodes[' + i + '].cnid'] = $input.attr('data-cnid');
                    option['constructionNodes[' + i + '].sort'] = $input.attr('data-sort');
                    option['constructionNodes[' + i + '].prenum'] = $input.attr('data-prenum');
                    option['constructionNodes[' + i + '].postnum'] = $input.attr('data-postnum');
                    option['constructionNodes[' + i + '].timeLimit'] = $('.nodeTimeLimit[data-sort="' + $input.attr('data-sort') + '"]').val();
                });
                app.post(api.construction.pretreatDrawLine, option, function () {
                    app.showAlert(app.success, '放线成功');
                    layer.close(idx); query(state.page);
                });
            } });
    }

    // —— 查询 ——
    function query(pg) {
        state.page = pg || 1;
        app.post(pageConfig.apiPage, $.extend({}, baseOptions, constructionCommon.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
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

    // —— 导出 ——
    $('#btnExport').on('click', function () {
        if (!state.total) { app.showAlert(app.warning, '请通过条件进行查询'); return; }
        if (state.total > 5000) { app.showAlert(app.warning, '查询结果大于阀值 , 不能完成导出动作'); return; }
        app.post(pageConfig.apiPage, $.extend({}, baseOptions, constructionCommon.buildFilters($('#searchForm')), { 'paging.page': 1, 'paging.rows': 5000, 'paging.noPage': 1 }), function (res) {
            var data = (res.paging || {}).data || [];
            $.each(data, function (i, v) {
                var dec = v.decoration || {};
                var house = dec.house || {};
                v.orderId = dec.orderId != null ? dec.orderId : '';
                v['装修单号'] = dec.orderId != null ? dec.orderId : '';
                v['楼盘地址'] = house.village ? ((house.village.cityProper && house.village.cityProper.city ? house.village.cityProper.city.name + ' ' : '') + house.village.cityProper.name + ' ' + house.village.name + ' ' + (house.houseNumber || '')) : '';
                v['面积'] = house.buildArea != null ? house.buildArea : '';
                v['计划面积'] = house.innerArea != null ? house.innerArea : '';
                v['设计分区'] = dec.designer && dec.designer.dept && dec.designer.dept.fatherDept ? dec.designer.dept.fatherDept.name : '';
                v['设计部'] = dec.designer && dec.designer.dept ? dec.designer.dept.name : '';
                v['设计师'] = dec.designer ? dec.designer.userName : '';
                v['业务员'] = dec.salesman ? dec.salesman.currentName : '';
                v['监理'] = dec.supervisor ? dec.supervisor.userName : '';
                v['签单时间'] = dec.contractTime != null ? dec.contractTime : '';
                v['合同额'] = dec.orderTotalPrice != null ? dec.orderTotalPrice : '';
                v['预签合同额'] = dec.procontractPrice != null ? dec.procontractPrice : '';
                v['折扣'] = dec.discount != null ? dec.discount : '';
                v['设计天数'] = v.designPeriod != null ? v.designPeriod : '';
                v['设计超期天数'] = v.designOverdueDays != null ? v.designOverdueDays : '';
                v['分配时间'] = v.issueTime != null ? v.issueTime : '';
                v['初始设计完成时间'] = v.initDesignTime != null ? v.initDesignTime : '';
                v['预计交钥匙时间'] = v.keyTime != null ? v.keyTime : '';
                v['预计放线时间'] = v.drawlineTime != null ? v.drawlineTime : '';
                v['预计完工时间'] = v.finishTime != null ? v.finishTime : '';
                v['预计设计完成时间'] = v.designTime != null ? v.designTime : '';
                v['合同方案确认时间'] = dec.sdesignTime != null ? dec.sdesignTime : '';
                v['放线方案确认时间'] = dec.edesignTime != null ? dec.edesignTime : '';
                v['设计完成状态'] = E.designStatus[dec.designStatus] != null ? E.designStatus[dec.designStatus] : '';
                v['订单类型'] = E.typeness[dec.typeness] != null ? E.typeness[dec.typeness] : '';
                v['工程状态'] = ({ 0: '初始', 1: '开工', 2: '完工' })[dec.projectStatus] != null ? ({ 0: '初始', 1: '开工', 2: '完工' })[dec.projectStatus] : '';
                v['装修状态'] = E.decorationStatus[dec.status] != null ? E.decorationStatus[dec.status] : '';
                // 清除嵌套对象，避免导出 [object Object]
                delete v.decoration;
            });
            table.exportFile('resultTable', data, 'csv', '工程信息');
        });
    });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    query(1);
});
}); // end app.ready
