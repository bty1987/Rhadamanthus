# quotationPart.js 逐步微调优化方案

> 文档版本：v2.0 (微调版)
> 创建日期：2026-03-05
> 策略：小步快跑，每步独立、可验证、可回滚

---

## 📋 优化策略

```
┌─────────────────────────────────────────────────────────────────┐
│                     微调优化策略                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   微调1 → 微调2 → 微调3 → 微调4 → 微调5 → 微调6 → 微调7        │
│   常量提取  DOM缓存  eval替换  计算去重  函数拆分  注释完善  测试  │
│                                                                 │
│   ✓ 风险极低  ✓ 风险低   ✓ 风险中   ✓ 风险中   ✓ 风险低   ✓ 风险低 │
│   ✓ 可验证   ✓ 可验证   ✓ 可验证   ✓ 可验证   ✓ 可验证   ✓ 可验证 │
│   ✓ 可回滚   ✓ 可回滚   ✓ 可回滚   ✓ 可回滚   ✓ 可回滚   ✓ 可回滚 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 微调 #1: 常量提取 (风险极低)

**目标**：将魔法数字替换为有意义的常量
**风险**：极低（纯文本替换）
**时间**：1小时
**可回滚**：是

### 1.1 改动内容

```javascript
// ==================== 改动位置：文件顶部 ====================
// 在 var rtems = ... 之前添加

/**
 * 报价模块常量
 * 集中管理魔法数字，便于维护
 */
var CONST = {
    // 功能区层级
    LEVEL_CMPREH_DOMAIN: '9998',        // 综合功能区层级
    LEVEL_MANAGEMENT: '9999',           // 管理功能区层级

    // 数值限制
    MAX_FORMULA_VALUE: 10000000,        // 公式最大值
    MAX_DECIMALS: 3,                    // 小数位数

    // 计时器
    TIMER_INTERVAL: 1000,               // 定时器间隔(ms)

    // 类型标识
    TYPE_COMMON: 0,                     // 标准类型
    TYPE_CUSTOM: 1,                     // 自定义类型

    // 控制标志
    CONTROL_ENABLED: '0',               // 启用状态
    CONTROL_DISABLED: '1',              // 禁用状态

    // 折扣类型
    DISCOUNT_YES: 1,                    // 打折
    DISCOUNT_NO: 0                      // 不打折
};

// ==================== 改动位置：按 Ctrl+H 批量替换 ====================

// 替换 1:
// 查找: functionAreaOrder == "9998"
// 替换为: functionAreaOrder == CONST.LEVEL_CMPREH_DOMAIN

// 替换 2:
// 查找: num > 10000000
// 替换为: num > CONST.MAX_FORMULA_VALUE

// 替换 3:
// 查找: }, 1000);
// 替换为: }, CONST.TIMER_INTERVAL);

// 替换 4:
// 查找: data-control == 1
// 替换为: data-control == CONST.CONTROL_DISABLED

// 替换 5:
// 查找: discount == 1
// 替换为: discount == CONST.DISCOUNT_YES
```

### 1.2 验证方法

```javascript
// 验证步骤：
// 1. 全局搜索 "9998"，确认全部替换
// 2. 全局搜索 "10000000"，确认全部替换
// 3. 运行报价页面，功能正常
// 4. 创建测试报价，计算正确
```

### 1.3 回滚方法

```javascript
// Git 回滚
git checkout HEAD~1 -- WebContent/js/quotation/quotationPart.js

// 或手动反向替换
// 查找: CONST.LEVEL_CMPREH_DOMAIN
// 替换为: "9998"
```

---

## 微调 #2: DOM 查询缓存 (风险低)

**目标**：缓存重复的 DOM 查询
**风险**：低（不影响逻辑）
**时间**：2小时
**可回滚**：是

### 2.1 改动内容

```javascript
// ==================== 改动位置：painter.createQuote 函数 ====================
// 文件位置：约 4148 行

