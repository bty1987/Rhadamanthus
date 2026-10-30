/** app/js/salary/salary4common.js —— 薪资汇总（5 个子列表 + 按月切换）
 *  对齐旧 WebContent/js/salary/salary4common.js。
 *  顶部用户信息 + 近 6 个月快捷按钮；底部 5 个独立分页表格：
 *    0: pageSalary 1: pageWithhold 2: pageDecorationSalary 3: pageMaterialSalary 4: pageWorkerSalary */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, $ = layui.jquery;
    var ctx = {
        userId: '',
        dateTime: '',
        decoOrderId: '', matOrderId: '', matSalesNo: ''
    };
    var stMap = { state: {}, salaryType: {}, twoType: {}, withholdStatus: {}, withholdType: {}, salaryStatus: {}, salaryTwotype: {} };

    // 当前登录用户作为默认（旧页面支持 params.salary.belonger.userId 覆盖）
    ctx.userId = (app.params.userInfo && app.params.userInfo.user) ? app.params.userInfo.user.userId : '';
    if (app.params.salary && app.params.salary.belonger && app.params.salary.belonger.userId) ctx.userId = app.params.salary.belonger.userId;

    // 近 6 个月
    var times = [];
    var now = new Date();
    var year = now.getFullYear(), month = now.getMonth() + 1;
    for (var i = 0; i < 6; i++) {
        times.push({ year: year, month: month });
        month -= 1;
        if (month <= 0) { month = 12; year -= 1; }
    }
    // 默认本月
    var cur = times[0];
    ctx.dateTime = cur.year + '-' + (cur.month < 10 ? '0' + cur.month : cur.month) + '-01';

    // 渲染月份按钮
    var $dateBtn = $('#dateBtn');
    $.each(times, function (i, v) {
        var label = v.year + '-' + (v.month < 10 ? '0' + v.month : v.month);
        $dateBtn.append('<button type="button" class="layui-btn layui-btn-sm layui-btn-primary" data-y="' + v.year + '" data-m="' + v.month + '" style="margin:4px;">' + label + '</button>');
    });
    $dateBtn.on('click', 'button', function () {
        var y = $(this).attr('data-y'), m = parseInt($(this).attr('data-m'), 10);
        ctx.dateTime = y + '-' + (m < 10 ? '0' + m : m) + '-01';
        queryAll();
    });

    // 加载枚举
    app.post(api.ds.salary, {}, function (res) {
        stMap.salaryStatus = kvToMap(res.status);
        stMap.salaryType = idToMap(res.type);
        stMap.twoType = idToMap(res.twoType);
        stMap.withholdStatus = kvToMap(res.withholdStatus);
        stMap.withholdType = kvToMap(res.withholdType);
        stMap.salaryTwotype = keyToName(res.SalaryTwoType);
        stMap.state = kvToMap(res.status);
        drawUser();
        initAll();
        queryAll();
    });

    function kvToMap(list) { var m = {}; if (list) for (var i = 0; i < list.length; i++) m[list[i].key] = list[i].value; return m; }
    function idToMap(list) { var m = {}; if (list) for (var i = 0; i < list.length; i++) m[list[i].id] = list[i].name; return m; }
    function keyToName(list) { var m = {}; if (list) for (var i = 0; i < list.length; i++) m[list[i].key] = list[i].name; return m; }

    // 显示用户信息
    function drawUser() {
        if (!ctx.userId) { $('#userInfoBox').html('未指定用户'); return; }
        app.post(api.personel.queryUserInfoByUserId, { 'userInfo.user.userId': ctx.userId }, function (res) {
            var u = res.userInfo.user || {};
            $('#userInfoBox').html(
                '<div>编号: ' + (u.userId || '') + '</div>' +
                '<div>姓名: ' + (u.currentName || '') + '</div>' +
                '<div>职位: ' + (u.duty ? (u.duty.name || '') : '') + '</div>' +
                '<div>电话: ' + (u.phone || '') + '</div>'
            );
        });
    }

    function initAll() {
        // 0: 薪资
        table.render({ elem: '#resultTable0', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 50 },
                { field: 'type', title: '类型', width: 100, templet: function (d) { return stMap.salaryType[d.type] || '---'; } },
                { field: 'money', title: '金额', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.money); } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return stMap.salaryStatus[d.status] || '---'; } },
                { field: 'operateTime', title: '操作时间', width: 170 },
                { field: 'comment', title: '说明', minWidth: 140 } ]] });
        // 1: 扣款
        table.render({ elem: '#resultTable1', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 50 },
                { field: 'type', title: '类型', width: 100, templet: function (d) { return stMap.withholdType[d.type] || '---'; } },
                { field: 'money', title: '金额', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.money); } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'operateTime', title: '操作时间', width: 170 },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return stMap.withholdStatus[d.status] || '---'; } },
                { field: 'comment', title: '说明', minWidth: 140 } ]] });
        // 2: 装修提成
        table.render({ elem: '#resultTable2', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 50 },
                { field: 'orderId', title: '装修单号', width: 120, templet: function (d) { return d.decoration ? (d.decoration.orderId || '') : ''; } },
                { field: 'money', title: '金额', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.money); } },
                { field: 'rate', title: '比例', width: 90 },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'comment', title: '备注', minWidth: 140 } ]] });
        // 3: 主材提成
        table.render({ elem: '#resultTable3', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 50 },
                { field: 'orderId', title: '装修单号', width: 120, templet: function (d) { return d.decoration ? (d.decoration.orderId || '') : ''; } },
                { field: 'no', title: '销售单号', width: 130, templet: function (d) { return d.sales ? (d.sales.no || '') : ''; } },
                { field: 'money', title: '金额', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.money); } },
                { field: 'rate', title: '比例', width: 90 },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'comment', title: '备注', minWidth: 140 } ]] });
        // 4: 工人工费
        table.render({ elem: '#resultTable4', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 50 },
                { field: 'orderId', title: '装修单号', width: 120, templet: function (d) { return d.decoration ? (d.decoration.orderId || '') : ''; } },
                { field: 'twotype', title: '类型', width: 110, templet: function (d) { return stMap.salaryTwotype[d.twotype] || '---'; } },
                { field: 'money', title: '操作金额', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.type == 0 ? d.money : -d.money); } },
                { field: 'salary', title: '工费', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.type == 0 ? d.salary : -d.salary); } },
                { field: 'deposit', title: '质保金', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.type == 0 ? d.deposit : -d.deposit); } },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return stMap.salaryStatus[d.status] || '---'; } } ]] });
    }

    function queryAll() { query0(); query1(); query2(); query3(); query4(); }

    function query0() {
        app.post(api.salary.pageSalary, { 'salary.user.userId': ctx.userId, 'salary.createTime': ctx.dateTime, 'paging.page': 1, 'paging.rows': 100 }, function (res) {
            var pg = res.paging || {}; table.reload('resultTable0', { data: pg.data || [] });
        });
    }
    function query1() {
        app.post(api.salary.pageWithhold, { 'withhold.user.userId': ctx.userId, 'withhold.createTime': ctx.dateTime, 'paging.page': 1, 'paging.rows': 100 }, function (res) {
            var pg = res.paging || {}; table.reload('resultTable1', { data: pg.data || [] });
        });
    }
    function query2() {
        var opt = { 'decorationSalary.belonger.userId': ctx.userId, 'decorationSalary.createTime': ctx.dateTime, 'paging.page': 1, 'paging.rows': 100 };
        if (ctx.decoOrderId) opt['filters[0].field'] = 'orderId', opt['filters[0].data'] = ctx.decoOrderId, opt['filters[0].op'] = 'eq';
        app.post(api.salary.pageDecorationSalary, opt, function (res) {
            var pg = res.paging || {}; table.reload('resultTable2', { data: pg.data || [] });
        });
    }
    function query3() {
        var opt = { 'materialSalary.belonger.userId': ctx.userId, 'materialSalary.createTime': ctx.dateTime, 'paging.page': 1, 'paging.rows': 100 };
        var c = 0;
        if (ctx.matOrderId) { opt['filters[' + c + '].field'] = 'orderId'; opt['filters[' + c + '].data'] = ctx.matOrderId; opt['filters[' + c + '].op'] = 'eq'; c++; }
        if (ctx.matSalesNo) { opt['filters[' + c + '].field'] = 'no'; opt['filters[' + c + '].data'] = ctx.matSalesNo; opt['filters[' + c + '].op'] = 'eq'; c++; }
        app.post(api.salary.pageMaterialSalary, opt, function (res) {
            var pg = res.paging || {}; table.reload('resultTable3', { data: pg.data || [] });
        });
    }
    function query4() {
        app.post(api.salary.pageWorkerSalary, { 'workerSalary.user.userId': ctx.userId, 'workerSalary.createTime': ctx.dateTime, 'paging.page': 1, 'paging.rows': 100 }, function (res) {
            var pg = res.paging || {}; table.reload('resultTable4', { data: pg.data || [] });
        });
    }

    $('#btnSearch2').on('click', function () { ctx.decoOrderId = $.trim($('#decoOrderId').val()); query2(); });
    $('#btnSearch3').on('click', function () { ctx.matOrderId = $.trim($('#matOrderId').val()); ctx.matSalesNo = $.trim($('#matSalesNo').val()); query3(); });
});
}); // end app.ready
