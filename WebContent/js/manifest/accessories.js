$(function() {

    var accessories = {
        status: {},
        schedule: {},
        pageType: params.urlLoadParams.type,
    };

    com.post(api.ds.manifest, {}, function(res) {

        accessories.status = res.accessoriesStatus.split("key", "value");
    }, null, false);

    com.post(api.data.queryConstructionNode, {}, function(res) {

        accessories.schedule = res.constructionNodes.split("sort", "name");
    }, null, false);

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

        var createTableTitle = function() {

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col8');

            var titleName = '辅料单号,装修单号,创建人,创建时间,审批人,审批时间,施工环节,状态';

            $.each(titleName.split(','), function(i, v) {

                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

            return $ulTitle;
        };

        var creatLine = function(i, v, lastFlag) {

            var $liLine = $('<li></li>').addClass('line');
            var _label = $('<label></label>');

            var $input = $('<input>').attr({
                "type": "checkbox"
            }).addClass('ace ace-checkbox-2 hide').attr('data.aid', v.aid).attr({
                "data-pid": v.pid,
                "data-status": v.status
            });
            var _span = $('<span></span>').addClass('lbl grey bigger-150').css('font-weight', 'bold');

            _label.append($input).append(_span);

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(_label));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col8');

            var propertyArr = [[v.no, 'blue'], [v.orderId, 'blue'], [v.creater.userName, 'grey'], [v.createTime, 'green'], [v.approver.userName, 'grey'], [v.approverTime, 'green'], [accessories.schedule[v.schedule], 'red'], [accessories.status[v.status], 'red'], ];

            $.each(propertyArr, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option').appendTo($optionWrap);

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-info dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            var $btnView = $('<li></li>').append($('<a></a>').html('查看'));
            var $btnAdvance = $('<li></li>').append($('<a></a>').html('预出'));
            var $btnOut = $('<li></li>').append($('<a></a>').html('出货'));
            var $btnEdit = $('<li></li>').append($('<a></a>').html('修改'));
            var $btnRefuse = $('<li></li>').append($('<a></a>').html('拒绝'));
            var $btnReturn = $('<li></li>').append($('<a></a>').html('退货'));
            var $btnPrint = $('<li></li>').append($('<a></a>').html('打印'));
            var $btnDev = $('<li></li>').append($('<a></a>').html('到货'));
            var $btnQuota = $('<li></li>').append($('<a></a>').html('定额'));

            if (accessories.pageType == "advance") {
                v.status == 0 && ($btnUl.append($btnAdvance).append($btnEdit).append($btnRefuse));// 初始：出货，修改
                v.status == 1 && ($btnUl.append($btnPrint));// 出货：出货 修改 退回 打印
                v.status == 2 && ($btnUl.append($btnPrint));
            } else {
                v.status == 0 && ($btnUl.append($btnOut).append($btnEdit).append($btnRefuse));// 初始：出货，修改
                v.status == 1 && ($btnUl.append($btnOut).append($btnPrint));
                v.status == 2 && ($btnUl.append($btnView).append($btnDev).append($btnReturn).append($btnPrint).append($btnQuota));// 出货：出货 修改 退回 打印
            }

            v.status == 5 && ($btnUl.append($btnView));
            v.status == 6 && ($btnUl.append($btnView).append($btnReturn).append($btnPrint));
            v.status != 6 && ($btnUl.append($btnEdit));

            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            $btnView.click(function() {

                if (v.status == 0) {
                    com.showAlert(com.warning, "辅料单状态不可操作");
                    return false;
                }

                params.manifest.aid = v.aid;

                com.popup4page('#layerPopUp', "views/manifest/accessories4view.html", "辅料单 : " + v.no);
            });

            $btnDev.click(function() {

                if (v.status != 2) {
                    com.showAlert(com.warning, "辅料单状态不可操作");
                    return false;
                }

                com.showConfirm("确认到货?", function() {

                    com.post(api.inventory.deliveAccessories, {
                        "accessories.aid": v.aid
                    }, function() {

                        com.showAlert(com.info, "操作成功");
                        searcher.doSearch();
                    })
                })

            });

            $btnOut.click(function() {

                if (v.status != 0 && v.status != 1) {
                    com.showAlert(com.warning, "辅料单状态不可操作");
                    return false;
                }

                params.manifest.aid = v.aid;
                params.manifest.orderId = v.orderId;

                com.popup4page('#layerPopUp', "views/manifest/accessories2out.html", "辅料单 : " + v.no);
            });

            $btnRefuse.click(function() {

                if (v.status != 0) {
                    com.showAlert(com.warning, "辅料单状态不可操作");
                    return false;
                }

                com.showConfirm("是否确认拒绝辅料单", function() {

                    com.post(api.inventory.refuseAccessories, {
                        "accessories.aid": v.aid
                    }, function() {

                        com.showAlert(com.info, "操作成功");
                        searcher.doSearch();
                    })
                })
            });

            $btnEdit.click(function() {

                if (v.status != 0) {
                    com.showAlert(com.warning, "辅料单状态不可操作");
                    return false;
                }

                params.manifest.aid = v.aid;
                params.manifest.orderId = v.orderId;

                com.popup4page('#layerPopUp', "views/manifest/accessories2edit.html", "辅料单 : " + v.no);
            });

            $btnAdvance.click(function() {

                if (v.status != 0) {
                    com.showAlert(com.warning, "辅料单状态不可操作");
                    return false;
                }

                com.showConfirm("是否确认预出辅料单", function() {

                    com.post(api.inventory.preoutAccessories, {
                        "accessories.aid": v.aid
                    }, function() {

                        com.showAlert(com.info, "操作成功");
                        searcher.doSearch();
                    })
                })
            });

            $btnReturn.click(function() {

                params.manifest.aid = v.aid;
                params.manifest.accessories = v;

                com.popup4page('#layerPopUp', "views/manifest/accessories4refund.html", "辅料单 : " + v.no);
            });

            $btnPrint.click(function() {

                params.manifest.accessories = v;

                printAccessoriesItem(v.aid, v.no);
            });

            $btnQuota.click(function() {

                params.quotation.orderId = v.orderId;

                com.popup4page('#layerPopUp', "views/manifest/quotaItem.html", "辅料单 : " + v.no);
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
    var _Array = ['inventory-accessories-orderId', 'inventory-accessories-no', 'inventory-accessories-createrName', 'inventory-accessories-approverName', 'inventory-accessories-createTime', 'inventory-accessories-approverTime', 'inventory-accessories-stauts'];

    searcher.init(_Array, "condList", api.inventory.pageAccessories, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "accessoriesPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-success btn-minier pull-left').attr('name', 'shipment').css('margin-top', '-2px').html('批量出货');

        $adda.click(function() {

            batchout();
        });

        return [];
    }, 'resultList');

    function batchout() {

        var $checks = $('input[type="checkbox"]:checked', '.line');
        var $aids = [];

        if ($checks.length == 0) {
            com.showAlert(com.warning, "请选择辅料单");
            return false;
        }

        for ( var i = 0; i < $checks.length; i++) {

            var $check = $checks[i];

            if ($check.attr("data-status") != 0) {
                com.showAlert(com.warning, "辅料单状态不可操作");
                return false;
            }

            $aids.push($check.attr("data-aid"));
        }

        params.manifest.aids = $aids;

        com.popup4page('#layerPopUp', "views/manifest/accessories2batchout.html", "批量出货", function() {

            searcher.doSearch();
        });
    }

    // 打印货单项
    function printAccessoriesItem(aid, no) {

        com.popup4frame("辅料单号" + no, api.index.accessoriesPrintIndex.url, function() {

            parent.layer.getFrameIndex(window.name);
            searcher.doSearch();
        }, null, function(layero) {

            com.post(api.inventory.updateAccessoriesForPrint, {
                "accessories.aid": aid
            }, function(res) {

                layero.find("iframe").contents().find("#printNum").text("打印次数:" + res.accessories.printnum)
            }, null, false)
        });
    }

});
