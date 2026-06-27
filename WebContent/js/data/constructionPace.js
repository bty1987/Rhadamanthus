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
        }, {
            field: "designPeriod",
            name: "设计工期",
            prop: "designPeriod",
            clazz: "blue"
        }];
    })();

    var linebtns = (function() {

        return {
            edit: {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {
                    constructionPace.cpid = v.cpid;
                    constructionPace.items.name.val(v.name);
                    constructionPace.items.typeness.val(v.typeness);
                    constructionPace.items.upperArea.val(v.upperArea);
                    constructionPace.items.lowerArea.val(v.lowerArea);
                    constructionPace.items.period.val(v.period);
                    constructionPace.items.designPeriod.val(v.designPeriod);
                    constructionPace.modals.updatePaceModal.modal("show");
                }
            },
            node: {
                name: "节点",
                clazz: "btn-yellow",
                handle: function(v) {
                    params.data.constructionPace = v;
                    com.popup4page("#pacePopUp", "/views/data/constructionPaceNode.html", "工程节点工期 ");
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addConstructionPace').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("paceCondList", "pacePagenation", "paceResultList", api.data.pageConstructionPace, null, ["data-constructionPace-name"], "constructionPacePostData", null, false, buildPaceButtons);
    searcher.line(function(v) { return ' ' + v.name; }, lineprops, linebtns).render();

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