$(function () {
    var occessories={
        status: {},
    };

    com.post(api.ds.manifest, {}, function(res){
        occessories.status = res.occessoriesStatus.split("key", "value");
    }, null, false);

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);

            if (listData && listData.length) {

                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');

                $tableWrap.append($ulTitle).append($ulData);

                $.each(listData, function (i, v) {
                    creatLine(i, v, i == listData.length - 1).appendTo($ulTitle);
                });
            }
        };

        var createTableTitle = function () {

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col7');

            var titleName = '外辅单号,装修单号,创建人,创建时间,监理,状态';

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
            // var _label = $('<label></label>');
            // var $input = $('<input>').attr({"type": "checkbox"}).addClass('ace ace-checkbox-2 hide').attr('data-oid', v.oid).attr({
            //     "data-status": v.status
            // });
            // var _span = $('<span></span>').addClass('lbl grey bigger-150').css('font-weight','bold');
            // _label.append($input).append(_span);
            // var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(_label));

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col7');

            var propertyArr = [
                [v.no, 'blue'],
                [v.orderId, 'blue'],
                [v.creater.currentName, 'grey'],
                [v.createTime, 'green'],
                [v.supervisor.currentName, 'grey'],
                [occessories.status[v.status], 'red'],
            ];

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option').appendTo($optionWrap);

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-info dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            var $btnView = $('<li></li>').append($('<a></a>').html('查看'));
            var $btnComfirm = $('<li></li>').append($('<a></a>').html('确认'));
            var $btnEdit = $('<li></li>').append($('<a></a>').html('编辑'));
            var $btnAccount = $('<li></li>').append($('<a></a>').html('结算'));

            // v.status != 2 && ($btnUl.append($btnEdit));
            v.status == 0 && ($btnUl.append($btnEdit).append($btnComfirm));
            v.status == 1 && ($btnUl.append($btnView).append($btnAccount));
            v.status == 2 && ($btnUl.append($btnView));

            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            $btnView.click(function(){

                if(v.status == 0){
                    com.showAlert(com.warning, "外辅单状态不可操作");
                    return false;
                }

                params["occessoriesItem.oid"] = v.oid;

                com.popup4page('#layerPopUp', "views/manifest/occessories4view.html", "外辅单 : " + v.no);
            });

            $btnEdit.click(function () {

                if(v.status != 0){
                    com.showAlert(com.warning, "外辅单状态不可操作");
                    return false;
                }

                params["occessoriesItem.oid"] = v.oid;
                params["occessories.orderId"] = v.orderId;

                com.popup4page('#layerPopUp', "views/manifest/occessories2edit.html", "外辅单 : " + v.no);
            });

            $btnComfirm.click(function(e){

                if(v.status == 1){
                    com.showAlert(com.warning, "外辅单已确认");
                    return false;
                }

                var option = {
                    "occessories.oid": v.oid,
                    "occessories.status": 1
                };

                com.showConfirm('是否确认外辅单?', function(indexo){
                    com.post(api.inventory.updateOccessoriesForStatus, option, function(res){
                        occessoriesSeacher.doSearch();
                    });
                });

            });

            $btnAccount.click(function(e){

                if(v.status == 2){
                    com.showAlert(com.warning, "外辅单已结算");
                    return false;
                }

                var options = {
                    "occessories.oid": v.oid,
                    "occessories.status": 2
                };

                com.showConfirm('确认结算外辅单?', function(indexo){
                    com.post(api.inventory.updateOccessoriesForStatus, options, function(res){
                        occessoriesSeacher.doSearch();
                    });
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
        };
    })();

    var occessoriesSeacher = new Searcher();
    var _Array = ['orderId', 'occessoriesNo', 'createrName', 'createTime', 'occessoriesStatus'];

    occessoriesSeacher.init(_Array, "condList", api.inventory.pageOccessories, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "accessoriesPostData", null, false, null, function () {
        return [];
    }, 'resultList');

});