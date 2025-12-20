jQuery(function($) {

    var decorationService = {
        decorationOrderId: null,
        dsid: null,
        serviceItems: {},
        rollback: params.historyPage,
        item: {},
        modal: null,
        serviceModal: null
    };

    var servicePage = {
        btnBack: com.focusPage("#btnBack")
    };

    decorationService.decorationOrderId = params.decoration.orderId;
    decorationService.serviceItems.comment = com.focusPage('#comment');

    decorationService.serviceModal = com.focusPage("#serviceModal");

    decorationService.serviceModal.on('hide.bs.modal', function(e) {

        com.cleanItems(decorationService.serviceItems);
        com.closeTip();
    });

    // 初始化 searcher 组件来替代 drawTable
    var searcher = Searcher().base("serviceSearch", "servicePager", "serviceInfo", api.decoration.queryDecorationServiceByOrderId)
    searcher.param({
        "decorationService.orderId": decorationService.decorationOrderId
    })
    searcher.result("decorationServices") // 指定返回数据的字段名
    searcher.isPage(true); // 不使用分页，一次性加载所有数据

    var props = [ // 属性配置
    {
        name: "装修单号",
        prop: "orderId",
        clazz: "grey"
    }, {
        name: "详述",
        prop: "detail",
        clazz: "grey"
    }, {
        name: "操作人",
        prop: "operater.currentName",
        clazz: "grey"
    }, {
        name: "操作时间",
        prop: "operateTime",
        clazz: "green"
    }, {
        name: "状态",
        prop: function(v) {

            return v.status == 0 ? '初始' : '完成';
        },
        clazz: "red"
    }, {
        name: "备注",
        prop: "comment",
        clazz: "grey"
    }];

    var btns = [ // 按钮事件配置
    {
        name: "完成",
        clazz: "btn-yellow",
        show: function(v) {

            return v.status == 0;
        }, // 只在状态为0时显示
        handle: function(v) {

            decorationService.dsid = v.dsid;
            com.cleanItems(decorationService.serviceItems);
            decorationService.serviceModal.modal("show");
        }
    }];

    searcher.line("name", props, btns).render();

    com.focusPage("#serviceSaveBtn").on('click', function(res) {

        if (com.validate("serviceModal")) {
            return;
        }

        var options = {};
        options["decorationService.dsid"] = decorationService.dsid;
        options["decorationService.comment"] = decorationService.serviceItems.comment.val();

        com.post(api.decoration.completeDecorationService, options, function(res) {

            // 使用 searcher 的 doSearch 方法重新加载数据
            Searcher().base("serviceSearch", "servicePager", "serviceInfo", api.decoration.queryDecorationServiceByOrderId).param({
                "decorationService.orderId": decorationService.decorationOrderId
            }).result("decorationServices").doSearch();
            decorationService.serviceModal.modal("hide");
        });

    });

    decorationService.rollback && servicePage.btnBack.click(function() {

        com.switchPage(decorationService.rollback);
    });

});
