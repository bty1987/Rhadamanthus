/**
 * app/js/construction/construction-common.js —— construction 模块公共工具（34 个页面共用）
 *
 * 提供：
 *   - constructionCommon.ENUM：施工域枚举（对齐生产库 communion.constant module='construction'，
 *     旧页面经 constant.construction() 同步加载，新页面统一内置，值与线上一致）
 *   - constructionCommon.SURVEY：客户问卷题型常量（画像页用，module='customer' clazz='survey'）
 *   - constructionCommon.badge(map, key, colorFn)：状态徽章（'<\/span>' 转义写法）
 *   - constructionCommon.buildFilters($form)：构造 filters[N].{field,data,op}
 *   - constructionCommon.dateRange(elem)：laydate 范围选择（值 "YYYY-MM-DD-YYYY-MM-DD"）
 *   - constructionCommon.getPageConfig(name)：读施工功能权限配置（旧 constructionPage.getConfig，
 *     api.right.queryConstructionFunctionRightByName，同步请求）
 *   - constructionCommon.projectStatusName(cnid)：工程状态名（0初始/1开工/2完工 + 动态节点）
 *   - constructionCommon.stateBadge：进度状态机徽章（status/workStatus/checkout）
 *   - constructionCommon.ensureApiStubs()：跨模块 api stub 补齐
 *
 * 施工域状态机（site-workflow）：
 *   constructionSchedule.status：0初始→1开工→3工费(未完工已开放工费)→2完工（显示名随节点动态映射）
 *   workStatus：0初始→1进场→2离场；checkout：0验证→1通过
 *   drawLine.status：0排队→1申请放线→2成功放线/3失败放线
 */
