/**
 * Constant API兼容性修复补丁
 * 创建时间：2025-12-14
 * 功能：为Constant对象添加missing的方法，保持向后兼容
 */

(function() {
    'use strict';

    /**
     * Constant API兼容性修复器
     * 修复Constant()对象缺少module方法的问题
     */
    var ConstantAPICompatibility = {
        initialized: false,

        /**
         * 初始化兼容性修复
         */
        init: function() {
            if (this.initialized) return;
            this.initialized = true;

            console.log('🔧 Constant API Compatibility Fix - Initializing...');

            // 增强Constant对象
            this.enhanceConstantObject();

            // 添加缺失的方法
            this.addMissingMethods();

            console.log('✅ Constant API Compatibility Fix - Ready!');
        },

        /**
         * 增强Constant对象
         */
        enhanceConstantObject: function() {
            var self = this;

            // 备份原始Constant
            var originalConstant = window.Constant;

            // 重写Constant函数
            window.Constant = function() {
                var constantObj = originalConstant.apply(this, arguments);

                // 添加缺失的module方法
                constantObj.module = function(moduleName) {
                    return self.loadModuleConstants(moduleName);
                };

                // 添加其他可能需要的方法
                constantObj.loadModule = function(moduleName) {
                    return self.loadModuleConstants(moduleName);
                };

                // 保留原有的所有方法
                return constantObj;
            };
        },

        /**
         * 添加缺失的方法
         */
        addMissingMethods: function() {
            var self = this;

            // 如果constant对象已存在，直接增强
            if (typeof window.constant !== 'undefined') {
                window.constant.module = function(moduleName) {
                    return self.loadModuleConstants(moduleName);
                };

                window.constant.loadModule = function(moduleName) {
                    return self.loadModuleConstants(moduleName);
                };
            }
        },

        /**
         * 加载指定模块的常量
         */
        loadModuleConstants: function(moduleName) {
            var self = this;

            if (!moduleName) {
                console.warn('Module name is required');
                return Promise.reject('Module name is required');
            }

            return new Promise(function(resolve, reject) {
                if (typeof com === 'undefined' || typeof api === 'undefined' || !api.data || !api.data.queryConstant) {
                    console.warn('Required objects not available for loading constants');
                    resolve([]);
                    return;
                }

                // 检查常量是否已加载
                if (window.constant && window.constant[moduleName] && Object.keys(window.constant[moduleName]).length > 0) {
                    resolve(window.constant[moduleName]);
                    return;
                }

                var options = {
                    "constant.status": 0,
                    "constant.module": moduleName
                };

                com.post(api.data.queryConstant, options, function(res) {
                    try {
                        var constants = res.constants || [];
                        console.log('✅ Loading constants for module:', moduleName, '(' + constants.length + ' items)');

                        // 存储常量到global constant对象
                        if (!window.constant[moduleName]) {
                            window.constant[moduleName] = {};
                        }

                        // 按clazz组织常量
                        constants.forEach(function(item) {
                            if (!window.constant[moduleName][item.clazz]) {
                                window.constant[moduleName][item.clazz] = {};
                            }

                            if (/^\d+$/.test(item.key)) {
                                item.key = parseInt(item.key);
                            }

                            // 存储到不同的结构中
                            window.constant[moduleName][item.clazz][item.field] = item.key;
                            window.constant[moduleName][item.clazz][item.key] = item.value;

                            // 创建类型存储结构
                            if (!window.constant[moduleName][item.clazz][item.type]) {
                                window.constant[moduleName][item.clazz][item.type] = {
                                    datas: [],
                                    keys: {},
                                    values: {}
                                };
                            }

                            window.constant[moduleName][item.clazz][item.type]["keys"][item.key] = item.value;
                            window.constant[moduleName][item.clazz][item.type]["values"][item.value] = item.key;
                            window.constant[moduleName][item.clazz][item.type]["datas"].push({
                                key: item.key,
                                value: item.value
                            });
                        });

                        // 设置加载完成标志
                        if (window.constant[moduleName]) {
                            window.constant[moduleName]["load"] = true;
                        }

                        resolve(window.constant[moduleName]);

                    } catch (error) {
                        console.error('Error processing constants for module:', moduleName, error);
                        reject(error);
                    }
                });
            });
        },

        /**
         * 初始化所有常量模块
         */
        initAllConstants: function() {
            var self = this;

            // 预定义的模块列表
            var modules = ['common', 'system', 'personel', 'decoration', 'quotation', 'construction', 'sales', 'material', 'payment', 'customer', 'balance'];

            var promises = modules.map(function(module) {
                return self.loadModuleConstants(module);
            });

            return Promise.all(promises).then(function() {
                console.log('✅ All predefined constant modules loaded');
            }).catch(function(error) {
                console.warn('⚠️ Some constant modules failed to load:', error);
            });
        },

        /**
         * 获取模块常量
         */
        getModuleConstants: function(moduleName, clazz) {
            if (!window.constant || !window.constant[moduleName]) {
                return {};
            }

            if (clazz && window.constant[moduleName][clazz]) {
                return window.constant[moduleName][clazz];
            }

            return window.constant[moduleName];
        },

        /**
         * 获取常量值
         */
        getConstantValue: function(moduleName, clazz, key) {
            try {
                if (clazz && key) {
                    return window.constant[moduleName][clazz][key];
                }
                return null;
            } catch (e) {
                console.warn('Constant not found:', moduleName, clazz, key);
                return null;
            }
        }
    };

    // 页面加载完成后自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            ConstantAPICompatibility.init();
        });
    } else {
        ConstantAPICompatibility.init();
    }

    // 导出到全局
    window.ConstantAPICompatibility = ConstantAPICompatibility;

    // 提供便捷方法
    window.initConstants = function() {
        return ConstantAPICompatibility.init();
    };

    window.loadModuleConstants = function(moduleName) {
        return ConstantAPICompatibility.loadModuleConstants(moduleName);
    };

    window.getModuleConstants = function(moduleName, clazz) {
        return ConstantAPICompatibility.getModuleConstants(moduleName, clazz);
    };

})();