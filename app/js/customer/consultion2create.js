/** app/js/customer/consultion2create.js —— 咨询转单（旧 consultion2create.js → layui）
 *  流程：查装修单（decorationCommon.getPageConfig(depage).apiPage，缺省 api.decoration.pageDecoration）
 *  → 绑定装修单 → 转咨询单 addConsultion / 转报修单 addAepair / 转投诉单 addComplain
 *  → 右侧展示该单的咨询单/报修单/投诉单历史（queryConsultionByOrderId / queryAepairByOrderId / queryComplainByOrderId）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    decorationCommon.ensureApiStubs();
    var DE = decorationCommon.ENUM;
    var depage = customerCommon.ctx('urlLoadParams').depage;
    var pageConfig = decorationCommon.getPageConfig(depage);
    var listApi = pageConfig.apiPage || api.decoration.pageDecoration;
    var state = { page: 1, rows: 10, total: 0, bound: null, aepairIndex: null, complainIndex: null };
    var PROJECT_STATUS = { 0: '初始', 1: '开工', 2: '已完工' };

    laydate.render({ elem: '#aepairTargetTime', type: 'datetime' });

    function villageAddr(v) {
        if (!v.house || !v.house.village) return '';
        var vil = v.house.village;
        var city = vil.cityProper && vil.cityProper.city ? (vil.cityProper.city.name || '') : '';
        var proper = vil.cityProper ? (vil.cityProper.name || '') : '';
        return city + ' ' + proper + ' ' + (vil.name || '') + ' ' + (v.house.houseNumber || '');
    }

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'orderId', title: '装修单号', width: 120 },
            { field: 'addr', title: '楼盘地址', minWidth: 200, templet: villageAddr },
            { field: 'customer', title: '客户名', width: 90, templet: function (d) { return d.customer ? (d.customer.name || '') : ''; } },
            { field: 'designer', title: '设计部', width: 110, templet: function (d) { return d.designer && d.designer.dept ? (d.designer.dept.name || '') : ''; } },
            { field: 'designer', title: '设计师', width: 90, templet: function (d) { return d.designer ? (d.designer.currentName || '') : ''; } },
            { field: 'salesman', title: '业务部', width: 110, templet: function (d) { return d.salesman && d.salesman.dept ? (d.salesman.dept.name || '') : ''; } },
            { field: 'salesman', title: '业务员', width: 90, templet: function (d) { return d.salesman ? (d.salesman.currentName || '') : ''; } },
            { field: 'house', title: '面积', width: 80, templet: function (d) { return d.house ? (d.house.buildArea != null ? d.house.buildArea : '') : ''; } },
            { field: 'typeness', title: '类型', width: 80, templet: function (d) { return DE.typeness[d.typeness] != null ? DE.typeness[d.typeness] : ''; } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return customerCommon.badge(DE.decorationStatus, d.status); } },
            { field: 'designStatus', title: '设计状态', width: 90, templet: function (d) { return DE.designStatus[d.designStatus] != null ? DE.designStatus[d.designStatus] : ''; } },
            { field: 'projectStatus', title: '工程状态', width: 90, templet: function (d) { return PROJECT_STATUS[d.projectStatus] != null ? PROJECT_STATUS[d.projectStatus] : ''; } },
            { title: '操作', width: 220, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'bind') {
            state.bound = v;
            drawDecorationInfo(v);
            queryAllDetailInfo();
        } else if (obj.event === 'view') {
            app.params.decoration = $.extend({}, app.params.decoration, {
                orderId: v.orderId,
                orderType: v.type,
                orderTypeness: v.typeness,
                versionId: v.version ? v.version.versionId : null,
                notSalesmanRate: v.notSalesmanRate
            });
            app.popup(api.index.decorationDetailIndex.url, '装修单信息', null, { area: ['95%', '90%'] });
        } else if (obj.event === 'contractDetail') {
            app.popup('/original/contractDetail/' + v.orderId + '.html', '合同信息');
        } else if (obj.event === 'paymentDetail') {
            app.popup('/original/paymentDetail/' + v.orderId + '.html', '付款信息');
        } else if (obj.event === 'extensionDetail') {
            app.popup('/original/extensionDetail/' + v.orderId + '.html', '增减项信息');
        }
    });
    if (!$('#rowToolbar').length) {
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            + '<button class="layui-btn layui-btn-xs" lay-event="view">查看</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="bind">绑定</button>'
            + '{{# if(String(d.orderId).substr(0,2) == "00"){ }}'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="contractDetail">合同信息</button>{{# } }}'
            + '{{# if(String(d.orderId).substr(0,2) == "00" || String(d.orderId).substr(0,4) == "EX00"){ }}'
            + '<button class="layui-btn layui-btn-xs" lay-event="paymentDetail">付款信息</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="extensionDetail">增减项信息</button>{{# } }}'
            + '<\/script>'
        );
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(listApi, $.extend({}, customerCommon.buildFilters($('#searchForm')), {
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

    // —— 绑定装修单信息 ——
    function drawDecorationInfo(d) {
        var html = ''
            + '<li><b>装修单号：</b><b class="bound-orderId" style="color:#01AAED;">' + d.orderId + '<\/b><\/li>'
            + '<li><b>楼盘地址：</b>' + villageAddr(d) + '<\/li>'
            + '<li><b>客户名：</b>' + (d.customer ? d.customer.name : '') + '<\/li>'
            + '<li><b>面积：</b>' + (d.house ? (d.house.buildArea != null ? d.house.buildArea : '') : '') + '<\/li>'
            + '<li><b>创建时间：</b>' + (d.createTime || '') + '<\/li>'
            + '<li><b>类型：</b>' + (DE.typeness[d.typeness] != null ? DE.typeness[d.typeness] : '') + '<\/li>'
            + '<li><b>状态：</b>' + (DE.decorationStatus[d.status] != null ? DE.decorationStatus[d.status] : '') + '<\/li>';
        $('#decorationInfo').html(html);
    }

    function boundOrderId() {
        return $('#decorationInfo .bound-orderId').text() || (state.bound ? state.bound.orderId : undefined);
    }

    // —— 转咨询单 ——
    $('#consultionBtn').on('click', function () {
        if (app.validate('#queryView')) return;
        var orderId = boundOrderId();
        if (!orderId) { app.showAlert(app.warning, '请先绑定装修单'); return; }
        app.showConfirm('确认转咨询单吗?', function () {
            app.post(api.customer.addConsultion, {
                'consultion.decoration.orderId': orderId,
                'consultion.comment': $('#comment').val()
            }, function () {
                queryAllDetailInfo();
                $('#comment').val('');
                app.showAlert(app.success, '转单成功');
            });
        });
    });

    // —— 转报修单 ——
    $('#aepairBtn').on('click', function () {
        if (app.validate('#queryView')) return;
        if (!boundOrderId()) { app.showAlert(app.warning, '请先绑定装修单'); return; }
        $('#aepairForm')[0].reset();
        app.clearValidator();
        state.aepairIndex = layer.open({ type: 1, title: '转报修单', content: $('#aepairBox'), area: ['480px', 'auto'] });
    });
    $('#btnAepairSave').on('click', function () {
        if (app.validate('aepairForm')) return;
        app.post(api.customer.addAepair, {
            'consultion.decoration.orderId': boundOrderId(),
            'consultion.comment': $('#comment').val(),
            'aepair.targetTime': $('#aepairForm [name="aepairTargetTime"]').val(),
            'aepair.comment': $('#aepairForm [name="aepairComment"]').val()
        }, function () {
            queryAllDetailInfo();
            $('#comment').val('');
            app.showAlert(app.success, '转单成功');
            layer.close(state.aepairIndex);
            state.aepairIndex = null;
        });
    });
    $('#btnAepairCancel').on('click', function () { layer.close(state.aepairIndex); state.aepairIndex = null; });

    // —— 转投诉单 ——
    $('#complainBtn').on('click', function () {
        if (app.validate('#queryView')) return;
        if (!boundOrderId()) { app.showAlert(app.warning, '请先绑定装修单'); return; }
        $('#complainForm')[0].reset();
        form.render('select');
        app.clearValidator();
        state.complainIndex = layer.open({ type: 1, title: '转投诉单', content: $('#complainBox'), area: ['420px', 'auto'] });
    });
    $('#btnComplainSave').on('click', function () {
        if (app.validate('complainForm')) return;
        app.post(api.customer.addComplain, {
            'consultion.decoration.orderId': boundOrderId(),
            'consultion.comment': $('#comment').val(),
            'complain.level': $('#complainForm [name="complainLevel"]').val()
        }, function () {
            queryAllDetailInfo();
            $('#comment').val('');
            app.showAlert(app.success, '转单成功');
            layer.close(state.complainIndex);
            state.complainIndex = null;
        });
    });
    $('#btnComplainCancel').on('click', function () { layer.close(state.complainIndex); state.complainIndex = null; });

    // —— 重置 ——
    $('#resetBtn').on('click', function () {
        state.bound = null;
        $('#comment').val('');
        $('#decorationInfo').empty();
        $('#right').empty();
        query(1);
    });

    // —— 单据历史 ——
    function queryAllDetailInfo() {
        var orderId = boundOrderId();
        if (!orderId) return;
        $('#right').empty();

        var sections = [
            { title: '咨询单', id: 'consultionType' },
            { title: '报修单', id: 'aepairType' },
            { title: '投诉单', id: 'complainType' }
        ];
        var html = '';
        $.each(sections, function (i, s) {
            html += '<div class="layui-col-md12" style="margin-bottom:10px;">'
                + '<h4 style="color:#4383b4;font-weight:700;margin:8px 0;">' + s.title + '<\/h4>'
                + '<ul id="' + s.id + 'Ul" style="padding:0;margin:0;list-style:none;"><\/ul><\/div>';
        });
        $('#right').html(html);

        app.post(api.customer.queryConsultionByOrderId, { 'consultion.decoration.orderId': orderId }, function (res) {
            $.each(res.consultions || [], function (i, v) {
                $('#consultionTypeUl').append(recordHtml([
                    ['装修单号: ', v.decoration ? (v.decoration.orderId || '') : '', ''],
                    ['编号: ', v.no, ''],
                    ['创建人: ', v.creater ? v.creater.currentName : '', '']
                ], v.comment));
            });
        });

        app.post(api.customer.queryAepairByOrderId, { 'aepair.decoration.orderId': orderId }, function (res) {
            $.each(res.aepairs || [], function (i, v) {
                $('#aepairTypeUl').append(recordHtml([
                    ['装修单号: ', v.decoration ? (v.decoration.orderId || '') : '', ''],
                    ['创建人: ', v.creater ? v.creater.currentName : '', ''],
                    ['操作人: ', v.updater ? v.updater.currentName : '', ''],
                    ['创建时间: ', v.createTime, ''],
                    ['预计完成时间: ', v.targetTime, ''],
                    ['状态: ', E.aepairStatus[v.status] != null ? E.aepairStatus[v.status] : '', ''],
                    ['维修费用: ', v.outlay != null ? v.outlay : '', ''],
                    ['满意度: ', E.aepairGrade[v.gladness] != null ? E.aepairGrade[v.gladness] : '', '']
                ], v.comment));
            });
        });

        app.post(api.customer.queryComplainByOrderId, { 'complain.decoration.orderId': orderId }, function (res) {
            $.each(res.complains || [], function (i, v) {
                $('#complainTypeUl').append(recordHtml([
                    ['装修单号: ', v.decoration ? (v.decoration.orderId || '') : '', ''],
                    ['创建人: ', v.creater ? v.creater.currentName : '', ''],
                    ['操作人: ', v.updater ? v.updater.currentName : '', ''],
                    ['等级: ', E.complainType[v.level] != null ? E.complainType[v.level] : '', ''],
                    ['状态: ', E.complainStatus[v.status] != null ? E.complainStatus[v.status] : '', ''],
                    ['满意度: ', E.complainGrade[v.gladness] != null ? E.complainGrade[v.gladness] : '', '']
                ], v.decoration ? v.decoration.orderId : ''));
            });
        });
    }

    function recordHtml(arr, title) {
        var html = '<li style="border:1px solid #eee;border-radius:4px;padding:8px 12px;margin-bottom:6px;">'
            + '<div style="font-weight:bold;color:#01AAED;">' + (title || '') + '<\/div>';
        $.each(arr, function (i, kv) {
            html += '<span style="margin-right:14px;color:#666;">' + kv[0] + kv[1] + '<\/span>';
        });
        return html + '<\/li>';
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
});
}); // end app.ready
