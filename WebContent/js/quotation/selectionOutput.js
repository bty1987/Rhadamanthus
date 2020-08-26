var printselectionDetail = (function() {
    var params = {};

    api = parent.api;
    config = parent.config ;
    server = parent.server;
    utils = parent.utils;
    com = parent.com;

    params.server = window.server;
    params = parent.params;


    var selectionDetail = {
        decoration: {},
        selectionItem: {},
        orderId: null,
    };

    var printer = {

        printHead : function(orderId, decoration) {

            var headHtml = "";

            var supervisorName = decoration.supervisor.currentName ? decoration.supervisor.currentName : " ";
            var supervisorPhone = decoration.supervisor.phone ? decoration.supervisor.phone : " ";
            var quoterName = decoration.quoter.currentName ? decoration.quoter.currentName : " ";
            var escorterName = decoration.escorter.currentName ? decoration.escorter.currentName : " ";
            var escorterPhone = decoration.escorter.phone ? decoration.escorter.phone : " ";

            headHtml += '<table style="font-size: 14px" width="100%" bgcolor="#000000" border="0" cellpadding="1" cellspacing="0">';
            headHtml += '<tbody><tr bgcolor="#FFFFFF">';
            headHtml += '<td colspan="8" style="font-size: 20px" align="center"> <b>' + "选材订购单" + '</b></td>';
            headHtml += '</tr>';
            headHtml += '<tr bgcolor="#FFFFFF">';
            headHtml += '<td colspan="8" height="10"></td>';
            headHtml += '</tr>';
            headHtml += '<tr bgcolor="#FFFFFF">';
            headHtml += '<td colspan="1" width="10%">装修单号: ' + orderId + '</td>';
            headHtml += '<td colspan="1" width="10%">楼盘地址: ' + decoration.house.village.name + " " + decoration.house.houseNumber + '</td>';
            headHtml += '<td colspan="1" width="10%">面积: ' + decoration.house.buildArea + '</td>';
            headHtml += '<td colspan="1" width="10%">客户姓名: ' + decoration.customer.name + '</td>';
            headHtml += '<td colspan="1" width="10%">设计师: ' + decoration.designer.currentName + '</td>';
            headHtml += '</tr>';
            headHtml += '<tr bgcolor="#FFFFFF">';
            headHtml += '<td colspan="1" width="10%">监理: ' + supervisorName + '</td>';
            headHtml += '<td colspan="1" width="10%">监理电话: ' + supervisorPhone + '</td>';
            headHtml += '<td colspan="1" width="10%">预算员: ' + quoterName + '</td>';
            headHtml += '<td colspan="1" width="10%">主材员: ' + escorterName + '</td>';
            headHtml += '<td colspan="1" width="10%">主材员电话: ' + escorterPhone + '</td>';
            headHtml += '</tr>';
            headHtml += '<tr bgcolor="#FFFFFF">';
            headHtml += '<td colspan="5" width="100%">放线日期: ' + " " + '</td>';
            headHtml += '</tr>';
            headHtml += '<tr bgcolor="#FFFFFF">';
            headHtml += '<td colspan="8" height="10"></td>';
            headHtml += '</tr>';
            headHtml += '</tbody></table>';

            return headHtml;
        },

        printBody: function(selectionItems) {
            var contentHtml = '';

            contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
            contentHtml += '<tbody><tr bgcolor="#FFFFFF">';
            contentHtml += '<td width="5%" align="center">序号</td>';
            contentHtml += '<td width="8%" align="center">功能区</td>';
            contentHtml += '<td width="12%" align="center">品牌</td>';
            contentHtml += '<td width="5%" align="center">品类</td>';
            contentHtml += '<td width="5%" align="center">商品编号</td>';
            contentHtml += '<td width="10%" align="center">型号</td>';
            contentHtml += '<td width="5%" align="center">规格</td>';
            contentHtml += '<td width="5%" align="center">单位</td>';
            contentHtml += '<td width="5%" align="center">数量</td>';
            contentHtml += '</tr>';
            contentHtml += '</tbody></table>';

            contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
            contentHtml += '<tbody>';

            $.each(selectionItems, function (i, selectionItem){

                if (params.supplierPage == true && params.userInfo.user.uid != selectionItem.suid) return true;

                var info = "无";

                com.post(api.data.queryFormatByGid, {"format.gid": selectionItem.goods.gid}, function(res) {
                    res.formats.length && $.each(res.formats, function(i, v) {
                        if (v.status == 0) {
                            info = v.info;
                            return false;
                        }
                    });
                }, null, false);

                var num = [2, 4].indexOf(selectionItem.type) != -1 ? -selectionItem.num : selectionItem.num;

                contentHtml += '<tr bgcolor="#FFFFFF">';
                contentHtml += '<td width="5%" align="center">' + (i + 1) + '</td>';
                contentHtml += '<td width="8%" align="center">' + selectionItem.areaName + '</td>';
                contentHtml += '<td width="12%" align="center">' + selectionItem.goods.brand + '</td>';
                contentHtml += '<td width="5%" align="center">' + selectionItem.goods.category + '</td>';
                contentHtml += '<td width="5%" align="center">' + selectionItem.goods.no + '</td>';
                contentHtml += '<td width="10%" align="center">' + selectionItem.goods.name + '</td>';
                contentHtml += '<td width="5%" align="center">' + info + '</td>';
                contentHtml += '<td width="5%" align="center">' + selectionItem.goods.measurementUnit + '</td>';
                contentHtml += '<td width="5%" align="center">' + num + '</td>';
                contentHtml += '</tr>';

            });

            contentHtml += '</tbody>';
            contentHtml += '</table>';

            contentHtml += '<table style="font-size: 12px" width="100%" border="0" cellpadding="1" cellspacing="0">';
            contentHtml += '<tbody>';
            contentHtml += '<tr>';
            contentHtml += '<td height="10"></td>';
            contentHtml += '</tr>';
            contentHtml += '<tr>';
            contentHtml += '<td><b>通知量尺时间:________________</b></td>';
            contentHtml += '<td><b>备货时间:________________</b></td>';
            contentHtml += '<td><b>下料时间:________________</b></td>';
            contentHtml += '</tr><tr>';
            contentHtml += '</tr></tbody></table>';


            return contentHtml;
        }
    };

    return {
        init: function () {

            selectionDetail.orderId = params.selectionOrderId;

            com.post(api.decoration.queryDecorationForCommonByOrderId,  {"decoration.orderId": selectionDetail.orderId},  function(res){
                selectionDetail.decoration = res.decoration;
            }, null, false);

            com.post(api.quotation.querySelectionItemByOrderId, {"selectionItem.decoration.orderId": selectionDetail.orderId}, function(res){
                selectionDetail.selectionItem = res.selectionItems;
            }, null, false);

            var html = "";

            html += printer.printHead(selectionDetail.orderId, selectionDetail.decoration);
            html += printer.printBody(selectionDetail.selectionItem);

            $('#selectionList').html(html);
        }
    }
})();

jQuery(function($) {
    printselectionDetail.init();
});

