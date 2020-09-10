
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
	pagePaymentForCollect: {
		url: "pagePaymentForCollect.do",
		demo: true,
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["recharge", "balance", "cash", "bank", "checkv", "installment", "accounts", "transfer"]
		}]
	},
	pagePaymentForConfirm: {
		url: "pagePaymentForConfirm.do",
		demo: true,
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["recharge", "balance", "cash", "bank", "checkv", "installment", "accounts", "transfer"]
		}]
	},
	pagePaymentForHistory: {
		url: "pagePaymentForHistory.do",
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
	
	pageDecorationPaymentForCommit: {
		url: "pageDecorationPaymentForCommit.do",
		demo: true,
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["referMoney"]
		}]
	},
	pageDecorationPaymentForCollect: {
		url: "pageDecorationPaymentForCollect.do",
		demo: true,
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["referMoney", "cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"]
		}]
	},
	pageDecorationPaymentForConfirm: {
		url: "pageDecorationPaymentForConfirm.do",
		demo: true,
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["referMoney", "cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"]
		}]
	},
	pageDecorationPaymentForHistory: {
		url: "pageDecorationPaymentForHistory.do",
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
			args: ["decorationPayment.cash", "decorationPayment.bank", "decorationPayment.checkv", "decorationPayment.coupon"]
		}
	},
	confirmDecorationPayment: {url: "confirmDecorationPayment.do"},
	changeDecorationPaymentForTime: {url: "changeDecorationPaymentForTime.do"},	
	exportDecorationPayment: {url: "exportDecorationPayment.do"},

	pageMaterialPaymentForInit: {
		url: "pageMaterialPaymentForInit.do",
		demo: true,
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["referMoney"]
		}]
	},
	pageMaterialPaymentForCollect: {
		url: "pageMaterialPaymentForCollect.do",
		demo: true,
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["referMoney", "cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"]
		}]
	},
	pageMaterialPaymentForConfirm: {
		url: "pageMaterialPaymentForConfirm.do",
		demo: true,
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["referMoney", "cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"]
		}]
	},
	pageMaterialPaymentForNotInit: {
		url: "pageMaterialPaymentForNotInit.do",
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
			args: ["materialPayment.cash", "materialPayment.bank", "materialPayment.checkv", "materialPayment.coupon"]
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
		
	pageSalesPaymentForInit: {
		url: "pageSalesPaymentForInit.do",
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["referMoney"]
		}]
	},
	pageSalesPaymentForCollect: {
		url: "pageSalesPaymentForCollect.do",
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["referMoney"]
		},{
			result: "paging-data-salesReceipt",
			args: ["cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"]
		}]
	},
	pageSalesPaymentForConfirm: {
		url: "pageSalesPaymentForConfirm.do",
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["referMoney"]
		},{
			result: "paging-data-salesReceipt",
			args: ["cash", "bank", "checkv", "installment", "accounts", "advance", "coupon"]
		}]
	},
	pageSalesPaymentForNotInit: {
		url: "pageSalesPaymentForNotInit.do",
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
			args: ["salesReceipt.cash", "salesReceipt.bank", "salesReceipt.checkv", "salesReceipt.coupon"]
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
			args: ["servicePayment.referMoney", "serviceReceipt.cash", "serviceReceipt.bank", "serviceReceipt.checkv"]
		}
	},
	collectServicePaymentForService: {
		url: "collectServicePaymentForService.do",
		type: "update",
		tranargs: {
			args: ["servicePayment.referMoney", "serviceReceipt.cash", "serviceReceipt.bank", "serviceReceipt.checkv"]
		}
	},
	pageServicePaymentForCollect: {
		url: "pageServicePaymentForCollect.do",
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["advanceMoney", "serviceMoney"]
		},{
			result: "paging-data-serviceReceipt",
			args: ["cash", "bank", "checkv", "installment", "accounts"]
		}]
	},
	pageServicePaymentForConfirm: {
		url: "pageServicePaymentForConfirm.do",
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["advanceMoney", "serviceMoney"]
		},{
			result: "paging-data-serviceReceipt",
			args: ["cash", "bank", "checkv", "installment", "accounts"]
		}]
	},
	pageServicePaymentForHistory: {
		url: "pageServicePaymentForHistory.do",
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["advanceMoney", "serviceMoney"]
		},{
			result: "paging-data-serviceReceipt",
			args: ["cash", "bank", "checkv", "installment", "accounts"]
		}]
	},
	confirmServicePayment: {url: "confirmServicePayment.do"},
	refundServicePaymentForService: {
		url: "refundServicePaymentForService.do",
		type: "update",
		tranargs: {
			args: ["servicePayment.referMoney", "serviceReceipt.cash", "serviceReceipt.bank", "serviceReceipt.checkv"]
		}
	},
	queryServiceReceiptBySrId: {
		url: "queryServiceReceiptBySrId.do",
		type: "query",
		tranargs: [{
			result: "serviceReceipt",
			args: ["cash", "bank", "checkv", "installment", "accounts"]
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
			args: ["cash", "bank", "checkv", "installment", "accounts"]
		}]
	},
	updateServicePayment: {
		url: "updateServicePayment.do",
		type: "update",
		tranargs: {
			args: ["servicePayment.referMoney", "serviceReceipt.cash", "serviceReceipt.bank", "serviceReceipt.checkv"]
		}
	},
	
	pageReceipt: {
		url: "pageReceipt.do",
		type: "query",
		tranargs: [{
			result: "paging-data",
			args: ["money"]
		}]
	},
	
	queryPointofsalesByPid: {
		url: "queryPointofsalesByPid.do",
		type: "query",
		tranargs: [{
			result: "pointofsaleses",
			args: ["money"]
		}]
	},
	queryPointofsalesByPidAndRid: {
		url: "queryPointofsalesByPidAndRid.do",
		type: "query",
		tranargs: [{
			result: "pointofsaleses",
			args: ["money"]
		}]
	},
	addPointofsales: {
		url: "addPointofsales.do",
		type: "update",
		tranargs: {
			args: ["pointofsales.money"],
			query: [{
                result: "pointofsales", 
                args: ["money"]
            }]
		}
	},
	checkPointofsales: {url : "checkPointofsales.do"}, //无需要更改数值
	cancelPointofsales: {url : "cancelPointofsales.do"},
	
	pageActivityPayment: {url: "pageActivityPayment.do",
        type: "query",
        tranargs: [{
            result: "paging-data",
            args: ["money","cash","bank","coupon"]
        }]
    },
    queryActivityPaymentByNo: {url: "queryActivityPaymentByNo.do",
        type: "query",
        tranargs: [{
            result: "activityPayments",
            args: ["money"]
        }]
    },
    queryActivityPaymentByArid: {url: "queryActivityPaymentByArid.do",
        type: "query",
        tranargs: [{
            result: "activityPayments",
            args: ["money"]
        }]
    },
    createActivityPayment: {url: "createActivityPayment.do",
        type: "update",
        tranargs: {
            args: ["activityPayment.money"]
        }
    },
    collectActivityPayment: {url: "collectActivityPayment.do",
        type: "update",
        tranargs: {
            args: ["activityReceipt.cash","activityReceipt.bank", "activityReceipt.coupon"]
        }
    },
//    deleteActivityPaymentId: {url: "deleteActivityPaymentId.do"},
    countActivityPayment: {url: "countActivityPayment.do"},
    queryActivityReceiptByArid: {url: "queryActivityReceiptByArid.do",
        type: "query",
        tranargs: [{
            result: "activityReceipt",
            args: ["cash","bank","coupon"]
        }]
    },
}});
