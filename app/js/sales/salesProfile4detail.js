/** app/js/sales/salesProfile4detail.js —— 销售单品牌满意度
 * 上下文：app.params.sales = {sid, orderId}
 * 流程：先查 querySalesProfileByOrderId；若无，取系统配置模板后 makeSalesProfile 创建。
 * 支持：保存内容、添加品牌、生成满意度、处理。 */
app.ready(function () {
layui.use(['layer', 'form', 'jquery'], function () {
    var layer = layui.layer, form = layui.form, $ = layui.jquery;
    var ctx = app.params.sales || {};
    var state = { profile: null, spid: null, bid: null, brandIdx: layer.open ? 0 : 0, makeIdx: null };
    $('#orderId').val(ctx.orderId);
    $('#orderId2').val(ctx.orderId);
    init();

    function init() {
        app.post(api.sales.querySalesProfileByOrderId, { 'salesProfile.orderId': ctx.orderId }, function (res) {
            state.profile = res.salesProfile || null;
            if (state.profile) show();
            else tryMake();
        }, function () { tryMake(); });
    }
    function tryMake() {
        var template = null;
        app.post(api.system.querySystemConfigByKey, { 'systemConfig.key': 'SALES_PROFILE_TEMPLATE' }, function (res) {
            template = res.systemConfig && res.systemConfig.value;
            if (template == null) { app.showAlert(app.error, '满意度模板不存在'); return; }
            app.showConfirm('是否创建满意度?', function () {
                app.post(api.sales.makeSalesProfile, { 'salesProfile.orderId': ctx.orderId, 'salesProfile.tid': template }, function () {
                    init();
                });
            });
        });
    }
    function show() {
        var p = state.profile || {};
        state.spid = p.spid;
        $('#name').val(p.name || '');
        $('#title').val(p.title || '');
        $('#content').val(p.content || '');
        $('#particulars').val(p.particulars || '');
        var html = '';
        $.each(p.items || [], function (i, v) {
            if (v.type === 1) {
                html += '<div class="layui-form-item"><label class="layui-form-label">' + (v.name || '') + '</label><div class="layui-input-block"><input type="text" class="layui-input brandItem" data-spiid="' + v.spiid + '" data-type="' + v.type + '" value="' + (v.content || '') + '"></div></div>';
            } else if (v.type === 2) {
                var opts = '';
                $.each(v.options || [], function (j, n) { opts += '<input type="radio" name="opt' + v.spiid + '" value="' + (n.soid || '') + '" title="' + (n.title || '') + '"' + (n.checked === 0 ? ' checked' : '') + '>'; });
                html += '<div class="layui-form-item"><label class="layui-form-label">' + (v.name || '') + '</label><div class="layui-input-block brandItem" data-spiid="' + v.spiid + '" data-type="' + v.type + '">' + opts + '</div></div>';
            }
        });
        $('#itemlist').html(html || '<span class="layui-badge layui-bg-gray">无品牌项</span>');
        form.render();
    }
    function save() {
        var opt = { 'salesProfile.spid': state.spid, 'salesProfile.title': $('#title').val(), 'salesProfile.content': $('#content').val(), 'salesProfile.particulars': $('#particulars').val() };
        // 收集品牌项
        var idx = 0;
        $('.brandItem').each(function () {
            var $el = $(this), spiid = $el.attr('data-spiid'), type = $el.attr('data-type');
            if (type == '1' || type === 1) {
                opt['salesProfiles[' + idx + '].spiid'] = spiid;
                opt['salesProfiles[' + idx + '].content'] = $el.val();
                idx++;
            } else if (type == '2' || type === 2) {
                var checked = $('input[name="opt' + spiid + '"]:checked');
                if (checked.length) {
                    opt['salesProfiles[' + idx + '].spiid'] = spiid;
                    opt['salesProfiles[' + idx + '].content'] = checked.attr('title');
                    opt['salesProfiles[' + idx + '].salesProfileOption.soid'] = checked.val();
                    idx++;
                }
            }
        });
        app.post(api.sales.handleSalesProfile, opt, function () { app.showAlert(app.success, '保存成功'); });
    }
    function handle() {
        app.post(api.sales.handleSalesProfile, { 'salesProfile.spid': state.spid }, function () { app.showAlert(app.success, '处理成功'); });
    }
    function openAddBrand() {
        $('#brandName').val('');
        state.brandIdx = layer.open({ type: 1, title: '添加品牌', content: $('#addBrandBox'), area: ['420px', 'auto'] });
    }
    function doAddBrand() {
        var name = $.trim($('#brandName').val());
        if (!name) { app.showAlert(app.warning, '请输入品牌名'); return; }
        app.post(api.data.queryBrandByPinyin, { 'brand.pinyin': name, 'brand.atttype': 0 }, function (res) {
            var brand = (res.brands && res.brands.length) ? res.brands[0] : null;
            if (!brand) { app.showAlert(app.warning, '未找到品牌'); return; }
            app.post(api.sales.addSalesProfileBrand, { 'salesProfile.spid': state.spid, 'salesProfileBrand.brand.bid': brand.bid }, function () {
                app.showAlert(app.success, '添加成功'); layer.close(state.brandIdx); init();
            });
        });
    }
    function openMake() {
        app.post(api.data.querySurveyTemplate, { 'surveyTemplate.name': '' }, function (res) {
            var list = res.surveyTemplates || [];
            var opts = '<option value="">请选择</option>';
            $.each(list, function (i, v) { opts += '<option value="' + v.stid + '">' + (v.name || '') + '</option>'; });
            $('#surveyTemplate').html(opts); form.render();
            state.makeIdx = layer.open({ type: 1, title: '生成满意度', content: $('#makeProfileBox'), area: ['420px', 'auto'] });
        });
    }
    function doMake() {
        var stid = $('#surveyTemplate').val();
        if (!stid) { app.showAlert(app.warning, '请选择模板'); return; }
        app.post(api.sales.makeSalesProfile, { 'salesProfile.orderId': ctx.orderId, 'salesProfile.tid': stid }, function () {
            app.showAlert(app.success, '生成成功'); layer.close(state.makeIdx); init();
        });
    }
    $('#saveSurvey').on('click', save);
    $('#btnHandle').on('click', handle);
    $('#btnBack').on('click', function () { app.closePopup(); });
    $('#btnAddBrand').on('click', openAddBrand);
    $('#btnBrandSave').on('click', doAddBrand);
    $('#btnMakeProfile').on('click', openMake);
    $('#btnMakeSave').on('click', doMake);
});
}); // end app.ready
