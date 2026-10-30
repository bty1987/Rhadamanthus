/** app/js/approval/approvalFlowCreate.js —— 审批流程新增/编辑（P2-P3 新引擎）
  上下文：app.params.approvalFlow = {flowId}（编辑）或 null（新增）
  编辑：queryApprovalFlowNode 回填节点；保存：addApprovalFlow/updateApprovalFlow，嵌套 flowNodes[i].xxx */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    var flow = { data: (parent.app.params.approvalFlow) || (app.params.approvalFlow) || null, nodes: [], editIndex: null };
    var nodeTypeMap = { 1: '串行', 2: '并签', 3: '或签', 4: '会签' };
    var ruleMap = { 0: '指定人', 1: '直属上级', 2: '部门负责人', 3: '角色', 4: '自选', 5: '表达式' };

    form.on('select(nodeType)', function (data) { var isRatio = data.value == 4; $('#ratioWrap, #ratioLabel').toggle(isRatio); });

    // 编辑模式：回填 + 加载已有节点
    if (flow.data && flow.data.flowId) {
        $('#flowForm [name="code"]').val(flow.data.code).prop('disabled', true);
        $('#flowForm [name="name"]').val(flow.data.name);
        $('#flowForm [name="businessType"]').val(flow.data.businessType);
        $('#flowForm [name="version"]').val(flow.data.version);
        $('#flowForm [name="comment"]').val(flow.data.comment);
        form.render('select');
        app.post(api.approval.queryApprovalFlowNode, { 'flow.flowId': flow.data.flowId }, function (res) { flow.nodes = res.flowNodes || []; renderNodes(); });
    } else {
        form.render('select');
    }

    function renderNodes() {
        var $c = $('#flowCanvas').empty();
        $('#notnode').toggle(flow.nodes.length === 0);
        $.each(flow.nodes, function (i, node) {
            var $n = $('<div class="app-flow-node"></div>');
            var head = '<div class="app-flow-node-head"><span class="app-flow-seq">' + node.nodeSeq + '</span><b>' + esc(node.nodeName) + '</b><span class="layui-badge layui-bg-orange">' + (nodeTypeMap[node.nodeType] || node.nodeType) + '<\/span>';
            if (node.passRatio) head += '<span class="layui-badge layui-bg-green">比例' + esc(node.passRatio) + '<\/span>';
            head += '<div class="app-flow-actions"><button type="button" class="layui-btn layui-btn-xs layui-btn-warm" data-i="' + i + '" data-act="edit">编辑</button><button type="button" class="layui-btn layui-btn-xs layui-btn-danger" data-i="' + i + '" data-act="del">删除</button></div></div>';
            var body = '<div class="app-flow-body"><span class="app-flow-muted">规则:</span> ' + (ruleMap[node.approverRule] || node.approverRule);
            if (node.approverData) body += '<br/><span class="app-flow-muted">审批人:</span> ' + esc(node.approverData);
            if (node.timeoutHours) body += '<br/><span class="app-flow-muted">超时:</span> ' + node.timeoutHours + '小时';
            if (node.postHandler) body += '<br/><span class="app-flow-muted">后置:</span> ' + esc(node.postHandler);
            body += '</div>';
            $n.html(head + body).appendTo($c);
        });
    }
    function esc(s) { return $('<div/>').text(s == null ? '' : s).html(); }

    $('#flowCanvas').on('click', '[data-act]', function () {
        var i = parseInt($(this).attr('data-i'));
        if ($(this).attr('data-act') === 'edit') editNode(i);
        else app.showConfirm('确认删除该节点?', function () { flow.nodes.splice(i, 1); renderNodes(); });
    });

    $('#addNodeBtn').on('click', function () {
        app.clearValidator(); $('#nodeFormField')[0].reset();
        $('#nodeFormField [name="nodeIndex"]').val('');
        $('#nodeFormField [name="nodeSeq"]').val(flow.nodes.length + 1);
        form.render('select'); $('#ratioWrap, #ratioLabel').hide();
        flow.editIndex = null;
        flow.layerIdx = layer.open({ type: 1, title: '添加节点', content: $('#editBox'), area: ['640px', '90%'] });
    });
    function editNode(i) {
        flow.editIndex = i; var n = flow.nodes[i];
        $('#nodeFormField [name="nodeIndex"]').val(i);
        $('#nodeFormField [name="nodeSeq"]').val(n.nodeSeq);
        $('#nodeFormField [name="nodeName"]').val(n.nodeName);
        $('#nodeFormField [name="nodeType"]').val(n.nodeType);
        $('#nodeFormField [name="passRatio"]').val(n.passRatio);
        $('#nodeFormField [name="approverRule"]').val(n.approverRule);
        $('#nodeFormField [name="timeoutHours"]').val(n.timeoutHours);
        $('#nodeFormField [name="approverData"]').val(n.approverData);
        $('#nodeFormField [name="postHandler"]').val(n.postHandler);
        $('#nodeFormField [name="rejectStrategy"]').val(n.rejectStrategy);
        form.render('select'); $('#ratioWrap, #ratioLabel').toggle(n.nodeType == 4);
        flow.layerIdx = layer.open({ type: 1, title: '编辑节点', content: $('#editBox'), area: ['640px', '90%'] });
    }
    $('#saveNodeBtn').on('click', function () {
        if (app.validate('nodeFormField')) return;
        var node = {
            nodeSeq: parseInt($('#nodeFormField [name="nodeSeq"]').val()),
            nodeName: $('#nodeFormField [name="nodeName"]').val(),
            nodeType: parseInt($('#nodeFormField [name="nodeType"]').val()),
            passRatio: $('#nodeFormField [name="passRatio"]').val() || '',
            approverRule: parseInt($('#nodeFormField [name="approverRule"]').val()),
            timeoutHours: $('#nodeFormField [name="timeoutHours"]').val() || '',
            approverData: $('#nodeFormField [name="approverData"]').val(),
            postHandler: $('#nodeFormField [name="postHandler"]').val() || '',
            rejectStrategy: parseInt($('#nodeFormField [name="rejectStrategy"]').val()),
            status: 0
        };
        if (flow.editIndex !== null) flow.nodes[flow.editIndex] = node; else flow.nodes.push(node);
        renderNodes(); layer.close(flow.layerIdx); flow.layerIdx = null;
    });
    $('#cancelNodeBtn').on('click', function () { layer.close(flow.layerIdx); flow.layerIdx = null; });

    $('#submitBtn').on('click', function () {
        if (app.validate('flowForm')) return;
        if (flow.nodes.length === 0) { app.showAlert(app.warning, '请至少添加一个节点'); return; }
        var o = {
            'flow.code': $('#flowForm [name="code"]').val(),
            'flow.name': $('#flowForm [name="name"]').val(),
            'flow.businessType': parseInt($('#flowForm [name="businessType"]').val()),
            'flow.version': parseInt($('#flowForm [name="version"]').val() || 1),
            'flow.comment': $('#flowForm [name="comment"]').val()
        };
        $.each(flow.nodes, function (i, n) {
            o['flowNodes[' + i + '].nodeSeq'] = n.nodeSeq;
            o['flowNodes[' + i + '].nodeName'] = n.nodeName;
            o['flowNodes[' + i + '].nodeType'] = n.nodeType;
            o['flowNodes[' + i + '].approverRule'] = n.approverRule;
            o['flowNodes[' + i + '].approverData'] = n.approverData;
            o['flowNodes[' + i + '].rejectStrategy'] = n.rejectStrategy;
            o['flowNodes[' + i + '].status'] = n.status;
            if (n.passRatio) o['flowNodes[' + i + '].passRatio'] = n.passRatio;
            if (n.timeoutHours) o['flowNodes[' + i + '].timeoutHours'] = n.timeoutHours;
            if (n.postHandler) o['flowNodes[' + i + '].postHandler'] = n.postHandler;
        });
        var apiDef = api.approval.addApprovalFlow;
        if (flow.data && flow.data.flowId) { o['flow.flowId'] = flow.data.flowId; apiDef = api.approval.updateApprovalFlow; }
        app.post(apiDef, o, function () { app.showAlert(app.success, '保存成功'); app.closePopup(); });
    });
});
}); // end app.ready
