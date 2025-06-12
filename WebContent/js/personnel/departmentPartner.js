$(function() {

    var departmentPartner = {

        modals: {
            addDepartmentPartnerModal: com.focusPage("#addDepartmentPartnerModal")
        },

        items: {
            partner: com.focusPage("#partner", "#addDepartmentPartnerModal"),
            type: com.focusPage("#type", "#addDepartmentPartnerModal")
        },

        btns: {
            saveDepartmentPartnerBtn: com.focusPage("#saveDepartmentPartnerBtn", "#addDepartmentPartnerModal")
        },
    };

    departmentPartner.modals.addDepartmentPartnerModal.on("show.bs.modal", function(a) {

        com.cleanItems(departmentPartner.items);
    });

    com.initTypeahead(departmentPartner.items.partner, api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, "autoFillKeyValue", "key", "value");

    departmentPartner.items.type.bindData(constant.personel().userPartner.type.datas, "key", "value");

    var searcher = new Searcher();

    searcher.set("partnerCondList", "partnerPagenation", "partnerResultList", api.personel.queryDepartmentPartner, {
        "departmentPartner.did": params.personel.did
    }, null, null, "departmentPartners", true);

    searcher.button([{
        id: "createDepartmentPartner",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    var btns = [{
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.personel.deleteDepartmentPartner, {
                "departmentPartner.dpid": v.dpid
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

    com.focusPage("#createDepartmentPartner").click(function() {

        departmentPartner.modals.addDepartmentPartnerModal.modal("show");
    });

    departmentPartner.btns.saveDepartmentPartnerBtn.click(function() {

        if (com.validate('addDepartmentPartnerModal')) {
            return false;
        }

        if (!com.typeahead(departmentPartner.items.partner)) {
            com.showAlert(com.warning, "输入名称不匹配");
            return;
        }

        var options = {
            "departmentPartner.did": params.personel.did,
            "departmentPartner.partner.userId": com.typeahead(departmentPartner.items.partner),
            "departmentPartner.type": departmentPartner.items.type.val()
        };

        com.post(api.personel.addDepartmentPartner, options, function(res) {

            searcher.doSearch();
            departmentPartner.modals.addDepartmentPartnerModal.modal("hide");
        });
    });
});