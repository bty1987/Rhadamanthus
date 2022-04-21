
var ExtensionDetail = (function(){

    var extensionDetail = {

        orderId: null, // 装修单号
        versionId: null, // 报价版本
        discount: 10,

        qid : null, // 订单的默认报价编号
        eid : null, // 增减项编号
        basicParams : {
            "extension.eid": null,
            "extension.orderId": null,
            "extension.undisPrice" : 0,
            "extension.disPrice" : 0,
            "extension.total" : 0,
            
            "extensionItem.eid": null,
        },
        
        sumLabType: com.focusPage("#sumLabType"),
        undisPrice: com.focusPage("#undisPrice"),
        disPrice: com.focusPage("#disPrice"),
        discounts: com.focusPage("#discount"),
        sumLabSumMoney: com.focusPage("#sumLabSumMoney"),
        
        $modals : {},
        $btnItems : {},
        initModals : function(){
            var that = this;
            that.$modals = {
                // 普通报价项弹窗
                addNormalItemModal : com.focusPage('#addNormalItemModal').on("show.bs.modal", function(a) {
                    $('input[name="modalQuots"]:checked').removeAttr('checked');
                }),
                addQuotaionItemModal : com.focusPage('#addQuotaionItemModal').on("show.bs.modal", function(a) {
                    $('input[name="modalQuots"]:checked').removeAttr('checked');
                }),
                // 自定义添加
                addItemModal : com.focusPage("#addItemModal").on("show.bs.modal",function(){
                    com.focusPage("#itemName").val("");
                    com.focusPage("#quotationItemDes").val("");
                    com.focusPage("#unitPrice").val("");
                    com.focusPage("#num").val("");
                    com.focusPage("#measurementUnit").get(0).selectedIndex = 0;
                    com.focusPage("#workType").get(0).selectedIndex = 0;
                }),
                // 功能区选择弹层
                functionAreaModal : com.focusPage("#functionAreaModal")
            };

            // 普通报价项弹出层
            var extraParams  = {"quotationItem.version.no": extensionDetail.versionId};
            var _condArrn = ['data-quotation-item-name', 'data-quotation-item-bigcategory', 'data-quotation-item-smallcategory', 'quotation-worktype'];
            var normalItemSeacher = new Searcher();
            normalItemSeacher.init( _condArrn, "condListn", api.quotation.pageQuotationItemByVersionId,  function(data){
                var $tableWrap = com.focusPage('#resultListn').empty();
                var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

                if(data && data.length){
                    $.each(data,function(i, v){
                        v.measurementUnit = v.unit.name;
                        v.workType = v.workType.name;
                        v.quotationItemDes = v.comment;
                        painter.createQuoteModalItem(v, "qiid", "name").appendTo($ul);
                    });
                    $ul.appendTo($tableWrap);
                }
            }, "pagenationn", "addNormalItemModalPostDatan", extraParams);
            // 初始化自定义报价中的类型
            com.post(api.quotation.queryQuotationType, {},function(res) {
                com.focusPage("#quotationType").bindData(res.quotationTypes,"id", "name");
            });
            // 新增报价项select初始化
            // 单位
            com.post(api.common.queryMeasurementUnit,{},function(res){
                com.focusPage("#measurementUnit").bindData(res.measurementUnits, "name", "name");
            });
            // 工种
            com.post(api.common.queryWorkType, {}, function(res){
                com.focusPage("#workType").bindData(res.workTypes, "name", "name");
            });

            // 功能区选择弹出层 todo
            if(that.qid != null){
                com.post(api.quotation.queryQuotationFunctionAreaForCommonByQuotationId, {"quotation.qid": that.qid}, function(res){

                    com.focusPage("#addQuotationFunctionAreaId").bindData(res.quotationFunctionAreas, "qfaId", "functionAreaName");
                    com.focusPage("#quotationFunctionAreaId").bindData(res.quotationFunctionAreas, "qfaId", "functionAreaName");
                });
            }else{
                com.showAlert(com.error, "该订单没有默认报价");
            }

        },
        initBtnItems : function(){
            var that = this;

            that.$btnItems = {
                // 选择普通报价项按钮点击(增项)
                addNormalItemBtn : com.focusPage('#addNormalItemBtn').on('click', function(){
                    modalEventBinding.showingModalName = "addNormalItemModal";
                    that.$modals.functionAreaModal.modal("show");
                }),
              // 选择普通报价项按钮点击(增项)
                addQuotaionItemBtn : com.focusPage('#addQuotaionItemBtn').on('click', function(){
                    modalEventBinding.showingModalName = "addQuotaionItemModal";
                    that.$modals.functionAreaModal.modal("show");
                }),
                // 新增(增项)
                addNewItemBtn : com.focusPage('#addNewItemBtn').on('click', function(event){
                    event.stopPropagation();
                    com.clearValidator();
                    that.$modals.addItemModal.modal("show");
                }),
                submitAddReduceDetailOKBtn : com.focusPage('#submitAddReduceDetailOKBtn').on('click', function(event){
                    
                    com.post( api.quotation.updateExtensionForAdvance, extensionDetail.basicParams, function(){
                        com.showAlert(com.info, '提交成功');
                    }, null, false);

                }),// 提交
// saveAddReduceDetailBtn : com.focusPage('#saveAddReduceDetailBtn').on('click', function(event){
// //com.post( api.addReduce.updateAddReduceForAdvance, {'addReduce.arId' : addReduceDetail.arid, 'addReduce.total' : addReduceDetail.basicParams['addReduce.total']}, function(){
// com.post( api.addReduce.updateAddReduceItem, {'addReduce.arId' : addReduceDetail.arid, 'addReduce.total' : addReduceDetail.basicParams['addReduce.total']}, function(){
// com.showAlert(com.info, '保存成功');
// }, null, false);
// }),//保存
                detailBckBtn : com.focusPage('#detailBckBtn').on('click', function(){// 返回
                    com.switchPage(api.index.extensionIndex.url);
                })
            };
        },
        init : function(){
            this.initModals();
            this.initBtnItems();
        }
    };

    var arCalculator = {
        total : 0,// 总金额
        changeQuoFee : function($quote){
            
            var _unitPrice = parseFloat($quote.find('.unitprice .cell-wrap').text());
            var _num = parseFloat($quote.find('.num .cell-wrap').text());
            
            var _total = utils.changeThrDecimal(utils.accMul(_unitPrice, _num));
            
            $quote.find('.totalprice-discount .cell-wrap').text(_total);
            $quote.attr('data-totalprice', _total);
        },
        calculateArFees : function(){
            var $arr = $('.fl-quo-item:not([data-del-flag="1"])', '#addReduceItemDiv');
            var undisPrice = 0, disPrice = 0, total = 0;
            
            if($arr.length){
                $arr.each(function(i, e){
                    
                    var $this = $(e);
                    
                    var _unitPrice = parseFloat($this.find('.unitprice .cell-wrap').text());
                    var _num = parseFloat($this.find('.num .cell-wrap').text());
                    
                    var _discount = parseInt($this.find(".discountprice").attr("data-discount"));
                    
                    var _total = utils.accMul(_unitPrice, _num);
                    
                    undisPrice = utils.accAdd(undisPrice, _discount == 0 ? _total : 0);
                    disPrice = utils.accAdd(disPrice, _discount == 1 ? _total : 0);
   
                    total = utils.accAdd(total, utils.accMul(_discount == 1 ? extensionDetail.discount : 1, _total));
                });
            }
            
            undisPrice = utils.changeThrDecimal(undisPrice);
            disPrice = utils.changeThrDecimal(disPrice);
            total = utils.changeThrDecimal(total);
            
            extensionDetail.undisPrice.text(undisPrice);
            extensionDetail.disPrice.text(disPrice);
            extensionDetail.sumLabSumMoney.text(total);
            
            extensionDetail.basicParams['extension.undisPrice'] = undisPrice;
            extensionDetail.basicParams['extension.disPrice'] = disPrice;
            extensionDetail.basicParams['extension.total'] = total;
        }
    };
    // 弹层确定按钮事件绑定
    var modalEventBinding = {

        functionAreaId : null,
        functionAreaName : null,


        // 功能区选择弹层确认按钮
        functionAreaModalConfirm : function(){
            var that = this;
            com.focusPage('#confirmItemBtn').off().on('click', function(){
                
                if(com.validate("functionAreaModal")) return false;
                
                var funcid = com.focusPage('#quotationFunctionAreaId').val();
                that.functionAreaId = funcid;
                that.functionAreaName = com.focusPage('#quotationFunctionAreaId').find('option:selected').text();
                
                if(that.showingModalName == "addQuotaionItemModal"){
                    
                    var _params = {
                        "quotationFunctionAreaItem.quotationFunctionAreaId" : funcid
                    };
                    com.post(api.quotation.queryQuotationFunctionAreaItemByQuotationFunctionAreaId, _params, function(res){
                        var $tableWrap = com.focusPage('#quateList', extensionDetail.$modals.quotationItemModal).empty();
                        var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
                        if(res.quotationFunctionAreaItems && res.quotationFunctionAreaItems.length){
                            $.each(res.quotationFunctionAreaItems,function(i, v){
                                v.quotationItemDes = v.content;
                                v.type = 4;
                                painter.createQuoteModalItem(v, "qfaiId", "itemName").appendTo($ul);
                            });
                            $ul.appendTo($tableWrap);
                        }
                    }, null, false);
                }

                extensionDetail.$modals.functionAreaModal.modal('hide');
                extensionDetail.$modals[that.showingModalName].modal("show");
            });
        },
        // 0: 数据报价项(增项) , 1: 自定义(增项) , 2: 数据报价项(减项) , 3: 自定义(减项) , 4: 报价中项(减项)
        // 普通报价项确认按钮点击
        addNormalItemModalConfirm : function(){
            com.focusPage('#saveaddNormalItemBtn').off().on('click', function(){
                quote.addQuotesFromModal(extensionDetail.type == 0 ? 0 : 2);
                extensionDetail.$modals.addNormalItemModal.modal('hide');
            });
        },
        addQuotationItemModalConfirm : function(){
            com.focusPage('#saveQuoteItemBtn').off().on('click', function(){
                quote.addQuotesFromModal(4);
                extensionDetail.$modals.addQuotaionItemModal.modal('hide');
            });
        },
        // 自定义报价项确认按钮点击
        addItemModalConfirm : function(){
            com.focusPage("#saveAddItemBtn").on('click', function(event){
                if(com.validate("addItemModal")) return;

                var addRow = {
                    "num" : com.focusPage("#num").val(),// 工程预算量
                    "itemName" : com.focusPage("#itemName").val(),// 名称
                    "quotationFunctionAreaId" : com.focusPage("#quotationFunctionAreaId").val(),// 功能区
                    "quotationFunctionAreaName" : com.focusPage("#addQuotationFunctionAreaId").find('option:selected').text(),
                    "measurementUnit" : com.focusPage("#measurementUnit").val(),// 单位
                    "unitPrice" : com.focusPage("#unitPrice").val(),// 单价(折后单价、总价为计算值)
                    "workType" : com.focusPage("#workType").val(),// 工种
                    "content" : com.focusPage("#quotationItemDes").val(),// 工艺说明
                    "subtype" : com.focusPage("#quotationType").val(),
                    "type" : extensionDetail.type == 0 ? 1 : 3,// 类型(隐藏属性)
                    "discount" : 0
                };

                var args = {
                    "extensionItem.itemName" : addRow.itemName, // 项目名
                    "extensionItem.measurementUnit" : addRow.measurementUnit, // 单位
                    "extensionItem.workType" : addRow.workType, // 工种
                    "extensionItem.addPrice" : addRow.unitPrice, // 增补价
                    "extensionItem.unitPrice" : addRow.unitPrice, // 单价
                    "extensionItem.subPrice" : addRow.unitPrice, // 退减价
                    "extensionItem.subtype" : addRow.subtype, // 类型
                    "extensionItem.type" : addRow.type,
                    "extensionItem.num" : addRow.num, // 工程量 ;
                    "extensionItem.quotationFunctionAreaId" : addRow.quotationFunctionAreaId, // 所属功能区Id ;
                    "extensionItem.quotationFunctionAreaName" : com.focusPage("#quotationFunctionAreaId").find('option:selected').text(),// 所属功能区name ;
                    "extensionItem.content" : addRow.content,
                    "quotationFunctionAreaItem.content" : addRow.content
                };
                var _index = $('.fl-quo-item', '#addReduceItemDiv').length;
                var $item = painter.createQuote(_index + 1, addRow).appendTo(com.focusPage('#addReduceItemDiv > ul'));
                
                arCalculator.changeQuoFee($item);
                arCalculator.calculateArFees();
                
                var _params = $.extend(true, {}, extensionDetail.basicParams, args);

                com.post(api.quotation.updateExtensionItem, _params, function(res){
                    $item.find('input[name="eiid"]').val(res.extensionItem.eiid);
                }, null, false);

                extensionDetail.$modals.addItemModal.modal("hide");
            });
        },

        init : function(){
            this.functionAreaModalConfirm();
            this.addNormalItemModalConfirm();
            this.addQuotationItemModalConfirm();
            this.addItemModalConfirm();
        }
    };

    // 报价项操作
    var quote = {

        quotesRecord  : [],
        $nowLine : null,
        $nowEditInput : null,
        // 排序报价项
        sortQuote : function(){
            var $arr = com.focusPage('.fl-quo-item', '#addReduceItemDiv');
            if(!$arr){
                return
            }
            $arr.each(function(){
                $this = $(this);
                $this.find('.line .cell-wrap').text($this.index() + 1);
            });
        },
        /**
         * 添加报价项的时候记住上一页选中的报价项 参数 $input : 正在操作的input标签 ischecked : 选举中或取消选中
         */
        recordQuots : function($input, ischecked){
            var that = this;
            if(ischecked){
                that.quotesRecord[that.quotesRecord.length] = $input;// 据说这样比push快
            }else{
                that.quotesRecord = $.map(that.quotesRecord, function(v){
                    return v.val() != $input.val() ? v : null;
                });
            }
        },

        /**
         * 添加弹窗中的报价项到增减项报价项区域
         */
        addQuotesFromModal : function(type){
            var that = this;
            var $arwrap = com.focusPage('#addReduceItemDiv');
            var _arrs = that.quotesRecord;
            var _index = $arwrap.find('.fl-quo-item').length;
            if(!_arrs.length){
                return;
            }

            $.each(_arrs, function(i, v){
                var $this = $(v);
                var $li = $this.parents('.fl-table-list > li');


                if($this.val() && com.focusPage('input[data-qiid="' + $this.val() +'"]', '#addReduceItemDiv').length){
                    return;
                }

                var addPrice = parseFloat($li.find("li .addPrice").text() ? $li.find("li .addPrice").text() : 0);
                var unitPrice = parseFloat($li.find("li .unitPrice").text() ? $li.find("li .unitPrice").text() : 0);
                var subPrice = parseFloat($li.find("li .subPrice").text() ? $li.find("li .subPrice").text() : 0);
                
                var discount = $this.attr('data-discount-flag')
                
                if (extensionDetail.type == 0){ // 增项,增补价
                    unitPrice = addPrice;
                    subPrice = addPrice;
                    discount = 0;
                }else if(extensionDetail.type == 1){ // 减项,退减价
                    unitPrice = subPrice;
                    discount = 1;
                }

                var subtype = type < 4 ? $this.attr("data-quotationType") : $this.attr("data-subtype");

                var _quotval = {
                    "num" : 0,// 工程预算量
                    "itemName" : $li.find('.lbl').text(),// 名称
                    "quotationFunctionAreaId" : modalEventBinding.functionAreaId,// 功能区
                    "quotationFunctionAreaName" : modalEventBinding.functionAreaName,// 功能区
                    "quotationBigCategory" : $li.find("li .quotationBigCategory").text(),// 大类
                    "measurementUnit" : $li.find("li .measurementUnit").text(),// 单位
                    "addPrice" : addPrice,
                    "unitPrice" : unitPrice,
                    "subPrice" : subPrice,
                    "content" : $li.find("li .quotationItemDes").text(),// 工艺说明
                    "workType" : $li.find("li .workType").text(),// 工种
                    "type" : type,// 类型(隐藏属性)
                    "subtype" : subtype,
                    "eid" : "",// 增减项中报价项的id
                    "quoteItemId" : $this.val(),// id(隐藏属性)
                    "discount" : discount,
                    "quotationitemid" : $this.attr("data-quotationItemId"),
                };
                var $item = painter.createQuote( _index + i + 1, _quotval);
                $item.appendTo($arwrap.find('.fl-quo-list'));
            });
            quote.quotesRecord = [];
        },
        /* 选中报价项显示编辑input */
        getNumCellFocus : function($line){
            var that = this;
            var $numCell = $line.find('.cell.num');
            var $arwrap = com.focusPage('#addReduceItemDiv');
            var $editInput = that.$nowEditInput ? that.$nowEditInput : $arwrap.find('.fl-quo-input');
            com.focusPage('.fl-quo-item.current').removeClass('current');
            $line.addClass('current');
            $editInput.removeClass('hide').appendTo($numCell).find('input').val(null).focus();
            that.$nowLine = $line;
            that.$nowEditInput = $editInput;
            that.$nowEditInput.find('input').off('keydown').on("keydown",function (e) {
                var $input = $(this);
                that.bindInputKeydown($input.val(), e);
            });
        },
        bindInputKeydown : function(num, e){
            
            var that = this;
            var $line = null;
            
            if(e.keyCode == 13){
                
                if(com.validate("addReduceItemDiv")){
                    return false;
                }

                var oldmum = that.$nowLine.find('.cell.num .cell-wrap').text() ? that.$nowLine.find('.cell.num .cell-wrap').text() : '0';

                that.$nowLine.find('.cell.num .cell-wrap').text(num);
                $line = that.$nowLine.next('.fl-quo-item');

                var _type = that.$nowLine.find('.typedict').attr('data-type');

                var args = {
                    "extensionItem.eiid" : that.$nowLine.find('input[name="eiid"]').val(),// 增减项报价项Id , 新建无此参数;
                    "extensionItem.itemName" : that.$nowLine.find('.name .cell-wrap').text(),// 项目名;
                    "extensionItem.measurementUnit" : that.$nowLine.find('.unit .cell-wrap').text(),// 单位 ;
                    "extensionItem.workType" : that.$nowLine.find('.worktype .cell-wrap').text(),// 工种 ;
                    "extensionItem.addPrice" : that.$nowLine.attr('data-addPrice'), // 单价
                    "extensionItem.unitPrice" : that.$nowLine.find('.unitprice .cell-wrap').text(),// 单价
                    "extensionItem.subPrice" : that.$nowLine.attr('data-subPrice'), // 单价
                    "extensionItem.type" : _type,// 类型
                    "extensionItem.subtype" :that.$nowLine.find('.subtypedict').attr('data-subtype'),
                    "extensionItem.num" : that.$nowLine.find('.num .cell-wrap').text(),// 工程量 ;
                    "extensionItem.quotationFunctionAreaId" : that.$nowLine.find('.quotationFunctionArea').attr('data-quotationfunctionareaid'), // 所属功能区Id ;
                    "extensionItem.discount" : that.$nowLine.find('.discountprice').attr('data-discount') // 折扣
                };

                if(_type == 0||_type == 2){
                    args["extensionItem.quoteItemId"] = that.$nowLine.find('input[name="eiid"]').attr('data-quoteitemid');// , 报价项Id , 普通类型报价项需要传递 "data-qiid"
                }
                if(_type == 1||_type == 3){
                    args["extensionItem.content"] = that.$nowLine.prop('title');// , 报价项说明 , 自定义类型报价项需要传递 ;
                }
                if (_type == 4) {
                    args["extensionItem.quoteItemId"] = that.$nowLine.find('input[name="eiid"]').attr("data-quotationItemId")
                }

                arCalculator.changeQuoFee(that.$nowLine);
                arCalculator.calculateArFees();

                com.clearValidator();

                var _params = $.extend(true, {},extensionDetail.basicParams, args);
                com.post(api.quotation.updateExtensionItem, _params, function(res){
                    
                    that.$nowLine.find('input[name="eiid"]').val(res.extensionItem.eiid);
                    that.$nowLine.attr("data-eiid", res.extensionItem.eiid);

                    if($line.length){
                        that.getNumCellFocus($line);
                    }else{
                        that.hideInputWrap();
                    }
                }, function(res){
                    com.showAlert(com.error, res.errorMsg);
                    that.$nowLine.find('.cell.num .cell-wrap').text(oldmum);

                    arCalculator.changeQuoFee(that.$nowLine);
                    arCalculator.calculateArFees();

                    that.hideInputWrap();
                }, false);
                return;
            }

            if(e.keyCode == 38){
                $line = that.$nowLine.prev('.fl-quo-item');
                if($line.length){
                    that.getNumCellFocus($line);
                }else{
                    that.hideInputWrap();
                }
                return;
            }

            if(e.keyCode == 40 ){
                $line = that.$nowLine.next('.fl-quo-item');
                if($line.length){
                    that.getNumCellFocus($line);
                }else{
                    that.hideInputWrap();
                }
                return;
            }
        },
        hideInputWrap : function(){
            if(!this.$nowEditInput){
                return;
            }
            this.$nowEditInput.addClass('hide');
            this.$nowEditInput = null;
        },
        // 点击页面其他位置时清除表格行的选中样式
        clearQuoteSelected : function(){
            var that = this;
            $('body').click( function(e){
                if(!$(e.target).is('.cell-wrap') && !$(e.target).is('[data-action="collapse"]')){
                    that.hideInputWrap();
                }
            });
        },

        // 删除报价项
        deleteQuote : function($quote){
            
            var that = this;
            
            var _qid = $quote.attr("data-eiid");
            var $rqwrap = com.focusPage('#addReduceItemDiv');
            $rqwrap.find('.fl-quo-input').insertAfter($rqwrap.find('.fl-quo-list')).addClass('hide');
            
            var _params = {};
            
            if(!_qid){
                $quote.remove();
            }else{
                $quote.attr('data-del-flag',1);
                that.sortQuote();
                
                arCalculator.calculateArFees();
                
                var options = {
                    "extensionItem.eiid": _qid
                };
                
                com.post(api.quotation.deleteExtensionItem, $.extend({}, options, extensionDetail.basicParams), function(res){
                    $quote.remove();
                }, function(res){
                    com.showAlert(com.error, res.errorMsg);
                    $quote.removeAttr('data-del-flag');

                    arCalculator.calculateArFees();
                }, false);
            }
        },

        init : function(){
            this.clearQuoteSelected();
        }
    };

    var painter = {
        // 创建添加报价项弹窗中的报价项 .sdiId
        createQuoteModalItem : function(v, id, name){
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').css({"margin-bottom" : 0});
            var $label = $('<label></label>');
            var $input = $('<input>').attr({
                "type" : "checkbox",
                "name" : "modalQuots",
                "class" : "ace ace-checkbox-2",
                "data-discount-flag" : v.discount,
                "data-quotationType" : (v.category && v.category.id) ? v.category.id : v.subtype,
                "data-subtype" : v.subtype,
                "data-quotationItemId" : v.quotationItemId
                // 功能区
            }).val(v[id]);
            var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v[name]);

            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var propertyArr = [
                ["编号:", v.itemId, "grey"],
                ["大类:", v.quotationBigCategory, "grey quotationBigCategory"],
                ["单位:", v.measurementUnit, "grey measurementUnit"],
                ["工种:", v.workType, "red workType"],
                ["增补价:", v.addPrice, "blue addPrice"],
                ["单价:", v.unitPrice, "blue unitPrice"],
                ["退减价:", v.subPrice, "blue subPrice"],
                ["工程量:", v.num, "blue"],
                ["是否打折:", v.discount == 1 ? '打折' : '不打折', "red"],
                ["说明:", v.quotationItemDes, "grey quotationItemDes"],
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                if(value[1]){
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                }
            });

            $label.append($input).append($span).appendTo($h3);
            $liLine.append($h3).append($ulProperty);

            $input.change(function(){
                var $this = $(this);
                quote.recordQuots($this, $(this).is(':checked'));
            });

            return $liLine;
        },

        // 创建报价项

        createQuote : function(linenum, qv){

            var $item = $('<li></li>').addClass('fl-quo-item').prop('title',qv.content);
            var typeDict = {"0" :"普通", "1": "自定义", "2": "普通", "3": "自定义", "4": "报价中"};

            var total = utils.changeThrDecimal(utils.accMul(qv.num, qv.unitPrice));

            var _lineSet = [
                ["line", linenum],
                ["num subtypedict", qv.num,['data-subtype', qv.subtype]],// 工程预算量
                ["name", qv.itemName],// 名称
                ["type typedict",typeDict[qv.type], ['data-type', qv.type]],// 类型
                ["worktype", qv.workType],// 工种
                ["type quotationFunctionArea", qv.quotationFunctionAreaName ? qv.quotationFunctionAreaName : "---", ["data-quotationFunctionAreaId", qv.quotationFunctionAreaId]],// 功能区
                ["unit", qv.measurementUnit],// 单位
                ["price unitprice", qv.unitPrice],// 单价
                ["price discountprice", qv.unitPrice, ["data-discount", qv.discount]],// 折后单价
                ["price totalprice-discount", total, ["style", "white-space:nowrap"]],// 总价
            ];

            var $btnCell, $btnCellWrap, $input, $btnDel, $btnInfo;

            $.each(_lineSet, function(i, v){
                var $cell = $('<div></div>').addClass('cell ' + v[0]);
                var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);
                if(v[2]){
                    $cell.attr(v[2][0], v[2][1]);
                }
                $cell.append($cellWrap).appendTo($item);
            });

            $btnCell = $('<div></div>').addClass('cell btns');
            $btnCellWrap = $('<div></div>').addClass('cell-wrap');
            $input = $('<input>').attr({
                "type" : "hidden",
                "name" : "eiid",
                "data-quoteItemId" : qv.quoteItemId,
                "data-quotationItemId": qv.quotationitemid
            }).val(qv.eiid);
            
            $btnDel = $('<a></a>').attr({"href": "javascript:void(0)"}).css({"padding-left": "5px"}).append('<i class="bigger-125 icon-remove pink"></i>').mouseenter(function(){
                com.showTip(this, "删除报价项", "top");
            });
            $btnInfo = $('<a></a>').attr({"href": "javascript:void(0)"}).css({"padding-left": "5px"}).append('<i class="bigger-125 icon-search"></i>').mouseenter(function(){
                com.showTip(this, "报价信息", "top");
            });
            
            $btnCellWrap.append($input).append($btnDel).append($btnInfo).appendTo($btnCell);
            $item.append($btnCell);

            // 各种绑定事件
            $item.click(function(){// 编辑数量
                quote.getNumCellFocus($item);
            });
            // 删除报价项
            $btnDel.click(function(e){
                quote.deleteQuote($item);
                return false;
            });
            // 查看
            $btnInfo.click(function(e){
                qv.content && com.showTip(this, qv.content, 'left');
                return false;
            });
            
            var itemInfo = {
                "data-eiid": qv.eiid,
                "data-totalprice": total,
                "data-addPrice": qv.addPrice,
                "data-subPrice": qv.subPrice,
            }
            
            $item.attr(itemInfo);

            return $item;
        }
    };

    return {
        init : function(){
            
            com.post(api.quotation.queryExtensionByEid, {"extension.eid": params.quotation.extensionId}, function(res){
                var extension = res.extension;
                
                extensionDetail.basicParams["extension.eid"] = extension.eid;
                extensionDetail.basicParams["extension.type"] = extension.type;
                extensionDetail.basicParams["extension.orderId"] = extension.orderId;
                extensionDetail.basicParams["extension.undisPrice"] = extension.undisPrice;
                extensionDetail.basicParams["extension.disPrice"] = extension.disPrice;
                extensionDetail.basicParams["extension.total"] = extension.total;
                
                extensionDetail.basicParams["extensionItem.eid"] = extension.eid;
                
                extensionDetail.eid = extension.eid;
                extensionDetail.orderId = extension.orderId;
                extensionDetail.type = extension.type;
                
                extensionDetail.sumLabType.text((extensionDetail.type == 0 ? '增项' : '减项'));
            }, null, false);

            com.post(api.quotation.queryQuotationForDefaultByOrderId, {"quotation.orderId": extensionDetail.orderId }, function(res){
                
                var quotation = res.quotation;
                
                extensionDetail.discount = utils.accDiv(quotation.discount, 10);
                extensionDetail.qid = quotation.qid;

                extensionDetail.versionId = quotation.no;
                
                extensionDetail.discounts.text(quotation.discount);
            }, null, false);

            com.post(api.quotation .queryExtensionItemByEid, {"extensionItem.eid" : extensionDetail.eid}, function(res){

                var $ul =$('<ul></ul>').addClass('fl-quo-list').appendTo(com.focusPage('#addReduceItemDiv'));
                
                if(res.extensionItems && res.extensionItems.length){
                    $.each(res.extensionItems, function(i, v){
                        painter.createQuote(i + 1, v).appendTo($ul);
                    });
                }
                
                arCalculator.calculateArFees();
            }, null, false);
            
            com.post(api.decoration.queryDecorationForCommonByOrderId, {
                "decoration.orderId": extensionDetail.orderId
            }, function(res) {

                com.focusPage('#orderId').text(res.decoration.orderId)
                com.focusPage('#address').text(res.decoration.house.village.name + " " + res.decoration.house.houseNumber);
                com.focusPage('#version').text(res.decoration.version.name);
            });
            
            if(extensionDetail.type == "1"){
                com.focusPage('#addQuotaionItemBtn').removeClass('hide');
            }

            extensionDetail.init();
            modalEventBinding.init();
            quote.init();
        }
    };
})();

$(function(){
    ExtensionDetail.init();
});