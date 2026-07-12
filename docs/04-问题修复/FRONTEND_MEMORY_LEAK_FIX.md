# 前端内存泄漏修复指南

> **创建时间**: 2025-12-14
> **版本**: 1.0
> **适用范围**: Rhadamanthus ERP 系统 前端

## 📋 问题概述

通过深入分析前端代码，我们发现了以下主要内存泄漏问题：

### 🔴 严重问题

1. **定时器泄漏**
   - `login.js:207-210, 284-286` 二维码检查的 `setTimeout` 循环没有清理机制
   - 页面切换时定时器继续运行，导致内存累积

2. **事件监听器泄漏**
   - 页面切换时没有清理旧页面的事件监听器
   - jQuery事件委托不够完善，存在直接绑定事件

3. **Ajax请求泄漏**
   - 页面切换时没有取消pending的Ajax请求
   - 长时间未完成的请求会持续占用内存

### 🟡 中等问题

4. **DOM引用泄漏**
   - `com.switchPage()` 方法使用 `load()` 加载新页面但没有清理旧DOM
   - 全局变量 `params` 可能累积大量数据

5. **第三方组件泄漏**
   - typeahead、layer弹窗等组件没有正确销毁
   - chosen、datepicker等插件缺少清理机制

---

## 🛠️ 解决方案

### 1. 内存管理器 (MemoryManager)

**文件位置**: `WebContent/js/com/memoryManager.js`

**核心功能**:
- ✅ 统一管理定时器、事件监听器、Ajax请求
- ✅ 页面级别的资源自动清理
- ✅ 内存使用监控和统计
- ✅ 安全的替代方法（setTimeout、setInterval）

**使用方法**:
```javascript
// 添加定时器
MemoryManager.addTimer('my_timer', setTimeout(callback, 1000));

// 清理特定页面
MemoryManager.cleanupPage('page_id');

// 全局清理
MemoryManager.cleanup();

// 获取内存统计
var stats = MemoryManager.getStats();
```

### 2. 核心方法补丁

**文件位置**: `WebContent/js/com/core-patch.js`

**修复内容**:
- ✅ 增强 `com.switchPage()` - 自动清理页面资源
- ✅ 增强 `com.loadPage()` - 标签页管理优化
- ✅ 增强 `com.post()` - Ajax请求跟踪和取消
- ✅ 增强 `com.popup()` - 弹窗资源管理
- ✅ 添加安全的定时器方法：`com.setTimeout()`, `com.setInterval()`

### 3. 登录页面修复

**文件位置**: `WebContent/js/login-fixed.js`

**修复内容**:
- ✅ 二维码检查定时器自动清理
- ✅ 事件监听器正确管理
- ✅ 页面卸载时资源释放
- ✅ Ajax请求超时处理

---

## 🚀 实施步骤

### 步骤1：加载内存管理器

在主页面 `index.html` 中添加：

```html
<!-- 在其他核心JS文件之后加载 -->
<script src="js/com/memoryManager.js"></script>
<script src="js/com/core-patch.js"></script>
```

### 步骤2：替换登录页面

修改 `login.html` 中的JS引用：

```html
<!-- 将原有的 login.js 替换为修复版本 -->
<!-- <script src="js/login.js"></script> -->
<script src="js/login-fixed.js"></script>
```

### 步骤3：为业务页面添加清理逻辑

在每个业务页面的JS文件中添加：

```javascript
$(function() {
    var PAGE_ID = 'your_page_id'; // 唯一页面标识

    // 页面卸载时清理
    $(window).on('beforeunload', function() {
        if (typeof com !== 'undefined' && com.cleanupPage) {
            com.cleanupPage(PAGE_ID);
        }
    });

    // 使用安全的定时器
    // 替换 setTimeout(callback, 1000)
    if (typeof com !== 'undefined' && com.setTimeout) {
        com.setTimeout(PAGE_ID + '_timer', callback, 1000);
    }

    // Ajax请求会自动被管理
    com.post(api.xxx, params, function(response) {
        // 正常处理响应
    });
});
```

