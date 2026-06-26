jQuery(function($) {

    var category = {
        saveBtn: null,
        cancelBtn: null,
        modal: null,
        items: {},
        type: {},
        isCoupon: {},
        isCount: {},
        repeatFlg: false,

        validator: {
            categoryId: {
                type: "v_categoryId",
                regex: /^C_\d{3}$/g,
                errorMsg: "请以C_作为前缀 , 之后以三位数字组成(如C_001)."
            }
        },
        
        cid: null,
    };

    category.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
    category.cancelBtn = com.focusPage("#cancelBtn");

    category.modal = com.focusPage("#categoryModal").on('show.bs.modal', function(e) {

        com.clearValidator();
        com.clearValidator("#no", true);
    });

    category.items.cId = com.focusPage("#cId");
    category.items.no = com.focusPage("#no");
    category.items.categoryName = com.focusPage("#categoryName");
    category.items.kino = com.focusPage("#kino");
    category.items.kiname = com.focusPage("#kiname");
    category.items.type = com.focusPage("#type");
    category.items.isCoupon = com.focusPage("#isCoupon");
    category.items.isCount = com.focusPage("#isCount");
    category.items.isLimit = com.focusPage("#isLimit");

    // com.post(api.ds.data, {}, function(res) {
    //
    // category.items.type.bindData(res.categoryType, "key", "value");
    // });

    category.items.type.bindData(constant.data.category.type.datas, 'key', 'value');
    category.items.isCoupon.bindData(constant.data.category.isCoupon.datas, 'key', 'value');
    category.items.isCount.bindData(constant.data.category.isCount.datas, 'key', 'value');
    category.items.isLimit.bindData(constant.data.category.isLimit.datas, 'key', 'value');

    $.extend(com.validator, category.validator);

    function buildCategoryLineprops() {

        return [{
            field: "type",
            name: "类型",
            prop: function(v) { return constant.data().category.type.keys[v.type]; },
            clazz: "red"
        }, {
            field: "isCoupon",
            name: "券标识",
            prop: function(v) { return constant.data().category.isCoupon.keys[v.isCoupon]; },
            clazz: "red"
        }, {
            field: "isCount",
            name: "统计标识",
            prop: function(v) { return constant.data().category.isCount.keys[v.isCount]; },
            clazz: "red"
        }, {
            field: "isLimit",
            name: "选材控制",
            prop: function(v) { return constant.data().category.isLimit.keys[v.isLimit]; },
            clazz: "red"
        }, {
            field: "kino",
            name: "金蝶编号",
            prop: function(v) { return com.checkNull(v.kino, "无"); },
            clazz: "grey"
        }, {
            field: "kiname",
            name: "金蝶名称",
            prop: function(v) { return com.checkNull(v.kiname, "无"); },
            clazz: "grey"
        }];
    }

    function buildCategoryLinebtns() {

        return {
            edit: {name: "编辑", clazz: "btn-yellow", handle: function(v) { editCategory(v); }}
        };
    }

    function buildCategoryButtons() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'add').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    }

    var _condArr = ["data-category-name", "data-category-isCoupon", "data-category-isCount"];
    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.data.pageCategory, null, _condArr, "categoryPostData", null, false, buildCategoryButtons);
    searcher.line(function(v) {

        return v.no + " " + v.name;
    }, buildCategoryLineprops(), buildCategoryLinebtns()).render();

    com.focusPage('a[name="add"]', '#pagenation').click(function() {

        category.cid = null;

        com.cleanItems(category.items);

        category.items.no.css("display", "none");

        category.modal.modal("show");
    });

    function editCategory(v) {

        category.cid = v.cid;

        category.items.cId.val(v.cid);
        category.items.no.val(v.no).attr("disabled", "true").css("display", "block");
        category.items.categoryName.val(v.name);
        category.items.kino.val(v.kino);
        category.items.kiname.val(v.kiname);
        category.items.type.val(v.type);
        category.items.isCoupon.val(v.isCoupon);
        category.items.isCount.val(v.isCount);
        category.items.isLimit.val(v.isLimit);

        category.modal.modal("show");
    }

    function saveData() {

        if (com.validate("categoryModal") || category.repeatFlg) {
            return false;
        }

        var url = api.data.addCategory;
        var options = {
            'category.no': category.items.no.val(),
            'category.name': category.items.categoryName.val(),
            'category.kino': category.items.kino.val(),
            'category.kiname': category.items.kiname.val(),
            'category.type': category.items.type.val(),
            'category.isCoupon': category.items.isCoupon.val(),
            'category.isCount': category.items.isCount.val(),
            'category.isLimit': category.items.isLimit.val(),
        };

        if (category.cid) {
            url = api.data.updateCategory;
            options['category.cid'] = category.items.cId.val();
        }

        com.post(url, options, function(res) {

            searcher.doSearch();

            var no = res.category.no;

            if (category.cid)
                no = category.items.no.val();

            var categoryData = {
                "no": no,
                "name": category.items.categoryName.val(),
                "companyName": "方林集团"
            };

            kingdeeUtils.category(categoryData);
        });

        category.modal.modal("hide");
    }

});
