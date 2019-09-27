
jQuery(function(a){

    $.ajax({
        url: "../countVticket.do",
        data: $.extend({authentication: ""}, getUrlParams()),
        type: "POST",
        dataType: "json",
        success: function(res) {
            var counts = res.counts;
            counts.sort(function(x, y){
                return y[2] - x[2];
            });
            addLine($("#table"), counts, getUrlParams().param);
        }
    });

    function addLine(tableId, lists, num){

        switch (num){
            case "1":
                $("#tr").append($("<th style='text-align: center'>已到场</th>"));
                break;
            case "2":
                $("#tr").append($("<th style='text-align: center'>已注册</th>"));
                break;
            default:
                $("#tr").append($("<th style='text-align: center'>票数</th>"));
                break;
        }

    	if(lists != null && lists.length > 0){
    		for(var i = 0; i < lists.length; i++){
                var $tr = $('<tr></tr>');
                var $tdOne = $('<td></td>').css("text-align", "center").html(i+1);
                var list = lists[i];
                for(var j = 0; j < list.length; j++){
                    var $tdTwo = $('<td></td>').css("text-align", "center").html(list[0]);
                    var $tdThr = $('<td></td>').css("text-align", "center").html(list[1]);
                    var $tdFour = $('<td></td>').css("text-align", "center").html(list[2]);
                }
                $tr.append($tdOne).append($tdTwo).append($tdThr).append($tdFour).appendTo(tableId);
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
