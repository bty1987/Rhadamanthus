/**
 * 常量加载修复补丁 - 专门解决searcher常量获取问题
 * 创建时间：2025-12-14
 * 功能：确保constant对象在searcher使用前已正确初始化
 */

(function() {
    'use strict';

    /**
     * 常量加载修复器
     */
    var ConstantLoaderFix = {
        initialized: false,
        loadingPromise: null,

        /**
         * 初始化常量加载修复
         */
        init: function() {
            if (this.initialized) return;
            this.initialized = true;

            console.log('🔧 Constant Loader Fix - Initializing...');

            // 修复Constant对象的初始化
            this.fixConstantInit();

            // 确保常量在页面加载完成前就绪
            this.ensureConstantsReady();

            // 修复searcher常量获取
            this.fixSearcherConstants();

            console.log('✅ Constant Loader Fix - Ready!');
        },

        /**
         * 修复Constant对象初始化
         */
        fixConstantInit: function() {
            var self = this;

            // 检查Constant对象是否存在
            if (typeof Constant === 'undefined') {
                console.warn('Constant function not found, creating placeholder...');
                window.Constant = function() {
                    return {
                        init: function() {
                            return Promise.resolve({});
                        }
                    };
                };
                return;
            }

            // 备份原始Constant函数
            var originalConstant = window.Constant;

            // 重写Constant函数，增强常量加载
            window.Constant = function() {
                var enhancedConstant = {
                    init: function() {
                        return self.loadAllConstants();
                    },

                    /**
                     * 加载所有必要的常量
                     */
                    loadAllConstants: function() {
                        if (self.loadingPromise) {
                            return self.loadingPromise;
                        }

                        self.loadingPromise = new Promise(function(resolve, reject) {
                            // 加载核心常量模块
                            var coreModules = ['common', 'system', 'personel'];
                            var promises = [];

                            coreModules.forEach(function(module) {
                                promises.push(self.loadConstantsModule(module));
                            });

                            Promise.all(promises).then(function() {
                                console.log('✅ Core constants loaded successfully');
                                resolve();
                            }).catch(function(error) {
                                console.error('❌ Failed to load constants:', error);
                                // 即使失败也resolve，避免阻塞页面
                                resolve();
                            });
                        });

                        return self.loadingPromise;
                    }
                };

                // 保留原有的constant对象
                if (typeof window.constant !== 'undefined') {
                    enhancedConstant.constant = window.constant;
                } else {
                    window.constant = {};
                    enhancedConstant.constant = window.constant;
                }

                return enhancedConstant;
            };
        },

        /**
         * 加载指定模块的常量
         */
        loadConstantsModule: function(module) {
            return new Promise(function(resolve, reject) {
                if (typeof com === 'undefined' || typeof api === 'undefined' || !api.data || !api.data.queryConstant) {
                    console.warn('Required objects not available for loading constants');
                    resolve([]);
                    return;
                }

                var options = {
                    "constant.status": 0,
                    "constant.module": module
                };

                com.post(api.data.queryConstant, options, function(res) {
                    var constants = res.constants || [];

                    // 存储到global constant对象
                    if (!window.constant[module]) {
                        window.constant[module] = {};
                    }

                    // 按clazz组织常量
                    constants.forEach(function(item) {
                        if (!window.constant[module][item.clazz]) {
                            window.constant[module][item.clazz] = {};
                        }
                        window.constant[module][item.clazz][item.key] = item.value;
                    });

                    console.log('✓ Constants loaded for module:', module, '(' + constants.length + ' items)');
                    resolve(constants);
                });
            });
        },

        /**
         * 确保常量在页面加载完成前就绪
         */
        ensureConstantsReady: function() {
            var self = this;

            // 在DOM加载完成前初始化常量
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                    // 初始化Constant
                    var constantLoader = Constant();
                    constantLoader.init().then(function() {
                        self.onConstantsReady();
                    });
                });
            } else {
                // DOM已加载完成
                var constantLoader = Constant();
                constantLoader.init().then(function() {
                    self.onConstantsReady();
                });
            }
        },

        /**
         * 常量加载完成回调
         */
        onConstantsReady: function() {
            console.log('🎯 All constants are ready for use!');

            // 触发常量加载完成事件
            if (typeof window.jQuery !== 'undefined') {
                window.jQuery(document).trigger('constantsReady');
            }
        },

        /**
         * 修复searcher常量获取
         */
        fixSearcherConstants: function() {
            var self = this;

            // 修复_rappr相关的问题
            if (typeof Searcher !== 'undefined') {
                // 增强Searcher对象，确保常量可用
                var originalSearcher = Searcher;

                window.Searcher = function() {
                    var searcher = originalSearcher.apply(this, arguments);

                    // 确保常量可用
                    searcher.ensureConstants = function() {
                        if (window.constant && Object.keys(window.constant).length === 0) {
                            console.warn('Constants not loaded, forcing reload...');
                            var constantLoader = Constant();
                            return constantLoader.init();
                        }
                        return Promise.resolve();
                    };

                    return searcher;
                };
            }

            // 增强params.selectCaching
            if (typeof window.params !== 'undefined') {
                if (!window.params.selectCaching) {
                    window.params.selectCaching = {};
                }
            }

            // 提供全局常量获取方法
            window.getConstantsForModule = function(module, clazz) {
                if (!window.constant || !window.constant[module]) {
                    console.warn('Constants not available for module:', module);
                    return [];
                }

                if (clazz && window.constant[module][clazz]) {
                    return window.constant[module][clazz];
                }

                // 如果没有指定clazz，返回模块的所有常量
                var allConstants = [];
                if (window.constant[module]) {
                    Object.keys(window.constant[module]).forEach(function(clz) {
                        var moduleConstants = window.constant[module][clz];
                        Object.keys(moduleConstants).forEach(function(key) {
                            allConstants.push({
                                key: key,
                                value: moduleConstants[key],
                                clazz: clz
                            });
                        });
                    });
                }

                return allConstants;
            };

            // 提供快速常量获取方法
            window.getConstantValue = function(module, clazz, key) {
                try {
                    return window.constant[module][clazz][key];
                } catch (e) {
                    console.warn('Constant not found:', module, clazz, key);
                    return null;
                }
            };
        }
    };

    // 检查是否需要自动初始化
    if (typeof window.searcherConstantsAutoInit === 'undefined' || window.searcherConstantsAutoInit) {
        // 页面加载完成后自动初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                ConstantLoaderFix.init();
            });
        } else {
            ConstantLoaderFix.init();
        }
    }

    // 导出到全局
    window.ConstantLoaderFix = ConstantLoaderFix;

    // 提供手动初始化方法
    window.initConstants = function() {
        return ConstantLoaderFix.init();
    };

})();