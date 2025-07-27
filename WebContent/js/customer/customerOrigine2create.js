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
            decorationBusitype: com.focusPage("#decorationBusitype", "#addcustomerorigine"),
            referCustomer: com.focusPage("#referCustomer", "#addcustomerorigine"),
            referPhone: com.focusPage("#referPhone", "#addcustomerorigine"),
            referOrderId: com.focusPage("#referOrderId", "#addcustomerorigine"),
            referVillage: com.focusPage("#referVillage", "#addcustomerorigine"),
            referHouseNumber: com.focusPage("#referHouseNumber", "#addcustomerorigine"),
            referContractTime: com.focusPage("#referContractTime", "#addcustomerorigine"),
            source: com.focusPage("#source", "#addcustomerorigine"),
            contact: com.focusPage("#contact", "#addcustomerorigine"),
        },

        refer: {
            orderId: null
        },

        grade: ["A", "B", "C", "D"],
        decorationBusitypes: []
    };

    function initVillage(containId) {

        com.initTypeahead(containId, api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value", function(list, k, v) {

            com.post(api.data.queryVillageByVid, {
                "village.no": k
            }, function(res) {

                customerOrigine.items.rule.html("推荐楼牌号规则: " + (res.village.rule == null || res.village.rule == "" ? "暂无推荐规则" : res.village.rule));
            }, null, false);
            return v;
        });
    }

    initVillage(com.focusPage("#referVillage", "#addcustomerorigine"));
    initVillage(com.focusPage("#villageNoCreate", "#addcustomerorigine"));

    com.focusPage('#referCustomer').on("click", function() {

        if (customerOrigine.items.referCustomer.prop("checked")) {
            com.focusPage(".referCustomerInfo", "#addcustomerorigine").show();
        } else {
            com.focusPage(".referCustomerInfo", "#addcustomerorigine").hide();
        }
    });

    customerOrigine.items.decorationBusitype.change(function(e) {
        
        var other = com.focusPage("#decorationBusitype option:selected").attr("other");
        
        if (!other)
            return false;

        if (other.indexOf('-') == -1)
            return false;

        var outside = other.split('-')[0];
        var isRefer = other.split('-')[1];

        if (outside == 0) {
            com.focusPage(".source", "#addcustomerorigine").hide();
            com.focusPage(".contact", "#addcustomerorigine").hide();
        } else {
            com.focusPage(".source", "#addcustomerorigine").show();
            com.focusPage(".contact", "#addcustomerorigine").show();
        }
        
        if (isRefer == 0) {
            com.focusPage("#referCustomer", "#addcustomerorigine").prop("checked", "checked").attr("disabled", "disabled");
            com.focusPage(".referCustomerInfo", "#addcustomerorigine").hide();
        } else {
            com.focusPage("#referCustomer", "#addcustomerorigine").prop("checked", "checked").attr("disabled", "disabled");
            com.focusPage(".referCustomerInfo", "#addcustomerorigine").show();
        }
    });

    customerOrigine.saveBtn.bindClick(addcustomerOrigin);
    customerOrigine.cancelBtn.bindClick(deleteDate);

    com.initTypeahead('designer', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0
    }, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('salesman', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0
    }, 'autoFillKeyValue', 'key', 'value', function(list, key, value){
        
        var user = null;
        
        com.post(api.personel.queryUserByUserId, {"user.userId": key}, function(res){
            
            user = res.user;
            
        }, null, false);
        
        if(user == null) return value;
        
        com.post(api.customer.queryCustomerDeptRuleByDid, {

            "customerDeptRule.department.did": user.dept.did,
        }, function(res) {

            var busitypes = [];

            $.each(res.customerDeptRules, function(i, v) {

                v.busitype.other = v.busitype.outside + "-" + v.busitype.isRefer;

                busitypes.push(v.busitype);
            });

            customerOrigine.items.decorationBusitype.bindData(busitypes, "dbid", "name", '请选择', null, "other").trigger("change");
        });
        
        return value;
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

    customerOrigine.items.referOrderId.blur(function() {

        var orderId = customerOrigine.items.referOrderId.val();

        var options = {
            "decoration.orderId": orderId
        }

        com.post(api.decoration.queryDecorationForCommonByOrderId, options, function(res) {

            var decoration = res.decoration;

            if (decoration.orderId) {
                customerOrigine.items.referOrderId.val(decoration.orderId);
                customerOrigine.items.referPhone.val((decoration.status == 3 || decoration.status == 7) ? (decoration.customer.phone.substring(0, 3) + '******' + decoration.customer.phone.substring(9)) : "客户电话");

                customerOrigine.refer.orderId = decoration.orderId;
            }

            if (decoration.precontractTime)
                customerOrigine.items.referContractTime.val(decoration.precontractTime);

            if (decoration.contractTime)
                customerOrigine.items.referContractTime.val(decoration.contractTime);

            if (decoration.house && decoration.house.village && decoration.house.village.name)
                customerOrigine.items.referVillage.val(decoration.house.village.name);

            if (decoration.house && decoration.house.houseNumber)
                customerOrigine.items.referHouseNumber.val(decoration.house.houseNumber);
        }, function(res) {

            com.showAlert(com.error, "推荐客户不存在");
            return false;
        });
    });

    customerOrigine.items.referPhone.blur(function() {

        customerOrigine.refer.orderId = null;

        var phone = customerOrigine.items.referPhone.val();

        var options = {
            "customerPhone": phone,
            "paging.page": 1,
            "paging.rows": 10,
        }

        var decoration = null;

        com.post(api.decoration.pageDecorationForCustomer, options, function(res) {

            if (res.paging.totalRecords == 0) {
                com.showAlert(com.error, "推荐客户不存在");
                return false;
            }

            var decorations = res.paging.data;

            $.each(decorations, function(i, v) {

                    decoration = v;

                if (decoration.orderId) {
                    customerOrigine.items.referOrderId.val(decoration.orderId);
                    customerOrigine.items.referPhone.val((decoration.status == 3 || decoration.status == 7) ? (decoration.customer.phone.substring(0, 3) + '******' + decoration.customer.phone.substring(9)) : "客户电话");

                    customerOrigine.refer.orderId = decoration.orderId;
                }

                if (decoration.precontractTime)
                    customerOrigine.items.referContractTime.val(decoration.precontractTime);

                if (decoration.contractTime)
                    customerOrigine.items.referContractTime.val(decoration.precontractTime);

                if (decoration.house && decoration.house.village && decoration.house.village.name)
                    customerOrigine.items.referVillage.val(decoration.house.village.name);

                if (decoration.house && decoration.house.houseNumber)
                    customerOrigine.items.referHouseNumber.val(decoration.house.houseNumber);

                return false;
            });
        }, function(res) {

            com.showAlert(com.error, "推荐客户不存在");
            return false;
        });
    });

    customerOrigine.items.referVillage.blur(function() {

        customerOrigine.refer.orderId = null;

        var villageno = com.typeahead(customerOrigine.items.referVillage);
        var housenumber = customerOrigine.items.referHouseNumber.val();

        var options = {
            "house.village.no": villageno,
            "house.houseNumber": housenumber,
            "house.status": 0,
        };

        var house = null;
        var decoration = null;

        com.post(api.data.queryHouseByNoAHnum, options, function(res) {

            house = res.house;
        }, null, false);

        if (!house)
            return false;

        var options = {
            "decoration.house.hid": house.hid
        }

        com.post(api.decoration.checkDecoration, options, function(res) {

            var decoration = res.decoration;

            if (decoration.orderId) {
                customerOrigine.items.referOrderId.val(decoration.orderId);
                customerOrigine.items.referPhone.val((decoration.status == 3 || decoration.status == 7) ? (decoration.customer.phone.substring(0, 3) + '******' + decoration.customer.phone.substring(9)) : "客户电话");

                customerOrigine.refer.orderId = decoration.orderId;
            }

            if (decoration.precontractTime)
                customerOrigine.items.referContractTime.val(decoration.precontractTime);

            if (decoration.contractTime)
                customerOrigine.items.referContractTime.val(decoration.precontractTime);
        }, function(res) {

            com.showAlert(com.error, "推荐客户不存在");
            return false;
        });
    });

    customerOrigine.items.referHouseNumber.blur(function() {

        customerOrigine.refer.orderId = null;

        var villageno = com.typeahead(customerOrigine.items.referVillage);
        var housenumber = customerOrigine.items.referHouseNumber.val();

        var options = {
            "house.village.no": villageno,
            "house.houseNumber": housenumber,
            "house.status": 0,
        };

        var house = null;
        var decoration = null;

        com.post(api.data.queryHouseByNoAHnum, options, function(res) {

            house = res.house;
        }, null, false);

        if (!house)
            return false;

        var options = {
            "decoration.house.hid": house.hid
        }

        com.post(api.decoration.checkDecoration, options, function(res) {

            var decoration = res.decoration;

            if (decoration.orderId) {
                customerOrigine.items.referOrderId.val(decoration.orderId);
                customerOrigine.items.referPhone.val((decoration.status == 3 || decoration.status == 7) ? (decoration.customer.phone.substring(0, 3) + '******' + decoration.customer.phone.substring(9)) : "客户电话");

                customerOrigine.refer.orderId = decoration.orderId;
            }

            if (decoration.precontractTime)
                customerOrigine.items.referContractTime.val(decoration.precontractTime);

            if (decoration.contractTime)
                customerOrigine.items.referContractTime.val(decoration.precontractTime);
        }, function(res) {

            com.showAlert(com.error, "推荐客户不存在");
            return false;
        });
    });

    function addcustomerOrigin() {

        if (com.validate("addcustomerorigine"))
            return false;

        if (customerOrigine.items.referCustomer.prop("checked") && customerOrigine.items.referOrderId.val() == ""){
            com.showAlert(com.error, "请填写推荐单号！");
            return false;
        }

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
            "customerOrigin.freeArea": 0,
            "customerOrigin.totalArea": 0,
            "customerOrigin.innerArea": customerOrigine.items.buildArea.val(),
            "customerOrigin.designer.userId": com.typeahead("designer"),
            "customerOrigin.salesman.userId": com.typeahead("salesman"),
            "customerOrigin.decorationBusitype.dbid": customerOrigine.items.decorationBusitype.val(),
            "customerOrigin.source": customerOrigine.items.source.val(),
            "customerOrigin.contact": customerOrigine.items.contact.val()
        };

        if (customerOrigine.refer.orderId) {
            options["customerOrigin.referOrderId"] = customerOrigine.refer.orderId;
        }

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
