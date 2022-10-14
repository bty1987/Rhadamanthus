jQuery(function($) {

    var vprize = {

        saveBtn: com.focusPage("#saveBtn"),

        modals: {
            addVprizeModal: com.focusPage("#addVprizeModal")
        },
        items: {
            vactivity: com.focusPage("#vactivity"),
            name: com.focusPage("#name"),
            price: com.focusPage("#price"),
            unit: com.focusPage("#unit")
        },

        vpid: null
    };

    vprize.saveBtn.bindClick(saveData);

    com.post(api.information.queryVactivity, {}, function(res) {

        vprize.items.vactivity.bindData(res.vactivitys, "vaid", "name");
    });

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
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

            var $btnViews = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');

            var propertyArr = [["名称: ", v.name, "grey"], ["价格: ", v.price, "blue"], ["单位: ", v.unit, "grey"], ["状态: ", v.status == constant.information().vprize.STATUS_INIT_INT ? "启用" : "禁用", "red"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnViews).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnViews.click(function() {

                vprize.items.vactivity.attr("disabled", "disabled");
                vprize.vpid = v.vpid;

                vprize.items.vactivity.val(v.vaid);
                vprize.items.name.val(v.name);
                vprize.items.price.val(v.price);
                vprize.items.unit.val(v.unit);

                vprize.modals.addVprizeModal.modal("show");
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

    searcher.init(["information-v-prize-name", "information-v-prize-status"], "condList", api.information.pageVprize, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "vprizePostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addVprize').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage('#addVprize', '#pagenation').click(function() {

        vprize.items.vactivity.removeAttr("disabled", "disabled");
        vprize.vpid = null;

        com.clearValidator();
        com.cleanItems(vprize.items);

        vprize.modals.addVprizeModal.modal("show");
    });

    function saveData() {

        if (com.validate("addVprizeModal")) {
            return false;
        }

        var url = api.information.addVprize;
        var options = {
            'vprize.vaid': vprize.items.vactivity.val(),
            'vprize.name': vprize.items.name.val(),
            'vprize.price': vprize.items.price.val(),
            'vprize.unit': vprize.items.unit.val()
        };

        if (vprize.vpid) {
            url = api.information.updateVprize;

            options["vprize.vpid"] = vprize.vpid;
        }

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
            vprize.modals.addVprizeModal.modal("hide");
        });
    }

});
