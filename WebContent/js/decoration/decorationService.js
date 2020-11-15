
jQuery(function($) {
    var decorationService = {
        decorationOrderId : null,
        dsid:null,
        serviceItems:{},
        rollback :params.historyPage,
        item:{},
        modal:null,
        serviceModal:null
    };

    var  servicePage = {
        btnBack:com.focusPage("#btnBack")
    };

    decorationService.decorationOrderId = params.decorationOrderId;
    decorationService.serviceItems.comment = com.focusPage('#comment');

    decorationService.serviceModal = com.focusPage("#serviceModal");
    
    decorationService.serviceModal.on('hide.bs.modal', function (e) {
    	com.cleanItems(decorationService.serviceItems);
    	com.closeTip();
	});

    drawTable(decorationService.decorationOrderId);

    com.focusPage("#serviceSaveBtn").on('click',function(res){

        if(com.validate("serviceModal")){
            return;
        }

        var options = {};
        options["decorationService.dsid"] = decorationService.dsid;
        options["decorationService.comment"] = decorationService.serviceItems.comment.val();

        com.post(api.decoration.completeDecorationService,options,function(res){
            drawTable(decorationService.decorationOrderId);
            decorationService.serviceModal.modal("hide");
        });

    });

    decorationService.rollback && servicePage.btnBack.click(function () {
        com.switchPage(decorationService.rollback);
    });

    function drawTable(decorationOrderId) {

        var $service = com.focusPage("#serviceInfo").html('');

        var $serviceul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($service);

        com.post(api.decoration.queryDecorationServiceByOrderId, {"decorationService.orderId": decorationOrderId}, function (res) {
            decorationServices = res.decorationServices;

            if (decorationServices && decorationServices.length) {
                $.each(decorationServices, function (i, v) {
                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h4 = $('<h4></h4>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
                    var $updateBtn = $('<a></a>').addClass('btn btn-minier btn-yellow').html('完成');

                    var propertyArr = [
                        ["装修单号:", v.orderId, "grey"],
                        ["详述:", v.detail, "grey"],
                        ["操作人:", v.operater.currentName, "grey"],
                        ["操作时间:", v.operateTime, "green"],
                        ["状态:", v.status == 0 ? '初始' : '完成', "red"],
                        ["备注:", v.comment, "grey"]
                    ];

                    $updateBtn.click(function () {
                        decorationService.dsid = v.dsid;
                        com.cleanItems(decorationService.serviceItems);
                        decorationService.serviceModal.modal("show");
                    });

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    if (v.status == 0) {
                        $divBtnWrap.append($updateBtn);
                        $divBtnWrap.appendTo($h4);
                    }

                    $liLine.append($h4).append($ulProperty).append($ulStyle).append($divBtnBlock);

                    $liLine.appendTo($serviceul);
                });
            } else {
                var $metaData = com.focusPage('#serviceInfo').html('');
                var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($metaData);
                var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
                $mesg.append($('<span></span>').text('无可用数据提供'));
            }
        }, null, false);

    }

});
