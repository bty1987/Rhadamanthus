/**
 * 修复版自动内存管理器 - 解决静态文件请求被拦截问题
 * 创建时间：2025-12-14
 * 修复：避免拦截静态文件请求，只管理业务逻辑相关的Ajax请求
 */

(function() {
    'use strict';

    /**
     * 修复版自动内存管理器
     * 主要修复：智能识别业务Ajax请求，避免拦截静态文件请求
     */
    var FixedMemoryManager = {
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
            // 新增：需要拦截的URL模式
            managedUrlPatterns: [
                /\.do$/,           // 业务接口
                /\/api\//,         // API接口
                /\/service\//,     // 服务接口
                /\.jsp$/,          // JSP页面
                /\.php$/,          // PHP页面
                /\.asp$/           // ASP页面
            ],
            // 新增：需要排除的URL模式
            excludeUrlPatterns: [
                /\.(js|css|html|htm)$/,      // 静态文件
                /\.(png|jpg|jpeg|gif|svg|ico)$/,  // 图片文件
                /\.(woff|woff2|ttf|eot)$/,      // 字体文件
                /\.min\.js$/,                   // 压缩JS
                /\.min\.css$/,                  // 压缩CSS
                /\.json$/                       // JSON文件 - 移到排除列表
            ]
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

            // 拦截jQuery方法 (修复版)
            this.interceptJQueryFixed();

            // 拦截com对象方法
            this.interceptComObject();

            // 拦截第三方库
            this.interceptThirdPartyLibs();

            // 启动自动清理
            this.startAutoCleanup();

            // 监听页面变化
            this.observePageChanges();

            if (this.config.debugMode) {
                console.log('FixedMemoryManager initialized for page:', this.currentPageId);
            }
        },

        /**
         * 判断是否为需要管理的Ajax请求
         */
        shouldManageAjaxRequest: function(url, options) {
            if (!url && options && options.url) {
                url = options.url;
            }

            if (!url) return false;

            // 检查是否在排除列表中
            for (var i = 0; i < this.config.excludeUrlPatterns.length; i++) {
                if (this.config.excludeUrlPatterns[i].test(url)) {
                    return false;  // 排除静态文件
                }
            }

            // 检查是否在管理列表中
            for (var i = 0; i < this.config.managedUrlPatterns.length; i++) {
                if (this.config.managedUrlPatterns[i].test(url)) {
                    return true;   // 管理业务请求
                }
            }

            // 默认不管理，避免误拦截
            return false;
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
        },

        /**
         * 拦截jQuery方法 - 修复版
         */
        interceptJQueryFixed: function() {
            if (typeof $ === 'undefined') return;

            var self = this;

            // 拦截jQuery事件绑定
            var originalOn = $.fn.on;
            $.fn.on = function(types, selector, data, fn, one) {
                // 参数处理...
                if (typeof types === 'object') {
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

            // 修复版：智能拦截jQuery ajax
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

                // 判断是否需要管理这个请求
                if (!self.shouldManageAjaxRequest(url, options)) {
                    // 静态文件请求，直接调用原始方法
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

                    // 包装done方法
                    var originalDone = xhr.done;
                    if (originalDone) {
                        xhr.done = function() {
                            self.globalResources.ajaxRequests.delete(xhr);
                            return originalDone.apply(this, arguments);
                        };
                    }

                    // 包装fail方法
                    var originalFail = xhr.fail;
                    if (originalFail) {
                        xhr.fail = function() {
                            self.globalResources.ajaxRequests.delete(xhr);
                            return originalFail.apply(this, arguments);
                        };
                    }

                    // 添加success和error的包装（如果存在）
                    var originalSuccess = options.success;
                    if (originalSuccess) {
                        options.success = function(data, textStatus, jqXHR) {
                            self.globalResources.ajaxRequests.delete(xhr);
                            return originalSuccess.call(this, data, textStatus, jqXHR);
                        };
                    }

                    var originalError = options.error;
                    if (originalError) {
                        options.error = function(jqXHR, textStatus, errorThrown) {
                            self.globalResources.ajaxRequests.delete(xhr);
                            return originalError.call(this, jqXHR, textStatus, errorThrown);
                        };
                    }
                }

                return xhr;
            };

            // 拦截jQuery DOM操作
            var originalEmpty = $.fn.empty;
            $.fn.empty = function() {
                this.find('*').off();
                this.off();
                return originalEmpty.call(this);
            };

            var originalRemove = $.fn.remove;
            $.fn.remove = function() {
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

            // 拦截com.post - 这个肯定需要管理
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

            // 监听DOM变化
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

            // 清理组件
            if (!types || types.includes('component')) {
                resources.components.forEach(function(componentInfo) {
                    try {
                        if (componentInfo.element) {
                            componentInfo.element.off();
                            componentInfo.element.removeData();
                        }
                    } catch (e) {
                        // 忽略错误
                    }
                });
                resources.components.clear();
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
        FixedMemoryManager.cleanupAll();
    });

    // 导出到全局
    window.FixedMemoryManager = FixedMemoryManager;

    // 提供便捷的全局方法
    window.autoCleanup = function() {
        FixedMemoryManager.cleanupCurrentPage();
    };

    window.autoCheckMemory = function() {
        var stats = FixedMemoryManager.getResourceStats();
        console.log('Fixed Memory Stats:', stats);
        return stats;
    };

    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            FixedMemoryManager.init();
        });
    } else {
        FixedMemoryManager.init();
    }

})();