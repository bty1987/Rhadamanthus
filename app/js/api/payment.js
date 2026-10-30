/**
 * app/js/api/payment.js —— payment（款项）模块 API 定义
 *
 * 完整覆盖 payment 模块全部端点（约 173 个），保留 type / tranargs / demo / cache 等元信息。
 * 金额精度转换由 post.js 依据 type(query=响应÷1000, update=请求×1000) 与 tranargs 自动处理。
 *
 * 子模块分组：
 *   index        页面路由（菜单跳转用）
 *   paymentActivity / advancePayment / payment       活动款项 / 预付款 / 预付款账户
 *   decorationPayment                                装修款项
 *   materialPayment                                  主材款项
 *   salesPayment                                     销售款项
 *   servicePayment                                   服务款项
 *   receipt / proxyPayment / paytran                 收据 / 代收款 / 转换款（POS）
 *   activityPayment                                  活动收款
 *   paymentFunction / paymentContract                功能配置 / 支付签约
 *   wallet / walletard / walletran / walletres       钱包 / 银行卡 / 交易记录 / 资源
 *   kingdeeRecord / statement                        金蝶同步记录 / 对账单
 *   oalesPayment                                     外销款项
 *   channel                                          支付渠道（alipay/codepay/pospay）
 */
/* eslint-disable */

// ===== 页面路由 index =====
$.extend(api.index, {
    paymentIndex:               { url: '/views/payment/payment.html' },
    paymentCheckIndex:          { url: '/views/payment/payment.html' },       // 旧版 check 复用 payment 页 + status 过滤
    paymentReceiptIndex:        { url: '/views/payment/paymentReceipt.html' },
    payment2printIndex:         { url: '/views/payment/payment2print.html' },
    payment4commonIndex:        { url: '/views/payment/payment4common.html' },

    decorationPaymentIndex:     { url: '/views/payment/decorationPayment.html' },
    decorationPaymentCheckIndex:{ url: '/views/payment/decorationPayment.html' },
    decorationPaymentReceiptIndex: { url: '/views/payment/decorationPaymentReceipt.html' },

    materialPaymentIndex:       { url: '/views/payment/materialPayment.html' },
    materialPaymentCheckIndex:  { url: '/views/payment/materialPayment.html' },
    materialPaymentReceiptIndex:{ url: '/views/payment/materialPaymentReceipt.html' },

    salesPaymentReceiptIndex:   { url: '/views/payment/salesPaymentReceipt.html' },
    servicePaymentReceiptIndex: { url: '/views/payment/servicePaymentReceipt.html' },
    oalesPaymentReceiptIndex:   { url: '/views/payment/oalesPaymentReceipt.html' },
    activityPaymentReceiptIndex:{ url: '/views/payment/activityPaymentReceipt.html' },

    activityPaymentIndex:       { url: '/views/payment/activityPayment.html' },
    activityPaymentCountIndex:  { url: '/views/payment/activityPaymentCount.html' },
    proxyPaymentIndex:          { url: '/views/payment/proxyPayment.html' },
    paytranIndex:               { url: '/views/payment/paytran.html' },

    customerIndex:              { url: '/views/payment/customer.html' },
    paymentActivityIndex:       { url: '/views/payment/paymentActivity.html' },
    paymentContractIndex:       { url: '/views/payment/paymentContract.html' },
    paymentFunctionIndex:       { url: '/views/payment/paymentFunction.html' },
    statementIndex:             { url: '/views/payment/statement.html' },
    kingdeeRecordIndex:         { url: '/views/payment/kingdeeRecord.html' },

    walletIndex:                { url: '/views/payment/wallet.html' },
    walletardIndex:             { url: '/views/payment/walletard.html' },
    walletranIndex:             { url: '/views/payment/walletran.html' },
    walletresIndex:             { url: '/views/payment/walletres.html' }
});

