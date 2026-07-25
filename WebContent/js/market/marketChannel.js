jQuery(function($) {

    var marketChannel = {
        saveBtn: null,
        modal: null,
        items: [],
        mchid: null,
        editFlag: false,
        type: ["未知", "搜索", "社媒", "信息流", "线下", "合作", "转介绍"],
        status: ["启用", "停用"]
    };

    marketChannel.saveBtn = com.focusPage("#saveBtn").on("click", saveData);

    marketChannel.items.name = com.focusPage("#name");
    marketChannel.items.type = com.focusPage("#type");
    marketChannel.items.platform = com.focusPage("#platform");
    marketChannel.items.ownerId = com.focusPage("#ownerId");
    marketChannel.items.comment = com.focusPage("#comment");

    marketChannel.modal = com.focusPage("#marketChannelModal");
    marketChannel.modal.on('show.bs.modal', function(e) {
        com.clearValidator();
    });
    marketChannel.modal.on('hidden.bs.modal', function() {
        marketChannel.mchid = null;
        marketChannel.editFlag = false;
    });

    var lineprops = (function() {

        return [{
            field: "name",
            name: "渠道名称",
            prop: "name",
            clazz: "grey"
        }, {
            field: "type",
            name: "类型",
            prop: function(v) { return marketChannel.type[v.type] || "-"; },
            clazz: "blue"
        }, {
            field: "platform",
            name: "平台",
            prop: "platform",
            clazz: "grey"
        }, {
            field: "ownerId",
            name: "负责人ID",
            prop: "ownerId",
            clazz: "grey"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return marketChannel.status[v.status] || "-"; },
            clazz: "red"
        }, {
            field: "comment",
            name: "备注",
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
                    marketChannel.items.name.val(v.name);
                    marketChannel.items.type.val(v.type);
                    marketChannel.items.platform.val(com.checkNull(v.platform, ""));
                    marketChannel.items.ownerId.val(v.ownerId == 0 ? "" : v.ownerId);
                    marketChannel.items.comment.val(com.checkNull(v.comment, ""));

                    marketChannel.mchid = v.mchid;
                    marketChannel.editFlag = true;
                    marketChannel.modal.modal("show");
                }
            },
            disable: {
                name: "停用",
                clazz: "btn-danger",
                handle: function(v) {
                    com.post(api.market.disableMarketChannel, {
                        "marketChannel.mchid": v.mchid
                    }, function(res) {
                        com.showAlert(com.info, "停用成功");
                        searcher.doSearch();
                    });
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addMarketChannel').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.market.pageMarketChannel, null, ["market-channel-name", "market-channel-platform", "market-channel-type", "market-channel-status"], "marketChannelPostData", null, false, buttons);
    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('a[name="addMarketChannel"]', '#pagenation').click(function() {
        com.cleanItems(marketChannel.items);
        com.clearValidator("marketChannelModal");
        marketChannel.items.type.val(0);
        marketChannel.modal.modal("show");
    });

    function saveData() {

        if (com.validate("marketChannelModal")) {
            return false;
        }

        var options = {
            "marketChannel.name": marketChannel.items.name.val(),
            "marketChannel.type": marketChannel.items.type.val(),
            "marketChannel.platform": marketChannel.items.platform.val(),
            "marketChannel.ownerId": marketChannel.items.ownerId.val() || 0,
            "marketChannel.comment": marketChannel.items.comment.val()
        };

        if (marketChannel.editFlag) {
            options["marketChannel.mchid"] = marketChannel.mchid;
            com.post(api.market.updateMarketChannel, options, function(res) {
                com.showAlert(com.info, "修改成功");
                searcher.doSearch();
            });
        } else {
            com.post(api.market.addMarketChannel, options, function(res) {
                com.showAlert(com.info, "创建成功");
                searcher.doSearch();
            });
        }

        marketChannel.modal.modal("hide");
    }
});
