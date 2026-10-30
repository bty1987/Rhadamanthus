/** app/js/contract/C-001-D-6-0001.js —— 方林免责协议（合同模板页）
 *  上下文：app.params.decoration = { orderId, contractargs:{cid,company,type}, contract? }。
 *  type=0（工程）附停工/复工日期，type=1（设计费）只附复工日期。 */
app.ready(function () {
layui.use(['form', 'laydate', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    contractCommon.ensureApiStubs();
    var E = contractCommon.ENUM;
    var ctx = contractCommon.resolveCtx();
    var args = ctx.contractargs || {};
    var orderId = ctx.orderId;

    var state = { customer: null, cover: {}, current: new Date() };

    if (args.company != '1') $('.company').hide();
    if (args.company == '1') $('.customer').hide();
    if (!args.type) $('.constructionDelay').hide();
    if (args.type == '1') $('.stopWork').hide();

    contractCommon.current(function (d) { state.current = d; });
    contractCommon.date(['con-project-data', 'con-stopWork-data', 'con-reWork-data']);
    contractCommon.date(['con-sign-year'], 'year');
    contractCommon.date(['con-sign-month'], 'month');
    contractCommon.date(['con-sign-day'], 'day');

    app.bindData($('#con-decoration-type'), contractCommon.toDatas(E.typeness), 'key', 'value');
    form.render('select');

    // 装修单 + 客户
    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
        var data = res.decoration || {};
        var house = data.house || {}, village = house.village || {}, proper = village.cityProper || {};
        var customer = data.customer || {};
        state.customer = customer;

        $('#con-work-status').val(E.projectStatus[data.projectStatus]);
        $('#con-customer-name').val(customer.name);

        state.cover['con-orderId'] = data.orderId;
        state.cover['sin-customer-name'] = customer.name;

        $('#con-company-no').val(customer.companyNo);
        $('#con-company-name').val(customer.companyName);

        $('#con-province-name').val(proper.city ? proper.city.province : '');
        $('#con-city-name').val(proper.city ? proper.city.name : '');
        $('#con-proper-name').val(proper.name);
        $('#con-village-name').val(village.name);
        $('#con-housenumber').val(house.houseNumber);
        $('#con-decoration-type').val(data.typeness);
        form.render('select');
    }, null, false);

    app.post(api.data.queryCustomerForPhone, { 'customerPhone.cid': state.customer.cid, 'customerPhone.cpid': 0 }, function (res) {
        state.customer = res.customer || {};
        $('#con-customer-phone').val(state.customer.phone);
        $('#con-customer-ident').val(state.customer.identity);

        $('#con-company-no').val(state.customer.companyNo);
        $('#con-company-name').val(state.customer.companyName);

        state.cover['sin-customer-phone'] = state.customer.phone;
        state.cover['sin-customer-ident'] = state.customer.identity;
    }, null, false);

    if (args.company == '1' && state.customer.type == 0) {
        app.showAlert(app.warning, '客户类型为个人');
        $('#form').empty();
        return;
    }

    // 话术
    contractCommon.bindTalking([
        { id: 'con-markup-one', types: { 'types[0]': 0 } },
        { id: 'con-markup-two', types: { 'types[0]': 1 } }
    ]);

    // 保存
    $('#preservation').on('click', function () {
        if (app.validate('form')) return false;

        app.showConfirm('请仔细认真检查合同填写内容', function () {
            var data = $.extend({}, contractCommon.collect('#form'), state.cover);

            data['con-decoration-type'] = E.typeness[$('#con-decoration-type').val()];
            data['con-project-year'] = $('#con-project-data').val().substr(0, 4);
            data['con-project-month'] = $('#con-project-data').val().substr(5, 2);
            data['con-project-day'] = $('#con-project-data').val().substr(8, 2);

            if (args.company == '1') {
                data['sin-company-name'] = data['con-company-name'];
                delete data['con-customer-ident'];
                delete data['con-company-name'];
            }

            if (args.type == '0') {
                data['con-stopWork-year'] = $('#con-stopWork-data').val().substr(0, 4);
                data['con-stopWork-month'] = $('#con-stopWork-data').val().substr(5, 2);
                data['con-stopWork-day'] = $('#con-stopWork-data').val().substr(8, 2);
                data['con-reWork-year'] = $('#con-reWork-data').val().substr(0, 4);
                data['con-reWork-month'] = $('#con-reWork-data').val().substr(5, 2);
                data['con-reWork-day'] = $('#con-reWork-data').val().substr(8, 2);
            }

            if (args.type == '1') {
                data['con-reWork-year'] = $('#con-reWork-data').val().substr(0, 4);
                data['con-reWork-month'] = $('#con-reWork-data').val().substr(5, 2);
                data['con-reWork-day'] = $('#con-reWork-data').val().substr(8, 2);
            }

            contractCommon.saveDecorationContract(data);
        });
    });

    $('#btnClose').on('click', function () { contractCommon.closeSelfPopup(); });
});
}); // end app.ready
