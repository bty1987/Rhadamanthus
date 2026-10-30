/**
 * app/js/contract/contract-common.js —— contract 模块公共工具（34 个合同模板页共用）
 *
 * 迁移自旧 WebContent 的 js/contract/*.js 公共骨架 + js/utils/quotationUtils.js（合同用子集）
 * + js/com/utils.js 的 getCNMoney/getBigNumber + com/constant.js 的枚举取值。
 *
 * 提供：
 *   - contractCommon.ENUM / CONST：装修域枚举与整型常量（值对齐 docs/12-规范标准/CONSTANTS.md）
 *   - contractCommon.ensureApiStubs()：补齐 api.common.current / api.quotation.*（含金额 tranargs）
 *   - contractCommon.resolveCtx(slot)：合并 app.params[slot] 与 URL 查询参数（orderId/cid/dcid + contractargs）
 *   - contractCommon.current(cb)：同步取服务器当前时间
 *   - contractCommon.paymentMap(decorationPayments)：款项列表 → { 款项类型: 金额 }（旧 Array.split）
 *   - contractCommon.getCNMoney / getBigNumber：人民币大写 / 中文数字（对齐旧 utils）
 *   - contractCommon.date(...)：laydate 日期选择（对齐旧 com.datetime）
 *   - contractCommon.bindTalking(bindings)：补充条款双击插入话术（layer 弹层替代 bootstrap modal）
 *   - contractCommon.collect()：收集可见 .conitem → { id: value }
 *   - contractCommon.saveDecorationContract(data, table)：add/makeDecorationContract 并关闭弹窗
 *   - contractCommon.quotationUtils：initQuotationDetailItem 简化版（产出 quotationFunctionAreaItemCs）
 */
