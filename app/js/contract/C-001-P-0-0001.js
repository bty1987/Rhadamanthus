/** app/js/contract/C-001-P-0-0001.js —— 方林人事合同（合同模板页，personel 上下文）
 *  上下文：app.params.personel = { contractargs:{cid,no,name,title,type}, uid, userId }（或 URL 查询参数）。
 *  人员信息：queryUserInfoByUserId；保存走 addUserContract。 */
app.ready(function () {
layui.use(['form', 'laydate', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    contractCommon.ensureApiStubs();
    var E = contractCommon.ENUM;
    var ctx = contractCommon.resolveCtx('personel');
    var args = ctx.contractargs || {};
    var uid = ctx.uid;
    var userId = ctx.userId != null ? ctx.userId : ctx.uid;

    var state = { user: null, cover: {}, current: new Date() };

    if (args.type == '1') { $('.undispatch').hide(); $('.householdtype').hide(); }
    if (args.type != '1' && args.type != '2') $('.dispatch').hide();
    if (args.type == '2') $('.insure').hide();

    contractCommon.date(['cov-sign-data', 'con-sign-data', 'sign-sign-data', 'sign-sign-data1',
        'con-work-start-date', 'con-term-start-date', 'con-term-end-date',
        'con-probation-start-date', 'con-probation-end-date']);
    contractCommon.date(['con-salary-date'], 'day');

    // 试用期切换
    $('.probation').hide();
    form.on('select(con-probation)', function (d) {
        if (d.value == '1') {
            $('.probation').show();
        } else {
            $('.probation').hide();
            $('#con-probation-start-date').val('');
            $('#con-probation-end-date').val('');
        }
    });

    contractCommon.current(function (d) { state.current = d; });

    // 人员信息
    app.post(api.personel.queryUserInfoByUserId, { 'userInfo.user.userId': userId }, function (res) {
        var userInfo = res.userInfo || {};
        var user = userInfo.user || {};

        $('#con-user-name').val(user.currentName);
        $('#con-user-gender').val(user.gender);
        $('#con-user-ident').val(user.identity);
        $('#con-user-phone').val(user.phone);
        $('#con-user-wechat').val(userInfo.wechat);
        $('#con-duty').val(user.duty ? user.duty.name : '');
        $('#con-user-addr').val(userInfo.address);
        $('#con-company-name').val(user.companys);

        state.user = user;
        state.cover['cov-user-name'] = user.currentName;

        app.bindData($('#con-user-householdType'), contractCommon.toDatas(E.householdType), 'key', 'value');
        $('#con-user-householdType').val(userInfo.householdType);
        form.render('select');
    }, null, false);

    // 保存
    $('#preservation').on('click', function () {
        if (app.validate('form')) return false;

        app.showConfirm('请仔细认真检查合同填写内容', function () {
            var data = $.extend({}, contractCommon.collect('#form'), state.cover);

            if (args.type != '1') {
                data['con-user-householdType'] = $('#con-user-householdType option:selected').text();
            }

            data['cov-sign-year'] = $('#cov-sign-data').val().substr(0, 4);
            data['cov-sign-month'] = $('#cov-sign-data').val().substr(5, 2);
            data['cov-sign-day'] = $('#cov-sign-data').val().substr(8, 2);
            data['con-sign-year'] = $('#con-sign-data').val().substr(0, 4);
            data['con-sign-month'] = $('#con-sign-data').val().substr(5, 2);
            data['con-sign-day'] = $('#con-sign-data').val().substr(8, 2);
            data['sin-sign-year'] = $('#sign-sign-data').val().substr(0, 4);
            data['sin-sign-month'] = $('#sign-sign-data').val().substr(5, 2);
            data['sin-sign-day'] = $('#sign-sign-data').val().substr(8, 2);
            data['sin-sign-year1'] = $('#sign-sign-data1').val().substr(0, 4);
            data['sin-sign-month1'] = $('#sign-sign-data1').val().substr(5, 2);
            data['sin-sign-day1'] = $('#sign-sign-data1').val().substr(8, 2);

            data['con-work-year'] = $('#con-work-start-date').val().substr(0, 4);
            data['con-work-month'] = $('#con-work-start-date').val().substr(5, 2);
            data['con-work-day'] = $('#con-work-start-date').val().substr(8, 2);
            data['con-start-year'] = $('#con-term-start-date').val().substr(0, 4);
            data['con-start-month'] = $('#con-term-start-date').val().substr(5, 2);
            data['con-start-day'] = $('#con-term-start-date').val().substr(8, 2);
            data['con-end-year'] = $('#con-term-end-date').val().substr(0, 4);
            data['con-end-month'] = $('#con-term-end-date').val().substr(5, 2);
            data['con-end-day'] = $('#con-term-end-date').val().substr(8, 2);

            if ($('#con-probation').val() == '1' && $('#con-probation-start-date').val()) {
                data['con-start-year1'] = $('#con-probation-start-date').val().substr(0, 4);
                data['con-start-month1'] = $('#con-probation-start-date').val().substr(5, 2);
                data['con-start-day1'] = $('#con-probation-start-date').val().substr(8, 2);
                data['con-end-year1'] = $('#con-probation-end-date').val().substr(0, 4);
                data['con-end-month1'] = $('#con-probation-end-date').val().substr(5, 2);
                data['con-end-day1'] = $('#con-probation-end-date').val().substr(8, 2);
            } else {
                data['con-start-year1'] = '';
                data['con-start-month1'] = '';
                data['con-start-day1'] = '';
                data['con-end-year1'] = '';
                data['con-end-month1'] = '';
                data['con-end-day1'] = '';
            }

            if (args.type != '1') delete data['con-company-name'];
            if (args.type != '1' && args.type != '2') delete data['con-company-addr'];
            if (args.type == '2') {
                delete data['con-work-year'];
                delete data['con-work-month'];
                delete data['con-work-day'];
            }

            var options = {
                'userContract.uid': uid,
                'contract.cid': args.cid,
                'data': JSON.stringify(data),
                'contract.no': args.no,
                'contract.name': args.name,
                'contract.title': args.title
            };

            var loader = app.showLoading('合同生成中...', { shade: 0.3 });
            app.post(api.personel.addUserContract, options, function () {
                app.hideLoading(loader);
                app.showAlert(app.success, '操作成功');
                contractCommon.closeSelfPopup();
            }, function (res) {
                app.hideLoading(loader);
                app.showAlert(app.error, (res && res.errorMsg) || '操作失败');
            });
        });
    });

    $('#btnClose').on('click', function () { contractCommon.closeSelfPopup(); });
});
}); // end app.ready
