$(function($) {

    var decorationMeasureRule = {

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData)
        },

        modals: {
            addModal: com.focusPage("#addModal")
        },

        items: {
            dmrid: com.focusPage("#dmrid"),
            name: com.focusPage("#name"),
            comment: com.focusPage("#comment")
        },

        editFlg: false
    };

    decorationMeasureRule.modals.addModal.on("hide.bs.modal", function() {

        com.cleanItems(decorationMeasureRule.items);
        com.clearValidator();
        decorationMeasureRule.editFlg = false;
    });

    var lineprops = (function() {

        return [{
            field: "comment",
            name: "说明",
            prop: function(v) { return com.checkNull(v.comment, "无"); },
            clazz: "grey"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return v.status == 0 ? "启用" : "禁用"; },
            clazz: "red"
        }];
    })();

    var linebtns = (function() {

        return {
            status: {
                type: "switch",
                init: function(v) { return v.status == 0; },
                handle: function(v, checked) {
                    var cvalue = checked ? 1 : 0;
                    com.post(api.data.updateDecorationMeasureRuleForStatus, {
                        "decorationMeasureRule.dmrid": v.dmrid,
                        "decorationMeasureRule.status": cvalue
                    }, function() {
                        cvalue == 0 ? com.showAlert(com.info, "已启用") : com.showAlert(com.info, "已禁用");
                        searcher.doSearch();
                    });
                }
            },
            update: {
                name: "修改",
                clazz: "btn-yellow",
                handle: function(v) {
                    decorationMeasureRule.editFlg = false;
                    decorationMeasureRule.items.dmrid.val(v.dmrid);
                    decorationMeasureRule.items.name.val(v.name);
                    decorationMeasureRule.items.comment.val(v.comment);
                    decorationMeasureRule.modals.addModal.modal("show");
                }
            },
            item: {
                name: "明细",
                clazz: "btn-purple",
                handle: function(v) {
                    params.data.decorationMeasureRule = v;
                    com.popup4page("#layerPopUp", "views/data/decorationMeasureRuleItem.html", "装修区域分支", null, function() {
                        com.closePopup();
                        searcher.doSearch();
                    });
                }
            },
            delete: {
                name: "删除",
                clazz: "btn-danger",
                handle: function(v) {
                    com.showConfirm("是否确认删除", function() {
                        com.post(api.data.deleteDecorationMeasureRule, {
                            "decorationMeasureRule.dmrid": v.dmrid
                        }, function() {
                            searcher.doSearch();
                            com.showAlert(com.info, "操作成功");
                        });
                    });
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addItemBtn').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.data.pageDecorationMeasureRule, null, ["decorationMeasureRule-name", "decorationMeasureRule-status"], "decorationMeasureRulePostData", null, false, buildMeasureRuleButtons);
    searcher.line(function(v) { return ' ' + v.name; }, lineprops, linebtns).render();

    com.focusPage('#addItemBtn').click(function() {

        decorationMeasureRule.editFlg = true;
        decorationMeasureRule.modals.addModal.modal("show");
    });

    function saveData() {

        if (com.validate('addModal')) {
            return false;
        }

        var options = {
            'decorationMeasureRule.name': decorationMeasureRule.items.name.val(),
            'decorationMeasureRule.comment': decorationMeasureRule.items.comment.val()
        };

        if (decorationMeasureRule.editFlg) {

            com.post(api.data.addDecorationMeasureRule, options, function() {

                com.showAlert(com.info, "添加成功");
                searcher.doSearch();
            });
        } else {

            options['decorationMeasureRule.dmrid'] = decorationMeasureRule.items.dmrid.val();

            com.post(api.data.updateDecorationMeasureRule, options, function() {

                com.showAlert(com.info, "修改成功");
                searcher.doSearch();
            });
        }

        decorationMeasureRule.modals.addModal.modal("hide");
    }

});
