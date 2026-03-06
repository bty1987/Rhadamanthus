# 生产环境代码优化安全保障方案

> 文档版本：v1.0
> 创建日期：2026-03-05
> 适用场景：quotationPart.js 等生产环境核心模块重构

---

## 📋 目录

- [1. 核心原则](#1-核心原则)
- [2. 风险评估体系](#2-风险评估体系)
- [3. 测试保障策略](#3-测试保障策略)
- [4. 灰度发布方案](#4-灰度发布方案)
- [5. 实施流程](#5-实施流程)
- [6. 回滚预案](#6-回滚预案)
- [7. 监控告警](#7-监控告警)
- [8. 检查清单](#8-检查清单)

---

## 1. 核心原则

### 1.1 生产环境重构黄金法则

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│   │  测试   │───▶│  对比   │───▶│  灰度   │───▶│  全量   │  │
│   │  环境   │    │  验证   │    │  发布   │    │  发布   │  │
│   └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
│                                                             │
│   每一步都可验证、可回滚、可对比                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 不可妥协的原则

| 原则 | 说明 | 违规后果 |
|------|------|----------|
| **无测试不上线** | 任何改动必须有测试覆盖 | 拒绝发布 |
| **无回滚不上线** | 必须有可执行的回滚方案 | 拒绝发布 |
| **无监控不上线** | 关键指标必须有监控 | 拒绝发布 |
| **双人审查** | 核心代码改动需两人以上审查 | 拒绝合并 |
| **数据可对比** | 新旧版本结果必须可对比验证 | 拒绝发布 |

---

## 2. 风险评估体系

### 2.1 风险等级矩阵

```
                    影响范围
                    低    中    高
         ┌────────┬──────┬──────┬──────┐
    改  │ 低    │ 低   │ 中   │ 高   │
    动  ├────────┼──────┼──────┼──────┤
    范  │ 中    │ 低   │ 中   │ 高*  │  ← quotationPart.js
    围  ├────────┼──────┼──────┼──────┤
         │ 高    │ 中   │ 高*  │ 极高*│
         └────────┴──────┴──────┴──────┘
```

**quotationPart.js 风险评级：高**

| 风险项 | 等级 | 说明 |
|--------|------|------|
| 影响用户 | 高 | 所有使用报价功能的用户 |
| 业务影响 | 高 | 报价计算错误直接影响订单金额 |
| 改动范围 | 高 | 核心计算逻辑大规模改动 |
| 依赖关系 | 中 | 多个模块依赖此文件 |

### 2.2 风险量化评估

```javascript
/**
 * 风险评估计算器
 */
var RiskAssessment = {
    // 风险因子权重
    factors: {
        userImpact: 0.3,      // 用户影响范围
        businessImpact: 0.3,   // 业务影响程度
        changeComplexity: 0.2, // 改动复杂度
        dependencyCount: 0.2   // 依赖数量
    },

    /**
     * 计算风险分数
     * @param {Object} params - 评估参数
     * @returns {Object} 风险评估结果
     */
    calculate: function(params) {
        var score =
            params.userImpact * this.factors.userImpact +
            params.businessImpact * this.factors.businessImpact +
            params.changeComplexity * this.factors.changeComplexity +
            params.dependencyCount * this.factors.dependencyCount;

        var level = this.getLevel(score);
        var requirements = this.getRequirements(level);

        return {
            score: score,
            level: level,
            requirements: requirements
        };
    },

    /**
     * 获取风险等级
     */
    getLevel: function(score) {
        if (score >= 4) return 'CRITICAL';
        if (score >= 3) return 'HIGH';
        if (score >= 2) return 'MEDIUM';
        return 'LOW';
    },

    /**
     * 获取对应等级的要求
     */
    getRequirements: function(level) {
        var map = {
            'CRITICAL': {
                testCoverage: '90%+',
                reviewers: 3,
                canaryRelease: true,
                autoRollback: true,
                businessApproval: true
            },
            'HIGH': {
                testCoverage: '80%+',
                reviewers: 2,
                canaryRelease: true,
                autoRollback: true,
                businessApproval: true
            },
            'MEDIUM': {
                testCoverage: '70%+',
                reviewers: 2,
                canaryRelease: false,
                autoRollback: true,
                businessApproval: false
            },
            'LOW': {
                testCoverage: '60%+',
                reviewers: 1,
                canaryRelease: false,
                autoRollback: false,
                businessApproval: false
            }
        };
        return map[level];
    }
};

// 示例：quotationPart.js 风险评估
var quotationRisk = RiskAssessment.calculate({
    userImpact: 5,        // 1-5分，影响所有报价用户
    businessImpact: 5,    // 1-5分，报价计算是核心业务
    changeComplexity: 4,  // 1-5分，大规模重构
    dependencyCount: 4    // 1-5分，多个模块依赖
});

console.log(quotationRisk);
// 输出: { score: 4.5, level: 'CRITICAL', requirements: {...} }
```

---

## 3. 测试保障策略

### 3.1 测试金字塔

```
                    ┌──────────────┐
                    │   E2E测试    │  10%  真实场景端到端测试
                    │    (5个)     │
                    ├──────────────┤
                    │  集成测试    │  20%  模块间交互测试
                    │   (10个)     │
                    ├──────────────┤
                    │  单元测试    │  70%  函数级测试
                    │   (35个)     │
                    └──────────────┘
```

### 3.2 核心测试用例设计

#### (1) FormulaParser 测试套件

```javascript
/**
 * FormulaParser 单元测试
 * 文件: test/quotation/formulaParser.test.js
 */
describe('FormulaParser', function() {

    // ===== 基础运算测试 =====
    describe('基础运算', function() {
        test('加法: 2 + 3 = 5', function() {
            expect(FormulaParser.parse('2 + 3', {})).toBe(5);
        });

        test('减法: 10 - 4 = 6', function() {
            expect(FormulaParser.parse('10 - 4', {})).toBe(6);
        });

        test('乘法: 3 * 4 = 12', function() {
            expect(FormulaParser.parse('3 * 4', {})).toBe(12);
        });

        test('除法: 15 / 3 = 5', function() {
            expect(FormulaParser.parse('15 / 3', {})).toBe(5);
        });

        test('混合运算: 2 + 3 * 4 = 14', function() {
            expect(FormulaParser.parse('2 + 3 * 4', {})).toBe(14);
        });

        test('括号优先级: (2 + 3) * 4 = 20', function() {
            expect(FormulaParser.parse('(2 + 3) * 4', {})).toBe(20);
        });
    });

    // ===== 变量替换测试 =====
    describe('变量替换', function() {
        test('单个变量: {a} + {b}', function() {
            var result = FormulaParser.parse('{a} + {b}', {a: 10, b: 5});
            expect(result).toBe(15);
        });

        test('多个相同变量: {a} * {a}', function() {
            var result = FormulaParser.parse('{a} * {a}', {a: 5});
            expect(result).toBe(25);
        });

        test('嵌套公式: ({a} + {b}) * {c}', function() {
            var result = FormulaParser.parse('({a} + {b}) * {c}', {a: 10, b: 5, c: 2});
            expect(result).toBe(30);
        });
    });

    // ===== Math 函数测试 =====
    describe('Math 函数', function() {
        test('Math.max: Math.max({a}, {b})', function() {
            var result = FormulaParser.parse('Math.max({a}, {b})', {a: 10, b: 5});
            expect(result).toBe(10);
        });

        test('Math.min: Math.min({a}, {b})', function() {
            var result = FormulaParser.parse('Math.min({a}, {b})', {a: 10, b: 5});
            expect(result).toBe(5);
        });
    });

    // ===== 边界值测试 =====
    describe('边界值', function() {
        test('零值: 0 + 0 = 0', function() {
            expect(FormulaParser.parse('0 + 0', {})).toBe(0);
        });

        test('负数: -5 + 3 = -2', function() {
            expect(FormulaParser.parse('-5 + 3', {})).toBe(-2);
        });

        test('小数: 0.1 + 0.2 ≈ 0.3', function() {
            var result = FormulaParser.parse('0.1 + 0.2', {});
            expect(Math.abs(result - 0.3)).toBeLessThan(0.0001);
        });

        test('极大值: 999999999', function() {
            expect(FormulaParser.parse('999999999', {})).toBe(999999999);
        });
    });

    // ===== 异常处理测试 =====
    describe('异常处理', function() {
        test('空字符串返回 0', function() {
            expect(FormulaParser.parse('', {})).toBe(0);
        });

        test('非法字符返回 0', function() {
            expect(FormulaParser.parse('alert(1)', {})).toBe(0);
        });

        test('NaN 返回 0', function() {
            expect(FormulaParser.parse('NaN', {})).toBe(0);
        });

        test('Infinity 返回 0', function() {
            expect(FormulaParser.parse('1 / 0', {})).toBe(0);
        });
    });

    // ===== 安全性测试 =====
    describe('安全性', function() {
        test('阻止 window 对象访问', function() {
            expect(FormulaParser.parse('window.location', {})).toBe(0);
        });

        test('阻止函数调用', function() {
            expect(FormulaParser.parse('console.log("xss")', {})).toBe(0);
        });

        test('阻止 this 关键字', function() {
            expect(FormulaParser.parse('this.toString()', {})).toBe(0);
        });
    });

    // ===== 性能测试 =====
    describe('性能', function() {
        test('1000次计算在 100ms 内完成', function() {
            var start = performance.now();
            for (var i = 0; i < 1000; i++) {
                FormulaParser.parse('({a} + {b}) * {c}', {a: 10, b: 5, c: 2});
            }
            var duration = performance.now() - start;
            expect(duration).toBeLessThan(100);
        });
    });
});
```

#### (2) 报价计算对比测试

```javascript
/**
 * 新旧版本计算结果对比测试
 * 确保重构后计算结果完全一致
 */
var ComparisonTest = (function() {

    /**
     * 批量对比测试
     * @param {Array} testCases - 测试用例数组
     * @returns {Object} 测试结果
     */
    function runComparison(testCases) {
        var results = {
            total: testCases.length,
            passed: 0,
            failed: 0,
            errors: []
        };

        testCases.forEach(function(testCase, index) {
            try {
                // 旧版本计算
                var oldResult = calculateOldVersion(testCase.input);

                // 新版本计算
                var newResult = calculateNewVersion(testCase.input);

                // 对比结果（允许 0.001 的浮点误差）
                if (Math.abs(oldResult - newResult) < 0.001) {
                    results.passed++;
                } else {
                    results.failed++;
                    results.errors.push({
                        case: index + 1,
                        name: testCase.name,
                        input: testCase.input,
                        expected: oldResult,
                        actual: newResult,
                        diff: newResult - oldResult
                    });
                }
            } catch (e) {
                results.failed++;
                results.errors.push({
                    case: index + 1,
                    name: testCase.name,
                    error: e.message
                });
            }
        });

        return results;
    }

    /**
     * 旧版本计算（eval 方式）
     */
    function calculateOldVersion(input) {
        var expres = input.formula;
        var variables = input.variables || {};

        // 原有的变量替换逻辑
        for (var key in variables) {
            if (variables.hasOwnProperty(key)) {
                var regex = new RegExp('\\{' + key + '\\}', 'g');
                expres = expres.replace(regex, variables[key]);
            }
        }

        // 原有的 eval 计算
        try {
            var result = eval(expres);
            return isNaN(result) ? 0 : result;
        } catch (e) {
            return 0;
        }
    }

    /**
     * 新版本计算（FormulaParser）
     */
    function calculateNewVersion(input) {
        return FormulaParser.parse(input.formula, input.variables || {});
    }

    /**
     * 生成测试报告
     */
    function generateReport(results) {
        console.log('===== 计算对比测试报告 =====');
        console.log('总用例数: ' + results.total);
        console.log('通过: ' + results.passed + ' (' + (results.passed / results.total * 100).toFixed(2) + '%)');
        console.log('失败: ' + results.failed + ' (' + (results.failed / results.total * 100).toFixed(2) + '%)');

        if (results.errors.length > 0) {
            console.log('\n===== 失败详情 =====');
            results.errors.forEach(function(err) {
                console.log('用例 ' + err.case + ': ' + err.name);
                if (err.error) {
                    console.log('  错误: ' + err.error);
                } else {
                    console.log('  期望值: ' + err.expected);
                    console.log('  实际值: ' + err.actual);
                    console.log('  差异: ' + err.diff);
                }
            });
        }

        return results.failed === 0;
    }

    return {
        run: runComparison,
        report: generateReport
    };

})();

// ==================== 使用示例 ====================

// 从生产环境收集的真实测试用例
var realTestCases = [
    { name: '标准工程量计算', input: { formula: '{a} + {b} * 2', variables: { a: 100, b: 50 } } },
    { name: '计价面积计算', input: { formula: 'Math.max({a}, {b})', variables: { a: 100, b: 120 } } },
    { name: '综合折扣计算', input: { formula: '({x} + {y}) * 0.95', variables: { x: 100000, y: 50000 } } },
    // ... 从生产环境日志中提取更多真实用例
];

var results = ComparisonTest.run(realTestCases);
var allPassed = ComparisonTest.report(results);

if (!allPassed) {
    console.error('对比测试失败！请检查计算逻辑！');
    process.exit(1);
}
```

#### (3) 端到端测试

```javascript
/**
 * E2E 测试场景
 * 模拟真实用户操作流程
 */
var E2ETest = (function() {

    var puppeteer = require('puppeteer');

    /**
     * 测试场景：创建完整报价
     */
    async function testCreateQuotation() {
        var browser = await puppeteer.launch({ headless: false });
        var page = await browser.newPage();

        try {
            // 1. 登录
            await page.goto('http://test.example.com/login.html');
            await page.type('#userId', 'test_user');
            await page.type('#password', 'test_pass');
            await page.click('#loginBtn');
            await page.waitForNavigation();

            // 2. 进入报价页面
            await page.goto('http://test.example.com/views/quotation/quotationPart.html?qid=TEST001');

            // 3. 等待页面加载完成
            await page.waitForSelector('#functionAreaDetailList');
            await page.waitForTimeout(2000);

            // 4. 添加功能区
            await page.click('#addDomainBtn');
            await page.select('#domainType', '1');
            await page.type('#domainName', '测试功能区');
            await page.type('#area', '100');
            await page.click('#saveDomainBtn');
            await page.waitForTimeout(1000);

            // 5. 添加报价项
            await page.click('.add-quote-btn');
            await page.waitForSelector('#quoteModal');

            // 6. 验证计算结果
            var totalPrice = await page.$eval('#sumLabSumMoney', function(el) {
                return parseFloat(el.textContent);
            });

            var discountPrice = await page.$eval('#sumLabDiscountMoney', function(el) {
                return parseFloat(el.textContent);
            });

            // 断言：总额应该 > 0
            if (totalPrice <= 0) {
                throw new Error('总额计算异常: ' + totalPrice);
            }

            // 断言：折后价应该 < 总额
            if (discountPrice >= totalPrice) {
                throw new Error('折扣计算异常: 总额=' + totalPrice + ', 折后=' + discountPrice);
            }

            console.log('E2E 测试通过！');
            return true;

        } catch (e) {
            console.error('E2E 测试失败:', e.message);
            // 截图保存
            await page.screenshot({ path: 'e2e_error.png' });
            return false;

        } finally {
            await browser.close();
        }
    }

    return {
        testCreateQuotation: testCreateQuotation
    };

})();
```

### 3.3 测试覆盖率要求

| 模块 | 单元测试覆盖率 | 集成测试 | E2E测试 |
|------|---------------|----------|---------|
| FormulaParser | 95%+ | ✅ | ❌ |
| CalculationService | 90%+ | ✅ | ✅ |
| QuoteManager | 85%+ | ✅ | ✅ |
| DomainManager | 80%+ | ✅ | ✅ |
| Renderer | 70%+ | ✅ | ✅ |

---

## 4. 灰度发布方案

### 4.1 灰度发布流程

```
┌─────────────────────────────────────────────────────────────┐
│                    灰度发布流程                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐    │
│  │  白名单  │──▶│  5%    │──▶│  20%   │──▶│  100%  │    │
│  │  用户   │   │  灰度   │   │  灰度   │   │  全量   │    │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘    │
│       │            │             │              │          │
│       ▼            ▼             ▼              ▼          │
│   观察期24h     观察期48h     观察期72h      持续监控       │
│   核心验证      数据对比      全面验证      自动监控        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 灰度实现代码

```javascript
/**
 * 灰度发布控制器
 * 基于用户特征进行灰度分流
 */
var CanaryRelease = (function() {

    // 配置
    var config = {
        // 灰度开关（可在数据库中配置，支持实时调整）
        enabled: false,

        // 当前灰度比例 (0-100)
        percentage: 0,

        // 白名单用户ID列表
        whitelist: ['U001', 'U002', 'U003'],

        // 黑名单用户ID列表（永不使用新版本）
        blacklist: ['U999', 'U998'],

        // 灰度版本标识
        canaryVersion: 'v2.0.0-optimized',
        stableVersion: 'v1.0.0-legacy'
    };

    /**
     * 初始化：从服务器加载配置
     */
    function init() {
        com.post(api.system.getCanaryConfig, {
            'module': 'quotationPart'
        }, function(res) {
            if (res.config) {
                config.enabled = res.config.enabled || false;
                config.percentage = res.config.percentage || 0;
                config.whitelist = res.config.whitelist || [];
                config.blacklist = res.config.blacklist || [];
            }
            console.log('[Canary] Config loaded:', config);
        });
    }

    /**
     * 判断用户是否使用新版本
     * @param {string} userId - 用户ID
     * @returns {boolean} 是否使用新版本
     */
    function shouldUseCanary(userId) {
        // 1. 检查灰度是否启用
        if (!config.enabled) {
            return false;
        }

        // 2. 检查黑名单（黑名单用户永远不用新版本）
        if (config.blacklist.indexOf(userId) !== -1) {
            return false;
        }

        // 3. 检查白名单（白名单用户始终使用新版本）
        if (config.whitelist.indexOf(userId) !== -1) {
            return true;
        }

        // 4. 基于用户ID的哈希值进行分流
        var hash = hashCode(userId);
        var bucket = hash % 100;

        // 5. 根据当前灰度比例判断
        return bucket < config.percentage;
    }

    /**
     * 字符串哈希函数
     * 生成 0-9999 之间的整数
     */
    function hashCode(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转换为32位整数
        }
        return Math.abs(hash) % 10000;
    }

    /**
     * 获取用户应该使用的版本
     */
    function getVersion(userId) {
        return shouldUseCanary(userId) ? config.canaryVersion : config.stableVersion;
    }

    /**
     * 记录灰度分流日志
     */
    function log(userId, version, action) {
        // 异步上报日志（不阻塞主流程）
        com.post(api.system.logCanaryAccess, {
            'userId': userId,
            'version': version,
            'action': action,
            'module': 'quotationPart',
            'timestamp': Date.now()
        }, null, false);
    }

    /**
     * 增加灰度比例
     */
    function increasePercentage(delta) {
        var newPercentage = Math.min(100, config.percentage + delta);
        updatePercentage(newPercentage);
    }

    /**
     * 回滚灰度
     */
    function rollback() {
        updatePercentage(0);
    }

    /**
     * 更新灰度比例
     */
    function updatePercentage(value) {
        com.post(api.system.updateCanaryConfig, {
            'module': 'quotationPart',
            'percentage': value
        }, function(res) {
            config.percentage = value;
            console.log('[Canary] Percentage updated to:', value);
        });
    }

    return {
        init: init,
        shouldUseCanary: shouldUseCanary,
        getVersion: getVersion,
        log: log,
        increase: increasePercentage,
        rollback: rollback
    };

})();

// ==================== 在页面中的使用 ====================

// 方案1：在页面加载时判断使用哪个版本的 JS 文件
(function() {
    var userId = params.userInfo ? params.userInfo.user.userId : null;

    if (userId && CanaryRelease.shouldUseCanary(userId)) {
        // 加载优化后的版本
        $.getScript('js/quotation/quotationPart.canary.js', function() {
            console.log('[Canary] Using optimized version');
            CanaryRelease.log(userId, 'canary', 'load');
        });
    } else {
        // 加载原始版本
        $.getScript('js/quotation/quotationPart.js', function() {
            console.log('[Stable] Using original version');
            CanaryRelease.log(userId, 'stable', 'load');
        });
    }
})();

// 方案2：在同一文件中使用分支逻辑
var QuotationModule = (function() {

    var userId = params.userInfo ? params.userInfo.user.userId : null;
    var useOptimized = CanaryRelease.shouldUseCanary(userId);

    if (useOptimized) {
        // 返回优化后的实现
        return OptimizedQuotationImpl;
    } else {
        // 返回原始实现
        return OriginalQuotationImpl;
    }

})();
```

### 4.3 灰度监控面板

```javascript
/**
 * 灰度监控面板
 * 实时展示新旧版本的关键指标对比
 */
var CanaryMonitor = (function() {

    /**
     * 获取监控数据
     */
    function fetchMetrics() {
        com.post(api.system.getCanaryMetrics, {
            'module': 'quotationPart',
            'startTime': Date.now() - 86400000, // 最近24小时
            'endTime': Date.now()
        }, function(res) {
            renderDashboard(res.metrics);
        });
    }

    /**
     * 渲染监控面板
     */
    function renderDashboard(metrics) {
        var html = '';

        // 1. 用户分布
        html += '<div class="canary-section">';
        html += '<h3>用户分布</h3>';
        html += '<table class="table">';
        html += '<tr><th>版本</th><th>用户数</th><th>占比</th></tr>';
        html += '<tr>';
        html += '<td>旧版本 (stable)</td>';
        html += '<td>' + metrics.stableUsers + '</td>';
        html += '<td>' + (metrics.stableUsers * 100 / metrics.totalUsers).toFixed(2) + '%</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td>新版本 (canary)</td>';
        html += '<td>' + metrics.canaryUsers + '</td>';
        html += '<td>' + (metrics.canaryUsers * 100 / metrics.totalUsers).toFixed(2) + '%</td>';
        html += '</tr>';
        html += '</table>';
        html += '</div>';

        // 2. 错误率对比
        html += '<div class="canary-section">';
        html += '<h3>错误率对比</h3>';
        html += '<table class="table">';
        html += '<tr><th>版本</th><th>请求数</th><th>错误数</th><th>错误率</th></tr>';
        html += '<tr>';
        html += '<td>旧版本</td>';
        html += '<td>' + metrics.stableRequests + '</td>';
        html += '<td>' + metrics.stableErrors + '</td>';
        html += '<td>' + (metrics.stableErrors * 100 / metrics.stableRequests).toFixed(2) + '%</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td>新版本</td>';
        html += '<td>' + metrics.canaryRequests + '</td>';
        html += '<td>' + metrics.canaryErrors + '</td>';
        html += '<td>' + (metrics.canaryErrors * 100 / metrics.canaryRequests).toFixed(2) + '%</td>';
        html += '</tr>';
        html += '</table>';
        html += '</div>';

        // 3. 性能对比
        html += '<div class="canary-section">';
        html += '<h3>性能对比 (平均响应时间 ms)</h3>';
        html += '<table class="table">';
        html += '<tr><th>操作</th><th>旧版本</th><th>新版本</th><th>提升</th></tr>';
        metrics.performance.forEach(function(item) {
            var improvement = ((item.stable - item.canary) / item.stable * 100).toFixed(2);
            var color = improvement > 0 ? 'green' : 'red';
            html += '<tr>';
            html += '<td>' + item.operation + '</td>';
            html += '<td>' + item.stable.toFixed(2) + '</td>';
            html += '<td>' + item.canary.toFixed(2) + '</td>';
            html += '<td style="color:' + color + '">' + improvement + '%</td>';
            html += '</tr>';
        });
        html += '</table>';
        html += '</div>';

        // 4. 业务指标
        html += '<div class="canary-section">';
        html += '<h3>业务指标</h3>';
        html += '<table class="table">';
        html += '<tr><th>指标</th><th>旧版本</th><th>新版本</th><th>差异</th></tr>';
        html += '<tr>';
        html += '<td>报价创建成功率</td>';
        html += '<td>' + metrics.stableSuccessRate + '%</td>';
        html += '<td>' + metrics.canarySuccessRate + '%</td>';
        html += '<td>' + (metrics.canarySuccessRate - metrics.stableSuccessRate) + '%</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td>平均报价金额</td>';
        html += '<td>' + metrics.stableAvgAmount.toFixed(2) + '</td>';
        html += '<td>' + metrics.canaryAvgAmount.toFixed(2) + '</td>';
        html += '<td>' + (metrics.canaryAvgAmount - metrics.stableAvgAmount).toFixed(2) + '</td>';
        html += '</tr>';
        html += '</table>';
        html += '</div>';

        $('#canaryMonitorPanel').html(html);
    }

    /**
     * 自动刷新监控数据
     */
    function startAutoRefresh() {
        fetchMetrics();
        setInterval(fetchMetrics, 60000); // 每分钟刷新
    }

    return {
        start: startAutoRefresh,
        fetch: fetchMetrics
    };

})();
```

---

## 5. 实施流程

### 5.1 完整实施流程图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           实施流程                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐  │
│  │ 1.准备  │──▶│ 2.开发  │──▶│ 3.测试  │──▶│ 4.灰度  │──▶│ 5.全量  │  │
│  │   阶段  │   │   阶段  │   │   阶段  │   │   阶段  │   │   阶段  │  │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘  │
│       │            │            │            │            │           │
│       ▼            ▼            ▼            ▼            ▼           │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐  │
│  │风险分析 │   │代码编写 │   │测试执行 │   │灰度发布 │   │全量发布 │  │
│  │环境搭建 │   │单元测试 │   │结果报告 │   │数据监控 │   │持续监控 │  │
│  │数据备份 │   │代码审查 │   │问题修复 │   │效果评估 │   │复盘总结 │  │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 详细任务清单

#### 阶段1：准备阶段 (3天)

```markdown
## 准备阶段检查清单

### 环境准备
- [ ] 搭建独立的测试环境
- [ ] 准备测试数据（从生产环境脱敏）
- [ ] 配置测试数据库
- [ ] 准备性能测试工具

### 数据准备
- [ ] 收集生产环境真实报价数据（脱敏后）
- [ ] 提取典型公式案例（至少100个）
- [ ] 统计各功能区的使用频率
- [ ] 记录当前性能基准数据

### 风险评估
- [ ] 识别所有依赖模块
- [ ] 评估改动影响范围
- [ ] 制定回滚预案
- [ ] 准备应急联系方式

### 团队准备
- [ ] 确定开发人员
- [ ] 确定测试人员
- [ ] 确定审批流程
- [ ] 制定发布计划
```

#### 阶段2：开发阶段 (5天)

```markdown
## 开发阶段检查清单

### 代码开发
- [ ] 创建 FormulaParser 模块
- [ ] 实现 CalculationScheduler
- [ ] 创建 QuotationConstants
- [ ] 实现 DomCache
- [ ] 代码完成自测

### 单元测试
- [ ] FormulaParser 测试 (15个用例)
- [ ] CalculationScheduler 测试 (10个用例)
- [ ] DomCache 测试 (8个用例)
- [ ] 测试覆盖率达到 90%+

### 代码审查
- [ ] 提交 Pull Request
- [ ] 第一人审查完成
- [ ] 第二人审查完成
- [ ] 审查意见全部修复
```

#### 阶段3：测试阶段 (4天)

```markdown
## 测试阶段检查清单

### 单元测试
- [ ] 所有单元测试通过
- [ ] 测试覆盖率达标
- [ ] 无遗留测试失败

### 对比测试
- [ ] 收集100+生产环境真实用例
- [ ] 新旧版本计算结果对比
- [ ] 差异分析完成
- [ ] 所有差异在可接受范围内

### 集成测试
- [ ] 功能区创建/编辑/删除
- [ ] 报价项添加/修改/删除
- [ ] 折扣计算验证
- [ ] 优惠计算验证

### E2E测试
- [ ] 完整报价创建流程
- [ ] 报价编辑流程
- [ ] 报价提交流程
- [ ] 多用户并发场景

### 性能测试
- [ ] 响应时间测试
- [ ] 并发压力测试
- [ ] 内存泄漏检测
- [ ] 与基准性能对比

### 安全测试
- [ ] FormulaParser 安全性验证
- [ ] XSS 攻击测试
- [ ] SQL注入测试
- [ ] 权限验证测试
```

#### 阶段4：灰度阶段 (7天)

```markdown
## 灰度阶段检查清单

### 白名单阶段 (1天)
- [ ] 灰度功能开关配置完成
- [ ] 白名单用户添加完成
- [ ] 白名单用户验证通过
- [ ] 错误日志检查正常
- [ ] 性能数据符合预期

### 5% 灰度 (2天)
- [ ] 灰度比例调整为 5%
- [ ] 监控面板正常工作
- [ ] 错误率不超过旧版本
- [ ] 用户反馈收集
- [ ] 无严重bug

### 20% 灰度 (2天)
- [ ] 灰度比例调整为 20%
- [ ] 持续监控正常
- [ ] 性能指标符合预期
- [ ] 业务数据正常
- [ ] 准备全量发布

### 50% 灰度 (2天)
- [ ] 灰度比例调整为 50%
- [ ] 全面监控正常
- [ ] 无异常情况
```

#### 阶段5：全量阶段 (持续)

```markdown
## 全量阶段检查清单

### 发布准备
- [ ] 灰度比例调整为 100%
- [ ] 移除版本分支代码
- [ ] 更新文档

### 发布后监控
- [ ] 实时监控错误率
- [ ] 监控响应时间
- [ ] 监控业务指标
- [ ] 收集用户反馈

### 复盘总结
- [ ] 收集发布数据
- [ ] 分析问题与改进点
- [ ] 更新最佳实践文档
- [ ] 团队分享会
```

---

## 6. 回滚预案

### 6.1 回滚触发条件

```javascript
/**
 * 自动回滚判断器
 * 满足任一条件即触发回滚
 */
var AutoRollback = (function() {

    var thresholds = {
        // 错误率：超过 1% 立即回滚
        errorRate: 0.01,

        // 响应时间：超过旧版本 50% 回滚
        responseTimeIncrease: 0.5,

        // 业务异常：报价金额异常增长
        businessAnomalyRate: 0.1,

        // 用户投诉：1小时内超过 5 起
        complaintCount: 5,

        // 服务器错误：5xx 错误超过 0.5%
        serverErrorRate: 0.005
    };

    /**
     * 检查是否需要回滚
     */
    function shouldRollback(metrics) {
        var reasons = [];

        // 1. 错误率检查
        if (metrics.errorRate > thresholds.errorRate) {
            reasons.push('错误率过高: ' + (metrics.errorRate * 100).toFixed(2) + '%');
        }

        // 2. 响应时间检查
        if (metrics.responseTimeIncrease > thresholds.responseTimeIncrease) {
            reasons.push('响应时间增长超过 ' + (thresholds.responseTimeIncrease * 100) + '%');
        }

        // 3. 业务指标检查
        if (metrics.businessAnomalyRate > thresholds.businessAnomalyRate) {
            reasons.push('业务数据异常');
        }

        // 4. 用户投诉检查
        if (metrics.complaintCount > thresholds.complaintCount) {
            reasons.push('用户投诉过多: ' + metrics.complaintCount);
        }

        // 5. 服务器错误检查
        if (metrics.serverErrorRate > thresholds.serverErrorRate) {
            reasons.push('服务器错误率过高');
        }

        return {
            shouldRollback: reasons.length > 0,
            reasons: reasons
        };
    }

    /**
     * 执行回滚
     */
    function executeRollback(reasons) {
        console.error('[AutoRollback] Triggering rollback!');
        console.error('[AutoRollback] Reasons:', reasons);

        // 1. 立即切换灰度比例到 0
        CanaryRelease.rollback();

        // 2. 发送告警通知
        sendAlert({
            level: 'CRITICAL',
            title: '报价模块自动回滚',
            message: reasons.join('\n'),
            timestamp: new Date().toISOString()
        });

        // 3. 记录回滚日志
        com.post(api.system.logRollback, {
            'module': 'quotationPart',
            'reasons': reasons,
            'timestamp': Date.now()
        });

        // 4. 通知相关人员
        notifyTeam({
            type: 'rollback',
            module: 'quotationPart',
            reasons: reasons
        });
    }

    return {
        check: shouldRollback,
        execute: executeRollback
    };

})();

// ==================== 定时检查 ====================

// 每分钟检查一次是否需要回滚
setInterval(function() {
    var metrics = getCurrentMetrics();
    var result = AutoRollback.check(metrics);

    if (result.shouldRollback) {
        AutoRollback.execute(result.reasons);
    }
}, 60000);
```

### 6.2 手动回滚步骤

```markdown
## 手动回滚操作步骤

### 紧急回滚（5分钟内完成）
1. 登录服务器
2. 执行回滚脚本: `./rollback-quotation.sh`
3. 验证回滚成功: 访问测试页面
4. 通知相关人员回滚完成

### 标准回滚（15分钟内完成）
1. 评估回滚影响范围
2. 备份当前版本数据
3. 执行数据库回滚（如有）
4. 代码回滚到上一版本
5. 重启相关服务
6. 验证功能正常
7. 通知相关人员

### 回滚脚本示例
```bash
#!/bin/bash
# rollback-quotation.sh

echo "开始回滚报价模块..."

# 1. 备份当前版本
cp /var/www/html/js/quotation/quotationPart.js \
   /var/www/html/js/quotation/quotationPart.js.backup.$(date +%Y%m%d%H%M%S)

# 2. 恢复上一版本
cp /var/www/html/js/quotation/quotationPart.js.stable \
   /var/www/html/js/quotation/quotationPart.js

# 3. 清除缓存
redis-cli DEL "cache:quotation:*"

# 4. 记录回滚日志
echo "$(date '+%Y-%m-%d %H:%M:%S') Rollback executed" >> /var/log/quotation-rollback.log

echo "回滚完成！"
```
```

---

## 7. 监控告警

### 7.1 监控指标体系

```javascript
/**
 * 监控指标收集器
 */
var MetricsCollector = (function() {

    var metrics = {
        // 性能指标
        performance: {
            pageLoadTime: [],      // 页面加载时间
            calculationTime: [],   // 计算耗时
            apiResponseTime: [],   // API响应时间
            renderTime: []         // 渲染耗时
        },

        // 业务指标
        business: {
            quotationCreated: 0,   // 创建报价数
            quotationSubmitted: 0,  // 提交报价数
            quotationAmount: [],    // 报价金额列表
            errorCount: 0          // 错误次数
        },

        // 用户行为
        userBehavior: {
            pageViews: 0,          // 页面访问量
            avgSessionTime: 0,     // 平均会话时长
            bounceRate: 0          // 跳出率
        }
    };

    /**
     * 记录性能指标
     */
    function recordPerformance(type, duration) {
        if (metrics.performance[type]) {
            metrics.performance[type].push(duration);

            // 只保留最近 1000 条
            if (metrics.performance[type].length > 1000) {
                metrics.performance[type].shift();
            }
        }
    }

    /**
     * 记录业务指标
     */
    function recordBusiness(action, data) {
        if (action === 'quotationCreated') {
            metrics.business.quotationCreated++;
            metrics.business.quotationAmount.push(data.amount);
        } else if (action === 'quotationSubmitted') {
            metrics.business.quotationSubmitted++;
        } else if (action === 'error') {
            metrics.business.errorCount++;
        }
    }

    /**
     * 获取统计摘要
     */
    function getSummary() {
        return {
            performance: {
                avgPageLoadTime: average(metrics.performance.pageLoadTime),
                avgCalculationTime: average(metrics.performance.calculationTime),
                p95ApiResponseTime: percentile(metrics.performance.apiResponseTime, 95)
            },
            business: {
                successRate: (metrics.business.quotationSubmitted /
                              Math.max(1, metrics.business.quotationCreated) * 100).toFixed(2) + '%',
                avgAmount: average(metrics.business.quotationAmount).toFixed(2),
                errorRate: (metrics.business.errorCount /
                           Math.max(1, metrics.business.quotationCreated) * 100).toFixed(2) + '%'
            }
        };
    }

    function average(arr) {
        if (!arr || arr.length === 0) return 0;
        var sum = arr.reduce(function(a, b) { return a + b; }, 0);
        return sum / arr.length;
    }

    function percentile(arr, p) {
        if (!arr || arr.length === 0) return 0;
        var sorted = arr.slice().sort(function(a, b) { return a - b; });
        var index = Math.ceil(arr.length * p / 100) - 1;
        return sorted[index];
    }

    /**
     * 上报指标到服务器
     */
    function report() {
        com.post(api.system.reportMetrics, {
            'module': 'quotationPart',
            'metrics': getSummary(),
            'timestamp': Date.now()
        }, null, false);
    }

    // 每分钟上报一次
    setInterval(report, 60000);

    return {
        recordPerformance: recordPerformance,
        recordBusiness: recordBusiness,
        getSummary: getSummary
    };

})();
```

### 7.2 告警配置

```javascript
/**
 * 告警规则配置
 */
var AlertRules = {
    // P0 级别 - 立即处理
    critical: [
        {
            name: '错误率过高',
            condition: function(metrics) {
                return metrics.business.errorRate > '1%';
            },
            action: 'rollback'
        },
        {
            name: '服务不可用',
            condition: function(metrics) {
                return metrics.performance.avgApiResponseTime > 30000;
            },
            action: 'rollback'
        }
    ],

    // P1 级别 - 紧急关注
    high: [
        {
            name: '响应时间异常',
            condition: function(metrics) {
                return metrics.performance.p95ApiResponseTime > 5000;
            },
            action: 'notify'
        },
        {
            name: '成功率下降',
            condition: function(metrics) {
                return parseFloat(metrics.business.successRate) < 95;
            },
            action: 'notify'
        }
    ],

    // P2 级别 - 需要关注
    medium: [
        {
            name: '性能下降',
            condition: function(metrics) {
                return metrics.performance.avgCalculationTime > 1000;
            },
            action: 'log'
        }
    ]
};
```

---

## 8. 检查清单

### 8.1 发布前检查清单

```markdown
## 发布前最终检查清单

### 代码检查
- [ ] 所有代码审查通过
- [ ] 所有单元测试通过 (覆盖率 90%+)
- [ ] 所有集成测试通过
- [ ] 所有E2E测试通过
- [ ] 新旧版本对比测试通过
- [ ] 无console.log等调试代码
- [ ] 无TODO或FIXME未处理

### 文档检查
- [ ] 代码注释完整
- [ ] API文档更新
- [ ] 变更说明文档
- [ ] 回滚操作文档

### 环境检查
- [ ] 测试环境验证通过
- [ ] 预发布环境验证通过
- [ ] 监控告警配置完成
- [ ] 日志收集正常

### 数据检查
- [ ] 数据库变更脚本审核
- [ ] 数据备份完成
- [ ] 灰度开关配置完成

### 团队检查
- [ ] 开发团队确认
- [ ] 测试团队确认
- [ ] 产品团队确认
- [ ] 运维团队确认
- [ ] 发布窗口已预约
```

### 8.2 发布后检查清单

```markdown
## 发布后验证清单

### 功能验证
- [ ] 白名单用户访问正常
- [ ] 报价创建功能正常
- [ ] 报价计算结果正确
- [ ] 报价提交功能正常

### 性能验证
- [ ] 页面加载时间正常
- [ ] 计算响应时间正常
- [ ] API响应时间正常
- [ ] 无内存泄漏

### 监控验证
- [ ] 错误日志正常收集
- [ ] 性能指标正常上报
- [ ] 告警规则正常工作
- [ ] 灰度监控面板正常

### 回滚准备
- [ ] 回滚脚本已准备
- [ ] 回滚权限已配置
- [ ] 回滚流程已确认
- [ ] 应急联系人已通知
```

---

## 附录

### A. 快速参考

| 场景 | 操作 |
|------|------|
| 立即回滚 | CanaryRelease.rollback() |
| 调整灰度比例 | CanaryRelease.increase(10) |
| 查看监控 | CanaryMonitor.fetch() |
| 检查回滚条件 | AutoRollback.check(metrics) |

### B. 联系方式

| 角色 | 姓名 | 联系方式 |
|------|------|----------|
| 开发负责人 | [待填写] | [待填写] |
| 测试负责人 | [待填写] | [待填写] |
| 运维负责人 | [待填写] | [待填写] |
| 产品负责人 | [待填写] | [待填写] |
| 应急值班 | [待填写] | [待填写] |

---

**维护者**: AI 助手
**审核者**: 待定
**最后更新**: 2026-03-05
