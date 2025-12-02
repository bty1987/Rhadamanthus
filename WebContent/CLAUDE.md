# Rhadamanthus - 前端架构文档

> 最后更新：2025-12-02 自动生成

## 目录
- [概述](#概述)
- [目录结构](#目录结构)
- [技术栈](#技术栈)
- [入口文件与生命周期](#入口文件与生命周期)
- [核心架构](#核心架构)
- [模块化组织](#模块化组织)
- [路由与导航](#路由与导航)
- [API 调用规范](#api-调用规范)
- [开发指南](#开发指南)

---

## 概述

Rhadamanthus 前端采用传统的多页面应用（MPA）架构，基于 **Ace Admin** 模板和 **jQuery** 技术栈构建。系统通过自定义的 JavaScript 框架实现了模块化、组件化和统一的 API 调用机制。

### 核心特点

- 🎨 **模板引擎**: Ace Admin + LayUI 组合
- 🔧 **自定义框架**: 封装了 `com` 全局对象处理通用逻辑
- 📦 **模块化设计**: 按业务模块组织代码（27个业务模块）
- 🔌 **组件化**: Api、Validator、Printer、Condition 等可复用组件
- 🌐 **API 统一管理**: 通过 `api` 对象集中定义后端接口
- 🎯 **权限控制**: 基于菜单权限的动态导航系统

---

## 目录结构

```
WebContent/
├── assets/                  # 静态资源库
│   ├── ace/                # Ace Admin 模板资源
│   │   ├── css/           # 样式文件
│   │   └── js/            # 脚本文件
│   ├── altogether/         # 通用组件库
│   │   ├── css/           # LayUI、ECharts 等样式
│   │   └── js/            # jQuery、LayUI、ECharts 等
│   ├── clear/             # Clear 主题资源
│   └── metro/             # Metro 主题资源
│
├── css/                    # 自定义样式
│   └── main.css           # 主样式文件
│
├── js/                     # 自定义 JavaScript
│   ├── com/               # 核心框架组件（17个文件）
│   │   ├── api.js         # API 初始化器
│   │   ├── config.js      # 全局配置
│   │   ├── core.js        # 核心方法（com 对象）
│   │   ├── utils.js       # 工具函数
│   │   ├── validator.js   # 表单验证
│   │   ├── printer.js     # 打印组件
│   │   ├── condition.js   # 条件查询组件
│   │   ├── constant.js    # 常量管理
│   │   ├── params.js      # 全局参数
│   │   ├── server.js      # 服务器配置
│   │   ├── exporter.js    # 导出组件
│   │   ├── reporter.js    # 报表组件
│   │   ├── searcher.js    # 搜索组件
│   │   ├── load.js        # 页面加载
│   │   ├── error.js       # 错误处理
│   │   ├── version.js     # 版本管理
│   │   └── nw.js          # NW.js 桌面应用集成
│   │
│   ├── api/               # API 接口定义（按模块）
│   │   ├── decoration.js  # 装饰订单接口
│   │   ├── quotation.js   # 报价管理接口
│   │   ├── construction.js # 施工管理接口
│   │   ├── balance.js     # 财务结算接口
│   │   ├── sales.js       # 主材销售接口
│   │   └── ...            # 其他模块接口（共25+个）
│   │
│   ├── condition/         # 条件查询组件（按模块）
│   │   ├── decoration.js  # 装饰订单查询条件
│   │   ├── construction.js # 施工管理查询条件
│   │   └── ...            # 其他模块查询条件
│   │
│   ├── utils/             # 业务工具类（15个文件）
│   │   ├── decorationUtils.js      # 装饰订单工具
│   │   ├── quotationUtils.js       # 报价计算工具
│   │   ├── constructionUtils.js    # 施工管理工具
│   │   ├── salesUtils.js           # 主材销售工具
│   │   ├── productionUtils.js      # 生产管理工具
│   │   ├── approvalUtils.js        # 审批流程工具
│   │   ├── paymentUtils.js         # 支付管理工具
│   │   ├── planUtils.js            # 计划排期工具
│   │   ├── houseUtils.js           # 房屋管理工具
│   │   ├── userUtils.js            # 用户管理工具
│   │   └── kingdeeUtils.js         # 金蝶集成工具
│   │
│   ├── [模块]/            # 业务模块脚本（按模块组织）
│   │   ├── decoration/    # 装饰订单模块（24个JS文件）
│   │   ├── quotation/     # 报价管理模块
│   │   ├── construction/  # 施工管理模块
│   │   └── ...            # 其他模块（共25+个）
│   │
│   ├── index.js           # 主框架入口脚本
│   ├── login.js           # 登录页脚本
│   ├── main.js            # 主页面脚本
│   └── home.js            # 首页脚本
│
├── views/                  # HTML 视图页面（594+ 页面）
│   ├── decoration/        # 装饰订单视图
│   ├── quotation/         # 报价管理视图
│   ├── construction/      # 施工管理视图
│   ├── balance/           # 财务结算视图
│   ├── sales/             # 主材销售视图
│   ├── customer/          # 客户管理视图
│   ├── building/          # 楼盘管理视图
│   ├── production/        # 生产管理视图
│   ├── system/            # 系统管理视图
│   ├── approval/          # 审批流程视图
│   ├── personnel/         # 人事管理视图
│   ├── salary/            # 薪资管理视图
│   ├── material/          # 材料管理视图
│   ├── payment/           # 支付管理视图
│   ├── information/       # 信息管理视图
│   ├── report/            # 报表统计视图
│   ├── store/             # 在线商城视图
│   ├── data/              # 数据字典视图
│   ├── contract/          # 合同模板视图
│   └── ...                # 其他模块视图
│
├── ds/                     # 导航数据源（JSON 配置）
│   ├── system.json        # 系统管理导航
│   ├── decoration.json    # 装饰订单导航
│   ├── customer.json      # 客户管理导航
│   ├── fip.json           # 平台通用数据
│   ├── help.json          # 帮助文档数据
│   └── ...                # 其他模块导航（共25+个）
│
├── images/                 # 图片资源
├── db/                     # 离线数据库
├── result/                 # Mock 数据（Demo 模式）
│
├── index.html             # 主框架入口（带菜单）
├── login.html             # 登录页
├── main.html              # 简化版主框架
├── home.html              # 首页（数据看板）
├── index-clear.html       # Clear 主题框架
├── index-metro.html       # Metro 主题框架
├── index-dark.html        # Dark 主题框架
├── dlogin.html            # 桌面版登录页
└── WEB-INF/               # Web 配置目录
    └── web.xml            # Web 应用配置
```

---

## 技术栈

### UI 框架与库

| 名称 | 版本 | 用途 | 文档路径 |
|------|------|------|---------|
| **Ace Admin** | - | 管理后台模板 | `assets/ace/` |
| **Bootstrap** | 3.x | 响应式框架 | `assets/ace/css/bootstrap.min.css` |
| **LayUI** | - | UI 组件库 | `assets/altogether/js/layui.js` |
| **Font Awesome** | 4.x | 图标库 | `assets/altogether/css/font-awesome.min.css` |

### JavaScript 核心库

| 名称 | 版本 | 用途 | 文档路径 |
|------|------|------|---------|
| **jQuery** | 2.0.3 | DOM 操作 | `assets/altogether/js/jquery-2.0.3.min.js` |
| **jQuery UI** | 1.10.3 | UI 交互组件 | `assets/altogether/js/jquery-ui-1.10.3.custom.min.js` |
| **ECharts** | - | 图表可视化 | `assets/altogether/js/echarts.min.js` |
| **Highcharts** | - | 高级图表 | `assets/altogether/js/highcharts.js` |
| **Moment.js** | - | 日期时间处理 | `assets/altogether/js/date-time/moment.min.js` |

### 插件与工具

| 名称 | 用途 | 文档路径 |
|------|------|---------|
| **FullCalendar** | 日历组件 | `assets/altogether/js/fullcalendar.min.js` |
| **DataSet** | 数据集管理 | `assets/altogether/js/data-set.min.js` |
| **Bootbox** | 对话框 | `assets/altogether/js/bootbox.min.js` |
| **zTree** | 树形控件 | `assets/altogether/js/ztree/` |
| **Huploadify** | 文件上传 | `assets/ace/css/huploadify.css` |
| **jSignature** | 手写签名 | `assets/altogether/js/jSignature.min.js` |
| **html2canvas** | 页面截图 | `assets/altogether/js/html2canvas.js` |
| **jsPDF** | PDF 生成 | `assets/altogether/js/jspdf.min.js` |
| **CryptoJS** | 加密解密 | `assets/altogether/js/crypto.min.js` |
| **Pace.js** | 页面加载进度 | `assets/altogether/js/pace.min.js` |
| **Drawflow** | 流程图绘制 | `assets/altogether/js/drawflow.min.js` |

---

## 入口文件与生命周期

### 1. 登录流程 (`login.html`)

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <!-- 基础配置 -->
    <meta charset="utf-8" />
    <title>FIP - 方林信息平台</title>

    <!-- 动态加载 CSS -->
    <script>
        var csses = "";
        csses += '<link rel="stylesheet" href="assets/ace/css/bootstrap.min.css" />'
        csses += '<link rel="stylesheet" href="assets/altogether/css/font-awesome.min.css" />'
        csses += '<link rel="stylesheet" href="assets/ace/css/ace.css" />'
        document.write(csses);
    </script>
</head>
<body class="login-layout">
    <!-- 登录表单 -->
    <form id="loginFrom">
        <input type="text" id="userId" placeholder="登陆ID">
        <input type="password" id="password" placeholder="密码">
        <input type="text" id="nowCode" placeholder="验证码">
        <button id="loginBtn">登陆</button>
    </form>

    <!-- 动态加载 JS -->
    <script>
        var jses = "";
        if(!window.jQuery){
            jses += '<script src="assets/altogether/js/jquery-2.0.3.min.js"><\/script>';
        }
        jses += '<script src="assets/ace/js/bootstrap.min.js"><\/script>';
        jses += '<script src="js/com/config.js"><\/script>';
        jses += '<script src="js/com/server.js"><\/script>';
        jses += '<script src="js/com/api.js"><\/script>';
        jses += '<script src="js/login.js"><\/script>';
        document.write(jses);
    </script>
</body>
</html>
```

**登录流程**:
1. 用户输入 `userId`、`password`、验证码
2. `js/login.js` 处理登录逻辑
3. 调用 `api.common.login` 接口验证身份
4. 成功后设置 Cookie（`authentication`、`loginTime`）
5. 跳转到 `index.html` 主框架

### 2. 主框架初始化 (`index.html`)

```javascript
// index.html <head> 部分动态脚本
$(function() {
    // 1. 初始化核心组件
    Api().init('js/api/');          // 加载所有 API 定义
    Validator().init();             // 初始化表单验证
    Printer().init();               // 初始化打印组件
    Constant().init();              // 初始化常量
    Condition.init('js/condition/');// 加载查询条件组件

    // 2. 从 Cookie 读取认证信息
    params.authentication = window.authentication;
    params.loginTime = window.loginTime;

    // 3. 获取当前用户信息
    com.post(api.personel.queryUserForSelfByUserId, {}, function(res) {
        params.userInfo = res.userInfo;
        // 权限验证
        if ((res.userInfo.user.extranet & 16) != 16) {
            alert('无使用该平台权限');
            nwRestart();
        }
        // 显示用户信息
        $(".user-name").text(res.userInfo.user.currentName);
        com.showImg($("#userImg"), res.userInfo.user.userPhoto, 30, 30, '');
    });

    // 4. 加载动态菜单
    com.post(api.system.queryModuleForLogin, {
        "module.system": 1
    }, createMenu);

    // 5. 绑定全局事件
    $("#logout").on("click", logout);
    $(".nav-search .nav-search-input").keyup(searchMenu);
});

// 菜单创建函数
function createMenu(res) {
    $.each(res.modules, function(i, module) {
        // 根据权限动态生成菜单项
        var menuItem = $('<li>').append(
            $('<a>').attr('href', module.url).text(module.name)
        );
        $('#menu-container').append(menuItem);
    });
}
```

**主框架生命周期**:
1. **加载阶段**: 解析 Cookie → 加载核心组件 → 初始化 API
2. **认证阶段**: 验证登录状态 → 获取用户信息 → 权限校验
3. **渲染阶段**: 动态生成菜单 → 加载首页内容
4. **运行阶段**: 监听用户操作 → 页面切换 → 数据交互

### 3. 页面切换机制

```javascript
// 点击菜单项触发页面切换
$('a[href]').on('click', function(e) {
    var $this = $(this);
    var url = $this.attr('href');

    // 防止默认跳转
    e.preventDefault();

    // 切换页面内容
    com.loadPage(url, $this);

    // 更新面包屑导航
    $.breadcrumb($this.attr('icon'), [$this.attr('menuText')]);

    // 折叠菜单
    foldMenu();

    return false;
});
```

---

## 核心架构

### 1. `com` 对象 - 核心方法库

`com` 对象是整个前端框架的核心，封装了所有通用功能。

**文件**: `js/com/core.js`

#### 主要方法分类

##### (1) API 请求

```javascript
/**
 * POST 请求统一入口
 * @param {Object} api - API 对象（包含 url、validate 等）
 * @param {Object} options - 请求参数
 * @param {Function} callback - 成功回调
 * @param {Function} failCallback - 失败回调
 * @param {Boolean} asyncFlag - 是否异步
 */
com.post(api, options, callback, failCallback, asyncFlag)

// 示例：查询订单列表
com.post(api.decoration.pageDecorationByCondition, {
    "condition.status": 1,
    "page.pageNo": 1,
    "page.pageSize": 20
}, function(res) {
    console.log('订单列表:', res.decorations);
});
```

**核心特性**:
- ✅ 自动添加 `authentication` 认证参数
- ✅ 防重复提交（默认5秒内防重）
- ✅ 登录超时检测（默认120分钟）
- ✅ 锁屏拦截
- ✅ 请求缓存支持
- ✅ Demo 模式支持（返回 Mock 数据）
- ✅ 多服务器配置（server、media、library）

##### (2) 页面操作

```javascript
// 加载页面到主内容区
com.loadPage(url, $element)

// 切换页面（带历史记录）
com.switchPage(url, flag)

// 刷新当前页面
com.refreshPage()

// 关闭弹窗
com.closePopup()
```

##### (3) UI 组件

```javascript
// 显示提示信息
com.showAlert(level, message)
// level: com.info / com.warning / com.error

// 确认对话框
com.confirm(message, callback)

// 显示图片（自动添加服务器前缀）
com.showImg($element, imgPath, width, height, defaultImg)

// 显示加载动画
com.showLoading()
com.hideLoading()
```

##### (4) 数据处理

```javascript
// 格式化日期
com.formatDate(timestamp, format)
// format: 'yyyy-MM-dd HH:mm:ss'

// 格式化金额
com.formatMoney(amount, precision)

// 枚举值转换
com.getEnumText(enumArray, key)

// 数据绑定
com.bindData($element, data)
```

##### (5) 表单操作

```javascript
// 收集表单数据
com.getFormData($form)

// 重置表单
com.resetForm($form)

// 设置表单值
com.setFormData($form, data)

// 验证表单
com.validateForm($form)
```

##### (6) Cookie 操作

```javascript
com.setCookie(name, value, days)
com.getCookie(name)
com.deleteCookie(name)
```

### 2. `utils` 对象 - 工具函数库

**文件**: `js/com/utils.js`

#### 精确数学计算

```javascript
// 避免 JavaScript 浮点数精度问题
utils.accAdd(0.1, 0.2)      // 返回 0.3（而非 0.30000000000000004）
utils.accSub(1.5, 1.2)      // 返回 0.3
utils.accMul(0.55, 100)     // 返回 55
utils.accDiv(1, 3)          // 返回 0.333...
```

#### 其他工具方法

```javascript
// 对象扩展（处理时间戳）
utils.accExtend(obj, ['createTime', 'updateTime'])

// 数组去重
utils.unique(array)

// 深拷贝
utils.deepClone(obj)
```

### 3. `Api()` 组件 - API 管理器

**文件**: `js/com/api.js`

#### 初始化流程

```javascript
var Api = function(){
    var fillApi = function(url) {
        // 支持加密模式（.bin 文件）
        if (parent.window.isPC && parent.window.isEncryption) {
            url = url.substring(0, url.lastIndexOf('.')) + '.bin';
            require('nw.gui').Window.get().evalNWBin(null, url);
        } else {
            $.ajax({
                url: url,
                cache: false,
                type: 'get',
                dataType: 'script',
                async: false
            });
        }
    };

    return {
        init: function(path){
            // 依次加载各模块的 API 定义
            fillApi(path + 'approval.js');
            fillApi(path + 'balance.js');
            fillApi(path + 'common.js');
            fillApi(path + 'construction.js');
            fillApi(path + 'decoration.js');
            fillApi(path + 'quotation.js');
            fillApi(path + 'system.js');
            // ... 加载所有模块（共25+个）
        }
    }
};
```

#### API 定义格式

**文件**: `js/api/decoration.js`

```javascript
// 页面路由定义
$.extend(api.index, {
    decorationIndex: {
        url: "/views/decoration/decoration.html"
    },
    decorationDetailIndex: {
        url: "/views/decoration/decoration4detail.html"
    }
});

// 后端接口定义
$.extend(api, {
    decoration: {
        // 查询接口
        pageDecorationByCondition: {
            url: "pageDecorationByCondition.do",
            demo: true  // 支持 Demo 模式
        },

        // 新增接口（带参数验证）
        addDecoration: {
            url: "addDecoration.do",
            validate: {
                "decoration.customerId": { required: true },
                "decoration.houseId": { required: true }
            }
        },

        // 多服务器接口
        uploadImage: {
            url: "uploadImage.do",
            server: "media"  // 使用 config.media 服务器
        },

        // 缓存接口
        queryConstant: {
            url: "queryConstant.do",
            cache: "constantData"  // 结果缓存到 params.constantData
        },

        // 防重复提交拦截
        submitOrder: {
            url: "submitOrder.do",
            intercept: false  // 不拦截重复请求
        }
    }
});
```

### 4. `Validator()` 组件 - 表单验证

**文件**: `js/com/validator.js`

```javascript
// 初始化验证组件
Validator().init();

// 表单验证示例
<form id="myForm">
    <input type="text" name="userId" data-validate="required,minLength:3"
           data-msg-required="请输入用户ID" data-msg-minLength="至少3个字符">
    <input type="email" name="email" data-validate="required,email">
    <input type="number" name="age" data-validate="range:18:60">
</form>

// JavaScript 验证
if (com.validateForm($('#myForm'))) {
    // 验证通过，提交表单
    var formData = com.getFormData($('#myForm'));
    com.post(api.xxx, formData, callback);
}
```

### 5. `Condition()` 组件 - 查询条件管理

**文件**: `js/com/condition.js`

查询条件组件用于统一管理列表页的查询条件。

#### 定义查询条件

**文件**: `js/condition/decoration.js`

```javascript
Condition.decoration = {
    // 订单状态
    status: function($element, callback) {
        com.post(api.ds.queryFip, {}, function(res) {
            var html = '<option value="">全部</option>';
            $.each(res.orderStatus, function(i, item) {
                html += '<option value="' + item.key + '">' + item.value + '</option>';
            });
            $element.html(html);
            if (callback) callback();
        });
    },

    // 所属公司
    company: function($element, callback) {
        com.post(api.system.queryCompanyForOption, {}, function(res) {
            var html = '<option value="">全部</option>';
            $.each(res.companies, function(i, item) {
                html += '<option value="' + item.cid + '">' + item.name + '</option>';
            });
            $element.html(html);
            if (callback) callback();
        });
    }
};
```

#### 使用查询条件

```javascript
// HTML
<select id="statusSelect" data-condition="decoration.status"></select>
<select id="companySelect" data-condition="decoration.company"></select>

// JavaScript - 自动加载
$('[data-condition]').each(function() {
    var $this = $(this);
    var condition = $this.data('condition');
    var parts = condition.split('.');

    // 调用 Condition.decoration.status($element)
    Condition[parts[0]][parts[1]]($this);
});
```

### 6. `Printer()` 组件 - 打印管理

**文件**: `js/com/printer.js`

```javascript
// 初始化打印组件
Printer().init();

// 打印当前页面
Printer().print();

// 打印指定元素
Printer().printElement($('#printArea'));

// 打印 PDF
Printer().printPDF(url);
```

### 7. 业务工具类

位于 `js/utils/` 目录，每个业务模块有独立的工具类。

#### 示例: `decorationUtils.js`

```javascript
var decorationUtils = {
    /**
     * 计算订单总额
     */
    calculateTotal: function(decoration) {
        var total = 0;
        total += decoration.basePrice || 0;
        total += decoration.addPrice || 0;
        total -= decoration.discountPrice || 0;
        return total;
    },

    /**
     * 获取订单状态文本
     */
    getStatusText: function(status) {
        var statusMap = {
            0: '初始',
            1: '已签约',
            2: '施工中',
            3: '已完工',
            4: '已决算'
        };
        return statusMap[status] || '未知';
    },

    /**
     * 格式化订单编号
     */
    formatOrderNo: function(orderNo) {
        return 'FL-' + orderNo;
    }
};
```

---

## 模块化组织

### 模块结构

每个业务模块包含以下部分：

```
[模块名]/
├── js/[模块名]/           # 页面脚本
│   ├── [模块名].js        # 列表页
│   ├── [模块名]2create.js # 创建页
│   ├── [模块名]4detail.js # 详情页
│   └── ...
├── js/api/[模块名].js     # API 定义
├── js/condition/[模块名].js # 查询条件
├── js/utils/[模块名]Utils.js # 工具方法
├── views/[模块名]/        # HTML 页面
│   ├── [模块名].html      # 列表页
│   ├── [模块名]2create.html # 创建页
│   ├── [模块名]4detail.html # 详情页
│   └── ...
└── ds/[模块名].json       # 数据字典
```

### 示例: `decoration` 模块

```
decoration/
├── js/decoration/
│   ├── decoration.js                  # 订单列表页
│   ├── decoration2create.js           # 创建订单页
│   ├── decoration4detail.js           # 订单详情页
│   ├── decoration4belong.js           # 归属查询页
│   ├── decoration4activity.js         # 活动订单页
│   ├── decorationContract.js          # 合同管理页
│   ├── decorationContract2create.js   # 创建合同页
│   ├── decorationPicture.js           # 图片管理页
│   ├── decorationService.js           # 服务管理页
│   ├── decorationMeasure.js           # 测量管理页
│   ├── backVisit.js                   # 回访记录页
│   └── ...（共24个JS文件）
├── js/api/decoration.js               # API 定义
├── js/condition/decoration.js         # 查询条件
├── js/utils/decorationUtils.js        # 工具方法
├── views/decoration/                  # HTML 页面（对应JS）
└── ds/decoration.json                 # 数据字典
```

---

## 路由与导航

### 1. 导航数据源 (`ds/*.json`)

导航配置存储在 `ds/` 目录的 JSON 文件中。

#### 示例: `ds/customer.json`

```json
{
  "customerSourceStatus":[
    {"key":"0","value":"初始"},
    {"key":"1","value":"初审"},
    {"key":"2","value":"提交"},
    {"key":"3","value":"确认"},
    {"key":"4","value":"审批"},
    {"key":"5","value":"绑定"},
    {"key":"6","value":"拒绝"}
  ],
  "revisitType":[
    {"key":"0","value":"保修"},
    {"key":"1","value":"投诉"}
  ],
  "complainLevel":[
    {"key":"0","value":"标准"},
    {"key":"1","value":"重大"},
    {"key":"2","value":"危机"}
  ]
}
```

### 2. 菜单生成机制

**后端返回菜单结构**:

```javascript
{
  "modules": [
    {
      "mid": "decoration",
      "name": "装饰订单",
      "icon": "icon-list",
      "url": "/views/decoration/decoration.html",
      "children": [
        {
          "mid": "decorationList",
          "name": "订单列表",
          "url": "/views/decoration/decoration.html"
        },
        {
          "mid": "decorationCreate",
          "name": "创建订单",
          "url": "/views/decoration/decoration2create.html"
        }
      ]
    }
  ]
}
```

**前端动态生成**:

```javascript
function createMenu(res) {
    var menuHtml = '';

    $.each(res.modules, function(i, module) {
        menuHtml += '<li class="hover">';
        menuHtml += '  <a href="#" class="dropdown-toggle">';
        menuHtml += '    <i class="' + module.icon + '"></i>';
        menuHtml += '    <span class="menu-text">' + module.name + '</span>';
        menuHtml += '    <b class="arrow icon-angle-down"></b>';
        menuHtml += '  </a>';
        menuHtml += '  <ul class="submenu">';

        $.each(module.children, function(j, child) {
            menuHtml += '<li>';
            menuHtml += '  <a href="' + child.url + '" mid="' + child.mid + '" menuText="' + child.name + '">';
            menuHtml += '    <i class="icon-double-angle-right"></i>';
            menuHtml += '    ' + child.name;
            menuHtml += '  </a>';
            menuHtml += '</li>';
        });

        menuHtml += '  </ul>';
        menuHtml += '</li>';
    });

    $('#menu-container').html(menuHtml);

    // 绑定点击事件
    bindMenuClick();
}
```

### 3. 面包屑导航

```javascript
// 自定义面包屑插件
$.breadcrumb = function(icon, items) {
    var html = '<li><i class="' + icon + '"></i></li>';
    $.each(items, function(i, item) {
        html += '<li>' + item + '</li>';
    });
    $('.breadcrumb').html(html);
};

// 使用
$.breadcrumb('icon-list', ['装饰订单', '订单列表']);
```

---

## API 调用规范

### 1. 标准调用流程

```javascript
// 1. 定义 API（js/api/xxx.js）
$.extend(api, {
    decoration: {
        addDecoration: {
            url: "addDecoration.do",
            validate: {
                "decoration.customerId": { required: true },
                "decoration.houseId": { required: true }
            }
        }
    }
});

// 2. 调用 API（js/decoration/decoration2create.js）
$('#submitBtn').on('click', function() {
    // 收集表单数据
    var formData = com.getFormData($('#decorationForm'));

    // 调用接口
    com.post(api.decoration.addDecoration, formData, function(res) {
        if (res.errorCode == 0) {
            com.showAlert(com.info, '订单创建成功');
            com.switchPage(api.index.decorationIndex.url);
        } else {
            com.showAlert(com.error, res.errorMsg);
        }
    }, function(res) {
        com.showAlert(com.error, '请求失败: ' + res.errorMsg);
    });
});
```

### 2. 分页查询

```javascript
// 初始化分页组件
var page = {
    pageNo: 1,
    pageSize: 20,
    total: 0
};

// 查询函数
function loadList() {
    com.post(api.decoration.pageDecorationByCondition, {
        "condition.status": $('#statusSelect').val(),
        "condition.keyword": $('#keyword').val(),
        "page.pageNo": page.pageNo,
        "page.pageSize": page.pageSize
    }, function(res) {
        // 渲染列表
        renderList(res.decorations);

        // 更新分页
        page.total = res.page.total;
        renderPagination();
    });
}

// 分页组件点击
$('#pagination').on('click', 'a', function() {
    page.pageNo = $(this).data('page');
    loadList();
});
```

### 3. 文件上传

```javascript
// 文件上传配置
$('#fileUpload').huploadify({
    auto: true,
    fileTypeExts: '*.jpg;*.png;*.pdf',
    multi: true,
    uploader: config.server + 'uploadFile.do',
    onUploadSuccess: function(file, data, response) {
        var res = JSON.parse(data);
        if (res.errorCode == 0) {
            // 显示已上传文件
            appendFileItem(res.fileInfo);
        }
    }
});
```

### 4. 导出功能

```javascript
// 导出 Excel
$('#exportBtn').on('click', function() {
    var params = {
        "condition.status": $('#statusSelect').val(),
        "condition.startTime": $('#startTime').val(),
        "condition.endTime": $('#endTime').val()
    };

    // 构建导出 URL
    var url = config.server + 'exportDecorationList.do?';
    url += $.param(params);
    url += '&authentication=' + window.authentication;

    // 下载文件
    window.location.href = url;
});
```

---

## 开发指南

### 1. 创建新模块

#### Step 1: 创建目录结构

```bash
# 创建视图目录
mkdir WebContent/views/newmodule

# 创建脚本目录
mkdir WebContent/js/newmodule
```

#### Step 2: 定义 API

**文件**: `WebContent/js/api/newmodule.js`

```javascript
// 页面路由
$.extend(api.index, {
    newmoduleIndex: {
        url: "/views/newmodule/newmodule.html"
    },
    newmoduleDetailIndex: {
        url: "/views/newmodule/newmodule4detail.html"
    }
});

// 后端接口
$.extend(api, {
    newmodule: {
        pageNewmoduleByCondition: {
            url: "pageNewmoduleByCondition.do"
        },
        addNewmodule: {
            url: "addNewmodule.do",
            validate: {
                "newmodule.name": { required: true }
            }
        },
        updateNewmodule: {
            url: "updateNewmodule.do"
        },
        deleteNewmodule: {
            url: "deleteNewmodule.do"
        }
    }
});
```

#### Step 3: 注册 API

**文件**: `WebContent/js/com/api.js`

```javascript
var Api = function(){
    return {
        init: function(path){
            // ... 其他模块
            fillApi(path + 'newmodule.js');  // 添加这一行
        }
    }
};
```

#### Step 4: 创建查询条件（可选）

**文件**: `WebContent/js/condition/newmodule.js`

```javascript
Condition.newmodule = {
    status: function($element, callback) {
        var html = '<option value="">全部</option>';
        html += '<option value="0">启用</option>';
        html += '<option value="1">禁用</option>';
        $element.html(html);
        if (callback) callback();
    }
};
```

#### Step 5: 创建列表页

**文件**: `WebContent/views/newmodule/newmodule.html`

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>新模块列表</title>
</head>
<body>
    <div class="page-header">
        <h1>新模块列表</h1>
    </div>

    <!-- 查询条件 -->
    <div class="row search-row">
        <div class="col-xs-12">
            <div class="form-inline">
                <label>状态:</label>
                <select id="statusSelect" data-condition="newmodule.status"></select>

                <label>关键词:</label>
                <input type="text" id="keyword" placeholder="请输入关键词">

                <button id="searchBtn" class="btn btn-sm btn-primary">
                    <i class="icon-search"></i> 查询
                </button>

                <button id="createBtn" class="btn btn-sm btn-success">
                    <i class="icon-plus"></i> 创建
                </button>
            </div>
        </div>
    </div>

    <!-- 列表表格 -->
    <div class="row">
        <div class="col-xs-12">
            <table id="dataTable" class="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>名称</th>
                        <th>状态</th>
                        <th>创建时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody id="dataBody"></tbody>
            </table>
        </div>
    </div>

    <!-- 分页 -->
    <div class="row">
        <div class="col-xs-12">
            <div id="pagination"></div>
        </div>
    </div>
</body>
</html>
```

**文件**: `WebContent/js/newmodule/newmodule.js`

```javascript
$(function() {
    // 初始化分页
    var page = {
        pageNo: 1,
        pageSize: 20,
        total: 0
    };

    // 加载列表
    function loadList() {
        com.post(api.newmodule.pageNewmoduleByCondition, {
            "condition.status": $('#statusSelect').val(),
            "condition.keyword": $('#keyword').val(),
            "page.pageNo": page.pageNo,
            "page.pageSize": page.pageSize
        }, function(res) {
            renderList(res.newmodules);
            page.total = res.page.total;
            renderPagination();
        });
    }

    // 渲染列表
    function renderList(list) {
        var html = '';
        $.each(list, function(i, item) {
            html += '<tr>';
            html += '<td>' + item.id + '</td>';
            html += '<td>' + item.name + '</td>';
            html += '<td>' + (item.status == 0 ? '启用' : '禁用') + '</td>';
            html += '<td>' + com.formatDate(item.createTime) + '</td>';
            html += '<td>';
            html += '  <button class="btn btn-xs btn-info viewBtn" data-id="' + item.id + '">查看</button>';
            html += '  <button class="btn btn-xs btn-warning editBtn" data-id="' + item.id + '">编辑</button>';
            html += '  <button class="btn btn-xs btn-danger deleteBtn" data-id="' + item.id + '">删除</button>';
            html += '</td>';
            html += '</tr>';
        });
        $('#dataBody').html(html);
    }

    // 渲染分页
    function renderPagination() {
        var totalPage = Math.ceil(page.total / page.pageSize);
        var html = '';
        for (var i = 1; i <= totalPage; i++) {
            html += '<a href="#" data-page="' + i + '">' + i + '</a>';
        }
        $('#pagination').html(html);
    }

    // 绑定事件
    $('#searchBtn').on('click', function() {
        page.pageNo = 1;
        loadList();
    });

    $('#createBtn').on('click', function() {
        com.switchPage(api.index.newmoduleDetailIndex.url);
    });

    $('#dataBody').on('click', '.viewBtn', function() {
        var id = $(this).data('id');
        com.switchPage(api.index.newmoduleDetailIndex.url + '?id=' + id);
    });

    $('#dataBody').on('click', '.deleteBtn', function() {
        var id = $(this).data('id');
        com.confirm('确认删除?', function() {
            com.post(api.newmodule.deleteNewmodule, {
                "newmodule.id": id
            }, function(res) {
                com.showAlert(com.info, '删除成功');
                loadList();
            });
        });
    });

    $('#pagination').on('click', 'a', function() {
        page.pageNo = $(this).data('page');
        loadList();
        return false;
    });

    // 初始化加载
    loadList();
});
```

### 2. 常用代码片段

#### (1) 日期选择器

```javascript
$('#startDate').datepicker(com.datepickerdefault);
```

#### (2) 下拉框（Chosen）

```javascript
$('#selectBox').chosen({
    allow_single_deselect: true,
    width: '200px'
});
```

#### (3) 数据表格

```javascript
$('#dataTable').DataTable({
    ordering: false,
    searching: false,
    lengthChange: false,
    info: false
});
```

#### (4) 图片预览

```javascript
$('.img-preview').colorbox({
    rel: 'img-preview',
    maxWidth: '80%',
    maxHeight: '80%'
});
```

#### (5) ECharts 图表

```javascript
var chart = echarts.init(document.getElementById('chart'));
chart.setOption({
    title: { text: '订单统计' },
    xAxis: { data: ['1月', '2月', '3月'] },
    yAxis: {},
    series: [{
        name: '订单量',
        type: 'bar',
        data: [10, 20, 30]
    }]
});
```

### 3. 调试技巧

#### (1) 查看 API 请求

```javascript
// 在 console 中查看所有 API 定义
console.log(api);

// 查看当前用户信息
console.log(params.userInfo);

// 查看全局配置
console.log(config);
```

#### (2) 模拟 API 响应

在 `result/` 目录创建 Mock 数据文件:

**文件**: `result/pageDecorationByCondition.json`

```json
{
  "errorCode": 0,
  "errorMsg": "",
  "decorations": [
    {
      "id": 1,
      "orderNo": "2024010001",
      "customerName": "张三",
      "status": 1
    }
  ],
  "page": {
    "pageNo": 1,
    "pageSize": 20,
    "total": 1
  }
}
```

启用 Demo 模式:

```javascript
// js/com/config.js
config.demo = true;
```

#### (3) 断点调试

```javascript
// 在关键位置添加断点
com.post(api.xxx, params, function(res) {
    debugger;  // 在此处暂停
    console.log(res);
});
```

### 4. 性能优化建议

#### (1) API 请求优化

```javascript
// ✅ 使用缓存
api.system.queryConstant: {
    url: "queryConstant.do",
    cache: "constantData"  // 结果缓存
}

// ✅ 批量请求
com.post(api.xxx.batchQuery, {
    ids: [1, 2, 3, 4, 5]
}, callback);

// ❌ 避免在循环中请求
$.each(list, function(i, item) {
    com.post(api.xxx.query, { id: item.id }, callback);  // 不推荐
});
```

#### (2) DOM 操作优化

```javascript
// ✅ 批量操作
var html = '';
$.each(list, function(i, item) {
    html += '<tr>...</tr>';
});
$('#tbody').html(html);

// ❌ 避免逐条操作
$.each(list, function(i, item) {
    $('#tbody').append('<tr>...</tr>');  // 不推荐
});
```

#### (3) 事件绑定优化

```javascript
// ✅ 事件委托
$('#tbody').on('click', '.deleteBtn', function() {
    // ...
});

// ❌ 避免直接绑定
$('.deleteBtn').on('click', function() {
    // ...
});
```

---

## 配置文件

### 1. 全局配置 (`js/com/config.js`)

```javascript
var config = {
    intranet: false,              // 是否内网模式
    versionCode: "",              // 版本号
    system: 1,                    // 系统类型
    timeout: 120,                 // 登录超时时间（分钟）
    spacing: 5,                   // API 防重复间隔（秒）
    uploadTimeout: 30,            // 上传超时（秒）

    // 服务器配置
    communion: '',                // 公共服务地址
    server: '',                   // 主服务器地址
    media: '',                    // 媒体服务器地址
    library: '',                  // 资源库地址
    store: '',                    // 商城地址

    // UI 配置
    iconImg: './images/icon_fanglin.png',
    backgroundImg: './images/bg_fanglin.jpg',
    shakingColor: '#197bb5'
};
```

### 2. 服务器配置 (`js/com/server.js`)

```javascript
$(function(){
    config.intranet = true;
    config.name = '方林信息平台';
    config.ename = 'Fanglin Information Platform';

    // 根据环境自动切换服务器
    if(!location.hostname.startsWith('192.168')){
        // 外网环境
        config.server = '';
        config.media = '';
    } else {
        // 内网环境
        config.library = 'http://192.168.5.22/';
        config.communion = 'http://192.168.5.21/';
        config.server = 'http://192.168.5.21/';
        config.media = 'http://192.168.5.21/';
    }
});
```

---

## 常见问题

### Q1: 如何添加新菜单？

**A**: 菜单由后端动态返回，需要在数据库中配置菜单权限。前端会自动根据用户权限生成菜单。

### Q2: 如何处理图片路径？

**A**: 使用 `com.showImg()` 方法，会自动添加服务器前缀：

```javascript
com.showImg($('#img'), 'upload/2024/01/photo.jpg', 100, 100, '');
// 实际路径: http://192.168.5.21/upload/2024/01/photo.jpg
```

### Q3: 如何实现打印功能？

**A**: 使用 `Printer()` 组件：

```javascript
// 打印指定区域
Printer().printElement($('#printArea'));
```

### Q4: 如何处理大数据量导出？

**A**: 使用后端流式导出，前端构建下载链接：

```javascript
var url = config.server + 'exportLargeData.do?';
url += $.param(params);
url += '&authentication=' + window.authentication;
window.location.href = url;
```

### Q5: 如何集成新的第三方库？

**A**:
1. 将库文件放到 `assets/altogether/js/`
2. 在 `index.html` 中动态加载：

```javascript
jses += '<script src="assets/altogether/js/newlib.min.js"><\/script>';
```

---

## 附录

### A. 核心组件清单

| 组件 | 文件 | 说明 |
|------|------|------|
| `com` | `js/com/core.js` | 核心方法库 |
| `utils` | `js/com/utils.js` | 工具函数 |
| `Api()` | `js/com/api.js` | API 管理器 |
| `Validator()` | `js/com/validator.js` | 表单验证 |
| `Printer()` | `js/com/printer.js` | 打印组件 |
| `Condition` | `js/com/condition.js` | 查询条件 |
| `Constant()` | `js/com/constant.js` | 常量管理 |
| `Exporter()` | `js/com/exporter.js` | 导出组件 |
| `Reporter()` | `js/com/reporter.js` | 报表组件 |
| `Searcher()` | `js/com/searcher.js` | 搜索组件 |

### B. 第三方库版本

| 库名 | 版本 | CDN/本地 |
|------|------|---------|
| jQuery | 2.0.3 | 本地 |
| Bootstrap | 3.x | 本地 |
| LayUI | - | 本地 |
| ECharts | - | 本地 |
| Moment.js | - | 本地 |
| FullCalendar | - | 本地 |

### C. 浏览器兼容性

| 浏览器 | 最低版本 | 说明 |
|--------|---------|------|
| Chrome | 50+ | 推荐 |
| Firefox | 45+ | 支持 |
| Safari | 10+ | 支持 |
| IE | 11+ | 部分支持（不推荐） |
| Edge | 14+ | 支持 |

---

## 更新日志

### 2025-12-02
- ✅ 初始化前端架构文档
- ✅ 完成核心组件分析
- ✅ 完成模块化组织梳理
- ✅ 完成 API 调用规范文档
- ✅ 完成开发指南编写

---

## 相关文档

- [后端架构文档](../CLAUDE.md)
- [数据库设计文档](../db/README.md)
- [部署运维文档](../deploy/README.md)
- [API 接口文档](../docs/API.md)

---

**维护者**: AI 自动生成 & 人工审核
**联系方式**: 参考根目录 CLAUDE.md
