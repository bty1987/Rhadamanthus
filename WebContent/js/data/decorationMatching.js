jQuery(function($) {

    var decorationMatching = {

        btns: {
            addBtn: com.focusPage("#addBtn"),
            saveBtn: com.focusPage("#saveBtn")
        },

        modals: {
            decorationMatchingModal: com.focusPage("#decorationMatchingModal")
        },

        items: {
            name: com.focusPage("#name"),
            typeness: com.focusPage("#typeness"),
            base: com.focusPage("#base"),
            discount: com.focusPage("#discount"),
            material: com.focusPage("#material"),
            service: com.focusPage("#service"),
            vision: com.focusPage("#vision"),
            trafficDiscount: com.focusPage("#trafficDiscount"),
            manageDiscount: com.focusPage("#manageDiscount"),
            taxDiscount: com.focusPage("input[name=taxDiscount]"),
            manageTaxDiscount: com.focusPage("#manageTaxDiscount"),
            totalTaxDiscount: com.focusPage("#totalTaxDiscount"),
            isShow: com.focusPage("#isShow"),
            comment: com.focusPage("#comment")
        },

        editFlg: false,
        type: {},
        typeness: {},
        visionName: [],
        visionData: {},
        decorationMatchingType: {},
        decorationMatchingVision: {},
        isShow: ["显示", "隐藏"],
        discount: ["不打折", "打折"],
        taxDiscount: ["管理税金", "总额税金"]

    };

    com.post(api.ds.data, {}, function(res) {

        decorationMatching.decorationMatchingVision = res.visionType.split("key", "value");
        decorationMatching.visionData = res.visionType;
    });

    com.post(api.ds.decoration, {}, function(res) {

        decorationMatching.items.typeness.bindData(res.typeness, "key", "value");
        decorationMatching.decorationMatchingType = res.typeness.split("key", "value");

        $.each(res.typeness, function(i, v) {

            decorationMatching.type[v.key] = v.type;
            decorationMatching.typeness["typeness[" + i + "]"] = v.key;
        });

        reloadDecorationMatching();
    });

    decorationMatching.btns.saveBtn.bindClick(saveData);

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId).empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    var $liLine = creatLine(v);
                    $liLine.appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass("oid").append($('<small></small>').addClass('blue').html(v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnUpdate = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('更新');

            visionKeyAndName(v);
            decorationMatching.visionName = [];

            $.each(decorationMatching.visionKey, function(j, k) {

                if (!decorationMatching.visionName.includes(decorationMatching.decorationMatchingVision[k])) {
                    decorationMatching.visionName.push(decorationMatching.visionName.length > 1 ? "/" : "");
                    decorationMatching.visionName.push(decorationMatching.decorationMatchingVision[k]);
                }
            });

            var propertyArr = [["类型:", decorationMatching.decorationMatchingType[v.typeness], "grey"], ["基数:", v.base, "blue"], ["折扣:", v.discount, "blue"], ["主材配比:", v.material, "blue"], ["服务配比:", v.service, "blue"], ["显示位置:", decorationMatching.visionName, "grey"], ["默认显示:", decorationMatching.isShow[v.isShow], "red"], ["车运费折扣:", decorationMatching.discount[v.trafficDiscount], "red"], ["管理费折扣:", decorationMatching.discount[v.manageDiscount], "red"], ["税金折扣:", decorationMatching.taxDiscount[v.taxDiscount], "red"], ["说明:", v.comment, "grey"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong style="font-size:15px ; padding-bottom: 50px;"  ></strong>').html(value[0]).appendTo($liProperty);
                $('<b style="font-size:15px"></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnUpdate).appendTo($h3);
            $liLine.append($h3).append($ulProperty);

            $btnUpdate.click(function() {

                updateData(v);
            });

            return $liLine;
        };

        return {
            init: function(tableId, listData) {

                if (!listData.length) {
                    var $resultList = com.focusPage('#' + tableId).addClass('dz-default dz-message').empty();
                    var $h3 = $('<h3 style="font-size:22px;"></h3>').addClass('blue').html(params.company.name).appendTo($resultList);
                    var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
                    var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
                    var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
                    return $resultList;
                }

                renderList(tableId, listData);
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        };
    })();

    function reloadDecorationMatching() {

        var resultList = com.focusPage('#resultList').empty();

        com.post(api.data.queryDecorationMatching, decorationMatching.typeness, function(data) {

            displayFunc.init('resultList', data.decorationMatchings);
        });
    };

    decorationMatching.btns.addBtn.click(function() {

        com.cleanItems(decorationMatching.items);
        decorationMatching.editFlg = true;
        decorationMatching.visionKey = [];
        visionData(decorationMatching.visionData);
        decorationMatching.modals.decorationMatchingModal.modal("show");
    });

    function updateData(v) {

        decorationMatching.editFlg = false;
        visionKeyAndName(v);

        visionData(decorationMatching.visionData);

        decorationMatching.items.isShow.prop('checked', com.isOrNotType[v.isShow == 0 ? "是" : "否"]);
        decorationMatching.items.trafficDiscount.prop('checked', com.isOrNotType[v.trafficDiscount == 0 ? "否" : "是"]);
        decorationMatching.items.manageDiscount.prop('checked', com.isOrNotType[v.manageDiscount == 0 ? "否" : "是"]);
        decorationMatching.items.manageTaxDiscount.prop("checked", v.taxDiscount == 0);
        decorationMatching.items.totalTaxDiscount.prop("checked", v.taxDiscount == 1);
        decorationMatching.items.dmid = v.dmid;
        decorationMatching.items.name.val(v.name);
        decorationMatching.items.typeness.val(v.typeness);
        decorationMatching.items.base.val(v.base);
        decorationMatching.items.discount.val(v.discount);
        decorationMatching.items.material.val(v.material);
        decorationMatching.items.service.val(v.service);
        decorationMatching.items.comment.val(v.comment);

        decorationMatching.modals.decorationMatchingModal.modal("show");
    }

    function visionData(data) {

        decorationMatching.items.vision.empty();

        $.each(data, function(i, v) {

            var $div = $('<div></div>').addClass('col-sm-6').attr("name", "function");
            var $label = $('<label></label>');
            var $input = $('<input>').attr({
                "type": "checkbox",
                "name": "visionKey",
                "class": "ace"
            }).val(v.key);
            var $span = $('<span></span>').addClass('lbl blue').text(v.value);

            $label.append($input).append($span).appendTo($div);

            $div.appendTo(decorationMatching.items.vision);

            if (decorationMatching.visionKey.indexOf(parseInt(v.key)) != -1) {
                $input.attr("checked", true);
            }

        });
    }

    function saveData() {

        if (com.validate("decorationMatchingForm"))
            return false;
        var $inputs = com.focusPage('input[name="visionKey"]:checked');

        var url, options;
        decorationMatching.number = 0;

        $.each($inputs, function(i, v) {

            decorationMatching.number = decorationMatching.number + parseInt($(v).val());
        });

        options = {
            "decorationMatching.name": decorationMatching.items.name.val(),
            "decorationMatching.type": decorationMatching.type[decorationMatching.items.typeness.val()],
            "decorationMatching.typeness": decorationMatching.items.typeness.val(),
            "decorationMatching.base": decorationMatching.items.base.val(),
            "decorationMatching.discount": decorationMatching.items.discount.val(),
            "decorationMatching.material": decorationMatching.items.material.val(),
            "decorationMatching.service": decorationMatching.items.service.val(),
            "decorationMatching.vision": decorationMatching.number,
            "decorationMatching.comment": decorationMatching.items.comment.val(),
            "decorationMatching.isShow": decorationMatching.items.isShow.prop("checked") ? 0 : 1,
            "decorationMatching.trafficDiscount": decorationMatching.items.trafficDiscount.prop("checked") ? 1 : 0,
            "decorationMatching.manageDiscount": decorationMatching.items.manageDiscount.prop("checked") ? 1 : 0,
            "decorationMatching.taxDiscount": decorationMatching.items.taxDiscount.prop("checked") ? 0 : 1
        };

        decorationMatching.editFlg ? url = api.data.addDecorationMatching : url = api.data.updateDecorationMatching, options["decorationMatching.dmid"] = decorationMatching.items.dmid;

        com.post(url, options, function(res) {

            com.closePopup();
            com.showAlert(com.info, "操作成功");
            reloadDecorationMatching();
        }, null, false);

        decorationMatching.modals.decorationMatchingModal.modal("hide");
    }

    function visionKeyAndName(v) {

        decorationMatching.visionKey = [];

        switch (v.vision) {
            case 1:
                decorationMatching.visionKey.push(1);
                break;
            case 2:
                decorationMatching.visionKey.push(2);
                break;
            case 3:
                decorationMatching.visionKey.push(1, 2);
                break;
            case 4:
                decorationMatching.visionKey.push(4);
                break;
            case 5:
                decorationMatching.visionKey.push(1, 4);
                break;
            case 6:
                decorationMatching.visionKey.push(2, 4);
                break;
            case 7:
                decorationMatching.visionKey.push(1, 2, 4);
                break;
            case 8:
                decorationMatching.visionKey.push(8);
                break;
            case 9:
                decorationMatching.visionKey.push(1, 8);
                break;
            case 10:
                decorationMatching.visionKey.push(2, 8);
                break;
            case 11:
                decorationMatching.visionKey.push(1, 2, 8);
                break;
            case 12:
                decorationMatching.visionKey.push(4, 8);
                break;
            case 13:
                decorationMatching.visionKey.push(1, 4, 8);
                break;
            case 14:
                decorationMatching.visionKey.push(2, 4, 8);
                break;
            case 15:
                decorationMatching.visionKey.push(1, 2, 4, 8);
                break;
        }
        ;
    }
});