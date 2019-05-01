$(function () {
	
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
    		
    	executeTimes: com.focusPage("#executeTimes"),
    	executeDates: com.focusPage("#executeDates"),
    	
    	filePath: com.focusPage("#filePath"),
    	
    	submitBtn: com.focusPage("#submitBtn"),
    	importBtn: com.focusPage("#importBtn"),
    	exportBtn: com.focusPage("#exportBtn")
    };

    $.extend(com.validator, validator);
    
    items.submitBtn.click(function(){
    	saveData();
    });
    
    items.importBtn.click(function(){
    	planMission("import");
    });
    
    items.exportBtn.click(function(){
    	planMission("export");
    });

    com.focusPage(".date-picker").datepicker({autoclose: !0}).on("show", function () {
        setTimeout(function () {
            com.focusPage(".dropdown-menu").css("z-index", 9999)
        }, 0)
    }).next().on(ace.click_event, function () {
        a(this).prev().focus()
    });

    com.focusPage('#executeTimes').timepicker({
        minuteStep: 1,
        showSeconds: false,
        showMeridian: false
    });

    com.focusPage("#attachment").Huploadify({
        auto: !0,
        successTimeout: 60000,
        formData: {
            username: "用户名",
            rnd: "加密密文",
            uploadType: 3
        },
        buttonText: "上传附件",
        buttonClass: "btn btn-sm btn-primary lineheight0",
        overrideEvents: ["onDialogClose"],
        fileObjName: "strutsUploads",
        uploader: config.media + api.common.uploadOther.url,
        width: "78",
        onSelectError: function (a, b, c) {
            switch (b) {
                case -100:
                    alert("上传的文件数量已经超出系统限制的" + com.focusPage("#file_upload").uploadify("settings", "queueSizeLimit") + "个文件!");
                    break;
                case -110:
                    alert("文件 [" + a.name + "] 大小超出系统限制的" + com.focusPage("#file_upload").uploadify("settings", "fileSizeLimit") + "大小!");
                    break;
                case -120:
                    alert("文件 [" + a.name + "] 大小异常!");
                    break;
                case -130:
                    alert("文件 [" + a.name + "] 类型不正确!")
            }
        },
        onUploadSuccess: function (a, b, c) {
            a = eval("(" + b + ")");
            0 == a.errorCode ? com.focusPage("#filePath").val(a.resUrl) : alert(b)
        },
        itemTemplate: '<div id="${fileID}" class="uploadify-queue-item" style="position:absolute;top:-30px;width:200px;left:-200px;">\r\n\t\t\t<div class="cancel">\r\n\t\t\t\t<a href="javascript:$(\'#${instanceID}\').uploadify(\'cancel\', \'${fileID}\')">X</a>\r\n\t\t\t</div>\r\n\t\t\t<span class="fileName">${fileName} (${fileSize})</span><span class="data"></span>\r\n\t\t\t<div class="uploadify-progress">\r\n\t\t\t\t<div class="uploadify-progress-bar"><!--Progress Bar--></div>\r\n\t\t\t</div>\r\n\t\t</div>'
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
                [v.no, 'blue'],
                [v.name, 'grey'],
                [v.barcode, 'blue'],
                [v.category, 'grey'],
                [v.brand, 'grey'],
                [v.measurementUnit, 'grey'],
                [v.purchase, 'blue'],
                [v.selling, 'blue'],
                [v.pieceNum, 'blue'],
                [v.accessoriesType.name, 'grey'],
                [v.type == "0" ? "商品" : "套餐", 'red'],
                [v.status == "0" ? "启用" : "禁用", 'red']
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

            var $btnEdit = $('<li></li>').append($('<a></a>').html('编辑'));
            var $btnColor = $('<li></li>').append($('<a></a>').html('颜色'));
            var $btnFormat = $('<li></li>').append($('<a></a>').html('规格'));
            var $btnPrice = $('<li></li>').append($('<a></a>').html('价格'));
            //var $btnSuit = $('<li></li>').append($('<a></a>').html('查看'));
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));
            var $btnStop = $('<li></li>').append($('<a></a>').html('禁用'));

            $btnUl.append($btnEdit).append($btnColor).append($btnFormat).append($btnPrice).append($btnStart).append($btnStop);

            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);
            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);
            
            $btnEdit.click(function () {
            	
            	readonly("disabled");
            	
//            	com.updateChosen('brand', v.bid, v.brand);
            	
            	goods.gid = v.gid;
            	goods.bid = v.bid;
            	
            	items.no.val(v.no);
            	items.type.val(v.type);
            	items.name.val(v.name);
            	items.barcode.val(v.barcode);
            	items.brand.val(v.brand);
            	items.category.val(v.category);
            	
            	items.measurementUnit.val(v.measurementUnit);
            	items.purchase.val(v.purchase);
            	items.selling.val(v.selling);
            	items.pieceNum.val(v.pieceNum);
            	items.accessoriesType.val(v.accessoriesType.atid);
            	
                showLayer("编辑", "#addLayer");
            });
            
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
            	skipLayer('价格', 'views/manifest/price4advance.html');
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

    items.type.bindData([{gid: 0, goods: "商品"}, {gid: 1, goods: "套餐"}], "gid", "goods");

    com.post(api.data.queryCategory, {}, function (res) {
        items.category.bindData(res.categorys, "categoryName", "categoryName");
    });

    com.post(api.common.queryMeasurementUnit, {}, function (res) {
        items.measurementUnit.bindData(res.measurementUnits, "name", "name");
    });

    com.post(api.inventory.queryAccessoriesType, {}, function (res) {
        items.accessoriesType.bindData(res.accessoriesTypes, 'atid', 'name', true);
    });

    goodsSeacher.init(['goodsNo', 'goodsName', 'goodsBarcode', 'goodsBrand', 'goodsStatus'], "condList", api.inventory.pageGoodsForAdvance, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "goodsAdvancePostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addQuotationVersion').css({'margin-left': '4px'});
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $addaImportGood = $('<a></a>').addClass('btn btn-minier btn-warning pull-left').attr('name', 'importGoods').css({'margin-left': '4px'});
        var $addaGoodi = $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($addaImportGood);
        var $addaGoodspan = $('<span></span>').text('导入商品').appendTo($addaImportGood);

        var $addaImportColor = $('<a></a>').addClass('btn btn-minier btn-danger pull-left').attr('name', 'importGoods').css({'margin-left': '4px'});
        var $addaColori = $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($addaImportColor);
        var $addaColorspan = $('<span></span>').text('导入颜色').appendTo($addaImportColor);

        var $addaImportFormat = $('<a></a>').addClass('btn btn-minier btn-purple pull-left').attr('name', 'importGoods').css({'margin-left': '4px'});
        var $addaFormati = $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($addaImportFormat);
        var $addaFormatspan = $('<span></span>').text('导入规格').appendTo($addaImportFormat);

        var $addaImportPrice = $('<a></a>').addClass('btn btn-minier btn-pink pull-left').attr('name', 'importGoods').css({'margin-left': '4px'});
        var $addaPricei = $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($addaImportPrice);
        var $addaPricespan = $('<span></span>').text('导入价格').appendTo($addaImportPrice);

        var $deleteImportPrice = $('<a></a>').addClass('btn btn-minier btn-inverse pull-left').attr('name', 'importGoods').css({'margin-left': '4px'});
        var $deletePricei = $('<i></i>').addClass('icon-cloud-upload bigger-110').appendTo($deleteImportPrice);
        var $deletePricespan = $('<span></span>').text('删除价格').appendTo($deleteImportPrice);

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

        $addaImportGood.click(function () {
        	
        	goods.keyword = "import_goods";
        	
        	var form = com.focusPage("#importGoodsForm");
        	
        	com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
        	com.focusPage("#fileUpload").removeClass("hide");
        	
        	items.importBtn.removeClass("hide");
        	items.exportBtn.addClass("hide");
            
            showLayer("导入商品", "#importGoods");
        });

        $addaImportColor.click(function () {
        	
        	goods.keyword = "import_color";
        	
        	var form = com.focusPage("#importColorForm");
        	
        	com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
        	com.focusPage("#fileUpload").removeClass("hide");
        	
        	items.importBtn.removeClass("hide");
        	items.exportBtn.addClass("hide");
            
            showLayer("导入颜色", "#importColor");
        });

        $addaImportFormat.click(function () {
        	
        	goods.keyword = "import_format";
        	
        	var form = com.focusPage("#importFormatForm");
        	
        	com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
        	com.focusPage("#fileUpload").removeClass("hide");
        	
        	items.importBtn.removeClass("hide");
        	items.exportBtn.addClass("hide");
            
            showLayer("导入规格", "#importFormat");
        });
        
        $addaImportPrice.click(function () {
        	
        	goods.keyword = "import_price";
        	
        	var form = com.focusPage("#importPriceForm");
        	
        	com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
        	com.focusPage("#fileUpload").removeClass("hide");
        	
        	items.importBtn.removeClass("hide");
        	items.exportBtn.addClass("hide");
            
            showLayer("导入价格", "#importPrice");
        });

        $deleteImportPrice.click(function () {
        	
        	goods.keyword = "delete_price";
        	
        	var form = com.focusPage("#deletePriceForm");
        	
        	com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
        	com.focusPage("#fileUpload").removeClass("hide");
        	
        	items.importBtn.removeClass("hide");
        	items.exportBtn.addClass("hide");
            
            showLayer("删除价格", "#deletePrice");
        });

        $addaExportGoods.click(function () {
        	
        	var total = com.focusPage('span[name="totalRecords"]').text();

            if (total == 0) {
                com.showAlert(com.warning, "请通过条件进行查询");
                return false;
            }
            
            if (com.focusPage('span[name="totalRecords"]').text() > 1000) {
                com.showAlert(com.warning, "查询结果大于阀值 , 导出失败");
                return false;
            }
            
            goods.keyword = "export_inventory_goods";
        	
        	var form = com.focusPage("#exportGoodsForm");
        	
        	com.focusPage("#uploaddiv").removeClass("hide").appendTo(form);
        	com.focusPage("#fileUpload").addClass("hide");
        	
        	items.importBtn.addClass("hide");
        	items.exportBtn.removeClass("hide");
        	
        	showLayer("导出商品", "#exportGoods");
        });

        return [$addaExportGoods, $addaImportGood, $addaImportColor, $addaImportFormat, $addaImportPrice, $deleteImportPrice, $adda];
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
                
                items.executeDates.val("");
                items.executeTimes.val("");
            }
        });
    }
    
    function skipLayer(title, url) {
        var $PopUp = com.focusPage('#layerPopUp');
        
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: title,
            content: $PopUp,
            area: ["1200px", ($(window).height() * 0.84 < 800 ? $(window).height() * 0.84 : 800) + "px"],
            maxmin: false,
            move: false,
            zIndex: 9000,
            success: function (layer, index) {
            	$PopUp.load(url);
            },
            end: function () {
                goodsSeacher.doSearch();
            }
        });
    }

    function updateStatus(gid, status, callback) {
    	
    	var options = {
			"goods.gid": gid,
            "goods.status": status
    	}
    	
    	com.post(api.inventory.updateGoodsForStatus, options, function (res) {
    		com.showAlert(com.info, "操作成功");
            goodsSeacher.doSearch();
        });
    }

    function saveData() {
    	
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

    //导入创建计划
    function planMission(type) {

        if (com.validate("uploaddiv")) {
            return false;
        }
        
        var args = "";
        
        if(type == "export"){
        	
            var filtersName = ["goodsNo", "goodsName", "goodsBarcode", "goodsBrand", "goodsStatus"];

            $.each(filtersName, function (i, v) {
                var val = com.focusPage("[name='" + v + "']").val();
                var columnName = $("[name='" + v + "']").attr("data-rqs");
                if (val != "undefined" && val != null && val != "") {
                    args = args + columnName + "-" + val + ",";
                }
            });
            
            if(args == null || args == ""){
            	com.showAlert(com.warning, "请通过条件进行查询");
                return false;
            }
            
        }else if(type == "import"){
        	
        	var filePath = items.filePath.val();

            if (filePath == null || filePath == "") {
                com.showAlert(com.warning, "上传文件不能为空");
                return false;
            }
            
            args = filePath;
        }else{
        	return false;
        }
        
        var times = items.executeDates.val() + ' ' + items.executeTimes.val();
        var executeTime = new Date(times);

        if (!planUtils.TimeComparison(executeTime, config.planTimeLimit)) {
            com.showAlert(com.warning, "执行时间请大于当前时间" + config.planTimeLimit + "分钟");
            return false;
        }

        var options = {
            "plan.task.keyWord": goods.keyword,
            "plan.executeTime": times,
            "plan.args": args
        };

        com.post(api.information.createPlan, options, function (res) {
            com.showAlert(com.info, "计划创建成功");
            layer.closeAll();
        });
    }

});
