$(function() {

    var address = {
        uid: params.store.muser.uid,
        unionId: params.store.muser.unionId,

        items: {
            name: com.focusPage("#name1"),
            phone: com.focusPage("#phone1"),
            province: com.focusPage("#province"),
            city: com.focusPage("#city"),
            proper: com.focusPage("#proper"),
            address: com.focusPage("#address"),
        },

        btns: {
            updateAddressBtn: com.focusPage("#updateAddressBtn"),
        }
    };

    address.btns.updateAddressBtn.click(updateData);

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

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col3');

            var titleName = '姓名,电话,地址';

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
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col3');

            var propertyArr = [[v.name, 'grey'], [v.phone, 'grey'],
            // [v.status =="0" ? "启用" : "禁用",'red'],
            [v.province + v.city + v.proper + v.address, 'grey']];

            $.each(propertyArr, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            var $update = $('<li></li>').append($('<a></a>').html('编辑'));

            $btnUl.append($update);
            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            $update.click(function() {

                address.aid = v.aid;

                com.cleanItems(address.items);

                initUpdate(v);

                com.popup4model('#layerAdd2', '编辑', null, function() {

                    com.clearValidator();
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
        }
    })();

    doSearcher();

    function doSearcher() {

        com.post(api.store.queryAddressByUid, {
            "address.uid": address.uid
        }, function(res) {

            displayFunc.init('resultListAddress', res.addresses);
        });
    }

    function initUpdate(v) {

        address.items.name.val(v.name);
        address.items.phone.val(v.phone);
        address.items.province.val(v.province);
        address.items.city.val(v.city);
        address.items.proper.val(v.proper);
        address.items.address.val(v.address);
    }

    function updateData() {

        if (com.validate('form2'))
            return false;

        var url = api.store.updateAddress
        var options = {
            "muser.unionId": address.unionId,
            "address.aid": address.aid,
            "address.name": address.items.name.val(),
            "address.province": address.items.province.val(),
            "address.city": address.items.city.val(),
            "address.proper": address.items.proper.val(),
            "address.address": address.items.address.val()
        }

        com.post(url, options, function(res) {

            com.closePopup();
            doSearcher();
        });
    }

});
