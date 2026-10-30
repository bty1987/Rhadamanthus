/** app/js/decoration/decorationContract.js —— 装修单合同
 *  上下文：app.params.decoration = { orderId, cid }；app.params.urlLoadParams.showtype。
 *  信息区：装修单（queryDecorationByOrderId）+ 客户认证状态 + 合同记录（queryDecorationContractRecord）；
 *  合同表：queryDecorationContractByOrderId；
 *  操作：创建（popup decorationContract2create）/客户认证（authCustomer 三证）/确认/重置/
 *  查看（viewDecorationContract redirect 新窗）/生成（makeDecorationContract）/归档/失效/已签/
 *  公司签/客户签（redirect 新窗）/二维码（签署 URL）/通知（sendDecorationContract type 1|2）。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var E = decorationCommon.ENUM;
    var ctx = app.params.decoration || {};
    var lp = app.params.urlLoadParams || {};
    var orderId = ctx.orderId, cid = ctx.cid;
    var showtype = lp.showtype || '';
    var authFlag = false;
    var customer = {};
    var contractProvider = null; // 目标合同厂商(1法大大/2e签宝), 客户签时缓存, 认证按该厂商定向重实名

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'orderId', title: '装修单号', width: 120 },
            { field: 'provider', title: '签约厂商', width: 90, templet: function (d) { return d.provider == 2 ? '<span class="layui-badge layui-bg-blue">e签宝<\/span>' : '<span class="layui-badge layui-bg-gray">法大大<\/span>'; } },
            { field: 'status', title: '状态', width: 90, templet: function (d) { return decorationCommon.badge(E.contractStatus, d.status); } },
            { field: 'ishow', title: '是否显示', width: 90, templet: function (d) { return d.ishow == 0 ? '<span class="layui-badge layui-bg-green">显示<\/span>' : '<span class="layui-badge layui-bg-gray">隐藏<\/span>'; } },
            { field: 'creater', title: '创建人', width: 90, templet: function (d) { return (d.creater && d.creater.currentName) || ''; } },
            { field: 'signner', title: '签署人', width: 90, templet: function (d) { return (d.signner && d.signner.currentName) || '无'; } },
            { field: 'filinner', title: '归档人', width: 90, templet: function (d) { return (d.filinner && d.filinner.currentName) || '无'; } },
            { field: 'createTime', title: '创建时间', width: 165, templet: function (d) { return app.dateFormat(d.createTime); } },
            { field: 'comsignTime', title: '公司签时间', width: 165, templet: function (d) { return d.comsignTime ? app.dateFormat(d.comsignTime) : '无'; } },
            { field: 'cussignTime', title: '客户签时间', width: 165, templet: function (d) { return d.cussignTime ? app.dateFormat(d.cussignTime) : '无'; } },
            { field: 'filingTime', title: '归档时间', width: 165, templet: function (d) { return d.filingTime ? app.dateFormat(d.filingTime) : '无'; } },
            { title: '操作', width: 460, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    table.on('tool(resultTable)', function (obj) {
        var ev = obj.event, v = obj.data;
        if (ev === 'view') viewContract(v);
        else if (ev === 'make') makeContract(v);
        else if (ev === 'filing') filingContract(v);
        else if (ev === 'download') downloadContract(v);
        else if (ev === 'hide') showContract(v, 1);
        else if (ev === 'show') showContract(v, 0);
        else if (ev === 'signed') signContract(v);
        else if (ev === 'expire') expireContract(v);
        else if (ev === 'csign') companySign(v);
        else if (ev === 'usign') customerSign(v);
        else if (ev === 'qrsign') showQRCode(v, 1);
        else if (ev === 'qrusign') showQRCode(v, 2);
        else if (ev === 'notice1') sendNotice('是否发送签章通知', v, 1);
        else if (ev === 'notice2') sendNotice('是否发送签订通知', v, 2);
    });

    // —— 信息区 ——
    app.post(api.decoration.queryDecorationByOrderId, { 'decorationOrderId': orderId }, function (res) {
        var d = res.decoration || {};
        customer = d.customer || {};
        cid = cid || customer.cid;
        authFlag = customer.authFlag == 1;
        $('#decorationInfo').html('单号：<b>' + d.orderId + '<\/b><br>楼盘：' + (d.house ? ((d.house.village ? d.house.village.name : '') + ' ' + (d.house.houseNumber || '')) : '')
            + '<br>设计师：' + (d.designer ? d.designer.currentName : '') + '<br>业务员：' + (d.salesman ? d.salesman.currentName : ''));
        $('#customerInfo').html('姓名：<b>' + (customer.name || '') + '<\/b><br>认证状态：<span class="layui-badge ' + (authFlag ? 'layui-bg-green' : 'layui-bg-orange') + '">' + (authFlag ? '已认证' : '未认证') + '<\/span>'
            + '<br>身份证：' + (customer.identity || '-') + '<br>类型：' + (customer.type != null ? customer.type : ''));
        loadCustomerAuth();
    });

    // 双厂商认证状态(签宝/法大大各一条, status: 0注册未实名/1已实名/2已签署, 无行=未注册)
    function loadCustomerAuth() {

        app.post(api.data.queryElecsignAuthByCid, { 'customer.cid': cid }, function (res) {

            var auth = {};
            $.each(res.elecsignAuths || [], function (i, a) { auth[a.provider] = a.status; });

            function label(provider) {
                var name = provider == 2 ? 'e签宝' : '法大大';
                var s = auth[provider];
                if (s === undefined || s === null) return name + ' 未注册';
                if (s == 0) return name + ' 注册未实名';
                if (s == 1) return '<span class="layui-badge layui-bg-green">' + name + ' 已实名<\/span>';
                return name + ' 已签署';
            }

            $('#customerInfo').append('<br>认证(厂商)：<span>' + label(2) + ' ｜ ' + label(1) + '<\/span>');
        });
    }

    function loadRecord() {
        app.post(api.decoration.queryDecorationContractRecord, { 'decorationContractRecord.orderId': orderId }, function (res) {
            var r = res.decorationContractRecord || {};
            $('#contractRecordInfo').html(r && (r.commitTime || r.startTime)
                ? '提交时间：' + (r.commitTime || '-') + '<br>开始时间：' + (r.startTime || '-') + '<br>结束时间：' + (r.endTime || '-') + '<br>备注：' + (r.comment || '-')
                : '暂无合同记录');
        });
    }
    loadRecord();

    function loadContracts() {
        app.post(api.decoration.queryDecorationContractByOrderId, { 'decorationContract.orderId': orderId }, function (res) {
            table.reload('resultTable', { data: res.decorationContracts || [] });
        });
    }
    loadContracts();

    // —— 顶部操作 ——
    $('#btnCreate').on('click', function () {
        if (!authFlag) { app.showAlert(app.warning, '客户未认证'); return; }
        app.params.decoration.contract = null;
        app.params.customer = $.extend({}, app.params.customer, { cid: cid });
        app.popup(api.index.decorationContract2createIndex ? api.index.decorationContract2createIndex.url : 'views/decoration/decorationContract2create.html', '创建合同', null, {
            end: function () { loadContracts(); }
        });
    });

    $('#btnAuth').on('click', function () {
        doAuth();
    });

    // 发起实名认证: contractProvider有值时按该厂商定向认证(跨厂商自动重实名, 行式认证不覆盖其他厂商认证信息)
    function doAuth() {
        var params = { 'customer.cid': cid, 'customer.type': 0 };
        if (contractProvider) params['customer.provider'] = contractProvider;
        app.post(api.data.authCustomer, params, function (res) {
            if (res.redirect) { layer.open({ type: 2, title: '认证', content: res.redirect, area: ['90%', '90%'] }); }
            else { app.showAlert(app.success, '认证请求已提交'); }
        });
    }

    $('#btnConfirm').on('click', function () {
        app.post(api.data.confirmCustomer, { 'customer.cid': cid }, function () {
            app.showAlert(app.success, '客户已确认');
        });
    });

    $('#btnReset').on('click', function () {
        app.showConfirm('确认重置客户认证状态?', function () {
            app.post(api.data.resetCustomer, { 'customer.cid': cid }, function () {
                app.showAlert(app.success, '操作成功');
            });
        });
    });

    $('#btnRecord').on('click', function () {
        app.post(api.decoration.queryDecorationContractRecord, { 'decorationContractRecord.orderId': orderId }, function (res) {
            var r = res.decorationContractRecord || {};
            $('#recordCommitTime').val(r.commitTime || '');
            $('#recordStartTime').val(r.startTime || '');
            $('#recordEndTime').val(r.endTime || '');
            $('#recordComment').val(r.comment || '');
            layer.open({ type: 1, title: '合同记录 - ' + orderId, content: $('#recordBox'), area: ['520px', 'auto'],
                btn: ['保存', '取消'], yes: function (idx) {
                    app.post(api.decoration.updateDecorationContract, {
                        'decorationContract.orderId': orderId,
                        'decorationContractRecord.commitTime': $('#recordCommitTime').val(),
                        'decorationContractRecord.startTime': $('#recordStartTime').val(),
                        'decorationContractRecord.endTime': $('#recordEndTime').val(),
                        'decorationContractRecord.comment': $('#recordComment').val()
                    }, function () {
                        app.showAlert(app.success, '操作成功');
                        layer.close(idx); loadRecord();
                    });
                } });
        });
    });

    // —— 行操作 ——
    function viewContract(v) {
        app.post(api.decoration.viewDecorationContract, { 'decorationContract.dcid': v.dcid }, function (res) {
            if (res.redirect) window.open(res.redirect, '_blank');
            else app.showAlert(app.warning, '暂无合同文件');
        });
    }

    function makeContract(v) {
        app.params.decoration.contract = v;
        app.params.customer = $.extend({}, app.params.customer, { cid: cid });
        app.popup('views/decoration/decorationContract2create.html', '创建合同', null, {
            end: function () { loadContracts(); }
        });
    }

    function filingContract(v) {
        app.showConfirm('确认归档该合同?', function () {
            app.post(api.decoration.filingDecorationContract, { 'decorationContract.dcid': v.dcid }, function () {
                app.showAlert(app.success, '操作成功'); loadContracts();
            });
        });
    }

    function downloadContract(v) {
        if (v.path) window.open(app.config.media + v.path, '_blank');
        else app.showAlert(app.warning, '暂无合同文件');
    }

    function showContract(v, ishow) {
        app.post(api.decoration.showDecorationContract, { 'decorationContract.dcid': v.dcid, 'decorationContract.ishow': ishow }, function () {
            app.showAlert(app.success, '操作成功'); loadContracts();
        });
    }

    function signContract(v) {
        app.showConfirm('确认盖章签署该合同?', function () {
            app.post(api.decoration.affixDecorationContract, { 'decorationContract.dcid': v.dcid }, function () {
                app.showAlert(app.success, '操作成功'); loadContracts();
            });
        });
    }

    function expireContract(v) {
        app.showConfirm('确认将该合同置为失效?', function () {
            app.post(api.decoration.expireDecorationContract, { 'decorationContract.dcid': v.dcid }, function () {
                app.showAlert(app.success, '操作成功'); loadContracts();
            });
        });
    }

    function companySign(v) {
        app.post(api.decoration.signDecorationContractForCompany, { 'decorationContract.dcid': v.dcid }, function (res) {
            if (res.redirect) layer.open({ type: 2, title: '公司签', content: res.redirect, area: ['90%', '90%'], end: function () { loadContracts(); } });
            else { app.showAlert(app.success, '签署请求已提交'); loadContracts(); }
        });
    }

    function customerSign(v) {
        contractProvider = v.provider;
        app.post(api.decoration.signDecorationContractForCustomer, { 'decorationContract.dcid': v.dcid }, function (res) {
            if (res.redirect) layer.open({ type: 2, title: '客户签', content: res.redirect, area: ['90%', '90%'], end: function () { loadContracts(); } });
            else { app.showAlert(app.success, '签署请求已提交'); loadContracts(); }
        }, function (res) {
            // 130189=按合同厂商无认证账号: 确认后按合同厂商定向重实名(完成后重新签署)
            if (res.errorCode == 130189) {
                app.showConfirm('客户未按该合同的签约厂商完成实名认证, 是否按合同厂商重新发起实名认证? 认证完成后请重新签署', function () {
                    doAuth();
                });
            }
        });
    }

    function showQRCode(v, type) {
        var url = 'http://service-erp.fanglin.vip/platform//views/contract/redirect1.html?dcid=' + v.dcid + '&type=' + type;
        $('#qrUrl').html('<a href="' + url + '" target="_blank">' + url + '<\/a>');
        layer.open({ type: 1, title: type == 1 ? '二维签名' : '二维客签', content: $('#qrBox'), area: ['460px', '240px'] });
    }

    function sendNotice(title, v, type) {
        app.showConfirm(title + '?', function () {
            app.post(api.decoration.sendDecorationContract, { 'decorationContract.dcid': v.dcid, 'decorationContract.type': type }, function () {
                app.showAlert(app.success, '通知已发送');
            });
        });
    }

    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || api.index.decorationIndex.url); });
});
}); // end app.ready
