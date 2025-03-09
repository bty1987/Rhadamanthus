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

    balance: function (balanceSales) {

        var balanceBillItems = [];
        var decorationInfos = [];

        var items = balanceSales.items;

        if (items.length == 0) {
            com.showAlert(com.warning, "无同步数据.");
            return false;
        }

        $.each(items, function (i, v) {

            //代收金额/服务费金额/客户/销售单号/代收服务费/优惠券/代收券
            balanceBillItems.push(kingdeeUtils.balanceBillItem(v.salesRevenue, v.serviceMoney, v.orderId, v.no, v.coupon));

            decorationInfos.push({"orderId": v.orderId, "address": v.address});
        });

        // 单据编号/创建人/业务日期/币别/类型/核算类别/款项组织/结算组织/品牌/供应商/结算单号/代收服务费合计/代收合计
        var billNo =  Date.now() + balanceSales.bsid;
        var creator = balanceSales.creater.userId;
        var date = balanceSales.balanceTime;
        var salesGrade = balanceSales.grade;
        var brand = balanceSales.brand.kino;
        var supplier = balanceSales.brand.supplier.oldUserId;
        var balanceNo = balanceSales.name;
        var payment = balanceSales.payment;
        var income = balanceSales.income;
        var paymentOrg = balanceSales.paymentOrg;

        kingdeeUtils.balanceBill(balanceBillItems, decorationInfos, billNo, creator, date, "0003", salesGrade, paymentOrg, paymentOrg, brand, supplier, balanceNo, payment, income);
    },

    payment: function (payment, htmlName) {
        var companyDorgNo = ""; // 装修公司装修编号
        var companySorgNo = ""; // 装修公司销售编号

        var paymentType = null;

        var receivableTotal = 0;  // 应收单总额
        var fundBankMoney = 0;  // 资金类型的银行金额

        var collectBillItems = [];  // 收款单单据体
        var refundBillItems = [];  // 收款退款单据体
        var materialTransferBillItems = [];  // 转款单单据体
        var receivableBillItems = [];  // 应收单单据体

        var sign = "-";  // 正负数
        var receipt = ["sales", "service"].contains(htmlName) ? payment[htmlName + "Receipt"] : payment;

        var cash = receipt.cash;
        var cashInfo = receipt.cashInfo;
        var bank = receipt.bank;
        var bankInfo = receipt.bankInfo;
        var checkv = receipt.checkv;
        var checkvInfo = receipt.checkvBank;
        var advance = receipt.advance;

        com.post(api.system.queryCompanyByCid, {"company.cid": params.company.cid}, function(res) {
            companyDorgNo = res.company.drganization.no;
            companySorgNo = res.company.srganization.no;
        }, null, false);

        var orgno = companyDorgNo;  // 组织编号
        var currenCollectReceiptType = "SKDLX01_SYS"; // 销售收款单
        var currenRefundReceiptType = "SKTKDLX01_SYS"; // 销售业务退款单
        var currenPurposes = "SFKYT01_SYS"; // 销售收款

        var url = api.data.queryPaymentTypeByName;
        var option;
        var receiptNo; // 单据编号

        switch (htmlName) {
            case "payment":
                option = {"paymentType.name": constant.payment().advancePayment.paymentType.keys[payment.paymentType]};
                receiptNo =  Date.now() + payment.arId;

                currenCollectReceiptType = "SKDLX02_SYS"; // 其他业务收款单
                currenRefundReceiptType = "SKTKDLX02_SYS"; // 其他业务退款单
                currenPurposes = "1008"; // 装修收款
                break;
            case "":
                option = {"paymentType.name": payment.paymentType};
                receiptNo =  Date.now() + payment.drId;
                break;
            case "service":
                var name = "服务费";
                if (payment.type == 1) name = "服务费退款";
                option = {"paymentType.name": name};
                receiptNo =  Date.now() + payment.serviceReceipt.srId;
                break;
        }

        com.post(url, option, function(ptdata) {
            paymentType = ptdata.paymentType;
        }, null, false);

        var bustype = paymentType.bustype; // 款项业务类型(装修/主材)
        var paytype = paymentType.paytype; // 款项类型(收/退款)

        if (htmlName == "payment") payment.type == 0 ? paytype = 1 : paytype = 0;

        if (paytype == 0) sign = ""; // 收款

        // 主材类型
        if (bustype == 1) {
            orgno = companySorgNo;
            currenCollectReceiptType = "SKDLX02_SYS"; // 其他业务收款单
            currenRefundReceiptType = "SKTKDLX02_SYS"; // 其他业务退款单

            currenPurposes = htmlName == "payment" ? "1003" : "1004"; // 1003: 代收主材预付款 1004: 代收主材款
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
                    var cashRefund = kingdeeUtils.collectRefundBillItem(receiptType.kibalance, currenPurposes, cash, "", payment.comment);
                    refundBillItems.push(cashRefund);
                }
            }, null, false);
        }

        if (bank > 0) {
            var bankDatas = kingdeeUtils.bankAndCheckv(true, bankInfo, paytype, currenPurposes, payment, paymentType, receivableTotal, fundBankMoney, collectBillItems, refundBillItems, payment.decoration.customer.cid);

            receivableTotal = bankDatas[0];
            fundBankMoney = bankDatas[1];
        }

        if (checkv > 0) {
            var checkvDatas = kingdeeUtils.bankAndCheckv(false, checkvInfo, paytype, currenPurposes, payment, paymentType, receivableTotal, fundBankMoney, collectBillItems, refundBillItems, payment.decoration.customer.cid);

            receivableTotal = checkvDatas[0];
            fundBankMoney = checkvDatas[1];
        }

        if (advance > 0 && bustype == 0) { // 装修
            receivableTotal = utils.accAdd(receivableTotal, sign + advance);

            // 实收金额/品牌/供应商/销售单号/款项类型
            materialTransferBillItems.push(kingdeeUtils.materialTransferBillItem(sign + advance, "", "", "", paymentType.kino))
        }

        // 拼接各单据头
        kingdeeUtils.joinReceipt(collectBillItems, refundBillItems, materialTransferBillItems, null, receivableBillItems, fundBankMoney, 0, receivableTotal, currenCollectReceiptType, currenRefundReceiptType, orgno, payment, paymentType, receiptNo, htmlName);
    },

    salesPayment: function (payment, htmlName) {
        var companyDorgNo = ""; // 装修公司装修编号
        var companySorgNo = ""; // 装修公司销售编号

        var paymentType = null;

        var fundBankMoney = 0;  // 资金类型的银行金额

        var collectBillItems = [];  // 收款单单据体
        var refundBillItems = [];  // 收款退款单据体

        var sign = "-";  // 正负数
        var receipt = payment.salesReceipt;

        var cash = receipt.cash;
        var cashInfo = receipt.cashInfo;
        var bank = receipt.bank;
        var bankInfo = receipt.bankInfo;
        var checkv = receipt.checkv;
        var checkvInfo = receipt.checkvBank;
        var advance = receipt.advance;
        var coupon = receipt.coupon;
        var couponInfo = receipt.couponInfo;

        com.post(api.system.queryCompanyByCid, {"company.cid": params.company.cid}, function(res) {
            companyDorgNo = res.company.drganization.no;
            companySorgNo = res.company.srganization.no;
        }, null, false);

        var orgno = companySorgNo; // 组织编号
        var currenCollectReceiptType = "SKDLX02_SYS";
        var currenRefundReceiptType = "SKTKDLX02_SYS";
        var currenPurposes = "1004";

        var url = api.data.queryPaymentTypeByName;
        var option = {"paymentType.name": constant.payment().materialPayment.paymentType.keys[payment.type]};
        var receiptNo =  Date.now() + payment.salesReceipt.srId; // 单据编号

        com.post(url, option, function(ptdata) {
            paymentType = ptdata.paymentType;
        }, null, false);

        var paytype = paymentType.paytype; // 款项类型(收/退款)

        if (paytype == 0) sign = ""; // 收款

        if (cash > 0) {
            com.post(api.data.queryReceiptTypeByNo, {"receiptType.no": cashInfo}, function(rpData) {
                var receiptType = rpData.receiptType;

                if (paytype == 0) { // 收款
                    sign = "";

                    var cashCollect = kingdeeUtils.collectBillItem(currenPurposes, receiptType.kibalance, cash, "", "", "");
                    collectBillItems.push(cashCollect);
                } else if (paytype == 1) { // 退款
                    var cashRefund = kingdeeUtils.collectRefundBillItem(receiptType.kibalance, currenPurposes, cash, "", payment.comment);
                    refundBillItems.push(cashRefund);
                }
            }, null, false);
        }

        if (bank > 0) {
            var bankDatas = kingdeeUtils.bankAndCheckv(true, bankInfo, paytype, currenPurposes, payment, paymentType, 0, fundBankMoney, collectBillItems, refundBillItems, payment.sales.customer.cid);
            fundBankMoney = bankDatas[1];
        }

        if (checkv > 0) {
            var checkvDatas = kingdeeUtils.bankAndCheckv(false, checkvInfo, paytype, currenPurposes, payment, paymentType, 0, fundBankMoney, collectBillItems, refundBillItems, payment.sales.customer.cid);
            fundBankMoney = checkvDatas[1];
        }

        // 拼接各单据头
        kingdeeUtils.joinReceipt(collectBillItems, refundBillItems, null, null, null, fundBankMoney, 0, 0, currenCollectReceiptType, currenRefundReceiptType, orgno, payment, paymentType, receiptNo, htmlName);
    },

    bankAndCheckv: function (isBank, info, paytype, currenPurposes, decorationPayment, paymentType, receivableTotal, fundBankMoney, collectBillItems, refundBillItems, cid) {
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

                        if (receiptType.fund == 0) return; // 非资金

                        fundBankMoney = utils.accAdd(fundBankMoney, _i[1]);
                        receivableTotal = utils.accAdd(receivableTotal, _i[1]);

                        var bankCollect = kingdeeUtils.collectBillItem(currenPurposes, receiptType.kibalance, _i[1], receiptType.bankno, _i[2], comment);
                        collectBillItems.push(bankCollect);

                    } else if (paytype == 1) { // 退款
                        if (receiptType.fund == 0) return; // 非资金

                        fundBankMoney = utils.accAdd(fundBankMoney, _i[1]);
                        receivableTotal = utils.accSub(receivableTotal, _i[1]);

                        var customerAccountName;
                        var customerAccountBank;
                        var customerAccountBankNo;
                        
                        com.post(api.data.queryCustomerById, {"customer.cid": cid}, function (res) {
                            customerAccountName =  res.customer.companyName;
                            customerAccountBank =  res.customer.companyBank;
                            customerAccountBankNo =  res.customer.companyBankno;
                        }, null, false);

                        var bankRefund = kingdeeUtils.collectRefundBillItem(receiptType.kibalance, currenPurposes, _i[1], receiptType.bankno, decorationPayment.comment, customerAccountName, customerAccountBank, customerAccountBankNo);
                        refundBillItems.push(bankRefund);
                    }
                }, null, false);
            }

            return [receivableTotal, fundBankMoney];
        }
    },

    SP2MTBillItems: function (salesPayment, materialTransferTotal, materialTransferBillItems) {
        var kino;
        var supplier;
        var depOut;
        var depTurn;
        var currentDataKino;

        var depositpay = salesPayment.sales.depositpay;
        var bid = salesPayment.sales.bid;
        var no = salesPayment.sales.no;

        com.post(api.data.queryBrandByBid, {"brand.bid": bid}, function (brandData) {
            kino = brandData.brand.kino;
            supplier = brandData.brand.supplier.oldUserId;
        }, null, false);

        com.post(api.data.queryPaymentTypeByName, {"paymentType.name": "定金出"}, function (resPayType) {
            depOut = resPayType.paymentType.kino
        }, null, false);

        com.post(api.data.queryPaymentTypeByName, {"paymentType.name": "定金转全款"}, function (payTypeRes) {
            depTurn = payTypeRes.paymentType.kino
        }, null, false);

        if ([3, 5].contains(salesPayment.type) && salesPayment.sales.depositpayStatus > 0) {
            // 实收金额/品牌/供应商/销售单号/款项类型
            materialTransferBillItems.push(kingdeeUtils.materialTransferBillItem(-depositpay, kino, supplier, no, depOut));
            materialTransferBillItems.push(kingdeeUtils.materialTransferBillItem(depositpay, kino, supplier, no, depTurn));
        }

        var option = {"paymentType.name": constant.payment().materialPayment.paymentType.keys[salesPayment.type]};

        com.post(api.data.queryPaymentTypeByName, option, function(ptdata) {
            currentDataKino = ptdata.paymentType.kino;
        }, null, false);

        materialTransferTotal = utils.accAdd([materialTransferTotal, salesPayment.referMoney]);
        materialTransferBillItems.push(kingdeeUtils.materialTransferBillItem(salesPayment.referMoney, kino, supplier, no, currentDataKino));

        return [materialTransferTotal, materialTransferBillItems]
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
            "FCOMMENT": comment.replace(/\n/g, " ")
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
            "FREMARK": comment.replace(/\n/g, " "),
            "FRECEIVEBILLENTRY": data,
            "redis": 0
        };

        kingdeeUtils.kingdeePost(options);
    },

    collectRefundBillItem: function (settletype, purpose, refundMoney, bankNo, comment, customerAccountName, customerAccountBank, customerAccountBankNo) {
        // 结算方式/原收款用途/应退金额/我方银行账号/备注/对方账户名称/对方开户行/对方银行账号
        var paramItem = {
            "FSETTLETYPEID": settletype,
            "FPURPOSEID": purpose,
            "FREFUNDAMOUNTFOR": refundMoney,
            "FACCOUNTID": bankNo,
            "FNOTE": comment.replace(/\n/g, " "),
            "FOPPOSITECCOUNTNAME": customerAccountName,
            "FOPPOSITEBANKNAME": customerAccountBank,
            "FOPPOSITEBANKACCOUNT": customerAccountBankNo
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
            "FAR_Remark": comment.replace(/\n/g, " "),
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

    balanceBill: function (items, decorationInfos, billNo, creator, date, type, salesGrade, paymentOrg, balanceOrg, brand, supplier, balanceNo, collectionServiceAmount, collectionAmount) {
        var data = JSON.stringify(items);
        var decorationInfoDatas = JSON.stringify(decorationInfos);

        // 单据编号/创建人/业务日期/币别/类型/核算类别/款项组织/结算组织/品牌/供应商/结算单号/代收服务费合计/代收合计
        var options = {
            "api": "kingdee.kingdee.balanceBill",
            "FBillNo": billNo,
            "F_SFKD_ywcjr": creator,
            "F_SFKD_Date": date,
            "F_SFKD_Cur": "PRE001",
            "F_SFKD_Assistant": type,
            "F_SFKD_ABC": salesGrade,
            "F_SFKD_OrgId": paymentOrg,
            "F_SFKD_OrgId1": balanceOrg,
            "F_SFKD_Brand": brand,
            "F_SFKD_Supplier": supplier,
            "F_SFKD_SaleBillNo": balanceNo,
            "F_SFKD_Amount1": collectionServiceAmount,
            "F_SFKD_dshj": collectionAmount,
            "FEntity": data,
            "decorationInfos": decorationInfoDatas,
            "redis": 0
        };

        kingdeeUtils.kingdeePost(options);
    },

    balanceBillItem: function (collectionMoney, serviceMoney, orderId, salesNo, coupon) {
        // 代收金额/服务费金额/客户/装修单号/销售单号/优惠券
        var paramItem = {
            "F_SFKD_JieSuanAmount": collectionMoney,
            "F_SFKD_ShiShouAmount": serviceMoney,
            "F_ora_Base": orderId,
            "F_SFKD_Text": salesNo,
            "F_SFKD_yhq": coupon
        };

        return paramItem;
    },

    joinReceipt: function(collectBillItems, refundBillItems, materialTransferBillItems, bankTransitionBillItems, receivableBillItems, fundBankMoney, bankTransitionTotal, receivableTotal, currenCollectReceiptType, currenRefundReceiptType, orgno, payment, paymentType, receiptNo, htmlName) {

        var decoration = payment.decoration;
        if (htmlName == "sales") decoration = payment.sales;

        var receipt = ["sales", "service"].contains(htmlName) ? payment[htmlName + "Receipt"] : payment;

        if (collectBillItems.length > 0) {
            kingdeeUtils.collectBill(collectBillItems, receipt.collectTime, currenCollectReceiptType, "BD_Customer", decoration.orderId, "BD_Customer", decoration.orderId, orgno, orgno, decoration.grade, paymentType.kino, receipt.comment)
        }

        if (refundBillItems.length > 0) {
            kingdeeUtils.collectRefundBill(refundBillItems, receipt.collectTime, currenRefundReceiptType, orgno, "BD_Customer", "BD_Customer", decoration.orderId, decoration.orderId, orgno, decoration.grade, paymentType.kino);
        }

        if (materialTransferBillItems.length > 0) {
            var materialRealMoney = receipt.advance;

            if (paymentType.paytype == 1) materialRealMoney = -receipt.advance; // 退款

            if (paymentType.bustype == 1) materialRealMoney = payment.referMoney;

            kingdeeUtils.materialTransferBill(materialTransferBillItems, receiptNo, receipt.collectTime, "BD_Customer", "BD_Customer", decoration.grade, orgno, orgno, decoration.orderId, materialRealMoney);
        }

        if (bankTransitionBillItems != null && bankTransitionBillItems.length > 0) {
            kingdeeUtils.bankTransitionBill(bankTransitionBillItems, receiptNo, receipt.collectTime, "BD_Customer", "BD_Customer", orgno, orgno, decoration.grade, decoration.orderId, bankTransitionTotal);
        }

        // 应收单
        if (paymentType.bustype == 0 && utils.accAdd(utils.accAdd(receipt.cash, fundBankMoney), receipt.advance) > 0){

            var noTaxMoney = utils.accDiv(receivableTotal, (utils.accAdd(1, utils.accDiv(paymentType.taxrate, 100)))); // 不含税金额
            var taxMoney = utils.accSub(receivableTotal, noTaxMoney);

            receivableBillItems.push(kingdeeUtils.receivableBillItem(paymentType.kibalance, noTaxMoney, taxMoney));

            kingdeeUtils.receivableBill(receivableBillItems, receipt.collectTime, "YSD02_SYS", decoration.orderId, orgno, orgno, decoration.grade, paymentType.kino, "项目地址:"+decoration.house.village.name+' '+decoration.house.houseNumber);
        }
    },

    kingdeeThirdPartyCommon: function(items, objectName) {

        var kingdeeOptions = {
            "api": "kingdee.kingdee.thirdPartyCommon",
            "tableName": objectName,
            "data": JSON.stringify(items),
            "redis": 0
        };

        com._post_(api.home.library, kingdeeOptions, function(res) {
            if (res.code == 0) {
                com.showAlert(com.info, "操作成功");
            } else {
                com.showAlert(com.warning, res.code + " " + res.msg);
            }
        }, function(error){
            com.showAlert(com.error, error.errorMsg);
        });
    },

    categoryToKingdee: function(category) {

        if (config.kingdee == false) return false;

        com.showConfirm("数据需要同步金蝶吗?", function(res) {

            var items = [
                {
                    "FNumber": category.no,
                    "FDataValue": category.name,
                    "FCreateOrgName": category.companyName,
                    "FDescription": ""
                }
            ]; // 编码/名称/组织名称/备注

            kingdeeUtils.kingdeeThirdPartyCommon(items, "Category");

        });
    },

    brandToKingdee: function(brand) {

        console.log(config.kingdee)
        console.log(config.kingdee == false)
        if (config.kingdee == false) return false;

        com.showConfirm("数据需要同步金蝶吗?", function(res) {

            var category = null;

            com.post(api.data.queryCategoryByCId, {"category.cid": brand.categoryId}, function (res) {
                category = res.category;
            }, null, false);

            var items = [
                {
                    "FNumber": brand.no,
                    "FName": brand.name,
                    "FCreateOrgName": brand.companyName, // 100 方林集团(虚拟)
                    "F_UNW_WLPL": category.no
                }
            ]; // 编码/名称/组织名称或公司/品类编码

            kingdeeUtils.kingdeeThirdPartyCommon(items, "Brand");
        });
    },

    dutyToKingdee: function(duty) {

        if (config.kingdee == false) return false;

        com.showConfirm("数据需要同步金蝶吗?", function(res) {

            var items = [
                {
                    "FName": duty.name,
                    "FNumber": duty.name,
                    "FCreateOrgName": duty.companyName // params.company.fullname
                }
            ]; // 岗位名称/编码/组织名称

            kingdeeUtils.kingdeeThirdPartyCommon(items, "Position");
        });
    },

    userToKingdee: function(user) {

        if (config.kingdee == false) return false;

        com.showConfirm("数据需要同步金蝶吗?", function(res) {

            var items = [
                {
                    "FName": user.userName,
                    "FNumber": user.drganizationNo,
                    "FCreateOrgName": user.drganizationName,
                    "FStaffNumber": user.userId,
                    "FPostDept": user.deptName,
                    "FWorkOrgId": user.drganizationNo,
                    "FSupervisor": user.dutyName == "工程部监理" ? "0" : "1"
                }
            ]; // 员工姓名/组织编码/组织名称/员工编号/所属部门/工作组织/监理

            kingdeeUtils.kingdeeThirdPartyCommon(items, "Staff");
        });
    },

    decorationToKingdee: function(decoration) {

        if (config.kingdee == false) return false;

        com.showConfirm("数据需要同步金蝶吗?", function(res) {
            console.log(decoration.address == null);
            console.log("-----------------------------");

            if (decoration.address == null) {
                com.post(api.data.queryHouseByHid, {"house.hid": decoration.houseId}, function(res) {
                    decoration["address"] = (res.house.village.cityProper.city.name == null ? " " : res.house.village.cityProper.city.name) + " " + (res.house.village.cityProper == null ? " " : res.house.village.cityProper.name) + " " + res.house.village.name + " " + (res.house.houseNumber == null ? " " : res.house.houseNumber);
                }, null, false);
            }

            var items = [
                {
                    "FName": decoration.address,
                    "FNumber": decoration.orderId,
                    "FCreateOrgName": decoration.drganizationName,
                    "FDescription": decoration.drganizationNo
                }
            ]; // 客户姓名/编码/组织名称/备注

            kingdeeUtils.kingdeeThirdPartyCommon(items, "Customer");
        });
    },

    accessoriesOutToKingdee: function(accessories) {

        if (config.kingdee == false) return false;

        com.showConfirm("数据需要同步金蝶吗?", function(res) {

            var accessoriesNo = "";
            var approverTime = "";

            com.post(api.inventory.queryAccessoriesByAid, {"accessories.aid": accessories.aid}, function(res) {
                accessoriesNo = res.accessories.no;
                approverTime = res.accessories.approverTime;
            }, null, false);

            var items = {
                "fdate": new Date(approverTime).toISOString(),
                "fcustomer_name": accessories.drganizationName,
                "ffldh": accessoriesNo,
                "fentity": accessories.items
            }; // 审批时间/公司名/辅料单号/项目

            kingdeeUtils.kingdeeThirdPartyCommon(items, "SalesOutStock");
        });
    },

    accessoriesReturnToKingdee: function(accessories) {

        if (config.kingdee == false) return false;

        com.showConfirm("数据需要同步金蝶吗?", function(res) {

            var accessoriesNo = "";
            var approverTime = "";

            com.post(api.inventory.queryAccessoriesByAid, {"accessories.aid": accessories.aid}, function(res) {
                accessoriesNo = res.accessories.no;
                approverTime = res.accessories.approverTime;
            }, null, false);

            var items = {
                "fdate": new Date(approverTime).toISOString(),
                "fcustomer_name": accessories.drganizationName,
                "ffldh": accessoriesNo,
                "fentity": accessories.items
            }; // 审批时间/公司名/辅料单号/项目

            kingdeeUtils.kingdeeThirdPartyCommon(items, "SalesReturnStock");
        });
    }
};
