/**
 * 内存泄漏修复补丁 - 完整版
 *
 * 使用方法：
 * 1. 将此文件保存为 WebContent/js/com/memory-leak-fix.js
 * 2. 在 index.html 中引入，位于 memory.js 之后
 *
 * 版本：1.0.0
 * 日期：2025-12-30
 */

(function() {
    'use strict';

    // 防止重复加载
    if (window.MemoryLeakFix) {
        console.log('MemoryLeakFix already loaded');
        return;
    }

    console.log('🔧 Loading MemoryLeakFix...');

    /**
     * 内存泄漏修复器
     */
    var MemoryLeakFix = {

        // 配置
        config: {
            enableMonitoring: true,
            monitorInterval: 30000,  // 30秒
            debugMode: true
        },

        // 统计
        stats: {
            pageSwitches: 0,
            resourcesCleaned: 0,
            errorsLogged: 0
        },

        /**
         * 初始化修复器
         */
        init: function() {
            this.log('Initializing MemoryLeakFix...');

            // 应用所有修复补丁
            this.fixLoadPage();
            this.fixSwitchPage();
            this.fixPopupClose();
            this.addGlobalCleanup();
            this.startMonitoring();

            this.log('✅ MemoryLeakFix initialized');
        },

        /**
         * 修复1：增强 loadPage 的资源清理
         */
        fixLoadPage: function() {
            if (!com || !com.loadPage) {
                this.log('⚠️ com.loadPage not found');
                return;
            }

            var self = this;
            var originalLoadPage = com.loadPage;

            com.loadPage = function(page, $features) {
                // 调用原始方法
                var result = originalLoadPage.call(this, page, $features);

                var menuId = $features.attr("mid");

                // 增强：标签页关闭时清理资源
                setTimeout(function() {
                    $('#' + menuId).on('remove', function() {
                        self.log('🧹 Cleaning up page:', menuId);
                        self.cleanupPage('#' + menuId);
                    });
                }, 100);

                return result;
            };

            this.log('✅ Fixed com.loadPage');
        },

        /**
         * 修复2：增强 switchPage 的资源清理
         */
        fixSwitchPage: function() {
            if (!com || !com.switchPage) {
                this.log('⚠️ com.switchPage not found');
                return;
            }

            var self = this;
            var originalSwitchPage = com.switchPage;

            com.switchPage = function(url, notTab, data, callback) {
                var containerId = $(".flpage.tab-pane.active").attr("id");
                if (notTab) {
                    containerId = "fl-container";
                }

                // 清理旧页面的资源
                if (containerId) {
                    self.log('🧹 Cleaning up before switch:', containerId);
                    self.cleanupPage('#' + containerId);
                }

                // 调用原始方法
                return originalSwitchPage.call(this, url, notTab, data, function(response, status, xhr) {
                    // 新页面加载完成
                    if (callback && typeof callback === 'function') {
                        callback(response, status, xhr);
                    }
                    self.stats.pageSwitches++;
                });
            };

            this.log('✅ Fixed com.switchPage');
        },

        /**
         * 修复3：增强弹窗关闭时的清理
         */
        fixPopupClose: function() {
            if (!com || !com.closePopup) {
                this.log('⚠️ com.closePopup not found');
                return;
            }

            var self = this;
            var originalClosePopup = com.closePopup;

            com.closePopup = function(index) {
                self.log('🧹 Cleaning up popup...');

                // 清理 layer 弹窗
                if (typeof layer !== 'undefined') {
                    try {
                        // 获取弹窗内的 iframe
                        var layerElems = $('.layui-layer');
                        layerElems.find('iframe').each(function() {
                            var $iframe = $(this);
                            try {
                                if ($iframe[0].contentWindow) {
                                    $iframe[0].contentWindow.document.innerHTML = '';
                                }
                            } catch (e) {
                                // 跨域iframe，忽略
                            }
                        });
                    } catch (e) {
                        self.logError('Error cleaning layer popups:', e);
                    }
                }

                // 调用原始方法
                return originalClosePopup.call(this, index);
            };

            this.log('✅ Fixed com.closePopup');
        },

        /**
         * 核心方法：清理指定页面的所有资源
         */
        cleanupPage: function(pageSelector) {
            var self = this;
            var $page = $(pageSelector);

            if ($page.length === 0) {
                return;
            }

            try {
                // 1. 移除所有事件监听器
                $page.find('*').off();
                $page.off();

                // 2. 清理 chosen 下拉框
                if ($page.find('.chosen-select').length) {
                    try {
                        $page.find('.chosen-select').chosen('destroy');
                    } catch (e) {
                        self.logError('Chosen destroy error:', e);
                    }
                }

                // 3. 清理 typeahead
                if ($page.find('.typeahead').length) {
                    try {
                        $page.find('.typeahead').typeahead('destroy');
                    } catch (e) {
                        self.logError('Typeahead destroy error:', e);
                    }
                }

                // 4. 清理 datepicker
                if ($page.find('.datepicker').length) {
                    try {
                        $page.find('.datepicker').datepicker('remove');
                    } catch (e) {
                        self.logError('Datepicker destroy error:', e);
                    }
                }

                // 5. 清理 colorbox
                if ($page.find('.colorbox').length) {
                    try {
                        $.colorbox.close();
                        $.colorbox.remove();
                    } catch (e) {
                        self.logError('Colorbox destroy error:', e);
                    }
                }

                // 6. 清理 FullCalendar
                if ($page.find('.fc').length) {
                    try {
                        $page.find('.fc').fullCalendar('destroy');
                    } catch (e) {
                        self.logError('FullCalendar destroy error:', e);
                    }
                }

                // 7. 清理 DataTable
                if ($page.find('.dataTable').length) {
                    try {
                        $page.find('.dataTable').DataTable().destroy();
                    } catch (e) {
                        self.logError('DataTable destroy error:', e);
                    }
                }

                // 8. 清空 iframe 内容
                $page.find('iframe').each(function() {
                    var $iframe = $(this);
                    try {
                        if ($iframe[0].contentWindow) {
                            $iframe[0].contentWindow.document.innerHTML = '';
                        }
                    } catch (e) {
                        // 跨域iframe，忽略
                    }
                });

                self.stats.resourcesCleaned++;
                self.log('✅ Page cleaned:', pageSelector);

            } catch (e) {
                self.logError('Error cleaning page:', e);
            }
        },

        /**
         * 添加全局清理方法
         */
        addGlobalCleanup: function() {
            var self = this;

            // 全局清理方法
            com.globalCleanup = function() {
                self.log('🧹 Global cleanup started...');

                // 清理所有页面
                $('.flpage.tab-pane').each(function() {
                    self.cleanupPage('#' + $(this).attr('id'));
                });

                // 清理 layer 弹窗
                if (typeof layer !== 'undefined') {
                    layer.closeAll();
                }

                // 清理 jQuery 缓存
                if (typeof $ !== 'undefined') {
                    // 清理 chosen
                    $('.chosen-select').each(function() {
                        try {
                            $(this).chosen('destroy');
                        } catch (e) {}
                    });

                    // 清理 typeahead
                    $('.typeahead').each(function() {
                        try {
                            $(this).typeahead('destroy');
                        } catch (e) {}
                    });

                    // 清理 datepicker
                    $('.datepicker').each(function() {
                        try {
                            $(this).datepicker('remove');
                        } catch (e) {}
                    });
                }

                self.log('✅ Global cleanup completed');
            };

            // 页面卸载时清理
            $(window).on('beforeunload', function() {
                com.globalCleanup();
            });

            this.log('✅ Added global cleanup');
        },

        /**
         * 启动监控
         */
        startMonitoring: function() {
            if (!this.config.enableMonitoring) {
                return;
            }

            var self = this;

            // 暴露内存检查方法
            com.checkMemory = function() {
                var stats = {
                    pageSwitches: self.stats.pageSwitches,
                    resourcesCleaned: self.stats.resourcesCleaned,
                    errorsLogged: self.stats.errorsLogged,
                    activePages: $('.flpage.tab-pane').length,
                    layerPopups: $('.layui-layer').length,
                    chosenInstances: $('.chosen-select').length,
                    typeaheadInstances: $('.typeahead').length,
                    datepickerInstances: $('.datepicker').length
                };

                console.group('📊 Memory Usage Statistics');
                console.log('Page Switches:', stats.pageSwitches);
                console.log('Resources Cleaned:', stats.resourcesCleaned);
                console.log('Active Pages:', stats.activePages);
                console.log('Layer Popups:', stats.layerPopups);
                console.log('Chosen Instances:', stats.chosenInstances);
                console.log('Typeahead Instances:', stats.typeaheadInstances);
                console.log('Datepicker Instances:', stats.datepickerInstances);
                console.groupEnd();

                // 警告检查
                if (stats.layerPopups > 5) {
                    console.warn('⚠️ Too many layer popups:', stats.layerPopups);
                }
                if (stats.chosenInstances > 20) {
                    console.warn('⚠️ Too many chosen instances:', stats.chosenInstances);
                }

                return stats;
            };

            // 定时监控
            if (this.config.monitorInterval > 0) {
                setInterval(function() {
                    if (self.config.debugMode) {
                        com.checkMemory();
                    }
                }, this.config.monitorInterval);
            }

            this.log('✅ Monitoring started (interval:', this.config.monitorInterval + 'ms)');
        },

        /**
         * 日志输出
         */
        log: function() {
            if (this.config.debugMode) {
                console.log.apply(console, arguments);
            }
        },

        /**
         * 错误日志
         */
        logError: function() {
            this.stats.errorsLogged++;
            console.error.apply(console, arguments);
        }
    };

    // 导出到全局
    window.MemoryLeakFix = MemoryLeakFix;

    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            MemoryLeakFix.init();
        });
    } else {
        MemoryLeakFix.init();
    }

    // 在控制台暴露工具
    console.info('%c🛡️ MemoryLeakFix Loaded', 'color: green; font-weight: bold');
    console.info('Available commands:');
    console.info('- com.checkMemory() - Check memory usage');
    console.info('- com.globalCleanup() - Clean all resources');

})();
