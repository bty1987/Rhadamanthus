$(function() {

    var task = {

        tid: null,

        btns: {
            saveBtn: com.focusPage("#addTaskBtn").on("click", saveData),
        },

        modals: {
            addTaskModal: com.focusPage("#addtaskModal")
        },

        items: {
            name: com.focusPage("#taskName"),
            filepath: com.focusPage("#filepath"),
            level: com.focusPage("#tasklevel"),
            type: com.focusPage("#tasktype"),
            handle: com.focusPage("#handle"),
            plugins: com.focusPage("#plugins"),
            isShow: com.focusPage("#isShow"),
            comment: com.focusPage("#comment"),
        },

        level: ["功能级", "模块级"],
        type: ["Py2", "Shell", "Py3"],
        isShow: ["显示", "不显示"],
        status: ["启用", "禁用"],

    };

    task.modals.addTaskModal.on("hide.bs.modal", function(a) {

        com.cleanItems(task.taskItems);
        com.clearValidator();
    });

    var taskSeacher = new Searcher();

    taskSeacher.base("condList", "pagenation", "resultList", api.communion.pageTask);

    taskSeacher.condition(["data-task-name", "data-task-isShow", "data-task-status", "data-task-level"]);

    taskSeacher.button([{
        id: "addTask",
        name: "添加",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    taskSeacher.history("taskPostData");

    var lineprops = [{
        fieId: "filepath",
        name: "文件路径",
        prop: "filepath",
        clazz: "grey"
    }, {
        fieId: "level",
        name: "等级",
        prop: "level",
        clazz: "red",
        dataset: task.level
    }, {
        fieId: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: task.type
    }, {
        fieId: "plugins",
        name: "配置",
        prop: function(v) {

            return v.plugins.replace("A", "时间区间").replace("B", "月份区间").replace("C", "上传附件").replace("D", "参数");
        },
        clazz: "grey"
    }, {
        fieId: "isShow",
        name: "显示",
        prop: "isShow",
        clazz: "red",
        dataset: task.isShow
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: task.status
    }, {
        field: "comment",
        name: "说明",
        prop: "comment",
        clazz: "grey"
    }, ];

    var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('查看');
    var $btnTaskParam = $('<a></a>').addClass('btn btn-minier btn-success').html('任务字段');

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            task.tid = v.tid;

            task.items.tid = v.tid;
            task.items.level.val(v.level);
            task.items.type.val(v.type);
            task.items.filepath.val(v.filepath);
            task.items.name.val(v.name);
            task.items.handle.val(v.handle);
            task.items.isShow.val(v.isShow);
            task.items.comment.val(v.comment);

            task.modals.addTaskModal.modal("show");
            return false;
        }
    }, {
        name: "任务字段",
        clazz: "btn-danger",
        handle: function(v) {

            params.data.task = v;

            com.popup4page("#stockRecordPopUp", "/views/data/taskParam.html", "任务字段");

            return false;
        },
        show: function(v) {

            return v.level == 1;
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.communion.updateTaskForStatus, {
                "task.tid": v.tid,
                "task.status": check ? 0 : 1
            });
            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }, {
        name: "显示",
        type: "switch",
        clazz: "display-lbl",
        handle: function(v, check) {

            com.post(api.communion.updateTaskForIsShow, {
                "task.tid": v.tid,
                "task.isShow": check ? 0 : 1
            });
            return false;
        },
        init: function(v) {

            return !v.isShow;
        }
    },

    ];

    taskSeacher.line("name", lineprops, linebtns).render();

    com.focusPage('#addTask', '#pagenation').on("click", function() {

        task.tid = null;
        com.cleanItems(task.items);
        task.modals.addTaskModal.modal("show");
    });

    function saveData() {

        if (com.validate('addtaskModal'))
            return false;

        var url = api.communion.addTask;
        var options = {
            "task.name": task.items.name.val(),
            "task.filepath": task.items.filepath.val(),
            "task.level": task.items.level.val(),
            "task.type": task.items.type.val(),
            "task.handle": task.items.handle.val(),
            "task.plugins": task.items.plugins.val(),
            "task.isShow": task.items.isShow.val(),
            "task.comment": task.items.comment.val()
        };

        if (task.tid) {
            url = api.communion.updateTask;
            options["task.tid"] = task.items.tid;
        }

        com.post(url, options, function() {

            taskSeacher.doSearch();
            task.modals.addTaskModal.modal("hide");
        });
    }

});
