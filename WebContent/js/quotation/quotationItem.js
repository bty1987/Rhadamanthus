$(function(){

    var quotationItem = {
            
        saveBtn: com.focusPage("#saveBtn"),
        cancelBtn: com.focusPage("#cancelBtn"),
        
        modals: {
            quotationItemModal: com.focusPage("#quotationItemModal"),
            selectItemModal: com.focusPage("#selectItemModal"),
        },
        
        items: {
            qiid: com.focusPage("#qiid"),
            no: com.focusPage("#no").prop("placeholder", "格式: (QI_00001)"),
            name: com.focusPage("#name"),
            version: com.focusPage("#version"),
            quotationType: com.focusPage("#quotationType"),
            quotationClassification: com.focusPage("#quotationClassification"),
            quotationBigCategory: com.focusPage("#quotationBigCategory"),
            quotationSmallCategory: com.focusPage("#quotationSmallCategory"),
            measurementUnit: com.focusPage("#measurementUnit"),
            workType: com.focusPage("#workType"),
            comment: com.focusPage("#comment"),
            unitPrice: com.focusPage("#unitPrice"),
            addPrice: com.focusPage("#addPrice"),
            subPrice: com.focusPage("#subPrice"),
        },
        
        editFlag: false,
        repeatFlg: false,
        
        args: {
            qiid: null,
        },
        
        validator: {
            region: {
                type: "v_quotation_no",
                regex: /^QI_\d{5}$/,
                errorMsg: "请以QI_作为前缀 , 之后以五个位数字组成(如QI_00001)."
            }
        }
    };

    var quotation = {
        pageType: params['urlLoadParams'].type
    };

    $.extend(com.validator, quotationItem.validator);

    com.post(api.quotation.queryQuotationType, {}, function(a) {
        quotationItem.items.quotationType.bindData(a.quotationTypes, "id", "name");
        quotationItem.items.quotationType.prepend("<option value='0' selected='selected'>请选择</option>");
    }, null, false);
    
    com.post(api.quotation.queryQuotationClassification, {}, function(a) {
        quotationItem.items.quotationClassification.bindData(a.quotationClassifications, "id", "name");
    });
    
    com.post(api.common.queryMeasurementUnit, {}, function(a) {
        quotationItem.items.measurementUnit.bindData(a.measurementUnits, "id", "name");
    });
    
    com.post(api.common.queryWorkType, {}, function(a) {
        quotationItem.items.workType.bindData(a.workTypes, "id", "name");
    });
    
    com.post(api.quotation.queryQuotationVersion, {}, function(a) {
        quotationItem.items.version.bindData(a.quotationVersions, "no", "name");
    });

    quotationItem.items.no.on("blur", function () {
        checkItemName();
    });

    quotationItem.items.version.on("change", function () {
        checkItemName();
    });

    quotationItem.items.quotationType.change(function() {
        
        var quotationType = $(this).val();
        
        if (quotationType != 2) {
            quotationItem.items.unitPrice.removeAttr('readonly').val('');
        }
        
        if (quotationType == false) {
            openModal();
            return false;
        } else {
            queryQuotationBigCategory(quotationType);
            queryQuotationSmallCategory(quotationType);
        }

    });

    quotationItem.modals.quotationItemModal.on('hide.bs.modal', function() {
        com.clearValidator();
        com.clearValidator("no", true);
        com.cleanItems(quotationItem.items);
    });

    quotationItem.saveBtn.bindClick(saveData);

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ,用来显示的div的id
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnCopySoods = $('<a></a>').addClass('btn btn-minier btn-pink').html('选材复制');
            var $btnSelection = $('<a></a>').addClass('btn btn-minier btn-success').html('选材');
            var $btnNormood = $('<a></a>').addClass('btn btn-minier btn-warning').html('定额材料');
            var $btnNormrice = $('<a></a>').addClass('btn btn-minier btn-inverse').html('定额工费');

            //启用禁用
            var $btnStatus = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
            var $span = $('<span></span>').addClass('lbl status-lbl');
            
            //是否打折
            var $btnDiscount = $('<div></div>').addClass('pull-right');
            var $discountSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
            var $dspan = $('<span></span>').addClass('lbl discount-lbl');
            
            var no = v.version.offset == 0 ? "-" : "QI_" + (Array(5).join('0') + (v.qiid - v.version.offset)).slice(-5);
            
            var propertyArr = [
                ["编号: ", no, "grey"],
                ["类型: ", v.category.name, "red"],
                ["分类: ", v.classification.name, "red"],
                ["大类: ", v.bigCategory.name, "red"],
                ["小类: ", v.smallCategory.name, "red"],
                ["单位: ", v.unit.name, "red"],
                ["工种: ", v.workType.name, "red"],
                ["增补价 :", v.addPrice,"blue"],
                ["单价: ", v.unitPrice, "blue"],
                ["退减价: ", v.subPrice,"blue"],
                ["版本: ", v.version.name, "grey"],
                ["说明: ", v.comment, "grey"],
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $btnStatus.append($statusSwitch).append($span);
            $btnDiscount.append($discountSwitch).append($dspan);

            switch (quotation.pageType) {
                case "selection":
                    $divBtnWrap.append($btnSelection).append($btnCopySoods).appendTo($h3);
                    break;
                case "norm":
                    $divBtnWrap.append($btnNormrice).append($btnNormood).appendTo($h3);
                    break;
                default :
                    $divBtnWrap.append($btnNormrice).append($btnNormood).append($btnSelection).append($btnEdit).append($btnDiscount).append($btnStatus).appendTo($h3);
            }

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function(){
                queryQuotationBigCategory(v.qtid);
                queryQuotationSmallCategory(v.qtid);
                edit(v);
            });
            
            $btnCopySoods.click(function(){
                quotationItem.modals.selectItemModal.modal("show");
                initQuotationItemList(v.version.no);
                
                quotationItem.args.qiid = v.qiid;
            });

            $btnSelection.click(function(){
                params["qiid"] = v.qiid;
                params["quotationItem"] = v;
                com.popup4page("#createSoodsPopUp", "/views/data/soods2create.html", "添加选材");
            });

            $btnNormood.click(function(){
                params["qiid"] = v.qiid;
                com.popup4page("#normoodPopUp", "/views/data/normood.html", "定额材料");
            });

            $btnNormrice.click(function(){
                params["qiid"] = v.qiid;
                com.popup4page("#normricePopUp", "/views/data/normrice.html", "定额工费");
            });

            !v.status && $statusSwitch.prop("checked", true);
            $statusSwitch.switchBtn("status-lbl").on("click",function() {
                $statusSwitch.prop("checked") ? (updateStatus(v.qiid, 0, function(){$statusSwitch.removeAttr("checked");})) : (updateStatus(v.qiid, 1,function(){$statusSwitch.prop("checked");}));
            });

            v.discount && $discountSwitch.prop("checked", true);
            $discountSwitch.switchBtn("discount-lbl").on("click",function() {
                $discountSwitch.prop("checked") ? (updateDiscount(v.qiid, 1, function(){$discountSwitch.removeAttr("checked");})) : (updateDiscount(v.qiid, 0,function(){$discountSwitch.prop("checked");}));
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

    var _condArr = ['data-quotation-item-name', 'data-quotation-item-type', 'data-quotation-item-classification', 'data-quotation-item-bigcategory', 'data-quotation-item-smallcategory', 'data-quotation-version'];
    var quotationItemSeacher = new Searcher();
    quotationItemSeacher.init( _condArr, "condList", api.quotation.pageQuotationItem,  function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "quotationItemPostData", null, false, null, function() {
        if (quotation.pageType == "selection") return false;

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

    //添加按钮
    com.focusPage('a[name="add"]', '#pagenation').click(function () {
        quotationItem.editFlg = false;

        quotationItem.items.no.prop("disabled", false);
        quotationItem.items.version.prop("disabled", false);

        quotationItem.modals.quotationItemModal.modal("show");
    });

    //导入按钮
    com.focusPage('a[name="import"]').on("click", function () {
        com.focusPage('#importModal').modal("show");
    });
    
    com.uploadify("#import", "上传文件", api.quotation.importQuotationItem, 'btn btn-success col-sm-12', "*.xls;*.xlsx;", {'uploadType': 4}, 1, function(data){
        quotationItemSeacher.doSearch();
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
                    ['编号', 'no'],
                    ['名称', 'name'],
                    ['版本', 'version.name'],
                    ['类型', 'category.name'],
                    ['分类', 'classification.name'],
                    ['大类', 'bigCategory.name'],
                    ['小类', 'smallCategory.name'],
                    ['单位', 'unit.name'],
                    ['工种', 'workType.name'],
                    ['增补价', 'addPrice'],
                    ['单价', 'unitPrice'],
                    ['退减价', 'subPrice'],
                    ['是否打折', 'discount'],
                    ['启用/禁用', 'status'],
                    ['说明', 'comment'],
                ],
                list: res.paging.data,
            },function(v){
                v.discount = v.discount == 0 ? '不打折' : '打折';
                v.status = v.status == 0 ? '启用' : '禁用';
            });
        });
    });

    //编辑按钮
    function edit(b) {
        
        quotationItem.editFlg = true;
        
        quotationItem.items.qiid.val(b.qiid);
        quotationItem.items.no.val(b.no);
        quotationItem.items.name.val(b.name);
        
        quotationItem.items.version.val(b.version.no);
        quotationItem.items.quotationType.val(b.category.id);
        quotationItem.items.quotationClassification.val(b.classification.id);
        quotationItem.items.quotationBigCategory.val(b.bigCategory.id);
        quotationItem.items.quotationSmallCategory.val(b.smallCategory.id);
        quotationItem.items.workType.val(b.workType.id);
        quotationItem.items.measurementUnit.val(b.unit.id);
        
        quotationItem.items.unitPrice.val(b.unitPrice);
        quotationItem.items.addPrice.val(b.addPrice);
        quotationItem.items.subPrice.val(b.subPrice);
        quotationItem.items.no.prop("disabled", true);
        quotationItem.items.version.prop("disabled", true);
        quotationItem.items.comment.val(b.comment);
        
        quotationItem.modals.quotationItemModal.modal("show");
    }

    //保存
    function saveData() {

        var _quotationType = quotationItem.items.quotationType.val() == false;
        var _quotationBigCategory = quotationItem.items.quotationBigCategory.val() == false;
        var _quotationSmallCategory = quotationItem.items.quotationSmallCategory.val() == false;
        if(_quotationType || _quotationBigCategory || _quotationSmallCategory) {
            com.showAlert(com.warning, "请选择类型以及大类小类");
            return;
        }

        if (!com.validate("quotationItemModal") && !quotationItem.repeatFlg) {

            var unitPrice = quotationItem.items.unitPrice.val();

            if (unitPrice.indexOf(".") != -1){
                if (unitPrice.substring(0, unitPrice.indexOf(".")).length > 7) {
                    com.showAlert(com.warning, "输入金额过长");
                    return false;
                }
            } else {
                if (unitPrice.length > 7) {
                    com.showAlert(com.warning, "输入金额过长");
                    return false;
                }
            }

            var url, option = {
                "quotationItem.no": quotationItem.items.no.val(),
                "quotationItem.name": quotationItem.items.name.val(),
                
                "quotationItem.version.no": quotationItem.items.version.val(),
                
                "quotationItem.category.id": quotationItem.items.quotationType.val(),
                "quotationItem.classification.id": quotationItem.items.quotationClassification.val(),
                "quotationItem.bigCategory.id": quotationItem.items.quotationBigCategory.val(),
                "quotationItem.smallCategory.id": quotationItem.items.quotationSmallCategory.val(),
                "quotationItem.unit.id": quotationItem.items.measurementUnit.val(),
                "quotationItem.workType.id": quotationItem.items.workType.val(),
                
                "quotationItem.unitPrice": quotationItem.items.unitPrice.val(),
                "quotationItem.addPrice": quotationItem.items.addPrice.val(),
                "quotationItem.subPrice": quotationItem.items.subPrice.val(),
                
                "quotationItem.comment": quotationItem.items.comment.val(),

            };

            if (quotationItem.editFlg) {
                url = api.quotation.updateQuotationItem;
                option["quotationItem.qiid"] = quotationItem.items.qiid.val();
            } else {
                url = api.quotation.addQuotationItem;
            }

            com.post(url, option, function(res) {
                com.showAlert(com.info, "保存成功");
                quotationItemSeacher.doSearch();
                quotationItem.modals.quotationItemModal.modal("hide");
            }, null, false);
        }
    };

    //启用禁用功能
    function updateStatus(id, status, failcallBack) {

        com.post(api.quotation.updateQuotationItemForStatus, {
            "quotationItem.qiid": id,
            "quotationItem.status": status
        });
    };

    //是否打折设置
    function updateDiscount(id, discount, failcallBack) {

        com.post(api.quotation.updateQuotationItemForDiscount, {
            "quotationItem.qiid": id,
            "quotationItem.discount": discount
        });
    };

    function queryQuotationBigCategory(quotationType){
        com.post(api.quotation.queryQuotationBigCategory, {"quotationBigCategory.qtid":quotationType}, function(a) {
            quotationItem.items.quotationBigCategory.bindData(a.quotationBigCategorys, "id", "name");
            quotationItem.items.quotationBigCategory.prepend("<option value='0' selected='selected'>请选择类型</option>");
        }, null, false);
    };

    function queryQuotationSmallCategory(quotationType){
        com.post(api.quotation.queryQuotationSmallCategory, {"quotationSmallCategory.qtid":quotationType}, function(a) {
            quotationItem.items.quotationSmallCategory.bindData(a.quotationSmallCategorys, "id", "name");
            quotationItem.items.quotationSmallCategory.prepend("<option value='0' selected='selected'>请选择类型</option>");
        }, null, false);
    };

    function openModal(){
        quotationItem.items.quotationBigCategory.html('');
        quotationItem.items.quotationSmallCategory.html('');
        quotationItem.items.quotationBigCategory.prepend("<option value='0' selected='selected'>请选择类型</option>");
        quotationItem.items.quotationSmallCategory.prepend("<option value='0' selected='selected'>请选择类型</option>");
        quotationItem.items.unitPrice.removeAttr('readonly').val('');
    };

    function checkItemName () {
        
        var no = quotationItem.items.no.val();
        var version = quotationItem.items.version.val();

        if (no != "") {
            var option = {
                "quotationItem.no": no,
                "quotationItem.version.id": version,
            };
            com.post(api.quotation.queryQuotationItemByItemIdAVersionId, option, function(res) {
                if (res.quotationItem && res.quotationItem.qiid) {
                    com.showTips(quotationItem.items.no, "该版本的项目编号已存在", true);
                    quotationItem.repeatFlg = true;
                } else {
                    com.clearValidator("#no", true);
                    quotationItem.repeatFlg = false;
                }
            });
        }
    };
    
    function initQuotationItemList(versionId) {

        var extraParams = {"quotationItem.version.no": versionId} ;

        var quoDisplayFunc = (function(){

            var renderList = function(tableId,listData){
                var $tableWrap = com.focusPage('#' + tableId);
                var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

                if(listData && listData.length){
                    $.each(listData,function(i, v){
                        creatLine(v).appendTo($ul);
                    });

                    $ul.appendTo($tableWrap);
                }
            };

            var creatLine = function(v){
                var $liLine = $('<li></li>').addClass('item-blue clearfix');
                var $h3 = $('<h3></h3>').addClass('oid').css({"margin-bottom" : 0});

                var $label = $('<label></label>');
                var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.name);

                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
                
                var $btnCopy = $('<a></a>').addClass('btn btn-minier btn-yellow').html('复制');

                var propertyArr = [
                    ["类型: ", v.category.name, "red"],
                    ["分类: ", v.classification.name, "red"],
                    ["大类: ", v.bigCategory.name, "red"],
                    ["小类: ", v.smallCategory.name, "red"],
                    ["单位: ", v.unit.name, "red"],
                    ["工种: ", v.workType.name, "red"],
                    ["单价: ", v.unitPrice, "blue"],
                    ["版本: ", v.version.name, "grey"],
                ];

                $.each(propertyArr, function (index,value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });
                
                $divBtnWrap.append($btnCopy).appendTo($h3);

                $label.append($span).appendTo($h3);
                $liLine.append($h3).append($ulProperty);
                
                $btnCopy.click(function(){
                    
                    var options = {
                        "soods.quotationItem.qiid": quotationItem.args.qiid,
                        "soods.qiid": v.qiid
                    }
                    
                    com.post(api.data.copySoods, options, function(res){
                        quotationItem.modals.selectItemModal.modal("hide");
                    });
                });

                return $liLine;
            };

            return {
                init: function(tableId,listData){
                    com.focusPage('#' + tableId).html(null);
                    renderList(tableId,listData);
                },
                drawLine: function(v){
                    return creatLine(v);
                }
            };
        })();

        var condArr = ['data-quotation-item-name', 'data-quotation-item-bigcategory', 'data-quotation-item-smallcategory', 'quotation-worktype'];

        var quotationSeacher = new Searcher();

        quotationSeacher.init(condArr, "quoCondList", api.quotation.pageQuotationItemByVersionId, function(data){
            quoDisplayFunc.init('quoResultList', data);
        }, "quoPagenation", "quotationFuncAreaPostData", extraParams);
        
        quotationSeacher.base("quoCondList", "quoPagenation", "quoResultList", api.quotation.pageQuotationItemByVersionId)
    }
});
