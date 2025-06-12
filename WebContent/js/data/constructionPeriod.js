jQuery(function($) {

    var constructionPeriod = {

        cpid: null,

        btns: {
            saveBtn: com.focusPage("#saveBtn").bindClick(saveData),
        },

        modals: {
            updatePeriodModal: com.focusPage("#updatePeriodModal"),
        },

        items: {

            name: com.focusPage("#name"),
            typeness: com.focusPage("#typeness"),
            upperArea: com.focusPage("#upperArea"),
            lowerArea: com.focusPage("#lowerArea"),
            period: com.focusPage("#period"),
        },

    };

    constructionPeriod.items.typeness.bindData(constant.decoration().decoration.typeness.datas, "key", "value").prop("-1", false);

    constructionPeriod.modals.updatePeriodModal.on("hide.bs.modal", function() {

        com.cleanItems(constructionPeriod.items);
        com.clearValidator();
        com.closeTip();
    });

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (!listData || listData.length == 0)
                return false;

            $.each(listData, function(i, v) {

                creatLine(v).appendTo($ul);
            });

            $ul.appendTo($tableWrap);
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid')
            var $title = $('<small></small>').addClass('blue').html(' ' + v.name);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var $invalid = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({
                "type": "checkbox"
            });
            var $span = $('<span></span>').addClass('lbl status-lbl');
            var $btnUpdate = $("<a></a>").addClass("btn btn-minier btn-yellow").html("编辑");
            var $btnNode = $("<a></a>").addClass("btn btn-minier btn-yellow").html("节点");
            var propertyArr = [["工程名称: ", v.name, "grey"], ["上面积: ", v.upperArea, "blue"], ["下面积: ", v.lowerArea, "blue"], ["工期: ", v.period, "blue"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $invalid.append($statusSwitch).append($span);
            $liLine.append($h3).append($ulProperty);
            $btnDiv.append($invalid).append($btnUpdate);
            $btnDiv.append($btnUpdate).append($btnNode);
            $h3.append($title).append($btnDiv);

            $btnUpdate.click(function() {

                constructionPeriod.cpid = v.cpid;

                constructionPeriod.items.name.val(v.name);
                constructionPeriod.items.typeness.val(v.typeness);
                constructionPeriod.items.upperArea.val(v.upperArea);
                constructionPeriod.items.lowerArea.val(v.lowerArea);
                constructionPeriod.items.period.val(v.period);

                constructionPeriod.modals.updatePeriodModal.modal("show");
            });

            $btnNode.click(function() {

                params.data.constructionPeriod = v;

                com.popup4page("#periodPopUp", api.index.constructionNodeIndex.url, "工程节点工期 ");
            });

            !v.status && $statusSwitch.prop("checked", true);

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
        }
    })();

    var searcher = new Searcher();

    searcher.init(["data-constructionPeriod-name"], "periodCondList", api.data.pageConstructionPeriod, function(data) {

        displayFunc.init('periodResultList', data);
    }, "periodPagenation", "constructionPeriodPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addConstructionPeriod').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage('#addConstructionPeriod').click(function() {

        constructionPeriod.cpid = null;

        constructionPeriod.modals.updatePeriodModal.modal("show");
    });

    function saveData() {

        if (com.validate('updatePeriodModal')) {
            return false;
        }

        var url = api.data.addConstructionPeriod;

        var options = {
            'constructionPeriod.name': constructionPeriod.items.name.val(),
            "constructionPeriod.typeness": constructionPeriod.items.typeness.val(),
            "constructionPeriod.upperArea": constructionPeriod.items.upperArea.val(),
            "constructionPeriod.lowerArea": constructionPeriod.items.lowerArea.val(),
            "constructionPeriod.period": constructionPeriod.items.period.val(),
        };

        if (constructionPeriod.cpid) {
            url = api.data.updateConstructionPeriod;
            options["constructionPeriod.cpid"] = constructionPeriod.cpid;
        }

        com.post(url, options, function(res) {

            com.closePopup();
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();

            constructionPeriod.modals.updatePeriodModal.modal("hide");
        });
    }

});