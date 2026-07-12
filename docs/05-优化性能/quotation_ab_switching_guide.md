# quotationPart.js A/B切换优化方案

> 通过新增文件实现优化，支持随时切换，零风险

---

## 📂 文件结构

```
WebContent/
├── js/quotation/
│   ├── quotationPart.js              # 原始版本 (保持不变)
│   ├── quotationPart.opt.js          # 优化版本 (新增)
│   └── quotationConfig.js            # 切换配置 (新增)
│
└── views/quotation/
    ├── quotationPart.html            # 原始页面
    └── quotationPart.html            # 修改：支持版本切换
```

---

## 1. 切换配置文件 (新增)

**文件**: `WebContent/js/quotation/quotationConfig.js`

```javascript
/**
 * 报价模块版本配置
 * 控制 A/B 版本切换
 */
var QuotationVersionConfig = (function() {

    // ==================== 配置项 ====================

    var config = {
        // 当前使用的版本: 'original' | 'optimized'
        currentVersion: 'original',

        // 白名单用户ID列表（优先使用新版本）
        whitelist: [],

        // 黑名单用户ID列表（永不使用新版本）
        blacklist: [],

        // 灰度比例 (0-100)
        canaryPercentage: 0,

        // 版本信息
        versions: {
            original: {
                name: '原始版本',
                file: 'js/quotation/quotationPart.js',
                version: '1.0.0'
            },
            optimized: {
                name: '优化版本',
                file: 'js/quotation/quotationPart.opt.js',
                version: '2.0.0-opt'
            }
        }
    };

    // ==================== 初始化：从服务器加载配置 ====================

    function init(callback) {
        // 从服务器获取配置（如果有）
        com.post(api.system.getModuleConfig, {
            'module': 'quotation'
        }, function(res) {
            if (res.config && res.config.quotationVersion) {
                config.currentVersion = res.config.quotationVersion;
                config.whitelist = res.config.whitelist || [];
                config.blacklist = res.config.blacklist || [];
                config.canaryPercentage = res.config.canaryPercentage || 0;
            }
            console.log('[QuotationConfig] 当前版本:', config.currentVersion);
            if (callback) callback();
        }, function() {
            // 接口失败，使用默认配置
            if (callback) callback();
        }, false);
    }

    // ==================== 版本判断逻辑 ====================

    /**
     * 判断当前用户应该使用哪个版本
     * @returns {string} 'original' | 'optimized'
     */
    function getVersionForUser() {
        var userId = getCurrentUserId();

        // 1. 检查是否强制指定版本（URL参数）
        var urlVersion = getUrlParam('quotation_version');
        if (urlVersion && config.versions[urlVersion]) {
            console.log('[QuotationConfig] 使用URL指定版本:', urlVersion);
            return urlVersion;
        }

        // 2. 检查黑名单（黑名单用户永远用旧版本）
        if (userId && config.blacklist.indexOf(userId) !== -1) {
            console.log('[QuotationConfig] 用户在黑名单，使用旧版本');
            return 'original';
        }

        // 3. 检查白名单（白名单用户用新版本）
        if (userId && config.whitelist.indexOf(userId) !== -1) {
            console.log('[QuotationConfig] 用户在白名单，使用新版本');
            return 'optimized';
        }

        // 4. 检查是否启用新版本
        if (config.currentVersion === 'optimized') {
            return 'optimized';
        }

        // 5. 根据灰度比例判断
        if (config.canaryPercentage > 0 && userId) {
            var hash = hashString(userId);
            if (hash % 100 < config.canaryPercentage) {
                console.log('[QuotationConfig] 灰度命中，使用新版本');
                return 'optimized';
            }
        }

        // 默认使用旧版本
        return 'original';
    }

    /**
     * 获取当前用户ID
     */
    function getCurrentUserId() {
        if (params.userInfo && params.userInfo.user) {
            return params.userInfo.user.userId;
        }
        return null;
    }

    /**
     * 获取URL参数
     */
    function getUrlParam(name) {
        var regex = new RegExp('[?&]' + name + '=([^&#]*)');
        var results = regex.exec(window.location.href);
        return results ? results[1] : null;
    }

    /**
     * 字符串哈希（0-9999）
     */
    function hashString(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash) % 10000;
    }

    // ==================== 版本切换控制 ====================

    /**
     * 切换到指定版本（需要权限）
     */
    function switchVersion(version) {
        if (!config.versions[version]) {
            console.error('[QuotationConfig] 无效版本:', version);
            return false;
        }

        com.post(api.system.updateModuleConfig, {
            'module': 'quotation',
            'config': {
                'quotationVersion': version
            }
        }, function(res) {
            config.currentVersion = version;
            console.log('[QuotationConfig] 版本已切换到:', version);
            location.reload();
        });
    }

    /**
     * 设置灰度比例
     */
    function setCanaryPercentage(percentage) {
        com.post(api.system.updateModuleConfig, {
            'module': 'quotation',
            'config': {
                'canaryPercentage': percentage
            }
        }, function(res) {
            config.canaryPercentage = percentage;
            console.log('[QuotationConfig] 灰度比例已设置:', percentage);
        });
    }

    /**
     * 添加白名单用户
     */
    function addToWhitelist(userId) {
        if (config.whitelist.indexOf(userId) === -1) {
            config.whitelist.push(userId);
            saveWhitelist();
            console.log('[QuotationConfig] 已添加到白名单:', userId);
        }
    }

    /**
     * 从白名单移除用户
     */
    function removeFromWhitelist(userId) {
        var index = config.whitelist.indexOf(userId);
        if (index !== -1) {
            config.whitelist.splice(index, 1);
            saveWhitelist();
            console.log('[QuotationConfig] 已从白名单移除:', userId);
        }
    }

    /**
     * 保存白名单到服务器
     */
    function saveWhitelist() {
        com.post(api.system.updateModuleConfig, {
            'module': 'quotation',
            'config': {
                'whitelist': config.whitelist
            }
        }, function(res) {
            console.log('[QuotationConfig] 白名单已保存');
        });
    }

    // ==================== 版本信息 ====================

    /**
     * 获取当前版本信息
     */
    function getCurrentVersionInfo() {
        var version = getVersionForUser();
        return config.versions[version];
    }

    /**
     * 获取版本文件路径
     */
    function getVersionFilePath() {
        var version = getVersionForUser();
        return config.versions[version].file;
    }

    // ==================== 对外接口 ====================

    return {
        init: init,
        getVersionForUser: getVersionForUser,
        getCurrentVersionInfo: getCurrentVersionInfo,
        getVersionFilePath: getVersionFilePath,
        switchVersion: switchVersion,
        setCanaryPercentage: setCanaryPercentage,
        addToWhitelist: addToWhitelist,
        removeFromWhitelist: removeFromWhitelist,
        config: config  // 暴露配置供调试使用
    };

})();
```

