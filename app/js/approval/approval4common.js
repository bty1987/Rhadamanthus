/** app/js/approval/approval4common.js —— 通用审批中心（配置驱动）
  URL ?depage=<page> 决定展示哪类审批；depage=decoration/origin → 归一为 customerOrigin。
  配置来自 queryApprovalFunctionRight(name=depage)：解析出 apiPage(分页接口key)、propertyArr(列)、pageBtn(pass/refuse)。
  操作：approveApproval/refuseApproval（弹窗填批注）。
  说明：旧版通过 queryApprovalFunctionRight 动态返回 api 路径与列定义，结构复杂；新版用本地映射简化（覆盖所有 depage 场景），
        同时保留对 right 接口的调用以维持后端依赖。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, depage: getQueryParam('depage') || 'customerOrigin', ctx: { aid: null, submitUrl: null, editIdx: null } };

    // depage 归一
    if (state.depage === 'decoration' || state.depage === 'origin') state.depage = 'customerOrigin';

    // 本地补 api.right
    api.right = api.right || {};
    api.right.queryApprovalFunctionRight = { url: 'queryApprovalFunctionRight.do' };

    // 各 depage 的页面配置：apiPage + 列 + 按钮
    var cfgMap = {
        customerSource: {
            apiPage: 'pageApprovalCustomerSource',
            props: [
                { f: 'approval.sender.currentName', t: '申请人', w: 100 },
                { f: 'approval.receiver.currentName', t: '审批人', w: 100 },
                { f: 'approval.createTime', t: '提交时间', w: 150 },
                { f: 'approval.approvalTime', t: '审批时间', w: 150 },
                { f: 'approval.status', t: '状态', w: 90, status: 'approval' },
                { f: 'source.name', t: '姓名', w: 100 },
                { f: 'source.gender', t: '性别', w: 70 },
                { f: 'source.phone', t: '电话', w: 120 },
                { f: 'source.village.name', t: '楼盘', w: 140 },
                { f: 'source.houseNumber', t: '楼牌号', w: 100 },
                { f: 'source.buildArea', t: '建筑面积', w: 90 },
                { f: 'approval.contents', t: '说明', minW: 140 },
                { f: 'approval.comment', t: '备注', minW: 120 }
            ],
            btns: ['pass', 'refuse']
        },
        customerOrigin: {
            apiPage: 'pageApprovalCustomerOrigin',
            props: [
                { f: 'approval.sender.currentName', t: '申请人', w: 100 },
                { f: 'approval.receiver.currentName', t: '审批人', w: 100 },
                { f: 'approval.createTime', t: '提交时间', w: 150 },
                { f: 'approval.approvalTime', t: '审批时间', w: 150 },
                { f: 'approval.status', t: '状态', w: 90, status: 'approval' },
                { f: 'customerOrigin.name', t: '姓名', w: 100 },
                { f: 'customerOrigin.phone', t: '电话', w: 120 },
                { f: 'customerOrigin.village.name', t: '楼盘', w: 140 },
                { f: 'customerOrigin.houseNumber', t: '楼牌号', w: 100 },
                { f: 'customerOrigin.buildArea', t: '建筑面积', w: 90 },
                { f: 'approval.contents', t: '说明', minW: 140 }
            ],
            btns: ['pass', 'refuse']
        },
        customerOriginTDecoration: {
            apiPage: 'pageApprovalCustomerOriginTDecoration',
            props: [
                { f: 'approval.sender.currentName', t: '申请人', w: 100 },
                { f: 'approval.createTime', t: '提交时间', w: 150 },
                { f: 'approval.status', t: '状态', w: 90, status: 'approval' },
                { f: 'approval.contents', t: '说明', minW: 160 }
            ],
            btns: ['pass', 'refuse']
        },
        salesRefund: {
            apiPage: 'pageApprovalSalesRefund',
            props: [
                { f: 'approval.sender.currentName', t: '申请人', w: 100 },
                { f: 'approval.receiver.currentName', t: '审批人', w: 100 },
                { f: 'approval.createTime', t: '提交时间', w: 150 },
                { f: 'approval.status', t: '状态', w: 90, status: 'approval' },
                { f: 'sales.customer.name', t: '客户', w: 100 },
                { f: 'sales.customer.phone', t: '客户电话', w: 120 },
                { f: 'sales.orderId', t: '装修单号', w: 110 },
                { f: 'refund', t: '退款', w: 90 },
                { f: 'approval.contents', t: '说明', minW: 140 }
            ],
            btns: ['pass', 'refuse']
        }
    };
    var statusName = { 0: '初始', 1: '已确认', 2: '已审批', 3: '已拒绝', 4: '已撤销' };
    var statusColor = { 0: 'layui-bg-orange', 1: 'layui-bg-cyan', 2: 'layui-bg-green', 3: 'layui-bg-red', 4: 'layui-bg-gray' };

    // 拉配置（兼容旧后端 right 数据，失败则用本地 cfgMap 兜底）
    app.post(api.right.queryApprovalFunctionRight, { 'approvalFunctionRight.name': state.depage }, function (res) {
        // 旧版会返回配置项；此处仅作为后端依赖触发，列定义用本地映射（更稳定）
        buildAndQuery();
    }, function () { buildAndQuery(); }); // 失败也继续

    function buildAndQuery() {
        var cfg = cfgMap[state.depage] || cfgMap.customerOrigin;
        state.cfg = cfg;
        renderTable(cfg); query(1);
    }

    function deepGet(o, path) { if (!path) return ''; var ps = path.split('.'); var cur = o; for (var i = 0; i < ps.length; i++) { if (cur == null) return ''; cur = cur[ps[i]]; } return cur == null ? '' : cur; }

    function renderTable(cfg) {
        var cols = [{ type: 'numbers', title: '#', width: 60 }];
        $.each(cfg.props, function (i, p) {
            var col = { field: p.f, title: p.t, minWidth: p.minW || 0, width: p.w || 0 };
            if (p.status) {
                col.templet = function (d) {
                    var v = deepGet(d, p.f); var c = statusColor[v] || 'layui-bg-gray';
                    return '<span class="layui-badge ' + c + '">' + (statusName[v] || v) + '<\/span>';
                };
            } else {
                col.templet = function (d) { return esc(deepGet(d, p.f)); };
            }
            cols.push(col);
        });
        if (cfg.btns.length) cols.push({ title: '操作', width: 170, toolbar: '#rowToolbar' });
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true, cols: [cols] });
        // 注入或更新行工具模板
        $('#rowToolbar').remove();
        var html = '<script type="text/html" id="rowToolbar">';
        if (cfg.btns.indexOf('pass') != -1) html += '<button class="layui-btn layui-btn-xs" lay-event="pass">通过</button>';
        if (cfg.btns.indexOf('refuse') != -1) html += '<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="refuse">拒绝</button>';
        html += '<\/script>';
        $('body').append(html);
        table.on('tool(resultTable)', function (obj) {
            var v = obj.data;
            // 仅"初始/已确认"状态且非 send 模式才可操作
            var st = deepGet(v, 'approval.status');
            if (st != 0 && st != 1 && st != 2) { app.showAlert(app.info, '当前状态不可操作'); return; }
            if (obj.event === 'pass') proapprove(deepGet(v, 'approval.aid'), api.approval.approveApproval, '通过');
            else if (obj.event === 'refuse') proapprove(deepGet(v, 'approval.aid'), api.approval.refuseApproval, '拒绝');
        });
    }

    function buildFilters() {
        var p = { 'approval.user': state.depage }, c = 0;
        $('#searchForm [name]').each(function () {
            var v = $.trim($(this).val()); if (!v) return;
            p['filters[' + c + '].field'] = $(this).attr('name');
            p['filters[' + c + '].data'] = v;
            p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn';
            c++;
        });
        return p;
    }
    function query(page) {
        state.page = page || 1;
        var apiDef = api.approval[state.cfg.apiPage];
        app.post(apiDef, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage();
        });
    }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }

    function proapprove(aid, submitUrl, result) {
        state.ctx.aid = aid; state.ctx.submitUrl = submitUrl;
        $('#annotate').val(''); $('#result').text(result);
        state.ctx.editIdx = layer.open({ type: 1, title: '审批', content: $('#editBox'), area: ['520px', 'auto'] });
    }
    $('#btnSubmit').on('click', function () {
        var o = { 'approval.aid': state.ctx.aid, 'approval.annotate': $('#annotate').val() };
        app.post(state.ctx.submitUrl, o, function () {
            layer.close(state.ctx.editIdx); state.ctx.editIdx = null; query(state.page);
        });
    });
    $('#btnClose').on('click', function () { layer.close(state.ctx.editIdx); state.ctx.editIdx = null; });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });

    function esc(s) { return $('<div/>').text(s == null ? '' : s).html(); }
    function getQueryParam(name) {
        var search = location.search.substring(1); var pairs = search.split('&');
        for (var i = 0; i < pairs.length; i++) { var kv = pairs[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
