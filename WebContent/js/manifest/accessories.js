/**
 * Created by Administrator on 2017/4/12.
 */

$(function () {

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */
    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);

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
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col7');

            var titleName = '辅料单号,装修单号,创建人,创建时间,审批人,审批时间,状态';

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

            var $liLine = $('<li></li>').addClass('line');

            var _label = $('<label></label>');

            var $input = $('<input>').attr({
                "type": "checkbox"
            }).css('width','0px').addClass('ace ace-checkbox-2');

            var _span = $('<span></span>').addClass('lbl grey bigger-150').css('font-weight','bold');

            _label.append($input).append(_span);

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(_label).attr({
                "value": v.aid,
                "data-type": v.status
            }));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col7');

            var propertyArr = [
                //v.gid,
                [v.no,'blue'],
                [v.orderId,'blue'],
                [v.creater.userName,'grey'],
                [v.createTime,'green'],
                [v.approver.userName,'grey'],
                [v.approverTime,'green'],
                [v.status == "0" ? "初始" : (v.status == "1" ? "出货" : (v.status == "2" ? "拒绝":(v.status == "3") ? "撤销":"退回")),'red'],
            ];


            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-info dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            var $btnCheck = $('<li></li>').append($('<a></a>').html('查看'));
            var $btnView = $('<li></li>').append($('<a></a>').html('出货'));
            var $btnEdit = $('<li></li>').append($('<a></a>').html('修改'));
            //var $btnReturn = $('<li></li>').append($('<a></a>').html('退回'));
            var $btnPrint = $('<li></li>').append($('<a></a>').html('打印'));

            v.status != 4 && ($btnUl.append($btnEdit));

            v.status == 0 && ($btnUl.append($btnView));//初始：出货，修改
            v.status == 1 && ($btnUl.append($btnCheck).append($btnView).append($btnEdit).append($btnPrint));//出货：出货 修改 退回 打印
            v.status == 4 && ($btnUl.append($btnCheck));
            $btnGroup
                .append($btn)
                .append($btnUl)
                .appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap)
                .append($contentWrap)
                .append($optionWrap);

            $btnCheck.click(function(){
                queryAccessoriesItem(v.aid, v.no);
            });

            $btnView.click(function () {
                if (v.status == 1) {
                    layer.alert('辅料已经审批,无法再次出货', {
                        icon: 0,
                        skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
                    });
                }else if(v.status == 2){
                    layer.alert('辅料已被拒绝,无法再次出货', {
                        icon: 0,
                        skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
                    });
                }else if(v.status == 3){
                    layer.alert('辅料已被撤销,无法再次出货', {
                        icon: 0,
                        skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
                    });
                }else if(v.status == 4){
                    layer.alert('辅料已被退回,无法再次出货', {
                        icon: 0,
                        skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
                    });
                }
                else {
                    viewAccessoriesItemAndOrder(v.orderId, v.aid, v.no, v.createTime, v.status);
                }
            });

            $btnEdit.click(function () {

                if (v.status == 1) {
                    layer.alert('辅料已经审批,无法修改', {
                        icon: 0,
                        skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
                    });
                }else if(v.status == 2){
                    layer.alert('辅料已被拒绝,无法再次修改', {
                        icon: 0,
                        skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
                    });
                }else if(v.status == 3){
                    layer.alert('辅料已被撤销,无法再次修改', {
                        icon: 0,
                        skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
                    });
                }else if(v.status == 4){
                    layer.alert('辅料已被退回,无法再次修改', {
                        icon: 0,
                        skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
                    });
                }
                else {
                    editAccessoriesItem(v.aid, v.no);
                }

            });

            //$btnReturn.click(function(){
            //    refundAccessories(v.orderId, v.aid, v.no, v.createTime, v.status);
            //});

            $btnPrint.click(function(){

                params["accessories.no"] = v.no;
                params["accessories.orderId"] = v.orderId;
                params["accessories.createTime"] = v.createTime;
                params["accessories.creater"] = v.creater.userName;
                params["accessories.aid"] = v.aid;
                params["accessories.manifestTime"] = v.approverTime;

                printAccessoriesItem(v.aid,v.no);

            })

            return $liLine;

        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);

            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();


    var accessoriesSeacher = new Searcher();
    var _Array = ['orderId', 'accessoriesNo', 'createrName', 'approverName', 'createTime', 'approverTime'];
    accessoriesSeacher.init(_Array, "condList", api.inventory.pageAccessories, function (data) {

        displayFunc.init('resultList', data);

    }, "pagenation", "accessoriesPostData", null, false, null, function () {
        var $adda = $('<a></a>').addClass('btn btn-success btn-minier pull-left').attr('name', 'shipment').css('margin-top', '-2px').html('批量出货');

        $adda.click(function () {
            saveOptionChange();
        });

        return [];
    }, 'resultList');

    function queryAccessoriesItem(aid, no){
        var $popup = com.focusPage('#checkPupUp');
        $popup.attr({'data-aid': aid});
        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "辅料订单" + no,
            content: $popup,
            area: [($(window).width() * 0.7 < 1000 ? $(window).width() * 0.7 : 1000) + "px", ($(window).height() * 0.84 < 620 ? $(window).height() * 0.84 : 620) + "px"],
            maxmin: false,
            zIndex: 9000,
            success: function (layer, index) {
                $popup.load("views/manifest/viewAccessories.html");
            },
            end: function () {
                $popup.attr({'data-aid': null});
                //$popup.empty();
                //accessoriesSeacher.doSearch();
            }
        });
    }

    function viewAccessoriesItemAndOrder(orderId, aid, no, createTime, status) {
        var $popup = com.focusPage('#viewPopUp');
        $popup.attr({'data-orderId': orderId, 'data-aid': aid, 'data-createTime': createTime, 'data-status': status});
        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "辅料订单" + no,
            content: $popup,
            area: ["1200px", ( $(window).height() * 0.84 < 700 ? $(window).height() * 0.84 : 700 ) + "px"],
            maxmin: false,
            zIndex: 9000,
            success: function (layer, index) {
                $popup.load("views/manifest/viewAccessoriesItem.html");
            },
            end: function () {
                $popup.attr({'data-orderId': null, 'data-aid': null, 'data-createTime': null, 'data-status': null});
                $popup.empty();
                accessoriesSeacher.doSearch();
            }
        });
    }

    function editAccessoriesItem(aid, no) {
        var $popup = com.focusPage('#editPopUp');
        $popup.attr({'data-aid': aid});
        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "修改辅料订单" + no,
            content: $popup,
            area: ["950px", ( $(window).height() * 0.84 < 600 ? $(window).height() * 0.84 : 600 ) + "px"],
            maxmin: false,
            btn: ["确定"],
            zIndex: 9000,
            success: function (layer, index) {
                $popup.load("views/manifest/editAccessoriesItem.html");
            },
            end: function () {
                $popup.attr({'data-aid': null});
                $popup.empty();
                accessoriesSeacher.doSearch();
            }
        });
    }

    function batchAccessoriesItem(createTime) {
        var $popup = com.focusPage('#shipmentPopUp');
        $popup.attr('data-createTime', createTime);
        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "批量出货",
            content: $popup,
            area: ["1200px", ( $(window).height() * 0.84 < 700 ? $(window).height() * 0.84 : 700 ) + "px"],
            maxmin: false,
            zIndex: 9000,
            success: function (layer, index) {
                $popup.load("views/manifest/batchAccessoriesItem.html");
            },
            end: function () {
                $popup.attr('data-createTime', null);
                $popup.empty();
                accessoriesSeacher.doSearch();
            }
        });
    }

    function saveOptionChange() {
        var _params = {};
        var _accessories = {};
        var flag = true;
        var $menus = $('input[type="checkbox"]:checked', '.line');
        var $aid = [];
        $.each($menus, function (i, v) {
            var $v = $(v);
            $aid.push([$v.parents("div.cell.index").attr('value'), $v.parents("div.cell.index").attr('data-type')]);
        });

        $menus.length && $menus.each(function (i) {
            if ($aid[i][1] == 0 && flag) {
                _params["aids[" + i + "]"] = $aid[i][0];
                _accessories["accessories[" + i + "].aid"] = $aid[i][0];
            } else {
                _params = {};
                _accessories ={};
                flag = false;
            }
        });

        if ($menus.length > 0 && flag == true) {
            params.aids = _params;
            params["accessories.aids"] = _accessories;
            var createTime = getNowFormatDate();
            batchAccessoriesItem(createTime);
        } else if ($menus.length == 0 && flag == true) {
            layer.msg('请选择需要出货的辅料单!', {icon: 2});
        } else if ($menus.length > 0 && flag == false) {
            layer.msg('请选择初始辅料单!', {icon: 2});
        }
    }

    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        return currentdate;
    }

    //打印货单项
    function printAccessoriesItem(aid,no){

        com.popup("辅料单号" + no, api.index.accessoriesPrintIndex.url, function () {
            parent.layer.getFrameIndex(window.name);
        }, null, true);


    }


    //function refundAccessories(orderId, aid, no, createTime, status){
    //    var $popup = com.focusPage('#refundPopUp');
    //    $popup.attr({'data-orderId': orderId, 'data-aid': aid, 'data-createTime': createTime, 'data-status': status});
    //    //弹出即全屏
    //    var index = layer.open({
    //        type: 1,
    //        skin: 'layui-layer-lan',
    //        title: "辅料订单" + no,
    //        content: $popup,
    //        area: ["1200px", ( $(window).height() * 0.84 < 700 ? $(window).height() * 0.84 : 700 ) + "px"],
    //        maxmin: false,
    //        zIndex: 9000,
    //        success: function (layer, index) {
    //            $popup.load("views/manifest/viewRefundAccessoriesItem.html");
    //        },
    //        end: function () {
    //            $popup.attr({'data-orderId': null, 'data-aid': null, 'data-createTime': null, 'data-status': null});
    //            $popup.empty();
    //            accessoriesSeacher.doSearch();
    //        }
    //    });
    //
    //}
});
