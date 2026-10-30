/** supplierContract.js —— 厂商合同（querySupplierContract + add/update/delete + sign/expire/filing/品牌/商品/质保）
 * 从 url ?userId=&uid= 取参数 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { userId: null, uid: null, scid: null, editIndex: null, signetIndex: null, supplierSignetIndex: null, user: null };

    function getUrlParam(k) { var m = location.search.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? m[1] : ''; }
    state.userId = getUrlParam('userId');
    state.uid = getUrlParam('uid');

    var statusMap = { 0: '初始', 1: '有效', 2: '失效', 3: '归档', 4: '已签' };
    function stStatus(d) {
        var cls = { 0: 'layui-bg-blue', 1: 'layui-bg-green', 2: 'layui-bg-gray', 3: 'layui-bg-cyan', 4: 'layui-bg-orange' };
        return '<span class="layui-badge ' + (cls[d.status] != null ? cls[d.status] : '') + '">' + (statusMap[d.status] != null ? statusMap[d.status] : '---') + '<\/span>';
    }

    app.post(api.personel.queryUserByUserId, { 'user.userId': state.userId }, function (res) {
        state.user = res.user;
        var u = res.user || {};
        var phone = u.phone ? String(u.phone).replace(/^(\d{3})\d+(\d{4})$/, '$1****$2') : '';
        var identity = u.identity ? String(u.identity).replace(/(.{6}).*(.{4})/, '$1********$2') : '暂无';
        $('#userInfo .layui-card-body').html(
            '<div><b>姓名：</b>' + (u.currentName || '') + '</div>' +
            '<div><b>电话：</b>' + phone + '</div>' +
            '<div><b>身份证：</b>' + identity + '</div>' +
            '<div><b>职位：</b>' + (u.duty ? u.duty.name : '') + '</div>' +
            '<div><b>角色：</b>' + (u.role ? u.role.name : '') + '</div>'
        );
    });

    app.post(api.data.querySupplierSignet, { 'signet.suid': state.uid }, function (res) {
        app.bindData($('#supplierSignet'), res.signets, 'ssid', 'name', true, function () { form.render('select'); });
    });
    app.post(api.data.querySignet, {}, function (res) {
        app.bindData($('#signet'), res.signets, 'sid', 'name', true, function () { form.render('select'); });
    });
    app.post(api.data.queryContract, { 'contract.atttype': 2 }, function (res) {
        app.bindData($('#editForm [name="cid"]'), res.contracts, 'cid', 'name', true, function () { form.render('select'); });
        $('#editForm [name="cid"]').data('contracts', res.contracts || []);
    });

    initTable(); query();

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'name', title: '名称', minWidth: 160 },
                { field: 'signTime', title: '签订时间', width: 120 },
                { field: 'startTime', title: '开始时间', width: 120 },
                { field: 'endTime', title: '结束时间', width: 120 },
                { field: 'createTime', title: '创建时间', width: 160 },
                { field: 'status', title: '状态', width: 90, templet: stStatus },
                { field: 'comment', title: '说明', minWidth: 160 },
                { title: '操作', width: 640, fixed: 'right', toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, d = obj.data;
            if (ev === 'edit') openEdit(d);
            else if (ev === 'view') viewContract(d);
            else if (ev === 'generate') generate(d);
            else if (ev === 'sign') affix(d);
            else if (ev === 'expire') expire(d);
            else if (ev === 'companySign') openSignet(d);
            else if (ev === 'supplierSign') openSupplierSignet(d);
            else if (ev === 'filing') filing(d);
            else if (ev === 'brand') location.href = '../../views/personnel/supplierContractBrand.html?scid=' + d.scid + '&uid=' + d.uid;
            else if (ev === 'goods') layer.open({ type: 2, title: '厂商商品', content: '../../views/personnel/supplierContractGoods.html?scid=' + d.scid, area: ['80%', '80%'] });
            else if (ev === 'warranty') layer.open({ type: 2, title: '质保', content: '../../views/personnel/supplierContractBrand4detail.html?scid=' + d.scid, area: ['80%', '80%'] });
        });
    }

    function query() {
        app.post(api.personel.querySupplierContract, { 'supplierContract.uid': state.uid }, function (res) {
            table.reload('resultTable', { data: res.supplierContracts || [] });
        });
    }

    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.scid = null;
        if (d) {
            state.scid = d.scid;
            $('#editForm [name="scid"]').val(d.scid);
            $('#editForm [name="name"]').val(d.name);
            $('#editForm [name="comment"]').val(d.comment);
        }
        form.render('select');
        state.editIndex = layer.open({ type: 1, title: d ? '编辑合同' : '添加合同', content: $('#editBox'), area: ['560px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var cid = $('#editForm [name="cid"]').val();
        var contracts = $('#editForm [name="cid"]').data('contracts') || [];
        var contract = null;
        $.each(contracts, function (i, c) { if (String(c.cid) === String(cid)) { contract = c; return false; } });
        if (!contract || !contract.no) { app.showAlert(app.error, '合同模板不存在'); return; }
        var opt = {
            'supplierContract.uid': state.uid,
            'supplierContract.name': $('#editForm [name="name"]').val(),
            'supplierContract.cid': cid,
            'supplierContract.comment': $('#editForm [name="comment"]').val(),
            'contract.no': contract.no, 'contract.name': contract.name, 'contract.cid': contract.cid, 'contract.title': contract.title
        };
        var apiDef = state.scid ? (opt['supplierContract.scid'] = state.scid, api.personel.updateSupplierContract) : api.personel.addSupplierContract;
        app.post(apiDef, opt, function () { app.showAlert(app.success, '操作成功'); layer.close(state.editIndex); state.editIndex = null; query(); });
    }

    function viewContract(d) { app.post(api.personel.viewSupplierContract, { 'supplierContract.scid': d.scid }, function (res) { if (res.redirect) layer.open({ type: 2, title: '合同查看', content: res.redirect, area: ['90%', '90%'] }); }); }
    function affix(d) { app.showConfirm('是否已签合同', function () { app.post(api.personel.affixSupplierContract, { 'supplierContract.scid': d.scid }, function () { query(); }); }); }
    function expire(d) { app.showConfirm('是否失效合同', function () { app.post(api.personel.expireSupplierContract, { 'supplierContract.scid': d.scid }, function () { query(); }); }); }
    function filing(d) { app.showConfirm('是否归档', function () { app.post(api.personel.filingSupplierContract, { 'supplierContract.scid': d.scid }, function () { query(); }); }); }

    function generate(d) {
        // 生成合同（走模板页，与旧实现一致）
        var url = '../../views/personnel/supplierContract4create.html?scid=' + d.scid + '&cid=' + d.cid + '&uid=' + state.uid;
        layer.open({ type: 2, title: '生成合同', content: url, area: ['90%', '90%'], end: function () { query(); } });
    }

    function openSignet(d) { state.scid = d.scid; state.signetIndex = layer.open({ type: 1, title: '公司签', content: $('#signetBox'), area: ['420px', 'auto'] }); }
    function doSignet() {
        var sid = $('#signet').val();
        app.post(api.data.querySignetBySid, { 'signet.sid': sid }, function (res) {
            var signet = res.signet;
            if (!signet || !signet.no) { app.showAlert(app.error, '签章不存在'); return; }
            app.post(api.personel.signSupplierContractForCompany, {
                'supplierContract.scid': state.scid,
                'signet.signno': signet.signno, 'signet.keyword': signet.keyword, 'signet.signid': signet.signid
            }, function () { layer.close(state.signetIndex); state.signetIndex = null; });
        });
    }

    function openSupplierSignet(d) { state.scid = d.scid; state.supplierSignetIndex = layer.open({ type: 1, title: '厂商签', content: $('#supplierSignetBox'), area: ['420px', 'auto'] }); }
    function doSupplierSignet() {
        var ssid = $('#supplierSignet').val();
        app.post(api.data.querySupplierSignetBySid, { 'signet.ssid': ssid }, function (res) {
            var signet = res.signet;
            if (!signet || !signet.no) { app.showAlert(app.error, '签章不存在'); return; }
            app.post(api.personel.signSupplierContractForSupplier, {
                'supplierContract.scid': state.scid, 'supplierSignet.signno': signet.signno
            }, function (r) { if (r.redirect) layer.open({ type: 2, title: '厂商签', content: r.redirect, area: ['90%', '90%'] }); layer.close(state.supplierSignetIndex); state.supplierSignetIndex = null; });
        });
    }

    $('#btnBack').on('click', function () { location.href = '../../views/personnel/supplier.html'; });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSignUser').on('click', function () {
        layer.open({ type: 2, title: '厂商签章', content: '../../views/data/supplierSignet.html?uid=' + state.uid, area: ['80%', '80%'] });
    });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
    $('#btnSignet').on('click', doSignet);
    $('#btnSignetCancel').on('click', function () { layer.close(state.signetIndex); state.signetIndex = null; });
    $('#btnSupplierSignet').on('click', doSupplierSignet);
    $('#btnSupplierSignetCancel').on('click', function () { layer.close(state.supplierSignetIndex); state.supplierSignetIndex = null; });
});
}); // end app.ready
