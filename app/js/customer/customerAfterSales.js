/** app/js/customer/customerAfterSales.js —— 售后工单（旧 customerAfterSales.js → layui）
 *  列表：pageCustomerAfterSales。创建：addCustomerAfterSales。
 *  生命周期（operationMap）：接收 receiveCustomerAfterSales / 派工 dispatchCustomerAfterSales /
 *  处理 handleCustomerAfterSales / 转交 tranCustomerAfterSales / 挂起 holdCustomerAfterSales /
 *  升级 upgradeCustomerAfterSales / 完成 finishCustomerAfterSales / 关闭 closeCustomerAfterSales /
 *  取消 cancelCustomerAfterSales / 重开 reopenCustomerAfterSales / 追加记录 addCustomerAfterSalesRecord。
 *  关联：addCustomerAfterSalesRef；详情：queryCustomerAfterSalesByAsid + Record + Ref。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    customerCommon.ensureApiStubs();
    var TYPES = { 0: '反馈', 1: '投诉', 2: '报修', 3: '维修', 4: '建议', 5: '表扬', 6: '退款' };
    var SOURCES = { 0: '手工' };
    var PRIORITIES = { 0: '普通', 1: '重要', 2: '紧急' };
    var STATUSES = { 0: '初始', 1: '已接收', 2: '已派工', 3: '处理中', 4: '待确认', 5: '已完成', 6: '已关闭', 7: '已取消', 8: '已挂起', 9: '已升级', 10: '已重开' };
    var RECORD_TYPES = { 0: '创建', 1: '接收', 2: '派工', 3: '处理', 4: '转交', 5: '完成', 6: '关闭', 7: '取消', 8: '挂起', 9: '升级', 10: '重开', 11: '备注' };
    var REF_TYPES = { 0: '反馈', 1: '反馈投诉', 2: '反馈维修', 3: '老维修', 4: '维修', 5: '投诉', 6: '投诉明细', 7: '回访', 8: '调研' };
    var state = { page: 1, rows: 10, total: 0, editIndex: null, opIndex: null, refIndex: null, detailIndex: null, asid: null, operation: null, ownerId: null, opOwnerId: null };

    var OPERATION_MAP = {
        receive:  { title: '接收售后', api: 'receiveCustomerAfterSales', success: '接收成功', owner: true },
        dispatch: { title: '派工售后', api: 'dispatchCustomerAfterSales', success: '派工成功', owner: true },
        handle:   { title: '处理售后', api: 'handleCustomerAfterSales', success: '处理成功', owner: true },
        tran:     { title: '转交售后', api: 'tranCustomerAfterSales', success: '转交成功', owner: true, ownerRequired: true },
        hold:     { title: '挂起售后', api: 'holdCustomerAfterSales', success: '挂起成功', owner: true },
        upgrade:  { title: '升级售后', api: 'upgradeCustomerAfterSales', success: '升级成功', owner: true },
        finish:   { title: '完成售后', api: 'finishCustomerAfterSales', success: '完成成功', owner: false },
        close:    { title: '关闭售后', api: 'closeCustomerAfterSales', success: '关闭成功', owner: false },
        cancel:   { title: '取消售后', api: 'cancelCustomerAfterSales', success: '取消成功', owner: false },
        reopen:   { title: '重开售后', api: 'reopenCustomerAfterSales', success: '重开成功', owner: true },
        record:   { title: '追加记录', api: 'addCustomerAfterSalesRecord', success: '记录成功', owner: false, record: true }
    };

    function username(user) {
        if (!user) return '';
        return user.currentName || user.userName || user.loginId || (user.userId != null ? user.userId : '');
    }
    function empty(v) { return v == null || v === '' ? '-' : v; }
    function kv(map, k) { return map[k] != null ? map[k] : empty(k); }
    function isFinal(status) { return [5, 6, 7].indexOf(parseInt(status, 10)) != -1; }

    // —— 列表 ——
    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'asNo', title: '售后编号', width: 140, templet: function (d) { return d.asNo || ('售后单#' + d.asid); } },
            { field: 'orderId', title: '装修单号', width: 110 },
            { field: 'contactName', title: '联系人', width: 90 },
            { field: 'phone', title: '电话', width: 115 },
            { field: 'type', title: '类型', width: 80, templet: function (d) { return kv(TYPES, d.type); } },
            { field: 'priority', title: '优先级', width: 80, templet: function (d) { return kv(PRIORITIES, d.priority); } },
            { field: 'status', title: '状态', width: 90, templet: function (d) { return customerCommon.badge(STATUSES, d.status); } },
            { field: 'owner', title: '负责人', width: 90, templet: function (d) { return username(d.owner); } },
            { field: 'creater', title: '创建人', width: 90, templet: function (d) { return username(d.creater); } },
            { field: 'createTime', title: '创建时间', width: 165 },
            { field: 'updateTime', title: '更新时间', width: 165 },
            { field: 'content', title: '问题描述', minWidth: 180 },
            { title: '操作', width: 460, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        var st = parseInt(v.status, 10);
        if (obj.event === 'detail') showDetail(v.asid);
        else if (obj.event === 'record') openOperation('record', v.asid);
        else if (obj.event === 'ref') openRef(v.asid);
        else if (['receive', 'dispatch', 'handle', 'tran', 'hold', 'upgrade', 'finish', 'close', 'cancel', 'reopen'].indexOf(obj.event) != -1) {
            openOperation(obj.event, v.asid);
        }
    });
    if (!$('#rowToolbar').length) {
        // 按钮可见性与旧页一致
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            + '<button class="layui-btn layui-btn-xs" lay-event="detail">详情</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="record">记录</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="ref">关联</button>'
            + '{{# if(d.status == 0){ }}<button class="layui-btn layui-btn-xs" lay-event="receive">接收</button>{{# } }}'
            + '{{# if([0,1,10].indexOf(parseInt(d.status)) != -1){ }}<button class="layui-btn layui-btn-xs" lay-event="dispatch">派工</button>{{# } }}'
            + '{{# if([1,2,3,8,9,10].indexOf(parseInt(d.status)) != -1){ }}'
            + '<button class="layui-btn layui-btn-xs" lay-event="handle">处理</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="hold">挂起</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="upgrade">升级</button>{{# } }}'
            + '{{# if([3,4].indexOf(parseInt(d.status)) != -1){ }}<button class="layui-btn layui-btn-xs" lay-event="finish">完成</button>{{# } }}'
            + '{{# if(d.status == 5){ }}<button class="layui-btn layui-btn-xs" lay-event="close">关闭</button>{{# } }}'
            + '{{# if([5,6,7].indexOf(parseInt(d.status)) == -1 && d.status != 5){ }}<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="cancel">取消</button>{{# } }}'
            + '{{# if([5,6].indexOf(parseInt(d.status)) != -1){ }}<button class="layui-btn layui-btn-xs" lay-event="reopen">重开</button>{{# } }}'
            + '{{# if([5,6,7].indexOf(parseInt(d.status)) == -1){ }}<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="tran">转交</button>{{# } }}'
            + '<\/script>'
        );
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(api.customer.pageCustomerAfterSales, $.extend({}, customerCommon.buildFilters($('#searchForm')), {
            'paging.page': state.page,
            'paging.rows': state.rows
        }), function (res) {
            var p = res.paging || { data: [], totalRecords: 0, totalPage: 0 };
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            laypage.render({
                elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30],
                layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); }
            });
        });
    }
    query(1);

    // —— 创建 ——
    $('#btnCreate').on('click', function () {
        app.clearValidator();
        $('#editForm')[0].reset();
        form.render('select');
        state.ownerId = null;
        state.editIndex = layer.open({ type: 1, title: '创建售后', content: $('#editBox'), area: ['680px', 'auto'] });
    });
    $('#btnPickOwner').on('click', function () {
        customerCommon.userPicker(function (u) {
            state.ownerId = u.userId;
            $('#ownerName').val(u.currentName);
        });
    });
    $('#btnSave').on('click', function () {
        if (app.validate('editForm')) return;
        var options = {
            'customerAfterSales.type': $('#editForm [name="type"]').val(),
            'customerAfterSales.priority': $('#editForm [name="priority"]').val(),
            'customerAfterSales.orderId': $('#editForm [name="orderId"]').val(),
            'customerAfterSales.csid': $('#editForm [name="csid"]').val() || 0,
            'customerAfterSales.cid': $('#editForm [name="cid"]').val() || 0,
            'customerAfterSales.contactName': $('#editForm [name="contactName"]').val(),
            'customerAfterSales.phone': $('#editForm [name="phone"]').val(),
            'customerAfterSales.did': $('#editForm [name="did"]').val() || 0,
            'customerAfterSales.content': $('#editForm [name="content"]').val(),
            'customerAfterSales.comment': $('#editForm [name="comment"]').val()
        };
        if (state.ownerId != null) options['customerAfterSales.owner.userId'] = state.ownerId;
        app.post(api.customer.addCustomerAfterSales, options, function () {
            app.showAlert(app.success, '创建成功');
            layer.close(state.editIndex);
            state.editIndex = null;
            query(state.page);
        });
    });
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });

    // —— 生命周期操作 ——
    function openOperation(type, asid) {
        var op = OPERATION_MAP[type];
        state.operation = type;
        state.asid = asid;
        state.opOwnerId = null;
        $('#operationForm')[0].reset();
        app.clearValidator();
        $('#operationOwnerGroup').toggle(!!op.owner);
        $('#ownerReq').toggle(!!op.ownerRequired);
        state.opIndex = layer.open({ type: 1, title: op.title, content: $('#operationBox'), area: ['520px', 'auto'] });
    }
    $('#btnPickOpOwner').on('click', function () {
        customerCommon.userPicker(function (u) {
            state.opOwnerId = u.userId;
            $('#operationOwnerName').val(u.currentName);
        });
    });
    $('#btnOperationSave').on('click', function () {
        var op = OPERATION_MAP[state.operation];
        if (!op) return;
        var options;
        if (op.record) {
            options = {
                'customerAfterSalesRecord.customerAfterSales.asid': state.asid,
                'customerAfterSalesRecord.comment': $('#operationForm [name="operationComment"]').val()
            };
        } else {
            options = {
                'customerAfterSales.asid': state.asid,
                'customerAfterSales.comment': $('#operationForm [name="operationComment"]').val()
            };
            if (op.owner) {
                if (op.ownerRequired && state.opOwnerId == null) {
                    app.showAlert(app.warning, '请选择负责人');
                    return;
                }
                if (state.opOwnerId != null) options['customerAfterSales.owner.userId'] = state.opOwnerId;
            }
        }
        app.post(api.customer[op.api], options, function () {
            app.showAlert(app.success, op.success);
            layer.close(state.opIndex);
            state.opIndex = null;
            query(state.page);
        });
    });
    $('#btnOperationCancel').on('click', function () { layer.close(state.opIndex); state.opIndex = null; });

    // —— 关联 ——
    function openRef(asid) {
        state.asid = asid;
        $('#refForm')[0].reset();
        form.render('select');
        app.clearValidator();
        state.refIndex = layer.open({ type: 1, title: '关联单据', content: $('#refBox'), area: ['420px', 'auto'] });
    }
    $('#btnRefSave').on('click', function () {
        if (app.validate('refForm')) return;
        app.post(api.customer.addCustomerAfterSalesRef, {
            'customerAfterSalesRef.customerAfterSales.asid': state.asid,
            'customerAfterSalesRef.type': $('#refForm [name="refType"]').val(),
            'customerAfterSalesRef.refId': $('#refForm [name="refId"]').val()
        }, function () {
            app.showAlert(app.success, '关联成功');
            layer.close(state.refIndex);
            state.refIndex = null;
        });
    });
    $('#btnRefCancel').on('click', function () { layer.close(state.refIndex); state.refIndex = null; });

    // —— 详情 ——
    function showDetail(asid) {
        state.asid = asid;
        $('#detailInfo').empty();
        $('#recordList').empty();
        $('#refList').empty();

        app.post(api.customer.queryCustomerAfterSalesByAsid, { 'customerAfterSales.asid': asid }, function (res) {
            var v = res.customerAfterSales || {};
            var infos = [
                ['售后编号', v.asNo], ['装修单号', v.orderId], ['客源ID', empty(v.csid)], ['客户ID', empty(v.cid)],
                ['联系人', v.contactName], ['电话', v.phone], ['类型', kv(TYPES, v.type)], ['来源', kv(SOURCES, v.source)],
                ['优先级', kv(PRIORITIES, v.priority)], ['状态', kv(STATUSES, v.status)], ['负责人', username(v.owner)],
                ['创建人', username(v.creater)], ['创建时间', v.createTime], ['更新时间', v.updateTime],
                ['接收时间', v.receiveTime], ['处理时间', v.handleTime], ['完成时间', v.finishTime], ['关闭时间', v.closeTime],
                ['响应时限', v.responseDeadline], ['完成时限', v.finishDeadline], ['责任部门ID', empty(v.did)], ['问题描述', v.content]
            ];
            var html = '';
            $.each(infos, function (i, kv2) {
                html += '<li style="margin:2px 0;"><b>' + kv2[0] + '：<\/b>' + empty(kv2[1]) + '<\/li>';
            });
            $('#detailInfo').html(html);
        }, null, false);

        app.post(api.customer.queryCustomerAfterSalesRecord, { 'customerAfterSalesRecord.customerAfterSales.asid': asid }, function (res) {
            var html = '';
            $.each(res.customerAfterSalesRecords || [], function (i, v) {
                html += '<li style="border:1px solid #eee;border-radius:4px;padding:6px 10px;margin-bottom:6px;">'
                    + '<b style="color:#01AAED;">' + kv(RECORD_TYPES, v.type) + '<\/b>'
                    + '<span style="margin-left:12px;">操作人：' + username(v.operator) + '<\/span>'
                    + '<span style="margin-left:12px;">操作时间：' + empty(v.operateTime) + '<\/span>'
                    + '<span style="margin-left:12px;">原状态：' + (v.oldStatus != null ? kv(STATUSES, v.oldStatus) : '-') + '<\/span>'
                    + '<span style="margin-left:12px;">新状态：' + (v.newStatus != null ? kv(STATUSES, v.newStatus) : '-') + '<\/span>'
                    + '<div style="color:#666;">说明：' + empty(v.comment) + '<\/div><\/li>';
            });
            $('#recordList').html(html || '<li style="color:#999;">无可用数据提供<\/li>');
        }, null, false);

        app.post(api.customer.queryCustomerAfterSalesRef, { 'customerAfterSalesRef.customerAfterSales.asid': asid }, function (res) {
            var html = '';
            $.each(res.customerAfterSalesRefs || [], function (i, v) {
                html += '<li style="border:1px solid #eee;border-radius:4px;padding:6px 10px;margin-bottom:6px;">'
                    + '<b style="color:#01AAED;">' + kv(REF_TYPES, v.type) + '<\/b>'
                    + '<span style="margin-left:12px;">引用ID：' + v.refId + '<\/span>'
                    + '<span style="margin-left:12px;">创建时间：' + empty(v.createTime) + '<\/span><\/li>';
            });
            $('#refList').html(html || '<li style="color:#999;">无可用数据提供<\/li>');
        }, null, false);

        state.detailIndex = layer.open({ type: 1, title: '售后详情', content: $('#detailBox'), area: ['760px', '80%'] });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
});
}); // end app.ready
