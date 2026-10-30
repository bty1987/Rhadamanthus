/** app/js/decoration/decoration4activity.js —— 装修单活动
 *  上下文：app.params.decoration = { orderId }。
 *  参与活动：queryDecorationActivityByOrderId → 参加活动 addDecorationActivity / 删除 / 锁定 / 解锁；
 *  活动物品：queryDecorationActivityItem（含金额）→ 记录/领取/失效/退货/配送/未退/抵现/折扣/发送/确认；
 *  申领：提交审批 submitApprovalForDecorationActivity（items 明细）；
 *  添加物品：information.queryActivityItemByAiid + addDecorationActivityItem。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var E = decorationCommon.ENUM;
    var ctx = app.params.decoration || {};
    var orderId = ctx.orderId;
    var joinIdx = null, itemIdx = null, applyIdx = null;
    var activityItemsCache = {};   // aiid → activityItem
    var applyRows = [];            // 申领清单

    if (!orderId) { app.showAlert(app.warning, '缺少订单上下文'); }

    // —— 参与活动表 ——
    table.render({ elem: '#activityTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'name', title: '活动名称', width: 200, templet: function (d) { return d.activity ? d.activity.name : ''; } },
            { field: 'money', title: '活动金额', width: 110, templet: function (d) { return d.activity ? app.formatMoney(d.activity.money) : ''; } },
            { field: 'status', title: '状态', width: 90, templet: function (d) { return decorationCommon.badge(E.activityStatus, d.status, function (k) { return k == 1 ? 'layui-bg-orange' : 'layui-bg-blue'; }); } },
            { field: 'createTime', title: '创建时间', width: 170, templet: function (d) { return app.dateFormat(d.createTime); } },
            { field: 'comment', title: '备注', minWidth: 160 },
            { title: '操作', width: 220, toolbar: '#activityToolbar' } ]] });

    table.on('tool(activityTable)', function (obj) {
        var ev = obj.event, v = obj.data;
        if (ev === 'del') {
            app.post(api.decoration.deleteDecorationActivity, { 'decorationActivity.daId': v.daId }, function () {
                app.showAlert(app.success, '删除成功'); loadActivities();
            });
        } else if (ev === 'lock') {
            app.post(api.decoration.lockDecorationActivity, { 'decorationActivity.daId': v.daId }, function () {
                app.showAlert(app.success, '锁定成功'); loadActivities();
            });
        } else if (ev === 'unlock') {
            app.post(api.decoration.unlockDecorationActivity, { 'decorationActivity.daId': v.daId }, function () {
                app.showAlert(app.success, '解锁成功'); loadActivities();
            });
        }
    });

    function loadActivities() {
        app.post(api.decoration.queryDecorationActivityByOrderId, { 'decorationActivity.orderId': orderId }, function (res) {
            table.reload('activityTable', { data: res.decorationActivitys || [] });
        });
    }
    loadActivities();

    // —— 活动物品表 ——
    table.render({ elem: '#itemTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'checkbox', width: 40 },
            { type: 'numbers', title: '#', width: 50 },
            { field: 'activityName', title: '活动', width: 150 },
            { field: 'activityItemName', title: '物品名称', width: 140 },
            { field: 'type', title: '物品类型', width: 90, templet: function (d) { return { 0: '物品', 1: '券', 2: '奖券' }[d.type] != null ? { 0: '物品', 1: '券', 2: '奖券' }[d.type] : d.type; } },
            { field: 'num', title: '数量', width: 80 },
            { field: 'money', title: '金额', width: 100, templet: function (d) { return app.formatMoney(d.money); } },
            { field: 'stateType', title: '领取类型', width: 110, templet: function (d) { return E.stateType[d.stateType] != null ? E.stateType[d.stateType] : d.stateType; } },
            { field: 'status', title: '状态', width: 90, templet: function (d) { return decorationCommon.badge(E.activityItemStatus, d.status); } },
            { field: 'isStatus', title: '是否计入', width: 90, templet: function (d) { return E.isStatus[d.isStatus] != null ? E.isStatus[d.isStatus] : ''; } },
            { field: 'isAffirm', title: '确认', width: 90, templet: function (d) { return E.isAffirm[d.isAffirm] != null ? E.isAffirm[d.isAffirm] : ''; } },
            { field: 'createTime', title: '创建时间', width: 165, templet: function (d) { return app.dateFormat(d.createTime); } },
            { field: 'comment', title: '备注', width: 130 },
            { title: '操作', width: 560, toolbar: '#itemToolbar', fixed: 'right' } ]] });

    table.on('tool(itemTable)', function (obj) {
        var ev = obj.event, v = obj.data;
        if (ev === 'record') goRecord(v);
        else if (ev === 'receive') op(api.decoration.receiveDecorationActivityItem, v, '确认领取该活动物品?');
        else if (ev === 'abate') op(api.decoration.abateDecorationActivityItem, v, '确认将该活动物品失效?', 'decorationActivityItem.content', '请输入失效原因');
        else if (ev === 'refund') op(api.decoration.refundDecorationActivityItem, v, '确认退货?');
        else if (ev === 'delive') op(api.decoration.deliveDecorationActivityItem, v, '确认配送?');
        else if (ev === 'unrefund') op(api.decoration.unrefundDecorationActivityItem, v, '确认标记未退?');
        else if (ev === 'expend') op(api.decoration.expendDecorationActivityItem, v, '确认抵现?');
        else if (ev === 'discount') op(api.decoration.discountDecorationActivityItem, v, '确认折扣?');
        else if (ev === 'send') op(api.decoration.sendDecorationActivityItem, v, '确认发送?');
        else if (ev === 'affirm') op(api.decoration.affirmDecorationActivityItem, v, '确认?');
    });

    function goRecord(v) {
        app.params.decoration = $.extend({}, app.params.decoration, { decorationActivityItem: v });
        app.params.historyPage = app.params.historyPage || api.index.decorationActivityItemIndex.url;
        app.popup(api.index.decorationActivityRecordIndex.url, '活动物品操作记录 - ' + (v.activityItemName || ''), null, { area: ['800px', '70%'] });
    }

    // 通用操作（可带 prompt 备注）
    function op(apiObj, v, msg, contentField, contentPh) {
        var run = function (content) {
            var opts = { 'decorationActivityItem.daiId': v.daiId };
            if (contentField && content) opts[contentField] = content;
            app.post(apiObj, opts, function () {
                app.showAlert(app.success, '操作成功'); loadItems();
            });
        };
        if (contentField) {
            layer.prompt({ title: contentPh || '请输入内容' }, function (val, idx) {
                layer.close(idx); run(val);
            });
        } else {
            app.showConfirm(msg, function () { run(); });
        }
    }

    function loadItems() {
        app.post(api.decoration.queryDecorationActivityItem, { 'decorationActivityItem.orderId': orderId }, function (res) {
            table.reload('itemTable', { data: res.decorationActivityItems || [] });
        });
    }
    loadItems();

    // —— 参加活动 ——
    function fillActivities(sel, includeLocked) {
        app.post(api.decoration.queryDecorationActivityByOrderId, { 'decorationActivity.orderId': orderId }, function (res) {
            var list = res.decorationActivitys || [];
            var html = '<option value="">请选择活动</option>';
            $.each(list, function (i, v) {
                if (!includeLocked && v.status == 1) return;
                html += '<option value="' + v.activity.aid + '">' + v.activity.name + (v.activity.money != null ? '（' + app.formatMoney(v.activity.money) + '元）' : '') + '<\/option>';
            });
            $(sel).html(html);
            form.render('select');
        }, null, false);
    }

    $('#btnJoin').on('click', function () {
        fillActivities('#activityInfo', false);
        joinIdx = layer.open({ type: 1, title: '参加活动 - ' + orderId, content: $('#joinBox'), area: ['520px', 'auto'],
            btn: ['提交', '取消'], yes: function (idx) {
                var aid = $('#activityInfo').val();
                if (!aid) { app.showAlert(app.warning, '请选择活动'); return; }
                app.post(api.decoration.addDecorationActivity, { 'decorationActivity.orderId': orderId, 'decorationActivity.activity.aid': aid }, function () {
                    app.showAlert(app.success, '操作成功');
                    layer.close(idx); loadActivities();
                });
            } });
    });

    // —— 添加活动物品（选活动 → 选物品）——
    function fillActivityItems(aid) {
        app.post(api.information.queryActivityItemByAid, { 'activityItem.activity.aid': aid }, function (res) {
            var list = res.activityItems || [];
            var html = '<option value="">请选择活动物品</option>';
            activityItemsCache = {};
            $.each(list, function (i, v) {
                activityItemsCache[v.aiid] = v;
                html += '<option value="' + v.aiid + '">' + v.name + '（' + app.formatMoney(v.money) + '元）<\/option>';
            });
            $('#itemObj').html(html);
            form.render('select');
        });
    }
    form.on('select(activities)', function (d) { if (d.value) fillActivityItems(d.value); });

    $('#btnAddItem').on('click', function () {
        fillActivities('#activities', false);
        $('#itemForm')[0].reset();
        $('#itemObj').html('<option value="">请先选择活动</option>');
        form.render('select');
        itemIdx = layer.open({ type: 1, title: '添加活动物品 - ' + orderId, content: $('#itemBox'), area: ['560px', 'auto'],
            btn: ['提交', '取消'], yes: function (idx) {
                var aid = $('#activities').val();
                var aiid = $('#itemObj').val();
                var num = $.trim($('#itemNum').val());
                if (!aid) { app.showAlert(app.warning, '请选择活动'); return; }
                if (!aiid) { app.showAlert(app.warning, '请选择活动物品'); return; }
                if (!num || isNaN(parseInt(num, 10))) { app.showAlert(app.warning, '请输入数量'); return; }
                var activityName = $('#activities').find('option:selected').text();
                var item = activityItemsCache[aiid] || {};
                app.post(api.decoration.addDecorationActivityItem, {
                    'decorationActivityItem.orderId': orderId,
                    'decorationActivityItem.aid': aid,
                    'decorationActivityItem.activityName': activityName,
                    'decorationActivityItem.activityItemName': item.name || '',
                    'decorationActivityItem.type': $('#itemType').val(),
                    'decorationActivityItem.num': num,
                    'decorationActivityItem.money': item.money != null ? item.money : 0,
                    'decorationActivityItem.stateType': $('#receiveType1').val(),
                    'decorationActivityItem.asid': item.asid != null ? item.asid : '',
                    'decorationActivityItem.content': ''
                }, function () {
                    app.showAlert(app.success, '提交成功');
                    layer.close(idx); loadItems();
                });
            } });
    });

    // —— 申领活动物品（审批）——
    function loadApprovers() {
        app.post(api.approval.queryApproverByType, { 'approver.type': 8 }, function (res) {
            var html = '<option value="">请选择审批人</option>';
            $.each(res.approvers || [], function (i, v) {
                html += '<option value="' + v.userBase.userId + '">' + v.userBase.currentName + (v.comment ? '（' + v.comment + '）' : '') + '<\/option>';
            });
            $('#approveActivityItemMan').html(html);
            form.render('select');
        });
    }

    table.render({ elem: '#applyTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { field: 'activityItemName', title: '物品', width: 160 },
            { field: 'typeName', title: '类型', width: 80 },
            { field: 'num', title: '数量', width: 70 },
            { field: 'money', title: '金额', width: 90 },
            { field: 'stateTypeName', title: '领取类型', width: 100 },
            { title: '操作', width: 80, templet: '<div><button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="rm">移除<\/button><\/div>' } ]] });
    table.on('tool(applyTable)', function (obj) {
        if (obj.event === 'rm') {
            applyRows = applyRows.filter(function (r) { return r._k != obj.data._k; });
            table.reload('applyTable', { data: applyRows });
        }
    });

    $('#btnAddToApply').on('click', function () {
        var checks = table.checkStatus('itemTable').data;
        if (!checks.length) { app.showAlert(app.warning, '请先在活动物品列表勾选'); return; }
        $.each(checks, function (i, v) {
            var key = v.daiId + '_' + v.stateType;
            var dup = applyRows.filter(function (r) { return r._k == key; });
            if (dup.length) return;
            applyRows.push({
                _k: key, daiId: v.daiId, activityItemName: v.activityItemName,
                typeName: { 0: '物品', 1: '券', 2: '奖券' }[v.type] != null ? { 0: '物品', 1: '券', 2: '奖券' }[v.type] : v.type,
                num: v.num, money: v.money, stateType: v.stateType,
                stateTypeName: E.stateType[v.stateType] != null ? E.stateType[v.stateType] : v.stateType
            });
        });
        table.reload('applyTable', { data: applyRows });
    });

    $('#btnApplyItem').on('click', function () {
        applyRows = [];
        table.reload('applyTable', { data: [] });
        fillActivities('#activity', false);
        loadApprovers();
        applyIdx = layer.open({ type: 1, title: '申领活动物品 - ' + orderId, content: $('#applyBox'), area: ['760px', '80%'],
            btn: ['提交审批', '取消'], yes: function (idx) {
                var aid = $('#activity').val();
                var receiverId = $('#approveActivityItemMan').val();
                if (!aid) { app.showAlert(app.warning, '请选择活动'); return; }
                if (!receiverId) { app.showAlert(app.error, '请选择审批人!'); return; }
                if (!applyRows.length) { app.showAlert(app.error, '活动物品或券需要选择才能提交'); return; }
                var activityName = $('#activity').find('option:selected').text();
                var opts = {
                    'approval.receiver.userId': receiverId,
                    'approval.comment': '',
                    'approvalDecorationActivity.activityId': aid,
                    'approvalDecorationActivity.orderId': orderId,
                    'approvalDecorationActivity.activityName': activityName
                };
                $.each(applyRows, function (i, r) {
                    opts['approvalDecorationActivityItems[' + i + '].orderId'] = orderId;
                    opts['approvalDecorationActivityItems[' + i + '].activityName'] = activityName;
                    opts['approvalDecorationActivityItems[' + i + '].activityItemName'] = r.activityItemName;
                    opts['approvalDecorationActivityItems[' + i + '].type'] = 1;
                    opts['approvalDecorationActivityItems[' + i + '].num'] = r.num;
                    opts['approvalDecorationActivityItems[' + i + '].money'] = r.money;
                    opts['approvalDecorationActivityItems[' + i + '].content'] = '';
                    opts['approvalDecorationActivityItems[' + i + '].stateType'] = r.stateType;
                });
                app.post(api.approval.submitApprovalForDecorationActivity, opts, function () {
                    app.showAlert(app.success, '提交成功');
                    layer.close(idx); applyRows = [];
                });
            } });
    });

    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || api.index.decorationIndex.url); });
});
}); // end app.ready
