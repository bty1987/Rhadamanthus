/** app/js/quotation/addReduceIndex.js —— 增减项列表
 *  订单模式：queryAddReduceByOrderId + 头信息（默认报价/装修单）；批量提交 submitAddReduce、发送 sendAddReduce、
 *  打印 addReduceOutput（勾选 arids）；创建 addAddReduce。
 *  行操作：定额 makeNormtionForAddReduce、查看（addReducePart）、提交（status=0 且 paytype=0）、撤销（status=1）、
 *  下拨/特批（增项 unpay paytype=1/2）、不退（减项 unpay paytype=3）、确认 confirmAddReduce、
 *  标签（quotationProfile4detail type=5）、工费已开/驳回（open/rejectAddReduceForSalary）、删除、决算（account 模式 updateAddReduceForAccount）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var E = quotationCommon.ENUM;
    var qctx = qc.ctx('quotation') || {};
    var urlLoad = qc.ctx('urlLoadParams') || {};
    var orderId = qctx.orderId;
    var pageType = urlLoad.type;
    var qid = null, quotation = null;
    var pageConfig = null;
    var state = { page: 1, rows: 10, total: 0 };
    var lastData = [];

    if (pageType != 'page') {
        $('#searchArea').hide();
        app.post(api.quotation.queryQuotationForDefaultByOrderId, { 'quotation.orderId': orderId }, function (res) {
            quotation = res.quotation;
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
        pageConfig = qc.getPageConfig(urlLoad.depage, 6);
        if (!pageConfig.apiPage) pageConfig.apiPage = api.quotation.pageAddReduce;
        $('#decorationInfo').hide();
        $('#searchArea').show();
    }
    if (pageType == 'account') {
        $('#btnAdd, #btnSubmit, #btnNotice, #btnPrint').hide();
    }
    if (pageType == 'page') {
        $('#btnAdd, #btnSubmit, #btnNotice, #btnPrint, #btnBack').hide();
    }

    function hasBtn(n) { return pageType != 'page' || (pageConfig.pageBtn || []).indexOf(n) != -1; }

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'checkbox', width: 40 },
            { type: 'numbers', title: '#', width: 50 },
            { field: 'decoration', title: '装修单号', width: 105, fixed: 'left', templet: function (d) { return d.decoration ? d.decoration.orderId : (d.orderId || ''); } },
            { field: 'type', title: '类别', width: 70, templet: function (d) { return qc.badge(E.addReduceType, d.type); } },
            { field: 'atttype', title: '类型', width: 70, templet: function (d) { return E.addReduceAtttype[d.atttype] != null ? E.addReduceAtttype[d.atttype] : d.atttype; } },
            { field: 'undisPrice', title: '非打折总额', width: 100, templet: function (d) { return qc.money(d.undisPrice); } },
            { field: 'disPrice', title: '打折总额', width: 95, templet: function (d) { return qc.money(d.disPrice); } },
            { field: 'managePrice', title: '管理费', width: 90, templet: function (d) { return qc.money(d.managePrice); } },
            { field: 'taxPrice', title: '税金', width: 90, templet: function (d) { return qc.money(d.taxPrice); } },
            { field: 'taxRate', title: '税金比例', width: 85 },
            { field: 'consPrice', title: '工程总额', width: 95, templet: function (d) { return qc.money(d.consPrice); } },
            { field: 'total', title: '总价', width: 95, templet: function (d) { return qc.money(d.total); } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return qc.badge(E.addReduceStatus, d.status); } },
            { field: 'paytype', title: '付款类型', width: 90, templet: function (d) { return E.addReducePaytype[d.paytype] != null ? E.addReducePaytype[d.paytype] : d.paytype; } },
            { field: 'isAffirm', title: '是否确认', width: 90, templet: function (d) { return E.addReduceIsAffirm[d.isAffirm] != null ? E.addReduceIsAffirm[d.isAffirm] : ''; } },
            { field: 'isSalary', title: '工费标识', width: 85, templet: function (d) { return E.addReduceIsSalary[d.isSalary] != null ? E.addReduceIsSalary[d.isSalary] : ''; } },
            { field: 'createTime', title: '创建时间', width: 160 },
            { field: 'confirmTime', title: '款项确认时间', width: 160 },
            { field: 'affirmTime', title: '客户确认时间', width: 160 },
            { field: 'sendTime', title: '推送时间', width: 160 },
            { field: 'content', title: '说明', minWidth: 110 },
            { title: '操作', width: 420, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    // —— 行按钮 ——
    var BTNS = [];
    function reg(ev, name, show, handle) { BTNS.push({ ev: ev, name: name, show: show, handle: handle }); }
    reg('make', '定额', function () { return pageType == null; }, function (v) {
        app.post(api.quotation.makeNormtionForAddReduce, {
            'addReduce.arId': v.arId, 'normtion.qid': qid, 'normtion.orderId': orderId,
            'normtion.moodPrintNum': 0, 'normtion.moodTotal': 0, 'normtion.mricePriceNum': 0, 'normtion.mriceTotal': 0
        }, function () { app.showAlert(app.success, '定额生成成功'); });
    });
    reg('view', '查看', function () { return hasBtn('view'); }, function (v) {
        app.params.quotation = $.extend({}, app.params.quotation, { addReduce: v, arid: v.arId, addReduceType: v.type });
        app.params.historyPage = api.index.addReduceIndex.url;
        app.switchPage(api.index.addReducePartIndex.url);
    });
    reg('submit', '提交', function (v) { return (pageType == null || hasBtn('submit')) && v.status == 0 && v.paytype == 0; }, function (v) {
        app.post(api.quotation.submitAddReduce, { 'addReduces[0].arId': v.arId, 'addReduce.orderId': pageType == null ? orderId : v.decoration.orderId }, function () {
            app.showAlert(app.info, '操作成功'); query(state.page);
        });
    });
    reg('cancel', '撤销', function (v) { return v.status == 1; }, function (v) {
        app.post(api.quotation.cancelAddReduce, { 'addReduce.dpId': v.dpId }, function () {
            app.showAlert(app.info, '操作成功'); query(state.page);
        });
    });
    reg('allocation', '下拨', function (v) { return v.status == 0 && v.paytype == 0 && v.type == 0; }, function (v) { unpay(v.arId, 1); });
    reg('special', '特批', function (v) { return v.status == 0 && v.paytype == 0 && v.type == 0; }, function (v) { unpay(v.arId, 2); });
    reg('norefund', '不退', function (v) { return v.status == 0 && v.paytype == 0 && v.type == 1; }, function (v) { unpay(v.arId, 3); });
    reg('affirm', '确认', function (v) { return (v.status == 0 || v.status == 1) && (v.paytype == 1 || v.paytype == 2); }, function (v) {
        app.showConfirm('是否确认增减单', function () {
            app.post(api.quotation.confirmAddReduce, { 'addReduce.arId': v.arId }, function () {
                app.showAlert(app.info, '操作成功'); query(state.page);
            });
        });
    });
    reg('tag', '标签', function () { return pageType == null; }, function (v) {
        app.params.quotation = { orderId: v.orderId || (v.decoration && v.decoration.orderId), qid: v.arId, type: 5, profile: { type: 5 } };
        app.popup(api.index.quotationProfile4detailIndex.url, '增减标签', null, { area: ['85%', '85%'] });
    });
    reg('account', '决算', function () { return pageType == 'account'; }, function (v) { openAccount(v); });
    reg('salaryOpen', '工费已开', function () { return pageType == 'account'; }, function (v) {
        app.showConfirm('是否确认开工费,开工费后增减单不可删除、总额和项目不可变更', function () {
            app.post(api.quotation.openAddReduceForSalary, { 'addReduce.arId': v.arId }, function () {
                app.showAlert(app.info, '操作成功'); query(state.page);
            });
        });
    });
    reg('salaryReject', '工费驳回', function () { return pageType == 'account'; }, function (v) {
        app.showConfirm('是否驳回工费,驳回后增减单恢复可操作', function () {
            app.post(api.quotation.rejectAddReduceForSalary, { 'addReduce.arId': v.arId }, function () {
                app.showAlert(app.info, '操作成功'); query(state.page);
            });
        });
    });
    reg('delete', '删除', function (v) { return (pageType == null || hasBtn('delete')) && (v.status == 0 || v.status == 1); }, function (v) {
        app.showConfirm('是否确认删除', function () {
            app.post(api.quotation.deleteAddReduce, { 'addReduce.arId': v.arId }, function () {
                app.showAlert(app.info, '操作成功'); query(state.page);
            });
        });
    });
    function renderToolbar(sample) {
        var html = '';
        $.each(BTNS, function (i, b) { if (b.show(sample)) html += '<button class="layui-btn layui-btn-xs" lay-event="' + b.ev + '">' + b.name + '<\/button>'; });
        $('#rowToolbar').html(html);
    }
    table.on('tool(resultTable)', function (obj) {
        for (var i = 0; i < BTNS.length; i++) if (BTNS[i].ev === obj.event) { BTNS[i].handle(obj.data); return; }
    });

    function query(pg) {
        state.page = pg || 1;
        if (pageType == 'page') {
            var opts = $.extend({}, qc.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows });
            $.each(pageConfig.extraParam || [], function (i, v) { opts['statusas[' + i + ']'] = v; });
            app.post(pageConfig.apiPage, opts, function (res) {
                var p = res.paging || {};
                lastData = p.data || [];
                renderToolbar(lastData.length ? lastData[0] : {});
                table.reload('resultTable', { data: lastData });
                state.total = p.totalRecords || 0;
                laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } });
            });
        } else {
            app.post(api.quotation.queryAddReduceByOrderId, { 'addReduce.orderId': orderId }, function (res) {
                lastData = res.addReduces || [];
                renderToolbar(lastData.length ? lastData[0] : {});
                table.reload('resultTable', { data: lastData });
            });
        }
    }

    function unpay(arid, paytype) {
        app.post(api.quotation.unpayAddReduce, { 'addReduce.arId': arid, 'addReduce.paytype': paytype }, function () {
            app.showAlert(app.info, '操作成功'); query(state.page);
        });
    }

    // —— 创建 ——
    $('#btnAdd').on('click', function () {
        $('#editBox form')[0].reset();
        form.render('select');
        layer.open({ type: 1, title: '创建增减项', content: $('#editBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                app.post(api.quotation.addAddReduce, {
                    'addReduce.content': $('#addReduceDes').val(),
                    'addReduce.type': $('#addReduceType').val(),
                    'addReduce.atttype': $('#atttype').val(),
                    'addReduce.orderId': orderId,
                    'addReduce.status': 0,
                    'addReduce.total': 0,
                    'addReduce.managePrice': 0,
                    'addReduce.taxPrice': 0,
                    'addReduce.taxDiscount': quotation ? quotation.taxDiscount : 0
                }, function () {
                    app.showAlert(app.info, '操作成功');
                    layer.close(idx); query();
                });
            } });
    });

    // —— 批量操作 ——
    $('#btnSubmit').on('click', function () {
        var cks = table.checkStatus('resultTable');
        if (!cks.data.length) return;
        var options = { 'addReduce.orderId': orderId };
        $.each(cks.data, function (i, v) { options['addReduces[' + i + '].arId'] = v.arId; });
        app.post(api.quotation.submitAddReduce, options, function () {
            app.showAlert(app.info, '操作成功'); query(state.page);
        });
    });
    $('#btnNotice').on('click', function () {
        var cks = table.checkStatus('resultTable');
        if (!cks.data.length) return;
        var options = { 'addReduce.orderId': orderId };
        var arid = '';
        $.each(cks.data, function (i, v) {
            options['addReduces[' + i + '].arId'] = v.arId;
            arid += (i == 0 ? '' : ',') + v.arId;
        });
        options['addReduce.content'] = arid;
        app.showConfirm('是否发送查看通知', function () {
            app.post(api.quotation.sendAddReduce, options, function () {
                app.showAlert(app.info, '操作成功'); query(state.page);
            });
        });
    });
    $('#btnPrint').on('click', function () {
        var cks = table.checkStatus('resultTable');
        if (!cks.data.length) { app.showAlert(app.warning, '请勾选要打印的增减单'); return; }
        app.params.quotation = $.extend({}, app.params.quotation, { arids: $.map(cks.data, function (v) { return v.arId; }) });
        app.popup(api.index.addReduceOutputIndex.url, '增减项打印', null, { area: ['85%', '90%'] });
    });

    // —— 决算 / 工费 ——
    function openAccount(v) {
        $('#accountDiscount').val(v.accountDiscount);
        $('#accountManageDiscount').val(v.accountManageDiscount);
        $('#accountTaxDiscount').val(v.accountTaxDiscount);
        layer.open({ type: 1, title: '决算 - ' + v.arId, content: $('#accountBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                app.post(api.quotation.updateAddReduceForAccount, {
                    'addReduce.arId': v.arId,
                    'addReduce.accountDiscount': $('#accountDiscount').val(),
                    'addReduce.accountManageDiscount': $('#accountManageDiscount').val(),
                    'addReduce.accountTaxDiscount': $('#accountTaxDiscount').val()
                }, function () {
                    app.showAlert(app.info, '操作成功');
                    layer.close(idx); query(state.page);
                });
            } });
    }
    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || 'views/decoration/decoration.html'); });
    $('#btnRefresh').on('click', function () { query(state.page); });
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    query(1);
});
}); // end app.ready
