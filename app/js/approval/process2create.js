/** app/js/approval/process2create.js —— 审批流程新增/编辑（旧引擎 process）
  上下文：app.params.approvalProcess = {pid}（编辑）或 null（新增）
  左：控件库（queryProcessRefer 按 type 分组 query/filling/condition/其他）；
  右：4 类已选列表（项目 field/详细 item/备注 comment/条件 condition），支持上移/下移/更新/删除。
  保存：addProcess/updateProcess，嵌套 processItems[数组]（带 'sort'/'id'/'form' 等键）。 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    var data = (parent.app.params.approvalProcess) || (app.params.approvalProcess) || null;
    var ctx = {
        args: null,            // 当前点击控件的元数据（type/id/name）
        updateArgs: null,      // 编辑模式：当前更新的 processItem（后端对象）
        editIdx: null,
        validates: [{ key: 'require', name: '必选验证' }, { key: 'integer', name: '整数验证' }, { key: 'float', name: '小数验证' }],
        diffTypes: ['query', 'filling']
    };

    // 编辑模式：回填 + 加载已有 processItem
    if (data && data.pid) {
        $('#processForm [name="no"]').val(data.no);
        $('#processForm [name="name"]').val(data.name);
        $('#processForm [name="code"]').val(data.code);
        app.post(api.approval.queryProcessItem, { 'process.pid': data.pid }, function (res) {
            $.each(res.processItems || [], function (i, v) {
                drawItem({
                    "'id'": v.id, "'name'": v.name, "'form'": v.form, "'type'": v.type,
                    "'validate'": v.validate, "'data'": v.data, "'comment'": v.comment,
                    piid: v.piid
                }, v);
            });
        });
    }

    // ===== 加载控件库 =====
    app.post(api.approval.queryProcessRefer, {}, function (res) {
        $.each(res.processRefers || [], function (i, v) {
            var $box = v.type === 'query' ? $('#referquery') : v.type === 'filling' ? $('#referfilling') : v.type === 'condition' ? $('#refercondition') : $('#referother');
            var color = v.type === 'query' ? 'layui-btn-normal' : v.type === 'filling' ? 'layui-btn' : v.type === 'condition' ? 'layui-btn-warm' : 'layui-btn-warm';
            $('<button type="button" class="app-ctrl-btn layui-btn layui-btn-xs ' + color + '"><i class="layui-icon layui-icon-add-1"></i> ' + esc(v.name) + '</button>')
                .data({ id: v.id, name: v.name, type: v.type }).appendTo($box);
        });
    });
    $('.app-designer-lib').on('click', '.app-ctrl-btn', function () {
        ctx.args = $(this).data();
        ctx.updateArgs = null;
        openReferModal(false);
    });

    // ===== 控件弹窗 =====
    function openReferModal(isUpdate) {
        app.clearValidator(); $('#referForm')[0].reset();
        $('#formGroup').toggle(!isUpdate);
        $('#validateBox').empty();
        var args = isUpdate ? ctx.updateArgs : ctx.args;
        var type = args.type;

        $('#referForm [name="id"]').val(args.id || '');
        $('#referForm [name="name"]').val(args.name || '');

        if (isUpdate) {
            // 更新模式
            if (ctx.diffTypes.indexOf(type) != -1) {
                // query/filling 只显示 id+name（已在上方显示）
            } else if (type === 'condition') {
                $('#argsGroup').show();
                $('#referForm [name="args"]').val(args.data || '');
            } else {
                $('#dataGroup').show();
                $('#validateGroup').show();
                drawValidate(type, args.validate);
                $('#referForm [name="data"]').val((args.data || '').replace(/\//g, '\n'));
                $('#referForm [name="comment"]').val(args.comment || '');
            }
        } else {
            if (ctx.diffTypes.indexOf(type) != -1) {
                // query/filling：仅 id+name
            } else if (type === 'condition') {
                $('#argsGroup').show();
            } else {
                $('#dataGroup').show();
                $('#validateGroup').show();
                drawValidate(type, null);
            }
        }
        // query/filling/upload/condition 不显示验证
        if (['query', 'filling', 'upload', 'condition'].indexOf(type) != -1) $('#validateGroup').hide();
        // 仅 select 显示下拉数据
        if (type !== 'select') $('#dataGroup').hide();

        ctx.editIdx = layer.open({ type: 1, title: '参数信息', content: $('#editBox'), area: ['560px', 'auto'] });
    }

    function drawValidate(type, params) {
        var arr = params ? params.split('/') : [];
        $.each(ctx.validates, function (i, v) {
            if (v.key !== 'require' && type !== 'text') return;
            var checked = arr.indexOf(v.key) != -1 ? ' checked' : '';
            $('#validateBox').append('<label style="margin-right:12px;"><input type="checkbox" value="' + v.key + '"' + checked + '>' + v.name + '</label>');
        });
    }
    function getValidateVal() {
        var v = '';
        $('#validateBox input:checked').each(function (i) {
            v += $(this).val();
            if (i < $('#validateBox input:checked').length - 1) v += '/';
        });
        return v;
    }

    // 确定：新增项 or 更新项
    $('#btnConfirm').on('click', function () {
        if (app.validate('referForm')) return;
        if (ctx.updateArgs) { updateItem(); } else { createItem(); }
    });

    function createItem() {
        var id = ctx.args.id || $('#referForm [name="id"]').val();
        var name = $('#referForm [name="name"]').val();
        var type = ctx.args.type;
        var formVal = $('#referForm [name="form"]').val();
        var validate = 'require';
        var d = '';
        var comment = $('#referForm [name="comment"]').val();

        if ($('#itemfield #' + cssEsc(id) + ', #itemitem #' + cssEsc(id) + ', #itemcomment #' + cssEsc(id) + ', #itemcondition #' + cssEsc(id)).length != 0) {
            app.showAlert(app.warning, '控件已存在'); return;
        }
        if (ctx.diffTypes.indexOf(type) != -1 && formVal !== 'field') { app.showAlert(app.warning, '控件类型不符'); return; }
        if (type === 'condition' && formVal !== 'condition') { app.showAlert(app.warning, '控件类型不符'); return; }

        if (type === 'select') d = $('#referForm [name="data"]').val().replace(/\n/g, '/');
        if (type === 'condition') d = $('#referForm [name="args"]').val();
        validate = getValidateVal();

        var itemData = { "'id'": id, "'name'": name, "'form'": formVal, "'type'": type, "'validate'": validate, "'data'": d, "'comment'": comment };
        drawItem(itemData, null);
        layer.close(ctx.editIdx); ctx.editIdx = null;
    }

    function drawItem(itemData, v) {
        var formKey = itemData["'form'"];
        var $content = $('#item' + formKey);
        $('#not' + formKey).hide();
        var licolor = formKey === 'field' ? 'layui-bg-green' : formKey === 'item' ? 'layui-bg-blue' : 'layui-bg-orange';
        var $li = $('<div class="app-process-item" id="' + cssEsc(itemData["'id'"]) + '" style="padding:8px 12px;margin:4px 0;border:1px solid #eee;border-radius:4px;background:#fff;"></div>').data(itemData);
        $li.data('raw', v);
        var $h = $('<div><b>' + esc(itemData["'name'"]) + '</b></div>').css('display', 'inline-block');
        var $props = $('<div style="font-size:12px;color:#666;margin-top:4px;"></div>');
        $props.append('<span style="margin-right:12px;"><span style="color:#999;">标识:</span> ' + esc(itemData["'id'"]) + '</span>');
        $props.append('<span style="margin-right:12px;"><span style="color:#999;">类型:</span> ' + esc(itemData["'type'"]) + '</span>');
        $props.append('<span style="margin-right:12px;"><span style="color:#999;">验证:</span> ' + esc(itemData["'validate'"]) + '</span>');
        if (itemData["'data'"]) $props.append('<span style="margin-right:12px;"><span style="color:#999;">数据:</span> ' + esc(itemData["'data'"]) + '</span>');
        if (itemData["'comment'"]) $props.append('<span><span style="color:#999;">备注:</span> ' + esc(itemData["'comment'"]) + '</span>');
        var $btns = $('<div style="float:right;"></div>');
        $('<button type="button" class="layui-btn layui-btn-xs layui-btn-warm">上移</button>').on('click', function () { var p = $li.prev(); if (p.length) $li.insertBefore(p); }).appendTo($btns);
        $('<button type="button" class="layui-btn layui-btn-xs layui-btn-normal">下移</button>').on('click', function () { var n = $li.next(); if (n.length) $li.insertAfter(n); }).appendTo($btns);
        if (data && data.pid) {
            $('<button type="button" class="layui-btn layui-btn-xs">更新</button>').on('click', function () {
                ctx.updateArgs = v; ctx.args = { type: v.type, id: v.id, name: v.name };
                openReferModal(true);
            }).appendTo($btns);
        }
        $('<button type="button" class="layui-btn layui-btn-xs layui-btn-danger">删除</button>').on('click', function () { $li.remove(); toggleEmpty(); }).appendTo($btns);
        $h.append($btns); $li.append($h).append($props);
        $content.append($li);
    }

    function toggleEmpty() {
        ['field', 'item', 'comment', 'condition'].forEach(function (k) {
            $('#not' + k).toggle($('#item' + k).children().length === 0);
        });
    }

    function updateItem() {
        if (app.validate('referForm')) return;
        var id = $('#referForm [name="id"]').val();
        var name = $('#referForm [name="name"]').val();
        var validate = getValidateVal();
        var d = '';
        if (ctx.updateArgs.type === 'select') d = $('#referForm [name="data"]').val().replace(/\n/g, '/');
        if (ctx.updateArgs.type === 'condition') d = $('#referForm [name="args"]').val();
        var comment = $('#referForm [name="comment"]').val();

        if (id !== ctx.updateArgs.id && $('#' + cssEsc(id)).length != 0) { app.showAlert(app.warning, '控件已存在'); return; }

        var o = {
            'processItem.piid': ctx.updateArgs.piid,
            'processItem.id': id,
            'processItem.name': name,
            'processItem.validate': validate,
            'processItem.data': d,
            'processItem.comment': comment
        };
        app.post(api.approval.updateProcessItem, o, function () {
            app.showAlert(app.success, '更新成功');
            layer.close(ctx.editIdx); ctx.editIdx = null;
            // 局部更新 DOM
            var $li = $('#' + cssEsc(ctx.updateArgs.id));
            $li.attr('id', cssEsc(id));
            $li.data($.extend($li.data(), { "'id'": id, "'name'": name, "'validate'": validate, "'data'": d, "'comment'": comment }));
            $li.find('b').first().text(name);
            $li.find('div.app-process-props, div:last').remove(); // 简化：重新构造 props
            var $props = $('<div style="font-size:12px;color:#666;margin-top:4px;"></div>');
            $props.append('<span style="margin-right:12px;"><span style="color:#999;">标识:</span> ' + esc(id) + '</span>');
            $props.append('<span style="margin-right:12px;"><span style="color:#999;">类型:</span> ' + esc(ctx.updateArgs.type) + '</span>');
            $props.append('<span style="margin-right:12px;"><span style="color:#999;">验证:</span> ' + esc(validate) + '</span>');
            if (d) $props.append('<span style="margin-right:12px;"><span style="color:#999;">数据:</span> ' + esc(d) + '</span>');
            if (comment) $props.append('<span><span style="color:#999;">备注:</span> ' + esc(comment) + '</span>');
            $li.append($props);
        });
    }

    // ===== 提交 =====
    $('#submitBtn').on('click', function () {
        if (app.validate('processForm')) return;
        var refers = [];
        var idx = 0;
        $('#itemfield .app-process-item, #itemitem .app-process-item, #itemcomment .app-process-item, #itemcondition .app-process-item').each(function () {
            var d = $(this).data();
            refers.push($.extend({}, d, { "'sort'": idx++ }));
        });
        var o = {
            'process.name': $('#processForm [name="name"]').val(),
            'process.no': $('#processForm [name="no"]').val(),
            'process.code': $('#processForm [name="code"]').val(),
            'processItems': refers
        };
        if (data && data.pid) {
            o['process.pid'] = data.pid;
            app.post(api.approval.updateProcess, o, function () { app.showAlert(app.success, '修改成功'); app.closePopup(); });
        } else {
            app.post(api.approval.addProcess, o, function () {
                app.showAlert(app.success, '创建成功'); app.closePopup();
            });
        }
    });

    function esc(s) { return $('<div/>').text(s == null ? '' : s).html(); }
    function cssEsc(s) { return String(s == null ? '' : s).replace(/[^a-zA-Z0-9_-]/g, '_'); }
});
}); // end app.ready
