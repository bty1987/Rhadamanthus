$(function () {
    Api().init('../../js/api/');

    params.serverPath = window.server;
    params.authentication = parent.params.authentication;

    var args = window.location.search.substr(1);

    var amountInTotal = 0;

    var numberOfCases = 0;

    if (args.indexOf('time=') != -1) {
        params.loginTime = args.substring(args.indexOf('time=')).split('=')[1];
    }

    var trList = $('#resultList');
    var $amountInTotal = $('#amountInTotal');
    var $numberOfCases = $('#numberOfCases');

    var querySalesItemBySid = api.inventory.querySalesItemBySid;
    querySalesItemBySid.url = querySalesItemBySid.url + "?" + args;

    com.post(querySalesItemBySid, {}, function (data) {

        $.each(data.salesItems, function (i, v) {

            amountInTotal += v.total;
            numberOfCases += v.num;

            var tr1 = createList(i, v);

            tr1.appendTo(trList)

        })

        $amountInTotal.html(amountInTotal);
        $numberOfCases.html(numberOfCases);
    });

    function createList(i, v) {

        var tr = $('<tr style="page-break-inside:avoid;height:13.0pt"></tr>');

        var index = i + 1;

        var propertyArr = [
            //v.gid,
            //v.no,
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
            $td.appendTo(tr)
        })

        return tr;
    }

})

