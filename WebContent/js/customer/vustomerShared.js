$(function(){

    var displayFunc = (function(){
        var renderList = function(tableId, listData){
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData, function(i, v){
                    var $liLine = creatLine(v);
                    $liLine.appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };
        var creatLine = function(v){
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.phone));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $claim = $('<a></a>').addClass("btn btn-minier btn-yellow").html("认领");

            var propertyArr = [
                ["客户名称:", v.name, "grey"],
                ["客户地址:", v.address, "grey"],
                ["装修单号:", v.orderId, "grey"],
                ["推荐人:", v.referrer, "grey"],
                ["推荐人电话:", v.referphone, "blue"],
                ["创建时间:", v.createTime, "grey"],
                ["合同额:", v.contractPrice, "blue"],
                ["状态:", v.status == 0 ? "有效" : "无效", "red"],
                ["说明:", v.comment, "grey"]
            ];
            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($claim).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $claim.click(function(){
                btnclaim(v);
            });

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

    searcher.init(["cu_name"], "condList", api.customer.pageVustomerForCommunion, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "vustomerSharedPostData", null, false, null, null);

    function btnclaim(v) {
        var btn = $(this);
        var span = btn.find("span");
        btn.find('i').remove();
        var loading = $('<i></i>').addClass('icon-spinner icon-spin white bigger-125');
        span.prepend(loading);
        var message = "<p>确定要领取该大客户吗?</p>";
        bootbox.confirm(message, function (result) {
            if (result) {
                var options = {
                    "vustomer.vid": v.vid
                };
                com.post(api.customer.takeVustomer, options, function (res) {
                    searcher.doSearch();
                    com.showAlert(com.info,'领取成功');
                });
            }else{
                btn.find('i').remove();
                var prepared=$('<i></i>').addClass('icon-ok bigger-110');
                span.prepend(prepared);
            }
        });
    }

});