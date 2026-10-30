/** app/js/report/decoration7achievement.js —— 装修业绩报表（分区/类型 分组，含手动更新）
 * cs2 工程合同额 / cs3 工程净业绩(部分) / cs4 设计费 / cs5 服务费 均为金额（已由 tranargs ÷1000 转元）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'laydate', 'layer', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, laydate = layui.laydate, layer = layui.layer, form = layui.form, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, updIndex: null };
    var TYPE_MAP = {};

    laydate.render({ elem: '#year', type: 'year', format: 'yyyy' });
    laydate.render({ elem: '#month', type: 'month', format: 'yyyy-MM' });
    laydate.render({ elem: '#updYear', type: 'year', format: 'yyyy' });
    laydate.render({ elem: '#updMonth', type: 'month', format: 'yyyy-MM' });

    // 类型下拉（装修属性 typeness）
    app.post(api.data.queryDecorationAtttype, {}, function (res) {
        var list = res.decorationAtttypes || [], html = '<option value="">全部</option>';
        for (var i = 0; i < list.length; i++) {
            var it = list[i]; TYPE_MAP[it.key] = it.name;
            html += '<option value="' + it.key + '">' + it.name + '</option>';
        }
        $('#searchForm [name="typeness"]').html(html); form.render('select');
    });

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '序号', width: 60, fixed: 'left' },
            { field: 'department', title: '分区编号', width: 110, fixed: 'left', templet: function (d) { return (d.department && d.department.no) || '-'; } },
            { field: 'department', title: '分区', width: 120, fixed: 'left', templet: function (d) { return (d.department && d.department.name) || '-'; } },
            { field: 'date', title: '日期', width: 150, templet: function (d) { return d.year + '年' + d.month + '月业绩'; } },
            { field: 'typeness', title: '类型', width: 100, templet: function (d) { return TYPE_MAP[d.typeness] != null ? TYPE_MAP[d.typeness] : (d.typeness != null ? d.typeness : '-'); } },
            { field: 'cs0', title: '签单户数', width: 100 },
            { field: 'cs1', title: '设计户数', width: 100 },
            { field: 'cs2', title: '工程合同额', width: 120, templet: function (d) { return app.formatMoney(d.cs2); } },
            { field: 'cs3', title: '工程净业绩', width: 120, templet: function (d) { return app.formatMoney((d.cs3 || 0) + (d.cs4 || 0)); } },
            { field: 'cs4', title: '设计费', width: 110, templet: function (d) { return app.formatMoney(d.cs4); } },
            { field: 'cs5', title: '服务费', width: 110, templet: function (d) { return app.formatMoney(d.cs5); } },
            { field: 'total', title: '工程总净业绩', width: 130, templet: function (d) { return app.formatMoney((d.cs3 || 0) + (d.cs4 || 0) + (d.cs5 || 0)); } }
        ]]
    });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnUpdate').on('click', openUpdate);
    $('#btnUpdateCancel').on('click', function () { layer.close(state.updIndex); });
    $('#btnUpdateConfirm').on('click', saveUpdate);

    function bF() {
        var p = {}, c = 0;
        $('#searchForm [name]').each(function () {
            var v = $.trim($(this).val()); if (!v) return; var n = $(this).attr('name');
            p['filters[' + c + '].field'] = n; p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = 'eq'; c++;
        });
        return p;
    }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.report.queryDecoration7Achievement, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() {
        laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } });
    }

    function openUpdate() {
        app.clearValidator();
        $('#updateForm')[0].reset();
        state.updIndex = layer.open({ type: 1, title: '更新装修业绩', content: $('#updateBox'), area: ['420px', 'auto'] });
    }
    function saveUpdate() {
        if (app.validate('updateForm')) return;
        var y = $.trim($('#updYear').val()), m = $.trim($('#updMonth').val());
        app.post(api.report.updateDecoration7Achievement, { 'decorationAchievement.year': y, 'decorationAchievement.month': m }, function () {
            app.showAlert(app.info, '更新成功'); layer.close(state.updIndex); query(state.page);
        });
    }

    query(1);
});
});
