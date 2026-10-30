/**
 * app/js/index.js —— 主框架外壳逻辑
 *
 * 职责：
 *   1. 认证校验：无 authentication → 跳 login.html
 *   2. 加载核心运行时（api 校验器等）
 *   3. 拉用户信息 queryUserForSelfByUserId → 显示用户名
 *   4. 拉菜单 queryModuleForLogin({"module.system":1}) → 渲染 layui-nav 树
 *   5. 菜单点击 → app.openTab 打开业务页（iframe）
 *   6. 默认打开首页 home.html
 *
 * 菜单数据结构（后端 queryModuleForLogin 返回，与旧 index.js createMenu 一致）：
 *   { modules: [{ mid, name, level, order, module, url, icon, children:[...] }] }
 *   level=1 一级，level=2 二级，url 为页面路由（api.index.xxx.url 或直接 views/xxx.html）。
 */
layui.use(['element', 'layer', 'jquery'], function () {
    var element = layui.element;
    var layer = layui.layer;
    var $ = layui.jquery;
    var cfg = app.config;

    // ========== 认证校验（同步，无需等模块） ==========
    var auth = app.cookie.get('authentication');
    if (!auth) { location.href = 'login.html'; return; }

    // ========== 核心运行时就绪后再拉数据 ==========
    app.ready(function () {

    // ========== 拉用户信息 ==========
    app.post({
        url: 'queryUserForSelfByUserId.do'
    }, {}, function (res) {
        app.params.userInfo = res.userInfo;
        var user = res.userInfo && res.userInfo.user;
        if (!user) { location.href = 'login.html'; return; }
        $('#userName').text(user.currentName || user.userId);

        // 外网时按用户拉服务器地址（对齐旧 index.js queryServer）
        if (!cfg.intranet) {
            app.post({ url: 'queryServer.do' }, { 'user.userId': user.userId }, function (r) {
                if (r.servers) {
                    $.each(r.servers, function (i, v) { cfg[v.name] = v.host; });
                }
            }, null, false);
        }
        loadMenu();
    }, function () {
        // 失败（含未登录）→ 跳登录
        location.href = 'login.html';
    });

    // ========== 加载菜单 ==========
    function loadMenu() {
        app.post({ url: 'queryModuleForLogin.do' }, { 'module.system': cfg.system }, function (res) {
            renderMenu(res.modules || []);
            // 默认打开首页
            app.openTab('home.html', '首页', 'home');
            element.render('nav');
        });
    }

    /**
     * 渲染左侧菜单树（layui-nav 二级结构）。
     * 后端返回平铺的 modules（含 level），按 level 分组组装父子。
     */
    // 后端无图标时的默认 layui 图标（按 module 关键字猜，猜不中用通用图标）
    var DEFAULT_ICONS = {
        decoration: 'layui-icon-list', quotation: 'layui-icon-template-1', construction: 'layui-icon-build',
        customer: 'layui-icon-username', balance: 'layui-icon-rmb', payment: 'layui-icon-rmb',
        material: 'layui-icon-cols', sales: 'layui-icon-cart', personel: 'layui-icon-friends',
        personnel: 'layui-icon-friends', system: 'layui-icon-set', approval: 'layui-icon-vercode',
        information: 'layui-icon-notice', data: 'layui-icon-table', report: 'layui-icon-chart',
        salary: 'layui-icon-rmb', store: 'layui-icon-cart', market: 'layui-icon-flag',
        building: 'layui-icon-location', log: 'layui-icon-log', manifest: 'layui-icon-list',
        production: 'layui-icon-util', contract: 'layui-icon-file-b'
    };
    function pickIcon(m) {
        if (m.icon && m.icon.indexOf('icon-') > -1) {
            // 旧 ace 图标类（icon-xxx）→ 用通用 layui 图标兜底（ace 字体在新前端不存在）
            return DEFAULT_ICONS[m.module] || 'layui-icon-app';
        }
        if (m.icon && m.icon.indexOf('layui-icon') > -1) return m.icon;
        return DEFAULT_ICONS[m.module] || 'layui-icon-app';
    }

    function renderMenu(list) {
        // 后端返回扁平列表，按 level 分组（与旧 index.js menuArr 一致）
        var menuArr = { level1: [], level2: [], level3: [] };
        $.each(list, function (i, v) {
            // level3 有 access==1 的跳过（与旧逻辑一致）
            if ((v.level || 1) == 3 && v.access == 1) return;
            var arr = menuArr['level' + (v.level || 1)];
            if (arr) arr.push(v);
        });
        // 各层按 order 排序
        $.each(menuArr, function (k, val) {
            val.sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
        });

        // 一级：生成顶层 li
        var menuObj = { level1: {}, level2: {} }; // mid → $li 索引，供子层挂载
        var $tree = $('#menuTree');
        $tree.empty();

        $.each(menuArr.level1, function (i, v) {
            var $li = $('<li class="layui-nav-item"></li>').attr('data-mid', v.mid);
            var $a = $('<a href="javascript:;"></a>').attr({ 'data-mid': v.mid, 'data-module': v.module || '' });
            $a.append('<span class="app-menu-icon"><i class="layui-icon ' + pickIcon(v) + '"></i></span>');
            $a.append($('<cite></cite>').text(v.name || ''));
            $li.append($a);
            $tree.append($li);
            menuObj.level1[v.mid] = $li;
        });

        // 二级：挂到一级下（用 fatherModule.mid 关联，非 children 字段）
        $.each(menuArr.level2, function (i, v) {
            var parentMid = v.fatherModule && v.fatherModule.mid;
            var $parent = menuObj.level1[parentMid];
            if (!$parent) return; // 父级不存在则跳过

            // 父级若无子菜单容器，则加展开箭头
            if (!$parent.children('.layui-nav-child').length) {
                $parent.children('a').append('<span class="layui-nav-more"></span>');
                $parent.append('<dl class="layui-nav-child"></dl>');
            }
            var $dd = $('<dd></dd>');
            var $a = $('<a href="javascript:;"></a>').attr({ 'data-mid': v.mid, 'data-module': v.module || '' });
            $a.append('<i class="app-menu-dot"></i>').append($('<cite></cite>').text(v.name || ''));
            $dd.append($a);
            $parent.children('.layui-nav-child').append($dd);
            menuObj.level2[v.mid] = $dd;
        });

        // 三级：挂到二级下（同样用 fatherModule.mid）
        $.each(menuArr.level3, function (i, v) {
            var parentMid = v.fatherModule && v.fatherModule.mid;
            var $parent = menuObj.level2[parentMid];
            if (!$parent) return;
            // 二级若要承载三级，转换为可展开（加箭头 + 子容器）
            if (!$parent.children('.layui-nav-child').length) {
                $parent.children('a').append('<span class="layui-nav-more"></span>');
                $parent.append('<dl class="layui-nav-child"></dl>');
            }
            var $dd = $('<dd></dd>');
            var $a = $('<a href="javascript:;"></a>').attr({ 'data-mid': v.mid, 'data-module': v.module || '' });
            $a.append('<i class="app-menu-dot"></i>').append($('<cite></cite>').text(v.name || ''));
            $dd.append($a);
            $parent.children('.layui-nav-child').append($dd);
        });

        element.render('nav', 'appMenu');
    }

    // ========== 菜单点击 → 展开/跳转 ==========
    // 逻辑（对齐旧 index.js）：
    //   - 有子菜单（.layui-nav-child 非空）：切换展开（layui element 自动处理）
    //   - 叶子节点（无子菜单）：调 checkModule 接口拿真实 url（不在 DOM 暴露路径），鉴权后开 tab
    // 用事件委托绑定到 #menuTree（renderMenu 渲染前后均可生效）
    $('#menuTree').on('click', 'a', function () {
        var $a = $(this);
        var $li = $a.parent();

        // 有子菜单 → 展开/收起（交给 layui element）
        if ($li.children('.layui-nav-child').length || $li.children('dl').length) {
            // layui nav 会自动切换 layui-nav-itemed，这里无需手动
            return; // 不 return false，让 layui 处理展开
        }

        // 叶子节点 → 取 mid 调 checkModule 获取真实 url
        var mid = $a.attr('data-mid');
        if (!mid || mid === 'null') return false;

        // 标记选中态
        $('#menuTree .layui-this').removeClass('layui-this');
        $li.addClass('layui-this');

        app.post({ url: 'checkModule.do' }, { 'module.mid': mid }, function (res) {
            var module = res.module;
            if (!module || !module.url) {
                app.showAlert(app.warning, '无操作权限');
                return;
            }
            // 解析 url 参数（open=popup/window 等特殊打开方式）
            var url = module.url;
            var hashIdx = url.indexOf('#');
            var queryIdx = url.indexOf('?');
            var params = {};
            var qStr = url.substring(queryIdx > -1 ? queryIdx + 1 : (hashIdx > -1 ? hashIdx + 1 : url.length));
            if (qStr) {
                $.each(qStr.split('&'), function (i, pair) {
                    var kv = pair.split('=');
                    if (kv[0]) params[kv[0]] = decodeURIComponent(kv[1] || '');
                });
            }
            var cleanUrl = url.split('?')[0].split('#')[0];

            if (params.open === 'popup') {
                // 弹窗打开
                layer.open({ type: 2, title: module.name, content: cleanUrl, area: ['80%', '80%'] });
            } else if (params.open === 'window') {
                // 新窗口
                window.open(cleanUrl);
            } else {
                // 默认：tab 打开
                openMenuPage(cleanUrl, module.name || $a.find('cite').text(), mid);
            }
        });
        return false;
    });

    /**
     * 解析 url → 开 tab。
     * url 可能是 api.index 的 key（如 "operationIndex"）或直接路径。
     */
    function openMenuPage(rawUrl, title, mid) {
        if (!rawUrl) return;
        var url = rawUrl;
        if (api.index[url]) url = api.index[url].url;
        if (/^https?:\/\//.test(url)) {
            // 外链原样用
        } else {
            // 去掉前导 /，保证相对 app/ 目录
            url = url.replace(/^\/+/, '');
        }
        if (!url) return;
        app.openTab(url, title, mid);
    }

    // ========== 顶栏事件 ==========
    $('#btnLogout').on('click', function () {
        layer.confirm('确定要退出登录吗？', { icon: 3, title: '退出' }, function (idx) {
            app.logout();
        });
    });

    $('#btnRefresh').on('click', function () {
        loadMenu();
        layer.msg('菜单已刷新', { icon: 1, time: 1000 });
    });

    $('#btnProfile').on('click', function () {
        layer.msg('个人资料页待接入', { icon: 0, time: 1500 });
    });

    // tab 关闭事件
    element.on('tabDelete(appTabs)', function (data) {
        // iframe 由 DOM 移除，无需额外清理
    });

    }); // end app.ready
});
