var ProtationDetail = (function(){
    
    var quo = {
        
        protationId: null, // 预签ID
        versionId : null, // 预签版本
        basicParams : null,
        
        quoModals : {},
        settingBtns : {},
        quoteCalculation : {},
        machingType : {},
        typeness: {},
        
        //定义左下角按钮重定义及指定弹窗显示
        initSettingBtns : function(){
            
            var that = this;
            
            that.settingBtns = {
                //保存
                $btnSave: com.focusPage('#saveProtationBtn').bindClick(function(){ // 保存预签信息
                    com.post(api.quotation.updateProtationForAdvance, quo.basicParams, function(res){
                        com.showAlert(com.info, "操作成功");
                    });
                },2000),
                //打印
                $btnPrint :com.focusPage('#printFinanceBtn').click(function () {
                    com.post(api.quotation.queryProtationByOrderId, {"protation.pid" : quo.protationId}, function(res) {
                        com.popup("打印预签", api.index.protationOutputIndex.url, null, null, true);
                    }, null, false);
                }),
                //返回
                $btnBack: com.focusPage('#detailBckBtn').on('click', function(){
                    com.showConfirm("当前页面存在重要数据,是否进行当前操作", function() {
                        com.switchPage("views/quotation/protationIndex.html");
                    });
                }),
                //展开
                $btnSpread :com.focusPage('#openFunctionAreasBtn').click(function(){
                    com.focusPage('.icon-chevron-down').parent().trigger('click');
                }),
                //收起
                $btnCollapse :com.focusPage('#closeFunctionAreasBtn').click(function(){
                    com.focusPage('.icon-chevron-up').parents('[data-action="collapse"]').trigger('click');
                }),
            };
            return that;
        },
        //左下角按钮的弹窗显示及处理  每个功能区右上角的编辑功能区,添加工程项,添加自定义工程项,历史记录,管理费比例设置 弹窗处理
        initQuoModals : function(areatype){
            
            var that = this;
            
            that.quoModals = {
                //添加默认预签项
                $quoteModal :com.focusPage("#protationItemModal").on("show.bs.modal", function(a) {
                    com.focusPage('input[name="modalQuots"]:checked').removeAttr('checked');
                }),
            };    
            
            var extraParams  = {"presignItem.ppid":  quo.protation.ppid, "presignItem.status": 0};
            
            if(areatype == 0){
                extraParams["types[0]"] = 0;
            }else if(areatype == 2){
                extraParams["types[0]"] = 1;
                extraParams["types[1]"] = 2;
            }
            
            //初始化预签项选择弹层
            var _condArr = ["quotation-presignItem-name", "quotation-presignItem-type"];
            var searcher = new Searcher();
            searcher.init( _condArr, "condList", api.quotation.pagePresignItem,  function(data){
                var $tableWrap =com.focusPage('#resultList').empty();
                var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
                
                if(data && data.length){
                    $.each(data,function(i, v){
                        painter.createQuoteModalItem(v).appendTo($ul);
                    });
                    $ul.appendTo($tableWrap);
                    //"pagequotetionItemByVersionId里面的quote.quotesRecord"
                    if(quote.quotesRecord.length){
                        $.each(quote.quotesRecord, function(index, val){
                            var $input = com.focusPage('input[name="modalQuots"][value="'+ $(val).val() +'"]');
                            $input.length &&($input.prop('checked',true)) ;
                        });
                    }
                }
            }, "pagenation", "protationDetailItemPostData", extraParams);

            return that;
        },
        //统计车运费管理费总价折扣价
        calculateQuoFees: function(func){
            
            var basic = 0, comd = 0, comm = 0, addd = 0, addm = 0, subd = 0, subm = 0, total = 0, cost = 0, profit = 0;
            
            //左上角展示区
            var $domains =com.focusPage('#functionAreaDetailList .widget-box');
            if(!$domains.length){
                return;
            }

            $domains.each(function(){
                
                var $this = $(this);
                
                var _cost = parseFloat($this.attr('data-cost'));
                var _basic =  parseFloat($this.attr('data-basic'));
                var _comd =  parseFloat($this.attr('data-comd'));
                var _comm =  parseFloat($this.attr('data-comm'));
                var _addd =  parseFloat($this.attr('data-addd'));
                var _addm =  parseFloat($this.attr('data-addm'));
                var _subd =  parseFloat($this.attr('data-subd'));
                var _subm =  parseFloat($this.attr('data-subm'));
                
                cost =  utils.changeThrDecimal(utils.accAdd(cost, _cost));
                basic =  utils.changeThrDecimal(utils.accAdd(basic, _basic));
                comd =  utils.changeThrDecimal(utils.accAdd(comd, _comd));
                comm =  utils.changeThrDecimal(utils.accAdd(comm, _comm));
                addd =  utils.changeThrDecimal(utils.accAdd(addd, _addd));
                addm =  utils.changeThrDecimal(utils.accAdd(addm, _addm));
                subd =  utils.changeThrDecimal(utils.accAdd(subd, _subd));
                subm =  utils.changeThrDecimal(utils.accAdd(subm, _subm));
                
                var amount = utils.changeThrDecimal(utils.accAdd(_basic, utils.accAdd(_addd, utils.accSub(_addm, utils.accAdd(_subd, _subm)))));
                
                total =  utils.changeThrDecimal(utils.accAdd(total, amount));
                
            });
            
            total = utils.accSub(utils.accSub(utils.accAdd(utils.accMul(utils.accSub(quo.basicParams["protation.cacelArea"], quo.basicParams["protation.quoteArea"]), quo.basicParams["protation.costPrice"]), quo.basicParams["protation.quotePrice"]), quo.basicParams["protation.preferPrice"]), quo.basicParams["protation.managePrice"]);
            total = utils.accAdd(total, utils.accAdd(basic, utils.accAdd(addd, utils.accSub(addm, utils.accAdd(subd, subm)))));
            
            quo.basicParams["protation.basicPrice"] = basic;
            quo.basicParams["protation.comdPrice"] = comd;
            quo.basicParams["protation.commPrice"] = comm;
            quo.basicParams["protation.adddPrice"] = addd;
            quo.basicParams["protation.addmPrice"] = addm;
            quo.basicParams["protation.subdPrice"] = subd;
            quo.basicParams["protation.submPrice"] = subm;
            quo.basicParams["protation.totalPrice"] = total;
            
            com.focusPage('#houstCost').text(cost);
            
            cost = utils.accAdd(utils.accAdd(utils.accMul(quo.basicParams["protation.addmPrice"], quo.basicParams["protation.mostRate"]), utils.accMul(quo.basicParams["protation.adddPrice"], quo.basicParams["protation.costRate"])), utils.accAdd(quo.basicParams["protation.mostCost"], utils.accAdd(utils.accMul(quo.basicParams["protation.cacelArea"], quo.basicParams["protation.costPrice"]), cost)));
            
            quo.basicParams["protation.basicCost"] = utils.accMul(quo.basicParams["protation.cacelArea"], quo.basicParams["protation.costPrice"])
            quo.basicParams["protation.addCost"] = utils.accAdd(utils.accMul(quo.basicParams["protation.adddPrice"], quo.basicParams["protation.costRate"]), utils.accMul(quo.basicParams["protation.addmPrice"], quo.basicParams["protation.mostRate"]))
            
            quo.basicParams["protation.totalCost"] = cost;
            
            com.focusPage('#basicCost').text(quo.basicParams["protation.basicCost"]);
            com.focusPage('#materialCost').text(quo.basicParams["protation.mostCost"]);
            com.focusPage('#addCost').text(quo.basicParams["protation.addCost"]);
            com.focusPage('#totalCost').text(quo.basicParams["protation.totalCost"]);
            
            profit = utils.changeThrDecimal(utils.accSub(1.0, utils.accDiv(cost, utils.accSub(total, quo.basicParams["protation.activityAmount"]))));
            
            com.focusPage('#profitRate').text(profit);
            
            com.focusPage('#sumquoSumMoney').text(total);
        },
        //计算功能区总价和折扣总价
        calculateDomainFees: function($domain, func){
            
            var basic = 0, comd = 0, comm = 0, addd = 0, addm = 0, subd = 0, subm = 0, cost = 0, total = 0;
            
            var $arr = com.focusPage('.fl-quo-item', $domain);
            
            $arr.each(function(){
                
                $this = $(this);
                
                if(func) func($this);
                
                var _type = $this.find(".cell.type").attr("data-type");
                
                var _total = $this.attr("data-total");
                var _cost = $this.attr("data-cost");
                
                cost =  utils.changeThrDecimal(utils.accAdd(cost, _cost));
                
                if(_type == 0) basic =  utils.changeThrDecimal(utils.accAdd(basic, _total));
                if(_type == 1) comd =  utils.changeThrDecimal(utils.accAdd(comd, _total));
                if(_type == 2) comm =  utils.changeThrDecimal(utils.accAdd(comm, _total));
                if(_type == 3) addd =  utils.changeThrDecimal(utils.accAdd(addd, _total));
                if(_type == 4) addm =  utils.changeThrDecimal(utils.accAdd(addm, _total));
                if(_type == 5) subd =  utils.changeThrDecimal(utils.accAdd(subd, _total));
                if(_type == 6) subm =  utils.changeThrDecimal(utils.accAdd(subm, _total));
                
            });
            
            $domain.attr('data-cost', cost);
            $domain.attr('data-basic', basic);
            $domain.attr('data-comd', comd);
            $domain.attr('data-comm', comm);
            $domain.attr('data-addd', addd);
            $domain.attr('data-addm', addm);
            $domain.attr('data-subd', subd);
            $domain.attr('data-subm', subm);
            
            return utils.changeThrDecimal(utils.accAdd(basic, utils.accAdd(addd, utils.accSub(addm, utils.accAdd(subd, subm)))));
        },
        calculateNowQuoteItem: function(num, areaType, $nowLine){
            
            var type = $nowLine.find(".cell.type").attr("data-type");
            
            var cost = parseFloat($nowLine.find('.unitprice').attr("data-cost"));
            var price = parseFloat($nowLine.find('.unitprice .cell-wrap').text());//单价
            var basicNum = parseFloat($nowLine.find('.unit .cell-wrap').text());
            
            var _total = 0;
            var _cost = 0;
            
            if(type == 0){
                _total = utils.changeThrDecimal(utils.accMul(price, utils.accSub(num, basicNum)));
                _cost = utils.changeThrDecimal(utils.accMul(cost, utils.accSub(num, basicNum)));
            }
            
            if(type == 3 || type == 4){ // 个性
                _total = utils.changeThrDecimal(utils.accMul(price, num));
                _cost = utils.changeThrDecimal(utils.accMul(cost, num));
            }
            
            if(type == 5 || type == 6){ // 增主材
                _total = utils.changeThrDecimal(utils.accMul(price, num));
                _cost = utils.changeThrDecimal(utils.accMul(cost, num));
            }
            
            $nowLine.find('.totalprice-discount .cell-wrap').text(_total); // 折扣单价*数量
            
            $nowLine.attr('data-total', _total);
            $nowLine.attr('data-cost', _cost);

            var _fee = quo.calculateDomainFees(domain.nowEditDomain);
            
            quo.calculateQuoFees();
            
            return _fee;
        },
        init : function () {
            this.initQuoModals();
            this.initSettingBtns();
        }
    };

    //功能区
    var domain = {
            
        nowEditDomain : null,
        
        //保存默认预签项  添加工程项按钮
        saveQuotesToDomain : function(){
           com.focusPage('#addFunctionAreaItemsBtn').click(function(){
                quote.addDefaultQuotes();
                quo.quoModals.$quoteModal.modal("hide");
            });
        },
        deleteQuotesToDomain : function() {
            quo.quoModals.$quoteModal.on('hide.bs.modal', function () {
                quote.quotesRecord = [];
            });
        },
        //绑定各种关于预签的操作
        init: function(){
            this.saveQuotesToDomain();
            this.deleteQuotesToDomain();
        }

    };
    //预签
    var quote = {
            
        quotesRecord  : [],
        $nowLine : null,
        $nowEditInput : null,
        
        getNumCellFocus : function($line){
            var that = this;
            //选中后代中带有*class的标签
            var $numCell = $line.find('.cell.formula');
            var $editInput = that.$nowEditInput ? that.$nowEditInput : $line.parents('.widget-body-inner').find('.fl-quo-input');
            //预签项的模块
            domain.nowEditDomain = $line.parents('.widget-box');
            quote.checkedStyle($line);
            //选中元素中input标签 val赋值为$numCell的文本值   并且点击input标签获取焦点      .focus()获取焦点     .select()选中
            $editInput.removeClass('hide').appendTo($numCell).find('input').val($numCell.find('.cell-wrap').text()).focus().select();
            that.$nowLine = $line;
            that.$nowEditInput = $editInput;
            that.$nowEditInput.find('input').off('keydown').on("keydown",function (e) {
                var $input = $(this);
                that.bindInputKeydown($input.val(), e);
            });
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

                var oldFormula = that.$nowLine.find('.cell.formula .cell-wrap').text();
                
                var oldNum = that.$nowLine.find('.cell.num .cell-wrap').text();

                //赋值给外部的公式显示
                that.$nowLine.find('.cell.formula .cell-wrap').text(formula);
                //赋值给外部显示DIV 显示数量

                that.$nowLine.find('.cell.num .cell-wrap').text(num);
                //获取下一个预签项的整体元素标签

                $line = that.$nowLine.next('.fl-quo-item');

                //获取预签项的类型
                var _type = that.$nowLine.find('.type').attr('data-type');
                
                var _num = that.$nowLine.find('.num .cell-wrap').text();

                var _basicNum = that.$nowLine.find('.unit .cell-wrap').text();

                if(_type == 0 && _num < _basicNum){
                    com.showAlert(com.warning, "工程量不能小于基础数量");
                    return false;
                }

                var args = {
                    "protationItem.piid" : that.$nowLine.find('input[name="deleteItems"]').val(), // 预签项Id, 可空 ;
                    "protationItem.name" : that.$nowLine.find('.name .cell-wrap').text(), // 预签项名

                    "protationItem.cost": that.$nowLine.find('.unitprice').attr("data-cost"),
                    "protationItem.price" :that.$nowLine.find('.unitprice .cell-wrap').text(), // 单价 ;
                    "protationItem.num" : that.$nowLine.find('.num .cell-wrap').text(), // 数量;
                    "protationItem.type": that.$nowLine.find('.type').attr("data-type"), // 类型
                };

                that.$nowLine.find('input[name="deleteItems"]').val(that.$nowLine.find('input[name="deleteItems"]').val());
                var _fee = quo.calculateNowQuoteItem(num, 1, that.$nowLine);
                com.clearValidator();
                var _params = $.extend({}, args, quo.basicParams);
                com.post(api.quotation.updateProtationItem, _params, function(res){
                    //选中左上角预签中的功能区ID 将总价格显示
                    com.focusPage('[data-pfaid="'+ domain.nowEditDomain.attr('data-pfaid') +'"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
                    that.$nowLine.find('input[name="deleteItems"]').val(res.protationItem.piid);
                }, function(res){
                    com.showAlert(com.error, res.errorMsg);
                    that.$nowLine.find('.cell.formula .cell-wrap').text(oldFormula);
                    that.$nowLine.find('.cell.num .cell-wrap').text(oldNum);
                    quo.calculateNowQuoteItem(oldNum, 1, that.$nowLine);
                }, false);
                
                if($line.length){
                    that.getNumCellFocus($line);
                }else{
                    that.hideInputWrap();
                }
                return;
            }
            //如果按键为上 调整焦点到功能区内上一个预签项
            if(e.keyCode == 38){
                $line = that.$nowLine.prev('.fl-quo-item');
                if($line.length){
                    that.getNumCellFocus($line);
                }else{
                    that.hideInputWrap();
                }
                return;
            }
            //如果按键为下  调整焦点到功能区内的下一个预签项
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
        //批量删除预签项
        deleteQuoteInBatches : function($domain){
            $domain.find('.fl-quo-input').insertAfter($domain.find('.fl-quo-list')).addClass('hide');
            var that = this;
            // , 参数 : qfaiIds[n] , 预签项Id列表 ;
            var $quos = com.focusPage('[name="deleteItems"]:checked', $domain);
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
                com.focusPage('[data-qfaid="'+ domain.nowEditDomain.attr('data-qfaid') +'"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
                quo.calculateQuoFees();
                _params = $.extend({},_params, quo.basicParams, {"quotetionFunctionArea.qfaId": domain.nowEditDomain.attr('data-qfaid')});
                com.post(api.quotation.deleteQuotetionFunctionAreaItem, _params, function(res){}, null, false);
            }
        },
        //删除预签项
        deleteQuote : function($quote){
            
            var that = this;
            var _pid = $quote.find('input[type="checkbox"]').val();
            var _params = {};
            
            domain.nowEditDomain = $quote.parents('.widget-box');
            domain.nowEditDomain.find('.fl-quo-input').insertAfter(domain.nowEditDomain.find('.fl-quo-list')).addClass('hide');
            
            if(!_pid){
                $quote.remove();
            }else{
                $quote.remove();
                var _fee = quo.calculateDomainFees(domain.nowEditDomain);
                com.focusPage('[data-pfaid="'+ domain.nowEditDomain.attr('data-pfaid') +'"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
                //调用   统计车运费管理费总价折扣价"
                quo.calculateQuoFees();
                _params = $.extend({"protationItem.piid": _pid}, quo.basicParams);
                com.post(api.quotation.deleteProtationItem, _params, function(res){

                }, null, false);
            }
        },
        /*添加预签项的时候记住上一页选中的预签项
         * 参数
         * $input : 正在操作的input标签
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
                if(!com.focusPage(e.target).is('.cell-wrap') && !com.focusPage(e.target).is('[data-action="collapse"]')){
                    that.hideInputWrap();
                }
            });
        },
        //删除上一个选中的预签项选中样式 并添加当前预签项选中样式
        checkedStyle : function($item){
            com.focusPage('.fl-quo-item.current').removeClass('current');
            $item.addClass('current');
        },
        calculationNum : function(){
           com.focusPage('#formula').blur(function(){
                var that = $(this) ;
                try {
                    var formula = that.val();
                    formula = formula.replace(/\s+/g,"");
                    var test = /([\D][\.][\D])|([\d][\.][\D])|([\D][\.][\d])|(\.$)|(^\.)|([\+\-\*\/\(][\+\-\*\/])|([^\d|^\+|^\-|^\*|^\/|^\.|^\(|^\)])/;
                    if(test.test(formula) || formula == null || formula == ''){
                       com.focusPage('#num').val('');
                        return false;
                    }
                    var num = utils.changeThrDecimal(eval(formula));
                    if(num<0 || num>10000000){
                       com.focusPage('#num').val('');
                        return false;
                    }
                    that.val(formula);
                   com.focusPage('#num').val(num);
                } 
                catch (e) {
                   com.focusPage('#num').val('');
                    return false;
                }
            });
        },
        //添加工程项 与  历史预签项 的保存按钮调用的保存方法
        addDefaultQuotes : function(){
            
            var _arrs = quote.quotesRecord;
            var _index = domain.nowEditDomain.find('.fl-quo-item').length;

            var _areaType = domain.nowEditDomain.attr("data-areatype");
            if(!_arrs.length){
                return;
            }
            
            $.each(_arrs, function(i, v){
                
                var $this = com.focusPage(v);
                
                if($this.val() && com.focusPage('input[data-qiid="' + $this.val() +'"]', domain.nowEditDomain).length){
                    return false;
                }
                
                var type = parseInt($this.attr("data-type"));
                
                if(type == 0 && _areaType != 0) return true;
                if([1, 2].indexOf(type) != -1 && _areaType != 2) return true;
                
                if([1, 2].indexOf(type) != -1) type = type + 2;
                
                var _quotval = {
                    "name" : $this.attr('data-name'),
                    "basicNum" : $this.attr('data-itemUnite'),
                    "formula":'0',
                    "num" : 0,
                    "qfaiid" : "",
                    "qfaid" : "",
                    "qiid" : "",
                    "type" : type,
                    "price" :  $this.attr('data-itemPrice'),
                    "cost": $this.attr('data-cost'),
                };
                
                var $item = painter.createQuote( _index + i + 1, _quotval).appendTo(domain.nowEditDomain.find('.fl-quo-list'));
            });
            quote.quotesRecord = [];
        },
        init : function(){
            this.clearQuoteSelected();
            this.calculationNum();
        }
    };

    var painter = {
        //创建功能区
        createdomain : function(dv){
            
            var that = this;
            var $domain,
                $dhead, $dname, $dtoolbar, $btns = {},
                $dbody, $dbodyInner, $list, $input;
            
            var _btnSet = {
                "$btnAdd": ["添加工程项", '<i class="bigger-125 icon-plus purple"></i>', dv.type == 0 || dv.type == 2],
                //"$btnDelQuo": ["批量删除项", '<i class="bigger-125 icon-remove pink"></i>', dv.type!=0],
                "$btnFold": ["折叠", '<i class="bigger-125 icon-chevron-up" functionindexdata="1" id="oneChevron_1"></i>', true]
            };
            
            var basic = 0, comd = 0, comm = 0, addd = 0, addm = 0, subd = 0, subm = 0, cost = 0, total = 0;
                
            $domain = $('<div></div>').addClass('widget-box transparent').attr({
                "data-dlevel" : dv.functionAreaOrder, // 排序
                "data-pfaid" : dv.pfaid, // 预签项中的功能区ID
                "data-areaType" : dv.type, //类型 功能区的type
                "data-total": dv.total,
                "data-cost": 0,
            }).css({"margin-bottom" : "20px"});

            $dhead = $('<div></div>').addClass('widget-header');
            $dname = $('<h5></h5>').append($('<em></em>').text(dv.type == 0 ? '' : dv.functionAreaOrder)).append('  ').append($('<strong></strong>').html(dv.name));
            $dtoolbar = $('<div></div>').addClass('widget-toolbar no-border');

            $.each(_btnSet, function(k, v){
                
                if(!v[2]) return true;
                
                $btns[k] = $('<a></a>').attr({"href" : "javascript:void(0)",}).css({"padding-left": "5px"}).append(v[1]).appendTo($dtoolbar).mouseenter(function(){
                    com.showTip(this, v[0], "top");
                });
            });

            $btns["$btnFold"].attr({"data-action" : "collapse"});

            $dbody = $('<div></div>').addClass('widget-body');
            $dbodyInner = $('<div></div>').addClass('widget-body-inner');
            $list = $('<ul></ul>').addClass('fl-quo-list');
            $input = $('<div></div>').addClass('fl-quo-input hide').append($('<input type="text">').addClass('v_required v_float').attr('maxlength','16'));

            $dhead.append($dname).append($dtoolbar);

            $dbodyInner.append($input).append($list).appendTo($dbody);

            $domain.append($dhead).append($dbody);

            if(dv.protationFunctionAreaItems.length) {
                //功能区中的预签项
                var _items = dv.protationFunctionAreaItems;

                $.each(_items, function (i, v) {
                    
                    var $item = that.createQuote(i + 1, v).appendTo($list);
                    
                    if(v.type == 0){
                        cost = utils.changeThrDecimal(utils.accAdd(cost, utils.accMul(v.cost, utils.accSub(v.num, v.basicNum))));
                    }else{
                        cost = utils.changeThrDecimal(utils.accAdd(cost, utils.accMul(v.cost, v.num)));
                    }
                    
                    if(v.type == 0) basic =  utils.changeThrDecimal(utils.accAdd(basic, utils.accMul(v.price, utils.accSub(v.num, v.basicNum))));
                    if(v.type == 1) comd =  utils.changeThrDecimal(utils.accAdd(comd, utils.accMul(v.price, v.num)));
                    if(v.type == 2) comm =  utils.changeThrDecimal(utils.accAdd(comm, utils.accMul(v.price, v.num)));
                    if(v.type == 3) addd =  utils.changeThrDecimal(utils.accAdd(addd, utils.accMul(v.price, v.num)));
                    if(v.type == 4) addm =  utils.changeThrDecimal(utils.accAdd(addm, utils.accMul(v.price, v.num)));
                    if(v.type == 5) subd =  utils.changeThrDecimal(utils.accAdd(subd, utils.accMul(v.price, v.num)));
                    if(v.type == 6) subm =  utils.changeThrDecimal(utils.accAdd(subm, utils.accMul(v.price, v.num)));
                });
            }
            
            $btns.$btnAdd && $btns.$btnAdd.click(function(){//添加工程预签项
                domain.nowEditDomain = $domain;
                var areatype = $(this).parents(".widget-box.transparent").attr("data-areatype");
                quo.initQuoModals(areatype);
                quo.quoModals.$quoteModal.modal("show");
                com.focusPage('#addItemFunctionAreaIndex').val(dv.qfaId);
            });
            
            $btns.$btnDelQuo && $btns.$btnDelQuo.click(function(){//批量删除预签项
                quote.deleteQuoteInBatches($domain);
            });
            
            $domain.attr('data-cost', cost);
            $domain.attr('data-basic', basic);
            $domain.attr('data-comd', comd);
            $domain.attr('data-comm', comm);
            $domain.attr('data-addd', addd);
            $domain.attr('data-addm', addm);
            $domain.attr('data-subd', subd);
            $domain.attr('data-subm', subm);

            return $domain;
        },
        //创建预签项
        createQuote : function(linenum, qv){

            var $item = $('<li></li>').addClass('fl-quo-item').prop('title', qv.content);
            
            var _dcp = 0;
            var _num = qv.num;
            var _unitPrice = qv.price;
            var _type = qv.type;
            var _total = 0;
            var _cost = 0;
            
            var _typeName = "-";
            
            if(qv.type == 0){
                _typeName = "信息";
                _total = utils.changeThrDecimal(utils.accMul(_unitPrice, utils.accSub(_num, qv.basicNum)));
                _cost = utils.changeThrDecimal(utils.accMul(qv.cost, utils.accSub(_num, qv.basicNum)));
            }
            
            if(_type == 1 || qv.type == 2){ // 基础工程
                _typeName = "基础"
            }
            
            if(qv.type == 3 || qv.type == 4){ // 个性
                _typeName = "个性";
                _total = utils.changeThrDecimal(utils.accMul(_unitPrice, _num));
            }
            
            if(qv.type == 5 || qv.type == 6){ // 增主材
                _typeName = "减项";
                _total = utils.changeThrDecimal(utils.accMul(_unitPrice, _num));
            }
            
            var _lineSet = [
                ["line", linenum,["data-areaType",qv.areaType]], // 编号
                ["formula",qv.num ? qv.num : "0"], // 公式
                ["num", qv.num,["data-subtype",qv.subtype]], // 数量
                ["name", qv.name,["data-piid",qv.piid]], // 预签名称
                ["type", _typeName , ["data-type", qv.type]],
                ["unit", qv.basicNum], // 单位
                ["worktype", qv.workType], // 工种
                ["price unitprice", _unitPrice, ["data-cost", qv.cost]], // 单价
                ["price discountprice", _unitPrice, ["data-discount", 0]], // 折扣后的价格   将折扣存入
                ["price totalprice-discount", _total], // 根据类型计算(数量*折扣)
            ];
            
            var $btnCell, $btnCellWrap, $inputLable, $input, $ispan, $btnDel;

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
            $inputLable = $('<label></label>');
            $input = $('<input>').addClass('cbox ace').attr({
                "type" : "checkbox",
                "role" : "checkbox",
                "name" : "deleteItems",
                "data-qiid" : qv.qiid ? qv.qiid : "",
            }).val(qv.piid);
            $ispan = $('<span></span>').addClass('lbl align-top');

            $inputLable.append($input).append($ispan);
            $btnCellWrap.appendTo($btnCell);
            $item.append($btnCell);

            $btnDel = $('<a></a>').attr({"href" : "javascript:void(0)"}).css({"padding-left": "5px"}).append('<i class="bigger-125 icon-remove pink"></i>').mouseenter(function(){
                //com.showTip(this, "删除预签项", "top");
            }); // 初始化提示框
            
            if(qv.type == 0) {
                $input.attr("disabled", "disabled");
            }
            
            if(qv.type == 1 || qv.type == 2) {
                $input.attr("disabled", "disabled");
            }
            
            $btnCellWrap.append($inputLable).append($btnDel);
            
            //各种绑定事件
            $item.click(function(){//编辑数量
                quote.getNumCellFocus($item);
            });
            
            //删除预签项
            $btnDel.click(function(e){
                
                e.stopPropagation();
                
                if([0, 3, 4, 5, 6].indexOf(qv.type) != -1) quote.deleteQuote($item);
                
                if([1, 2].indexOf(qv.type) != -1) {
                    
                    var _domain = com.focusPage('.widget-box[data-pfaid="4"]').find(".fl-quo-list");
                    var _index = _domain.find(".fl-quo-item").length;
                    
                    var args = $.extend({}, qv);
                    
                    args.type = args.type + 4;
                    args.num = 0;
                    args.piid = null;
                    
                    painter.createQuote( _index + 1, args).appendTo(_domain);
                }
                
                return false;
            });
            
            $item.attr('data-total', _total);
            $item.attr('data-cost', _cost);
            
            return $item;
        },

        //创建添加功能区中的功能区
        createDomainTemplete : function(v){
            var $label = $('<label></label>').addClass('col-xs-6');
            var $radio = $('<input>').addClass('ace').attr({"name" : "quotempl", "type" : "checkbox"}).val(v.faid);
            var $span = $('<span></span>').addClass('lbl').text(v.name);
            $label.append($radio).append($span);
            return $label;
        },
        //创建添加预签项天窗中的预签项

        createQuoteModalItem : function (v) {
            //"创建添加预签项天窗中的预签项"
            //"画弹窗的预签项"
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').css({"margin-bottom" : 0});

            var $label = $('<label></label>');
            var $input = $('<input>').attr({
                "type": "checkbox",
                "name": "modalQuots",
                "class": "ace ace-checkbox-2",
                "data-name": v.name,
                "data-cost": v.cost,
                "data-itemPrice": v.price,
                "data-itemUnite": v.basicNum,
                "data-des": v.common,
                "data-type": v.type,
            }).val(v.qiid);
            var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.name);
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            
            var propertyArr = [
                ["类型:", v.type, "red"],
                ["单位:", v.basicNum, "red"],
                ["单价:", v.price, "blue"],
                ["版本:", v.ppid, "grey"],
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
            var $dorder =$('<span class="order"></span>').text(v.functionAreaOrder);//功能区排序
            var $dname = $('<span class="name"></span>').text(v.name);//功能区名字
            var $dsum = $('<label></label>').addClass('col-md-6 no-padding-left').text(utils.changeThrDecimal(sum));//折扣价

            $dwrap.append($dorder).append("  ").append($dname);
            $item.attr("data-pfaid" , v.pfaid).append($dwrap).append($dsum);//存入功能区ID

            return $item;
        }
    };

    return {
        
        init: function(){
            quo.protationId = params.protationId;
            
            com.post(api.quotation.queryProtationByPid, {"protation.pid" : quo.protationId}, function(data){
              //左上角显示预签名称
                com.focusPage('#protationName').text(data.protation.name);
                
                 //将预签数据获取到全局变量中
                 quo.basicParams = {
                     "protation.pid" : data.protation.pid,//预签Id
                     "protation.quotePrice" : data.protation.quotePrice, // 起预签
                     "protation.quoteArea" : data.protation.quoteArea, // 起报面积
                     "protation.unitPrice" : data.protation.unitPrice, // 起报面积
                     "protation.costPrice" : data.protation.costPrice, // 成本单价
                     "protation.totalCost" : data.protation.totalCost, //成本总额
                     "protation.totalProfit" : data.protation.totalProfit, //利润总额
                     "protation.costRate" : data.protation.costRate,//工程增项成本比例
                     "protation.mostRate" : data.protation.mostRate,//主材增项成本比例
                     "protation.mostPrice" : data.protation.mostPrice,//主材成本
                     "protation.preferPrice" : data.protation.preferPrice, //优惠价
                     "protation.managePrice" : data.protation.managePrice, //管理费
                     "protation.profitRate" : data.protation.profitRate, // 利润率
                     "protation.basicPrice" : data.protation.basicPrice, // 基础额
                     "protation.comdPrice" :data.protation.comdPrice, // 工程额
                     "protation.commPrice" :data.protation.commPrice, // 主材额
                     "protation.adddPrice" :data.protation.adddPrice, // 增工额
                     "protation.addmPrice" :data.protation.addmPrice, // 增主额
                     "protation.subdPrice" :data.protation.subdPrice, // 减工额
                     "protation.submPrice" :data.protation.submPrice, // 减主额
                     "protation.totalPrice" :data.protation.totalPrice, // 总额
                 };
                 quo.protation = data.protation;
            }, null, false);
            
            com.post(api.decoration.queryDecorationForCommonByOrderId, {"decoration.orderId": quo.protation.orderId}, function(res){
                quo.decoration = res.decoration;
                quo.basicParams["protation.cacelArea"] = res.decoration.house.innerArea;
            }, null, false);
            
            com.post(api.decoration.amountDecorationActivity, {"decorationActivity.orderId": quo.protation.orderId, "decorationActivityItem.daiid": 0}, function(res){
                quo.basicParams["protation.activityAmount"] = res.decorationActivity.amount;
            }, null, false);
            
            var protationFunctionAreas = [{
                "pfaid": 1, "name": "基础", "functionAreaOrder": 1, "functionAreaType": 0, "type": 0, total: 0, index: 1,
                "protationFunctionAreaItems":[],
            }, {
                "pfaid": 2, "name": "标配", "functionAreaOrder": 2, "functionAreaType": 0, "type": 1, total: 0, index: 2,
                "protationFunctionAreaItems":[],
            }, {
                "pfaid": 3, "name": "个性", "functionAreaOrder": 3, "functionAreaType": 0, "type": 2, total: 0, index: 3,
                "protationFunctionAreaItems":[],
            }, {
                "pfaid": 4, "name": "减项", "functionAreaOrder": 4, "functionAreaType": 0, "type": 3, total: 0, index: 4,
                "protationFunctionAreaItems":[],
            }];
            
            com.post(api.quotation.queryProtationItemByPid, {"protationItem.pid": quo.protationId}, function(res){
                $.each(res.protationItems, function(i, v){
                    var type = (v.type + v.type % 2) / 2;
                    protationFunctionAreas[type].protationFunctionAreaItems.push(v);
                });
            }, null, false);
            
            var basic = 0, comd = 0, comm = 0, addd = 0, addm = 0, subd = 0, subm = 0, total = 0, cost = 0, profit = 0;
            
            $.each(protationFunctionAreas, function(i, v){
                
                var $domain = painter.createdomain(v).appendTo(com.focusPage('#functionAreaDetailList'));
                
                var _cost = parseFloat($domain.attr('data-cost'));
                var _basic =  parseFloat($domain.attr('data-basic'));
                var _comd =  parseFloat($domain.attr('data-comd'));
                var _comm =  parseFloat($domain.attr('data-comm'));
                var _addd =  parseFloat($domain.attr('data-addd'));
                var _addm =  parseFloat($domain.attr('data-addm'));
                var _subd =  parseFloat($domain.attr('data-subd'));
                var _subm =  parseFloat($domain.attr('data-subm'));
                
                cost =  utils.changeThrDecimal(utils.accAdd(cost, _cost));
                basic =  utils.changeThrDecimal(utils.accAdd(basic, _basic));
                comd =  utils.changeThrDecimal(utils.accAdd(comd, _comd));
                comm =  utils.changeThrDecimal(utils.accAdd(comm, _comm));
                addd =  utils.changeThrDecimal(utils.accAdd(addd, _addd));
                addm =  utils.changeThrDecimal(utils.accAdd(addm, _addm));
                subd =  utils.changeThrDecimal(utils.accAdd(subd, _subd));
                subm =  utils.changeThrDecimal(utils.accAdd(subm, _subm));
                
                var amount = utils.changeThrDecimal(utils.accAdd(_basic, utils.accAdd(_addd, utils.accSub(_addm, utils.accAdd(_subd, _subm)))));
                
                $dmoney = painter.createDomainMoney(amount, v).appendTo(com.focusPage('#functionAreaSumList'));
            });
            
            var mostCost = quo.basicParams["protation.mostPrice"];

            com.post(api.quotation.queryProtationCost, {"protationCost.pid": quo.basicParams["protation.pid"]}, function(res){
                $.each(res.protationCosts, function(i, v){
                    
                    if(quo.basicParams["protation.cacelArea"] > v.lowlimit){
                        mostCost = utils.accAdd(mostCost, utils.accMul(utils.accSub(quo.basicParams["protation.cacelArea"], v.lowlimit), v.costPrice));
                    }
                    
                });
            }, null, false);
            
            quo.basicParams["protation.mostCost"] = mostCost;
            quo.basicParams["protation.houseCost"] = cost;
            
            total = utils.accSub(utils.accSub(utils.accAdd(utils.accMul(utils.accSub(quo.basicParams["protation.cacelArea"], quo.basicParams["protation.quoteArea"]), quo.basicParams["protation.costPrice"]), quo.basicParams["protation.quotePrice"]), quo.basicParams["protation.preferPrice"]), quo.basicParams["protation.managePrice"]);
            total = utils.accAdd(total, utils.accAdd(basic, utils.accAdd(addd, utils.accSub(addm, utils.accAdd(subd, subm)))));
            
            quo.basicParams["protation.basicPrice"] = basic;
            quo.basicParams["protation.comdPrice"] = comd;
            quo.basicParams["protation.commPrice"] = comm;
            quo.basicParams["protation.adddPrice"] = addd;
            quo.basicParams["protation.addmPrice"] = addm;
            quo.basicParams["protation.subdPrice"] = subd;
            quo.basicParams["protation.submPrice"] = subm;
            quo.basicParams["protation.totalPrice"] = total;
            
            cost = utils.accAdd(utils.accAdd(utils.accMul(quo.basicParams["protation.addmPrice"], quo.basicParams["protation.mostRate"]), utils.accMul(quo.basicParams["protation.adddPrice"], quo.basicParams["protation.costRate"])), utils.accAdd(quo.basicParams["protation.mostCost"], utils.accAdd(utils.accMul(quo.basicParams["protation.cacelArea"], quo.basicParams["protation.costPrice"]), cost)));
            
            quo.basicParams["protation.totalCost"] = cost;
            
            com.focusPage('#quotePrice').text(quo.basicParams["protation.quotePrice"]);
            com.focusPage('#quoteArea').text(quo.basicParams["protation.quoteArea"]);
            com.focusPage('#cacelArea').text(quo.basicParams["protation.cacelArea"]);
            com.focusPage('#preferPrice').text(quo.basicParams["protation.preferPrice"]);
            com.focusPage('#managePrice').text(quo.basicParams["protation.managePrice"]);
            
            com.focusPage('#sumquoSumMoney').text(total);
            
            quo.basicParams["protation.basicCost"] = utils.accMul(quo.basicParams["protation.cacelArea"], quo.basicParams["protation.costPrice"])
            quo.basicParams["protation.materialCost"] = quo.basicParams["protation.materialCost"]
            quo.basicParams["protation.addCost"] = utils.accAdd(utils.accMul(quo.basicParams["protation.adddPrice"], quo.basicParams["protation.costRate"]), utils.accMul(quo.basicParams["protation.addmPrice"], quo.basicParams["protation.mostRate"]))
            
            com.focusPage('#basicCost').text(quo.basicParams["protation.basicCost"]);
            com.focusPage('#materialCost').text(quo.basicParams["protation.mostCost"]);
            com.focusPage('#addCost').text(quo.basicParams["protation.addCost"]);
            com.focusPage('#houstCost').text(quo.basicParams["protation.houseCost"]);
            com.focusPage('#totalCost').text(quo.basicParams["protation.totalCost"]);
            
            profit = utils.changeThrDecimal(utils.accSub(1.0, utils.accDiv(cost, utils.accSub(total, quo.basicParams["protation.activityAmount"]))));
            
            com.focusPage('#profitRate').text(profit);
            
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

    ProtationDetail.init();
});

