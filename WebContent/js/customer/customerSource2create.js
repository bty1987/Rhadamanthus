jQuery(function($) {

    var createcustomerOrigin = {
        saveBtn: com.focusPage("#saveBtn", "#addcustomersource"),
        cancelBtn: com.focusPage("#cancelBtn", "#addcustomersource"),

        items: {
            name: com.focusPage("#name", "#addcustomersource"),
            gender: com.focusPage("#gender", "#addcustomersource"),
            phone: com.focusPage("#phone", "#addcustomersource"),
            purpose: com.focusPage("#purpose", "#addcustomersource"),
            intention: com.focusPage("#intention", "#addcustomersource"),
            price: com.focusPage("#price", "#addcustomersource"),
            grade: com.focusPage("#grade", "#addcustomersource"),
            comment: com.focusPage("#comment", "#addcustomersource"),

            villageNoCreate: com.focusPage("#villageNoCreate", "#addcustomersource"),
            rule: com.focusPage("#rule", "#addcustomersource"),
            houseNumber: com.focusPage("#houseNumber", "#addcustomersource"),
            buildArea: com.focusPage("#buildArea", "#addcustomersource"),
            freeArea: com.focusPage("#freeArea", "#addcustomersource"),
            totalArea: com.focusPage("#totalArea", "#addcustomersource"),
            innerArea: com.focusPage("#innerArea", "#addcustomersource"),
            designer: com.focusPage("#designer", "#addcustomersource"),
            salesman: com.focusPage("#salesman", "#addcustomersource"),
            decorationBusitype: com.focusPage("#decorationBusitype", "#addcustomersource")
        },
        grade: ["A", "B", "C", "D"],
        decorationBusitypes: []
    };

    com.post(api.data.queryDecorationBusitype, {}, function(res) {

        var decorationBusitypes = [];

        $.each(res.decorationBusitypes, function(intex, value) {

            if (value.status == 0) {
                decorationBusitypes.push(value);
            }
        });

        createcustomerOrigin.items.decorationBusitype.bindData(decorationBusitypes, 'dbid', 'name');
    });

    createcustomerOrigin.saveBtn.bindClick(addcustomerOrigin);
    createcustomerOrigin.cancelBtn.bindClick(deleteDate);

    com.initTypeahead('designer', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0
    }, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('salesman', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0
    }, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('villageNoCreate', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value", function(list, k, v) {

        com.post(api.data.queryVillageByVid, {
            "village.no": k
        }, function(res) {

            createcustomerOrigin.items.rule.html("推荐楼牌号规则: " + (res.village.rule == null || res.village.rule == "" ? "暂无推荐规则" : res.village.rule));
        }, null, false);
        return v;
    });

    createcustomerOrigin.items.grade.bindData(createcustomerOrigin.grade, "key", "value", false);
    createcustomerOrigin.items.gender.switchBtn("gender");

    createcustomerOrigin.items.freeArea.val(0);
    createcustomerOrigin.items.innerArea.val(0);

    createcustomerOrigin.items.buildArea.on("change", function(e) {

        getTotalArea();
    });

    createcustomerOrigin.items.freeArea.on("change", function(e) {

        getTotalArea();
    });

    function addcustomerOrigin() {

        if (com.validate("addcustomersource"))
            return false;

        var options = {
            "customerOrigin.name": createcustomerOrigin.items.name.val(),
            "customerOrigin.gender": com.genderType[createcustomerOrigin.items.gender.prop("checked")],
            "customerOrigin.phone": createcustomerOrigin.items.phone.val(),
            "customerOrigin.purpose": createcustomerOrigin.items.purpose.val(),
            "customerOrigin.intention": createcustomerOrigin.items.intention.val(),
            "customerOrigin.price": createcustomerOrigin.items.price.val(),
            "customerOrigin.grade": createcustomerOrigin.items.grade.val(),
            "customerOrigin.comment": createcustomerOrigin.items.comment.val(),
            "customerOrigin.village.no": com.typeahead("villageNoCreate"),
            "customerOrigin.houseNumber": createcustomerOrigin.items.houseNumber.val(),
            "customerOrigin.buildArea": createcustomerOrigin.items.buildArea.val(),
            "customerOrigin.freeArea": createcustomerOrigin.items.freeArea.val(),
            "customerOrigin.totalArea": createcustomerOrigin.items.totalArea.val(),
            "customerOrigin.innerArea": createcustomerOrigin.items.innerArea.val(),
            "customerOrigin.designer.userId": com.typeahead("designer"),
            "customerOrigin.salesman.userId": com.typeahead("salesman"),
            "customerOrigin.decorationBusitype.dbid": createcustomerOrigin.items.decorationBusitype.val()
        };

        com.post(api.customer.addCustomerOrigin, options, function(res) {

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

    function getTotalArea() {

        var buildArea = parseFloat(createcustomerOrigin.items.buildArea.val());
        var freeArea = parseFloat(createcustomerOrigin.items.freeArea.val());
        createcustomerOrigin.items.totalArea.val(utils.accAdd(buildArea, freeArea));
    }
});
