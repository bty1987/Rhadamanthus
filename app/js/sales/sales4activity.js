/** app/js/sales/sales4activity.js —— 销售活动项
 * 上下文：app.params.sales.sales = {sid,orderId,...}, app.params.sales.type
 * activityItemType.status: 0待领取/1已领取/2已发放/3已消耗/4已退款/5已作废
 * activityItem.type: 0物品/1券/2卡纸 */
app.ready(function () {
layui.use(['table', 'layer', 'form', 'element', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, form = layui.form, element = layui.element, $ = layui.jquery;
    var ctx = (app.params.sales && app.params.sales.sales) || {};
    var sType = (app.params.sales && app.params.sales.type) || '';
    var state = { editIndex: null, commentIndex: null, saiid: null, actionUrl: null, actionInfo: '', newItems: [] };
    var STATUS = { 0: '待领取', 1: '已领取', 2: '已发放', 3: '已消耗', 4: '已退款', 5: '已作废' };
    var TYPE = { 0: '物品', 1: '券', 2: '卡纸' };
    $('#orderId').val(ctx.orderId);
    initTable(); loadActivity(); queryItems();

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '名称', width: 200 },
                { field: 'type', title: '类型', width: 90, templet: function (d) { return TYPE[d.type] != null ? TYPE[d.type] : '-'; } },
                { field: 'money', title: '金额', width: 100, templet: function (d) { return app.formatMoney(d.money); } },
                { field: 'num', title: '数量', width: 80 },
                { field: 'integral', title: '积分', width: 90 },
                { field: 'expendPrice', title: '消耗额', width: 100, templet: function (d) { return app.formatMoney(d.expendPrice); } },
                { field: 'discountPrice', title: '折扣额', width: 100, templet: function (d) { return app.formatMoney(d.discountPrice); } },
                { field: 'status', title: '状态', width: 100, templet: function (d) { var s = STATUS[d.status] != null ? STATUS[d.status] : '-'; var c = d.status == 0 ? 'layui-bg-gray' : d.status == 4 ? 'layui-bg-orange' : d.status == 5 ? 'layui-bg-black' : 'layui-bg-green'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; } },
                { field: 'comment', title: '备注', minWidth: 140 },
                { title: '操作', width: 480, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, v = obj.data;
            if (ev === 'receive') doAction(api.sales.receiveSalesActivityItem, v, '领取');
            else if (ev === 'delive') doAction(api.sales.deliveSalesActivityItem, v, '发放');
            else if (ev === 'expend') openComment(api.sales.expendSalesActivityItem, v, '消耗');
            else if (ev === 'discount') openComment(api.sales.discountSalesActivityItem, v, '折扣');
            else if (ev === 'refund') doAction(api.sales.refundSalesActivityItem, v, '退款');
            else if (ev === 'record') openRecord(v);
        });
        table.render({ elem: '#newItemTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '名称', width: 200 }, { field: 'type', title: '类型', width: 90, templet: function (d) { return TYPE[d.type] != null ? TYPE[d.type] : '-'; } }, { field: 'num', title: '数量', width: 90 }, { field: 'money', title: '金额', width: 100 }, { field: 'integral', title: '积分', width: 100 }, { title: '操作', width: 90, toolbar: '#newItemToolbar' } ]] });
    }
    function loadActivity() {
        app.post(api.information.queryActivityForValid, { 'activity.type': 3 }, function (res) {
            var opts = '<option value="">请选择</option>';
            $.each(res.activitys || [], function (i, v) { opts += '<option value="' + v.aid + '">' + (v.name || '') + '</option>'; });
            $('#activity').html(opts); form.render();
        });
        // 活动金额
        app.post(api.sales.amountSalesActivityForActivity, { 'salesActivity.sales.sid': ctx.sid }, function (res) {
            $('#activityAmount').val(app.formatMoney(res.salesActivity && res.salesActivity.amount));
        }, function () {});
    }
    function queryItems() {
        app.post(api.sales.querySalesActivityItem, { 'salesActivityItem.salesActivity.sales.sid': ctx.sid }, function (res) {
            table.reload('resultTable', { data: res.salesActivityItems || [] });
        });
    }
    function openAdd() {
        state.newItems = [];
        table.reload('newItemTable', { data: state.newItems });
        $('#thingsForm,#couponsForm,#paperForm')[0].reset();
        state.editIndex = layer.open({ type: 1, title: '添加活动项', content: $('#editBox'), area: ['800px', '80%'] });
    }
    function addNewItem(type) {
        var name, num, money, integral;
        if (type == 0) { name = $('#thingsName').val(); num = $('#thingsNum').val(); money = $('#thingsMoney').val(); integral = $('#thingsIntegral').val(); }
        else if (type == 1) { name = $('#couponsName').val(); num = $('#couponsNum').val(); money = $('#couponsMoney').val(); integral = 0; }
        else { name = $('#paperName').val(); num = $('#paperNum').val(); money = $('#paperMoney').val(); integral = $('#paperIntegral').val(); }
        if (!name) { app.showAlert(app.warning, '请输入名称'); return; }
        state.newItems.push({ name: name, type: type, num: num || 1, money: money || 0, integral: integral || 0 });
        table.reload('newItemTable', { data: state.newItems });
    }
    function submitItems() {
        if (!state.newItems.length) { app.showAlert(app.warning, '请添加活动项'); return; }
        var opt = {}, amount = 0;
        $.each(state.newItems, function (i, v) {
            opt['salesActivityItems[' + i + '].salesActivity.sales.sid'] = ctx.sid;
            opt['salesActivityItems[' + i + '].name'] = v.name;
            opt['salesActivityItems[' + i + '].type'] = v.type;
            opt['salesActivityItems[' + i + '].num'] = v.num;
            opt['salesActivityItems[' + i + '].money'] = v.money;
            opt['salesActivityItems[' + i + '].integral'] = v.integral;
            amount = app.utils.accAdd(amount, app.utils.accMul(v.integral || 0, v.num));
        });
        opt['salesActivity.amount'] = amount;
        app.post(api.sales.addSalesActivityItem, opt, function () {
            app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null;
            queryItems(); loadActivity();
        });
    }
    function doAction(url, v, info) {
        app.post(url, { 'salesActivityItem.saiid': v.saiid }, function () {
            app.showAlert(app.success, info + '成功'); queryItems();
        });
    }
    function openComment(url, v, info) {
        state.saiid = v.saiid; state.actionUrl = url; state.actionInfo = info;
        $('#commentForm [name="saiid"]').val(v.saiid);
        $('#commentForm [name="actionUrl"]').val(url);
        $('#price').val(info === '消耗' ? v.expendPrice : v.discountPrice);
        $('#salesActivityComment').val('');
        state.commentIndex = layer.open({ type: 1, title: info + ' - ' + (v.name || ''), content: $('#commentBox'), area: ['480px', 'auto'] });
    }
    function doCommentSubmit() {
        var opt = { 'salesActivityItem.saiid': state.saiid, 'salesActivityItem.content': $('#salesActivityComment').val() };
        if (state.actionUrl == api.sales.expendSalesActivityItem) opt['salesActivityItem.expendPrice'] = $('#price').val();
        if (state.actionUrl == api.sales.discountSalesActivityItem) opt['salesActivityItem.discountPrice'] = $('#price').val();
        app.post(state.actionUrl, opt, function () {
            app.showAlert(app.success, state.actionInfo + '成功'); layer.close(state.commentIndex); state.commentIndex = null; queryItems();
        });
    }
    function openRecord(v) {
        app.params.sales = { salesActivityItem: { saiid: v.saiid } };
        app.popup('/views/sales/salesActivityRecord.html', '操作记录 - ' + (v.name || ''), null, { area: ['80%', '60%'] });
    }
    $('#btnAddItem').on('click', openAdd);
    $('#btnBack').on('click', function () { app.closePopup(); });
    $('#btnAddThing').on('click', function () { addNewItem(0); });
    $('#btnAddCoupon').on('click', function () { addNewItem(1); });
    $('#btnAddPaper').on('click', function () { addNewItem(2); });
    $('#btnSubmitItems').on('click', submitItems);
    $('#btnCommentSubmit').on('click', doCommentSubmit);
    $('#btnCommentCancel').on('click', function () { layer.close(state.commentIndex); state.commentIndex = null; });
});
}); // end app.ready
