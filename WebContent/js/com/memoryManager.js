/**
 * 内存管理器 - 防止前端内存泄漏
 * 创建时间：2025-12-14
 * 功能：统一管理定时器、事件监听器、Ajax请求和DOM引用
 */

(function(window) {
    'use strict';

    /**
     * 内存管理器核心对象
     */
    var MemoryManager = {
        // 定时器存储
        timers: [],
        // 事件监听器存储
        eventListeners: [],
        // Ajax请求存储
        ajaxRequests: [],
        // DOM引用存储
        domRefs: [],
        // 组件实例存储
        componentInstances: [],

        /**
         * 添加定时器
         * @param {String} id 定时器标识
         * @param {Number|Object} timer 定时器句柄或配置
         */
        addTimer: function(id, timer) {
            this.removeTimer(id); // 先移除同名的定时器
            this.timers.push({
                id: id,
                timer: timer,
                created: Date.now()
            });
        },

        /**
         * 移除定时器
         * @param {String} id 定时器标识
         */
        removeTimer: function(id) {
            for (var i = this.timers.length - 1; i >= 0; i--) {
                var item = this.timers[i];
                if (item.id === id) {
                    if (typeof item.timer === 'number') {
                        clearTimeout(item.timer);
                        clearInterval(item.timer);
                    } else if (item.timer && typeof item.timer.destroy === 'function') {
                        item.timer.destroy();
                    }
                    this.timers.splice(i, 1);
                }
            }
        },

        /**
         * 清除所有定时器
         */
        clearAllTimers: function() {
            var timers = this.timers.slice(); // 复制数组避免遍历问题
            for (var i = 0; i < timers.length; i++) {
                this.removeTimer(timers[i].id);
            }
            this.timers = [];
        },

        /**
         * 添加事件监听器
         * @param {String} id 监听器标识
         * @param {Element} element DOM元素
         * @param {String} event 事件类型
         * @param {Function} handler 事件处理函数
         */
        addEventListener: function(id, element, event, handler) {
            // 包装事件处理函数
            var wrappedHandler = function(e) {
                try {
                    return handler.call(this, e);
                } catch (error) {
                    console.error('Event handler error:', error);
                }
            };

            if (element.addEventListener) {
                element.addEventListener(event, wrappedHandler);
            } else if (element.attachEvent) {
                element.attachEvent('on' + event, wrappedHandler);
            }

            this.eventListeners.push({
                id: id,
                element: element,
                event: event,
                handler: wrappedHandler,
                originalHandler: handler
            });
        },

        /**
         * 移除事件监听器
         * @param {String} id 监听器标识
         */
        removeEventListener: function(id) {
            for (var i = this.eventListeners.length - 1; i >= 0; i--) {
                var listener = this.eventListeners[i];
                if (listener.id === id) {
                    if (listener.element.removeEventListener) {
                        listener.element.removeEventListener(listener.event, listener.handler);
                    } else if (listener.element.detachEvent) {
                        listener.element.detachEvent('on' + listener.event, listener.handler);
                    }
                    this.eventListeners.splice(i, 1);
                }
            }
        },

        /**
         * 清除所有事件监听器
         */
        clearAllEventListeners: function() {
            var listeners = this.eventListeners.slice();
            for (var i = 0; i < listeners.length; i++) {
                this.removeEventListener(listeners[i].id);
            }
            this.eventListeners = [];
        },

        /**
         * 添加Ajax请求
         * @param {String} id 请求标识
         * @param {Object} xhr XMLHttpRequest对象或jQuery XHR
         */
        addAjaxRequest: function(id, xhr) {
            this.removeAjaxRequest(id); // 先取消同名请求
            this.ajaxRequests.push({
                id: id,
                xhr: xhr,
                created: Date.now()
            });
        },

        /**
         * 移除/取消Ajax请求
         * @param {String} id 请求标识
         */
        removeAjaxRequest: function(id) {
            for (var i = this.ajaxRequests.length - 1; i >= 0; i--) {
                var request = this.ajaxRequests[i];
                if (request.id === id) {
                    if (request.xhr && request.xhr.abort) {
                        request.xhr.abort();
                    }
                    this.ajaxRequests.splice(i, 1);
                }
            }
        },

        /**
         * 清除所有Ajax请求
         */
        clearAllAjaxRequests: function() {
            var requests = this.ajaxRequests.slice();
            for (var i = 0; i < requests.length; i++) {
                this.removeAjaxRequest(requests[i].id);
            }
            this.ajaxRequests = [];
        },

        /**
         * 添加DOM引用
         * @param {String} id 引用标识
         * @param {Element|jQuery} element DOM元素
         */
        addDomRef: function(id, element) {
            this.removeDomRef(id); // 先移除同名引用
            this.domRefs.push({
                id: id,
                element: element,
                created: Date.now()
            });
        },

        /**
         * 移除DOM引用
         * @param {String} id 引用标识
         */
        removeDomRef: function(id) {
            for (var i = this.domRefs.length - 1; i >= 0; i--) {
                var ref = this.domRefs[i];
                if (ref.id === id) {
                    // 清理jQuery对象
                    if (ref.element && ref.element.remove) {
                        ref.element.remove();
                    }
                    // 清理DOM元素
                    if (ref.element && ref.element.parentNode) {
                        ref.element.parentNode.removeChild(ref.element);
                    }
                    this.domRefs.splice(i, 1);
                }
            }
        },

        /**
         * 清除所有DOM引用
         */
        clearAllDomRefs: function() {
            var refs = this.domRefs.slice();
            for (var i = 0; i < refs.length; i++) {
                this.removeDomRef(refs[i].id);
            }
            this.domRefs = [];
        },

        /**
         * 添加组件实例
         * @param {String} id 组件标识
         * @param {Object} instance 组件实例
         */
        addComponent: function(id, instance) {
            this.removeComponent(id); // 先销毁同名组件
            this.componentInstances.push({
                id: id,
                instance: instance,
                created: Date.now()
            });
        },

        /**
         * 移除组件实例
         * @param {String} id 组件标识
         */
        removeComponent: function(id) {
            for (var i = this.componentInstances.length - 1; i >= 0; i--) {
                var component = this.componentInstances[i];
                if (component.id === id) {
                    // 调用组件的销毁方法
                    if (component.instance && typeof component.instance.destroy === 'function') {
                        component.instance.destroy();
                    }
                    this.componentInstances.splice(i, 1);
                }
            }
        },

        /**
         * 清除所有组件实例
         */
        clearAllComponents: function() {
            var components = this.componentInstances.slice();
            for (var i = 0; i < components.length; i++) {
                this.removeComponent(components[i].id);
            }
            this.componentInstances = [];
        },

        /**
         * 清理指定页面的所有资源
         * @param {String} pageId 页面ID
         */
        cleanupPage: function(pageId) {
            var prefix = pageId + '_';

            // 清理定时器
            for (var i = this.timers.length - 1; i >= 0; i--) {
                if (this.timers[i].id.indexOf(prefix) === 0) {
                    this.removeTimer(this.timers[i].id);
                }
            }

            // 清理事件监听器
            for (var i = this.eventListeners.length - 1; i >= 0; i--) {
                if (this.eventListeners[i].id.indexOf(prefix) === 0) {
                    this.removeEventListener(this.eventListeners[i].id);
                }
            }

            // 清理Ajax请求
            for (var i = this.ajaxRequests.length - 1; i >= 0; i--) {
                if (this.ajaxRequests[i].id.indexOf(prefix) === 0) {
                    this.removeAjaxRequest(this.ajaxRequests[i].id);
                }
            }

            // 清理DOM引用
            for (var i = this.domRefs.length - 1; i >= 0; i--) {
                if (this.domRefs[i].id.indexOf(prefix) === 0) {
                    this.removeDomRef(this.domRefs[i].id);
                }
            }

            // 清理组件实例
            for (var i = this.componentInstances.length - 1; i >= 0; i--) {
                if (this.componentInstances[i].id.indexOf(prefix) === 0) {
                    this.removeComponent(this.componentInstances[i].id);
                }
            }
        },

        /**
         * 清理所有资源
         */
        cleanup: function() {
            this.clearAllTimers();
            this.clearAllEventListeners();
            this.clearAllAjaxRequests();
            this.clearAllDomRefs();
            this.clearAllComponents();

            // 清理全局变量
            if (window.params && typeof window.params === 'object') {
                // 保留必要的配置参数，清理大对象
                var keepKeys = ['authentication', 'loginTime', 'userInfo', 'company'];
                var newParams = {};
                for (var i = 0; i < keepKeys.length; i++) {
                    var key = keepKeys[i];
                    if (window.params[key]) {
                        newParams[key] = window.params[key];
                    }
                }
                window.params = newParams;
            }
        },

        /**
         * 获取内存使用统计
         */
        getStats: function() {
            return {
                timers: this.timers.length,
                eventListeners: this.eventListeners.length,
                ajaxRequests: this.ajaxRequests.length,
                domRefs: this.domRefs.length,
                components: this.componentInstances.length
            };
        },

        /**
         * 启动内存监控
         * @param {Number} interval 检查间隔（毫秒）
         */
        startMonitoring: function(interval) {
            interval = interval || 30000; // 默认30秒检查一次

            this.addTimer('memory_monitor', setInterval(function() {
                var stats = MemoryManager.getStats();
                console.log('Memory Manager Stats:', stats);

                // 如果定时器过多，发出警告
                if (stats.timers > 20) {
                    console.warn('Too many active timers:', stats.timers);
                }

                // 如果Ajax请求过多，发出警告
                if (stats.ajaxRequests > 10) {
                    console.warn('Too many active Ajax requests:', stats.ajaxRequests);
                }
            }, interval));
        },

        /**
         * 停止内存监控
         */
        stopMonitoring: function() {
            this.removeTimer('memory_monitor');
        }
    };

    // 页面卸载时自动清理
    window.addEventListener('beforeunload', function() {
        MemoryManager.cleanup();
    });

    // 导出到全局
    window.MemoryManager = MemoryManager;

    // 提供便捷方法
    window.cleanup = function(pageId) {
        if (pageId) {
            MemoryManager.cleanupPage(pageId);
        } else {
            MemoryManager.cleanup();
        }
    };

})(window);