/** app/js/approval/approval4track.js —— 审批轨迹列表
  按 ?type=send/receive/dept/senior 选数据源；操作：详情/客户确认/通过/拒绝。
  明细按 approval.type 查对应接口：6 主材退款/8 装修活动/10 销售退款/14 客源装修/17 客源。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var type = getQueryParam('type') || 'receive';
    var apiMap = { send: 'pageApprovalForSend', receive: 'pageApprovalForReceive', dept: 'pageApprovalForReceiveDept', senior: 'pageApproval' };
    var ctx = { aid: null, submitUrl: null, editIdx: null, detailIdx: null };
    var statusName = { 0: '初始', 1: '已确认', 2: '已审批', 3: '已拒绝', 4: '已撤销' };
    var statusColor = { 0: 'layui-bg-orange', 1: 'layui-bg-cyan', 2: 'layui-bg-green', 3: 'layui-bg-red', 4: 'layui-bg-gray' };
    var typeName = { 1: '客户信息', 2: '小区', 3: '装修归属', 4: '报价折扣', 5: '装修退款', 6: '主材退款', 7: '主材外部退款', 8: '装修活动', 9: '主材全款', 10: '销售退款', 11: '清单DB', 12: '销售折扣', 13: '人事', 14: '客源-装修', 16: '装修整装', 17: '客源', 18: '销售收款', 19: '装修终审', 20: '客源变更', 21: '客户机会', 22: '报价优惠', 23: '优惠', 24: '装饰合同', 25: '客户机会停用', 26: '预付款提现' };
    var state = { page: 1, rows: 10, total: 0 };

    // 明细配置：type → {api, title, resultname, args:[colspan,name,path], caleTotal:[fields] }
    var itemInfo = {
        6:  { api: 'queryApprovalMaterialRefundItem', title: '主材信息', resultname: 'approvalMaterialRefundItems', args: [[1, '型号', 'materialItem.name'], [1, '品类', 'materialItem.category'], [1, '品牌', 'materialItem.brand'], [1, '售价', 'materialItem.price'], [1, '退货数量', 'num'], [1, '退货金额', 'total']], cale: ['total'] },
        8:  { api: 'queryApprovalDecorationActivity', title: '活动信息', resultname: 'approvalDecorationActivityItems', args: [[1, '活动名称', 'activityName'], [1, '活动项', 'activityItemName'], [1, '金额', 'money'], [1, '数量', 'num'], [1, '备注', 'content']], cale: ['money', 'num'] },
        10: { api: 'queryApprovalSalesRefundItem', title: '销售信息', resultname: 'approvalSalesRefundItem', args: [[1, '名称', 'salesItem.goods.name'], [1, '颜色', 'salesItem.color.name'], [1, '规格', 'salesItem.format.info'], [1, '售价', 'salesItem.selling'], [1, '退货数量', 'num'], [1, '退货金额', 'total']], cale: ['total'] },
        14: { api: 'queryApprovalCustomerOriginTDecoration', title: '客源信息', resultname: 'approvalCustomerOriginTDecoration', args: [[1, '城市', 'customerOrigin.house.village.cityProper.city.name'], [1, '楼盘', 'customerOrigin.house.village.name'], [1, '楼号', 'customerOrigin.house.houseNumber'], [1, '面积', 'customerOrigin.house.buildArea'], [1, '客户', 'customerOrigin.customer.name'], [1, '总面积', 'customerOrigin.house.totalArea']] },
        17: { api: 'queryApprovalCustomerOrigin', title: '客源信息', resultname: 'approvalCustomerOrigin', args: [[1, '城市', 'customerOrigin.house.village.cityProper.city.name'], [1, '楼盘', 'customerOrigin.house.village.name'], [1, '楼号', 'customerOrigin.house.houseNumber'], [1, '面积', 'customerOrigin.house.buildArea'], [1, '客户', 'customerOrigin.customer.name'], [1, '总面积', 'customerOrigin.house.totalArea']] }
    };

    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'type', title: '类型', width: 110, templet: function (d) { return '<span class="layui-badge layui-bg-blue">' + (typeName[d.type] || d.type) + '<\/span>'; } },
                { field: 'sender.currentName', title: '申请人', width: 100 },
                { field: 'receiver.currentName', title: '审批人', width: 100 },
                { field: 'createTime', title: '提交时间', width: 150 },
                { field: 'approvalTime', title: '审批时间', width: 150 },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return '<span class="layui-badge ' + (statusColor[d.status] || 'layui-bg-gray') + '">' + (statusName[d.status] || d.status) + '<\/span>'; } },
                { field: 'contents', title: '说明', minWidth: 140, templet: function (d) { return esc(d.contents); } },
                { field: 'annotate', title: '批注', minWidth: 120, templet: function (d) { return esc(d.annotate); } },
                { title: '操作', width: 210, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var v = obj.data;
            if (obj.event === 'detail') openDetail(v.aid, v.type);
            else if (obj.event === 'pass') proapprove(v.aid, api.approval.approveApproval, '通过');
            else if (obj.event === 'refuse') proapprove(v.aid, api.approval.refuseApproval, '拒绝');
        });
    }

    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.approval[apiMap[type]], $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {};
            var list = pg.data || [];
            // 非 send 模式才标记可操作
            if (type !== 'send') $.each(list, function (i, v) { v._editable = true; });
            table.reload('resultTable', { data: list }); state.total = pg.totalRecords || 0; renderPage();
        });
    }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }

    function proapprove(aid, submitUrl, result) {
        ctx.aid = aid; ctx.submitUrl = submitUrl;
        $('#annotate').val(''); $('#result').text(result);
        ctx.editIdx = layer.open({ type: 1, title: '审批', content: $('#editBox'), area: ['520px', 'auto'] });
    }
    $('#btnSubmit').on('click', function () {
        app.post(ctx.submitUrl, { 'approval.aid': ctx.aid, 'approval.annotate': $('#annotate').val() }, function () {
            layer.close(ctx.editIdx); ctx.editIdx = null; query(state.page);
        });
    });
    $('#btnClose').on('click', function () { layer.close(ctx.editIdx); ctx.editIdx = null; });

    function openDetail(aid, t) {
        var info = itemInfo[t]; if (!info) return;
        app.post(api.approval[info.api], { 'approval.aid': aid }, function (res) {
            $('#detailTitle').text(info.title);
            var data = $.isArray(res[info.resultname]) ? res[info.resultname] : (res[info.resultname] ? [res[info.resultname]] : []);
            var $body = $('#detailBody').empty();
            var totalMoney = 0;
            $.each(data, function (i, v) {
                var $card = $('<div style="padding:10px;border:1px solid #eee;border-radius:4px;margin-bottom:8px;"></div>');
                $.each(info.args, function (j, e) {
                    $card.append('<div style="display:inline-block;width:33%;padding:2px 0;"><span style="color:#999;">' + esc(e[1]) + ':</span> ' + esc(deepGet(v, e[2])) + '</div>');
                });
                $body.append($card);
                if (info.cale && info.cale.length == 2) totalMoney += (parseFloat(deepGet(v, info.cale[0])) || 0) * (parseFloat(deepGet(v, info.cale[1])) || 0);
                else if (info.cale && info.cale.length == 1) totalMoney += (parseFloat(deepGet(v, info.cale[0])) || 0);
            });
            $('#totalMoney').html(info.cale ? ('总金额: ' + totalMoney) : '');
            ctx.detailIdx = layer.open({ type: 1, title: info.title, content: $('#detailBox'), area: ['720px', '70%'] });
        });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });

    function esc(s) { return $('<div/>').text(s == null ? '' : s).html(); }
    function deepGet(o, path) { if (!path) return ''; var ps = path.split('.'); var cur = o; for (var i = 0; i < ps.length; i++) { if (cur == null) return ''; cur = cur[ps[i]]; } return cur == null ? '' : cur; }
    function getQueryParam(name) {
        var search = location.search.substring(1); var pairs = search.split('&');
        for (var i = 0; i < pairs.length; i++) { var kv = pairs[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
