/** app/js/map/fl.js —— 地图数据可视化（百度地图）
 * 原 WebContent/views/map/fl.js（44K）为纯静态演示数据 + 大量自定义覆盖物样式，
 * 未接任何业务接口。此处保留演示能力：
 *   - 城市级客源气泡（沈阳/武汉/合肥/哈尔滨/长春/重庆，全国视野 zoom 6）
 *   - 沈阳小区分布标记（zoom 15 街道数据）+ 明细表格
 * 数据与原 fl.js 内置演示数据一致。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;

    var dataset = { initzoom: 6, villagezoom: 14 };

    // ===== 演示数据（与原 fl.js 一致） =====
    var citys = [
        { x: 123.424527, y: 41.803319, name: '沈阳', consult: '15393' },
        { x: 114.3162,   y: 30.581084, name: '武汉', consult: '876' },
        { x: 117.282699, y: 31.866942, name: '合肥', consult: '1287' },
        { x: 126.657717, y: 45.773225, name: '哈尔滨', consult: '863' },
        { x: 125.313642, y: 43.898338, name: '长春', consult: '387' },
        { x: 106.530635, y: 29.544606, name: '重庆', consult: '98' }
    ];

    var villages = [
        { x: 123.438973, y: 41.811339, villageName: '兴华街北二路', count: '101' },
        { x: 123.477761, y: 41.814808, villageName: '百乐小区', count: '61' },
        { x: 123.478695, y: 41.817443, villageName: '鑫龙小区', count: '85' },
        { x: 123.473305, y: 41.816744, villageName: '龙福家园', count: '101' },
        { x: 123.43033,  y: 41.826528, villageName: '庐山社区', count: '10' },
        { x: 123.430007, y: 41.830747, villageName: '漓江园', count: '70' },
        { x: 123.441146, y: 41.82849,  villageName: '乐天圣苑', count: '48' },
        { x: 123.376073, y: 41.820453, villageName: '金帝名京', count: '55' },
        { x: 123.37036,  y: 41.813384, villageName: '阳光嘉园', count: '36' },
        { x: 123.467565, y: 41.800815, villageName: '翠生社区', count: '21' }
    ];

    var map = null;
    if (typeof BMap !== 'undefined') {
        map = new BMap.Map('dituContent', { enableMapClick: false });
        map.centerAndZoom(new BMap.Point(108.923468, 36.067843), dataset.initzoom);
        map.setMinZoom(5);
        map.setMapStyle({ style: 'light' });
        map.enableKeyboard();
        map.enableScrollWheelZoom(true);
        map.addControl(new BMap.NavigationControl());
        drawCity();
    }

    // ===== 城市级客源气泡 =====
    function drawCity() {
        if (!map) return;
        map.clearOverlays();
        $.each(citys, function (i, v) {
            var point = new BMap.Point(v.x, v.y);
            var label = new BMap.Label('<div class="fl-city-label">' + v.name + '<strong>' + v.consult + '<\/strong>套<\/div>', {
                offset: new BMap.Size(-60, -80),
                position: point
            });
            label.setStyle({
                backgroundColor: 'transparent', border: 'none',
                borderRadius: '45px', boxShadow: '0 0 10px rgba(0,0,0,.3)'
            });
            map.addOverlay(label);
        });
        renderTable(citys.map(function (v) {
            return { level: '城市', name: v.name, lng: v.x, lat: v.y, count: v.consult };
        }));
    }

    // ===== 沈阳小区分布标记 =====
    function drawVillage() {
        if (!map) return;
        map.clearOverlays();
        $.each(villages, function (i, v) {
            var point = new BMap.Point(v.x, v.y);
            var marker = new BMap.Marker(point);
            var label = new BMap.Label('<span class="fl-village-label">' + v.villageName + ' | ' + v.count + '套<\/span>', { offset: new BMap.Size(8, -12) });
            label.setStyle({ backgroundColor: 'transparent', border: 'none' });
            marker.setLabel(label);
            map.addOverlay(marker);
        });
        map.centerAndZoom(new BMap.Point(123.438973, 41.811339), dataset.villagezoom);
        renderTable(villages.map(function (v) {
            return { level: '小区', name: v.villageName, lng: v.x, lat: v.y, count: v.count };
        }));
    }

    // ===== 明细表格 =====
    function renderTable(list) {
        table.render({
            elem: '#dataTable',
            data: list,
            page: false,
            cols: [[
                { type: 'numbers', title: '#' },
                { field: 'level', title: '层级', width: 100 },
                { field: 'name', title: '名称', width: 200 },
                { field: 'lng', title: '经度', width: 160 },
                { field: 'lat', title: '纬度', width: 160 },
                { field: 'count', title: '数量(套)', width: 120 }
            ]]
        });
    }

    $('#btnCity').on('click', drawCity);
    $('#btnVillage').on('click', drawVillage);

    if (!map) renderTable([]);
});
});
