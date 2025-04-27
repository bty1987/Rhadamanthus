jQuery(function($) {

    var brandInstorer = {

        bid: params.data.brand.bid,

        btns: {
            saveBrandInstorer: com.focusPage("#saveBrandInstorer").on("click", saveData),
            addBrandInstorer: com.focusPage("#addBrandInstorer"),
        },
        modals: {
            brandInstorerModal: com.focusPage("#brandInstorerModal")
        },
        items: {
            instorer: com.focusPage('#instorer', "#brandInstorerModal"),
            agentName: com.focusPage('#agentName', "#brandInstorerModal"),
            agentPhone: com.focusPage('#agentPhone', "#brandInstorerModal"),
        },

    };
    brandInstorer.modals.brandInstorerModal.on("hide.bs.modal", function() {

        com.cleanItems(brandInstorer.items);
        com.cleanTypeahead('instorer');
        com.clearValidator();
        com.closeTip();
    });

    com.initTypeahead(brandInstorer.items.instorer, api.personel.queryInstorerByPinyin, "instorer.pinYin", {
        "user.status": 0
    }, "instorers", "userId", "userName", null);

    var searcher = new Searcher();

    searcher.base("bCondlist", "bPagenation", "list", api.communion.queryBrandInstorer);
    searcher.result("brandInstorers").isPage(true);
    searcher.param({
        "brandInstorer.brand.bid": brandInstorer.bid
    });

    var lineprops = [{
        fieId: "currentName",
        name: "驻店名称",
        prop: "instorer.currentName",
        clazz: "grey"
    }, {
        fieId: "instorer.loginId",
        name: "登录名",
        prop: "instorer.loginId",
        clazz: "grey"
    }, {
        fieId: "instorer.isLogin",
        name: "登陆状态",
        prop: function(v) {

            return v.instorer.isLogin == "0" ? "禁用" : "启用";
        },
        clazz: "red"
    }, {
        fieId: "agentName",
        name: "代理",
        prop: "agentName",
        clazz: "grey"
    }, {
        fieId: "agentPhone",
        name: "电话",
        prop: "agentPhone",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "删除",
        clazz: "btn-warning",
        handle: function(v) {

            com.post(api.communion.deleteBrandInstorer, {
                "brandInstorer.biid": v.biid
            }, function(res) {

                com.showAlert(com.info, "操作成功");

                searcher.doSearch();
            });
        }
    }];
    
    searcher.line("instorer.currentName", lineprops, linebtns).render();

    com.focusPage('#addBrandInstorer').on("click", function() {
        brandInstorer.modals.brandInstorerModal.modal("show");
    });

    function saveData() {

        if (com.validate('brandInstorerModal'))
            return false;

        var url = api.communion.addBrandInstorer;
        var options = {
            "brandInstorer.brand.bid": brandInstorer.bid,
            "brandInstorer.agentName": brandInstorer.items.agentName.val(),
            "brandInstorer.agentPhone": brandInstorer.items.agentPhone.val(),
            "brandInstorer.instorer.userId": com.typeahead(brandInstorer.items.instorer)
        };

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            brandInstorer.modals.brandInstorerModal.modal("hide");
        });
    }
});
