
$(function(){


    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */

    var flagSiid = true;

    var displayFunc  = (function(){

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
            }
        };


            var createTableTitle = function(){

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col9');

            var titleName = '采购单编号,创建人,创建时间,结算时间,交期时间,入库状态,结算状态,说明';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap)
                .append($contentWrap)
                .append($optionWrap)
                .appendTo($ulTitle);

            return $ulTitle;
        };

        var creatLine = function(i, v, lastFlag){

            var $liLine = $('<li></li>').addClass('line');

            var _label = $('<label></label>');

            var $input = $('<input>').attr({
                "type": "checkbox",
            }).css('width','0px').addClass('ace ace-checkbox-2');

            var _span = $('<span></span>').addClass('lbl grey bigger-150').css('font-weight','bold');

            _label.append($input).append(_span)

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(_label).attr({
                "value" : v.pid
                ,"data-type" : v.status
            }));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col9');

            var propertyArr = [
                v.no,
                v.user.userName,
                v.createTime,
                v.balanceTime,
                v.deliveryTime,
                v.status == "0" ? "初始" :  (v.status == "1"? "部分入库" : "全部入库") ,
                v.balanceStatus == "0" ? "初始" :  "已结算",
                v.comment,
            ];


            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-info dropdown-toggle').attr('data-toggle','dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');


            var $btnView = $('<li></li>').append($('<a></a>').html('查看')) ;
            var $btnEdit = $('<li></li>').append($('<a></a>').html('修改')) ;
            var $btnWarehousing = $('<li></li>').append($('<a></a>').html('入库')) ;


            $btnUl
                .append($btnView)
                .append($btnEdit)
                .append($btnWarehousing);

            $btnGroup
                .append($btn)
                .append($btnUl)
                .appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap)
                .append($contentWrap)
                .append($optionWrap);

            $btnView.click(function(){
                viewGoods(v.pid,v.no);
            });

            $btnEdit.click(function(){
            	
            	com.post(api.inventory.queryPurchaseItemByPid,{
                    "purchase.pid": v.pid
                },function(res){
                    $.each(res.purchaseItems,function(i,v){
                        if(v.siid == 0){
                            flagSiid = true;
                        }else{
                            flagSiid = false;
                        }

                    });
                },null,false);

                
                if(v.status!=0){
                    layer.msg("当前订单已部分入库不允许修改！",{time:3000});
                }else if(flagSiid==false){
                    layer.msg("当前订单已绑定销售单,不可修改！",{time:3000});
                }else if (v.status==0 && flagSiid==true){

                    editPurchase(v.pid,v.no);
                }

            });

            $btnWarehousing.click(function(){
                warehousingPurchase(v.pid,v.no, v.type);
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
        };
    })();


    var goodsSeacher = new Searcher();

    goodsSeacher.init( ["purchaseUserName","purchaseNo","purchaseTime"], "condList", api.inventory.pagePurchase, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "purchasePostData", null, false, null, function(){

        var $batchs = $('<a></a>').addClass('btn btn-minier btn-info').attr('name', 'addBatch').css('margin-top','-2px').html('批量入库');

        var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
        var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
        var $impspan = $('<span></span>').text('导出').appendTo($impa);

        //导出点击事件
        $impa.click(function(){
            pagePurchaseImport();
        });

        //批量入库点击事件
        $batchs.click(function(){
            ItemsClick();
        });

        return [$batchs,$impa];
    },'resultList');

    //查看采购单
    function viewGoods(pid,no){
        var $popup = $('#viewPopUp');
        $popup.attr({'data-pid': pid});
        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title:"查看__采购单编号：" + no,
            content: $popup,
            area: [( $(window).width()*0.7 < 1000 ?  $(window).width()*0.7 : 1000 )+"px",( $(window).height()*0.84 < 620 ?  $(window).height()*0.84 : 620 )+"px"],
            maxmin: true,
            zIndex:9000,
            btn: ['导出','取消'],
            btn1:function(){
                queryPurchaseItemByPidImport(pid);
            },
            success: function(layer, index){
                $popup.load("views/manifest/viewPurchase.html");
            },
            end:function(){
                $popup.attr('data-pid', null);
                $popup.empty();
                goodsSeacher.doSearch();
            }
        });
    }

    //编辑采购单
    function editPurchase(pid, no, type){

        var $popup = $('#editPopUp');
        $popup.attr({'data-pid': pid});
        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title:"修改__采购单编号：" + no,
            content: $popup,
            area: [( $(window).width()*0.7 < 1000 ?  $(window).width()*0.7 : 1000 )+"px",( $(window).height()*0.84 < 620 ?  $(window).height()*0.84 : 620 )+"px"],
            maxmin: true,
            zIndex:9000,
            success: function(layer, index){
                $popup.load("views/manifest/editPurchase.html");
            },
            end:function(){
                $popup.attr({'data-pid': null, 'data-type': null});
                $popup.empty();
                goodsSeacher.doSearch();
            }
        });
    };

    //采购单单条入库
    function warehousingPurchase(pid, no, type){

        var $popup = $('#warehousingPopUp');
        $popup.attr({'data-pid': pid, 'data-type': type});
        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title:"入库__采购单编号：" + no,
            content: $popup,
            area: [( $(window).width()*0.7 < 1000 ?  $(window).width()*0.7 : 1000 )+"px",( $(window).height()*0.84 < 620 ?  $(window).height()*0.84 : 620 )+"px"],
            maxmin: true,
            zIndex:9000,
            success: function(layer, index){
                $popup.load("views/manifest/warehousingPurchase.html");
            },
            end:function(){
                $popup.attr({'data-pid': null, 'data-type': null});
                $popup.empty();
                goodsSeacher.doSearch();
            }
        });
    };

    //采购单批量入库
    function viewPurchaseItems(type){
        var $popup = $('#viewPurchaseItemsPopUp');
        $popup.attr({'data-type': type});
        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title:"采购单批量入库",
            content: $popup,
            area: [( $(window).width()*0.7 < 1000 ?  $(window).width()*0.87 : 1200 )+"px",( $(window).height()*0.84 < 620 ?  $(window).height()*0.84 : 620 )+"px"],
            maxmin: true,
            zIndex:9000,
            success: function(layer, index){
                $popup.load("views/manifest/viewPurchaseItems.html");
            },
            end:function(){
                $popup.attr({'data-pid': null, 'data-type': null});
                $popup.empty();
                goodsSeacher.doSearch();
            }
        });
    };

    //批量入库校验
    function ItemsClick(){
        var _params = {};
        var flag = true;
        var $menus = $('input[type="checkbox"]:checked','#resultList');
        var $pids = [];
        $.each($menus,function(i,v){
            var $v = $(v);
            $pids.push([$v.parents("div.cell.index").attr('value'), $v.parents("div.cell.index").attr('data-type')]);
        });

        $menus.length && $menus.each(function (i) {
        	
            if($pids[i][1]==0 && flag){
            	
                _params["pids[" + i + "]"] = $pids[i][0];
                
            }else{
            	
            	_params["pids[" + i + "]"] = $pids[i][0];
                flag = false;
            }
        });
        
        if(_params["pids[0]"]){
        	
        	 com.post(api.inventory.queryPurchaseItemByPids,_params,function(res){
                 $.each(res.purchaseItems,function(i,v){
                     if(v.siid == 0){
                         flagSiid = true;
                     }else{
                         flagSiid = false;
                     }
                 });
             });
        	 
        }
       
        if($menus.length>0 && flag == true && flagSiid ==true){
            params.pids = _params;
            viewPurchaseItems(6);
        }else if($menus.length==0 && flag == true){
            layer.msg('请选择需要入库的采购单!', {time:2e3});
        }else if($menus.length>0 && flag == false){
            layer.msg('请选择入库状态为：初始的采购单!', {time:2e3});
        }else if(flagSiid==false){
            layer.msg('当前订单已绑定销售单,不可修改!', {time:2e3});
        }
    }

    //导出excel
    function pagePurchaseImport(){
        if ($('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if ($('span[name="totalRecords"]').text() > 1000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.inventory.pagePurchase, $.extend({}, params.purchasePostData, {"paging.noPage": 1}), function (res) {

            $.each(res.paging.data,function(i,v){
                v.balanceStatus = (v.balanceStatus == "0" ? "初始" : "已结算");
                v.status = (v.status == "0" ? "初始" :  (v.status == "1"? "部分入库" : "全部入库") );
            });

            $.exceler({
                column: [
                    ['采购单编号', 'no'],
                    ['创建人', 'user.userName'],
                    ['创建时间', 'createTime'],
                    ['结算时间', 'balanceTime'],
                    ['交期时间', 'deliveryTime'],
                    ['入库状态', 'status'],
                    ['结算状态', 'balanceStatus'],
                    ['说明', 'comment'],
                ],
                list: res.paging.data,
            });

        });
    };

    //导出单条明细
    function queryPurchaseItemByPidImport(pid){
            com.post(api.inventory.queryPurchaseItemByPid,{"purchase.pid": pid}, function (res) {

                $.exceler({
                    column: [
                        ['商品编号', 'goods.gid'],
                        ['商品型号', 'goods.no'],
                        ['商品名称', 'goods.name'],
                        ['商品类别', 'goods.category'],
                        ['品牌', 'goods.brand'],
                        ['单位', 'goods.measurementUnit'],
                        ['颜色', 'color.name'],
                        ['规格', 'format.info'],
                        ['采购单价', 'unitPrice'],
                        ['数量', 'num'],
                        ['件数', 'goods.pieceNum'],
                        ['剩余数量', 'surplus'],
                    ],
                    list: res.purchaseItems,
                });

            });
        };


});


