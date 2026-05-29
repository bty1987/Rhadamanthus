$(function() {

    var normriceItem = {

        items: {
            orderId: com.focusPage('#orderId')
        },
        btns: {
            queryBtn: com.focusPage('#queryBtn').on("click", queryData)
        }
    };

    // 附加项类型常量
    var TYPE_QUOTA_INT = 3;

    var NORMTYPE_WORKFEE_INT = 0; // 工费
    var NORMTYPE_ADD_INT = 1;     // 附加

    var ATTTYPE_COLLECTION_INT = 0; // 收取
    var ATTTYPE_SUB_INT = 1;        // 扣除

    normriceItem.items.orderId.on("keydown", function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            queryData();
        }
    });

    function queryData() {

        var orderId = normriceItem.items.orderId.val();

        if (!orderId) {
            com.showAlert(com.warning, "请输入装修单号");
            return;
        }

        // 先通过装修单号查询报价单, 取第一个报价单的 qid
        com.post(api.quotation.queryQuotationByOrderId, {
            "quotation.orderId": orderId
        }, function(res) {

            if (!res.quotations || res.quotations.length == 0) {
                com.showAlert(com.warning, "未找到该装修单的报价信息");
                return;
            }

            var quotation = res.quotations[0];
            var qid = quotation.qid;

            // 显示报价单信息
            com.focusPage('#quotationInfo').show();
            com.focusPage('#quotationOrderId').text(quotation.orderId);
            com.focusPage('#quotationStatus').text(quotation.status == 0 ? "初始" : quotation.status == 1 ? "审核" : quotation.status == 2 ? "确认" : quotation.status);

            // 查询附加项 (type=3)
            com.post(api.quotation.queryNormriceItemByType, {
                "normriceItem.qid": qid,
                "normriceItem.type": TYPE_QUOTA_INT
            }, function(res) {

                renderList(res.normriceItems || []);

            }, function(e) {
                com.showAlert(com.error, "查询附加项失败: " + e.errorMsg);
            });

        }, function(e) {
            com.showAlert(com.error, "查询报价单失败: " + e.errorMsg);
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

        // 表头
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
            '</tr>'
        );

        var totalAmount = 0;

        $.each(items, function(i, v) {

            var normtypeName = v.normtype == NORMTYPE_ADD_INT ? "附加" : "工费";
            var atttypeName = v.atttype == ATTTYPE_SUB_INT ? "扣除" : "收取";

            // 计算金额: 收取=+salary, 扣除=-salary; 转换量=0时按1算
            var salary = parseFloat(v.salary) || 0;
            var trannum = parseFloat(v.trannum) || 0;
            var num = parseFloat(v.num) || 0;

            var amount = 0;
            if (v.atttype == ATTTYPE_SUB_INT) {
                salary = -salary;
            }
            if (trannum == 0) {
                amount = utils.changeThrDecimal(utils.accMul(1, utils.accMul(1, salary)));
            } else {
                amount = utils.changeThrDecimal(utils.accMul(trannum / 1000, utils.accMul(num / 1000, salary)));
            }

            totalAmount = utils.accAdd(totalAmount, parseFloat(amount));

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
                '</tr>';

            $tbody.append(nodeRow);
        });

        // 合计行
        $tbody.append(
            '<tr class="info">' +
            '<td colspan="9" class="text-right"><strong>合计</strong></td>' +
            '<td class="center"><strong>' + utils.changeThrDecimal(totalAmount) + '</strong></td>' +
            '</tr>'
        );

        $table.append($thead).append($tbody);
        $resultList.append($table);
    }

});
