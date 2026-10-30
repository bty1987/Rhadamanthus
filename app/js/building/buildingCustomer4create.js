/** app/js/building/buildingCustomer4create.js —— 创建客源（表单页 + 创建客户弹窗）
 *  对齐旧 WebContent/js/building/buildingCustomer4create.js。
 *  校验：需求价格/面积 区间（high > low）。 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    var custIdx = null;

    app.breadcrumb([{ icon: 'layui-icon-home', text: '客源' }, { text: '创建客源' }]);

    $('#btnSave').on('click', function () {
        var pLow = parseFloat($('[name="priceLow"]').val()), pHigh = parseFloat($('#priceHigh').val());
        var aLow = parseFloat($('[name="areaLow"]').val()), aHigh = parseFloat($('#areaHigh').val());
        if (!isNaN(pHigh) && !isNaN(pLow) && pHigh <= pLow) { app.showTip($('#priceHigh'), '请填写可接受的最高价格', 2); return; }
        if (!isNaN(aHigh) && !isNaN(aLow) && aHigh <= aLow) { app.showTip($('#areaHigh'), '请填写需求面积的最大值', 2); return; }
        if (app.validate('customerSourceForm')) return;

        var opt = {
            'buildingCustomer.customer.cid': $('[name="customerId"]').val(),
            'buildingCustomer.type': $('[name="type"]').val(),
            'buildingCustomer.purpose': $('[name="purpose"]').val(),
            'buildingCustomer.intention': $('[name="intention"]').val(),
            'buildingCustomer.price': $('[name="priceLow"]').val() + ',' + $('#priceHigh').val(),
            'buildingCustomer.area': $('[name="areaLow"]').val() + ',' + $('#areaHigh').val(),
            'buildingCustomer.familyType': $('[name="familyType"]').val(),
            'buildingCustomer.orientation': $('[name="orientation"]').val(),
            'buildingCustomer.conditions': $('[name="conditions"]').val(),
            'buildingCustomer.grade': $('[name="grade"]').val(),
            'buildingCustomer.comment': $('[name="comment"]').val()
        };
        app.post(api.building.addBuildingCustomer, opt, function () {
            app.showAlert(app.success, '客源创建成功');
            $('#customerSourceForm')[0].reset();
            form.render();
        });
    });

    $('#btnCreateCustomer').on('click', function () {
        app.clearValidator();
        $('#customerForm')[0].reset();
        form.render();
        custIdx = layer.open({ type: 1, title: '创建客户', content: $('#customerBox'), area: ['520px', 'auto'] });
    });

    $('#btnCustSave').on('click', function () {
        if (app.validate('customerForm')) return;
        var copt = {};
        $.each(['name','gender','qq','wechat','email','relationshipType','address','phone'], function (i, k) { copt['customer.' + k] = $('#customerForm [name="' + k + '"]').val(); });
        app.post(api.data.addCustomer, copt, function (res) {
            app.showAlert(app.success, '创建用户成功');
            $('[name="customerId"]').val(res.customer.cid);
            layer.close(custIdx); custIdx = null;
        }, function (e) {
            app.showAlert(app.warning, e.errorMsg || '客户电话已存在');
        });
    });
    $('#btnCustCancel').on('click', function () { layer.close(custIdx); custIdx = null; });

    $('#custPhone').on('blur', function () {
        var phone = $.trim($(this).val());
        if (!phone) return;
        app.post(api.data.checkCustomerForPhone, { 'customerPhone.phone': phone, 'customerPhone.status': 0 }, function () {}, function () {
            app.showTip($('#custPhone'), '电话号码已存在', 2);
        });
    });

    form.render();
});
}); // end app.ready
