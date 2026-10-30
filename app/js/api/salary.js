/**
 * app/js/api/salary.js —— salary（薪资/工费/扣款/质保金）模块 API 定义
 * 对齐旧 WebContent/js/api/salary.js。
 *
 * 说明：
 *   - 工人工费 workerSalary / 设计师工费 designerSalary / 扣款 withhold / 质保金 workerBalance
 *     / 装修提成 decorationSalary / 主材提成 materialSalary / 薪资 salary 均在此注册。
 *   - 金额精度（tranargs）：page/query 接口声明响应字段÷1000，add/update 接口声明请求字段×1000。
 *   - ds 数据源：枚举（status/type/oneType/twoType/thrType/forType/SalaryTwoType/withholdType/
 *     withholdStatus/stage/statusBalance）来自 ds/salary.json。
 */

// ===== 页面路由（菜单 mid 对应这里）=====
$.extend(api.index, {
    salaryIndex:               { url: 'views/salary/salary.html' },
    workerSalaryIndex:         { url: 'views/salary/workerSalary.html' },
    workerBalanceIndex:        { url: 'views/salary/workerBalance.html' },
    withholdIndex:             { url: 'views/salary/withhold.html' },
    decorationSalaryIndex:     { url: 'views/salary/decorationSalary.html' },
    materialSalaryIndex:       { url: 'views/salary/materialSalary.html' },
    designerSalaryIndex:       { url: 'views/salary/designerSalary.html' },
    salary4commonIndex:        { url: 'views/salary/salary4common.html' },
    workerSalary4detailIndex:  { url: 'views/salary/workerSalary4detail.html' },
    workerSalary4frameIndex:   { url: 'views/salary/workerSalary4frame.html' },
    workerSalary4queryIndex:   { url: 'views/salary/workerSalary4query.html' }
});

// ===== 数据源 ds：薪资枚举 =====
$.extend(api.ds, {
    salary: { url: 'ds/salary.json', demo: true, cache: 'jsonsalary' }
});

