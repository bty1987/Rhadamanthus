$(function() {

    var talking = {
        saveBtn: com.focusPage("#saveBtn"),
        tranpackBtn: com.focusPage("#tranpackBtn"),

        modals: {
            talkingModal: com.focusPage("#talkingModal")
        },
        items: {
            name: com.focusPage("#name"),
            type: com.focusPage("#type"),
            content: com.focusPage("#content")
        },
        editFlg: false,
        talkingType: {},
        talkingStatus: {}
    };

    talking.saveBtn.bindClick(saveData);

    talking.modals.talkingModal.on("hide.bs.modal", function() {

        com.clearValidator();
        com.cleanItems(talking.items);
    });

    com.post(api.ds.data, {}, function(res) {

        talking.items.type.bindData(res.talkingType, "key", "value");
        talking.talkingType = res.talkingType.split("key", "value");
        talking.talkingStatus = res.talkingStatus.split("key", "value");
    }, null, false);

    function buildTalkingLineprops() {

        return [{
            field: "name",
            name: "名称",
            prop: "name",
            clazz: "grey"
        }, {
            field: "type",
            name: "类型",
            prop: function(v) { return talking.talkingType[v.type]; },
            clazz: "grey"
        }, {
            field: "content",
            name: "内容",
            prop: "content",
            clazz: "grey"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return talking.talkingStatus[v.status]; },
            clazz: "red"
        }];
    }

    function buildTalkingLinebtns() {

        return {
            update: {
                name: "更新",
                clazz: "btn-yellow",
                handle: function(v) {
                    talking.editFlg = false;
                    talking.items.tid = v.tid;
                    talking.items.name.val(v.name);
                    talking.items.type.val(v.type);
                    talking.items.content.val(v.content);
                    talking.modals.talkingModal.modal("show");
                }
            },
            status: {
                type: "switch",
                init: function(v) { return !v.status; },
                handle: function(v, checked) { updateTalkingForStatus(v.tid, checked ? 0 : 1); }
            },
            delete: {
                name: "删除",
                clazz: "btn-success",
                handle: function(v) {
                    com.showConfirm("是否确认删除", function() {
                        deleteTalking(v.tid);
                    });
                }
            }
        };
    }

    function buildTalkingButtons() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addTalking').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    }

    var searcher = new Searcher();

    searcher.set("creatLine", "pageTalking", "resultList", api.data.pageTalking, null, ["data-talking-name", "data-talking-type", "data-talking-status"], "pageTalkingPost", null, false, buildTalkingButtons);
    searcher.line("name", buildTalkingLineprops(), buildTalkingLinebtns()).render();

    com.focusPage("#addTalking").click(function() {

        talking.editFlg = true;
        talking.modals.talkingModal.modal("show");
    });

    function updateTalkingForStatus(tid, newstatus) {

        com.post(api.data.updateTalkingForStatus, {
            "talking.tid": tid,
            "talking.status": newstatus
        }, function(res) {

            newstatus == 0 ? com.showAlert(com.info, "已启动") : com.showAlert(com.info, "已禁用");
            searcher.doSearch();
        }, null, false);

    }
    ;

    function deleteTalking(tid) {

        com.post(api.data.deleteTalking, {
            "talking.tid": tid
        }, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        }, null, false);

    }
    ;

    function saveData(options) {

        var url, options;

        options = {
            "talking.name": talking.items.name.val(),
            "talking.type": talking.items.type.val(),
            "talking.content": talking.items.content.val()
        };

        talking.editFlg ? url = api.data.addTalking : url = api.data.updateTalking, options["talking.tid"] = talking.items.tid;

        com.post(url, options, function(res) {

            com.closePopup();
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        }, null, false);

        talking.modals.talkingModal.modal("hide");
    }
    ;

});