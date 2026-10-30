/** app/js/quotation/quotationProfile4detail.js —— 报价画像详情
 *  装载：qpid 有值 → queryQuotationProfileByQpid；无值 → 按类型取模板（标签4/增减5/其他）
 *  makeQuotationProfile 生成后查询；表单项渲染（文本/输入框/单选/多选/日期）；
 *  保存：handleQuotationProfile（items[].content / options[].checked）。 */
app.ready(function () {
layui.use(['form', 'laydate', 'jquery'], function () {
    var form = layui.form, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qctx = quotationCommon.ctx('quotation') || {};
    var profileType = qctx.profile ? qctx.profile.type : qctx.type;
    var profile = null;
    var profileItems = [];

    var args = {};
    if (qctx.qpid) args['quotationProfile.qpid'] = qctx.qpid;

    var isMake = !qctx.qpid;
    if (isMake && !qctx.profile && profileType == null) {
        app.showAlert(app.warning, '缺少配置参数');
        return;
    }

    if (!isMake) {
        app.post(api.quotation.queryQuotationProfileByQpid, args, function (res) { display(res.quotationProfile); }, null, false);
    } else {
        var templateKey = profileType == 4 ? 'QUOTATION_TAG_PROFILE_TEMPLATE' : (profileType == 5 ? 'QUOTATION_ADDREDUCE_PROFILE_TEMPLATE' : 'QUOTATION_PROFILE_TEMPLATE');
        var template = null;
        app.post(api.system.querySystemConfigByKey, { 'systemConfig.key': templateKey }, function (res) {
            template = res.systemConfig && res.systemConfig.value;
        }, null, false);
        if (!template) { app.showAlert(app.error, '报价配置模板不存在'); return; }
        args['quotationProfile.tid'] = template;
        args['quotationProfile.type'] = profileType;
        if (qctx.qid) args['quotationProfile.qid'] = qctx.qid;
        args['quotationProfile.orderId'] = qctx.orderId;
        app.post(api.quotation.makeQuotationProfile, args, function (res) {
            args['quotationProfile.qpid'] = res.quotationProfile.qpid;
        }, null, false);
        app.post(api.quotation.queryQuotationProfileByQpid, args, function (res) { display(res.quotationProfile); }, null, false);
    }

    function display(p) {
        profile = p;
        $('#profileName').text(p.name || '-');
        var html = '';
        $.each(p.items || [], function (i, v) {
            if (v.type == 0) { $('#profileTitle').text(v.content || ''); return; }
            var required = v.require == 0 ? ' <span style="color:#FF5722;">*<\/span>' : '';
            html += '<div class="layui-form-item profile-item" data-qpiid="' + v.qpiid + '" data-type="' + v.type + '">'
                + '<label class="layui-form-label">' + (v.name || '') + required + '<\/label><div class="layui-input-inline" style="text-align:left;padding-top:9px;">';
            if (v.type == 1) {
                html += '<textarea class="layui-textarea p-input" style="width:420px;height:70px;">' + (v.content || '') + '<\/textarea>';
            } else if (v.type == 2 || v.type == 3) {
                var inputType = v.type == 2 ? 'radio' : 'checkbox';
                html += '<div style="width:560px;">';
                $.each(v.options || [], function (k, opt) {
                    var checked = opt.checked == 0 ? ' checked' : '';
                    html += '<span style="display:inline-block;margin:2px 15px 2px 0;">'
                        + '<input type="' + inputType + '" name="popt' + v.qpiid + '" qmoid="' + opt.qmoid + '" title="' + (opt.content || opt.name || '') + '"' + checked + '><\/span>';
                });
                html += '<\/div>';
            } else if (v.type == 4) {
                html += '<input class="layui-input p-date" readonly style="width:220px;" value="' + (v.content || '') + '">';
            }
            html += '<\/div><\/div>';
        });
        $('#itemlist').html(html || '<p style="color:#999;">暂无配置项<\/p>');
        form.render(null, 'profileForm');
        $('#itemlist .p-date').each(function () {
            layui.laydate.render({ elem: this, type: 'date', format: 'yyyy-MM-dd' });
        });
        profileItems = p.items || [];
    }

    $('#btnExecute').on('click', function () {
        if (!profile) return;
        var options = { 'quotationProfile.qpid': profile.qpid };
        $('#itemlist .profile-item').each(function (i, el) {
            var $item = $(el);
            var qpiid = $item.data('qpiid');
            var type = parseInt($item.data('type'), 10);
            options['quotationProfileItems[' + i + '].qpiid'] = qpiid;
            if (type == 1) options['quotationProfileItems[' + i + '].content'] = $item.find('.p-input').val();
            if (type == 4) options['quotationProfileItems[' + i + '].content'] = $item.find('.p-date').val();
            if (type == 2 || type == 3) {
                $item.find('input[qmoid]').each(function (k, input) {
                    options['quotationProfileItems[' + i + '].options[' + k + '].qmoid'] = $(input).attr('qmoid');
                    options['quotationProfileItems[' + i + '].options[' + k + '].checked'] = $(input).prop('checked') ? 0 : 1;
                });
            }
        });
        app.post(api.quotation.handleQuotationProfile, options, function () {
            app.showAlert(app.info, '操作成功');
        });
    });

    $('#btnBack').on('click', function () { app.closePopup(); });
});
}); // end app.ready
