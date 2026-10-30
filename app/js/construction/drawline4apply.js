/** app/js/construction/drawline4apply.js —— 放线申请（drawLine.status=0 排队单处理）
 *  行按钮：信息/预放线(pretreatDrawLine)/更新(updateDrawLine)/放线排期(resetDrawLine)/重置(failureDrawLine)。
 *  申请信息：月历（旧 fullCalendar → 自绘月历，countDrawLine 每日放线数）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var E = constructionCommon.ENUM;
    var pageConfig = constructionCommon.getPageConfig('drawline4apply');
    var state = { page: 1, rows: 10, total: 0, dlid: null, orderId: null, infoOrderId: null, calDate: new Date() };
    if (!pageConfig.apiPage) pageConfig.apiPage = api.construction.pageDrawLine;

    function btnVisible(key) { return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.indexOf(key) != -1; }

    constructionCommon.dateRange('#applayTime');
    constructionCommon.dateRange('#actualDate');
    laydate.render({ elem: '#applayTimeInput', format: 'yyyy-MM-dd' });
    laydate.render({ elem: '#actualDateInput', format: 'yyyy-MM-dd' });
    ['finishTime', 'keyTime', 'drawlineTime', 'designTime'].forEach(function (id) {
        laydate.render({ elem: '#' + id, format: 'yyyy-MM-dd' });
    });

    // 放线组下拉
    app.post(api.data.queryDrawlineGroup, {}, function (res) {
        var html = '';
        $.each(res.drawLineGroups || [], function (i, g) { html += '<option value="' + g.gid + '">' + g.name + '<\/option>'; });
        $('#drawLineGroup').html(html);
        form.render('select');
    }, null, false);

    function money(v) { return app.formatMoney(v); }
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'orderId', title: '装修单', width: 115, fixed: 'left', templet: function (d) { return d.decoration ? d.decoration.orderId : ''; } },
            { field: 'village', title: '楼盘', width: 105, templet: function (d) { return d.decoration && d.decoration.house && d.decoration.house.village ? d.decoration.house.village.name : ''; } },
            { field: 'houseNumber', title: '楼号', width: 80, templet: function (d) { return d.decoration && d.decoration.house ? d.decoration.house.houseNumber : ''; } },
            { field: 'customer', title: '客户', width: 80, templet: function (d) { return d.decoration && d.decoration.customer ? d.decoration.customer.name : ''; } },
            { field: 'designer', title: '设计师', width: 80, templet: function (d) { return d.decoration && d.decoration.designer ? d.decoration.designer.currentName : ''; } },
            { field: 'supervisor', title: '监理', width: 80, templet: function (d) { return d.decoration && d.decoration.supervisor ? d.decoration.supervisor.currentName : ''; } },
            { field: 'buildArea', title: '面积', width: 80, templet: function (d) { return d.decoration && d.decoration.house ? d.decoration.house.buildArea : ''; } },
            { field: 'orderTotalPrice', title: '合同额', width: 90, templet: function (d) { return d.decoration ? money(d.decoration.orderTotalPrice) : ''; } },
            { field: 'version', title: '报价版本', width: 85, templet: function (d) { return d.decoration && d.decoration.version ? d.decoration.version.name : ''; } },
            { field: 'appler', title: '申请人', width: 80, templet: function (d) { return d.appler ? d.appler.currentName : ''; } },
            { field: 'applayTime', title: '申请时间', width: 150, templet: function (d) { return (d.applayTime || '').substring(0, 16); } },
            { field: 'count', title: '放线次数', width: 85 },
            { field: 'content', title: '描述', minWidth: 130 },
            { title: '操作', width: 300, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    var BTNS = [];
    function reg(ev, name, show, handle) { BTNS.push({ ev: ev, name: name, show: show, handle: handle }); }

    reg('info', '信息', function () { return btnVisible('info'); }, function (v) { viewConstructionInfo(v.decoration.orderId); });
    reg('pretreat', '预放线', function () { return btnVisible('pretreat'); }, function (v) { pretreat(v); });
    reg('update', '更新', function () { return btnVisible('update'); }, function (v) {
        state.dlid = v.dlid;
        $('#applayTimeInput').val((v.applayTime || '').substring(0, 10));
        layer.open({ type: 1, title: '更新申请时间 - ' + v.decoration.orderId, content: $('#updateBox'), area: ['420px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                app.post(api.construction.updateDrawLine, {
                    'drawLine.dlid': state.dlid,
                    'drawLine.applayTime': $('#applayTimeInput').val() + ' 00:00:00'
                }, function () {
                    app.showAlert(app.success, '操作成功');
                    layer.close(idx); query(state.page);
                });
            } });
    });
    reg('draw', '放线', function () { return btnVisible('draw'); }, function (v) {
        $('#dlid').val(v.dlid);
        $('#actualDateInput').val((v.applayTime || '').substring(0, 10));
        $('#startTime').val('');
        $('#endTime').val('');
        $('#drawLineGroup').val($('#drawLineGroup option:first').val());
        form.render('select');
        layer.open({ type: 1, title: '放线排期 - ' + v.decoration.orderId, content: $('#editBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) { saveSchedule(idx); } });
    });
    reg('reset', '重置', function () { return btnVisible('reset'); }, function (v) {
        app.showConfirm('确认重置申请吗?', function () {
            app.post(api.construction.failureDrawLine, { 'drawLine.dlid': v.dlid }, function () {
                app.showAlert(app.success, '操作成功');
                query(state.page);
            });
        });
    });

    table.on('tool(resultTable)', function (obj) {
        var ev = obj.event, v = obj.data;
        for (var i = 0; i < BTNS.length; i++) {
            if (BTNS[i].ev === ev) { BTNS[i].handle(v); return; }
        }
    });

    // —— 放线排期保存 ——
    function saveSchedule(idx) {
        var dateStr = $('#actualDateInput').val();
        var start = Date.parse(dateStr.replace(/-/g, '/') + ' ' + $('#startTime').val());
        var end = Date.parse(dateStr.replace(/-/g, '/') + ' ' + $('#endTime').val());
        if (isNaN(start) || isNaN(end) || start >= end) { app.showAlert(app.info, '起始时间和结束时间非法'); return; }
        app.post(api.construction.resetDrawLine, {
            'drawLine.dlid': $('#dlid').val(),
            'drawLine.startTime': dateStr + ' ' + $('#startTime').val(),
            'drawLine.endTime': dateStr + ' ' + $('#endTime').val(),
            'drawLine.group.gid': $('#drawLineGroup').val()
        }, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(idx); query(state.page);
        });
    }

    // —— 预放线（节点工期 → pretreatDrawLine）——
    function pretreat(v) {
        state.dlid = v.dlid;
        state.orderId = v.decoration.orderId;
        $('#constructionNodes').html('');

        var nodes = [];
        app.post(api.data.queryConstructionNode, {}, function (res) {
            nodes = (res.constructionNodes || []).sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); });
        }, null, false);

        var html = '';
        $.each(nodes, function (index, value) {
            html += '<div class="layui-form-item">'
                + '<input type="checkbox" name="sorts" lay-skin="primary" data-sort="' + value.sort + '" data-cnid="' + value.cnid + '" title="' + value.name + '">'
                + '<div class="layui-input-inline" style="margin-left:20px;"><input type="text" name="timeLimits" class="layui-input nodeTimeLimit" data-sort="' + value.sort + '" data-cnid="' + value.cnid + '" value="' + (value.timeLimit != null ? value.timeLimit : '') + '" placeholder="工期"><\/div>'
                + '<\/div>';
        });
        $('#constructionNodes').html(html);
        form.render('checkbox');

        // 面积匹配默认工期
        var period = null;
        app.post(api.data.queryConstructionPeriod, { 'constructionPeriod.lowerArea': v.decoration.house ? v.decoration.house.innerArea : '' }, function (res) {
            period = res.constructionPeriod;
        }, null, false);
        if (period && period.cpid) {
            app.post(api.data.queryConstructionPeriodNodeByCpid, { 'constructionPeriodNode.cpid': period.cpid }, function (res) {
                $.each(res.constructionPeriodNodes || [], function (i, pn) {
                    $('.nodeTimeLimit[data-cnid="' + (pn.constructionNode ? pn.constructionNode.cnid : pn.cnid) + '"]').val(pn.period);
                });
            }, null, false);
        }

        layer.open({ type: 1, title: '预放线 - ' + v.decoration.orderId, content: $('#constructionNodeBox'), area: ['560px', '85%'],
            btn: ['提交', '取消'], yes: function (idx) {
                var option = { 'drawLine.decoration.orderId': state.orderId };
                var $inputs = $('input[name="sorts"]:checked');
                $.each($inputs, function (i, el) {
                    var $input = $(el);
                    option['constructionNodes[' + i + '].cnid'] = $input.attr('data-cnid');
                    option['constructionNodes[' + i + '].sort'] = $input.attr('data-sort');
                    option['constructionNodes[' + i + '].timeLimit'] = $('.nodeTimeLimit[data-sort="' + $input.attr('data-sort') + '"]').val();
                });
                app.post(api.construction.pretreatDrawLine, option, function () {
                    app.showAlert(app.success, '放线成功');
                    layer.close(idx); query(state.page);
                });
            } });
    }

    // —— 工程信息 ——
    function viewConstructionInfo(orderId) {
        state.infoOrderId = orderId;
        app.post(api.construction.queryConstructionInfoByOrderId, { 'constructionInfo.orderId': orderId }, function (res) {
            var data = res.constructionInfo || {};
            $('#ishovel').val(data.ishovel != null ? data.ishovel : 0);
            $('#iskey').val(data.iskey != null ? data.iskey : 0);
            $('#isCeremony').val(data.isCeremony != null ? data.isCeremony : 0);
            $('#timeLimit').val(data.timeLimit != null ? data.timeLimit : '');
            $('#finishTime').val(data.finishTime ? data.finishTime.substring(0, 10) : '');
            $('#keyTime').val(data.keyTime ? data.keyTime.substring(0, 10) : '');
            $('#drawlineTime').val(data.drawlineTime ? data.drawlineTime.substring(0, 10) : '');
            $('#designTime').val(data.designTime ? data.designTime.substring(0, 10) : '');
            $('#comment').val(data.comment || '');
            form.render('select');
            layer.open({ type: 1, title: '工程信息 - ' + orderId, content: $('#constructionInfoBox'), area: ['520px', '90%'],
                btn: ['保存', '取消'], yes: function (idx) {
                    app.post(api.construction.updateConstructionInfoByOrderId, {
                        'constructionInfo.orderId': state.infoOrderId,
                        'constructionInfo.decoration.orderId': state.infoOrderId,
                        'constructionInfo.timeLimit': $('#timeLimit').val(),
                        'constructionInfo.ishovel': $('#ishovel').val(),
                        'constructionInfo.iskey': $('#iskey').val(),
                        'constructionInfo.isCeremony': $('#isCeremony').val(),
                        'constructionInfo.finishTime': $('#finishTime').val() + ' 00:00:00',
                        'constructionInfo.keyTime': $('#keyTime').val() + ' 00:00:00',
                        'constructionInfo.drawlineTime': $('#drawlineTime').val() + ' 00:00:00',
                        'constructionInfo.designTime': $('#designTime').val() + ' 00:00:00',
                        'constructionInfo.comment': $('#comment').val()
                    }, function () {
                        app.showAlert(app.success, '操作成功');
                        layer.close(idx);
                    });
                } });
        });
    }

    // —— 申请信息（月历）——
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

    function renderCalendar() {
        var cur = state.calDate;
        var year = cur.getFullYear(), month = cur.getMonth();
        $('#calTitle').text(year + '年' + (month + 1) + '月');

        var first = new Date(year, month, 1);
        var startOffset = first.getDay();
        var gridStart = new Date(year, month, 1 - startOffset);
        var daysInMonth = new Date(year, month + 1, 0).getDate();

        var html = '<tr><th>日<\/th><th>一<\/th><th>二<\/th><th>三<\/th><th>四<\/th><th>五<\/th><th>六<\/th><\/tr>';
        var cellDate = new Date(gridStart);
        for (var r = 0; r < 6; r++) {
            html += '<tr>';
            for (var c = 0; c < 7; c++) {
                var inMonth = cellDate.getMonth() === month;
                var key = cellDate.getFullYear() + pad(cellDate.getMonth() + 1) + pad(cellDate.getDate());
                var count = calendarCounts[key];
                html += '<td style="' + (inMonth ? '' : 'background:#fafafa;') + '">'
                    + '<div class="dl-cal-daynum">' + cellDate.getDate() + '<\/div>'
                    + (inMonth && count ? '<span class="dl-cal-count">' + count + '个<\/span>' : '')
                    + '<\/td>';
                cellDate.setDate(cellDate.getDate() + 1);
            }
            html += '<\/tr>';
            if (cellDate.getMonth() !== month && cellDate.getDay() === 0) break;
        }
        $('#calendarTable').html(html);
    }

    var calendarCounts = {};
    function loadCalendar() {
        var cur = state.calDate;
        var start = new Date(cur.getFullYear(), cur.getMonth() - 1, 1);
        var end = new Date(cur.getFullYear(), cur.getMonth() + 2, 0);
        calendarCounts = {};
        app.post(api.construction.countDrawLine, { 'drawLine.startTime': ymd(start), 'drawLine.endTime': ymd(end) }, function (res) {
            $.each(res.count || [], function (i, c) {
                var date = c[1] + '';
                if (date.length >= 8) calendarCounts[date] = c[2];
            });
            renderCalendar();
        });
    }

    $('#showDrawLineApplyInfos').on('click', function () {
        state.calDate = new Date();
        layer.open({ type: 1, title: '申请信息', content: $('#applyBox'), area: ['760px', '620px'] });
        loadCalendar();
    });
    $('#calPrev').on('click', function () { state.calDate.setMonth(state.calDate.getMonth() - 1); loadCalendar(); });
    $('#calNext').on('click', function () { state.calDate.setMonth(state.calDate.getMonth() + 1); loadCalendar(); });

    // —— 查询（基础过滤 drawLine.status=0 排队；用户显式选状态时以选值优先）——
    function query(pg) {
        state.page = pg || 1;
        var filters = constructionCommon.buildFilters($('#searchForm'));
        var hasStatus = false;
        $.each(filters, function (k) { if (filters[k] === 'drawLine.status') hasStatus = true; });
        if (!hasStatus) filters['drawLine.status'] = 0;
        app.post(pageConfig.apiPage, $.extend({}, filters, { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            var data = p.data || [];
            renderToolbar(data.length ? data[0] : {});
            table.reload('resultTable', { data: data });
            state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function renderToolbar(sample) {
        var html = '';
        $.each(BTNS, function (i, b) {
            if (b.show(sample)) html += '<button class="layui-btn layui-btn-xs" lay-event="' + b.ev + '">' + b.name + '<\/button>';
        });
        $('#rowToolbar').html(html);
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    query(1);
});
}); // end app.ready
