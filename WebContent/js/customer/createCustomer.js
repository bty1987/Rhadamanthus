jQuery(function ($) {
    var createcustomerOrigin = {
        grade: ["A", "B", "C", "D"],
        items: {},
        saveBtn: null,
        cancelBtn: null
    };

    com.initTypeahead('designerId', api.personel.queryUserByPinyin, "pinyinName", {"user.status": 0}, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('villageNoCreate', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value", function(list, k, v){
        com.post(api.data.queryVillageById, {"village.no": k}, function (res) {
            createcustomerOrigin.items.rule.html("推荐楼牌号规则: " + (res.village.rule == null || res.village.rule == "" ? "暂无推荐规则" : res.village.rule));
        }, null, false);
        return v;
    });

    createcustomerOrigin.saveBtn = com.focusPage("#saveBtn").on("click", addcustomerOrigin);
    createcustomerOrigin.cancelBtn = com.focusPage("#cancelBtn").on("click", deleteDate);

    createcustomerOrigin.items.name = com.focusPage("#name");
    createcustomerOrigin.items.gender = com.focusPage("#gender");
    createcustomerOrigin.items.phone = com.focusPage("#phone");
    createcustomerOrigin.items.purpose = com.focusPage("#purpose");
    createcustomerOrigin.items.intention = com.focusPage("#intention");
    createcustomerOrigin.items.price = com.focusPage("#price");
    createcustomerOrigin.items.grade = com.focusPage("#grade");
    createcustomerOrigin.items.comment = com.focusPage("#comment");

    createcustomerOrigin.items.designerId = com.focusPage("#designerId");
    createcustomerOrigin.items.villageNoCreate = com.focusPage("#villageNoCreate");
    createcustomerOrigin.items.rule = com.focusPage("#rule");
    createcustomerOrigin.items.houseNumber = com.focusPage("#houseNumber");
    createcustomerOrigin.items.buildArea = com.focusPage("#buildArea");

    createcustomerOrigin.items.grade.bindData(createcustomerOrigin.grade, "key", "value", false);
    createcustomerOrigin.items.gender.switchBtn("gender");

    function addcustomerOrigin() {
        if (com.validate("addcustomersource")) return;

        var options = {};
        options["customerOrigin.name"] = createcustomerOrigin.items.name.val();
        options["customerOrigin.gender"] = com.genderType[createcustomerOrigin.items.gender.prop("checked")];
        options["customerOrigin.phone"] = createcustomerOrigin.items.phone.val();
        options["customerOrigin.purpose"] = createcustomerOrigin.items.purpose.val();
        options["customerOrigin.intention"] = createcustomerOrigin.items.intention.val();
        options["customerOrigin.price"] = createcustomerOrigin.items.price.val();
        options["customerOrigin.grade"] = createcustomerOrigin.items.grade.val();
        options["customerOrigin.comment"] = createcustomerOrigin.items.comment.val();
        options["customerOrigin.designer.userId"] = com.typeahead("designerId");
        options["customerOrigin.village.no"] = com.typeahead("villageNoCreate");
        options["customerOrigin.houseNumber"] = createcustomerOrigin.items.houseNumber.val();
        options["customerOrigin.buildArea"] = createcustomerOrigin.items.buildArea.val();

        com.post(api.customer.addCustomerOrigin, options, function (res) {
            com.showAlert(com.info, "客源创建成功");
            deleteDate();
        });
    }

    function deleteDate() {
        com.cleanTypeahead("designerId");
        com.cleanTypeahead("villageNoCreate");
        com.cleanItems(createcustomerOrigin.items);
        com.cleanItems(createcustomerOrigin.customerItems);
        com.clearValidator();
        com.focusPage("#rule").html("");
    }
});
