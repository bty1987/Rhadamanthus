$.extend(api.index, {
    messageIndex: {
        url: "/views/information/message.html"
    },
    moreNoticesIndex: {
        url: "/views/information/notice4more.html"
    },
    noticeIndex: {
        url: "/views/information/noticeMng.html"
    },
    activityIndex: {
        url: "/views/information/activity.html"
    },
    activityItemIndex: {
        url: "/views/information/activityItem.html"
    },
    phoneCallIndex: {
        url: "/views/information/phoneCall.html"
    },
    vpaymentReceiptIndex: {
        url: "/views/information/vpaymentReceipt.html"
    },
    activityItem: {
        url: "/views/information/activityItem.html"
    },
    stockRecord: {
        url: "/views/information/stockRecord.html"
    },
    vaward: {
        url: "/views/information/vaward.html"
    },
    vaward2print: {
        url: "/views/information/vaward2print.html"
    },
    plan2create: {
        url: "/views/information/plan2create.html"
    },

});

$.extend(api, {
    information: {
        pageMessage: {
            url: "pageMessage.do",
            demo: true
        },
        queryMessageForUnRead: {
            url: "queryMessageForUnRead.do"
        },
        countMessage: {
            url: "countMessage.do",
            demo: true
        },
        queryMessageByMid: {
            url: "queryMessageByMid.do",
            demo: true
        },
        sendMessage: {
            url: "sendMessage.do"
        },
        updateMessageForRead: {
            url: "updateMessageForRead.do"
        },
        deleteMessageById: {
            url: "deleteMessageById.do"
        },
        deleteMessageByIds: {
            url: "deleteMessageByIds.do"
        },

        pageNotice: {
            url: "pageNotice.do",
            demo: true
        },
        pageNoticeForSeenByType: {
            url: "pageNoticeForSeenByType.do",
            demo: true
        },
        queryNoticeByNid: {
            url: "queryNoticeByNid.do"
        },
        addNotice: {
            url: "addNotice.do"
        },
        updateNotice: {
            url: "updateNotice.do"
        },
        deleteNotice: {
            url: "deleteNotice.do"
        },
        updateNoticeDepartments: {
            url: "updateNoticeDepartments.do"
        },
        queryNoticeDepartment: {
            url: "queryNoticeDepartment.do"
        },
        updateNoticeDepartment: {
            url: "updateNoticeDepartment.do"
        },

        pageActivity: {
            url: "pageActivity.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["multiple"]
            }]
        },
        queryActivityForValid: {
            url: "queryActivityForValid.do",
            demo: true
        },
        queryActivityItemByAid: {
            url: "queryActivityItemByAid.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "activityItems",
                args: ["money", "integral"]
            }]
        },
        queryActivityItemByAiid: {
            url: "queryActivityItemByAiid.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "activityItem",
                args: ["money"]
            }]
        },
        addActivity: {
            url: "addActivity.do",
            type: "update",
            tranargs: {
                args: ["activity.multiple"]
            }
        },
        addActivityItem: {
            url: "addActivityItem.do",
            type: "update",
            tranargs: {
                args: ["activityItem.money", "activityItem.integral"],
                query: [{
                    result: "activityItem",
                    args: ["money", "integral"]
                }]
            }
        },
        updateActivity: {
            url: "updateActivity.do"
        },
        updateActivityForStatus: {
            url: "updateActivityForStatus.do"
        },
        updateActivityForDefault: {
            url: "updateActivityForDefault.do"
        },
        deleteActivityItem: {
            url: "deleteActivityItem.do"
        },

        queryEvent: {
            url: "queryEvent.do",
            demo: true
        },
        addEvent: {
            url: "addEvent.do"
        },
        deleteEvent: {
            url: "deleteEvent.do"
        },

        pagePhoneCall: {
            url: "pagePhoneCall.do"
        },
        phoneCall: {
            url: "phoneCall.do"
        },
        updatePhoneCallForInfo: {
            url: "updatePhoneCallForInfo.do"
        },
        updatePhoneCallForRecord: {
            url: "updatePhoneCallForRecord.do"
        },

        pageVactivity: {
            url: "pageVactivity.do"
        },
        queryVactivity: {
            url: "queryVactivity.do"
        },
        updateVactivityForStatus: {
            url: "updateVactivityForStatus.do"
        },

        updateVactivityForStatus: {
            url: "updateVactivityForStatus.do"
        },
        pageVprize: {
            url: "pageVprize.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["price"]
            }]
        },
        addVprize: {
            url: "addVprize.do",
            type: "update",
            tranargs: {
                args: ["vprize.price"]
            }
        },
        updateVprize: {
            url: "updateVprize.do",
            type: "update",
            tranargs: {
                args: ["vprize.price"]
            }
        },
        updateVprizeForStatus: {
            url: "updateVprizeForStatus.do"
        },

        pageVticket: {
            url: "pageVticket.do"
        },
        pageVticketForBelonger: {
            url: "pageVticketForBelonger.do"
        },
        countVticket: {
            url: "countVticket.do"
        },
        createVticket: {
            url: "createVticket.do"
        },
        updateVticket: {
            url: "updateVticket.do"
        },

        pageVpayment: {
            url: "pageVpayment.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["money", "cash", "bank", "coupon"]
            }]
        },
        countVpayment: {
            url: "countVpayment.do"
        },
        createVpayment: {
            url: "createVpayment.do",
            type: "update",
            tranargs: {
                args: ["vpayment.money"]
            }
        },
        deleteVpaymentId: {
            url: "deleteVpaymentId.do"
        },
        collectVpayment: {
            url: "collectVpayment.do",
            type: "update",
            tranargs: {
                args: ["vreceipt.cash", "vreceipt.bank", "vreceipt.coupon"]
            }
        },
        queryVpaymentByNo: {
            url: "queryVpaymentByNo.do",
            type: "query",
            tranargs: [{
                result: "vpayments",
                args: ["money"]
            }]
        },
        queryVpaymentByVrid: {
            url: "queryVpaymentByVrid.do",
            type: "query",
            tranargs: [{
                result: "vpayments",
                args: ["money"]
            }]
        },
        queryVreceiptByVrid: {
            url: "queryVreceiptByVrid.do",
            type: "query",
            tranargs: [{
                result: "vreceipt",
                args: ["cash", "bank", "coupon"]
            }]
        },
        queryVawardByNo: {
            url: "queryVawardByNo.do",
            type: "query",
            tranargs: [{
                result: "vawards",
                args: ["price", "num"]
            }]
        },

        pagePlan: {
            url: "pagePlan.do"
        },
        existPlan: {
            url: "existPlan.do"
        },
        createPlan: {
            url: "createPlan.do"
        },
        cancelPlan: {
            url: "cancelPlan.do"
        },
        updatePlan: {
            url: "updatePlan.do"
        },

        pageAwardStock: {
            url: "pageAwardStock.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["unitPrice", "purchase", "selling", "num"]
            }]
        },// 分页
        queryAwardStockByAsid: {
            url: "queryAwardStockByAsid.do",
            demo: true,
            tranargs: [{
                result: "paging-data",
                args: ["unitPrice", "purchase", "selling", "num"]
            }]
        }, // 根据asid查
        queryAwardStockByType: {
            url: "queryAwardStockByType.do",
            demo: true,
            tranargs: [{
                result: "paging-data",
                args: ["unitPrice", "purchase", "selling", "num"]
            }]
        }, // 根据type查
        queryAwardStockByName: {
            url: "queryAwardStockByName.do"
        },
        addAwardStock: {
            url: "addAwardStock.do",
            demo: true,
            type: "update",
            tranargs: {
                args: ["awardStock.price", "awardStock.unitPrice", "awardStock.purchase", "awardStock.selling", "awardStock.num"]
            }
        },// 添加
        updateAwardStock: {
            url: "updateAwardStock.do",
            demo: true,
            type: "update",
            tranargs: {
                args: ["awardStock.price", "awardStock.unitPrice", "awardStock.purchase", "awardStock.selling", "awardStock.num"]
            }
        },// 编辑
        updateAwardStockForXG: {
            url: "updateAwardStockForXG.do",
            demo: true,
            type: "update",
            tranargs: {
                args: ["awardStock.price", "awardStock.unitPrice", "awardStock.purchase", "awardStock.selling", "awardStock.num"]
            }
        },// 出库
        updateAwardStockForCG: {
            url: "updateAwardStockForCG.do",
            demo: true,
            type: "update",
            tranargs: {
                args: ["awardStock.price", "awardStock.unitPrice", "awardStock.purchase", "awardStock.selling", "awardStock.num"]
            }
        },// 入库
        checkAwardStock: {
            url: "checkAwardStock.do",
            demo: true,
            type: "update",
            tranargs: {
                args: ["awardStock.price", "awardStock.unitPrice", "awardStock.purchase", "awardStock.selling", "awardStock.num"]
            }
        },// 盘点
        updateAwardStockForStatus: {
            url: "updateAwardStockForStatus.do",
            demo: true
        },// 修改状态

        pageAwardRecord: {
            url: "pageAwardRecord.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["totalPrice", "unitPrice", "num"]
            }]
        },
        deleteVaward: {
            url: "deleteVaward.do"
        },
        countVaward: {
            url: "countVaward.do"
        },

        pageWorksheet: {
            url: "pageWorksheet.do",
            demo: true
        },
        queryWorksheet: {
            url: "queryWorksheet.do",
            demo: true
        },
        addWorksheet: {
            url: "addWorksheet.do",
            demo: true
        },
        updateWorksheet: {
            url: "updateWorksheet.do",
            demo: true
        },
        cancelWorksheet: {
            url: "cancelWorksheet.do",
            demo: true
        },
        handleWorksheet: {
            url: "handleWorksheet.do",
            demo: true
        },
        finishWorksheet: {
            url: "finishWorksheet.do",
            demo: true
        },

        pageAwardPurchase: {
            url: "pageAwardPurchase.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["inprice", "baprice", "num", "surplus"]
            }]
        },
        queryAwardPurchaseByFapid: {
            url: "queryAwardPurchaseByFapid.do",
            type: "query",
            tranargs: [{
                result: "awardPurchases",
                args: ["inprice", "baprice", "num", "surplus"]
            }]
        },
        addAwardPurchase: {
            url: "addAwardPurchase.do",
            type: "update",
            tranargs: {
                args: ["awardPurchase.num"]
            }
        },
        purchaseAwardPurchase: {
            url: "purchaseAwardPurchase.do",
            type: "update",
            tranargs: {
                args: ["awardPurchase.inprice"]
            }
        },
        instoreAwardPurchase: {
            url: "instoreAwardPurchase.do",
            demo: true,
            type: "update",
            tranargs: {
                args: ["awardPurchase.inprice", "awardPurchase.num"]
            }
        },
        balanceAwardPurchase: {
            url: "balanceAwardPurchase.do",
            type: "update",
            tranargs: {
                args: ["awardPurchase.baprice"]
            }
        },
        cancelAwardPurchase: {
            url: "cancelAwardPurchase.do",
            demo: true
        },
    }
});
