$(function() {

    // 附加项类型常量
    var TYPE_QUOTA_INT = 3;

    var ATTTYPE_SUB_INT = 1;      // 扣除

    var STATUS_CONFIRMED_INT = 2;
    var STATUS_REJECTED_INT = 3;

    var orderId = params.quotation.orderId;
    var cnid = params.constructionNode ? params.constructionNode.cnid : null;
    var currentQid = null;

    // normadd数据缓存
    var normaddData = [];

    if (orderId) {
        com.focusPage('#normriceItemOrderId').text(orderId);
        queryData(orderId);
    } else {
        com.focusPage('#normriceItemInfo').removeClass("alert-info").addClass("alert-warning").html("缺少装修单号参数");
    }

    // 初始化附加项下拉列表 (从 数据-附加项 加载)
    com.post(api.data.queryNormadd, cnid ? { "normadd.constructionNode.cnid": cnid } : {}, function(res) {
        normaddData = res.normadds || [];
        var $select = com.focusPage('#niNormadd');
        $select.append('<option value="">请选择附加项</option>');
        $.each(normaddData, function(i, v) {
            $select.append('<option value="' + v.naid + '">' + v.name + '</option>');
        });
    }, null, false);

    // 新增附加项按钮
    com.focusPage('#btnAddNormriceItem').on('click', function() {
        if (!currentQid) {
            com.showAlert(com.warning, "报价信息未加载，无法新增");
            return;
        }
        // 清空表单
        com.focusPage('#niNormadd').val('');
        com.focusPage('#niNum').val('1');
        com.focusPage('#addNormriceItemModal').modal('show');
    });

    // 保存按钮
    com.focusPage('#btnSaveNormriceItem').on('click', function() {

        if (com.validate("addNormriceItemForm"))
            return false;

        var sid = com.focusPage('#niNormadd').val();
        var num = com.focusPage('#niNum').val() || 1;

        if (!sid) {
            com.showAlert(com.warning, "请选择附加项");
            return false;
        }

        var options = {
            "normtion.qid": currentQid,
            "normriceItem.sid": sid,
            "normriceItem.num": num
        };

        if (cnid) {
            options["normriceItem.constructionNode.cnid"] = cnid;
        }

        com.post(api.quotation.addNormriceItem, options, function(res) {

            com.showAlert(com.success, "附加项创建成功");
            com.focusPage('#addNormriceItemModal').modal('hide');

            // 刷新列表
            queryData(orderId);

        }, function(e) {
            com.showAlert(com.warning, "创建附加项失败：" + (e || "未知错误"));
        });
    });

    // 确认附加项 (事件委托)
    com.focusPage('#normriceItemResultList').on('click', '.btn-confirm-normriceitem', function() {
        var npiid = $(this).data('npiid');
        com.showConfirm("确认要确认该附加项吗?", function() {
            com.post(api.quotation.confirmNormriceItem, {
                "normriceItem.npiid": npiid
            }, function(res) {
                com.showAlert(com.success, "附加项已确认");
                queryData(orderId);
            });
        });
    });

    // 驳回附加项 (事件委托)
    com.focusPage('#normriceItemResultList').on('click', '.btn-reject-normriceitem', function() {
        var npiid = $(this).data('npiid');
        com.showConfirm("确认要驳回该附加项吗?", function() {
            com.post(api.quotation.rejectNormriceItem, {
                "normriceItem.npiid": npiid
            }, function(res) {
                com.showAlert(com.success, "附加项已驳回");
                queryData(orderId);
            });
        });
    });

    function queryData(orderId) {

        com.post(api.quotation.queryQuotationByOrderId, {
            "quotation.orderId": orderId
        }, function(res) {

            if (!res.quotations || res.quotations.length == 0) {
                com.focusPage('#normriceItemResultList').html('<div class="alert alert-warning">未找到该装修单的报价信息</div>');
                return;
            }

            var quotation = res.quotations[0];
            currentQid = quotation.qid;

            com.post(api.quotation.queryNormriceItemByType, {
                "normriceItem.qid": currentQid,
                "normriceItem.type": TYPE_QUOTA_INT
            }, function(res) {

                renderList(res.normriceItems || []);

            }, function(e) {
                com.focusPage('#normriceItemResultList').html('<div class="alert alert-danger">查询附加项失败</div>');
            });

        }, function(e) {
            com.focusPage('#normriceItemResultList').html('<div class="alert alert-danger">查询报价单失败</div>');
        });
    }

    function renderList(items) {

        var $resultList = com.focusPage('#normriceItemResultList').empty();

        if (items.length == 0) {
            $resultList.append('<div class="alert alert-warning">无附加项数据</div>');
            return;
        }

        var $table = $('<table></table>').addClass('table table-striped table-bordered table-hover');
        var $thead = $('<thead></thead>');
        var $tbody = $('<tbody></tbody>');

        $thead.append(
            '<tr>' +
            '<th class="center">序号</th>' +
            '<th>名称</th>' +
            '<th class="center">数量</th>' +
            '<th class="center">金额</th>' +
            '<th class="center">状态</th>' +
            '<th class="center">操作</th>' +
            '</tr>'
        );

        var totalAmount = 0;

        $.each(items, function(i, v) {

            var salary = parseFloat(v.salary) || 0;
            var num = parseFloat(v.num) || 0;

            var amount = utils.changeThrDecimal(utils.accMul(num, salary));

            totalAmount = utils.accAdd(totalAmount, parseFloat(amount));

            var statusName = "待确认";
            var statusClass = "label-warning";
            if (v.status == STATUS_CONFIRMED_INT) {
                statusName = "已确认";
                statusClass = "label-success";
            } else if (v.status == STATUS_REJECTED_INT) {
                statusName = "已驳回";
                statusClass = "label-danger";
            }

            var actionHtml = '';
            if (v.status == STATUS_CONFIRMED_INT) {
                actionHtml = '<button type="button" class="btn btn-minier btn-danger btn-reject-normriceitem" data-npiid="' + v.npiid + '">驳回</button>';
            } else if (v.status != STATUS_REJECTED_INT) {
                actionHtml = '<button type="button" class="btn btn-minier btn-primary btn-confirm-normriceitem" data-npiid="' + v.npiid + '">确认</button> ' +
                    '<button type="button" class="btn btn-minier btn-danger btn-reject-normriceitem" data-npiid="' + v.npiid + '">驳回</button>';
            } else {
                actionHtml = '<span class="label label-default arrowed-in">-</span>';
            }

            var nodeRow = '<tr>' +
                '<td class="center">' + (i + 1) + '</td>' +
                '<td>' + (v.name || '-') + '</td>' +
                '<td class="center">' + v.num + '</td>' +
                '<td class="center">' + amount + '</td>' +
                '<td class="center"><span class="label ' + statusClass + '">' + statusName + '</span></td>' +
                '<td class="center">' + actionHtml + '</td>' +
                '</tr>';

            $tbody.append(nodeRow);
        });

        $tbody.append(
            '<tr class="info">' +
            '<td colspan="3" class="text-right"><strong>合计</strong></td>' +
            '<td class="center"><strong>' + utils.changeThrDecimal(totalAmount) + '</strong></td>' +
            '<td colspan="2"></td>' +
            '</tr>'
        );

        $table.append($thead).append($tbody);
        $resultList.append($table);
    }

});
