/** app/js/decoration/decoration.js —— 装修单主列表（核心枢纽页）
 *  pageConfig：url ?depage=xxx → queryDecorationFunctionRightByName 决定 apiPage/extraParam/pageBtn/nodes/hasExport。
 *  行按钮全集（按 pageBtn + 状态显隐）：查看/预签单/预签/回访/预放线/放线/合同/扣款/报价单/扩展项/定额单/选材项/
 *  增减项/工程单/详情/决算/画像/服务/推荐/装修活动/销售活动/废单/签约/终止(审批|直终)/重签/内决/保修/工程终止/隐藏。
 *  工具栏：创建/多单/国补（popup decoration2create）/导出（Excel → layui table.exportFile）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'element', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var E = decorationCommon.ENUM;
    var depage = (app.params.urlLoadParams && app.params.urlLoadParams.depage) || 'general';
    var pageConfig = decorationCommon.getPageConfig(depage);
    var state = { page: 1, rows: 10, total: 0, lastData: [] };

    ['createTime', 'measureTime', 'depositTime', 'precontractTime', 'signTime'].forEach(function (id) {
        decorationCommon.dateRange('#' + id);
    });

    // 默认接口兜底（权限接口未配置时）
    if (!pageConfig.apiPage) pageConfig.apiPage = api.decoration.pageDecorationForGeneral;

    // 按钮可见性（pageBtn.contains）
    var PBTN = pageConfig.pageBtn || [];
    function hasBtn(name) { return PBTN.indexOf(name) != -1; }

    // 工具栏
    if (hasBtn('create')) $('#btnCreate').show();
    if (hasBtn('createAdvance')) $('#btnCreateAdvance').show();
    if (hasBtn('createCountry')) $('#btnCreateCountry').show();
    if (pageConfig.hasExport != null && pageConfig.hasExport !== '') $('#btnExport').show();

    // —— 表格 ——
    function money(v) { return app.formatMoney(v); }
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'orderId', title: '装修单号', width: 120, fixed: 'left' },
            { field: 'village', title: '楼盘', width: 110, fixed: 'left', templet: function (d) { return d.house && d.house.village ? d.house.village.name : ''; } },
            { field: 'houseNumber', title: '楼号', width: 80, templet: function (d) { return d.house ? d.house.houseNumber : ''; } },
            { field: 'customer', title: '客户', width: 80, templet: function (d) { return d.customer ? d.customer.name : ''; } },
            { field: 'designDept', title: '设计部', width: 110, templet: function (d) { return d.designer && d.designer.dept ? d.designer.dept.name : ''; } },
            { field: 'designer', title: '设计师', width: 80, templet: function (d) { return d.designer ? d.designer.currentName : ''; } },
            { field: 'salesDept', title: '业务部', width: 110, templet: function (d) { return d.salesman && d.salesman.dept ? d.salesman.dept.name : ''; } },
            { field: 'salesman', title: '业务员', width: 80, templet: function (d) { return d.salesman ? d.salesman.currentName : ''; } },
            { field: 'buildArea', title: '建筑面积', width: 90, templet: function (d) { return d.house ? d.house.buildArea : ''; } },
            { field: 'innerArea', title: '计价面积', width: 90, templet: function (d) { return d.house ? d.house.innerArea : ''; } },
            { field: 'factPrice', title: '实收额', width: 95, templet: function (d) { return money(d.factPrice); } },
            { field: 'precontractPrice', title: '预签额', width: 95, templet: function (d) { return money(d.precontractPrice); } },
            { field: 'orderTotalPrice', title: '合同报价', width: 100, templet: function (d) { return money(d.orderTotalPrice); } },
            { field: 'quotationPrice', title: '报价额', width: 95, templet: function (d) { return money(d.quotationPrice); } },
            { field: 'couponCut', title: '券优惠', width: 85, templet: function (d) { return money(d.couponCut); } },
            { field: 'thingCut', title: '物品优惠', width: 90, templet: function (d) { return money(d.thingCut); } },
            { field: 'measureTime', title: '量房时间', width: 100, templet: function (d) { return (d.measureTime || '').substring(0, 10); } },
            { field: 'precontractTime', title: '预签时间', width: 100, templet: function (d) { return (d.precontractTime || '').substring(0, 10); } },
            { field: 'contractTime', title: '签单时间', width: 100, templet: function (d) { return (d.contractTime || '').substring(0, 10); } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return decorationCommon.badge(E.status, d.status); } },
            { field: 'designStatus', title: '设计状态', width: 85, templet: function (d) { return E.designStatus[d.designStatus] != null ? E.designStatus[d.designStatus] : ''; } },
            { field: 'projectStatus', title: '工程状态', width: 85, templet: function (d) { return E.projectStatus[d.projectStatus] != null ? E.projectStatus[d.projectStatus] : ''; } },
            { field: 'typeness', title: '订单类型', width: 85, templet: function (d) { return E.typeness[d.typeness] != null ? E.typeness[d.typeness] : ''; } },
            { field: 'busitypeName', title: '业务类型', width: 100, templet: function (d) { return d.busitype ? (d.busitype.name || '') : ''; } },
            { title: '操作', width: 460, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    // —— 动态行按钮（按 pageBtn + 状态）——
    var st = function (v) { return parseInt(v.status, 10); };
    var BTNS = [];
    function reg(ev, name, show, handle) { BTNS.push({ ev: ev, name: name, show: show, handle: handle }); }

    reg('view', '查看', function (v) { return hasBtn('view'); }, function (v) {
        decorationCommon.passDetailCtx(v);
        app.params.decoration.viewNode = Object.keys(pageConfig.nodes || {}).map(function (k) { return pageConfig.nodes[k]; });
        app.switchPage(api.index.decorationDetailIndex.url);
    });
    reg('prosign', '预签单', function (v) { return hasBtn('prosign') && [0, 1].indexOf(st(v)) != -1; }, function (v) {
        app.params.quotation = $.extend({}, app.params.quotation, { orderId: v.orderId });
        app.params.historyPage = api.index.decorationIndex.url;
        app.switchPage('views/quotation/protationIndex.html');
    });
    reg('pcontract', '预签', function (v) { return hasBtn('pcontract') && [0, 1].indexOf(st(v)) != -1; }, function (v) {
        app.showConfirm('确定进行预签', function () {
            app.post(api.decoration.presignDecorationContract, { 'decoration.orderId': v.orderId }, function () { query(state.page); });
        });
    });
    reg('presignprepare', '预签准备', function (v) { return hasBtn('presignprepare') && [0, 1].indexOf(st(v)) != -1; }, function (v) {
        openSignPrepare(v, 'presign');
    });
    reg('revie', '回访', function () { return hasBtn('revie'); }, function (v) {
        app.params.decoration = $.extend({}, app.params.decoration, { orderId: v.orderId });
        app.params.historyPage = api.index.decorationIndex.url;
        app.switchPage(api.index.decorationBackVisitIndex.url);
    });
    reg('price', '报价单', function (v) { return hasBtn('price') && [0, 1, 2, 4].indexOf(st(v)) != -1; }, function (v) {
        app.params.quotation = $.extend({}, app.params.quotation, { orderId: v.orderId, orderType: v.type, orderTypeness: v.typeness });
        app.params.historyPage = api.index.decorationIndex.url;
        app.switchPage(api.index.quotationIndex.url);
    });
    reg('extension', '扩展项', function (v) { return hasBtn('extension') && [0, 1, 2, 3, 4, 8].indexOf(st(v)) != -1; }, function (v) {
        app.params.quotation = $.extend({}, app.params.quotation, { orderId: v.orderId });
        app.params.historyPage = api.index.decorationIndex.url;
        app.switchPage(api.index.extensionIndex.url);
    });
    reg('normPart', '定额单', function () { return hasBtn('normPart'); }, function (v) {
        app.params.quotation = $.extend({}, app.params.quotation, { orderId: v.orderId, editFlg: false });
        app.params.historyPage = api.index.decorationIndex.url;
        app.switchPage(api.index.normPart.url);
    });
    reg('selection', '选材项', function () { return hasBtn('selection'); }, function (v) {
        app.params.quotation = $.extend({}, app.params.quotation, { orderId: v.orderId });
        app.params.historyPage = api.index.decorationIndex.url;
        app.switchPage(api.index.selectionPartIndex.url);
    });
    reg('btnAddReduce', '增减项', function (v) { return hasBtn('btnAddReduce') && [3, 7, 8].indexOf(st(v)) != -1; }, function (v) {
        app.params.quotation = $.extend({}, app.params.quotation, { orderId: v.orderId, orderType: v.type, orderTypeness: v.typeness, pageType: null });
        app.params.historyPage = api.index.decorationIndex.url;
        app.switchPage(api.index.addReduceIndex.url);
    });
    reg('consche', '工程单', function (v) { return hasBtn('consche') && [0, 1, 2, 3, 4, 8].indexOf(st(v)) != -1; }, function (v) {
        app.params.construction = $.extend({}, app.params.construction, { orderId: v.orderId });
        app.popup('views/construction/supervision4detail.html', '查看', null, { area: ['95%', '90%'] });
    });
    reg('scal', '扣款', function () { return hasBtn('scal'); }, function (v) {
        app.params.decoration = $.extend({}, app.params.decoration, { orderId: v.orderId, auditStatusType: 'select' });
        app.params.historyPage = api.index.decorationIndex.url;
        app.switchPage(api.index.decorationAuditRecordIndex.url);
    });
    reg('info', '详情', function () { return hasBtn('info'); }, function (v) {
        app.params.decoration = $.extend({}, app.params.decoration, { orderId: v.orderId });
        app.params.historyPage = api.index.decorationIndex.url;
        app.switchPage(api.index.decorationTimelineIndex.url);
    });
    reg('cal', '决算', function (v) { return hasBtn('cal') && [3, 7, 8].indexOf(st(v)) != -1; }, function (v) {
        app.params.decoration = $.extend({}, app.params.decoration, { orderId: v.orderId, typeness: v.typeness, status: v.status });
        app.params.decoration.viewNode = [{ type: 'account', opt: { btn: ['accountPrint', 'btnAccountPrint'] } }];
        app.params.historyPage = api.index.decorationIndex.url;
        app.switchPage(api.index.decorationFinalSettlementIndex.url);
    });
    reg('profile', '画像', function () { return hasBtn('profile'); }, function (v) {
        app.params.customer = $.extend({}, app.params.customer, { orderId: v.orderId, profile: { orderId: v.orderId } });
        app.popup('views/customer/customerProfile4detail.html', '客户画像');
    });
    reg('services', '服务', function () { return hasBtn('services'); }, function (v) {
        app.params.decoration = $.extend({}, app.params.decoration, { orderId: v.orderId });
        app.params.historyPage = api.index.decorationIndex.url;
        app.popup(api.index.decorationServiceIndex.url, '装修单服务: ' + v.orderId);
    });
    reg('refer', '推荐', function () { return hasBtn('refer'); }, function (v) {
        app.params.decoration = $.extend({}, app.params.decoration, { orderId: v.orderId });
        app.params.historyPage = api.index.decorationIndex.url;
        app.popup(api.index.decorationReferIndex.url, '装修推荐: ' + v.orderId);
    });
    reg('activity', '装修活动', function () { return hasBtn('activity'); }, function (v) {
        app.params.decoration = $.extend({}, app.params.decoration, { orderId: v.orderId });
        app.popup(api.index.decorationActivityItemIndex.url, '装修活动', null, { area: ['95%', '90%'] });
    });
    reg('sctivity', '销售活动', function () { return hasBtn('sctivity'); }, function (v) {
        app.params.decoration = $.extend({}, app.params.decoration, { orderId: v.orderId });
        app.popup('views/sales/sales4activity.html', '销售活动', null, { area: ['95%', '90%'] });
    });
    reg('contract', '合同', function (v) { return (hasBtn('contract') || hasBtn('contractc')) && [0, 1, 2, 3, 4, 7, 8].indexOf(st(v) % 10) != -1; }, function (v) {
        app.params.decoration = $.extend({}, app.params.decoration, { orderId: v.orderId, cid: v.customer ? v.customer.cid : '' });
        app.params.urlLoadParams = $.extend({}, app.params.urlLoadParams, { showtype: hasBtn('contractc') && !hasBtn('contract') ? 'design' : 'advance' });
        app.params.historyPage = api.index.decorationIndex.url;
        app.switchPage(api.index.decorationContractIndex.url);
    });
    reg('delete', '废单', function (v) { return hasBtn('delete') && [3, 5, 6].indexOf(st(v)) == -1; }, function (v) {
        app.showConfirm('确认废单吗?', function () {
            app.post(api.decoration.obsoleteDecoration, { 'decoration.orderId': v.orderId }, function () {
                app.showAlert(app.success, '操作成功'); query(state.page);
            });
        });
    });
    reg('sign', '签约', function (v) { return hasBtn('sign') && [1, 2, 4].indexOf(st(v)) != -1; }, function (v) {
        signOrder(v);
    });
    reg('signprepare', '签约准备', function (v) { return hasBtn('signprepare') && [1, 2, 4].indexOf(st(v)) != -1; }, function (v) {
        openSignPrepare(v, 'sign');
    });
    reg('resign', '重签', function (v) { return hasBtn('resign') && st(v) == 3; }, function (v) {
        app.showConfirm('确认要重签合同吗?', function () {
            app.post(api.decoration.resignDecorationContract, { 'decorationContract.orderId': v.orderId }, function () {
                app.showAlert(app.success, '操作成功'); query(state.page);
            });
        });
    });
    reg('terminal', '终止', function (v) { return hasBtn('terminal') && [2, 3].indexOf(st(v)) != -1; }, function (v) {
        terminalOrder(v);
    });
    reg('terminal1', '终止', function (v) { return hasBtn('terminal1') && [32, 33].indexOf(st(v)) != -1; }, function (v) {
        terminalFinish(v);
    });
    reg('balance', '内决', function () { return hasBtn('balance'); }, function (v) {
        app.showConfirm('确认要内决吗?', function () {
            app.post(api.decoration.makeDecorationBalance, { 'decorationBalance.decoration.orderId': v.orderId, 'decorationBalance.balance': 0 }, function () {
                app.showAlert(app.success, '内决成功');
            });
        });
    });
    reg('repair', '保修', function () { return hasBtn('repair'); }, function (v) { repairOrder(v); });
    reg('terminalStatus', '工程终止', function () { return hasBtn('terminalStatus'); }, function (v) { terminalStatusOrder(v); });
    reg('hidden', '隐藏', function () { return hasBtn('hidden'); }, function (v) {
        app.post(api.decoration.hiddenDecoration, { 'decoration.orderId': v.orderId }, function () {
            app.showAlert(app.success, '操作成功'); query(state.page);
        });
    });
    reg('proline', '预放线', function () { return hasBtn('proline'); }, function (v) { pretreatOrder(v); });
    reg('line', '放线', function () { return hasBtn('line'); }, function (v) { app.showAlert(app.info, '放线排期请使用"放线排期"页（decorationMeasure）'); });

    // 行工具条渲染
    table.on('tool(resultTable)', function (obj) {
        var ev = obj.event, v = obj.data;
        for (var i = 0; i < BTNS.length; i++) {
            if (BTNS[i].ev === ev) { BTNS[i].handle(v); return; }
        }
    });

    // —— 查询 ——
    function query(pg) {
        state.page = pg || 1;
        var filters = decorationCommon.buildFilters($('#searchForm'));
        var extra = {};
        $.each(pageConfig.extraParam || [], function (i, v) { extra['statusas[' + i + ']'] = v; });
        if (pageConfig.companyType != null) extra['companyType'] = pageConfig.companyType[0];
        app.post(pageConfig.apiPage, $.extend({}, filters, extra, { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            var data = p.data || [];
            state.lastData = data;
            renderToolbar(data.length ? data[0] : {});
            table.reload('resultTable', { data: data });
            state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    // 按当前行状态动态生成工具条模板
    function renderToolbar(sample) {
        var html = '';
        $.each(BTNS, function (i, b) {
            if (b.show(sample)) html += '<button class="layui-btn layui-btn-xs" lay-event="' + b.ev + '">' + b.name + '<\/button>';
        });
        $('#rowToolbar').html(html);
    }

    // —— 签约 ——
    function signOrder(v) {
        var decoration = null;
        app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': v.orderId }, function (res) {
            decoration = res.decoration || {};
            app.post(api.quotation.queryQuotationForDefaultByOrderId, { 'quotation.orderId': v.orderId }, function (r) {
                var q = r.quotation || {};
                if (q.qid == null) { app.showAlert(app.error, '报价不存在'); return; }
                var contract = app.utils.accAdd(app.utils.accAdd(app.utils.accMul(q.disPrice, 0.88), q.undisPrice), app.utils.accAdd(q.trafficPrice, q.managePrice));
                var notpoint = 0;
                if (v.notSalesmanRate > 0 && v.notSalesmanRate < 1) {
                    notpoint = app.utils.accMul(app.utils.accAdd(app.utils.accAdd(q.disPrice, q.undisPrice), q.trafficPrice), v.notSalesmanRate);
                } else { notpoint = v.notSalesmanRate; }
                var offer = app.utils.accAdd(v.couponCut, v.thingCut);
                var netperfor = app.utils.accSub(app.utils.accSub(v.orderTotalPrice, offer), notpoint);
                var comperfor = app.utils.changeTwoDecimal(app.utils.accDiv(app.utils.accAdd(app.utils.accSub(app.utils.accMul(app.utils.accSub(contract, notpoint), 0.38), offer), app.utils.accSub(v.orderTotalPrice, contract)), 0.38));
                $('#signCoupon').text('券优惠 : ' + app.formatMoney(v.couponCut));
                $('#signThing').text('物品优惠 : ' + app.formatMoney(v.thingCut));
                $('#signNetperfor').val(netperfor);
                $('#signComperfor').val(comperfor);
                app.post(api.system.queryCompanyByCid, { 'company.cid': decoration.conpany }, function (rc) {
                    $('#signCompanyName').text(rc.company ? rc.company.name : '');
                });
                layer.open({ type: 1, title: '签约 - ' + v.orderId, content: $('#signBox'), area: ['520px', 'auto'],
                    btn: ['签单', '取消'], yes: function (idx) {
                        var doSign = function () {
                            app.post(api.decoration.signDecorationContract, { 'decoration.orderId': v.orderId, 'decoration.dompany': 0 }, function () {
                                app.showAlert(app.success, '确认成功');
                                layer.close(idx); query(state.page);
                            });
                        };
                        if (app.utils.accSub(v.orderTotalPrice, q.totalPrice) > 100) {
                            app.showConfirm('合同金额与报价金额相差大于100, 确认签单?', doSign);
                        } else {
                            app.showConfirm('确认签单?', doSign);
                        }
                    } });
            }, function () { app.showAlert(app.error, '报价不存在'); });
        });
    }

    // —— 签约准备弹窗: 缓存行数据, app.popup 加载准备台(iframe) ——
    function openSignPrepare(v, mode) {

        app.params.signPrepareRow = v;
        app.params.signPrepare = {
            orderId: v.orderId,
            mode: mode,
            cid: v.customer ? v.customer.cid : ''
        };

        app.popup(api.index.decorationSignPrepareIndex.url, (mode == 'presign' ? '预签准备' : '签约准备') + ' - ' + v.orderId, null, {
            area: ['85%', '85%'],
            end: function () { query(state.page); }
        });
    }

    // —— 签约准备弹窗事件桥: 子页 iframe 触发到宿主 document, 确认签约/预签与页面跳转复用本页既有链路 ——
    $(document).on('decoration:signprepare', function (e, data) {

        layer.closeAll();

        var row = app.params.signPrepareRow;

        if (data.action == 'sign') {

            signOrder(row);

        } else if (data.action == 'presign') {

            app.showConfirm('确定进行预签', function () {
                app.post(api.decoration.presignDecorationContract, { 'decoration.orderId': row.orderId }, function () { query(state.page); });
            });

        }
    });

    // —— 终止（可终止状态：直终）——
    function terminalFinish(v) {
        var backup = 0, paymentInfo = '';
        app.post(api.payment.queryAdvancePaymentByOrderId, { 'advancePayment.decoration.orderId': v.orderId }, function (res) {
            paymentInfo += '合同: ' + res.balanceAdvance + '<br>';
            backup = app.utils.accAdd(backup, res.balanceAdvance);
            $('#advancePaymentText').html(paymentInfo);
        }, null, false);
        app.post(api.decoration.pointDecorationActivityItem, { 'decoration.orderId': v.orderId }, function (res) {
            $('#decorationActivityAmountText').text('积分兑换金额: ' + (res.amount || 0) + '元');
        }, null, false);
        app.post(api.payment.queryDecorationPaymentForContractByOrderId, { 'decorationPayment.decoration.orderId': v.orderId }, function (res) {
            var info = '';
            $.each(res.decorationPayments || [], function (i, p) {
                if (p.paymentStatus == 1 || p.paymentStatus == 2) {
                    info += p.paymentType + ':' + p.referMoney + '<br>';
                    backup = app.utils.accAdd(backup, p.referMoney);
                }
            });
            $('#terminalStatusText').text(E.status[v.status] || v.status);
            $('#terminalPrecontractPrice').val(v.precontractPrice);
            $('#decorationPaymentInfoText').html(info || '无付款信息');
            $('#terminalBackup').val(0);
            layer.open({ type: 1, title: '合同终止 - ' + v.orderId, content: $('#terminalBox'), area: ['560px', 'auto'],
                btn: ['终止', '取消'], yes: function (idx) {
                    var payments = {};
                    var bv = $.trim($('#terminalBackup').val());
                    if (bv !== '') { payments['decorationPayments[0].referMoney'] = bv; }
                    app.post(api.decoration.terminalDecoration, $.extend({ 'decoration.orderId': v.orderId, 'decoration.precontractPrice': $('#terminalPrecontractPrice').val() }, payments), function () {
                        app.showAlert(app.success, '操作成功');
                        layer.close(idx); query(state.page);
                    });
                } });
        }, null, false);
    }

    // —— 终止（审批）——
    function terminalOrder(v) {
        app.showConfirm('终止需提交审批，确认发起合同终止审批?', function () {
            app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': v.orderId }, function (res) {
                var d = res.decoration || {};
                app.post(api.approval.submitApprovalForDecorationTerminal, {
                    'approvalDecoration.orderId': v.orderId,
                    'approvalDecoration.status': d.status,
                    'approvalDecoration.precontractPrice': d.precontractPrice,
                    'approvalDecoration.orderTotalPrice': d.orderTotalPrice,
                    'approvalDecoration.factPrice': d.factPrice,
                    'forms': JSON.stringify([
                        { name: '装修单', value: v.orderId },
                        { name: '状态', value: E.status[d.status] != null ? E.status[d.status] : d.status },
                        { name: '预签额', value: d.precontractPrice },
                        { name: '签单额', value: d.orderTotalPrice },
                        { name: '实收额', value: d.factPrice }
                    ])
                }, function () {
                    app.showAlert(app.success, '审批已提交');
                    query(state.page);
                });
            });
        });
    }

    // —— 保修 ——
    function repairOrder(v) {
        layer.open({ type: 1, title: '保修 - ' + v.orderId, content: $('#repairBox'), area: ['440px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                app.post(api.decoration.changeDecorationForRepairStatus, { 'decoration.orderId': v.orderId, 'decoration.repairStatus': $('#repairStatus').val() }, function () {
                    app.showAlert(app.success, '操作成功');
                    layer.close(idx); query(state.page);
                });
            } });
    }

    // —— 工程终止 ——
    function terminalStatusOrder(v) {
        layer.open({ type: 1, title: '工程终止 - ' + v.orderId, content: $('#terminalStatusBox'), area: ['440px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                app.post(api.construction.queryConstructionByOrderId, { 'construction.orderId': v.orderId }, function (res) {
                    app.post(api.construction.updateConstructionByCid, { 'construction.cid': res.construction.cid, 'construction.terminalStatus': $('#updateTerminalStatus').val() }, function () {
                        app.showAlert(app.success, '操作成功');
                        layer.close(idx); query(state.page);
                    });
                });
            } });
    }

    // —— 预放线（施工节点工期设置）——
    function pretreatOrder(v) {
        app.post(api.data.queryConstructionNode, {}, function (res) {
            var nodes = (res.constructionNodes || []).sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); });
            var html = '<div class="layui-form" style="padding:15px 25px;max-height:400px;overflow:auto;">';
            $.each(nodes, function (i, n) {
                html += '<div class="layui-form-item"><label class="layui-form-label">' + n.name + '<\/label>'
                    + '<div class="layui-input-inline"><input class="layui-input nodePeriod" data-cnid="' + n.cnid + '" value="' + (n.timeLimit != null ? n.timeLimit : '') + '" placeholder="工期"><\/div><\/div>';
            });
            html += '<\/div>';
            // 面积匹配默认工期
            app.post(api.data.queryConstructionPace, { 'constructionPace.lowerArea': v.house ? v.house.innerArea : '' }, function (rp) {
                var period = rp.constructionPeriod;
                if (period && period.cpid) {
                    app.post(api.data.queryConstructionPaceNode, { 'constructionPeriodNode.cpid': period.cpid }, function (rn) {
                        $.each(rn.constructionPeriodNodes || [], function (i, pn) {
                            $('.nodePeriod[data-cnid="' + pn.constructionNode.cnid + '"]').val(pn.period);
                        });
                    }, null, false);
                }
            }, null, false);
            layer.open({ type: 1, title: '预放线 - ' + v.orderId, content: html, area: ['480px', '80%'],
                btn: ['提交', '取消'], yes: function (idx) {
                    var opts = { 'constructionInfo.orderId': v.orderId, 'constructionInfo.decoration.orderId': v.orderId };
                    var cnids = [], periods = [];
                    $('.nodePeriod').each(function () {
                        if ($(this).val() !== '') { cnids.push($(this).data('cnid')); periods.push($(this).val()); }
                    });
                    opts['constructionInfo.constructionNodes'] = cnids.join(',');
                    opts['constructionInfo.constructionPeriods'] = periods.join(',');
                    app.post(api.construction.pretreatDrawLine, opts, function () {
                        app.showAlert(app.success, '操作成功');
                        layer.close(idx);
                    });
                } });
        });
    }

    // —— 工具栏 ——
    function openCreateOrder(title, options) {
        var lp = $.extend({}, app.params.urlLoadParams || {}, options || {});
        app.params.urlLoadParams = lp;
        app.popup(api.index.createOrderIndex.url, title, null, { area: ['95%', '90%'], end: function () { query(1); } });
    }
    $('#btnCreate').on('click', function () { openCreateOrder('创建装修单', { maketype: null, entrytype: null }); });
    $('#btnCreateAdvance').on('click', function () { openCreateOrder('创建多单', { maketype: 'advance' }); });
    $('#btnCreateCountry').on('click', function () { openCreateOrder('创建国补', { entrytype: 'country' }); });

    // 导出（layui exportFile，值格式化）
    $('#btnExport').on('click', function () {
        if (!state.total) { app.showAlert(app.warning, '请通过条件进行查询'); return; }
        if (state.total > 200) { app.showAlert(app.warning, '查询结果大于阀值 , 不能完成导出动作'); return; }
        app.post(pageConfig.apiPage, $.extend({}, decorationCommon.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': 200, 'paging.noPage': 1 }), function (res) {
            var data = (res.paging || {}).data || [];
            $.each(data, function (i, v) {
                v.status = E.status[v.status] != null ? E.status[v.status] : v.status;
                v.projectStatus = E.projectStatus[v.projectStatus] != null ? E.projectStatus[v.projectStatus] : v.projectStatus;
                v.typeness = E.typeness[v.typeness] != null ? E.typeness[v.typeness] : v.typeness;
                v.busitype = v.busitype ? (v.busitype.name || '') : '';
                if ([2, 3, 4, 6, 7].indexOf(parseInt(v.status, 10)) == -1 && v.house) v.house.houseNumber = '';
            });
            table.exportFile('resultTable', data, 'csv', '装修单');
        });
    });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    query(1);
});
}); // end app.ready
