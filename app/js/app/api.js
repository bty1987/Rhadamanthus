/**
 * app/js/app/api.js —— API 定义载入器（替代旧 Api().init）
 *
 * 设计：与旧 WebContent/js/com/api.js 行为等价——同步加载 js/api/*.js，
 * 每个文件用 $.extend(api, {...}) 注册本模块的接口定义。
 *
 * api 对象结构（与旧框架一致）：
 *   api.index.<pageId> = { url: "/views/xxx.html" }     // 页面路由（菜单跳转用）
 *   api.<module>.<action> = {                             // 接口
 *       url: "xxx.do",
 *       demo?: true,                  // demo 模式允许调用
 *       validate?: { "bean.field": {required:true} }, // 前端必填校验
 *       type?: "query"|"update",       // query=响应÷1000，update=请求×1000
 *       tranargs?: { args:[...] } | [{ result, args }], // 金额精度转换字段
 *       cache?: "cacheKey",            // 命中 app.params[cacheKey] 则跳过请求
 *       server?: "communion"|"media",  // 走哪个服务器根
 *       intercept?: true,              // true=跳过防重复拦截
 *       loading?: { content, shade, time }
 *   }
 *
 * 注意：这里用 layui.jquery（同步 $.ajax），不依赖外部 jQuery。
 */
layui.define(['jquery'], function (exports) {

    "use strict";

    var $ = layui.jquery;

    // api 根对象
    var api = window.api = window.api || { index: {}, ds: {} };
    app.api = api;

    /**
     * 同步加载一个 api 定义文件
     * @param {String} path 相对路径，如 "js/api/system.js"
     */
    function loadOne(path) {
        $.ajax({
            url: path,
            cache: false,
            type: 'GET',
            dataType: 'text',
            async: false,
            success: function (code) {
                // 在全局上下文执行（文件内用 $.extend(api, ...)）
                try {
                    (1, eval)(code); // 间接 eval → 全局作用域执行（跨浏览器兼容，非 IE 专用）
                } catch (e) {
                    console.error('api 文件加载失败: ' + path, e);
                }
            },
            error: function () {
                console.warn('api 文件不存在或加载失败: ' + path);
            }
        });
    }

    /**
     * 初始化：依次加载所有 api 定义
     * @param {String} path 目录路径，末尾带 /，如 "js/api/"
     * @param {Array} [files] 要加载的文件名列表，缺省加载内置清单
     *
     * 内置清单只列已迁移到 app/ 的模块；新模块迁入时在此追加。
     * 缺省会自动扫描目录——见下方 autoScan。
     */
    function init(path, files) {
        path = path || 'js/api/';
        // 已迁移模块清单（按迁移批次追加）
        var defaults = [
            'system.js',
            'personel.js',
            'log.js',
            'store.js',
            'market.js',
            'manifest.js',
            'building.js',
            'data.js',
            'communion.js',     // 公共服务（部门/任务/货品池等，被多模块引用）
            'information.js',
            'salary.js',
            'material.js',      // 主材模块（销售/结算/活动/品牌/型号）
            'payment.js',       // 款项模块（全量：预付款/装修款/主材款/销售款/服务款/外销款/收据/钱包/活动款/代收款/转换款/签约/对账等）
            'decoration.js',      // 装修单模块（全量：装修单/量房/合同/归属/活动/审核/决算/结算/服务/回访/图纸/功能开关）
            'production.js',    // 生产模块（生产单/报价/计划/五金/外协/运输包装/工序）
            'sales.js',         // 主材销售（销售单/退货/外销/结算/活动/送货/档案）
            'approval.js',      // 审批模块（审批中心/流程/表单/任务/审批人）
            'balance.js',       // 财务结算（结算单/账户/扣款/厂商结算销售/选材/外销）
            'report.js',        // 报表（排行榜/业绩/转化分析/大屏）
            'construction.js',  // 施工模块（工程单/进度/放线/质检/监理/验收/客服/工人/辅料/日志）
            'customer.js',      // 客服模块（装修客户/客源/商机/画像/反馈/投诉/售后/维修/质保/回访/调研/积分）
            'quotation.js'      // 报价模块（全量：版本/报价项/功能区/定额/扩展项/增减项/选材单/预签/预算分配/画像）
        ];
        var list = files || defaults;
        for (var i = 0; i < list.length; i++) {
            loadOne(path + list[i]);
        }
    }

    app.initApi = init;

    exports('apiLoader', { init: init, loadOne: loadOne });
});
