$(function () {

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */

    var goodsFormatPopUp = com.focusPage('#goodsFormatPopUp');


    var displayFunc = (function () {

        /*表格样式*/
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
                com.focusPage('#resultListFormat').css({
                    'width': '96%',
                    'margin': '0 auto',
                    'height': '560px',
                    'marigin-top': '20px',
                    'overflow-y': 'scroll'
                })
            }
        };

        /*表格头*/
        var createTableTitle = function () {

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col2');

            var titleName = '规格,状态';

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

        /*表格体*/
        var creatLine = function (i, v, lastFlag) {


            var $liLine = $('<li></li>').addClass('line');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col2');

            var propertyArr = [
                //v.gid,
                [v.info, 'grey'],
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

            $btnUl
                .append($btnStart)
                .append($btnBan);
            $btnGroup
                .append($btn)
                .append($btnUl)
                .appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap)
                .append($contentWrap)
                .append($optionWrap);


            /*状态启用*/
            $btnStart.click(function () {
                com.focusPage('#layerAdd').attr('data-fid', v.fid);
                com.focusPage('#layerAdd').attr('data-status', v.status);

                var id = com.focusPage('#layerAdd').attr('data-fid');
                var status = com.focusPage('#layerAdd').attr('data-status');
                startStatus(id, status, function () {
                    layer.msg('启用成功', {icon: 1});
                    doSearcher();
                });
            });
            /*状态禁用*/
            $btnBan.click(function () {
                com.focusPage('#layerAdd').attr('data-fid', v.fid);
                com.focusPage('#layerAdd').attr('data-status', v.status);

                var id = com.focusPage('#layerAdd').attr('data-fid');
                var status = com.focusPage('#layerAdd').attr('data-status');

                stopStatus(id, status, function () {
                    layer.msg('禁用成功', {icon: 1});
                    doSearcher()
                });
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
        }
    })();

    /*分页*/
    function doSearcher() {
        com.post(api.inventory.queryFormatByGid, {
            "format.gid": goodsFormatPopUp.attr('data-gid')
        }, function (res) {
            displayFunc.init('resultListFormat', res.formats)
        })
    }

    doSearcher();

    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col1');
        var $optWrap = $('<div></div>').addClass('line-wrap action');
        var _lineInfoSet = [
            {cellClass: "info", hasInput: !0}//名称
        ];
        var $btncheck = $('<a class="color-green green" style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="color-red red" style="font-size: 18px"><i class=" icon-remove"></i></a>');
        $.each(_lineInfoSet, function (i, v) {
            var $input;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);
            if (v.hasInput) {
                $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable v_required');
                $cell.append($input);
            }

            $cell.appendTo($lineInfoWrap);

        });

        $optWrap.append($('<div></div>').addClass('cell option').append($btncheck).append($btndel));

        $line.append($indexWrap).append($lineInfoWrap).append($optWrap);

        $btncheck.click(function (e) {
            e.stopPropagation();
            if (com.validate('addFormat', 'bottom')) {
                return;
            }
            var gid = $(this).parents('li.line.current').attr('data-gid');
            var options = {
                "format.gid": goodsFormatPopUp.attr('data-gid'),
                "format.info": $lineInfoWrap.find('.info input').val()
            };

            com.post(api.inventory.addFormat, options, function () {
                com.focusPage('#list').empty();
                addline(1).addClass('current').appendTo(com.focusPage('#list'));
                com.post(api.inventory.queryFormatByGid, {
                    "format.gid": goodsFormatPopUp.attr('data-gid')
                }, function (data) {
                    displayFunc.init('resultListColor', data.formats);
                    doSearcher();
                })
            }, function (e) {
                com.showAlert(com.error, e.errorMsg);
            })


        });

        $btndel.click(function (e) {

            com.focusPage('#list').empty();

            addline(1).addClass('current').appendTo(com.focusPage('#list'));

        });

        return $line;

    }

    addline(1).addClass('current').appendTo(com.focusPage('#list'));


    /*状态信息验证*/
    function startStatus(id, status, callback) {
        if (status == "1") {
            com.post(api.inventory.updateFormatForStatus, {
                "format.fid": id,
                "format.status": "0"
            }, function (res) {
                callback();
                doSearcher()
            })
        } else {
            layer.alert('已经启用', {
                icon: 0,
                skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
            })
        }
    }

    function stopStatus(id, status, callback) {
        if (status == "0") {
            com.post(api.inventory.updateFormatForStatus, {
                "format.fid": id,
                "format.status": "1"
            }, function (res) {
                callback();
                doSearcher()
            })
        } else {
            layer.alert('已经禁用', {
                icon: 0,
                skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
            })
        }
    }


    com.focusPage('.layui-layer-content').css('overflow', 'hidden');
    com.focusPage('#showFormat').css('height', '560px');
    com.focusPage('#addFormat').css({'width': '96%', 'margin': '0 auto', 'margin-top': '15px'});

});
