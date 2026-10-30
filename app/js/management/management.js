/** app/js/management/management.js —— 运维管理工具集
 * 原 WebContent/js/management/management.js（Bootstrap modal 版）迁移为 layui layer 弹窗表单。
 * 覆盖原页面全部可见工具：装修 12 项 / 报价 3 项 / 主材 1 项 / 销售 2 项 / 款项 2 项 / 工程 1 项。
 * 原 HTML 中隐藏的"导出/更新FR"区块与已注释的"装修款退款"未迁移。
 * 依赖 api.decoration / api.quotation / api.construction / api.payment / api.sales（app/js/api 已具备），
 * api.common.change* 三接口按 contract-common.js 的 ensureApiStubs 模式本地补齐。 */
app.ready(function () {
layui.use(['laydate', 'form', 'layer', 'jquery'], function () {
    var laydate = layui.laydate, form = layui.form, layer = layui.layer, $ = layui.jquery;

    // ==================== api.common 本地补齐（旧 \common.js，app 未迁移） ====================
    api.common = api.common || {};
    api.common.changeDecorationPaymentForTime = { url: 'changeDecorationPaymentForTime.do' };
    api.common.changeMaterialForOrderId = { url: 'changeMaterialForOrderId.do' };
    api.common.changeMaterialPaymentForTime = { url: 'changeMaterialPaymentForTime.do' };

    // ==================== 内置枚举 ====================
    // 装修单状态（对齐生产库 constant module='decoration'，同 decoration-common.js）
    var decorationStatusMap = { 0: '初始', 1: '定金', 2: '预签', 3: '签约', 4: '重签', 5: '废单', 6: '终止', 7: '决算', 8: '完工', 22: '审批中', 23: '审批中', 32: '可终止', 33: '可终止' };

    // ==================== 日期/时间选择 ====================
    laydate.render({ elem: '#orderDate', format: 'yyyy-MM-dd' });
    laydate.render({ elem: '#orderTime', type: 'time', format: 'HH:mm:ss' });
    laydate.render({ elem: '#orderPaymentDate', format: 'yyyy-MM-dd' });
    laydate.render({ elem: '#orderPaymentTime', type: 'time', format: 'HH:mm:ss' });
    laydate.render({ elem: '#materialPaymentDate', format: 'yyyy-MM-dd' });
    laydate.render({ elem: '#materialPaymentTime', type: 'time', format: 'HH:mm:ss' });

    // ==================== 弹窗容器 ====================
    var layerIndex = null;

    function openBox(boxId, title, onOpen) {
        var $box = $('#' + boxId);
        layerIndex = layer.open({
            type: 1, title: title, content: $box, area: ['560px', 'auto'],
            success: function () { if (onOpen) onOpen($box); },
            end: function () {
                app.clearValidator();
                // 对齐旧 modal hide.bs.modal 的 com.cleanItems：清空文本框并还原下拉
                $box.find('input[type=text]').val('');
                $box.find('select').each(function () { this.selectedIndex = 0; });
                form.render();
            }
        });
    }

    function closeBox() { if (layerIndex != null) { layer.close(layerIndex); layerIndex = null; } }

    function fillSelect(selId, list, key, value, allText) {
        app.bindData($('#' + selId), list, key, value, allText || '请选择');
        form.render();
    }

    // ==================== 按钮 → 弹窗绑定 ====================
    $('#changeDecorationForOrderId').on('click', function () { openBox('decorationForOrderIdBox', '装修单号更换'); });
    $('#changeDecorationForTime').on('click', function () { openBox('decorationForTimeBox', '装修单时间修改'); });
    $('#changeDecorationForVersionId').on('click', function () {
        openBox('decorationForVersionIdBox', '报价版本修改');
        app.post(api.quotation.queryQuotationVersion, {}, function (res) {
            fillSelect('versionId', res.quotationVersions || [], 'no', 'name');
        });
    });
    $('#changeDecorationForStatus').on('click', function () {
        openBox('decorationForStatusBox', '装修单签单状态修改');
        var list = [];
        $.each(decorationStatusMap, function (k, v) { list.push({ key: k, value: v }); });
        fillSelect('orderStatus', list, 'key', 'value');
    });
    $('#changeDecorationForGrade').on('click', function () { openBox('changeDecorationForGradeBox', '装修单等级修改'); });
    $('#subDecorationForQuotationTime').on('click', function () { openBox('subDecorationForQuotationTimeBox', '报价复制次数增加'); });
    $('#amountDecorationActivityItem').on('click', function () { openBox('amountDecorationActivityItemBox', '装修活动项统计'); });
    $('#updateDecorationMidpack').on('click', function () { openBox('updateDecorationMidpackBox', '装修半包信息更新'); });
    $('#updateDecorationHolonomy').on('click', function () { openBox('updateDecorationHolonomyBox', '装修满减信息更新'); });
    $('#changeDecorationForPayScale').on('click', function () { openBox('changeDecorationForPayScaleBox', '装修单款项比例更新'); });
    $('#hiddenDecoration').on('click', function () { openBox('hiddenDecorationBox', '隐藏/显示装修单'); });
    $('#resetDecorationFordesignStatus').on('click', function () { openBox('resetDesignStatusBox', '重置设计状态'); });
    $('#updateQuotationFunctionItemForManageRate').on('click', function () { openBox('updateQuotationFunctionItemForManageRateBox', '报价管理费比例更新'); });
    $('#updateQuotationForStatus').on('click', function () { openBox('updateQuotationForStatusBox', '报价状态修改'); });
    $('#addQuotationFunctionArea').on('click', function () { openBox('addQuotationFunctionAreaBox', '报价添加功能区'); });
    $('#changeMaterialForOrderId').on('click', function () { openBox('MaterialForOrderIdBox', '主材单归属装修单修改'); });
    $('#changeSalesForGrade').on('click', function () { openBox('changeSalesForGradeBox', '销售单等级修改'); });
    $('#changeSalesForStatus').on('click', function () { openBox('changeSalesForStatusBox', '销售单状态修改'); });
    $('#changeDecorationPyamentForTime').on('click', function () { openBox('decorationPaymentForTimeBox', '装修单款项收款时间修改'); });
    $('#changeMaterialPyamentForTime').on('click', function () { openBox('materialPaymentForTimeBox', '主材款收款时间修改'); });
    $('#checkoutConstructionSchedule').on('click', function () { openBox('checkoutConstructionScheduleBox', '工程款项验证'); });

    // ==================== 动态下拉（blur 联动，对齐原逻辑） ====================

    // 报价管理费比例：装修单号失焦 → 加载报价名称
    $('#quotationFunctionItemForManageRate').on('blur', function () {
        app.post(api.quotation.queryQuotationByOrderId, { 'quotation.orderId': $(this).val() }, function (res) {
            fillSelect('quotationNames', res.quotations || [], 'qid', 'name');
        });
    });

    // 报价状态修改：装修单号失焦 → 加载报价名称
    $('#quotationForOrderId').on('blur', function () {
        app.post(api.quotation.queryQuotationByOrderId, { 'quotation.orderId': $(this).val() }, function (res) {
            fillSelect('quotationData', res.quotations || [], 'qid', 'name');
        });
    });

    // 报价添加功能区：装修单号失焦 → 查装修单版本 → 加载 type=1 功能区
    $('#quotationOfOrderId').on('blur', function () {
        var orderId = $.trim($(this).val());
        if (!orderId) return;
        app.post(api.decoration.queryDecorationByOrderId, { decorationOrderId: orderId }, function (res) {
            var versionId = res.decoration.version.no;
            app.post(api.quotation.queryFunctionAreaByVersionId, { 'functionArea.version.no': versionId }, function (data) {
                var functionAreas = [];
                $.each(data.functionAreas || [], function (i, v) { if (v.type == 1) functionAreas.push(v); });
                fillSelect('quotationFunctionArea', functionAreas, 'faid', 'name');
            });
        }, function () {
            $('#quotationFunctionArea').html('');
            form.render();
        });
    }).on('focus', function () {
        $('#quotationFunctionArea').html('');
        form.render();
    });

    // 选中功能区 → 名称联动
    $('#quotationFunctionArea').on('change', function () {
        $('#quotationFunctionAreaName').val($(this).find('option:selected').text() || '');
    });

    // 工程款项验证：装修单号失焦 → 加载工程环节
    $('#orderId4constructionschedule').on('blur', function () {
        app.post(api.construction.queryConstructionScheduleByOrderId, { 'constructionSchedule.orderId': $(this).val() }, function (res) {
            var schedules = [];
            $.each(res.constructionSchedules || [], function (i, v) { v.name = v.node.name; schedules.push(v); });
            fillSelect('csid4constructionschedule', schedules, 'csid', 'name');
        });
    });

    // ==================== 保存动作（data-save 委托） ====================
    $('[data-save]').on('click', function () {
        var action = $(this).attr('data-save');
        var handlers = {

            // ===== 装修 =====
            decorationForOrderId: function () {
                if (app.validate('decorationForOrderIdBox')) return false;
                app.post(api.decoration.changeDecorationForOrderId, {
                    'decoration.orderId': $('#oldOrderId').val(),
                    'decorationOrderId': $('#newOrderId').val()
                }, function () { app.showAlert(app.info, '操作成功'); closeBox(); });
            },
            decorationForTime: function () {
                if (app.validate('decorationForTimeBox')) return false;
                app.post(api.decoration.changeDecorationForTime, {
                    'decoration.orderId': $('#orderIdForTime').val(),
                    'timeType': $('#timeType').val(),
                    'dateTime': $('#orderDate').val() + ' ' + $('#orderTime').val()
                }, function () { app.showAlert(app.info, '操作成功'); closeBox(); });
            },
            decorationForVersionId: function () {
                if (app.validate('decorationForVersionIdBox')) return false;
                app.post(api.decoration.changeDecorationForVersionId, {
                    'decoration.orderId': $('#orderIdForVersionId').val(),
                    'decoration.version.no': $('#versionId').val()
                }, function () { app.showAlert(app.info, '操作成功'); closeBox(); });
            },
            decorationForStatus: function () {
                if (app.validate('decorationForStatusBox')) return false;
                app.post(api.decoration.changeDecorationForStatus, {
                    'decoration.orderId': $('#orderIdForStatus').val(),
                    'decoration.status': $('#orderStatus').val()
                }, function () { app.showAlert(app.info, '操作成功'); closeBox(); });
            },
            changeDecorationForGrade: function () {
                if (app.validate('changeDecorationForGradeBox')) return false;
                var options = {
                    'decoration.orderId': $('#orderIdOfDecorationGrade').val(),
                    'decoration.grade': $('#decorationGrade').val()
                };
                var decoration = null;
                app.post(api.decoration.queryDecorationForCommonByOrderId, options, function (res) {
                    decoration = res.decoration;
                }, null, false);
                if (decoration != null) {
                    options['decoration.houseType'] = decoration.houseType;
                    options['decoration.houseClass'] = decoration.houseClass;
                    options['decoration.type'] = decoration.type;
                    app.post(api.decoration.changeDecorationForAdvance, options, function () {
                        app.showAlert(app.info, '操作成功');
                    }, null, false);
                } else {
                    app.showAlert(app.warning, '装修单不存在');
                }
                closeBox();
            },
            subDecorationForQuotationTime: function () {
                if (app.validate('subDecorationForQuotationTimeBox')) return false;
                app.post(api.decoration.subDecorationForQuotationTime, {
                    'decoration.orderId': $('#orderIdForQuotationTime').val()
                }, function () { app.showAlert(app.info, '操作成功'); closeBox(); });
            },
            amountDecorationActivityItem: function () {
                if (app.validate('amountDecorationActivityItemBox')) return false;
                app.post(api.decoration.amountDecorationActivityItem, {
                    'decoration.orderId': $('#orderId4decorationActivityItem').val()
                }, function () { app.showAlert(app.info, '操作成功'); closeBox(); });
            },
            updateDecorationMidpack: function () {
                if (app.validate('updateDecorationMidpackBox')) return false;
                app.post(api.decoration.updateDecorationMidpack, {
                    'decorationMidpack.decoration.orderId': $('#orderId4decorationMidpack').val(),
                    'decorationMidpack.materialPrice': $('#materialPriceMidpack').val()
                }, function () { app.showAlert(app.info, '操作成功'); closeBox(); });
            },
            updateDecorationHolonomy: function () {
                if (app.validate('updateDecorationHolonomyBox')) return false;
                app.post(api.decoration.updateDecorationHolonomy, {
                    'decorationHolonomy.decoration.orderId': $('#orderId4decorationHolonomy').val(),
                    'decorationHolonomy.materialPrice': $('#materialPriceHolonomy').val()
                }, function () { app.showAlert(app.info, '操作成功'); closeBox(); });
            },
            changeDecorationForPayScale: function () {
                if (app.validate('changeDecorationForPayScaleBox')) return false;
                app.post(api.decoration.changeDecorationForPayScale, {
                    'decoration.orderId': $('#orderIdForPayScale').val()
                }, function () { app.showAlert(app.info, '操作成功'); closeBox(); });
            },
            hiddenDecoration: function () {
                if (app.validate('hiddenDecorationBox')) return false;
                var orderId = $('#orderIdForHidden').val();
                app.showConfirm('确认要切换装修单 [' + orderId + '] 的隐藏/显示状态吗?', function () {
                    app.post(api.decoration.hiddenDecoration, { 'decoration.orderId': orderId }, function () {
                        app.showAlert(app.info, '操作成功');
                    });
                    closeBox();
                });
            },
            resetDesignStatus: function () {
                if (app.validate('resetDesignStatusBox')) return false;
                var orderId = $('#orderIdForResetDesign').val();
                app.showConfirm('确认要重置装修单 [' + orderId + '] 的设计状态吗?', function () {
                    app.post(api.decoration.resetDecorationFordesignStatus, { 'decoration.orderId': orderId }, function () {
                        app.showAlert(app.info, '重置成功');
                    });
                    closeBox();
                });
            },

            // ===== 报价 =====
            updateQuotationFunctionItemForManageRate: function () {
                if (app.validate('updateQuotationFunctionItemForManageRateBox')) return false;
                app.post(api.quotation.updateQuotationFunctionAreaItemByQuotationIdAType, {
                    'quotation.qid': $('#quotationNames').val(),
                    'quotationFunctionAreaItem.type': 3,
                    'quotationFunctionAreaItem.unitPrice': $('#manageRate').val()
                }, function () { app.showAlert(app.info, '操作成功'); closeBox(); });
            },
            updateQuotationForStatus: function () {
                if (app.validate('updateQuotationForStatusBox')) return false;
                app.post(api.quotation.updateQuotationForStatus, {
                    'quotation.qid': $('#quotationData').val(),
                    'quotation.status': $('#quotationStatus').val()
                }, function () { app.showAlert(app.info, '操作成功'); closeBox(); });
            },
            addQuotationFunctionArea: function () {
                if (app.validate('addQuotationFunctionAreaBox')) return false;
                app.showConfirm('你确认添加此功能区么', function () {
                    app.post(api.quotation.addQuotationFunctionArea, {
                        'quotation.orderId': $('#quotationOfOrderId').val(),
                        'quotationFunctionArea.id': $('#quotationFunctionArea').val(),
                        'quotationFunctionArea.functionAreaName': $('#quotationFunctionAreaName').val()
                    }, function () { app.showAlert(app.info, '操作成功'); closeBox(); });
                });
            },

            // ===== 主材 =====
            MaterialForOrderId: function () {
                if (app.validate('MaterialForOrderIdBox')) return false;
                app.post(api.common.changeMaterialForOrderId, {
                    'material.no': $('#msoNo').val(),
                    'material.orderId': $('#orderIdForOrderId').val()
                }, function () { app.showAlert(app.info, '操作成功'); closeBox(); });
            },

            // ===== 销售 =====
            changeSalesForGrade: function () {
                if (app.validate('changeSalesForGradeBox')) return false;
                var options = {
                    'sales.no': $('#changeSalesNo').val(),
                    'sales.grade': $('#salesGrade').val()
                };
                var sales = null;
                app.post(api.sales.querySalesByNo, options, function (res) {
                    sales = res.sales;
                }, null, false);
                if (sales != null) {
                    options['sales.sid'] = sales.sid;
                    app.post(api.sales.updateSales, options, function () {
                        app.showAlert(app.info, '操作成功');
                    }, null, false);
                } else {
                    app.showAlert(app.warning, '销售单不存在');
                }
                closeBox();
            },
            changeSalesForStatus: function () {
                if (app.validate('changeSalesForStatusBox')) return false;
                var options = { 'sales.no': $('#salesNo').val() };
                var sales = null;
                app.post(api.sales.querySalesByNo, options, function (res) {
                    sales = res.sales;
                }, null, false);
                if (sales != null) {
                    options['sales.sid'] = sales.sid;
                    app.post(api.sales.updateSalesForAdvance, options, function () {
                        app.showAlert(app.info, '操作成功');
                    }, null, false);
                } else {
                    app.showAlert(app.warning, '销售单不存在');
                }
                closeBox();
            },

            // ===== 款项 =====
            decorationPaymentForTime: function () {
                if (app.validate('decorationPaymentForTimeBox')) return false;
                app.post(api.common.changeDecorationPaymentForTime, {
                    'decorationPayment.decoration.orderId': $('#orderIdPaymentForTime').val(),
                    'decorationPayment.paymentType': $('#orderPaymentType').val(),
                    'dateTime': $('#orderPaymentDate').val() + ' ' + $('#orderPaymentTime').val()
                }, function () { app.showAlert(app.info, '操作成功'); closeBox(); });
            },
            materialPaymentForTime: function () {
                if (app.validate('materialPaymentForTimeBox')) return false;
                app.post(api.common.changeMaterialPaymentForTime, {
                    'materialPayment.material.no': $('#msoNoForTime').val(),
                    'materialPayment.paymentType': $('#materialPaymentType').val(),
                    'dateTime': $('#materialPaymentDate').val() + ' ' + $('#materialPaymentTime').val()
                }, function () { app.showAlert(app.info, '操作成功'); closeBox(); });
            },

            // ===== 工程 =====
            checkoutConstructionSchedule: function () {
                if (app.validate('checkoutConstructionScheduleBox')) return false;
                app.post(api.construction.checkoutConstructionSchedule, {
                    'constructionSchedule.csid': $('#csid4constructionschedule').val(),
                    'constructionSchedule.checkout': $('#check4constructionschedule').val()
                }, function () { app.showAlert(app.info, '操作成功'); closeBox(); });
            }
        };

        if (handlers[action]) handlers[action]();
    });
});
});
