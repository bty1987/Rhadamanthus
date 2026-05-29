$(function() {

    // 附加项类型常量
    var TYPE_QUOTA_INT = 3;

    var NORMTYPE_WORKFEE_INT = 0; // 工费
    var NORMTYPE_ADD_INT = 1;     // 附加

    var ATTTYPE_COLLECTION_INT = 0; // 收取
    var ATTTYPE_SUB_INT = 1;        // 扣除

    var STATUS_INIT_INT = 0;
    var STATUS_CONFIRMED_INT = 2;

    var orderId = params.quotation.orderId;
    var currentQid = null;

    if (orderId) {
        com.focusPage('#normriceItemOrderId').text(orderId);
        queryData(orderId);
    } else {
        com.focusPage('#normriceItemInfo').removeClass("alert-info").addClass("alert-warning").html("缺少装修单号参数");
    }

    // 初始化施工节点下拉
    com.post(api.data.queryConstructionNode, {}, function(res) {
        var $select = com.focusPage('#niConstructionNode');
        $select.append('<option value="">请选择</option>');
        $.each(res.constructionNodes, function(i, v) {
            $select.append('<option value="' + v.cnid + '">' + v.name + '</option>');
        });
    }, null, false);

    // 新增附加项按钮
    com.focusPage('#btnAddNormriceItem').on('click', function() {
        if (!currentQid) {
            com.showAlert(com.warning, "报价信息未加载，无法新增");
            return;
        }
        // 清空表单
        com.focusPage('#niConstructionNode').val('');
        com.focusPage('#niName').val('');
        com.focusPage('#niSalary').val('');
        com.focusPage('#niNum').val('1');
        com.focusPage('#niTrannum').val('1');
        com.focusPage('#addNormriceItemModal').modal('show');
    });

    // 保存按钮
    com.focusPage('#btnSaveNormriceItem').on('click', function() {

        if (com.validate("addNormriceItemForm"))
            return false;

        var cnid = com.focusPage('#niConstructionNode').val();
        var name = com.focusPage('#niName').val();
        var salary = com.focusPage('#niSalary').val();
        var num = com.focusPage('#niNum').val() || 1;
        var trannum = com.focusPage('#niTrannum').val() || 1;

        var options = {
            "normtion.qid": currentQid,
            "normriceItem.constructionNode.cnid": cnid,
            "normriceItem.name": name,
            "normriceItem.num": num,
            "normriceItem.trannum": trannum,
            "normriceItem.salary": salary
        };

        com.post(api.quotation.addNormriceItem, options, function(res) {

            com.showAlert(com.success, "附加项创建成功");
            com.focusPage('#addNormriceItemModal').modal('hide');

            // 刷新列表
            queryData(orderId);

        }, function(e) {
            com.showAlert(com.warning, "创建附加项失败：" + (e || "未知错误"));
        });
    });

    // 确认附加项 (事件委托, 因为按钮是动态生成的)
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
            '<th>施工节点</th>' +
            '<th>名称</th>' +
            '<th>定额类型</th>' +
            '<th>收取/扣除</th>' +
            '<th>单位</th>' +
            '<th class="center">转换量</th>' +
            '<th class="center">工费</th>' +
            '<th class="center">数量</th>' +
            '<th class="center">金额</th>' +
            '<th class="center">状态</th>' +
            '<th class="center">操作</th>' +
            '</tr>'
        );

        var totalAmount = 0;

        $.each(items, function(i, v) {

            var normtypeName = v.normtype == NORMTYPE_ADD_INT ? "附加" : "工费";
            var atttypeName = v.atttype == ATTTYPE_SUB_INT ? "扣除" : "收取";

            var salary = parseFloat(v.salary) || 0;
            var trannum = parseFloat(v.trannum) || 0;
            var num = parseFloat(v.num) || 0;

            if (v.atttype == ATTTYPE_SUB_INT) {
                salary = -salary;
            }

            var amount = 0;
            if (trannum == 0) {
                amount = utils.changeThrDecimal(utils.accMul(1, utils.accMul(1, salary)));
            } else {
                amount = utils.changeThrDecimal(utils.accMul(trannum / 1000, utils.accMul(num / 1000, salary)));
            }

            totalAmount = utils.accAdd(totalAmount, parseFloat(amount));

            var statusName = "待确认";
            var statusClass = "label-warning";
            if (v.status == STATUS_CONFIRMED_INT) {
                statusName = "已确认";
                statusClass = "label-success";
            }

            var actionHtml = '';
            if (v.status != STATUS_CONFIRMED_INT) {
                actionHtml = '<button type="button" class="btn btn-minier btn-primary btn-confirm-normriceitem" data-npiid="' + v.npiid + '">确认</button>';
            } else {
                actionHtml = '<span class="label label-success arrowed-in">-</span>';
            }

            var nodeRow = '<tr>' +
                '<td class="center">' + (i + 1) + '</td>' +
                '<td>' + (v.constructionNode ? v.constructionNode.name : '-') + '</td>' +
                '<td>' + (v.name || '-') + '</td>' +
                '<td>' + normtypeName + '</td>' +
                '<td>' + atttypeName + '</td>' +
                '<td>' + (v.unit || '-') + '</td>' +
                '<td class="center">' + v.trannum + '</td>' +
                '<td class="center">' + v.salary + '</td>' +
                '<td class="center">' + v.num + '</td>' +
                '<td class="center">' + amount + '</td>' +
                '<td class="center"><span class="label ' + statusClass + '">' + statusName + '</span></td>' +
                '<td class="center">' + actionHtml + '</td>' +
                '</tr>';

            $tbody.append(nodeRow);
        });

        $tbody.append(
            '<tr class="info">' +
            '<td colspan="9" class="text-right"><strong>合计</strong></td>' +
            '<td class="center"><strong>' + utils.changeThrDecimal(totalAmount) + '</strong></td>' +
            '<td colspan="2"></td>' +
            '</tr>'
        );

        $table.append($thead).append($tbody);
        $resultList.append($table);
    }

});
