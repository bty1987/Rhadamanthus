/** recruitment.js —— 招聘管理（pageRecruitment / addRecruitment / entryRecruitment / cancelRecruitment / updateRecruitmentForAdvance） */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, enterIndex: null, picIndex: null, rid: null };

    var employWayMap = { 0: '网络', 1: '推荐', 2: '招聘会', 3: '其他' };
    var educationMap = { 0: '博士', 1: '硕士', 2: '本科', 3: '大专', 4: '高中', 5: '其他' };
    var statusMap = { 0: '初始', 1: '入职', 2: '作废' };
    function stStatus(d) {
        var cls = { 0: 'layui-bg-blue', 1: 'layui-bg-green', 2: 'layui-bg-gray' };
        return '<span class="layui-badge ' + (cls[d.status] || '') + '">' + (statusMap[d.status] || '---') + '<\/span>';
    }

    app.bindData($('#editForm [name="employWay"]'), [{ key: 0, value: '网络' }, { key: 1, value: '推荐' }, { key: 2, value: '招聘会' }, { key: 3, value: '其他' }], 'key', 'value', true, function () { form.render('select'); });
    app.bindData($('#editForm [name="education"]'), [{ key: 0, value: '博士' }, { key: 1, value: '硕士' }, { key: 2, value: '本科' }, { key: 3, value: '大专' }, { key: 4, value: '高中' }, { key: 5, value: '其他' }], 'key', 'value', true, function () { form.render('select'); });

    loadDeptType();
    initTable(); query(1);

    function loadDeptType() {
        app.post(api.communion.queryDepartmentType, {}, function (res) {
            app.bindData($('#enterForm [name="dtid"]'), res.departmentTypes, 'dtid', 'name', true, function () { form.render('select'); triggerDept(); });
        }, null, false);
    }
    function triggerDept() {
        var dtid = $('#enterForm [name="dtid"]').val(); if (!dtid) return;
        app.post(api.system.queryDutyByDtid, { 'duty.departmentType.dtid': dtid }, function (res) { app.bindData($('#enterForm [name="duty.did"]'), res.dutys, 'did', 'name', true, function () { form.render('select'); }); });
        app.post(api.communion.queryDepartmentByDtid, { 'dept.type.dtid': dtid }, function (res) { app.bindData($('#enterForm [name="dept.did"]'), res.deptList, 'did', 'name', true, function () { form.render('select'); }); });
    }
    $('#enterForm [name="dtid"]').on('change', triggerDept);

    var loginValid = true;
    $('#enterForm [name="loginId"]').on('blur', function () {
        var v = $.trim($(this).val());
        if (!v) { loginValid = false; return; }
        app.post(api.personel.queryUserByLoginId, { 'user.loginId': v }, function () { app.showTip($('#enterForm [name="loginId"]'), '用户名已存在', 2); loginValid = false; }, function () { loginValid = true; });
    });

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'name', title: '姓名', width: 100 },
                { field: 'identity', title: '身份证号', width: 200 },
                { field: 'place', title: '地址', minWidth: 160 },
                { field: 'phone', title: '电话', width: 140 },
                { field: 'employWay', title: '应聘方式', width: 100, templet: function (d) { return employWayMap[d.employWay] || '---'; } },
                { field: 'education', title: '学历', width: 90, templet: function (d) { return educationMap[d.education] || '---'; } },
                { field: 'status', title: '状态', width: 90, templet: stStatus },
                { title: '操作', width: 540, fixed: 'right', toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, d = obj.data;
            if (ev === 'view') layer.open({ type: 2, title: '查看', content: '../../views/personnel/recruitment4select.html?rid=' + d.rid, area: ['80%', '80%'] });
            else if (ev === 'enter') openEnter(d);
            else if (ev === 'edit') layer.open({ type: 2, title: '编辑', content: '../../views/personnel/recruitment2update.html?rid=' + d.rid, area: ['80%', '90%'], end: function () { query(state.page); } });
            else if (ev === 'education') layer.open({ type: 2, title: '教育信息', content: '../../views/personnel/recruitmentEducation.html?rid=' + d.rid, area: ['80%', '80%'] });
            else if (ev === 'operation') layer.open({ type: 2, title: '工作信息', content: '../../views/personnel/recruitmentOperation.html?rid=' + d.rid, area: ['80%', '80%'] });
            else if (ev === 'cancel') doCancel(d);
            else if (ev === 'picture') openPicture(d);
        });
    }

    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.personel.pageRecruitment, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0;
            laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } });
        });
    }

    function openEdit() {
        app.clearValidator(); $('#editForm')[0].reset(); form.render('select');
        state.editIndex = layer.open({ type: 1, title: '添加招聘', content: $('#editBox'), area: ['520px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        app.post(api.personel.addRecruitment, {
            'recruitment.name': $('#editForm [name="name"]').val(),
            'recruitment.identity': $('#editForm [name="identity"]').val(),
            'recruitment.place': $('#editForm [name="place"]').val(),
            'recruitment.phone': $('#editForm [name="phone"]').val(),
            'recruitment.employWay': $('#editForm [name="employWay"]').val(),
            'recruitment.education': $('#editForm [name="education"]').val()
        }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }

    function openEnter(d) {
        app.clearValidator(); $('#enterForm')[0].reset(); form.render('select'); triggerDept();
        state.rid = d.rid;
        state.enterIndex = layer.open({ type: 1, title: '入职', content: $('#enterBox'), area: ['520px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doEnter() {
        if (app.validate('enterForm') || !loginValid) return;
        app.post(api.personel.queryRecruitmentByRid, { 'recruitment.rid': state.rid }, function (res) {
            var v = res.recruitment;
            var opt = {
                'userInfo.salary': '0', 'userInfo.gender': 1, 'userInfo.level': 0,
                'userInfo.user.loginId': $.trim($('#enterForm [name="loginId"]').val()),
                'userInfo.fangliner.userId': '',
                'userInfo.user.currentName': v.name, 'userInfo.user.userName': v.name,
                'userInfo.user.dept.type.dtid': $('#enterForm [name="dtid"]').val(),
                'userInfo.user.dept.did': $('#enterForm [name="dept.did"]').val(),
                'userInfo.user.duty.did': $('#enterForm [name="duty.did"]').val(),
                'userInfo.user.phone': v.phone, 'userInfo.user.identity': v.identity,
                'userInfo.height': v.height, 'userInfo.weight': v.weight, 'userInfo.nation': v.nation,
                'userInfo.phone': v.phone, 'userInfo.hometownPlace': v.hometownPlace,
                'userInfo.qq': v.qq, 'userInfo.wechat': v.wechat, 'userInfo.email': v.email,
                'userInfo.employWay': v.employWay, 'userInfo.political': v.political,
                'userInfo.householdType': v.householdType, 'userInfo.education': v.education,
                'userInfo.address': v.address, 'userInfo.hometownAddress': v.place,
                'userInfo.specialty': v.specialty, 'userInfo.emergencyMan': v.emergencyMan,
                'userInfo.emergencyPhone': v.emergencyPhone, 'userInfo.isMarried': v.isMarried,
                'userInfo.isBirth': v.isBirth, 'userInfo.isCarLoan': v.isCar, 'userInfo.isHouseLoan': v.isHouseLoan,
                'userInfo.isCarID': v.isCarID, 'userInfo.isPassID': v.isPassID,
                'userInfo.isHMID': v.isHMID, 'userInfo.isTWID': v.isTWID
            };
            // 拉取教育与工作经历一并带入
            app.post(api.personel.queryRecruitmentEducation, { 'recruitmentEducation.rid': state.rid }, function (ed) {
                $.each(ed.recruitmentEducations || [], function (i, e) {
                    opt['userEducations[' + i + '].organ'] = e.organ;
                    opt['userEducations[' + i + '].certificate'] = e.certificate;
                    opt['userEducations[' + i + '].beginTime'] = e.beginTime;
                    opt['userEducations[' + i + '].endTime'] = e.endTime;
                    opt['userEducations[' + i + '].specialty'] = e.specialty;
                    opt['userEducations[' + i + '].content'] = e.content;
                });
            }, null, false);
            app.post(api.personel.queryRecruitmentOperation, { 'recruitmentOperation.rid': state.rid }, function (op) {
                $.each(op.recruitmentOperations || [], function (i, o) {
                    opt['userOperations[' + i + '].company'] = o.company;
                    opt['userOperations[' + i + '].trade'] = o.trade;
                    opt['userOperations[' + i + '].duty'] = o.duty;
                    opt['userOperations[' + i + '].beginTime'] = o.beginTime;
                    opt['userOperations[' + i + '].endTime'] = o.endTime;
                    opt['userOperations[' + i + '].salary'] = o.salary;
                    opt['userOperations[' + i + '].comment'] = o.comment;
                });
            }, null, false);
            app.post(api.personel.addUser, opt, function () {
                app.showAlert(app.success, '入职成功');
                app.post(api.personel.entryRecruitment, { 'recruitment.rid': v.rid }, function () {
                    layer.close(state.enterIndex); state.enterIndex = null; query(state.page);
                });
            });
        });
    }

    function doCancel(d) {
        app.showConfirm('是否作废该招聘记录？', function () {
            app.post(api.personel.cancelRecruitment, { 'recruitment.rid': d.rid }, function () { app.showAlert(app.success, '作废成功'); query(state.page); });
        });
    }

    function openPicture(d) {
        state.rid = d.rid;
        state.picIndex = layer.open({ type: 1, title: '图片上传', content: $('#pictureBox'), area: ['520px', 'auto'] });
    }
    function doPictureSave() {
        var photo = $('#photoFile')[0].files[0];
        var idF = $('#idFrontFile')[0].files[0];
        var idB = $('#idBackFile')[0].files[0];
        if (!photo && !idF && !idB) { app.showAlert(app.warning, '请至少选择一张图片'); return; }
        var photoPath = '', idFPath = '', idBPath = '';
        var chain = [];
        if (photo) chain.push({ f: photo, set: function (u) { photoPath = u; } });
        if (idF) chain.push({ f: idF, set: function (u) { idFPath = u; } });
        if (idB) chain.push({ f: idB, set: function (u) { idBPath = u; } });
        var i = 0;
        function next() {
            if (i >= chain.length) { saveDb(); return; }
            var c = chain[i++];
            uploadImg(c.f, function (u) { c.set(u); next(); });
        }
        next();

        function uploadImg(file, cb) {
            var fd = new FormData();
            fd.append('uploadType', 0);
            fd.append('file', file);
            $.ajax({
                url: app.config.media + '/common/uploadImg.do',
                data: fd, type: 'POST', dataType: 'json',
                contentType: false, processData: false,
                success: function (res) { cb && cb(res.resUrl || ''); }
            });
        }
        function saveDb() {
            app.post(api.personel.updateRecruitmentForAdvance, {
                'recruitment.rid': state.rid,
                'recruitment.photoPath': photoPath,
                'recruitment.identityPathF': idFPath,
                'recruitment.identityPathB': idBPath
            }, function () {
                app.showAlert(app.success, '操作成功'); layer.close(state.picIndex); state.picIndex = null; query(state.page);
            });
        }
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', openEdit);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
    $('#btnEnterSave').on('click', doEnter);
    $('#btnEnterCancel').on('click', function () { layer.close(state.enterIndex); state.enterIndex = null; });
    $('#btnPictureSave').on('click', doPictureSave);
    $('#btnPictureCancel').on('click', function () { layer.close(state.picIndex); state.picIndex = null; });
});
}); // end app.ready