// ===== 接口定义 =====
$.extend(api, {
    salary: {

        // ===== 工人工费 workerSalary =====
        pageWorkerSalary: {
            url: 'pageWorkerSalary.do',
            type: 'query',
            tranargs: [{ result: 'paging-data', args: ['money', 'deposit', 'salary'] }, { result: 'paging-data-decoration-house', args: ['totalArea'] }]
        },
        pageWorkerSalaryByUserId: {
            url: 'pageWorkerSalaryByUserId.do',
            type: 'query',
            tranargs: [{ result: 'paging-data', args: ['money', 'deposit', 'salary'] }]
        },
        queryWorkerSalary: {
            url: 'queryWorkerSalary.do',
            type: 'query',
            tranargs: [{ result: 'workerSalarys', args: ['money', 'deposit', 'salary'] }]
        },
        queryWorkerSalaryByWsid: {
            url: 'queryWorkerSalaryByWsid.do',
            type: 'query',
            tranargs: [{ result: 'workerSalary', args: ['money', 'deposit', 'salary'] }]
        },
        queryWorkerSalaryByOrderId: {
            url: 'queryWorkerSalaryByOrderId.do',
            type: 'query',
            tranargs: [{ result: 'workerSalarys', args: ['money', 'deposit', 'salary'] }]
        },
        addWorkerSalary: {
            url: 'addWorkerSalary.do',
            type: 'update',
            tranargs: { args: ['workerSalary.money'] }
        },
        updateWorkerSalary: {
            url: 'updateWorkerSalary.do',
            type: 'update',
            tranargs: { args: ['workerSalary.money'] }
        },
        cutWorkerSalary: {
            url: 'cutWorkerSalary.do',
            type: 'update',
            tranargs: { args: ['workerSalary.money'] }
        },
        tranWorkerSalary: {
            url: 'tranWorkerSalary.do',
            type: 'update',
            tranargs: { args: ['workerSalary.money'] }
        },
        payWorkerSalary: {
            url: 'payWorkerSalary.do',
            type: 'update',
            tranargs: { args: ['workerSalary.money'] }
        },
        adoptWorkerSalary:           { url: 'adoptWorkerSalary.do' },
        rejectWorkerSalary:          { url: 'rejectWorkerSalary.do' },
        checkWsorkerSalary:          { url: 'checkWsorkerSalary.do' },
        deleteWorkerSalary:          { url: 'deleteWorkerSalary.do' },
        batchImportWorkerSalary:     { url: 'batchImportWorkerSalary.do' },
        importWorkerSalary:          { url: 'importWorkerSalary.do' },
        sendWorkerSalary:            { url: 'sendWorkerSalary.do' },
        cancelWorkerSalary:          { url: 'cancelWorkerSalary.do' },
        batchWorkerSalary:           { url: 'batchWorkerSalary.do' },
        adoptWorkerSalaryForTimeRange: { url: 'adoptWorkerSalaryForTimeRange.do' },

        // ===== 设计师工费 designerSalary =====
        pageDesignerSalary: {
            url: 'pageDesignerSalary.do',
            type: 'query',
            tranargs: [{ result: 'paging-data', args: ['designerSalary.money'] }]
        },
        addDesignerSalary: {
            url: 'addDesignerSalary.do',
            type: 'update',
            tranargs: { args: ['designerSalary.money'] }
        },
        updateDesignerSalary: {
            url: 'updateDesignerSalary.do',
            type: 'update',
            tranargs: { args: ['designerSalary.money'] }
        },
        adoptDesignerSalary:  { url: 'adoptDesignerSalary.do' },
        rejectDesignerSalary: { url: 'rejectDesignerSalary.do' },
        deleteDesignerSalary: { url: 'deleteDesignerSalary.do' },

        // ===== 工人质保金 workerBalance =====
        pageWorkerBalance: {
            url: 'pageWorkerBalance.do',
            type: 'query',
            tranargs: [{ result: 'paging-data', args: ['deposit', 'salary', 'toplimit'] }]
        },
        updateWorkerBalance: {
            url: 'updateWorkerBalance.do',
            type: 'update',
            tranargs: { args: ['workerBalance.toplimit'] }
        },
        addWorkerBalance:     { url: 'addWorkerBalance.do' },
        collectWorkerDeposit: {
            url: 'collectWorkerDeposit.do',
            type: 'update',
            tranargs: { args: ['workerSalary.money'] }
        },
        drawWorkerDeposit: {
            url: 'drawWorkerDeposit.do',
            type: 'update',
            tranargs: { args: ['workerSalary.money'] }
        },

        // ===== 薪资 salary =====
        pageSalary: {
            url: 'pageSalary.do',
            type: 'query',
            tranargs: [{ result: 'paging-data', args: ['money'] }]
        },
        addSalary: {
            url: 'addSalary.do',
            type: 'update',
            tranargs: { args: ['salary.money'] }
        },
        passSalary:   { url: 'passSalary.do' },
        rejectSalary: { url: 'rejectSalary.do' },
        cancelSalary: { url: 'cancelSalary.do' },

        // ===== 扣款 withhold =====
        pageWithhold: {
            url: 'pageWithhold.do',
            type: 'query',
            tranargs: [{ result: 'paging-data', args: ['money'] }]
        },
        queryWithhold: {
            url: 'queryWithhold.do',
            type: 'query',
            tranargs: [{ result: 'withholds', args: ['money'] }]
        },
        addWithhold: {
            url: 'addWithhold.do',
            type: 'update',
            tranargs: { args: ['withhold.money'] }
        },
        updateWithholdForStatus: { url: 'updateWithholdForStatus.do' },

        // ===== 工费图片 salaryDrawing =====
        querySalaryDrawing:   { url: 'querySalaryDrawing.do' },
        addSalaryDrawing:     { url: 'addSalaryDrawing.do', server: 'salary', intercept: true },
        deleteSalaryDrawing:  { url: 'deleteSalaryDrawing.do', server: 'salary' },

        // ===== 装修提成 decorationSalary =====
        pageDecorationSalary: {
            url: 'pageDecorationSalary.do',
            type: 'query',
            tranargs: [
                { result: 'paging-data', args: ['money', 'rate'] },
                { result: 'paging-data-decoration', args: ['orderTotalPrice', 'quotationPrice', 'couponCut', 'thingCut', 'factPrice', 'precontractPrice', 'notSalesmanRate', 'discount'] }
            ]
        },

        // ===== 主材提成 materialSalary =====
        pageMaterialSalary: {
            url: 'pageMaterialSalary.do',
            type: 'query',
            tranargs: [
                { result: 'paging-data', args: ['money', 'rate'] },
                { result: 'paging-data-decoration', args: ['orderTotalPrice', 'quotationPrice', 'couponCut', 'thingCut', 'factPrice', 'precontractPrice', 'notSalesmanRate', 'discount'] },
                { result: 'paging-data-sales', args: ['total', 'maling', 'coupon', 'depositpay', 'fullpay', 'amount', 'venderMaling'] }
            ]
        }
    }
});
