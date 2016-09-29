$(function(){

    var materialOrderPostBalance = {
        vsaveBtn: $("#vsaveBtn").on("click", updateMaterialSubOrderBalanceForVBalance),
        saveBtn: $("#saveBtn").on("click", updateMaterialSubOrderBalanceForBalance),
        smodal : $('#smodal')
            .on("show.bs.modal", function(a) {
                com.clearValidator();
                $('#vbalance').val(null);
            })
            .on("hide.bs.modal", function(a) {
                materialOrderPostBalance.msobId = null;
                $('#balance').val(null);

            }),
        modal : $('#modal')
            .on("show.bs.modal", function(a) {
                com.clearValidator();
            })
            .on("hide.bs.modal", function(a) {
                materialOrderPostBalance.msobId = null;
            }),
    };

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     **/
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.materialSubOrder.msoNo   ));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnSupBalance = $('<a></a>').addClass('btn btn-minier btn-warning').html('厂商结算值');
            var $btnBalance = $('<a></a>').addClass('btn btn-minier btn-primary').html('结算值');
            var $btnSupPost = $('<a></a>').addClass('btn btn-minier btn-purple').html('厂商结算');
            var $btnPost = $('<a></a>').addClass('btn btn-minier btn-danger').html('结算');

            var propertyArr = [
                ["创建人:", v.creater.currentName , "grey"],
                ["主材驻店:", v.instorer.currentName ?  v.instorer.currentName : '---' , "grey"],
                ["结算人  :", v.poster.currentName ? v.poster.currentName : '---' , "grey"],
                ["预结算时间 :", v.balanceTime , "grey"],
                ["结算值 :", v.balance , "grey"],
                ["差值 :", v.difference , "grey"],
                ["厂商结算:", v.vbalance , "grey"],
                ["厂商结算时间:", v.vbalanceTime , "grey"],
                ["状态:", v.status == 0 ? '预结算': v.status== 1 ? '厂商结算' : v.status== 2 ? '结算' : '---' , "blue"],
                ["类型:", v.type == 0 ? '购货' : v.type == 1 ? '退货' : '---' , "blue"],
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap
                .append($btnSupBalance)
                .append($btnBalance)
                .append($btnSupPost)
                .append($btnPost)
                .appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnSupBalance.click(function(){
                materialOrderPostBalance.msobId = v.msobId;
                materialOrderPostBalance.smodal.modal("show");
            });

            $btnBalance.click(function(){
                materialOrderPostBalance.msobId = v.msobId;
                materialOrderPostBalance.modal.modal("show");
            });

            $btnSupPost.click(function(){
                vpostMaterialSubOrderBalance(v.msobId);
            });

            $btnPost.click(function(){
                postMaterialSubOrderBalance(v.msobId);
            });

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

    var _condArr = [];

    var searcher = new Searcher();

    searcher.init( _condArr, "condList", api.material.pageMaterialSubOrderBalance, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "materialOrderPostBalancePostData", null, false, null, null);

    //厂商结算值
    function updateMaterialSubOrderBalanceForVBalance(){
        if (!com.validate('smodal')) {
            var _params = {
                "materialSubOrderBalance.msobId": materialOrderPostBalance.msobId,
                "materialSubOrderBalance.vbalance": $('#vbalance').val()
            };
            com.post(api.material.updateMaterialSubOrderBalanceForVBalance, _params, function(a) {
                searcher.doSearch();
                materialOrderPostBalance.smodal.modal("hide");
            });
        }
    }

    //结算值
    function updateMaterialSubOrderBalanceForBalance(){

        if (!com.validate('modal')) {
            var _params = {
                "materialSubOrderBalance.msobId": materialOrderPostBalance.msobId,
                "materialSubOrderBalance.balance": $('#balance').val()
            };
            com.post(api.material.updateMaterialSubOrderBalanceForVBalance, _params, function(a) {
                searcher.doSearch();
                materialOrderPostBalance.modal.modal("hide");
            });
        }
    }
    
    //厂商结算
    function  vpostMaterialSubOrderBalance(id){

        var _params = {
            "materialSubOrderBalance.msobId": id
        };

        com.post(api.material.updateMaterialSubOrderBalanceForVBalance, _params, function(a) {
            com.showInfo('提示','厂商结算成功');
            searcher.doSearch();
        });
    }

    //结算
    function  postMaterialSubOrderBalance(id){

        var _params = {
            "materialSubOrderBalance.msobId": id
        };

        com.post(api.material.updateMaterialSubOrderBalanceForVBalance, _params, function(a) {
            com.showInfo('提示','结算成功');
            searcher.doSearch();
        });
    }

});
