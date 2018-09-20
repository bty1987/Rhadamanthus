$(function(){
    var colorboxArgs = {

        reposition: true,
        scalePhotos: true,
        scrolling: false,
        close: '&times;',
        maxWidth: '100%',
        maxHeight: '100%',
        rel:'group1',
        fixed : true,
        overflow:true,
        onLoad: function () {
            $('#cboxNext').remove();
            $('#cboxPrevious').remove();
            $('#cboxCurrent').remove();
        },

    }

    var displayFunc = (function(){

       var renderList = function(tableId, listData){
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
        var creatLine=function(v){
            var $liLine=$('<li></li>').addClass('item-orange clearfix ');

            var $urldiv = $('<div style="border: 1px solid #ccc;"></div>').addClass('divimg').css("width", "75px").css("height","75px").css("margin-right", "10px");

            var img = $('<img/>');
            var imgA = $('<a></a>').attr("data-rel", "colorbox").attr("display", "none").addClass('cboxElement').attr("href", com.showImg(img, v.picture, 75, 75, '', null, 0)).attr("target","_blank").css("height", "150px").append(img).appendTo($urldiv);

            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>'));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var propertyArr = [
                ["图片：", $urldiv, "grey"],
                ["说明：", v.content, "grey"],
                ["创建时间：",  timestampToTime(v.createTime), "grey"]
            ]

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b style="float: right"></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            imgA.colorbox(colorboxArgs);

            $("#cboxContent").css('position','absolute');
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
        };
    })()

    var searcher = new Searcher();
    searcher.init(['feedbackCreateTime'], "condList",api.customer.pageFeedBack, function(res){
        displayFunc.init("resultList",res);
    },"pagenation")

    function timestampToTime(timestamp) {
        var date = new Date(timestamp );//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        Y = date.getFullYear() + '-';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        D = date.getDate() + ' ';
        h = date.getHours() + ':';
        m = date.getMinutes() + ':';
        s = date.getSeconds();
        return Y+M+D+h+m+s;
    }

    function openlayer(){
        layer.closeAll();
        layer.open({
            type: 1,
            title:layerType,
            content: id,
            area: ( $(window).width()*0.6 < 620 ?  $(window).height()*0.6 : 620 )+"px",
            maxmin: false,
            zIndex: 9000,
            btn: [],
        });
    }

})()