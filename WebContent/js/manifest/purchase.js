
$(function () {

	var purchase = {
		items: {},
		
		status: {},
		balanceStatus: {}
	};
	
	com.post(api.ds.manifest, {}, function(res){
    	
    	$.each(res.purchaseStatus, function(i, v){
    		purchase.status[v.key] = v.value;
    	});
    	
    	$.each(res.purchaseBalanceStatus, function(i, v){
    		purchase.balanceStatus[v.key] = v.value;
    	});
    }, null, false);

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);

            if (listData && listData.length) {

                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');
                $tableWrap.append($ulTitle).append($ulData);

                $.each(listData, function (i, v) {
                    var $liLine = creatLine(i, v, i == listData.length - 1);

                    $liLine.appendTo($ulTitle);
                });
            }
        };

        var createTableTitle = function () {

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col9');

            var titleName = '采购单号,创建人,创建时间,结算时间,交期时间,入库状态,结算状态,说明';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

            return $ulTitle;
        };

        var creatLine = function (i, v, lastFlag) {

            var $liLine = $('<li></li>').addClass('line');

            var _label = $('<label></label>');

            var $input = $('<input>').attr({"type": "checkbox"}).addClass('ace ace-checkbox-2 hide').attr('data-status', v.status).attr({
                "data-pid": v.pid,
                "data-status": v.status
            });
            var _span = $('<span></span>').addClass('lbl grey bigger-150').css('font-weight', 'bold');

            _label.append($input).append(_span);

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(_label));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col9');

            var propertyArr = [
                [v.no, 'blue'],
                [v.user.userName, 'grey'],
                [v.createTime, 'green'],
                [v.balanceTime, 'green'],
                [v.deliveryTime, 'green'],
                [purchase.status[v.status], 'red'],
                [purchase.balanceStatus[v.balanceStatus], 'red'],
                [v.comment, 'grey']
            ];

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-info dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            var $btnView = $('<li></li>').append($('<a></a>').html('查看'));
            var $btnEdit = $('<li></li>').append($('<a></a>').html('修改'));
            var $btnIn = $('<li></li>').append($('<a></a>').html('入库'));

            $btnUl.append($btnView);

            if (v.status != 2) {
                $btnUl.append($btnEdit).append($btnIn);
            }

            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);
            $cellOption.appendTo($optionWrap);
            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            $btnView.click(function () {
                params["purchase.pid"] = v.pid;
                showLayer("查看__采购单号 : " + v.no, "views/manifest/purchase4view.html");
            });

            $btnEdit.click(function () {
                
                if(v.status != 0){
                	com.showAlert(com.warning, "采购单状态不可操作");
                	return false;
                }
                
                params["purchase.pid"] = v.pid;
                showLayer("修改__采购单号 : " + v.no, "views/manifest/purchase2edit.html");
            });

            $btnIn.click(function () {
                params["purchase.pid"] = v.pid;
                showLayer("入库__采购单号 : " + v.no, "views/manifest/purchase2in.html");
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();


    var purchaseSearcher = new Searcher();

    purchaseSearcher.init(["purchaseNo", "purchaseUserName", "purchaseTime", "purchaseStatus"], "condList", api.inventory.pagePurchase, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "purchasePostData", null, false, null, function () {

        var $batchs = $('<a></a>').addClass('btn btn-minier btn-info pull-left').attr('name', 'addBatch');
        var $addaGoodi = $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($batchs);
        var $addaGoodspan = $('<span></span>').text('批量入库').appendTo($batchs);
        
        var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import');
        var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
        var $impspan = $('<span></span>').text('导出').appendTo($impa);

        //导出点击事件
        $impa.click(function () {
        	exportPurchase();
        });

        //批量入库点击事件
        $batchs.click(function () {
            batchin();
        });

        return [$impa];
    }, 'resultList');
    
    function showLayer(title, page){
    	
    	var $popup = com.focusPage("#layerPopUp");
    	
    	layer.open({
            type: 1,
            title: title,
            skin: 'layui-layer-lan',
            content: $popup,
            area: [($(window).width() * 0.7 < 1000 ? $(window).width() * 0.7 : 1000) + "px", ($(window).height() * 0.84 < 620 ? $(window).height() * 0.84 : 620) + "px"],
            maxmin: false,
            success: function (layer, index) {
                $popup.load(page);
            },
            end: function () {
                layer.closeAll();
                purchaseSearcher.doSearch();
            }
        });
    }

    // 批量入库校验
    function batchin() {
    	
    	var $checks = $('input[type="checkbox"]:checked', '.resultList');
        var $pids = [];
        
        if($checks.length == 0){
        	com.showAlert(com.warning, "请选择采购单");
        	return false;
        }
        
        for(var i=0;i<$checks.length;i++){
        	
        	var $check = $checks[i];
        	
        	if($check.attr("data-status") != 0){
        		com.showAlert(com.warning, "采购单状态不可操作");
        		return false;
        	}
        	
        	$pids.push($check.attr("data-pid"));
        }
        
        params["purchase.pids"] = $pids;
        
        showLayer("批量入库", "views/manifest/purchase2batchin.html");
    }

    //导出excel
    function exportPurchase() {
    	
        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 1000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.inventory.pagePurchase, $.extend({}, params.purchasePostData, {"paging.noPage": 1}), function (res) {

            $.each(res.paging.data, function (i, v) {
                v.balanceStatus = (v.balanceStatus == "0" ? "初始" : "已结算");
                v.status = (v.status == "0" ? "初始" : (v.status == "1" ? "部分入库" : "全部入库"));
            });

            $.exceler({
                column: [
                    ['采购单号', 'no'],
                    ['创建人', 'user.userName'],
                    ['创建时间', 'createTime'],
                    ['结算时间', 'balanceTime'],
                    ['交期时间', 'deliveryTime'],
                    ['入库状态', 'status'],
                    ['结算状态', 'balanceStatus'],
                    ['说明', 'comment']
                ],
                list: res.paging.data
            });

        });
    }

});


