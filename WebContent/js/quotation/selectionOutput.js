var printselectionDetail = (function() {

    api = parent.api;
    config = parent.config;
    server = parent.server;
    utils = parent.utils;
    com = parent.com;
    params = parent.params;
    constant = parent.constant;

    var selectionDetail = {
        decoration: {},
        selectionItem: {},
        orderId: null,

        types: {},
    };

    var printer = {

        printHead: function(orderId, decoration) {

            var headHtml = "";

            var supervisorName = decoration.supervisor.currentName ? decoration.supervisor.currentName : " ";
            var supervisorPhone = decoration.supervisor.phone ? decoration.supervisor.phone : " ";
            var quoterName = decoration.quoter.currentName ? decoration.quoter.currentName : " ";
            var materialerName = decoration.materialer.currentName ? decoration.materialer.currentName : " ";
            var materialerPhone = decoration.materialer.phone ? decoration.materialer.phone : " ";
            var affirmTime = params.selection.affirmTime != null ? params.selection.affirmTime : "";

            headHtml += '<table style="font-size: 14px" width="100%" border="0" cellpadding="1" cellspacing="0">';
            headHtml += '<tbody><tr bgcolor="#FFFFFF">';
            headHtml += '<td colspan="8" style="font-size: 20px" align="center"> <b>' + "选材明细列表" + '</b></td>';
            headHtml += '</tr>';
            headHtml += '<tr bgcolor="#FFFFFF">';
            headHtml += '<td colspan="8" height="10"></td>';
            headHtml += '</tr>';
            headHtml += '<tr bgcolor="#FFFFFF">';
            headHtml += '<td colspan="1" width="33%">装修单号: ' + orderId + '</td>';
            headHtml += '<td colspan="1" width="33%">楼盘地址: ' + decoration.house.village.name + " " + decoration.house.houseNumber + '</td>';
            headHtml += '<td colspan="1" width="33%">客户姓名: ' + decoration.customer.name + '</td>';
            headHtml += '</tr>';
            headHtml += '<tr bgcolor="#FFFFFF">';
            headHtml += '<td colspan="1" width="33%">设计师: ' + decoration.designer.currentName + '</td>';
            headHtml += '<td colspan="1" width="33%">预算员: ' + quoterName + '</td>';
            headHtml += '<td colspan="1" width="33%">主材员: ' + materialerName + '</td>';
            headHtml += '</tr>';
            headHtml += '<tr bgcolor="#FFFFFF">';
            headHtml += '<td colspan="1" width="33%">确认状态: ' + constant.quotation().selection.isAffirm.keys[params.selection.isAffirm] + '</td>';
            headHtml += '<td colspan="1" width="33%">确认时间: ' + affirmTime + '</td>';
            headHtml += '</tr>';
            headHtml += '<tr bgcolor="#FFFFFF">';
            headHtml += '<td colspan="8" height="10"></td>';
            headHtml += '</tr>';
            headHtml += '</tbody></table>';

            return headHtml;
        },

        printBody: function(selectionItems, quotationFunctionAreaItems, extensionItems, addReduceItems) {

            var index = 1;
            var contentHtml = '';
            var selections = {};

            contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
            contentHtml += '<tbody><tr bgcolor="#FFFFFF">';
            contentHtml += '<td width="4%" align="center">序号</td>';
            contentHtml += '<td width="4%" align="center">图片</td>';
            contentHtml += '<td width="7%" align="center">报价项</td>';
            contentHtml += '<td width="4%" align="center">品牌</td>';
            contentHtml += '<td width="4%" align="center">类型</td>';
            contentHtml += '<td width="10%" align="center">型号</td>';
            contentHtml += '<td width="4%" align="center">单位</td>';
            contentHtml += '<td width="4%" align="center">数量</td>';
            contentHtml += '<td width="15%" align="center">备注</td>';
            contentHtml += '</tr>';
            contentHtml += '</tbody></table>';

            contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
            contentHtml += '<tbody>';

            $.each(selectionItems, function(i, selectionItem) {

                if (selections[selectionItem.areaName]) {
                    selections[selectionItem.areaName].push(selectionItem);
                } else {
                    selections[selectionItem.areaName] = [selectionItem];
                }
            });

            $.each(selections, function(i, items) {

                contentHtml += '<tr bgcolor="#CCCCCC">';
                contentHtml += '<td colspan="1">';
                contentHtml += '<div align="center">' + utils.getBigNumber(index++) + '</div></td>';
                contentHtml += '<td colspan="10">';
                contentHtml += '<div align="left">' + i + '';
                contentHtml += '</div>';
                contentHtml += '</td>';
                contentHtml += '</tr>';

                $.each(items, function(j, v) {

                    if (params.quotation.supplierPage == true && params.userInfo.user.uid != v.supplier.uid)
                        return true;

                    var num = [2, 4, 32, 34].indexOf(v.type) != -1 ? -v.num : v.num;

                    var item = {
                        "name": ""
                    };

                    if ([0, 30].indexOf(v.type) != -1 && quotationFunctionAreaItems[v.quoteId])
                        item = {
                            "name": quotationFunctionAreaItems[v.quoteId].itemName
                        }
                    if ([1, 2, 31, 32].indexOf(v.type) != -1 && extensionItems[v.quoteId])
                        item = {
                            "name": extensionItems[v.quoteId].itemName
                        }
                    if ([3, 4, 13, 14, 33, 34].indexOf(v.type) != -1 && addReduceItems[v.quoteId])
                        item = {
                            "name": addReduceItems[v.quoteId].itemName
                        }

                    var img = $('<img width="40px"/>');

                    if (v.soods.path != null) {
                        com.showImg(img, v.soods.path, 40, 40, v.goods.name, null, null);
                    }

                    contentHtml += '<tr bgcolor="#FFFFFF">';
                    contentHtml += '<td width="4%" align="center">' + (j + 1) + '</td>';
                    contentHtml += '<td width="4%" align="center">' + img[0].outerHTML + '</td>';
                    contentHtml += '<td width="7%" align="center">' + item.name + '</td>';
                    contentHtml += '<td width="4%" align="center">' + v.goods.brand + '</td>';
                    contentHtml += '<td width="4%" align="center">' + selectionDetail.types[v.type] + '</td>';
                    contentHtml += '<td width="10%" align="center">' + v.goods.name + '</td>';
                    contentHtml += '<td width="4%" align="center">' + v.goods.measurementUnit + '</td>';
                    contentHtml += '<td width="4%" align="center">' + num + '</td>';
                    contentHtml += '<td width="15%" align="center">' + (v.comment ? v.comment : "") + '</td>';
                    contentHtml += '</tr>';
                });
            });

            contentHtml += '</tbody>';
            contentHtml += '</table>';

            return contentHtml;
        },

        printFooter: function() {

            var contentHtml = "";

            contentHtml += '<table style="font-size: 15px" width="100%;" border="0" cellpadding="1" cellspacing="0">';
            contentHtml += '<tbody>';
            contentHtml += '<tr>';
            contentHtml += '<td height="10"></td>';
            contentHtml += '</tr>';
            contentHtml += '<tr>';
            contentHtml += '<td colspan="8" width="100%" style="font-size: 15px"><b>注: 开工放线当日起，48小时内是允许变更一次主材，且最多只允许变更两个品类，如超期发生主材变更，每变更一个品类，客户主材工期自动顺延7个工作日. </b></td>';
            contentHtml += '</tr>';
            contentHtml += '<tr></tr></tbody></table>';

            return contentHtml;
        }
    };

    return {
        init: function() {

            selectionDetail.orderId = params.selection.orderId;

            selectionDetail.types = constant.quotation().selectionItem.type.keys;

            com.post(api.decoration.queryDecorationForCommonByOrderId, {
                "decoration.orderId": selectionDetail.orderId
            }, function(res) {

                selectionDetail.decoration = res.decoration;
            }, null, false);

            var selectionItems = [];

            com.post(api.quotation.querySelectionItemByOrderId, {
                "selectionItem.decoration.orderId": selectionDetail.orderId
            }, function(res) {

                selectionItems = res.selectionItems;
            }, null, false);

            var quotation = {};

            com.post(api.quotation.queryQuotationForDefaultByOrderId, {
                "quotation.orderId": selectionDetail.orderId
            }, function(res) {

                quotation = res.quotation;
            }, null, false);

            var quotationFunctionAreaItems = {};

            com.post(api.quotation.queryQuotationFunctionAreaByQuotationId, {
                "quotation.qid": quotation.qid
            }, function(res) {

                $.each(res.quotationFunctionAreas, function(i, v) {

                    $.each(v.quotationFunctionAreaItems, function(vi, vv) {

                        quotationFunctionAreaItems[vv.qfaiId] = vv;
                    });
                });
            }, null, false);

            var extensionItems = {};

            com.post(api.quotation.queryExtensionByOrderId, {
                "extension.orderId": selectionDetail.orderId
            }, function(res) {

                $.each(res.extensions, function(i, v) {

                    $.each(v.extensionItems, function(vi, vv) {

                        extensionItems[vv.eiid] = vv;
                    });
                });

            }, null, false);

            var addReduceItems = {};

            com.post(api.quotation.queryAddReduceByOrderId, {
                "addReduce.orderId": selectionDetail.orderId
            }, function(res) {

                $.each(res.addReduces, function(i, v) {

                    $.each(v.addReduceItems, function(vi, vv) {

                        addReduceItems[vv.ariId] = vv;
                    });
                });

            }, null, false);

            var html = "";

            html += printer.printHead(selectionDetail.orderId, selectionDetail.decoration);
            html += printer.printBody(selectionItems, quotationFunctionAreaItems, extensionItems, addReduceItems);
            html += printer.printFooter();

            $('#selectionList').html(html);
        }
    }
})();

jQuery(function($) {

    printselectionDetail.init();
});