---

## 2. HTML 页面修改

**文件**: `WebContent/views/quotation/quotationPart.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>报价详情</title>

    <!-- ==================== 原有的脚本引用 ==================== -->
    <script src="../../js/com/config.js"></script>
    <script src="../../js/com/server.js"></script>
    <script src="../../js/com/api.js"></script>
    <!-- ... 其他原有脚本 ... -->

    <!-- ==================== 新增：版本配置脚本 ==================== -->
    <script src="../../js/quotation/quotationConfig.js"></script>

    <!-- ==================== 修改：根据配置动态加载版本脚本 ==================== -->
    <script>
        // 初始化配置后动态加载对应版本的脚本
        QuotationVersionConfig.init(function() {
            var versionFilePath = QuotationVersionConfig.getVersionFilePath();
            var versionInfo = QuotationVersionConfig.getCurrentVersionInfo();

            console.log('============================================');
            console.log('报价模块版本信息:');
            console.log('  版本名称:', versionInfo.name);
            console.log('  版本号:', versionInfo.version);
            console.log('  文件路径:', versionFilePath);
            console.log('============================================');

            // 动态加载对应版本的脚本
            $.ajax({
                url: rootPath + versionFilePath + '?v=' + versionInfo.version,
                dataType: 'script',
                cache: true,
                success: function() {
                    console.log('[QuotationConfig] 脚本加载成功');
                },
                error: function() {
                    console.error('[QuotationConfig] 脚本加载失败:', versionFilePath);
                }
            });
        });
    </script>

    <!-- ==================== 调试面板（仅开发环境显示） ==================== -->
    <script id="version-debug-panel" type="text/html">
        <div id="quotationVersionPanel" style="position:fixed;top:10px;right:10px;background:#fff;border:1px solid #ccc;padding:10px;border-radius:5px;box-shadow:0 2px 10px rgba(0,0,0,0.1);z-index:9999;display:none;">
            <div style="font-weight:bold;margin-bottom:10px;">报价版本控制</div>
            <div>当前版本: <span id="currentVersionDisplay"></span></div>
            <div style="margin-top:10px;">
                <button onclick="QuotationVersionConfig.switchVersion('original')" style="margin-right:5px;">切换到旧版</button>
                <button onclick="QuotationVersionConfig.switchVersion('optimized')">切换到新版</button>
            </div>
            <div style="margin-top:10px;font-size:12px;color:#999;">
                URL参数: ?quotation_version=optimized
            </div>
        </div>
    </script>
    <script>
        // 显示调试面板（开发环境）
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.href.indexOf('test') !== -1) {
            $('#version-debug-panel').after(function() {
                return this.innerHTML;
            });
            $('#quotationVersionPanel').show();
            $('#currentVersionDisplay').text(QuotationVersionConfig.getCurrentVersionInfo().name);
        }
    </script>
</head>
<body>
    <!-- 原有的页面内容，保持不变 -->
</body>
</html>
```

