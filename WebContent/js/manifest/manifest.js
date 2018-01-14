$(function () {

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = $('#' + tableId);

            if (listData && listData.length) {

                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');
                $tableWrap.append($ulTitle).append($ulData);

                $.each(listData, function (i, v) {
                    var $liLine = creatLine(i, v, i == listData.length - 1);

                    $liLine.appendTo($ulTitle);
                });
            }
        };


        var createTableTitle = function () {

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col8');

            var titleName = "编号,创建时间,创建人,货单时间,总金额,状态,备注,类型";

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

        var creatLine = function (i, v, lastFlag) {


            var typeList = [
                '进货',//1
                '进退',//2
                '出货',//3
                '出返',//4
                '调拨',//5
                '采购',//6
                '辅料',//7
                '套合',//8
                '套拆',//9
            ];


            var $liLine = $('<li></li>').addClass('line');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap content col8');


            var propertyArr = [
                v.code,
                v.createTime,
                v.createUser.currentName ? v.createUser.currentName : '---',
                v.manifestTime,
                v.total,
                v.status == "0" ? "初始" : "已确认",
                v.comment == null ? "":v.comment,
                typeList[parseInt(v.type) - 1] ? typeList[parseInt(v.type) - 1] : '---',
            ];


            $.each(propertyArr, function (index, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-info dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');


            var $btnView = $('<li></li>').append($('<a></a>').html('查看'));
            //var $btnEdit = $('<li></li>').append($('<a></a>').html('修改'));
            var $btnConfirm = $('<li></li>').append($('<a></a>').html('确认'));
            var $btnAAR = $('<li></li>').append($('<a></a>').html('进退'));
            var $btnRO = $('<li></li>').append($('<a></a>').html('出返'));
            //var $btnCA = $('<li></li>').append($('<a></a>').html('冲销'));
            var $btnImport = $('<li></li>').append($('<a></a>').html('导出'));
            var $btnPrint = $('<li></li>').append($('<a></a>').html('打印'));


            $btnUl
                .append($btnView)
                //.append($btnEdit)
                .append($btnConfirm)
                .append($btnImport)
                .append($btnPrint);
            if (v.type == 1) {
                $btnUl.append($btnAAR);
            } else if (v.type == 3) {
                $btnUl.append($btnRO);
            }
            //else if (v.type == 6) {
                //$btnUl.append($btnCA);
            //}


            $btnGroup
                .append($btn)
                .append($btnUl)
                .appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap)
                .append($contentWrap)
                .append($optionWrap);

            //查看货单
            $btnView.click(function () {
                viewManifest(v.mid, v.code);
            });

            //修改货单
          /*  $btnEdit.click(function () {
                if (v.status == 0) {
                    editManifest(v.mid, v.code, v.type, v.status);
                } else {
                    layer.msg('订单已确认,无法修改', {icon: 2})
                }

            });*/

            //确认货单
            $btnConfirm.click(function(){
                if(v.status == 0){
                    confirmManifest(v.mid);
                }else{
                    layer.msg('无法重复确认订单',{icon:2});
                }
            });


            //货单退货
            $btnAAR.click(function(){
                if(v.status == 1){
                    advanceRetreatManifest(v.mid, v.status);
                }else{
                    layer.msg('订单没有确认,无法退货',{icon:2});
                }
            });

            //货单出返
            $btnRO.click(function(){
                if(v.status == 1){
                    sendReturnManifest(v.mid, v.status);
                }else{
                    layer.msg('订单没有确认,无法出返',{icon:2});
                }
            });

            $btnImport.click(function(){
                queryManifestItemByMid(v.mid);
            });


            //打印按钮
            $btnPrint.click(function () {

                params["code"] = v.code;
                params["createTime"] = v.createTime;
                params["createUser.userName"] = v.createUser.userName;
                params["manifestTime"] = v.manifestTime;
                params["mid"] = v.mid;
                params["status"] = v.status;
                params["total"] = v.total;
                params["type"] = v.type;

                printManifest(v.mid,v.code);
            });

            return $liLine;

        };

        return {
            init: function (tableId, listData) {
                $('#' + tableId).html(null);
                renderList(tableId, listData);

            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();


    var _condArr = ["manifestCode", "manifestTime"];

    var seacher = new Searcher();

    seacher.init(_condArr, "condList", api.inventory.pageManifest, function (data) {

        displayFunc.init('resultList', data);

    }, "pagenation", "manifestPostData", null, false, null, null, 'resultList');


    function viewManifest(mid, code) {
        var $popup = $('#viewPopUp');
        $popup.attr({'data-mid': mid});
        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-molv',
            title: "查看货单" + code,
            content: $popup,
            area: [( $(window).width() * 0.7 < 1000 ? $(window).width() * 0.7 : 1000 ) + "px", ( $(window).height() * 0.84 < 620 ? $(window).height() * 0.84 : 620 ) + "px"],
            maxmin: false,
            zIndex: 9000,
            btn: ['取消'],
            success: function (layer, index) {
                $popup.load("views/manifest/viewManifest.html");
            },
            end: function () {
                $popup.attr('data-mid', null);
            }
        });
    }

    function editManifest(mid, code, type, status) {

        var $popup = $('#editPopUp');
        $popup.attr({'data-mid': mid, 'data-type': type, 'data-status': status});
        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "修改货单" + code,
            content: $popup,
            area: [( $(window).width() * 0.7 < 1000 ? $(window).width() * 0.7 : 1000 ) + "px", ( $(window).height() * 0.84 < 620 ? $(window).height() * 0.84 : 620 ) + "px"],
            maxmin: false,
            zIndex: 9000,
            btn: ['确定'],
            success: function (layer, index) {
                $popup.load("views/manifest/editManifest.html");
            },
            end: function () {
                $popup.attr('data-mid', null);
                $popup.empty();
                seacher.doSearch();
            }
        });
    };

    function confirmManifest(mid){
        layer.confirm('是否确认订单？', {
            btn: ['确定', '取消'] //按钮
        }, function (indexo, layero) {
            com.post(api.inventory.confirmManifest,{
                "manifest.mid":mid
            },function(res){
                layer.msg('订单确认成功',{icon:1});
                seacher.doSearch();
            },function(){
                layer.msg('订单确认失败',{icon:2});
            });
        }, function () {

        });

    }

    function advanceRetreatManifest(mid,status){
        var $popup = $('#AARPopUp');
        $popup.attr({'data-mid': mid,'data-status': status});
        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "退货",
            content: $popup,
            area: ["1200px", ( $(window).height() * 0.84 < 700 ? $(window).height() * 0.84 : 700 ) + "px"],
            maxmin: false,
            zIndex: 9000,
            success: function (layer, index) {
                $popup.load("views/manifest/advanceRetreatManifest.html");
            },
            end: function () {
                $popup.attr({'data-mid': null,'data-status':null});
                $popup.empty();
                seacher.doSearch();
            }
        });
    }

    function sendReturnManifest(mid,status){
        var $popup = $('#ROPopUp');
        $popup.attr({'data-mid': mid,'data-status': status});
        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "进退",
            content: $popup,
            area: ["1200px", ( $(window).height() * 0.84 < 700 ? $(window).height() * 0.84 : 700 ) + "px"],
            maxmin: false,
            zIndex: 9000,
            success: function (layer, index) {
                $popup.load("views/manifest/sendReturnManifest.html");
            },
            end: function () {
                $popup.attr({'data-mid': null,'data-status':null});
                $popup.empty();
                seacher.doSearch();
            }
        });
    }

    //导出货单项事件
    function queryManifestItemByMid(mid){
        com.post(api.inventory.queryManifestItemByMId, {"manifest.mid": mid}, function(res){

            $.exceler({
                column: [
                    ['商品编号','goods.no'],
                    ['商品名','goods.name'],
                    ['单位','goods.measurementUnit'],
                    ['颜色','color.name'],
                    ['规格','format.info'],
                    ['进货仓库','instorehouse.name'],
                    ['出货仓库','outstorehouse.name'],
                    ['数量','num'],
                    ['件数','goods.pieceNum'],
                    ['采购价','unitPrice'],
                    ['备注','comment']
                ],
                list: res.manifestItems
            }, function(v){
                v.instorehouse.name = v.instorehouse.name == null ? "---" : v.instorehouse.name;
                v.outstorehouse.name = v.outstorehouse.name == null ? "---" : v.outstorehouse.name;
            })

        })

    }

    //打印货单项
    function printManifest(mid,code){
        params.manifestMid = mid;

        com.popup("货单编号" + code, api.index.manifestPrintIndex.url, function () {
            parent.layer.getFrameIndex(window.name);
        }, null, true);


    }

});

