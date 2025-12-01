$(function() {

    var accessoriesType = {

        items: {
            name: com.focusPage('#name'),
            workType: com.focusPage('#workType'),
            type: com.focusPage('#type'),
            sort: com.focusPage('#sort'),
            comment: com.focusPage('#comment')
        },

        btns: {
            submitBtn: com.focusPage("#submitBtn")
        },

        modules: {

        },

        atid: null
    };

    com.post(api.common.queryWorkType, {}, function(res) {

        accessoriesType.items.workType.bindData(res.workTypes, "id", "name")
    });

    accessoriesType.items.type.bindData(constant.data().accessoriesType.type.datas, "key", "value");

    accessoriesType.items.type.on("change", function () {
        switch (accessoriesType.items.type.val()) {
            case "0":
                com.focusPage("#sortDiv").css("display", "none");
                accessoriesType.items.sort.removeClass("v_required");
                break;
            case "1":
                com.focusPage("#sortDiv").css("display", "block");
                accessoriesType.items.sort.addClass("v_required");
                break;
        }
    });

    var searcher = new Searcher();

    searcher.history("normoodPostData");

    var lineprops = [{
        fieId: "name",
        name: "名称",
        prop: "name",
        clazz: "grey"
    }, {
        fieId: "workType",
        name: "工种",
        prop: "workType.name",
        clazz: "grey"
    }, {
        fieId: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.data().accessoriesType.type.keys
    }, {
        fieId: "sort",
        name: "排序",
        prop: "sort",
        clazz: "green"
    }, {
        fieId: "status",
        name: "状态",
        prop: function(v) {

            return v.status == "0" ? "启用" : "禁用";
        },
        clazz: "red"
    }, {
        fieId: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-warning",
        handle: function(v) {

            com.clearValidator();
            com.cleanItems(accessoriesType.items);
            com.closePopup();

            accessoriesType.atid = v.atid;

            accessoriesType.items.name.val(v.name);
            accessoriesType.items.workType.val(v.workType.id);
            accessoriesType.items.type.val(v.type);
            accessoriesType.items.sort.val(v.sort);
            accessoriesType.items.comment.val(v.comment);

            if (v.type == 0) {
                com.focusPage("#sortDiv").css("display", "none");
            }

            com.popup4model('#layerAdd', '编辑');
        }
    }, {
        name: "启用",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.data.updateAccessoriesTypeForStatus, {
                "accessoriesType.atid": v.atid,
                "accessoriesType.status": check ? 0 : 1
            }, function(res) {

                searcher.doSearch();
            });

            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }];

    searcher.base("condList", "pagenation", "resultList", api.data.pageAccessoriesType);
    searcher.condition(["data-worktype", "data-accessoriesType-type"]);

    searcher.button(function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addAccessoriesType').css({
            'margin-top': '-2px',
            'margin-left': '4px'
        });
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $importAccessoriesType = $('<a></a>').addClass('btn btn-minier btn-warning pull-left').attr('id', 'import').css('margin-top', '-2px');
        var $addaAccessoriesType = $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($importAccessoriesType);
        var $addaAccessoriesTypespan = $('<span></span>').text('导入').appendTo($importAccessoriesType);

        return [$importAccessoriesType, $adda];
    });

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage("#addAccessoriesType").click(function() {

        com.clearValidator();
        com.cleanItems(accessoriesType.items);
        com.closePopup();

        accessoriesType.atid = null;

        com.focusPage("#sortDiv").css("display", "none");

        com.popup4model('#layerAdd', '添加')
    });

    accessoriesType.btns.submitBtn.click(function() {

        saveData();
    });

    com.focusPage("#import").click(function() {

        com.popup4model('#importLayer', '导入辅类')
    });

    com.uploadify("#importSelectAccessoriesType", "上传文件", api.data.importAccessoriesType, 'btn btn-success col-sm-6', "*.xls;*.xlsx", {
        'uploadType': 4
    }, 1, function(data) {

        searcher.doSearch();
    });

    function saveData() {

        if (com.validate('form1', "right")) {
            return false;
        }

        var name = accessoriesType.items.name.val();
        var workType = accessoriesType.items.workType.val();
        var type = accessoriesType.items.type.val();
        var sort = accessoriesType.items.sort.val();
        var comment = accessoriesType.items.comment.val();

        var url = api.data.addAccessoriesType;
        var options = {
            "accessoriesType.name": name,
            "accessoriesType.workType.id": workType,
            "accessoriesType.type": type,
            "accessoriesType.comment": comment
        };

        options["accessoriesType.sort"] = type == 0 ? 0 : sort;

        if (accessoriesType.atid) {
            url = api.data.updateAccessoriesType;
            options["accessoriesType.atid"] = accessoriesType.atid;
        }

        com.post(url, options, function(res) {

            searcher.doSearch();
        });
    }

});
