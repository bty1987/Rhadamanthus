/** app/js/building/buildingSchedule.js —— 施工进度（查看 + 推进 + 重置）*/
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;

    function statusBadge(d) {
        var map = { 0: ['layui-bg-gray', '未开始'], 1: ['layui-bg-blue', '进行中'], 2: ['layui-bg-green', '已完成'], 3: ['layui-bg-red', '已逾期'] };
        var s = map[d.status] || map[0];
        return '<span class="layui-badge ' + s[0] + '">' + s[1] + '<\/span>';
    }

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'buildingNode', title: '施工节点', minWidth: 140, templet: function (d) { return d.buildingNode ? d.buildingNode.name : ''; } },
            { field: 'planTime', title: '计划时间', width: 120, templet: function (d) { return app.dateFormat(d.planTime, 'yyyy-MM-dd'); } },
            { field: 'sore', title: '得分', width: 80 },
            { field: 'status', title: '状态', width: 90, templet: statusBadge },
            { field: 'comment', title: '备注', minWidth: 160 },
            { title: '操作', width: 160, toolbar: '#rowToolbar' } ]] });

    table.on('tool(resultTable)', function (obj) {
        var d = obj.data;
        if (obj.event === 'next') doNext(d.bsid);
        else if (obj.event === 'reset') doReset(d.bsid);
    });

    function query() {
        var bid = $('#searchBid').val();
        if (!bid) { app.showAlert(app.warning, '请输入楼盘ID'); return; }
        app.post(api.building.queryBuildingScheduleByBid, { 'buildingSchedule.bid': bid }, function (res) {
            table.reload('resultTable', { data: res.buildingSchedules || [] });
        });
    }
    function doNext(bsid) { app.showConfirm('确认推进到下一节点？', function () { app.post(api.building.nextBuildingSchedule, { 'buildingSchedule.bsid': bsid }, function () { app.showAlert(app.success, '已推进'); query(); }); }); }
    function doReset(bsid) { app.showConfirm('确认重置该节点？', function () { app.post(api.building.resetBuildingSchedule, { 'buildingSchedule.bsid': bsid }, function () { app.showAlert(app.success, '已重置'); query(); }); }); }

    // URL 参数 bid 自动查询
    var urlBid = getQueryParam('bid');
    if (urlBid) { $('#searchBid').val(urlBid); query(); }
    function getQueryParam(name) { var s = location.search.substring(1).split('&'); for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); } return ''; }

    $('#btnSearch').on('click', query);
});
}); // end app.ready
