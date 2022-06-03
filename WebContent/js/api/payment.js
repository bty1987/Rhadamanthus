
$.extend(api.index, {
    salesPaymentReceiptIndex : {url : "/views/payment/salesPaymentReceipt.html"},
		
	decorationPaymentIndex: {url: "/views/payment/decorationPayment.html"},
	decorationPaymentCheckIndex: {url: "/views/payment/decorationPayment2check.html"},
	decorationPaymentReceiptIndex: {url: "/views/payment/decorationPaymentReceipt.html"},
	activityPaymentReceiptIndex: {url: "/views/payment/activityPaymentReceipt.html"},

	materialPaymentIndex: {url: "/views/payment/materialPayment.html"},
	materialPaymentReceiptIndex: {url: "/views/payment/materialPaymentReceipt.html"},
	materialPaymentCheckIndex: {url: "/views/payment/materialPayment2check.html"},

	paymentIndex: {url: "/views/payment/payment.html"},
	paymentCheckIndex: {url: "/views/payment/payment2check.html"},
	paymentReceiptIndex: {url: "/views/payment/paymentReceipt.html"},

	servicePaymentReceiptIndex: {url: "/views/payment/servicePaymentReceipt.html"},

	walletardIndex: {url: "/views/payment/walletard.html"},
	walletranIndex: {url: "/views/payment/walletran.html"},
	walletresIndex: {url: "/views/payment/walletres.html"}

});

