/** app/js/quotation/protationPart.js —— 预签报价编辑
 *  装载：queryProtationByPid + queryProtationItemByPid（按 5 类分组：功能区/可选/个性/减项/赋能）；
 *  项编辑：updateProtationItem（piid 空=新增，公式求值数量，基础量下限校验）；删除 deleteProtationItem；
 *  添加：queryPresignItem 勾选批量提交；优惠：updateProtationForAdvance（特殊优惠超额 → submitApprovalForProtationPrefer）；
 *  打印：protationOutput 弹窗。头信息每次操作后按服务端返回刷新。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'element', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, element = layui.element, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var E = quotationCommon.ENUM;
    var u = app.utils;
    var qctx = qc.ctx('quotation') || {};
    var protation = qctx.protation || {};
    var orderId = qctx.orderId;
    var basicParams = null;
    var presignProduce = null;
    var areaData = [[], [], [], [], []];
    var pickState = { page: 1, rows: 10, total: 0 };

    var AREA_NAMES = ['功能区', '可选', '个性', '减项', '赋能'];

    function itemCols(t) {
        return [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'name', title: '名称', width: 170, fixed: 'left' },
            { field: 'type', title: '类型', width: 90, templet: function (d) { return E.protationItemType[d.type] != null ? E.protationItemType[d.type] : d.type; } },
            { field: 'onetype', title: '一类', width: 80, templet: function (d) { return E.protationItemOneType[d.onetype] != null ? E.protationItemOneType[d.onetype] : d.onetype; } },
            { field: 'basicNum', title: '基础量', width: 85, templet: function (d) { return qc.money(d.basicNum); } },
            { field: 'num', title: '数量', width: 90, edit: 'text', templet: function (d) { return qc.money(d.num); } },
            { field: 'price', title: '单价', width: 90, templet: function (d) { return qc.money(d.price); } },
            { field: 'addPrice', title: '增补价', width: 90, templet: function (d) { return qc.money(d.addPrice); } },
            { field: 'subPrice', title: '退减价', width: 90, templet: function (d) { return qc.money(d.subPrice); } },
            { field: 'cost', title: '成本', width: 90, templet: function (d) { return qc.money(d.cost); } },
            { field: 'total', title: '总额', width: 100, templet: function (d) { var areaCale = d.areaCale == 1 ? (protation.quoteArea || 1) : 1; return qc.money(u.changeThrDecimal(u.accMul(u.accMul(d.price, d.num), areaCale))); } },
            { title: '操作', width: 140, toolbar: '#rowToolbar' } ]];
    }
    for (var t = 0; t < 5; t++) {
        table.render({ elem: '#table' + t, data: [], page: false, limit: 1000, even: true, id: 'table' + t, cols: itemCols(t) });
        table.on('tool(table' + t + ')', (function (ti) {
            return function (obj) {
                var v = obj.data;
                if (obj.event === 'editNum') openNumEdit(v, ti);
                else if (obj.event === 'del') deleteItem(v, ti);
            };
        })(t));
        table.on('edit(table' + t + ')', (function (ti) {
            return function (obj) {
                var v = obj.data;
                updateItem(v, obj.value, ti, function () {}, function () { loadItems(); });
            };
        })(t));
    }

    // —— 装载 ——
    function load() {
        app.post(api.quotation.queryProtationByPid, { 'protation.pid': protation.pid }, function (res) {
            protation = res.protation;
            $('#proName').text(protation.name + ' (' + (protation.pid || '-') + ')');
            basicParams = {
                'protation.pid': protation.pid,
                'protation.ppid': protation.ppid,
                'protation.orderId': protation.decoration ? protation.decoration.orderId : orderId,
                'protation.preferPrice': protation.preferPrice,
                'protation.managePrice': protation.managePrice,
                'protation.taxPrice': protation.taxPrice,
                'protation.manageProfit': protation.manageProfit,
                'protation.advanceProfit': protation.advanceProfit,
                'protation.manageDiscount': protation.manageDiscount,
                'protation.activityProfit': protation.activityProfit,
                'protation.totalCost': protation.totalCost,
                'protation.totalProfit': protation.totalProfit,
                'protation.totalPrice': protation.totalPrice
            };
            drawHeader();
            loadItems();
        });
        app.post(api.quotation.queryPresignProduceByPpid, { 'presignProduce.ppid': protation.ppid }, function (res) { presignProduce = res.presignProduce; }, null, false);
        app.post(api.approval.queryApproverByType, { 'approver.type': 22 }, function (res) {
            var html = '';
            $.each(res.approvers || [], function (i, v) {
                html += '<div style="margin:2px 0;"><input type="radio" name="approver" value="' + v.userBase.userId + '" title="' + v.userBase.currentName + (v.comment ? ' (' + v.comment + ')' : '') + '"><\/div>';
            });
            $('#approveManSel').html(html);
            form.render();
        }, null, false);
    }
    function drawHeader() {
        $('#quotePrice').text(qc.money(u.accAdd(protation.quotePrice, protation.activityPrice)));
        $('#quoteArea').text(qc.money(protation.quoteArea));
        $('#preferPrice').text(qc.money(protation.preferPrice));
        $('#discount').text(protation.discount);
        $('#managePrice').text(qc.money(protation.managePrice));
        $('#manageProfit').text(qc.money(protation.manageProfit));
        $('#advanceProfit').text(qc.money(protation.advanceProfit));
        $('#activityProfit').text(qc.money(protation.activityProfit));
        $('#taxPrice').text(qc.money(protation.taxPrice));
        $('#totalPrice').text(qc.money(protation.totalPrice));
    }
    function loadItems() {
        app.post(api.quotation.queryProtationItemByPid, { 'protationItem.pid': protation.pid }, function (res) {
            areaData = [[], [], [], [], []];
            $.each(res.protationItems || [], function (i, v) {
                var type = (v.type + v.type % 2) / 2;
                if (v.type == 9) type = 1;        // 通用 → 可选
                else if (v.type == 11) type = 3;  // 减通 → 减项
                if (type >= 0 && type <= 4) areaData[type].push(v);
            });
            for (var t = 0; t < 5; t++) table.reload('table' + t, { data: areaData[t] });
        });
    }
    load();

    // —— 项数量编辑（公式求值） ——
    function evalNum(formula) {
        formula = (formula || '').replace(/\s+/g, '');
        if (formula === '') return null;
        if (/([\D][\.][\D])|([\d][\.][\D])|([\D][\.][\d])|(\.$)|(^\.)/.test(formula)) return null;
        try {
            var num = u.changeThrDecimal(eval(formula));
            if (num < 0 || num > 10000000) return null;
            return num;
        } catch (e) { return null; }
    }
    function updateItem(v, numInput, ti, ok, fail) {
        var num = evalNum(numInput);
        if (num == null) { app.showAlert(app.warning, '公式/数量非法'); if (fail) fail(); return; }
        if (v.type == 0 && num < v.basicNum) { app.showAlert(app.warning, '工程量不能小于基础数量'); if (fail) fail(); return; }
        var args = {
            'protationItem.piid': v.piid,
            'protationItem.name': v.name,
            'protationItem.price': v.price,
            'protationItem.num': num,
            'protationItem.type': v.type,
            'protationItem.areaCale': v.areaCale,
            'protationItem.basicNum': v.basicNum,
            'protationItem.addPrice': v.addPrice,
            'protationItem.subPrice': v.subPrice,
            'protationItem.achePrice': v.achePrice,
            'protationItem.cost': v.cost,
            'protationItem.onetype': v.onetype,
            'protationItem.atttype': v.atttype,
            'protationItem.ppiid': v.ppiid
        };
        app.post(api.quotation.updateProtationItem, $.extend({}, args, basicParams), function (res) {
            if (res.protation) { protation = $.extend({}, protation, res.protation); drawHeader(); }
            if (ok) ok(res);
            loadItems();
        }, function () { if (fail) fail(); loadItems(); });
    }
    function openNumEdit(v, ti) {
        $('#numInput').val(v.num);
        layer.open({ type: 1, title: '数量编辑 - ' + v.name, content: $('#numBox'), area: ['460px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                var val = $('#numInput').val();
                layer.close(idx);
                updateItem(v, val, ti);
            } });
    }
    function deleteItem(v, ti) {
        app.showConfirm('确定删除预签项: ' + v.name + '?', function () {
            app.post(api.quotation.deleteProtationItem, $.extend({ 'protationItem.piid': v.piid }, basicParams), function () {
                load(); loadItems();
            }, function () { loadItems(); });
        });
    }

    // —— 添加预签项 ——
    table.render({ elem: '#pickTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'checkbox', width: 40 },
            { field: 'name', title: '名称', width: 170 },
            { field: 'type', title: '类型', width: 80, templet: function (d) { return E.presignItemType[d.type] != null ? E.presignItemType[d.type] : d.type; } },
            { field: 'onetype', title: '一类', width: 80, templet: function (d) { return E.protationItemOneType[d.onetype] != null ? E.protationItemOneType[d.onetype] : d.onetype; } },
            { field: 'atttype', title: '业务类型', width: 90, templet: function (d) { return { 0: '通用', 1: '工程', 2: '主材' }[d.atttype] != null ? { 0: '通用', 1: '工程', 2: '主材' }[d.atttype] : d.atttype; } },
            { field: 'basicNum', title: '基础量', width: 85, templet: function (d) { return qc.money(d.basicNum); } },
            { field: 'price', title: '价格', width: 90, templet: function (d) { return qc.money(d.price); } },
            { field: 'cost', title: '成本', width: 90, templet: function (d) { return qc.money(d.cost); } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return qc.badge({ 0: '启用', 1: '禁用' }, d.status); } } ]] });
    $('#btnAddItem').on('click', function () {
        layer.open({ type: 1, title: '添加预签项（产品: ' + (presignProduce ? presignProduce.name : '-') + '）', content: $('#itemsBox'), area: ['950px', '80%'], success: function () { queryPick(1); } });
    });
    function queryPick(pg) {
        pickState.page = pg || 1;
        app.post(api.quotation.pagePresignItemByPpid, { 'presignItem.ppid': protation.ppid, 'paging.page': pickState.page, 'paging.rows': pickState.rows }, function (res) {
            var p = res.paging || {};
            table.reload('pickTable', { data: p.data || [] });
            pickState.total = p.totalRecords || 0;
            laypage.render({ elem: 'pickPagenation', count: pickState.total, curr: pickState.page, limit: pickState.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next'], jump: function (o, f) { pickState.rows = o.limit; if (!f) queryPick(o.curr); } });
        });
    }
    $('#btnSaveItems').on('click', function () {
        var cks = table.checkStatus('pickTable');
        if (!cks.data.length) { app.showAlert(app.warning, '请选择要添加的预签项'); return; }
        var count = 0, total = cks.data.length;
        $.each(cks.data, function (i, v) {
            var args = {
                'protationItem.piid': '',
                'protationItem.name': v.name,
                'protationItem.price': v.price,
                'protationItem.num': v.basicNum != null && v.basicNum !== '' ? v.basicNum : 0,
                'protationItem.type': v.type,
                'protationItem.areaCale': v.areaCale,
                'protationItem.basicNum': v.basicNum,
                'protationItem.addPrice': v.addPrice,
                'protationItem.subPrice': v.subPrice,
                'protationItem.achePrice': 0,
                'protationItem.cost': v.cost,
                'protationItem.onetype': v.onetype,
                'protationItem.atttype': v.atttype,
                'protationItem.ppiid': v.piid
            };
            app.post(api.quotation.updateProtationItem, $.extend({}, args, basicParams), function () {
                count++;
                if (count == total) { app.showAlert(app.success, '添加完成'); layer.closeAll(); loadItems(); }
            });
        });
    });

    // —— 优惠编辑（保存/审批） ——
    function evalFormula(formula, vars) {
        if (!formula || formula.indexOf('{') == -1) return formula;
        var s = formula.replace(/\{(a|b|c|d|e|f|g|h|i|j|k)\}/g, function (m, k) { return vars[k] != null ? vars[k] : 0; });
        try { var r = eval(s); return isNaN(r) ? 0 : r; } catch (e) { return 0; }
    }
    $('#btnSave').on('click', function () {
        $('#preferPrices').val(protation.preferPrice);
        $('#preferManage').val(protation.manageProfit);
        $('#preferAdvance').val(protation.advanceProfit);
        $('#activityProfit').val(protation.activityProfit);
        layer.open({ type: 1, title: '优惠编辑 - ' + protation.name, content: $('#preferBox'), area: ['500px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                var preferPrice = $('#preferPrices').val();
                var preferManage = $('#preferManage').val();
                var preferAdvance = $('#preferAdvance').val();
                var activityProfit = $('#activityProfit').val();
                var _quotePrice = u.accAdd(protation.quotePrice, protation.activityPrice);
                var discout = u.changeThrDecimal(u.accDiv(u.accSub(_quotePrice, preferPrice), _quotePrice));
                discout = discout < 0 ? 0 : discout > 1 ? 1 : discout;
                if (preferPrice > _quotePrice) { app.showAlert(app.warning, '优惠金额不合理'); return; }
                if (u.accMul(discout, 10) < protation.discount) { app.showAlert(app.warning, '优惠金额不合理'); return; }

                var manageVars = {
                    a: _quotePrice, b: preferPrice, c: protation.basicPrice,
                    d: u.accAdd(protation.adddPrice, protation.addmPrice),
                    e: u.accAdd(u.accAdd(protation.subdPrice, protation.submPrice), protation.subcPrice),
                    f: u.accAdd(protation.accmPrice, protation.accdPrice), h: preferAdvance
                };
                var _managePrice = u.changeThrDecimal(evalFormula(protation.manageFormula, manageVars));
                var taxVars = $.extend({}, manageVars, { g: _managePrice, h: preferAdvance, i: preferManage });
                var _manageDiscount = u.changeThrDecimal(u.accDiv(u.accSub(_managePrice, preferManage), _managePrice));
                _manageDiscount = _manageDiscount < 0 ? 0 : _manageDiscount > 1 ? 1 : _manageDiscount;
                if (preferManage > _managePrice) { app.showAlert(app.warning, '管理费优惠金额不合理'); return; }
                if (u.accMul(_manageDiscount, 10) < protation.manageDiscount) { app.showAlert(app.warning, '管理费优惠金额不合理'); return; }
                var _taxPrice = u.changeThrDecimal(evalFormula(protation.taxFormula, taxVars));
                var total = u.accSub(u.accSub(u.accSub(u.accSub(u.accAdd(u.accAdd(_quotePrice, _managePrice), _taxPrice), preferPrice), preferManage), preferAdvance), activityProfit);
                total = u.changeThrDecimal(u.accAdd(total, u.accAdd(u.accAdd(protation.basicPrice, u.accAdd(protation.adddPrice, u.accSub(protation.addmPrice, u.accAdd(u.accAdd(protation.subdPrice, protation.submPrice), protation.subcPrice)))), u.accAdd(protation.accmPrice, protation.accdPrice))));
                if (protation.decoration && protation.decoration.type == 1) total = Math.round(total);

                var options = {
                    'protation.pid': protation.pid,
                    'protation.ppid': protation.ppid,
                    'protation.preferPrice': preferPrice,
                    'protation.managePrice': _managePrice,
                    'protation.taxPrice': _taxPrice,
                    'protation.manageProfit': preferManage,
                    'protation.advanceProfit': preferAdvance,
                    'protation.manageDiscount': _manageDiscount,
                    'protation.activityProfit': activityProfit,
                    'protation.totalCost': protation.totalCost,
                    'protation.totalProfit': protation.totalProfit,
                    'protation.totalPrice': total
                };
                basicParams = $.extend({}, basicParams, options);

                if (preferAdvance > protation.advanceProfit) {
                    layer.close(idx);
                    layer.open({ type: 1, title: '优惠审批', content: $('#approveBox'), area: ['560px', 'auto'],
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
                                layer.close(ai);
                            });
                        } });
                    return;
                }
                app.post(api.quotation.updateProtationForAdvance, options, function () {
                    app.showAlert(app.info, '操作成功');
                    layer.close(idx); load();
                });
            } });
    });

    // —— 打印 ——
    $('#btnPrint').on('click', function () {
        app.params.quotation = $.extend({}, app.params.quotation, {
            protationId: protation.pid,
            protation: { printConf: { type: 31 } }
        });
        app.popup(api.index.protationOutputIndex.url, '打印预签', null, { area: ['85%', '90%'] });
    });

    $('#btnBack').on('click', function () {
        app.showConfirm('当前页面存在重要数据,是否进行当前操作', function () {
            app.switchPage(app.params.historyPage || 'views/quotation/protationIndex.html');
        });
    });
});
}); // end app.ready
