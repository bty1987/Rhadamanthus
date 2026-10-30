/** app/js/decoration/decoration4sign.js —— 签约准备（订单维度：前置条件检查+就地轻操作）
 *  上下文：(parent.app.params.signPrepare) || (app.params.signPrepare) = { orderId, mode, cid }。
 *  数据层=同步串行拼装既有接口（与老版同构）；轻操作全部就地完成（v3.1: 报价构成展示/换活动/
 *  合同公司签+查看/预签报价就地锁定，收款与审批不就地——收款跳装修款页，审批仅提示）。
 *  确认签约/预签触发 parent 的 decoration:signprepare 事件桥，复用宿主页链路。
 *  审批不展示不判定(pageApproval 系操作人视角非装修单归属口径)，签约硬拦由后端 140037 兜底。
 *  硬条件口径与 signDecorationContract / presignDecorationContract 后端校验零漂移。 */
app.ready(function () {
layui.use(['layer', 'form', 'laydate', 'jquery'], function () {
    var layer = layui.layer, form = layui.form, laydate = layui.laydate, $ = layui.jquery;

    var ctx = (window.parent && window.parent.app && window.parent.app.params.signPrepare) || app.params.signPrepare || {};

    var orderId = ctx.orderId;
    var mode = ctx.mode || 'sign';
    var cid = ctx.cid;

    var data = null;
    var info = null;

    var DECORATION_STATUS = { 0: '初始', 1: '定金', 2: '预签', 3: '签约', 4: '重签', 5: '废单', 6: '终止', 7: '决算', 8: '完工', 20: '待审中', 30: '可终止', 32: '预签可终止', 33: '签约可终止' };
    var QUOTATION_STATUS = { 0: '初始', 1: '锁定', 2: '审批' };
    var QUOTATION_ATTSTATUS = { 1: '提交', 2: '审核', 3: '完成' };
    var CONTRACT_STATUS = { 0: '待签', 1: '已签', 2: '无效', 3: '归档' };
    var PROTATION_STATUS = { 0: '初始', 2: '锁定', 3: '审批' };
    var PAYMENT_STATUS = ['未付款', '已付款', '已确认', '审批中', '历史'];

    $('#pageTitle').text(mode == 'presign' ? '预签准备' : '签约准备');

    if (!orderId) { app.showAlert(app.warning, '缺少订单上下文'); return; }

    laydate.render({ elem: '#drawlineTime' });
    laydate.render({ elem: '#applayTime' });

    queryData();

    // 数据拼装: 全部走既有接口(与后端聚合口径一致), 同步串行取数
    function queryData() {

        var d = {};

        app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
            var decoration = res.decoration || {};
            d.orderId = decoration.orderId;
            d.status = decoration.status;
            d.orderTotalPrice = decoration.orderTotalPrice;
            d.customerName = decoration.customer ? decoration.customer.name : null;
            d.houseNumber = decoration.house ? decoration.house.houseNumber : null;
            d.villageName = decoration.house && decoration.house.village ? decoration.house.village.name : null;
            d.designerName = decoration.designer ? decoration.designer.currentName : null;
        }, function () { app.showAlert(app.error, '装修单不存在'); }, false);

        if (d.status == undefined) return;

        // 款项: 与签约校验同源接口(收款+合同款+已付款/已确认)
        d.paymentReady = false;
        d.paymentMoney = 0;

        app.post(api.payment.queryDecorationPaymentForContractByOrderId, { 'decorationPayment.decoration.orderId': orderId }, function (res) {
            var payments = res.decorationPayments || [];
            $.each(payments, function (i, p) { d.paymentMoney = app.utils.accAdd(d.paymentMoney, p.referMoney || 0); });
            d.paymentReady = payments.length > 0;
        }, null, false);

        // 款项明细(全单款项行, 就地展示)
        d.payments = [];

        app.post(api.payment.queryDecorationPaymentByOrderId, { 'decorationPayment.decoration.orderId': orderId }, function (res) {
            d.payments = (res.decorationPayments || []).sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); });
        }, null, false);

        // 报价: 默认报价
        d.quotationReady = false;

        app.post(api.quotation.queryQuotationForDefaultByOrderId, { 'quotation.orderId': orderId }, function (res) {
            var q = res.quotation || {};
            if (q.qid != null) {
                d.quotationReady = true;
                d.quotationQid = q.qid;
                d.quotationStatus = q.status;
                d.quotationAttstatus = q.attstatus;
                d.quotationTotalPrice = q.totalPrice;
                d.quotationVersionName = q.version ? q.version.name : null;
                d.quotationPriceParts = '优惠内 ' + (q.disPrice || 0) + ' / 优惠外 ' + (q.undisPrice || 0) + ' / 运费 ' + (q.trafficPrice || 0) + ' / 管理费 ' + (q.managePrice || 0);
            }
        }, function () {}, false);

        // 活动: 存在任一未锁定行即视为未锁定(预签同口径)
        d.activityStatus = -1;

        app.post(api.decoration.queryDecorationActivityByOrderId, { 'decorationActivity.orderId': orderId }, function (res) {
            var activitys = res.decorationActivitys || [];
            if (activitys.length > 0) {
                d.activityStatus = 1;
                $.each(activitys, function (i, a) {
                    if (a.daId) d.activityDaId = a.daId;
                    if (a.activity) { d.activityName = a.activity.name; d.activityEndTime = a.activity.endTime; }
                    if (a.status == 0) d.activityStatus = 0;
                });
            }
        }, null, false);

        // 合同: 取最新创建一份的状态
        d.contractStatus = -1;
        d.contractCount = 0;

        app.post(api.decoration.queryDecorationContractByOrderId, { 'decorationContract.orderId': orderId }, function (res) {
            var contracts = res.decorationContracts || [];
            d.contractCount = contracts.length;
            var latest = null;
            $.each(contracts, function (i, c) { if (!latest || c.dcid > latest.dcid) latest = c; });
            if (latest != null) {
                d.contractStatus = latest.status;
                d.contractDcid = latest.dcid;
                d.comsignTime = latest.comsignTime;
                d.cussignTime = latest.cussignTime;
            }
        }, null, false);

        // 工程信息: 预计放线时间
        d.constructionInfoReady = false;

        app.post(api.construction.queryConstructionInfoByOrderId, { 'constructionInfo.orderId': orderId }, function (res) {
            if (res.constructionInfo && res.constructionInfo.orderId) {
                d.constructionInfoReady = true;
                d.drawlineTime = res.constructionInfo.drawlineTime;
            }
        }, function () {}, false);

        // 预签报价
        d.protationStatus = -1;

        app.post(api.quotation.queryProtationForDefaultByOrderId, { 'protation.orderId': orderId }, function (res) {
            var protation = res.protation || {};
            if (protation.pid != null) {
                d.protationPid = protation.pid;
                d.protationStatus = protation.status;
                d.protationTotalPrice = protation.totalPrice;
            }
        }, function () {}, false);

        // 就绪汇总: 与 sign/presign 校验零漂移
        d.signReady = [0, 1, 2, 4].indexOf(d.status) != -1 && d.paymentReady && d.quotationReady && d.constructionInfoReady && d.drawlineTime != null;
        d.presignReady = [0, 1, 2].indexOf(d.status) != -1 && d.activityStatus == 1 && d.protationStatus == 2;

        data = d;

        renderSummary();
        renderCheckList();
        renderActionRow();
    }

    function renderSummary() {

        var badgeColor = { 0: '#1E9FFF', 1: '#1E9FFF', 2: '#FFB800', 3: '#16BaAA', 4: '#FFB800', 5: '#FF5722', 6: '#FF5722', 7: '#999999', 8: '#999999', 20: '#999999', 30: '#999999', 32: '#999999', 33: '#999999' };

        function badge(text, color) {
            return '<span style="display:inline-block;padding:2px 10px;border-radius:10px;background:' + color + ';color:#fff;font-size:12px;vertical-align:middle;">' + text + '</span>';
        }

        var html = '';
        html += '<div style="padding:2px 0 8px 0;border-bottom:1px solid #e6e6e6;">';
        html += '<span style="font-size:20px;font-weight:bold;vertical-align:middle;">' + data.orderId + '</span>';
        html += '&nbsp;&nbsp;' + badge(DECORATION_STATUS[data.status] || data.status, badgeColor[data.status] || '#999999');
        html += '&nbsp;&nbsp;' + badge(mode == 'presign' ? '预签准备' : '签约准备', '#1E9FFF');
        html += '</div>';
        html += '<div style="padding:8px 0 6px 0;color:#666;font-size:13px;">';
        html += '👤 ' + (data.customerName || '-') + '&nbsp;&nbsp;&nbsp;';
        html += '🏠 ' + (data.villageName || '-') + ' ' + (data.houseNumber || '') + '&nbsp;&nbsp;&nbsp;';
        html += '✏️ ' + (data.designerName || '-');
        html += '</div>';
        html += '<div style="display:flex;text-align:center;margin-top:6px;padding-top:6px;border-top:1px solid #e6e6e6;">';
        html += '<div style="flex:1;"><div style="color:#999;font-size:12px;">订单总额</div><div style="font-size:18px;font-weight:bold;">' + (data.orderTotalPrice || 0) + ' <small>元</small></div></div>';
        html += '<div style="flex:1;border-left:1px solid #e6e6e6;border-right:1px solid #e6e6e6;"><div style="color:#999;font-size:12px;">已收合同款</div><div style="font-size:18px;font-weight:bold;color:' + (data.paymentReady ? '#16BaAA' : '#FF5722') + ';">' + (data.paymentMoney || 0) + ' <small>元</small></div></div>';
        html += '<div style="flex:1;"><div style="color:#999;font-size:12px;">' + (mode == 'presign' ? '预签报价' : '默认报价') + '</div><div style="font-size:18px;font-weight:bold;">' + (mode == 'presign' ? (data.protationTotalPrice || 0) : (data.quotationTotalPrice || 0)) + ' <small>元</small></div></div>';
        html += '</div>';

        $('#summaryInfo').html(html);
    }

    function renderCheckList() {

        var items = mode == 'presign' ? buildPresignItems(data) : buildSignItems(data);

        var html = '';
        $.each(items, function (i, item) { html += buildItemHtml(item); });

        $('#checkList').html(html);
    }

    function paymentDetailHtml() {

        var html = '';

        $.each(data.payments || [], function (i, p) {
            html += '<div style="font-size:12px;">' + (i + 1) + '. ' + (p.paymentType || '-') + ' : 应收 ' + (p.referMoney || 0) + ' 元 / ' + (PAYMENT_STATUS[p.paymentStatus] || p.paymentStatus) + '</div>';
        });

        return html || '<div style="font-size:12px;">该单尚无款项行</div>';
    }

    // 正式签约 8 项, 硬条件与 signDecorationContract 校验零漂移
    function buildSignItems(d) {

        var items = [];

        items.push(item([0, 1, 2, 4].indexOf(d.status) != -1 ? 'ok' : 'fail', '订单状态可签', '当前状态: ' + (DECORATION_STATUS[d.status] || d.status), '签约要求订单处于 初始/定金/预签/重签 状态'));

        items.push(item(d.paymentReady ? 'ok' : 'fail', '合同款已收', d.paymentReady ? '已收合同款: ' + (d.paymentMoney || 0) + ' 元' : '尚无已付款/已确认的合同款', '签约前必须存在已付款或已确认的合同款(收款类), 收款请在装修款页面完成', [], paymentDetailHtml()));

        var qValue = '暂无默认报价';
        if (d.quotationReady) {
            qValue = '报价: ' + (d.quotationVersionName || '-') + ' / 总额 ' + (d.quotationTotalPrice || 0) + ' 元 / ' + (QUOTATION_STATUS[d.quotationStatus] || d.quotationStatus) + '(审核' + (QUOTATION_ATTSTATUS[d.quotationAttstatus] || d.quotationAttstatus) + ')';
        }

        var qBtns = [];
        if (!d.quotationReady) {
            qBtns.push({ act: 'refresh-quotation', label: '刷新' });
        } else {
            if (d.quotationAttstatus == 3 && d.quotationStatus == 0) qBtns.push({ act: 'lock-quotation', label: '锁定报价' });
            if (d.quotationStatus == 1) qBtns.push({ act: 'unlock-quotation', label: '解锁报价' });
        }

        items.push(item(d.quotationReady ? 'ok' : 'fail', '默认报价存在', qValue, '签约要求存在默认报价; 签约时将自动锁定该单全部报价, 如需签约前锁定防改动可在此手动锁定(需审核完成)' + (d.quotationPriceParts ? '; 构成: ' + d.quotationPriceParts : ''), qBtns));

        var aState = d.activityStatus == 1 ? 'ok' : (d.activityStatus == 0 ? 'warn' : 'na');
        var aValue = d.activityStatus == -1 ? '未参加活动' : '活动: ' + (d.activityName || '-') + ' / ' + (d.activityStatus == 1 ? '已锁定' : '未锁定');
        var aBtns = [];
        if (d.activityStatus == -1) aBtns.push({ act: 'join-activity', label: '参加活动' });
        if (d.activityStatus == 0) aBtns.push({ act: 'lock-activity', label: '锁定活动' }, { act: 'change-activity', label: '换活动' });
        if (d.activityStatus == 1) aBtns.push({ act: 'unlock-activity', label: '解锁活动' });

        items.push(item(aState, '活动已锁定(建议)', aValue, '正式签约不强制校验活动; 但活动锁定后不可误删误改, 且预签必须先锁定活动, 建议签约前完成锁定' + (d.activityEndTime ? '; 活动有效期至: ' + String(d.activityEndTime).substring(0, 10) : ''), aBtns));

        var cState = (d.contractStatus == 1 || d.contractStatus == 3) ? 'ok' : 'warn';
        var cValue = d.contractStatus == -1 ? '尚未创建电子合同' : '合同: ' + (CONTRACT_STATUS[d.contractStatus] || d.contractStatus) + (d.contractCount > 1 ? '(共' + d.contractCount + '份, 展示最新)' : '');
        var cBtns = [];
        if (d.contractStatus == -1) {
            cBtns.push({ act: 'create-contract', label: '创建合同' });
        } else if (d.contractStatus == 0) {
            cBtns.push({ act: 'company-sign', label: '公司签' });
            cBtns.push({ act: 'customer-sign', label: '客户签' });
            cBtns.push({ act: 'affix-contract', label: '确认已签' });
            cBtns.push({ act: 'expire-contract', label: '废止' });
        }
        if (d.contractStatus != -1) cBtns.push({ act: 'view-contract', label: '查看合同' });

        items.push(item(cState, '电子合同已签署(建议)', cValue, '电子合同与订单签约相互独立, 签约不校验合同; 建议签约前完成合同创建与签署(公司签选择签章, 客户签打开签署页)', cBtns));

        var dlBtns = [{ act: 'set-drawlinetime', label: d.drawlineTime ? '修改放线时间' : '设置放线时间' }, { act: 'applay-drawline', label: '申请放线' }];

        items.push(item(d.drawlineTime ? 'ok' : 'fail', '预计放线时间已配置', d.drawlineTime ? '预计放线时间: ' + String(d.drawlineTime).substring(0, 10) : '工程信息中未配置预计放线时间', '签约硬性要求; 可在此直接设置, 或在放线处理页配置', dlBtns));

        items.push(item(d.constructionInfoReady ? 'ok' : 'fail', '工程信息存在', d.constructionInfoReady ? '工程信息已存在' : '工程信息不存在', '签约硬性要求, 缺失请在工程信息页补建'));

        return items;
    }

    // 预签 6 项, 硬条件与 presignDecorationContract 校验零漂移
    function buildPresignItems(d) {

        var items = [];

        items.push(item([0, 1, 2].indexOf(d.status) != -1 ? 'ok' : 'fail', '订单状态可预签', '当前状态: ' + (DECORATION_STATUS[d.status] || d.status), '预签要求订单处于 初始/定金/预签 状态'));

        var jBtns = [];
        if (d.activityStatus == -1) jBtns.push({ act: 'join-activity', label: '参加活动' });
        if (d.activityStatus == 0) jBtns.push({ act: 'change-activity', label: '换活动' });

        items.push(item(d.activityStatus != -1 ? 'ok' : 'fail', '已参加活动', d.activityStatus == -1 ? '尚未参加活动' : '活动: ' + (d.activityName || '-'), '预签要求订单已参加活动(每单限一个活动)', jBtns));

        var lBtns = [];
        if (d.activityStatus == 0) lBtns.push({ act: 'lock-activity', label: '锁定活动' });
        if (d.activityStatus == 1) lBtns.push({ act: 'unlock-activity', label: '解锁活动' });

        items.push(item(d.activityStatus == 1 ? 'ok' : 'fail', '活动已锁定', d.activityStatus == -1 ? '未参加活动' : (d.activityStatus == 1 ? '活动已锁定' : '活动未锁定'), '预签硬性要求, 活动锁定后不可删除不可再申领物品', lBtns));

        items.push(item(d.protationStatus != -1 ? 'ok' : 'fail', '预签报价存在', d.protationStatus != -1 ? '预签报价总额: ' + (d.protationTotalPrice || 0) + ' 元' : '尚无预签报价', '预签要求存在默认预签报价(protation), 请在预签报价页完成创建与编辑'));

        var pBtns = [];
        if (d.protationStatus == 0) pBtns.push({ act: 'lock-protation', label: '锁定预签报价' });
        if (d.protationStatus == 2) pBtns.push({ act: 'unlock-protation', label: '解锁预签报价' });

        items.push(item(d.protationStatus == 2 ? 'ok' : 'fail', '预签报价已锁定', d.protationStatus != -1 ? '预签报价状态: ' + (PROTATION_STATUS[d.protationStatus] || d.protationStatus) : '尚无预签报价', '预签要求预签报价处于锁定状态, 可在此直接锁定', pBtns));

        items.push(item(d.paymentReady ? 'ok' : 'warn', '款项参考(建议)', d.paymentReady ? '已收合同款: ' + (d.paymentMoney || 0) + ' 元' : '尚无已收合同款', '预签不强制校验收款, 仅作签约进度参考; 收款请在装修款页面完成', [], paymentDetailHtml()));

        return items;
    }

    function item(state, title, value, desc, btns, detail) {
        return { state: state, title: title, value: value, desc: desc, btns: btns || [], detail: detail || '' };
    }

    function buildItemHtml(it) {

        var conf = {
            ok: { bg: 'background:#e8f5e9;', color: '#16BaAA', icon: '✓', text: '满足' },
            fail: { bg: 'background:#fdecea;', color: '#FF5722', icon: '✗', text: '未满足' },
            warn: { bg: 'background:#fff8e1;', color: '#FFB800', icon: '!', text: '待完成' },
            na: { bg: 'background:#f8f8f8;', color: '#999999', icon: '—', text: '不适用' }
        }[it.state] || { bg: 'background:#f8f8f8;', color: '#999999', icon: '—', text: '不适用' };

        var html = '<div style="' + conf.bg + 'border-left:4px solid ' + conf.color + ';border-radius:4px;padding:10px 12px;margin-bottom:10px;">';
        html += '<div style="border-bottom:1px dashed rgba(0,0,0,0.1);padding-bottom:6px;margin-bottom:6px;">';
        html += '<span style="display:inline-block;width:22px;height:22px;line-height:22px;border-radius:50%;background:' + conf.color + ';color:#fff;text-align:center;font-size:13px;font-weight:bold;margin-right:8px;vertical-align:middle;">' + conf.icon + '</span>';
        html += '<b style="font-size:15px;vertical-align:middle;">' + it.title + '</b>';
        html += '&nbsp;&nbsp;<span style="display:inline-block;padding:1px 8px;border-radius:8px;background:' + conf.color + ';color:#fff;font-size:12px;vertical-align:middle;">' + conf.text + '</span>';
        html += '</div>';
        html += '<div style="margin-bottom:4px;">' + it.value + '</div>';
        html += '<div style="color:#999;font-size:12px;margin:2px 0 6px 0;">' + it.desc + '</div>';

        if (it.detail) {
            html += '<div style="margin:0 0 6px 8px;">' + it.detail + '</div>';
        }

        if (it.btns.length > 0) {
            $.each(it.btns, function (i, btn) {
                var cls = btn.act.indexOf('do-') == 0 ? '' : 'layui-btn-warm';
                html += '<button type="button" class="layui-btn layui-btn-xs ' + cls + '" style="margin-right:6px;" data-act="' + btn.act + '">' + btn.label + '</button>';
            });
        }

        html += '</div>';

        return html;
    }

    function renderActionRow() {

        var html = '';

        if (mode == 'presign') {
            if (data.presignReady) {
                html = '<button type="button" class="layui-btn layui-btn-danger" data-act="do-presign">确认预签</button><span style="color:#5FB878;margin-left:10px;">前置条件全部满足, 可以预签</span>';
            } else {
                html = '<button type="button" class="layui-btn layui-btn-danger layui-btn-disabled" disabled="disabled">确认预签</button><span style="color:#FF5722;margin-left:10px;">存在未满足的硬性条件(红色项), 满足后方可预签</span>';
            }
        } else {
            if (data.signReady) {
                html = '<button type="button" class="layui-btn layui-btn-danger" data-act="do-sign">确认签约</button><span style="color:#5FB878;margin-left:10px;">硬性条件全部满足, 可以签约</span>';
            } else {
                html = '<button type="button" class="layui-btn layui-btn-danger layui-btn-disabled" disabled="disabled">确认签约</button><span style="color:#FF5722;margin-left:10px;">存在未满足的硬性条件(红色项), 满足后方可签约</span>';
            }
        }

        $('#actionRow').html(html);
    }

    // 触发宿主页事件桥(iframe -> parent document)
    function triggerBridge(payload) {
        if (window.parent && window.parent.$ && window.parent.document) {
            window.parent.$(window.parent.document).trigger('decoration:signprepare', payload);
        }
    }

    // 轻操作与动作分发
    $('#checkList, #actionRow').on('click', 'button[data-act]', function () {

        var act = $(this).attr('data-act');

        if (act == 'lock-quotation') {

            app.post(api.quotation.lockQuotation, { 'quotation.qid': data.quotationQid }, function () {
                app.showAlert(app.success, '报价已锁定'); queryData();
            });

        } else if (act == 'unlock-quotation') {

            app.post(api.quotation.unlockQuotation, { 'quotation.qid': data.quotationQid }, function () {
                app.showAlert(app.success, '报价已解锁'); queryData();
            });

        } else if (act == 'lock-activity') {

            app.post(api.decoration.lockDecorationActivity, { 'decorationActivity.daId': data.activityDaId }, function () {
                app.showAlert(app.success, '活动已锁定'); queryData();
            });

        } else if (act == 'unlock-activity') {

            app.post(api.decoration.unlockDecorationActivity, { 'decorationActivity.daId': data.activityDaId }, function () {
                app.showAlert(app.success, '活动已解锁'); queryData();
            });

        } else if (act == 'change-activity') {

            app.showConfirm('更换活动需先删除当前活动(未锁定), 删除后可重新参加, 确认删除?', function () {
                app.post(api.decoration.deleteDecorationActivity, { 'decorationActivity.daId': data.activityDaId }, function () {
                    app.showAlert(app.success, '活动已删除, 可重新参加'); queryData();
                });
            });

        } else if (act == 'refresh-quotation') {

            queryData();

        } else if (act == 'company-sign') {

            app.post(api.data.querySignet, {}, function (res) {

                var html = '<option value="">请选择</option>';
                $.each(res.signets || [], function (i, s) {
                    html += '<option value="' + s.sid + '">' + s.name + '</option>';
                });
                $('#signetSel').html(html);
                form.render('select');

                layer.open({ type: 1, title: '公司签', content: $('#companySignBox'), area: ['420px', 'auto'], btn: ['保存', '取消'], yes: function (idx) {

                    var sid = $('#signetSel').val();
                    if (!sid) { app.showAlert(app.warning, '请选择签章'); return; }

                    app.post(api.decoration.signDecorationContractForCompany, { 'decorationContract.dcid': data.contractDcid, 'signet.sid': sid }, function () {
                        app.showAlert(app.success, '公司签已完成');
                        layer.close(idx); queryData();
                    });
                } });
            }, null, false);

        } else if (act == 'view-contract') {

            app.post(api.decoration.viewDecorationContract, { 'decorationContract.dcid': data.contractDcid }, function (res) {
                if (window.parent && window.parent.app) {
                    window.parent.app.popup(res.redirect, '合同查看', null, { area: ['85%', '85%'] });
                }
            });

        } else if (act == 'lock-protation') {

            app.post(api.quotation.lockProtation, { 'protation.pid': data.protationPid }, function () {
                app.showAlert(app.success, '预签报价已锁定'); queryData();
            });

        } else if (act == 'unlock-protation') {

            app.post(api.quotation.unlockProtation, { 'protation.pid': data.protationPid }, function () {
                app.showAlert(app.success, '预签报价已解锁'); queryData();
            });

        } else if (act == 'join-activity') {

            app.post(api.information.queryActivityForValid, { 'activity.type': 1 }, function (res) {

                var html = '<option value="">请选择</option>';
                $.each(res.activitys || [], function (i, a) {
                    html += '<option value="' + a.aid + '">' + a.name + '</option>';
                });
                $('#activityInfo').html(html);
                form.render('select');

                layer.open({ type: 1, title: '参加活动', content: $('#joinActivityBox'), area: ['450px', 'auto'], btn: ['保存', '取消'], yes: function (idx) {

                    var aid = $('#activityInfo').val();
                    if (!aid) { app.showAlert(app.warning, '请选择活动'); return; }

                    app.post(api.decoration.addDecorationActivity, { 'decorationActivity.orderId': orderId, 'decorationActivity.activity.aid': aid }, function () {
                        app.showAlert(app.success, '参加活动成功');
                        layer.close(idx); queryData();
                    });
                } });
            }, null, false);

        } else if (act == 'create-contract') {

            if (window.parent && window.parent.app) {
                window.parent.app.params.decoration = $.extend({}, window.parent.app.params.decoration, { orderId: orderId, cid: cid });
                window.parent.app.params.customer = $.extend({}, window.parent.app.params.customer, { cid: cid });
                window.parent.app.popup('views/decoration/decorationContract2create.html', '创建合同', null, { area: ['85%', '85%'], end: function () { queryData(); } });
            }

        } else if (act == 'customer-sign') {

            app.post(api.decoration.signDecorationContractForCustomer, { 'decorationContract.dcid': data.contractDcid, 'customer.cid': cid }, function (res) {
                if (window.parent && window.parent.app) {
                    window.parent.app.popup(res.redirect, '客户签', null, { area: ['85%', '85%'] });
                }
            });

        } else if (act == 'affix-contract') {

            app.showConfirm('是否已签合同?', function () {
                app.post(api.decoration.affixDecorationContract, { 'decorationContract.dcid': data.contractDcid }, function () {
                    app.showAlert(app.success, '操作成功'); queryData();
                });
            });

        } else if (act == 'expire-contract') {

            app.showConfirm('是否失效合同?', function () {
                app.post(api.decoration.expireDecorationContract, { 'decorationContract.dcid': data.contractDcid }, function () {
                    app.showAlert(app.success, '操作成功'); queryData();
                });
            });

        } else if (act == 'set-drawlinetime') {

            app.post(api.construction.queryConstructionInfoByOrderId, { 'constructionInfo.orderId': orderId }, function (res) {

                info = res.constructionInfo || {};
                $('#drawlineTime').val(info.drawlineTime ? String(info.drawlineTime).substring(0, 10) : '');

                layer.open({ type: 1, title: '设置预计放线时间', content: $('#drawlineTimeBox'), area: ['420px', 'auto'], btn: ['保存', '取消'], yes: function (idx) {

                    var val = $('#drawlineTime').val();
                    if (!val) { app.showAlert(app.warning, '请选择预计放线时间'); return; }

                    // 先查回填再全量回传(drawline4apply 同款口径)
                    app.post(api.construction.updateConstructionInfoByOrderId, {
                        'constructionInfo.orderId': orderId,
                        'constructionInfo.decoration.orderId': orderId,
                        'constructionInfo.timeLimit': info.timeLimit,
                        'constructionInfo.ishovel': info.ishovel,
                        'constructionInfo.iskey': info.iskey,
                        'constructionInfo.isCeremony': info.isCeremony,
                        'constructionInfo.finishTime': info.finishTime,
                        'constructionInfo.keyTime': info.keyTime,
                        'constructionInfo.designTime': info.designTime,
                        'constructionInfo.comment': info.comment,
                        'constructionInfo.drawlineTime': val + ' 00:00:00'
                    }, function () {
                        app.showAlert(app.success, '预计放线时间已保存');
                        layer.close(idx); queryData();
                    });
                } });
            }, null, false);

        } else if (act == 'applay-drawline') {

            $('#applayDes').val('');
            $('#applayTime').val('');

            layer.open({ type: 1, title: '申请放线', content: $('#applayDrawLineBox'), area: ['450px', 'auto'], btn: ['保存', '取消'], yes: function (idx) {

                var des = $('#applayDes').val();
                var time = $('#applayTime').val();
                if (!des || !time) { app.showAlert(app.warning, '请填写申请说明与申请时间'); return; }

                app.showConfirm('确认申请放线吗?', function () {
                    app.post(api.construction.applayDrawLine, {
                        'drawLine.content': des,
                        'drawLine.applayTime': time + ' 00:00:00',
                        'drawLine.decoration.orderId': orderId
                    }, function () {
                        app.showAlert(app.success, '放线申请已提交');
                        layer.close(idx);
                    });
                });
            } });

        } else if (act == 'do-sign' || act == 'do-presign') {

            triggerBridge({ action: act == 'do-sign' ? 'sign' : 'presign' });

        }
    });
});
});
