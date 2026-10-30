/** app/js/salary/workerBalance.js —— 工人质保金（列表 + 转款/添加 + 扣款/发放/收取/提现/更新上限）
 *  对齐旧 WebContent/js/salary/workerBalance.js。
 *  操作映射：cut=cutWorkerSalary(扣款) push=payWorkerSalary(发放) collect=collectWorkerDeposit(收取质保金)
 *           draw=drawWorkerDeposit(提现质保金) update=updateWorkerBalance(更新上限)
 *           tran=tranWorkerSalary(转款) add=addWorkerBalance(添加) */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, transferIndex: null, addBalanceIndex: null, moneyIndex: null, toplimitIndex: null };

    var STATUS_MAP = { 0: '有效', 1: '无效' };
    var statusColor = { 0: 'layui-bg-green', 1: 'layui-bg-gray' };
    function stB(d) { return '<span class="layui-badge ' + (statusColor[d.status] || 'layui-bg-gray') + '">' + (STATUS_MAP[d.status] || '---') + '<\/span>'; }

    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'user', title: '工人', width: 120, templet: function (d) { return d.user ? (d.user.currentName || d.user.userName || '') : ''; } },
                { field: 'dept', title: '部门', width: 130, templet: function (d) { return (d.user && d.user.dept) ? (d.user.dept.name || '') : ''; } },
                { field: 'duty', title: '工种', width: 110, templet: function (d) { return (d.user && d.user.duty) ? (d.user.duty.name || '') : ''; } },
                { field: 'salary', title: '工费', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.salary); } },
                { field: 'deposit', title: '质保金', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.deposit); } },
                { field: 'toplimit', title: '质保金上限', width: 120, align: 'right', templet: function (d) { return app.formatMoney(d.toplimit); } },
                { field: 'status', title: '状态', width: 90, templet: stB },
                { title: '操作', width: 460, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var e = obj.event, d = obj.data;
            var uid = d.user ? d.user.userId : '';
            if (e === 'cut') openMoney(uid, d.user.currentName || d.user.userName, 'cut', '扣款工费');
            else if (e === 'push') openMoney(uid, d.user.currentName || d.user.userName, 'push', '发放工费');
            else if (e === 'collect') openMoney(uid, d.user.currentName || d.user.userName, 'collect', '收取质保金');
            else if (e === 'draw') openMoney(uid, d.user.currentName || d.user.userName, 'draw', '提现质保金');
            else if (e === 'update') openToplimit(d.wbid);
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
        app.post(api.salary.pageWorkerBalance, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {};
            table.reload('resultTable', { data: pg.data || [] });
            state.total = pg.totalRecords || 0;
            renderPage();
        });
    }
    function renderPage() {
        laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } });
    }

    // ===== 转款 =====
    function openTransfer() {
        app.clearValidator();
        $('#transferForm')[0].reset();
        $('#transferForm [name="sourceId"]').val('');
        $('#transferForm [name="targetId"]').val('');
        $('#workertransferuser').val('');
        $('#workercollectuser').val('');
        state.transferIndex = layer.open({ type: 1, title: '转款', content: $('#transferBox'), area: ['500px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    bindTypeahead('#workertransferuser', '#transferForm [name="sourceId"]');
    bindTypeahead('#workercollectuser', '#transferForm [name="targetId"]');
    function doTransfer() {
        if (app.validate('transferForm')) return;
        var src = $('#transferForm [name="sourceId"]').val();
        var tgt = $('#transferForm [name="targetId"]').val();
        if (!src || !tgt) { app.showAlert(app.warning, '请选择转出/转入人'); return; }
        app.post(api.salary.tranWorkerSalary, {
            sourceId: src,
            targetId: tgt,
            'workerSalary.money': $('#transferForm [name="money"]').val(),
            'workerSalary.comment': $('#transferForm [name="comment"]').val()
        }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.transferIndex); state.transferIndex = null; query(state.page); });
    }

    // ===== 添加质保金 =====
    function openAddBalance() {
        app.clearValidator();
        $('#addBalanceForm')[0].reset();
        $('#addBalanceForm [name="userId"]').val('');
        $('#workerUserName').val('');
        state.addBalanceIndex = layer.open({ type: 1, title: '添加质保金', content: $('#addBalanceBox'), area: ['500px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    bindTypeahead('#workerUserName', '#addBalanceForm [name="userId"]');
    function doAddBalance() {
        var uid = $('#addBalanceForm [name="userId"]').val();
        if (!uid) { app.showAlert(app.warning, '请选择工人'); return; }
        app.post(api.salary.addWorkerBalance, { 'workerBalance.user.userId': uid }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.addBalanceIndex); state.addBalanceIndex = null; query(state.page); });
    }

    // ===== 通用金额弹窗（扣款/发放/收取/提现）=====
    function openMoney(uid, uname, action, title) {
        app.clearValidator();
        $('#moneyForm')[0].reset();
        $('#moneyForm [name="userId"]').val(uid);
        $('#moneyForm [name="action"]').val(action);
        $('#moneyForm [name="userShow"]').val(uname || '');
        state.moneyIndex = layer.open({ type: 1, title: title, content: $('#moneyBox'), area: ['500px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doMoney() {
        if (app.validate('moneyForm')) return;
        var action = $('#moneyForm [name="action"]').val();
        var uid = $('#moneyForm [name="userId"]').val();
        var money = $('#moneyForm [name="money"]').val();
        var comment = $('#moneyForm [name="comment"]').val();
        var apiDef, succMsg, opt = { 'workerSalary.user.userId': uid, 'workerSalary.money': money, 'workerSalary.comment': comment };
        if (action === 'cut') { apiDef = api.salary.cutWorkerSalary; succMsg = '操作成功'; opt['workerSalary.comment'] = money; }
        else if (action === 'push') { apiDef = api.salary.payWorkerSalary; succMsg = '操作成功'; }
        else if (action === 'collect') { apiDef = api.salary.collectWorkerDeposit; succMsg = '收取成功'; }
        else if (action === 'draw') { apiDef = api.salary.drawWorkerDeposit; succMsg = '提现成功'; }
        else return;
        app.post(apiDef, opt, function () { app.showAlert(app.success, succMsg); layer.close(state.moneyIndex); state.moneyIndex = null; query(state.page); });
    }

    // ===== 更新上限 =====
    function openToplimit(wbid) {
        app.clearValidator();
        $('#toplimitForm')[0].reset();
        $('#toplimitForm [name="wbid"]').val(wbid);
        state.toplimitIndex = layer.open({ type: 1, title: '更新上限', content: $('#toplimitBox'), area: ['500px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doToplimit() {
        if (app.validate('toplimitForm')) return;
        app.post(api.salary.updateWorkerBalance, {
            'workerBalance.wbid': $('#toplimitForm [name="wbid"]').val(),
            'workerBalance.toplimit': $('#toplimitForm [name="toplimit"]').val()
        }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.toplimitIndex); state.toplimitIndex = null; query(state.page); });
    }

    // 通用 typeahead 绑定
    function bindTypeahead(inputSel, hiddenSel) {
        var ta = null;
        $(inputSel).on('input', function () {
            var kw = $.trim($(this).val());
            $(hiddenSel).val('');
            clearTimeout(ta);
            if (!kw) return;
            var $self = $(this);
            ta = setTimeout(function () {
                app.post(api.personel.queryUserByPinyin, { pinyinName: kw, 'user.status': 0 }, function (res) {
                    var users = res.autoFillKeyValue || res.users || [];
                    if (users.length === 1) {
                        var u = users[0];
                        $self.val(u.value || u.currentName || u.userName);
                        $(hiddenSel).val(u.key || u.userId);
                    } else if (users.length > 1) showPick(users, inputSel, hiddenSel);
                });
            }, 300);
        });
    }
    function showPick(list, inputSel, hiddenSel) {
        var html = '';
        $.each(list, function (i, u) {
            var k = u.key || u.userId, n = u.value || u.currentName || u.userName || '';
            html += '<div style="padding:6px 8px;cursor:pointer;border-bottom:1px solid #eee;" data-uid="' + k + '" data-name="' + n + '">' + n + (k ? ' (' + k + ')' : '') + '</div>';
        });
        layer.open({ type: 1, title: '选择用户', content: $('<div id="userPick" style="max-height:320px;overflow:auto;">' + html + '</div>'), area: ['320px', 'auto'], success: function () {
            $('#userPick > div').on('click', function () { $(inputSel).val($(this).attr('data-name')); $(hiddenSel).val($(this).attr('data-uid')); layer.closeAll(); });
        } });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnTran').on('click', openTransfer);
    $('#btnAddBalance').on('click', openAddBalance);
    $('#btnTransferSave').on('click', doTransfer);
    $('#btnTransferCancel').on('click', function () { layer.close(state.transferIndex); state.transferIndex = null; });
    $('#btnAddBalanceSave').on('click', doAddBalance);
    $('#btnAddBalanceCancel').on('click', function () { layer.close(state.addBalanceIndex); state.addBalanceIndex = null; });
    $('#btnMoneySave').on('click', doMoney);
    $('#btnMoneyCancel').on('click', function () { layer.close(state.moneyIndex); state.moneyIndex = null; });
    $('#btnToplimitSave').on('click', doToplimit);
    $('#btnToplimitCancel').on('click', function () { layer.close(state.toplimitIndex); state.toplimitIndex = null; });
});
}); // end app.ready
