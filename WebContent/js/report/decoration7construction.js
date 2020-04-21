$(function () {

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

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index blue').html('序号'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col15');

            var titleName ='公司,未开工,已开工,已完工,铲大白,放线,水暖,力工,电工,瓦工,地面找平,木工,油工,水电验收,保洁';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<table></table>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            $liTitle.append($indexWrap).append($contentWrap).appendTo($ulTitle);

            return $ulTitle;
        };

        var creatLine = function (i, v) {
            var $liLine = $('<li></li>').addClass('line');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap content col15');

            var propertyArr = [
              [v.company,'grey'],
              [v.cs0,'grey'],
              [v.cs1,'grey'],
              [v.cs2,'grey'],
              [v.cs3,'grey'],
              [v.cs4,'grey'],
              [v.cs5,'grey'],
              [v.cs6,'grey'],
              [v.cs7,'grey'],
              [v.cs8,'grey'],
              [v.cs9,'grey'],
              [v.cs10,'grey'],
              [v.cs11,'grey'],
              [v.cs12,'grey'],
              [v.cs13,'grey']
            ];

            $liLine.append($indexWrap);

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            $liLine.append($indexWrap).append($contentWrap);

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

    searcher.init( [], "creatLine", api.report.queryDecoration7Construction, function(data){
        displayFunc.init('resultList', data);
    }, "decoration7Construction", "decoration7ConstructionsPost", null, false, null,function(){

        var $update = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'updateData').css("margin", "0px 3px");
		var $updatei = $('<i></i>').addClass('icon-refresh bigger-110').appendTo($update);
		var $updateSpan = $('<span></span>').text('更新').appendTo($update);
		var $exportAnchor = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name','export').css("margin", "0px 3px");
        var $exprotIcon = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($exportAnchor);
        var $exportText = $('<span></span>').text('导出').appendTo($exportAnchor);

        $exportAnchor.click(function(){
            exportation();
        });

		return [$update,$exportAnchor];

    },"resultList");

    com.focusPage("#updateData").click(function () {
        com.post(api.report.updataDecoration7Construction,{},function (data) {
            searcher.doSearch();
            com.showAlert(com.info, "更新成功");
        });
    });

    function exportation(){

       if(com.focusPage('span[name="totalRecords"]').text() == 0){
            com.showAlert(com.warning, "请更新数据");
            return false;
        }
        if(com.focusPage('span[name="totalRecords"]').text() > 2000){
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

          com.showConfirm("是否确认导出", function(){
        var decoration7ConstructionsPost = params.decoration7ConstructionsPost;

        com.post( api.report.queryDecoration7Construction, $.extend({}, decoration7ConstructionsPost, {"paging.noPage": 1}), function (res) {

            $.exceler({
                column:[
                ["公司", "company"],
                ['未开工', 'cs0'],
                ['已开工', 'cs1'],
                ['已完工', 'cs2'],
                ['铲大白', 'cs3'],
                ['放线', 'cs4'],
                ['水暖', 'cs5'],
                ['力工', 'cs6'],
                ['电工', 'cs7'],
                ['瓦工', 'cs8'],
                ['地面找平', 'cs9'],
                ['木工', 'cs10'],
                ['油工', 'cs11'],
                ['水电验收', 'cs12'],
                ['保洁', 'cs13']],
                list: res.paging.data
            },null);
    });
        });
    };
});