// 原代码：
createQuote: function(linenum, qv) {
    var $item = $('<li></li>').addClass('fl-quo-item item').prop('title', qv.content);

    // ... 省略中间代码 ...

    $.each(_lineSet, function(i, v) {
        var $cell = $('<div></div>').addClass('cell ' + v[0]);
        var $cellWrap = $('<div></div>').addClass('cell-wrap').append($("<span></span>").html(v[1]));
        // ... 每次循环都创建新对象
    });
}

// 优化后：
createQuote: function(linenum, qv) {
    var $item = $('<li></li>').addClass('fl-quo-item item').prop('title', qv.content);

    // 新增：缓存常用 jQuery 构造函数
    var $div = $('<div />'),    // 缓存 div 构造器
        $span = $('<span />');   // 缓存 span 构造器

    var discount = utils.accDiv(quo.basicParams['quotation.discount'], 10);

    // ... 省略中间代码 ...

    $.each(_lineSet, function(i, v) {
        // 使用缓存的构造器
        var $cell = $div.clone().addClass('cell ' + v[0]);
        var $cellWrap = $div.clone().addClass('cell-wrap');
        $cellWrap.append($span.clone().html(v[1]));
        // ...
    });
}
```

### 2.2 改动内容（循环优化）

```javascript
// ==================== 改动位置：quote.cacsedeUpdateItem 函数 ====================
// 文件位置：约 2470 行

// 原代码：
cacsedeUpdateItem: function(items) {
    // ...
    $.each(items, function(index, e) {
        var $item = $(e);
        var qiid = $item.attr("data-qiid");
        var number = $item.find('.cell.num .cell-wrap .number').text();  // 每次都查询
        // ...
    });
}

// 优化后：
cacsedeUpdateItem: function(items) {
    // ...
    $.each(items, function(index, e) {
        var $item = $(e);
        var qiid = $item.attr("data-qiid");

        // 优化：一次性获取 cell-wrap，然后在其内部查找
        var $cellWrap = $item.find('.cell-wrap');
        var number = $cellWrap.filter('.num').find('.number').text();
        var formula = $cellWrap.filter('.formula').find('span').text();
        // ...
    });
}
```

### 2.3 验证方法

```javascript
// 验证步骤：
// 1. 打开浏览器控制台
// 2. 进入报价页面
// 3. 添加报价项，观察无报错
// 4. 修改报价项数量，计算正常
// 5. 查看控制台，无错误日志
```

---

## 微调 #3: eval 安全替换 (风险中)

**目标**：将 eval() 替换为安全的 Function 构造器
**风险**：中（需要充分测试）
**时间**：4小时
**可回滚**：是

### 3.1 改动内容

```javascript
// ==================== 改动位置：文件顶部添加工具函数 ====================
// 在 var rtems = ... 之前添加

/**
 * 安全公式计算
 * 替代 eval()，避免代码注入风险
 * @param {string} expres - 公式表达式
 * @returns {number} 计算结果
 */
function safeEval(expres) {
    // 空值检查
    if (!expres || expres === '') {
        return 0;
    }

    // 移除空白字符
    expres = expres.replace(/\s+/g, '');

    // 安全检查：只允许数字、运算符、括号、小数点
    var safePattern = /^[\d\+\-\*\/\(\)\.]+$/;
    if (!safePattern.test(expres)) {
        console.warn('[safeEval] Invalid formula:', expres);
        return 0;
    }

    try {
        // 使用 Function 构造器替代 eval
        var result = new Function('return (' + expres + ')')();

        // 结果验证
        if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
            return 0;
        }

        // 范围限制
        if (result < 0 || result > CONST.MAX_FORMULA_VALUE) {
            return 0;
        }

        return result;
    } catch (e) {
        console.error('[safeEval] Parse error:', e.message, 'formula:', expres);
        return 0;
    }
}

// ==================== 改动位置：替换 eval 调用 ====================

// 位置1：约 3093 行 (calculationNum 函数)
// 原代码：
var num = utils.changeThrDecimal(eval(formula));

// 优化后：
var num = utils.changeThrDecimal(safeEval(formula));


// 位置2：约 3605 行 (quotationFunctionAreaFormula 函数)
// 原代码：
"num": utils.changeThrDecimal(isNaN(eval(expres)) ? 0 : eval(expres))

