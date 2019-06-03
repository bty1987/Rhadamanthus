$(function(){

    var group = {
        bindSaveBtn: null,
        bindSaveOrderBtn: null,
        items: {},
        gid: null,
        opengid: null,
    };

    group.items.name = com.focusPage("#name");
    group.items.content = com.focusPage("#content");
    group.items.orderId = com.focusPage("#orderId");

    group.bindSaveBtn = com.focusPage("#bindSaveBtn").on('click', bindgroup);
    group.bindSaveBtn = com.focusPage("#bindSaveOrderBtn").on('click',bindgroupOrder);

    var displayFunc = (function () {

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            if(listData && listData.length){
                $.each(listData,function(i, v){
                    creatLine(v).appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var creatLine=function(v){
            var $liLine=$('<li></li>').addClass('item-orange clearfix ');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnView= $("<a></a>").addClass("btn btn-minier btn-yellow").html("编辑");
            var $btnbind = $("<a></a>").addClass("btn btn-minier btn-success").html("绑定");
            var $btnAddUser= $("<a></a>").addClass("btn btn-minier btn-success").html("群成员");
            var $btnunbind= $("<a></a>").addClass("btn btn-minier btn-warning").html("解绑");

            var propertyArr = [
                ["群编号: ", v.opengid, "grey"],
                ["装修单号: ", v.orderId, "grey"],
                ["说明: ", v.content, "grey"],
            ]

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $btnView.click(function(){
                group.gid = v.gid;
                params.gid = v.gid;

                com.focusPage("#name").val(v.name);
                com.focusPage("#content").val(v.content);

                com.focusPage("#updateOrderModal").modal("show");

            })

            $btnbind.click(function(){
                group.gid = v.gid;
                group.opengid = v.opengid;
                params.gid = v.gid;
                params.opengid = v.opengid;

                com.focusPage("#bindOrderModal").modal("show");
            });

            $btnunbind.click(function(){
                bindGrop(v.gid);
            });

            $btnAddUser.click(function(){
                params.gorderId = v.orderId;
                com.switchPage('views/customer/crowdUser.html');
            });

            if(v.orderId == null){
                $divBtnWrap.append($btnView).append($btnbind).appendTo($h3);
            }else{
                $divBtnWrap.append($btnView).append($btnAddUser).append($btnunbind).appendTo($h3);
            }

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
    searcher.init(['groupName', 'groupOrderId'], "condList" , api.customer.pageGroup, function(res){
        displayFunc.init("resultList",res);
    },"pagenation");

    function bindgroup (){
        
        if(com.validate()){
            return false;
        }

       var option = {
            "group.gid": group.gid,
            "group.name": group.items.name.val(),
            "group.content": group.items.content.val(),
        };

        com.post(api.customer.updateGroup, option, function(){
            searcher.doSearch();
            com.showAlert(com.info,'修改群信息成功');
            com.focusPage("#updateOrderModal").modal("hide");
        });
    }

    function bindgroupOrder(){

        if(com.validate()){
            return false;
        }

        var option = {
            "group.opengid": group.opengid,
            "group.orderId": group.items.orderId.val(),
        };

        com.post(api.customer.bindGroup, option, function(){
            searcher.doSearch();
            group.items.orderId.val("");
            com.showAlert(com.info,'绑定成功');
            com.focusPage("#bindOrderModal").modal("hide");
        });
    }

    function  bindGrop(id){
        com.showConfirm("确定要解除绑定", function(){
            com.post(api.customer.unbindGroup, {"group.gid": id}, function (res) {
                searcher.doSearch();
                com.showAlert(com.info,'解除成功');
            });
        });
    }

})();