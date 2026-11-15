jQuery(function($) {

    // 跟单弹层(双模式): pre=售前(挂装修单orderId,设计师品类品牌意向) / post=售后(挂销售单sid,配送服务过程)
    // 入口: 装修单详情"售前跟单"页签[新增跟单](params.sales.followupMode='pre' + orderId) / 销售单列表行按钮"跟单"(followupMode='post' + sid + sales行)
    // post信息条品类/品牌取销售单自身字段,配送进度=querySalesDeliveryItem最大状态; 删除=仅记录人可见(服务端370038硬闸)

    var mode = params.sales.followupMode == "post" ? "post" : "pre";
    var dict = salesFollowupDict[mode];

    var conf = mode == "pre" ? {
        query: api.sales.querySalesPreFollowupByOrderId,
        count: api.sales.countSalesPreFollowup,
        add: api.sales.addSalesPreFollowup,
        del: api.sales.deleteSalesPreFollowup,
        key: "salesPreFollowup",
        idKey: "orderId"
    } : {
        query: api.sales.querySalesPostFollowupBySid,
        count: api.sales.countSalesPostFollowup,
        add: api.sales.addSalesPostFollowup,
        del: api.sales.deleteSalesPostFollowup,
        key: "salesPostFollowup",
        idKey: "sid"
    };

    var followup = {
        records: [],
        me: null,
        filterKey: "",
        idValue: mode == "pre" ? params.sales.orderId : params.sales.sid
    };

    com.focusPage('#btnBack').on("click", function() {
        com.closePopup();
    });

    // 当前登录人(删除按钮仅记录人可见)
    com.post(api.personel.queryUserForSelfByUserId, {}, function(res) {
        followup.me = res.user.userId;
    }, null, false);

    initPage();
    initForm();
    show();

    function initPage() {

        com.focusPage(".postOnly").toggleClass("hidden", mode != "post");
        com.focusPage(".preOnly").toggleClass("hidden", mode != "pre");

        if (mode == "post" && params.sales.sales) {

            var sales = params.sales.sales;

            var props = [
                "销售单号: " + (sales.no || sales.sid),
                "装修单号: " + (sales.orderId || "-"),
                "品类: " + (sales.category || "-"),
                "品牌: " + (sales.brand ? sales.brand.name : "-"),
                "收款状态: " + (constant.sales().sales.fullpayStatus.keys[sales.fullpayStatus] || sales.fullpayStatus)
            ];

            com.post(api.sales.querySalesDeliveryItem, {
                "salesDeliveryItem.sales.sid": sales.sid
            }, function(res) {

                var progress = "-";

                if (res.salesDeliveryItems && res.salesDeliveryItems.length) {

                    var max = 0;

                    $.each(res.salesDeliveryItems, function(i, v) {
                        max = Math.max(max, v.status || 0);
                    });

                    progress = salesDeliveryItemStatus[max];
                }

                props.push("配送进度: " + progress);

                com.focusPage("#salesFollowupInfo").html(props.join("&nbsp;&nbsp;&nbsp;&nbsp;"));

            }, null, false);

        } else if (mode == "pre") {

            com.focusPage("#salesFollowupInfo").html("装修单号: " + followup.idValue);
        }

        // 筛选: pre=品类(记录内去重,show后填充) / post=事项(字典全集)
        var $filter = com.focusPage("#followupFilter").html('').append($('<option></option>').attr("value", "").text(mode == "pre" ? "全部品类" : "全部事项"));

        if (mode == "post") {
            $.each(dict.items, function(k, v) {
                $filter.append($('<option></option>').attr("value", k).text(v));
            });
        }

        $filter.on("change", function() {
            followup.filterKey = $(this).val();
            display();
        });
    }

    function updateFilter() {

        if (mode != "pre")
            return;

        var $filter = com.focusPage("#followupFilter");
        var current = followup.filterKey;

        $filter.html('').append($('<option></option>').attr("value", "").text("全部品类"));

        var categories = [];

        $.each(followup.records, function(i, v) {
            if (v.category && categories.indexOf(v.category) == -1) categories.push(v.category);
        });

        $.each(categories, function(i, v) {
            $filter.append($('<option></option>').attr("value", v).text(v));
        });

        if (categories.indexOf(current) != -1) $filter.val(current);
    }

    function initForm() {

        var $item = com.focusPage("#followupItem").html('');
        $.each(dict.items, function(k, v) {
            $item.append($('<option></option>').attr("value", k).text(v));
        });

        var $way = com.focusPage("#followupWay").html('');
        $.each(dict.ways, function(k, v) {
            $way.append($('<option></option>').attr("value", k).text(v));
        });

        if (mode == "pre") {

            var $category = com.focusPage("#followupCategory").html('').append($('<option></option>').attr("value", "").text("不限"));
            var $brand = com.focusPage("#followupBrand").html('').append($('<option></option>').attr("value", "").text("不限"));

            com.post(api.data.queryCategory, {}, function(res) {

                $.each(res.categorys, function(i, v) {

                    if (v.type == 0 || !v.name)
                        return;

                    $category.append($('<option></option>').attr("value", v.cid).text(v.name));
                });

            }, null, false);

            $category.on("change", function() {

                var cid = $(this).val();

                $brand.html('').append($('<option></option>').attr("value", "").text("不限"));

                if (!cid)
                    return;

                com.post(api.data.queryBrandByCid, {
                    "brand.cid": cid
                }, function(res) {

                    $.each(res.brands, function(i, v) {
                        $brand.append($('<option></option>').attr("value", v.bid).text(v.name));
                    });

                }, null, false);
            });
        }

        com.datetime(com.focusPage("#followupPlanTime"), "date");

        com.focusPage("#addFollowupBtn").on("click", function() {
            com.focusPage("#addFollowupModal").modal("show");
        });

        com.focusPage("#saveFollowupBtn").on("click", save);
    }

    function show() {

        var args = {};
        args[conf.key + "." + conf.idKey] = followup.idValue;

        com.post(conf.query, args, function(res) {

            followup.records = res[conf.key + "s"] || [];

            var countArgs = {};
            countArgs[conf.key + "." + conf.idKey] = followup.idValue;

            com.post(conf.count, countArgs, function(res2) {
                renderFollowupStats(com.focusPage("#salesFollowupStats"), res2[conf.key] || {});
            }, null, false);

            updateFilter();

            display();

        }, null, false);
    }

    function display() {

        var records = followup.records;

        if (followup.filterKey !== "") {
            records = $.grep(records, function(v) {
                return String(mode == "pre" ? (v.category || "") : v.item) == String(followup.filterKey);
            });
        }

        renderFollowupList(com.focusPage("#salesFollowupList"), records, mode, followup.me, remove);
    }

    function save() {

        if (com.validate('addFollowupModal'))
            return false;

        var args = {};
        args[conf.key + "." + conf.idKey] = followup.idValue;
        args[conf.key + ".item"] = com.focusPage("#followupItem").val();
        args[conf.key + ".way"] = com.focusPage("#followupWay").val();
        args[conf.key + ".content"] = com.focusPage("#followupContent").val();

        if (mode == "pre") {
            args[conf.key + ".bid"] = com.focusPage("#followupBrand").val() || 0;
        } else {
            args[conf.key + ".result"] = com.focusPage("#followupResult").val();
        }

        args[conf.key + ".plan"] = com.focusPage("#followupPlan").val();
        args[conf.key + ".planTime"] = com.focusPage("#followupPlanTime").val() ? com.focusPage("#followupPlanTime").val() + " 00:00:00" : "";

        com.post(conf.add, args, function(res) {

            com.focusPage("#addFollowupModal").modal("hide");
            com.cleanItems({
                content: com.focusPage("#followupContent"),
                result: com.focusPage("#followupResult"),
                plan: com.focusPage("#followupPlan"),
                planTime: com.focusPage("#followupPlanTime")
            });

            com.showAlert(com.info, "操作成功");

            show();

        }, null, false);
    }

    function remove(v) {

        com.showConfirm("是否删除该条跟单记录?", function() {

            var args = {};
            args[conf.key + ".sfid"] = v.sfid;

            com.post(conf.del, args, function(res) {
                com.showAlert(com.info, "操作成功");
                show();
            });
        });
    }

});
