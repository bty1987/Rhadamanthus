$(function () {

    var items = {
        code: com.focusPage("#code"),
        name: com.focusPage("#name"),
        submitBtn: com.focusPage("#submitBtn"),
    };

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
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col2');

            var titleName = '仓库,状态';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

            return $ulTitle;
        };

        var creatLine = function (i, v, lastFlag) {

            var $liLine = $('<li></li>').addClass('line');
            var id = i + 1;
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(id));
            var $contentWrap = $('<div></div>').addClass('line-wrap content col2');

            var propertyArr = [
                [v.name, 'grey'],
                [v.status == "0" ? "启用" : "禁用", 'red']
            ];

            $.each(propertyArr, function (i, v) {
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

            $btnStart.click(function () {

                if (v.status == constant.inventory().storehouse.STATUS_ENABLE_INT) {
                    com.showAlert(com.warning, "已启用");
                    return false;
                }

                updateStatus(v.shid, 0);
            });

            $btnBan.click(function () {

                if (v.status == constant.inventory().storehouse.STATUS_DISABLE_INT) {
                    com.showAlert(com.warning, "已禁用");
                    return false;
                }

                updateStatus(v.shid, 1);
            });

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

    var _condArr = ['data-storehouse-no', 'data-storehouse-name','data-storehouse-status'];

    var storehouseSeacher = new Searcher();

    storehouseSeacher.init(_condArr, "condList", api.inventory.pageStorehouse, function (data) {

        displayFunc.init('resultList', data);

    }, "pagenation", "storehousePostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addQuotationVersion').css('margin', '0px 3px');
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function () {
            com.popup4model('#layerAdd', '添加')
        });

        return [$adda];
    }, 'resultList');

    function updateStatus(shid, status) {

        var options = {
            "storehouse.shid": shid,
            "storehouse.status": status
        };

        com.post(api.inventory.updateStorehouseForStatus, options, function (res) {
            com.showAlert(com.info, "操作成功");
            storehouseSeacher.doSearch();
        });
    }

    items.submitBtn.click(function () {
        saveData()
    });

    function saveData() {

        if (com.validate('form1')) {
            return false;
        }

        var options = {
            "storehouse.code": items.code.val(),
            "storehouse.name": items.name.val()
        };

        com.post(api.inventory.addStorehouse, options, function (res) {
            com.showAlert(com.info, "操作成功");
            com.clearValidator();
            com.cleanItems(items);
            storehouseSeacher.doSearch();
            com.closePopup();
        });
    }

});
