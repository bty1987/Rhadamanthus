/** app/js/customer/customerOrigine.js —— 客源（旧 customerOrigine.js → layui，1302 行核心流程迁移）
 *  列表：pageConfig.apiPage（缺省 pageCustomerOrigin）+ user 参数；按钮/列由 customerCommon.getPageConfig(depage).pageBtn 驱动。
 *  行操作（pageBtn 键名与旧一致）：编辑 updateCustomerOrigin；绑定 bindCustomerOrigin（设计师/业务员/楼盘/客户校验）；
 *  直接初审 approveCustomerOrigin；释放 freeCustomerOrigin；二维码（fanglin.vip 链接）；
 *  确认 confirmCustomerOrigin；撤销 cancelCustomerOrigin；记录（弹 customerOrigineRecord）；
 *  归属 updateCustomerOriginForBelonger；认领 takeCustomerOrigin；直接转单 tranCustomerOrigin。
 *  创建：addCustomerOrigin（pageBtn 含 created 时显示按钮）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var depage = customerCommon.ctx('urlLoadParams').depage;
    var pageConfig = customerCommon.getPageConfig(depage);
    var pageBtn = pageConfig.pageBtn || [];
    var hasBtn = function (k) { return pageBtn.indexOf(k) != -1; };
    var listApi = pageConfig.apiPage || api.customer.pageCustomerOrigin;
    var state = {
        page: 1, rows: 10, total: 0,
        current: null, csid: null,
        editIndex: null, editMode: 'create', bindIndex: null, belongerIndex: null, dtIndex: null, codeIndex: null,
        village: { no: null },
        designerId: null, salesmanId: null,
        bindDesignerId: null, bindSalesmanId: null, bindVillageNo: null,
        belongerId: null, dtSalesmanId: null
    };

    customerCommon.dateRange('#createTime');

    // 业务类型
    app.post(api.data.queryDecorationBusitype, {}, function (res) {
        var list = res.decorationBusitypes || [];
        app.bindData($('#editForm [name="decorationBusitype"]'), list, 'dbid', 'name', true);
        app.bindData($('#bindForm [name="decorationBusitype"]'), list, 'dbid', 'name', true);
        app.bindData($('#directTranForm [name="decorationBusitype"]'), list, 'dbid', 'name', true);
        form.render('select');
    });
    if (hasBtn('created')) $('#btnCreate').show();

    // ==================== 列表 ====================
    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'name', title: '姓名', width: 90 },
            { field: 'phone', title: '电话', width: 120 },
            { field: 'gender', title: '性别', width: 60 },
            { field: 'village', title: '楼盘', width: 120, templet: function (d) { return d.village ? (d.village.name || '') : ''; } },
            { field: 'houseNumber', title: '楼号', width: 90 },
            { field: 'buildArea', title: '建筑面积', width: 90, align: 'right', templet: function (d) { return d.buildArea != null ? d.buildArea : ''; } },
            { field: 'decorationBusitype', title: '业务类型', width: 100, templet: function (d) { return d.decorationBusitype ? (d.decorationBusitype.name || '') : ''; } },
            { field: 'designer', title: '设计师', width: 90, templet: function (d) { return d.designer ? (d.designer.currentName || '') : ''; } },
            { field: 'salesman', title: '业务员', width: 90, templet: function (d) { return d.salesman ? (d.salesman.currentName || '') : ''; } },
            { field: 'belonger', title: '归属人', width: 90, templet: function (d) { return d.belonger ? (d.belonger.userName || '') : ''; } },
            { field: 'creater', title: '创建人', width: 90, templet: function (d) { return d.creater ? (d.creater.currentName || '') : ''; } },
            { field: 'createTime', title: '创建时间', width: 165 },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return customerCommon.badge(E.originStatus, d.status); } },
            { field: 'source', title: '来源方', width: 90 },
            { field: 'contact', title: '对接人', width: 90 },
            { field: 'referOrderId', title: '推荐单号', width: 100 },
            { field: 'comment', title: '备注', minWidth: 140 },
            { title: '操作', width: 460, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        switch (obj.event) {
            case 'edit': openEdit(v, 'edit'); break;
            case 'bind': openBind(v); break;
            case 'directFirst':
                app.showConfirm('是否确认直接初审该客源？', function () {
                    app.post(api.customer.approveCustomerOrigin, { 'customerOrigin.csid': v.csid }, function () {
                        app.showAlert(app.success, '直接初审成功！');
                        query(state.page);
                    });
                });
                break;
            case 'release':
                if (!v.belonger || v.belonger.userId == null) { app.showAlert(app.warning, '无归属人信息!'); return; }
                app.showConfirm('是否确认释放客源', function () {
                    app.post(api.customer.freeCustomerOrigin, { 'customerOrigin.csid': v.csid }, function () {
                        app.showAlert(app.success, '释放成功!');
                        query(state.page);
                    });
                });
                break;
            case 'code': openCode(v); break;
            case 'confirm':
                app.showConfirm('确认客源信息', function () {
                    app.post(api.customer.confirmCustomerOrigin, { 'customerOrigin.csid': v.csid }, function () {
                        app.showAlert(app.success, '确认成功!');
                        query(state.page);
                    });
                });
                break;
            case 'backout':
                app.showConfirm('是否确认撤销客源', function () {
                    app.post(api.customer.cancelCustomerOrigin, { 'customerOrigin.csid': v.csid }, function () {
                        app.showAlert(app.success, '撤销成功!');
                        query(state.page);
                    });
                });
                break;
            case 'record':
                app.params.customer = $.extend({}, app.params.customer, { csid: v.csid });
                app.popup(api.index.customerOriginRecordIndex.url, '记录内容');
                break;
            case 'belonger':
                state.csid = v.csid;
                state.belongerId = v.belonger ? v.belonger.userId : null;
                $('#origineBelongerName').val(v.belonger ? (v.belonger.userName || '') : '');
                app.clearValidator();
                state.belongerIndex = layer.open({ type: 1, title: '编辑归属人', content: $('#belongerBox'), area: ['460px', 'auto'] });
                break;
            case 'claim':
                app.showConfirm('是否确定领取客源', function () {
                    app.post(api.customer.takeCustomerOrigin, { 'customerOrigin.csid': v.csid }, function () {
                        app.showAlert(app.success, '领取成功');
                        query(state.page);
                    });
                });
                break;
            case 'directTran': openDirectTran(v); break;
        }
    });
    if (!$('#rowToolbar').length) {
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            + '{{# if(d.status == 0){ }}'
            + (hasBtn('edit') ? '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="edit">编辑</button>' : '')
            + (hasBtn('bind') ? '<button class="layui-btn layui-btn-xs" lay-event="bind">绑定</button>' : '')
            + (hasBtn('directFirst') ? '<button class="layui-btn layui-btn-xs" lay-event="directFirst">直接初审</button>' : '')
            + (hasBtn('free') ? '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="release">释放</button>' : '')
            + '{{# } }}'
            + '{{# if(d.status == 2){ }}'
            + (hasBtn('code') ? '<button class="layui-btn layui-btn-xs" lay-event="code">二维码</button>' : '')
            + (hasBtn('confirm') ? '<button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="confirm">确认</button>' : '')
            + '{{# } }}'
            + '{{# if([3,6].indexOf(parseInt(d.status)) != -1){ }}'
            + (hasBtn('directTran') ? '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="directTran">直接转单</button>' : '')
            + '{{# } }}'
            + '{{# if([2,3,6].indexOf(parseInt(d.status)) != -1){ }}'
            + (hasBtn('backout') ? '<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="backout">撤销</button>' : '')
            + '{{# } }}'
            + (hasBtn('record') ? '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="record">记录</button>' : '')
            + (hasBtn('belonger') ? '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="belonger">归属</button>' : '')
            + (hasBtn('btnclaim') ? '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="claim">认领</button>' : '')
            + '<\/script>'
        );
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(listApi, $.extend({}, customerCommon.buildFilters($('#searchForm')), {
            'user': depage != null ? depage : '',
            'paging.page': state.page,
            'paging.rows': state.rows
        }), function (res) {
            var p = res.paging || { data: [], totalRecords: 0, totalPage: 0 };
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            laypage.render({
                elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30],
                layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); }
            });
        });
    }
    query(1);

    // ==================== 创建/编辑 ====================
    function openEdit(v, mode) {
        state.current = v;
        state.editMode = mode || 'create';
        state.village = { no: null };
        state.designerId = null;
        state.salesmanId = null;
        $('#editForm')[0].reset();
        form.render('select');
        $('#villageList').empty();
        var isEdit = mode === 'edit';
        $('.create-only').toggle(!isEdit);
        $('#editForm [name="name"], #editForm [name="phone"], #editForm [name="buildArea"]').attr('readonly', isEdit ? 'readonly' : null);
        if (isEdit && v) {
            $('#editForm [name="name"]').val(v.name);
            $('#editForm [name="gender"]').val(v.gender || '男');
            $('#editForm [name="phone"]').val(v.phone || '');
            $('#editForm [name="price"]').val(v.price != null ? v.price : '');
            $('#editForm [name="comment"]').val(v.comment || '');
            $('#editForm [name="houseNumber"]').val(v.houseNumber || '');
            $('#editForm [name="buildArea"]').val(v.buildArea != null ? v.buildArea : '');
            if (v.village && v.village.name) {
                state.village.no = v.village.no;
                $('#villageName').val(v.village.name + '-' + (v.village.cityProper ? v.village.cityProper.name : ''));
            }
            form.render('select');
        }
        app.clearValidator();
        state.editIndex = layer.open({ type: 1, title: isEdit ? '编辑客源' : '创建客源', content: $('#editBox'), area: ['760px', 'auto'] });
    }
    $('#btnCreate').on('click', function () { openEdit(null, 'create'); });

    $('#villageName').on('input', function () {
        var kw = $.trim($(this).val());
        if (!kw) return;
        app.post(api.data.queryVillageForNameByPinyin, { 'pinyinName': kw }, function (res) {
            var $list = $('#villageList').empty();
            $.each((res.autoFillKeyValues || res.villages || []).slice(0, 10), function (i, v) {
                $('<a style="margin-right:10px;cursor:pointer;color:#01AAED;">').text(v.value || v.name).data('no', v.key || v.no).appendTo($list);
            });
        });
    });
    $('#villageList').on('click', 'a', function () {
        state.village.no = $(this).data('no');
        $('#villageName').val($(this).text());
        $('#villageList').empty();
    });

    $('#btnPickDesigner').on('click', function () {
        customerCommon.userPicker(function (u) { state.designerId = u.userId; $('#designerName').val(u.currentName); });
    });
    $('#btnPickSalesman').on('click', function () {
        customerCommon.userPicker(function (u) { state.salesmanId = u.userId; $('#salesmanName').val(u.currentName); });
    });

    $('#btnSave').on('click', function () {
        if (app.validate('editForm')) return;
        if (!state.village.no) { app.showAlert(app.warning, '请选择楼盘'); return; }
        var base = {
            'customerOrigin.name': $('#editForm [name="name"]').val(),
            'customerOrigin.gender': $('#editForm [name="gender"]').val(),
            'customerOrigin.phone': $('#editForm [name="phone"]').val(),
            'customerOrigin.intention': $('#editForm [name="intention"]').val(),
            'customerOrigin.price': $('#editForm [name="price"]').val(),
            'customerOrigin.comment': $('#editForm [name="comment"]').val(),
            'customerOrigin.village.no': state.village.no,
            'customerOrigin.houseNumber': $('#editForm [name="houseNumber"]').val()
        };
        if (state.editMode === 'edit') {
            base['customerOrigin.csid'] = state.current.csid;
            base['customerOrigin.buildArea'] = $('#editForm [name="buildArea"]').val();
            base['customerOrigin.freeArea'] = 0;
            base['customerOrigin.totalArea'] = 0;
            base['customerOrigin.innerArea'] = $('#editForm [name="buildArea"]').val();
            app.post(api.customer.updateCustomerOrigin, base, function () {
                app.showAlert(app.success, '修改成功');
                layer.close(state.editIndex);
                state.editIndex = null;
                query(state.page);
            });
        } else {
            base['customerOrigin.buildArea'] = $('#editForm [name="buildArea"]').val();
            base['customerOrigin.freeArea'] = 0;
            base['customerOrigin.totalArea'] = 0;
            base['customerOrigin.innerArea'] = $('#editForm [name="buildArea"]').val();
            base['customerOrigin.designer.userId'] = state.designerId != null ? state.designerId : '';
            base['customerOrigin.salesman.userId'] = state.salesmanId != null ? state.salesmanId : '';
            base['customerOrigin.decorationBusitype.dbid'] = $('#editForm [name="decorationBusitype"]').val();
            app.post(api.customer.addCustomerOrigin, base, function () {
                app.showAlert(app.success, '客源创建成功');
                layer.close(state.editIndex);
                state.editIndex = null;
                query(state.page);
            });
        }
    });
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });

    // ==================== 绑定 ====================
    function openBind(v) {
        state.current = v;
        state.bindDesignerId = v.designer ? v.designer.userId : null;
        state.bindSalesmanId = v.salesman ? v.salesman.userId : null;
        state.bindVillageNo = v.village ? v.village.no : null;
        $('#bindForm')[0].reset();
        form.render('select');
        $('#bindDesignerName').val(v.designer ? (v.designer.currentName || '') : '');
        $('#bindSalesmanName').val(v.salesman ? (v.salesman.currentName || '') : '');
        $('#bindVillageName').val(v.village ? ((v.village.name || '') + '-' + (v.village.cityProper ? v.village.cityProper.name : '')) : '');
        $('#bindForm [name="houseNumber"]').val(v.houseNumber || '');
        $('#bindForm [name="name"]').val(v.name || '');
        $('#bindForm [name="phone"]').val(v.phone || '');
        if (v.decorationBusitype) $('#bindForm [name="decorationBusitype"]').val(v.decorationBusitype.dbid);
        form.render('select');
        app.clearValidator();
        state.bindIndex = layer.open({ type: 1, title: '绑定相关信息', content: $('#bindBox'), area: ['760px', 'auto'] });
    }
    $('#btnBindPickDesigner').on('click', function () {
        customerCommon.userPicker(function (u) { state.bindDesignerId = u.userId; $('#bindDesignerName').val(u.currentName); });
    });
    $('#btnBindPickSalesman').on('click', function () {
        customerCommon.userPicker(function (u) { state.bindSalesmanId = u.userId; $('#bindSalesmanName').val(u.currentName); });
    });
    $('#btnBindSave').on('click', function () {
        if (app.validate('bindForm')) return;
        // 楼号存在 → existHouse 校验
        var hid = '';
        var houseNumber = $.trim($('#bindForm [name="houseNumber"]').val());
        if (houseNumber && state.bindVillageNo) {
            app.post(api.data.existHouse, {
                'house.village.no': state.bindVillageNo,
                'house.houseNumber': houseNumber
            }, function (res) {
                hid = res.house ? res.house.hid : '';
            }, null, false);
        }
        var cid = '';
        var phone = $('#bindForm [name="phone"]').val();
        if (phone) {
            app.post(api.data.existCustomer, {
                'customer.name': $('#bindForm [name="name"]').val(),
                'customer.phone': phone,
                'customer.relationshipType': '普通客户',
                'customer.qq': '', 'customer.wechat': '', 'customer.email': '', 'customer.address': ''
            }, function (res) {
                cid = res.customer ? res.customer.cid : '';
            }, null, false);
        }
        var options = {
            'customerOrigin.csid': state.current.csid,
            'customerOrigin.designer.userId': state.bindDesignerId != null ? state.bindDesignerId : '',
            'customerOrigin.salesman.userId': state.bindSalesmanId != null ? state.bindSalesmanId : '',
            'customerOrigin.decorationBusitype.dbid': $('#bindForm [name="decorationBusitype"]').val(),
            'customerOrigin.house.hid': hid,
            'customerOrigin.customer.cid': cid,
            'customerOrigin.phone': phone
        };
        app.post(api.customer.bindCustomerOrigin, options, function () {
            app.showAlert(app.success, '绑定成功');
            layer.close(state.bindIndex);
            state.bindIndex = null;
            query(state.page);
        });
    });
    $('#btnBindCancel').on('click', function () { layer.close(state.bindIndex); state.bindIndex = null; });

    // ==================== 归属 ====================
    $('#btnOriginePickBelonger').on('click', function () {
        customerCommon.userPicker(function (u) { state.belongerId = u.userId; $('#origineBelongerName').val(u.currentName); });
    });
    $('#btnBelongerSave').on('click', function () {
        if (app.validate('belongerForm')) return;
        if (!state.belongerId) { app.showAlert(app.warning, '请选择归属人'); return; }
        app.post(api.customer.updateCustomerOriginForBelonger, {
            'customerOrigin.csid': state.csid,
            'customerOrigin.belonger.userId': state.belongerId
        }, function () {
            app.showAlert(app.success, '修改成功');
            layer.close(state.belongerIndex);
            state.belongerIndex = null;
            query(state.page);
        });
    });
    $('#btnBelongerCancel').on('click', function () { layer.close(state.belongerIndex); state.belongerIndex = null; });

    // ==================== 直接转单 ====================
    function openDirectTran(v) {
        state.current = v;
        state.dtSalesmanId = v.salesman ? v.salesman.userId : null;
        $('#directTranForm')[0].reset();
        form.render('select');
        $('#dtVillageName').val(v.village ? ((v.village.name || '') + '-' + (v.village.cityProper ? v.village.cityProper.name : '')) : '');
        $('#directTranForm [name="houseNumber"]').val(v.houseNumber || '');
        $('#directTranForm [name="name"]').val(v.name || '');
        $('#directTranForm [name="phone"]').val(v.phone || '');
        $('#dtSalesmanName').val(v.salesman ? (v.salesman.currentName || '') : '');
        if (v.decorationBusitype) $('#directTranForm [name="decorationBusitype"]').val(v.decorationBusitype.dbid);
        if (v.houseType) $('#directTranForm [name="houseType"]').val(v.houseType);
        if (v.houseClass) $('#directTranForm [name="houseClass"]').val(v.houseClass);
        if (v.resourceType != null) $('#directTranForm [name="resourceType"]').val(v.resourceType);
        form.render('select');
        app.clearValidator();
        state.dtIndex = layer.open({ type: 1, title: '直接转单', content: $('#directTranBox'), area: ['860px', 'auto'] });
    }
    $('#btnDtPickSalesman').on('click', function () {
        customerCommon.userPicker(function (u) { state.dtSalesmanId = u.userId; $('#dtSalesmanName').val(u.currentName); });
    });
    $('#btnDtSave').on('click', function () {
        if (app.validate('directTranForm')) return;
        if (!state.dtSalesmanId) { app.showAlert(app.warning, '请选择业务员'); return; }
        app.post(api.customer.tranCustomerOrigin, {
            'customerOrigin.csid': state.current.csid,
            'customerOrigin.typeness': $('#directTranForm [name="orderType"]').val(),
            'customerOrigin.salesman.userId': state.dtSalesmanId,
            'customerOrigin.decorationBusitype.dbid': $('#directTranForm [name="decorationBusitype"]').val(),
            'customerOrigin.houseType': $('#directTranForm [name="houseType"]').val(),
            'customerOrigin.houseClass': $('#directTranForm [name="houseClass"]').val(),
            'customerOrigin.resourceType': $('#directTranForm [name="resourceType"]').val()
        }, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(state.dtIndex);
            state.dtIndex = null;
            query(state.page);
        });
    });
    $('#btnDtCancel').on('click', function () { layer.close(state.dtIndex); state.dtIndex = null; });

    // ==================== 二维码（在线二维码服务） ====================
    function openCode(v) {
        var text = 'http://fanglin.vip/wx/origine?csid=' + v.csid;
        $('#codeImg').attr('src', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(text));
        state.codeIndex = layer.open({ type: 1, title: '客源二维码', content: $('#codeBox'), area: ['280px', 'auto'] });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
});
}); // end app.ready
