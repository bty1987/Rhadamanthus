jQuery(function($) {

    var rework = {
        saveBtn: com.focusPage("#SaveBtn"),
        cancellBtn: com.focusPage("#cancelBtn"),

        modals: {
            modal: com.focusPage("#reworkModal")
        },

        items: {
            createTime: com.focusPage("#createTime"),
            reworkDes: com.focusPage("#reworkDes")
        },

        editFlag: false,
        repeatFlg: false
    };

    rework.saveBtn.bindClick(saveData);

    rework.modals.modal.on("hide.bs.modal", function() {

        com.cleanItems(rework.items);
        com.closeTip();
    });

    com.focusPage('#fl-statement').statement("监理控制", "返工信息列表");

    com.datetime(rework.items.createTime);

    function buildSupervision4reworkLineprops() {

        return [{
            field: "createrName",
            name: "创建人",
            prop: "createrName",
            clazz: "grey"
        }, {
            field: "createTime",
            name: "返工时间",
            prop: "createTime",
            clazz: "green"
        }, {
            field: "reworkDes",
            name: "返工说明",
            prop: "reworkDes",
            clazz: "grey"
        }];
    }

    function buildSupervision4reworkLinebtns() {

        return {
            view: {
                name: "图纸",
                clazz: "btn-yellow",
                handle: function(v) {
                    viewSupervisionReworkDrawingIndex(v.rwId);
                }
            },
            edit: {
                name: "编辑",
                clazz: "btn-primary",
                handle: function(v) {
                    rework.editFlag = true;
                    rework.items.createTime.val(v.createTime);
                    rework.items.reworkDes.val(v.reworkDes);

                    rework["rework.rwId"] = v.rwId;

                    rework.modals.modal.modal("show");
                }
            },
            del: {
                name: "删除",
                clazz: "btn-danger",
                handle: function(v) {
                    removeRow(v.rwId);
                }
            }
        };
    }

    function buildSupervision4reworkButtons() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('id', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    }

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.construction.pageReworkByOrderId, {
        "rework.orderId": params.construction.orderId
    }, [], "supervisionReworkPostData", null, false, buildSupervision4reworkButtons);
    searcher.line("", buildSupervision4reworkLineprops(), buildSupervision4reworkLinebtns()).render();

    com.focusPage('#add', '#pagenation').click(function() {
        rework.editFlag = false;

        rework.modals.modal.modal("show");
    });

    function saveData() {

        if (com.validate("reworkModal"))
            return false;

        var url;
        var options = {
            "rework.createTime": rework.items.createTime.val(),
            "rework.reworkDes": rework.items.reworkDes.val(),
            "rework.orderId": params.construction.orderId
        };

        if (rework.editFlag) {
            url = api.construction.updateRework;
            options["rework.rwId"] = rework["rework.rwId"];
        } else {
            url = api.construction.addRework;
        }

        com.post(url, options, function(res) {
            searcher.doSearch();
        });

        rework.modals.modal.modal("hide");
    }

    function removeRow(id) {
        com.showConfirm("确认删除返工信息吗?", function() {
            com.post(api.construction.deleteRework, {
                "rwIds[0]": id
            }, function(res) {
                searcher.doSearch();
            });

        });
    }

    function viewSupervisionReworkDrawingIndex(rwId) {

        params.construction.rwId = rwId;

        com.closePopup();
        com.popup4page("#stockRecordPopUp", "/views/construction/supervision4drawing.html", "返工图纸");
    }

});
