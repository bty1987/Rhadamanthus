/** app/js/building/buildingHouse4advance.js —— 房源高级管理
 *  对齐旧 WebContent/js/building/buildingHouse4advance.js。
 *  状态：0待审核 1签约 2失效 3通过 4驳回（与 communion.constant building.status 一致）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, curHsid: null, curType: null, bindIdx: null, belongIdx: null, keyerIdx: null };
    var STATUS = { 0: '待审核', 1: '签约', 2: '失效', 3: '通过', 4: '驳回' };

    laydate.render({ elem: '#signingTime' });
    initTable(); query(1);

    function statusBadge(d) {
        var map = { 0: 'layui-bg-orange', 1: 'layui-bg-blue', 2: 'layui-bg-gray', 3: 'layui-bg-green', 4: 'layui-bg-red' };
        return '<span class="layui-badge ' + (map[d.status] || 'layui-bg-gray') + '">' + (STATUS[d.status] || '---') + '<\/span>';
    }
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'no', title: '编号', width: 120 },
                { field: 'house', title: '楼盘', minWidth: 140, templet: function (d) { return d.house ? (d.house.name || d.house.houseNumber || '') : ''; } },
                { field: 'type', title: '类型', width: 80 },
                { field: 'discussType', title: '议价', width: 80 },
                { field: 'decorateDegree', title: '装修', width: 80 },
                { field: 'totalPrice', title: '总价', width: 100, align: 'right', templet: function (d) { return app.formatMoney(d.totalPrice); } },
                { field: 'housingGrade', title: '等级', width: 70 },
                { field: 'status', title: '状态', width: 90, templet: statusBadge },
                { title: '操作', width: 420, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var e = obj.event, d = obj.data;
            if (e === 'pass') updateStatus(d.hsid, 3, '已通过');
            else if (e === 'reject') updateStatus(d.hsid, 4, '已驳回');
            else if (e === 'bind') openBind(d);
            else if (e === 'follow') openBelong(d);
            else if (e === 'key') openKeyer(d);
        });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.building.pageBuildingHouseForAdvance, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage();
        });
    }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function updateStatus(hsid, status, txt) {
        app.post(api.building.updateBuildingHouseForStatus, { 'buildingHouse.hsid': hsid, 'buildingHouse.status': status }, function () {
            app.showAlert(app.success, '房源信息' + txt); query(state.page);
        });
    }

    function openBind(d) {
        app.clearValidator(); $('#bindForm')[0].reset(); form.render();
        state.curHsid = d.hsid; state.curType = d.type;
        $('#bindForm [name="hsNo"]').val(d.no);
        bindIdx = layer.open({ type: 1, title: '绑定客源', content: $('#bindBox'), area: ['520px', 'auto'] });
    }
    $('#btnBindSave').on('click', function () {
        if (app.validate('bindForm')) return;
        var csNo = $('#bindForm [name="csNo"]').val();
        // 校验客源编号，取 csid
        app.post(api.building.queryBuildingCustomerByNo, { 'buildingCustomer.no': csNo }, function (res) {
            if (res.buildingCustomer.status != 0) { app.showAlert(app.warning, '客源已签约或失效'); return; }
            var opt = {
                'building.buildingHouse.hsid': state.curHsid,
                'building.buildingCustomer.csid': res.buildingCustomer.csid,
                'building.buildingHouseAgent.cid': $('#bindForm [name="hsAUser"]').val(),
                'building.buildingCustomerAgent.cid': $('#bindForm [name="csAUser"]').val(),
                'building.signingTime': $('#bindForm [name="signingTime"]').val(),
                'building.tradePrice': $('#bindForm [name="tradePrice"]').val(),
                'building.downpayment': $('#bindForm [name="downpayment"]').val(),
                'building.loanPrice': $('#bindForm [name="loanPrice"]').val(),
                'building.payType': $('#bindForm [name="payType"]').val(),
                'building.balanceStatus': $('#bindForm [name="balanceStatus"]').val()
            };
            app.post(api.building.bindBuilding, opt, function () {
                app.showAlert(app.success, '成功绑定客源'); layer.close(bindIdx); bindIdx = null; query(state.page);
            });
        }, function () {
            app.showAlert(app.warning, '请正确输入客源编号');
        });
    });
    $('#btnBindCancel').on('click', function () { layer.close(bindIdx); bindIdx = null; });

    function openBelong(d) {
        app.clearValidator(); $('#belongForm')[0].reset();
        state.curHsid = d.hsid;
        if (d.followUser && d.followUser.userId) { $('#belongForm [name="belongUser"]').val(d.followUser.userId); }
        belongIdx = layer.open({ type: 1, title: '转移房源', content: $('#belongBox'), area: ['480px', 'auto'] });
    }
    $('#btnBelongSave').on('click', function () {
        if (app.validate('belongForm')) return;
        app.post(api.building.updateBuildingHouseForBelong, { 'buildingHouse.hsid': state.curHsid, 'buildingHouse.followUser.userId': $('#belongForm [name="belongUser"]').val() }, function () {
            app.showAlert(app.success, '房源转移成功'); layer.close(belongIdx); belongIdx = null; query(state.page);
        });
    });
    $('#btnBelongCancel').on('click', function () { layer.close(belongIdx); belongIdx = null; });

    function openKeyer(d) {
        app.clearValidator(); $('#keyerForm')[0].reset();
        state.curHsid = d.hsid;
        if (d.keyer && d.keyer.userId) { $('#keyerForm [name="keyer"]').val(d.keyer.userId); }
        keyerIdx = layer.open({ type: 1, title: '修改收钥匙人', content: $('#keyerBox'), area: ['480px', 'auto'] });
    }
    $('#btnKeyerSave').on('click', function () {
        if (app.validate('keyerForm')) return;
        app.post(api.building.updateBuildingHouseForKeyer, { 'buildingHouse.hsid': state.curHsid, 'buildingHouse.keyer.userId': $('#keyerForm [name="keyer"]').val() }, function () {
            app.showAlert(app.success, '收钥匙人已更新'); layer.close(keyerIdx); keyerIdx = null; query(state.page);
        });
    });
    $('#btnKeyerCancel').on('click', function () { layer.close(keyerIdx); keyerIdx = null; });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render(); query(1); });
    form.render();
});
}); // end app.ready
