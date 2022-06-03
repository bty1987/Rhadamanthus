jQuery(function($) {

    var activityItem = {

        awardStock: null,

        saveBtn: com.focusPage("#saveActivityItemBtn"),
        cancelBtn: com.focusPage("#cancelBtn"),

        modals: {
            activityItemModal: com.focusPage("#activityItemModal")
        },

        items: {
            activityName: com.focusPage("#activityName", "#activityItem"),
            activityItems: com.focusPage("#activityItems", "#activityItem"),

            name: com.focusPage("#name", "#activityItemModal"),
            money: com.focusPage("#money", "#activityItemModal"),
            integral: com.focusPage("#integral", "#activityItemModal")
        },

        activityItemPostData: {
            aid: params.infomation.aid,
            activityName: params.infomation.activityName
        },

        type: {},
        storeroom: {}
    };

    activityItem.saveBtn.bindClick(saveData);

    activityItem.modals.activityItemModal.on("hide.bs.modal", function() {

        activityItem.awardStock = null;

        com.clearValidator();
        com.cleanItems(activityItem.items);

        com.cleanTypeahead(activityItem.items.name);
        com.closeTip();
    });

    com.post(api.ds.information, {
        "timestamp": new Date().getTime()
    }, function(res) {

        activityItem.type = res.awardStockType.split("key", "value");
        activityItem.storeroom = res.awardStoreRoom.split("key", "value");

    }, null, false);

    activityItem.items.activityName.text(params.infomation.activityName);

    com.initTypeahead(activityItem.items.name, api.information.queryAwardStockByName, "awardStock.name", {}, "awardStocks", "asId", function(v) {

        return v.name + "-" + activityItem.type[v.type] + "-" + activityItem.storeroom[v.storeroom];
    }, function(list, k, v) {

        $.each(list, function(i, e) {

            if (e.asId != k)
                return true;

            activityItem.awardStock = e;

            return false;
        })

        return v;
    });

    com.post(api.information.queryActivityItemByAid, {
        "activity.aid": params.infomation.aid
    }, function(res) {

        var activityItems = res.activityItems;

        $.each(activityItems, function(i, v) {

            addActivityItemForDiv(activityItem.items.activityItems, v);
        });
    });

    function addActivityItemForDiv(_activityItems, _activityItem) {

        var pricingSpan = $("<div></div>").addClass("pricing-span").css("margin-right", "10px").attr("id", "pricing_" + _activityItem.aiid).prependTo(_activityItems);
        var widgetBox = $("<div></div>").addClass("widget-box pricing-box-small").appendTo(pricingSpan);

        var widgetHeader = $("<div></div>").addClass("widget-header").appendTo(widgetBox);
        var widgetHeaderH5 = $("<h5></h5>").addClass("bigger lighter").appendTo(widgetHeader);

        if (_activityItem.type == 0) {
            widgetHeader.addClass("header-color-blue");
            widgetHeaderH5.text("券");
        } else if (_activityItem.type == 1) {
            widgetHeader.addClass("header-color-green");
            widgetHeaderH5.text("物品");
        } else if (_activityItem.type == 2) {
            widgetHeader.addClass("header-color-red");
            widgetHeaderH5.text("红包");
        }

        var widgetBody = $("<div></div>").addClass("widget-body").appendTo(widgetBox);
        var widgetMain = $("<div></div>").addClass("widget-main no-padding").appendTo(widgetBody);
        var ul = $("<ul></ul>").addClass("list-unstyled list-striped pricing-table").appendTo(widgetMain);

        var nameLi = $("<li></li>").appendTo(ul);
        var nameSpan = $("<span></span>").attr("id", "activityItemName_" + _activityItem.aiid).text(_activityItem.name).appendTo(nameLi);

        var moneyLi = $("<li></li>").text("金额:").appendTo(ul);
        var moneySpan = $("<span></span>").attr("id", "money_" + _activityItem.aiid).text(_activityItem.money).appendTo(moneyLi);

        var integralLi = $("<li></li>").text("积分:").appendTo(ul);
        var integralSpan = $("<span></span>").attr("id", "integral_" + _activityItem.aiid).text(_activityItem.integral).appendTo(integralLi);

        var uiPgDiv = $("<div></div>").addClass("ui-pg-div").appendTo(widgetBody);
        var deleteBtn = $("<span></span>").addClass("ui-icon ui-icon-trash").attr("id", "delete_" + _activityItem.aiid).appendTo(uiPgDiv);

        deleteBtn.on("click", function() {

            deleteActivityItem(_activityItem.aiid, _activityItem.name);
        });
    }

    com.focusPage("#addBtn").on("click", function() {

        activityItem.modals.activityItemModal.modal("show");
    });

    function saveData() {

        if (com.validate('activityItemModal')) {
            return false;
        }

        var options = {
            "activity.aid": params.infomation.aid,
            "activityItem.asid": com.typeahead(activityItem.items.name),
            "activityItem.money": activityItem.items.money.val(),
            "activityItem.integral": activityItem.items.integral.val(),
            "activityItem.type": activityItem.awardStock.type,
            "activityItem.activity": params.infomation.activityName
        };

        com.post(api.information.addActivityItem, options, function(res) {

            com.showAlert(com.info, "操作成功");

            addActivityItemForDiv(activityItem.items.activityItems, res.activityItem);

        });

        activityItem.modals.activityItemModal.modal("hide");
    }

    function deleteActivityItem(aiId, activityItemName) {

        com.showConfirm("是否需要删除" + activityItemName + "活动物品?", function(result) {

            com.post(api.information.deleteActivityItem, {
                "activityItem.aiid": aiId
            }, function(res) {

                com.showAlert(com.info, "操作成功");

                com.focusPage("#pricing_" + aiId).remove();
            });
        });
    }

});
