/** app/js/quotation/quotationIndex.js —— 报价单列表
 *  订单模式（默认）：queryQuotationByOrderId（卡片限额 quotationlimit 配置）；
 *  页面模式（?type=page&depage=）：queryQuotationFunctionRight(depage,3) 配置驱动。
 *  工具栏：创建 addQuotation、复制 copyQuotation、导入 cloneQuotation/replicaQuotation。
 *  行操作：打印 quotationOutput、记录 quotationRecord、提交 submitQuotation、审完 auditQuotation、交付 finishQuotation、
 *  审核/制作/查看（quotationPart attpages）、删除 deleteQuotationById、默认 changeQuotationForDefault(+updateHouse)、
 *  锁定/解锁 lockQuotation/unlockQuotation、选材 selectionPart、定额 normPart、退单 addRuotation、
 *  优惠 updateQuotationPrefer（整装/半包两套折扣校验 + 特殊优惠超额审批）、信息 updateQuotationForInfo、
 *  标签 quotationProfile4detail、装修单 decoration4detail。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var E = quotationCommon.ENUM;
    var u = app.utils;
    var qctx = qc.ctx('quotation') || {};
    var urlLoad = qc.ctx('urlLoadParams') || {};
    var orderId = qctx.orderId;
    var pageType = urlLoad.type;
    var decoration = null;
    var limit = 20;
    var editFlag = 0; // 0 create, 1 update, 2 copy
    var curQuotation = null, curPrefer = null, extensionManagePrice = 0;
    var pageConfig = null;
    var state = { page: 1, rows: 10, total: 0 };

    if (pageType != 'page') {
        app.post(api.system.querySystemConfigByKey, { 'systemConfig.key': 'quotationlimit' }, function (res) {
            if (res.systemConfig && res.systemConfig.value) limit = parseInt(res.systemConfig.value, 10);
            $('#limitNum').text(limit);
        }, null, false);
        app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
            decoration = res.decoration;
            $('#orderIdLabel').text(' - ' + orderId);
            $('#decoOrderId').text(orderId);
            $('#decoAddress').text(decoration.house ? (decoration.house.village.name + ' ' + decoration.house.houseNumber) : '-');
            $('#decoVersion').text(decoration.version ? decoration.version.name : '-');
        }, null, false);
    } else {
        pageConfig = qc.getPageConfig(urlLoad.depage, 3);
        if (!pageConfig.apiPage) pageConfig.apiPage = api.quotation.pageQuotation;
        $('#decorationInfo').hide();
        $('#btnCreate, #btnCopy, #btnReplica, #btnBack').hide();
        $('#searchArea').show();
    }
    function hasBtn(n) { return pageType != 'page' || (pageConfig.pageBtn || []).indexOf(n) != -1; }
    function ordId(v) { return pageType != 'page' ? (v.orderId || orderId) : (v.decoration ? v.decoration.orderId : ''); }

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'decoration', title: '装修单号', width: 105, fixed: 'left', templet: function (d) { return d.decoration ? d.decoration.orderId : (d.orderId || ''); } },
            { field: 'name', title: '名称', width: 130 },
            { field: 'style', title: '风格', width: 90 },
            { field: 'version', title: '版本', width: 100, templet: function (d) { return d.version ? d.version.name : ''; } },
            { field: 'createTime', title: '创建时间', width: 160 },
            { field: 'auditTime', title: '保价时间', width: 160 },
            { field: 'undisPrice', title: '非打折总额', width: 100, templet: function (d) { return qc.money(d.undisPrice); } },
            { field: 'disPrice', title: '打折总额', width: 95, templet: function (d) { return qc.money(d.disPrice); } },
            { field: 'trafficPrice', title: '车运费', width: 90, templet: function (d) { return qc.money(d.trafficPrice); } },
            { field: 'managePrice', title: '管理费', width: 90, templet: function (d) { return qc.money(d.managePrice); } },
            { field: 'taxPrice', title: '税金', width: 90, templet: function (d) { return qc.money(d.taxPrice); } },
            { field: 'basePrice', title: '工程基数', width: 90, templet: function (d) { return qc.money(d.basePrice); } },
            { field: 'totalPrice', title: '总价', width: 100, templet: function (d) { return qc.money(d.totalPrice); } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return qc.badge(E.quotationStatus, d.status); } },
            { field: 'attstatus', title: '审核状态', width: 90, templet: function (d) { return qc.badge(E.quotationAttstatus, d.attstatus); } },
            { field: 'defaults', title: '默认', width: 80, templet: function (d) { return d.defaults == 1 ? qc.badge({ 1: '默认' }, d.defaults) : '非默认'; } },
            { field: 'content', title: '备注', minWidth: 110 },
            { title: '操作', width: 460, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    function query(pg) {
        state.page = pg || 1;
        if (pageType == 'page') {
            var opts = $.extend({}, qc.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows });
            $.each(pageConfig.extraParam || [], function (i, v) { opts['statusas[' + i + ']'] = v; });
            app.post(pageConfig.apiPage, opts, function (res) {
                var p = res.paging || {};
                renderToolbar((p.data || [])[0] || {});
                table.reload('resultTable', { data: p.data || [] });
                state.total = p.totalRecords || 0;
                laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } });
            });
        } else {
            app.post(api.quotation.queryQuotationByOrderId, { 'quotation.orderId': orderId }, function (res) {
                var list = res.quotations || [];
                renderToolbar(list[0] || {});
                table.reload('resultTable', { data: list });
                $('#usedNum').text(list.length);
                $('#subNum').text(limit - list.length);
            });
        }
    }

    // —— 行按钮 ——
    var BTNS = [];
    function reg(ev, name, show, handle) { BTNS.push({ ev: ev, name: name, show: show, handle: handle }); }
    function passCtx(v, attpages) {
        app.params.quotation = $.extend({}, app.params.quotation, {
            orderId: ordId(v), quotation: v,
            attpaging: pageType != null ? attpages : null,
            attpages: pageType == null ? attpages : null
        });
    }
    reg('print', '打印', function () { return hasBtn('print'); }, function (v) { openPrint(v); });
    reg('record', '记录', function () { return hasBtn('record'); }, function (v) {
        app.params.quotation = $.extend({}, app.params.quotation, { quotation: v });
        app.params.urlLoadParams = $.extend({}, app.params.urlLoadParams, { pageType: 'query' });
        app.popup('views/quotation/quotationRecord.html', '记录', null, { area: ['80%', '80%'] });
    });
    reg('submit', '提交', function (v) { return hasBtn('submit') && v.attstatus == 0; }, function (v) {
        app.post(api.quotation.submitQuotation, { 'quotation.qid': v.qid }, function () { app.showAlert(app.info, '操作成功'); query(state.page); });
    });
    reg('audit', '审完', function (v) { return hasBtn('audit') && v.attstatus == 1; }, function (v) {
        app.showConfirm('是否确认审完?', function () {
            app.post(api.quotation.auditQuotation, { 'quotation.qid': v.qid }, function () { app.showAlert(app.info, '操作成功'); query(state.page); });
        });
    });
    reg('finish', '交付', function (v) { return hasBtn('finish') && v.attstatus == 2; }, function (v) {
        app.showConfirm('是否确认交付?', function () {
            app.post(api.quotation.finishQuotation, { 'quotation.qid': v.qid }, function () { app.showAlert(app.info, '操作成功'); query(state.page); });
        });
    });
    reg('copy', '复制', function (v) { return hasBtn('copy'); }, function (v) { openEdit(v, 2); });
    reg('update', '修改', function (v) { return hasBtn('update'); }, function (v) { openEdit(v, 1); });
    reg('audi', '审核', function (v) { return hasBtn('audi') && v.attstatus == 1; }, function (v) {
        passCtx(v, 'audi');
        app.params.historyPage = api.index.quotationIndex.url;
        app.switchPage(api.index.quotationPartIndex.url);
    });
    reg('work', '制作', function (v) { return hasBtn('work') && v.attstatus == 0; }, function (v) {
        passCtx(v, 'work');
        app.params.historyPage = api.index.quotationIndex.url;
        app.switchPage(api.index.quotationPartIndex.url);
    });
    reg('view', '查看', function (v) { return hasBtn('view') && [2, 3].indexOf(v.attstatus) != -1; }, function (v) {
        passCtx(v, null);
        app.params.historyPage = api.index.quotationIndex.url;
        app.switchPage(api.index.quotationPartIndex.url);
    });
    reg('delete', '删除', function (v) { return hasBtn('delete') && v.defaults != 1; }, function (v) {
        app.showConfirm('确定要删除报价: ' + v.name, function () {
            app.post(api.quotation.deleteQuotationById, { 'quotation.qid': v.qid, 'quotation.orderId': ordId(v) }, function () { query(state.page); });
        });
    });
    reg('default', '默认', function (v) { return hasBtn('default') && v.defaults == 0; }, function (v) {
        app.post(api.quotation.changeQuotationForDefault, { 'quotation.qid': v.qid, 'quotation.orderId': ordId(v) }, function (res) {
            query(state.page);
            if (res.quotation) {
                app.post(api.quotation.queryQuotationPrefer, { 'quotationPrefer.qid': res.quotation.qid }, function (rp) {
                    var pref = rp.quotationPrefer || {};
                    if (pref.quoteArea != null) {
                        app.post(api.data.updateHouse, { 'house.innerArea': pref.quoteArea, 'house.hid': pageType == null ? (decoration && decoration.house ? decoration.house.hid : '') : (v.decoration && v.decoration.house ? v.decoration.house.hid : '') }, function () {});
                    }
                }, null, false);
            }
        });
    });
    reg('lock', '锁定', function (v) { return hasBtn('lock') && v.status == 0; }, function (v) {
        app.post(api.quotation.lockQuotation, { 'quotation.qid': v.qid }, function () { app.showAlert(app.info, '锁定成功'); query(state.page); });
    });
    reg('unlock', '解锁', function (v) { return hasBtn('unlock') && v.status == 1; }, function (v) {
        app.post(api.quotation.unlockQuotation, { 'quotation.qid': v.qid }, function () { app.showAlert(app.info, '解锁成功'); query(state.page); });
    });
    reg('selection', '选材', function () { return hasBtn('selection'); }, function (v) {
        app.params.quotation = $.extend({}, app.params.quotation, { orderId: ordId(v) });
        app.params.historyPage = api.index.quotationIndex.url;
        app.switchPage(api.index.selectionPartIndex.url);
    });
    reg('normtion', '定额', function () { return hasBtn('normtion'); }, function (v) {
        app.params.quotation = $.extend({}, app.params.quotation, { editFlg: true, orderId: ordId(v), quotation: v });
        app.params.historyPage = api.index.quotationIndex.url;
        app.switchPage(api.index.normPart.url);
    });
    reg('refund', '退单', function () { return hasBtn('refund'); }, function (v) { openRefund(v); });
    reg('prefer', '优惠', function () { return hasBtn('prefer'); }, function (v) { openPrefer(v); });
    reg('info', '信息', function () { return hasBtn('info'); }, function (v) { openInfo(v); });
    reg('tag', '标签', function () { return hasBtn('tag'); }, function (v) {
        app.params.quotation = { orderId: ordId(v), qid: v.qid, type: 1, profile: { type: 1 } };
        app.popup(api.index.quotationProfile4detailIndex.url, '报价标签', null, { area: ['85%', '85%'] });
    });
    reg('decoration', '装修单', function () { return hasBtn('decoration'); }, function (v) {
        app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': ordId(v) }, function (res) {
            var d = res.decoration;
            app.params.decoration = $.extend({}, app.params.decoration, { orderId: d.orderId, orderType: d.type, orderTypeness: d.typeness, versionId: d.versionId, notSalesmanRate: d.notSalesmanRate });
            app.params.quotation = $.extend({}, app.params.quotation, { orderId: d.orderId });
            app.popup(api.index.decorationDetailIndex.url, '装修单详情: ' + d.orderId, null, { area: ['95%', '90%'] });
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

    // —— 创建 / 修改 / 复制 ——
    function openEdit(v, flag) {
        editFlag = flag;
        $('#createOredrIdGroup').toggle(flag == 0);
        $('#copyFlags').toggle(flag == 2);
        $('#name').val(v ? v.name : '');
        $('#style').val(v ? v.style : '');
        $('#content').val(v ? v.content : '');
        $('#createOredrId').val('');
        layer.open({ type: 1, title: ['创建报价', '修改报价', '复制报价'][flag], content: $('#editBox'), area: ['540px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                if (!$.trim($('#name').val())) { app.showAlert(app.warning, '请填写名称'); return; }
                if (editFlag == 0) {
                    var options = { 'quotation.orderId': orderId, 'quotation.name': $('#name').val(), 'quotation.style': $('#style').val(), 'quotation.content': $('#content').val() };
                    if ($.trim($('#createOredrId').val()) !== '') options['quotation.orderId'] = $.trim($('#createOredrId').val());
                    app.post(api.quotation.addQuotation, options, function () { layer.close(idx); query(); });
                } else if (editFlag == 1) {
                    app.post(api.quotation.updateQuotation, { 'quotation.orderId': ordId(v), 'quotation.qid': v.qid, 'quotation.name': $('#name').val(), 'quotation.style': $('#style').val(), 'quotation.content': $('#content').val() }, function () {
                        app.showAlert(app.info, '操作成功'); layer.close(idx); query();
                    });
                } else {
                    var qt = $('#quotationTimeCopy').prop('checked'), qp = $('#quotationPriceCopy').prop('checked');
                    var keeprice = !qt && !qp ? 0 : qt && !qp ? 1 : !qt && qp ? 2 : 3;
                    app.post(api.quotation.copyQuotation, { 'quotation.qid': v.qid, 'quotation.orderId': ordId(v), 'quotation.name': $('#name').val(), 'quotation.style': $('#style').val(), 'quotation.content': $('#content').val(), 'quotation.keeprice': keeprice }, function () {
                        layer.close(idx); query();
                    });
                }
            } });
    }
    $('#btnCreate').on('click', function () { openEdit(null, 0); });
    $('#btnCopy').on('click', function () {
        app.showAlert(app.info, '请点击行内"复制"按钮复制当前装修单的报价');
    });

    // —— 导入报价（clone/replica） ——
    form.on('select(replicaTypeFilter)', function (obj) {
        $('#replicaNoGroup').toggle(obj.value == 0);
        $('#replicaOrderIdGroup, #replicaQuotationGroup').toggle(obj.value == 1);
    });
    $('#replicaType').attr('lay-filter', 'replicaTypeFilter');
    $('#replicaOrderId').on('blur', function () {
        var oid = $.trim($(this).val());
        if (oid === '') return;
        app.post(api.quotation.queryQuotationByOrderId, { 'quotation.orderId': oid }, function (res) {
            app.bindData($('#quotationSel'), res.quotations, 'qid', 'name', true);
            form.render('select');
        });
    });
    $('#btnReplica').on('click', function () {
        $('#replicaBox form')[0].reset();
        $('#replicaNoGroup').show(); $('#replicaOrderIdGroup, #replicaQuotationGroup').hide();
        form.render('select');
        layer.open({ type: 1, title: '导入报价', content: $('#replicaBox'), area: ['560px', 'auto'],
            btn: ['导入', '取消'], yes: function (idx) {
                var qt = $('#quotationTime').prop('checked'), qp = $('#quotationPrice').prop('checked');
                var keeprice = !qt && !qp ? 0 : qt && !qp ? 1 : !qt && qp ? 2 : 3;
                var options = { 'quotation.orderId': orderId, 'quotation.keeprice': keeprice };
                if ($.trim($('#replicaOrderId').val()) !== '' && $('#replicaOrderIdGroup').css('display') != 'none') options['quotation.orderId'] = $.trim($('#replicaOrderId').val());
                var url;
                if ($('#replicaType').val() == 0) {
                    url = api.quotation.cloneQuotation;
                    options['no'] = $('#quotetionNo').val();
                    options['quotation.orderId'] = orderId;
                } else {
                    url = api.quotation.replicaQuotation;
                    options['quotation.qid'] = $('#quotationSel').val();
                }
                app.post(url, options, function () {
                    app.showAlert(app.info, '操作成功');
                    layer.close(idx); query();
                });
            } });
    });

    // —— 打印 ——
    function openPrint(v) {
        layer.open({ type: 1, title: '打印 - ' + v.name, content: $('#printBox'), area: ['560px', 'auto'],
            btn: ['打印', '取消'], yes: function (idx) {
                var type = 0;
                $('input[name="printType"]:checked').each(function () { type += parseInt($(this).val(), 10); });
                if (!type) type = 31;
                layer.close(idx);
                app.params.quotation = $.extend({}, app.params.quotation, {
                    orderId: ordId(v), quotationId: v.qid, quotation: v,
                    type: type, subtype: 15, orderType: v.decoration ? v.decoration.type : (decoration ? decoration.type : 0), showType: 31
                });
                app.popup(api.index.quotationOutputIndex.url, '打印报价', null, { area: ['85%', '90%'] });
            } });
    }

    // —— 退单（软装） ——
    function openRefund(v) {
        $('#refundComment').val('');
        layer.open({ type: 1, title: '退单 - ' + v.name, content: $('#refundBox'), area: ['500px', 'auto'],
            btn: ['确定', '取消'], yes: function (idx) {
                app.post(api.quotation.addRuotation, { 'ruotation.decoration.orderId': ordId(v), 'ruotation.quotation.qid': v.qid, 'ruotation.comment': $('#refundComment').val() }, function () {
                    app.showAlert(app.success, '退单创建成功');
                    layer.close(idx); query();
                });
            } });
    }

    // —— 优惠（整装/半包两套折扣校验） ——
    function openPrefer(v) {
        curQuotation = v;
        extensionManagePrice = 0;
        app.post(api.quotation.queryQuotationPrefer, { 'quotationPrefer.qid': v.qid }, function (res) {
            curPrefer = res.quotationPrefer || {};
            $('#preferPrice').val(curPrefer.preferPrice != null ? curPrefer.preferPrice : 0).prop('disabled', curPrefer.discount == 10);
            $('#managePrefer').val(curPrefer.managePrefer != null ? curPrefer.managePrefer : 0).prop('disabled', curPrefer.manageDiscount == 10);
            $('#advancePrefer').val(curPrefer.advancePrefer != null ? curPrefer.advancePrefer : 0);
        }, null, false);
        app.post(api.quotation.queryExtensionByOrderId, { 'extension.orderId': ordId(v) }, function (res) {
            $.each(res.extensions || [], function (i, e) {
                if (e.atttype == 4) return true;
                extensionManagePrice = u.accAdd(extensionManagePrice, e.type == 0 ? e.managePrice : -e.managePrice);
            });
        }, null, false);
        layer.open({ type: 1, title: '优惠 - ' + v.name, content: $('#preferBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                var quote = curQuotation, quotationPrefer = curPrefer;
                var preferPrice = $('#preferPrice').val();
                var managePrefer = $('#managePrefer').val();
                var advancePrefer = $('#advancePrefer').val();
                var quotePrice = quotationPrefer.quotePrice != null ? quotationPrefer.quotePrice : 0;
                var _preferPrice = 0, _discount = 0, _discountValue = 0, _manageDiscountValue = 0;
                var _managePrice = u.changeThrDecimal(u.accAdd(quote.managePrice, extensionManagePrice));
                var _manageDiscount = u.changeThrDecimal(u.accDiv(u.accSub(_managePrice, managePrefer), _managePrice));
                var _totalPrice = u.changeThrDecimal(u.accAdd(u.accAdd(u.accAdd(quote.undisPrice, quote.disPrice), quotePrice), quote.trafficPrice));
                var protation = { quotePrice: 1, preferPrice: 0, managePrice: 0, manageProfit: 0, advanceProfit: 0 };
                app.post(api.quotation.queryProtationForDefaultByOrderId, { 'protation.orderId': ordId(quote) }, function (res) {
                    if (res.protation && res.protation.pid) protation = res.protation;
                }, null, false);

                if (quote.decoration && quote.decoration.type == 1) {
                    _preferPrice = quotationPrefer.quotePrice;
                    _discount = u.changeThrDecimal(u.accDiv(u.accSub(quotationPrefer.quotePrice, preferPrice), quotationPrefer.quotePrice));
                    _discountValue = u.changeThrDecimal(u.accDiv(u.accSub(protation.quotePrice, protation.preferPrice), protation.quotePrice));
                    _manageDiscountValue = u.changeThrDecimal(u.accDiv(u.accSub(protation.managePrice, protation.manageProfit), protation.managePrice));
                } else {
                    _preferPrice = _totalPrice;
                    _discount = u.changeThrDecimal(u.accDiv(u.accSub(_totalPrice, preferPrice), _totalPrice));
                    _discountValue = quote.discount;
                    _manageDiscountValue = quote.discount;
                }
                _discount = _discount < 0 ? 0 : _discount > 1 ? 1 : _discount;
                _discountValue = _discountValue < 0 ? 0 : _discountValue > 1 ? 1 : _discountValue;
                _manageDiscount = _manageDiscount < 0 ? 0 : _manageDiscount > 1 ? 1 : _manageDiscount;
                _manageDiscountValue = _manageDiscountValue < 0 ? 0 : _manageDiscountValue > 1 ? 1 : _manageDiscountValue;
                if (_preferPrice < preferPrice) { app.showAlert(app.warning, '优惠金额不合理'); return; }
                if (_discount < _discountValue) { app.showAlert(app.warning, '优惠金额不合理'); return; }
                if (_managePrice < managePrefer) { app.showAlert(app.warning, '管理优惠不能大于管理费'); return; }
                if (_manageDiscount < _manageDiscountValue) { app.showAlert(app.warning, '管理费优惠金额不合理'); return; }

                var totalPrice = 0, dtaxPrice = 0, taxPrice = 0;
                var discount = u.accDiv(quote.discount, 10);
                var manageDiscount = quote.manageDiscount == 1 ? discount : 1;
                var trafficDiscount = quote.trafficDiscount == 1 ? discount : 1;
                var dmanagePrice = u.accMul(quote.managePrice, manageDiscount);
                var dtrafficPrice = u.accMul(quote.trafficPrice, trafficDiscount);
                var notSalesmanRate = quote.decoration ? quote.decoration.notSalesmanRate : 0;

                if (quote.taxDiscount == 1) { // 管理税金
                    taxPrice = u.changeThrDecimal(u.accMul(u.accSub(u.accSub(u.accSub(u.accAdd(u.accAdd(u.accAdd(quote.disPrice, quote.undisPrice), quotePrice), quote.trafficPrice), preferPrice), managePrefer), advancePrefer), quote.taxRate));
                    dtaxPrice = u.changeThrDecimal(u.accMul(taxPrice, manageDiscount));
                }
                if (quote.taxDiscount == 2) { // 总额税金
                    taxPrice = u.changeThrDecimal(u.accMul(u.accSub(u.accSub(u.accSub(u.accAdd(u.accAdd(u.accAdd(u.accAdd(quote.disPrice, quote.undisPrice), quotePrice), quote.trafficPrice), quote.managePrice), preferPrice), managePrefer), advancePrefer), quote.taxRate));
                    dtaxPrice = taxPrice;
                }
                if (quote.basePrice && quote.basePrice != 0) {
                    var total = u.accAdd(u.accAdd(u.accAdd(quote.disPrice, quote.undisPrice), quotePrice), quote.trafficPrice);
                    var remainder = total % quote.basePrice;
                    totalPrice = u.changeThrDecimal(u.accSub(u.accSub(u.accSub(u.accAdd(u.accAdd(u.accAdd(u.accMul(u.accSub(total, remainder), discount), remainder), dmanagePrice), dtaxPrice), preferPrice), managePrefer), advancePrefer));
                } else {
                    totalPrice = u.changeThrDecimal(u.accSub(u.accSub(u.accSub(u.accAdd(u.accAdd(u.accAdd(u.accAdd(u.accAdd(u.accMul(quote.disPrice, discount), quote.undisPrice), quotePrice), dtrafficPrice), dmanagePrice), dtaxPrice), preferPrice), managePrefer), advancePrefer));
                }
                totalPrice = u.accAdd(totalPrice, !(notSalesmanRate > 0 && notSalesmanRate < 1) ? notSalesmanRate : 0);

                var params = {
                    'quotation.qid': quote.qid,
                    'quotation.totalPrice': totalPrice,
                    'quotation.taxPrice': taxPrice,
                    'quotationPrefer.qid': quote.qid,
                    'quotationPrefer.preferPrice': preferPrice,
                    'quotationPrefer.managePrefer': managePrefer,
                    'quotationPrefer.advancePrefer': advancePrefer,
                    'quotationPrefer.activityPrice': quotationPrefer.activityPrice != null ? quotationPrefer.activityPrice : 0,
                    'quotationPrefer.activityProfit': quotationPrefer.activityProfit != null ? quotationPrefer.activityProfit : 0
                };
                if (parseFloat(advancePrefer) > quotationPrefer.advancePrefer && parseFloat(advancePrefer) > protation.advanceProfit) {
                    // 特殊优惠超额 → 提示走审批（报价特殊优惠审批由报价提交审批流处理）
                    app.showAlert(app.warning, '特殊优惠超过限额, 请通过审批流程处理');
                    return;
                }
                app.post(api.quotation.updateQuotationPrefer, params, function () {
                    query(state.page); layer.close(idx);
                });
            } });
    }

    // —— 信息 ——
    function openInfo(v) {
        curQuotation = v;
        app.post(api.quotation.queryQuotationPrefer, { 'quotationPrefer.qid': v.qid }, function (res) {
            var p = res.quotationPrefer || {};
            $('#redo').val(p.redo != null ? p.redo : 0);
            $('#urgent').val(p.urgent != null ? p.urgent : 0);
            $('#drawing').val(p.drawing != null ? p.drawing : 0);
            form.render('select');
            layer.open({ type: 1, title: '信息 - ' + v.name, content: $('#infoBox'), area: ['440px', 'auto'],
                btn: ['保存', '取消'], yes: function (idx) {
                    app.post(api.quotation.updateQuotationForInfo, {
                        'quotation.qid': curQuotation.qid,
                        'quotationPrefer.qid': curQuotation.qid,
                        'quotationPrefer.redo': $('#redo').val(),
                        'quotationPrefer.urgent': $('#urgent').val(),
                        'quotationPrefer.drawing': $('#drawing').val()
                    }, function () {
                        app.showAlert(app.info, '操作成功');
                        layer.close(idx); query(state.page);
                    });
                } });
        }, null, false);
    }

    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || 'views/decoration/decoration.html'); });
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    query(1);
});
}); // end app.ready
