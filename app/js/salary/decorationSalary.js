/** app/js/salary/decorationSalary.js —— 装修薪资（列表查询）
 *  对齐旧 WebContent/js/salary/decorationSalary.js。
 *  pagetype=belong 时按当前登录用户过滤，隐藏归属人列。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, belong: false };

    var TYPE_MAP = { 0: '提成', 1: '扣款' };
    var ATTTYPE_MAP = { 0: '设计', 1: '业务', 2: '经理' };
    var STAGE_MAP = { 0: '全部', 1: '首提', 2: '中提', 3: '尾提' };
    var STATUS_MAP = { 0: '初始', 1: '通过', 2: '驳回', 3: '撤销' };
    var TYPENESS_MAP = { 0: '半包', 1: '全包', 2: '大包', 3: '清单', 4: '半包(主材)', 5: '半包(辅料)' };
    var belongUserId = (app.params.userInfo && app.params.userInfo.user) ? app.params.userInfo.user.userId : '';

    laydate.render({ elem: '#createTime', range: '~' });

    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'orderId', title: '装修单号', width: 120, templet: function (d) { return d.decoration ? (d.decoration.orderId || '') : ''; } },
                { field: 'village', title: '楼盘', width: 110, templet: function (d) { return (d.decoration && d.decoration.house && d.decoration.house.village) ? (d.decoration.house.village.name || '') : ''; } },
                { field: 'houseNumber', title: '楼号', width: 100, templet: function (d) { return (d.decoration && d.decoration.house) ? (d.decoration.house.houseNumber || '') : ''; } },
                { field: 'typeness', title: '类型', width: 90, templet: function (d) { return (d.decoration && d.decoration.typeness != null) ? (TYPENESS_MAP[d.decoration.typeness] || '---') : '---'; } },
                { field: 'status', title: '装修状态', width: 100, templet: function (d) { return (d.decoration && d.decoration.status != null) ? (STATUS_MAP[d.decoration.status] || '---') : '---'; } },
                { field: 'orderTotalPrice', title: '签单额', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.decoration ? d.decoration.orderTotalPrice : 0); } },
                { field: 'factPrice', title: '实收额', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.decoration ? d.decoration.factPrice : 0); } },
                { field: 'couponCut', title: '券优惠', width: 100, align: 'right', templet: function (d) { return app.formatMoney(d.decoration ? d.decoration.couponCut : 0); } },
                { field: 'thingCut', title: '物品优惠', width: 100, align: 'right', templet: function (d) { return app.formatMoney(d.decoration ? d.decoration.thingCut : 0); } },
                { field: 'belonger', title: '归属人', width: 110, hide: state.belong, templet: function (d) { return d.belonger ? (d.belonger.userName || '') : ''; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'period', title: '账期', width: 100 },
                { field: 'money', title: '金额', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.money); } },
                { field: 'rate', title: '比例', width: 90 },
                { field: 'type', title: '类型', width: 90, templet: function (d) { return TYPE_MAP[d.type] || '---'; } },
                { field: 'atttype', title: '业务类型', width: 100, templet: function (d) { return ATTTYPE_MAP[d.atttype] || '---'; } },
                { field: 'stage', title: '阶段', width: 90, templet: function (d) { return STAGE_MAP[d.stage] || '---'; } },
                { field: 'level', title: '等级', width: 90 },
                { field: 'dsStatus', title: '状态', width: 90, templet: function (d) { return '<span class="layui-badge layui-bg-gray">' + (STATUS_MAP[d.status] || '---') + '<\/span>'; } },
                { field: 'comment', title: '备注', minWidth: 140 } ]] });
    }

    function buildFilters() {
        var p = {}, c = 0;
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
        var opt = $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows });
        if (state.belong && belongUserId) opt['decorationSalary.belonger.userId'] = belongUserId;
        app.post(api.salary.pageDecorationSalary, opt, function (res) {
            var pg = res.paging || {};
            table.reload('resultTable', { data: pg.data || [] });
            state.total = pg.totalRecords || 0;
            renderPage();
        });
    }
    function renderPage() {
        laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
});
}); // end app.ready
