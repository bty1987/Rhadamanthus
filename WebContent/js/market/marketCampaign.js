jQuery(function($) {

    var marketCampaign = {
        saveBtn: null,
        modal: null,
        items: [],
        mcid: null,
        editFlag: false,
        type: ["常规", "线上", "线下", "异业", "转介绍"],
        status: ["草稿", "预热", "进行中", "暂停", "结束", "归档"]
    };

    marketCampaign.saveBtn = com.focusPage("#saveBtn").on("click", saveData);

    marketCampaign.items.name = com.focusPage("#name");
    marketCampaign.items.type = com.focusPage("#type");
    marketCampaign.items.regionId = com.focusPage("#regionId");
    marketCampaign.items.ownerId = com.focusPage("#ownerId");
    marketCampaign.items.budget = com.focusPage("#budget");
    marketCampaign.items.startTime = com.focusPage("#startTime");
    marketCampaign.items.endTime = com.focusPage("#endTime");
    marketCampaign.items.comment = com.focusPage("#comment");

    marketCampaign.modal = com.focusPage("#marketCampaignModal");
    marketCampaign.modal.on('show.bs.modal', function(e) {
        com.clearValidator();
    });
    marketCampaign.modal.on('hidden.bs.modal', function() {
        marketCampaign.mcid = null;
        marketCampaign.editFlag = false;
    });

    var lineprops = (function() {

        return [{
            field: "name",
            name: "活动名称",
            prop: "name",
            clazz: "grey"
        }, {
            field: "type",
            name: "类型",
            prop: function(v) { return marketCampaign.type[v.type] || "-"; },
            clazz: "blue"
        }, {
            field: "budget",
            name: "预算",
            prop: function(v) { return com.checkNull(v.budget, 0); },
            clazz: "grey"
        }, {
            field: "startTime",
            name: "开始时间",
            prop: "startTime",
            clazz: "grey"
        }, {
            field: "endTime",
            name: "结束时间",
            prop: "endTime",
            clazz: "grey"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return marketCampaign.status[v.status] || "-"; },
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
                    marketCampaign.items.name.val(v.name);
                    marketCampaign.items.type.val(v.type);
                    marketCampaign.items.regionId.val(v.regionId == 0 ? "" : v.regionId);
                    marketCampaign.items.ownerId.val(v.ownerId == 0 ? "" : v.ownerId);
                    marketCampaign.items.budget.val(com.checkNull(v.budget, ""));
                    marketCampaign.items.startTime.val(com.checkNull(v.startTime, ""));
                    marketCampaign.items.endTime.val(com.checkNull(v.endTime, ""));
                    marketCampaign.items.comment.val(com.checkNull(v.comment, ""));

                    marketCampaign.mcid = v.mcid;
                    marketCampaign.editFlag = true;
                    marketCampaign.modal.modal("show");
                }
            },
            publish: {
                name: "发布",
                clazz: "btn-success",
                handle: function(v) {
                    com.post(api.market.publishMarketCampaign, {
                        "marketCampaign.mcid": v.mcid
                    }, function(res) {
                        com.showAlert(com.info, "发布成功");
                        searcher.doSearch();
                    });
                }
            },
            disable: {
                name: "停用",
                clazz: "btn-danger",
                handle: function(v) {
                    com.post(api.market.disableMarketCampaign, {
                        "marketCampaign.mcid": v.mcid
                    }, function(res) {
                        com.showAlert(com.info, "停用成功");
                        searcher.doSearch();
                    });
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addMarketCampaign').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.market.pageMarketCampaign, null, ["market-campaign-name", "market-campaign-type", "market-campaign-status"], "marketCampaignPostData", null, false, buttons);
    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('a[name="addMarketCampaign"]', '#pagenation').click(function() {
        com.cleanItems(marketCampaign.items);
        com.clearValidator("marketCampaignModal");
        marketCampaign.items.type.val(0);
        marketCampaign.modal.modal("show");
    });

    function saveData() {

        if (com.validate("marketCampaignModal")) {
            return false;
        }

        var options = {
            "marketCampaign.name": marketCampaign.items.name.val(),
            "marketCampaign.type": marketCampaign.items.type.val(),
            "marketCampaign.regionId": marketCampaign.items.regionId.val() || 0,
            "marketCampaign.ownerId": marketCampaign.items.ownerId.val() || 0,
            "marketCampaign.budget": marketCampaign.items.budget.val() || 0,
            "marketCampaign.startTime": marketCampaign.items.startTime.val(),
            "marketCampaign.endTime": marketCampaign.items.endTime.val(),
            "marketCampaign.comment": marketCampaign.items.comment.val()
        };

        if (marketCampaign.editFlag) {
            options["marketCampaign.mcid"] = marketCampaign.mcid;
            com.post(api.market.updateMarketCampaign, options, function(res) {
                com.showAlert(com.info, "修改成功");
                searcher.doSearch();
            });
        } else {
            com.post(api.market.addMarketCampaign, options, function(res) {
                com.showAlert(com.info, "创建成功");
                searcher.doSearch();
            });
        }

        marketCampaign.modal.modal("hide");
    }
});
