/** app/js/salary/workerSalary4frame.js —— 工费查询（输入姓名+月份 → 弹窗展示该月工费列表）
 *  对齐旧 WebContent/js/salary/workerSalary4frame.js。
 *  旧页面带触屏软键盘（xfjp，可拖动）+ popup4page 跳转 viewSalaryWindow.html；
 *  纯 layui 版本用原生 input + typeahead 用户选择，结果弹窗内联展示 pageWorkerSalaryByUserId。 */
app.ready(function () {
layui.use(['table', 'laypage', 'laydate', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, laydate = layui.laydate, form = layui.form, layer = layui.layer, $ = layui.jquery;

    var statusMap = {};

    // 月份选择器
    laydate.render({ elem: '#riqi', type: 'month', format: 'yyyy-MM' });

    app.post(api.ds.salary, {}, function (res) { statusMap = kvToMap(res.status); });

    function kvToMap(list) { var m = {}; if (list) for (var i = 0; i < list.length; i++) m[list[i].key] = list[i].value; return m; }

    // 姓名输入：typeahead 选用户
    var ta = null;
    $('#usernames').on('input', function () {
        var kw = $.trim($(this).val());
        $('#queryForm [name="userId"]').val('');
        clearTimeout(ta);
        if (!kw) return;
        ta = setTimeout(function () {
            app.post(api.personel.queryUserByPinyin, { pinyinName: kw, 'user.status': 0 }, function (res) {
                var users = res.autoFillKeyValue || res.users || [];
                if (users.length === 1) {
                    var u = users[0];
                    $('#usernames').val(u.value || u.currentName || u.userName);
                    $('#queryForm [name="userId"]').val(u.key || u.userId);
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
        layer.open({ type: 1, title: '选择用户', content: $('<div id="userPick" style="max-height:320px;overflow:auto;">' + html + '</div>'), area: ['320px', 'auto'], success: function () {
            $('#userPick > div').on('click', function () { $('#usernames').val($(this).attr('data-name')); $('#queryForm [name="userId"]').val($(this).attr('data-uid')); layer.closeAll(); });
        } });
    }

    // 查询按钮：弹窗展示该用户某月工费
    $('#querybtn').on('click', function () {
        var userId = $('#queryForm [name="userId"]').val();
        var username = $.trim($('#usernames').val());
        var riqi = $.trim($('#riqi').val());
        if (!riqi) { app.showAlert(app.warning, '请输入日期后再点击查询!'); return; }
        if (!userId || userId === 'undefined') { app.showAlert(app.warning, '请选择下拉框中您的名字后再点击查询!'); return; }
        var arr = riqi.split('-');
        openView(userId, username, arr[0], arr[1]);
    });

    function openView(userId, username, startY, startM) {
        // 构造查询参数（与旧 workerSalary4query.js 的 filters 一致）
        var startTime = startY + '-' + (startM.length < 2 ? '0' + startM : startM);
        var opt = {
            'filters[0].field': 'userId', 'filters[0].data': userId,
            'filters[1].field': 'startTime', 'filters[1].data': startTime + '-01 00:00:00',
            'filters[2].field': 'endTime', 'filters[2].data': startTime + '-28 23:59:59'
        };
        // 构建弹窗内容
        var $box = $('<div style="padding:10px;"><table id="popupTable"></table><div id="popupPage"></div></div>');
        layer.open({ type: 1, title: username + '工费列表', content: $box, area: ['800px', '600px'], success: function () {
            table.render({ elem: '#popupTable', data: [], page: false, limit: 1000, even: true,
                cols: [[ { type: 'numbers', title: '#', width: 60 },
                    { field: 'salary', title: '薪资', width: 130, align: 'right', templet: function (d) { return app.formatMoney(d.salary); } },
                    { field: 'status', title: '状态', width: 110, templet: function (d) { return '<span class="layui-badge layui-bg-gray">' + (statusMap[d.status] || '---') + '<\/span>'; } },
                    { field: 'createTime', title: '创建时间', width: 180 },
                    { field: 'comment', title: '备注', minWidth: 160 } ]] });
            var pageState = { page: 1, rows: 10, total: 0 };
            function q(page) {
                pageState.page = page || 1;
                app.post(api.salary.pageWorkerSalaryByUserId, $.extend({}, opt, { 'paging.page': pageState.page, 'paging.rows': pageState.rows }), function (res) {
                    var pg = res.paging || {};
                    table.reload('popupTable', { data: pg.data || [] });
                    pageState.total = pg.totalRecords || 0;
                    laypage.render({ elem: 'popupPage', count: pageState.total, curr: pageState.page, limit: pageState.rows, layout: ['count', 'prev', 'page', 'next'], jump: function (o, first) { if (!first) q(o.curr); } });
                });
            }
            q(1);
        } });
    }
});
}); // end app.ready
