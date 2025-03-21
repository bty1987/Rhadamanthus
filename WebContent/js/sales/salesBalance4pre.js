$(function () {

    var salesPre = {
        salesPre_data: {},
        url: api.sales.pageSalesForBalance,
        postData: "salesPreBalancePostData",
        pageType: params['urlLoadParams'].type,
        btns: {
            preSaveBtn: com.focusPage("#preSaveBtn")
        }
    };

    var pageConfig = drawNode.getConfig(params['urlLoadParams'].type);

    if (salesPre.pageType == "predompany") {
        salesPre.postData = "salesPreBalanceForDompanyPostData";
    } else if (salesPre.pageType == "prepompany") {
        salesPre.postData = "salesPreBalanceForPompanyPostData";
    }

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid');
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                    var $btnSwitch = $('<a></a>').addClass('btn btn-minier btn-yellow').html('查看');
                    var $btnWipeZero = $('<a></a>').addClass('btn btn-minier btn-warning').html('抹零');
                    var $btnPre = $('<a></a>').addClass('btn btn-minier btn-success').html('预结');

                    var propertyArr = [];
                    $.each(pageConfig.propertyArr, function (pi, pv) {
                        switch (pv) {
                            case "orderId":
                                propertyArr.push(["装修单号:", v.orderId, "blue", tools.decoration.info, v.orderId]);
                                break;
                            case "address":
                                propertyArr.push(["楼盘地址:", (v.house.village.name + " " + v.house.houseNumber), "grey"]);
                                break;
                            case "customer":
                                propertyArr.push(["客户名:", v.customer.name, "grey", tools.customer.info, v.customer.cid]);
                                break;
                            case "salesman":
                                propertyArr.push(["渠道:", v.salesman.currentName, "grey", tools.personel.info, v.salesman.userId]);
                                break;
                            case "dept":
                                propertyArr.push(["部门:", v.dept.name, "grey", tools.department.info, v.dept.did]);
                                break;
                            case "region":
                                propertyArr.push(["分区:", v.region.name, "grey", tools.department.info, v.region.did]);
                                break;
                            case "guider":
                                propertyArr.push(["导购:", v.guider.currentName, "grey", tools.personel.info, v.guider.userId]);
                                break;
                            case "instorer":
                                propertyArr.push(["驻店:", v.instorer.currentName, "grey", tools.personel.info, v.instorer.userId]);
                                break;
                            case "brand":
                                propertyArr.push(["品牌:", v.brand.name, "grey", tools.brand.info, v.brand.bid]);
                                break;
                            case "depositpay":
                                propertyArr.push(["定金:", v.depositpay, "blue"]);
                                break;
                            case "fullpay":
                                propertyArr.push(["补款:", v.fullpay, "blue"]);
                                break;
                            case "grade":
                                propertyArr.push(["等级:", v.grade, "red"]);
                                break;
                            case "total":
                                propertyArr.push(["总额:", v.total, "blue"]);
                                break;
                            case "maling":
                                propertyArr.push(["抹零:", v.maling, "blue"]);
                                break;
                            case "venderMaling":
                                propertyArr.push(["厂商抹零:", v.venderMaling, "blue"]);
                                break;
                            case "coupon":
                                propertyArr.push(["券值:", v.coupon, "blue"]);
                                break;
                            case "couponInfo":
                                propertyArr.push(["券信息:", v.couponInfo, "grey"]);
                                break;
                            case "createTime":
                                propertyArr.push(["创建时间:", v.createTime, "green"]);
                                break;
                            case "balanceTime":
                                propertyArr.push(["结算时间:", v.balanceTime, "green"]);
                                break;
                            case "fullpayTime":
                                propertyArr.push(["补款时间:", v.fullpayTime, "green"]);
                                break;
                            case "comment":
                                propertyArr.push(["备注:", v.comment, "grey"]);
                                break;
                        }
                    });

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

                    var _span = $('<span></span>').addClass('lbl blue bigger-150').html(v.no);

                    _label.append($input).append(_span).appendTo($label);

                    $.each(propertyArr, function(index, value) {

                        var $liProperty = $('<li></li>').appendTo($ulProperty);

                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);

                        if (value.length == 5) {
                            $liProperty.click(function() {

                                value[3]($liProperty, value[4]);

                            }).css("cursor", "pointer");
                        }
                    });

                    $label.appendTo($h3);

                    $.each(pageConfig.pageBtn, function (k, b) {
                        switch (b) {
                            case "details":
                                $btnDiv.append($btnSwitch);
                                break;
                            case "wipezero":
                                $btnDiv.append($btnWipeZero);
                                break;
                            case "pre":
                                $btnDiv.append($btnPre);
                                break;
                        }
                    });

                    $btnDiv.appendTo($h3);
                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);

                    $btnSwitch.click(function () {
                        var flag = true;
                        if (salesPre.pageType == "predompany") {
                            flag = false;
                        }
                        com.focusPage('#viewPopUp').attr({'data-sid': v.sid, 'data-dompany': flag});
                        com.popup4page("#viewPopUp", "views/sales/salesBalance4detail.html", "预结销售单号" + v.no, "", function () {
                            salesPreBalance.doSearch();
                        });
                    });

                    $btnWipeZero.click(function () {

                        com.focusPage('#maling').val(utils.accAdd(v.maling, v.venderMaling));
                        com.focusPage('#originalMaling').val(v.maling);
                        com.focusPage('#venderMaling').val(v.venderMaling);
                        com.focusPage('#editVenderMaling').val(0);

                        com.popup4model("#editLayer", "修改抹零", function () {
                            salesPre.salesPre_data = v;
                        }, function () {
                            com.clearValidator();
                        }, "");
                    });

                    $btnPre.click(function () {

                        var _option = {};
                        _option["sid[0]"] = v.sid;

                        com.showConfirm('确定要将单号为 ' + v.no + ' 的销售单进行预结吗?', function (index, layero) {
                            com.post(api.sales.preSalesBalance, _option, function (res) {
                                com.showAlert(com.info, "预结成功");
                                salesPreBalance.doSearch();
                            });

                        }, function () {
                            salesPreBalance.doSearch();
                        });

                    });

                });

                $ul.appendTo($tableWrap);
            }
        };
        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        };

    })();

    var salesPreBalance = new Searcher();

    salesPreBalance.init(pageConfig.condArr, 'condList', pageConfig.apiPage, function (data) {

        displayFunc.init('resultList', data);

    }, 'pagenation', salesPre.postData, null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-info pull-left').attr('name', 'collects').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-ok bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('批量预结').appendTo($adda);

        var $addaEnd = $('<a></a>').addClass('btn btn-minier btn-danger pull-left').attr('name', 'collects').css("margin", "0px 3px");
        var $addiEnd = $('<i></i>').addClass('icon-ok bigger-110').appendTo($addaEnd);
        var $addspanEnd = $('<span></span>').text('完结').appendTo($addaEnd);


        $adda.click(function (e) {

            e.stopPropagation();

            var _option = {};

            var $inputs = com.focusPage('input[name="sids"]:checked', '#resultList');

            if (!$inputs.length) {

                com.showAlert(com.warning, "请选择需要进行预结的销售单");

                return;

            }

            $.each($inputs, function (i, v) {

                var $this = $(v);

                _option["sid[" + i + "]"] = $this.attr('data-sid');

            });

            com.showConfirm('确定要将选中的销售单进行预结吗?', function (index, layero) {
                com.post(api.sales.preSalesBalance, _option, function (res) {

                    com.showAlert(com.info, "操作成功");
                    salesPreBalance.doSearch();

                });

            }, function () {

                salesPreBalance.doSearch();
            });


        });

        $addaEnd.click(function (e) {
            e.stopPropagation();
            var _option = {};

            var $inputs = com.focusPage('input[name="sids"]:checked', '#resultList');

            if (!$inputs.length) {

                com.showAlert(com.warning, "请选择需要进行完结的销售单");

                return;

            }

            $.each($inputs, function (i, v) {

                var $this = $(v);

                _option["sid[" + i + "]"] = $this.attr('data-sid');

            });

            com.showConfirm('确定要将选中的销售单进行完结吗?', function (index, layero) {
                com.post(api.sales.passSalesBalance, _option, function (res) {

                    com.showAlert(com.info, "操作成功");
                    salesPreBalance.doSearch();

                });

            }, function () {

                salesPreBalance.doSearch();
            });
        });

        if (salesPre.pageType == "predompany") {
            return [];
        } else {
            return [$adda, $addaEnd];
        }

    }, 'resultList');

    salesPre.btns.preSaveBtn.on('click', function () {
        if (!checkRowValue()) {return;}

        com.post(api.sales.updateSalesForMaling, {
            "sales.sid": salesPre.salesPre_data.sid,
            "sales.maling": utils.accSub(com.focusPage('#maling').val(), com.focusPage('#editVenderMaling').val()),
            "sales.venderMaling": com.focusPage('#editVenderMaling').val()
        }, function () {
            salesPreBalance.doSearch();
            com.closePopup();
        });
    });

    function checkRowValue() {

        var flag = true;

        if (parseFloat(com.focusPage('#editVenderMaling').val()) > parseFloat(com.focusPage('#maling').val())) {

            com.focusPage('#editVenderMaling').focus().select();
            com.showTip(com.focusPage('#editVenderMaling'), "修改厂商抹零数据不能超过抹零总数!", "right");
            flag = false;
        }
        return flag;
    }
});


