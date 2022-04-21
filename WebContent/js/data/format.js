$(function() {

    var goods = {

        gid: params.data.goods.gid,

        items: {
            formatInfo: com.focusPage("#formatInfo")
        },

        btns: {
            addBtn: com.focusPage("#addBtn"),
            delBtn: com.focusPage("#delBtn")
        }
    };

    var displayFunc = (function() {

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

        var createTableTitle = function() {

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col2');

            var titleName = '规格,状态';

            $.each(titleName.split(','), function(i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

            return $ulTitle;
        };

        var creatLine = function(i, v, lastFlag) {

            var $liLine = $('<li></li>').addClass('line');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col2');

            var propertyArr = [[v.info, 'grey'], [v.status == "0" ? "启用" : "禁用", 'red']];

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

            $btnStart.click(function() {

                if (v.status == 0) {
                    com.showAlert(com.warning, "已启动");
                    return false;
                }

                updateStatus(v.fid, 0);
            });

            $btnBan.click(function() {

                if (v.status == 1) {
                    com.showAlert(com.warning, "已禁用");
                    return false;
                }

                updateStatus(v.fid, 1);
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

    function doSearcher() {
        com.post(api.data.queryFormatByGid, {
            "format.gid": goods.gid
        }, function(res) {
            displayFunc.init('resultListFormat', res.formats)
        });
    }

    doSearcher();

    function updateStatus(fid, status) {

        var options = {
            "format.fid": fid,
            "format.status": status
        };

        com.post(api.data.updateFormatForStatus, options, function(res) {
            doSearcher();
        });
    }

    goods.btns.addBtn.click(function() {

        if (com.validate('addFormat', 'bottom')) { return false; }

        var options = {
            "format.gid": goods.gid,
            "format.info": goods.items.formatInfo.val()
        };

        com.post(api.data.addFormat, options, function() {
            com.cleanItems(goods.items);
            doSearcher();
        });
    });

    goods.btns.delBtn.click(function() {
        com.cleanItems(goods.items);
    });

});
