/**
 * Created by 袁帅 on 2016/10/4.
 */


$(function(){

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */
    var displayFunc  = (function(){


        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);

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

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col10');

            var titleName = '名称,说明,商品编号,商品,条形码,品类,品牌,单位,套餐,件数';

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

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col10');

            var propertyArr = [
                [v.manifestTemplate.name,'grey'],
                [v.manifestTemplate.comment,'grey'],
                [v.goods.no,'blue'],
                [v.goods.name,'grey'],
                [v.goods.barcode,'blue'],
                [v.goods.category,'grey'],
                [v.goods.brand,'grey'],
                [v.goods.measurementUnit,'grey'],
                [v.goods.type==0?"商品":"套餐",'red'],
                [v.goods.pieceNum,'blue']
            ];


            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle','dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            var $btnDelete = $('<li></li>').append($('<a></a>').html('删除')) ;


            //var $btnstorehouse = $('<li></li>').append($('<a></a>').html('仓库')) ;

            $btnUl
            .append($btnDelete);

            $btnGroup
                .append($btn)
                .append($btnUl)
                .appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap)
                .append($contentWrap)
                .append($optionWrap);

            $btnDelete.click(function() {
                layer.confirm('是否确定删除？', {
                    btn: ['确定','取消'] //按钮
                }, function(index, layero){
                    com.post(api.inventory.deleteManifestTemplateItem, {
                        "manifestTemplate.mtId": params.mtid,
                        "mtiIds[0]": v.mtiId
                    }, function(){
                        layer.msg('删除成功', {icon: 1});
                        com.switchPage('views/manifest/manifestTemplateItem.html');
                    });
                }, function(){

                });

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
    var binding = {
        //操作配置
        optAction : function(mtId, manifestTemplate){

            var $popup = com.focusPage("#optPopUp");
            $popup.attr('data-mtId', mtId);
            //$popup.attr('data-name', name);
            //弹出即全屏
            var index = layer.open({
                type: 1,
                skin: 'layui-layer-lan',
                title:"添加",
                content: $popup,
                area: ["1100px",( $(window).height()*0.84 < 720 ?  $(window).height()*0.84 : 720 )+"px"],
                maxmin: false,
                zIndex:9000,

                success: function(){
                    params["promissionManifestTemplate"] = manifestTemplate;
                    $popup.load("views/manifest/addmanifestTemplateItem.html");
                },
                end:function(){
                    $popup.attr('data-mtId', null);
                }
            });
        }
    };



    var $adda = com.focusPage('a[name="addQuotationVersion"]');
    var $return = com.focusPage('a[name="returnQuotationVersion"]');

    $adda.click(function(v){
        binding.optAction(v.mtId,v);
    });
    
    $return.click(function () {
        com.switchPage("views/manifest/manifestTemplate.html");
    });

    com.post(api.inventory.queryManifestTemplateItemByMtId,{
        "manifestTemplate.mtId": params.mtid
    }, function (res) {
        displayFunc.init('resultList', res.manifestTemplateItems);

    });



});
