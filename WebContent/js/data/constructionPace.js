jQuery(function($) {

    var constructionPace = {

        cpid: null,

        btns: {
            saveBtn: com.focusPage("#saveBtn").bindClick(saveData),
        },

        modals: {
            updatePaceModal: com.focusPage("#updatePaceModal"),
        },

        items: {

            name: com.focusPage("#name"),
            typeness: com.focusPage("#typeness"),
            upperArea: com.focusPage("#upperArea"),
            lowerArea: com.focusPage("#lowerArea"),
            period: com.focusPage("#period"),
            designPeriod: com.focusPage("#designPeriod"),
        },

    };

    constructionPace.items.typeness.bindData(constant.decoration().decoration.typeness.datas, "key", "value").prop("-1", false);

    constructionPace.modals.updatePaceModal.on("hide.bs.modal", function() {

        com.cleanItems(constructionPace.items);
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
            var propertyArr = [["工程名称: ", v.name, "grey"], ["上面积: ", v.upperArea, "blue"], ["下面积: ", v.lowerArea, "blue"], ["工期: ", v.period, "blue"], ["设计工期: ", v.designPeriod, "blue"]];

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

                constructionPace.cpid = v.cpid;

                constructionPace.items.name.val(v.name);
                constructionPace.items.typeness.val(v.typeness);
                constructionPace.items.upperArea.val(v.upperArea);
                constructionPace.items.lowerArea.val(v.lowerArea);
                constructionPace.items.period.val(v.period);
                constructionPace.items.designPeriod.val(v.designPeriod);

                constructionPace.modals.updatePaceModal.modal("show");
            });

            $btnNode.click(function() {

                params.data.constructionPace = v;

                com.popup4page("#pacePopUp", "/views/data/constructionPaceNode.html", "工程节点工期 ");
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

    searcher.init(["data-constructionPace-name"], "paceCondList", api.data.pageConstructionPace, function(data) {
        displayFunc.init('paceResultList', data);
    }, "pacePagenation", "constructionPacePostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addConstructionPace').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage('#addConstructionPace').click(function() {

        constructionPace.cpid = null;

        constructionPace.modals.updatePaceModal.modal("show");
    });

    function saveData() {

        if (com.validate('updatePaceModal')) {
            return false;
        }

        var url = api.data.addConstructionPace;

        var options = {
            'constructionPace.name': constructionPace.items.name.val(),
            "constructionPace.typeness": constructionPace.items.typeness.val(),
            "constructionPace.upperArea": constructionPace.items.upperArea.val(),
            "constructionPace.lowerArea": constructionPace.items.lowerArea.val(),
            "constructionPace.period": constructionPace.items.period.val(),
            "constructionPace.designPeriod": constructionPace.items.designPeriod.val(),
        };

        if (constructionPace.cpid) {
            url = api.data.updateConstructionPace;
            options["constructionPace.cpid"] = constructionPace.cpid;
        }

        com.post(url, options, function(res) {

            com.closePopup();
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();

            constructionPace.modals.updatePaceModal.modal("hide");
        });
    }

});