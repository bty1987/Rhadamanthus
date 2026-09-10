/** app/js/quotation/functionArea.js —— 子功能区配置
 *  列表：pageFunctionArea（版本/名称）；编辑：add/updateFunctionArea（type=2 功能区总额时填总价）；
 *  量房参数：queryFunctionAreaOtem/makeFunctionAreaOtem（文本/单选/多选/输入框 + 选项 + 排序 + 必填）；
 *  分配报价项：弹窗 functionAreaItem.html；状态：updateFunctionAreaForStatus。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var E = quotationCommon.ENUM;
    var state = { page: 1, rows: 10, total: 0, faid: 0 };

    app.post(api.quotation.queryQuotationVersion, {}, function (res) {
        app.bindData($('#sVersion'), res.quotationVersions, 'no', 'name', true);
        app.bindData($('#versionId'), res.quotationVersions, 'no', 'name', false);
        form.render('select');
    }, null, false);

    app.post(api.quotation.queryFunctionAreaType, {}, function (res) {
        app.bindData($('#functionAreaType'), res.functionAreaTypes, 'name', 'name', '未分类');
        form.render('select');
    }, null, false);

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'name', title: '名称', width: 150, fixed: 'left' },
            { field: 'no', title: '编号', width: 100 },
            { field: 'version', title: '报价版本', width: 110, templet: function (d) { return d.version ? d.version.no : ''; } },
            { field: 'functionAreaType', title: '类型', width: 90 },
            { field: 'total', title: '总价', width: 100, templet: function (d) { return qc.money(d.total); } },
            { field: 'functionAreaOrder', title: '排序', width: 70 },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return qc.badge({ 0: '启用', 1: '禁用' }, d.status); } },
            { title: '操作', width: 360, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    function query(pg) {
        state.page = pg || 1;
        app.post(api.quotation.pageFunctionArea, $.extend({}, qc.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30, 100], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    // —— 编辑 ——
    form.on('select(faTypeFilter)', function (obj) {
        if (obj.value == '2') $('#total').removeAttr('disabled');
        else $('#total').attr('disabled', 'disabled').val(0);
    });
    $('#type').attr('lay-filter', 'faTypeFilter');

    function openEdit(v) {
        state.faid = v ? v.faid : 0;
        $('#noItem').toggle(!!v);
        $('#no').prop('disabled', !!v);
        $('#versionId').prop('disabled', !!v);
        if (v) {
            $('#no').val(v.no); $('#name').val(v.name);
            $('#functionAreaOrder').val(v.functionAreaOrder);
            $('#functionAreaType').val(v.functionAreaType);
            $('#versionId').val(v.version.no);
            $('#type').val(v.type);
            if (v.type == 2) { $('#total').val(v.total).removeAttr('disabled'); } else { $('#total').attr('disabled', 'disabled').val(0); }
        } else {
            $('#editBox form')[0].reset();
            $('#total').attr('disabled', 'disabled').val(0);
        }
        form.render(null, 'editForm');
        layer.open({ type: 1, title: state.faid ? '编辑子功能区' : '添加子功能区', content: $('#editBox'), area: ['560px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                if (!$.trim($('#name').val())) { app.showAlert(app.warning, '请填写名称'); return; }
                var url = api.quotation.addFunctionArea;
                var options = {
                    'functionArea.no': $('#no').val(),
                    'functionArea.name': $('#name').val(),
                    'functionArea.functionAreaOrder': $('#functionAreaOrder').val(),
                    'functionArea.functionAreaType': $('#functionAreaType').val(),
                    'functionArea.version.no': $('#versionId').val(),
                    'functionArea.type': $('#type').val(),
                    'functionArea.total': $('#total').val() || 0
                };
                if (state.faid != 0) { url = api.quotation.updateFunctionArea; options['functionArea.faid'] = state.faid; }
                app.post(url, options, function () {
                    app.showAlert(app.info, '操作成功');
                    layer.close(idx); query(state.page);
                });
            } });
    }

    // —— 量房参数 otem 构造器 ——
    function itemHead(title, val) {
        return '<div class="layui-form-item"><label class="layui-form-label">' + title + '</label><div class="layui-input-inline" style="width:340px;">'
            + '<input class="layui-input otem-title" value="' + (val || '') + '"><\/div>'
            + '<button type="button" class="layui-btn layui-btn-xs layui-btn-primary otem-up" title="上移"><i class="layui-icon layui-icon-up"><\/i><\/button>'
            + '<button type="button" class="layui-btn layui-btn-xs layui-btn-primary otem-down" title="下移"><i class="layui-icon layui-icon-down"><\/i><\/button>'
            + '<button type="button" class="layui-btn layui-btn-xs layui-btn-danger otem-del">删除<\/button><\/div>';
    }
    function requireRow(checked) {
        return '<div class="layui-form-item"><label class="layui-form-label">是否必填</label><div class="layui-input-inline">'
            + '<input type="checkbox" name="require" lay-skin="switch" lay-text="必填|选填"' + (checked ? ' checked' : '') + '><\/div><\/div>';
    }
    function drawItem(type, v) {
        var $group = $('<div class="otem-item" data-type="' + type + '"><\/div>');
        if (type == 0) {
            $group.append('<div class="layui-form-item"><label class="layui-form-label">文本内容</label><div class="layui-input-inline" style="width:340px;"><textarea class="layui-textarea otem-content" style="height:80px;">' + (v ? (v.content || '') : '') + '<\/textarea><\/div>'
                + '<button type="button" class="layui-btn layui-btn-xs layui-btn-primary otem-up"><i class="layui-icon layui-icon-up"><\/i><\/button>'
                + '<button type="button" class="layui-btn layui-btn-xs layui-btn-primary otem-down"><i class="layui-icon layui-icon-down"><\/i><\/button>'
                + '<button type="button" class="layui-btn layui-btn-xs layui-btn-danger otem-del">删除<\/button><\/div>');
        } else if (type == 1) {
            $group.append(itemHead('文本内容', v ? (v.name || '') : '')).append(requireRow(v && v.require == 0));
        } else {
            var isRadio = type == 2;
            $group.append(itemHead('题目', v ? (v.name || '') : '')).append(requireRow(v && v.require == 0));
            $group.append('<div class="layui-form-item"><label class="layui-form-label">选项内容</label><div class="layui-input-inline" style="width:220px;"><input class="layui-input otem-option-input" placeholder="输入选项后点添项"><\/div>'
                + '<button type="button" class="layui-btn layui-btn-xs otem-option-add">添项<\/button><\/div>');
            var $opts = $('<div class="layui-form-item"><label class="layui-form-label">所有选项</label><div class="layui-input-inline otem-options" style="width:400px;text-align:left;"><\/div><\/div>');
            $group.append($opts);
            if (v && v.options) {
                $.each(v.options, function (i, o) { addOption($opts, o.title); });
            }
        }
        $group.append('<hr>');
        $('#itemlist').append($group);
        form.render();
    }
    function addOption($opts, title) {
        if (!title) return;
        var $tag = $('<span class="layui-badge layui-bg-blue" style="margin:2px 6px;cursor:pointer;">' + title + ' ✕<\/span>');
        $tag.on('click', function () { $(this).remove(); });
        $opts.append($tag);
    }
    $('#itemlist').on('click', '.otem-del', function () { $(this).closest('.otem-item').next('hr').remove(); $(this).closest('.otem-item').remove(); });
    $('#itemlist').on('click', '.otem-up', function () { var $g = $(this).closest('.otem-item'); var $prev = $g.prevAll('.otem-item:first'); if ($prev.length) $g.insertBefore($prev); });
    $('#itemlist').on('click', '.otem-down', function () { var $g = $(this).closest('.otem-item'); var $next = $g.nextAll('.otem-item:first'); if ($next.length) $g.insertAfter($next); });
    $('#itemlist').on('click', '.otem-option-add', function () {
        var $item = $(this).closest('.otem-item');
        var $input = $item.find('.otem-option-input');
        if ($input.val() === '') return;
        addOption($item.find('.otem-options'), $input.val());
        $input.val('');
    });

    var curOtemFaid = null;
    function openOtem(v) {
        curOtemFaid = v.faid;
        $('#itemlist').empty();
        app.post(api.quotation.queryFunctionAreaOtem, { 'functionAreaOtem.faid': v.faid }, function (res) {
            $.each(res.functionAreaOtems || [], function (i, o) {
                if (o.type == 0) drawItem(0, o);
                else if (o.type == 1) drawItem(1, o);
                else if (o.type == 2) drawItem(2, o);
                else if (o.type == 3) drawItem(3, o);
            });
        });
        layer.open({ type: 1, title: '量房参数 - ' + v.name, content: $('#otemBox'), area: ['760px', '80%'],
            btn: ['保存', '取消'], yes: function (idx) {
                if ($('#itemlist').html().length == 0) { app.showAlert(app.info, '请填写题目后再点击保存'); return; }
                var args = { 'functionAreaOtem.faid': curOtemFaid };
                $('#itemlist .otem-item').each(function (i, el) {
                    var $item = $(el);
                    var type = parseInt($item.data('type'), 10);
                    if (type == 0) {
                        args['functionAreaOtems[' + i + '].name'] = '';
                        args['functionAreaOtems[' + i + '].type'] = 0;
                        args['functionAreaOtems[' + i + '].content'] = $item.find('.otem-content').val();
                        args['functionAreaOtems[' + i + '].require'] = 1;
                    } else if (type == 2 || type == 3) {
                        args['functionAreaOtems[' + i + '].name'] = $item.find('.otem-title').val();
                        args['functionAreaOtems[' + i + '].type'] = type;
                        args['functionAreaOtems[' + i + '].content'] = '';
                        args['functionAreaOtems[' + i + '].require'] = $item.find('input[name="require"]').prop('checked') ? 0 : 1;
                        $item.find('.otem-options .layui-badge').each(function (j, tag) {
                            args['functionAreaOtems[' + i + '].options[' + j + '].title'] = $(tag).text().replace(/ ✕$/, '');
                        });
                    } else if (type == 1) {
                        args['functionAreaOtems[' + i + '].name'] = $item.find('.otem-title').val();
                        args['functionAreaOtems[' + i + '].type'] = 1;
                        args['functionAreaOtems[' + i + '].content'] = '';
                        args['functionAreaOtems[' + i + '].require'] = $item.find('input[name="require"]').prop('checked') ? 0 : 1;
                    }
                });
                app.post(api.quotation.makeFunctionAreaOtem, args, function () {
                    app.showAlert(app.info, '操作成功');
                    layer.close(idx); query(state.page);
                });
            } });
    }
    $('#textBtn').on('click', function () { drawItem(0, null); });
    $('#radioBtn').on('click', function () { drawItem(2, null); });
    $('#checkBtn').on('click', function () { drawItem(3, null); });
    $('#inputBtn').on('click', function () { drawItem(1, null); });

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'edit') {
            app.showConfirm('功能区的类型修改,会清空以前包含的报价项,是否确认修改?', function () { openEdit(v); });
        } else if (obj.event === 'otem') {
            openOtem(v);
        } else if (obj.event === 'assign') {
            app.params.data = $.extend({}, app.params.data, { functionArea: v });
            app.popup('views/quotation/functionAreaItem.html', '功能区-报价项', null, { area: ['85%', '85%'] });
        } else if (obj.event === 'category') {
            app.params.data = $.extend({}, app.params.data, { functionArea: v });
            app.popup('views/quotation/functionAreaCategory.html', '功能区-品类规格', null, { area: ['85%', '85%'] });
        } else if (obj.event === 'status') {
            app.post(api.quotation.updateFunctionAreaForStatus, { 'functionArea.faid': v.faid, 'functionArea.status': v.status == 0 ? 1 : 0 }, function () {
                app.showAlert(app.info, '操作成功'); query(state.page);
            });
        }
    });

    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    query(1);
});
}); // end app.ready
