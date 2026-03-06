/**
 * 核心方法补丁 - 修复内存泄漏问题
 * 创建时间：2025-12-14
 * 功能：为现有的com对象添加内存泄漏防护
 */

// 等待com对象加载完成后再应用补丁
$(document).ready(function() {
    // 检查com对象是否存在
    if (typeof com === 'undefined') {
        console.warn('com对象未找到，无法应用内存泄漏补丁');
        return;
    }

    // 检查MemoryManager是否已加载
    if (typeof MemoryManager === 'undefined') {
        console.warn('MemoryManager未找到，无法应用内存泄漏补丁');
        return;
    }

    // 启动内存监控
    MemoryManager.startMonitoring(30000);

    /**
     * 补丁1：增强switchPage方法 - 添加页面清理
     */
    var originalSwitchPage = com.switchPage;
    com.switchPage = function(url, notTab, data, callback) {
        // 获取当前页面ID
        var currentContainer = $(".flpage.tab-pane.active");
        var currentPageId = currentContainer.attr('id');

        // 清理当前页面的资源
        if (currentPageId) {
            MemoryManager.cleanupPage(currentPageId);
        }

        // 调用原始方法
        var result = originalSwitchPage.call(this, url, notTab, data, function(response, status, xhr) {
            // 新页面加载完成后的回调
            if (callback && typeof callback === 'function') {
                callback(response, status, xhr);
            }

            // 清理layer弹窗
            if (typeof layer !== 'undefined') {
                layer.closeAll('loading');
                layer.closeAll('tips');
            }

            // 清理jQuery事件缓存
            if (currentContainer.length) {
                currentContainer.off();
                currentContainer.find('*').off();
            }

            // 强制垃圾回收（如果浏览器支持）
            if (window.gc) {
                window.gc();
            }
        });

        return result;
    };

    /**
     * 补丁2：增强loadPage方法 - 添加标签页清理
     */
    var originalLoadPage = com.loadPage;
    com.loadPage = function(page, $features) {
        // 获取或生成页面ID
        var pageId = $features.attr('mid') || 'page_' + Date.now();

        // 检查是否已存在同名的标签页
        var existingTab = $('.flpage.nav-tab[mid="' + pageId + '"]');
        if (existingTab.length > 0) {
            // 如果已存在，先清理该页面的资源
            MemoryManager.cleanupPage(pageId);
        }

        // 调用原始方法
        return originalLoadPage.call(this, page, $features);
    };

    /**
     * 补丁3：增强post方法 - 添加请求管理
     */
    var originalPost = com.post;
    com.post = function(api, options, callback, failCallback, asyncFlag) {
        // 生成请求ID
        var requestId = 'ajax_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        // 调用原始方法，并拦截xhr对象
        var originalCallback = callback;
        var wrappedCallback = function(response) {
            // 请求完成，移除跟踪
            MemoryManager.removeAjaxRequest(requestId);

            // 调用原始回调
            if (originalCallback && typeof originalCallback === 'function') {
                originalCallback(response);
            }
        };

        var originalFailCallback = failCallback;
        var wrappedFailCallback = function(response) {
            // 请求失败，移除跟踪
            MemoryManager.removeAjaxRequest(requestId);

            // 调用原始失败回调
            if (originalFailCallback && typeof originalFailCallback === 'function') {
                originalFailCallback(response);
            }
        };

        // 调用原始post方法
        var xhr = originalPost.call(this, api, options, wrappedCallback, wrappedFailCallback, asyncFlag);

        // 如果返回的是xhr对象，添加到管理器
        if (xhr && (xhr.abort || xhr.readyState !== undefined)) {
            MemoryManager.addAjaxRequest(requestId, xhr);
        }

        return xhr;
    };

    /**
     * 补丁4：增强popup方法 - 添加弹窗管理
     */
    var originalPopup = com.popup;
    com.popup = function(container, title, width, height, success, cancel) {
        var popupId = 'popup_' + Date.now();

        // 包装成功回调
        var wrappedSuccess = function(layero, index) {
            MemoryManager.addDomRef(popupId, $(layero));

            if (success && typeof success === 'function') {
                success(layero, index);
            }
        };

        // 包装取消回调
        var wrappedCancel = function(index) {
            MemoryManager.removeDomRef(popupId);

            if (cancel && typeof cancel === 'function') {
                cancel(index);
            }
        };

        return originalPopup.call(this, container, title, width, height, wrappedSuccess, wrappedCancel);
    };

    /**
     * 补丁5：增强initTypeahead方法 - 添加组件管理
     */
    var originalInitTypeahead = com.initTypeahead;
    com.initTypeahead = function(container, url, name, args, result, key, value, callback) {
        var typeaheadId = 'typeahead_' + (container.attr('id') || Date.now());

        // 调用原始方法
        var $element = originalInitTypeahead.call(this, container, url, name, args, result, key, value, callback);

        // 添加到组件管理
        if ($element && $element.length) {
            MemoryManager.addComponent(typeaheadId, $element);
        }

        return $element;
    };

    /**
     * 补丁6：添加安全的setTimeout替代方法
     */
    com.setTimeout = function(id, func, delay) {
        var timerId = setTimeout(function() {
            try {
                func();
            } finally {
                MemoryManager.removeTimer(id);
            }
        }, delay);

        MemoryManager.addTimer(id, timerId);
        return timerId;
    };

    /**
     * 补丁7：添加安全的setInterval替代方法
     */
    com.setInterval = function(id, func, interval) {
        var timerId = setInterval(function() {
            try {
                func();
            } catch (error) {
                console.error('Interval callback error:', error);
                // 发生错误时停止定时器
                MemoryManager.removeTimer(id);
            }
        }, interval);

        MemoryManager.addTimer(id, timerId);
        return timerId;
    };

    /**
     * 补丁8：添加定时器清理方法
     */
    com.clearTimer = function(id) {
        MemoryManager.removeTimer(id);
    };

    /**
     * 补丁9：添加页面清理快捷方法
     */
    com.cleanupPage = function(pageId) {
        if (pageId) {
            MemoryManager.cleanupPage(pageId);
        } else {
            var currentPageId = $(".flpage.tab-pane.active").attr('id');
            if (currentPageId) {
                MemoryManager.cleanupPage(currentPageId);
            }
        }
    };

    /**
     * 补丁10：添加全局清理方法
     */
    com.cleanup = function() {
        MemoryManager.cleanup();

        // 额外的全局清理
        // 清理layer弹窗
        if (typeof layer !== 'undefined') {
            layer.closeAll();
        }

        // 清理chosen下拉框
        if (typeof $ !== 'undefined' && $.fn.chosen) {
            $('.chosen-select').chosen('destroy');
        }

        // 清理datepicker
        if (typeof $ !== 'undefined' && $.fn.datepicker) {
            $('.datepicker').datepicker('remove');
        }

        // 清理colorbox
        if (typeof $ !== 'undefined' && $.fn.colorbox) {
            $.colorbox.close();
            $.colorbox.remove();
        }

        console.log('Global cleanup completed');
    };

    /**
     * 补丁11：页面卸载时的清理
     */
    var originalBeforeUnload = window.onbeforeunload;
    window.onbeforeunload = function(event) {
        // 执行全局清理
        com.cleanup();

        // 调用原始的beforeunload处理
        if (originalBeforeUnload && typeof originalBeforeUnload === 'function') {
            return originalBeforeUnload.call(this, event);
        }
    };

    /**
     * 补丁12：添加内存使用检查
     */
    com.checkMemory = function() {
        var stats = MemoryManager.getStats();
        var message = 'Memory Usage:\n' +
                     '- Timers: ' + stats.timers + '\n' +
                     '- Event Listeners: ' + stats.eventListeners + '\n' +
                     '- Ajax Requests: ' + stats.ajaxRequests + '\n' +
                     '- DOM References: ' + stats.domRefs + '\n' +
                     '- Components: ' + stats.components;

        console.log(message);

        // 如果资源使用过多，显示警告
        if (stats.timers > 30 || stats.ajaxRequests > 20 || stats.components > 50) {
            console.warn('High memory usage detected!', stats);
        }

        return stats;
    };

    // 在控制台暴露内存管理功能（开发调试用）
    if (typeof console !== 'undefined') {
        console.info('Memory leak patches applied successfully!');
        console.info('Available methods:');
        console.info('- com.checkMemory() - 检查内存使用');
        console.info('- com.cleanupPage(pageId) - 清理指定页面');
        console.info('- com.cleanup() - 全局清理');
        console.info('- com.setTimeout(id, func, delay) - 安全的定时器');
        console.info('- com.setInterval(id, func, interval) - 安全的循环定时器');
        console.info('- com.clearTimer(id) - 清除定时器');
    }

});