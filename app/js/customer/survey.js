/** app/js/customer/survey.js —— 客户调研（旧 survey.js → layui）
 *  列表：pageSurvey（装修单号/状态/时间范围检索）。
 *  创建：makeSurvey（orderId + 调研模板 stid）；详情：querySurveyBySid 动态问卷（题型同画像），
 *  status==1（推送）时可填写执行 handleSurvey；发送 sendSurvey（status==0）；完成 finishSurvey（status==2）；
 *  装修单：queryDecorationForCommonByOrderId → 打开装修单详情（跨模块 api.decoration）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    var S = customerCommon.SURVEY;
    customerCommon.ensureApiStubs();
    var state = { page: 1, rows: 10, total: 0, makeIndex: null, surveyIndex: null, stid: null, currentItems: null };

    customerCommon.dateRange('#createTime');

    // —— 调研模板选择 ——
    $('#btnPickTemplate').on('click', function () {
        var html = '<div style="padding:15px;">'
            + '<div style="margin-bottom:10px;"><input id="tplPickerInput" placeholder="输入模板名称检索" class="layui-input" style="width:100%;"></div>'
            + '<div id="tplPickerList" style="max-height:300px;overflow:auto;"></div></div>';
        var idx = layer.open({
            type: 1, title: '选择调研模板', content: html, area: ['420px', 'auto'],
            success: function () {
                $('#tplPickerInput').on('input', function () {
                    var kw = $.trim($(this).val());
                    if (!kw) return;
                    app.post(api.data.querySurveyTemplate, { 'surveyTemplate.name': kw }, function (res) {
                        var $list = $('#tplPickerList').empty();
                        $.each(res.surveyTemplates || [], function (i, v) {
                            $('<div class="tpl-item" style="padding:6px 10px;cursor:pointer;border-bottom:1px solid #eee;">')
                                .html(v.name).data('tpl', v).appendTo($list);
                        });
                    });
                });
                $('#tplPickerList').on('click', '.tpl-item', function () {
                    var t = $(this).data('tpl');
                    state.stid = t.stid;
                    $('#surveyTemplateName').val(t.name);
                    layer.close(idx);
                });
            }
        });
    });

    // —— 列表 ——
    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'name', title: '调研名称', minWidth: 160 },
            { field: 'orderId', title: '装修单号', width: 120 },
            { field: 'creater', title: '创建人', width: 100, templet: function (d) { return d.creater ? (d.creater.userName || '') : ''; } },
            { field: 'sender', title: '推送人', width: 100, templet: function (d) { return d.sender ? (d.sender.userName || '') : ''; } },
            { field: 'finisher', title: '完成人', width: 100, templet: function (d) { return d.finisher ? (d.finisher.userName || '') : ''; } },
            { field: 'createTime', title: '创建时间', width: 165 },
            { field: 'sendTime', title: '推送时间', width: 165 },
            { field: 'handleTime', title: '处理时间', width: 165 },
            { field: 'finishTime', title: '完成时间', width: 165 },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return customerCommon.badge(E.surveyStatus, d.status); } },
            { title: '操作', width: 230, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'detail') {
            show(v);
        } else if (obj.event === 'send') {
            app.showConfirm('是否确认推送调研信息', function () {
                app.post(api.customer.sendSurvey, { 'survey.sid': v.sid }, function () {
                    app.showAlert(app.success, '操作成功');
                    query(state.page);
                }, function () { query(state.page); });
            });
        } else if (obj.event === 'finish') {
            app.showConfirm('调研信息是否确认完成', function () {
                app.post(api.customer.finishSurvey, { 'survey.sid': v.sid }, function () {
                    app.showAlert(app.success, '操作成功');
                    query(state.page);
                }, function () { query(state.page); });
            });
        } else if (obj.event === 'decoration') {
            app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': v.orderId }, function (res) {
                var d = res.decoration;
                if (!d) { app.showAlert(app.warning, '装修单不存在'); return; }
                app.params.decoration = $.extend({}, app.params.decoration, {
                    orderId: d.orderId,
                    orderType: d.type,
                    orderTypeness: d.typeness,
                    versionId: d.versionId,
                    notSalesmanRate: d.notSalesmanRate
                });
                app.popup(api.index.decorationDetailIndex.url, '装修单详情: ' + d.orderId, null, { area: ['95%', '90%'] });
            });
        }
    });
    if (!$('#rowToolbar').length) {
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="detail">详情</button>'
            + '{{# if(d.status == 0){ }}<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="send">发送</button>{{# } }}'
            + '{{# if(d.status == 1){ }}<button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="decoration">装修单</button>{{# } }}'
            + '{{# if(d.status == 2){ }}<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="finish">完成</button>{{# } }}'
            + '<\/script>'
        );
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(api.customer.pageSurvey, $.extend({}, customerCommon.buildFilters($('#searchForm')), {
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

    // —— 详情（动态问卷） ——
    function show(v) {
        app.post(api.customer.querySurveyBySid, { 'survey.sid': v.sid }, function (res) {
            var survey = res.survey;
            var status = survey.status;
            state.currentItems = survey.items || [];

            $('#surveyName').text(survey.name || '');
            $('#itemlist').empty();
            $('#particulars').empty();

            $.each(state.currentItems, function (i, item) {
                if (item.type != S.TYPE_TEXT_INT) {
                    var $div = $('<div style="margin:10px 0;"></div>').appendTo('#itemlist');
                    $div.append('<div style="font-weight:bold;margin-bottom:4px;">' + i + '. ' + (item.name || '') + '<\/div>');
                    if (item.type == S.TYPE_INPUT_INT) {
                        var disabled = status != 1 ? ' disabled' : '';
                        $div.append('<textarea class="layui-textarea" id="input_' + item.siid + '" style="min-height:56px;"' + disabled + '>' + (item.content || '') + '<\/textarea>');
                    } else if (item.type == S.TYPE_SINGLE_INT || item.type == S.TYPE_MULTIPLE_INT) {
                        var $group = $('<div style="line-height:34px;" id="group_' + item.siid + '">').appendTo($div);
                        $.each(item.options || [], function (j, option) {
                            var id = 'sopt_' + option.soid;
                            var line = $('<span style="display:inline-block;margin-right:16px;white-space:nowrap;"></span>').appendTo($group);
                            var disabled = status != 1;
                            $('<input type="' + (item.type == S.TYPE_SINGLE_INT ? 'radio' : 'checkbox') + '">')
                                .attr({ id: id, name: 'survey_' + item.siid, soid: option.soid, disabled: disabled, title: option.title || '' })
                                .css('margin-right', '4px')
                                .prop('checked', option.checked == 0)
                                .appendTo(line);
                            $('<label for="' + id + '">' + (option.title || '') + '<\/label>').appendTo(line);
                        });
                    } else if (item.type == S.TYPE_DATE_INT) {
                        var disabled = status != 1 ? ' readonly disabled' : ' readonly';
                        $div.append('<input type="text" class="layui-input" id="input_' + item.siid + '" value="' + (item.content || '') + '"' + disabled + '>');
                        laydate.render({ elem: '#input_' + item.siid, type: 'date' });
                    }
                }
            });

            // status==1（推送）→ 可执行
            if (v.status == 1) {
                $('<button class="layui-btn" type="button" id="execute">执行</button>').appendTo('#particulars');
                $('#particulars').off('click', '#execute').on('click', '#execute', function () { doHandle(survey.sid); });
            }
            state.surveyIndex = layer.open({ type: 1, title: '调研详情', content: $('#surveyBox'), area: ['640px', '80%'] });
        });
    }

    function doHandle(sid) {
        var options = { 'survey.sid': sid };
        $.each(state.currentItems, function (i, item) {
            options['survey.items[' + i + '].siid'] = item.siid;
            if (item.type == S.TYPE_TEXT_INT) {
                options['survey.items[' + i + '].content'] = item.content;
            } else if (item.type == S.TYPE_INPUT_INT || item.type == S.TYPE_DATE_INT) {
                options['survey.items[' + i + '].content'] = $('#input_' + item.siid).val();
            }
            if (item.options && item.options.length != 0) {
                options['survey.items[' + i + '].name'] = item.name;
                $.each(item.options, function (j, b) {
                    var $opt = $('#group_' + item.siid + ' input[soid="' + b.soid + '"]');
                    options['survey.items[' + i + '].options[' + j + '].soid'] = b.soid;
                    options['survey.items[' + i + '].options[' + j + '].title'] = b.title;
                    options['survey.items[' + i + '].options[' + j + '].checked'] = $opt.prop('checked') ? 0 : 1;
                });
            }
        });
        app.showConfirm('是否确认执行调研信息', function () {
            app.post(api.customer.handleSurvey, options, function () {
                app.showAlert(app.success, '操作成功');
                layer.close(state.surveyIndex);
                query(state.page);
            });
        });
    }

    // —— 创建 ——
    $('#btnMake').on('click', function () {
        app.clearValidator();
        $('#makeForm')[0].reset();
        state.stid = null;
        state.makeIndex = layer.open({ type: 1, title: '创建调研', content: $('#makeBox'), area: ['520px', 'auto'] });
    });
    $('#btnMakeSave').on('click', function () {
        if (app.validate('makeForm')) return;
        if (!state.stid) { app.showAlert(app.warning, '请选择调研模板'); return; }
        app.post(api.customer.makeSurvey, {
            'survey.orderId': $('#makeForm [name="orderId"]').val(),
            'survey.stid': state.stid
        }, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(state.makeIndex);
            state.makeIndex = null;
            query(state.page);
        });
    });
    $('#btnMakeCancel').on('click', function () { layer.close(state.makeIndex); state.makeIndex = null; });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
});
}); // end app.ready
