jQuery(function ($) {

    var constructionNodes = {};

    com.post(api.data.queryConstructionNode, {}, function (res) {
        $.each(res.constructionNodes, function (i, v) {
            constructionNodes[v.cnid] = v.name;
        });
        constructionNodes[0] = "初始";
        constructionNodes[1] = "开工";
        constructionNodes[2] = "完工";
    }, null, false);

    var workerAllocation = {
        saveBtn: null,
        cancellBtn: null,
        modal: null,
        workerAllocationItems: {},

        editFlag: false
    };

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = $('#' + tableId).empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {
            var that = this;
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html("查看");


            var propertyArr = [
                ["楼盘名:", v.house.village.name, "grey"],
                ["设计师:", v.designer.userName, "grey"],
                ["监理:", v.supervisor.userName, "grey"],
                ["总价:", v.orderTotalPrice, "blue"],
                //["折扣:", v.discount, "blue"],
                ["面积:", v.house.buildArea, "blue"],
                ["进度:", constructionNodes[v.projectStatus], "red"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnView).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnView.click(function () {
                viewworkerAllocationDetail(v.orderId);
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
        }
    })();

    var searcher = new Searcher();
    searcher.init(['c_orderId', 'c_village', 'c_designer', 'c_schedule'], "condList", api.construction.pageConstruction, function (list) {
        displayFunc.init('resultList', list);
    }, "pagenation", "workerAllocationSeacherPostData");

    function viewworkerAllocationDetail(orderId) {
        params.orderId = orderId;
        com.switchPage(api.index.workerAllocationDetailIndex.url);
    }

});

