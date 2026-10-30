/** app/js/report/statis.js —— 设计师/业务员 签约量尺统计（library 代理 → echarts）
 * 4 张图（mongo=decoration）：designContractAndMeasure / designContract / salesmanContractAndMeasure / salesmanContract。
 * library 服务返回 echarts option（res.option），直接 setOption。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var company = (app.params.company && app.params.company.cid) || '';
    var userId = (app.params.userInfo && app.params.userInfo.user && app.params.userInfo.user.userId) || '';

    function lib(key, apiKey, mongo, extra, id) {
        var data = $.extend({ api: apiKey, mongo: mongo }, extra || {});
        app.postRaw({ url: 'library' }, data, function (res) {
            var option = (res && res.option) ? res.option : res;
            try { echarts.init($('#' + id)[0]).setOption(option || {}); } catch (e) { console.error(id, e); }
        });
    }

    var ex = { company: company, userId: userId };
    lib('design', 'system.decorationClass.designContractAndMeasure', 'decoration', ex, 'design');
    lib('designContract', 'system.decorationClass.designContract', 'decoration', ex, 'designContract');
    lib('salesman', 'system.decorationClass.salesmanContractAndMeasure', 'decoration', ex, 'salesman');
    lib('salesmanContract', 'system.decorationClass.salesmanContract', 'decoration', ex, 'salesmanContract');
});
});
