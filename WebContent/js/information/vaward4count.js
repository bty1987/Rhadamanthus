
$(function(){

    $.ajax({
        url: "../../countVaward.do",
        data: $.extend({authentication: "eX3o2SZdrpVOV9HC4UYTRA=="}, getUrlParams()),
        type: "post",
        dataType: "json",
        success: function(res) {

            var counts = res.counts;

            addLine($("#table"), counts);
        }
    });

    function addLine(tableId, lists){

        if(lists != null && lists.length > 0){
            for(var i = 0; i < lists.length; i++){
                var $tr = $('<tr></tr>');
                var list = lists[i];

                for(var j = 0; j < list.length; j++){
                    var $tdTwo = $('<td></td>').css("text-align", "center").html(list[0]);
                    var $tdThr = $('<td></td>').css("text-align", "center").html(list[1]);
                }
                $tr.append($tdTwo).append($tdThr).appendTo(tableId);
            }
        }
    }

    function getUrlParams() {
        var url = location.search;

        var theRequest = new Object();
        url && (url = decodeURI(url));
        if (url.indexOf("?") != -1) {
            strs = url.substr(1).split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    };

});
