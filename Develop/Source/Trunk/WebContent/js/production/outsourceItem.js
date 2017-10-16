$(function () {

    var backBtn = $('#backBtn');
    var addBtn = $('#addBtn');
    var oid = params.oid;
    var outsourceStatus = params.outsourceStatus;
    var productionStatus = params.productionStatus;

    //var total=$("#total");

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

                   // var total = utils.accMul(v.unitprice,v.num);

                    var propertyArr = [
                        ["高:", v.height, "grey"],
                        ["宽:", v.width, "grey"],
                        ["厚:", v.thick, "grey"],
                        ["造型:", v.modelling, "grey"],
                        ["数量:", v.num, "grey"],
                        ["单价:", v.unitprice, "grey"],
                        ["总价:", v.total, "grey"],
                        ["说明:", v.comment, "grey"]
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

                    hidBtn($btnDelete,outsourceStatus);

                    //删除按钮
                    $btnDelete.click(function (e) {
                        e.stopPropagation();
                        layer.confirm('确定要删除吗？', {
                            btn: ['确定', '取消']
                        }, function (index, layero) {
                            com.post(api.production.deleteOutsourceItem, {"outsourceItem.oiid": v.oiid}, function () {
                                layer.closeAll();
                                outsourceSeacher.doSearch();
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

    var outsourceSeacher = new Searcher();

    var _condArr = [];

    outsourceSeacher.init( _condArr, "condList", api.production.pageOutsourceItemByOid, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "outsourcePostData", {"outsourceItem.oid": oid}, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-xs btn-info').css("margin", "0px 3px").html('添加');

        var $backBtn = $('<a></a>').addClass('btn btn-xs').css("margin", "0px 3px").html('返回');

        hidBtn($adda,outsourceStatus);

        $adda.click(function(){
            if(outsourceStatus == 1 ||outsourceStatus == 2 ){
                layer.msg("当前外协单状态不可以添加外协项",{icon: 2,time:2e3})
                return false;
            }
            addoutsourceItem();
        });

        $backBtn.click(function() {
            com.switchPage(api.index.outsourceIndex.url)
        });

        return [$adda,$backBtn];

    });

    function addoutsourceItem() {
        var $popup = $('#addPopUp');
        $popup.attr({'data-oid': oid});
        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "添加外协项",
            content: $popup,
            area: ["950px", ( $(window).height() * 0.84 < 600 ? $(window).height() * 0.84 : 600 ) + "px"],
            maxmin: true,
            btn: ["取消"],
            zIndex: 9000,
            success: function (layer, index) {
                $popup.load("views/production/addoutsourceItem.html");
            },
            end: function () {
                $popup.attr({'data-oid': null});
                $popup.empty();
                outsourceSeacher.doSearch();
            }
        });
    }

    function hidBtn(btnId,otherStatus){
        btnId.removeClass('hide');
        if (productionStatus == 5 || productionStatus == 4 ) {
            btnId.addClass('hide');
        }else if(otherStatus != 0 ){
            btnId.addClass('hide');
        }

    }

});