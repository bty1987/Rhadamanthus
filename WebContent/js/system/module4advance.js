$(function() {

    var module = {
        level1: [],
        level2: [],
        level3: []
    };

    var Module = (function() {

        var creatLine = function (data) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $i = $('<i></i>').addClass(data.icon);
            var $h3 = $('<h3></h3>').addClass('oid').append($i).append($('<small></small>').addClass('blue').html(' ' + data.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            com.post(api.system.queryModuleByFatherModule, {
            	'module.system': parent.config.system,
                'module.fatherModule.mid': data.mid
            }, function(res) {

            	if (res.modules.length != 0){
            		var $iTag = $('<i class="icon-chevron-left pull-right"></i>').appendTo($h3);
            	}

            });

            $h3.click(function () {

                com.post(api.system.queryModuleByFatherModule, {
                	'module.system': parent.config.system,
                    'module.fatherModule.mid': data.mid
                }, function(res) {

                    if (data.level == 1) {

                        module.level2 = [];
                        module.level3 = [];
                        var menuArr = sortData(res.modules);
                        module.level2 = menuArr.level2;
                        Module.renderList(menuArr.level2, 'moduleTable');
                    }

                    if (data.level == 2 && res.modules.length != 0) {

                    	var menuArr = sortData(res.modules);
                    	module.level3 = menuArr.level3;
                        Module.renderList(menuArr.level3, 'moduleTable');
                    }
                });
            });

            return $liLine;
        };

        var sortData = function(listData) {

            var menuArr = {
                level1: [],
                level2: [],
                level3: []
            };

            if (!listData || !listData.length) {
                return;
            }

            $.each(listData, function(i, v) {

                menuArr['level' + v.level][menuArr['level' + v.level].length] = v;
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

                if (module.level1.length == 0 && module.level2.length == 0 && module.level3.length == 0) {

                	var menuArr = sortData(listData);
                	module.level1 = menuArr.level1;

                    var $oneDiv = $('<div class="col-xs-12"></div>').appendTo($tableWrap);
                    var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($oneDiv);

                    $.each(menuArr.level1, function(i, v) {

                        var $li = creatLine(v);
                        $li.appendTo($ul);
                    });
                }

                if (module.level1.length && module.level2.length && module.level3.length == 0) {

                    var $oneDiv = $('<div class="col-xs-6"></div>').appendTo($tableWrap);
                    var $oneUl = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($oneDiv);

                    $.each(module.level1, function(i, v) {

                        var $li = creatLine(v);
                        $li.appendTo($oneUl);
                    });

                    var $twoDiv = $('<div class="col-xs-6"></div>').appendTo($tableWrap);
                    var $twoUl = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($twoDiv);

                    $.each(listData, function(i, v) {

                        var $li = creatLine(v);
                        $li.appendTo($twoUl);
                    });
                }

                if (module.level1.length && module.level2.length && module.level3.length) {

                    var $oneDiv = $('<div class="col-xs-4"></div>').appendTo($tableWrap);
                    var $oneUl = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($oneDiv);

                    $.each(module.level1, function(i, v) {

                        var $li = creatLine(v);
                        $li.appendTo($oneUl);
                    });

                    var $twoDiv = $('<div class="col-xs-4"></div>').appendTo($tableWrap);
                    var $twoUl = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($twoDiv);

                    $.each(module.level2, function(i, v) {

                        var $li = creatLine(v);
                        $li.appendTo($twoUl);
                    });

                    var $thrDiv = $('<div class="col-xs-4"></div>').appendTo($tableWrap);
                    var $thrUl = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($thrDiv);

                    $.each(listData, function(i, v) {

                        var $li = creatLine(v);
                        $li.appendTo($thrUl);
                    });

                }
            },
        };
    })();

    function search() {

        com.post(api.system.queryModule, {
            'module.system': parent.config.system,
            'module.level': 1,
        }, function(res) {
            Module.renderList(res.modules, 'moduleTable');
        }, null, false);
    }

    search();

});