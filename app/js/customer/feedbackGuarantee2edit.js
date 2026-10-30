/** app/js/customer/feedbackGuarantee2edit.js —— 编辑维修（旧 feedbackGuarantee2edit.js → layui）
 *  上下文：app.params.{fid, fgid}。加载：queryFeedbackGuaranteeByFgid 回填；
 *  保存：updateFeedbackGuarantee + 可选图片 addFeedbackDrawing(type=1)。 */
app.ready(function () {
layui.use(['form', 'laydate', 'layer', 'jquery'], function () {
    var form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var fid = customerCommon.ctx('fid');
    var fgid = customerCommon.ctx('fgid');
    var state = { resUrl: null, bid: null };

    if (fgid == null || fgid === '') { app.showAlert(app.warning, '缺少维修上下文'); return; }

    laydate.render({ elem: '#e_reportedDate', type: 'date' });

    // 部门类型多选
    var deptHtml = '';
    $.each(E.guaranteeDeptType, function (k, v) {
        deptHtml += '<label style="margin-right:12px;white-space:nowrap;"><input type="checkbox" name="deptType" value="' + v + '" title="' + v + '"><\/label>';
    });
    $('#e_choiceDeptType').html(deptHtml);

    // 工种多选（值=明细中文名）
    var WORK_GROUPS = [
        { name: '水工', map: E.guaranteePlumberType },
        { name: '电工', map: E.guaranteeElectricianType },
        { name: '瓦工', map: E.guaranteeTilerType },
        { name: '木工', map: E.guaranteeCarpenterType },
        { name: '油工', map: E.guaranteePainterType }
    ];
    var workHtml = '';
    $.each(WORK_GROUPS, function (i, g) {
        workHtml += '<div style="margin-bottom:4px;"><b style="margin-right:8px;">' + g.name + '：<\/b>';
        $.each(g.map, function (k, v) {
            workHtml += '<label style="margin-right:12px;white-space:nowrap;"><input type="checkbox" name="workType" value="' + v + '" title="' + v + '"><\/label>';
        });
        workHtml += '<\/div>';
    });
    $('#checkboxs').html(workHtml);
    form.render('checkbox');

    // 渠道 11/12 → 升级渠道
    form.on('select(sourceFilter)', function (obj) {
        if (obj.value == 11 || obj.value == 12) $('#es_upgradeSource').show();
        else $('#es_upgradeSource').hide();
        form.render('select');
    });

    // 品牌检索
    $('#e_brandName').on('input', function () {
        var kw = $.trim($(this).val());
        if (!kw) return;
        app.post(api.data.queryBrandByPinyin, { 'brand.pinyin': kw, 'brand.atttype': 0 }, function (res) {
            var $list = $('#brandList').empty();
            $.each((res.brands || []).slice(0, 10), function (i, b) {
                $('<a style="margin-right:10px;cursor:pointer;color:#01AAED;">').text(b.name).data('bid', b.bid).appendTo($list);
            });
        });
    });
    $('#brandList').on('click', 'a', function () {
        state.bid = $(this).data('bid');
        $('#e_brandName').val($(this).text());
        $('#brandList').empty();
    });

    // —— 回填 ——
    app.post(api.customer.queryFeedbackGuaranteeByFgid, { 'feedbackGuarantee.fgid': fgid }, function (res) {
        var g = res.feedbackGuarantee;
        if (!g) return;
        $('#e_orderId').val(g.orderId);
        $('#e_phone').val(g.phone);
        $('#e_source').val(g.source);
        $('#e_content').val(g.content);
        $('#editForm [name="cutomerType"]').val(g.cutomerType);
        $('#e_brandName').val(g.brands);
        state.bid = g.bids;
        $('#e_reportedDate').val(g.reportedDate);
        $('#e_renovationYear').val(g.renovationYear);
        $('#editForm [name="repairResult"]').val(g.repairResult);
        $('#editForm [name="upgradeSource"]').val(g.upgradeSource != null ? g.upgradeSource : 0);
        if (g.source == 11 || g.source == 12) $('#es_upgradeSource').show();

        var checkArray = (g.deptType || '').split(',');
        $('#e_choiceDeptType input[name="deptType"]').each(function () {
            $(this).prop('checked', $.inArray($(this).val(), checkArray) !== -1);
        });
        var workTypeArray = (g.workType || '').split(',');
        $('#checkboxs input[name="workType"]').each(function () {
            $(this).prop('checked', $.inArray($(this).val(), workTypeArray) !== -1);
        });
        form.render('select');
        form.render('checkbox');
    }, null, false);

    // —— 上传 ——
    app.upload({
        elem: '#btnUpload', url: 'uploadOther.do',
        done: function (res) {
            state.resUrl = res.resUrl;
            app.showImg($('#showImg'), res.resUrl, 60, 60);
        }
    });

    // —— 保存 ——
    $('#btnSave').on('click', function () {
        var deptTypes = $('#e_choiceDeptType input[name="deptType"]:checked').map(function () { return $(this).val(); }).get();
        var workTypes = $('#checkboxs input[name="workType"]:checked').map(function () { return $(this).val(); }).get();
        var options = {
            'feedbackGuarantee.fid': fid,
            'feedbackGuarantee.fgid': fgid,
            'feedbackGuarantee.orderId': $('#e_orderId').val(),
            'feedbackGuarantee.source': $('#e_source').val(),
            'feedbackGuarantee.phone': $('#e_phone').val(),
            'feedbackGuarantee.cutomerType': $('#editForm [name="cutomerType"]').val(),
            'feedbackGuarantee.deptType': deptTypes.join(','),
            'feedbackGuarantee.workType': workTypes.join(','),
            'feedbackGuarantee.content': $('#e_content').val(),
            'feedbackGuarantee.bids': state.bid != null ? state.bid : '',
            'feedbackGuarantee.brands': $('#e_brandName').val(),
            'feedbackGuarantee.reportedDate': $('#e_reportedDate').val(),
            'feedbackGuarantee.renovationYear': $('#e_renovationYear').val(),
            'feedbackGuarantee.repairResult': $('#editForm [name="repairResult"]').val(),
            'feedbackGuarantee.upgradeSource': $('#editForm [name="upgradeSource"]').val()
        };
        app.post(api.customer.updateFeedbackGuarantee, options, function () {
            if (state.resUrl && state.resUrl.length > 0) {
                app.post(api.customer.addFeedbackDrawing, {
                    'feedbackDrawing.fid': fid,
                    'feedbackDrawing.sid': fgid,
                    'feedbackDrawing.path': state.resUrl,
                    'feedbackDrawing.type': 1
                });
            }
            app.showAlert(app.success, '操作成功');
            // 通知父窗刷新列表并关闭弹窗
            try {
                if (parent && parent.layui) {
                    var $btn = parent.layui.jquery('.layui-layer-iframe', parent.document);
                    parent.layui.layer.closeAll();
                }
            } catch (e) { /* noop */ }
        });
    });

    $('#btnCancel').on('click', function () {
        try {
            if (parent && parent.layui) parent.layui.layer.closeAll();
            else layer.closeAll();
        } catch (e) { layer.closeAll(); }
    });
});
}); // end app.ready
