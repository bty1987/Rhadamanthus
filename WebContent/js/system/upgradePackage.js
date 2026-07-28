jQuery(function($) {

    var upgrade = {
        saveBtn: com.focusPage("#saveBtn").on("click", saveData),
        modal: com.focusPage("#upgradeModal"),
        items: {
            upgradeNumber: com.focusPage("#upgradeNumber"),
            trialUpgrade: com.focusPage("#trialUpgrade"),
            createTime: com.focusPage("#createTime"),
            content: com.focusPage("#content"),
            path: com.focusPage("#path"),
            fileSize: com.focusPage("#fileSize"),
        },
    };

    com.datetime(com.focusPage(".date-picker"), "date");

    upgrade.modal.on("hide.bs.modal", function(a) {

        com.cleanItems(upgrade.items);
        com.clearValidator();
    });

    var lineprops = (function() {

        return [{
            field: "no",
            name: "最新版本",
            prop: "no",
            clazz: "grey"
        }, {
            field: "trialno",
            name: "适用版本",
            prop: "trialno",
            clazz: "grey"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return constant.system().upgradePackage.status.keys[v.status]; },
            clazz: "red"
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "grey"
        }, {
            field: "content",
            name: "版本说明",
            prop: "content",
            clazz: "grey"
        }, {
            field: "path",
            name: "路径",
            prop: "path",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        return {
            on: {
                name: "上线",
                clazz: "btn-success",
                show: function(v) { return v.status != 1; },
                handle: function(v) {
                    com.showConfirm("是否上线版本: " + v.no, function() {
                        com.post(api.upgrade.updateUpgradeForStatus, {
                            "upgrade.ugid": v.ugid,
                            "upgrade.status": 1
                        }, function() {
                            searcher.doSearch();
                        });
                    });
                }
            },
            off: {
                name: "下线",
                clazz: "btn-yellow",
                show: function(v) { return v.status == constant.system().upgradePackage.STATUS_ONLINE_INT; },
                handle: function(v) {
                    com.showConfirm("是否下线版本: " + v.no, function() {
                        com.post(api.upgrade.updateUpgradeForStatus, {
                            "upgrade.ugid": v.ugid,
                            "upgrade.status": 2
                        }, function() {
                            searcher.doSearch();
                        });
                    });
                }
            },
            del: {
                name: "删除",
                clazz: "btn-danger",
                handle: function(v) {
                    com.showConfirm("是否确定删除", function() {
                        com.post(api.upgrade.deleteUpgrade, {
                            "upgrade.ugid": v.ugid
                        }, function() {
                            searcher.doSearch();
                        });
                    });
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addUpgrade').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function() {
            upgrade.modal.modal("show")
        });

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.upgrade.pageUpgrade, null, ['system-upgrade-version', 'system-upgrade-createTime'], "upgradePostData", null, false, buttons);
    searcher.line("no", lineprops, linebtns).render();

    function saveData() {

        if (com.validate("upgradeModal")) {
            return false
        }

        var option = {
            "upgrade.no": upgrade.items.upgradeNumber.val(),
            "upgrade.trialno": upgrade.items.trialUpgrade.val(),
            "upgrade.createTime": upgrade.items.createTime.val() + " 00:00:00",
            "upgrade.content": upgrade.items.content.val(),
            "upgrade.path": upgrade.items.path.val(),
            "upgrade.fileSize": upgrade.items.fileSize.val(),
        }

        com.post(api.upgrade.addUpgrade, option, function() {

            com.showAlert(com.info, '添加成功');
            com.cleanItems(upgrade.items);

            searcher.doSearch();
        });

        upgrade.modal.modal("hide");
    }

    com.uploadify("#file", "上传升级包", api.common.uploadOther, 'btn btn-success blue ', "*.zip", {
        'uploadType': 0
    }, 1, function(data, file) {

        com.focusPage("#path").val(data.resUrl);
        com.focusPage("#fileSize").val(file.size);
    });

});