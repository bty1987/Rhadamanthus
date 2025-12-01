jQuery(function($) {

    var referDecoration = {
        modals: {
            addReferDecorationModal: com.focusPage("#addReferDecorationModal"),

        },

        items: {
            referOrderId: com.focusPage("#referOrderId"),
            referPhone: com.focusPage("#referPhone"),
            referVillage: com.focusPage("#referVillage"),
            referHouseNumber: com.focusPage("#referHouseNumber"),
            referContractTime: com.focusPage("#referContractTime"),

        },
        refer: {
            orderId: null
        },

    }

    referDecoration.items.referOrderId.blur(function() {

        var orderId = referDecoration.items.referOrderId.val();

        var options = {
            "decoration.orderId": orderId
        }

        com.post(api.decoration.queryDecorationForCommonByOrderId, options, function(res) {

            var decoration = res.decoration;

            if (decoration.orderId) {
                referDecoration.items.referOrderId.val(decoration.orderId);
                referDecoration.items.referPhone.val((decoration.status == 3 || decoration.status == 7) ? (decoration.customer.phone.substring(0, 3) + '******' + decoration.customer.phone.substring(9)) : "客户电话");
                referDecoration.items.referVillage.val(decoration.house.village.name);
                referDecoration.items.referHouseNumber.val(decoration.house.houseNumber);
                referDecoration.refer.orderId = decoration.orderId;
            }

            if (decoration.precontractTime)
                referDecoration.items.referContractTime.val(decoration.precontractTime);

            if (decoration.contractTime)
                referDecoration.items.referContractTime.val(decoration.precontractTime);
        }, function(res) {

            com.showAlert(com.error, "推荐装修单不存在");
            return false;
        });
    });

    referDecoration.items.referPhone.blur(function() {

        referDecoration.refer.orderId = null;

        var phone = referDecoration.items.referPhone.val();

        var options = {
            "customerPhone": phone,
            "paging.page": 1,
            "paging.rows": 10,
        }

        var decoration = null;

        com.post(api.decoration.pageDecorationForCustomer, options, function(res) {

            if (res.paging.totalRecords == 0) {
                com.showAlert(com.error, "推荐装修单不存在");
                return false;
            }

            var decorations = res.paging.data;

            $.each(decorations, function(i, v) {

                decoration = v;

                if (decoration.orderId) {
                    referDecoration.items.referOrderId.val(decoration.orderId);
                    referDecoration.items.referPhone.val((decoration.status == 3 || decoration.status == 7) ? (decoration.customer.phone.substring(0, 3) + '******' + decoration.customer.phone.substring(9)) : "客户电话");
                    referDecoration.items.referVillage.val(decoration.house.village.name);
                    referDecoration.items.referHouseNumber.val(decoration.house.houseNumber);
                    referDecoration.refer.orderId = decoration.orderId;
                }

                if (decoration.precontractTime)
                    referDecoration.items.referContractTime.val(decoration.precontractTime);

                if (decoration.contractTime)
                    referDecoration.items.referContractTime.val(decoration.precontractTime);

                return false;
            });
        }, function(res) {

            com.showAlert(com.error, "推荐装修单不存在");
            return false;
        });
    });

    referDecoration.items.referVillage.blur(function() {

        referDecoration.refer.orderId = null;

        var villageno = com.typeahead(referDecoration.items.referVillage);
        var housenumber = referDecoration.items.referHouseNumber.val();

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
                referDecoration.items.referOrderId.val(decoration.orderId);
                referDecoration.items.referPhone.val(decoration.customer.phone);
                referDecoration.refer.orderId = decoration.orderId;
            }

            if (decoration.precontractTime)
                referDecoration.items.referContractTime.val(decoration.precontractTime);

            if (decoration.contractTime)
                referDecoration.items.referContractTime.val(decoration.precontractTime);
        }, function(res) {

            com.showAlert(com.error, "推荐装修单不存在");
            return false;
        });
    });

    referDecoration.items.referHouseNumber.blur(function() {

        referDecoration.refer.orderId = null;

        var villageno = com.typeahead(referDecoration.items.referVillage);
        var housenumber = referDecoration.items.referHouseNumber.val();

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
                referDecoration.items.referOrderId.val(decoration.orderId);
                referDecoration.items.referPhone.val(decoration.customer.phone);
                referDecoration.refer.orderId = decoration.orderId;
            }

            if (decoration.precontractTime)
                referDecoration.items.referContractTime.val(decoration.precontractTime);

            if (decoration.contractTime)
                referDecoration.items.referContractTime.val(decoration.precontractTime);
        }, function(res) {

            com.showAlert(com.error, "推荐装修单不存在");
            return false;
        });
    });

    var searcher = new Searcher();

    searcher.base("referCondLists", "referPagenations", "referResultLists", api.decoration.queryDecorationForReferByOrderId);
    searcher.isPage(true).result("decorations");
    searcher.param({
        "decoration.orderId": params.decoration.orderId
    });

    searcher.button([{
        id: "supplement",
        name: "补录",
        clazz: "btn btn-minier btn-primary pull-left",
        icon: "icon-plus bigger-110"
    }])

    var lineprops = [{
        field: "orderId",
        name: "装修单号",
        prop: "orderId",
        clazz: "blue"
    }, {
        field: "customerName",
        name: "客户名",
        prop: "customer.name",
        clazz: "green"
    }, {
        field: "address",
        name: "楼盘地址",
        prop: function(v) {

            return (v.house.village.cityProper.city.name == null ? " " : v.house.village.cityProper.city.name) + " " + (v.house.village.cityProper == null ? " " : v.house.village.cityProper.name) + " " + v.house.village.name + " " + (v.house.houseNumber == null ? " " : v.house.houseNumber);
        },
        clazz: "grey"
    }, {
        field: "designDept",
        name: "设计部",
        prop: "designer.dept.name",
        clazz: "grey"
    }, {
        field: "designer",
        name: "设计师",
        prop: "designer.currentName",
        clazz: "grey"
    }, {
        field: "salesDept",
        name: "业务部",
        prop: "salesman.dept.name",
        clazz: "grey"
    }, {
        field: "salesman",
        name: "业务员",
        prop: "salesman.currentName",
        clazz: "grey"
    }, {
        field: "innerArea",
        name: "面积",
        prop: "innerArea",
        clazz: "blue"
    }, {
        field: "discount",
        name: "折扣",
        prop: function(v) {

            return com.checkNull(v.discount, 10);
        },
        clazz: "blue"
    }, {
        field: "precontractPrice",
        name: "预签额",
        prop: "precontractPrice",
        clazz: "blue"
    }, {
        field: "orderTotalPrice",
        name: "签单额",
        prop: "orderTotalPrice",
        clazz: "blue"
    }, {
        field: "quotationPrice",
        name: "报价额",
        prop: "quotationPrice",
        clazz: "blue"
    }, {
        field: "couponCut",
        name: "券优惠",
        prop: "couponCut",
        clazz: "blue"
    }, {
        field: "factPrice",
        name: "实收额",
        prop: "factPrice",
        clazz: "blue"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "measureTime",
        name: "量房时间",
        prop: "measureTime",
        clazz: "green"
    }, {
        field: "depositTime",
        name: "定金时间",
        prop: "depositTime",
        clazz: "green"
    }, {
        field: "precontractTime",
        name: "预签时间",
        prop: "precontractTime",
        clazz: "green"
    }, {
        field: "contractTime",
        name: "签单时间",
        prop: "contractTime",
        clazz: "green"
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        dataset: constant.decoration().decoration.status.keys,
        clazz: "red"
    }];

    var linebtus = [{
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.decoration.deleteReferDecorationInfo, {
                "decoration.orderId": params.decoration.orderId,
                "decorationInfo.referOrderId": v.orderId
            }, function() {

                com.showAlert(com.info, "删除成功");
                searcher.doSearch();
            });

            return false;
        }
    }];

    searcher.line(function(v){
        
        return v.orderId + (v.referType == 1 ? " (推荐)" : " (被推荐)");
    }, lineprops, linebtus).render();

    com.focusPage('#supplement').on("click", function() {

        com.cleanItems(referDecoration.items);
        referDecoration.modals.addReferDecorationModal.modal("show");
    });

    com.focusPage('#submitBtn').on("click", function() {

        var options = {
            "decoration.orderId": params.decoration.orderId,
            "decorationInfo.referOrderId": referDecoration.items.referOrderId.val(),
        };

        com.post(api.decoration.referDecorationInfo, options, function(res) {

            com.showAlert(com.info, "操作成功");

            referDecoration.modals.addReferDecorationModal.modal("hide");
            searcher.doSearch();
        });
    });

});
