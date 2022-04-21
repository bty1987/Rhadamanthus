
$(function(){

	var mtid = params.manifest.manifestTemplate.mtid;

	com.post(api.inventory.queryManifestTemplateItemByMtid, {"manifestTemplate.mtid": mtid}, function (res) {
        displayFunc.init('resultList', res.manifestTemplateItems);
    });

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
            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

            return $ulTitle;
        };

        var creatLine = function(i, v, lastFlag){

            var $liLine = $('<li></li>').addClass('line');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col10');

            var propertyArr = [
                [v.manifestTemplate.name, 'grey'],
                [v.manifestTemplate.comment, 'grey'],
                [v.goods.no, 'blue'],
                [v.goods.name, 'grey'],
                [v.goods.barcode, 'blue'],
                [v.goods.category, 'grey'],
                [v.goods.brand, 'grey'],
                [v.goods.measurementUnit, 'grey'],
                [v.goods.type == 0 ? "商品" : "套餐", 'red'],
                [v.goods.pieceNum, 'blue']
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

            $btnUl.append($btnDelete);
            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);
            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            $btnDelete.click(function() {
                com.showConfirm('是否确定删除?', function () {
                    com.post(api.inventory.deleteManifestTemplateItem, {
                        "manifestTemplate.mtid": mtid,
                        "mtiids[0]": v.mtiid
                    }, function () {
                        com.showAlert(com.info, "操作成功");
                        $liLine.remove();
                    });
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

    com.focusPage("#addBtn").click(function(){
        params.manifest.manifestTemplate.mtid=mtid;
        com.focusPage("#optPopUp").attr('data-mtid', mtid);
        com.popup4page("#optPopUp","views/manifest/manifestTemplateItem2add.html","添加");
    });

    com.focusPage("#backBtn").click(function () {
        com.switchPage("views/manifest/manifestTemplate.html");
    });

});