window.constructionCommon = (function () {
    'use strict';

    // ==================== 枚举（值来自生产库 communion.constant, module='construction'） ====================
    var ENUM = {
        // 工程单结算状态 construction.balance
        balance: { 0: '未结算', 1: '已结算', 2: '不结算' },
        // 辅料控制 construction.isAccessory
        isAccessory: { 0: '开启', 1: '锁定' },
        // 分配状态 construction.isIssue / constructionInfo.isIssue
        isIssue: { 0: '未分配', 1: '已分配' },
        // 施工状态 construction.process
        process: { 0: '未完工', 1: '竣工交付' },
        // 终止状态 construction.terminalStatus
        terminalStatus: { 0: '无', 1: '瓦工终止', 2: '木工终止', 3: '油工终止' },
        // 验证标识 accessory.isCheckup / constructionAccessory.isCheckup
        isCheckup: { 0: '验证', 1: '通过' },
        // 施工日志 constructionDiary.atttype / isUpload
        diaryAtttype: { 1: '进场', 2: '离场' },
        diaryIsUpload: { 0: '否', 1: '是' },
        // 工程信息 constructionInfo.handoverStatus / isCeremony / isCheck / isHovel / isKey / isIssue
        handoverStatus: { 0: '未交接', 1: '已交接', 2: '不验证' },
        isCeremony: { 0: '有', 1: '无' },
        isCheck: { 0: '未验证', 1: '已分配' },
        isHovel: { 0: '公司', 1: '客户' },
        isKey: { 0: '工程中心', 1: '客户' },
        // 施工进度 constructionSchedule.status / planStatus / additemStatus
        scheduleStatus: { 0: '初始', 1: '开工', 2: '完工', 3: '工费' },
        planStatus: { 0: '标准', 1: '预估' },
        additemStatus: { 0: '无', 1: '待审' },
        // 主材计划 materialPlan.type / action / anchor / status / autoStatus
        materialPlanType: { 0: '品类', 1: '品牌' },
        materialPlanAction: { 0: '下单', 1: '配送', 2: '到货' },
        materialPlanAnchor: { 0: '计划开工', 1: '计划完工', 2: '实际开工', 3: '实际完工' },
        materialPlanStatus: { 0: '未完成', 1: '已完成', 2: '已取消' },
        materialPlanAutoStatus: { 0: '未履约', 1: '已下单', 2: '已配送', 3: '已到货' },
        // 进离场状态（constructionSchedule.workStatus）
        workStatus: { 0: '初始', 1: '进场', 2: '离场' },
        // 款项验证（constructionSchedule.checkout）
        checkout: { 0: '验证', 1: '通过' },
        // 投诉 customerServiceComplaint.levelDict / status / typeDict
        complaintLevel: { 0: '标准', 1: '重要' },
        complaintStatus: { 0: '未处理', 1: '已处理' },
        complaintType: { 0: '装修', 1: '主材' },
        // 回访 customerServiceBackVisit.backVisitTypeData
        backVisitType: { 0: '标准', 1: '重要' },
        // 放线 drawLine.status
        drawLineStatus: { 0: '排队', 1: '申请放线', 2: '成功放线', 3: '失败放线' },
        // 画像类型 constructionProfile.type / drawlineProfile.type
        profileType: { 1: '需求', 2: '材料', 3: '交接', 4: '标签' },
        // 质检 qualiter.status
        qualiterStatus: { 0: '初始' },
        // 装修单侧常用枚举（展示用，同 decorationCommon）
        decorationStatus: { 0: '初始', 1: '定金', 2: '预签', 3: '签约', 4: '重签', 5: '废单', 6: '终止', 7: '决算', 8: '完工', 22: '审批中', 23: '审批中', 32: '可终止', 33: '可终止' },
        typeness: { 0: '半包', 1: '整装', 2: '半价', 3: '满减', 4: '减上捡', 5: '达额减', 6: '新满减', 7: '局改', 8: '全翻', 9: '全案', 10: '新达额减', 11: '满额减', 12: '新配减', 13: '精装房', 14: '新满减', 15: '新惠减' },
        designStatus: { 0: '初始', 1: '设计中', 2: '已完成', 11: '微改', 21: '大改' },
        houseType: { '期房': '期房', '现房': '现房' }
    };

    // ==================== 问卷题型（module='customer' clazz='survey'，画像动态表单用） ====================
    var SURVEY = { TYPE_TEXT_INT: 0, TYPE_INPUT_INT: 1, TYPE_SINGLE_INT: 2, TYPE_MULTIPLE_INT: 3, TYPE_DATE_INT: 4 };

    // 状态徽章颜色（按业务含义）
    function statusColor(key) {
        key = parseInt(key, 10);
        if (key === 0) return 'layui-bg-blue';
        if (key === 3 || key === 5 || key === 6) return 'layui-bg-gray';
        if (key === 1 || key === 2) return 'layui-bg-green';
        return 'layui-bg-cyan';
    }

    /**
     * 状态徽章。用法：constructionCommon.badge(ENUM.scheduleStatus, v.status)
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

    /** laydate 范围选择器（值 "YYYY-MM-DD-YYYY-MM-DD"，配合 data-op="between"） */
    function dateRange(elem) {
        layui.laydate.render({ elem: elem, range: '-', type: 'date', format: 'yyyy-MM-dd' });
    }

    /**
     * 读施工功能权限配置（对齐旧 constructionPage.getConfig，同步请求）。
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
            url: app.config.server + 'queryConstructionFunctionRightByName.do',
            type: 'POST',
            data: { 'constructionFunctionRight.name': page, authentication: app.cookie.get('authentication') },
            async: false,
            dataType: 'json',
            success: function (res) {
                if (res.errorCode != 0) return;
                var rights = (res.constructionFunctionRights || []).sort(function (a, b) {
                    return (a.constructionFunction.sort || 0) - (b.constructionFunction.sort || 0);
                });
                $.each(rights, function (i, v) {
                    var data = v.constructionFunction;
                    if (data.type == 1) data.value = getApi({ api: window.api || {} }, (data.value || '').split('.'));
                    packageConfig(cfg, (data.key || '').split('.'), data.value, data.subtype);
                });
            }
        });
        return cfg;
    }

    /**
     * 工程状态名：0初始/1开工/2完工 为固定值，其余为动态施工节点（cnid→名称）。
     * @param {Object} nodeMap cnid→name 映射（页面加载时由 queryConstructionNode 构建）
     */
    function projectStatusName(nodeMap, cnid) {
        var key = parseInt(cnid, 10);
        if (key === 0) return '初始';
        if (key === 1) return '开工';
        if (key === 2) return '完工';
        return (nodeMap && nodeMap[cnid]) != null ? nodeMap[cnid] : '';
    }

    /** 进度状态机徽章（status/workStatus/checkout 共用，按 labels 长度定上界；第4态=工费） */
    function stateBadge(status, labels) {
        var idx = parseInt(status, 10);
        if (idx < 0 || idx >= labels.length || isNaN(idx)) return '<span class="layui-badge layui-bg-gray">-<\/span>';
        var cls = ['layui-bg-blue', 'layui-bg-cyan', 'layui-bg-green', 'layui-bg-orange'][idx];
        return '<span class="layui-badge ' + cls + '">' + labels[idx] + '<\/span>';
    }

    /** 加载施工节点映射（cnid→name），返回映射对象（同步） */
    function loadNodeMap() {
        var $ = layui.jquery;
        var nodeMap = {};
        $.ajax({
            url: app.config.server + 'queryConstructionNode.do',
            type: 'POST',
            data: { authentication: app.cookie.get('authentication') },
            async: false,
            dataType: 'json',
            success: function (res) {
                if (res.errorCode != 0) return;
                $.each(res.constructionNodes || [], function (i, v) { nodeMap[v.cnid] = v.name; });
            }
        });
        return nodeMap;
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
        // api.right（施工功能权限，constructionFunction.html / getPageConfig 用）
        api.right = api.right || {};
        _extend(api.right, {
            queryConstructionFunctionRightByName: { url: 'queryConstructionFunctionRightByName.do' },
            updateConstructionFunctionRight: { url: 'updateConstructionFunctionRight.do' },
            syncConstructionFunctionRight: { url: 'syncConstructionFunctionRight.do' }
        });
        // api.common（图片上传/显示，走 media 服务）
        api.common = api.common || {};
        _extend(api.common, {
            uploadImg: { url: 'uploadImg.do', server: 'media' },
            uploadOther: { url: 'uploadOther.do', server: 'media' },
            showImg: { url: 'showImg.do', server: 'media' }
        });
        // api.quotation（报价模块 api 未迁时 normtion/supervision 打印需要）
        if (!window.api.quotation) api.quotation = {};
        _extend(api.quotation, {
            queryQuotationForDefaultByOrderId: { url: 'queryQuotationForDefaultByOrderId.do', type: 'query', tranargs: [{ result: 'quotation', args: ['totalPrice', 'decrease', 'trafficPrice', 'managePrice', 'taxPrice', 'basePrice', 'discount'] }] },
            amountQuotationNormood: { url: 'amountQuotationNormood.do' },
            amountExtensionNormood: { url: 'amountExtensionNormood.do' },
            amountAddReduceNormood: { url: 'amountAddReduceNormood.do' },
            queryQuotationNormoodItem: { url: 'queryQuotationNormoodItem.do' },
            amountQuotationNormrice: { url: 'amountQuotationNormrice.do' },
            amountExtensionNormrice: { url: 'amountExtensionNormrice.do' },
            amountAddReduceNormrice: { url: 'amountAddReduceNormrice.do' }
        });
        // api.inventory（库存模块 api 未迁时 normtion 需要）
        if (!window.api.inventory) api.inventory = {};
        _extend(api.inventory, {
            queryAccessoriesByOrderId: { url: 'queryAccessoriesByOrderId.do' },
            queryAccessoriesItemByOrderId: { url: 'queryAccessoriesItemByOrderId.do' }
        });
    }

    return {
        ENUM: ENUM,
        SURVEY: SURVEY,
        badge: badge,
        buildFilters: buildFilters,
        dateRange: dateRange,
        getPageConfig: getPageConfig,
        projectStatusName: projectStatusName,
        stateBadge: stateBadge,
        loadNodeMap: loadNodeMap,
        ensureApiStubs: ensureApiStubs
    };
})();
