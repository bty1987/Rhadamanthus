$(function(){

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */
    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.itemName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');

            //启用禁用
            var $btnStatus = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
            var $span = $('<span></span>').addClass('lbl');
            //是否打折
            var $btnDiscount = $('<div></div>').addClass('pull-right');
            var $discountSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
            var $dspan = $('<span></span>').addClass('lbl');

            var propertyArr = [
                ["编号:", v.itemId, "blue"],
                ["类型:", v.quotationType, "red"],
                ["分类:", v.quotationClassification, "red"],
                ["大类:", v.quotationBigCategory, "red"],
                ["小类:", v.quotationSmallCategory, "red"],
                ["单位:", v.measurementUnit, "red"],
                ["工种:", v.workType, "red"],
                ["说明:", v.quotationItemDes, "grey"],
                ["单价:", v.unitPrice, "blue"],
                ["版本:", v.version, "blue"],
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $btnStatus.append($statusSwitch).append($span);
            $btnDiscount.append($discountSwitch).append($dspan);

            $divBtnWrap.append($btnEdit).append($btnDiscount).append($btnStatus).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function(){
                queryQuotationBigCategory(v.qtid);
                queryQuotationSmallCategory(v.qtid);
                edit(v);
            });

            !v.status && $statusSwitch.prop("checked", true);
            $statusSwitch.switchBtn("status-lbl").on("click",function() {
                $statusSwitch.prop("checked") ? (updateStatus(v.qiId, 0, function(){$statusSwitch.removeAttr("checked");})) : (updateStatus(v.qiId, 1,function(){$statusSwitch.prop("checked");}));
            });

            v.discount && $discountSwitch.prop("checked", true);
            $discountSwitch.switchBtn("discount-lbl").on("click",function() {
                $discountSwitch.prop("checked") ? (updateDiscount(v.qiId, 1, function(){$discountSwitch.removeAttr("checked");})) : (updateDiscount(v.qiId, 0,function(){$discountSwitch.prop("checked");}));
            });

            return $liLine;
        };

        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();

    var _condArr = ['itemName', 'quotationTypeId', 'quotationClassificationId', 'quotationBigCategoryId', 'quotationSmallCategoryId', 'versionId'];

    var quotationItemSeacher = new Searcher();
    quotationItemSeacher.init( _condArr, "condList", api.quotation.pageQuotationItem,  function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "quotationItemPostData", null, false, null, function(){
    	
    	var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'add').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
        var $impi = $('<i></i>').addClass('icon-upload bigger-110').appendTo($impa);
        var $impspan = $('<span></span>').text('导入').appendTo($impa);

    	var $expa = $('<a></a>').addClass('btn btn-minier btn-warning pull-left').attr('name', 'export').css("margin", "0px 3px");
    	var $expi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($expa);
    	var $expspan = $('<span></span>').text('导出').appendTo($expa);

    	return [$adda,$impa,$expa];
    });

    var quotationItem = {
        saveBtn: com.focusPage("#saveBtn").on("click", saveData),
        cancelBtn: com.focusPage("#cancelBtn"),
        modal: com.focusPage("#quotationItemModal").on("shown.bs.modal",function(a) {
            com.clearValidator();
            com.clearValidator("#itemId", !0);
            0 == quotationItem.editFlg && (quotationItem.quotationItemItems.quotationType.get(0).selectedIndex = 0, quotationItem.quotationItemItems.quotationClassification.get(0).selectedIndex = 0, quotationItem.quotationItemItems.quotationBigCategory.get(0).selectedIndex = 0, quotationItem.quotationItemItems.quotationSmallCategory.get(0).selectedIndex = 0, quotationItem.quotationItemItems.workType.get(0).selectedIndex = 0, quotationItem.quotationItemItems.measurementUnit.get(0).selectedIndex = 0, quotationItem.quotationItemItems.version.get(0).selectedIndex = 0);
        }),
        quotationItemItems: {
            itemId: com.focusPage("#itemId").on("blur", function () {
                $this = $(this);
                if ("" != $this.val()) {
                    var b = {
                        "quotationItem.itemId": $this.val(),
                        "quotationItem.versionId": com.focusPage("#version").val()
                    };
                    com.post(api.quotation.queryQuotationItemByItemIdAVersionId, b,function (a) {
                            a.quotationItem && a.quotationItem.itemId ? (com.showTips($this, "\u8be5\u7248\u672c\u7684\u9879\u76ee\u7f16\u53f7\u5df2\u5b58\u5728", !0), quotationItem.repeatFlg = !0) : (com.clearValidator("#itemId", !0), quotationItem.repeatFlg = !1);
                    });
                }
            }),
            qiId: com.focusPage("#qiId"),
            quotationType: com.focusPage("#quotationType"),
            quotationClassification: com.focusPage("#quotationClassification"),
            quotationBigCategory: com.focusPage("#quotationBigCategory"),
            quotationSmallCategory: com.focusPage("#quotationSmallCategory"),
            itemName: com.focusPage("#itemName"),
            measurementUnit: com.focusPage("#measurementUnit"),
            workType: com.focusPage("#workType"),
            quotationItemDes: com.focusPage("#quotationItemDes"),
            unitPrice: com.focusPage("#unitPrice"),
            version: com.focusPage("#version").on("change",function () {
                $this = $(this);
                if ("" != quotationItem.quotationItemItems.itemId.val()) {
                    var b = {
                        "quotationItem.itemId": quotationItem.quotationItemItems.itemId.val(),
                        "quotationItem.versionId": com.focusPage("#version").val()
                    };
                    com.post(api.quotation.queryQuotationItemByItemIdAVersionId, b, function (a) {
                        a.quotationItem && a.quotationItem.itemId ? (com.showTips(quotationItem.quotationItemItems.itemId, "\u8be5\u7248\u672c\u7684\u9879\u76ee\u7f16\u53f7\u5df2\u5b58\u5728", !0), quotationItem.repeatFlg = !0) : (com.clearValidator("#itemId", !0), quotationItem.repeatFlg = !1);
                    });
                }
            }),
        },
        data: {
            quotationTypeData: {},
            quotationClassificationData: {},
            quotationBigCategoryData: {},
            quotationSmallCategoryData: {},
            measurementUnitData: {},
            workTypeData: {},
            versionData: {}
        },
        editFlag: !1,
        repeatFlg: !1,
        validator: {
            region: {
                type: "v_itemId",
                regex: /^QI_\d{5}$/g,
                errorMsg: "\u8bf7\u4ee5QI_\u4f5c\u4e3a\u524d\u7f00 , \u4e4b\u540e\u4ee5\u4e94\u4e2a\u4f4d\u6570\u5b57\u7ec4\u6210(\u5982QI_00001)."
            }
        }
    };

    $.extend(com.validator, quotationItem.validator);

    com.post(api.quotation.queryQuotationType, {},function(a) {
        quotationItem.data.quotationTypeData = a.quotationTypes;
        com.focusPage("#quotationType").bindData(quotationItem.data.quotationTypeData, "id", "name");
        com.focusPage("#quotationType").prepend("<option value='0'>请选择</option>");
    });
    com.post(api.quotation.queryQuotationClassification, {}, function(a) {
        quotationItem.data.quotationClassificationData = a.quotationClassifications;
        com.focusPage("#quotationClassification").bindData(quotationItem.data.quotationClassificationData, "id", "name");
    });

    com.focusPage("#quotationType").change(function() {
        var quotationType = com.focusPage("#quotationType").val();
        if(quotationType!=2){
            com.focusPage('#unitPrice').removeAttr('readonly').val('');
        }
        if(quotationType == 0 || quotationType == '0'){
            openModal();
            return;
        }else {
            queryQuotationBigCategory(quotationType);
            queryQuotationSmallCategory(quotationType);
            if(quotationType == 2){
                com.focusPage('#unitPrice').attr('readonly','readonly').val(0);
            }
        }

    });
    com.focusPage('#quotationItemModal').on('hide.bs.modal', function () {
        openModal();
    });
    function openModal(){
        com.focusPage("#quotationBigCategory").html('');
        com.focusPage("#quotationSmallCategory").html('');
        com.focusPage("#quotationBigCategory").prepend("<option value='0'>请选择类型</option>");
        com.focusPage("#quotationSmallCategory").prepend("<option value='0'>请选择类型</option>");
        com.focusPage('#unitPrice').removeAttr('readonly').val('');
    };

    function queryQuotationBigCategory(quotationType){
        com.post(api.quotation.queryQuotationBigCategory, {"quotationBigCategory.qtid":quotationType}, function(a) {
            quotationItem.data.quotationBigCategoryData = a.quotationBigCategorys;
            com.focusPage("#quotationBigCategory").bindData(quotationItem.data.quotationBigCategoryData, "id", "name");
        });
    };

    function queryQuotationSmallCategory(quotationType){
        com.post(api.quotation.queryQuotationSmallCategory, {"quotationSmallCategory.qtid":quotationType}, function(a) {
            quotationItem.data.quotationSmallCategoryData = a.quotationSmallCategorys;
            com.focusPage("#quotationSmallCategory").bindData(quotationItem.data.quotationSmallCategoryData, "id", "name");
        });
    };

    /*com.post(api.quotation.queryQuotationBigCategory, {}, function(a) {
        quotationItem.data.quotationBigCategoryData = a.quotationBigCategorys;
        com.focusPage("#quotationBigCategory").bindData(quotationItem.data.quotationBigCategoryData, "id", "name");
    });
    com.post(api.quotation.queryQuotationSmallCategory, {}, function(a) {
        quotationItem.data.quotationSmallCategoryData = a.quotationSmallCategorys;
        com.focusPage("#quotationSmallCategory").bindData(quotationItem.data.quotationSmallCategoryData, "id", "name")
    });*/
    com.post(api.common.queryMeasurementUnit, {}, function(a) {
        quotationItem.data.measurementUnitData = a.measurementUnits;
        com.focusPage("#measurementUnit").bindData(quotationItem.data.measurementUnitData, "id", "name");
    });
    com.post(api.common.queryWorkType, {}, function(a) {
        quotationItem.data.workTypeData = a.workTypes;
        com.focusPage("#workType").bindData(quotationItem.data.workTypeData, "id", "name");
    });
    com.post(api.quotation.queryQuotationVersion, {}, function(a) {
        quotationItem.data.VersionData = a.quotationVersions;
        quotationItem.quotationItemItems.version.bindData(quotationItem.data.VersionData, "versionId", "versionName");
        com.focusPage("#importVersion").bindData(quotationItem.data.VersionData, "versionId", "versionName");
    });
    //导出按钮
    com.focusPage('a[name="import"]').on("click", function () {

        com.focusPage('#importModal').modal("show");
    });

    com.focusPage('#import').Huploadify({

        'debug' : false, // 开启调试
        'auto':true, // 是否自动上传
        'successTimeout':config.uploadTimeout, // 超时时间
        'formData':{
            'uploadType':4
        },
        'buttonClass': 'btn btn-success col-sm-12',
        'overrideEvents' : ['onDialogClose'], // 不执行默认的onSelect事件
        'fileObjName':'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'uploader': config.server + "importQuotationItem.do", // 上传处理程序
        'height':'30', // 浏览按钮的高度
        'fileTypeDesc':'支持的格式：',  // 在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeExts':'*.xls;*.xlsx;', // 允许上传的文件后缀
        'fileSizeLimit':'2MB', // 上传文件的大小限制
        'queueSizeLimit' : 1, // 上传数量
        'onUploadSuccess':function(file, data, response){ //上传到服务器，服务器返回相应信息到data里

        	var dateObj = eval("("+data+")");
            if(data.indexOf("导入文件错误") > 0 ){
                bootbox.alert("导入文件错误");
            }
            quotationItemSeacher.doSearch();
        }
    });

    //添加按钮
    com.focusPage('a[name="add"]', '#pagenation').click(function () {
        quotationItem.editFlg = !1;
        
        com.cleanItems(quotationItem.quotationItemItems);
        quotationItem.quotationItemItems.itemId.prop("disabled", !1);
        quotationItem.quotationItemItems.version.prop("disabled", !1);
        
        quotationItem.modal.modal("show");
    });
    //导出功能
    com.focusPage('a[name="export"]', '#pagenation').click(function () {
    	
    	if(com.focusPage('span[name="totalRecords"]').text() == 0){
			com.showAlert(com.warning, "请通过条件进行查询");
			return false;
		}
    	
    	if(com.focusPage('span[name="totalRecords"]').text() > 500){
			com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
			return false;
		}
		var quotationItemPostData = params.quotationItemPostData;
		com.post(api.quotation.pageQuotationItem, $.extend({}, quotationItemPostData, {"paging.noPage": 1}), function(res){
			
			$.exceler({
				column : [
					["编号","itemId"],
					["名称","itemName"],
					['类型','quotationType'],
					['分类','quotationClassification'],
					['大类','quotationBigCategory'],
					['小类', 'quotationSmallCategory'],
					['单位', 'measurementUnit'],
					['工种', 'workType'],
					['说明','quotationItemDes'],
					['单价', 'unitPrice'],
					['版本', 'version'],
                    ['是否打折', 'discount'],
                    ['启用/禁用', 'status'],
				],
				list: res.paging.data,
			},function(v){
                v.discount = v.discount == 0 ? '不打折':'打折';
                v.status = v.status == 0 ? '禁用' : '启用';
            });
		});
    });

    //编辑按钮
    function edit(b) {

        quotationItem.editFlg = !0;
        quotationItem.quotationItemItems.qiId.val(b.qiId);
        quotationItem.quotationItemItems.itemId.val(b.itemId);
        quotationItem.quotationItemItems.itemName.val(b.itemName);
        quotationItem.quotationItemItems.quotationType.val(b.quotationTypeId);
        quotationItem.quotationItemItems.quotationClassification.val(b.quotationClassificationId);
        quotationItem.quotationItemItems.quotationBigCategory.val(b.quotationBigCategoryId);
        quotationItem.quotationItemItems.quotationSmallCategory.val(b.quotationSmallCategoryId);
        quotationItem.quotationItemItems.workType.val(b.workTypeId);
        quotationItem.quotationItemItems.measurementUnit.val(b.measurementUnitId);
        quotationItem.quotationItemItems.quotationItemDes.val(b.quotationItemDes);
        quotationItem.quotationItemItems.unitPrice.val(b.unitPrice);
        quotationItem.quotationItemItems.version.val(b.versionId);
        quotationItem.quotationItemItems.itemId.prop("disabled", !0);
        quotationItem.quotationItemItems.version.prop("disabled", !0);
        quotationItem.modal.modal("show");
    }

    //保存
    function saveData() {



        if (quotationItem.quotationItemItems.unitPrice.val().indexOf(".") != -1){
            if (quotationItem.quotationItemItems.unitPrice.val().substring(0, quotationItem.quotationItemItems.unitPrice.val().indexOf(".")).length > 7) {
                bootbox.alert("输入金额过长");
                return;
            }
        }else{
            if (quotationItem.quotationItemItems.unitPrice.val().length > 7) {
                bootbox.alert("输入金额过长");
                return;
            }
        }

        var _quotationType = com.focusPage('#quotationType').val() == 0 || com.focusPage('#quotationType').val() == '0';
        var _quotationBigCategory = com.focusPage('#quotationBigCategory').val() == 0 || com.focusPage('#quotationBigCategory').val() == '0';
        var _quotationSmallCategory = com.focusPage('#quotationSmallCategory').val() == 0 || com.focusPage('#quotationSmallCategory').val() == '0';
        if(_quotationType || _quotationBigCategory || _quotationSmallCategory){
            bootbox.alert("请选择类型以及大类小类");
            return;
        }
        if (!com.validate() && !quotationItem.repeatFlg) {
            var a, c = {
                "quotationItem.itemId": quotationItem.quotationItemItems.itemId.val(),
                "quotationItem.itemName": quotationItem.quotationItemItems.itemName.val(),
                "quotationItem.quotationTypeId": quotationItem.quotationItemItems.quotationType.val(),
                "quotationItem.quotationType": "",
                "quotationItem.quotationClassificationId": quotationItem.quotationItemItems.quotationClassification.val(),
                "quotationItem.quotationClassification": "",
                "quotationItem.quotationBigCategoryId": quotationItem.quotationItemItems.quotationBigCategory.val(),
                "quotationItem.quotationBigCategory": "",
                "quotationItem.quotationSmallCategoryId": quotationItem.quotationItemItems.quotationSmallCategory.val(),
                "quotationItem.quotationSmallCategory": "",
                "quotationItem.measurementUnitId": quotationItem.quotationItemItems.measurementUnit.val(),
                "quotationItem.measurementUnit": "",
                "quotationItem.workTypeId": quotationItem.quotationItemItems.workType.val(),
                "quotationItem.workType": "",
                "quotationItem.quotationItemDes": quotationItem.quotationItemItems.quotationItemDes.val(),
                "quotationItem.unitPrice": quotationItem.quotationItemItems.unitPrice.val()
            };
            quotationItem.editFlg ? (a = api.quotation.updateQuotationItem, c["quotationItem.versionId"] = quotationItem.quotationItemItems.version.val(), c["quotationItem.version"] = "", c["quotationItem.qiId"] = quotationItem.quotationItemItems.qiId.val()) : (c["quotationItem.versionId"] = quotationItem.quotationItemItems.version.val(), c["quotationItem.version"] = "", a = api.quotation.addQuotationItem);
            com.post(a, c, successCallback, failCallback);
            quotationItem.modal.modal("hide");
        }
    }

    //启用禁用功能
    function updateStatus(id, status, failcallBack) {

        com.post(api.quotation.updateQuotationItemForStatus, {
            "quotationItem.qiId": id,
            "quotationItem.status": status
        }, function () {

        }, function () {
            failcallBack && failcallBack();
        });
    }


    //是否打折设置
    function updateDiscount(id, discount, failcallBack) {

        com.post( api.quotation.updateQuotationItemForDiscount, {
            "quotationItem.qiId": id,
            "quotationItem.discount": discount
        }, function () {

        }, function () {
            failcallBack && failcallBack();
        });
    }

    function successCallback() {
        com.showAlert(com.info, "\u64cd\u4f5c\u6210\u529f");
        quotationItemSeacher.doSearch();
        //com.focusPage('#condList button').click();
    };

    function failCallback() {}

});
