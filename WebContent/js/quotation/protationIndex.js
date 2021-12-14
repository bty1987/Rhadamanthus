$(function () {
    
    var protation = {
            
        protationList: com.focusPage("#protationList"),
        
        
        modals: {
            protationModal: com.focusPage('#protationModal'),
        },
        
        items: {
            pid: com.focusPage("#pid", "#protationModal"),
            name: com.focusPage("#name", "#protationModal"),
            produce: com.focusPage("#produce", "#protationModal"),
            content: com.focusPage("#content", "#protationModal"),
			preferPrice: com.focusPage("#preferPrice", "#protationModal"),
			managePrice: com.focusPage("#managePrice", "#protationModal")
        },
        
        decorationOrderId: params.decorationOrderId,
        
        editFlg: 0,
        leftflg: false,
        rightflg: false,
        
    };
    
    com.post(api.quotation.queryPresignProduce, {}, function(res){
        protation.items.produce.bindData(res.presignProduces, "ppid", "name");
    })

    com.focusPage('#fl-statement').statement("装修单", "预签");

    com.focusPage('#btnBack').on('click', function () {
        com.switchPage("/views/decoration/decoration.html");
    });

    com.focusPage('#createProtation').on('click', function () {
        protation.editFlg = 0;
        com.clearValidator();
        com.cleanItems(protation.items);
        protation.modals.protationModal.modal("show");
    });

    com.focusPage('#saveBtn').bindClick(function () {

        if (com.validate("protationModal")) {
            return;
        }

        if (protation.editFlg == 0) {
            var options = {
                "protation.ppid": protation.items.produce.val(),
                "protation.orderId": protation.decorationOrderId,
                "protation.name": protation.items.name.val(),
                "protation.content": protation.items.content.val(),
				"protation.preferPrice": protation.items.preferPrice.val(),
				"protation.managePrice": protation.items.managePrice.val()
            };
            com.post(api.quotation.addProtation, options, function (res) {
                drawprotation(res.protation);
                protation.modals.protationModal.modal("hide");
            }, null, false);
        } else if (protation.editFlg == 1) {
            var options = {
                "protation.orderId": protation.decorationOrderId,
                "protation.pid": protation.items.pid.val(),
                "protation.name": protation.items.name.val(),
                "protation.content": protation.items.content.val(),
				"protation.preferPrice": protation.items.preferPrice.val(),
				"protation.managePrice": protation.items.managePrice.val()
            };

            com.post(api.quotation.updateProtation, options, function (res) {

                var _pid = protation.items.pid.val();
                var name = protation.items.name.val();
                var content = protation.items.content.val();
				var preferPrice = protation.items.preferPrice.val();
				var managePrice = protation.items.managePrice.val();

                com.focusPage("#h4name_" + _pid).text(name);
                com.focusPage("#name_" + _pid).text('名称:' + name);
                com.focusPage("#content_" + _pid).text('备注:' + content);
				com.focusPage('#preferPrice' + _pid).text('优惠价:' + preferPrice);
				com.focusPage('#managePrice' + _pid).text('管理费:' + managePrice);

                com.showAlert(com.info, "操作成功");
                protation.modals.protationModal.modal("hide");
            }, null, false);

        }
    });

    initProtationList();

    function initProtationList() {
        var protationList = com.focusPage("#protationList").html("");

        var options = {
            "protation.orderId": protation.decorationOrderId,
        };
        com.post(api.quotation.queryProtationByOrderId, options, function (res) {
            $.each(res.protations, function (i, v) {
                drawprotation(v);
            });
        }, null, false);
    }

    function drawprotation(v) {

        var $color = ['header-color-blue', 'header-color-green', 'header-color-red'];
        var pid = v.pid;

        var protationDiv = $('<div></div>').addClass("col-xs-12 col-md-3").attr('id', 'protationDiv_' + pid).appendTo(protationList);
        var protationWidget = $('<div></div>').addClass("widget-box").appendTo(protationDiv);
        var protationWidgetHeader = $('<div></div>').addClass("widget-header header-color-blue").appendTo(protationWidget);

        var name = $('<h4></h4>').attr('id', 'h4name_' + pid).text(v.name).appendTo(protationWidgetHeader);

        var protationWidgetBody = $('<div></div>').addClass("widget-body").appendTo(protationWidget);
        var protationWidgetMain = $('<div></div>').addClass("widget-main").appendTo(protationWidgetBody);
        var protationWidgetInfoDiv = $('<div></div>').css("padding", "5px").appendTo(protationWidgetMain);

        var protationWidgetDivOne = $('<div></div>').appendTo(protationWidgetInfoDiv);
        var protationWidgetLabelOne = $('<label></label>').attr('for', 'form-field').attr('id', 'name_' + pid).text('名称: ' + v.name).appendTo(protationWidgetDivOne);
        var protationWidgetDivThr = $('<div></div>').appendTo(protationWidgetInfoDiv);
        var protationWidgetLabelThr = $('<label></label>').attr('for', 'form-field').attr('id', 'time_' + pid).text('时间: ' + v.createTime).appendTo(protationWidgetDivThr);
        var protationWidgetDivFiv = $('<div></div>').appendTo(protationWidgetInfoDiv);
        var protationWidgetLabelFiv = $('<label></label>').attr('for', 'form-field').attr('id', 'totalPrice_' + pid).text('总价: ' + v.totalPrice).appendTo(protationWidgetDivFiv);
        var protationWidgetDivSix = $('<div></div>').appendTo(protationWidgetInfoDiv);
        var protationWidgetLabelSix = $('<label></label>').attr('for', 'form-field').attr('id', 'content_' + pid).text('备注: ').appendTo(protationWidgetDivSix);

        var protationWidgetToolDiv = $('<div></div>').addClass("action-buttons").appendTo(protationWidgetMain);

        var editBtn = $('<a></a>').addClass('btn btn-minier btn-blue').append($('<i>').addClass('icon-copy')).text('修改').attr('id', 'editProtation_' + pid).attr('data-pid', pid).appendTo(protationWidgetToolDiv);
        var enterBtn = $('<a></a>').addClass('btn btn-minier btn-success').append($('<i>').addClass('icon-copy')).text('查看').attr('id', 'enterProtation_' + pid).attr('data-pid', pid).attr('data-type', v.type).appendTo(protationWidgetToolDiv);
        var deleteBtn = $('<a></a>').addClass('btn btn-minier btn-danger').append($('<i>').addClass('icon-copy')).text('删除').attr('id', 'deleteProtation_' + pid).attr('data-pid', pid).attr('data-name', v.name).appendTo(protationWidgetToolDiv);
		var defaultBtn = $('<a></a>').addClass('btn btn-minier btn-inverse btn-default').append($('<i>').addClass('icon-copy')).text('默认').attr('id', 'defaultProtation_' + pid).attr('data-pid', pid).appendTo(protationWidgetToolDiv);
		
		var lockBtn = $('<a></a>').addClass('btn btn-minier  btn-pink').append($('<i>').addClass('icon-copy')).text('锁定').attr('id', 'lockProtation' + pid).attr('data-pid', pid).appendTo(protationWidgetToolDiv);
		var unlockBtn = $('<a></a>').addClass('btn btn-minier  btn-info').append($('<i>').addClass('icon-copy')).text('解锁').attr('id', 'unlockProtation' + pid).attr('data-pid', pid).appendTo(protationWidgetToolDiv);
		
		if(v.status == 0) {
			unlockBtn.addClass("hide");
		}else if(v.status == 2){
			lockBtn.addClass("hide");
		}
		
		if (v.defaults == 1) {
            defaultBtn.addClass("hide");
        }

        editBtn.on('click', function () {

            protation.editFlg = 1;

            com.clearValidator();

            com.post(api.quotation.queryProtationByPid, {"protation.pid": v.pid}, function (res) {

                protation.items.pid.val(res.protation.pid);
                protation.items.name.val(res.protation.name);
                protation.items.content.val(res.protation.content);
				protation.items.preferPrice.val(res.protation.preferPrice);
				protation.items.managePrice.val(res.protation.managePrice);
                
                protation.modals.protationModal.modal("show");
            });
        });

        deleteBtn.on('click', function () {

            if (com.focusPage("#defaultProtation_" + $(this).attr("data-pid")).hasClass("hide")) {
                com.showAlert(com.warning, "默认预签不能删除");
                return false;
            }

            var autoData = $(this).attr("data-pid");
            var dataname = $(this).attr("data-name");

            com.showConfirm("确定要删除预签: " + dataname, function(){
                com.post(api.quotation.deleteProtation, {"protation.pid": autoData, "protation.orderId": protation.decorationOrderId}, function (res) {
                    com.focusPage("#protationDiv_" + autoData).remove();
                });
            });
        });

		defaultBtn.on('click', function(){

            var that = $(this)

            var options = {
                "protation.pid": v.pid,
                "protation.orderId": protation.decorationOrderId,
            }

            com.post(api.quotation.changeProtationForDefault, options, function (res) {

                $(".btn-default").removeClass("hide");
                $(".btn-presign").addClass("hide");
                
                that.addClass("hide");

                com.focusPage("#presignQuotation_" + that.attr("data-pid")).removeClass("hide");
            });
        });
		
        enterBtn.on('click', function () {
            params["orderId"] = protation.decorationOrderId;
            params["protationId"] = v.pid;
            com.switchPage("views/quotation/protationPart.html");
        });
		
		lockBtn.on('click', function() {
			
			var that = $(this);
			var pid = that.attr("data-pid");
			var unlockBtn = $("#unlockProtation" + pid)
			
			var options = {
				"protation.pid": pid
			}
			
			com.post(api.quotation.lockProtation, options, function (res) {
				com.showAlert(com.info, "锁定成功");
				that.addClass("hide");
				unlockBtn.removeClass("hide");
			});
		});
		unlockBtn.on('click', function() {
			
			var that = $(this);
			var pid = that.attr("data-pid");
			var lockBtn = $("#lockProtation" + pid)

			var options = {
				"protation.pid": pid
			}
			
			com.post(api.quotation.unlockProtation, options, function (res) {
				com.showAlert(com.info, "解锁成功");
				that.addClass("hide");
				lockBtn.removeClass("hide");
			})
		})
    }

});