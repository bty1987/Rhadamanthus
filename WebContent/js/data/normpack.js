jQuery(function($) {

    var normpack = {

        npid: null,

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
        },

        modals: {
            addModal: com.focusPage("#addModal"),
        },

        items: {
            name: com.focusPage("#name"),
        },
        status: {},
        node: {},
    };

    normpack.btns.saveBtn.bindClick(saveData);

    normpack.modals.addModal.on("hide.bs.modal", function() {

        com.cleanItems(normpack.items);
        com.clearValidator();
        com.closeTip();
    });

    normpack.status = constant.data().common.status.keys;

    var lineprops = (function() {

        return [{
            field: "status",
            name: "状态",
            prop: function(v) { return normpack.status[v.status]; },
            clazz: "red"
        }];
    })();

    var linebtns = (function() {

        return {
            status: {
                type: "switch",
                clazz: "status-lbl",
                init: function(v) { return !v.status; },
                handle: function(v, checked) {
                    var cvalue = checked ? 0 : 1;
                    com.post(api.data.updateNormpackForStatus, {
                        "normpack.npid": v.npid,
                        "normpack.status": cvalue
                    }, function(res) {
                        cvalue == 0 ? com.showAlert(com.info, "已启用") : com.showAlert(com.info, "已禁用");
                        searcher.doSearch();
                    });
                }
            },
            project: {
                name: "项目",
                clazz: "btn-purple",
                handle: function(v) {
                    params.data.normpack = v;
                    com.popup4page("#layerPopUp", "views/data/normpackItem.html", "项目", null, function() {
                        com.closePopup();
                        searcher.doSearch();
                    });
                }
            },
            delete: {
                name: "删除",
                clazz: "btn-yellow",
                handle: function(v) {
                    com.showConfirm("是否确认删除", function() {
                        com.post(api.data.deleteNormpack, {
                            "normpack.npid": v.npid
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

    searcher.set("condList", "pagenation", "resultList", api.data.pageNormpack, null, ["data-quotation-normpack-name", "data-quotation-normpack-status"], "addItemPostData", null, false, buttons);
    searcher.line(function(v) { return ' ' + v.name; }, lineprops, linebtns).render();

    com.focusPage('#addItemBtn').click(function() {

        normpack.modals.addModal.modal("show");
    });

    function saveData() {

        if (com.validate('addModal')) {
            return false;
        }
        ;

        var options = {
            'normpack.name': normpack.items.name.val(),

        };

        com.post(api.data.addNormpack, options, function(res) {

            com.closePopup();
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        normpack.modals.addModal.modal("hide");
    }

});