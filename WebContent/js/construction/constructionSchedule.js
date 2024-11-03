jQuery(function($) {

    var constructionSchedule = {

        modals: {
            setupModal: com.focusPage("#setupModal")
        },
        decorationStatus: {},
        scheduleStatus: {},

    };

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);

            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {

                $.each(listData, function(i, v) {

                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var propertyArr = [
                ["装修单: ", v.decoration.orderId, "blue", function(btn) {

                    tools.decoration.info(btn, v.decoration.orderId);
                }],
                ["楼盘: ", v.decoration.house.village.name, "grey", function(btn) {

                    tools.house.info(btn, v.decoration.house.hid);
                }],
                ["楼号: ", v.decoration.house.houseNumber, "grey"],
                ["客户: ", v.decoration.customer.name, "grey", function(btn) {

                    tools.customer.info(btn, v.decoration.customer.cid);
                }],
                ["设计师:", v.decoration.designer.userName, "grey", function(btn) {

                    tools.personel.info(btn, v.decoration.designer.userId);
                }],
                ["业务员:", v.decoration.salesman.currentName, "grey", function(btn) {

                    tools.personel.info(btn, v.decoration.salesman.userId);
                }],
                ["监理:", v.decoration.supervisor ? v.decoration.supervisor.userName : "", "grey", function(btn) {

                    tools.personel.info(btn, v.decoration.supervisor.userId);
                }],
                ["面积:", v.decoration.house.buildArea, "blue"],
                ["合同额: ", v.decoration.orderTotalPrice, "blue"],
                ["报价版本: ", v.decoration.version.name, "grey"],
                ["签单时间: ", v.decoration.contractTime, "green"],
                ["装修工程进度: ", constant.decoration().decoration.projectStatus.keys[v.decoration.projectStatus], "red"],
                ["工程进度:", constant.data().construction.node.keys[v.cnid], "red"],
                ["开工时间: ", v.startTime, "green"],
                ["完工时间: ", v.endTime, "green"],
                ["环节状态:", constant.data().construction.node.keys[v.status], "red"]
            ];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                var $b = $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);

                if (value[3]) {
                    $b.click(function() {
                        value[3]($b);
                    });
                }

                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

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

    searcher.init(["decoration-orderId", "decoration-village", "decoration-houseNumber", "decoration-designer", "decoration-projectStatus", "construction-schedule-createTime", "construction-schedule-startTime", "construction-schedule-endTime", "construction-schedule-enterTime", "construction-schedule-leaveTime"], "condList", api.construction.pageConstructionSchedule, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "drawLinePersonPostData");

});
