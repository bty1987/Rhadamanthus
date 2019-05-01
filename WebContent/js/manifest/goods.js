$(function () {

	var items = {
    		
	    	no: com.focusPage("#no"),
	    	type: com.focusPage("#type"),
	    	name: com.focusPage("#name"),
	    	barcode: com.focusPage("#barcode"),
	    	category: com.focusPage("#category"),
	    	brand: com.focusPage("#brand"),
	    	measurementUnit: com.focusPage("#measurementUnit"),
	    	purchase: com.focusPage("#purchase"),
	    	selling: com.focusPage("#selling"),
	    	pieceNum: com.focusPage("#pieceNum"),
	    	accessoriesType: com.focusPage("#accessoriesType"),
	    	
	    	submitBtn: com.focusPage("#submitBtn")
	    	
	    };

	var goods = {
			gid: null,
			keyword: null,
	}
	
    var validator = {
		float3: {
	        type: "v_float_3",
	        regex: /^([0-9]+|[0-9]+\.[0-9]{1,3})$/,
	        errorMsg: "数量格式错误"
	    }
    };

    $.extend(com.validator,validator);
    
    items.submitBtn.click(function(){
    	saveData();
    });
    
    items.type.bindData([{gid:0,goods : "商品"},{gid:1,goods : "套餐"}], "gid", "goods");

    com.post(api.data.queryCategory, {}, function (res) {
        items.category.bindData(res.categorys, "categoryName", "categoryName");
    });

    com.post(api.common.queryMeasurementUnit, {}, function (res) {
        items.measurementUnit.bindData(res.measurementUnits, "name", "name");
    });

    com.post(api.inventory.queryAccessoriesType, {}, function (res) {
    	items.accessoriesType.bindData(res.accessoriesTypes, 'atid', 'name', true);
    });
    
    com.focusPage("#brand").typeahead({
        url: api.data.queryBrandForPinYinName,
        list: [],
        postData: {},
        source: function (query, process) {
            com.post(this.options.url, {"pinyinName": query}, $.proxy(this.options.callback, this));
        }, matcher: function (item) {
            return true;
        }, callback: function (data) {
            this.options.list = data['brands'];
            this.flprocess(this.options.list, 'bid', 'name');
        },
        isResultTypeMap: true,
        flupdater: function (k, v) {
        	
            var list = this.options.list;
            
            $.each(list, function (index, val) {
            	
                if (val.bid == k) {
                	
                	goods.bid = k;
                	
                	com.post(api.data.queryBrandByBid, {"brand.bid": k}, function (res) {
                        items.category.val(res.brand.categoryName);
                    });
                }
            });

            return v;
        }
    });
    
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

        //绘制表格头
        var createTableTitle = function () {

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col12');

            var titleName = '编号,商品,条形码,品类,品牌,单位,进价,售价,件数,辅类,类型,状态';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

            return $ulTitle;
        };
        //绘制表格体
        var creatLine = function (i, v, lastFlag) {

            var $liLine = $('<li></li>').addClass('line');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col12');
            //显示字段
            var propertyArr = [
                //v.gid,
                [v.no,'blue'],
                [v.name,'grey'],
                [v.barcode,'blue'],
                [v.category,'grey'],
                [v.brand,'grey'],
                [v.measurementUnit,'grey'],
                [v.purchase,'blue'],
                [v.selling,'blue'],
                [v.pieceNum,'blue'],
                [v.accessoriesType.name,'grey'],
                [v.type == "0" ? "商品" : "套餐",'red'],
                [v.status == "0" ? "启用" : "禁用",'red']
            ];

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell ' + v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            var $btnColor = $('<li></li>').append($('<a></a>').html('颜色'));
            var $btnFormat = $('<li></li>').append($('<a></a>').html('规格'));
            var $btnPrice = $('<li></li>').append($('<a></a>').html('价格'));
            //var $btnSuit = $('<li></li>').append($('<a></a>').html('查看'));
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));
            var $btnStop = $('<li></li>').append($('<a></a>').html('禁用'));

            $btnUl.append($btnColor).append($btnFormat).append($btnPrice).append($btnStart).append($btnStop);

            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            $btnColor.click(function () {
            	params["goods.gid"] = v.gid;
            	skipLayer('颜色', 'views/manifest/color.html');
            });
            
            $btnFormat.click(function () {
            	params["goods.gid"] = v.gid;
            	skipLayer('规格', 'views/manifest/format.html');
            });
            
            $btnPrice.click(function () {
            	params["goods.gid"] = v.gid;
            	skipLayer('价格', 'views/manifest/price.html');
            });

            /* $btnSuit.click(function () {
				 params["goods.gid"] = v.gid;
                 skipLayer('套餐', 'views/data/goods4package.html');
             });*/
            
            $btnStart.click(function () {
            	
            	if(v.status == 0){
            		com.showAlert(com.warning, "已启用");
            		return false;
            	}
            	
            	updateStatus(v.gid, 0);
            });
            
            $btnStop.click(function () {
            	
            	if(v.status == 1){
            		com.showAlert(com.warning, "已禁用");
            		return false;
            	}
            	
            	updateStatus(v.gid, 1);
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

    var goodsSeacher = new Searcher();

    goodsSeacher.init(['goodsNo', 'goodsName', 'goodsBarcode', 'goodsBrand', 'goodsStatus'], "condList", api.inventory.pageGoods, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "goodsPostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addQuotationVersion').css({'margin-left':'4px'});
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $addaExportGoods = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'importGoods');
        var $addaExporti = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($addaExportGoods);
        var $addaExportspan = $('<span></span>').text('商品导出').appendTo($addaExportGoods);

        $adda.click(function () {
        	
        	com.cleanItems(items);
            
            readonly(null);
            
            goods.gid = null;
            goods.bid = null;
            
            showLayer("添加", "#addLayer");
        });

        $addaExportGoods.click(function(){
        	
        	var total = com.focusPage('span[name="totalRecords"]').text();

            if (total == 0) {
                com.showAlert(com.warning, "请通过条件进行查询");
                return false;
            }
            
            if (com.focusPage('span[name="totalRecords"]').text() > 1000) {
                com.showAlert(com.warning, "查询结果大于阀值 , 导出失败");
                return false;
            }
            
            com.post(api.inventory.pageGoods, $.extend({}, params.goodsPostData, {"paging.noPage": 1}), function (res) {

                $.exceler({
                    column: [
                        ['商品ID', 'gid'],
                        ['商品编码','no'],
                        ['商品名称', 'name'],
                        ['条形码', 'barcode'],
                        ['品类', 'category'],
                        ['品牌ID', 'bid'],
                        ['品牌', 'brand'],
                        ['单位', 'measurementUnit'],
                        ['件数', 'pieceNum'],
                        ['类型','type']
                    ],
                    list: res.paging.data
                });
            });
            
        });

        return [$addaExportGoods,$adda];

    }, 'resultList');

    function showLayer(title, layerId) {
    	
    	var $content = com.focusPage(layerId);
    	
        layer.open({
            type: 1,
            title: title,
            content: $content,
            area: [($(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620) + "px", $content.height() + "px"],
            maxmin: false,
            move: false,
            zIndex: 9000,
            cancel: function () {
            	com.clearValidator();
                layer.closeAll();
            }
        });
    }

    function skipLayer(title, url) {
        var $popUp = com.focusPage('#layerPopUp');
        
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: title,
            content: $popUp,
            area: ["1200px", ($(window).height() * 0.84 < 800 ? $(window).height() * 0.84 : 800) + "px"],
            maxmin: false,
            move: false,
            zIndex: 9000,
            success: function (layer, index) {
            	$popUp.load(url);
            },
            end: function () {
                goodsSeacher.doSearch();
            }
        });
    }

    function updateStatus(gid, status) {
    	
    	var options = {
			"goods.gid": gid,
            "goods.status": status
    	}
    	
    	com.post(api.inventory.updateGoodsForStatus, options, function (res) {
    		com.showAlert(com.info, "操作成功");
            goodsSeacher.doSearch();
        });
    }

    function saveData(id) {
    	
    	if(com.validate("formAdvance", "right")){
    		return false;
    	}
    	
    	var gid = goods.gid;
        var atid = items.accessoriesType.val();
        
        var url = api.inventory.updateGoods
        var options = {
        	"goods.type": items.type.val(),
        	"goods.purchase": items.purchase.val(),
        	"goods.selling": items.selling.val(),
        	"goods.accessoriesType.atid": atid == null || atid == "" ? "" : atid
        }
        
        if(!gid){
        	url = api.inventory.addGoods;
        	options["goods.no"] = items.no.val();
        	options["goods.name"] = items.name.val();
        	options["goods.barcode"] = items.barcode.val();
        	options["goods.bid"] = goods.bid;
        	options["goods.category"] = items.category.val();
        	options["goods.measurementUnit"] = items.measurementUnit.val();
        	options["goods.pieceNum"] = items.pieceNum.val();
        }else{
        	options["goods.gid"] = goods.gid;
        }
        
        com.post(url, options, function (res) {
            layer.closeAll();
            goodsSeacher.doSearch();
        });

    }

    function readonly(disabled){
    	
    	items.no.attr("disabled", disabled);
    	items.type.attr("disabled", disabled);
    	items.name.attr("disabled", disabled);
    	items.barcode.attr("disabled", disabled);
    	items.category.attr("disabled", disabled);
    	items.brand.attr("disabled", disabled);
    	items.measurementUnit.attr("disabled", disabled);
    	items.pieceNum.attr("disabled", disabled);
    }
    
});
