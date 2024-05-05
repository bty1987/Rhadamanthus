jQuery(function ($) {

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId).empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html("验收");

            var propertyArr = [
                ["装修单: ", v.orderId, "blue", function(btn) {

                    tools.decoration.info(btn, v.orderId);
                }],
                ["楼盘: ", v.house.village.name, "grey", function(btn) {

                    tools.house.info(btn, v.house.hid);
                }],
                ["楼号: ", v.house.houseNumber, "grey"],
                ["客户: ", v.customer.name, "grey", function(btn) {

                    tools.customer.info(btn, v.customer.cid);
                }],
                ["设计部门:", v.designer.dept.name, "grey", function(btn) {

                    tools.department.info(btn, v.designer.dept.did);
                }],
                ["设计师:", v.designer.userName, "grey", function(btn) {

                    tools.personel.info(btn, v.designer.userId);
                }],
                ["监理:", v.supervisor ? v.supervisor.userName : "", "grey", function(btn) {

                    tools.personel.info(btn, v.supervisor.userId);
                }],
                ["面积:", v.house.buildArea, "blue"],
                ["合同额: ", v.orderTotalPrice, "blue"],
                ["报价版本: ", v.version.name, "grey"],
                ["进度:", constant.decoration().decoration.projectStatus.keys[v.projectStatus], "red"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                var $b = $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);

                if (value[3]) {
                    $b.click(function() {

                        value[3]($b);
                    });
                }

                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnView).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnView.click(function () {
                viewAcceptanceDetailIndex(v.orderId);
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

    var searcher = new Searcher();
    searcher.init(['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-designer', 'construction-supervisor', 'decoration-projectStatus', 'construction-acceptanceFlag'], "condList", api.construction.pageConstructionForAcceptance, function (list) {
        displayFunc.init('resultList', list);
    }, "pagenation", "acceptanceSeacherSeacherPostData");

    function viewAcceptanceDetailIndex(orderId) {
        params.construction.orderId = orderId;
        com.popup4page("#stockRecordPopUp","/views/construction/acceptance4detail.html","查看");
    }

});