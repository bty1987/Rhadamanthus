$(function () {

    var $hid = params.hid;
    var $hardwareStatus = params.hardwareStatus;
    var $productionStatus = params.productionStatus;

    var displayFunc = (function () {

        var renderList = function(tableId,listData){

            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable fl-table-list');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {

                    var $liLine = $('<li></li>').addClass('clearfix item-blue');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').css({color: "grey", "font-weight": "bold"}).html(' ' + v.name);
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                    var $btnDelete = $('<a></a>').addClass('btn btn-minier').html('删除');

                    var total = utils.accMul(v.unitprice,v.num);

                    var propertyArr = [
                        ["数量:", v.num, "grey"],
                        ["单位:", v.measurementunit,"grey"],
                        ["单价:", v.unitprice,"grey"],
                        ["总价:",total,"grey"],
                        ["说明:", v.comment,"grey"]
                    ];

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).css({color: value[2]}).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);
                    $btnDiv.append($btnDelete).appendTo($h3);

                    hidBtn($btnDelete,$hardwareStatus)

                    //删除按钮
                    $btnDelete.click(function (e) {
                        e.stopPropagation();
                        layer.confirm('确定要删除吗？', {
                            btn: ['确定', '取消']
                        }, function (index, layero) {
                            com.post(api.production.deleteHardwareItem, {"hardwareItem.hiid": v.hiid}, function () {
                                layer.closeAll();
                                hardwareItemSearcher.doSearch();
                                com.showAlert(com.info, "删除成功");
                            }, function (e) {
                                layer.closeAll();
                                com.showAlert(com.error, e.exception.errorMessage);
                            });
                        }, function () {

                        });
                    });

                });
                $ul.appendTo($tableWrap);
            }
        };
        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            }
        };
    })();

    var hardwareItemSearcher = new Searcher();

    var _condArr = [];

    hardwareItemSearcher.init(_condArr,"condList",api.production.pageHardwareItemByHid,function(data){

        displayFunc.init("resultList",data);

    },"pagenation","hardwareItemPostData",{"hardware.hid":$hid},false,null,function (){

        var $adda = $('<a></a>').addClass('btn btn-xs btn-info pull-left').attr('name', 'addHardwareItemVersion').css("margin", "0px 3px").html('添加');
        var $back = $('<a></a>').addClass('btn btn-xs pull-left').attr('name', 'backHardwareVersion').css("margin", "0px 3px").html('返回');

        hidBtn($adda,$hardwareStatus);

        $adda.click(function(){

            if($hardwareStatus == 3 || $hardwareStatus == 4 || $hardwareStatus == 5){
                layer.msg("当前生产单状态不可以添加五金项",{icon: 2,time:2e3});
                return false;
            }
            addHardwareItem();
        });

        $back.click(function () {
            com.switchPage(api.index.hardwareIndex.url);
        });

        return [$adda, $back];
    });

    function addHardwareItem() {
        var $popup = $('#addPopUp');
        $popup.attr({'data-hid': $hid});
        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "添加五金项",
            content: $popup,
            area: ["950px", ( $(window).height() * 0.84 < 600 ? $(window).height() * 0.84 : 600 ) + "px"],
            maxmin: true,
            btn: ["取消"],
            zIndex: 9999,
            success: function (layer, index) {
                $popup.load("views/production/addHardwareItem.html");
            },
            end: function () {
                $popup.attr({'data-hid': null});
                $popup.empty();
                hardwareItemSearcher.doSearch();
            }
        });
    }

    function hidBtn(btnId,otherStatus){
        btnId.removeClass('hide');
        if ($productionStatus == 5 || $productionStatus == 4 ) {
            btnId.addClass('hide');
        }else if(otherStatus != 0 ){
            btnId.addClass('hide');
        }

    }

});