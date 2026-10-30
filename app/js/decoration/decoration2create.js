/** app/js/decoration/decoration2create.js —— 创建装修单（弹窗子页）
 *  三段：客户（下拉搜索 queryCustomerForName + 新建 addCustomer）
 *        房产（楼盘下拉 queryVillageForNameByPinyin + 楼号失焦校验 queryHouseByNoAHnum/checkDecoration + 新建 addHouse）
 *        订单（订单类型 queryDecorationAtttype / 业务类型 queryDecorationBusitype / 各角色人员 / 非业务员 / 返单人员）
 *  保存：createDecoration / maketype=advance → createDecorationForAdvance。
 *  旧 typeahead 全量搜索 → layui 下拉（queryUserByPinyin/queryCustomerForName 全量加载）。 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var E = decorationCommon.ENUM;
    var lp = app.params.urlLoadParams || {};
    var maketype = lp.maketype, entrytype = lp.entrytype;
    var profitflag = null;
    var houseHid = null;          // 已绑定房产
    var typeMap = {};             // 订单类型 key → type int
    var customerIdx = null, houseIdx = null;

    // 国补利润标记
    app.post(api.system.querySystemConfigByKey, { 'systemConfig.key': 'COUNTRY_PROFIT_FLAG_STR' }, function (res) {
        if (res.systemConfig && res.systemConfig.scid) profitflag = res.systemConfig.value;
    });

    // —— 下拉加载 ——
    function fillUsers(sel, status) {
        app.post(api.personel.queryUserByPinyin, { 'user.status': status != null ? status : 0, 'departmentType.name': '' }, function (res) {
            var html = '<option value="">请选择<\/option>';
            $.each(res.autoFillKeyValue || [], function (i, v) { html += '<option value="' + v.key + '">' + v.value + '<\/option>'; });
            $(sel).html(html);
            form.render('select');
        });
    }
    function fillVillages(sel) {
        app.post(api.data.queryVillageForNameByPinyin, {}, function (res) {
            var html = '<option value="">请选择楼盘<\/option>';
            $.each(res.autoFillKeyValue || [], function (i, v) { html += '<option value="' + v.key + '">' + v.value + '<\/option>'; });
            $(sel).html(html);
            form.render('select');
        });
    }
    function fillCustomers() {
        app.post(api.data.queryCustomerForName, {}, function (res) {
            var html = '<option value="">请选择客户（可搜索）<\/option>';
            $.each(res.autoFillCustomer || [], function (i, v) { html += '<option value="' + v.key + '">' + v.value + '<\/option>'; });
            $('#customerId').html(html);
            form.render('select');
        });
    }
    // 业务类型（启用状态）
    app.post(api.data.queryDecorationBusitype, {}, function (res) {
        var html = '<option value="">请选择<\/option>';
        $.each(res.decorationBusitypes || [], function (i, v) {
            if (v.status == 0) html += '<option value="' + v.dbid + '">' + v.name + '<\/option>';
        });
        $('#busitype').html(html);
        form.render('select');
    });
    // 订单类型（启用状态，key → type）
    app.post(api.data.queryDecorationAtttype, {}, function (res) {
        var html = '<option value="">请选择<\/option>';
        $.each(res.decorationAtttypes || [], function (i, v) {
            if (v.status == 0) {
                typeMap[v.key] = v.type;
                html += '<option value="' + v.key + '">' + v.name + '<\/option>';
            }
        });
        $('#orderType').html(html);
        form.render('select');
    });

    fillCustomers();
    fillVillages('#villageId');
    fillVillages('#hVillage');
    fillUsers('#designerId'); fillUsers('#salesmanId'); fillUsers('#quoterId'); fillUsers('#escorterId'); fillUsers('#materialerId');

    // 已有客户装修单校验（多单模式跳过）
    form.on('select(customerId)', function (d) {
        if (!d.value) return;
        app.post(api.decoration.queryDecorationByCustomerId, { 'decoration.customer.cid': d.value }, function (res) {
            if (maketype != 'advance' && res.decorations && res.decorations.length) {
                var dec = res.decorations[0];
                app.showAlert(app.warning, '装修单已存在.装修单号:' + dec.orderId + ',所属设计师:' + (dec.designer ? dec.designer.currentName : ''));
                $('#customerId').val('').removeAttr('selected');
                form.render('select');
            }
        });
    });

    // 楼号失焦 → 房产校验/绑定
    $('#houseNumber').on('blur', function () {
        var no = $.trim($('#villageId').val());
        var num = $.trim($(this).val());
        if (!no || !num) return;
        app.post(api.data.queryHouseByNoAHnum, { 'house.village.no': no, 'house.houseNumber': num, 'house.status': 0 }, function (res) {
            var house = res.house;
            app.post(api.decoration.checkDecoration, { 'decoration.house.hid': house.hid }, function (des) {
                if (des.decoration && des.decoration.orderId) {
                    app.showAlert(app.warning, '装修单已存在.');
                } else {
                    app.showConfirm('已有该房产信息,是否绑定?', function () {
                        houseHid = house.hid;
                        $('#houseArea').val(house.buildArea);
                        $('#houseInnerArea').val(house.innerArea);
                        $('#apartmentType').val(house.houseType);
                        app.showAlert(app.success, '绑定成功');
                    }, function () {
                        openHouse();
                    });
                }
            }, null, false);
        }, function () {
            app.showAlert(app.warning, '房产不存在，请创建房产');
            openHouse();
        }, false);
    });

    // —— 新建客户 ——
    $('#btnCreateCustomer').on('click', function () {
        $('#customerForm')[0].reset();
        customerIdx = layer.open({ type: 1, title: '新建客户', content: $('#customerBox'), area: ['560px', '80%'],
            btn: ['保存', '取消'], yes: function (idx) {
                var name = $.trim($('#cName').val()), phone = $.trim($('#cPhone').val());
                if (!name) { app.showAlert(app.warning, '请输入客户姓名'); return; }
                if (!/^\d{11}$/.test(phone)) { app.showAlert(app.warning, '请输入11位电话'); return; }
                app.post(api.data.addCustomer, {
                    'customer.name': name, 'customer.gender': $('#cGender').val(), 'customer.phone': phone,
                    'customer.identity': $.trim($('#cIdentity').val()), 'customer.qq': $.trim($('#cQq').val()),
                    'customer.wechat': $.trim($('#cWechat').val()), 'customer.email': $.trim($('#cEmail').val()),
                    'customer.relationshipType': $('#cRelationshipType').val(), 'customer.address': $.trim($('#cAddress').val())
                }, function (res) {
                    app.showAlert(app.success, '创建用户成功');
                    fillCustomers();
                    setTimeout(function () {
                        $('#customerId').val(res.customer.cid);
                        form.render('select');
                    }, 300);
                    layer.close(idx);
                });
            } });
    });

    // —— 新建房产 ——
    function openHouse() {
        $('#houseForm')[0].reset();
        houseIdx = layer.open({ type: 1, title: '新建房产', content: $('#houseBox'), area: ['620px', '80%'],
            btn: ['保存', '取消'], yes: function (idx) {
                var villageNo = $.trim($('#hVillage').val());
                if (!villageNo) { app.showAlert(app.warning, '请选择楼盘'); return; }
                var houseNumber = $.trim($('#hHouseNumber').val()) || (($.trim($('#hBuilt').val()) || '') + '-' + ($.trim($('#hUnit').val()) || '') + '-' + ($.trim($('#hFloor').val()) || '') + '-' + ($.trim($('#hDoor').val()) || ''));
                app.post(api.data.addHouse, {
                    'house.village.no': villageNo,
                    'house.built': $.trim($('#hBuilt').val()), 'house.unit': $.trim($('#hUnit').val()),
                    'house.floor': $.trim($('#hFloor').val()), 'house.door': $.trim($('#hDoor').val()),
                    'house.houseNumber': houseNumber,
                    'house.type': 0,
                    'house.buildArea': app.utils.changeThrDecimal($.trim($('#hBuildArea').val()) || 0),
                    'house.freeArea': 0, 'house.innerArea': 0, 'house.totalArea': 0,
                    'house.maxFloor': $.trim($('#hMaxFloor').val()),
                    'house.through': 0, 'house.orientation': 0, 'house.feature': '', 'house.waterVapour': 0,
                    'house.parlourType': 0, 'house.heatingType': 0, 'house.isLift': 0,
                    'house.roomNum': $.trim($('#hRoom1').val()) || 0,
                    'house.houseType': (($.trim($('#hRoom1').val()) || 0) + '室' + ($.trim($('#hRoom2').val()) || 0) + '厅' + ($.trim($('#hRoom3').val()) || 0) + '厨' + ($.trim($('#hRoom4').val()) || 0) + '卫'),
                    'house.status': 0
                }, function (res) {
                    app.showAlert(app.success, '操作成功');
                    $('#villageId').val(villageNo);
                    $('#houseNumber').val(houseNumber);
                    form.render('select');
                    houseHid = res.house.hid;
                    $('#houseArea').val(res.house.buildArea);
                    $('#houseInnerArea').val(res.house.innerArea);
                    $('#apartmentType').val(res.house.houseType);
                    layer.close(idx);
                });
            } });
    }
    $('#btnCreateHouse').on('click', openHouse);

    // —— 保存订单 ——
    $('#btnSave').on('click', function () {
        var cidVal = $('#customerId').val();
        var orderTypeKey = $('#orderType').val();
        if (!cidVal) { app.showAlert(app.warning, '请选择客户'); return; }
        if (!orderTypeKey) { app.showAlert(app.warning, '请选择订单类型'); return; }
        if (!houseHid) { app.showAlert(app.error, '房产信息未填写'); return; }
        if (!$('#designerId').val()) { app.showAlert(app.warning, '请选择设计师'); return; }
        if (!$('#salesmanId').val()) { app.showAlert(app.warning, '请选择业务员'); return; }
        var opts = {
            'decoration.customer.cid': cidVal,
            'decoration.houseType': $('#houseType').val(),
            'decoration.houseClass': $('#houseClass').val(),
            'decoration.designer.userId': $('#designerId').val(),
            'decoration.salesman.userId': $('#salesmanId').val(),
            'decoration.busitype': $('#busitype').val(),
            'decorationInfo.notSalesmanName': $.trim($('#notSalesmanName').val()),
            'decoration.notSalesmanRate': $.trim($('#notSalesmanRate').val()),
            'decorationInfo.notSalesmanPhone': $.trim($('#notSalesmanPhone').val()),
            'decorationInfo.notSalesmanContent': $.trim($('#notSalesmanContent').val()),
            'decorationInfo.backOrderName': $.trim($('#backOrderName').val()),
            'decorationInfo.backOrderPhone': $.trim($('#backOrderPhone').val()),
            'decorationInfo.backOrderContent': $.trim($('#backOrderContent').val()),
            'decoration.resourceType': $('#status').val(),
            'decoration.approveStatus': 0,
            'decoration.type': typeMap[orderTypeKey],
            'decoration.typeness': orderTypeKey,
            'decoration.quoter.userId': $('#quoterId').val(),
            'decoration.escorter.userId': $('#escorterId').val(),
            'decoration.materialer.userId': $('#materialerId').val(),
            'decoration.house.hid': houseHid,
            'decoration.grade': $('#orderGrade').val()
        };
        if (profitflag && entrytype) opts['decoration.bompany'] = profitflag;
        var url = (maketype == 'advance') ? api.decoration.createDecorationForAdvance : api.decoration.createDecoration;
        app.post(url, opts, function (data) {
            app.showAlert(app.success, '操作成功，装修单号：' + (data.decoration ? data.decoration.orderId : ''));
            resetForm();
        });
    });

    function resetForm() {
        $('#orderForm')[0].reset();
        $('#notSalesmanRate').val('0');
        houseHid = null;
        ['#customerId', '#villageId', '#designerId', '#salesmanId', '#quoterId', '#escorterId', '#materialerId'].forEach(function (s) {
            $(s).val('');
        });
        form.render('select');
    }

    $('#btnCancel').on('click', function () {
        var idx = parent.layer.getFrameIndex(window.name);
        if (idx) parent.layer.close(idx); else window.close();
    });
});
}); // end app.ready