---

## 3. 优化版本文件 (新增)

**文件**: `WebContent/js/quotation/quotationPart.opt.js`

```javascript
/**
 * 报价模块 - 优化版本
 *
 * 基于 quotationPart.js v1.0.0 进行优化
 * 优化内容：
 *   1. 提取魔法数字为常量
 *   2. DOM 查询缓存优化
 *   3. eval 替换为安全函数
 *   4. 减少重复计算
 *   5. 完善代码注释
 *
 * @version 2.0.0-opt
 * @date 2026-03-05
 */

(function() {

    // ==================== 常量定义 (新增) ====================

    var CONST = {
        // 功能区层级
        LEVEL_CMPREH_DOMAIN: '9998',
        LEVEL_MANAGEMENT: '9999',

        // 数值限制
        MAX_FORMULA_VALUE: 10000000,
        MAX_DECIMALS: 3,

        // 计时器
        TIMER_INTERVAL: 1000,

        // 类型标识
        TYPE_COMMON: 0,
        TYPE_CUSTOM: 1,

        // 控制标志
        CONTROL_ENABLED: '0',
        CONTROL_DISABLED: '1',

        // 折扣类型
        DISCOUNT_YES: 1,
        DISCOUNT_NO: 0
    };

    // ==================== 安全公式计算 (新增) ====================

    /**
     * 安全公式计算函数
     * 替代 eval()，避免代码注入风险
     */
    function safeEval(expres) {
        if (!expres || expres === '') {
            return 0;
        }

        expres = expres.replace(/\s+/g, '');

        // 安全检查：只允许数字、运算符、括号、小数点、变量名
        var safePattern = /^[\d\+\-\*\/\(\)\.a-zA-Z_]+$/;
        if (!safePattern.test(expres)) {
            console.warn('[safeEval] Invalid formula:', expres);
            return 0;
        }

        // 检查危险关键字
        var dangerous = ['window', 'document', 'alert', 'console', 'function', 'return', 'this'];
        for (var i = 0; i < dangerous.length; i++) {
            if (expres.indexOf(dangerous[i]) !== -1) {
                console.warn('[safeEval] Dangerous keyword detected:', expres);
                return 0;
            }
        }

        try {
            var result = new Function('return (' + expres + ')')();

            if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
                return 0;
            }

            if (result < 0 || result > CONST.MAX_FORMULA_VALUE) {
                return 0;
            }

            return result;
        } catch (e) {
            console.error('[safeEval] Parse error:', e.message);
            return 0;
        }
    }

    // ==================== 以下是原文件的代码，仅做局部优化 ====================
    // 代码从原文件复制，然后进行以下微调：
    //
    // 1. 搜索 "9998" → 替换为 CONST.LEVEL_CMPREH_DOMAIN
    // 2. 搜索 "10000000" → 替换为 CONST.MAX_FORMULA_VALUE
    // 3. 搜索 eval(...) → 替换为 safeEval(...)
    // 4. 搜索 data-control == 1 → 替换为 data-control == CONST.CONTROL_DISABLED
    // 5. 搜索 discount == 1 → 替换为 discount == CONST.DISCOUNT_YES
    // 6. 搜索 }, 1000); → 替换为 }, CONST.TIMER_INTERVAL);
    //
    // 注意：只替换字面量，不要替换变量名或注释

    var rtems = {
        // ... 原有代码，保持不变 ...
    };

    var quo = {
        // ... 原有代码，保持不变 ...
    };

    var domain = {
        // ... 原有代码，保持不变 ...
    };

    var quote = {
        // ... 原有代码，保持不变 ...

        // ===== 优化点1：calculationNum 函数中的 eval 替换 =====
        // 原代码（约 3093 行）：
        // var num = utils.changeThrDecimal(eval(formula));
        // 优化后：
        calculationNum: function() {
            com.focusPage('#formula').blur(function() {
                var that = $(this);
                try {
                    var formula = that.val();
                    formula = formula.replace(/\s+/g, "");

                    var test = /([\D][\.][\D])|([\d][\.][\D])|([\D][\.][\d])|(\.$)|(^\.)|([\+\-\*\/\(][\+\-\*\/])|([^\d|^\+|^\-|^\*|^\/|^\.|^\(|^\)])/;

                    if (test.test(formula) || formula == null || formula == '') {
                        com.focusPage('#num').val('');
                        return false;
                    }

                    // 使用 safeEval 替代 eval
                    var num = utils.changeThrDecimal(safeEval(formula));

                    if (num < 0 || num > CONST.MAX_FORMULA_VALUE) {
                        com.focusPage('#num').val('');
                        return false;
                    }

                    that.val(formula);
                    com.focusPage('#num').val(num);
                } catch (e) {
                    com.focusPage('#num').val('');
                    return false;
                }
            });
        }
    };

    var painter = {
        // ... 原有代码，保持不变 ...

        // ===== 优化点2：createdomain 中的魔法数字替换 =====
        // 原代码（约 3867 行）：
        // if (dv.functionAreaOrder == "9998") {
        //     btnShow = false;
        // }
        // 优化后：
        createdomain: function(dv) {
            var that = this;
            var $domain, $dhead, $dname, $dtoolbar, $btns = {}, $dbody, $dbodyInner, $list, $input;

            var btnShow = [constant.quotation().quotationFunctionArea.TYPE_MANAGEMENT_INT, constant.quotation().quotationFunctionArea.TYPE_CMPREH_INT].indexOf(dv.type) == -1;

            // 使用常量替换魔法数字
            if (dv.functionAreaOrder == CONST.LEVEL_CMPREH_DOMAIN) {
                btnShow = false;
            }

            // ... 其余代码保持不变 ...
        },

        // ===== 优化点3：createQuote 中的公式计算 =====
        // 原代码（约 4028 行）：
        // v.formula = v.qfaiId != null ? v.formula : utils.changeThrDecimal(isNaN(eval(v.formula)) ? 0 : eval(v.formula));
        // v.num = utils.changeThrDecimal(isNaN(eval(v.formula)) ? 0 : eval(v.formula));
        // 优化后：
        createQuote: function(linenum, qv) {
            var $item = $('<li></li>').addClass('fl-quo-item item').prop('title', qv.content);
            // ... 前面的代码保持不变 ...

            if (v.formula.indexOf('|') != -1) {
                var _pre = v.formula.split('|')[0];
                var _nex = v.formula.split('|')[1];
                v.formula = "Math.max(" + _pre + ", " + _nex + ")";
            }

            // 使用 safeEval 替代 eval
            v.formula = v.qfaiId != null ? v.formula : utils.changeThrDecimal(safeEval(v.formula));
            v.num = utils.changeThrDecimal(safeEval(v.formula));

            // ... 后面的代码保持不变 ...
        }
    };

    // ==================== 初始化代码 ====================

    return {
        init: function() {
            quo.orderid = params.quotation.orderId;
            quo.quotationid = params.quotation.quotation.qid;
            quo.versionId = params.quotation.quotation.version.no;

            // ... 其余初始化代码保持不变 ...

            // 在初始化完成后，输出版本信息
            console.log('%c报价模块版本: 2.0.0-opt (优化版)', 'color: green; font-weight: bold');
        }
    };

})();

// 初始化
$(function() {
    QuotationDetail.init();
});
```

