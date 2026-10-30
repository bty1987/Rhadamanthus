/**
 * app/js/home.js —— 首页逻辑
 *
 * 从父框架取用户信息显示。首页逻辑简单，后续可扩展数据看板。
 */
layui.use(['jquery'], function () {
    var $ = layui.jquery;

    // 从父框架取用户信息（首页运行在 index.html 的 iframe 内）
    try {
        var user = window.parent.app.params.userInfo && window.parent.app.params.userInfo.user;
        if (user) {
            $('#homeUserName').text(user.currentName || user.userId || '—');
        }
    } catch (e) {
        // 跨域或独立打开时降级
        $('#homeUserName').text('—');
    }
});
