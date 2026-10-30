/** app/js/customer/complain.js —— 投诉（旧 complain.js → layui）
 *  列表：pageComplain（装修单号/状态/等级检索）。
 *  行操作：投诉内容（弹 complaint 页，params.customer.aid=cid）；完结 finishComplain（status==1）；
 *  关闭 closeComplain（status==2）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var state = { page: 1, rows: 10, total: 0 };

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'decoration', title: '装修单号', width: 130, templet: function (d) { return d.decoration ? (d.decoration.orderId || '') : ''; } },
            { field: 'creater', title: '创建人', width: 110, templet: function (d) { return d.creater ? (d.creater.currentName || '') : ''; } },
            { field: 'updater', title: '操作人', width: 110, templet: function (d) { return d.updater ? (d.updater.currentName || '') : ''; } },
            { field: 'createTime', title: '创建时间', width: 170 },
            { field: 'updateTime', title: '操作时间', width: 170 },
            { field: 'finishTime', title: '完成时间', width: 170 },
            { field: 'level', title: '等级', width: 80, templet: function (d) { return E.complainType[d.level] != null ? E.complainType[d.level] : ''; } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return customerCommon.badge(E.complainStatus, d.status); } },
            { field: 'gladness', title: '满意度', width: 90, templet: function (d) { return E.complainGrade[d.gladness] != null ? E.complainGrade[d.gladness] : ''; } },
            { title: '操作', width: 190, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'complaint') {
            app.params.customer = $.extend({}, app.params.customer, { aid: v.cid });
            app.popup(api.index.complaintIndex.url, '投诉内容');
        } else if (obj.event === 'finish') {
            app.post(api.customer.finishComplain, { 'complain.cid': v.cid }, function () {
                app.showAlert(app.success, '操作成功');
                query(state.page);
            });
        } else if (obj.event === 'close') {
            app.post(api.customer.closeComplain, { 'complain.cid': v.cid }, function () {
                app.showAlert(app.success, '操作成功');
                query(state.page);
            });
        }
    });
    if (!$('#rowToolbar').length) {
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="complaint">投诉内容</button>'
            + '{{# if(d.status == 1){ }}<button class="layui-btn layui-btn-xs" lay-event="finish">完结</button>{{# } }}'
            + '{{# if(d.status == 2){ }}<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="close">关闭</button>{{# } }}'
            + '<\/script>'
        );
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(api.customer.pageComplain, $.extend({}, customerCommon.buildFilters($('#searchForm')), {
            'paging.page': state.page,
            'paging.rows': state.rows
        }), function (res) {
            var p = res.paging || { data: [], totalRecords: 0, totalPage: 0 };
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            laypage.render({
                elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30],
                layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); }
            });
        });
    }
    query(1);

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
});
}); // end app.ready
