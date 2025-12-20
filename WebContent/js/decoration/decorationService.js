jQuery(function($) {

    var decorationService = {
        orderId: null,
        dsid: null,
        serviceItems: {},
        rollback: params.historyPage,
        item: {},
        modal: null,
        serviceModal: null,
        queryMode: 'single' // 'single' 或 'page'
    };

    var servicePage = {
        btnBack: com.focusPage("#btnBack"),
        singleModeBtn: com.focusPage("#singleModeBtn"),
        pageModeBtn: com.focusPage("#pageModeBtn"),
        singleQueryArea: com.focusPage("#singleQueryArea"),
        pageQueryArea: com.focusPage("#pageQueryArea"),
        serviceInfo: com.focusPage("#serviceInfo"),
        resultList: com.focusPage("#resultList"),
        pagenation: com.focusPage("#pagenation"),
        orderIdInput: com.focusPage("#orderIdInput"),
        singleQueryBtn: com.focusPage("#singleQueryBtn")
    };

    // 初始化
    decorationService.orderId = params.decoration.orderId;
    decorationService.serviceItems.comment = com.focusPage('#comment');
    decorationService.serviceModal = com.focusPage("#serviceModal");

    // 模态框事件
    decorationService.serviceModal.on('hide.bs.modal', function(e) {
        com.cleanItems(decorationService.serviceItems);
        com.closeTip();
    });

    // 查询模式切换
    servicePage.singleModeBtn.on('click', function() {
        switchToSingleMode();
    });

    servicePage.pageModeBtn.on('click', function() {
        switchToPageMode();
    });

    // 单个查询按钮事件
    servicePage.singleQueryBtn.on('click', function() {
        var orderId = servicePage.orderIdInput.val().trim();
        if (!orderId) {
            com.showAlert(com.warning, '请输入装修单号');
            return;
        }
        decorationService.orderId = orderId;
        drawTable(decorationService.orderId);
    });

    // 切换到单个查询模式
    function switchToSingleMode() {
        decorationService.queryMode = 'single';
        servicePage.singleModeBtn.addClass('active');
        servicePage.pageModeBtn.removeClass('active');
        servicePage.singleQueryArea.show();
        servicePage.pageQueryArea.hide();
        servicePage.serviceInfo.show();
        servicePage.resultList.hide();
        servicePage.pagenation.hide();

        // 如果有订单ID，直接查询
        if (decorationService.orderId) {
            drawTable(decorationService.orderId);
        }
    }

    // 切换到分页查询模式
    function switchToPageMode() {
        decorationService.queryMode = 'page';
        servicePage.singleModeBtn.removeClass('active');
        servicePage.pageModeBtn.addClass('active');
        servicePage.singleQueryArea.hide();
        servicePage.pageQueryArea.show();
        servicePage.serviceInfo.hide();
        servicePage.resultList.show();
        servicePage.pagenation.show();

        // 初始化分页查询
        initPageSearch();
    }

    // 初始化分页查询
    function initPageSearch() {
        var _condArr = ['decoration-orderId', 'decoration-village', 'decoration-status'];

        var searcher = new Searcher();

        searcher.init(_condArr, "condList", api.decoration.pageDecorationService, function(data) {
            displayPageResult('resultList', data);
        }, "pagenation", "decorationServicePostData");
    }

    // 显示分页查询结果
    function displayPageResult(tableId, listData) {
        var $tableWrap = com.focusPage('#' + tableId);
        $tableWrap.html('');

        if (listData && listData.length) {
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            $.each(listData, function(i, v) {
                var $liLine = createServiceLine(v);
                $liLine.appendTo($ul);
            });

            $ul.appendTo($tableWrap);
        } else {
            var $metaData = com.focusPage('#' + tableId).html('');
            var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($metaData);
            var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
            $mesg.append($('<span></span>').text('无可用数据提供'));
        }
    }

    // 创建服务信息行（用于分页显示）
    function createServiceLine(v) {
        var $liLine = $('<li></li>').addClass('item-orange clearfix');
        var $h4 = $('<h4></h4>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name + ' - ' + v.orderId));
        var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
        var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

        var propertyArr = [
            ["装修单号:", v.orderId, "grey"],
            ["详述:", v.detail, "grey"],
            ["操作人:", v.operater ? v.operater.currentName : '', "grey"],
            ["操作时间:", v.operateTime, "green"],
            ["状态:", v.status == 0 ? '初始' : '完成', "red"]
        ];

        $.each(propertyArr, function(index, value) {
            var $liProperty = $('<li></li>');
            $('<strong></strong>').html(value[0]).appendTo($liProperty);
            $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
            $liProperty.appendTo($ulProperty);
        });

        // 如果有备注信息，显示备注
        if (v.comment) {
            var $liComment = $('<li></li>');
            $('<strong></strong>').html("备注: ").appendTo($liComment);
            $('<b></b>').html(v.comment).addClass("grey").appendTo($liComment);
            $liComment.appendTo($ulProperty);
        }

        $liLine.append($h4).append($ulProperty).append($divBtnWrap);
        return $liLine;
    }

    // 根据当前模式初始化
    if (decorationService.orderId) {
        servicePage.orderIdInput.val(decorationService.orderId);
        switchToSingleMode();
    } else {
        switchToPageMode();
    }

    com.focusPage("#serviceSaveBtn").on('click', function(res) {

        if (com.validate("serviceModal")) { return; }

        var options = {};
        options["decorationService.dsid"] = decorationService.dsid;
        options["decorationService.comment"] = decorationService.serviceItems.comment.val();

        com.post(api.decoration.completeDecorationService, options, function(res) {

            drawTable(decorationService.orderId);
            decorationService.serviceModal.modal("hide");
        });

    });

    decorationService.rollback && servicePage.btnBack.click(function() {

        com.switchPage(decorationService.rollback);
    });

    function drawTable(orderId) {

        var $service = com.focusPage("#serviceInfo").html('');

        var $serviceul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($service);

        com.post(api.decoration.queryDecorationServiceByOrderId, {
            "decorationService.orderId": orderId
        }, function(res) {

            decorationServices = res.decorationServices;

            if (decorationServices && decorationServices.length) {
                $.each(decorationServices, function(i, v) {

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h4 = $('<h4></h4>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
                    var $updateBtn = $('<a></a>').addClass('btn btn-minier btn-yellow').html('完成');

                    var propertyArr = [["装修单号:", v.orderId, "grey"], ["详述:", v.detail, "grey"], ["操作人:", v.operater.currentName, "grey"], ["操作时间:", v.operateTime, "green"], ["状态:", v.status == 0 ? '初始' : '完成', "red"], ["备注:", v.comment, "grey"]];

                    $updateBtn.click(function() {

                        decorationService.dsid = v.dsid;
                        com.cleanItems(decorationService.serviceItems);
                        decorationService.serviceModal.modal("show");
                    });

                    $.each(propertyArr, function(index, value) {

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
