/** app/js/quotation/normtionPart.js —— 定额单编辑
 *  装载：queryQuotationForDefaultByOrderId（或上下文 quotation.qid）+ queryNormoodItem/queryNormriceItem/queryNormtimeItem（normtype=0 定额类）；
 *  添加：addNormoodItem（货品 nid）/addNormriceItem（施工节点+工费，附加项 normriceItem.sid 走模板）/addNormtimeItem（施工节点+工日）；
 *  删除：deleteNormoodItem/deleteNormriceItem/deleteNormtimeItem；附加项确认 confirmNormriceItem 拒绝 rejectNormriceItem；
 *  生成：makeNormtion（按报价/扩展/增减聚合）。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'element', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var E = quotationCommon.ENUM;
    var u = app.utils;
    var qctx = qc.ctx('quotation') || {};
    var orderId = qctx.orderId;
    var quotationId = qctx.quotation && qctx.quotation.qid ? qctx.quotation.qid : null;

    // 下拉数据
    app.post(api.data.queryConstructionNode, {}, function (res) {
        app.bindData($('#constructionNode'), res.constructionNodes || [], 'cnid', 'name', false);
        app.bindData($('#normtimeConstructionNode'), res.constructionNodes || [], 'cnid', 'name', false);
        form.render('select');
    }, null, false);

    if (!quotationId) {
        app.post(api.quotation.queryQuotationForDefaultByOrderId, { 'quotation.orderId': orderId }, function (res) {
            quotationId = res.quotation.qid;
            load();
        }, null, false);
    }

    function totals() {
        var moodTotal = 0, mriceTotal = 0, mtimeTotal = 0;
        app.post(api.quotation.queryNormoodItem, { 'normoodItem.qid': quotationId }, function (res) {
            $.each(res.normoodItems || [], function (i, v) {
                if (v.normtype == 0) moodTotal = u.accAdd(moodTotal, u.accMul(v.normnum, v.atttype == 0 ? 1 : -1));
            });
            $('#moodTotal').text(qc.money(moodTotal));
        }, null, false);
        app.post(api.quotation.queryNormriceItem, { 'normriceItem.qid': quotationId }, function (res) {
            $.each(res.normriceItems || [], function (i, v) {
                if (v.normtype == 0) mriceTotal = u.accAdd(mriceTotal, u.changeThrDecimal(u.accMul(u.accMul(v.num, v.salary), v.atttype == 0 ? 1 : -1)));
            });
            $('#mriceTotal').text(qc.money(mriceTotal));
        }, null, false);
        app.post(api.quotation.queryNormtimeItem, { 'normtimeItem.qid': quotationId }, function (res) {
            $.each(res.normtimeItems || [], function (i, v) {
                if (v.normtype == 0) {
                    var num = parseFloat(v.trannum == 0 || v.trannum == '0' ? 1 : v.num);
                    var trannum = parseFloat(v.trannum == 0 || v.trannum == '0' ? 1 : v.trannum);
                    mtimeTotal = u.accAdd(mtimeTotal, u.changeThrDecimal(u.accMul(u.accMul(trannum, u.accMul(num, v.workdays)), v.atttype == 0 ? 1 : -1)));
                }
            });
            $('#mtimeTotal').text(qc.money(mtimeTotal));
        }, null, false);
    }

    function load() {
        app.post(api.quotation.queryNormoodItem, { 'normoodItem.qid': quotationId }, function (res) {
            var list = [], items = res.normoodItems || [];
            $.each(items, function (i, v) { if (v.normtype == 0) list.push(v); });
            table.reload('tableNormood', { data: list });
        });
        app.post(api.quotation.queryNormriceItem, { 'normriceItem.qid': quotationId }, function (res) {
            var list = [], adds = [], items = res.normriceItems || [];
            $.each(items, function (i, v) {
                if (v.normtype == 0) list.push(v);
                if (v.normtype == 1) adds.push(v);
            });
            table.reload('tableNormrice', { data: list });
            table.reload('tableNormadd', { data: adds });
        });
        app.post(api.quotation.queryNormtimeItem, { 'normtimeItem.qid': quotationId }, function (res) {
            var list = [], items = res.normtimeItems || [];
            $.each(items, function (i, v) { if (v.normtype == 0) list.push(v); });
            table.reload('tableNormtime', { data: list });
        });
        if (orderId) $('#orderIdLabel').text(' - ' + orderId);
        totals();
    }

    table.render({ elem: '#tableNormood', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'noods', title: '商品名称', width: 200, templet: function (d) { return d.noods ? d.noods.name : ''; } },
            { field: 'normnum', title: '定额数量', width: 100, templet: function (d) { return qc.money(d.normnum); } },
            { field: 'normunit', title: '定额单位', width: 90 },
            { field: 'storenum', title: '库房数量', width: 100, templet: function (d) { return qc.money(d.storenum); } },
            { field: 'storeunit', title: '库房单位', width: 90 },
            { field: 'atttype', title: '类型', width: 80, templet: function (d) { return E.normoodItemAtttype[d.atttype] != null ? E.normoodItemAtttype[d.atttype] : d.atttype; } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return qc.badge({ 0: '启用', 1: '禁用' }, d.status); } },
            { title: '操作', width: 90, toolbar: '#rowToolbar' } ]] });
    var riceCols = function (isAdd) {
        return [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'constructionNode', title: '施工节点', width: 120, templet: function (d) { return d.constructionNode ? d.constructionNode.name : ''; } },
            { field: 'name', title: '名称', width: 170 },
            { field: 'num', title: '数量', width: 80, templet: function (d) { return qc.money(d.num); } },
            { field: 'trannum', title: '转换量', width: 80, templet: function (d) { return qc.money(d.trannum); } },
            { field: 'salary', title: '工费', width: 90, templet: function (d) { return qc.money(d.salary); } },
            { field: 'total', title: '总额', width: 100, templet: function (d) { return qc.money(u.changeThrDecimal(u.accMul(u.accMul(d.num, d.salary), d.atttype == 0 ? 1 : -1))); } },
            { field: 'atttype', title: '类型', width: 80, templet: function (d) { return E.normriceItemAtttype[d.atttype] != null ? E.normriceItemAtttype[d.atttype] : d.atttype; } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return qc.badge(E.normriceItemStatus, d.status); } },
            { title: '操作', width: isAdd ? 220 : 90, toolbar: isAdd ? '#riceToolbar' : '#rowToolbar' } ]];
    };
    table.render({ elem: '#tableNormrice', data: [], page: false, limit: 1000, even: true, cols: riceCols(false) });
    table.render({ elem: '#tableNormadd', data: [], page: false, limit: 1000, even: true, cols: riceCols(true) });
    table.render({ elem: '#tableNormtime', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'constructionNode', title: '施工节点', width: 120, templet: function (d) { return d.constructionNode ? d.constructionNode.name : ''; } },
            { field: 'name', title: '名称', width: 170 },
            { field: 'num', title: '数量', width: 80, templet: function (d) { return qc.money(d.num); } },
            { field: 'trannum', title: '转换量', width: 80, templet: function (d) { return qc.money(d.trannum); } },
            { field: 'workdays', title: '工日', width: 80, templet: function (d) { return qc.money(d.workdays); } },
            { field: 'total', title: '总额(工时)', width: 100, templet: function (d) { var num = parseFloat(d.trannum == 0 ? 1 : d.num); var trannum = parseFloat(d.trannum == 0 ? 1 : d.trannum); return qc.money(u.changeThrDecimal(u.accMul(u.accMul(trannum, u.accMul(num, d.workdays)), d.atttype == 0 ? 1 : -1))); } },
            { field: 'atttype', title: '类型', width: 80, templet: function (d) { return E.normriceItemAtttype[d.atttype] != null ? E.normriceItemAtttype[d.atttype] : d.atttype; } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return qc.badge({ 0: '启用', 1: '禁用' }, d.status); } },
            { title: '操作', width: 90, toolbar: '#rowToolbar' } ]] });

    if (quotationId) load();

    // —— 行操作 ——
    table.on('tool(tableNormood)', function (obj) {
        if (obj.event === 'del') {
            app.post(api.quotation.deleteNormoodItem, { 'normoodItem.noid': obj.data.noid }, function () { load(); });
        }
    });
    table.on('tool(tableNormrice)', function (obj) {
        if (obj.event === 'del') {
            app.post(api.quotation.deleteNormriceItem, { 'normriceItem.nrid': obj.data.nrid }, function () { load(); });
        }
    });
    table.on('tool(tableNormadd)', function (obj) {
        var v = obj.data;
        if (obj.event === 'confirm') {
            app.post(api.quotation.confirmNormriceItem, { 'normriceItem.nrid': v.nrid }, function () { load(); });
        } else if (obj.event === 'reject') {
            app.post(api.quotation.rejectNormriceItem, { 'normriceItem.nrid': v.nrid }, function () { load(); });
        } else if (obj.event === 'del') {
            app.post(api.quotation.deleteNormriceItem, { 'normriceItem.nrid': v.nrid }, function () { load(); });
        }
    });
    table.on('tool(tableNormtime)', function (obj) {
        if (obj.event === 'del') {
            app.post(api.quotation.deleteNormtimeItem, { 'normtimeItem.ntid': obj.data.ntid }, function () { load(); });
        }
    });

    // —— 添加 ——
    $('#btnAddNormood').on('click', function () {
        $('#normoodBox form')[0].reset();
        layer.open({ type: 1, title: '添加材料定额项', content: $('#normoodBox'), area: ['460px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                if ($('#noodsName').val() === '') { app.showAlert(app.warning, '请填写货品编号'); return; }
                app.post(api.quotation.addNormoodItem, {
                    'quotation.qid': quotationId,
                    'normoodItems[0].noods.nid': $('#noodsName').val(),
                    'normoodItems[0].normunit': $('#unit').val(),
                    'normoodItems[0].normnum': $('#normoNum').val(),
                    'normoodItems[0].storeunit': $('#unit').val(),
                    'normoodItems[0].storenum': $('#normoNum').val()
                }, function () {
                    layer.close(idx); load();
                });
            } });
    });
    $('#btnAddNormrice').on('click', function () {
        $('#normriceBox form')[0].reset();
        form.render('select');
        layer.open({ type: 1, title: '添加工费定额项', content: $('#normriceBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                app.post(api.quotation.addNormriceItem, {
                    'normtion.qid': quotationId,
                    'normriceItem.constructionNode.cnid': $('#constructionNode').val(),
                    'normriceItem.name': $('#normrName').val(),
                    'normriceItem.num': 1,
                    'normriceItem.trannum': 1,
                    'normriceItem.salary': $('#salary').val()
                }, function () {
                    layer.close(idx); load();
                });
            } });
    });
    $('#btnAddNormtime').on('click', function () {
        $('#normtimeBox form')[0].reset();
        form.render('select');
        layer.open({ type: 1, title: '添加工时定额项', content: $('#normtimeBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                app.post(api.quotation.addNormtimeItem, {
                    'normtion.qid': quotationId,
                    'normtimeItem.constructionNode.cnid': $('#normtimeConstructionNode').val(),
                    'normtimeItem.name': $('#normtName').val(),
                    'normtimeItem.num': 1,
                    'normtimeItem.trannum': 1,
                    'normtimeItem.workdays': $('#workdays').val()
                }, function () {
                    layer.close(idx); load();
                });
            } });
    });

    // —— 生成定额 ——
    $('#btnMake').on('click', function () {
        app.showConfirm('生成定额将按当前报价/扩展项/增减项重新聚合定额数据, 确认执行?', function () {
            app.post(api.quotation.makeNormtion, {
                'normtion.qid': quotationId,
                'normtion.orderId': orderId,
                'normtion.moodPrintNum': 0,
                'normtion.moodTotal': 0,
                'normtion.mricePriceNum': 0,
                'normtion.mriceTotal': 0
            }, function () {
                app.showAlert(app.success, '定额生成成功');
                load();
            });
        });
    });

    $('#btnBack').on('click', function () {
        app.showConfirm('当前页面存在重要数据,是否进行当前操作', function () {
            app.switchPage(app.params.historyPage || api.index.normIndex.url);
        });
    });
});
}); // end app.ready
