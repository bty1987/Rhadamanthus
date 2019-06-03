$(function(){

    var vustomer = {
        vid:null,
        items:{}
    }
    vustomer.items.customerName= com.focusPage("#customerName");
    vustomer.items.customerPhone = com.focusPage("#customerPhone");
    vustomer.items.address = com.focusPage("#address");
    vustomer.items.comment = com.focusPage("#comment");
    vustomer.items.orderId = com.focusPage("#orderId");

    vustomer.bindSaveBtn = com.focusPage("#bindSaveBtn").on("click", bindOrderData);
    vustomer.vustomerSaveBtn = com.focusPage('#vustomerSaveBtn').on('click', changeBelonger);

    com.initTypeahead('belonger', api.personel.queryUserByPinyin, "pinyinName", {"duty":"", "user.status":0}, "userBases", "uid", "currentName", null);
    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
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

        var creatLine = function(v){

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.phone));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnBind = $('<a></a>').addClass('btn btn-minier btn-yellow').html('绑定');
            var $btnRecord = $('<a></a>').addClass('btn btn-minier btn-success').html('记录');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-warning').html('积分');
            var $edit = $('<a></a>').addClass("btn btn-minier btn-inverse").html("归属");


            var propertyArr = [
                ["客户名称:", v.name, "grey"],
                ["客户地址:", v.address, "grey"],
                ["装修单号:", v.orderId, "grey"],
                ["归属人:", v.belonger.userName, "grey"],
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

                $divBtnWrap.append($btnBind).append($btnRecord).append($btnDel).append($edit).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnBind.click(function(){
                vustomer.vid = v.vid;
                com.focusPage("#orderId").val("");

                if(v.orderId != null){
                    com.focusPage("#orderId").val(v.orderId);
                    com.focusPage("#orderId").attr('readonly',"readonly");
                }else{
                    com.focusPage("#orderId").removeAttr('readonly');
                }

                com.focusPage("#bindOrderModal").modal("show");

                com.clearValidator();

            });

            $btnRecord.click(function(){
                params.vid = v.vid;
                com.switchPage(api.index.vrecord.url);
            });

            $btnDel.click(function(){
                params.unionId = v.unionId;
                params.id = 1;
                com.switchPage(api.index.vscoreRecord.url)
            });

            $edit.click(function(){
                vustomer.vid = v.vid;
                com.focusPage("#belongerModal").modal("show");
                com.updateTypeahead("belonger", v.belonger.uid, com.checkNull(v.belonger.userName,''));
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

    searcher.init(["cu_name"], "condList", api.customer.pageVustomerForAdvance, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "vustomerPostData",null, false, null, null);

    function changeBelonger(){
        com.clearValidator();
        var option={
            "vustomer.vid": vustomer.vid,
            "vustomer.belonger.uid":com.typeahead("belonger")
        };
        com.post(api.customer.updateVustomerForBelonger,option,function(){
            searcher.doSearch();
            com.showAlert(com.info,'修改成功');
            com.focusPage("#belongerModal").modal("hide");
        });
    }

    function bindOrderData(){
        if(com.validate()){
            return;
        }

        var options = {
            'vustomer.vid': vustomer.vid,
            'vustomer.orderId': vustomer.items.orderId.val()
        };

        com.post(api.customer.updateVustomer, options, function(res){
            searcher.doSearch();
            com.showAlert(com.info,'绑定装修单号成功');
        });

        com.focusPage("#bindOrderModal").modal("hide");
    }

});
