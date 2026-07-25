jQuery(function($) {

    var marketSource = {
        saveBtn: null,
        modal: null,
        items: [],
        msid: null,
        editFlag: false,
        campaigns: [],
        channels: [],
        status: ["启用", "停用"]
    };

    marketSource.saveBtn = com.focusPage("#saveBtn").on("click", saveData);

    marketSource.items.campaignId = com.focusPage("#campaignId");
    marketSource.items.channelId = com.focusPage("#channelId");
    marketSource.items.profileId = com.focusPage("#profileId");
    marketSource.items.code = com.focusPage("#code");
    marketSource.items.url = com.focusPage("#url");
    marketSource.items.qrcode = com.focusPage("#qrcode");
    marketSource.items.utmSource = com.focusPage("#utmSource");
    marketSource.items.utmMedium = com.focusPage("#utmMedium");
    marketSource.items.utmCampaign = com.focusPage("#utmCampaign");

    marketSource.modal = com.focusPage("#marketSourceModal");
    marketSource.modal.on('show.bs.modal', function(e) {
        com.clearValidator();
    });
    marketSource.modal.on('hidden.bs.modal', function() {
        marketSource.msid = null;
        marketSource.editFlag = false;
    });

    loadCampaigns();
    loadChannels();

    var lineprops = (function() {

        return [{
            field: "code",
            name: "来源码",
            prop: "code",
            clazz: "grey"
        }, {
            field: "campaignId",
            name: "活动",
            prop: function(v) { return marketSource.campaigns[v.campaignId] || v.campaignId; },
            clazz: "blue"
        }, {
            field: "channelId",
            name: "渠道",
            prop: function(v) { return marketSource.channels[v.channelId] || v.channelId; },
            clazz: "blue"
        }, {
            field: "profileId",
            name: "关联ID",
            prop: "profileId",
            clazz: "grey"
        }, {
            field: "utmSource",
            name: "UTM Source",
            prop: "utmSource",
            clazz: "grey"
        }, {
            field: "utmMedium",
            name: "UTM Medium",
            prop: "utmMedium",
            clazz: "grey"
        }, {
            field: "utmCampaign",
            name: "UTM Campaign",
            prop: "utmCampaign",
            clazz: "grey"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return marketSource.status[v.status] || "-"; },
            clazz: "red"
        }];
    })();

    var linebtns = (function() {

        return {
            edit: {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {
                    marketSource.items.campaignId.val(v.campaignId);
                    marketSource.items.channelId.val(v.channelId);
                    marketSource.items.profileId.val(v.profileId == 0 ? "" : v.profileId);
                    marketSource.items.code.val(com.checkNull(v.code, ""));
                    marketSource.items.url.val(com.checkNull(v.url, ""));
                    marketSource.items.qrcode.val(com.checkNull(v.qrcode, ""));
                    marketSource.items.utmSource.val(com.checkNull(v.utmSource, ""));
                    marketSource.items.utmMedium.val(com.checkNull(v.utmMedium, ""));
                    marketSource.items.utmCampaign.val(com.checkNull(v.utmCampaign, ""));

                    marketSource.msid = v.msid;
                    marketSource.editFlag = true;
                    marketSource.modal.modal("show");
                }
            },
            disable: {
                name: "停用",
                clazz: "btn-danger",
                handle: function(v) {
                    com.post(api.market.disableMarketSource, {
                        "marketSource.msid": v.msid
                    }, function(res) {
                        com.showAlert(com.info, "停用成功");
                        searcher.doSearch();
                    });
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addMarketSource').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.market.pageMarketSource, null, ["market-source-code", "market-source-campaign", "market-source-channel", "market-source-status", "market-source-utm"], "marketSourcePostData", null, false, buttons);
    searcher.line("code", lineprops, linebtns).render();

    com.focusPage('a[name="addMarketSource"]', '#pagenation').click(function() {
        com.cleanItems(marketSource.items);
        com.clearValidator("marketSourceModal");
        marketSource.items.campaignId.val("");
        marketSource.items.channelId.val("");
        marketSource.modal.modal("show");
    });

    function saveData() {

        if (com.validate("marketSourceModal")) {
            return false;
        }

        var options = {
            "marketSource.campaignId": marketSource.items.campaignId.val(),
            "marketSource.channelId": marketSource.items.channelId.val(),
            "marketSource.profileId": marketSource.items.profileId.val() || 0,
            "marketSource.code": marketSource.items.code.val(),
            "marketSource.url": marketSource.items.url.val(),
            "marketSource.qrcode": marketSource.items.qrcode.val(),
            "marketSource.utmSource": marketSource.items.utmSource.val(),
            "marketSource.utmMedium": marketSource.items.utmMedium.val(),
            "marketSource.utmCampaign": marketSource.items.utmCampaign.val()
        };

        if (marketSource.editFlag) {
            options["marketSource.msid"] = marketSource.msid;
            com.post(api.market.updateMarketSource, options, function(res) {
                com.showAlert(com.info, "修改成功");
                searcher.doSearch();
            });
        } else {
            com.post(api.market.addMarketSource, options, function(res) {
                com.showAlert(com.info, "创建成功");
                searcher.doSearch();
            });
        }

        marketSource.modal.modal("hide");
    }

    function loadCampaigns() {

        marketSource.items.campaignId.empty().append('<option value="">请选择</option>');

        com.post(api.market.queryMarketCampaignForEnable, {}, function(res) {

            $.each(res.marketCampaigns || [], function(i, v) {
                marketSource.campaigns[v.mcid] = v.name;
                $('<option></option>').val(v.mcid).text(v.name).appendTo(marketSource.items.campaignId);
            });
        }, null, false);
    }

    function loadChannels() {

        marketSource.items.channelId.empty().append('<option value="">请选择</option>');

        com.post(api.market.queryMarketChannelForEnable, {}, function(res) {

            $.each(res.marketChannels || [], function(i, v) {
                marketSource.channels[v.mchid] = v.name;
                $('<option></option>').val(v.mchid).text(v.name).appendTo(marketSource.items.channelId);
            });
        }, null, false);
    }
});
