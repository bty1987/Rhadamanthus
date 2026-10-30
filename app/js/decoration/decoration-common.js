/**
 * app/js/decoration/decoration-common.js —— decoration 模块公共工具（27 个页面共用）
 *
 * 提供：
 *   - decorationCommon.ENUM：装修单域枚举（对齐生产库 communion.constant module='decoration'，
 *     旧页面经 constant.decoration() 同步加载，新页面统一内置，值与线上一致）
 *   - decorationCommon.badge(map, key, colorFn)：状态徽章（'<\/span>' 转义写法）
 *   - decorationCommon.buildFilters($form)：构造 filters[N].{field,data,op}
 *   - decorationCommon.dateRange(elem)：laydate 范围选择（值 "YYYY-MM-DD-YYYY-MM-DD"，对齐后端 between 拆分）
 *   - decorationCommon.nodeTitle：详情向导节点 → 标题映射（旧 decorationPageUtils.drawNode.title）
 *   - decorationCommon.getPageConfig(name)：读功能权限配置（旧 drawNode.getConfig，
 *     api.right.queryDecorationFunctionRightByName，同步请求）
 *   - decorationCommon.resolveViewNode()：从 app.params.decoration.viewNode 取向导节点（缺省给默认集）
 *
 * 本文件同时本地补齐 decoration 页面依赖的跨模块 api stub（若对应模块 api 文件尚未迁移）：
 *   api.right.*（装修功能权限）、api.construction.*（施工联动查询）、api.common.*（图片上传/显示）
 */
