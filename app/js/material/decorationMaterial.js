/** app/js/material/decorationMaterial.js —— 主材订单入口（装修单列表，进入子订单管理）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'orderId', title: '装修单号', width: 140 }, { field: 'addr', title: '楼盘地址', minWidth: 200, templet: function (d) { return (d.house && d.house.village ? d.house.village.name : '') + ' ' + (d.house ? d.house.houseNumber : ''); } }, { field: 'customer', title: '客户名', width: 120, templet: function (d) { return d.customer ? d.customer.name : ''; } }, { field: 'designerDept', title: '设计部', width: 140, templet: function (d) { return d.designer && d.designer.dept ? d.designer.dept.name : ''; } }, { field: 'designer', title: '设计师', width: 120, templet: function (d) { return d.designer ? d.designer.currentName : ''; } }, { field: 'supervisor', title: '监理', width: 120, templet: function (d) { return d.supervisor ? d.supervisor.currentName : ''; } }, { field: 'salesman', title: '业务员', width: 120, templet: function (d) { return d.salesman ? d.salesman.currentName : ''; } }, { field: 'area', title: '面积', width: 100, templet: function (d) { return d.house ? d.house.buildArea : ''; } }, { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'sub') viewMaterialIndex(obj.data); });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.decoration.pageDecorationForGeneral, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function viewMaterialIndex(v) {
        // 把订单上下文塞进 app.params，让 material.html 读
        app.params.materialOrder = {
            orderId: v.orderId,
            customerId: v.customer ? v.customer.cid : '',
            customerName: v.customer ? v.customer.name : '',
            orderAddr: (v.house && v.house.village ? v.house.village.name : '') + ' ' + (v.house ? v.house.houseNumber : ''),
            designerId: v.designer ? v.designer.userId : '',
            designerName: v.designer ? v.designer.currentName : '',
            hid: v.house ? v.house.hid : ''
        };
        app.switchPage(api.index.materialIndex.url);
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
});
}); // end app.ready
