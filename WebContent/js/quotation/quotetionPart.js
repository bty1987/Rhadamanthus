var QuotetionDetail = (function(){
    var quo = {
        //报价ID
        quotetionid : null,
        //报价版本
        versionId : null,
        basicParams : null,
        quoModals : {},
        settingBtns : {},
        quoteCalculation : {},
        machingType : {},

        //定义左下角按钮重定义及指定弹窗显示
        initSettingBtns : function(){
            var that = this;
            that.settingBtns = {
                //功能区
                $btnAddDomain : $('#functionAreaTemplateBtn').click(function(){
                    that.quoModals.$domainTempletModal.modal("show");
                }),
                //折扣
                $btnDiscount: $('#discountBtn').on(ace.click_event, function(){ // 折扣界面
                    that.quoModals.$domainDiscountModal.modal("show");
                }),
                //计算总价
                $btnCalculateTotal: $('#calculateTotalBtn').on(ace.click_event, function(){
                    $('#calculateTotalFeeModal').find('.fl-quo-cal').html(null);
                    $("#calDiscount").val("");
                    quo.calculateTotalFee(10);
                    that.quoModals.$calculateTotalModal.modal("show");
                }),
                //统计
                //$btnReport : $('#viewStatisticalBtn'),
                //保存
                $btnSave : $('#saveQuotetionBtn').bindClick(function(){ // 保存报价信息
                    com.post(api.quotation.updateQuotetionForAdvance, quo.basicParams, function(res){
                        com.showAlert(com.info, "操作成功");
                    });
                },2000),
                //打印
                // $btnPrint : $('#printFinanceBtn').click(function () {
                //    params.quotetionId = quo.quotetionid;
                //    params.type = 2;
                //    params.subtype = -1;
                //    com.popup("打印报价",api.index.quotetionOutputIndex.url,null,null,true);
                //}),
                //返回
                $btnBack : $('#detailBckBtn').on(ace.click_event, function(){
                    bootbox.confirm("当前页面存在重要数据,是否进行当前操作?", function(result) {
                        if(result){
                            com.switchPage(api.index.quotetionIndex.url);
                        }
                    });
                }),
                //展开
                $btnSpread : $('#openFunctionAreasBtn').click(function(){
                    $('.icon-chevron-down').parent().trigger('click');
                }),
                //收起
                $btnCollapse : $('#closeFunctionAreasBtn').click(function(){
                    $('.icon-chevron-up').parents('[data-action="collapse"]').trigger('click');
                }),
            };
            return that;
        },
//左下角按钮的弹窗显示及处理  每个功能区右上角的编辑功能区,添加工程项,添加自定义工程项,历史记录,管理费比例设置 弹窗处理
        initQuoModals : function(){
            var that = this;
            that.quoModals = {
                //添加功能区
                $domainTempletModal : $("#functionAreaTemplateModal").on("show.bs.modal", function(a) {
                    $('input[name="quotempl"]:checked').removeAttr('checked');
                }),
                //编辑折扣
                $domainDiscountModal : $("#discountModal"),
                //计算总价
                $calculateTotalModal: $('#calculateTotalFeeModal'),
                //编辑功能区
                $domainEditModal : $("#functionAreaModal"),
                //添加默认报价项
                $quoteModal : $("#quotetionItemModal").on("show.bs.modal", function(a) {
                    $('input[name="modalQuots"]:checked').removeAttr('checked');
                }),
                //添加自定义报价项
                $quoteAddModal : $("#customFunctionAreaItemsModal").on("show.bs.modal", function(a) {
                    $("#name").val("");
                    $("#quotationItemDes").val("");
                    $("#unitPrice").val("");
                    $('#formula').val("");
                    $("#num").val("");
                    $("#measurementUnit").get(0).selectedIndex = 0;
                    $("#workType").get(0).selectedIndex = 0;
                    $("#discountFlag").removeAttr("checked");
                }),
                //历史记录
                $historyModal : $("#historyQuotetionItemModal").on("show.bs.modal", function(a) {
                    $('input[name="modalQuots"]:checked').removeAttr('checked');
                }),
                //管理费比例设置saveMrBtn
                $manageRateModal : $('#manageRateModal').on("show.bs.modal", function(a) {
                    $('#manageRate').val(null);
                }),
                //车运费比例设置
                conveyanceRateModal : $('#conveyanceRateModal').on("show.bs.modal", function(a) {
                    $('#conveyanceRate').val(null);
                }),
            };

            //初始化功能区添加弹层  通过版本号查询出来的功能区
            com.post(api.quotation.queryFunctionAreaByVersionId, {"functionArea.versionId" :that.basicParams["quotetion.version"]}, function(data){
                data.functionAreas.length && $.each(data.functionAreas, function(i, v){
                    if(v.type != 0) {
                        var $dtempl = painter.createDomainTemplete(v);
                        that.quoModals.$domainTempletModal.find('.modal-body').append($dtempl);
                    }
                });
            }, null, false);
            //初始化报价项选择弹层
            var extraParams  = {"quotationItem.versionId":  quo.basicParams["quotetion.version"]};
            var _condArr = ['itemName', 'quotationBigCategoryId', 'quotationSmallCategoryId', 'quotationWorkTypeId'];
            var quotetionItemSeacher = new Searcher();
            // 通过报价版本编号获取分页方式获取状态为启用报价项信息
            quotetionItemSeacher.init( _condArr, "condList", api.quotation.pageQuotationItemByVersionId,  function(data){
                var $tableWrap = $('#resultList').empty();
                var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
                if(data && data.length){
                    $.each(data,function(i, v){
                        var $liLine = painter.createQuoteModalItem(v);
                        $liLine.appendTo($ul);
                    });
                    $ul.appendTo($tableWrap);
                    //"pagequotetionItemByVersionId里面的quote.quotesRecord"
                    if(quote.quotesRecord.length){
                        $.each(quote.quotesRecord, function(index, val){
                            var $input = $('input[name="modalQuots"][value="'+ $(val).val() +'"]');
                            $input.length &&($input.prop('checked',true)) ;
                        });
                    }
                }
            }, "pagenation", "quotetionDetailItemPostData", extraParams);

            //初始化自定义报价项弹层
            com.post(api.common.queryMeasurementUnit, {}, function(res){
                if(res.errorCode == 0){
                    $("#measurementUnit").bindData(res.measurementUnits, "name", "name");
                }else{
                    bootbox.alert("系统异常");
                }
            }, null, false);
            com.post(api.common.queryWorkType, {} ,function(res){
                if(res.errorCode == 0){
                    $("#workType").bindData(res.workTypes, "name", "name");
                }else{
                    bootbox.alert("系统异常");
                }
            }, null, false);
            //初始化自定义报价中的类型
            com.post(api.quotation.queryQuotationType, {},function(res) {
                $("#quotetionType").bindData(res.quotationTypes,"id", "name");
            });

            //初始化半价配比
            com.post(api.decoration.queryDecorationConfig,{},function(res){
                quo.machingType = res.config.machingType;
            });
            return that;
        },
        //统计车运费管理费总价折扣价
        calculateQuoFees: function(func){
            //折扣转换为小数点形式
            var _discount = utils.accDiv(quo.basicParams['quotetion.discount'], 10);
            var _undisPrice = 0, _disPrice = 0,_dtotalfee = 0, _transfee = 0, _managefee = 0, _manageRate = 0;
            //左上角展示区
            var $domains = $('#functionAreaDetailList .widget-box');
            if(!$domains.length){
                return;
            }

            $domains.each(function(){
                var sum, sumd, sumdp;
                var $this = $(this);
                var _areaType = $this.attr('data-areaType');
                ///"功能区类型"_areaType
                if(_areaType != 0 && _areaType!=3){
                    if(func){
                        func($this);
                    }
                    //非折扣总价格
                    sum = parseFloat($this.attr('data-undisPrice'));
                    //折扣总价格
                    sumdp = parseFloat($this.attr('data-disPrice'));
                    //折扣后总价格
                    sumd = parseFloat($this.attr('data-desTotalprice'));
                    //非折扣总价格
                    _undisPrice = utils.changeThrDecimal(utils.accAdd(_undisPrice, sum));
                    //折扣总价格
                    _disPrice = utils.changeThrDecimal(utils.accAdd(_disPrice, sumdp));
                    //格式化折扣后的总价格
                    _dtotalfee = utils.changeThrDecimal(utils.accAdd(_dtotalfee, sumd));
                }

            });

            //管理费
            var manageCost = $('#manageCost');
            //车运费
            var converyanceCost = $('#conveyanceCost');

     //车运费
            //车运费的折扣
            _transDiscount = converyanceCost.find('.discountprice').attr('data-discount') == "1" ? _discount : 1;
            //获取车运费比例(根据报价版本获得)
            _tranRate = parseFloat(converyanceCost.find('.discountprice .cell-wrap').text());
            //车运费 = (打折项总额+不打折项总额)*车运费比例
            _transfee = utils.changeThrDecimal(utils.accMul(utils.accAdd(_undisPrice, _disPrice), _tranRate));
            //车运费*车运费折扣
            _dtransfee =  utils.changeThrDecimal(utils.accMul(_transfee, _transDiscount));
      //管理费
            //管理费的折扣
            _manageDiscount = manageCost.find('.discountprice').attr('data-discount') == "1" ? _discount : 1;
            //获取管理费比例(根据报价版本获得)
            _manageRate = parseFloat(manageCost.find('.discountprice .cell-wrap').text());
            //管理费 = (打折项总额+不打折项总额+车运费)*管理费比例
            _managefee = utils.changeThrDecimal(utils.accMul(utils.accAdd(utils.accAdd(_undisPrice, _disPrice), _transfee), _manageRate));
            //(打折项总额+不打折项总额+车运费)*管理费比例*管理费折扣
            _dmanagefee = utils.changeThrDecimal(utils.accMul(utils.accMul(utils.accAdd(utils.accAdd(_undisPrice, _disPrice), _transfee), _manageRate), _manageDiscount));

      //总价
            //总价 = 打折项总额+不打折项总额 + 车运费+管理费(未打折的总价格)
            _total = utils.changeThrDecimal(utils.accAdd( utils.accAdd(utils.accAdd(_undisPrice, _disPrice) , _transfee),  _managefee));
            //折扣价 = (不打折总和+ 打折项折后总额 +折扣后的车运费)+折扣后的管理费(打折后的总价格)
             _dtotal = utils.changeThrDecimal(utils.accAdd(utils.accAdd(_dtotalfee, _dtransfee), _dmanagefee));

      //去显示
            //显示到生成项目  车运费(折扣后的车运费)
            converyanceCost.find('.num .cell-wrap').text(_dtransfee);
            //显示到生成项目 管理费(折扣后的管理费)
            manageCost.find('.num .cell-wrap').text(_dmanagefee);
            //显示到左上角的总价
            $('#sumquoSumMoney').text(_total);
            //显示到左上角的折扣价
            $('#sumquoDiscountMoney').text(_dtotal);
            quo.basicParams["quotetion.totalPrice"] = _dtotal;//报价总额
            quo.basicParams["quotetion.manageRate"] =_manageRate;//管理费比例
            quo.basicParams["quotetion.managePrice"] = _managefee;//管理费
            quo.basicParams["quotetion.trafficPrice"] = _transfee;//车运费
            quo.basicParams["quotetion.trafficRate"] = _tranRate;//车运费比例
            quo.basicParams["quotetion.undisPrice"] = _undisPrice;//非打折项折前总额
            quo.basicParams["quotetion.disPrice"] =_disPrice;//打折项折前总额

        },
        //计算功能区总价和折扣总价
        calculateDomainFees  : function($domain, func){
            var _domanFees = 0;
            //选中报价项
            var $arr = $('.fl-quo-item', $domain);
            var sum = 0, sumd = 0,sumdp = 0;
            if($arr.length){
                $arr.each(function(){
                    $this = $(this);
                    if(func){
                        func($this);
                    }

                    var _undisPrice = parseFloat($this.attr("data-undisPrice"));//报价项非折扣总价
                    var _disPrice = parseFloat($this.attr("data-disPrice"));//报价项折扣总价
                    var _totlaPriceDiscount = parseFloat($this.find('.totalprice-discount .cell-wrap').text());//折扣后的一个工程的(折扣单价*数量)
                    sum = utils.changeThrDecimal(utils.accAdd(sum, _undisPrice));//无折扣总价
                    sumdp = utils.changeThrDecimal(utils.accAdd(sumdp,_disPrice));//折扣总价
                    sumd = utils.changeThrDecimal(utils.accAdd(sumd, _totlaPriceDiscount));//折扣后的总价格
                });
                _domanFees = sumd;
            }

            $domain.attr('data-undisPrice', sum);//总价格存入
            $domain.attr('data-desTotalprice', sumd);//折扣后的总价格
            $domain.attr('data-disPrice',sumdp);//折扣项总价
            //折扣后的总价格"
            return _domanFees;
        },
        //计算报价项各种值
        //"计算报价项各种值 折扣价"+_discountprice  未打折总额"+_totalprice  打折后总额"+_totalpriced")
        calculateQuoteFee : function($quote){
            var _num = parseFloat($quote.find('.num .cell-wrap').text());
            var _unitprice = parseFloat($quote.find('.unitprice .cell-wrap').text());
            var _discountFlag = $quote.find('.discountprice').attr('data-discount');//1打折，0不打折
            var _discountprice = utils.changeThrDecimal(utils.accMul(_unitprice, (_discountFlag == 1 ? utils.accDiv(quo.basicParams['quotetion.discount'], 10) : 1)));
            var _totalprice,_totalpriced;
            _totalprice = utils.changeThrDecimal(utils.accMul(_num,  _unitprice));
            _totalpriced =  utils.changeThrDecimal(utils.accMul(_num,  _discountprice));
            $quote.find('.discountprice .cell-wrap').text(_discountprice);
            $quote.find('.totalprice-discount .cell-wrap').text(_totalpriced);
            $quote.attr('data-totalprice', _totalprice);
        },
        // 计算报价总金额
        calculateTotalFee: function(discount){
            var  _manageDiscount, _transDiscount, _totalfee = 0, _dtotalfee = 0, _transfee = 0, _managefee = 0, _manageRate = 0, _total = 0,cdiscount=0,ndiscount = 0;
            var $arr = $('.fl-quo-item');
            var _discount = utils.accDiv(discount, 10);
            $arr.length && $arr.each(function(i, v){
                var $quote = $(v);
                if(['0', '1'].indexOf($quote.find(".cell.type").attr('data-type')) == -1) return true;
                if(['3'].indexOf($quote.find(".cell.line").attr('data-areatype')) != -1) return true;
                var _num = parseFloat($quote.find('.num .cell-wrap').text());
                var _unitprice = parseFloat($quote.find('.unitprice .cell-wrap').text());
                var _discountFlag = $quote.find('.discountprice').attr('data-discount');//1打折，0不打折
                var _discountprice = utils.changeThrDecimal(utils.accMul(_unitprice, (_discountFlag == 1 ?_discount : 1)));
                var _totalprice = utils.accMul(_num,  _unitprice);
                var _totalpriced =  utils.accMul(_num,  _discountprice);
                _discountFlag == 1 ? cdiscount = utils.accAdd(cdiscount, _totalprice):ndiscount = utils.accAdd(ndiscount, _totalprice);
                _totalfee = utils.accAdd(_totalfee, _totalprice);
                _dtotalfee = utils.accAdd(_dtotalfee, _totalpriced);
            });
            //管理费
            var manageCost = $('#manageCost');
            //车运费
            var converyanceCost = $('#conveyanceCost');
            //获取管理费折扣
            _manageDiscount = manageCost.find('.discountprice').attr('data-discount') == "1" ? _discount : 1;
            //获取车运费折扣
            _transDiscount = converyanceCost.find('.discountprice').attr('data-discount') == "1" ? _discount : 1;
            //获取管理费比例(根据报价版本获得)
            _manageRate = parseFloat(manageCost.find('.discountprice .cell-wrap').text());
            //获取车运费比例(根据报价版本获得)
            _tranRate = parseFloat(converyanceCost.find('.unitprice .cell-wrap').text());

            _dtransfee =  utils.changeThrDecimal(utils.accMul(utils.accMul(_totalfee, _tranRate), _transDiscount));
            _dmanagefee = utils.changeThrDecimal(utils.accMul(utils.accMul(utils.accAdd(_totalfee, utils.accMul(_totalfee, _tranRate)), _manageRate), _manageDiscount));

            _total = utils.changeThrDecimal(utils.accAdd(utils.accAdd(_dtotalfee, _dtransfee), _dmanagefee));

            drawTable($('#sumquoSumMoney').text(),_total,utils.accMul(_totalfee, _tranRate),_dmanagefee,discount,cdiscount,ndiscount);
            //报价计算器
            function drawTable(total,dtotal,transfee,managefee,discount,cdiscount,ndiscount) {

                var totalMoney = utils.changeTwoDecimal(utils.accAdd(utils.accAdd(total, transfee), managefee));

                total = utils.changeTwoDecimal(total);
                dtotal = utils.changeTwoDecimal(dtotal);
                transfee = utils.changeTwoDecimal(transfee);
                managefee = utils.changeTwoDecimal(managefee);
                cdiscount = utils.changeTwoDecimal(cdiscount);
                ndiscount = utils.changeTwoDecimal(ndiscount);
                var table = $('#calculateTotalFeeModal').find('.fl-quo-cal').html(null);
                var divItem1 = $('<div></div>').addClass('fl-quo-cal-item');
                divItem1.append(createCalItem("基础",'normal border-right alert-info')).append(createCalItem("",'normal border-left-right alert-info')).append(createCalItem("",'normal border-left-right alert-info')).append(createCalItem("",'normal border-left-right alert-info')).append(createCalItem("",'normal border-left alert-info')).append(createCalItem("装修",' small border-left-right alert-success')).append(createCalItem("",'normal border-left alert-success')).append(createCalItem("主材",'small border-left-right alert-danger')).append(createCalItem("",'normal border-left-right alert-danger')).append(createCalItem("",'normal border-left-right alert-danger')).append(createCalItem("",'normal noborder'));
                divItem1.appendTo(table);
                var divItem2 = $('<div></div>').addClass('fl-quo-cal-item');
                divItem2.append(createCalItem("版本",'normal')).append(createCalItem("折前总价",'normal')).append(createCalItem("打折项总额",'normal')).append(createCalItem("非打折项总额",'normal')).append(createCalItem("管理费",'normal')).append(createCalItem("折扣",'small')).append(createCalItem("折后总价",'normal')).append(createCalItem("配比",'small')).append(createCalItem("主材额",'normal')).append(createCalItem("服务费",'normal')).append(createCalItem("实花总额",' normal alert-warning'));
                divItem2.appendTo(table);
                var halfPacksDiv = $('<div></div>').addClass('fl-quo-cal-item');
                halfPacksDiv.append(createCalItem("半包",'normal')).append(createCalItem(total,'normal')).append(createCalItem(cdiscount,'normal')).append(createCalItem(utils.changeTwoDecimal(utils.accAdd(ndiscount,transfee)),'normal')).append(createCalItem(managefee,'normal')).append(createCalItem(discount,'small')).append(createCalItem(dtotal,'normal')).append(createCalItem("-",'small')).append(createCalItem("-",'normal')).append(createCalItem("-",'normal')).append(createCalItem(dtotal,'normal alert-warning'));
                halfPacksDiv.appendTo(table);
                $.each(quo.machingType,function (i,v) {

                    var materialPrice = utils.changeTwoDecimal(utils.accMul(total,v.key));
                    var servicePrice = utils.changeTwoDecimal(utils.accMul(materialPrice,config.serviceRate));
                    var projectPrice = utils.changeTwoDecimal(utils.accAdd(utils.accMul(utils.accAdd(utils.accAdd(cdiscount,ndiscount), transfee),utils.accDiv(v.value,10)),managefee));
                    var $_total = utils.changeTwoDecimal(utils.accAdd(projectPrice,utils.accAdd(materialPrice,servicePrice)));

                    var halfPriceDiv = $('<div></div>').addClass('fl-quo-cal-item');
                    if(i == Math.ceil(quo.machingType.length / 2) - 1){
                        if(quo.machingType.length != 1){
                            halfPriceDiv.append(createCalItem("半价",'normal border-top-bottom')).append(createCalItem(total,'normal border-top-bottom')).append(createCalItem(utils.accAdd(utils.accAdd(cdiscount,ndiscount),transfee),'normal border-top-bottom')).append(createCalItem("-",'normal border-top-bottom')).append(createCalItem(managefee,'normal border-top-bottom')).append(createCalItem(v.value,'small')).append(createCalItem(projectPrice,'normal')).append(createCalItem(utils.accMul(v.key,100)+"%",'small')).append(createCalItem(materialPrice,'normal')).append(createCalItem(servicePrice,'normal')).append(createCalItem($_total,'normal alert-warning'))
                        }else {
                            halfPriceDiv.append(createCalItem("半价",'normal border-top')).append(createCalItem(total,'normal border-top')).append(createCalItem(utils.accAdd(utils.accAdd(cdiscount,ndiscount),transfee),'normal border-top')).append(createCalItem("-",'normal border-top')).append(createCalItem(managefee,'normal border-top')).append(createCalItem(v.value,'small')).append(createCalItem(projectPrice,'normal')).append(createCalItem(utils.accMul(v.key,100)+"%",'small')).append(createCalItem(materialPrice,'normal')).append(createCalItem(servicePrice,'normal')).append(createCalItem($_total,'normal alert-warning'))
                        }
                    }else if(i == (quo.machingType.length - 1)){
                        halfPriceDiv.append(createCalItem("",'normal border-top')).append(createCalItem("",'normal border-top')).append(createCalItem("",'normal border-top')).append(createCalItem("",'normal border-top')).append(createCalItem("",'normal border-top')).append(createCalItem(v.value,'small')).append(createCalItem(projectPrice,'normal')).append(createCalItem(utils.accMul(v.key,100)+"%",'small')).append(createCalItem(materialPrice,'normal')).append(createCalItem(servicePrice,'normal')).append(createCalItem($_total,'normal alert-warning'))
                    }else{
                        halfPriceDiv.append(createCalItem("",'normal border-top-bottom')).append(createCalItem("",'normal border-top-bottom')).append(createCalItem("",'normal border-top-bottom')).append(createCalItem("",'normal border-top-bottom')).append(createCalItem("",'normal border-top-bottom')).append(createCalItem(v.value,'small')).append(createCalItem(projectPrice,'normal')).append(createCalItem(utils.accMul(v.key,100)+"%",'small')).append(createCalItem(materialPrice,'normal')).append(createCalItem(servicePrice,'normal')).append(createCalItem($_total,'normal alert-warning'))
                    }
                    halfPriceDiv.appendTo(table);
                })

            }
            function createCalItem(text,inclass) {
                return $('<div></div>').html(text).addClass('cell').addClass(inclass);
            }
        },
        init : function () {
            this.initQuoModals();
            this.initSettingBtns();
        }
    };

    //功能区
    var domain = {
        nowEditDomain : null,
        //编辑功能区
        editDomain : function($domain){
            this.nowEditDomain = $domain;
            $("#functionAreaName").val($domain.find('.widget-header strong').text());
            $("#functionAreaOrder").val($domain.attr('data-dlevel'));
            quo.quoModals.$domainEditModal.modal("show");
            return false;
        },
        //编辑功能区保存按钮点击
        saveDomainEdit : function(){
            var that = this;
            $('#saveFunctionAreaBtn').on(ace.click_event, function(){ // 编辑功能区页面
                if(com.validate()){
                    return;
                }
                var _dname = $("#functionAreaName").val();
                var _dorder = $("#functionAreaOrder").val();
                var _params = $.extend({}, {
                    "quotetionFunctionArea.name" : _dname,//功能区名 ;
                    "quotetionFunctionArea.index" : _dorder ,// 排序 ;
                    "quotetionFunctionArea.qfaId" :  that.nowEditDomain.attr('data-qfaid'), //功能区Id ;
                }, quo.basicParams);
                com.post(api.quotation.updateQuotetionFunctionArea, _params, function(res){
                    var $dOrder = that.nowEditDomain.find('.widget-header em');
                    var $dname = that.nowEditDomain.find('.widget-header strong');
                    var $domains = that.nowEditDomain.siblings('.widget-box');
                    $dname.html(_dname);
                    $dOrder.html(_dorder);
                    that.nowEditDomain.attr('data-dlevel',_dorder);
                    that.insertDomainByOrder(_dorder, that.nowEditDomain, $domains, true);
                    var _index = that.nowEditDomain.index();
                    var $dmoney = $('[data-qfaid="'+that.nowEditDomain.attr('data-qfaid') +'"]','#functionAreaSumList');
                    $dmoney.find('.order').text(_dorder);
                    $dmoney.find('.name').text(_dname);
                    $dmoney.remove();
                    if(_index != 0) {
                        $dmoney.insertAfter($('#functionAreaSumList > div').eq(_index - 1));
                    }else{
                        $dmoney.insertBefore($('#functionAreaSumList > div').eq(0));
                    }
                    quo.quoModals.$domainEditModal.modal("hide");
                },null, false);

            });
        },
        //删除功能区
        deletDomain : function($domain){
            bootbox.confirm("确定要删除功能区吗？", function(res){
                if(res){
                    $domain.remove();
                    $('[data-qfaid="'+ $domain.attr('data-qfaid') +'"]', '#functionAreaSumList').remove();
                    //"调用  统计车运费管理费总价折扣价")
                    quo.calculateQuoFees();
                    var _params = $.extend({}, {
                        'quotetionFunctionArea.qfaId' : $domain.attr('data-qfaid') , //功能区Id
                    }, quo.basicParams);
                    com.post(api.quotation.deleteQuotetionFunctionArea, _params, function(){
                    }, null, false);
                }
            });
        },
        calculateTotal: function(){
            $('#calculateTotalFeeBtn').on(ace.click_event, function(){
                if(com.validate()){
                    return;
                }
                var table = $('#calculateTotalFeeModal').find('table');
                table.find('thead').remove();
                table.find('tbody').remove();
                var dis = $("#calDiscount").val();
                if(parseFloat(dis) <= 0 || parseFloat(dis) > 10){
                    com.showTips($("#calDiscount"), "折扣非法", true);
                    return;
                }else{
                    com.clearValidator("#calDiscount", true);
                }
                quo.calculateTotalFee(dis)
            });
        },
        //保存报价修改
        saveDiscountEdit : function(){
            $('#saveDisCountBtn').on(ace.click_event, function(){
                if(com.validate()){
                    return;
                }
                var dis = $("#discount").val();
                if(parseFloat(dis) <= 0 || parseFloat(dis) > 10){
                    com.showTips($("#discount"), "折扣非法", true);
                    return;
                }else{
                    com.clearValidator("#discount", true);
                }
                quo.basicParams['quotetion.discount'] =  Math.round(parseFloat(dis) * 100) / 100;
                $('#sumquoDiscount').text(quo.basicParams['quotetion.discount']);
                quo.calculateQuoFees(function($domain){
                    var dfee = quo.calculateDomainFees($domain, function($quote){
                        quo.calculateQuoteFee($quote);
                    });
                    $('[data-qfaid="'+ $domain.attr('data-qfaid') +'"]', '#functionAreaSumList').find('label.no-padding-left').text(dfee);
                });
                com.post(api.quotation.updateQuotetionForAdvance, quo.basicParams, function(res){
                    quo.quoModals.$domainDiscountModal.modal("hide");
                });
            });
        },
        //保存功能区修改
        saveDomainTemplete : function(){
            var that = this;
            $('#addFunctionAreasBtn').click(function(){

                var $darr = $('input[name="quotempl"]:checked');
                var _param = $.extend({}, quo.basicParams);
                var $aimDomains = $('.widget-box', '#functionAreaDetailList');
                if(!$darr.length){
                    return;
                };

                $.each($darr, function(i, v){
                    _param['functionAreaIds[' + i + ']'] = $(v).val();
                });

                com.post(api.quotation.addQuotetionFuctionArea, _param, function(data){
                    data.quotetionFunctionAreas.length && $.each(data.quotetionFunctionAreas, function(i, v){
                        var sum = 0, sumd = 0,sumdp = 0, $dmoney;
                        var $domain = painter.createdomain(v);
                        that.insertDomainByOrder(v.index, $domain, $aimDomains, false);
                        sum = parseFloat($domain.attr('data-undisPrice'));
                        sumdp = parseFloat($domain.attr('data-disPrice'));
                        sumd = parseFloat($domain.attr('data-desTotalprice'));

                        var _index = $domain.index();
                        $dmoney = painter.createDomainMoney(sumd, v);
                        if(_index == 0){
                            $dmoney.appendTo($('#functionAreaSumList'));
                        }else{
                            $dmoney.insertAfter($('#functionAreaSumList > div').eq(_index - 1));
                        }
                        //"调用   统计车运费管理费总价折扣价")
                        quo.calculateQuoFees();
                    });
                }, null, false);

                quo.quoModals.$domainTempletModal.modal("hide");
            });
        },
        /*
         * 将功能区添加到功能区列表中
         * 参数:
         * 	order ：功能区排序
         * 	$domain ：正在编辑的功能区
         * 	$aimDomains ： 参与排序的其他功能区（不包含当前要插入的功能区）
         * 	existed ： 是否已存在功能区列表中
         * */
        insertDomainByOrder : function(order, $domain, $aimDomains, existed){
            var that = this;
            var maxflag = true;

            if(!$aimDomains.length && existed){
                return;
            }

            if($aimDomains.length){
                $aimDomains.each(function(i){
                    var _order = parseInt($(this).attr('data-dlevel'));
                    if(_order >  parseInt(order) || !_order){
                        $domain.insertBefore($(this));
                        maxflag = false;
                        return false;
                    }
                });
            }

            maxflag && $domain.appendTo($('#functionAreaDetailList'));
            quo.quoModals.$domainEditModal.modal("hide");
        },
        //保存默认报价项  添加工程项按钮
        saveQuotesToDomain : function(){
            $('#addFunctionAreaItemsBtn').click(function(){
                quote.addDefaultQuotes();
                quo.quoModals.$quoteModal.modal("hide");
            });
        },
        deleteQuotesToDomain : function() {
            quo.quoModals.$quoteModal.on('hide.bs.modal', function () {
                quote.quotesRecord = [];
            })
        },

        //管理费比例弹窗保存按钮 saveMrBtn
        saveManageRate : function(){
            $('#saveMrBtn').click(function(){
                if(com.validate()){
                    return;
                }
                var _manageId = $('#manageCost').attr('qfaiId');
                var _qfaId = $('#manageCost').find('.cell.name').attr("data-qfaId");

                var _manageRate = parseFloat($('#manageRate').val());

                $('#manageCost').find('.unitprice').text(_manageRate);

                $('#manageCost').find('.discountprice .cell-wrap').text(_manageRate);
                $('#manageCost').find('.totalprice-discount .cell-wrap').text(_manageRate);
                //("调用   统计车运费管理费总价折扣价")
                quo.calculateQuoFees();
                quo.quoModals.$manageRateModal.modal("hide");

                var option=$.extend({}, {
                    "quotetionFunctionAreaItem.qfaiId": _manageId,
                    "quotetionFunctionAreaItem.qfaid":_qfaId,
                    "quotetionFunctionAreaItem.unitPrice": _manageRate
                }, quo.basicParams);

                com.post(api.quotation.updateQuotetionFunctionAreaItemForSpec,option , function(res){

                }, null, false);
                //应该不用了
                //com.post(api.quotation.updateQuotetionForAdvance, quo.basicParams, function(res){}, null, false);
            });
        },
        //车运费管理保存
        saveconveyanceRate :function(){
            $('#saveconveyanceBtn').click(function(){
                if(com.validate()){
                    return;
                }
                var _conveyanceId = $('#conveyanceCost').attr('qfaiId');
                var _qfaId = $('#conveyanceCost').find('.cell.name').attr("data-qfaId");

                var _conveyanceCost = parseFloat($('#conveyanceRate').val());
                $('#conveyanceCost').find('.unitprice').text(_conveyanceCost);
                $('#conveyanceCost').find('.discountprice .cell-wrap').text(_conveyanceCost);
                $('#conveyanceCost').find('.totalprice-discount .cell-wrap').text(_conveyanceCost);
                //("调用   统计车运费管理费总价折扣价")
                quo.calculateQuoFees();
                var option=$.extend({}, {
                    "quotetionFunctionAreaItem.qfaiId": _conveyanceId,
                    "quotetionFunctionAreaItem.qfaid":_qfaId,
                    "quotetionFunctionAreaItem.unitPrice": _conveyanceCost
                }, quo.basicParams);

                com.post(api.quotation.updateQuotetionFunctionAreaItemForSpec,option , function(res){
                    quo.quoModals.conveyanceRateModal.modal("hide");
                }, null, false);
               com.post(api.quotation.updateQuotetionForAdvance, quo.basicParams, function(res){}, null, false);

            });
        },

        //绑定各种关于报价的操作
        init: function(){
            this.saveDomainEdit();
            this.calculateTotal();
            this.saveDiscountEdit();
            this.saveDomainTemplete();
            this.saveQuotesToDomain();
            this.saveManageRate();
            this.saveconveyanceRate();
            this.deleteQuotesToDomain();
        },

    };
    //报价
    var quote = {
        quotesRecord  : [],
        $nowLine : null,
        $nowEditInput : null,
        //排序报价项
        sortQuote : function($domain){
            var $arr = $domain.find('.fl-quo-item');
            if(!$arr){
                return
            }
            $arr.each(function(){
                $this = $(this);
                $this.find('.line .cell-wrap').text($this.index() + 1);
            });
        },
        getNumCellFocus : function($line){
            var that = this;
            //选中后代中带有*class的标签
            var $numCell = $line.find('.cell.formula');
            var $editInput = that.$nowEditInput ? that.$nowEditInput : $line.parents('.widget-body-inner').find('.fl-quo-input');
            //报价项的模块
            domain.nowEditDomain = $line.parents('.widget-box');
            quote.checkedStyle($line);
            //选中元素中input标签 val赋值为$numCell的文本值   并且点击input标签获取焦点      .focus()获取焦点     .select()选中
            $editInput.removeClass('hide').appendTo($numCell).find('input').val($numCell.find('.cell-wrap').text()).focus().select();
            that.$nowLine = $line;
            that.$nowEditInput = $editInput;
            that.$nowEditInput.find('input').off('keydown').on("keydown",function (e) {
                var $input = $(this);
                that.bindInputKeydown($input.val(), e);
            })
        },
        //回车添加
        bindInputKeydown : function(formula, e){
            var that = this;
            var $line = null;
            //keyCode码  13为回车符
            if(e.keyCode == 13){
                try {
                    formula = formula.replace(/\s+/g,"");
                    var test = /([\D][\.][\D])|([\d][\.][\D])|([\D][\.][\d])|(\.$)|(^\.)|([\+\-\*\/\(][\+\-\*\/])|([^\d|^\+|^\-|^\*|^\/|^\.|^\(|^\)])/;
                    if(test.test(formula) || formula == null || formula == ''){
                        that.hideInputWrap();
                        return false;
                    }
                    var num = utils.changeThrDecimal(eval(formula));
                    if(num<0 || num>10000000){
                        that.hideInputWrap();
                        return false;
                    }
                } catch (e) {
                    that.hideInputWrap();
                    return false;
                }
                //赋值给外部的公式显示
                that.$nowLine.find('.cell.formula .cell-wrap').text(formula);
                //赋值给外部显示DIV 显示数量
                that.$nowLine.find('.cell.num .cell-wrap').text(num);
                //获取下一个报价项的整体元素标签
                $line = that.$nowLine.next('.fl-quo-item');
                //获取报价项的类型
                var _type = that.$nowLine.find('.type').attr('data-type');
                var _areaType = that.$nowLine.find('.line').attr('data-areaType');
                var args = {
                    "quotetionFunctionAreaItem.discount" : that.$nowLine.find('.discountprice').attr('data-discount'),// 折扣标示 1:打折 ;
                    "quotetionFunctionAreaItem.qfaiId" : that.$nowLine.find('input[name="deleteItems"]').val(),// 报价项Id , 可空 ;
                    "quotetionFunctionAreaItem.name" : that.$nowLine.find('.name .cell-wrap').text(),// 报价项名
                    "quotetionFunctionAreaItem.measurementUnit" : that.$nowLine.find('.unit .cell-wrap').text(),//  单位 ;
                    "quotetionFunctionAreaItem.formula" : that.$nowLine.find('.formula .cell-wrap').text(),//计算公式
                    "quotetionFunctionAreaItem.workType" : that.$nowLine.find('.worktype .cell-wrap').text(),//工种 workTypeId : $("#workType").val(),

                    "quotetionFunctionAreaItem.unitPrice" :that.$nowLine.find('.unitprice .cell-wrap').text(),// 单价 ;
                    "quotetionFunctionAreaItem.initNum" : that.$nowLine.find('.num .cell-wrap').text(),//初始化数量
                    "quotetionFunctionAreaItem.num" : that.$nowLine.find('.num .cell-wrap').text() ,//数量;
                    "quotetionFunctionAreaItem.subtype"  :that.$nowLine.find('.num').attr('data-subtype') ,// 1工程,2主材
                    "quotetionFunctionAreaItem.type" : _type,// , 类型 , 自定义为1 , 工程报价项为0  不计算为4
                    "quotetionFunctionAreaItem.qfaid" : domain.nowEditDomain.attr('data-qfaId'),// 功能区Id
                    "quotetionFunctionAreaItem.index": parseInt(that.$nowLine.find(".line .cell-wrap").text())
                };
                if(_type == 0  || _type == 4){
                    //报价项Id , 普通类型报价项需要传递 "data-qiid"
                    args["quotetionFunctionAreaItem.qiid"] = that.$nowLine.find('input[name="deleteItems"]').attr('data-qiid');
                }else if(_type == 1){
                    //报价项说明 , 自定义类型报价项需要传递 ;
                    args["quotetionFunctionAreaItem.content"] = that.$nowLine.prop('title');
                }

                that.$nowLine.find('input[name="deleteItems"]').val(that.$nowLine.find('input[name="deleteItems"]').val());
                var _price = 0,_dprice = 0;
                var _num = parseFloat(that.$nowLine.find('.num .cell-wrap').text());//数量
                if(_areaType!=3){
                    _price = parseFloat(that.$nowLine.find('.unitprice .cell-wrap').text());//单价
                    _dprice = parseFloat(that.$nowLine.find('.discountprice .cell-wrap').text());//折扣单价
                }
                //折扣单价*数量
                that.$nowLine.find('.totalprice-discount .cell-wrap').text(utils.changeThrDecimal(utils.accMul(_dprice, _num)));
                //单价*数量
                that.$nowLine.find('.discountprice').attr('data-discount') == 0 ? that.$nowLine.attr('data-undisPrice', utils.changeThrDecimal(utils.accMul(_price ,  _num))) : that.$nowLine.attr('data-disPrice', utils.changeThrDecimal(utils.accMul(_price ,  _num)));
                //将报价项模块传入(返回没有折扣的总价格)
                if(_areaType!=3) {
                    var _fee = quo.calculateDomainFees(domain.nowEditDomain);
                }
                //选中左上角报价中的功能区ID 将总价格显示
                $('[data-qfaid="'+ domain.nowEditDomain.attr('data-qfaid') +'"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
                //调用   统计车运费管理费总价折扣价")
                quo.calculateQuoFees();
                com.clearValidator();
                that.$nowLine.find(".icon-arrow-up").removeClass("grey").addClass("green"),that.$nowLine.find(".icon-arrow-down").removeClass("grey").addClass("red");
                var _params = $.extend({}, args, quo.basicParams);
                //回车添加报价项
                com.post(api.quotation.updateQuotetionFunctionAreaItem, _params, function(res){
                    that.$nowLine.find('input[name="deleteItems"]').val(res.quotetionFunctionAreaItem.qfaiId);
                }, null, false);
                if($line.length){
                    that.getNumCellFocus($line);
                }else{
                    that.hideInputWrap();
                }
                return;
            }
            //如果按键为上 调整焦点到功能区内上一个报价项
            if(e.keyCode == 38){
                $line = that.$nowLine.prev('.fl-quo-item');
                if($line.length){
                    that.getNumCellFocus($line);
                }else{
                    that.hideInputWrap();
                }
                return;
            }
            //如果按键为下  调整焦点到功能区内的下一个报价项
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
            }//$nowEditInput?
            this.$nowEditInput.addClass('hide');
            //this.$nowEditInput = null;
        },
        //批量删除报价项
        deleteQuoteInBatches : function($domain){
            $domain.find('.fl-quo-input').insertAfter($domain.find('.fl-quo-list'));
            var that = this;
            // , 参数 : qfaiIds[n] , 报价项Id列表 ;
            var $quos = $('[name="deleteItems"]:checked', $domain);
            var $q1 = [], $q2 = [];
            var _params  = {};
            if(!$quos.length){
                return;
            };

            $quos.length && $.each($quos, function(i, v){
                if($(v).val()){
                    _params['qfaiIds[' + $q1.length + ']'] = $(v).val();
                    $q1[$q1.length] = v;
                }else{
                    $q2[$q2.length] = v;
                }
            });

            $q2.length && $.each($q2, function(i, v){
                $(v).parents('li.fl-quo-item').remove();
            });

            if($q1.length){
                $.each($q1, function(i, v){
                    $(v).parents('li.fl-quo-item').remove();
                });
                var _fee = quo.calculateDomainFees(domain.nowEditDomain);
                $('[data-qfaid="'+ domain.nowEditDomain.attr('data-qfaid') +'"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
                quo.calculateQuoFees();
                _params = $.extend({},_params, quo.basicParams, {"quotetionFunctionArea.qfaId": domain.nowEditDomain.attr('data-qfaid')});
                com.post(api.quotation.deleteQuotetionFunctionAreaItem, _params, function(res){}, null, false);
            }
            quote.sortQuote(domain.nowEditDomain);
        },
        //删除报价项
        deleteQuote : function($quote){
            var that = this;
            var _qid = $quote.find('input[type="checkbox"]').val();
            var _params = {};
            domain.nowEditDomain = $quote.parents('.widget-box');
            domain.nowEditDomain.find('.fl-quo-input').insertAfter(domain.nowEditDomain.find('.fl-quo-list')).addClass('hide');
            if(!_qid){
                $quote.remove();
            }else{
                $quote.remove();
                var _fee = quo.calculateDomainFees(domain.nowEditDomain);
                $('[data-qfaid="'+ domain.nowEditDomain.attr('data-qfaid') +'"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
                //调用   统计车运费管理费总价折扣价"
                quo.calculateQuoFees();
                _params = $.extend({}, quo.basicParams,{"quotetionFunctionArea.qfaId": domain.nowEditDomain.attr('data-qfaid')});
                _params["qfaiIds[0]"] = _qid;
                com.post(api.quotation.deleteQuotetionFunctionAreaItem, _params, function(res){

                }, null, false);
            }
            quote.sortQuote(domain.nowEditDomain);
        },
        //添加自定义报价项
        saveCustomQuotesAdd : function(){
            $("#saveCustomFunctionAreaItemBtn").on(ace.click_event, function(event){
                var _areaType = domain.nowEditDomain.attr('data-areaType');
                if(com.validate()){
                    return;
                }
                var _index = domain.nowEditDomain.find('.fl-quo-item').length;
                var addRow = {
                    discount : $("#discountFlag").prop("checked") ? 1 : 0,
                    formula:$("#formula").val(),
                    subtype:$("#quotetionType").val(),
                    num : $("#num").val(),
                    name : $("#name").val(),
                    measurementUnit : $("#measurementUnit").val(),
                    unitPrice : $("#unitPrice").val(),
                    content : $("#quotetionItemDes").val(),
                    type : 1,
                    workType : $('#workType').val(),
                    areaType : _areaType,
                };
                var $item, $historyItem;
                var _fee = 0;
                $item = painter.createQuote(_index + 1,addRow);
                $item.find(".icon-arrow-up").removeClass("grey").addClass("green"),$item.find(".icon-arrow-down").removeClass("grey").addClass("red");
                $item.appendTo(domain.nowEditDomain.find('.fl-quo-list'));
                $historyItem = painter.createQuoteModalItem({
                    "itemName" : addRow.name,
                    "unitPrice" : addRow.unitPrice,
                    "measurementUnit" : addRow.measurementUnit,
                    "quotetionItemDes" : addRow.content,
                    "workType" : $('#workType').val(),
                    "discount" : addRow.discount,
                });
                quote.recordHistoryQuotes($historyItem);
                _fee = quo.calculateDomainFees(domain.nowEditDomain);
                $('[data-qfaid="'+ domain.nowEditDomain.attr('data-qfaid') +'"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
                //"调用   统计车运费管理费总价折扣价")
                quo.calculateQuoFees();
                quote.sortQuote(domain.nowEditDomain);

                var args = {
                    "quotetionFunctionAreaItem.discount" : addRow.discount,// 是否打折
                    "quotetionFunctionAreaItem.name" : addRow.name,// 报价项名
                    "quotetionFunctionAreaItem.measurementUnit" : addRow.measurementUnit,// , 单位 ;
                    "quotetionFunctionAreaItem.workType" : $('#workType').val(),//工种 workTypeId : $("#workType").val(),
                    "quotetionFunctionAreaItem.content" : addRow.content,// , 报价项说明 , 自定义类型报价项需要传递 ;
                    "quotetionFunctionAreaItem.unitPrice" : addRow.unitPrice,// 单价 ;
                    "quotetionFunctionAreaItem.subtype" : addRow.subtype,
                    "quotetionFunctionAreaItem.formula": addRow.formula,//公式
                    "quotetionFunctionAreaItem.initNum" : addRow.num ,//原数
                    "quotetionFunctionAreaItem.num" : addRow.num ,//, 工程量 ;
                    "quotetionFunctionAreaItem.type" : addRow.type,// , 类型 , 自定义为1 , 普通报价项为0 ;
                    "quotetionFunctionAreaItem.qfaid" : domain.nowEditDomain.attr('data-qfaId'),// 功能区Id ;
                    "quotetionFunctionAreaItem.index" : (_index + 1),
                };

                var _params = $.extend({}, args, quo.basicParams);
                com.post(api.quotation.updateQuotetionFunctionAreaItem, _params, function(res){
                    $item.find('input[name="deleteItems"]').val(res.quotetionFunctionAreaItem.qfaiId);
                }, null, false);
                quo.quoModals.$quoteAddModal.modal("hide");
                return false;
            });
        },
        /*添加报价项的时候记住上一页选中的报价项
         * 参数
         * $input ：正在操作的input标签
         * ischecked : 选举中或取消选中
         * */
        recordQuots : function($input, ischecked){
            var that = this;
            if(ischecked){
                that.quotesRecord[that.quotesRecord.length] = $input;//据说这样比push快
            }else{
                that.quotesRecord = $.map(that.quotesRecord, function(v){
                    return v.val() != $input.val() ? v : null;
                });
            };
        },
        //点击页面其他位置时清除表格行的选中样式
        clearQuoteSelected : function(){
            var that = this;
            $('body').click( function(e){
                if(!$(e.target).is('.cell-wrap') && !$(e.target).is('[data-action="collapse"]')){
                    that.hideInputWrap();
                }
            });
        },
        //删除上一个选中的报价项选中样式 并添加当前报价项选中样式
        checkedStyle : function($item){
            $('.fl-quo-item.current').removeClass('current');
            $item.addClass('current');
        },
        calculationNum : function(){
            $('#formula').blur(function(){
                var that = $(this) ;
                try {
                    var formula = that.val();
                    formula = formula.replace(/\s+/g,"");
                    var test = /([\D][\.][\D])|([\d][\.][\D])|([\D][\.][\d])|(\.$)|(^\.)|([\+\-\*\/\(][\+\-\*\/])|([^\d|^\+|^\-|^\*|^\/|^\.|^\(|^\)])/;
                    if(test.test(formula) || formula == null || formula == ''){
                        $('#num').val('');
                        return false;
                    }
                    var num = utils.changeThrDecimal(eval(formula));
                    if(num<0 || num>10000000){
                        $('#num').val('');
                        return false;
                    }
                    that.val(formula);
                    $('#num').val(num);
                }
                catch (e) {
                    $('#num').val('');
                    return false;
                }
            });
        },
        addHistoryQuotes : function(){
            $('#addHistoryItemsBtn').on(ace.click_event, function(event){
                quote.addDefaultQuotes();
                quo.quoModals.$historyModal.modal("hide");
            });
        },
        //记录历史数据
        recordHistoryQuotes : function($historyQuo){
            var addflag = true;
            var $quos = $('[type="checkbox"]', '#historyQuotetionItemDiv');
            if($quos.length){
                $.each($quos, function(i, v){
                    if($(v).val() == $historyQuo.find('[type="checkbox"]').val()){
                        addflag = false;
                        return false;
                    };
                });
            }
            addflag && $historyQuo.appendTo('#historyQuotetionItemDiv > ul.fl-table-list');
        },
        //添加工程项 与  历史报价项 的保存按钮调用的保存方法
        addDefaultQuotes : function(){
            //"如果添加不上可能就是这里的错误")
            //("添加工程项 与  历史报价项 的保存按钮调用的保存方法")
            var _arrs = quote.quotesRecord;
            var _index = domain.nowEditDomain.find('.fl-quo-item').length;
            //判断现有的功能区中是否有
            if(!_arrs.length){
                return;
            }
            $.each(_arrs, function(i, v){
                var $this = $(v);
                if($this.val() && $('input[data-qiid="' + $this.val() +'"]', domain.nowEditDomain).length){
                    return;
                }
                var _quotval = {
                    "discount" : $this.attr('data-discount'),
                    "content" : $this.attr('data-des'),
                    "name" : $this.attr('data-name'),
                    "measurementUnit" : $this.attr('data-itemUnite'),
                    "formula":'0',
                    "num" : 0,
                    "qfaiId" : "",
                    "qfaid" : "",
                    "qiid" : $this.val(),
                    "type" : $this.val() ? domain.nowEditDomain.attr('data-areaType') == 3 ? '4': '0' : "1",
                    "subtype" : $this.attr('data-quotetionTypeId'),
                    "unitPrice" :  $this.attr('data-itemPrice'),
                    "workType" : $this.attr('data-workType'),
                    "quotetionType": $this.attr('data-quotetionType'),
                    "quotetionTypeId" : $this.attr('data-quotetionTypeId'),
                    "areaType" : domain.nowEditDomain.attr('data-areaType'),
                };
                var $item = painter.createQuote( _index + i + 1, _quotval);
                $item.appendTo(domain.nowEditDomain.find('.fl-quo-list'));
                var $historyItem = $this.parents('li.item-blue').clone(true);
                //记录历史数据
                quote.recordHistoryQuotes($historyItem);
            });
            quote.quotesRecord = [];
        },
        MoveAreaItem : function($quote,$movequote,$direction){
            if(!$quote.find('input[name="deleteItems"]').val()){
                return;
            }
            if($direction == "up"){
                if($quote.prev().length == 0 || !$movequote.find('input[type="checkbox"]').val()){
                    return;
                }
                $quote.insertBefore($movequote);
            }
            if($direction == "down" ){
                if($quote.next().length == 0 || !$movequote.find('input[type="checkbox"]').val()){
                    return;
                }
                $quote.insertAfter($movequote);
            }

            var _nowline = $quote.find(".cell.line .cell-wrap").text();
            var _upline =$movequote.find(".cell.line .cell-wrap").text();

            $quote.find(".cell.line .cell-wrap").text(_upline);
            $movequote.find(".cell.line .cell-wrap").text(_nowline);

            var _data = {}
            _data["quotetionFunctionAreaItems["+0+"].qfaiId"] =  $quote.find('input[type="checkbox"]').val();
            _data["quotetionFunctionAreaItems["+0+"].index"] = _upline;
            _data["quotetionFunctionAreaItems["+1+"].qfaiId"] = $movequote.find('input[type="checkbox"]').val();
            _data["quotetionFunctionAreaItems["+1+"].index"] = _nowline;

            var _quotetionFunctionArea = {"quotetionFunctionArea.qfaId":$quote.parents('div.widget-box.transparent').attr('data-qfaid')};

            com.post(api.quotation.updateQuotetionFunctionAreaItemForIndex,$.extend({},_data,_quotetionFunctionArea) , function(res){

            }, null, false);
        },
        init : function(){
            this.saveCustomQuotesAdd();
            this.clearQuoteSelected();
            this.calculationNum();
            this.addHistoryQuotes();
        }
    };

    var painter = {
        //创建功能区
        createdomain : function(dv){
            //"画功能区大框"
            var that = this;
            var $domain,
                $dhead, $dname, $dtoolbar, $btns = {},
                $dbody, $dbodyInner, $list, $input;
            var _btnSet = {
                "$btnEdit" : ["编辑功能区", '<i class="bigger-125 icon-pencil blue"></i>', dv.type!=0],
                "$btnAdd" : ["添加工程项", '<i class="bigger-125 icon-plus purple"></i>', dv.type!=0],
                "$btnSet" : ["自定义报价项", '<i class="bigger-125  icon-plus-sign purple"></i>', dv.type!=0],
                "$btnHistory" : ["历史报价项", '<i class="bigger-125 icon-star green"></i>', dv.type!=0],
                "$btnDelQuo" : ["批量删除报价项", '<i class="bigger-125 icon-remove pink"></i>',dv.type!=0],
                "$btnDelDomain" : ["删除功能区", '<i class="bigger-125 icon-trash red"></i>',dv.type!=0],
                "$btnFold" : ["折叠", '<i class="bigger-125 icon-chevron-up" functionindexdata="1" id="oneChevron_1"></i>', true]
            };
            var sum = 0, //功能区总价(不打折总价)
                sumdp = 0,//功能区总价(打折前的打折总价)p
                sumd = 0,//功能区总价(打折后总价)
            $domain = $('<div></div>').addClass('widget-box transparent').attr({
                "data-dlevel" : dv.index,//排序
                "data-qfaId" : dv.qfaId,//报价项中的功能区ID
                "data-areaType" : dv.type//类型 功能区的type
            }).css({"margin-bottom" : "20px"});

            $dhead = $('<div></div>').addClass('widget-header');
            $dname = $('<h5></h5>').append($('<em></em>').text(dv.type == 0 ? '' : dv.index)).append('  ').append($('<strong></strong>').html(dv.name));
            $dtoolbar = $('<div></div>').addClass('widget-toolbar no-border');

            $.each(_btnSet, function(k, v){
                if(!v[2]){
                    return;
                }
                $btns[k] = $('<a></a>').attr({
                    "href" : "javascript:void(0)",
                    "data-rel" : "tooltip",
                    //"data-placement" : "bottom",
                    "data-original-title" : v[0]
                }).addClass('tooltip-info').css({"padding-left": "5px","text-decoration" : "none"}).append(v[1]).appendTo($dtoolbar).tooltip();
            });

            $btns["$btnFold"].attr({"data-action" : "collapse"});

            $dbody = $('<div></div>').addClass('widget-body');
            $dbodyInner = $('<div></div>').addClass('widget-body-inner');
            $list = $('<ul></ul>').addClass('fl-quo-list');
            $input = $('<div></div>').addClass('fl-quo-input hide').append($('<input type="text">').addClass('v_required v_float').attr('maxlength','16'));

            $dhead.append($dname).append($dtoolbar);

            $dbodyInner.append($input).append($list).appendTo($dbody);

            $domain.append($dhead).append($dbody);

            if(dv.quotetionFunctionAreaItems.length) {
                //功能区中的报价项
                var _items = dv.quotetionFunctionAreaItems;

                // 按照报价项主键顺序排序
                _items = _items.sort(function (a, b) {
                    if (a.index == null || b.index == null) {
                        //降序排列
                        return b.index - a.index;
                    } else {
                        //升序
                        return a.index - b.index;
                    }
                });
                $.each(_items, function (i, v) {
                    v.areaType = $domain.attr('data-areaType');
                    var $item = that.createQuote(i + 1, v);
                    $item.appendTo($list);
                    sumd = dv.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumd, parseFloat($item.find('.totalprice-discount .cell-wrap').text()))) : 0;
                    sum = dv.type != 3 ? utils.changeThrDecimal(utils.accAdd(sum, parseFloat($item.attr('data-undisPrice')))) : 0;
                    sumdp = dv.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumdp, parseFloat($item.attr('data-disPrice')))) : 0;
                });
            }

            if(dv.type !=0){
                //各种绑定事件
                $btns.$btnEdit.click(function(){//编辑功能区
                    domain.editDomain($domain);
                });
                $btns.$btnAdd.click(function(){//添加工程报价项
                    domain.nowEditDomain = $domain;
                    quo.quoModals.$quoteModal.modal("show");
                    $('#addItemFunctionAreaIndex').val(dv.qfaId);
                });
                $btns.$btnSet.click(function(){//自定义报价项
                    domain.nowEditDomain = $domain;
                    quo.quoModals.$quoteAddModal.modal("show");
                });
                $btns.$btnHistory.click(function(){//历史报价项
                    domain.nowEditDomain = $domain;

                    quo.quoModals.$historyModal.modal("show");
                });
                $btns.$btnDelQuo.click(function(){//批量删除报价项
                    quote.deleteQuoteInBatches($domain);
                });
                $btns.$btnDelDomain.click(function(){//删除功能区
                    domain.deletDomain($domain);
                });
            }
            $domain.attr('data-desTotalprice', sumd);
            $domain.attr('data-disPrice', sumdp);
            $domain.attr('data-undisPrice', sum);

            return $domain;
        },
        //创建报价项
        createQuote : function(linenum, qv){

            //将说明写入到提示框中
            var $item = $('<li></li>').addClass('fl-quo-item').prop('title',qv.content);
            var _dcp = 0 ;
            if(qv.type < 2){
                //计算是否打折计算出折扣后的价格    单价
                _dcp = utils.accMul(qv.unitPrice, (qv.discount == 1 ? utils.accDiv(quo.basicParams['quotetion.discount'], 10) : 1));//折后单价1打折，0不打折
                //取小数后三位
                _dcp = utils.changeThrDecimal(_dcp);
            }

            if(qv.type == 2){
                //单价
                _dcp =  qv.unitPrice;
            }

            if(qv.type == 3){
                //单价+非业务人员提点
                _dcp = qv.unitPrice;
            }

            var _lineSet = [
                ["line", linenum,["data-areaType",qv.areaType]],//编号
                qv.areaType == 0 ? "" :["formula",qv.formula?qv.formula:"0"],//公式
                ["num", qv.num,["data-subtype",qv.subtype]],//数量
                ["name", qv.name,["data-qfaId",qv.qfaid]],//报价名称
                ["type", qv.type== 0 ? "普通" : qv.type == 1 ? "自定义" : qv.type == 4 ?"不计算":"-" , ["data-type", qv.type]],
                ["unit", qv.measurementUnit],//单位
                ["worktype", qv.workType],//工种
                ["price unitprice", qv.type == 3 ? _dcp : qv.unitPrice],//类型 , 0: 普通报价项 , 1: 自定义报价项 , 2: 车运费 , 3: 管理费 , 4: 不计入总额
                ["price discountprice", qv.areaType == 3 ? 0 : _dcp, ["data-discount", qv.discount]],//折扣后的价格   将折扣存入
                ["price totalprice-discount", qv.areaType == 3 ? 0 :  qv.type < 2  ? utils.changeThrDecimal(utils.accMul(qv.num ,  _dcp)) : _dcp],//根据类型计算(数量*折扣)
            ];

            var $btnCell, $btnCellWrap, $inputLable, $input, $ispan, $btnDel, $btnInfo, $btnset, $up, $down;

            $.each(_lineSet, function(i, v){
                var $cell = $('<div></div>').addClass('cell ' + v[0]);
                var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);
                if(v[2]){
                    $cell.attr(v[2][0], v[2][1]);
                }
                $cell.append($cellWrap).appendTo($item);
            });
            //报价类型为普通跟自定义
            //"给deleteItems赋值"
            if(qv.type < 2 ||qv.type ==4){
                $btnCell = $('<div></div>').addClass('cell btns');
                $btnCellWrap = $('<div></div>').addClass('cell-wrap');
                $inputLable = $('<label></label>');
                $input = $('<input>').addClass('cbox ace').attr({
                    "type" : "checkbox",
                    "role" : "checkbox",
                    "name" : "deleteItems",
                    "data-qiid" : qv.qiid ? qv.qiid : "",
                }).val(qv.qfaiId);
                $ispan = $('<span></span>').addClass('lbl align-top');

                $inputLable.append($input).append($ispan);
                $btnCellWrap.append($inputLable).appendTo($btnCell);
                $item.append($btnCell);

                $btnDel = $('<a></a>').attr({
                    "data-rel" : "tooltip",//提示框
                    "href" : "javascript:void(0)",
                    "data-original-title" : "删除报价项"//提示框内容
                }).css({"padding-left" : "5px","text-decoration" : "none"})
                    .append('<i class="bigger-125 icon-remove pink"></i>')
                    .tooltip();//初始化提示框
                $btnInfo = $('<a></a>').attr({
                    "data-rel" : "tooltip",//提示框
                    "href" : "javascript:void(0)",
                    "data-original-title" : "报价信息"//提示框内容
                }).css({"padding-left" : "5px","text-decoration" : "none"})
                    .append('<i class="bigger-125 icon-search"></i>')
                    .tooltip();//初始化提示框
                $up = $('<a></a>').attr({
                    "data-rel" : "tooltip",//提示框
                    "href" : "javascript:void(0)",
                    "data-original-title" : "向上"//提示框内容
                }).css({"padding-left" : "6px","text-decoration" : "none"})
                    .append('<i class="icon-arrow-up bigger-110"></i>')
                    .tooltip();//初始化提示框
                $down = $('<a></a>').attr({
                    "data-rel" : "tooltip",//提示框
                    "href" : "javascript:void(0)",
                    "data-original-title" : "向下"//提示框内容
                }).css({"padding-left" : "6px","text-decoration" : "none"})
                    .append( '<i class="icon-arrow-down bigger-110"></i>')
                    .tooltip();//初始化提示框
                $btnCellWrap.append($btnDel).append($btnInfo).append($up).append($down);
                qv.qfaiId ? ($up.find("i").addClass("green"),$down.find("i").addClass("red")) :($up.find("i").addClass("grey") ,$down.find("i").addClass("grey"))
                //各种绑定事件
                $item.click(function(){//编辑数量
                    quote.getNumCellFocus($item);
                });
                //删除报价项
                $btnDel.click(function(e){
                    e.stopPropagation();
                    quote.deleteQuote($item);
                });
                //查看
                $btnInfo.click(function(e){
                    e.stopPropagation();
                    qv.content && com.showInfo(qv.content);
                });
                //向上移动
                $up.click(function(e){
                    e.stopPropagation();
                    quote.checkedStyle($item);
                    quote.MoveAreaItem($item,$item.prev(),"up");
                });
                //向下移动
                $down.click(function(e){
                    e.stopPropagation();
                    quote.checkedStyle($item);
                    quote.MoveAreaItem($item,$item.next(),"down");
                })
            }else{
                if(qv.type == 2){ // 车运费
                    $item.attr('id', 'conveyanceCost').attr('qfaiId', qv.qfaiId);
                    $btnCell = $('<div></div>').addClass('cell btns');
                    $btnCellWrap = $('<div></div>').addClass('cell-wrap');
                    $btnset = $('<a></a>').attr('data-rel', 'tooltip').attr('href', 'javascript:void(0)').attr('data-original-title', '车运费设置').css('text-decoration',  'none').append('<i class="bigger-125 icon-cog purple"></i>');
                    $btnCellWrap.append($btnset).appendTo($btnCell);
                    $item.append($btnCell);

                    $btnset.click(function(){
                        $('#conveyanceRateModal').modal('show');
                    });

                }
                if(qv.type == 3){ //管理费
                    $item.attr('id', 'manageCost').attr('qfaiId', qv.qfaiId);//管理费
                    $btnCell = $('<div></div>').addClass('cell btns');
                    $btnCellWrap = $('<div></div>').addClass('cell-wrap');
                    $btnset = $('<a></a>').attr('data-rel', 'tooltip').attr('href', 'javascript:void(0)').attr('data-original-title', '管理费设置').css('text-decoration',  'none').append('<i class="bigger-125 icon-cog purple"></i>');
                    $btnCellWrap.append($btnset).appendTo($btnCell);
                    $item.append($btnCell);

                    $btnset.click(function(){
                        $('#manageRateModal').modal('show');
                    });
                }
            }
            $item.attr('data-undisPrice',qv.discount == 0 && (qv.type < 2 || qv.type == 5) ? utils.changeThrDecimal(utils.accMul(qv.num ,  qv.unitPrice)):0);
            $item.attr('data-disPrice', qv.discount == 1 && (qv.type < 2 || qv.type == 5) ? utils.changeThrDecimal(utils.accMul(qv.num ,  qv.unitPrice)):0);

            return $item;
        },

        //创建添加功能区中的功能区
        createDomainTemplete : function(v){
            var $label = $('<label></label>').addClass('col-xs-6');
            var $radio = $('<input>').addClass('ace').attr({"name" : "quotempl", "type" : "checkbox"}).val(v.faId);
            var $span = $('<span></span>').addClass('lbl').text(v.functionAreaName);
            $label.append($radio).append($span);
            return $label;
        },
        //创建添加报价项天窗中的报价项

        createQuoteModalItem : function (v) {
            //"创建添加报价项天窗中的报价项"
            //"画弹窗的报价项"
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').css({"margin-bottom" : 0});

            var $label = $('<label></label>');
            var $input = $('<input>').attr({
                "type": "checkbox",
                "name": "modalQuots",
                "class": "ace ace-checkbox-2",
                "data-quotetionClassification": v.quotationClassification,
                "data-name": v.itemName,
                "data-itemPrice": v.unitPrice,
                "data-itemUnite": v.measurementUnit,
                "data-des": v.quotationItemDes,
                "data-workType": v.workType ? v.workType : "-",
                "data-discount": v.discount,
                "data-quotetionType" : v.quotationType,
                "data-quotetionTypeId" : v.quotationTypeId
            }).val(v.qiId);

            var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.itemName);
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var propertyArr = [
                ["类型:", v.quotationType, "grey"],
                ["分类:", v.quotationClassification, "grey"],
                ["大类:", v.quotationBigCategory, "grey"],
                ["小类:", v.quotationSmallCategory, "grey"],
                ["单位:", v.measurementUnit, "grey"],
                ["工种:", v.workType, "grey"],
                ["单价:", v.unitPrice, "grey"],
                ["打折:", v.discount == 0 ? '否' : '是', "red"],
                ["版本:", v.version, "grey"],
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $label.append($input).append($span).appendTo($h3);
            $liLine.append($h3).append($ulProperty);

            $input.change(function(){
                var $this = $(this);
                quote.recordQuots($this, $(this).is(':checked'));
            });

            return $liLine;
        },
        //创建左侧功能区金额统计标签
        createDomainMoney : function (sum, v) {
            var $item = $('<div></div>').addClass('col-md-12');
            var $dwrap = $('<label></label>').addClass('col-md-6 no-padding-right');
            var $dorder =$('<span class="order"></span>').text(v.index);//功能区排序
            var $dname = $('<span class="name"></span>').text(v.name);//功能区名字
            var $dsum = $('<label></label>').addClass('col-md-6 no-padding-left').text(sum);//折扣价

            $dwrap.append($dorder).append("  ").append($dname);
            $item.attr("data-qfaId" , v.qfaId ).append($dwrap).append($dsum);//存入功能区ID

            return $item;
        }
    };

    return {
        init : function(){

            //报价ID
            quo.quotetionId = params.quotetionId;

            //根据报价ID 获取报价信息(同步ajax)
            com.post(api.quotation.queryQuotetionByQid, {"quotetion.qid" : quo.quotetionId}, function(data){
                //左上角显示报价名称
                $('#quotetionName').text(data.quotetion.name);
                //将报价数据获取到全局变量中
                quo.basicParams = {
                    "quotetion.qid" : data.quotetion.qid,//报价Id
                    "quotetion.discount" : data.quotetion.discount,//报价折扣
                    "quotetion.version" : data.quotetion.version,//报价版本
                    "quotetion.totalPrice" : data.quotetion.totalPrice,//报价总额
                    "quotetion.manageRate" : data.quotetion.manageRate,//管理费比例
                    "quotetion.managePrice" : data.quotetion.managePrice,//管理费
                    "quotetion.trafficPrice" :data.quotetion.trafficPrice,//车运费
                };
                //报价版本存入
                quo.version = data.quotetion.version;
                //左上角显示的折扣
                $('#sumquoDiscount').text(data.quotetion.discount);
            },null, false);
            //通过报价ID获取报价项中的功能区
            com.post(api.quotation.queryQuotetionFunctionAreaByQid, {"quotetion.qid" : quo.quotetionId}, function(data){
                //将整数折扣换算为小数点(解决浮点数计算BUG)
                var _discount = utils.accDiv(quo.basicParams['quotetion.discount'], 10);
                var _undisPrice = 0, _disPrice = 0,_dtotalfee = 0, _transfee = 0, _managefee = 0;
                if(data.quotetionFunctionAreas.length){
                    //报价中的功能区

                    $.each(data.quotetionFunctionAreas, function(i, v){
                        var sum = 0,sumdp = 0, sumd = 0,$dmoney;
                        var $domain = painter.createdomain(v);
                        $domain.appendTo($('#functionAreaDetailList'));

                        if(v.type != 0 && v.type!=3){
                            sum = parseFloat($domain.attr('data-undisPrice'));//功能区非打折项总价
                            sumdp =  parseFloat($domain.attr('data-disPrice'));//功能区打折项折前总价
                            sumd = parseFloat($domain.attr('data-desTotalprice'));//功能区折后总价
                            $dmoney = painter.createDomainMoney(sumd, v);
                            $dmoney.appendTo($('#functionAreaSumList'));
                            //功能区打折项总价相加
                            _disPrice = utils.changeThrDecimal(utils.accAdd(_disPrice, sumdp));
                            //功能区非打折项总价相加
                            _undisPrice = utils.changeThrDecimal(utils.accAdd(_undisPrice, sum));
                            //功能区折后总价相加
                            _dtotalfee = utils.changeThrDecimal(utils.accAdd(_dtotalfee, sumd));
                        }else if(v.type != 0 && v.type == 3){
                            $dmoney = painter.createDomainMoney(sumd, v);
                            $dmoney.appendTo($('#functionAreaSumList'));
                        }
                    });
                    //管理费
                    var manageCost = $('#manageCost');
                    //车运费
                    var converyanceCost = $('#conveyanceCost');
                    //管理费折扣
                    _manageDiscount = manageCost.find('.discountprice').attr('data-discount') == "1" ? _discount : 1;
                    //车运费折扣
                    _transDiscount = converyanceCost.find('.discountprice').attr('data-discount') == "1" ? _discount : 1;
                    //获取管理费比例(根据报价版本获得)
                    _manageRate = parseFloat(manageCost.find('.discountprice .cell-wrap').text());
                    //获取车运费比例(根据报价版本获得)
                    _tranRate = parseFloat(converyanceCost.find('.unitprice .cell-wrap').text());
                    //未计算车运费之前的总价格*车运费比例=车运费
                    _transfee =  utils.changeThrDecimal(utils.accMul(utils.accAdd(_disPrice,_undisPrice), _tranRate));
                    //(未计算车运费之前的总价格+车运费)*管理费
                    _managefee = utils.changeThrDecimal(utils.accMul(utils.accAdd(utils.accAdd(_disPrice,_undisPrice), _transfee), _manageRate));
                    //车运费*车运费折扣
                    _dtransfee =  utils.changeThrDecimal(utils.accMul(_transfee, _transDiscount));
                    //(未计算车运费之前的总价格+车运费)*管理费比例*管理费折扣
                    _dmanagefee = utils.changeThrDecimal(utils.accMul(utils.accMul(utils.accAdd(utils.accAdd(_disPrice,_undisPrice), _transfee), _manageRate), _manageDiscount));
                    //未计算车运费之前的总价格+车运费+管理费=(未打折的总价格)
                    _total = utils.changeThrDecimal(utils.accAdd( utils.accAdd(utils.accAdd(_disPrice,_undisPrice) , _transfee),  _managefee));

                     //(未计算车运费之前的总价格+折扣后的车运费)+折扣后的管理费(打折后的总价格)
                    _dtotal = utils.changeThrDecimal(utils.accAdd(utils.accAdd(_dtotalfee, _dtransfee), _dmanagefee));
                    //显示到生成项目  车运费(未折扣的车运费)
                    converyanceCost.find('.num .cell-wrap').text(_dtransfee);
                    //显示到生成项目  管理费(未折扣的管理费)
                    manageCost.find('.num .cell-wrap').text(_dmanagefee);

                    $('#sumquoSumMoney').text(_total);
                    $('#sumquoDiscountMoney').text(_dtotal);

                    quo.basicParams["quotetion.totalPrice"] = _dtotal;
                    quo.basicParams["quotetion.managePrice"] = _managefee;//管理费
                    quo.basicParams["quotetion.trafficPrice"] = _transfee;//车运费
                    quo.basicParams["quotetion.trafficRate"] = _tranRate;//车运费比例
                    quo.basicParams["quotetion.undisPrice"] = _undisPrice;//非打折项折前总额
                    quo.basicParams["quotetion.disPrice"] =_disPrice;//打折项折前总额
                }

            }, null, false);
            quo.init();
            domain.init();
            quote.init();
        }
    };

})();

$(function(){
    $.extend(com.validator, {
        manageRate: {
                type: "v_manageRate",
                regex: /^(1\.0{1,3}|1|0\.[0-9]{1,3})$/,
                errorMsg: "请输入0到1之间的小数"
        }
    });

    QuotetionDetail.init();
});

