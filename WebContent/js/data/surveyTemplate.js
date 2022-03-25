jQuery(function($) {

    var surveyTemplate = {

        btns: {

            textBtn: com.focusPage("#textBtn").on("click", drawtext),
            radioBtn: com.focusPage("#radioBtn").on("click", function() {

                drawradio("radio");
            }),
            checkBtn: com.focusPage("#checkBtn").on("click", function() {

                drawradio("check");
            }),
            inputBtn: com.focusPage("#inputBtn").on("click", drawinput),

            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
        },

        modals: {
            surveyTemplateModal: com.focusPage("#surveyTemplateModal")
        },

        items: {
            name: com.focusPage("#name", "#surveyTemplateModal"),
            itemlist: com.focusPage("#itemlist", "#surveyTemplateModal")
        },
        status: {},
        type: {},
        stid: null,
        stiid: null,
        stoid: null,
    };

    surveyTemplate.modals.surveyTemplateModal.on('hide.bs.modal', function(e) {

        com.cleanItems(surveyTemplate.items);
        com.focusPage("#itemlist").html("");
        com.clearValidator();
        com.closeTip();
    });

    com.post(api.ds.data, {}, function (res) {

        surveyTemplate.status = res.surveyTemplateStatus.split("key", "value");
    }, null, false);

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pageSurveyTemplate);

    searcher.button([{
        id: "addSurveyTemplate",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        fieId: "name",
        name: "模板名称",
        prop: "name",
        clazz: "blue"
    }, {
        fieId: "content",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: surveyTemplate.status
    }, ];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            surveyTemplate.stid = v.stid;
            editSurveyTemplate(v);
            return false;
        }
    }, {
        name: "删除",
        clazz: "btn-success",
        handle: function(v) {

            com.showConfirm("是否确认删除", function(){
                com.post(api.data.deleteSurveyTemplate, {
                    "surveyTemplate.stid": v.stid
                }, function(res) {

                    searcher.doSearch();
                });
                return false;
            });
        }
    }, ];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#addSurveyTemplate', '#pagenation').on("click", function() {

        surveyTemplate.modals.surveyTemplateModal.modal("show");
    });

    function drawtext(v) {
        var group = $('<div class="form-group typetext typeitem"></div>').appendTo(surveyTemplate.items.itemlist);
        var label = $('<label class="col-md-3 control-label no-padding-right" for="name"></label>').html("文本内容").appendTo(group);
        var item = $('<div class="col-sm-8"></div>').appendTo(group);
        var input = $('<textarea type="text" style="height: 100px;" class="col-xs-8 m-wrap v_required"></div>').val(v.content).appendTo(item);
        var deleteBtn = $('<button class="btn btn-minier btn-danger"></button>').text("删除").appendTo(group).click(function(){
            var _group = $(this).parents(".typetext");
            var _hr = _group.next("hr");
            
            _hr.remove();
            _group.remove();

            return false;
        });

        $('<hr/>').appendTo(surveyTemplate.items.itemlist);
    }

    function drawradio(type, v) {
        var group = $('<div class="form-group typeitem"></div>').addClass("type" + type).appendTo(surveyTemplate.items.itemlist);

        var label = $('<label class="col-md-3 control-label no-padding-right" for="name"></label>').html("题目").appendTo(group);
        var item = $('<div class="col-sm-8"></div>').appendTo(group);
        var input = $('<input type="text" class="col-xs-8 m-wrap title v_required"></div>').val(v ? v.name : "").appendTo(item);

        var radioDiv = $('<div lass="col-sm-12" style="margin-top: 40px"></div>').appendTo(group);
        var label = $('<label class="col-md-3 control-label no-padding-right" for="name"></label>').html("选项内容").appendTo(radioDiv);
        var item = $('<div class="col-sm-8"></div>').appendTo(radioDiv);
        var input = $('<input type="text" class="col-xs-8 m-wrap" id="event"></div>').appendTo(item);
        var btn = $('<button class="btn btn-minier btn-yellow"></button>').text("添项").appendTo(item);

        var label = $('<label class="col-md-3 control-label no-padding-right option" style="margin-top: 10px" for="name"></label>').html("所有选项").appendTo(group);
        var items = $('<div class="col-sm-8 items" style="margin-top: 10px" id="seleted"></div>').appendTo(group);
        var deleteBtn = $('<button class="btn btn-minier btn-danger"></button>').text("删除").appendTo(group).click(function(){
            var _group = $(this).parents("." + "type" + type);
            var _hr = _group.next("hr");

            _hr.remove();
            _group.remove();
            return false;
        });


        btn.click(function() {

            var that = $(this);

            var input = that.prev();
            var items = that.parents(".form-group").find(".items");

            if (input.val() == '')
                return false;

            var item = $('<span class="label label-xlg label-primary option" style="margin-right: 5px; margin-top: 10px"></span>').text(input.val()).appendTo(items);
            var itemdel = $('<i class="icon-remove red"></i>').appendTo(item);

            com.focusPage("#event").val("");

            itemdel.click(function() {
                var that = $(this);

                var span = that.parent();

                span.remove();
            });

            return false;
        });


        $('<hr/>').appendTo(surveyTemplate.items.itemlist);

        if (v) {
            $.each(v.options, function(i, v) {

                var item = $('<span class="label label-xlg label-primary option" style="margin-right: 5px;"></span>').text(v.title).appendTo(items);
                var itemdel = $('<i class="icon-remove red"></i>').appendTo(item);

            })
        }
    }

    function drawinput(v) {

        var group = $('<div class="form-group typeinput typeitem"></div>').appendTo(surveyTemplate.items.itemlist);
        var label = $('<label class="col-md-3 control-label no-padding-right" for="name"></label>').html("输入内容").appendTo(group);
        var item = $('<div class="col-sm-8"></div>').appendTo(group);
        var input = $('<textarea type="text" style="height: 100px;" class="col-xs-8 m-wrap v_required"></div>').val(v ? v.name : "").appendTo(item);
        var deleteBtn = $('<button class="btn btn-minier btn-danger"></button>').text("删除").appendTo(group).click(function(){
            var _group = $(this).parents(".typeinput");
            var _hr = _group.next("hr");

            _hr.remove();
            _group.remove();
            return false;
        });

        $('<hr/>').appendTo(surveyTemplate.items.itemlist);

    }

    function editSurveyTemplate() {

        com.post(api.data.querySurveyTemplateByStid, {
            "surveyTemplate.stid": surveyTemplate.stid
        }, function(res) {

            surveyTemplate.items.name.val(res.surveyTemplate.name);

            $.each(res.surveyTemplate.items, function(i, v) {

                if (v.type == 0) {
                    drawtext(v);
                } else if (v.type == 1) {
                    drawinput(v);
                } else if (v.type == 2) {
                    drawradio("radio", v);
                } else if (v.type == 3) {
                    drawradio("check", v);
                }
            });
        });
        surveyTemplate.stid = null;
        surveyTemplate.modals.surveyTemplateModal.modal("show");
    }

    function saveData() {

        if(com.validate("surveyTemplateModal")) return;

        if(com.focusPage("#itemlist").html().length == 0){
            com.showAlert(com.info, "请填写题目后再点击保存");
            return
        }

        var args = {
            "surveyTemplate.name": surveyTemplate.items.name.val()
        };
        var url;
        com.focusPage("#itemlist").find(".typeitem").each(function(i, v) {

            var item = $(v);
            if (item.hasClass("typetext")) {

                args["surveyTemplate.items[" + i + "].name"] = "";
                args["surveyTemplate.items[" + i + "].type"] = 0;
                args["surveyTemplate.items[" + i + "].content"] = item.find("textarea").val();

            } else if (item.hasClass("typeradio") || item.hasClass("typecheck")) {

                var type = item.hasClass("typeradio") ? 2 : 3;

                args["surveyTemplate.items[" + i + "].name"] = item.find("input").val();
                args["surveyTemplate.items[" + i + "].type"] = type;
                args["surveyTemplate.items[" + i + "].content"] = "";

                var options = item.find("span.option");

                options.each(function(j, e) {

                    var option = $(e);

                    args["surveyTemplate.items[" + i + "].options[" + j + "].title"] = option.text();
                });

            } else if (item.hasClass("typeinput")) {

                args["surveyTemplate.items[" + i + "].name"] = item.find("textarea").val();
                args["surveyTemplate.items[" + i + "].type"] = 1;
                args["surveyTemplate.items[" + i + "].content"] = "";

            }
        });

        if (surveyTemplate.stid) {
            url = api.data.updateSurveyTemplate;
            args["surveyTemplate.stid"] = surveyTemplate.stid;
        } else {
            url = api.data.addSurveyTemplate;
        }

        com.post(url, args, function(res) {

            searcher.doSearch();
        });

        surveyTemplate.modals.surveyTemplateModal.modal("hide");
    }
});
