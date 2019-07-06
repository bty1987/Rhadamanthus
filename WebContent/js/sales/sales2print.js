$(function () {

    var params = {
        serverPath : window.server,
        authentication : parent.params.authentication,
        params : parent.params,
        amountInTotal:0,
        numberOfCases:0
    };
    
    var trList = com.focusPage('#resultList');
    var $amountInTotal = com.focusPage('#amountInTotal');
    var $numberOfCases = com.focusPage('#numberOfCases');

    var querySalesItemBySid = api.inventory.querySalesItemBySid;

    com.post(querySalesItemBySid, {
        'sales.sid':params.params.salesSid
    }, function (data) {

        $.each(data.salesItems, function (i, v) {

            params.amountInTotal += v.total;
            params.numberOfCases += v.num;

            var tr1 = createList(i, v);

            tr1.appendTo(trList);

        });

        $amountInTotal.html(params.amountInTotal);
        $numberOfCases.html(params.numberOfCases);
    });

    function createList(i, v) {

        var tr = $('<tr style="page-break-inside:avoid;height:13.0pt"></tr>');

        var index = i + 1;

        var propertyArr = [
            index,
            v.goods.brand,
            v.goods.name,
            v.goods.no,
            v.format.info,
            v.price,
            v.num,
            v.total,
            v.comment
        ];

        $.each(propertyArr, function (index, value) {
            var $td = $('<td width="101" valign="top" style="width:150pt;border:solid windowtext 1.0pt;border-bottom:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;height:30.0pt;text-align: center;line-height: 30.0pt;text-align: center;line-height: 30.0pt"></td>').html(value);
            $td.appendTo(tr);
        });
        return tr;
    }
});