$.extend(api, {payment: {
	pageAdvancePayment: {
		url: "pageAdvancePayment.do",
		demo: true,
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["balance", "projectBalance", "materialBalance", "zhenglinBalance"]
		}]
	},
	queryAdvancePaymentByOrderId: {
		url: "queryAdvancePaymentByOrderId.do",
		type: "query",
		tranargs: [{
			result: "",
			args: ["balanceAdvance", "projectAdvance", "materialAdvance", "zaterialAdvance"]
		}]
	},
	addAdvancePayment: {url: "addAdvancePayment.do"},

	pagePayment: {
		url: "pagePayment.do",
		demo: true,
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["recharge", "balance", "cash", "bank", "checkv", "installment", "accounts", "transfer"]
		}]
	},
	queryPaymentByOrderId: {url: "queryPaymentByOrderId.do"}, //暂时没用到
	queryPaymentByPaymentId: {
		url: "queryPaymentByPaymentId.do",
		type: "query",
		tranargs: [{
			result: "payment",
			args: ["recharge", "balance", "cash", "bank", "checkv", "installment", "accounts", "transfer"]
		}]
	},
	collectPayment: {
		url: "collectPayment.do",
		type: "update",
		tranargs: {
			args: ["payment.cash", "payment.bank", "payment.checkv"]
		}
	},
	confirmPayment: {url: "confirmPayment.do"},
	updatePayment: {
		url: "updatePayment.do",
		type: "update",
		tranargs: {
			args: ["payment.cash", "payment.bank", "payment.checkv"]
		}
	},
	withdrawPayment: {
		url: "withdrawPayment.do",
		type: "update",
		tranargs: {
			args: ["payment.cash", "payment.bank", "payment.checkv"]
		}
	},
	
	pageDecorationPayment: {
		url: "pageDecorationPayment.do",
		demo: true,
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["referMoney", "cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"]
		}]
	},
	queryDecorationPaymentByOrderId: {
		url: "queryDecorationPaymentByOrderId.do",
		demo: true,
		type: "query",
		tranargs: [{
			result: "decorationPayments",
			args: ["referMoney", "cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"]
		}]
	},
	queryDecorationPaymentForNotInitByDrId: {
		url: "queryDecorationPaymentForNotInitByDrId.do",
		type: "query",
		tranargs: [{
			result: "decorationPayments",
			args: ["referMoney"]
		}]
	},
	queryDecoraionReceiptByDrId: {
		url: "queryDecoraionReceiptByDrId.do",
		type: "query",
		tranargs: [{
			result: "decorationReceipt",
			args: ["cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"]
		}]
	},
	queryDecorationPaymentForContractByOrderId: {
		url: "queryDecorationPaymentForContractByOrderId.do",
		type: "query",
		tranargs: [{
			result: "decorationPayments",
			args: ["referMoney", "cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"]
		}]
	},
	checkDecorationPayment: {url: "checkDecorationPayment.do"}, //前台没有用到
	addDecorationPayment: {
		url: "addDecorationPayment.do",
		type: "update",
		tranargs: {
			args: ["decorationPayment.referMoney"]
		}
	},
	updateDecorationPayment: {
		url: "updateDecorationPayment.do",
		type: "update",
		tranargs: {
			args: ["decorationPayment.cash", "decorationPayment.bank", "decorationPayment.checkv", "decorationPayment.advance", "decorationPayment.coupon"]
		}
	},
	collectDecorationPayment: {
		url: "collectDecorationPayment.do",
		type: "update",
		tranargs: {
			args: ["decorationPayment.cash", "decorationPayment.bank", "decorationPayment.checkv", "decorationPayment.advance", "decorationPayment.coupon"]
		}
	},
	refundDecorationPayment: {
		url: "refundDecorationPayment.do",
		type: "update",
		tranargs: {
			args: ["decorationPayment.cash", "decorationPayment.bank", "decorationPayment.checkv", "decorationPayment.advance", "decorationPayment.coupon"]
		}
	},
	confirmDecorationPayment: {url: "confirmDecorationPayment.do"},
	changeDecorationPaymentForTime: {url: "changeDecorationPaymentForTime.do"},	
	exportDecorationPayment: {url: "exportDecorationPayment.do"},

	pageMaterialPayment: {
		url: "pageMaterialPayment.do",
		demo: true,
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["referMoney", "cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"]
		}]
	},
	queryMaterialPaymentByOrderId: {
		url: "queryMaterialPaymentByOrderId.do",
		demo: true,
		type: "query",
		tranargs: [{
			result: "materialPayments",
			args: ["referMoney", "cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"]
		}]
	},
	queryMaterialPaymentByMid: {
		url: "queryMaterialPaymentByMid.do",
		demo: true,
		type: "query",
		tranargs: [{
			result: "materialPayments",
			args: ["referMoney", "cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"]
		}]
	},
	queryMaterialPaymentForNotInitByMrId: {
		url: "queryMaterialPaymentForNotInitByMrId.do",
		type: "query",
		tranargs: [{
			result: "materialPayments",
			args: ["referMoney", "cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"]
		}]
	},
	queryMaterialReceiptByMrId: {
		url: "queryMaterialReceiptByMrId.do",
		type: "query",
		tranargs: [{
			result: "materialReceipt",
			args: ["cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"]
		}]
	},
	checkMaterialPayment: {url: "checkMaterialPayment.do"}, //前台没用到
	addMaterialPaymentForDeposit: {
		url: "addMaterialPaymentForDeposit.do",
		type: "update",
		tranargs: {
			args: ["materialPayment.referMoney"],
			query: [{
				result: "materialPayment",
				args: ["referMoney"]
			}]
		}
	},
	addMaterialPaymentForFullpay: {
		url: "addMaterialPaymentForFullpay.do",
		type: "update",
		tranargs: {
			args: ["materialPayment.referMoney"],
			query: [{
				result: "materialPayment",
				args: ["referMoney"]
			}]
		}
	},
	cancelMaterialPaymentForDeposit: {url: "cancelMaterialPaymentForDeposit.do"},
	cancelMaterialPaymentForFullpay: {url: "cancelMaterialPaymentForFullpay.do"},
	collectMaterialPayment: {
		url: "collectMaterialPayment.do",
		type: "update",
		tranargs: {
			args: ["materialPayment.cash", "materialPayment.bank", "materialPayment.checkv", "materialPayment.advance", "materialPayment.coupon"]
		}
	},
	collectMaterialPayments: {
		url: "collectMaterialPayments.do",
		type: "update",
		tranargs: {
			args: ["materialReceipt.cash", "materialReceipt.bank", "materialReceipt.checkv", "materialReceipt.advance", "materialReceipt.coupon"]
		}
	},
	updateMaterialPayment: {
		url: "updateMaterialPayment.do",
		type: "update",
		tranargs: {
			args: ["materialReceipt.cash", "materialReceipt.bank", "materialReceipt.checkv", "materialReceipt.advance", "materialReceipt.coupon"]
		}
	},
	confirmMaterialPayment: {url: "confirmMaterialPayment.do"},
	refundMaterialPayment: {
		url: "refundMaterialPayment.do",
		type: "update",
		tranargs: {
			args: ["materialPayment.cash", "materialPayment.bank", "materialPayment.checkv", "materialPayment.advance", "materialPayment.coupon"]
		}
	},
	refundMaterialPaymentForDeposit: {url: "refundMaterialPaymentForDeposit.do"}, //前台不需要传参
	refundMaterialPaymentForCoupon: {
		url: "refundMaterialPaymentForCoupon.do",
		type: "update",
		tranargs: {
			args: ["material.coupon"]
		}
	},
	changeMaterialPaymentForTime: {url: "changeMaterialPaymentForTime.do"},	
	exportMaterialPayment: {url: "exportMaterialPayment.do"}, //export这种接口之后再注意下，目前页面功能没用, 所以没修改

	pageSalesPayment: {
		url: "pageSalesPayment.do",
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["referMoney"]
		},{
			result: "paging-data-salesReceipt",
			args: ["cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"]
		}]
	},
	querySalesPaymentBySid: {
		url: "querySalesPaymentBySid.do",
		type: "query",
		tranargs: [{
			result: "salesPayments",
			args: ["referMoney"]
		},{
			result: "salesPayments-salesReceipt",
			args: ["cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"]
		}]
	},
	querySalesPaymentForNotInitBySrid: {
		url: "querySalesPaymentForNotInitBySrid.do",
		type: "query",
		tranargs: [{
			result: "salesPayments",
			args: ["referMoney"]
		},{
			result: "salesPayments-salesReceipt",
			args: ["cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"]
		}]
	},
	querySalesReceiptBySrId: {
		url: "querySalesReceiptBySrId.do",
		type: "query",
		tranargs: [{
			result: "salesReceipt",
			args: ["cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"]
		}]
	},
	querySalesPaymentByOrderId: {
		url: "querySalesPaymentByOrderId.do",
		type: "query",
		tranargs: [{
			result: "salesPayments",
			args: ["referMoney"]
		},{
			result: "salesPayments-salesReceipt",
			args: ["cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"]
		}]
	},
	amountSalesPayment: {
		url: "amountSalesPayment.do",
		type: "query",
		tranargs: [{
			result: "",
			args: ["amount"]
		}]
	},
	addSalesPaymentForDeposit: {
		url: "addSalesPaymentForDeposit.do",
		type: "update",
		tranargs: {
			args: ["salesPayment.referMoney", "salesPayment.sales.cvalue"],
			query: [{
				result: "salesPayment",
				args: ["referMoney"]
			}]
		}
	},
	addSalesPaymentForFullpay: {
		url: "addSalesPaymentForFullpay.do",
		type: "update",
		tranargs: {
			args: ["salesPayment.referMoney"],
			query: [{
				result: "salesPayment",
				args: ["referMoney"]
			}]
		}
	},
	cancelSalesPaymentForDeposit : {url : "cancelSalesPaymentForDeposit.do"},
	cancelSalesPaymentForFullpay : {url : "cancelSalesPaymentForFullpay.do"},
	collectSalesPayment: {
		url: "collectSalesPayment.do",
		type: "update",
		tranargs: {
			args: ["salesReceipt.cash", "salesReceipt.bank", "salesReceipt.checkv", "salesReceipt.advance", "salesReceipt.coupon"]
		}
	},
	collectSalesPayments: {
		url: "collectSalesPayments.do",
		type: "update",
		tranargs: {
			args: ["salesReceipt.cash", "salesReceipt.bank", "salesReceipt.checkv", "salesReceipt.advance", "salesReceipt.coupon"]
		}
	},
	confirmSalesPayment : {url : "confirmSalesPayment.do"},
	cancelSalesPayment : {url : "cancelSalesPayment.do"},
	refundSalesPayment: {
		url: "refundSalesPayment.do",
		type: "update",
		tranargs: {
			args: ["salesReceipt.cash", "salesReceipt.bank", "salesReceipt.checkv", "salesReceipt.advance", "salesReceipt.coupon"]
		}
	},
	refundSalesPaymentForDeposit : {url : "refundSalesPaymentForDeposit.do"}, //这里不需要传值
	refundSalesPaymentForCoupon: {
		url: "refundSalesPaymentForCoupon.do",
		type: "update",
		tranargs: {
			args: ["sales.coupon"]
		}
	},
	updateSalesPayment: {
		url: "updateSalesPayment.do",
		type: "update",
		tranargs: {
			args: ["salesReceipt.cash", "salesReceipt.bank", "salesReceipt.checkv", "salesReceipt.advance", "salesReceipt.coupon"]
		}
	},

	collectServicePayment: {
		url: "collectServicePayment.do",
		type: "update",
		tranargs: {
			args: ["servicePayment.referMoney", "serviceReceipt.cash", "serviceReceipt.bank", "serviceReceipt.checkv", "serviceReceipt.advance"]
		}
	},
	collectServicePaymentForService: {
		url: "collectServicePaymentForService.do",
		type: "update",
		tranargs: {
			args: ["servicePayment.referMoney", "serviceReceipt.cash", "serviceReceipt.bank", "serviceReceipt.checkv", "serviceReceipt.advance"]
		}
	},
	pageServicePayment: {
		url: "pageServicePayment.do",
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["advanceMoney", "serviceMoney"]
		},{
			result: "paging-data-serviceReceipt",
			args: ["cash", "bank", "checkv", "installment", "accounts", "advance"]
		}]
	},
	confirmServicePayment: {url: "confirmServicePayment.do"},
	refundServicePaymentForService: {
		url: "refundServicePaymentForService.do",
		type: "update",
		tranargs: {
			args: ["servicePayment.referMoney", "serviceReceipt.cash", "serviceReceipt.bank", "serviceReceipt.checkv", "serviceReceipt.advance"]
		}
	},
	queryServiceReceiptBySrId: {
		url: "queryServiceReceiptBySrId.do",
		type: "query",
		tranargs: [{
			result: "serviceReceipt",
			args: ["cash", "bank", "checkv", "installment", "accounts", "advance"]
		}]
	},
	queryServicePaymentForNotInitBySrId: {
		url: "queryServicePaymentForNotInitBySrId.do",
		type: "query",
		tranargs: [{
			result: "servicePayments",
			args: ["advanceMoney", "serviceMoney", "referMoney"]
		}]
	},
	queryServicePaymentByOrderId: {
		url: "queryServicePaymentByOrderId.do",
		type: "query",
		tranargs: [{
			result: "servicePayments",
			args: ["advanceMoney", "serviceMoney", "referMoney"]
		}, {
			result: "servicePayments-serviceReceipt",
			args: ["cash", "bank", "checkv", "installment", "accounts", "advance"]
		}]
	},
	updateServicePayment: {
		url: "updateServicePayment.do",
		type: "update",
		tranargs: {
			args: ["servicePayment.referMoney", "serviceReceipt.cash", "serviceReceipt.bank", "serviceReceipt.checkv", "serviceReceipt.advance"]
		}
	},
	
	pageReceipt: {
		url: "pageReceipt.do",
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: []
		}]
	},

	pagePaytran: {
		url: "pagePaytran.do",
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["money"]
		}]
	},
	queryPaytran: {
		url: "queryPaytran.do",
		type: "query",
		tranargs: [{
			result: "paytrans",
			args: ["money"]
		}]
	},
	addPaytran: {
		url: "addPaytran.do",
		type: "update",
		tranargs: {
			args: ["paytran.money"],
			query: [{
                result: "paytran",
                args: ["money"]
            }]
		}
	},
	checkPaytran: {url : "checkPaytran.do"}, //无需要更改数值
	cancelPaytran: {url : "cancelPaytran.do"},
	
	pageActivityPayment: {
		url: "pageActivityPayment.do",
        type: "query",
        tranargs: [{
            result: "paging-data",
            args: ["money","cash","bank","coupon"]
        }]
    },
    queryActivityPaymentByNo: {
		url: "queryActivityPaymentByNo.do",
        type: "query",
        tranargs: [{
            result: "activityPayments",
            args: ["money"]
        }]
    },
    queryActivityPaymentByArid: {
		url: "queryActivityPaymentByArid.do",
        type: "query",
        tranargs: [{
            result: "activityPayments",
            args: ["money"]
        }]
    },
    createActivityPayment: {
		url: "createActivityPayment.do",
        type: "update",
        tranargs: {
            args: ["activityPayment.money"]
        }
    },
    collectActivityPayment: {
		url: "collectActivityPayment.do",
        type: "update",
        tranargs: {
            args: ["activityReceipt.cash","activityReceipt.bank", "activityReceipt.coupon"]
        }
    },