window.decorationCommon = (function () {
    'use strict';

    // ==================== 枚举（值来自生产库 communion.constant, module='decoration'） ====================
    var ENUM = {
        // 装修单状态 decoration.status
        status: { 0: '初始', 1: '定金', 2: '预签', 3: '签约', 4: '重签', 5: '废单', 6: '终止', 7: '决算', 8: '完工', 22: '审批中', 23: '审批中', 32: '可终止', 33: '可终止' },
        // 签单类型 decoration.typeness
        typeness: { 0: '半包', 1: '整装', 2: '半价', 3: '满减', 4: '减上捡', 5: '达额减', 6: '新满减', 7: '局改', 8: '全翻', 9: '全案', 10: '新达额减', 11: '满额减', 12: '新配减', 13: '精装房', 14: '新满减', 15: '新惠减' },
        // 订单类型 decoration.type
        type: { 0: '半包,装修单,不包括主材单', 1: '整装,装修+主材单', 2: '满减,主材配比,装修打折' },
        // 设计状态
        designStatus: { 0: '初始', 1: '设计中', 2: '已完成', 11: '微改', 21: '大改' },
        // 确认状态
        sourceStatus: { 0: '初始', 1: '合同方案确认', 2: '放线方案确认' },
        // 保修状态
        repairStatus: { 0: '初始', 1: '终身', 2: '转卖', 3: '免责', 4: '欠款', 5: '过保', 6: '2/5年', 7: '无保' },
        // 内决状态
        balanceStatus: { 0: '初始', 1: '内决' },
        // 房屋现状/房屋类型
        houseType: { '期房': '期房', '现房': '现房' },
        houseClass: { '平层': '平层', '阁楼': '阁楼', '地下室': '地下室', '复式': '复式', '别墅': '别墅', '叠拼': '叠拼' },
        grade: { A: 'A', B: 'B', C: 'C' },
        // 客源/资源
        resourceType: { 0: '咨询', 1: '量房' },
        salesmanType: { '资源': '资源', '守园': '守园', '监理': '监理', '上门': '上门', '公司': '公司', '工人': '工人', '设计师': '设计师', '咨询': '咨询', '非业务人员': '非业务人员', '约访公司': '约访公司', '400渠道客源': '400渠道客源' },
        // 业务类型（busitype）
        busitype: { 1: '市场部客源', 2: '电商信息流客源', 3: '上门咨询客源', 4: '设计返单客源', 5: '工程返单客源', 6: '电商新媒体客源', 7: '400渠道客源', 8: '其他渠道客源', 16: '渠道中介客源', 25: '主材厂商', 26: '主材自媒体', 27: '渠道芒果客源', 28: '渠道房小二客源', 33: '渠道售楼物业客源', 38: '渠道小客源' },
        // 量房 measure.status
        measureStatus: { 0: '排队', 1: '申请量尺', 2: '成功量尺', 3: '失败量尺' },
        // 合同 decorationContract.status
        contractStatus: { 0: '初始', 1: '已签', 2: '失效', 3: '归档', 4: '归档本地' },
        // 装修活动 decorationActivity.status
        activityStatus: { 0: '初始', 1: '锁定' },
        // 活动物品 decorationActivityItem.status
        activityItemStatus: { 0: '初始', 1: '失效', 2: '已领', 3: '退货', 4: '配送', 5: '未退', 6: '升级', 7: '补款', 8: '抵现', 9: '采购' },
        // 活动物品领取类型 stateType
        stateType: { 0: '到店', 1: '定金', 2: '签单', 3: '签单抽奖', 4: '签单特批', 5: '购买', 6: '其他', 7: '升级', 8: '设计', 9: '节点活动抽奖', 10: '节点活动抽奖特批', 11: '老带新', 12: '赔偿' },
        isStatus: { 0: '计入', 1: '不计入' },
        isAffirm: { 0: '初始', 1: '首次确认', 2: '二次确认' },
        // 审核 auditRecord.status / audit.auditStatus / decorationAuditScale.status
        auditRecordStatus: { 0: '初始', 1: '确认提交扣款信息', 2: '已处理', 3: '已退款' },
        auditStatus: { '已审批': '已审批', '未审批': '未审批' },
        auditScaleStatus: { 0: '初始', 1: '确认', 2: '扣款', 3: '冲减' },
        perCharge: { designer: 9, manager: 1 },
        // 服务 decorationService.status
        serviceStatus: { 0: '初始', 1: '完成' },
        // 图纸 decorationPicture.status
        pictureStatus: { 0: '隐藏', 1: '显示', 4: '确认' },
        // 归属 defaultFlag
        defaultFlag: { 0: '非归属', 1: '归属' },
        // 装修单人员
        isPay: { 0: '无薪', 1: '有薪' },
        isShow: { 0: '显示', 1: '隐藏' },
        userType: { 0: '业务', 1: '装饰', 2: '服务', 3: '合同', 4: '销售', 99: '其他' },
        // 工程状态（基础值，动态节点见 constructionNodes）
        projectStatus: { 0: '初始', 1: '开工', 2: '完工' },
        // 决算 decorationAccount
        accountType: { 0: '半包', 1: '套餐', 2: '半价' },
        accountArcal: { 0: '计算配比', 1: '不计算配比' },
        accountIsAffirm: { 0: '初始', 1: '确认' },
        accountStatusFlag: { 0: '未通过', 1: '通过', 2: '不验证' },
        accountItemType: { 0: '预签', 1: '报价', 2: '扩展', 3: '合同', 4: '主材', 5: '外销', 6: '增减', 7: '预付款', 8: '决算' },
        // 付款状态（通用展示）
        paymentStatus: ['未付款', '已付款', '已确认', '审批中', '历史']
    };

    // 状态徽章颜色（按业务含义）
    function statusColor(key) {
        key = parseInt(key, 10);
        if (key === 0) return 'layui-bg-blue';
        if (key === 5 || key === 6) return 'layui-bg-gray';
        if (key === 3 || key === 7 || key === 8 || key === 4) return 'layui-bg-green';
        if (key === 22 || key === 23 || key === 32 || key === 33) return 'layui-bg-orange';
        return 'layui-bg-cyan';
    }

    /**
     * 状态徽章。用法：decorationCommon.badge(ENUM.status, v.status)
     * @param {Object} map 枚举表
     * @param {String|Number} key
     * @param {Function} [colorFn] 自定义颜色函数
     */
    function badge(map, key, colorFn) {
        var text = map[key] != null ? map[key] : (key != null && key !== '' ? key : '-');
        var cls = colorFn ? colorFn(key) : statusColor(key);
        return '<span class="layui-badge ' + cls + '">' + text + '<\/span>';
    }

    /**
     * 构造后端 filters[N].* 参数（与各页 bF() 等价，集中实现）。
     * 表单字段规则：name=filter.field，data-op=操作符（缺省 cn）。
     * 日期范围（data-range="1"）值原样发送（laydate range:'-' 已是 "start-end"）。
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

    /** 详情向导节点 → 标题（对齐旧 decorationPageUtils drawNode.title） */
    var nodeTitle = {
        basic: '基本信息', presign: '预签信息', quotation: '报价信息', select: '选材信息', picture: '图纸信息',
        material: '主材信息', activity: '活动信息', payment: '款项信息', belong: '归属信息', addreduce: '增减项',
        account: '决算信息', service: '服务信息', users: '人员信息'
    };

    /**
     * 读装修单功能权限配置（对齐旧 drawNode.getConfig，同步请求）。
     * 返回 { apiPage, pageBtn:[], nodes:{}, condArr:[], extraParam:[], propertyArr:[], hasExport, companyType }
     */
    function getPageConfig(page) {
        var cfg = { apiPage: null, pageBtn: [], nodes: {}, condArr: [], extraParam: [], propertyArr: [], hasExport: null, companyType: null, postDataName: (page || 'decoration') + 'PostData' };
        if (!page) return cfg;

        function setDeep(o, props, value) {
            var prop = props.shift();
            if (props.length) {
                if (!o[prop]) o[prop] = {};
                setDeep(o[prop], props, value);
                return;
            }
            if ($.isArray(value) && $.isArray(o[prop])) { o[prop] = o[prop].concat(value); return; }
            o[prop] = value;
        }
        function getApi(o, props) {
            var prop = props.shift();
            if (props.length === 0) return o[prop];
            if (o[prop]) return getApi(o[prop], props);
            return '';
        }

        var $ = layui.jquery;
        $.ajax({
            url: app.config.server + 'queryDecorationFunctionRightByName.do',
            type: 'POST',
            data: { 'decorationFunctionRight.name': page, authentication: app.cookie.get('authentication') },
            async: false,
            dataType: 'json',
            success: function (res) {
                if (res.errorCode != 0) return;
                var rights = (res.decorationFunctionRights || []).sort(function (a, b) {
                    return (a.decorationFunction.sort || 0) - (b.decorationFunction.sort || 0);
                });
                $.each(rights, function (i, v) {
                    var data = v.decorationFunction;
                    if (data.type == 1) data.value = getApi({ api: window.api || {} }, (data.value || '').split('.'));
                    setDeep(cfg, (data.key || '').split('.'), data.value);
                });
            }
        });
        return cfg;
    }

    /** 从 app.params.decoration.viewNode 取向导节点；缺省给详情默认集 */
    function resolveViewNode(defaultNodes) {
        var vd = app.params.decoration || {};
        var nodes = vd.viewNode && vd.viewNode.length ? vd.viewNode : (defaultNodes || [
            { type: 'basic' }, { type: 'quotation' }, { type: 'picture' }, { type: 'material' },
            { type: 'activity' }, { type: 'payment' }, { type: 'belong' }, { type: 'addreduce' }
        ]);
        return nodes;
    }

    /** 详情页导航上下文（对齐旧 params.decoration.* 传递） */
    function passDetailCtx(v) {
        var $ = layui.jquery;
        app.params.decoration = $.extend({}, app.params.decoration, {
            decoration: v, orderId: v.orderId, orderType: v.type, orderTypeness: v.typeness,
            versionId: v.version ? v.version.no : '', notSalesmanRate: v.notSalesmanRate
        });
        app.params.quotation = $.extend({}, app.params.quotation, { orderId: v.orderId });
        app.params.historyPage = api.index.decorationIndex.url;
    }

    // ==================== 跨模块 api stub 补齐 ====================
    // ★ 必须在 app.ready 回调内（bootstrap 加载完 api 定义后）调用 ensureApiStubs()。
    //   本文件以普通 <script> 加载，早于 layui.use 执行，此时 window.api 还未就位。
    //   浅合并且只补缺（_extend 只填 null），幂等可重复调用。
    function _extend(target, src) {
        for (var k in src) { if (src.hasOwnProperty(k) && target[k] == null) target[k] = src[k]; }
        return target;
    }
    function ensureApiStubs() {
        window.api = window.api || {};
        // api.right（装修功能权限，同 payment.js / approval4common.js 的本地补齐模式）
        api.right = api.right || {};
        _extend(api.right, {
            queryDecorationFunctionRightByName: { url: 'queryDecorationFunctionRightByName.do' },
            updateDecorationFunctionRight: { url: 'updateDecorationFunctionRight.do' },
            syncDecorationFunctionRight: { url: 'syncDecorationFunctionRight.do' }
        });
        // api.construction（施工联动查询，施工模块 api 文件未迁时本地兜底）
        api.construction = api.construction || {};
        _extend(api.construction, {
            queryConstructionScheduleByOrderId: { url: 'queryConstructionScheduleByOrderId.do' },
            queryConstructionDrawingByOrderId: { url: 'queryConstructionDrawingByOrderId.do' },
            queryConstructerByOrderId: { url: 'queryConstructerByOrderId.do' },
            queryConstructionInfoByOrderId: { url: 'queryConstructionInfoByOrderId.do' },
            updateConstructionInfoByOrderId: { url: 'updateConstructionInfoByOrderId.do' },
            queryConstructionByOrderId: { url: 'queryConstructionByOrderId.do' },
            updateConstructionByCid: { url: 'updateConstructionByCid.do' },
            queryAcceptance: { url: 'queryAcceptance.do' },
            countDrawLine: { url: 'countDrawLine.do' },
            updateDrawLine: { url: 'updateDrawLine.do' },
            resetDrawLine: { url: 'resetDrawLine.do' },
            pretreatDrawLine: { url: 'pretreatDrawLine.do' },
            applayDrawLine: { url: 'applayDrawLine.do' },
            finishDrawLine: { url: 'finishDrawLine.do' },
            countConstructionInfo: { url: 'countConstructionInfo.do' },
            countmeasure: { url: 'countmeasure.do' }
        });
        // api.common（图片上传/显示，走 media 服务）
        api.common = api.common || {};
        _extend(api.common, {
            uploadImg: { url: 'uploadImg.do', server: 'media' },
            uploadOther: { url: 'uploadOther.do', server: 'media' },
            showImg: { url: 'showImg.do', server: 'media' }
        });
        // api.data 常用联动（data 模块已迁大部分，兜底补缺）
        if (!window.api.data) api.data = {};
        _extend(api.data, {
            queryConstructionNode: { url: 'queryConstructionNode.do' },
            queryContractByCid: { url: 'queryContractByCid.do' },
            registCustomer: { url: 'registCustomer.do' },
            confirmCustomer: { url: 'confirmCustomer.do' },
            authCustomer: { url: 'authCustomer.do' },
            resetCustomer: { url: 'resetCustomer.do' }
        });
        // api.personel 常用
        if (!window.api.personel) api.personel = {};
        _extend(api.personel, { queryUserForOption: { url: 'queryUserForOption.do' } });
        // api.quotation 兜底（报价模块 api 未迁时详情/签约页需要）
        if (!window.api.quotation) api.quotation = {};
        _extend(api.quotation, {
            queryQuotationForDefaultByOrderId: { url: 'queryQuotationForDefaultByOrderId.do', type: 'query', tranargs: [{ result: 'quotation', args: ['totalPrice', 'decrease', 'trafficPrice', 'managePrice', 'taxPrice', 'basePrice', 'discount'] }] },
            queryAddReduceByOrderId: { url: 'queryAddReduceByOrderId.do' }
        });
    }

    return {
        ENUM: ENUM,
        badge: badge,
        buildFilters: buildFilters,
        dateRange: dateRange,
        nodeTitle: nodeTitle,
        getPageConfig: getPageConfig,
        resolveViewNode: resolveViewNode,
        passDetailCtx: passDetailCtx,
        ensureApiStubs: ensureApiStubs
    };
})();