window.contractCommon = (function () {
    'use strict';

    // ==================== 枚举（对齐生产库 communion.constant） ====================
    var ENUM = {
        // 签单类型 decoration.typeness
        typeness: { 0: '半包', 1: '整装', 2: '半价', 3: '满减', 4: '减上捡', 5: '达额减', 6: '新满减', 7: '局改', 8: '全翻', 9: '全案', 10: '新达额减', 11: '满额减', 12: '新配减', 13: '精装房', 14: '新满减', 15: '新惠减' },
        // 订单类型 decoration.type
        type: { 0: '半包,装修单,不包括主材单', 1: '整装,装修+主材单', 2: '满减,主材配比,装修打折' },
        // 房屋类型 houseClass
        houseClass: { '平层': '平层', '阁楼': '阁楼', '地下室': '地下室', '复式': '复式', '别墅': '别墅', '叠拼': '叠拼' },
        // 房屋现状 houseType
        houseType: { '期房': '期房', '现房': '现房' },
        // 工程状态 projectStatus
        projectStatus: { 0: '初始', 1: '开工', 2: '完工' },
        // 图纸提供方式 decorationPicture.type
        decorationPictureType: { 0: '纸质', 1: '电子' },
        // 户口类型 personel.userInfo.householdType
        householdType: { 0: '农村', 1: '城镇' },
        // 选材类型 quotation.selectionItem.type（对齐 CONSTANTS.md）
        selectionType: { 0: '报价项', 1: '拓展增', 2: '拓展减', 3: '增减增', 4: '增减减', 5: '选材项', 13: '增减增下拨', 14: '增减减不退', 30: '报价项补量', 31: '拓展增补量', 32: '拓展减补量', 33: '增减增补量', 34: '增减减补量' },
        // 厂商合同下拉（对齐 personel.contract.*，值即展示文本）
        supplierProductModel: ['① 定制品', '② 标准成品'],
        supplierOrderingMethod: ['① 系统下单'],
        supplierDeliveryMode: ['① 乙方配送到仓模式', '② 乙方配送到户模式'],
        supplierInstallationMode: ['① 甲方自装', '② 乙方负责安装', '③ 乙方负责安装'],
        supplierPaymentMethod: ['(1) 采购价结算', '(2) 比例结算']
    };

    // ==================== 整型常量（对齐 CONSTANTS.md） ====================
    var CONST = {
        TYPE_MIDPACK_INT: 0,                 // 半包类型
        TYPE_HOLONOMY_INT: 2,                // 满减类型
        TYPENESS_NEWFULLREDUCTION_INT: 6,    // 新满减
        AREACALE_NUMBER_INT: 0,              // 预签项按数量计价
        ATTTYPE_DECORATION_INT: 0            // 装修合同业务类型
    };

    // ==================== API stub 补齐 ====================
    function _extend(target, src) {
        for (var k in src) { if (src.hasOwnProperty(k) && target[k] == null) target[k] = src[k]; }
        return target;
    }

    var QUOTATION_TRANARGS = ['discount', 'totalPrice', 'undisPrice', 'disPrice', 'manageRate', 'managePrice', 'trafficRate', 'trafficPrice', 'basePrice', 'costPrice', 'unachePrice', 'consPrice', 'comsPrice', 'undisComPrice', 'disComPrice', 'notSalesmanRate', 'taxPrice', 'taxRate'];

    function ensureApiStubs() {
        window.api = window.api || {};
        // api.common（服务器当前时间等）
        api.common = api.common || {};
        _extend(api.common, { current: { url: 'current.do' } });
        // api.quotation（报价域，报价模块 api 文件未迁时本地兜底，tranargs 对齐旧 js/api/quotation.js）
        if (!window.api.quotation) api.quotation = {};
        _extend(api.quotation, {
            queryQuotationForDefaultByOrderId: { url: 'queryQuotationForDefaultByOrderId.do', demo: true, type: 'query', tranargs: [{ result: 'quotation', args: QUOTATION_TRANARGS }] },
            queryQuotationFunctionAreaByQuotationId: {
                url: 'queryQuotationFunctionAreaByQuotationId.do', demo: true, type: 'query',
                tranargs: [{ result: 'quotationFunctionAreas', args: ['total'] },
                    { result: 'quotationFunctionAreas-quotationFunctionAreaParam', args: ['girth', 'area', 'height', 'holeLength', 'holeHeight', 'windowLength', 'windowHeight', 'beamLength', 'beamHeight'] },
                    { result: 'quotationFunctionAreas-quotationFunctionAreaItems', args: ['unitPrice', 'addPrice', 'subPrice', 'initNum', 'num'] }]
            },
            queryExtensionByOrderId: {
                url: 'queryExtensionByOrderId.do', type: 'query',
                tranargs: [{ result: 'extensions', args: ['undisPrice', 'disPrice', 'consPrice', 'comsPrice', 'total', 'managePrice', 'manageRate', 'taxPrice', 'taxRate'] },
                    { result: 'extensions-extensionItems', args: ['unitPrice', 'num', 'preprice', 'postprice', 'total'] }]
            },
            queryAddReduceByOrderId: {
                url: 'queryAddReduceByOrderId.do', demo: true, type: 'query',
                tranargs: [{ result: 'addReduces', args: ['total', 'manageRate', 'managePrice', 'undisPrice', 'disPrice', 'uncalPrice', 'calPrice', 'consPrice', 'comsPrice', 'discount', 'taxRate', 'taxPrice', 'accountDiscount', 'accountManageDiscount', 'accountTaxDiscount'] },
                    { result: 'addReduces-addReduceItems', args: ['unitPrice', 'num', 'preprice', 'postprice', 'total'] }]
            },
            queryProtationForDefaultByOrderId: {
                url: 'queryProtationForDefaultByOrderId.do', demo: true, type: 'query',
                tranargs: [{ result: 'protation', args: ['quotePrice', 'quoteArea', 'preferPrice', 'managePrice', 'manageDiscount', 'taxPrice', 'costPrice', 'mostPrice', 'totalCost', 'totalProfit', 'costRate', 'mostRate', 'manageRate', 'taxRate', 'profitRate', 'discount', 'unitPrice', 'basicPrice', 'comdPrice', 'commPrice', 'adddPrice', 'addmPrice', 'subdPrice', 'submPrice', 'subcPrice', 'accdPrice', 'accmPrice', 'totalPrice', 'manageProfit', 'advanceProfit', 'activityPrice', 'activityProfit'] },
                    { result: 'protation-protationItems', args: ['basicNum', 'price', 'num', 'cost', 'addPrice', 'subPrice', 'achePrice'] }]
            },
            queryProtationByPid: {
                url: 'queryProtationByPid.do', demo: true, type: 'query',
                tranargs: [{ result: 'protation', args: ['quotePrice', 'quoteArea', 'preferPrice', 'managePrice', 'manageDiscount', 'taxPrice', 'costPrice', 'mostPrice', 'totalCost', 'totalProfit', 'costRate', 'mostRate', 'manageRate', 'taxRate', 'profitRate', 'discount', 'unitPrice', 'basicPrice', 'comdPrice', 'commPrice', 'adddPrice', 'addmPrice', 'subdPrice', 'submPrice', 'subcPrice', 'accdPrice', 'accmPrice', 'totalPrice', 'manageProfit', 'advanceProfit', 'activityPrice', 'activityProfit'] }]
            },
            queryProtationItemByPid: {
                url: 'queryProtationItemByPid.do', demo: true, type: 'query',
                tranargs: [{ result: 'protationItems', args: ['basicNum', 'price', 'num', 'cost', 'addPrice', 'subPrice', 'achePrice'] }]
            },
            queryPresignProduceByPpid: {
                url: 'queryPresignProduceByPpid.do', type: 'query',
                tranargs: [{ result: 'presignProduce', args: ['quotePrice', 'quoteArea', 'unitPrice', 'discount', 'discountt', 'manageRate', 'manageDiscount', 'manageDiscountt', 'taxRate', 'costPrice', 'profitRate', 'preferPrice', 'mostPrice', 'costRate', 'mostRate', 'activityPrice'] }]
            },
            querySelectionItemByOrderId: {
                url: 'querySelectionItemByOrderId.do', demo: true, type: 'query',
                tranargs: [{ result: 'selectionItems', args: ['num', 'initNum', 'refnum', 'postprice', 'preprice'] }]
            }
        });
    }

    // ==================== jQuery 惰性取用 ====================
    // 本文件以普通 <script> 加载（早于 bootstrap 的 layui.use），
    // layui 2.x 打包版在 layui.js 加载后即挂 layui.$（同步），layui.jquery 在 use 后可用。
    function jq() {
        if (window.layui && (layui.jquery || layui.$)) return layui.jquery || layui.$;
        return window.$ || window.jQuery;
    }

    // ==================== 上下文（app.params + URL 查询合并） ====================
    /**
     * 解析页面上下文。优先级：URL 查询参数 > 父窗口 app.params[slot] > 本窗口 app.params[slot]。
     * URL 支持 orderId / dcid / cid / 其它任意 kv（并入 contractargs）。
     * @param {String} [slot] handoff 槽位名，默认 'decoration'（厂商/人事页用 'personel'）
     */
    function resolveCtx(slot) {
        var $ = jq();
        slot = slot || 'decoration';
        var ctx = {};
        try { if (window.parent && window.parent.app && window.parent.app.params && window.parent.app.params[slot]) ctx = $.extend({}, window.parent.app.params[slot]); } catch (e) { /* 跨域忽略 */ }
        if (app.params && app.params[slot]) ctx = $.extend({}, ctx, app.params[slot]);

        var args = {};
        var q = window.location.search.substring(1);
        if (q) {
            $.each(q.split('&'), function (i, kv) {
                var p = kv.split('=');
                if (p[0]) args[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || '');
            });
        }
        if (args.orderId) ctx.orderId = args.orderId;
        if (args.dcid) ctx.contract = $.extend({}, ctx.contract, { dcid: args.dcid });
        var ca = $.extend({}, ctx.contractargs || {});
        $.each(args, function (k, v) {
            if (['orderId', 'dcid', 'cid'].indexOf(k) == -1) ca[k] = v;
        });
        if (args.cid) ca.cid = args.cid;
        ctx.contractargs = ca;
        return ctx;
    }

    // ==================== 服务器当前时间（同步） ====================
    function current(cb) {
        app.post(api.common.current, {}, function (res) {
            var d = res.current ? new Date(res.current) : new Date();
            if (cb) cb(d);
        }, null, false);
        return new Date();
    }

    // ==================== 款项映射（旧 Array.prototype.split("paymentType","referMoney")） ====================
    function paymentMap(decorationPayments) {
        var pack = {};
        var $ = jq();
        $.each(decorationPayments || [], function (i, v) {
            pack[v.paymentType] = v.referMoney;
        });
        return pack;
    }

    // ==================== 人民币大写 / 中文数字（对齐旧 utils） ====================
    function getCNMoney(currencyDigits) {
        var MAXIMUM_NUMBER = 99999999999.99;
        var CN_ZERO = '零', CN_ONE = '壹', CN_TWO = '贰', CN_THREE = '叁', CN_FOUR = '肆', CN_FIVE = '伍';
        var CN_SIX = '陆', CN_SEVEN = '柒', CN_EIGHT = '捌', CN_NINE = '玖', CN_TEN = '拾';
        var CN_HUNDRED = '佰', CN_THOUSAND = '仟', CN_TEN_THOUSAND = '万', CN_HUNDRED_MILLION = '亿';
        var CN_SYMBOL = '', CN_DOLLAR = '元', CN_TEN_CENT = '角', CN_CENT = '分', CN_INTEGER = '整';
        var integral, decimal, outputCharacters, parts, digits, radices, bigRadices, decimals;
        var zeroCount, i, p, d, quotient, modulus, negative = '';

        if (currencyDigits == null || currencyDigits === '') return '';
        if (currencyDigits < 0) { negative = '负'; currencyDigits = Math.abs(currencyDigits); }
        currencyDigits = currencyDigits.toString();
        if (currencyDigits.match(/[^,.\d]/) != null) return '';
        currencyDigits = currencyDigits.replace(/,/g, '').replace(/^0+/, '');
        if (Number(currencyDigits) > MAXIMUM_NUMBER) return '';
        if (currencyDigits === '') currencyDigits = '0';

        parts = currencyDigits.split('.');
        if (parts.length > 1) { integral = parts[0]; decimal = parts[1].substr(0, 2); } else { integral = parts[0]; decimal = ''; }

        digits = [CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE];
        radices = ['', CN_TEN, CN_HUNDRED, CN_THOUSAND];
        bigRadices = ['', CN_TEN_THOUSAND, CN_HUNDRED_MILLION];
        decimals = [CN_TEN_CENT, CN_CENT];
        outputCharacters = '';

        if (Number(integral) > 0) {
            zeroCount = 0;
            for (i = 0; i < integral.length; i++) {
                p = integral.length - i - 1;
                d = integral.substr(i, 1);
                quotient = p / 4;
                modulus = p % 4;
                if (d == '0') {
                    zeroCount++;
                } else {
                    if (zeroCount > 0) outputCharacters += digits[0];
                    zeroCount = 0;
                    outputCharacters += digits[Number(d)] + radices[modulus];
                }
                if (modulus == 0 && zeroCount < 4) outputCharacters += bigRadices[quotient];
            }
            outputCharacters += CN_DOLLAR;
        }
        if (decimal != '') {
            for (i = 0; i < decimal.length; i++) {
                d = decimal.substr(i, 1);
                if (d != '0') outputCharacters += digits[Number(d)] + decimals[i];
            }
        }
        if (outputCharacters == '') outputCharacters = CN_ZERO + CN_DOLLAR;
        if (decimal == '') outputCharacters += CN_INTEGER;
        return CN_SYMBOL + negative + outputCharacters;
    }

    function getBigNumber(currencyDigits) {
        var MAXIMUM_NUMBER = 99999999999;
        var digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        var radices = ['', '十', '百', '千'];
        var bigRadices = ['', '万', '亿'];
        var integral, decimal, outputCharacters, parts, zeroCount, i, p, d, quotient, modulus;

        currencyDigits = (currencyDigits == null ? '' : currencyDigits).toString();
        if (currencyDigits == '') return 'O';
        if (currencyDigits.match(/[^,.\d]/) != null) return '';
        currencyDigits = currencyDigits.replace(/,/g, '').replace(/^0+/, '');
        if (Number(currencyDigits) > MAXIMUM_NUMBER) return '';
        if (currencyDigits === '') currencyDigits = '0';

        parts = currencyDigits.split('.');
        integral = parts[0];
        decimal = parts.length > 1 ? parts[1].substr(0, 2) : '';
        outputCharacters = '';

        if (Number(integral) > 0) {
            zeroCount = 0;
            for (i = 0; i < integral.length; i++) {
                p = integral.length - i - 1;
                d = integral.substr(i, 1);
                quotient = p / 4;
                modulus = p % 4;
                if (d == '0') {
                    zeroCount++;
                } else {
                    if (zeroCount > 0) outputCharacters += digits[0];
                    zeroCount = 0;
                    outputCharacters += digits[Number(d)] + radices[modulus];
                }
                if (modulus == 0 && zeroCount < 4) outputCharacters += bigRadices[quotient];
            }
        }
        if (decimal != '') {
            for (i = 0; i < decimal.length; i++) {
                d = decimal.substr(i, 1);
                if (d != '0') outputCharacters += digits[Number(d)];
            }
        }
        if (outputCharacters.substring(0, 2) == '一十') outputCharacters = outputCharacters.substring(1);
        if (outputCharacters == '') outputCharacters = digits[0];
        return outputCharacters;
    }

    // ==================== laydate（对齐旧 com.datetime） ====================
    /**
     * 给若干日期输入挂 laydate。
     * @param {String|String[]} ids 一个或多个元素 id（不带 #）
     * @param {String} [type] year|month|day（年/月/日粒度），缺省完整日期
     */
    function date(ids, type) {
        var list = Array.isArray(ids) ? ids : [ids];
        layui.each(list, function (i, id) {
            var opt = { elem: '#' + id };
            if (type == 'year') { opt.type = 'year'; opt.format = 'yyyy'; }
            else if (type == 'month') { opt.type = 'month'; opt.format = 'MM'; }
            else if (type == 'day') { opt.format = 'dd'; }
            layui.laydate.render(opt);
        });
    }

    // ==================== 话术插入（layer 弹层替代 bootstrap modal） ====================
    /**
     * 绑定补充条款双击话术。
     * @param {Array} bindings [{id:'con-markup-one', types:{'types[0]':0,...}}, ...]
     * @param {String} [listId] 话术列表容器 id，默认 talkingList
     */
    function bindTalking(bindings, listId) {
        listId = listId || 'talkingList';
        var $ = jq();
        layui.each(bindings, function (i, b) {
            $('#' + b.id).on('dblclick', function () {
                app.post(api.data.queryTalking, b.types, function (res) {
                    var talkings = res.talkings || [];
                    var html = '';
                    if (!talkings.length) {
                        html = '<div style="padding:30px;text-align:center;color:#999;">无可用数据提供<\/div>';
                    } else {
                        layui.each(talkings, function (j, v) {
                            html += '<div class="layui-panel" style="padding:10px 14px;margin:8px 0;cursor:pointer;" data-content="' + String(v.content == null ? '' : v.content).replace(/"/g, '&quot;') + '">'
                                + '<span class="layui-badge layui-bg-blue">' + (j + 1) + '<\/span> ' + (v.content == null ? '' : v.content) + '<\/div>';
                        });
                    }
                    var $box = $('#' + listId).html(html).off('click').on('click', '[data-content]', function () {
                        var $tmp = $('#' + b.id);
                        $tmp.val($tmp.val() + $(this).attr('data-content') + '\n');
                    });
                    $box.closest('[data-talking-box]').show();
                    layui.layer.open({
                        type: 1, title: '话术', area: ['560px', '60%'], shadeClose: true,
                        content: $box.parent('[data-talking-box]').length ? $box.parent('[data-talking-box]') : $box,
                        end: function () { $box.parent('[data-talking-box]').hide(); }
                    });
                }, null, false);
            });
        });
    }

    // ==================== 收集表单（旧 .conitem:visible） ====================
    function collect(formSelector) {
        var $ = jq();
        var data = {};
        $(formSelector || '#form').find('.conitem').each(function () {
            var $el = $(this);
            if (!$el.is(':visible')) return;
            data[$el.attr('id')] = $el.val();
        });
        return data;
    }

    // ==================== 保存合同（add / make） ====================
    /**
     * 保存装修合同。上下文：app.params.decoration = { orderId, contractargs, contract }。
     * @param {Object} data 表单数据（已含 cover 合并结果）
     * @param {Object|Array} [table] 表格数据（insertWay 合同表格），无则不传
     * @param {Function} [done] 成功回调（缺省关闭弹窗）
     */
    function saveDecorationContract(data, table, done) {
        var ctx = resolveCtx('decoration');
        var options = {
            'decorationContract.orderId': ctx.orderId,
            'contract.cid': ctx.contractargs && ctx.contractargs.cid,
            'data': JSON.stringify(data)
        };
        if (table != null) options['table'] = JSON.stringify(table);

        var apiDef = api.decoration.addDecorationContract;
        if (ctx.contract && ctx.contract.dcid) {
            apiDef = api.decoration.makeDecorationContract;
            options['decorationContract.dcid'] = ctx.contract.dcid;
        }

        var loader = app.showLoading('合同生成中...', { shade: 0.3 });
        app.post(apiDef, options, function () {
            app.hideLoading(loader);
            app.showAlert(app.success, '操作成功');
            if (done) done();
            closeSelfPopup();
        }, function (res) {
            app.hideLoading(loader);
            app.showAlert(app.error, (res && res.errorMsg) || '操作失败');
        });
    }

    /** 关闭当前弹窗（layer iframe 场景） */
    function closeSelfPopup() {
        try {
            var idx = parent.layer.getFrameIndex(window.name);
            if (idx) parent.layer.close(idx);
            else window.close();
        } catch (e) { window.close(); }
    }

    // ==================== 报价明细（quotationUtils.initQuotationDetailItem 合同用简化版） ====================
    /**
     * 产出 quotationUtils.quotationDetail.quotationFunctionAreaItemCs：
     *   { "qfaId-functionAreaName": [item...], "-扩展项目": [...], "-增减项目": [...] }
     * item 含 typestr/itemName/measurementUnit/num/content/subtype/qfaiId/eiid/ariId/suptype。
     * showType.itemtype 位：1=普通项 2=扩展项 4=增减项 8=公共项 16=含 9999 功能区（合同页用 31）。
     */
    var quotationUtils = {
        quotationDetail: {},
        sortQuo: function (items) {
            return (items || []).slice().sort(function (a, b) {
                if (a.index == null || b.index == null) return (b.index || 0) - (a.index || 0);
                return a.index - b.index;
            });
        },
        initQuotationDetailItem: function (quotation, quotationFunctionAreas, addReduces, extensions, quotationPrefer, orderType, dataProcessing, showType) {
            showType = showType || { itemtype: 31 };
            var $decorationtype = orderType;
            var discount = quotation.discount;
            var itemCs = {};
            var i, j;

            quotationFunctionAreas = quotationFunctionAreas || [];
            for (i = 0; i < quotationFunctionAreas.length; i++) {
                var area = quotationFunctionAreas[i];
                if (area.functionAreaOrder == 9999 && (showType.itemtype & 16) != 16) continue;

                var items = quotationUtils.sortQuo(area.quotationFunctionAreaItems);
                var key = area.qfaId + '-' + area.functionAreaName;
                itemCs[key] = [];

                for (j = 0; j < items.length; j++) {
                    var item = items[j];
                    if (item.type != 5 && (showType.itemtype & 1) != 1) continue;
                    if (item.type == 5 && (showType.itemtype & 8) != 8) continue;

                    item.typestr = '-';
                    if (item.type == 0) { item.typestr = '标准'; item.discount = $decorationtype == 2 ? 1 : item.discount; }
                    if (item.type == 1) { item.typestr = '自定义'; item.discount = $decorationtype == 2 ? 1 : item.discount; }
                    if (item.type == 2) { item.typestr = '管理'; item.discount = $decorationtype == 2 ? 1 : item.discount; }
                    if (item.type == 3) { item.typestr = '管理'; }
                    if (item.type == 8) { item.typestr = '管理'; }
                    if (item.type == 4) { item.typestr = '不计'; item.discount = 0; }
                    if (item.type == 5) { item.typestr = '标准'; item.discount = 0; }
                    if (item.type == 6) { item.typestr = '非业绩'; item.discount = $decorationtype == 2 ? 1 : item.discount; }
                    if (item.type == 9) { item.typestr = '综合'; }

                    item.suptype = 1; // 1:报价项 2:扩展项 3:增减项
                    if (item.type != 7) itemCs[key].push(item);
                }
            }

            if ((showType.itemtype & 16) == 16) {
                itemCs['-扩展项目'] = [];
                itemCs['-增减项目'] = [];
            }

            // 扩展项
            if ((showType.itemtype & 2) == 2 && extensions != null && extensions.length != 0) {
                for (i = 0; i < extensions.length; i++) {
                    var extensionItems = extensions[i].extensionItems || [];
                    for (j = 0; j < extensionItems.length; j++) {
                        var extensionItem = extensionItems[j];
                        extensionItem.suptype = 2;
                        extensionItem.typestr = extensionItem.type == 0 ? '标准增(扩展)' : extensionItem.type == 1 ? '定义增(扩展)'
                            : extensionItem.type == 2 ? '标准减(扩展)' : extensionItem.type == 3 ? '定义减(扩展)'
                                : extensionItem.type == 4 ? '报价减(扩展)' : extensionItem.type == 5 ? '报价增(扩展)'
                                    : extensionItem.type == 6 ? '报价项(扩展活动)' : '-';
                        var ekey = extensionItem.quotationFunctionAreaId + '-' + extensionItem.quotationFunctionAreaName;
                        if (itemCs[ekey] == undefined) itemCs[ekey] = [];
                        if (itemCs[ekey]) itemCs[ekey].push(extensionItem);
                        if (itemCs['-扩展项目']) itemCs['-扩展项目'].push(extensionItem);
                    }
                }
            }

            // 增减项
            if ((showType.itemtype & 4) == 4 && addReduces != null && addReduces.length != 0) {
                for (i = 0; i < addReduces.length; i++) {
                    var addReduceItems = addReduces[i].addReduceItems || [];
                    for (j = 0; j < addReduceItems.length; j++) {
                        var addReduceItem = addReduceItems[j];
                        addReduceItem.suptype = 3;
                        addReduceItem.typestr = addReduceItem.type == 0 ? '标准增(增减)' : addReduceItem.type == 1 ? '系统增(增减)'
                            : addReduceItem.type == 2 ? '定义增(增减)' : addReduceItem.type == 3 ? '报价减(增减)'
                                : addReduceItem.type == 4 ? '增项减(增减)' : addReduceItem.type == 5 ? '扩展减(增减)' : '-';
                        if (itemCs['-增减项目']) itemCs['-增减项目'].push(addReduceItem);
                    }
                }
            }

            quotationUtils.quotationDetail.quotationFunctionAreaItemCs = itemCs;
            return itemCs;
        }
    };

    /** map → [{key,value}]（对齐旧 constant datas 结构，供 app.bindData 使用） */
    function toDatas(map) {
        var list = [];
        for (var k in map) { if (map.hasOwnProperty(k)) list.push({ key: k, value: map[k] }); }
        return list;
    }

    return {
        ENUM: ENUM,
        CONST: CONST,
        ensureApiStubs: ensureApiStubs,
        resolveCtx: resolveCtx,
        current: current,
        paymentMap: paymentMap,
        getCNMoney: getCNMoney,
        getBigNumber: getBigNumber,
        date: date,
        bindTalking: bindTalking,
        collect: collect,
        saveDecorationContract: saveDecorationContract,
        closeSelfPopup: closeSelfPopup,
        quotationUtils: quotationUtils,
        toDatas: toDatas
    };
})();
