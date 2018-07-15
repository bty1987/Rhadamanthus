
jQuery(function($) {

    var way={};
    var type={};
    var banks ={};
    var _banks=[];
    var vpayment = {

        saveBtn: null,
        modal: null,
        items: {
            mno : $('#mno'),
            orderId:$('#orderId'),
            type : $('#type'),
            brand : $('#brand'),
            money : $('#money'),
            comment:$('#comment'),
        }
    };

    var vpaymentPostData={};

    vpayment.saveBtn = $("#saveBtn").on("click", saveData);

    vpayment.modal = $("#vpaymentModal");
    vpayment.modal.on('show.bs.modal',function(e){
        com.clearValidator("#vpayment.item", true);
    });


    com.post(api.ds.information,{},function(res){
        $("#type").bindData(res.vpayment,"key","value");
        $("#cashInfo").bindData(res.ways,"key","value");
        $("#couponType").bindData(res.couponType,"key","value");
        $.each(res.vpayment,function(i,v){
            type[v.key]=v.value;
        })
        $.each(res.ways,function(i,v){
            way[v.key]=v.value;
        })
        $.each(res.banks,function(i,v){
            banks[v.key]=v.value;
            _banks.push(v);
        })
        $.each(res.couponType,function(i,v){
            couponType[v.key]=v.value;
        })
    },null,false);

    $("#couponType").chosen({width: "100%", multi_type: "input"});


    $("#bankAdd").on('click',function(){

        var num = $(this).attr("num");
        var nextNum = parseInt(num)+1;

        addBankDiv(nextNum);
        $(this).attr("num", nextNum);

        return false;
    });

    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue'));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnCol = $('<a></a>').addClass('btn btn-minier btn-primary').html('收款');

            var propertyArr = [
                ["会员号:", v.mno, "grey"],
                ["创建人:", v.creater.currentName, "grey"],
                ["创建时间:", v.createTime, "blue"],
                ["收款人:", v.collecter.currentName, "grey"],
                ["收款时间:", v.collectTime, "blue"],
                ["类型:",  type[v.type] , "grey"],
                ["品牌:", v.brand==null||v.brand==""?"---":v.brand , "grey"],
                ["应收金额:", v.money, "blue"],
                ["状态:",v.status==1 ? "已付款" : "未付款", "red"],
                ["备注:", v.comment , "grey"],
            ];

            var $label = $('<label></label>').addClass('control-label').css({
                'color': 'grey',
                'font-size': '20px',
                "font-weight": "bold"
            });

            var _label = $('<label></label>');

            var $input = $('<input>').attr({
                "type": "checkbox",
                "name": "vpids",
                "class": "",
                "vpid":v.vpid,
                "mno":v.mno,
                "orderId":v.orderId,
                "money":v.money,
                "status":v.status,
            }).addClass('ace ace-checkbox-2');

            var _span = $('<span></span>').addClass('lbl blue bigger-150').css('font-weight', 'bold').html(type[v.type])

            _label.append($input).append(_span).appendTo($label)

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);

                $label.appendTo($h3);
            });

            $divBtnWrap.append($btnCol).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            //收款
            $btnCol.click(function () {

                $('#referMoney').val(v.money);
                var $layerrAdd = $('#layerAdd');
                $layerrAdd.attr('vpid', v.vpid);
                $layerrAdd.attr('mno',v.mno);

                var vpids = [v.vpid];
                openlayer($btnCol.html(), function () {

                    var referMoney = $('#referMoney').val();
                    var flagCoupon = true;

                    var _coupon = 0;
                    var _couponInfo = "#";
                    $("li[class='search-choice']", $('#couponType_chosen')).each(function (i, v) {

                        var _ = $(v);
                        var _couponVal = _.find('input[name="multi_input"]').val();

                        if (_couponVal < 0) {
                            flagCoupon = false;
                        }
                        if (_couponVal == "") {
                            _couponVal = 0;
                        }

                        _coupon = utils.accAdd(parseFloat(_coupon), parseFloat(_couponVal));
                        _couponInfo += _.find('span').text() + ":" + _couponVal + "#";

                    });

                    if (!flagCoupon) {
                        layer.msg('代金券价格填写错误');
                        return
                    }

                    collectPayments(vpids,referMoney,_coupon,_couponInfo);
                });

            });

            return $liLine;

        };

        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();

    var searcher = new Searcher();

    searcher.init(["vp_mno","vp_brand","v_createrName"], "condList", api.information.pageVpayment, function(data){
        displayFunc.init('resultList', data);

    }, "pagenation", "vpaymentPostData",{"vpayment.status":0}, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'createVpayment').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $batch = $('<a></a>').addClass('btn btn-minier pull-left btn-info').attr('name', 'collects').css("margin", "0px 3px");
        var $batchi = $('<i></i>').addClass('icon-money bigger-110').appendTo($batch);
        var $batchspan = $('<span></span>').text('批量收款').appendTo($batch);
        
        $batch.click(function () {

            var $inputs = $('input[name="vpids"]:checked', '#resultList');

            var _mno="";
            var vpid=[];
            var mnoId=[];
            var vpids = [];
            var mnoIdArr=[];
            var referMoney=0;
            var flags = [];
            var flag = 0;
            var _paymentType = 0;

            vpaymentPostData.paymentInfo=[];

            $.each($inputs, function (i, v) {
                var $input = $(v);

                var row = {
                    "vpid": $input.attr('vpid'),
                    "mno": $input.attr("mno"),
                    "orderId":$input.attr("orderId"),
                    "money": $input.attr("money"),
                    "status": $input.attr("status"),
                };
                flags.push(row.status);
                vpaymentPostData.mno = _mno;

                if (_paymentType == 0) {
                    _paymentType = row.status;
                }

                vpaymentPostData.paymentInfo.push(row);

                mnoIdArr.push(row.mno);
                vpids.push(row.vpid);

                referMoney += parseFloat(row.money);
            });

            $.each(mnoIdArr, function (i, v) {
                if ($.inArray(v, mnoId) == -1) {
                    mnoId.push(v);
                }
            });

            $.each(flags, function (i, v) {
                if (["1"].indexOf(v) != -1) {
                   flag = 1;
                }
            });

            if(!$inputs.length){
                com.showAlert(com.warning, "请选择结算款项");
                return false;
            }

            if (flag == 1) {
                com.showAlert(com.warning, "批量收款不支持已收款");
                return false;
            }

            if (mnoId.length != 1) {
                com.showAlert(com.warning, "批量收款不支持不同订单间的操作.")
                return false;
            }

            $('#layerAdd').attr('mno',mnoId[0]);

            $('#referMoney').val(referMoney);

            openlayer($batchspan.text(), function () {
                var flagCoupon = true;

                var _coupon = 0;
                var _couponInfo = "#";
                $("li[class='search-choice']", $('#couponType_chosen')).each(function (i, v) {

                    var _ = $(v);
                    var _couponVal = _.find('input[name="multi_input"]').val();

                    if (_couponVal < 0) {
                        flagCoupon = false;
                    }
                    if (_couponVal == "") {
                        _couponVal = 0;
                    }

                    _coupon = utils.accAdd(parseFloat(_coupon), parseFloat(_couponVal));
                    _couponInfo += _.find('span').text() + ":" + _couponVal + "#";

                });

                if (!flagCoupon) {
                    layer.msg('代金券价格填写错误');
                    return
                }

                collectPayments(vpids, referMoney,_coupon,_couponInfo);
            });

        });

        return [$batch,$adda];
    }, 'resultList');

    //添加
    $('a[name="createVpayment"]', '#pagenation').click(function(){
        com.updateChosen("collecter", "", "");
        com.cleanItems(vpayment.items);
        $("#vpaymentModal").modal("show");
        var $_modalBody = $('.modal-body');
        var _brand=$_modalBody.find('input[name="brand"]');
        _brand.attr('readonly',"readonly");
        _brand.removeClass('v_required');
        $('#type').on('change', function(){
            var way = $_modalBody.find('select[name="type"] option:selected').val();
            var $brand = $_modalBody.find('input[name="brand"]');
            if(way == 0 || way == 1){
                $brand.attr('readonly',"readonly");
                $brand.removeClass('v_required');
            }else if(way == 2 || way == 3){
                $brand.removeAttr('readonly');
                $brand.addClass('v_required');
            }
        });
        com.clearValidator();
    });

    var hdisplayFunc  = (function(){

        var hrenderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = hcreatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var hcreatLine = function(v){

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue'));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-pink').html('打印');

            var propertyArr = [
                ["会员号:", v.mno, "grey"],
                ["创建人:", v.creater.currentName, "grey"],
                ["创建时间:", v.createTime, "blue"],
                ["收款人:", v.collecter.currentName, "grey"],
                ["收款时间:", v.collectTime, "blue"],
                ["类型:",  type[v.type] , "grey"],
                ["品牌:", v.brand==null||v.brand==""?"---":v.brand , "grey"],
                ["应收金额:", v.money, "blue"],
                ["状态:",v.status==1 ? "已付款" : "未付款", "red"],
                ["备注:", v.comment , "grey"],
            ];

            var $label = $('<label></label>').addClass('control-label').css({
                'color': 'grey',
                'font-size': '20px',
                "font-weight": "bold"
            });

            var _label = $('<label></label>');

            var _span = $('<span></span>').addClass('lbl blue bigger-150').css('font-weight', 'bold').html(type[v.type])

            _label.append(_span).appendTo($label)

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);

                $label.appendTo($h3);

            });

            $divBtnWrap.append($btnPrint).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnPrint.click(function(){

                params.vpayment = v;
                com.popup("专用收款收据__会员编号:" + v.mno  ,api.index.vpaymentReceiptIndex.url ,function () {
                    parent.layer.getFrameIndex(window.name);
                },null,true)

            });

            var styleArr = [];

            v.cash != null && v.cash != "0" ? styleArr.push(["现金:", v.cash, "blue"]) : true;
            v.bank != null && v.bank != "0" ? styleArr.push(["银行:", (function (bank, bankInfo) {
                var info = bank + ", ";
                var _s = bankInfo.split('#');
                for (var i = 1; i < _s.length - 1; i++) {
                    var _i = _s[i].split('|');
                    info += banks[_i[0]] + " " + _i[1] + ", ";
                }
                return info
            })(v.bank, v.bankInfo), "blue"]) : true;
            v.coupon != null && v.coupon != "0" ? styleArr.push(["优惠券:", v.coupon + v.couponInfo.split('#').join(' '), "blue"]) : true;

            $.each(styleArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulStyle);
                $label.appendTo($h3);
            });

            $liLine.append($h3).append($ulProperty).append($ulStyle);

            return $liLine;

        };

        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                hrenderList(tableId,listData);
            },
            drawLine : function(v){
                return hcreatLine(v);
            }
        }
    })();

    var hsearcher = new Searcher();

    hsearcher.init(["vp_mno","vp_brand","v_createrName"], "hcondList", api.information.pageVpayment, function(data){
        hdisplayFunc.init('hresultList', data);

    }, "hpagenation", "hvpaymentPostData",{"vpayment.status":1}, false, null, function(){

    }, 'hresultList');

    function openlayer(type, callback) {
        layer.closeAll();
        var index = layer.open({
            type: 1,
            title: type,
            content: $('#layerAdd'),
            area: ["650px", ( $(window).height() * 0.84 < 750 ? $(window).height() * 0.84 : 750 ) + "px"],
            maxmin: false,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                if(com.validate('layerAdd')){
                    return;
                }
                callback(index, layero);
                searcher.doSearch();
                hsearcher.doSearch();
            },
            btn2: function (index, layero) {
                com.clearValidator();
                searcher.doSearch();
                closeLayer();
            },
            cancel: function () {
                com.clearValidator();
                searcher.doSearch();
                closeLayer();
            }
        });
    }

    function closeLayer() {

        $('#layerAdd').removeAttr("mno");
        $('#layerAdd').removeAttr("vpid");

        $('[name="top"]').addClass('hide');
        $('#cash').val("");
        $('#bankAdd').attr("num", 0);
        $('input[type="checkbox"]','#form').removeAttr('checked')
        $('#bank').val("");
        $('#bankDivGroup').empty();
        $('.search-choice').find('input').val('');
        $('#collectDes').val("");

    }

    function saveData(){
        if(com.validate()){
            return;
        }
        var $_modalBody = $('.modal-body');
        var mno= $("#mno").val();
        var orderId=$("#orderId").val();
        var type = $_modalBody.find('select[name="type"] option:selected').val();
        var brand = $_modalBody.find('input[name="brand"]').val();
        var money = $("#money").val();
        var comment=$("#comment").val();
        var options = {
            'vpayment.mno': mno,
            'vpayment.orderId':orderId,
            'vpayment.type': type,
            'vpayment.brand':brand,
            'vpayment.money': money,
            'vpayment.comment': comment
        };
        com.post(api.information.createVpayment, options, function(res){
            searcher.doSearch();
            com.cleanItems(vpayment.items);
            com.clearValidator();

            com.showAlert(com.info, "操作成功");
        });

        vpayment.modal.modal("hide");
    }


    $('input[name="brand"]').typeahead({
        url: api.data.queryBrandForPinYinName,//获取下拉列表的接口
        list: [],
        postData: {},//获取下拉列表的参数
        source: function (query, process) {
            var options = $.extend({pinyinName : query}, this.options.postData);
            com.post(this.options.url, options, $.proxy(this.options.callback, this));
        }, matcher: function (item) {
            return true;
        }, callback: function (data) {
            this.options.list = data["brands"];
            this.flprocess(this.options.list, ["bid"], ["brandName"]);
        },
        isResultTypeMap: true //必填值为true，获取key，value的标识，
        , flupdater: function (k, v) {//下拉列表选中时的一些处理，必填对选中项的key和value做处理
            $('input[name="brand"]').attr('data-brand',v);
            return v;
        }
    });

    //批量收款
    function collectPayments(vpids, referMoney,coupon,couponInfo) {

        var layerAdd = $('#layerAdd');
        var bankAdd = $("#bankAdd");
        var mno = $('#layerAdd').attr('mno');

        var referMoney = parseFloat(referMoney);

        checkPaymentHideFlag();

        var _bank = 0;
        var _bankInfo = "#";

        var num = parseInt(bankAdd.attr("num"));
        for (var j = 0; j < num; j++) {
            var index = j + 1;
            var bankName = $("#bankName_" + index).val();
            var bankMoney = $("#bank_" + index).val();
            var bankDate = $("#bankDate_" + index).val();
            var bankTime = $("#bankTime_" + index).val();

            _bankInfo += bankName + "|" + bankMoney + "|" + bankDate + " " + bankTime + "#";

            _bank = utils.accAdd(parseFloat(bankMoney), _bank);
        }

        var cash = layerAdd.find('#cash').val();
        var cashInfo = layerAdd.find('#cashInfo').val();

        var bank = _bank;
        var bankInfo = _bankInfo;

        var des = $('#collectDes').val();
        var realMoney = parseFloat(cash != "" ? cash : 0) + parseFloat(bank != "" ? bank : 0) + parseFloat(coupon != "" ? coupon : 0);

        if (referMoney != realMoney) {
            com.showAlert(com.warning, "当前实收款项总数与应收款项不等,请核实再进行提交!");
            return false;
        }

        var option = {
            // "vpayment.vpid": vpid,
            "vreceipt.cash": cash == "" ? 0 : cash,
            "vreceipt.bank": bank == "" ? 0 : bank,
            "vreceipt.bankInfo": bankInfo,
            "vreceipt.coupon":coupon=="" ? 0: coupon,
            "vreceipt.couponInfo": couponInfo,
            "vreceipt.comment": des,
        };


        $.each(vpids, function (i, v) {
            option["vpayments[" + i + "].vpid"] = v;
        });

        if (checkInfo()) {
            com.post(api.information.collectVpayment, option, function () {

                layer.closeAll();
                layer.msg('收款成功', {icon: 1});
                closeLayer();

            });
        }

    }

    function checkPaymentHideFlag() {

        if ($('#cashDiv').hasClass('hide')) {
            $('#cash').val("");
        }
        if ($('#bankDiv').hasClass('hide')) {

            $('#bankAdd').attr("num", 0);
            $('#bankDivGroup').empty();

        }
        if ($('#couponDiv').hasClass('hide')) {

            $('.search-choice').find('input').val("")

        }

    }

    function addBankDiv(index){

        var d = new Date();
        var currentData = d.getFullYear() + "-" + ((d.getMonth() + 1).toString().length == 1 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate().toString().length == 1 ? "0" : "") + d.getDate();

        var bankDiv = $('<div></div>').addClass('form-group').attr("id", "bankDiv_"+index).appendTo($("#bankDivGroup"));

        var bankNameLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('开户行').appendTo(bankDiv);
        var bankNameDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
        var bankNameSelect = $('<select></select>').addClass('col-sm-6 v_required').attr("id", "bankName_"+index).attr("data-toggle", "popover").attr("data-trigger", "manual").bindData(_banks, 'key', 'value').appendTo(bankNameDiv);
        var bankDelDiv = $('<div></div>').addClass('col-sm-1').appendTo(bankDiv);
        var bankDelBtn = $('<button></button>').addClass('btn btn-minier btn-danger pull-right inline').text("删除").attr("id", "bankDel_"+index).attr("index", index).appendTo(bankDelDiv).click(function(){
            $("#bankDiv_"+$(this).attr("index")).remove();
            var bankAdd = $("#bankAdd");
            var num = bankAdd.attr("num");
            bankAdd.attr("num", parseInt(num)-1);
            return false;
        });

        var bankMoneyLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('刷卡金额').appendTo(bankDiv);
        var bankMoneyDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
        var bankMoneyInput = $('<input></input>').addClass("col-sm-6 v_required v_float").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", "bank_"+index).appendTo(bankMoneyDiv);

        var bankDateLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('日期').appendTo(bankDiv);
        var bankDateDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
        var bankDateInput = $('<input></input>').addClass("date-picker-date col-sm-6 v_required").attr("data-toggle", "popover").attr("data-trigger", "manual").attr("type", "text").attr("id", "bankDate_"+index).attr("data-date-format", "yyyy-mm-dd").val(currentData).datepicker({autoclose:true}).appendTo(bankDateDiv);

        var bankTimeLabel = $('<label></label>').addClass('col-sm-3 control-label no-padding-right').text('时间').appendTo(bankDiv);
        var bankTimeDiv = $('<div></div>').addClass('col-sm-8').appendTo(bankDiv);
        var bankTimePicker = $('<div></div>').addClass('bootstrap-timepicker').appendTo(bankTimeDiv);
        var bankTimeInput =  $('<input></input>').addClass('col-sm-6 v_time v_required').attr("type", "text").attr("id", "bankTime_"+index).attr("data-toggle", "popover").attr("data-trigger", "manual").mask('99:99:99').appendTo(bankTimePicker);

    }

    function baseClick() {

        var $input = $('input[type="checkbox"]','#form');

        $.each($input, function (i, v) {
            var $v = $(v);
            $v.click(function () {
                var id = $v.attr('key') + "Div";

                if ($v.is(':checked')) {
                    $("#" + id).removeClass('hide');
                } else {
                    $("#" + id).addClass('hide');
                }
            });
        });

    }

    baseClick();

    //检查收款填写内容
    function checkInfo() {

        var flag = true;

        if (!$('#cashDiv').hasClass('hide')) {

            var num = $('#cash');
            var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;

            if (!(numRex.test(num.val()) && parseFloat(num.val()) >= 0)) {
                num.focus().select();
                num.addClass('tooltip-info').attr({
                    "data-rel": "popover",
                    "data-placement": "right",
                    "data-original-title": "",
                    "title": "",
                    "data-content": "价格输入内容格式错误!"
                }).popover('show');
                flag = false;
            } else {
                num.popover('destroy');
            }

        }

        if (!$('#bankDiv').hasClass('hide')) {

            var date = $('.date-picker-date', '#bankDivGroup');
            if (!date.val()) {
                date.focus().select();

                date.addClass('popover-notitle').attr({
                    "data-rel": "popover",
                    "data-placement": "right",
                    "data-original-title": "",
                    "title": "",
                    "data-content": "请选择日期"

                }).popover('show');

                flag = false;
            } else {
                date.popover('destroy');
            }

            var time = $('.v_time', '#bankDivGroup');
            var timerex = /^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/;

            $.each(time, function (i, v) {
                var $v = $(v);
                if (!$v.val() && !timerex.test($v.val())) {
                    $v.focus().select();

                    $v.addClass('popover-notitle').attr({
                        "data-rel": "popover",
                        "data-placement": "right",
                        "data-original-title": "",
                        "title": "",
                        "data-content": "请填写正确的时间"

                    }).popover('show');

                    flag = false;

                } else {

                    $v.popover('destroy');

                }

            });

            var price = $('.v_price', '#bankDivGroup');
            var priceRex = /^(\d+|\d+\.[0-9]{1,4})$/;

            $.each(price, function (i, v) {
                var $v = $(v);
                if (!(parseFloat($v.val()) >= 0 && priceRex.test($v.val()))) {
                    $v.focus().select();

                    $v.addClass('popover-notitle').attr({
                        "data-rel": "popover",
                        "data-placement": "right",
                        "data-original-title": "",
                        "title": "",
                        "data-content": "价格输入内容格式错误"

                    }).popover('show');

                    flag = false;

                } else {

                    $v.popover('destroy');

                }

            })
        }

        return flag;

    }

});
