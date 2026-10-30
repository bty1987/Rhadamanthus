/** app/js/customer/customerChance.js —— 商机（旧 customerChance.js → layui，1606 行核心流程迁移）
 *  列表：pageCustomerChance（名称/电话/预派单号/类型/状态/分配时间/归属人检索 + depage 维度附加参数）。
 *  行操作：已读 readCustomerChance；分配 issueCustomerChance（分区/部门/归属人/业务类型）；
 *  是否类配置 configCustomerChance（建群/电话交接/见面/真实地址，值 2是/1否/0无状态）；
 *  罚款 fineCustomerChance（manage）；不校验 uncheckCustomerChance；不匹配（提交失效审批 submitApprovalForCustomerChanceToDisabled）；
 *  推送 sendCustomerChance；确认 affirmCustomerChance（manage）；
 *  编辑 updateCustomerChance / 直接初审 approveCustomerChance（楼盘→楼号规则拼接→existHouse→existCustomer）；
 *  审核 tranCustomerChance；审批 submitApprovalForCustomerChance（选审批人）；
 *  转换 changeCustomerChance（checkCustomerProtectRule → 无保护单时生成装修单）；
 *  记录（弹 customerSourceRecord）；画像（弹 customerProfile4detail）。
 *  注：旧页 approvalUtils 审批人列表简化为人员选择弹窗（api.personel.queryUserByPinyin）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var depage = customerCommon.ctx('urlLoadParams').depage;
    var detype = customerCommon.ctx('urlLoadParams').detype;
    var userInfo = customerCommon.ctx('userInfo');
    var user = userInfo && userInfo.user ? userInfo.user : null;
    // 楼号分隔规则（生产库 building.buildruleOne/Two/Thr：''/#/-/座/门）
    var RULES = ['', '#', '-', '座', '门'];
    var state = {
        page: 1, rows: 10, total: 0,
        ccid: null, chance: null, source: { csid: null, name: null, gender: null },
        configEventKey: null, configIndex: null, issueIndex: null, houseIndex: null, houseMode: null,
        changeIndex: null, disableIndex: null, approveIndex: null,
        searchBelongerId: null, issueBelongerId: null, approveManId: null,
        village: { no: null, rule: '' }
    };

    customerCommon.dateRange('#createTime');

    // ==================== 下拉数据 ====================
    // 分区/部门（communion 部门，type 0）
    app.post(api.communion.queryDepartment, { 'dept.type': 0 }, function (res) {
        app.bindData($('#regionSel'), res.departments || [], 'did', 'name', true);
        form.render('select');
    });
    app.post(api.communion.queryDepartment, { 'dept.type': 0 }, function (res) {
        app.bindData($('#departmentSel'), res.departments || [], 'did', 'name', true);
        form.render('select');
    });
    // 业务类型
    app.post(api.data.queryDecorationBusitype, {}, function (res) {
        app.bindData($('#busitypeSel'), res.decorationBusitypes || [], 'dbid', 'name', true);
        app.bindData($('#houseForm [name="busitype"]'), res.decorationBusitypes || [], 'dbid', 'name', true);
        app.bindData($('#approveForm [name="busitype"]'), res.decorationBusitypes || [], 'dbid', 'name', true);
        form.render('select');
    });
    // 楼号规则
    ['builtrule', 'unitrule', 'floorrule', 'doorrule'].forEach(function (n) {
        app.bindData($('#houseForm [name="' + n + '"]'), RULES, null, null, false, function () {});
    });
    form.render('select');

    // 楼盘检索（拼音）
    $('#villageName').on('input', function () {
        var kw = $.trim($(this).val());
        if (!kw) return;
        app.post(api.data.queryVillageForNameByPinyin, { 'pinyinName': kw }, function (res) {
            var $list = $('#villageList').empty();
            $.each((res.autoFillKeyValues || res.villages || []).slice(0, 10), function (i, v) {
                var name = v.value || v.name, no = v.key || v.no;
                $('<a style="margin-right:10px;cursor:pointer;color:#01AAED;">').text(name).data({ no: no, name: name }).appendTo($list);
            });
        });
    });
    $('#villageList').on('click', 'a', function () {
        state.village.no = $(this).data('no');
        $('#villageName').val($(this).data('name'));
        $('#villageList').empty();
        // 取楼盘楼号规则
        if (state.village.no) {
            app.post(api.data.queryVillageRule, { 'village.no': state.village.no }, function (res) {
                var rule = res.villageRule || {};
                state.village.rule = rule.rule || '';
            }, null, false);
        }
    });

    // ==================== 列表 ====================
    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'orderId', title: '预派单号', width: 100 },
            { field: 'cno', title: '线索编号', width: 110 },
            { field: 'source', title: '客户姓名', width: 90, templet: function (d) { return d.source ? (d.source.name || '') : ''; } },
            { field: 'phone', title: '客户电话', width: 120, templet: function (d) {
                if (d.customer && d.customer.phone) {
                    var p = String(d.customer.phone);
                    return p.replace(/^(\d{3})\d+(\d{4})$/, '$1****$2');
                }
                return d.source ? (d.source.phone || '') : '';
            } },
            { field: 'village', title: '楼盘', width: 110, templet: function (d) {
                if (d.house && d.house.village && d.house.village.name) return d.house.village.name;
                return d.source && d.source.village ? (d.source.village.name || '') : '';
            } },
            { field: 'houseNumber', title: '楼号', width: 90, templet: function (d) {
                if (d.house && d.house.houseNumber) return d.house.houseNumber;
                return d.source ? (d.source.houseNumber || '') : '';
            } },
            { field: 'source', title: '派尺面积', width: 90, align: 'right', templet: function (d) { return d.source ? (d.source.buildArea != null ? d.source.buildArea : '') : ''; } },
            { field: 'busitype', title: '业务类型', width: 100, templet: function (d) { return d.busitype ? (d.busitype.name || '') : ''; } },
            { field: 'creater', title: '创建人', width: 90, templet: function (d) { return d.creater ? (d.creater.currentName || '') : ''; } },
            { field: 'issueTime', title: '分配时间', width: 160 },
            { field: 'belonger', title: '归属人', width: 90, templet: function (d) { return d.belonger ? (d.belonger.currentName || '') : ''; } },
            { field: 'department', title: '归属部门', width: 110, templet: function (d) { return d.department ? (d.department.name || '') : ''; } },
            { field: 'region', title: '归属分区', width: 100, templet: function (d) { return d.region ? (d.region.name || '') : ''; } },
            { field: 'type', title: '类型', width: 70, templet: function (d) { return E.chanceType[d.type] != null ? E.chanceType[d.type] : ''; } },
            { field: 'status', title: '状态', width: 70, templet: function (d) { return customerCommon.badge(E.chanceStatus, d.status); } },
            { field: 'isRead', title: '已读', width: 70, templet: function (d) { return E.chanceIsRead[d.isRead] != null ? E.chanceIsRead[d.isRead] : ''; } },
            { field: 'isGroup', title: '建群', width: 70, templet: function (d) { return E.chanceConfig[d.isGroup] != null ? E.chanceConfig[d.isGroup] : ''; } },
            { field: 'isPhone', title: '电话交接', width: 90, templet: function (d) { return E.chanceConfig[d.isPhone] != null ? E.chanceConfig[d.isPhone] : ''; } },
            { field: 'isMeet', title: '是否见面', width: 90, templet: function (d) { return E.chanceConfig[d.isMeet] != null ? E.chanceConfig[d.isMeet] : ''; } },
            { field: 'isFine', title: '是否罚款', width: 90, templet: function (d) { return E.chanceIsFine[d.isFine] != null ? E.chanceIsFine[d.isFine] : ''; } },
            { field: 'isCheck', title: '是否校验', width: 90, templet: function (d) { return E.chanceIsCheck[d.isCheck] != null ? E.chanceIsCheck[d.isCheck] : ''; } },
            { field: 'readTime', title: '已读时间', width: 160 },
            { field: 'source', title: '来源方', width: 90, templet: function (d) { return d.source ? (d.source.source || '') : ''; } },
            { field: 'source', title: '对接人', width: 90, templet: function (d) { return d.source ? (d.source.contact || '') : ''; } },
            { field: 'source', title: '推荐单号', width: 100, templet: function (d) { return d.source ? (d.source.referOrderId || '') : ''; } },
            { field: 'source', title: '房屋属性', width: 90, templet: function (d) { return d.source && E.sourceHouseAttr[d.source.houseAttr] != null ? E.sourceHouseAttr[d.source.houseAttr] : ''; } },
            { field: 'comment', title: '备注', minWidth: 140 },
            { title: '操作', width: 560, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        var st = parseInt(v.status, 10);
        switch (obj.event) {
            case 'read':
                app.post(api.customer.readCustomerChance, { 'customerChance.ccid': v.ccid }, function () {
                    app.showAlert(app.success, '操作成功');
                    query(state.page);
                });
                break;
            case 'issue':
                openIssue(v);
                break;
            case 'config':
                openConfig(v, $(this).data('ckey'));
                break;
            case 'fine':
                app.showConfirm('确认要罚款吗', function () {
                    app.post(api.customer.fineCustomerChance, { 'customerChance.ccid': v.ccid }, function () {
                        app.showAlert(app.success, '操作成功!');
                        query(state.page);
                    });
                });
                break;
            case 'uncheck':
                app.showConfirm('确认要设置为不校验状态吗？', function () {
                    app.post(api.customer.uncheckCustomerChance, { 'customerChance.ccid': v.ccid }, function () {
                        app.showAlert(app.success, '操作成功!');
                        query(state.page);
                    });
                });
                break;
            case 'disable':
                state.ccid = v.ccid;
                state.chance = v;
                $('#disableForm')[0].reset();
                app.clearValidator();
                state.disableIndex = layer.open({ type: 1, title: '不匹配', content: $('#disableBox'), area: ['480px', 'auto'] });
                break;
            case 'send':
                app.post(api.customer.sendCustomerChance, { 'customerChance.ccid': v.ccid }, function () {
                    app.showAlert(app.success, '操作成功');
                    query(state.page);
                });
                break;
            case 'affirm':
                app.showConfirm('确认机会信息', function () {
                    app.post(api.customer.affirmCustomerChance, { 'customerChance.ccid': v.ccid }, function () {
                        app.showAlert(app.success, '确认成功');
                        query(state.page);
                    });
                });
                break;
            case 'update':
            case 'firstApprove':
                openHouse(v, obj.event === 'firstApprove' ? 'approve' : 'update');
                break;
            case 'directApprove':
                app.post(api.customer.tranCustomerChance, { 'customerChance.ccid': v.ccid }, function () {
                    app.showAlert(app.success, '操作成功');
                    query(state.page);
                });
                break;
            case 'approve':
                openApprove(v);
                break;
            case 'change':
                openChange(v);
                break;
            case 'record':
                app.params.customer = $.extend({}, app.params.customer, { customerSource: v.source, csid: v.source ? v.source.csid : null });
                app.params.urlLoadParams = $.extend({}, app.params.urlLoadParams, { type: '0' });
                app.popup(api.index.customerSourceRecordIndex.url, '记录');
                break;
            case 'profile':
                app.params.customer = $.extend({}, app.params.customer, {
                    source: v.source,
                    csid: v.source ? v.source.csid : null,
                    profile: { type: 2 }
                });
                app.popup(api.index.customerProfile4detailIndex.url, '客户画像: 设计需求完善', null, { area: ['70%', '85%'] });
                break;
        }
    });
    if (!$('#rowToolbar').length) {
        var isUserView = depage == 'user' || depage == 'designer';
        var noDetype = detype == null;
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            // 已读：未读且非失效且人员视图
            + '{{# if(d.isRead != 1 && d.status != 1 && ' + (isUserView && noDetype) + '){ }}<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="read">已读</button>{{# } }}'
            // 分配：初始/已审且非来源页
            + '{{# if((d.status == 0 || d.status == 2) && ' + (depage != 'source' && noDetype) + '){ }}<button class="layui-btn layui-btn-xs" lay-event="issue">分配</button>{{# } }}'
            // 是否类配置
            + '{{# if(d.isGroup != 2 && ' + noDetype + '){ }}<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="config" data-ckey="isGroup">是否建群</button>{{# } }}'
            + '{{# if(d.isPhone != 2 && ' + noDetype + '){ }}<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="config" data-ckey="isPhone">是否电话交接</button>{{# } }}'
            + '{{# if(d.isMeet != 2 && ' + noDetype + '){ }}<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="config" data-ckey="isMeet">是否见面</button>{{# } }}'
            // 罚款：管理页且未罚款
            + '{{# if(' + (depage == 'manage' && noDetype) + ' && d.isFine == 0){ }}<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="fine">罚款</button>{{# } }}'
            // 不校验：客服/管理
            + '{{# if(' + ((depage == null || depage == 'service') && noDetype) + ' && d.isCheck == 0){ }}<button class="layui-btn layui-btn-xs" lay-event="uncheck">不校验</button>{{# } }}'
            // 不匹配：初始/已审/确认且非来源页
            + '{{# if((d.status == 0 || d.status == 2 || d.status == 3) && ' + (depage != 'source' && noDetype) + '){ }}<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="disable">不匹配</button>{{# } }}'
            // 推送：非来源页且未失效
            + '{{# if(' + (depage != 'source' && noDetype) + ' && d.status != 1){ }}<button class="layui-btn layui-btn-xs" lay-event="send">推送</button>{{# } }}'
            // 确认：管理页初始/已审
            + '{{# if((d.status == 0 || d.status == 2) && ' + (depage == 'manage') + '){ }}<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="affirm">确认</button>{{# } }}'
            // 编辑/直接初审：人员视图初始（见面=2 是）
            + '{{# if(d.status == 0 && ' + (isUserView && noDetype) + ' && d.isGroup != 0 && d.isPhone != 0 && d.isMeet == 2){ }}'
            + '<button class="layui-btn layui-btn-xs" lay-event="update">编辑</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="firstApprove">直接初审</button>'
            + '<button class="layui-btn layui-btn-xs" lay-event="directApprove">审核</button>{{# } }}'
            // 直接初审（已审状态也可）
            + '{{# if(d.status == 2 && ' + (isUserView && noDetype) + ' && d.isGroup != 0 && d.isPhone != 0 && d.isMeet == 2){ }}<button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="firstApprove">直接初审</button>{{# } }}'
            // 审批
            + '{{# if(' + noDetype + '){ }}<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="approve">审批</button>{{# } }}'
            // 转换：确认状态
            + '{{# if(d.status == 3 && ' + (depage != 'source' && noDetype) + '){ }}<button class="layui-btn layui-btn-xs" lay-event="change">转换</button>{{# } }}'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="record">记录</button>'
            + '<button class="layui-btn layui-btn-xs" lay-event="profile">画像</button>'
            + '<\/script>'
        );
    }

    // 附加参数（人员维度）
    var extraParams = {};
    if (user) {
        if (depage == 'user') {
            extraParams['customerChance.belonger.userId'] = user.userId;
        } else if (depage == 'dept' && user.dept) {
            extraParams['customerChance.belonger.dept.no'] = user.dept.no;
        } else if (depage == 'region' && user.dept && user.dept.fatherDept) {
            extraParams['customerChance.belonger.dept.fatherDept.no'] = user.dept.fatherDept.no;
        }
    }

    function query(pg) {
        state.page = pg || 1;
        var params = $.extend({}, customerCommon.buildFilters($('#searchForm')), extraParams, {
            'paging.page': state.page,
            'paging.rows': state.rows
        });
        if (state.searchBelongerId) params['belonger'] = state.searchBelongerId;
        app.post(api.customer.pageCustomerChance, params, function (res) {
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

    // 搜索归属人
    $('#btnPickBelonger').on('click', function () {
        customerCommon.userPicker(function (u) {
            state.searchBelongerId = u.userId;
            $('#belongerName').val(u.currentName);
        });
    });

    // ==================== 分配 ====================
    function openIssue(v) {
        state.ccid = v.ccid;
        $('#issueForm')[0].reset();
        form.render('select');
        state.issueBelongerId = null;
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
        if (app.validate('issueForm')) return;
        if (!state.issueBelongerId) { app.showAlert(app.warning, '请选择归属人'); return; }
        app.post(api.customer.issueCustomerChance, {
            'customerChance.ccid': state.ccid,
            'customerChance.region.did': $('#issueForm [name="region"]').val(),
            'customerChance.department.did': $('#issueForm [name="department"]').val(),
            'customerChance.belonger.userId': state.issueBelongerId,
            'customerChance.busitype.dbid': $('#issueForm [name="busitype"]').val()
        }, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(state.issueIndex);
            state.issueIndex = null;
            query(state.page);
        });
    });
    $('#btnIssueCancel').on('click', function () { layer.close(state.issueIndex); state.issueIndex = null; });

    // ==================== 是否类配置 ====================
    function openConfig(v, key) {
        state.ccid = v.ccid;
        state.configEventKey = key;
        var titles = { isGroup: '是否建群', isPhone: '是否电话交接', isMeet: '是否见面', isTrue: '是否真实地址' };
        $('#configTitle').text(titles[key] || '是否');
        $('#configForm')[0].reset();
        form.render('select');
        state.configIndex = layer.open({ type: 1, title: titles[key] || '配置', content: $('#configBox'), area: ['380px', 'auto'] });
    }
    $('#btnConfigSave').on('click', function () {
        var options = { 'customerChance.ccid': state.ccid };
        options['customerChance.' + state.configEventKey] = $('#configForm [name="configEvent"]').val();
        app.post(api.customer.configCustomerChance, options, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(state.configIndex);
            state.configIndex = null;
            query(state.page);
        });
    });
    $('#btnConfigCancel').on('click', function () { layer.close(state.configIndex); state.configIndex = null; });

    // ==================== 编辑 / 直接初审（楼盘+楼号+客户校验） ====================
    function openHouse(v, mode) {
        state.ccid = v.ccid;
        state.houseMode = mode;
        state.source.csid = v.source ? v.source.csid : null;
        state.source.name = v.source ? v.source.name : null;
        state.source.gender = v.source ? v.source.gender : null;
        state.village = { no: null, rule: '' };
        $('#houseForm')[0].reset();
        form.render('select');
        // 回填当前楼盘
        var village = (v.house && v.house.village && v.house.village.vid) ? v.house.village : (v.source ? v.source.village : null);
        if (village && village.vid) {
            state.village.no = village.no;
            $('#villageName').val(village.name || '');
            app.post(api.data.queryVillageRule, { 'village.no': village.no }, function (res) {
                var rule = res.villageRule || {};
                state.village.rule = rule.rule || '';
            }, null, false);
        }
        if (v.busitype) $('#houseForm [name="busitype"]').val(v.busitype.dbid);
        form.render('select');
        app.clearValidator();
        state.houseIndex = layer.open({ type: 1, title: mode === 'approve' ? '直接初审' : '编辑', content: $('#houseBox'), area: ['860px', 'auto'] });
    }

    function checkHouse() {
        var hid = '';
        var villageRule = String(state.village.rule || '');
        var rulenum = [
            $.trim($('#houseForm [name="built"]').val()).toUpperCase(), $('#houseForm [name="builtrule"]').val(),
            $.trim($('#houseForm [name="unit"]').val()).toUpperCase(), $('#houseForm [name="unitrule"]').val(),
            $.trim($('#houseForm [name="floor"]').val()).toUpperCase(), $('#houseForm [name="floorrule"]').val(),
            $.trim($('#houseForm [name="door"]').val()).toUpperCase(), $('#houseForm [name="doorrule"]').val()
        ];
        var houseNumber = customerCommon.buildHouseNumber(rulenum);
        if (villageRule && !(new RegExp(villageRule).test(houseNumber))) {
            app.showAlert(app.error, '楼号格式错误');
            return false;
        }
        var houseOption = {
            'house.village.no': state.village.no,
            'house.houseNumber': houseNumber,
            'house.built': $('#houseForm [name="built"]').val(),
            'house.unit': $('#houseForm [name="unit"]').val(),
            'house.floor': $('#houseForm [name="floor"]').val(),
            'house.door': $('#houseForm [name="door"]').val()
        };
        if ($('#houseForm [name="buildArea"]').val()) {
            houseOption['house.buildArea'] = $('#houseForm [name="buildArea"]').val();
        }
        app.post(api.data.existHouse, houseOption, function (res) {
            hid = res.house ? res.house.hid : '';
        }, null, false);
        return hid;
    }

    function checkCustomer() {
        var cid = '';
        var phone = $('#houseForm [name="phone"]').val();
        if (!phone) return '';
        app.post(api.data.existCustomer, {
            'customer.name': state.source.name,
            'customer.phone': phone,
            'customer.gender': state.source.gender,
            'customer.relationshipType': '普通客户',
            'customer.qq': '',
            'customer.wechat': '',
            'customer.email': '',
            'customer.address': ''
        }, function (res) {
            cid = res.customer ? res.customer.cid : '';
        }, null, false);
        return cid;
    }

    $('#btnHouseSave').on('click', function () {
        if (app.validate('houseForm')) return;
        if (!state.village.no) { app.showAlert(app.warning, '请选择楼盘'); return; }
        var hid = checkHouse();
        if (!hid) return;
        var cid = checkCustomer();
        var option = {
            'customerChance.ccid': state.ccid,
            'customerChance.house.hid': hid,
            'customerChance.busitype.dbid': $('#houseForm [name="busitype"]').val(),
            'customerChance.rate': 0
        };
        if (cid) option['customerChance.customer.cid'] = cid;
        var apiDef = state.houseMode === 'approve' ? api.customer.approveCustomerChance : api.customer.updateCustomerChance;
        app.post(apiDef, option, function () {
            app.showAlert(app.success, state.houseMode === 'approve' ? '直接初审成功' : '操作成功');
            layer.close(state.houseIndex);
            state.houseIndex = null;
            query(state.page);
        });
    });
    $('#btnHouseCancel').on('click', function () { layer.close(state.houseIndex); state.houseIndex = null; });

    // ==================== 转换 ====================
    function openChange(v) {
        if (!v.house || !v.house.hid) { app.showAlert(app.error, '房产不存在'); return; }
        if (!v.customer || !v.customer.cid) { app.showAlert(app.error, '客户不存在'); return; }
        // 保护期规则检查
        app.post(api.customer.checkCustomerProtectRule, {
            'customerProtectRule.hid': v.house.hid,
            'customerProtectRule.cid': v.customer.cid,
            'customerProtectRule.duty.did': v.belonger && v.belonger.duty ? v.belonger.duty.did : ''
        }, function (res) {
            var rule = res.customerProtectRule || {};
            if (rule.cprid && rule.orderId) {
                // 有保护单：需归属审批（简化为提示走审批流）
                app.showAlert(app.warning, '客户处于保护期（装修单 ' + rule.orderId + '），请通过审批流程转换');
                return;
            }
            if (!rule.cprid && rule.orderId) {
                // 无保护但有装修单：直接转移归属并完成
                app.post(api.decoration.tranDecorationBelong, {
                    'decorationBelong.orderId': rule.orderId,
                    'decorationBelong.ccid': v.ccid,
                    'decorationBelongs[0].belonger.userId': v.belonger.userId,
                    'decorationBelongs[0].type': 0,
                    'decorationBelongs[1].belonger.userId': v.creater.userId,
                    'decorationBelongs[1].type': 1
                }, function () {
                    app.post(api.customer.finishCustomerChance, {
                        'customerChance.ccid': v.ccid,
                        'decoration.orderId': rule.orderId
                    }, function () {
                        app.showAlert(app.success, '转换成功');
                        query(state.page);
                    });
                });
                return;
            }
            state.ccid = v.ccid;
            $('#changeForm')[0].reset();
            form.render('select');
            app.clearValidator();
            state.changeIndex = layer.open({ type: 1, title: '转换', content: $('#changeBox'), area: ['520px', 'auto'] });
        }, null, false);
    }
    $('#btnChangeSave').on('click', function () {
        if (app.validate('changeForm')) return;
        app.post(api.customer.changeCustomerChance, {
            'customerChance.ccid': state.ccid,
            'decoration.typeness': $('#changeForm [name="orderType"]').val(),
            'decoration.resourceType': $('#changeForm [name="resourceType"]').val(),
            'decoration.houseType': $('#changeForm [name="houseType"]').val(),
            'decoration.houseClass': $('#changeForm [name="houseClass"]').val()
        }, function () {
            app.showAlert(app.success, '转换成功');
            layer.close(state.changeIndex);
            state.changeIndex = null;
            query(state.page);
        });
    });
    $('#btnChangeCancel').on('click', function () { layer.close(state.changeIndex); state.changeIndex = null; });

    // ==================== 不匹配 ====================
    $('#btnDisableSave').on('click', function () {
        if (app.validate('disableForm')) return;
        app.post(api.approval.submitApprovalForCustomerChanceToDisabled, {
            'approval.receiver.userId': state.chance.belonger ? state.chance.belonger.userId : '',
            'approval.comment': $('#disableForm [name="annotate"]').val(),
            'approvalCustomerChance.chance.ccid': state.ccid
        }, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(state.disableIndex);
            state.disableIndex = null;
            query(state.page);
        });
    });
    $('#btnDisableCancel').on('click', function () { layer.close(state.disableIndex); state.disableIndex = null; });

    // ==================== 审批 ====================
    function openApprove(v) {
        state.ccid = v.ccid;
        $('#approveForm')[0].reset();
        form.render('select');
        if (v.busitype) $('#approveForm [name="busitype"]').val(v.busitype.dbid);
        form.render('select');
        state.approveManId = null;
        app.clearValidator();
        state.approveIndex = layer.open({ type: 1, title: '审批', content: $('#approveBox'), area: ['560px', 'auto'] });
    }
    $('#btnPickApproveMan').on('click', function () {
        customerCommon.userPicker(function (u) {
            state.approveManId = u.userId;
            $('#approveManName').val(u.currentName);
        });
    });
    $('#btnApproveSave').on('click', function () {
        if (app.validate('approveForm')) return;
        if (!state.approveManId) { app.showAlert(app.error, '请选择审批人'); return; }
        app.showConfirm('是否确认提交审批', function () {
            app.post(api.approval.submitApprovalForCustomerChance, {
                'approval.receiver.userId': state.approveManId,
                'approval.comment': $('#approveForm [name="approveComment"]').val(),
                'approvalCustomerChance.chance.ccid': state.ccid,
                'approvalCustomerChance.typeness': $('#approveForm [name="orderType"]').val(),
                'approvalCustomerChance.busitype.dbid': $('#approveForm [name="busitype"]').val(),
                'approvalCustomerChance.houseType': $('#approveForm [name="houseType"]').val(),
                'approvalCustomerChance.houseClass': $('#approveForm [name="houseClass"]').val(),
                'approvalCustomerChance.resourceType': $('#approveForm [name="resourceType"]').val()
            }, function () {
                app.showAlert(app.success, '操作成功');
                layer.close(state.approveIndex);
                state.approveIndex = null;
                query(state.page);
            });
        });
    });
    $('#btnApproveCancel').on('click', function () { layer.close(state.approveIndex); state.approveIndex = null; });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () {
        $('#searchForm')[0].reset();
        state.searchBelongerId = null;
        form.render('select');
        query(1);
    });
});
}); // end app.ready
