jQuery(function($) {

    var marketInbound = {
        modal: null,
        info: null,
        items: null,
        campaigns: [],
        channels: [],
        status: ["待承接", "成功", "失败", "重试中", "忽略"]
    };

    marketInbound.modal = com.focusPage("#marketInboundModal");
    marketInbound.info = com.focusPage("#inboundInfo");
    marketInbound.items = com.focusPage("#inboundItems");

    loadCampaigns();
    loadChannels();

    var lineprops = (function() {

        return [{
            field: "inboundNo",
            name: "入站编号",
            prop: "inboundNo",
            clazz: "grey"
        }, {
            field: "name",
            name: "称呼",
            prop: "name",
            clazz: "grey"
        }, {
            field: "phone",
            name: "电话",
            prop: "phone",
            clazz: "grey"
        }, {
            field: "campaignId",
            name: "活动",
            prop: function(v) { return marketInbound.campaigns[v.campaignId] || v.campaignId; },
            clazz: "blue"
        }, {
            field: "channelId",
            name: "渠道",
            prop: function(v) { return marketInbound.channels[v.channelId] || v.channelId; },
            clazz: "blue"
        }, {
            field: "sourceId",
            name: "来源ID",
            prop: "sourceId",
            clazz: "grey"
        }, {
            field: "csid",
            name: "客资ID",
            prop: function(v) { return v.csid == 0 ? "-" : v.csid; },
            clazz: "grey"
        }, {
            field: "ccid",
            name: "机会ID",
            prop: function(v) { return v.ccid == 0 ? "-" : v.ccid; },
            clazz: "grey"
        }, {
            field: "orderId",
            name: "订单号",
            prop: "orderId",
            clazz: "grey"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return marketInbound.status[v.status] || "-"; },
            clazz: "red"
        }, {
            field: "errorMsg",
            name: "失败原因",
            prop: "errorMsg",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        return {
            detail: {
                name: "详情",
                clazz: "btn-yellow",
                handle: function(v) {
                    com.post(api.market.queryMarketInboundByMiid, {
                        "marketInbound.miid": v.miid
                    }, function(res) {
                        showDetail(res.marketInbound);
                    });
                }
            },
            retry: {
                name: "重试",
                clazz: "btn-success",
                handle: function(v) {
                    com.post(api.market.retryMarketInbound, {
                        "marketInbound.miid": v.miid
                    }, function(res) {
                        com.showAlert(com.info, "重试完成");
                        searcher.doSearch();
                    });
                }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.market.pageMarketInbound, null, ["market-inbound-no", "market-inbound-name", "market-inbound-phone-hash", "market-inbound-orderId", "market-inbound-status", "market-inbound-campaign", "market-inbound-channel", "market-inbound-source", "market-inbound-csid", "market-inbound-ccid"], "marketInboundPostData", null, false, null);
    searcher.line("inboundNo", lineprops, linebtns).render();

    function showDetail(data) {

        marketInbound.info.empty();
        marketInbound.items.empty();

        appendInfo("入站编号", data.inboundNo);
        appendInfo("称呼", data.name);
        appendInfo("电话", data.phone);
        appendInfo("微信", data.wechat);
        appendInfo("邮箱", data.email);
        appendInfo("企业", data.companyName);
        appendInfo("需求", data.demand);
        appendInfo("活动", marketInbound.campaigns[data.campaignId] || data.campaignId);
        appendInfo("渠道", marketInbound.channels[data.channelId] || data.channelId);
        appendInfo("来源ID", data.sourceId);
        appendInfo("客资ID", data.csid == 0 ? "-" : data.csid);
        appendInfo("机会ID", data.ccid == 0 ? "-" : data.ccid);
        appendInfo("订单号", data.orderId);
        appendInfo("状态", marketInbound.status[data.status] || "-");
        appendInfo("失败原因", data.errorMsg);
        appendInfo("创建时间", data.createTime);
        appendInfo("更新时间", data.updateTime);

        $.each(data.items || [], function(i, item) {
            var $tr = $('<tr></tr>').appendTo(marketInbound.items);
            $('<td></td>').text(item.fieldKey).appendTo($tr);
            $('<td></td>').text(com.checkNull(item.fieldValue, "")).appendTo($tr);
        });

        if ((data.items || []).length == 0) {
            var $tr = $('<tr></tr>').appendTo(marketInbound.items);
            $('<td colspan="2"></td>').text("暂无扩展字段").appendTo($tr);
        }

        marketInbound.modal.modal("show");
    }

    function appendInfo(label, value) {

        var $item = $('<div></div>').addClass('profile-info-row').appendTo(marketInbound.info);
        $('<div></div>').addClass('profile-info-name').text(label).appendTo($item);
        $('<div></div>').addClass('profile-info-value').text(com.checkNull(value, "-")).appendTo($item);
    }

    function loadCampaigns() {

        com.post(api.market.queryMarketCampaignForEnable, {}, function(res) {

            $.each(res.marketCampaigns || [], function(i, v) {
                marketInbound.campaigns[v.mcid] = v.name;
            });
        }, null, false);
    }

    function loadChannels() {

        com.post(api.market.queryMarketChannelForEnable, {}, function(res) {

            $.each(res.marketChannels || [], function(i, v) {
                marketInbound.channels[v.mchid] = v.name;
            });
        }, null, false);
    }
});
