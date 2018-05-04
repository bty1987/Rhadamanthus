$(function () {

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */

    var url = api.inventory.pageSalesForBalance;
    var postData = "salesPreBalancePostData";

    if(params['urlLoadParams'].type == "dompany"){
        url = api.inventory.pageSalesForDompany;
        postData = "salesPreBalanceForDompanyPostData";
    }


    var displayFunc = (function () {

        var renderList = function (tableId, listData) {

            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid');
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                    var status = "";
                    var balanceStatus = "";

                    switch (v.status) {
                        case 0:
                            status = "初始";
                            break;
                        case 2:
                            status = "全退";
                            break;
                        case 3:
                            status = "倒单";
                            break;
                        case 4:
                            status = "废单";
                            break;
                        case 5:
                            status = "完结";
                            break;

                    }

                    switch (v.balanceStatus) {
                        case 0:
                            balanceStatus = "初始";
                            break;
                        case 1:
                            balanceStatus = "预结算";
                            break;
                        case 2:
                            balanceStatus = " 厂商结算";
                            break;
                        case 3:
                            balanceStatus = " 结算";
                            break;

                    }


                    var $btnSwitch = $('<a></a>').addClass('btn btn-minier btn-yellow').html('查看');
                    var $btnWipeZero = $('<a></a>').addClass('btn btn-minier btn-warning').html('抹零');
                    var $btnPre = $('<a></a>').addClass('btn btn-minier btn-success').html('预结算');

                    var propertyArr = [
                        ["订单编号:", v.orderId, "blue"],
                        ["楼盘地址:", v.house.village.name + " " + v.house.houseNumber, "grey"],
                        ["客户名:", v.customer.name, "grey"],
                        ["渠道:", v.salesman.currentName, "grey"],
                        ["部门:", v.dept.deptName, "grey"],
                        ["分区:", v.region.deptName, "grey"],
                        ["导购:", v.guider.currentName, "grey"],
                        ["驻店:",v.instorer.currentName,"grey"],
                        ["品牌:", v.brand, "grey"],
                        ["总额:", v.total, "grey"],
                        ["抹零:", v.maling, "blue"],
                        ["厂商抹零:", v.venderMaling, "blue"],
                        ["券值:", v.coupon, "blue"],
                        ["券信息:", v.couponInfo, "grey"],
                        ["创建时间:", v.createTime, "green"],
                        ["结算时间:", v.balanceTime, "green"],
                        ["补款时间:", v.fullpayTime, "green"],
                        ["备注:", v.comment, "grey"]
                    ];

                    var $label = $('<label></label>').addClass('control-label').css({
                        'color': 'grey',
                        'font-size': '20px',
                        "font-weight": "bold"
                    });


                    var _label = $('<label></label>');

                    var $input = $('<input>').attr({
                        "type": "checkbox",
                        "name": "sids",
                        "class": "",
                        "data-sid": v.sid,
                        "data-no": v.no,
                        "data-orderId": v.orderId,
                        "data-fullPayStatus": v.fullpayStatus
                    }).addClass('ace ace-checkbox-2');

                    var _span = $('<span style="font-weight: bold"></span>').addClass('lbl blue bigger-130').html(v.no);

                    _label.append($input).append(_span).appendTo($label)

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $label.appendTo($h3);

                    if(params['urlLoadParams'].type == "dompany"){
                        $btnDiv.append($btnSwitch).append($btnWipeZero).append($btnPre).appendTo($h3);
                    }else{
                        $btnDiv.append($btnSwitch).appendTo($h3);
                    }


                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);

                    $btnSwitch.click(function () {
                        var flag = false;
                        if(params['urlLoadParams'].type == "dompany"){
                            flag = true
                        }
                        openlayerView(v.sid, v.no,flag);

                    })

                    $btnWipeZero.click(function(){

                        $('#maling').val(utils.accAdd(v.maling,v.venderMaling));
                        $('#originalMaling').val(v.maling);
                        $('#venderMaling').val(v.venderMaling);
                        $('#editVenderMaling').val(0)

                        editLayer(function(){

                            if(!checkRowValue()){
                                return;
                            }

                            com.post(api.inventory.updateSalesForMaling,{
                                "sales.sid":v.sid,
                                "sales.maling":utils.accSub($('#maling').val(),$('#editVenderMaling').val()),
                                "sales.venderMaling":$('#editVenderMaling').val()
                            },function(){
                                salesPreBalance.doSearch();
                                layer.closeAll();
                            })

                        })

                    })

                    $btnPre.click(function () {

                        var _option = {};

                        _option["sid[0]"] = v.sid;

                        layer.confirm('确定要将单号为 ' + v.no + ' 的销售单进行预结算吗?', {
                            btn: ['确定', '取消'] //按钮
                        }, function (index, layero) {

                            com.post(api.inventory.preSalesBalance, _option, function (res) {
                                layer.closeAll();
                                layer.msg('预结算成功');
                                salesPreBalance.doSearch();
                            })

                        }, function () {

                            salesPreBalance.doSearch();
                        });


                    })


                });

                $ul.appendTo($tableWrap);
            }
        };


        return {
            init: function (tableId, listData) {
                $('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        };

    })();

    var _condArr = ['sales_no', 'sales_orderId', 'sales_brade','sales_instorer', 'sales_salesman', 'sales_deptName', 'sales_fullpayTimeRange'];

    var salesPreBalance = new Searcher();

    salesPreBalance.init(_condArr, 'condList', url, function (data) {

        displayFunc.init('resultList', data)

    }, 'pagenation', postData, null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-info pull-left').attr('name', 'collects').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-ok bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('批量预结算').appendTo($adda);

        var $addaEnd = $('<a></a>').addClass('btn btn-minier btn-danger pull-left').attr('name', 'collects').css("margin", "0px 3px");
        var $addiEnd = $('<i></i>').addClass('icon-ok bigger-110').appendTo($addaEnd);
        var $addspanEnd = $('<span></span>').text('完结').appendTo($addaEnd);


        $adda.click(function (e) {

            e.stopPropagation()

            var _option = {};

            var $inputs = $('input[name="sids"]:checked', '#resultList');

            if (!$inputs.length) {

                layer.msg('请选择需要进行预结算的销售单.');

                return;

            }

            $.each($inputs, function (i, v) {

                var $this = $(v);

                _option["sid[" + i + "]"] = $this.attr('data-sid');

            })

            layer.confirm('确定要将选中的销售单进行预结算吗?', {
                btn: ['确定', '取消'] //按钮
            }, function (index, layero) {

                com.post(api.inventory.preSalesBalance, _option, function (res) {

                    layer.closeAll();
                    layer.msg('操作成功');
                    salesPreBalance.doSearch();

                })


            }, function () {

                salesPreBalance.doSearch();
            });


        })

        $addaEnd.click(function (e) {
            e.stopPropagation()

            var _option = {};

            var $inputs = $('input[name="sids"]:checked', '#resultList');

            if (!$inputs.length) {

                layer.msg('请选择需要进行完结的销售单.');

                return;

            }

            $.each($inputs, function (i, v) {

                var $this = $(v);

                _option["sid[" + i + "]"] = $this.attr('data-sid');

            })

            layer.confirm('确定要将选中的销售单进行完结吗?', {
                btn: ['确定', '取消'] //按钮
            }, function (index, layero) {

                com.post(api.inventory.passSalesBalance, _option, function (res) {

                    layer.closeAll();
                    layer.msg('操作成功');
                    salesPreBalance.doSearch();

                })


            }, function () {

                salesPreBalance.doSearch();
            });


        })

        if(params['urlLoadParams'].type == "dompany"){
            return [$adda, $addaEnd]
        }else{
            return[]
        }

    }, 'resultList')


    //查看弹窗
    function openlayerView(sid, no,flag) {
        layer.closeAll();
        var $popup = $('#viewPopUp');
        $popup.attr({'data-sid': sid,'data-dompany':flag});
        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-molv',
            title: "预结算销售单号" + no,
            content: $popup,
            area: ["1400px", ( $(window).height() * 0.84 < 700 ? $(window).height() * 0.84 : 700 ) + "px"],
            //maxmin: true,
            zIndex: 9000,
            success: function (layer, index) {
                com.clearValidator()
                $popup.load("views/sales/viewSalesItemPreBalance.html");
            },
            end: function () {
                com.clearValidator()
                $popup.attr({'data-sid': null});
                $popup.empty();
                salesPreBalance.doSearch();
            }
        })
    }

    function editLayer(callback) {
        layer.closeAll();
        layer.open({
            type: 1,
            title: "修改抹零",
            content: $('#editLayer'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: false,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                callback(index, layero);
            },
            btn2: function (index, layero) {
                com.clearValidator();
            },
            cancel: function () {
            }
        });
    }

    function checkRowValue() {

        var flag = true;

        if($('#editVenderMaling').val()>$('#maling').val()){

            $('#editVenderMaling').focus().select();

            $('#editVenderMaling').addClass('popover-notitle').attr({
                "data-rel": "popover",
                "data-placement": "right",
                "data-original-title": "",
                "title": "",
                "data-content": "修改厂商抹零数据不能超过抹零总数!"

            }).popover('show');

            flag = false;
        }else {
            $('#editVenderMaling').popover('destroy');
        }

        return flag;
    }

})


