
jQuery(function($) {

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

        Date.prototype.Format = function (fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        };

        var creatLine = function(v){
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h4></h4>').addClass('oid').append($('<small></small>').addClass('blue').html('会员卡积分明细'));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var newTime = new Date(v.createTime).Format("yyyy-MM-dd hh:mm:ss");

            var propertyArr = [

                ["装修单号:", params.orderId , "grey"],
                ["积分类型:", v.type == 1 ? "主材" : (v.type == 2 ? "装修" :"转积分"),  "red"],
                ["积分增减:", v.subType == 0 ? "增加" : (v.subType == 1 ? "减少" :""), "red"],
                ["积分:", v.credit + "分", "red"],
                ["创建人:", v.cuId.userName , "grey"],
                ["创建时间:", newTime, "grey"],
                ["说明:", v.comment , "grey"]

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
    var _condArr = [  ];
    searcher.init(_condArr, "condList", api.member.pageMemberDetail, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "memberDetailPostData", {"filters[0].data": params.mcId,"filters[0].op":"eq","filters[0].field":"mcId"}, false, null, function(){
        var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'backtrack').css("margin", "0px 5px");
        var $impspan = $('<span></span>').text('返回').appendTo($impa);

        return [$impa];
    }, "resultList");

    $('a[name="backtrack"]', '#pagenation').click(function () {
        com.switchPage('views/member/memberCard.html');
        return false;
    });
});
