/** app/js/quotation/extensionIndex.js —— 扩展项列表
 *  订单模式：queryExtensionByOrderId（orderId + atttype=-1）+ 报价/装修单头信息；创建 addExtension；
 *  页面模式（?type=page&depage=）：queryQuotationFunctionRight(page,3) 配置驱动。
 *  行操作：定额 makeNormtionForExtension、查看（extensionPart）、删除 deleteExtension。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var E = quotationCommon.ENUM;
    var qctx = qc.ctx('quotation') || {};
    var urlLoad = qc.ctx('urlLoadParams') || {};
    var orderId = qctx.orderId;
    var pageType = urlLoad.type;
    var qid = null;
    var pageConfig = null;
    var state = { page: 1, rows: 10, total: 0 };

    if (pageType != 'page') {
        app.post(api.quotation.queryQuotationForDefaultByOrderId, { 'quotation.orderId': orderId }, function (res) {
            qid = res.quotation.qid;
            $('#quoDiscount').text(res.quotation.discount);
            $('#quoManage').text(qc.money(res.quotation.managePrice));
            $('#quoTax').text(qc.money(res.quotation.taxPrice));
            $('#quoTotal').text(qc.money(res.quotation.totalPrice));
        }, null, false);
        app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
            var d = res.decoration;
            $('#orderIdLabel').text(' - ' + orderId);
            $('#decoOrderId').text(orderId);
            $('#decoAddress').text(d.house ? (d.house.village.name + ' ' + d.house.houseNumber) : '-');
            $('#decoVersion').text(d.version ? d.version.name : '-');
        }, null, false);
    } else {
        pageConfig = qc.getPageConfig(urlLoad.depage, 3);
        if (!pageConfig.apiPage) pageConfig.apiPage = api.quotation.pageExtension;
        $('#decorationInfo').hide();
        $('#btnAdd, #btnBack').hide();
        $('#searchArea').show();
    }
    function hasBtn(n) { return pageType != 'page' || (pageConfig.pageBtn || []).indexOf(n) != -1; }

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'decoration', title: '装修单号', width: 110, fixed: 'left', templet: function (d) { return d.decoration ? d.decoration.orderId : ''; } },
            { field: 'type', title: '类型', width: 80, templet: function (d) { return qc.badge(E.extensionType, d.type); } },
            { field: 'atttype', title: '业务类型', width: 90, templet: function (d) { return E.extensionAtttype[d.atttype] != null ? E.extensionAtttype[d.atttype] : d.atttype; } },
            { field: 'undisPrice', title: '不打折总额', width: 100, templet: function (d) { return qc.money(d.undisPrice); } },
            { field: 'disPrice', title: '打折总额', width: 95, templet: function (d) { return qc.money(d.disPrice); } },
            { field: 'total', title: '总价', width: 100, templet: function (d) { return qc.money(d.total); } },
            { field: 'manageRate', title: '管理费比例', width: 95 },
            { field: 'manageDiscount', title: '管理费折扣', width: 95 },
            { field: 'managePrice', title: '管理费', width: 95, templet: function (d) { return qc.money(d.managePrice); } },
            { field: 'taxRate', title: '税金比例', width: 85 },
            { field: 'taxPrice', title: '税金', width: 95, templet: function (d) { return qc.money(d.taxPrice); } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return qc.badge(E.extensionStatus, d.status); } },
            { field: 'content', title: '说明', minWidth: 130 },
            { title: '操作', width: 230, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    function query(pg) {
        state.page = pg || 1;
        if (pageType == 'page') {
            var opts = $.extend({}, qc.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows });
            $.each(pageConfig.extraParam || [], function (i, v) { opts['statusas[' + i + ']'] = v; });
            app.post(pageConfig.apiPage, opts, done);
        } else {
            app.post(api.quotation.queryExtensionByOrderId, { 'extension.orderId': orderId, 'extension.atttype': -1 }, function (res) {
                table.reload('resultTable', { data: res.extensions || [] });
            });
        }
    }
    function done(res) {
        var p = res.paging || {};
        table.reload('resultTable', { data: p.data || [] });
        state.total = p.totalRecords || 0;
        laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } });
    }

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'view' && hasBtn('view')) {
            app.params.quotation = $.extend({}, app.params.quotation, { extension: v, extensionId: v.eid, extensionType: v.type });
            app.params.historyPage = api.index.extensionIndex.url;
            app.switchPage(api.index.extensionPartIndex.url);
        } else if (obj.event === 'del' && hasBtn('delete')) {
            app.showConfirm('是否确认删除', function () {
                app.post(api.quotation.deleteExtension, { 'extension.eid': v.eid }, function () {
                    app.showAlert(app.info, '操作成功'); query(state.page);
                });
            });
        } else if (obj.event === 'make') {
            app.post(api.quotation.makeNormtionForExtension, {
                'extension.eid': v.eid,
                'normtion.qid': qid,
                'normtion.orderId': orderId,
                'normtion.moodPrintNum': 0, 'normtion.moodTotal': 0,
                'normtion.mricePriceNum': 0, 'normtion.mriceTotal': 0
            }, function () { app.showAlert(app.success, '定额生成成功'); });
        }
    });

    $('#btnAdd').on('click', function () {
        $('#editBox form')[0].reset();
        form.render('select');
        layer.open({ type: 1, title: '创建扩展', content: $('#editBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                app.post(api.quotation.addExtension, {
                    'extension.orderId': orderId,
                    'extension.type': $('#extensionType').val(),
                    'extension.atttype': $('#extensionAtttype').val(),
                    'extension.content': $('#extensionDes').val()
                }, function () {
                    app.showAlert(app.success, '创建成功');
                    layer.close(idx); query();
                });
            } });
    });

    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || 'views/decoration/decoration.html'); });
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    query(1);
});
}); // end app.ready
