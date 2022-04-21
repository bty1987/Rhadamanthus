$(function(){

    var vustomer = {

        bindSaveBtn: com.focusPage("#bindSaveBtn"),
        vustomerSaveBtn: com.focusPage('#vustomerSaveBtn'),

        modals:{
            bindOrderModal: com.focusPage("#bindOrderModal"),
            belongerModal: com.focusPage("#belongerModal")
        },
        items:{
            belonger: com.focusPage("#belonger"),
            orderId: com.focusPage("#orderId"),
        },

        vid:null
    }

    vustomer.bindSaveBtn.bindClick(bindOrderData);
    vustomer.vustomerSaveBtn.bindClick(changeBelonger);

    com.focusPage(".modal").on("hide.bs.modal", function () {
        com.clearValidator();
        com.cleanTypeahead("belonger");
        com.cleanItems(vustomer.items);
    });


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
                    vustomer.items.orderId.val(v.orderId);
                    vustomer.items.orderId.attr('readonly',"readonly");
                }else{
                    vustomer.items.orderId.removeAttr('readonly');
                }

                vustomer.modals.bindOrderModal.modal("show");

                com.clearValidator();

            });

            $btnRecord.click(function(){
                params.customer.vid = v.vid;
                com.popup4page("#vscoreRecordPopUp", api.index.vrecord.url, "记录");
            });

            $btnDel.click(function(){
                params.customer.unionId = v.unionId;
                params.customer.id = 1;
                com.popup4page("#vscoreRecordPopUp", api.index.vscoreRecord.url, "积分");
            });

            $edit.click(function(){
                vustomer.vid = v.vid;
                vustomer.modals.belongerModal.modal("show");
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

    searcher.init(["customer-v-name"], "condList", api.customer.pageVustomerForAdvance, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "vustomerPostData",null, false, null, null);

    function changeBelonger(){
        if(com.validate('belongerModal')){
            return false;
        }

        var option={
            "vustomer.vid": vustomer.vid,
            "vustomer.belonger.uid":com.typeahead("belonger")
        };
        com.post(api.customer.updateVustomerForBelonger,option,function(){
            searcher.doSearch();
            com.showAlert(com.info,'修改成功');
        });
        vustomer.modals.belongerModal.modal("hide");
    }

    function bindOrderData(){
        if(com.validate('bindOrderModal')){
            return false;
        }

        var options = {
            'vustomer.vid': vustomer.vid,
            'vustomer.orderId': vustomer.items.orderId.val()
        };

        com.post(api.customer.updateVustomer, options, function(res){
            searcher.doSearch();
            com.showAlert(com.info,'绑定装修单号成功');
        });
        vustomer.modals.bindOrderModal.modal("hide");
    }

});
