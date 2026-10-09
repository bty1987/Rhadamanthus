jQuery(function($) {

    var decorationFunctionManage = {
        dfid: null,
        modals: {
            decorationFunctionModal: com.focusPage("#decorationFunctionModal"),
        },
        btns: {
            saveBtn: com.focusPage("#saveDecorationFunctionBtn"),
            cancelBtn: com.focusPage("#cancelDecorationFunctionBtn"),
        },
        items: {
            name: com.focusPage("#dfName"),
            key: com.focusPage("#dfKey"),
            value: com.focusPage("#dfValue"),
            type: com.focusPage("#dfType"),
            subtype: com.focusPage("#dfSubtype"),
            sort: com.focusPage("#dfSort"),
            comment: com.focusPage("#dfComment"),
        },
    };

    var searcher = new Searcher();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addDecorationFunction').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    searcher.set("decorationFunctionManageCondList", "decorationFunctionManagePagenation", "decorationFunctionManageResultList", api.decoration.pageDecorationFunction, null, ["decoration-decorationFunction-name", "decoration-decorationFunction-key", "decoration-decorationFunction-type", "decoration-decorationFunction-subtype"], "decorationFunctionManagePostData", null, false, buttons);

    var lineprops = [{
        field: "dfid",
        name: "编号",
        prop: "dfid",
        clazz: "grey"
    }, {
        field: "name",
        name: "名称",
        prop: "name",
        clazz: "blue"
    }, {
        field: "key",
        name: "键",
        prop: "key",
        clazz: "grey"
    }, {
        field: "value",
        name: "值",
        prop: "value",
        clazz: "grey"
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        clazz: "red"
    }, {
        field: "subtype",
        name: "子类型",
        prop: "subtype",
        clazz: "red"
    }, {
        field: "sort",
        name: "排序",
        prop: "sort",
        clazz: "grey"
    }, {
        field: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            decorationFunctionManage.dfid = v.dfid;
            decorationFunctionManage.items.name.val(v.name);
            decorationFunctionManage.items.key.val(v.key);
            decorationFunctionManage.items.value.val(v.value);
            decorationFunctionManage.items.type.val(v.type);
            decorationFunctionManage.items.subtype.val(v.subtype == null ? 0 : v.subtype);
            decorationFunctionManage.items.sort.val(v.sort);
            decorationFunctionManage.items.comment.val(v.comment);

            decorationFunctionManage.modals.decorationFunctionModal.modal("show");
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.decoration.deleteDecorationFunction, {
                "decorationFunction.dfid": v.dfid
            }, function(e) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
        }
    }];

    searcher.table(lineprops, linebtns).render();

    com.focusPage('a[name="addDecorationFunction"]', '#decorationFunctionManagePagenation').on("click", function() {

        decorationFunctionManage.dfid = null;
        decorationFunctionManage.items.name.val("").removeAttr("disabled");
        decorationFunctionManage.items.key.val("");
        decorationFunctionManage.items.value.val("");
        decorationFunctionManage.items.type.val("");
        decorationFunctionManage.items.subtype.val(0);
        decorationFunctionManage.items.sort.val("");
        decorationFunctionManage.items.comment.val("");

        decorationFunctionManage.modals.decorationFunctionModal.modal("show");
    });

    decorationFunctionManage.btns.saveBtn.on("click", function() {

        if (com.validate('decorationFunctionModal')) {
            return false;
        }

        var url = api.decoration.addDecorationFunction;

        var option = {
            "decorationFunction.name": decorationFunctionManage.items.name.val().trim(),
            "decorationFunction.key": decorationFunctionManage.items.key.val().trim(),
            "decorationFunction.value": decorationFunctionManage.items.value.val().trim(),
            "decorationFunction.type": decorationFunctionManage.items.type.val(),
            "decorationFunction.subtype": decorationFunctionManage.items.subtype.val(),
            "decorationFunction.sort": decorationFunctionManage.items.sort.val(),
            "decorationFunction.comment": decorationFunctionManage.items.comment.val(),
        };

        if (decorationFunctionManage.dfid != null) {
            url = api.decoration.updateDecorationFunction;
            option["decorationFunction.dfid"] = decorationFunctionManage.dfid;
        }

        com.post(url, option, function(e) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();

            decorationFunctionManage.modals.decorationFunctionModal.modal("hide");
        });
    });

    decorationFunctionManage.modals.decorationFunctionModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanItems(decorationFunctionManage.items);
    });

});