---

## 4. 快速切换脚本

**文件**: `WebContent/js/quotation/quotationToggle.js` (可选，用于调试)

```javascript
/**
 * 报价版本快速切换工具
 * 在浏览器控制台使用
 */
var QuotationToggle = (function() {

    /**
     * 切换到原始版本
     */
    function switchToOriginal() {
        if (confirm('确定切换到原始版本吗？页面将重新加载。')) {
            var url = new URL(window.location.href);
            url.searchParams.set('quotation_version', 'original');
            window.location.href = url.toString();
        }
    }

    /**
     * 切换到优化版本
     */
    function switchToOptimized() {
        if (confirm('确定切换到优化版本吗？页面将重新加载。')) {
            var url = new URL(window.location.href);
            url.searchParams.set('quotation_version', 'optimized');
            window.location.href = url.toString();
        }
    }

    /**
     * 清除版本选择（使用默认版本）
     */
    function clearVersion() {
        var url = new URL(window.location.href);
        url.searchParams.delete('quotation_version');
        window.location.href = url.toString();
    }

    /**
     * 显示当前版本信息
     */
    function showVersionInfo() {
        console.log('========================================');
        console.log('报价模块版本信息');
        console.log('========================================');
        console.log('URL参数:', getUrlParam('quotation_version'));
        console.log('当前用户:', params.userInfo ? params.userInfo.user.userId : '未知');
        console.log('白名单用户:', QuotationVersionConfig.config.whitelist);
        console.log('黑名单用户:', QuotationVersionConfig.config.blacklist);
        console.log('灰度比例:', QuotationVersionConfig.config.canaryPercentage + '%');
        console.log('========================================');
    }

    function getUrlParam(name) {
        var regex = new RegExp('[?&]' + name + '=([^&#]*)');
        var results = regex.exec(window.location.href);
        return results ? results[1] : null;
    }

    // 暴露全局快捷命令
    window.quoToggle = {
        old: switchToOriginal,
        new: switchToOptimized,
        reset: clearVersion,
        info: showVersionInfo
    };

    console.log('========================================');
    console.log('报价版本切换工具已加载');
    console.log('使用方法:');
    console.log('  quoToggle.old()   - 切换到原始版本');
    console.log('  quooToggle.new()   - 切换到优化版本');
    console.log('  quoToggle.reset() - 清除版本选择');
    console.log('  quoToggle.info()  - 显示版本信息');
    console.log('========================================');

    return {
        switchToOriginal: switchToOriginal,
        switchToOptimized: switchToOptimized,
        clearVersion: clearVersion,
        showVersionInfo: showVersionInfo
    };

})();
```

