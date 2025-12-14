/**
 * 🔍 优化效果验证工具
 *
 * 用于快速验证全局变量优化是否生效
 *
 * @version 1.0.0
 * @author Claude
 */

(function(window) {
    'use strict';

    /**
     * 优化验证器
     */
    var OptimizationValidator = {

        /**
         * 运行完整验证
         */
        runValidation: function() {
            console.log('🔍 开始验证优化效果...\n');

            var results = {
                components: this.validateComponents(),
                memory: this.validateMemory(),
                performance: this.validatePerformance(),
                compatibility: this.validateCompatibility()
            };

            this.displayResults(results);
            return results;
        },

        /**
         * 验证组件加载
         */
        validateComponents: function() {
            var checks = [
                {
                    name: 'GlobalOptimizer',
                    check: typeof window.GlobalOptimizer === 'object',
                    details: '全局优化器'
                },
                {
                    name: 'MemoryMonitor',
                    check: typeof window.MemoryMonitor === 'object',
                    details: '内存监控系统'
                },
                {
                    name: 'Global Optimizer Stats',
                    check: typeof window.checkOptimizationStats === 'function',
                    details: '优化统计功能'
                },
                {
                    name: 'Memory Report',
                    check: typeof window.getMemoryReport === 'function',
                    details: '内存报告功能'
                }
            ];

            var passed = 0;
            var results = [];

            console.log('📦 组件加载检查:');
            checks.forEach(function(item) {
                var status = item.check ? '✅' : '❌';
                console.log('  ' + status + ' ' + item.name + ' - ' + item.details);

                if (item.check) passed++;
                results.push({
                    name: item.name,
                    status: item.check,
                    details: item.details
                });
            });

            console.log('  📊 组件加载: ' + passed + '/' + checks.length + ' 通过\n');

            return {
                passed: passed,
                total: checks.length,
                results: results
            };
        },

        /**
         * 验证内存监控
         */
        validateMemory: function() {
            var checks = [];
            var passed = 0;

            console.log('💾 内存监控检查:');

            // 检查当前内存
            var currentMemory = window.getCurrentMemory();
            var hasMemory = currentMemory && currentMemory !== 'N/A';

            checks.push({
                name: 'Memory API Support',
                status: hasMemory,
                details: hasMemory ? currentMemory + 'MB' : '浏览器不支持'
            });

            console.log('  ' + (hasMemory ? '✅' : '⚠️') + ' Memory API - ' + (hasMemory ? currentMemory + 'MB' : '浏览器不支持性能内存API'));

            if (hasMemory) {
                passed++;
            }

            // 检查内存报告
            try {
                var memoryReport = window.getMemoryReport();
                var hasReport = memoryReport && memoryReport.memory;

                checks.push({
                    name: 'Memory Report',
                    status: hasReport,
                    details: hasReport ? '报告生成正常' : '报告生成失败'
                });

                console.log('  ' + (hasReport ? '✅' : '❌') + ' Memory Report - ' + (hasReport ? '报告生成正常' : '报告生成失败'));

                if (hasReport) {
                    passed++;
                    console.log('    📊 当前内存: ' + memoryReport.memory.current);
                    console.log('    📊 使用率: ' + memoryReport.memory.usage);
                }
            } catch (e) {
                checks.push({
                    name: 'Memory Report',
                    status: false,
                    details: '报告生成异常: ' + e.message
                });

                console.log('  ❌ Memory Report - 报告生成异常: ' + e.message);
            }

            console.log('  📊 内存监控: ' + passed + '/' + checks.length + ' 通过\n');

            return {
                passed: passed,
                total: checks.length,
                results: checks
            };
        },

        /**
         * 验证性能优化
         */
        validatePerformance: function() {
            var checks = [];
            var passed = 0;

            console.log('⚡ 性能优化检查:');

            // 检查优化统计
            try {
                var stats = window.checkOptimizationStats();
                var hasStats = stats && stats.cacheStats;

                checks.push({
                    name: 'Optimization Stats',
                    status: hasStats,
                    details: hasStats ? '统计功能正常' : '统计功能异常'
                });

                console.log('  ' + (hasStats ? '✅' : '❌') + ' Optimization Stats - ' + (hasStats ? '统计功能正常' : '统计功能异常'));

                if (hasStats) {
                    passed++;
                    console.log('    📊 缓存命中率: ' + stats.cacheStats.hitRate.toFixed(1) + '%');
                    console.log('    📊 API缓存: ' + stats.cacheStats.apiCache + ' 条');
                    console.log('    📊 常量缓存: ' + stats.cacheStats.constantsCache + ' 条');
                }
            } catch (e) {
                checks.push({
                    name: 'Optimization Stats',
                    status: false,
                    details: '统计异常: ' + e.message
                });

                console.log('  ❌ Optimization Stats - 统计异常: ' + e.message);
            }

            console.log('  📊 性能优化: ' + passed + '/' + checks.length + ' 通过\n');

            return {
                passed: passed,
                total: checks.length,
                results: checks
            };
        },

        /**
         * 验证兼容性
         */
        validateCompatibility: function() {
            var checks = [];
            var passed = 0;

            console.log('🔧 兼容性检查:');

            // 检查原有全局对象
            var originalObjects = [
                { name: 'params', obj: window.params },
                { name: 'api', obj: window.api },
                { name: 'constant', obj: window.constant },
                { name: 'com', obj: window.com }
            ];

            originalObjects.forEach(function(item) {
                var exists = typeof item.obj !== 'undefined';

                checks.push({
                    name: item.name + ' Object',
                    status: exists,
                    details: exists ? '原始对象正常' : '原始对象丢失'
                });

                console.log('  ' + (exists ? '✅' : '❌') + ' ' + item.name + ' - ' + (exists ? '原始对象正常' : '原始对象丢失'));

                if (exists) passed++;
            });

            // 检查Constant函数
            try {
                var constantWorking = false;
                if (typeof Constant === 'function') {
                    var constObj = Constant();
                    constantWorking = constObj && typeof constObj.module === 'function';
                }

                checks.push({
                    name: 'Constant Function',
                    status: constantWorking,
                    details: constantWorking ? '常量函数正常' : '常量函数异常'
                });

                console.log('  ' + (constantWorking ? '✅' : '❌') + ' Constant - ' + (constantWorking ? '常量函数正常' : '常量函数异常'));

                if (constantWorking) passed++;
            } catch (e) {
                checks.push({
                    name: 'Constant Function',
                    status: false,
                    details: '常量函数异常: ' + e.message
                });

                console.log('  ❌ Constant - 常量函数异常: ' + e.message);
            }

            console.log('  📊 兼容性: ' + passed + '/' + checks.length + ' 通过\n');

            return {
                passed: passed,
                total: checks.length,
                results: checks
            };
        },

        /**
         * 显示验证结果
         */
        displayResults: function(results) {
            var totalPassed = results.components.passed + results.memory.passed +
                             results.performance.passed + results.compatibility.passed;
            var totalChecks = results.components.total + results.memory.total +
                             results.performance.total + results.compatibility.total;
            var successRate = (totalPassed / totalChecks * 100).toFixed(1);

            console.log('📋 验证结果汇总:');
            console.log('=' .repeat(50));
            console.log('📦 组件加载: ' + results.components.passed + '/' + results.components.total + ' 通过');
            console.log('💾 内存监控: ' + results.memory.passed + '/' + results.memory.total + ' 通过');
            console.log('⚡ 性能优化: ' + results.performance.passed + '/' + results.performance.total + ' 通过');
            console.log('🔧 兼容性: ' + results.compatibility.passed + '/' + results.compatibility.total + ' 通过');
            console.log('-' .repeat(50));
            console.log('📊 总体通过率: ' + successRate + '% (' + totalPassed + '/' + totalChecks + ')');

            if (successRate >= 80) {
                console.log('🎉 优化部署成功！');
            } else if (successRate >= 60) {
                console.log('⚠️ 优化部分生效，建议检查失败的项');
            } else {
                console.log('❌ 优化部署存在问题，需要重新检查');
            }

            console.log('\n💡 使用建议:');
            console.log('- 定期运行 window.validateOptimization() 检查状态');
            console.log('- 使用 window.getMemoryReport() 查看详细报告');
            console.log('- 使用 window.checkOptimizationStats() 查看优化统计');
        },

        /**
         * 快速检查
         */
        quickCheck: function() {
            console.log('⚡ 快速检查...\n');

            var issues = [];

            // 检查组件
            if (typeof window.GlobalOptimizer !== 'object') {
                issues.push('GlobalOptimizer 未加载');
            }

            if (typeof window.MemoryMonitor !== 'object') {
                issues.push('MemoryMonitor 未加载');
            }

            // 检查兼容性
            if (typeof window.params === 'undefined') {
                issues.push('params 对象丢失');
            }

            if (typeof window.api === 'undefined') {
                issues.push('api 对象丢失');
            }

            if (typeof window.constant === 'undefined') {
                issues.push('constant 对象丢失');
            }

            if (issues.length === 0) {
                console.log('✅ 快速检查通过！所有组件正常运行。');
                return true;
            } else {
                console.log('❌ 发现问题:');
                issues.forEach(function(issue, index) {
                    console.log('  ' + (index + 1) + '. ' + issue);
                });
                return false;
            }
        }
    };

    // 暴露到全局
    window.OptimizationValidator = OptimizationValidator;

    // 添加便捷函数
    window.validateOptimization = function() {
        return OptimizationValidator.runValidation();
    };

    window.quickOptimizationCheck = function() {
        return OptimizationValidator.quickCheck();
    };

    // 页面加载后自动运行快速检查
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                console.log('\n🔍 自动运行优化检查...\n');
                window.quickOptimizationCheck();
            }, 2000); // 等待2秒确保所有组件加载完成
        });
    } else {
        setTimeout(function() {
            console.log('\n🔍 自动运行优化检查...\n');
            window.quickOptimizationCheck();
        }, 2000);
    }

})(window);