jQuery(function($) {

    var constructionPeriod = {

        cpid: null,

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
            updateBtn: com.focusPage("#updateBtn")
        },

        modals: {
            addModal: com.focusPage("#addPeriodModal"),
            updateModal: com.focusPage("#updateModal")
        },

        items: {

            name: com.focusPage("#name"),
            typeness: com.focusPage("#typeness"),
            upperArea: com.focusPage("#upperArea"),
            lowerArea: com.focusPage("#lowerArea"),
            period: com.focusPage("#period"),
            company: com.focusPage("#company"),

            uName: com.focusPage("#uName"),
            uTypeness: com.focusPage("#uTypeness"),
            uUpperArea: com.focusPage("#uUpperArea"),
            uLowerArea: com.focusPage("#uLowerArea"),
            uPeriod: com.focusPage("#uPeriod"),
            uCompany: com.focusPage("#uCompany"),
        },

        editFlg: false,
    };

    var periodList = [];
    var tem = {
        "key": -1,
        "value": ""
    };
    periodList.push(tem);

    $.each(constant.decoration().decoration.typeness.datas, function(i, val) {

        periodList.push(val);
    });

    constructionPeriod.items.typeness.bindData(periodList, "key", "value").prop("-1", false);

    constructionPeriod.items.uTypeness.bindData(periodList, "key", "value");

    constructionPeriod.btns.saveBtn.bindClick(saveData);
    constructionPeriod.btns.updateBtn.bindClick(update);

    constructionPeriod.modals.addModal.on("hide.bs.modal", function() {

        com.cleanItems(constructionPeriod.items);
        com.clearValidator();
        com.closeTip();
    });

    constructionPeriod.modals.updateModal.on("hide.bs.modal", function() {

        com.cleanItems(constructionPeriod.items);
        com.clearValidator();
        com.closeTip();
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

            var propertyArr = [["工程名称: ", v.name, "blue"], ["类型: ", constant.decoration().decoration.typeness.keys[v.typeness], "red"], ["上面积: ", v.upperArea, "blue"], ["下面积: ", v.lowerArea, "blue"], ["工期: ", v.period, "blue"], ["公司: ", v.company, "blue"], ];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $invalid.append($statusSwitch).append($span);
            $liLine.append($h3).append($ulProperty);
            $btnDiv.append($invalid).append($btnUpdate);
            $h3.append($title).append($btnDiv);

            $btnUpdate.click(function() {

                constructionPeriod.cpid = v.cpid;
                constructionPeriod.items.uName.val(v.name);
                constructionPeriod.items.uTypeness.val(v.typeness);
                constructionPeriod.items.uUpperArea.val(v.upperArea);
                constructionPeriod.items.uLowerArea.val(v.lowerArea);
                constructionPeriod.items.uPeriod.val(v.period);
                constructionPeriod.items.uCompany.val(v.company);
                constructionPeriod.modals.updateModal.modal("show");
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

    searcher.init(["data-constructionPeriod-name"], "condList", api.data.pageConstructionPeriod, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "ConstructionPeriodPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addConstructionPeriod').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage('#addConstructionPeriod').click(function() {

        constructionPeriod.modals.addModal.modal("show");
    });

    function update() {

        if (com.validate('updateModal')) {
            return false;
        }
        ;

        var options = {
            "constructionPeriod.cpid": constructionPeriod.cpid,
            "constructionPeriod.name": constructionPeriod.items.uName.val(),
            "constructionPeriod.typeness": constructionPeriod.items.uTypeness.val(),
            "constructionPeriod.upperArea": constructionPeriod.items.uUpperArea.val(),
            "constructionPeriod.lowerArea": constructionPeriod.items.uLowerArea.val(),
            "constructionPeriod.period": constructionPeriod.items.uPeriod.val(),
            "constructionPeriod.company": constructionPeriod.items.uCompany.val()
        }

        com.post(api.data.updateConstructionPeriod, options, function(res) {

            com.closePopup();
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
        constructionPeriod.modals.updateModal.modal("hide");
    }
    ;

    function saveData() {

        if (com.validate('addPeriodModal')) {
            return false;
        }
        ;

        var options = {
            'constructionPeriod.name': constructionPeriod.items.name.val(),
            "constructionPeriod.typeness": constructionPeriod.items.typeness.val(),
            "constructionPeriod.upperArea": constructionPeriod.items.upperArea.val(),
            "constructionPeriod.lowerArea": constructionPeriod.items.lowerArea.val(),
            "constructionPeriod.period": constructionPeriod.items.period.val(),
            "constructionPeriod.company": constructionPeriod.items.company.val()
        };

        com.post(api.data.addConstructionPeriod, options, function(res) {

            com.closePopup();
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        constructionPeriod.modals.addModal.modal("hide");
    }

});