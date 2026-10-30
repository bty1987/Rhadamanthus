/** app/js/construction/constructionProfile4detail.js —— 工程单画像（动态问卷表单）
 *  上下文：app.params.constructionProfile = { cpid?|cid?|orderId?, type?, profile: { type } }。
 *  流程：queryConstructionProfileByCid/ByOrderId → 无则按模板 makeConstructionProfile → 再查 → 渲染。
 *  题型（customer.survey）：0文本/1输入/2单选/3多选/4日期。保存 handleConstructionProfile
 *  （options[k].checked：0=选中，1=未选中）。 */
app.ready(function () {
layui.use(['laydate', 'layer', 'jquery'], function () {
    var laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var SURVEY = constructionCommon.SURVEY;
    var ctx = app.params.constructionProfile || {};
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
        if (ctx.cpid) {
            url = api.construction.queryConstructionProfileByCpid;
            args = { 'constructionProfile.cpid': ctx.cpid };
        }
        if (ctx.cid) {
            url = api.construction.queryConstructionProfileByCid;
            args = { 'constructionProfile.cid': ctx.cid, 'constructionProfile.type': ctx.type };
        }
        if (ctx.orderId) {
            url = api.construction.queryConstructionProfileByOrderId;
            args = { 'constructionProfile.orderId': ctx.orderId, 'constructionProfile.type': ctx.type };
        }
        if (!url) { app.showAlert(app.warning, '缺少配置参数'); return; }

        var isMake = true;
        app.post(url, args, function (res) {
            if (res.constructionProfiles && res.constructionProfiles.length) {
                state.profiles = state.profiles.concat(res.constructionProfiles);
            }
            if (res.constructionProfile && res.constructionProfile.items) {
                state.profiles.push(res.constructionProfile);
            }
            $.each(state.profiles, function (i, v) {
                display(v);
                if (ctx.profile && v.type == ctx.profile.type) isMake = false;
            });
        }, null, false);

        if (!isMake) return;
        if (!ctx.profile) { app.showAlert(app.warning, '缺少配置参数'); return; }

        var template = null;
        // 标签(type=4)用独立模板，其他复用通用模板
        var templateKey = ctx.profile.type == 4 ? 'CONSTRUCTION_TAG_PROFILE_TEMPLATE' : 'CONSTRUCTION_PROFILE_TEMPLATE';
        app.post(api.system.querySystemConfigByKey, { 'systemConfig.key': templateKey }, function (res) {
            template = res.systemConfig ? res.systemConfig.value : null;
        }, null, false);
        if (!template) { app.showAlert(app.error, '工程配置模板不存在'); return; }

        args['constructionProfile.tid'] = template;
        args['constructionProfile.type'] = ctx.profile.type;

        app.post(api.construction.makeConstructionProfile, args, function (res) {
            args['constructionProfile.cpid'] = res.constructionProfile.cpid;
        }, null, false);

        app.post(api.construction.queryConstructionProfileByCpid, args, function (res) {
            display(res.constructionProfile || {});
        }, null, false);
    }

    function display(profile) {
        if (profile.name) $('#pfName').text(profile.name);
        var state0 = profile.status;

        $.each(profile.items || [], function (i, v) {
            if (v.type == SURVEY.TYPE_TEXT_INT) {
                $('#pfTitle').text(v.content || '');
                return;
            }

            var html = '<div class="pf-item" data-cpiid="' + v.cpiid + '" data-type="' + v.type + '">'
                + '<label>' + (v.name || '') + (v.require == 0 ? '<span class="orange">*</span>' : '') + '<\/label>'
                + '<div class="pf-body" id="body' + v.cpiid + '"><\/div><\/div>';
            var $item = $(html);
            $('#itemlist').append($item);
            var $body = $item.find('.pf-body');

            if (v.type == SURVEY.TYPE_INPUT_INT) {
                $body.html('<textarea id="' + v.cpiid + 'textarea" ' + (v.require == 0 ? 'data-required="1"' : '') + '>' + (v.content || '') + '<\/textarea>');
            } else if (v.type == SURVEY.TYPE_SINGLE_INT || v.type == SURVEY.TYPE_MULTIPLE_INT) {
                var inputType = v.type == SURVEY.TYPE_SINGLE_INT ? 'radio' : 'checkbox';
                var opts = '';
                $.each(v.options || [], function (j, option) {
                    opts += '<span class="pf-opt"><input type="' + inputType + '" name="form-field-checkbox' + v.cpiid + '" data-cpoid="' + option.cpoid + '" '
                        + (option.checked == 0 ? 'checked' : '') + ' title="' + (option.title || '') + '"><\/span>';
                });
                $body.html(opts);
            } else if (v.type == SURVEY.TYPE_DATE_INT) {
                $body.html('<input type="text" class="layui-input" style="width:220px;" id="' + v.cpiid + 'date" readonly value="' + (v.content || '') + '" placeholder="yyyy-MM-dd">');
                laydate.render({ elem: '#' + v.cpiid + 'date', format: 'yyyy-MM-dd' });
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
            var cpiid = $item.attr('data-cpiid');
            var type = parseInt($item.attr('data-type'), 10);
            options['constructionProfile.items[' + i + '].cpiid'] = cpiid;

            if (type == SURVEY.TYPE_INPUT_INT) {
                var $ta = $('#' + cpiid + 'textarea');
                if ($ta.attr('data-required') && !$.trim($ta.val())) { valid = false; $ta.css('border-color', 'red'); }
                options['constructionProfile.items[' + i + '].content'] = $ta.val();
            }
            if (type == SURVEY.TYPE_DATE_INT) {
                options['constructionProfile.items[' + i + '].content'] = $('#' + cpiid + 'date').val();
            }
            if (type == SURVEY.TYPE_SINGLE_INT || type == SURVEY.TYPE_MULTIPLE_INT) {
                $item.find('input[data-cpoid]').each(function (k) {
                    var $n = $(this);
                    options['constructionProfile.items[' + i + '].options[' + k + '].cpoid'] = $n.attr('data-cpoid');
                    options['constructionProfile.items[' + i + '].options[' + k + '].checked'] = $n.prop('checked') ? 0 : 1;
                });
            }
        });
        if (!valid) { app.showAlert(app.warning, '请填写必填项'); return; }

        app.showConfirm('是否提交工程配置信息?', function () {
            app.post(api.construction.handleConstructionProfile, options, function () {
                app.showAlert(app.success, '工程配置提交成功');
            });
        });
    });
});
}); // end app.ready
