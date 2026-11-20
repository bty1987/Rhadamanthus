jQuery(function($) {

    // 跟单弹层(双模式): pre=售前(挂装修单orderId,设计师品类品牌意向) / post=售后(挂销售单sid,配送服务过程)
    // 入口: 装修单详情"售前跟单"页签[新增跟单](params.sales.followupMode='pre' + orderId) / 销售单列表行按钮"跟单"(followupMode='post' + sid + sales行)
    // post信息条品类/品牌取销售单自身字段,配送进度=querySalesDeliveryItem最大状态; 删除=仅记录人可见(服务端370038硬闸)

    // 跟单枚举字典(本页内联,不依赖共享utils)——与后端 SalesPreFollowupPO/SalesPostFollowupPO 常量一一对应(照sales4operate.js字典先例)
    var salesFollowupDict = {
        pre: {
            label: "售前跟单",
            items: {0: "意向沟通", 1: "品牌到店", 2: "方案比价", 9: "其他"},
            ways: {0: "电话", 1: "微信", 2: "到店接待", 3: "上门", 9: "其他"}
        },
        post: {
            label: "售后跟单",
            items: {0: "配送协调", 1: "安装服务", 2: "客户回访", 3: "投诉处理", 9: "其他"},
            ways: {0: "电话", 1: "微信", 2: "上门", 9: "其他"}
        }
    };

    // 售后配送进度(salesdeliveryitem.status, 照 SalesDeliveryItemPO 状态枚举)
    var salesDeliveryItemStatus = {0: "初始", 1: "配送", 2: "审核", 3: "客户确认", 4: "完结"};

    function followupOverdue(planTime) {
        return planTime && new Date(String(planTime).replace(/-/g, "/")).getTime() < Date.now();
    }

    function followupDaysBefore(timeStr) {
        return Math.floor((Date.now() - new Date(String(timeStr).replace(/-/g, "/")).getTime()) / 86400000);
    }

    // 统计条: 跟单记录总数 / 最近跟进(>7天标橙) / 超期计划(标红); stats={total, lastTime, overdueCount}
    function renderFollowupStats($wrap, stats) {

        var $box = $('<div></div>').addClass('clearfix').css({'padding': '4px 8px', 'border-bottom': '1px solid #eee'});

        var overdue = stats.overdueCount || 0;

        $box.append($('<b></b>').addClass('blue').text("跟单记录:" + (stats.total || 0)));

        var $last = $('<b></b>').text(stats.lastTime ? "最近跟进:" + followupDaysBefore(stats.lastTime) + "天前" : "最近跟进:无记录");
        $last.addClass(stats.lastTime && followupDaysBefore(stats.lastTime) > 7 ? 'orange' : 'grey');
        $box.append($last);

        $box.append($('<b></b>').addClass(overdue > 0 ? 'red' : 'grey').text("超期计划:" + overdue));

        $wrap.append($box);
    }

    // 跟单记录时间轴条目(pre/post共用); me=当前登录人userId(空则不显示删除), onDelete(记录)删除回调
    function renderFollowupItem($ul, v, type, me, onDelete) {

        var dict = salesFollowupDict[type];

        var $li = $('<li></li>').addClass('item-orange clearfix');

        if (followupOverdue(v.planTime)) $li.css('border-left', '3px solid #d15b47');

        var $h3 = $('<h3></h3>').addClass('oid');

        $h3.append($('<small></small>').addClass(followupOverdue(v.planTime) ? 'red' : 'blue').text(dict.items[v.item] || v.item));
        $h3.append($('<span></span>').addClass('grey').css('margin-left', '10px').text(v.content || ""));

        if (me && v.creater && v.creater.userId == me && onDelete) {

            var $btns = $('<div></div>').addClass('pull-right action-buttons');
            var $del = $('<a></a>').addClass('btn btn-minier btn-danger').text('删除');

            $del.on('click', function() {
                onDelete(v);
            });

            $btns.append($del);
            $h3.append($btns);
        }

        var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').css('padding-left', '12px').appendTo($li);

        var props = [
            ["记录人:", v.creater ? (v.creater.currentName || v.creater.userName) : "-", "grey"],
            ["方式:", dict.ways[v.way] || v.way, "grey"],
            ["跟进时间:", v.createTime, "green"],
            ["下一步计划:", v.plan || "-", "blue"]
        ];

        if (type == "pre") {
            props.push(["品类:", v.category || "-", "grey"], ["品牌:", v.brandName || "-", "grey"]);
        } else {
            props.push(["处理结果:", v.result || "-", "grey"]);
        }

        if (v.planTime) {
            props.push(["计划跟进:", v.planTime, followupOverdue(v.planTime) ? "red" : "orange"]);
        }

        $.each(props, function(j, p) {

            var $liProp = $('<li></li>').appendTo($ulProperty);
            $('<strong></strong>').text(p[0]).appendTo($liProp);
            $('<b></b>').text(p[1] == null || p[1] == "" ? "-" : p[1]).addClass(p[2]).appendTo($liProp);
        });

        $li.prepend($h3);

        $ul.append($li);
    }

    // 列表容器渲染: records为过滤后的数组
    function renderFollowupList($wrap, records, type, me, onDelete) {

        $wrap.html('');

        var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

        if (!records || !records.length) {

            $('<li></li>').addClass('item-orange clearfix').append(
                $('<div></div>').html("暂无跟单记录").css({"text-align": "center", "color": "#999", "padding": "8px"})).appendTo($ul);
        }

        $.each(records || [], function(i, v) {
            renderFollowupItem($ul, v, type, me, onDelete);
        });

        $wrap.append($ul);
    }

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

    // 当前登录人取全局params.user(index.js登录后从queryUserForSelfByUserId的userInfo.user填入,勿重复调接口——顶层user键恒为null),删除按钮仅记录人可见
    followup.me = params.user ? params.user.userId : null;

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
