
$(function(){

    $.ajax({
        url: "http://61.161.185.22:30001/queryMonitor.do",
        data: null,
        type: "post",
        dataType: "json",
        success: function(res) {
            var monitors = res.monitors;
            monitors.sort(sortNumber);
            addLine($("#table"), monitors)
        }
    });

    function addLine(tableId, monitors){
        var price = 0;

        for(var i = 0; i < monitors.length; i++){
            var $tr = $('<tr></tr>');
            var monitor = monitors[i];
            
            var $name = $('<td  style="text-align: center"></td>').html(monitor["name"]);
            var $host = $('<td style="text-align: center"></td>').html(monitor["host"]);
            var $type = $('<td style="text-align: center"></td>').html(monitor["type"]);
            var $count = $('<td style="text-align: center"></td>').html(monitor["count"]);
            var $updateTime = $('<td style="text-align: center"></td>').html(monitor["updateTime"]);
            
            $tr.append($name).append($host).append($type).append($count).append($updateTime).appendTo(tableId);
        }
    }

    function sortNumber(a,b){
        return b["count"] - a["count"];
    }

});
