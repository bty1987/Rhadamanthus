/**
 * app/js/customer/customer-common.js —— customer（客服域）模块公共工具（43 个页面共用）
 *
 * 提供：
 *   - customerCommon.ENUM：客服域枚举（对齐生产库 communion.constant module='customer'，
 *     旧页面经 constant.customer() 同步加载，新页面统一内置，值与线上一致）
 *   - customerCommon.SURVEY：客户问卷题型常量（module='customer' clazz='survey'，画像页用）
 *   - customerCommon.badge(map, key, colorFn)：状态徽章（'<\/span>' 转义写法）
 *   - customerCommon.buildFilters($form)：构造 filters[N].{field,data,op}
 *   - customerCommon.dateRange(elem)：laydate 范围选择（值 "YYYY-MM-DD-YYYY-MM-DD"）
 *   - customerCommon.getPageConfig(name)：读客服功能权限配置（旧 customerPage.getConfig，
 *     api.right.queryCustomerFunctionRight，同步请求）
 *   - customerCommon.userPicker / deptPicker：人员、部门选择弹窗（跨模块 api.personel）
 *   - customerCommon.ensureApiStubs()：跨模块 api stub 补齐
 *
 * 客服域状态机：
 *   customerOrigin.status：0初始→1初审→2提交→3确认→4审批→5绑定→6驳回
 *   customerSource.status：0初始→1失效→2审批→3确认→5转换
 *   customerChance.status：0初始→1失效→2已审→3确认→4完成
 *   customerAfterSales.status：0初始→1接收→2分派→3处理→4确认→5完结→6关闭→7取消→8挂起
 *   aepair/repair.status：0初始→1维修→2完工→3关闭；complaint.status：0初始→1处理→2完结→3关闭
 */