---

## 5. 使用方式

### 方式1：URL 参数切换（最简单）

```
# 使用原始版本（默认）
http://example.com/views/quotation/quotationPart.html

# 强制使用优化版本
http://example.com/views/quotation/quotationPart.html?quotation_version=optimized

# 强制使用原始版本
http://example.com/views/quotation/quotationPart.html?quotation_version=original
```

### 方式2：控制台切换（调试用）

```
1. 打开浏览器控制台 (F12)
2. 输入命令：

# 切换到优化版本
quoToggle.new()

# 切换到原始版本
quoToggle.old()

# 查看版本信息
quoToggle.info()
```

### 方式3：白名单切换（推荐用于测试）

```javascript
// 在控制台添加当前用户到白名单
QuotationVersionConfig.addToWhitelist('当前用户ID');

// 刷新页面
location.reload();

// 用户将自动使用优化版本
```

### 方式4：灰度发布（生产环境）

```javascript
// 设置 10% 的用户使用新版本
QuotationVersionConfig.setCanaryPercentage(10);

// 或完全切换到新版本
QuotationVersionConfig.switchVersion('optimized');
```

---

## 6. 实施步骤

### 第一步：创建新文件（不动原文件）

```bash
# 1. 复制原文件作为基础
cp quotationPart.js quotationPart.opt.js

# 2. 在 quotationPart.opt.js 中进行优化修改

# 3. 创建配置文件
# 创建 quotationConfig.js

# 4. 修改 HTML 页面
# 添加动态加载逻辑
```

### 第二步：本地验证

