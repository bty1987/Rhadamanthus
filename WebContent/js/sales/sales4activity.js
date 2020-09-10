$(function () {

    var salesActivityItem = {
        paramsOrderId : params.orderId,
        ssid : params.sid,
        salesno : params.no,
        activityId : params.activityId,
        items: {
            things : com.focusPage("#things"),
            coupons : com.focusPage("#coupons"),
            thingsName : com.focusPage("#thingsName"),
            thingsNum : com.focusPage("#thingsNum"),
            couponsName : com.focusPage("#couponsName"),
            couponsNum : com.focusPage("#couponsNum"),
            activity : com.focusPage("#activity"),
            commentName:com.focusPage("#commentName"),
            salesActivityComment : com.focusPage("#salesActivityComment")
        },
        modal:{
            salesActivityCommentModal: com.focusPage("#salesActivityCommentModal"),
        },
        btn:{
            submitSalesActivityCommentBtn : com.focusPage("#submitSalesActivityCommentBtn"),
            cancelCommentBtn : com.focusPage("#cancelCommentBtn"),
            activityTab :com.focusPage("#activityTab")
        },
        activity: {},
        activityItemType : {},
        depositpayStatus : {},
        fullpayStatus : {},
        type : {},
        saiid : null,
        url : null,
        info : null
    };

    com.focusPage("#activitys").removeClass("active");

    salesActivityItem.items.content = com.focusPage("#salesActivityItemContent");
    salesActivityItem.salesActivityItemModal = com.focusPage("#salesActivityItemModal").on('show.bs.modal', function (e) {
        com.resetTypeahead("thingsName", []);
        com.resetTypeahead("couponsName", []);
        com.clearValidator();
    });

    com.post(api.ds.sales, {}, function(res){
        salesActivityItem.depositpayStatus = res.depositpayStatus.split("key", "value");
        salesActivityItem.fullpayStatus = res.fullpayStatus.split("key", "value");
        salesActivityItem.type = res.type.split("key", "value");
    }, null, false);

    com.post(api.ds.manifest, {}, function (res) {
        $.each(res.salesActivityItemType,function(i,v){
            salesActivityItem.activityItemType[v.key]= v.value;
        })
    }, null, false);

    com.focusPage("#thingsAdd").unbind().click(function(){
        if(com.validate("thingsInputs","bottom")){
            return;
        }
        createThings();
        salesActivityItem.items.thingsName.val("");
        salesActivityItem.items.thingsNum.val("");
    });

    com.focusPage("#couponsAdd").unbind().click(function(){
        if(com.validate("couponInputs","bottom")){
            return;
        }
        createCoupons();
        salesActivityItem.items.couponsName.val("");
        salesActivityItem.items.couponsNum.val("");
    });

    function createThings(){
        var $li = $("<li></li>").css({"background-color":"#91b8d0", "margin-bottom":"5px", "margin-right":"5px"}).appendTo(com.focusPage("#things"));
        var aisd = com.focusPage("#thingsName").attr("data-typeahead-key");
        var thingsName = com.focusPage("#thingsName").val();
        var num = com.focusPage("#thingsNum").val();
        var $span = $("<span></span>").css({'color': '#fff'}).attr('thingsName', thingsName).attr('num', num).attr('asid', aisd).html(thingsName).appendTo($li);
        var $spanTwo = $("<span></span>").css({'font-size':'16px', 'color':'#fff', 'margin':'0 5px'}).html(" 数量:" + num).appendTo($span);
        var $a = $("<a></a>").addClass("glyphicon glyphicon-remove").css({'color': '#d15b47'}).appendTo($li);
        $a.click(function () {
            $li.remove();
        });
    }

    function createCoupons(){
        var $li = $("<li></li>").css({"background-color":"#91b8d0", "margin-bottom":"5px", "margin-right":"5px"}).appendTo(com.focusPage("#coupons"));
        var couponsName = com.focusPage("#couponsName").val();
        var aisd = com.focusPage("#couponsName").attr("data-typeahead-key");
        var num = com.focusPage("#couponsNum").val();
        var $span = $("<span></span>").css({'color':'#fff'}).attr('couponsName', couponsName).attr('num', num).attr('asid', aisd).html(couponsName).appendTo($li);
        var $spanTwo = $("<span></span>").css({'font-size':'16px', 'color':'#fff', 'margin':'0 5px'}).html(" 数量:" + num).appendTo($span);
        var $a = $("<a></a>").addClass("glyphicon glyphicon-remove").css({'color':'#d15b47'}).appendTo($li);
        $a.click(function () {
            $li.remove();
        });
    }

    com.selectTypeahead("thingsName", [], 'asid', 'activityItemName');
    com.selectTypeahead("couponsName", [], 'asid', 'activityItemName');
    salesActivityItem.items.activity.on("change", function () {

        salesActivityItem.items.thingsName.val('');
        salesActivityItem.items.thingsNum.val('');
        salesActivityItem.items.couponsName.val('');
        salesActivityItem.items.couponsNum.val('');

        var $this = $(this);

        var _things = [];
        var _coupons = [];

        var options = {
            "activity.aid": $this.val()
        };

        com.post(api.information.queryActivityItemByAid, options, function (res) {

            var _ = res.activityItems;

            for (var i = 0; i < _.length; i++) {

                var _activityItem = _[i];

                if (_activityItem.type == 0) {
                    _coupons.push({
                        asid: _activityItem.asid,
                        activityItemName: _activityItem.name + " 金额:" + _activityItem.money + " 积分:" + _activityItem.integral
                    });
                } else if (_activityItem.type == 1) {
                    _things.push({
                        asid: _activityItem.asid,
                        activityItemName: _activityItem.name + " 金额:" + _activityItem.money + " 积分:" + _activityItem.integral
                    });
                }
            }

            com.resetTypeahead("thingsName", _things);
            com.resetTypeahead("couponsName", _coupons);
        });
    });

    function orderList() {

        var $btnSub = $('<a></a>').addClass('btn btn-minier btn-success').html('领取物品');
        var $h4 = $('<h4></h4>').addClass('oid').append($('<small></small>').addClass('blue')).html("装修单号:" + salesActivityItem.paramsOrderId);
        var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

        var $divWarp = com.focusPage("#paramsOrder").append($h4);

        $divBtnWrap.append($btnSub).appendTo($h4);

        $btnSub.click(function () {

            com.post(api.information.queryActivityForValid, {"activity.type": 3}, function (res) {
                var activitys = res.activitys;

                var _activitys = [];

                for (var i = 0; i < activitys.length; i++) {
                    var _activity = activitys[i];

                    _activitys.push({aid: _activity.aid, activityName: _activity.name, money: _activitys.money});
                }
                salesActivityItem.items.activity.bindData(_activitys, "aid", "activityName", "money", false);
            });

            salesActivityItem.salesActivityItemModal.modal("show")
        });

        return $divWarp;
    }

    orderList();

    salesNo();

    function salesNo() {

        var $divWarp = com.focusPage("#paramsNo").empty();
        var amountPayment = $('<h4 id="payment"></h4>').addClass('oid').append($('<small></small>').addClass('blue'));
        var amountActivity = $('<h4 id="activity_"></h4>').addClass('oid').append($('<small></small>').addClass('blue'));
        var amount = $('<h4 id="num"></h4>').addClass('oid').append($('<small></small>').addClass('blue'));

        $divWarp.append(amountPayment).append(amountActivity).append(amount);

        return $divWarp
    }

    //活动积分
    function amountSalesActivityForActivity(){

        com.post(api.sales.amountSalesActivityForActivity, {"salesActivity.sales.orderId" : salesActivityItem.paramsOrderId}, function (res) {
            com.focusPage("#activity_").html("使用积分: " + res.salesActivity.amount).attr("integral", res.salesActivity.amount);
        },null,false);

    }

    //款项积分
    function amountSalesActivityForPayment(){
        com.post(api.sales.amountSalesActivityForPayment, {"salesActivity.sales.orderId" : salesActivityItem.paramsOrderId}, function (res) {
            com.focusPage("#payment").html("总积分: " + res.salesActivity.amount).attr("integral", res.salesActivity.amount);
        },null,false);

    }

    var options = {
        "orderId": salesActivityItem.paramsOrderId
    };

    //查询活动信息
    function querySalesActivity() {
        com.post(api.sales.amountSalesActivity, options, function (res) {

            var salesActivity = res.salesActivitys;
            var salesActivityContent = com.focusPage("#salesActivityItem").empty();

            for (var i = 0; i < salesActivity.length; i++) {
                var _salesActivity = salesActivity[i];
                var ul = $("<div></div>").addClass("list-unstyled list-striped pricing-table");
                var nameH2 = $("<h3></h3>").text("活动名称:").appendTo(ul);
                var nameLi = $("<li></li>").appendTo(ul);
                var nameSpan = $("<span></span>").text(_salesActivity.activity.name).appendTo(nameLi);
                var moneyH2 = $("<h3></h3>").text("交款金额:").appendTo(ul);
                var moneyLi = $("<li></li>").appendTo(ul);
                var moneySpan = $("<span></span>").text(utils.accDiv(_salesActivity.amount, 1000)).appendTo(moneyLi);

                salesActivityContent.append(ul);
            }
        }, null, false);
    }

    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass("oid").append($('<small></small>').addClass('blue').html(v.activity.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var propertyArr = [
                ["装修单号:", v.sales.orderId, "grey"],
                ["楼盘地址:", v.sales.house.village.name + " " + v.sales.house.houseNumber, "grey"],
                ["客户名:", v.sales.customer.name, "grey"],
                ["品类:", v.sales.category, "grey"],
                ["品牌:", v.sales.brand, "grey"],
                ["定金:", v.sales.depositpay, "blue"],
                ["补款:", v.sales.fullpay, "blue"],
                ["定金状态:", salesActivityItem.depositpayStatus[v.sales.depositpayStatus], "red"],
                ["补款状态:", salesActivityItem.fullpayStatus[v.sales.fullpayStatus], "red"],
                ["总额:", v.sales.total, "blue"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });


            $liLine.append($h3).append($ulProperty);

            return $liLine;
        };

        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();

    searcher.init(["sales_activity", "sales_goodsCategory", "sales_goodsBrand"], "condLists", api.sales.pageSalesActivity, function(data){
        displayFunc.init('resultLists', data);
    }, "pagenations", "sales4activityPostData", options, false, null, null ,"resultLists");

    //查询活动物品
    function querySalesActivityItem() {
        com.post(api.sales.querySalesActivityItem, options, function (res) {

            var salesActivityItems = res.salesActivityItems;

            var salesActivityContent = com.focusPage("#salesActivityItems").empty();
            
            $.each(salesActivityItems, function (i, v) {
                
                if(v.state == 1) return true;

                var pricingSpan = $("<div></div>").addClass("col-md-6").css({"margin": "5px 0px", "min-height" : "127px"}).attr("id", "pricing_" + v.saiid);

                var widgetBox = $("<div></div>").addClass("module_activity_border").appendTo(pricingSpan);

                var widgetBody = $("<div></div>").appendTo(widgetBox);
                var widgetMain = $("<div></div>").addClass("widget-main no-padding").appendTo(widgetBody);

                var widgetHeader = $("<div></div>").attr("id", "widgetHeader_" + v.saiid).appendTo(widgetMain);
                var widgetHeaderH5 = $("<h4></h4>").addClass("bigger lighter").css("padding-left", "12px").appendTo(widgetHeader).text(v.name);

                var ul = $("<ul></ul>").addClass("list-unstyled fl-inline-list clearfix").css("padding-left", "12px").appendTo(widgetMain);
                var nameLi = $("<li></li>").appendTo(ul);
                var nameStr = $("<strong></strong>").text("活动名:").appendTo(nameLi);
                var nameSpan = $("<span></span>").attr("id", "activityItemName_" + v.saiid).text(v.activity).appendTo(nameLi);

                var typeLi = $("<li></li>").appendTo(ul);
                var typeStr = $("<strong></strong>").text("类型:").appendTo(typeLi);
                var typeSpan = $("<span></span>").addClass("red").attr("id", "money_" + v.saiid).text(salesActivityItem.type[v.type]).appendTo(typeLi);

                var moneyLi = $("<li></li>").appendTo(ul);
                var moneyStr = $("<strong></strong>").text("金额:").appendTo(moneyLi);
                var moneySpan = $("<span></span>").addClass("blue").attr("id", "money_" + v.saiid).text(v.money).appendTo(moneyLi);

                var integralLi = $("<li></li>").appendTo(ul);
                var integralStr = $("<strong></strong>").text("积分:").appendTo(integralLi);
                var integralSpan = $("<span></span>").addClass("red").attr("id", "money_" + v.saiid).text(v.integral).appendTo(integralLi);

                var numLi = $("<li></li>").appendTo(ul);
                var numStr = $("<strong></strong>").text("数量:").appendTo(numLi);
                var numSpan = $("<span></span>").attr("id", "money_" + v.saiid).text(v.num).appendTo(numLi);

                var stateLi = $("<li></li>").appendTo(ul);
                var stateStr = $("<strong></strong>").text("状态:").appendTo(stateLi);
                var stateSpan = $("<span></span>").addClass("red").attr("id", "money_" + v.saiid).text(salesActivityItem.activityItemType[v.state]).appendTo(stateLi);

                var totalLi = $("<li></li>").appendTo(ul);
                var totalStr = $("<strong></strong>").text("合计:").appendTo(totalLi);
                var totalSpan = $("<span></span>").addClass("blue").attr("id", "money_" + v.saiid).text(utils.accMul(v.money, v.num)).appendTo(totalLi);

                var uiPgDiv = $("<div></div>").addClass("ui-pg-div").css({"padding-left" : "12px", "margin-bottom" : "5px"}).appendTo(widgetBody);
                if (uiBtnMethod != null) {
                    uiBtnMethod(uiPgDiv, v);
                }
                salesActivityContent.append(pricingSpan)
            });
        });
    }

    amountSalesActivityForActivity();
    amountSalesActivityForPayment();
    integral();
    querySalesActivity();
    querySalesActivityItem();

    function integral () {
        $('#num').html("剩余积分: " + utils.accSub(parseFloat(com.focusPage("#payment").attr("integral")), parseFloat(com.focusPage("#activity_").attr("integral"))));
    }



    function uiBtnMethod(uiPgDiv, activityItem) {
        //0: 初始 , 1: 失效 , 2: 已领 , 3: 退货 , 4: 配送 , 5: 未退 , 6: 升级 , 7: 消耗
        //失效
        var abateBtn = $("<span></span>").addClass("btn btn-minier btn-yellow").html("失效").css("margin", "3px").appendTo(uiPgDiv);
        //领取
        var receiveBtn = $("<span></span>").addClass("btn btn-minier btn-success").html("领取").css("margin", "3px").appendTo(uiPgDiv);
        //退货
        var refundBtn = $("<span></span>").addClass("btn btn-minier btn-warning").html("退货").css("margin", "3px").appendTo(uiPgDiv);
        //配送
        var deliveBtn = $("<span></span>").addClass("btn btn-minier btn-inverse").html("配送").css("margin", "3px").appendTo(uiPgDiv);
        //未退
        var unrefundBtn = $("<span></span>").addClass("btn btn-minier btn-danger").html("未退").css("margin", "3px").appendTo(uiPgDiv);
        //消耗
        var expendBtn = $("<span></span>").addClass("btn btn-minier btn-purple").html("补款").css("margin", "3px").appendTo(uiPgDiv);

        //失效按钮
        abateBtn.on("click", function () {
            abateSalesActivityItem(activityItem.saiid, activityItem.activity);
        });

        //领取按钮
        receiveBtn.on("click", function () {
            if (activityItem.state == 0) {
                salesActivityItem.items.commentName.html("领取");
                salesActivityItem.saiid = activityItem.saiid;
                salesActivityItem.url = api.sales.receiveSalesActivityItem;
                salesActivityItem.info = "领取成功!";
                salesActivityItem.modal.salesActivityCommentModal.modal("show");
            }else{
                com.showAlert(com.warning, "订单活动奖品不可操作!!");
            }
        });

        //点击退货按钮
        refundBtn.click(function () {
            salesActivityItem.items.commentName.html("退货");
            salesActivityItem.saiid = activityItem.saiid;
            salesActivityItem.url = api.sales.refundSalesActivityItem;
            salesActivityItem.info = "退货成功!";
            salesActivityItem.modal.salesActivityCommentModal.modal("show");
        });

        //点击配送按钮
        deliveBtn.click(function () {
            salesActivityItem.items.commentName.html("配送");
            salesActivityItem.saiid = activityItem.saiid;
            salesActivityItem.url = api.sales.deliveSalesActivityItem;
            salesActivityItem.info = "配送成功!";
            salesActivityItem.modal.salesActivityCommentModal.modal("show");
        });

        //点击未退按钮
        unrefundBtn.click(function () {
            unrefundSalesActivityItem(activityItem.saiid, activityItem.activity);
        });

        //点击消耗按钮
        expendBtn.click(function () {
            expendSalesActivityItem(activityItem.saiid, activityItem.activity);
        });

    }

    //0: 初始 , 1: 失效 , 2: 已领 , 3: 退货 , 4: 配送 , 5: 未退 , 6: 升级 , 7: 消耗
    //失效
    function abateSalesActivityItem(saiid, activityItemName) {

        com.showConfirm("是否确认失效" + activityItemName + "活动物品?", function () {

            var options = {
                "salesActivityItem.saiid": saiid
            };

            com.post(api.sales.abateSalesActivityItem, options, function (res) {
                com.showAlert(com.info, "失效成功!");
                querySalesActivityItem();
                amountSalesActivityForActivity();
                integral();
            });

        });
    }

    //未退
    function unrefundSalesActivityItem(saiid, activityItemName) {
        com.showConfirm("是否确认未退" + activityItemName + "活动物品?", function () {

            var options = {
                "salesActivityItem.saiid": saiid
            };
            com.post(api.sales.unrefundSalesActivityItem, options, function (res) {
                com.showAlert(com.info, "未退成功!");
                querySalesActivityItem();
            });

        });
    }

    //消耗
    function expendSalesActivityItem(saiid, activityItemName) {
        com.showConfirm("是否确认消耗" + activityItemName + "活动物品?", function () {

            var options = {
                "salesActivityItem.saiid": saiid
            };
            com.post(api.sales.expendSalesActivityItem, options, function (res) {
                com.showAlert(com.info, "消耗成功!");
                querySalesActivityItem();
                amountSalesActivityForActivity();
                integral();
            });

        });
    }

    //领取物品
    com.focusPage("#submitSalesActivityItemBtn").on("click", function () {

        if (salesActivityItem.items.things.html() == "" && salesActivityItem.items.coupons.html() == "") {
            com.showAlert(com.warning, "活动物品或券需要选择才能提交");
            return;
        }

        var submitFlag = true;

        var orderId = salesActivityItem.paramsOrderId;
        var activityName = salesActivityItem.items.activity.find("option:selected").text();
        var aid = salesActivityItem.items.activity.find("option:selected").val();
        var content = com.focusPage("#salesActivityItemContent").val();

        var index = 0;
        var amount = 0;

        var options = {
            "salesActivity.sales.orderId" : orderId
        };

        com.focusPage("#things li").each(function (i, e) {

            var _things = $(e);

            options["salesActivityItems[" + index + "].aid"] = aid;
            options["salesActivityItems[" + index + "].asid"] = _things.children('span').attr("asid");
            options["salesActivityItems[" + index + "].activity"] = activityName;
            options["salesActivityItems[" + index + "].name"] = _things.children('span').attr("thingsName").split(" ")[0];
            options["salesActivityItems[" + index + "].type"] = 1;
            options["salesActivityItems[" + index + "].num"] = _things.children('span').attr("num");
            options["salesActivityItems[" + index + "].money"] = _things.children('span').attr("thingsName").split(" ")[1].split(':')[1];
            options["salesActivityItems[" + index + "].content"] = content;
            options["salesActivityItems[" + index + "].integral"] = _things.children('span').attr("thingsName").split(" ")[2].split(':')[1];

            amount = amount + utils.accMul(parseFloat(_things.children('span').attr("thingsName").split(" ")[2].split(':')[1]), _things.children('span').attr("num"));

            index++;
        });

        com.focusPage("#coupons li").each(function (i, e) {

            var _coupons = $(e);

            options["salesActivityItems[" + index + "].aid"] = aid;
            options["salesActivityItems[" + index + "].asid"] = _coupons.children('span').attr("asid");
            options["salesActivityItems[" + index + "].activity"] = activityName;
            options["salesActivityItems[" + index + "].name"] = _coupons.children('span').attr("couponsName").split(" ")[0];
            options["salesActivityItems[" + index + "].type"] = 0;
            options["salesActivityItems[" + index + "].num"] = _coupons.children('span').attr("num");
            options["salesActivityItems[" + index + "].money"] = _coupons.children('span').attr("couponsName").split(" ")[1].split(':')[1];
            options["salesActivityItems[" + index + "].content"] = content;
            options["salesActivityItems[" + index + "].integral"] = _coupons.children('span').attr("couponsName").split(" ")[2].split(':')[1];

            amount = amount + utils.accMul(parseFloat(_coupons.children('span').attr("couponsName").split(" ")[2].split(':')[1]), _coupons.children('span').attr("num"));

            index++;
        });

        if (!submitFlag) {
            return;
        }

        options["salesActivity.amount"] = amount;

        com.post(api.sales.addSalesActivityItem, options, function (res) {
            querySalesActivityItem();
            amountSalesActivityForActivity();
            integral();
        });
        salesActivityItem.salesActivityItemModal.modal("hide");
    });

    salesActivityItem.btn.submitSalesActivityCommentBtn.on('click', function () {

        var ops = {
            "salesActivityItem.saiid": salesActivityItem.saiid,
            "salesActivityItem.content": salesActivityItem.items.salesActivityComment.val()
        };

        com.post(salesActivityItem.url, ops, function (res) {
            com.showAlert(com.info, salesActivityItem.info);
            querySalesActivityItem();
            amountSalesActivityForActivity();
            integral();
        });

        com.cleanItems(salesActivityItem.items);
        salesActivityItem.modal.salesActivityCommentModal.modal("hide");
    });


    com.focusPage("#salesActivityItemModal").on('hide.bs.modal', function () {
        salesActivityItem.items.things.html("");
        salesActivityItem.items.coupons.html("");
        com.cleanItems(salesActivityItem.items);
        com.clearValidator();
    });

});