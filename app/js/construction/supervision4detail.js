/** app/js/construction/supervision4detail.js —— 施工节点详情（旧 ace_wizard → layui tab）
 *  上下文：app.params.construction = { orderId, cid?, type? }。
 *  流程：queryConstructionScheduleByOrderId → 按 schedule 排序建 tab；切 tab 时懒加载：
 *    queryConstructionScheduleByOrderIdASchedule（时间/状态）→ queryConstructerByOrderId（工人）→
 *    queryConstructionDrawingByCid（图库）→ 绑定进场/离场（enter/leaveConstructionSchedule）与图片上传。 */
app.ready(function () {
layui.use(['table', 'element', 'form', 'layer', 'upload', 'jquery'], function () {
    var element = layui.element, form = layui.form, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var ctx = app.params.construction || {};
    var pageType = (app.params.urlLoadParams && app.params.urlLoadParams.type) || '';
    var schedules = [];

    $('#orderIdLabel').text(ctx.orderId || '-');

    if (!ctx.orderId) { app.showAlert(app.warning, '缺少订单上下文'); return; }

    // —— 初始化：拉取全部施工节点 + 主材计划(按节点分组)，构建 tab ——
    app.post(api.construction.queryConstructionScheduleByOrderId, { 'constructionSchedule.orderId': ctx.orderId }, function (res) {
        var list = (res.constructionSchedules || []).sort(function (a, b) { return (a.schedule || 0) - (b.schedule || 0); });
        if (!list.length) { app.showAlert(app.warning, '无施工节点'); return; }
        schedules = list;

        app.post(api.construction.queryMaterialPlanByOrderId, { 'materialPlan.orderId': ctx.orderId }, function (mpRes) {

            var materialPlanMap = {};
            $.each(mpRes.materialPlans || [], function (i, plan) {
                if (plan.cnid == null) return;
                if (!materialPlanMap[plan.cnid]) materialPlanMap[plan.cnid] = [];
                materialPlanMap[plan.cnid].push(plan);
            });

            // 默认激活状态=1（进行中）的节点，否则第一个
            var activeIdx = 0;
            $.each(list, function (i, v) { if (v.status == 1) { activeIdx = i; return false; } });

            var titles = '', contents = '';
            $.each(list, function (i, v) {
                var layId = 'node_' + v.csid;
                v._layId = layId;

                var plans = materialPlanMap[v.cnid] || [];
                var overdue = 0;
                $.each(plans, function (j, plan) { if (plan.overdue == 1) overdue++; });

                var badge = overdue > 0 ? ' <span class="layui-badge layui-badge-danger" title="主材计划逾期">' + overdue + '</span>' : '';
                titles += '<li' + (i === activeIdx ? ' class="layui-this"' : '') + ' lay-id="' + layId + '" data-csid="' + v.csid + '" data-schedule="' + v.schedule + '">' + (v.node ? v.node.name : v.schedule) + badge + '<\/li>';
                contents += '<div class="layui-tab-item' + (i === activeIdx ? ' layui-show' : '') + '" id="' + layId + '">' + buildPane(v, plans) + '<\/div>';
            });
            $('#tabTitles').html(titles);
            $('#tabContent').html(contents);
            element.render('tab');

            loadPane(list[activeIdx]);
        }, null, false);
    });

    // —— 单节点面板骨架（layui-tab-item 由外层包装）——
    function buildPane(v, materialPlans) {
        var csid = v.csid;
        var name = v.node ? v.node.name : '';

        var preRow = '<div class="node-info-row"><label>预计开工</label><input class="layui-input" readonly value="' + (v.preStartTime || '') + '">'
            + '<label style="margin-left:20px;">预计完工</label><input class="layui-input" readonly value="' + (v.preEndTime || '') + '"><\/div>';

        var statusTags = '';
        if (v.additemStatus == 1) statusTags += ' <span class="layui-badge layui-bg-orange" title="报价附加项待审">附加项待审</span>';
        if (v.checkout == 1) statusTags += ' <span class="layui-badge layui-bg-gray" title="开工完工款比例校验已豁免">款比例豁免</span>';

        var paramsHtml = '<div class="node-info-row" style="flex-wrap:wrap;line-height:30px;">'
            + param('工期', v.period == null ? '-' : v.period + '天') + param('前置间隔', v.prenum == null ? '-' : v.prenum + '天') + param('后置间隔', v.postnum == null ? '-' : v.postnum + '天')
            + param('开工款比', v.precheck == null ? '-' : v.precheck + '%') + param('完工款比', v.postcheck == null ? '-' : v.postcheck + '%')
            + param('开工材比', v.stacheck == null ? '-' : v.stacheck + '%') + param('完工材比', v.fincheck == null ? '-' : v.fincheck + '%')
            + param('预估工费', v.planSalary == null ? '-' : v.planSalary + '元' + (v.planStatus == 1 ? '(已确认)' : ''))
            + '<\/div>';

        var html = ''
            + '<h3 class="layui-elip" style="font-size:15px;margin:10px 0;">' + name + '信息<\/h3>'
            + preRow
            + '<div class="node-info-row"><label>开工时间<\/label><input class="layui-input" id="' + csid + 'StartTime" readonly><label style="margin-left:20px;">完工时间<\/label><input class="layui-input" id="' + csid + 'EndTime" readonly><\/div>'
            + '<div class="node-info-row"><label>' + name + '状态<\/label><span id="' + csid + 'Status"><\/span>' + statusTags
            + '<label style="margin-left:20px;">进场状态<\/label><span id="' + csid + 'enterStatus"><\/span><\/div>'
            + '<div class="node-info-row"><label>进场时间<\/label><input class="layui-input" id="' + csid + 'EnterTime" readonly><label style="margin-left:20px;">离场时间<\/label><input class="layui-input" id="' + csid + 'LeaveTime" readonly><\/div>'
            + '<div class="node-btns">'
            + '<button type="button" class="layui-btn layui-btn-sm layui-btn-normal" id="' + csid + 'Success">进场<\/button>'
            + '<button type="button" class="layui-btn layui-btn-sm layui-btn-warm" id="' + csid + 'Leave">离场<\/button>'
            + '<\/div>'
            + '<h3 class="layui-elip" style="font-size:15px;margin:14px 0 6px;">计划参数<\/h3>'
            + paramsHtml
            + '<h3 class="layui-elip" style="font-size:15px;margin:14px 0 6px;">主材计划<\/h3>'
            + buildMaterialPlanHtml(materialPlans)
            + '<h3 class="layui-elip" style="font-size:15px;margin:14px 0 6px;">工人信息<\/h3>'
            + '<div id="' + csid + 'WorkerInfos" style="overflow:hidden;min-height:50px;"><\/div>'
            + '<h3 class="layui-elip" style="font-size:15px;margin:14px 0 6px;">施工图片<\/h3>'
            + '<div style="margin-bottom:10px;"><button type="button" class="layui-btn layui-btn-sm" id="' + csid + 'Upload"><i class="layui-icon layui-icon-upload-drag"><\/i>上传图片<\/button><\/div>'
            + '<ul class="node-gallery" id="' + csid + 'Gallery"><\/ul>'
            + '<div style="clear:both;"><\/div>';
        return html;
    }

    function param(key, value) {
        return '<span style="margin-right:18px;"><strong style="color:#999;">' + key + ':</strong> <span style="color:#01AAED;">' + value + '</span></span>';
    }

    // —— 主材计划区块（计划时点=后端读时推算, 系统履约=销售/配送/选材链回填）——
    function buildMaterialPlanHtml(materialPlans) {

        if (!materialPlans || !materialPlans.length) {
            return '<div class="layui-elem-quote layui-quote-nm">本节点暂无主材计划<\/div>';
        }

        var E = constructionCommon.ENUM;

        var html = '<table class="layui-table" lay-size="sm"><thead><tr>'
            + '<th>主材<\/th><th>动作<\/th><th>计划时点<\/th><th>系统履约<\/th><th>履约时间<\/th><th>状态<\/th><th>说明<\/th>'
            + '<\/tr><\/thead><tbody>';

        $.each(materialPlans, function (i, plan) {

            var material = plan.type == 1 ? ((plan.brandName || '') + '(' + (plan.categoryName || '') + ')') : (plan.categoryName || '');
            var status = (E.materialPlanStatus[plan.status] || plan.status) + (plan.status == 0 && plan.overdue == 1 ? '<span class="layui-badge layui-badge-danger" style="margin-left:5px;">逾期</span>' : '');

            html += '<tr' + (plan.overdue == 1 ? ' style="background:#ffebeb;"' : '') + '>'
                + '<td>' + material + '<\/td>'
                + '<td>' + (E.materialPlanAction[plan.action] || plan.action) + '<\/td>'
                + '<td>' + (plan.planTime || '待定') + '<\/td>'
                + '<td>' + (E.materialPlanAutoStatus[plan.autoStatus] || plan.autoStatus) + '<\/td>'
                + '<td>' + (plan.autoTime || '-') + '<\/td>'
                + '<td>' + status + '<\/td>'
                + '<td>' + (plan.comment || '') + '<\/td>'
                + '<\/tr>';
        });

        return html + '<\/tbody><\/table>';
    }

    // —— tab 切换：懒加载节点数据 ——
    element.on('tab(nodeTab)', function (data) {
        var v = schedules[data.index];
        if (v) loadPane(v);
    });

    function loadPane(v) {
        var csid = v.csid, schedule = v.schedule;
        var args = {
            'constructionSchedule.orderId': ctx.orderId,
            'constructionSchedule.csid': csid,
            'constructionSchedule.schedule': schedule
        };

        app.post(api.construction.queryConstructionScheduleByOrderIdASchedule, args, function (res) {
            var cs = res.constructionSchedule || {};
            if (!ctx.cid && cs.cid) ctx.cid = cs.cid;

            if (String(cs.schedule) === String(schedule)) {
                $('#' + csid + 'StartTime').val(cs.startTime || '');
                $('#' + csid + 'EndTime').val(cs.endTime || '');
                $('#' + csid + 'EnterTime').val(cs.enterTime || '');
                $('#' + csid + 'LeaveTime').val(cs.leaveTime || '');
                $('#' + csid + 'Status').html(constructionCommon.stateBadge(cs.status, ['初始', '开工', '完工']));
                $('#' + csid + 'enterStatus').html(constructionCommon.stateBadge(cs.workStatus, ['初始', '进场', '离场']));

                bindEnterLeave('#' + csid + 'Success', api.construction.enterConstructionSchedule, 1, csid, args, cs);
                bindEnterLeave('#' + csid + 'Leave', api.construction.leaveConstructionSchedule, 2, csid, args, cs);

                // 查询施工人员
                app.post(api.construction.queryConstructerByOrderId, {
                    'constructer.orderId': ctx.orderId,
                    'constructer.csid': cs.csid,
                    'constructer.schedule': cs.schedule
                }, function (r) { queryConstructer(r.constructers || [], schedule, csid); }, null, false);
            }

            // 工程图片
            app.post(api.construction.queryConstructionDrawingByCid, {
                'constructionDrawing.cid': ctx.cid,
                'constructionDrawing.schedule': schedule
            }, function (r) {
                $('#' + csid + 'Gallery').html('');
                $.each(r.constructionDrawings || [], function (i, drawing) {
                    appendGallery(csid, drawing.cdId, drawing.drawingUrl);
                });
            });

            bindUpload(csid, schedule);
        });
    }

    // —— 进场/离场（状态机按钮）——
    function bindEnterLeave(selector, apiName, workStatus, csid, args, cs) {
        $(selector).off('click').on('click', function () {
            if (pageType) return;
            app.post(apiName, { 'constructionSchedule.csid': cs.csid }, function () {
                app.showAlert(app.success, '操作成功');
                $('#' + csid + 'enterStatus').html(constructionCommon.stateBadge(workStatus, ['初始', '进场', '离场']));
                app.post(api.construction.queryConstructionScheduleByOrderIdASchedule, args, function (res) {
                    var s = res.constructionSchedule || {};
                    var timeField = workStatus == 1 ? 'enterTime' : 'leaveTime';
                    var domField = workStatus == 1 ? 'EnterTime' : 'LeaveTime';
                    $('#' + csid + domField).val(s[timeField] || '');
                });
            });
        });
    }

    // —— 工人信息 ——
    function queryConstructer(constructers, schedule, csid) {
        var $box = $('#' + csid + 'WorkerInfos');
        $box.html('');
        if (!constructers.length) {
            $box.html('<div class="layui-elem-quote layui-quote-nm">当前进度没有分配工人!<\/div>');
            return;
        }
        $.each(constructers, function (i, w) {
            var u = w.user || {};
            var html = '<div class="node-worker">'
                + '<img id="workerImg' + w.crid + '" src="" style="display:none;">'
                + '<div style="margin-top:6px;font-weight:bold;">' + (u.currentName || u.userName || '') + '<\/div>'
                + '<div style="color:#999;">' + (u.duty ? u.duty.name : '') + '<\/div>'
                + '<div style="margin-top:6px;"><button type="button" class="layui-btn layui-btn-xs layui-btn-warm" data-crid="' + w.crid + '" data-userid="' + (u.userId || '') + '">工人工费<\/button><\/div>'
                + '<\/div>';
            $box.append(html);
            if (u.userPhoto) app.showImg($('#workerImg' + w.crid), u.userPhoto, 80, 80, '');
        });
        // 工人工费：popup salary 模块子页
        $box.find('button[data-crid]').on('click', function () {
            app.params.workerSalary = {
                csid: csid,
                userId: $(this).attr('data-userid'),
                orderId: ctx.orderId
            };
            app.popup('views/salary/workerSalary4detail.html', '工人工费', null, { area: ['85%', '85%'] });
        });
    }

    // —— 图库 ——
    function appendGallery(csid, imgId, imgUrl) {
        var $li = $('<li id="gallery_li' + imgId + '"><\/li>').appendTo($('#' + csid + 'Gallery'));
        var $img = $('<img>').appendTo($li);
        app.showImg($img, imgUrl, 130, 130, '');
        $img.on('click', function () {
            layer.photos({ photos: { data: [{ src: /^[a-z]+:\/\//.test(imgUrl) ? imgUrl : (app.config.media + imgUrl) }] }, anim: 5 });
        });
        if (!pageType) {
            $('<div class="tools">删除<\/div>').on('click', function () {
                app.post(api.construction.deleteConstructionDrawing, { 'constructionDrawing.cdId': imgId }, function () {
                    $('#gallery_li' + imgId).remove();
                });
            }).appendTo($li);
        }
    }

    // —— 上传施工图片 ——
    function bindUpload(csid, schedule) {
        if (pageType) return;
        app.uploadImage({
            elem: '#' + csid + 'Upload',
            done: function (data) {
                var options = {
                    'constructionDrawing.cdId': 0,
                    'constructionDrawing.cid': ctx.cid,
                    'constructionDrawing.drawingName': '',
                    'constructionDrawing.drawingUrl': data.resUrl,
                    'constructionDrawing.drawingAddUrl': '',
                    'constructionDrawing.type': 0,
                    'constructionDrawing.filesize': data.filesize,
                    'constructionDrawing.csid': csid,
                    'constructionDrawing.schedule': schedule,
                    'constructionSchedule.cid': ctx.cid,
                    'constructionSchedule.csid': csid,
                    'constructionSchedule.schedule': schedule
                };
                app.post(api.construction.addConstructionDrawing, options, function (res) {
                    var drawing = res.constructionDrawing || {};
                    appendGallery(csid, drawing.cdId, data.resUrl);
                });
            }
        });
    }

    $('#btnBack').on('click', function () {
        // popup 场景直接关闭弹窗，独立页场景返回历史页
        if (window.parent && window.parent.layui) {
            try { parent.app && parent.layer && parent.layer.closeAll(); return; } catch (e) {}
        }
        app.switchPage(app.params.historyPage || api.index.constructionIndex.url);
    });
});
}); // end app.ready
