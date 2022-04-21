$(function() {

    var slide = {

        sid: null,
        gid: null,

        items: {

            mgoods: com.focusPage("#mgoods"),
            url: com.focusPage("#url"),
            path: com.focusPage("#path"),
            img: com.focusPage("#slideImg")
        },

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
        }
    };

    com.initTypeahead("mgoods", api.store.queryMgoodsByPinyin, "mgoods.pinyin", {}, "mgoods", "gid", "name");

    com.uploadify("#pictureUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpge;*.gif;*.png', {
        'uploadType': 2
    }, 10, function(data) {

        slide.items.path.val(data.resUrl);

        com.showImg(slide.items.img, data.resUrl, 150, 150, '', null, 0);
    });

    slide.btns.saveBtn.click(saveData);

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
            var titleName = '图片,状态';

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
            var id = i + 1;
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(id));
            var $contentWrap = $('<div></div>').addClass('line-wrap content col2');

            var $imgDiv = $('<div></div>').addClass('cell').appendTo($contentWrap);
            var img = $('<img> </img>');
            com.showImg(img, v.img, 70, 40, '70x40', null, 0);
            img.appendTo($imgDiv);

            var propertyArr = [
            // [v.icon, 'black'],
            [v.status == "0" ? "启用" : "禁用", 'red']];

            $.each(propertyArr, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');
            var $btnBan = $('<li></li>').append($('<a></a>').html('禁用'));
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));
            var $update = $('<li></li>').append($('<a></a>').html('编辑'));

            $btnUl.append($update).append($btnBan).append($btnStart);

            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            // 编辑
            $update.click(function() {

                slide.sid = v.sid;
                slide.gid = v.gid;

                com.focusPage("#mgoodsname").hide();

                initUpdate(v);

                com.popup4model('#layerAdd', '编辑', null, function() {

                    com.clearValidator();
                });
            });

            $btnBan.click(function() {

                updateStatus(v.sid, 1);
            });

            $btnStart.click(function() {

                updateStatus(v.sid, 0);
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

    // 查询
    function doSearcher() {

        com.post(api.store.querySlide, {}, function(res) {

            displayFunc.init('resultList', res.slides);
        });
    }

    doSearcher();

    function updateStatus(sid, status) {

        var options = {
            "slide.sid": sid,
            "slide.status": status
        }

        com.post(api.store.updateSlideForStatus, options, function(res) {

            doSearcher();
        });
    }

    /* 添加信息 */
    function saveData() {

        if (com.validate('form1'))
            return false;

        var url = api.store.addSlide;
        var options = {
            "slide.gid": com.typeahead(slide.items.mgoods),
            "slide.url": slide.items.url.val(),
            "slide.img": slide.items.path.val()
        }

        if (slide.sid) {
            url = api.store.updateSlide;
            options["slide.sid"] = slide.sid;
            options["slide.gid"] = slide.gid;
        }

        com.post(url, options, function(res) {

            doSearcher();
            com.clearValidator();
            com.closePopup();
        });
    }

    function initUpdate(v) {

        slide.items.url.val(v.url);
        slide.items.path.val(v.img);

        com.showImg(slide.items.img, v.img, 150, 150, '', null, 0);
    }

    com.focusPage("#adda").click(function() {

        com.focusPage("#mgoodsname").show();
        com.cleanItems(slide.items);

        com.clearImg(slide.items.img);

        com.popup4model('#layerAdd', '添加', null, function() {

            com.clearValidator();
        });
    });

});
