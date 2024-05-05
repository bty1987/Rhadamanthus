jQuery(function($) {

    var assistance = {
        assistance: null,
        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData)
        },

        modals: {
            assistanceModal: com.focusPage("#assistanceModal"),
            itemModal: com.focusPage("#itemModal")
        },

        items: {
            name: com.focusPage("#name", "#assistanceModal"),
            keyword: com.focusPage("#keyword", "#assistanceModal"),
            atttype: com.focusPage("#atttype", "#assistanceModal"),
            itemlist: com.focusPage("#itemlist", "#itemModal"),
        },

        aid: null,
        atttypes: {},
    };

    assistance.modals.assistanceModal.on('hide.bs.modal', function(e) {

        com.cleanItems(assistance.items);
        com.closeTip();
    });

    assistance.modals.itemModal.on('hide.bs.modal', function(e) {

        com.focusPage("#itemlist").html("");
        com.cleanItems(assistance.items);
        com.clearValidator();
        com.closeTip();
    });

    function show(v) {

        com.post(api.data.queryAssistanceItem, {
            "assistance.aid": v.aid
        }, function(res) {

            assistance.modals.itemModal.find(".modal-title").text(v.name);
            assistance.modals.itemModal.modal("show");

            var oneDiv = $('<div class="panel-group accordion-style1 accordion-style2"></div>').appendTo(assistance.items.itemlist);

            var twoDiv = $('<div class="panel panel-default"></div>').appendTo(oneDiv);

            $.each(res.assistanceItems, function(i, v) {

                var fourDiv = $('<div class="panel-heading"></div>').appendTo(twoDiv);
                var aTag = $('<div data-toggle="collapse in" class="accordion-toggle"></a>').appendTo(fourDiv);
                var iTag = $('<span></span>').html((i + 1) + ". " + v.title).appendTo(aTag);

                var sixDiv = $('<div class="panel-body no-border"></div>').appendTo(twoDiv);

                var sevenDiv = $('<div class=""></div>').appendTo(sixDiv);
                var eightDiv = $('<div class="clearfix timeline-item"></div>').appendTo(sevenDiv);
                var nineDiv = $('<div class="col-xs-9 pull-left"></div>').appendTo(eightDiv);
                var content = $('<div></div>').html(v.content).appendTo(nineDiv);
                var tenDiv = $('<div class="col-xs-3 pull-right draw""></div>').appendTo(eightDiv);

                $.each(v.drawings, function(i, value) {

                    var img = $('<img class="photo" style="margin-left: 3px;" width="45" />').appendTo(tenDiv);
                    com.showImg(img, value.drawingUrl, 40, 40, '', null, 0);

                });

                com.popup4photos(com.focusPage(".draw"));
            });

        });
    }

    var url = api.data.pageAssistance;

    var conditions = ['data-assistance-createTime'];

    var history = "assistancePostData";

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", url);
    searcher.condition(conditions);
    searcher.history(history);

    searcher.button([{
        id: "addAssistance",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        fieId: "name",
        name: "名称",
        prop: "name",
        clazz: "blue"
    }, {
        fieId: "keyword",
        name: "关键字",
        prop: "keyword",
        clazz: "blue"
    }, {
        fieId: "atttype",
        name: "业务类型",
        prop: "atttype",
        clazz: "blue"
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.data().assistance.status.keys,
    }, {
        field: "creater",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }];
    var linebtns = [{
        name: "编辑",
        clazz: "btn-success",
        handle: function(v) {

            assistance.aid = v.aid;

            assistance.items.name.val(v.name);
            assistance.items.keyword.val(v.keyword);

            assistance.modals.assistanceModal.modal("show");
            return false;
        },
    }, {
        name: "帮助项",
        clazz: "btn-search",
        handle: function(v) {

            assistance.aid = v.aid;
            show(v);
            return false;
        }
    }, {
        name: "详情",
        clazz: "btn-pink",
        handle: function(v) {

            params.aid = v.aid;
            com.popup4page('#layerPopUp', api.index.assistanceitemIndex.url, '帮助');
            return false;
        }
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#addAssistance', '#pagenation').on("click", function() {

        assistance.aid = null;
        assistance.modals.assistanceModal.modal("show");
    });

    function saveData() {

        if (com.validate('assistanceModal'))
            return false;

        var url = api.data.addAssistance;

        var options = {
            "assistance.name": assistance.items.name.val(),
            "assistance.keyword": assistance.items.keyword.val(),
        };

        if (assistance.aid) {
            url = api.data.updateAssistance;
            options["assistance.aid"] = assistance.aid;
        }

        com.post(url, options, function(res) {

            searcher.doSearch();

            com.showAlert(com.info, "操作成功");

            assistance.modals.assistanceModal.modal("hide");
        });
    }
});
