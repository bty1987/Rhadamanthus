
$(function(){

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */
    var splitAndMergePopUp = $('#splitAndMergePopUp')
    splitAndMergePopUp.attr('data-title')=="拆分"? $('#split').removeClass('hide'):$('#merge').removeClass('hide');
    var _goodsStorehouseStock = params['goodsStorehouseStock'];
    var $list = splitAndMergePopUp.attr('data-title')=="拆分"?$('#splitList'):$('#mergeList');
    var validator = {
        splitAndMerge: {
            type: "v_splitAndMerge",
            regex: /^[0-9]*[1-9][0-9]*$/,
            errorMsg: "数量填写不正确"
        }
    };

    $.extend(com.validator, validator);

    var $btnConfirm = $('<a></a>').addClass('btn btn-primary mgr-10').attr({
        'name': 'subbtn',
        'href': 'javascript:void(0);'
    }).css({'margin-left':'90%'}).text(splitAndMergePopUp.attr('data-title'));

    var $condList1 = splitAndMergePopUp.attr('data-title')=="拆分"?$('#splitAndMergePopUp').parents('.layui-layer.layui-anim.layui-layer-page.layui-layer-molv'):$('#splitAndMergePopUp').parents('.layui-layer.layui-anim.layui-layer-page.layui-layer-lan');
    var $div = $('<div class="layui-layer-btn0" style="position: relative;top:-5%;margin: -50px 10px -50px 10px;"></div>');
    $div.append($btnConfirm).appendTo($condList1);

    var displayFunc  = (function(){

        /*表格样式*/
        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);

            if(listData && listData.length){

                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');
                $tableWrap.append($ulTitle).append($ulData);

                $.each(listData,function(i, v){
                    var $liLine = creatLine(i, v, i == listData.length - 1);
                    $liLine.appendTo($ulTitle);
                });

                $('#resultListSplit').css({'width':'96%','margin':'0 auto','height':'540px','overflow-y':listData.length > 1 ? 'scroll': 'visible','marigin-top':'20px'})
                $('#resultListMerge').css({'width':'96%','margin':'0 auto','height':'540px','overflow-y':listData.length > 1 ? 'scroll': 'visible','marigin-top':'20px'})

            }
        };

        /*表格头*/
        var createTableTitle = function(){

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col9');

            var titleName = '商品名称,商品编号,条形码,颜色,规格,单位,数量,所在仓库,库存数量';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            //var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap)
                .append($contentWrap)
                .appendTo($ulTitle);
                //.append($optionWrap)


            return $ulTitle;
        };

        /*表格体*/
        var creatLine = function (i, v, lastFlag) {

            var storehouseNum=null;
            com.post(api.inventory.queryGoodsStorehouseStockByShIdAGId,{
                "goodsStorehouseStock.goods.gid": v.goods.gid,
                "goodsStorehouseStock.color.cid": v.color.cid,
                "goodsStorehouseStock.format.fid": v.format.fid,
                "goodsStorehouseStock.storehouse.shId": _goodsStorehouseStock.storehouse.shId
            },function(res){
                storehouseNum = res.goodsStorehouseStock.num == null?'仓库暂无此商品':res.goodsStorehouseStock.num;
            },null,false)

            var $liLine = $('<li></li>').addClass('line');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col9');

            var propertyArr = [
                [v.goods.name,'grey'],
                [v.goods.no,'blue'],
                [v.goods.barcode,'blue'],
                [v.color.name,'grey'],
                [v.format.info,'grey'],
                [v.goods.measurementUnit,'grey'],
                [v.num,'blue'],
                [_goodsStorehouseStock.storehouse.name,'grey'],
                [storehouseNum,'blue']
            ];


            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $btnGroup = $('<div></div>').addClass('btn-group');
            //var $btn = $('<button></button>').addClass('btn blue dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            $btnGroup.append($btnUl);
                //.append($btn)



            $liLine.append($indexWrap)
                .append($contentWrap);


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
    /*分页*/

    function doSearcher(){
        com.post(api.inventory.queryPackage,{
            "goodsPackage.pid": _goodsStorehouseStock.goods.gid
        },function(res){
            displayFunc.init(splitAndMergePopUp.attr('data-title')=="拆分"?'resultListSplit':'resultListMerge',res.goodsPackages)
        })
    }
    doSearcher();

    /*状态信息验证*/

    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col12');
        var _lineInfoSet = [
            {cellClass : "name grey" ,value:_goodsStorehouseStock.goods.name},
            {cellClass : "no blue" ,value:_goodsStorehouseStock.goods.no},
            {cellClass : "barcode blue",value:_goodsStorehouseStock.goods.barcode},
            {cellClass : "category grey",value:_goodsStorehouseStock.goods.category},
            {cellClass : "brand grey",value:_goodsStorehouseStock.goods.brand},
            {cellClass : "color grey",value:_goodsStorehouseStock.color.name},
            {cellClass : "format grey",value:_goodsStorehouseStock.format.info},
            {cellClass : "measurementUnit grey",value:_goodsStorehouseStock.goods.measurementUnit},
            {cellClass : "pieceNum blue",value:_goodsStorehouseStock.goods.pieceNum},
            {cellClass : "number blue",value:_goodsStorehouseStock.num},
            {cellClass : "storehouse grey",value:_goodsStorehouseStock.storehouse.name},
            {cellClass : "inputNum",hasInput:!0},
        ];

        $.each(_lineInfoSet, function (i, v) {
            var $input;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass).text(v.value);
            if (v.hasInput) {
                $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).attr('data-toggle','popover').attr('data-placement','bottom').addClass('editable v_required v_splitAndMerge');
                $cell.append($input);
            }

            $cell.appendTo($lineInfoWrap);

        });


        $line.append($indexWrap).append($lineInfoWrap);


        return $line;

    }
    addline(1).addClass('current').appendTo($list);

    function checkRowValue($line,packageName){

        var flag = true;

        var _inputNum = $line.find('.inputNum input');
        var _num = $line.find('.number').text();
        var inputRex = /^\d+$/;

        if(packageName == "合并"){
            if(!( _inputNum.val()>0 && inputRex.test(_inputNum.val()))){

                _inputNum.focus().select();

                _inputNum.addClass('popover-notitle').attr({
                    "data-rel" : "popover",
                    "data-placement" : "top",
                    "data-original-title" : "",
                    "title" : "",
                    "data-content" : "数量填写不正确"

                }).popover('show');

                flag =  false;
            }else{
                _inputNum.popover('destroy');
            }
        }else{
            if(!( _inputNum.val()>0 && inputRex.test(_inputNum.val()) && parseInt(_inputNum.val())<=parseInt(_num))){

                _inputNum.focus().select();

                _inputNum.addClass('popover-notitle').attr({
                    "data-rel" : "popover",
                    "data-placement" : "top",
                    "data-original-title" : "",
                    "title" : "",
                    "data-content" : "数量填写不正确"

                }).popover('show');

                flag =  false;
            }else{
                _inputNum.popover('destroy');
            }
        }



        return flag;
    }


    $('.layui-layer-content').css('overflow','hidden');

    $btnConfirm.click(function(e){
        e.stopPropagation();
        if(com.validate('splitList','bottom') || com.validate('mergeList','bottom')){
            return;
        }

        //if(checkRowValue($list,$btnConfirm.text())){

            var gid = _goodsStorehouseStock.goods.gid;
            var cid =_goodsStorehouseStock.color.cid;
            var fid =_goodsStorehouseStock.format.fid;
            var shId =_goodsStorehouseStock.storehouse.shId;

            if($btnConfirm.text()=="拆分"){
                var num =$('#splitList').find('.inputNum input').val();
                com.post(api.inventory.splitPackage,{
                    "goodsStorehouseStock.goods.gid": gid,
                    "goodsStorehouseStock.color.cid": cid,
                    "goodsStorehouseStock.format.fid": fid,
                    "goodsStorehouseStock.storehouse.shId": shId,
                    "goodsStorehouseStock.num": num
                },function(res){
                    layer.closeAll();
                    layer.msg('拆分成功')
                })
            }else{
                var num =$('#mergeList').find('.inputNum input').val();
                com.post(api.inventory.mergePackage,{
                    "goodsStorehouseStock.goods.gid": gid,
                    "goodsStorehouseStock.color.cid": cid,
                    "goodsStorehouseStock.format.fid": fid,
                    "goodsStorehouseStock.storehouse.shId": shId,
                    "goodsStorehouseStock.num": num
                },function(res){
                    layer.closeAll();
                    layer.msg('合并成功')
                })
            }
        //}
    })

});
