/**
 * 性能优化补丁 - 修复版 (解决searcher兼容性问题)
 * 创建时间：2025-12-14
 * 修复：保持API加载顺序，确保searcher等组件正常工作
 */

(function() {
    'use strict';

    /**
     * 修复版性能优化补丁
     * 重点解决API异步加载导致的兼容性问题
     */
    var PerformancePatchFixed = {
        initialized: false,
        pageStartTime: Date.now(),
        apiLoadQueue: [],
        apiLoadingCount: 0,

        /**
         * 初始化性能优化补丁
         */
        init: function() {
            if (this.initialized) return;
            this.initialized = true;

            console.log('🚀 Performance Patch Fixed - Initializing...');

            // 修复API加载问题（保持兼容性）
            this.fixApiLoadingCompatible();

            // 修复params内存累积问题
            this.fixParamsMemory();

            // 修复constant全量加载问题
            this.fixConstantLoading();

            // 启动性能监控
            this.startPerformanceMonitoring();

            var loadTime = Date.now() - this.pageStartTime;
            console.log('✅ Performance Patch Fixed - Ready! (' + loadTime + 'ms)');
        },

        /**
         * 兼容性修复的API加载
         * 保持原有的加载逻辑，但优化性能
         */
        fixApiLoadingCompatible: function() {
            var self = this;

            // 检查Api函数是否存在
            if (typeof Api !== 'function') {
                console.warn('Api function not found');
                return;
            }

            // 备份并增强原始init方法
            var originalApiInit = Api().init;

            Api().init = function(path) {
                console.log('📦 Loading API modules with compatibility mode...');
                var pathBase = path || 'js/api/';

                // 定义加载顺序（保持与原系统一致）
                var loadOrder = [
                    // 第一批：核心基础模块（同步加载）
                    { name: 'system', sync: true },
                    { name: 'common', sync: true },
                    { name: 'data', sync: true },
                    { name: 'ds', sync: true },

                    // 第二批：业务核心模块（同步加载，保证兼容性）
                    { name: 'personel', sync: true },
                    { name: 'communion', sync: true },
                    { name: 'approval', sync: true },

                    // 第三批：主要业务模块（异步加载）
                    { name: 'decoration', sync: false },
                    { name: 'quotation', sync: false },
                    { name: 'construction', sync: false },
                    { name: 'balance', sync: false },
                    { name: 'sales', sync: false },
                    { name: 'material', sync: false },
                    { name: 'payment', sync: false },
                    { name: 'customer', sync: false },
                    { name: 'building', sync: false },

                    // 第四批：扩展模块（异步加载）
                    { name: 'information', sync: false },
                    { name: 'inventory', sync: false },
                    { name: 'log', sync: false },
                    { name: 'report', sync: false },
                    { name: 'right', sync: false },
                    { name: 'salary', sync: false },
                    { name: 'production', sync: false }
                ];

                // 分批加载
                self.loadApiModulesInBatches(loadOrder, pathBase);

                return true;
            };
        },

        /**
         * 分批加载API模块
         */
        loadApiModulesInBatches: function(loadOrder, pathBase) {
            var self = this;
            var batchIndex = 0;

            function loadNextBatch() {
                if (batchIndex >= loadOrder.length) {
                    console.log('📦 All API modules loaded!');
                    return;
                }

                var batch = [];
                var currentBatchSize = 0;
                var maxBatchSize = 3; // 每批最多3个

                // 收集当前批次的模块
                while (batchIndex < loadOrder.length && currentBatchSize < maxBatchSize) {
                    var module = loadOrder[batchIndex];

                    // 同步模块和异步模块分开处理
                    if (module.sync) {
                        // 同步加载
                        loadSync(module.name);
                        currentBatchSize++;
                    } else {
                        // 异步加载
                        batch.push(module.name);
                        currentBatchSize++;
                    }
                    batchIndex++;
                }

                // 加载异步批次
                if (batch.length > 0) {
                    loadAsyncBatch(batch);
                }

                // 继续下一批
                setTimeout(loadNextBatch, 100);
            }

            function loadSync(moduleName) {
                try {
                    var url = pathBase + moduleName + '.js';
                    $.ajax({
                        url: url,
                        cache: true,
                        type: 'get',
                        dataType: 'script',
                        async: false
                    });
                    console.log('✓ Sync module loaded:', moduleName);
                } catch (e) {
                    console.error('✗ Failed to load sync module:', moduleName, e);
                }
            }

            function loadAsyncBatch(moduleNames) {
                var promises = moduleNames.map(function(moduleName) {
                    return new Promise(function(resolve) {
                        var url = pathBase + moduleName + '.js';
                        var script = document.createElement('script');
                        script.src = url;
                        script.async = true;
                        script.onload = function() {
                            console.log('✓ Async module loaded:', moduleName);
                            resolve();
                        };
                        script.onerror = function() {
                            console.error('✗ Failed to load async module:', moduleName);
                            resolve(); // 继续加载其他模块
                        };
                        document.head.appendChild(script);
                    });
                });

                return Promise.all(promises);
            }

            // 开始加载
            loadNextBatch();
        },

        /**
         * 修复params内存累积
         */
        fixParamsMemory: function() {
            if (typeof window.params === 'undefined') {
                console.warn('params object not found');
                return;
            }

            // 创建智能清理函数
            window.cleanupParams = function() {
                // 保留必要的全局参数
                var keepKeys = [
                    'authentication', 'loginTime', 'userInfo', 'company',
                    'apiHistory', 'userCompany'
                ];

                // 保留当前页面可能需要的参数
                var currentPage = window.location.pathname.split('/').pop();
                var pageSpecificKeys = [];

                if (currentPage.indexOf('decoration') !== -1) {
                    pageSpecificKeys.push('decoration');
                } else if (currentPage.indexOf('quotation') !== -1) {
                    pageSpecificKeys.push('quotation');
                } else if (currentPage.indexOf('sales') !== -1) {
                    pageSpecificKeys.push('sales');
                } else if (currentPage.indexOf('customer') !== -1) {
                    pageSpecificKeys.push('customer');
                }

                // 合并保留的key
                var allKeepKeys = keepKeys.concat(pageSpecificKeys);

                var newParams = {};
                var cleanedCount = 0;

                // 保留必要数据
                allKeepKeys.forEach(function(key) {
                    if (window.params[key]) {
                        newParams[key] = window.params[key];
                    }
                });

                // 清理大对象（检查大小）
                var largeKeys = ['construction', 'balance', 'material', 'payment'];
                largeKeys.forEach(function(key) {
                    if (window.params[key]) {
                        try {
                            var size = JSON.stringify(window.params[key]).length;
                            if (size > 10000) { // 大于10KB的对象
                                delete window.params[key];
                                cleanedCount++;
                                console.log('🧹 Cleaned large object:', key, '(' + (size/1024).toFixed(1) + 'KB)');
                            }
                        } catch (e) {
                            delete window.params[key]; // 无法序列化的对象直接删除
                            cleanedCount++;
                        }
                    }
                });

                window.params = newParams;
                if (cleanedCount > 0) {
                    console.log('🧹 params cleanup completed. Cleaned', cleanedCount, 'objects');
                }
            };

            // 页面切换时智能清理（延迟执行，避免影响当前操作）
            if (typeof com !== 'undefined' && com.switchPage) {
                var originalSwitchPage = com.switchPage;
                com.switchPage = function(url, notTab, data, callback) {
                    // 延迟清理，确保当前页面操作完成
                    setTimeout(function() {
                        window.cleanupParams();
                    }, 1000);
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

            // 创建智能缓存系统
            var constantCache = new Map();
            var cacheTimeout = 30 * 60 * 1000; // 30分钟
            var loadingPromises = new Map(); // 防止重复加载

            // 重写constant获取方法
            window.getConstant = function(module, clazz, callback) {
                var cacheKey = module + '_' + (clazz || 'default');
                var cached = constantCache.get(cacheKey);

                // 检查缓存
                if (cached && (Date.now() - cached.timestamp < cacheTimeout)) {
                    if (callback) callback(cached.data);
                    return cached.data;
                }

                // 检查是否正在加载
                if (loadingPromises.has(cacheKey)) {
                    if (callback) {
                        loadingPromises.get(cacheKey).then(function(data) {
                            callback(data);
                        });
                    }
                    return loadingPromises.get(cacheKey);
                }

                // 开始加载
                var loadPromise = new Promise(function(resolve, reject) {
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

                        loadingPromises.delete(cacheKey);
                        console.log('✓ Constants loaded and cached:', cacheKey);

                        if (callback) callback(data);
                        resolve(data);
                    });
                });

                loadingPromises.set(cacheKey, loadPromise);
                return loadPromise;
            };

            // 清理过期缓存的函数
            window.cleanupConstants = function() {
                var now = Date.now();
                var cleanedCount = 0;

                constantCache.forEach(function(value, key) {
                    if (now - value.timestamp > cacheTimeout) {
                        constantCache.delete(key);
                        cleanedCount++;
                    }
                });

                if (cleanedCount > 0) {
                    console.log('🧹 Constants cache cleanup completed. Cleaned', cleanedCount, 'entries');
                }
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
                    constantCacheSize: window.getConstant ?
                        (constantCache.size || 0) : 0,
                    memoryUsage: self.getMemoryUsage(),
                    pageInfo: self.getPageInfo()
                };

                console.log('📊 Performance Stats:', stats);
                return stats;
            };

            // 定期清理（降低频率，避免影响性能）
            setInterval(function() {
                window.cleanupConstants();

                // 每10分钟清理一次params（减少频率）
                if (Date.now() % (10 * 60 * 1000) < 60000) {
                    window.cleanupParams();
                }
            }, 5 * 60 * 1000); // 每5分钟检查一次
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
        },

        /**
         * 获取页面信息
         */
        getPageInfo: function() {
            return {
                url: window.location.href,
                pathname: window.location.pathname,
                search: window.location.search,
                hash: window.location.hash,
                timestamp: Date.now()
            };
        }
    };

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            PerformancePatchFixed.init();
        });
    } else {
        PerformancePatchFixed.init();
    }

    // 导出到全局
    window.PerformancePatchFixed = PerformancePatchFixed;

    // 为了向后兼容，也导出原名称
    window.PerformancePatch = PerformancePatchFixed;

})();