//    deleteActivityPaymentId: {url: "deleteActivityPaymentId.do"},
    countActivityPayment: {url: "countActivityPayment.do"},
    queryActivityReceiptByArid: {
		url: "queryActivityReceiptByArid.do",
        type: "query",
        tranargs: [{
            result: "activityReceipt",
            args: ["cash","bank","coupon"]
        }]
    },

	queryPaymentFunction: {url: "queryPaymentFunction.do"},
	
	pageWallet: {
		url: "pageWallet.do",
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["balance", "amount"]
		}]
	},
	queryWallet: {
		url: "queryWallet.do",
		type: "query",
		tranargs: [{
			result: "wallet",
			args: ["balance", "amount"]
		}]
	},
	applyWallet: {url: "applyWallet.do"},
	bindWallet: {url: "bindWallet.do"},
	updateWallet: {url: "updateWallet.do"},
	confirmWallet: {url: "confirmWallet.do"},
	freezeWallet: {url: "freezeWallet.do"},
	unfreezeWallet: {url: "unfreezeWallet.do"},
	consumeWallet: {
		url: "consumeWallet.do",
		type: "update",
		tranargs: {
			args: ["wallet.amount"]
		}
	},
	rechargeWallet: {
		url: "rechargeWallet.do",
		type: "update",
		tranargs: {
			args: ["wallet.amount"]
		}
	},
	withdrawWallet: {
		url: "withdrawWallet.do",
		type: "update",
		tranargs: {
			args: ["wallet.amount"]
		}
	},
	consentWallet: {url: "consentWallet.do"},
	transferWallet: {
		url: "transferWallet.do",
		type: "update",
		tranargs: {
			args: ["wallet.amount"]
		}
	},
	approveWallet: {url: "approveWallet.do"},
	
	queryWalletard: {url: "queryWalletard.do"},
	bindWalletard: {url: "bindWalletard.do"},
	confirmWalletard: {url: "confirmWalletard.do"},
	unbindWalletard: {url: "unbindWalletard.do"},
	deleteWalletard: {url: "deleteWalletard.do"},

	pageWalletran: {
		url: "pageWalletran.do",
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["amount"]
		}]
	},
	queryWalletran: {
		url: "queryWalletran.do",
		type: "query",
		tranargs: [{
			result: "walletrans",
			args: ["amount"]
		}]
	},

	queryWalletres: {url: "queryWalletres.do"},
	addWalletres: {url: "addWalletres.do"},
	deleteWalletres: {url: "deleteWalletres.do"},

	pagePaymentContract: {url:"pagePaymentContract.do"},
	pollingPaymentContract: {url:"pollingPaymentContract.do"},
	queryPaymentContract: {url: "queryPaymentContract.do"},
	sendPaymentContractForAuth: {url: "sendPaymentContractForAuth.do"},
	sendPaymentContract: {url: "sendPaymentContract.do"},
	redirectPaymentContract: {url: "redirectPaymentContract.do"},
	viewPaymentContract: {url: "viewPaymentContract.do"},
	signPaymentContractForCompany: {url: "signPaymentContractForCompany.do"},
	signPaymentContractForCustomer: {url: "signPaymentContractForCustomer.do"},
	addPaymentContract: {url: "addPaymentContract.do"},
	affixPaymentContract: {url: "affixPaymentContract.do"},
	expirePaymentContract: {url: "expirePaymentContract.do"},
	filingPaymentContract: {url: "filingPaymentContract.do"},
	
	pageKingdeeRecord: {url: "pageKingdeeRecord.do"},
	addKingdeeRecord: {url: "addKingdeeRecord.do"}

}});