$.extend(api, { payment: {

    // ===== 活动款项 paymentActivity =====
    pagePaymentActivity: {
        url: 'pagePaymentActivity.do', demo: true, type: 'query',
        tranargs: [{ result: 'paging-data', args: ['realMoney', 'multiple'] }]
    },
    amountPaymentActivity: {
        url: 'amountPaymentActivity.do', type: 'query',
        tranargs: { result: '', args: ['amount'] }
    },
    updatePaymentActivity:    { url: 'updatePaymentActivity.do' },
    deletePaymentActivity:    { url: 'deletePaymentActivity.do' },

    // ===== 预付款账户 advancePayment =====
    pageAdvancePayment: {
        url: 'pageAdvancePayment.do', demo: true, type: 'query',
        tranargs: [{ result: 'paging-data', args: ['balance', 'projectBalance', 'materialBalance', 'zhenglinBalance'] }]
    },
    queryAdvancePaymentByOrderId: {
        url: 'queryAdvancePaymentByOrderId.do', type: 'query',
        tranargs: [{ result: '', args: ['balanceAdvance', 'projectAdvance', 'materialAdvance', 'zaterialAdvance'] }]
    },
    addAdvancePayment:        { url: 'addAdvancePayment.do' },

    // ===== 预付款 payment（合同/主材预付款收款、提款、更新） =====
    pagePayment: {
        url: 'pagePayment.do', demo: true, type: 'query',
        tranargs: [{ result: 'paging-data', args: ['recharge', 'balance', 'realMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'transfer'] }]
    },
    queryPaymentByOrderId:    { url: 'queryPaymentByOrderId.do' },
    queryPaymentByArid: {
        url: 'queryPaymentByArid.do', type: 'query',
        tranargs: [{ result: 'payment', args: ['recharge', 'balance', 'realMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'transfer'] }]
    },
    queryPaymentByPaymentId: {
        url: 'queryPaymentByPaymentId.do', type: 'query',
        tranargs: [{ result: 'payment', args: ['recharge', 'balance', 'realMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'transfer'] }]
    },
    collectPayment: {
        url: 'collectPayment.do', type: 'update',
        tranargs: { args: ['payment.realMoney', 'payment.cash', 'payment.bank', 'payment.checkv'] }
    },
    confirmPayment:           { url: 'confirmPayment.do' },
    addPayment: {
        url: 'addPayment.do', type: 'update',
        tranargs: { args: ['payment.balance', 'payment.recharge'] }
    },
    updatePayment: {
        url: 'updatePayment.do', type: 'update',
        tranargs: { args: ['payment.realMoney', 'payment.cash', 'payment.bank', 'payment.checkv'] }
    },
    withdrawPayment: {
        url: 'withdrawPayment.do', type: 'update',
        tranargs: { args: ['payment.realMoney', 'payment.cash', 'payment.bank', 'payment.checkv'] }
    },
    sendPayment:              { url: 'sendPayment.do' },

    // ===== 装修款项 decorationPayment =====
    pageDecorationPayment: {
        url: 'pageDecorationPayment.do', demo: true, type: 'query',
        tranargs: [{ result: 'paging-data', args: ['referMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'advance', 'coupon'] }]
    },
    queryDecorationPaymentByOrderId: {
        url: 'queryDecorationPaymentByOrderId.do', demo: true, type: 'query',
        tranargs: [{ result: 'decorationPayments', args: ['referMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'advance', 'coupon'] }]
    },
    queryDecorationPaymentForNotInitByDrId: {
        url: 'queryDecorationPaymentForNotInitByDrId.do', type: 'query',
        tranargs: [{ result: 'decorationPayments', args: ['referMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'advance', 'coupon'] }]
    },
    queryDecoraionReceiptByDrId: {
        url: 'queryDecoraionReceiptByDrId.do', type: 'query',
        tranargs: [{ result: 'decorationReceipt', args: ['cash', 'bank', 'checkv', 'installment', 'accounts', 'advance', 'coupon'] }]
    },
    queryDecorationPaymentForContractByOrderId: {
        url: 'queryDecorationPaymentForContractByOrderId.do', type: 'query',
        tranargs: [{ result: 'decorationPayments', args: ['referMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'advance', 'coupon'] }]
    },
    checkDecorationPayment:   { url: 'checkDecorationPayment.do' },
    addDecorationPayment: {
        url: 'addDecorationPayment.do', type: 'update',
        tranargs: { args: ['decorationPayment.referMoney'] }
    },
    updateDecorationPayment: {
        url: 'updateDecorationPayment.do', type: 'update',
        tranargs: { args: ['decorationPayment.cash', 'decorationPayment.bank', 'decorationPayment.checkv', 'decorationPayment.advance', 'decorationPayment.coupon'] }
    },
    deleteDecorationPayment:  { url: 'deleteDecorationPayment.do' },
    collectDecorationPayment: {
        url: 'collectDecorationPayment.do', type: 'update',
        tranargs: { args: ['decorationPayment.cash', 'decorationPayment.bank', 'decorationPayment.checkv', 'decorationPayment.advance', 'decorationPayment.coupon'] }
    },
    settleDecorationPayment:  { url: 'settleDecorationPayment.do', type: 'update' },
    withdrawDecorationPayment:{ url: 'withdrawDecorationPayment.do', type: 'update' },
    refundDecorationPayment: {
        url: 'refundDecorationPayment.do', type: 'update',
        tranargs: { args: ['decorationPayment.cash', 'decorationPayment.bank', 'decorationPayment.checkv', 'decorationPayment.advance', 'decorationPayment.coupon'] }
    },
    refundDecorationPaymentForDesign: { url: 'refundDecorationPaymentForDesign.do' },
    confirmDecorationPayment: { url: 'confirmDecorationPayment.do' },
    affirmDecorationPayment:  { url: 'affirmDecorationPayment.do' },
    changeDecorationPaymentForTime: { url: 'changeDecorationPaymentForTime.do' },
    exportDecorationPayment:  { url: 'exportDecorationPayment.do' },
    sendDecorationPayment:    { url: 'sendDecorationPayment.do' },
    pushDecorationPayment:    { url: 'pushDecorationPayment.do' },

    // ===== 主材款项 materialPayment =====
    pageMaterialPayment: {
        url: 'pageMaterialPayment.do', demo: true, type: 'query',
        tranargs: [{ result: 'paging-data', args: ['referMoney', 'realMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'advance', 'coupon'] }]
    },
    queryMaterialPaymentByOrderId: {
        url: 'queryMaterialPaymentByOrderId.do', demo: true, type: 'query',
        tranargs: [{ result: 'materialPayments', args: ['referMoney', 'realMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'advance', 'coupon'] }]
    },
    queryMaterialPaymentByMid: {
        url: 'queryMaterialPaymentByMid.do', demo: true, type: 'query',
        tranargs: [{ result: 'materialPayments', args: ['referMoney', 'realMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'advance', 'coupon'] }]
    },
    queryMaterialPaymentForNotInitByMrId: {
        url: 'queryMaterialPaymentForNotInitByMrId.do', type: 'query',
        tranargs: [{ result: 'materialPayments', args: ['referMoney', 'realMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'advance', 'coupon'] }]
    },
    queryMaterialReceiptByMrId: {
        url: 'queryMaterialReceiptByMrId.do', type: 'query',
        tranargs: [{ result: 'materialReceipt', args: ['realMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'advance', 'coupon'] }]
    },
    amountMaterialPayment: {
        url: 'amountMaterialPayment.do', type: 'query',
        tranargs: [{ result: '', args: ['amount'] }]
    },
    checkMaterialPayment:    { url: 'checkMaterialPayment.do' },
    addMaterialPaymentForDeposit: {
        url: 'addMaterialPaymentForDeposit.do', type: 'update',
        tranargs: {
            args: ['materialPayment.referMoney'],
            query: [{ result: 'materialPayment', args: ['referMoney'] }]
        }
    },
    addMaterialPaymentForFullpay: {
        url: 'addMaterialPaymentForFullpay.do', type: 'update',
        tranargs: {
            args: ['materialPayment.referMoney'],
            query: [{ result: 'materialPayment', args: ['referMoney'] }]
        }
    },
    cancelMaterialPaymentForDeposit: { url: 'cancelMaterialPaymentForDeposit.do' },
    cancelMaterialPaymentForFullpay: { url: 'cancelMaterialPaymentForFullpay.do' },
    collectMaterialPayment: {
        url: 'collectMaterialPayment.do', type: 'update',
        tranargs: { args: ['materialPayment.realMoney', 'materialPayment.cash', 'materialPayment.bank', 'materialPayment.checkv', 'materialPayment.advance', 'materialPayment.coupon'] }
    },
    collectMaterialPayments: {
        url: 'collectMaterialPayments.do', type: 'update',
        tranargs: { args: ['materialReceipt.realMoney', 'materialReceipt.cash', 'materialReceipt.bank', 'materialReceipt.checkv', 'materialReceipt.advance', 'materialReceipt.coupon'] }
    },
    updateMaterialPayment: {
        url: 'updateMaterialPayment.do', type: 'update',
        tranargs: { args: ['materialReceipt.realMoney', 'materialReceipt.cash', 'materialReceipt.bank', 'materialReceipt.checkv', 'materialReceipt.advance', 'materialReceipt.coupon'] }
    },
    confirmMaterialPayment:  { url: 'confirmMaterialPayment.do' },
    refundMaterialPayment: {
        url: 'refundMaterialPayment.do', type: 'update',
        tranargs: { args: ['materialPayment.realMoney', 'materialPayment.cash', 'materialPayment.bank', 'materialPayment.checkv', 'materialPayment.advance', 'materialPayment.coupon'] }
    },
    refundMaterialPaymentForDeposit: { url: 'refundMaterialPaymentForDeposit.do' },
    refundMaterialPaymentForCoupon: {
        url: 'refundMaterialPaymentForCoupon.do', type: 'update',
        tranargs: { args: ['material.coupon'] }
    },
    changeMaterialPaymentForTime: { url: 'changeMaterialPaymentForTime.do' },
    exportMaterialPayment:   { url: 'exportMaterialPayment.do' },

    // ===== 销售款项 salesPayment =====
    pageSalesPayment: {
        url: 'pageSalesPayment.do', type: 'query',
        tranargs: [
            { result: 'paging-data', args: ['referMoney'] },
            { result: 'paging-data-salesReceipt', args: ['realMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'advance', 'coupon'] },
            { result: 'paging-data-sales', args: ['total', 'maling', 'coupon', 'depositpay', 'fullpay', 'amount', 'venderMaling'] }
        ]
    },
    querySalesPaymentBySid: {
        url: 'querySalesPaymentBySid.do', type: 'query',
        tranargs: [
            { result: 'salesPayments', args: ['referMoney'] },
            { result: 'salesPayments-salesReceipt', args: ['realMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'advance', 'coupon'] },
            { result: 'salesPayments-sales', args: ['total', 'maling', 'coupon', 'depositpay', 'fullpay', 'amount', 'venderMaling'] }
        ]
    },
    querySalesPaymentForNotInitBySrid: {
        url: 'querySalesPaymentForNotInitBySrid.do', type: 'query',
        tranargs: [
            { result: 'salesPayments', args: ['referMoney'] },
            { result: 'salesPayments-salesReceipt', args: ['realMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'advance', 'coupon'] },
            { result: 'salesPayments-sales', args: ['total', 'maling', 'coupon', 'depositpay', 'fullpay', 'amount', 'venderMaling'] }
        ]
    },
    querySalesReceiptBySrId: {
        url: 'querySalesReceiptBySrId.do', type: 'query',
        tranargs: [{ result: 'salesReceipt', args: ['realMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'advance', 'coupon'] }]
    },
    querySalesPaymentByOrderId: {
        url: 'querySalesPaymentByOrderId.do', type: 'query',
        tranargs: [
            { result: 'salesPayments', args: ['referMoney'] },
            { result: 'salesPayments-salesReceipt', args: ['realMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'advance', 'coupon'] },
            { result: 'salesPayments-sales', args: ['total', 'maling', 'coupon', 'depositpay', 'fullpay', 'amount', 'venderMaling'] }
        ]
    },
    amountSalesPayment: {
        url: 'amountSalesPayment.do', type: 'query',
        tranargs: [{ result: '', args: ['amount'] }]
    },
    addSalesPaymentForDeposit: {
        url: 'addSalesPaymentForDeposit.do', type: 'update',
        tranargs: {
            args: ['salesPayment.referMoney', 'salesPayment.sales.cvalue'],
            query: [{ result: 'salesPayment', args: ['referMoney'] }]
        }
    },
    addSalesPaymentForFullpay: {
        url: 'addSalesPaymentForFullpay.do', type: 'update',
        tranargs: {
            args: ['salesPayment.referMoney'],
            query: [{ result: 'salesPayment', args: ['referMoney'] }]
        }
    },
    cancelSalesPaymentForDeposit: { url: 'cancelSalesPaymentForDeposit.do' },
    cancelSalesPaymentForFullpay: { url: 'cancelSalesPaymentForFullpay.do' },
    collectSalesPayment: {
        url: 'collectSalesPayment.do', type: 'update',
        tranargs: { args: ['salesPayment.referMoney', 'salesReceipt.realMoney', 'salesReceipt.cash', 'salesReceipt.bank', 'salesReceipt.checkv', 'salesReceipt.advance', 'salesReceipt.coupon'] }
    },
    collectSalesPayments: {
        url: 'collectSalesPayments.do', type: 'update',
        tranargs: { args: ['salesPayment.referMoney', 'salesReceipt.referMoney', 'salesReceipt.realMoney', 'salesReceipt.cash', 'salesReceipt.bank', 'salesReceipt.checkv', 'salesReceipt.advance', 'salesReceipt.coupon'] }
    },
    confirmSalesPayment:    { url: 'confirmSalesPayment.do' },
    affirmSalesPayment:     { url: 'affirmSalesPayment.do' },
    cancelSalesPayment:     { url: 'cancelSalesPayment.do' },
    settleSalesPayment:     { url: 'settleSalesPayment.do', type: 'update' },
    withdrawSalesPayment:   { url: 'withdrawSalesPayment.do', type: 'update' },
    refundSalesPayment: {
        url: 'refundSalesPayment.do', type: 'update',
        tranargs: { args: ['salesPayment.referMoney', 'salesReceipt.realMoney', 'salesReceipt.cash', 'salesReceipt.bank', 'salesReceipt.checkv', 'salesReceipt.advance', 'salesReceipt.coupon'] }
    },
    refundSalesPaymentForDeposit: { url: 'refundSalesPaymentForDeposit.do' },
    refundSalesPaymentForCoupon: {
        url: 'refundSalesPaymentForCoupon.do', type: 'update',
        tranargs: { args: ['sales.coupon'] }
    },
    updateSalesPayment: {
        url: 'updateSalesPayment.do', type: 'update',
        tranargs: { args: ['salesPayment.referMoney', 'salesReceipt.realMoney', 'salesReceipt.cash', 'salesReceipt.bank', 'salesReceipt.checkv', 'salesReceipt.advance', 'salesReceipt.coupon'] }
    },
    sendSalesPayment:       { url: 'sendSalesPayment.do' },
    pushSalesPayment:       { url: 'pushSalesPayment.do' },

    // ===== 服务款项 servicePayment =====
    makeServicePayment: {
        url: 'makeServicePayment.do', type: 'update',
        tranargs: { args: ['servicePayment.referMoney'] }
    },
    collectServicePayment: {
        url: 'collectServicePayment.do', type: 'update',
        tranargs: { args: ['servicePayment.referMoney', 'serviceReceipt.realMoney', 'serviceReceipt.cash', 'serviceReceipt.bank', 'serviceReceipt.checkv', 'serviceReceipt.advance'] }
    },
    collectServicePaymentForService: {
        url: 'collectServicePaymentForService.do', type: 'update',
        tranargs: { args: ['servicePayment.referMoney', 'serviceReceipt.realMoney', 'serviceReceipt.cash', 'serviceReceipt.bank', 'serviceReceipt.checkv', 'serviceReceipt.advance'] }
    },
    pageServicePayment: {
        url: 'pageServicePayment.do', type: 'query',
        tranargs: [
            { result: 'paging-data', args: ['advanceMoney', 'serviceMoney'] },
            { result: 'paging-data-serviceReceipt', args: ['realMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'advance'] }
        ]
    },
    confirmServicePayment:  { url: 'confirmServicePayment.do' },
    refundServicePaymentForService: {
        url: 'refundServicePaymentForService.do', type: 'update',
        tranargs: { args: ['servicePayment.referMoney', 'serviceReceipt.realMoney', 'serviceReceipt.cash', 'serviceReceipt.bank', 'serviceReceipt.checkv', 'serviceReceipt.advance'] }
    },
    sendServicePayment:     { url: 'sendServicePayment.do' },
    queryServicePaymentBySpid: {
        url: 'queryServicePaymentBySpid.do', type: 'query',
        tranargs: [{ result: 'servicePayment', args: ['advanceMoney', 'serviceMoney', 'referMoney'] }]
    },
    queryServiceReceiptBySrId: {
        url: 'queryServiceReceiptBySrId.do', type: 'query',
        tranargs: [{ result: 'serviceReceipt', args: ['realMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'advance'] }]
    },
    queryServicePaymentForNotInitBySrId: {
        url: 'queryServicePaymentForNotInitBySrId.do', type: 'query',
        tranargs: [
            { result: 'servicePayments', args: ['advanceMoney', 'serviceMoney', 'referMoney'] },
            { result: 'servicePayments-serviceReceipt', args: ['realMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'advance'] }
        ]
    },
    queryServicePaymentByOrderId: {
        url: 'queryServicePaymentByOrderId.do', type: 'query',
        tranargs: [
            { result: 'servicePayments', args: ['advanceMoney', 'serviceMoney', 'referMoney'] },
            { result: 'servicePayments-serviceReceipt', args: ['realMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'advance'] }
        ]
    },
    updateServicePayment: {
        url: 'updateServicePayment.do', type: 'update',
        tranargs: { args: ['servicePayment.referMoney', 'serviceReceipt.cash', 'serviceReceipt.cash', 'serviceReceipt.bank', 'serviceReceipt.checkv', 'serviceReceipt.advance'] }
    },

    // ===== 收据 receipt =====
    pageReceipt: {
        url: 'pageReceipt.do', type: 'query',
        tranargs: [{ result: 'paging-data', args: [] }]
    },

    // ===== 代收款 proxyPayment =====
    pageProxyPayment: {
        url: 'pageProxyPayment.do', type: 'query',
        tranargs: [
            { result: 'paging-data', args: ['referMoney'] },
            { result: 'paging-data-proxyReceipt', args: ['realMoney', 'cash', 'bank', 'checkv'] }
        ]
    },
    queryProxyPayment: {
        url: 'queryProxyPayment.do', type: 'query',
        tranargs: [
            { result: 'proxyPayment', args: ['referMoney'] },
            { result: 'proxyPayment-proxyReceipt', args: ['realMoney', 'cash', 'bank', 'checkv'] }
        ]
    },
    queryProxyReceiptByPrId: {
        url: 'queryProxyReceiptByPrId.do', type: 'query',
        tranargs: [{ result: 'proxyReceipt', args: ['realMoney', 'cash', 'bank', 'checkv'] }]
    },
    addProxyPayment: {
        url: 'addProxyPayment.do', type: 'update',
        tranargs: {
            args: ['proxyPayment.referMoney'],
            query: [{ result: 'proxyPayment', args: ['referMoney'] }]
        }
    },
    collectProxyPayment: {
        url: 'collectProxyPayment.do', type: 'update',
        tranargs: { args: ['proxyPayment.referMoney', 'proxyReceipt.cash', 'proxyReceipt.bank', 'proxyReceipt.checkv'] }
    },
    refundProxyPayment: {
        url: 'refundProxyPayment.do', type: 'update',
        tranargs: {
            args: ['proxyPayment.referMoney'],
            query: [{ result: 'proxyPayment', args: ['referMoney'] }]
        }
    },
    confirmProxyPayment:    { url: 'confirmProxyPayment.do' },
    cancelProxyPayment:     { url: 'cancelProxyPayment.do' },

    // ===== 转换款 / POS paytran =====
    pagePaytran: {
        url: 'pagePaytran.do', type: 'query',
        tranargs: [{ result: 'paging-data', args: ['money'] }]
    },
    queryPaytran: {
        url: 'queryPaytran.do', type: 'query',
        tranargs: [{ result: 'paytrans', args: ['money'] }]
    },
    queryPaytranByPtid: {
        url: 'queryPaytranByPtid.do', type: 'query',
        tranargs: [{ result: 'paytran', args: ['money'] }]
    },
    sendPaytran:            { url: 'sendPaytran.do' },
    addPaytran: {
        url: 'addPaytran.do', type: 'update',
        tranargs: {
            args: ['paytran.money'],
            query: [{ result: 'paytran', args: ['money'] }]
        }
    },
    checkPaytran:           { url: 'checkPaytran.do' },
    cancelPaytran:          { url: 'cancelPaytran.do' },
    deletePaytran:          { url: 'deletePaytran.do' },
    posPay:                 { url: 'pospay.do' },
    codepay: {
        url: 'codepay.do', type: 'update',
        tranargs: {
            args: ['paytran.money'],
            query: [{ result: 'paytran', args: ['money'] }]
        }
    },

    // ===== 活动收款 activityPayment =====
    pageActivityPayment: {
        url: 'pageActivityPayment.do', type: 'query',
        tranargs: [{ result: 'paging-data', args: ['money', 'cash', 'bank', 'coupon'] }]
    },
    queryActivityPaymentByNo: {
        url: 'queryActivityPaymentByNo.do', type: 'query',
        tranargs: [{ result: 'activityPayments', args: ['money'] }]
    },
    queryActivityPaymentByArid: {
        url: 'queryActivityPaymentByArid.do', type: 'query',
        tranargs: [{ result: 'activityPayments', args: ['money'] }]
    },
    createActivityPayment: {
        url: 'createActivityPayment.do', type: 'update',
        tranargs: { args: ['activityPayment.money'] }
    },
    collectActivityPayment: {
        url: 'collectActivityPayment.do', type: 'update',
        tranargs: { args: ['activityReceipt.cash', 'activityReceipt.bank', 'activityReceipt.coupon'] }
    },
    countActivityPayment:   { url: 'countActivityPayment.do' },
    queryActivityReceiptByArid: {
        url: 'queryActivityReceiptByArid.do', type: 'query',
        tranargs: [{ result: 'activityReceipt', args: ['cash', 'bank', 'coupon'] }]
    },

    // ===== 功能配置 paymentFunction =====
    queryPaymentFunction:   { url: 'queryPaymentFunction.do' },

    // ===== 钱包 wallet =====
    pageWallet: {
        url: 'pageWallet.do', type: 'query',
        tranargs: [{ result: 'paging-data', args: ['balance', 'amount'] }]
    },
    queryWallet: {
        url: 'queryWallet.do', type: 'query',
        tranargs: [{ result: 'wallet', args: ['balance', 'amount'] }]
    },
    applyWallet:            { url: 'applyWallet.do' },
    bindWallet:             { url: 'bindWallet.do' },
    updateWallet:           { url: 'updateWallet.do' },
    confirmWallet:          { url: 'confirmWallet.do' },
    freezeWallet:           { url: 'freezeWallet.do' },
    unfreezeWallet:         { url: 'unfreezeWallet.do' },
    consumeWallet: {
        url: 'consumeWallet.do', type: 'update',
        tranargs: { args: ['wallet.amount'] }
    },
    rechargeWallet: {
        url: 'rechargeWallet.do', type: 'update',
        tranargs: { args: ['wallet.amount'] }
    },
    withdrawWallet: {
        url: 'withdrawWallet.do', type: 'update',
        tranargs: { args: ['wallet.amount'] }
    },
    consentWallet:          { url: 'consentWallet.do' },
    transferWallet: {
        url: 'transferWallet.do', type: 'update',
        tranargs: { args: ['wallet.amount'] }
    },
    approveWallet:          { url: 'approveWallet.do' },

    // ===== 钱包银行卡 walletard =====
    queryWalletard:         { url: 'queryWalletard.do' },
    bindWalletard:          { url: 'bindWalletard.do' },
    confirmWalletard:       { url: 'confirmWalletard.do' },
    unbindWalletard:        { url: 'unbindWalletard.do' },
    deleteWalletard:        { url: 'deleteWalletard.do' },

    // ===== 钱包交易记录 walletran =====
    pageWalletran: {
        url: 'pageWalletran.do', type: 'query',
        tranargs: [{ result: 'paging-data', args: ['amount'] }]
    },
    queryWalletran: {
        url: 'queryWalletran.do', type: 'query',
        tranargs: [{ result: 'walletrans', args: ['amount'] }]
    },

    // ===== 钱包资源 walletres =====
    queryWalletres:         { url: 'queryWalletres.do' },
    addWalletres:           { url: 'addWalletres.do' },
    deleteWalletres:        { url: 'deleteWalletres.do' },

    // ===== 支付签约 paymentContract =====
    pagePaymentContract:    { url: 'pagePaymentContract.do' },
    pollingPaymentContract: { url: 'pollingPaymentContract.do' },
    queryPaymentContract:   { url: 'queryPaymentContract.do' },
    sendPaymentContractForAuth: { url: 'sendPaymentContractForAuth.do' },
    sendPaymentContract:    { url: 'sendPaymentContract.do' },
    redirectPaymentContract:{ url: 'redirectPaymentContract.do' },
    viewPaymentContract:    { url: 'viewPaymentContract.do' },
    signPaymentContractForCompany:  { url: 'signPaymentContractForCompany.do' },
    signPaymentContractForCustomer: { url: 'signPaymentContractForCustomer.do' },
    addPaymentContract:     { url: 'addPaymentContract.do' },
    affixPaymentContract:   { url: 'affixPaymentContract.do' },
    expirePaymentContract:  { url: 'expirePaymentContract.do' },
    filingPaymentContract:  { url: 'filingPaymentContract.do' },

    // ===== 金蝶同步记录 kingdeeRecord =====
    pageKingdeeRecord:      { url: 'pageKingdeeRecord.do' },
    addKingdeeRecord:       { url: 'addKingdeeRecord.do' },

    // ===== 对账单 statement =====
    pageStatement: {
        url: 'pageStatement.do', type: 'query',
        tranargs: [{ result: 'paging-data', args: ['price', 'fee', 'rate'] }]
    },

    // ===== 外销款项 oalesPayment =====
    pageOalesPayment: {
        url: 'pageOalesPayment.do', type: 'query',
        tranargs: [
            { result: 'paging-data', args: ['referMoney'] },
            { result: 'paging-data-oalesReceipt', args: ['realMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'advance', 'coupon'] },
            { result: 'paging-data-oales', args: ['total', 'maling', 'coupon', 'depositpay', 'fullpay', 'amount', 'venderMaling'] }
        ]
    },
    queryOalesPaymentByOrderId: {
        url: 'queryOalesPaymentByOrderId.do', type: 'query',
        tranargs: [
            { result: 'oalesPayments', args: ['referMoney'] },
            { result: 'oalesPayments-oalesReceipt', args: ['realMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'advance', 'coupon'] },
            { result: 'oalesPayments-oales', args: ['total', 'maling', 'coupon', 'depositpay', 'fullpay', 'amount', 'venderMaling'] }
        ]
    },
    queryOalesPaymentByOid: {
        url: 'queryOalesPaymentByOid.do', type: 'query',
        tranargs: [
            { result: 'oalesPayments', args: ['referMoney'] },
            { result: 'oalesPayments-oalesReceipt', args: ['realMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'advance', 'coupon'] },
            { result: 'oalesPayments-oales', args: ['total', 'maling', 'coupon', 'depositpay', 'fullpay', 'amount', 'venderMaling'] }
        ]
    },
    queryOalesReceiptByOrId: {
        url: 'queryOalesReceiptByOrId.do', type: 'query',
        tranargs: [{ result: 'oalesReceipt', args: ['realMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'advance', 'coupon'] }]
    },
    queryOalesPaymentForNotInitByOrid: {
        url: 'queryOalesPaymentForNotInitByOrid.do', type: 'query',
        tranargs: [
            { result: 'oalesPayments', args: ['referMoney'] },
            { result: 'oalesPayments-oalesReceipt', args: ['realMoney', 'cash', 'bank', 'checkv', 'installment', 'accounts', 'advance', 'coupon'] },
            { result: 'oalesPayments-oales', args: ['total', 'maling', 'coupon', 'depositpay', 'fullpay', 'amount', 'venderMaling'] }
        ]
    },
    addOalesPayment: {
        url: 'addOalesPayment.do', type: 'update',
        tranargs: {
            args: ['oalesPayments.referMoney'],
            query: [{ result: 'oalesPayments', args: ['referMoney'] }]
        }
    },
    cancelOalesPayment:     { url: 'cancelOalesPayment.do' },
    collectOalesPayment: {
        url: 'collectOalesPayment.do', type: 'update',
        tranargs: { args: ['oalesReceipt.realMoney', 'oalesReceipt.cash', 'oalesReceipt.bank', 'oalesReceipt.checkv', 'oalesReceipt.advance', 'oalesReceipt.coupon'] }
    },
    refundOalesPayment: {
        url: 'refundOalesPayment.do', type: 'update',
        tranargs: { args: ['oalesReceipt.realMoney', 'oalesReceipt.cash', 'oalesReceipt.bank', 'oalesReceipt.checkv', 'oalesReceipt.advance', 'oalesReceipt.coupon'] }
    },
    updateOalesPayment: {
        url: 'updateOalesPayment.do', type: 'update',
        tranargs: { args: ['oalesReceipt.realMoney', 'oalesReceipt.cash', 'oalesReceipt.bank', 'oalesReceipt.checkv', 'oalesReceipt.advance', 'oalesReceipt.coupon'] }
    },
    confirmOalesPayment:    { url: 'confirmOalesPayment.do' },

    // ===== 支付渠道 alipay / codepay / key =====
    alipay: {
        url: 'alipay.do', type: 'update',
        tranargs: { args: ['wxpay.paymentMoney'] }
    },
    updateKey:              { url: 'updateKey.do' }
}});

// ===== 功能权限 right（paymentFunction 配置页用，扩展 api.right 命名空间） =====
api.right = api.right || {};
$.extend(api.right, {
    queryPaymentFunctionRight:  { url: 'queryPaymentFunctionRight.do' },
    updatePaymentFunctionRight: { url: 'updatePaymentFunctionRight.do' }
});

// ===== tools.advance：合同/主材预付款余额悬浮提示（被 decoration 等模块引用） =====
// 用法：app.tools.advance.info($el, orderId)
if (!window.tools) { window.tools = {}; }
$.extend(tools, {
    advance: {
        info: function (content, orderId) {
            app.post(api.payment.queryAdvancePaymentByOrderId, {
                'advancePayment.decoration.orderId': orderId
            }, function (res) {
                app.showTip(content, '合同预付款:' + res.balanceAdvance + '<br>主材预付款:' + res.materialAdvance, 'bottom');
            });
        }
    }
});