// 优化后：
"num": utils.changeThrDecimal(safeEval(expres))


// 位置3：约 4028-4029 行 (createdomain 函数)
// 原代码：
v.formula = v.qfaiId != null ? v.formula : utils.changeThrDecimal(isNaN(eval(v.formula)) ? 0 : eval(v.formula));
v.num = utils.changeThrDecimal(isNaN(eval(v.formula)) ? 0 : eval(v.formula));

// 优化后：
v.formula = v.qfaiId != null ? v.formula : utils.changeThrDecimal(safeEval(v.formula));
v.num = utils.changeThrDecimal(safeEval(v.formula));
```

### 3.2 验证方法

```javascript
// 验证步骤：
// 1. 准备测试用例
var testCases = [
    { formula: '2 + 3', expected: 5 },
    { formula: '10 * 5', expected: 50 },
    { formula: '(10 + 5) * 2', expected: 30 },
    { formula: '100 / 4', expected: 25 },
    { formula: 'Math.max(10, 20)', expected: 20 },  // 如果支持
    { formula: 'alert(1)', expected: 0 },  // 恶意代码应返回0
    { formula: '', expected: 0 }
];

// 2. 在控制台逐个测试
testCases.forEach(function(t) {
    var result = safeEval(t.formula);
    console.log(t.formula, '=', result, '(expected:', t.expected + ')');
});

// 3. 在实际页面中测试
// - 创建新报价
// - 修改功能区参数
// - 添加/修改报价项
// - 验证计算结果与原来一致
```

---

## 微调 #4: 重复计算合并 (风险中)

**目标**：减少重复的 calculateQuoFees() 调用
**风险**：中（需要确认调用顺序）
**时间**：3小时
**可回滚**：是

### 4.1 改动内容

```javascript
// ==================== 改动位置：quote.deleteQuoteInBatches 函数 ====================
// 文件位置：约 2735 行

