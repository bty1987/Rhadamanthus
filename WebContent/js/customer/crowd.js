$(function(){

    var group = {
        bindSaveBtn: com.focusPage("#bindSaveBtn"),
        bindSaveOrderBtn: com.focusPage("#bindSaveOrderBtn"),
        modals:{
            updateOrderModal: com.focusPage("#updateOrderModal"),
            bindOrderModal: com.focusPage("#bindOrderModal")
        },
        items: {
            name: com.focusPage("#name"),
            content: com.focusPage("#content"),
            orderId: com.focusPage("#orderId")
        },
        gid: null,
        opengid: null
    };

    group.bindSaveBtn.bindClick(bindgroup);
    group.bindSaveOrderBtn.bindClick(bindgroupOrder);

    com.focusPage(".modal").on("hide.bs.modal",function () {
        com.cleanItems(group.items);
        com.clearValidator();
    });

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
                ["说明: ", v.content, "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $btnView.click(function(){
                group.gid = v.gid;

                group.items.name.val(v.name);
                group.items.content.val(v.content);

                group.modals.updateOrderModal.modal("show");

            });

            $btnbind.click(function(){
                group.gid = v.gid;
                group.opengid = v.opengid;

                group.modals.bindOrderModal.modal("show");
            });

            $btnunbind.click(function(){
                bindGrop(v.gid);
            });

            $btnAddUser.click(function(){
                params.customer.orderId = v.orderId;
                com.popup4page('#crowdUserPopUp', api.index.crowdUser.url, '群成员')
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
    searcher.init(['customer-group-name', 'customer-group-orderId'], "condList" , api.customer.pageGroup, function(res){
        displayFunc.init("resultList",res);
    },"pagenation");

    function bindgroup (){
        
        if(com.validate('form')){
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
            group.modals.updateOrderModal.modal("hide");
        });
    }

    function bindgroupOrder(){

        if(com.validate('orderIdCheck')){
            return false;
        }

        var option = {
            "group.opengid": group.opengid,
            "group.orderId": group.items.orderId.val(),
        };

        com.post(api.customer.bindGroup, option, function(){
            searcher.doSearch();
            com.showAlert(com.info,'绑定成功');
            group.modals.bindOrderModal.modal("hide");
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