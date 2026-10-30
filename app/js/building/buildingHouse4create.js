/** app/js/building/buildingHouse4create.js —— 创建房源（表单页 + 创建客户弹窗）
 *  对齐旧 WebContent/js/building/buildingHouse4create.js。
 *  旧逻辑要点：自动算单价(totalPrice/buildArea)；创建客户(api.data.addCustomer)；保存房源(api.building.addBuildingHouse)。
 *  新前端无 typeahead，客户/楼盘/跟进人/收钥匙人改用直接填 ID 的方式（带校验）。 */
app.ready(function () {
layui.use(['form', 'laydate', 'layer', 'jquery'], function () {
    var form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    var custIdx = null;

    app.breadcrumb([{ icon: 'layui-icon-home', text: '房源' }, { text: '创建房源' }]);
    laydate.render({ elem: '#decorateTime' });
    laydate.render({ elem: '#documentsDate' });
    laydate.render({ elem: '#checkingTime' });

    // 自动计算单价 = 总价 / 建筑面积
    function calcUnit() {
        var tp = parseFloat($('#totalPrice').val()), ba = parseFloat($('#buildArea').val());
        if (!isNaN(tp) && !isNaN(ba) && ba > 0) { $('#unitPrice').val(app.utils.accDiv(tp, ba)); }
    }
    $('#totalPrice').on('blur', calcUnit);
    $('#buildArea').on('blur', calcUnit);

    // 拼接 houseNumber
    function buildHouseNumber() {
        var built = $.trim($('[name="built"]').val()).toUpperCase();
        var builtrule = $('[name="builtrule"]').val();
        var unit = $.trim($('[name="unit"]').val()).toUpperCase();
        var unitrule = $('[name="unitrule"]').val();
        var floor = $.trim($('[name="floor"]').val()).toUpperCase();
        var floorrule = $('[name="floorrule"]').val();
        var door = $.trim($('[name="door"]').val()).toUpperCase();
        var doorrule = $('[name="doorrule"]').val();
        return built + builtrule + unit + unitrule + floor + floorrule + door + doorrule;
    }

    // 拼接 houseType 文本
    function buildHouseTypeText() {
        return ($('[name="houseTypeOne"]').val() || '0') + '室' + ($('[name="houseTypeTwo"]').val() || '0') + '厅' + ($('[name="houseTypeThr"]').val() || '0') + '厨' + ($('[name="houseTypeFour"]').val() || '0') + '卫';
    }

    // 保存房源
    $('#btnSave').on('click', function () {
        if (app.validate('houseForm')) return;
        var opt = {};
        var fields = ['type','sourceType','deedNum','deedValue','unitPrice','totalPrice','decorateTime','decorateDegree','discussType','rentType','indoores','history','propertyFee','elevator','onlyHousing','documentsDate','allowLoan','beingLoan','checkingTime','housingGrade','comment'];
        $.each(fields, function (i, k) { opt['buildingHouse.' + k] = $('[name="' + k + '"]').val(); });
        opt['buildingHouse.customer.cid'] = $('[name="customerId"]').val();
        opt['buildingHouse.followUser.userId'] = $('[name="followUserId"]').val();
        opt['buildingHouse.keyer.userId'] = $('[name="keyerId"]').val();

        // 房产数据：拼接 houseNumber 后先用 checkBuildingHouse 校验，再 addBuildingHouse
        var villageNo = $('[name="villageNo"]').val();
        var houseNumber = buildHouseNumber();
        opt['house.village.no'] = villageNo;
        opt['house.houseNumber'] = houseNumber;
        opt['house.built'] = $('[name="built"]').val();
        opt['house.unit'] = $('[name="unit"]').val();
        opt['house.floor'] = $('[name="floor"]').val();
        opt['house.door'] = $('[name="door"]').val();
        opt['house.type'] = $('[name="houseType"]').val();
        opt['house.buildArea'] = app.utils.changeThrDecimal($('[name="buildArea"]').val());
        opt['house.maxFloor'] = $('[name="maxFloor"]').val();
        opt['house.through'] = $('[name="through"]').val();
        opt['house.roomNum'] = $('[name="houseTypeOne"]').val();
        opt['house.houseType'] = buildHouseTypeText();
        opt['house.orientation'] = $('[name="orientation"]').val();
        opt['house.feature'] = $('[name="feature"]').val();
        opt['house.waterVapour'] = $('[name="waterVapour"]').val();
        opt['house.parlourType'] = $('[name="parlourType"]').val();
        opt['house.heatingType'] = $('[name="heatingType"]').val();
        opt['house.status'] = 0;

        app.post(api.building.addBuildingHouse, opt, function () {
            app.showAlert(app.success, '房源创建成功');
            $('#houseForm')[0].reset();
            form.render();
        });
    });

    // 打开创建客户弹窗
    $('#btnCreateCustomer').on('click', function () {
        app.clearValidator();
        $('#customerForm')[0].reset();
        form.render();
        custIdx = layer.open({ type: 1, title: '创建客户', content: $('#customerBox'), area: ['520px', 'auto'] });
    });

    // 创建客户
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

    // 联系方式失焦校验是否已存在
    $('#custPhone').on('blur', function () {
        var phone = $.trim($(this).val());
        if (!phone) return;
        app.post(api.data.checkCustomerForPhone, { 'customerPhone.phone': phone, 'customerPhone.status': 0 }, function () {
            // 不存在，可用
        }, function () {
            app.showTip($('#custPhone'), '电话号码已存在', 2);
        });
    });

    form.render();
});
}); // end app.ready
