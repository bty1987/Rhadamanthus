jQuery(function ($) {

    var chating = {

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
        },

        modals: {
            chatingModal: com.focusPage("#chatingModal"),
        },

        items: {
            title: com.focusPage("#title", "#chatingModal"),
            content: com.focusPage("#content", "#chatingModal"),
            type: com.focusPage("#type", "#chatingModal"),
            atttype: com.focusPage('#atttype', "#chatingModal"),
            path: com.focusPage('#path', "#chatingModal"),
        },
        cid: null,

        status: {},
        type: {},
        atttype: {},
    };

    chating.modals.chatingModal.on('hide.bs.modal', function (e) {
        chating.cid = null;
        com.cleanItems(chating.items);
        com.closeTip();
    });

    com.post(api.ds.data, {}, function (res) {

        chating.status = res.chatingStatus.split("key", "value");
        chating.type = res.chatingType.split("key", "value");
        chating.atttype = res.chatingAtttype.split("key", "value");

        chating.items.type.bindData(res.chatingType, "key", "value");
        chating.items.atttype.bindData(res.chatingAtttype, "key", "value");

    }, null, false);

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pageChating);
    searcher.condition(['data-chating-type']);

    searcher.button([{
        id: "addChating",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        fieId: "title",
        name: "标题",
        prop: "title",
        clazz: "blue"
    }, {
        field: "content",
        name: "内容",
        prop: "content",
        clazz: "grey"
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        clazz: "grey",
        dataset: chating.type
    }, {
        field: "atttype ",
        name: "业务类型",
        prop: "atttype",
        clazz: "grey",
        dataset: chating.atttype
    }, {
        field: "path",
        name: "路径",
        prop: "path",
        clazz: "grey"
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: chating.status
    }];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-success",
        handle: function (v) {
            chating.cid = v.cid;

            chating.items.title.val(v.title);
            chating.items.content.val(v.content);
            chating.items.type.val(v.type);
            chating.items.atttype.val(v.atttype);
            chating.items.path.val(v.path);
            chating.modals.chatingModal.modal("show");
            return false;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function (v) {

            var url = api.data.deleteChating;
            var options = {
                "chating.cid": v.cid,
            };
            com.post(url, options, function (data) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
            return false;
        },
    }, {
        name: "启用", clazz: "btn-success", handle: function (v) {
            updateStatus(v.cid, 0);
            return false;
        }, show: function (v) {
            return v.status == 1;
        }
    },
        {
            name: "禁用", clazz: "btn-danger", handle: function (v) {
                updateStatus(v.cid, 1);
                return false;
            }, show: function (v) {
                return v.status == 0;
            }
        },];

    searcher.line("title", lineprops, linebtns).render();

    com.focusPage('#addChating', '#pagenation').on("click", function () {

        chating.modals.chatingModal.modal("show");
    });

    function saveData() {

        if (com.validate('chatingModal'))
            return false;

        var url;

        var options = {
            "chating.title": chating.items.title.val(),
            "chating.content": chating.items.content.val(),
            "chating.type": chating.items.type.val(),
            "chating.atttype": chating.items.atttype.val(),
            "chating.path": chating.items.path.val(),
        };
        if (chating.cid) {
            url = api.data.updateChating;
            options["chating.cid"] = chating.cid;
        } else {
            url = api.data.addChating;
        }

        com.post(url, options, function (res) {

            searcher.doSearch();
        });
        chating.cid = null;
        chating.modals.chatingModal.modal("hide");
    }

    function updateStatus(cid, status){

        com.post(api.data.updateChatingForStatus, {"chating.cid": cid, "chating.status": status}, function(){
            searcher.doSearch();
        });
    }
});
