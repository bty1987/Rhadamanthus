/** app/js/map/index.js —— 地图主页（百度地图）
 * 原 WebContent/views/map/index.html：沈阳中心点地图 + 点击取坐标（原为 alert，改为面板展示）。
 * 地图为纯演示画布，无业务数据接口；SDK 未加载时保留占位提示。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;

    // 百度地图 SDK 未加载：保留占位提示
    if (typeof BMap === 'undefined') return;

    var DEFAULT = { lng: 123.38497, lat: 41.810947, zoom: 15 }; // 沈阳中心点

    var map = new BMap.Map('allmap', { enableMapClick: false });
    map.centerAndZoom(new BMap.Point(DEFAULT.lng, DEFAULT.lat), DEFAULT.zoom);
    map.setMapStyle({ style: 'light' });
    map.enableKeyboard();
    map.enableScrollWheelZoom(true);
    map.addControl(new BMap.NavigationControl());

    // 点击取坐标（原 alert 改为面板展示）
    map.addEventListener('click', function (e) {
        $('#clickPoint').removeClass('layui-disabled').prop('disabled', false).val(e.point.lng + ', ' + e.point.lat);
    });

    // 按输入坐标定位
    $('#btnLocate').on('click', function () {
        var lng = parseFloat($('#centerLng').val()), lat = parseFloat($('#centerLat').val());
        if (isNaN(lng) || isNaN(lat)) { app.showAlert(app.warning, '请输入有效的经纬度'); return; }
        map.panTo(new BMap.Point(lng, lat));
    });
});
});
