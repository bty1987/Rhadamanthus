jQuery(function($) {

    var acceptance4detail = {
        constructionScheName: {},

        ratyLength: 22,

        baseInfos: ["orderId", "customer", "orderAddr", "designer", "supervisName", "contractCode", "waterwayWorkerName", "circuitWorkerName", "bricklayWorkerName", "carpentWorkerName", "oilWorkerName"],
        ratyIds: ["waterwayQuality", "waterwayServer", "waterwayHygiene", "circuitQuality", "circuitServer", "circuitHygiene", "bricklayQuality", "bricklayServer", "bricklayHygiene", "carpentQuality", "carpentServer", "carpentHygiene", "oilQuality", "oilServer", "oilHygiene", "supervisQua lity", "supervisServer", "supervisHygiene", "materialQuality", "materialServer", "multiple", "internal"],
        desIds: ["waterwayDes", "circuitDes", "bricklayDes", "carpentDes", "oilDes", "supervisDes", "materialDes", "question", "propose", "acceptanceTime"],

        options: {}
    };

    com.post(api.construction.queryAcceptance, {
        "acceptance.orderId": params.construction.orderId
    }, function(res) {

        var acceptanceInfo = res.acceptance;
        acceptance4detail.options["acceptance.actId"] = acceptanceInfo.actId;

        for ( var i = 0; i < acceptance4detail.baseInfos.length; i++) {
            infoName = acceptance4detail.baseInfos[i];
            com.focusPage("#" + infoName).val(acceptanceInfo[infoName]);
        }

        for ( var i = 1; i <= acceptance4detail.ratyLength; i++) {
            com.focusPage('#raty' + i).raty({
                path: './assets/altogether/images/',
                number: 4,
                start: acceptanceInfo[acceptance4detail.ratyIds[i - 1]]
            });
        }

        for ( var i = 0; i < acceptance4detail.desIds.length; i++) {
            var desId = acceptance4detail.desIds[i];
            if (acceptanceInfo[desId]) {
                com.focusPage("#" + desId).val(acceptanceInfo[desId]);
            }
        }
    });

    com.post(api.construction.queryConstructionScheduleByOrderId, {
        "constructionSchedule.orderId": params.construction.orderId
    }, function(res) {

        var constructionSchedule = res.constructionSchedules;

        $.each(constructionSchedule, function(i, v) {

            acceptance4detail.constructionScheName[v.node.sort] = v.node.name;
            var nodeDiv = $("<div></div>").attr("id", acceptance4detail.constructionScheName[v.schedule]).appendTo(com.focusPage("#constructerDiv"));
        });
    }, null, false);

    com.post(api.construction.queryConstructerByOrderId, {
        "constructer.orderId": params.construction.orderId
    }, function(res) {

        constructers = res.constructers;

        if (constructers && constructers.length > 0) {
            for ( var i = 0; i < constructers.length; i++) {
                constructerImg(constructers[i].user.userPhoto, constructers[i].user.userName, constructers[i].user.duty.name, constructers[i].schedule);
            }
        } else {
            var pane = $("<div>当前订单没有分配工人!</div>").addClass("alert alert-info").appendTo(com.focusPage("#constructerDiv"));
        }
    });

    var save = function save() {

        if (com.validate("acceptanceDatailPageContent")) {
            return false;
        }

        for ( var i = 1; i <= acceptance4detail.ratyLength; i++) {
            acceptance4detail.options["acceptance." + acceptance4detail.ratyIds[i - 1]] = com.focusPage("#raty" + i + "-score").attr("value");
        }

        for ( var i = 0; i < acceptance4detail.desIds.length; i++) {
            var desId = acceptance4detail.desIds[i];
            if (com.focusPage("#" + desId).val()) {
                acceptance4detail.options["acceptance." + desId] = com.focusPage("#" + desId).val();
            } else {
                acceptance4detail.options["acceptance." + desId] = "";
            }
        }

        acceptance4detail.options["acceptance.orderId"] = params.construction.orderId;

        com.post(api.construction.updateAcceptance, acceptance4detail.options, function(res) {

            com.showAlert(com.info, "提交成功!");
        });
    };

    com.focusPage("#saveBtn").bindClick(save);
    com.datetime(com.focusPage("#acceptanceTime"));
    com.focusPage("#backBtn").click(function() {

        com.switchPage(api.index.acceptanceIndex.url);
    });

    function constructerImg(imgPath, name, duty, schedule) {

        var pane = $("<div ></div>").addClass("col-xs-3 col-md-3 widget-container-span ui-sortable").appendTo(com.focusPage("#" + acceptance4detail.constructionScheName[schedule]));

        var imgDiv = $('<div></div>').css({
            "border": "1px solid #ccc",
            "width": "50px",
            "float": "left",
            "height": "50px",
            "margin-right": "20px",
            "margin-bottom": "10px"
        }).appendTo(pane);
        var img = $('<img />').css("margin-right", "20px").css("margin-bottom", "10px").appendTo(imgDiv);
        var url = com.showImg(img, imgPath, 50, 50, '', null, 0);

        var constructerName = $("<span></span>").css({
            "margin-right": "20px",
            "line-height": "50px"
        }).html(name).appendTo(pane);
        var constructerDuty = $("<span></span>").html(duty).appendTo(pane);
    }

});