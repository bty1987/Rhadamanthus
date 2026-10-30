/** app/js/customer/droup.js —— 群组消息（旧 droup.js → layui）
 *  列表：pageDroup（装修单号/客户名称/类型/状态/更新时间检索）。
 *  绑定 bindDroup（装修单号/群名/群ID/类型）；删除 deleteDroup；添加人员 updateDroup（人员选择）。
 *  对话查看器：pageConversation（orderId 过滤 + 内容/时间检索，滚动加载更多）→ 按消息类型渲染
 *  （0文本/1图片/2应用/3语音/4视频，contype 0客户/1装修/2主材/3工程/4款项/5其他，颜色区分）；
 *  发送 responseConversation（文本 type=0 / 图片 type=1，uploadImg）；删除消息 deleteConversation。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var CONTYPE_COLOR = { 0: '#fee188', 1: '#9585bf', 2: '#a0a0a0', 3: '#d6487e', 4: '#d15b47', 5: '#303030' };
    var state = {
        page: 1, rows: 10, total: 0,
        bindIndex: null, addUserIndex: null, chatIndex: null,
        did: null, orderId: null, chatPage: 1, chatDone: false, userId: null
    };

    customerCommon.dateRange('#updateTime');
    laydate.render({ elem: '#chatTime', type: 'date' });

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'name', title: '群名-客户', width: 140, templet: function (d) { return (d.decoration && d.decoration.orderId ? d.decoration.orderId : '') + '-' + (d.name || ''); } },
            { field: 'decoration', title: '客户名称', width: 100, templet: function (d) { return d.decoration && d.decoration.customer ? (d.decoration.customer.name || '') : ''; } },
            { field: 'decoration', title: '装修单号', width: 110, templet: function (d) { return d.decoration ? (d.decoration.orderId || '') : ''; } },
            { field: 'decoration', title: '楼盘', width: 110, templet: function (d) { return d.decoration && d.decoration.house && d.decoration.house.village ? (d.decoration.house.village.name || '') : ''; } },
            { field: 'decoration', title: '楼号', width: 90, templet: function (d) { return d.decoration && d.decoration.house ? (d.decoration.house.houseNumber || '') : ''; } },
            { field: 'decoration', title: '设计师', width: 90, templet: function (d) { return d.decoration && d.decoration.designer ? (d.decoration.designer.currentName || '') : ''; } },
            { field: 'decoration', title: '业务员', width: 90, templet: function (d) { return d.decoration && d.decoration.salesman ? (d.decoration.salesman.currentName || '') : ''; } },
            { field: 'updateTime', title: '更新时间', width: 165 },
            { field: 'handleTime', title: '处理时间', width: 165 },
            { field: 'type', title: '类型', width: 80, templet: function (d) { return E.droupDType[d.type] != null ? E.droupDType[d.type] : ''; } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return customerCommon.badge(E.droupStatus, d.status, function (k) { return parseInt(k, 10) === 0 ? 'layui-bg-green' : 'layui-bg-gray'; }); } },
            { field: 'isHandle', title: '处理状态', width: 90, templet: function (d) { return E.droupType[d.isHandle] != null ? E.droupType[d.isHandle] : ''; } },
            { title: '操作', width: 200, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'chat') {
            state.did = v.did;
            state.orderId = v.decoration ? v.decoration.orderId : null;
            openChat();
        } else if (obj.event === 'del') {
            app.post(api.customer.deleteDroup, { 'droup.did': v.did }, function () {
                app.showAlert(app.success, '操作成功');
                query(state.page);
            });
        } else if (obj.event === 'addUser') {
            state.did = v.did;
            $('#addUserForm')[0].reset();
            state.userId = null;
            app.clearValidator();
            state.addUserIndex = layer.open({ type: 1, title: '添加人员', content: $('#addUserBox'), area: ['460px', 'auto'] });
        }
    });
    if (!$('#rowToolbar').length) {
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="chat">对话</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</button>'
            + '<button class="layui-btn layui-btn-xs" lay-event="addUser">添加人员</button>'
            + '<\/script>'
        );
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(api.customer.pageDroup, $.extend({}, customerCommon.buildFilters($('#searchForm')), {
            'paging.page': state.page,
            'paging.rows': state.rows
        }), function (res) {
            var p = res.paging || { data: [], totalRecords: 0, totalPage: 0 };
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            laypage.render({
                elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30],
                layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); }
            });
        });
    }
    query(1);

    // —— 绑定群 ——
    $('#btnBind').on('click', function () {
        $('#bindForm')[0].reset();
        form.render('select');
        app.clearValidator();
        state.bindIndex = layer.open({ type: 1, title: '绑定群', content: $('#bindBox'), area: ['460px', 'auto'] });
    });
    $('#btnBindSave').on('click', function () {
        if (app.validate('bindForm')) return;
        app.post(api.customer.bindDroup, {
            'droup.decoration.orderId': $('#bindForm [name="orderId"]').val(),
            'droup.name': $('#bindForm [name="name"]').val(),
            'droup.chatId': $('#bindForm [name="chatId"]').val(),
            'droup.type': $('#bindForm [name="type"]').val()
        }, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(state.bindIndex);
            state.bindIndex = null;
            query(state.page);
        });
    });
    $('#btnBindCancel').on('click', function () { layer.close(state.bindIndex); state.bindIndex = null; });

    // —— 添加人员 ——
    $('#btnPickUser').on('click', function () {
        customerCommon.userPicker(function (u) {
            state.userId = u.userId;
            $('#userName').val(u.currentName);
        });
    });
    $('#btnAddUserSave').on('click', function () {
        if (app.validate('addUserForm')) return;
        if (!state.userId) { app.showAlert(app.warning, '请选择人员'); return; }
        app.post(api.customer.updateDroup, {
            'droup.did': state.did,
            'droup.userId': state.userId
        }, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(state.addUserIndex);
            state.addUserIndex = null;
            query(state.page);
        });
    });
    $('#btnAddUserCancel').on('click', function () { layer.close(state.addUserIndex); state.addUserIndex = null; });

    // ==================== 对话查看器 ====================
    function chatOptions(page) {
        var opts = {
            'paging.page': page,
            'paging.rows': 10,
            'filters[0].field': 'orderId',
            'filters[0].data': state.orderId,
            'filters[0].op': 'eq'
        };
        var content = $.trim($('#chatContent').val());
        if (content) {
            opts['filters[1].field'] = 'content';
            opts['filters[1].data'] = content;
            opts['filters[1].op'] = 'cn';
        }
        return opts;
    }

    function renderMsg(v) {
        var color = CONTYPE_COLOR[v.contype] != null ? CONTYPE_COLOR[v.contype] : '#eee';
        var html = '<div class="dialogdiv" data-cid="' + v.cid + '" style="display:flex;flex-direction:column;align-items:flex-start;margin:6px 0;">'
            + '<div style="border:2px solid ' + color + ';border-radius:4px;padding:6px 10px;max-width:92%;">'
            + '<div style="font-size:12px;color:#999;"><b>' + (v.name || '') + '<\/b> ' + (v.createTime || '') + ' [' + (E.droupBizType[v.contype] != null ? E.droupBizType[v.contype] : '') + ']<\/div>';
        if (v.type == 0) {
            html += '<div style="margin-top:4px;word-break:break-all;">' + (v.content || '') + '<\/div>';
        } else if (v.type == 1) {
            var src = /^[a-z]+:\/\//.test(v.path || '') ? v.path : (app.config.media || '') + (v.path || '');
            html += '<div style="margin-top:4px;"><a href="' + src + '" target="_blank"><img src="' + src + '" style="width:250px;height:150px;object-fit:cover;"><\/a><\/div>';
        } else if (v.type == 3) {
            html += '<div style="margin-top:4px;">' + (v.content || '') + '<\/div><audio controls style="width:100%;"><source src="' + (app.config.media || '') + (v.path || '') + '" type="audio/mpeg"><\/audio>';
        } else if (v.type == 4) {
            html += '<div style="margin-top:4px;">' + (v.content || '') + '<\/div><video width="80%" controls><source src="' + (app.config.media || '') + (v.path || '') + '" type="video/mp4"><\/video>';
        } else {
            html += '<div style="margin-top:4px;">' + (v.content || '') + '<\/div>';
        }
        html += '<div style="margin-top:4px;text-align:right;"><button type="button" class="layui-btn layui-btn-danger layui-btn-xs" data-del="' + v.cid + '">删除</button><\/div>';
        return html + '<\/div><\/div>';
    }

    function loadChat(page, appendMode) {
        app.post(api.customer.pageConversation, chatOptions(page), function (res) {
            var p = res.paging || { data: [], totalPage: 0 };
            if (!appendMode) $('#chatList').empty();
            $.each(p.data || [], function (i, v) {
                $('#chatList').prepend(renderMsg(v));
            });
            if ((p.data || []).length < 10) state.chatDone = true;
            if (page >= (p.totalPage || 1)) state.chatDone = true;
            $('#chatList').scrollTop($('#chatList')[0].scrollHeight);
        });
    }

    function openChat() {
        state.chatPage = 1;
        state.chatDone = false;
        $('#chatContent').val('');
        $('#chatTime').val('');
        state.chatIndex = layer.open({ type: 1, title: '群消息: ' + (state.orderId || ''), content: $('#chatBox'), area: ['760px', 'auto'] });
        loadChat(1, false);
    }

    $('#btnChatSearch').on('click', function () {
        state.chatPage = 1;
        state.chatDone = false;
        loadChat(1, false);
    });
    $('#btnChatReset').on('click', function () {
        $('#chatContent').val('');
        $('#chatTime').val('');
        state.chatPage = 1;
        state.chatDone = false;
        loadChat(1, false);
    });
    $('#btnChatMore').on('click', function () {
        if (state.chatDone) { app.showAlert(app.info, '没有更多了'); return; }
        state.chatPage += 1;
        loadChat(state.chatPage, true);
    });

    // 发送文本
    $('#btnChatSend').on('click', function () {
        var content = $.trim($('#chatEnter').val());
        if (!content) return;
        app.post(api.customer.responseConversation, {
            'conversation.orderId': state.orderId,
            'conversation.type': 0,
            'conversation.contype': 5,
            'conversation.content': content,
            'conversation.path': '',
            'conversation.width': 0,
            'conversation.height': 0
        }, function (res) {
            if (res.conversation) {
                $('#chatList').append(renderMsg(res.conversation));
                $('#chatList').scrollTop($('#chatList')[0].scrollHeight);
            }
        });
        $('#chatEnter').val('');
    });

    // 发送图片
    app.uploadImage({
        elem: '#btnChatUpload',
        done: function (res) {
            app.post(api.customer.responseConversation, {
                'conversation.orderId': state.orderId,
                'conversation.type': 1,
                'conversation.contype': 5,
                'conversation.content': '',
                'conversation.path': res.resUrl,
                'conversation.width': 250,
                'conversation.height': 150,
                'conversation.filesize': res.filesize != null ? res.filesize : 0
            }, function (r) {
                if (r.conversation) {
                    $('#chatList').append(renderMsg(r.conversation));
                    $('#chatList').scrollTop($('#chatList')[0].scrollHeight);
                }
            });
        }
    });

    // 删除消息
    $('#chatList').on('click', 'button[data-del]', function () {
        var cid = $(this).data('del');
        var $div = $(this).closest('.dialogdiv');
        app.post(api.customer.deleteConversation, { 'conversation.cid': cid }, function () {
            app.showAlert(app.success, '操作成功');
            $div.remove();
        });
    });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
});
}); // end app.ready
