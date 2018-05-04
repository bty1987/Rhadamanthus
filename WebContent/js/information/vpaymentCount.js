
$(function(){

    $.ajax({
        url: "../../countVpayment.do",
        data: null,
        type: "post",
        dataType: "json",
        success: function(res) {
            var counts = res.counts;
            counts.sort(sortNumber);
            addLine($("#table"), counts)
        }
    });

    function addLine(tableId, lists){
        var price = 0;

        for(var i = 0; i < lists.length; i++){
            var $tr = $('<tr></tr>');
            var $tdOne = $('<td style="text-align: center"></td>').html(i+1);
            var list = lists[i];
            price = price + lists[i][1];
            for(var j = 0; j < list.length; j++){
                var $tdTwo = $('<td  style="text-align: center"></td>').html(list[0]);
                var $tdThr = $('<td style="text-align: center"></td>').html(list[1]);

            }
            $tr.append($tdOne).append($tdTwo).append($tdThr).appendTo(tableId);
        }
        //var total = $('#total').html('总金额:' + price + "元");
    }

    function sortNumber(a,b){
        return b[1] - a[1];
    }

});
