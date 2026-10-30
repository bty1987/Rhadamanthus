/** app/js/quotation/protationIndex.js —— 预签报价列表
 *  订单模式（默认）：queryProtationByOrderId（orderId 上下文）+ 创建 addProtation（默认预签回写 house.innerArea）；
 *  页面模式（url ?type=page&depage=xxx）：queryQuotationFunctionRight(page,2) 配置驱动 pageProtation。
 *  行操作：修改 updateProtation / 查看(protationPart) / 删除 deleteProtation / 默认 changeProtationForDefault /
 *  锁定 lockProtation / 解锁 unlockProtation / 优惠 updateProtationForAdvance（特殊优惠超额走 submitApprovalForProtationPrefer）/ 更优惠。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var E = quotationCommon.ENUM;
    var u = app.utils;
    var qctx = qc.ctx('quotation') || {};
    var urlLoad = qc.ctx('urlLoadParams') || {};
    var orderId = qctx.orderId;
    var pageType = urlLoad.type;
    var decoration = null, curProtation = null, presignProduce = null;
    var state = { page: 1, rows: 10, total: 0, limit: 3 };
    var pageConfig = null;

    // 下拉数据
    app.post(api.quotation.queryPresignProduce, {}, function (res) { app.bindData($('#produce'), res.presignProduces, 'ppid', 'name', false); form.render('select'); }, null, false);
    app.post(api.quotation.queryQuotationVersion, {}, function (res) { app.bindData($('#version'), res.quotationVersions, 'qvId', 'name', '无'); form.render('select'); }, null, false);
    // 审批人（type=22）
    var approvers = [];
    app.post(api.approval.queryApproverByType, { 'approver.type': 22 }, function (res) {
        approvers = res.approvers || [];
        var html = '';
        $.each(approvers, function (i, v) {
            html += '<div style="margin:2px 0;"><input type="radio" name="approver" value="' + v.userBase.userId + '" title="' + v.userBase.currentName + (v.comment ? ' (' + v.comment + ')' : '') + '"><\/div>';
        });
        $('#approveManSel').html(html);
        form.render();
    }, null, false);

    if (pageType != 'page') {
        // —— 订单模式：装修单信息 + 数量限制 ——
        $('#searchArea, #pagenation').hide();
        app.post(api.system.querySystemConfigByKey, { 'systemConfig.key': 'protationlimit' }, function (res) {
            if (res.systemConfig && res.systemConfig.value) { state.limit = parseInt(res.systemConfig.value, 10); $('#limitNum').text(state.limit); }
        }, null, false);
        app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
            decoration = res.decoration;
            $('#orderIdLabel').text(' - ' + orderId);
            $('#decoOrderId').text(orderId);
            $('#decoAddress').text(decoration.house ? (decoration.house.village.name + ' ' + decoration.house.houseNumber) : '-');
            $('#decoVersion').text(decoration.version ? decoration.version.name : '-');
        }, null, false);
    } else {
        pageConfig = qc.getPageConfig(urlLoad.depage, 2);
        if (!pageConfig.apiPage) pageConfig.apiPage = api.quotation.pageProtation;
        $('#decorationInfo').hide();
        $('#btnCreate').hide();
        $('#searchArea').show();
        quotationCommon.dateRange('#createTime');
    }

    // —— 表格 ——
    var D = function (d, f) { return d.decoration ? d.decoration[f] : ''; };
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'decoration', title: '装修单号', width: 110, fixed: 'left', templet: function (d) { return D(d, 'orderId'); } },
            { field: 'name', title: '名称', width: 120 },
            { field: 'version', title: '版本', width: 100, templet: function (d) { return d.version && d.version.qvId ? d.version.name : '无'; } },
            { field: 'product', title: '产品', width: 110 },
            { field: 'createTime', title: '创建时间', width: 160 },
            { field: 'quotePrice', title: '起报价', width: 95, templet: function (d) { return qc.money(u.accAdd(d.quotePrice, d.activityPrice)); } },
            { field: 'quoteArea', title: '面积', width: 80, templet: function (d) { return qc.money(d.quoteArea); } },
            { field: 'unitPrice', title: '计价单价', width: 90, templet: function (d) { return qc.money(d.unitPrice); } },
            { field: 'basicPrice', title: '基础额', width: 90, templet: function (d) { return qc.money(d.basicPrice); } },
            { field: 'comdPrice', title: '工程额', width: 90, templet: function (d) { return qc.money(d.comdPrice); } },
            { field: 'commPrice', title: '主材额', width: 90, templet: function (d) { return qc.money(d.commPrice); } },
            { field: 'adddPrice', title: '增工额', width: 90, templet: function (d) { return qc.money(d.adddPrice); } },
            { field: 'addmPrice', title: '增主额', width: 90, templet: function (d) { return qc.money(d.addmPrice); } },
            { field: 'subdPrice', title: '减工额', width: 90, templet: function (d) { return qc.money(d.subdPrice); } },
            { field: 'submPrice', title: '减主额', width: 90, templet: function (d) { return qc.money(d.submPrice); } },
            { field: 'preferPrice', title: '优惠价', width: 90, templet: function (d) { return qc.money(d.preferPrice); } },
            { field: 'managePrice', title: '管理费', width: 90, templet: function (d) { return qc.money(d.managePrice); } },
            { field: 'manageDiscount', title: '管理折扣', width: 85 },
            { field: 'taxRate', title: '税金比例', width: 85 },
            { field: 'taxPrice', title: '税金', width: 90, templet: function (d) { return qc.money(d.taxPrice); } },
            { field: 'activityPrice', title: '浮动额', width: 90, templet: function (d) { return qc.money(d.activityPrice); } },
            { field: 'activityProfit', title: '活动优惠', width: 90, templet: function (d) { return qc.money(d.activityProfit); } },
            { field: 'totalPrice', title: '总价', width: 100, templet: function (d) { return qc.money(d.totalPrice); } },
            { field: 'totalCost', title: '成本总额', width: 95, templet: function (d) { return qc.money(d.totalCost); } },
            { field: 'totalProfit', title: '利润总额', width: 95, templet: function (d) { return qc.money(d.totalProfit); } },
            { field: 'profitRate', title: '利润率', width: 80 },
            { field: 'discount', title: '折扣', width: 70 },
            { field: 'defaults', title: '默认', width: 80, templet: function (d) { return d.defaults == 1 ? qc.badge({ 1: '默认' }, d.defaults) : '非默认'; } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return qc.badge(E.protationStatus, d.status); } },
            { field: 'comment', title: '备注', minWidth: 120 },
            { title: '操作', width: 400, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    // —— 行按钮 ——
    function hasBtn(n) { return pageType != 'page' || (pageConfig.pageBtn || []).indexOf(n) != -1; }
    var BTNS = [];
    function reg(ev, name, show, handle) { BTNS.push({ ev: ev, name: name, show: show, handle: handle }); }
    reg('update', '修改', function () { return hasBtn('update'); }, function (v) { openEdit(v); });
    reg('view', '查看', function () { return hasBtn('view'); }, function (v) {
        app.params.quotation = $.extend({}, app.params.quotation, { protation: v, orderId: v.decoration ? v.decoration.orderId : orderId });
        app.params.historyPage = api.index.protationIndex.url;
        app.switchPage(api.index.protationPart.url);
    });
    reg('delete', '删除', function () { return hasBtn('delete'); }, function (v) {
        if (v.defaults == 1) { app.showAlert(app.warning, '默认预签不能删除'); return; }
        app.showConfirm('确定要删除预签: ' + v.name, function () {
            app.post(api.quotation.deleteProtation, { 'protation.pid': v.pid, 'protation.orderId': pageType != null ? v.decoration.orderId : orderId }, function () { query(); });
        });
    });
    reg('default', '默认', function (v) { return hasBtn('default') && v.defaults == 0; }, function (v) {
        var protationData = null;
        app.post(api.quotation.changeProtationForDefault, { 'protation.pid': v.pid, 'protation.orderId': pageType != null ? v.decoration.orderId : orderId }, function (res) {
            protationData = res.protation; query();
        }, null, false);
        if (protationData && decoration && decoration.house) {
            app.post(api.data.updateHouse, { 'house.innerArea': protationData.quoteArea, 'house.hid': decoration.house.hid }, function () {});
        }
    });
    reg('lock', '锁定', function (v) { return hasBtn('lock') && v.status == 0; }, function (v) {
        app.post(api.quotation.lockProtation, { 'protation.pid': v.pid }, function () { app.showAlert(app.info, '锁定成功'); query(); });
    });
    reg('unlock', '解锁', function (v) { return hasBtn('unlock') && v.status == 2; }, function (v) {
        app.post(api.quotation.unlockProtation, { 'protation.pid': v.pid }, function () { app.showAlert(app.info, '解锁成功'); query(); });
    });
    reg('prefer', '优惠', function () { return hasBtn('prefer'); }, function (v) { openPrefer(v); });
    reg('preferMore', '更优惠', function () { return hasBtn('preferMore'); }, function (v) {
        app.post(api.quotation.updateProtationForProfit, { 'protation.pid': v.pid, 'protation.discount': 1 }, function () { app.showAlert(app.info, '操作成功'); query(); });
    });
    reg('managePreferMore', '管理更优惠', function () { return hasBtn('managePreferMore'); }, function (v) {
        app.post(api.quotation.updateProtationForProfit, { 'protation.pid': v.pid, 'protation.manageDiscount': 1 }, function () { app.showAlert(app.info, '操作成功'); query(); });
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
        var opts;
        if (pageType == 'page') {
            opts = $.extend({}, qc.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows });
            $.each(pageConfig.extraParam || [], function (i, v) { opts['statusas[' + i + ']'] = v; });
            app.post(pageConfig.apiPage, opts, done);
        } else {
            app.post(api.quotation.queryProtationByOrderId, { 'protation.orderId': orderId }, function (res) {
                doneData(res.protations || []);
            });
        }
    }
    function done(res) {
        var p = res.paging || {};
        doneData(p.data || []);
        state.total = p.totalRecords || 0;
        laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } });
    }
    function doneData(list) {
        renderToolbar(list.length ? list[0] : {});
        table.reload('resultTable', { data: list });
        if (pageType != 'page') {
            $('#usedNum').text(list.length);
            $('#subNum').text(state.limit - list.length);
        }
    }

    // —— 创建/修改 ——
    $('#btnCreate').on('click', function () { openEdit(null); });
    function openEdit(v) {
        curProtation = v;
        $('#versionGroup').toggle(!!v);
        $('#produce, #quoteArea, #preferPrice').prop('disabled', !!v);
        $('#editBox form')[0].reset();
        if (v) {
            app.post(api.quotation.queryProtationByPid, { 'protation.pid': v.pid }, function (res) {
                var p = res.protation;
                curProtation = p;
                $('#name').val(p.name); $('#comment').val(p.comment);
                $('#produce').val(p.ppid); $('#quoteArea').val(p.quoteArea); $('#preferPrice').val(p.preferPrice);
                if (p.version && p.version.qvId) $('#version').val(p.version.qvId);
                form.render('select');
                layer.open({ type: 1, title: '修改预签', content: $('#editBox'), area: ['540px', 'auto'],
                    btn: ['保存', '取消'], yes: function (idx) {
                        app.post(api.quotation.updateProtation, {
                            'protation.orderId': orderId,
                            'protation.pid': p.pid,
                            'protation.name': $('#name').val(),
                            'protation.version.qvId': $('#version').val(),
                            'protation.comment': $('#comment').val()
                        }, function () {
                            app.showAlert(app.info, '操作成功');
                            layer.close(idx); query();
                        });
                    } });
            });
            return;
        }
        form.render('select');
        layer.open({ type: 1, title: '创建预签', content: $('#editBox'), area: ['540px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                if (!$.trim($('#name').val())) { app.showAlert(app.warning, '请填写名称'); return; }
                app.post(api.quotation.addProtation, {
                    'protation.ppid': $('#produce').val(),
                    'protation.orderId': orderId,
                    'protation.name': $('#name').val(),
                    'protation.preferPrice': $('#preferPrice').val(),
                    'protation.managePrice': 0,
                    'protation.quoteArea': $('#quoteArea').val(),
                    'protation.comment': $('#comment').val()
                }, function (res) {
                    layer.close(idx); query();
                    // 默认预签回写房屋计价面积
                    if (res.protation && res.protation.defaults == 1 && decoration && decoration.house) {
                        app.post(api.data.updateHouse, { 'house.innerArea': res.protation.quoteArea, 'house.hid': decoration.house.hid }, function () {});
                    }
                });
            } });
    }

    // —— 优惠（公式计算 + 特殊优惠超额审批） ——
    function evalFormula(formula, vars) {
        if (!formula || formula.indexOf('{') == -1) return formula;
        var s = formula.replace(/\{(a|b|c|d|e|f|g|h|i|j|k)\}/g, function (m, k) { return vars[k] != null ? vars[k] : 0; });
        try { var r = eval(s); return isNaN(r) ? 0 : r; } catch (e) { return 0; }
    }
    function openPrefer(v) {
        app.post(api.quotation.queryPresignProduceByPpid, { 'presignProduce.ppid': v.ppid }, function (res) { presignProduce = res.presignProduce; }, null, false);
        curProtation = v;
        $('#preferPrices').val(v.preferPrice).prop('disabled', v.discount == 10);
        $('#preferManage').val(v.manageProfit).prop('disabled', v.manageDiscount == 10);
        $('#preferAdvance').val(v.advanceProfit);
        layer.open({ type: 1, title: '优惠 - ' + v.name, content: $('#preferBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                var p = curProtation;
                var preferPrice = $('#preferPrices').val();
                var preferManage = $('#preferManage').val();
                var preferAdvance = $('#preferAdvance').val();
                var _quotePrice = u.accAdd(p.quotePrice, p.activityPrice);
                var discout = u.changeThrDecimal(u.accDiv(u.accSub(_quotePrice, preferPrice), _quotePrice));
                discout = discout < 0 ? 0 : discout > 1 ? 1 : discout;
                if (preferPrice > _quotePrice) { app.showAlert(app.warning, '优惠金额不合理'); return; }
                if (u.accMul(discout, 10) < p.discount) { app.showAlert(app.warning, '优惠金额不合理'); return; }
                if (p.managePrice < preferManage) { app.showAlert(app.warning, '管理优惠不能大于管理费'); return; }

                var manageVars = {
                    a: _quotePrice, b: preferPrice, c: p.basicPrice,
                    d: u.accAdd(p.adddPrice, p.addmPrice),
                    e: u.accAdd(u.accAdd(p.subdPrice, p.submPrice), p.subcPrice),
                    f: u.accAdd(p.accmPrice, p.accdPrice), h: preferAdvance
                };
                var _managePrice = u.changeThrDecimal(evalFormula(p.manageFormula, manageVars));
                var taxVars = $.extend({}, manageVars, { g: _managePrice, h: preferAdvance, i: preferManage });
                var _manageDiscount = u.changeThrDecimal(u.accDiv(u.accSub(_managePrice, preferManage), _managePrice));
                _manageDiscount = _manageDiscount < 0 ? 0 : _manageDiscount > 1 ? 1 : _manageDiscount;
                if (preferManage > _managePrice) { app.showAlert(app.warning, '管理费优惠金额不合理'); return; }
                if (u.accMul(_manageDiscount, 10) < p.manageDiscount) { app.showAlert(app.warning, '管理费优惠金额不合理'); return; }
                var _taxPrice = u.changeThrDecimal(evalFormula(p.taxFormula, taxVars));

                var total = u.accSub(u.accSub(u.accSub(u.accSub(u.accAdd(u.accAdd(_quotePrice, _managePrice), _taxPrice), preferPrice), preferManage), preferAdvance), p.activityProfit);
                total = u.changeThrDecimal(u.accAdd(total, u.accAdd(u.accAdd(p.basicPrice, u.accAdd(p.adddPrice, u.accSub(p.addmPrice, u.accAdd(u.accAdd(p.subdPrice, p.submPrice), p.subcPrice)))), u.accAdd(p.accmPrice, p.accdPrice))));
                if (p.decoration && p.decoration.type == 1) total = Math.round(total);

                var options = {
                    'protation.pid': p.pid,
                    'protation.ppid': p.ppid,
                    'protation.preferPrice': preferPrice,
                    'protation.managePrice': _managePrice,
                    'protation.taxPrice': _taxPrice,
                    'protation.manageProfit': preferManage,
                    'protation.advanceProfit': preferAdvance,
                    'protation.manageDiscount': _manageDiscount,
                    'protation.totalCost': p.totalCost,
                    'protation.totalProfit': p.totalProfit,
                    'protation.totalPrice': total
                };

                if (preferAdvance > p.advanceProfit) {
                    // 特殊优惠超额 → 审批流
                    layer.close(idx);
                    layer.open({ type: 1, title: '优惠审批 - ' + v.name, content: $('#approveBox'), area: ['560px', 'auto'],
                        btn: ['提交审批', '取消'], yes: function (ai) {
                            var receiverId = $('input[name="approver"]:checked').val();
                            if (receiverId == null) { app.showAlert(app.error, '请选择审批人!'); return; }
                            var params = $.extend({}, {
                                'approval.receiver.userId': receiverId,
                                'approval.comment': $('#changeReason').val(),
                                'approvalProtationPrefer.pid': options['protation.pid'],
                                'approvalProtationPrefer.ppid': options['protation.ppid'],
                                'approvalProtationPrefer.preferPrice': options['protation.preferPrice'],
                                'approvalProtationPrefer.managePrefer': options['protation.manageProfit'],
                                'approvalProtationPrefer.advancePrefer': options['protation.advanceProfit'],
                                'approvalProtationPrefer.taxPrice': options['protation.taxPrice'],
                                'approvalProtationPrefer.totalPrice': options['protation.totalPrice']
                            }, options);
                            params['protation.advanceProfit'] = null;
                            params['protation.totalPrice'] = null;
                            app.post(api.approval.submitApprovalForProtationPrefer, params, function () {
                                app.showAlert(app.info, '操作成功');
                                layer.close(ai); query();
                            });
                        } });
                    return;
                }
                app.post(api.quotation.updateProtationForAdvance, options, function () {
                    app.showAlert(app.info, '操作成功');
                    layer.close(idx); query();
                });
            } });
    }

    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || 'views/decoration/decoration.html'); });
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    query(1);
});
}); // end app.ready
