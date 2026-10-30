/** app/js/quotation/quotationTest.js —— 报价公式计算版本对比测试（eval vs safeEval）
 *  对齐旧 quotationTest.html 内嵌测试：用例集（基础四则/优先级/小数/非法/越界），双实现结果与期望对比。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;

    var CONST = { MAX_FORMULA_VALUE: 10000000 };

    function evalCalculate(formula) {
        if (!formula || formula === '') return 0;
        formula = formula.replace(/\s+/g, '');
        try {
            var result = eval(formula);
            if (isNaN(result) || !isFinite(result)) return 0;
            if (result < 0 || result > CONST.MAX_FORMULA_VALUE) return 0;
            return result;
        } catch (e) { return 0; }
    }

    function safeEval(formula) {
        if (!formula || formula === '') return 0;
        formula = formula.replace(/\s+/g, '');
        var safePattern = /^[\d+\-*\/().a-zA-Z_]+$/;
        if (!safePattern.test(formula)) return 0;
        var dangerous = ['window', 'document', 'alert', 'console', 'function', 'return', 'this'];
        for (var i = 0; i < dangerous.length; i++) {
            if (formula.indexOf(dangerous[i]) !== -1) return 0;
        }
        try {
            var result = new Function('return (' + formula + ')')();
            if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) return 0;
            if (result < 0 || result > CONST.MAX_FORMULA_VALUE) return 0;
            return result;
        } catch (e) { return 0; }
    }

    var testCases = [
        { id: 'test01', title: '简单加法', formula: '2 + 3', expected: 5 },
        { id: 'test02', title: '简单减法', formula: '10 - 4', expected: 6 },
        { id: 'test03', title: '简单乘法', formula: '3 * 4', expected: 12 },
        { id: 'test04', title: '简单除法', formula: '8 / 2', expected: 4 },
        { id: 'test05', title: '运算优先级', formula: '2 + 3 * 4', expected: 14 },
        { id: 'test06', title: '括号优先', formula: '(2 + 3) * 4', expected: 20 },
        { id: 'test07', title: '小数运算', formula: '0.1 + 0.2', expected: 0.3 },
        { id: 'test08', title: '嵌套括号', formula: '((1 + 2) * (3 + 4))', expected: 21 },
        { id: 'test09', title: '空公式', formula: '', expected: 0 },
        { id: 'test10', title: '非法字符', formula: 'alert(1)', expected: 0 },
        { id: 'test11', title: '越界值', formula: '10000000000', expected: 0 },
        { id: 'test12', title: '负值', formula: '2 - 5', expected: -3 }
    ];

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { field: 'id', title: '用例', width: 90 },
            { field: 'title', title: '说明', width: 140 },
            { field: 'formula', title: '公式', width: 180 },
            { field: 'expected', title: '期望值', width: 100 },
            { field: 'evalResult', title: 'eval 结果', width: 110 },
            { field: 'safeResult', title: 'safeEval 结果', width: 120 },
            { field: 'evalPass', title: 'eval', width: 90, templet: function (d) { return '<span class="layui-badge ' + (d.evalPass ? 'layui-bg-green' : 'layui-bg-red') + '">' + (d.evalPass ? '通过' : '失败') + '<\/span>'; } },
            { field: 'safePass', title: 'safeEval', width: 100, templet: function (d) { return '<span class="layui-badge ' + (d.safePass ? 'layui-bg-green' : 'layui-bg-red') + '">' + (d.safePass ? '通过' : '失败') + '<\/span>'; } } ]] });

    function runTests() {
        var rows = [], evalPassCount = 0, safePassCount = 0;
        $.each(testCases, function (i, t) {
            var e = evalCalculate(t.formula);
            var s = safeEval(t.formula);
            var ePass = Math.abs(e - t.expected) < 0.0001;
            var sPass = Math.abs(s - t.expected) < 0.0001;
            if (ePass) evalPassCount++;
            if (sPass) safePassCount++;
            rows.push($.extend({}, t, { evalResult: e, safeResult: s, evalPass: ePass, safePass: sPass }));
        });
        table.reload('resultTable', { data: rows });
        $('#summary').text('eval: ' + evalPassCount + '/' + testCases.length + ' 通过 ｜ safeEval: ' + safePassCount + '/' + testCases.length + ' 通过');
    }

    $('#btnRun').on('click', runTests);
    runTests();
});
}); // end app.ready
