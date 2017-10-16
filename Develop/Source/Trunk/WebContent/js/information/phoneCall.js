

jQuery(function($) {
   var  stopReason={};
   var  recordType={};
    var stopReasons;
    var rescordTypes;
    com.post(api.ds.information, {}, function(res){
        stopReasons=res.stopReason;
        rescordTypes=res.recordType;
        $.each(res.stopReason,function (i,v) {
            stopReason[v.key] = v.value;
        });
        $.each(res.recordType,function (i,va) {
            recordType[va.key] = va.value;
        });
    },null,false);

    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.operater.userName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var propertyArr = [
                ["订单编号:", v.orderId, "red"],
                ["操作人:", v.operater.userId, "grey"],
                ["操作时间:", v.operateTime, "red"],
                ["通话信息编号:",v.callbackId,"grey"],
                ["主叫号码:", v.caller,"blue"],
                ["被叫号码:", v.callee,"blue"],
                ["开始时间:", v.startTime,"red"],
                ["结束时间:", v.endTime,"red"],
                ["挂断原因:", stopReason[v.stopReason],"green"],
                ["通话时长:", v.duration,"grey"],
                ["录音类型:",  recordType[ v.recordType],"blue"],
                ["录音地址:", v.recordUrl,"grey"],
            ];
            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            return $liLine;
        };

        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();

    var searcher = new Searcher();

    searcher.init(['userId'], "condList", api.information.pagePhoneCall, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "callphonePostData", null, false, null, function(){

    });

});
