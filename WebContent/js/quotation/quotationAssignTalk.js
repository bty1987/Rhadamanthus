jQuery(function($) {	    var KEY_ENTER_INT = 13;

	    // ==================== 参数获取 ====================
    var orderId = params.quotationAssignTalk ? params.quotationAssignTalk.orderId : null;

    if (!orderId) {
        com.showAlert(com.warning, '缺少装修单号参数');
        com.closePopup();
        return;
    }

    // ==================== DOM引用 ====================
    var talkOrderIdDisplay = com.focusPage('#talkOrderIdDisplay');
    var talkMessageList = com.focusPage('#talkMessageList');
    var talkContent = com.focusPage('#talkContent');
    var sendTalkBtn = com.focusPage('#sendTalkBtn');

    // 显示装修单号
    talkOrderIdDisplay.text('装修单号：' + orderId);

    // ==================== 加载消息列表 ====================
    function loadTalkMessages() {
        com.post(api.quotation.queryQuotationAssignTalkByOrderId, {
            "quotationAssignTalk.orderId": orderId
        }, function(res) {
            var talks = res.quotationAssignTalks || [];
            renderTalkMessages(talks);
        }, function(res) {
            talkMessageList.html('<div style="text-align:center;color:#999;padding:20px;">加载失败</div>');
        });
    }

    // ==================== 渲染消息列表 ====================
    function renderTalkMessages(talks) {
        if (!talks || talks.length === 0) {
            talkMessageList.html('<div style="text-align:center;color:#999;padding:20px;">暂无沟通记录</div>');
            return;
        }

        var html = '';
        for (var i = 0; i < talks.length; i++) {
            var t = talks[i];
            var senderName = t.sender ? (t.sender.currentName || t.sender.userName || '未知') : '未知';
            var sendTime = t.sendTime || '';
            var content = t.content || '';
	            var typeText = constant.quotation().quotationAssignTalk.type.keys[t.type] || '未知';
	            var typeClazz = t.type == constant.quotation().quotationAssignTalk.TYPE_DESIGNER_TO_BUDGETER_INT ? 'label-info' : 'label-success';
	            var typeLabel = '<span class="label ' + typeClazz + '" style="font-size:10px;">' + typeText + '</span>';

            html += '<div style="margin-bottom:10px;padding:8px;border-radius:4px;background:#fff;border:1px solid #ddd;">';
            html += '  <div style="margin-bottom:4px;">';
            html += '    <strong>' + senderName + '</strong> ' + typeLabel;
            html += '    <span style="float:right;color:#999;font-size:12px;">' + sendTime + '</span>';
            html += '  </div>';
            html += '  <div style="color:#333;word-break:break-all;">' + content + '</div>';
            html += '</div>';
        }

        talkMessageList.html(html);
        talkMessageList.scrollTop(talkMessageList[0].scrollHeight);
    }

    // ==================== 发送消息 ====================
    function sendTalkMessage() {
        var content = talkContent.val().trim();

        if (!content) {
            com.showAlert(com.warning, '消息内容不能为空');
            return;
        }

        com.post(api.quotation.sendQuotationAssignTalk, {
            "quotationAssignTalk.orderId": orderId,
            "quotationAssignTalk.content": content
        }, function(res) {
            talkContent.val('');
            loadTalkMessages();
        }, function(res) {
            com.showAlert(com.error, '发送失败');
        });
    }

    // ==================== 事件绑定 ====================
    sendTalkBtn.on('click', function() {
        sendTalkMessage();
    });

    talkContent.on('keydown', function(e) {
        if (e.keyCode == KEY_ENTER_INT) {
            e.preventDefault();
            sendTalkMessage();
        }
    });

    // ==================== 初始加载 ====================
    loadTalkMessages();
});
