$(function() {

    var mcolor = {
        gid: params.store.goods.gid,

        items: {
            name: com.focusPage(".cell.name input"),
        },

        btns: {
            submitBtn: com.focusPage(".color-green.green"),
            clearBtn: com.focusPage(".color-red.red")
        }
    }

    mcolor.btns.submitBtn.click(createColor);
    mcolor.btns.clearBtn.click(clearColor);

    var displayFunc = (function() {

        /* 表格样式 */
        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);

            if (listData && listData.length) {
                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');
                $tableWrap.append($ulTitle).append($ulData);

                $.each(listData, function(i, v) {

                    var $liLine = creatLine(i, v, i == listData.length - 1);
                    $liLine.appendTo($ulTitle);
                });

            }
        };

        /* 表格头 */
        var createTableTitle = function() {

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col2');

            var titleName = '颜色,状态';

            $.each(titleName.split(','), function(i, v) {

                $('<div></div>').addClass('cell').html(v).appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

            return $ulTitle;
        };

        /* 表格体 */
        var creatLine = function(i, v, lastFlag) {

            var $liLine = $('<li></li>').addClass('line');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col2');

            var propertyArr = [[v.color, 'grey'], [v.status == "0" ? "启用" : "禁用", 'red']];

            $.each(propertyArr, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));
            var $btnBan = $('<li></li>').append($('<a></a>').html('禁用'));

            $btnUl.append($btnStart).append($btnBan);
            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            /* 状态启用 */
            $btnStart.click(function() {

                updateStatus(v.cid, 0);
            });

            /* 状态禁用 */
            $btnBan.click(function() {

                updateStatus(v.cid, 1);
            });

            return $liLine;
        };

        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);

            },
            drawLine: function(v) {

                return creatLine(v);
            }
        }
    })();

    /* 分页 */
    function doSearcher() {

        var options = {
            "mcolor.gid": mcolor.gid
        }

        com.post(api.store.queryMcolorByGid, options, function(res) {

            displayFunc.init('resultListColor', res.mcolors);
        })
    }

    doSearcher();

    function updateStatus(cid, status) {

        var options = {
            "mcolor.cid": cid,
            "mcolor.status": status
        }

        com.post(api.store.updateMcolorForStatus, options, function(res) {

            doSearcher();
        });
    }

    function createColor() {

        if (com.validate('addColor', 'bottom')) {
            return false;
        }

        var options = {
            "mcolor.gid": mcolor.gid,
            "mcolor.color": mcolor.items.name.val()
        };

        com.post(api.store.addMcolor, options, function() {

            com.cleanItems(mcolor.items);
            doSearcher();
        })
    }

    function clearColor() {

        com.cleanItems(mcolor.items);
    }

});
