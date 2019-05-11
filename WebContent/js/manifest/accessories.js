
$(function () {
	
	var accessories = {
		status: {},
		schedule: {}
	}
	
	com.post(api.ds.manifest, {}, function(res){
		$.each(res.accessoriesStatus, function(i, v){
			accessories.status[v.key] = v.value;
		});
	}, null, false);
	
	com.post(api.data.queryConstructionNode, {}, function(res){
        $.each(res.constructionNodes, function(i, v){
            accessories.schedule[v.sort] = v.name;
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
                    creatLine(i, v, i == listData.length - 1).appendTo($ulTitle);
                });
            }
        };

        var createTableTitle = function () {

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col8');

            var titleName = '辅料单号,装修单号,创建人,创建时间,审批人,审批时间,施工环节,状态';

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

            var $input = $('<input>').attr({"type": "checkbox"}).addClass('ace ace-checkbox-2 hide').attr('data.aid', v.aid).attr({
                "data-pid": v.pid,
                "data-status": v.status
            });
            var _span = $('<span></span>').addClass('lbl grey bigger-150').css('font-weight','bold');

            _label.append($input).append(_span);
            
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(_label));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col8');

            var propertyArr = [
                [v.no, 'blue'],
                [v.orderId, 'blue'],
                [v.creater.userName, 'grey'],
                [v.createTime, 'green'],
                [v.approver.userName, 'grey'],
                [v.approverTime, 'green'],
                [accessories.schedule[v.schedule], 'red'],
                [accessories.status[v.status], 'red'],
            ];

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option').appendTo($optionWrap);

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-info dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            var $btnView = $('<li></li>').append($('<a></a>').html('查看'));
            var $btnOut = $('<li></li>').append($('<a></a>').html('出货'));
            var $btnEdit = $('<li></li>').append($('<a></a>').html('修改'));
            //var $btnReturn = $('<li></li>').append($('<a></a>').html('退回'));
            var $btnPrint = $('<li></li>').append($('<a></a>').html('打印'));

            v.status != 4 && ($btnUl.append($btnEdit));
            v.status == 0 && ($btnUl.append($btnOut));//初始：出货，修改
            v.status == 1 && ($btnUl.append($btnView).append($btnOut).append($btnEdit).append($btnPrint));//出货：出货 修改 退回 打印
            v.status == 4 && ($btnUl.append($btnView));
            
            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            $btnView.click(function(){
            	
            	if(v.status == 0){
            		com.showAlert(com.warning, "辅料单状态不可操作");
            		return false;
            	}
            	
            	params["accessories.aid"] = v.aid;
            	
                showLayer("辅料单 : " + v.no, '#layerPopUp', "views/manifest/accessories4view.html");
            });

            $btnOut.click(function () {
            	
            	if(v.status != 0){
            		com.showAlert(com.warning, "辅料单状态不可操作");
            		return false;
            	}
            	
            	params["accessories.aid"] = v.aid;
            	params["accessories.orderId"] = v.orderId;
            	
                showLayer("辅料单 : " + v.no, '#layerPopUp', "views/manifest/accessories2out.html");
            });

            $btnEdit.click(function () {
            	
            	if(v.status != 0){
            		com.showAlert(com.warning, "辅料单状态不可操作");
            		return false;
            	}
            	
            	params["accessories.aid"] = v.aid;

                showLayer("辅料单 : " + v.no, '#layerPopUp', "views/manifest/accessories2edit.html");
            });

            $btnPrint.click(function(){

                params["accessories.no"] = v.no;
                params["accessories.orderId"] = v.orderId;
                params["accessories.createTime"] = v.createTime;
                params["accessories.creater"] = v.creater.userName;
                params["accessories.aid"] = v.aid;
                params["accessories.manifestTime"] = v.approverTime;

                printAccessoriesItem(v.aid,v.no);
            })

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

    var accessoriesSeacher = new Searcher();
    var _Array = ['orderId', 'accessoriesNo', 'createrName', 'approverName', 'createTime', 'approverTime'];
    
    accessoriesSeacher.init(_Array, "condList", api.inventory.pageAccessories, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "accessoriesPostData", null, false, null, function () {
        var $adda = $('<a></a>').addClass('btn btn-success btn-minier pull-left').attr('name', 'shipment').css('margin-top', '-2px').html('批量出货');

        $adda.click(function () {
        	batchout();
        });

        return [];
    }, 'resultList');
    
    function showLayer(title, element, page){
    	
    	var $popup = com.focusPage(element);
    	
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
            }
        });
    }

    function batchout() {
    	
        var $checks = $('input[type="checkbox"]:checked', '.line');
        var $aids = [];
        
        if($checks.length == 0){
        	com.showAlert(com.warning, "请选择辅料单");
        	return false;
        }
        
        for(var i=0;i<$checks.length;i++){
        	
        	var $check = $checks[i];
        	
        	if($check.attr("data-status") != 0){
        		com.showAlert(com.warning, "辅料单状态不可操作");
        		return false;
        	}
        	
        	$aids.push($check.attr("data-aid"));
        }
        
        params["accessories.aids"] = $aids;
        
        showLayer("批量出货", '#layerPopUp', "views/manifest/accessories2batchout.html");
    }

    //打印货单项
    function printAccessoriesItem(aid, no){
        com.popup("辅料单号" + no, api.index.accessoriesPrintIndex.url, function () {
            parent.layer.getFrameIndex(window.name);
        }, null, true);
    }
    
});