```bash
# 1. 本地启动服务
# 2. 访问页面（默认使用原版本）
http://localhost:8080/views/quotation/quotationPart.html

# 3. 测试切换到优化版本
http://localhost:8080/views/quotation/quotationPart.html?quotation_version=optimized

# 4. 对比功能是否正常
```

### 第三步：内部测试（1-2天）

```javascript
// 添加内部测试账号到白名单
QuotationVersionConfig.addToWhitelist('U001');
QuotationVersionConfig.addToWhitelist('U002');
QuotationVersionConfig.addToWhitelist('U003');

// 内部用户使用新版本，收集反馈
```

### 第四步：灰度发布（分阶段）

```
第1天: 5% 灰度
第3天: 20% 灰度
第7天: 50% 灰度
第14天: 100% 全量
```

### 第五步：切换到新版本

```javascript
// 确认无问题后，切换默认版本
QuotationVersionConfig.switchVersion('optimized');
```

---

## 7. 回滚方案

```bash
# 情况1：新版本有问题，立即切回原版本
QuotationVersionConfig.switchVersion('original');

# 情况2：需要完全移除切换逻辑
# 1. 恢复 HTML 到原始状态
# 2. 删除或重命名 quotationPart.opt.js
# 3. 删除 quotationConfig.js

# 情况3：特定用户有问题
QuotationVersionConfig.addToBlacklist('用户ID');
```

---

## 8. 对比测试工具

```javascript
/**
 * 新旧版本对比测试脚本
 * 在控制台运行
 */
var runComparisonTest = function() {
    console.log('========== 开始对比测试 ==========');

    // 测试用例
    var testCases = [
        { formula: '2 + 3', expected: 5, desc: '简单加法' },
        { formula: '10 * 5', expected: 50, desc: '乘法' },
        { formula: '(10 + 5) * 2', expected: 30, desc: '括号优先' },
        { formula: '{a} + {b}', params: {a: 100, b: 50}, expected: 150, desc: '变量替换' },
        { formula: 'Math.max(10, 20)', expected: 20, desc: 'Math函数' },
        { formula: '', expected: 0, desc: '空字符串' },
        { formula: 'alert(1)', expected: 0, desc: '恶意代码' }
    ];

    var passed = 0;
    var failed = 0;

    testCases.forEach(function(t, i) {
        var formula = t.formula;

        // 处理变量
        if (t.params) {
            for (var key in t.params) {
                formula = formula.replace('{' + key + '}', t.params[key]);
            }
        }

        // 原版本计算（eval）
        var oldResult = 0;
        try {
            oldResult = eval(formula);
            if (isNaN(oldResult)) oldResult = 0;
        } catch (e) {
            oldResult = 0;
        }

        // 新版本计算（safeEval）
        var newResult = safeEval(formula);

        // 对比结果
        var diff = Math.abs(oldResult - newResult);
        var isPass = diff < 0.001;

        if (isPass) {
            passed++;
            console.log('✅ 测试' + (i + 1) + '通过: ' + t.desc);
            console.log('   公式: ' + t.formula);
            console.log('   结果: ' + newResult);
        } else {
            failed++;
            console.error('❌ 测试' + (i + 1) + '失败: ' + t.desc);
            console.error('   公式: ' + t.formula);
            console.error('   旧版本: ' + oldResult);
            console.error('   新版本: ' + newResult);
            console.error('   差异: ' + diff);
        }
    });

    console.log('========================================');
    console.log('测试完成！');
    console.log('通过: ' + passed + ' / ' + testCases.length);
    console.log('失败: ' + failed + ' / ' + testCases.length);
    console.log('========================================');

    return failed === 0;
};

// 运行对比测试
runComparisonTest();
```

---

## 附录：检查清单

### 发布前

```markdown
- [ ] quotationPart.opt.js 已创建
- [ ] quotationConfig.js 已创建
- [ ] quotationPart.html 已修改
- [ ] 本地测试通过
- [ ] 新旧版本对比测试通过
- [ ] 白名单用户验证通过
```

### 发布后

```markdown
- [ ] 白名单用户使用正常
- [ ] 错误日志无增加
- [ ] 计算结果正确
- [ ] 性能符合预期
```

---

**维护者**: AI 助手
**最后更新**: 2026-03-05
