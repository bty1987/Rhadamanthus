/** app/js/customer/customerProfile4detail.js —— 客户画像详情（旧 customerProfile4detail.js → layui）
 *  上下文：app.params.customer = { cpid } | { csid, type } | { cid } | { orderId }，可选 profile.type。
 *  流程：按上下文取画像（queryCustomerProfileByCpid/Csid/Cid/OrderId）→ 逐份渲染动态表单
 *  （题型：0文本/1输入框/2单选/3多选/4日期，module='customer' clazz='survey'）。
 *  无画像且带 profile.type 时按系统配置模板 makeCustomerProfile 后再查再渲染。
 *  保存：handleCustomerProfile（items[i].content / options[k].checked，checked: 0选中/1未选中）。
 *  ★ 跨模块页：decoration/construction/data 以 app.popup 嵌入，params.customer 接口保持稳定。 */
app.ready(function () {
layui.use(['form', 'laydate', 'layer', 'jquery'], function () {
    var form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    var S = customerCommon.SURVEY;
    customerCommon.ensureApiStubs();

    var ctx = customerCommon.ctx('customer') || {};
    var profiles = [];
    var profileItems = [];

    $('#btnBack').on('click', function () {
        // 弹窗内：关闭当前弹窗（父窗 layer），iframe 模式下 parent 关闭
        try {
            if (parent && parent.layui) parent.layui.layer.closeAll();
            else layer.closeAll();
        } catch (e) { layer.closeAll(); }
    });

    show();
    handle();

    // ==================== 加载画像 ====================
    function show() {
        var url = null;
        var args = {};

        if (ctx.cpid != null && ctx.cpid !== '') {
            url = api.customer.queryCustomerProfileByCpid;
            args = { 'customerProfile.cpid': ctx.cpid };
        }
        if (ctx.csid != null && ctx.csid !== '') {
            url = api.customer.queryCustomerProfileByCsid;
            args = { 'customerProfile.csid': ctx.csid, 'customerProfile.type': ctx.type };
        }
        if (ctx.cid != null && ctx.cid !== '') {
            url = api.customer.queryCustomerProfileByCid;
            args = { 'customerProfile.cid': ctx.cid };
        }
        if (ctx.orderId != null && ctx.orderId !== '') {
            url = api.customer.queryCustomerProfileByOrderId;
            args = { 'customerProfile.orderId': ctx.orderId };
        }
        if (!url) return;

        var isMake = true;

        app.post(url, args, function (res) {
            if (res.customerProfiles && res.customerProfiles.length != 0)
                profiles = profiles.concat(res.customerProfiles);

            if (res.customerProfile && res.customerProfile.items)
                profiles.push(res.customerProfile);

            $.each(profiles, function (i, v) {
                display(v);
                if (ctx.profile && v.type == ctx.profile.type) isMake = false;
            });
        }, null, false);

        if (!isMake) return;
        if (!ctx.profile || !ctx.profile.type) return;

        var template = null;
        app.post(api.system.querySystemConfigByKey, {
            'systemConfig.key': 'CUSTOMER_PROFILE_TEMPLATE_' + ctx.profile.type
        }, function (res) {
            template = res.systemConfig ? res.systemConfig.value : null;
        }, null, false);

        if (!template) {
            app.showAlert(app.error, '客户画像模板不存在');
            return;
        }

        args['customerProfile.tid'] = template;
        args['customerProfile.type'] = ctx.profile.type;

        app.post(api.customer.makeCustomerProfile, args, function (res) {
            args['customerProfile.cpid'] = res.customerProfile.cpid;
        }, null, false);

        app.post(api.customer.queryCustomerProfileByCpid, args, function (res) {
            if (res.customerProfile) display(res.customerProfile);
        }, null, false);
    }

    // ==================== 渲染动态表单 ====================
    function display(profile) {
        $('#name').text(profile.name || '');

        var state = profile.status;

        $.each(profile.items || [], function (i, v) {
            var $contentDiv = null;

            if (v.type != S.TYPE_TEXT_INT) {
                $contentDiv = $('<div class="profile-item" style="display:flex;align-items:flex-start;margin:8px 0;">')
                    .addClass('item').attr({ id: v.cpiid, cpiid: v.cpiid, type: v.type })
                    .appendTo($('#itemlist'));
                var $title = $('<label style="min-width:160px;padding-top:6px;">' + (v.name || '') + '</label>').appendTo($contentDiv);
                if (v.require == 0) $title.css('color', '#FF5722');
            }

            if (v.type == S.TYPE_TEXT_INT) {
                // 文本说明题：内容作为标题展示
                if (i === 0) $('#name').text($('#name').text() + ' ' + (v.content || ''));
            } else if (v.type == S.TYPE_INPUT_INT) {
                var $textarea = $('<textarea class="layui-textarea" style="flex:1;min-height:60px;">')
                    .prop('id', v.cpiid + 'textarea').val(v.content || '').appendTo($contentDiv);
                if (v.require == 0) $textarea.addClass('v_required');
            } else if (v.type == S.TYPE_SINGLE_INT || v.type == S.TYPE_MULTIPLE_INT) {
                var $group = $('<div style="flex:1;line-height:36px;">').prop('id', 'form-field-checkbox' + v.cpiid).appendTo($contentDiv);
                if (v.require == 0) $group.addClass('v_radio');
                $.each(v.options || [], function (j, option) {
                    elect($group, option, v.type);
                });
            } else if (v.type == S.TYPE_DATE_INT) {
                var $date = $('<input type="text" class="layui-input" style="flex:1;" readonly>')
                    .prop('id', v.cpiid + 'date').val(v.content || '').appendTo($contentDiv);
                laydate.render({ elem: '#' + v.cpiid + 'date', type: 'date' });
                if (v.require == 0) $date.addClass('v_required');
            }
        });

        $('#itemlist').append('<hr style="border:none;border-top:1px dashed #ddd;margin:16px 0;">');

        profileItems = profileItems.concat(profile.items || []);
    }

    function elect($group, option, type) {
        var id = 'opt_' + option.cpoid;
        var line = $('<span style="display:inline-block;margin-right:18px;white-space:nowrap;"></span>').appendTo($group);
        var $input = $('<input type="' + (type == S.TYPE_SINGLE_INT ? 'radio' : 'checkbox') + '">')
            .attr({ id: id, name: 'form-field-checkbox' + option.cpiid, cpoid: option.cpoid, title: option.title || '' })
            .appendTo(line);
        if (type == S.TYPE_SINGLE_INT) $input.attr('name', 'radio_' + option.cpiid);
        if (option.checked == 0) $input.attr('checked', true);
        // layui checkbox/radio 需要紧邻的 title 文本
        $('<label for="' + id + '" style="margin-left:4px;">' + (option.title || '') + '</label>').appendTo(line);
    }

    // ==================== 保存 ====================
    function handle() {
        var $execute = $('<div id="exDiv" style="text-align:right;"></div>').appendTo($('#particulars'));
        $('<button class="layui-btn" type="button" id="execute">保存</button>').appendTo($execute);

        $('#execute').on('click', function () {
            if (app.validate('itemlist')) return false;

            var options = { 'customerProfile.cpid': 0 };
            var items = $('#itemlist .item');

            $.each(items, function (i, v) {
                var item = $(v);
                var cpiid = item.attr('cpiid');
                var type = item.attr('type');

                options['customerProfile.items[' + i + '].cpiid'] = cpiid;

                if (type == S.TYPE_INPUT_INT) {
                    options['customerProfile.items[' + i + '].content'] = $('#' + cpiid + 'textarea').val();
                }
                if (type == S.TYPE_DATE_INT) {
                    options['customerProfile.items[' + i + '].content'] = $('#' + cpiid + 'date').val();
                }
                if (type == S.TYPE_SINGLE_INT || type == S.TYPE_MULTIPLE_INT) {
                    var selector = type == S.TYPE_SINGLE_INT ? "input[type='radio']" : "input[type='checkbox']";
                    var soptions = item.find(selector);
                    $.each(soptions, function (k, n) {
                        var subt = $(n);
                        var cpoid = subt.attr('cpoid');
                        options['customerProfile.items[' + i + '].options[' + k + '].cpoid'] = cpoid;
                        options['customerProfile.items[' + i + '].options[' + k + '].checked'] = subt.prop('checked') ? 0 : 1;
                    });
                }
            });

            app.showConfirm('是否提交客户画像信息', function () {
                app.post(api.customer.handleCustomerProfile, options, function () {
                    app.showAlert(app.success, '操作成功');
                });
            });
        });
    }
});
}); // end app.ready
