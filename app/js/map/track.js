/** app/js/map/track.js —— 人员轨迹回放（百度地图）
 * 原 WebContent/views/map/track.html：查询 trackPoint（人员ID+日期），
 * 原版逐段调用 BMap.DrivingRoute 驾车路线搜索画线，此处改为直接以折线串联轨迹点并标注起止点
 * （不依赖百度驾车检索服务，离线也可绘制）。
 * trackPoint 接口在后端已不随主业务发布（queryTrackPointByUserIdATime.do），
 * 请求失败时仅表格为空，地图画布保留占位。 */
app.ready(function () {
layui.use(['laydate', 'table', 'jquery'], function () {
    var laydate = layui.laydate, table = layui.table, $ = layui.jquery;

    // 本地 api stub（原页面硬编码 ../../queryTrackPointByUserIdATime.do，未在任何 api 模块登记）
    api.map = api.map || {};
    api.map.queryTrackPointByUserIdATime = { url: 'queryTrackPointByUserIdATime.do', intercept: true };

    var DEFAULT_CENTER = { lng: 123.38497, lat: 41.810947, zoom: 13 }; // 沈阳

    var map = null;
    if (typeof BMap !== 'undefined') {
        map = new BMap.Map('allmap');
        map.centerAndZoom(new BMap.Point(DEFAULT_CENTER.lng, DEFAULT_CENTER.lat), DEFAULT_CENTER.zoom);
        map.setMapStyle({ style: 'light' });
        map.enableKeyboard();
        map.enableScrollWheelZoom(true);
        map.addControl(new BMap.NavigationControl());
    }

    laydate.render({ elem: '#trackDate', format: 'yyyy-MM-dd', value: '2015-09-05' });

    $('#btnSearch').on('click', function () {
        var userId = $.trim($('#userId').val());
        var date = $.trim($('#trackDate').val());
        if (!userId) { app.showAlert(app.warning, '请输入人员ID'); return; }
        if (!date) { app.showAlert(app.warning, '请选择日期'); return; }

        app.post(api.map.queryTrackPointByUserIdATime, {
            'trackPoint.userId': userId,
            'trackPoint.date': date
        }, function (res) {
            var trackPoints = res.trackPoints || [];
            renderTable(trackPoints);
            drawTrack(trackPoints);
        }, function () {
            renderTable([]);
            app.showAlert(app.error, '轨迹接口不可用或无数据');
        });
    });

    function renderTable(list) {
        table.render({
            elem: '#trackTable',
            data: list,
            page: { layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], limits: [10, 30, 50] },
            cols: [[
                { type: 'numbers', title: '#' },
                { field: 'time', title: '时间', width: 180 },
                { field: 'x', title: '纬度(x)', width: 140 },
                { field: 'y', title: '经度(y)', width: 140 }
            ]]
        });
    }

    // 折线串联轨迹点 + 起止标注（原版为逐段驾车路线搜索）
    function drawTrack(trackPoints) {
        if (!map) return;
        map.clearOverlays();

        var points = [];
        for (var i = 0; i < trackPoints.length; i++) {
            var p = trackPoints[i];
            if (!p || p.x == 0 || p.y == 0) continue;
            points.push(new BMap.Point(p.y, p.x)); // 库里 x=纬度、y=经度
        }
        if (points.length == 0) return;

        map.addOverlay(new BMap.Polyline(points, { strokeColor: '#1E9FFF', strokeWeight: 4, strokeOpacity: 0.8 }));
        map.setViewport(points); // 自适应视野

        var start = points[0], end = points[points.length - 1];
        map.addOverlay(new BMap.Marker(start, { title: '起点' }));
        if (points.length > 1) {
            var endMarker = new BMap.Marker(end, { title: '终点' });
            endMarker.setAnimation(BMAP_ANIMATION_BOUNCE);
            map.addOverlay(endMarker);
        }
    }

    renderTable([]);
});
});
