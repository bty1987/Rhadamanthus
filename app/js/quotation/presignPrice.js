/** app/js/quotation/presignPrice.js —— 预签价格
 *  列表：pagePresignPrice（ppid）；编辑 add/updatePresignPrice；删除 deletePresignPrice；状态 updatePresignPriceForStatus；
 *  导入：api.information.createPlan（keyword import_quotation_presignprice，args=文件路径,ppid）。
 *  上下文：app.params.data.presignProduce。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var dctx = qc.ctx('data') || {};
    var presignProduce = dctx.presignProduce || {};
    var state = { page: 1, rows: 10, total: 0, pspid: null };

    layui.laydate.render({ elem: '#executeDates', type: 'date', format: 'yyyy-MM-dd' });
    layui.laydate.render({ elem: '#executeTimes', type: 'time', format: 'HH:mm' });

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'name', title: '名称', width: 140, fixed: 'left' },
            { field: 'upperArea', title: '起始面积', width: 100, templet: function (d) { return qc.money(d.upperArea); } },
            { field: 'lowerArea', title: '终止面积', width: 100, templet: function (d) { return qc.money(d.lowerArea); } },
            { field: 'price', title: '价格', width: 100, templet: function (d) { return qc.money(d.price); } },
            { field: 'costPrice', title: '工程成本', width: 100, templet: function (d) { return qc.money(d.costPrice); } },
            { field: 'mostPrice', title: '主材成本', width: 100, templet: function (d) { return qc.money(d.mostPrice); } },
            { field: 'activityPrice', title: '浮动额', width: 100, templet: function (d) { return qc.money(d.activityPrice); } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return qc.badge({ 0: '启用', 1: '禁用' }, d.status); } },
            { title: '操作', width: 220, toolbar: '#rowToolbar' } ]] });

    function query(pg) {
        state.page = pg || 1;
        app.post(api.quotation.pagePresignPrice, $.extend({ 'presignPrice.ppid': presignProduce.ppid }, { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30, 100], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function openEdit(v) {
        state.pspid = v ? v.pspid : null;
        $('#editBox form')[0].reset();
        if (v) {
            $('#name').val(v.name); $('#upperArea').val(v.upperArea); $('#lowerArea').val(v.lowerArea);
            $('#price').val(v.price); $('#costPrice').val(v.costPrice); $('#mostPrice').val(v.mostPrice); $('#activityPrice').val(v.activityPrice);
        }
        layer.open({ type: 1, title: state.pspid ? '编辑预签价格' : '创建预签价格', content: $('#editBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                var url = api.quotation.addPresignPrice;
                var options = {
                    'presignPrice.ppid': presignProduce.ppid,
                    'presignPrice.name': $('#name').val(),
                    'presignPrice.upperArea': $('#upperArea').val(),
                    'presignPrice.lowerArea': $('#lowerArea').val(),
                    'presignPrice.price': $('#price').val(),
                    'presignPrice.costPrice': $('#costPrice').val(),
                    'presignPrice.mostPrice': $('#mostPrice').val(),
                    'presignPrice.activityPrice': $('#activityPrice').val()
                };
                if (state.pspid) { url = api.quotation.updatePresignPrice; options['presignPrice.pspid'] = state.pspid; }
                app.post(url, options, function () {
                    app.showAlert(app.info, '操作成功');
                    layer.close(idx); query(state.page);
                });
            } });
    }

    // —— 导入（计划任务） ——
    $('#btnImport').on('click', function () {
        layer.open({ type: 1, title: '导入预签价格', content: $('#importBox'), area: ['520px', 'auto'],
            btn: ['导入', '取消'], yes: function (idx) {
                var filePath = $.trim($('#filePath').val());
                if (filePath === '') { app.showAlert(app.warning, '上传文件不能为空'); return; }
                var date = $('#executeDates').val();
                var time = $('#executeTimes').val();
                if (!date || !time) { app.showAlert(app.warning, '请选择执行时间'); return; }
                var executeTime = date.replace(/-/g, '').substring(2) + time.replace(/:/g, '').substring(0, 4);
                app.post(api.information.createPlan, {
                    'plan.task.keyWord': 'import_quotation_presignprice',
                    'plan.executeTime': executeTime,
                    'plan.args': filePath + ',' + presignProduce.ppid
                }, function () {
                    app.showAlert(app.info, '计划创建成功');
                    layer.close(idx); query(state.page);
                });
            } });
    });

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'edit') openEdit(v);
        else if (obj.event === 'del') {
            app.post(api.quotation.deletePresignPrice, { 'presignPrice.pspid': v.pspid }, function () { query(state.page); });
        } else if (obj.event === 'status') {
            app.post(api.quotation.updatePresignPriceForStatus, { 'presignPrice.pspid': v.pspid, 'presignPrice.status': v.status == 0 ? 1 : 0 }, function () { query(state.page); });
        }
    });

    $('#btnAdd').on('click', function () { openEdit(null); });
    query(1);
});
}); // end app.ready
