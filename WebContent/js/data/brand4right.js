jQuery(function($) {

    var right = {

        items: {
            brandright: com.focusPage("#brandright", "#brandRightModal"),
        },
        modals: {
            brandRightModal: com.focusPage("#brandRightModal"),
        },
        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
        },

        userId: "",
    };

    right.items.brandright.tag({
        placeholder: right.items.brandright.attr('placeholder'),
        isStaticResource: false,
        flsource: {
            url: api.data.queryBrandByPinyin,
            query: "brand.pinyin",
            postData: {},
            resultList: "brands",
            keyPath: "bid",
            valuePath: "name",
            isResultTypeMap: true, // 是否是key - value 形式的列表
        },
    });

    var searcher = new Searcher();

    searcher.init(["data-model-righter"], "condList", api.personel.pageUser, function(data) {

    }, "pagenation", "brandUserRightPostData", {
        "user.duty.name": "驻店导购"
    });

    searcher.base("condList", "pagenation", "resultList", api.personel.pageUser);
    searcher.condition(["data-model-righter"]);

    var lineprops = [{
        field: "userId",
        name: "编号",
        prop: "userId",
        clazz: "grey"
    }, {
        field: "loginId",
        name: "用户名",
        prop: "loginId",
        clazz: "grey"
    }, ];

    var linebtns = [{
        name: "权限",
        clazz: "btn-yellow",
        handle: function(v) {

            dialog(v.uid);

            return false;
        },
    }, ];

    searcher.line("userName", lineprops, linebtns).render();

    function dialog(uid) {

        right.userId = uid;

        com.post(api.right.queryBrandUserRightByUid, {
            "brandUserRight.uid": uid
        }, function(res) {

            var _tag = com.focusPage('#brandright').data('tag');

            while (_tag.values.length > 0) {
                _tag.remove(0)
            }

            if (res.brandUserRight.brands.length) {
                $.each(res.brandUserRight.brands, function(i, v) {

                    _tag.fladd(v.bid.toString(), v.name);
                });

            }
        });

        right.modals.brandRightModal.modal("show");
    }

    function saveData() {

        if (com.validate("brandRightModal"))
            return false;

        var options = {};

        var brandIds = right.items.brandright.val();

        options["brandUserRight.uid"] = right.userId;

        if (!brandIds)
            return false;

        brandIds = brandIds.split(', ');

        if (brandIds.length == 0)
            return false;

        $.each(brandIds, function(i, v) {

            options['bids[' + i + ']'] = v;
        });

        com.post(api.right.updateBrandUserRight, options, function(res) {

            right.modals.brandRightModal.modal("hide");
        });

    }

});