---

## 🔍 内存泄漏检测

### 1. 开发者工具检测

打开 Chrome DevTools > Performance > Memory：

1. **Heap Snapshot** - 检查对象泄漏
2. **Allocation Timeline** - 监控内存分配
3. **Memory Trend** - 观察内存趋势

### 2. 使用内存管理器统计

```javascript
// 检查当前内存使用
var stats = com.checkMemory();

console.log('Memory Usage:', stats);
/* 输出示例:
{
  timers: 5,
  eventListeners: 23,
  ajaxRequests: 3,
  domRefs: 12,
  components: 8
}
*/
```

### 3. 自动监控

内存管理器会每30秒自动检查内存使用情况，并在控制台输出警告：

```
Memory Manager Stats: {timers: 5, eventListeners: 23, ajaxRequests: 3, ...}
Warning: Too many active timers: 25
```

---

## 📊 预期效果

### 修复前问题
- 📈 内存使用量持续增长（页面切换后不释放）
- 🐌 页面响应变慢（累积的定时器和监听器）
- 💾 长时间使用后浏览器崩溃
- 🔄 切换页面后旧的二维码检查仍在运行

### 修复后改善
- ✅ 内存使用稳定（页面切换后自动清理）
- ⚡ 页面响应流畅（资源及时释放）
- 🛡️ 长期使用稳定性提升
- 🔧 自动资源管理，无需手动干预

---

## 🛡️ 最佳实践建议

### 1. 定时器使用

```javascript
// ❌ 错误方式
setTimeout(function() {
    // 一些操作
}, 1000);

// ✅ 正确方式
com.setTimeout('page_timer', function() {
    // 一些操作
}, 1000);
```

### 2. 事件监听器

```javascript
// ❌ 错误方式
$('#element').on('click', handler);

// ✅ 正确方式（使用事件委托）
$(document).on('click', '#element', handler);
```

### 3. 页面切换

```javascript
// 页面切换前会自动清理，无需额外代码
com.switchPage(url);

// 手动清理当前页面
com.cleanupPage();
```

### 4. 第三方组件

```javascript
// 使用组件时
var $element = $('#myElement').chosen();

// 添加到内存管理器
MemoryManager.addComponent('my_chosen', $element);
```

---

## 🔧 故障排除

### 问题1：内存管理器未加载

**症状**: `com.setTimeout is not a function`

**解决**: 确保 `memoryManager.js` 和 `core-patch.js` 已正确加载

### 问题2：清理不彻底

**症状**: 内存仍然缓慢增长

**解决**: 检查是否有未使用MemoryManager API的直接DOM操作

### 问题3：功能异常

**症状**: 定时器或事件不工作

**解决**: 确保使用了正确的前缀命名页面ID

---

## 📈 监控指标

### 关键指标
- **Active Timers**: < 20
- **Active Ajax Requests**: < 10
- **Event Listeners**: 根据页面复杂度
- **Memory Growth Rate**: < 1MB/小时

### 监控脚本

```javascript
// 添加到主页面的定时监控
setInterval(function() {
    var stats = com.checkMemory();

    if (stats.timers > 20) {
        console.warn('⚠️ Too many timers:', stats.timers);
    }

    if (stats.ajaxRequests > 10) {
        console.warn('⚠️ Too many Ajax requests:', stats.ajaxRequests);
    }
}, 60000); // 每分钟检查一次
```

---

## 📝 维护日志

### 2025-12-14 v1.0
- ✅ 创建内存管理器
- ✅ 实现核心方法补丁
- ✅ 修复登录页面内存泄漏
- ✅ 添加自动监控功能
- ✅ 编写修复指南

---

## 📞 支持

如遇到问题，请检查：

1. 浏览器控制台的错误信息
2. 内存使用统计 (`com.checkMemory()`)
3. 确保所有JS文件正确加载

**记住**: 内存泄漏修复是一个持续的过程，建议定期监控内存使用情况。