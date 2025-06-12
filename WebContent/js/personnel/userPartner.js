$(function() {

    var userPartner = {

        modals: {
            addUserPartnerModal: com.focusPage("#addUserPartnerModal")
        },

        items: {
            partner: com.focusPage("#partner", "#addUserPartnerModal"),
            type: com.focusPage("#type", "#addUserPartnerModal")
        },

        btns: {
            saveUserPartnerBtn: com.focusPage("#saveUserPartnerBtn", "#addUserPartnerModal")
        },
    };

    userPartner.modals.addUserPartnerModal.on("show.bs.modal", function(a) {

        com.cleanItems(userPartner.items);
    });

    com.initTypeahead(userPartner.items.partner, api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, "autoFillKeyValue", "key", "value");

    userPartner.items.type.bindData(constant.personel().userPartner.type.datas, "key", "value");

    var searcher = new Searcher();

    searcher.set("partnerCondList", "partnerPagenation", "partnerResultList", api.personel.queryUserPartner, {
        "userPartner.uid": params.personel.partner.uid
    }, null, null, "userPartners", true);

    searcher.button([{
        id: "createUserPartner",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    var btns = [{
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.personel.deleteUserPartner, {
                "userPartner.upid": v.upid
            }, function(res) {

                searcher.doSearch();
            });
        }
    }];

    var props = [{
        field: "partner.userName",
        name: "合作人",
        prop: "partner.userName",
        clazz: "grey"
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.personel().userPartner.type.keys
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.personel().userPartner.status.keys
    }];

    searcher.line("partner.currentName", props, btns).render();

    com.focusPage("#createUserPartner").click(function() {

        userPartner.modals.addUserPartnerModal.modal("show");
    });

    userPartner.btns.saveUserPartnerBtn.click(function() {

        if (com.validate('addUserPartnerModal')) {
            return false;
        }

        if (!com.typeahead(userPartner.items.partner)) {
            com.showAlert(com.warning, "输入名称不匹配");
            return;
        }

        var options = {
            "userPartner.uid": params.personel.partner.uid,
            "userPartner.partner.userId": com.typeahead(userPartner.items.partner),
            "userPartner.type": userPartner.items.type.val()
        };

        com.post(api.personel.addUserPartner, options, function(res) {

            searcher.doSearch();
            userPartner.modals.addUserPartnerModal.modal("hide");
        });
    });
});