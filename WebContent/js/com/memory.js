/**
 * 自动内存管理器 - 零修改业务代码的内存泄漏解决方案
 * 创建时间：2025-12-14
 * 功能：自动拦截和管理所有前端资源，无需修改业务代码
 */

(function() {
    'use strict';

    /**
     * 自动内存管理器
     * 原理：通过重写原生API和框架方法，自动捕获所有资源创建和销毁
     */
    var AutoMemoryManager = {
        // 页面资源映射
        pageResources: new Map(),
        // 全局资源跟踪
        globalResources: {
            timers: new Set(),
            intervals: new Set(),
            ajaxRequests: new Set(),
            eventListeners: new Set(),
            domObservers: new Set()
        },
        // 当前活动页面ID
        currentPageId: null,
        // 是否已初始化
        initialized: false,
        // 配置选项
        config: {
            enableAutoCleanup: true,
            debugMode: false,
            maxResourcesPerPage: 100,
            cleanupInterval: 60000 // 1分钟检查一次
        },

        /**
         * 初始化自动内存管理器
         */
        init: function() {
            if (this.initialized) return;

            this.initialized = true;
            this.currentPageId = this.generatePageId();

            // 拦截原生API
            this.interceptNativeAPIs();

            // 拦截jQuery方法
            this.interceptJQuery();

            // 拦截com对象方法
            this.interceptComObject();

            // 拦截第三方库
            this.interceptThirdPartyLibs();

            // 启动自动清理
            this.startAutoCleanup();

            // 监听页面变化
            this.observePageChanges();

            if (this.config.debugMode) {
                console.log('AutoMemoryManager initialized for page:', this.currentPageId);
            }
        },

        /**
         * 生成页面ID
         */
        generatePageId: function() {
            // 从URL或页面标题生成唯一ID
            var url = window.location.pathname;
            var title = document.title;
            var timestamp = Date.now();
            return 'page_' + btoa(url + title).slice(0, 16) + '_' + timestamp;
        },

        /**
         * 拦截原生定时器API
         */
        interceptNativeAPIs: function() {
            var self = this;

            // 拦截setTimeout
            var originalSetTimeout = window.setTimeout;
            window.setTimeout = function(callback, delay) {
                var timerId = originalSetTimeout.call(this, function() {
                    try {
                        callback.apply(this, arguments);
                    } finally {
                        self.globalResources.timers.delete(timerId);
                    }
                }, delay);

                self.globalResources.timers.add(timerId);
                self.trackResource('timer', timerId);

                return timerId;
            };

            // 拦截clearTimeout
            var originalClearTimeout = window.clearTimeout;
            window.clearTimeout = function(timerId) {
                self.globalResources.timers.delete(timerId);
                return originalClearTimeout.apply(this, arguments);
            };

            // 拦截setInterval
            var originalSetInterval = window.setInterval;
            window.setInterval = function(callback, interval) {
                var intervalId = originalSetInterval.call(this, function() {
                    try {
                        callback.apply(this, arguments);
                    } catch (error) {
                        console.error('Interval error:', error);
                        // 发生错误时自动清理
                        self.globalResources.intervals.delete(intervalId);
                        clearInterval(intervalId);
                    }
                }, interval);

                self.globalResources.intervals.add(intervalId);
                self.trackResource('interval', intervalId);

                return intervalId;
            };

            // 拦截clearInterval
            var originalClearInterval = window.clearInterval;
            window.clearInterval = function(intervalId) {
                self.globalResources.intervals.delete(intervalId);
                return originalClearInterval.apply(this, arguments);
            };

            // 拦截addEventListener
            var originalAddEventListener = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                var wrappedListener = function(event) {
                    try {
                        return listener.call(this, event);
                    } catch (error) {
                        console.error('Event listener error:', error);
                    }
                };

                var result = originalAddEventListener.call(this, type, wrappedListener, options);

                // 存储原始监听器以供移除时使用
                var listenerInfo = {
                    element: this,
                    type: type,
                    listener: listener,
                    wrappedListener: wrappedListener,
                    pageId: self.currentPageId
                };

                self.globalResources.eventListeners.add(listenerInfo);
                self.trackResource('eventListener', listenerInfo);

                return result;
            };

            // 拦截removeEventListener
            var originalRemoveEventListener = EventTarget.prototype.removeEventListener;
            EventTarget.prototype.removeEventListener = function(type, listener, options) {
                // 查找并移除对应的包装监听器
                self.globalResources.eventListeners.forEach(function(info) {
                    if (info.element === this && info.type === type && info.listener === listener) {
                        originalRemoveEventListener.call(this, type, info.wrappedListener, options);
                        self.globalResources.eventListeners.delete(info);
                        return true;
                    }
                }.bind(this));

                return originalRemoveEventListener.call(this, type, listener, options);
            };
        },

        /**
         * 拦截jQuery方法
         */
        interceptJQuery: function() {
            if (typeof $ === 'undefined') return;

            var self = this;

            // 拦截jQuery事件绑定
            var originalOn = $.fn.on;
            $.fn.on = function(types, selector, data, fn, one) {
                // 处理参数重载
                if (typeof types === 'object') {
                    // 事件对象格式
                    for (var type in types) {
                        this.on(type, selector, data, types[type], one);
                    }
                    return this;
                }

                if (typeof selector === 'function') {
                    fn = selector;
                    selector = undefined;
                    data = undefined;
                }

                if (typeof data === 'function') {
                    fn = data;
                    data = undefined;
                }

                if (typeof fn === 'undefined') {
                    return this;
                }

                // 包装事件处理函数
                var wrappedFn = function(event) {
                    try {
                        return fn.apply(this, arguments);
                    } catch (error) {
                        console.error('jQuery event error:', error);
                    }
                };

                // 调用原始方法
                var result = originalOn.call(this, types, selector, data, wrappedFn, one);

                // 跟踪事件
                self.trackResource('jqueryEvent', {
                    elements: this,
                    types: types,
                    selector: selector,
                    originalFn: fn,
                    wrappedFn: wrappedFn,
                    pageId: self.currentPageId
                });

                return result;
            };

            // 拦截jQuery ajax
            var originalAjax = $.ajax;
            $.ajax = function(options) {
                var xhr = originalAjax.call(this, options);

                if (xhr && xhr.abort) {
                    self.globalResources.ajaxRequests.add(xhr);
                    self.trackResource('ajaxRequest', {
                        xhr: xhr,
                        options: options,
                        pageId: self.currentPageId
                    });

                    // 请求完成后自动移除
                    var originalDone = xhr.done;
                    xhr.done = function() {
                        self.globalResources.ajaxRequests.delete(xhr);
                        return originalDone.apply(this, arguments);
                    };

                    var originalFail = xhr.fail;
                    xhr.fail = function() {
                        self.globalResources.ajaxRequests.delete(xhr);
                        return originalFail.apply(this, arguments);
                    };
                }

                return xhr;
            };

            // 拦截jQuery DOM操作
            var originalEmpty = $.fn.empty;
            $.fn.empty = function() {
                // 在清空前清理事件
                this.find('*').off();
                this.off();
                return originalEmpty.call(this);
            };

            var originalRemove = $.fn.remove;
            $.fn.remove = function() {
                // 在移除前清理事件和数据
                this.find('*').off();
                this.off();
                this.removeData();
                return originalRemove.call(this);
            };
        },

        /**
         * 拦截com对象方法
         */
        interceptComObject: function() {
            if (typeof com === 'undefined') return;

            var self = this;

            // 拦截com.post
            if (com.post) {
                var originalComPost = com.post;
                com.post = function(api, options, callback, failCallback, asyncFlag) {
                    var wrappedCallback = function(response) {
                        // 请求完成，自动清理
                        if (currentRequest) {
                            self.globalResources.ajaxRequests.delete(currentRequest);
                        }
                        if (callback) callback(response);
                    };

                    var wrappedFailCallback = function(response) {
                        // 请求失败，自动清理
                        if (currentRequest) {
                            self.globalResources.ajaxRequests.delete(currentRequest);
                        }
                        if (failCallback) failCallback(response);
                    };

                    var currentRequest = originalComPost.call(this, api, options, wrappedCallback, wrappedFailCallback, asyncFlag);

                    if (currentRequest) {
                        self.globalResources.ajaxRequests.add(currentRequest);
                        self.trackResource('comAjax', {
                            request: currentRequest,
                            api: api,
                            pageId: self.currentPageId
                        });
                    }

                    return currentRequest;
                };
            }

            // 拦截com.popup
            if (com.popup) {
                var originalComPopup = com.popup;
                com.popup = function(container, title, width, height, success, cancel) {
                    var result = originalComPopup.call(this, container, title, width, height,
                        function(layero, index) {
                            self.trackResource('popup', {
                                element: $(layero),
                                index: index,
                                pageId: self.currentPageId
                            });
                            if (success) success(layero, index);
                        },
                        function(index) {
                            // 弹窗关闭时自动清理
                            self.cleanupPageResources(self.currentPageId, ['popup']);
                            if (cancel) cancel(index);
                        }
                    );

                    return result;
                };
            }
        },

        /**
         * 拦截第三方库
         */
        interceptThirdPartyLibs: function() {
            var self = this;

            // 拦截layer弹窗库
            if (typeof layer !== 'undefined') {
                var originalLayerOpen = layer.open;
                layer.open = function(options) {
                    var result = originalLayerOpen.call(this, options);

                    if (result && options.success) {
                        var originalSuccess = options.success;
                        options.success = function(layero, index) {
                            self.trackResource('layer', {
                                element: $(layero),
                                index: index,
                                pageId: self.currentPageId
                            });
                            originalSuccess(layero, index);
                        };
                    }

                    return result;
                };
            }

            // 拦截typeahead
            if (typeof $.fn.typeahead !== 'undefined') {
                var originalTypeahead = $.fn.typeahead;
                $.fn.typeahead = function(options) {
                    var result = originalTypeahead.call(this, options);

                    self.trackResource('typeahead', {
                        element: this,
                        options: options,
                        pageId: self.currentPageId
                    });

                    return result;
                };
            }

            // 拦截chosen
            if (typeof $.fn.chosen !== 'undefined') {
                var originalChosen = $.fn.chosen;
                $.fn.chosen = function(options) {
                    var result = originalChosen.call(this, options);

                    self.trackResource('chosen', {
                        element: this,
                        options: options,
                        pageId: self.currentPageId
                    });

                    return result;
                };
            }
        },

        /**
         * 跟踪资源
         */
        trackResource: function(type, resource) {
            if (!this.pageResources.has(this.currentPageId)) {
                this.pageResources.set(this.currentPageId, {
                    timers: new Set(),
                    intervals: new Set(),
                    ajaxRequests: new Set(),
                    eventListeners: new Set(),
                    components: new Set()
                });
            }

            var pageResource = this.pageResources.get(this.currentPageId);

            switch (type) {
                case 'timer':
                    pageResource.timers.add(resource);
                    break;
                case 'interval':
                    pageResource.intervals.add(resource);
                    break;
                case 'ajaxRequest':
                case 'comAjax':
                    pageResource.ajaxRequests.add(resource);
                    break;
                case 'eventListener':
                case 'jqueryEvent':
                    pageResource.eventListeners.add(resource);
                    break;
                default:
                    pageResource.components.add(resource);
            }
        },

        /**
         * 监听页面变化
         */
        observePageChanges: function() {
            var self = this;

            // 监听URL变化
            var lastUrl = window.location.href;
            setInterval(function() {
                if (window.location.href !== lastUrl) {
                    // URL发生变化，可能是页面切换
                    self.onPageChange();
                    lastUrl = window.location.href;
                }
            }, 100);

            // 监听DOM变化
            if (typeof MutationObserver !== 'undefined') {
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                            // 检查是否有新的页面容器
                            mutation.addedNodes.forEach(function(node) {
                                if (node.nodeType === Node.ELEMENT_NODE) {
                                    if (node.classList && node.classList.contains('flpage')) {
                                        self.onNewPage(node);
                                    }
                                }
                            });
                        }
                    });
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                this.globalResources.domObservers.add(observer);
            }
        },

        /**
         * 页面变化处理
         */
        onPageChange: function() {
            if (this.config.enableAutoCleanup) {
                this.cleanupOldPages();
            }
            this.currentPageId = this.generatePageId();

            if (this.config.debugMode) {
                console.log('Page changed, new ID:', this.currentPageId);
            }
        },

        /**
         * 新页面处理
         */
        onNewPage: function(pageElement) {
            if (this.config.enableAutoCleanup) {
                this.cleanupOldPages();
            }
            this.currentPageId = 'flpage_' + pageElement.id || Date.now();

            if (this.config.debugMode) {
                console.log('New page detected, ID:', this.currentPageId);
            }
        },

        /**
         * 清理旧页面
         */
        cleanupOldPages: function() {
            var self = this;

            // 清理非当前活动的页面资源
            this.pageResources.forEach(function(resources, pageId) {
                if (pageId !== self.currentPageId) {
                    self.cleanupPageResources(pageId);
                }
            });

            // 清理jQuery缓存中的无效元素
            if (typeof $ !== 'undefined') {
                // 清理不在DOM中的jQuery对象
                $.cache = $.cache || {};
                for (var cacheId in $.cache) {
                    var cacheItem = $.cache[cacheId];
                    if (cacheItem.handle && cacheItem.handle.elem && !$.contains(document, cacheItem.handle.elem)) {
                        // 元素已不在DOM中，清理缓存
                        delete $.cache[cacheId];
                    }
                }
            }
        },

        /**
         * 清理指定页面资源
         */
        cleanupPageResources: function(pageId, types) {
            if (!this.pageResources.has(pageId)) return;

            var resources = this.pageResources.get(pageId);
            var self = this;

            // 清理定时器
            if (!types || types.includes('timer')) {
                resources.timers.forEach(function(timerId) {
                    clearTimeout(timerId);
                    self.globalResources.timers.delete(timerId);
                });
                resources.timers.clear();
            }

            // 清理循环定时器
            if (!types || types.includes('interval')) {
                resources.intervals.forEach(function(intervalId) {
                    clearInterval(intervalId);
                    self.globalResources.intervals.delete(intervalId);
                });
                resources.intervals.clear();
            }

            // 清理Ajax请求
            if (!types || types.includes('ajax')) {
                resources.ajaxRequests.forEach(function(ajaxInfo) {
                    var xhr = ajaxInfo.xhr || ajaxInfo.request;
                    if (xhr && xhr.abort) {
                        try {
                            xhr.abort();
                        } catch (e) {
                            // 忽略错误
                        }
                    }
                    self.globalResources.ajaxRequests.delete(xhr);
                });
                resources.ajaxRequests.clear();
            }

            // 清理事件监听器
            if (!types || types.includes('event')) {
                resources.eventListeners.forEach(function(eventInfo) {
                    try {
                        if (eventInfo.element && eventInfo.element.removeEventListener) {
                            eventInfo.element.removeEventListener(
                                eventInfo.type,
                                eventInfo.wrappedListener || eventInfo.wrappedFn
                            );
                        }
                    } catch (e) {
                        // 忽略错误
                    }
                });
                resources.eventListeners.clear();
            }

            // 清理组件
            if (!types || types.includes('component')) {
                resources.components.forEach(function(componentInfo) {
                    try {
                        if (componentInfo.element) {
                            componentInfo.element.off();
                            componentInfo.element.removeData();
                        }
                        if (componentInfo.destroy && typeof componentInfo.destroy === 'function') {
                            componentInfo.destroy();
                        }
                    } catch (e) {
                        // 忽略错误
                    }
                });
                resources.components.clear();
            }

            // 移除页面资源记录
            this.pageResources.delete(pageId);

            if (this.config.debugMode) {
                console.log('Cleaned up resources for page:', pageId);
            }
        },

        /**
         * 启动自动清理
         */
        startAutoCleanup: function() {
            var self = this;

            setInterval(function() {
                self.cleanupOldPages();

                // 检查资源数量，如果过多则警告
                var stats = self.getResourceStats();
                if (stats.total > self.config.maxResourcesPerPage) {
                    console.warn('Too many active resources:', stats);
                }
            }, this.config.cleanupInterval);
        },

        /**
         * 获取资源统计
         */
        getResourceStats: function() {
            var total = 0;
            var currentPageResources = this.pageResources.get(this.currentPageId) || {
                timers: new Set(),
                intervals: new Set(),
                ajaxRequests: new Set(),
                eventListeners: new Set(),
                components: new Set()
            };

            total += currentPageResources.timers.size;
            total += currentPageResources.intervals.size;
            total += currentPageResources.ajaxRequests.size;
            total += currentPageResources.eventListeners.size;
            total += currentPageResources.components.size;

            return {
                pageId: this.currentPageId,
                timers: currentPageResources.timers.size,
                intervals: currentPageResources.intervals.size,
                ajaxRequests: currentPageResources.ajaxRequests.size,
                eventListeners: currentPageResources.eventListeners.size,
                components: currentPageResources.components.size,
                total: total
            };
        },

        /**
         * 手动清理当前页面
         */
        cleanupCurrentPage: function() {
            this.cleanupPageResources(this.currentPageId);
        },

        /**
         * 全局清理
         */
        cleanupAll: function() {
            var self = this;

            // 清理所有页面资源
            this.pageResources.forEach(function(resources, pageId) {
                self.cleanupPageResources(pageId);
            });

            // 清理全局资源
            this.globalResources.timers.forEach(function(timerId) {
                clearTimeout(timerId);
            });
            this.globalResources.timers.clear();

            this.globalResources.intervals.forEach(function(intervalId) {
                clearInterval(intervalId);
            });
            this.globalResources.intervals.clear();

            this.globalResources.ajaxRequests.forEach(function(xhr) {
                try {
                    if (xhr.abort) xhr.abort();
                } catch (e) {}
            });
            this.globalResources.ajaxRequests.clear();

            // 清理DOM观察器
            this.globalResources.domObservers.forEach(function(observer) {
                observer.disconnect();
            });
            this.globalResources.domObservers.clear();

            console.log('All resources cleaned up');
        },

        /**
         * 设置配置
         */
        setConfig: function(config) {
            Object.assign(this.config, config);
        }
    };

    // 页面卸载时自动清理
    window.addEventListener('beforeunload', function() {
        AutoMemoryManager.cleanupAll();
    });

    // 导出到全局
    window.AutoMemoryManager = AutoMemoryManager;

    // 提供便捷的全局方法
    window.autoCleanup = function() {
        AutoMemoryManager.cleanupCurrentPage();
    };

    window.autoCheckMemory = function() {
        var stats = AutoMemoryManager.getResourceStats();
        console.log('Auto Memory Stats:', stats);
        return stats;
    };

    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            AutoMemoryManager.init();
        });
    } else {
        AutoMemoryManager.init();
    }

})();