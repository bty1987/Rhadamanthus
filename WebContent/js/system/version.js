$(function () {

    var version = {
            
        vid: null,
        
        saveBtn: com.focusPage("#saveBtn"),
        cancelBtn: com.focusPage("#cancelBtn"),
        
        versionModal: com.focusPage("#versionModal"),
        
        items: {
            vid: com.focusPage("#vid", "#versionModal"),
            no: com.focusPage("#no", "#versionModal"),
            createTime: com.focusPage("#createTime", "#versionModal"),
            comment: com.focusPage("#comment", "#versionModal"),
        },
    };
    
    com.datetime(com.focusPage(".date-picker"), "date");
    
    version.saveBtn.on("click", function () {
        saveData();
    });
    
    version.versionModal.on('hide.bs.modal', function (e) {
        com.clearValidator();
    });
    
    var lineprops = (function() {

        return [{
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "grey"
        }, {
            field: "comment",
            name: "更新内容",
            prop: "comment",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        return {
            edit: {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {
                    version.vid = v.vid;

                    com.cleanItems(version.items);

                    version.items.no.val(v.no);
                    version.items.createTime.val(v.createTime);
                    version.items.comment.val(v.comment);

                    version.versionModal.modal("show");
                }
            },
            enabled: {
                name: "已启用",
                clazz: "btn-success",
                show: function(v) { return v.status == constant.system().version.STATUS_ENABLED_INT; },
                handle: function(v) {
                    updateStatus(v.vid, 1);
                }
            },
            disabled: {
                name: "已禁用",
                clazz: "btn-danger",
                show: function(v) { return v.status != 0; },
                handle: function(v) {
                    updateStatus(v.vid, 0);
                }
            },
            del: {
                name: "删除",
                clazz: "btn-warning",
                handle: function(v) {
                    com.showConfirm("是否确定删除", function() {
                        com.post(api.upgrade.deleteVersion, { "version.vid": v.vid }, function(res) {
                            com.showAlert(com.info, "操作成功");
                            versionSeacher.doSearch();
                        });
                    });
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addVillage').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function() {
            version.vid = null;

            com.cleanItems(version.items);

            version.versionModal.modal("show");
        });

        return [$adda];
    })();

    var versionSeacher = new Searcher();

    versionSeacher.set("condList", "pagenation", "resultList", api.upgrade.pageVersion, null, [], "versionSeacherPostData", null, false, buttons);
    versionSeacher.line("no", lineprops, linebtns).render();

    function saveData() {
        
        if(com.validate("versionModal")){
            return false;
        }
        
        var url = api.upgrade.addVersion;
        
        var options = {
            "version.no": version.items.no.val(),
            "version.createTime": version.items.createTime.val(),
            "version.comment": version.items.comment.val(),
        }

        if(version.vid){
            url = api.upgrade.updateVersion;
            options["version.vid"] = version.vid;
        }

        com.post(url, options, function (res) {
            com.showAlert(com.info, "操作成功");
            versionSeacher.doSearch();
            version.versionModal.modal('hide');
        });
    }
    
    function updateStatus(vid, status){

        var options = {
            "version.vid": vid,
            "version.status": status
        }
        
        com.post(api.upgrade.updateVersionForStatus, options, function (res) {
            versionSeacher.doSearch();
        });
    }

});
