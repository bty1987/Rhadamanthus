jQuery(function ($) {
    var createcustomerOrigin = {
        saveBtn: com.focusPage("#saveBtn"),
        cancelBtn: com.focusPage("#cancelBtn"),

        items: {
            name: com.focusPage("#name"),
            gender: com.focusPage("#gender"),
            phone: com.focusPage("#phone"),
            purpose: com.focusPage("#purpose"),
            intention: com.focusPage("#intention"),
            price: com.focusPage("#price"),
            grade: com.focusPage("#grade"),
            comment: com.focusPage("#comment"),

            villageNoCreate: com.focusPage("#villageNoCreate"),
            rule: com.focusPage("#rule"),
            houseNumber: com.focusPage("#houseNumber"),
            buildArea: com.focusPage("#buildArea"),
            freeArea: com.focusPage("#freeArea"),
            totalArea: com.focusPage("#totalArea"),
            innerArea: com.focusPage("#innerArea")
        },
        grade: ["A", "B", "C", "D"]
    };

    createcustomerOrigin.saveBtn.bindClick(addcustomerOrigin);
    createcustomerOrigin.cancelBtn.bindClick(deleteDate);

    com.initTypeahead('villageNoCreate', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value", function(list, k, v){
        com.post(api.data.queryVillageById, {"village.no": k}, function (res) {
            createcustomerOrigin.items.rule.html("推荐楼牌号规则: " + (res.village.rule == null || res.village.rule == "" ? "暂无推荐规则" : res.village.rule));
        }, null, false);
        return v;
    });

    createcustomerOrigin.items.grade.bindData(createcustomerOrigin.grade, "key", "value", false);
    createcustomerOrigin.items.gender.switchBtn("gender");

    createcustomerOrigin.items.freeArea.val(0);
    createcustomerOrigin.items.innerArea.val(0);

    createcustomerOrigin.items.buildArea.on("change", function (e) {
        getTotalArea();
    });

    createcustomerOrigin.items.freeArea.on("change", function (e) {
        getTotalArea();
    });

    function addcustomerOrigin() {
        
        if (com.validate("addcustomersource")) return false;

        var options = {
            "customerOrigin.name" : createcustomerOrigin.items.name.val(),
            "customerOrigin.gender" : com.genderType[createcustomerOrigin.items.gender.prop("checked")],
            "customerOrigin.phone" : createcustomerOrigin.items.phone.val(),
            "customerOrigin.purpose" : createcustomerOrigin.items.purpose.val(),
            "customerOrigin.intention" : createcustomerOrigin.items.intention.val(),
            "customerOrigin.price" : createcustomerOrigin.items.price.val(),
            "customerOrigin.grade" : createcustomerOrigin.items.grade.val(),
            "customerOrigin.comment" : createcustomerOrigin.items.comment.val(),
            "customerOrigin.village.no" : com.typeahead("villageNoCreate"),
            "customerOrigin.houseNumber" : createcustomerOrigin.items.houseNumber.val(),
            "customerOrigin.buildArea" : createcustomerOrigin.items.buildArea.val(),
            "customerOrigin.freeArea" : createcustomerOrigin.items.freeArea.val(),
            "customerOrigin.totalArea" : createcustomerOrigin.items.totalArea.val(),
            "customerOrigin.innerArea" : createcustomerOrigin.items.innerArea.val()
        };

        com.post(api.customer.addCustomerOrigin, options, function (res) {
            com.showAlert(com.info, "客源创建成功");
            deleteDate();
        });
    }

    function deleteDate() {
        com.cleanTypeahead("villageNoCreate");
        com.cleanItems(createcustomerOrigin.items);
        com.cleanItems(createcustomerOrigin.customerItems);
        com.focusPage("#rule").html("");
        createcustomerOrigin.items.freeArea.val(0);
        createcustomerOrigin.items.innerArea.val(0);
    }

    function getTotalArea(){
        var buildArea = parseFloat(createcustomerOrigin.items.buildArea.val());
        var freeArea = parseFloat(createcustomerOrigin.items.freeArea.val());
        createcustomerOrigin.items.totalArea.val(utils.accAdd(buildArea, freeArea));
    }
});
