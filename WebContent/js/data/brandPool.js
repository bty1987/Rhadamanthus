$(function() {

    var brandPool = {
        bpid: null,

        modals: {
            brandPoolModal: com.focusPage("#brandPoolModal")
        },

        items: {
            name: com.focusPage("#name", "#brandPoolModal"),
            comment: com.focusPage("#comment", "#brandPoolModal"),
            category: com.focusPage("#category", "#brandPoolModal")
        }
    };

    brandPool.modals.brandPoolModal.on('hide.bs.modal', function(e) {

        com.clearValidator();
        com.cleanItems(brandPool.items);
    });

    com.post(api.data.queryCategory, {}, function(res) {

        brandPool.items.category.bindData(res.categorys, "cid", "name");
    });

    var btns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            brandPool.bpid = v.bpid;
            brandPool.items.name.val(v.name);
            brandPool.items.category.val(v.category.cid);
            brandPool.items.comment.val(v.comment);

            brandPool.modals.brandPoolModal.modal("show");
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.data.updateBrandPoolForStatus, {
                "brandPool.bpid": v.bpid,
                "brandPool.status": check ? 0 : 1
            });

            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }];

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pageBrandPool);
    searcher.condition(["data-brandPool-name"]);
    searcher.history("brandPoolPostData");

    searcher.button([{
        id: "addBrandPool",
        name: "添加",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        field: "name",
        name: "名称",
        prop: "name",
        clazz: "grey"
    }, {
        field: "category.name",
        name: "品类",
        prop: "category.name",
        clazz: "grey"
    }, {
        field: "comment",
        name: "说明",
        prop: "comment",
        clazz: "grey"
    }];

    searcher.line(function(v) {

        return v.no + " " + v.name;
    }, lineprops, btns).render();

    com.focusPage('#addBrandPool', '#pagenation').on("click", function() {

        brandPool.bpid = null;

        brandPool.modals.brandPoolModal.modal("show");
    });

    com.focusPage('#saveBtn').on("click", function() {

        if (com.validate('brandPoolModal'))
            return false;

        var url = api.data.addBrandPool;
        var options = {
            'brandPool.name': brandPool.items.name.val(),
            'brandPool.category.cid': brandPool.items.category.val(),
            'brandPool.comment': brandPool.items.comment.val(),
        };

        if (brandPool.bpid != null) {
            url = api.data.updateBrandPool;
            options["brandPool.bpid"] = brandPool.bpid;
        }

        com.post(url, options, function(res) {

            searcher.doSearch();
        });

        brandPool.modals.brandPoolModal.modal("hide");
    });

});