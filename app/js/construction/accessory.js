/** app/js/construction/accessory.js —— 工程辅料（订单辅料额度管理）
 *  上下文：app.params.construction = { cid, orderId }。
 *  商品搜索（queryAoodsByName → aoodes 下拉替代旧 typeahead）；add/updateConstructionAccessory。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var E = constructionCommon.ENUM;
    var pageConfig = constructionCommon.getPageConfig('accessory');
    var ctx = app.params.construction || {};
    var state = { page: 1, rows: 10, total: 0, aid: null, caid: null, aoodes: [] };

    function btnVisible(key) { return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.indexOf(key) != -1; }

    // 商品搜索下拉（queryAoodsByName，返回 aoodes）
    function loadGoods() {
        app.post(api.data.queryAoodsByName, { 'orderId': ctx.orderId, 'aoods.goods.name': '' }, function (res) {
            state.aoodes = res.aoodes || [];
            var html = '<option value="">请输入商品名称</option>';
            $.each(state.aoodes, function (i, a) {
                html += '<option value="' + a.goods.gid + '">' + (a.goods.name || '') + '<\/option>';
            });
            $('#goodsName').html(html);
            form.render('select');
        }, null, false);
    }
    loadGoods();

    form.on('select(goodsName)', function (data) {
        var gid = data.value;
        state.aid = null;
        $.each(state.aoodes, function (i, a) {
            if (String(a.goods.gid) === String(gid)) {
                state.aid = a.aid;
                $('#goodsNo').val(a.goods.no || '');
                $('#category').val(a.goods.category || '');
                $('#brand').val(a.goods.brand || '');
                $('#measurementUnit').val(a.goods.measurementUnit || '');
            }
        });
    });

    function money(v) { return app.formatMoney(v); }
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'goodsName', title: '商品', width: 160, templet: function (d) { return d.aoods && d.aoods.goods ? d.aoods.goods.name : ''; } },
            { field: 'goodsNo', title: '商品编号', width: 120, templet: function (d) { return d.aoods && d.aoods.goods ? d.aoods.goods.no : ''; } },
            { field: 'category', title: '品类', width: 100, templet: function (d) { return d.aoods && d.aoods.goods ? d.aoods.goods.category : ''; } },
            { field: 'brand', title: '品牌', width: 100, templet: function (d) { return d.aoods && d.aoods.goods ? d.aoods.goods.brand : ''; } },
            { field: 'measurementUnit', title: '单位', width: 80, templet: function (d) { return d.aoods && d.aoods.goods ? d.aoods.goods.measurementUnit : ''; } },
            { field: 'accessoriesType', title: '辅类名称', width: 110, templet: function (d) { return d.aoods && d.aoods.accessoriesType ? d.aoods.accessoriesType.name : ''; } },
            { field: 'numLimit', title: '数量限制', width: 95, templet: function (d) { return d.numLimit != null ? d.numLimit : ''; } },
            { field: 'num', title: '数量', width: 80, templet: function (d) { return d.num != null ? d.num : ''; } },
            { field: 'total', title: '总额', width: 95, templet: function (d) { return money(d.total); } },
            { field: 'checkup', title: '验证标识', width: 90, templet: function (d) { return constructionCommon.badge(E.isCheckup, d.checkup); } },
            { title: '操作', width: 120, toolbar: '#rowToolbar' } ]] });

    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'update' && btnVisible('update')) {
            var v = obj.data;
            state.caid = v.caid;
            $('#checkup').val(v.checkup != null ? v.checkup : 0);
            $('#numLimit').val(v.numLimit != null ? v.numLimit : '');
            form.render('select');
            layer.open({ type: 1, title: '更新辅料额度', content: $('#updateBox'), area: ['440px', 'auto'],
                btn: ['保存', '取消'], yes: function (idx) {
                    app.post(api.construction.updateConstructionAccessory, {
                        'constructionAccessory.caid': state.caid,
                        'constructionAccessory.checkup': $('#checkup').val(),
                        'constructionAccessory.numLimit': $('#numLimit').val()
                    }, function () {
                        app.showAlert(app.success, '操作成功');
                        layer.close(idx); query(state.page);
                    });
                } });
        }
    });

    $('#btnAdd').on('click', function () {
        $('#addForm')[0].reset();
        $('#goodsName').val('');
        form.render('select');
        layer.open({ type: 1, title: '添加辅料', content: $('#addBox'), area: ['520px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                if (!state.aid) { app.showAlert(app.warning, '请选择商品'); return; }
                app.post(api.construction.addConstructionAccessory, {
                    'constructionAccessory.cid': ctx.cid,
                    'constructionAccessory.aoods.aid': state.aid,
                    'constructionAccessory.checkup': $('#addCheckup').val(),
                    'constructionAccessory.numLimit': $('#addNumLimit').val()
                }, function () {
                    app.showAlert(app.success, '操作成功');
                    layer.close(idx); query(state.page);
                });
            } });
    });

    function query(pg) {
        state.page = pg || 1;
        app.post(api.construction.pageConstructionAccessory, $.extend({ 'constructionAccessory.cid': ctx.cid, 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    query(1);
});
}); // end app.ready
