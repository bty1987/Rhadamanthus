$(function() {

    var mcategory = {

        items: {
            name: com.focusPage("#name"),
            icon: com.focusPage("#icon"),
        },

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
        },
    };

    mcategory.btns.saveBtn.click(saveData);

    var displayFunc = (function() {

        /* 表格样式 */
        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);

            if (listData && listData.length) {

                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');

                $tableWrap.append($ulTitle).append($ulData);

                $.each(listData, function(i, v) {

                    creatLine(i, v, i == listData.length - 1).appendTo($ulTitle);
                });
            }
        };

        /* 表格头 */
        var createTableTitle = function() {

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col2');

            var titleName = '品类,状态';

            $.each(titleName.split(','), function(i, v) {

                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

            return $ulTitle;
        };

        /* 表格体 */
        var creatLine = function(i, v, lastFlag) {

            var $liLine = $('<li></li>').addClass('line');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap content col2');

            var propertyArr = [[v.name, 'grey'], [v.isShow == "0" ? "首页显示" : "首页不显示", 'red']];

            $.each(propertyArr, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            var $btnBan = $('<li></li>').append($('<a></a>').html('不显示'));
            var $btnStart = $('<li></li>').append($('<a></a>').html('显示'));
            var $update = $('<li></li>').append($('<a></a>').html('编辑'));

            $btnUl.append($btnStart).append($btnBan).append($update);

            $btnUl.append($btnStart).append($btnBan).append($update);
            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            $update.click(function() {

                mcategory.cid = v.cid;

                com.cleanItems(mcategory.items);

                com.focusPage("#name").val(v.name);
                com.focusPage("#icon").val(v.icon);

                com.popup4model('#layerAdd', '编辑', null, function() {

                    com.clearValidator();
                });
            });

            $btnStart.click(function() {

                updateStatus(v.cid, 0);
            });

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
        };
    })();

    var searcher = new Searcher();

    searcher.init(["store-mcategory"], "condList", api.store.pageMcategory, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "mcategoryPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addQuotationVersion').css('margin', '0px 3px');
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function() {

            com.cleanItems(mcategory.items);

            com.popup4model('#layerAdd', '添加', null, function() {

                com.clearValidator();
            });
        });

        return [$adda];
    }, 'resultList');

    function updateStatus(cid, status) {

        var options = {
            "mcategory.cid": cid,
            "mcategory.isShow": status
        }

        com.post(api.store.updateMcategoryForShow, options, function(res) {

            searcher.doSearch();
        });
    }

    /* 添加信息 */
    function saveData(id, callback) {

        if (com.validate('form1'))
            return false;

        var url = api.store.addMcategory;
        var options = {
            "mcategory.name": mcategory.items.name.val(),
            "mcategory.icon": mcategory.items.icon.val()
        }

        if (mcategory.cid) {
            url = api.store.updateMcategory;
            options["mcategory.cid"] = mcategory.cid;
        }

        com.post(url, options, function(res) {

            com.closePopup();
            searcher.doSearch();
        });
    }

});
