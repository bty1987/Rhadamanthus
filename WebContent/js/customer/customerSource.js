$(function() {

    var customerSource = {

        csid: null,
        btns: {
            saveBtn: com.focusPage("#saveBtn", "#customerSource"),
            cancelBtn: com.focusPage("#cancelBtn", "#customerSource"),
        },

        modals: {
            createSourceModal: com.focusPage("#createsource", "#customerSource"),
        },

        items: {
            name: com.focusPage("#name", "#customerSource"),
            gender: com.focusPage("#gender", "#customerSource"),
            phone: com.focusPage("#phone", "#customerSource"),
            intention: com.focusPage("#intention", "#customerSource"),
            grade: com.focusPage("#grade", "#customerSource"),
            villageName: com.focusPage("#villageName", "#customerSource"),
            buildArea: com.focusPage("#buildArea", "#customerSource"),
            freeArea: com.focusPage("#freeArea", "#customerSource"),
            totalArea: com.focusPage("#totalArea", "#customerSource"),
            innerArea: com.focusPage("#innerArea", "#customerSource"),
            comment: com.focusPage("#comment", "#customerSource"),
            houseNumber: com.focusPage("#houseNumber", "#customerSource"),
            purpose: com.focusPage("#purpose", "#customerSource"),
            price: com.focusPage("#price", "#customerSource")
        },

        grade: ["A", "B", "C", "D"]
    };

    customerSource.btns.saveBtn.bindClick(saveDate);

    com.initTypeahead('villageName', api.data.queryVillageForNameByPinyin, "pinyinName", {}, "autoFillKeyValue", "key", "value", function(list, k, v) {

        com.post(api.data.queryVillageByVid, {
            "village.no": k
        }, function(res) {

            customerSource.items.rule.html("推荐楼牌号规则: " + (res.village.rule == null || res.village.rule == "" ? "暂无推荐规则" : res.village.rule));
        }, null, false);

        return v;
    });

    customerSource.items.grade.bindData(customerSource.grade, "key", "value", false);

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.customer.pageCustomerSource);
    searcher.condition(["customer-customerSource-phone", "customer-customerSource-village", "customer-customerSource-createTime", "customer-customerSource1-status"]);

    searcher.button([{
        id : "createCustomerSource",
        name : "添加",
        clazz : "btn-yellow",
        icon : "icon-plus"
    }]);

    searcher.history("customerSourceData");

    var lineprops = [{
        field: "name",
        name: "姓名",
        prop: "name",
        clazz: "grey"
    }, {
        field: "gender",
        name: "性别",
        prop: "gender",
        clazz: "grey"
    }, {
        field: "phone",
        name: "客户电话",
        prop: "phone",
        clazz: "grey"
    }, {
        field: "purpose",
        name: "目的",
        prop: "purpose",
        clazz: "grey"
    }, {
        field: "intention",
        name: "意向",
        prop: "intention",
        clazz: "grey"
    }, {
        field: "price",
        name: "需求价格",
        prop: "price",
        clazz: "blue"
    }, {
        field: "grade",
        name: "等级",
        prop: "grade",
        clazz: "red"
    }, {
        field: "village.name",
        name: "楼盘",
        prop: "village.name",
        clazz: "grey"
    }, {
        field: "houseNumber",
        name: "楼号",
        prop: "houseNumber",
        clazz: "blue"
    }, {
        field: "buildArea",
        name: "建筑面积",
        prop: "buildArea",
        clazz: "blue"
    }, {
        field: "freeArea",
        name: "赠送面积",
        prop: "freeArea",
        clazz: "blue"
    }, {
        field: "innerArea",
        name: "套内面积",
        prop: "innerArea",
        clazz: "blue"
    }, {
        field: "totalArea",
        name: "总面积",
        prop: "totalArea",
        clazz: "blue"
    }, {
        type: "newline"
    }, {
        field: "orderId",
        name: "装修单号",
        prop: "orderId",
        clazz: "blue",
        click: function(btn, v) {

            tools.decoration.info(btn, v.orderId);
        }
    }, {
        field: "creater",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.creater.userId);
        }
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "designer.currentName",
        name: "设计师",
        prop: "designer.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.designer.userId);
        }
    }, {
        field: "salesman.currentName",
        name: "业务员",
        prop: "salesman.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.salesman.userId);
        }
    }, {
        field: "company",
        name: "公司",
        prop: "company",
        clazz: "grey"
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.customer().customerSource.status.keys
    }, {
        field: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey"
    }];
    console.log(111)
    var linebtns = [{
        name: "失效",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.customer.updateCustomerSourceForStatus, {
                "customerSource.csid": v.csid,
                "customerSource.status": constant.customer().customerSource.STATUS_LNVALID_INT
            }, function() {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });

            return false;
        },
        show : function(v) {

            return (v.status == constant.customer().customerSource.STATUS_INIT_INT);
        }
    }];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#createCustomerSource').on("click", function() {

    	customerSource.modals.createSourceModal.modal("show");
    });

    function saveDate() {

        if (com.validate("customerSource"))
            return false;

        var options = {

            "customerSource.name": customerSource.items.name.val(),
            "customerSource.gender": com.genderType[customerSource.items.gender.prop("checked")],
            "customerSource.phone": customerSource.items.phone.val(),
            "customerSource.purpose": customerSource.items.purpose.val(),
            "customerSource.intention": customerSource.items.intention.val(),
            "customerSource.price": customerSource.items.price.val(),
            "customerSource.grade": customerSource.items.grade.val(),
            "customerSource.comment": customerSource.items.comment.val(),
            "customerSource.village.no": com.typeahead("villageName"),
            "customerSource.houseNumber": customerSource.items.houseNumber.val(),
            "customerSource.buildArea": customerSource.items.buildArea.val(),
            "customerSource.freeArea": customerSource.items.freeArea.val(),
            "customerSource.totalArea": customerSource.items.totalArea.val(),
            "customerSource.innerArea": customerSource.items.innerArea.val(),
        };

        com.post(api.customer.addCustomerSource, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            deleteDate();
            customerSource.modals.createSourceModal.modal("hide");
        });
    }

    function deleteDate() {

        com.cleanTypeahead("villageName");
        com.cleanItems(customerSource.items);
    }

});