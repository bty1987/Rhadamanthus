$.extend(api.index, {
    messageIndex: {url: "/views/information/messageMng.html"},
    moreNoticesIndex: {url: "/views/information/moreNotices.html"},
    noticeIndex: {url: "/views/information/noticeMng.html"},
    activityIndex: {url: "/views/information/activity.html"},
    activityItemIndex: {url: "/views/information/activityItem.html"},
    phoneCallIndex: {url: "/views/information/phoneCall.html"},
    vpaymentReceiptIndex: {url: "/views/information/vpaymentReceipt.html"}
});

$.extend(api, {
    information: {
        pageMessage: {url: "pageMessage.do", demo: true},
        queryMessageForUnRead: {url: "queryMessageForUnRead.do"},
        countMessage: {url: "countMessage.do", demo: true},
        queryMessageByMid: {url: "queryMessageByMid.do", demo: true},
        sendMessage: {url: "sendMessage.do"},
        updateMessageForRead: {url: "updateMessageForRead.do"},
        deleteMessageById: {url: "deleteMessageById.do"},
        deleteMessageByIds: {url: "deleteMessageByIds.do"},

        pageNotice: {url: "pageNotice.do", demo: true},
        pageNoticeForSeenByType: {url: "pageNoticeForSeenByType.do", demo: true},
        queryNoticeByNid: {url: "queryNoticeByNid.do"},
        addNotice: {url: "addNotice.do"},
        updateNotice: {url: "updateNotice.do"},
        deleteNotice: {url: "deleteNotice.do"},
        updateNoticeDepartments: {url: "updateNoticeDepartments.do"},
        queryNoticeDepartment: {url: "queryNoticeDepartment.do"},
        updateNoticeDepartment: {url: "updateNoticeDepartment.do"},

        pageActivity: {url: "pageActivity.do", demo: true},
        queryActivityForValid: {url: "queryActivityForValid.do", demo: true},
        queryActivityItemByAid: {url: "queryActivityItemByAid.do", demo: true},
        addActivity: {url: "addActivity.do"},
        addActivityItem: {url: "addActivityItem.do"},
        updateActivity: {url: "updateActivity.do"},
        updateActivityForStatus:{url: "updateActivityForStatus.do"},
        updateActivityForDefault:{url: "updateActivityForDefault.do"},
        deleteActivityItemByAiid: {url: "deleteActivityItemByAiid.do"},

        queryEvent: {url: "queryEvent.do", demo: true},
        addEvent: {url: "addEvent.do"},
        deleteEvent: {url: "deleteEvent.do"},

        pagePhoneCall: {url: "pagePhoneCall.do"},
        phoneCall: {url: "phoneCall.do"},
        updatePhoneCallForInfo: {url: "updatePhoneCallForInfo.do"},
        updatePhoneCallForRecord: {url: "updatePhoneCallForRecord.do"},
        
        pageVactivity: {url: "pageVactivity.do"},
        queryVactivity: {url: "queryVactivity.do"},
        
        pageVprize: {url: "pageVprize.do"},
        addVprize: {url: "addVprize.do"},
        updateVprize: {url: "updateVprize.do"},
        updateVprizeForStatus: {url: "updateVprizeForStatus.do"},

        pageVticket: {url: "pageVticket.do"},
        pageVticketForBelonger: {url: "pageVticketForBelonger.do"},
        countVticket: {url: "countVticket.do"},
        createVticket: {url: "createVticket.do"},
        updateVticket: {url: "updateVticket.do"},

        pageVpayment: {url: "pageVpayment.do"},
        countVpayment: {url: "countVpayment.do"},
        createVpayment: {url: "createVpayment.do"},
        deleteVpaymentId: {url: "deleteVpaymentId.do"},
        collectVpayment: {url: "collectVpayment.do"},
        queryVpaymentByNo: {url: "queryVpaymentByNo.do"},
        queryVpaymentByVrid: {url: "queryVpaymentByVrid.do"},
        queryVreceiptByVrid: {url: "queryVreceiptByVrid.do"},

        pageTask: {url: "pageTask.do"},
        queryTask: {url: "queryTask.do"},

        addTask: {url: "addTask.do"},
        updateTaskForStatus: {url: "updateTaskForStatus.do"},
        updateTaskForIsShow: {url: "updateTaskForIsShow.do"},

        pagePlan: {url: "pagePlan.do"},
        createPlan: {url: "createPlan.do"},
        cancelPlan: {url: "cancelPlan.do"},
        updatePlan: {url: "updatePlan.do"},

        pageAwardStock: {url: "pageAwardStock.do", demo: true},//分页
        queryAwardStockByAsid:{url:"queryAwardStockByAsid.do", demo: true},//根据asid查
        queryAwardStockByType:{url:"queryAwardStockByType.do", demo: true},//根据type查
        addAwardStock:{url:"addAwardStock.do", demo: true},//添加
        updateAwardStock:{url:"updateAwardStock.do", demo: true},//编辑
        updateAwardStockForXG:{url:"updateAwardStockForXG.do", demo: true},//出库
        updateAwardStockForCG:{url:"updateAwardStockForCG.do", demo: true},//入库
        checkAwardStock:{url:"checkAwardStock.do", demo: true},//盘点
        updateAwardStockForStatus:{url:"updateAwardStockForStatus.do", demo: true},//修改状态

        pageAwardRecord: {url: "pageAwardRecord.do", demo: true},

        pageWorksheet: {url: "pageWorksheet.do", demo: true},
        addWorksheet: {url: "addWorksheet.do", demo: true},
        cancelWorksheet: {url: "cancelWorksheet.do", demo: true},
        handleWorksheet: {url: "handleWorksheet.do", demo: true}
    }
});
