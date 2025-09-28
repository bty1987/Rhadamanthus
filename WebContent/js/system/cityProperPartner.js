$(function() {

    var cityProperPartner = {

        modals: {
            addCityProperPartnerModal: com.focusPage("#addCityProperPartnerModal")
        },

        items: {
            partner: com.focusPage("#partner", "#addCityProperPartnerModal"),
            type: com.focusPage("#type", "#addCityProperPartnerModal")
        },

        btns: {
            saveCityProperPartnerBtn: com.focusPage("#saveCityProperPartnerBtn", "#addCityProperPartnerModal")
        },
    };

    cityProperPartner.modals.addCityProperPartnerModal.on("show.bs.modal", function(a) {

        com.cleanItems(cityProperPartner.items);
    });

    com.initTypeahead(cityProperPartner.items.partner, api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "cityProperType.name": ""
    }, "autoFillKeyValue", "key", "value");

    cityProperPartner.items.type.bindData(constant.personel().cityPartner.type.datas, "key", "value");

    var searcher = new Searcher();

    searcher.set("cityPartnerCondList", "cityPartnerPagenation", "cityPartnerResultList", api.system.queryCityProperPartner, {
        "cityProperPartner.cpid": params.system.cpid
    }, null, null, "cityProperPartners", true);

    searcher.button([{
        id: "createCityProperPartner",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    var btns = [{
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.system.deleteCityProperPartner, {
                "cityProperPartner.cppid": v.cppid
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
        dataset: constant.personel().cityPartner.type.keys
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.personel().userPartner.status.keys
    }];

    searcher.line("partner.currentName", props, btns).render();

    com.focusPage("#createCityProperPartner").click(function() {

        cityProperPartner.modals.addCityProperPartnerModal.modal("show");
    });

    cityProperPartner.btns.saveCityProperPartnerBtn.click(function() {

        if (com.validate('addCityProperPartnerModal')) {
            return false;
        }

        if (!com.typeahead(cityProperPartner.items.partner)) {
            com.showAlert(com.warning, "输入名称不匹配");
            return;
        }

        var options = {
            "cityProperPartner.cpid": params.system.cpid,
            "cityProperPartner.partner.userId": com.typeahead(cityProperPartner.items.partner),
            "cityProperPartner.type": cityProperPartner.items.type.val()
        };

        com.post(api.system.addCityProperPartner, options, function(res) {

            searcher.doSearch();
            cityProperPartner.modals.addCityProperPartnerModal.modal("hide");
        });
    });
});