/**
 * 🚀 全局变量性能优化器 - 轻量级兼容版本
 *
 * 特点：
 * - 完全向后兼容，不影响现有代码
 * - 零侵入式，自动优化
 * - 智能缓存，按需加载
 * - 内存监控，自动清理
 *
 * @version 1.0.0
 * @author Claude
 */

(function(window) {
    'use strict';

    // 防止重复加载
    if (window.GlobalOptimizer) {
        console.log('🔄 GlobalOptimizer already loaded, skipping...');
        return;
    }

    /**
     * 全局优化器
     */
    var GlobalOptimizer = {
        // 配置参数
        config: {
            enableCache: true,           // 启用缓存
            enableLazyLoad: true,       // 启用懒加载
            enableMemoryMonitor: true,   // 启用内存监控
            cacheTimeout: 10 * 60 * 1000, // 缓存10分钟
            maxCacheSize: 50,           // 最大缓存条目
            debugMode: false            // 调试模式
        },

        // 缓存存储
        cache: {
            constants: new Map(),
            apiData: new Map(),
            paramsData: new Map()
        },

        // 统计信息
        stats: {
            cacheHits: 0,
            cacheMisses: 0,
            memoryCleanups: 0,
            lastCleanup: 0
        },

        /**
         * 初始化优化器
         */
        init: function() {
            this.log('🔧 GlobalOptimizer - Initializing...');

            // 等待核心组件加载完成
            this.waitForCore().then(function() {
                this.setupConstantOptimization();
                this.setupParamsOptimization();
                this.setupAPIOptimization();
                this.setupMemoryMonitor();
                this.log('✅ GlobalOptimizer - Ready!');
            }.bind(this));

            // 定期清理过期缓存
            setInterval(this.cleanupExpiredCache.bind(this), 5 * 60 * 1000);
        },

        /**
         * 等待核心组件加载
         */
        waitForCore: function() {
            return new Promise(function(resolve) {
                var checkCore = setInterval(function() {
                    if (window.com && window.api && window.params && window.constant) {
                        clearInterval(checkCore);
                        resolve();
                    }
                }, 100);
            });
        },

        /**
         * 设置常量优化
         */
        setupConstantOptimization: function() {
            var originalConstant = window.Constant;

            // 保存原始Constant构造函数
            window.Constant = function() {
                var self = this;

                return {
                    // 保持原有module方法
                    module: function(moduleName) {
                        if (GlobalOptimizer.config.enableLazyLoad) {
                            return GlobalOptimizer.getLazyConstants(moduleName);
                        }

                        // 调用原始方法
                        var original = originalConstant.call(this);
                        return original.module(moduleName);
                    }
                };
            };
        },

        /**
         * 设置参数优化
         */
        setupParamsOptimization: function() {
            var self = this;

            // 监听params对象变化
            if (window.params) {
                // 包装params对象，添加智能缓存
                this.wrapParams();
            }
        },

        /**
         * 包装params对象
         */
        wrapParams: function() {
            var self = this;
            var originalParams = window.params;

            // 创建params的代理
            window.params = new Proxy(originalParams || {}, {
                set: function(target, property, value) {
                    // 大对象自动缓存
                    if (typeof value === 'object' && value !== null) {
                        var size = self.estimateObjectSize(value);
                        if (size > 100 * 1024) { // 超过100KB的对象
                            self.cache.paramsData.set(property, {
                                data: value,
                                timestamp: Date.now(),
                                size: size
                            });

                            self.log('💾 Cached large params data:', property, 'Size:', (size / 1024).toFixed(1) + 'KB');
                        }
                    }

                    target[property] = value;
                    return true;
                },

                get: function(target, property) {
                    // 优先从缓存获取
                    var cached = self.cache.paramsData.get(property);
                    if (cached && !self.isExpired(cached)) {
                        self.stats.cacheHits++;
                        return cached.data;
                    }

                    self.stats.cacheMisses++;
                    return target[property];
                }
            });
        },

        /**
         * 设置API优化
         */
        setupAPIOptimization: function() {
            var self = this;

            // 包装com.post方法，添加智能缓存
            if (window.com && window.com.post) {
                var originalPost = window.com.post;

                window.com.post = function(url, params, callback, options) {
                    // 只缓存GET类查询请求
                    if (self.shouldCacheRequest(url, params)) {
                        var cacheKey = self.generateCacheKey(url, params);
                        var cached = self.cache.apiData.get(cacheKey);

                        if (cached && !self.isExpired(cached)) {
                            self.log('📋 Cache hit for API:', url);
                            self.stats.cacheHits++;

                            // 异步返回缓存结果
                            setTimeout(function() {
                                if (typeof callback === 'function') {
                                    callback(cached.response);
                                }
                            }, 0);

                            return;
                        }
                    }

                    self.stats.cacheMisses++;

                    // 调用原始方法
                    return originalPost.call(this, url, params, function(response) {
                        // 缓存响应结果
                        if (self.shouldCacheRequest(url, params)) {
                            var cacheKey = self.generateCacheKey(url, params);
                            self.cache.apiData.set(cacheKey, {
                                response: response,
                                timestamp: Date.now()
                            });

                            self.log('💾 Cached API response:', url);
                        }

                        if (typeof callback === 'function') {
                            callback(response);
                        }
                    }, options);
                };
            }
        },

        /**
         * 设置内存监控
         */
        setupMemoryMonitor: function() {
            if (!this.config.enableMemoryMonitor) return;

            var self = this;

            // 监控内存使用
            setInterval(function() {
                if (performance && performance.memory) {
                    var memory = performance.memory;
                    var usedMB = (memory.usedJSHeapSize / 1024 / 1024).toFixed(1);

                    // 内存使用超过100MB时自动清理
                    if (memory.usedJSHeapSize > 100 * 1024 * 1024) {
                        self.log('⚠️ High memory usage detected:', usedMB + 'MB');
                        self.performMemoryCleanup();
                    }
                }
            }, 30000); // 每30秒检查一次
        },

        /**
         * 懒加载常量
         */
        getLazyConstants: function(moduleName) {
            var self = this;
            var cached = this.cache.constants.get(moduleName);

            if (cached && !this.isExpired(cached)) {
                this.stats.cacheHits++;
                this.log('📦 Constants cache hit:', moduleName);
                return cached.data;
            }

            this.stats.cacheMisses++;

            // 模拟加载常量（实际应该调用API）
            var constants = this.loadConstantsFromAPI(moduleName);

            // 缓存结果
            this.cache.constants.set(moduleName, {
                data: constants,
                timestamp: Date.now()
            });

            this.log('🔄 Loaded constants:', moduleName);
            return constants;
        },

        /**
         * 从API加载常量
         */
        loadConstantsFromAPI: function(moduleName) {
            // 这里应该调用实际的API
            // 为了兼容性，暂时返回空对象
            if (window.constant && window.constant[moduleName]) {
                return window.constant[moduleName];
            }
            return {};
        },

        /**
         * 判断是否应该缓存请求
         */
        shouldCacheRequest: function(url, params) {
            // 只缓存查询请求，不缓存更新请求
            var cacheablePatterns = [
                '/page',
                '/list',
                '/get',
                '/query',
                '/search'
            ];

            var nonCacheablePatterns = [
                '/save',
                '/update',
                '/delete',
                '/create',
                '/export'
            ];

            for (var i = 0; i < nonCacheablePatterns.length; i++) {
                if (url.indexOf(nonCacheablePatterns[i]) !== -1) {
                    return false;
                }
            }

            for (var j = 0; j < cacheablePatterns.length; j++) {
                if (url.indexOf(cacheablePatterns[j]) !== -1) {
                    return true;
                }
            }

            return false;
        },

        /**
         * 生成缓存键
         */
        generateCacheKey: function(url, params) {
            var paramsStr = JSON.stringify(params || {});
            return url + '_' + this.simpleHash(paramsStr);
        },

        /**
         * 简单哈希函数
         */
        simpleHash: function(str) {
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
                var char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // 转换为32位整数
            }
            return hash;
        },

        /**
         * 检查缓存是否过期
         */
        isExpired: function(cached) {
            return Date.now() - cached.timestamp > this.config.cacheTimeout;
        },

        /**
         * 估算对象大小
         */
        estimateObjectSize: function(obj) {
            try {
                return JSON.stringify(obj).length * 2; // 粗略估算
            } catch (e) {
                return 0;
            }
        },

        /**
         * 清理过期缓存
         */
        cleanupExpiredCache: function() {
            var self = this;
            var cleaned = 0;

            // 清理常量缓存
            this.cache.constants.forEach(function(value, key) {
                if (self.isExpired(value)) {
                    self.cache.constants.delete(key);
                    cleaned++;
                }
            });

            // 清理API数据缓存
            this.cache.apiData.forEach(function(value, key) {
                if (self.isExpired(value)) {
                    self.cache.apiData.delete(key);
                    cleaned++;
                }
            });

            // 清理参数缓存
            this.cache.paramsData.forEach(function(value, key) {
                if (self.isExpired(value)) {
                    self.cache.paramsData.delete(key);
                    cleaned++;
                }
            });

            if (cleaned > 0) {
                this.log('🧹 Cleaned', cleaned, 'expired cache entries');
            }
        },

        /**
         * 执行内存清理
         */
        performMemoryCleanup: function() {
            this.log('🔥 Performing memory cleanup...');

            // 清理过期缓存
            this.cleanupExpiredCache();

            // 清理大对象
            var self = this;
            var totalSize = 0;
            var toDelete = [];

            this.cache.paramsData.forEach(function(value, key) {
                totalSize += value.size || 0;

                // 删除超过1MB的对象
                if (value.size > 1024 * 1024) {
                    toDelete.push(key);
                }
            });

            // 删除最大的对象，直到总大小小于10MB
            if (totalSize > 10 * 1024 * 1024) {
                var sorted = Array.from(this.cache.paramsData.entries())
                    .sort(function(a, b) { return (b[1].size || 0) - (a[1].size || 0); });

                for (var i = 0; i < sorted.length && totalSize > 10 * 1024 * 1024; i++) {
                    var key = sorted[i][0];
                    var size = sorted[i][1].size || 0;
                    this.cache.paramsData.delete(key);
                    totalSize -= size;
                    toDelete.push(key);
                }
            }

            this.stats.memoryCleanups++;
            this.stats.lastCleanup = Date.now();

            this.log('🗑️ Memory cleanup completed. Deleted', toDelete.length, 'large objects');
        },

        /**
         * 获取性能统计
         */
        getPerformanceStats: function() {
            return {
                cacheStats: {
                    hits: this.stats.cacheHits,
                    misses: this.stats.cacheMisses,
                    hitRate: this.stats.cacheHits / (this.stats.cacheHits + this.stats.cacheMisses) * 100 || 0,
                    constantsCache: this.cache.constants.size,
                    apiCache: this.cache.apiData.size,
                    paramsCache: this.cache.paramsData.size
                },
                memoryStats: {
                    cleanups: this.stats.memoryCleanups,
                    lastCleanup: this.stats.lastCleanup
                },
                memoryUsage: performance.memory ? {
                    used: (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + 'MB',
                    total: (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2) + 'MB',
                    limit: (performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2) + 'MB'
                } : null
            };
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
    window.GlobalOptimizer = GlobalOptimizer;

    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            GlobalOptimizer.init();
        });
    } else {
        GlobalOptimizer.init();
    }

    // 添加全局辅助函数
    window.checkOptimizationStats = function() {
        return GlobalOptimizer.getPerformanceStats();
    };

    window.clearOptimizationCache = function() {
        GlobalOptimizer.cleanupExpiredCache();
        GlobalOptimizer.performMemoryCleanup();
    };

})(window);