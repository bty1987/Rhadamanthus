/**
 * 🔍 内存监控和预警系统
 *
 * 功能：
 * - 实时监控内存使用情况
 * - 自动检测内存泄漏
 * - 提供性能优化建议
 * - 生成内存使用报告
 *
 * @version 1.0.0
 * @author Claude
 */

(function(window) {
    'use strict';

    // 防止重复加载
    if (window.MemoryMonitor) {
        console.log('🔄 MemoryMonitor already loaded');
        return;
    }

    /**
     * 内存监控器
     */
    var MemoryMonitor = {
        // 配置参数
        config: {
            checkInterval: 30000,      // 检查间隔30秒
            warningThreshold: 100,     // 警告阈值100MB
            criticalThreshold: 200,    // 严重阈值200MB
            maxHistory: 20,           // 最大历史记录数
            enableAutoReport: true,   // 启用自动报告
            debugMode: false         // 调试模式
        },

        // 内存使用历史
        memoryHistory: [],

        // 泄漏检测
        leakDetection: {
            samples: [],
            threshold: 10,           // 增长阈值MB
            consecutiveCount: 3      // 连续增长次数
        },

        // 统计信息
        stats: {
            warnings: 0,
            criticals: 0,
            cleanups: 0,
            startTime: Date.now()
        },

        /**
         * 初始化监控器
         */
        init: function() {
            this.log('🔍 MemoryMonitor - Starting...');

            // 检查浏览器支持
            if (!performance || !performance.memory) {
                console.warn('⚠️ Browser does not support performance.memory API');
                return;
            }

            // 初始化检测
            this.startMonitoring();
            this.setupPageUnloadHandler();

            this.log('✅ MemoryMonitor - Started');
        },

        /**
         * 开始监控
         */
        startMonitoring: function() {
            var self = this;

            // 立即检查一次
            this.checkMemory();

            // 定期检查
            setInterval(function() {
                self.checkMemory();
            }, this.config.checkInterval);

            // 每5分钟进行泄漏检测
            setInterval(function() {
                self.detectMemoryLeaks();
            }, 5 * 60 * 1000);
        },

        /**
         * 检查内存使用情况
         */
        checkMemory: function() {
            if (!performance.memory) return;

            var memory = performance.memory;
            var current = {
                timestamp: Date.now(),
                used: memory.usedJSHeapSize,
                total: memory.totalJSHeapSize,
                limit: memory.jsHeapSizeLimit
            };

            // 转换为MB
            current.usedMB = (current.used / 1024 / 1024).toFixed(2);
            current.totalMB = (current.total / 1024 / 1024).toFixed(2);
            current.limitMB = (current.limit / 1024 / 1024).toFixed(2);

            // 添加到历史记录
            this.memoryHistory.push(current);
            if (this.memoryHistory.length > this.config.maxHistory) {
                this.memoryHistory.shift();
            }

            // 检查阈值
            this.checkThresholds(current);

            // 记录到泄漏检测
            this.leakDetection.samples.push({
                timestamp: Date.now(),
                used: current.used
            });

            // 保持最近10个样本
            if (this.leakDetection.samples.length > 10) {
                this.leakDetection.samples.shift();
            }

            this.log('💾 Memory:', current.usedMB + 'MB /', current.totalMB + 'MB');
        },

        /**
         * 检查内存阈值
         */
        checkThresholds: function(current) {
            var usedMB = parseFloat(current.usedMB);

            if (usedMB > this.config.criticalThreshold) {
                this.handleCriticalMemory(current);
            } else if (usedMB > this.config.warningThreshold) {
                this.handleWarningMemory(current);
            }
        },

        /**
         * 处理内存警告
         */
        handleWarningMemory: function(current) {
            this.stats.warnings++;

            console.warn('⚠️ Memory Warning:', current.usedMB + 'MB (Threshold: ' + this.config.warningThreshold + 'MB)');

            // 提供优化建议
            this.showOptimizationSuggestions();

            // 触发自动清理
            this.triggerAutoCleanup();
        },

        /**
         * 处理严重内存情况
         */
        handleCriticalMemory: function(current) {
            this.stats.criticals++;

            console.error('🚨 Critical Memory:', current.usedMB + 'MB (Threshold: ' + this.config.criticalThreshold + 'MB)');

            // 生成紧急报告
            this.generateEmergencyReport();

            // 强制清理
            this.forceCleanup();

            // 提示用户
            this.showCriticalAlert();
        },

        /**
         * 检测内存泄漏
         */
        detectMemoryLeaks: function() {
            if (this.leakDetection.samples.length < this.leakDetection.consecutiveCount) {
                return;
            }

            var samples = this.leakDetection.samples;
            var consecutiveIncrease = 0;
            var totalIncrease = 0;

            // 检查连续增长
            for (var i = 1; i < samples.length; i++) {
                var diff = (samples[i].used - samples[i-1].used) / 1024 / 1024; // MB

                if (diff > 0) {
                    consecutiveIncrease++;
                    totalIncrease += diff;
                } else {
                    consecutiveIncrease = 0;
                }
            }

            // 判断是否为内存泄漏
            if (consecutiveIncrease >= this.leakDetection.consecutiveCount && totalIncrease > this.config.leakThreshold) {
                this.handleMemoryLeak(totalIncrease);
            }
        },

        /**
         * 处理内存泄漏
         */
        handleMemoryLeak: function(increase) {
            console.error('🔥 Memory Leak Detected!', 'Increase:', increase.toFixed(2) + 'MB');

            // 生成泄漏报告
            this.generateLeakReport(increase);

            // 建议刷新页面
            if (confirm('检测到可能的内存泄漏，建议刷新页面以释放内存。是否立即刷新？')) {
                location.reload();
            }
        },

        /**
         * 触发自动清理
         */
        triggerAutoCleanup: function() {
            this.log('🧹 Triggering auto cleanup...');

            // 清理全局优化器缓存
            if (window.GlobalOptimizer && window.GlobalOptimizer.cleanupExpiredCache) {
                window.GlobalOptimizer.cleanupExpiredCache();
            }

            // 清理jQuery缓存
            if (window.$ && window.$.cache) {
                try {
                    // 清理空的jQuery缓存
                    var cache = window.$.cache;
                    var cleaned = 0;
                    for (var key in cache) {
                        if (!cache[key].data || Object.keys(cache[key].data).length === 0) {
                            delete cache[key];
                            cleaned++;
                        }
                    }
                    this.log('🗑️ Cleaned', cleaned, 'jQuery cache entries');
                } catch (e) {
                    this.log('jQuery cache cleanup failed:', e.message);
                }
            }

            this.stats.cleanups++;
        },

        /**
         * 强制清理
         */
        forceCleanup: function() {
            this.log('🔥 Force cleanup...');

            // 清理所有可能的缓存
            this.triggerAutoCleanup();

            // 建议GC
            if (window.gc) {
                window.gc();
            }

            // 清理定时器
            this.clearTimers();
        },

        /**
         * 清理定时器
         */
        clearTimers: function() {
            // 获取所有定时器ID（仅在支持的环境中）
            if (typeof setTimeout !== 'undefined') {
                // 注意：这里只是示例，实际应用中需要更复杂的定时器管理
                this.log('⏰ Timer cleanup suggested');
            }
        },

        /**
         * 显示优化建议
         */
        showOptimizationSuggestions: function() {
            var suggestions = [
                '📊 关闭不使用的页面标签',
                '🔄 定期刷新页面释放内存',
                '🗑️ 清理浏览器缓存',
                '⚡ 避免同时打开大量数据',
                '📱 使用内存分析工具检测泄漏'
            ];

            console.log('💡 Memory Optimization Suggestions:');
            suggestions.forEach(function(suggestion, index) {
                console.log('  ' + (index + 1) + '.', suggestion);
            });
        },

        /**
         * 显示严重警告
         */
        showCriticalAlert: function() {
            if (this.config.enableAutoReport) {
                alert('内存使用严重超标！\n当前使用：' + this.getCurrentMemoryMB() + 'MB\n建议：\n1. 立即刷新页面\n2. 关闭其他标签页\n3. 重启浏览器');
            }
        },

        /**
         * 生成内存报告
         */
        generateMemoryReport: function() {
            var current = this.getCurrentMemoryInfo();
            var uptime = ((Date.now() - this.stats.startTime) / 1000 / 60).toFixed(1); // 分钟

            var report = {
                timestamp: new Date().toISOString(),
                uptime: uptime + ' minutes',
                memory: {
                    current: current.usedMB + 'MB',
                    total: current.totalMB + 'MB',
                    limit: current.limitMB + 'MB',
                    usage: (current.used / current.limit * 100).toFixed(1) + '%'
                },
                statistics: {
                    warnings: this.stats.warnings,
                    criticals: this.stats.criticals,
                    cleanups: this.stats.cleanups,
                    cacheHits: window.GlobalOptimizer ? window.GlobalOptimizer.stats.cacheHits : 'N/A'
                },
                history: this.memoryHistory.slice(-5) // 最近5次记录
            };

            return report;
        },

        /**
         * 生成泄漏报告
         */
        generateLeakReport: function(increase) {
            var report = {
                timestamp: new Date().toISOString(),
                leakDetected: true,
                increase: increase.toFixed(2) + 'MB',
                samples: this.leakDetection.samples.length,
                currentUsage: this.getCurrentMemoryMB() + 'MB',
                recommendations: [
                    '检查事件监听器是否正确移除',
                    '确认定时器是否被清理',
                    '避免闭包引用大对象',
                    '使用开发者工具Memory标签页分析'
                ]
            };

            console.log('🔍 Memory Leak Report:', report);
            return report;
        },

        /**
         * 生成紧急报告
         */
        generateEmergencyReport: function() {
            var report = this.generateMemoryReport();
            report.emergency = true;
            report.actions = [
                '立即刷新页面',
                '关闭其他应用',
                '重启浏览器',
                '检查是否有恶意脚本'
            ];

            console.error('🚨 Emergency Memory Report:', report);
            return report;
        },

        /**
         * 获取当前内存信息
         */
        getCurrentMemoryInfo: function() {
            if (!performance.memory) return null;

            var memory = performance.memory;
            return {
                used: memory.usedJSHeapSize,
                total: memory.totalJSHeapSize,
                limit: memory.jsHeapSizeLimit,
                usedMB: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
                totalMB: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2),
                limitMB: (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)
            };
        },

        /**
         * 获取当前内存使用量（MB）
         */
        getCurrentMemoryMB: function() {
            var info = this.getCurrentMemoryInfo();
            return info ? info.usedMB : 'N/A';
        },

        /**
         * 设置页面卸载处理器
         */
        setupPageUnloadHandler: function() {
            var self = this;
            window.addEventListener('beforeunload', function() {
                self.log('📊 Page unload - Final memory usage:', self.getCurrentMemoryMB() + 'MB');
            });
        },

        /**
         * 日志输出
         */
        log: function() {
            if (this.config.debugMode) {
                console.log.apply(console, arguments);
            }
        }
    };

    // 暴露到全局
    window.MemoryMonitor = MemoryMonitor;

    // 全局辅助函数
    window.getMemoryReport = function() {
        return MemoryMonitor.generateMemoryReport();
    };

    window.getCurrentMemory = function() {
        return MemoryMonitor.getCurrentMemoryInfo();
    };

    window.forceMemoryCleanup = function() {
        MemoryMonitor.forceCleanup();
    };

    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            MemoryMonitor.init();
        });
    } else {
        MemoryMonitor.init();
    }

})(window);