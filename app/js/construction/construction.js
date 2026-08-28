/** app/js/construction/construction.js —— 工程单管理列表（核心工程单页）
 *  pageConfig：constructionFunctionRight name='construction' 决定 apiPage/pageBtn。
 *  行按钮：信息(工程信息弹窗)/查看(施工节点)/记录/增减项/返工/工程节点/工人工费/工程辅料/更新(额度)/
 *  辅料开启/辅料锁定/结算/终止。信息弹窗保存走 updateConstructionInfoByOrderId。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var E = constructionCommon.ENUM;
    var pageConfig = constructionCommon.getPageConfig('construction');
    var state = { page: 1, rows: 10, total: 0, cid: null, infoOrderId: null };
    if (!pageConfig.apiPage) pageConfig.apiPage = api.construction.pageConstructionForBase;

    function btnVisible(key) { return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.indexOf(key) != -1; }

    constructionCommon.dateRange('#startTime');
    constructionCommon.dateRange('#endTime');
    ['finishTime', 'keyTime', 'drawlineTime', 'designTime'].forEach(function (id) {
        laydate.render({ elem: '#' + id, format: 'yyyy-MM-dd' });
    });

    // —— 表格 ——
    function money(v) { return app.formatMoney(v); }
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'orderId', title: '装修单', width: 115, fixed: 'left', templet: function (d) { return d.decoration ? d.decoration.orderId : ''; } },
            { field: 'village', title: '楼盘', width: 110, templet: function (d) { return d.decoration && d.decoration.house && d.decoration.house.village ? d.decoration.house.village.name : ''; } },
            { field: 'houseNumber', title: '楼号', width: 80, templet: function (d) { return d.decoration && d.decoration.house ? d.decoration.house.houseNumber : ''; } },
            { field: 'customer', title: '客户', width: 80, templet: function (d) { return d.decoration && d.decoration.customer ? d.decoration.customer.name : ''; } },
            { field: 'designer', title: '设计师', width: 80, templet: function (d) { return d.decoration && d.decoration.designer ? d.decoration.designer.currentName : ''; } },
            { field: 'supervisor', title: '监理', width: 80, templet: function (d) { return d.supervisor ? d.supervisor.currentName : ''; } },
            { field: 'orderTotalPrice', title: '总价', width: 95, templet: function (d) { return d.decoration ? money(d.decoration.orderTotalPrice) : ''; } },
            { field: 'version', title: '报价版本', width: 90, templet: function (d) { return d.decoration && d.decoration.version ? d.decoration.version.name : ''; } },
            { field: 'buildArea', title: '面积', width: 80, templet: function (d) { return d.decoration && d.decoration.house ? d.decoration.house.buildArea : ''; } },
            { field: 'projectStatus', title: '工程状态', width: 90, templet: function (d) { return d.decoration ? constructionCommon.badge({ 0: '初始', 1: '开工', 2: '完工' }, d.decoration.projectStatus) : ''; } },
            { field: 'process', title: '施工状态', width: 90, templet: function (d) { return constructionCommon.badge(E.process, d.process); } },
            { field: 'createTime', title: '创建时间', width: 150, templet: function (d) { return (d.createTime || '').substring(0, 16); } },
            { field: 'preStartTime', title: '预计开工时间', width: 105, templet: function (d) { return (d.preStartTime || '').substring(0, 10); } },
            { field: 'preEndTime', title: '预计完工时间', width: 105, templet: function (d) { return (d.preEndTime || '').substring(0, 10); } },
            { field: 'startTime', title: '开工时间', width: 105, templet: function (d) { return (d.startTime || '').substring(0, 10); } },
            { field: 'endTime', title: '完工时间', width: 105, templet: function (d) { return (d.endTime || '').substring(0, 10); } },
            { field: 'finishTime', title: '验收时间', width: 105, templet: function (d) { return (d.finishTime || '').substring(0, 10); } },
            { field: 'period', title: '预计工期', width: 85, templet: function (d) { return d.period != null ? d.period : ''; } },
            { field: 'processTime', title: '竣工交付时间', width: 110, templet: function (d) { return (d.processTime || '').substring(0, 10); } },
            { field: 'accessoryLimit', title: '辅料额上限', width: 95, templet: function (d) { return money(d.accessoryLimit); } },
            { field: 'salaryLimit', title: '工费上限', width: 90, templet: function (d) { return money(d.salaryLimit); } },
            { field: 'accessory', title: '辅料控制', width: 85, templet: function (d) { return constructionCommon.badge(E.isAccessory, d.accessory); } },
            { field: 'balanceStatus', title: '结算状态', width: 85, templet: function (d) { return constructionCommon.badge(E.balance, d.balanceStatus); } },
            { field: 'terminalStatus', title: '终止状态', width: 85, templet: function (d) { return constructionCommon.badge(E.terminalStatus, d.terminalStatus); } },
            { title: '操作', width: 380, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    // —— 动态行按钮 ——
    var BTNS = [];
    function reg(ev, name, show, handle) { BTNS.push({ ev: ev, name: name, show: show, handle: handle }); }

    reg('info', '信息', function () { return btnVisible('info'); }, function (v) {
        state.infoOrderId = v.decoration.orderId;
        app.post(api.construction.queryConstructionInfoByOrderId, { 'constructionInfo.orderId': v.decoration.orderId }, function (res) {
            var data = res.constructionInfo || {};
            $('#ishovel').val(data.ishovel != null ? data.ishovel : 0);
            $('#iskey').val(data.iskey != null ? data.iskey : 0);
            $('#isCeremony').val(data.isCeremony != null ? data.isCeremony : 0);
            $('#timeLimit').val(data.timeLimit != null ? data.timeLimit : '');
            $('#finishTime').val(data.finishTime ? data.finishTime.substring(0, 10) : '');
            $('#keyTime').val(data.keyTime ? data.keyTime.substring(0, 10) : '');
            $('#drawlineTime').val(data.drawlineTime ? data.drawlineTime.substring(0, 10) : '');
            $('#designTime').val(data.designTime ? data.designTime.substring(0, 10) : '');
            $('#comment').val(data.comment || '');
            form.render('select');
            layer.open({ type: 1, title: '工程信息 - ' + v.decoration.orderId, content: $('#constructionInfoBox'), area: ['520px', '90%'],
                btn: ['保存', '取消'], yes: function (idx) { saveInfoData(idx); } });
        });
    });
    reg('view', '查看', function () { return btnVisible('view'); }, function (v) {
        app.params.construction = $.extend({}, app.params.construction, { orderId: v.decoration.orderId });
        app.popup('views/construction/supervision4detail.html', '查看', null, { area: ['95%', '90%'] });
    });
    reg('record', '记录', function () { return btnVisible('record'); }, function (v) {
        app.params.orderId = v.decoration.orderId;
        app.popup(api.index.constructionRecordIndex.url, '记录', null, { area: ['70%', '80%'] });
    });
    reg('addReduce', '增减项', function () { return btnVisible('addReduce'); }, function (v) {
        app.params.quotation = $.extend({}, app.params.quotation, { orderId: v.decoration.orderId });
        app.params.historyPage = api.index.supervisionIndex.url;
        app.switchPage('views/quotation/addReduceIndex.html');
    });
    reg('rework', '返工', function () { return btnVisible('rework'); }, function (v) {
        app.params.construction = $.extend({}, app.params.construction, { orderId: v.decoration.orderId });
        app.popup('views/construction/supervision4rework.html', '返工', null, { area: ['80%', '80%'] });
    });
    reg('constructionNode', '工程节点', function () { return btnVisible('constructionNode'); }, function (v) {
        app.params.construction = v;
        app.popup(api.index.constructionNode2printIndex.url, '工程节点', null, { area: ['80%', '80%'] });
    });
    reg('workerSalary', '工人工费', function () { return btnVisible('workerSalary'); }, function (v) {
        app.params.construction = v;
        app.popup(api.index.workerSalary2printIndex.url, '工人工费', null, { area: ['80%', '80%'] });
    });
    reg('accessory', '工程辅料', function () { return btnVisible('accessory'); }, function (v) {
        app.params.construction = $.extend({}, app.params.construction, { orderId: v.decoration.orderId, cid: v.cid });
        app.popup('views/construction/accessory.html', '工程辅料', null, { area: ['80%', '80%'] });
    });
    reg('update', '更新', function () { return btnVisible('update'); }, function (v) {
        state.cid = v.cid;
        $('#accessoryLimit').val(v.accessoryLimit);
        $('#salaryLimit').val(v.salaryLimit);
        layer.open({ type: 1, title: '更新额度 - ' + v.decoration.orderId, content: $('#updateConstructionBox'), area: ['440px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                app.post(api.construction.updateConstructionForAdvance, {
                    'construction.cid': state.cid,
                    'construction.accessoryLimit': $('#accessoryLimit').val(),
                    'construction.salaryLimit': $('#salaryLimit').val()
                }, function () {
                    app.showAlert(app.success, '操作成功');
                    layer.close(idx); query(state.page);
                });
            } });
    });
    reg('accessoryOpen', '辅料开启', function (v) { return btnVisible('accessoryOpen') && v.accessory == 1; }, function (v) {
        app.post(api.construction.openConstruction, { 'construction.cid': v.cid }, function () {
            app.showAlert(app.info, '创建辅料单状态开启');
            query(state.page);
        });
    });
    reg('accessoryLock', '辅料锁定', function (v) { return btnVisible('accessoryLock') && v.accessory == 0; }, function (v) {
        app.post(api.construction.lockConstruction, { 'construction.cid': v.cid }, function () {
            app.showAlert(app.info, '创建辅料单状态锁定');
            query(state.page);
        });
    });
    reg('balance', '结算', function (v) { return btnVisible('balance') && v.accessory == 0; }, function (v) {
        app.post(api.construction.balanceConstruction, { 'construction.cid': v.cid }, function () {
            query(state.page);
        });
    });
    reg('balanceReject', '结算驳回', function (v) { return btnVisible('balanceReject') && v.accessory == 0; }, function (v) {
        app.showConfirm('是否驳回工程结算,驳回后工程单可继续创建普通工费', function () {
            app.post(api.construction.rejectConstructionForBalance, { 'construction.cid': v.cid }, function () {
                query(state.page);
            });
        });
    });
    reg('terminal', '终止', function () { return btnVisible('terminal'); }, function (v) {
        state.cid = v.cid;
        $('#terminalStatus').val(v.terminalStatus != null ? v.terminalStatus : 0);
        form.render('select');
        layer.open({ type: 1, title: '工程终止 - ' + v.decoration.orderId, content: $('#updateTerminalStatusBox'), area: ['440px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                app.post(api.construction.updateConstructionByCid, {
                    'construction.cid': state.cid,
                    'construction.terminalStatus': $('#terminalStatus').val()
                }, function () {
                    app.showAlert(app.success, '操作成功');
                    layer.close(idx); query(state.page);
                });
            } });
    });

    table.on('tool(resultTable)', function (obj) {
        var ev = obj.event, v = obj.data;
        for (var i = 0; i < BTNS.length; i++) {
            if (BTNS[i].ev === ev) { BTNS[i].handle(v); return; }
        }
    });

    // —— 工程信息保存 ——
    function saveInfoData(idx) {
        var options = {
            'constructionInfo.orderId': state.infoOrderId,
            'constructionInfo.decoration.orderId': state.infoOrderId,
            'constructionInfo.timeLimit': $('#timeLimit').val(),
            'constructionInfo.ishovel': $('#ishovel').val(),
            'constructionInfo.iskey': $('#iskey').val(),
            'constructionInfo.isCeremony': $('#isCeremony').val(),
            'constructionInfo.finishTime': $('#finishTime').val() + ' 00:00:00',
            'constructionInfo.keyTime': $('#keyTime').val() + ' 00:00:00',
            'constructionInfo.drawlineTime': $('#drawlineTime').val() + ' 00:00:00',
            'constructionInfo.designTime': $('#designTime').val() + ' 00:00:00',
            'constructionInfo.comment': $('#comment').val()
        };
        app.post(api.construction.updateConstructionInfoByOrderId, options, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(idx);
        });
    }

    // —— 查询 ——
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
