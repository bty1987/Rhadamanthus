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
            inputBtn: com.focusPage("#inputBtn").on("click", function(){
                drawinput(1, {});
            }),
            dateBtn: com.focusPage("#dateBtn").on("click", function(){
                drawinput(4, {});
            }),

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

    surveyTemplate.status = constant.data().common.status.keys;

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pageSurveyTemplate);

    searcher.condition(["data-surveyTemplate-name", "data-surveyTemplate-status"]);

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
        dataset: constant.data().surveyTemplate.status.keys
    }, {
        fieId: "content",
        name: "推送标识",
        prop: "isSend",
        clazz: "red",
        dataset: constant.data().surveyTemplate.isSend.keys
    }, ];

    var linebtns = [{
        name: "推送标识",
        type: "switch",
        clazz: "send-lbl",
        handle: function(v, check) {

            com.post(api.data.updateSurveyTemplateForStatus, {
                "surveyTemplate.stid": v.stid,
                "surveyTemplate.isSend": check ? 1 : 0
            }, function(res) {

                searcher.doSearch();
            });
            return false;
        },
        init: function(v) {

            return v.isSend;
        }
    }, {
        name: "复制",
        clazz: "btn-yellow",
        handle: function(v) {

            surveyTemplate.stid = v.stid;

            copySurveyTemplate(v.stid);
            return false;
        }
    }, {
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

            com.showConfirm("是否确认删除", function() {

                com.post(api.data.deleteSurveyTemplate, {
                    "surveyTemplate.stid": v.stid
                }, function(res) {

                    searcher.doSearch();
                });
                return false;
            });
        },
        show: function(v) {

            return false;
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.data.updateSurveyTemplateForStatus, {
                "surveyTemplate.stid": v.stid,
                "surveyTemplate.status": check ? 0 : 1
            }, function(res) {

                searcher.doSearch();
            });
            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }, ];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#addSurveyTemplate', '#pagenation').on("click", function() {

        surveyTemplate.stid = null;

        surveyTemplate.modals.surveyTemplateModal.modal("show");
    });

    function drawtext(v) {

        var group = $('<div class="form-group typetext typeitem"></div>').appendTo(surveyTemplate.items.itemlist);

        var titleDiv = $('<div class="col-md-12" style="margin-top: 10px; display: flex; align-items: center;"></div>').appendTo(group);
        var label = $('<label class="col-md-3 control-label no-padding-right" for="name"></label>').html("文本内容").appendTo(titleDiv);
        var item = $('<div class="col-md-6"></div>').appendTo(titleDiv);
        var input = $('<textarea type="text" style="height: 100px;" class="col-xs-8 m-wrap v_required">').val(v.content).appendTo(item);
        var btnGroup = $('<div style="display: flex; margin-left: auto;"></div>').appendTo(titleDiv);

        var moveUpBtn = $('<button class="btn btn-minier btn-info move-up" style="margin-left:5px"><i class="icon-arrow-up"></i></button>').appendTo(btnGroup);
        var moveDownBtn = $('<button class="btn btn-minier btn-info move-down" style="margin-left:5px"><i class="icon-arrow-down"></i></button>').appendTo(btnGroup);
        var deleteBtn = $('<button class="btn btn-minier btn-danger" style="margin-left:5px">删除</button>').appendTo(btnGroup);

        var requireDiv = $('<div class="col-md-12" style="margin-top: 10px"></div>').appendTo(group);
        var label = $('<label class="col-md-3 control-label no-padding-right" for="name"></label>').html("是否必填").appendTo(requireDiv);
        var item = $('<div class="col-md-8"></div>').appendTo(requireDiv);
        var require = $('<input type="checkbox" name="require" class=" ace ace-switch ace-switch-5" />').appendTo(item);
        var span = $('<span class="lbl isOrNot"></span>').appendTo(item);

        if (v != null && v.require == 0) {
            require.prop('checked', true);
        }

        moveUpBtn.click(function() {
            var $group = $(this).parents(".typeitem");
            moveItem($group, 'up');
            return false;
        });

        moveDownBtn.click(function() {
            var $group = $(this).parents(".typeitem");
            moveItem($group, 'down');
            return false;
        });

        deleteBtn.click(function() {

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

        var titleDiv = $('<div class="col-md-12" style="margin-top: 10px; display: flex; align-items: center;"></div>').appendTo(group);
        var label = $('<label class="col-md-3 control-label no-padding-right" for="name"></label>').html("题目").appendTo(titleDiv);
        var item = $('<div class="col-md-6"></div>').appendTo(titleDiv);
        var input = $('<input type="text" class="col-xs-8 m-wrap title v_required"></div>').val(v ? v.name : "").appendTo(item);
        var btnGroup = $('<div style="display: flex; margin-left: auto;"></div>').appendTo(titleDiv);

        var moveUpBtn = $('<button class="btn btn-minier btn-info move-up" style="margin-left:5px"><i class="icon-arrow-up"></i></button>').appendTo(btnGroup);
        var moveDownBtn = $('<button class="btn btn-minier btn-info move-down" style="margin-left:5px"><i class="icon-arrow-down"></i></button>').appendTo(btnGroup);
        var deleteBtn = $('<button class="btn btn-minier btn-danger" style="margin-left:5px">删除</button>').appendTo(btnGroup);

        var requireDiv = $('<div class="col-md-12" style="margin-top: 10px"></div>').appendTo(group);
        var label = $('<label class="col-md-3 control-label no-padding-right" for="name"></label>').html("是否必填").appendTo(requireDiv);
        var item = $('<div class="col-md-8"></div>').appendTo(requireDiv);
        var require = $('<input type="checkbox" name="require" class=" ace ace-switch ace-switch-5" />').appendTo(item);
        var span = $('<span class="lbl isOrNot"></span>').appendTo(item);
        
        var radioDiv = $('<div class="col-md-12" style="margin-top: 10px"></div>').appendTo(group);
        var label = $('<label class="col-md-3 control-label no-padding-right" for="name"></label>').html("选项内容").appendTo(radioDiv);
        var item = $('<div class="col-md-8"></div>').appendTo(radioDiv);

        var input = $('<input type="text" class="col-xs-8 m-wrap" id="event"></div>').appendTo(item);
        var btn = $('<button class="btn btn-minier btn-yellow"></button>').text("添项").appendTo(item);

        var optionDiv = $('<div class="col-md-12" style="margin-top: 10px"></div>').appendTo(group);
        var label = $('<label class="col-md-3 control-label no-padding-right option" style="margin-top: 10px" for="name"></label>').html("所有选项").appendTo(optionDiv);
        var items = $('<div class="col-md-8 items" style="margin-top: 10px" id="seleted"></div>').appendTo(optionDiv);

        if (v != null && v.require == 0) {
            require.prop('checked', true);
        }

         moveUpBtn.click(function() {
            var $group = $(this).parents(".typeitem");
            moveItem($group, 'up');
            return false;
        });

        moveDownBtn.click(function() {
            var $group = $(this).parents(".typeitem");
            moveItem($group, 'down');
            return false;
        });

        deleteBtn.click(function() {

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

                itemdel.click(function() {

                    var that = $(this);
                    var span = that.parent();

                    span.remove();
                });
            });
        }
    }

    function drawinput(type, v) {
        
        var typeclass = "typeinput";
        
        if(type == 1) typeclass = "typeinput";
        if(type == 4) typeclass = "typedate";

        var group = $('<div class="form-group ' + typeclass + ' typeitem"></div>').attr({'data-stiid': v.stiid || '','data-sort': v.sort || $(".typeitem").length + 1}).appendTo(surveyTemplate.items.itemlist);

        var titleDiv = $('<div class="col-md-12" style="margin-top: 10px; display: flex; align-items: center;"></div>').appendTo(group);
        var label = $('<label class="col-md-3 control-label no-padding-right" for="name"></label>').html("文本内容").appendTo(titleDiv);
        var item = $('<div class="col-md-6"></div>').appendTo(titleDiv);
        var input = $('<textarea type="text" style="height: 100px;" class="col-xs-8 m-wrap v_required">').val(v.name).appendTo(item);
        var btnGroup = $('<div style="display: flex; margin-left: auto;"></div>').appendTo(titleDiv);

        var moveUpBtn = $('<button class="btn btn-minier btn-info move-up" style="margin-left:5px"><i class="icon-arrow-up"></i></button>').appendTo(btnGroup);
        var moveDownBtn = $('<button class="btn btn-minier btn-info move-down" style="margin-left:5px"><i class="icon-arrow-down"></i></button>').appendTo(btnGroup);
        var deleteBtn = $('<button class="btn btn-minier btn-danger" style="margin-left:5px">删除</button>').appendTo(btnGroup);

        var requireDiv = $('<div class="col-md-12" style="margin-top: 10px"></div>').appendTo(group);
        var label = $('<label class="col-md-3 control-label no-padding-right" for="name"></label>').html("是否必填").appendTo(requireDiv);
        var item = $('<div class="col-md-8"></div>').appendTo(requireDiv);
        var require = $('<input type="checkbox" name="require" class=" ace ace-switch ace-switch-5" />').appendTo(item);
        var span = $('<span class="lbl isOrNot"></span>').appendTo(item);

        if (v != null && v.require == 0) {
            require.prop('checked', true);
        }

        moveUpBtn.click(function() {
            var $group = $(this).parents(".typeitem");
            moveItem($group, 'up');
            return false;
        });

        moveDownBtn.click(function() {
            var $group = $(this).parents(".typeitem");
            moveItem($group, 'down');
            return false;
        });

        deleteBtn.click(function() {

            var _group = $(this).parents("." + typeclass);
            var _hr = _group.next("hr");

            _hr.remove();
            _group.remove();

            return false;
        });

        $('<hr/>').appendTo(surveyTemplate.items.itemlist);
    }

    function checkedStyle($item) {
        com.focusPage('.typeitem').removeClass('current');
        $item.addClass('current');
    }

    function moveItem($item, direction) {
        var $allItems = $(".typeitem");
        var currentIndex = $allItems.index($item);

        if ((direction === 'up' && currentIndex === 0) || (direction === 'down' && currentIndex === $allItems.length - 1)) {
            return;
        }

        var $targetItem = direction === 'up' ? $allItems.eq(currentIndex - 1) : $allItems.eq(currentIndex + 1);

        var tempSort = $item.attr('data-sort');
        $item.attr('data-sort', $targetItem.attr('data-sort'));
        $targetItem.attr('data-sort', tempSort);

        var $currentHr = $item.next('hr');
        var $targetHr = $targetItem.next('hr');

        if (direction === 'up') {
            var $movingGroup = $item.add($currentHr);
            $movingGroup.insertBefore($targetItem);
        } else {
            $currentHr.detach();
            $item.insertAfter($targetHr);
            $currentHr.insertAfter($item);
        }

        checkedStyle($item);
    }

    function copySurveyTemplate(stid) {

        var options = {
             "surveyTemplate.stid": stid,
        };

        com.post(api.data.copySurveyTemplate, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
    }

    function editSurveyTemplate() {

        com.post(api.data.querySurveyTemplateByStid, {
            "surveyTemplate.stid": surveyTemplate.stid
        }, function(res) {

            surveyTemplate.items.name.val(res.surveyTemplate.name);

            $.each(res.surveyTemplate.items, function(i, v) {

                v.sort = v.sort || i + 1;
                if (v.type == 0) {
                    drawtext(v);
                } else if (v.type == 1) {
                    drawinput(1, v);
                } else if (v.type == 2) {
                    drawradio("radio", v);
                } else if (v.type == 3) {
                    drawradio("check", v);
                } else if (v.type == 4) {
                    drawinput(4, v);
                }
            });
        });

        surveyTemplate.modals.surveyTemplateModal.modal("show");
    }

    function saveData() {

        if (com.validate("surveyTemplateModal"))
            return false;

        if (com.focusPage("#itemlist").html().length == 0) {

            com.showAlert(com.info, "请填写题目后再点击保存");
            return false;
        }

        var url = api.data.addSurveyTemplate;

        var args = {
            "surveyTemplate.name": surveyTemplate.items.name.val(),
        }

        com.focusPage("#itemlist").find(".typeitem").each(function(i, v) {

            var item = $(v);
            var sort = i + 1;

            args["surveyTemplate.items[" + i + "].sort"] = sort;

            if (item.hasClass("typetext")) {

                args["surveyTemplate.items[" + i + "].name"] = "";
                args["surveyTemplate.items[" + i + "].type"] = 0;
                args["surveyTemplate.items[" + i + "].content"] = item.find("textarea").val();
                args["surveyTemplate.items[" + i + "].require"] = 1;

            } else if (item.hasClass("typedate")) {

                args["surveyTemplate.items[" + i + "].name"] = item.find("textarea").val();
                args["surveyTemplate.items[" + i + "].type"] = 4;
                args["surveyTemplate.items[" + i + "].content"] = item.find("textarea").val();
                args["surveyTemplate.items[" + i + "].require"] = item.find('input[name="require"]').prop("checked") ? 0 : 1;

            } else if (item.hasClass("typeradio") || item.hasClass("typecheck")) {

                var type = item.hasClass("typeradio") ? 2 : 3;

                args["surveyTemplate.items[" + i + "].name"] = item.find("input").val();
                args["surveyTemplate.items[" + i + "].type"] = type;
                args["surveyTemplate.items[" + i + "].content"] = "";
                args["surveyTemplate.items[" + i + "].require"] = item.find('input[name="require"]').prop("checked") ? 0 : 1;

                var options = item.find("span.option");

                options.each(function(j, e) {

                    var option = $(e);

                    args["surveyTemplate.items[" + i + "].options[" + j + "].title"] = option.text();
                });

            } else if (item.hasClass("typeinput")) {

                args["surveyTemplate.items[" + i + "].name"] = item.find("textarea").val();
                args["surveyTemplate.items[" + i + "].type"] = 1;
                args["surveyTemplate.items[" + i + "].content"] = "";
                args["surveyTemplate.items[" + i + "].require"] = item.find('input[name="require"]').prop("checked") ? 0 : 1;
            }
        });

        if (surveyTemplate.stid) {

            args["surveyTemplate.stid"] = surveyTemplate.stid;
            url = api.data.updateSurveyTemplate;
        }

        com.post(url, args, function() {

            searcher.doSearch();

            surveyTemplate.modals.surveyTemplateModal.modal("hide");
        });
    }

});