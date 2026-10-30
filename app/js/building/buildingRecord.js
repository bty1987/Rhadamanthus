/** app/js/building/buildingRecord.js —— 施工记录（按房源查看 + 添加）*/
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { editIndex: null };
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'buildingHouse', title: '房源', width: 120, templet: function (d) { return d.buildingHouse ? d.buildingHouse.no : ''; } },
            { field: 'buildingCustomer', title: '客户', width: 120, templet: function (d) { return d.buildingCustomer ? d.buildingCustomer.name : ''; } },
            { field: 'type', title: '类型', width: 100 },
            { field: 'pattern', title: '模式', width: 100 },
            { field: 'value', title: '值', width: 100 },
            { field: 'comment', title: '备注', minWidth: 160 } ]] });

    function query() {
        var no = $('#searchNo').val();
        if (!no) { app.showAlert(app.warning, '请输入房源编号'); return; }
        // 先查房源拿 hsid，再查记录
        app.post(api.building.queryBuildingHouseByNo, { 'buildingHouse.no': no }, function (res) {
            var house = res.buildingHouse;
            if (!house) { app.showAlert(app.warning, '房源不存在'); return; }
            app.post(api.building.queryBuildingRecord, { 'buildingRecord.hsid': house.hsid }, function (r) {
                table.reload('resultTable', { data: r.buildingRecords || [] });
            });
        });
    }

    function openAdd() {
        app.clearValidator(); $('#editForm')[0].reset();
        $('#houseNo').val($('#searchNo').val());
        state.editIndex = layer.open({ type: 1, title: '添加施工记录', content: $('#editBox'), area: ['480px', 'auto'] });
    }

    function doSave() {
        if (app.validate('editForm')) return;
        // 先查房源 + 客户，拿到 hsid/csid 后提交
        var houseNo = $('#houseNo').val();
        var customerNo = $('#customerNo').val();
        app.post(api.building.queryBuildingHouseByNo, { 'buildingHouse.no': houseNo }, function (res) {
            var house = res.buildingHouse;
            if (!house) { app.showAlert(app.error, '房源不存在'); return; }
            var opt = { 'buildingRecord.hsid': house.hsid, 'buildingRecord.type': $('#editForm [name="type"]').val(), 'buildingRecord.pattern': $('#editForm [name="pattern"]').val(), 'buildingRecord.value': $('#editForm [name="value"]').val(), 'buildingRecord.comment': $('#editForm [name="comment"]').val() };
            function submit(csid) { if (csid) opt['buildingRecord.csid'] = csid; app.post(api.building.addBuildingRecord, opt, function () { app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null; query(); }); }
            if (customerNo) { app.post(api.building.queryBuildingCustomerByNo, { 'buildingCustomer.no': customerNo }, function (r) { submit(r.buildingCustomer ? r.buildingCustomer.csid : null); }, function () { submit(null); }); }
            else { submit(null); }
        });
    }

    $('#btnSearch').on('click', query);
    $('#btnAdd').on('click', openAdd);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
