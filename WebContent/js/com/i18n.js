/**
 * i18n 国际化核心模块
 *
 * 职责:加载语言包(message/page) + 提供翻译 API + DOM 批量替换 + 语言切换
 *
 * 设计要点:
 *  - 零依赖(仅依赖 jQuery,与项目其他 com/* 模块一致)
 *  - 复用 core.js:2553 的"同步 ajax 加载 json"模式,保证调用前就绪
 *  - error 包仍由 core.js 加载(职责分离),本模块只管 message/page
 *  - 语言来源链:见 config.js 顶部 + index.js loadUserPrefers 覆盖
 *
 * API:
 *   i18n.lang              当前语言码(cn/tw/en)
 *   i18n.t(key, args)      翻译,支持 {0}{1} 占位符(与 errorMap 一致);未命中返回 key 原值
 *   i18n.tAuto(text)       反查:中文文案 → 已注册 key 的译文(供 com.show* 透明拦截)
 *   i18n.apply($root)      遍历 [data-i18n] / [data-i18n-ph] 元素批量替换
 *   i18n.setLang(lang, o)  切换语言:重载包 + 全局 apply + 写 localStorage(+ 可选落库)
 *
 * 详见 docs/10-指南手册/I18N_PLAN.md
 */
var i18n = (function($) {

    // ============== 内部状态 ==============
    var messageMap = {};   // msg.* 公共提示(当前语言)
    var messageCn = {};    // msg.* 简体中文基准(恒定,用于 tAuto 反查中文→key)
    var pageMap = {};      // page.* 静态文本(所有模块合并)
    var reverseMap = {};   // 中文文案 → key 的反查表(tAuto 用),基于 messageCn 构建

    var LANG_KEY = 'rhada.lang';

    // ============== 工具函数 ==============

    /**
     * 取当前语言(config.lang 由 config.js 设置,index.js 登录后覆盖)
     */
    function currentLang() {
        return (window.config && config.lang) || 'cn';
    }

    /**
     * 占位符填充:与 errorMap / error.md 一致,使用 {0}{1} 语法
     * 例: fillArgs("还可以尝试{0}次", ["3"]) → "还可以尝试3次"
     */
    function fillArgs(template, args) {
        if (!template || !args || !args.length) return template;
        var s = template;
        for (var i = 0; i < args.length; i++) {
            s = s.split('{' + i + '}').join(args[i]);
        }
        return s;
    }

    /**
     * 同步加载一个语言包 json(失败返回空对象,不阻塞功能)
     * 复用 core.js 加载 error 包的同款模式
     */
    function loadPack(url) {
        var result = {};
        try {
            $.ajax({
                url: url,
                dataType: 'json',
                async: false,
                cache: true,
                success: function(data) { result = data || {}; }
            });
        } catch (e) { /* 文件缺失时静默 fallback */ }
        return result;
    }

    /**
     * 构建/重建反查表:中文文案 → key
     * 基于简体中文基准(messageCn)构建,不随当前语言变化。
     * 这样切到 en 后,tAuto('操作成功') 仍能命中:从 messageCn 反查到 key 'msg.opSuccess',
     * 再查当前语言的 messageMap 返回 'Operation successful'。
     */
    function rebuildReverse() {
        reverseMap = {};
        $.each(messageCn, function(key, val) {
            if (val && typeof val === 'string') reverseMap[val] = key;
        });
    }

    // ============== 对外 API ==============

    return {

        /**
         * 当前语言码(只读属性,实际值随 setLang 变化)
         */
        get lang() { return currentLang(); },

        /**
         * 翻译键 → 文案
         * @param key    i18n 键,如 "msg.opSuccess" / "page.decoration.orderNo"
         * @param args   可选,占位符数组,如 ["3"]
         * @return 命中返回译文(填好占位符);未命中返回 key 原值(保证不空白)
         */
        t: function(key, args) {
            if (!key) return '';
            var val = pageMap[key];
            if (val == null) val = messageMap[key];
            if (val == null && window.com && window.com.errorMap) val = window.com.errorMap[key];   // error 层兜底(数字码 key)
            if (val == null) return key;                 // 全未命中,返回 key 作 fallback
            return fillArgs(val, args);
        },

        /**
         * 反查:直接给中文文案,命中 messageCn 反查表则返回当前语言的译文,否则原样返回
         * 用途:com.show* 透明拦截——大量 com.showAlert(com.info,"操作成功") 无需逐处改写。
         * 工作流:中文文案 → reverseMap(基于 messageCn)→ key → 当前语言 messageMap → 译文
         * @param text 原始中文文案
         * @return 译文(若当前语言需翻译且命中),否则原 text
         */
        tAuto: function(text) {
            if (!text || typeof text !== 'string') return text;
            // 当前是 cn 时,messageMap 存的就是中文,直接返回原文(无需翻译)
            if (currentLang() === 'cn') return text;
            var key = reverseMap[text];
            if (!key) return text;                  // 反查不到,原样返回(可能是业务特定文案)
            return messageMap[key] || text;         // 当前语言译文,理论上一定有
        },

        /**
         * DOM 批量替换:i18n.apply($('body')) 在页面 ready 时调用一次
         *  - [data-i18n="key"]            替换元素文本
         *  - [data-i18n-ph="key"]         替换 placeholder
         *  - [data-i18n-title="key"]      替换 title
         * 语言包未命中时保留元素原文本(HTML 中保留的中文作 fallback)
         */
        apply: function($root) {
            $root = $root || $('body');
            var applied = 0;

            $root.find('[data-i18n]').addBack('[data-i18n]').each(function() {
                var $el = $(this);
                var key = $el.attr('data-i18n');
                var val = (key.indexOf('msg.') === 0) ? messageMap[key] : pageMap[key];
                if (val != null) { $el.html(val); applied++; }
            });

            $root.find('[data-i18n-ph]').addBack('[data-i18n-ph]').each(function() {
                var $el = $(this);
                var key = $el.attr('data-i18n-ph');
                var val = (key.indexOf('msg.') === 0) ? messageMap[key] : pageMap[key];
                if (val != null) { $el.attr('placeholder', val); applied++; }
            });

            $root.find('[data-i18n-title]').addBack('[data-i18n-title]').each(function() {
                var $el = $(this);
                var key = $el.attr('data-i18n-title');
                var val = (key.indexOf('msg.') === 0) ? messageMap[key] : pageMap[key];
                if (val != null) { $el.attr('title', val); applied++; }
            });

            return applied;
        },

        /**
         * 切换语言
         * @param lang  目标语言码(cn/tw/en)
         * @param opts  { persist:true   是否同步落库到 userprefer(默认 true,需登录态)
         *                applyRoot:JQ   apply 的根元素(默认 $('body'),即全局刷新)
         *                onDone:fn      完成回调
         *                silent:false   是否静默(静默不写 localStorage,仅用于"用服务端值覆盖本地"场景) }
         */
        setLang: function(lang, opts) {
            opts = opts || {};
            var support = (window.config && config.supportedLangs) || ['cn', 'tw', 'en'];
            if (support.indexOf(lang) < 0) lang = (window.config && config.defaultLang) || 'cn';

            var changed = (lang !== currentLang());

            // ① 更新当前语言
            config.lang = lang;

            // ② 写 localStorage(除非 silent:登录时用服务端值覆盖,不回写本地)
            if (changed && !opts.silent) {
                try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
            }

            // ③ 重载语言包
            i18n._reload();

            // ④ apply 全局(或指定根)
            if (changed || opts.applyRoot) {
                i18n.apply(opts.applyRoot || $('body'));
            }

            // ⑤ 持久化到 userprefer(需登录态 + opts.persist !== false)
            if (changed && opts.persist !== false && window.com && com.post && window.api && api.personel && api.personel.updateUserPrefer) {
                try {
                    com.post(api.personel.updateUserPrefer, {
                        "userPrefer.module": "index",
                        "userPrefer.page": "global",
                        "userPrefer.pkey": "lang",
                        "userPrefer.pvalue": lang
                    });
                } catch (e) { /* 持久化失败不阻塞切换,下次登录仍以服务端为准 */ }
            }

            opts.onDone && opts.onDone(lang, changed);
            return changed;
        },

        /**
         * 重载当前语言的所有包(message + page/*)
         * 内部方法:初始化与 setLang 时调用。error 包由 core.js 单独加载,此处不重复。
         * messageCn(简体中文基准)只在首次加载时读取一次,之后恒定(用于 tAuto 反查)
         */
        _reload: function() {
            var lang = currentLang();
            // 简体中文基准只加载一次(tAuto 反查表基础)
            if (Object.keys(messageCn).length === 0) {
                messageCn = loadPack('js/i18n/message-cn.json');
            }
            messageMap = loadPack('js/i18n/message-' + lang + '.json');

            // page 包:合并所有 page/*.json(初始化时只加载 common,业务模块按需 i18n.loadPage)
            // 这里只重载已注册的模块列表
            if (!i18n._loadedPages) i18n._loadedPages = { common: true };
            pageMap = {};
            // common 包始终加载
            $.extend(pageMap, loadPack('js/i18n/page/common-' + lang + '.json'));
            // 其他已注册模块
            $.each(i18n._loadedPages, function(mod) {
                if (mod === 'common') return;
                $.extend(pageMap, loadPack('js/i18n/page/' + mod + '-' + lang + '.json'));
            });

            rebuildReverse();
        },

        /**
         * 按需加载某个业务模块的 page 包(业务页面 ready 时调用)
         * @param module 模块名,如 "decoration"
         */
        loadPage: function(module) {
            if (!module) return;
            if (!i18n._loadedPages) i18n._loadedPages = { common: true };
            if (i18n._loadedPages[module]) return;  // 已加载
            i18n._loadedPages[module] = true;
            $.extend(pageMap, loadPack('js/i18n/page/' + module + '-' + currentLang() + '.json'));
            rebuildReverse();
        },

        /**
         * 页面级自动初始化(由 load.js 在页面脚本加载完毕后调用)
         * ① 从当前页面 URL 推断业务模块(views/{module}/xxx.html)
         * ② loadPage 加载该模块语言包
         * ③ apply 翻译整个 body
         * 业务页面无需任何改动,只要 URL 符合 views/{module}/ 约定
         */
        _autoInitForPage: function() {
            // iframe 内页面:location.pathname 形如 /WebContent/views/decoration/xxx.html
            var path = window.location.pathname || '';
            var m = path.match(/views\/([a-zA-Z_]+)\//);
            if (m && m[1]) {
                i18n.loadPage(m[1]);
            }
            i18n.apply($('body'));
        },

        /**
         * 暴露原始 map(只读,调试用)
         */
        _maps: function() { return { message: messageMap, page: pageMap, error: ((window.com && window.com.errorMap) || {}) }; },

        /**
         * 初始化:加载 message + common page + 建反查表
         * 由 index.html / login.html 在 i18n.js 引入后立即调用
         */
        _init: function() {
            i18n._reload();
        }
    };

})(jQuery);

// 立即初始化(加载所有当前语言的包)
i18n._init();