// 原代码：
deleteQuoteInBatches: function($domain) {
    // ... 批量删除逻辑 ...
    quote.cacsedeUpdateItem(item);
    items.push(item);

    // 这里触发计算
    var _fee = quo.calculateDomainFees(domain.nowEditDomain);

    // 这里又触发计算
    that.cacsedeUpdateCpItem(items);
    quo.calculateQuoFees();      // 第1次
    quo.calculateQuoFeesPost();  // 第2次

    // API 回调中又触发计算
    com.post(api.quotation.deleteQuotationFunctionAreaItem, _params, function(res) {
        $.each($q1, function(i, v) {
            $(v).parents('li.fl-quo-item.item').remove();
        });

        // 第3次计算
        quo.calculateDomainFees(domain.nowEditDomain);
        quo.calculateQuoFees();      // 第4次
        quo.calculateQuoFeesPost();  // 第5次

        com.focusPage('[data-qfaid="' + domain.nowEditDomain.attr('data-qfaid') + '"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
    }, function(res) {
        // 失败回调中也触发计算
        // 第6次、第7次计算...
    }, false);
}

// 优化后：在函数末尾统一计算一次
deleteQuoteInBatches: function($domain) {
    $domain.find('.fl-quo-input').insertAfter($domain.find('.fl-quo-list.list').eq(0)).addClass('hide');

    var that = this;
    var $quos = com.focusPage('[name="deleteItems"]:checked', $domain);
    var $q1 = [], $q2 = [], _params = {};

    if (!$quos.length) {
        return false;
    }

    $quos.length && $.each($quos, function(i, v) {
        if ($(v).val()) {
            _params['qfaiIds[' + $q1.length + ']'] = $(v).val();
            $q1[$q1.length] = v;
        } else {
            $q2[$q2.length] = v;
        }
    });

    $q2.length && $.each($q2, function(i, v) {
        $(v).parents('li.fl-quo-item.item').remove();
    });

    // 保存当前费用，用于后续对比
    var _fee = quo.calculateDomainFees(domain.nowEditDomain);

    // 批量处理更新（不触发计算）
    if ($q1.length) {
        var items = [];
        $.each($q1, function(i, v) {
            var $inpit = $(v);
            var item = $inpit.parents('li.fl-quo-item.item');
            item.attr("data-del-sign", 1);
            that.cacsedeUpdateItem(item);
            items.push(item);
        });

        that.cacsedeUpdateCpItem(items);

        _params = $.extend({}, _params, quo.basicParams, {
            "quotationFunctionArea.qfaId": domain.nowEditDomain.attr('data-qfaid')
        });

        com.post(api.quotation.deleteQuotationFunctionAreaItem, _params, function(res) {
            // 删除成功
            $.each($q1, function(i, v) {
                $(v).parents('li.fl-quo-item.item').remove();
            });

            // 统一计算一次
            quo.calculateDomainFees(domain.nowEditDomain);
            quo.calculateQuoFees();
            quo.calculateQuoFeesPost();

            com.focusPage('[data-qfaid="' + domain.nowEditDomain.attr('data-qfaid') + '"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
        }, function(res) {
            // 删除失败，恢复数据
            com.showAlert(com.error, res.errorMsg);

            $.each($q1, function(i, v) {
                $(v).parents('li.fl-quo-item.item').removeAttr("data-del-sign");
            });

            // 恢复计算
            items.forEach(function(item) {
                that.cacsedeUpdateItem(item);
            });
            that.cacsedeUpdateCpItem(items);

            // 统一计算一次
            quo.calculateDomainFees(domain.nowEditDomain);
            quo.calculateQuoFees();
            quo.calculateQuoFeesPost();
        }, false);
    } else {
        // 没有 $q1 的情况，也需要计算
        quo.calculateQuoFees();
        quo.calculateQuoFeesPost();
    }

    quote.sortQuote(domain.nowEditDomain);
}
```

### 4.2 其他类似位置的优化

```javascript
// ==================== 位置2：quote.deleteQuote 函数 ====================
// 文件位置：约 2823 行

// 原代码有多处 calculateQuoFees() 调用
// 优化原则：在成功/失败回调的末尾各调用一次即可
```

---

## 微调 #5: 函数拆分 (风险低)

**目标**：将过长函数拆分成小函数
**风险**：低（纯重构，不改变逻辑）
**时间**：4小时
**可回滚**：是

### 5.1 改动内容

```javascript
// ==================== 改动位置：painter.createdomain 函数 ====================
// 该函数约 800 行，拆分为多个子函数

// 原代码：一个超长函数
createdomain: function(dv) {
    // ... 800 行代码 ...
}

// 优化后：拆分为多个子函数
createdomain: function(dv) {
    var that = this;

    // 1. 创建容器
    var $domain = that._createDomainContainer(dv);

    // 2. 创建头部
    var $dhead = that._createDomainHeader(dv);

    // 3. 创建工具栏按钮
    var $dtoolbar = that._createDomainToolbar(dv);

    // 4. 创建表头
    var $headerList = that._createDomainHeaderList(dv);

    // 5. 创建主体内容
    var $dbody = that._createDomainBody(dv);

    // 6. 创建报价项列表
    that._renderQuoteItems($dbody, dv);

    // 7. 绑定事件
    that._bindDomainEvents($domain, dv);

    // 8. 设置属性
    that._setDomainAttributes($domain, dv);

    return $domain;
},

// ===== 子函数 1：创建容器 =====
_createDomainContainer: function(dv) {
    var $domain = $('<div></div>').addClass('widget-box transparent').attr({
        "data-dlevel": dv.functionAreaOrder,
        "data-qfaId": dv.qfaId,
        "data-areaType": dv.type,
        "data-total": dv.total,
    }).css({ "margin-bottom": "20px" });

    // 设置参数属性
    if (dv.quotationFunctionAreaParam) {
        $.each(dv.quotationFunctionAreaParam, function(k, v) {
            $domain.attr("data-" + k, v ? v : "0");
        });
    }

    return $domain;
},

// ===== 子函数 2：创建头部 =====
_createDomainHeader: function(dv) {
    var $dhead = $('<div></div>').addClass('widget-header');
    var $dname = $('<h5></h5>')
        .append($('<em></em>').text(
            dv.type == CONST.TYPE_MANAGEMENT || dv.functionAreaOrder == "9998" ? '' : dv.functionAreaOrder
        ))
        .append('  ')
        .append($('<strong></strong>').html(dv.functionAreaName));

    $dhead.append($dname);
    return $dhead;
},

// ===== 子函数 3：创建工具栏 =====
_createDomainToolbar: function(dv) {
    var $dtoolbar = $('<div></div>').addClass('widget-toolbar no-border');
    var btnShow = [CONST.TYPE_MANAGEMENT, CONST.TYPE_CMPREH].indexOf(dv.type) == -1;

    if (dv.functionAreaOrder == "9998") {
        btnShow = false;
    }

    var buttons = this._getToolbarButtons(dv, btnShow);
    $.each(buttons, function(k, v) {
        if (!v[2]) return true;
        var $btn = $('<a></a>').attr({ "href": "javascript:void(0)" })
            .css({ "padding-left": "5px" })
            .append(v[1])
            .appendTo($dtoolbar)
            .mouseenter(function() {
                com.showTip($btn, v[0], "top");
            });
        buttons[k] = $btn;
    });

    $dtoolbar.append(buttons);
    return $dtoolbar;
},

// ===== 子函数 4：获取工具栏按钮配置 =====
_getToolbarButtons: function(dv, btnShow) {
    return {
        "$btnSort": ["根据工种排序", '<i class="bigger-125 icon-sort orange"></i>', dv.type != CONST.TYPE_MANAGEMENT],
        "$btnEdit": ["编辑功能区", '<i class="bigger-125 icon-pencil blue"></i>', btnShow],
        "$btnAdd": ["添加工程项", '<i class="bigger-125 icon-plus purple"></i>', dv.type != CONST.TYPE_MANAGEMENT],
        "$btnSet": ["自定义报价项", '<i class="bigger-125 icon-plus-sign purple"></i>', btnShow],
        "$btnHistory": ["历史报价项", '<i class="bigger-125 icon-star green"></i>', btnShow],
        "$btnDelQuo": ["批量删除报价项", '<i class="bigger-125 icon-remove pink"></i>', btnShow],
        "$btnCopyDomain": ["复制功能区", '<i class="bigger-125 icon-copy orange"></i>', btnShow],
        "$btnDelDomain": ["删除功能区", '<i class="bigger-125 icon-trash red"></i>', btnShow],
        "$btnFold": ["折叠", '<i class="bigger-125 icon-chevron-up" functionindexdata="1" id="oneChevron_1"></i>', true]
    };
},

// ===== 子函数 5：渲染报价项 =====
_renderQuoteItems: function($dbody, dv) {
    var that = this;
    var $list = $dbody.find('.fl-quo-list.list').eq(0);

    if (!dv.quotationFunctionAreaItems || !dv.quotationFunctionAreaItems.length) {
        return;
    }

    // 排序
    var _items = dv.quotationFunctionAreaItems.sort(function(a, b) {
        if (a.index == null || b.index == null) {
            return b.index - a.index;
        } else {
            return a.index - b.index;
        }
    });

    // 渲染每一项
    $.each(_items, function(i, v) {
        v.areaType = dv.type;
        var $item = that.createQuote(i + 1, v);
        $list.append($item);
    });
},

// ===== 子函数 6：绑定事件 =====
_bindDomainEvents: function($domain, dv) {
    var that = this;

    if (dv.type != CONST.TYPE_MANAGEMENT) {
        $domain.find('[data-action="add"]').click(function() {
            domain.nowEditDomain = $domain;
            domain.pageQuotationItemForPrice();
            quo.quoModals.$quoteModal.modal("show");
        });
    }

    // 其他事件绑定...
}
```

---

## 微调 #6: 注释完善 (风险低)

**目标**：为关键函数添加清晰注释
**风险**：极低
**时间**：2小时
**可回滚**：是

### 6.1 注释模板

```javascript
/**
 * 函数名称
 *
 * @description 详细描述函数的作用
 * @param {Type} paramName - 参数说明
 * @returns {Type} 返回值说明
 *
 * @example
 * // 使用示例
 * var result = functionName(param1, param2);
 *
 * @history
 * - 2026-03-05: 添加注释
 */
```

### 6.2 示例

```javascript
// ==================== 为关键函数添加注释 ====================

/**
 * 级联更新报价项
 *
 * @description 当报价项数量变化时，自动更新关联的报价项数量
 *              例如：修改铺地砖面积，自动更新水泥砂浆用量
 *
 * @param {jQuery|Array} items - 需要更新的报价项元素或元素数组
 *
 * @example
 * // 单个报价项更新
 * quote.cacsedeUpdateItem($quoteItem);
 *
 * // 批量更新
 * quote.cacsedeUpdateItem([$item1, $item2, $item3]);
 */
cacsedeUpdateItem: function(items) {
    // ... 原有代码 ...
}

/**
 * 报价项公式计算
 *
 * @description 根据功能区参数和公式表达式，计算报价项数量
 *              支持的变量：a=周长, b=面积, c=举架, d=洞长, e=洞高...
 *              支持的函数：Math.max, Math.min
 *
 * @param {string} expres - 公式表达式，如 "{a} + {b} * 2"
 * @param {jQuery} $widget - 功能区元素，包含参数属性
 * @param {number} initNum - 初始数量（对应变量 w）
 * @returns {Object} { formula: 解析后公式, num: 计算结果 }
 *
 * @example
 * // 计算公式
 * var result = quote.quotationFunctionAreaFormula("{a} + {b}", $domain, 0);
 * console.log(result.num);  // 输出计算结果
 */
quotationFunctionAreaFormula: function(expres, $widget, initNum) {
    // ... 原有代码 ...
}
```

---

## 微调 #7: 测试用例补充 (风险低)

**目标**：为核心功能添加测试
**风险**：无（独立测试文件）
**时间**：3小时
**可回滚**：是

### 7.1 测试文件结构

```
WebContent/test/quotation/
├── formulaParser.test.js      # 公式计算测试
├── calculation.test.js         # 报价计算测试
├── domainManager.test.js       # 功能区管理测试
└── runner.html                  # 测试运行页面
```

### 7.2 测试用例示例

```html
<!-- runner.html - 测试运行页面 -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>报价模块测试</title>
    <link rel="stylesheet" href="../assets/altogether/css/qunit.css">
    <script src="../assets/altogether/js/jquery-2.0.3.min.js"></script>
    <script src="../assets/altogether/js/qunit.js"></script>
    <script src="../js/com/utils.js"></script>
    <script src="../js/quotation/quotationPart.js"></script>
</head>
<body>
    <div id="qunit"></div>
    <div id="qunit-fixture"></div>

    <script src="formulaParser.test.js"></script>
    <script src="calculation.test.js"></script>
</body>
</html>
```

```javascript
// formulaParser.test.js - 公式计算测试

QUnit.module('公式计算测试');

// 测试1：基本运算
QUnit.test('加法: 2 + 3 = 5', function(assert) {
    var result = safeEval('2 + 3');
    assert.equal(result, 5, '2 + 3 应该等于 5');
});

// 测试2：乘法
QUnit.test('乘法: 3 * 4 = 12', function(assert) {
    var result = safeEval('3 * 4');
    assert.equal(result, 12, '3 * 4 应该等于 12');
});

// 测试3：混合运算
QUnit.test('混合运算: 2 + 3 * 4 = 14', function(assert) {
    var result = safeEval('2 + 3 * 4');
    assert.equal(result, 14, '先乘后加');
});

// 测试4：括号优先级
QUnit.test('括号: (2 + 3) * 4 = 20', function(assert) {
    var result = safeEval('(2 + 3) * 4');
    assert.equal(result, 20, '括号优先');
});

// 测试5：边界值
QUnit.test('零值: 0 + 0 = 0', function(assert) {
    var result = safeEval('0 + 0');
    assert.equal(result, 0, '零值计算');
});

// 测试6：安全检查
QUnit.test('拒绝恶意代码: alert(1) 返回 0', function(assert) {
    var result = safeEval('alert(1)');
    assert.equal(result, 0, '恶意代码应返回 0');
});

// 测试7：空字符串
QUnit.test('空字符串返回 0', function(assert) {
    var result = safeEval('');
    assert.equal(result, 0, '空字符串返回 0');
});

// 测试8：超大值限制
QUnit.test('超大值限制', function(assert) {
    var result = safeEval('99999999');
    assert.equal(result, 0, '超过限制应返回 0');
});
```

---

## 实施计划

### 每周实施计划

| 周次 | 微调内容 | 风险 | 验证时间 |
|------|----------|------|----------|
| 第1周 | 微调#1: 常量提取 | 极低 | 1天 |
| 第1周 | 微调#2: DOM缓存 | 低 | 2天 |
| 第2周 | 微调#3: eval替换 | 中 | 3天 |
| 第2周 | 微调#4: 计算合并 | 中 | 3天 |
| 第3周 | 微调#5: 函数拆分 | 低 | 2天 |
| 第3周 | 微调#6: 注释完善 | 极低 | 1天 |
| 第4周 | 微调#7: 测试补充 | 无 | 持续 |

### 单次微调完整流程

```
┌─────────────────────────────────────────────────────────┐
│                   微调实施流程                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. 备份       git stash / git branch backup           │
│     ↓                                                 │
│  2. 修改       按照方案修改代码                         │
│     ↓                                                 │
│  3. 本地测试   浏览器验证功能正常                       │
│     ↓                                                 │
│  4. 对比测试   新旧版本结果对比                         │
│     ↓                                                 │
│  5. 提交审查   git commit / 代码审查                   │
│     ↓                                                 │
│  6. 合并发布   git merge / 部署                         │
│     ↓                                                 │
│  7. 观察验证   生产环境观察1-2天                        │
│     ↓                                                 │
│  8. 确认完成   标记为稳定版本                           │
│                                                         │
│  ⚠️ 任何步骤发现问题 → 立即回滚                        │
└─────────────────────────────────────────────────────────┘
```

---

## 快速检查清单

### 发布前

```markdown
## 微调发布前检查

### 代码检查
- [ ] 修改内容已确认
- [ ] 本地测试通过
- [ ] 浏览器控制台无错误
- [ ] 对比测试通过

### 文档检查
- [ ] 更新了代码注释
- [ ] 记录了修改位置
- [ ] 准备了回滚方案

### 环境检查
- [ ] 测试环境验证通过
- [ ] 预发布环境验证通过
```

### 发布后

```markdown
## 微调发布后验证

### 功能验证
- [ ] 报价创建正常
- [ ] 报价计算正确
- [ ] 报价提交成功

### 性能验证
- [ ] 响应时间正常
- [ ] 无内存泄漏
- [ ] CPU 使用正常

### 监控验证
- [ ] 错误日志无增加
- [ ] 用户反馈正常
```

---

## 附录

### A. Git 工作流

```bash
# 1. 创建微调分支
git checkout -b micro-tune-01-constants

# 2. 进行修改
# ... 编辑代码 ...

# 3. 提交修改
git add WebContent/js/quotation/quotationPart.js
git commit -m "micro-tune: 提取魔法数字为常量"

# 4. 推送到远程
git push origin micro-tune-01-constants

# 5. 发布到测试环境
# ... 测试验证 ...

# 6. 合并到主分支
git checkout master
git merge micro-tune-01-constants
git push origin master

# 7. 如果需要回滚
git revert HEAD
# 或
git reset --hard HEAD~1
```

### B. 常用命令

```bash
# 查看修改差异
git diff WebContent/js/quotation/quotationPart.js

# 查看修改统计
git diff --stat WebContent/js/quotation/quotationPart.js

# 查看文件历史
git log --oneline WebContent/js/quotation/quotationPart.js

# 回滚单个文件
git checkout HEAD~1 -- WebContent/js/quotation/quotationPart.js
```

---

**维护者**: AI 助手
**最后更新**: 2026-03-05
