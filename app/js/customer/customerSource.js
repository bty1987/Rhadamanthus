/** app/js/customer/customerSource.js —— 客户来源（旧 customerSource.js → layui，核心流程迁移）
 *  列表：pageCustomerSource（名称/电话/对接人/来源方/状态/客户类型/装修需求/创建时间检索 + depage 附加参数）。
 *  添加 addCustomerSource / 更新 updateCustomerSource（楼盘+楼号规则→existHouse→existCustomer）；
 *  房产：updateCustomerSourceForHouse；分配：issueCustomerSource（queryCustomerCompanyRule 选公司 +
 *  queryCustomerDeptRuleByDbid 规则：atttype 1人员/2部门/3分区 分支）；
 *  失效：updateCustomerSourceForStatus(status=1)；机会（弹 customerChance?depage=source）；
 *  记录（弹 customerSourceRecord）；画像（弹 customerProfile4detail type=0）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var depage = customerCommon.ctx('urlLoadParams').depage;
    var userInfo = customerCommon.ctx('userInfo');
    var user = userInfo && userInfo.user ? userInfo.user : null;
    var RULES = ['', '#', '-', '座', '门'];
    var state = {
        page: 1, rows: 10, total: 0,
        type: 'create', source: null,
        editIndex: null, issueIndex: null,
        village: { no: null, rule: '' }, issueBelongerId: null, rule: { atttype: null }
    };

    customerCommon.dateRange('#createTime');

    // 下拉数据
    app.post(api.data.queryDecorationBusitype, {}, function (res) {
        app.bindData($('#editForm [name="businessType"]'), res.decorationBusitypes || [], 'dbid', 'name', true);
        app.bindData($('#issueBusitype'), res.decorationBusitypes || [], 'dbid', 'name', true);
        form.render('select');
    });
    ['builtrule', 'unitrule', 'floorrule', 'doorrule'].forEach(function (n) {
        app.bindData($('#editForm [name="' + n + '"]'), RULES, null, null, false, function () {});
    });
    form.render('select');
    app.post(api.communion.queryDepartment, { 'dept.type': 0 }, function (res) {
        app.bindData($('#issueDeptSel'), res.departments || [], 'did', 'name', true);
        form.render('select');
    });
    app.post(api.communion.queryDepartment, { 'dept.type': 1 }, function (res) {
        app.bindData($('#issueRegionSel'), res.departments || [], 'did', 'name', true);
        form.render('select');
    });

    // 楼盘检索
    $('#villageName').on('input', function () {
        var kw = $.trim($(this).val());
        if (!kw) return;
        app.post(api.data.queryVillageForNameByPinyin, { 'pinyinName': kw }, function (res) {
            var $list = $('#villageList').empty();
            $.each((res.autoFillKeyValues || res.villages || []).slice(0, 10), function (i, v) {
                $('<a style="margin-right:10px;cursor:pointer;color:#01AAED;">').text(v.value || v.name).data({ no: v.key || v.no }).appendTo($list);
            });
        });
    });
    $('#villageList').on('click', 'a', function () {
        state.village.no = $(this).data('no');
        $('#villageName').val($(this).text());
        $('#villageList').empty();
        if (state.village.no) {
            app.post(api.data.queryVillageRule, { 'village.no': state.village.no }, function (res) {
                state.village.rule = (res.villageRule || {}).rule || '';
            }, null, false);
        }
    });

    // ==================== 列表 ====================
    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'name', title: '姓名', width: 90 },
            { field: 'gender', title: '性别', width: 60, templet: function (d) { return d.gender == 1 ? '女' : '男'; } },
            { field: 'no', title: '尺源编号', width: 110 },
            { field: 'phone', title: '客户电话', width: 120 },
            { field: 'intention', title: '目的', width: 70, templet: function (d) { return E.sourceCustomerType[d.intention] != null ? E.sourceCustomerType[d.intention] : ''; } },
            { field: 'price', title: '需求价格', width: 100, align: 'right', templet: function (d) { return d.price != null ? app.formatMoney(d.price) : ''; } },
            { field: 'village', title: '楼盘', width: 110, templet: function (d) { return d.village ? (d.village.name || '') : ''; } },
            { field: 'houseNumber', title: '楼号', width: 90 },
            { field: 'buildArea', title: '派尺面积', width: 90, align: 'right', templet: function (d) { return d.buildArea != null ? d.buildArea : ''; } },
            { field: 'busitype', title: '业务类型', width: 100, templet: function (d) { return d.busitype ? (d.busitype.name || '') : ''; } },
            { field: 'orderId', title: '装修单号', width: 100 },
            { field: 'creater', title: '创建人', width: 90, templet: function (d) { return d.creater ? (d.creater.currentName || '') : ''; } },
            { field: 'createTime', title: '创建时间', width: 165 },
            { field: 'customerType', title: '客户类型', width: 90, templet: function (d) { return E.sourceCustomerType[d.customerType] != null ? E.sourceCustomerType[d.customerType] : ''; } },
            { field: 'houseAttr', title: '房屋属性', width: 90, templet: function (d) { return E.sourceHouseAttr[d.houseAttr] != null ? E.sourceHouseAttr[d.houseAttr] : ''; } },
            { field: 'demand', title: '装修需求', width: 90, templet: function (d) { return E.sourceDemand[d.demand] != null ? E.sourceDemand[d.demand] : ''; } },
            { field: 'source', title: '来源方', width: 90 },
            { field: 'contact', title: '对接人', width: 90 },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return customerCommon.badge(E.sourceStatus, d.status); } },
            { field: 'referOrderId', title: '推荐单号', width: 100 },
            { field: 'comment', title: '备注', minWidth: 140 },
            { title: '操作', width: 340, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        switch (obj.event) {
            case 'house':
                openHouse(v);
                break;
            case 'update':
                openEdit(v, 'update');
                break;
            case 'issue':
                openIssue(v);
                break;
            case 'record':
                app.params.customer = $.extend({}, app.params.customer, { customerSource: v, csid: v.csid });
                app.popup(api.index.customerSourceRecordIndex.url, '记录');
                break;
            case 'chance':
                app.params.customer = $.extend({}, app.params.customer, { customerSource: v });
                app.params.urlLoadParams = $.extend({}, app.params.urlLoadParams, { depage: 'source' });
                app.popup(api.index.customerChanceIndex.url + '?depage=source', '机会', null, { area: ['95%', '90%'] });
                break;
            case 'invalid':
                app.post(api.customer.updateCustomerSourceForStatus, {
                    'customerSource.csid': v.csid,
                    'customerSource.status': 1
                }, function () {
                    app.showAlert(app.success, '操作成功');
                    query(state.page);
                });
                break;
            case 'profile':
                app.params.customer = $.extend({}, app.params.customer, {
                    source: v, csid: v.csid, profile: { type: 0, csid: v.csid }
                });
                app.popup(api.index.customerProfile4detailIndex.url, '客户画像', null, { area: ['70%', '85%'] });
                break;
        }
    });
    if (!$('#rowToolbar').length) {
        var isUser = depage == 'user';
        var canIssue = isUser || depage == null;
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            + '{{# if((d.status == 0 || d.status == 2) && ' + isUser + '){ }}'
            + '<button class="layui-btn layui-btn-xs" lay-event="house">房产</button>'
            + '<button class="layui-btn layui-btn-xs" lay-event="update">更新</button>{{# } }}'
            + '{{# if((d.status == 0 || d.status == 2 || d.status == 3 || d.status == 4) && ' + canIssue + '){ }}'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="issue">分配</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="invalid">失效</button>{{# } }}'
            + '{{# if(' + isUser + '){ }}<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="record">记录</button>{{# } }}'
            + '<button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="chance">机会</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="profile">画像</button>'
            + '<\/script>'
        );
    }

    // depage 附加参数
    var extraParams = {};
    if (user) {
        if (depage == 'user') {
            extraParams['customerSource.creater.userId'] = user.userId;
        } else if (depage == 'dept' && user.dept) {
            extraParams['customerSource.creater.dept.no'] = user.dept.no;
            extraParams['customerSource.creater.uid'] = user.uid != null ? user.uid : '';
        } else if (depage == 'region' && user.dept && user.dept.fatherDept) {
            extraParams['customerSource.creater.dept.fatherDept.no'] = user.dept.fatherDept.no;
        }
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(api.customer.pageCustomerSource, $.extend({}, customerCommon.buildFilters($('#searchForm')), extraParams, {
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

    // ==================== 楼号/客户校验 ====================
    function checkHouse() {
        var hid = null;
        var villageRule = String(state.village.rule || '');
        var rulenum = [
            $.trim($('#editForm [name="built"]').val()).toUpperCase(), $('#editForm [name="builtrule"]').val(),
            $.trim($('#editForm [name="unit"]').val()).toUpperCase(), $('#editForm [name="unitrule"]').val(),
            $.trim($('#editForm [name="floor"]').val()).toUpperCase(), $('#editForm [name="floorrule"]').val(),
            $.trim($('#editForm [name="door"]').val()).toUpperCase(), $('#editForm [name="doorrule"]').val()
        ];
        var houseNumber = customerCommon.buildHouseNumber(rulenum);
        if (villageRule && !(new RegExp(villageRule).test(houseNumber))) {
            app.showAlert(app.error, '楼号格式错误');
            return false;
        }
        var houseOption = {
            'house.village.no': state.village.no,
            'house.houseNumber': houseNumber,
            'house.built': $('#editForm [name="built"]').val(),
            'house.unit': $('#editForm [name="unit"]').val(),
            'house.floor': $('#editForm [name="floor"]').val(),
            'house.door': $('#editForm [name="door"]').val()
        };
        ['buildArea', 'freeArea', 'totalArea', 'innerArea'].forEach(function (k) {
            if ($('#editForm [name="' + k + '"]').val()) houseOption['house.' + k] = $('#editForm [name="' + k + '"]').val();
        });
        app.post(api.data.existHouse, houseOption, function (res) {
            hid = res.house ? res.house.hid : null;
        }, null, false);
        return hid;
    }

    function checkCustomer() {
        var cid = '';
        var phone = $('#editForm [name="phone"]').val();
        if (!phone) return null;
        app.post(api.data.existCustomer, {
            'customer.name': state.source ? state.source.name : $('#editForm [name="name"]').val(),
            'customer.phone': phone,
            'customer.gender': state.source ? state.source.gender : $('#editForm [name="gender"]').val(),
            'customer.relationshipType': '普通客户',
            'customer.qq': '', 'customer.wechat': '', 'customer.email': '', 'customer.address': ''
        }, function (res) {
            cid = res.customer ? res.customer.cid : '';
        }, null, false);
        return cid;
    }

    // ==================== 添加 / 更新 ====================
    function openEdit(v, type) {
        state.type = type;
        state.source = v;
        state.village = { no: null, rule: '' };
        $('#editForm')[0].reset();
        form.render('select');
        $('.edit-phone-group').toggle(type === 'create'); // 编辑时隐藏电话
        if (v) {
            $('#editForm [name="name"]').val(v.name);
            $('#editForm [name="gender"]').val(v.gender != null ? v.gender : 0);
            $('#editForm [name="comment"]').val(v.comment || '');
            $('#editForm [name="price"]').val(v.price != null ? v.price : '');
            $('#editForm [name="intention"]').val(v.intention != null ? v.intention : 0);
            $('#editForm [name="buildArea"]').val(v.innerArea != null ? v.innerArea : '');
            if (v.busitype) $('#editForm [name="businessType"]').val(v.busitype.dbid);
            if (v.village && v.village.vid) {
                state.village.no = v.village.no;
                $('#villageName').val(v.village.name || '');
                app.post(api.data.queryVillageRule, { 'village.no': v.village.no }, function (res) {
                    state.village.rule = (res.villageRule || {}).rule || '';
                }, null, false);
            }
            form.render('select');
        }
        app.clearValidator();
        state.editIndex = layer.open({ type: 1, title: type === 'update' ? '更新客户来源' : '添加客户来源', content: $('#editBox'), area: ['860px', 'auto'] });
    }
    $('#btnAdd').on('click', function () { openEdit(null, 'create'); });

    $('#btnSave').on('click', function () {
        if (app.validate('editForm')) return;
        if (state.type === 'house') {
            if (!state.village.no) { app.showAlert(app.warning, '请选择楼盘'); return; }
            var hid = checkHouse();
            if (!hid) return;
            app.post(api.customer.updateCustomerSourceForHouse, {
                'customerSource.csid': state.source ? state.source.csid : '',
                'customerSource.house.hid': hid
            }, function () {
                app.showAlert(app.success, '操作成功');
                layer.close(state.editIndex);
                state.editIndex = null;
                query(state.page);
            });
            return;
        }
        standardSave();
    });
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });

    // ==================== 房产更新 ====================
    function openHouse(v) {
        state.source = v;
        state.type = 'update';
        state.village = { no: null, rule: '' };
        $('#editForm')[0].reset();
        form.render('select');
        $('.edit-phone-group').hide();
        $('#editForm [name="name"]').val(v.name).attr('readonly', 'readonly');
        if (v.village && v.village.vid) {
            state.village.no = v.village.no;
            $('#villageName').val(v.village.name || '');
            app.post(api.data.queryVillageRule, { 'village.no': v.village.no }, function (res) {
                state.village.rule = (res.villageRule || {}).rule || '';
            }, null, false);
        }
        ['buildArea', 'freeArea', 'totalArea', 'innerArea'].forEach(function (k) {
            if (v[k] != null) $('#editForm [name="' + k + '"]').val(v[k]);
        });
        app.clearValidator();
        state.editIndex = layer.open({ type: 1, title: '更新房产', content: $('#editBox'), area: ['860px', 'auto'] });
        // 房产保存走 updateCustomerSourceForHouse
        state.type = 'house';
    }
    function standardSave() {
        if (app.validate('editForm')) return;
        var options = {
            'customerSource.name': $('#editForm [name="name"]').val(),
            'customerSource.gender': $('#editForm [name="gender"]').val(),
            'customerSource.intention': $('#editForm [name="intention"]').val(),
            'customerSource.price': $('#editForm [name="price"]').val(),
            'customerSource.busitype.dbid': $('#editForm [name="businessType"]').val(),
            'customerSource.comment': $('#editForm [name="comment"]').val(),
            'customerSource.referOrderId': $('#editForm [name="referOrderId"]').val()
        };
        ['buildArea', 'freeArea', 'totalArea', 'innerArea'].forEach(function (k) {
            options['customerSource.' + k] = $('#editForm [name="' + k + '"]').val();
        });
        if (state.village.no) {
            var hasHouseParts = ['built', 'unit', 'floor', 'door'].some(function (k) { return $.trim($('#editForm [name="' + k + '"]').val()) !== ''; });
            if (hasHouseParts) {
                var hid = checkHouse();
                if (!hid) return;
                options['customerSource.house.hid'] = hid;
            } else {
                options['customerSource.village.no'] = state.village.no;
            }
        }
        if (state.type === 'create' && $('#editForm [name="phone"]').val()) {
            var cid = checkCustomer();
            if (cid) options['customerSource.customer.cid'] = cid;
        }
        if (state.type === 'update') {
            options['customerSource.csid'] = state.source.csid;
            app.post(api.customer.updateCustomerSource, options, function () {
                app.showAlert(app.success, '操作成功');
                layer.close(state.editIndex);
                state.editIndex = null;
                query(state.page);
            });
        } else {
            app.post(api.customer.addCustomerSource, options, function () {
                app.showAlert(app.success, '操作成功');
                layer.close(state.editIndex);
                state.editIndex = null;
                query(state.page);
            });
        }
    }

    // ==================== 分配 ====================
    function openIssue(v) {
        state.source = v;
        $('#issueForm')[0].reset();
        form.render('select');
        state.issueBelongerId = null;
        $('#busitypeInfo').text(v.busitype ? v.busitype.name : '');
        $('#issueBusitype').hide();

        // 公司规则
        var options = {
            'customerCompanyRule.uppval': v.innerArea,
            'customerCompanyRule.dept.did': v.creater && v.creater.dept ? v.creater.dept.did : ''
        };
        if (v.village && v.village.cityProper) options['customerCompanyRule.cpid'] = v.village.cityProper.cpid;
        if (v.busitype) options['customerCompanyRule.dbid'] = v.busitype.dbid;
        app.post(api.customer.queryCustomerCompanyRule, options, function (res) {
            var companys = [];
            $.each(res.customerCompanyRules || [], function (i, r) { companys.push(r.company); });
            app.bindData($('#companySel'), companys, 'cid', 'name', true);
            form.render('select');
        });

        // 部门规则（决定人员/部门/分区分支）
        app.post(api.customer.queryCustomerDeptRuleByDbid, { 'customerDeptRule.busitype.dbid': v.busitype ? v.busitype.dbid : '' }, function (res) {
            var rule = res.customerDeptRule || {};
            state.rule = rule;
            $('.issue-group').hide();
            if (rule.atttype == 1) $('.group-user').show();
            else if (rule.atttype == 2) $('.group-dept').show();
            else if (rule.atttype == 3) $('.group-region').show();
        });

        app.clearValidator();
        state.issueIndex = layer.open({ type: 1, title: '分配', content: $('#issueBox'), area: ['520px', 'auto'] });
    }
    $('#btnIssuePickBelonger').on('click', function () {
        customerCommon.userPicker(function (u) {
            state.issueBelongerId = u.userId;
            $('#issueBelongerName').val(u.currentName);
        });
    });
    $('#btnIssueSave').on('click', function () {
        var options = {
            'customerSource.csid': state.source.csid,
            'customerChance.busitype.dbid': state.source.busitype ? state.source.busitype.dbid : $('#issueBusitype').val()
        };
        if ($('#companySel').val()) options['company'] = $('#companySel').val();
        if (state.rule.atttype == 1) {
            if (!state.issueBelongerId) { app.showAlert(app.warning, '请选择人员'); return; }
            options['customerChance.belonger.userId'] = state.issueBelongerId;
        }
        if (state.rule.atttype == 2) options['customerChance.department.did'] = $('#issueDeptSel').val();
        if (state.rule.atttype == 3) options['customerChance.region.did'] = $('#issueRegionSel').val();
        app.post(api.customer.issueCustomerSource, options, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(state.issueIndex);
            state.issueIndex = null;
            query(state.page);
        });
    });
    $('#btnIssueCancel').on('click', function () { layer.close(state.issueIndex); state.issueIndex = null; });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
});
}); // end app.ready
