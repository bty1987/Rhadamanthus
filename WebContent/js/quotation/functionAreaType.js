$(function() {

    com.focusPage('#fl-statement').statement("功能区类型", "报价基础数据");

    var functionAreaType = {

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
        },

        modals: {
            functionAreaTypeModal: com.focusPage("#functionAreaTypeModal"),
        },

        items: {
            fatId: com.focusPage("#fatId"),
            typeName: com.focusPage("#typeName"),
        },
    };

    functionAreaType.modals.functionAreaTypeModal.on("hide.bs.modal", function(a) {

        com.clearValidator();
        com.cleanItems(functionAreaType.items);
    });

    functionAreaType.btns.saveBtn.on("click", saveFunctionAreaType);

    var lineprops = (function() {

        return [{
            field: "name",
            name: "类型名称",
            prop: "name",
            clazz: "grey"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return v.status == 0 ? "启用" : "停用"; },
            clazz: "red"
        }];
    })();

    var linebtns = (function() {

        return {
            edit: {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {
                    editFunctionAreaType(v);
                }
            },
            status: {
                name: "状态",
                type: "switch",
                clazz: "status-lbl",
                init: function(v) {
                    return !v.status;
                },
                handle: function(v, check) {
                    updateFunctionAreaTypeStatus(v.fatId, check ? 0 : 1);
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addFunctionAreaType').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var _condArr = [];

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.quotation.pageFunctionAreaType, null, _condArr, "functionAreaTypePostData", null, false, buttons);
    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('a[name="addFunctionAreaType"]', '#pagenation').on('click', function() {

        functionAreaType.items.fatId.val(0);

        functionAreaType.modals.functionAreaTypeModal.modal("show");
    });

    function editFunctionAreaType(v) {

        functionAreaType.items.fatId.val(v.fatId);
        functionAreaType.items.typeName.val(v.name);

        functionAreaType.modals.functionAreaTypeModal.modal("show");
    }

    function saveFunctionAreaType() {

        if (com.validate("functionAreaTypeModal"))
            return false;

        var url = api.quotation.addFunctionAreaType;
        var options = {
            "functionAreaType.name": functionAreaType.items.typeName.val()
        };

        if (functionAreaType.items.fatId.val() != '0') {
            url = api.quotation.updateFunctionAreaType;
            options["functionAreaType.fatId"] = functionAreaType.items.fatId.val();
        }

        com.post(url, options, function() {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            functionAreaType.modals.functionAreaTypeModal.modal("hide");
        });
    }

    function updateFunctionAreaTypeStatus(fatId, status) {

        com.post(api.quotation.updateFunctionAreaTypeForStatus, {
            "functionAreaType.fatId": fatId,
            "functionAreaType.status": status
        }, function() {

            searcher.doSearch();
        });
    }

});
