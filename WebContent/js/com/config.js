// ========== 国际化(i18n)配置 ==========
// config.js 是最早加载的脚本,负责在 core.js 加载 error 包前确定 config.lang。
// 语言来源优先级:localStorage('rhada.lang') > 浏览器 navigator.language > defaultLang
// 已登录用户的持久化偏好(userprefer)在 index.js loadUserPrefers 后覆盖此值。
// 详见 docs/10-指南手册/I18N_PLAN.md §五"语言来源链"。
(function() {
    var DEFAULT_LANG = 'cn';
    var SUPPORTED_LANGS = ['cn', 'tw', 'en']; // 短语言码,与 js/i18n/*-{lang}.json 一致

    function pickLang() {
        // ① localStorage(运行时切换即时写回,离线可用)
        try {
            var saved = localStorage.getItem('rhada.lang');
            if (saved && SUPPORTED_LANGS.indexOf(saved) >= 0) return saved;
        } catch (e) {} // localStorage 不可用(隐私模式)则跳过

        // ② 浏览器语言映射(zh-*→cn, zh-TW/zh-HK→tw, en-*→en, 其余→默认)
        var nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
        if (nav.indexOf('zh') === 0) {
            return (nav.indexOf('tw') >= 0 || nav.indexOf('hk') >= 0 || nav.indexOf('hant') >= 0) ? 'tw' : 'cn';
        }
        if (nav.indexOf('en') === 0) return 'en';

        // ③ 默认简体中文
        return DEFAULT_LANG;
    }

    window.__i18nLang = pickLang();
})();

var config = {

    intranet: false,

    versionCode: "",
    system: 1,
    uploadTimeout: 30,
    quotationLimitDiscount: 5,
    timeout: 120,
    singlePointTime: 60000,
    serviceRate: 0.1,
    addreduceManagerPrice: true,
    addreduceDiscount: 8.8,
    spacing: 5,
    planTimeLimit: 5,
    pageTabLimit: 15, // 页面标签（Tab）数量上限
    prefix: '', // 使用在获取二维码路径
    iconImg: './images/icon_fanglin.png',
    backgroundImg: './images/bg_fanglin.jpg',
    shakingColor: '#197bb5', // 1918: #892f89 , ehome: #3d677c

    defaultTemplate: 'ace',
    templates: {
        ace: {
            name: '多彩',
            url: 'index.html'
        },
        metro: {
            name: '暗黑',
            url: 'index-metro.html'
        },
        clear: {
            name: '明亮',
            url: 'index-clear.html'
        }
    },

    // 文件上传配置
    isAliOss: false,  // 是否启用阿里云 OSS 上传（false=本地上传，true=OSS上传）
    uploadMode: 'sts', // OSS 上传模式：'sts'（STS临时凭证，推荐）| 'policy'（旧Policy签名，兼容）

    // OSS 图片显示配置（type=3 时使用）
    ossConfig: {
        bucket: '',            // OSS Bucket 名称（如：fanglin-erp）
        endpoint: '',          // OSS 端点（如：oss-cn-hangzhou.aliyuncs.com）
        region: '',            // 地域（如：cn-hangzhou，STS直传必填）
        dir: '',               // 图片目录前缀（如：images/，可选）
        host: ''               // OSS 访问域名（可选，如：https://cdn.fanglin.com 或自动构建）
    },

    communion: '',
    server: '',
    media: '',
    dmedia: '',
    library: '',
    store: '',

    // 国际化配置
    defaultLang: 'cn',                       // 默认语言(短码),未匹配任何来源时使用
    supportedLangs: ['cn', 'tw', 'en'],      // 支持的语言列表(对应 js/i18n/*-{lang}.json)
    lang: window.__i18nLang || 'cn'          // 当前语言:config.js 启动时按来源链确定,登录后被 userprefer 覆盖
};

window.console && window.console.log && console.log("%c有时候，正是那些人们认为的无用之人成就了无人能成之事。\nSometimes it's the very people who no one imagines anything of who do the things no one can imagine.\n--Alan·Mathison·Turing'sayings\n", "color:#428bca; font-size:1em");
window.console && window.console.log && console.log("%c台湾是中国领土不可分割的一部分。\nTaiwan is an inalienable part of the Chinese territory.\n", "color:#f00; font-size:1.2em");