/** supplierContract4create.js —— 生成合同（加载合同模板页）
 * 父页 popup 打开，从 url ?scid=&cid=&uid= 取 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    function getUrlParam(k) { var m = location.search.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? m[1] : ''; }
    var scid = getUrlParam('scid');
    var cid = getUrlParam('cid');
    var uid = getUrlParam('uid');

    app.post(api.data.queryContract, { 'contract.atttype': 2 }, function (res) {
        app.bindData($('#contract'), res.contracts, 'cid', 'name', true, function () { form.render('select'); $('#contract').val(cid); form.render('select'); });
        $('#contract').data('contracts', res.contracts || []);
        if (cid) loadContractPage(cid);
    });

    $('#contract').on('change', function () { loadContractPage($(this).val()); });

    function loadContractPage(cid) {
        var list = $('#contract').data('contracts') || [];
        var found = null;
        $.each(list, function (i, c) { if (String(c.cid) === String(cid)) { found = c; return false; } });
        if (!found || !found.page) { $('#contractPopUp').empty(); return; }
        $('#contractPopUp').load(found.page);
        if (window.parent && window.parent.app) {
            window.parent.app.params = window.parent.app.params || {};
            window.parent.app.params.personel = window.parent.app.params.personel || {};
            window.parent.app.params.personel.contractargs = { cid: cid, no: found.no, name: found.name, title: found.title, html: found.page, scid: scid };
        }
    }

    $('#btnPreservation').on('click', function () {
        var idx = (window.parent && window.parent.layer) ? window.parent.layer.getFrameIndex(window.name) : null;
        if (idx != null) window.parent.layer.close(idx);
    });
});
}); // end app.ready
