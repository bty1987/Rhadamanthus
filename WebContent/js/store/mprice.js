$(function() {

    var mprice = {
        gid: params.store.goods.gid,
        name: params.store.goods.name,

        items: {
            name: com.focusPage(".cell.name input"),
            price: com.focusPage(".cell.price input"),
            goods: com.focusPage(".cell.goods input"),
            color: com.focusPage(".cell.color select"),
            format: com.focusPage(".cell.format select"),
            img: com.focusPage(".cell.img"),
        },

        btns: {
            submitBtn: com.focusPage(".color-green.green"),
            clearBtn: com.focusPage(".color-red.red")
        },

        imgUrl: "",
    }

    com.post(api.store.queryMcolorByGid, {
        "mcolor.gid": mprice.gid,
        "mcolor.status": 0
    }, function(res) {

        mprice.items.color.bindData(res.mcolors, "cid", "color");
    });

    com.post(api.store.queryMformatByGid, {
        "mformat.gid": mprice.gid,
        "mformat.status": 0
    }, function(res) {

        mprice.items.format.bindData(res.mformats, "fid", "format");
    });

    com.uploadify(mprice.items.img, "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
        'uploadType': 2
    }, 10, function(data) {

        var img = $('<img />').appendTo($cell);
        com.showImg(img, data.resUrl, 75, 75, '75x75', null, 0);
    });

    mprice.btns.submitBtn.click(createPrice);
    mprice.btns.clearBtn.click(clearPrice);

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
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col8');

            var titleName = '图片,商品,颜色,规格,价格说明,价格,状态';

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
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col8');

            var status = {
                0: "启用",
                1: "禁用",
                2: "热点",
                3: "推荐"
            };

            var propertyArr = [[v.mgoods.name, 'blue'], [v.mcolor.color, 'blue'], [v.mformat.format, 'blue'], [v.name, 'grey'], [v.price, 'blue'], [status[v.status], 'red']];

            var $imgDiv = $('<div></div>').addClass('cell').appendTo($contentWrap);
            var img = $('<img />');
            com.showImg(img, v.img, 50, 50, '50x50', null, 0);
            img.appendTo($imgDiv);

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
            var $btnStop = $('<li></li>').append($('<a></a>').html('禁用'));
            var $gtbe = $('<li></li>').append($('<a></a>').html('热点'));
            var $go = $('<li></li>').append($('<a></a>').html('推荐'));

            $btnUl.append($btnStart).append($btnStop).append($gtbe).append($go);

            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            /* 有效状态 */
            $btnStart.click(function() {

                updateStatus(v.pid, 0);
            });

            /* 无效状态 */
            $btnStop.click(function() {

                updateStatus(v.pid, 1);
            });

            /* 人气状态 */
            $gtbe.click(function() {

                updateStatus(v.pid, 2);
            });

            /* 推荐状态 */
            $go.click(function() {

                updateStatus(v.pid, 3);
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

        var options = {
            "mprice.mgoods.gid": mprice.gid
        }

        com.post(api.store.queryMpriceByGid, options, function(res) {

            displayFunc.init('resultListPrice', res.mprices);
        });
    }

    doSearcher();

    function updateStatus(pid, status) {

        var options = {
            "mprice.pid": pid,
            "mprice.status": status
        }

        com.post(api.store.updateMpriceForStatus, options, function(res) {

            doSearcher();
        });
    }

    function createPrice() {

        if (com.validate("addPrice", "bottom")) {
            return false;
        }

        var options = {
            "mprice.mgoods.gid": gid,
            "mprice.name": $lineInfoWrap.find('.name input').val(),
            "mprice.price": $lineInfoWrap.find('.price input').val(),
            "mprice.mcolor.cid": $lineInfoWrap.find('.color select').val(),
            "mprice.mformat.fid": $lineInfoWrap.find('.format select').val(),
            "mprice.img": imgUrl
        };

        com.post(api.store.addMprice, options, function() {

            com.cleanItems(mprice.items);
            doSearcher();
        });
    }

    function clearPrice() {

        com.cleanItems(mprice.items);
    }

});
