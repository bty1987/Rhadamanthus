/** app/js/customer/feedbackGuarantee.js —— 反馈维修（旧 feedbackGuarantee.js → layui）
 *  上下文：app.params.{fid, customer.vid, decoration.orderId}。
 *  添加：addFeedbackGuarantee（渠道/客户类型/部门类型多选/工种多选/品牌/监理等；已有记录时禁止重复添加）
 *  + 图片 addFeedbackDrawing(type=1)；列表：queryFeedbackGuarantee；记录：queryFeedbackRecord；
 *  行操作：图片画廊；编辑（弹 feedbackGuarantee2edit，params.{fid, fgid}）。 */
app.ready(function () {
layui.use(['table', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var fid = customerCommon.ctx('fid') || customerCommon.ctx('customer').vid;
    var orderId = customerCommon.ctx('decoration').orderId;
    var state = { resUrl: null, bid: null, svuid: null, drawingIndex: null, drawingFgid: null };

    if (fid == null || fid === '') { app.showAlert(app.warning, '缺少反馈上下文'); return; }

    $('#g_orderId').val(orderId || '');
    laydate.render({ elem: '#reportedDate', type: 'date' });

    // 装修单信息
    if (orderId) {
        app.post(api.decoration.queryDecorationByOrderId, { 'decorationOrderId': orderId }, function (res) {
            var d = res.decoration;
            if (d) {
                $('#btnBack').after('<span style="margin-left:12px;">装修单号：<b>' + (d.orderId || '') + '<\/b> 客户：<b>'
                    + (d.customer ? d.customer.name : '') + '<\/b><\/span>');
            }
        }, null, false);
    }

    // 部门类型多选
    var deptHtml = '';
    $.each(E.guaranteeDeptType, function (k, v) {
        deptHtml += '<label style="margin-right:12px;white-space:nowrap;"><input type="checkbox" name="deptType" value="' + k + '" title="' + v + '"><\/label>';
    });
    $('#choiceDeptType').html(deptHtml);

    // 工种分组多选（value 为工种明细中文名，按工种分组渲染）
    var WORK_GROUPS = [
        { type: 1, name: '水工', map: E.guaranteePlumberType },
        { type: 2, name: '电工', map: E.guaranteeElectricianType },
        { type: 3, name: '瓦工', map: E.guaranteeTilerType },
        { type: 4, name: '木工', map: E.guaranteeCarpenterType },
        { type: 5, name: '油工', map: E.guaranteePainterType }
    ];
    var workHtml = '';
    $.each(WORK_GROUPS, function (i, g) {
        workHtml += '<div style="margin-bottom:4px;"><b style="margin-right:8px;">' + g.name + '：<\/b>';
        $.each(g.map, function (k, v) {
            workHtml += '<label style="margin-right:12px;white-space:nowrap;"><input type="checkbox" name="workType" value="' + v + '" title="' + v + '"><\/label>';
        });
        workHtml += '<\/div>';
    });
    $('#workTypeChecks').html(workHtml);
    form.render('checkbox');

    // 品牌检索
    $('#brandName').on('input', function () {
        var kw = $.trim($(this).val());
        if (!kw) return;
        app.post(api.data.queryBrandByPinyin, { 'brand.pinyin': kw, 'brand.atttype': 0 }, function (res) {
            var $list = $('#brandList').empty();
            $.each((res.brands || []).slice(0, 10), function (i, b) {
                $('<a style="margin-right:10px;cursor:pointer;color:#01AAED;">').text(b.name).data('bid', b.bid).appendTo($list);
            });
        });
    });
    $('#brandList').on('click', 'a', function () {
        state.bid = $(this).data('bid');
        $('#brandName').val($(this).text());
        $('#brandList').empty();
    });

    // 监理选择
    $('#btnPickSv').on('click', function () {
        customerCommon.userPicker(function (u) {
            state.svuid = u.userId;
            $('#svName').val(u.currentName);
        });
    });

    // 渠道 11平台私聊/12第三方平台 → 升级渠道
    form.on('select(sourceFilter)', function (obj) {
        if (obj.value == 11 || obj.value == 12) $('#upgradeSourceGroup').show();
        else { $('#addForm [name="upgradeSource"]').val(0); $('#upgradeSourceGroup').hide(); }
        form.render('select');
    });

    // —— 添加维修 ——
    app.upload({
        elem: '#btnUpload', url: 'uploadOther.do',
        done: function (res) {
            state.resUrl = res.resUrl;
            app.showImg($('#showImg'), res.resUrl, 60, 60);
        }
    });

    $('#btnAdd').on('click', function () {
        // 已有维修记录时禁止重复添加
        app.post(api.customer.queryFeedbackGuarantee, { 'feedbackGuarantee.fid': fid }, function (res) {
            if ((res.feedbackGuarantees || []).length > 0) {
                app.showAlert(app.error, '已存在维修记录不能再次添加');
                return;
            }
            doAdd();
        });
    });

    function doAdd() {
        if (app.validate('addForm')) return;
        var deptTypes = $('#choiceDeptType input[name="deptType"]:checked').map(function () { return $(this).attr('title'); }).get();
        var workTypes = $('#workTypeChecks input[name="workType"]:checked').map(function () { return $(this).attr('title'); }).get();
        app.post(api.customer.addFeedbackGuarantee, {
            'feedbackGuarantee.fid': fid,
            'feedbackGuarantee.orderId': orderId,
            'feedbackGuarantee.source': $('#addForm [name="source"]').val(),
            'feedbackGuarantee.phone': $('#addForm [name="phone"]').val(),
            'feedbackGuarantee.cutomerType': $('#addForm [name="cutomerType"]').val(),
            'feedbackGuarantee.deptType': deptTypes.join(','),
            'feedbackGuarantee.workType': workTypes.join(','),
            'feedbackGuarantee.content': $('#addForm [name="content"]').val(),
            'feedbackGuarantee.bids': state.bid != null ? state.bid : '',
            'feedbackGuarantee.brands': $('#addForm [name="brandName"]').val(),
            'feedbackGuarantee.reportedDate': $('#addForm [name="reportedDate"]').val(),
            'feedbackGuarantee.renovationYear': $('#addForm [name="renovationYear"]').val(),
            'feedbackGuarantee.supervisor.userId': state.svuid != null ? state.svuid : '',
            'feedbackGuarantee.svUserStatus': $('#addForm [name="svUserStatus"]').val(),
            'feedbackGuarantee.repairResult': $('#addForm [name="repairResult"]').val(),
            'feedbackGuarantee.upgradeSource': $('#addForm [name="upgradeSource"]').val()
        }, function (res) {
            var fgid = res.feedbackGuarantee ? res.feedbackGuarantee.fgid : null;
            if (state.resUrl != null && fgid != null) {
                app.post(api.customer.addFeedbackDrawing, {
                    'feedbackDrawing.fid': fid,
                    'feedbackDrawing.sid': fgid,
                    'feedbackDrawing.path': state.resUrl,
                    'feedbackDrawing.type': 1
                });
            }
            app.showAlert(app.success, '操作成功');
            queryGuarantees();
        });
    }

    // —— 维修列表 ——
    table.render({
        elem: '#guaranteeTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'fid', title: '反馈ID', width: 90 },
            { field: 'orderId', title: '装修单号', width: 110 },
            { field: 'source', title: '渠道', width: 100, templet: function (d) { return E.guaranteeSource[d.source] != null ? E.guaranteeSource[d.source] : ''; } },
            { field: 'upgradeSource', title: '升级渠道', width: 90, templet: function (d) { return E.guaranteeUpgradeSource[d.upgradeSource] != null ? E.guaranteeUpgradeSource[d.upgradeSource] : ''; } },
            { field: 'phone', title: '电话', width: 115 },
            { field: 'cutomerType', title: '客户类型', width: 120, templet: function (d) { return E.guaranteeCustomerType[d.cutomerType] != null ? E.guaranteeCustomerType[d.cutomerType] : ''; } },
            { field: 'deptType', title: '部门类型', width: 110 },
            { field: 'workType', title: '工种', minWidth: 140 },
            { field: 'brands', title: '品牌', width: 100 },
            { field: 'reportedDate', title: '报修日期', width: 110 },
            { field: 'renovationYear', title: '装修年份', width: 90 },
            { field: 'repairResult', title: '维修结果', width: 90, templet: function (d) { return E.guaranteeRepairResult[d.repairResult] != null ? E.guaranteeRepairResult[d.repairResult] : ''; } },
            { field: 'content', title: '内容', minWidth: 180 },
            { title: '操作', width: 140, fixed: 'right', toolbar: '#guaranteeToolbar' }
        ]]
    });
    table.on('tool(guaranteeTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'drawing') {
            managedrawing(v.fgid);
        } else if (obj.event === 'edit') {
            app.params.fid = fid;
            app.params.fgid = v.fgid;
            app.popup(api.index.feedbackGuarantee2editIndex.url, '编辑维修', null, { area: ['85%', '90%'] });
        }
    });
    if (!$('#guaranteeToolbar').length) {
        $('body').append(
            '<script type="text/html" id="guaranteeToolbar">'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="drawing">图片</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="edit">编辑</button>'
            + '<\/script>'
        );
    }

    // —— 反馈记录 ——
    table.render({
        elem: '#recordTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'feedback', title: '装修单号', width: 120, templet: function (d) { return d.feedback ? (d.feedback.orderId || '') : ''; } },
            { field: 'handler', title: '处理人', width: 110, templet: function (d) { return d.handler ? (d.handler.userName || '') : ''; } },
            { field: 'feedback', title: '状态', width: 80, templet: function (d) { return customerCommon.badge(E.feedbackStatus, d.feedback ? d.feedback.status : null); } },
            { field: 'operateTime', title: '处理时间', width: 165 },
            { field: 'comment', title: '备注', minWidth: 200 }
        ]]
    });

    function queryGuarantees() {
        app.post(api.customer.queryFeedbackGuarantee, { 'feedbackGuarantee.fid': fid }, function (res) {
            table.reload('guaranteeTable', { data: res.feedbackGuarantees || [] });
        });
    }
    function queryRecords() {
        app.post(api.customer.queryFeedbackRecord, { 'feedbackRecord.feedback.fid': fid }, function (res) {
            table.reload('recordTable', { data: res.feedbackRecords || [] });
        });
    }
    queryGuarantees();
    queryRecords();

    // —— 图片管理 ——
    function managedrawing(fgid) {
        state.drawingFgid = fgid;
        $('#feedbackDrawing').empty();
        state.drawingIndex = layer.open({ type: 1, title: '维修图片', content: $('#drawingBox'), area: ['640px', 'auto'] });
        app.post(api.customer.queryFeedbackDrawingBySid, { 'feedbackDrawing.sid': fgid }, function (res) {
            $.each(res.feedbackDrawings || [], function (i, d) { appendGallery(d); });
        }, null, false);
    }
    function appendGallery(d) {
        var src = /^[a-z]+:\/\//.test(d.path || '') ? d.path : (app.config.media || '') + (d.path || '');
        var $li = $('<li style="display:inline-block;margin:8px;position:relative;"></li>').attr('id', 'imgLi_' + d.fdid).appendTo('#feedbackDrawing');
        $li.append('<a href="' + src + '" target="_blank"><img src="' + src + '" width="160" height="160" style="object-fit:cover;"><\/a>');
        $li.append('<div style="text-align:center;font-size:12px;">' + (d.name || '') + ' ' + (d.createTime || '') + '<\/div>');
        $li.append('<button type="button" class="layui-btn layui-btn-danger layui-btn-xs" style="position:absolute;top:2px;right:2px;" data-fdid="' + d.fdid + '"><i class="layui-icon layui-icon-delete"><\/i><\/button>');
    }
    app.upload({
        elem: '#btnDrawingUpload', url: 'uploadOther.do',
        done: function (res) {
            app.post(api.customer.addFeedbackDrawing, {
                'feedbackDrawing.fid': fid,
                'feedbackDrawing.sid': state.drawingFgid,
                'feedbackDrawing.path': res.resUrl,
                'feedbackDrawing.type': 1
            }, function (r) {
                appendGallery(r.feedbackDrawing);
            });
        }
    });
    $('#feedbackDrawing').on('click', 'button[data-fdid]', function () {
        var fdid = $(this).data('fdid');
        app.post(api.customer.deleteFeedbackDrawing, { 'feedbackDrawing.fdid': fdid }, function () {
            $('#imgLi_' + fdid).remove();
        });
    });

    $('#btnBack').on('click', function () {
        try {
            if (parent && parent.layui) parent.layui.layer.closeAll();
            else app.switchPage(api.index.feedbackIndex.url);
        } catch (e) { app.switchPage(api.index.feedbackIndex.url); }
    });
});
}); // end app.ready
