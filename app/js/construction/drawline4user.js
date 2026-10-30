/** app/js/construction/drawline4user.js —— 放线人员部署（监理 + 五阶段质检员 + 所属公司调整）
 *  质检阶段按施工节点名（水暖/电工/瓦工/木工/油工）动态匹配 sort（替代旧硬编码 7/8/9/11/12）。
 *  保存：updateConstructionByOrderId（construction.supervisor + qualiters[i] + conpany）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var E = constructionCommon.ENUM;
    var pageConfig = constructionCommon.getPageConfig('drawline4user');
    var state = { page: 1, rows: 10, total: 0, orderId: null };

    if (!pageConfig.apiPage) pageConfig.apiPage = api.construction.pageConstruction;
    function btnVisible(key) { return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.indexOf(key) != -1; }

    // 质检阶段 → 节点 sort（按节点名匹配）
    var qualiterNodeNames = { qualiter1: '水暖', qualiter2: '电工', qualiter3: '瓦工', qualiter4: '木工', qualiter5: '油工' };
    var qualiterSchedules = { qualiter1: 0, qualiter2: 0, qualiter3: 0, qualiter4: 0, qualiter5: 0 };
    app.post(api.data.queryConstructionNode, {}, function (res) {
        var nodeMap = {};
        $.each(res.constructionNodes || [], function (i, node) { nodeMap[node.name] = node.sort; });
        $.each(qualiterNodeNames, function (key, name) {
            if (nodeMap[name] !== undefined) qualiterSchedules[key] = nodeMap[name];
        });
    }, null, false);

    // 公司下拉（atttype=3）
    app.post(api.system.queryCompany, { 'company.atttype': '3' }, function (res) {
        var html = '<option value="">请选择公司</option>';
        $.each(res.companys || [], function (i, c) { html += '<option value="' + c.cid + '">' + c.name + '<\/option>'; });
        $('#conpany').html(html);
        form.render('select');
    }, null, false);

    // 监理下拉（工程部）+ 质检员下拉（全部）
    app.post(api.personel.queryUserByPinyin, { 'departmentType.name': '工程部', 'user.status': 0 }, function (res) {
        var html = '<option value="">请选择监理(工程部)</option>';
        $.each(res.autoFillKeyValue || [], function (i, u) { html += '<option value="' + u.key + '">' + u.value + '<\/option>'; });
        $('#supervisor').html(html);
        form.render('select');
    }, null, false);
    app.post(api.personel.queryUserByPinyin, { 'departmentType.name': '', 'user.status': 0 }, function (res) {
        var html = '<option value="">请选择人员</option>';
        $.each(res.autoFillKeyValue || [], function (i, u) { html += '<option value="' + u.key + '">' + u.value + '<\/option>'; });
        $('#qualiter1,#qualiter2,#qualiter3,#qualiter4,#qualiter5').html(html);
        form.render('select');
    }, null, false);

    function money(v) { return app.formatMoney(v); }
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'orderId', title: '装修单', width: 115, fixed: 'left' },
            { field: 'village', title: '楼盘', width: 110, templet: function (d) { return d.house && d.house.village ? d.house.village.name : ''; } },
            { field: 'houseNumber', title: '楼号', width: 80, templet: function (d) { return d.house ? d.house.houseNumber : ''; } },
            { field: 'customer', title: '客户', width: 80, templet: function (d) { return d.customer ? d.customer.name : ''; } },
            { field: 'designer', title: '设计师', width: 80, templet: function (d) { return d.designer ? d.designer.currentName : ''; } },
            { field: 'supervisor', title: '监理', width: 80, templet: function (d) { return d.supervisor ? d.supervisor.currentName : ''; } },
            { field: 'buildArea', title: '面积', width: 80, templet: function (d) { return d.house ? d.house.buildArea : ''; } },
            { field: 'orderTotalPrice', title: '合同额', width: 95, templet: function (d) { return money(d.orderTotalPrice); } },
            { field: 'version', title: '报价版本', width: 90, templet: function (d) { return d.version ? d.version.name : ''; } },
            { field: 'createTime', title: '创建时间', width: 150, templet: function (d) { return (d.createTime || '').substring(0, 16); } },
            { field: 'projectStatus', title: '进度', width: 90, templet: function (d) { return constructionCommon.badge({ 0: '初始', 1: '开工', 2: '完工' }, d.projectStatus); } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return constructionCommon.badge(E.decorationStatus, d.status); } },
            { title: '操作', width: 120, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'deploy' && btnVisible('deploy')) showSetup(obj.data);
    });

    function showSetup(v) {
        state.orderId = v.orderId;

        // 所属公司名
        var decoration = null;
        app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': v.orderId }, function (res) {
            decoration = res.decoration || {};
            app.post(api.system.queryCompanyByCid, { 'company.cid': decoration.conpany != null ? decoration.conpany : decoration.company }, function (rc) {
                $('#conpanyName').text(rc.company ? rc.company.name : '');
            }, null, false);
        }, null, false);

        // 监理回填
        app.post(api.construction.queryConstructionByOrderId, { 'construction.orderId': v.orderId }, function (res) {
            var supervisor = res.construction ? res.construction.supervisor : null;
            $('#supervisor').val(supervisor ? supervisor.userId : '');
            form.render('select');

            // 质检员回填（按 schedule 匹配阶段）
            ['qualiter1', 'qualiter2', 'qualiter3', 'qualiter4', 'qualiter5'].forEach(function (id) { $('#' + id).val(''); });
            app.post(api.construction.queryQualiter, { 'qualiter.decoration.orderId': res.construction.orderId }, function (e) {
                $.each(e.qualiters || [], function (i, q) {
                    if (!q.user) return;
                    $.each(qualiterSchedules, function (key, schedule) {
                        if (q.schedule == schedule && schedule != 0) { $('#' + key).val(q.user.userId); }
                    });
                });
                form.render('select');
            }, null, false);
        });

        $('#orderIdText').text(v.orderId);
        $('#conpany').val('');
        form.render('select');

        layer.open({ type: 1, title: '人员部署 - ' + v.orderId, content: $('#setupBox'), area: ['520px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                var options = {
                    'construction.orderId': state.orderId,
                    'construction.supervisor.userId': $('#supervisor').val(),
                    'qualiters[0].user.userId': $('#qualiter1').val(), 'qualiters[0].schedule': qualiterSchedules.qualiter1,
                    'qualiters[1].user.userId': $('#qualiter2').val(), 'qualiters[1].schedule': qualiterSchedules.qualiter2,
                    'qualiters[2].user.userId': $('#qualiter3').val(), 'qualiters[2].schedule': qualiterSchedules.qualiter3,
                    'qualiters[3].user.userId': $('#qualiter4').val(), 'qualiters[3].schedule': qualiterSchedules.qualiter4,
                    'qualiters[4].user.userId': $('#qualiter5').val(), 'qualiters[4].schedule': qualiterSchedules.qualiter5
                };
                if ($('#conpany').val()) options['construction.decoration.conpany'] = $('#conpany').val();
                app.post(api.construction.updateConstructionByOrderId, options, function () {
                    app.showAlert(app.success, '操作成功');
                    layer.close(idx); query(state.page);
                });
            } });
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(pageConfig.apiPage, $.extend({}, constructionCommon.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    query(1);
});
}); // end app.ready
