$(function() {

    var supplier4partner = {

        modals: {
            addSupplierPartnerModal: com.focusPage("#addSupplierPartnerModal")
        },

        items: {
            instorer: com.focusPage("#instorer", "#addSupplierPartnerModal")
        },

        btns: {
            saveUserPartnerBtn: com.focusPage("#saveSupplierPartnerBtn", "#addSupplierPartnerModal")
        },
    };

    supplier4partner.modals.addSupplierPartnerModal.on("show.bs.modal", function(a) {

        com.cleanItems(supplier4partner.items);
        com.cleanTypeahead('instorer');
    });

    com.initTypeahead(supplier4partner.items.instorer, api.personel.queryInstorerByPinyin, "instorer.pinYin", {
        "user.status": 0
    }, "instorers", "userId", "userName", null);

    var searcher = new Searcher();

    searcher.set("partnerCondList", "partnerPagenation", "partnerResultList", api.personel.queryUserPartner, {
        "userPartner.uid": params.personel.uid,
        "userPartner.type": 5 // UserPartnerPO.TYPE_SUPPLIER_INT 厂商关联用户
    }, null, null, "userPartners", true);

    searcher.button([{
        id: "createSupplierPartner",
        name: "添加",
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
        field: "partner.userId",
        name: "编号",
        prop: "partner.userId",
        clazz: "grey"
    }, {
        field: "partner.currentName",
        name: "名称",
        prop: "partner.currentName",
        clazz: "grey"
    }, {
        field: "partner.phone",
        name: "电话",
        prop: "partner.phone",
        clazz: "grey"
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.personel().userPartner.status.keys
    }];

    searcher.line("partner.currentName", props, btns).render();

    com.focusPage("#createSupplierPartner").click(function() {

        supplier4partner.modals.addSupplierPartnerModal.modal("show");
    });

    supplier4partner.btns.saveUserPartnerBtn.click(function() {

        if (com.validate('addSupplierPartnerModal')) {
            return false;
        }

        if (!com.typeahead(supplier4partner.items.instorer)) {
            com.showAlert(com.warning, "输入名称不匹配");
            return;
        }

        var options = {
            "userPartner.uid": params.personel.uid,
            "userPartner.partner.userId": com.typeahead(supplier4partner.items.instorer),
            "userPartner.type": 5
        };

        com.post(api.personel.addUserPartner, options, function(res) {

            searcher.doSearch();
            supplier4partner.modals.addSupplierPartnerModal.modal("hide");
        });
    });
});