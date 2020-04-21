$(function(){
    
    com.popup4photos("#resultList");

    var displayFunc = (function(){

       var renderList = function(tableId, listData){
           var $tableWrap = com.focusPage('#' + tableId);
           var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
           if(listData && listData.length){
               $.each(listData,function(i, v){
                   var $liLine = creatLine(v);
                   $liLine.appendTo($ul);
               });
               $ul.appendTo($tableWrap);
           }
       };

        var creatLine=function(v){
            var $liLine=$('<li></li>').addClass('item-orange clearfix ');

            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>'));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var  $urldiv = $('<div style="border: 1px solid #ccc;"></div>').addClass('divimg').css("width", "75px").css("height","75px").css("margin-right", "10px");
            var img = $('<img/>');
            var imgA = $('<a></a>').attr("display", "none").addClass('cboxElement').attr("target","_blank").css("height", "150px").append(img).appendTo($urldiv);
            
            com.showImg(img, v.picture, 75, 75, '', null, 0);

            var propertyArr = [
                ["图片: ", $urldiv, "grey"],
                ["说明: ", v.content, "grey"],
                ["创建时间: ",  v.createTime, "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b style="float: right"></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            return $liLine;
        };
        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();

    searcher.init(['feedbackCreateTime'], "condList",api.customer.pageFeedback, function(res){
        displayFunc.init("resultList",res);
    },"pagenation");

})();