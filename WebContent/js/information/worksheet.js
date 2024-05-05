$(function() {

    var worksheet = {

        modals: {
            addWorksheetModal: com.focusPage("#addWorksheetModal"),
            handWorksheetModal: com.focusPage("#handWorksheetModal")
        },
        items: {
            module: com.focusPage("#module"),
            content: com.focusPage("#content"),
            result: com.focusPage("#result"),
            path: com.focusPage("#path")
        },
        btns: {
            saveBtn: com.focusPage("#saveBtn").bindClick(saveData),
            handBtn: com.focusPage("#handBtn").bindClick(handData),
        },

        wsid: null,

        pageType: params.urlLoadParams.pageType

    };

    com.focusPage(".modal").on("hide.bs.modal", function() {

        com.clearValidator();

        com.cleanItems(worksheet.items);
    });

    var searcher = new Searcher();

    var lineprops = [{
        field: "code",
        name: "单号",
        prop: "code",
        clazz: "grey",
        show: function(v) {

            return false;
        }
    }, {
        field: "content",
        name: "内容",
        prop: "content",
        clazz: "grey"
    }, {
        field: "creater",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey",
        click: function(btn, v) {
            tools.personel.info(btn, v.creater.userId);
        },
        show: function(v) {

            return (worksheet.pageType != "creater");
        }
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green",
        show: function(v) {

            return (worksheet.pageType != "creater");
        }
    }, {
        field: "handler",
        name: "处理人",
        prop: function(v) {

            return v.handler.currentName == null ? "" : v.handler.currentName;
        },
        clazz: "grey",
        click: function(btn, v) {
            tools.personel.info(btn, v.handler.userId);
        }
    }, {
        field: "handTime",
        name: "处理时间",
        prop: function(v) {

            return v.handTime == null ? "" : v.handTime;
        },
        clazz: "green",
        show: function(v) {

            return (worksheet.pageType != "creater");
        }
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.information().worksheet.status.keys,
    }, {
        field: "result",
        name: "结果",
        prop: function(v) {

            return v.result == null ? "" : v.result;
        },
        clazz: "grey"
    }];

    var linebtns = [{
        name: "处理",
        clazz: "btn-danger",
        handle: function(v) {

            worksheet.wsid = v.wsid;

            worksheet.modals.handWorksheetModal.modal("show");
        },
        show: function(v) {

            return worksheet.pageType != "creater" && v.status == constant.information().worksheet.STATUS_INIT_INT;
        }
    }, {
        name: "取消",
        clazz: "btn-warning",
        handle: function(v) {

            com.showConfirm("确定取消吗?", function(reslut) {

                com.post(api.information.cancelWorksheet, {
                    "worksheet.wsid": v.wsid
                }, function(res) {

                    searcher.doSearch();

                    com.showAlert(com.info, "操作成功");
                });
            });

            return false;
        }, show: function(v) {

            return v.status == constant.information().worksheet.STATUS_INIT_INT;
        }
    }, {
        name: "完成",
        clazz: "btn-inverse",
        handle: function(v) {

            finish(v.wsid);

        },
        show: function(v) {

            return v.status == constant.information().worksheet.STATUS_HANDL_INT;
        }
    } ];

    if (worksheet.pageType == "creater") {

        init();

        searcher.base("condList4worksheet", "resultList4worksheet", "pagenation4worksheet", api.information.queryWorksheet);
        searcher.result("worksheets").isPage(true);
        searcher.card(function(v) {

            return constant.information().worksheet.status.keys[v.status];
        }, lineprops, linebtns).render();
    } else {

        searcher.base("condList4worksheet", "pagenation4worksheet", "resultList4worksheet", api.information.pageWorksheet);
        searcher.condition(['information-worksheet-code', 'information-worksheet-status', 'information-worksheet-creater', 'information-worksheet-handler']);

        searcher.button(function() {

            var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addWorksheet').css("margin", "0px 3px");
            var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
            var $addspan = $('<span></span>').text('添加').appendTo($adda);

            return [$adda];
        });

        searcher.line("module", lineprops, linebtns).render();
    }

    com.focusPage("#addWorksheet").click(function() {

        worksheet.modals.addWorksheetModal.modal("show");
    });

    function saveData() {

        if (com.validate('addWorksheetModal'))
            return false;

        var options = {
            "worksheet.module": worksheet.items.module.val(),
            "worksheet.content": worksheet.items.content.val(),
            "worksheet.path": worksheet.items.path.val(),
        };

        com.post(api.information.addWorksheet, options, function(res) {

            searcher.doSearch();

            com.showAlert(com.info, "操作成功");
        });

        worksheet.modals.addWorksheetModal.modal("hide");
    }

    function handData() {

        if (com.validate('handWorksheetModal'))
            return false;

        var options = {
            "worksheet.wsid": worksheet.wsid,
            "worksheet.result": worksheet.items.result.val()
        };

        com.post(api.information.handleWorksheet, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });

        worksheet.modals.handWorksheetModal.modal("hide");
    }

    function finish(wsid) {

        var options = {
            "worksheet.wsid": wsid,
        };
        com.post(api.information.finishWorksheet, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
        });

    }

    com.uploadify("#path", "图片", api.common.uploadOther, 'btn btn-success blue ', '*.jpg;*.jpeg;*.gif;*.png', {
        'uploadType': 0
    }, 1, function(data) {

        var options = {};

        com.focusPage("#path").val(data.resUrl);
        com.focusPage("#infoPicture").attr("href", com.showImg(com.focusPage("#showImg"), data.resUrl, 150, 150, ''));

        searcher.doSearch();
    });

    function init() {

        var estab = $('<div></div>').addClass("col-xs-6").prependTo(com.focusPage("#workContent"));
        var aTag = $('<a id="addWorksheet" href="#"></a>').addClass("btn btn-success btn-app btn-sm radius-4").appendTo(estab);
        var iTag = $('<i></i>').addClass("icon-plus-sign bigger-230").appendTo(aTag);
        var span = $('<span></span>').html("创建").appendTo(aTag);

        var $widget = $('<div></div>').addClass("col-xs-6 col-md-6").prependTo(com.focusPage("#workContent"));
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header header-color-green").appendTo($box);
        var name = $('<h4></h4>').attr('id', 'worksheet4content').text("不仅仅是工单").appendTo($header);
        var $body = $('<div></div>').addClass("widget-body").appendTo($box);
        var $main = $('<div></div>').addClass("widget-main").appendTo($body);
        var $info = $('<div></div>').appendTo($main);

        var content = "<h4>这是一个入口</h4>无论是 <b class='blue lead'>意见</b>/<b class='blue lead'>建议</b>/<b class='blue lead'>需求</b>/<b class='blue lead'>问题</b>/<b class='blue lead'>...</b> , 甚至是<b class='blue lead'>吐槽</b> , 或者仅仅想<b class='blue lead'>'呵呵'</b>一句 , 不限内容 , 都可以通过这个功能来表达. <h4>我们来给出反馈. </h4>";

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').html(content)).appendTo($info);

    }
});