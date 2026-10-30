/**
 * app/js/quotation/quotation-common.js —— quotation 模块公共工具（59 个页面共用）
 *
 * 提供：
 *   - quotationCommon.ENUM：报价域枚举（对齐生产库 communion.constant module='quotation'，
 *     旧页面经 constant.quotation() 同步加载，新页面统一内置，值与线上一致）
 *   - quotationCommon.badge / buildFilters / dateRange / checkNull：与 decorationCommon 同构
 *   - 计算引擎（移植旧 WebContent/js/utils/quotationUtils.js 的核心纯计算部分）：
 *       sortQuo / statisticalQuotationItem / initQuotationDetailItem / quotationDataProcessing
 *       quotationNormriceProcessing / quotationNormtimeProcessing / quotationNormoodProcessing
 *       quotationMaterial / quotationCalculator / quotationTotal
 *     上下文对象 detail（等价旧 quotationUtils.quotationDetail）：
 *       { quotation, quotationPrefer, quotationFunctionAreas, addReduces, extensions, protation, ...统计额 }
 *   - loadQuotationDetail(orderId, cb)：同步装载默认报价上下文（旧 quotationUtils.loadQuotationDetail）
 *
 * 本文件同时本地补齐 quotation 页面依赖的跨模块 api stub（对应模块 api 文件未迁/未覆盖时兜底）。
 */
