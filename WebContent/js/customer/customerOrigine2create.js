jQuery(function($) {

    var customerOrigine = {
        saveBtn: com.focusPage("#saveBtn", "#addcustomerorigine"),
        cancelBtn: com.focusPage("#cancelBtn", "#addcustomerorigine"),

        items: {
            name: com.focusPage("#name", "#addcustomerorigine"),
            gender: com.focusPage("#gender", "#addcustomerorigine"),
            phone: com.focusPage("#phone", "#addcustomerorigine"),
            purpose: com.focusPage("#purpose", "#addcustomerorigine"),
            intention: com.focusPage("#intention", "#addcustomerorigine"),
            price: com.focusPage("#price", "#addcustomerorigine"),
            grade: com.focusPage("#grade", "#addcustomerorigine"),
            comment: com.focusPage("#comment", "#addcustomerorigine"),

            villageNoCreate: com.focusPage("#villageNoCreate", "#addcustomerorigine"),
            rule: com.focusPage("#rule", "#addcustomerorigine"),
            houseNumber: com.focusPage("#houseNumber", "#addcustomerorigine"),
            buildArea: com.focusPage("#buildArea", "#addcustomerorigine"),
            freeArea: com.focusPage("#freeArea", "#addcustomerorigine"),
            totalArea: com.focusPage("#totalArea", "#addcustomerorigine"),
            innerArea: com.focusPage("#innerArea", "#addcustomerorigine"),
            designer: com.focusPage("#designer", "#addcustomerorigine"),
            salesman: com.focusPage("#salesman", "#addcustomerorigine"),
            decorationBusitype: com.focusPage("#decorationBusitype", "#addcustomerorigine")
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

        customerOrigine.items.decorationBusitype.bindData(decorationBusitypes, 'dbid', 'name');
    });

    customerOrigine.saveBtn.bindClick(addcustomerOrigin);
    customerOrigine.cancelBtn.bindClick(deleteDate);

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

            customerOrigine.items.rule.html("推荐楼牌号规则: " + (res.village.rule == null || res.village.rule == "" ? "暂无推荐规则" : res.village.rule));
        }, null, false);
        return v;
    });

    customerOrigine.items.grade.bindData(customerOrigine.grade, "key", "value", false);
    customerOrigine.items.gender.switchBtn("gender");

    customerOrigine.items.freeArea.val(0);
    customerOrigine.items.innerArea.val(0);

    customerOrigine.items.buildArea.on("change", function(e) {

        getTotalArea();
    });

    customerOrigine.items.freeArea.on("change", function(e) {

        getTotalArea();
    });

    function addcustomerOrigin() {

        if (com.validate("addcustomerorigine"))
            return false;

        var options = {
            "customerOrigin.name": customerOrigine.items.name.val(),
            "customerOrigin.gender": com.genderType[customerOrigine.items.gender.prop("checked")],
            "customerOrigin.phone": customerOrigine.items.phone.val(),
            "customerOrigin.purpose": customerOrigine.items.purpose.val(),
            "customerOrigin.intention": customerOrigine.items.intention.val(),
            "customerOrigin.price": customerOrigine.items.price.val(),
            "customerOrigin.grade": customerOrigine.items.grade.val(),
            "customerOrigin.comment": customerOrigine.items.comment.val(),
            "customerOrigin.village.no": com.typeahead("villageNoCreate"),
            "customerOrigin.houseNumber": customerOrigine.items.houseNumber.val(),
            "customerOrigin.buildArea": customerOrigine.items.buildArea.val(),
            "customerOrigin.freeArea": customerOrigine.items.freeArea.val(),
            "customerOrigin.totalArea": customerOrigine.items.totalArea.val(),
            "customerOrigin.innerArea": customerOrigine.items.innerArea.val(),
            "customerOrigin.designer.userId": com.typeahead("designer"),
            "customerOrigin.salesman.userId": com.typeahead("salesman"),
            "customerOrigin.decorationBusitype.dbid": customerOrigine.items.decorationBusitype.val()
        };

        com.post(api.customer.addCustomerOrigin, options, function(res) {

            com.showAlert(com.info, "客源创建成功");
            deleteDate();
        });
    }

    function deleteDate() {

        com.cleanTypeahead("villageNoCreate");
        com.cleanItems(customerOrigine.items);
        com.cleanItems(customerOrigine.customerItems);
        com.focusPage("#rule").html("");
        customerOrigine.items.freeArea.val(0);
        customerOrigine.items.innerArea.val(0);
    }

    function getTotalArea() {

        var buildArea = parseFloat(customerOrigine.items.buildArea.val());
        var freeArea = parseFloat(customerOrigine.items.freeArea.val());
        customerOrigine.items.totalArea.val(utils.accAdd(buildArea, freeArea));
    }
});
