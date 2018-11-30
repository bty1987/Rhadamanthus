var QuotetionDetail = (function () {
    var quo = {
        LbasicParams: null,
        RbasicParams: null,
        notSalesmanRate: null
    };
    var painter = {
        createAlldomain: function (Ltype, vl, lqid, ldiscount, Rtype, vr, rqid, rdiscount) {
            var that = this;
            var result = {};
            var $alldiv = $('<div></div>').addClass('col-md-12').css("background-color", "#e7e7e7").css("padding", "0px");
            var $lalldiv = $('<div></div>').addClass('col-md-6').appendTo($alldiv);
            var $ralldiv = $('<div></div>').addClass('col-md-6').appendTo($alldiv);
            var $dhead, $dname, $dtoolbar, $dbody, $dbodyInner, $list, $input;
            var sum = 0, //功能区总价(不打折总价)
                sumdp = 0,//功能区总价(打折前的打折总价)p
                sumd = 0,//功能区总价(打折后总价)
                $domain;
            var _itemsL = [];
            var $dheadR, $dnameR, $dtoolbarR, $dbodyR, $dbodyInnerR, $listR, $inputR;
            var sumR = 0, //功能区总价(不打折总价)
                sumdpR = 0,//功能区总价(打折前的打折总价)p
                sumdR = 0,//功能区总价(打折后总价)
                $domainR;
            var _itemsR = [];
            var $itemll, $itemrr;
            var LFunctionAreaItems;
            var RFunctionAreaItems;
            if (vl != null) {
                $lalldiv.css("background-color", "#fff");
                if (Ltype == 0) {
                    $domain = $('<div></div>').addClass('widget-box transparent').attr({
                        "id": "qfaId" + vl.qfaId,
                        "data-dlevel": vl.index,//排序
                        "data-qfaId": vl.qfaId,//报价项中的功能区ID
                        "data-areaType": vl.type//类型 功能区的type
                    }).css({"margin-bottom": "20px"});

                    $dhead = $('<div></div>').addClass('widget-header');
                    $dname = $('<h5></h5>').append($('<em></em>').text(vl.type == 0 ? '' : vl.index)).append('  ').append($('<strong></strong>').html(vl.name));
                    LFunctionAreaItems = vl.quotetionFunctionAreaItems;
                } else {
                    $domain = $('<div></div>').addClass('widget-box transparent').attr({
                        "id": "qfaId" + vl.qfaId,
                        "data-dlevel": vl.functionAreaOrder,//排序
                        "data-qfaId": vl.qfaId,//报价项中的功能区ID
                        "data-areaType": vl.type//类型 功能区的type
                    }).css({"margin-bottom": "20px"});

                    $dhead = $('<div></div>').addClass('widget-header');
                    $dname = $('<h5></h5>').append($('<em></em>').text(vl.type == 0 ? '' : vl.functionAreaOrder)).append('  ').append($('<strong></strong>').html(vl.functionAreaName));
                    LFunctionAreaItems = vl.quotationFunctionAreaItems;
                }
                $dtoolbar = $('<div></div>').addClass('widget-toolbar no-border');

                $dbody = $('<div></div>').addClass('widget-body');
                $dbodyInner = $('<div></div>').addClass('widget-body-inner');
                $list = $('<ul></ul>').addClass('fl-quo-list');
                $input = $('<div></div>').addClass('fl-quo-input hide').append($('<input type="text">').addClass('v_required v_float').attr('maxlength', '16'));

                $dhead.append($dname).append($dtoolbar);
                $dbodyInner.append($input).append($list).appendTo($dbody);
                $domain.append($dhead).append($dbody);
                if (LFunctionAreaItems.length) {
                    _itemsL = LFunctionAreaItems;
                    _itemsL = _itemsL.sort(function (a, b) {
                        if (a.index == null || b.index == null) {
                            return b.index - a.index;
                        } else {
                            return a.index - b.index;
                        }
                    });
                }
                $domain.appendTo($lalldiv);
                result.$domainL = $domain;
            }

            if (vr != null) {
                $ralldiv.css("background-color", "#fff");
                if (Rtype == 0) {
                    $domainR = $('<div></div>').addClass('widget-box transparent').attr({
                        "id": "qfaId" + vr.qfaId,
                        "data-dlevel": vr.index,//排序
                        "data-qfaId": vr.qfaId,//报价项中的功能区ID
                        "data-areaType": vr.type//类型 功能区的type
                    }).css({"margin-bottom": "20px"});

                    $dheadR = $('<div></div>').addClass('widget-header');
                    $dnameR = $('<h5></h5>').append($('<em></em>').text(vr.type == 0 ? '' : vr.index)).append('  ').append($('<strong></strong>').html(vr.name));
                    RFunctionAreaItems = vr.quotetionFunctionAreaItems;
                } else {
                    $domainR = $('<div></div>').addClass('widget-box transparent').attr({
                        "id": "qfaId" + vr.qfaId,
                        "data-dlevel": vr.functionAreaOrder,//排序
                        "data-qfaId": vr.qfaId,//报价项中的功能区ID
                        "data-areaType": vr.type//类型 功能区的type
                    }).css({"margin-bottom": "20px"});

                    $dheadR = $('<div></div>').addClass('widget-header');
                    $dnameR = $('<h5></h5>').append($('<em></em>').text(vr.type == 0 ? '' : vr.functionAreaOrder)).append('  ').append($('<strong></strong>').html(vr.functionAreaName));
                    RFunctionAreaItems = vr.quotationFunctionAreaItems;
                }
                $dtoolbarR = $('<div></div>').addClass('widget-toolbar no-border');

                $dbodyR = $('<div></div>').addClass('widget-body');
                $dbodyInnerR = $('<div></div>').addClass('widget-body-inner');
                $listR = $('<ul></ul>').addClass('fl-quo-list');
                $inputR = $('<div></div>').addClass('fl-quo-input hide').append($('<input type="text">').addClass('v_required v_float').attr('maxlength', '16'));

                $dheadR.append($dnameR).append($dtoolbarR);
                $dbodyInnerR.append($inputR).append($listR).appendTo($dbodyR);
                $domainR.append($dheadR).append($dbodyR);
                if (RFunctionAreaItems.length) {
                    _itemsR = RFunctionAreaItems;
                    _itemsR = _itemsR.sort(function (a, b) {
                        if (a.index == null || b.index == null) {
                            return b.index - a.index;
                        } else {
                            return a.index - b.index;
                        }
                    });
                }
                $domainR.appendTo($ralldiv);
                result.$domainR = $domainR;

            }

            if (vl != null) {
                if (_itemsL.length > 0) {
                    if (vr != null) {
                        if (_itemsR.length > 0) {
                            $.each(_itemsL, function (i, v) {
                                if (Ltype == 0) {
                                    var Lname = v.name;
                                } else {
                                    var Lname = v.itemName;
                                }
                                v.areaType = $domain.attr('data-areaType');
                                if (i < _itemsR.length) {
                                    $.each(_itemsR, function (j, val) {
                                        if (Rtype == 0) {
                                            var Rname = val.name;
                                        } else {
                                            var Rname = val.itemName;
                                        }
                                        if (i == j) {
                                            val.areaType = $domainR.attr('data-areaType');
                                            if (Lname == Rname) {
                                                if (val.num != v.num) {
                                                    val.numColor = "#ffd0d0";
                                                }

                                                var $item = that.createAllQuote(Ltype, i + 1, v, lqid, ldiscount, Rtype, j + 1, val, rqid, rdiscount);
                                                $itemll = $item.$iteml;
                                                $itemll.appendTo($list);

                                                $itemrr = $item.$itemr;
                                                $itemrr.appendTo($listR);

                                                sumd = vl.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumd, parseFloat($itemll.find('.totalprice-discount .cell-wrap').text()))) : 0;
                                                sum = vl.type != 3 ? utils.changeThrDecimal(utils.accAdd(sum, parseFloat($itemll.attr('data-undisPrice')))) : 0;
                                                sumdp = vl.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumdp, parseFloat($itemll.attr('data-disPrice')))) : 0;

                                                sumdR = vr.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumdR, parseFloat($itemrr.find('.totalprice-discount .cell-wrap').text()))) : 0;
                                                sumR = vr.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumR, parseFloat($itemrr.attr('data-undisPrice')))) : 0;
                                                sumdpR = vr.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumdpR, parseFloat($itemrr.attr('data-disPrice')))) : 0;

                                            } else {
                                                var $item = that.createAllQuote(Ltype, i + 1, v, lqid, ldiscount, null, null, null, null, null);
                                                $itemll = $item.$iteml;
                                                $itemll.appendTo($list);
                                                $itemrr = $item.$itemr;
                                                $itemrr.appendTo($listR);

                                                sumd = vl.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumd, parseFloat($itemll.find('.totalprice-discount .cell-wrap').text()))) : 0;
                                                sum = vl.type != 3 ? utils.changeThrDecimal(utils.accAdd(sum, parseFloat($itemll.attr('data-undisPrice')))) : 0;
                                                sumdp = vl.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumdp, parseFloat($itemll.attr('data-disPrice')))) : 0;

                                                var $item = that.createAllQuote(null, null, null, null, null, Rtype, j + 1, val, rqid, rdiscount);
                                                $itemll = $item.$iteml;
                                                $itemll.appendTo($list);
                                                var $itemrrr = $item.$itemr;
                                                $itemrrr.appendTo($listR);
                                                sumdR = vr.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumdR, parseFloat($itemrrr.find('.totalprice-discount .cell-wrap').text()))) : 0;
                                                sumR = vr.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumR, parseFloat($itemrrr.attr('data-undisPrice')))) : 0;
                                                sumdpR = vr.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumdpR, parseFloat($itemrrr.attr('data-disPrice')))) : 0;

                                            }
                                            $domainR.attr('data-desTotalprice', sumdR);
                                            $domainR.attr('data-disPrice', sumdpR);
                                            $domainR.attr('data-undisPrice', sumR);
                                            $domainR.appendTo($ralldiv)
                                            result.$domainR = $domainR;
                                        }
                                    })
                                } else {
                                    var $item = that.createAllQuote(Ltype, i + 1, v, lqid, ldiscount, null, null, null, null, null);
                                    $itemll = $item.$iteml;
                                    $itemll.appendTo($list);
                                    $itemrr = $item.$itemr;
                                    $itemrr.appendTo($listR);
                                    sumd = vl.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumd, parseFloat($itemll.find('.totalprice-discount .cell-wrap').text()))) : 0;
                                    sum = vl.type != 3 ? utils.changeThrDecimal(utils.accAdd(sum, parseFloat($itemll.attr('data-undisPrice')))) : 0;
                                    sumdp = vl.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumdp, parseFloat($itemll.attr('data-disPrice')))) : 0;
                                }
                            });
                            //如果右侧功能区的报价项个数比左侧功能区报价项个数多
                            if (_itemsR.length > _itemsL.length) {
                                $.each(_itemsR, function (i, v) {
                                    if (i > _itemsL.length - 1) {
                                        v.areaType = $domainR.attr('data-areaType');
                                        var $item = that.createAllQuote(null, null, null, null, null, Rtype, i + 1, v, rqid, rdiscount);
                                        $itemll = $item.$iteml;
                                        $itemll.appendTo($list);
                                        $itemrr = $item.$itemr;
                                        $itemrr.appendTo($listR);

                                        sumdR = vr.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumdR, parseFloat($itemrr.find('.totalprice-discount .cell-wrap').text()))) : 0;
                                        sumR = vr.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumR, parseFloat($itemrr.attr('data-undisPrice')))) : 0;
                                        sumdpR = vr.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumdpR, parseFloat($itemrr.attr('data-disPrice')))) : 0;

                                        $domainR.attr('data-desTotalprice', sumdR);
                                        $domainR.attr('data-disPrice', sumdpR);
                                        $domainR.attr('data-undisPrice', sumR);
                                        $domainR.appendTo($ralldiv);
                                        result.$domainR = $domainR;
                                    }
                                });
                            }
                        }
                        //左侧不为空右侧功能区中报价项为空时
                        else {
                            $.each(_itemsL, function (i, v) {
                                v.areaType = $domain.attr('data-areaType');
                                var $item = that.createAllQuote(Ltype,i + 1, v, lqid, ldiscount, null, null,null, null, null);
                                $itemll = $item.$iteml;
                                $itemll.appendTo($list);
                                $itemrr = $item.$itemr;
                                $itemrr.appendTo($listR);
                                sumd = vl.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumd, parseFloat($itemll.find('.totalprice-discount .cell-wrap').text()))) : 0;
                                sum = vl.type != 3 ? utils.changeThrDecimal(utils.accAdd(sum, parseFloat($itemll.attr('data-undisPrice')))) : 0;
                                sumdp = vl.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumdp, parseFloat($itemll.attr('data-disPrice')))) : 0;

                                $domainR.attr('data-desTotalprice', 0);
                                $domainR.attr('data-disPrice', 0);
                                $domainR.attr('data-undisPrice', 0);
                                $domainR.appendTo($ralldiv)
                                result.$domainR = $domainR;

                            });
                        }
                    }
                    else if (vr == null) {
                        $.each(_itemsL, function (i, v) {
                            v.areaType = $domain.attr('data-areaType');
                            var $item = that.createAllQuote(Ltype, i + 1, v, lqid, ldiscount, null, null, null, null, null);

                            $itemll = $item.$iteml;
                            $itemll.appendTo($list);
                            $itemrr = $item.$itemr;
                            $itemrr.appendTo($listR);
                            sumd = vl.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumd, parseFloat($itemll.find('.totalprice-discount .cell-wrap').text()))) : 0;
                            sum = vl.type != 3 ? utils.changeThrDecimal(utils.accAdd(sum, parseFloat($itemll.attr('data-undisPrice')))) : 0;
                            sumdp = vl.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumdp, parseFloat($itemll.attr('data-disPrice')))) : 0;
                        });
                    }
                    $domain.attr('data-desTotalprice', sumd);
                    $domain.attr('data-disPrice', sumdp);
                    $domain.attr('data-undisPrice', sum);
                    $domain.appendTo($lalldiv);
                    result.$domainL = $domain;
                }
                else {
                    //左侧功能区为空情况  右侧功能区为空还没考虑
                    if (vr != null) {
                        if (_itemsR.length > 0) {
                            $.each(_itemsR, function (i, v) {
                                v.areaType = $domainR.attr('data-areaType');
                                var $item = that.createAllQuote(null, null, null, null, null, Rtype, i + 1, v, rqid, rdiscount);
                                $itemll = $item.$iteml;
                                $itemll.appendTo($list);
                                $itemrr = $item.$itemr;
                                $itemrr.appendTo($listR);

                                sumdR = vr.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumdR, parseFloat($itemrr.find('.totalprice-discount .cell-wrap').text()))) : 0;
                                sumR = vr.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumR, parseFloat($itemrr.attr('data-undisPrice')))) : 0;
                                sumdpR = vr.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumdpR, parseFloat($itemrr.attr('data-disPrice')))) : 0;

                                $domainR.attr('data-desTotalprice', sumdR);
                                $domainR.attr('data-disPrice', sumdpR);
                                $domainR.attr('data-undisPrice', sumR);
                                $domainR.appendTo($ralldiv);
                                result.$domainR = $domainR;

                                $domain.attr('data-desTotalprice', 0);
                                $domain.attr('data-disPrice', 0);
                                $domain.attr('data-undisPrice', 0);
                                $domain.appendTo($lalldiv);
                                result.$domainL = $domain;
                            });
                        }
                        else {
                            $domain.attr('data-desTotalprice', 0);
                            $domain.attr('data-disPrice', 0);
                            $domain.attr('data-undisPrice', 0);
                            $domain.appendTo($lalldiv);
                            result.$domainL = $domain;

                            $domainR.attr('data-desTotalprice', 0);
                            $domainR.attr('data-disPrice', 0);
                            $domainR.attr('data-undisPrice', 0);

                            $domainR.appendTo($ralldiv);
                            result.$domainR = $domainR;
                        }
                    } else {
                        $domain.attr('data-desTotalprice', 0);
                        $domain.attr('data-disPrice', 0);
                        $domain.attr('data-undisPrice', 0);
                        $domain.appendTo($lalldiv);
                        result.$domainL = $domain;
                    }
                }
            }
            else if (vl == null && vr != null) {
                if (_itemsR.length) {
                    $.each(_itemsR, function (i, v) {
                        v.areaType = $domainR.attr('data-areaType');
                        var $item = that.createAllQuote(null, null, null, null, null, Rtype, i + 1, v, rqid, rdiscount);
                        $itemrr = $item.$itemr;
                        $itemrr.appendTo($listR);
                        sumdR = vr.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumdR, parseFloat($itemrr.find('.totalprice-discount .cell-wrap').text()))) : 0;
                        sumR = vr.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumR, parseFloat($itemrr.attr('data-undisPrice')))) : 0;
                        sumdpR = vr.type != 3 ? utils.changeThrDecimal(utils.accAdd(sumdpR, parseFloat($itemrr.attr('data-disPrice')))) : 0;

                    });
                    $domainR.attr('data-desTotalprice', sumdR);
                    $domainR.attr('data-disPrice', sumdpR);
                    $domainR.attr('data-undisPrice', sumR);
                    $domainR.appendTo($ralldiv);
                    result.$domainR = $domainR;
                }
                else {
                    $domainR.attr('data-desTotalprice', 0);
                    $domainR.attr('data-disPrice', 0);
                    $domainR.attr('data-undisPrice', 0);
                    $domainR.appendTo($ralldiv);
                    result.$domainR = $domainR;
                }
            }
            result.$alldiv = $alldiv;
            return result
        },
        createAllQuote: function (Ltype, llinenum, lqv, lqid, ldiscount, Rtype, rlinenum, rqv, rqid, rdiscount) {
            com.focusPage('#quo-Item').html("");
            var $item = {};
            var $iteml = $('<li></li>').addClass('fl-quo-item');
            var $itemr = $('<li></li>').addClass('fl-quo-item');
            if (llinenum != null) {
                if (lqv.numColor) {
                    $iteml.css("background-color", lqv.numColor);
                }
                var _dcp = 0;
                if (lqv.type < 2) {
                    _dcp = utils.accMul(lqv.unitPrice, (lqv.discount == 1 ? ldiscount : 1));//折后单价1打折，0不打折
                    _dcp = utils.changeThrDecimal(_dcp);
                }
                if (lqv.type == 2) {
                    _dcp = lqv.unitPrice;
                }
                if (lqv.type == 3) {
                    _dcp = lqv.unitPrice;
                }
                var _lineSet = [
                    ["line", llinenum, ["data-areaType", lqv.areaType]],//编号
                    ["num", lqv.num, ["data-subtype", lqv.subtype]],//数量
                    ["name", Ltype == 0 ? lqv.name : lqv.itemName, ["data-qfaId", Ltype == 0 ? lqv.qfaid : lqv.quotationFunctionAreaId]],//报价名称
                    ["price unitprice", lqv.type == 3 ? _dcp : lqv.unitPrice],//类型 , 0: 普通报价项 , 1: 自定义报价项 , 2: 车运费 , 3: 管理费 , 4: 不计入总额
                    ["price discountprice", lqv.areaType == 3 ? 0 : _dcp, ["data-discount", lqv.discount]],//折扣后的价格   将折扣存入
                    ["price totalprice-discount", lqv.areaType == 3 ? 0 : lqv.type < 2 ? utils.changeThrDecimal(utils.accMul(lqv.num, _dcp)) : _dcp],//根据类型计算(数量*折扣)
                ];

                var $btnCell, $btnCellWrap, $btnset;
                $.each(_lineSet, function (i, v) {
                    var $cell = $('<div></div>').addClass('cell ' + v[0]);
                    var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);
                    if (v[2]) {
                        $cell.attr(v[2][0], v[2][1]);
                    }
                    $cell.append($cellWrap).appendTo($iteml);
                });
                //报价类型为普通跟自定义
                if (lqv.type == 2 || lqv.type == 3) {
                    if (lqv.type == 2) { // 车运费
                        $iteml.attr('id', 'conveyanceCost' + lqid);
                        $btnCell = $('<div></div>').addClass('cell btns');
                        $btnCellWrap = $('<div></div>').addClass('cell-wrap');
                        $btnset = $('<a></a>').css('visibility', 'hidden').css('text-decoration', 'none').append('<i class="bigger-125 icon-cog purple"></i>');
                        $btnCellWrap.append($btnset).appendTo($btnCell);
                        $iteml.append($btnCell);
                    }
                    if (lqv.type == 3) { //管理费
                        $iteml.attr('id', 'manageCost' + lqid).attr('qfaiId', lqv.qfaiId);//管理费
                        $btnCell = $('<div></div>').addClass('cell btns');
                        $btnCellWrap = $('<div></div>').addClass('cell-wrap');
                        $btnset = $('<a></a>').css('visibility', 'hidden').css('text-decoration', 'none').append('<i class="bigger-125 icon-cog purple"></i>');
                        $btnCellWrap.append($btnset).appendTo($btnCell);
                        $iteml.append($btnCell);
                    }
                }
                $iteml.attr('data-undisPrice', lqv.discount == 0 && (lqv.type < 2 || lqv.type == 5) ? utils.changeThrDecimal(utils.accMul(lqv.num, lqv.unitPrice)) : 0);
                $iteml.attr('data-disPrice', lqv.discount == 1 && (lqv.type < 2 || lqv.type == 5) ? utils.changeThrDecimal(utils.accMul(lqv.num, lqv.unitPrice)) : 0);
                $iteml.appendTo(com.focusPage('#quo-Item'))
            }
            else {
                $iteml.css("background-color", "#e7e7e7");
                $iteml.appendTo(com.focusPage('#quo-Item'))
            }
            if (rlinenum != null) {
                if (llinenum != null && lqv.numColor) {
                    $itemr.css("background-color", lqv.numColor);
                }
                var _dcp = 0;
                if (rqv.type < 2) {
                    _dcp = utils.accMul(rqv.unitPrice, (rqv.discount == 1 ? rdiscount : 1));//折后单价1打折，0不打折
                    _dcp = utils.changeThrDecimal(_dcp);
                }
                if (rqv.type == 2) {
                    _dcp = rqv.unitPrice;
                }
                if (rqv.type == 3) {
                    _dcp = rqv.unitPrice;
                }
                var _lineSet = [
                    ["line", rlinenum, ["data-areaType", rqv.areaType]],//编号
                    ["num", rqv.num, ["data-subtype", rqv.subtype]],//数量
                    ["name", Rtype == 0 ? rqv.name : rqv.itemName, ["data-qfaId", Rtype == 0 ? rqv.qfaid : rqv.quotationFunctionAreaId]],//报价名称
                    ["price unitprice", rqv.type == 3 ? _dcp : rqv.unitPrice],//类型 , 0: 普通报价项 , 1: 自定义报价项 , 2: 车运费 , 3: 管理费 , 4: 不计入总额
                    ["price discountprice", rqv.areaType == 3 ? 0 : _dcp, ["data-discount", rqv.discount]],//折扣后的价格   将折扣存入
                    ["price totalprice-discount", rqv.areaType == 3 ? 0 : rqv.type < 2 ? utils.changeThrDecimal(utils.accMul(rqv.num, _dcp)) : _dcp],//根据类型计算(数量*折扣)
                ];

                var $btnCell, $btnCellWrap, $btnset;
                $.each(_lineSet, function (i, v) {
                    var $cell = $('<div></div>').addClass('cell ' + v[0]);
                    var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);
                    if (v[2]) {
                        $cell.attr(v[2][0], v[2][1]);
                    }
                    $cell.append($cellWrap).appendTo($itemr);
                });
                //报价类型为普通跟自定义
                if (rqv.type == 2 || rqv.type == 3) {
                    if (rqv.type == 2) { // 车运费
                        $itemr.attr('id', 'conveyanceCost' + rqid);
                        $btnCell = $('<div></div>').addClass('cell btns');
                        $btnCellWrap = $('<div></div>').addClass('cell-wrap');
                        $btnset = $('<a></a>').css('visibility', 'hidden').css('text-decoration', 'none').append('<i class="bigger-125 icon-cog purple"></i>');
                        $btnCellWrap.append($btnset).appendTo($btnCell);
                        $itemr.append($btnCell);
                    }
                    if (rqv.type == 3) { //管理费
                        $itemr.attr('id', 'manageCost' + rqid).attr('qfaiId', rqv.qfaiId);//管理费
                        $btnCell = $('<div></div>').addClass('cell btns');
                        $btnCellWrap = $('<div></div>').addClass('cell-wrap');
                        $btnset = $('<a></a>').css('visibility', 'hidden').css('text-decoration', 'none').append('<i class="bigger-125 icon-cog purple"></i>');
                        $btnCellWrap.append($btnset).appendTo($btnCell);
                        $itemr.append($btnCell);
                    }
                }
                $itemr.attr('data-undisPrice', rqv.discount == 0 && (rqv.type < 2 || rqv.type == 5) ? utils.changeThrDecimal(utils.accMul(rqv.num, rqv.unitPrice)) : 0);
                $itemr.attr('data-disPrice', rqv.discount == 1 && (rqv.type < 2 || rqv.type == 5) ? utils.changeThrDecimal(utils.accMul(rqv.num, rqv.unitPrice)) : 0);
                $itemr.appendTo(com.focusPage('#quo-Item'))
            }
            else {
                $itemr.css("background-color", "#e7e7e7");
                $itemr.appendTo(com.focusPage('#quo-Item'))
            }
            //增加一个通过计算左侧高度给右侧赋值,或是计算右侧高度给左侧赋值
            if (llinenum == null) {
                $iteml.css("height", $itemr.height())
            }
            if (rlinenum == null) {
                $itemr.css("height", $iteml.height())
            }

            $item.$iteml = $iteml;
            $item.$itemr = $itemr;
            return $item;

        },
        allPaint: function (Ltype, Lqid, LbasicParams, Rtype, Rqid, RbasicParams, AllDetailId) {
            var leftAreas, rightAreas;
            leftAreas = LbasicParams.FunctionAreas;
            rightAreas = RbasicParams.FunctionAreas;

            var _discountL = utils.accDiv(quo.LbasicParams['quotetion.discount'], 10);
            var _undisPriceL = 0, _disPriceL = 0, _dtotalfeeL = 0, _transfeeL = 0;

            var _discountR = utils.accDiv(quo.RbasicParams['quotetion.discount'], 10);
            var _undisPriceR = 0, _disPriceR = 0, _dtotalfeeR = 0, _transfeeR = 0;

            var $domain, $domainT, $domainL, $domainR;
            var sumL = 0, sumdpL = 0, sumdL = 0;
            var sumR = 0, sumdpR = 0, sumdR = 0;

            if (leftAreas.length) {
                $.each(leftAreas, function (i, vl) {
                    if (Ltype == 0) {
                        var Lname = vl.name
                    } else if (Ltype == 1) {
                        var Lname = vl.functionAreaName
                    }
                    if (Lname != "生成项目") {
                        if (rightAreas.length > 1) {
                            $.each(rightAreas, function (j, vr) {
                                if (Rtype == 0) {
                                    var Rname = vr.name
                                } else if (Rtype == 1) {
                                    var Rname = vr.functionAreaName
                                }

                                if (Rname != "生成项目") {
                                    if (i == j) {
                                        if (Lname == Rname) {
                                            result = painter.createAlldomain(Ltype, vl, Lqid, _discountL, Rtype, vr, Rqid, _discountR);
                                            $domain = result.$alldiv;
                                            $domain.appendTo(AllDetailId);
                                            $domainL = result.$domainL;
                                            $domainR = result.$domainR;
                                        } else {
                                            result = painter.createAlldomain(Ltype, vl, Lqid, _discountL, null, null, null, null);
                                            $domain = result.$alldiv;
                                            $domain.appendTo(AllDetailId);
                                            $domainL = result.$domainL;

                                            result = painter.createAlldomain(null, null, null, null, Rtype, vr, Rqid, _discountR);
                                            $domainT = result.$alldiv;
                                            $domainT.appendTo(AllDetailId);
                                            $domainR = result.$domainR
                                        }
                                        if (Rtype == 0) {
                                            var RFunctionAreaItems = vr.quotetionFunctionAreaItems
                                        } else {
                                            var RFunctionAreaItems = vr.quotationFunctionAreaItems
                                        }

                                        if (RFunctionAreaItems.length > 0) {
                                            if (vr.type != 0 && vr.type != 3) {
                                                sumR = parseFloat($domainR.attr('data-undisPrice'));//功能区非打折项总价
                                                sumdpR = parseFloat($domainR.attr('data-disPrice'));//功能区打折项折前总价
                                                sumdR = parseFloat($domainR.attr('data-desTotalprice'));//功能区折后总价
                                                //功能区打折项总价相加
                                                _disPriceR = utils.changeThrDecimal(utils.accAdd(_disPriceR, sumdpR));
                                                //功能区非打折项总价相加
                                                _undisPriceR = utils.changeThrDecimal(utils.accAdd(_undisPriceR, sumR));
                                                //功能区折后总价相加
                                                _dtotalfeeR = utils.changeThrDecimal(utils.accAdd(_dtotalfeeR, sumdR));
                                            }
                                        }
                                    }
                                }
                            });
                            //应该加左侧功能区比右侧功能区高情况
                            if(i >= (rightAreas.length-1)){
                                result = painter.createAlldomain(Ltype, vl, Lqid, _discountL, null,null, null, null);
                                $domain = result.$alldiv;
                                $domain.appendTo(AllDetailId);
                                $domainL = result.$domainL;
                            }
                        }
                        //右侧仅有生成项目
                        else {
                            if (leftAreas.length > rightAreas.length) {
                                result = painter.createAlldomain(Ltype, vl, Lqid, _discountL, null,null, null, null);
                                $domain = result.$alldiv;
                                $domain.appendTo(AllDetailId);
                                $domainL = result.$domainL;
                            }
                        }

                    }

                    if (Ltype == 0) {
                        var LFunctionAreaItems = vl.quotetionFunctionAreaItems
                    }
                    else {
                        var LFunctionAreaItems = vl.quotationFunctionAreaItems
                    }
                    if (LFunctionAreaItems.length > 0) {
                        if (vl.type != 0 && vl.type != 3) {
                            sumL = parseFloat($domainL.attr('data-undisPrice'));//功能区非打折项总价
                            sumdpL = parseFloat($domainL.attr('data-disPrice'));//功能区打折项折前总价
                            sumdL = parseFloat($domainL.attr('data-desTotalprice'));//功能区折后总价
                            //功能区打折项总价相加
                            _disPriceL = utils.changeThrDecimal(utils.accAdd(_disPriceL, sumdpL));
                            //功能区非打折项总价相加
                            _undisPriceL = utils.changeThrDecimal(utils.accAdd(_undisPriceL, sumL));
                            //功能区折后总价相加
                            _dtotalfeeL = utils.changeThrDecimal(utils.accAdd(_dtotalfeeL, sumdL));
                        }
                    }

                });

                //右侧功能区比左侧功能区多的情况下
                if (leftAreas.length < rightAreas.length) {
                    $.each(rightAreas, function (j, vr) {
                        if (Rtype == 0) {
                            var Rname = vr.name
                        } else {
                            var Rname = vr.functionAreaName
                        }
                        if (Rname != "生成项目") {
                            if (j >= (parseInt(leftAreas.length) - 1)) {
                                result = painter.createAlldomain(null, null, null, null, Rtype, vr, Rqid, _discountR);
                                $domain = result.$alldiv;
                                $domain.appendTo(AllDetailId);
                                $domainL = result.$domainL;
                                $domainR = result.$domainR;

                                if (vr.type != 0 && vr.type != 3) {
                                    sumR = parseFloat($domainR.attr('data-undisPrice'));//功能区非打折项总价
                                    sumdpR = parseFloat($domainR.attr('data-disPrice'));//功能区打折项折前总价
                                    sumdR = parseFloat($domainR.attr('data-desTotalprice'));//功能区折后总价
                                    //功能区打折项总价相加
                                    _disPriceR = utils.changeThrDecimal(utils.accAdd(_disPriceR, sumdpR));
                                    //功能区非打折项总价相加
                                    _undisPriceR = utils.changeThrDecimal(utils.accAdd(_undisPriceR, sumR));
                                    //功能区折后总价相加
                                    _dtotalfeeR = utils.changeThrDecimal(utils.accAdd(_dtotalfeeR, sumdR));
                                }
                            }
                        }
                    })
                }
                //画生成项目功能区
                $.each(leftAreas, function (i, vl) {
                    if (Ltype == 0) {
                        var Lname = vl.name;
                    }
                    else {
                        var Lname = vl.functionAreaName;
                    }
                    if (Lname == "生成项目") {
                        $.each(rightAreas, function (j, vr) {
                            if (Rtype == 0) {
                                var Rname = vr.name;
                            } else {
                                var Rname = vr.functionAreaName;
                            }
                            if (Rname == "生成项目") {
                                result = painter.createAlldomain(Ltype, vl, Lqid, _discountL, Rtype, vr, Rqid, _discountR);
                                $domain = result.$alldiv;
                                $domain.appendTo(AllDetailId);
                                $domainL = result.$domainL;
                                $domainR = result.$domainR;
                            }
                        })
                    }
                });

                //左侧的报价
                //管理费
                var manageCostL = com.focusPage('#' + 'manageCost' + Lqid);
                //车运费
                var converyanceCostL = com.focusPage('#' + "conveyanceCost" + Lqid);
                //管理费折扣
                var _manageDiscountL = manageCostL.find('.discountprice').attr('data-discount') == "1" ? _discountL : 1;
                //车运费折扣
                var _transDiscountL = converyanceCostL.find('.discountprice').attr('data-discount') == "1" ? _discountL : 1;
                //获取管理费比例(根据报价版本获得)
                var _manageRateL = parseFloat(manageCostL.find('.discountprice .cell-wrap').text());
                //获取车运费比例(根据报价版本获得)
                var _tranRateL = parseFloat(converyanceCostL.find('.unitprice .cell-wrap').text());
                //未计算车运费之前的总价格*车运费比例=车运费
                _transfeeL = utils.changeThrDecimal(utils.accMul(utils.accAdd(_disPriceL, _undisPriceL), _tranRateL));
                //(未计算车运费之前的总价格+车运费)*管理费
                var _managefeeL = utils.changeThrDecimal(utils.accMul(utils.accAdd(utils.accAdd(_disPriceL, _undisPriceL), _transfeeL), _manageRateL));
                //车运费*车运费折扣
                var _dtransfeeL = utils.changeThrDecimal(utils.accMul(_transfeeL, _transDiscountL));
                //(未计算车运费之前的总价格+车运费)*管理费比例*管理费折扣
                var _dmanagefeeL = utils.changeThrDecimal(utils.accMul(_managefeeL, _manageDiscountL));
                ////显示到生成项目  车运费(未折扣的车运费)
                converyanceCostL.find('.num .cell-wrap').text(_dtransfeeL);
                //显示到生成项目  管理费(未折扣的管理费)
                manageCostL.find('.num .cell-wrap').text(_dmanagefeeL);

                //右侧的报价
                //管理费
                var manageCostR = com.focusPage('#' + 'manageCost' + Rqid);
                //车运费
                var converyanceCostR = com.focusPage('#' + "conveyanceCost" + Rqid);
                //管理费折扣
                var _manageDiscountR = manageCostR.find('.discountprice').attr('data-discount') == "1" ? _discountR : 1;
                //车运费折扣
                var _transDiscountR = converyanceCostR.find('.discountprice').attr('data-discount') == "1" ? _discountR : 1;
                //获取管理费比例(根据报价版本获得)
                var _manageRateR = parseFloat(manageCostR.find('.discountprice .cell-wrap').text());
                //获取车运费比例(根据报价版本获得)
                var _tranRateR = parseFloat(converyanceCostR.find('.unitprice .cell-wrap').text());
                //未计算车运费之前的总价格*车运费比例=车运费
                _transfeeR = utils.changeThrDecimal(utils.accMul(utils.accAdd(_disPriceR, _undisPriceR), _tranRateR));
                //(未计算车运费之前的总价格+车运费)*管理费
                var _managefeeR = utils.changeThrDecimal(utils.accMul(utils.accAdd(utils.accAdd(_disPriceR, _undisPriceR), _transfeeR), _manageRateR));
                //车运费*车运费折扣
                var _dtransfeeR = utils.changeThrDecimal(utils.accMul(_transfeeR, _transDiscountR));
                //(未计算车运费之前的总价格+车运费)*管理费比例*管理费折扣
                var _dmanagefeeR = utils.changeThrDecimal(utils.accMul(_managefeeR, _manageDiscountR));
                ////显示到生成项目  车运费(未折扣的车运费)
                converyanceCostR.find('.num .cell-wrap').text(_dtransfeeR);
                //显示到生成项目  管理费(未折扣的管理费)
                manageCostR.find('.num .cell-wrap').text(_dmanagefeeR);

            }
        },

        allquery: function (qid, type) {
            var resultParams = {
                FunctionAreas: null,
                basicParams: null
            };
            if (type == 0) {
                com.post(api.quotation.queryQuotetionByNo, {"quotetion.no": qid}, function (data) {
                    resultParams.basicParams = {
                        "quotetion.qid": data.quotetion.qid,//报价Id
                        "quotetion.discount": data.quotetion.discount,//报价折扣
                        "quotetion.version": data.quotetion.version,//报价版本
                        "quotetion.totalPrice": data.quotetion.totalPrice,//报价总额
                        "quotetion.manageRate": data.quotetion.manageRate,//管理费比例
                        "quotetion.managePrice": data.quotetion.managePrice,//管理费
                        "quotetion.trafficPrice": data.quotetion.trafficPrice//车运费
                    };

                    com.post(api.quotation.queryQuotetionFunctionAreaByQid, {"quotetion.qid": data.quotetion.qid}, function (data) {
                        resultParams.FunctionAreas = data.quotetionFunctionAreas;
                    }, null, false);
                }, null, false);
            } else if (type == 1) {
                com.post(api.quotation.queryQuotationById, {"quotation.qid": qid}, function (data) {
                    resultParams.basicParams = {
                        "quotetion.qid": data.quotation.qid,//报价Id
                        "quotetion.discount": data.quotation.discount,//报价折扣
                        "quotetion.version": data.quotation.version,//报价版本
                        "quotetion.totalPrice": data.quotation.totalPrice,//报价总额
                        "quotetion.manageRate": data.quotation.manageRate,//管理费比例
                        "quotetion.managePrice": data.quotation.managePrice,//管理费
                        "quotetion.trafficPrice": data.quotation.trafficPrice//车运费
                    };
                    quo.notSalesmanRate = data.quotation.notSalesmanRate;
                }, null, false);
                com.post(api.quotation.queryQuotationFunctionAreaByQuotationId, {"quotation.qid": qid}, function (data) {
                    resultParams.FunctionAreas = data.quotationFunctionAreas;
                }, null, false);
            }
            return resultParams;
        }
    };

    return {
        init: function () {
            com.focusPage("#ALLDetailList").html("");
            var lType = params["leftType"];
            var rType = params["rightType"];
            var Lqid = params["leftqId"];
            var Rqid = params["rightqId"];

            var LbasicParams = painter.allquery(Lqid, lType);
            var rResultParams = painter.allquery(Rqid, rType);
            quo.LbasicParams = LbasicParams.basicParams;
            quo.RbasicParams = rResultParams.basicParams;
            painter.allPaint(lType, Lqid, LbasicParams, rType, Rqid, rResultParams, com.focusPage('#ALLDetailList'))
        }
    };
})();

$(function () {
    com.focusPage("#compareBackBtn").on(ace.click_event, function () {
        bootbox.confirm("确定返回上一页?", function (result) {
            if (result) {
                com.switchPage(params["historyQuotation"]);
            }
        });
    });
    QuotetionDetail.init();

});
