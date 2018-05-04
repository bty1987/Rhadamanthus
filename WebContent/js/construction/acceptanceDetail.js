jQuery(function ($) {

    var constructionScheName = {};
    var acceptanceDetail = {
        ratyLength: 22,

        baseInfos: [
            "orderId", "customer", "orderAddr", "designer", "supervisName", "contractCode",
            "waterwayWorkerName", "circuitWorkerName", "bricklayWorkerName", "carpentWorkerName", "oilWorkerName"
        ], ratyIds: [
            "waterwayQuality", "waterwayServer", "waterwayHygiene",
            "circuitQuality", "circuitServer", "circuitHygiene",
            "bricklayQuality", "bricklayServer", "bricklayHygiene",
            "carpentQuality", "carpentServer", "carpentHygiene",
            "oilQuality", "oilServer", "oilHygiene",
            "supervisQuality", "supervisServer", "supervisHygiene",
            "materialQuality", "materialServer",
            "multiple", "internal",
        ], desIds: [
            "waterwayDes", "circuitDes", "bricklayDes", "carpentDes", "oilDes", "supervisDes", "materialDes",
            "question", "propose", "acceptanceTime",
        ],

        options: {},
    };

    //获取所有节点的name
    com.post(api.data.queryConstructionNode, {}, function (res) {
        $.each(res.constructionNodes, function (i, v) {
            constructionScheName[v.cnid] = v.name;
        })
    }, null, false);

    com.post(api.construction.queryAcceptance, {"acceptance.orderId": params.orderId}, function (res) {
        var acceptanceInfo = res.acceptance;
        acceptanceDetail.options["acceptance.actId"] = acceptanceInfo.actId;

        for (var i = 0; i < acceptanceDetail.baseInfos.length; i++) {
            infoName = acceptanceDetail.baseInfos[i];
            $("#" + infoName).val(acceptanceInfo[infoName]);
        }

        for (var i = 1; i <= acceptanceDetail.ratyLength; i++) {
            $('#raty' + i).raty({
                path: './assets/altogether/images/',
                number: 4,
                start: acceptanceInfo[acceptanceDetail.ratyIds[i - 1]],
            });
        }

        for (var i = 0; i < acceptanceDetail.desIds.length; i++) {
            var desId = acceptanceDetail.desIds[i];
            if (acceptanceInfo[desId]) {
                $("#" + desId).val(acceptanceInfo[desId]);
            }
        }
    });

    //查询当前订单的施工节点
    com.post(api.construction.queryConstructionScheduleByOrderId, {"constructionSchedule.orderId": params.orderId}, function (res) {
        var constructionSchedule = res.constructionSchedules;

        $.each(constructionSchedule, function (i, v) {
            var nodeDiv = $("<div></div>").attr("id", constructionScheName[v.schedule]).appendTo($("#constructerDiv"));
        });
    }, null, false);

    //显示施工人员
    com.post(api.construction.queryConstructerByOrderId, {"constructer.orderId": params.orderId}, function (res) {
        constructers = res.constructers;

        if (constructers && constructers.length > 0) {
            for (var i = 0; i < constructers.length; i++) {
                constructerImg(constructers[i].user.userPhoto, constructers[i].user.userName, constructers[i].user.duty.name, constructers[i].schedule);
            }
        } else {
            var pane = $("<div>当前订单没有分配工人!</div>").addClass("alert alert-info").appendTo($("#constructerDiv"));
        }
    });

    var save = function save() {

        if (com.validate()) {
            return;
        }

        for (var i = 1; i <= acceptanceDetail.ratyLength; i++) {
            acceptanceDetail.options["acceptance." + acceptanceDetail.ratyIds[i - 1]] = $("#raty" + i + "-score").attr("value");
        }
        ;

        for (var i = 0; i < acceptanceDetail.desIds.length; i++) {
            var desId = acceptanceDetail.desIds[i];
            if ($("#" + desId).val()) {
                acceptanceDetail.options["acceptance." + desId] = $("#" + desId).val();
            } else {
                acceptanceDetail.options["acceptance." + desId] = "";
            }
        }

        acceptanceDetail.options["acceptance.orderId"] = params.orderId;

        com.post(api.construction.updateAcceptance, acceptanceDetail.options, function (res) {
            com.showAlert(com.info, "提交成功!");
        });
    }

    $("#saveBtn").bindClick(save);
    $('.date-picker').datepicker({autoclose: true});

    $("#backBtn").click(function () {
        com.switchPage(api.index.acceptanceIndex.url);
    });

    //工程图片 名字 工种
    function constructerImg(imgPath, name, duty, schedule) {

        var pane = $("<div ></div>").addClass("col-xs-3 col-md-3 widget-container-span ui-sortable").appendTo($("#" + constructionScheName[schedule]));

        var imgDiv = $('<div></div>').css({"border": "1px solid #ccc","width": "50px","float":"left","height":"50px","margin-right":"20px","margin-bottom":"10px"}).appendTo(pane);
        var img = $('<img />').css("margin-right", "20px").css("margin-bottom", "10px").appendTo(imgDiv);
        var url = com.showImg(img, imgPath, 50, 50, '', null, 0);

        var constructerName = $("<span></span>").css({"margin-right":"20px","line-height":"50px"}).html(name).appendTo(pane);
        var constructerDuty = $("<span></span>").html(duty).appendTo(pane);
    }

});