/** app/js/customer/customerProfile.js —— 客户画像（旧 customerProfile.js → layui）
 *  列表：pageCustomerProfile（调研名称/状态检索）→ 调研名/装修单号/创建人/推送人/完成人/时间组/状态。
 *  创建：makeCustomerProfile（orderId + 调研模板 stid，跨模块 api.data.querySurveyTemplate）。
 *  行操作：详情（弹 customerProfile4detail，params.customer.{cpid, v}）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var state = { page: 1, rows: 10, total: 0, makeIndex: null, stid: null };

    // 调研模板选择弹窗
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
            { title: '操作', width: 100, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'detail') {
            var v = obj.data;
            app.params.customer = $.extend({}, app.params.customer, { cpid: v.cpid, v: v });
            app.popup(api.index.customerProfile4detailIndex.url, '客户画像: ' + (v.orderId || ''));
        }
    });
    if (!$('#rowToolbar').length) {
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="detail">详情</button>'
            + '<\/script>'
        );
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(api.customer.pageCustomerProfile, $.extend({}, customerCommon.buildFilters($('#searchForm')), {
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

    $('#btnMake').on('click', function () {
        app.clearValidator();
        $('#makeForm')[0].reset();
        state.stid = null;
        state.makeIndex = layer.open({ type: 1, title: '创建画像', content: $('#makeBox'), area: ['520px', 'auto'] });
    });
    $('#btnMakeSave').on('click', function () {
        if (app.validate('makeForm')) return;
        if (!state.stid) { app.showAlert(app.warning, '请选择调研模板'); return; }
        app.post(api.customer.makeCustomerProfile, {
            'customerProfile.orderId': $('#makeForm [name="orderId"]').val(),
            'customerProfile.tid': state.stid
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
