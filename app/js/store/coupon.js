/**
 * app/js/store/coupon.js —— 优惠券（CRUD + 启用/禁用）
 * 字段：title type(0券值/1折扣) value(面值,金额字段→tranargs 自动 ÷1000/×1000) status
 * ★ pageCoupon/addCoupon/updateCoupon 已声明 tranargs，value 精度自动转换。
 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table;
    var laypage = layui.laypage;
    var form = layui.form;
    var layer = layui.layer;
    var $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editCid: null };

    initTable();
    query(1);

    function initTable() {
        table.render({
            elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[
                { type: 'numbers', title: '#', width: 60 },
                { field: 'title', title: '券名', minWidth: 180 },
                { field: 'type', title: '类型', width: 90, templet: function (d) { return d.type == '0' || d.type == 0 ? '券值' : '折扣'; } },
                {
                    field: 'value', title: '面值', width: 110, align: 'right',
                    templet: function (d) {
                        return d.type == '0' || d.type == 0
                            ? '¥' + app.formatMoney(d.value)
                            : app.formatMoney(d.value, 2);
                    }
                },
                {
                    field: 'status', title: '状态', width: 100,
                    templet: function (d) {
                        return d.status == 0
                            ? '<span class="layui-badge layui-bg-green">启用</span>'
                            : '<span class="layui-badge layui-bg-gray">禁用</span>';
                    }
                },
                { title: '操作', width: 240, toolbar: '#rowToolbar' }
                ]]
        });
        table.on('tool(resultTable)', function (obj) {
            var d = obj.data;
            if (obj.event === 'edit') openEdit(d);
            else if (obj.event === 'enable') updateStatus(d.cid, 0);
            else if (obj.event === 'disable') updateStatus(d.cid, 1);
        });
    }

    function buildFilters() {
        var p = {}, c = 0;
        $('#searchForm [name]').each(function () {
            var v = $.trim($(this).val());
            if (!v) return;
            p['filters[' + c + '].field'] = $(this).attr('name');
            p['filters[' + c + '].data'] = v;
            p['filters[' + c + '].op'] = $(this).attr('data-op') || 'eq';
            c++;
        });
        return p;
    }

    function query(page) {
        state.page = page || 1;
        app.post(api.store.pageCoupon, $.extend({}, buildFilters(), {
            'paging.page': state.page, 'paging.rows': state.rows
        }), function (res) {
            var pg = res.paging || {};
            table.reload('resultTable', { data: pg.data || [] });
            state.total = pg.totalRecords || 0;
            renderPage();
        });
    }

    function renderPage() {
        laypage.render({
            elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows,
            limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); }
        });
    }

    function openEdit(d) {
        app.clearValidator();
        $('#editForm')[0].reset();
        state.editCid = null;
        if (d) {
            state.editCid = d.cid;
            $('#editForm [name="cid"]').val(d.cid);
            $('#editForm [name="title"]').val(d.title);
            $('#editForm [name="type"]').val(d.type);
            $('#editForm [name="value"]').val(d.value);
            form.render('select');
        } else {
            form.render('select');
        }
        state.editIndex = layer.open({
            type: 1, title: d ? '编辑优惠券' : '添加优惠券', content: $('#editBox'), area: ['520px', 'auto'],
            cancel: function () { app.clearValidator(); }
        });
    }

    function doSave() {
        if (app.validate('editForm')) return;
        var opt = {
            'coupon.title': $('#editForm [name="title"]').val(),
            'coupon.type': $('#editForm [name="type"]').val(),
            'coupon.value': $('#editForm [name="value"]').val()
        };
        var apiDef;
        if (state.editCid) { opt['coupon.cid'] = state.editCid; apiDef = api.store.updateCoupon; }
        else { apiDef = api.store.addCoupon; }
        app.post(apiDef, opt, function () {
            app.showAlert(app.success, '保存成功');
            layer.close(state.editIndex); state.editIndex = null;
            query(state.page);
        });
    }

    function updateStatus(cid, status) {
        app.post(api.store.updateCouponForStatus, { 'coupon.cid': cid, 'coupon.status': status }, function () {
            app.showAlert(app.success, status == 0 ? '已启用' : '已禁用');
            query(state.page);
        });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