window.customerCommon = (function () {
    'use strict';

    // ==================== 枚举（值来自生产库 communion.constant, module='customer'，按 clazz+type 分组） ====================
    var ENUM = {
        // 维修工单 aepair（status 工单状态 / aepairStatus 客户评价 / oneState..fivState 各工序状态）
        aepairStatus: { 0: '初始', 1: '维修', 2: '完工', 3: '关闭' },
        aepairGrade: { 0: '初始', 1: '满意', 2: '一般', 3: '投诉' },
        aepairNode: { 0: '初始', 1: '维修', 2: '完工' },
        // 维修款项 aepairPay
        aepairPayStatus: { 0: '初始', 1: '已付款', 2: '已确认' },
        aepairPayType: { 0: '款项', 1: '扣款', 2: '成本' },
        // 投诉（complain/complaint 两套）
        complainGrade: { 0: '初始', 1: '满意', 2: '一般', 3: '投诉' },
        complainStatus: { 0: '初始', 1: '处理', 2: '完结', 3: '关闭' },
        complainType: { 0: '标准', 1: '重大', 2: '危机' },
        complaintStatus: { 0: '初始', 1: '处理', 2: '完结', 3: '关闭' },
        complaintType: { 0: '设计', 1: '业务', 2: '工程', 3: '销售', 4: '其他', 5: '无理' },
        // 积分 cppoint（type 积分类型 / cppointType 操作类型）
        cppointType: { 0: '装修', 1: '销售', 2: '运营' },
        cppointOperateType: { 0: '积累', 1: '消耗' },
        // 客户 customer
        customerStatus: { 0: '初始', 1: '认证', 2: '已认证' },
        customerAuthStatus: { 0: '初始', 1: '认证' },
        customerType: { 0: '个人', 1: '公司' },
        customerGradeType: { 0: '普通客户' },
        // 售后 customerAfterSales
        afterSalesStatus: { 0: '初始', 1: '接收', 2: '分派', 3: '处理', 4: '确认', 5: '完结', 6: '关闭', 7: '取消', 8: '挂起' },
        // 商机 customerChance
        chanceStatus: { 0: '初始', 1: '失效', 2: '已审', 3: '确认', 4: '完成' },
        chanceType: { 0: '自动', 1: '人员', 2: '部门', 3: '分区' },
        chanceIsRead: { 0: '未读', 1: '已读' },
        chanceIsFine: { 0: '未罚款', 1: '罚款' },
        chanceIsCheck: { 0: '验证中', 1: '已忽略' },
        chanceConfig: { 0: '无状态', 1: '否', 2: '是' },
        // 公司规则 customerCompanyRule
        companyRuleType: { 0: '面积', 1: '特殊', 2: '部门' },
        // 部门规则 customerDeptRule
        deptRuleAtttype: { 0: '自动', 1: '人员', 2: '部门', 3: '分区' },
        deptRuleFocus: { 0: '通用', 1: '面积', 2: '部门', 3: '部门类型' },
        deptRuleType: { 0: '公司', 1: '分区', 2: '部门' },
        // 客源 customerOrigine
        originStatus: { 0: '初始', 1: '初审', 2: '提交', 3: '确认', 4: '审批', 5: '绑定', 6: '驳回' },
        // 保护期规则 customerProtectRule
        protectRuleStatus: { 0: '有效', 1: '失效' },
        protectRuleType: { 0: '面积', 1: '预付', 2: '设计', 3: '定金', 4: '岗位' },
        // 客户来源 customerSource
        sourceStatus: { 0: '初始', 1: '失效', 2: '审批', 3: '确认', 4: '审批', 5: '转换' },
        sourceCustomerType: { 0: '到店', 1: '量房', 2: '守园' },
        sourceDemand: { 0: '基装', 1: '整装', 2: '局改装' },
        sourceHouseAttr: { 0: '清水', 1: '全翻', 2: '局改' },
        // 人员规则 customerUserRule
        userRuleStatus: { 0: '启用', 1: '停止(个人)', 2: '停止(部门)', 3: '停止(分区)', 4: '失效', 5: '停止(管理)' },
        // 人员规则项 customerUserRuleItem
        userRuleItemStatus: { 0: '有效', 1: '无效' },
        userRuleItemType: { 0: '面积', 1: '特殊', 2: '部门', 3: '部门类型', 4: '城区', 5: '人员', 6: '面积轮训' },
        userRuleItemPriority: { 0: '1', 1: '2', 2: '3', 3: '4', 4: '5', 5: '6', 6: '7', 7: '8', 8: '9' },
        userRuleItemIsDelete: { 0: '删除', 1: '不删除' },
        userRuleItemIsSurplus: { 0: '减', 1: '不减' },
        // 客户群组 droup（dType 群平台 / droupType 业务类型 / droupTypes 消息类型）
        droupStatus: { 0: '有效', 1: '无效' },
        droupType: { 0: '客户', 1: '处理' },
        droupBizType: { 0: '客户', 1: '装修', 2: '主材', 3: '工程', 4: '款项', 5: '其他' },
        droupDType: { 1: '钉钉', 2: '微信' },
        droupMsgType: { 0: '文本', 1: '图片', 2: '应用', 3: '语音' },
        // 反馈 feedback（status 来源 / feedbackStatus 处理状态）
        feedbackStatus: { 0: '初始', 1: '接收', 2: '处理', 3: '完成' },
        feedbackSourceType: { 0: '反馈', 1: '投诉', 2: '维修' },
        // 反馈回访 feedbackBackVisit
        backVisitPleased: { 0: '非常满意', 1: '满意', 2: '一般', 3: '不满意', 4: '非常不满意' },
        backVisitResult: { 0: '整体待修', 1: '整体完工', 2: '确认撤销', 3: '部分完工', 4: '来电表扬' },
        backVisitResultFlag: { 0: '是', 1: '否' },
        backVisitPraiseType: { 0: '表扬形式①', 1: '表扬形式②' },
        backVisitPerforFlag: { 0: '是', 1: '否', 2: '不记得' },
        backVisitOpenWords: { 0: '方便', 1: '不方便/拒绝评价', 2: '未接一①次', 3: '未接一②次', 4: '未接一③次', 5: '超期放弃回访' },
        backVisitContactFlag: { 0: '已解决', 1: '解决过程中' },
        backVisitContactSoonFlag: { 0: '是', 1: '否', 2: '不记得' },
        // 反馈投诉 feedbackComplaint
        complaintUrgency: { 0: '预警', 1: '一级', 2: '二级', 3: '三级' },
        complaintUpgrade: { 0: '是（超时）', 1: '是（平台）', 2: '否' },
        complaintSource: { 0: '平台私聊', 1: '400电话', 2: '到店投诉', 3: '内部反馈', 4: '消协/工商', 5: 'ERP小程序', 6: 'VIP服务群', 7: '调研回访', 8: '电视/电台曝光', 9: '第三方平台' },
        complaintResults: { 0: '结案-完成', 1: '结案-撤销', 2: '协商中-方案未确定', 3: '执行中-确定方案(问题闭环)', 4: '升级-法务介入处理' },
        complaintDeptType: { 0: '设计', 1: '主材', 2: '尺源', 3: '工程', 4: '职能', 5: '未知' },
        // 反馈投诉问题分类 feedbackComplaintDept
        complaintProblemFirstLevel: { 0: '图纸类', 1: '合同类', 2: '服务类', 3: '款项类' },
        complaintProblemType: { 0: '图纸不满意', 1: '图纸标注错误/遗漏', 2: '图纸拖延', 3: '方案无法落地', 4: '故意漏项，增项纠纷' },
        complaintProblemSecondary: { 0: '效果问题', 1: '标注问题', 2: '拖延问题', 3: '落地问题', 4: '漏项问题', 5: '配比问题' },
        // 质保 feedbackGuarantee
        guaranteeSource: { 0: '400电话', 1: '媒体平台', 2: '到店来访', 3: '监理上报', 4: '员工上报', 5: '客户回访', 6: 'ERP小程序', 7: '工商', 8: '消协', 9: '上门拜访', 10: '315', 11: '平台私聊', 12: '第三方平台' },
        guaranteeUpgradeSource: { 0: '无', 1: '315公众平台', 2: '抖音', 3: '小红书', 4: '黑猫', 5: '大众点评', 6: '上门', 7: '超时' },
        guaranteeCustomerType: { 0: '终身保修客户', 1: '过保客户', 2: '收费客户', 3: '关系客户', 4: '核查确认', 5: '二手房主', 6: '保修2年', 7: '保修5年' },
        guaranteeDeptType: { 0: '监理', 1: '售后', 2: '质检', 3: '值班' },
        guaranteeWorkType: { 1: '水工', 2: '电工', 3: '瓦工', 4: '木工', 5: '油工' },
        guaranteeSvUserStatus: { 0: '是', 1: '否', 2: '调至' },
        guaranteeRepairResult: { 0: '待修', 1: '完工', 2: '撤销', 3: '无' },
        guaranteePlumberType: { 0: '卫生间漏水', 1: '下水堵塞/返水', 2: '卫生间反味', 3: '厨房反味', 4: '主管道漏水', 5: '厨房漏水', 6: '下水漏水', 7: '上水管漏水', 8: '软连接漏水', 9: '角阀漏水', 10: '打胶处理', 11: '水流小/水压问题', 12: '更换水件（角阀/软连接/水龙头等）' },
        guaranteeElectricianType: { 0: '空开跳闸', 1: '灯具不亮/频率闪', 2: '插座/开关不能正常使用', 3: '更换灯具', 4: '更换开关', 5: '更换空开', 6: '网线不通', 7: '网线升级' },
        guaranteeTilerType: { 0: '瓷砖空鼓', 1: '瓷砖开裂', 2: '瓷砖脱落', 3: '瓷砖崩瓷', 4: '勾缝剂脱落' },
        guaranteeCarpenterType: { 0: '吊棚石膏板开裂', 1: '窗帘杆/滑道脱落', 2: '窗帘盒脱落', 3: '造型棚下沉', 4: '木作造成脱落' },
        guaranteePainterType: { 0: '墙面/棚面大白起皮开裂', 1: '第三方漏水大白修复', 2: '人为剐蹭污损维修', 3: '大白返潮/长霉', 4: '油工收尾' },
        // 返修 repair
        repairStatus: { 0: '初始', 1: '维修', 2: '完工', 3: '关闭' },
        repairType: { 0: '款项', 1: '扣款', 2: '成本' },
        // 回访 revisit
        revisitStatus: { 0: '初始', 1: '满意', 2: '一般', 3: '投诉' },
        revisitType: { 0: '保修', 1: '投诉' },
        // 调研 survey
        surveyStatus: { 0: '初始', 1: '推送', 2: '处理', 3: '完成' },
        surveyType: { 0: '文本', 1: '输入框', 2: '单选', 3: '多选', 4: '日期' },
        surveyOptionChecked: { 0: '已选', 1: '未选' },
        // 会员积分 vscoreRecord
        vscoreRecordType: { 0: '新增', 1: '提取' },
        vscoreRecordStatus: { 0: '初始', 1: '通过', 2: '拒绝' },
        // 装修客户 vustomer（含 advance/shared）
        vustomerStatus: { 0: '有效', 1: '无效' }
    };

    // ==================== 问卷题型（module='customer' clazz='survey'，画像/调研动态表单用） ====================
    var SURVEY = { TYPE_TEXT_INT: 0, TYPE_INPUT_INT: 1, TYPE_SINGLE_INT: 2, TYPE_MULTIPLE_INT: 3, TYPE_DATE_INT: 4 };

    /** 状态徽章颜色（按业务含义：0初始蓝/进行中青/完结绿/关闭灰） */
    function statusColor(key) {
        key = parseInt(key, 10);
        if (isNaN(key)) return 'layui-bg-gray';
        if (key === 0) return 'layui-bg-blue';
        if (key === 5 || key === 6 || key === 7) return 'layui-bg-gray';
        if (key === 4 || key === 2) return 'layui-bg-green';
        return 'layui-bg-cyan';
    }

    /**
     * 状态徽章。用法：customerCommon.badge(ENUM.originStatus, v.status)
     */
    function badge(map, key, colorFn) {
        var text = map[key] != null ? map[key] : (key != null && key !== '' ? key : '-');
        var cls = colorFn ? colorFn(key) : statusColor(key);
        return '<span class="layui-badge ' + cls + '">' + text + '<\/span>';
    }

    /**
     * 构造后端 filters[N].* 参数（与各页 bF() 等价，集中实现）。
     * 表单字段规则：name=filter.field，data-op=操作符（缺省 cn）。
     */
    function buildFilters($form) {
        var $ = layui.jquery;
        var params = {};
        var count = 0;
        $form.find('[name]').each(function () {
            var $el = $(this);
            var val = $.trim($el.val());
            if (val === '' || val == null) return;
            params['filters[' + count + '].field'] = $el.attr('name');
            params['filters[' + count + '].data'] = val;
            params['filters[' + count + '].op'] = $el.attr('data-op') || 'cn';
            count++;
        });
        return params;
    }

    /** laydate 范围选择器（值 "YYYY-MM-DD-YYYY-MM-DD"，配合 ge/le 拆分或 between） */
    function dateRange(elem) {
        layui.laydate.render({ elem: elem, range: '-', type: 'date', format: 'yyyy-MM-dd' });
    }

    /**
     * 读取跨页上下文（app.params handoff）。
     * 页面可能以三种形态打开：本窗口 / 弹窗 iframe（parent=开窗页）/ 主框架 tab iframe（parent=index）。
     * 依次尝试 本窗口 → parent → top，返回非空对象；都无返回 {}。
     * @param {String} key 如 'customer'、'urlLoadParams'
     */
    function ctx(key) {
        var tries = [window];
        if (window.parent && window.parent !== window) tries.push(window.parent);
        if (window.top && window.top !== window && window.top !== window.parent) tries.push(window.top);
        for (var i = 0; i < tries.length; i++) {
            try {
                var w = tries[i];
                if (w.app && w.app.params && w.app.params[key]) {
                    var v = w.app.params[key];
                    if (v) return v;
                }
            } catch (e) { /* 跨域保护 */ }
        }
        return {};
    }

    /**
     * 读客服功能权限配置（对齐旧 customerPage.getConfig，同步请求）。
     * 返回 { apiPage, pageBtn:[], condArr:[], propertyArr:[] }
     */
    function getPageConfig(page) {
        var cfg = { apiPage: null, pageBtn: [], condArr: [], propertyArr: [] };
        if (!page) return cfg;

        function packageConfig(o, props, value, subtype) {
            var prop = props.shift();
            if (props.length != 0) {
                if (!o[prop]) o[prop] = {};
                packageConfig(o[prop], props, value, subtype);
                return;
            }
            if (subtype == 0) {
                o[prop] = value;
            } else if (subtype == 1 && !o[prop]) {
                o[prop] = [value];
            } else if (subtype == 1 && o[prop]) {
                o[prop].push(value);
            }
        }

        function getApi(o, props) {
            var prop = props.shift();
            if (props.length == 0) return o[prop];
            if (o[prop]) return getApi(o[prop], props);
            return '';
        }

        var $ = layui.jquery;
        $.ajax({
            url: app.config.server + 'queryCustomerFunctionRight.do',
            type: 'POST',
            data: { 'customerFunctionRight.name': page, authentication: app.cookie.get('authentication') },
            async: false,
            dataType: 'json',
            success: function (res) {
                if (res.errorCode != 0) return;
                var rights = (res.customerFunctionRights || []).sort(function (a, b) {
                    return (a.customerFunction.sort || 0) - (b.customerFunction.sort || 0);
                });
                $.each(rights, function (i, v) {
                    var data = v.customerFunction;
                    if (data.type == 1) data.value = getApi({ api: window.api || {} }, (data.value || '').split('.'));
                    packageConfig(cfg, (data.key || '').split('.'), data.value, data.subtype);
                });
            }
        });
        return cfg;
    }

    /**
     * 人员选择弹窗（对齐旧 condition autofill：api.personel.queryUserByPinyin）。
     * @param {Function} cb 选中回调 cb({userId, currentName, dept:{deptId, deptName}})
     */
    function userPicker(cb) {
        var $ = layui.jquery;
        var layer = layui.layer;
        var html = '<div style="padding:15px;">'
            + '<div style="margin-bottom:10px;"><input id="ucPickerInput" placeholder="输入拼音/姓名/编号检索" class="layui-input" style="width:100%;"></div>'
            + '<div id="ucPickerList" style="max-height:300px;overflow:auto;"></div></div>';
        var idx = layer.open({
            type: 1, title: '选择人员', content: html, area: ['420px', 'auto'],
            success: function () {
                $('#ucPickerInput').on('input', function () {
                    var kw = $.trim($(this).val());
                    if (!kw) return;
                    app.post(api.personel.queryUserByPinyin, { pinyinName: kw, 'user.status': 0, 'user.department.type': 0 }, function (res) {
                        var list = res.userBases || [];
                        var $list = $('#ucPickerList').empty();
                        $.each(list, function (i, v) {
                            $('<div class="uc-picker-item" style="padding:6px 10px;cursor:pointer;border-bottom:1px solid #eee;">')
                                .html(v.currentName + '（' + (v.dept ? v.dept.deptName : '') + '）')
                                .data('user', v)
                                .appendTo($list);
                        });
                    });
                });
                $('#ucPickerList').on('click', '.uc-picker-item', function () {
                    var u = $(this).data('user');
                    layer.close(idx);
                    if (cb) cb(u);
                });
            }
        });
    }

    /**
     * 部门选择弹窗（api.communion.queryDepartment，客户端按名称过滤）。
     * @param {Function} cb 选中回调 cb({deptId, deptName, type})
     */
    function deptPicker(cb) {
        var $ = layui.jquery;
        var layer = layui.layer;
        var all = [];
        function render(kw) {
            var $list = $('#dcPickerList').empty();
            $.each(all, function (i, v) {
                if (kw && (v.name || '').indexOf(kw) === -1) return;
                $('<div class="dc-picker-item" style="padding:6px 10px;cursor:pointer;border-bottom:1px solid #eee;">')
                    .html(v.name || '')
                    .data('dept', v)
                    .appendTo($list);
            });
        }
        var html = '<div style="padding:15px;">'
            + '<div style="margin-bottom:10px;"><input id="dcPickerInput" placeholder="输入部门名称过滤" class="layui-input" style="width:100%;"></div>'
            + '<div id="dcPickerList" style="max-height:300px;overflow:auto;"></div></div>';
        var idx = layer.open({
            type: 1, title: '选择部门', content: html, area: ['420px', 'auto'],
            success: function () {
                app.post(api.communion.queryDepartment, { 'dept.type': 0 }, function (res) {
                    all = res.departments || [];
                    render('');
                });
                $('#dcPickerInput').on('input', function () {
                    render($.trim($(this).val()));
                });
                $('#dcPickerList').on('click', '.dc-picker-item', function () {
                    var d = $(this).data('dept');
                    layer.close(idx);
                    if (cb) cb(d);
                });
            }
        });
    }

    /**
     * 拼接楼号（对齐旧 houseUtils.creatHouseNumber）。
     * @param {Array} arr [built, builtrule, unit, unitrule, floor, floorrule, door, doorrule]
     * 规则：值为 0 的数据段与其后一段分隔符跳过，其余顺序拼接；
     * 分隔符段的占位项（"选择"，key 为 0/1）不拼接也不吞下一个数据段。
     */
    function buildHouseNumber(arr) {
        var str = '';
        var erri;
        for (var i = 0; i < arr.length; i++) {
            var val = arr[i];
            if (i % 2 === 1 && (val === '0' || val === '1')) continue; // 分隔符占位项
            if (val != 0 || val === '') {
                if (i != erri + 1) str = str + val;
            } else {
                erri = i;
            }
        }
        return str;
    }

    // ==================== 跨模块 api stub 补齐 ====================
    // ★ 必须在 app.ready 回调内（bootstrap 加载完 api 定义后）调用 ensureApiStubs()。
    //   浅合并且只补缺（_extend 只填 null/undefined），幂等可重复调用。
    function _extend(target, src) {
        for (var k in src) { if (src.hasOwnProperty(k) && target[k] == null) target[k] = src[k]; }
        return target;
    }
    function ensureApiStubs() {
        window.api = window.api || {};
        // api.right（客服功能权限，customerFunction.html / getPageConfig 用）
        api.right = api.right || {};
        _extend(api.right, {
            queryCustomerFunctionRight: { url: 'queryCustomerFunctionRight.do' },
            updateCustomerFunctionRight: { url: 'updateCustomerFunctionRight.do' },
            syncCustomerFunctionRight: { url: 'syncCustomerFunctionRight.do' }
        });
    }

    return {
        ENUM: ENUM,
        SURVEY: SURVEY,
        badge: badge,
        statusColor: statusColor,
        buildFilters: buildFilters,
        dateRange: dateRange,
        ctx: ctx,
        buildHouseNumber: buildHouseNumber,
        getPageConfig: getPageConfig,
        userPicker: userPicker,
        deptPicker: deptPicker,
        ensureApiStubs: ensureApiStubs
    };
})();
