/** app/js/construction/drawline4setup.js —— 放线排期（申请放线单按组排期，卡片视图）
 *  url ?type=open 只读。queryDrawLine（drawLines，非分页）→ 按放线组分卡片。
 *  卡片按钮：信息/编辑(resetDrawLine)/人员部署(updateConstructionByOrderId 设监理)/重置(failureDrawLine)/
 *  放线(successDrawLine + 施工节点工期)。申请信息月历（countDrawLine）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var E = constructionCommon.ENUM;
    var pageType = (app.params.urlLoadParams && app.params.urlLoadParams.type) || '';
    var state = { dlid: null, orderId: null, infoOrderId: null, calDate: new Date };

    constructionCommon.dateRange('#actualDate');
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

    // 监理下拉（工程部）
    app.post(api.personel.queryUserByPinyin, { 'departmentType.name': '工程部', 'user.status': 0 }, function (res) {
        var html = '<option value="">请选择监理(工程部)</option>';
        $.each(res.autoFillKeyValue || [], function (i, u) { html += '<option value="' + u.key + '">' + u.value + '<\/option>'; });
        $('#supervisor').html(html);
        form.render('select');
    }, null, false);

    function money(v) { return app.formatMoney(v); }

    // —— 卡片渲染（按放线组分组）——
    function renderList(list) {
        var $box = $('#resultList');
        $box.html('');
        if (!list || !list.length) { $box.html('<div class="layui-elem-quote layui-quote-nm">无放线数据<\/div>'); return; }

        var groups = {}; // gid → {name, items}
        $.each(list, function (i, v) {
            var gid = v.group ? v.group.gid : null;
            var key = gid != null ? gid : '_default';
            if (!groups[key]) groups[key] = { name: gid != null ? v.group.name : '未分组', items: [] };
            groups[key].items.push(v);
        });

        $.each(groups, function (key, g) {
            $box.append('<div class="dl-group-title">' + g.name + '<\/div>');
            $.each(g.items, function (i, v) { $box.append(buildCard(v)); });
        });

        bindCardEvents();
    }

    function esc(s) { return (s == null ? '' : String(s)).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

    function buildCard(v) {
        var dec = v.decoration || {};
        var house = dec.house || {};
        var startTime = v.startTime ? v.startTime.substring(11, 16) : '';
        var endTime = v.endTime ? v.endTime.substring(11, 16) : '';
        var props = [
            ['装修单', dec.orderId], ['楼盘', house.village ? house.village.name : ''], ['楼号', house.houseNumber],
            ['客户', dec.customer ? dec.customer.name : ''], ['设计师', dec.designer ? dec.designer.currentName : ''],
            ['监理', dec.supervisor ? dec.supervisor.currentName : ''], ['面积', house.buildArea],
            ['合同额', money(dec.orderTotalPrice)], ['装修业务', E.typeness[dec.typeness] != null ? E.typeness[dec.typeness] : ''],
            ['装修状态', E.decorationStatus[dec.status] != null ? E.decorationStatus[dec.status] : ''],
            ['报价版本', dec.version ? dec.version.name : ''], ['申请人', v.appler ? v.appler.currentName : ''],
            ['放线时间', v.actualTime || ''], ['开始时间', startTime], ['结束时间', endTime],
            ['状态', E.drawLineStatus[v.status] != null ? E.drawLineStatus[v.status] : v.status], ['描述', v.content]
        ];
        var html = '<div class="dl-card" data-dlid="' + v.dlid + '"><h3>' + (dec.orderId || '') + '</h3><div class="dl-props">';
        $.each(props, function (i, p) { html += '<div class="dl-prop"><b>' + p[0] + ': <\/b>' + esc(p[1]) + '<\/div>'; });
        html += '<\/div>';
        if (pageType != 'open' && v.status == 1) {
            html += '<div style="margin-top:10px;">'
                + '<button type="button" class="layui-btn layui-btn-xs layui-btn-warm" data-act="info">信息<\/button>'
                + '<button type="button" class="layui-btn layui-btn-xs" data-act="edit">编辑<\/button>'
                + '<button type="button" class="layui-btn layui-btn-xs layui-btn-normal" data-act="deploy">人员部署<\/button>'
                + '<button type="button" class="layui-btn layui-btn-xs layui-btn-primary" data-act="reset">重置<\/button>'
                + '<button type="button" class="layui-btn layui-btn-xs layui-btn-danger" data-act="success">放线<\/button>'
                + '<\/div>';
        }
        html += '<\/div>';
        return html;
    }

    function bindCardEvents() {
        $('#resultList').off('click', 'button[data-act]').on('click', 'button[data-act]', function () {
            var act = $(this).attr('data-act');
            var dlid = $(this).closest('.dl-card').attr('data-dlid');
            var v = null;
            // 从缓存数据中找回
            $.each(state.list || [], function (i, item) { if (String(item.dlid) === String(dlid)) { v = item; return false; } });
            if (!v) return;
            if (act === 'info') viewConstructionInfo(v.decoration.orderId);
            else if (act === 'edit') showEdit(v);
            else if (act === 'deploy') showSetup(v);
            else if (act === 'reset') resetDl(v.dlid);
            else if (act === 'success') successDl(v);
        });
    }

    // —— 编辑排期 ——
    function showEdit(v) {
        $('#dlid').val(v.dlid);
        $('#actualDateInput').val(v.startTime ? v.startTime.substring(0, 10) : '');
        $('#startTime').val(v.startTime ? v.startTime.substring(11, 16) : '');
        $('#endTime').val(v.endTime ? v.endTime.substring(11, 16) : '');
        $('#drawLineGroup').val(v.group ? v.group.gid : '');
        form.render('select');
        layer.open({ type: 1, title: '编辑排期 - ' + v.decoration.orderId, content: $('#editBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
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
                    layer.close(idx); query();
                });
            } });
    }

    // —— 人员部署（设监理）——
    function showSetup(v) {
        app.post(api.construction.queryConstructionByOrderId, { 'construction.orderId': v.decoration.orderId }, function (res) {
            var supervisor = res.construction ? res.construction.supervisor : null;
            $('#supervisor').val(supervisor ? supervisor.userId : '');
            form.render('select');
        });
        $('#orderInfos').text(v.decoration.orderId + ' ' + (v.decoration.house && v.decoration.house.village ? v.decoration.house.village.name : ''));
        state.orderId = v.decoration.orderId;
        layer.open({ type: 1, title: '人员部署 - ' + v.decoration.orderId, content: $('#setupBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                app.post(api.construction.updateConstructionByOrderId, {
                    'construction.orderId': state.orderId,
                    'construction.supervisor.userId': $('#supervisor').val()
                }, function () {
                    app.showAlert(app.success, '操作成功');
                    layer.close(idx); query();
                });
            } });
    }

    // —— 重置 ——
    function resetDl(dlid) {
        app.showConfirm('确认重置申请吗?', function () {
            app.post(api.construction.failureDrawLine, { 'drawLine.dlid': dlid }, function () {
                app.showAlert(app.success, '操作成功');
                query();
            });
        });
    }

    // —— 成功放线（施工节点工期 → successDrawLine）——
    function successDl(v) {
        state.dlid = v.dlid;
        $('#constructionNodes').html('');

        var nodes = [];
        app.post(api.data.queryConstructionNode, {}, function (res) {
            nodes = (res.constructionNodes || []).sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); });
        }, null, false);

        var html = '';
        $.each(nodes, function (index, value) {
            html += '<div class="layui-form-item">'
                + '<input type="checkbox" name="sorts" checked lay-skin="primary" data-sort="' + value.sort + '" data-cnid="' + value.cnid + '" data-prenum="" data-postnum="" title="' + value.name + '">'
                + '<div class="layui-input-inline" style="margin-left:20px;"><input type="text" name="timeLimits" class="layui-input nodeTimeLimit" data-sort="' + value.sort + '" data-cnid="' + value.cnid + '" value="' + (value.timeLimit != null ? value.timeLimit : '') + '" placeholder="工期"><\/div>'
                + '<\/div>';
        });
        $('#constructionNodes').html(html);
        form.render('checkbox');

        // 面积匹配 + 已有计划回填（prenum/postnum/connum）
        var pace = null;
        app.post(api.data.queryConstructionPace, { 'constructionPace.lowerArea': v.decoration.house ? v.decoration.house.innerArea : '' }, function (res) {
            pace = res.constructionPace;
        }, null, false);
        if (pace && pace.cpid) {
            app.post(api.data.queryConstructionPaceNode, { 'constructionPaceNode.cpid': pace.cpid }, function (res) {
                $.each(res.constructionPaceNodes || [], function (i, pn) {
                    var cnid = pn.node ? pn.node.cnid : pn.cnid;
                    $('input[name="sorts"][data-cnid="' + cnid + '"]').attr('data-prenum', pn.prenum).attr('data-postnum', pn.postnum);
                    $('.nodeTimeLimit[data-cnid="' + cnid + '"]').val(pn.connum != null ? pn.connum : pn.period);
                });
            }, null, false);
        }
        app.post(api.construction.queryConstructionPlanByOrderId, { 'constructionPlan.orderId': v.decoration.orderId }, function (res) {
            $.each(res.constructionPlans || [], function (i, plan) {
                $('input[name="sorts"][data-cnid="' + plan.cnid + '"]').attr('data-prenum', plan.prenum).attr('data-postnum', plan.postnum);
                $('.nodeTimeLimit[data-cnid="' + plan.cnid + '"]').val(plan.connum);
            });
        }, null, false);

        layer.open({ type: 1, title: '放线 - ' + v.decoration.orderId, content: $('#constructionNodeBox'), area: ['560px', '85%'],
            btn: ['提交', '取消'], yes: function (idx) {
                var option = { 'drawLine.dlid': state.dlid };
                var $inputs = $('input[name="sorts"]:checked');
                $.each($inputs, function (i, el) {
                    var $input = $(el);
                    var timeLimit = $('.nodeTimeLimit[data-sort="' + $input.attr('data-sort') + '"]').val();
                    var prenum = $input.attr('data-prenum');
                    var postnum = $input.attr('data-postnum');
                    option['constructionNodes[' + i + '].cnid'] = $input.attr('data-cnid');
                    option['constructionNodes[' + i + '].sort'] = $input.attr('data-sort');
                    option['constructionNodes[' + i + '].timeLimit'] = parseFloat(timeLimit ? timeLimit : 0);
                    option['constructionNodes[' + i + '].prenum'] = parseFloat(prenum ? prenum : 0);
                    option['constructionNodes[' + i + '].postnum'] = parseFloat(postnum ? postnum : 0);
                });
                app.post(api.construction.successDrawLine, option, function () {
                    app.showAlert(app.success, '放线成功');
                    layer.close(idx); query();
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

    var calendarCounts = {};
    function renderCalendar() {
        var cur = state.calDate;
        var year = cur.getFullYear(), month = cur.getMonth();
        $('#calTitle').text(year + '年' + (month + 1) + '月');

        var first = new Date(year, month, 1);
        var gridStart = new Date(year, month, 1 - first.getDay());
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

    // —— 查询（queryDrawLine 返回 drawLines 数组）——
    function query() {
        app.post(api.construction.queryDrawLine, constructionCommon.buildFilters($('#searchForm')), function (res) {
            state.list = res.drawLines || [];
            renderList(state.list);
        });
    }

    $('#btnSearch').on('click', function () { query(); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(); });
    query();
});
}); // end app.ready
