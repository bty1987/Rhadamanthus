$(function() {

    var mgoods = {

        items: {
            no: com.focusPage("#no"),
            name: com.focusPage("#name"),
            barcode: com.focusPage("#barcode"),
            mbrand: com.focusPage("#mbrand"),
            title: com.focusPage("#title"),
            price: com.focusPage("#price")
        },

        btns: {
            saveBtn: com.focusPage("#saveBtn")
        }
    };

    com.initTypeahead("mbrand", api.store.queryMbrandByName, "mbrand.name", {}, "mbrands", "bid", "name");

    mgoods.btns.saveBtn.click(saveData);

    var displayFunc = (function() {

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

        // 绘制表格头
        var createTableTitle = function() {

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col10');

            var titleName = '二维码,图片,编号,商品,条形码,品牌,标题,价格,状态';

            $.each(titleName.split(','), function(i, v) {

                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

            return $ulTitle;
        };

        // 绘制表格体
        var creatLine = function(i, v, lastFlag) {

            var $liLine = $('<li></li>').addClass('line');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col10');
            // 显示字段
            var propertyArr = [[v.no, 'blue'], [v.name, 'grey'], [v.barcode, 'blue'], [v.mbrand.name, 'grey'], [v.title, 'grey'], [v.price, 'grey'], [v.status == "0" ? "启用" : "禁用", 'red']];

            var $imgDiv = $('<div></div>').addClass('cell').appendTo($contentWrap);
            $imgDiv.qrcode({
                render: "canvas",
                width: 100,
                height: 100,
                text: "http://fanglin.vip/wx/store?gid=" + v.gid
            });

            var $imgDiv = $('<div></div>').addClass('cell').appendTo($contentWrap);
            var img = $('<img />').appendTo($imgDiv);
            com.showImg(img, v.defaultImg, 50, 50, '', null, 0);

            $.each(propertyArr, function(i, v) {

                $('<div></div>').addClass('cell ' + v[1]).html(v[0]).appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');
            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            // 操作按钮下面的选项
            var $btnEdit = $('<li></li>').append($('<a></a>').html('编辑'));
            var $btnColor = $('<li></li>').append($('<a></a>').html('颜色'));
            var $btnFormat = $('<li></li>').append($('<a></a>').html('规格'));
            var $btnPrice = $('<li></li>').append($('<a></a>').html('价格'));
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));
            var $btnStop = $('<li></li>').append($('<a></a>').html('禁用'));
            var $btnImg = $('<li></li>').append($('<a></a>').html('图片'));

            // 添加操作按钮下面的选项
            $btnUl.append($btnEdit).append($btnColor).append($btnFormat).append($btnPrice).append($btnStart).append($btnStop).append($btnImg);

            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            // 编辑点击事件
            $btnEdit.click(function() {

                mgoods.gid = v.gid;

                com.popup4model('#layerAdd', '编辑', null, function() {

                    com.clearValidator();
                }, function() {

                    readonly();
                    initUpdate(v);
                });
            });

            // 颜色点击事件
            $btnColor.click(function() {

                params.store.goods = v;
                com.popup4page('#goodsColorPopUp', 'views/store/mcolor.html', '颜色', function() {

                    searcher.doSearch();
                });
            });

            // 规格点击事件
            $btnFormat.click(function() {

                params.store.goods = v;
                com.popup4page('#goodsFormatPopUp', 'views/store/mformat.html', '规格', function() {

                    searcher.doSearch();
                });
            });

            // 商品图片
            $btnImg.click(function() {

                params.store.goods = v;
                com.popup4page('#goodsPicturePopUp', 'views/store/picture.html', '商品图片', function() {

                    searcher.doSearch();
                });
            });

            // 价格点击事件
            $btnPrice.click(function() {

                params.store.goods = v;
                com.popup4page('#goodsPricePopUp', 'views/store/mprice.html', '价格', function() {

                    searcher.doSearch();
                });
            });

            // 状态启用事件
            $btnStart.click(function() {

                com.showConfirm("是否确认启用", function() {

                    updateStatus(v.gid, 0);
                });
            });

            // 状态禁用事件
            $btnStop.click(function() {

                com.showConfirm("是否确认禁用", function() {

                    updateStatus(v.gid, 1);
                });
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

    searcher.init(['store-mgoods-no', 'store-mgoods-name', 'store-mgoods-barcode', 'store-mgoods-brand'], "condList", api.store.pageMgoods, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "mgoodsPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'layerAdd').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function() {

            mgoods.gid = null;

            com.cleanItems(mgoods.items);

            com.popup4model('#layerAdd', '添加', null, null, function() {

                readopen();
                com.clearValidator();
            });
        });
        return [$adda];
    });

    function saveData() {

        if (com.validate('form1'))
            return false;

        var url = api.store.addMgoods;
        var options = {
            "mgoods.no": mgoods.items.no.val(),
            "mgoods.name": mgoods.items.name.val(),
            "mgoods.barcode": mgoods.items.barcode.val(),
            "mgoods.mbrand.bid": com.typeahead(mgoods.items.mbrand),
            "mgoods.title": mgoods.items.title.val(),
            "mgoods.price": mgoods.items.price.val(),
            "mgoods.defaultImg": ""
        };

        if (mgoods.gid) {
            options["mgoods.gid"] = mgoods.gid;
            url = api.store.updateMgoods;
        }

        com.post(url, options, function(res) {

            searcher.doSearch();
            readopen();
            com.closePopup();
        });
    }

    function updateStatus(gid, status) {

        var options = {
            "mgoods.gid": gid,
            "mgoods.status": status
        }

        com.post(api.store.updateMgoodsForStatus, options, function(res) {

            searcher.doSearch();
        });
    }

    function initUpdate(v) {

        readonly();

        mgoods.gid = v.gid;

        mgoods.items.no.val(v.no);
        mgoods.items.name.val(v.name);
        mgoods.items.barcode.val(v.barcode);
        mgoods.items.title.val(v.title);
        mgoods.items.price.val(v.price);

        com.updateTypeahead(mgoods.items.mbrand, v.mbrand.bid, v.mbrand.name)
    }

    function readonly() {

        mgoods.items.no.attr('disabled', 'disabled');
        mgoods.items.name.attr('disabled', 'disabled');
        mgoods.items.barcode.attr('disabled', 'disabled');
        mgoods.items.mbrand.attr('disabled', 'disabled');
    }

    function readopen() {

        mgoods.items.no.removeAttr('disabled');
        mgoods.items.name.removeAttr('disabled');
        mgoods.items.barcode.removeAttr('disabled');
        mgoods.items.mbrand.removeAttr('disabled');
    }
});
