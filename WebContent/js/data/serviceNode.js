jQuery(function($) {

    var serviceNode = {

        snid: null,
        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
            cancelBtn: com.focusPage("#cancelBtn"),
        },
        modals: {
            serviceNodeModal: com.focusPage("#serviceNodeModal")
        },
        items: {
            name: com.focusPage("#serviceNodeName", "#serviceNodeModal"),
            type: com.focusPage("#serviceNodeType", "#serviceNodeModal"),
            detail: com.focusPage("#serviceNodeDetail", "#serviceNodeModal"),
            psnid: com.focusPage("#serviceNodePsnid", "#serviceNodeModal"),
            attnode: com.focusPage("#serviceNodeAttnode", "#serviceNodeModal"),
            userType: com.focusPage("#serviceNodeUserType", "#serviceNodeModal"),
            blankNum: com.focusPage("#serviceNodeBlankNum", "#serviceNodeModal"),
            workNum: com.focusPage("#serviceNodeWorkNum", "#serviceNodeModal"),
            loop: com.focusPage('input[name="serviceNodeLoop"]:checked', '#serviceNodeModal').val()
        },
        status: {
            0: "启用",
            1: "禁用"
        },
    };

    com.focusPage("#serviceNodeType").bindData(constant.data().serviceNode.type.datas, "key", "value");
    serviceNode.type = constant.data().serviceNode.type.keys;

    com.focusPage("#serviceNodeAttnode").bindData(constant.data().serviceNode.attnode.datas, "key", "value");
    serviceNode.attnode = constant.data().serviceNode.attnode.keys;

    serviceNode.modals.serviceNodeModal.on('show.bs.modal', function() {

        com.cleanItems(serviceNode.items);
        com.clearValidator();
    });

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.communion.pageServiceNode);

    searcher.condition(["data-serviceNode-type", "data-serviceNode-status"]);

    searcher.button([{
        id: "addServiceNode",
        name: "添加",
        clazz: "btn-primary",
        icon: "icon-plus"
    }]);

    searcher.history("serviceNodeData");

    var lineprops = [{
        fieId: "detail",
        name: "详述",
        prop: "detail",
        clazz: "grey"
    }, {
        fieId: "type",
        name: "类型",
        prop: "type",
        clazz: "grey",
        dataset: serviceNode.type
    }, {
        field: "status ",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: serviceNode.status
    }, {
        field: "psnid ",
        name: "上级节点",
        prop: "psnid",
        clazz: "grey",
        dataset: serviceNode.psnid
    }, {
        field: "attnode ",
        name: "业务节点",
        prop: "attnode",
        clazz: "red",
        dataset: serviceNode.attnode
    }, {
        field: "blankNum ",
        name: "间隔天数",
        prop: "blankNum",
        clazz: "blue",
        dataset: serviceNode.blankNum
    }, {
        field: "workNum ",
        name: "工期天数",
        prop: "workNum",
        clazz: "blue",
        dataset: serviceNode.workNum
    }, {
        field: "loop ",
        name: "是否循环",
        prop: function(v) {
            return v.loop == "0" ? "否" : "是";
        },
        clazz: "red",
        dataset: serviceNode.loop
    }, {
        field: "userType ",
        name: "人员类型",
        prop: "userType",
        clazz: "red",
        dataset: serviceNode.userType
    }, ];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            serviceNode.snid = v.snid;
            serviceNode.items.name.val(v.name);
            serviceNode.items.detail.val(v.detail);
            serviceNode.items.type.val(v.type);
            serviceNode.items.psnid.val(v.psnid);
            serviceNode.items.attnode.val(v.attnode);
            serviceNode.items.blankNum.val(v.blankNum);
            serviceNode.items.workNum.val(v.workNum);
            com.focusPage('input[name="serviceNodeLoop"][value="' + v.loop + '"]', '#serviceNodeModal').prop("checked", true);
            serviceNode.items.userType.val(v.userType);
            serviceNode.modals.serviceNodeModal.modal("show");
            return false;
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.communion.updateServiceNodeForStatus, {
                "serviceNode.snid": v.snid,
                "serviceNode.status": check ? 0 : 1
            });
            searcher.doSearch();
            return false;
        },
        init: function(v) {

            return !v.status;
        }
    },

    ];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#addServiceNode', '#pagenation').on("click", function() {

        serviceNode.snid = null;

        serviceNode.modals.serviceNodeModal.modal("show");

    });

    function saveData() {

        if (com.validate('serviceNodeModal'))
            return false;

        var url = api.communion.addServiceNode;

        var options = {
            "serviceNode.name": serviceNode.items.name.val(),
            "serviceNode.type": serviceNode.items.type.val(),
            "serviceNode.detail": serviceNode.items.detail.val(),
            "serviceNode.psnid": serviceNode.items.psnid.val(),
            "serviceNode.attnode": serviceNode.items.attnode.val(),
            "serviceNode.blankNum": serviceNode.items.blankNum.val(),
            "serviceNode.workNum": serviceNode.items.workNum.val(),
            "serviceNode.loop": com.focusPage('input[name="serviceNodeLoop"]:checked', '#serviceNodeModal').val(),
            "serviceNode.userType": serviceNode.items.userType.val(),
        };
        if (serviceNode.snid) {
            url = api.communion.updateServiceNode;
            options["serviceNode.snid"] = serviceNode.snid;
        }
        com.post(url, options, function(res) {

            searcher.doSearch();
        });

        serviceNode.modals.serviceNodeModal.modal("hide");
    }
});
