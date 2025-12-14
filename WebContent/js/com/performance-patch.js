/**
 * 性能优化补丁 - 轻量级全局变量优化
 * 创建时间：2025-12-14
 * 功能：最小改动，最大性能提升
 */

(function() {
    'use strict';

    /**
     * 性能优化补丁
     * 专门解决api/params/constant的性能问题
     */
    var PerformancePatch = {
        initialized: false,
        pageStartTime: Date.now(),
        originalParams: null,
        originalApi: null,

        /**
         * 初始化性能补丁
         */
        init: function() {
            if (this.initialized) return;
            this.initialized = true;

            console.log('🚀 Performance Patch - Initializing...');

            // 修复api同步加载问题
            this.fixApiLoading();

            // 修复params内存累积问题
            this.fixParamsMemory();

            // 修复constant全量加载问题
            this.fixConstantLoading();

            // 启动性能监控
            this.startPerformanceMonitoring();

            var loadTime = Date.now() - this.pageStartTime;
            console.log('✅ Performance Patch - Ready! (' + loadTime + 'ms)');
        },

        /**
         * 修复API加载 - 改为异步加载
         */
        fixApiLoading: function() {
            var self = this;

            // 检查Api函数是否存在
            if (typeof Api !== 'function') {
                console.warn('Api function not found');
                return;
            }

            // 备份原始init方法
            var originalApiInit = Api().init;

            // 重写init方法
            Api().init = function(path) {
                console.log('📦 Loading API modules asynchronously...');

                // 核心模块（同步加载，必需）
                var coreModules = ['system', 'common', 'data'];
                var pathBase = path || 'js/api/';

                // 同步加载核心模块（避免兼容性问题）
                coreModules.forEach(function(module) {
                    var url = pathBase + module + '.js';
                    self.loadScriptSync(url);
                });

                // 异步加载其他模块（不阻塞页面）
                setTimeout(function() {
                    var asyncModules = [
                        'approval', 'balance', 'construction', 'decoration',
                        'information', 'inventory', 'log', 'material',
                        'payment', 'personel', 'quotation', 'report',
                        'right', 'salary', 'production', 'ds', 'building'
                    ];

                    asyncModules.forEach(function(module, index) {
                        setTimeout(function() {
                            var url = pathBase + module + '.js';
                            self.loadScriptAsync(url);
                        }, index * 50); // 错开加载时间
                    });
                }, 100);

                return true;
            };
        },

        /**
         * 同步加载脚本（仅用于核心模块）
         */
        loadScriptSync: function(url) {
            try {
                $.ajax({
                    url: url,
                    cache: true,
                    type: 'get',
                    dataType: 'script',
                    async: false
                });
                console.log('✓ Core module loaded:', url);
            } catch (e) {
                console.error('✗ Failed to load core module:', url, e);
            }
        },

        /**
         * 异步加载脚本
         */
        loadScriptAsync: function(url) {
            // 使用document.createElement避免jQuery开销
            var script = document.createElement('script');
            script.src = url;
            script.async = true;
            script.onload = function() {
                console.log('✓ Async module loaded:', url);
            };
            script.onerror = function() {
                console.error('✗ Failed to load async module:', url);
            };
            document.head.appendChild(script);
        },

        /**
         * 修复params内存累积
         */
        fixParamsMemory: function() {
            if (typeof window.params === 'undefined') {
                console.warn('params object not found');
                return;
            }

            this.originalParams = window.params;

            // 创建清理params的函数
            window.cleanupParams = function() {
                // 保留必要的全局参数
                var keepKeys = [
                    'authentication', 'loginTime', 'userInfo', 'company',
                    'apiHistory' // 保留请求历史，避免重复请求
                ];

                var newParams = {};
                keepKeys.forEach(function(key) {
                    if (window.params[key]) {
                        newParams[key] = window.params[key];
                    }
                });

                // 清理大对象
                var largeKeys = ['decoration', 'quotation', 'construction', 'customer'];
                largeKeys.forEach(function(key) {
                    if (window.params[key]) {
                        console.log('🧹 Cleaning large object:', key,
                                   '(' + JSON.stringify(window.params[key]).length + ' bytes)');
                        delete window.params[key];
                    }
                });

                window.params = newParams;
                console.log('🧹 params cleanup completed');
            };

            // 页面切换时自动清理
            if (typeof com !== 'undefined' && com.switchPage) {
                var originalSwitchPage = com.switchPage;
                com.switchPage = function(url, notTab, data, callback) {
                    // 切换前清理params
                    window.cleanupParams();
                    return originalSwitchPage.call(this, url, notTab, data, callback);
                };
            }
        },

        /**
         * 修复constant全量加载
         */
        fixConstantLoading: function() {
            if (typeof Constant === 'undefined') {
                console.warn('Constant function not found');
                return;
            }

            // 创建智能缓存
            var constantCache = new Map();
            var cacheTimeout = 30 * 60 * 1000; // 30分钟

            // 重写constant获取方法
            window.getConstant = function(module, clazz, callback) {
                var cacheKey = module + '_' + (clazz || 'default');
                var cached = constantCache.get(cacheKey);

                // 检查缓存
                if (cached && (Date.now() - cached.timestamp < cacheTimeout)) {
                    if (callback) callback(cached.data);
                    return cached.data;
                }

                // 从服务器加载
                var options = {
                    "constant.status": 0,
                    "constant.module": module
                };

                if (clazz) {
                    options["constant.clazz"] = clazz;
                }

                com.post(api.data.queryConstant, options, function(res) {
                    var data = res.constants || res;

                    // 缓存结果
                    constantCache.set(cacheKey, {
                        data: data,
                        timestamp: Date.now()
                    });

                    if (callback) callback(data);
                    console.log('✓ Constants loaded and cached:', cacheKey);
                });
            };

            // 清理过期缓存的函数
            window.cleanupConstants = function() {
                var now = Date.now();
                constantCache.forEach(function(value, key) {
                    if (now - value.timestamp > cacheTimeout) {
                        constantCache.delete(key);
                    }
                });
                console.log('🧹 Constants cache cleanup completed');
            };
        },

        /**
         * 启动性能监控
         */
        startPerformanceMonitoring: function() {
            var self = this;

            // 监控内存使用
            window.checkPerformance = function() {
                var stats = {
                    paramsSize: self.getObjectSize(window.params || {}),
                    apiSize: self.getObjectSize(window.api || {}),
                    constantSize: window.getConstant ?
                        (window.getConstant._cacheSize || 0) : 0,
                    memoryUsage: self.getMemoryUsage()
                };

                console.log('📊 Performance Stats:', stats);
                return stats;
            };

            // 定期清理
            setInterval(function() {
                window.cleanupConstants();

                // 每5分钟清理一次params
                if (Date.now() % (5 * 60 * 1000) < 60000) {
                    window.cleanupParams();
                }
            }, 60000); // 每分钟检查一次
        },

        /**
         * 获取对象大小
         */
        getObjectSize: function(obj) {
            try {
                return JSON.stringify(obj).length;
            } catch (e) {
                return 0;
            }
        },

        /**
         * 获取内存使用情况
         */
        getMemoryUsage: function() {
            if (performance && performance.memory) {
                return {
                    used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                    total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                    limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
                };
            }
            return null;
        }
    };

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            PerformancePatch.init();
        });
    } else {
        PerformancePatch.init();
    }

    // 导出到全局
    window.PerformancePatch = PerformancePatch;

})();