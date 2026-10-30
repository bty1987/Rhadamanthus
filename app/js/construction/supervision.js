/** app/js/construction/supervision.js —— 监理工程列表
 *  pageConfig：name='supervision'。url ?type=xxx 为只读模式。
 *  行按钮：信息/施工节点(向导)/增减项/扣款/定额材料/定额工费(打印)/定额工时(打印)。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var pageConfig = constructionCommon.getPageConfig('supervision');
    var state = { page: 1, rows: 10, total: 0, infoOrderId: null, quotationDetail: {} };
    var pageType = (app.params.urlLoadParams && app.params.urlLoadParams.type) || '';
    if (!pageConfig.apiPage) pageConfig.apiPage = api.construction.pageConstruction;

    function btnVisible(key) { return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.indexOf(key) != -1; }

    ['finishTime', 'keyTime', 'drawlineTime', 'designTime'].forEach(function (id) {
        laydate.render({ elem: '#' + id, format: 'yyyy-MM-dd' });
    });

    // 施工节点下拉（定额工费/工时打印用）
    var nodeMap = constructionCommon.loadNodeMap();
    function fillNodeSelect($sel) {
        var html = '';
        $.each(nodeMap, function (cnid, name) { html += '<option value="' + cnid + '">' + name + '<\/option>'; });
        $sel.html(html);
        form.render('select');
    }

    function money(v) { return app.formatMoney(v); }
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'orderId', title: '装修单', width: 115, fixed: 'left' },
            { field: 'village', title: '楼盘', width: 110, templet: function (d) { return d.house && d.house.village ? d.house.village.name : ''; } },
            { field: 'houseNumber', title: '楼号', width: 80, templet: function (d) { return d.house ? d.house.houseNumber : ''; } },
            { field: 'customer', title: '客户', width: 80, templet: function (d) { return d.customer ? d.customer.name : ''; } },
            { field: 'designer', title: '设计师', width: 80, templet: function (d) { return d.designer ? d.designer.currentName : ''; } },
            { field: 'supervisor', title: '监理', width: 80, templet: function (d) { return d.supervisor ? d.supervisor.currentName : ''; } },
            { field: 'orderTotalPrice', title: '总价', width: 95, templet: function (d) { return money(d.orderTotalPrice); } },
            { field: 'buildArea', title: '面积', width: 80, templet: function (d) { return d.house ? d.house.buildArea : ''; } },
            { field: 'version', title: '报价版本', width: 90, templet: function (d) { return d.version ? d.version.name : ''; } },
            { field: 'projectStatus', title: '进度', width: 90, templet: function (d) { return constructionCommon.badge({ 0: '初始', 1: '开工', 2: '完工' }, d.projectStatus); } },
            { title: '操作', width: 420, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    var BTNS = [];
    function reg(ev, name, show, handle) { BTNS.push({ ev: ev, name: name, show: show, handle: handle }); }

    reg('info', '信息', function () { return btnVisible('info'); }, function (v) { viewConstructionInfo(v.orderId); });
    reg('view', '施工节点', function () { return btnVisible('view'); }, function (v) {
        app.params.construction = $.extend({}, app.params.construction, { orderId: v.orderId, cid: v.customer ? v.customer.cid : '' });
        app.params.urlLoadParams = $.extend({}, app.params.urlLoadParams, { type: pageType });
        app.popup('views/construction/supervision4detail.html', '查看', null, { area: ['95%', '90%'] });
    });
    reg('addReduce', '增减项', function () { return btnVisible('addReduce'); }, function (v) {
        app.params.quotation = $.extend({}, app.params.quotation, { orderId: v.orderId });
        app.params.historyPage = api.index.supervisionIndex.url;
        app.switchPage('views/quotation/addReduceIndex.html');
    });
    reg('money', '扣款', function () { return btnVisible('money'); }, function (v) {
        app.params.decoration = $.extend({}, app.params.decoration, { orderId: v.orderId, auditStatusType: 'select' });
        app.popup('views/decoration/decorationAuditRecord.html', '扣款', null, { area: ['85%', '85%'] });
    });
    reg('quota', '定额材料', function () { return btnVisible('quota'); }, function (v) {
        app.params.quotation = $.extend({}, app.params.quotation, { orderId: v.orderId });
        app.popup('views/construction/normtion.html', '定额材料', null, { area: ['85%', '85%'] });
    });
    reg('quopt', '定额工费', function () { return btnVisible('quopt'); }, function (v) {
        state.quotationDetail = {};
        app.post(api.quotation.queryQuotationForDefaultByOrderId, { 'quotation.orderId': v.orderId }, function (res) {
            state.quotationDetail.quotation = res.quotation;
        }, null, false);
        var quotationId = state.quotationDetail.quotation ? state.quotationDetail.quotation.qid : null;
        if (quotationId == null) { app.showAlert(app.error, '报价不存在'); return; }
        app.params.quotation = $.extend({}, app.params.quotation, {
            orderId: v.orderId, orderType: v.type, quotationId: quotationId, subtype: [1],
            showType: { itemtype: 4 }, pageType: pageType
        });
        fillNodeSelect($('#constructionNode'));
        $('#printQuotationCNBox input[name="type"]').prop('checked', false);
        form.render('checkbox');
        layer.open({ type: 1, title: '定额工费 - ' + v.orderId, content: $('#printQuotationCNBox'), area: ['460px', 'auto'],
            btn: ['打印(半包)', '打印(整包)', '取消'], btn1: function () { printNormrice(1); }, btn2: function () { printNormrice(2); } });
    });
    reg('normtime', '定额工时', function () { return btnVisible('normtime'); }, function (v) {
        state.quotationDetail = {};
        app.post(api.quotation.queryQuotationForDefaultByOrderId, { 'quotation.orderId': v.orderId }, function (res) {
            state.quotationDetail.quotation = res.quotation;
        }, null, false);
        var quotationId = state.quotationDetail.quotation ? state.quotationDetail.quotation.qid : null;
        if (quotationId == null) { app.showAlert(app.error, '报价不存在'); return; }
        app.params.quotation = $.extend({}, app.params.quotation, {
            orderId: v.orderId, orderType: v.type, quotationId: quotationId, subtype: [1],
            showType: { itemtype: 5 }, pageType: pageType
        });
        fillNodeSelect($('#normtimeConstructionNode'));
        $('#printNormtimeCNBox input[name="normtimeType"]').prop('checked', false);
        form.render('checkbox');
        layer.open({ type: 1, title: '定额工时 - ' + v.orderId, content: $('#printNormtimeCNBox'), area: ['460px', 'auto'],
            btn: ['打印(半包)', '打印(整包)', '取消'], btn1: function () { printNormtime(1); }, btn2: function () { printNormtime(2); } });
    });

    table.on('tool(resultTable)', function (obj) {
        var ev = obj.event, v = obj.data;
        for (var i = 0; i < BTNS.length; i++) {
            if (BTNS[i].ev === ev) { BTNS[i].handle(v); return; }
        }
    });

    // —— 工程信息查看/编辑 ——
    function viewConstructionInfo(orderId) {
        state.infoOrderId = orderId;
        app.post(api.construction.queryConstructionInfoByOrderId, { 'constructionInfo.orderId': orderId }, function (res) {
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
            layer.open({ type: 1, title: '工程信息 - ' + orderId, content: $('#constructionInfoBox'), area: ['520px', '90%'],
                btn: ['保存', '取消'], yes: function (idx) {
                    app.post(api.construction.updateConstructionInfoByOrderId, {
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
                    }, function () {
                        app.showAlert(app.success, '操作成功');
                        layer.close(idx);
                    });
                } });
        });
    }

    // —— 打印（quotation 模块打印页）——
    function printNormrice(type) {
        var subtype = 0;
        $('#printQuotationCNBox input[name="type"]:checked').each(function () { subtype += parseInt($(this).val(), 10); });
        app.params.quotation = $.extend({}, app.params.quotation, { type: type, subtype: subtype, workType: $('#constructionNode').val() });
        layer.closeAll();
        app.popup('views/quotation/normriceOutput.html', '打印报价', null, { area: ['85%', '90%'] });
    }
    function printNormtime(type) {
        var subtype = 0;
        $('#printNormtimeCNBox input[name="normtimeType"]:checked').each(function () { subtype += parseInt($(this).val(), 10); });
        app.params.quotation = $.extend({}, app.params.quotation, { type: type, subtype: subtype, workType: $('#normtimeConstructionNode').val() });
        layer.closeAll();
        app.popup('views/quotation/normtimeOutput.html', '打印定额工时', null, { area: ['85%', '90%'] });
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
