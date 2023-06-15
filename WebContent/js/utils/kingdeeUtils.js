var kingdeeUtils = {

    workerSalary: function(params) {
        var dompany = "";
        var conpany = "";
        var companyNo = ""; // 装修公司编号
        var conpanyName = ""; // 工程公司名称
        var companyDorgNo = ""; // 装修公司装修编号
        var conpanySorgNo = ""; // 工程公司销售编号
        var constructionNodeKino = ""; // 施工节点金蝶编号
        var supervisor = ""; // 监理编号
        var workerNo = ""; // 工人编号

        com.post(api.salary.queryWorkerSalaryByWsid, {"workerSalary.wsid": params.wsid}, function(res) {
            var decoration = res.workerSalary.decoration;
            dompany = decoration.dompany;
            conpany = decoration.conpany;
            supervisor = decoration.supervisor.userId;
            workerNo = res.workerSalary.user.userId;
        }, null, false);

        com.post(api.system.queryCompanyByCid, {"company.cid": dompany}, function(res) {
            companyDorgNo = res.company.drganization.no;
            companyNo = res.company.no;
        }, null, false);

        com.post(api.system.queryCompanyByCid, {"company.cid": conpany}, function(res) {
            conpanyName = res.company.name;
            conpanySorgNo = res.company.srganization.no;
        }, null, false);

        com.post(api.data.queryConstructionNodeByCnid, {"constructionNode.cnid": params.cnid}, function(res) {
            constructionNodeKino = res.constructionNode.kino;
        }, null, false);

        var payOrg = "";
        var supplier = "";
        var grade = params.decoration.grade;

        if((grade == "A" || grade == "C") && conpanyName == "中迈劳务") {
            payOrg = companyDorgNo;
            supplier = "000030";
        } else {
            payOrg = "200";
            supplier = "200";
        }

        kingdeeUtils.payableBill(params.salary, params.approveTime, supplier, payOrg, params.decoration.orderId, supervisor, workerNo, constructionNodeKino, params.twotype, conpanySorgNo, companyNo, grade);
    },

    decorationPayment: function (decorationPayment) {
        var companyDorgNo = ""; // 装修公司装修编号
        var companySorgNo = ""; // 装修公司销售编号

        var paymentType = null;

        var receivableTotal = 0;  // 应收单总额
        var bankTransitionTotal = 0;  // 银行转款单总额
        var fundBankMoney = 0;  // 资金类型的银行金额

        var collectBillItems = [];  // 收款单单据体
        var refundBillItems = [];  // 收款退款单据体
        var materialTransferBillItems = [];  // 转款单单据体
        var receivableBillItems = [];  // 应收单单据体
        var bankTransitionBillItems = [];  // 银行过渡单单据体

        var decoration = decorationPayment.decoration;
        var sign = "-";  // 正负数

        var cash = decorationPayment.cash;
        var cashInfo = decorationPayment.cashInfo;
        var bank = decorationPayment.bank;
        var bankInfo = decorationPayment.bankInfo;
        var checkv = decorationPayment.checkv;
        var checkvInfo = decorationPayment.checkvBank;
        var advance = decorationPayment.advance;
        var coupon = decorationPayment.coupon;
        var couponInfo = decorationPayment.couponInfo;

        com.post(api.system.queryCompanyByCid, {"company.cid": params.company.cid}, function(res) {
            companyDorgNo = res.company.drganization.no;
            companySorgNo = res.company.srganization.no;
        }, null, false);

        var orgno = companyDorgNo;  // 组织编号
        var currenCollectReceiptType = "SKDLX01_SYS";
        var currenRefundReceiptType = "SKTKDLX01_SYS";
        var currenPurposes = "SFKYT01_SYS";

        com.post(api.data.queryPaymentTypeByPtid, {"paymentType.ptid": decorationPayment.ptid}, function(ptdata) {
            paymentType = ptdata.paymentType;
        }, null, false);

        var bustype = paymentType.bustype; // 款项业务类型(装修/主材)
        var paytype = paymentType.paytype; // 款项类型(收/退款)

        if (paytype == 0) sign = ""; // 收款

        // 主材类型
        if (bustype == 1) {
            orgno = companySorgNo;
            currenCollectReceiptType = "SKDLX02_SYS";
            currenRefundReceiptType = "SKTKDLX02_SYS";
            currenPurposes = "1004";
        }

        if (cash > 0) {
            com.post(api.data.queryReceiptTypeByNo, {"receiptType.no": cashInfo}, function(rpData) {
                var receiptType = rpData.receiptType;

                if (paytype == 0) { // 收款
                    sign = "";

                    receivableTotal = utils.accAdd(receivableTotal, cash);
                    var cashCollect = kingdeeUtils.collectBillItem(currenPurposes, receiptType.kibalance, cash, "", "", "");
                    collectBillItems.push(cashCollect);
                } else if (paytype == 1) { // 退款
                    receivableTotal = utils.accSub(receivableTotal, cash);
                    var cashRefund = kingdeeUtils.collectRefundBillItem(receiptType.kibalance, currenPurposes, cash, "", decorationPayment.comment);
                    refundBillItems.push(cashRefund);
                }
            }, null, false);
        }

        if (bank > 0) {
            var bankDatas = kingdeeUtils.bankAndCheckv(true, bankInfo, paytype, currenPurposes, decorationPayment, paymentType, receivableTotal, bankTransitionTotal, fundBankMoney, collectBillItems, bankTransitionBillItems, refundBillItems);

            receivableTotal = bankDatas[0];
            bankTransitionTotal = bankDatas[1];
            fundBankMoney = bankDatas[2];
        }

        if (checkv > 0) {
            var checkvDatas = kingdeeUtils.bankAndCheckv(false, checkvInfo, paytype, currenPurposes, decorationPayment, paymentType, receivableTotal, bankTransitionTotal, fundBankMoney, collectBillItems, bankTransitionBillItems, refundBillItems);
            receivableTotal = checkvDatas[0];
            bankTransitionTotal = checkvDatas[1];
            fundBankMoney = checkvDatas[2];
        }

        if (advance > 0) {
            if (bustype == 0){ // 装修
                receivableTotal = utils.accAdd(receivableTotal, sign + advance);

                // 实收金额/品牌/供应商/销售单号/款项类型
                materialTransferBillItems.push(kingdeeUtils.materialTransferBillItem(sign + advance, "", "", "", paymentType.kino))
            } else if (bustype == 1) { // 主材

                var advanceType = "转回主材预付款";

                if (paytype == 0) advanceType = "主材预付款"; // 收款

                com.post(api.data.queryPaymentTypeByName, {"paymentType.name": advanceType}, function (ptRes) {
                    var paymentType = ptRes.paymentType;

                    bankTransitionTotal = utils.accAdd(bankTransitionTotal, advance);
                    bankTransitionBillItems.push(kingdeeUtils.bankTransitionBillItem(advance, paymentType.kino));
                }, null, false);

            }
        }

        if (bustype == 1 && coupon > 0) {

            if (couponInfo.indexOf("#") != -1) {
                var _s = couponInfo.split('#');

                for ( var i = 1; i < utils.accSub(_s.length, 1); i++) {
                    var _i = _s[i].split(':');

                    bankTransitionTotal = utils.accAdd(bankTransitionTotal, _i[1]);
                    bankTransitionBillItems.push(kingdeeUtils.bankTransitionBillItem(_i[1], _i[0]))
                }
            }
        }

        if (bustype == 1){ // 主材转款单
            // 实收金额/品牌/供应商/销售单号/款项类型
            materialTransferBillItems.push(kingdeeUtils.materialTransferBillItem(decorationPayment.referMoney, "", "", "", paymentType.kino))
        }

        // 拼接各单据头
        kingdeeUtils.joinReceipt(collectBillItems, refundBillItems, materialTransferBillItems, bankTransitionBillItems, receivableBillItems, fundBankMoney, bankTransitionTotal, receivableTotal, currenCollectReceiptType, currenRefundReceiptType, orgno, decorationPayment, paymentType);
    },

    bankAndCheckv: function (isBank, info, paytype, currenPurposes, decorationPayment, paymentType, receivableTotal, bankTransitionTotal, fundBankMoney, collectBillItems, bankTransitionBillItems, refundBillItems) {
        if (info.indexOf("#") != -1) {
            var _s = info.split('#');

            for ( var i = 1; i < utils.accSub(_s.length, 1); i++) {
                var _i = _s[i].split('|');

                com.post(api.data.queryReceiptTypeByNo, {"receiptType.no": _i[0]}, function(rpData) {
                    var receiptType = rpData.receiptType;

                    if (receiptType.fund == null) {
                        com.showAlert(com.error, "当前公司无匹配"+(isBank ? "'刷卡'" : "'银行'") +"类型数据.");
                        return false;
                    }

                    if (paytype == 0) { // 收款
                        var comment = "";

                        if (isBank) {
                            com.post(api.payment.queryPaytranByPtid, {"paytran.ptid": _i[3]}, function(pydata) {
                                comment = pydata.paytran.msgId;
                            }, null, false);
                        }

                        if (receiptType.fund == 1) { // 资金
                            receivableTotal = utils.accAdd(receivableTotal, _i[1]);
                            var bankCollect = kingdeeUtils.collectBillItem(currenPurposes, receiptType.kibalance, _i[1], receiptType.bankno, _i[2], comment);
                            collectBillItems.push(bankCollect);
                        } else if (receiptType.fund == 0 && bustype == 1) { // 非资金 & 主材
                            bankTransitionTotal = utils.accAdd(bankTransitionTotal, _i[1]);
                            var bankTransition = kingdeeUtils.bankTransitionBillItem(_i[1], paymentType.kino);
                            bankTransitionBillItems.push(bankTransition);
                        }

                    } else if (paytype == 1) { // 退款
                        if (receiptType.fund == 1) { // 资金
                            fundBankMoney = utils.accAdd(fundBankMoney, _i[1]);
                            receivableTotal = utils.accSub(receivableTotal, _i[1]);

                            var bankRefund = kingdeeUtils.collectRefundBillItem(receiptType.kibalance, currenPurposes, _i[1], receiptType.bankno, decorationPayment.comment);
                            refundBillItems.push(bankRefund);
                        } else if (receiptType.fund == 0 && paymentType.bustype == 1) { // 非资金 & 主材
                            bankTransitionTotal = utils.accAdd(bankTransitionTotal, _i[1]);
                            var bankTransition = kingdeeUtils.bankTransitionBillItem(_i[1], paymentType.kino);
                            bankTransitionBillItems.push(bankTransition);
                        }
                    }
                }, null, false);
            }

            return [receivableTotal, bankTransitionTotal, fundBankMoney];
        }
    },

    payableBill: function (money, date, supplier, payOry, orderId, supervisor, workerNo, constructionNodeKino, twotype, conpanySorgNo, companyNo, grade) {
        var paramItem = [ {
            "FCOSTID": "CI002",
            "FPRICEUNITID": "UOM001",
            "Fprice": money,
            "FPriceQty": "1",
            "FTaxPrice": money,
            "FEntryTaxRate": "0.00",
            "FNoTaxAmountFor_D": money,
            "FTAXAMOUNTFOR_D": "0.00",
            "FALLAMOUNTFOR_D": money
        }];

        var data = JSON.stringify(paramItem);

        var options = {
            "api": "kingdee.kingdee.payableBill",
            "FDATE": date,
            "FSETTLEORGID": "200",
            "FCURRENCYID": "PRE001",
            "FBillTypeID": "YFD02_SYS",
            "FENDDATE_H": date,
            "FSUPPLIERID": supplier,
            "FBUSINESSTYPE": "FY",
            "FPAYORGID": payOry,
            "F_ora_Base": orderId,
            "F_SFKD_Base": supervisor,
            "F_SFKD_Base1": workerNo,
            "F_SFKD_Base2": constructionNodeKino,
            "F_SFKD_Assistant": twotype,
            "F_SFKD_Assistant1": conpanySorgNo,
            "F_SFKD_Assistant2": companyNo,
            "F_SFKD_Base7": grade,
            "FEntityDetail":data,
            "redis": 0
        };

        kingdeeUtils.kingdeePost(options);
    },

    collectBillItem: function (purpose, settletype, money, bankNo, settleno, comment) {
        // 收款用途/结算方式/应收金额/银行账号/结算号(刷卡+银行)/备注(银行-转换款的msgid-金蝶平台订单号)
        var paramItem = {
            "FPURPOSEID": purpose,
            "FSETTLETYPEID": settletype,
            "FRECTOTALAMOUNTFOR": money,
            "FACCOUNTID": bankNo,
            "FSETTLENO": settleno,
            "FCOMMENT": comment
        };

        return paramItem;
    },

    collectBill: function (items, collectTime, billType, wlOrgType, contactunit, payOrgType, payOrg, pompany, settleOrg, grade, paymentType, comment) {

        var data = JSON.stringify(items);

        // 收款日期/单据类型/往来单位类型(FCONTACTUNITTYPE)/单号/付款单位类型(FPAYUNITTYPE)/付款单位(FPAYUNIT)/款项公司/结算组织/等级/款项类型/备注/单据体明细
        var options = {
            "api": "kingdee.kingdee.collectbill",
            "FDATE": collectTime,
            "FBILLTYPEID": billType,
            "FCONTACTUNITTYPE":  wlOrgType,
            "FCONTACTUNIT":  contactunit,
            "FPAYUNITTYPE": payOrgType,
            "FPAYUNIT": payOrg,
            "FPAYORGID": pompany,
            "FSETTLEORGID": settleOrg,
            "F_SFKD_Hslb": grade,
            "F_SFKD_Base": paymentType,
            "FREMARK": comment,
            "FRECEIVEBILLENTRY": data,
            "redis": 0
        };

        kingdeeUtils.kingdeePost(options);
    },

    collectRefundBillItem: function (settletype, purpose, refundMoney, bankNo, comment) {
        // 结算方式/原收款用途/应退金额/我方银行账号/备注
        var paramItem = {
            "FSETTLETYPEID": settletype,
            "FPURPOSEID": purpose,
            "FREFUNDAMOUNTFOR": refundMoney,
            "FACCOUNTID": bankNo,
            "FNOTE": comment
        };

        return paramItem;
    },

    collectRefundBill: function (items, collectTime, receiptType, settleorg, contactunittype, rectunittype, contactunit, rectunit, payorgid, grade, paymentType) {

        var data = JSON.stringify(items);

        // 收款日期/单据类型/结算组织/往来单位类型/收款单位类型/往来单位/收款单位/付款组织/核算类别/款项类型/单据体明细
        var options = {
            "api": "kingdee.kingdee.collectRefundBill",
            "FDATE": collectTime,
            "FBILLTYPEID": receiptType,
            "FSETTLEORGID": settleorg,
            "FCONTACTUNITTYPE": contactunittype,
            "FRECTUNITTYPE": rectunittype,
            "FCONTACTUNIT": contactunit,
            "FRECTUNIT": rectunit,
            "FPAYORGID": payorgid,
            "F_ORA_BASE": grade,
            "F_SFKD_GCKXLX": paymentType,
            "FREFUNDBILLENTRY": data,
            "redis": 0
        };

        kingdeeUtils.kingdeePost(options);
    },

    bankTransitionBillItem: function (realMoney, paymentType) {
        // 实收金额/款项类型
        var paramItem = {
            "F_SFKD_ShiShouAmount": realMoney,
            "F_ora_Base6": paymentType
        };

        return paramItem;
    },

    bankTransitionBill: function (items, billNo, date, wlOrgType, payOrgType, collectOrg, salesOrg, grade, customer, realMoney) {
        var data = JSON.stringify(items);

        // 单据编号/业务日期/往来单位类型/付款单位类型/收款组织/销售组织/核算类别/客户/实收金额/单据体明细
        var options = {
            "api": "kingdee.kingdee.bankTransitionBill",
            "FBillNo": billNo,
            "F_SFKD_Date": date,
            "F_SFKD_WangLaiOrgType": wlOrgType,
            "F_SFKD_RecOrgType": payOrgType,
            "F_SFKD_RecOrg": collectOrg,
            "F_SFKD_SaleOrg": salesOrg,
            "F_ora_Base3": grade,
            "F_ora_Base2": customer,
            "F_SFKD_RealAmount": realMoney,
            "FEntity": data,
            "redis": 0
        };

        kingdeeUtils.kingdeePost(options);
    },

    materialTransferBillItem: function (realMoney, brand, supplier, salesNo, paymentType) {
        // 实收金额/品牌/供应商/销售单号/款项类型
        var paramItem = {
            "F_SFKD_RealAmount": realMoney,
            "F_ora_Base3": brand,
            "F_ora_Base4": supplier,
            "F_ora_Text": salesNo,
            "F_SFKD_Base": paymentType
        };

        return paramItem;
    },

    materialTransferBill: function (items, billNo, collectTime, wlOrgType, payOrgType, grade, collectOrg, salesOrg, customer, realMoney) {
        var data = JSON.stringify(items);

        // 单据编号/业务日期/往来单位类型/付款单位类型/核算类别/收款组织/销售组织/客户/实收金额/单据体明细
        var options = {
            "api": "kingdee.kingdee.materialTransferBill",
            "FBillNo": billNo,
            "F_SFKD_Date": collectTime,
            "F_SFKD_WangLaiUnitType": wlOrgType,
            "F_SFKD_PayUnitType": payOrgType,
            "F_SFKD_ABC": grade,
            "F_SFKD_RecOrgId": collectOrg,
            "F_SFKD_SaleOrgId": salesOrg,
            "F_ora_Base": customer,
            "F_SFKD_ShiShouAmount": realMoney,
            "FEntity": data,
            "redis": 0
        };

        kingdeeUtils.kingdeePost(options);
    },

    receivableBillItem: function (costid, noTaxAmount, taxAmount) {
        // 费用项目编码/不含税金额/税额
        var paramItem = {
            "FCOSTID": costid,
            "FNoTaxAmountFor_D": noTaxAmount,
            "FTAXAMOUNTFOR_D": taxAmount
        };

        return paramItem;
    },

    receivableBill: function (items, collectTime, billType, customer, settleOrg, collectOrg, grade, paymentType, comment) {

        var data = JSON.stringify(items);

        // 收款日期/单据类型/客户/结算组织/收款单位/核算类别/款项类型/备注/单据体明细
        var options = {
            "api": "kingdee.kingdee.receivableBill",
            "FDATE": collectTime,
            "FBillTypeID": billType,
            "FCUSTOMERID": customer,
            "FSETTLEORGID": settleOrg,
            "FPAYORGID": collectOrg,
            "F_ORA_BASE1": grade,
            "F_SFKD_Base2": paymentType,
            "FAR_Remark": comment,
            "FENTITYDETAIL": data,
            "redis": 0
        };

        kingdeeUtils.kingdeePost(options);
    },

    kingdeePost: function(options) {
        com._post_(api.home.library, options, function(res) {
            if (res.code == 0) {
                com.showAlert(com.info, "操作成功");
            } else {
                var msg = "";
                if (res.msg instanceof Array) {
                    msg = "#";
                    $.each(res.msg, function(i, v){
                        msg = msg + v.FieldName + ":" + v.Message + "#";
                    });
                } else {
                    msg = res.msg;
                }
                com.showAlert(com.warning, msg);
            }
        }, function(error){
            com.showAlert(com.error, error.errorMsg);
        });
    },

    joinReceipt: function(collectBillItems, refundBillItems, materialTransferBillItems, bankTransitionBillItems, receivableBillItems, fundBankMoney, bankTransitionTotal, receivableTotal, currenCollectReceiptType, currenRefundReceiptType, orgno, decorationPayment, paymentType) {

        var receiptNo =  Date.now() + decorationPayment.drId; // 单据编号
        var decoration = decorationPayment.decoration;

        if (collectBillItems.length > 0) {
            kingdeeUtils.collectBill(collectBillItems, decorationPayment.collectTime, currenCollectReceiptType, "BD_Customer", decoration.orderId, "BD_Customer", decoration.orderId, orgno, orgno, decoration.grade, paymentType.kino, decorationPayment.comment)
        }

        if (refundBillItems.length > 0) {
            kingdeeUtils.collectRefundBill(refundBillItems, decorationPayment.collectTime, currenRefundReceiptType, orgno, "BD_Customer", "BD_Customer", decoration.orderId, decoration.orderId, orgno, decoration.grade, paymentType.kino);
        }

        if (materialTransferBillItems.length > 0) {
            var materialRealMoney = decorationPayment.advance;

            if (paymentType.paytype == 1) materialRealMoney = -decorationPayment.advance; // 退款

            if (paymentType.bustype == 1) materialRealMoney = decorationPayment.referMoney;

            kingdeeUtils.materialTransferBill(materialTransferBillItems, receiptNo, decorationPayment.collectTime, "BD_Customer", "BD_Customer", decoration.grade, orgno, orgno, decoration.orderId, materialRealMoney);
        }

        if (bankTransitionBillItems.length > 0) {
            kingdeeUtils.bankTransitionBill(bankTransitionBillItems, receiptNo, decorationPayment.collectTime, "BD_Customer", "BD_Customer", orgno, orgno, decoration.grade, decoration.orderId, bankTransitionTotal);
        }

        // 应收单
        if (paymentType.bustype == 0 && utils.accAdd(utils.accAdd(decorationPayment.cash, fundBankMoney), decorationPayment.advance) > 0){

            var noTaxMoney = utils.accDiv(receivableTotal, (utils.accAdd(1, utils.accDiv(paymentType.taxrate, 100)))); // 不含税金额
            var taxMoney = utils.accSub(receivableTotal, noTaxMoney);

            receivableBillItems.push(kingdeeUtils.receivableBillItem(paymentType.kibalance, noTaxMoney, taxMoney));

            kingdeeUtils.receivableBill(receivableBillItems, decorationPayment.collectTime, "YSD02_SYS", decoration.orderId, orgno, orgno, decoration.grade, paymentType.kino, "项目地址:"+decoration.house.village.name+' '+decoration.house.houseNumber);
        }
    }
};
