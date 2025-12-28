/**
 * 兼容性内存管理器 - 修复typeahead等组件冲突问题
 * 创建时间：2025-12-14
 * 修复：避免影响现有组件的初始化和事件绑定
 */

(function() {
    'use strict';

    /**
     * 兼容性内存管理器
     * 主要修复：不干扰现有组件的初始化逻辑
     */
    var CompatibleMemoryManager = {
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
            cleanupInterval: 60000,
            // 兼容性配置
            preserveJQueryEvents: true,    // 不拦截jQuery事件
            preserveThirdParty: true,      // 不拦截第三方组件
            minimalInterception: true,     // 最小化拦截
            excludeComponents: ['typeahead', 'chosen', 'datepicker', 'colorbox'] // 排除的组件
        },

        /**
         * 初始化兼容性内存管理器
         */
        init: function() {
            if (this.initialized) return;

            this.initialized = true;
            this.currentPageId = this.generatePageId();

            // 兼容性拦截原生API
            this.interceptNativeAPIsCompatible();

            // 不拦截jQuery事件，只拦截Ajax
            this.interceptJQueryAjaxOnly();

            // 轻量级拦截com对象方法
            this.interceptComObjectLite();

            // 启动自动清理
            this.startAutoCleanup();

            // 监听页面变化
            this.observePageChanges();

            if (this.config.debugMode) {
                console.log('CompatibleMemoryManager initialized for page:', this.currentPageId);
            }
        },

        /**
         * 生成页面ID
         */
        generatePageId: function() {
            var url = window.location.pathname;
            var title = document.title;
            var timestamp = Date.now();
            return 'page_' + btoa(url + title).slice(0, 16) + '_' + timestamp;
        },

        /**
         * 兼容性拦截原生API
         */
        interceptNativeAPIsCompatible: function() {
            var self = this;

            // 拦截setTimeout (轻量级)
            var originalSetTimeout = window.setTimeout;
            window.setTimeout = function(callback, delay) {
                var timerId = originalSetTimeout.call(this, function() {
                    try {
                        callback.apply(this, arguments);
                    } finally {
                        self.globalResources.timers.delete(timerId);
                    }
                }, delay);

                // 只跟踪超过1秒的定时器
                if (delay > 1000) {
                    self.globalResources.timers.add(timerId);
                    self.trackResource('timer', timerId);
                }

                return timerId;
            };

            // 拦截clearTimeout
            var originalClearTimeout = window.clearTimeout;
            window.clearTimeout = function(timerId) {
                self.globalResources.timers.delete(timerId);
                return originalClearTimeout.apply(this, arguments);
            };

            // 拦截setInterval (轻量级)
            var originalSetInterval = window.setInterval;
            window.setInterval = function(callback, interval) {
                var intervalId = originalSetInterval.call(this, function() {
                    try {
                        callback.apply(this, arguments);
                    } catch (error) {
                        console.error('Interval error:', error);
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

            // 不拦截原生事件监听器，避免影响第三方组件
        },

        /**
         * 只拦截Ajax请求，不拦截jQuery事件
         */
        interceptJQueryAjaxOnly: function() {
            if (typeof $ === 'undefined') return;

            var self = this;

            // 拦截jQuery ajax - 只管理业务请求
            var originalAjax = $.ajax;
            $.ajax = function(url, options) {
                // 处理参数重载
                if (typeof url === 'object') {
                    options = url;
                    url = options.url;
                } else if (typeof options === 'undefined') {
                    options = {};
                } else {
                    options.url = url;
                }

                // 判断是否为业务请求
                if (!self.shouldManageAjaxRequest(url, options)) {
                    // 非业务请求，直接调用原始方法
                    return originalAjax.call(this, url, options);
                }

                // 业务请求，需要管理
                var xhr = originalAjax.call(this, url, options);

                if (xhr && xhr.abort) {
                    self.globalResources.ajaxRequests.add(xhr);
                    self.trackResource('ajaxRequest', {
                        xhr: xhr,
                        options: options,
                        url: url,
                        pageId: self.currentPageId
                    });

                    // 包装完成回调
                    var originalComplete = options.complete;
                    if (originalComplete) {
                        options.complete = function(xhr, status) {
                            self.globalResources.ajaxRequests.delete(xhr);
                            return originalComplete.call(this, xhr, status);
                        };
                    }

                    // jQuery的success/error/complete处理
                    if (xhr && xhr.always) {
                        var originalAlways = xhr.always;
                        xhr.always = function() {
                            self.globalResources.ajaxRequests.delete(xhr);
                            return originalAlways.apply(this, arguments);
                        };
                    }
                }

                return xhr;
            };

            // 不拦截jQuery事件，保持原有行为
            // jQuery.on, jQuery.bind, jQuery.delegate 等保持不变
        },

        /**
         * 轻量级拦截com对象方法
         */
        interceptComObjectLite: function() {
            if (typeof com === 'undefined') return;

            var self = this;

            // 只拦截com.post，不影响其他方法
            if (com.post) {
                var originalComPost = com.post;
                com.post = function(api, options, callback, failCallback, asyncFlag) {
                    var wrappedCallback = function(response) {
                        if (currentRequest) {
                            self.globalResources.ajaxRequests.delete(currentRequest);
                        }
                        if (callback) callback(response);
                    };

                    var wrappedFailCallback = function(response) {
                        if (currentRequest) {
                            self.globalResources.ajaxRequests.delete(currentRequest);
                        }
                        console.log(response)
                        console.log(failCallback)
                        if (failCallback) failCallback(response);
                        else{com.showAlert(com.error, response.errorMsg);}
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

            // 不拦截com.initTypeahead等方法，避免影响searcher等组件
        },

        /**
         * 判断是否为需要管理的Ajax请求
         */
        shouldManageAjaxRequest: function(url, options) {
            if (!url && options && options.url) {
                url = options.url;
            }

            if (!url) return false;

            // 检查是否为静态文件请求
            if (this.isStaticFile(url)) {
                return false;
            }

            // 检查是否为业务接口
            if (this.isBusinessApi(url)) {
                return true;
            }

            // 默认不管理，避免误拦截
            return false;
        },

        /**
         * 判断是否为静态文件
         */
        isStaticFile: function(url) {
            var staticPatterns = [
                /\.(js|css|html|htm)$/,
                /\.(png|jpg|jpeg|gif|svg|ico)$/,
                /\.(woff|woff2|ttf|eot)$/,
                /\.min\.(js|css)$/,
                /\.(json)$/  // JSON文件也视为静态文件
            ];

            return staticPatterns.some(function(pattern) {
                return pattern.test(url);
            });
        },

        /**
         * 判断是否为业务API
         */
        isBusinessApi: function(url) {
            var businessPatterns = [
                /\.do$/,           // 业务接口
                /\/api\//,         // API接口
                /\/service\//,     // 服务接口
                /\.jsp$/,          // JSP页面
                /\.php$/,          // PHP页面
                /\.asp$/           // ASP页面
            ];

            return businessPatterns.some(function(pattern) {
                return pattern.test(url);
            });
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
                    self.onPageChange();
                    lastUrl = window.location.href;
                }
            }, 100);

            // 监听DOM变化 (轻量级)
            if (typeof MutationObserver !== 'undefined') {
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
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

                // 只观察body的直接子元素，减少性能开销
                observer.observe(document.body, {
                    childList: true,
                    subtree: false  // 不观察子树，减少开销
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

            this.pageResources.forEach(function(resources, pageId) {
                if (pageId !== self.currentPageId) {
                    self.cleanupPageResources(pageId);
                }
            });
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

            this.pageResources.forEach(function(resources, pageId) {
                self.cleanupPageResources(pageId);
            });

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

            this.globalResources.domObservers.forEach(function(observer) {
                observer.disconnect();
            });
            this.globalResources.domObservers.clear();

            console.log('All resources cleaned up');
        }
    };

    // 页面卸载时自动清理
    window.addEventListener('beforeunload', function() {
        CompatibleMemoryManager.cleanupAll();
    });

    // 导出到全局
    window.CompatibleMemoryManager = CompatibleMemoryManager;

    // 提供便捷的全局方法
    window.autoCleanup = function() {
        CompatibleMemoryManager.cleanupCurrentPage();
    };

    window.autoCheckMemory = function() {
        var stats = CompatibleMemoryManager.getResourceStats();
        console.log('Compatible Memory Stats:', stats);
        return stats;
    };

    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            CompatibleMemoryManager.init();
        });
    } else {
        CompatibleMemoryManager.init();
    }

})();