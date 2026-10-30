/** app/js/customer/customerOrigine2create.js —— 客源创建（旧 customerOrigine2create.js → layui）
 *  表单：姓名/性别/电话/意向/楼盘（拼音检索+楼号规则提示）/楼号/建筑面积/需求价格/等级（A-D）/
 *  设计师/业务员（人员选择；业务员选定后按部门规则 queryCustomerDeptRuleByDid 加载业务类型）/
 *  业务类型（outside/isRefer → 控制来源方/对接人/推荐客户显隐）/推荐客户（推荐单号/电话/楼盘/楼号回填装修单信息）。
 *  保存：addCustomerOrigin（×1000 金额由 api tranargs 处理）。 */
app.ready(function () {
layui.use(['form', 'laydate', 'layer', 'jquery'], function () {
    var form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    customerCommon.ensureApiStubs();
    var state = {
        village: { no: null },
        referVillageNo: null,
        designerId: null, salesmanId: null,
        refer: { orderId: null }
    };

    laydate.render({ elem: '#referContractTime', type: 'date' });

    // —— 楼盘检索（主 + 推荐） ——
    function bindVillageSearch($input, $list, onPick) {
        $input.on('input', function () {
            var kw = $.trim($(this).val());
            if (!kw) return;
            app.post(api.data.queryVillageForNameByPinyin, { 'pinyinName': kw }, function (res) {
                $list.empty();
                $.each((res.autoFillKeyValues || res.villages || []).slice(0, 10), function (i, v) {
                    $('<a style="margin-right:10px;cursor:pointer;color:#01AAED;">').text(v.value || v.name).data('no', v.key || v.no).appendTo($list);
                });
            });
        });
        $list.on('click', 'a', function () {
            var no = $(this).data('no'), name = $(this).text();
            $input.val(name);
            $list.empty();
            onPick(no, name);
        });
    }

    bindVillageSearch($('#villageName'), $('#villageList'), function (no) {
        state.village.no = no;
        app.post(api.data.queryVillageByVid, { 'village.no': no }, function (res) {
            var rule = res.village ? res.village.rule : '';
            $('#rule').text('推荐楼牌号规则: ' + (rule == null || rule === '' ? '暂无推荐规则' : rule));
        }, null, false);
    });

    bindVillageSearch($('#referVillageName'), $('#referVillageList'), function (no) {
        state.referVillageNo = no;
        state.refer.orderId = null;
        lookupReferByHouse();
    });

    // —— 推荐客户开关 ——
    form.on('switch(referFilter)', function (obj) {
        $('.refer-customer-info').toggle(obj.elem.checked);
    });

    // —— 人员选择 ——
    $('#btnPickDesigner').on('click', function () {
        customerCommon.userPicker(function (u) {
            state.designerId = u.userId;
            $('#designerName').val(u.currentName);
        });
    });
    $('#btnPickSalesman').on('click', function () {
        customerCommon.userPicker(function (u) {
            state.salesmanId = u.userId;
            $('#salesmanName').val(u.currentName);
            loadBusitypesByDept(u);
        });
    });

    // 业务员部门规则 → 业务类型（带 outside-isRefer 标识）
    function loadBusitypesByDept(u) {
        var user = null;
        app.post(api.personel.queryUserByUserId, { 'user.userId': u.userId }, function (res) {
            user = res.user;
        }, null, false);
        if (!user || !user.dept) return;
        app.post(api.customer.queryCustomerDeptRuleByDid, {
            'customerDeptRule.department.did': user.dept.did
        }, function (res) {
            var busitypes = [];
            $.each(res.customerDeptRules || [], function (i, v) {
                if (v.busitype) busitypes.push(v.busitype);
            });
            var html = '<option value="">请选择</option>';
            $.each(busitypes, function (i, b) {
                var other = (b.outside != null ? b.outside : '') + '-' + (b.isRefer != null ? b.isRefer : '');
                html += '<option value="' + b.dbid + '" other="' + other + '">' + (b.name || '') + '<\/option>';
            });
            $('#busitypeSel').html(html);
            form.render('select');
        });
    }

    // 业务类型 → 三方/推荐 显示控制（outside=1 显示来源方/对接人）
    form.on('select(busitypeFilter)', function (obj) {
        var $opt = $('#busitypeSel option[value="' + obj.value + '"]');
        var other = $opt.attr('other');
        if (!other || other.indexOf('-') == -1) return;
        var parts = other.split('-');
        var outside = parts[0], isRefer = parts[1];
        if (outside == 0) { $('.source-group').hide(); $('.contact-group').hide(); }
        else { $('.source-group').show(); $('.contact-group').show(); }
        $('#referCustomer').prop('checked', isRefer != 0).prop('disabled', true);
        $('.refer-customer-info').toggle(isRefer != 0);
        form.render('checkbox');
    });

    // —— 推荐回填（按单号/电话/楼盘楼号） ——
    function fillRefer(decoration) {
        if (!decoration) return;
        if (decoration.orderId) {
            $('#referOrderId').val(decoration.orderId);
            var phone = decoration.customer ? decoration.customer.phone : '';
            if (phone) {
                phone = String(phone);
                $('#referPhone').val((decoration.status == 3 || decoration.status == 7)
                    ? (phone.substring(0, 3) + '******' + phone.substring(9)) : '客户电话');
            }
            state.refer.orderId = decoration.orderId;
        }
        if (decoration.precontractTime) $('#referContractTime').val(decoration.precontractTime);
        if (decoration.contractTime) $('#referContractTime').val(decoration.contractTime);
        if (decoration.house && decoration.house.village && decoration.house.village.name) {
            $('#referVillageName').val(decoration.house.village.name);
            state.referVillageNo = decoration.house.village.no;
        }
        if (decoration.house && decoration.house.houseNumber) {
            $('#referHouseNumber').val(decoration.house.houseNumber);
        }
    }

    $('#referOrderId').on('blur', function () {
        var orderId = $.trim($(this).val());
        if (!orderId) return;
        app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
            fillRefer(res.decoration);
        }, function () {
            app.showAlert(app.error, '推荐客户不存在');
        });
    });

    $('#referPhone').on('blur', function () {
        state.refer.orderId = null;
        var phone = $.trim($(this).val());
        if (!phone) return;
        app.post(api.decoration.pageDecorationForCustomer, {
            'customerPhone': phone,
            'paging.page': 1,
            'paging.rows': 10
        }, function (res) {
            if (!res.paging || res.paging.totalRecords == 0) {
                app.showAlert(app.error, '推荐客户不存在');
                return;
            }
            fillRefer((res.paging.data || [])[0]);
        }, function () {
            app.showAlert(app.error, '推荐客户不存在');
        });
    });

    $('#referHouseNumber').on('blur', lookupReferByHouse);
    function lookupReferByHouse() {
        state.refer.orderId = null;
        var villageno = state.referVillageNo;
        var housenumber = $.trim($('#referHouseNumber').val());
        if (!villageno || !housenumber) return;
        var house = null;
        app.post(api.data.queryHouseByNoAHnum, {
            'house.village.no': villageno,
            'house.houseNumber': housenumber,
            'house.status': 0
        }, function (res) {
            house = res.house;
        }, null, false);
        if (!house) return;
        app.post(api.decoration.checkDecoration, { 'decoration.house.hid': house.hid }, function (res) {
            fillRefer(res.decoration);
        }, function () {
            app.showAlert(app.error, '推荐客户不存在');
        });
    }

    // —— 保存 ——
    $('#btnSave').on('click', function () {
        if (app.validate('createForm')) return;
        if (!state.village.no) { app.showAlert(app.warning, '请选择楼盘'); return; }
        if ($('#referCustomer').prop('checked') && $.trim($('#referOrderId').val()) === '') {
            app.showAlert(app.error, '请填写推荐单号！');
            return;
        }
        var options = {
            'customerOrigin.name': $('#createForm [name="name"]').val(),
            'customerOrigin.gender': $('#createForm [name="gender"]').val(),
            'customerOrigin.phone': $('#createForm [name="phone"]').val(),
            'customerOrigin.intention': $('#createForm [name="intention"]').val(),
            'customerOrigin.price': $('#createForm [name="price"]').val(),
            'customerOrigin.grade': $('#createForm [name="grade"]').val(),
            'customerOrigin.comment': $('#createForm [name="comment"]').val(),
            'customerOrigin.village.no': state.village.no,
            'customerOrigin.houseNumber': $('#createForm [name="houseNumber"]').val(),
            'customerOrigin.buildArea': $('#createForm [name="buildArea"]').val(),
            'customerOrigin.freeArea': 0,
            'customerOrigin.totalArea': 0,
            'customerOrigin.innerArea': $('#createForm [name="buildArea"]').val(),
            'customerOrigin.designer.userId': state.designerId != null ? state.designerId : '',
            'customerOrigin.salesman.userId': state.salesmanId != null ? state.salesmanId : '',
            'customerOrigin.decorationBusitype.dbid': $('#createForm [name="decorationBusitype"]').val(),
            'customerOrigin.source': $('#createForm [name="source"]').val(),
            'customerOrigin.contact': $('#createForm [name="contact"]').val()
        };
        if (state.refer.orderId) {
            options['customerOrigin.referOrderId'] = state.refer.orderId;
        }
        app.post(api.customer.addCustomerOrigin, options, function () {
            app.showAlert(app.success, '客源创建成功');
            doReset();
        });
    });

    function doReset() {
        $('#createForm')[0].reset();
        form.render();
        state.village = { no: null };
        state.referVillageNo = null;
        state.designerId = null;
        state.salesmanId = null;
        state.refer.orderId = null;
        $('#villageList').empty();
        $('#referVillageList').empty();
        $('#rule').empty();
        $('.refer-customer-info').hide();
        $('.source-group').hide();
        $('.contact-group').hide();
    }
    $('#btnReset').on('click', doReset);
});
}); // end app.ready
