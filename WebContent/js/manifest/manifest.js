
$(function () {
	
	var manifest = {
		items: {
			
		},
		manifestType: [],
		status: {}
	};
	
	com.post(api.ds.manifest, {}, function(res){
        $.each(res.manifestType, function(i, v){
        	manifest.manifestType.push(v.value);
        });
        
        $.each(res.manifestStatus, function(i, v){
        	manifest.status[v.key] = v.value;
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
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col7');

            var titleName = "编号,创建人,创建时间,货单时间,状态,类型,备注";

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

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap content col7');

            var propertyArr = [
                [v.code, 'blue'],
                [v.creater.currentName ? v.creater.currentName : '---', 'grey'],
                [v.createTime, 'green'],
                [v.manifestTime, 'green'],
                [manifest.status[v.status], 'red'],
                [manifest.manifestType[parseInt(v.type) - 1] ? manifest.manifestType[parseInt(v.type) - 1] : '---','red'],
                [v.comment == null ? "" : v.comment, 'grey']
            ];

            $.each(propertyArr, function (index, v) {
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
            var $btnConfirm = $('<li></li>').append($('<a></a>').html('确认'));
            var $btnCR = $('<li></li>').append($('<a></a>').html('进退'));
            var $btnXB = $('<li></li>').append($('<a></a>').html('出返'));
            //var $btnCA = $('<li></li>').append($('<a></a>').html('冲销'));
            var $btnImport = $('<li></li>').append($('<a></a>').html('导出'));
            var $btnPrint = $('<li></li>').append($('<a></a>').html('打印'));

            $btnUl.append($btnView).append($btnConfirm).append($btnImport).append($btnPrint);
                
            if (v.type == 1) {
                $btnUl.append($btnCR);
            } else if (v.type == 3) {
                $btnUl.append($btnXB);
            }

            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);
            $cellOption.appendTo($optionWrap);
            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            $btnView.click(function () {
                params["manifest.mid"] = v.mid;
                showLayer("查看__货单号 : " + v.code, "views/manifest/manifest4view.html");
            });

            $btnEdit.click(function () {
            	
            	if(v.status != 0){
            		com.showAlert(com.warning, "货单状态不可操作");
            		return false;
            	}
            	
            	params["manifest.mid"] = v.mid;
                showLayer("编辑__货单号 : " + v.code, "views/manifest/manifest2edit.html");
            });

            $btnConfirm.click(function(){
            	
            	if(v.status != 0){
            	    com.showAlert(com.warning, "货单状态不可操作");
            		return false;
            	}

            	com.showConfirm('是否确认订单?', function (result) {
                    com.post(api.inventory.confirmManifest, {"manifest.mid": v.mid}, function(res){
                        com.showAlert(com.info, "操作成功");
                        seacher.doSearch();
                    });
                })
            });

            $btnCR.click(function(){
            	
            	if(v.status != 1){
            	    com.showAlert(com.warning, "货单状态不可操作");
            		return false;
            	}
            	
//                advanceRetreatManifest(v.mid, v.status);
            	
            	params["manifest.mid"] = v.mid;
                showLayer("进退__货单号 : " + v.code, "views/manifest/manifest2cr.html");
            });

            $btnXB.click(function(){
            	
            	if(v.status != 1){
            	    com.showAlert(com.warning, "货单状态不可操作");
            		return false;
            	}
            	
//                sendReturnManifest(v.mid, v.status, v.sid);
            	
            	params["manifest.mid"] = v.mid;
                showLayer("出返__货单号 : " + v.code, "views/manifest/manifest2xb.html");
            });

            $btnImport.click(function(){
            	exportManifest(v.mid);
            });

            //打印按钮
            $btnPrint.click(function () {

                params["code"] = v.code;
                params["createTime"] = v.createTime;
                params["creater.userName"] = v.creater.userName;
                params["manifestTime"] = v.manifestTime;
                params["mid"] = v.mid;
                params["status"] = v.status;
                params["total"] = v.total;
                params["type"] = v.type;

//                printManifest(v.mid,v.code);
                
                params["manifest.mid"] = v.mid;
                
                com.popup("货单号 : " + v.code, api.index.manifestPrintIndex.url, function () {
                    parent.layer.getFrameIndex(window.name);
                }, null, true);
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


    var _condArr = ["manifestCode", "createrName", "manifestCreateTime", "manifestTime", "manifestType", "manifestStatus"];

    var seacher = new Searcher();

    seacher.init(_condArr, "condList", api.inventory.pageManifest, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "manifestPostData", null, false, null, null, 'resultList');

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
            }
        });
    }

    function exportManifest(mid){
        com.post(api.inventory.queryManifestItemByMid, {"manifest.mid": mid}, function(res){

            $.exceler({
                column: [
                    ['商品编号','goods.no'],
                    ['商品名','goods.name'],
                    ['单位','goods.measurementUnit'],
                    ['颜色','color.name'],
                    ['规格','format.info'],
                    ['进货仓库','instorehouse.name'],
                    ['出货仓库','outstorehouse.name'],
                    ['入库价','inprice'],
                    ['出库价','outprice'],
                    ['数量','num'],
                    ['件数','goods.pieceNum'],
                    ['备注','comment']
                ],
                list: res.manifestItems
            }, function(v){
                v.instorehouse.name = v.instorehouse.name == null ? "---" : v.instorehouse.name;
                v.outstorehouse.name = v.outstorehouse.name == null ? "---" : v.outstorehouse.name;
            });
        });
    }

});

