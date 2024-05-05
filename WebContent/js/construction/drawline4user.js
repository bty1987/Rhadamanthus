jQuery(function($) {

    var drawline = {

        btns: {
            cancelBtn: com.focusPage("#cancelBtn"),
            deployedBtn: com.focusPage("#deployedBtn")
        },

        modals: {
            setupModal: com.focusPage("#setupModal")
        },

        items: {
            orderId: com.focusPage("#orderId"),
            conpanyName: com.focusPage("#conpanyName"),
            conpany: com.focusPage("#conpany"),
        },

        decorationStatus: {},
        constructionNodes: {},
    };

    drawline.btns.deployedBtn.bindClick(deployed);

    drawline.modals.setupModal.on("hide.bs.modal", function() {

        com.cleanItems(drawline.items);
        com.cleanTypeahead("supervisor");
        com.cleanTypeahead("qualiter1");
        com.cleanTypeahead("qualiter2");
        com.cleanTypeahead("qualiter3");
        com.cleanTypeahead("qualiter4");
        com.cleanTypeahead("qualiter5");
        com.closeTip();
    });

    com.initTypeahead('supervisor', api.personel.queryUserByPinyin, "pinyinName", {
        "departmentType.name": "工程部",
        "user.status": 0
    }, "autoFillKeyValue", "key", "value", null);

    com.initTypeahead('qualiter1', api.personel.queryUserByPinyin, "pinyinName", {"departmentType.name" : "", "user.status" : 0}, "autoFillKeyValue", "key", "value", null);
    com.initTypeahead('qualiter2', api.personel.queryUserByPinyin, "pinyinName", {"departmentType.name" : "", "user.status" : 0}, "autoFillKeyValue", "key", "value", null);
    com.initTypeahead('qualiter3', api.personel.queryUserByPinyin, "pinyinName", {"departmentType.name" : "", "user.status" : 0}, "autoFillKeyValue", "key", "value", null);
    com.initTypeahead('qualiter4', api.personel.queryUserByPinyin, "pinyinName", {"departmentType.name" : "", "user.status" : 0}, "autoFillKeyValue", "key", "value", null);
    com.initTypeahead('qualiter5', api.personel.queryUserByPinyin, "pinyinName", {"departmentType.name" : "", "user.status" : 0}, "autoFillKeyValue", "key", "value", null);

    com.post(api.system.queryCompany, {
        "company.atttype": "3"
    }, function(res) {

        res.companys.unshift("");
        drawline.items.conpany.bindData(res.companys, "cid", "name", false);
    });

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

            var $btnDeploy = $('<a></a>').addClass('btn btn-minier btn-yellow').html('人员部署');

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
                ["设计师: ", v.designer.currentName, "grey", function(btn) {

                    tools.personel.info(btn, v.designer.userId);
                }],
                ["监理: ", v.supervisor == null ? "" : v.supervisor.currentName, "grey", function(btn) {

                    tools.personel.info(btn, v.supervisor.userId);
                }],
                ["面积: ", v.house.buildArea, "blue"],
                ["合同额: ", v.orderTotalPrice, "blue"],
                ["报价版本: ", v.version.name, "grey"],
                ["创建时间: ", v.createTime, "green"],
                ["进度: ", constant.decoration().decoration.projectStatus.keys[v.projectStatus], "red"],
                ["状态: ", constant.decoration().decoration.status.keys[v.status], "red"]
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

            $divBtnWrap.append($btnDeploy).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnDeploy.click(function() {

                showSetup(v);
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

    searcher.init(['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-designer'], "condList", api.construction.pageConstruction, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "drawLinePersonPostData");

    function showSetup(v) {

        var options = {
            "construction.orderId": v.orderId
        };

        var decoration = null;

        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": v.orderId
        }, function(res) {

            decoration = res.decoration;
        }, null, false);

        com.post(api.system.queryCompanyByCid, {
            "company.cid": decoration.conpany
        }, function(res) {

            drawline.items.conpanyName.html(res.company.name);
        });

        com.post(api.construction.queryConstructionByOrderId, options, function(res) {

            if (res.construction.supervisor) {
                com.updateTypeahead("supervisor", res.construction.supervisor.userId, res.construction.supervisor.userName);
            } else {
                com.cleanTypeahead("supervisor");
            }

            com.post(api.construction.queryQualiter, {
                "qualiter.decoration.orderId": res.construction.orderId
            }, function(e) {

                $.each(e.qualiters, function(i, v) {

                    if (v.user) {

                        if (v.schedule == 7) {
                            com.updateTypeahead("qualiter1", v.user.userId, v.user.userName);
                        }
                        if (v.schedule == 8) {
                            com.updateTypeahead("qualiter2", v.user.userId, v.user.userName);
                        }
                        if (v.schedule == 9) {
                            com.updateTypeahead("qualiter3", v.user.userId, v.user.userName);
                        }
                        if (v.schedule == 11) {
                            com.updateTypeahead("qualiter4", v.user.userId, v.user.userName);
                        }
                        if (v.schedule == 12) {
                            com.updateTypeahead("qualiter5", v.user.userId, v.user.userName);
                        }
                    } else {
                        com.cleanTypeahead("qualiter1");
                        com.cleanTypeahead("qualiter2");
                        com.cleanTypeahead("qualiter3");
                        com.cleanTypeahead("qualiter4");
                        com.cleanTypeahead("qualiter5");
                    }
                });

            });

            drawline.modals.setupModal.modal("show");
        });

        drawline.items.orderId = v.orderId;
    }

    function deployed() {

        if (com.validate("setupModal")) {
            return false;
        }

        var options = {
            "construction.orderId": drawline.items.orderId,
            "construction.supervisor.userId": com.typeahead("supervisor"),

            "qualiters[0].user.userId": com.typeahead("qualiter1"),
            "qualiters[0].schedule": 7,

            "qualiters[1].user.userId": com.typeahead("qualiter2"),
            "qualiters[1].schedule": 8,

            "qualiters[2].user.userId": com.typeahead("qualiter3"),
            "qualiters[2].schedule": 9,

            "qualiters[3].user.userId": com.typeahead("qualiter4"),
            "qualiters[3].schedule": 11,

            "qualiters[4].user.userId": com.typeahead("qualiter5"),
            "qualiters[4].schedule": 12
        };

        if (drawline.items.conpany.val()) {
            options["construction.decoration.conpany"] = drawline.items.conpany.val();
        }

        com.post(api.construction.updateConstructionByOrderId, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();

            drawline.modals.setupModal.modal("hide");
        });
    }
});
