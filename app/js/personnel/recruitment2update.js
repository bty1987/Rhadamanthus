/** recruitment2update.js —— 编辑招聘（queryRecruitmentByRid 回填 + updateRecruitment）
 * 父页 popup 打开，从 url ?rid= 取 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    function getUrlParam(k) { var m = location.search.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? m[1] : ''; }
    var rid = getUrlParam('rid');

    var getProp = { '0': true, '1': false, 'true': 0, 'false': 1 };

    app.bindData($('#recruitmentForm [name="employWay"]'), [{ key: 0, value: '网络' }, { key: 1, value: '推荐' }, { key: 2, value: '招聘会' }, { key: 3, value: '其他' }], 'key', 'value', true, function () { form.render('select'); });
    app.bindData($('#recruitmentForm [name="householdType"]'), [{ key: 0, value: '城镇' }, { key: 1, value: '农村' }], 'key', 'value', true, function () { form.render('select'); });
    app.bindData($('#recruitmentForm [name="political"]'), [{ key: 0, value: '群众' }, { key: 1, value: '党员' }, { key: 2, value: '团员' }], 'key', 'value', true, function () { form.render('select'); });
    app.bindData($('#recruitmentForm [name="education"]'), [{ key: 0, value: '博士' }, { key: 1, value: '硕士' }, { key: 2, value: '本科' }, { key: 3, value: '大专' }, { key: 4, value: '高中' }, { key: 5, value: '其他' }], 'key', 'value', true, function () { form.render('select'); });

    if (!rid) return;
    app.post(api.personel.queryRecruitmentByRid, { 'recruitment.rid': rid }, function (res) {
        var r = res.recruitment || {};
        $('#recruitmentForm [name="name"]').val(r.name);
        $('#recruitmentForm [name="identity"]').val(r.identity);
        $('#recruitmentForm [name="nation"]').val(r.nation);
        $('#recruitmentForm [name="place"]').val(r.place);
        $('#recruitmentForm [name="weight"]').val(r.weight);
        $('#recruitmentForm [name="height"]').val(r.height);
        $('#recruitmentForm [name="employWay"]').val(r.employWay);
        $('#recruitmentForm [name="householdType"]').val(r.householdType);
        $('#recruitmentForm [name="political"]').val(r.political);
        $('#recruitmentForm [name="education"]').val(r.education);
        $('#recruitmentForm [name="phone"]').val(r.phone);
        $('#recruitmentForm [name="wechat"]').val(r.wechat);
        $('#recruitmentForm [name="qq"]').val(r.qq);
        $('#recruitmentForm [name="address"]').val(r.address);
        $('#recruitmentForm [name="nativePlace"]').val(r.nativePlace);
        $('#recruitmentForm [name="hometownPlace"]').val(r.hometownPlace);
        $('#recruitmentForm [name="specialty"]').val(r.specialty);
        $('#recruitmentForm [name="emergencyMan"]').val(r.emergencyMan);
        $('#recruitmentForm [name="emergencyPhone"]').val(r.emergencyPhone);
        var switches = ['isMarried', 'isBirth', 'isHouse', 'isCar', 'isHouseLoan', 'isCarLoan', 'isCarID', 'isPassID', 'isHMID', 'isTWID', 'isContract', 'isSnsurance', 'isFire', 'isCnsurance', 'isCompete', 'isTrain', 'isCriminal', 'isDisease'];
        $.each(switches, function (i, k) { $('#recruitmentForm [name="' + k + '"]').prop('checked', r[k] == 0); });
        form.render();
    });

    function doSave() {
        var opt = { 'recruitment.rid': rid };
        ['name', 'phone', 'identity', 'height', 'weight', 'nation', 'place', 'hometownPlace', 'qq', 'wechat', 'employWay', 'political', 'householdType', 'nativePlace', 'education', 'address', 'specialty', 'emergencyMan', 'emergencyPhone'].forEach(function (f) {
            opt['recruitment.' + f] = $('#recruitmentForm [name="' + f + '"]').val();
        });
        ['isMarried', 'isCarID', 'isBirth', 'isHouse', 'isCar', 'isCarLoan', 'isHouseLoan', 'isPassID', 'isHMID', 'isTWID', 'isContract', 'isSnsurance', 'isFire', 'isCnsurance', 'isTrain', 'isCompete', 'isCriminal', 'isDisease'].forEach(function (f) {
            opt['recruitment.' + f] = getProp[$('#recruitmentForm [name="' + f + '"]').prop('checked')];
        });
        app.post(api.personel.updateRecruitment, opt, function () {
            app.showAlert(app.success, '编辑成功');
            var idx = (window.parent && window.parent.layer) ? window.parent.layer.getFrameIndex(window.name) : null;
            if (idx != null) window.parent.layer.close(idx);
        });
    }

    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () {
        var idx = (window.parent && window.parent.layer) ? window.parent.layer.getFrameIndex(window.name) : null;
        if (idx != null) window.parent.layer.close(idx);
    });
});
}); // end app.ready
