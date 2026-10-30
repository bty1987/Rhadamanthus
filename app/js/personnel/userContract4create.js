/** userContract4create.js —— 创建合同（加载合同模板，选择后跳转模板页）
 * 父页 popup 打开，从 url ?uid= 取 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    function getUrlParam(k) { var m = location.search.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? m[1] : ''; }
    var uid = getUrlParam('uid');

    app.post(api.data.queryContract, { 'contract.atttype': 1 }, function (res) {
        app.bindData($('#contract'), res.contracts, 'cid', 'name', true, function () { form.render('select'); });
        $('#contract').data('contracts', res.contracts || []);
    });

    $('#contract').on('change', function () {
        var cid = $(this).val();
        var list = $(this).data('contracts') || [];
        var found = null;
        $.each(list, function (i, c) { if (String(c.cid) === String(cid)) { found = c; return false; } });
        if (!found || !found.page) { $('#contractPopUp').empty(); return; }
        $('#contractPopUp').load(found.page);
        // 把参数塞到父级 app.params，供模板页读取（与旧 params.personel.contractargs 行为一致）
        if (window.parent && window.parent.app) {
            window.parent.app.params = window.parent.app.params || {};
            window.parent.app.params.personel = window.parent.app.params.personel || {};
            window.parent.app.params.personel.contractargs = { cid: cid, no: found.no, name: found.name, title: found.title };
        }
    });

    $('#btnPreservation').on('click', function () {
        var cid = $('#contract').val();
        if (!cid) { app.showAlert(app.warning, '请选择合同模板'); return; }
        // 由父页处理后续，关闭弹窗
        var idx = (window.parent && window.parent.layer) ? window.parent.layer.getFrameIndex(window.name) : null;
        if (idx != null) window.parent.layer.close(idx);
    });
});
}); // end app.ready
