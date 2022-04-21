$(function() {

    var coupon = {

        items: {
            mgoods: com.focusPage("#mgoods"),
            title: com.focusPage("#title"),
            vprice: com.focusPage("#vprice"),
            type: com.focusPage("#type"),
        },

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
        }
    };

    com.initTypeahead(coupon.items.mgoods, api.store.queryMgoodsByPinyin, "mgoods.pinyin", {}, "mgoodses", "gid", "name");

    coupon.btns.saveBtn.click(saveData);

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

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col5');
            var titleName = '商品名字,劵标题,劵值,类型,状态';

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
            var $contentWrap = $('<div></div>').addClass('line-wrap content col5');

            var propertyArr = [[v.mgoods.title, 'grey'], [v.title, 'grey'], [v.value, 'grey'], [v.type == "0" ? "劵值" : "折扣", 'red'], [v.status == "0" ? "启用" : "禁用", 'red']];

            $.each(propertyArr, function(i, v) {

                $('<div></div>').addClass('cell ' + v[1]).html(v[0]).appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));
            var $btnBan = $('<li></li>').append($('<a></a>').html('禁用'));
            var $update = $('<li></li>').append($('<a></a>').html('编辑'));

            $btnUl.append($update).append($btnStart).append($btnBan);

            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            // 编辑
            $update.click(function() {

                initUpdate(v);

                com.popup4model('#layerAdd', '编辑', null, function() {

                    com.clearValidator();
                });
            });

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
        };
    })();

    /* 分页 */
    var searcher = new Searcher();
    searcher.init(["store-coupon-mgoods-no"], "condList", api.store.pageCoupon, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "couponPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addQuotationVersion').css('margin', '0px 3px');
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function() {

            com.focusPage("#mgood").show();
            com.cleanItems(coupon.items);

            com.popup4model('#layerAdd', '添加', null, function() {

                com.clearValidator();
            });

        });
        return [$adda];
    }, 'resultList');

    function updateStatus(cid, status) {

        var options = {
            "coupon.cid": cid,
            "coupon.status": status
        }

        com.post(api.store.updateCouponForStatus, options, function(res) {

            searcher.doSearch();
        });
    }

    function saveData() {

        if (com.validate('form'))
            return false;

        var url = api.store.addCoupon;
        var options = {
            "coupon.mgoods.gid": com.typeahead(coupon.items.mgoods),
            "coupon.title": coupon.items.title.val(),
            "coupon.value": coupon.items.vprice.val(),
            "coupon.type": coupon.items.type.val()
        }

        if (coupon.cid) {
            url = api.store.updateCoupon;
            options["coupon.cid"] = coupon.cid;
        }

        com.post(api.store.addCoupon, options, function(res) {

            com.closePopup();
            searcher.doSearch();
        });
    }

    function initUpdate(v) {

        com.updateTypeahead(coupon.items.mgoods, v.mgoods.gid, v.mgoods.name);

        coupon.items.title.val(v.title);
        coupon.items.vprice.val(v.value);
        coupon.items.type.val(v.type);
    }
});
