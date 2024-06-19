$(function() {

    var Module = (function() {

        var creatLine = function (data) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $i = $('<i></i>').addClass(data.icon).addClass('blue');
            var $h3 = $('<h3></h3>').addClass('oid').append($i).append($('<small></small>').addClass('blue').html(' ' + data.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
            var $btnDown = $('<a></a>').addClass('btn btn-minier btn-danger').html('下级');
            var $btnRole = $('<a></a>').addClass('btn btn-minier btn-yellow').html('角色');
            var $btnUser = $('<a></a>').addClass('btn btn-minier btn-success').html('人员');

            $divBtnWrap.append($btnRole).append($btnUser);

            if (data.url == ""){
                $divBtnWrap.append($btnDown);
            }

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnDown.click(function () {

                com.post(api.system.queryModuleByFatherModule, {
                    'module.system': parent.config.system,
                    'module.fatherModule.mid': data.mid
                }, function(res) {

                    if (data.level == 1) {
                        com.focusPage("#thr").hide();
                        com.focusPage("#one").removeClass('col-xs-12').addClass('col-xs-6');
                        com.focusPage("#two").addClass('col-xs-6');
                        Module.renderList(res.modules, 'two');
                    }

                    if (data.level == 2) {
                        com.focusPage("#thr").show();
                        com.focusPage("#one").removeClass('col-xs-6').addClass('col-xs-4');
                        com.focusPage("#two").removeClass('col-xs-6').addClass('col-xs-4');
                        com.focusPage("#thr").addClass('col-xs-4');
                        Module.renderList(res.modules, 'thr');
                    }
                });
            });

            $btnRole.click(function () {
                params.system.module = data;

                com.popup4page("#stockRecordPopUp", api.index.roleModule.url, "角色");
            });

            $btnUser.click(function () {
                params.system.module = data;

                com.popup4page("#stockRecordPopUp", api.index.userModule.url, "人员");
            });

            return $liLine;
        };

        var sortData = function(listData) {

            var menuArr = {
                level: []
            };

            if (!listData || !listData.length) {
                return;
            }

            $.each(listData, function(i, v) {

                menuArr.level[menuArr.level.length] = v;
            });

            $.each(menuArr, function(key, val) {

                menuArr[key] = val.sort(function(a, b) {

                    return a.order - b.order;
                });
            });

            return menuArr;
        };

        return {
            renderList: function(listData, tableId) {

                var $tableWrap = com.focusPage('#' + tableId).empty();

                var menuArr = sortData(listData);

                var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($tableWrap);;

                $.each(menuArr.level, function(i, v) {

                    var $li = creatLine(v);
                    $li.appendTo($ul);
                });

            },
        };
    })();

    function search() {

        com.post(api.system.queryModule, {
            'module.system': parent.config.system,
            'module.level': 1,
        }, function(res) {
            Module.renderList(res.modules, 'one');
            com.focusPage("#one").addClass('col-xs-12');
        }, null, false);
    }

    search();

});