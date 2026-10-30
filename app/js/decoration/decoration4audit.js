/** app/js/decoration/decoration4audit.js —— 装修单审核（查看→详情向导 / 扣款→审核扣款记录 / 信息轴→进程 / 申请审核） */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, laydate = layui.laydate, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var E = decorationCommon.ENUM;
    var state = { page: 1, rows: 10, total: 0 };
    decorationCommon.dateRange('#auditTime');

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'decoration', title: '装修单号', width: 130, templet: function (d) { return (d.decoration && d.decoration.orderId) || '-'; } },
            { field: 'addr', title: '楼盘地址', minWidth: 180, templet: function (d) { var h = d.decoration.house || {}; return ((h.village && h.village.name) || '') + ' ' + (h.houseNumber || ''); } },
            { field: 'customer', title: '客户', width: 90, templet: function (d) { return (d.decoration.customer && d.decoration.customer.name) || ''; } },
            { field: 'designer', title: '设计师', width: 90, templet: function (d) { return (d.decoration.designer && d.decoration.designer.currentName) || ''; } },
            { field: 'dept', title: '设计部', width: 120, templet: function (d) { return (d.decoration.designer && d.decoration.designer.dept && d.decoration.designer.dept.name) || ''; } },
            { field: 'area', title: '面积', width: 90, templet: function (d) { return (d.decoration.house && d.decoration.house.buildArea) || ''; } },
            { field: 'measureTime', title: '量房时间', width: 110, templet: function (d) { return (d.decoration.measureTime || '').substring(0, 10); } },
            { field: 'contractTime', title: '签单时间', width: 110, templet: function (d) { return (d.decoration.contractTime || '').substring(0, 10); } },
            { field: 'type', title: '类型', width: 80, templet: function (d) { return E.typeness[d.decoration.typeness] || ''; } },
            { field: 'status', title: '状态', width: 90, templet: function (d) { return decorationCommon.badge(E.status, d.decoration.status); } },
            { field: 'auditFlag', title: '审核状态', width: 90, templet: function (d) { return d.auditer ? '<span class="layui-badge layui-bg-green">已审核<\/span>' : '<span class="layui-badge layui-bg-gray">未审批<\/span>'; } },
            { field: 'auditer', title: '审核人', width: 90, templet: function (d) { return (d.auditer && d.auditer.currentName) || ''; } },
            { field: 'auditTime', title: '审核时间', width: 110, templet: function (d) { return (d.auditTime || '').substring(0, 10); } },
            { title: '操作', width: 300, toolbar: '#rowToolbar' } ]] });

    table.on('tool(resultTable)', function (obj) {
        var ev = obj.event, v = obj.data;
        if (ev === 'view') goDetail(v);
        else if (ev === 'price') goAuditRecord(v);
        else if (ev === 'timeline') goTimeline(v);
        else if (ev === 'apply') applyAudit(v);
    });

    function query(pg) {
        state.page = pg || 1;
        var filters = decorationCommon.buildFilters($('#searchForm'));
        app.post(api.decoration.pageDecorationAudit, $.extend({}, filters, { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    // 查看 → 详情向导（审核视角节点集）
    function goDetail(v) {
        decorationCommon.passDetailCtx(v.decoration);
        app.params.decoration.viewNode = [
            { type: 'basic', opt: { btn: ['customerInfosBtn'] } },
            { type: 'quotation', opt: { btn: ['btnPrintDefaultQuotationInfo'] } },
            { type: 'picture', opt: { display: ['OriginalPicture', 'designPictures', 'projectPictures', 'contractMap', 'CADProjectPicture'], show: ['designPictureUpload', 'projectPictureUpload', 'CADUpload', 'ContractUpload', 'OriginalUpload'] } },
            { type: 'material' }, { type: 'activity' }, { type: 'payment' }, { type: 'belong' }, { type: 'addreduce' }
        ];
        app.params.historyPage = api.index.decorationAuditIndex.url;
        app.switchPage(api.index.decorationDetailIndex.url);
    }

    // 扣款 → 审核扣款记录
    function goAuditRecord(v) {
        app.params.decoration = $.extend({}, app.params.decoration, {
            orderId: v.decoration.orderId,
            designerId: v.decoration.designer ? v.decoration.designer.userId : '',
            deptId: v.decoration.designer && v.decoration.designer.dept ? v.decoration.designer.dept.no : '',
            auditStatusType: 'admin'
        });
        app.params.historyPage = api.index.decorationAuditIndex.url;
        app.switchPage(api.index.decorationAuditRecordIndex.url);
    }

    function goTimeline(v) {
        app.params.decoration = $.extend({}, app.params.decoration, { decorationOrderId: v.decoration.orderId });
        app.switchPage(api.index.decorationTimelineIndex.url);
    }

    function applyAudit(v) {
        app.showConfirm('确认审核吗?', function () {
            app.post(api.decoration.applyDecorationAudit, { 'audit.aid': v.aid }, function () {
                app.showAlert(app.success, '操作成功'); query(state.page);
            });
        });
    }

    $('#btnSearch').on('click', function () { query(1); });
    query(1);
});
}); // end app.ready
