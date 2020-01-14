$(function () {

    var aoods = {
        aid: null,
        gid: null,
        items: {
            name: com.focusPage("#name"),
            accessoriesType: com.focusPage("#accessoriesType"),
            bcompany: com.focusPage("#bcompany"),
        },

        edititem: {
            // editCheckup: com.focusPage("#editCheckup"),
            editAccessoriesType: com.focusPage("#editAccessoriesType"),
            editBcompany: com.focusPage("#editBcompany"),
            old: com.focusPage("#old"),
        },

        submitBtn: com.focusPage("#submitBtn"),
        editBtn: com.focusPage("#editBtn"),

        company: []
    };

    com.post(api.data.queryAccessoriesType, {}, function (res) {
        aoods.items.accessoriesType.bindData(res.accessoriesTypes, 'atid', 'name', true);
        com.focusPage('select[name="editAccessoriesType"]').bindData(res.accessoriesTypes, 'atid', 'name', false);
    });

    com.post(api.system.queryCompany, {}, function (res) {
        aoods.items.bcompany.bindData(res.companys, 'cid', 'name', true);
        com.focusPage('select[name="editBcompany"]').bindData(res.companys, 'cid', 'name', false);
    });

    // com.post(api.ds.construction, {}, function (res) {
    //     aoods.edititem.editCheckup.bindData(res.isCheckup, "key", "value", false);
    // }, null, false);

    aoods.submitBtn.click(function () {
        saveData();
    });

    aoods.editBtn.click(function () {
        editAoods();
    });

    com.initTypeahead("name", api.data.queryGoodsByName, "goods.name", {}, "goodes", "gid", "name", function (list, k, v) {
        $.each(list, function (index, val) {
            if (val.gid == k) {
                aoods.gid = k;
            }
        });

        return v;
    });

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.goods.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnCost = $('<a></a>').addClass('btn btn-minier btn-pink').html('成本');

            var propertyArr = [
                ["品牌: ", v.goods.brand, "grey"],
                ["品类: ", v.goods.category, "grey"],
                ["单位: ", v.goods.measurementUnit, "grey"],
                ["售价: ", v.goods.selling, "blue"],
                // ["验证标识: ", v.checkup == 0 ? "验证" : "通过", "red"],
                ["辅类: ", v.accessoriesType.name, "grey"],
                ["状态: ", v.status == 0 ? "启用" : "禁用", "red"],
                ["归属公司: ", v.bompany, "grey"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            var $btnStatus = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type": "checkbox"});
            var $span = $('<span></span>').addClass('lbl');

            $btnStatus.append($statusSwitch).append($span);
            $divBtnWrap.append($btnCost).append($btnEdit).append($btnStatus).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnCost.click(function () {
                params.aid = v.aid;
                com.popup4page("#optPopUp", "views/data/aoodsCost.html", "辅材成本");
            });

            $btnEdit.click(function () {
                com.cleanItems(aoods.edititem);
                aoods.aid = v.aid;
                // aoods.edititem.editCheckup.val(v.checkup);
                aoods.edititem.editAccessoriesType.val(v.accessoriesType.atid);
                aoods.edititem.old.val(v.bompany);
                com.popup4model("#editLayer", "编辑")
            });

            !v.status && $statusSwitch.prop("checked", true);
            $statusSwitch.switchBtn("status-lbl").on("click", function () {
                $statusSwitch.prop("checked") ? (updateStatus(v.aid, 0, function () {
                    $statusSwitch.removeAttr("checked")
                })) : (updateStatus(v.aid, 1, function () {
                    $statusSwitch.prop("checked")
                }));
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
        }
    })();

    var searcher = new Searcher();

    searcher.init(["aoodsGoodsName", "aoodsAname", "aoodsStatus", "aoodsBcompany"], "condList", api.data.pageAoods, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "aoodsPostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function () {
            com.cleanItems(aoods.items);
            com.popup4model("#addLayer", "添加")
        });

        return [$adda];
    });

    function saveData() {

        if (com.validate("formAoods", "right")) {
            return false;
        }

        var gid = aoods.gid;
        var atid = aoods.items.accessoriesType.val();
        var bcid = aoods.items.bcompany.val();

        var options = {
            "aoods.goods.gid": gid,
            "aoods.accessoriesType.atid": atid,
            "aoods.bompany": bcid,
        };

        com.post(api.data.addAoods, options, function (res) {
            com.closePopup();
            searcher.doSearch();
        });
    }

    function editAoods() {

        if (com.validate("editAoods", "right")) {
            return false;
        }

        var atid = aoods.edititem.editAccessoriesType.val();
        var bcid = aoods.edititem.editBcompany.val();
        // var checkup = aoods.edititem.editCheckup.val();

        var options = {
            "aoods.aid": aoods.aid,
            // "aoods.checkup": checkup,
            "aoods.accessoriesType.atid": atid,
            "aoods.bompany": bcid,
        };

        com.post(api.data.updateAoods, options, function (res) {
            com.closePopup();
            searcher.doSearch();
        });
    }

    function updateStatus(id, status, failcallBack) {

        com.post(api.data.updateAoodsForStatus, {
            "aoods.aid": id,
            "aoods.status": status
        }, function () {
            searcher.doSearch();
        }, function () {
            failcallBack && failcallBack();
        });
    }
});