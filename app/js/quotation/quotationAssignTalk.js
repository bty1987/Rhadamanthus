/** app/js/quotation/quotationAssignTalk.js —— 分配沟通（queryQuotationAssignTalkByOrderId / sendQuotationAssignTalk）
 *  上下文：app.params.quotationAssignTalk.orderId。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var E = quotationCommon.ENUM;
    var ctx = qc.ctx('quotationAssignTalk') || {};
    var orderId = ctx.orderId;

    if (!orderId) {
        app.showAlert(app.warning, '缺少装修单号参数');
        return;
    }
    $('#talkOrderIdDisplay').text('装修单号：' + orderId);

    function loadTalkMessages() {
        app.post(api.quotation.queryQuotationAssignTalkByOrderId, { 'quotationAssignTalk.orderId': orderId }, function (res) {
            renderTalkMessages(res.quotationAssignTalks || []);
        }, function () {
            $('#talkMessageList').html('<div style="text-align:center;color:#999;padding:20px;">加载失败<\/div>');
        });
    }

    function renderTalkMessages(talks) {
        if (!talks.length) {
            $('#talkMessageList').html('<div style="text-align:center;color:#999;padding:20px;">暂无沟通记录<\/div>');
            return;
        }
        var html = '';
        $.each(talks, function (i, t) {
            var senderName = t.sender ? (t.sender.currentName || t.sender.userName || '未知') : '未知';
            var typeText = E.assignTalkType[t.type] != null ? E.assignTalkType[t.type] : '未知';
            var cls = t.type == 1 ? 'layui-bg-blue' : 'layui-bg-green';
            html += '<div style="margin-bottom:10px;padding:8px;border-radius:4px;background:#fff;border:1px solid #e8e8e8;">'
                + '<div style="margin-bottom:4px;"><strong>' + senderName + '<\/strong> <span class="layui-badge ' + cls + '">' + typeText + '<\/span>'
                + '<span style="float:right;color:#999;font-size:12px;">' + (t.sendTime || '') + '<\/span><\/div>'
                + '<div style="color:#333;word-break:break-all;">' + (t.content || '') + '<\/div><\/div>';
        });
        $('#talkMessageList').html(html);
        $('#talkMessageList').scrollTop($('#talkMessageList')[0].scrollHeight);
    }

    function sendTalkMessage() {
        var content = $.trim($('#talkContent').val());
        if (!content) { app.showAlert(app.warning, '消息内容不能为空'); return; }
        app.post(api.quotation.sendQuotationAssignTalk, { 'quotationAssignTalk.orderId': orderId, 'quotationAssignTalk.content': content }, function () {
            $('#talkContent').val('');
            loadTalkMessages();
        }, function () { app.showAlert(app.error, '发送失败'); });
    }

    $('#sendTalkBtn').on('click', sendTalkMessage);
    $('#talkContent').on('keydown', function (e) {
        if (e.keyCode == 13) { e.preventDefault(); sendTalkMessage(); }
    });

    loadTalkMessages();
});
}); // end app.ready
