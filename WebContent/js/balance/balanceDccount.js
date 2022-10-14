jQuery(function($) {

    var balanceDccount = {

        bsid : null,
        btns : {
            saveBtn : com.focusPage("#saveBtn"),
            updateBtn : com.focusPage("#updateBtn"),
        },

        modals : {
            createBalanceDccountModal : com.focusPage("#createBalanceDccountModal"),
            updateBalanceDccountModal : com.focusPage("#updateBalanceDccountModal"),
        },

        items : {
            name : com.focusPage("#name"),
            type : com.focusPage("#type"),
            belonger : com.focusPage("#belonger"),
            comment : com.focusPage("#comment"),
            startTime : com.focusPage("#startTime"),
            endTime : com.focusPage("#endTime"),
            cutpay : com.focusPage("#cutpay"),
            updateName : com.focusPage("#updata"),
        },
        bdid : null,
        status : {},
    };

    balanceDccount.btns.saveBtn.bindClick(saveData);
    balanceDccount.btns.updateBtn.bindClick(updateData);
    com.datetime(com.focusPage("#startTime"));
    com.datetime(com.focusPage("#endTime"));

    balanceDccount.modals.createBalanceDccountModal.on("hide.bs.modal",function() {
        com.clearValidator();
        com.cleanTypeahead("belonger");
        com.cleanItems(balanceDccount.items);
    });

    balanceDccount.modals.updateBalanceDccountModal.on("hide.bs.modal",function() {
        com.clearValidator();
        com.cleanItems(balanceDccount.items);
    });

    com.post(api.ds.balance, {}, function(res) {
        balanceDccount.items.type.bindData(res.balanceDccountType, "key","value");
    }, null, false);

    com.initTypeahead('belonger', api.personel.queryUserByPinyin, "pinyinName",{"departmentType.name" : "", "user.status" : 0}, "autoFillKeyValue", "key", "value", null);

    var seacher = new Searcher();

    seacher.base("condList", "pagenation", "resultList",api.balance.pageBalanceDccount);

    seacher.condition([ "balance-balanceDccount-name","balance-balanceDccount-status" ]);

    seacher.button([ {
        id : "createBalanceDccount",
        name : "创建",
        clazz : "btn-yellow",
        icon : "icon-plus"
    } ]);

    seacher.history("balanceDccountPostData");

    var lineprops = [ {
        fieId : "belonger.currentName",
        name : "归属人",
        prop : "belonger.currentName",
        clazz : "grey"
    }, {
        fieId : "creater.currentName",
        name : "创建人",
        prop : "creater.currentName",
        clazz : "grey"
    }, {
        fieId : "createTime",
        name : "创建时间",
        prop : "createTime",
        clazz : "green"
    }, {
        fieId : "startTime",
        name : "开始时间",
        prop : "startTime",
        clazz : "green"
    }, {
        fieId : "endTime",
        name : "结束时间",
        prop : "endTime",
        clazz : "green"
    }, {
        field : "cutpay",
        name : "总额",
        prop : "cutpay",
        clazz : "blue"
    }, {
        fieId : "surplus",
        name : "余额",
        prop : "surplus",
        clazz : "blue",
    }, {
        fieId : "type",
        name : "类型",
        prop : "type",
        clazz : "red",
        dataset : constant.balance().balanceDccount.type.keys
    }, {
        fieId : "status",
        name : "状态",
        prop : "status",
        clazz : "red",
        dataset : constant.balance().balanceDccount.status.keys
    }, {
        fieId : "comment",
        name : "说明",
        prop : "comment",
        clazz : "grey"
    }, ];

    var linebtus = [{
        name : "明细",
        clazz : "btn-inverse",
        handle : function(v) {
            params.balance.bdid = v.bdid;
            com.popup4page("#stockRecordPopUp", api.index.balanceDccountDetailIndex.url, "明细");
        },
    },{
        name : "更新",
        clazz : "btn-yellow",
        handle : function(v) {
            balanceDccount.bdid = v.bdid;
            updateBalanceDccount(v);
            return false;
        },
    },{
        name : "有效",
        clazz : "btn-info",
        handle : function(v) {
            com.post(api.balance.updateBalanceDccountForStatus,{
                "balanceDccount.bdid" : v.bdid,
                "balanceDccount.status" : constant.balance().balanceDccount.STATUS_VALID_SHORT
            }, function() {

                com.showAlert(com.info, "操作成功");
                seacher.doSearch();
            });

            return false;
        },
        show : function(v) {

            return (v.status == constant.balance().balanceDccount.STATUS_UNVALID_SHORT);
        }
    },{
        name : "失效",
        clazz : "btn-danger",
        handle : function(v) {
            com.post(api.balance.updateBalanceDccountForStatus,{
                "balanceDccount.bdid" : v.bdid,
                "balanceDccount.status" : constant.balance().balanceDccount.STATUS_UNVALID_SHORT
            }, function() {

                com.showAlert(com.info, "操作成功");
                seacher.doSearch();
            });

            return false;
        },
        show : function(v) {

            return (v.status == constant.balance().balanceDccount.STATUS_VALID_SHORT);
        }
    }, ];

    seacher.line("name", lineprops, linebtus).render();

    com.focusPage('#createBalanceDccount').on("click", function() {

        balanceDccount.modals.createBalanceDccountModal.modal("show");
    });

    function updateBalanceDccount(v) {
        com.focusPage("#updata").val(v.name);
        balanceDccount.modals.updateBalanceDccountModal.modal("show");
    };

    function saveData() {

        if (com.validate('createBalanceDccountModal'))
            return false;

        var options = {
            'balanceDccount.belonger.userId' : com.typeahead("belonger"),
            "balanceDccount.name" : balanceDccount.items.name.val(),
            "balanceDccount.type" : balanceDccount.items.type.val(),
            "balanceDccount.comment" : balanceDccount.items.comment.val(),
            "balanceDccount.startTime" : balanceDccount.items.startTime.val(),
            "balanceDccount.endTime" : balanceDccount.items.endTime.val(),
            "balanceDccount.cutpay" : balanceDccount.items.cutpay.val()
        };

        com.post(api.balance.addBalanceDccount, options, function() {

            com.showAlert(com.info, "操作成功");
            seacher.doSearch();
        });

        balanceDccount.modals.createBalanceDccountModal.modal("hide");
    }

    function updateData() {

        if (com.validate('updateBalanceDccountModal'))
            return false;

        var options = {
            "balanceDccount.bdid" : balanceDccount.bdid,
            "balanceDccount.name" : balanceDccount.items.updateName.val()
        };

        com.post(api.balance.updateBalanceDccount, options, function() {

            com.showAlert(com.info, "操作成功");
            seacher.doSearch();
        });

        balanceDccount.modals.updateBalanceDccountModal.modal("hide");
    }

});
