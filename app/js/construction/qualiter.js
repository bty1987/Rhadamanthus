/** app/js/construction/qualiter.js —— 质检工程列表（按当前用户过滤 user.userId）
 *  pageConfig：name='qualiter'。行按钮：信息/施工节点。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var E = constructionCommon.ENUM;
    var pageConfig = constructionCommon.getPageConfig('qualiter');
    var state = { page: 1, rows: 10, total: 0, infoOrderId: null };
    if (!pageConfig.apiPage) pageConfig.apiPage = api.construction.pageConstructionForQualiter;

    function btnVisible(key) { return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.indexOf(key) != -1; }

    ['finishTime', 'keyTime', 'drawlineTime', 'designTime'].forEach(function (id) {
        laydate.render({ elem: '#' + id, format: 'yyyy-MM-dd' });
    });

    function money(v) { return app.formatMoney(v); }
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'orderId', title: '装修单', width: 115, fixed: 'left' },
            { field: 'village', title: '楼盘', width: 110, templet: function (d) { return d.house && d.house.village ? d.house.village.name : ''; } },
            { field: 'houseNumber', title: '楼号', width: 80, templet: function (d) { return d.house ? d.house.houseNumber : ''; } },
            { field: 'customer', title: '客户', width: 80, templet: function (d) { return d.customer ? d.customer.name : ''; } },
            { field: 'designer', title: '设计师', width: 80, templet: function (d) { return d.designer ? d.designer.currentName : ''; } },
            { field: 'user', title: '施工人员', width: 90, templet: function (d) { return d.user ? d.user.currentName : ''; } },
            { field: 'orderTotalPrice', title: '总价', width: 95, templet: function (d) { return money(d.orderTotalPrice); } },
            { field: 'version', title: '报价版本', width: 90, templet: function (d) { return d.version ? d.version.name : ''; } },
            { field: 'buildArea', title: '面积', width: 80, templet: function (d) { return d.house ? d.house.buildArea : ''; } },
            { field: 'projectStatus', title: '进度', width: 90, templet: function (d) { return constructionCommon.badge({ 0: '初始', 1: '开工', 2: '完工' }, d.projectStatus); } },
            { field: 'creater', title: '创建人', width: 85, templet: function (d) { return d.creater ? d.creater.currentName : ''; } },
            { field: 'createTime', title: '创建时间', width: 150, templet: function (d) { return (d.createTime || '').substring(0, 16); } },
            { field: 'status', title: '状态', width: 85, templet: function (d) { return constructionCommon.badge(E.qualiterStatus, d.status); } },
            { title: '操作', width: 200, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    var BTNS = [];
    function reg(ev, name, show, handle) { BTNS.push({ ev: ev, name: name, show: show, handle: handle }); }

    reg('info', '信息', function () { return btnVisible('info'); }, function (v) { viewConstructionInfo(v.orderId); });
    reg('view', '施工节点', function () { return btnVisible('view'); }, function (v) {
        app.params.construction = $.extend({}, app.params.construction, { orderId: v.orderId, cid: v.cid });
        app.popup('views/construction/supervision4detail.html', '查看', null, { area: ['95%', '90%'] });
    });

    table.on('tool(resultTable)', function (obj) {
        var ev = obj.event, v = obj.data;
        for (var i = 0; i < BTNS.length; i++) {
            if (BTNS[i].ev === ev) { BTNS[i].handle(v); return; }
        }
    });

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

    function query(pg) {
        state.page = pg || 1;
        app.post(pageConfig.apiPage, $.extend({}, constructionCommon.buildFilters($('#searchForm')), {
            'user.userId': app.params.userInfo && app.params.userInfo.user ? app.params.userInfo.user.userId : '',
            'paging.page': state.page, 'paging.rows': state.rows
        }), function (res) {
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
