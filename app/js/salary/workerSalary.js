/** app/js/salary/workerSalary.js —— 工人工费（列表 + 创建/导入/批量通过/批量通知/按时间通过 + 通过/驳回/撤销/通知/备注/图片/质检）
 *  对齐旧 WebContent/js/salary/workerSalary.js。
 *  pagetype=checker 为质检模式（仅显示质检按钮）。
 *  注：金蝶同步（kingdeeUtils.workerSalary）在纯 layui 版本不迁移。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'laydate', 'upload', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, laydate = layui.laydate, $ = layui.jquery;
    var state = {
        page: 1, rows: 10, total: 0, checker: false,
        editIndex: null, batchSendIndex: null, batchAdoptIndex: null, importIndex: null,
        annotateIndex: null, drawingIndex: null, currentWsid: null
    };

    var STATUS_MAP = { 0: '初始', 1: '通过', 2: '驳回', 3: '撤销' };
    var statusColor = { 0: 'layui-bg-gray', 1: 'layui-bg-green', 2: 'layui-bg-red', 3: 'layui-bg-orange' };
    var TYPE_MAP = { 0: '加', 1: '减' };
    var SEND_MAP = { 0: '未发送', 1: '待发送', 2: '已发送' };
    var CHECK_MAP = { 0: '初始', 1: '确认' };
    var PLAN_MAP = { 0: '标准', 1: '计划' };
    var salaryStatus = {}, typeMap = {}, oneTypeMap = {}, twoTypeMap = {}, projectStatusMap = {};
    var SalaryTwoTypeList = [];

    function stB(d) { return '<span class="layui-badge ' + (statusColor[d.status] || 'layui-bg-gray') + '">' + (STATUS_MAP[d.status] || '---') + '<\/span>'; }

    // 日期选择器
    laydate.render({ elem: '#batchSendBegin' });
    laydate.render({ elem: '#batchSendFinish' });
    laydate.render({ elem: '#batchAdoptBegin' });
    laydate.render({ elem: '#batchAdoptFinish' });

    app.post(api.ds.salary, {}, function (res) {
        salaryStatus = kvToMap(res.status);
        typeMap = idToMap(res.type);
        oneTypeMap = idToMap(res.oneType);
        SalaryTwoTypeList = res.SalaryTwoType || [];
        // 启用项（status==0）填充二类下拉
        var $sub = $('#workersalarySubtype');
        $sub.html('<option value="">请选择</option>');
        for (var i = 0; i < SalaryTwoTypeList.length; i++) {
            var v = SalaryTwoTypeList[i];
            if (v.status != 0) continue;
            $sub.append('<option value="' + v.key + '">' + v.name + '</option>');
        }
        twoTypeMap = keyToName(SalaryTwoTypeList);
        form.render('select');
        initTable(); query(1);
    });

    function kvToMap(list) { var m = {}; if (list) for (var i = 0; i < list.length; i++) m[list[i].key] = list[i].value; return m; }
    function idToMap(list) { var m = {}; if (list) for (var i = 0; i < list.length; i++) m[list[i].id] = list[i].name; return m; }
    function keyToName(list) { var m = {}; if (list) for (var i = 0; i < list.length; i++) m[list[i].key] = list[i].name; return m; }

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'checkbox', width: 50 },
                { type: 'numbers', title: '#', width: 50 },
                { field: 'orderId', title: '装修单号', width: 120, templet: function (d) { return d.decoration ? (d.decoration.orderId || '') : ''; } },
                { field: 'village', title: '楼盘', width: 110, templet: function (d) { return (d.decoration && d.decoration.house && d.decoration.house.village) ? (d.decoration.house.village.name || '') : ''; } },
                { field: 'houseNumber', title: '楼号', width: 90, templet: function (d) { return (d.decoration && d.decoration.house) ? (d.decoration.house.houseNumber || '') : ''; } },
                { field: 'supervisor', title: '监理', width: 100, templet: function (d) { return (d.decoration && d.decoration.supervisor) ? (d.decoration.supervisor.userName || '') : ''; } },
                { field: 'workerId', title: '工人工号', width: 100, templet: function (d) { return d.user ? (d.user.userId || '') : ''; } },
                { field: 'workerName', title: '工人姓名', width: 100, templet: function (d) { return d.user ? (d.user.currentName || '') : ''; } },
                { field: 'dutyName', title: '工种', width: 100, templet: function (d) { return (d.user && d.user.duty) ? (d.user.duty.name || '') : ''; } },
                { field: 'type', title: '类型', width: 80, templet: function (d) { return TYPE_MAP[d.type] || '---'; } },
                { field: 'twotype', title: '二类', width: 110, templet: function (d) { return twoTypeMap[d.twotype] || '---'; } },
                { field: 'money', title: '操作金额', width: 100, align: 'right', templet: function (d) { return app.formatMoney(d.type == 0 ? d.money : -d.money); } },
                { field: 'salary', title: '工费', width: 100, align: 'right', templet: function (d) { return app.formatMoney(d.type == 0 ? d.salary : -d.salary); } },
                { field: 'deposit', title: '质保金', width: 100, align: 'right', templet: function (d) { return app.formatMoney(d.type == 0 ? d.deposit : -d.deposit); } },
                { field: 'status', title: '状态', width: 90, templet: stB },
                { field: 'isSend', title: '消息', width: 90, templet: function (d) { return '<span class="layui-badge layui-bg-blue">' + (SEND_MAP[d.isSend] || '---') + '<\/span>'; } },
                { field: 'isCheck', title: '质检状态', width: 100, templet: function (d) { return '<span class="layui-badge ' + (d.isCheck == 1 ? 'layui-bg-green' : 'layui-bg-gray') + '">' + (CHECK_MAP[d.isCheck] || '---') + '<\/span>'; } },
                { field: 'isPlan', title: '工费类型', width: 100, templet: function (d) { return PLAN_MAP[d.isPlan] || '---'; } },
                { field: 'creater', title: '创建人', width: 100, templet: function (d) { return d.creater ? (d.creater.userName || '') : ''; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'approver', title: '审批人', width: 100, templet: function (d) { return d.approver ? (d.approver.currentName || '') : ''; } },
                { field: 'approveTime', title: '审批时间', width: 170 },
                { field: 'totalArea', title: '总面积', width: 90, templet: function (d) { return (d.decoration && d.decoration.house) ? (d.decoration.house.totalArea || '') : ''; } },
                { field: 'annotate', title: '备注', minWidth: 140 },
                { title: '操作', width: 620, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var e = obj.event, d = obj.data;
            if (e === 'adopt') adoptOne(d);
            else if (e === 'refuse') refuse(d);
            else if (e === 'cancel') deleteByStatus(d);
            else if (e === 'send') send(d);
            else if (e === 'cancelSend') cancelSend(d);
            else if (e === 'annotate') openAnnotate(d);
            else if (e === 'drawing') openDrawing(d);
            else if (e === 'check') check(d);
        });
    }

    function buildFilters() {
        var p = {}, c = 0;
        $('#searchForm [name]').each(function () {
            var v = $.trim($(this).val()); if (!v) return;
            p['filters[' + c + '].field'] = $(this).attr('name');
            p['filters[' + c + '].data'] = v;
            p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn';
            c++;
        });
        return p;
    }
    function query(page) {
        state.page = page || 1;
        app.post(api.salary.pageWorkerSalary, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {};
            table.reload('resultTable', { data: pg.data || [] });
            state.total = pg.totalRecords || 0;
            renderPage();
        });
    }
    function renderPage() {
        laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } });
    }

    // ===== 创建 =====
    function openEdit() {
        app.clearValidator();
        $('#editForm')[0].reset();
        $('#editForm [name="userId"]').val('');
        $('#workersalaryuser').val('');
        form.render('select');
        state.editIndex = layer.open({ type: 1, title: '创建工人工费', content: $('#editBox'), area: ['600px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    var ta = null;
    $('#workersalaryuser').on('input', function () {
        var kw = $.trim($(this).val());
        $('#editForm [name="userId"]').val('');
        clearTimeout(ta);
        if (!kw) return;
        ta = setTimeout(function () {
            app.post(api.personel.queryUserByPinyin, { pinyinName: kw, 'user.status': 0 }, function (res) {
                var users = res.autoFillKeyValue || res.users || [];
                if (users.length === 1) {
                    var u = users[0];
                    $('#workersalaryuser').val(u.value || u.currentName || u.userName);
                    $('#editForm [name="userId"]').val(u.key || u.userId);
                } else if (users.length > 1) showPick(users);
            });
        }, 300);
    });
    function showPick(list) {
        var html = '';
        $.each(list, function (i, u) {
            var k = u.key || u.userId, n = u.value || u.currentName || u.userName || '';
            html += '<div style="padding:6px 8px;cursor:pointer;border-bottom:1px solid #eee;" data-uid="' + k + '" data-name="' + n + '">' + n + (k ? ' (' + k + ')' : '') + '</div>';
        });
        layer.open({ type: 1, title: '选择工人', content: $('<div id="userPick" style="max-height:320px;overflow:auto;">' + html + '</div>'), area: ['320px', 'auto'], success: function () {
            $('#userPick > div').on('click', function () { $('#workersalaryuser').val($(this).attr('data-name')); $('#editForm [name="userId"]').val($(this).attr('data-uid')); layer.closeAll(); });
        } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var uid = $('#editForm [name="userId"]').val();
        if (!uid) { app.showAlert(app.warning, '请选择工人'); return; }
        var subtype = $('#editForm [name="subtype"]').val();
        if (!subtype) { app.showAlert(app.warning, '请选择二类'); return; }
        // 通过 subtype 反查 onetype
        var onetype = '';
        for (var i = 0; i < SalaryTwoTypeList.length; i++) {
            if (SalaryTwoTypeList[i].key == subtype) { onetype = SalaryTwoTypeList[i].oneType; break; }
        }
        app.post(api.salary.addWorkerSalary, {
            'workerSalary.user.userId': uid,
            'workerSalary.money': $('#editForm [name="money"]').val(),
            'workerSalary.onetype': onetype,
            'workerSalary.twotype': subtype,
            'workerSalary.comment': $('#editForm [name="comment"]').val()
        }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }

    // ===== 行操作 =====
    function adoptOne(d) { app.showConfirm('确认通过?', function () { app.post(api.salary.adoptWorkerSalary, { 'workerSalarys[0].wsid': d.wsid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); }); }); }
    function refuse(d) { app.showConfirm('确认驳回?', function () { app.post(api.salary.rejectWorkerSalary, { 'workerSalary.wsid': d.wsid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); }); }); }
    function deleteByStatus(d) { app.showConfirm('确认撤销?', function () { app.post(api.salary.deleteWorkerSalary, { 'workerSalary.wsid': d.wsid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); }); }); }
    function send(d) { app.post(api.salary.sendWorkerSalary, { 'workerSalary.wsid': d.wsid }, function () { app.showAlert(app.success, '已发送'); query(state.page); }); }
    function cancelSend(d) { app.showConfirm('确认取消通知?', function () { app.post(api.salary.cancelWorkerSalary, { 'workerSalary.wsid': d.wsid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); }); }); }
    function check(d) { app.post(api.salary.checkWsorkerSalary, { 'workerSalary.wsid': d.wsid }, function () { app.showAlert(app.success, '已质检'); query(state.page); }); }

    // ===== 批量通过 =====
    function batchAdopt() {
        var ck = table.checkStatus('resultTable').data;
        if (!ck.length) { app.showAlert(app.warning, '请选择工人工费信息'); return; }
        var opt = {}, hasTransfer = false;
        for (var i = 0; i < ck.length; i++) {
            opt['workerSalarys[' + i + '].wsid'] = ck[i].wsid;
            // 转款不允许批量通过（旧逻辑用 cwsid 判定）
        }
        app.post(api.salary.adoptWorkerSalary, opt, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
    }

    // ===== 批量通知 =====
    function openBatchSend() {
        app.clearValidator();
        $('#batchSendForm')[0].reset();
        state.batchSendIndex = layer.open({ type: 1, title: '批量通知', content: $('#batchSendBox'), area: ['500px', 'auto'] });
    }
    function doBatchSend() {
        var b = $('#batchSendForm [name="beginTime"]').val();
        var f = $('#batchSendForm [name="finishTime"]').val();
        if (!b || !f) { app.showAlert(app.warning, '请填写时间范围'); return; }
        app.post(api.salary.batchWorkerSalary, {
            'workerSalary.createTime': b + ' 00:00:00',
            'workerSalary.finishTime': f + ' 23:59:59'
        }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.batchSendIndex); state.batchSendIndex = null; query(state.page); });
    }

    // ===== 按时间通过 =====
    function openBatchAdopt() {
        app.clearValidator();
        $('#batchAdoptForm')[0].reset();
        state.batchAdoptIndex = layer.open({ type: 1, title: '按时间通过', content: $('#batchAdoptBox'), area: ['500px', 'auto'] });
    }
    function doBatchAdopt() {
        var b = $('#batchAdoptForm [name="adoptBeginTime"]').val();
        var f = $('#batchAdoptForm [name="adoptFinishTime"]').val();
        if (!b || !f) { app.showAlert(app.warning, '请填写时间范围'); return; }
        app.post(api.salary.adoptWorkerSalaryForTimeRange, {
            'workerSalary.createTime': b + ' 00:00:00',
            'workerSalary.finishTime': f + ' 23:59:59'
        }, function () { app.showAlert(app.success, '按时间范围批量通过操作成功'); layer.close(state.batchAdoptIndex); state.batchAdoptIndex = null; query(state.page); });
    }

    // ===== 导入 =====
    function openImport() {
        state.importIndex = layer.open({ type: 1, title: '导入工费', content: $('#importBox'), area: ['500px', 'auto'] });
    }
    app.uploadFile({
        elem: '#btnImportUpload',
        url: 'importWorkerSalary.do',
        accept: 'file',
        exts: 'xls|xlsx',
        data: { uploadType: 4 },
        done: function (res) {
            app.showAlert(app.success, '导入成功');
            layer.close(state.importIndex); state.importIndex = null;
            query(state.page);
        }
    });

    // ===== 导出（用 layui table.exportFile 导出当前查询结果 CSV）=====
    function doExport() {
        if (state.total === 0) { app.showAlert(app.warning, '请通过条件进行查询'); return; }
        if (state.total > 5000) { app.showAlert(app.warning, '查询结果大于阀值 , 不能完成导出动作'); return; }
        // 先 noPage 拉取全量，再调 layui table 导出
        app.post(api.salary.pageWorkerSalary, $.extend({}, buildFilters(), { 'paging.noPage': 1 }), function (res) {
            var list = (res.paging && res.paging.data) || [];
            table.reload('resultTable', { data: list });
            table.exportFile('resultTable', list, 'csv', '工人工费');
            // 导出后切回当前页
            query(state.page);
        });
    }

    // ===== 备注 =====
    function openAnnotate(d) {
        app.clearValidator();
        $('#annotateForm')[0].reset();
        $('#annotateForm [name="wsid"]').val(d.wsid);
        $('#annotateForm [name="annotate"]').val(d.annotate || '');
        state.annotateIndex = layer.open({ type: 1, title: '工费备注', content: $('#annotateBox'), area: ['500px', 'auto'] });
    }
    function doAnnotate() {
        app.post(api.salary.updateWorkerSalary, {
            'workerSalary.wsid': $('#annotateForm [name="wsid"]').val(),
            'workerSalary.annotate': $('#annotateForm [name="annotate"]').val()
        }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.annotateIndex); state.annotateIndex = null; query(state.page); });
    }

    // ===== 图片管理 =====
    function openDrawing(d) {
        state.currentWsid = d.wsid;
        $('#workerDrawing').html('');
        state.drawingIndex = layer.open({ type: 1, title: '工费图片', content: $('#drawingBox'), area: ['700px', '500px'] });
        loadDrawings(d.wsid);
    }
    function loadDrawings(wsid) {
        app.post(api.salary.querySalaryDrawing, { 'salaryDrawing.sid': wsid, 'salaryDrawing.type': 0 }, function (res) {
            var pics = res.salaryDrawings || [];
            for (var i = 0; i < pics.length; i++) appendGallery(pics[i]);
        });
    }
    function appendGallery(value) {
        var $li = $('<li class="layui-col-sm4" style="text-align:center;padding:5px;position:relative;"></li>').attr('id', 'gallery_li' + value.sdid);
        var $a = $('<a target="_blank"></a>').attr('href', /^https?:/.test(value.drawingUrl) ? value.drawingUrl : (app.config.media + value.drawingUrl)).css({ display: 'inline-block', height: '150px' });
        var $img = $('<img/>').css({ width: '150px', height: '150px' });
        app.showImg($img, value.drawingUrl, 150, 150);
        $a.append($img).appendTo($li);
        var $del = $('<a href="javascript:;" style="position:absolute;right:0;top:0;color:#FF5722;"><i class="layui-icon layui-icon-close-fill"></i></a>');
        $del.on('click', function () {
            app.post(api.salary.deleteSalaryDrawing, { 'salaryDrawing.sdid': value.sdid }, function () { $('#gallery_li' + value.sdid).remove(); });
        });
        $li.append($del);
        $('#workerDrawing').append($li);
    }
    app.uploadImage({
        elem: '#btnDrawingUpload',
        data: { uploadType: 0 },
        done: function (res) {
            app.post(api.salary.addSalaryDrawing, {
                'salaryDrawing.sid': state.currentWsid,
                'salaryDrawing.name': res.strutsUploadsFileName,
                'salaryDrawing.drawingUrl': res.resUrl,
                'salaryDrawing.drawingType': 0,
                'salaryDrawing.type': 0,
                'salaryDrawing.filesize': res.filesize
            }, function (r) {
                appendGallery(r.salaryDrawing);
                query(state.page);
            });
        }
    });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', openEdit);
    $('#btnAdopt').on('click', batchAdopt);
    $('#btnBatchSend').on('click', openBatchSend);
    $('#btnBatchAdopt').on('click', openBatchAdopt);
    $('#btnImport').on('click', openImport);
    $('#btnExport').on('click', doExport);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
    $('#btnBatchSendGo').on('click', doBatchSend);
    $('#btnBatchSendCancel').on('click', function () { layer.close(state.batchSendIndex); state.batchSendIndex = null; });
    $('#btnBatchAdoptGo').on('click', doBatchAdopt);
    $('#btnBatchAdoptCancel').on('click', function () { layer.close(state.batchAdoptIndex); state.batchAdoptIndex = null; });
    $('#btnAnnotateSave').on('click', doAnnotate);
    $('#btnAnnotateCancel').on('click', function () { layer.close(state.annotateIndex); state.annotateIndex = null; });
});
}); // end app.ready