window.quotationCommon = (function () {
    'use strict';

    // ==================== 枚举（值来自生产库 communion.constant, module='quotation'） ====================
    var ENUM = {
        // 报价单 quotation
        quotationStatus: { 0: '启用', 1: '锁定', 2: '审批' },
        quotationAttstatus: { 0: '初始', 1: '提交', 2: '审批', 3: '完成' },
        quotationDefaults: { 0: '非默认', 1: '默认' },
        quotationTaxDiscount: { 0: '不打折', 1: '打折' },
        // 报价版本（module=data, clazz=quotationVersion）
        versionStatus: { 0: '启用', 1: '禁用' },
        versionDefaults: { 0: '否', 1: '是' },
        versionType: { '-1': '通用', 0: '半包', 1: '整装', 2: '满减' },
        versionManageDiscount: { 0: '不打折', 1: '打折' },
        versionTrafficDiscount: { 0: '不打折', 1: '打折' },
        versionTaxDiscount: { 0: '无税金', 1: '管理税金', 2: '总额税金' },
        // 功能区 quotationFunctionArea
        functionAreaType: { 0: '管理', 1: '工程量', 2: '功能区总额', 3: '不计算', 4: '成本', 5: '非业绩', 6: '隐藏', 7: '综合' },
        // 功能区项 quotationFunctionAreaItem
        functionAreaItemType: { 0: '标准', 1: '自定义', 2: '车运', 3: '管理', 4: '不计', 5: '成本', 6: '非业绩', 7: '隐藏', 8: '税金', 9: '综合', 10: '管理' },
        functionAreaItemDiscount: { 0: '不打折', 1: '打折' },
        // 大类细分（功能区项/扩展项/增减项共用）
        subtype: { 0: '其他', 1: '工程', 2: '主材', 3: '套餐', 4: '家具', 5: '电器', 6: '灯具', 7: '软装' },
        // 扩展项 extension / extensionItem
        extensionType: { 0: '增项', 1: '减项' },
        extensionAtttype: { 0: '通用', 1: '置换', 2: '赋能', 3: '报价', 4: '活动' },
        extensionStatus: { 0: '初始', 1: '锁定' },
        extensionManageDiscount: { 0: '不打折', 1: '打折' },
        extensionItemType: { 0: '标准', 1: '自定义', 2: '标准', 3: '自定义', 4: '报价中', 5: '报价中' },
        extensionItemDiscount: { 0: '不打折', 1: '打折' },
        // 增减项 addreduce / addReduceItem
        addReduceType: { 0: '增项', 1: '减项' },
        addReduceStatus: { 0: '初始', 1: '提交', 2: '已付款', 3: '已确认' },
        addReduceAtttype: { 0: '工程', 1: '主材' },
        addReduceIsAffirm: { 0: '未确认', 1: '客户确认' },
        addReduceIsSalary: { 0: '未开', 1: '已开' },
        addReduceManageDiscount: { 0: '不打折', 1: '打折' },
        addReduceTaxDiscount: { 0: '无税金', 1: '管理税金', 2: '总额税金' },
        addReducePaytype: { 0: '付款', 1: '下拨', 2: '特批', 3: '不退' },
        addReduceItemType: { 0: '标准报价项', 1: '系统定义项', 2: '自定义项', 3: '报价中报价项', 4: '增项中报价项', 5: '拓展中报价项' },
        addReduceItemItemtype: { 0: '标准', 1: '成本' },
        addReduceItemDiscount: { 0: '不打折', 1: '打折', 2: '不打折(非配比)', 3: '打折(非配比)' },
        // 定额 normtion / normoodItem / normriceItem
        normtionStatus: { 0: '启用', 1: '禁用' },
        normoodItemType: { 0: '报价', 1: '拓展', 2: '增减', 3: '定额' },
        normoodItemAtttype: { 0: '收款', 1: '出款' },
        normoodItemNormtype: { 0: '材料', 1: '打包' },
        normriceItemType: { 0: '报价', 1: '拓展', 2: '增减', 3: '定额' },
        normriceItemAtttype: { 0: '收款', 1: '出款' },
        normriceItemNormtype: { 0: '工费', 1: '附加' },
        normriceItemStatus: { 0: '有效', 2: '确认' },
        // 预签报价 protation / protationItem（module=data, clazz=presignItem）
        protationStatus: { 0: '启用', 1: '禁用', 2: '锁定', 3: '审批' },
        protationDefaults: { 0: '非默认', 1: '默认' },
        protationItemType: { 0: '基础', 1: '工程', 2: '主材', 3: '增工', 4: '增主', 5: '减工', 6: '减主', 7: '赋工', 8: '赋主', 9: '通用', 11: '减通' },
        protationItemOneType: { 0: '标准', 1: '标配', 2: '配减' },
        presignItemType: { 0: '基础', 1: '可选配', 2: '个性', 3: '赋能' },
        presignItemAreaCale: { 0: '数量', 1: '面积' },
        // 选材 selection / selectionItem
        selectionStatus: { 0: '初始', 1: '锁定' },
        selectionIsAffirm: { 0: '未确认', 1: '客户确认' },
        selectionItemType: { 0: '报价项', 1: '拓展增', 2: '拓展减', 3: '增减增', 4: '增减减', 5: '选材项', 13: '增减增(下拨)', 14: '增减减(不退)', 23: '增减减(特批)', 30: '报价项(补量)', 31: '拓展增(补量)', 32: '拓展减(补量)', 33: '增减增(补量)', 34: '增减减(补量)' },
        selectionItemStatus: { 0: '初始', 1: '配送', 2: '审核', 3: '确认', 4: '完结', 5: '核对', 6: '申请', 7: '失效' },
        selectionItemAccountStatus: { 0: '初始', 1: '对账', 2: '挂起' },
        // 报价图片 / 优惠 / 记录 / 画像 / 量房表
        quotationPictureType: { 1: '选材' },
        quotationPreferUrgent: { 0: '客户在店', 1: '提前完成' },
        quotationPreferRedo: { 0: '未换设计', 1: '换设计' },
        quotationRecordType: { 0: '预签', 1: '报价', 2: '扩展', 3: '增减' },
        quotationProfileType: { 1: '需求', 2: '材料', 3: '交接', 4: '标签', 5: '增减项' },
        qeasureItemType: { 0: '文本', 1: '输入框', 2: '单选', 3: '多选', 4: '日期' },
        // 预算分配
        assignRequestStatus: { 1: '待分配', 2: '已分配', 3: '已完成' },
        assignRequestPriority: { 1: '最高', 3: '高', 5: '普通', 7: '低', 9: '最低' },
        assignDecorationType: { 0: '半包', 1: '整装', 2: '全包' },
        assignRecordResult: { 0: '失败', 1: '成功' },
        assignRecordType: { 1: '正向自动', 2: '手动', 3: '反向自动', 4: '转交' },
        assignUserRuleStatus: { 1: '待分配', 2: '制作中', 3: '已交付', 4: '已完成' },
        assignSupportedType: { '-1': '通用', 0: '半包', 1: '整装', 2: '全包' },
        assignTalkType: { 1: '设计师', 2: '预算员' },
        assignConfigAutoAssign: { 0: '手动', 1: '自动' },
        assignConfigEnabled: { 0: '禁用', 1: '启用' },
        // quotetion（并行报价模块）功能区类型同 quotation
        quotetionFunctionAreaType: { 0: '管理', 1: '工程量', 2: '功能区总额', 3: '不计算', 4: '成本', 5: '非业绩', 6: '隐藏', 7: '综合' },
        quotetionFunctionAreaItemType: { 0: '标准', 1: '自定义', 2: '车运', 3: '管理', 4: '不计', 5: '成本', 6: '非业绩', 7: '隐藏', 8: '税金', 9: '综合' },
        quotetionFunctionAreaItemDiscount: { 0: '不打折', 1: '打折' }
    };

    // ==================== 关键整型常量（对齐旧 constant.quotation()） ====================
    var C = {
        // quotationFunctionAreaItem.type
        TYPE_COMMON_INT: 0, TYPE_CUSTOM_INT: 1, TYPE_TRAFFIC_INT: 2, TYPE_MANAGE_INT: 3,
        TYPE_IGNORE_INT: 4, TYPE_COST_INT: 5, TYPE_UNACHE_INT: 6, TYPE_HIDE_INT: 7,
        TYPE_TAX_INT: 8, TYPE_CMPREH_INT: 9,
        // quotationFunctionAreaItem.discount
        DISCOUNT_NODISCOUNT_INT: 0, DISCOUNT_DISCOUNT_INT: 1,
        // quotationFunctionArea.type
        FA_TYPE_MANAGE_INT: 0, FA_TYPE_PROJECT_NUM_INT: 1, FA_TYPE_FUNCTIONAREA_TOTAL_INT: 2,
        FA_TYPE_NOT_COUNT_INT: 3, FA_TYPE_COST_INT: 4, FA_TYPE_UNACHE_INT: 5, FA_TYPE_HIDE_INT: 6, FA_TYPE_CMPREH_INT: 7,
        // extension
        EXTENSION_TYPE_ADD_INT: 0, EXTENSION_TYPE_SUB_INT: 1, EXTENSION_ATTTYPE_ACTIVITY_INT: 4,
        // addreduce
        ADDREDUCE_TYPE_ADD_INT: 0, ADDREDUCE_TYPE_REDUCE_INT: 1,
        // data.quotationVersion
        MANAGE_DISCOUNT_INT: 1, TRAFFIC_DISCOUNT_INT: 1, TAX_NODISCOUNT_INT: 1, TAX_DISCOUNT_INT: 2,
        // selectionItem.type
        SELECTION_TYPE_QUOTATION_INT: 0, SELECTION_TYPE_EXTENSIONADD_INT: 1, SELECTION_TYPE_EXTENSIONMINUS_INT: 2,
        SELECTION_TYPE_ADDITEM_INT: 3, SELECTION_TYPE_MINUSITEM_INT: 4, SELECTION_TYPE_ALONE_INT: 5,
        // protationItem.type（基础/工程/主材…，见 ENUM.protationItemType）
        PROTAION_TYPE_BASE_INT: 0, PROTAION_TYPE_PROJECT_INT: 1, PROTAION_TYPE_PRINCIPAL_INT: 2,
        PROTAION_TYPE_PRCURRENT_INT: 9, PROTAION_TYPE_CUTCURRENT_INT: 11
    };

    // ==================== 通用 UI 辅助 ====================

    function statusColor(key) {
        key = parseInt(key, 10);
        if (key === 0) return 'layui-bg-blue';
        if (key === 1) return 'layui-bg-green';
        if (key === 2) return 'layui-bg-orange';
        if (key === 3) return 'layui-bg-gray';
        return 'layui-bg-cyan';
    }

    /** 状态徽章。用法：quotationCommon.badge(ENUM.quotationStatus, v.status) */
    function badge(map, key, colorFn) {
        var text = map[key] != null ? map[key] : (key != null && key !== '' ? key : '-');
        var cls = colorFn ? colorFn(key) : statusColor(key);
        return '<span class="layui-badge ' + cls + '">' + text + '<\/span>';
    }

    /** 构造后端 filters[N].* 参数（表单字段规则：name=filter.field，data-op=操作符，缺省 cn） */
    function buildFilters($form) {
        var $ = layui.jquery;
        var params = {}, count = 0;
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

    /** 空值兜底（对齐旧 com.checkNull） */
    function checkNull(obj, rep) {
        return obj == null || obj === '' ? (rep != null ? rep : 0) : obj;
    }

    /** 金额显示（÷1000 由 post 层 tranargs 完成，此处只做分位格式化） */
    function money(v) {
        return app.formatMoney(v);
    }

    /** handoff 槽位读取（弹窗页优先读父页 app.params，本页兜底） */
    function ctx(slot) {
        try {
            if (window.parent && window.parent.app && window.parent.app.params && window.parent.app.params[slot]) {
                return window.parent.app.params[slot];
            }
        } catch (e) { /* 跨域忽略 */ }
        return app.params[slot];
    }

    var utils = function () { return window.app ? app.utils : null; };

    // ==================== 计算引擎（移植旧 quotationUtils） ====================

    /** 报价项按 index 排序（index 缺失降序，存在升序） */
    function sortQuo(items) {
        return (items || []).sort(function (a, b) {
            if (a.index == null || b.index == null) return b.index - a.index;
            return a.index - b.index;
        });
    }

    /**
     * 统计报价项/扩展项/增减项各项总额 → 写入 detail 上下文。
     * 对齐旧 quotationUtils.statisticalQuotationItem。
     */
    function statisticalQuotationItem(detail, quotationFunctionAreas, addReduces, extensions) {
        var u = utils();
        var $quotationUndisPrice = 0, $quotationTotalPrice = 0, $quotationCostPrice = 0;
        var $addExtensionItemTotalPrice = 0, $minusExtensionItemTotalPrice = 0;
        var $extensionTotalPrice = 0, $extensionManagePrice = 0, $extensionTaxPrice = 0, $extensionActivityTotal = 0;
        var $addReduceTotal = 0, $minusQuoTotalPrice = 0, $minusQuoUndisPrice = 0, $minusAddReduceTotal = 0, $minusExtensionTotalPrice = 0;
        var $addReduceTotalPrice = 0, $addReduceManagePrice = 0;

        for (var i = 0; i < (quotationFunctionAreas || []).length; i++) {
            var area = quotationFunctionAreas[i];
            var items = sortQuo(area.quotationFunctionAreaItems);
            var _disPrice = 0, _undisPrice = 0, _costPrice = 0;

            for (var j = 0; j < items.length; j++) {
                var item = items[j];
                if ([C.TYPE_COMMON_INT, C.TYPE_CUSTOM_INT, C.TYPE_UNACHE_INT, C.TYPE_HIDE_INT, C.TYPE_CMPREH_INT].indexOf(item.type) != -1) {
                    if (item.discount == C.DISCOUNT_NODISCOUNT_INT) {
                        _disPrice = u.accAdd(_disPrice, u.accMul(item.unitPrice, item.initNum));
                    } else if (item.discount == C.DISCOUNT_DISCOUNT_INT) {
                        _undisPrice = u.accAdd(_undisPrice, u.accMul(item.unitPrice, item.initNum));
                    }
                }
                if (item.type == C.TYPE_COST_INT) {
                    _costPrice = u.accAdd(_costPrice, u.accMul(item.unitPrice, item.initNum));
                }
            }

            if (area.type == C.FA_TYPE_PROJECT_NUM_INT || area.type == C.FA_TYPE_CMPREH_INT) {
                $quotationUndisPrice = u.accAdd($quotationUndisPrice, _undisPrice);
                $quotationTotalPrice = u.accAdd($quotationTotalPrice, _disPrice);
                $quotationCostPrice = u.accAdd($quotationCostPrice, _costPrice);
            } else if (area.type == C.FA_TYPE_FUNCTIONAREA_TOTAL_INT) {
                $quotationUndisPrice = u.accAdd($quotationUndisPrice, area.total);
            } else if (area.type == C.FA_TYPE_COST_INT) {
                $quotationUndisPrice = u.accAdd($quotationUndisPrice, area.total);
                $quotationCostPrice = u.accAdd($quotationCostPrice, area.total);
            }
        }

        if (extensions != null && extensions.length != 0) {
            for (var i2 = 0; i2 < extensions.length; i2++) {
                var extension = extensions[i2];
                var extensionItems = extension.extensionItems;

                if (extensionItems == null || extensionItems.length == 0 || extension.atttype == C.EXTENSION_ATTTYPE_ACTIVITY_INT) {
                    $extensionActivityTotal = u.accAdd($extensionActivityTotal, u.accMul(extension.total, extension.type == 0 ? 1 : -1));
                    continue;
                }
                for (var j2 = 0; j2 < extensionItems.length; j2++) {
                    var eItem = extensionItems[j2];
                    if ([0, 1, 5].indexOf(eItem.type) != -1) {
                        $addExtensionItemTotalPrice = u.accAdd($addExtensionItemTotalPrice, u.changeThrDecimal(u.accMul(eItem.num, eItem.unitPrice)));
                    } else if ([2, 3, 4].indexOf(eItem.type) != -1) {
                        var _dcp = u.changeThrDecimal(u.accMul(eItem.unitPrice, u.accDiv(detail.quotation.discount, 10)));
                        $minusExtensionItemTotalPrice = u.accAdd($minusExtensionItemTotalPrice, u.changeThrDecimal(u.accMul(eItem.num, _dcp)));
                    }
                }
                $extensionTotalPrice = u.accAdd($extensionTotalPrice, u.accMul(extension.total, extension.type == 0 ? 1 : -1));
                $extensionManagePrice = u.accAdd($extensionManagePrice, u.accMul(extension.managePrice, extension.type == 0 ? 1 : -1));
                $extensionTaxPrice = u.accAdd($extensionTaxPrice, u.accMul(extension.taxPrice, extension.type == 0 ? 1 : -1));
            }
        }

        if (addReduces != null && addReduces.length != 0) {
            for (var i3 = 0; i3 < addReduces.length; i3++) {
                var addReduce = addReduces[i3];
                var addReduceItems = addReduce.addReduceItems;
                if (addReduceItems == null || addReduceItems.length == 0) continue;

                for (var j3 = 0; j3 < addReduceItems.length; j3++) {
                    var arItem = addReduceItems[j3];
                    if ([0, 2].indexOf(arItem.type) != -1) {
                        $addReduceTotal = u.accAdd($addReduceTotal, u.changeThrDecimal(u.accMul(arItem.num, arItem.unitPrice)));
                    } else {
                        var num = -arItem.num;
                        var price = u.changeThrDecimal(u.accMul(num, arItem.unitPrice));
                        if (arItem.type == 4 || arItem.type == 5) {
                            if (arItem.type == 4) $minusAddReduceTotal = u.accAdd($minusAddReduceTotal, price);
                            else $minusExtensionTotalPrice = u.accAdd($minusExtensionTotalPrice, price);
                        } else if (detail.orderType == 2) {
                            $minusQuoUndisPrice = u.accAdd($minusQuoUndisPrice, price);
                        } else {
                            if ([0, 2].indexOf(arItem.discount) != -1) $minusQuoTotalPrice = u.accAdd($minusQuoTotalPrice, price);
                            else $minusQuoUndisPrice = u.accAdd($minusQuoUndisPrice, price);
                        }
                    }
                }
                $addReduceTotalPrice = u.accAdd($addReduceTotalPrice, u.accMul(addReduce.total, addReduce.type == 0 ? 1 : -1));
                $addReduceManagePrice = u.accAdd($addReduceManagePrice, u.accMul(addReduce.managePrice, addReduce.type == 0 ? 1 : -1));
            }
        }

        detail.quotationUndisPrice = $quotationUndisPrice;
        detail.quotationTotalPrice = $quotationTotalPrice;
        detail.addExtensionItemTotalPrice = $addExtensionItemTotalPrice;
        detail.minusExtensionItemTotalPrice = $minusExtensionItemTotalPrice;
        detail.extensionTotalPrice = $extensionTotalPrice;
        detail.extensionManagePrice = $extensionManagePrice;
        detail.extensionTaxPrice = $extensionTaxPrice;
        detail.extensionActivityTotal = $extensionActivityTotal;
        detail.addReduceTotal = $addReduceTotal;
        detail.minusQuoTotalPrice = $minusQuoTotalPrice;
        detail.minusQuoUndisPrice = $minusQuoUndisPrice;
        detail.minusAddReduceTotal = $minusAddReduceTotal;
        detail.minusExtensionTotalPrice = $minusExtensionTotalPrice;
        detail.addReduceTotalPrice = $addReduceTotalPrice;
        detail.addReduceManagePrice = $addReduceManagePrice;
    }

    /**
     * 初始化报价明细项（折扣单价/折扣总额/工种分组），产出：
     *   detail.quotationFunctionAreaItemCs —— 功能区分组项
     *   detail.quotationFunctionAreaItemWs —— 工种分组项（quotationDataProcessing 内）
     * 对齐旧 quotationUtils.initQuotationDetailItem。
     * @param {Object} detail 上下文（quotation 含 decoration）
     * @param {Boolean} dataProcessing 同项合并
     * @param {Number} showType.itemtype 位标志：1 报价项 2 扩展项 4 增减项 8 隞业绩 16 管理区 32 优惠
     */
    function initQuotationDetailItem(detail, quotation, quotationFunctionAreas, addReduces, extensions, quotationPrefer, orderType, dataProcessing, showType) {
        var u = utils();
        var extensionItemTypes = { 0: '标准增(扩展)', 1: '定义增(扩展)', 2: '标准减(扩展)', 3: '定义减(扩展)', 4: '报价减(扩展)', 5: '报价增(扩展)', 6: '报价项(扩展活动)' };
        var addReduceItemTypes = { 0: '标准增(增减)', 1: '系统增(增减)', 2: '定义增(增减)', 3: '报价减(增减)', 4: '增项减(增减)', 5: '扩展减(增减)' };

        var $decorationtype = orderType;
        var discount = quotation.discount;
        var itemCs = {};
        var itemWs = {};
        var reduceNums = { ariId: {}, eiId: {}, qfaiId: {} };

        for (var i = 0; i < quotationFunctionAreas.length; i++) {
            var area = quotationFunctionAreas[i];
            if (area.functionAreaOrder == 9999 && (showType.itemtype & 16) != 16) continue;

            var items = sortQuo(area.quotationFunctionAreaItems);
            itemCs[area.qfaId + '-' + area.functionAreaName] = [];

            for (var j = 0; j < items.length; j++) {
                var item = items[j];
                if (item.type != 5 && (showType.itemtype & 1) != 1) continue;
                if (item.type == 5 && (showType.itemtype & 8) != 8) continue;

                if (!itemWs[item.workType]) itemWs[item.workType] = {};

                var _price = 0, _dcp = 0, _dcpt = 0, _discountNum = 10, _total = 0;
                item.typestr = '-';

                if (item.type == C.TYPE_COMMON_INT) { item.typestr = '标准'; item.discount = $decorationtype == 2 ? 1 : item.discount; }
                if (item.type == C.TYPE_CUSTOM_INT) { item.typestr = '自定义'; item.discount = $decorationtype == 2 ? 1 : item.discount; }
                if (item.type == C.TYPE_TRAFFIC_INT) { item.typestr = '管理'; item.discount = $decorationtype == 2 ? 1 : item.discount; }
                if (item.type == C.TYPE_MANAGE_INT) { item.typestr = '管理'; }
                if (item.type == C.TYPE_TAX_INT) { item.typestr = '管理'; }
                if (item.type == C.TYPE_IGNORE_INT) { item.typestr = '不计'; item.discount = 0; }
                if (item.type == C.TYPE_COST_INT) { item.typestr = '标准'; item.discount = 0; }
                if (item.type == C.TYPE_UNACHE_INT) { item.typestr = '标准'; item.discount = $decorationtype == 2 ? 1 : item.discount; }
                if (item.type == C.TYPE_CMPREH_INT) { item.typestr = '综合'; }

                if (item.discount == 1) _discountNum = discount;

                if ([0, 1, 6, 7, 9].indexOf(item.type) != -1) {
                    _price = item.unitPrice;
                    _dcp = u.changeThrDecimal(u.accMul(item.unitPrice, u.accDiv(_discountNum, 10)));
                    _dcpt = u.changeThrDecimal(u.accMul(item.initNum, _dcp));
                    _total = u.changeThrDecimal(u.accMul(item.initNum, item.unitPrice));
                }

                item.suptype = 1;
                item.price = _price;
                item.num = item.initNum;
                item.dcp = _dcp;
                item.dcpt = _dcpt;
                item._discountNum = _discountNum;
                item.total = _total;
                item.quotationTotalPrice = _dcpt;

                if (area.type == C.FA_TYPE_NOT_COUNT_INT) {
                    item._discountNum = 0; item.quotationTotalPrice = 0; item.dcp = 0; item.dcpt = 0;
                }

                if (item.type == C.TYPE_TRAFFIC_INT) {
                    detail.trafficDiscount = item.discount;
                    item.price = item.unitPrice;
                    item.num = quotation.trafficPrice;
                    item.dcpt = item.discount == C.DISCOUNT_DISCOUNT_INT || $decorationtype == 2 ? u.changeThrDecimal(u.accMul(quotation.trafficPrice, u.accDiv(discount, 10))) : quotation.trafficPrice;
                    item.dcp = item.unitPrice;
                    item.measurementUnit = '车运费';
                    item.quotationTotalPrice = quotation.trafficPrice;
                    item.total = quotation.trafficPrice;
                } else if (item.type == C.TYPE_MANAGE_INT) {
                    detail.manageDiscount = item.discount;
                    item.num = quotation.managePrice;
                    item.measurementUnit = '管理费';
                    item.dcpt = item.discount == C.DISCOUNT_DISCOUNT_INT ? u.changeThrDecimal(u.accMul(quotation.managePrice, u.accDiv(discount, 10))) : quotation.managePrice;
                    item._discountNum = item.discount == C.DISCOUNT_DISCOUNT_INT ? _discountNum : 10;
                    item.dcp = u.changeThrDecimal(u.accAdd(item.unitPrice, (quotation.decoration.notSalesmanRate > 0 && quotation.decoration.notSalesmanRate < 1) ? quotation.decoration.notSalesmanRate : 0));
                    item.unitPrice = u.changeThrDecimal(u.accAdd(item.unitPrice, (quotation.decoration.notSalesmanRate > 0 && quotation.decoration.notSalesmanRate < 1) ? quotation.decoration.notSalesmanRate : 0));
                    item.price = item.unitPrice;
                    item.quotationTotalPrice = quotation.managePrice;
                    item.total = quotation.managePrice;
                } else if (item.type == C.TYPE_TAX_INT) {
                    detail.taxDiscount = item.discount;
                    item.num = quotation.taxPrice;
                    item.dcpt = item.discount == C.DISCOUNT_DISCOUNT_INT ? u.changeThrDecimal(u.accMul(quotation.taxPrice, u.accDiv(discount, 10))) : quotation.taxPrice;
                    item.dcp = item.unitPrice;
                    item.measurementUnit = '税金';
                    item.price = item.unitPrice;
                    item.quotationTotalPrice = quotation.taxPrice;
                    item.total = quotation.taxPrice;
                }

                if (item.type != C.TYPE_HIDE_INT) itemCs[area.qfaId + '-' + area.functionAreaName].push(item);
            }
        }

        if ((showType.itemtype & 16) == 16) {
            itemCs['-扩展项目'] = [];
            itemCs['-增减项目'] = [];
        }

        if ((showType.itemtype & 2) == 2 && extensions != null && extensions.length != 0) {
            for (var ie = 0; ie < extensions.length; ie++) {
                var extension = extensions[ie];
                var extensionItems = extension.extensionItems;
                if (extensionItems != null && extensionItems.length != 0) {
                    for (var je = 0; je < extensionItems.length; je++) {
                        var eItem = extensionItems[je];
                        var edcp = 0, edcpt = 0;
                        if ([0, 1, 5].indexOf(eItem.type) != -1) {
                            eItem._discountNum = 10;
                            edcp = eItem.unitPrice;
                            edcpt = u.changeThrDecimal(u.accMul(edcp, eItem.num));
                        } else if ([2, 3, 4].indexOf(eItem.type) != -1) {
                            eItem.unitPrice = -eItem.unitPrice;
                            eItem._discountNum = discount;
                            edcp = u.changeThrDecimal(u.accMul(eItem.unitPrice, u.accDiv(discount, 10)));
                            edcpt = u.changeThrDecimal(u.accMul(u.accMul(eItem.unitPrice, eItem.num), u.accDiv(discount, 10)));
                        }
                        eItem.suptype = 2;
                        eItem.typestr = extensionItemTypes[eItem.type];
                        eItem.extensionAtttype = extension.atttype;
                        eItem.price = eItem.unitPrice;
                        eItem.dcp = edcp;
                        eItem.dcpt = edcpt;
                        eItem.quotationTotalPrice = u.changeThrDecimal(u.accMul(eItem.unitPrice, eItem.num));
                        eItem.total = eItem.quotationTotalPrice;
                        if (extension.atttype == C.EXTENSION_ATTTYPE_ACTIVITY_INT) {
                            eItem.typestr = extensionItemTypes[6];
                            eItem.quotationTotalPrice = 0;
                        }
                        if (itemCs[eItem.quotationFunctionAreaId + '-' + eItem.quotationFunctionAreaName] == undefined) {
                            itemCs[eItem.quotationFunctionAreaId + '-' + eItem.quotationFunctionAreaName] = [];
                        }
                        if (itemCs[eItem.quotationFunctionAreaId + '-' + eItem.quotationFunctionAreaName]) {
                            itemCs[eItem.quotationFunctionAreaId + '-' + eItem.quotationFunctionAreaName].push(eItem);
                        }
                    }
                }
                if (extension.type == C.EXTENSION_TYPE_SUB_INT) {
                    extension.managePrice = -extension.managePrice;
                    extension.taxPrice = -extension.taxPrice;
                }
                if (itemCs['-扩展项目'] && extension.manageRate != 0 && extension.managePrice != 0) {
                    itemCs['-扩展项目'].push({ subtype: 0, suptype: 2, typestr: '管理', workType: '其他', itemName: '管理费', num: extension.managePrice, measurementUnit: '管理费', _discountNum: extension.manageDiscount, unitPrice: extension.manageRate, price: extension.managePrice, quotationTotalPrice: extension.managePrice, total: extension.managePrice });
                }
                if (itemCs['-扩展项目'] && extension.taxRate != 0 && extension.taxPrice != 0) {
                    itemCs['-扩展项目'].push({ subtype: 0, suptype: 2, typestr: '管理', workType: '其他', itemName: '税金', num: extension.taxPrice, measurementUnit: '税金', _discountNum: detail.quotation.taxDiscount, unitPrice: extension.taxRate, price: extension.taxPrice, quotationTotalPrice: extension.taxPrice, total: extension.taxPrice });
                }
            }
        }

        if ((showType.itemtype & 4) == 4 && addReduces != null && addReduces.length != 0) {
            for (var ia = 0; ia < addReduces.length; ia++) {
                var addReduce = addReduces[ia];
                var addReduceItems = addReduce.addReduceItems;
                if (addReduceItems != null && addReduceItems.length != 0) {
                    for (var ja = 0; ja < addReduceItems.length; ja++) {
                        var aItem = addReduceItems[ja];

                        if (aItem.type == 4) {
                            if (reduceNums.ariId[aItem.quoteItemId]) {
                                reduceNums.ariId[aItem.quoteItemId].num = u.accAdd(reduceNums.ariId[aItem.quoteItemId].num, aItem.num);
                            } else {
                                reduceNums.ariId[aItem.quoteItemId] = { num: aItem.num, quotationFunctionType: aItem.quotationFunctionAreaType };
                            }
                        }
                        if (aItem.type == 5) {
                            if (reduceNums.eiId[aItem.quoteItemId]) {
                                reduceNums.eiId[aItem.quoteItemId].num = u.accAdd(reduceNums.eiId[aItem.quoteItemId].num, aItem.num);
                            } else {
                                reduceNums.eiId[aItem.quoteItemId] = { num: aItem.num, quotationFunctionType: aItem.quotationFunctionAreaType };
                            }
                        }
                        if (addReduce.type == 1) aItem.num = -aItem.num;

                        var aDiscountNum = addReduce.discount;
                        var adcp = [1, 3].indexOf(aItem.discount) != -1 ? u.changeThrDecimal(u.accMul(aItem.unitPrice, u.accDiv(addReduce.discount, 10))) : aItem.unitPrice;
                        var adcpt = u.changeThrDecimal(u.accMul(aItem.num, adcp));

                        aItem.suptype = 3;
                        aItem.typestr = addReduceItemTypes[aItem.type];
                        aItem.quotationTotalPrice = u.changeThrDecimal(u.accMul(aItem.num, aItem.unitPrice));
                        aItem.total = aItem.quotationTotalPrice;
                        aItem.price = aItem.unitPrice;
                        aItem.dcp = adcp;
                        aItem.dcpt = adcpt;
                        aItem._discountNum = aDiscountNum;

                        if (itemCs[aItem.quotationFunctionAreaId + '-' + aItem.quotationFunctionAreaName] == undefined) {
                            itemCs[aItem.quotationFunctionAreaId + '-' + aItem.quotationFunctionAreaName] = [];
                        }
                        if (itemCs[aItem.quotationFunctionAreaId + '-' + aItem.quotationFunctionAreaName]) {
                            itemCs[aItem.quotationFunctionAreaId + '-' + aItem.quotationFunctionAreaName].push(aItem);
                        }
                    }
                }
                if (addReduce.type == C.ADDREDUCE_TYPE_REDUCE_INT) {
                    addReduce.managePrice = -addReduce.managePrice;
                    addReduce.taxPrice = -addReduce.taxPrice;
                }
                if (itemCs['-增减项目'] && addReduce.manageRate != 0 && addReduce.managePrice != 0) {
                    itemCs['-增减项目'].push({ subtype: 0, suptype: 3, typestr: '管理', workType: '其他', itemName: '管理费', num: addReduce.managePrice, measurementUnit: '管理费', _discountNum: addReduce.manageDiscount, unitPrice: addReduce.manageRate, price: addReduce.managePrice, quotationTotalPrice: addReduce.managePrice, total: addReduce.managePrice });
                }
                if (itemCs['-增减项目'] && addReduce.taxRate != 0 && addReduce.taxPrice != 0) {
                    itemCs['-增减项目'].push({ subtype: 0, suptype: 3, typestr: '管理', workType: '其他', itemName: '税金', num: addReduce.taxPrice, measurementUnit: '税金', _discountNum: addReduce.taxDiscount, unitPrice: addReduce.taxRate, price: addReduce.taxPrice, quotationTotalPrice: addReduce.taxPrice, total: addReduce.taxPrice });
                }
            }
        }

        if ((showType.itemtype & 32) == 32) itemCs['-优惠项目'] = [];

        if (itemCs['-优惠项目'] && quotationPrefer && quotationPrefer.qpid != null) {
            itemCs['-优惠项目'].push(
                { subtype: null, suptype: 1, typestr: '优惠', workType: '其他', itemName: '优惠额', num: quotationPrefer.preferPrice, measurementUnit: '优惠额', _discountNum: '-', unitPrice: quotationPrefer.preferPrice, price: quotationPrefer.preferPrice, quotationTotalPrice: quotationPrefer.preferPrice, total: quotationPrefer.preferPrice },
                { subtype: null, suptype: 1, typestr: '优惠', workType: '其他', itemName: '管理优惠', num: quotationPrefer.managePrefer, measurementUnit: '管理优惠', _discountNum: '-', unitPrice: quotationPrefer.managePrefer, price: quotationPrefer.managePrefer, quotationTotalPrice: quotationPrefer.managePrefer, total: quotationPrefer.managePrefer },
                { subtype: null, suptype: 1, typestr: '优惠', workType: '其他', itemName: '特殊优惠', num: quotationPrefer.advancePrefer, measurementUnit: '特殊优惠', _discountNum: '-', unitPrice: quotationPrefer.advancePrefer, price: quotationPrefer.advancePrefer, quotationTotalPrice: quotationPrefer.advancePrefer, total: quotationPrefer.advancePrefer });
        }

        quotationDataProcessing(detail, itemCs, reduceNums, dataProcessing);
    }

    /** 明细分组后处理（工种归并 + 减项数量冲抵）。对齐旧 quotationUtils.quotationDataProcessing。 */
    function quotationDataProcessing(detail, itemCs, reduceNums, dataProcessing) {
        var u = utils();
        var itemWs = {};
        var index = 0;

        layui.jquery.each(itemCs, function (i, v) {
            var areaName = i.split('-')[1];
            layui.jquery.each(v, function (j, qv) {
                if (qv['quoteItemId']) {
                    qv['quotationItemId'] = qv['quoteItemId'];
                    delete qv['quoteItemId'];
                }
                if (!itemWs['-' + qv.workType]) itemWs['-' + qv.workType] = {};
                qv['areaName'] = areaName;

                if (dataProcessing) {
                    if (itemWs['-' + qv.workType][qv.quotationItemId] && qv.quotationItemId != 0 && qv.quotationItemId) {
                        itemWs['-' + qv.workType][qv.quotationItemId].num = u.changeThrDecimal(u.accAdd(itemWs['-' + qv.workType][qv.quotationItemId].num, qv.num));
                        itemWs['-' + qv.workType][qv.quotationItemId].dcp = u.changeThrDecimal(u.accAdd(itemWs['-' + qv.workType][qv.quotationItemId].dcp, qv.dcp));
                        itemWs['-' + qv.workType][qv.quotationItemId].dcpt = u.changeThrDecimal(u.accAdd(itemWs['-' + qv.workType][qv.quotationItemId].dcpt, qv.dcpt));
                        itemWs['-' + qv.workType][qv.quotationItemId].quotationTotalPrice = u.changeThrDecimal(u.accAdd(itemWs['-' + qv.workType][qv.quotationItemId].quotationTotalPrice, qv.quotationTotalPrice));
                        itemWs['-' + qv.workType][qv.quotationItemId].total = u.changeThrDecimal(u.accAdd(itemWs['-' + qv.workType][qv.quotationItemId].total, qv.total));
                    } else if (qv.quotationItemId == 0 || !qv.quotationItemId) {
                        itemWs['-' + qv.workType]['customize' + index++] = layui.jquery.extend({}, qv);
                    } else {
                        itemWs['-' + qv.workType][qv.quotationItemId] = layui.jquery.extend({}, qv);
                    }
                } else {
                    if (qv.quotationItemId == 0 || !qv.quotationItemId) {
                        itemWs['-' + qv.workType]['customize' + index++] = layui.jquery.extend({}, qv);
                    } else {
                        itemWs['-' + qv.workType][qv.quotationItemId + '-' + index++] = layui.jquery.extend({}, qv);
                    }
                }

                if (qv.ariId && reduceNums.ariId[qv.ariId]) {
                    qv.num = u.accAdd(qv.num, reduceNums.ariId[qv.ariId].num);
                    qv.dcpt = u.changeThrDecimal(u.accMul(qv.num, qv.dcp));
                    qv.total = qv.dcpt;
                    qv.quotationTotalPrice = u.changeThrDecimal(u.accMul(qv.num, qv.unitPrice));
                } else if (qv.eiid && reduceNums.eiId[qv.eiid]) {
                    qv.num = u.accAdd(qv.num, reduceNums.eiId[qv.eiid].num);
                    qv.dcpt = u.changeThrDecimal(u.accMul(qv.num, qv.dcp));
                    qv.total = qv.dcpt;
                    qv.quotationTotalPrice = u.changeThrDecimal(u.accMul(qv.num, qv.unitPrice));
                }
            });
        });

        detail.quotationFunctionAreaItemWs = itemWs;
        detail.quotationFunctionAreaItemCs = itemCs;
    }

    /** 工费定额按施工节点分组（1 报价/2 扩展/3 增减）。对齐旧 quotationNormriceProcessing。 */
    function quotationNormriceProcessing(detail, quotationFunctionAreas, extensions, addreduces) {
        var itemMs = {};
        layui.jquery.each(quotationFunctionAreas || [], function (i, v) {
            layui.jquery.each(v.quotationFunctionAreaItems || [], function (j, qv) {
                var normrice = qv.normrice;
                qv.quotationFunctionAreaId = v.qfaid || v.qfaId;
                qv.quotationFunctionAreaName = v.functionAreaName;
                var key = normrice.constructionNode.cnid + '-' + normrice.constructionNode.name + '-1';
                if (!itemMs[key]) itemMs[key] = [qv]; else itemMs[key].push(qv);
            });
        });
        layui.jquery.each(extensions || [], function (i, v) {
            layui.jquery.each(v.extensionItems || [], function (j, qv) {
                var normrice = qv.normrice;
                qv.initNum = [0, 1, 5].indexOf(qv.type) != -1 ? qv.initnum : -qv.initnum;
                var key = normrice.constructionNode.cnid + '-' + normrice.constructionNode.name + '-2';
                if (!itemMs[key]) itemMs[key] = [qv]; else itemMs[key].push(qv);
            });
        });
        layui.jquery.each(addreduces || [], function (i, v) {
            layui.jquery.each(v.addReduceItems || [], function (j, qv) {
                var normrice = qv.normrice;
                qv.initNum = [0, 1, 2].indexOf(qv.type) != -1 ? qv.initnum : -qv.initnum;
                var key = normrice.constructionNode.cnid + '-' + normrice.constructionNode.name + '-3';
                if (!itemMs[key]) itemMs[key] = [qv]; else itemMs[key].push(qv);
            });
        });
        detail.quotationFunctionAreaItemMs = itemMs;
    }

    /** 工时定额按施工节点分组。对齐旧 quotationNormtimeProcessing。 */
    function quotationNormtimeProcessing(detail, quotationFunctionAreas, extensions, addreduces) {
        var itemMs = {};
        layui.jquery.each(quotationFunctionAreas || [], function (i, v) {
            layui.jquery.each(v.quotationFunctionAreaItems || [], function (j, qv) {
                var normtime = qv.normtime;
                qv.quotationFunctionAreaId = v.qfaid || v.qfaId;
                qv.quotationFunctionAreaName = v.functionAreaName;
                var key = normtime.constructionNode.cnid + '-' + normtime.constructionNode.name + '-1';
                if (!itemMs[key]) itemMs[key] = [qv]; else itemMs[key].push(qv);
            });
        });
        layui.jquery.each(extensions || [], function (i, v) {
            layui.jquery.each(v.extensionItems || [], function (j, qv) {
                var normtime = qv.normtime;
                qv.initNum = [0, 1, 5].indexOf(qv.type) != -1 ? qv.initnum : -qv.initnum;
                var key = normtime.constructionNode.cnid + '-' + normtime.constructionNode.name + '-2';
                if (!itemMs[key]) itemMs[key] = [qv]; else itemMs[key].push(qv);
            });
        });
        layui.jquery.each(addreduces || [], function (i, v) {
            layui.jquery.each(v.addReduceItems || [], function (j, qv) {
                var normtime = qv.normtime;
                qv.initNum = [0, 1, 2].indexOf(qv.type) != -1 ? qv.initnum : -qv.initnum;
                var key = normtime.constructionNode.cnid + '-' + normtime.constructionNode.name + '-3';
                if (!itemMs[key]) itemMs[key] = [qv]; else itemMs[key].push(qv);
            });
        });
        detail.quotationFunctionAreaItemMs = itemMs;
    }

    /** 材料定额按货品归并数量。对齐旧 quotationNormoodProcessing。 */
    function quotationNormoodProcessing(detail, quotationFunctionAreas, extensions, addreduces, normoods) {
        var u = utils();
        var itemAs = {};
        function merge(normood) {
            var key = normood.noods.nid + '-';
            if (!itemAs[key]) itemAs[key] = normood;
            else {
                itemAs[key].normnum = u.accAdd(itemAs[key].normnum, normood.normnum);
                itemAs[key].storenum = u.accAdd(itemAs[key].storenum, normood.storenum);
            }
        }
        layui.jquery.each(quotationFunctionAreas || [], function (i, v) {
            layui.jquery.each(v.quotationFunctionAreaItems || [], function (j, qv) {
                var normood = qv.normood;
                normood.normnum = u.accMul(normood.normnum, qv.initNum);
                normood.storenum = u.accMul(normood.storenum, qv.initNum);
                merge(normood);
            });
        });
        layui.jquery.each(extensions || [], function (i, v) {
            layui.jquery.each(v.extensionItems || [], function (j, qv) {
                var normood = qv.normood;
                var usenum = [0, 1, 5].indexOf(qv.type) != -1 ? qv.num : -qv.num;
                normood.normnum = u.accMul(normood.normnum, usenum);
                normood.storenum = u.accMul(normood.storenum, usenum);
                merge(normood);
            });
        });
        layui.jquery.each(addreduces || [], function (i, v) {
            layui.jquery.each(v.addReduceItems || [], function (j, qv) {
                var normood = qv.normood;
                var usenum = [0, 1, 2].indexOf(qv.type) != -1 ? qv.num : -qv.num;
                normood.normnum = u.accMul(normood.normnum, usenum);
                normood.storenum = u.accMul(normood.storenum, usenum);
                merge(normood);
            });
        });
        layui.jquery.each(normoods || [], function (j, qv) { merge(qv); });
        detail.quotationFunctionAreaItemAs = itemAs;
    }

    /** 主材配比价格。对齐旧 quotationUtils.quotationMaterial。 */
    function quotationMaterial(detail, mm) {
        var u = utils();
        var total = u.accAdd(u.accAdd(u.accAdd(detail.quotationUndisPrice, detail.quotationTotalPrice), detail.quotation.managePrice), detail.quotation.trafficPrice);
        return u.changeTwoDecimal(u.accMul(total, mm));
    }

    /** 工程额计算。对齐旧 quotationUtils.quotationCalculator。 */
    function quotationCalculator(detail, discount, basePrice) {
        var u = utils();
        var $quotationPrefer = detail.quotationPrefer || {};
        var $managePrice = detail.manageDiscount == C.MANAGE_DISCOUNT_INT ? u.changeThrDecimal(u.accMul(detail.quotation.managePrice, u.accDiv(discount, 10))) : detail.quotation.managePrice;
        var $trafficPrice = detail.trafficDiscount == C.TRAFFIC_DISCOUNT_INT ? u.changeThrDecimal(u.accMul(detail.quotation.trafficPrice, u.accDiv(discount, 10))) : detail.quotation.trafficPrice;
        var $taxPrice = detail.quotation.taxPrice;
        var $Total = 0;
        var $manageDiscount = detail.manageDiscount == C.MANAGE_DISCOUNT_INT ? u.accDiv(discount, 10) : 1;

        if (detail.taxDiscount == C.TAX_NODISCOUNT_INT) {
            $taxPrice = u.changeThrDecimal(u.accMul($taxPrice, $manageDiscount));
        } else if (detail.taxDiscount == C.TAX_DISCOUNT_INT) {
            $taxPrice = $taxPrice;
        }

        if (basePrice && basePrice != 0) {
            var total = u.accAdd(u.accAdd(detail.quotationUndisPrice, detail.quotationTotalPrice), detail.quotation.trafficPrice);
            var remainder = total % basePrice;
            var _dicProjectPrice = u.changeThrDecimal(u.accSub(u.accSub(u.accSub(u.accAdd(u.accAdd(u.accAdd(u.accMul(u.accSub(total, remainder), u.accDiv(discount, 10)), remainder), $managePrice), $taxPrice), checkNull($quotationPrefer.preferPrice)), checkNull($quotationPrefer.managePrefer)), checkNull($quotationPrefer.advancePrefer)));
            $Total = u.changeThrDecimal(u.accAdd(_dicProjectPrice, detail.addReduceTotalPrice));
        } else {
            var quotationTotal = u.accAdd(u.accMul(detail.quotationUndisPrice, u.accDiv(discount, 10)), detail.quotationTotalPrice);
            $Total = u.changeThrDecimal(u.accAdd(u.accAdd(quotationTotal, detail.addReduceTotalPrice), detail.extensionTotalPrice));
            $Total = u.changeThrDecimal(u.accSub(u.accSub(u.accSub(u.accAdd(u.accAdd(u.accAdd($Total, $managePrice), $trafficPrice), $taxPrice), checkNull($quotationPrefer.preferPrice)), checkNull($quotationPrefer.managePrefer)), checkNull($quotationPrefer.advancePrefer)));
        }
        return u.changeThrDecimal($Total);
    }

    /** 报价总额（不打折口径）。对齐旧 quotationUtils.quotationTotal。 */
    function quotationTotal(detail) {
        var u = utils();
        var $quotationPrefer = detail.quotationPrefer || {};
        var q = detail.quotation;
        var total = u.accAdd(u.accAdd(u.accAdd(u.accAdd(detail.quotationUndisPrice, detail.quotationTotalPrice), detail.addReduceTotalPrice), detail.extensionTotalPrice), u.accAdd(u.accAdd(q.managePrice, q.trafficPrice), q.taxPrice));
        total = u.accSub(u.accSub(u.accSub(total, checkNull($quotationPrefer.preferPrice)), checkNull($quotationPrefer.managePrefer)), checkNull($quotationPrefer.advancePrefer));
        return u.changeThrDecimal(total);
    }

    /**
     * 装载默认报价上下文（同步请求）。对齐旧 quotationUtils.loadQuotationDetail。
     * @returns {Object|null} detail（失败返回 null 并提示）
     */
    function loadQuotationDetail(orderId, orderType) {
        var detail = { orderType: orderType };
        app.post(api.quotation.queryQuotationForDefaultByOrderId, { 'quotation.orderId': orderId }, function (res) {
            detail.quotation = res.quotation;
        }, function () { app.showAlert(app.warning, '默认报价不存在'); }, false);

        if (!detail.quotation || !detail.quotation.qid) {
            app.showAlert(app.warning, '默认报价不存在');
            return null;
        }

        app.post(api.quotation.queryQuotationPrefer, { 'quotationPrefer.qid': detail.quotation.qid }, function (res) {
            detail.quotationPrefer = res.quotationPrefer;
        }, null, false);

        app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
            detail.quotation.decoration = res.decoration;
        }, null, false);

        app.post(api.quotation.queryQuotationFunctionAreaByQuotationId, { 'quotation.qid': detail.quotation.qid }, function (res) {
            detail.quotationFunctionAreas = res.quotationFunctionAreas;
        }, null, false);

        app.post(api.quotation.queryAddReduceByOrderId, { 'addReduce.orderId': orderId }, function (res) {
            detail.addReduces = res.addReduces;
        }, null, false);

        app.post(api.quotation.queryExtensionByOrderId, { 'extension.orderId': orderId }, function (res) {
            detail.extensions = res.extensions;
        }, null, false);

        app.post(api.quotation.queryProtationForDefaultByOrderId, { 'protation.orderId': orderId }, function (res) {
            detail.protation = res.protation;
        }, null, false);

        statisticalQuotationItem(detail, detail.quotationFunctionAreas, detail.addReduces, detail.extensions);
        initQuotationDetailItem(detail, detail.quotation, detail.quotationFunctionAreas, detail.addReduces, detail.extensions, detail.quotationPrefer, orderType, true, { itemtype: 31 });
        return detail;
    }

    // ==================== 公式变量（{a}~{k}… 中文变量名互转，对齐旧 quotationItem.js） ====================

    var FORMULA_CN_TO_PARAM = [
        [/\u53d6\u6574/g, '!'], [/\u5468\u957f/g, '{a}'], [/\u53cd\u8ba1\u4ef7\u9762\u79ef/g, '{j}'], [/\u8ba1\u4ef7\u9762\u79ef/g, '{k}'],
        [/\u9762\u79ef/g, '{b}'], [/\u4e3e\u67b6/g, '{c}'], [/\u6d1e\u9762/g, '{d}'], [/\u7a97\u9762/g, '{f}'],
        [/\u6881\u957f/g, '{h}'], [/\u6881\u9ad8/g, '{i}'], [/\u53c2\u6570/g, '{e}'], [/\u53d8\u91cf/g, '{g}'],
        [/\u697c\u5c42/g, '{o}'], [/\u7535\u68af/g, '{of}'], [/\u5de5\u7a0b\u91cf/g, '{w}'], [/\u7a0e\u91d1/g, '{u}'], [/\u7ba1\u7406\u8d39/g, '{v}'],
        [/\u4e0d\u6253\u6298\u603b\u989d/g, '{x}'], [/\u6253\u6298\u603b\u989d/g, '{y}'], [/\u8f66\u8fd0\u8d39/g, '{z}']
    ];
    var FORMULA_PARAM_TO_CN = [
        [/!/g, '\u53d6\u6574'], [/\{a\}/g, '\u5468\u957f'], [/\{j\}/g, '\u53cd\u8ba1\u4ef7\u9762\u79ef'], [/\{k\}/g, '\u8ba1\u4ef7\u9762\u79ef'],
        [/\{b\}/g, '\u9762\u79ef'], [/\{c\}/g, '\u4e3e\u67b6'], [/\{d\}/g, '\u6d1e\u9762'], [/\{f\}/g, '\u7a97\u9762'],
        [/\{h\}/g, '\u6881\u957f'], [/\{i\}/g, '\u6881\u9ad8'], [/\{e\}/g, '\u53c2\u6570'], [/\{g\}/g, '\u53d8\u91cf'],
        [/\{o\}/g, '\u697c\u5c42'], [/\{of\}/g, '\u7535\u68af'], [/\{w\}/g, '\u5de5\u7a0b\u91cf'], [/\{u\}/g, '\u7a0e\u91d1'], [/\{v\}/g, '\u7ba1\u7406\u8d39'],
        [/\{x\}/g, '\u4e0d\u6253\u6298\u603b\u989d'], [/\{y\}/g, '\u6253\u6298\u603b\u989d'], [/\{z\}/g, '\u8f66\u8fd0\u8d39']
    ];

    /** 公式：中文变量 → {a} 参数串 */
    function formulaToParam(formula) {
        var s = formula || '';
        for (var i = 0; i < FORMULA_CN_TO_PARAM.length; i++) s = s.replace(FORMULA_CN_TO_PARAM[i][0], FORMULA_CN_TO_PARAM[i][1]);
        return s;
    }

    /** 公式：{a} 参数串 → 中文变量 */
    function paramToFormula(param) {
        var s = param || '';
        for (var i = 0; i < FORMULA_PARAM_TO_CN.length; i++) s = s.replace(FORMULA_PARAM_TO_CN[i][0], FORMULA_PARAM_TO_CN[i][1]);
        return s;
    }

    /** 公式合法性试算（NaN/Infinity 视为失败） */
    function evals(formula) {
        var s = (formula || '').replace(/!\s*\(/g, 'Math.ceil(');
        var vars = { a: 1, j: 1, k: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, o: 1, of: 1, w: 1, u: 1, v: 1, x: 1, y: 1, z: 1 };
        s = s.replace(/\{(a|j|k|b|c|d|e|f|g|h|i|o|of|w|u|v|x|y|z)\}/g, function (m, k) { return vars[k]; });
        try {
            var res = new Function('return function(){return ' + s + '}')()();
            return isNaN(res) || !isFinite(res);
        } catch (e) {
            return true;
        }
    }

    /** 公式串中是否含非法内容（除白名单变量/运算符/数字外还有字符） */
    function formulaInvalid(formula) {
        var s = (formula || '');
        if (s === '') return false;
        s = s.replace(/\u53d6\u6574|\u5468\u957f|\u53cd\u8ba1\u4ef7\u9762\u79ef|\u8ba1\u4ef7\u9762\u79ef|\u9762\u79ef|\u4e3e\u67b6|\u6d1e\u9762|\u53c2\u6570|\u7a97\u9762|\u53d8\u91cf|\u6881\u957f|\u6881\u9ad8|\u8f66\u8fd0\u8d39|\u7a0e\u91d1|\u7ba1\u7406\u8d39|\u4e0d\u6253\u6298\u603b\u989d|\u6253\u6298\u603b\u989d|\u5de5\u7a0b\u91cf|\u697c\u5c42|\u7535\u68af/g, '');
        s = s.replace(/[+\-*()|!~]/g, '').replace(/[0-9]/g, '');
        return s != '';
    }

    // ==================== 预签公式变量（{a}起报价 ~ {k}活动优惠，对齐旧 presignProduce.js） ====================

    var PRESIGN_CN_PARAM = [
        [/\u8d77\u62a5\u4ef7/g, '{a}'], [/\u4f18\u60e0\u989d/g, '{b}'], [/\u529f\u80fd\u533a/g, '{c}'], [/\u4e2a\u6027/g, '{d}'],
        [/\u51cf\u9879/g, '{e}'], [/\u8d4b\u80fd/g, '{f}'], [/\u7ba1\u7406\u8d39/g, '{g}'], [/\u7279\u6b8a\u4f18\u60e0/g, '{h}'],
        [/\u7ba1\u7406\u4f18\u60e0/g, '{i}'], [/\u6d6e\u52a8\u989d/g, '{j}'], [/\u6d3b\u52a8\u4f18\u60e0/g, '{k}']
    ];
    var PRESIGN_PARAM_CN = [
        [/\{a\}/g, '\u8d77\u62a5\u4ef7'], [/\{b\}/g, '\u4f18\u60e0\u989d'], [/\{c\}/g, '\u529f\u80fd\u533a'], [/\{d\}/g, '\u4e2a\u6027'],
        [/\{e\}/g, '\u51cf\u9879'], [/\{f\}/g, '\u8d4b\u80fd'], [/\{g\}/g, '\u7ba1\u7406\u8d39'], [/\{h\}/g, '\u7279\u6b8a\u4f18\u60e0'],
        [/\{i\}/g, '\u7ba1\u7406\u4f18\u60e0'], [/\{j\}/g, '\u6d6e\u52a8\u989d'], [/\{k\}/g, '\u6d3b\u52a8\u4f18\u60e0']
    ];

    /** 预签公式：中文 → {a}~{k} */
    function presignFormulaToParam(formula) {
        var s = formula || '';
        for (var i = 0; i < PRESIGN_CN_PARAM.length; i++) s = s.replace(PRESIGN_CN_PARAM[i][0], PRESIGN_CN_PARAM[i][1]);
        return s;
    }

    /** 预签公式：{a}~{k} → 中文 */
    function presignParamToFormula(param) {
        var s = param || '';
        for (var i = 0; i < PRESIGN_PARAM_CN.length; i++) s = s.replace(PRESIGN_PARAM_CN[i][0], PRESIGN_PARAM_CN[i][1]);
        return s;
    }

    /** 预签公式试算 */
    function presignEvals(formula) {
        var s = (formula || '').replace(/\{(a|b|c|d|e|f|g|h|i|j|k)\}/g, '1');
        try {
            var res = new Function('return function(){return ' + s + '}')()();
            return isNaN(res) || !isFinite(res);
        } catch (e) {
            return true;
        }
    }

    /** 预签公式是否含非法变量 */
    function presignFormulaInvalid(formula) {
        var s = formula || '';
        if (s === '') return false;
        s = s.replace(/\u8d77\u62a5\u4ef7|\u4f18\u60e0\u989d|\u529f\u80fd\u533a|\u4e2a\u6027|\u51cf\u9879|\u8d4b\u80fd|\u7ba1\u7406\u8d39|\u7279\u6b8a\u4f18\u60e0|\u7ba1\u7406\u4f18\u60e0|\u6d6e\u52a8\u989d|\u6d3b\u52a8\u4f18\u60e0/g, '');
        s = s.replace(/[+\-*()]/g, '').replace(/[0-9]/g, '');
        return s != '';
    }

    // ==================== 报价功能权限配置（对齐旧 quotationIndex.js getConfig） ====================

    /**
     * 读报价功能权限配置（同步请求 queryQuotationFunctionRight）。
     * 返回 { apiPage, pageBtn:[], nodes:{}, condArr:[], extraParam:[], propertyArr:[], hasExport }
     */
    function getPageConfig(page, type) {
        var cfg = { apiPage: null, pageBtn: [], nodes: {}, condArr: [], extraParam: [], propertyArr: [], hasExport: null, postDataName: (page || 'quotation') + 'PostData' };
        if (!page) return cfg;
        var $ = layui.jquery;

        function setDeep(o, props, value, subtype) {
            var prop = props.shift();
            if (props.length) {
                if (!o[prop]) o[prop] = {};
                setDeep(o[prop], props, value, subtype);
                return;
            }
            if (subtype == 1) {
                if (!o[prop]) o[prop] = [value]; else o[prop].push(value);
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

        $.ajax({
            url: app.config.server + 'queryQuotationFunctionRight.do',
            type: 'POST',
            data: { 'quotationFunctionRight.name': page, 'quotationFunctionRight.type': type == null ? '' : type, authentication: app.cookie.get('authentication') },
            async: false,
            dataType: 'json',
            success: function (res) {
                if (res.errorCode != 0) return;
                var rights = (res.quotationFunctionRights || []).sort(function (a, b) {
                    return (a.quotationFunction.sort || 0) - (b.quotationFunction.sort || 0);
                });
                $.each(rights, function (i, v) {
                    var data = v.quotationFunction;
                    if (data.type == 1) data.value = getApi({ api: window.api || {} }, (data.value || '').split('.'));
                    setDeep(cfg, (data.key || '').split('.'), data.value, data.subtype);
                });
            }
        });
        return cfg;
    }

    // ==================== 跨模块 api stub 补齐 ====================
    function _extend(target, src) {
        for (var k in src) { if (src.hasOwnProperty(k) && target[k] == null) target[k] = src[k]; }
        return target;
    }
    function ensureApiStubs() {
        window.api = window.api || {};
        if (!api.quotation) api.quotation = {};
        // api.decoration（详情/优惠计算联动）
        if (!api.decoration) api.decoration = {};
        _extend(api.decoration, {
            queryDecorationForCommonByOrderId: { url: 'queryDecorationForCommonByOrderId.do', demo: true },
            queryDecorationHolonomy: { url: 'queryDecorationHolonomy.do' },
            amountDecorationActivity: { url: 'amountDecorationActivity.do', demo: true, type: 'query', tranargs: [{ result: 'decorationActivity', args: ['amount'] }] },
            queryDecorationInfoByOrderId: { url: 'queryDecorationInfoByOrderId.do' }
        });
        // api.data（品类/施工节点联动）
        if (!api.data) api.data = {};
        _extend(api.data, {
            queryCategory: { url: 'queryCategory.do' },
            queryConstructionNode: { url: 'queryConstructionNode.do' }
        });
        // api.personel / api.system（人员/公司下拉）
        if (!api.personel) api.personel = {};
        _extend(api.personel, { queryUserForOption: { url: 'queryUserForOption.do' } });
        if (!api.system) api.system = {};
        _extend(api.system, { queryCompany: { url: 'queryCompany.do' }, queryCompanyByCid: { url: 'queryCompanyByCid.do' } });
        // api.approval（报价审批人）
        if (!api.approval) api.approval = {};
        _extend(api.approval, { queryApproverByType: { url: 'queryApproverByType.do' } });
        // api.information（预签价格导入计划任务）
        if (!api.information) api.information = {};
        _extend(api.information, { createPlan: { url: 'createPlan.do' } });
        // api.right（报价功能权限，quotationFunction 配置页用）
        api.right = api.right || {};
        _extend(api.right, {
            queryQuotationFunctionRight: { url: 'queryQuotationFunctionRight.do' },
            updateQuotationFunctionRight: { url: 'updateQuotationFunctionRight.do' }
        });
        // api.system 配置项（预签单数量上限等）
        _extend(api.system, { querySystemConfigByKey: { url: 'querySystemConfigByKey.do' } });
        // api.data 房屋计价面积回写
        _extend(api.data, { updateHouse: { url: 'updateHouse.do' } });
        // api.approval 预签优惠审批 / 报价折扣与优惠审批
        _extend(api.approval, {
            submitApprovalForProtationPrefer: { url: 'submitApprovalForProtationPrefer.do' },
            submitApprovalForQuotationDiscount: { url: 'submitApprovalForQuotationDiscount.do' },
            submitApprovalForQuotationPrefer: { url: 'submitApprovalForQuotationPrefer.do' }
        });
        // api.data 报价定额导出兜底
        _extend(api.data, {
            pageNormood: { url: 'pageNormood.do' },
            pageNormrice: { url: 'pageNormrice.do' },
            queryWorkType: { url: 'queryWorkType.do' },
            queryMeasurementUnit: { url: 'queryMeasurementUnit.do' },
            copySoods: { url: 'copySoods.do' },
            queryNormadd: { url: 'queryNormadd.do' },
            queryNormpack: { url: 'queryNormpack.do' },
            queryConstructionNodeByOrderId: { url: 'queryConstructionNodeByOrderId.do' },
            queryGoodsByGId: { url: 'queryGoodsByGId.do' }
        });
        // api.communion（选材项厂商联动 / 部门下拉）
        if (!api.communion) api.communion = {};
        _extend(api.communion, { queryBrandSupplier: { url: 'queryBrandSupplier.do' }, queryDepartment: { url: 'queryDepartment.do' } });
        // api.balance（选材项结算联动）
        if (!api.balance) api.balance = {};
        _extend(api.balance, {
            queryBalanceSelection: { url: 'queryBalanceSelection.do' },
            countBalanceSelectionItem: { url: 'countBalanceSelectionItem.do' },
            queryBalanceSelectionByBsid: { url: 'queryBalanceSelectionByBsid.do' },
            submitBalanceSelection: { url: 'submitBalanceSelection.do' },
            batchBalanceSelection: { url: 'batchBalanceSelection.do' }
        });
    }

    return {
        ENUM: ENUM, C: C,
        badge: badge, buildFilters: buildFilters, dateRange: dateRange,
        checkNull: checkNull, money: money, ctx: ctx,
        sortQuo: sortQuo,
        statisticalQuotationItem: statisticalQuotationItem,
        initQuotationDetailItem: initQuotationDetailItem,
        quotationDataProcessing: quotationDataProcessing,
        quotationNormriceProcessing: quotationNormriceProcessing,
        quotationNormtimeProcessing: quotationNormtimeProcessing,
        quotationNormoodProcessing: quotationNormoodProcessing,
        quotationMaterial: quotationMaterial,
        quotationCalculator: quotationCalculator,
        quotationTotal: quotationTotal,
        loadQuotationDetail: loadQuotationDetail,
        formulaToParam: formulaToParam, paramToFormula: paramToFormula, evals: evals, formulaInvalid: formulaInvalid,
        presignFormulaToParam: presignFormulaToParam, presignParamToFormula: presignParamToFormula,
        presignEvals: presignEvals, presignFormulaInvalid: presignFormulaInvalid,
        getPageConfig: getPageConfig,
        ensureApiStubs: ensureApiStubs
    };
})();
