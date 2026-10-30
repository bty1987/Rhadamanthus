/** app/js/building/buildingHouse4detail.js —— 房源详情（查询+编辑）*/
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    var FIELDS = ['hsid','no','decorateDegree','deedNum','deedValue','allowLoan','beingLoan','comment'];

    app.breadcrumb([{ icon: 'layui-icon-home', text: '房源' }, { text: '详情' }]);

    var hsid = getQueryParam('hsid');
    if (hsid) {
        app.post(api.building.queryBuildingHouseByHsid, { 'buildingHouse.hsid': hsid }, function (res) {
            var d = res.buildingHouse || {};
            FIELDS.forEach(function (k) { $('#detailForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); });
            form.render();
        });
    }

    $('#btnSave').on('click', function () {
        var opt = {};
        FIELDS.forEach(function (k) { opt['buildingHouse.' + k] = $('#detailForm [name="' + k + '"]').val(); });
        app.post(api.building.updateBuildingHouse, opt, function () {
            app.showAlert(app.success, '保存成功');
        });
    });
    $('#btnBack').on('click', function () { history.back(); });

    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
