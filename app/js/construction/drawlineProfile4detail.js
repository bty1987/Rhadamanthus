/** app/js/construction/drawlineProfile4detail.js —— 放线单画像（动态问卷表单）
 *  上下文：app.params.drawlineProfile = { dpid?|dlid?|orderId?, type?, profile: { type } }。
 *  流程：queryDrawlineProfileByDlid/ByOrderId → 无则按模板 makeDrawlineProfile → 再查 → 渲染。
 *  题型（customer.survey）：0文本/1输入/2单选/3多选/4日期。保存 handleDrawlineProfile
 *  （options[k].checked：0=选中，1=未选中）。 */
app.ready(function () {
layui.use(['laydate', 'layer', 'jquery'], function () {
    var laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var SURVEY = constructionCommon.SURVEY;
    var ctx = app.params.drawlineProfile || {};
    var state = { profiles: [] };

    $('#btnBack').on('click', function () {
        if (window.parent && window.parent.layui) {
            try { parent.layer.closeAll(); return; } catch (e) {}
        }
        app.closePopup();
    });

    show();

    function show() {
        var url = null, args = null;
        if (ctx.dpid) {
            url = api.construction.queryDrawlineProfileByDpid;
            args = { 'drawlineProfile.dpid': ctx.dpid };
        }
        if (ctx.dlid) {
            url = api.construction.queryDrawlineProfileByDlid;
            args = { 'drawlineProfile.dlid': ctx.dlid, 'drawlineProfile.type': ctx.type };
        }
        if (ctx.orderId) {
            url = api.construction.queryDrawlineProfileByOrderId;
            args = { 'drawlineProfile.orderId': ctx.orderId, 'drawlineProfile.type': ctx.type };
        }
        if (!url) { app.showAlert(app.warning, '缺少配置参数'); return; }

        var isMake = true;
        app.post(url, args, function (res) {
            if (res.drawlineProfiles && res.drawlineProfiles.length) {
                state.profiles = state.profiles.concat(res.drawlineProfiles);
            }
            if (res.drawlineProfile && res.drawlineProfile.items) {
                state.profiles.push(res.drawlineProfile);
            }
            $.each(state.profiles, function (i, v) {
                display(v);
                if (ctx.profile && v.type == ctx.profile.type) isMake = false;
            });
        }, null, false);

        if (!isMake) return;
        if (!ctx.profile) { app.showAlert(app.warning, '缺少配置参数'); return; }

        var template = null;
        var templateKey = ctx.profile.type == 4 ? 'DRAWLINE_TAG_PROFILE_TEMPLATE' : 'DRAWLINE_PROFILE_TEMPLATE';
        app.post(api.system.querySystemConfigByKey, { 'systemConfig.key': templateKey }, function (res) {
            template = res.systemConfig ? res.systemConfig.value : null;
        }, null, false);
        if (!template) { app.showAlert(app.error, '放线配置模板不存在'); return; }

        args['drawlineProfile.tid'] = template;
        args['drawlineProfile.type'] = ctx.profile.type;

        app.post(api.construction.makeDrawlineProfile, args, function (res) {
            args['drawlineProfile.dpid'] = res.drawlineProfile.dpid;
        }, null, false);

        app.post(api.construction.queryDrawlineProfileByDpid, args, function (res) {
            display(res.drawlineProfile || {});
        }, null, false);
    }

    function display(profile) {
        if (profile.name) $('#pfName').text(profile.name);

        $.each(profile.items || [], function (i, v) {
            if (v.type == SURVEY.TYPE_TEXT_INT) {
                $('#pfTitle').text(v.content || '');
                return;
            }

            var html = '<div class="pf-item" data-dpiid="' + v.dpiid + '" data-type="' + v.type + '">'
                + '<label>' + (v.name || '') + (v.require == 0 ? '<span class="orange">*</span>' : '') + '<\/label>'
                + '<div class="pf-body"><\/div><\/div>';
            var $item = $(html);
            $('#itemlist').append($item);
            var $body = $item.find('.pf-body');

            if (v.type == SURVEY.TYPE_INPUT_INT) {
                $body.html('<textarea id="' + v.dpiid + 'textarea" ' + (v.require == 0 ? 'data-required="1"' : '') + '>' + (v.content || '') + '<\/textarea>');
            } else if (v.type == SURVEY.TYPE_SINGLE_INT || v.type == SURVEY.TYPE_MULTIPLE_INT) {
                var inputType = v.type == SURVEY.TYPE_SINGLE_INT ? 'radio' : 'checkbox';
                var opts = '';
                $.each(v.options || [], function (j, option) {
                    opts += '<span class="pf-opt"><input type="' + inputType + '" name="form-field-checkbox' + v.dpiid + '" data-dpoid="' + option.dpoid + '" '
                        + (option.checked == 0 ? 'checked' : '') + ' title="' + (option.title || '') + '"><\/span>';
                });
                $body.html(opts);
            } else if (v.type == SURVEY.TYPE_DATE_INT) {
                $body.html('<input type="text" class="layui-input" style="width:220px;" id="' + v.dpiid + 'date" readonly value="' + (v.content || '') + '" placeholder="yyyy-MM-dd">');
                laydate.render({ elem: '#' + v.dpiid + 'date', format: 'yyyy-MM-dd' });
            }
        });
        $('#itemlist').append('<hr style="border:none;border-top:1px dashed #e6e6e6;margin:16px 0;">');
    }

    // —— 保存 ——
    $('#execute').on('click', function () {
        var options = {};
        var valid = true;
        var $items = $('#itemlist .pf-item');
        $.each($items, function (i, el) {
            var $item = $(el);
            var dpiid = $item.attr('data-dpiid');
            var type = parseInt($item.attr('data-type'), 10);
            options['drawlineProfile.items[' + i + '].dpiid'] = dpiid;

            if (type == SURVEY.TYPE_INPUT_INT) {
                var $ta = $('#' + dpiid + 'textarea');
                if ($ta.attr('data-required') && !$.trim($ta.val())) { valid = false; $ta.css('border-color', 'red'); }
                options['drawlineProfile.items[' + i + '].content'] = $ta.val();
            }
            if (type == SURVEY.TYPE_DATE_INT) {
                options['drawlineProfile.items[' + i + '].content'] = $('#' + dpiid + 'date').val();
            }
            if (type == SURVEY.TYPE_SINGLE_INT || type == SURVEY.TYPE_MULTIPLE_INT) {
                $item.find('input[data-dpoid]').each(function (k) {
                    var $n = $(this);
                    options['drawlineProfile.items[' + i + '].options[' + k + '].dpoid'] = $n.attr('data-dpoid');
                    options['drawlineProfile.items[' + i + '].options[' + k + '].checked'] = $n.prop('checked') ? 0 : 1;
                });
            }
        });
        if (!valid) { app.showAlert(app.warning, '请填写必填项'); return; }

        app.showConfirm('是否提交放线配置信息?', function () {
            app.post(api.construction.handleDrawlineProfile, options, function () {
                app.showAlert(app.success, '放线配置提交成功');
            });
        });
    });
});
}); // end app.ready
