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

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = constructionPage.getConfig("supervision4rework");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    // 字段定义映射: key 对应配置 propertyArr 中的 value
    var propertyMap = {
        "createrName": {
            field: "createrName",
            name: "创建人",
            prop: "createrName",
            clazz: "grey"
        },
        "createTime": {
            field: "createTime",
            name: "返工时间",
            prop: "createTime",
            clazz: "green"
        },
        "reworkDes": {
            field: "reworkDes",
            name: "返工说明",
            prop: "reworkDes",
            clazz: "grey"
        }
    };

    // 根据配置 propertyArr 组装列定义, 配置为空则使用全部默认列
    var lineprops = (function() {

        if (pageConfig.propertyArr.length == 0) {

            var all = [];
            $.each(propertyMap, function (key, prop) { all.push(prop); });
            return all;
        }

        var props = [];
        $.each(pageConfig.propertyArr, function (i, key) {

            if (propertyMap[key]) props.push(propertyMap[key]);
        });
        return props;
    })();

    var linebtns = (function() {

        return {
            view: {
                name: "图纸",
                clazz: "btn-yellow",
                handle: function(v) {
                    viewSupervisionReworkDrawingIndex(v.rwId);
                },
                show: function() {
                    return btnVisible("view");
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
                },
                show: function() {
                    return btnVisible("edit");
                }
            },
            del: {
                name: "删除",
                clazz: "btn-danger",
                handle: function(v) {
                    removeRow(v.rwId);
                },
                show: function() {
                    return btnVisible("del");
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('id', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", pageConfig.apiPage || api.construction.pageReworkByOrderId, {
        "rework.orderId": params.construction.orderId
    }, pageConfig.condArr, "supervisionReworkPostData", null, false, buttons);
    searcher.line("", lineprops, linebtns).render();

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
