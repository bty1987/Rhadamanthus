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

    var lineprops = (function() {

        return [{
            field: "name",
            name: "工程名称",
            prop: "name",
            clazz: "grey"
        }, {
            field: "upperArea",
            name: "上面积",
            prop: "upperArea",
            clazz: "blue"
        }, {
            field: "lowerArea",
            name: "下面积",
            prop: "lowerArea",
            clazz: "blue"
        }, {
            field: "period",
            name: "工期",
            prop: "period",
            clazz: "blue"
        }];
    })();

    var linebtns = (function() {

        return {
            edit: {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {
                    constructionPeriod.cpid = v.cpid;
                    constructionPeriod.items.name.val(v.name);
                    constructionPeriod.items.typeness.val(v.typeness);
                    constructionPeriod.items.upperArea.val(v.upperArea);
                    constructionPeriod.items.lowerArea.val(v.lowerArea);
                    constructionPeriod.items.period.val(v.period);
                    constructionPeriod.modals.updatePeriodModal.modal("show");
                }
            },
            node: {
                name: "节点",
                clazz: "btn-yellow",
                handle: function(v) {
                    params.data.constructionPeriod = v;
                    com.popup4page("#periodPopUp", api.index.constructionNodeIndex.url, "工程节点工期 ");
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addConstructionPeriod').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("periodCondList", "periodPagenation", "periodResultList", api.data.pageConstructionPeriod, null, ["data-construction-period-name"], "constructionPeriodPostData", null, false, buildPeriodButtons);
    searcher.line(function(v) { return ' ' + v.name; }, lineprops, linebtns).render();

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