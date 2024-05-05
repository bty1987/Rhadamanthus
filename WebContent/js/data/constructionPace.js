$(function() {

    var constructionPace = {

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData)
        },

        modals: {
            addConstructionPaceModal: com.focusPage("#addConstructionPaceModal")
        },

        items: {
            name: com.focusPage("#name", "#constructionPace"),
            content: com.focusPage("#content", "#constructionPace")
        },

        status: constant.data().constructionPace.status.keys,
        currentCpid: null
    };

    constructionPace.modals.addConstructionPaceModal.on("hide.bs.modal", function(a) {

        com.cleanItems(constructionPace.items);
        com.clearValidator();

        constructionPace.currentCpid = null;
    });

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pageConstructionPace);

    searcher.condition(["data-constructionPace-name", "data-constructionPace-status"]);

    searcher.button([{
        id: "addConstructionPace",
        name: "添加",
        clazz: "btn-success",
        icon: "icon-plus"
    }]);

    searcher.history("constructionPacePostData");

    var lineprops = [{
        fieId: "name",
        name: "名称",
        prop: "name",
        clazz: "grey"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constructionPace.status
    }, {
        fieId: "content",
        name: "说明",
        prop: "content",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            constructionPace.currentCpid = v.cpid;

            constructionPace.items.name.val(v.name);
            constructionPace.items.content.val(v.content);

            constructionPace.modals.addConstructionPaceModal.modal("show");
            return false;
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.data.updateConstructionPaceForStatus, {
                "constructionPace.cpid": v.cpid,
                "constructionPace.status": check ? 0 : 1
            }, function(res) {

                searcher.doSearch();
                return false;
            });
        },
        init: function(v) {

            return !v.status;
        }
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage("#resultList").find("div.action-buttons").find("a.btn-yellow").hide();
    com.focusPage('#addCustype', '#pagenation').hide();

    com.focusPage('#addConstructionPace', '#pagenation').on("click", function() {

        constructionPace.modals.addConstructionPaceModal.modal("show");
    });

    function saveData() {

        if (com.validate('addConstructionPaceModal'))
            return false;

        var url = api.data.addConstructionPace;
        var options = {
            "constructionPace.name": constructionPace.items.name.val(),
            "constructionPace.content": constructionPace.items.content.val()
        };

        if (constructionPace.currentCpid != null) {
            url = api.data.updateConstructionPace;
            options["constructionPace.cpid"] = constructionPace.currentCpid;
        }

        com.post(url, options, function() {

            searcher.doSearch();
            constructionPace.modals.addConstructionPaceModal.modal("hide");
        });
    }

});
